import os from 'node:os';
import { Config } from './Config.js';
import { BREAKER_PROVIDER_NAMES, getBreaker, providerOfModel } from './Resilience.js';
import { ProductCatalog } from './ProductCatalog.js';
import { knowledgeBase } from './KnowledgeBase.js';

export interface LastUsedModelInfo {
  model: string;
  provider: string;
  ts: number;
}

/**
 * Module-level "last model actually used by a chat request" registry.
 * ChatRouter / ChatEngine update it on every request so SystemContext can
 * answer "какая сейчас подключена модель?" with the REAL model, not a guess.
 */
let lastUsedModel: LastUsedModelInfo | null = null;

export function recordLastUsedModel(model: string, provider: string): void {
  const changed = !lastUsedModel || lastUsedModel.model !== model || lastUsedModel.provider !== provider;
  lastUsedModel = { model, provider, ts: Date.now() };
  // A different model just served a request → the 60s-cached block is stale.
  if (changed) SystemContext.invalidate();
}

export function getLastUsedModel(): LastUsedModelInfo | null {
  return lastUsedModel;
}

/**
 * SystemContext — compact self-awareness block (1200 chars) describing the
 * CURRENT EvaBot runtime: active/default model, proxy endpoint, breaker
 * health (state reads only, no network), cluster topology, key services,
 * company identity and catalog/KB stats. Cached for 60s.
 */
export class SystemContext {
  public static readonly CACHE_TTL_MS = 60_000;
  public static readonly MAX_CHARS = 1200;

  private static cache: { text: string; ts: number } | null = null;

  /** Drops the cached block (used by tests and by recordLastUsedModel consumers). */
  public static invalidate(): void {
    this.cache = null;
  }

  /**
   * Full developer-mode prompt addendum (FEATURE 2). Injected by ChatRouter /
   * ChatEngine only when the session is unlocked via /developer unlock.
   */
  public static readonly DEVELOPER_BLOCK: string =
    'Ти в режимі розробника. Відповідай максимально повно і технічно: повні шляхи файлів, команди, конфіги, моделі, витрати, ключі (крім самих секретів — показуй тільки префікси), архітектура, код. Не приховуй внутрішню інформацію системи EvaBot/EvaLine.';

  public static build(): string {
    if (this.cache && Date.now() - this.cache.ts < this.CACHE_TTL_MS) {
      return this.cache.text;
    }
    const text = this.render();
    this.cache = { text, ts: Date.now() };
    return text;
  }

  private static render(): string {
    const defaultModel = Config.defaultModel;
    const last = getLastUsedModel();
    const lastLine = last
      ? `Остання використана модель: ${last.model} (provider: ${last.provider})`
      : 'Остання використана модель: ще не використовувалась у цій сесії процесу';

    // Breaker health: state snapshot only (no network calls).
    let closed = 0;
    let halfOpen = 0;
    let open = 0;
    try {
      for (const name of BREAKER_PROVIDER_NAMES) {
        const st = getBreaker(name).snapshot().state;
        if (st === 'open') open += 1;
        else if (st === 'half-open') halfOpen += 1;
        else closed += 1;
      }
    } catch {
      /* breaker stats are best-effort */
    }
    const breakerLine = `Breakers: ${closed} closed / ${halfOpen} half-open / ${open} open (з ${BREAKER_PROVIDER_NAMES.length})`;

    // Product + KB stats (local reads only).
    let productCount = 0;
    try {
      productCount = ProductCatalog.stats().total;
    } catch {
      /* catalog is best-effort */
    }
    let kbLine = 'База знань: недоступна';
    try {
      const kbStats = knowledgeBase.getStats();
      kbLine = `База знань: ${kbStats.documentCount} документів (${kbStats.name})`;
    } catch {
      /* KB is best-effort */
    }

    const lines: string[] = [
      `[SYSTEM CONTEXT — власне середовище бота EvaBot, оновлено ${new Date().toISOString().substring(0, 16)}]`,
      `Модель за замовчуванням: ${defaultModel} (provider: ${providerOfModel(defaultModel)})`,
      lastLine,
      `OmniRoute edge-proxy: ${Config.omnirouteBaseUrl} (роутер моделей, health не перевіряється тут)`,
      breakerLine,
      'Кластер: [1] evabot-agent-vm — europe-west3-a (Франкфурт), c3-standard-8 (ЦЕЙ сервер, brain/бекенд) · [2] evaline-micro-vm — us-central1-a (frontend edge/face), публічний IP 136.114.26.252',
      'Сервіси: evabot-brain :3000 (Node/TS) · evabot-face :8093 (3D-лицо) · omniroute :20128 (LiteLLM-роутер) · voice (python + TTS/STT) · watchdogs/monitors',
      'Домени/сайти компанії: evabot.online · evaline.online · evaline.network · evaline.com.ua · business.evaline.online (бізнес-портал через GCP HTTPS-LB 34.49.122.75) · Cloud Run B2B API (business-tier-api)',
      'Компанія: ТОВ ЕВА-ЛАЙН, ЄДРПОУ 40484497, м. Чорноморськ Одеська обл. — виробник піни EVA (EVA-піна), 2 учасники, каптал 16 000 000 ₴',
      `Продукти: ${productCount} у data/products.json`,
      kbLine,
    ];
    let text = lines.join('\n');
    if (text.length > this.MAX_CHARS) text = `${text.substring(0, this.MAX_CHARS - 1)}…`;
    return text;
  }

  /** Used by the CLI dashboard/tests to confirm this VM identity. */
  public static isBrainVm(): boolean {
    return os.hostname().length > 0 && Config.serverPort > 0;
  }
}
