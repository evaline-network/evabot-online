// src/models/ModelRegistry.ts
var GEMINI_MODELS = [
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    description: "Ultra-fast, high-capability flagship model with native multimodal and reasoning skills.",
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    recommended: true,
    tier: "Flash"
  },
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    description: "Google\u2019s most powerful reasoning and coding model for complex engineering and analytical tasks.",
    contextWindow: 2097152,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "Pro"
  },
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    description: "Next-generation low-latency model optimized for real-time interactive tasks.",
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "Flash"
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    description: "Established reasoning model featuring a 2-million-token context window for massive documents.",
    contextWindow: 2097152,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "Pro"
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    description: "Lightweight, rapid response model optimized for high throughput and general assistant queries.",
    contextWindow: 1048576,
    maxOutputTokens: 8192,
    recommended: false,
    tier: "Flash"
  }
];
var ModelRegistry = class {
  static getAllModels() {
    return [...GEMINI_MODELS];
  }
  static getModelById(id) {
    return GEMINI_MODELS.find((m) => m.id === id);
  }
  static isValidModel(id) {
    return GEMINI_MODELS.some((m) => m.id === id);
  }
  static getDefaultModel() {
    return GEMINI_MODELS.find((m) => m.recommended) || GEMINI_MODELS[0];
  }
};

// src/web/app.ts
var EvaBotWebApp = class {
  messages = [];
  currentModel = "gemini-2.5-flash";
  isGenerating = false;
  abortController = null;
  serverHasApiKey = false;
  constructor() {
    this.init();
  }
  async init() {
    this.setupEventListeners();
    await this.checkHealth();
    this.populateModelSelector();
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
      this.addSystemNotification(`Switched active model to **${this.currentModel}**`);
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
        this.addSystemNotification("Gemini API key saved to browser storage.");
      } else {
        localStorage.removeItem("evabot_gemini_key");
        this.addSystemNotification("Custom Gemini API key removed.");
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
      }
    } catch {
      this.serverHasApiKey = false;
    }
  }
  populateModelSelector() {
    const select = document.getElementById("model-select");
    if (!select) return;
    select.innerHTML = "";
    const models = ModelRegistry.getAllModels();
    for (const m of models) {
      const opt = document.createElement("option");
      opt.value = m.id;
      opt.textContent = `${m.name} (${m.tier})${m.recommended ? " \u2605" : ""}`;
      if (m.id === this.currentModel) opt.selected = true;
      select.appendChild(opt);
    }
  }
  updateKeyStatusUI() {
    const badge = document.getElementById("key-status-badge");
    if (!badge) return;
    const customKey = localStorage.getItem("evabot_gemini_key");
    if (customKey) {
      badge.textContent = "Custom API Key Active";
      badge.className = "text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono";
    } else if (this.serverHasApiKey) {
      badge.textContent = "Server API Key Ready";
      badge.className = "text-xs px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono";
    } else {
      badge.textContent = "API Key Required";
      badge.className = "text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono cursor-pointer";
    }
  }
  renderWelcomeMessage() {
    this.appendMessage({
      role: "model",
      text: "\u{1F44B} **Welcome to EvaBot Online!**\n\nI am your autonomous AI assistant powered by Google Gemini. You can choose any model from the dropdown above (such as `gemini-2.5-flash` or `gemini-2.5-pro`) and start chatting immediately.\n\n*All currency values strictly adhere to USD ($) and EUR (\u20AC).*"
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
    if (!customKey && !this.serverHasApiKey) {
      this.appendMessage({
        role: "model",
        text: "\u26A0\uFE0F **API Key Missing**: Please click on **API Key Settings** at the top right and enter your Gemini API key (from your Google AI Pro / Google AI Studio account)."
      });
      return;
    }
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
