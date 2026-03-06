/** Validates vulnerability queue deliverables before exploitation phase */

import { path, fs } from 'zx';
import type { VulnType } from '../types/index.js';

/** Queue file naming convention */
function getQueueFilename(vulnType: VulnType): string {
  return `${vulnType}_analysis_deliverable.md`;
}

/** Validate that a vulnerability queue deliverable exists and has content */
export async function validateQueueAndDeliverable(
  vulnType: VulnType,
  sourceDir: string
): Promise<void> {
  const filename = getQueueFilename(vulnType);
  const filePath = path.join(sourceDir, 'deliverables', filename);

  const exists = await fs.pathExists(filePath);
  if (!exists) {
    throw new Error(`Queue deliverable not found: ${filename}`);
  }

  const content = await fs.readFile(filePath, 'utf-8');
  if (content.trim().length === 0) {
    throw new Error(`Queue deliverable is empty: ${filename}`);
  }
}
