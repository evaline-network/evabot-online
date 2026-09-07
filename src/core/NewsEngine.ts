/**
 * NewsEngine.ts — Curated news engine for the EvaLine business context.
 *
 * Fetches news via plain https (node fetch, zero npm deps):
 *   (a) Google News RSS: https://news.google.com/rss/search?q=<q>&hl=uk&gl=UA&ceid=UA:uk
 *       — parsed with regex (item/title/link/pubDate), no XML library needed.
 *   (b) Optional newsapi.org "everything" endpoint when NEWS_API_KEY env is set.
 *
 * Every request has an 8s timeout, runs under Promise.allSettled (a failing
 * source never breaks the whole feed) and results are cached in memory for
 * 15 minutes.
 *
 * Competitors: the local knowledge-base (knowledge-base/evaline-com-ua) does
 * NOT contain any explicitly named competitor brands, so the
 * company_visibility tag tracks Evaline brand mentions plus generic
 * competitor/market signals ("килимки EVA", "автоковрики", puzzle mats, etc.).
 */

import { logger } from './Logger.js';
import { withTimeout } from './Resilience.js';

export type NewsTagId =
  | 'war_security'
  | 'region_odessa'
  | 'business_economy'
  | 'market_eva_foam'
  | 'trends_product'
  | 'company_visibility';

export interface NewsCategory {
  id: NewsTagId;
  labels: { en: string; uk: string; ru: string };
  aliases: string[];
  keywords: string[];
  queries: string[];
}

export interface NewsItem {
  title: string;
  url: string;
  source: string;
  date: string;
  category: NewsTagId;
}

/**
 * Curated TAG SET for Evaline (EVA foam manufacturer, factory near Odesa,
 * Odesa oblast, Ukraine). Keywords are given in uk/ru/en for matching against
 * fetched headlines; queries drive the Google News RSS requests.
 */
