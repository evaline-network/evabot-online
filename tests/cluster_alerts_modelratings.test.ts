/**
 * cluster_alerts_modelratings.test.ts — coverage suite for the weak core spots:
 *   - src/core/ClusterMonitor.ts  (SSH/ping/ps seam via PATH-shadowed fake
 *     binaries — no real network or ssh is ever attempted)
 *   - src/core/AlertManager.ts    (all severities, all delivery channels,
 *     rate-limit/cooldown, stats)
 *   - src/models/ModelRatings.ts  (uncovered handle* command branches, rating
 *     edge branches, fallback chains)
 *
 * Seams used (no src/ modifications required):
 *   - exec/execSync/execFileSync resolve commands via the child's PATH, so a
 *     temp bin dir with fake `ssh`/`ping`/`ps`/`systemctl`/`docker` scripts is
 *     prepended to process.env.PATH (restored in finally).
 *   - `fs` is default-imported in ModelRatings → live property lookup →
 *     readFileSync patchable for /monitor fallback scenarios.
 *   - Static class methods (NewsEngine, SephirotEngine, ModelRegistry) and
 *     singletons (translator, knowledgeBase, cloudTts) are patchable in place.
 *   - ChatHistoryStore resolves its DB via process.env.EVABOT_CHAT_DB → temp DB.
 *   - AlertManager webhook/syslog/file channels are pointed at local-only
 *     endpoints (127.0.0.1 http server, fake dgram socket, temp log file).
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import dgram from 'node:dgram';
import { ClusterMonitor } from '../src/core/ClusterMonitor.js';
import { AlertManager, alertManager, AlertConfig } from '../src/core/AlertManager.js';
import { ModelCommand, ModelRatings } from '../src/models/ModelRatings.js';
import { ModelRegistry, GeminiModelInfo } from '../src/models/ModelRegistry.js';
import { ChatHistoryStore } from '../src/core/ChatHistoryStore.js';
import { I18nEngine } from '../src/core/I18nEngine.js';
import { knowledgeBase } from '../src/core/KnowledgeBase.js';
import { NewsEngine } from '../src/core/NewsEngine.js';
import { translator } from '../src/core/Translator.js';
import { SephirotEngine } from '../src/core/SephirotEngine.js';
import { cloudTts, voicePrefsPath } from '../src/core/CloudTTS.js';
import { getBreaker, BREAKER_PROVIDER_NAMES } from '../src/core/Resilience.js';
import { setDebugOn } from '../src/core/OpLog.js';

export async function runClusterAlertsModelRatingsTests(): Promise<boolean> {
  console.log('\n--- Running ClusterMonitor / AlertManager / ModelRatings Tests ---');
  let passed = true;

  function assert(cond: boolean, msg: string) {
    if (cond) {
      console.log(`  ✓ ${msg}`);
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      passed = false;
    }
  }

  function waitUntil(cond: () => boolean, timeoutMs = 3000, stepMs = 25): Promise<boolean> {
    return new Promise((resolve) => {
      const started = Date.now();
      const tick = () => {
        if (cond()) return resolve(true);
        if (Date.now() - started > timeoutMs) return resolve(false);
        setTimeout(tick, stepMs);
      };
      tick();
    });
  }

  // ==========================================================================
  // Shared fixtures
  // ==========================================================================
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'evabot-cam-'));
  const binDir = path.join(tmpRoot, 'bin');
  fs.mkdirSync(binDir, { recursive: true });

  const origPath = process.env.PATH || '';
  process.env.PATH = `${binDir}:${origPath}`;

  // Fake `ssh` prints the scenario file (or exits 255 when marked failed).
  const sshScenario = path.join(tmpRoot, 'ssh-out.txt');
  const sshScript = path.join(binDir, 'ssh');
  function writeSshScenario(content: string, fail = false): void {
    fs.writeFileSync(sshScript, fail ? '#!/bin/sh\nexit 255\n' : `#!/bin/sh\ncat "${sshScenario}"\n`);
    fs.chmodSync(sshScript, 0o755);
    fs.writeFileSync(sshScenario, content);
  }
  function writeBin(name: string, content: string): void {
    const p = path.join(binDir, name);
    fs.writeFileSync(p, content);
    fs.chmodSync(p, 0o755);
  }

  writeBin('ping', '#!/bin/sh\necho "64 bytes from 100.125.200.49: icmp_seq=1 ttl=64 time=42.3 ms"');
  writeBin(
    'ps',
    '#!/bin/sh\ncat <<\'PS_EOF\'\n'
    + '  PID %CPU %MEM     RSS COMMAND         COMMAND\n'
    + ' 1234  0.5  2.0  65536 litellm         /usr/bin/python3 -m litellm proxy\n'
    + ' 5678  0.1  0.3  9876 tailscaled      /usr/sbin/tailscaled --state=x\n'
    + 'PS_EOF\n'
  );
  writeBin(
    'systemctl',
    '#!/bin/sh\n'
    + 'unit="$2"\n'
    + 'case "$unit" in\n'
    + '  evabot-brain) echo active ;;\n'
    + '  omniroute) echo inactive ;;\n'
    + '  nginx) echo failed; exit 3 ;;\n'
    + '  code-server) exit 1 ;;\n'
    + '  *) echo active ;;\n'
    + 'esac\n'
  );
  const dockerOut = path.join(tmpRoot, 'docker-out.txt');
  writeBin('docker', `#!/bin/sh\ncat "${dockerOut}"\n`);

  const metricsBlock = [
    ' 14:23:01 up 3 days,  4:12,  1 user,  load average: 1.50, 0.90, 0.50',
    '              total        used        free      shared  buff/cache   available',
    'Mem:          992        512        180         16        400        480',
    '      32100 1.2 3.4 56789',
  ].join('\n');

  const logLines = [
    JSON.stringify({ ts: 1757220000.123, request: { host: 'evabot.online', method: 'GET', uri: '/api/health', client_ip: '1.2.3.4', proto: 'HTTP/2.0' }, status: 200, duration: 0.042 }),
    JSON.stringify({ ts: 1757220001.5, request: { host: 'evaline.online', method: 'POST', uri: '/chat' }, status: 304, duration: 0.15 }),
    JSON.stringify({ ts: 1757220002.7, request: { host: 'evabot.online', method: 'GET', uri: '/missing' }, status: 404, duration: 0.02 }),
    JSON.stringify({ ts: 1757220003.1, request: { host: 'evabot.online', method: 'DELETE', uri: '/api/x' }, status: 500 }),
    JSON.stringify({ request: {} }),
    'not-json-garbage-line',
  ].join('\n');

  // Local HTTP receiver for the AlertManager webhook channel (loopback only).
  let hookHits = 0;
  let hookLastBody = '';
  const hookServer = http.createServer((req, res) => {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      hookHits++;
      hookLastBody = body;
      res.writeHead(req.url === '/fail' ? 500 : 200);
      res.end('ok');
    });
  });
  await new Promise<void>((resolve) => hookServer.listen(0, '127.0.0.1', resolve));
  const hookPort = (hookServer.address() as any).port;

  // Loopback UDP receiver for the syslog channel. NOTE: deliverSyslog closes
  // its sender socket immediately after send(), which drops the packet
  // (verified 20/20) — the channel executes but cannot be verified by receipt.
  let syslogMsg = '';
  const syslogRecv = dgram.createSocket('udp4');
  syslogRecv.on('message', (m) => (syslogMsg = m.toString()));

  try {
    // ========================================================================
    // SECTION A — ClusterMonitor
    // ========================================================================
    console.log('  [ClusterMonitor]');

    // A1. Snapshot parse: logs + metrics from fake ssh output.
    writeSshScenario(logLines + '\n---METRICS---\n' + metricsBlock);
    (ClusterMonitor as any).refreshClusterData();
    const parsed = await waitUntil(() => ClusterMonitor.getMicroMetrics().cpuPct === 75);
    assert(parsed, 'refreshClusterData parses fake ssh snapshot (cpuPct=75 from load 1.50)');

    const mm = ClusterMonitor.getMicroMetrics();
    assert(mm.uptimeStr === '3 days', `uptimeStr parsed ("${mm.uptimeStr}")`);
    assert(mm.loadAvg === '1.50, 0.90, 0.50', `loadAvg parsed ("${mm.loadAvg}")`);
    assert(mm.cpuPct === 75, `cpuPct = min(100, load/2*100) = 75 (got ${mm.cpuPct})`);
    assert(mm.memTotalMb === 992 && mm.memUsedMb === 512 && mm.memFreeMb === 180 && mm.memAvailMb === 480,
      `memory parsed from free -m (${mm.memTotalMb}/${mm.memUsedMb}/${mm.memFreeMb}/${mm.memAvailMb})`);
    assert(mm.caddyPid === 32100 && mm.caddyCpu === '1.2%' && mm.caddyMem === '55 MB',
      `caddy ps line parsed (pid=${mm.caddyPid}, cpu=${mm.caddyCpu}, mem=${mm.caddyMem})`);

    const logs = ClusterMonitor.getDomainLogs();
    assert(logs.length === 5, `access log lines parsed, garbage skipped (found ${logs.length})`);
    assert(logs[0].uri === '/' && logs[0].status === 200 && logs[0].statusLevel === 'ok', 'newest log first (reversed), defaulted entry ok');
    assert(logs[1].status === 500 && logs[1].statusLevel === 'err', '500 → err');
    assert(logs.some((l) => l.status === 304 && l.statusLevel === 'warn'), '304 → warn');
    assert(logs.some((l) => l.status === 200 && l.statusLevel === 'ok' && l.durationMs === 42), '200 → ok, duration 0.042s → 42ms');
    const defaulted = logs.find((l) => l.uri === '/');
    assert(!!defaulted && defaulted.method === 'GET' && defaulted.host === 'evabot.online' && defaulted.ip === '127.0.0.1' && defaulted.proto === 'HTTP/2.0',
      'missing request fields fall back to defaults');
    assert(logs.every((l) => /^\d\d:\d\d:\d\d$/.test(l.timeStr)), 'ts converted to HH:MM:SS time string');

    // A2. Ping → mesh latency via fake ping binary.
    const latencyOk = await waitUntil(() => ClusterMonitor.getMeshLatency() === 42);
    assert(latencyOk, `fake ping latency parsed (42ms, got ${ClusterMonitor.getMeshLatency()})`);

    // A3. init() starts the 3.5s interval loop exactly once (guarded).
    ClusterMonitor.init();
    const timer1 = (ClusterMonitor as any).pollTimer;
    assert(!!timer1, 'init() starts the poll timer');
    ClusterMonitor.init();
    assert((ClusterMonitor as any).pollTimer === timer1, 'second init() does NOT re-register the timer');
    clearInterval(timer1);
    (ClusterMonitor as any).pollTimer = null;
    assert((ClusterMonitor as any).pollTimer === null, 'poll timer cleared (loop stopped)');

    // A4. Failure path: ssh exits non-zero → early return, no crash, guard reset.
    const mmBefore = ClusterMonitor.getMicroMetrics();
    writeSshScenario('', true);
    (ClusterMonitor as any).refreshClusterData();
    const failed = await waitUntil(() => (ClusterMonitor as any).isPolling === false);
    assert(failed, 'after ssh failure the polling guard is released');
    assert(ClusterMonitor.getMicroMetrics() === mmBefore, 'metrics unchanged after ssh failure');
    assert(ClusterMonitor.getDomainLogs().length === 5, 'domain logs preserved after ssh failure');

    // A5. Only logs, no ---METRICS--- marker → metrics preserved, logs updated.
    writeSshScenario(logLines);
    (ClusterMonitor as any).refreshClusterData();
    await waitUntil(() => (ClusterMonitor as any).isPolling === false);
    assert(ClusterMonitor.getMicroMetrics() === mmBefore, 'metrics preserved when metrics block absent');
    assert(ClusterMonitor.getDomainLogs().length === 5, 'logs still updated without metrics block');

    // A6. Only metrics, no log lines → logs preserved, metrics updated.
    writeSshScenario('\n\n---METRICS---\n' + metricsBlock);
    (ClusterMonitor as any).refreshClusterData();
    await waitUntil(() => ClusterMonitor.getMicroMetrics() !== mmBefore);
    assert(ClusterMonitor.getDomainLogs().length === 5, 'domain logs preserved when no new log lines (empty-parsed branch)');
    assert(ClusterMonitor.getMicroMetrics().cpuPct === 75, 'metrics re-parsed from metrics-only snapshot');

    // A7. getProcesses via fake ps (omniroute + tailscaled discovered).
    const procs = ClusterMonitor.getProcesses();
    assert(procs.length === 4, `getProcesses: brain + omniroute + tailscaled + caddy (found ${procs.length})`);
    const omni = procs.find((p) => p.name === 'omniroute');
    assert(!!omni && omni.pid === 1234 && omni.cpu === '0.5%' && omni.mem === '64 MB', 'omniroute parsed from ps (rss 65536 → 64 MB)');
    const tsd = procs.find((p) => p.name === 'tailscaled');
    assert(!!tsd && tsd.pid === 5678 && tsd.status === 'OPERATIONAL', 'tailscaled parsed from ps');
    const brain = procs.find((p) => p.name === 'evabot-brain');
    assert(!!brain && brain.pid === process.pid && brain.status === 'HEALTHY', 'brain process reported with live pid');

    // A8. getSystemLogs: crafted log file in a temp cwd (missing file → []).
    const logDir = path.join(tmpRoot, 'logs');
    fs.mkdirSync(logDir, { recursive: true });
    const cwdBefore = process.cwd();
    try {
      process.chdir(tmpRoot);
      assert(ClusterMonitor.getSystemLogs().length === 0, 'getSystemLogs returns [] when log file missing');
      fs.writeFileSync(path.join(logDir, 'evabot.log'), [
        '[2026-09-07 10:00:00.123] [INFO] [Core] hello world',
        '[2026-09-07 10:00:01.456] [WARN] [Resilience] breaker half-open',
        '[2026-09-07 10:00:02.789] [ERROR] [ChatDB] insert failed',
        'plain line without bracket format',
      ].join('\n'));
      const sysLogs = ClusterMonitor.getSystemLogs();
      assert(sysLogs.length === 4, `getSystemLogs parses crafted log (found ${sysLogs.length})`);
      const errEntry = sysLogs.find((l) => l.level === 'ERROR');
      const warnEntry = sysLogs.find((l) => l.level === 'WARN');
      assert(!!errEntry && errEntry.levelClass === 'err' && errEntry.subsystem === 'ChatDB', 'ERROR line → err class');
      assert(!!warnEntry && warnEntry.levelClass === 'warn' && warnEntry.subsystem === 'Resilience', 'WARN line → warn class');
      const plain = sysLogs.find((l) => l.subsystem === 'Kernel');
      assert(!!plain && plain.level === 'INFO' && plain.message === 'plain line without bracket format', 'non-format line → Kernel fallback entry');
      assert(/^\d\d:\d\d:\d\d$/.test(sysLogs[0].timeStr) && sysLogs[0].message === 'plain line without bracket format', 'log list reversed (newest first), HH:MM:SS time');
    } finally {
      process.chdir(cwdBefore);
    }

    // A9. getSystemLogs against the real backend log (read-only smoke).
    const realSysLogs = ClusterMonitor.getSystemLogs();
    assert(Array.isArray(realSysLogs) && realSysLogs.length <= 25, `real logs/evabot.log tail read (found ${realSysLogs.length})`);

    // ========================================================================
    // SECTION B — AlertManager
    // ========================================================================
    console.log('  [AlertManager]');

    const am = alertManager;
    const configSnapshot: AlertConfig = JSON.parse(JSON.stringify(am.getConfig()));
    function restoreConfig(): void {
      const live = am.getConfig();
      live.channels = configSnapshot.channels.map((c) => ({ ...c }));
      live.thresholds = { ...configSnapshot.thresholds };
      live.rateLimit = { ...configSnapshot.rateLimit };
    }

    // Bind the loopback UDP receiver used by the syslog channel.
    await new Promise<void>((r) => syslogRecv.bind(0, '127.0.0.1', r));
    const syslogPort = syslogRecv.address().port;

    // B1. Env-driven config load on a fresh instance (singleton re-creation).
    {
      const origInstance = (AlertManager as any).instance;
      process.env.ALERT_WEBHOOK_URL = 'http://127.0.0.1/envhook';
      process.env.ALERT_EMAIL_TO = 'a@x.test,b@x.test';
      process.env.SYSLOG_HOST = '127.0.0.1';
      process.env.SYSLOG_PORT = '1514';
      try {
        (AlertManager as any).instance = undefined;
        const fresh = AlertManager.getInstance();
        const cfg = fresh.getConfig();
        const wh = cfg.channels.find((c) => c.type === 'webhook');
        const em = cfg.channels.find((c) => c.type === 'email');
        const sl = cfg.channels.find((c) => c.type === 'syslog');
        assert(!!wh && wh.enabled && wh.config.url === 'http://127.0.0.1/envhook', 'ALERT_WEBHOOK_URL enables webhook channel');
        assert(!!em && em.enabled && Array.isArray(em.config.to) && em.config.to.length === 2, 'ALERT_EMAIL_TO enables email channel (comma split)');
        assert(!!sl && sl.enabled && sl.config.host === '127.0.0.1' && sl.config.port === 1514, 'SYSLOG_HOST/PORT enables syslog channel');
      } finally {
        (AlertManager as any).instance = origInstance;
        delete process.env.ALERT_WEBHOOK_URL;
        delete process.env.ALERT_EMAIL_TO;
        delete process.env.SYSLOG_HOST;
        delete process.env.SYSLOG_PORT;
        restoreConfig();
      }
    }

    // Point all channels at test-local targets.
    const fileLog = path.join(tmpRoot, 'alerts-test.log');
    am.setChannelEnabled('webhook', true);
    am.setChannelEnabled('email', true);
    am.setChannelEnabled('syslog', true);
    am.setChannelEnabled('desktop', true);
    am.setChannelEnabled('file', true);
    am.getConfig().channels.find((c) => c.type === 'webhook')!.config.url = `http://127.0.0.1:${hookPort}/hook`;
    am.getConfig().channels.find((c) => c.type === 'file')!.config.path = fileLog;
    {
      const slCfg = am.getConfig().channels.find((c) => c.type === 'syslog')!;
      slCfg.config.host = '127.0.0.1';
      slCfg.config.port = syslogPort;
      slCfg.config.facility = 16;
    }

    // B2. Critical alert → all enabled channels deliver.
    const statsBefore = am.getStats().totalAlerts;
    const critEvent = await am.critical('Cluster test critical', 'disk 99% on brain', 'unit-test', { disk: 99 });
    assert(!!critEvent && critEvent.severity === 'critical' && critEvent.id.startsWith('alert-'), 'critical() records an alert event with generated id');
    assert(critEvent.channels.includes('console') && critEvent.channels.includes('webhook'), 'event lists enabled channels');
    await waitUntil(() => hookHits > 0);
    assert(hookHits === 1, 'webhook POST reached the local receiver');
    const hookPayload = JSON.parse(hookLastBody);
    assert(hookPayload.event_type === 'evabot_alert' && hookPayload.severity === 'critical' && hookPayload.metadata?.disk === 99, 'webhook payload carries event + metadata');
    assert(syslogMsg.startsWith('<130>'), `syslog channel executed with priority prefix (received: "${syslogMsg.substring(0, 8)}…")`);
    assert(fs.existsSync(fileLog) && JSON.parse(fs.readFileSync(fileLog, 'utf8').trim()).id === critEvent.id, 'file channel appended a JSON line to the temp log');

    // B3. Each severity helper records its severity.
    await am.low('low sev probe', 'l');
    await am.medium('medium sev probe', 'm');
    await am.high('high sev probe', 'h');
    const stats = am.getStats();
    assert(stats.bySeverity.low >= 1 && stats.bySeverity.medium >= 1 && stats.bySeverity.high >= 1 && stats.bySeverity.critical >= 1,
      'low/medium/high/critical helpers all recorded');
    assert(stats.totalAlerts === statsBefore + 4, `total alerts incremented (before=${statsBefore}, now=${stats.totalAlerts})`);
    assert(stats.activeChannels.includes('console') && stats.activeChannels.includes('webhook'), 'activeChannels reflects enabled set');

    // B4. Rate limiting (cooldown dedup keyed by title).
    const rlFirst = await am.alert('high', 'RateLimitProbe-XYZ', 'first');
    assert(rlFirst.id !== 'rate-limited', 'first alert with fresh title is not rate limited');
    const rlSecond = await am.alert('high', 'RateLimitProbe-XYZ', 'second within cooldown');
    assert(rlSecond.id === 'rate-limited' && rlSecond.channels.length === 0, 'duplicate title inside cooldown → rate-limited stub');
    const statsAfterRl = am.getStats().totalAlerts;
    assert(statsAfterRl === stats.totalAlerts + 1, 'rate-limited alert is NOT recorded in history');
    am.getConfig().rateLimit.cooldownMs = 5;
    await new Promise((r) => setTimeout(r, 40));
    const rlThird = await am.alert('high', 'RateLimitProbe-XYZ', 'after cooldown expiry');
    assert(rlThird.id !== 'rate-limited', 'same title passes again after cooldown expires');

    // B5. getRecentAlerts filtering/limiting.
    const recent = am.getRecentAlerts(2);
    assert(recent.length === 2 && recent[0].id === rlThird.id, 'getRecentAlerts returns newest-first slice');
    const critOnly = am.getRecentAlerts(50, 'critical');
    assert(critOnly.length >= 1 && critOnly.every((a) => a.severity === 'critical'), 'severity filter works');

    // B6. Webhook failure (connection refused) is swallowed, no crash.
    am.getConfig().channels.find((c) => c.type === 'webhook')!.config.url = 'http://127.0.0.1:1/closed';
    const wfEvent = await am.alert('medium', 'WebhookFailureProbe', 'should swallow fetch error');
    assert(!!wfEvent && wfEvent.id !== 'rate-limited', 'webhook connection failure does not throw out of alert()');
    // Empty url → early return (no fetch at all).
    am.getConfig().channels.find((c) => c.type === 'webhook')!.config.url = '';
    await am.alert('low', 'WebhookEmptyUrlProbe', 'empty url skipped');
    am.getConfig().channels.find((c) => c.type === 'webhook')!.config.url = `http://127.0.0.1:${hookPort}/hook`;

    // B7. History trimming at maxAlerts.
    const savedMax = (am as any).maxAlerts;
    (am as any).maxAlerts = 2;
    await am.alert('low', 'TrimProbe-1', 'x');
    await am.alert('low', 'TrimProbe-2', 'x');
    await am.alert('low', 'TrimProbe-3', 'x');
    assert((am as any).alerts.length <= 2, `alert history trimmed to maxAlerts (len=${(am as any).alerts.length})`);
    (am as any).maxAlerts = savedMax;

    // B8. setChannelEnabled disable path.
    am.setChannelEnabled('console', false);
    assert(!am.getStats().activeChannels.includes('console'), 'setChannelEnabled(false) removes channel from active set');
    am.setChannelEnabled('console', true);

    // B9. Syslog channel disabled → deliverSyslog skipped entirely.
    syslogMsg = '';
    am.setChannelEnabled('syslog', false);
    await am.alert('low', 'SyslogDisabledProbe', 'x');
    assert(syslogMsg === '', 'disabled syslog channel sends nothing');
    am.setChannelEnabled('syslog', true);

    // Restore AlertManager state for later suites.
    restoreConfig();

    // ========================================================================
    // SECTION C — ModelRatings / ModelCommand
    // ========================================================================
    console.log('  [ModelRatings]');

    // Reset Resilience breakers (existing pattern) — earlier suites may have
    // opened omniroute/openrouter breakers.
    for (const p of BREAKER_PROVIDER_NAMES) {
      getBreaker(p).recordSuccess();
    }

    // C1. Rating edge branches via synthesized models.
    const synth = (over: Partial<GeminiModelInfo>): GeminiModelInfo => ({
      id: 'synth-test', name: 'Synth Test', provider: 'OpenRouter', category: 'OpenRouter Premium',
      description: 'synthetic', contextWindow: 4096, maxOutputTokens: 4096, recommended: false,
      tier: 'OpenCode Platform', protocol: 'openai-compatible',
      pricing: { freeTierStatus: 'Paid / Pay-As-You-Go Only', freeTierDetails: '', inputPer1MTokensUSD: '$0.50', inputPer1MTokensEUR: '€0.50', outputPer1MTokensUSD: '$1.00', outputPer1MTokensEUR: '€1.00' },
      ...over,
    } as GeminiModelInfo);
    const rate = (over: Partial<GeminiModelInfo>) => ModelRatings.computeRating(synth(over));
    assert(rate({ id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash' }).recency === 100, 'recency: gemini-3.8 → 100');
    assert(rate({ id: 'gemini-3.1-pro', name: 'Gemini 3.1 Pro' }).recency === 99, 'recency: gemini-3.1 → 99');
    assert(rate({ id: 'claude-sonnet-4', name: 'Claude Sonnet 4' }).recency === 98, 'recency: claude sonnet 4 → 98');
    assert(rate({ id: 'gemini-3.0-pro', name: 'Gemini 3.0' }).recency === 96, 'recency: gemini-3.0 → 96');
    assert(rate({ id: 'deepseek-v4', name: 'DeepSeek V4' }).recency === 95, 'recency: deepseek v4 → 95');
    assert(rate({ id: 'llama-3.3-70b', name: 'Llama 3.3 70B' }).recency === 86, 'recency: llama 3.3 → 86');
    assert(rate({ id: 'qwen3-coder', name: 'Qwen3 Coder' }).recency === 85, 'recency: qwen3 → 85');
    assert(rate({ id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' }).recency === 80, 'recency: gemini 2.0 → 80');
    assert(rate({ id: 'gpt-4o-mini', name: 'GPT-4o mini' }).recency === 75, 'recency: gpt-4o → 75');
    assert(rate({ id: 'claude-3-5-sonnet', name: 'Claude 3.5' }).recency === 70, 'recency: claude 3.5 → 70');
    assert(rate({ id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' }).recency === 60, 'recency: gemini 1.5 → 60');
    assert(rate({ id: 'llama-3.1-405b', name: 'Llama 3.1 405B' }).recency === 55, 'recency: llama 3.1 / gemma-2 → 55');
    assert(rate({ id: 'unknown-legacy', name: 'Unknown Legacy' }).recency === 50, 'recency fallback → 50');

    assert(rate({ id: 'gemini-3.1-pro', name: 'Gemini 3.1 Pro' }).quality >= 100, 'quality: gemini 3.1 pro capped at 100');
    assert(rate({ id: 'codestral-latest', name: 'Codestral' }).quality === 94, 'quality: codestral → 94');
    assert(rate({ id: 'qwen-2.5-coder-32b', name: 'Qwen 2.5 Coder 32B' }).quality === 93, 'quality: qwen-2.5-coder-32b → 93');
    assert(rate({ id: 'mistral-large-x', name: 'Mistral Large' }).quality === 75, 'quality: mistral large → 75');
    assert(rate({ id: 'x', name: 'Grok 4' }).quality === 70, 'quality: grok → 70');
    assert(rate({ id: 'jamba-x', name: 'Jamba 2' }).quality === 60, 'quality: jamba → 60');
    assert(rate({ id: 'command-r', name: 'Command R+' }).quality === 58, 'quality: command → 58');
    assert(rate({ id: 'mystery', name: 'Mystery' }).quality === 45, 'quality fallback → 45');

    assert(rate({ name: 'Gemini 2.5 Flash' }).speed === 65, 'speed: flash (+15) = 65');
    assert(rate({ name: 'Claude Haiku' }).speed === 70, 'speed: haiku (+15 +5) = 70');
    assert(rate({ name: 'Mistral-7B' }).speed === 70, 'speed: mistral-7b (+20) = 70');
    assert(rate({ name: 'gpt-4o-mini' }).speed === 60, 'speed: gpt-4o-mini (+10) = 60');
    assert(rate({ name: 'NoHype Model' }).speed === 50, 'speed: no markers = 50');

    assert(rate({ contextWindow: 3000000 }).context === 100, 'context: ≥2M → 100');
    assert(rate({ contextWindow: 1000000 }).context === 90, 'context: 1M → 90');
    assert(rate({ contextWindow: 300000 }).context === 80, 'context: 256K+ → 80');
    assert(rate({ contextWindow: 200000 }).context === 70, 'context: 200K → 70');
    assert(rate({ contextWindow: 130000 }).context === 60, 'context: 128K → 60');
    assert(rate({ contextWindow: 64000 }).context === 50, 'context: 64K → 50');
    assert(rate({ contextWindow: 32000 }).context === 35, 'context: 32K → 35');
    assert(rate({ contextWindow: 16000 }).context === 25, 'context: 16K → 25');
    assert(rate({ contextWindow: 8192 }).context === 15, 'context: 8192 → 15');
    assert(rate({ contextWindow: 1024 }).context === 10, 'context: tiny → 10');

    const costOf = (price: string) => rate({ pricing: { ...synth({}).pricing, freeTierStatus: 'Paid / Pay-As-You-Go Only', inputPer1MTokensUSD: price } }).cost;
    assert(rate({ pricing: { ...synth({}).pricing, freeTierStatus: '100% Free Quota Available' } }).cost === 100, 'cost: free tier → 100');
    assert(costOf('$0.00') === 95, 'cost: $0.00 → 95');
    assert(costOf('$0.075') === 80, 'cost: $0.075 → 80');
    assert(costOf('$0.14') === 70, 'cost: $0.14 → 70');
    assert(costOf('$0.30') === 60, 'cost: $0.30 → 60');
    assert(costOf('$0.70') === 50, 'cost: $0.70 → 50');
    assert(costOf('$1.25') === 40, 'cost: $1.25 → 40');
    assert(costOf('$2.00') === 25, 'cost: $2.00 → 25');
    assert(costOf('$3.00') === 15, 'cost: $3.00 → 15');
    assert(costOf('$15.00') === 5, 'cost: $15.00 → 5');
    assert(costOf('$9.99') === 30, 'cost: unmapped price → 30');

    // C2. Ranking helpers + formatTopList (all dimensions + reasons).
    const topOverall = ModelRatings.getTopOverall(false, 5);
    assert(topOverall.length === 5 && topOverall[0].rank === 1 && !!topOverall[0].reason, 'getTopOverall ranks paid+free by quality');
    const topFree = ModelRatings.getTopFree(5);
    assert(topFree.length > 0 && topFree.every((e) => e.model.pricing.freeTierStatus === '100% Free Quota Available'), 'getTopFree returns only free models');
    const topPaid = ModelRatings.getTopPaid(5);
    assert(topPaid.length > 0 && topPaid.every((e) => e.model.pricing.freeTierStatus === 'Paid / Pay-As-You-Go Only'), 'getTopPaid filters paid-only');
    const bySpeed = ModelRatings.getTopBySpeed(true, 5);
    assert(bySpeed.length === 5 && bySpeed[0].rating.speed >= bySpeed[4].rating.speed, 'getTopBySpeed sorts by speed desc');
    const byContext = ModelRatings.getTopByContext(true, 5);
    assert(byContext.length === 5 && byContext[0].rating.context >= byContext[4].rating.context, 'getTopByContext sorts by context desc');
    const byCost = ModelRatings.rankByDimension('cost', 5, true);
    assert(byCost.length === 5 && byCost[0].rating.cost >= byCost[4].rating.cost, 'rankByDimension("cost") sorts by cost desc');
    const list = ModelRatings.formatTopList(topFree, 'TEST TITLE');
    assert(list.includes('TEST TITLE') && list.includes('═') && list.includes('# 1') && list.includes('[FREE]') && list.includes('Reason:'), 'formatTopList renders header, ranks, badges, reasons');

    // C3. Fallback chains.
    const chainFree = ModelRatings.getFallbackChain('gemini-3.8-flash');
    assert(chainFree.length > 0 && !chainFree.includes('gemini-3.8-flash'), 'free model chain excludes the model itself, prioritizes frontier fleet');
    assert(chainFree[0] === 'gemini-3.1-pro', 'chain head is the newest frontier model');
    const paidId = ModelRegistry.getPaidOnlyModels()[0].id;
    const chainPaid = ModelRatings.getFallbackChain(paidId);
    assert(chainPaid.length > chainFree.length, 'paid model chain prepends paid alternatives');
    const chainUnknown = ModelRatings.getFallbackChain('definitely-not-a-model-id');
    assert(chainUnknown.length > 0 && chainUnknown[0] === 'gemini-3.1-pro', 'unknown model id → treated as free, fleet chain returned');

    // C4. getSmartestFreeModel (+ registry-empty fallback).
    assert(ModelRatings.getSmartestFreeModel().id === 'nvidia/nemotron-3-ultra-550b-a55b:free', 'smartest free model = Nemotron 3 Ultra (free, non-Gemini — Gemini reserved for development)');
    const realGetModelById = (ModelRegistry as any).getModelById;
    const realGetFreeModels = (ModelRegistry as any).getFreeModels;
    try {
      (ModelRegistry as any).getModelById = () => undefined;
      (ModelRegistry as any).getFreeModels = () => [];
      const fb = ModelRatings.getSmartestFreeModel();
      assert(!!fb && fb === ModelRegistry.getAllModels()[0], 'smartest-free falls back to the first catalog model when registry filtered empty');
    } finally {
      (ModelRegistry as any).getModelById = realGetModelById;
      (ModelRegistry as any).getFreeModels = realGetFreeModels;
    }

    // C5. /top variants (execute switch + handleTop filters).
    const topAll = ModelCommand.execute('/top');
    assert(topAll.includes('ТОП-5 БЕСПЛАТНЫХ') && topAll.includes('ТОП-5 ПЛАТНЫХ') && topAll.includes('/top free'), '/top renders free+paid sections and usage');
    assert(ModelCommand.execute('/top free 3').includes('ТОП-3 БЕСПЛАТНЫХ'), '/top free N renders N-size free list');
    assert(ModelCommand.execute('/top paid 3').includes('ТОП-3 ПЛАТНЫХ'), '/top paid N renders N-size paid list');
    assert(ModelCommand.execute('/top speed 3').includes('САМЫХ БЫСТРЫХ'), '/top speed renders speed ranking');
    assert(ModelCommand.execute('/top context 3').includes('БОЛЬШЕ КОНТЕКСТА'), '/top context renders context ranking');

    // C6. /free /paid /models /mcp /lsp.
    const freeOut = ModelCommand.execute('/free');
    assert(freeOut.includes('ВСЕ БЕСПЛАТНЫЕ МОДЕЛИ') && freeOut.includes('Composite:'), '/free lists every free model with ratings');
    const paidOut = ModelCommand.execute('/paid');
    assert(paidOut.includes('ВСЕ ПЛАТНЫЕ МОДЕЛИ') && paidOut.includes('Pricing: In:'), '/paid lists every paid model with pricing');
    const modelsOut = ModelCommand.execute('/models');
    assert(modelsOut.includes('СВОДКА ПО МОДЕЛЯМ') && modelsOut.includes('Всего:'), '/models renders summary counts');
    const mcpOut = ModelCommand.execute('/mcp');
    assert(mcpOut.includes('MCP СЕРВЕРЫ') && mcpOut.includes('notebooklm') && mcpOut.includes('sync-mcp'), '/mcp renders MCP server roster');
    const lspOut = ModelCommand.execute('/lsp');
    assert(lspOut.includes('LSP СЕРВЕРЫ') && lspOut.includes('typescript-language-server') && lspOut.includes('pyright'), '/lsp renders LSP roster');

    // C7. /info paths.
    assert(ModelCommand.execute('/info').includes('Использование: /info'), '/info without args → usage');
    assert(ModelCommand.execute('/inspect').includes('Использование: /info'), '/inspect alias routes to /info');
    assert(ModelCommand.execute('/info totally-unknown-model-xyz').includes('[ERROR] Модель'), '/info unknown model → error');
    const infoOut = ModelCommand.execute('/info gemini-3.8-flash');
    assert(infoOut.includes('ТЕХНИЧЕСКИЙ ПАСПОРТ') && infoOut.includes('100% FREE QUOTA') && infoOut.includes('РЕЙТИНГ И БЕНЧМАРКИ'), '/info found model renders full passport');

    // C8. /lang + /help.
    const savedLocale = I18nEngine.getLocale();
    assert(ModelCommand.execute('/lang uk').length > 0 && I18nEngine.getLocale() === 'uk', '/lang uk switches locale');
    assert(ModelCommand.execute('/lang').length > 0 && I18nEngine.getLocale() === 'en', '/lang without arg → default en');
    assert(ModelCommand.execute('/language uk').length > 0, '/language alias routes to /lang');
    I18nEngine.setLocale(savedLocale);
    const helpOut = ModelCommand.execute('/help');
    assert(helpOut.includes('COMMANDS') || helpOut.includes('КОМАНДИ'), '/help renders the command set');
    assert(ModelCommand.execute('/?').length > 0, '/? alias routes to /help');

    // C9. /history /memory /search on a temp chat DB (EVABOT_CHAT_DB seam).
    const tmpDb = path.join(tmpRoot, 'chat-test.db');
    process.env.EVABOT_CHAT_DB = tmpDb;
    const store = ChatHistoryStore.getInstance();
    assert(store.isReady() && store.getPath() === tmpDb, 'ChatHistoryStore opens temp DB via EVABOT_CHAT_DB');
    store.appendMessage({ sessionId: 's1', role: 'user', content: 'Какая модель лучше для кодинга?', model: 'm', lang: 'ru' });
    store.appendMessage({ sessionId: 'consilium', role: 'assistant', content: 'Синтез консилиума: рекомендуемая модель для долгого контекста выбрана единогласно всеми агентами.', model: 'consilium', lang: 'uk' });
    const histOut = ModelCommand.execute('/history 2');
    assert(histOut.includes('ИСТОРИЯ ЧАТА') && histOut.includes('[consilium]') && histOut.includes('ПОСЛЕДНИЕ 2'), '/history N renders recent messages with consilium tag');
    assert(histOut.includes('Синтез консилиума: рекомендуемая модель') && histOut.includes('...'), 'long message preview truncated with ellipsis');
    const histDefault = ModelCommand.execute('/history abc');
    assert(histDefault.includes('ПОСЛЕДНИЕ 2'), '/history with non-numeric arg falls back to default limit');
    const memOut = ModelCommand.execute('/memory');
    assert(memOut.includes('ПАМЯТЬ СИСТЕМЫ') && memOut.includes('БАЗА ЗНАНИЙ') && memOut.includes('ИСТОРИЯ ЧАТОВ') && memOut.includes('ChromaDB'), '/memory renders knowledge + chat + vector sections');
    // handleMemory KB failure branch.
    const realGetStats = (knowledgeBase as any).getStats;
    try {
      (knowledgeBase as any).getStats = () => { throw new Error('kb offline'); };
      const memFail = ModelCommand.execute('/memory');
      assert(memFail.includes('БАЗА ЗНАНИЙ: недоступна (kb offline)'), '/memory degrades gracefully when KB stats throw');
    } finally {
      (knowledgeBase as any).getStats = realGetStats;
    }

    // /search paths.
    assert(ModelCommand.execute('/search').includes('Использование: /search'), '/search without query → usage');
    const searchOut = ModelCommand.execute('/search модель');
    assert(searchOut.includes('ПОИСК: "модель"') && searchOut.includes('ИСТОРИЯ ЧАТОВ') && searchOut.includes('БАЗА ЗНАНИЙ') && searchOut.includes('Итого:'), '/search renders chat + KB results and totals');
    const findOut = ModelCommand.execute('/find модель');
    assert(findOut.includes('ПОИСК: "модель"'), '/find alias routes to search');
    // Chat-search failure branch.
    const realSearchMessages = (store as any).searchMessages;
    try {
      (store as any).searchMessages = () => { throw new Error('fts down'); };
      const chatFail = ModelCommand.execute('/search модель');
      assert(chatFail.includes('Поиск чатов недоступен: fts down'), '/search degrades when chat FTS throws');
    } finally {
      (store as any).searchMessages = realSearchMessages;
    }
    // KB-search failure branch.
    const realKbSearch = (knowledgeBase as any).search;
    try {
      (knowledgeBase as any).search = () => { throw new Error('kb search down'); };
      const kbFail = ModelCommand.execute('/search модель');
      assert(kbFail.includes('Поиск по KB недоступен: kb search down'), '/search degrades when KB search throws');
    } finally {
      (knowledgeBase as any).search = realKbSearch;
    }
    store.close();
    delete process.env.EVABOT_CHAT_DB;
    try { fs.unlinkSync(tmpDb); } catch { /* temp cleanup */ }

    // C10. /services with fake systemctl + docker binaries (PATH seam).
    fs.writeFileSync(dockerOut, 'evabot-n8n\nother\n');
    const svcOut = ModelCommand.execute('/services');
    assert(svcOut.includes('СИСТЕМНЫЕ СЕРВИСЫ EVA'), '/services renders the services header');
    assert(/evabot-brain\.service\s+active\s/.test(svcOut), 'systemctl is-active → active parsed');
    assert(/omniroute\s+inactive\s/.test(svcOut), 'systemctl inactive status parsed');
    assert(/nginx\s+failed\s/.test(svcOut), 'systemctl non-zero with stdout → "failed" captured');
    assert(/code-server\s+unknown\s/.test(svcOut), 'systemctl non-zero without stdout → "unknown"');
    assert(/n8n \(docker\)\s+running\s/.test(svcOut), 'docker ps names matched for n8n container');
    writeBin('docker', '#!/bin/sh\nexit 1\n');
    const svcFail = ModelCommand.execute('/services');
    assert(/n8n \(docker\)\s+unknown\s/.test(svcFail), 'docker failure → "unknown" (no crash)');

    // C11. /servers (pure ClusterMonitor + os data).
    const srvOut = ModelCommand.execute('/servers');
    assert(srvOut.includes('КЛАСТЕР EVA') && srvOut.includes('evabot-agent-vm') && srvOut.includes('evaline-micro-vm') && srvOut.includes('Load avg'), '/servers renders both cluster nodes with load/mesh data');

    // C12. /company free|paid branches.
    const companyFree = ModelCommand.execute('/company free');
    assert(companyFree.length > 50, '/company free renders free-tier company');
    assert(ModelCommand.execute('/team paid').length > 50, '/team alias + paid tier renders paid company');
    assert(ModelCommand.execute('/evaline').length > 50, '/evaline renders evaLine business company');

    // C13. /news: sync cache paths + async fetch path (NewsEngine patched, no network).
    const realGetCachedText = (NewsEngine as any).getCachedText;
    const realFetchNews = (NewsEngine as any).fetchNews;
    try {
      (NewsEngine as any).getCachedText = () => null;
      assert(ModelCommand.execute('/news').includes('Рушій новин запускає перший збір'), '/news with cold cache → warmup notice (no network)');
      (NewsEngine as any).getCachedText = () => 'CACHED-NEWS-BLOCK';
      assert(ModelCommand.execute('/news').includes('CACHED-NEWS-BLOCK'), '/news cache hit → cached text returned');
      assert(ModelCommand.execute('/новини').includes('CACHED-NEWS-BLOCK'), '/news uk alias resolves');
      assert(ModelCommand.execute('/news zzzz-not-a-tag').includes('CACHED-NEWS-BLOCK'), 'unknown news tag resolves to no-tags (no crash)');
      (NewsEngine as any).getCachedText = realGetCachedText;

      const newsItem = { title: 'EVA foam expands production', url: 'https://x.test/1', source: 'Reuters', date: '2026-09-07T10:00:00Z', category: 'war_security' as const };
      (NewsEngine as any).fetchNews = async () => ({ items: [newsItem], partialErrors: [], cached: false });
      const asyncNews = await ModelCommand.executeAsync('/news war');
      assert(asyncNews.includes('NEWS НОВИНИ EVALINE') && asyncNews.includes('EVA foam expands production'), 'executeAsync /news war fetches (mocked) and formats by tag');
      (NewsEngine as any).fetchNews = async () => { throw new Error('rss down'); };
      const newsErr = await ModelCommand.executeAsync('/news war');
      assert(newsErr.includes('[ERROR] News engine unavailable: rss down'), 'fetchNews failure → formatted error, no throw');
    } finally {
      (NewsEngine as any).getCachedText = realGetCachedText;
      (NewsEngine as any).fetchNews = realFetchNews;
    }

    // C14. /translate: parser edges + sync/async handlers (translator patched, no network).
    assert(ModelCommand.parseTranslateCommand('/translate uk Привіт').to === 'uk' && ModelCommand.parseTranslateCommand('/translate uk Привіт').text === 'Привіт', 'parseTranslateCommand extracts target + text');
    assert(ModelCommand.parseTranslateCommand('/переклад uk hi').to === 'uk', 'parseTranslateCommand resolves uk alias head');
    assert(ModelCommand.parseTranslateCommand('/top').error === 'not-a-translate-command', 'non-translate head rejected');
    assert(ModelCommand.parseTranslateCommand('/translate').error!.includes('Використання'), 'bare /translate → usage error');
    assert(ModelCommand.parseTranslateCommand('/translate 12345 hi').error!.includes('кодом мови'), 'invalid target code rejected');
    assert(ModelCommand.parseTranslateCommand('/translate uk').error!.includes('Порожній текст'), 'missing text rejected');

    const realTranslate = (translator as any).translate;
    try {
      (translator as any).translate = async () => ({
        ok: true, translations: ['Привіт, світ'], detectedLanguageCode: 'uk', charsUsed: 12, usage: { month: '2026-09', chars: 12 },
      });
      const trOk = await ModelCommand.executeAsync('/translate en Привіт, світ');
      assert(trOk.includes('Переклад → en (авто: uk)') && trOk.includes('Привіт, світ'), 'async translate ok → formatted reply with detected source');
      (translator as any).translate = async () => ({
        ok: false, translations: [], charsUsed: 0, usage: { month: '2026-09', chars: 0 }, error: '[X] квота вичерпана',
      });
      const trFail = await ModelCommand.executeAsync('/translate en Привіт');
      assert(trFail.includes('[X] квота вичерпана'), 'async translate failure → error reply');
      const syncWait = ModelCommand.execute('/translate uk Привіт');
      assert(syncWait.includes('[WAIT] Переклад у процесі'), 'sync /translate returns [WAIT] marker (background job)');
      const syncUsage = ModelCommand.execute('/translate');
      assert(syncUsage.includes('Використання: /translate'), 'sync /translate usage error');
    } finally {
      (translator as any).translate = realTranslate;
    }

    // C15. /log filter variants (order-independent args).
    assert(ModelCommand.execute('/log 5').includes('ЖУРНАЛ ОПЕРАЦІЙ'), '/log renders operation journal');
    assert(ModelCommand.execute('/log warn command').includes('level=warn, kind=command'), '/log level+kind filters rendered');
    assert(ModelCommand.execute('/log gemini').includes('text~"gemini"'), '/log text filter rendered');
    assert(ModelCommand.execute('/log 5 none-such-filter-text').includes('Записів немає'), '/log empty result handled');
    assert(ModelCommand.execute('/журнал-лог 3').includes('ЖУРНАЛ ОПЕРАЦІЙ'), '/log uk alias resolves');

    // C16. /debug on/off/status/full (probe target stubbed via process.execPath).
    const realExecPath = process.execPath;
    try {
      const dbgOn = ModelCommand.execute('/debug on');
      assert(dbgOn.includes('УВІМКНЕНО (ON)'), '/debug on enables debug mode');
      assert(ModelCommand.execute('/debug status').includes('Debug mode: ON'), '/debug status reflects ON');
      assert(ModelCommand.execute('/debug off').includes('ВИМКНЕНО (OFF)'), '/debug off disables debug mode');
      assert(ModelCommand.execute('/дебаг status').includes('Debug mode: OFF'), '/debug uk alias + OFF state');
      (process as any).execPath = '/bin/false';
      const dbgFull = ModelCommand.execute('/debug full');
      assert(dbgFull.includes('DEBUG FULL') && dbgFull.includes('Node') && dbgFull.includes('ФАЙЛИ ДАНИХ'), '/debug full renders system diagnostics');
      assert(dbgFull.includes('UNREACHABLE'), 'omniroute probe failure reported as UNREACHABLE');
      assert(dbgFull.includes('OPLOG'), '/debug full includes OpLog stats');
    } finally {
      (process as any).execPath = realExecPath;
      setDebugOn(false);
    }

    // C17. /monitor: real report + read-failure + no-TOP-10 fallbacks (fs seam).
    const realReadFileSync = fs.readFileSync;
    try {
      const monOut = ModelCommand.execute('/monitor');
      assert(monOut.includes('МОДЕЛЬНИЙ МОНІТОР') || monOut.includes('[WRN]'), '/monitor handles the real REPORT.md (or warns if empty)');
      (fs as any).readFileSync = (p: any, ...rest: any[]) => {
        if (String(p).includes('model-monitor')) throw new Error('ENOENT');
        return (realReadFileSync as any).apply(fs, [p, ...rest]);
      };
      assert(ModelCommand.execute('/monitor').includes('Звіт модельного монітора не знайдено'), '/monitor missing report → warn fallback');
      (fs as any).readFileSync = (p: any, ...rest: any[]) => {
        if (String(p).includes('model-monitor')) return '# Модельный монитор — 2026-09-07\n\n## Огляд\nнет top sections here\n';
        return (realReadFileSync as any).apply(fs, [p, ...rest]);
      };
      assert(ModelCommand.execute('/monitor').includes('У REPORT.md не знайдено секцій TOP-10'), '/monitor without TOP-10 sections → warn fallback');
      (fs as any).readFileSync = (p: any, ...rest: any[]) => {
        if (String(p).includes('model-monitor')) return '# Модельный монитор — 2026-09-07 (autogen)\n\n## TOP-10 FREE BY QUALITY\n1. Gemini 3.8 Flash\n\n## TOP-10 PAID BY QUALITY\n1. Claude Sonnet 4\n';
        return (realReadFileSync as any).apply(fs, [p, ...rest]);
      };
      const monCrafted = ModelCommand.execute('/monitor');
      assert(monCrafted.includes('Звіт: 2026-09-07') && monCrafted.includes('TOP-10 FREE BY QUALITY') && monCrafted.includes('TOP-10 PAID BY QUALITY'), '/monitor renders crafted TOP-10 sections + report date');
    } finally {
      (fs as any).readFileSync = realReadFileSync;
    }

    // C18. /developer paths (status/lock/usage; env-driven availability).
    const savedDevPw = process.env.EVADEV_PASSWORD;
    try {
      assert(ModelCommand.execute('/developer').includes('/developer unlock'), 'bare /developer → usage');
      assert(ModelCommand.execute('/developer status').length > 0, '/developer status renders session state');
      assert(ModelCommand.execute('/developer lock').includes('[LOCK]'), '/developer lock renders lock reply');
      process.env.EVADEV_PASSWORD = 'cam-suite-pw';
      assert(ModelCommand.execute('/developer unlock').includes('Використання'), '/developer unlock without password → usage');
      assert(ModelCommand.execute('/developer bogus-sub').includes('Використання'), 'unknown /developer subcommand → usage');
    } finally {
      if (savedDevPw === undefined) delete process.env.EVADEV_PASSWORD;
      else process.env.EVADEV_PASSWORD = savedDevPw;
    }

    // C19. /voices paths (validation + catalog + set with prefs restore).
    {
      const voicesAll = ModelCommand.execute('/voices');
      assert(voicesAll.includes('ГОЛОСИ TTS') && voicesAll.includes('uk-UA') && voicesAll.includes('ru-RU') && voicesAll.includes('en-US'), '/voices renders the free catalog for all languages');
      const voicesUk = ModelCommand.execute('/voices uk');
      assert(voicesUk.includes('[uk-UA]') && !voicesUk.includes('[ru-RU]'), '/voices uk filters to uk-UA only');
      const voicesBad = ModelCommand.execute('/voices de');
      assert(voicesBad.includes('Використання: /voices [uk|ru|en]'), '/voices unknown lang → usage');
      assert(ModelCommand.execute('/голоси').includes('ГОЛОСИ TTS'), '/голоси alias resolves');

      assert(ModelCommand.execute('/voices set foo bar').includes('Використання: /voices set'), 'invalid persona → usage');
      assert(ModelCommand.execute('/voices set eva').includes('Використання: /voices set'), 'missing voice name → usage');
      assert(ModelCommand.execute('/voices set eva uk-UA-Chirp3-HD-Kore extra').includes('Використання: /voices set'), 'extra args → usage');
      const rejected = ModelCommand.execute('/voices set eva uk-UA-Studio-NotACatalogVoice');
      assert(rejected.includes('[ERROR] Голос відхилено'), 'voice not in free catalog rejected');

      const prefsFile = voicePrefsPath();
      const prefsBackup = fs.existsSync(prefsFile) ? fs.readFileSync(prefsFile, 'utf8') : null;
      const origEva = cloudTts.getEvaVoice();
      const origAdam = cloudTts.getAdamVoice();
      try {
        const setOut = ModelCommand.execute('/voices set adam en-US-Wavenet-D');
        assert(setOut.includes('[OK] Голос Адама (Adam) змінено на en-US-Wavenet-D (wavenet, MALE, FREE)'), 'valid free voice applied to Adam');
        assert(cloudTts.getAdamVoice() === 'en-US-Wavenet-D', 'CloudTTS hot-reloaded the new Adam voice');
        assert(setOut.includes('Збережено:') && setOut.includes('voice-prefs.json'), 'reply reports persistence path');
      } finally {
        if (prefsBackup === null) { try { fs.unlinkSync(prefsFile); } catch { /* best effort */ } }
        else fs.writeFileSync(prefsFile, prefsBackup, 'utf8');
        (cloudTts as any).evaVoice = origEva;
        (cloudTts as any).adamVoice = origAdam;
      }
    }

    // C20. /settings.
    const settingsOut = ModelCommand.execute('/settings');
    assert(settingsOut.includes('ПОТОЧНІ НАЛАШТУВАННЯ') && settingsOut.includes('Locale') && settingsOut.includes('Model (default)') && settingsOut.includes('TTS') && settingsOut.includes('STT usage') && settingsOut.includes('Translate usage') && settingsOut.includes('Developer mode'), '/settings renders the full settings table');

    // C21. /sephirot status/tree/usage/start (engine patched — no LLM run).
    const realStartAsyncRun = (SephirotEngine as any).startAsyncRun;
    try {
      assert(ModelCommand.execute('/sephirot status').includes('SEPHIROT CONSILIUM — СТАТУС'), '/sephirot status renders status block');
      const tree = ModelCommand.execute('/sephirot tree');
      assert(tree.includes('ДЕРЕВО ЖИТТЯ') && tree.includes('Kether') && tree.includes('Malkuth'), '/sephirot tree renders the 10-sphere map');
      assert(ModelCommand.execute('/сфирот tree').includes('ДЕРЕВО ЖИТТЯ'), '/сфирот alias routes to /sephirot');
      assert(ModelCommand.execute('/sephirot').includes('Використання:'), 'bare /sephirot → usage');
      (SephirotEngine as any).startAsyncRun = (topic: string) => `[MOCK-RUN] ${topic}`;
      assert(ModelCommand.execute('/sephirot Тестова тема').includes('[MOCK-RUN] Тестова тема'), '/sephirot <topic> launches (stubbed) background run');
    } finally {
      (SephirotEngine as any).startAsyncRun = realStartAsyncRun;
    }

    // C22. Unknown command → error line.
    const unknown = ModelCommand.execute('/definitely-not-a-command');
    assert(unknown.includes('[ERROR] Unknown command'), 'unknown command → error with command list');

    // C23. /agents roster smoke.
    const agentsOut = ModelCommand.execute('/agents');
    assert(agentsOut.includes('РОСТЕР АГЕНТІВ') && agentsOut.includes('[CORPORATE]') && agentsOut.includes('[SEPHIROT]'), '/agents renders corporate + sephirot roster');
  } finally {
    // ---- Global teardown: restore everything the suite touched -------------
    process.env.PATH = origPath;
    try { syslogRecv.close(); } catch { /* already closed */ }
    hookServer.close();
    try { fs.rmSync(tmpRoot, { recursive: true, force: true }); } catch { /* best effort */ }
  }

  console.log(`--- ClusterMonitor / AlertManager / ModelRatings Tests ${passed ? 'PASSED' : 'FAILED'} ---`);
  return passed;
}
