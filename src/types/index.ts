/** Consolidated type exports */

export type {
  AgentName,
  VulnType,
  PlaywrightAgent,
  ModelTier,
  AgentDefinition,
  AgentValidator,
} from './agents.js';

export { ALL_AGENTS } from './agents.js';

export type { ActivityLogger } from './activity-logger.js';

export type { Result, Ok, Err } from './result.js';
export { ok, err, isOk, isErr } from './result.js';

export { ErrorCode } from './errors.js';
export type { PentestErrorType } from './errors.js';

export type { ShieldConfig, AuthenticationConfig, RulesConfig, PipelineConfig } from './config.js';

export type { AgentMetrics } from './metrics.js';

export type { AgentEndResult, SessionData } from './audit.js';
