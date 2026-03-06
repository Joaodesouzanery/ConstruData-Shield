/**
 * Temporal activity definitions for ConstruData Shield.
 *
 * Thin wrappers around services that handle heartbeat, error classification,
 * and the Temporal-specific boundary. Business logic lives in services/.
 */

import { heartbeat, ApplicationFailure } from '@temporalio/activity';
import { AgentExecutionService } from '../services/agent-execution.js';
import { checkExploitationQueue as checkQueue } from '../services/exploitation-checker.js';
import { loadConfig } from '../services/config-loader.js';
import { classifyErrorType, PentestError } from '../services/error-handling.js';
import { isErr } from '../types/result.js';
import type { AgentMetrics } from '../types/metrics.js';
import type { AgentName, VulnType } from '../types/agents.js';
import type { ActivityLogger } from '../types/activity-logger.js';

/** Input type for all activities */
export interface ActivityInput {
  webUrl: string;
  repoPath: string;
  workflowId: string;
  sessionId: string;
  configPath?: string;
  outputPath?: string;
  pipelineTestingMode?: boolean;
}

// Create a console-based logger for activities
function createActivityLogger(): ActivityLogger {
  return {
    info: (msg, meta) => {
      console.log(`[INFO] ${msg}`, meta ? JSON.stringify(meta) : '');
      heartbeat();
    },
    warn: (msg, meta) => {
      console.warn(`[WARN] ${msg}`, meta ? JSON.stringify(meta) : '');
      heartbeat();
    },
    error: (msg, meta) => {
      console.error(`[ERROR] ${msg}`, meta ? JSON.stringify(meta) : '');
      heartbeat();
    },
    debug: (msg, meta) => {
      console.debug(`[DEBUG] ${msg}`, meta ? JSON.stringify(meta) : '');
    },
  };
}

/** Wrap agent execution with Temporal error classification */
async function executeAgent(
  agentName: AgentName,
  input: ActivityInput
): Promise<AgentMetrics> {
  const logger = createActivityLogger();
  const service = new AgentExecutionService();

  // Load config if specified
  if (input.configPath) {
    const configResult = await loadConfig(input.configPath);
    if (isErr(configResult)) {
      throw configResult.error;
    }
    service.setConfig(configResult.value);
  }

  try {
    const endResult = await service.executeOrThrow(
      agentName,
      {
        webUrl: input.webUrl,
        repoPath: input.repoPath,
        configPath: input.configPath,
        pipelineTestingMode: input.pipelineTestingMode,
        attemptNumber: 1,
      },
      logger
    );

    return {
      durationMs: endResult.duration_ms,
      inputTokens: null,
      outputTokens: null,
      costUsd: endResult.cost_usd,
      numTurns: null,
      model: endResult.model,
    };
  } catch (error) {
    const errorType = classifyErrorType(error);
    const isRetryable = error instanceof PentestError ? error.retryable : true;

    throw ApplicationFailure.create({
      message: error instanceof Error ? error.message : String(error),
      type: errorType,
      nonRetryable: !isRetryable,
    });
  }
}

// === Preflight ===

export async function runPreflightValidation(input: ActivityInput): Promise<void> {
  const logger = createActivityLogger();
  logger.info(`Preflight validation for ${input.webUrl}`);

  // Validate repo exists
  const { fs } = await import('zx');
  if (!(await fs.pathExists(input.repoPath))) {
    throw ApplicationFailure.create({
      message: `Repository not found: ${input.repoPath}`,
      type: 'ConfigurationError',
      nonRetryable: true,
    });
  }

  // Validate config if specified
  if (input.configPath) {
    const result = await loadConfig(input.configPath);
    if (isErr(result)) {
      throw ApplicationFailure.create({
        message: result.error.message,
        type: 'ConfigurationError',
        nonRetryable: true,
      });
    }
  }

  logger.info('Preflight validation passed');
}

// === Phase 1: Pre-Reconnaissance ===
export async function runPreReconAgent(input: ActivityInput): Promise<AgentMetrics> {
  return executeAgent('pre-recon', input);
}

// === Phase 2: Reconnaissance ===
export async function runReconAgent(input: ActivityInput): Promise<AgentMetrics> {
  return executeAgent('recon', input);
}

// === Phase 3: Vulnerability Analysis ===
export async function runInjectionVulnAgent(input: ActivityInput): Promise<AgentMetrics> {
  return executeAgent('injection-vuln', input);
}

export async function runXssVulnAgent(input: ActivityInput): Promise<AgentMetrics> {
  return executeAgent('xss-vuln', input);
}

export async function runAuthVulnAgent(input: ActivityInput): Promise<AgentMetrics> {
  return executeAgent('auth-vuln', input);
}

export async function runSsrfVulnAgent(input: ActivityInput): Promise<AgentMetrics> {
  return executeAgent('ssrf-vuln', input);
}

export async function runAuthzVulnAgent(input: ActivityInput): Promise<AgentMetrics> {
  return executeAgent('authz-vuln', input);
}

// === Phase 4: Exploitation ===
export async function runInjectionExploitAgent(input: ActivityInput): Promise<AgentMetrics> {
  return executeAgent('injection-exploit', input);
}

export async function runXssExploitAgent(input: ActivityInput): Promise<AgentMetrics> {
  return executeAgent('xss-exploit', input);
}

export async function runAuthExploitAgent(input: ActivityInput): Promise<AgentMetrics> {
  return executeAgent('auth-exploit', input);
}

export async function runSsrfExploitAgent(input: ActivityInput): Promise<AgentMetrics> {
  return executeAgent('ssrf-exploit', input);
}

export async function runAuthzExploitAgent(input: ActivityInput): Promise<AgentMetrics> {
  return executeAgent('authz-exploit', input);
}

// === Exploitation Queue Check ===
export async function checkExploitationQueue(
  input: ActivityInput,
  vulnType: VulnType
): Promise<{ shouldExploit: boolean; vulnerabilityCount: number }> {
  return checkQueue(input.repoPath, vulnType);
}

// === Phase 5: Reporting ===
export async function runReportAgent(input: ActivityInput): Promise<AgentMetrics> {
  return executeAgent('report', input);
}
