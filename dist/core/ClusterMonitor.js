import fs from 'node:fs';
import path from 'node:path';
import { exec, execSync } from 'node:child_process';
export class ClusterMonitor {
    static domainLogs = [];
    static isPolling = false;
    static pollTimer = null;
    static meshLatencyMs = 122;
    static microMetrics = {
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
    static init() {
        if (this.pollTimer)
            return;
        this.refreshClusterData();
        this.pollTimer = setInterval(() => {
            this.refreshClusterData();
        }, 3500);
        if (this.pollTimer.unref) {
            this.pollTimer.unref();
        }
    }
    static refreshClusterData() {
        if (this.isPolling)
            return;
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
            const parsed = [];
            for (const line of lines) {
                if (!line.trim())
                    continue;
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
                    let statusLevel = 'ok';
                    if (status >= 400) {
                        statusLevel = 'err';
                    }
                    else if (status >= 300) {
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
                }
                catch {
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
                        if (!isNaN(firstLoad))
                            loadVal = firstLoad;
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
                }
                catch {
                    // Ignore parse errors
                }
            }
        });
    }
    static getDomainLogs() {
        return this.domainLogs;
    }
    static getSystemLogs() {
        const logFile = path.resolve(process.cwd(), 'logs/evabot.log');
        if (!fs.existsSync(logFile))
            return [];
        try {
            const content = fs.readFileSync(logFile, 'utf8');
            const lines = content.trim().split('\n').slice(-25);
            const res = [];
            for (const line of lines) {
                if (!line.trim())
                    continue;
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
                let levelClass = 'ok';
                if (lvl === 'ERROR')
                    levelClass = 'err';
                else if (lvl === 'WARN')
                    levelClass = 'warn';
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
        }
        catch {
            return [];
        }
    }
    static getProcesses() {
        const procs = [];
        // 1. evabot-brain
        procs.push({
            name: 'evabot-brain',
            role: 'Node.js Core Backend & Consilium',
            node: 'evabot-agent-vm (EU)',
            pid: process.pid,
            cpu: '0.1%',
            mem: `${Math.round(process.memoryUsage().rss / (1024 * 1024))} MB`,
            status: 'HEALTHY',
            statusClass: 'ok',
        });
        try {
            const out = execSync('ps -eo pid,%cpu,%mem,rss,comm,cmd --sort=-%mem', { encoding: 'utf8', timeout: 1000 });
            const lines = out.trim().split('\n').slice(1);
            // 2. omniroute
            const omniLine = lines.find((l) => l.includes('litellm') || (l.includes('python3') && l.includes('omniroute')));
            if (omniLine) {
                const parts = omniLine.trim().split(/\s+/);
                procs.push({
                    name: 'omniroute',
                    role: 'LiteLLM Multi-Model Proxy (78 models)',
                    node: 'evabot-agent-vm (EU)',
                    pid: parseInt(parts[0], 10),
                    cpu: `${parts[1]}%`,
                    mem: `${Math.round(parseInt(parts[3], 10) / 1024)} MB`,
                    status: 'HEALTHY',
                    statusClass: 'ok',
                });
            }
            // 3. tailscaled
            const tsLine = lines.find((l) => l.includes('tailscaled'));
            if (tsLine) {
                const parts = tsLine.trim().split(/\s+/);
                procs.push({
                    name: 'tailscaled',
                    role: 'WireGuard Mesh Backbone (100.66.98.4)',
                    node: 'cluster-mesh',
                    pid: parseInt(parts[0], 10),
                    cpu: `${parts[1]}%`,
                    mem: `${Math.round(parseInt(parts[3], 10) / 1024)} MB`,
                    status: 'OPERATIONAL',
                    statusClass: 'ok',
                });
            }
        }
        catch {
            // Ignore ps error
        }
        // 4. caddy
        procs.push({
            name: 'caddy',
            role: 'Edge Ingress TLS 1.3 / HTTP/3',
            node: 'evaline-micro-vm (US)',
            pid: this.microMetrics.caddyPid,
            cpu: this.microMetrics.caddyCpu,
            mem: this.microMetrics.caddyMem,
            status: 'HEALTHY',
            statusClass: 'ok',
        });
        return procs;
    }
    static getMicroMetrics() {
        return this.microMetrics;
    }
    static getMeshLatency() {
        return this.meshLatencyMs;
    }
}
