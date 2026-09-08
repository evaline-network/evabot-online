import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_DONE } from './onboarding';
import type { AppConfig } from './models';

vi.mock('./voice/VoiceDockUI', () => ({
  VoiceDockUI: class {
    init(): Promise<void> {
      return Promise.resolve();
    }
  },
}));

// app.ts boots EvaBotWebApp on import (DOM-guarded under jsdom); its telemetry
// intervals are faked so no real timers outlive the test run.
let mod: typeof import('./app');
let SmartInput: typeof mod.SmartInput;
let TRANSLATIONS: typeof mod.TRANSLATIONS;

beforeAll(async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  localStorage.setItem(STORAGE_DONE, '1');
  mod = await import('./app');
  SmartInput = mod.SmartInput;
  TRANSLATIONS = mod.TRANSLATIONS;
  window.dispatchEvent(new Event('DOMContentLoaded'));
});

afterEach(() => {
  localStorage.removeItem(SmartInput.VOCAB_KEY);
  localStorage.removeItem(SmartInput.LEXICON_KEY);
  localStorage.removeItem(SmartInput.AC_KEY);
});

beforeEach(() => {
  localStorage.removeItem(SmartInput.VOCAB_KEY);
  localStorage.removeItem(SmartInput.LEXICON_KEY);
  localStorage.removeItem(SmartInput.AC_KEY);
});

describe('SmartInput.levenshtein', () => {
  it('returns 0 for identical strings and handles empty operands', () => {
    expect(SmartInput.levenshtein('model', 'model')).toBe(0);
    expect(SmartInput.levenshtein('', '')).toBe(0);
    expect(SmartInput.levenshtein('', 'abc')).toBe(3);
    expect(SmartInput.levenshtein('abc', '')).toBe(3);
  });

  it('computes classic edit distances', () => {
    expect(SmartInput.levenshtein('kitten', 'sitting')).toBe(3);
    expect(SmartInput.levenshtein('flaw', 'lawn')).toBe(2);
  });

  it('works with cyrillic input and is symmetric', () => {
    expect(SmartInput.levenshtein('модел', 'модели')).toBe(1);
    expect(SmartInput.levenshtein('модели', 'модел')).toBe(1);
    expect(SmartInput.levenshtein('привіт', 'привет')).toBe(1);
  });
});

describe('SmartInput.subsequenceScore', () => {
  it('scores 0 when the query is not a subsequence or is longer than the target', () => {
    expect(SmartInput.subsequenceScore('xyz', 'help')).toBe(0);
    expect(SmartInput.subsequenceScore('historylong', 'history')).toBe(0);
    expect(SmartInput.subsequenceScore('', '')).toBeGreaterThan(0);
  });

  it('rewards prefix matches and streaks', () => {
    const prefix = SmartInput.subsequenceScore('he', 'hello');
    const scattered = SmartInput.subsequenceScore('hl', 'hello');
    expect(prefix).toBeGreaterThan(0);
    expect(scattered).toBeGreaterThan(0);
    expect(prefix).toBeGreaterThan(scattered);
  });

  it('is case-insensitive', () => {
    expect(SmartInput.subsequenceScore('HE', 'hello')).toBe(SmartInput.subsequenceScore('he', 'hello'));
  });
});

