export interface ModelPricing {
  inputPer1MTokensUSD: string;
  outputPer1MTokensUSD: string;
  inputPer1MTokensEUR: string;
  outputPer1MTokensEUR: string;
  freeTierStatus: '100% Free Quota Available' | 'Paid / Pay-As-You-Go Only';
  freeTierDetails: string;
}

export interface GeminiModelInfo {
  id: string;
  name: string;
  provider:
    | 'Google DeepMind'
    | 'Anthropic'
    | 'Meta'
    | 'Mistral AI'
    | 'AI21 Labs'
    | 'Cohere'
    | 'DeepSeek'
    | 'OmniRoute'
    | 'OpenRouter'
    | 'OpenCode AI';
  category:
    | 'Google Gemini (Next-Gen)'
    | 'Google Gemini (Long-Context)'
    | 'Google Gemma (Open Weights)'
    | 'Anthropic Claude on Google Cloud'
    | 'Meta Llama 3 on Google Cloud'
    | 'Mistral AI on Google Cloud'
    | 'DeepSeek on Google Cloud'
    | 'AI21 Labs & Cohere on Google Cloud'
    | 'OmniRoute Daemon Cluster'
    | 'OpenRouter Free Models'
    | 'OpenRouter Premium'
    | 'OpenCode Go Platforms';
  description: string;
  contextWindow: number;
  maxOutputTokens: number;
  recommended: boolean;
  tier:
    | 'Free Quota + Paid'
    | 'Vertex AI Enterprise'
    | 'Open Weights'
    | '100% Free Community'
    | 'OmniRoute Daemon'
    | 'OpenCode Platform';
  protocol: 'google-genai' | 'google-vertex' | 'google-partner' | 'openai-compatible';
  pricing: ModelPricing;
}

