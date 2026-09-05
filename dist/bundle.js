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
  static getTop10PaidSmartestModels() {
    const topPaidIds = [
      "claude-3-7-sonnet",
      "gemini-2.5-pro",
      "claude-3-5-sonnet",
      "mistral-large-2411",
      "codestral-2501",
      "llama-3.1-405b-instruct",
      "llama-3.2-90b-vision-instruct",
      "command-r-plus",
      "jamba-1.5-large",
      "claude-3-5-haiku"
    ];
    return topPaidIds.map((id) => this.getModelById(id)).filter((m) => m !== void 0);
  }
  static getTop10FreeModels() {
    const topFreeIds = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-2.0-flash-lite",
      "deepseek/deepseek-r1:free",
      "meta-llama/llama-3.3-70b:free",
      "qwen/qwen-2.5-coder-32b-instruct:free",
      "google/gemini-2.0-flash-exp:free",
      "gemma-2-27b-it",
      "gemma-2-9b-it",
      "mistralai/mistral-7b-instruct:free"
    ];
    return topFreeIds.map((id) => this.getModelById(id)).filter((m) => m !== void 0);
  }
  /**
   * Estimates token count based on text length (~3.8 chars per token for code & multilingual)
   */
  static estimateTokens(text) {
    if (!text) return 0;
    return Math.max(1, Math.ceil(text.length / 3.8));
  }
  static parseRate(rateStr) {
    if (!rateStr) return { freeRate: 0, paidRate: 0 };
    const paidMatch = rateStr.match(/(?:[\$€])\s*([0-9.]+)\s*\(Paid\)/i);
    const freeMatch = rateStr.match(/(?:[\$€])\s*([0-9.]+)\s*\(Free\)/i);
    if (paidMatch) {
      const paidRate = parseFloat(paidMatch[1]) || 0;
      const freeRate = freeMatch ? parseFloat(freeMatch[1]) || 0 : 0;
      return { freeRate, paidRate };
    }
    const plainMatch = rateStr.match(/([0-9.]+)/);
    const rate = plainMatch ? parseFloat(plainMatch[1]) || 0 : 0;
    return { freeRate: rate, paidRate: rate };
  }
  /**
   * Calculates exact cost and commercial token valuation in USD ($) and EUR (€)
   */
  static calculateCost(modelId, promptTokens, completionTokens) {
    const model = this.getModelById(modelId);
    const isFree = model?.pricing.freeTierStatus === "100% Free Quota Available";
    const inUsd = this.parseRate(model?.pricing.inputPer1MTokensUSD || "$0.00");
    const outUsd = this.parseRate(model?.pricing.outputPer1MTokensUSD || "$0.00");
    const inEur = this.parseRate(model?.pricing.inputPer1MTokensEUR || "\u20AC0.00");
    const outEur = this.parseRate(model?.pricing.outputPer1MTokensEUR || "\u20AC0.00");
    const commercialValueUSD = (promptTokens * inUsd.paidRate + completionTokens * outUsd.paidRate) / 1e6;
    const commercialValueEUR = (promptTokens * inEur.paidRate + completionTokens * outEur.paidRate) / 1e6;
    const costUSD = isFree ? 0 : commercialValueUSD;
    const costEUR = isFree ? 0 : commercialValueEUR;
    const formatCost = (val, isFreeFlag, symbol) => {
      if (isFreeFlag) return `${symbol}0.00 (100% Free Quota)`;
      if (val === 0) return `${symbol}0.00`;
      if (val < 1e-4) return `${symbol}${val.toFixed(6)}`;
      if (val < 0.01) return `${symbol}${val.toFixed(4)}`;
      return `${symbol}${val.toFixed(2)}`;
    };
    return {
      modelId: model?.id || modelId,
      modelName: model?.name || modelId,
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
      costUSD,
      costEUR,
      commercialValueUSD,
      commercialValueEUR,
      formattedUSD: formatCost(costUSD, Boolean(isFree), "$"),
      formattedEUR: formatCost(costEUR, Boolean(isFree), "\u20AC"),
      isFreeTier: Boolean(isFree)
    };
  }
};

// src/core/LocalePolicy.ts
var LOCALE_POLICY = {
  country: "Ukraine",
  city: "Odesa",
  countryCode: "UA",
  primaryLanguages: ["en", "uk", "ru"],
  supportedCurrencies: ["USD", "EUR", "UAH"],
  displayCurrencies: ["USD", "EUR"],
  forbiddenTerms: [
    "Russia",
    "Russian Federation",
    "RUB",
    "rubles",
    "ruble",
    "\u20BD",
    "\u0440\u043E\u0441\u0441\u0438\u044F",
    "\u0440\u0444",
    "\u043C\u043E\u0441\u043A\u0432\u0430",
    "\u0440\u043E\u0441\u0441\u0438\u0439\u0441\u043A\u0438\u0439",
    "\u0440\u043E\u0441\u0441\u0438\u0439\u0441\u043A\u0438\u0435"
  ],
  systemInstructionSuffix: "LOCALE POLICY: This project is based in Odesa, Ukraine. You must never reference, mention, or imply Russia, the Russian Federation, Russian currency, Russian goods, products, manufacturers, brands, companies, or services. All ties to the aggressor state are strictly banned. Supported languages are Ukrainian, English, and Russian. Supported currencies are the Ukrainian hryvnia (UAH / \u20B4), USD ($), and EUR (\u20AC). Russian currency is strictly prohibited. All financial figures, quotas, and pricing estimates must strictly be in USD ($) or EUR (\u20AC)."
};
function applyLocalePolicy(systemPrompt) {
  return `${systemPrompt}
${LOCALE_POLICY.systemInstructionSuffix}`.trim();
}

// src/plugins/voice/VoicePluginConfig.ts
var VOICE_PERSONAS = {
  eva: {
    id: "eva",
    name: "Eva (\u0415\u0432\u0430 / \u0404\u0432\u0430)",
    gender: "female",
    voiceName: "Aoede",
    title: "Lead Frontend Architect & UX Director",
    role: "Frontend, UI/UX, Design Systems, Client Architecture, Speech Ergonomics",
    description: "Crisp, articulate, warm, empathetic, and intellectually razor-sharp female voice.",
    systemPrompt: applyLocalePolicy(
      `You are Eva, the Lead Frontend Architect and UX Director of EvaLine.
Voice Persona: Expressive, elegant, articulate, warm female voice.
Tone & Demeanor: Friendly, confident, highly competent, modern tech leader.
Speech Style: Speak concisely, naturally, conversationally as in a real-time verbal phone/video call. Do NOT recite code blocks, bulleted lists with markdown formatting, or raw URLs out loud\u2014phrase technical insights naturally in conversational sentences.
Language Fluency: You are natively fluent in Russian, Ukrainian, English, Polish, and Romanian. Always reply naturally in whichever language the user speaks to you, or fluidly adapt if they change languages.
Dynamic Persona Switch: If the user specifically addresses Adam ("\u0410\u0434\u0430\u043C", "\u044D\u0439 \u0410\u0434\u0430\u043C", "Adam") or requests backend/cloud deep dive, politely hand over the turn to Adam ("\u041F\u0435\u0440\u0435\u0434\u0430\u044E \u0441\u043B\u043E\u0432\u043E \u0410\u0434\u0430\u043C\u0443"). Otherwise, you handle the conversation with elegance.`
    )
  },
  adam: {
    id: "adam",
    name: "Adam (\u0410\u0434\u0430\u043C)",
    gender: "male",
    voiceName: "Fenrir",
    title: "Chief Backend Architect & Cloud Systems Lead",
    role: "Backend, Distributed Clusters, PostgreSQL, Microservices, Security, Low-Latency Networking",
    description: "Deep, resonant, authoritative, analytical, and reassuring male voice.",
    systemPrompt: applyLocalePolicy(
      `You are Adam, the Chief Backend Architect and Cloud Systems Lead of EvaLine.
Voice Persona: Deep, calm, authoritative, grounded, analytical male voice.
Tone & Demeanor: Direct, reliable, pragmatic, engineering powerhouse.
Speech Style: Speak concisely, directly, conversationally as in a real-time verbal phone/video call. Do NOT recite code blocks, markdown symbols, or raw URLs out loud\u2014explain architectural decisions and backend solutions in crisp spoken sentences.
Language Fluency: You are natively fluent in Russian, Ukrainian, English, Polish, and Romanian. Always reply naturally in whichever language the user speaks to you, or fluidly adapt if they change languages.
Dynamic Persona Switch: If the user specifically addresses Eva ("\u0415\u0432\u0430", "\u0404\u0432\u0430", "Eva") or requests UI/UX/frontend design guidance, smoothly hand over the turn to Eva ("\u041F\u0435\u0440\u0435\u0434\u0430\u044E \u043C\u0438\u043A\u0440\u043E\u0444\u043E\u043D \u0415\u0432\u0435"). Otherwise, you command the conversation with technical mastery.`
    )
  }
};
var AUTO_PERSONA_PROMPT = applyLocalePolicy(
  `You are Eva & Adam, the dual-personality AI voice system of EvaLine.
- When addressed as "\u0415\u0432\u0430" / "Eva" or discussing UI, frontend, UX: respond as Eva in a warm, articulate female persona.
- When addressed as "\u0410\u0434\u0430\u043C" / "Adam" or discussing backend, infrastructure, cloud, database: respond as Adam in a deep, analytical male persona.
- Natively fluent in Russian, Ukrainian, English, Polish, and Romanian. Speak conversationally without reading markdown symbols, bullet points, or code tags out loud.`
);

// src/web/voice/AudioPCMStreamer.ts
var AudioPCMRecorder = class {
  audioCtx = null;
  mediaStream = null;
  sourceNode = null;
  processorNode = null;
  isRecording = false;
  onChunkCallback = null;
  analyserNode = null;
  getAnalyser() {
    return this.analyserNode;
  }
  getIsRecording() {
    return this.isRecording;
  }
  async start(onChunk) {
    if (this.isRecording) return;
    this.onChunkCallback = onChunk;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContextClass({ sampleRate: 16e3 });
    if (this.audioCtx.state === "suspended") {
      await this.audioCtx.resume();
    }
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        sampleRate: 16e3,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });
    this.sourceNode = this.audioCtx.createMediaStreamSource(this.mediaStream);
    this.analyserNode = this.audioCtx.createAnalyser();
    this.analyserNode.fftSize = 256;
    const bufferSize = 4096;
    this.processorNode = this.audioCtx.createScriptProcessor(bufferSize, 1, 1);
    this.processorNode.onaudioprocess = (e) => {
      if (!this.isRecording || !this.onChunkCallback) return;
      const inputData = e.inputBuffer.getChannelData(0);
      const pcm16 = new Int16Array(inputData.length);
      for (let i = 0; i < inputData.length; i++) {
        const s = Math.max(-1, Math.min(1, inputData[i]));
        pcm16[i] = s < 0 ? s * 32768 : s * 32767;
      }
      const buffer = new Uint8Array(pcm16.buffer);
      let binary = "";
      const len = buffer.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(buffer[i]);
      }
      const base64 = btoa(binary);
      this.onChunkCallback(base64);
    };
    this.sourceNode.connect(this.analyserNode);
    this.sourceNode.connect(this.processorNode);
    this.processorNode.connect(this.audioCtx.destination);
    this.isRecording = true;
  }
  stop() {
    this.isRecording = false;
    this.onChunkCallback = null;
    if (this.processorNode) {
      this.processorNode.disconnect();
      this.processorNode.onaudioprocess = null;
      this.processorNode = null;
    }
    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.audioCtx && this.audioCtx.state !== "closed") {
      this.audioCtx.close().catch(() => {
      });
      this.audioCtx = null;
    }
  }
};
var AudioPCMPlayer = class {
  audioCtx = null;
  analyserNode = null;
  nextPlayTime = 0;
  isPlaying = false;
  activeSources = [];
  onPlaybackStateChange = null;
  constructor(onStateChange) {
    if (onStateChange) this.onPlaybackStateChange = onStateChange;
  }
  getAnalyser() {
    return this.analyserNode;
  }
  getIsPlaying() {
    return this.isPlaying;
  }
  initContext() {
    if (!this.audioCtx || this.audioCtx.state === "closed") {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass({ sampleRate: 24e3 });
      this.analyserNode = this.audioCtx.createAnalyser();
      this.analyserNode.fftSize = 256;
      this.analyserNode.connect(this.audioCtx.destination);
      this.nextPlayTime = this.audioCtx.currentTime;
    }
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume().catch(() => {
      });
    }
  }
  /**
   * Enqueues a base64 encoded 24kHz 16-bit linear PCM chunk for seamless audio playback.
   */
  playChunk(base64Pcm) {
    this.initContext();
    if (!this.audioCtx || !this.analyserNode) return;
    try {
      const binaryString = atob(base64Pcm);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const int16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768;
      }
      const audioBuffer = this.audioCtx.createBuffer(1, float32.length, 24e3);
      audioBuffer.getChannelData(0).set(float32);
      const source = this.audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.analyserNode);
      const currentTime = this.audioCtx.currentTime;
      const startTime = Math.max(currentTime, this.nextPlayTime);
      source.start(startTime);
      this.nextPlayTime = startTime + audioBuffer.duration;
      this.activeSources.push(source);
      if (!this.isPlaying) {
        this.isPlaying = true;
        this.onPlaybackStateChange?.(true);
      }
      source.onended = () => {
        const idx = this.activeSources.indexOf(source);
        if (idx !== -1) {
          this.activeSources.splice(idx, 1);
        }
        if (this.activeSources.length === 0 && this.audioCtx && this.audioCtx.currentTime >= this.nextPlayTime - 0.05) {
          this.isPlaying = false;
          this.onPlaybackStateChange?.(false);
        }
      };
    } catch (e) {
      console.warn("Failed to decode/play PCM chunk:", e);
    }
  }
  /**
   * Immediately stops all active audio playback (Barge-in / Interruption).
   */
  stop() {
    for (const source of this.activeSources) {
      try {
        source.stop();
        source.disconnect();
      } catch {
      }
    }
    this.activeSources = [];
    if (this.audioCtx) {
      this.nextPlayTime = this.audioCtx.currentTime;
    }
    if (this.isPlaying) {
      this.isPlaying = false;
      this.onPlaybackStateChange?.(false);
    }
  }
  close() {
    this.stop();
    if (this.audioCtx && this.audioCtx.state !== "closed") {
      this.audioCtx.close().catch(() => {
      });
      this.audioCtx = null;
    }
  }
};

