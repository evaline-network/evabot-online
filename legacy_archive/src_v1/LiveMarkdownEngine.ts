/**
 * LiveMarkdownEngine
 * Pure Live-Markdown Core Engine supporting 3 Distinct Viewing Modes:
 * Mode 1: BEAUTIFUL_HYPER_UI (Tailwind-Powered Ultra Sleek Cyberpunk Dashboard)
 * Mode 2: PURE_NO_CSS_TUI (Classic Native HTML Table & Accordion TUI)
 * Mode 3: RAW_MARKDOWN (Raw Reactive Markdown Source Code)
 */

import { Language } from './Types.js';

export type ViewMode = 'BEAUTIFUL_HYPER_UI' | 'PURE_NO_CSS_TUI' | 'RAW_MARKDOWN';

export interface ITelemetryState {
  uptimeSeconds: number;
  frankfurtCpuPct: number;
  frankfurtRamUsedMb: number;
  frankfurtRamTotalMb: number;
  iowaCpuPct: number;
  iowaRamUsedMb: number;
  iowaRamTotalMb: number;
  totalOpexUsd: number;
  totalOpexEur: number;
  caddyActive: boolean;
  geminiActive: boolean;
  voiceActive: boolean;
}

export interface IChatMessage {
  sender: 'USER' | 'EVABOT';
  text: string;
  time: string;
}

export class LiveMarkdownEngine {
  private static instance: LiveMarkdownEngine;

  private telemetry: ITelemetryState = {
    uptimeSeconds: 52410,
    frankfurtCpuPct: 3.2,
    frankfurtRamUsedMb: 5840,
    frankfurtRamTotalMb: 32768,
    iowaCpuPct: 1.4,
    iowaRamUsedMb: 412,
    iowaRamTotalMb: 1024,
    totalOpexUsd: 325.00,
    totalOpexEur: 300.00,
    caddyActive: true,
    geminiActive: true,
    voiceActive: false
  };

  private chatHistory: IChatMessage[] = [
    { sender: 'EVABOT', text: 'Hello! I am EvaBot. Click my 3D Cyber Face for Gemini Live Voice, or type your prompt below.', time: '00:01:00' }
  ];

  private currentLanguage: Language = 'en';
  private currentViewMode: ViewMode = 'BEAUTIFUL_HYPER_UI';

  public static getInstance(): LiveMarkdownEngine {
    if (!LiveMarkdownEngine.instance) {
      LiveMarkdownEngine.instance = new LiveMarkdownEngine();
    }
    return LiveMarkdownEngine.instance;
  }

  public tick(): void {
    this.telemetry.uptimeSeconds += 1;
    const cpuDelta = (Math.random() * 0.4 - 0.2);
    this.telemetry.frankfurtCpuPct = Math.min(Math.max(parseFloat((this.telemetry.frankfurtCpuPct + cpuDelta).toFixed(1)), 1.2), 15.0);

    const iowaCpuDelta = (Math.random() * 0.2 - 0.1);
    this.telemetry.iowaCpuPct = Math.min(Math.max(parseFloat((this.telemetry.iowaCpuPct + iowaCpuDelta).toFixed(1)), 0.8), 8.0);

    const ramDeltaMb = Math.floor(Math.random() * 6 - 3);
    this.telemetry.frankfurtRamUsedMb = Math.min(Math.max(this.telemetry.frankfurtRamUsedMb + ramDeltaMb, 4000), 16000);
  }

  public getTelemetry(): ITelemetryState {
    return { ...this.telemetry };
  }

  public toggleVoice(): boolean {
    this.telemetry.voiceActive = !this.telemetry.voiceActive;
    return this.telemetry.voiceActive;
  }

  public setLanguage(lang: Language): void {
    this.currentLanguage = lang;
  }

  public getLanguage(): Language {
    return this.currentLanguage;
  }

  public setViewMode(mode: ViewMode): void {
    this.currentViewMode = mode;
  }

  public getViewMode(): ViewMode {
    return this.currentViewMode;
  }

  public addChatMessage(text: string): void {
    const time = new Date().toLocaleTimeString();
    this.chatHistory.push({ sender: 'USER', text, time });

    const replyText = this.currentLanguage === 'uk'
      ? `[Gemini 2.0 AI Core]: Отримано промпт: "${text}". Системна телеметрія оновлюється в режимі реального часу.`
      : (this.currentLanguage === 'ru'
        ? `[Gemini 2.0 AI Core]: Получен промпт: "${text}". Системная телеметрия обновляется в режиме реального времени.`
        : `[Gemini 2.0 AI Core]: Received prompt: "${text}". Real-time cloud telemetry streaming at 1000ms.`);

    setTimeout(() => {
      this.chatHistory.push({ sender: 'EVABOT', text: replyText, time: new Date().toLocaleTimeString() });
    }, 150);
  }

