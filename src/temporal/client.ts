/**
 * Temporal client for submitting ConstruData Shield pentest workflows.
 * CLI entry point that parses arguments and starts the pipeline.
 */

import { Connection, Client } from '@temporalio/client';
import { pentestPipelineWorkflow } from './workflows.js';
import type { PipelineInput } from './shared.js';
import dotenv from 'dotenv';

dotenv.config();

const TASK_QUEUE = 'shield-pipeline';

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: node client.js <url> <repo-path> [options]');
    process.exit(1);
  }

  const webUrl = args[0];
  const repoPath = args[1];

  // Parse optional args
  let configPath: string | undefined;
  let outputPath: string | undefined;
  let pipelineTestingMode = false;
  let workspace: string | undefined;

  for (let i = 2; i < args.length; i++) {
    switch (args[i]) {
      case '--config':
        configPath = args[++i];
        break;
      case '--output':
        outputPath = args[++i];
        break;
      case '--pipeline-testing':
        pipelineTestingMode = true;
        break;
      case '--workspace':
        workspace = args[++i];
        break;
    }
  }

  // Connect to Temporal
  const temporalAddress = process.env.TEMPORAL_ADDRESS || 'localhost:7233';
  const connection = await Connection.connect({ address: temporalAddress });
  const client = new Client({ connection });

  // Generate workflow ID
  const timestamp = Date.now();
  const hostname = new URL(webUrl).hostname.replace(/\./g, '-');
  const workflowId = workspace || `${hostname}_shield-${timestamp}`;

  const input: PipelineInput = {
    webUrl,
    repoPath,
    ...(configPath !== undefined && { configPath }),
    ...(outputPath !== undefined && { outputPath }),
    ...(pipelineTestingMode && { pipelineTestingMode }),
    ...(workspace !== undefined && { sessionId: workspace }),
  };

  console.log(`\n  ConstruData Shield - Security Testing Pipeline`);
  console.log(`  ===============================================`);
  console.log(`  Target:     ${webUrl}`);
  console.log(`  Repository: ${repoPath}`);
  console.log(`  Workflow:   ${workflowId}`);
  if (configPath) console.log(`  Config:     ${configPath}`);
  if (workspace) console.log(`  Workspace:  ${workspace}`);
  console.log();

  // Start workflow
  const handle = await client.workflow.start(pentestPipelineWorkflow, {
    args: [input],
    taskQueue: TASK_QUEUE,
    workflowId,
  });

  console.log(`  Workflow submitted: ${workflowId}`);
  console.log(`  Monitor at: http://localhost:8233`);
  console.log();
}

main().catch((err) => {
  console.error('Failed to start workflow:', err);
  process.exit(1);
});
