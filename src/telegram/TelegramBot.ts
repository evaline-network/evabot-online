import { ModelCommand, normalizeCommand } from '../models/ModelRatings.js';
import { ModelRatings } from '../models/ModelRatings.js';
import { Config } from '../core/Config.js';
import { logger, LogCategory } from '../core/Logger.js';
import { I18nEngine, SupportedLocale } from '../core/I18nEngine.js';
import { transcribeVoiceWithFallback, type SttLanguage, type SttResult } from '../core/CloudSTT.js';
import { DeveloperMode } from '../core/DeveloperMode.js';
import { ChatEngine } from './ChatEngine.js';

export const TELEGRAM_MESSAGE_LIMIT = 4096;
const TELEGRAM_API_BASE = 'https://api.telegram.org';
const RATE_LIMIT_INTERVAL_MS = 1000;
const VOICE_PLACEHOLDER = '[WRN] Не вдалося завантажити голосове повідомлення. Спробуйте ще раз.';
const VOICE_PREFIX = ' Розпізнано:';

/** Async transcriber injected for tests; production default = Google CloudSTT with FLAC fallback. */
export type VoiceTranscriber = (audio: Buffer, lang: SttLanguage) => Promise<SttResult>;
const HISTORY_SESSION_PREFIX = 'tg-';

export interface TelegramCommandExecutor {
  (command: string): string;
}

/**
 * Splits an arbitrary text into chunks that each fit the Telegram sendMessage
 * hard limit (4096 UTF-16 code units per message). Prefers splitting on blank
 * lines, then newlines, then hard-cutting long unbroken lines.
 */
export function splitTelegramMessage(text: string, limit: number = TELEGRAM_MESSAGE_LIMIT): string[] {
  const clean = (text || '').trim();
  if (!clean) return [];
  if (clean.length <= limit) return [clean];

  const chunks: string[] = [];
  let remaining = clean;

  while (remaining.length > limit) {
    const window = remaining.slice(0, limit);

    let cut = window.lastIndexOf('\n\n');
    if (cut < Math.floor(limit * 0.25)) cut = window.lastIndexOf('\n');
    if (cut < Math.floor(limit * 0.25)) cut = window.lastIndexOf(' ');
    if (cut < Math.floor(limit * 0.25)) cut = limit;

    chunks.push(remaining.slice(0, cut).trimEnd());
    remaining = remaining.slice(cut).trimStart();
  }

  if (remaining) chunks.push(remaining);
  return chunks;
}

interface TelegramUser {
  id: number;
  is_bot?: boolean;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramVoice {
  file_id: string;
  duration?: number;
  mime_type?: string;
  file_size?: number;
}

interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  date: number;
  chat: { id: number; type: string; title?: string; username?: string };
  text?: string;
  voice?: TelegramVoice;
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

interface TelegramApiResponse<T> {
  ok: boolean;
  result?: T;
  description?: string;
}

export class TelegramBot {
  private token: string;
  private apiBase: string;
  private chatEngine: ChatEngine;
  private execute: TelegramCommandExecutor;
  private transcriber: VoiceTranscriber;
  private chatLocales: Map<number, SupportedLocale> = new Map();
  private chatQueues: Map<number, Promise<void>> = new Map();
  private chatLastRun: Map<number, number> = new Map();
  private offset: number = 0;
  private running: boolean = false;

  constructor(options: { token?: string; apiBase?: string; execute?: TelegramCommandExecutor; transcriber?: VoiceTranscriber } = {}) {
    this.token = options.token || Config.telegramBotToken;
    this.apiBase = options.apiBase || TELEGRAM_API_BASE;
    this.execute = options.execute || ((command) => ModelCommand.execute(command));
    this.transcriber = options.transcriber || ((audio, lang) => transcribeVoiceWithFallback(audio, { lang }));
    this.chatEngine = new ChatEngine();
  }

  public static isEnabled(): boolean {
    return Boolean(Config.telegramBotToken);
  }

  public async start(): Promise<void> {
    if (!this.token) {
      logger.warn(LogCategory.SYSTEM, 'TelegramBot', 'Telegram bot disabled (no token)');
      return;
    }
    if (this.running) return;

    this.running = true;
    logger.info(LogCategory.SYSTEM, 'TelegramBot', 'Starting Telegram long-polling loop...');
    void this.pollLoop();
  }

  public stop(): void {
    this.running = false;
  }

