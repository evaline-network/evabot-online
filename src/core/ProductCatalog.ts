/**
 * ProductCatalog — EvaLine company product database (pure core module).
 *
 * Loads data/products.json (extracted from knowledge-base/evaline-com-ua/site/**)
 * and provides read-only access + localized text-table formatting.
 *
 * Module independence: imports NOTHING from server code — only node built-ins.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export type CatalogLang = 'en' | 'uk' | 'ru';

export interface Product {
  id: string;
  sku?: string | null;
  name: { en: string; uk: string; ru: string };
  category: string;
  sizes: string[];
  thickness?: string;
  colors: string[];
  materials?: string;
  certifications: string[];
  markets: string[];
  notes: string;
}

export interface CatalogData {
  updatedAt: string;
  source: string;
  languages: string[];
  products: Product[];
}

export interface CatalogStats {
  total: number;
  updatedAt: string;
  byCategory: Record<string, number>;
}

const LABELS: Record<CatalogLang, Record<string, string>> = {
  en: {
    title: 'EVALINE PRODUCT CATALOG',
    products: 'Products',
    updated: 'DB updated',
    byCategory: 'By category',
    filter: 'Filter',
    matches: 'matches',
    noMatch: 'No products match the query.',
    usage: 'Usage: /products [category|query]',
    categories: 'Categories',
    details: 'Product details',
    sizes: 'Sizes',
    thickness: 'Thickness',
    colors: 'Colors',
    materials: 'Materials',
    certs: 'Certificates',
    markets: 'Markets',
    notes: 'Notes',
    na: 'N/A',
  },
  uk: {
    title: 'КАТАЛОГ ПРОДУКЦІЇ EVALINE',
    products: 'Товарів',
    updated: 'БД оновлено',
    byCategory: 'За категоріями',
    filter: 'Фільтр',
    matches: 'збігів',
    noMatch: 'За запитом товарів не знайдено.',
    usage: 'Використання: /products [категорія|запит]',
    categories: 'Категорії',
    details: 'Деталі товару',
    sizes: 'Розміри',
    thickness: 'Товщина',
    colors: 'Кольори',
    materials: 'Матеріали',
    certs: 'Сертифікати',
    markets: 'Ринки',
    notes: 'Примітки',
    na: 'N/A',
  },
  ru: {
    title: 'КАТАЛОГ ПРОДУКЦИИ EVALINE',
    products: 'Товаров',
    updated: 'БД обновлена',
    byCategory: 'По категориям',
    filter: 'Фильтр',
    matches: 'совпадений',
    noMatch: 'По запросу товары не найдены.',
    usage: 'Использование: /products [категория|запрос]',
    categories: 'Категории',
    details: 'Детали товара',
    sizes: 'Размеры',
    thickness: 'Толщина',
    colors: 'Цвета',
    materials: 'Материалы',
    certs: 'Сертификаты',
    markets: 'Рынки',
    notes: 'Примечания',
    na: 'N/A',
  },
};

function resolveDataPath(): string {
  // Candidate locations, in priority order (covers src/, dist/ and cwd layouts).
  const here = path.dirname(fileURLToPath(import.meta.url));
  return (
    [
      path.resolve(here, '../../data/products.json'),
      path.resolve(here, '../../../data/products.json'),
      path.resolve(process.cwd(), 'data/products.json'),
    ].find((p) => fs.existsSync(p)) || path.resolve(here, '../../data/products.json')
  );
}

let cache: CatalogData | null = null;

function load(): CatalogData {
  if (cache) return cache;
  try {
    cache = JSON.parse(fs.readFileSync(resolveDataPath(), 'utf8')) as CatalogData;
  } catch (err: any) {
    cache = { updatedAt: 'N/A', source: 'unavailable', languages: [], products: [] };
  }
  return cache!;
}

function normName(p: Product, lang: CatalogLang): string {
  return p.name[lang] || p.name.en;
}

function listOrNa(values: string[] | undefined, na: string): string {
  return values && values.length ? values.join(', ') : na;
}

export class ProductCatalog {
  /** Full product list. */
  public static getProducts(): Product[] {
    return load().products;
  }

  /** Products of one category (case-insensitive, prefix match allowed). */
  public static byCategory(category: string): Product[] {
    const want = (category || '').toLowerCase().trim();
    return load().products.filter(
      (p) => p.category.toLowerCase() === want || p.category.toLowerCase().startsWith(want)
    );
  }

  /** Free-text search over names (en/uk/ru), category, sizes, colors, materials, certificates, markets, notes. */
  public static search(query: string): Product[] {
    const q = (query || '').toLowerCase().trim();
    if (!q) return this.getProducts();
    return load().products.filter((p) => {
      const haystack = [
        p.name.en, p.name.uk, p.name.ru, p.category,
        p.sizes.join(' '), p.thickness || '', p.colors.join(' '),
        p.materials || '', p.certifications.join(' '), p.markets.join(' '), p.notes,
      ].join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }

  /** Count statistics per category. */
  public static stats(): CatalogStats {
    const data = load();
    const byCategory: Record<string, number> = {};
    for (const p of data.products) {
      byCategory[p.category] = (byCategory[p.category] || 0) + 1;
    }
    return { total: data.products.length, updatedAt: data.updatedAt, byCategory };
  }

  /** Sorted list of category slugs. */
  public static getCategories(): string[] {
    return Object.keys(this.stats().byCategory).sort();
  }

  /** Default output: stats + category list (used by /products with no args). */
  public static formatStats(lang: CatalogLang = 'en'): string {
    const s = LABELS[lang] || LABELS.en;
    const st = this.stats();
    const lines: string[] = [];
    lines.push('');
    lines.push('═'.repeat(78));
    lines.push(`  🏭 ${s.title}`);
    lines.push('═'.repeat(78));
    lines.push(`  ${s.products}: ${st.total}   |   ${s.updated}: ${st.updatedAt}`);
    lines.push('─'.repeat(78));
    lines.push(`  ${s.byCategory}:`);
    for (const cat of Object.keys(st.byCategory).sort()) {
      lines.push(`    • ${cat.padEnd(16)} : ${st.byCategory[cat]}`);
    }
    lines.push('─'.repeat(78));
    lines.push(`  ${s.usage}`);
    lines.push(`  ${s.categories}: ${this.getCategories().join(', ')}`);
    lines.push('═'.repeat(78));
    return lines.join('\n');
  }

  /** Filtered output: category name or free-text query (used by /products <arg>). */
  public static formatFiltered(query: string, lang: CatalogLang = 'en'): string {
    const s = LABELS[lang] || LABELS.en;
    const byCat = this.byCategory(query);
    const products = byCat.length > 0 ? byCat : this.search(query);
    const lines: string[] = [];
    lines.push('');
    lines.push('═'.repeat(78));
    lines.push(`  🏭 ${s.title} — ${s.filter}: "${query}" (${products.length} ${s.matches})`);
    lines.push('═'.repeat(78));
    if (products.length === 0) {
      lines.push(`  ${s.noMatch}`);
      lines.push('─'.repeat(78));
      lines.push(`  ${s.usage}`);
      lines.push(`  ${s.categories}: ${this.getCategories().join(', ')}`);
      lines.push('═'.repeat(78));
      return lines.join('\n');
    }
    for (const p of products) {
      this.appendProduct(lines, p, lang, false);
    }
    lines.push('═'.repeat(78));
    return lines.join('\n');
  }

  /** Full localized catalog table. */
  public static formatCatalog(lang: CatalogLang = 'en'): string {
    const s = LABELS[lang] || LABELS.en;
    const products = this.getProducts();
    const lines: string[] = [];
    lines.push('');
    lines.push('═'.repeat(78));
    lines.push(`  🏭 ${s.title} (${products.length} ${s.products.toLowerCase()})`);
    lines.push('═'.repeat(78));
    for (const p of products) {
      this.appendProduct(lines, p, lang, true);
    }
    lines.push('═'.repeat(78));
    return lines.join('\n');
  }

  private static appendProduct(lines: string[], p: Product, lang: CatalogLang, full: boolean): void {
    const s = LABELS[lang] || LABELS.en;
    const na = s.na;
    lines.push(`  ▸ [${p.category}] ${normName(p, lang)}`);
    if (full || p.sizes.length) lines.push(`      ${s.sizes.padEnd(12)}: ${listOrNa(p.sizes, na)}`);
    if (full || p.thickness) lines.push(`      ${s.thickness.padEnd(12)}: ${p.thickness || na}`);
    if (full || p.colors.length) lines.push(`      ${s.colors.padEnd(12)}: ${listOrNa(p.colors, na)}`);
    if (full) {
      lines.push(`      ${s.materials.padEnd(12)}: ${p.materials || na}`);
      lines.push(`      ${s.certs.padEnd(12)}: ${listOrNa(p.certifications, na)}`);
      lines.push(`      ${s.markets.padEnd(12)}: ${listOrNa(p.markets, na)}`);
    }
    lines.push(`      ${s.notes.padEnd(12)}: ${p.notes}`);
    lines.push('');
  }
}
