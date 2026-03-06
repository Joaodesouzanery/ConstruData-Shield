/* ========================================
   ConstruData Shield - SPA Dashboard App
   ======================================== */

/* ── Mock Data Store ── */
const Store = {
  scans: [
    { id: 'SC-0491', target: 'app.construdata.com', type: 'Full Pipeline', status: 'completed', vulns: 23, duration: '1h 12m', cost: 47.30, date: '2026-03-05' },
    { id: 'SC-0490', target: 'api.construdata.com', type: 'API Only', status: 'completed', vulns: 8, duration: '45m', cost: 31.20, date: '2026-03-04' },
    { id: 'SC-0489', target: 'portal.construdata.com', type: 'Full Pipeline', status: 'running', vulns: null, duration: '32m', cost: 18.50, date: '2026-03-06' },
    { id: 'SC-0488', target: 'auth.construdata.com', type: 'Auth Focus', status: 'completed', vulns: 5, duration: '28m', cost: 22.10, date: '2026-03-03' },
    { id: 'SC-0487', target: 'dashboard.construdata.com', type: 'Full Pipeline', status: 'failed', vulns: 12, duration: '56m', cost: 38.90, date: '2026-03-02' },
    { id: 'SC-0486', target: 'mobile-api.construdata.com', type: 'API Only', status: 'completed', vulns: 15, duration: '52m', cost: 35.60, date: '2026-03-01' },
    { id: 'SC-0485', target: 'admin.construdata.com', type: 'Full Pipeline', status: 'completed', vulns: 31, duration: '1h 25m', cost: 52.40, date: '2026-02-28' },
  ],

  vulns: [
    { id: 'V-001', title: 'SQL Injection in /api/users?search=', severity: 'critical', category: 'Injection', target: 'app.construdata.com', scan: 'SC-0491', status: 'open' },
    { id: 'V-002', title: 'Stored XSS via comment field in /posts', severity: 'critical', category: 'XSS', target: 'app.construdata.com', scan: 'SC-0491', status: 'open' },
    { id: 'V-003', title: 'JWT algorithm confusion (none accepted)', severity: 'critical', category: 'Authentication', target: 'auth.construdata.com', scan: 'SC-0488', status: 'open' },
    { id: 'V-004', title: 'IDOR in /api/orders/:id allows cross-user access', severity: 'high', category: 'Authorization', target: 'api.construdata.com', scan: 'SC-0490', status: 'open' },
    { id: 'V-005', title: 'SSRF via /api/import?url= parameter', severity: 'high', category: 'SSRF', target: 'api.construdata.com', scan: 'SC-0490', status: 'open' },
    { id: 'V-006', title: 'Reflected XSS in search query parameter', severity: 'high', category: 'XSS', target: 'portal.construdata.com', scan: 'SC-0489', status: 'open' },
    { id: 'V-007', title: 'Command injection via filename upload', severity: 'high', category: 'Injection', target: 'admin.construdata.com', scan: 'SC-0485', status: 'fixed' },
    { id: 'V-008', title: 'Missing rate limiting on /api/auth/login', severity: 'medium', category: 'Authentication', target: 'auth.construdata.com', scan: 'SC-0488', status: 'open' },
    { id: 'V-009', title: 'CORS misconfiguration allows any origin', severity: 'medium', category: 'Configuration', target: 'api.construdata.com', scan: 'SC-0490', status: 'open' },
    { id: 'V-010', title: 'Verbose error messages expose stack traces', severity: 'low', category: 'Information Disclosure', target: 'app.construdata.com', scan: 'SC-0491', status: 'open' },
    { id: 'V-011', title: 'Missing HSTS header', severity: 'low', category: 'Configuration', target: 'portal.construdata.com', scan: 'SC-0489', status: 'open' },
    { id: 'V-012', title: 'Session cookie missing Secure flag', severity: 'medium', category: 'Session', target: 'app.construdata.com', scan: 'SC-0491', status: 'fixed' },
  ],

  reports: [
    { id: 'R-001', title: 'app.construdata.com - Full Security Assessment', scan: 'SC-0491', date: '2026-03-05', vulns: 23, critical: 2, pages: 47 },
    { id: 'R-002', title: 'api.construdata.com - API Security Report', scan: 'SC-0490', date: '2026-03-04', vulns: 8, critical: 0, pages: 28 },
    { id: 'R-003', title: 'auth.construdata.com - Auth Focus Report', scan: 'SC-0488', date: '2026-03-03', vulns: 5, critical: 1, pages: 19 },
    { id: 'R-004', title: 'admin.construdata.com - Full Security Assessment', scan: 'SC-0485', date: '2026-02-28', vulns: 31, critical: 4, pages: 62 },
    { id: 'R-005', title: 'mobile-api.construdata.com - API Report', scan: 'SC-0486', date: '2026-03-01', vulns: 15, critical: 1, pages: 33 },
  ],

  getStats() {
    return {
      scans: this.scans.length,
      vulns: this.vulns.length,
      critical: this.vulns.filter(v => v.severity === 'critical').length,
    };
  },

  addScan(scan) {
    const id = `SC-${String(this.scans.length + 492).padStart(4, '0')}`;
    this.scans.unshift({ id, ...scan, status: 'running', vulns: null, cost: 0, date: new Date().toISOString().slice(0, 10) });
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
  settings: 'System Settings', help: 'Help Center',
};

function getPageFromHash() {
  return (window.location.hash.slice(1) || 'dashboard').split('/')[0];
}

function navigate(page) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });

  const breadcrumb = document.getElementById('breadcrumb');
  breadcrumb.innerHTML = `<span>Dashboard</span><i class="fas fa-chevron-right"></i><span class="breadcrumb-active">${PAGE_NAMES[page] || page}</span>`;

  const container = document.getElementById('page-container');
  const templateId = ({ dashboard:'tpl-dashboard', scans:'tpl-scans', vulnerabilities:'tpl-vulnerabilities', reports:'tpl-reports', help:'tpl-help' })[page];
  const template = document.getElementById(templateId || '');

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
  if (page === 'dashboard') initDashboard();
  else if (page === 'scans') initScans();
  else if (page === 'vulnerabilities') initVulnerabilities();
  else if (page === 'reports') initReports();
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
        { label: 'New', data: [320,280,340,290,380,450,420,390,360,410,370,330], backgroundColor: YELLOW, borderRadius: 3, borderSkipped: false, barPercentage: 0.7, categoryPercentage: 0.7 },
        { label: 'Resolved', data: [180,220,200,250,210,280,320,310,290,350,340,300], backgroundColor: NAVY_LIGHT, borderRadius: 3, borderSkipped: false, barPercentage: 0.7, categoryPercentage: 0.7 },
      ] },
    options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
      plugins: { legend: { display: false }, tooltip: { backgroundColor: '#172560', borderColor: 'rgba(255,239,77,0.15)', borderWidth: 1, padding: 12, cornerRadius: 8 } },
      scales: { x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 11, weight: '600' } } },
        y: { grid: { color: 'rgba(255,239,77,0.06)' }, border: { display: false }, beginAtZero: true, ticks: { callback: v => v >= 1000 ? `${v/1000}k` : v } } } },
  });
}

