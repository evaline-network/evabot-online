# EvaBot Modular Architecture & Technical Specification

**Version:** 0.2.2  
**Status:** Active & Production Ready  
**Pricing Standards:** Strictly USD ($) and EUR (€)  

---

## 1. System Overview

EvaBot is a modular TypeScript application designed to provide conversational AI capabilities connected to the full Google Model Garden catalog (Gemini models under Google AI Pro, Gemma open weights models, and Google Cloud Vertex AI partner models).

The architecture delivers dual-surface operation:
1. **Interactive Terminal CLI (`npm run cli`):** Full-featured REPL with live streaming, slash commands, and real-time model catalog inspection.
2. **Web Browser UI (`https://evabot.online`):** Responsive dark interface with dynamic model details bar (pricing, token consumption limits, free vs paid badges), markdown rendering, code copying, and local API key management.

---

## 2. Google Model Garden Catalog & Specifications (20 Models Across 8 Categories)

All models are cataloged with strict context window, maximum output limit, and currency specifications in USD ($) and EUR (€). See [model_catalog.en.md](file:///home/fedor/Desktop/evabot-online/docs/model_catalog.en.md) for full matrix.

### 2.1 Google Gemini (Next-Gen)
- **`gemini-2.5-flash`** [Recommended]: Context: 1,048,576 tokens | Max Output: 8,192 tokens. Free quota: 15 RPM, 1M TPM, 1,500 RPD ($0.00 / €0.00). Paid tier: $0.075 / €0.070 input, $0.30 / €0.28 output per 1M tokens.
- **`gemini-2.5-pro`**: Context: 2,097,152 tokens | Max Output: 8,192 tokens. Free quota: 2 RPM, 32k TPM, 50 RPD ($0.00 / €0.00). Paid tier: $1.25 / €1.17 input, $5.00 / €4.68 output per 1M tokens.
- **`gemini-2.0-flash`**: Context: 1,048,576 tokens | Max Output: 8,192 tokens. Free quota: 15 RPM, 1M TPM, 1,500 RPD ($0.00 / €0.00). Paid tier: $0.10 / €0.093 input, $0.40 / €0.375 output per 1M tokens.
- **`gemini-2.0-flash-lite`**: Context: 1,048,576 tokens | Max Output: 8,192 tokens. Free quota: 30 RPM, 1,500 RPD ($0.00 / €0.00). Paid tier: $0.075 / €0.070 input, $0.30 / €0.28 output per 1M tokens.

### 2.2 Google Gemini (Long-Context)
- **`gemini-1.5-pro`**: Context: 2,097,152 tokens | Max Output: 8,192 tokens. Free quota: 2 RPM, 32k TPM, 50 RPD ($0.00 / €0.00). Paid tier: $1.25 / €1.17 input, $5.00 / €4.68 output per 1M tokens.
- **`gemini-1.5-flash`**: Context: 1,048,576 tokens | Max Output: 8,192 tokens. Free quota: 15 RPM, 1M TPM ($0.00 / €0.00). Paid tier: $0.075 / €0.070 input, $0.30 / €0.28 output per 1M tokens.
- **`gemini-1.5-flash-8b`**: Context: 1,048,576 tokens | Max Output: 8,192 tokens. Free quota: 15 RPM ($0.00 / €0.00). Paid tier: $0.0375 / €0.035 input, $0.15 / €0.14 output per 1M tokens.

### 2.3 Google Gemma (Open Weights)
- **`gemma-2-27b-it`**: Context: 8,192 tokens | Max Output: 4,096 tokens. Free quota / Open weights: $0.00 / €0.00. Vertex AI compute rate: $0.27 / €0.25 input, $0.27 / €0.25 output per 1M tokens.
- **`gemma-2-9b-it`**: Context: 8,192 tokens | Max Output: 4,096 tokens. Free quota / Open weights: $0.00 / €0.00. Vertex AI compute rate: $0.10 / €0.09 input, $0.10 / €0.09 output per 1M tokens.

### 2.4 Anthropic Claude on Google Cloud (Vertex AI)
- **`claude-3-7-sonnet`**: Context: 200,000 tokens | Max Output: 8,192 tokens. Google Cloud Billing: $3.00 / €2.80 input, $15.00 / €14.00 output per 1M tokens.
- **`claude-3-5-sonnet`**: Context: 200,000 tokens | Max Output: 8,192 tokens. Google Cloud Billing: $3.00 / €2.80 input, $15.00 / €14.00 output per 1M tokens.
- **`claude-3-5-haiku`**: Context: 200,000 tokens | Max Output: 8,192 tokens. Google Cloud Billing: $0.80 / €0.75 input, $4.00 / €3.75 output per 1M tokens.

### 2.5 Meta Llama 3 on Google Cloud (Vertex AI)
- **`llama-3.3-70b-instruct`**: Context: 128,000 tokens | Max Output: 4,096 tokens. Vertex AI Prediction: $0.70 / €0.65 input, $0.90 / €0.84 output per 1M tokens.
- **`llama-3.2-90b-vision-instruct`**: Context: 128,000 tokens | Max Output: 4,096 tokens. Vertex AI Prediction: $0.90 / €0.84 input, $1.20 / €1.12 output per 1M tokens.
- **`llama-3.1-405b-instruct`**: Context: 128,000 tokens | Max Output: 4,096 tokens. Vertex AI Prediction: $3.50 / €3.25 input, $3.50 / €3.25 output per 1M tokens.

### 2.6 Mistral AI on Google Cloud (Vertex AI)
- **`mistral-large-2411`**: Context: 128,000 tokens | Max Output: 4,096 tokens. Vertex AI Prediction: $2.00 / €1.86 input, $6.00 / €5.60 output per 1M tokens.
- **`codestral-2501`**: Context: 256,000 tokens | Max Output: 4,096 tokens. Vertex AI Prediction: $0.30 / €0.28 input, $0.90 / €0.84 output per 1M tokens.

### 2.7 DeepSeek on Google Cloud (Vertex AI)
- **`deepseek-r1`**: Context: 64,000 tokens | Max Output: 8,192 tokens. Vertex AI Compute: $0.55 / €0.51 input, $2.19 / €2.04 output per 1M tokens.

### 2.8 AI21 Labs & Cohere on Google Cloud (Vertex AI)
- **`jamba-1.5-large`**: Context: 256,000 tokens | Max Output: 4,096 tokens. Vertex AI Prediction: $2.00 / €1.86 input, $8.00 / €7.45 output per 1M tokens.
- **`command-r-plus`**: Context: 128,000 tokens | Max Output: 4,096 tokens. Vertex AI Prediction: $2.50 / €2.33 input, $10.00 / €9.30 output per 1M tokens.

---

## 3. Remote Antigravity 2.0 Offloading Architecture

To leverage the compute resources of **`evabot-agent-vm`** (Frankfurt `c3-standard-8`: 8 vCPUs, 32 GB DDR5 RAM, 100 GB NVMe) without putting load on the local machine:

1. **Remote SSH Agent Execution:**
   - Antigravity 2.0 / Antigravity IDE connects to `evabot-agent-vm` via SSH (`34.179.253.183` or Tailscale `100.66.98.4`).
   - The Antigravity backend server runs as a remote process on `evabot-agent-vm`. All LLM agent iterations, subagent processes, file indexing, and bash tools execute on the 8 vCPUs of Frankfurt, resulting in 0% local CPU/RAM load.
2. **Web GUI Shell (Code-Server):**
   - Accessible on `evabot-agent-vm:8080`, providing a complete browser-based development shell where Antigravity agents can be monitored and commanded graphically.