  public generateProgressBar(current: number, total: number = 100, width: number = 20): string {
    const pct = Math.min(Math.max(current / total, 0), 1);
    const filled = Math.round(pct * width);
    const empty = width - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    const pctLabel = `${(pct * 100).toFixed(1)}%`;
    return `[${bar}] ${pctLabel}`;
  }

  public processLiveMarkdown(markdownTemplate: string): string {
    let result = markdownTemplate;
    const t = this.telemetry;

    const formatUptime = (sec: number) => {
      const hrs = Math.floor(sec / 3600);
      const mins = Math.floor((sec % 3600) / 60);
      const s = sec % 60;
      return `${hrs}h ${mins}m ${s}s`;
    };

    const frankfurtRamPct = (t.frankfurtRamUsedMb / t.frankfurtRamTotalMb) * 100;
    const iowaRamPct = (t.iowaRamUsedMb / t.iowaRamTotalMb) * 100;

    result = result.replace(/\[metric:uptime\]/g, formatUptime(t.uptimeSeconds));
    result = result.replace(/\[metric:frankfurt_cpu\]/g, `${t.frankfurtCpuPct}%`);
    result = result.replace(/\[metric:frankfurt_ram\]/g, `${(t.frankfurtRamUsedMb / 1024).toFixed(2)} GB / ${(t.frankfurtRamTotalMb / 1024).toFixed(0)} GB (${frankfurtRamPct.toFixed(1)}%)`);
    result = result.replace(/\[metric:iowa_cpu\]/g, `${t.iowaCpuPct}%`);
    result = result.replace(/\[metric:iowa_ram\]/g, `${t.iowaRamUsedMb} MB / ${t.iowaRamTotalMb} MB (${iowaRamPct.toFixed(1)}%)`);
    result = result.replace(/\[metric:opex_usd\]/g, `$${t.totalOpexUsd.toFixed(2)} / mo`);
    result = result.replace(/\[metric:opex_eur\]/g, `€${t.totalOpexEur.toFixed(2)} / mo`);
    result = result.replace(/\[metric:caddy_status\]/g, t.caddyActive ? '[ONLINE] TLS 1.3' : '[OFFLINE]');
    result = result.replace(/\[metric:gemini_status\]/g, t.geminiActive ? '[ONLINE] Gemini 2.0 Pro' : '[OFFLINE]');
    result = result.replace(/\[metric:voice_status\]/g, t.voiceActive ? '[● VOICE ACTIVE]' : '[OFF]');

    result = result.replace(/\[progress:frankfurt_ram\]/g, this.generateProgressBar(frankfurtRamPct));
    result = result.replace(/\[progress:iowa_ram\]/g, this.generateProgressBar(iowaRamPct));
    result = result.replace(/\[progress:frankfurt_cpu\]/g, this.generateProgressBar(t.frankfurtCpuPct));
    result = result.replace(/\[progress:iowa_cpu\]/g, this.generateProgressBar(t.iowaCpuPct));

    result = result.replace(/\[block:3d_cyber_face\]/g, this.render3DCyberFaceBlock());
    result = result.replace(/\[block:live_chat\]/g, this.renderLiveChatBlock());
    result = result.replace(/\[block:live_accounting\]/g, this.renderLiveAccountingBlock());
    result = result.replace(/\[block:live_kanban\]/g, this.renderLiveKanbanBlock());

    return result;
  }

