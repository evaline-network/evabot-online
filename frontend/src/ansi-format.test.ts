import { describe, expect, it } from 'vitest';
import {
  ANSI,
  ANSI_WHISPER_COMMANDS,
  ONBOARDING_TIPS,
  badge,
  chatBoxFooter,
  chatBoxHeader,
  divider,
  formatBanner,
  formatPrompt,
  promptSymbol,
  renderAuditBox,
  renderChatBoxContent,
  renderChatBoxWithCost,
  renderConfigBlock,
  renderConsensusBox,
  renderConsiliumTurn,
  renderCostLine,
  renderDevModeBlock,
  renderOnboardingStep,
  renderRawAnsiBlock,
  renderUserLine,
  sectionFooter,
  sectionHeader,
  statusBadge,
  stripAnsi,
  trafficLightColor,
  visibleWidth,
} from './ansi';

describe('trafficLightColor', () => {
  it('maps every status family to the right color code', () => {
    expect(trafficLightColor('green')).toBe(ANSI.green);
    expect(trafficLightColor('ok')).toBe(ANSI.green);
    expect(trafficLightColor('online')).toBe(ANSI.green);
    expect(trafficLightColor('free')).toBe(ANSI.green);
    expect(trafficLightColor('yellow')).toBe(ANSI.yellow);
    expect(trafficLightColor('warn')).toBe(ANSI.yellow);
    expect(trafficLightColor('standby')).toBe(ANSI.yellow);
    expect(trafficLightColor('paid')).toBe(ANSI.yellow);
    expect(trafficLightColor('red')).toBe(ANSI.red);
    expect(trafficLightColor('error')).toBe(ANSI.red);
    expect(trafficLightColor('offline')).toBe(ANSI.red);
  });

  it('falls back to white for unknown statuses', () => {
    expect(trafficLightColor('mystery' as never)).toBe(ANSI.white);
  });
});

describe('statusBadge', () => {
  it('derives a default label per status family', () => {
    expect(stripAnsi(statusBadge('online'))).toBe('🟢 [ONLINE]');
    expect(stripAnsi(statusBadge('standby'))).toBe('🟡 [STANDBY]');
    expect(stripAnsi(statusBadge('offline'))).toBe('🔴 [OFFLINE]');
    expect(stripAnsi(statusBadge('free'))).toBe('🟢 [100% FREE QUOTA]');
    expect(stripAnsi(statusBadge('paid'))).toBe('🟡 [PAID / METERED]');
  });

  it('uses the custom label when provided', () => {
    expect(stripAnsi(statusBadge('green', 'CUSTOM'))).toBe('🟢 [CUSTOM]');
  });

  it('uppercases arbitrary statuses as fallback label', () => {
    expect(stripAnsi(statusBadge('warm' as never))).toBe('⚪ [WARM]');
  });
});

describe('badge and divider', () => {
  it('wraps text in colored brackets with a custom color', () => {
    expect(stripAnsi(badge('FAST'))).toBe('[FAST]');
    expect(badge('PAID', ANSI.red as string)).toContain(ANSI.red + 'PAID');
  });

  it('repeats a character for the given width', () => {
    expect(stripAnsi(divider())).toBe('─'.repeat(78));
    expect(stripAnsi(divider('=', 10, ANSI.gray))).toBe('='.repeat(10));
  });
});

describe('sectionHeader / sectionFooter', () => {
  it('renders a full-width header with uppercase title and tag', () => {
    const header = sectionHeader('developer mode', 'DEV', 40);
    const plain = stripAnsi(header);
    expect(plain).toContain('DEVELOPER MODE');
    expect(plain).toContain('[ DEV ]');
    expect(visibleWidth(header)).toBe(42);
    expect(plain.startsWith('┌──')).toBe(true);
    expect(plain.endsWith('┐')).toBe(true);
  });

  it('omits the tag block when tag is empty', () => {
    expect(stripAnsi(sectionHeader('title', '', 20))).not.toContain('[  ]');
  });

  it('keeps a minimum body width for very long titles', () => {
    const header = sectionHeader('x'.repeat(100), '', 10);
    expect(visibleWidth(header)).toBeGreaterThanOrEqual(10);
  });

  it('renders a matching footer of the same width', () => {
    const footer = sectionFooter(40);
    expect(visibleWidth(footer)).toBe(40);
    expect(stripAnsi(footer)).toBe('└' + '─'.repeat(38) + '┘');
  });
});

