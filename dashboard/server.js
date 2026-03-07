/* ========================================
   ConstruData Shield - Dashboard Backend API
   Express server with WebSocket for live updates,
   deliverables parser, and PDF export
   ======================================== */

import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { readdir, readFile, stat } from 'fs/promises';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;

/* ── Static files ── */
app.use(express.static(__dirname));
app.use(express.json());

/* ========================================
   DELIVERABLES PARSER
   Parses Markdown deliverable files into
   structured vulnerability data
   ======================================== */
function parseMarkdownDeliverable(content, filename) {
  const vulns = [];
  const sections = content.split(/^## /m).filter(Boolean);

  for (const section of sections) {
    const lines = section.trim().split('\n');
    const title = lines[0]?.trim();
    if (!title) continue;

    // Try to extract vulnerability-like sections
    const severityMatch = content.match(/severity[:\s]*(critical|high|medium|low)/i);
    const cvssMatch = section.match(/CVSS[:\s]*(\d+\.?\d*)/i);
    const cweMatch = section.match(/(CWE-\d+)/i);
    const endpointMatch = section.match(/endpoint[:\s]*[`"]?([A-Z]+\s+\/\S+)/i);

    // Extract sub-sections
    const descMatch = section.match(/###?\s*(?:Description|Descri[çc][ãa]o|Explanation)\s*\n([\s\S]*?)(?=\n###?|\n##|$)/i);
    const impactMatch = section.match(/###?\s*(?:Impact|Impacto)\s*\n([\s\S]*?)(?=\n###?|\n##|$)/i);
    const remMatch = section.match(/###?\s*(?:Remediation|Remedia[çc][ãa]o|Fix|Mitigation)\s*\n([\s\S]*?)(?=\n###?|\n##|$)/i);
    const evidenceMatch = section.match(/###?\s*(?:Evidence|Evid[êe]ncia|Proof|PoC)\s*\n([\s\S]*?)(?=\n###?|\n##|$)/i);

    if (severityMatch || cvssMatch || cweMatch || descMatch) {
      vulns.push({
        title: title.replace(/^#+\s*/, ''),
        severity: severityMatch ? severityMatch[1].toLowerCase() : 'medium',
        cvss: cvssMatch ? parseFloat(cvssMatch[1]) : null,
        cwe: cweMatch ? cweMatch[1] : null,
        endpoint: endpointMatch ? endpointMatch[1] : null,
        explanation: descMatch ? descMatch[1].trim() : '',
        impact: impactMatch ? impactMatch[1].trim() : '',
        remediation: remMatch ? remMatch[1].trim() : '',
        evidence: evidenceMatch ? evidenceMatch[1].trim() : '',
        source: filename
      });
    }
  }

  return vulns;
}

/* ========================================
   API ROUTES
   ======================================== */

/* ── GET /api/scans - List all scan sessions ── */
app.get('/api/scans', async (req, res) => {
  try {
    const auditDir = join(ROOT, 'audit-logs');
    if (!existsSync(auditDir)) return res.json([]);

    const entries = await readdir(auditDir, { withFileTypes: true });
    const scans = [];

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const sessionPath = join(auditDir, entry.name, 'session.json');
      if (!existsSync(sessionPath)) continue;

      try {
        const data = JSON.parse(await readFile(sessionPath, 'utf-8'));
        scans.push({
          id: entry.name,
          ...data,
          dirName: entry.name
        });
      } catch { /* skip malformed */ }
    }

    res.json(scans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── GET /api/scans/:id - Single scan detail ── */
app.get('/api/scans/:id', async (req, res) => {
  try {
    const sessionPath = join(ROOT, 'audit-logs', req.params.id, 'session.json');
    if (!existsSync(sessionPath)) return res.status(404).json({ error: 'Scan not found' });

    const data = JSON.parse(await readFile(sessionPath, 'utf-8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── GET /api/scans/:id/deliverables - Parse deliverable files ── */
app.get('/api/scans/:id/deliverables', async (req, res) => {
  try {
    const scanDir = join(ROOT, 'audit-logs', req.params.id);
    if (!existsSync(scanDir)) return res.status(404).json({ error: 'Scan not found' });

    const files = await readdir(scanDir);
    const deliverables = [];

    for (const file of files) {
      if (extname(file) !== '.md') continue;

      const content = await readFile(join(scanDir, file), 'utf-8');
      const fileStat = await stat(join(scanDir, file));

      deliverables.push({
        filename: file,
        size: fileStat.size,
        modified: fileStat.mtime,
        vulns: parseMarkdownDeliverable(content, file),
        preview: content.substring(0, 500)
      });
    }

    res.json(deliverables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── GET /api/vulnerabilities - All parsed vulnerabilities ── */
app.get('/api/vulnerabilities', async (req, res) => {
  try {
    const auditDir = join(ROOT, 'audit-logs');
    if (!existsSync(auditDir)) return res.json([]);

    const entries = await readdir(auditDir, { withFileTypes: true });
    const allVulns = [];

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const scanDir = join(auditDir, entry.name);
      const files = await readdir(scanDir);

      for (const file of files) {
        if (extname(file) !== '.md') continue;
        try {
          const content = await readFile(join(scanDir, file), 'utf-8');
          const vulns = parseMarkdownDeliverable(content, file);
          vulns.forEach(v => { v.scanId = entry.name; });
          allVulns.push(...vulns);
        } catch { /* skip */ }
      }
    }

    res.json(allVulns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── GET /api/reports/:id/pdf - PDF export ── */
app.get('/api/reports/:id/pdf', async (req, res) => {
  try {
    const scanDir = join(ROOT, 'audit-logs', req.params.id);
    if (!existsSync(scanDir)) return res.status(404).json({ error: 'Scan not found' });

    // Read session data
    const sessionPath = join(scanDir, 'session.json');
    let sessionData = {};
    if (existsSync(sessionPath)) {
      sessionData = JSON.parse(await readFile(sessionPath, 'utf-8'));
    }

    // Read deliverables
    const files = await readdir(scanDir);
    const mdFiles = files.filter(f => extname(f) === '.md');
    const deliverableContents = [];

    for (const file of mdFiles) {
      const content = await readFile(join(scanDir, file), 'utf-8');
      deliverableContents.push({ filename: file, content });
    }

    // Generate HTML-based PDF report
    const html = generatePDFHtml(req.params.id, sessionData, deliverableContents);

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `inline; filename="shield-report-${req.params.id}.html"`);
    res.send(html);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function generatePDFHtml(scanId, session, deliverables) {
  const now = new Date().toISOString().split('T')[0];
  const mdToHtml = (md) => md
    .replace(/^### (.*)/gm, '<h3>$1</h3>')
    .replace(/^## (.*)/gm, '<h2>$1</h2>')
    .replace(/^# (.*)/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/^- (.*)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>ConstruData Shield - Security Report ${scanId}</title>
<style>
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  body { font-family: 'Segoe UI', system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1a1a2e; line-height: 1.6; }
  .header { background: #2A428C; color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
  .header h1 { margin: 0 0 5px; font-size: 24px; }
  .header .subtitle { opacity: 0.8; font-size: 14px; }
  .header .meta { margin-top: 15px; display: flex; gap: 20px; font-size: 12px; opacity: 0.9; }
  h2 { color: #2A428C; border-bottom: 2px solid #FFEF4D; padding-bottom: 8px; margin-top: 30px; }
  h3 { color: #334d9e; margin-top: 20px; }
  .severity { display: inline-block; padding: 2px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
  .severity.critical { background: #fde8e8; color: #dc2626; }
  .severity.high { background: #fff3e0; color: #ea580c; }
  .severity.medium { background: #fffde7; color: #ca8a04; }
  .severity.low { background: #e8f4fd; color: #2563eb; }
  code { background: #f1f5f9; padding: 2px 6px; border-radius: 3px; font-size: 13px; }
  pre { background: #1e293b; color: #e2e8f0; padding: 16px; border-radius: 8px; overflow-x: auto; }
  pre code { background: none; color: inherit; }
  table { width: 100%; border-collapse: collapse; margin: 16px 0; }
  th, td { border: 1px solid #e2e8f0; padding: 10px 14px; text-align: left; font-size: 13px; }
  th { background: #f8fafc; color: #475569; font-weight: 600; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
  .deliverable { page-break-before: always; margin-top: 30px; }
  .deliverable:first-of-type { page-break-before: auto; }
  .print-btn { background: #2A428C; color: white; border: none; padding: 10px 24px; border-radius: 6px; cursor: pointer; font-size: 14px; margin-bottom: 20px; }
  .print-btn:hover { background: #1e3070; }
  @media print { .print-btn { display: none; } }
</style>
</head>
<body>
<button class="print-btn" onclick="window.print()"><strong>⬇ Imprimir / Salvar como PDF</strong></button>
<div class="header">
  <h1>🛡️ ConstruData Shield</h1>
  <div class="subtitle">Security Assessment Report</div>
  <div class="meta">
    <span>Scan: ${scanId}</span>
    <span>Date: ${now}</span>
    <span>Generated by: ConstruData Shield AI Pipeline</span>
  </div>
</div>

<h2>Executive Summary</h2>
<p>This report was generated by ConstruData Shield's AI-powered security testing pipeline, which uses 13 specialized Claude Opus agents to perform comprehensive penetration testing.</p>

${session.target ? `<table><tr><th>Target</th><td>${session.target}</td></tr><tr><th>Scan Type</th><td>${session.type || 'Full Scan'}</td></tr><tr><th>Status</th><td>${session.status || 'Complete'}</td></tr></table>` : ''}

${deliverables.map(d => `
<div class="deliverable">
  <h2>${d.filename.replace('.md', '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</h2>
  <p>${mdToHtml(d.content)}</p>
</div>
`).join('')}

<div class="footer">
  ConstruData Shield &copy; ${new Date().getFullYear()} — AI-Powered Security Testing Platform<br>
  This report is confidential and intended for authorized personnel only.
</div>
</body>
</html>`;
}

/* ========================================
   WEBSOCKET - Live Scan Updates
   Broadcasts real-time agent progress
   ======================================== */
const wss = new WebSocketServer({ server, path: '/ws' });
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  ws.on('close', () => clients.delete(ws));
  ws.on('error', () => clients.delete(ws));

  // Send current status on connect
  ws.send(JSON.stringify({ type: 'connected', timestamp: Date.now() }));
});

function broadcast(data) {
  const msg = JSON.stringify(data);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  }
}

// Export broadcast for external use (e.g., from scan runner)
app.locals.broadcast = broadcast;

/* ── API to push scan events (called by the scan runner) ── */
app.post('/api/events', (req, res) => {
  const event = req.body;
  broadcast({
    type: 'scan-event',
    ...event,
    timestamp: Date.now()
  });
  res.json({ ok: true });
});

/* ── Fallback: SPA ── */
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

/* ── Start ── */
server.listen(PORT, () => {
  console.log(`\n  🛡️  ConstruData Shield Dashboard`);
  console.log(`  ➜  http://localhost:${PORT}`);
  console.log(`  ➜  WebSocket: ws://localhost:${PORT}/ws\n`);
});
