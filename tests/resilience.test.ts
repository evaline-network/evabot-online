/**
 * resilience.test.ts — CircuitBreaker, withTimeout, ProviderFallbackChain
 * and NewsEngine (tag sets + formatNews grouping) tests.
 */

import { CircuitBreaker, withTimeout, ProviderFallbackChain, getBreaker, BREAKERS, BREAKER_PROVIDER_NAMES } from '../src/core/Resilience.js';
import { NewsEngine, NEWS_TAGS, NewsItem } from '../src/core/NewsEngine.js';
import { ModelCommand, COMMAND_ALIASES, normalizeCommand } from '../src/models/ModelRatings.js';
import { I18nEngine } from '../src/core/I18nEngine.js';

export async function runResilienceTests(): Promise<boolean> {
  console.log('\n--- Running Resilience (Breakers/Timeout) & NewsEngine Tests ---');
  let passed = true;

  // Reset all breakers to a fresh closed state: earlier suites in the same
  // process may have opened omniroute/openrouter breakers via LLM calls.
  for (const p of BREAKER_PROVIDER_NAMES) {
    getBreaker(p).recordSuccess();
  }

  function assert(cond: boolean, msg: string) {
    if (cond) {
      console.log(`  ✓ ${msg}`);
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      passed = false;
    }
  }

  // 1. CircuitBreaker opens after 3 consecutive failures
  {
    const b = new CircuitBreaker('test-open');
    assert(b.getState() === 'closed', 'fresh breaker starts closed');
    b.recordFailure(new Error('e1'));
    b.recordFailure(new Error('e2'));
    assert(b.getState() === 'closed', 'breaker still closed after 2 failures');
    b.recordFailure(new Error('e3'));
    assert(b.getState() === 'open', 'breaker opens after 3 consecutive failures');
    assert(b.canAttempt() === false, 'canAttempt() false while breaker open');
    const snap = b.snapshot();
    assert(snap.lastError === 'e3' && snap.state === 'open', 'snapshot carries last error + open state');
  }

  // 2. Half-open probe after cooldown (real timers, tiny cooldown)
  {
    const b = new CircuitBreaker('test-cooldown');
    b.cooldownMs = 50;
    b.recordFailure(new Error('boom'));
    b.recordFailure(new Error('boom'));
    b.recordFailure(new Error('boom'));
    assert(b.getState() === 'open', 'open before cooldown');
    await sleep(60);
    assert(b.getState() === 'half-open', 'breaker transitions to half-open after cooldown');
    assert(b.canAttempt() === true, 'half-open admits a probe');
    b.recordSuccess();
    assert(b.getState() === 'closed', 'successful probe closes the breaker');
  }

  // 3. withTimeout rejects on a hanging promise and resolves on fast promise
  {
    const slow = new Promise<string>((resolve) => setTimeout(() => resolve('late'), 500));
    const t0 = Date.now();
    let rejected = false;
    let msg = '';
    try {
      await withTimeout(slow, 50, 'slow-op');
    } catch (err: any) {
      rejected = true;
      msg = err.message;
    }
    assert(rejected, 'withTimeout rejects a hanging promise');
    assert(msg.includes('[TIMEOUT]') && msg.includes('slow-op'), `timeout error is labeled (${msg})`);
    assert(Date.now() - t0 < 400, 'withTimeout rejects at the deadline, not the promise duration');

    const fast = withTimeout(Promise.resolve('ok'), 1000, 'fast-op');
    assert((await fast) === 'ok', 'withTimeout passes through fast resolutions');
  }

  // 4. Fallback chain skips candidates behind an open breaker
  {
    // Open the 'google' breaker via a dedicated breaker in the registry map
    const googleBreaker = getBreaker('google');
    googleBreaker.recordFailure(new Error('f1'));
    googleBreaker.recordFailure(new Error('f2'));
    googleBreaker.recordFailure(new Error('f3'));
    assert(googleBreaker.getState() === 'open', 'google breaker opened for chain test');

    const chain = new ProviderFallbackChain();
    const candidates = [
      'gemini-3.8-flash',              // → google (open — must be skipped)
      'omniroute/gemini-3.8-flash',    // → omniroute (closed — must survive)
      'qwen/qwen-2.5-coder-32b-instruct:free', // → openrouter (closed — must survive)
    ];
    const healthy = chain.filterHealthy(candidates);
    assert(!healthy.includes('gemini-3.8-flash'), 'open-breaker candidate skipped');
    assert(healthy.includes('omniroute/gemini-3.8-flash'), 'omniroute candidate kept');
    assert(healthy.includes('qwen/qwen-2.5-coder-32b-instruct:free'), 'openrouter candidate kept');
    assert(chain.getEvents().some((e) => e.outcome === 'skipped-open-breaker'), 'skip event recorded');

    // restore google to closed so later suites are unaffected
    googleBreaker.recordSuccess();
  }

  // 5. Static BREAKERS registry covers the provider fleet
  {
    for (const p of ['google', 'omniroute', 'openrouter', 'hf', 'zai', 'groq', 'cerebras', 'cloudflare', 'mistral']) {
      assert(BREAKERS[p] instanceof CircuitBreaker, `BREAKERS registry contains "${p}"`);
    }
  }

  // 6. Health report renders a text table
  {
    const report = ProviderFallbackChain.getHealthReport();
    assert(report.includes('google') && report.includes('omniroute'), 'health report lists providers');
    assert(report.includes('ПОСЛЕДНИЕ 5 ОШИБОК'), 'health report has last-5-errors section');
  }

  // 7. NewsEngine tag sets contain required keywords
  {
    const allKeywords = Object.values(NEWS_TAGS).flatMap((c) => c.keywords.map((k) => k.toLowerCase()));
    const allQueries = Object.values(NEWS_TAGS).flatMap((c) => c.queries.map((k) => k.toLowerCase()));
    const has = (needle: string, pool: string[]) => pool.some((k) => k.includes(needle));
    assert(has('одеса', allKeywords) || has('odessa', allKeywords), 'war/regional keywords include Odesa (uk/en)');
    assert(has('eva', allKeywords) && (has('foam', allKeywords) || has('піна', allKeywords) || has('пена', allKeywords)), 'eva-foam keywords present');
    assert(has('повітряна тривога', allKeywords), 'war_security keywords include "Повітряна тривога"');
    assert(has('бпла', allKeywords), 'war_security keywords include БПЛА');
    assert(has('гривня', allKeywords) || has('нбу', allKeywords), 'business_economy keywords include hryvnia/NBU');
    assert(has('en71', allKeywords) || has('en 71', allKeywords), 'trends_product keywords include EN71');
    assert(has('evaline', allKeywords), 'company_visibility keywords include Evaline');
    assert(allQueries.length >= 6, `each category has Google News queries (${allQueries.length} total)`);
    assert(has('black sea', allKeywords) || has('чорне море', allKeywords), 'black sea keyword present');
    for (const tag of Object.values(NEWS_TAGS)) {
      assert(tag.aliases.length > 0 && tag.labels.uk && tag.labels.ru && tag.labels.en, `tag ${tag.id} has aliases + 3 labels`);
    }
  }

  // 8. Tag alias resolution
  {
    assert(NewsEngine.resolveTag('war') === 'war_security', "alias 'war' → war_security");
    assert(NewsEngine.resolveTag('одеса') === 'region_odessa', "alias 'одеса' → region_odessa");
    assert(NewsEngine.resolveTag('eva') === 'market_eva_foam', "alias 'eva' → market_eva_foam");
    assert(NewsEngine.resolveTag('evaline') === 'company_visibility', "alias 'evaline' → company_visibility");
    assert(NewsEngine.resolveTag('nonexistent-tag') === null, 'unknown tag resolves to null');
  }

  // 9. formatNews groups items by category and renders top items
  {
    const mk = (title: string, url: string, category: NewsItem['category']): NewsItem => ({
      title, url, source: 'TestSource', date: new Date('2026-09-01T10:00:00Z').toISOString(), category,
    });
    const items: NewsItem[] = [
      mk('Odesa port struck by drones', 'https://example.com/1', 'war_security'),
      mk('Hryvnia strengthens against USD', 'https://example.com/2', 'business_economy'),
      mk('New EVA foam plant opens', 'https://example.com/3', 'market_eva_foam'),
      mk('Odesa port struck by drones!', 'https://example.com/4', 'war_security'), // near-dup
    ];
    const deduped = NewsEngine.dedupeByTitle(items);
    assert(deduped.length === 3, `dedupeByTitle removes near-duplicates (${deduped.length} kept)`);

    const text = NewsEngine.formatNews('uk', deduped);
    assert(text.includes('НОВИНИ EVALINE'), 'formatNews header present');
    assert(text.includes('Війна та безпека'), 'formatNews groups war_security with UK label');
    assert(text.includes('Ринок EVA-пени'.replace('пени', 'піни')) || text.includes('Ринок EVA-піни'), 'formatNews groups market_eva_foam');
    assert(text.includes('Бізнес та економіка'), 'formatNews groups business_economy');
    assert(text.includes('Odesa port struck by drones'), 'formatNews renders item title');
    assert(text.includes('https://example.com/1'), 'formatNews renders item link');
    assert(text.includes('TestSource'), 'formatNews renders item source');

    const ruText = NewsEngine.formatNews('ru', deduped);
    assert(ruText.includes('Война и безопасность'), 'formatNews supports ru labels');
  }

  // 10. /news and /health registered in the command registry (sync paths)
  {
    assert(normalizeCommand('/новини') === '/news', 'UK /новини → /news');
    assert(normalizeCommand('/новости') === '/news', 'RU /новости → /news');
    assert(normalizeCommand('/новини odessa') === '/news odessa', 'news args preserved');
    assert(normalizeCommand('/здоров\'я') === '/health', "UK /здоров'я → /health");
    assert(normalizeCommand('/здоровье') === '/health', 'RU /здоровье → /health');
    assert(normalizeCommand('/статус-моделей') === '/health', '/статус-моделей → /health');
    assert(COMMAND_ALIASES['/новини'] === '/news' && COMMAND_ALIASES['/новости'] === '/news', 'COMMAND_ALIASES contains /news aliases');

    const healthOut = ModelCommand.execute('/health');
    assert(typeof healthOut === 'string' && healthOut.includes('HEALTH'), '/health executes via registry');
    const healthUk = ModelCommand.execute('/статус-моделей');
    assert(healthUk.includes('HEALTH'), '/статус-моделей executes /health');

    const newsSync = ModelCommand.execute('/news');
    assert(typeof newsSync === 'string' && newsSync.length > 0, '/news sync path returns text (cache or warm-up notice)');

    // help entries registered in all 3 locales
    for (const locale of ['en', 'uk', 'ru'] as const) {
      const help = I18nEngine.formatHelp(locale);
      assert(help.includes('/news'), `help (${locale}) lists /news`);
      assert(help.includes('/health'), `help (${locale}) lists /health`);
    }
  }

  // 11. executeAsync /news path (network may be sandboxed — must not throw)
  {
    try {
      const out = await ModelCommand.executeAsync('/news');
      assert(typeof out === 'string' && out.length > 0, 'executeAsync(/news) returns formatted digest or error text');
    } catch (err: any) {
      assert(false, `executeAsync(/news) threw unexpectedly: ${err.message}`);
    }
  }

  return passed;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