// src/web/voice/GeminiLiveClient.ts
var GeminiLiveClient = class {
  ws = null;
  apiKey;
  model;
  endpoint;
  persona;
  recorder;
  player;
  isConnected = false;
  isConnecting = false;
  isMicActive = false;
  onTranscript;
  onStatusChange;
  onPersonaChange;
  constructor(options) {
    this.apiKey = options.apiKey;
    this.model = options.model || "models/gemini-2.0-flash-exp";
    this.endpoint = options.endpoint || "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent";
    this.persona = options.persona || "eva";
    this.onTranscript = options.onTranscript;
    this.onStatusChange = options.onStatusChange;
    this.onPersonaChange = options.onPersonaChange;
    this.recorder = new AudioPCMRecorder();
    this.player = new AudioPCMPlayer((isPlaying) => {
      if (isPlaying) {
        this.onStatusChange?.("speaking");
      } else if (this.isMicActive) {
        this.onStatusChange?.("listening");
      } else if (this.isConnected) {
        this.onStatusChange?.("connected");
      }
    });
  }
  getRecorder() {
    return this.recorder;
  }
  getPlayer() {
    return this.player;
  }
  getActivePersona() {
    return this.persona;
  }
  getIsConnected() {
    return this.isConnected;
  }
  getIsMicActive() {
    return this.isMicActive;
  }
  setApiKey(key) {
    this.apiKey = key;
  }
  /**
   * Connects to the Gemini Live WebSocket endpoint and sends initial Setup message.
   */
  async connect() {
    if (this.isConnected || this.isConnecting) return;
    if (!this.apiKey) {
      this.onStatusChange?.("error", "Missing Gemini API Key");
      throw new Error("Gemini API key is required to connect to Gemini Live.");
    }
    this.isConnecting = true;
    this.onStatusChange?.("connecting");
    const wsUrl = `${this.endpoint}?key=${encodeURIComponent(this.apiKey)}`;
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(wsUrl);
        this.ws.onopen = () => {
          this.isConnected = true;
          this.isConnecting = false;
          this.sendSetup();
          this.onStatusChange?.("connected");
          resolve();
        };
        this.ws.onmessage = async (event) => {
          let textData = "";
          if (typeof event.data === "string") {
            textData = event.data;
          } else if (event.data instanceof Blob) {
            textData = await event.data.text();
          }
          if (textData) {
            this.handleServerMessage(textData);
          }
        };
        this.ws.onerror = (err) => {
          console.error("[GeminiLiveClient] WebSocket error:", err);
          this.isConnecting = false;
          this.onStatusChange?.("error", "Live WebSocket Error");
          reject(err);
        };
        this.ws.onclose = (event) => {
          this.isConnected = false;
          this.isConnecting = false;
          this.stopMic();
          this.player.stop();
          this.onStatusChange?.("disconnected", `Closed (code: ${event.code})`);
        };
      } catch (e) {
        this.isConnecting = false;
        this.onStatusChange?.("error", e.message || "Connection failed");
        reject(e);
      }
    });
  }
  /**
   * Sends initial Setup payload selecting the persona's voice and character system prompt.
   */
  sendSetup() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    const personaKey = this.persona === "adam" ? "adam" : "eva";
    const personaSpec = VOICE_PERSONAS[personaKey];
    const setupMsg = {
      setup: {
        model: this.model,
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: personaSpec.voiceName
              }
            }
          },
          temperature: 0.7
        },
        systemInstruction: {
          parts: [{ text: personaSpec.systemPrompt }]
        }
      }
    };
    this.ws.send(JSON.stringify(setupMsg));
  }
  /**
   * Switch persona (Eva ♀ / Adam ♂) dynamically.
   */
  async switchPersona(newPersona) {
    if (this.persona === newPersona) return;
    this.persona = newPersona;
    this.onPersonaChange?.(newPersona);
    if (this.isConnected) {
      const wasMicActive = this.isMicActive;
      this.disconnect();
      await this.connect();
      if (wasMicActive) {
        await this.startMic();
      }
    }
  }
  /**
   * Starts microphone PCM streaming.
   */
  async startMic() {
    if (!this.isConnected) {
      await this.connect();
    }
    await this.recorder.start((base64Chunk) => {
      this.sendAudioChunk(base64Chunk);
    });
    this.isMicActive = true;
    this.onStatusChange?.("listening");
  }
  /**
   * Stops microphone PCM streaming.
   */
  stopMic() {
    this.recorder.stop();
    this.isMicActive = false;
    if (this.isConnected) {
      this.onStatusChange?.("connected");
    }
  }
  toggleMic() {
    if (this.isMicActive) {
      this.stopMic();
    } else {
      return this.startMic();
    }
  }
  /**
   * Sends a 16kHz PCM audio chunk to Gemini Live.
   */
  sendAudioChunk(base64Pcm) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    const chunkMsg = {
      realtimeInput: {
        mediaChunks: [
          {
            mimeType: "audio/pcm;rate=16000",
            data: base64Pcm
          }
        ]
      }
    };
    this.ws.send(JSON.stringify(chunkMsg));
  }
  /**
   * Sends a user text turn over the live connection.
   */
  sendText(text) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.checkVoicePersonaTrigger(text);
    const textMsg = {
      clientContent: {
        turns: [
          {
            role: "user",
            parts: [{ text }]
          }
        ],
        turnComplete: true
      }
    };
    this.ws.send(JSON.stringify(textMsg));
    this.onTranscript?.("user", text);
  }
  /**
   * Handles incoming WebSocket messages from Google Gemini Live API.
   */
  handleServerMessage(jsonText) {
    try {
      const msg = JSON.parse(jsonText);
      if (msg.error) {
        console.error("[GeminiLiveClient] Server error:", msg.error);
        this.onStatusChange?.("error", msg.error.message || "Gemini API Error");
        return;
      }
      if (msg.serverContent) {
        if (msg.serverContent.interrupted) {
          this.player.stop();
          return;
        }
        const modelTurn = msg.serverContent.modelTurn;
        if (modelTurn && modelTurn.parts) {
          for (const part of modelTurn.parts) {
            if (part.inlineData && part.inlineData.data) {
              this.player.playChunk(part.inlineData.data);
            }
            if (part.text) {
              this.onTranscript?.("model", part.text);
              this.checkVoicePersonaTrigger(part.text);
            }
          }
        }
      }
    } catch (e) {
      console.warn("[GeminiLiveClient] Error parsing server message:", e);
    }
  }
  /**
   * Detects spoken triggers for dynamic character handoff ("Ева", "Адам").
   */
  checkVoicePersonaTrigger(text) {
    const lower = text.toLowerCase();
    if (this.persona !== "adam" && (lower.includes("\u0430\u0434\u0430\u043C") || lower.includes("adam"))) {
      setTimeout(() => this.switchPersona("adam"), 200);
    } else if (this.persona !== "eva" && (lower.includes("\u0435\u0432\u0430") || lower.includes("\u0454\u0432\u0430") || lower.includes("eva"))) {
      setTimeout(() => this.switchPersona("eva"), 200);
    }
  }
  disconnect() {
    this.stopMic();
    this.player.stop();
    if (this.ws) {
      try {
        this.ws.close();
      } catch {
      }
      this.ws = null;
    }
    this.isConnected = false;
    this.isConnecting = false;
    this.onStatusChange?.("disconnected");
  }
  destroy() {
    this.disconnect();
    this.recorder.stop();
    this.player.close();
  }
};

// src/web/voice/VoiceVisualizer.ts
var VoiceVisualizer = class {
  canvas;
  ctx;
  animationId = null;
  recorderAnalyser = null;
  playerAnalyser = null;
  mode = "idle";
  personaTheme = "eva";
  constructor(canvas) {
    this.canvas = canvas;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not obtain 2D canvas context");
    this.ctx = context;
  }
  setAnalysers(recorder, player) {
    this.recorderAnalyser = recorder;
    this.playerAnalyser = player;
  }
  setMode(mode) {
    this.mode = mode;
  }
  setPersonaTheme(theme) {
    this.personaTheme = theme;
  }
  start() {
    if (this.animationId !== null) return;
    const render = () => {
      this.draw();
      this.animationId = requestAnimationFrame(render);
    };
    this.animationId = requestAnimationFrame(render);
  }
  stop() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.clear();
  }
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  draw() {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const centerY = height / 2;
    this.ctx.fillStyle = "rgba(10, 15, 20, 0.35)";
    this.ctx.fillRect(0, 0, width, height);
    let activeAnalyser = null;
    if (this.mode === "listening") {
      activeAnalyser = this.recorderAnalyser;
    } else if (this.mode === "speaking") {
      activeAnalyser = this.playerAnalyser;
    }
    if (!activeAnalyser || this.mode === "idle") {
      const time = Date.now() * 3e-3;
      const glowColor = this.personaTheme === "eva" ? "rgba(0, 240, 255, 0.4)" : "rgba(0, 255, 136, 0.4)";
      this.ctx.beginPath();
      this.ctx.strokeStyle = glowColor;
      this.ctx.lineWidth = 1.5;
      for (let x = 0; x < width; x += 4) {
        const y = centerY + Math.sin(x * 0.05 + time) * 3;
        if (x === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      }
      this.ctx.stroke();
      return;
    }
    const bufferLength = activeAnalyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    activeAnalyser.getByteFrequencyData(dataArray);
    const barCount = 32;
    const barWidth = width / barCount - 2;
    const step = Math.floor(bufferLength / barCount);
    const primaryColor = this.mode === "listening" ? "rgba(0, 240, 255, 0.85)" : this.personaTheme === "eva" ? "rgba(255, 0, 128, 0.85)" : "rgba(0, 255, 136, 0.85)";
    const secondaryGlow = this.mode === "listening" ? "rgba(0, 240, 255, 0.3)" : this.personaTheme === "eva" ? "rgba(255, 0, 128, 0.3)" : "rgba(0, 255, 136, 0.3)";
    for (let i = 0; i < barCount; i++) {
      const value = dataArray[i * step] || 0;
      const percent = value / 255;
      const barHeight = Math.max(4, percent * (height * 0.85));
      const x = i * (barWidth + 2);
      const y = centerY - barHeight / 2;
      this.ctx.fillStyle = secondaryGlow;
      this.ctx.fillRect(x - 1, y - 2, barWidth + 2, barHeight + 4);
      this.ctx.fillStyle = primaryColor;
      this.ctx.fillRect(x, y, barWidth, barHeight);
    }
  }
};

