import type { SiteConfig, MeshHealth } from './config.js';

const SPINNER_FRAMES = ['', '', '', '', '', '', '', '', '', ''];

function pad(n: number): string {
  return n < 10 ? '0' + String(n) : String(n);
}

/**
 * Starts a live UTC clock that updates `clockEl` every second
 * as `YYYY-MM-DD HH:MM:SS`. Returns a stop function.
 */
export function startClock(clockEl: HTMLElement, separator: string = ' '): () => void {
  function tick(): void {
    const now = new Date();
    const ts =
      now.getUTCFullYear() + '-' +
      pad(now.getUTCMonth() + 1) + '-' +
      pad(now.getUTCDate()) + ' ' +
      pad(now.getUTCHours()) + separator +
      pad(now.getUTCMinutes()) + separator +
      pad(now.getUTCSeconds());
    clockEl.textContent = ts;
  }
  tick();
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
}

/**
 * Cycles through braille spinner frames in `spinEl`.
 * Returns a stop function.
 */
export function startSpinner(spinEl: HTMLElement, intervalMs: number = 80): () => void {
  let idx = 0;
  const id = setInterval(() => {
    spinEl.textContent = SPINNER_FRAMES[idx % SPINNER_FRAMES.length];
    idx++;
  }, intervalMs);
  return () => clearInterval(id);
}

/**
 * Probes every node in `cfg.nodes` with a HEAD request to `/api/health`.
 * Never throws — returns all-unknown on any failure.
 */
export async function checkMeshHealth(cfg: SiteConfig, apiBase?: string): Promise<MeshHealth> {
  const base = apiBase ?? cfg.apiBase ?? '';
  try {
    const results = await Promise.all(
      cfg.nodes.map(async (node) => {
        const url = node.url.replace(/\/+$/, '') + '/api/health';
        try {
          const t0 = performance.now();
          const res = await fetch(url, {
            method: 'HEAD',
            signal: AbortSignal.timeout(4000),
          });
          if (res.ok) {
            return {
              id: node.id,
              url: node.url,
              status: 'online' as const,
              latencyMs: Math.round(performance.now() - t0),
            };
          }
          return { id: node.id, url: node.url, status: 'offline' as const };
        } catch {
          return { id: node.id, url: node.url, status: 'offline' as const };
        }
      }),
    );
    return { nodes: results, checkedAt: Date.now() };
  } catch {
    return {
      nodes: cfg.nodes.map((n) => ({ id: n.id, url: n.url, status: 'unknown' as const })),
      checkedAt: Date.now(),
    };
  }
}

/**
 * Fetches the `/api/health` JSON from the backend.
 * Returns null on any error. Never throws.
 */
export async function fetchHealth(apiBase?: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch((apiBase ?? '') + '/api/health', {
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Formats a duration in seconds as `Xh Ym Zs`.
 */
export function formatUptime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h + 'h ' + m + 'm ' + sec + 's';
}
