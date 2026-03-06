/**
 * Audit session for tracking agent execution and metrics.
 * Provides crash-safe, append-only logging of all pipeline activity.
 * Supports resume by detecting completed agents from session.json.
 */

import { path, fs } from 'zx';
import { formatTimestamp } from '../utils/formatting.js';
import { writeFileSafe, appendFileSafe, readFileOrNull } from '../utils/file-io.js';
import type { AgentEndResult, SessionData } from '../types/audit.js';
import type { AgentName } from '../types/agents.js';

export interface ResumeInfo {
  completedAgents: AgentName[];
  lastCheckpoint: string | null;
  originalWebUrl: string;
}

export class AuditSession {
  private readonly sessionDir: string;
  private readonly sessionId: string;
  private readonly webUrl: string;
  private readonly repoPath: string;
  private readonly startedAt: string;
  private readonly agents: Record<string, AgentEndResult> = {};
  private workflowId: string;

  constructor(baseDir: string, sessionId: string, webUrl: string, repoPath: string) {
    this.sessionDir = path.join(baseDir, sessionId);
    this.sessionId = sessionId;
    this.webUrl = webUrl;
    this.repoPath = repoPath;
    this.startedAt = formatTimestamp();
    this.workflowId = sessionId;
  }

  setWorkflowId(id: string): void {
    this.workflowId = id;
  }

  /** Initialize the audit session directory and session.json */
  async initialize(): Promise<void> {
    await fs.ensureDir(this.sessionDir);
    await fs.ensureDir(path.join(this.sessionDir, 'agents'));
    await fs.ensureDir(path.join(this.sessionDir, 'prompts'));
    await fs.ensureDir(path.join(this.sessionDir, 'deliverables'));
    await this.saveSessionData();
  }

  /**
   * Detect resume state from an existing session.json.
   * Returns null if no valid session exists or URL mismatches.
   */
  async detectResume(): Promise<ResumeInfo | null> {
    const sessionPath = path.join(this.sessionDir, 'session.json');
    const content = await readFileOrNull(sessionPath);
    if (!content) return null;

    try {
      const data = JSON.parse(content) as SessionData;

      // Prevent cross-target contamination
      if (data.webUrl !== this.webUrl) {
        return null;
      }

      // Find completed agents
      const completedAgents: AgentName[] = [];
      let lastCheckpoint: string | null = null;

      for (const [name, result] of Object.entries(data.agents)) {
        if (result.success) {
          completedAgents.push(name as AgentName);
          if (result.checkpoint) {
            lastCheckpoint = result.checkpoint;
          }
        }
      }

      if (completedAgents.length === 0) return null;

      // Restore agents map from previous session
      for (const [name, result] of Object.entries(data.agents)) {
        this.agents[name] = result;
      }

      return {
        completedAgents,
        lastCheckpoint,
        originalWebUrl: data.webUrl,
      };
    } catch {
      return null;
    }
  }

  /** Check if a specific agent was already completed */
  isAgentCompleted(agentName: string): boolean {
    return this.agents[agentName]?.success === true;
  }

  /** Get all completed agent names */
  getCompletedAgents(): string[] {
    return Object.entries(this.agents)
      .filter(([, result]) => result.success)
      .map(([name]) => name);
  }

  /** Log the start of an agent execution */
  async startAgent(agentName: string, prompt: string, attemptNumber: number): Promise<void> {
    // Save prompt snapshot for audit/debug
    const promptPath = path.join(this.sessionDir, 'prompts', `${agentName}_attempt${attemptNumber}.txt`);
    await writeFileSafe(promptPath, prompt);

    // Log to workflow log
    await this.log(`Agent started: ${agentName} (attempt ${attemptNumber})`);
  }

  /** Log the end of an agent execution */
  async endAgent(agentName: string, result: AgentEndResult): Promise<void> {
    this.agents[agentName] = result;

    // Save per-agent result JSON
    const agentLogPath = path.join(this.sessionDir, 'agents', `${agentName}.json`);
    await writeFileSafe(agentLogPath, JSON.stringify(result, null, 2));

    // Log to workflow log
    const status = result.success ? 'completed' : 'failed';
    await this.log(`Agent ${status}: ${agentName} (${result.duration_ms}ms, $${result.cost_usd.toFixed(2)})`);

    // Persist session state immediately (crash-safe)
    await this.saveSessionData();
  }

  /** Log a message to the workflow log */
  async log(message: string): Promise<void> {
    const line = `[${formatTimestamp()}] ${message}\n`;
    const logPath = path.join(this.sessionDir, 'workflow.log');
    await appendFileSafe(logPath, line);
  }

  /** Mark the session as completed */
  async complete(): Promise<void> {
    await this.log('Pipeline completed');
    await this.saveSessionData('completed');
  }

  /** Mark the session as failed */
  async fail(error: string): Promise<void> {
    await this.log(`Pipeline failed: ${error}`);
    await this.saveSessionData('failed');
  }

  /** Get aggregated cost across all agents */
  getTotalCost(): number {
    return Object.values(this.agents).reduce((sum, a) => sum + a.cost_usd, 0);
  }

  /** Get aggregated duration across all agents */
  getTotalDuration(): number {
    return Object.values(this.agents).reduce((sum, a) => sum + a.duration_ms, 0);
  }

  /** Save current session data to session.json */
  private async saveSessionData(status: SessionData['status'] = 'running'): Promise<void> {
    const data: SessionData = {
      sessionId: this.sessionId,
      workflowId: this.workflowId,
      webUrl: this.webUrl,
      repoPath: this.repoPath,
      startedAt: this.startedAt,
      agents: { ...this.agents },
      status,
    };

    const sessionPath = path.join(this.sessionDir, 'session.json');
    await writeFileSafe(sessionPath, JSON.stringify(data, null, 2));
  }

  /** Get the session directory path */
  getSessionDir(): string {
    return this.sessionDir;
  }

  /** Get the session ID */
  getSessionId(): string {
    return this.sessionId;
  }

  /** List all available workspaces in the base directory */
  static async listWorkspaces(baseDir: string): Promise<SessionData[]> {
    const workspaces: SessionData[] = [];

    if (!(await fs.pathExists(baseDir))) return workspaces;

    const entries = await fs.readdir(baseDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const sessionPath = path.join(baseDir, entry.name, 'session.json');
      const content = await readFileOrNull(sessionPath);
      if (content) {
        try {
          workspaces.push(JSON.parse(content) as SessionData);
        } catch {
          // Skip malformed session files
        }
      }
    }

    return workspaces.sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  }
}
