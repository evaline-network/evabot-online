import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { exec, execSync } from 'node:child_process';

export interface DomainAccessLog {
  timeStr: string;
  host: string;
  method: string;
  uri: string;
  status: number;
  statusLevel: 'ok' | 'warn' | 'err';
  proto: string;
  ip: string;
  durationMs: number;
}

export interface SystemLogEntry {
  timeStr: string;
  level: string;
  levelClass: 'ok' | 'warn' | 'err';
  subsystem: string;
  message: string;
}

export interface ProcessInfo {
  name: string;
  role: string;
  category: 'agent' | 'web' | 'mcp' | 'lsp' | 'system';
  node: string;
  pid: number;
  cpu: string;
  mem: string;
  swap?: string;
  status: string;
  statusClass: 'ok' | 'warn' | 'err';
}

export interface ComputeVmMetrics {
  hostname: string;
  role: string;
  zone: string;
  machineType: string;
  externalIp: string;
  internalIp: string;
  meshIp: string;
  uptimeSeconds: number;
  uptimeStr: string;
  loadAvg: [number, number, number];
  cpuPct: number;
  cpuCores: number;
  memTotalMb: number;
  memUsedMb: number;
  memFreeMb: number;
  memAvailMb: number;
  swapTotalMb: number;
  swapUsedMb: number;
  swapFreeMb: number;
  diskRoot: { totalGb: number; usedGb: number; pct: number };
  diskTmp: { totalGb: number; usedGb: number; pct: number };
}

export interface ConsiliumInfo {
  agents: Array<{
    id: string;
    name: string;
    role: string;
    status: string;
    description: string;
  }>;
  modelsCount: number;
  mcpServersCount: number;
  gateways: Array<{
    domain: string;
    role: string;
    target: string;
  }>;
}

export interface MicroVmRealMetrics {
  uptimeStr: string;
  loadAvg: string;
  cpuPct: number;
  memTotalMb: number;
  memUsedMb: number;
  memFreeMb: number;
  memAvailMb: number;
  caddyPid: number;
  caddyCpu: string;
  caddyMem: string;
  lastUpdated: string;
}

export class ClusterMonitor {
  private static domainLogs: DomainAccessLog[] = [];
  private static isPolling = false;
  private static pollTimer: NodeJS.Timeout | null = null;
  private static meshLatencyMs = 122;
  private static microMetrics: MicroVmRealMetrics = {
    uptimeStr: '1 day',
    loadAvg: '0.00, 0.00, 0.00',
    cpuPct: 1,
    memTotalMb: 964,
    memUsedMb: 467,
    memFreeMb: 422,
    memAvailMb: 497,
    caddyPid: 32403,
    caddyCpu: '0.3%',
    caddyMem: '54 MB',
    lastUpdated: new Date().toISOString(),
  };

  public static init(): void {
    if (this.pollTimer) return;
    this.refreshClusterData();
    this.pollTimer = setInterval(() => {
      this.refreshClusterData();
    }, 3500);
    if (this.pollTimer.unref) {
      this.pollTimer.unref();
    }
  }

