/**
 * Claude Agent SDK executor for ConstruData Shield.
 *
 * Handles message streaming, progress tracking, audit logging,
 * and MCP server configuration for each agent execution.
 */

import { fs, path } from 'zx';
import { query } from '@anthropic-ai/claude-agent-sdk';

import { isRetryableError, PentestError } from '../services/error-handling.js';
import { isSpendingCapBehavior } from '../utils/billing-detection.js';
import { Timer } from '../utils/metrics.js';
import { formatTimestamp } from '../utils/formatting.js';
import { AGENT_VALIDATORS, MCP_AGENT_MAPPING } from '../session-manager.js';
import { AGENTS } from '../session-manager.js';
import { resolveModel } from './models.js';
import type { ModelTier } from '../types/agents.js';
import type { AgentName } from '../types/index.js';
import type { ActivityLogger } from '../types/activity-logger.js';

export interface ClaudePromptResult {
  result?: string | null | undefined;
  success: boolean;
  duration: number;
  turns?: number | undefined;
  cost: number;
  model?: string | undefined;
  partialCost?: number | undefined;
  apiErrorDetected?: boolean | undefined;
  error?: string | undefined;
  errorType?: string | undefined;
  prompt?: string | undefined;
  retryable?: boolean | undefined;
}

interface StdioMcpServer {
  type: 'stdio';
  command: string;
  args: string[];
  env: Record<string, string>;
}

/** Configure MCP servers for agent execution */
function buildMcpServers(
  sourceDir: string,
  agentName: string | null,
  logger: ActivityLogger
): Record<string, StdioMcpServer> {
  const mcpServers: Record<string, StdioMcpServer> = {};

  if (!agentName) return mcpServers;

  const promptTemplate = AGENTS[agentName as AgentName].promptTemplate;
  const playwrightMcpName = MCP_AGENT_MAPPING[promptTemplate as keyof typeof MCP_AGENT_MAPPING] || null;

  if (playwrightMcpName) {
    logger.info(`Assigned ${agentName} -> ${playwrightMcpName}`);

    const userDataDir = `/tmp/${playwrightMcpName}`;
    const isDocker = process.env.SHIELD_DOCKER === 'true';

    const mcpArgs: string[] = [
      '@playwright/mcp@latest',
      '--isolated',
      '--user-data-dir', userDataDir,
    ];

    if (isDocker) {
      mcpArgs.push('--executable-path', '/usr/bin/chromium-browser');
      mcpArgs.push('--browser', 'chromium');
    }

    const envVars: Record<string, string> = Object.fromEntries(
      Object.entries({
        ...process.env,
        PLAYWRIGHT_HEADLESS: 'true',
        ...(isDocker && { PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: '1' }),
      }).filter((entry): entry is [string, string] => entry[1] !== undefined)
    );

    mcpServers[playwrightMcpName] = {
      type: 'stdio' as const,
      command: 'npx',
      args: mcpArgs,
      env: envVars,
    };
  }

  return mcpServers;
}

/** Write error details to a log file */
async function writeErrorLog(
  err: Error & { code?: string; status?: number },
  sourceDir: string,
  fullPrompt: string,
  duration: number
): Promise<void> {
  try {
    const errorLog = {
      timestamp: formatTimestamp(),
      agent: 'claude-executor',
      error: {
        name: err.constructor.name,
        message: err.message,
        code: err.code,
        status: err.status,
        stack: err.stack,
      },
      context: {
        sourceDir,
        prompt: fullPrompt.slice(0, 200) + '...',
        retryable: isRetryableError(err),
      },
      duration,
    };
    const logPath = path.join(sourceDir, 'error.log');
    await fs.appendFile(logPath, JSON.stringify(errorLog) + '\n');
  } catch {
    // Best-effort error log writing
  }
}

/** Validate agent output using registered validators */
export async function validateAgentOutput(
  result: ClaudePromptResult,
  agentName: string | null,
  sourceDir: string,
  logger: ActivityLogger
): Promise<boolean> {
  logger.info(`Validating ${agentName} agent output`);

  if (!result.success || !result.result) {
    logger.error('Validation failed: Agent execution was unsuccessful');
    return false;
  }

  const validator = agentName ? AGENT_VALIDATORS[agentName as keyof typeof AGENT_VALIDATORS] : undefined;

  if (!validator) {
    logger.warn(`No validator found for agent "${agentName}" - assuming success`);
    return true;
  }

  const validationResult = await validator(sourceDir, logger);

  if (validationResult) {
    logger.info('Validation passed: Required files present');
  } else {
    logger.error('Validation failed: Missing required deliverable files');
  }

  return validationResult;
}

