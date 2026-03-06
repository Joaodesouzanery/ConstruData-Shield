/**
 * Git Semaphore — serializes git operations across parallel agents.
 *
 * When 5 vuln/exploit agents run simultaneously, concurrent git operations
 * can collide on the index.lock file. This semaphore ensures only one
 * git operation runs at a time per repository.
 */

type QueueEntry = {
  resolve: () => void;
  label: string;
};

export class GitSemaphore {
  private locked = false;
  private readonly queue: QueueEntry[] = [];
  private readonly repoPath: string;

  constructor(repoPath: string) {
    this.repoPath = repoPath;
  }

  /** Acquire the semaphore — waits if another agent holds it */
  async acquire(label: string): Promise<void> {
    if (!this.locked) {
      this.locked = true;
      return;
    }

    // Wait in queue
    return new Promise<void>((resolve) => {
      this.queue.push({ resolve, label });
    });
  }

  /** Release the semaphore — lets the next queued operation proceed */
  release(): void {
    const next = this.queue.shift();
    if (next) {
      next.resolve();
    } else {
      this.locked = false;
    }
  }

  /** Execute a function while holding the semaphore */
  async withLock<T>(label: string, fn: () => Promise<T>): Promise<T> {
    await this.acquire(label);
    try {
      return await fn();
    } finally {
      this.release();
    }
  }

  /** Get the number of operations waiting in the queue */
  get queueLength(): number {
    return this.queue.length;
  }

  /** Check if the semaphore is currently held */
  get isLocked(): boolean {
    return this.locked;
  }
}

// Global semaphore registry (one per repo path)
const semaphores = new Map<string, GitSemaphore>();

/** Get or create a semaphore for a repository */
export function getGitSemaphore(repoPath: string): GitSemaphore {
  let sem = semaphores.get(repoPath);
  if (!sem) {
    sem = new GitSemaphore(repoPath);
    semaphores.set(repoPath, sem);
  }
  return sem;
}
