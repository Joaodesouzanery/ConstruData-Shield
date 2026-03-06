/** Error codes for structured error handling across the pipeline */

export enum ErrorCode {
  // Agent errors
  AGENT_EXECUTION_FAILED = 'AGENT_EXECUTION_FAILED',
  OUTPUT_VALIDATION_FAILED = 'OUTPUT_VALIDATION_FAILED',

  // Prompt errors
  PROMPT_LOAD_FAILED = 'PROMPT_LOAD_FAILED',
  PROMPT_TEMPLATE_NOT_FOUND = 'PROMPT_TEMPLATE_NOT_FOUND',

  // Config errors
  CONFIG_PARSE_FAILED = 'CONFIG_PARSE_FAILED',
  CONFIG_VALIDATION_FAILED = 'CONFIG_VALIDATION_FAILED',

  // Git errors
  GIT_CHECKPOINT_FAILED = 'GIT_CHECKPOINT_FAILED',
  GIT_COMMIT_FAILED = 'GIT_COMMIT_FAILED',
  GIT_ROLLBACK_FAILED = 'GIT_ROLLBACK_FAILED',

  // Infrastructure errors
  TEMPORAL_CONNECTION_FAILED = 'TEMPORAL_CONNECTION_FAILED',
  MCP_SERVER_FAILED = 'MCP_SERVER_FAILED',

  // Billing errors
  SPENDING_CAP_REACHED = 'SPENDING_CAP_REACHED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // Validation errors
  PREFLIGHT_FAILED = 'PREFLIGHT_FAILED',
  TARGET_UNREACHABLE = 'TARGET_UNREACHABLE',
  REPO_NOT_FOUND = 'REPO_NOT_FOUND',
}

export type PentestErrorType =
  | 'authentication'
  | 'permission'
  | 'billing'
  | 'network'
  | 'validation'
  | 'filesystem'
  | 'prompt'
  | 'configuration'
  | 'infrastructure';
