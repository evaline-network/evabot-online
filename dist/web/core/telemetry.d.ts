import type { SiteConfig, MeshHealth } from './config.js';
/**
 * Starts a live UTC clock that updates `clockEl` every second
 * as `YYYY-MM-DD HH:MM:SS`. Returns a stop function.
 */
export declare function startClock(clockEl: HTMLElement, separator?: string): () => void;
/**
 * Cycles through braille spinner frames in `spinEl`.
 * Returns a stop function.
 */
export declare function startSpinner(spinEl: HTMLElement, intervalMs?: number): () => void;
/**
 * Probes every node in `cfg.nodes` with a HEAD request to `/api/health`.
 * Never throws — returns all-unknown on any failure.
 */
export declare function checkMeshHealth(cfg: SiteConfig, apiBase?: string): Promise<MeshHealth>;
/**
 * Fetches the `/api/health` JSON from the backend.
 * Returns null on any error. Never throws.
 */
export declare function fetchHealth(apiBase?: string): Promise<Record<string, unknown> | null>;
/**
 * Formats a duration in seconds as `Xh Ym Zs`.
 */
export declare function formatUptime(seconds: number): string;