describe('formatBanner', () => {
  it('draws top, title, separator, body lines and bottom', () => {
    const banner = formatBanner(['line one', 'line two'], 'TITLE');
    const lines = banner.split('\n');
    expect(lines).toHaveLength(6);
    expect(stripAnsi(lines[0]).startsWith('┌')).toBe(true);
    expect(stripAnsi(lines[1])).toContain('TITLE');
    expect(stripAnsi(lines[2]).startsWith('├')).toBe(true);
    expect(stripAnsi(lines[3])).toContain('line one');
    expect(stripAnsi(lines[4])).toContain('line two');
    expect(stripAnsi(lines[5]).startsWith('└')).toBe(true);
  });

  it('pads body lines to the box width', () => {
    const banner = formatBanner(['short'], 'T', 20);
    const bodyLine = stripAnsi(banner.split('\n')[3]);
    expect(visibleWidth(bodyLine)).toBe(19);
  });
});

describe('promptSymbol and formatPrompt', () => {
  it('selects a symbol per mode with case-insensitive matching', () => {
    expect(stripAnsi(promptSymbol('consilium'))).toBe('👥 ❯');
    expect(stripAnsi(promptSymbol('CONSILIUM'))).toBe('👥 ❯');
    expect(stripAnsi(promptSymbol('dialogue'))).toBe('💬 ❯');
    expect(stripAnsi(promptSymbol('broadcast'))).toBe('📡 ❯');
    expect(stripAnsi(promptSymbol('solo'))).toBe('❯');
    expect(stripAnsi(promptSymbol())).toBe('❯');
  });

  it('composes model, role and mode into the prompt', () => {
    const full = stripAnsi(formatPrompt({ model: 'm1', mode: 'chat', role: 'cto' }));
    expect(full).toContain('eva (m1) [cto] [CHAT]');
    expect(stripAnsi(formatPrompt({}))).not.toContain('(');
    expect(stripAnsi(formatPrompt({ role: 'general_assistant' }))).not.toContain('general_assistant');
  });
});

describe('chat box primitives', () => {
  it('renders header, footer and content lines', () => {
    expect(stripAnsi(chatBoxHeader('gemini-2.5-flash'))).toContain('[EVABOT] (gemini-2.5-flash)');
    expect(stripAnsi(chatBoxFooter()).startsWith('└')).toBe(true);
    const box = renderChatBoxContent('alpha\nbeta', 'm1');
    expect(box.split('\n')).toHaveLength(5);
    expect(stripAnsi(box)).toContain('│ alpha');
    expect(stripAnsi(box)).toContain('│ beta');
  });

  it('appends cost and tip only when provided', () => {
    const without = renderChatBoxWithCost('hi', 'm1', '');
    const withCost = renderChatBoxWithCost('hi', 'm1', 'COST LINE', 'use /help');
    expect(without).not.toContain('COST LINE');
    expect(withCost).toContain('COST LINE');
    expect(withCost).toContain('TIP: use /help');
  });
});

describe('renderCostLine', () => {
  const base = {
    model: 'gemini-2.5-flash',
    totalTokens: 1234,
    promptTokens: 1000,
    completionTokens: 234,
    formattedUSD: '$0.0010',
    formattedEUR: '€0.0009',
  };

  it('marks paid tiers and omits valuation', () => {
    const out = renderCostLine({ ...base, isFreeTier: false });
    const plain = stripAnsi(out);
    expect(plain).toContain('[PAID]');
    expect(plain).toContain('TOKENS: 1,234');
    expect(plain).toContain('(In: 1000, Out: 234)');
    expect(plain).toContain('$0.0010 / €0.0009');
    expect(plain).not.toContain('COMMERCIAL VALUATION');
  });

  it('adds commercial valuation for free tiers when provided', () => {
    const out = renderCostLine({
      ...base,
      isFreeTier: true,
      commercialValueUSD: 0.25,
      commercialValueEUR: 0.23,
    });
    const plain = stripAnsi(out);
    expect(plain).toContain('[FREE QUOTA]');
    expect(plain).toContain('COMMERCIAL VALUATION');
    expect(plain).toContain('$0.250000 USD');
    expect(plain).toContain('€0.230000 EUR');
  });
});

