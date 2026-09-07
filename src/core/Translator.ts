/**
 * Translator.ts — Google Cloud Translation Basic (v3) client for EvaBot.
 *
 * Endpoint: POST https://translation.googleapis.com/v3/projects/{project}/locations/global:translateText
 * Auth:     Bearer token from GoogleAuthProvider + REQUIRED header X-Goog-User-Project.
 * Free tier: first 500,000 characters/month are free (applied as a $10 credit every
 *            month) — https://cloud.google.com/translate/pricing (verified 2026-09).
 *
 * ONLY-FREE policy: a persistent monthly counter (data/translate-usage.json,
 * { month: 'YYYY-MM', chars }) refuses any request once the soft cap of 480,000
 * characters is reached, so the account can never be billed.
 *
 * Design guarantees:
 *  - translate() NEVER throws into the command path — all failures are returned
 *    as { ok: false, error } results.
 *  - 10 s hard deadline via Resilience.withTimeout (+ AbortSignal on the fetch).
 *  - Contents are batched: max 128 fragments per HTTP request (v3 limit).
 */

import fs from 'node:fs';
import path from 'node:path';
import { GoogleAuthProvider } from './GoogleAuthProvider.js';
import { withTimeout } from './Resilience.js';
import { logger } from './Logger.js';
import { OpLog } from './OpLog.js';

/** Soft monthly character cap (below the 500,000 free-tier ceiling). */
export const TRANSLATE_MONTHLY_CAP = 480_000;

/** Google free tier: first 500k characters/month (source: translate/pricing). */
export const TRANSLATE_FREE_TIER_CHARS = 500_000;

/** Max fragments (contents[]) per single v3 translateText request. */
export const TRANSLATE_MAX_FRAGMENTS_PER_REQUEST = 128;

/** Hard deadline for one HTTP translation round-trip. */
export const TRANSLATE_TIMEOUT_MS = 10_000;

/** Target language codes the /translate command accepts. */
export const TRANSLATE_LANG_RE = /^[a-z]{2,3}(-[A-Za-z0-9]{2,8})?$/;

export const TRANSLATE_PROJECT = 'evabot-agent-server';

export interface TranslatorOptions {
  fetchFn?: typeof fetch;
  getCredentials?: typeof GoogleAuthProvider.getCredentials;
  usageFilePath?: string;
  timeoutMs?: number;
}

export interface TranslateResult {
  ok: boolean;
  /** Translated fragments (same order as the input). Empty when !ok. */
  translations: string[];
  /** Detected source language, when the API reports it. */
  detectedLanguageCode?: string;
  /** Characters counted against the monthly usage for THIS call. */
  charsUsed: number;
  /** { month, chars } snapshot after this call. */
  usage: { month: string; chars: number };
  /** Human-readable failure reason (empty when ok). */
  error?: string;
}

export interface UsageRecord {
  month: string;
  chars: number;
}

export function currentMonthKey(now: Date = new Date()): string {
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
}

/** Builds the v3 translateText JSON body (exported for tests). */
export function buildTranslateBody(
  contents: string[],
  targetLanguageCode: string,
  sourceLanguageCode?: string
): Record<string, unknown> {
  const body: Record<string, unknown> = {
    targetLanguageCode,
    contents,
    mimeType: 'text/plain',
  };
  if (sourceLanguageCode) body.sourceLanguageCode = sourceLanguageCode;
  return body;
}

/** Splits fragments into batches of at most TRANSLATE_MAX_FRAGMENTS_PER_REQUEST. */
export function splitIntoBatches<T>(items: T[], max = TRANSLATE_MAX_FRAGMENTS_PER_REQUEST): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += max) {
    batches.push(items.slice(i, i + max));
  }
  return batches;
}

export class Translator {
  private readonly fetchFn: typeof fetch;
  private readonly getCredentials: typeof GoogleAuthProvider.getCredentials;
  private readonly usageFilePath: string;
  private readonly timeoutMs: number;

  constructor(opts: TranslatorOptions = {}) {
    this.fetchFn = opts.fetchFn || fetch.bind(globalThis);
    this.getCredentials = (opts.getCredentials ||
      GoogleAuthProvider.getCredentials.bind(GoogleAuthProvider)) as typeof GoogleAuthProvider.getCredentials;
    this.usageFilePath =
      opts.usageFilePath || path.join(process.cwd(), 'data', 'translate-usage.json');
    this.timeoutMs = opts.timeoutMs || TRANSLATE_TIMEOUT_MS;
  }

