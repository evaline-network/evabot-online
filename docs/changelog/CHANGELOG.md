# Changelog

All notable changes to EvaBot Online will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v0.0.2] - 2026-09-07 — Refactored & Hardened

### 🛡️ Added - Security
- **IP blocking system** with 8 pre-blocked malicious IPs (45.148.10.9, 43.157.188.74, etc.)
- **Rate limiting** middleware (100 req/min per IP)
- **17 regex patterns** for suspicious path detection (WordPress/.env/admin/etc)
- **Auto-block** mechanism: 20 suspicious requests → 24h ban
- **Security endpoints**: `GET/POST /api/security/{status,report,block,unblock}`

### 📚 Added - Knowledge Base
- **EvaLine Knowledge Base integration**: 182 documents loaded from `evaline-com-ua`
- **6 languages supported**: EN, UK, RU, PL, RO, DE
- **4 backend types**: memory (active), json, sqlite, vector
- **Full-text search** with relevance scoring
- **/kb command** for terminal-style control
- **KB endpoints**: `GET/POST /api/kb/{status,search,list,backend,command}`

### 🚨 Added - Alerting System
- **Multi-channel alerts**: console, file, webhook, email, syslog, desktop
- **4 severity levels**: low, medium, high, critical
- **Rate limiting** (60s cooldown per alert type)
- **Alert endpoints**: `GET/POST /api/alerts/{stats,send,channel,config}`
- **Auto-integration** with Security module
- **Environment variable config**: `ALERT_WEBHOOK_URL`, `ALERT_EMAIL_TO`, `SYSLOG_HOST`

### 📊 Added - Comprehensive Logging
- **12 log categories**: SYSTEM, HTTP, USER, LLM, MODEL, KB, STORAGE, AUTH, PROCESS, DIAG, CLI, BROWSER
- **3 log files**: `evabot.log`, `user-actions-{date}.log`, `errors-{date}.log`
- **HTTP request logging** with IP, User-Agent, duration
- **In-memory buffer** (1000 entries) for fast access
- **Log endpoints**: `GET /api/logs/{files,read,recent}`

### 🏗️ Changed - Refactoring
- **server.ts refactored** from 815 → 211 lines (-74%)
- **Modular router architecture**: 7 separate route files
- **Router.ts base class** with RouteContext + withErrorHandling wrapper
- **ChatRouter** (89 lines) - chat, stream, consilium, roles
- **ModelsRouter** (55 lines) - models, top, free, paid
- **KbRouter** (70 lines) - KB endpoints
- **LogsRouter** (30 lines) - logs endpoints
- **SecurityRouter** (39 lines) - security endpoints
- **AlertsRouter** (41 lines) - alerts endpoints

### 🐛 Fixed - Critical Bugs
- **ConsiliumEngine.ts** was BROKEN (12 TypeScript errors)
  - Added `ModelRegistry.estimateTokens()` method
  - Added `ModelRegistry.calculateCost()` method
  - Added `ModelRegistry.getTop10FreeModels()` method
  - Added `ModelRegistry.getTop10PaidSmartestModels()` method
  - Added `TokenCostEstimate` interface
  - **Result: 0 TypeScript errors** (was 12)
- **UniversalLlmClient.ts** - removed invalid `tier === 'OpenRouter Paid'` check
- **KB JSON.stringify** was crashing on Set serialization
  - Replaced recursive `getBackendDescription()` with static lookup
  - Fixed `Set` → `Array.from()` conversion

### 🗑️ Removed
- **`dist/` from Git** (1.3MB, 114 files) - now in .gitignore
- **`legacy_archive/`** (17MB, 32 files) - old code, now in .gitignore
- **`src/plugins/voice/`** (5 files) - unused voice plugin code
- **`src/web/voice/`** (5 files) - unused voice UI code
- **`.env.bak`** - backup file with potential secrets

### 📁 Added
- **`config/Caddyfile`** - production reverse proxy with WAF, rate limits, security headers
- **`config/fail2ban-filter.conf`** - fail2ban filter for EvaBot logs
- **`config/fail2ban-jail.conf`** - 2 jails (attack + rate)
- **`.github/workflows/deploy.yml`** - CI/CD for 2-server monorepo deploy
- **`docs/security/SECURITY_AUDIT.md`** - full security audit report
- **`docs/models/MODELS_CATALOG.md`** - separated free/paid models
- **`docs/deployment/MONOREPO.md`** - monorepo documentation
- **`docs/development/v0.0.1-IMPLEMENTATION.md`** - v0.0.1 implementation report

### 🔒 Security
- Detected and blocked **432 WordPress exploit attempts** from IP 45.148.10.9 (Techoff SRV, NL)
- Blocked CVE-2024-31210 (Batch RCE, CVSS 9.8)
- Blocked CVE-2024-32336 (Gravity SMTP LFI, CVSS 7.5)
- 8 unique attacker IPs identified from NL, BR, US, DE, TH, SG
- **0 successful attacks** (WordPress not installed)

---

## [v0.0.1] - 2026-09-03 — MVP Release

### Added
- Initial cyber-terminal interface (TUI + Web)
- UniversalLlmClient with 78 models
- Google Gemini, OmniRoute, OpenRouter, OpenCode providers
- Basic ModelRegistry with 78 models
- Chat endpoint (POST /api/chat)
- Streaming chat (POST /api/chat/stream)
- Consilium engine (4 modes: solo, broadcast, dialogue, consilium)
- Boot diagnostics
- Cluster monitor (Frankfurt + Iowa)
- Health check endpoint
- Worklog API (TSV/LOG/TXT/MD formats)

---

## [Unreleased] - Planned

### v0.1.0
- [ ] Vector embeddings (Gemini embedding-004)
- [ ] ChromaDB integration
- [ ] Real semantic search
- [ ] Frontend mobile-optimized UI
- [ ] localStorage chat history
- [ ] Code highlighting
- [ ] Copy buttons

### v0.2.0
- [ ] Consilium v2 with 10+ agents
- [ ] Voting system
- [ ] Consensus arbiter improvement
- [ ] WebSocket real-time chat

### v0.3.0
- [ ] Voice input/output
- [ ] Audio streaming
- [ ] Chat export (PDF, Markdown)
- [ ] Multi-language UI improvements

### v0.4.0
- [ ] Mobile app (PWA)
- [ ] OAuth2 authentication
- [ ] Multi-user sessions
- [ ] Usage analytics
- [ ] Billing dashboard

---

**Format:** [Keep a Changelog](https://keepachangelog.com/)  
**Versioning:** [Semantic Versioning](https://semver.org/)  
**Status:** Active development