  private render3DCyberFaceBlock(): string {
    const isVoice = this.telemetry.voiceActive;
    const statusBg = isVoice ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 animate-pulse text-white' : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black';
    const statusText = isVoice ? '🎙️ GEMINI LIVE VOICE MIC ACTIVE — SPEAK NOW!' : 'CLICK 3D FACE TO START GEMINI LIVE VOICE';
    
    return `
<div class="flex flex-col items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-950/50 mb-6">
  <div class="text-xs font-mono font-bold tracking-widest text-cyan-400 mb-3 flex items-center gap-2 uppercase">
    <span class="inline-block w-2.5 h-2.5 rounded-full ${isVoice ? 'bg-fuchsia-500 animate-ping' : 'bg-cyan-400'}"></span>
    [3D CYBER MESH FACE // GEMINI LIVE AVATAR]
  </div>
  
  <div class="relative group cursor-pointer my-2" onclick="window.evaApp.toggleVoiceInput(event)">
    <canvas id="cyber-face-canvas" width="520" height="270" class="rounded-xl border-2 border-cyan-400/60 bg-black transition-all duration-300 group-hover:border-fuchsia-400 group-hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] shadow-[0_0_25px_rgba(6,182,212,0.3)]"></canvas>
    <div class="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-cyan-500/40 text-xs font-mono text-cyan-300">
      ${statusText}
    </div>
  </div>

  <button onclick="window.evaApp.toggleVoiceInput(event)" class="mt-4 px-6 py-2.5 rounded-xl font-orbitron font-extrabold text-sm tracking-wider uppercase shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 ${statusBg}">
    ${isVoice ? '⏹ STOP VOICE MIC' : '🎙️ START GEMINI LIVE VOICE'}
  </button>
</div>
`;
  }

  private renderLiveChatBlock(): string {
    let chatHtml = `
<div class="bg-slate-950/90 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-5 shadow-xl shadow-purple-950/40 mb-6">
  <div class="text-xs font-mono font-bold text-purple-400 mb-4 tracking-wider flex items-center justify-between">
    <span>💬 LIVE INTERACTIVE GEMINI CORE CHAT STREAM</span>
    <span class="px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-500/40 text-[10px] text-purple-300">GEMINI 2.0 PRO ENGINE</span>
  </div>
  <div class="space-y-3 max-h-64 overflow-y-auto pr-2 font-mono text-sm">
`;

    this.chatHistory.forEach(msg => {
      const isUser = msg.sender === 'USER';
      const badgeColor = isUser ? 'bg-cyan-950 border-cyan-500/40 text-cyan-300' : 'bg-purple-950 border-purple-500/40 text-purple-300';
      const textColor = isUser ? 'text-cyan-100' : 'text-purple-100';

      chatHtml += `
    <div class="p-3 rounded-xl bg-slate-900/60 border ${isUser ? 'border-cyan-500/20' : 'border-purple-500/20'} flex flex-col gap-1">
      <div class="flex items-center justify-between text-xs">
        <span class="font-bold px-2 py-0.5 rounded-md border ${badgeColor}">${msg.sender}</span>
        <span class="text-slate-500 text-[11px]">${msg.time}</span>
      </div>
      <p class="${textColor} mt-1">${msg.text}</p>
    </div>
`;
    });

    chatHtml += `
  </div>
</div>
`;
    return chatHtml;
  }

  private renderLiveAccountingBlock(): string {
    return `
| DATE | CATEGORY | DESCRIPTION | AMOUNT (USD $) | AMOUNT (EUR €) | TYPE |
|---|---|---|---|---|---|
| 2026-09-01 | GCP Compute | evabot-agent-vm (c3-standard-8 Frankfurt) | -$300.00 | -€277.00 | EXPENSE |
| 2026-09-01 | GCP Edge | evaline-micro-vm (e2-micro Iowa Always Free) | $0.00 | €0.00 | FREE TIER |
| 2026-09-01 | AI Subscription | Google AI Pro Subscription (Gemini 2.0) | -$20.00 | -€18.50 | SUBSCRIPTION |
| 2026-09-02 | Operational Savings | Cloud ALB Load Balancer Bypass Savings | +$35.00 | +€32.30 | SAVINGS |
`;
  }

  private renderLiveKanbanBlock(): string {
    return `
| 📋 BACKLOG | ⚡ IN PROGRESS | 🔍 REVIEW | ✅ DONE |
|---|---|---|---|
| • Failover Mesh<br>• Telegram Bot | • 3D Mesh Cyber Face<br>• Tailwind Hyper-UI | • 3-Way Git/GCP Sync<br>• CI Test Runner | • Iowa e2-micro Free Tier<br>• Frankfurt c3-std-8 Node |
`;
  }

  public renderByMode(liveMarkdown: string, mode: ViewMode): string {
    if (mode === 'RAW_MARKDOWN') {
      return this.compileToRawMarkdownView(liveMarkdown);
    }
    if (mode === 'PURE_NO_CSS_TUI') {
      return this.compileToHtml(liveMarkdown);
    }
    // Default: BEAUTIFUL_HYPER_UI
    return this.compileToBeautifulHtml(liveMarkdown);
  }

