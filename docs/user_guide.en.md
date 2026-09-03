# EvaBot User Guide & Operation Manual

**Version:** 0.2.2  
**Status:** Production Ready  
**Pricing Standards:** Strictly USD ($) and EUR (€)  

---

## 1. Zero-Configuration Google Cloud Authentication

EvaBot is directly integrated with your Google Antigravity & Google Cloud account (`evabot.online@gmail.com`).

- **No manual API key entry required:** The backend communicates directly with Google Compute Engine metadata services and Google Application Default Credentials (ADC).
- **Authentication Status:** Visible in the top right corner of the web interface as `Google Auto-Auth (evabot.online@gmail.com)`.
- **Custom Key Support:** Should you ever wish to test an external API key, clicking the badge opens the settings modal.

---

## 2. Model Selection & Google Model Garden Categories

EvaBot provides access to **20 state-of-the-art models** across 8 Google Model Garden categories. For full technical specifications, see [model_catalog.en.md](file:///home/fedor/Desktop/evabot-online/docs/model_catalog.en.md).

### 1. Google Gemini (Next-Gen)
- **`gemini-2.5-flash`** [Recommended]: Context: 1,048,576 tokens | Max Output: 8,192 tokens | Free Quota: 15 RPM, 1M TPM, 1,500 RPD ($0.00 / €0.00) | Paid Tier: $0.075 / €0.070 input, $0.30 / €0.28 output per 1M tokens.
- **`gemini-2.5-pro`**: Context: 2,097,152 tokens | Max Output: 8,192 tokens | Free Quota: 2 RPM, 32k TPM, 50 RPD ($0.00 / €0.00) | Paid Tier: $1.25 / €1.17 input, $5.00 / €4.68 output per 1M tokens.
- **`gemini-2.0-flash`**: Context: 1,048,576 tokens | Max Output: 8,192 tokens | Free Quota: 15 RPM, 1M TPM, 1,500 RPD ($0.00 / €0.00) | Paid Tier: $0.10 / €0.093 input, $0.40 / €0.375 output per 1M tokens.
- **`gemini-2.0-flash-lite`**: Context: 1,048,576 tokens | Max Output: 8,192 tokens | Free Quota: 30 RPM, 1,500 RPD ($0.00 / €0.00) | Paid Tier: $0.075 / €0.070 input, $0.30 / €0.28 output per 1M tokens.

### 2. Google Gemini (Long-Context)
- **`gemini-1.5-pro`**: Context: 2,097,152 tokens | Max Output: 8,192 tokens | Free Quota: 2 RPM, 32k TPM, 50 RPD ($0.00 / €0.00) | Paid Tier: $1.25 / €1.17 input, $5.00 / €4.68 output per 1M tokens.
- **`gemini-1.5-flash`**: Context: 1,048,576 tokens | Max Output: 8,192 tokens | Free Quota: 15 RPM, 1M TPM ($0.00 / €0.00) | Paid Tier: $0.075 / €0.070 input, $0.30 / €0.28 output per 1M tokens.
- **`gemini-1.5-flash-8b`**: Context: 1,048,576 tokens | Max Output: 8,192 tokens | Free Quota: 15 RPM ($0.00 / €0.00) | Paid Tier: $0.0375 / €0.035 input, $0.15 / €0.14 output per 1M tokens.

### 3. Google Gemma (Open Weights)
- **`gemma-2-27b-it`**: Context: 8,192 tokens | Max Output: 4,096 tokens | Free Quota / Open Weights: $0.00 / €0.00 | Vertex AI: $0.27 / €0.25 input, $0.27 / €0.25 output per 1M tokens.
- **`gemma-2-9b-it`**: Context: 8,192 tokens | Max Output: 4,096 tokens | Free Quota / Open Weights: $0.00 / €0.00 | Vertex AI: $0.10 / €0.09 input, $0.10 / €0.09 output per 1M tokens.

### 4. Anthropic Claude on Google Cloud (Vertex AI)
- **`claude-3-7-sonnet`**: Context: 200,000 tokens | Max Output: 8,192 tokens | Google Cloud Billing: $3.00 / €2.80 input, $15.00 / €14.00 output per 1M tokens.
- **`claude-3-5-sonnet`**: Context: 200,000 tokens | Max Output: 8,192 tokens | Google Cloud Billing: $3.00 / €2.80 input, $15.00 / €14.00 output per 1M tokens.
- **`claude-3-5-haiku`**: Context: 200,000 tokens | Max Output: 8,192 tokens | Google Cloud Billing: $0.80 / €0.75 input, $4.00 / €3.75 output per 1M tokens.

### 5. Meta Llama 3 on Google Cloud (Vertex AI)
- **`llama-3.3-70b-instruct`**: Context: 128,000 tokens | Max Output: 4,096 tokens | Vertex AI Prediction: $0.70 / €0.65 input, $0.90 / €0.84 output per 1M tokens.
- **`llama-3.2-90b-vision-instruct`**: Context: 128,000 tokens | Max Output: 4,096 tokens | Vertex AI Prediction: $0.90 / €0.84 input, $1.20 / €1.12 output per 1M tokens.
- **`llama-3.1-405b-instruct`**: Context: 128,000 tokens | Max Output: 4,096 tokens | Vertex AI Prediction: $3.50 / €3.25 input, $3.50 / €3.25 output per 1M tokens.

### 6. Mistral AI on Google Cloud (Vertex AI)
- **`mistral-large-2411`**: Context: 128,000 tokens | Max Output: 4,096 tokens | Vertex AI Prediction: $2.00 / €1.86 input, $6.00 / €5.60 output per 1M tokens.
- **`codestral-2501`**: Context: 256,000 tokens | Max Output: 4,096 tokens | Vertex AI Prediction: $0.30 / €0.28 input, $0.90 / €0.84 output per 1M tokens.

### 7. DeepSeek on Google Cloud (Vertex AI)
- **`deepseek-r1`**: Context: 64,000 tokens | Max Output: 8,192 tokens | Chain-of-thought Reasoning | Vertex AI Compute: $0.55 / €0.51 input, $2.19 / €2.04 output per 1M tokens.

### 8. AI21 Labs & Cohere on Google Cloud (Vertex AI)
- **`jamba-1.5-large`**: Context: 256,000 tokens | Max Output: 4,096 tokens | Hybrid Mamba-Transformer | Vertex AI Prediction: $2.00 / €1.86 input, $8.00 / €7.45 output per 1M tokens.
- **`command-r-plus`**: Context: 128,000 tokens | Max Output: 4,096 tokens | Enterprise RAG | Vertex AI Prediction: $2.50 / €2.33 input, $10.00 / €9.30 output per 1M tokens.

---

## 3. Financial Rates & Token Quotas

All rates and consumption ledgers are tracked strictly in **USD ($)** and **EUR (€)**:
- **Free Tier Models:** $0.00 / €0.00 per month within standard limits (up to 1,500 requests per day for Gemini 2.5 Flash).
- **Enterprise Partner Models:** Billed at standard Google Cloud Vertex AI token rates per 1M tokens without markup.
