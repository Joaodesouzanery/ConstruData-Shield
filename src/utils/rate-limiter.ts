/**
 * Adaptive Rate Limiter
 *
 * Detects 429 responses and implements adaptive exponential backoff.
 * Tracks rate limit state across agents to avoid hitting limits.
 */

export interface RateLimitState {
  isLimited: boolean;
  retryAfterMs: number;
  consecutiveErrors: number;
  lastErrorTime: number;
}

export class AdaptiveRateLimiter {
  private state: RateLimitState = {
    isLimited: false,
    retryAfterMs: 0,
    consecutiveErrors: 0,
    lastErrorTime: 0,
  };

  private readonly baseDelayMs: number;
  private readonly maxDelayMs: number;
  private readonly maxRetries: number;

  constructor(
    baseDelayMs: number = 2000,
    maxDelayMs: number = 120_000,
    maxRetries: number = 10
  ) {
    this.baseDelayMs = baseDelayMs;
    this.maxDelayMs = maxDelayMs;
    this.maxRetries = maxRetries;
  }

  /** Record a rate limit error (429) */
  recordRateLimitError(retryAfterHeader?: string): void {
    this.state.consecutiveErrors++;
    this.state.lastErrorTime = Date.now();
    this.state.isLimited = true;

    if (retryAfterHeader) {
      // Use server-specified retry-after
      const seconds = parseInt(retryAfterHeader, 10);
      this.state.retryAfterMs = isNaN(seconds) ? this.calculateBackoff() : seconds * 1000;
    } else {
      this.state.retryAfterMs = this.calculateBackoff();
    }
  }

  /** Record a successful request */
  recordSuccess(): void {
    this.state.isLimited = false;
    // Decay consecutive errors slowly to maintain some caution
    this.state.consecutiveErrors = Math.max(0, this.state.consecutiveErrors - 1);
  }

  /** Calculate exponential backoff with jitter */
  private calculateBackoff(): number {
    const exponential = this.baseDelayMs * Math.pow(2, this.state.consecutiveErrors - 1);
    const jitter = Math.random() * 0.3 * exponential; // 0-30% jitter
    return Math.min(exponential + jitter, this.maxDelayMs);
  }

  /** Wait if rate limited, returns true if we should proceed */
  async waitIfNeeded(): Promise<boolean> {
    if (!this.state.isLimited) return true;

    if (this.state.consecutiveErrors > this.maxRetries) {
      return false; // Give up
    }

    const elapsed = Date.now() - this.state.lastErrorTime;
    const remaining = this.state.retryAfterMs - elapsed;

    if (remaining > 0) {
      await new Promise((resolve) => setTimeout(resolve, remaining));
    }

    return true;
  }

  /** Check if an error is a rate limit error */
  static isRateLimitError(error: unknown): boolean {
    if (error instanceof Error) {
      const msg = error.message.toLowerCase();
      return msg.includes('429') || msg.includes('rate limit') || msg.includes('too many requests');
    }
    return false;
  }

  /** Execute a function with automatic rate limit handling */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    const canProceed = await this.waitIfNeeded();
    if (!canProceed) {
      throw new Error(`Rate limit: max retries (${this.maxRetries}) exceeded`);
    }

    try {
      const result = await fn();
      this.recordSuccess();
      return result;
    } catch (error) {
      if (AdaptiveRateLimiter.isRateLimitError(error)) {
        // Extract retry-after if available
        const retryAfter = (error as any).headers?.['retry-after'];
        this.recordRateLimitError(retryAfter);
      }
      throw error;
    }
  }

  /** Get current state for monitoring */
  getState(): Readonly<RateLimitState> {
    return { ...this.state };
  }
}

// Global rate limiter instance (shared across agents)
let globalLimiter: AdaptiveRateLimiter | null = null;

export function getGlobalRateLimiter(): AdaptiveRateLimiter {
  if (!globalLimiter) {
    globalLimiter = new AdaptiveRateLimiter();
  }
  return globalLimiter;
}
