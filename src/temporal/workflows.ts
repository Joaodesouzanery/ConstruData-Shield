/**
 * Temporal workflow for ConstruData Shield pentest pipeline.
 *
 * Orchestrates the security testing workflow:
 * 1. Pre-Reconnaissance (sequential)
 * 2. Reconnaissance (sequential)
 * 3-4. Vulnerability + Exploitation (5 pipelined pairs in parallel)
 * 5. Reporting (sequential)
 */

import {
  log,
  proxyActivities,
  setHandler,
  workflowInfo,
} from '@temporalio/workflow';
import type * as activities from './activities.js';
import type { ActivityInput } from './activities.js';
import {
  getProgress,
  type PipelineInput,
  type PipelineState,
  type PipelineProgress,
  type PipelineSummary,
  type VulnExploitPipelineResult,
} from './shared.js';
import type { AgentName, VulnType } from '../types/agents.js';
import type { AgentMetrics } from '../types/metrics.js';

// Production retry configuration
const PRODUCTION_RETRY = {
  initialInterval: '5 minutes',
  maximumInterval: '30 minutes',
  backoffCoefficient: 2,
  maximumAttempts: 50,
  nonRetryableErrorTypes: [
    'AuthenticationError',
    'PermissionError',
    'InvalidRequestError',
    'RequestTooLargeError',
    'ConfigurationError',
  ],
};

const TESTING_RETRY = {
  initialInterval: '10 seconds',
  maximumInterval: '30 seconds',
  backoffCoefficient: 2,
  maximumAttempts: 5,
  nonRetryableErrorTypes: PRODUCTION_RETRY.nonRetryableErrorTypes,
};

const SUBSCRIPTION_RETRY = {
  initialInterval: '5 minutes',
  maximumInterval: '6 hours',
  backoffCoefficient: 2,
  maximumAttempts: 100,
  nonRetryableErrorTypes: PRODUCTION_RETRY.nonRetryableErrorTypes,
};

// Activity proxies with different retry configurations
const acts = proxyActivities<typeof activities>({
  startToCloseTimeout: '2 hours',
  heartbeatTimeout: '60 minutes',
  retry: PRODUCTION_RETRY,
});

const testActs = proxyActivities<typeof activities>({
  startToCloseTimeout: '30 minutes',
  heartbeatTimeout: '30 minutes',
  retry: TESTING_RETRY,
});

const subscriptionActs = proxyActivities<typeof activities>({
  startToCloseTimeout: '8 hours',
  heartbeatTimeout: '2 hours',
  retry: SUBSCRIPTION_RETRY,
});

const preflightActs = proxyActivities<typeof activities>({
  startToCloseTimeout: '2 minutes',
  heartbeatTimeout: '2 minutes',
  retry: {
    initialInterval: '10 seconds',
    maximumInterval: '1 minute',
    backoffCoefficient: 2,
    maximumAttempts: 3,
    nonRetryableErrorTypes: PRODUCTION_RETRY.nonRetryableErrorTypes,
  },
});

/** Compute aggregated metrics */
function computeSummary(state: PipelineState): PipelineSummary {
  const metrics = Object.values(state.agentMetrics);
  return {
    totalCostUsd: metrics.reduce((sum, m) => sum + (m.costUsd ?? 0), 0),
    totalDurationMs: Date.now() - state.startTime,
    totalTurns: metrics.reduce((sum, m) => sum + (m.numTurns ?? 0), 0),
    agentCount: state.completedAgents.length,
  };
}

