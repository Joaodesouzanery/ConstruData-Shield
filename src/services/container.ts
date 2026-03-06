/**
 * Dependency Injection Container
 *
 * Per-workflow container that holds service instances and shared state.
 * Ensures consistent configuration and enables testing via substitution.
 */

import { AgentExecutionService } from './agent-execution.js';
import { AuditSession } from '../audit/audit-session.js';
import type { ShieldConfig } from '../types/config.js';

export interface ContainerConfig {
  webUrl: string;
  repoPath: string;
  sessionId: string;
  workflowId: string;
  auditBaseDir: string;
  shieldConfig: ShieldConfig | null;
  pipelineTestingMode: boolean;
}

export class Container {
  private readonly config: ContainerConfig;
  private executionService: AgentExecutionService | null = null;
  private auditSession: AuditSession | null = null;

  constructor(config: ContainerConfig) {
    this.config = config;
  }

  getExecutionService(): AgentExecutionService {
    if (!this.executionService) {
      this.executionService = new AgentExecutionService();
      this.executionService.setConfig(this.config.shieldConfig);
    }
    return this.executionService;
  }

  getAuditSession(): AuditSession {
    if (!this.auditSession) {
      this.auditSession = new AuditSession(
        this.config.auditBaseDir,
        this.config.sessionId,
        this.config.webUrl,
        this.config.repoPath
      );
      this.auditSession.setWorkflowId(this.config.workflowId);
    }
    return this.auditSession;
  }

  getConfig(): ContainerConfig {
    return this.config;
  }
}

// Global container registry (one per workflow)
const containers = new Map<string, Container>();

export function createContainer(config: ContainerConfig): Container {
  const container = new Container(config);
  containers.set(config.workflowId, container);
  return container;
}

export function getContainer(workflowId: string): Container | undefined {
  return containers.get(workflowId);
}

export function removeContainer(workflowId: string): void {
  containers.delete(workflowId);
}
