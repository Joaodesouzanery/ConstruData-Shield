/**
 * Agent Execution Service
 *
 * Full agent lifecycle: config load, prompt load, git checkpoint,
 * Claude SDK execution, validation, and commit.
 * No Temporal dependencies - pure domain logic.
 */

import type { ActivityLogger } from '../types/activity-logger.js';
import { Result, ok, err, isErr } from '../types/result.js';
import { ErrorCode } from '../types/errors.js';
import { PentestError } from './error-handling.js';
import { isSpendingCapBehavior } from '../utils/billing-detection.js';
import { AGENTS } from '../session-manager.js';
import { loadPrompt } from './prompt-manager.js';
import { runClaudePrompt, validateAgentOutput, type ClaudePromptResult } from '../ai/claude-executor.js';
import { createGitCheckpoint, commitGitSuccess, rollbackGitWorkspace, getGitCommitHash } from './git-manager.js';
import type { AgentEndResult } from '../types/audit.js';
import type { AgentName } from '../types/agents.js';
import type { AgentMetrics } from '../types/metrics.js';
import type { ShieldConfig } from '../types/config.js';

export interface AgentExecutionInput {
  webUrl: string;
  repoPath: string;
  configPath?: string | undefined;
  pipelineTestingMode?: boolean | undefined;
  attemptNumber: number;
}

export class AgentExecutionService {
  private config: ShieldConfig | null = null;

  setConfig(config: ShieldConfig | null): void {
    this.config = config;
  }

  /** Execute an agent with full lifecycle management */
  async execute(
    agentName: AgentName,
    input: AgentExecutionInput,
    logger: ActivityLogger
  ): Promise<Result<AgentEndResult, PentestError>> {
    const { webUrl, repoPath, pipelineTestingMode = false, attemptNumber } = input;

    // 1. Load prompt
    const promptTemplate = AGENTS[agentName].promptTemplate;
    let prompt: string;
    try {
      prompt = await loadPrompt(
        promptTemplate,
        { webUrl, repoPath },
        this.config,
        pipelineTestingMode,
        logger
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return err(
        new PentestError(
          `Failed to load prompt for ${agentName}: ${errorMessage}`,
          'prompt',
          false,
          { agentName, promptTemplate, originalError: errorMessage },
          ErrorCode.PROMPT_LOAD_FAILED
        )
      );
    }

    // 2. Create git checkpoint
    try {
      await createGitCheckpoint(repoPath, agentName, attemptNumber, logger);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return err(
        new PentestError(
          `Git checkpoint failed for ${agentName}: ${errorMessage}`,
          'filesystem',
          false,
          { agentName, repoPath },
          ErrorCode.GIT_CHECKPOINT_FAILED
        )
      );
    }

    // 3. Execute agent via Claude SDK
    const result: ClaudePromptResult = await runClaudePrompt(
      prompt,
      repoPath,
      '',
      agentName,
      agentName,
      logger,
      AGENTS[agentName].modelTier
    );

    // 4. Spending cap check
    if (result.success && (result.turns ?? 0) <= 2 && (result.cost || 0) === 0) {
      const resultText = result.result || '';
      if (isSpendingCapBehavior(result.turns ?? 0, result.cost || 0, resultText)) {
        await rollbackGitWorkspace(repoPath, 'spending cap detected', logger);
        return err(
          new PentestError(
            `Spending cap likely reached: ${resultText.slice(0, 100)}`,
            'billing',
            true,
            { agentName, turns: result.turns, cost: result.cost },
            ErrorCode.SPENDING_CAP_REACHED
          )
        );
      }
    }

    // 5. Handle execution failure
    if (!result.success) {
      await rollbackGitWorkspace(repoPath, 'execution failure', logger);
      return err(
        new PentestError(
          result.error || 'Agent execution failed',
          'validation',
          result.retryable ?? true,
          { agentName, originalError: result.error },
          ErrorCode.AGENT_EXECUTION_FAILED
        )
      );
    }

    // 6. Validate output
    const validationPassed = await validateAgentOutput(result, agentName, repoPath, logger);
    if (!validationPassed) {
      await rollbackGitWorkspace(repoPath, 'validation failure', logger);
      return err(
        new PentestError(
          `Agent ${agentName} failed output validation`,
          'validation',
          true,
          { agentName, deliverableFilename: AGENTS[agentName].deliverableFilename },
          ErrorCode.OUTPUT_VALIDATION_FAILED
        )
      );
    }

    // 7. Success - commit and return
    await commitGitSuccess(repoPath, agentName, logger);
    const commitHash = await getGitCommitHash(repoPath);

    const endResult: AgentEndResult = {
      attemptNumber,
      duration_ms: result.duration,
      cost_usd: result.cost || 0,
      success: true,
      model: result.model,
      ...(commitHash && { checkpoint: commitHash }),
    };

    return ok(endResult);
  }

  /** Execute an agent, throwing PentestError on failure */
  async executeOrThrow(
    agentName: AgentName,
    input: AgentExecutionInput,
    logger: ActivityLogger
  ): Promise<AgentEndResult> {
    const result = await this.execute(agentName, input, logger);
    if (isErr(result)) {
      throw result.error;
    }
    return result.value;
  }

  /** Convert AgentEndResult to AgentMetrics */
  static toMetrics(endResult: AgentEndResult, result: ClaudePromptResult): AgentMetrics {
    return {
      durationMs: endResult.duration_ms,
      inputTokens: null,
      outputTokens: null,
      costUsd: endResult.cost_usd,
      numTurns: result.turns ?? null,
      model: result.model,
    };
  }
}