export const NEWS_TAGS: Record<NewsTagId, NewsCategory> = {
  war_security: {
    id: 'war_security',
    labels: { en: 'War & Security', uk: 'Війна та безпека', ru: 'Война и безопасность' },
    aliases: ['war', 'війна', 'война', 'security', 'безпека', 'безопасность'],
    keywords: [
      'Повітряна тривога', 'повітряна тривога', 'обстріл', 'обстріли', 'обстрел',
      'дрон', 'дрони', 'БПЛА', 'ППО', 'ПОВІТРЯНІ СИЛИ', 'ракета', 'ракети',
      'Одеса', 'Одеська область', 'ОДЕСЬКІЙ', 'Odesa', 'Odessa',
      'Чорне море', 'Чорноморський', 'black sea', 'air defense', 'shahed',
      'термінал', 'порт', 'гуманітарна', 'укрнафта', 'ЗСУ', 'фронт',
    ],
    queries: [
      'Одеса обстріл повітряна тривога',
      'Одеська область БПЛА ППО',
      'Odesa oblast attack drone black sea',
    ],
  },
  region_odessa: {
    id: 'region_odessa',
    labels: { en: 'Odesa Region', uk: 'Одеський регіон', ru: 'Одесский регион' },
    aliases: ['odessa', 'одеса', 'одесса', 'регіон', 'region', 'odecca'],
    keywords: [
      'порт', 'Порту', 'одеський порт', 'ОПЗ', 'Одеський припортовий завод',
      'інфраструктура', 'електроенергія', 'енергетика', 'відключення',
      'мер Одеса', 'Труханов', 'Труханов', 'облрада', 'Одеська ОВА',
      'громада', 'водопостачання', 'Дністер', 'збиття', 'ОДЕСА',
      'Odesa', 'Odessa', 'port', 'infrastructure', 'energy',
    ],
    queries: [
      'Одеса порт інфраструктура енергетика',
      'ОПЗ Одеський припортовий завод',
      'Odesa port infrastructure energy',
    ],
  },
  business_economy: {
    id: 'business_economy',
    labels: { en: 'Business & Economy', uk: 'Бізнес та економіка', ru: 'Бизнес и экономика' },
    aliases: ['economy', 'економіка', 'экономика', 'бізнес', 'бизнес', 'business', 'гривня', 'грн'],
    keywords: [
      'гривня', 'курс', 'НБУ', 'Нацбанк', 'ЕЦБ', 'ФРС', 'інфляція',
      'податки', 'ФОП', 'ЄСВ', 'імпорт', 'експорт', 'логістика',
      'страхування', 'банкрутство', 'МВФ', 'бюджет', 'ДПС', 'митниця',
      'economy', 'hryvnia', 'NBU', 'taxes', 'imports', 'logistics', 'insurance',
    ],
    queries: [
      'гривня курс НБУ',
      'Україна економіка податки ФОП імпорт',
      'Ukraine economy hryvnia NBU',
    ],
  },
  market_eva_foam: {
    id: 'market_eva_foam',
    labels: { en: 'EVA Foam Market', uk: 'Ринок EVA-піни', ru: 'Рынок EVA-пены' },
    aliases: ['eva', 'eva foam', 'піна', 'пена', 'market', 'ринок', 'рынок', 'матеріали', 'материалы'],
    keywords: [
      'EVA foam', 'EVA-піна', 'EVA піна', 'EVA пена', 'EVA-мат', 'EVA mat',
      'eva puzzle', 'пазли EVA', 'килимки EVA', 'автоковрики', 'autocarpets',
      'Foamiran', 'пінополіетилен', 'пенополиэтилен', 'polyethylene',
      'поліетилен', 'сиртові', 'сировина', 'сырье', 'raw materials',
      'хімічна промисловість', 'химическая промышленность', 'chemicals',
      'пластикова галузь', 'пластиковая отрасль', 'plastic industry',
      'виробник EVA', 'производитель EVA', 'foam export', 'коврики EVA',
    ],
    queries: [
      'EVA foam manufacturer',
      'EVA mats puzzle виробництво',
      'пінополіетилен поліетилен ціни',
      'автоковрики EVA виробник',
    ],
  },
  trends_product: {
    id: 'trends_product',
    labels: { en: 'Product & Market Trends', uk: 'Тренди продуктів і ринку', ru: 'Тренды продуктов и рынка' },
    aliases: ['trends', 'тренди', 'тренды', 'products', 'продукти', 'продукты', 'іграшки', 'игрушки'],
    keywords: [
      'безпека дитячих товарів', 'безопасность детских товаров', 'baby products safety',
      'EN71', 'EN 71', 'сертифікація', 'сертификация', 'certification',
      'йога', 'фітнес', 'fitness', 'yoga mat', 'килимок для йоги',
      'дитячий ринок', 'детский рынок', 'kids market', 'іграшковий ринок',
      'правила ЄС', 'правила ЕС', 'EU market rules', 'митні правила',
      'customs', 'митниця', 'CE mark', 'REACH', 'іграшки сертифікація',
    ],
    queries: [
      'EN71 іграшки сертифікація',
      'килимок йога фітнес тренд',
      'EU toy safety certification',
    ],
  },
  company_visibility: {
    id: 'company_visibility',
    labels: { en: 'Evaline & Competitors', uk: 'Evaline і конкуренти', ru: 'Evaline и конкуренты' },
    aliases: ['evaline', 'евалайн', 'company', 'компанія', 'компания', 'бренд'],
    keywords: [
      'Evaline', 'Евалайн', 'evaline.com.ua', 'Eva Line', 'EvaLine',
      'килимки EVA', 'EVA mats', 'EVA коврики', 'EVA коврики',
      'автоковрики', 'пазли EVA', 'EVA puzzle', 'килимок для тварин',
      'матраци EVA', 'матрасы EVA', 'виробник килимків', 'производитель ковриков',
      // Note: knowledge-base/evaline-com-ua contains no named competitor
      // brands; these generic signals surface competitor/market coverage.
      'конкурент', 'конкуренты', 'competitor', 'виробник іграшок', 'toy manufacturer',
    ],
    queries: [
      'Evaline EVA',
      'килимки EVA виробник Україна',
      'EVA mats manufacturer Ukraine',
    ],
  },
};

const RSS_TIMEOUT_MS = 8_000;
const CACHE_TTL_MS = 15 * 60 * 1000;
const MAX_QUERIES_PER_RUN = 5;
const MAX_ITEMS_SHOWN = 15;

interface CacheEntry {
  items: NewsItem[];
  fetchedAt: number;
  partialErrors: string[];
}

let cache: CacheEntry | null = null;

