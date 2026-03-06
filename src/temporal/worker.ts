/**
 * Temporal worker entry point for ConstruData Shield.
 * Registers workflows and activities, then starts polling the task queue.
 */

import { Worker } from '@temporalio/worker';
import * as activities from './activities.js';
import dotenv from 'dotenv';

dotenv.config();

const TASK_QUEUE = 'shield-pipeline';

async function run(): Promise<void> {
  const temporalAddress = process.env.TEMPORAL_ADDRESS || 'localhost:7233';

  console.log(`[ConstruData Shield] Starting worker...`);
  console.log(`  Temporal: ${temporalAddress}`);
  console.log(`  Task Queue: ${TASK_QUEUE}`);

  const worker = await Worker.create({
    workflowsPath: new URL('./workflows.js', import.meta.url).pathname,
    activities,
    taskQueue: TASK_QUEUE,
    connection: {
      address: temporalAddress,
    } as any,
  });

  console.log('[ConstruData Shield] Worker started, polling for tasks...');
  await worker.run();
}

run().catch((err) => {
  console.error('[ConstruData Shield] Worker failed:', err);
  process.exit(1);
});