describe('renderConsiliumTurn', () => {
  it('renders participant header, content lines and closing rule', () => {
    const turn = renderConsiliumTurn({
      name: 'eva',
      model: 'gemini-2.5-flash',
      content: 'line one\nline two',
      isFreeTier: true,
    });
    const plain = stripAnsi(turn);
    expect(plain).toContain('[EVA] (gemini-2.5-flash) [FREE]');
    expect(plain).toContain('│ line one');
    expect(plain).toContain('│ line two');
    expect(plain).not.toContain('TOKENS:');
  });

  it('includes a token summary when totals are present', () => {
    const turn = renderConsiliumTurn({
      name: 'adam',
      model: 'paid-model',
      content: 'text',
      isFreeTier: false,
      promptTokens: 10,
      completionTokens: 5,
      totalTokens: 15,
      formattedUSD: '$0.01',
      formattedEUR: '€0.01',
    });
    const plain = stripAnsi(turn);
    expect(plain).toContain('[PAID]');
    expect(plain).toContain('TOKENS: In: 10 + Out: 5 = 15');
    expect(plain).toContain('COST: $0.01 / €0.01');
  });
});

describe('renderConsensusBox', () => {
  it('wraps synthesis lines in a box with the footer note', () => {
    const out = renderConsensusBox('agree\non plan');
    const lines = stripAnsi(out).split('\n');
    expect(lines[0].startsWith('┌')).toBe(true);
    expect(out).toContain('FINAL EXECUTIVE CONSENSUS REPORT');
    expect(stripAnsi(out)).toContain('│ agree');
    expect(stripAnsi(out)).toContain('│ on plan');
    expect(out).toContain('Deliberated by frontier models');
  });

  it('handles empty synthesis input', () => {
    const out = renderConsensusBox('');
    expect(out.split('\n').length).toBeGreaterThan(3);
  });
});

describe('renderAuditBox', () => {
  it('lists per-model rows and the total audit line', () => {
    const out = renderAuditBox({
      totalTokens: 100,
      totalCostUSD: 0.01,
      totalCostEUR: 0.01,
      formattedUSD: '$0.01',
      formattedEUR: '€0.01',
      models: [
        { model: 'gemini', tokens: 60, formattedUSD: '$0.006', formattedEUR: '€0.006' },
        { model: 'qwen', tokens: 40, formattedUSD: '$0.004', formattedEUR: '€0.004' },
      ],
    });
    const plain = stripAnsi(out);
    expect(plain).toContain('TOTAL AUDIT: 100 tokens');
    expect(plain).toContain('Cost: $0.01 / €0.01');
    expect(plain).toContain('• gemini');
    expect(plain).toContain('• qwen');
  });

  it('renders without model rows when none provided', () => {
    const out = renderAuditBox({
      totalTokens: 5,
      totalCostUSD: 0,
      totalCostEUR: 0,
      formattedUSD: '$0.0000',
      formattedEUR: '€0.0000',
    });
    expect(stripAnsi(out)).toContain('TOTAL AUDIT: 5 tokens');
  });
});

describe('renderUserLine', () => {
  it('concatenates prompt and text verbatim', () => {
    expect(renderUserLine('PROMPT ', 'text')).toBe('PROMPT text');
    expect(renderUserLine('', 'x')).toBe('x');
  });
});