  private compileToRawMarkdownView(liveMarkdown: string): string {
    const escaped = liveMarkdown.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `
<div class="bg-slate-950 rounded-2xl border border-cyan-500/40 p-6 shadow-2xl font-mono">
  <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-cyan-400 text-sm font-bold">
    <span>📄 MODE 3: RAW REACTIVE MARKDOWN SOURCE STREAM</span>
    <span class="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-xs">LIVE-MARKDOWN CORE v0.0.1</span>
  </div>
  <pre class="bg-black/90 text-cyan-300 p-4 rounded-xl border border-cyan-900 overflow-x-auto text-xs leading-relaxed font-mono">${escaped}</pre>
</div>
`;
  }

  public compileToHtml(liveMarkdown: string): string {
    const lines = liveMarkdown.split('\n');
    let html = '';
    let inTable = false;
    let tableLines: string[] = [];
    let inAccordion = false;
    let accordionLines: string[] = [];
    let accordionTitle = '';

    const flushTable = () => {
      if (tableLines.length > 0) {
        html += this.renderMarkdownTable(tableLines);
        tableLines = [];
      }
      inTable = false;
    };

    const flushAccordion = () => {
      if (accordionLines.length > 0) {
        html += `<details class="tui-acc" open>`;
        html += `<summary>► ${accordionTitle}</summary>`;
        html += this.compileToHtml(accordionLines.join('\n'));
        html += `</details><br>`;
        accordionLines = [];
      }
      inAccordion = false;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (trimmed.startsWith('# ')) {
        html += `<h1>${trimmed.replace('# ', '').trim()}</h1>`;
      } else if (trimmed.startsWith('## ')) {
        html += `<h2>${trimmed.replace('## ', '').trim()}</h2>`;
      } else if (trimmed.startsWith('### ')) {
        if (inTable) flushTable();
        if (inAccordion) flushAccordion();
        inAccordion = true;
        accordionTitle = trimmed.replace('### ', '').trim();
      } else if (inAccordion && trimmed.startsWith('### ')) {
        flushAccordion();
        inAccordion = true;
        accordionTitle = trimmed.replace('### ', '').trim();
      } else if (trimmed.startsWith('|')) {
        if (inAccordion) {
          accordionLines.push(line);
        } else {
          inTable = true;
          tableLines.push(line);
        }
      } else {
        if (inTable && !trimmed.startsWith('|')) {
          flushTable();
        }

        if (inAccordion) {
          accordionLines.push(line);
        } else {
          html += this.parseLineTokens(line) + '<br>\n';
        }
      }
    }

    if (inTable) flushTable();
    if (inAccordion) flushAccordion();

    return html;
  }

  public compileToBeautifulHtml(liveMarkdown: string): string {
    const lines = liveMarkdown.split('\n');
    let html = '<div class="hyper-container space-y-6 max-w-7xl mx-auto">';
    let inTable = false;
    let tableLines: string[] = [];

    const flushTable = () => {
      if (tableLines.length > 0) {
        html += this.renderBeautifulTable(tableLines);
        tableLines = [];
      }
      inTable = false;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (trimmed.startsWith('# ')) {
        if (inTable) flushTable();
        html += `<div class="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-purple-950/80 border border-cyan-500/40 shadow-xl shadow-cyan-950/30">
          <h1 class="text-xl sm:text-2xl font-orbitron font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-purple-400 tracking-wider">${trimmed.replace('# ', '').trim()}</h1>
        </div>`;
      } else if (trimmed.startsWith('## ')) {
        if (inTable) flushTable();
        html += `<div class="mt-8 mb-3 pt-4 border-t border-slate-800">
          <h2 class="text-lg font-orbitron font-bold text-cyan-300 flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#00ffcc]"></span>
            ${trimmed.replace('## ', '').trim()}
          </h2>
        </div>`;
      } else if (trimmed.startsWith('### ')) {
        if (inTable) flushTable();
        html += `<div class="mt-4 mb-2">
          <h3 class="text-sm font-mono font-bold text-purple-400 uppercase tracking-widest bg-purple-950/40 px-3 py-1.5 rounded-lg border border-purple-500/20 inline-block">${trimmed.replace('### ', '').trim()}</h3>
        </div>`;
      } else if (trimmed.startsWith('|')) {
        inTable = true;
        tableLines.push(line);
      } else {
        if (inTable && !trimmed.startsWith('|')) {
          flushTable();
        }
        if (trimmed) {
          html += `<div class="text-slate-300 font-sans text-base leading-relaxed">${this.parseBeautifulLineTokens(line)}</div>`;
        }
      }
    }

    if (inTable) flushTable();
    html += '</div>';

    return html;
  }