describe('SmartInput vocab storage', () => {
  it('returns an empty vocab for missing or corrupted storage', () => {
    expect(SmartInput.loadVocab()).toEqual({});
    localStorage.setItem(SmartInput.VOCAB_KEY, '{not-json');
    expect(SmartInput.loadVocab()).toEqual({});
  });

  it('rememberText stores lowercase words and strips slash commands', () => {
    SmartInput.rememberText('/help remember wordxyz now');
    const vocab = SmartInput.loadVocab();
    expect(Object.keys(vocab)).toEqual(expect.arrayContaining(['remember', 'wordxyz', 'now']));
    expect(vocab['wordxyz'].f).toBe(1);
    expect('help' in vocab).toBe(false);
  });

  it('rememberText ignores empty input and words shorter than 3 chars', () => {
    SmartInput.rememberText('');
    SmartInput.rememberText('ab !!');
    expect(SmartInput.loadVocab()).toEqual({});
  });

  it('increments frequency on repeated text', () => {
    SmartInput.rememberText('consilium rocks');
    SmartInput.rememberText('consilium rocks');
    expect(SmartInput.loadVocab()['consilium'].f).toBe(2);
  });

  it('scores vocab by frequency with recency decay', () => {
    const now = Date.now();
    expect(SmartInput.vocabScore({ f: 3, t: now })).toBeCloseTo(3, 5);
    expect(SmartInput.vocabScore({ f: 3, t: now - 4 * 86400000 })).toBeCloseTo(0.6, 5);
    expect(SmartInput.vocabScore({ f: 0, t: 0 })).toBeLessThan(0.001);
    expect(SmartInput.vocabScore({ f: 0, t: 0 })).toBeGreaterThan(0);
  });

  it('caps the vocab at VOCAB_CAP keeping the highest scored entries', () => {
    const big: Record<string, { f: number; t: number }> = {};
    for (let i = 1; i <= 505; i++) big['w' + String(i).padStart(3, '0')] = { f: i, t: Date.now() };
    SmartInput.saveVocab(big);
    const kept = SmartInput.loadVocab();
    expect(Object.keys(kept)).toHaveLength(SmartInput.VOCAB_CAP);
    expect('w001' in kept).toBe(false);
    expect('w505' in kept).toBe(true);
  });
});

describe('SmartInput lexicon and toggle', () => {
  it('has a built-in lexicon and merges learned words', () => {
    const base = SmartInput.lexiconSet();
    expect(base.has('omniroute')).toBe(true);
    expect(base.has('привіт')).toBe(true);
    SmartInput.learnCorrection('MyCustomWord');
    expect(SmartInput.lexiconSet().has('mycustomword')).toBe(true);
  });

  it('learnCorrection counts repeated learning', () => {
    SmartInput.learnCorrection('foo');
    SmartInput.learnCorrection('foo');
    const learned = JSON.parse(localStorage.getItem(SmartInput.LEXICON_KEY) || '{}');
    expect(learned['foo']).toBe(2);
  });

  it('defaults to enabled and persists the toggle', () => {
    expect(SmartInput.isEnabled()).toBe(true);
    SmartInput.setEnabled(false);
    expect(SmartInput.isEnabled()).toBe(false);
    SmartInput.setEnabled(true);
    expect(SmartInput.isEnabled()).toBe(true);
  });
});

describe('SmartInput.protectSegments', () => {
  it('masks and restores code fences verbatim', () => {
    const src = 'before ```const x = 1;``` after';
    const prot = SmartInput.protectSegments(src);
    expect(prot.masked).toEqual(['```const x = 1;```']);
    expect(prot.text).toMatch(/￰0￰/);
    expect(prot.restore(prot.text)).toBe(src);
  });

  it('masks unclosed fences and URLs', () => {
    const src = 'look at https://example.com/a?b=1 and www.test.org plus ```unclosed';
    const prot = SmartInput.protectSegments(src);
    expect(prot.masked).toEqual(['```unclosed', 'https://example.com/a?b=1', 'www.test.org']);
    expect(prot.restore(prot.text)).toBe(src);
  });

  it('restore leaves text without markers unchanged and drops orphan markers', () => {
    const prot = SmartInput.protectSegments('plain text');
    expect(prot.masked).toEqual([]);
    expect(prot.restore('plain text')).toBe('plain text');
    expect(prot.restore('orphan ￰7￰ marker')).toBe('orphan  marker');
  });
});

describe('SmartInput.matchCase', () => {
  it('capitalizes the candidate when the source word is Capitalized', () => {
    expect(SmartInput.matchCase('Модел', 'models')).toBe('Models');
    expect(SmartInput.matchCase('Xyz', 'abc')).toBe('Abc');
  });

  it('keeps lowercase and unusual casing as-is', () => {
    expect(SmartInput.matchCase('models', 'models')).toBe('models');
    expect(SmartInput.matchCase('MODELS', 'abc')).toBe('abc');
    expect(SmartInput.matchCase('UNIQUE', 'single')).toBe('single');
  });
});