function initSeverityChart() {
  const canvas = document.getElementById('severityChart');
  if (!canvas) return;
  new Chart(canvas.getContext('2d'), {
    type: 'doughnut',
    data: { labels: ['Critical','High','Medium','Low'],
      datasets: [{ data: [47,189,1204,2451], backgroundColor: ['#ef4444','#f97316','#FFEF4D','#60a5fa'], borderColor: '#14204e', borderWidth: 3, hoverOffset: 6 }] },
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
    const scanId = Store.addScan({ target: (() => { try { return new URL(url).hostname; } catch { return url; } })(), type: typeInput.options[typeInput.selectedIndex].text.split(' (')[0], duration: '0m' });
    closeForm();
    renderScansTable('scans-table', Store.scans);
    showToast(`Scan ${scanId} created! Run the CLI command on your server to execute.`);
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
  function renderVulns(filter) {
    const list = document.getElementById('vuln-list');
    const filtered = filter === 'all' ? Store.vulns : Store.vulns.filter(v => v.severity === filter);
    list.innerHTML = filtered.length ? filtered.map(v =>
      `<div class="vuln-item ${v.severity}"><div class="vuln-severity ${v.severity}">${v.severity}</div><div class="vuln-info"><div class="vuln-title">${v.title}</div><div class="vuln-meta">${v.category} &middot; ${v.id} &middot; Scan #${v.scan} &middot; <span class="status-badge ${v.status==='open'?'failed':'success'}">${v.status}</span></div></div><div class="vuln-target">${v.target}</div></div>`
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
    `<div class="report-card"><div class="report-card-header"><div class="report-icon"><i class="fas fa-file-shield"></i></div><div><div class="report-title">${r.title}</div><div class="report-date">${r.date} &middot; Scan #${r.scan}</div></div></div><div class="report-stats"><div class="report-stat"><strong>${r.vulns}</strong> vulnerabilities</div><div class="report-stat"><strong>${r.critical}</strong> critical</div><div class="report-stat"><strong>${r.pages}</strong> pages</div></div><div class="report-footer"><span class="status-badge success">Complete</span><button class="btn-outline" style="font-size:11px;padding:5px 12px"><i class="fas fa-download"></i> Download PDF</button></div></div>`
  ).join('');
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

/* ── Init ── */
window.addEventListener('hashchange', () => navigate(getPageFromHash()));
document.addEventListener('DOMContentLoaded', () => navigate(getPageFromHash()));
