// src/models/ModelRegistry.ts
var COMPLETE_GOOGLE_MODEL_CATALOG = [
  // ============================================================================
  // 1. GOOGLE GEMINI NEXT-GEN FRONTIER (Google DeepMind)
  // ============================================================================
  {
    id: "gemini-3.8-flash",
    name: "Gemini 3.8 Flash",
    provider: "Google DeepMind",
    category: "Google Gemini (Next-Gen)",
    description: "Frontier ultra-fast autonomous agentic model with native real-time tool orchestration, extreme streaming throughput, and multimodal reasoning.",
    codingStrengths: "Autonomous multi-file repository refactoring, sub-second live debugging, continuous agentic tool calling, and high-frequency code review loops.",
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "Free Quota + Paid",
    protocol: "google-genai",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "Google AI Pro / AI Studio: 15 RPM, 1M TPM, 1,500 RPD ($0.00 / \u20AC0.00)",
      inputPer1MTokensUSD: "$0.00 (Free) / $0.075 (Paid)",
      outputPer1MTokensUSD: "$0.00 (Free) / $0.300 (Paid)",
      inputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC0.070 (Paid)",
      outputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC0.280 (Paid)"
    }
  },
  {
    id: "gemini-3.1-pro",
    name: "Gemini 3.1 Pro",
    provider: "Google DeepMind",
    category: "Google Gemini (Next-Gen)",
    description: "Premier enterprise reasoning frontier model with 2M token context, deep multi-step logic, formal mathematics, and architectural planning capability.",
    codingStrengths: "Enterprise system architecture synthesis, SWE-bench level task execution, complex AST transformations, and cross-framework code translation.",
    contextWindow: 2097152,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "Free Quota + Paid",
    protocol: "google-genai",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "Google AI Pro / AI Studio: 2 RPM, 32k TPM, 50 RPD ($0.00 / \u20AC0.00)",
      inputPer1MTokensUSD: "$0.00 (Free) / $1.25 (Paid)",
      outputPer1MTokensUSD: "$0.00 (Free) / $5.00 (Paid)",
      inputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC1.15 (Paid)",
      outputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC4.60 (Paid)"
    }
  },
  {
    id: "gemini-3.1-flash",
    name: "Gemini 3.1 Flash",
    provider: "Google DeepMind",
    category: "Google Gemini (Next-Gen)",
    description: "Lightweight high-efficiency frontier flash model with ultra-low latency inference, multimodal comprehension, and minimal token cost.",
    codingStrengths: "Instant syntax validation, rapid unit test generation, fast documentation parsing, and interactive terminal scripting.",
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "Free Quota + Paid",
    protocol: "google-genai",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "Google AI Studio: 15 RPM, 1M TPM ($0.00 / \u20AC0.00)",
      inputPer1MTokensUSD: "$0.00 (Free) / $0.050 (Paid)",
      outputPer1MTokensUSD: "$0.00 (Free) / $0.200 (Paid)",
      inputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC0.046 (Paid)",
      outputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC0.185 (Paid)"
    }
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "Google DeepMind",
    category: "Google Gemini (Next-Gen)",
    description: "Google\u2019s fastest flagship production model with native multimodal reasoning, breakthrough latency, and industry-leading developer rate limits.",
    codingStrengths: "High-throughput code transformations, CI/CD pipeline automation, automated test generation, and pair programming dialogues.",
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    recommended: true,
    tier: "Free Quota + Paid",
    protocol: "google-genai",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "Google AI Studio: 15 RPM, 1M TPM, 1,500 RPD ($0.00 / \u20AC0.00)",
      inputPer1MTokensUSD: "$0.00 (Free) / $0.075 (Paid)",
      outputPer1MTokensUSD: "$0.00 (Free) / $0.30 (Paid)",
      inputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC0.070 (Paid)",
      outputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC0.280 (Paid)"
    }
  },
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    provider: "Google DeepMind",
    category: "Google Gemini (Next-Gen)",
    description: "Premier reasoning and code generation engine for complex analytical challenges, multi-million token context digestion, and rigorous mathematical proofs.",
    codingStrengths: "Top-tier SWE-bench Verified coding score (52.1%), full-repository bug localization across 2M tokens, concurrency debugging, and architectural migration.",
    contextWindow: 2097152,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "Free Quota + Paid",
    protocol: "google-genai",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "Google AI Studio: 2 RPM, 32k TPM, 50 RPD ($0.00 / \u20AC0.00)",
      inputPer1MTokensUSD: "$0.00 (Free) / $1.25 (Paid)",
      outputPer1MTokensUSD: "$0.00 (Free) / $5.00 (Paid)",
      inputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC1.17 (Paid)",
      outputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC4.68 (Paid)"
    }
  },
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "Google DeepMind",
    category: "Google Gemini (Next-Gen)",
    description: "Next-generation streaming architecture optimized for high-frequency interactive dialogues, agent execution loops, and real-time tool calling.",
    codingStrengths: "Fast code generation, live bash command generation, regex drafting, and multi-turn conversational code debugging.",
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "Free Quota + Paid",
    protocol: "google-genai",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "Google AI Studio: 15 RPM, 1M TPM, 1,500 RPD ($0.00 / \u20AC0.00)",
      inputPer1MTokensUSD: "$0.00 (Free) / $0.10 (Paid)",
      outputPer1MTokensUSD: "$0.00 (Free) / $0.40 (Paid)",
      inputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC0.093 (Paid)",
      outputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC0.375 (Paid)"
    }
  },
  {
    id: "gemini-2.0-flash-lite",
    name: "Gemini 2.0 Flash Lite",
    provider: "Google DeepMind",
    category: "Google Gemini (Next-Gen)",
    description: "Ultra cost-efficient model designed for extreme token throughput, high token frequency, and ultra-low latency background tasks.",
    codingStrengths: "High-volume linting, boilerplate generation, JSON schema validation, and docstring automation.",
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "Free Quota + Paid",
    protocol: "google-genai",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "Google AI Studio: 30 RPM, 1,500 RPD ($0.00 / \u20AC0.00)",
      inputPer1MTokensUSD: "$0.00 (Free) / $0.075 (Paid)",
      outputPer1MTokensUSD: "$0.00 (Free) / $0.30 (Paid)",
      inputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC0.070 (Paid)",
      outputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC0.280 (Paid)"
    }
  },
  {
    id: "gemini-2.0-flash-thinking-exp",
    name: "Gemini 2.0 Flash Thinking Exp",
    provider: "Google DeepMind",
    category: "Google Gemini (Next-Gen)",
    description: "Experimental reasoning model that externalizes intermediate thoughts before responding, providing deep chain-of-thought code verification.",
    codingStrengths: "LiveCodeBench 57.1%, complex algorithmic puzzles, race condition detection, concurrency debugging, and step-by-step mathematical proofs.",
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "Free Quota + Paid",
    protocol: "google-genai",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "Google AI Studio Experimental: 10 RPM, 4M TPM ($0.00 / \u20AC0.00)",
      inputPer1MTokensUSD: "$0.00 (Free) / $0.100 (Paid)",
      outputPer1MTokensUSD: "$0.00 (Free) / $0.400 (Paid)",
      inputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC0.093 (Paid)",
      outputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC0.375 (Paid)"
    }
  },
  // ============================================================================
  // 2. GOOGLE GEMINI LONG-CONTEXT (Google DeepMind)
  // ============================================================================
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google DeepMind",
    category: "Google Gemini (Long-Context)",
    description: "2,000,000 token context window capable of ingesting entire multi-repository codebases, extensive architecture docs, and technical specifications.",
    codingStrengths: "Cross-repository dependency analysis, legacy codebase modernization, full-stack audit across hundreds of source files without chunking loss.",
    contextWindow: 2097152,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "Free Quota + Paid",
    protocol: "google-genai",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "Google AI Studio: 2 RPM, 32k TPM, 50 RPD ($0.00 / \u20AC0.00)",
      inputPer1MTokensUSD: "$0.00 (Free) / $1.25 (Paid)",
      outputPer1MTokensUSD: "$0.00 (Free) / $5.00 (Paid)",
      inputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC1.17 (Paid)",
      outputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC4.68 (Paid)"
    }
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    provider: "Google DeepMind",
    category: "Google Gemini (Long-Context)",
    description: "Fast, lightweight multimodal model with 1,000,000 tokens context window built for high-volume analysis and rapid code inspection.",
    codingStrengths: "Fast full-file parsing, multi-file code searches, log triage, and automated commit message generation.",
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "Free Quota + Paid",
    protocol: "google-genai",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "Google AI Studio: 15 RPM, 1M TPM ($0.00 / \u20AC0.00)",
      inputPer1MTokensUSD: "$0.00 (Free) / $0.075 (Paid)",
      outputPer1MTokensUSD: "$0.00 (Free) / $0.30 (Paid)",
      inputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC0.070 (Paid)",
      outputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC0.280 (Paid)"
    }
  },
  {
    id: "gemini-1.5-flash-8b",
    name: "Gemini 1.5 Flash 8B",
    provider: "Google DeepMind",
    category: "Google Gemini (Long-Context)",
    description: "Compact 8-billion parameter version built for high-speed lightweight routing, sub-second query classifications, and edge workloads.",
    codingStrengths: "Micro-task execution, syntax check, token-efficient query routing, and markdown code snippet extraction.",
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "Free Quota + Paid",
    protocol: "google-genai",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "Google AI Studio: 15 RPM ($0.00 / \u20AC0.00)",
      inputPer1MTokensUSD: "$0.00 (Free) / $0.0375 (Paid)",
      outputPer1MTokensUSD: "$0.00 (Free) / $0.15 (Paid)",
      inputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC0.035 (Paid)",
      outputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC0.140 (Paid)"
    }
  },
  // ============================================================================
  // 3. GOOGLE GEMMA OPEN WEIGHTS (Google DeepMind)
  // ============================================================================
  {
    id: "gemma-2-27b-it",
    name: "Gemma 2 (27B Instruct)",
    provider: "Google DeepMind",
    category: "Google Gemma (Open Weights)",
    description: "Google\u2019s flagship open weights model with performance rivaling proprietary models in mathematical and coding benchmarks.",
    codingStrengths: "Strong Python, TypeScript, and C++ code completion, algorithmic optimization, and competitive HumanEval score.",
    contextWindow: 8192,
    maxOutputTokens: 4096,
    recommended: false,
    tier: "Open Weights",
    protocol: "google-genai",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "Open Weights ($0.00 / \u20AC0.00) or Google AI Studio Free Quota",
      inputPer1MTokensUSD: "$0.00 (Free) / $0.27 (Vertex AI)",
      outputPer1MTokensUSD: "$0.00 (Free) / $0.27 (Vertex AI)",
      inputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC0.25 (Vertex AI)",
      outputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC0.25 (Vertex AI)"
    }
  },
  {
    id: "gemma-2-9b-it",
    name: "Gemma 2 (9B Instruct)",
    provider: "Google DeepMind",
    category: "Google Gemma (Open Weights)",
    description: "High efficiency open weights model with exceptional reasoning-per-parameter ratio and fast local/cloud inference.",
    codingStrengths: "Fast local code assistance, unit test generation, script writing, and compact containerized deployment.",
    contextWindow: 8192,
    maxOutputTokens: 4096,
    recommended: false,
    tier: "Open Weights",
    protocol: "google-genai",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "Open Weights ($0.00 / \u20AC0.00) or Google AI Studio Free Quota",
      inputPer1MTokensUSD: "$0.00 (Free) / $0.10 (Vertex AI)",
      outputPer1MTokensUSD: "$0.00 (Free) / $0.10 (Vertex AI)",
      inputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC0.09 (Vertex AI)",
      outputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC0.09 (Vertex AI)"
    }
  },
  {
    id: "gemma-2-2b-it",
    name: "Gemma 2 (2B Instruct)",
    provider: "Google DeepMind",
    category: "Google Gemma (Open Weights)",
    description: "Ultra-compact open weights model for on-device inference, edge computing, and minimal memory footprints.",
    codingStrengths: "On-device code completion, fast regex construction, lightweight CLI helpers, and mobile edge code intelligence.",
    contextWindow: 8192,
    maxOutputTokens: 4096,
    recommended: false,
    tier: "Open Weights",
    protocol: "google-genai",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "Open Weights ($0.00 / \u20AC0.00) or Google AI Studio Free Quota",
      inputPer1MTokensUSD: "$0.00 (Free) / $0.04 (Vertex AI)",
      outputPer1MTokensUSD: "$0.00 (Free) / $0.04 (Vertex AI)",
      inputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC0.037 (Vertex AI)",
      outputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC0.037 (Vertex AI)"
    }
  },
  // ============================================================================
  // 4. GOOGLE SPECIALIZED & EMBEDDINGS (Google DeepMind)
  // ============================================================================
  {
    id: "codegemma-7b-it",
    name: "CodeGemma (7B Instruct)",
    provider: "Google DeepMind",
    category: "Google Specialized & Embeddings",
    description: "Specialized code intelligence model fine-tuned on 500+ billion tokens of code, math, and technical documentation.",
    codingStrengths: "Code infilling (Fill-in-the-Middle), multi-language syntax completion (Python, JS, TS, Go, Java, C++, Rust), and refactoring.",
    contextWindow: 8192,
    maxOutputTokens: 4096,
    recommended: false,
    tier: "Open Weights",
    protocol: "google-genai",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "Open Weights ($0.00 / \u20AC0.00) or Google AI Studio Free Quota",
      inputPer1MTokensUSD: "$0.00 (Free) / $0.10 (Vertex AI)",
      outputPer1MTokensUSD: "$0.00 (Free) / $0.10 (Vertex AI)",
      inputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC0.09 (Vertex AI)",
      outputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC0.09 (Vertex AI)"
    }
  },
  {
    id: "codegemma-2b",
    name: "CodeGemma (2B Base/FIM)",
    provider: "Google DeepMind",
    category: "Google Specialized & Embeddings",
    description: "Ultra-fast code completion and fill-in-the-middle model designed for sub-50ms real-time IDE typing latency.",
    codingStrengths: "Low-latency Fill-in-the-Middle (FIM), inline code predictions, cursor completion, and IDE tab-completion integration.",
    contextWindow: 8192,
    maxOutputTokens: 2048,
    recommended: false,
    tier: "Open Weights",
    protocol: "google-genai",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "Open Weights ($0.00 / \u20AC0.00) or Google AI Studio Free Quota",
      inputPer1MTokensUSD: "$0.00 (Free) / $0.04 (Vertex AI)",
      outputPer1MTokensUSD: "$0.00 (Free) / $0.04 (Vertex AI)",
      inputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC0.037 (Vertex AI)",
      outputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC0.037 (Vertex AI)"
    }
  },
  {
    id: "recurrentgemma-2b-it",
    name: "RecurrentGemma (2B Instruct)",
    provider: "Google DeepMind",
    category: "Google Specialized & Embeddings",
    description: "Innovative recurrent model based on Griffin architecture, combining linear recurrences with local attention for constant memory usage at long sequences.",
    codingStrengths: "Constant-memory generation, infinite code trace analysis, lightweight embedded code execution, and high-frequency token generation.",
    contextWindow: 8192,
    maxOutputTokens: 4096,
    recommended: false,
    tier: "Open Weights",
    protocol: "google-genai",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "Open Weights ($0.00 / \u20AC0.00) or Google AI Studio Free Quota",
      inputPer1MTokensUSD: "$0.00 (Free) / $0.04 (Vertex AI)",
      outputPer1MTokensUSD: "$0.00 (Free) / $0.04 (Vertex AI)",
      inputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC0.037 (Vertex AI)",
      outputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC0.037 (Vertex AI)"
    }
  },
  {
    id: "text-embedding-004",
    name: "Text-Embedding-004",
    provider: "Google DeepMind",
    category: "Google Specialized & Embeddings",
    description: "State-of-the-art semantic text and code embedding model with 768-dimensional vector representations for code search and RAG.",
    codingStrengths: "Semantic codebase indexing, function definition retrieval, duplicate code identification, and hybrid vector/AST search.",
    contextWindow: 2048,
    maxOutputTokens: 768,
    recommended: false,
    tier: "Free Quota + Paid",
    protocol: "google-genai",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "Google AI Studio: 1,500 RPD ($0.00 / \u20AC0.00)",
      inputPer1MTokensUSD: "$0.00 (Free) / $0.025 (Paid)",
      outputPer1MTokensUSD: "$0.00 (Embeddings output zero billable generation tokens)",
      inputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC0.023 (Paid)",
      outputPer1MTokensEUR: "\u20AC0.00 (Embeddings output zero billable generation tokens)"
    }
  },
  // ============================================================================
  // 5. OPENROUTER FREE MODELS (https://openrouter.ai)
  // ============================================================================
  {
    id: "deepseek/deepseek-r1:free",
    name: "DeepSeek R1 (Free on OpenRouter)",
    provider: "OpenRouter",
    category: "OpenRouter Free Models",
    description: "Frontier open reasoning model with transparent chain-of-thought verification, rivaling proprietary reasoning models on math and code, 100% free via OpenRouter.",
    codingStrengths: "LiveCodeBench 65.7%, deep algorithmic logic, complex competitive programming (AIME, Codeforces), and rigorous bug verification.",
    contextWindow: 64e3,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "100% Free Community",
    protocol: "openai-compatible",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "OpenRouter Community Free Tier (20 RPM queue) ($0.00 / \u20AC0.00)",
      inputPer1MTokensUSD: "$0.00 (100% Free)",
      outputPer1MTokensUSD: "$0.00 (100% Free)",
      inputPer1MTokensEUR: "\u20AC0.00 (100% Free)",
      outputPer1MTokensEUR: "\u20AC0.00 (100% Free)"
    }
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct:free",
    name: "Llama 3.3 70B Instruct (Free on OpenRouter)",
    provider: "OpenRouter",
    category: "OpenRouter Free Models",
    description: "State-of-the-art Meta 70B open weight instruction model with 128k context, offering GPT-4 class coding capabilities for zero cost.",
    codingStrengths: "Full-stack web development, Python data engineering, REST API scaffolding, and clean documentation generation.",
    contextWindow: 128e3,
    maxOutputTokens: 4096,
    recommended: false,
    tier: "100% Free Community",
    protocol: "openai-compatible",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "OpenRouter Community Free Tier (20 RPM queue) ($0.00 / \u20AC0.00)",
      inputPer1MTokensUSD: "$0.00 (100% Free)",
      outputPer1MTokensUSD: "$0.00 (100% Free)",
      inputPer1MTokensEUR: "\u20AC0.00 (100% Free)",
      outputPer1MTokensEUR: "\u20AC0.00 (100% Free)"
    }
  },
  {
    id: "meta-llama/llama-3.3-70b:free",
    name: "Llama 3.3 70B (Free on OpenRouter Alias)",
    provider: "OpenRouter",
    category: "OpenRouter Free Models",
    description: "Legacy alias endpoint for Meta Llama 3.3 70B on OpenRouter community free infrastructure.",
    codingStrengths: "General code assistance, Python/TypeScript development, and system scripts.",
    contextWindow: 128e3,
    maxOutputTokens: 4096,
    recommended: false,
    tier: "100% Free Community",
    protocol: "openai-compatible",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "OpenRouter Community Free Tier ($0.00 / \u20AC0.00)",
      inputPer1MTokensUSD: "$0.00 (100% Free)",
      outputPer1MTokensUSD: "$0.00 (100% Free)",
      inputPer1MTokensEUR: "\u20AC0.00 (100% Free)",
      outputPer1MTokensEUR: "\u20AC0.00 (100% Free)"
    }
  },
  {
    id: "google/gemini-2.0-flash-exp:free",
    name: "Gemini 2.0 Flash Exp (Free on OpenRouter)",
    provider: "OpenRouter",
    category: "OpenRouter Free Models",
    description: "Ultra-fast Google experimental Gemini 2.0 Flash endpoint with 1M context accessed with zero cost via OpenRouter gateway.",
    codingStrengths: "Fast code refactoring, instant code reviews, multi-language translation, and streaming assistant responses.",
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "100% Free Community",
    protocol: "openai-compatible",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "OpenRouter Community Free Tier ($0.00 / \u20AC0.00)",
      inputPer1MTokensUSD: "$0.00 (100% Free)",
      outputPer1MTokensUSD: "$0.00 (100% Free)",
      inputPer1MTokensEUR: "\u20AC0.00 (100% Free)",
      outputPer1MTokensEUR: "\u20AC0.00 (100% Free)"
    }
  },
  {
    id: "qwen/qwen-2.5-coder-32b-instruct:free",
    name: "Qwen 2.5 Coder 32B (Free on OpenRouter)",
    provider: "OpenRouter",
    category: "OpenRouter Free Models",
    description: "Alibaba Qwen dedicated code specialist with 128k context, scoring top marks on LiveCodeBench, accessible for free on OpenRouter.",
    codingStrengths: "LiveCodeBench 55.5%, SWE-bench Verified 39.8%, unmatched efficiency-per-parameter, AST modifications, and multi-file editing.",
    contextWindow: 128e3,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "100% Free Community",
    protocol: "openai-compatible",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "OpenRouter Community Free Tier ($0.00 / \u20AC0.00)",
      inputPer1MTokensUSD: "$0.00 (100% Free)",
      outputPer1MTokensUSD: "$0.00 (100% Free)",
      inputPer1MTokensEUR: "\u20AC0.00 (100% Free)",
      outputPer1MTokensEUR: "\u20AC0.00 (100% Free)"
    }
  },
  {
    id: "mistralai/mistral-7b-instruct:free",
    name: "Mistral 7B Instruct (Free on OpenRouter)",
    provider: "OpenRouter",
    category: "OpenRouter Free Models",
    description: "Fast, reliable 7B lightweight instruction model on OpenRouter community queue for agile scripting and rapid prototyping.",
    codingStrengths: "Fast bash scripting, basic unit testing, regex parsing, and lightweight configuration generation.",
    contextWindow: 32768,
    maxOutputTokens: 4096,
    recommended: false,
    tier: "100% Free Community",
    protocol: "openai-compatible",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "OpenRouter Community Free Tier ($0.00 / \u20AC0.00)",
      inputPer1MTokensUSD: "$0.00 (100% Free)",
      outputPer1MTokensUSD: "$0.00 (100% Free)",
      inputPer1MTokensEUR: "\u20AC0.00 (100% Free)",
      outputPer1MTokensEUR: "\u20AC0.00 (100% Free)"
    }
  },
  {
    id: "google/gemini-2.0-pro-exp-02-05:free",
    name: "Gemini 2.0 Pro Exp 02-05 (Free on OpenRouter)",
    provider: "OpenRouter",
    category: "OpenRouter Free Models",
    description: "Google\u2019s experimental premier reasoning model snapshot with 2M token context, benchmark-grade coding, and deep agentic planning on OpenRouter.",
    codingStrengths: "SWE-bench software engineering, architectural planning, massive whole-repository refactoring, and multi-file debugging.",
    contextWindow: 2097152,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "100% Free Community",
    protocol: "openai-compatible",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "OpenRouter Community Free Tier ($0.00 / \u20AC0.00)",
      inputPer1MTokensUSD: "$0.00 (100% Free)",
      outputPer1MTokensUSD: "$0.00 (100% Free)",
      inputPer1MTokensEUR: "\u20AC0.00 (100% Free)",
      outputPer1MTokensEUR: "\u20AC0.00 (100% Free)"
    }
  },
  {
    id: "microsoft/phi-3-medium-128k-instruct:free",
    name: "Phi-3 Medium 128k Instruct (Free on OpenRouter)",
    provider: "OpenRouter",
    category: "OpenRouter Free Models",
    description: "Microsoft's 14B state-of-the-art small language model trained on highly curated synthetic educational data with 128k context.",
    codingStrengths: "Algorithmic logic, Python/C# data structures, mathematics verification, and concise code explanations.",
    contextWindow: 128e3,
    maxOutputTokens: 4096,
    recommended: false,
    tier: "100% Free Community",
    protocol: "openai-compatible",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "OpenRouter Community Free Tier ($0.00 / \u20AC0.00)",
      inputPer1MTokensUSD: "$0.00 (100% Free)",
      outputPer1MTokensUSD: "$0.00 (100% Free)",
      inputPer1MTokensEUR: "\u20AC0.00 (100% Free)",
      outputPer1MTokensEUR: "\u20AC0.00 (100% Free)"
    }
  },
  // ============================================================================
  // 6. OPENROUTER TOP PAID MODELS
  // ============================================================================
  {
    id: "anthropic/claude-3.7-sonnet",
    name: "Claude 3.7 Sonnet (OpenRouter)",
    provider: "OpenRouter",
    category: "OpenRouter Premium",
    description: "Anthropic's flagship hybrid reasoning model combining instant inference with dynamic extended thinking, #1 ranked in SWE-bench and LiveCodeBench.",
    codingStrengths: "SWE-bench Verified 70.3%, LiveCodeBench 65.8%, autonomous multi-file repository refactoring, deep bug remediation, frontend UI precision.",
    contextWindow: 2e5,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "OpenRouter Paid",
    protocol: "openai-compatible",
    pricing: {
      freeTierStatus: "Paid / Pay-As-You-Go Only",
      freeTierDetails: "OpenRouter pay-as-you-go balance",
      inputPer1MTokensUSD: "$3.00",
      outputPer1MTokensUSD: "$15.00",
      inputPer1MTokensEUR: "\u20AC2.80",
      outputPer1MTokensEUR: "\u20AC14.00"
    }
  },
  {
    id: "anthropic/claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet (OpenRouter)",
    provider: "OpenRouter",
    category: "OpenRouter Premium",
    description: "Industry benchmark for code generation, visual comprehension, and multi-turn pair programming with flawless architectural consistency.",
    codingStrengths: "Exceptional code synthesis, UI/UX component generation, thorough test case authoring, and complex bug remediation.",
    contextWindow: 2e5,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "OpenRouter Paid",
    protocol: "openai-compatible",
    pricing: {
      freeTierStatus: "Paid / Pay-As-You-Go Only",
      freeTierDetails: "OpenRouter pay-as-you-go balance",
      inputPer1MTokensUSD: "$3.00",
      outputPer1MTokensUSD: "$15.00",
      inputPer1MTokensEUR: "\u20AC2.80",
      outputPer1MTokensEUR: "\u20AC14.00"
    }
  },
  {
    id: "anthropic/claude-3.5-haiku",
    name: "Claude 3.5 Haiku (OpenRouter)",
    provider: "OpenRouter",
    category: "OpenRouter Premium",
    description: "High-speed, cost-effective Anthropic model matching Claude 3 Opus capabilities at a fraction of latency and cost.",
    codingStrengths: "High-throughput subagent tasks, rapid code editing, CLI tooling, and fast test execution monitoring.",
    contextWindow: 2e5,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "OpenRouter Paid",
    protocol: "openai-compatible",
    pricing: {
      freeTierStatus: "Paid / Pay-As-You-Go Only",
      freeTierDetails: "OpenRouter pay-as-you-go balance",
      inputPer1MTokensUSD: "$0.80",
      outputPer1MTokensUSD: "$4.00",
      inputPer1MTokensEUR: "\u20AC0.75",
      outputPer1MTokensEUR: "\u20AC3.75"
    }
  },
  {
    id: "openai/o3-mini",
    name: "OpenAI o3-mini (OpenRouter)",
    provider: "OpenRouter",
    category: "OpenRouter Premium",
    description: "OpenAI's latest cost-efficient reasoning model optimized for STEM, competitive programming, and complex multi-step logic.",
    codingStrengths: "LiveCodeBench 61.4%, algorithmic optimization, competitive math, and reasoning effort controls (low/med/high).",
    contextWindow: 2e5,
    maxOutputTokens: 1e5,
    recommended: false,
    tier: "OpenRouter Paid",
    protocol: "openai-compatible",
    pricing: {
      freeTierStatus: "Paid / Pay-As-You-Go Only",
      freeTierDetails: "OpenRouter pay-as-you-go balance",
      inputPer1MTokensUSD: "$1.10",
      outputPer1MTokensUSD: "$4.40",
      inputPer1MTokensEUR: "\u20AC1.02",
      outputPer1MTokensEUR: "\u20AC4.10"
    }
  },
  {
    id: "openai/o1",
    name: "OpenAI o1 (OpenRouter)",
    provider: "OpenRouter",
    category: "OpenRouter Premium",
    description: "OpenAI's flagship deep reasoning model designed for complex planning, scientific problem solving, and rigorous software development.",
    codingStrengths: "LiveCodeBench 62.5%, SWE-bench Verified 48.9%, complex algorithm design, security vulnerability exploit analysis, and deep mathematical logic.",
    contextWindow: 2e5,
    maxOutputTokens: 1e5,
    recommended: false,
    tier: "OpenRouter Paid",
    protocol: "openai-compatible",
    pricing: {
      freeTierStatus: "Paid / Pay-As-You-Go Only",
      freeTierDetails: "OpenRouter pay-as-you-go balance",
      inputPer1MTokensUSD: "$15.00",
      outputPer1MTokensUSD: "$60.00",
      inputPer1MTokensEUR: "\u20AC14.00",
      outputPer1MTokensEUR: "\u20AC56.00"
    }
  },
  {
    id: "openai/gpt-4o",
    name: "OpenAI GPT-4o (OpenRouter)",
    provider: "OpenRouter",
    category: "OpenRouter Premium",
    description: "OpenAI's flagship omni model combining fast multimodal intelligence, strong coding, and 128k context.",
    codingStrengths: "Full-stack app scaffolding, multimodal UI-to-code generation, robust REST API design, and multi-language support.",
    contextWindow: 128e3,
    maxOutputTokens: 16384,
    recommended: false,
    tier: "OpenRouter Paid",
    protocol: "openai-compatible",
    pricing: {
      freeTierStatus: "Paid / Pay-As-You-Go Only",
      freeTierDetails: "OpenRouter pay-as-you-go balance",
      inputPer1MTokensUSD: "$2.50",
      outputPer1MTokensUSD: "$10.00",
      inputPer1MTokensEUR: "\u20AC2.33",
      outputPer1MTokensEUR: "\u20AC9.30"
    }
  },
  {
    id: "openai/gpt-4o-mini",
    name: "OpenAI GPT-4o-mini (OpenRouter)",
    provider: "OpenRouter",
    category: "OpenRouter Premium",
    description: "Compact, extremely affordable and fast model outperforming GPT-3.5 across coding and reasoning benchmarks.",
    codingStrengths: "Lightweight script generation, data transformations, unit test stubbing, and high-volume background tasks.",
    contextWindow: 128e3,
    maxOutputTokens: 16384,
    recommended: false,
    tier: "OpenRouter Paid",
    protocol: "openai-compatible",
    pricing: {
      freeTierStatus: "Paid / Pay-As-You-Go Only",
      freeTierDetails: "OpenRouter pay-as-you-go balance",
      inputPer1MTokensUSD: "$0.15",
      outputPer1MTokensUSD: "$0.60",
      inputPer1MTokensEUR: "\u20AC0.14",
      outputPer1MTokensEUR: "\u20AC0.56"
    }
  },
  {
    id: "deepseek/deepseek-r1",
    name: "DeepSeek R1 (OpenRouter Paid)",
    provider: "OpenRouter",
    category: "OpenRouter Premium",
    description: "Open-weights reasoning powerhouse on dedicated OpenRouter paid infrastructure without community queue throttling.",
    codingStrengths: "High-priority competitive programming, formal verification, complex multi-step debugging, and mathematical logic proofs.",
    contextWindow: 64e3,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "OpenRouter Paid",
    protocol: "openai-compatible",
    pricing: {
      freeTierStatus: "Paid / Pay-As-You-Go Only",
      freeTierDetails: "OpenRouter pay-as-you-go balance",
      inputPer1MTokensUSD: "$0.55",
      outputPer1MTokensUSD: "$2.19",
      inputPer1MTokensEUR: "\u20AC0.51",
      outputPer1MTokensEUR: "\u20AC2.04"
    }
  },
  {
    id: "qwen/qwen-2.5-coder-32b-instruct",
    name: "Qwen 2.5 Coder 32B (OpenRouter Paid)",
    provider: "OpenRouter",
    category: "OpenRouter Premium",
    description: "Alibaba's premier code intelligence model on dedicated low-latency OpenRouter enterprise infrastructure.",
    codingStrengths: "Top LiveCodeBench score (55.5%), multi-file code editing, AST analysis, repository-wide consistency, and unit test generation.",
    contextWindow: 128e3,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "OpenRouter Paid",
    protocol: "openai-compatible",
    pricing: {
      freeTierStatus: "Paid / Pay-As-You-Go Only",
      freeTierDetails: "OpenRouter pay-as-you-go balance",
      inputPer1MTokensUSD: "$0.18",
      outputPer1MTokensUSD: "$0.18",
      inputPer1MTokensEUR: "\u20AC0.17",
      outputPer1MTokensEUR: "\u20AC0.17"
    }
  },
  {
    id: "meta-llama/llama-3.1-405b-instruct",
    name: "Meta Llama 3.1 405B Instruct (OpenRouter)",
    provider: "OpenRouter",
    category: "OpenRouter Premium",
    description: "Meta\u2019s 405B open-weight frontier model delivering massive knowledge capacity, deep reasoning, and high coding prowess.",
    codingStrengths: "Synthetic dataset generation, complex compiler design, formal verification, and enterprise architecture blueprints.",
    contextWindow: 128e3,
    maxOutputTokens: 4096,
    recommended: false,
    tier: "OpenRouter Paid",
    protocol: "openai-compatible",
    pricing: {
      freeTierStatus: "Paid / Pay-As-You-Go Only",
      freeTierDetails: "OpenRouter pay-as-you-go balance",
      inputPer1MTokensUSD: "$2.50",
      outputPer1MTokensUSD: "$2.50",
      inputPer1MTokensEUR: "\u20AC2.33",
      outputPer1MTokensEUR: "\u20AC2.33"
    }
  },
  {
    id: "mistralai/codestral-2501",
    name: "Codestral 25.01 (OpenRouter)",
    provider: "OpenRouter",
    category: "OpenRouter Premium",
    description: "Mistral AI\u2019s state-of-the-art coding engine with 256k context and specialized support for 80+ programming languages.",
    codingStrengths: "Fill-in-the-Middle (FIM), 256k context repo-level reasoning, Python/Rust/C++/Java/TS expert debugging, and test suite generation.",
    contextWindow: 256e3,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "OpenRouter Paid",
    protocol: "openai-compatible",
    pricing: {
      freeTierStatus: "Paid / Pay-As-You-Go Only",
      freeTierDetails: "OpenRouter pay-as-you-go balance",
      inputPer1MTokensUSD: "$0.30",
      outputPer1MTokensUSD: "$0.90",
      inputPer1MTokensEUR: "\u20AC0.28",
      outputPer1MTokensEUR: "\u20AC0.84"
    }
  },
  {
    id: "x-ai/grok-2-1212",
    name: "xAI Grok 2 (1212) (OpenRouter)",
    provider: "OpenRouter",
    category: "OpenRouter Premium",
    description: "xAI\u2019s flagship frontier model with strong coding capabilities, real-time knowledge synthesis, and mathematical reasoning.",
    codingStrengths: "Rapid code generation, creative algorithm design, complex system diagnostics, and API integration code.",
    contextWindow: 131072,
    maxOutputTokens: 4096,
    recommended: false,
    tier: "OpenRouter Paid",
    protocol: "openai-compatible",
    pricing: {
      freeTierStatus: "Paid / Pay-As-You-Go Only",
      freeTierDetails: "OpenRouter pay-as-you-go balance",
      inputPer1MTokensUSD: "$2.00",
      outputPer1MTokensUSD: "$10.00",
      inputPer1MTokensEUR: "\u20AC1.86",
      outputPer1MTokensEUR: "\u20AC9.30"
    }
  },
  {
    id: "cohere/command-r-plus-08-2024",
    name: "Cohere Command R+ (08-2024) (OpenRouter)",
    provider: "OpenRouter",
    category: "OpenRouter Premium",
    description: "Enterprise-grade RAG and tool-use model optimized for multi-step reasoning, citations, and business logic execution.",
    codingStrengths: "Multi-hop tool orchestration, automated documentation parsing, API client synthesis, and structured JSON output.",
    contextWindow: 128e3,
    maxOutputTokens: 4096,
    recommended: false,
    tier: "OpenRouter Paid",
    protocol: "openai-compatible",
    pricing: {
      freeTierStatus: "Paid / Pay-As-You-Go Only",
      freeTierDetails: "OpenRouter pay-as-you-go balance",
      inputPer1MTokensUSD: "$2.50",
      outputPer1MTokensUSD: "$10.00",
      inputPer1MTokensEUR: "\u20AC2.33",
      outputPer1MTokensEUR: "\u20AC9.30"
    }
  },
  {
    id: "openrouter/deepseek-chat",
    name: "DeepSeek V3 (OpenRouter Premium)",
    provider: "OpenRouter",
    category: "OpenRouter Premium",
    description: "DeepSeek V3 671B MoE model with extreme cost efficiency and high coding quality.",
    codingStrengths: "Cost-efficient code generation, full-stack web applications, refactoring, and multi-language syntax.",
    contextWindow: 64e3,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "OpenRouter Paid",
    protocol: "openai-compatible",
    pricing: {
      freeTierStatus: "Paid / Pay-As-You-Go Only",
      freeTierDetails: "OpenRouter credit balance",
      inputPer1MTokensUSD: "$0.14",
      outputPer1MTokensUSD: "$0.28",
      inputPer1MTokensEUR: "\u20AC0.13",
      outputPer1MTokensEUR: "\u20AC0.26"
    }
  },
  // ============================================================================
  // 7. ANTHROPIC CLAUDE ON GOOGLE CLOUD (Vertex AI Model Garden)
  // ============================================================================
  {
    id: "claude-3-7-sonnet",
    name: "Claude 3.7 Sonnet (Vertex AI)",
    provider: "Anthropic",
    category: "Anthropic Claude on Google Cloud",
    description: "Hybrid reasoning and instant response model available on Google Cloud Vertex AI infrastructure.",
    codingStrengths: "SWE-bench 70.3%, multi-turn tool calling, architectural code synthesis, and Google Cloud integration.",
    contextWindow: 2e5,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "Vertex AI Enterprise",
    protocol: "google-partner",
    pricing: {
      freeTierStatus: "Paid / Pay-As-You-Go Only",
      freeTierDetails: "Google Cloud billing per token consumption",
      inputPer1MTokensUSD: "$3.00",
      outputPer1MTokensUSD: "$15.00",
      inputPer1MTokensEUR: "\u20AC2.80",
      outputPer1MTokensEUR: "\u20AC14.00"
    }
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet (Vertex AI)",
    provider: "Anthropic",
    category: "Anthropic Claude on Google Cloud",
    description: "Industry benchmark for code generation and multi-step reasoning on Google Cloud Vertex AI.",
    codingStrengths: "High-precision code completion, UI layout rendering, and complex bug remediation.",
    contextWindow: 2e5,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "Vertex AI Enterprise",
    protocol: "google-partner",
    pricing: {
      freeTierStatus: "Paid / Pay-As-You-Go Only",
      freeTierDetails: "Google Cloud billing per token consumption",
      inputPer1MTokensUSD: "$3.00",
      outputPer1MTokensUSD: "$15.00",
      inputPer1MTokensEUR: "\u20AC2.80",
      outputPer1MTokensEUR: "\u20AC14.00"
    }
  },
  {
    id: "claude-3-5-haiku",
    name: "Claude 3.5 Haiku (Vertex AI)",
    provider: "Anthropic",
    category: "Anthropic Claude on Google Cloud",
    description: "High speed, cost-effective Anthropic model running in Google Cloud.",
    codingStrengths: "Fast subagent logic, lightweight code reviews, and CLI parsing.",
    contextWindow: 2e5,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "Vertex AI Enterprise",
    protocol: "google-partner",
    pricing: {
      freeTierStatus: "Paid / Pay-As-You-Go Only",
      freeTierDetails: "Google Cloud billing per token consumption",
      inputPer1MTokensUSD: "$0.80",
      outputPer1MTokensUSD: "$4.00",
      inputPer1MTokensEUR: "\u20AC0.75",
      outputPer1MTokensEUR: "\u20AC3.75"
    }
  },
  // ============================================================================
  // 8. META LLAMA 3 ON GOOGLE CLOUD (Vertex AI Model Garden)
  // ============================================================================
  {
    id: "llama-3.3-70b-instruct",
    name: "Meta Llama 3.3 (70B Instruct - Vertex AI)",
    provider: "Meta",
    category: "Meta Llama 3 on Google Cloud",
    description: "Meta\u2019s latest 70-billion parameter model fully hosted on Google Cloud Vertex AI.",
    codingStrengths: "Web backend logic, Python scripts, SQL querying, and unit test generation.",
    contextWindow: 128e3,
    maxOutputTokens: 4096,
    recommended: false,
    tier: "Vertex AI Enterprise",
    protocol: "google-partner",
    pricing: {
      freeTierStatus: "Paid / Pay-As-You-Go Only",
      freeTierDetails: "Google Cloud Vertex AI prediction pricing",
      inputPer1MTokensUSD: "$0.70",
      outputPer1MTokensUSD: "$0.90",
      inputPer1MTokensEUR: "\u20AC0.65",
      outputPer1MTokensEUR: "\u20AC0.84"
    }
  },
  {
    id: "llama-3.2-90b-vision-instruct",
    name: "Meta Llama 3.2 (90B Vision - Vertex AI)",
    provider: "Meta",
    category: "Meta Llama 3 on Google Cloud",
    description: "Premier open multimodal vision and text model on Google Cloud Vertex AI.",
    codingStrengths: "Visual diagram-to-code, architecture layout inspection, and image OCR.",
    contextWindow: 128e3,
    maxOutputTokens: 4096,
    recommended: false,
    tier: "Vertex AI Enterprise",
    protocol: "google-partner",
    pricing: {
      freeTierStatus: "Paid / Pay-As-You-Go Only",
      freeTierDetails: "Google Cloud Vertex AI prediction pricing",
      inputPer1MTokensUSD: "$0.90",
      outputPer1MTokensUSD: "$1.20",
      inputPer1MTokensEUR: "\u20AC0.84",
      outputPer1MTokensEUR: "\u20AC1.12"
    }
  },
  {
    id: "llama-3.1-405b-instruct",
    name: "Meta Llama 3.1 (405B Instruct - Vertex AI)",
    provider: "Meta",
    category: "Meta Llama 3 on Google Cloud",
    description: "Massive 405-billion parameter frontier model running on Google Cloud TPU/GPU cluster.",
    codingStrengths: "Massive knowledge synthesis, complex compiler design, and synthetic dataset generation.",
    contextWindow: 128e3,
    maxOutputTokens: 4096,
    recommended: false,
    tier: "Vertex AI Enterprise",
    protocol: "google-partner",
    pricing: {
      freeTierStatus: "Paid / Pay-As-You-Go Only",
      freeTierDetails: "Google Cloud Vertex AI prediction pricing",
      inputPer1MTokensUSD: "$3.50",
      outputPer1MTokensUSD: "$3.50",
      inputPer1MTokensEUR: "\u20AC3.25",
      outputPer1MTokensEUR: "\u20AC3.25"
    }
  },
  // ============================================================================
  // 9. MISTRAL AI ON GOOGLE CLOUD (Vertex AI Model Garden)
  // ============================================================================
  {
    id: "mistral-large-2411",
    name: "Mistral Large 2 (Vertex AI)",
    provider: "Mistral AI",
    category: "Mistral AI on Google Cloud",
    description: "Mistral\u2019s top-tier multilingual reasoning and coding model on Google Cloud.",
    codingStrengths: "Multilingual codebase translation, complex multi-turn logic, and JSON schema compliance.",
    contextWindow: 128e3,
    maxOutputTokens: 4096,
    recommended: false,
    tier: "Vertex AI Enterprise",
    protocol: "google-partner",
    pricing: {
      freeTierStatus: "Paid / Pay-As-You-Go Only",
      freeTierDetails: "Google Cloud Vertex AI prediction pricing",
      inputPer1MTokensUSD: "$2.00",
      outputPer1MTokensUSD: "$6.00",
      inputPer1MTokensEUR: "\u20AC1.86",
      outputPer1MTokensEUR: "\u20AC5.60"
    }
  },
  {
    id: "codestral-2501",
    name: "Codestral 25.01 (Vertex AI)",
    provider: "Mistral AI",
    category: "Mistral AI on Google Cloud",
    description: "Specialized code completion, debugging, and fill-in-the-middle on Google Cloud Vertex AI.",
    codingStrengths: "Fast Fill-in-the-Middle (FIM), 256k context, and multi-file code completion.",
    contextWindow: 256e3,
    maxOutputTokens: 4096,
    recommended: false,
    tier: "Vertex AI Enterprise",
    protocol: "google-partner",
    pricing: {
      freeTierStatus: "Paid / Pay-As-You-Go Only",
      freeTierDetails: "Google Cloud Vertex AI prediction pricing",
      inputPer1MTokensUSD: "$0.30",
      outputPer1MTokensUSD: "$0.90",
      inputPer1MTokensEUR: "\u20AC0.28",
      outputPer1MTokensEUR: "\u20AC0.84"
    }
  },
  // ============================================================================
  // 10. DEEPSEEK & AI21 ON GOOGLE CLOUD (Vertex AI Model Garden)
  // ============================================================================
  {
    id: "deepseek-r1",
    name: "DeepSeek R1 (Vertex AI)",
    provider: "DeepSeek",
    category: "DeepSeek on Google Cloud",
    description: "Frontier open reasoning model with transparent chain-of-thought verification hosted on Google Cloud Vertex AI compute.",
    codingStrengths: "Deep algorithmic problem solving, code reasoning verification, and competitive programming.",
    contextWindow: 64e3,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "Open Weights",
    protocol: "google-partner",
    pricing: {
      freeTierStatus: "Paid / Pay-As-You-Go Only",
      freeTierDetails: "Vertex AI Model Garden compute rate",
      inputPer1MTokensUSD: "$0.55",
      outputPer1MTokensUSD: "$2.19",
      inputPer1MTokensEUR: "\u20AC0.51",
      outputPer1MTokensEUR: "\u20AC2.04"
    }
  },
  {
    id: "jamba-1.5-large",
    name: "AI21 Jamba 1.5 Large",
    provider: "AI21 Labs",
    category: "AI21 Labs & Cohere on Google Cloud",
    description: "Hybrid Mamba-Transformer architecture offering 256,000 tokens long-context speed on Google Cloud.",
    codingStrengths: "High-speed long document parsing, config analysis, and structured code translation.",
    contextWindow: 256e3,
    maxOutputTokens: 4096,
    recommended: false,
    tier: "Vertex AI Enterprise",
    protocol: "google-partner",
    pricing: {
      freeTierStatus: "Paid / Pay-As-You-Go Only",
      freeTierDetails: "Google Cloud Vertex AI prediction pricing",
      inputPer1MTokensUSD: "$2.00",
      outputPer1MTokensUSD: "$8.00",
      inputPer1MTokensEUR: "\u20AC1.86",
      outputPer1MTokensEUR: "\u20AC7.45"
    }
  },
  {
    id: "command-r-plus",
    name: "Cohere Command R+",
    provider: "Cohere",
    category: "AI21 Labs & Cohere on Google Cloud",
    description: "Enterprise Retrieval-Augmented Generation (RAG) model on Google Cloud.",
    codingStrengths: "API tool calling, citation-grounded code search, and documentation querying.",
    contextWindow: 128e3,
    maxOutputTokens: 4096,
    recommended: false,
    tier: "Vertex AI Enterprise",
    protocol: "google-partner",
    pricing: {
      freeTierStatus: "Paid / Pay-As-You-Go Only",
      freeTierDetails: "Google Cloud Vertex AI prediction pricing",
      inputPer1MTokensUSD: "$2.50",
      outputPer1MTokensUSD: "$10.00",
      inputPer1MTokensEUR: "\u20AC2.33",
      outputPer1MTokensEUR: "\u20AC9.30"
    }
  },
  // ============================================================================
  // 11. OMNIROUTE DAEMON CLUSTER (http://100.66.98.4:20128)
  // ============================================================================
  {
    id: "omniroute/gemini-2.5-pro",
    name: "OmniRoute Gemini 2.5 Pro (Edge Router)",
    provider: "OmniRoute",
    category: "OmniRoute Daemon Cluster",
    description: "High-availability routing proxy via OmniRoute daemon with automatic load balancing and fallback.",
    codingStrengths: "Edge routed 2M token context for whole-repo analysis with automatic failover.",
    contextWindow: 2097152,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "OmniRoute Daemon",
    protocol: "openai-compatible",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "Direct edge routing via internal daemon cluster ($0.00 margin)",
      inputPer1MTokensUSD: "$0.00 (Self-Hosted) / $1.25 (Upstream)",
      outputPer1MTokensUSD: "$0.00 (Self-Hosted) / $5.00 (Upstream)",
      inputPer1MTokensEUR: "\u20AC0.00 (Self-Hosted) / \u20AC1.17 (Upstream)",
      outputPer1MTokensEUR: "\u20AC0.00 (Self-Hosted) / \u20AC4.68 (Upstream)"
    }
  },
  {
    id: "omniroute/deepseek-r1",
    name: "OmniRoute DeepSeek R1 (Daemon Cluster)",
    provider: "OmniRoute",
    category: "OmniRoute Daemon Cluster",
    description: "DeepSeek R1 reasoning executed through local OmniRoute daemon cluster.",
    codingStrengths: "High-throughput reasoning without rate limit choke points.",
    contextWindow: 64e3,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "OmniRoute Daemon",
    protocol: "openai-compatible",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "Routed through high-throughput OmniRoute node ($0.00 node fee)",
      inputPer1MTokensUSD: "$0.00 (Local) / $0.55 (Upstream)",
      outputPer1MTokensUSD: "$0.00 (Local) / $2.19 (Upstream)",
      inputPer1MTokensEUR: "\u20AC0.00 (Local) / \u20AC0.51 (Upstream)",
      outputPer1MTokensEUR: "\u20AC0.00 (Local) / \u20AC2.04 (Upstream)"
    }
  },
  {
    id: "omniroute/claude-3.5-sonnet",
    name: "OmniRoute Claude 3.5 Sonnet (Edge Proxy)",
    provider: "OmniRoute",
    category: "OmniRoute Daemon Cluster",
    description: "Anthropic Claude 3.5 Sonnet proxied through high-reliability OmniRoute daemon gateway.",
    codingStrengths: "Edge proxied pair programming and refactoring pipeline.",
    contextWindow: 2e5,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "OmniRoute Daemon",
    protocol: "openai-compatible",
    pricing: {
      freeTierStatus: "Paid / Pay-As-You-Go Only",
      freeTierDetails: "Edge-routed Anthropic upstream billing",
      inputPer1MTokensUSD: "$3.00",
      outputPer1MTokensUSD: "$15.00",
      inputPer1MTokensEUR: "\u20AC2.80",
      outputPer1MTokensEUR: "\u20AC14.00"
    }
  },
  // ============================================================================
  // 12. OPENCODE GO PLATFORMS (OpenCode AI Platform API)
  // ============================================================================
  {
    id: "opencode/go-coder-32b",
    name: "OpenCode Go Coder 32B",
    provider: "OpenCode AI",
    category: "OpenCode Go Platforms",
    description: "Specialized enterprise coding platform model with automated unit test generation, AST analysis, and refactoring.",
    codingStrengths: "Automated test suite generation, syntax refactoring, AST linting, and bug fixing.",
    contextWindow: 64e3,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "OpenCode Platform",
    protocol: "openai-compatible",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "OpenCode Developer Community Quota ($0.00 / \u20AC0.00)",
      inputPer1MTokensUSD: "$0.00 (Dev Tier) / $0.20 (Prod)",
      outputPer1MTokensUSD: "$0.00 (Dev Tier) / $0.60 (Prod)",
      inputPer1MTokensEUR: "\u20AC0.00 (Dev Tier) / \u20AC0.18 (Prod)",
      outputPer1MTokensEUR: "\u20AC0.00 (Dev Tier) / \u20AC0.55 (Prod)"
    }
  },
  {
    id: "opencode/go-fast",
    name: "OpenCode Go Fast (Low-Latency)",
    provider: "OpenCode AI",
    category: "OpenCode Go Platforms",
    description: "Ultra-low latency code agent model optimized for autocomplete and fast interactive edits.",
    codingStrengths: "Fast auto-complete, short snippet transformations, and inline suggestions.",
    contextWindow: 32768,
    maxOutputTokens: 4096,
    recommended: false,
    tier: "OpenCode Platform",
    protocol: "openai-compatible",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "OpenCode Developer Community Quota ($0.00 / \u20AC0.00)",
      inputPer1MTokensUSD: "$0.00 (Dev Tier) / $0.08 (Prod)",
      outputPer1MTokensUSD: "$0.00 (Dev Tier) / $0.24 (Prod)",
      inputPer1MTokensEUR: "\u20AC0.00 (Dev Tier) / \u20AC0.07 (Prod)",
      outputPer1MTokensEUR: "\u20AC0.00 (Dev Tier) / \u20AC0.22 (Prod)"
    }
  }
];
var ModelRegistry = class {
  static getAllModels() {
    return [...COMPLETE_GOOGLE_MODEL_CATALOG];
  }
  static getModelById(id) {
    return COMPLETE_GOOGLE_MODEL_CATALOG.find((m) => m.id === id);
  }
  static isValidModel(id) {
    return COMPLETE_GOOGLE_MODEL_CATALOG.some((m) => m.id === id);
  }
  static getDefaultModel() {
    return COMPLETE_GOOGLE_MODEL_CATALOG.find((m) => m.recommended) || COMPLETE_GOOGLE_MODEL_CATALOG[0];
  }
  static getCategories() {
    const cats = new Set(COMPLETE_GOOGLE_MODEL_CATALOG.map((m) => m.category));
    return Array.from(cats);
  }
  static getModelsByCategory(category) {
    return COMPLETE_GOOGLE_MODEL_CATALOG.filter((m) => m.category === category);
  }
  static getFreeModels() {
    return COMPLETE_GOOGLE_MODEL_CATALOG.filter((m) => m.pricing.freeTierStatus === "100% Free Quota Available");
  }
  static getPaidOnlyModels() {
    return COMPLETE_GOOGLE_MODEL_CATALOG.filter((m) => m.pricing.freeTierStatus === "Paid / Pay-As-You-Go Only");
  }
  static getGoogleModels() {
    return COMPLETE_GOOGLE_MODEL_CATALOG.filter((m) => m.provider === "Google DeepMind");
  }
  static getOpenRouterModels() {
    return COMPLETE_GOOGLE_MODEL_CATALOG.filter(
      (m) => m.category.startsWith("OpenRouter") || m.provider === "OpenRouter"
    );
  }
  static getTopCodingModels() {
    const topIds = [
      "anthropic/claude-3.7-sonnet",
      "openai/o3-mini",
      "deepseek/deepseek-r1:free",
      "qwen/qwen-2.5-coder-32b-instruct:free",
      "anthropic/claude-3.5-sonnet",
      "gemini-2.5-pro",
      "openai/gpt-4o",
      "gemini-2.0-flash-thinking-exp",
      "mistralai/codestral-2501",
      "meta-llama/llama-3.3-70b-instruct:free"
    ];
    return topIds.map((id) => this.getModelById(id)).filter((m) => m !== void 0);
  }
};

