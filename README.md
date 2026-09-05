# EvaBot & Evaline Online // Modular Enterprise Ecosystem

Autonomous AI agent platform and cloud infrastructure deployed on **Google Cloud Platform (GCP)**.

- **Production URL:** [https://evabot.online](https://evabot.online)
- **Edge Proxy:** `evaline-micro-vm` (e2-micro Always Free, Iowa, us-central1-a)
- **Compute Core:** `evabot-agent-vm` (c3-standard-8 Sapphire Rapids, Frankfurt, europe-west3-a)
- **AI Core:** Google AI Pro (Gemini 2.0 / 1.5 Pro) with 2,000,000 token context window
- **Security:** Private WireGuard Mesh (Tailscale 100.125.200.49), TLS 1.3, HTTP/3 QUIC (Caddy)
- **Locale Policy:** based in Odesa, Ukraine (UA); finances strictly USD ($) / EUR (€).

## Repository Layout (2026 refactor)

Strict split between business logic and UI:

- `backend/` — **FastAPI** (Python). All business logic: model registry, cost engine,
  consilium engine, roles, chat/stream endpoints, voice config, locale policy, diagnostics.
  Run: `python3 run.py` → `http://0.0.0.0:8000`
- `frontend/` — **TypeScript + Vite** (no framework). Stateless UI that pulls models,
  costs, roles, voice config from the backend. Run: `npx vite --port 5173`
  (dev proxy `/api` → `http://127.0.0.1:8000`). Build: `npm run build` (`tsc --noEmit && vite build`).
- `scripts/dev.sh` — starts backend + frontend together.
- `scripts/archive.sh` — full snapshot tar.gz into `archive_full/`.
- `archive_full/`, `legacy_archive/` — archived snapshots of the pre-refactor monolith.

## Architecture Overview

1. **Screen 1:** Gemini Conversational Core & Live Gemini Voice Assistant
2. **Screen 2:** Live Physical & Virtual Cluster Telemetry (10 vCPUs, 33 GB RAM, 120 GB Storage)
3. **Screen 3:** Financial & OpEx Cost Analytics (Strictly USD $ and EUR €)
4. **Screen 4:** AI Model Hub (Top-10 Smartest Frontier & Top-10 Free-Tier Models)
5. **Screen 5:** Omnichannel Messenger Gateways (Telegram, WhatsApp, Viber, Facebook Messenger)
6. **Screen 6:** Chronological Audit Log & Multilingual Neural Female Voice Engine (EN / RU / UK)

## Standalone Terminal CLI

Run the standalone interactive terminal client directly via Python:

```bash
python3 evabot-cli.py
```

Run non-interactive automated self-test:

```bash
python3 evabot-cli.py --test
```

## Documentation

- English: `evabot_modular_architecture.en.md`
- Ukrainian: `evabot_modular_architecture.uk.md`

## License

Proprietary © 2026 EvaBot Ecosystem.
