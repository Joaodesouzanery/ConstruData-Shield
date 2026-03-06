/** Error handling and classification for the ConstruData Shield pipeline */

import { ErrorCode, type PentestErrorType } from '../types/errors.js';

/** Custom error class with classification metadata for Temporal retry decisions */
export class PentestError extends Error {
  readonly category: PentestErrorType;
  readonly retryable: boolean;
  readonly context: Record<string, unknown>;
  readonly code: ErrorCode;

  constructor(
    message: string,
    category: PentestErrorType,
    retryable: boolean,
    context: Record<string, unknown> = {},
    code: ErrorCode = ErrorCode.AGENT_EXECUTION_FAILED
  ) {
    super(message);
    this.name = 'PentestError';
    this.category = category;
    this.retryable = retryable;
    this.context = context;
    this.code = code;
  }
}

/** Classify whether an error is retryable for Temporal retry policies */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof PentestError) {
    return error.retryable;
  }

  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    const name = error.name;

    // Non-retryable error types
    const nonRetryable = [
      'AuthenticationError',
      'PermissionError',
      'InvalidRequestError',
      'RequestTooLargeError',
    ];
    if (nonRetryable.includes(name)) {
      return false;
    }

    // Rate limit / billing errors are retryable
    if (msg.includes('rate limit') || msg.includes('429') || msg.includes('spending cap')) {
      return true;
    }

    // Server errors are retryable
    if (msg.includes('500') || msg.includes('502') || msg.includes('503')) {
      return true;
    }

    // Network errors are retryable
    if (msg.includes('econnrefused') || msg.includes('timeout') || msg.includes('enotfound')) {
      return true;
    }
  }

  // Default: retryable
  return true;
}

/** Classify error into a Temporal ApplicationFailure type */
export function classifyErrorType(error: unknown): string {
  if (error instanceof PentestError) {
    switch (error.category) {
      case 'authentication':
        return 'AuthenticationError';
      case 'permission':
        return 'PermissionError';
      case 'billing':
        return 'BillingError';
      case 'configuration':
        return 'ConfigurationError';
      default:
        return error.retryable ? 'TransientError' : 'PermanentError';
    }
  }

  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (msg.includes('401') || msg.includes('unauthorized')) return 'AuthenticationError';
    if (msg.includes('403') || msg.includes('forbidden')) return 'PermissionError';
    if (msg.includes('429') || msg.includes('rate limit')) return 'RateLimitError';
    if (msg.includes('invalid')) return 'InvalidRequestError';
  }

  return 'UnknownError';
}