describe('renderDevModeBlock', () => {
  it('shows client and server dev state plus whisper commands', () => {
    const out = stripAnsi(
      renderDevModeBlock({
        clientDev: true,
        serverDev: false,
        authSource: 'Ambient',
        hasServerKey: true,
        modelCount: 7,
        version: '9.9.9',
      }),
    );
    expect(out).toContain('DEVELOPER MODE // RUNTIME STATUS');
    expect(out).toContain('CLIENT DEV MODE: [ON]');
    expect(out).toContain('SERVER DEV MODE: [OFF]');
    expect(out).toContain('[HAS SERVER KEY]');
    expect(out).toContain('7 models');
    expect(out).toContain('version: 9.9.9');
    for (const cmd of ANSI_WHISPER_COMMANDS) expect(out).toContain(cmd);
  });

  it('signals the missing-key fallback path', () => {
    const out = stripAnsi(
      renderDevModeBlock({
        clientDev: false,
        serverDev: false,
        authSource: 'None',
        hasServerKey: false,
        modelCount: 0,
        version: '0',
      }),
    );
    expect(out).toContain('NO KEY');
    expect(out).toContain('CATALOG / DIAGNOSTICS / VOICE CONFIG STILL WORK');
  });
});

describe('renderConfigBlock', () => {
  it('renders full config values', () => {
    const out = stripAnsi(
      renderConfigBlock({
        productName: 'EvaBot Online',
        version: '1.2.3',
        server: 'node-x',
        base: 'Kyiv',
        localePolicy: { currencies: ['USD', 'EUR'], financialStandard: 'USD/EUR only' },
        devMode: true,
        defaultModel: 'gemini-2.5-flash',
        availableModels: 12,
        supportedProviders: ['google', 'openrouter'],
        voice: { enabled: true, activePersona: 'eva' },
        dev: { runtime: { env: { DEV_MODE: true, GEMINI_API_KEY_SET: true, OMNIROUTE_ENDPOINT: 'https://x' } } },
      }),
    );
    expect(out).toContain('EvaBot Online');
    expect(out).toContain('1.2.3');
    expect(out).toContain('Kyiv');
    expect(out).toContain('USD / EUR');
    expect(out).toContain('USD/EUR only');
    expect(out).toContain('Dev Mode (server): [ON]');
    expect(out).toContain('default model: gemini-2.5-flash');
    expect(out).toContain('12 models');
    expect(out).toContain('Voice: enabled │ persona: eva');
    expect(out).toContain('google, openrouter');
    expect(out).toContain('OMNIROUTE=https://x');
  });

  it('falls back to defaults for an empty config object', () => {
    const out = stripAnsi(renderConfigBlock({}));
    expect(out).toContain('EvaBot Online');
    expect(out).toContain('Chernomorsk, Ukraine (UA) & Bratislava, Slovakia');
    expect(out).toContain('Dev Mode (server): [OFF]');
    expect(out).toContain('Voice: disabled │ persona: auto');
    expect(out).toContain('GEMINI_API_KEY_SET=undefined');
  });
});

describe('renderRawAnsiBlock', () => {
  it('escapes ESC characters and indents content lines', () => {
    const out = renderRawAnsiBlock('\u001b[31mred\u001b[0m\nsecond');
    expect(out).toContain('\\x1b[31mred\\x1b[0m');
    expect(out).not.toContain('[31m');
    expect(out).toContain('  second');
    expect(out).toContain('RAW ANSI ABOVE');
  });
});

describe('renderOnboardingStep', () => {
  it('renders step counter, title and body lines', () => {
    const out = stripAnsi(renderOnboardingStep(2, 10, 'LANGUAGE', ['pick a language', 'or skip']));
    expect(out).toContain('ONBOARDING // STEP 2/10');
    expect(out).toContain('/* LANGUAGE */');
    expect(out).toContain('│ pick a language');
    expect(out).toContain('│ or skip');
  });
});

describe('static content exports', () => {
  it('whisper commands are dev-only slash commands', () => {
    expect(ANSI_WHISPER_COMMANDS).toEqual(['/dev', '/ansi', '/config', '/onboarding']);
  });

  it('onboarding tips are non-empty unique strings', () => {
    expect(ONBOARDING_TIPS.length).toBeGreaterThan(5);
    for (const tip of ONBOARDING_TIPS) {
      expect(typeof tip).toBe('string');
      expect(tip.length).toBeGreaterThan(0);
    }
    expect(new Set(ONBOARDING_TIPS).size).toBe(ONBOARDING_TIPS.length);
  });
});