  private async api<T>(method: string, payload?: Record<string, unknown>): Promise<T | undefined> {
    const res = await fetch(`${this.apiBase}/bot${this.token}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload || {}),
    });
    const data = (await res.json()) as TelegramApiResponse<T>;
    if (!data.ok) {
      throw new Error(`Telegram ${method} failed: ${data.description || 'unknown error'}`);
    }
    return data.result;
  }

  private async pollLoop(): Promise<void> {
    while (this.running) {
      try {
        const updates = await this.api<TelegramUpdate[]>('getUpdates', {
          offset: this.offset,
          timeout: 25,
          allowed_updates: ['message'],
        });
        for (const update of updates || []) {
          this.offset = update.update_id + 1;
          if (update.message) {
            void this.handleMessage(update.message);
          }
        }
      } catch (err: any) {
        if (!this.running) break;
        logger.warn(LogCategory.SYSTEM, 'TelegramBot', `Long-poll error: ${err.message}. Retrying in 5s...`);
        await this.sleep(5000);
      }
    }
  }

  private handleMessage(message: TelegramMessage): Promise<void> {
    return this.enqueueForChat(message.chat.id, () => this.processMessage(message));
  }

  /**
   * Rate limit: 1 message per second per chat. All work for a chat is chained
   * on a per-chat promise queue; each task starts at least RATE_LIMIT_INTERVAL_MS
   * after the previous task in the same chat started.
   */
  private async enqueueForChat(chatId: number, task: () => Promise<void>): Promise<void> {
    const previous = this.chatQueues.get(chatId) || Promise.resolve();
    const run = previous
      .then(async () => {
        const last = this.chatLastRun.get(chatId) || 0;
        const waitMs = Math.max(0, RATE_LIMIT_INTERVAL_MS - (Date.now() - last));
        if (waitMs > 0) await this.sleep(waitMs);
        this.chatLastRun.set(chatId, Date.now());
        await task();
      })
      .catch((err: any) => {
        logger.error(LogCategory.SYSTEM, 'TelegramBot', `Chat ${chatId} handler error: ${err.message}`);
      });

    this.chatQueues.set(chatId, run);
    try {
      await run;
    } finally {
      if (this.chatQueues.get(chatId) === run) this.chatQueues.delete(chatId);
    }
  }

  private async processMessage(message: TelegramMessage): Promise<void> {
    const chatId = message.chat.id;
    const from = message.from;

    if (message.voice) {
      await this.handleVoiceMessage(message);
      return;
    }

    const text = (message.text || '').trim();
    if (!text) return;

    if (!from || (!from.username && !from.first_name)) {
      await this.sendMessage(chatId, '[WRN] Please register a Telegram account (set a username or name) to chat with EvaBot.');
      return;
    }

    if (text.startsWith('/')) {
      await this.handleCommand(chatId, text);
      return;
    }

    await this.handleChatMessage(chatId, text);
  }

  private async handleCommand(chatId: number, raw: string): Promise<void> {
    const locale = this.getChatLocale(chatId);

    if (raw.startsWith('/start')) {
      const strings = I18nEngine.getStrings(locale);
      await this.sendMessage(chatId, `[BOT] ${strings.greeting}\n\n${I18nEngine.formatHelp(locale)}`);
      return;
    }

    const [head] = raw.split(/\s+/);
    const canonicalHead = normalizeCommand(head).split(/\s+/)[0];

    if (canonicalHead === '/lang') {
      const arg = raw.split(/\s+/)[1]?.toLowerCase() || '';
      const resolved: SupportedLocale = arg === 'uk' || arg === 'ua' ? 'uk' : arg === 'ru' ? 'ru' : 'en';
      this.chatLocales.set(chatId, resolved);
      const strings = I18nEngine.getStrings(resolved);
      await this.sendMessage(chatId, strings.langSwitched);
      return;
    }

    if (canonicalHead === '/models') {
      await this.sendMessage(chatId, this.execute('/models'));
      await this.sendModelsKeyboard(chatId);
      return;
    }

    // /subagent needs the async executor (parallel LLM batch, up to ~2 min).
    if (canonicalHead === '/subagent') {
      const output = await ModelCommand.executeAsync(normalizeCommand(raw));
      await this.sendMessage(chatId, output);
      return;
    }

    // /developer keeps the RAW command: normalizeCommand lowercases the whole
    // line, which would corrupt mixed-case passwords (DeveloperMode.parseCommand
    // does its own head-alias resolution).
    if (canonicalHead === '/developer') {
      const sessionId = `${HISTORY_SESSION_PREFIX}${chatId}`;
      DeveloperMode.setActiveSession(sessionId);
      const output = this.execute(raw);
      await this.sendMessage(chatId, output);
      return;
    }

    const commandText = normalizeCommand(raw);
    const output = this.execute(commandText);
    await this.sendMessage(chatId, output);
  }

  private async handleChatMessage(chatId: number, text: string): Promise<void> {
    const sessionId = `${HISTORY_SESSION_PREFIX}${chatId}`;
    const locale = this.getChatLocale(chatId);
    try {
      const response = await this.chatEngine.respond({ message: text, sessionId, locale });
      await this.sendMessage(chatId, response.text);
    } catch (err: any) {
      logger.error(LogCategory.SYSTEM, 'TelegramBot', `Chat error for ${sessionId}: ${err.message}`);
      await this.sendMessage(chatId, `[WRN] Chat engine error: ${err.message}`);
    }
  }

  /**
   * Voice messages (.ogg/opus, 48 kHz): download → Google CloudSTT (OGG_OPUS,
   * FLAC 16 kHz fallback inside transcribeVoiceWithFallback) → send transcript
   * as reply, then treat the transcript like typed text: '/…' runs as a
   * command, otherwise it flows into the normal chat engine.
   */
  private async handleVoiceMessage(message: TelegramMessage): Promise<void> {
    const chatId = message.chat.id;
    const from = message.from;
    const voice = message.voice;
    if (!voice) return;
    if (!from || (!from.username && !from.first_name)) {
      await this.sendMessage(chatId, '[WRN] Please register a Telegram account to send voice messages.');
      return;
    }

    let audio: Buffer | null = null;
    try {
      audio = await this.downloadVoiceFile(voice.file_id);
    } catch (err: any) {
      logger.warn(LogCategory.SYSTEM, 'TelegramBot', `Voice download failed: ${err.message}`);
    }
    if (!audio) {
      await this.sendMessage(chatId, VOICE_PLACEHOLDER);
      return;
    }

    const lang = localeToSttLang(this.getChatLocale(chatId));
    const result = await this.transcriber(audio, lang);
    if (!result.ok || !result.transcript) {
      logger.warn(LogCategory.SYSTEM, 'TelegramBot', `Voice transcription failed: ${result.error}`);
      await this.sendMessage(chatId, `[WRN] Не вдалося розпізнати голосове повідомлення${result.error ? ` (${result.error})` : ''}.`);
      return;
    }

    await this.sendMessage(chatId, `${VOICE_PREFIX} ${result.transcript}`);
    if (result.transcript.startsWith('/')) {
      await this.handleCommand(chatId, result.transcript);
    } else {
      await this.handleChatMessage(chatId, result.transcript);
    }
  }

  private async downloadVoiceFile(fileId: string): Promise<Buffer | null> {
    const file = await this.api<{ file_path?: string }>('getFile', { file_id: fileId });
    const filePath = file?.file_path;
    if (!filePath) return null;
    const res = await fetch(`${this.apiBase}/file/bot${this.token}/${filePath}`);
    const buf = Buffer.from(await res.arrayBuffer());
    logger.info(LogCategory.SYSTEM, 'TelegramBot', `Downloaded voice file ${filePath} (${buf.length} bytes)`);
    return buf.length > 0 ? buf : null;
  }

  public async sendModelsKeyboard(chatId: number): Promise<void> {
    const top8 = ModelRatings.getTopFree(8);
    const rows: string[][] = [];
    for (let i = 0; i < top8.length; i += 2) {
      rows.push(top8.slice(i, i + 2).map((e) => e.model.name));
    }
    await this.api('sendMessage', {
      chat_id: chatId,
      text: ' Top-8 free models — tap to inspect:',
      reply_markup: { keyboard: rows, resize_keyboard: true, one_time_keyboard: true },
    });
  }

  public getChatLocale(chatId: number): SupportedLocale {
    return this.chatLocales.get(chatId) || I18nEngine.getLocale();
  }

  public async sendMessage(chatId: number, text: string): Promise<void> {
    const chunks = splitTelegramMessage(text, TELEGRAM_MESSAGE_LIMIT);
    if (chunks.length === 0) return;
    for (const chunk of chunks) {
      await this.api('sendMessage', { chat_id: chatId, text: chunk, disable_web_page_preview: true });
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

let singleton: TelegramBot | null = null;

/** Maps a chat locale to a Google STT language code. */
export function localeToSttLang(locale: SupportedLocale): SttLanguage {
  return locale === 'uk' ? 'uk-UA' : locale === 'ru' ? 'ru-RU' : 'en-US';
}

export function startTelegramBot(): void {
  if (!TelegramBot.isEnabled()) {
    logger.warn(LogCategory.SYSTEM, 'TelegramBot', 'Telegram bot disabled (no token)');
    return;
  }
  try {
    if (!singleton) singleton = new TelegramBot();
    void singleton.start();
    logger.info(LogCategory.SYSTEM, 'TelegramBot', 'Telegram bot started (long-polling)');
  } catch (err: any) {
    logger.error(LogCategory.SYSTEM, 'TelegramBot', `Failed to start Telegram bot: ${err.message}`);
  }
}