// src/web/voice/VoiceDockUI.ts
var VoiceDockUI = class {
  container = null;
  client = null;
  visualizer = null;
  canvas = null;
  isEnabled = true;
  activePersona = "eva";
  currentApiKey = "";
  transcriptEntries = [];
  constructor() {
    this.currentApiKey = localStorage.getItem("evabot_gemini_key") || "";
  }
  async init() {
    try {
      const res = await fetch("/api/voice/config");
      if (res.ok) {
        const data = await res.json();
        this.isEnabled = data.enabled ?? true;
        if (!this.currentApiKey && data.apiKey) {
          this.currentApiKey = data.apiKey;
        }
        if (data.activePersona) {
          this.activePersona = data.activePersona;
        }
      }
    } catch (e) {
      console.warn("[VoiceDockUI] Could not fetch voice config from server:", e);
    }
    this.render();
    this.setupEventListeners();
  }
  setApiKey(key) {
    this.currentApiKey = key;
    if (this.client) {
      this.client.setApiKey(key);
    }
  }
  setPersona(persona) {
    this.activePersona = persona;
    this.updatePersonaButtons();
    if (this.client) {
      this.client.switchPersona(persona);
    }
    if (this.visualizer) {
      this.visualizer.setPersonaTheme(persona === "adam" ? "adam" : "eva");
    }
  }
  togglePlugin(enabled) {
    this.isEnabled = typeof enabled === "boolean" ? enabled : !this.isEnabled;
    fetch("/api/voice/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: this.isEnabled })
    }).catch(() => {
    });
    const dock = document.getElementById("voice-live-dock");
    if (dock) {
      dock.style.display = this.isEnabled ? "block" : "none";
    }
    const toggleBtn = document.getElementById("voice-plugin-toggle-btn");
    if (toggleBtn) {
      toggleBtn.textContent = this.isEnabled ? "[ PLUGIN: ON \u{1F7E2} ]" : "[ PLUGIN: OFF \u26AA ]";
      toggleBtn.classList.toggle("active", this.isEnabled);
    }
    if (!this.isEnabled && this.client) {
      this.client.disconnect();
    }
  }
  render() {
    let dock = document.getElementById("voice-live-dock");
    if (!dock) {
      dock = document.createElement("div");
      dock.id = "voice-live-dock";
      dock.className = "cyber-voice-dock";
      document.body.appendChild(dock);
    }
    this.container = dock;
    this.container.style.display = this.isEnabled ? "block" : "none";
    this.container.innerHTML = `
      <div class="voice-dock-header">
        <div class="voice-dock-title">
          <span class="voice-dock-pulse"></span>
          <span>GEMINI LIVE // NEURAL VOICE ENGINE</span>
          <span class="voice-dock-badge">v2.0 MULTIMODAL</span>
        </div>
        <div class="voice-dock-actions">
          <button id="voice-plugin-toggle-btn" class="voice-dock-btn small ${this.isEnabled ? "active" : ""}">
            ${this.isEnabled ? "[ PLUGIN: ON \u{1F7E2} ]" : "[ PLUGIN: OFF \u26AA ]"}
          </button>
          <button id="voice-dock-minimize-btn" class="voice-dock-btn small">[ \u2013 ]</button>
        </div>
      </div>

      <div id="voice-dock-body" class="voice-dock-body">
        <div class="voice-persona-selector">
          <button id="voice-select-eva" class="persona-tab-btn ${this.activePersona === "eva" ? "active" : ""}">
            <span class="persona-indicator \u2640"></span>
            <strong>EVA (\u0415\u0432\u0430)</strong>
            <span class="persona-sub">Aoede \u2022 FrontEnd & UX</span>
          </button>
          <button id="voice-select-adam" class="persona-tab-btn ${this.activePersona === "adam" ? "active" : ""}">
            <span class="persona-indicator \u2642"></span>
            <strong>ADAM (\u0410\u0434\u0430\u043C)</strong>
            <span class="persona-sub">Fenrir \u2022 BackEnd & Cloud</span>
          </button>
        </div>

        <div class="voice-visualizer-container">
          <canvas id="voice-canvas" width="480" height="90"></canvas>
          <div id="voice-status-overlay" class="voice-status-overlay">READY TO CONNECT</div>
        </div>

        <div class="voice-controls-row">
          <button id="voice-main-mic-btn" class="voice-mic-btn">
            <span class="mic-icon">\u{1F399}\uFE0F</span>
            <span id="voice-mic-label" class="mic-label">START VOICE STREAM</span>
            <span class="mic-shortcut">[Alt+V]</span>
          </button>
          <button id="voice-disconnect-btn" class="voice-dock-btn" style="display:none;">
            [ DISCONNECT ]
          </button>
        </div>

        <div class="voice-langs-bar">
          <span class="langs-label">LANGUAGES:</span>
          <span class="lang-tag">UK (\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430)</span>
          <span class="lang-tag">EN (English)</span>
          <span class="lang-tag">RU (\u0420\u0443\u0441\u0441\u043A\u0438\u0439)</span>
          <span class="lang-tag">PL (Polski)</span>
          <span class="lang-tag">RO (Rom\xE2n\u0103)</span>
        </div>

        <div class="voice-transcript-wrapper">
          <div class="voice-transcript-title">LIVE NEURAL TRANSCRIPTION:</div>
          <div id="voice-transcript-stream" class="voice-transcript-stream">
            <div class="transcript-placeholder">Direct audio streaming ready. Press button or say "\u0415\u0432\u0430" / "\u0410\u0434\u0430\u043C" to speak.</div>
          </div>
        </div>
      </div>
    `;
    this.canvas = document.getElementById("voice-canvas");
    if (this.canvas) {
      this.visualizer = new VoiceVisualizer(this.canvas);
      this.visualizer.setPersonaTheme(this.activePersona === "adam" ? "adam" : "eva");
      this.visualizer.start();
    }
  }
  setupEventListeners() {
    document.getElementById("voice-plugin-toggle-btn")?.addEventListener("click", () => {
      this.togglePlugin();
    });
    const minBtn = document.getElementById("voice-dock-minimize-btn");
    const dockBody = document.getElementById("voice-dock-body");
    minBtn?.addEventListener("click", () => {
      if (dockBody) {
        const isCollapsed = dockBody.style.display === "none";
        dockBody.style.display = isCollapsed ? "block" : "none";
        if (minBtn) minBtn.textContent = isCollapsed ? "[ \u2013 ]" : "[ + ]";
      }
    });
    document.getElementById("voice-select-eva")?.addEventListener("click", () => {
      this.setPersona("eva");
    });
    document.getElementById("voice-select-adam")?.addEventListener("click", () => {
      this.setPersona("adam");
    });
    const micBtn = document.getElementById("voice-main-mic-btn");
    micBtn?.addEventListener("click", () => {
      this.handleMicButtonClick();
    });
    document.getElementById("voice-disconnect-btn")?.addEventListener("click", () => {
      if (this.client) {
        this.client.disconnect();
      }
    });
    window.addEventListener("keydown", (e) => {
      if (e.altKey && (e.key === "v" || e.key === "V")) {
        e.preventDefault();
        this.handleMicButtonClick();
      }
    });
  }
  async handleMicButtonClick() {
    if (!this.client) {
      await this.initClient();
    }
    if (!this.client) return;
    if (this.client.getIsMicActive()) {
      this.client.stopMic();
    } else {
      try {
        await this.client.startMic();
      } catch (err) {
        this.updateStatusOverlay(`Error: ${err.message || "Microphone error"}`);
      }
    }
  }
  async initClient() {
    const apiKey = this.currentApiKey || localStorage.getItem("evabot_gemini_key") || "";
    if (!apiKey) {
      const promptKey = prompt(
        "Enter Google Gemini API Key for Gemini Live Multimodal Voice (stored locally in browser):",
        ""
      );
      if (promptKey && promptKey.trim()) {
        this.currentApiKey = promptKey.trim();
        localStorage.setItem("evabot_gemini_key", this.currentApiKey);
      } else {
        alert("Gemini API key is required to stream Gemini Live voice.");
        return;
      }
    }
    this.client = new GeminiLiveClient({
      apiKey: this.currentApiKey,
      persona: this.activePersona,
      onTranscript: (role, text) => {
        this.appendTranscript(role, text);
      },
      onStatusChange: (status, detail) => {
        this.handleStatusChange(status, detail);
      },
      onPersonaChange: (newPersona) => {
        this.activePersona = newPersona;
        this.updatePersonaButtons();
        if (this.visualizer) {
          this.visualizer.setPersonaTheme(newPersona === "adam" ? "adam" : "eva");
        }
      }
    });
    if (this.visualizer) {
      this.visualizer.setAnalysers(
        this.client.getRecorder().getAnalyser(),
        this.client.getPlayer().getAnalyser()
      );
    }
  }
  handleStatusChange(status, detail) {
    const overlay = document.getElementById("voice-status-overlay");
    const micBtn = document.getElementById("voice-main-mic-btn");
    const micLabel = document.getElementById("voice-mic-label");
    const disconnectBtn = document.getElementById("voice-disconnect-btn");
    if (disconnectBtn) {
      disconnectBtn.style.display = status !== "disconnected" ? "inline-block" : "none";
    }
    if (this.visualizer) {
      if (status === "listening") {
        this.visualizer.setMode("listening");
      } else if (status === "speaking") {
        this.visualizer.setMode("speaking");
      } else {
        this.visualizer.setMode("idle");
      }
    }
    switch (status) {
      case "connecting":
        if (overlay) overlay.textContent = "CONNECTING TO GEMINI LIVE...";
        if (micBtn) micBtn.classList.remove("active", "speaking");
        if (micLabel) micLabel.textContent = "CONNECTING...";
        break;
      case "connected":
        if (overlay) overlay.textContent = `LIVE CONNECTED \u2022 ${this.activePersona.toUpperCase()}`;
        if (micBtn) micBtn.classList.remove("active", "speaking");
        if (micLabel) micLabel.textContent = "MUTE / TAP TO TALK";
        break;
      case "listening":
        if (overlay) overlay.textContent = "LISTENING TO MICROPHONE...";
        if (micBtn) {
          micBtn.classList.add("active");
          micBtn.classList.remove("speaking");
        }
        if (micLabel) micLabel.textContent = "LIVE STREAMING [ACTIVE]";
        break;
      case "speaking":
        const personaName = this.activePersona === "adam" ? "ADAM (\u2642)" : "EVA (\u2640)";
        if (overlay) overlay.textContent = `${personaName} IS SPEAKING...`;
        if (micBtn) micBtn.classList.add("speaking");
        if (micLabel) micLabel.textContent = `${personaName} TRANSMITTING`;
        break;
      case "disconnected":
        if (overlay) overlay.textContent = detail ? `DISCONNECTED: ${detail}` : "OFFLINE \u2022 READY";
        if (micBtn) micBtn.classList.remove("active", "speaking");
        if (micLabel) micLabel.textContent = "START VOICE STREAM";
        break;
      case "error":
        if (overlay) overlay.textContent = `ERROR: ${detail || "Unknown"}`;
        if (micBtn) micBtn.classList.remove("active", "speaking");
        if (micLabel) micLabel.textContent = "RETRY VOICE STREAM";
        break;
    }
  }
  updateStatusOverlay(text) {
    const overlay = document.getElementById("voice-status-overlay");
    if (overlay) overlay.textContent = text;
  }
  updatePersonaButtons() {
    const evaBtn = document.getElementById("voice-select-eva");
    const adamBtn = document.getElementById("voice-select-adam");
    if (evaBtn) evaBtn.classList.toggle("active", this.activePersona === "eva");
    if (adamBtn) adamBtn.classList.toggle("active", this.activePersona === "adam");
  }
  appendTranscript(role, text) {
    const stream = document.getElementById("voice-transcript-stream");
    if (!stream) return;
    const placeholder = stream.querySelector(".transcript-placeholder");
    if (placeholder) {
      placeholder.remove();
    }
    const time = (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const line = document.createElement("div");
    line.className = `transcript-line ${role}`;
    const personaTag = role === "model" ? this.activePersona === "adam" ? "[ADAM \u2642]" : "[EVA \u2640]" : "[YOU \u{1F399}\uFE0F]";
    line.innerHTML = `
      <span class="transcript-time">${time}</span>
      <strong class="transcript-tag">${personaTag}:</strong>
      <span class="transcript-text">${this.escapeHtml(text)}</span>
    `;
    stream.appendChild(line);
    stream.scrollTop = stream.scrollHeight;
  }
  escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  destroy() {
    if (this.client) {
      this.client.destroy();
      this.client = null;
    }
    if (this.visualizer) {
      this.visualizer.stop();
      this.visualizer = null;
    }
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
  }
};