/** Execute a Claude Agent SDK query with full lifecycle management */
export async function runClaudePrompt(
  prompt: string,
  sourceDir: string,
  context: string = '',
  description: string = 'Claude analysis',
  agentName: string | null = null,
  logger: ActivityLogger,
  modelTier: ModelTier = 'medium'
): Promise<ClaudePromptResult> {
  const timer = new Timer(`agent-${description.toLowerCase().replace(/\s+/g, '-')}`);
  const fullPrompt = context ? `${context}\n\n${prompt}` : prompt;

  logger.info(`Running ConstruData Shield agent: ${description}...`);

  // Configure MCP servers
  const mcpServers = buildMcpServers(sourceDir, agentName, logger);

  // Build env vars for SDK subprocesses
  const sdkEnv: Record<string, string> = {
    CLAUDE_CODE_MAX_OUTPUT_TOKENS: process.env.CLAUDE_CODE_MAX_OUTPUT_TOKENS || '64000',
  };
  const passthroughVars = [
    'ANTHROPIC_API_KEY',
    'CLAUDE_CODE_OAUTH_TOKEN',
    'ANTHROPIC_BASE_URL',
    'ANTHROPIC_AUTH_TOKEN',
    'CLAUDE_CODE_USE_BEDROCK',
    'AWS_REGION',
    'AWS_BEARER_TOKEN_BEDROCK',
    'CLAUDE_CODE_USE_VERTEX',
    'CLOUD_ML_REGION',
    'ANTHROPIC_VERTEX_PROJECT_ID',
    'GOOGLE_APPLICATION_CREDENTIALS',
    'ANTHROPIC_SMALL_MODEL',
    'ANTHROPIC_MEDIUM_MODEL',
    'ANTHROPIC_LARGE_MODEL',
  ];
  for (const name of passthroughVars) {
    if (process.env[name]) {
      sdkEnv[name] = process.env[name]!;
    }
  }

  // Configure SDK options
  const options = {
    model: resolveModel(modelTier),
    maxTurns: 10_000,
    cwd: sourceDir,
    permissionMode: 'bypassPermissions' as const,
    allowDangerouslySkipPermissions: true,
    mcpServers,
    env: sdkEnv,
  };

  logger.info(`SDK Options: maxTurns=${options.maxTurns}, cwd=${sourceDir}, model=${options.model}`);

  let turnCount = 0;
  let result: string | null = null;
  let totalCost = 0;
  let model: string | undefined;

  try {
    // Process the message stream
    for await (const message of query({ prompt: fullPrompt, options })) {
      if (message.type === 'assistant') {
        turnCount++;
      }

      // Handle result message
      if (message.type === 'result') {
        const resultMsg = message as { type: 'result'; result?: string; cost?: number };
        result = resultMsg.result ?? null;
        totalCost = resultMsg.cost ?? 0;
        break;
      }

      // Capture model from init message
      if (message.type === 'system' && 'model' in message) {
        model = (message as { model: string }).model;
      }
    }

    // Spending cap safeguard
    if (isSpendingCapBehavior(turnCount, totalCost, result || '')) {
      throw new PentestError(
        `Spending cap likely reached (turns=${turnCount}, cost=$0): ${result?.slice(0, 100)}`,
        'billing',
        true,
        {},
        'SPENDING_CAP_REACHED' as any
      );
    }

    const duration = timer.stop();

    return {
      result,
      success: true,
      duration,
      turns: turnCount,
      cost: totalCost,
      model,
      partialCost: totalCost,
    };
  } catch (error) {
    const duration = timer.stop();
    const err = error as Error & { code?: string; status?: number };

    await writeErrorLog(err, sourceDir, fullPrompt, duration);

    return {
      error: err.message,
      errorType: err.constructor.name,
      prompt: fullPrompt.slice(0, 100) + '...',
      success: false,
      duration,
      cost: totalCost,
      retryable: isRetryableError(err),
    };
  }
}