// src/web/app.ts
var TRANSLATIONS = {
  en: {
    appTitle: "EVABOT // CYBER-TERMINAL",
    appSubtitle: "Autonomous Multi-Provider Neural Deck",
    statusOnline: "\u{1F7E2} ONLINE // IDLE",
    statusBusy: "\u{1F7E1} STREAMING // ACTIVE",
    statusError: "\u{1F534} ERROR // OFFLINE",
    controlPanelBtn: "[ \u2193 CONTROL PANEL // SYSTEM DECK ]",
    returnTerminalBtn: "[ \u2191 RETURN TO TERMINAL ]",
    clearChatBtn: "[ CLR ]",
    transmitBtn: "[ TRANSMIT \u21B5 ]",
    stopBtn: "[ STOP \u{1F7E1} ]",
    inputPlaceholder: "Enter cyber command or query prompt (Enter to send, Shift+Enter for newline)...",
    inputLegend: "Enter: Transmit \u2022 Shift+Enter: Linebreak \u2022 EvaBot Core v0.2.0",
    welcomeHeading: "EVABOT NEURAL CYBER-TERMINAL ONLINE",
    welcomeNotice: "Session initialized. Pure black & white minimalist cyber-deck active. Connected to Google Cloud ambient infrastructure with real-time multi-provider routing.",
    secDeckTitle: "EVA CONTROL DECK // CONFIGURATION & TELEMETRY",
    secProviders: "1. NEURAL PROVIDERS",
    secModels: "2. MODEL SELECTION & QUOTAS",
    secModes: "3. OPERATIONAL MODES",
    secRoles: "4. CORPORATE ROLES & PERSONAS",
    secTelemetry: "5. REAL-TIME SYSTEM TELEMETRY",
    secSecurity: "6. SECURITY & CREDENTIALS",
    badgeFree: "\u{1F7E2} FREE QUOTA",
    badgePaid: "\u{1F7E1} PAID / PAYG",
    badgeActive: "\u{1F7E2} ACTIVE",
    badgeReady: "\u{1F7E2} READY",
    badgeStandby: "\u{1F7E1} STANDBY",
    provGoogleName: "Google Cloud (Vertex AI & AI Studio)",
    provGoogleDesc: "Native Google DeepMind Gemini and enterprise partner models with low-latency direct API dispatch.",
    provOmniName: "OmniRoute Neural Gateway",
    provOmniDesc: "Dynamic multi-cloud neural router featuring intelligent load-balancing, failover, and prompt routing.",
    provOpenRouterName: "OpenRouter Mesh",
    provOpenRouterDesc: "Decentralized gateway granting access to global open-weights clusters and specialized reasoning engines.",
    provOpenCodeName: "OpenCode Go Engine",
    provOpenCodeDesc: "High-throughput code inference node designed for private syntax generation, refactoring, and AST analysis.",
    modeSoloName: "SOLO",
    modeSoloDesc: "Direct single LLM execution focused strictly on active corporate persona directives.",
    modeBroadcastName: "BROADCAST",
    modeBroadcastDesc: "Multi-perspective analysis broadcasting your prompt across core architectural dimensions.",
    modeDialogueName: "DIALOGUE",
    modeDialogueDesc: "Rapid-cadence conversational cyber-stream with continuous state retention and feedback.",
    modeConsiliumName: "CONSILIUM",
    modeConsiliumDesc: "Autonomous corporate council deliberation synthesizing executive viewpoints into consensus.",
    roleCeoName: "CEO // Executive Strategist",
    roleCeoDesc: "High-level corporate strategy, market positioning, ROI evaluation, and decisive leadership.",
    roleCtoName: "CTO // Principal Architect",
    roleCtoDesc: "Distributed systems design, enterprise scalability, zero-downtime reliability, and clean code.",
    roleCisoName: "CISO // Cyber Security & Infosec",
    roleCisoDesc: "Threat modeling, zero-trust architecture, cryptographic integrity, and zero-day defense.",
    roleCfoName: "CFO // Financial & Risk Analyst",
    roleCfoDesc: "Fiscal governance, tokenomics optimization, operational expenditure in USD ($) and EUR (\u20AC).",
    roleUxName: "UX/DES // Creative Director",
    roleUxDesc: "Minimalist cyber aesthetics, terminal ergonomics, human-computer interaction, and high usability.",
    roleDevName: "DEV // Lead Full-Stack Engineer",
    roleDevDesc: "Production-ready code implementation, bug elimination, algorithmic efficiency, and test suites.",
    roleRschName: "RSCH // AI Research Scientist",
    roleRschDesc: "Attention mechanisms, context compression, reasoning paradigms, and neurosymbolic agent loops.",
    roleLegalName: "LEGAL // Compliance Counsel",
    roleLegalDesc: "Regulatory adherence (GDPR, EU AI Act), risk mitigation, license conformity, and ethics.",
    telemServerLabel: "Edge Server",
    telemUptimeLabel: "Uptime",
    telemMemoryLabel: "Memory (RSS)",
    telemLatencyLabel: "API Latency",
    telemProviderLabel: "Provider",
    telemModelLabel: "Active Model",
    telemQuotaLabel: "Quota Status",
    telemAuthLabel: "Auth Source",
    telemAccountLabel: "Account",
    apiKeyLabel: "Google Gemini / Vertex API Key",
    apiKeyHelp: "Enter your custom key to override server ambient credentials. Stored securely in browser localStorage.",
    apiKeyPlaceholder: "AIzaSy...",
    saveKeyBtn: "[ SAVE CREDENTIALS ]",
    clearKeyBtn: "[ USE AMBIENT AUTO-AUTH ]",
    keyStatusCustom: "\u{1F7E2} CUSTOM KEY ACTIVE",
    keyStatusAmbient: "\u{1F7E2} GOOGLE AMBIENT AUTH",
    noticeModelSwitched: "Switched model to",
    noticeRoleSwitched: "Activated corporate role",
    noticeModeSwitched: "Changed operation mode to",
    noticeProviderSwitched: "Switched primary neural provider to",
    noticeKeySaved: "Custom API credentials saved to local browser storage.",
    noticeKeyCleared: "Reverted to Google Cloud ambient auto-authentication.",
    noticeChatCleared: "Chat history purged.",
    copiedBtn: "COPIED",
    copyBtn: "COPY"
  },
  uk: {
    appTitle: "EVABOT // \u041A\u0406\u0411\u0415\u0420-\u0422\u0415\u0420\u041C\u0406\u041D\u0410\u041B",
    appSubtitle: "\u0410\u0432\u0442\u043E\u043D\u043E\u043C\u043D\u0438\u0439 \u0431\u0430\u0433\u0430\u0442\u043E\u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440\u043D\u0438\u0439 \u043D\u0435\u0439\u0440\u043E\u0434\u0435\u043A",
    statusOnline: "\u{1F7E2} \u0412 \u041C\u0415\u0420\u0415\u0416\u0406 // \u041E\u0427\u0406\u041A\u0423\u0412\u0410\u041D\u041D\u042F",
    statusBusy: "\u{1F7E1} \u0413\u0415\u041D\u0415\u0420\u0410\u0426\u0406\u042F // \u0410\u041A\u0422\u0418\u0412\u041D\u041E",
    statusError: "\u{1F534} \u041F\u041E\u041C\u0418\u041B\u041A\u0410 // \u041E\u0424\u041B\u0410\u0419\u041D",
    controlPanelBtn: "[ \u2193 \u041F\u0410\u041D\u0415\u041B\u042C \u041A\u0415\u0420\u0423\u0412\u0410\u041D\u041D\u042F // \u0421\u0418\u0421\u0422\u0415\u041C\u041D\u0418\u0419 \u0414\u0415\u041A ]",
    returnTerminalBtn: "[ \u2191 \u041F\u041E\u0412\u0415\u0420\u041D\u0423\u0422\u0418\u0421\u042F \u0414\u041E \u0422\u0415\u0420\u041C\u0406\u041D\u0410\u041B\u0423 ]",
    clearChatBtn: "[ \u041E\u0427\u0418\u0421\u0422\u0418\u0422\u0418 ]",
    transmitBtn: "[ \u0412\u0406\u0414\u041F\u0420\u0410\u0412\u0418\u0422\u0418 \u21B5 ]",
    stopBtn: "[ \u0417\u0423\u041F\u0418\u041D\u0418\u0422\u0418 \u{1F7E1} ]",
    inputPlaceholder: "\u0412\u0432\u0435\u0434\u0456\u0442\u044C \u043A\u0456\u0431\u0435\u0440-\u043A\u043E\u043C\u0430\u043D\u0434\u0443 \u0430\u0431\u043E \u0437\u0430\u043F\u0438\u0442 (Enter \u0434\u043B\u044F \u0432\u0456\u0434\u043F\u0440\u0430\u0432\u043A\u0438, Shift+Enter \u0434\u043B\u044F \u043D\u043E\u0432\u043E\u0433\u043E \u0440\u044F\u0434\u043A\u0430)...",
    inputLegend: "Enter: \u0412\u0456\u0434\u043F\u0440\u0430\u0432\u0438\u0442\u0438 \u2022 Shift+Enter: \u041F\u0435\u0440\u0435\u043D\u043E\u0441 \u0440\u044F\u0434\u043A\u0430 \u2022 \u042F\u0434\u0440\u043E EvaBot v0.2.0",
    welcomeHeading: "\u041D\u0415\u0419\u0420\u041E\u041D\u041D\u0418\u0419 \u041A\u0406\u0411\u0415\u0420-\u0422\u0415\u0420\u041C\u0406\u041D\u0410\u041B EVABOT \u0412 \u041C\u0415\u0420\u0415\u0416\u0406",
    welcomeNotice: "\u0421\u0435\u0441\u0456\u044E \u0456\u043D\u0456\u0446\u0456\u0430\u043B\u0456\u0437\u043E\u0432\u0430\u043D\u043E. \u041C\u0456\u043D\u0456\u043C\u0430\u043B\u0456\u0441\u0442\u0438\u0447\u043D\u0438\u0439 \u0447\u043E\u0440\u043D\u043E-\u0431\u0456\u043B\u0438\u0439 \u043A\u0456\u0431\u0435\u0440-\u0434\u0435\u043A \u0430\u043A\u0442\u0438\u0432\u043E\u0432\u0430\u043D\u043E. \u041F\u0456\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u043E \u0434\u043E \u0445\u043C\u0430\u0440\u043D\u043E\u0457 \u0456\u043D\u0444\u0440\u0430\u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0438 Google Cloud \u0456\u0437 \u0431\u0430\u0433\u0430\u0442\u043E\u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440\u043D\u043E\u044E \u043C\u0430\u0440\u0448\u0440\u0443\u0442\u0438\u0437\u0430\u0446\u0456\u0454\u044E.",
    secDeckTitle: "\u0414\u0415\u041A \u041A\u0415\u0420\u0423\u0412\u0410\u041D\u041D\u042F EVA // \u041A\u041E\u041D\u0424\u0406\u0413\u0423\u0420\u0410\u0426\u0406\u042F \u0422\u0410 \u0422\u0415\u041B\u0415\u041C\u0415\u0422\u0420\u0406\u042F",
    secProviders: "1. \u041D\u0415\u0419\u0420\u041E\u041D\u041D\u0406 \u041F\u0420\u041E\u0412\u0410\u0419\u0414\u0415\u0420\u0418",
    secModels: "2. \u0412\u0418\u0411\u0406\u0420 \u041C\u041E\u0414\u0415\u041B\u0406 \u0422\u0410 \u041A\u0412\u041E\u0422\u0418",
    secModes: "3. \u0420\u0415\u0416\u0418\u041C\u0418 \u0420\u041E\u0411\u041E\u0422\u0418",
    secRoles: "4. \u041A\u041E\u0420\u041F\u041E\u0420\u0410\u0422\u0418\u0412\u041D\u0406 \u0420\u041E\u041B\u0406 \u0422\u0410 \u041F\u0415\u0420\u0421\u041E\u041D\u0418",
    secTelemetry: "5. \u0422\u0415\u041B\u0415\u041C\u0415\u0422\u0420\u0406\u042F \u0412 \u0420\u0415\u0410\u041B\u042C\u041D\u041E\u041C\u0423 \u0427\u0410\u0421\u0406",
    secSecurity: "6. \u0411\u0415\u0417\u041F\u0415\u041A\u0410 \u0422\u0410 \u0410\u0412\u0422\u041E\u0420\u0418\u0417\u0410\u0426\u0406\u042F",
    badgeFree: "\u{1F7E2} \u0411\u0415\u0417\u041A\u041E\u0428\u0422\u041E\u0412\u041D\u041E",
    badgePaid: "\u{1F7E1} \u041F\u041B\u0410\u0422\u041D\u041E / PAYG",
    badgeActive: "\u{1F7E2} \u0410\u041A\u0422\u0418\u0412\u041D\u0418\u0419",
    badgeReady: "\u{1F7E2} \u0413\u041E\u0422\u041E\u0412\u0418\u0419",
    badgeStandby: "\u{1F7E1} \u041E\u0427\u0406\u041A\u0423\u0412\u0410\u041D\u041D\u042F",
    provGoogleName: "Google Cloud (Vertex AI & AI Studio)",
    provGoogleDesc: "\u041E\u0440\u0438\u0433\u0456\u043D\u0430\u043B\u044C\u043D\u0456 \u043C\u043E\u0434\u0435\u043B\u0456 Google DeepMind Gemini \u0442\u0430 \u043F\u0430\u0440\u0442\u043D\u0435\u0440\u0441\u044C\u043A\u0456 \u043A\u043E\u0440\u043F\u043E\u0440\u0430\u0442\u0438\u0432\u043D\u0456 \u043C\u043E\u0434\u0435\u043B\u0456 \u0437 \u043F\u0440\u044F\u043C\u043E\u044E \u0432\u0456\u0434\u043F\u0440\u0430\u0432\u043A\u043E\u044E.",
    provOmniName: "\u041D\u0435\u0439\u0440\u043E\u0448\u043B\u044E\u0437 OmniRoute",
    provOmniDesc: "\u0414\u0438\u043D\u0430\u043C\u0456\u0447\u043D\u0438\u0439 \u0431\u0430\u0433\u0430\u0442\u043E\u0445\u043C\u0430\u0440\u043D\u0438\u0439 \u043C\u0430\u0440\u0448\u0440\u0443\u0442\u0438\u0437\u0430\u0442\u043E\u0440 \u0437 \u0456\u043D\u0442\u0435\u043B\u0435\u043A\u0442\u0443\u0430\u043B\u044C\u043D\u0438\u043C \u0431\u0430\u043B\u0430\u043D\u0441\u0443\u0432\u0430\u043D\u043D\u044F\u043C \u043D\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F \u0442\u0430 \u0432\u0456\u0434\u043C\u043E\u0432\u043E\u0441\u0442\u0456\u0439\u043A\u0456\u0441\u0442\u044E.",
    provOpenRouterName: "\u041C\u0435\u0440\u0435\u0436\u0430 OpenRouter",
    provOpenRouterDesc: "\u0414\u0435\u0446\u0435\u043D\u0442\u0440\u0430\u043B\u0456\u0437\u043E\u0432\u0430\u043D\u0438\u0439 \u0448\u043B\u044E\u0437 \u0434\u043B\u044F \u0434\u043E\u0441\u0442\u0443\u043F\u0443 \u0434\u043E \u0441\u0432\u0456\u0442\u043E\u0432\u0438\u0445 \u043A\u043B\u0430\u0441\u0442\u0435\u0440\u0456\u0432 \u0432\u0456\u0434\u043A\u0440\u0438\u0442\u0438\u0445 \u0432\u0430\u0433 \u0442\u0430 \u0441\u043F\u0435\u0446\u0456\u0430\u043B\u0456\u0437\u043E\u0432\u0430\u043D\u0438\u0445 \u043C\u043E\u0434\u0435\u043B\u0435\u0439.",
    provOpenCodeName: "\u0412\u0443\u0437\u043E\u043B OpenCode Go",
    provOpenCodeDesc: "\u0412\u0438\u0441\u043E\u043A\u043E\u043F\u0440\u043E\u0434\u0443\u043A\u0442\u0438\u0432\u043D\u0438\u0439 \u0440\u0443\u0448\u0456\u0439 \u0433\u0435\u043D\u0435\u0440\u0430\u0446\u0456\u0457 \u043A\u043E\u0434\u0443 \u0434\u043B\u044F \u043F\u0440\u0438\u0432\u0430\u0442\u043D\u043E\u0433\u043E \u0441\u0438\u043D\u0442\u0430\u043A\u0441\u0438\u0447\u043D\u043E\u0433\u043E \u0430\u043D\u0430\u043B\u0456\u0437\u0443, \u0440\u0435\u0444\u0430\u043A\u0442\u043E\u0440\u0438\u043D\u0433\u0443 \u0442\u0430 AST.",
    modeSoloName: "\u0421\u041E\u041B\u041E",
    modeSoloDesc: "\u041F\u0440\u044F\u043C\u0435 \u0432\u0438\u043A\u043E\u043D\u0430\u043D\u043D\u044F \u043E\u0434\u043D\u043E\u0433\u043E LLM \u0456\u0437 \u0441\u0443\u0432\u043E\u0440\u0438\u043C \u0434\u043E\u0442\u0440\u0438\u043C\u0430\u043D\u043D\u044F\u043C \u0432\u0438\u0431\u0440\u0430\u043D\u043E\u0457 \u043A\u043E\u0440\u043F\u043E\u0440\u0430\u0442\u0438\u0432\u043D\u043E\u0457 \u0440\u043E\u043B\u0456.",
    modeBroadcastName: "\u0422\u0420\u0410\u041D\u0421\u041B\u042F\u0426\u0406\u042F",
    modeBroadcastDesc: "\u0411\u0430\u0433\u0430\u0442\u043E\u0432\u0438\u043C\u0456\u0440\u043D\u0438\u0439 \u0430\u043D\u0430\u043B\u0456\u0437 \u0456\u0437 \u043F\u0430\u0440\u0430\u043B\u0435\u043B\u044C\u043D\u0438\u043C \u0442\u0440\u0430\u043D\u0441\u043B\u044E\u0432\u0430\u043D\u043D\u044F\u043C \u0437\u0430\u043F\u0438\u0442\u0443 \u0437\u0430 \u043A\u043B\u044E\u0447\u043E\u0432\u0438\u043C\u0438 \u043D\u0430\u043F\u0440\u044F\u043C\u043A\u0430\u043C\u0438.",
    modeDialogueName: "\u0414\u0406\u0410\u041B\u041E\u0413",
    modeDialogueDesc: "\u0428\u0432\u0438\u0434\u043A\u0438\u0439 \u0434\u0456\u0430\u043B\u043E\u0433\u043E\u0432\u0438\u0439 \u043A\u0456\u0431\u0435\u0440-\u043F\u043E\u0442\u0456\u043A \u0456\u0437 \u043F\u043E\u0441\u0442\u0456\u0439\u043D\u0438\u043C \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043D\u044F\u043C \u043A\u043E\u043D\u0442\u0435\u043A\u0441\u0442\u0443 \u0442\u0430 \u0448\u0432\u0438\u0434\u043A\u0438\u043C \u0437\u0432\u043E\u0440\u043E\u0442\u043D\u0438\u043C \u0437\u0432\u2019\u044F\u0437\u043A\u043E\u043C.",
    modeConsiliumName: "\u041A\u041E\u041D\u0421\u0418\u041B\u0406\u0423\u041C",
    modeConsiliumDesc: "\u0410\u0432\u0442\u043E\u043D\u043E\u043C\u043D\u0435 \u0437\u0430\u0441\u0456\u0434\u0430\u043D\u043D\u044F \u0440\u0430\u0434\u0438 \u0434\u0438\u0440\u0435\u043A\u0442\u043E\u0440\u0456\u0432 \u0456\u0437 \u0441\u0438\u043D\u0442\u0435\u0437\u043E\u043C \u043F\u043E\u0437\u0438\u0446\u0456\u0439 \u043B\u0456\u0434\u0435\u0440\u0456\u0432 \u0443 \u0454\u0434\u0438\u043D\u0438\u0439 \u0443\u0437\u0433\u043E\u0434\u0436\u0435\u043D\u0438\u0439 \u043A\u043E\u043D\u0441\u0435\u043D\u0441\u0443\u0441.",
    roleCeoName: "CEO // \u0421\u0442\u0440\u0430\u0442\u0435\u0433\u0456\u0447\u043D\u0438\u0439 \u043B\u0456\u0434\u0435\u0440",
    roleCeoDesc: "\u041A\u043E\u0440\u043F\u043E\u0440\u0430\u0442\u0438\u0432\u043D\u0430 \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0456\u044F \u0432\u0438\u0441\u043E\u043A\u043E\u0433\u043E \u0440\u0456\u0432\u043D\u044F, \u0440\u0438\u043D\u043A\u043E\u0432\u0435 \u043F\u043E\u0437\u0438\u0446\u0456\u043E\u043D\u0443\u0432\u0430\u043D\u043D\u044F, \u043E\u0446\u0456\u043D\u043A\u0430 ROI \u0442\u0430 \u0440\u0456\u0448\u0443\u0447\u0435 \u043B\u0456\u0434\u0435\u0440\u0441\u0442\u0432\u043E.",
    roleCtoName: "CTO // \u0413\u043E\u043B\u043E\u0432\u043D\u0438\u0439 \u0430\u0440\u0445\u0456\u0442\u0435\u043A\u0442\u043E\u0440",
    roleCtoDesc: "\u041F\u0440\u043E\u0454\u043A\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u0440\u043E\u0437\u043F\u043E\u0434\u0456\u043B\u0435\u043D\u0438\u0445 \u0441\u0438\u0441\u0442\u0435\u043C, \u043A\u043E\u0440\u043F\u043E\u0440\u0430\u0442\u0438\u0432\u043D\u0435 \u043C\u0430\u0441\u0448\u0442\u0430\u0431\u0443\u0432\u0430\u043D\u043D\u044F, \u0432\u0456\u0434\u043C\u043E\u0432\u043E\u0441\u0442\u0456\u0439\u043A\u0456\u0441\u0442\u044C \u0442\u0430 \u0447\u0438\u0441\u0442\u0438\u0439 \u043A\u043E\u0434.",
    roleCisoName: "CISO // \u041A\u0456\u0431\u0435\u0440\u0431\u0435\u0437\u043F\u0435\u043A\u0430 \u0442\u0430 \u0456\u043D\u0444\u043E\u0431\u0435\u0437\u043F\u0435\u043A\u0430",
    roleCisoDesc: "\u041C\u043E\u0434\u0435\u043B\u044E\u0432\u0430\u043D\u043D\u044F \u0437\u0430\u0433\u0440\u043E\u0437, \u0430\u0440\u0445\u0456\u0442\u0435\u043A\u0442\u0443\u0440\u0430 Zero-Trust, \u043A\u0440\u0438\u043F\u0442\u043E\u0433\u0440\u0430\u0444\u0456\u0447\u043D\u0430 \u0446\u0456\u043B\u0456\u0441\u043D\u0456\u0441\u0442\u044C \u0442\u0430 \u0437\u0430\u0445\u0438\u0441\u0442 \u0432\u0456\u0434 zero-day.",
    roleCfoName: "CFO // \u0424\u0456\u043D\u0430\u043D\u0441\u043E\u0432\u0438\u0439 \u0430\u043D\u0430\u043B\u0456\u0442\u0438\u043A",
    roleCfoDesc: "\u0424\u0456\u043D\u0430\u043D\u0441\u043E\u0432\u0438\u0439 \u043A\u043E\u043D\u0442\u0440\u043E\u043B\u044C, \u043E\u043F\u0442\u0438\u043C\u0456\u0437\u0430\u0446\u0456\u044F \u0442\u043E\u043A\u0435\u043D\u043E\u043C\u0456\u043A\u0438, \u0440\u043E\u0437\u0440\u0430\u0445\u0443\u043D\u043E\u043A \u0432\u0438\u0442\u0440\u0430\u0442 \u0441\u0442\u0440\u043E\u0433\u043E \u0432 \u0434\u043E\u043B\u0430\u0440\u0430\u0445 \u0421\u0428\u0410 ($) \u0442\u0430 \u0454\u0432\u0440\u043E (\u20AC).",
    roleUxName: "UX/DES // \u041A\u0440\u0435\u0430\u0442\u0438\u0432\u043D\u0438\u0439 \u0434\u0438\u0440\u0435\u043A\u0442\u043E\u0440",
    roleUxDesc: "\u041C\u0456\u043D\u0456\u043C\u0430\u043B\u0456\u0441\u0442\u0438\u0447\u043D\u0430 \u043A\u0456\u0431\u0435\u0440-\u0435\u0441\u0442\u0435\u0442\u0438\u043A\u0430, \u0435\u0440\u0433\u043E\u043D\u043E\u043C\u0456\u043A\u0430 \u0442\u0435\u0440\u043C\u0456\u043D\u0430\u043B\u0430, \u043B\u044E\u0434\u0438\u043D\u043E-\u043C\u0430\u0448\u0438\u043D\u043D\u0430 \u0432\u0437\u0430\u0454\u043C\u043E\u0434\u0456\u044F \u0442\u0430 \u0432\u0438\u0441\u043E\u043A\u0430 \u0437\u0440\u0443\u0447\u043D\u0456\u0441\u0442\u044C.",
    roleDevName: "DEV // \u041F\u0440\u043E\u0432\u0456\u0434\u043D\u0438\u0439 Full-Stack \u0456\u043D\u0436\u0435\u043D\u0435\u0440",
    roleDevDesc: "\u0412\u043F\u0440\u043E\u0432\u0430\u0434\u0436\u0435\u043D\u043D\u044F \u043F\u0440\u043E\u0434\u0430\u043A\u0448\u043D-\u043A\u043E\u0434\u0443, \u0443\u0441\u0443\u043D\u0435\u043D\u043D\u044F \u0431\u0430\u0433\u0456\u0432, \u0430\u043B\u0433\u043E\u0440\u0438\u0442\u043C\u0456\u0447\u043D\u0430 \u043E\u043F\u0442\u0438\u043C\u0456\u0437\u0430\u0446\u0456\u044F \u0442\u0430 \u043C\u043E\u0434\u0443\u043B\u044C\u043D\u0435 \u0442\u0435\u0441\u0442\u0443\u0432\u0430\u043D\u043D\u044F.",
    roleRschName: "RSCH // \u0414\u043E\u0441\u043B\u0456\u0434\u043D\u0438\u043A \u0448\u0442\u0443\u0447\u043D\u043E\u0433\u043E \u0456\u043D\u0442\u0435\u043B\u0435\u043A\u0442\u0443",
    roleRschDesc: "\u041C\u0435\u0445\u0430\u043D\u0456\u0437\u043C\u0438 \u0443\u0432\u0430\u0433\u0438, \u0441\u0442\u0438\u0441\u043D\u0435\u043D\u043D\u044F \u043A\u043E\u043D\u0442\u0435\u043A\u0441\u0442\u0443, \u043C\u0456\u0440\u043A\u0443\u0432\u0430\u043D\u043D\u044F LLM \u0442\u0430 \u043D\u0435\u0439\u0440\u043E\u0441\u0438\u043C\u0432\u043E\u043B\u0456\u0447\u043D\u0456 \u0430\u0433\u0435\u043D\u0442\u043D\u0456 \u043A\u043E\u043D\u0442\u0443\u0440\u0438.",
    roleLegalName: "LEGAL // \u042E\u0440\u0438\u0441\u0442 \u0437 \u043A\u043E\u043C\u043F\u043B\u0430\u0439\u0454\u043D\u0441\u0443",
    roleLegalDesc: "\u0414\u043E\u0442\u0440\u0438\u043C\u0430\u043D\u043D\u044F \u0440\u0435\u0433\u043B\u0430\u043C\u0435\u043D\u0442\u0456\u0432 (GDPR, EU AI Act), \u043C\u0456\u043D\u0456\u043C\u0456\u0437\u0430\u0446\u0456\u044F \u0440\u0438\u0437\u0438\u043A\u0456\u0432, \u043B\u0456\u0446\u0435\u043D\u0437\u0456\u0457 \u0442\u0430 \u0435\u0442\u0438\u0447\u043D\u0456 \u043D\u043E\u0440\u043C\u0438 \u0428\u0406.",
    telemServerLabel: "\u0412\u0443\u0437\u043E\u043B \u0441\u0435\u0440\u0432\u0435\u0440\u0430",
    telemUptimeLabel: "\u0427\u0430\u0441 \u0440\u043E\u0431\u043E\u0442\u0438",
    telemMemoryLabel: "\u041F\u0430\u043C\u2019\u044F\u0442\u044C (RSS)",
    telemLatencyLabel: "\u0417\u0430\u0442\u0440\u0438\u043C\u043A\u0430 API",
    telemProviderLabel: "\u041F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440",
    telemModelLabel: "\u0410\u043A\u0442\u0438\u0432\u043D\u0430 \u043C\u043E\u0434\u0435\u043B\u044C",
    telemQuotaLabel: "\u0421\u0442\u0430\u0442\u0443\u0441 \u043A\u0432\u043E\u0442\u0438",
    telemAuthLabel: "\u0414\u0436\u0435\u0440\u0435\u043B\u043E \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0456\u0457",
    telemAccountLabel: "\u0410\u043A\u0430\u0443\u043D\u0442",
    apiKeyLabel: "API \u043A\u043B\u044E\u0447 Google Gemini / Vertex",
    apiKeyHelp: "\u0412\u0432\u0435\u0434\u0456\u0442\u044C \u0432\u043B\u0430\u0441\u043D\u0438\u0439 \u043A\u043B\u044E\u0447 \u0434\u043B\u044F \u043F\u0435\u0440\u0435\u0432\u0438\u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F \u0441\u0435\u0440\u0432\u0435\u0440\u043D\u043E\u0457 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0456\u0457. \u0417\u0431\u0435\u0440\u0456\u0433\u0430\u0454\u0442\u044C\u0441\u044F \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u043E \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0456.",
    apiKeyPlaceholder: "AIzaSy...",
    saveKeyBtn: "[ \u0417\u0411\u0415\u0420\u0415\u0413\u0422\u0418 \u041A\u041B\u042E\u0427 ]",
    clearKeyBtn: "[ \u0410\u0412\u0422\u041E-\u0410\u0412\u0422\u041E\u0420\u0418\u0417\u0410\u0426\u0406\u042F GOOGLE ]",
    keyStatusCustom: "\u{1F7E2} \u0412\u041B\u0410\u0421\u041D\u0418\u0419 \u041A\u041B\u042E\u0427 \u0410\u041A\u0422\u0418\u0412\u041D\u0418\u0419",
    keyStatusAmbient: "\u{1F7E2} \u0410\u0412\u0422\u041E-\u0410\u0412\u0422\u041E\u0420\u0418\u0417\u0410\u0426\u0406\u042F GOOGLE",
    noticeModelSwitched: "\u041F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0435\u043D\u043E \u043C\u043E\u0434\u0435\u043B\u044C \u043D\u0430",
    noticeRoleSwitched: "\u0410\u043A\u0442\u0438\u0432\u043E\u0432\u0430\u043D\u043E \u043A\u043E\u0440\u043F\u043E\u0440\u0430\u0442\u0438\u0432\u043D\u0443 \u0440\u043E\u043B\u044C",
    noticeModeSwitched: "\u0417\u043C\u0456\u043D\u0435\u043D\u043E \u0440\u0435\u0436\u0438\u043C \u0440\u043E\u0431\u043E\u0442\u0438 \u043D\u0430",
    noticeProviderSwitched: "\u0417\u043C\u0456\u043D\u0435\u043D\u043E \u043D\u0435\u0439\u0440\u043E\u043D\u043D\u043E\u0433\u043E \u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440\u0430 \u043D\u0430",
    noticeKeySaved: "\u0412\u043B\u0430\u0441\u043D\u0438\u0439 \u043A\u043B\u044E\u0447 API \u0443\u0441\u043F\u0456\u0448\u043D\u043E \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043E \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0456.",
    noticeKeyCleared: "\u041F\u043E\u0432\u0435\u0440\u043D\u0443\u0442\u043E \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u0443 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0456\u044E Google Cloud.",
    noticeChatCleared: "\u0406\u0441\u0442\u043E\u0440\u0456\u044E \u043F\u043E\u0432\u0456\u0434\u043E\u043C\u043B\u0435\u043D\u044C \u043E\u0447\u0438\u0449\u0435\u043D\u043E.",
    copiedBtn: "\u0421\u041A\u041E\u041F\u0406\u0419\u041E\u0412\u0410\u041D\u041E",
    copyBtn: "\u041A\u041E\u041F\u0406\u042E\u0412\u0410\u0422\u0418"
  },
  ru: {
    appTitle: "EVABOT // \u041A\u0418\u0411\u0415\u0420-\u0422\u0415\u0420\u041C\u0418\u041D\u0410\u041B",
    appSubtitle: "\u0410\u0432\u0442\u043E\u043D\u043E\u043C\u043D\u044B\u0439 \u043C\u043D\u043E\u0433\u043E\u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440\u043D\u044B\u0439 \u043D\u0435\u0439\u0440\u043E\u0434\u0435\u043A",
    statusOnline: "\u{1F7E2} \u0412 \u0421\u0415\u0422\u0418 // \u041E\u0416\u0418\u0414\u0410\u041D\u0418\u0415",
    statusBusy: "\u{1F7E1} \u0413\u0415\u041D\u0415\u0420\u0410\u0426\u0418\u042F // \u0410\u041A\u0422\u0418\u0412\u041D\u041E",
    statusError: "\u{1F534} \u041E\u0428\u0418\u0411\u041A\u0410 // \u041E\u0424\u041B\u0410\u0419\u041D",
    controlPanelBtn: "[ \u2193 \u041A\u041E\u041D\u0422\u0420\u041E\u041B\u042C\u041D\u0410\u042F \u041F\u0410\u041D\u0415\u041B\u042C // \u0421\u0418\u0421\u0422\u0415\u041C\u041D\u042B\u0419 \u0414\u0415\u041A ]",
    returnTerminalBtn: "[ \u2191 \u0412\u0415\u0420\u041D\u0423\u0422\u042C\u0421\u042F \u0412 \u0422\u0415\u0420\u041C\u0418\u041D\u0410\u041B ]",
    clearChatBtn: "[ \u041E\u0427\u0418\u0421\u0422\u0418\u0422\u042C ]",
    transmitBtn: "[ \u041E\u0422\u041F\u0420\u0410\u0412\u0418\u0422\u042C \u21B5 ]",
    stopBtn: "[ \u041E\u0421\u0422\u0410\u041D\u041E\u0412\u0418\u0422\u042C \u{1F7E1} ]",
    inputPlaceholder: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043A\u0438\u0431\u0435\u0440-\u043A\u043E\u043C\u0430\u043D\u0434\u0443 \u0438\u043B\u0438 \u0437\u0430\u043F\u0440\u043E\u0441 (Enter \u0434\u043B\u044F \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0438, Shift+Enter \u0434\u043B\u044F \u043D\u043E\u0432\u043E\u0439 \u0441\u0442\u0440\u043E\u043A\u0438)...",
    inputLegend: "Enter: \u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u2022 Shift+Enter: \u041F\u0435\u0440\u0435\u043D\u043E\u0441 \u0441\u0442\u0440\u043E\u043A\u0438 \u2022 \u042F\u0434\u0440\u043E EvaBot v0.2.0",
    welcomeHeading: "\u041D\u0415\u0419\u0420\u041E\u041D\u041D\u042B\u0419 \u041A\u0418\u0411\u0415\u0420-\u0422\u0415\u0420\u041C\u0418\u041D\u0410\u041B EVABOT \u0412 \u0421\u0415\u0422\u0418",
    welcomeNotice: "\u0421\u0435\u0441\u0441\u0438\u044F \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u0430. \u041C\u0438\u043D\u0438\u043C\u0430\u043B\u0438\u0441\u0442\u0438\u0447\u043D\u044B\u0439 \u0447\u0435\u0440\u043D\u043E-\u0431\u0435\u043B\u044B\u0439 \u043A\u0438\u0431\u0435\u0440-\u0434\u0435\u043A \u0430\u043A\u0442\u0438\u0432\u0438\u0440\u043E\u0432\u0430\u043D. \u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u043A \u043E\u0431\u043B\u0430\u0447\u043D\u043E\u0439 \u0438\u043D\u0444\u0440\u0430\u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0435 Google Cloud \u0441 \u043C\u043D\u043E\u0433\u043E\u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440\u043D\u043E\u0439 \u043C\u0430\u0440\u0448\u0440\u0443\u0442\u0438\u0437\u0430\u0446\u0438\u0435\u0439.",
    secDeckTitle: "\u0414\u0415\u041A \u0423\u041F\u0420\u0410\u0412\u041B\u0415\u041D\u0418\u042F EVA // \u041A\u041E\u041D\u0424\u0418\u0413\u0423\u0420\u0410\u0426\u0418\u042F \u0418 \u0422\u0415\u041B\u0415\u041C\u0415\u0422\u0420\u0418\u042F",
    secProviders: "1. \u041D\u0415\u0419\u0420\u041E\u041D\u041D\u042B\u0415 \u041F\u0420\u041E\u0412\u0410\u0419\u0414\u0415\u0420\u042B",
    secModels: "2. \u0412\u042B\u0411\u041E\u0420 \u041C\u041E\u0414\u0415\u041B\u0418 \u0418 \u041A\u0412\u041E\u0422\u042B",
    secModes: "3. \u0420\u0415\u0416\u0418\u041C\u042B \u0420\u0410\u0411\u041E\u0422\u042B",
    secRoles: "4. \u041A\u041E\u0420\u041F\u041E\u0420\u0410\u0422\u0418\u0412\u041D\u042B\u0415 \u0420\u041E\u041B\u0418 \u0418 \u041F\u0415\u0420\u0421\u041E\u041D\u042B",
    secTelemetry: "5. \u0422\u0415\u041B\u0415\u041C\u0415\u0422\u0420\u0418\u042F \u0412 \u0420\u0415\u0410\u041B\u042C\u041D\u041E\u041C \u0412\u0420\u0415\u041C\u0415\u041D\u0418",
    secSecurity: "6. \u0411\u0415\u0417\u041E\u041F\u0410\u0421\u041D\u041E\u0421\u0422\u042C \u0418 \u0410\u0412\u0422\u041E\u0420\u0418\u0417\u0410\u0426\u0418\u042F",
    badgeFree: "\u{1F7E2} \u0411\u0415\u0421\u041F\u041B\u0410\u0422\u041D\u041E",
    badgePaid: "\u{1F7E1} \u041F\u041B\u0410\u0422\u041D\u041E / PAYG",
    badgeActive: "\u{1F7E2} \u0410\u041A\u0422\u0418\u0412\u0415\u041D",
    badgeReady: "\u{1F7E2} \u0413\u041E\u0422\u041E\u0412",
    badgeStandby: "\u{1F7E1} \u041E\u0416\u0418\u0414\u0410\u041D\u0418\u0415",
    provGoogleName: "Google Cloud (Vertex AI & AI Studio)",
    provGoogleDesc: "\u041E\u0440\u0438\u0433\u0438\u043D\u0430\u043B\u044C\u043D\u044B\u0435 \u043C\u043E\u0434\u0435\u043B\u0438 Google DeepMind Gemini \u0438 \u043F\u0430\u0440\u0442\u043D\u0435\u0440\u0441\u043A\u0438\u0435 \u043A\u043E\u0440\u043F\u043E\u0440\u0430\u0442\u0438\u0432\u043D\u044B\u0435 \u043C\u043E\u0434\u0435\u043B\u0438 \u043F\u0440\u044F\u043C\u043E\u0433\u043E \u0432\u044B\u0437\u043E\u0432\u0430.",
    provOmniName: "\u041D\u0435\u0439\u0440\u043E\u0448\u043B\u044E\u0437 OmniRoute",
    provOmniDesc: "\u0414\u0438\u043D\u0430\u043C\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u043C\u0443\u043B\u044C\u0442\u0438\u043E\u0431\u043B\u0430\u0447\u043D\u044B\u0439 \u043C\u0430\u0440\u0448\u0440\u0443\u0442\u0438\u0437\u0430\u0442\u043E\u0440 \u0441 \u0438\u043D\u0442\u0435\u043B\u043B\u0435\u043A\u0442\u0443\u0430\u043B\u044C\u043D\u043E\u0439 \u0431\u0430\u043B\u0430\u043D\u0441\u0438\u0440\u043E\u0432\u043A\u043E\u0439 \u0438 \u043E\u0442\u043A\u0430\u0437\u043E\u0443\u0441\u0442\u043E\u0439\u0447\u0438\u0432\u043E\u0441\u0442\u044C\u044E.",
    provOpenRouterName: "\u0421\u0435\u0442\u044C OpenRouter",
    provOpenRouterDesc: "\u0414\u0435\u0446\u0435\u043D\u0442\u0440\u0430\u043B\u0438\u0437\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u0448\u043B\u044E\u0437 \u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u043A \u0433\u043B\u043E\u0431\u0430\u043B\u044C\u043D\u044B\u043C \u043A\u043B\u0430\u0441\u0442\u0435\u0440\u0430\u043C \u043E\u0442\u043A\u0440\u044B\u0442\u044B\u0445 \u0432\u0435\u0441\u043E\u0432 \u0438 \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u043C \u043C\u043E\u0434\u0435\u043B\u044F\u043C.",
    provOpenCodeName: "\u0423\u0437\u0435\u043B OpenCode Go",
    provOpenCodeDesc: "\u0412\u044B\u0441\u043E\u043A\u043E\u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0434\u0432\u0438\u0436\u043E\u043A \u0433\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u0438 \u043A\u043E\u0434\u0430 \u0434\u043B\u044F \u043F\u0440\u0438\u0432\u0430\u0442\u043D\u043E\u0433\u043E \u0430\u043D\u0430\u043B\u0438\u0437\u0430, \u0440\u0435\u0444\u0430\u043A\u0442\u043E\u0440\u0438\u043D\u0433\u0430 \u0438 AST.",
    modeSoloName: "\u0421\u041E\u041B\u041E",
    modeSoloDesc: "\u041F\u0440\u044F\u043C\u043E\u0435 \u0438\u0441\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0435 \u043E\u0434\u043D\u043E\u0439 LLM \u0441\u043E \u0441\u0442\u0440\u043E\u0433\u043E\u0439 \u0444\u043E\u043A\u0443\u0441\u0438\u0440\u043E\u0432\u043A\u043E\u0439 \u043D\u0430 \u0434\u0438\u0440\u0435\u043A\u0442\u0438\u0432\u0430\u0445 \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0439 \u0440\u043E\u043B\u0438.",
    modeBroadcastName: "\u0422\u0420\u0410\u041D\u0421\u041B\u042F\u0426\u0418\u042F",
    modeBroadcastDesc: "\u041C\u043D\u043E\u0433\u043E\u043C\u0435\u0440\u043D\u044B\u0439 \u0430\u043D\u0430\u043B\u0438\u0437 \u0441 \u043F\u0430\u0440\u0430\u043B\u043B\u0435\u043B\u044C\u043D\u043E\u0439 \u0442\u0440\u0430\u043D\u0441\u043B\u044F\u0446\u0438\u0435\u0439 \u0437\u0430\u043F\u0440\u043E\u0441\u0430 \u043F\u043E \u043A\u043B\u044E\u0447\u0435\u0432\u044B\u043C \u0430\u043D\u0430\u043B\u0438\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u043C \u0441\u0440\u0435\u0437\u0430\u043C.",
    modeDialogueName: "\u0414\u0418\u0410\u041B\u041E\u0413",
    modeDialogueDesc: "\u0411\u044B\u0441\u0442\u0440\u044B\u0439 \u0434\u0438\u0430\u043B\u043E\u0433\u043E\u0432\u044B\u0439 \u043A\u0438\u0431\u0435\u0440-\u043F\u043E\u0442\u043E\u043A \u0441 \u043D\u0435\u043F\u0440\u0435\u0440\u044B\u0432\u043D\u044B\u043C \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435\u043C \u043A\u043E\u043D\u0442\u0435\u043A\u0441\u0442\u0430 \u0438 \u043E\u043F\u0435\u0440\u0430\u0442\u0438\u0432\u043D\u044B\u043C \u043E\u0442\u043A\u043B\u0438\u043A\u043E\u043C.",
    modeConsiliumName: "\u041A\u041E\u041D\u0421\u0418\u041B\u0418\u0423\u041C",
    modeConsiliumDesc: "\u0410\u0432\u0442\u043E\u043D\u043E\u043C\u043D\u043E\u0435 \u0441\u043E\u0432\u0435\u0449\u0430\u043D\u0438\u0435 \u0441\u043E\u0432\u0435\u0442\u0430 \u0434\u0438\u0440\u0435\u043A\u0442\u043E\u0440\u043E\u0432 \u0441 \u0441\u0438\u043D\u0442\u0435\u0437\u043E\u043C \u043C\u043D\u0435\u043D\u0438\u0439 \u044D\u043A\u0441\u043F\u0435\u0440\u0442\u043E\u0432 \u0432 \u0435\u0434\u0438\u043D\u044B\u0439 \u043A\u043E\u043D\u0441\u0435\u043D\u0441\u0443\u0441.",
    roleCeoName: "CEO // \u0421\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u043B\u0438\u0434\u0435\u0440",
    roleCeoDesc: "\u041A\u043E\u0440\u043F\u043E\u0440\u0430\u0442\u0438\u0432\u043D\u0430\u044F \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u044F \u0432\u044B\u0441\u043E\u043A\u043E\u0433\u043E \u0443\u0440\u043E\u0432\u043D\u044F, \u0440\u044B\u043D\u043E\u0447\u043D\u043E\u0435 \u043F\u043E\u0437\u0438\u0446\u0438\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435, \u0440\u0430\u0441\u0447\u0435\u0442 ROI \u0438 \u043B\u0438\u0434\u0435\u0440\u0441\u0442\u0432\u043E.",
    roleCtoName: "CTO // \u0413\u043B\u0430\u0432\u043D\u044B\u0439 \u0430\u0440\u0445\u0438\u0442\u0435\u043A\u0442\u043E\u0440",
    roleCtoDesc: "\u041F\u0440\u043E\u0435\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0440\u0430\u0441\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u043D\u044B\u0445 \u0441\u0438\u0441\u0442\u0435\u043C, \u043C\u0430\u0441\u0448\u0442\u0430\u0431\u0438\u0440\u0443\u0435\u043C\u043E\u0441\u0442\u044C, \u043E\u0442\u043A\u0430\u0437\u043E\u0443\u0441\u0442\u043E\u0439\u0447\u0438\u0432\u043E\u0441\u0442\u044C \u0438 \u0447\u0438\u0441\u0442\u044B\u0439 \u043A\u043E\u0434.",
    roleCisoName: "CISO // \u041A\u0438\u0431\u0435\u0440\u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u044C \u0438 \u0438\u043D\u0444\u043E\u0431\u0435\u0437",
    roleCisoDesc: "\u041C\u043E\u0434\u0435\u043B\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0443\u0433\u0440\u043E\u0437, \u0430\u0440\u0445\u0438\u0442\u0435\u043A\u0442\u0443\u0440\u0430 Zero-Trust, \u043A\u0440\u0438\u043F\u0442\u043E\u0433\u0440\u0430\u0444\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0446\u0435\u043B\u043E\u0441\u0442\u043D\u043E\u0441\u0442\u044C \u0438 \u043E\u0442\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0430\u0442\u0430\u043A.",
    roleCfoName: "CFO // \u0424\u0438\u043D\u0430\u043D\u0441\u043E\u0432\u044B\u0439 \u0430\u043D\u0430\u043B\u0438\u0442\u0438\u043A",
    roleCfoDesc: "\u0424\u0438\u043D\u0430\u043D\u0441\u043E\u0432\u044B\u0439 \u0430\u0443\u0434\u0438\u0442, \u043E\u043F\u0442\u0438\u043C\u0438\u0437\u0430\u0446\u0438\u044F \u0442\u043E\u043A\u0435\u043D\u043E\u043C\u0438\u043A\u0438, \u0443\u0447\u0435\u0442 \u0437\u0430\u0442\u0440\u0430\u0442 \u0441\u0442\u0440\u043E\u0433\u043E \u0432 \u0434\u043E\u043B\u043B\u0430\u0440\u0430\u0445 \u0421\u0428\u0410 ($) \u0438 \u0435\u0432\u0440\u043E (\u20AC).",
    roleUxName: "UX/DES // \u041A\u0440\u0435\u0430\u0442\u0438\u0432\u043D\u044B\u0439 \u0434\u0438\u0440\u0435\u043A\u0442\u043E\u0440",
    roleUxDesc: "\u041C\u0438\u043D\u0438\u043C\u0430\u043B\u0438\u0441\u0442\u0438\u0447\u043D\u0430\u044F \u043A\u0438\u0431\u0435\u0440-\u044D\u0441\u0442\u0435\u0442\u0438\u043A\u0430, \u044D\u0440\u0433\u043E\u043D\u043E\u043C\u0438\u043A\u0430 \u0442\u0435\u0440\u043C\u0438\u043D\u0430\u043B\u0430, \u0432\u0437\u0430\u0438\u043C\u043E\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u0441 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u043C \u0438 \u0434\u0438\u0437\u0430\u0439\u043D.",
    roleDevName: "DEV // \u0412\u0435\u0434\u0443\u0449\u0438\u0439 Full-Stack \u0438\u043D\u0436\u0435\u043D\u0435\u0440",
    roleDevDesc: "\u0420\u0435\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F \u043F\u0440\u043E\u0434\u0430\u043A\u0448\u043D-\u043A\u043E\u0434\u0430, \u0443\u0441\u0442\u0440\u0430\u043D\u0435\u043D\u0438\u0435 \u043E\u0448\u0438\u0431\u043E\u043A, \u0430\u043B\u0433\u043E\u0440\u0438\u0442\u043C\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u043E\u043F\u0442\u0438\u043C\u0438\u0437\u0430\u0446\u0438\u044F \u0438 \u043C\u043E\u0434\u0443\u043B\u044C\u043D\u044B\u0435 \u0442\u0435\u0441\u0442\u044B.",
    roleRschName: "RSCH // \u0418\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0418\u0418",
    roleRschDesc: "\u041C\u0435\u0445\u0430\u043D\u0438\u0437\u043C\u044B \u0432\u043D\u0438\u043C\u0430\u043D\u0438\u044F, \u043A\u043E\u043C\u043F\u0440\u0435\u0441\u0441\u0438\u044F \u043A\u043E\u043D\u0442\u0435\u043A\u0441\u0442\u0430, \u0430\u0440\u0445\u0438\u0442\u0435\u043A\u0442\u0443\u0440\u0430 \u0440\u0430\u0441\u0441\u0443\u0436\u0434\u0435\u043D\u0438\u0439 \u0438 \u043D\u0435\u0439\u0440\u043E\u0441\u0438\u043C\u0432\u043E\u043B\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u0430\u0433\u0435\u043D\u0442\u044B.",
    roleLegalName: "LEGAL // \u041A\u043E\u0440\u043F\u043E\u0440\u0430\u0442\u0438\u0432\u043D\u044B\u0439 \u044E\u0440\u0438\u0441\u0442",
    roleLegalDesc: "\u0421\u043E\u0431\u043B\u044E\u0434\u0435\u043D\u0438\u0435 \u0440\u0435\u0433\u043B\u0430\u043C\u0435\u043D\u0442\u043E\u0432 (GDPR, EU AI Act), \u0441\u043D\u0438\u0436\u0435\u043D\u0438\u0435 \u0440\u0438\u0441\u043A\u043E\u0432, \u043B\u0438\u0446\u0435\u043D\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0438 \u044D\u0442\u0438\u043A\u0430 \u0418\u0418.",
    telemServerLabel: "\u0423\u0437\u0435\u043B \u0441\u0435\u0440\u0432\u0435\u0440\u0430",
    telemUptimeLabel: "\u0412\u0440\u0435\u043C\u044F \u0440\u0430\u0431\u043E\u0442\u044B",
    telemMemoryLabel: "\u041F\u0430\u043C\u044F\u0442\u044C (RSS)",
    telemLatencyLabel: "\u0417\u0430\u0434\u0435\u0440\u0436\u043A\u0430 API",
    telemProviderLabel: "\u041F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440",
    telemModelLabel: "\u0410\u043A\u0442\u0438\u0432\u043D\u0430\u044F \u043C\u043E\u0434\u0435\u043B\u044C",
    telemQuotaLabel: "\u0421\u0442\u0430\u0442\u0443\u0441 \u043A\u0432\u043E\u0442\u044B",
    telemAuthLabel: "\u0418\u0441\u0442\u043E\u0447\u043D\u0438\u043A \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u0438",
    telemAccountLabel: "\u0410\u043A\u043A\u0430\u0443\u043D\u0442",
    apiKeyLabel: "API \u043A\u043B\u044E\u0447 Google Gemini / Vertex",
    apiKeyHelp: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439 \u043A\u043B\u044E\u0447 \u0434\u043B\u044F \u043F\u0435\u0440\u0435\u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u0438\u044F \u0441\u0435\u0440\u0432\u0435\u0440\u043D\u043E\u0439 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u0438. \u0421\u043E\u0445\u0440\u0430\u043D\u044F\u0435\u0442\u0441\u044F \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435.",
    apiKeyPlaceholder: "AIzaSy...",
    saveKeyBtn: "[ \u0421\u041E\u0425\u0420\u0410\u041D\u0418\u0422\u042C \u041A\u041B\u042E\u0427 ]",
    clearKeyBtn: "[ \u0410\u0412\u0422\u041E-\u0410\u0412\u0422\u041E\u0420\u0418\u0417\u0410\u0426\u0418\u042F GOOGLE ]",
    keyStatusCustom: "\u{1F7E2} \u0421\u041E\u0411\u0421\u0422\u0412\u0415\u041D\u041D\u042B\u0419 \u041A\u041B\u042E\u0427 \u0410\u041A\u0422\u0418\u0412\u0415\u041D",
    keyStatusAmbient: "\u{1F7E2} \u0410\u0412\u0422\u041E-\u0410\u0412\u0422\u041E\u0420\u0418\u0417\u0410\u0426\u0418\u042F GOOGLE",
    noticeModelSwitched: "\u041C\u043E\u0434\u0435\u043B\u044C \u043F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0435\u043D\u0430 \u043D\u0430",
    noticeRoleSwitched: "\u0410\u043A\u0442\u0438\u0432\u0438\u0440\u043E\u0432\u0430\u043D\u0430 \u043A\u043E\u0440\u043F\u043E\u0440\u0430\u0442\u0438\u0432\u043D\u0430\u044F \u0440\u043E\u043B\u044C",
    noticeModeSwitched: "\u0420\u0435\u0436\u0438\u043C \u0440\u0430\u0431\u043E\u0442\u044B \u0438\u0437\u043C\u0435\u043D\u0435\u043D \u043D\u0430",
    noticeProviderSwitched: "\u041D\u0435\u0439\u0440\u043E\u043D\u043D\u044B\u0439 \u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440 \u0438\u0437\u043C\u0435\u043D\u0435\u043D \u043D\u0430",
    noticeKeySaved: "\u041A\u043B\u044E\u0447 API \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D \u0432 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u043E\u043C \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0430.",
    noticeKeyCleared: "\u0412\u043E\u0437\u0432\u0440\u0430\u0449\u0435\u043D\u0430 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u044F Google Cloud.",
    noticeChatCleared: "\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0439 \u043E\u0447\u0438\u0449\u0435\u043D\u0430.",
    copiedBtn: "\u0421\u041A\u041E\u041F\u0418\u0420\u041E\u0412\u0410\u041D\u041E",
    copyBtn: "\u041A\u041E\u041F\u0418\u0420\u041E\u0412\u0410\u0422\u042C"
  }
};
var EvaBotWebApp = class {
  messages = [];
  currentLang = "en";
  currentProvider = "google";
  currentModel = "gemini-2.5-flash";
  currentMode = "solo";
  currentRole = "ceo";
  isGenerating = false;
  abortController = null;
  serverHasApiKey = false;
  authSource = "Google Cloud Ambient";
  userAccount = "evabot.online@gmail.com";
  serverUptimeSec = 0;
  serverMemoryMb = 0;
  lastLatencyMs = 0;
  uptimeInterval = null;
  constructor() {
    this.init();
  }
  async init() {
    const savedLang = localStorage.getItem("evabot_lang");
    if (savedLang && (savedLang === "en" || savedLang === "uk" || savedLang === "ru")) {
      this.currentLang = savedLang;
    }
    this.setupEventListeners();
    await this.checkHealth();
    this.populateModelSelector();
    this.applyLanguage();
    this.updateProviderUI();
    this.updateModeUI();
    this.updateRoleUI();
    this.updateModelDetailsUI();
    this.updateKeyStatusUI();
    this.renderWelcomeMessage();
    this.startTelemetryLoop();
  }
  t() {
    return TRANSLATIONS[this.currentLang];
  }
  setLanguage(lang) {
    if (lang === this.currentLang) return;
    this.currentLang = lang;
    localStorage.setItem("evabot_lang", lang);
    this.applyLanguage();
    this.updateModelDetailsUI();
    this.updateKeyStatusUI();
    this.updateTelemetryUI();
    if (this.messages.length <= 1) {
      this.messages = [];
      const container = document.getElementById("messages-container");
      if (container) container.innerHTML = "";
      this.renderWelcomeMessage();
    }
  }
  applyLanguage() {
    const t = this.t();
    ["en", "uk", "ru"].forEach((l) => {
      const btn = document.getElementById(`lang-btn-${l}`);
      if (btn) {
        if (l === this.currentLang) {
          btn.className = "px-2 py-0.5 text-xs font-bold bg-white text-black border border-white";
        } else {
          btn.className = "px-2 py-0.5 text-xs font-bold bg-black text-zinc-400 hover:text-white border border-transparent";
        }
      }
    });
    document.title = `${t.appTitle} // ${this.currentModel}`;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key && t[key]) {
        el.textContent = t[key];
      }
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (key && t[key]) {
        el.placeholder = t[key];
      }
    });
    const ctrlBtn = document.getElementById("control-panel-btn-label");
    if (ctrlBtn) ctrlBtn.textContent = t.controlPanelBtn;
    const retBtn = document.getElementById("return-terminal-btn-label");
    if (retBtn) retBtn.textContent = t.returnTerminalBtn;
    const clrBtn = document.getElementById("clear-btn");
    if (clrBtn) clrBtn.textContent = t.clearChatBtn;
    this.updateSendButtonState(this.isGenerating);
  }
  setupEventListeners() {
    document.getElementById("lang-btn-en")?.addEventListener("click", () => this.setLanguage("en"));
    document.getElementById("lang-btn-uk")?.addEventListener("click", () => this.setLanguage("uk"));
    document.getElementById("lang-btn-ru")?.addEventListener("click", () => this.setLanguage("ru"));
    const toDeckBtn = document.getElementById("scroll-to-deck-btn");
    const toTerminalBtn = document.getElementById("scroll-to-terminal-btn");
    const deckSection = document.getElementById("screen-control-deck");
    const terminalSection = document.getElementById("screen-terminal");
    toDeckBtn?.addEventListener("click", () => {
      deckSection?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    toTerminalBtn?.addEventListener("click", () => {
      terminalSection?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    const form = document.getElementById("chat-form");
    const input = document.getElementById("user-input");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSend();
    });
    input?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.handleSend();
      }
    });
    document.getElementById("clear-btn")?.addEventListener("click", () => {
      this.messages = [];
      const container = document.getElementById("messages-container");
      if (container) container.innerHTML = "";
      this.renderWelcomeMessage();
      this.addSystemNotification(this.t().noticeChatCleared);
    });
    const modelSelect = document.getElementById("deck-model-select");
    modelSelect?.addEventListener("change", (e) => {
      this.currentModel = e.target.value;
      this.updateModelDetailsUI();
      const m = ModelRegistry.getModelById(this.currentModel);
      this.addSystemNotification(`${this.t().noticeModelSwitched} **${m?.name || this.currentModel}**`);
    });
    document.querySelectorAll("[data-provider]").forEach((el) => {
      el.addEventListener("click", () => {
        const prov = el.getAttribute("data-provider");
        if (prov) {
          this.currentProvider = prov;
          this.updateProviderUI();
          this.addSystemNotification(`${this.t().noticeProviderSwitched} **${prov.toUpperCase()}**`);
        }
      });
    });
    document.querySelectorAll("[data-mode]").forEach((el) => {
      el.addEventListener("click", () => {
        const mode = el.getAttribute("data-mode");
        if (mode) {
          this.currentMode = mode;
          this.updateModeUI();
          this.addSystemNotification(`${this.t().noticeModeSwitched} **${mode.toUpperCase()}**`);
        }
      });
    });
    document.querySelectorAll("[data-role]").forEach((el) => {
      el.addEventListener("click", () => {
        const role = el.getAttribute("data-role");
        if (role) {
          this.currentRole = role;
          this.updateRoleUI();
          this.addSystemNotification(`${this.t().noticeRoleSwitched} **${role.toUpperCase()}**`);
        }
      });
    });
    const saveKeyBtn = document.getElementById("deck-save-key-btn");
    const clearKeyBtn = document.getElementById("deck-clear-key-btn");
    const apiKeyInput = document.getElementById("deck-api-key-input");
    saveKeyBtn?.addEventListener("click", () => {
      const val = apiKeyInput?.value.trim() || "";
      if (val) {
        localStorage.setItem("evabot_gemini_key", val);
        this.addSystemNotification(this.t().noticeKeySaved);
      }
      this.updateKeyStatusUI();
    });
    clearKeyBtn?.addEventListener("click", () => {
      localStorage.removeItem("evabot_gemini_key");
      if (apiKeyInput) apiKeyInput.value = "";
      this.addSystemNotification(this.t().noticeKeyCleared);
      this.updateKeyStatusUI();
    });
    document.getElementById("header-model-pill")?.addEventListener("click", () => {
      deckSection?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    const bootAccordion = document.getElementById("accordion-boot");
    const bootLabel = document.getElementById("boot-toggle-label");
    bootAccordion?.addEventListener("toggle", () => {
      if (bootLabel) {
        bootLabel.textContent = bootAccordion.open ? "[ - COLLAPSE ]" : "[ + EXPAND ]";
      }
    });
  }
  async checkHealth() {
    const t0 = performance.now();
    try {
      const res = await fetch("/api/health");
      this.lastLatencyMs = Math.round(performance.now() - t0);
      if (res.ok) {
        const data = await res.json();
        this.serverHasApiKey = Boolean(data.hasServerApiKey);
        if (data.authSource) this.authSource = data.authSource;
        if (data.account) this.userAccount = data.account;
        if (data.uptimeSeconds) this.serverUptimeSec = data.uptimeSeconds;
        if (data.memoryUsageMb) this.serverMemoryMb = data.memoryUsageMb;
      }
    } catch {
      this.serverHasApiKey = false;
      this.lastLatencyMs = 999;
    }
    this.updateTelemetryUI();
    this.fetchBootDiagnostics();
  }
  async fetchBootDiagnostics() {
    try {
      const res = await fetch(`/api/diagnostics/boot?model=${encodeURIComponent(this.currentModel)}`);
      if (res.ok) {
        const report = await res.json();
        const container = document.getElementById("boot-log-container");
        if (container && report.steps) {
          container.innerHTML = `
            <div class="text-zinc-500 font-bold mb-1">Live dual-server diagnostic probe completed in ${report.totalDurationMs}ms:</div>
            ${report.steps.map((step) => `
              <div class="flex items-start gap-2 text-zinc-300 py-0.5">
                <span class="text-emerald-400 font-bold">\u2714 \u{1F7E2}</span>
                <div class="flex-1">
                  <div class="flex justify-between items-center">
                    <span class="text-white font-bold">${step.name}</span>
                    <span class="text-zinc-500 text-[10px] font-mono">${step.latencyMs}ms</span>
                  </div>
                  <div class="text-zinc-400 text-[11px]">${step.details}</div>
                </div>
              </div>
            `).join("")}
          `;
        }
      }
    } catch (e) {
      console.warn("Boot diagnostics fetch skipped:", e);
    }
  }
  startTelemetryLoop() {
    if (this.uptimeInterval) clearInterval(this.uptimeInterval);
    this.uptimeInterval = setInterval(() => {
      this.serverUptimeSec += 1;
      this.updateTelemetryUI();
    }, 1e3);
    setInterval(() => {
      this.checkHealth();
    }, 15e3);
  }
  updateTelemetryUI() {
    const t = this.t();
    const serverEl = document.getElementById("telem-server");
    if (serverEl) serverEl.textContent = "evabot-online-edge";
    const uptimeEl = document.getElementById("telem-uptime");
    if (uptimeEl) {
      const hrs = Math.floor(this.serverUptimeSec / 3600);
      const mins = Math.floor(this.serverUptimeSec % 3600 / 60);
      const secs = this.serverUptimeSec % 60;
      uptimeEl.textContent = `${hrs}h ${mins}m ${secs}s`;
    }
    const memEl = document.getElementById("telem-memory");
    if (memEl) memEl.textContent = `${this.serverMemoryMb} MB`;
    const latEl = document.getElementById("telem-latency");
    if (latEl) latEl.textContent = `${this.lastLatencyMs} ms`;
    const provEl = document.getElementById("telem-provider");
    if (provEl) provEl.textContent = this.currentProvider.toUpperCase();
    const modelEl = document.getElementById("telem-model");
    if (modelEl) modelEl.textContent = this.currentModel;
    const roleEl = document.getElementById("telem-role");
    if (roleEl) roleEl.textContent = this.currentRole.toUpperCase();
    const modeEl = document.getElementById("telem-mode");
    if (modeEl) modeEl.textContent = this.currentMode.toUpperCase();
    const m = ModelRegistry.getModelById(this.currentModel);
    const isFree = m?.pricing.freeTierStatus === "100% Free Quota Available";
    const quotaEl = document.getElementById("telem-quota");
    if (quotaEl) {
      quotaEl.textContent = isFree ? t.badgeFree : t.badgePaid;
      quotaEl.className = isFree ? "text-emerald-400 font-bold" : "text-amber-400 font-bold";
    }
    const authEl = document.getElementById("telem-auth");
    if (authEl) {
      const customKey = localStorage.getItem("evabot_gemini_key");
      authEl.textContent = customKey ? "Custom API Key" : this.authSource;
    }
    const accEl = document.getElementById("telem-account");
    if (accEl) accEl.textContent = this.userAccount;
  }
  populateModelSelector() {
    const select = document.getElementById("deck-model-select");
    if (!select) return;
    select.innerHTML = "";
    const categories = [
      "Google Gemini (Next-Gen)",
      "Google Gemini (Long-Context)",
      "Google Gemma (Open Weights)",
      "Anthropic Claude on Google Cloud",
      "Meta Llama 3 on Google Cloud",
      "Mistral AI on Google Cloud",
      "DeepSeek on Google Cloud",
      "AI21 Labs & Cohere on Google Cloud"
    ];
    for (const cat of categories) {
      const models = ModelRegistry.getModelsByCategory(cat);
      if (!models || models.length === 0) continue;
      const group = document.createElement("optgroup");
      group.label = cat;
      for (const m of models) {
        const opt = document.createElement("option");
        opt.value = m.id;
        const isFree = m.pricing.freeTierStatus.includes("Free");
        const badge = isFree ? " [\u{1F7E2} FREE]" : " [\u{1F7E1} PAID]";
        opt.textContent = `${m.name}${badge}`;
        if (m.id === this.currentModel) opt.selected = true;
        group.appendChild(opt);
      }
      select.appendChild(group);
    }
  }
  updateProviderUI() {
    document.querySelectorAll("[data-provider]").forEach((el) => {
      const prov = el.getAttribute("data-provider");
      const isSelected = prov === this.currentProvider;
      if (isSelected) {
        el.classList.add("border-white", "bg-zinc-900", "text-white");
        el.classList.remove("border-zinc-800", "bg-black", "text-zinc-400");
      } else {
        el.classList.remove("border-white", "bg-zinc-900", "text-white");
        el.classList.add("border-zinc-800", "bg-black", "text-zinc-400");
      }
    });
    this.updateTelemetryUI();
  }
  updateModeUI() {
    document.querySelectorAll("[data-mode]").forEach((el) => {
      const mode = el.getAttribute("data-mode");
      const isSelected = mode === this.currentMode;
      if (isSelected) {
        el.classList.add("border-white", "bg-zinc-900", "text-white");
        el.classList.remove("border-zinc-800", "bg-black", "text-zinc-400");
      } else {
        el.classList.remove("border-white", "bg-zinc-900", "text-white");
        el.classList.add("border-zinc-800", "bg-black", "text-zinc-400");
      }
    });
    const headerMode = document.getElementById("header-mode-badge");
    if (headerMode) headerMode.textContent = `MODE: ${this.currentMode.toUpperCase()}`;
    this.updateTelemetryUI();
  }
  updateRoleUI() {
    document.querySelectorAll("[data-role]").forEach((el) => {
      const role = el.getAttribute("data-role");
      const isSelected = role === this.currentRole;
      if (isSelected) {
        el.classList.add("border-white", "bg-zinc-900", "text-white");
        el.classList.remove("border-zinc-800", "bg-black", "text-zinc-400");
      } else {
        el.classList.remove("border-white", "bg-zinc-900", "text-white");
        el.classList.add("border-zinc-800", "bg-black", "text-zinc-400");
      }
    });
    const headerRole = document.getElementById("header-role-badge");
    if (headerRole) headerRole.textContent = `ROLE: ${this.currentRole.toUpperCase()}`;
    this.updateTelemetryUI();
  }
  updateModelDetailsUI() {
    const m = ModelRegistry.getModelById(this.currentModel);
    if (!m) return;
    const t = this.t();
    const isFree = m.pricing.freeTierStatus === "100% Free Quota Available";
    const headerName = document.getElementById("header-model-name");
    if (headerName) headerName.textContent = m.name;
    const headerBadge = document.getElementById("header-model-badge");
    if (headerBadge) {
      headerBadge.textContent = isFree ? "\u{1F7E2} FREE" : "\u{1F7E1} PAID";
      headerBadge.className = isFree ? "px-1.5 py-0.2 bg-emerald-950 text-emerald-400 border border-emerald-700 text-[10px] font-bold" : "px-1.5 py-0.2 bg-amber-950 text-amber-400 border border-amber-700 text-[10px] font-bold";
    }
    const specName = document.getElementById("model-spec-name");
    if (specName) specName.textContent = m.name;
    const specProv = document.getElementById("model-spec-provider");
    if (specProv) specProv.textContent = m.provider;
    const specBadge = document.getElementById("model-spec-badge");
    if (specBadge) {
      specBadge.textContent = isFree ? t.badgeFree : t.badgePaid;
      specBadge.className = isFree ? "px-2 py-0.5 border border-emerald-600 text-emerald-400 font-bold text-xs" : "px-2 py-0.5 border border-amber-600 text-amber-400 font-bold text-xs";
    }
    const specContext = document.getElementById("model-spec-context");
    if (specContext) specContext.textContent = `${m.contextWindow.toLocaleString()} tokens`;
    const specMaxOut = document.getElementById("model-spec-maxout");
    if (specMaxOut) specMaxOut.textContent = `${m.maxOutputTokens.toLocaleString()} tokens`;
    const specUsd = document.getElementById("model-spec-usd");
    if (specUsd) specUsd.textContent = `In: ${m.pricing.inputPer1MTokensUSD} | Out: ${m.pricing.outputPer1MTokensUSD}`;
    const specEur = document.getElementById("model-spec-eur");
    if (specEur) specEur.textContent = `In: ${m.pricing.inputPer1MTokensEUR} | Out: ${m.pricing.outputPer1MTokensEUR}`;
    const specQuota = document.getElementById("model-spec-quota");
    if (specQuota) specQuota.textContent = m.pricing.freeTierDetails;
    const specCoding = document.getElementById("model-spec-coding");
    if (specCoding) specCoding.textContent = m.codingStrengths;
    this.updateTelemetryUI();
  }
  updateKeyStatusUI() {
    const t = this.t();
    const statusEl = document.getElementById("deck-key-status");
    const input = document.getElementById("deck-api-key-input");
    const customKey = localStorage.getItem("evabot_gemini_key") || "";
    if (input && !input.value) {
      input.value = customKey;
    }
    if (statusEl) {
      if (customKey) {
        statusEl.textContent = t.keyStatusCustom;
        statusEl.className = "text-xs font-bold text-emerald-400 border border-emerald-800 bg-emerald-950/40 px-2.5 py-1";
      } else {
        statusEl.textContent = `${t.keyStatusAmbient} (${this.userAccount})`;
        statusEl.className = "text-xs font-bold text-emerald-400 border border-emerald-800 bg-emerald-950/40 px-2.5 py-1";
      }
    }
  }
  renderWelcomeMessage() {
    const t = this.t();
    const m = ModelRegistry.getModelById(this.currentModel);
    const welcome = `+==============================================================================+
| ${t.welcomeHeading}
+==============================================================================+
${t.welcomeNotice}

\u2022 PROVIDER: [${this.currentProvider.toUpperCase()}] // Google Cloud Vertex & AI Studio
\u2022 ACTIVE MODEL: ${m?.name || this.currentModel} [${m?.pricing.freeTierStatus}]
\u2022 OPERATIONAL MODE: [${this.currentMode.toUpperCase()}]
\u2022 CORPORATE PERSONA: [${this.currentRole.toUpperCase()}]
\u2022 CURRENCY ACCOUNTING: Strictly USD ($) and EUR (\u20AC) Compliance

Execute commands or submit analytical inquiries below. Click '[ \u2193 CONTROL PANEL ]' to toggle neural deck parameters.`;
    this.appendMessage({
      role: "model",
      text: welcome,
      timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
      metadata: {
        model: this.currentModel,
        mode: this.currentMode,
        role: this.currentRole,
        provider: this.currentProvider
      }
    });
  }
  buildSystemInstruction() {
    const rolePrompts = {
      ceo: "Act as EvaBot Executive Strategist & CEO. Deliver decisive, high-level corporate insight, focus on strategic objectives, market leadership, and return on investment.",
      cto: "Act as EvaBot Principal System Architect & CTO. Focus strictly on distributed systems design, zero-downtime scalability, fault tolerance, robust engineering, and clean code.",
      ciso: "Act as EvaBot Cyber Security Specialist & CISO. Scrutinize zero-trust architecture, threat modeling, cryptographic integrity, attack surface minimization, and zero-day resilience.",
      cfo: "Act as EvaBot Financial & Risk Analyst & CFO. Provide rigorous financial and tokenomics evaluations. All calculations and budget estimates must be strictly in USD ($) and EUR (\u20AC). Calculations must be exclusively in USD ($) or EUR (\u20AC).",
      ux: "Act as EvaBot Creative Director & UX Designer. Focus on minimalist cyber aesthetics, high-contrast monochrome terminal ergonomics, clarity, and frictionless human-agent interaction.",
      dev: "Act as EvaBot Lead Full-Stack Software Engineer. Provide complete, production-grade, bug-free implementations with clear type safety, algorithmic precision, and tests.",
      rsch: "Act as EvaBot AI Research Scientist. Analyze attention topologies, context retention, chain-of-thought paradigms, and neurosymbolic reasoning loops.",
      legal: "Act as EvaBot Compliance Counsel & Legal Officer. Scrutinize regulatory alignment (GDPR, EU AI Act), data sovereignty, intellectual property, and ethical AI standards."
    };
    const modePrompts = {
      solo: "Mode: SOLO. Focus with maximum precision on the assigned corporate role mandate.",
      broadcast: "Mode: BROADCAST. Deliver a comprehensive multi-dimensional breakdown analyzing technical feasibility, financial impact (USD/EUR only), security risks, and operational execution.",
      dialogue: "Mode: DIALOGUE. Maintain high-cadence, crisp, responsive interactive cyber-terminal communication.",
      consilium: "Mode: CONSILIUM. Convene an executive council of leadership roles (CEO, CTO, CISO, CFO). Deliberate trade-offs across perspectives, then synthesize into a decisive actionable consensus."
    };
    const langDirective = this.currentLang === "uk" ? "Respond strictly in Ukrainian (\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430). Maintain technical precision and cyber-terminal formatting." : this.currentLang === "ru" ? "Respond strictly in Russian. Maintain technical precision and cyber-terminal formatting. Adhere strictly to the rule: Use strictly USD ($) or EUR (\u20AC) for all pricing and metrics." : "Respond strictly in English. Maintain technical precision and cyber-terminal formatting.";
    return `${rolePrompts[this.currentRole]}

${modePrompts[this.currentMode]}

${langDirective}

Format your responses with clean cyber-terminal markdown, crisp ASCII tables or bullet points where appropriate, and clean code blocks.`;
  }
  async handleSend() {
    if (this.isGenerating) {
      if (this.abortController) {
        this.abortController.abort();
      }
      return;
    }
    const input = document.getElementById("user-input");
    const text = input?.value.trim();
    if (!text) return;
    input.value = "";
    const now = (/* @__PURE__ */ new Date()).toLocaleTimeString();
    this.appendMessage({
      role: "user",
      text,
      timestamp: now,
      metadata: {
        mode: this.currentMode,
        role: this.currentRole
      }
    });
    const customKey = localStorage.getItem("evabot_gemini_key") || "";
    this.isGenerating = true;
    this.updateStatusLight("busy");
    this.updateSendButtonState(true);
    const botMessageElement = this.createMessageBubble("model", "", now);
    const textSpan = botMessageElement.querySelector(".message-body");
    try {
      this.abortController = new AbortController();
      const historyPayload = this.messages.filter((m) => m.role === "user" || m.role === "model").map((m) => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      const t0 = performance.now();
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          model: this.currentModel,
          history: historyPayload,
          apiKey: customKey || void 0,
          systemInstruction: this.buildSystemInstruction()
        }),
        signal: this.abortController.signal
      });
      this.lastLatencyMs = Math.round(performance.now() - t0);
      this.updateTelemetryUI();
      if (!response.ok) {
        const errJson = await response.json().catch(() => ({ error: "Transmission error" }));
        throw new Error(errJson.error || `HTTP ${response.status}`);
      }
      if (!response.body) throw new Error("Readable stream not supported");
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let accumulatedText = "";
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data: ")) {
            const dataStr = trimmed.slice(6).trim();
            if (!dataStr) continue;
            try {
              const data = JSON.parse(dataStr);
              if (data.chunk) {
                accumulatedText += data.chunk;
                textSpan.innerHTML = this.renderMarkdown(accumulatedText);
                this.scrollToBottom();
              } else if (data.error) {
                accumulatedText += `

[Error: ${data.error}]`;
                textSpan.innerHTML = this.renderMarkdown(accumulatedText);
              }
            } catch {
            }
          }
        }
      }
      this.messages.push({
        role: "model",
        text: accumulatedText,
        timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
        metadata: {
          model: this.currentModel,
          mode: this.currentMode,
          role: this.currentRole,
          provider: this.currentProvider
        }
      });
      this.updateStatusLight("online");
    } catch (err) {
      this.updateStatusLight("error");
      if (err.name === "AbortError") {
        textSpan.innerHTML += '\n<span class="text-amber-400 font-mono text-xs"> [STREAM_HALTED_BY_OPERATOR \u{1F7E1}]</span>';
      } else {
        textSpan.innerHTML = `<span class="text-rose-500 font-mono text-xs">\u{1F534} TRANSMISSION_ERROR: ${this.escapeHtml(err.message)}</span>`;
      }
    } finally {
      this.isGenerating = false;
      this.abortController = null;
      this.updateSendButtonState(false);
      this.setupCodeCopyButtons();
      setTimeout(() => {
        if (!this.isGenerating) this.updateStatusLight("online");
      }, 3e3);
    }
  }
  updateStatusLight(state) {
    const t = this.t();
    const light = document.getElementById("telemetry-status-light");
    const text = document.getElementById("telemetry-status-text");
    if (state === "online") {
      if (light) light.className = "inline-block w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#22c55e]";
      if (text) {
        text.textContent = t.statusOnline;
        text.className = "text-xs text-emerald-400 font-mono font-bold";
      }
    } else if (state === "busy") {
      if (light) light.className = "inline-block w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-pulse";
      if (text) {
        text.textContent = t.statusBusy;
        text.className = "text-xs text-amber-400 font-mono font-bold";
      }
    } else {
      if (light) light.className = "inline-block w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#ef4444]";
      if (text) {
        text.textContent = t.statusError;
        text.className = "text-xs text-rose-500 font-mono font-bold";
      }
    }
  }
  updateSendButtonState(generating) {
    const t = this.t();
    const sendBtn = document.getElementById("send-btn");
    if (!sendBtn) return;
    if (generating) {
      sendBtn.textContent = t.stopBtn;
      sendBtn.className = "px-4 py-2 border border-amber-500 bg-amber-950/40 text-amber-400 font-bold text-xs tracking-wider transition-all hover:bg-amber-900/60 font-mono";
    } else {
      sendBtn.textContent = t.transmitBtn;
      sendBtn.className = "px-4 py-2 border border-white bg-white text-black font-bold text-xs tracking-wider transition-all hover:bg-zinc-200 active:scale-95 font-mono";
    }
  }
  appendMessage(msg) {
    this.messages.push(msg);
    const el = this.createMessageBubble(msg.role, msg.text, msg.timestamp);
    const container = document.getElementById("messages-container");
    if (container) {
      container.appendChild(el);
      this.scrollToBottom();
      this.setupCodeCopyButtons();
    }
  }
  createMessageBubble(role, text, timestamp) {
    const wrapper = document.createElement("div");
    wrapper.className = "w-full mb-4 animate-fade-in font-mono text-sm";
    const isUser = role === "user";
    const isSystem = role === "system";
    const card = document.createElement("div");
    card.className = isUser ? "border border-zinc-700 bg-black p-3 sm:p-4 text-white" : isSystem ? "border border-dashed border-zinc-800 bg-black p-2 text-zinc-400 text-xs text-center" : "border border-zinc-800 bg-black p-3 sm:p-4 text-white";
    const header = document.createElement("div");
    header.className = "text-xs text-zinc-500 mb-2 flex items-center justify-between gap-2 border-b border-zinc-900 pb-1.5 font-mono";
    const callsign = isUser ? `\u250C\u2500 [${timestamp}] [USER // OPERATOR]` : `\u250C\u2500 [${timestamp}] [EVA // ${this.currentModel.toUpperCase()} // ${this.currentMode.toUpperCase()} // ${this.currentRole.toUpperCase()}]`;
    header.innerHTML = `
      <span class="font-bold ${isUser ? "text-white" : "text-zinc-300"}">${callsign}</span>
      <span class="text-zinc-600 text-[11px]">${isUser ? "TX_OK" : "RX_OK \u{1F7E2}"}</span>
    `;
    const body = document.createElement("div");
    body.className = "message-body font-mono text-zinc-200 leading-relaxed overflow-x-auto";
    body.innerHTML = this.renderMarkdown(text);
    card.appendChild(header);
    card.appendChild(body);
    const footer = document.createElement("div");
    footer.className = "text-xs text-zinc-700 mt-2 font-mono select-none";
    footer.textContent = "\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500";
    card.appendChild(footer);
    wrapper.appendChild(card);
    const container = document.getElementById("messages-container");
    container?.appendChild(wrapper);
    return wrapper;
  }
  renderMarkdown(md) {
    if (!md) return "";
    let html = md;
    html = html.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_match, lang, code) => {
      const language = lang || "text";
      const t = this.t();
      return `
        <div class="code-block-wrapper my-3 border border-zinc-800 bg-black font-mono text-xs">
          <div class="flex justify-between items-center px-3 py-1.5 border-b border-zinc-800 bg-zinc-950 text-zinc-400">
            <span class="font-bold uppercase tracking-widest text-[11px] text-white">\u250C [CODE: ${language.toUpperCase()}]</span>
            <button class="copy-code-btn px-2 py-0.5 border border-zinc-700 bg-black hover:bg-zinc-800 text-zinc-200 transition-all text-[10px]" data-code="${encodeURIComponent(code)}">${t.copyBtn}</button>
          </div>
          <pre class="p-3 overflow-x-auto text-zinc-200"><code>${this.escapeHtml(code)}</code></pre>
          <div class="px-3 py-0.5 border-t border-zinc-900 text-zinc-700 text-[10px]">\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500</div>
        </div>
      `;
    });
    html = html.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 border border-zinc-800 bg-zinc-950 text-white font-mono text-xs">$1</code>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-bold">$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em class="text-zinc-400">$1</em>');
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-sm font-bold text-white mt-3 mb-1 border-b border-zinc-800 pb-0.5">> $1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-base font-bold text-white mt-4 mb-1.5 border-b border-zinc-700 pb-1">>> $1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-lg font-bold text-white mt-4 mb-2 border-b border-zinc-600 pb-1">>>> $1</h1>');
    html = html.replace(/^\s*-\s+(.*$)/gim, '<div class="flex items-start gap-2 ml-2 my-0.5 text-zinc-300"><span class="text-zinc-500">\u2022</span><span>$1</span></div>');
    html = html.replace(/\n\n/g, "<br/><br/>");
    return html;
  }
  setupCodeCopyButtons() {
    const t = this.t();
    document.querySelectorAll(".copy-code-btn").forEach((btn) => {
      btn.onclick = () => {
        const raw = btn.getAttribute("data-code");
        if (raw) {
          navigator.clipboard.writeText(decodeURIComponent(raw));
          btn.textContent = t.copiedBtn;
          setTimeout(() => {
            btn.textContent = t.copyBtn;
          }, 2e3);
        }
      };
    });
  }
  addSystemNotification(text) {
    const container = document.getElementById("messages-container");
    if (!container) return;
    const notif = document.createElement("div");
    notif.className = "text-center my-2 text-xs font-mono text-zinc-500";
    notif.innerHTML = `\u2726 ${this.renderMarkdown(text)}`;
    container.appendChild(notif);
    this.scrollToBottom();
  }
  scrollToBottom() {
    const main = document.getElementById("chat-scroll-area");
    if (main) {
      main.scrollTop = main.scrollHeight;
    }
  }
  escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
};
window.EvaBotWebApp = EvaBotWebApp;
window.addEventListener("DOMContentLoaded", () => {
  window.evaBotApp = new EvaBotWebApp();
});
export {
  EvaBotWebApp
};
//# sourceMappingURL=bundle.js.map
