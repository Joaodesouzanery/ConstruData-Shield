/** Audit types for tracking agent execution results */

export interface AgentEndResult {
  readonly attemptNumber: number;
  readonly duration_ms: number;
  readonly cost_usd: number;
  readonly success: boolean;
  readonly model?: string;
  readonly checkpoint?: string;
  readonly error?: string;
}

export interface SessionData {
  readonly sessionId: string;
  readonly workflowId: string;
  readonly webUrl: string;
  readonly repoPath: string;
  readonly startedAt: string;
  readonly agents: Record<string, AgentEndResult>;
  readonly status: 'running' | 'completed' | 'failed';
}
