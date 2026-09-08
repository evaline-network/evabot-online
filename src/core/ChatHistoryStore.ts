import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { logger, LogCategory } from './Logger.js';

export interface ChatHistoryRecord {
  id: number;
  sessionId: string;
  ts: number;
  role: string;
  content: string;
  model: string;
  lang: string;
}

export interface ChatHistoryCounts {
  totalMessages: number;
  sessions: number;
}

export interface ChatSearchHit extends ChatHistoryRecord {
  rank: number;
}

export const DEFAULT_CHAT_HISTORY_DB_PATH = '/var/www/evabot-backend/data/chat-history.db';
export const CONSILIUM_SESSION_ID = 'consilium';

export class ChatHistoryStore {
  private static instances: Map<string, ChatHistoryStore> = new Map();
  private db: DatabaseSync;
  private dbPath: string;
  private ready: boolean = false;

  private constructor(dbPath: string) {
    this.dbPath = dbPath;
    try {
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
      this.db = new DatabaseSync(dbPath);
      this.migrate();
      this.ready = true;
      logger.info(LogCategory.STORAGE, 'CHAT_DB', `Chat history SQLite store ready at ${dbPath}`);
    } catch (err: any) {
      this.db = null as any;
      logger.warn(LogCategory.STORAGE, 'CHAT_DB', `Chat history store unavailable: ${err.message}`);
    }
  }

  public static getInstance(dbPath?: string): ChatHistoryStore {
    const resolved = dbPath || process.env.EVABOT_CHAT_DB || DEFAULT_CHAT_HISTORY_DB_PATH;
    if (!ChatHistoryStore.instances.has(resolved)) {
      ChatHistoryStore.instances.set(resolved, new ChatHistoryStore(resolved));
    }
    return ChatHistoryStore.instances.get(resolved)!;
  }

  public isReady(): boolean {
    return this.ready;
  }

  public getPath(): string {
    return this.dbPath;
  }

