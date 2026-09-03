import { ModelRegistry, GeminiModelInfo } from '../models/ModelRegistry.js';

interface WebMessage {
  role: 'user' | 'model';
  text: string;
}

class EvaBotWebApp {
  private messages: WebMessage[] = [];
  private currentModel: string = 'gemini-2.5-flash';
  private isGenerating: boolean = false;
  private abortController: AbortController | null = null;
  private serverHasApiKey: boolean = false;
  private authSource: string = 'Google Cloud Ambient';
  private userAccount: string = 'evabot.online@gmail.com';

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    this.setupEventListeners();
    await this.checkHealth();
    this.populateModelSelector();
    this.updateModelDetailsBar();
    this.updateKeyStatusUI();
    this.renderWelcomeMessage();
  }

  private setupEventListeners(): void {
    const form = document.getElementById('chat-form') as HTMLFormElement;
    const input = document.getElementById('user-input') as HTMLTextAreaElement;
    const modelSelect = document.getElementById('model-select') as HTMLSelectElement;
    const clearBtn = document.getElementById('clear-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const closeSettingsBtn = document.getElementById('close-settings-btn');
    const saveKeyBtn = document.getElementById('save-key-btn');
    const apiKeyInput = document.getElementById('api-key-input') as HTMLInputElement;

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSend();
    });

    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSend();
      }
    });

    modelSelect?.addEventListener('change', (e) => {
      this.currentModel = (e.target as HTMLSelectElement).value;
      this.updateModelDetailsBar();
      const m = ModelRegistry.getModelById(this.currentModel);
      this.addSystemNotification(`Switched active model to **${m?.name || this.currentModel}** [${m?.category} • ${m?.pricing.freeTierStatus}]`);
    });

    clearBtn?.addEventListener('click', () => {
      this.messages = [];
      const container = document.getElementById('messages-container');
      if (container) container.innerHTML = '';
      this.renderWelcomeMessage();
    });

    settingsBtn?.addEventListener('click', () => {
      const modal = document.getElementById('settings-modal');
      if (modal) modal.classList.remove('hidden');
      const savedKey = localStorage.getItem('evabot_gemini_key') || '';
      if (apiKeyInput) apiKeyInput.value = savedKey;
    });

    closeSettingsBtn?.addEventListener('click', () => {
      const modal = document.getElementById('settings-modal');
      if (modal) modal.classList.add('hidden');
    });

    saveKeyBtn?.addEventListener('click', () => {
      const key = apiKeyInput?.value.trim() || '';
      if (key) {
        localStorage.setItem('evabot_gemini_key', key);
        this.addSystemNotification('Custom Gemini API key saved to browser storage.');
      } else {
        localStorage.removeItem('evabot_gemini_key');
        this.addSystemNotification('Using ambient Google Cloud account authentication.');
      }
      this.updateKeyStatusUI();
      const modal = document.getElementById('settings-modal');
      if (modal) modal.classList.add('hidden');
    });
  }

  private async checkHealth(): Promise<void> {
    try {
      const res = await fetch('/api/health');
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

  private populateModelSelector(): void {
    const select = document.getElementById('model-select') as HTMLSelectElement;
    if (!select) return;

    select.innerHTML = '';

    const categories = [
      'Google Gemini (Next-Gen)',
      'Google Gemini (Long-Context)',
      'Google Gemma (Open Weights)',
      'Anthropic Claude on Google Cloud',
      'Meta Llama 3 on Google Cloud',
      'Mistral AI on Google Cloud',
      'DeepSeek on Google Cloud',
      'AI21 Labs & Cohere on Google Cloud',
    ];

    for (const cat of categories) {
      const models = ModelRegistry.getModelsByCategory(cat);
      if (!models || models.length === 0) continue;

      const group = document.createElement('optgroup');
      group.label = cat;

      for (const m of models) {
        const opt = document.createElement('option');
        opt.value = m.id;
        const tag = m.recommended ? ' ★ [Rec]' : (m.pricing.freeTierStatus.includes('Free') ? ' [Free]' : ' [Paid]');
        opt.textContent = `${m.name}${tag}`;
        if (m.id === this.currentModel) opt.selected = true;
        group.appendChild(opt);
      }
      select.appendChild(group);
    }
  }

  private updateModelDetailsBar(): void {
    const bar = document.getElementById('model-details-bar');
    if (!bar) return;

    const m = ModelRegistry.getModelById(this.currentModel);
    if (!m) return;

    const isFree = m.pricing.freeTierStatus === '100% Free Quota Available';
    const badgeClass = isFree ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40';

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

  private updateKeyStatusUI(): void {
    const badge = document.getElementById('key-status-badge');
    if (!badge) return;

    const customKey = localStorage.getItem('evabot_gemini_key');
    if (customKey) {
      badge.textContent = 'Custom API Key Active';
      badge.className = 'text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono';
    } else if (this.serverHasApiKey) {
      badge.textContent = `Google Auto-Auth (${this.userAccount})`;
      badge.className = 'text-xs px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono';
    } else {
      badge.textContent = 'Google Auto-Auth Active';
      badge.className = 'text-xs px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono';
    }
  }

  private renderWelcomeMessage(): void {
    this.appendMessage({
      role: 'model',
      text: `👋 **Welcome to EvaBot Online — Google Model Garden Gateway!**\n\nConnected to **Google Antigravity & Google Cloud** account \`${this.userAccount}\`.\n\nAll models are accessible via Google native protocols with automatic credential routing:\n- **Google Gemini Series:** 2.5 Flash, 2.5 Pro, 2.0 Flash, 1.5 Pro, 1.5 Flash\n- **Open Models by Google:** Gemma 2 (27B & 9B Instruct)\n- **Anthropic Claude on Google Cloud:** Claude 3.7 Sonnet, Claude 3.5 Sonnet, Claude 3.5 Haiku\n- **Meta Llama 3 on Google Cloud:** Llama 3.3 70B, Llama 3.2 Vision 90B, Llama 3.1 405B\n- **Mistral AI & DeepSeek on Google Cloud:** Mistral Large 2, Codestral 25.01, DeepSeek R1\n- **AI21 Labs & Cohere on Google Cloud:** Jamba 1.5 Large, Command R+\n\nSelect any model from the dropdown to check real-time pricing (strictly USD \`$\` / EUR \`€\`) and token consumption.`,
    });
  }

  private async handleSend(): Promise<void> {
    if (this.isGenerating) return;

    const input = document.getElementById('user-input') as HTMLTextAreaElement;
    const text = input?.value.trim();
    if (!text) return;

    input.value = '';
    this.appendMessage({ role: 'user', text });

    const customKey = localStorage.getItem('evabot_gemini_key') || '';

    this.isGenerating = true;
    this.updateSendButtonState(true);

    const botMessageElement = this.createMessageBubble('model', '');
    const textSpan = botMessageElement.querySelector('.message-body') as HTMLElement;

    try {
      this.abortController = new AbortController();

      const historyPayload = this.messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          model: this.currentModel,
          history: historyPayload,
          apiKey: customKey || undefined,
        }),
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(errJson.error || `HTTP ${response.status}`);
      }

      if (!response.body) throw new Error('Readable stream not supported');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6).trim();
            if (!dataStr) continue;

            try {
              const data = JSON.parse(dataStr);
              if (data.chunk) {
                accumulatedText += data.chunk;
                textSpan.innerHTML = this.renderMarkdown(accumulatedText);
                this.scrollToBottom();
              } else if (data.error) {
                accumulatedText += `\n\n[Error: ${data.error}]`;
                textSpan.innerHTML = this.renderMarkdown(accumulatedText);
              }
            } catch {
              // ignore json fragment
            }
          }
        }
      }

      this.messages.push({ role: 'user', text });
      this.messages.push({ role: 'model', text: accumulatedText });
    } catch (err: any) {
      if (err.name === 'AbortError') {
        textSpan.innerHTML += ' *(Generation stopped by user)*';
      } else {
        textSpan.innerHTML = `<span class="text-rose-400">❌ Error: ${this.escapeHtml(err.message)}</span>`;
      }
    } finally {
      this.isGenerating = false;
      this.abortController = null;
      this.updateSendButtonState(false);
      this.setupCodeCopyButtons();
    }
  }

  private updateSendButtonState(generating: boolean): void {
    const sendBtn = document.getElementById('send-btn') as HTMLButtonElement;
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

  private appendMessage(msg: WebMessage): void {
    this.messages.push(msg);
    const el = this.createMessageBubble(msg.role, msg.text);
    const container = document.getElementById('messages-container');
    if (container) {
      container.appendChild(el);
      this.scrollToBottom();
      this.setupCodeCopyButtons();
    }
  }

  private createMessageBubble(role: 'user' | 'model', text: string): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = `flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`;

    const bubble = document.createElement('div');
    const isUser = role === 'user';

    bubble.className = isUser
      ? 'max-w-2xl bg-cyan-600/90 text-white rounded-2xl rounded-tr-none px-4 py-3 shadow-lg font-sans text-sm sm:text-base border border-cyan-400/30'
      : 'max-w-3xl bg-slate-900/90 text-slate-100 rounded-2xl rounded-tl-none px-5 py-4 shadow-xl font-sans text-sm sm:text-base border border-slate-700/60 leading-relaxed';

    const header = document.createElement('div');
    header.className = 'text-xs font-mono text-slate-400 mb-1 flex items-center justify-between gap-4 border-b border-slate-700/40 pb-1';
    header.innerHTML = `
      <span class="font-bold ${isUser ? 'text-cyan-200' : 'text-purple-300'}">
        ${isUser ? '👤 You' : `⚡ EvaBot (${this.currentModel})`}
      </span>
      <span class="text-slate-500">${new Date().toLocaleTimeString()}</span>
    `;

    const body = document.createElement('div');
    body.className = 'message-body prose prose-invert max-w-none';
    body.innerHTML = this.renderMarkdown(text);

    bubble.appendChild(header);
    bubble.appendChild(body);
    wrapper.appendChild(bubble);

    const container = document.getElementById('messages-container');
    container?.appendChild(wrapper);
    return wrapper;
  }

  private renderMarkdown(md: string): string {
    if (!md) return '';

    let html = md;

    // Code blocks with language badge
    html = html.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_match, lang, code) => {
      const language = lang || 'text';
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

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-xs">$1</code>');

    // Bold & Italics
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Headings
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-cyan-300 mt-2 mb-1">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold text-white mt-3 mb-1.5">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mt-3 mb-2">$1</h1>');

    // Bullet lists
    html = html.replace(/^\s*-\s+(.*$)/gim, '<li class="ml-4 list-disc text-slate-200">$1</li>');

    // Line breaks
    html = html.replace(/\n\n/g, '<br/><br/>');

    return html;
  }

  private setupCodeCopyButtons(): void {
    document.querySelectorAll<HTMLButtonElement>('.copy-code-btn').forEach((btn) => {
      btn.onclick = () => {
        const raw = btn.getAttribute('data-code');
        if (raw) {
          navigator.clipboard.writeText(decodeURIComponent(raw));
          btn.textContent = 'Copied!';
          setTimeout(() => {
            btn.textContent = 'Copy';
          }, 2000);
        }
      };
    });
  }

  private addSystemNotification(text: string): void {
    const container = document.getElementById('messages-container');
    if (!container) return;

    const notif = document.createElement('div');
    notif.className = 'text-center my-2 text-xs font-mono text-slate-500';
    notif.innerHTML = `✦ ${this.renderMarkdown(text)}`;
    container.appendChild(notif);
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    const main = document.getElementById('chat-scroll-area');
    if (main) {
      main.scrollTop = main.scrollHeight;
    }
  }

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Initialize web app on load
window.addEventListener('DOMContentLoaded', () => {
  (window as any).evaBotApp = new EvaBotWebApp();
});
