import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ProductCatalog, Product } from '../src/core/ProductCatalog.js';
import { CompanyKnowledge } from '../src/core/CompanyKnowledge.js';
import { ModelCommand, normalizeCommand, COMMAND_ALIASES } from '../src/models/ModelRatings.js';
import { CORPORATE_ROLES } from '../src/core/CorporateRoles.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.resolve(here, '../data/products.json');

export function runProductsTests(): boolean {
  console.log('\n--- Running ProductCatalog, CompanyKnowledge & /products // /who Tests ---');
  let passed = true;

  function assert(cond: boolean, msg: string) {
    if (cond) {
      console.log(`  ✓ ${msg}`);
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      passed = false;
    }
  }

  // 1. Product DB file exists and is valid JSON with products array
  assert(fs.existsSync(dataPath), `data/products.json exists at ${dataPath}`);
  const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  assert(Array.isArray(raw.products) && raw.products.length > 0, 'products.json has a non-empty products array');
  assert(typeof raw.updatedAt === 'string', 'products.json has updatedAt');

  // 2. Catalog loads
  const products: Product[] = ProductCatalog.getProducts();
  assert(products.length === raw.products.length, `ProductCatalog.getProducts() count (${products.length}) matches JSON (${raw.products.length})`);
  assert(products.every((p) => p.id && p.name?.en && p.name?.uk && p.name?.ru && p.category), 'every product has id, en/uk/ru names and category');

  // 3. Stats counts match JSON
  const st = ProductCatalog.stats();
  assert(st.total === raw.products.length, 'stats().total matches products count');
  const sumByCat = Object.values(st.byCategory).reduce((a, b) => a + b, 0);
  assert(sumByCat === raw.products.length, 'sum of per-category counts equals total product count');
  assert(Object.keys(st.byCategory).length > 0, 'stats has at least one category');

  // 4. byCategory works
  const kids = ProductCatalog.byCategory('kids');
  assert(kids.length === (st.byCategory['kids'] || 0), `byCategory('kids') matches stats (${kids.length})`);
  assert(ProductCatalog.byCategory('KIDS ').length === kids.length, 'byCategory is case/trim-insensitive');

  // 5. Search works (EN + UK + RU + attribute)
  assert(ProductCatalog.search('tatami').some((p) => p.id.includes('tatami')), "search('tatami') finds tatami product");
  assert(ProductCatalog.search('бурьонка').length > 0, "search('бурьонка') finds livestock mats (UK)");
  assert(ProductCatalog.search('бурёнка').length > 0, "search('бурёнка') finds livestock mats (RU)");
  assert(ProductCatalog.search('EN 71 nonexist').length === 0, 'search of a non-existing string returns empty');
  assert(ProductCatalog.search('2000x1250').some((p) => p.id === 'car-mat-sheets'), "search('2000x1250') finds car mat sheets by size");

  // 6. New command aliases resolve
  const aliasCases: Array<[string, string]> = [
    ['/продукти', '/products'],
    ['/продукты', '/products'],
    ['/товари', '/products'],
    ['/товары', '/products'],
    ['/catalog', '/products'],
    ['/каталог', '/products'],
    ['/хто', '/who'],
    ['/кто', '/who'],
    ['/роли', '/who'],
    ['/ролі', '/who'],
  ];
  for (const [alias, canonical] of aliasCases) {
    assert(COMMAND_ALIASES[alias] === canonical, `${alias} → ${canonical}`);
    assert(normalizeCommand(alias).startsWith(canonical), `normalizeCommand(${alias}) → ${canonical}`);
  }

  // 7. /products default output: stats + category list
  const def = ModelCommand.execute('/products');
  assert(def.includes('PRODUCT CATALOG'), '/products output contains catalog title');
  for (const cat of ProductCatalog.getCategories()) {
    assert(def.includes(cat), `/products default output lists category "${cat}"`);
  }
  assert(def.includes(`: ${raw.products.length}`), '/products stats shows total product count');

  // 8. /products filtered by category and by query
  const byCatOut = ModelCommand.execute('/products livestock');
  assert(byCatOut.includes('Burenka'), "/products livestock lists 'Burenka' mats");
  const byQueryOut = ModelCommand.execute('/products puzzle');
  assert(byQueryOut.length > 0 && !byQueryOut.includes('[ERROR]'), "/products puzzle returns filtered results");
  const none = ModelCommand.execute('/products zzz-nonexistent');
  assert(none.includes('No products match') || none.includes('не знайдено'), "/products <unknown> shows no-match message");

  // 9. /who matrix + role detail
  const whoAll = ModelCommand.execute('/who');
  assert(whoAll.includes('KNOWLEDGE MATRIX'), '/who contains knowledge matrix title');
  for (const roleId of Object.keys(CompanyKnowledge.getMatrix())) {
    assert(Object.prototype.hasOwnProperty.call(CORPORATE_ROLES, roleId), `matrix roleId "${roleId}" exists in CORPORATE_ROLES`);
    assert(whoAll.includes(roleId), `/who matrix lists role "${roleId}"`);
  }
  const whoCfo = ModelCommand.execute('/who cfo');
  assert(whoCfo.includes('CFO') && whoCfo.includes('budget planning'), '/who cfo shows CFO domains');
  const whoAlias = ModelCommand.execute('/кто cto');
  assert(whoAlias.includes('CTO'), '/кто cto resolves alias and shows CTO');
  const whoUnknown = ModelCommand.execute('/who nobody-here');
  assert(whoUnknown.includes('Unknown role') || whoUnknown.includes('Невідома') || whoUnknown.includes('Неизвестная'), '/who <unknown> shows unknown-role message');

  // 10. /company enrichment contains knowledge matrix + product stats
  const company = ModelCommand.execute('/company');
  assert(company.includes('KNOWLEDGE MATRIX'), '/company output enriched with knowledge matrix');
  assert(company.includes('data/products.json'), '/company output references product DB source');
  assert(company.includes(`products`), '/company output shows product stats');

  // 11. Localized help includes new commands (en/uk/ru)
  const helpEn = ModelCommand.execute('/help');
  assert(helpEn.includes('/products') && helpEn.includes('/who'), 'EN help lists /products and /who');

  console.log('  (ProductsTests finished)');
  return passed;
}
