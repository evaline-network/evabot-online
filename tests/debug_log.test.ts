/**
 * debug_log.test.ts — OpLog (ring buffer, query filters, JSONL persistence +
 * rotation), DebugContext gating, /log / /debug / /monitor command behavior
 * and multilingual alias resolution.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { OpLog, setDebugOn, isDebugOn, startSpan, renderDebugFooter } from '../src/core/OpLog.js';
import { ModelCommand, normalizeCommand } from '../src/models/ModelRatings.js';

export async function runDebugLogTests(): Promise<boolean> {
  console.log('\n--- Running Debug/OpLog Tests ---');
  let passed = true;

  function assert(cond: boolean, msg: string) {
    if (cond) {
      console.log(`  ✓ ${msg}`);
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      passed = false;
    }
  }

  // Isolated temp workspace for persistence tests
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'evalog-'));
  const jsonlPath = path.join(tmpDir, 'operations.jsonl');

  // 1. Ring buffer: caps at 1000 entries, drops the oldest
  {
    setDebugOn(true); // ensure all levels recorded for this test
    const log = new OpLog({ filePath: path.join(tmpDir, 'ring.jsonl') });
    for (let i = 0; i < 1010; i++) {
      log.log('info', 'system', `entry-${i}`);
    }
    const all = log.query({ limit: 2000 });
    assert(all.length === 1000, `ring buffer caps at 1000 entries (got ${all.length})`);
    assert(all[0].text === 'entry-1009', 'newest-first ordering (head = entry-1009)');
    assert(all[all.length - 1].text === 'entry-10', 'oldest 10 entries evicted from the ring');
  }

  // 2. Query filters: level, kind, textLike, since, limit
  {
    const log = new OpLog({ filePath: path.join(tmpDir, 'query.jsonl') });
    const base = Date.now() - 10_000;
    log.log('info', 'command', '/top free');
    log.log('error', 'llm', 'provider=google model=x fail: boom');
    log.log('warn', 'breaker', 'google → open');
    log.log('info', 'llm', 'provider=google model=y latencyMs=12 ok');
    const byLevel = log.query({ limit: 10, level: 'error' });
    assert(byLevel.length === 1 && byLevel[0].kind === 'llm', 'query filters by level');
    const byKind = log.query({ limit: 10, kind: 'command' });
    assert(byKind.length === 1 && byKind[0].text === '/top free', 'query filters by kind');
    const byText = log.query({ limit: 10, textLike: 'BOOM' });
    assert(byText.length === 1, 'textLike filter is case-insensitive substring match');
    const limited = log.query({ limit: 2 });
    assert(limited.length === 2, 'query respects limit');
    assert(limited[0].ts >= limited[1].ts, 'query returns newest first');
    const sinceNow = log.query({ limit: 10, since: base + 60_000 });
    assert(sinceNow.length === 0, 'since filter excludes older entries');
    const sincePast = log.query({ limit: 10, since: base - 60_000 });
    assert(sincePast.length === 4, 'since in the past keeps all entries');
  }

  // 3. JSONL persistence + rotation (injectable path + small rotate threshold)
  {
    const rotatePath = path.join(tmpDir, 'rot.jsonl');
    const log = new OpLog({ filePath: rotatePath, rotateBytes: 300 });
    for (let i = 0; i < 20; i++) {
      log.log('info', 'system', `rotation-test-entry-${i}-${'x'.repeat(30)}`);
    }
    assert(fs.existsSync(rotatePath), 'JSONL file created at injected path');
    const rotated = fs.existsSync(rotatePath + '.1');
    assert(rotated, 'rotation produced operations.jsonl.1 when threshold exceeded');
    const lines = fs.readFileSync(rotatePath, 'utf8').trim().split('\n');
    assert(lines.length > 0, 'JSONL file has content after rotation');
    let validJson = true;
    for (const l of lines) {
      try { JSON.parse(l); } catch { validJson = false; }
    }
    assert(validJson, 'every JSONL line parses as a valid entry object');
    const last = JSON.parse(lines[lines.length - 1]);
    assert(last.level === 'info' && last.kind === 'system' && typeof last.ts === 'number', 'entry schema {ts,level,kind,text}');
    assert(fs.statSync(rotatePath).size < 600, 'post-rotation file stays under 2x threshold');
  }

  // 4. log() never throws + debug gating
  {
    const log = new OpLog({ filePath: path.join(tmpDir, 'gate.jsonl') });
    setDebugOn(false);
    log.log('debug', 'llm', 'should be skipped while debug off');
    log.log('error', 'system', 'errors always recorded even when debug off');
    assert(log.query({ limit: 10, level: 'debug' }).length === 0, 'debug entries skipped while debug flag OFF');
    assert(log.query({ limit: 10, level: 'error' }).length === 1, 'error entries recorded regardless of debug flag');
    setDebugOn(true);
    log.log('debug', 'llm', 'now recorded');
    assert(log.query({ limit: 10, level: 'debug' }).length === 1, 'debug entries recorded while debug flag ON');
    // Never-throw contract: log to an impossible path must not throw
    // (/dev/null/... fails fast with ENOTDIR; /proc paths can hang mkdirSync).
    const bad = new OpLog({ filePath: '/dev/null/definitely/not/writable/ops.jsonl' });
    let threw = false;
    try { bad.log('info', 'system', 'must not throw'); } catch { threw = true; }
    assert(!threw, 'log() never throws even when persistence fails');
  }

  // 5. DebugSpan + footer rendering
  {
    setDebugOn(true);
    const span = startSpan('gemini-2.5-flash', 'google');
    span.end('no');
    assert(span.ended && typeof span.latencyMs === 'number' && span.latencyMs! >= 0, 'span.end() records latency');
    const footer = renderDebugFooter(span);
    assert(footer.startsWith('* debug: model=gemini-2.5-flash provider=google latency='), 'footer format matches * debug spec');
    span.end(); // second end() is a no-op
    assert(renderDebugFooter(span) === footer, 'span.end() is idempotent');
    setDebugOn(false);
  }

  // 6. /debug command: status / on / off toggle
  {
    setDebugOn(false);
    const status0 = ModelCommand.execute('/debug status');
    assert(status0.includes('Debug mode: OFF'), '/debug status reports OFF');
    ModelCommand.execute('/debug on');
    assert(isDebugOn() === true, '/debug on sets the flag');
    ModelCommand.execute('/debug off');
    assert(isDebugOn() === false, '/debug off clears the flag');
    const full = ModelCommand.execute('/debug full');
    assert(full.includes('DEBUG FULL'), '/debug full renders diagnostics header');
    assert(full.includes('Node ') && full.includes('OPLOG'), '/debug full includes node + OpLog stats');
    assert(full.includes('chat-history.db') && full.includes('operations.jsonl'), '/debug full lists DB paths');
  }

  // 7. /log output format
  {
    const out = ModelCommand.execute('/log');
    assert(out.includes('ЖУРНАЛ ОПЕРАЦІЙ'), '/log renders the header');
    assert(/^\s{2}\d{2}:\d{2}:\d{2} /m.test(out), 'entries formatted as HH:MM:SS');
    assert(out.includes('Tip: /debug on'), '/log shows the /debug interaction tip');
    const five = ModelCommand.execute('/log 5');
    const dataLines = five.split('\n').filter((l) => /^\s{2}\d{2}:\d{2}:\d{2} /.test(l));
    assert(dataLines.length <= 5, '/log 5 limits output to 5 entries');
    const errOnly = ModelCommand.execute('/log error');
    assert(errOnly.includes('level=error'), '/log error applies the level filter');
  }

  // 8. /monitor command (report exists in repo)
  {
    const out = ModelCommand.execute('/monitor');
    assert(
      out.includes('TOP-10') || out.includes('model-monitor.py'),
      '/monitor returns report sections or a fallback instruction'
    );
  }

  // 9. Aliases resolve (EN / UK / RU)
  {
    assert(normalizeCommand('/дебаг status') === '/debug status', "alias '/дебаг' → '/debug'");
    assert(normalizeCommand('/отладка') === '/debug', "alias '/отладка' → '/debug'");
    assert(normalizeCommand('/наладка') === '/debug', "alias '/наладка' → '/debug'");
    assert(normalizeCommand('/лог 50') === '/log 50', "alias '/лог' → '/log' (args preserved)");
    assert(normalizeCommand('/журнал-лог') === '/log', "alias '/журнал-лог' → '/log'");
    assert(normalizeCommand('/логи') === '/log', "alias '/логи' → '/log'");
    assert(normalizeCommand('/монитор') === '/monitor', "alias '/монитор' → '/monitor'");
    assert(normalizeCommand('/рейтинг') === '/monitor', "alias '/рейтинг' → '/monitor'");
    assert(normalizeCommand('/топ-моделей') === '/monitor', "alias '/топ-моделей' → '/monitor'");
    assert(ModelCommand.execute('/дебаг status').includes('Debug mode:'), '/debug works through the alias path');
  }

  // Cleanup temp workspace
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {
    /* best effort */
  }

  console.log('--- Debug/OpLog Tests Complete ---');
  return passed;
}
