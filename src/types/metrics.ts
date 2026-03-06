/** Metrics types for tracking agent performance */

export interface AgentMetrics {
  readonly durationMs: number;
  readonly inputTokens: number | null;
  readonly outputTokens: number | null;
  readonly costUsd: number | null;
  readonly numTurns: number | null;
  readonly model?: string;
}