  /**
   * Translates one fragment or a batch of fragments into `to`.
   * Never throws: failures come back as { ok: false, error }.
   */
  public async translate(
    text: string | string[],
    to: string,
    from?: string
  ): Promise<TranslateResult> {
    const contents = (Array.isArray(text) ? text : [text]).map((t) => String(t ?? ''));
    const target = (to || '').trim().toLowerCase();

    if (!contents.length || contents.every((c) => c.trim() === '')) {
      return { ok: false, translations: [], charsUsed: 0, usage: this.getUsage(), error: 'Порожній текст для перекладу.' };
    }
    if (!TRANSLATE_LANG_RE.test(target)) {
      return { ok: false, translations: [], charsUsed: 0, usage: this.getUsage(), error: `Неправильний код мови цілі: "${to}". Приклад: uk, en, ru, pl, de.` };
    }

    // ONLY-FREE guard: refuse BEFORE spending if this call would cross the cap.
    const pendingChars = contents.reduce((sum, c) => sum + c.length, 0);
    const usage = this.getUsage();
    if (usage.chars + pendingChars > TRANSLATE_MONTHLY_CAP) {
      const msg = `[TRANSLATE] Місячний ліміт free tier вичерпано: ${usage.chars}/${TRANSLATE_MONTHLY_CAP} символів використано цього місяця (${usage.month}). Ліміт відновиться 1-го числа наступного місяця.`;
      logger.warn('Translator', msg);
      OpLog.getInstance().log('warn', 'system', msg);
      return { ok: false, translations: [], charsUsed: 0, usage, error: msg };
    }

    try {
      const credentials = await this.getCredentials();
      if (!credentials) {
        return { ok: false, translations: [], charsUsed: 0, usage: this.getUsage(), error: 'Немає Google-автентифікації (GoogleAuthProvider повернув null).' };
      }

      const allTranslations: string[] = [];
      let detected: string | undefined;
      const batches = splitIntoBatches(contents);
      let charsThisCall = 0;

      for (const batch of batches) {
        const url = `https://translation.googleapis.com/v3/projects/${TRANSLATE_PROJECT}/locations/global:translateText`;
        const res = await withTimeout(
          this.fetchFn(url, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${credentials.token}`,
              'X-Goog-User-Project': TRANSLATE_PROJECT,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(buildTranslateBody(batch, target, from)),
            signal: AbortSignal.timeout(this.timeoutMs),
          }),
          this.timeoutMs,
          'Google Cloud Translation v3'
        );

        if (!res.ok) {
          const errText = await res.text().catch(() => '');
          throw new Error(`HTTP ${res.status}: ${errText.substring(0, 300)}`);
        }
        const data: any = await res.json();
        const list = (data.translations || []) as Array<{ translatedText: string; detectedLanguageCode?: string }>;
        if (list.length !== batch.length) {
          throw new Error(`Очікувано ${batch.length} перекладів, отримано ${list.length}.`);
        }
        for (const t of list) {
          allTranslations.push(t.translatedText);
          if (t.detectedLanguageCode && !detected) detected = t.detectedLanguageCode;
        }
        charsThisCall += batch.reduce((sum, c) => sum + c.length, 0);
      }

      const newUsage = this.addUsage(charsThisCall);
      return {
        ok: true,
        translations: allTranslations,
        detectedLanguageCode: detected,
        charsUsed: charsThisCall,
        usage: newUsage,
      };
    } catch (err: any) {
      const msg = `[TRANSLATE] Помилка перекладу: ${err?.message || err}`;
      logger.warn('Translator', msg);
      return { ok: false, translations: [], charsUsed: 0, usage: this.getUsage(), error: msg };
    }
  }

  /** Reads (and month-rolls) the persistent usage counter. Never throws. */
  public getUsage(): { month: string; chars: number } {
    try {
      const raw = fs.readFileSync(this.usageFilePath, 'utf8');
      const rec = JSON.parse(raw) as UsageRecord;
      const month = currentMonthKey();
      if (rec.month === month) return { month: rec.month, chars: rec.chars || 0 };
      return { month, chars: 0 };
    } catch {
      return { month: currentMonthKey(), chars: 0 };
    }
  }

  /** Adds `chars` to the monthly counter and persists it. Never throws. */
  public addUsage(chars: number): { month: string; chars: number } {
    const cur = this.getUsage();
    const next: UsageRecord = { month: cur.month, chars: cur.chars + Math.max(0, chars) };
    try {
      fs.mkdirSync(path.dirname(this.usageFilePath), { recursive: true });
      fs.writeFileSync(this.usageFilePath, JSON.stringify(next, null, 2), 'utf8');
    } catch (err: any) {
      logger.warn('Translator', `Не вдалося зберегти лічильник перекладів: ${err?.message}`);
    }
    return next;
  }

  /** Usage footer for command replies: chars used / cap + free-tier note. */
  public formatUsageFooter(usage: { month: string; chars: number }): string {
    return `📡 Переклад-лічильник: ${usage.chars}/${TRANSLATE_MONTHLY_CAP} символів цього місяця (free tier: 500 000/міс — cloud.google.com/translate/pricing).`;
  }
}

/** Shared singleton used by the /translate command (real credentials). */
export const translator = new Translator();
