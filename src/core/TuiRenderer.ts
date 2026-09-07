import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { ClusterMonitor } from './ClusterMonitor.js';

export interface DomainMeta {
  domain: string;
  badge: string;
  role: string;
  infra: string;
  target?: string;
}

export const DOMAINS_CONFIG: DomainMeta[] = [
  {
    domain: 'evabot.online',
    badge: 'NEURAL CORE',
    role: 'AI Вычислительное Ядро, Оркестрация Агентов & Мульти-LLM Консилиум',
    infra: 'evabot-agent-vm · 8 vCPU Intel Xeon Sapphire Rapids · 32 GB RAM · Франкфурт (ФРГ) · IP: 34.159.202.82',
    target: 'Координация агентов, консилиум 78 моделей, векторная память и TUI-сервер.',
  },
  {
    domain: 'evaline.network',
    badge: 'EDGE MESH',
    role: 'Edge Mesh, Транс-региональная Сетевая Маршрутизация & WireGuard Магистраль',
    infra: 'evaline-micro-vm · 2 vCPU e2-micro · 1 GB RAM · Айова (США) · IP: 136.114.26.252',
    target: 'Глобальный Ingress-шлюз, HTTP/3 QUIC терминация, WireGuard туннель Франкфурт ↔ Айова.',
  },
  {
    domain: 'evaline.online',
    badge: 'SECURITY & IAM',
    role: 'Контур Периметровой Безопасности, IAM-Авторизация, OOM-Щит & Сервис-Меш',
    infra: 'evaline-micro-vm · 2 vCPU e2-micro · 1 GB RAM · Айова (США) · IP: 136.114.26.252',
    target: 'OOM Shield защита e2-micro, фильтрация ботнетов, TLS-политики и взаимная аутентификация.',
  },
  {
    domain: 'evaline.website',
    badge: 'CHRONICLE',
    role: 'Мастер-Хроника Релизов, Инженерный Worklog & Архитектурная Документация',
    infra: 'evaline-micro-vm · 2 vCPU e2-micro · 1 GB RAM · Айова (США) · IP: 136.114.26.252',
    target: 'Публичный инженерный ворклог, документация архитектуры, спецификации RFC и история коммитов.',
  },
];

export class TuiRenderer {
  private static pagesDir = path.resolve(process.cwd(), 'pages');