  private ensureSchema(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT,
        ts INTEGER,
        role TEXT,
        content TEXT,
        model TEXT,
        lang TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
      CREATE INDEX IF NOT EXISTS idx_messages_ts ON messages(ts);
      CREATE VIRTUAL TABLE IF NOT EXISTS messages_fts USING fts5(content, content='messages', content_rowid='id');
      CREATE TRIGGER IF NOT EXISTS messages_fts_insert AFTER INSERT ON messages BEGIN
        INSERT INTO messages_fts(rowid, content) VALUES (new.id, new.content);
      END;
      CREATE TRIGGER IF NOT EXISTS messages_fts_delete AFTER DELETE ON messages BEGIN
        INSERT INTO messages_fts(messages_fts, rowid, content) VALUES ('delete', old.id, old.content);
      END;
      CREATE TRIGGER IF NOT EXISTS messages_fts_update AFTER UPDATE ON messages BEGIN
        INSERT INTO messages_fts(messages_fts, rowid, content) VALUES ('delete', old.id, old.content);
        INSERT INTO messages_fts(rowid, content) VALUES (new.id, new.content);
      END;
      CREATE TABLE IF NOT EXISTS session_state (
        session_id TEXT PRIMARY KEY,
        auto_enabled INTEGER NOT NULL DEFAULT 0,
        last_model TEXT,
        updated_ts INTEGER
      );
    `);
  }

  private migrate(): void {
    this.ensureSchema();
  }

  /**
   * Persists one chat message. Fire-and-forget safe: never throws to callers.
   */
  public appendMessage(msg: { sessionId: string; role: string; content: string; model?: string; lang?: string; ts?: number }): number | null {
    if (!this.ready || !this.db) return null;
    try {
      const stmt = this.db.prepare(
        'INSERT INTO messages (session_id, ts, role, content, model, lang) VALUES (?, ?, ?, ?, ?, ?)'
      );
      const result = stmt.run(
        msg.sessionId || 'default',
        msg.ts ?? Date.now(),
        msg.role,
        msg.content || '',
        msg.model || '',
        msg.lang || ''
      );
      return Number(result.lastInsertRowid);
    } catch (err: any) {
      logger.warn(LogCategory.STORAGE, 'CHAT_DB', `appendMessage failed: ${err.message}`);
      return null;
    }
  }

  public getSessionHistory(sessionId: string, limit: number = 50): ChatHistoryRecord[] {
    if (!this.ready || !this.db) return [];
    try {
      const rows = this.db
        .prepare(
          `SELECT id, session_id, ts, role, content, model, lang
           FROM messages WHERE session_id = ?
           ORDER BY id DESC LIMIT ?`
        )
        .all(sessionId, limit) as any[];
      return rows
        .reverse()
        .map(this.mapRow);
    } catch (err: any) {
      logger.warn(LogCategory.STORAGE, 'CHAT_DB', `getSessionHistory failed: ${err.message}`);
      return [];
    }
  }

  /**
   * Last N messages across ALL sessions (newest first for listing convenience is reversed to chronological).
   */
  public getRecentMessages(limit: number = 20): ChatHistoryRecord[] {
    if (!this.ready || !this.db) return [];
    try {
      const rows = this.db
        .prepare(
          `SELECT id, session_id, ts, role, content, model, lang
           FROM messages ORDER BY id DESC LIMIT ?`
        )
        .all(limit) as any[];
      return rows.reverse().map(this.mapRow);
    } catch (err: any) {
      logger.warn(LogCategory.STORAGE, 'CHAT_DB', `getRecentMessages failed: ${err.message}`);
      return [];
    }
  }

  /**
   * Full-text search across message content using the FTS5 index.
   */
  public searchMessages(query: string, limit: number = 10): ChatSearchHit[] {
    if (!this.ready || !this.db || !query) return [];
    try {
      const cleanTokens = query
        .replace(/[^\p{L}\p{N}\s]/gu, ' ')
        .split(/\s+/)
        .filter((t) => t.length > 2);
      if (cleanTokens.length === 0) return [];
      const ftsQuery = cleanTokens.map((t) => `"${t}"*`).join(' OR ');
      const rows = this.db
        .prepare(
          `SELECT m.id, m.session_id, m.ts, m.role, m.content, m.model, m.lang, rank
           FROM messages_fts f
           JOIN messages m ON m.id = f.rowid
           WHERE messages_fts MATCH ?
           ORDER BY rank
           LIMIT ?`
        )
        .all(ftsQuery, limit) as any[];
      return rows.map((row) => ({
        ...this.mapRow(row),
        rank: Number(row.rank) || 0,
      }));
    } catch (err: any) {
      logger.warn(LogCategory.STORAGE, 'CHAT_DB', `searchMessages failed: ${err.message}`);
      return [];
    }
  }

  public listSessions(limit: number = 20): Array<{ sessionId: string; messages: number; firstTs: number; lastTs: number }> {
    if (!this.ready || !this.db) return [];
    try {
      const rows = this.db
        .prepare(
          `SELECT session_id,
                  COUNT(*) as messages,
                  MIN(ts) as firstTs,
                  MAX(ts) as lastTs
           FROM messages
           GROUP BY session_id
           ORDER BY MAX(ts) DESC
           LIMIT ?`
        )
        .all(limit) as any[];
      return rows.map((r) => ({
        sessionId: String(r.session_id),
        messages: Number(r.messages),
        firstTs: Number(r.firstTs),
        lastTs: Number(r.lastTs),
      }));
    } catch (err: any) {
      logger.warn(LogCategory.STORAGE, 'CHAT_DB', `listSessions failed: ${err.message}`);
      return [];
    }
  }

  public countAll(): { totalMessages: number; sessions: number } {
    if (!this.ready || !this.db) return { totalMessages: 0, sessions: 0 };
    try {
      const msgRow = this.db.prepare('SELECT COUNT(*) as count FROM messages').get() as any;
      const sessRow = this.db
        .prepare('SELECT COUNT(DISTINCT session_id) as count FROM messages')
        .get() as any;
      return {
        totalMessages: Number(msgRow?.count) || 0,
        sessions: Number(sessRow?.count) || 0,
      };
    } catch (err: any) {
      logger.warn(LogCategory.STORAGE, 'CHAT_DB', `countAll failed: ${err.message}`);
      return { totalMessages: 0, sessions: 0 };
    }
  }

  /**
   * Per-session UI state (TASK-333): /auto flag + last used model.
   * Survives restarts. Never throws to callers.
   */
  public getSessionState(sessionId: string): { autoEnabled: boolean; lastModel: string | null } {
    const fallback = { autoEnabled: false, lastModel: null };
    if (!this.ready || !this.db) return fallback;
    try {
      const row = this.db
        .prepare('SELECT auto_enabled, last_model FROM session_state WHERE session_id = ?')
        .get(sessionId) as any;
      if (!row) return fallback;
      return {
        autoEnabled: Number(row.auto_enabled) === 1,
        lastModel: row.last_model != null ? String(row.last_model) : null,
      };
    } catch (err: any) {
      logger.warn(LogCategory.STORAGE, 'CHAT_DB', `getSessionState failed: ${err.message}`);
      return fallback;
    }
  }

  public setSessionAuto(sessionId: string, enabled: boolean): void {
    if (!this.ready || !this.db) return;
    try {
      this.db
        .prepare(
          `INSERT INTO session_state (session_id, auto_enabled, last_model, updated_ts)
           VALUES (?, ?, NULL, ?)
           ON CONFLICT(session_id) DO UPDATE SET auto_enabled = excluded.auto_enabled, updated_ts = excluded.updated_ts`
        )
        .run(sessionId, enabled ? 1 : 0, Date.now());
    } catch (err: any) {
      logger.warn(LogCategory.STORAGE, 'CHAT_DB', `setSessionAuto failed: ${err.message}`);
    }
  }

  public setSessionLastModel(sessionId: string, model: string): void {
    if (!this.ready || !this.db) return;
    try {
      this.db
        .prepare(
          `INSERT INTO session_state (session_id, auto_enabled, last_model, updated_ts)
           VALUES (?, 0, ?, ?)
           ON CONFLICT(session_id) DO UPDATE SET last_model = excluded.last_model, updated_ts = excluded.updated_ts`
        )
        .run(sessionId, model, Date.now());
    } catch (err: any) {
      logger.warn(LogCategory.STORAGE, 'CHAT_DB', `setSessionLastModel failed: ${err.message}`);
    }
  }

  /** Test/maintenance helper: removes a session_state row. Never throws. */
  public deleteSessionState(sessionId: string): void {
    if (!this.ready || !this.db) return;
    try {
      this.db.prepare('DELETE FROM session_state WHERE session_id = ?').run(sessionId);
    } catch (err: any) {
      logger.warn(LogCategory.STORAGE, 'CHAT_DB', `deleteSessionState failed: ${err.message}`);
    }
  }

  private mapRow(row: any): ChatHistoryRecord {
    return {
      id: Number(row.id),
      sessionId: String(row.session_id ?? ''),
      ts: Number(row.ts ?? 0),
      role: String(row.role ?? ''),
      content: String(row.content ?? ''),
      model: String(row.model ?? ''),
      lang: String(row.lang ?? ''),
    };
  }

  public close(): void {
    if (this.db) {
      try {
        this.db.close();
      } catch (err: any) {
        logger.warn(LogCategory.STORAGE, 'CHAT_DB', `close failed: ${err.message}`);
      }
      this.ready = false;
    }
  }
}
