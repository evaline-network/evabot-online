/**
 * sync-openrouter-registry.ts — TASK-323 auto-sync probe
 *
 * Fetches the live OpenRouter model catalog, filters the 100% free models
 * (pricing.prompt == 0 AND pricing.completion == 0), compares them against
 * the live-verified section 9b ids in src/models/ModelRegistry.ts and emits:
 *   1. A human-readable drift report to stdout (added / removed / unchanged).
 *   2. A machine-readable snapshot at data/model-monitor/openrouter-free-snapshot.json
 *
 * Standalone by design: the registry file is PARSED BY REGEX, never imported.
 * Exit code is ALWAYS 0 — this is an observability tool, not a gate.
 * No secrets are ever printed (the API key is only used in the Authorization header).
 *
 * Run: npx tsx scripts/sync-openrouter-registry.ts
 * Auth: optional env OPENROUTER_API_KEY (works unauthenticated for the models list)
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const REPO_ROOT = resolve(import.meta.dirname, '..');
const REGISTRY_PATH = resolve(REPO_ROOT, 'src/models/ModelRegistry.ts');
const SNAPSHOT_PATH = resolve(REPO_ROOT, 'data/model-monitor/openrouter-free-snapshot.json');
const OPENROUTER_MODELS_URL = 'https://openrouter.ai/api/v1/models';
const TOP_N_FREE = 15;

interface OpenRouterPricing {
  prompt?: string | number;
  completion?: string | number;
}

interface OpenRouterModel {
  id: string;
  name?: string;
  created?: number;
  context_length?: number;
  pricing?: OpenRouterPricing;
}

interface SnapshotModel {
  id: string;
  name: string;
  created: string;
  context_length: number | null;
}

interface Drift {
  added: string[];
  removed: string[];
  unchanged: string[];
}

function log(msg: string): void {
  process.stdout.write(`[registry-sync ${new Date().toISOString()}] ${msg}\n`);
}

function isZeroPrice(v: string | number | undefined): boolean {
  if (v === undefined || v === null) return false;
  const n = typeof v === 'number' ? v : parseFloat(v);
  return Number.isFinite(n) && n === 0;
}

async function fetchOpenRouterModels(): Promise<OpenRouterModel[]> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (process.env.OPENROUTER_API_KEY) {
    headers.Authorization = `Bearer ${process.env.OPENROUTER_API_KEY}`;
    log('Using OPENROUTER_API_KEY from environment (value not logged).');
  } else {
    log('OPENROUTER_API_KEY not set — using unauthenticated models list.');
  }

  const res = await fetch(OPENROUTER_MODELS_URL, { headers });
  if (!res.ok) throw new Error(`OpenRouter API HTTP ${res.status}`);
  const json = (await res.json()) as { data?: OpenRouterModel[] };
  if (!Array.isArray(json.data)) throw new Error('OpenRouter API returned unexpected payload (no data array)');
  return json.data;
}

/**
 * Extract model ids from section "9b" of ModelRegistry.ts by regex.
 * Section 9b starts at the "9b. OPENROUTER FREE" comment and ends at the next
 * "N." top-level section comment. The local meta-router id 'openrouter/free'
 * is excluded — it is a registry construct, not an OpenRouter catalog model.
 */
function parseRegistrySection9bIds(source: string): string[] {
  const sectionStart = source.indexOf('9b. OPENROUTER FREE');
  if (sectionStart === -1) throw new Error('Section 9b marker not found in ModelRegistry.ts');
  const nextSection = /(?:^|\n)\s*\/\/\s*1[0-9]*[a-z]?\./.exec(source.slice(sectionStart + 20));
  const sectionEnd = nextSection ? sectionStart + 20 + nextSection.index : source.length;
  const section = source.slice(sectionStart, sectionEnd);

  const ids: string[] = [];
  for (const m of section.matchAll(/id:\s*'([^']+)'/g)) {
    if (m[1] !== 'openrouter/free') ids.push(m[1]);
  }
  return ids;
}