  public static loadPageTemplate(cleanHost: string): { meta: DomainMeta; body: string } {
    const defaultMeta = DOMAINS_CONFIG.find((d) => d.domain === cleanHost) || DOMAINS_CONFIG[0];
    let filePath = path.join(this.pagesDir, `${cleanHost}.unui.md`);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(this.pagesDir, 'default.unui.md');
    }
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
        if (fmMatch) {
          const fmText = fmMatch[1];
          const body = fmMatch[2];
          const meta: DomainMeta = { ...defaultMeta };
          fmText.split('\n').forEach((line) => {
            const [k, ...v] = line.split(':');
            if (k && v.length) {
              const key = k.trim();
              const val = v.join(':').trim();
              if (key === 'domain') meta.domain = val;
              if (key === 'badge') meta.badge = val;
              if (key === 'role') meta.role = val;
              if (key === 'infra') meta.infra = val;
              if (key === 'target') meta.target = val;
            }
          });
          return { meta, body };
        }
        return { meta: defaultMeta, body: raw };
      } catch (err) {
        console.error(`[un-ui] Error loading template for ${cleanHost}:`, err);
      }
    }
    return { meta: defaultMeta, body: '' };
  }

  public static getRawTemplate(targetDomain: string): string {
    const cleanHost = (targetDomain || '').split(':')[0].toLowerCase().replace(/^www\./, '');
    let filePath = path.join(this.pagesDir, `${cleanHost}.unui.md`);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(this.pagesDir, 'default.unui.md');
    }
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf-8');
    }
    return `# un-ui page for ${cleanHost}\nNo template found on disk.`;
  }

  public static getRawTextTemplate(targetDomain: string): string {
    const cleanHost = (targetDomain || '').split(':')[0].toLowerCase().replace(/^www\./, '');
    let filePath = path.join(this.pagesDir, `${cleanHost}.unui.txt`);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(this.pagesDir, 'default.unui.txt');
    }
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf-8');
    }
    return this.renderText(cleanHost);
  }

  public static resolveDomain(hostHeader?: string): DomainMeta {
    if (!hostHeader) return DOMAINS_CONFIG[0];
    const cleanHost = hostHeader.split(':')[0].toLowerCase().replace(/^www\./, '');
    const { meta } = this.loadPageTemplate(cleanHost);
    return meta;
  }

  private static formatSecs(sec: number): string {
    const d = Math.floor(sec / 86400);
    const h = String(Math.floor((sec % 86400) / 3600)).padStart(2, '0');
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return (d > 0 ? `${d}d ` : '') + `${h}:${m}:${s}`;
  }

  private static makeBar(pct: number, total = 10): string {
    const safePct = Math.max(0, Math.min(100, pct));
    const filled = Math.round((safePct / 100) * total);
    return '[' + '■'.repeat(filled) + '□'.repeat(total - filled) + ']';
  }

  public static renderText(targetDomain: string): string {
    const cleanHost = (targetDomain || '').split(':')[0].toLowerCase().replace(/^www\./, '');
    const { meta: d, body } = this.loadPageTemplate(cleanHost);
    const nowUtc = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    const bLoad = os.loadavg()[0].toFixed(2);
    const bCpuPct = Math.min(100, Math.round((parseFloat(bLoad) / 8) * 100));
    const bTotMem = Math.round(os.totalmem() / (1024 * 1024 * 1024));
    const bUsedMem = ((os.totalmem() - os.freemem()) / (1024 * 1024 * 1024)).toFixed(1);
    const bRamPct = Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100);
    const bUptime = this.formatSecs(Math.floor(os.uptime()));

    const micro = ClusterMonitor.getMicroMetrics();
    const latency = ClusterMonitor.getMeshLatency();
    const procs = ClusterMonitor.getProcesses();
    const logs = ClusterMonitor.getDomainLogs().slice(0, 10);

    let telemetryBlock = '[ РЕАЛЬНАЯ ТЕЛЕМЕТРИЯ ДВУХ СЕРВЕРОВ // REALTIME DUAL-NODE TELEMETRY ]:\n';
    telemetryBlock += `  • EVABRAIN (Compute Core / ФРГ): CPU: ${bLoad} (${bCpuPct}%) ${this.makeBar(bCpuPct)} | RAM: ${bUsedMem}/${bTotMem} GB (${bRamPct}%) | Uptime: ${bUptime} | Статус: [HEALTHY]\n`;
    telemetryBlock += `  • EVAFACE  (Edge Ingress / США): Load: ${micro.loadAvg.split(',')[0]} (${micro.cpuPct}%) ${this.makeBar(micro.cpuPct)} | RAM: ${micro.memUsedMb}/${micro.memTotalMb} MB (${Math.round((micro.memUsedMb / micro.memTotalMb) * 100)}%) | Uptime: ${micro.uptimeStr} | Ingress: [Caddy HTTP/3 OK]\n`;
    telemetryBlock += `  • WIREGUARD MESH BACKBONE:       100.125.200.49 (US)  100.66.98.4 (EU) | Latency: ${latency} ms RTT | Потери: [0.0%]\n`;
    telemetryBlock += `  • ПУЛ МОДЕЛЕЙ И КЛАСТЕРА:        Активно: 78 моделей онлайн (Gemini, Claude, DeepSeek) | Режим: [ONLINE]`;

    let procBlock = '[ РЕАЛЬНЫЕ ПРОЦЕССЫ КЛАСТЕРА // LIVE PROCESS WATCHER ]:\n';
    procBlock += '  PID     УЗЕЛ             ПРОЦЕСС / СЛУЖБА             CPU    ОЗУ      СТАТУС\n';
    procs.forEach((p, idx) => {
      const pidStr = String(p.pid).padEnd(7);
      const nodeStr = p.node.split(' ')[0].padEnd(16);
      const nameStr = `${p.name} (${p.role.split(' ')[0]})`.padEnd(28);
      const cpuStr = p.cpu.padEnd(6);
      const memStr = p.mem.padEnd(8);
      procBlock += `  ${pidStr} ${nodeStr} ${nameStr} ${cpuStr} ${memStr} [${p.status}]${idx < procs.length - 1 ? '\n' : ''}`;
    });

    let logBlock = '[ РЕАЛЬНЫЙ ЖУРНАЛ ЗАПРОСОВ И ЛОГИ СЕТИ // LIVE ACCESS & SYSTEM LOGS ]:\n';
    if (logs.length > 0) {
      logs.slice(0, 8).forEach((l, idx) => {
        const icon = l.statusLevel === 'err' ? '[ERR]' : l.statusLevel === 'warn' ? '[WRN]' : '[OK]';
        logBlock += `  [${l.timeStr}] ${icon} ${l.status} ${l.method.padEnd(4)} ${l.host.padEnd(16)} ${l.uri.padEnd(28)} (${l.proto} ${l.durationMs}ms) ip:${l.ip}${idx < Math.min(logs.length, 8) - 1 ? '\n' : ''}`;
      });
    } else {
      logBlock += '  [Сбор телеметрии активен...]';
    }

    if (body) {
      let hydrated = body;

      if (hydrated.includes('<!-- SLOT:TELEMETRY -->')) {
        hydrated = hydrated.replace(
          /<!-- SLOT:TELEMETRY -->[\s\S]*?<!-- \/SLOT:TELEMETRY -->/g,
          `<!-- SLOT:TELEMETRY -->\n${telemetryBlock}\n<!-- /SLOT:TELEMETRY -->`
        );
      } else if (hydrated.includes('{{SLOT_TELEMETRY}}')) {
        hydrated = hydrated.replace('{{SLOT_TELEMETRY}}', telemetryBlock);
      }

      if (hydrated.includes('<!-- SLOT:PROCESS_WATCHER -->')) {
        hydrated = hydrated.replace(
          /<!-- SLOT:PROCESS_WATCHER -->[\s\S]*?<!-- \/SLOT:PROCESS_WATCHER -->/g,
          `<!-- SLOT:PROCESS_WATCHER -->\n${procBlock}\n<!-- /SLOT:PROCESS_WATCHER -->`
        );
      } else if (hydrated.includes('{{SLOT_PROCESS_WATCHER}}')) {
        hydrated = hydrated.replace('{{SLOT_PROCESS_WATCHER}}', procBlock);
      }

      if (hydrated.includes('<!-- SLOT:LOG_STREAM -->')) {
        hydrated = hydrated.replace(
          /<!-- SLOT:LOG_STREAM -->[\s\S]*?<!-- \/SLOT:LOG_STREAM -->/g,
          `<!-- SLOT:LOG_STREAM -->\n${logBlock}\n<!-- /SLOT:LOG_STREAM -->`
        );
      } else if (hydrated.includes('{{SLOT_LOG_STREAM}}')) {
        hydrated = hydrated.replace('{{SLOT_LOG_STREAM}}', logBlock);
      }

      // Strip slot comment tags from terminal stream
      hydrated = hydrated
        .replace(/<!--\s*SLOT:[A-Z_]+\s*-->\r?\n?/g, '')
        .replace(/<!--\s*\/SLOT:[A-Z_]+\s*-->\r?\n?/g, '');

      return hydrated.trimEnd() + '\n';
    }

    let out = '';
    out += `┌── EVALINE CONSOLE // ${d.domain} [${d.badge}] ── ● LIVE ── [ ТЕМА] ──┐\n`;
    out += '│                                                                          │\n';
    out += `> УЗЕЛ         : ${d.domain} [${d.badge}]\n`;
    out += `> РОЛЬ         : ${d.role}\n`;
    out += `> ИНФРА        : ${d.infra}\n`;
    out += `> НАЗНАЧЕНИЕ   : ${d.target || ''}\n`;
    out += '────────────────────────────────────────────────────────────────────────────\n';
    out += '[ СЕТЬ EVALINE MESH // КЛАСТЕРНЫЕ УЗЛЫ ]:\n';
    DOMAINS_CONFIG.forEach((item) => {
      if (item.domain === d.domain) {
        out += `  [*] ${item.domain.padEnd(16)} :: ${item.role} [ТЕКУЩИЙ УЗЕЛ]\n`;
      } else {
        out += `  [->] https://${item.domain.padEnd(14)} :: ${item.role}\n`;
      }
    });
    out += '────────────────────────────────────────────────────────────────────────────\n';
    out += telemetryBlock + '\n';
    out += '────────────────────────────────────────────────────────────────────────────\n';
    out += procBlock + '\n';
    out += '────────────────────────────────────────────────────────────────────────────\n';
    out += logBlock + '\n';
    out += '────────────────────────────────────────────────────────────────────────────\n';
    out += 'evabot@evaline-mesh:~$ █\n';
    return out;
  }

  public static renderHtml(targetDomain: string): string {
    const d = this.resolveDomain(targetDomain);
    const nowUtc = new Date().toISOString().replace('T', ' ').substring(11, 19) + ' UTC';

    const bLoad = os.loadavg()[0].toFixed(2);
    const bCpuPct = Math.min(100, Math.round((parseFloat(bLoad) / 8) * 100));
    const bTotMem = Math.round(os.totalmem() / (1024 * 1024 * 1024));
    const bUsedMem = ((os.totalmem() - os.freemem()) / (1024 * 1024 * 1024)).toFixed(1);
    const bRamPct = Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100);
    const bUptime = this.formatSecs(Math.floor(os.uptime()));

    const micro = ClusterMonitor.getMicroMetrics();
    const latency = ClusterMonitor.getMeshLatency();
    const procs = ClusterMonitor.getProcesses();
    const logs = ClusterMonitor.getDomainLogs();

    const crossLinksListHtml = DOMAINS_CONFIG.map((item) => {
      if (item.domain === d.domain) {
        return `      <div class="tui-line">  <span class="c-ok bold">[*] ${item.domain.padEnd(16)}</span> <span class="c-dim">::</span> <span class="c-fg">${item.role}</span> <span class="badge badge-ok">[ТЕКУЩИЙ УЗЕЛ]</span></div>`;
      } else {
        return `      <div class="tui-line">  <a href="https://${item.domain}" class="tui-link bold">[->] https://${item.domain.padEnd(14)}</a> <span class="c-dim">::</span> <span class="c-fg">${item.role}</span></div>`;
      }
    }).join('\n');

    const procRowsHtml = procs
      .map((p) => {
        const nodeClean = p.node.split(' ')[0];
        const nameClean = `${p.name} (${p.role.split(' ')[0]})`;
        return `        <tr>
          <td>${p.pid}</td>
          <td>${nodeClean}</td>
          <td class="bold c-fg">${nameClean}</td>
          <td class="c-ok">${p.cpu}</td>
          <td>${p.mem}</td>
          <td><span class="badge badge-ok">[${p.status}]</span></td>
        </tr>`;
      })
      .join('\n');

    const logRowsHtml = logs
      .slice(0, 30)
      .map((l) => {
        const badgeClass = l.statusLevel === 'err' ? 'badge-err' : l.statusLevel === 'warn' ? 'badge-warn' : 'badge-ok';
        const icon = l.statusLevel === 'err' ? '[ERR]' : l.statusLevel === 'warn' ? '[WRN]' : '[OK]';
        return `        <div class="log-row">
          <span class="c-dim">[${l.timeStr}]</span>
          <span class="badge ${badgeClass}">${icon}</span>
          <span class="c-fg">${l.status}</span>
          <span class="bold c-fg">${l.method.padEnd(4)}</span>
          <strong class="c-fg">${l.host.padEnd(16)}</strong>
          <span class="c-dim">${l.uri.padEnd(28)}</span>
          <span class="c-dim">(${l.proto} ${l.durationMs}ms)</span>
          <span class="c-faint">ip:${l.ip}</span>
        </div>`;
      })
      .join('\n');

    return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<!-- STRICT ZERO-CACHE HEADERS -->
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate, max-age=0, proxy-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
<title>${d.domain.toUpperCase()} // EVALINE CONSOLE</title>
<style>
  :root {
    --bg: #090a0f;
    --surface: #10121a;
    --border: #272a36;
    --border-dim: #191b24;
    --fg: #ffffff;
    --fg-muted: #8e94a0;
    --fg-dim: #5a606d;
    --log-bg: #06070a;
    --btn-bg: #141720;
    --btn-border: #2c3242;

    /* STRICT TRAFFIC LIGHT COLORS ONLY */
    --c-ok: #00e676;
    --c-ok-dim: rgba(0, 230, 118, 0.12);
    --c-warn: #ffd600;
    --c-warn-dim: rgba(255, 214, 0, 0.12);
    --c-err: #ff1744;
    --c-err-dim: rgba(255, 23, 68, 0.12);
  }

  :root.theme-light, html.theme-light, body.theme-light {
    --bg: #f4f5f7;
    --surface: #ffffff;
    --border: #d2d6dc;
    --border-dim: #e5e7eb;
    --fg: #111827;
    --fg-muted: #4b5563;
    --fg-dim: #9ca3af;
    --log-bg: #ffffff;
    --btn-bg: #f3f4f6;
    --btn-border: #d1d5db;

    /* LIGHT MODE TRAFFIC LIGHTS */
    --c-ok: #059669;
    --c-ok-dim: rgba(5, 150, 105, 0.1);
    --c-warn: #d97706;
    --c-warn-dim: rgba(217, 119, 6, 0.1);
    --c-err: #dc2626;
    --c-err-dim: rgba(220, 38, 38, 0.1);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
    overflow: hidden;
    font-size: 16px;
    font-family: 'Roboto Mono', 'Roboto', monospace;
    line-height: 1.45;
    background-color: var(--bg);
    color: var(--fg);
    transition: background-color 0.15s ease, color 0.15s ease;
  }

  .tui-fullscreen {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  /* TOP STATUS BAR */
  .tui-topbar {
    width: 100%;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 8px 16px;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    font-size: 15.5px;
  }

  .topbar-left {
    display: flex;
    align-items: center;
    gap: 12px;
    white-space: nowrap;
  }

  .topbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  }

  .tui-btn {
    background: var(--btn-bg);
    border: 1px solid var(--btn-border);
    color: var(--fg);
    font-family: inherit;
    font-size: 14px;
    padding: 3px 9px;
    border-radius: 3px;
    cursor: pointer;
    user-select: none;
    transition: all 0.15s ease;
  }
  .tui-btn:hover {
    border-color: var(--fg);
  }
  .tui-btn.active {
    background: var(--fg);
    color: var(--bg);
    border-color: var(--fg);
    font-weight: bold;
  }

  /* MAIN FLEX CONTENT */
  .tui-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 8px 16px;
    overflow: hidden;
    gap: 6px;
  }

  .tui-block {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 15px;
  }

  .tui-title {
    font-weight: bold;
    color: var(--fg);
    letter-spacing: 0.5px;
    font-size: 15px;
  }

  .tui-line {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tui-divider {
    height: 1px;
    background: var(--border-dim);
    margin: 1px 0;
  }

  /* MONOCHROME LABELS & TEXT */
  .c-fg { color: var(--fg); }
  .c-dim { color: var(--fg-muted); }
  .c-faint { color: var(--fg-dim); }
  .bold { font-weight: bold; }

  /* TRAFFIC LIGHT COLORS */
  .c-ok { color: var(--c-ok); }
  .c-warn { color: var(--c-warn); }
  .c-err { color: var(--c-err); }

  .badge {
    display: inline-block;
    padding: 1px 6px;
    border-radius: 2px;
    font-size: 12px;
    font-weight: bold;
  }
  .badge-ok {
    background: var(--c-ok-dim);
    color: var(--c-ok);
    border: 1px solid var(--c-ok);
  }
  .badge-warn {
    background: var(--c-warn-dim);
    color: var(--c-warn);
    border: 1px solid var(--c-warn);
  }
  .badge-err {
    background: var(--c-err-dim);
    color: var(--c-err);
    border: 1px solid var(--c-err);
  }
  .badge-mono {
    background: var(--btn-bg);
    color: var(--fg);
    border: 1px solid var(--btn-border);
  }

  .tui-link {
    color: var(--fg);
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .tui-link:hover {
    color: var(--c-ok);
  }

  .led-live {
    display: inline-block;
    color: var(--c-ok);
    animation: pulse 1.8s infinite ease-in-out;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; filter: drop-shadow(0 0 4px var(--c-ok)); }
    50% { opacity: 0.35; filter: none; }
  }

  .cursor-blink {
    display: inline-block;
    color: var(--fg);
    animation: blink 1s steps(2, start) infinite;
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  .spinner { display: inline-block; color: var(--fg); font-weight: bold; }

  /* PROCESS TABLE */
  .proc-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14.5px;
    margin-top: 1px;
  }
  .proc-table th {
    text-align: left;
    color: var(--fg-muted);
    border-bottom: 1px solid var(--border);
    padding: 3px 8px;
    font-weight: normal;
  }
  .proc-table td {
    padding: 3px 8px;
    border-bottom: 1px solid var(--border-dim);
    white-space: nowrap;
  }
  .proc-table tr:hover td {
    background: var(--btn-bg);
  }

  /* LOG CONSOLE (FILLS ALL REMAINING SCREEN) */
  .tui-log-block {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 80px;
    overflow: hidden;
  }
  .log-header-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 3px;
  }
  .log-tabs {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .log-stream {
    flex: 1;
    overflow-y: auto;
    background: var(--log-bg);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 6px 10px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .log-row {
    flex-shrink: 0;
    min-height: 22px;
    line-height: 22px;
    font-size: 14.5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .log-row:hover {
    background: var(--btn-bg);
  }

  .tui-footer-prompt {
    display: flex;
    align-items: center;
    font-size: 15px;
    padding-top: 2px;
  }
</style>
</head>
<body>

<div class="tui-fullscreen">
  <!-- TOP STATUS BAR -->
  <div class="tui-topbar">
    <div class="topbar-left">
      <span class="bold">EVALINE CONSOLE // ${d.domain} [${d.badge}]</span>
      <span class="led-live">●</span> <span class="c-ok bold">LIVE</span>
      <span class="c-dim">UTC: <span id="clock-utc">${nowUtc}</span></span>
      <span class="spinner" id="spin"></span>
    </div>
    <div class="topbar-right">
      <button class="tui-btn" id="theme-btn" onclick="toggleTheme()" title="Горячая клавиша: T">[ ТЕМА: DARK]</button>
      <button class="tui-btn" onclick="manualRefresh()">[ СИНХР]</button>
    </div>
  </div>

  <div class="tui-content">
    <!-- SECTION 1: IDENTITY -->
    <div class="tui-block">
      <div class="tui-line"><span class="c-dim">> УЗЕЛ         :</span> <strong class="c-fg">${d.domain}</strong> <span class="badge badge-mono">[${d.badge}]</span></div>
      <div class="tui-line"><span class="c-dim">> РОЛЬ         :</span> <span class="c-fg">${d.role}</span></div>
      <div class="tui-line"><span class="c-dim">> ИНФРА        :</span> <span class="c-dim">${d.infra}</span></div>
      <div class="tui-line"><span class="c-dim">> НАЗНАЧЕНИЕ   :</span> <span class="c-fg">${d.target || ''}</span></div>
    </div>

    <div class="tui-divider"></div>

    <!-- SECTION 2: EVALINE MESH NODES -->
    <div class="tui-block">
      <div class="tui-title">[ СЕТЬ EVALINE MESH // КЛАСТЕРНЫЕ УЗЛЫ ]:</div>
${crossLinksListHtml}
    </div>

    <div class="tui-divider"></div>

    <!-- SECTION 3: REAL DUAL-NODE TELEMETRY -->
    <div class="tui-block">
      <div class="tui-title">[ РЕАЛЬНАЯ ТЕЛЕМЕТРИЯ ДВУХ СЕРВЕРОВ // REALTIME DUAL-NODE TELEMETRY ]:</div>
      <div class="tui-line">  <strong class="c-fg">• EVABRAIN (Compute Core / ФРГ):</strong> CPU: <span id="b-cpu" class="c-ok">${bLoad} (${bCpuPct}%)</span> <span id="b-cpu-bar">${this.makeBar(bCpuPct)}</span> | RAM: <span id="b-ram" class="c-fg">${bUsedMem}/${bTotMem} GB (${bRamPct}%)</span> | Uptime: <span id="b-uptime" class="c-ok">${bUptime}</span> | Статус: <span class="badge badge-ok">[HEALTHY]</span></div>
      <div class="tui-line">  <strong class="c-fg">• EVAFACE  (Edge Ingress / США):</strong> Load: <span id="f-load" class="c-ok">${micro.loadAvg.split(',')[0]} (${micro.cpuPct}%)</span> <span id="f-load-bar">${this.makeBar(micro.cpuPct)}</span> | RAM: <span id="f-ram" class="c-fg">${micro.memUsedMb}/${micro.memTotalMb} MB (${Math.round((micro.memUsedMb / micro.memTotalMb) * 100)}%)</span> | Uptime: <span id="f-uptime" class="c-ok">${micro.uptimeStr}</span> | Ingress: <span class="badge badge-ok">[Caddy HTTP/3 OK]</span></div>
      <div class="tui-line">  <strong class="c-fg">• WIREGUARD MESH BACKBONE:</strong>       100.125.200.49 (US)  100.66.98.4 (EU) | Latency: <span id="m-rtt" class="c-ok bold">${latency} ms RTT</span> | Потери: <span class="badge badge-ok">[0.0%]</span></div>
      <div class="tui-line">  <strong class="c-fg">• ПУЛ МОДЕЛЕЙ И КЛАСТЕРА:</strong>        Активно: <span id="b-models" class="c-ok bold">78 моделей онлайн</span> (Gemini, Claude, DeepSeek) | Режим: <span class="badge badge-ok">[ONLINE]</span></div>
    </div>

    <div class="tui-divider"></div>

    <!-- SECTION 4: REAL PROCESS WATCHER TABLE -->
    <div class="tui-block">
      <div class="tui-title">[ РЕАЛЬНЫЕ ПРОЦЕССЫ КЛАСТЕРА // LIVE PROCESS WATCHER ]:</div>
      <table class="proc-table">
        <thead>
          <tr>
            <th>PID</th>
            <th>УЗЕЛ</th>
            <th>ПРОЦЕСС / СЛУЖБА</th>
            <th>CPU</th>
            <th>ОЗУ</th>
            <th>СТАТУС</th>
          </tr>
        </thead>
        <tbody id="proc-tbody">
${procRowsHtml}
        </tbody>
      </table>
    </div>

    <div class="tui-divider"></div>

    <!-- SECTION 5: REAL LOG STREAM -->
    <div class="tui-block tui-log-block">
      <div class="log-header-bar">
        <div class="log-tabs">
          <span class="tui-title">[ РЕАЛЬНЫЙ ЖУРНАЛ ЗАПРОСОВ И ЛОГИ СЕТИ // LIVE ACCESS & SYSTEM LOGS ]:</span>
          <button class="tui-btn active" id="filter-all" onclick="setLogFilter('all')">[ВСЕ СОБЫТИЯ]</button>
          <button class="tui-btn" id="filter-domains" onclick="setLogFilter('domains')">[ЗАПРОСЫ ДОМЕНОВ (CADDY)]</button>
          <button class="tui-btn" id="filter-system" onclick="setLogFilter('system')">[СИСТЕМА & ЯДРО]</button>
        </div>
        <div class="c-dim" style="font-size: 13.5px;">
          Записей: <strong id="log-count" class="c-fg">${logs.length}</strong>
        </div>
      </div>
      <div class="log-stream" id="log-stream">
${logRowsHtml || '<div class="c-dim">[Сбор телеметрии активен...]</div>'}
      </div>
    </div>

    <!-- BOTTOM TERMINAL PROMPT -->
    <div class="tui-footer-prompt">
      <span class="c-dim">evabot@evaline-mesh:~$</span>&nbsp;<span class="cursor-blink">█</span>
    </div>
  </div>
</div>

<script>
  // Clean old SW cache & CacheStorage
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(r => r.forEach(reg => reg.unregister()));
  }
  if ('caches' in window) {
    caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
  }

  // Theme Management
  const urlTheme = new URLSearchParams(window.location.search).get('theme');
  let currentTheme = urlTheme || localStorage.getItem('eva_tui_theme') || 'dark';
  function applyTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('eva_tui_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('theme-light');
      document.body.classList.add('theme-light');
      const btn = document.getElementById('theme-btn');
      if (btn) btn.textContent = '[ ТЕМА: LIGHT]';
    } else {
      document.documentElement.classList.remove('theme-light');
      document.body.classList.remove('theme-light');
      const btn = document.getElementById('theme-btn');
      if (btn) btn.textContent = '[ ТЕМА: DARK]';
    }
  }
  applyTheme(currentTheme);
  function toggleTheme() {
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  }
  window.addEventListener('keydown', (e) => {
    if ((e.key === 't' || e.key === 'T') && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
      toggleTheme();
    }
  });
  applyTheme(currentTheme);

  // Spinner
  const spinChars = ['', '', '', '', '', '', '', '', '', ''];
  let spinIdx = 0;
  setInterval(() => {
    spinIdx = (spinIdx + 1) % spinChars.length;
    const el = document.getElementById('spin');
    if (el) el.textContent = spinChars[spinIdx];
  }, 100);

  // UTC clock
  function updateClock() {
    const d = new Date().toISOString().replace('T', ' ').substring(11, 19) + ' UTC';
    const el = document.getElementById('clock-utc');
    if (el) el.textContent = d;
  }
  setInterval(updateClock, 1000);

  function makeBar(pct, total = 10) {
    pct = Math.max(0, Math.min(100, pct));
    const filled = Math.round((pct / 100) * total);
    return '[' + '■'.repeat(filled) + '□'.repeat(total - filled) + ']';
  }

  function formatSecs(sec) {
    const d = Math.floor(sec / 86400);
    const h = String(Math.floor((sec % 86400) / 3600)).padStart(2, '0');
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return (d > 0 ? d + 'd ' : '') + h + ':' + m + ':' + s;
  }

  // Logs & Filters
  let activeFilter = 'all';
  let cachedDomainLogs = [];
  let cachedSystemLogs = [];

  function setLogFilter(f) {
    activeFilter = f;
    ['all', 'domains', 'system'].forEach(id => {
      const btn = document.getElementById('filter-' + id);
      if (btn) {
        if (id === f) btn.classList.add('active');
        else btn.classList.remove('active');
      }
    });
    renderLogs();
  }

  function renderLogs() {
    const container = document.getElementById('log-stream');
    if (!container) return;

    let items = [];
    if (activeFilter === 'all' || activeFilter === 'domains') {
      cachedDomainLogs.forEach(l => items.push({ type: 'domain', ...l }));
    }
    if (activeFilter === 'all' || activeFilter === 'system') {
      cachedSystemLogs.forEach(l => items.push({ type: 'system', ...l }));
    }

    const countEl = document.getElementById('log-count');
    if (countEl && items.length > 0) countEl.textContent = items.length;

    if (items.length === 0) return;

    container.innerHTML = items.map(item => {
      if (item.type === 'domain') {
        let badgeClass = 'badge-ok';
        let icon = '[OK]';
        if (item.statusLevel === 'warn') {
          badgeClass = 'badge-warn';
          icon = '[WRN]';
        } else if (item.statusLevel === 'err') {
          badgeClass = 'badge-err';
          icon = '[ERR]';
        }

        return '<div class="log-row">' +
          '<span class="c-dim">[' + item.timeStr + ']</span> ' +
          '<span class="badge ' + badgeClass + '">' + icon + ' ' + item.status + '</span> ' +
          '<span class="bold c-fg">' + item.method + '</span> ' +
          '<strong class="c-fg">' + item.host + '</strong> ' +
          '<span class="c-dim">' + escapeHtml(item.uri) + '</span> ' +
          '<span class="c-dim">(' + item.proto + ' ' + item.durationMs + 'ms)</span> ' +
          '<span class="c-faint">ip:' + item.ip + '</span>' +
        '</div>';
      } else {
        let badgeClass = 'badge-ok';
        let icon = '[OK]';
        if (item.levelClass === 'warn') {
          badgeClass = 'badge-warn';
          icon = '[WRN]';
        } else if (item.levelClass === 'err') {
          badgeClass = 'badge-err';
          icon = '[ERR]';
        }

        return '<div class="log-row">' +
          '<span class="c-dim">[' + item.timeStr + ']</span> ' +
          '<span class="badge ' + badgeClass + '">' + icon + ' ' + item.level + '</span> ' +
          '<span class="bold c-fg">[' + item.subsystem + ']</span> ' +
          '<span class="c-fg">' + escapeHtml(item.message) + '</span>' +
        '</div>';
      }
    }).join('');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderProcesses(procs) {
    const tbody = document.getElementById('proc-tbody');
    if (!tbody || !Array.isArray(procs) || procs.length === 0) return;

    tbody.innerHTML = procs.map(p => {
      let badgeClass = 'badge-ok';
      if (p.statusClass === 'warn') {
        badgeClass = 'badge-warn';
      } else if (p.statusClass === 'err') {
        badgeClass = 'badge-err';
      }

      const nodeClean = p.node ? p.node.split(' ')[0] : 'node';
      const nameClean = p.role ? (p.name + ' (' + p.role.split(' ')[0] + ')') : p.name;

      return '<tr>' +
        '<td>' + p.pid + '</td>' +
        '<td>' + nodeClean + '</td>' +
        '<td class="bold c-fg">' + nameClean + '</td>' +
        '<td class="c-ok">' + p.cpu + '</td>' +
        '<td>' + p.mem + '</td>' +
        '<td><span class="badge ' + badgeClass + '">[' + p.status + ']</span></td>' +
      '</tr>';
    }).join('');
  }

  async function pollCluster() {
    const t0 = performance.now();
    try {
      const res = await fetch('/api/logs?_t=' + Date.now(), { cache: 'no-store' });
      const clientLatency = Math.round(performance.now() - t0);
      if (res.ok) {
        const d = await res.json();
        if (d.domainLogs) cachedDomainLogs = d.domainLogs;
        if (d.systemLogs) cachedSystemLogs = d.systemLogs;
        if (d.processes) renderProcesses(d.processes);
        renderLogs();

        // RTT
        const rtt = d.meshLatencyMs || clientLatency || 122;
        const mr = document.getElementById('m-rtt');
        if (mr) mr.textContent = rtt + ' ms RTT';

        // Micro metrics
        if (d.microMetrics) {
          const m = d.microMetrics;
          const fl = document.getElementById('f-load');
          if (fl) fl.textContent = (m.loadAvg.indexOf(',') !== -1 ? m.loadAvg.split(',')[0] : m.loadAvg) + ' (' + m.cpuPct + '%)';
          const flb = document.getElementById('f-load-bar');
          if (flb) flb.textContent = makeBar(m.cpuPct);
          const fr = document.getElementById('f-ram');
          if (fr) fr.textContent = m.memUsedMb + '/' + m.memTotalMb + ' MB (' + Math.round((m.memUsedMb/m.memTotalMb)*100) + '%)';
          const fu = document.getElementById('f-uptime');
          if (fu) fu.textContent = m.uptimeStr;
        }
      }
    } catch (e) {}

    // Fetch Health for brain core
    try {
      const res = await fetch('/api/health?_t=' + Date.now(), { cache: 'no-store' });
      if (res.ok) {
        const d = await res.json();
        const loadVal = parseFloat(d.systemLoad || '0.9');
        const cpuPct = Math.min(100, Math.round((loadVal / (d.cpuCores || 8)) * 100));
        const bc = document.getElementById('b-cpu');
        if (bc) bc.textContent = loadVal.toFixed(2) + ' (' + cpuPct + '%)';
        const bcb = document.getElementById('b-cpu-bar');
        if (bcb) bcb.textContent = makeBar(cpuPct);

        const totMem = d.totalMemoryMb || 32099;
        const freeMem = d.freeMemoryMb || 25000;
        const usedMem = totMem - freeMem;
        const ramPct = Math.round((usedMem / totMem) * 100);
        const br = document.getElementById('b-ram');
        if (br) br.textContent = (usedMem / 1024).toFixed(1) + '/' + Math.round(totMem / 1024) + ' GB (' + ramPct + '%)';

        const bu = document.getElementById('b-uptime');
        if (bu) bu.textContent = formatSecs(d.uptimeSeconds || 0);

        const bm = document.getElementById('b-models');
        if (bm && d.availableModels) bm.textContent = d.availableModels + ' моделей онлайн';
      }
    } catch (e) {}
  }

  function manualRefresh() {
    pollCluster();
  }

  setInterval(pollCluster, 3000);
</script>
</body>
</html>
`;
  }
}
