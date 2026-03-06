/** Agent type definitions for ConstruData Shield pipeline */

export const ALL_AGENTS = [
  'pre-recon',
  'recon',
  'injection-vuln',
  'xss-vuln',
  'auth-vuln',
  'ssrf-vuln',
  'authz-vuln',
  'injection-exploit',
  'xss-exploit',
  'auth-exploit',
  'ssrf-exploit',
  'authz-exploit',
  'report',
] as const;

export type AgentName = (typeof ALL_AGENTS)[number];

export type VulnType = 'injection' | 'xss' | 'auth' | 'ssrf' | 'authz';

export type PlaywrightAgent =
  | 'playwright-agent1'
  | 'playwright-agent2'
  | 'playwright-agent3'
  | 'playwright-agent4'
  | 'playwright-agent5';

export type ModelTier = 'small' | 'medium' | 'large';

export interface AgentDefinition {
  readonly name: AgentName;
  readonly displayName: string;
  readonly prerequisites: readonly AgentName[];
  readonly promptTemplate: string;
  readonly deliverableFilename: string;
  readonly modelTier?: ModelTier;
}

export type AgentValidator = (
  sourceDir: string,
  logger: ActivityLogger
) => Promise<boolean>;

// Re-import to avoid circular deps
import type { ActivityLogger } from './activity-logger.js';
