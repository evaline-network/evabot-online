// src/models/ModelRegistry.ts
var COMPLETE_GOOGLE_MODEL_CATALOG = [
  // ============================================================================
  // 1. GOOGLE GEMINI NEXT-GEN (Google DeepMind)
  // ============================================================================
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "Google DeepMind",
    category: "Google Gemini (Next-Gen)",
    description: "Google\u2019s fastest flagship model with native multimodal reasoning and real-time responsiveness.",
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    recommended: true,
    tier: "Free Quota + Paid",
    protocol: "google-genai",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "Google AI Studio: 15 RPM, 1M TPM, 1,500 RPD ($0.00)",
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
    description: "Premier reasoning and code generation engine for complex analytical challenges.",
    contextWindow: 2097152,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "Free Quota + Paid",
    protocol: "google-genai",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "Google AI Studio: 2 RPM, 32k TPM, 50 RPD ($0.00)",
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
    description: "Next-gen streaming architecture for high-frequency interactive dialogues and agent loops.",
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "Free Quota + Paid",
    protocol: "google-genai",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "Google AI Studio: 15 RPM, 1M TPM, 1,500 RPD ($0.00)",
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
    description: "Ultra cost-efficient model designed for extreme throughput and low latency agent tasks.",
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "Free Quota + Paid",
    protocol: "google-genai",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "Google AI Studio: 30 RPM, 1,500 RPD ($0.00)",
      inputPer1MTokensUSD: "$0.00 (Free) / $0.075 (Paid)",
      outputPer1MTokensUSD: "$0.00 (Free) / $0.30 (Paid)",
      inputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC0.070 (Paid)",
      outputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC0.280 (Paid)"
    }
  },
  // ============================================================================
  // 2. GOOGLE GEMINI LONG-CONTEXT
  // ============================================================================
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google DeepMind",
    category: "Google Gemini (Long-Context)",
    description: "2,000,000 token context window capable of ingesting entire codebases and long video streams.",
    contextWindow: 2097152,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "Free Quota + Paid",
    protocol: "google-genai",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "Google AI Studio: 2 RPM, 32k TPM, 50 RPD ($0.00)",
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
    description: "Fast, lightweight multimodal model with 1,000,000 tokens context.",
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "Free Quota + Paid",
    protocol: "google-genai",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "Google AI Studio: 15 RPM, 1M TPM ($0.00)",
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
    description: "Compact 8-billion parameter version built for high-speed lightweight routing.",
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "Free Quota + Paid",
    protocol: "google-genai",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "Google AI Studio: 15 RPM ($0.00)",
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
    description: "Google\u2019s flagship open weights model with performance rivaling closed models.",
    contextWindow: 8192,
    maxOutputTokens: 4096,
    recommended: false,
    tier: "Open Weights",
    protocol: "google-genai",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "Open Weights ($0.00) or Google AI Studio Free Quota",
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
    description: "High efficiency open weights model with exceptional reasoning-per-parameter ratio.",
    contextWindow: 8192,
    maxOutputTokens: 4096,
    recommended: false,
    tier: "Open Weights",
    protocol: "google-genai",
    pricing: {
      freeTierStatus: "100% Free Quota Available",
      freeTierDetails: "Open Weights ($0.00) or Google AI Studio Free Quota",
      inputPer1MTokensUSD: "$0.00 (Free) / $0.10 (Vertex AI)",
      outputPer1MTokensUSD: "$0.00 (Free) / $0.10 (Vertex AI)",
      inputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC0.09 (Vertex AI)",
      outputPer1MTokensEUR: "\u20AC0.00 (Free) / \u20AC0.09 (Vertex AI)"
    }
  },
  // ============================================================================
  // 4. ANTHROPIC CLAUDE ON GOOGLE CLOUD (Vertex AI Model Garden)
  // ============================================================================
  {
    id: "claude-3-7-sonnet",
    name: "Claude 3.7 Sonnet (Vertex AI)",
    provider: "Anthropic",
    category: "Anthropic Claude on Google Cloud",
    description: "Hybrid reasoning and instant response model available on Google Cloud Vertex AI.",
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
    description: "Industry benchmark for code generation and multi-step reasoning on Vertex AI.",
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
  // 5. META LLAMA 3 ON GOOGLE CLOUD (Vertex AI Model Garden)
  // ============================================================================
  {
    id: "llama-3.3-70b-instruct",
    name: "Meta Llama 3.3 (70B Instruct)",
    provider: "Meta",
    category: "Meta Llama 3 on Google Cloud",
    description: "Meta\u2019s latest 70-billion parameter model fully hosted on Google Cloud Vertex AI.",
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
    name: "Meta Llama 3.2 (90B Vision)",
    provider: "Meta",
    category: "Meta Llama 3 on Google Cloud",
    description: "Premier open multimodal vision and text model on Google Cloud Vertex AI.",
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
    name: "Meta Llama 3.1 (405B Instruct)",
    provider: "Meta",
    category: "Meta Llama 3 on Google Cloud",
    description: "Massive 405-billion parameter frontier model running on Google TPU/GPU cluster.",
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
  // 6. MISTRAL AI ON GOOGLE CLOUD (Vertex AI Model Garden)
  // ============================================================================
  {
    id: "mistral-large-2411",
    name: "Mistral Large 2 (Vertex AI)",
    provider: "Mistral AI",
    category: "Mistral AI on Google Cloud",
    description: "Mistral\u2019s top-tier multilingual reasoning and coding model on Google Cloud.",
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
    description: "Specialized code completion, debugging, and fill-in-the-middle on Google Cloud.",
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
  // 7. DEEPSEEK & AI21 ON GOOGLE CLOUD (Vertex AI Model Garden)
  // ============================================================================
  {
    id: "deepseek-r1",
    name: "DeepSeek R1 (Reasoning)",
    provider: "DeepSeek",
    category: "DeepSeek on Google Cloud",
    description: "Frontier open reasoning model with transparent chain-of-thought verification on Google Cloud.",
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
    description: "Hybrid Mamba-Transformer architecture offering 256,000 tokens long-context speed.",
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
};

// src/web/app.ts
var EvaBotWebApp = class {
  messages = [];
  currentModel = "gemini-2.5-flash";
  isGenerating = false;
  abortController = null;
  serverHasApiKey = false;
  authSource = "Google Cloud Ambient";
  userAccount = "evabot.online@gmail.com";
  constructor() {
    this.init();
  }
  async init() {
    this.setupEventListeners();
    await this.checkHealth();
    this.populateModelSelector();
    this.updateModelDetailsBar();
    this.updateKeyStatusUI();
    this.renderWelcomeMessage();
  }
  setupEventListeners() {
    const form = document.getElementById("chat-form");
    const input = document.getElementById("user-input");
    const modelSelect = document.getElementById("model-select");
    const clearBtn = document.getElementById("clear-btn");
    const settingsBtn = document.getElementById("settings-btn");
    const closeSettingsBtn = document.getElementById("close-settings-btn");
    const saveKeyBtn = document.getElementById("save-key-btn");
    const apiKeyInput = document.getElementById("api-key-input");
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
    modelSelect?.addEventListener("change", (e) => {
      this.currentModel = e.target.value;
      this.updateModelDetailsBar();
      const m = ModelRegistry.getModelById(this.currentModel);
      this.addSystemNotification(`Switched active model to **${m?.name || this.currentModel}** [${m?.category} \u2022 ${m?.pricing.freeTierStatus}]`);
    });
    clearBtn?.addEventListener("click", () => {
      this.messages = [];
      const container = document.getElementById("messages-container");
      if (container) container.innerHTML = "";
      this.renderWelcomeMessage();
    });
    settingsBtn?.addEventListener("click", () => {
      const modal = document.getElementById("settings-modal");
      if (modal) modal.classList.remove("hidden");
      const savedKey = localStorage.getItem("evabot_gemini_key") || "";
      if (apiKeyInput) apiKeyInput.value = savedKey;
    });
    closeSettingsBtn?.addEventListener("click", () => {
      const modal = document.getElementById("settings-modal");
      if (modal) modal.classList.add("hidden");
    });
    saveKeyBtn?.addEventListener("click", () => {
      const key = apiKeyInput?.value.trim() || "";
      if (key) {
        localStorage.setItem("evabot_gemini_key", key);
        this.addSystemNotification("Custom Gemini API key saved to browser storage.");
      } else {
        localStorage.removeItem("evabot_gemini_key");
        this.addSystemNotification("Using ambient Google Cloud account authentication.");
      }
      this.updateKeyStatusUI();
      const modal = document.getElementById("settings-modal");
      if (modal) modal.classList.add("hidden");
    });
  }
  async checkHealth() {
    try {
      const res = await fetch("/api/health");
      if (res.ok) {
        const data = await res.json();
        this.serverHasApiKey = Boolean(data.hasServerApiKey);
        if (data.authSource) this.authSource = data.authSource;
        if (data.account) this.userAccount = data.account;
      }
    } catch {
      this.serverHasApiKey = false;
    }
  }
  populateModelSelector() {
    const select = document.getElementById("model-select");
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
        const tag = m.recommended ? " \u2605 [Rec]" : m.pricing.freeTierStatus.includes("Free") ? " [Free]" : " [Paid]";
        opt.textContent = `${m.name}${tag}`;
        if (m.id === this.currentModel) opt.selected = true;
        group.appendChild(opt);
      }
      select.appendChild(group);
    }
  }
  updateModelDetailsBar() {
    const bar = document.getElementById("model-details-bar");
    if (!bar) return;
    const m = ModelRegistry.getModelById(this.currentModel);
    if (!m) return;
    const isFree = m.pricing.freeTierStatus === "100% Free Quota Available";
    const badgeClass = isFree ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" : "bg-amber-500/20 text-amber-300 border-amber-500/40";
    bar.innerHTML = `
      <div class="flex items-center gap-2 flex-wrap">
        <span class="px-2 py-0.5 rounded border ${badgeClass} font-bold text-[10px] tracking-wider uppercase">${m.pricing.freeTierStatus}</span>
        <span class="px-2 py-0.5 rounded border border-cyan-800 bg-cyan-950/60 text-cyan-300 text-[10px] font-bold">${m.provider}</span>
        <span class="text-slate-400">Context: <strong class="text-white">${m.contextWindow.toLocaleString()}</strong> tokens</span>
        <span class="text-slate-600">|</span>
        <span class="text-slate-400">Max Out: <strong class="text-white">${m.maxOutputTokens.toLocaleString()}</strong></span>
      </div>
      <div class="flex items-center gap-2 text-slate-300 flex-wrap">
        <span class="text-cyan-400">Input: <strong>${m.pricing.inputPer1MTokensUSD}</strong></span>
        <span class="text-slate-600">|</span>
        <span class="text-purple-400">Output: <strong>${m.pricing.outputPer1MTokensUSD}</strong></span>
      </div>
    `;
  }
  updateKeyStatusUI() {
    const badge = document.getElementById("key-status-badge");
    if (!badge) return;
    const customKey = localStorage.getItem("evabot_gemini_key");
    if (customKey) {
      badge.textContent = "Custom API Key Active";
      badge.className = "text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono";
    } else if (this.serverHasApiKey) {
      badge.textContent = `Google Auto-Auth (${this.userAccount})`;
      badge.className = "text-xs px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono";
    } else {
      badge.textContent = "Google Auto-Auth Active";
      badge.className = "text-xs px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono";
    }
  }
  renderWelcomeMessage() {
    this.appendMessage({
      role: "model",
      text: `\u{1F44B} **Welcome to EvaBot Online \u2014 Google Model Garden Gateway!**

Connected to **Google Antigravity & Google Cloud** account \`${this.userAccount}\`.

All models are accessible via Google native protocols with automatic credential routing:
- **Google Gemini Series:** 2.5 Flash, 2.5 Pro, 2.0 Flash, 1.5 Pro, 1.5 Flash
- **Open Models by Google:** Gemma 2 (27B & 9B Instruct)
- **Anthropic Claude on Google Cloud:** Claude 3.7 Sonnet, Claude 3.5 Sonnet, Claude 3.5 Haiku
- **Meta Llama 3 on Google Cloud:** Llama 3.3 70B, Llama 3.2 Vision 90B, Llama 3.1 405B
- **Mistral AI & DeepSeek on Google Cloud:** Mistral Large 2, Codestral 25.01, DeepSeek R1
- **AI21 Labs & Cohere on Google Cloud:** Jamba 1.5 Large, Command R+

Select any model from the dropdown to check real-time pricing (strictly USD \`$\` / EUR \`\u20AC\`) and token consumption.`
    });
  }
  async handleSend() {
    if (this.isGenerating) return;
    const input = document.getElementById("user-input");
    const text = input?.value.trim();
    if (!text) return;
    input.value = "";
    this.appendMessage({ role: "user", text });
    const customKey = localStorage.getItem("evabot_gemini_key") || "";
    this.isGenerating = true;
    this.updateSendButtonState(true);
    const botMessageElement = this.createMessageBubble("model", "");
    const textSpan = botMessageElement.querySelector(".message-body");
    try {
      this.abortController = new AbortController();
      const historyPayload = this.messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          model: this.currentModel,
          history: historyPayload,
          apiKey: customKey || void 0
        }),
        signal: this.abortController.signal
      });
      if (!response.ok) {
        const errJson = await response.json().catch(() => ({ error: "Request failed" }));
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
      this.messages.push({ role: "user", text });
      this.messages.push({ role: "model", text: accumulatedText });
    } catch (err) {
      if (err.name === "AbortError") {
        textSpan.innerHTML += " *(Generation stopped by user)*";
      } else {
        textSpan.innerHTML = `<span class="text-rose-400">\u274C Error: ${this.escapeHtml(err.message)}</span>`;
      }
    } finally {
      this.isGenerating = false;
      this.abortController = null;
      this.updateSendButtonState(false);
      this.setupCodeCopyButtons();
    }
  }
  updateSendButtonState(generating) {
    const sendBtn = document.getElementById("send-btn");
    if (!sendBtn) return;
    if (generating) {
      sendBtn.innerHTML = `
        <svg class="animate-spin h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      `;
    } else {
      sendBtn.innerHTML = `
        <span>Send</span>
        <svg class="w-4 h-4 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
        </svg>
      `;
    }
  }
  appendMessage(msg) {
    this.messages.push(msg);
    const el = this.createMessageBubble(msg.role, msg.text);
    const container = document.getElementById("messages-container");
    if (container) {
      container.appendChild(el);
      this.scrollToBottom();
      this.setupCodeCopyButtons();
    }
  }
  createMessageBubble(role, text) {
    const wrapper = document.createElement("div");
    wrapper.className = `flex ${role === "user" ? "justify-end" : "justify-start"} mb-4 animate-fade-in`;
    const bubble = document.createElement("div");
    const isUser = role === "user";
    bubble.className = isUser ? "max-w-2xl bg-cyan-600/90 text-white rounded-2xl rounded-tr-none px-4 py-3 shadow-lg font-sans text-sm sm:text-base border border-cyan-400/30" : "max-w-3xl bg-slate-900/90 text-slate-100 rounded-2xl rounded-tl-none px-5 py-4 shadow-xl font-sans text-sm sm:text-base border border-slate-700/60 leading-relaxed";
    const header = document.createElement("div");
    header.className = "text-xs font-mono text-slate-400 mb-1 flex items-center justify-between gap-4 border-b border-slate-700/40 pb-1";
    header.innerHTML = `
      <span class="font-bold ${isUser ? "text-cyan-200" : "text-purple-300"}">
        ${isUser ? "\u{1F464} You" : `\u26A1 EvaBot (${this.currentModel})`}
      </span>
      <span class="text-slate-500">${(/* @__PURE__ */ new Date()).toLocaleTimeString()}</span>
    `;
    const body = document.createElement("div");
    body.className = "message-body prose prose-invert max-w-none";
    body.innerHTML = this.renderMarkdown(text);
    bubble.appendChild(header);
    bubble.appendChild(body);
    wrapper.appendChild(bubble);
    const container = document.getElementById("messages-container");
    container?.appendChild(wrapper);
    return wrapper;
  }
  renderMarkdown(md) {
    if (!md) return "";
    let html = md;
    html = html.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_match, lang, code) => {
      const language = lang || "text";
      return `
        <div class="code-block-wrapper my-3 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 font-mono text-xs">
          <div class="flex justify-between items-center px-3 py-1.5 bg-slate-800/80 text-slate-400">
            <span class="font-bold uppercase tracking-wider text-[10px] text-cyan-400">${language}</span>
            <button class="copy-code-btn px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition-all text-[11px]" data-code="${encodeURIComponent(code)}">Copy</button>
          </div>
          <pre class="p-3 overflow-x-auto text-slate-200"><code>${this.escapeHtml(code)}</code></pre>
        </div>
      `;
    });
    html = html.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-xs">$1</code>');
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-cyan-300 mt-2 mb-1">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold text-white mt-3 mb-1.5">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mt-3 mb-2">$1</h1>');
    html = html.replace(/^\s*-\s+(.*$)/gim, '<li class="ml-4 list-disc text-slate-200">$1</li>');
    html = html.replace(/\n\n/g, "<br/><br/>");
    return html;
  }
  setupCodeCopyButtons() {
    document.querySelectorAll(".copy-code-btn").forEach((btn) => {
      btn.onclick = () => {
        const raw = btn.getAttribute("data-code");
        if (raw) {
          navigator.clipboard.writeText(decodeURIComponent(raw));
          btn.textContent = "Copied!";
          setTimeout(() => {
            btn.textContent = "Copy";
          }, 2e3);
        }
      };
    });
  }
  addSystemNotification(text) {
    const container = document.getElementById("messages-container");
    if (!container) return;
    const notif = document.createElement("div");
    notif.className = "text-center my-2 text-xs font-mono text-slate-500";
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
window.addEventListener("DOMContentLoaded", () => {
  window.evaBotApp = new EvaBotWebApp();
});
//# sourceMappingURL=bundle.js.map
