# EvaBot Online — Kanban Board

**Last Updated:** 2026-09-08  
**Current Sprint:** v0.0.2 → v0.1.0

---

## 📊 Board Overview

| Column | Count | Total Items |
|--------|-------|-------------|
| **Backlog** | 60 | v0.1.0 - v1.0.0 features (unchecked) |
| **In Progress** | 8 | v0.1.0 — INFRA-001..004, QA-002, QA-003 + TASK-340/342 in flight |
| **Review & Testing** | 0 | - |
| **Done (v0.1.0)** | 16 | ✅ TASK-320..329, 330..333, QA-001, 341 |
| **Done (v0.0.2)** | 23 | ✅ Completed |
| **Done (v0.0.1)** | 10 | ✅ MVP |

---

## ✅ DONE — v0.1.0 (2026-09-08)

### LLM Routing
- [x] **TASK-320**: `/auto` command — dynamic FREE-model selection per message: context volume + complexity (light/code/reasoning/longform) + provider limits (RPM) + CircuitBreaker health. Subcommands: `on | off | test <text> | fleet`. Aliases: `/авто`, `/автомат`, `/автопилот`. Wired into ChatEngine (Telegram) + ChatRouter (`/api/chat`, `/api/chat/stream`).
- [x] **TASK-321**: FIX fallback chain — removed dead `omni/cf-*` model ids (not in registry, 78 models) from `getSmartestFreeModel()`/`getFallbackChain()`; rebuilt trusted fleet from verified free ids with `isValidModel` guard.
- [x] **TASK-325**: `/subagent` command (2026-09-08) — SubagentEngine: N=1..4 параллельных LLM-субагентов (Analyst/Builder/Critic/Researcher) на ONLY-FREE моделях (nemotron-ultra/inkling/gemma-4/cohere/ling + omni/cf-* edge), Promise.allSettled, отказоустойчиво, затем синтез через `openrouter/free`. Команда: `/subagent [N] <task>`; CLI + Telegram (async) + web sync-hint. Реестр дополнен живыми omni/* моделями (§9c, LiteLLM демон починен: prisma client). Тесты: tests/subagent_engine.test.ts (hermetic, mocked client). Финальная живая верификация (2026-09-08, 10 субагентов): fix cleanModelId omni/ (демон отдаёт id С префиксом), OMNIROUTE_API_KEY=master key в .env, флот очищен от мёртвых моделей (inkling* 403, nemotron-ultra 45s+ timeout), /health + 15 мёртвых алиасов починены в CLI, /voices hijack на web устранён, /auto + /subagent добавлены в help (EN/UK/RU), Roboto (variable 100..900 + italic, base 16px) внедрён во все поверхности; 30/30 suites green; chат OK через openrouter/free и omni/* (both providers).
- [x] **TASK-322**: MODEL POLICY — Gemini (наш Google-аккаунт) ЗАРЕЗЕРВИРОВАН для разработки: модель входа `openrouter/free` (Free Models Router), фолбэк-флот = ТОП-10 новейших умнейших 100%-free моделей, LIVE-верифицировано через OpenRouter API 2026-09-08 (`nvidia/nemotron-3-ultra-550b-a55b:free` 550B/1M ctx, `thinkingmachines/inkling:free` 1M, `dots-3-note-preview:free` 512k, Gemma 4 31B, Cohere North Mini Code, Ling 3.0 Flash, Poolside Laguna S 2.1, …). Прогрев: OPENROUTER_API_KEY из GCP Secret Manager. Старые 2025 `:free` id (deepseek-r1, gpt-4o-mini, …) на OpenRouter уже ПЛАТНЫЕ — убраны из флота. 10 новых моделей добавлены в ModelRegistry (§9b). Лимиты gemini-3.8-flash: free tier 15 RPM / 1M TPM / 1500 RPD.

### QA / Coverage (2026-09-08, c8 V8-coverage поверх тест-сюита)
- [x] **QA-001**: Backend `src/` — statements **82.7%**, branches **75.4%**, functions **83.9%**, lines **82.7%** (29 suites, c8 report: `coverage/coverage-summary.json`). Фронтенд `frontend/` — 0% (test-runner отсутствует, только `tsc --noEmit` + vite build gate). Цель v0.1.0: backend ≥ 85%, внедрить vitest для frontend.

---

## ✅ DONE — v0.1.0 wave 2 (2026-09-08 evening)

### Web / Frontend
- [x] **TASK-326**: FOUC / language-flash fix — early locale script applies language before first paint; EN static defaults baked into the HTML shell (no more EN-flash-then-locale flicker on web).
- [x] **TASK-327**: FIX chat hang root cause — web forced `provider:'google'`, so server-side requests for `openrouter/free` were routed to the Google API (hangs / empty replies). Provider is now derived server-side; client sends none. Added server-side EMPTY_STREAM guard (reasoning models returning no content now trigger fallback) + web stream watchdog 60s/120s with AbortController.
- [~] **TASK-340**: Roboto self-hosting + `[CSS:ON/OFF]` NOCSS toggle — IN PROGRESS (another agent): self-hosted fonts + css toggle wave in flight, not merged yet.
- [~] **TASK-342**: frontend vitest coverage push — IN PROGRESS (baseline 10.3% stmts, see QA-002).

### Backend / Model Fleet
- [x] **TASK-328**: model fleet LIVE-verification + pruning — OmniRoute fixed (prisma client), then fleet verified live: `thinkingmachines/inkling*` removed (403), `nemotron-ultra` removed (45s+ timeout). `/subagent` live-verified (90s run, synthesis OK).
- [x] **TASK-329**: stale static data cleanup — hardcoded counts (78 models), DB stats and 'Gemini 3.8 Flash' mentions neutralized in EN+UK+RU dictionaries; `/health` fixed; dead aliases cleaned in CLI; `/voices` hijack on web eliminated.
- [x] **TASK-341**: backend test suite — 30/30 suites green (`tests/index.ts`); backend coverage 82.7% statements (c8 V8).

---

## ✅ DONE — v0.0.2 (2026-09-07)

### Security
- [x] **TASK-201**: IP blocking system (8 malicious IPs blocked)
- [x] **TASK-202**: Rate limiting middleware (100 req/min)
- [x] **TASK-203**: 17 regex patterns for attack detection
- [x] **TASK-204**: Auto-block mechanism (20 suspicious → 24h ban)
- [x] **TASK-205**: Security endpoints (`/api/security/*`)

### Knowledge Base
- [x] **TASK-210**: EvaLine KB integration (182 documents)
- [x] **TASK-211**: 6 languages support
- [x] **TASK-212**: Multi-backend (memory/json/sqlite/vector)
- [x] **TASK-213**: /kb command for terminal
- [x] **TASK-214**: KB search & list endpoints

### Refactoring
- [x] **TASK-220**: server.ts: 815 → 211 lines (-74%)
- [x] **TASK-221**: 7 modular routers
- [x] **TASK-222**: Fixed ConsiliumEngine (12 errors → 0)
- [x] **TASK-223**: Removed dist/ from Git (1.3MB)
- [x] **TASK-224**: Removed legacy_archive/ (17MB)

### Documentation
- [x] **TASK-230**: Updated README.md
- [x] **TASK-231**: Created CHANGELOG.md
- [x] **TASK-232**: Created ROADMAP.md
- [x] **TASK-233**: Created SECURITY_AUDIT.md
- [x] **TASK-234**: Created ARCHITECTURE.md

### Alerting
- [x] **TASK-240**: AlertManager (6 channels, 4 severity levels)
- [x] **TASK-241**: Auto-integration with Security
- [x] **TASK-242**: Alert endpoints (`/api/alerts/*`)

---

## ✅ DONE — v0.0.1 (2026-09-03)

- [x] **TASK-100**: Initial cyber-terminal (TUI + Web)
- [x] **TASK-101**: UniversalLlmClient with 78 models
- [x] **TASK-102**: Google Gemini, OmniRoute, OpenRouter, OpenCode
- [x] **TASK-103**: ModelRegistry (78 models)
- [x] **TASK-104**: Chat endpoint (POST /api/chat)
- [x] **TASK-105**: Streaming chat (POST /api/chat/stream)
- [x] **TASK-106**: Consilium engine (4 modes)
- [x] **TASK-107**: Boot diagnostics
- [x] **TASK-108**: Cluster monitor (Frankfurt + Iowa)
- [x] **TASK-109**: Health check endpoint

---

## 🔄 IN PROGRESS — v0.1.0 (actual)

_Audit 2026-09-08: all code-verified DONE tasks above check out against the source; the following are genuinely still open:_

- [ ] **INFRA-001** (2026-09-08): systemd timer `evabot-registry-sync` not yet enabled (`config/evabot-registry-sync.{service,timer}` staged; enable needs root — sudo is tty-gated on this host). _Update 2026-09-08 evening: timer reported enabled — verify root-side on next session._
- [ ] **QA-002** (2026-09-08): frontend vitest coverage baseline 10.3% statements — goal ≥ 60% by v0.1.1 (DOM-heavy `app.ts` / `voice/*` deferred).
- [ ] **INFRA-002** (2026-09-08): OmniRoute (:20128) restart churn investigation — root cause of repeated litellm daemon restarts not yet identified.
- [ ] **INFRA-003** (2026-09-08): port 8092 firewall exposure review — confirm expected ingress scope or close.
- [ ] **QA-003** (2026-09-08 evening): web chat E2E per-model verification ongoing — every advertised model checked live through `/api/chat` + streaming path.
- [ ] **INFRA-004** (2026-09-08 evening): ConsiliumEngine synthesis may default to `gemini-2.5-pro` — verify and parameterize (should follow model policy / `openrouter/free`).

---

## 📋 BACKLOG — v0.1.0 (Sept 2026)

### Known Issues (found 2026-09-08 audit)
- [x] **TASK-330**: DONE 2026-09-08 — all 5 suites green (tests aligned with intentional de-emoji output; DeveloperMode test hermetic via env+Config stub; ServerTests LLM mocked — no live 503 flakes)
- [x] **TASK-331**: DONE 2026-09-08 — literal removed; lazy Secret Manager resolution (env → `gcloud secrets versions access evabot-gemini-api-key` → ''), in-memory cache, never logged; see docs/ops/SECRETS_MANAGER.md
- [x] **TASK-332**: DONE 2026-09-08 — superseded by TASK-322: Config.defaultModel='openrouter/free' (env), /api/models advertises smartest free = nvidia/nemotron-3-ultra-550b-a55b:free; single source of truth
- [x] **TASK-333**: DONE 2026-09-08 — `session_state` table in chat-history.db (auto_enabled, last_model); AutoModelRouter write-through with in-memory cache; 3 new assertions in tests
- [x] **TASK-323**: Auto-sync ModelRegistry with OpenRouter `/api/v1/models` (pricing $0 filter) on the model-monitor 12h timer — registry goes stale within a day (proven 2026-09-08: legacy `:free` ids became paid); update §9b fleet + free-model counts, alert on drift via AlertManager — DONE 2026-09-08: `scripts/sync-openrouter-registry.ts` (daily drift probe, exit 0, snapshot `data/model-monitor/openrouter-free-snapshot.json`) + `config/evabot-registry-sync.{service,timer}` (not yet enabled, root needed) + `docs/ops/MODEL_REGISTRY_SYNC.md`; first run: 7 added / 1 removed / 8 unchanged vs §9b
- [x] **TASK-324**: DONE 2026-09-08 (scaffold) — vitest + @vitest/coverage-v8 + jsdom wired in frontend/; 31 tests green (ansi/api/onboarding); baseline 10.3% stmts (DOM-тяжёлые app.ts/voice/* осознанно отложены); goal ≥ 60% by v0.1.1

### High Priority
- [ ] **TASK-300**: Vector embeddings (Gemini embedding-004)
- [ ] **TASK-301**: ChromaDB integration (local + remote)
- [ ] **TASK-302**: Real semantic search in KB
- [ ] **TASK-303**: Mobile-optimized UI (responsive)
- [ ] **TASK-304**: Chat history (localStorage + server-side)
- [ ] **TASK-305**: Code highlighting (highlight.js)
- [ ] **TASK-306**: Copy buttons on code blocks

### Medium Priority
- [ ] **TASK-310**: Streaming improvements (token-by-token)
- [ ] **TASK-311**: Better error messages
- [ ] **TASK-312**: Loading states
- [ ] **TASK-313**: Markdown rendering improvements

---

## 📋 BACKLOG — v0.2.0 (Oct 2026)

### Consilium v2
- [ ] **TASK-400**: 10+ agent deliberation (currently max 4)
- [ ] **TASK-401**: Voting system for consensus
- [ ] **TASK-402**: Improved arbiter with better synthesis
- [ ] **TASK-403**: Persona-based deliberation
- [ ] **TASK-404**: Parallel rounds for speed

### Real-time
- [ ] **TASK-410**: WebSocket server (replace SSE)
- [ ] **TASK-411**: Live typing indicators
- [ ] **TASK-412**: Multi-user sessions
- [ ] **TASK-413**: Live KB search in chat

---

## 📋 BACKLOG — v0.3.0 (Nov 2026)

### Voice
- [ ] **TASK-500**: Voice input (Web Speech API)
- [ ] **TASK-501**: Voice output (TTS via Gemini Live)
- [ ] **TASK-502**: Audio streaming
- [ ] **TASK-503**: Voice commands

### Export
- [ ] **TASK-510**: PDF export of conversations
- [ ] **TASK-511**: Markdown export with formatting
- [ ] **TASK-512**: JSON export for developers
- [ ] **TASK-513**: Share links (read-only snapshots)

### UI
- [ ] **TASK-520**: Dark/Light theme toggle
- [ ] **TASK-521**: Font customization
- [ ] **TASK-522**: Custom color schemes
- [ ] **TASK-523**: Accessibility (ARIA, keyboard nav)

---

## 📋 BACKLOG — v0.4.0 (Dec 2026)

### Mobile
- [ ] **TASK-600**: Progressive Web App (PWA)
- [ ] **TASK-601**: Offline mode (service worker)
- [ ] **TASK-602**: Push notifications
- [ ] **TASK-603**: Touch gestures
- [ ] **TASK-604**: Install prompts

### Authentication
- [ ] **TASK-610**: OAuth2 (Google, Microsoft)
- [ ] **TASK-611**: Multi-user sessions
- [ ] **TASK-612**: Per-user history
- [ ] **TASK-613**: Usage analytics
- [ ] **TASK-614**: Billing dashboard

---

## 📋 BACKLOG — v0.5.0 (Q1 2027)

### Compliance
- [ ] **TASK-700**: GDPR compliance tools
- [ ] **TASK-701**: Audit logging (immutable)
- [ ] **TASK-702**: Data residency controls
- [ ] **TASK-703**: Encryption at rest

### Integration
- [ ] **TASK-710**: n8n workflows integration
- [ ] **TASK-711**: Webhook subscriptions
- [ ] **TASK-712**: OpenAPI documentation
- [ ] **TASK-713**: GraphQL endpoint
- [ ] **TASK-714**: SDK (Python, JS, Go)

---

## 📋 BACKLOG — v1.0.0 (Q2 2027)

- [ ] **TASK-800**: 100% test coverage
- [ ] **TASK-801**: Performance benchmarks (p95 < 200ms)
- [ ] **TASK-802**: Multi-region deployment
- [ ] **TASK-803**: Auto-scaling
- [ ] **TASK-804**: Production SLA (99.9%)
- [ ] **TASK-805**: Full API reference
- [ ] **TASK-806**: Architecture deep-dive
- [ ] **TASK-807**: Operations manual
- [ ] **TASK-808**: Security whitepaper

---

## 📊 Sprint Burndown

### v0.0.2 Sprint (Completed 2026-09-07)
```
Days:    1  2  3  4  5  6  7
Tasks:  35 30 25 18 12  6  0  ✅ DONE
```

### v0.1.0 Sprint (Planned Sept 2026)
```
Week:    1  2  3  4
Tasks:  10  8  5  0  🎯 TARGET
```

---

## 🏷️ Labels

- `security` - Security-related
- `kb` - Knowledge Base
- `frontend` - UI/UX work
- `backend` - Server/API work
- `docs` - Documentation
- `infra` - Infrastructure/CI/CD
- `voice` - Voice features
- `mobile` - Mobile/PWA
- `breaking` - Breaking changes
- `bug` - Bug fix

---

## 📈 Velocity

| Sprint | Completed | Velocity |
|--------|-----------|-----------|
| v0.0.1 | 10 tasks | 10/sprint |
| v0.0.2 | 25 tasks | 25/sprint ⬆️ |
| v0.1.0 | 16 tasks | TBD |

---

**Owner:** EvaBot Engineering Team  
**Methodology:** Lightweight Scrum  
**Sprint Length:** 1 week
