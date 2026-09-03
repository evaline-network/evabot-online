# EvaBot Modular Architecture & Technical Specification

**Version:** 0.2.1  
**Status:** Active  
**Pricing Standards:** Strictly USD ($) and EUR (€)  

---

## 1. System Overview

EvaBot is a modular TypeScript application designed to provide conversational AI capabilities connected to the full Google Model Garden catalog (Gemini models under Google AI Pro, Gemma open models, and Anthropic Claude via Vertex AI).

The architecture delivers dual-surface operation:
1. **Interactive Terminal CLI (`npm run cli`):** Full-featured REPL with live streaming, slash commands, and real-time model catalog inspection.
2. **Web Browser UI (`https://evabot.online`):** Responsive dark interface with dynamic model details bar (pricing, token consumption limits, free vs paid badges), markdown rendering, code copying, and local API key management.

---

## 2. Google Model Garden Catalog & Pricing Breakdown

All models are categorized strictly by billing tier:

### 2.1 Free Quota Tier (Google AI Studio / Google AI Pro)
Zero cost under standard rate limits:
- **`gemini-2.5-flash` [Recommended]:** 1,048,576 tokens context, 8,192 max output. Free quota: 15 RPM, 1M TPM, 1,500 RPD ($0.00). Paid tier: $0.075 / 1M input, $0.30 / 1M output (€0.070 / €0.280).
- **`gemini-2.5-pro`:** 2,097,152 tokens context, 8,192 max output. Free quota: 2 RPM, 32k TPM, 50 RPD ($0.00). Paid tier: $1.25 / 1M input, $5.00 / 1M output (€1.17 / €4.68).
- **`gemini-2.0-flash`:** 1,048,576 tokens context, 8,192 max output. Free quota: 15 RPM, 1M TPM ($0.00). Paid tier: $0.10 / 1M input, $0.40 / 1M output (€0.093 / €0.375).
- **`gemini-2.0-flash-lite`:** 1,048,576 tokens context. Free quota: 30 RPM ($0.00). Paid tier: $0.075 / 1M input, $0.30 / 1M output (€0.070 / €0.280).
- **`gemini-1.5-pro`:** 2,097,152 tokens context. Free quota: 2 RPM ($0.00). Paid tier: $1.25 / 1M input, $5.00 / 1M output (€1.17 / €4.68).
- **`gemini-1.5-flash`:** 1,048,576 tokens context. Free quota: 15 RPM ($0.00). Paid tier: $0.075 / 1M input, $0.30 / 1M output (€0.070 / €0.280).
- **`gemma-2-27b`:** 8,192 tokens context. Open weights ($0.00 self-hosted) / Vertex AI compute rate.

### 2.2 Paid Only / Vertex AI Enterprise Tier
Billed directly to Google Cloud project:
- **`claude-3-7-sonnet`:** 200,000 tokens context. Pricing: $3.00 / 1M input, $15.00 / 1M output (€2.80 / €14.00).
- **`claude-3-5-sonnet`:** 200,000 tokens context. Pricing: $3.00 / 1M input, $15.00 / 1M output (€2.80 / €14.00).
- **`claude-3-5-haiku`:** 200,000 tokens context. Pricing: $0.80 / 1M input, $4.00 / 1M output (€0.75 / €3.75).

---

## 3. Remote Antigravity 2.0 Offloading Architecture

To leverage the compute resources of **`evabot-agent-vm`** (Frankfurt `c3-standard-8`: 8 vCPUs, 32 GB DDR5 RAM, 100 GB NVMe) without putting load on the local machine:

1. **Remote SSH Agent Execution:**
   - Antigravity 2.0 / Antigravity IDE connects to `evabot-agent-vm` via SSH (`34.179.253.183` or Tailscale `100.66.98.4`).
   - The Antigravity backend server runs as a remote process on `evabot-agent-vm`. All LLM agent iterations, subagent processes, file indexing, and bash tools execute on the 8 vCPUs of Frankfurt, resulting in 0% local CPU/RAM load.
2. **Web GUI Shell (Code-Server):**
   - Accessible on `evabot-agent-vm:8080`, providing a complete browser-based development shell where Antigravity agents can be monitored and commanded graphically.
