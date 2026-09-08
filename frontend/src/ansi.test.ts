import { describe, expect, it } from 'vitest';
import {
  ANSI,
  escapeHtml,
  padEndVisible,
  padStartVisible,
  renderError,
  renderNotice,
  renderTerminalTable,
  stripAnsi,
  toHtml,
  trafficLightIcon,
  visibleWidth,
} from './ansi';

describe('stripAnsi', () => {
  it('removes SGR color sequences and keeps plain text', () => {
    expect(stripAnsi(`${ANSI.red}error${ANSI.reset}`)).toBe('error');
  });

  it('returns plain text untouched', () => {
    expect(stripAnsi('no escape codes here')).toBe('no escape codes here');
  });
});

describe('visibleWidth', () => {
  it('ignores ANSI sequences when measuring', () => {
    expect(visibleWidth(`${ANSI.bold}[OK]${ANSI.reset}`)).toBe(4);
  });

  it('counts CJK and emoji as double width', () => {
    expect(visibleWidth('ab')).toBe(2);
    expect(visibleWidth('日本')).toBe(4);
  });
});

describe('padding helpers', () => {
  it('padEndVisible pads by visible width, not raw length', () => {
    const out = padEndVisible(`${ANSI.cyan}ok${ANSI.reset}`, 6);
    expect(out.startsWith(`${ANSI.cyan}ok${ANSI.reset}`)).toBe(true);
    expect(visibleWidth(out)).toBe(6);
  });

  it('padStartVisible pads on the left', () => {
    expect(padStartVisible('ab', 5, '.')).toBe('...ab');
  });

  it('pads with a custom character', () => {
    expect(padEndVisible('ab', 4, '-')).toBe('ab--');
  });
});

describe('escapeHtml and toHtml', () => {
  it('escapes HTML-significant characters', () => {
    expect(escapeHtml('<b>&')).toBe('&lt;b&gt;&amp;');
  });

  it('converts SGR codes to inline styles and closes spans on reset', () => {
    const html = toHtml(`${ANSI.green}ok${ANSI.reset}`);
    expect(html).toBe('<span style="color:#22c55e">ok</span>');
  });

  it('maps bold and color combined codes', () => {
    const html = toHtml(`${ANSI.bold}${ANSI.red}x${ANSI.reset}`);
    expect(html).toContain('font-weight:bold');
    expect(html).toContain('color:#ef4444');
  });

  it('drops unknown SGR codes without emitting a tag', () => {
    expect(toHtml('\u001b[99m x')).toBe(' x');
  });
});

describe('trafficLightIcon', () => {
  it('maps status families to the right icons', () => {
    expect(trafficLightIcon('online')).toBe('🟢');
    expect(trafficLightIcon('warn')).toBe('🟡');
    expect(trafficLightIcon('error')).toBe('🔴');
    expect(trafficLightIcon('unknown' as never)).toBe('⚪');
  });
});

describe('renderTerminalTable', () => {
  it('renders a bordered table with all rows and computed widths', () => {
    const rows = [
      { id: 'model-a', price: '0.00' },
      { id: 'longer-model-id', price: '1.50' },
    ];
    const table = renderTerminalTable(rows, {
      columns: [
        { key: 'id', header: 'MODEL ID', minWidth: 10 },
        { key: 'price', header: 'USD', align: 'right', minWidth: 5 },
      ],
    });
    const lines = table.split('\n');
    expect(lines).toHaveLength(6);
    expect(table).toContain('model-a');
    expect(table).toContain('longer-model-id');
    expect(table).toContain('MODEL ID');
  });

  it('applies a custom format function to cell values', () => {
    const table = renderTerminalTable([{ name: 'x', ctx: 2048 }], {
      columns: [
        { key: 'name', header: 'NAME', minWidth: 6 },
        { key: 'ctx', header: 'CTX', format: (v) => `${((v as number) / 1024).toFixed(0)}k` },
      ],
    });
    expect(table).toContain('2k');
  });
});

describe('small renderers', () => {
  it('renderError wraps the message in a red error line', () => {
    const out = renderError('timeout');
    expect(stripAnsi(out)).toContain('[X] Generation Error: timeout');
    expect(out).toContain(ANSI.red);
  });

  it('renderNotice prefixes the message', () => {
    expect(stripAnsi(renderNotice('cache warmed'))).toBe('[!] cache warmed');
  });
});
