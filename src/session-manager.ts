/** Agent registry and pipeline configuration for ConstruData Shield */

import { path, fs } from 'zx';
import type { AgentName, AgentDefinition, PlaywrightAgent, AgentValidator, VulnType } from './types/index.js';
import type { ActivityLogger } from './types/activity-logger.js';
import { validateQueueAndDeliverable } from './services/queue-validation.js';

/** Agent definitions for the 5-phase security testing pipeline */
export const AGENTS: Readonly<Record<AgentName, AgentDefinition>> = Object.freeze({
  'pre-recon': {
    name: 'pre-recon',
    displayName: 'Pre-reconnaissance agent',
    prerequisites: [],
    promptTemplate: 'pre-recon-code',
    deliverableFilename: 'code_analysis_deliverable.md',
    modelTier: 'large',
  },
  'recon': {
    name: 'recon',
    displayName: 'Reconnaissance agent',
    prerequisites: ['pre-recon'],
    promptTemplate: 'recon',
    deliverableFilename: 'recon_deliverable.md',
  },
  'injection-vuln': {
    name: 'injection-vuln',
    displayName: 'Injection vulnerability agent',
    prerequisites: ['recon'],
    promptTemplate: 'vuln-injection',
    deliverableFilename: 'injection_analysis_deliverable.md',
  },
  'xss-vuln': {
    name: 'xss-vuln',
    displayName: 'XSS vulnerability agent',
    prerequisites: ['recon'],
    promptTemplate: 'vuln-xss',
    deliverableFilename: 'xss_analysis_deliverable.md',
  },
  'auth-vuln': {
    name: 'auth-vuln',
    displayName: 'Authentication vulnerability agent',
    prerequisites: ['recon'],
    promptTemplate: 'vuln-auth',
    deliverableFilename: 'auth_analysis_deliverable.md',
  },
  'ssrf-vuln': {
    name: 'ssrf-vuln',
    displayName: 'SSRF vulnerability agent',
    prerequisites: ['recon'],
    promptTemplate: 'vuln-ssrf',
    deliverableFilename: 'ssrf_analysis_deliverable.md',
  },
  'authz-vuln': {
    name: 'authz-vuln',
    displayName: 'Authorization vulnerability agent',
    prerequisites: ['recon'],
    promptTemplate: 'vuln-authz',
    deliverableFilename: 'authz_analysis_deliverable.md',
  },
  'injection-exploit': {
    name: 'injection-exploit',
    displayName: 'Injection exploit agent',
    prerequisites: ['injection-vuln'],
    promptTemplate: 'exploit-injection',
    deliverableFilename: 'injection_exploitation_evidence.md',
  },
  'xss-exploit': {
    name: 'xss-exploit',
    displayName: 'XSS exploit agent',
    prerequisites: ['xss-vuln'],
    promptTemplate: 'exploit-xss',
    deliverableFilename: 'xss_exploitation_evidence.md',
  },
  'auth-exploit': {
    name: 'auth-exploit',
    displayName: 'Authentication exploit agent',
    prerequisites: ['auth-vuln'],
    promptTemplate: 'exploit-auth',
    deliverableFilename: 'auth_exploitation_evidence.md',
  },
  'ssrf-exploit': {
    name: 'ssrf-exploit',
    displayName: 'SSRF exploit agent',
    prerequisites: ['ssrf-vuln'],
    promptTemplate: 'exploit-ssrf',
    deliverableFilename: 'ssrf_exploitation_evidence.md',
  },
  'authz-exploit': {
    name: 'authz-exploit',
    displayName: 'Authorization exploit agent',
    prerequisites: ['authz-vuln'],
    promptTemplate: 'exploit-authz',
    deliverableFilename: 'authz_exploitation_evidence.md',
  },
  'report': {
    name: 'report',
    displayName: 'Report generation agent',
    prerequisites: ['injection-exploit', 'xss-exploit', 'auth-exploit', 'ssrf-exploit', 'authz-exploit'],
    promptTemplate: 'report-executive',
    deliverableFilename: 'comprehensive_security_assessment_report.md',
    modelTier: 'small',
  },
});