/** Normalizes a title for near-duplicate detection. */
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Token-set Jaccard similarity between two normalized titles. */
function titleSimilarity(a: string, b: string): number {
  const ta = new Set(normalizeTitle(a).split(' ').filter((t) => t.length > 2));
  const tb = new Set(normalizeTitle(b).split(' ').filter((t) => t.length > 2));
  if (ta.size === 0 || tb.size === 0) return 0;
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter++;
  return inter / (ta.size + tb.size - inter);
}

/** Extracts the "source -" prefix Google News prepends to RSS titles. */
function splitGoogleNewsTitle(raw: string): { source: string; title: string } {
  const idx = raw.lastIndexOf(' - ');
  if (idx > 0 && idx > raw.length - 40) {
    return { source: raw.slice(idx + 3).trim(), title: raw.slice(0, idx).trim() };
  }
  return { source: '', title: raw.trim() };
}

/** Parses Google News RSS XML with regex (no XML parser dependency). */
function parseGoogleNewsRss(xml: string, category: NewsTagId): NewsItem[] {
  const items: NewsItem[] = [];
  const itemBlocks = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
  for (const block of itemBlocks.slice(0, 12)) {
    const titleMatch = block.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/);
    const linkMatch = block.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/);
    const dateMatch = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    const sourceMatch = block.match(/<source[^>]*>([\s\S]*?)<\/source>/);
    if (!titleMatch || !linkMatch) continue;
    const { source, title } = splitGoogleNewsTitle(titleMatch[1].trim());
    items.push({
      title,
      url: (linkMatch[1] || '').trim(),
      source: (sourceMatch ? sourceMatch[1].trim() : '') || source || 'news.google.com',
      date: dateMatch ? dateMatch[1].trim() : '',
      category,
    });
  }
  return items;
}

async function fetchGoogleNewsRss(query: string, category: NewsTagId): Promise<NewsItem[]> {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=uk&gl=UA&ceid=UA:uk`;
  const res = await withTimeout(
    fetch(url, { headers: { 'User-Agent': 'EvaBot-NewsEngine/1.0 (+https://evabot.online)' } }),
    RSS_TIMEOUT_MS,
    `google-news-rss:${query}`
  );
  if (!res.ok) throw new Error(`Google News RSS HTTP ${res.status} for "${query}"`);
  const xml = await res.text();
  return parseGoogleNewsRss(xml, category);
}

async function fetchNewsApi(query: string, category: NewsTagId): Promise<NewsItem[]> {
  const key = process.env.NEWS_API_KEY;
  if (!key) return [];
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=uk&sortBy=publishedAt&pageSize=10&apiKey=${key}`;
  const res = await withTimeout(
    fetch(url, { headers: { 'User-Agent': 'EvaBot-NewsEngine/1.0' } }),
    RSS_TIMEOUT_MS,
    `newsapi:${query}`
  );
  if (!res.ok) throw new Error(`newsapi.org HTTP ${res.status} for "${query}"`);
  const json: any = await res.json();
  const articles = json?.articles || [];
  return articles.map((a: any) => ({
    title: String(a.title || '').trim(),
    url: String(a.url || ''),
    source: a.source?.name || 'newsapi.org',
    date: a.publishedAt || '',
    category,
  }));
}

export class NewsEngine {
  /** Resolves a free-text category name/alias to a NewsTagId, if any. */
  public static resolveTag(input: string): NewsTagId | null {
    const q = input.toLowerCase().trim();
    for (const tag of Object.values(NEWS_TAGS)) {
      if (tag.id === q || tag.aliases.includes(q)) return tag.id;
    }
    return null;
  }

  public static getAllTagIds(): NewsTagId[] {
    return Object.keys(NEWS_TAGS) as NewsTagId[];
  }

