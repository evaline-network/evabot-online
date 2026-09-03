# Changelog: EvaBot Online

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.3.0] - 2026-09-03
### Added
- **Multi-Provider LLM Router (`UniversalLlmClient.ts`):** Support for Google Gemini, OmniRoute (`100.66.98.4:20128/v1`), OpenRouter.ai (100+ free & paid models), and OpenCode Go.
- **Consilium Multi-Agent Debate Engine (`ConsiliumEngine.ts`):**
  - Solo Model Chat (1 user -> 1 model).
  - Broadcast Mode (concurrent execution across $N$ models).
  - Dual Model Dialogue (2 models in multi-round argumentative debate).
  - Consilium Mode (3-10 models in structured multi-round deliberation with consensus synthesis).
- **2-Screen B&W Cyber-Terminal UI:** Ultra-minimalist Black & White aesthetic with strict Traffic Light status indicators (🟢 Ready/Free, 🟡 Busy/Paid, 🔴 Error/Offline) and smooth spring scroll to Control Deck.
- **Instant Reactive Trilingual Switcher (EN / UK / RU):** Zero-reload in-place switching of all interface strings, badges, and system prompts.
- **EvaLine Corporate Roles & Hybrid Knowledge Base (`CorporateRoles.ts`):** Pre-configured corporate agent personas (Architect, DevOps, Security Auditor, General Assistant, Data Engineer) backed by hybrid PostgreSQL + Qdrant vector retrieval connector.
- **Automated 7-Suite Test Suite (100% Pass):** Testing ModelRegistry, ChatSession, Server API, Core Engine, Universal Client, Consilium debate engine, and Corporate Roles.
- **Strict Currency Policy:** Complete enforcement of USD ($) and EUR (€) without rubles (RUB / ₽).
- **4-Way Synchronization:** Workstation, Powerful Server (`evabot-agent-vm`), Microserver (`evaline-micro-vm`), and GitHub (`evaline-network/evabot-online`).

## [0.2.2] - 2026-09-03
### Added
- **Hybrid "Face & Brain" Topology:**
  - Microserver `evaline-micro-vm` (The Face): Caddy SSL reverse proxy and static asset server (0% compute load).
  - Powerful server `evabot-agent-vm` (The Brain): 8 vCPUs, 32 GB RAM DDR5 running `evabot-brain.service` on port 3000 across Tailscale.
- **Zero-Config Google Cloud Authentication:** Ambient OAuth2 resolution for `evabot.online@gmail.com` via VM metadata and ADC.
- **Google Model Garden Catalog:** 20 models across 8 categories with USD ($) and EUR (€) pricing.

## [0.2.0] - 2026-09-03
### Added
- Modular TypeScript backend architecture with SSE streaming.
- Terminal CLI REPL (`npm run cli`).
- Comprehensive automated test suite (`tests/index.ts`).
- Public GitHub repository: [evaline-network/evabot-online](https://github.com/evaline-network/evabot-online).

## [0.1.0] - 2026-09-03
### Added
- Initial infrastructure diagnosis and legacy archive snapshot.