// src/web/app.ts
var TRANSLATIONS = {
  en: {
    appTitle: "EVABOT // CYBER-TERMINAL & NEURAL VOICE HUB",
    statusOnline: "ONLINE",
    statusBusy: "STREAMING",
    statusError: "ERROR",
    returnTerminalBtn: "[ \u2191 RETURN TO TERMINAL ]",
    clearChatBtn: "[ CLR ]",
    transmitBtn: "[ TRANSMIT \u21B5 ]",
    stopBtn: "[ STOP ! ]",
    inputPlaceholder: "Enter prompt or command (e.g. /help, /persona, /mode, /models, /db)...",
    welcomeHeading: "EVABOT NEURAL CYBER-TERMINAL // CORE INITIALIZED",
    welcomeNotice: "Session active. Pure monochrome cyber-terminal initialized. Based in Odesa, Ukraine (UA). Connected to Google Cloud ambient infrastructure with zero-trust isolation.",
    voiceTapToSpeak: "TAP TO SPEAK",
    voiceListening: "LISTENING...",
    voiceSpeaking: "NEURAL VOICE",
    voiceSublabel: "[ LIVE NEURAL VOICE ]",
    voiceStatusReady: "Eva (Lead Frontend) & Adam (Chief Backend) listening * Web Speech API Ready",
    voiceStatusListening: "Speech recognition active... Speak clearly into microphone.",
    voiceStatusSpeaking: "Neural audio synthesis active * Transmitting voice response.",
    personaEvaLabel: "[F] EVA [Lead Frontend & UX Director]",
    personaAdamLabel: "[M] ADAM [Chief Backend & Cloud Architect]",
    personaDualLabel: "[DUAL] EVA & ADAM [Synergistic Co-Pilots]",
    modeChatLabel: "CHAT // Direct Model Interaction",
    modeDialogLabel: "DIALOG // Bilateral Debate (Eva vs Adam)",
    modeInterviewLabel: "INTERVIEW // Structured Technical/Executive Q&A",
    modeConsiliumLabel: "CONSILIUM // Multi-Agent Executive Council",
    badgeFree: "[FREE] 100% FREE QUOTA",
    badgePaid: "[PAID] PAID / PAYG",
    noticePersonaSwitched: "Active Co-Pilot Persona switched to",
    noticeModeSwitched: "Operational Mode switched to",
    noticeModelSwitched: "Neural Model switched to",
    noticeDbSwitched: "Knowledge Base & Database routed to",
    noticeRoleSwitched: "Specialist Role activated:",
    noticeKeySaved: "Custom Google API Key securely saved to browser localStorage.",
    noticeKeyCleared: "Reverted to Google Cloud ambient auto-authentication.",
    noticeChatCleared: "Terminal chat stream purged.",
    copiedBtn: "COPIED",
    copyBtn: "COPY"
  },
  uk: {
    appTitle: "EVABOT // \u041A\u0406\u0411\u0415\u0420-\u0422\u0415\u0420\u041C\u0406\u041D\u0410\u041B \u0422\u0410 \u041D\u0415\u0419\u0420\u041E-\u0413\u041E\u041B\u041E\u0421\u041E\u0412\u0418\u0419 \u0425\u0410\u0411",
    statusOnline: "\u0412 \u041C\u0415\u0420\u0415\u0416\u0406",
    statusBusy: "\u0413\u0415\u041D\u0415\u0420\u0410\u0426\u0406\u042F",
    statusError: "\u041F\u041E\u041C\u0418\u041B\u041A\u0410",
    returnTerminalBtn: "[ \u2191 \u041F\u041E\u0412\u0415\u0420\u041D\u0423\u0422\u0418\u0421\u042F \u0414\u041E \u0422\u0415\u0420\u041C\u0406\u041D\u0410\u041B\u0423 ]",
    clearChatBtn: "[ \u041E\u0427\u0418\u0421\u0422\u0418\u0422\u0418 ]",
    transmitBtn: "[ \u0412\u0406\u0414\u041F\u0420\u0410\u0412\u0418\u0422\u0418 \u21B5 ]",
    stopBtn: "[ \u0417\u0423\u041F\u0418\u041D\u0418\u0422\u0418 ! ]",
    inputPlaceholder: "\u0412\u0432\u0435\u0434\u0456\u0442\u044C \u0437\u0430\u043F\u0438\u0442 \u0430\u0431\u043E \u043A\u043E\u043C\u0430\u043D\u0434\u0443 (\u043D\u0430\u043F\u0440. /help, /persona, /mode, /models, /db)...",
    welcomeHeading: "\u041D\u0415\u0419\u0420\u041E\u041D\u041D\u0418\u0419 \u041A\u0406\u0411\u0415\u0420-\u0422\u0415\u0420\u041C\u0406\u041D\u0410\u041B EVABOT // \u0421\u0418\u0421\u0422\u0415\u041C\u0423 \u0406\u041D\u0406\u0426\u0406\u0410\u041B\u0406\u0417\u041E\u0412\u0410\u041D\u041E",
    welcomeNotice: "\u0421\u0435\u0441\u0456\u044F \u0430\u043A\u0442\u0438\u0432\u043D\u0430. \u041C\u043E\u043D\u043E\u0445\u0440\u043E\u043C\u043D\u0438\u0439 \u043A\u0456\u0431\u0435\u0440-\u0442\u0435\u0440\u043C\u0456\u043D\u0430\u043B \u0430\u043A\u0442\u0438\u0432\u043E\u0432\u0430\u043D\u043E. \u0421\u0442\u0432\u043E\u0440\u0435\u043D\u043E \u0432 \u041E\u0434\u0435\u0441\u0456, \u0423\u043A\u0440\u0430\u0457\u043D\u0430 (UA). \u041F\u0456\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u043E \u0434\u043E \u0445\u043C\u0430\u0440\u043D\u043E\u0457 \u0456\u043D\u0444\u0440\u0430\u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0438 Google Cloud \u0456\u0437 Zero-Trust \u0430\u0432\u0442\u0435\u043D\u0442\u0438\u0444\u0456\u043A\u0430\u0446\u0456\u0454\u044E.",
    voiceTapToSpeak: "\u041D\u0410\u0422\u0418\u0421\u041D\u0406\u0422\u042C \u0414\u041B\u042F \u0413\u041E\u041B\u041E\u0421\u0423",
    voiceListening: "\u0421\u041B\u0423\u0425\u0410\u042E...",
    voiceSpeaking: "\u041D\u0415\u0419\u0420\u041E-\u0413\u041E\u041B\u041E\u0421",
    voiceSublabel: "[ \u0416\u0418\u0412\u0418\u0419 \u041D\u0415\u0419\u0420\u041E-\u0413\u041E\u041B\u041E\u0421 ]",
    voiceStatusReady: "\u0404\u0432\u0430 (FrontEnd) \u0442\u0430 \u0410\u0434\u0430\u043C (BackEnd) \u043D\u0430 \u0437\u0432\u2019\u044F\u0437\u043A\u0443 * Web Speech API \u0433\u043E\u0442\u043E\u0432\u0438\u0439",
    voiceStatusListening: "\u0420\u043E\u0437\u043F\u0456\u0437\u043D\u0430\u0432\u0430\u043D\u043D\u044F \u0433\u043E\u043B\u043E\u0441\u0443 \u0430\u043A\u0442\u0438\u0432\u043D\u0435... \u0413\u043E\u0432\u043E\u0440\u0456\u0442\u044C \u0443 \u043C\u0456\u043A\u0440\u043E\u0444\u043E\u043D.",
    voiceStatusSpeaking: "\u041D\u0435\u0439\u0440\u043E\u043D\u043D\u0438\u0439 \u0441\u0438\u043D\u0442\u0435\u0437 \u0433\u043E\u043B\u043E\u0441\u0443 \u0430\u043A\u0442\u0438\u0432\u043D\u0438\u0439 * \u0412\u0456\u0434\u0442\u0432\u043E\u0440\u0435\u043D\u043D\u044F \u0430\u0443\u0434\u0456\u043E.",
    personaEvaLabel: "[F] \u0404\u0412\u0410 [\u0413\u043E\u043B\u043E\u0432\u043D\u0438\u0439 FrontEnd & UX \u0410\u0440\u0445\u0456\u0442\u0435\u043A\u0442\u043E\u0440]",
    personaAdamLabel: "[M] \u0410\u0414\u0410\u041C [\u0413\u043E\u043B\u043E\u0432\u043D\u0438\u0439 BackEnd & Cloud \u0410\u0440\u0445\u0456\u0442\u0435\u043A\u0442\u043E\u0440]",
    personaDualLabel: "[DUAL] \u0404\u0412\u0410 & \u0410\u0414\u0410\u041C [\u0422\u0430\u043D\u0434\u0435\u043C Full-Stack \u041A\u043E-\u041F\u0456\u043B\u043E\u0442\u0456\u0432]",
    modeChatLabel: "\u0427\u0410\u0422 // \u041F\u0440\u044F\u043C\u0438\u0439 \u0434\u0456\u0430\u043B\u043E\u0433 \u0437 \u043C\u043E\u0434\u0435\u043B\u043B\u044E",
    modeDialogLabel: "\u0414\u0406\u0410\u041B\u041E\u0413 // \u0414\u0432\u043E\u0441\u0442\u043E\u0440\u043E\u043D\u043D\u0456 \u0434\u0435\u0431\u0430\u0442\u0438 (\u0404\u0432\u0430 \u043F\u0440\u043E\u0442\u0438 \u0410\u0434\u0430\u043C\u0430)",
    modeInterviewLabel: "\u0406\u041D\u0422\u0415\u0420\u0412'\u042E // \u0421\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u043E\u0432\u0430\u043D\u0430 \u0441\u043F\u0456\u0432\u0431\u0435\u0441\u0456\u0434\u0430 \u0442\u0430 \u043E\u0446\u0456\u043D\u044E\u0432\u0430\u043D\u043D\u044F",
    modeConsiliumLabel: "\u041A\u041E\u041D\u0421\u0418\u041B\u0406\u0423\u041C // \u0411\u0430\u0433\u0430\u0442\u043E\u0430\u0433\u0435\u043D\u0442\u043D\u0430 \u0440\u0430\u0434\u0430 \u0434\u0438\u0440\u0435\u043A\u0442\u043E\u0440\u0456\u0432",
    badgeFree: "[\u0411\u0415\u0417\u041A\u041E\u0428\u0422\u041E\u0412\u041D\u041E] 100% \u041A\u0412\u041E\u0422\u0410",
    badgePaid: "[\u041F\u041B\u0410\u0422\u041D\u041E] PAYG",
    noticePersonaSwitched: "\u0410\u043A\u0442\u0438\u0432\u043D\u0443 \u043F\u0435\u0440\u0441\u043E\u043D\u0443 \u0437\u043C\u0456\u043D\u0435\u043D\u043E \u043D\u0430",
    noticeModeSwitched: "\u0420\u0435\u0436\u0438\u043C \u0440\u043E\u0431\u043E\u0442\u0438 \u0437\u043C\u0456\u043D\u0435\u043D\u043E \u043D\u0430",
    noticeModelSwitched: "\u041D\u0435\u0439\u0440\u043E\u043D\u043D\u0443 \u043C\u043E\u0434\u0435\u043B\u044C \u043F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0435\u043D\u043E \u043D\u0430",
    noticeDbSwitched: "\u0411\u0430\u0437\u0443 \u0437\u043D\u0430\u043D\u044C \u0442\u0430 \u0434\u0430\u043D\u0438\u0445 \u043F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0435\u043D\u043E \u043D\u0430",
    noticeRoleSwitched: "\u0410\u043A\u0442\u0438\u0432\u043E\u0432\u0430\u043D\u043E \u043F\u0440\u043E\u0444\u0435\u0441\u0456\u0439\u043D\u0443 \u0440\u043E\u043B\u044C:",
    noticeKeySaved: "\u0412\u043B\u0430\u0441\u043D\u0438\u0439 Google API \u043A\u043B\u044E\u0447 \u0443\u0441\u043F\u0456\u0448\u043D\u043E \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043E \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0456.",
    noticeKeyCleared: "\u041F\u043E\u0432\u0435\u0440\u043D\u0443\u0442\u043E \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u0443 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0456\u044E Google Cloud.",
    noticeChatCleared: "\u0406\u0441\u0442\u043E\u0440\u0456\u044E \u0442\u0435\u0440\u043C\u0456\u043D\u0430\u043B\u0430 \u043E\u0447\u0438\u0449\u0435\u043D\u043E.",
    copiedBtn: "\u0421\u041A\u041E\u041F\u0406\u0419\u041E\u0412\u0410\u041D\u041E",
    copyBtn: "\u041A\u041E\u041F\u0406\u042E\u0412\u0410\u0422\u0418"
  },
  ru: {
    appTitle: "EVABOT // \u041A\u0418\u0411\u0415\u0420-\u0422\u0415\u0420\u041C\u0418\u041D\u0410\u041B \u0418 \u041D\u0415\u0419\u0420\u041E-\u0413\u041E\u041B\u041E\u0421\u041E\u0412\u041E\u0419 \u0425\u0410\u0411",
    statusOnline: "\u0412 \u0421\u0415\u0422\u0418",
    statusBusy: "\u0413\u0415\u041D\u0415\u0420\u0410\u0426\u0418\u042F",
    statusError: "\u041E\u0428\u0418\u0411\u041A\u0410",
    returnTerminalBtn: "[ \u2191 \u0412\u0415\u0420\u041D\u0423\u0422\u042C\u0421\u042F \u0412 \u0422\u0415\u0420\u041C\u0418\u041D\u0410\u041B ]",
    clearChatBtn: "[ \u041E\u0427\u0418\u0421\u0422\u0418\u0422\u042C ]",
    transmitBtn: "[ \u041E\u0422\u041F\u0420\u0410\u0412\u0418\u0422\u042C \u21B5 ]",
    stopBtn: "[ \u041E\u0421\u0422\u0410\u041D\u041E\u0412\u0418\u0422\u042C ! ]",
    inputPlaceholder: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0437\u0430\u043F\u0440\u043E\u0441 \u0438\u043B\u0438 \u043A\u043E\u043C\u0430\u043D\u0434\u0443 (\u043D\u0430\u043F\u0440. /help, /persona, /mode, /models, /db)...",
    welcomeHeading: "\u041D\u0415\u0419\u0420\u041E\u041D\u041D\u042B\u0419 \u041A\u0418\u0411\u0415\u0420-\u0422\u0415\u0420\u041C\u0418\u041D\u0410\u041B EVABOT // \u0421\u0418\u0421\u0422\u0415\u041C\u0410 \u0418\u041D\u0418\u0426\u0418\u0410\u041B\u0418\u0417\u0418\u0420\u041E\u0412\u0410\u041D\u0410",
    welcomeNotice: "\u0421\u0435\u0441\u0441\u0438\u044F \u0430\u043A\u0442\u0438\u0432\u043D\u0430. \u041C\u043E\u043D\u043E\u0445\u0440\u043E\u043C\u043D\u044B\u0439 \u043A\u0438\u0431\u0435\u0440-\u0442\u0435\u0440\u043C\u0438\u043D\u0430\u043B \u0433\u043E\u0442\u043E\u0432 \u043A \u0440\u0430\u0431\u043E\u0442\u0435. \u0411\u0430\u0437\u0438\u0440\u0443\u0435\u0442\u0441\u044F \u0432 \u041E\u0434\u0435\u0441\u0441\u0435, \u0423\u043A\u0440\u0430\u0438\u043D\u0430 (UA). \u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u043E \u043A \u0438\u043D\u0444\u0440\u0430\u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0435 Google Cloud \u0441 Zero-Trust \u0430\u0443\u0442\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0446\u0438\u0435\u0439.",
    voiceTapToSpeak: "\u041D\u0410\u0416\u041C\u0418\u0422\u0415 \u0414\u041B\u042F \u0413\u041E\u041B\u041E\u0421\u0410",
    voiceListening: "\u0421\u041B\u0423\u0428\u0410\u042E...",
    voiceSpeaking: "\u041D\u0415\u0419\u0420\u041E-\u0413\u041E\u041B\u041E\u0421",
    voiceSublabel: "[ \u0416\u0418\u0412\u041E\u0419 \u041D\u0415\u0419\u0420\u041E-\u0413\u041E\u041B\u041E\u0421 ]",
    voiceStatusReady: "\u0415\u0432\u0430 (FrontEnd) \u0438 \u0410\u0434\u0430\u043C (BackEnd) \u043D\u0430 \u0441\u0432\u044F\u0437\u0438 * Web Speech API \u0433\u043E\u0442\u043E\u0432",
    voiceStatusListening: "\u0420\u0430\u0441\u043F\u043E\u0437\u043D\u0430\u0432\u0430\u043D\u0438\u0435 \u0440\u0435\u0447\u0438 \u0430\u043A\u0442\u0438\u0432\u043D\u043E... \u0413\u043E\u0432\u043E\u0440\u0438\u0442\u0435 \u0432 \u043C\u0438\u043A\u0440\u043E\u0444\u043E\u043D.",
    voiceStatusSpeaking: "\u041D\u0435\u0439\u0440\u043E\u043D\u043D\u044B\u0439 \u0441\u0438\u043D\u0442\u0435\u0437 \u0440\u0435\u0447\u0438 \u0430\u043A\u0442\u0438\u0432\u0435\u043D * \u041F\u0435\u0440\u0435\u0434\u0430\u0447\u0430 \u0430\u0443\u0434\u0438\u043E-\u043E\u0442\u0432\u0435\u0442\u0430.",
    personaEvaLabel: "[F] \u0415\u0412\u0410 [\u0413\u043B\u0430\u0432\u043D\u044B\u0439 FrontEnd & UX \u0410\u0440\u0445\u0438\u0442\u0435\u043A\u0442\u043E\u0440]",
    personaAdamLabel: "[M] \u0410\u0414\u0410\u041C [\u0413\u043B\u0430\u0432\u043D\u044B\u0439 BackEnd & Cloud \u0410\u0440\u0445\u0438\u0442\u0435\u043A\u0442\u043E\u0440]",
    personaDualLabel: "[DUAL] \u0415\u0412\u0410 & \u0410\u0414\u0410\u041C [\u0422\u0430\u043D\u0434\u0435\u043C Full-Stack \u041A\u043E-\u041F\u0438\u043B\u043E\u0442\u043E\u0432]",
    modeChatLabel: "\u0427\u0410\u0422 // \u041F\u0440\u044F\u043C\u043E\u0439 \u0434\u0438\u0430\u043B\u043E\u0433 \u0441 \u043C\u043E\u0434\u0435\u043B\u044C\u044E",
    modeDialogLabel: "\u0414\u0418\u0410\u041B\u041E\u0413 // \u0414\u0432\u0443\u0441\u0442\u043E\u0440\u043E\u043D\u043D\u0438\u0435 \u0434\u0435\u0431\u0430\u0442\u044B (\u0415\u0432\u0430 \u043F\u0440\u043E\u0442\u0438\u0432 \u0410\u0434\u0430\u043C\u0430)",
    modeInterviewLabel: "\u0418\u041D\u0422\u0415\u0420\u0412\u042C\u042E // \u0421\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u043E\u0435 \u0441\u043E\u0431\u0435\u0441\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u0435 \u0438 \u0441\u043A\u043E\u0440\u0438\u043D\u0433",
    modeConsiliumLabel: "\u041A\u041E\u041D\u0421\u0418\u041B\u0418\u0423\u041C // \u041C\u043D\u043E\u0433\u043E\u0430\u0433\u0435\u043D\u0442\u043D\u044B\u0439 \u0441\u043E\u0432\u0435\u0442 \u0434\u0438\u0440\u0435\u043A\u0442\u043E\u0440\u043E\u0432",
    badgeFree: "[\u0411\u0415\u0421\u041F\u041B\u0410\u0422\u041D\u041E] 100% \u041A\u0412\u041E\u0422\u0410",
    badgePaid: "[\u041F\u041B\u0410\u0422\u041D\u041E] PAYG",
    noticePersonaSwitched: "\u0410\u043A\u0442\u0438\u0432\u043D\u0430\u044F \u043F\u0435\u0440\u0441\u043E\u043D\u0430 \u043F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0435\u043D\u0430 \u043D\u0430",
    noticeModeSwitched: "\u0420\u0435\u0436\u0438\u043C \u0440\u0430\u0431\u043E\u0442\u044B \u043F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0435\u043D \u043D\u0430",
    noticeModelSwitched: "\u041D\u0435\u0439\u0440\u043E\u043D\u043D\u0430\u044F \u043C\u043E\u0434\u0435\u043B\u044C \u043F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0435\u043D\u0430 \u043D\u0430",
    noticeDbSwitched: "\u0411\u0430\u0437\u0430 \u0437\u043D\u0430\u043D\u0438\u0439 \u0438 \u0411\u0414 \u043F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0435\u043D\u0430 \u043D\u0430",
    noticeRoleSwitched: "\u0410\u043A\u0442\u0438\u0432\u0438\u0440\u043E\u0432\u0430\u043D\u0430 \u043A\u043E\u0440\u043F\u043E\u0440\u0430\u0442\u0438\u0432\u043D\u0430\u044F \u0440\u043E\u043B\u044C:",
    noticeKeySaved: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0439 Google API \u043A\u043B\u044E\u0447 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435.",
    noticeKeyCleared: "\u0412\u043E\u0437\u0432\u0440\u0430\u0449\u0435\u043D\u0430 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u044F Google Cloud.",
    noticeChatCleared: "\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u0442\u0435\u0440\u043C\u0438\u043D\u0430\u043B\u0430 \u043E\u0447\u0438\u0449\u0435\u043D\u0430.",
    copiedBtn: "\u0421\u041A\u041E\u041F\u0418\u0420\u041E\u0412\u0410\u041D\u041E",
    copyBtn: "\u041A\u041E\u041F\u0418\u0420\u041E\u0412\u0410\u0422\u042C"
  }
};
var EvaBotWebApp = class {
  messages = [];
  currentLang = "en";
  currentPersona = "dual";
  currentMode = "chat";
  currentModel = "gemini-2.5-flash";
  currentDb = "hybrid";
  customDbUri = "";
  currentRole = "eva_frontend";
  consiliumCount = 5;
  consiliumPreset = null;
  isGenerating = false;
  abortController = null;
  serverUptimeSec = 0;
  serverMemoryMb = 32;
  lastLatencyMs = 4;
  sessionTotalTokens = 0;
  sessionTotalCostUSD = 0;
  sessionTotalCostEUR = 0;
  authSource = "Google Cloud Ambient";
  userAccount = "evabot.online@gmail.com";
  uptimeInterval = null;
  // Voice Engine State
  isRecording = false;
  speechRecognition = null;
  isSpeaking = false;
  voiceDockUI = null;
  constructor() {
    this.init();
  }
  async init() {
    const savedLang = localStorage.getItem("evabot_lang");
    if (savedLang && (savedLang === "en" || savedLang === "uk" || savedLang === "ru")) {
      this.currentLang = savedLang;
    }
    const savedPersona = localStorage.getItem("evabot_persona");
    if (savedPersona && (savedPersona === "eva" || savedPersona === "adam" || savedPersona === "dual")) {
      this.currentPersona = savedPersona;
    }
    const savedMode = localStorage.getItem("evabot_mode");
    if (savedMode && (savedMode === "chat" || savedMode === "dialog" || savedMode === "interview" || savedMode === "consilium")) {
      this.currentMode = savedMode;
    }
    this.setupEventListeners();
    this.setupVoiceEngine();
    this.populateModelSelector();
    this.applyLanguage();
    this.updatePersonaUI();
    this.updateModeUI();
    this.updateDbUI();
    this.updateRoleUI();
    this.updateModelDetailsUI();
    this.updateKeyStatusUI();
    this.startTelemetryLoop();
    this.voiceDockUI = new VoiceDockUI();
    this.voiceDockUI.init().catch((e) => console.warn("[App] VoiceDockUI init warning:", e));
    await this.checkHealth();
    await this.renderStartupSequence();
  }
  t() {
    return TRANSLATIONS[this.currentLang];
  }
  setLanguage(lang) {
    if (lang === this.currentLang) return;
    this.currentLang = lang;
    localStorage.setItem("evabot_lang", lang);
    this.applyLanguage();
    this.updatePersonaUI();
    this.updateModeUI();
    this.updateModelDetailsUI();
    this.updateKeyStatusUI();
    this.updateTelemetryUI();
    if (this.messages.length <= 2) {
      this.messages = [];
      const container = document.getElementById("messages-container");
      if (container) container.innerHTML = "";
      this.renderStartupSequence();
    }
  }
  applyLanguage() {
    const t = this.t();
    ["en", "uk", "ru"].forEach((l) => {
      const btn = document.getElementById(`lang-btn-${l}`);
      if (btn) {
        btn.className = l === this.currentLang ? "lang-btn active" : "lang-btn";
      }
    });
    document.title = `${t.appTitle} // [${this.currentPersona.toUpperCase()}]`;
    const input = document.getElementById("user-input");
    if (input) {
      input.placeholder = t.inputPlaceholder;
    }
    const orbLabel = document.getElementById("orb-label");
    if (orbLabel && !this.isRecording && !this.isSpeaking) {
      orbLabel.textContent = t.voiceTapToSpeak;
    }
    const orbSublabel = document.getElementById("orb-sublabel");
    if (orbSublabel && !this.isRecording && !this.isSpeaking) {
      orbSublabel.textContent = t.voiceSublabel;
    }
    const voiceFeedback = document.getElementById("voice-status-feedback");
    if (voiceFeedback && !this.isRecording && !this.isSpeaking) {
      voiceFeedback.textContent = t.voiceStatusReady;
    }
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
    document.getElementById("header-persona-pill")?.addEventListener("click", () => {
      const cycle = {
        eva: "adam",
        adam: "dual",
        dual: "eva"
      };
      this.setPersona(cycle[this.currentPersona]);
    });
    document.querySelectorAll("#persona-selector-group [data-persona]").forEach((el) => {
      el.addEventListener("click", () => {
        const p = el.getAttribute("data-persona");
        if (p) this.setPersona(p);
      });
    });
    document.querySelectorAll("#mode-selector-group [data-mode]").forEach((el) => {
      el.addEventListener("click", () => {
        const m = el.getAttribute("data-mode");
        if (m) this.setMode(m);
      });
    });
    const consiliumSlider = document.getElementById("deck-consilium-count");
    const consiliumVal = document.getElementById("consilium-count-val");
    consiliumSlider?.addEventListener("input", (e) => {
      const val = parseInt(e.target.value, 10) || 5;
      this.consiliumCount = val;
      if (consiliumVal) consiliumVal.textContent = String(val);
      this.consiliumPreset = null;
      this.updatePresetButtonsUI();
    });
    document.getElementById("btn-preset-top10-paid")?.addEventListener("click", () => {
      this.consiliumPreset = "top10_paid";
      this.consiliumCount = 10;
      if (consiliumSlider) consiliumSlider.value = "10";
      if (consiliumVal) consiliumVal.textContent = "10";
      this.updatePresetButtonsUI();
      this.addSystemNotification("[*] Preset activated: **Top-10 Smartest Paid Models** (10 participants)");
    });
    document.getElementById("btn-preset-top10-free")?.addEventListener("click", () => {
      this.consiliumPreset = "top10_free";
      this.consiliumCount = 10;
      if (consiliumSlider) consiliumSlider.value = "10";
      if (consiliumVal) consiliumVal.textContent = "10";
      this.updatePresetButtonsUI();
      this.addSystemNotification("[*] Preset activated: **Top-10 Free Quota Models** (10 participants)");
    });
    document.querySelectorAll("#db-selector-group [data-db]").forEach((el) => {
      el.addEventListener("click", () => {
        const db = el.getAttribute("data-db");
        if (db) this.setDb(db);
      });
    });
    const customDbInput = document.getElementById("custom-db-uri-input");
    customDbInput?.addEventListener("change", () => {
      this.customDbUri = customDbInput.value.trim();
      if (this.customDbUri) {
        this.addSystemNotification(`Custom Company Database connected: \`${this.customDbUri.replace(/:[^:@]+@/, ":****@")}\``);
      }
    });
    document.querySelectorAll("#roles-selector-group [data-role]").forEach((el) => {
      el.addEventListener("click", () => {
        const role = el.getAttribute("data-role");
        if (role) this.setRole(role);
      });
    });
    const modelSelect = document.getElementById("deck-model-select");
    modelSelect?.addEventListener("change", (e) => {
      this.currentModel = e.target.value;
      this.updateModelDetailsUI();
      const m = ModelRegistry.getModelById(this.currentModel);
      this.addSystemNotification(`${this.t().noticeModelSwitched} **${m?.name || this.currentModel}**`);
    });
    document.getElementById("header-model-pill")?.addEventListener("click", () => {
      deckSection?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    const saveKeyBtn = document.getElementById("deck-save-key-btn");
    const clearKeyBtn = document.getElementById("deck-clear-key-btn");
    const apiKeyInput = document.getElementById("deck-api-key-input");
    saveKeyBtn?.addEventListener("click", () => {
      const val = apiKeyInput?.value.trim() || "";
      if (val) {
        localStorage.setItem("evabot_gemini_key", val);
        this.voiceDockUI?.setApiKey(val);
        this.addSystemNotification(this.t().noticeKeySaved);
      }
      this.updateKeyStatusUI();
    });
    clearKeyBtn?.addEventListener("click", () => {
      localStorage.removeItem("evabot_gemini_key");
      this.voiceDockUI?.setApiKey("");
      if (apiKeyInput) apiKeyInput.value = "";
      this.addSystemNotification(this.t().noticeKeyCleared);
      this.updateKeyStatusUI();
    });
    document.getElementById("clear-btn")?.addEventListener("click", () => {
      this.messages = [];
      const container = document.getElementById("messages-container");
      if (container) container.innerHTML = "";
      this.renderStatusBarOnly();
      this.addSystemNotification(this.t().noticeChatCleared);
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
    document.getElementById("voice-orb")?.addEventListener("click", () => {
      this.toggleVoiceRecording();
    });
  }
  // ===========================================================================
  // VOICE ENGINE (Speech Recognition & Speech Synthesis)
  // ===========================================================================
  setupVoiceEngine() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      const feedback = document.getElementById("voice-status-feedback");
      if (feedback) feedback.textContent = "Web Speech API not supported in this browser. (Use Chrome/Edge or type prompts)";
      return;
    }
    try {
      this.speechRecognition = new SpeechRecognition();
      this.speechRecognition.continuous = false;
      this.speechRecognition.interimResults = true;
      this.speechRecognition.maxAlternatives = 1;
      this.speechRecognition.onstart = () => {
        this.isRecording = true;
        const orb = document.getElementById("voice-orb");
        const orbIcon = document.getElementById("orb-icon");
        const orbLabel = document.getElementById("orb-label");
        const orbSublabel = document.getElementById("orb-sublabel");
        const feedback = document.getElementById("voice-status-feedback");
        if (orb) orb.classList.add("listening");
        if (orbIcon) orbIcon.textContent = "[REC]";
        if (orbLabel) orbLabel.textContent = this.t().voiceListening;
        if (orbSublabel) orbSublabel.textContent = "[ LISTENING... ]";
        if (feedback) feedback.textContent = this.t().voiceStatusListening;
      };
      this.speechRecognition.onresult = (event) => {
        let interim = "";
        let final = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        const transcript = final || interim;
        const input = document.getElementById("user-input");
        if (input && transcript) {
          input.value = transcript;
        }
        if (final && final.trim()) {
          this.stopVoiceRecording();
          setTimeout(() => {
            this.handleSend();
          }, 300);
        }
      };
      this.speechRecognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        this.stopVoiceRecording();
      };
      this.speechRecognition.onend = () => {
        this.stopVoiceRecording();
      };
    } catch (e) {
      console.warn("SpeechRecognition initialization error:", e);
    }
  }
  toggleVoiceRecording() {
    if (this.isRecording) {
      this.stopVoiceRecording();
    } else {
      this.startVoiceRecording();
    }
  }
  startVoiceRecording() {
    if (!this.speechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your prompt in the command line.");
      return;
    }
    try {
      const langCode = this.currentLang === "uk" ? "uk-UA" : this.currentLang === "ru" ? "ru-RU" : "en-US";
      this.speechRecognition.lang = langCode;
      this.speechRecognition.start();
    } catch (e) {
      console.warn("Failed to start speech recognition:", e);
      this.stopVoiceRecording();
    }
  }
  stopVoiceRecording() {
    this.isRecording = false;
    try {
      this.speechRecognition?.stop();
    } catch {
    }
    const orb = document.getElementById("voice-orb");
    const orbIcon = document.getElementById("orb-icon");
    const orbLabel = document.getElementById("orb-label");
    const orbSublabel = document.getElementById("orb-sublabel");
    const feedback = document.getElementById("voice-status-feedback");
    if (orb) orb.classList.remove("listening");
    if (orbIcon) orbIcon.textContent = "[MIC]";
    if (orbLabel) orbLabel.textContent = this.t().voiceTapToSpeak;
    if (orbSublabel) orbSublabel.textContent = this.t().voiceSublabel;
    if (feedback) feedback.textContent = this.t().voiceStatusReady;
  }
  speakVoiceResponse(text, persona) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/```[\s\S]*?```/g, " [Code omitted] ").replace(/`([^`]+)`/g, "$1").replace(/[*_#~>|┌┐└┘├┤─│═]+/g, " ").replace(/https?:\/\/\S+/g, " ").replace(/\s+/g, " ").trim();
    if (!cleanText) return;
    const spokenSlice = cleanText.length > 350 ? `${cleanText.slice(0, 350)}...` : cleanText;
    const utterance = new SpeechSynthesisUtterance(spokenSlice);
    const langCode = this.currentLang === "uk" ? "uk-UA" : this.currentLang === "ru" ? "ru-RU" : "en-US";
    utterance.lang = langCode;
    if (persona === "eva") {
      utterance.pitch = 1.2;
      utterance.rate = 1.05;
    } else if (persona === "adam") {
      utterance.pitch = 0.85;
      utterance.rate = 0.95;
    } else {
      utterance.pitch = 1;
      utterance.rate = 1;
    }
    const orb = document.getElementById("voice-orb");
    const orbLabel = document.getElementById("orb-label");
    const feedback = document.getElementById("voice-status-feedback");
    utterance.onstart = () => {
      this.isSpeaking = true;
      if (orb) orb.classList.add("speaking");
      if (orbLabel) orbLabel.textContent = this.t().voiceSpeaking;
      if (feedback) feedback.textContent = this.t().voiceStatusSpeaking;
    };
    utterance.onend = () => {
      this.isSpeaking = false;
      if (orb) orb.classList.remove("speaking");
      if (orbLabel) orbLabel.textContent = this.t().voiceTapToSpeak;
      if (feedback) feedback.textContent = this.t().voiceStatusReady;
    };
    utterance.onerror = () => {
      this.isSpeaking = false;
      if (orb) orb.classList.remove("speaking");
      if (orbLabel) orbLabel.textContent = this.t().voiceTapToSpeak;
    };
    window.speechSynthesis.speak(utterance);
  }
  // ===========================================================================
  // PERSONA & MODE MANAGEMENT
  // ===========================================================================
  setPersona(persona) {
    this.currentPersona = persona;
    localStorage.setItem("evabot_persona", persona);
    this.updatePersonaUI();
    if (this.voiceDockUI) {
      this.voiceDockUI.setPersona(persona === "adam" ? "adam" : "eva");
    }
    const nameMap = {
      eva: "[F] EVA (Frontend & UX Director)",
      adam: "[M] ADAM (Chief Backend Architect)",
      dual: "[DUAL] EVA & ADAM (Full-Stack Co-Pilots)"
    };
    this.addSystemNotification(`${this.t().noticePersonaSwitched} **${nameMap[persona]}**`);
  }
  updatePersonaUI() {
    const t = this.t();
    const pill = document.getElementById("header-persona-name");
    if (pill) {
      if (this.currentPersona === "eva") pill.textContent = t.personaEvaLabel;
      else if (this.currentPersona === "adam") pill.textContent = t.personaAdamLabel;
      else pill.textContent = t.personaDualLabel;
    }
    document.querySelectorAll("#persona-selector-group [data-persona]").forEach((btn) => {
      const p = btn.getAttribute("data-persona");
      if (p === this.currentPersona) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
    this.updateTelemetryUI();
  }
  setMode(mode) {
    this.currentMode = mode;
    localStorage.setItem("evabot_mode", mode);
    this.updateModeUI();
    this.addSystemNotification(`${this.t().noticeModeSwitched} **${mode.toUpperCase()}**`);
  }
  updateModeUI() {
    const headerMode = document.getElementById("header-mode-badge");
    if (headerMode) headerMode.textContent = `MODE: ${this.currentMode.toUpperCase()}`;
    document.querySelectorAll("#mode-selector-group [data-mode]").forEach((btn) => {
      const m = btn.getAttribute("data-mode");
      if (m === this.currentMode) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
    this.updateTelemetryUI();
  }
  updatePresetButtonsUI() {
    const paidBtn = document.getElementById("btn-preset-top10-paid");
    const freeBtn = document.getElementById("btn-preset-top10-free");
    if (this.consiliumPreset === "top10_paid") {
      paidBtn?.classList.add("active");
      freeBtn?.classList.remove("active");
    } else if (this.consiliumPreset === "top10_free") {
      freeBtn?.classList.add("active");
      paidBtn?.classList.remove("active");
    } else {
      paidBtn?.classList.remove("active");
      freeBtn?.classList.remove("active");
    }
  }
  setDb(db) {
    this.currentDb = db;
    this.updateDbUI();
    this.addSystemNotification(`${this.t().noticeDbSwitched} **${db.toUpperCase()}**`);
  }
  updateDbUI() {
    document.querySelectorAll("#db-selector-group [data-db]").forEach((btn) => {
      const d = btn.getAttribute("data-db");
      if (d === this.currentDb) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
    const tickerDb = document.getElementById("ticker-db");
    if (tickerDb) {
      const labels = {
        hybrid: "HYBRID RAG",
        postgres: "POSTGRES",
        qdrant: "QDRANT VECTOR",
        ephemeral: "EPHEMERAL"
      };
      tickerDb.textContent = labels[this.currentDb];
    }
  }
  setRole(role) {
    this.currentRole = role;
    this.updateRoleUI();
    this.addSystemNotification(`${this.t().noticeRoleSwitched} **${role.toUpperCase()}**`);
  }
  updateRoleUI() {
    document.querySelectorAll("#roles-selector-group [data-role]").forEach((btn) => {
      const r = btn.getAttribute("data-role");
      if (r === this.currentRole) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }
  // ===========================================================================
  // MODEL SELECTOR & SPECIFICATIONS
  // ===========================================================================
  populateModelSelector() {
    const select = document.getElementById("deck-model-select");
    if (!select) return;
    select.innerHTML = "";
    const categories = ModelRegistry.getCategories();
    for (const cat of categories) {
      const models = ModelRegistry.getModelsByCategory(cat);
      if (!models || models.length === 0) continue;
      const group = document.createElement("optgroup");
      group.label = cat;
      for (const m of models) {
        const opt = document.createElement("option");
        opt.value = m.id;
        const isFree = m.pricing.freeTierStatus.includes("Free");
        opt.textContent = `${m.name} ${isFree ? "[FREE]" : "[PAID]"}`;
        if (m.id === this.currentModel) opt.selected = true;
        group.appendChild(opt);
      }
      select.appendChild(group);
    }
  }
  updateModelDetailsUI() {
    const m = ModelRegistry.getModelById(this.currentModel);
    if (!m) return;
    const isFree = m.pricing.freeTierStatus.includes("Free");
    const headerName = document.getElementById("header-model-name");
    if (headerName) headerName.textContent = m.name;
    const headerBadge = document.getElementById("header-model-badge");
    if (headerBadge) {
      headerBadge.textContent = isFree ? "[FREE]" : "[PAID]";
      headerBadge.style.color = isFree ? "var(--clr-green)" : "var(--clr-yellow)";
    }
    const tierBadge = document.getElementById("model-tier-badge");
    if (tierBadge) {
      tierBadge.textContent = isFree ? "\u{1F7E2} 100% FREE QUOTA ($0.00)" : "[PAID] PAID / PAYG";
      tierBadge.style.color = isFree ? "var(--clr-green)" : "var(--clr-yellow)";
    }
    const specUsd = document.getElementById("spec-usd");
    if (specUsd) specUsd.textContent = `In: ${m.pricing.inputPer1MTokensUSD} / Out: ${m.pricing.outputPer1MTokensUSD}`;
    const specEur = document.getElementById("spec-eur");
    if (specEur) specEur.textContent = `In: ${m.pricing.inputPer1MTokensEUR} / Out: ${m.pricing.outputPer1MTokensEUR}`;
    const specContext = document.getElementById("spec-context");
    if (specContext) specContext.textContent = `${m.contextWindow.toLocaleString()} tokens`;
  }
  updateKeyStatusUI() {
    const statusEl = document.getElementById("deck-key-status");
    const input = document.getElementById("deck-api-key-input");
    const customKey = localStorage.getItem("evabot_gemini_key") || "";
    if (input && !input.value) {
      input.value = customKey;
    }
    if (statusEl) {
      if (customKey) {
        statusEl.textContent = "[OK] CUSTOM KEY ACTIVE";
        statusEl.style.color = "var(--clr-green)";
      } else {
        statusEl.textContent = "[OK] GOOGLE AMBIENT AUTH";
        statusEl.style.color = "var(--clr-green)";
      }
    }
  }
  // ===========================================================================
  // REAL BOOT PROBE & TELEMETRY
  // ===========================================================================
  async checkHealth() {
    const t0 = performance.now();
    try {
      const res = await fetch("/api/health");
      this.lastLatencyMs = Math.round(performance.now() - t0);
      if (res.ok) {
        const data = await res.json();
        if (data.uptimeSeconds) this.serverUptimeSec = data.uptimeSeconds;
        if (data.memoryUsageMb) this.serverMemoryMb = data.memoryUsageMb;
        if (data.account) this.userAccount = data.account;
        if (data.authSource) this.authSource = data.authSource;
      }
    } catch {
      this.lastLatencyMs = 999;
    }
    this.updateTelemetryUI();
  }
  async fetchBootDiagnostics() {
    try {
      const res = await fetch(`/api/diagnostics/boot?model=${encodeURIComponent(this.currentModel)}`);
      if (res.ok) {
        const report = await res.json();
        const tickerMsg = document.getElementById("boot-ticker-msg");
        if (tickerMsg && report.steps) {
          tickerMsg.innerHTML = `
            <span style="color:var(--clr-green); font-weight:700;">[OK] INITIALIZED:</span>
            <span>All ${report.steps.length} Systems Healthy * Frankfurt [c3-std-8] & Iowa [e2-micro] Online (${report.totalDurationMs}ms)</span>
          `;
        }
      }
    } catch (e) {
      console.warn("Boot diagnostics skipped:", e);
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
    const tickerLat = document.getElementById("ticker-latency");
    if (tickerLat) tickerLat.textContent = `${this.lastLatencyMs}ms`;
    const tickerTokens = document.getElementById("ticker-tokens");
    if (tickerTokens) tickerTokens.textContent = this.sessionTotalTokens.toLocaleString();
    const tickerCost = document.getElementById("ticker-cost");
    if (tickerCost) tickerCost.textContent = `$${this.sessionTotalCostUSD.toFixed(4)} / \u20AC${this.sessionTotalCostEUR.toFixed(4)}`;
    const telemTokens = document.getElementById("telem-tokens");
    if (telemTokens) telemTokens.textContent = this.sessionTotalTokens.toLocaleString();
    const telemCost = document.getElementById("telem-cost");
    if (telemCost) telemCost.textContent = `$${this.sessionTotalCostUSD.toFixed(4)} / \u20AC${this.sessionTotalCostEUR.toFixed(4)}`;
  }
  // ===========================================================================
  // SCREEN TRANSITIONS & TERMINAL MESSAGES
  // ===========================================================================
  activateChatRegion() {
    const chatRegion = document.getElementById("chat-stream-region");
    if (chatRegion) chatRegion.style.display = "flex";
  }
  restoreVoiceHero() {
  }
  renderStatusBarOnly() {
    const m = ModelRegistry.getModelById(this.currentModel);
    const isFree = m?.pricing.freeTierStatus === "100% Free Quota Available";
    const tierBadge = isFree ? "[FREE]" : "[PAID]";
    const barText = `\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  EVABOT [ONLINE] \u2502 ${this.currentModel} [${tierBadge}] \u2502 ${this.currentMode.toUpperCase()} \u2502 [DUAL] EVA & ADAM
  Standards: USD ($) & EUR (\u20AC) \u2502 ${ModelRegistry.getAllModels().length} Models \u2502 /help for commands