export const COMPLETE_GOOGLE_MODEL_CATALOG: GeminiModelInfo[] = [
  // ============================================================================
  // 1. GOOGLE GEMINI NEXT-GEN FRONTIER (Google DeepMind - 2026 Fleet)
  // ============================================================================
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    provider: 'Google DeepMind',
    category: 'Google Gemini (Next-Gen)',
    description: 'Frontier ultra-fast autonomous agentic model with native real-time tool orchestration and multi-modal streaming.',
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    recommended: false,
    tier: 'Free Quota + Paid',
    protocol: 'google-genai',
    pricing: {
      freeTierStatus: '100% Free Quota Available',
      freeTierDetails: 'Google AI Pro / AI Studio: 15 RPM, 1M TPM, 1,500 RPD ($0.00)',
      inputPer1MTokensUSD: '$0.00 (Free) / $0.075 (Paid)',
      outputPer1MTokensUSD: '$0.00 (Free) / $0.300 (Paid)',
      inputPer1MTokensEUR: '€0.00 (Free) / €0.070 (Paid)',
      outputPer1MTokensEUR: '€0.00 (Free) / €0.280 (Paid)',
    },
  },
  {
    id: 'gemini-3.1-pro',
    name: 'Gemini 3.1 Pro',
    provider: 'Google DeepMind',
    category: 'Google Gemini (Next-Gen)',
    description: 'Premier enterprise reasoning frontier model with 2M token context, deep logic, and architectural planning capability.',
    contextWindow: 2097152,
    maxOutputTokens: 8192,
    recommended: false,
    tier: 'Free Quota + Paid',
    protocol: 'google-genai',
    pricing: {
      freeTierStatus: '100% Free Quota Available',
      freeTierDetails: 'Google AI Pro / AI Studio: 2 RPM, 32k TPM, 50 RPD ($0.00)',
      inputPer1MTokensUSD: '$0.00 (Free) / $1.25 (Paid)',
      outputPer1MTokensUSD: '$0.00 (Free) / $5.00 (Paid)',
      inputPer1MTokensEUR: '€0.00 (Free) / €1.15 (Paid)',
      outputPer1MTokensEUR: '€0.00 (Free) / €4.60 (Paid)',
    },
  },
  {
    id: 'gemini-3.1-flash',
    name: 'Gemini 3.1 Flash',
    provider: 'Google DeepMind',
    category: 'Google Gemini (Next-Gen)',
    description: 'Lightweight high-efficiency frontier flash model with ultra-low latency inference.',
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    recommended: false,
    tier: 'Free Quota + Paid',
    protocol: 'google-genai',
    pricing: {
      freeTierStatus: '100% Free Quota Available',
      freeTierDetails: 'Google AI Studio: 15 RPM, 1M TPM ($0.00)',
      inputPer1MTokensUSD: '$0.00 (Free) / $0.050 (Paid)',
      outputPer1MTokensUSD: '$0.00 (Free) / $0.200 (Paid)',
      inputPer1MTokensEUR: '€0.00 (Free) / €0.046 (Paid)',
      outputPer1MTokensEUR: '€0.00 (Free) / €0.185 (Paid)',
    },
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google DeepMind',
    category: 'Google Gemini (Next-Gen)',
    description: 'Google’s fastest flagship model with native multimodal reasoning and real-time responsiveness.',
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    recommended: true,
    tier: 'Free Quota + Paid',
    protocol: 'google-genai',
    pricing: {
      freeTierStatus: '100% Free Quota Available',
      freeTierDetails: 'Google AI Studio: 15 RPM, 1M TPM, 1,500 RPD ($0.00)',
      inputPer1MTokensUSD: '$0.00 (Free) / $0.075 (Paid)',
      outputPer1MTokensUSD: '$0.00 (Free) / $0.30 (Paid)',
      inputPer1MTokensEUR: '€0.00 (Free) / €0.070 (Paid)',
      outputPer1MTokensEUR: '€0.00 (Free) / €0.280 (Paid)',
    },
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'Google DeepMind',
    category: 'Google Gemini (Next-Gen)',
    description: 'Premier reasoning and code generation engine for complex analytical challenges.',
    contextWindow: 2097152,
    maxOutputTokens: 8192,
    recommended: false,
    tier: 'Free Quota + Paid',
    protocol: 'google-genai',
    pricing: {
      freeTierStatus: '100% Free Quota Available',
      freeTierDetails: 'Google AI Studio: 2 RPM, 32k TPM, 50 RPD ($0.00)',
      inputPer1MTokensUSD: '$0.00 (Free) / $1.25 (Paid)',
      outputPer1MTokensUSD: '$0.00 (Free) / $5.00 (Paid)',
      inputPer1MTokensEUR: '€0.00 (Free) / €1.17 (Paid)',
      outputPer1MTokensEUR: '€0.00 (Free) / €4.68 (Paid)',
    },
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google DeepMind',
    category: 'Google Gemini (Next-Gen)',
    description: 'Next-gen streaming architecture for high-frequency interactive dialogues and agent loops.',
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    recommended: false,
    tier: 'Free Quota + Paid',
    protocol: 'google-genai',
    pricing: {
      freeTierStatus: '100% Free Quota Available',
      freeTierDetails: 'Google AI Studio: 15 RPM, 1M TPM, 1,500 RPD ($0.00)',
      inputPer1MTokensUSD: '$0.00 (Free) / $0.10 (Paid)',
      outputPer1MTokensUSD: '$0.00 (Free) / $0.40 (Paid)',
      inputPer1MTokensEUR: '€0.00 (Free) / €0.093 (Paid)',
      outputPer1MTokensEUR: '€0.00 (Free) / €0.375 (Paid)',
    },
  },
  {
    id: 'gemini-2.0-flash-lite',
    name: 'Gemini 2.0 Flash Lite',
    provider: 'Google DeepMind',
    category: 'Google Gemini (Next-Gen)',
    description: 'Ultra cost-efficient model designed for extreme throughput and low latency agent tasks.',
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    recommended: false,
    tier: 'Free Quota + Paid',
    protocol: 'google-genai',
    pricing: {
      freeTierStatus: '100% Free Quota Available',
      freeTierDetails: 'Google AI Studio: 30 RPM, 1,500 RPD ($0.00)',
      inputPer1MTokensUSD: '$0.00 (Free) / $0.075 (Paid)',
      outputPer1MTokensUSD: '$0.00 (Free) / $0.30 (Paid)',
      inputPer1MTokensEUR: '€0.00 (Free) / €0.070 (Paid)',
      outputPer1MTokensEUR: '€0.00 (Free) / €0.280 (Paid)',
    },
  },

  // ============================================================================
  // 2. GOOGLE GEMINI LONG-CONTEXT
  // ============================================================================
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google DeepMind',
    category: 'Google Gemini (Long-Context)',
    description: '2,000,000 token context window capable of ingesting entire codebases and long video streams.',
    contextWindow: 2097152,
    maxOutputTokens: 8192,
    recommended: false,
    tier: 'Free Quota + Paid',
    protocol: 'google-genai',
    pricing: {
      freeTierStatus: '100% Free Quota Available',
      freeTierDetails: 'Google AI Studio: 2 RPM, 32k TPM, 50 RPD ($0.00)',
      inputPer1MTokensUSD: '$0.00 (Free) / $1.25 (Paid)',
      outputPer1MTokensUSD: '$0.00 (Free) / $5.00 (Paid)',
      inputPer1MTokensEUR: '€0.00 (Free) / €1.17 (Paid)',
      outputPer1MTokensEUR: '€0.00 (Free) / €4.68 (Paid)',
    },
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'Google DeepMind',
    category: 'Google Gemini (Long-Context)',
    description: 'Fast, lightweight multimodal model with 1,000,000 tokens context.',
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    recommended: false,
    tier: 'Free Quota + Paid',
    protocol: 'google-genai',
    pricing: {
      freeTierStatus: '100% Free Quota Available',
      freeTierDetails: 'Google AI Studio: 15 RPM, 1M TPM ($0.00)',
      inputPer1MTokensUSD: '$0.00 (Free) / $0.075 (Paid)',
      outputPer1MTokensUSD: '$0.00 (Free) / $0.30 (Paid)',
      inputPer1MTokensEUR: '€0.00 (Free) / €0.070 (Paid)',
      outputPer1MTokensEUR: '€0.00 (Free) / €0.280 (Paid)',
    },
  },
  {
    id: 'gemini-1.5-flash-8b',
    name: 'Gemini 1.5 Flash 8B',
    provider: 'Google DeepMind',
    category: 'Google Gemini (Long-Context)',
    description: 'Compact 8-billion parameter version built for high-speed lightweight routing.',
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    recommended: false,
    tier: 'Free Quota + Paid',
    protocol: 'google-genai',
    pricing: {
      freeTierStatus: '100% Free Quota Available',
      freeTierDetails: 'Google AI Studio: 15 RPM ($0.00)',
      inputPer1MTokensUSD: '$0.00 (Free) / $0.0375 (Paid)',
      outputPer1MTokensUSD: '$0.00 (Free) / $0.15 (Paid)',
      inputPer1MTokensEUR: '€0.00 (Free) / €0.035 (Paid)',
      outputPer1MTokensEUR: '€0.00 (Free) / €0.140 (Paid)',
    },
  },

  // ============================================================================
  // 3. GOOGLE GEMMA OPEN WEIGHTS (Google DeepMind)
  // ============================================================================
  {
    id: 'gemma-2-27b-it',
    name: 'Gemma 2 (27B Instruct)',
    provider: 'Google DeepMind',
    category: 'Google Gemma (Open Weights)',
    description: 'Google’s flagship open weights model with performance rivaling closed models.',
    contextWindow: 8192,
    maxOutputTokens: 4096,
    recommended: false,
    tier: 'Open Weights',
    protocol: 'google-genai',
    pricing: {
      freeTierStatus: '100% Free Quota Available',
      freeTierDetails: 'Open Weights ($0.00) or Google AI Studio Free Quota',
      inputPer1MTokensUSD: '$0.00 (Free) / $0.27 (Vertex AI)',
      outputPer1MTokensUSD: '$0.00 (Free) / $0.27 (Vertex AI)',
      inputPer1MTokensEUR: '€0.00 (Free) / €0.25 (Vertex AI)',
      outputPer1MTokensEUR: '€0.00 (Free) / €0.25 (Vertex AI)',
    },
  },
  {
    id: 'gemma-2-9b-it',
    name: 'Gemma 2 (9B Instruct)',
    provider: 'Google DeepMind',
    category: 'Google Gemma (Open Weights)',
    description: 'High efficiency open weights model with exceptional reasoning-per-parameter ratio.',
    contextWindow: 8192,
    maxOutputTokens: 4096,
    recommended: false,
    tier: 'Open Weights',
    protocol: 'google-genai',
    pricing: {
      freeTierStatus: '100% Free Quota Available',
      freeTierDetails: 'Open Weights ($0.00) or Google AI Studio Free Quota',
      inputPer1MTokensUSD: '$0.00 (Free) / $0.10 (Vertex AI)',
      outputPer1MTokensUSD: '$0.00 (Free) / $0.10 (Vertex AI)',
      inputPer1MTokensEUR: '€0.00 (Free) / €0.09 (Vertex AI)',
      outputPer1MTokensEUR: '€0.00 (Free) / €0.09 (Vertex AI)',
    },
  },

  // ============================================================================
  // 4. ANTHROPIC CLAUDE ON GOOGLE CLOUD (Vertex AI Model Garden)
  // ============================================================================
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet (Vertex AI)',
    provider: 'Anthropic',
    category: 'Anthropic Claude on Google Cloud',
    description: 'Hybrid reasoning and instant response model available on Google Cloud Vertex AI.',
    contextWindow: 200000,
    maxOutputTokens: 8192,
    recommended: false,
    tier: 'Vertex AI Enterprise',
    protocol: 'google-partner',
    pricing: {
      freeTierStatus: 'Paid / Pay-As-You-Go Only',
      freeTierDetails: 'Google Cloud billing per token consumption',
      inputPer1MTokensUSD: '$3.00',
      outputPer1MTokensUSD: '$15.00',
      inputPer1MTokensEUR: '€2.80',
      outputPer1MTokensEUR: '€14.00',
    },
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet (Vertex AI)',
    provider: 'Anthropic',
    category: 'Anthropic Claude on Google Cloud',
    description: 'Industry benchmark for code generation and multi-step reasoning on Vertex AI.',
    contextWindow: 200000,
    maxOutputTokens: 8192,
    recommended: false,
    tier: 'Vertex AI Enterprise',
    protocol: 'google-partner',
    pricing: {
      freeTierStatus: 'Paid / Pay-As-You-Go Only',
      freeTierDetails: 'Google Cloud billing per token consumption',
      inputPer1MTokensUSD: '$3.00',
      outputPer1MTokensUSD: '$15.00',
      inputPer1MTokensEUR: '€2.80',
      outputPer1MTokensEUR: '€14.00',
    },
  },
  {
    id: 'claude-3-5-haiku',
    name: 'Claude 3.5 Haiku (Vertex AI)',
    provider: 'Anthropic',
    category: 'Anthropic Claude on Google Cloud',
    description: 'High speed, cost-effective Anthropic model running in Google Cloud.',
    contextWindow: 200000,
    maxOutputTokens: 8192,
    recommended: false,
    tier: 'Vertex AI Enterprise',
    protocol: 'google-partner',
    pricing: {
      freeTierStatus: 'Paid / Pay-As-You-Go Only',
      freeTierDetails: 'Google Cloud billing per token consumption',
      inputPer1MTokensUSD: '$0.80',
      outputPer1MTokensUSD: '$4.00',
      inputPer1MTokensEUR: '€0.75',
      outputPer1MTokensEUR: '€3.75',
    },
  },

  // ============================================================================
  // 5. META LLAMA 3 ON GOOGLE CLOUD (Vertex AI Model Garden)
  // ============================================================================
  {
    id: 'llama-3.3-70b-instruct',
    name: 'Meta Llama 3.3 (70B Instruct)',
    provider: 'Meta',
    category: 'Meta Llama 3 on Google Cloud',
    description: 'Meta’s latest 70-billion parameter model fully hosted on Google Cloud Vertex AI.',
    contextWindow: 128000,
    maxOutputTokens: 4096,
    recommended: false,
    tier: 'Vertex AI Enterprise',
    protocol: 'google-partner',
    pricing: {
      freeTierStatus: 'Paid / Pay-As-You-Go Only',
      freeTierDetails: 'Google Cloud Vertex AI prediction pricing',
      inputPer1MTokensUSD: '$0.70',
      outputPer1MTokensUSD: '$0.90',
      inputPer1MTokensEUR: '€0.65',
      outputPer1MTokensEUR: '€0.84',
    },
  },
  {
    id: 'llama-3.2-90b-vision-instruct',
    name: 'Meta Llama 3.2 (90B Vision)',
    provider: 'Meta',
    category: 'Meta Llama 3 on Google Cloud',
    description: 'Premier open multimodal vision and text model on Google Cloud Vertex AI.',
    contextWindow: 128000,
    maxOutputTokens: 4096,
    recommended: false,
    tier: 'Vertex AI Enterprise',
    protocol: 'google-partner',
    pricing: {
      freeTierStatus: 'Paid / Pay-As-You-Go Only',
      freeTierDetails: 'Google Cloud Vertex AI prediction pricing',
      inputPer1MTokensUSD: '$0.90',
      outputPer1MTokensUSD: '$1.20',
      inputPer1MTokensEUR: '€0.84',
      outputPer1MTokensEUR: '€1.12',
    },
  },
  {
    id: 'llama-3.1-405b-instruct',
    name: 'Meta Llama 3.1 (405B Instruct)',
    provider: 'Meta',
    category: 'Meta Llama 3 on Google Cloud',
    description: 'Massive 405-billion parameter frontier model running on Google TPU/GPU cluster.',
    contextWindow: 128000,
    maxOutputTokens: 4096,
    recommended: false,
    tier: 'Vertex AI Enterprise',
    protocol: 'google-partner',
    pricing: {
      freeTierStatus: 'Paid / Pay-As-You-Go Only',
      freeTierDetails: 'Google Cloud Vertex AI prediction pricing',
      inputPer1MTokensUSD: '$3.50',
      outputPer1MTokensUSD: '$3.50',
      inputPer1MTokensEUR: '€3.25',
      outputPer1MTokensEUR: '€3.25',
    },
  },

  // ============================================================================
  // 6. MISTRAL AI ON GOOGLE CLOUD (Vertex AI Model Garden)
  // ============================================================================
  {
    id: 'mistral-large-2411',
    name: 'Mistral Large 2 (Vertex AI)',
    provider: 'Mistral AI',
    category: 'Mistral AI on Google Cloud',
    description: 'Mistral’s top-tier multilingual reasoning and coding model on Google Cloud.',
    contextWindow: 128000,
    maxOutputTokens: 4096,
    recommended: false,
    tier: 'Vertex AI Enterprise',
    protocol: 'google-partner',
    pricing: {
      freeTierStatus: 'Paid / Pay-As-You-Go Only',
      freeTierDetails: 'Google Cloud Vertex AI prediction pricing',
      inputPer1MTokensUSD: '$2.00',
      outputPer1MTokensUSD: '$6.00',
      inputPer1MTokensEUR: '€1.86',
      outputPer1MTokensEUR: '€5.60',
    },
  },
  {
    id: 'codestral-2501',
    name: 'Codestral 25.01 (Vertex AI)',
    provider: 'Mistral AI',
    category: 'Mistral AI on Google Cloud',
    description: 'Specialized code completion, debugging, and fill-in-the-middle on Google Cloud.',
    contextWindow: 256000,
    maxOutputTokens: 4096,
    recommended: false,
    tier: 'Vertex AI Enterprise',
    protocol: 'google-partner',
    pricing: {
      freeTierStatus: 'Paid / Pay-As-You-Go Only',
      freeTierDetails: 'Google Cloud Vertex AI prediction pricing',
      inputPer1MTokensUSD: '$0.30',
      outputPer1MTokensUSD: '$0.90',
      inputPer1MTokensEUR: '€0.28',
      outputPer1MTokensEUR: '€0.84',
    },
  },

  // ============================================================================
  // 7. DEEPSEEK & AI21 ON GOOGLE CLOUD (Vertex AI Model Garden)
  // ============================================================================
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1 (Reasoning)',
    provider: 'DeepSeek',
    category: 'DeepSeek on Google Cloud',
    description: 'Frontier open reasoning model with transparent chain-of-thought verification on Google Cloud.',
    contextWindow: 64000,
    maxOutputTokens: 8192,
    recommended: false,
    tier: 'Open Weights',
    protocol: 'google-partner',
    pricing: {
      freeTierStatus: 'Paid / Pay-As-You-Go Only',
      freeTierDetails: 'Vertex AI Model Garden compute rate',
      inputPer1MTokensUSD: '$0.55',
      outputPer1MTokensUSD: '$2.19',
      inputPer1MTokensEUR: '€0.51',
      outputPer1MTokensEUR: '€2.04',
    },
  },
  {
    id: 'jamba-1.5-large',
    name: 'AI21 Jamba 1.5 Large',
    provider: 'AI21 Labs',
    category: 'AI21 Labs & Cohere on Google Cloud',
    description: 'Hybrid Mamba-Transformer architecture offering 256,000 tokens long-context speed.',
    contextWindow: 256000,
    maxOutputTokens: 4096,
    recommended: false,
    tier: 'Vertex AI Enterprise',
    protocol: 'google-partner',
    pricing: {
      freeTierStatus: 'Paid / Pay-As-You-Go Only',
      freeTierDetails: 'Google Cloud Vertex AI prediction pricing',
      inputPer1MTokensUSD: '$2.00',
      outputPer1MTokensUSD: '$8.00',
      inputPer1MTokensEUR: '€1.86',
      outputPer1MTokensEUR: '€7.45',
    },
  },
  {
    id: 'command-r-plus',
    name: 'Cohere Command R+',
    provider: 'Cohere',
    category: 'AI21 Labs & Cohere on Google Cloud',
    description: 'Enterprise Retrieval-Augmented Generation (RAG) model on Google Cloud.',
    contextWindow: 128000,
    maxOutputTokens: 4096,
    recommended: false,
    tier: 'Vertex AI Enterprise',
    protocol: 'google-partner',
    pricing: {
      freeTierStatus: 'Paid / Pay-As-You-Go Only',
      freeTierDetails: 'Google Cloud Vertex AI prediction pricing',
      inputPer1MTokensUSD: '$2.50',
      outputPer1MTokensUSD: '$10.00',
      inputPer1MTokensEUR: '€2.33',
      outputPer1MTokensEUR: '€9.30',
    },
  },

  // ============================================================================
  // 8. OMNIROUTE DAEMON CLUSTER (http://100.66.98.4:20128)
  // ============================================================================
  {
    id: 'omniroute/gemini-2.5-pro',
    name: 'OmniRoute Gemini 2.5 Pro (Edge Router)',
    provider: 'OmniRoute',
    category: 'OmniRoute Daemon Cluster',
    description: 'High-availability routing proxy via OmniRoute daemon with automatic load balancing and fallback.',
    contextWindow: 2097152,
    maxOutputTokens: 8192,
    recommended: false,
    tier: 'OmniRoute Daemon',
    protocol: 'openai-compatible',
    pricing: {
      freeTierStatus: '100% Free Quota Available',
      freeTierDetails: 'Direct edge routing via internal daemon cluster ($0.00 margin)',
      inputPer1MTokensUSD: '$0.00 (Self-Hosted) / $1.25 (Upstream)',
      outputPer1MTokensUSD: '$0.00 (Self-Hosted) / $5.00 (Upstream)',
      inputPer1MTokensEUR: '€0.00 (Self-Hosted) / €1.17 (Upstream)',
      outputPer1MTokensEUR: '€0.00 (Self-Hosted) / €4.68 (Upstream)',
    },
  },
  {
    id: 'omniroute/deepseek-r1',
    name: 'OmniRoute DeepSeek R1 (Daemon Cluster)',
    provider: 'OmniRoute',
    category: 'OmniRoute Daemon Cluster',
    description: 'DeepSeek R1 reasoning executed through local OmniRoute daemon cluster.',
    contextWindow: 64000,
    maxOutputTokens: 8192,
    recommended: false,
    tier: 'OmniRoute Daemon',
    protocol: 'openai-compatible',
    pricing: {
      freeTierStatus: '100% Free Quota Available',
      freeTierDetails: 'Routed through high-throughput OmniRoute node ($0.00 node fee)',
      inputPer1MTokensUSD: '$0.00 (Local) / $0.55 (Upstream)',
      outputPer1MTokensUSD: '$0.00 (Local) / $2.19 (Upstream)',
      inputPer1MTokensEUR: '€0.00 (Local) / €0.51 (Upstream)',
      outputPer1MTokensEUR: '€0.00 (Local) / €2.04 (Upstream)',
    },
  },
  {
    id: 'omniroute/claude-3.5-sonnet',
    name: 'OmniRoute Claude 3.5 Sonnet (Edge Proxy)',
    provider: 'OmniRoute',
    category: 'OmniRoute Daemon Cluster',
    description: 'Anthropic Claude 3.5 Sonnet proxied through high-reliability OmniRoute daemon gateway.',
    contextWindow: 200000,
    maxOutputTokens: 8192,
    recommended: false,
    tier: 'OmniRoute Daemon',
    protocol: 'openai-compatible',
    pricing: {
      freeTierStatus: 'Paid / Pay-As-You-Go Only',
      freeTierDetails: 'Edge-routed Anthropic upstream billing',
      inputPer1MTokensUSD: '$3.00',
      outputPer1MTokensUSD: '$15.00',
      inputPer1MTokensEUR: '€2.80',
      outputPer1MTokensEUR: '€14.00',
    },
  },

  // ============================================================================
  // 9. OPENROUTER FREE MODELS (https://openrouter.ai)
  // ============================================================================
  {
    id: 'deepseek/deepseek-r1:free',
    name: 'DeepSeek R1 (Free on OpenRouter)',
    provider: 'OpenRouter',
    category: 'OpenRouter Free Models',
    description: 'Frontier open reasoning model with chain-of-thought verification, 100% free via OpenRouter tier.',
    contextWindow: 64000,
    maxOutputTokens: 8192,
    recommended: false,
    tier: '100% Free Community',
    protocol: 'openai-compatible',
    pricing: {
      freeTierStatus: '100% Free Quota Available',
      freeTierDetails: 'OpenRouter Community Free Tier (20 RPM queue)',
      inputPer1MTokensUSD: '$0.00 (100% Free)',
      outputPer1MTokensUSD: '$0.00 (100% Free)',
      inputPer1MTokensEUR: '€0.00 (100% Free)',
      outputPer1MTokensEUR: '€0.00 (100% Free)',
    },
  },
  {
    id: 'meta-llama/llama-3.3-70b:free',
    name: 'Llama 3.3 70B Instruct (Free on OpenRouter)',
    provider: 'OpenRouter',
    category: 'OpenRouter Free Models',
    description: 'State-of-the-art Meta 70B open weight instruction model hosted on OpenRouter free tier.',
    contextWindow: 128000,
    maxOutputTokens: 4096,
    recommended: false,
    tier: '100% Free Community',
    protocol: 'openai-compatible',
    pricing: {
      freeTierStatus: '100% Free Quota Available',
      freeTierDetails: 'OpenRouter Community Free Tier (20 RPM queue)',
      inputPer1MTokensUSD: '$0.00 (100% Free)',
      outputPer1MTokensUSD: '$0.00 (100% Free)',
      inputPer1MTokensEUR: '€0.00 (100% Free)',
      outputPer1MTokensEUR: '€0.00 (100% Free)',
    },
  },
  {
    id: 'google/gemini-2.0-flash-exp:free',
    name: 'Gemini 2.0 Flash Exp (Free on OpenRouter)',
    provider: 'OpenRouter',
    category: 'OpenRouter Free Models',
    description: 'Ultra-fast Google experimental Gemini 2.0 Flash endpoint accessed via OpenRouter free gateway.',
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    recommended: false,
    tier: '100% Free Community',
    protocol: 'openai-compatible',
    pricing: {
      freeTierStatus: '100% Free Quota Available',
      freeTierDetails: 'OpenRouter Community Free Tier',
      inputPer1MTokensUSD: '$0.00 (100% Free)',
      outputPer1MTokensUSD: '$0.00 (100% Free)',
      inputPer1MTokensEUR: '€0.00 (100% Free)',
      outputPer1MTokensEUR: '€0.00 (100% Free)',
    },
  },
  {
    id: 'qwen/qwen-2.5-coder-32b-instruct:free',
    name: 'Qwen 2.5 Coder 32B (Free on OpenRouter)',
    provider: 'OpenRouter',
    category: 'OpenRouter Free Models',
    description: 'Alibaba Qwen code generation specialist with 128k context on OpenRouter free tier.',
    contextWindow: 128000,
    maxOutputTokens: 8192,
    recommended: false,
    tier: '100% Free Community',
    protocol: 'openai-compatible',
    pricing: {
      freeTierStatus: '100% Free Quota Available',
      freeTierDetails: 'OpenRouter Community Free Tier',
      inputPer1MTokensUSD: '$0.00 (100% Free)',
      outputPer1MTokensUSD: '$0.00 (100% Free)',
      inputPer1MTokensEUR: '€0.00 (100% Free)',
      outputPer1MTokensEUR: '€0.00 (100% Free)',
    },
  },
  {
    id: 'mistralai/mistral-7b-instruct:free',
    name: 'Mistral 7B Instruct (Free on OpenRouter)',
    provider: 'OpenRouter',
    category: 'OpenRouter Free Models',
    description: 'Fast, reliable 7B lightweight instruction model on OpenRouter free queue.',
    contextWindow: 32768,
    maxOutputTokens: 4096,
    recommended: false,
    tier: '100% Free Community',
    protocol: 'openai-compatible',
    pricing: {
      freeTierStatus: '100% Free Quota Available',
      freeTierDetails: 'OpenRouter Community Free Tier',
      inputPer1MTokensUSD: '$0.00 (100% Free)',
      outputPer1MTokensUSD: '$0.00 (100% Free)',
      inputPer1MTokensEUR: '€0.00 (100% Free)',
      outputPer1MTokensEUR: '€0.00 (100% Free)',
    },
  },

  // ============================================================================
  // 10. OPENROUTER PREMIUM MODELS
  // ============================================================================
  {
    id: 'openrouter/deepseek-chat',
    name: 'DeepSeek V3 (OpenRouter Premium)',
    provider: 'OpenRouter',
    category: 'OpenRouter Premium',
    description: 'DeepSeek V3 671B MoE model with extreme cost efficiency and high coding quality.',
    contextWindow: 64000,
    maxOutputTokens: 8192,
    recommended: false,
    tier: 'Free Quota + Paid',
    protocol: 'openai-compatible',
    pricing: {
      freeTierStatus: 'Paid / Pay-As-You-Go Only',
      freeTierDetails: 'OpenRouter credit balance',
      inputPer1MTokensUSD: '$0.14',
      outputPer1MTokensUSD: '$0.28',
      inputPer1MTokensEUR: '€0.13',
      outputPer1MTokensEUR: '€0.26',
    },
  },

  // ============================================================================
  // 11. OPENCODE GO PLATFORMS (OpenCode AI Platform API / OmniRoute Adapter)
  // ============================================================================
  {
    id: 'opencode/go-coder-32b',
    name: 'OpenCode Go Coder 32B',
    provider: 'OpenCode AI',
    category: 'OpenCode Go Platforms',
    description: 'Specialized enterprise coding platform model with automated unit test generation and refactoring.',
    contextWindow: 64000,
    maxOutputTokens: 8192,
    recommended: false,
    tier: 'OpenCode Platform',
    protocol: 'openai-compatible',
    pricing: {
      freeTierStatus: '100% Free Quota Available',
      freeTierDetails: 'OpenCode Developer Community Quota',
      inputPer1MTokensUSD: '$0.00 (Dev Tier) / $0.20 (Prod)',
      outputPer1MTokensUSD: '$0.00 (Dev Tier) / $0.60 (Prod)',
      inputPer1MTokensEUR: '€0.00 (Dev Tier) / €0.18 (Prod)',
      outputPer1MTokensEUR: '€0.00 (Dev Tier) / €0.55 (Prod)',
    },
  },
  {
    id: 'opencode/go-fast',
    name: 'OpenCode Go Fast (Low-Latency)',
    provider: 'OpenCode AI',
    category: 'OpenCode Go Platforms',
    description: 'Ultra-low latency code agent model optimized for autocomplete and fast interactive edits.',
    contextWindow: 32768,
    maxOutputTokens: 4096,
    recommended: false,
    tier: 'OpenCode Platform',
    protocol: 'openai-compatible',
    pricing: {
      freeTierStatus: '100% Free Quota Available',
      freeTierDetails: 'OpenCode Developer Community Quota',
      inputPer1MTokensUSD: '$0.00 (Dev Tier) / $0.08 (Prod)',
      outputPer1MTokensUSD: '$0.00 (Dev Tier) / $0.24 (Prod)',
      inputPer1MTokensEUR: '€0.00 (Dev Tier) / €0.07 (Prod)',
      outputPer1MTokensEUR: '€0.00 (Dev Tier) / €0.22 (Prod)',
    },
  },
];

