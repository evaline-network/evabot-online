import crypto from 'node:crypto';
import { Config } from './Config.js';

/**
 * DeveloperMode — password-protected "developer mode" per chat session.
 *
 * Sessions unlock via `/developer unlock <password>` and stay unlocked for
 * UNLOCK_TTL_MS (2h). The password comes from env EVADEV_PASSWORD (exposed as
 * Config.developerPassword). Verification is constant-time (sha256 +
 * crypto.timingSafeEqual) and the raw password is NEVER echoed back nor
 * persisted — ChatRouter/ChatEngine mask it through maskPasswordIn() before
 * writing to ChatHistoryStore.
 */
export interface DeveloperCommand {
  sub: 'unlock' | 'status' | 'lock' | 'help';
  password?: string;
}

interface UnlockEntry {
  expiresAt: number;
}

const UNLOCK_TTL_MS = 2 * 60 * 60 * 1000; // 2h
const unlocks = new Map<string, UnlockEntry>();

/** Injectable clock so tests can simulate TTL expiry without real timers. */
let nowFn: () => number = () => Date.now();

/**
 * Session context of the command currently being executed. Set by the
 * transports (TelegramBot → `tg-<chatId>`, ModelsRouter /api/models/command →
 * body.sessionId) before ModelCommand.execute; plain CLI leaves it unset and
 * falls back to DEFAULT_SESSION ('cli').
 */
let activeSession: string | null = null;

export class DeveloperMode {
  public static readonly UNLOCK_TTL_MS = UNLOCK_TTL_MS;
  public static readonly DEFAULT_SESSION = 'cli';

  /** Sets the session context for the command about to execute. */
  public static setActiveSession(sessionId?: string): void {
    activeSession = sessionId && sessionId.trim() ? sessionId.trim() : null;
  }

  /** Clears the session context (returns to the CLI default). */
  public static clearActiveSession(): void {
    activeSession = null;
  }

  /** Test hook: override the clock (pass Date.now to restore). */
  public static setClock(fn: () => number): void {
    nowFn = fn;
  }

  /** Live password: env wins so tests / runtime re-exports take effect immediately. */
  public static getPassword(): string {
    return (process.env.EVADEV_PASSWORD || Config.developerPassword || '').trim();
  }

  /** Constant-time password verification (sha256 + timingSafeEqual). */
  public static verify(password: string): boolean {
    const expected = this.getPassword();
    if (!expected || !password) return false;
    const a = crypto.createHash('sha256').update(password, 'utf8').digest();
    const b = crypto.createHash('sha256').update(expected, 'utf8').digest();
    return crypto.timingSafeEqual(a, b);
  }

  /** Resolves the effective session id: explicit → active → CLI default. */
  public static resolveSession(sessionId?: string): string {
    return (sessionId && sessionId.trim()) || activeSession || this.DEFAULT_SESSION;
  }

  /** Unlock a session; returns false on wrong password or missing env config. */
  public static unlock(sessionId: string, password: string): boolean {
    if (!this.verify(password)) return false;
    unlocks.set(this.resolveSession(sessionId), { expiresAt: nowFn() + UNLOCK_TTL_MS });
    return true;
  }

  /** Whether the session is currently unlocked (lazily prunes expired entries). */
  public static isUnlocked(sessionId: string): boolean {
    const entry = unlocks.get(this.resolveSession(sessionId));
    if (!entry) return false;
    if (nowFn() >= entry.expiresAt) {
      unlocks.delete(this.resolveSession(sessionId));
      return false;
    }
    return true;
  }

  /** Remaining TTL (ms) or 0 when locked. */
  public static ttlRemainingMs(sessionId: string): number {
    if (!this.isUnlocked(sessionId)) return 0;
    const entry = unlocks.get(this.resolveSession(sessionId))!;
    return Math.max(0, entry.expiresAt - nowFn());
  }

  /** Explicit lock; returns true when the session WAS unlocked. */
  public static lock(sessionId: string): boolean {
    const was = this.isUnlocked(sessionId);
    unlocks.delete(this.resolveSession(sessionId));
    return was;
  }

  /** Human status line: locked/unlocked + TTL. */
  public static statusLine(sessionId: string): string {
    if (this.isUnlocked(sessionId)) {
      const mins = Math.round(this.ttlRemainingMs(sessionId) / 60000);
      return `[DEV-ON] Режим розробника АКТИВНИЙ (сесія ${this.resolveSession(sessionId)}) — автозакриття через ~${mins} хв.`;
    }
    return `[DEV-OFF] Режим розробника ЗАЧИНЕНО (сесія ${this.resolveSession(sessionId)}).`;
  }

  /** Full wipe (tests). */
  public static resetAll(): void {
    unlocks.clear();
  }

  /**
   * Masks the password argument in persisted chat history:
   * "/developer unlock MyS3cret" → "/developer unlock ****".
   * Handles EN + UK command spellings and any leading whitespace.
   */
  public static maskPasswordIn(text: string): string {
    if (!text) return text;
    return text.replace(
      /^(\s*\/(?:developer|девелопер|розробник)\s+unlock\s+)([^\s]+)(.*)$/i,
      (_m, head: string, _pwd: string, tail: string) => `${head}****${tail}`
    );
  }

  /**
   * Parses a raw /developer command while PRESERVING the password casing
   * (normalizeCommand lowercases everything, so the raw string is parsed here).
   * Returns null when the input is not a /developer command.
   */
  public static parseCommand(raw: string): DeveloperCommand | null {
    const trimmed = (raw || '').trim();
    if (!trimmed) return null;
    const spaceIdx = trimmed.indexOf(' ');
    const head = (spaceIdx === -1 ? trimmed : trimmed.slice(0, spaceIdx))
      .toLowerCase()
      .replace(/['`´ʼ’]/g, "'");
    // Command head spellings (kept in sync with COMMAND_ALIASES in ModelRatings).
    if (!['/developer', '/девелопер', '/розробник'].includes(head)) return null;
    const rest = spaceIdx === -1 ? '' : trimmed.slice(spaceIdx + 1).trim();
    if (!rest) return { sub: 'help' };
    const subSpace = rest.indexOf(' ');
    const sub = (subSpace === -1 ? rest : rest.slice(0, subSpace)).toLowerCase();
    if (sub === 'unlock') {
      const password = subSpace === -1 ? '' : rest.slice(subSpace + 1).trim();
      return { sub: 'unlock', password };
    }
    if (sub === 'status') return { sub: 'status' };
    if (sub === 'lock') return { sub: 'lock' };
    return { sub: 'help' };
  }
}