  /**
   * Multi-source fetch for the requested tags (default: all tags).
   * Runs at most MAX_QUERIES_PER_RUN Google News queries (round-robin over
   * tags) plus an optional newsapi.org call; each request has an 8s timeout
   * and is executed under Promise.allSettled. Results are cached 15 minutes.
   */
  public static async fetchNews(
    tags?: NewsTagId[],
    opts: { forceRefresh?: boolean } = {}
  ): Promise<{ items: NewsItem[]; partialErrors: string[]; cached: boolean }> {
    const now = Date.now();
    if (!opts.forceRefresh && cache && now - cache.fetchedAt < CACHE_TTL_MS) {
      return { items: cache.items, partialErrors: cache.partialErrors, cached: true };
    }

    const wanted = tags && tags.length > 0 ? tags : this.getAllTagIds();
    const tasks: Array<Promise<NewsItem[]>> = [];
    const sources: string[] = [];

    let queryBudget = MAX_QUERIES_PER_RUN;
    for (const tag of wanted) {
      const cat = NEWS_TAGS[tag];
      if (!cat) continue;
      for (const q of cat.queries) {
        if (queryBudget <= 0) break;
        queryBudget--;
        sources.push(`rss:${tag}:${q}`);
        tasks.push(fetchGoogleNewsRss(q, tag));
      }
      tasks.push(fetchNewsApi(cat.queries[0], tag).then((items) => (items.length > 0 ? items : [])));
    }

    const settled = await Promise.allSettled(tasks);
    const all: NewsItem[] = [];
    const partialErrors: string[] = [];

    settled.forEach((r, i) => {
      if (r.status === 'fulfilled') {
        all.push(...r.value);
      } else {
        const msg = `${sources[i] || `task#${i}`}: ${r.reason?.message || String(r.reason)}`;
        partialErrors.push(msg);
        logger.warn('NewsEngine', `Source failed: ${msg}`);
      }
    });

    const items = this.dedupeByTitle(all);
    cache = { items, fetchedAt: now, partialErrors };
    return { items, partialErrors, cached: false };
  }

  /** Dedupes items by title similarity (Jaccard > 0.6 keeps the first). */
  public static dedupeByTitle(items: NewsItem[]): NewsItem[] {
    const kept: NewsItem[] = [];
    for (const item of items) {
      const dup = kept.some((k) => k.category === item.category && titleSimilarity(k.title, item.title) > 0.6);
      if (!dup) kept.push(item);
    }
    return kept;
  }

  /**
   * Formats the news digest: dedupe, group by category, top ~15 items with
   * source + date + link. Locale-aware category headers (en/uk/ru).
   */
  public static formatNews(
    lang: 'en' | 'uk' | 'ru' = 'en',
    items?: NewsItem[],
    partialErrors: string[] = []
  ): string {
    const lines: string[] = [];
    const data = items || (cache ? cache.items : []);
    lines.push('');
    lines.push('═'.repeat(78));
    lines.push(`  NEWS НОВИНИ EVALINE — ${data.length} Material Feed (${new Date().toISOString().replace('T', ' ').substring(0, 16)} UTC)`);
    lines.push('═'.repeat(78));

    if (data.length === 0) {
      lines.push('  Лента пуста. Запустите /news — движок подтянет свежие заголовки.');
      lines.push('═'.repeat(78));
      return lines.join('\n');
    }

    let shown = 0;
    for (const tag of Object.keys(NEWS_TAGS) as NewsTagId[]) {
      const cat = NEWS_TAGS[tag];
      const catItems = data.filter((i) => i.category === tag);
      if (catItems.length === 0) continue;
      lines.push('');
      lines.push(`   ${cat.labels[lang] || cat.labels.en} (${catItems.length}):`);
      for (const item of catItems) {
        if (shown >= MAX_ITEMS_SHOWN) break;
        const date = item.date ? new Date(item.date).toISOString().replace('T', ' ').substring(0, 16) : '—';
        const title = item.title.length > 96 ? item.title.substring(0, 93) + '...' : item.title;
        lines.push(`    • [${date}] ${title}`);
        lines.push(`      ${item.source} | ${item.url}`);
        shown++;
      }
      if (shown >= MAX_ITEMS_SHOWN) break;
    }

    if (partialErrors.length > 0) {
      lines.push('');
      lines.push(`  [WRN] Недоступні джерела (${partialErrors.length}): ${partialErrors[0]}`);
    }
    lines.push('');
    lines.push('  Використання: /news [тег] — war | odessa | economy | eva | trends | evaline');
    lines.push('═'.repeat(78));
    return lines.join('\n');
  }

  /**
   * Synchronous cache-first text used by ModelCommand.execute (which is sync).
   * If the cache is empty it kicks off a fire-and-forget refresh and reports.
   */
  public static getCachedText(lang: 'en' | 'uk' | 'ru' = 'en', tags?: NewsTagId[]): string | null {
    if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
      const items = tags && tags.length > 0 ? cache.items.filter((i) => tags.includes(i.category)) : cache.items;
      return this.formatNews(lang, items, cache.partialErrors);
    }
    // warm up in background; next /news call (or executeAsync) gets real data
    NewsEngine.fetchNews().catch(() => undefined);
    return null;
  }
}
