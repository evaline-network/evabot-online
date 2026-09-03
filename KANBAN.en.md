# EVABOT ONLINE // MASTER SYSTEM KANBAN BOARD (`KANBAN.en.md`)

> **System Version:** v2.7.0 (TypeScript Core & `md-ui` Plugin Architecture)  
> **Production Live URL:** [https://evabot.online](https://evabot.online)  
> **GitHub Repository:** [`evabot-online/evaline-online`](https://github.com/evabot-online/evaline-online)  

---

## 📋 1. COMPLETED WORK (DONE)

| ID | TASK TITLE | COMPONENT / MODULE | DESCRIPTION & VERIFICATION |
|---|---|---|---|
| `TASK-101` | GCP Edge Server Provisioning | Infrastructure | Configured `evaline-micro-vm` (Iowa `e2-micro`, $0.00/mo Always Free) with Debian 13 Trixie & Caddy 2.11.4 TLS 1.3 (`evabot.online`). |
| `TASK-102` | GCP Primary Compute Server | Infrastructure | Deployed `evabot-agent-vm` (`c3-standard-8`, 8 vCPU, 32GB RAM, Frankfurt, ~$300.00/mo). |
| `TASK-103` | 3-Way Automated Sync Script | CI/CD & Deploy | Created `deploy-sync.sh` linking Desktop -> GitHub (`main`) -> Microserver (`/var/www/evabot.online`). |
| `TASK-104` | Full TypeScript Migration | Toolchain & Core | Migrated entire project to TS (`package.json`, `tsconfig.json`, `esbuild`, `tsx`, `@types/node`). |
| `TASK-105` | Plugin Architecture Core | Framework | Created `IEvaBotPlugin` contract and `PluginManager` registry with dynamic runtime enable/disable toggle. |
| `TASK-106` | Pure NO-CSS HTML TUI Grid | Layout & Interface | Built 100% NO-CSS HTML grid interface (`<table border="1">`) with nested `<details>` / `<summary>` accordions. |
| `TASK-107` | Expenses & Accounting Ledger | Financial Module | Implemented P&L accounting module strictly using **USD ($)** and **EUR (€)** currencies. |
| `TASK-108` | Multilingual Parallel Docs | Documentation | Created parallel documentation files in English (`*.en.md`), Russian (`*.ru.md`), and Ukrainian (`*.uk.md`). |
| `TASK-109` | Interactive Kanban Board | Web & CLI Plugin | Built interactive 4-column Kanban board plugin (`KanbanPlugin.ts`) and CLI viewer. |
| `TASK-110` | `md-ui` Markdown-to-UI Engine | Parser & Renderer | Created `MdUiParser.ts` to parse `.ui.md` Markdown files directly into NO-CSS HTML TUI table grids. |
| `TASK-111` | Automated CI Unit Test Suite | Testing & Quality | Implemented automated test runner in `src/cli.ts` (`npm test` — **8 PASSED, 0 FAILED**). |

---

## ⚡ 2. IN REVIEW & TESTING (REVIEW)

| ID | TASK TITLE | COMPONENT / MODULE | DESCRIPTION & VERIFICATION |
|---|---|---|---|
| `TASK-151` | Multilingual `md-ui` Templates | UI Templates | Created `dashboard.en.ui.md`, `dashboard.uk.ui.md`, and `dashboard.ru.ui.md`. |
| `TASK-152` | Web Speech API Narration | Voice Core | Integrated TTS/STT speech synthesis for system audit logs across English, Ukrainian, and Russian. |

---

## 🔍 3. IN PROGRESS (IN PROGRESS)

| ID | TASK TITLE | COMPONENT / MODULE | DESCRIPTION & TARGET |
|---|---|---|---|
| `TASK-181` | Real-time WebSocket Telemetry | Core Telemetry | Upgrading static node metrics to live WebSocket streaming telemetry from Frankfurt & Iowa nodes. |
| `TASK-182` | Omnichannel Webhook Routing | Messengers | Connecting Telegram Bot API and WhatsApp Business API webhooks to Gemini 2.0 LLM engine. |

---

## 📌 4. UPCOMING ROADMAP (BACKLOG)

| ID | TASK TITLE | PRIORITY | ESTIMATED COST | TARGET RELEASE |
|---|---|---|---|---|
| `TASK-201` | Multi-Region Automated Failover | HIGH | $0.00 (Mesh) | v2.8.0 |
| `TASK-202` | Live Telegram Bot Integration | HIGH | $0.00 (Bot API) | v2.8.0 |
| `TASK-203` | WhatsApp & Viber Gateway Webhooks | MED | $0.00 (Meta Cloud API) | v2.9.0 |
| `TASK-204` | Offline Voice Fallback (Whisper WASM) | MED | $0.00 (Client WASM) | v2.9.0 |
| `TASK-205` | Accounting CSV / PDF Export Engine | LOW | $0.00 (Client Export) | v3.0.0 |
| `TASK-206` | Custom `md-ui` Extended Components | LOW | $0.00 (Parser Ext) | v3.0.0 |
| `TASK-207` | PostgreSQL Persistent State Backend | MED | ~$15.00 / mo | v3.1.0 |