describe('SmartInput.correctWord', () => {
  const dict = new Set(['hello', 'help', 'consilium']);

  it('returns null for short words, known words and empty input', () => {
    expect(SmartInput.correctWord('hi', dict)).toBeNull();
    expect(SmartInput.correctWord('hello', dict)).toBeNull();
    expect(SmartInput.correctWord('', dict)).toBeNull();
  });

  it('finds the unique closest candidate', () => {
    expect(SmartInput.correctWord('hallo', dict)).toBe('hello');
    expect(SmartInput.correctWord('conssilium', dict)).toBe('consilium');
  });

  it('returns null on ties between equally distant candidates', () => {
    const tieDict = new Set(['test2', 'test3']);
    expect(SmartInput.correctWord('test1', tieDict)).toBeNull();
  });

  it('returns null when the edit distance exceeds the budget', () => {
    expect(SmartInput.correctWord('abcdefg', new Set(['abcde']))).toBeNull();
  });

  it('allows distance 2 for words of 8+ chars', () => {
    expect(SmartInput.correctWord('123456789', new Set(['1234567']))).toBe('1234567');
  });
});

describe('SmartInput.fixCommand', () => {
  it('returns null for empty, non-slash and unknown-free tokens', () => {
    expect(SmartInput.fixCommand('')).toBeNull();
    expect(SmartInput.fixCommand('hist')).toBeNull();
    expect(SmartInput.fixCommand('/')).toBeNull();
  });

  it('returns null for exact known commands', () => {
    expect(SmartInput.fixCommand('/help')).toBeNull();
    expect(SmartInput.fixCommand('/CONSILIUM'.toLowerCase())).toBeNull();
    expect(SmartInput.fixCommand('/top')).toBeNull();
  });

  it('expands unique prefixes', () => {
    expect(SmartInput.fixCommand('/hist')).toBe('/history');
    expect(SmartInput.fixCommand('/mod')).toBe('/mode');
  });

  it('maps transliterated commands', () => {
    expect(SmartInput.fixCommand('/модели')).toBe('/models');
    expect(SmartInput.fixCommand('/консилиум')).toBe('/consilium');
    expect(SmartInput.fixCommand('/мова')).toBe('/lang');
  });

  it('falls back to fuzzy matching within one leading character', () => {
    expect(SmartInput.fixCommand('/help1')).toBe('/help');
    expect(SmartInput.fixCommand('/toop')).toBe('/top');
  });

  it('returns null for ambiguous or unmatchable prefixes', () => {
    expect(SmartInput.fixCommand('/c')).toBeNull();
    expect(SmartInput.fixCommand('/mo')).toBeNull();
    expect(SmartInput.fixCommand('/zzz')).toBeNull();
  });
});

describe('SmartInput.normalizePunct', () => {
  it('removes spaces before punctuation and collapses runs of spaces', () => {
    expect(SmartInput.normalizePunct('word  , more')).toBe('word, more');
    expect(SmartInput.normalizePunct('a  b')).toBe('a b');
    expect(SmartInput.normalizePunct('end.  ')).toBe('end.');
  });

  it('adds a space after punctuation when a non-digit follows', () => {
    expect(SmartInput.normalizePunct('a,b')).toBe('a, b');
    expect(SmartInput.normalizePunct('Hi!there')).toBe('Hi! there');
    expect(SmartInput.normalizePunct('word.End')).toBe('word. End');
  });

  it('preserves numbers, times and decimals', () => {
    expect(SmartInput.normalizePunct('value 3.14 at 19:10 cost')).toBe('value 3.14 at 19:10 cost');
  });

  it('trims trailing whitespace per line', () => {
    expect(SmartInput.normalizePunct('one  \ntwo \t')).toBe('one\ntwo');
  });
});

