/**
 * CloudTTS.ts — Google Cloud Text-to-Speech for EvaBot (ONLY-FREE compliant).
 *
 * Reuses GoogleAuthProvider token/credentials logic (user-ADC refresh token
 * exchange). Every request sends:
 *   Authorization: Bearer <token>
 *   X-Goog-User-Project: evabot-agent-server   (REQUIRED for user-ADC auth)
 *
 * Endpoint: POST https://texttospeech.googleapis.com/v1/text:synthesize
 *
 * ONLY-FREE rule (verified 2026-09 against the official pricing page
 * https://cloud.google.com/text-to-speech/pricing):
 *   - WaveNet voices: first 1M chars/month free, then pay-per-char.
 *   - Chirp 3: HD voices: free allowance exists too (1M chars/mo), but after
 *     the cap it is the most expensive family ($30/1M chars).
 *   - Standard voices: first 4M chars/month free.
 * The module enforces a hard monthly character cap (MAX_CHARS_FREE_PER_MONTH,
 * default 900_000 = safety margin under the 1M Wavenet free allowance) and
 * REFUSES to synthesize beyond it. It never silently spends money: requests
 * over the cap are rejected with an overCap result so callers can fall back
 * to browser TTS.
 *
 * Persona voice mapping (verified from live GET /v1/voices, 2066 voices):
 *   Ева (female) → uk-UA-Wavenet-B (FEMALE, Wavenet free tier)
 *   Адам (male)  → ru-RU-Wavenet-D (MALE,   Wavenet free tier)
 * uk-UA beyond Chirp3-HD also offers Standard-B (F) and Wavenet-B (F);
 * ru-RU offers Standard A-E and Wavenet A-E — so no Chirp3-HD is needed at
 * all and the whole feature stays inside the free tier.
 *
 * Extras:
 *   - Monthly usage counter persisted at data/tts-usage.json {month, chars}.
 *   - Audio cache: identical (text+voice) results stored at
 *     data/tts-cache/<sha1>.mp3 — cache hits never hit the API or the counter.
 *   - 10 s hard deadline via Resilience.withTimeout.
 *   - synthesize() NEVER throws into the chat flow: all failures resolve to
 *     { ok: false, error } so callers can fall back gracefully.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { logger } from './Logger.js';
import { GoogleAuthProvider } from './GoogleAuthProvider.js';
import { withTimeout } from './Resilience.js';

export type TtsPersona = 'eva' | 'adam';

export interface TtsSynthesisOptions {
  lang?: string;
  persona?: TtsPersona;
  voiceName?: string;
}

export interface TtsSynthesisResult {
  ok: boolean;
  base64Audio?: string;
  voice: string;
  charCount: number;
  cached?: boolean;
  overCap?: boolean;
  charsLeftThisMonth?: number;
  payPerCharAfterCap?: boolean;
  error?: string;
}

export interface TtsUsageState {
  month: string;
  chars: number;
}

export interface CloudTTSOptions {
  dataDir?: string;
  fetchFn?: typeof fetch;
  getCredentials?: () => Promise<{ token: string } | null>;
  cap?: number;
  evaVoice?: string;
  adamVoice?: string;
  timeoutMs?: number;
}

const TTS_ENDPOINT = 'https://texttospeech.googleapis.com/v1/text:synthesize';
const TTS_VOICES_ENDPOINT = 'https://texttospeech.googleapis.com/v1/voices';
const USER_PROJECT = 'evabot-agent-server';

/** Voice family derived from the voice name (drives pricing metadata). */
export function voiceFamily(voiceName: string): 'chirp3-hd' | 'wavenet' | 'neural2' | 'studio' | 'standard' {
  if (voiceName.includes('Chirp3')) return 'chirp3-hd';
  if (voiceName.includes('Wavenet')) return 'wavenet';
  if (voiceName.includes('Neural2')) return 'neural2';
  if (voiceName.includes('Studio')) return 'studio';
  return 'standard';
}

/** Free-tier allowance per family, chars/month (verified 2026-09, see doc). */
export function familyFreeAllowance(family: string): number {
  switch (family) {
    case 'standard': return 4_000_000;
    case 'wavenet':
    case 'neural2':
    case 'chirp3-hd': return 1_000_000;
    default: return 100_000; // studio
  }
}

/** Pay-per-char label used when the module reports a cap-exhausted family. */
export function familyPayPerCharNote(family: string): string {
  switch (family) {
    case 'chirp3-hd': return 'PAY-PER-CHAR after cap: US$30 per 1M chars';
    case 'studio': return 'PAY-PER-CHAR after cap: US$160 per 1M chars';
    case 'neural2': return 'PAY-PER-CHAR after cap: US$16 per 1M chars';
    default: return 'PAY-PER-CHAR after cap: US$16 per 1M chars';
  }
}

