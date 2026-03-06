/** Git operations for checkpoint, commit, and rollback during agent execution */

import { $ } from 'zx';
import type { ActivityLogger } from '../types/activity-logger.js';

/** Create a git checkpoint before agent execution */
export async function createGitCheckpoint(
  repoPath: string,
  agentName: string,
  attemptNumber: number,
  logger: ActivityLogger
): Promise<void> {
  logger.info(`Creating git checkpoint for ${agentName} (attempt ${attemptNumber})`);

  await $`git -C ${repoPath} add -A`.quiet();
  await $`git -C ${repoPath} commit --allow-empty -m ${'checkpoint: ' + agentName + ' attempt ' + attemptNumber}`.quiet();
}

/** Commit successful agent deliverables */
export async function commitGitSuccess(
  repoPath: string,
  agentName: string,
  logger: ActivityLogger
): Promise<void> {
  logger.info(`Committing deliverables for ${agentName}`);

  await $`git -C ${repoPath} add -A`.quiet();
  await $`git -C ${repoPath} commit --allow-empty -m ${'deliverable: ' + agentName + ' completed'}`.quiet();
}

/** Rollback git workspace to last checkpoint on failure */
export async function rollbackGitWorkspace(
  repoPath: string,
  reason: string,
  logger: ActivityLogger
): Promise<void> {
  logger.warn(`Rolling back workspace: ${reason}`);

  try {
    await $`git -C ${repoPath} checkout -- .`.quiet();
    await $`git -C ${repoPath} clean -fd`.quiet();
  } catch (error) {
    logger.error(`Rollback failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/** Get the current git commit hash */
export async function getGitCommitHash(repoPath: string): Promise<string | null> {
  try {
    const result = await $`git -C ${repoPath} rev-parse HEAD`.quiet();
    return result.stdout.trim();
  } catch {
    return null;
  }
}

/** Restore a git checkpoint from a specific commit hash */
export async function restoreGitCheckpoint(
  repoPath: string,
  commitHash: string,
  logger: ActivityLogger
): Promise<void> {
  logger.info(`Restoring git checkpoint: ${commitHash}`);
  await $`git -C ${repoPath} reset --hard ${commitHash}`.quiet();
}
