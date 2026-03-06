/**
 * Audit session for tracking agent execution and metrics.
 * Provides crash-safe, append-only logging of all pipeline activity.
 */

import { path, fs } from 'zx';
import { formatTimestamp } from '../utils/formatting.js';
import { writeFileSafe, appendFileSafe } from '../utils/file-io.js';
import type { AgentEndResult, SessionData } from '../types/audit.js';

export class AuditSession {
  private readonly sessionDir: string;
  private readonly sessionId: string;
  private readonly webUrl: string;
  private readonly repoPath: string;
  private readonly startedAt: string;
  private readonly agents: Record<string, AgentEndResult> = {};

  constructor(baseDir: string, sessionId: string, webUrl: string, repoPath: string) {
    this.sessionDir = path.join(baseDir, sessionId);
    this.sessionId = sessionId;
    this.webUrl = webUrl;
    this.repoPath = repoPath;
    this.startedAt = formatTimestamp();
  }

  /** Initialize the audit session directory and session.json */
  async initialize(): Promise<void> {
    await fs.ensureDir(this.sessionDir);
    await fs.ensureDir(path.join(this.sessionDir, 'agents'));
    await fs.ensureDir(path.join(this.sessionDir, 'prompts'));
    await fs.ensureDir(path.join(this.sessionDir, 'deliverables'));
    await this.saveSessionData();
  }

  /** Log the start of an agent execution */
  async startAgent(agentName: string, prompt: string, attemptNumber: number): Promise<void> {
    // Save prompt snapshot
    const promptPath = path.join(this.sessionDir, 'prompts', `${agentName}_attempt${attemptNumber}.txt`);
    await writeFileSafe(promptPath, prompt);

    // Log to workflow log
    await this.log(`Agent started: ${agentName} (attempt ${attemptNumber})`);
  }

  /** Log the end of an agent execution */
  async endAgent(agentName: string, result: AgentEndResult): Promise<void> {
    this.agents[agentName] = result;

    // Save agent result
    const agentLogPath = path.join(this.sessionDir, 'agents', `${agentName}.json`);
    await writeFileSafe(agentLogPath, JSON.stringify(result, null, 2));

    // Log to workflow log
    const status = result.success ? 'completed' : 'failed';
    await this.log(`Agent ${status}: ${agentName} (${result.duration_ms}ms, $${result.cost_usd.toFixed(2)})`);

    // Update session.json
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

  /** Save current session data to session.json */
  private async saveSessionData(status: SessionData['status'] = 'running'): Promise<void> {
    const data: SessionData = {
      sessionId: this.sessionId,
      workflowId: this.sessionId,
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
}