function computeDrift(remoteFree: string[], registryIds: string[]): Drift {
  const remoteSet = new Set(remoteFree);
  const registrySet = new Set(registryIds);
  return {
    added: remoteFree.filter((id) => !registrySet.has(id)),
    removed: registryIds.filter((id) => !remoteSet.has(id)),
    unchanged: remoteFree.filter((id) => registrySet.has(id)),
  };
}

function formatList(ids: string[]): string {
  return ids.length === 0 ? '  (none)' : ids.map((id) => `  - ${id}`).join('\n');
}

async function main(): Promise<void> {
  log('=== OpenRouter Free-Model Registry Sync (TASK-323) ===');
  try {
    const all = await fetchOpenRouterModels();
    log(`Fetched ${all.length} models from OpenRouter catalog.`);

    const free = all.filter(
      (m) => isZeroPrice(m.pricing?.prompt) && isZeroPrice(m.pricing?.completion),
    );
    log(`100% free models (prompt=0 AND completion=0): ${free.length}`);

    free.sort((a, b) => (b.created ?? 0) - (a.created ?? 0));
    const topFree = free.slice(0, TOP_N_FREE);
    const topFreeIds = topFree.map((m) => m.id);
    log(`Top ${Math.min(TOP_N_FREE, topFree.length)} by created (desc) selected for comparison.`);

    const source = readFileSync(REGISTRY_PATH, 'utf8');
    const registryIds = parseRegistrySection9bIds(source);
    log(`Registry section 9b contains ${registryIds.length} live-verified free ids (meta-router 'openrouter/free' excluded).`);

    const drift = computeDrift(topFreeIds, registryIds);

    log('');
    log('--- DRIFT REPORT ---------------------------------------------');
    log(`ADDED to OpenRouter free top-15 (not yet in registry 9b): ${drift.added.length}`);
    log(formatList(drift.added));
    log(`REMOVED from OpenRouter free top-15 (still in registry 9b): ${drift.removed.length}`);
    log(formatList(drift.removed));
    log(`UNCHANGED (present in both): ${drift.unchanged.length}`);
    log(formatList(drift.unchanged));
    log('--------------------------------------------------------------');

    const snapshot = {
      generatedAt: new Date().toISOString(),
      source: OPENROUTER_MODELS_URL,
      authenticated: Boolean(process.env.OPENROUTER_API_KEY),
      totalModels: all.length,
      totalFreeModels: free.length,
      topN: TOP_N_FREE,
      registrySection: '9b (live-verified 2026-09-08)',
      drift,
      topFreeModels: topFree.map<SnapshotModel>((m) => ({
        id: m.id,
        name: m.name ?? m.id,
        created: m.created ? new Date(m.created * 1000).toISOString() : '',
        context_length: m.context_length ?? null,
      })),
    };

    mkdirSync(dirname(SNAPSHOT_PATH), { recursive: true });
    writeFileSync(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2) + '\n');
    log(`Snapshot written: ${SNAPSHOT_PATH}`);

    if (drift.added.length > 0 || drift.removed.length > 0) {
      log('ACTION REQUIRED: registry 9b is out of sync with OpenRouter free top-15.');
      log('Route: human review first (update src/models/ModelRegistry.ts section 9b);');
      log('AlertManager wiring planned as follow-up (see docs/ops/MODEL_REGISTRY_SYNC.md).');
    } else {
      log('OK: registry 9b is in sync with the OpenRouter free top-15.');
    }
  } catch (err) {
    log(`ERROR during sync probe: ${err instanceof Error ? err.message : String(err)}`);
    log('Non-fatal by design — exiting 0 so the timer does not page on transient API failures.');
  } finally {
    log('=== Sync probe finished ===');
    process.exit(0);
  }
}

void main();
