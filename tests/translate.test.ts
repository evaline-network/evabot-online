/**
 * translate.test.ts — Translator (Google Cloud Translation v3) unit tests.
 * No live network calls: fetch and token resolution are stubbed.
 * Covers: usage cap refusal, alias resolution, arg parsing, request-body
 * builder, batch splitting, usage persistence + month reset, error path.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  Translator,
  buildTranslateBody,
  splitIntoBatches,
  TRANSLATE_MONTHLY_CAP,
  TRANSLATE_FREE_TIER_CHARS,
  TRANSLATE_MAX_FRAGMENTS_PER_REQUEST,
} from '../src/core/Translator.js';
import { ModelCommand, normalizeCommand, COMMAND_ALIASES } from '../src/models/ModelRatings.js';

export async function runTranslateTests(): Promise<boolean> {
  console.log('\n--- Running Translate (Cloud Translation v3) Tests ---');
  let passed = true;

  function assert(cond: boolean, msg: string) {
    if (cond) {
      console.log(`  ✓ ${msg}`);
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      passed = false;
    }
  }

  // 1. Alias resolution: UK/RU aliases map to /translate via normalizeCommand
  {
    assert(normalizeCommand('/переклад uk Привіт світ') === '/translate uk привіт світ', 'alias /переклад → /translate (args preserved)');
    assert(normalizeCommand('/перевод en привет') === '/translate en привет', 'alias /перевод → /translate');
    assert(normalizeCommand('/переклади en текст') === '/translate en текст', 'alias /переклади → /translate');
    assert(normalizeCommand('/перевести en текст') === '/translate en текст', 'alias /перевести → /translate');
    assert(COMMAND_ALIASES['/переклад'] === '/translate' && COMMAND_ALIASES['/перевести'] === '/translate', 'COMMAND_ALIASES table has translate entries');
  }

  // 2. Arg parsing: '/translate uk текст' and error cases (original casing kept)
  {
    const ok = ModelCommand.parseTranslateCommand('/translate uk Привіт світ');
    assert(ok.to === 'uk' && ok.text === 'Привіт світ', 'parseTranslateCommand extracts target + original-case text');
    const en = ModelCommand.parseTranslateCommand('/translate en какой прогноз цен на EVA');
    assert(en.to === 'en' && en.text === 'какой прогноз цен на EVA', 'parseTranslateCommand handles the /translate en example');
    const aliased = ModelCommand.parseTranslateCommand('/переклад en Hello World');
    assert(aliased.to === 'en' && aliased.text === 'Hello World', 'parseTranslateCommand resolves aliases and keeps case');
    assert(!!ModelCommand.parseTranslateCommand('/translate uk').error, 'missing text → usage error');
    assert(!!ModelCommand.parseTranslateCommand('/translate Привіт світ').error, 'missing target lang → usage error');
    assert(ModelCommand.parseTranslateCommand('/news today').error === 'not-a-translate-command', 'non-translate command is rejected by parser');
  }

  // 3. Request-body builder (v3 shape)
  {
    const body = buildTranslateBody(['Привіт', 'Світ'], 'en');
    assert(body.targetLanguageCode === 'en' && Array.isArray(body.contents) && (body.contents as string[]).length === 2, 'body has targetLanguageCode + contents[]');
    assert(body.mimeType === 'text/plain', 'body uses text/plain mimeType');
    const withSrc = buildTranslateBody(['hi'], 'uk', 'en');
    assert(withSrc.sourceLanguageCode === 'en', 'explicit source is included when given');
    assert(!('sourceLanguageCode' in body), 'auto-detect omits sourceLanguageCode');
  }

  // 4. Batch splitting (max 128 fragments/request)
  {
    assert(TRANSLATE_MAX_FRAGMENTS_PER_REQUEST === 128, 'v3 batch limit is 128 fragments');
    const many = Array.from({ length: 257 }, (_, i) => `f${i}`);
    const batches = splitIntoBatches(many);
    assert(batches.length === 3, '257 fragments split into 3 batches');
    assert(batches[0].length === 128 && batches[1].length === 128 && batches[2].length === 1, 'batch sizes are 128/128/1');
    const flat = batches.flat();
    assert(flat.length === 257 && flat[0] === 'f0' && flat[256] === 'f256', 'batches preserve order and content');
  }

  // 5. Usage cap: refusal when the call would cross the 480k soft cap
  {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'translate-test-'));
    const usagePath = path.join(tmpDir, 'translate-usage.json');
    const tr = new Translator({
      usageFilePath: usagePath,
      fetchFn: (async () => { throw new Error('must not be called'); }) as unknown as typeof fetch,
      getCredentials: (async () => ({ token: 'fake', type: 'bearer', source: 'test', account: 'test' })) as any,
    });
    fs.writeFileSync(usagePath, JSON.stringify({ month: tr.getUsage().month, chars: TRANSLATE_MONTHLY_CAP - 5 }), 'utf8');
    const res = await tr.translate('всього п\'ять символів', 'en');
    assert(!res.ok, 'translate() refuses when cap would be crossed');
    assert(res.error!.includes(String(TRANSLATE_MONTHLY_CAP).replace('_', '')) || res.error!.includes('480'), 'refusal message names the cap');
    assert(res.error!.includes('вичерпано') || res.error!.includes('ліміт'), 'refusal message is user-readable (uk)');
    const persisted = JSON.parse(fs.readFileSync(usagePath, 'utf8'));
    assert(persisted.chars === TRANSLATE_MONTHLY_CAP - 5, 'counter unchanged after refusal');
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  // 6. Happy path with mocked fetch: batching, usage persistence, header check
  {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'translate-test-'));
    const usagePath = path.join(tmpDir, 'translate-usage.json');
    const frags = Array.from({ length: 129 }, (_, i) => `frag-${i}`);
    let called = 0;
    const seenBodies: any[] = [];
    let seenHeaders: any = null;
    const fetchStub = (async (url: any, init?: any) => {
      called++;
      seenHeaders = init.headers;
      seenBodies.push(JSON.parse(init.body));
      const contents = JSON.parse(init.body).contents as string[];
      return new Response(
        JSON.stringify({
          translations: contents.map((c: string) => ({ translatedText: `EN:${c}`, detectedLanguageCode: 'uk' })),
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }) as unknown as typeof fetch;

    const tr = new Translator({
      usageFilePath: usagePath,
      fetchFn: fetchStub,
      getCredentials: (async () => ({ token: 'ya29.fake', type: 'bearer', source: 'test', account: 'test' })) as any,
    });
    const res = await tr.translate(frags, 'en', 'uk');
    assert(res.ok && res.translations.length === 129 && res.translations[0] === 'EN:frag-0', 'all fragments translated in order');
    assert(called === 2, '129 fragments → exactly 2 HTTP requests (128 + 1)');
    assert(seenBodies[0].contents.length === 128 && seenBodies[1].contents.length === 1, 'first batch 128, second batch 1');
    assert(seenBodies[0].targetLanguageCode === 'en' && seenBodies[0].sourceLanguageCode === 'uk', 'body carries target + source');
    assert(seenHeaders['Authorization'] === 'Bearer ya29.fake', 'Authorization: Bearer token header');
    assert(seenHeaders['X-Goog-User-Project'] === 'evabot-agent-server', 'REQUIRED X-Goog-User-Project header');
    assert(res.usage.chars === frags.reduce((s, f) => s + f.length, 0), 'usage counter += requested characters');
    const persisted = JSON.parse(fs.readFileSync(usagePath, 'utf8'));
    assert(persisted.chars === res.usage.chars && !!persisted.month, 'usage persisted to translate-usage.json');
    assert(TRANSLATE_FREE_TIER_CHARS === 500_000, 'documented free tier is 500,000 chars/month');
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  // 7. Month roll resets the counter; error path never throws
  {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'translate-test-'));
    const usagePath = path.join(tmpDir, 'translate-usage.json');
    fs.writeFileSync(usagePath, JSON.stringify({ month: '2000-01', chars: 123456 }), 'utf8');
    const tr = new Translator({
      usageFilePath: usagePath,
      fetchFn: (async () => { throw new Error('network down'); }) as unknown as typeof fetch,
      getCredentials: (async () => null) as any,
    });
    assert(tr.getUsage().chars === 0, 'counter resets to 0 when the month key changes');
    const res = await tr.translate('Привіт', 'en');
    assert(!res.ok && !!res.error && res.translations.length === 0, 'credentials=null → ok:false reply, no throw');
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  return passed;
}
