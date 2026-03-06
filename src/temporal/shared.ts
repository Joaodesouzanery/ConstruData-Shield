/** Shared types and query definitions for Temporal workflows */

import { defineQuery } from '@temporalio/workflow';
import type { AgentMetrics } from '../types/metrics.js';
import type { AgentName, VulnType } from '../types/agents.js';

/** Input for starting the pentest pipeline workflow */
export interface PipelineInput {
  webUrl: string;
  repoPath: string;
  configPath?: string;
  outputPath?: string;
  pipelineTestingMode?: boolean;
  sessionId?: string;
  resumeFromWorkspace?: string;
  terminatedWorkflows?: string[];
  pipelineConfig?: {
    retry_preset?: 'default' | 'subscription';
    max_concurrent_pipelines?: number;
  };
}

/** Workflow state tracking */
export interface PipelineState {
  status: 'running' | 'completed' | 'failed';
  currentPhase: string | null;
  currentAgent: string | null;
  completedAgents: string[];
  failedAgent: string | null;
  error: string | null;
  startTime: number;
  agentMetrics: Record<string, AgentMetrics>;
  summary: PipelineSummary | null;
}

/** Aggregated pipeline summary */
export interface PipelineSummary {
  totalCostUsd: number;
  totalDurationMs: number;
  totalTurns: number;
  agentCount: number;
}

/** Progress query response */
export interface PipelineProgress extends PipelineState {
  workflowId: string;
  elapsedMs: number;
}

/** Result from a vuln-exploit pipeline pair */
export interface VulnExploitPipelineResult {
  vulnType: VulnType;
  vulnMetrics: AgentMetrics | null;
  exploitMetrics: AgentMetrics | null;
  exploitDecision: {
    shouldExploit: boolean;
    vulnerabilityCount: number;
  };
  error: string | null;
}

/** Resume state from a previous workflow */
export interface ResumeState {
  completedAgents: string[];
  checkpointHash: string;
  originalWorkflowId: string;
}

/** Query definition for workflow progress */
export const getProgress = defineQuery<PipelineProgress>('getProgress');
