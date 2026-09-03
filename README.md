# EvaBot & Evaline Online // Modular Enterprise Ecosystem

Autonomous AI agent platform and cloud infrastructure deployed on **Google Cloud Platform (GCP)**.

- **Production URL:** [https://evabot.online](https://evabot.online)
- **Edge Proxy:** `evaline-micro-vm` (e2-micro Always Free, Iowa, us-central1-a)
- **Compute Core:** `evabot-agent-vm` (c3-standard-8 Sapphire Rapids, Frankfurt, europe-west3-a)
- **AI Core:** Google AI Pro (Gemini 2.0 / 1.5 Pro) with 2,000,000 token context window
- **Security:** Private WireGuard Mesh (Tailscale 100.125.200.49), TLS 1.3, HTTP/3 QUIC (Caddy)

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
- Russian: `evabot_modular_architecture.ru.md`
- Ukrainian: `evabot_modular_architecture.uk.md`

## License

Proprietary © 2026 EvaBot Ecosystem.