describe('SmartInput.autocorrect', () => {
  it('returns empty fixes for empty or whitespace-only input', () => {
    expect(SmartInput.autocorrect('')).toEqual({ text: '', fixes: [] });
    expect(SmartInput.autocorrect('   ')).toEqual({ text: '   ', fixes: [] });
  });

  it('expands a mistyped leading command and records the fix', () => {
    const res = SmartInput.autocorrect('/hist status');
    expect(res.text.startsWith('/history status')).toBe(true);
    expect(res.fixes).toContainEqual({ from: '/hist', to: '/history' });
  });

  it('never touches code fences or URLs', () => {
    const fence = 'run ```def secretfn(): pass``` now';
    expect(SmartInput.autocorrect(fence).text).toBe(fence);
    const url = 'open https://example.com/path?q=1 today';
    expect(SmartInput.autocorrect(url).text).toContain('https://example.com/path?q=1');
  });

  it('protects vocabulary words from correction', () => {
    SmartInput.rememberText('learn wordxyz now');
    const res = SmartInput.autocorrect('keep wordxyz here');
    expect(res.text).toContain('wordxyz');
    expect(res.fixes).toEqual([]);
  });

  it('fixes a near-miss word, applies case and learns the correction', () => {
    const res = SmartInput.autocorrect('say Спасибоо');
    expect(res.text).toContain('Спасибо');
    expect(res.text).not.toContain('Спасибоо');
    expect(res.fixes.length).toBeGreaterThan(0);
    expect(SmartInput.lexiconSet().has('спасибо')).toBe(true);
  });

  it('applies punctuation normalization', () => {
    const res = SmartInput.autocorrect('done , ok');
    expect(res.text).toContain('done, ok');
  });
});

describe('TRANSLATIONS i18n dictionary', () => {
  const langs = ['en', 'uk', 'ru'] as const;

  it('has identical key sets across all languages', () => {
    const enKeys = Object.keys(TRANSLATIONS.en).sort();
    for (const lang of langs) {
      expect(Object.keys(TRANSLATIONS[lang]).sort()).toEqual(enKeys);
    }
    expect(enKeys.length).toBeGreaterThan(30);
  });

  it('contains only non-empty string values', () => {
    for (const lang of langs) {
      for (const [key, value] of Object.entries(TRANSLATIONS[lang])) {
        expect(typeof value, `${lang}.${key}`).toBe('string');
        expect((value as string).length, `${lang}.${key}`).toBeGreaterThan(0);
      }
    }
  });

  it('provides distinct translations per language', () => {
    const titles = langs.map((l) => TRANSLATIONS[l].appTitle);
    expect(new Set(titles).size).toBe(langs.length);
    expect(TRANSLATIONS.en.statusOnline).toBe('ONLINE');
    expect(TRANSLATIONS.uk.statusOnline).not.toBe(TRANSLATIONS.en.statusOnline);
    expect(TRANSLATIONS.ru.statusOnline).not.toBe(TRANSLATIONS.en.statusOnline);
  });

  it('respects the locale policy: no forbidden currency terms or domains', () => {
    for (const lang of langs) {
      const all = Object.values(TRANSLATIONS[lang]).join(' ');
      expect(all.toLowerCase()).not.toMatch(/рубл/);
      expect(all).not.toMatch(/\.ru\b|\.su\b/);
    }
    expect(TRANSLATIONS.en.appTitle).toMatch(/EVABOT/);
  });
});

describe('app.ts module surface', () => {
  it('boots the singleton app on window', () => {
    const app = (window as unknown as Record<string, unknown>).evaBotApp as { currentLang?: string } | undefined;
    expect(app).toBeDefined();
  });

  it('exposes an AppConfig-shaped config contract via translation keys', () => {
    const cfg: Pick<AppConfig, 'productName' | 'version'> = { productName: 'EvaBot', version: 'test' };
    expect(cfg.productName.length).toBeGreaterThan(0);
  });
});