  private parseLineTokens(line: string): string {
    let result = line;
    result = result.replace(/\[([^\]]+)\]\(action:([^\)]+)\)/g, '<button onclick="window.evaApp.$2(event)">$1</button>');
    result = result.replace(/\[input:([a-zA-Z0-9_-]+)\s+"([^"]+)"\]/g, '<input type="text" id="$1" placeholder="$2" style="width:70%; padding:6px;">');
    result = result.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
    result = result.replace(/`([^`]+)`/g, '<code>$1</code>');
    if (result.trim().startsWith('- ')) {
      result = `<li>${result.trim().substring(2)}</li>`;
    }
    return result;
  }

  private parseBeautifulLineTokens(line: string): string {
    let result = line;
    // Cyberpunk Styled Input Line
    result = result.replace(/\[input:([a-zA-Z0-9_-]+)\s+"([^"]+)"\]/g, `
      <div class="inline-flex items-center gap-2 w-full max-w-xl my-2">
        <input type="text" id="$1" placeholder="$2" class="w-full bg-slate-950/90 text-cyan-300 placeholder-slate-600 px-4 py-2.5 rounded-xl border border-cyan-500/40 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 font-mono text-sm transition-all shadow-inner" />
      </div>
    `);
    // Cyberpunk Action Buttons
    result = result.replace(/\[([^\]]+)\]\(action:([^\)]+)\)/g, `
      <button onclick="window.evaApp.$2(event)" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-orbitron font-extrabold uppercase tracking-wider text-xs shadow-lg shadow-cyan-500/30 transition-all duration-200 transform hover:scale-105 active:scale-95">$1</button>
    `);
    result = result.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-cyan-300 font-semibold">$1</strong>');
    result = result.replace(/`([^`]+)`/g, '<code class="bg-slate-900 text-fuchsia-400 px-2 py-0.5 rounded border border-fuchsia-500/30 font-mono text-xs">$1</code>');
    if (result.trim().startsWith('- ')) {
      result = `<div class="flex items-center gap-2 ml-3 my-1"><span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span><span>${result.trim().substring(2)}</span></div>`;
    }
    return result;
  }

  private renderMarkdownTable(lines: string[]): string {
    if (lines.length < 2) return '';
    let tableHtml = '<table border="1" width="100%" cellpadding="6">';
    lines.forEach((line, idx) => {
      if (line.includes('---')) return;
      const cells = line.split('|').filter(c => c !== '').map(c => c.trim());
      if (idx === 0) {
        tableHtml += '<thead><tr>' + cells.map(c => `<th>${c}</th>`).join('') + '</tr></thead><tbody>';
      } else {
        tableHtml += '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
      }
    });
    tableHtml += '</tbody></table><br>';
    return tableHtml;
  }

  private renderBeautifulTable(lines: string[]): string {
    if (lines.length < 2) return '';
    let tableHtml = `
<div class="overflow-x-auto my-4 rounded-xl border border-slate-800 bg-slate-950/70 backdrop-blur-md shadow-xl">
  <table class="w-full text-left border-collapse">
`;
    lines.forEach((line, idx) => {
      if (line.includes('---')) return;
      const cells = line.split('|').filter(c => c !== '').map(c => c.trim());
      if (idx === 0) {
        tableHtml += '<thead class="bg-slate-900/90 text-cyan-400 font-mono text-xs uppercase tracking-wider border-b border-slate-800"><tr>';
        cells.forEach(c => {
          tableHtml += `<th class="py-3 px-4">${c}</th>`;
        });
        tableHtml += '</tr></thead><tbody class="divide-y divide-slate-800/60 font-sans text-sm text-slate-300">';
      } else {
        tableHtml += '<tr class="hover:bg-slate-900/40 transition-colors">';
        cells.forEach(c => {
          let content = c;
          if (content.includes('[ONLINE]')) {
            content = content.replace('[ONLINE]', '<span class="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[11px] font-mono font-bold">[ONLINE]</span>');
          }
          if (content.includes('EXPENSE')) {
            content = content.replace('EXPENSE', '<span class="px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-500/40 text-[11px] font-mono font-bold">EXPENSE</span>');
          }
          tableHtml += `<td class="py-3 px-4">${content}</td>`;
        });
        tableHtml += '</tr>';
      }
    });
    tableHtml += '</tbody></table></div>';
    return tableHtml;
  }
}