export const GEMINI_MODELS = COMPLETE_GOOGLE_MODEL_CATALOG;

export class ModelRegistry {
  public static getAllModels(): GeminiModelInfo[] {
    return [...COMPLETE_GOOGLE_MODEL_CATALOG];
  }

  public static getModelById(id: string): GeminiModelInfo | undefined {
    return COMPLETE_GOOGLE_MODEL_CATALOG.find((m) => m.id === id);
  }

  public static isValidModel(id: string): boolean {
    return COMPLETE_GOOGLE_MODEL_CATALOG.some((m) => m.id === id);
  }

  public static getDefaultModel(): GeminiModelInfo {
    return COMPLETE_GOOGLE_MODEL_CATALOG.find((m) => m.recommended) || COMPLETE_GOOGLE_MODEL_CATALOG[0];
  }

  public static getCategories(): string[] {
    const cats = new Set(COMPLETE_GOOGLE_MODEL_CATALOG.map((m) => m.category));
    return Array.from(cats);
  }

  public static getModelsByCategory(category: string): GeminiModelInfo[] {
    return COMPLETE_GOOGLE_MODEL_CATALOG.filter((m) => m.category === category);
  }

  public static getFreeModels(): GeminiModelInfo[] {
    return COMPLETE_GOOGLE_MODEL_CATALOG.filter((m) => m.pricing.freeTierStatus === '100% Free Quota Available');
  }

  public static getPaidOnlyModels(): GeminiModelInfo[] {
    return COMPLETE_GOOGLE_MODEL_CATALOG.filter((m) => m.pricing.freeTierStatus === 'Paid / Pay-As-You-Go Only');
  }
}