/** Extracts languageCode ("uk-UA") from a full voice name. */
export function languageCodeOf(voiceName: string): string {
  const parts = voiceName.split('-');
  return parts.length >= 2 ? `${parts[0]}-${parts[1]}` : 'en-US';
}

/** Builds the exact JSON body for POST /v1/text:synthesize. */
export function buildSynthesizeRequest(text: string, voiceName: string): Record<string, unknown> {
  return {
    input: { text },
    voice: {
      languageCode: languageCodeOf(voiceName),
      name: voiceName,
    },
    audioConfig: {
      audioEncoding: 'MP3',
    },
  };
}

export class CloudTTS {
  private readonly dataDir: string;
  private readonly cacheDir: string;
  private readonly fetchFn: typeof fetch;
  private readonly getCredentials: () => Promise<{ token: string } | null>;
  private readonly cap: number;
  private readonly evaVoice: string;
  private readonly adamVoice: string;
  private readonly timeoutMs: number;
  private usage: TtsUsageState | null = null;
  private voicesReady: boolean = false;

  constructor(opts: CloudTTSOptions = {}) {
    this.dataDir = opts.dataDir || path.resolve(process.cwd(), 'data');
    this.cacheDir = path.join(this.dataDir, 'tts-cache');
    this.fetchFn = opts.fetchFn || fetch;
    this.getCredentials = opts.getCredentials || (async () => {
      const creds = await GoogleAuthProvider.getCredentials();
      return creds ? { token: creds.token } : null;
    });
    this.cap = opts.cap ?? 900_000;
    this.evaVoice = opts.evaVoice || 'uk-UA-Wavenet-B';
    this.adamVoice = opts.adamVoice || 'ru-RU-Wavenet-D';
    this.timeoutMs = opts.timeoutMs ?? 10_000;
  }

  /** Explicit voice name (env override) wins, then persona, then lang guess. */
  public resolveVoice(opts: TtsSynthesisOptions = {}): string {
    if (opts.voiceName) return opts.voiceName;
    if (opts.persona === 'adam') return this.adamVoice;
    if (opts.persona === 'eva') return this.evaVoice;
    const lang = (opts.lang || '').toLowerCase();
    if (lang.startsWith('ru')) return this.adamVoice;
    if (lang.startsWith('uk') || lang.startsWith('ua')) return this.evaVoice;
    return this.evaVoice;
  }

  public getCap(): number {
    return this.cap;
  }

  public getEvaVoice(): string {
    return this.evaVoice;
  }

  public getAdamVoice(): string {
    return this.adamVoice;
  }

  public isVoicesReady(): boolean {
    return this.voicesReady;
  }

  /** Current month key, e.g. "2026-09". */
  public static currentMonth(d: Date = new Date()): string {
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
  }

  /** Loads (and month-rolls) the persisted usage counter. */
  public getUsage(): TtsUsageState {
    const now = CloudTTS.currentMonth();
    if (this.usage && this.usage.month === now) return this.usage;
    try {
      const p = path.join(this.dataDir, 'tts-usage.json');
      if (fs.existsSync(p)) {
        const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
        if (raw.month === now) {
          this.usage = { month: raw.month, chars: Number(raw.chars) || 0 };
          return this.usage;
        }
      }
    } catch {
      // Corrupt file → start fresh for this month.
    }
    this.usage = { month: now, chars: 0 };
    return this.usage;
  }

  public getMonthChars(): number {
    return this.getUsage().chars;
  }

  public getCharsLeft(): number {
    return Math.max(0, this.cap - this.getMonthChars());
  }

  private persistUsage(): void {
    try {
      fs.mkdirSync(this.dataDir, { recursive: true });
      fs.writeFileSync(
        path.join(this.dataDir, 'tts-usage.json'),
        JSON.stringify(this.getUsage(), null, 2),
        'utf8',
      );
    } catch (err: any) {
      logger.warn('CloudTTS', `Failed to persist usage counter: ${err.message}`);
    }
  }

  private cachePath(text: string, voice: string): string {
    const sha1 = crypto.createHash('sha1').update(`${voice}::${text}`).digest('hex');
    return path.join(this.cacheDir, `${sha1}.mp3`);
  }

  /** Cache hit check — cache hits never hit the API nor the usage counter. */
  public readCache(text: string, voice: string): string | null {
    try {
      const p = this.cachePath(text, voice);
      if (fs.existsSync(p) && fs.statSync(p).size > 0) {
        return fs.readFileSync(p).toString('base64');
      }
    } catch {
      // Cache read failure is non-fatal.
    }
    return null;
  }

  public writeCache(text: string, voice: string, base64Audio: string): void {
    try {
      fs.mkdirSync(this.cacheDir, { recursive: true });
      fs.writeFileSync(this.cachePath(text, voice), new Uint8Array(Buffer.from(base64Audio, 'base64')));
    } catch (err: any) {
      logger.warn('CloudTTS', `Failed to write TTS cache: ${err.message}`);
    }
  }