export async function pentestPipelineWorkflow(
  input: PipelineInput
): Promise<PipelineState> {
  const { workflowId } = workflowInfo();

  // Select activity proxy based on mode
  function selectProxy(pipelineInput: PipelineInput) {
    if (pipelineInput.pipelineTestingMode) return testActs;
    if (pipelineInput.pipelineConfig?.retry_preset === 'subscription') return subscriptionActs;
    return acts;
  }

  const a = selectProxy(input);

  const state: PipelineState = {
    status: 'running',
    currentPhase: null,
    currentAgent: null,
    completedAgents: [],
    failedAgent: null,
    error: null,
    startTime: Date.now(),
    agentMetrics: {},
    summary: null,
  };

  setHandler(getProgress, (): PipelineProgress => ({
    ...state,
    workflowId,
    elapsedMs: Date.now() - state.startTime,
  }));

  const sessionId = input.sessionId || workflowId;

  const activityInput: ActivityInput = {
    webUrl: input.webUrl,
    repoPath: input.repoPath,
    workflowId,
    sessionId,
    ...(input.configPath !== undefined && { configPath: input.configPath }),
    ...(input.outputPath !== undefined && { outputPath: input.outputPath }),
    ...(input.pipelineTestingMode !== undefined && { pipelineTestingMode: input.pipelineTestingMode }),
  };

  // Run a sequential agent phase
  async function runSequentialPhase(
    phaseName: string,
    agentName: AgentName,
    runAgent: (input: ActivityInput) => Promise<AgentMetrics>
  ): Promise<void> {
    state.currentPhase = phaseName;
    state.currentAgent = agentName;
    state.agentMetrics[agentName] = await runAgent(activityInput);
    state.completedAgents.push(agentName);
  }

  // Run a single vuln-exploit pipeline
  async function runVulnExploitPipeline(
    vulnType: VulnType,
    runVulnAgent: () => Promise<AgentMetrics>,
    runExploitAgent: () => Promise<AgentMetrics>
  ): Promise<VulnExploitPipelineResult> {
    // 1. Run vulnerability analysis
    const vulnMetrics = await runVulnAgent();

    // 2. Check exploitation queue
    const decision = await a.checkExploitationQueue(activityInput, vulnType);

    // 3. Conditionally run exploitation
    let exploitMetrics: AgentMetrics | null = null;
    if (decision.shouldExploit) {
      exploitMetrics = await runExploitAgent();
    }

    return {
      vulnType,
      vulnMetrics,
      exploitMetrics,
      exploitDecision: {
        shouldExploit: decision.shouldExploit,
        vulnerabilityCount: decision.vulnerabilityCount,
      },
      error: null,
    };
  }

  // Run thunks with concurrency limit
  async function runWithConcurrencyLimit(
    thunks: Array<() => Promise<VulnExploitPipelineResult>>,
    limit: number
  ): Promise<PromiseSettledResult<VulnExploitPipelineResult>[]> {
    const results: PromiseSettledResult<VulnExploitPipelineResult>[] = [];
    const inFlight = new Set<Promise<void>>();

    for (const thunk of thunks) {
      const slot = thunk().then(
        (value) => { results.push({ status: 'fulfilled', value }); },
        (reason: unknown) => { results.push({ status: 'rejected', reason }); }
      ).finally(() => { inFlight.delete(slot); });

      inFlight.add(slot);

      if (inFlight.size >= limit) {
        await Promise.race(inFlight);
      }
    }

    await Promise.allSettled(inFlight);
    return results;
  }

  try {
    // === Preflight Validation ===
    state.currentPhase = 'preflight';
    await preflightActs.runPreflightValidation(activityInput);
    log.info('Preflight validation passed');

    // === Phase 1: Pre-Reconnaissance ===
    await runSequentialPhase('pre-recon', 'pre-recon', a.runPreReconAgent);

    // === Phase 2: Reconnaissance ===
    await runSequentialPhase('recon', 'recon', a.runReconAgent);

    // === Phases 3-4: Vulnerability + Exploitation (Pipelined) ===
    state.currentPhase = 'vulnerability-exploitation';
    state.currentAgent = 'pipelines';

    const maxConcurrent = input.pipelineConfig?.max_concurrent_pipelines ?? 5;

    const pipelineThunks: Array<() => Promise<VulnExploitPipelineResult>> = [
      () => runVulnExploitPipeline('injection', () => a.runInjectionVulnAgent(activityInput), () => a.runInjectionExploitAgent(activityInput)),
      () => runVulnExploitPipeline('xss', () => a.runXssVulnAgent(activityInput), () => a.runXssExploitAgent(activityInput)),
      () => runVulnExploitPipeline('auth', () => a.runAuthVulnAgent(activityInput), () => a.runAuthExploitAgent(activityInput)),
      () => runVulnExploitPipeline('ssrf', () => a.runSsrfVulnAgent(activityInput), () => a.runSsrfExploitAgent(activityInput)),
      () => runVulnExploitPipeline('authz', () => a.runAuthzVulnAgent(activityInput), () => a.runAuthzExploitAgent(activityInput)),
    ];

    const pipelineResults = await runWithConcurrencyLimit(pipelineThunks, maxConcurrent);

    // Aggregate results
    for (const result of pipelineResults) {
      if (result.status === 'fulfilled') {
        const { vulnType, vulnMetrics, exploitMetrics } = result.value;
        if (vulnMetrics) {
          state.agentMetrics[`${vulnType}-vuln`] = vulnMetrics;
          state.completedAgents.push(`${vulnType}-vuln`);
        }
        if (exploitMetrics) {
          state.agentMetrics[`${vulnType}-exploit`] = exploitMetrics;
          state.completedAgents.push(`${vulnType}-exploit`);
        }
      } else {
        log.warn('Pipeline failed', { reason: String(result.reason) });
      }
    }

    // === Phase 5: Reporting ===
    state.currentPhase = 'reporting';
    state.currentAgent = 'report';
    state.agentMetrics['report'] = await a.runReportAgent(activityInput);
    state.completedAgents.push('report');

    state.status = 'completed';
    state.currentPhase = null;
    state.currentAgent = null;
    state.summary = computeSummary(state);

    return state;
  } catch (error) {
    state.status = 'failed';
    state.failedAgent = state.currentAgent;
    state.error = error instanceof Error ? error.message : String(error);
    state.summary = computeSummary(state);
    throw error;
  }
}
