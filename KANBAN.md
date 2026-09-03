# 📋 EvaBot Modular Multi-LLM System — Project Kanban Board

**Last Updated:** September 3, 2026  
**Standards:** Strictly USD ($) & EUR (€) • Trilingual Parity (EN/RU/UK) • 100% Test Coverage  
**Topology:** Hybrid (Microserver = Face / Powerful Server = Brain)  

---

## 🚀 Active Sprints & Swimlanes

### 🟢 1. Done / Completed
- [x] **TASK-13:** **Terminal-First Modern TUI (`src/cli/terminal-chat.ts`):**
  - Advanced TUI with live ASCII collapsible accordions (`[+] / [-]`), interactive toggle controls, and character-perfect cyber-terminal aesthetic.
- [x] **TASK-14:** **Gemini 3.x Frontier Fleet Registry:**
  - Complete integration of `gemini-3.8-flash`, `gemini-3.1-pro`, and `gemini-3.1-flash` with token limits, free tier details, and strict USD ($) / EUR (€) pricing (34 models total).
- [x] **TASK-15:** **Live Startup Boot Sequence & Dual-Server Diagnostics:**
  - Detailed line-by-line boot initialization log in both Terminal and Web (`/api/diagnostics/boot`).
  - Live health probe for Web Server (`evaline-micro-vm`) and Agent Server (`evabot-agent-vm`).
  - Google Cloud ambient auth check, model availability audit, and token balance inspection.
- [x] **TASK-16:** **Accordion-First Architecture (`<details>/<summary>`):**
  - Full structural alignment of Web and Terminal on collapsible accordions: Boot Log, Server Telemetry, Neural Providers, Model Catalog, Consilium, Corporate Roles, and Chat Stream.
- [x] **TASK-01:** GCP Infrastructure Audit & Resource Diagnostics (`evaline-micro-vm` & `evabot-agent-vm`).
- [x] **TASK-02:** Face & Brain Decoupling:
  - Microserver (`evaline-micro-vm`) configured as Face with Caddy SSL & static file server (0% compute load).
  - Powerful server (`evabot-agent-vm`, 8 vCPUs, 32 GB RAM DDR5) configured as Brain via `evabot-brain.service` on port 3000 (`100.66.98.4:3000`).
- [x] **TASK-03:** Ambient Google Cloud Authentication (`evabot.online@gmail.com`) via GCE Metadata & ADC.
- [x] **TASK-04:** GitHub Repository Setup: [evaline-network/evabot-online](https://github.com/evaline-network/evabot-online).
- [x] **TASK-05:** Automated Testing Suite (`tests/index.ts` passing 100%).
- [x] **TASK-06:** **Multi-Provider LLM Integration Hub (`UniversalLlmClient.ts`):**
  - Google Gemini & Vertex AI (Ambient OAuth & API Keys).
  - OmniRoute Daemon (`evabot-agent-vm:20128/v1`).
  - OpenRouter API (100+ models, both Free and Paid).
  - OpenCode & OpenCode Go API.
- [x] **TASK-07:** **Consilium & Multi-Agent Debate Engine (`ConsiliumEngine.ts`):**
  - Solo Model Chat (1 user -> 1 model).
  - Multi-Model Broadcast (1 prompt -> $N$ models parallel answers).
  - Dual Model Dialogue (2 LLMs debate/discuss a question in text and audio).
  - Multi-Agent Consilium (3 to 10 LLMs engage in multi-round discussion with consensus synthesis).
- [x] **TASK-08:** **2-Screen B&W Cyber-Terminal UI:**
  - Minimalist high-contrast Black & White aesthetic.
  - Traffic light status indicators (🟢 Ready/Free, 🟡 Busy/Paid, 🔴 Error/Offline).
  - Screen 1: Clean conversational terminal chat with bottom input and `[ ↓ CONTROL PANEL ]` button.
  - Screen 2: Control Deck (scrolled down smoothly) with settings, model hubs, corporate roles, and telemetry.
- [x] **TASK-09:** **Instant Reactive Trilingual Switcher (EN / UK / RU):**
  - Zero-page-reload reactive language switching across all UI labels and system prompts.
- [x] **TASK-10:** **EvaLine Corporate Roles & Knowledge Base Connectors (`CorporateRoles.ts`):**
  - Standardized agent roles (Architect, DevOps, Auditor, Corporate Assistant, Data Engineer).
  - Hybrid Database connector (PostgreSQL relational + Qdrant vector retrieval).
- [x] **TASK-11:** **4-Way Workspace Synchronization:**
  - Local Workstation (`/home/fedor/Desktop/evabot-online`).
  - Powerful Server `evabot-agent-vm` (`/home/evabot/Desktop/evabot-online` & `/var/www/evabot-backend`, `evabot-brain.service`).
  - Microserver `evaline-micro-vm` (`/var/www/evabot.online`, Caddy SSL gateway).
  - GitHub (`https://github.com/evaline-network/evabot-online.git:main`).
- [x] **TASK-12:** **Comprehensive Logging & 100% Test Coverage:**
  - 7 test suites passing 100% across all models, providers, modes, and currency rules (`npm test`).
  - Strict compliance with USD ($) and EUR (€) financial policy without rubles (RUB / ₽).

---


---

## 📊 Task Matrix & Status

| Task ID | Component | Priority | Assigned Agent / Role | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TASK-06** | Multi-Provider Engine (OmniRoute/OpenRouter/OpenCode) | P0 (Critical) | `CoreEngineSubagent` | 🟢 Done |
| **TASK-07** | Consilium & Dialogue Multi-Agent Debate | P0 (Critical) | `CoreEngineSubagent` | 🟢 Done |
| **TASK-08** | 2-Screen B&W Cyber-Terminal UI & Traffic Lights | P0 (Critical) | `FrontendCyberSubagent` | 🟢 Done |
| **TASK-09** | Instant Trilingual Client (EN/UK/RU) | P1 (High) | `FrontendCyberSubagent` | 🟢 Done |
| **TASK-10** | EvaLine Corporate Roles & Knowledge Hub | P1 (High) | `CoreEngineSubagent` | 🟢 Done |
| **TASK-11** | 4-Way Node Synchronization (`evabot` user) | P0 (Critical) | `TestAndSyncSubagent` | 🟢 Done (Verified Live) |
| **TASK-12** | 100% Test Coverage & Execution Logging | P1 (High) | `TestAndSyncSubagent` | 🟢 Done (100% Pass) |