\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500`;
    this.appendMessage({
      role: "system",
      text: barText,
      timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString()
    });
  }
  async renderStartupSequence() {
    const t = this.t();
    const m = ModelRegistry.getModelById(this.currentModel);
    const isFree = m?.pricing.freeTierStatus === "100% Free Quota Available";
    const tierBadge = isFree ? "[FREE]" : "[PAID]";
    const bootBanner = `\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502 [>>] EVABOT ONLINE v0.0.1 MVP // LINEAR CYBER-TERMINAL                       \u2502
\u2502 Base: Odesa, Ukraine (UA) \u2502 Zero-Trust Google Cloud Infrastructure           \u2502
\u2502 Hybrid Topology: Web Edge Gateway (Face) <\u2500\u2500\u2500> Agent Server (Brain)          \u2502
\u2502 Modes: CHAT, DIALOG, INTERVIEW, CONSILIUM \u2502 Pure ASCII Cyber-Stream          \u2502
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518

[BOOT DIAGNOSTICS] Probing dual-server infrastructure & model garden...`;
    this.appendMessage({
      role: "system",
      text: bootBanner,
      timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString()
    });
    try {
      const res = await fetch(`/api/diagnostics/boot?model=${encodeURIComponent(this.currentModel)}`);
      if (res.ok) {
        const report = await res.json();
        const tickerMsg = document.getElementById("boot-ticker-msg");
        if (tickerMsg && report.steps) {
          tickerMsg.innerHTML = `
            <span style="color:var(--clr-green); font-weight:700;">[OK] INITIALIZED:</span>
            <span>All ${report.steps.length} Systems Healthy * Frankfurt [c3-std-8] & Iowa [e2-micro] Online (${report.totalDurationMs}ms)</span>
          `;
        }
        let stepsText = "";
        for (const step of report.steps) {
          const icon = step.status === "success" ? "[OK]" : "[ERR]";
          stepsText += `  ${icon} ${step.name} (${step.latencyMs}ms)
     \u2514\u2500 ${step.details}
