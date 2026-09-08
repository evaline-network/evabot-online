/**
 * ansi_stream_engine.test.ts
 * Automated Test Suite for AnsiStreamEngine
 */

import {
  AnsiStreamEngine,
  AnsiColors,
  stripAnsi,
  visibleWidth,
  padEndVisible,
  padStartVisible,
  toHtml,
  toPlainText,
  statusBadge,
  trafficLightIcon,
  trafficLightColor,
  TableFormatter,
  AnsiStreamWriter,
} from '../src/core/AnsiStreamEngine.js';

export async function runAnsiStreamEngineTests(): Promise<boolean> {
  console.log('\n--- Running AnsiStreamEngine Tests ---');
  let passed = true;

  function assert(cond: boolean, msg: string) {
    if (cond) {
      console.log(`  ✓ ${msg}`);
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      passed = false;
    }
  }

  // 1. ANSI stripping and visible width
  const styled = `${AnsiColors.green}${AnsiColors.bold}[OK] ONLINE${AnsiColors.reset}`;
  const clean = stripAnsi(styled);
  assert(clean === '[OK] ONLINE', 'stripAnsi correctly strips ANSI escape codes');
  assert(toPlainText(styled) === '[OK] ONLINE', 'toPlainText strips ANSI codes identically');

  const widthClean = visibleWidth('ONLINE');
  assert(widthClean === 6, 'visibleWidth handles ASCII standard characters');
  const widthWide = visibleWidth('中');
  assert(widthWide === 2, 'visibleWidth recognizes 2-width wide characters');

  const padded = padEndVisible('STATUS', 10);
  assert(visibleWidth(padded) === 10, 'padEndVisible correctly pads visible width');
  const paddedStart = padStartVisible('100', 6);
  assert(visibleWidth(paddedStart) === 6, 'padStartVisible correctly pads start width');

  // 2. Traffic light icons & badges (emoji-free: [OK] / [MED] / [HIGH])
  assert(trafficLightIcon('green') === '[OK]', 'trafficLightIcon returns [OK] for green');
  assert(trafficLightIcon('yellow') === '[MED]', 'trafficLightIcon returns [MED] for yellow');
  assert(trafficLightIcon('red') === '[HIGH]', 'trafficLightIcon returns [HIGH] for red');

  const greenBadge = statusBadge('online');
  assert(greenBadge.includes('[OK]') && greenBadge.includes('[ONLINE]'), 'statusBadge formats online badge with traffic light');

  const freeBadge = statusBadge('free');
  assert(freeBadge.includes('[OK]') && freeBadge.includes('[100% FREE QUOTA]'), 'statusBadge formats 100% free quota badge');

  const paidBadge = statusBadge('paid');
  assert(paidBadge.includes('[MED]') && paidBadge.includes('[PAID / METERED]'), 'statusBadge formats paid/metered badge');

  // 3. Web HTML 1:1 mapping
  const htmlOut = toHtml(`${AnsiColors.green}Active${AnsiColors.reset}`);
  assert(htmlOut.includes('color:#22c55e') && htmlOut.includes('Active'), 'toHtml correctly translates ANSI color to HTML span style');

  // 4. Formatted Monospace Table
  interface TestRow {
    name: string;
    status: string;
    price: string;
  }
  const testRows: TestRow[] = [
    { name: 'Gemini 3.8 Flash', status: '[OK] Free', price: '$0.00 / €0.00' },
    { name: 'Claude 3.7 Sonnet', status: '[MED] Paid', price: '$3.00 / €2.80' },
  ];

  const tableStr = TableFormatter.render<TestRow>(testRows, {
    columns: [
      { key: 'name', header: 'MODEL', minWidth: 18 },
      { key: 'status', header: 'STATUS', minWidth: 10 },
      { key: 'price', header: 'PRICING', minWidth: 15 },
    ],
    borderStyle: 'unicode',
  });

  assert(tableStr.includes('┌') && tableStr.includes('┘'), 'TableFormatter renders valid unicode box borders');
  assert(tableStr.includes('Gemini 3.8 Flash') && tableStr.includes('Claude 3.7 Sonnet'), 'TableFormatter renders data rows');
  assert(!tableStr.includes('RUB') && !tableStr.includes('₽'), 'Table output strictly enforces USD/EUR without rubles');

  // 5. Reactive Stream Writer
  const writer = new AnsiStreamWriter();
  const receivedLines: string[] = [];
  const receivedChunks: string[] = [];

  writer.on('chunk', (c) => receivedChunks.push(c));
  writer.on('line', (l) => receivedLines.push(l));

  writer.write('Hello ');
  writer.write('World!\nSecond line.\n');
  writer.flush();

  assert(receivedChunks.length === 2, 'AnsiStreamWriter emits chunk events');
  assert(receivedLines.length === 2, 'AnsiStreamWriter processes lines upon newline');
  assert(receivedLines[0] === 'Hello World!', 'First line extracted cleanly');
  assert(receivedLines[1] === 'Second line.', 'Second line extracted cleanly');
  assert(writer.getFullText('plain').includes('Hello World!\nSecond line.'), 'AnsiStreamWriter getFullText plain parity');

  return passed;
}