/** Phase names for metrics aggregation */
export type PhaseName = 'pre-recon' | 'recon' | 'vulnerability-analysis' | 'exploitation' | 'reporting';

/** Map agents to their corresponding phases */
export const AGENT_PHASE_MAP: Readonly<Record<AgentName, PhaseName>> = Object.freeze({
  'pre-recon': 'pre-recon',
  'recon': 'recon',
  'injection-vuln': 'vulnerability-analysis',
  'xss-vuln': 'vulnerability-analysis',
  'auth-vuln': 'vulnerability-analysis',
  'authz-vuln': 'vulnerability-analysis',
  'ssrf-vuln': 'vulnerability-analysis',
  'injection-exploit': 'exploitation',
  'xss-exploit': 'exploitation',
  'auth-exploit': 'exploitation',
  'authz-exploit': 'exploitation',
  'ssrf-exploit': 'exploitation',
  'report': 'reporting',
});

/** Factory for vulnerability queue validators */
function createVulnValidator(vulnType: VulnType): AgentValidator {
  return async (sourceDir: string, logger: ActivityLogger): Promise<boolean> => {
    try {
      await validateQueueAndDeliverable(vulnType, sourceDir);
      return true;
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      logger.warn(`Queue validation failed for ${vulnType}: ${errMsg}`);
      return false;
    }
  };
}

/** Factory for exploit deliverable validators */
function createExploitValidator(vulnType: VulnType): AgentValidator {
  return async (sourceDir: string): Promise<boolean> => {
    const evidenceFile = path.join(sourceDir, 'deliverables', `${vulnType}_exploitation_evidence.md`);
    return await fs.pathExists(evidenceFile);
  };
}

/** Playwright MCP server assignments per agent template */
export const MCP_AGENT_MAPPING: Record<string, PlaywrightAgent> = Object.freeze({
  'pre-recon-code': 'playwright-agent1',
  recon: 'playwright-agent2',

  'vuln-injection': 'playwright-agent1',
  'vuln-xss': 'playwright-agent2',
  'vuln-auth': 'playwright-agent3',
  'vuln-ssrf': 'playwright-agent4',
  'vuln-authz': 'playwright-agent5',

  'exploit-injection': 'playwright-agent1',
  'exploit-xss': 'playwright-agent2',
  'exploit-auth': 'playwright-agent3',
  'exploit-ssrf': 'playwright-agent4',
  'exploit-authz': 'playwright-agent5',

  'report-executive': 'playwright-agent3',
});

/** Agent output validators */
export const AGENT_VALIDATORS: Record<AgentName, AgentValidator> = Object.freeze({
  'pre-recon': async (sourceDir: string): Promise<boolean> => {
    const file = path.join(sourceDir, 'deliverables', 'code_analysis_deliverable.md');
    return await fs.pathExists(file);
  },
  recon: async (sourceDir: string): Promise<boolean> => {
    const file = path.join(sourceDir, 'deliverables', 'recon_deliverable.md');
    return await fs.pathExists(file);
  },

  'injection-vuln': createVulnValidator('injection'),
  'xss-vuln': createVulnValidator('xss'),
  'auth-vuln': createVulnValidator('auth'),
  'ssrf-vuln': createVulnValidator('ssrf'),
  'authz-vuln': createVulnValidator('authz'),

  'injection-exploit': createExploitValidator('injection'),
  'xss-exploit': createExploitValidator('xss'),
  'auth-exploit': createExploitValidator('auth'),
  'ssrf-exploit': createExploitValidator('ssrf'),
  'authz-exploit': createExploitValidator('authz'),

  report: async (sourceDir: string, logger: ActivityLogger): Promise<boolean> => {
    const reportFile = path.join(sourceDir, 'deliverables', 'comprehensive_security_assessment_report.md');
    const exists = await fs.pathExists(reportFile);
    if (!exists) {
      logger.error('Missing required deliverable: comprehensive_security_assessment_report.md');
    }
    return exists;
  },
});