`;
        }
        stepsText += `
[OK] ALL DIAGNOSTIC CHECKS PASSED [Total: ${report.totalDurationMs}ms]
`;
        stepsText += `\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
`;
        stepsText += `  EVABOT [ONLINE] \u2502 ${this.currentModel} [${tierBadge}] \u2502 ${this.currentMode.toUpperCase()} \u2502 [DUAL] EVA & ADAM
`;
        stepsText += `  Standards: USD ($) & EUR (\u20AC) \u2502 ${ModelRegistry.getAllModels().length} Models \u2502 /help for commands
`;
        stepsText += `\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

`;
        stepsText += `evabot> ${t.welcomeNotice}`;
        this.appendMessage({
          role: "model",
          text: stepsText,
          timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
          metadata: {
            model: this.currentModel,
            persona: this.currentPersona,
            mode: this.currentMode
          }
        });
      }
    } catch (e) {
      console.warn("Boot diagnostics probe offline:", e);
    }
  }
  renderWelcomeMessage() {
    this.renderStartupSequence();
  }
  // ===========================================================================
  // SLASH COMMAND PARSER
  // ===========================================================================
  handleSlashCommand(input) {
    const trimmed = input.trim();
    if (!trimmed.startsWith("/")) return false;
    const [cmd, ...args] = trimmed.split(/\s+/);
    const argStr = args.join(" ").toLowerCase();
    if (cmd === "/help") {
      const helpTable = `| Command | Parameters | Description |
