import type { I18n } from './i18n.js';
export interface WorklogEntry {
    timestamp: string;
    host: string;
    actor: string;
    category: string;
    status: string;
    event: string;
}
export declare function escapeHtml(s: string): string;
export declare function fetchWorklog(apiBase?: string): Promise<WorklogEntry[]>;
export declare function renderWorklog(entries: WorklogEntry[], i18n: I18n, limit?: number): string;
export declare function renderWorklogLinks(i18n: I18n): string;
