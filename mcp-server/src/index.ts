/**
 * Shield Helper MCP Server
 *
 * In-process MCP server providing save_deliverable and generate_totp tools
 * for ConstruData Shield security testing agents.
 */

import { createSdkMcpServer } from '@anthropic-ai/claude-agent-sdk';
import { createSaveDeliverableTool } from './tools/save-deliverable.js';
import { generateTotpTool } from './tools/generate-totp.js';

/**
 * Create Shield Helper MCP Server with target directory context.
 * Each workflow creates its own instance with its targetDir.
 */
export function createShieldHelperServer(targetDir: string): ReturnType<typeof createSdkMcpServer> {
  const saveDeliverableTool = createSaveDeliverableTool(targetDir);

  return createSdkMcpServer({
    name: 'shield-helper',
    version: '1.0.0',
    tools: [saveDeliverableTool, generateTotpTool],
  });
}

export { createSaveDeliverableTool } from './tools/save-deliverable.js';
export { generateTotpTool } from './tools/generate-totp.js';