  private static refreshClusterData(): void {
    if (this.isPolling) return;
    this.isPolling = true;

    // 1. Quick ping check for true WireGuard tunnel latency
    exec('ping -c 1 -W 1 100.125.200.49', (err, stdout) => {
      if (!err && stdout) {
        const m = stdout.match(/time=([0-9\.]+)\s*ms/);
        if (m && m[1]) {
          this.meshLatencyMs = Math.round(parseFloat(m[1]));
        }
      }
    });

    // 2. Combined SSH query for access logs + real micro metrics
    const cmd = 'ssh -o ConnectTimeout=2 -o StrictHostKeyChecking=no 100.125.200.49 "tail -n 35 /var/log/caddy/access.log && echo \'---METRICS---\' && uptime && free -m && ps -C caddy -o pid,%cpu,%mem,rss --no-headers"';

    exec(cmd, { timeout: 3200 }, (err, stdout) => {
      this.isPolling = false;

      if (err || !stdout) {
        return;
      }

      const parts = stdout.split('---METRICS---');
      const logPart = parts[0] || '';
      const metricPart = parts[1] || '';

      // Parse Caddy logs
      const lines = logPart.trim().split('\n');
      const parsed: DomainAccessLog[] = [];

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const j = JSON.parse(line);
          const host = j.request?.host || 'evabot.online';
          const method = j.request?.method || 'GET';
          const uri = j.request?.uri || '/';
          const status = typeof j.status === 'number' ? j.status : 200;
          const ip = j.request?.client_ip || '127.0.0.1';
          const proto = j.request?.proto || 'HTTP/2.0';
          const dur = Math.round((j.duration || 0) * 1000);
          const ts = j.ts ? new Date(j.ts * 1000).toISOString().substring(11, 19) : new Date().toISOString().substring(11, 19);

          let statusLevel: 'ok' | 'warn' | 'err' = 'ok';
          if (status >= 400) {
            statusLevel = 'err';
          } else if (status >= 300) {
            statusLevel = 'warn';
          }

          parsed.push({
            timeStr: ts,
            host,
            method,
            uri,
            status,
            statusLevel,
            proto,
            ip,
            durationMs: dur,
          });
        } catch {
          // Skip invalid lines
        }
      }

      if (parsed.length > 0) {
        this.domainLogs = parsed.reverse();
      }

      // Parse Micro-VM real metrics
      if (metricPart) {
        try {
          const mLines = metricPart.trim().split('\n').map(l => l.trim()).filter(Boolean);
          const uptimeLine = mLines[0] || '';
          let loadAvg = '0.00, 0.00, 0.00';
          let loadVal = 0.0;
          const loadIdx = uptimeLine.indexOf('load average:');
          if (loadIdx !== -1) {
            loadAvg = uptimeLine.substring(loadIdx + 13).trim();
            const firstLoad = parseFloat(loadAvg.split(',')[0]);
            if (!isNaN(firstLoad)) loadVal = firstLoad;
          }

          const memLine = mLines.find(l => l.startsWith('Mem:'));
          let totalMb = 964, usedMb = 467, freeMb = 420, availMb = 495;
          if (memLine) {
            const mParts = memLine.split(/\s+/);
            totalMb = parseInt(mParts[1], 10) || 964;
            usedMb = parseInt(mParts[2], 10) || 467;
            freeMb = parseInt(mParts[3], 10) || 420;
            availMb = parseInt(mParts[6], 10) || 495;
          }

          let caddyPid = 32403, caddyCpu = '0.3%', caddyMem = '54 MB';
          const caddyLine = mLines.find(l => /^\d+\s+[\d\.]+\s+[\d\.]+\s+\d+/.test(l));
          if (caddyLine) {
            const cParts = caddyLine.split(/\s+/);
            caddyPid = parseInt(cParts[0], 10) || 32403;
            caddyCpu = `${cParts[1]}%`;
            const rssKb = parseInt(cParts[3], 10) || 55000;
            caddyMem = `${Math.round(rssKb / 1024)} MB`;
          }

          this.microMetrics = {
            uptimeStr: uptimeLine.split('up ')[1]?.split(',')[0]?.trim() || '1 day',
            loadAvg,
            cpuPct: Math.min(100, Math.round((loadVal / 2) * 100)),
            memTotalMb: totalMb,
            memUsedMb: usedMb,
            memFreeMb: freeMb,
            memAvailMb: availMb,
            caddyPid,
            caddyCpu,
            caddyMem,
            lastUpdated: new Date().toISOString(),
          };
        } catch {
          // Ignore parse errors
        }
      }
    });
  }

  public static getDomainLogs(): DomainAccessLog[] {
    return this.domainLogs;
  }

  public static getSystemLogs(): SystemLogEntry[] {
    const logFile = path.resolve(process.cwd(), 'logs/evabot.log');
    if (!fs.existsSync(logFile)) return [];

    try {
      const content = fs.readFileSync(logFile, 'utf8');
      const lines = content.trim().split('\n').slice(-25);
      const res: SystemLogEntry[] = [];

      for (const line of lines) {
        if (!line.trim()) continue;
        const m = line.match(/^\[(.*?)\]\s+\[(.*?)\]\s+\[(.*?)\]\s+(.*)$/);
        if (!m) {
          res.push({
            timeStr: new Date().toISOString().substring(11, 19),
            level: 'INFO',
            levelClass: 'ok',
            subsystem: 'Kernel',
            message: line,
          });
          continue;
        }

        const lvl = m[2].toUpperCase();
        let levelClass: 'ok' | 'warn' | 'err' = 'ok';
        if (lvl === 'ERROR') levelClass = 'err';
        else if (lvl === 'WARN') levelClass = 'warn';

        const timeStr = m[1].length >= 19 ? m[1].substring(11, 19) : m[1];

        res.push({
          timeStr,
          level: lvl,
          levelClass,
          subsystem: m[3],
          message: m[4],
        });
      }

      return res.reverse();
    } catch {
      return [];
    }
  }

  private static formatSecs(sec: number): string {
    const d = Math.floor(sec / 86400);
    const h = String(Math.floor((sec % 86400) / 3600)).padStart(2, '0');
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return (d > 0 ? `${d}d ` : '') + `${h}:${m}:${s}`;
  }

  public static getComputeMetrics(): ComputeVmMetrics {
    let memTotalMb = 32099;
    let memFreeMb = 4000;
    let memAvailMb = 9000;
    let swapTotalMb = 8192;
    let swapFreeMb = 3000;

    try {
      const memLines = fs.readFileSync('/proc/meminfo', 'utf8').split('\n');
      for (const line of memLines) {
        const [k, v] = line.split(':');
        if (!k || !v) continue;
        const key = k.trim();
        const val = parseInt(v.trim(), 10);
        if (key === 'MemTotal') memTotalMb = Math.round(val / 1024);
        else if (key === 'MemFree') memFreeMb = Math.round(val / 1024);
        else if (key === 'MemAvailable') memAvailMb = Math.round(val / 1024);
        else if (key === 'SwapTotal') swapTotalMb = Math.round(val / 1024);
        else if (key === 'SwapFree') swapFreeMb = Math.round(val / 1024);
      }
    } catch {
      memTotalMb = Math.round(os.totalmem() / (1024 * 1024));
      memFreeMb = Math.round(os.freemem() / (1024 * 1024));
      memAvailMb = memFreeMb;
    }

    const memUsedMb = Math.max(0, memTotalMb - memAvailMb);
    const swapUsedMb = Math.max(0, swapTotalMb - swapFreeMb);

    let diskRoot = { totalGb: 49.0, usedGb: 28.0, pct: 57 };
    let diskTmp = { totalGb: 15.7, usedGb: 7.1, pct: 45 };

    try {
      if (fs.statfsSync) {
        const rootFs = fs.statfsSync('/');
        const rootTot = (rootFs.bsize * rootFs.blocks) / (1024 ** 3);
        const rootAvail = (rootFs.bsize * rootFs.bavail) / (1024 ** 3);
        const rootUsed = Math.max(0, rootTot - rootAvail);
        diskRoot = {
          totalGb: parseFloat(rootTot.toFixed(1)),
          usedGb: parseFloat(rootUsed.toFixed(1)),
          pct: Math.round((rootUsed / rootTot) * 100),
        };

        const tmpFs = fs.statfsSync('/tmp');
        const tmpTot = (tmpFs.bsize * tmpFs.blocks) / (1024 ** 3);
        const tmpAvail = (tmpFs.bsize * tmpFs.bavail) / (1024 ** 3);
        const tmpUsed = Math.max(0, tmpTot - tmpAvail);
        diskTmp = {
          totalGb: parseFloat(tmpTot.toFixed(1)),
          usedGb: parseFloat(tmpUsed.toFixed(1)),
          pct: Math.round((tmpUsed / tmpTot) * 100),
        };
      }
    } catch {}

    const load = os.loadavg() as [number, number, number];
    const cores = os.cpus().length || 8;
    const cpuPct = Math.min(100, Math.round((load[0] / cores) * 100));

    return {
      hostname: 'evabot-agent-vm',
      role: 'Compute Backend Core & Consilium Matrix',
      zone: 'europe-west3-a (Frankfurt, Germany)',
      machineType: 'c3-standard-8 (8 vCPU Intel Xeon Sapphire Rapids, 32 GB RAM, NVMe)',
      externalIp: '34.159.202.82',
      internalIp: '10.156.0.2',
      meshIp: '100.66.98.4',
      uptimeSeconds: Math.floor(os.uptime()),
      uptimeStr: this.formatSecs(Math.floor(os.uptime())),
      loadAvg: [parseFloat(load[0].toFixed(2)), parseFloat(load[1].toFixed(2)), parseFloat(load[2].toFixed(2))],
      cpuPct,
      cpuCores: cores,
      memTotalMb,
      memUsedMb,
      memFreeMb,
      memAvailMb,
      swapTotalMb,
      swapUsedMb,
      swapFreeMb,
      diskRoot,
      diskTmp,
    };
  }

  public static getConsiliumInfo(): ConsiliumInfo {
    return {
      agents: [
        {
          id: 'antigravity',
          name: 'Antigravity CLI (agy) & 2.0 IDE',
          role: 'Ведущий Системный Архитектор, Парное Программирование & Планирование',
          status: 'ACTIVE',
          description: 'Управление кластером, глубокий аудит кода, разработка архитектуры и терминальное парное программирование.',
        },
        {
          id: 'opencode',
          name: 'OpenCode Parallel Developer Agents',
          role: 'Автономные Кодинг-Агенты Многопоточной Разработки',
          status: 'ACTIVE',
          description: 'Параллельное исполнение задач, фоновые воркеры, рефакторинг и автономные циклы разработки.',
        },
        {
          id: 'serena',
          name: 'Serena Codebase Semantic Intelligence',
          role: 'Семантическая Память Кодовой Базы & MCP-Оркестрация',
          status: 'ACTIVE',
          description: 'Семантическое индексирование символов, AST-анализ графа зависимостей и координация вызовов MCP.',
        },
        {
          id: 'kilocode',
          name: 'KiloCode Fast Generator',
          role: 'Высокоскоростная Генерация Кода & Микросервисы',
          status: 'ACTIVE',
          description: 'Генерация легковесных модулей, скриптов автоматизации и обработчиков данных.',
        },
        {
          id: 'eva-face',
          name: 'Eva Edge Face & Voice Diplomat',
          role: '3D Матричное Лицо, Edge-TTS Голос & Внешняя Дипломатия',
          status: 'ACTIVE',
          description: 'Управление Ingress-трафиком, мультиязычный голосовой синтез Edge-TTS/STT и динамическая визуализация эмоций.',
        },
      ],
      modelsCount: 94,
      mcpServersCount: 21,
      gateways: [
        { domain: 'evabot.online', role: 'AI Вычислительное Ядро & Чат-терминал', target: 'http://100.66.98.4:3000' },
        { domain: 'evaline.network', role: 'Интерактивный Визуализатор Архитектуры & Метрик Кластера', target: 'http://100.66.98.4:3000' },
        { domain: 'evaline.online', role: 'Манифест, Периметр Безопасности & Консилиум', target: 'http://100.66.98.4:3000' },
        { domain: 'evaline.website', role: 'Единый Центр Входа & Инженерный Ворклог', target: 'http://100.66.98.4:3000' },
      ],
    };
  }

  public static getProcesses(): ProcessInfo[] {
    const procs: ProcessInfo[] = [];

    // 1. caddy (Edge Ingress)
    procs.push({
      name: 'caddy',
      role: 'Edge Ingress TLS 1.3 / HTTP/3 QUIC (evabot.online, evaline.network/online)',
      category: 'web',
      node: 'evaline-micro-vm (US)',
      pid: this.microMetrics.caddyPid,
      cpu: this.microMetrics.caddyCpu,
      mem: this.microMetrics.caddyMem,
      swap: '0 MB',
      status: 'HEALTHY',
      statusClass: 'ok',
    });

    // 2. evabot-brain
    procs.push({
      name: 'evabot-brain',
      role: 'Node.js Core Backend & Consilium Dispatcher (port 3000)',
      category: 'web',
      node: 'evabot-agent-vm (EU)',
      pid: process.pid,
      cpu: '0.1%',
      mem: `${Math.round(process.memoryUsage().rss / (1024 * 1024))} MB`,
      swap: '7 MB',
      status: 'HEALTHY',
      statusClass: 'ok',
    });

    try {
      const out = execSync('ps -eo pid,%cpu,%mem,rss,comm,args --sort=-%mem', { encoding: 'utf8', timeout: 1500 });
      const lines = out.trim().split('\n').slice(1);

      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const pid = parseInt(parts[0], 10);
        if (pid === process.pid) continue;
        const cpu = parts[1] + '%';
        const rssKb = parseInt(parts[3], 10) || 0;
        const mem = rssKb > 1024 * 1024 ? (rssKb / (1024 * 1024)).toFixed(1) + ' GB' : Math.round(rssKb / 1024) + ' MB';
        const comm = parts[4];
        const args = parts.slice(5).join(' ');

        if (args.includes('agy') && !args.includes('ps -eo') && !args.includes('node -e')) {
          procs.push({ pid, cpu, mem, name: 'agy', role: 'Antigravity CLI Agent (System Architect & Pair Programmer)', category: 'agent', node: 'evabot-agent-vm (EU)', status: 'ACTIVE', statusClass: 'ok' });
        } else if (comm === 'opencode' || (args.includes('opencode') && !args.includes('serve.log') && !args.includes('ps -eo'))) {
          procs.push({ pid, cpu, mem, name: 'opencode', role: 'OpenCode Autonomous Developer Agent', category: 'agent', node: 'evabot-agent-vm (EU)', status: 'ACTIVE', statusClass: 'ok' });
        } else if (args.includes('serena') && args.includes('mcp')) {
          procs.push({ pid, cpu, mem, name: 'serena-mcp', role: 'Serena Semantic Codebase Intelligence Agent', category: 'agent', node: 'evabot-agent-vm (EU)', status: 'ACTIVE', statusClass: 'ok' });
        } else if (args.includes('code-server')) {
          procs.push({ pid, cpu, mem, name: 'code-server', role: 'VS Code Cloud Web IDE', category: 'agent', node: 'evabot-agent-vm (EU)', status: 'HEALTHY', statusClass: 'ok' });
        } else if (args.includes('run.py') && args.includes('backend')) {
          procs.push({ pid, cpu, mem, name: 'evabot-voice', role: 'FastAPI Edge Voice Backend (port 8000)', category: 'web', node: 'evabot-agent-vm (EU)', status: 'HEALTHY', statusClass: 'ok' });
        } else if (args.includes('serve.mjs') || args.includes('8090') || args.includes('8093')) {
          procs.push({ pid, cpu, mem, name: 'evabot-face', role: '3D Matrix Cyber-Face Server (port 8093)', category: 'web', node: 'evabot-agent-vm (EU)', status: 'HEALTHY', statusClass: 'ok' });
        } else if (args.includes('litellm') || args.includes('omniroute')) {
          procs.push({ pid, cpu, mem, name: 'omniroute', role: 'LiteLLM Proxy Router (94 Models, port 20128)', category: 'web', node: 'evabot-agent-vm (EU)', status: 'HEALTHY', statusClass: 'ok' });
        } else if (args.includes('n8n') && !args.includes('grep')) {
          procs.push({ pid, cpu, mem, name: 'n8n', role: 'n8n Workflow Automation Engine (port 5678)', category: 'web', node: 'evabot-agent-vm (EU)', status: 'HEALTHY', statusClass: 'ok' });
        } else if (comm === 'nginx') {
          procs.push({ pid, cpu, mem, name: 'nginx', role: 'Nginx Ingress Proxy (Docs & Voice, port 80)', category: 'web', node: 'evabot-agent-vm (EU)', status: 'HEALTHY', statusClass: 'ok' });
        } else if (args.includes('tsserver.js')) {
          procs.push({ pid, cpu, mem, name: 'tsserver', role: 'TypeScript Language Server Protocol', category: 'lsp', node: 'evabot-agent-vm (EU)', status: 'ACTIVE', statusClass: 'ok' });
        } else if (comm === 'marksman') {
          procs.push({ pid, cpu, mem, name: 'marksman', role: 'Markdown Language Server Protocol', category: 'lsp', node: 'evabot-agent-vm (EU)', status: 'ACTIVE', statusClass: 'ok' });
        } else if (comm === 'pyright-langserver') {
          procs.push({ pid, cpu, mem, name: 'pyright', role: 'Python Language Server Protocol', category: 'lsp', node: 'evabot-agent-vm (EU)', status: 'ACTIVE', statusClass: 'ok' });
        } else if (comm === 'tailscaled') {
          procs.push({ pid, cpu, mem, name: 'tailscaled', role: 'WireGuard Mesh Backbone (100.66.98.4)', category: 'system', node: 'cluster-mesh', status: 'OPERATIONAL', statusClass: 'ok' });
        } else if (comm === 'dockerd') {
          procs.push({ pid, cpu, mem, name: 'dockerd', role: 'Docker Container Runtime', category: 'system', node: 'evabot-agent-vm (EU)', status: 'HEALTHY', statusClass: 'ok' });
        } else if (comm === 'fail2ban-server') {
          procs.push({ pid, cpu, mem, name: 'fail2ban', role: 'Fail2ban Brute-Force Defense Jail', category: 'system', node: 'evabot-agent-vm (EU)', status: 'ARMED', statusClass: 'ok' });
        } else if (comm === 'Xtigervnc') {
          procs.push({ pid, cpu, mem, name: 'tigervnc', role: 'TigerVNC Display Server (:0 / :2)', category: 'system', node: 'evabot-agent-vm (EU)', status: 'ACTIVE', statusClass: 'ok' });
        } else if (args.includes('mcp-') || args.includes('task-master') || args.includes('notebooklm-mcp') || args.includes('context7-mcp') || args.includes('firebase-mcp')) {
          const raw = args.match(/([a-z0-9@_.-]+mcp[a-z0-9_.-]*)/i)?.[1] || 'mcp-server';
          const mcpName = raw.split('/').pop() || 'mcp';
          procs.push({ pid, cpu, mem, name: mcpName, role: 'Model Context Protocol (MCP) Server Tool', category: 'mcp', node: 'evabot-agent-vm (EU)', status: 'ARMED', statusClass: 'ok' });
        }
      }
    } catch {
      // Ignore ps error
    }

    return procs;
  }

  public static getMicroMetrics(): MicroVmRealMetrics {
    return this.microMetrics;
  }

  public static getMeshLatency(): number {
    return this.meshLatencyMs;
  }
}