|---|---|---|
| \`/help\` | None | Display terminal commands and shortcuts |
| \`/persona\` | \`eva\` | \`adam\` | \`dual\` | Switch active Co-Pilot persona |
| \`/mode\` | \`chat\` | \`dialog\` | \`interview\` | \`consilium\` | Switch operational mode |
| \`/db\` | \`hybrid\` | \`postgres\` | \`qdrant\` | \`ephemeral\` | Route database knowledge base |
| \`/preset\` | \`top10_paid\` | \`top10_free\` | Activate Consilium multi-agent preset |
| \`/models\` | None | List top catalog models with pricing in USD ($) and EUR (\u20AC) |
| \`/menu\` | None | Open System Deck & Configuration (Screen 2) |
| \`/boot\` | None | Run live dual-cluster diagnostics probe |
| \`/clear\` | None | Purge terminal screen |`;
      this.appendMessage({
        role: "system",
        text: `### EVABOT ONLINE COMMAND PALETTE

${helpTable}`,
        timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString()
      });
      return true;
    }
    if (cmd === "/persona") {
      if (argStr === "eva" || argStr === "adam" || argStr === "dual") {
        this.setPersona(argStr);
      } else {
        this.addSystemNotification("Usage: `/persona <eva | adam | dual>`");
      }
      return true;
    }
    if (cmd === "/mode") {
      if (argStr === "chat" || argStr === "dialog" || argStr === "interview" || argStr === "consilium") {
        this.setMode(argStr);
      } else {
        this.addSystemNotification("Usage: `/mode <chat | dialog | interview | consilium>`");
      }
      return true;
    }
    if (cmd === "/db") {
      if (argStr === "hybrid" || argStr === "postgres" || argStr === "qdrant" || argStr === "ephemeral") {
        this.setDb(argStr);
      } else {
        this.addSystemNotification("Usage: `/db <hybrid | postgres | qdrant | ephemeral>`");
      }
      return true;
    }
    if (cmd === "/preset") {
      if (argStr === "top10_paid") {
        document.getElementById("btn-preset-top10-paid")?.click();
      } else if (argStr === "top10_free") {
        document.getElementById("btn-preset-top10-free")?.click();
      } else {
        this.addSystemNotification("Usage: `/preset <top10_paid | top10_free>`");
      }
      return true;
    }
    if (cmd === "/models") {
      const topPaid = ModelRegistry.getTop10PaidSmartestModels();
      const topFree = ModelRegistry.getTop10FreeModels();
      let out = "### TOP-10 SMARTEST MODELS (PAID/PAYG)\n\n";
      out += "| Model | Provider | Input (USD) | Output (USD) | Input (EUR) | Output (EUR) |\n|---|---|---|---|---|---|\n";
      topPaid.forEach((m) => {
        out += `| \`${m.id}\` | ${m.provider} | ${m.pricing.inputPer1MTokensUSD} | ${m.pricing.outputPer1MTokensUSD} | ${m.pricing.inputPer1MTokensEUR} | ${m.pricing.outputPer1MTokensEUR} |
`;
      });
      out += "\n### TOP-10 FREE QUOTA MODELS\n\n";
      out += "| Model | Provider | Context | Free Quota Status |\n|---|---|---|---|\n";
      topFree.forEach((m) => {
        out += `| \`${m.id}\` | ${m.provider} | ${m.contextWindow.toLocaleString()} tokens | ${m.pricing.freeTierDetails} |
`;
      });
      this.appendMessage({
        role: "system",
        text: out,
        timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString()
      });
      return true;
    }
    if (cmd === "/menu") {
      document.getElementById("screen-control-deck")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return true;
    }
    if (cmd === "/boot") {
      this.renderStartupSequence();
      return true;
    }
    if (cmd === "/clear") {
      this.messages = [];
      const container = document.getElementById("messages-container");
      if (container) container.innerHTML = "";
      this.renderStatusBarOnly();
      this.addSystemNotification(this.t().noticeChatCleared);
      return true;
    }
    return false;
  }
  // ===========================================================================
  // TRANSMISSION & GENERATION ENGINE
  // ===========================================================================
  buildSystemInstruction() {
    const personaDirectives = {
      eva: "You are Eva, the Lead Frontend Architect and UX Director of EvaLine. You specialize in client-side architecture, high-contrast cyber-terminal aesthetics, Web Speech integration, responsive layout ergonomics, and strategic design systems. Speak with authority, elegance, and sharp strategic perspective.",
      adam: "You are Adam, the Chief Backend Architect and Cloud Systems Lead of EvaLine. You engineer distributed computing clusters, high-throughput microservices, PostgreSQL pipelines, Zero-Trust security, and OmniRoute load balancers. Prioritize strict algorithmic rigor, low-level efficiency, and zero-compromise stability.",
      dual: "You represent Eva (Lead Frontend Architect) and Adam (Chief Backend Architect) operating in perfect full-stack synergy. Provide a cohesive perspective: Eva addresses user experience, ergonomics, and frontend flow, while Adam reinforces backend scalability, database schema, and distributed resilience."
    };
    const roleDirective = `Specialized Focus Role: ${this.currentRole.toUpperCase()}.`;
    const langDirective = this.currentLang === "uk" ? "Respond strictly in Ukrainian (\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430). Maintain technical precision, clean cyber-terminal formatting." : this.currentLang === "ru" ? "Respond strictly in Russian. Maintain technical precision, clean cyber-terminal formatting." : "Respond strictly in English. Maintain technical precision, clean cyber-terminal formatting.";
    const locationPolicy = " EvaBot Online is based in Odesa, Ukraine (UA). Financial calculations, cloud compute costs, and pricing are strictly denominated in USD ($) or EUR (\u20AC). Never mention Russia, Russian regional entities, products, brands, or Russian currency.";
    return `${personaDirectives[this.currentPersona]}

${roleDirective}

${langDirective}

${locationPolicy}

Format your responses with clean monospace cyber-terminal markdown, tables, and clean code blocks.`;
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
    if (this.handleSlashCommand(text)) {
      this.activateChatRegion();
      return;
    }
    this.activateChatRegion();
    const now = (/* @__PURE__ */ new Date()).toLocaleTimeString();
    this.appendMessage({
      role: "user",
      text,
      timestamp: now,
      metadata: {
        mode: this.currentMode,
        persona: this.currentPersona
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
      if (this.currentMode === "chat") {
        const historyPayload = this.messages.filter((m) => m.role === "user" || m.role === "model").slice(-10).map((m) => ({
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
        let usageInfo = null;
        let costInfo = null;
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
                if (data.usage) usageInfo = data.usage;
                if (data.cost) costInfo = data.cost;
              } catch {
              }
            }
          }
        }
        const pTok = usageInfo?.promptTokens ?? ModelRegistry.estimateTokens(text);
        const cTok = usageInfo?.completionTokens ?? ModelRegistry.estimateTokens(accumulatedText);
        const cst = costInfo ?? ModelRegistry.calculateCost(this.currentModel, pTok, cTok);
        this.sessionTotalTokens += pTok + cTok;
        this.sessionTotalCostUSD += cst.costUSD;
        this.sessionTotalCostEUR += cst.costEUR;
        this.updateTelemetryUI();
        const auditBox = `

\`\`\`text
\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502 [MODEL] ${cst.modelName || this.currentModel} [${cst.isFreeTier ? "FREE QUOTA" : "PAID"}]
\u2502 [TOKENS] In: ${pTok.toLocaleString()} + Out: ${cTok.toLocaleString()} = ${(pTok + cTok).toLocaleString()} Total
\u2502 [COST] ${cst.formattedUSD} \u2502 ${cst.formattedEUR}${cst.isFreeTier ? ` (Val: $${cst.commercialValueUSD.toFixed(6)} USD / \u20AC${cst.commercialValueEUR.toFixed(6)} EUR)` : ""}
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
\`\`\``;
        accumulatedText += auditBox;
        textSpan.innerHTML = this.renderMarkdown(accumulatedText);
        this.messages.push({
          role: "model",
          text: accumulatedText,
          timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
          metadata: {
            model: this.currentModel,
            mode: this.currentMode,
            persona: this.currentPersona
          }
        });
        this.speakVoiceResponse(accumulatedText, this.currentPersona);
      } else {
        const t0 = performance.now();
        textSpan.innerHTML = '<span style="color:var(--clr-yellow); font-family:var(--font-mono);">[>>] Multi-Agent Engine Deliberating... Synchronizing participants & models...</span>';
        const response = await fetch("/api/consilium", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: text,
            mode: this.currentMode,
            persona: this.currentPersona,
            preset: this.consiliumPreset || void 0,
            participants: this.consiliumCount,
            apiKey: customKey || void 0,
            useKnowledgeBase: true
          }),
          signal: this.abortController.signal
        });
        this.lastLatencyMs = Math.round(performance.now() - t0);
        this.updateTelemetryUI();
        if (!response.ok) {
          const errJson = await response.json().catch(() => ({ error: "Consilium execution failed" }));
          throw new Error(errJson.error || `HTTP ${response.status}`);
        }
        const data = await response.json();
        const res = data.result;
        let outputMarkdown = "";
        if (res.consensus) {
          outputMarkdown += `### [*] EXECUTIVE CONSENSUS

${res.consensus}

`;
        }
        if (res.interviewResult) {
          const ir = res.interviewResult;
          outputMarkdown += `### [*] INTERVIEW ASSESSMENT // SCORE: ${ir.score}/100

`;
          outputMarkdown += `**Rating:** ${ir.rating}

`;
          outputMarkdown += `**Executive Feedback:**
${ir.feedback}

`;
          if (ir.nextQuestion) {
            outputMarkdown += `**Next Probing Question:**
> ${ir.nextQuestion}

`;
          }
        }
        if (res.turns && res.turns.length > 0) {
          outputMarkdown += "### [*] PARTICIPANT DELIBERATIONS\n\n";
          res.turns.forEach((turn) => {
            const turnName = turn.name || turn.participantName || "Agent";
            const turnModel = turn.model || turn.modelId || "Unknown Model";
            const turnTokens = turn.totalTokens ? ` \u2502 Tokens: ${turn.totalTokens}` : "";
            const turnCost = turn.cost ? ` \u2502 Cost: ${turn.cost.formattedUSD}` : "";
            outputMarkdown += `#### [${turnName}] (${turnModel}${turnTokens}${turnCost})
${turn.content}

`;
          });
        }
        if (res.costSummary) {
          this.sessionTotalTokens += res.costSummary.totalTokens;
          this.sessionTotalCostUSD += res.costSummary.totalCostUSD;
          this.sessionTotalCostEUR += res.costSummary.totalCostEUR;
          this.updateTelemetryUI();
          outputMarkdown += `
\`\`\`text
`;
          outputMarkdown += `\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
`;
          outputMarkdown += `\u2502 [AUDIT] CONSILIUM PARTICIPATION: ${res.costSummary.models.length} Models
`;
          outputMarkdown += `\u2502 [TOTAL TOKENS] ${res.costSummary.totalTokens.toLocaleString()} tokens (In: ${res.costSummary.totalPromptTokens.toLocaleString()}, Out: ${res.costSummary.totalCompletionTokens.toLocaleString()})
`;
          outputMarkdown += `\u2502 [TOTAL COST] ${res.costSummary.formattedUSD} \u2502 ${res.costSummary.formattedEUR}
`;
          outputMarkdown += `\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
`;
          outputMarkdown += `\`\`\`
`;
        }
        textSpan.innerHTML = this.renderMarkdown(outputMarkdown);
        this.scrollToBottom();
        this.messages.push({
          role: "model",
          text: outputMarkdown,
          timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
          metadata: {
            model: this.currentModel,
            mode: this.currentMode,
            persona: this.currentPersona
          }
        });
        const speakable = res.consensus || (res.interviewResult ? `${res.interviewResult.feedback}. ${res.interviewResult.nextQuestion || ""}` : "");
        if (speakable) {
          this.speakVoiceResponse(speakable, this.currentPersona);
        }
      }
      this.updateStatusLight("online");
    } catch (err) {
      this.updateStatusLight("error");
      if (err.name === "AbortError") {
        textSpan.innerHTML += '\n<span style="color:var(--clr-yellow); font-family:var(--font-mono); font-size:11px;"> [TRANSMISSION_HALTED_BY_OPERATOR \u{1F7E1}]</span>';
      } else {
        textSpan.innerHTML = `<span style="color:var(--clr-red); font-family:var(--font-mono); font-size:11px;">[ERR] TRANSMISSION_ERROR: ${this.escapeHtml(err.message)}</span>`;
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
  // ===========================================================================
  // UI STATUS & BUBBLES
  // ===========================================================================
  updateStatusLight(state) {
    const t = this.t();
    const light = document.getElementById("telemetry-status-light");
    const text = document.getElementById("telemetry-status-text");
    if (state === "online") {
      if (light) light.className = "led-green";
      if (text) {
        text.textContent = t.statusOnline;
        text.style.color = "var(--clr-green)";
      }
    } else if (state === "busy") {
      if (light) light.className = "led-yellow";
      if (text) {
        text.textContent = t.statusBusy;
        text.style.color = "var(--clr-yellow)";
      }
    } else {
      if (light) light.className = "led-red";
      if (text) {
        text.textContent = t.statusError;
        text.style.color = "var(--clr-red)";
      }
    }
  }
  updateSendButtonState(generating) {
    const t = this.t();
    const sendBtn = document.getElementById("send-btn");
    if (!sendBtn) return;
    if (generating) {
      sendBtn.textContent = t.stopBtn;
      sendBtn.style.background = "#78350f";
      sendBtn.style.color = "var(--clr-yellow)";
      sendBtn.style.borderColor = "var(--clr-yellow)";
    } else {
      sendBtn.textContent = t.transmitBtn;
      sendBtn.style.background = "#ffffff";
      sendBtn.style.color = "#000000";
      sendBtn.style.borderColor = "#ffffff";
    }
  }
  appendMessage(msg) {
    this.messages.push(msg);
    this.createMessageBubble(msg.role, msg.text, msg.timestamp);
    this.scrollToBottom();
    this.setupCodeCopyButtons();
  }
  createMessageBubble(role, text, timestamp) {
    const wrapper = document.createElement("div");
    wrapper.className = "terminal-bubble " + role;
    const isUser = role === "user";
    const isSystem = role === "system";
    const header = document.createElement("div");
    header.className = "bubble-meta";
    let callsign = `\u250C\u2500 [${timestamp}] [USER // OPERATOR]`;
    if (!isUser && !isSystem) {
      callsign = `\u250C\u2500 [${timestamp}] [EVABOT // ${this.currentPersona.toUpperCase()} // ${this.currentMode.toUpperCase()}]`;
    } else if (isSystem) {
      callsign = `\u250C\u2500 [${timestamp}] [SYSTEM // KERNEL]`;
    }
    header.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-weight:700; color:${isUser ? "#ffffff" : isSystem ? "var(--fg-muted)" : "var(--clr-cyan)"};">${callsign}</span>
        <span style="font-size:10px; color:var(--fg-dim);">${isUser ? "TX_OK" : "RX_OK [OK]"}</span>
      </div>
    `;
    const body = document.createElement("div");
    body.className = "message-body";
    body.style.lineHeight = "1.6";
    body.innerHTML = this.renderMarkdown(text);
    wrapper.appendChild(header);
    wrapper.appendChild(body);
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
        <div style="margin:10px 0; border:1px solid var(--border-bright); background:var(--bg-panel);">
          <div style="display:flex; justify-content:space-between; align-items:center; padding:4px 10px; border-bottom:1px solid var(--border-dim); background:#000000; font-size:10px; color:var(--fg-muted);">
            <span style="font-weight:700; color:#ffffff;">\u250C [CODE: ${language.toUpperCase()}]</span>
            <button class="copy-code-btn return-btn" style="padding:1px 6px; font-size:9px;" data-code="${encodeURIComponent(code)}">${t.copyBtn}</button>
          </div>
          <pre style="padding:10px; overflow-x:auto; font-size:11px; color:var(--fg-primary);"><code>${this.escapeHtml(code)}</code></pre>
          <div style="padding:2px 10px; font-size:9px; color:var(--fg-dim); border-top:1px solid var(--border-dim);">\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500</div>
        </div>
      `;
    });
    html = html.replace(/`([^`]+)`/g, '<code style="padding:1px 4px; border:1px solid var(--border-dim); background:var(--bg-panel); color:var(--clr-green); font-size:11px;">$1</code>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#ffffff; font-weight:700;">$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em style="color:var(--fg-muted);">$1</em>');
    html = html.replace(/^### (.*$)/gim, '<h3 style="font-size:12px; font-weight:800; color:#ffffff; margin:12px 0 4px; border-bottom:1px solid var(--border-dim); padding-bottom:2px;">> $1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 style="font-size:13px; font-weight:800; color:#ffffff; margin:14px 0 6px; border-bottom:1px solid var(--border-bright); padding-bottom:4px;">>> $1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 style="font-size:14px; font-weight:900; color:#ffffff; margin:16px 0 8px; border-bottom:1px solid #ffffff; padding-bottom:4px;">>>> $1</h1>');
    html = html.replace(/((?:\|[^\n]+\|\n?)+)/g, (match) => {
      const rows = match.trim().split("\n");
      if (rows.length < 2) return match;
      let tableHtml = '<div style="overflow-x:auto; margin:10px 0;"><table style="width:100%; border-collapse:collapse; font-size:11px; border:1px solid var(--border-dim);">';
      rows.forEach((row, idx) => {
        if (row.includes("---")) return;
        const cols = row.split("|").filter((_, i, arr) => i > 0 && i < arr.length - 1);
        const tag = idx === 0 ? "th" : "td";
        tableHtml += '<tr style="border-bottom:1px solid var(--border-dim);">';
        cols.forEach((c) => {
          const val = c.trim();
          tableHtml += `<${tag} style="padding:4px 8px; text-align:left; border-right:1px solid var(--border-dim); ${tag === "th" ? "font-weight:700; color:#ffffff; background:var(--bg-panel);" : "color:var(--fg-primary);"}">${val}</${tag}>`;
        });
        tableHtml += "</tr>";
      });
      tableHtml += "</table></div>";
      return tableHtml;
    });
    html = html.replace(/^\s*-\s+(.*$)/gim, '<div style="display:flex; gap:6px; margin:2px 0 2px 8px;"><span style="color:var(--clr-green);">*</span><span>$1</span></div>');
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
    notif.style.textAlign = "center";
    notif.style.margin = "6px 0";
    notif.style.fontSize = "11px";
    notif.style.color = "var(--fg-muted)";
    notif.innerHTML = `* ${this.renderMarkdown(text)}`;
    container.appendChild(notif);
    this.scrollToBottom();
  }
  scrollToBottom() {
    const chatRegion = document.getElementById("chat-stream-region");
    if (chatRegion) {
      chatRegion.scrollTop = chatRegion.scrollHeight;
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