  /**
   * Synthesizes text to base64 MP3. Never throws — failures resolve to
   * { ok: false, error } so the chat flow can fall back to browser TTS.
   */
  public async synthesize(text: string, opts: TtsSynthesisOptions = {}): Promise<TtsSynthesisResult> {
    const clean = String(text || '').trim();
    const voice = this.resolveVoice(opts);
    const charCount = clean.length;
    const family = voiceFamily(voice);
    const payPerCharNote = familyPayPerCharNote(family);

    if (!clean) {
      return { ok: false, voice, charCount: 0, error: 'empty text' };
    }

    // 1. Cache hit path (no API call, no counter increment).
    const cached = this.readCache(clean, voice);
    if (cached) {
      return {
        ok: true,
        base64Audio: cached,
        voice,
        charCount,
        cached: true,
        charsLeftThisMonth: this.getCharsLeft(),
      };
    }

    // 2. ONLY-FREE hard cap enforcement. Refuse before spending anything.
    if (this.getMonthChars() + charCount > this.cap) {
      logger.warn('CloudTTS', `Monthly cap ${this.cap} reached (${this.getMonthChars()} used). Refusing synthesis of ${charCount} chars — falling back to browser TTS. ${payPerCharNote}`);
      return {
        ok: false,
        voice,
        charCount,
        overCap: true,
        charsLeftThisMonth: 0,
        payPerCharAfterCap: true,
        error: `Monthly free cap (${this.cap} chars) reached. ${payPerCharNote}. Falling back to browser TTS.`,
      };
    }

    // 3. Credentials.
    let token: string;
    try {
      const creds = await this.getCredentials();
      if (!creds || !creds.token) {
        return { ok: false, voice, charCount, error: 'No Google credentials available' };
      }
      token = creds.token;
    } catch (err: any) {
      return { ok: false, voice, charCount, error: `Credentials failed: ${err.message}` };
    }

    // 4. HTTP call with 10 s deadline; errors never throw into chat flow.
    try {
      const res = await withTimeout(
        this.fetchFn(TTS_ENDPOINT, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Goog-User-Project': USER_PROJECT,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(buildSynthesizeRequest(clean, voice)),
        }),
        this.timeoutMs,
        'CloudTTS text:synthesize',
      );

      if (!res.ok) {
        const errBody = await res.text().catch(() => '');
        return {
          ok: false,
          voice,
          charCount,
          payPerCharAfterCap: family === 'chirp3-hd' && !this.voicesReady,
          error: `TTS API ${res.status}: ${errBody.slice(0, 200)}`,
        };
      }

      const data: any = await res.json();
      const base64Audio = data.audioContent || '';
      if (!base64Audio) {
        return { ok: false, voice, charCount, error: 'Empty audioContent from TTS API' };
      }

      this.voicesReady = true;

      // 5. Persist counter AFTER a successful synthesis (charge once).
      const usage = this.getUsage();
      usage.chars += charCount;
      this.persistUsage();

      // 6. Cache identical (text+voice) results.
      this.writeCache(clean, voice, base64Audio);

      return {
        ok: true,
        base64Audio,
        voice,
        charCount,
        cached: false,
        charsLeftThisMonth: this.getCharsLeft(),
      };
    } catch (err: any) {
      return { ok: false, voice, charCount, error: `TTS request failed: ${err.message}` };
    }
  }

  /**
   * Lists voices for a language (e.g. ru-RU, uk-UA) via GET /v1/voices.
   * Used for /api/tts/status "voicesReady" and for diagnostics.
   */
  public async listVoices(lang?: string): Promise<Array<{ name: string; gender: string }>> {
    try {
      const creds = await this.getCredentials();
      if (!creds || !creds.token) return [];
      const url = lang
        ? `${TTS_VOICES_ENDPOINT}?languageCode=${encodeURIComponent(lang)}`
        : TTS_VOICES_ENDPOINT;
      const res = await withTimeout(
        this.fetchFn(url, {
          headers: {
            'Authorization': `Bearer ${creds.token}`,
            'X-Goog-User-Project': USER_PROJECT,
          },
        }),
        this.timeoutMs,
        'CloudTTS /v1/voices',
      );
      if (!res.ok) return [];
      const data: any = await res.json();
      const voices = (data.voices || []).map((v: any) => ({
        name: v.name,
        gender: v.ssmlGender || 'UNSPECIFIED',
      }));
      this.voicesReady = voices.length > 0;
      return voices;
    } catch {
      return [];
    }
  }
}

/** Process-wide singleton used by the voice router and chat integrations. */
export const cloudTts = new CloudTTS();
