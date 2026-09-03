# 📋 EvaBot Modular Multi-LLM System — Project Kanban Board

**Last Updated:** September 3, 2026  
**Standards:** Strictly USD ($) & EUR (€) • Trilingual Parity (EN/RU/UK) • 100% Test Coverage  
**Topology:** Hybrid (Microserver = Face / Powerful Server = Brain)  

---

## 🚀 Active Sprints & Swimlanes

### 🟢 1. Done / Completed
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
- [x] **TASK-12:** **Comprehensive Logging & 100% Test Coverage:**
  - 7 test suites passing 100% across all models, providers, modes, and currency rules (`npm test`).
  - Strict compliance with USD ($) and EUR (€) financial policy without rubles (RUB / ₽).

---

### 🟡 2. In Progress / Under Execution
- [ ] **TASK-11:** **4-Way Workspace Synchronization:**
  - Workstation (`/home/fedor/Desktop/evabot-online`).
  - Powerful Server (`/home/evabot/Desktop/evabot-online` & `/var/www/evabot-backend`).
  - Microserver (`/var/www/evabot.online`).
  - GitHub (`evaline-network/evabot-online:main`).

---

## 📊 Task Matrix & Status

| Task ID | Component | Priority | Assigned Agent / Role | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TASK-06** | Multi-Provider Engine (OmniRoute/OpenRouter/OpenCode) | P0 (Critical) | `CoreEngineSubagent` | 🟢 Done |
| **TASK-07** | Consilium & Dialogue Multi-Agent Debate | P0 (Critical) | `CoreEngineSubagent` | 🟢 Done |
| **TASK-08** | 2-Screen B&W Cyber-Terminal UI & Traffic Lights | P0 (Critical) | `FrontendCyberSubagent` | 🟢 Done |
| **TASK-09** | Instant Trilingual Client (EN/UK/RU) | P1 (High) | `FrontendCyberSubagent` | 🟢 Done |
| **TASK-10** | EvaLine Corporate Roles & Knowledge Hub | P1 (High) | `CoreEngineSubagent` | 🟢 Done |
| **TASK-11** | 4-Way Node Synchronization (`evabot` user) | P0 (Critical) | `TestAndSyncSubagent` | 🟡 In Progress |
| **TASK-12** | 100% Test Coverage & Execution Logging | P1 (High) | `TestAndSyncSubagent` | 🟢 Done (100% Pass) |
