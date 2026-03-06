/**
 * Git operations for checkpoint, commit, and rollback during agent execution.
 * All operations are serialized through the GitSemaphore to prevent
 * index.lock collisions during parallel agent execution.
 */

import { $ } from 'zx';
import type { ActivityLogger } from '../types/activity-logger.js';
import { getGitSemaphore } from '../utils/git-semaphore.js';

/** Create a git checkpoint before agent execution */
export async function createGitCheckpoint(
  repoPath: string,
  agentName: string,
  attemptNumber: number,
  logger: ActivityLogger
): Promise<void> {
  const sem = getGitSemaphore(repoPath);
  await sem.withLock(`checkpoint-${agentName}`, async () => {
    logger.info(`Creating git checkpoint for ${agentName} (attempt ${attemptNumber})`);
    await $`git -C ${repoPath} add -A`.quiet();
    await $`git -C ${repoPath} commit --allow-empty -m ${'checkpoint: ' + agentName + ' attempt ' + attemptNumber}`.quiet();
  });
}

/** Commit successful agent deliverables */
export async function commitGitSuccess(
  repoPath: string,
  agentName: string,
  logger: ActivityLogger
): Promise<void> {
  const sem = getGitSemaphore(repoPath);
  await sem.withLock(`commit-${agentName}`, async () => {
    logger.info(`Committing deliverables for ${agentName}`);
    await $`git -C ${repoPath} add -A`.quiet();
    await $`git -C ${repoPath} commit --allow-empty -m ${'deliverable: ' + agentName + ' completed'}`.quiet();
  });
}

/** Rollback git workspace to last checkpoint on failure */
export async function rollbackGitWorkspace(
  repoPath: string,
  reason: string,
  logger: ActivityLogger
): Promise<void> {
  const sem = getGitSemaphore(repoPath);
  await sem.withLock(`rollback`, async () => {
    logger.warn(`Rolling back workspace: ${reason}`);
    try {
      await $`git -C ${repoPath} checkout -- .`.quiet();
      await $`git -C ${repoPath} clean -fd`.quiet();
    } catch (error) {
      logger.error(`Rollback failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
}

/** Get the current git commit hash */
export async function getGitCommitHash(repoPath: string): Promise<string | null> {
  const sem = getGitSemaphore(repoPath);
  return sem.withLock('rev-parse', async () => {
    try {
      const result = await $`git -C ${repoPath} rev-parse HEAD`.quiet();
      return result.stdout.trim();
    } catch {
      return null;
    }
  });
}

/** Restore a git checkpoint from a specific commit hash */
export async function restoreGitCheckpoint(
  repoPath: string,
  commitHash: string,
  logger: ActivityLogger
): Promise<void> {
  const sem = getGitSemaphore(repoPath);
  await sem.withLock('restore', async () => {
    logger.info(`Restoring git checkpoint: ${commitHash}`);
    await $`git -C ${repoPath} reset --hard ${commitHash}`.quiet();
  });
}
