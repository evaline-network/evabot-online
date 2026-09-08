/**
 * cloudtts.test.ts — CloudTTS unit tests (no live API calls).
 *
 * Covers:
 *  - Usage counter persistence + monthly rollover
 *  - ONLY-FREE cap enforcement (over-cap refusal, counter not charged)
 *  - Cache hit path (identical text+voice → no fetch, no counter increment)
 *  - Persona/alias voice resolution (eva/adam/lang/explicit)
 *  - Request-body builder correctness (languageCode, name, MP3 encoding)
 *  - Error resilience (fetch failure never throws, resolves ok:false)
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { CloudTTS, buildSynthesizeRequest, voiceFamily, languageCodeOf } from '../src/core/CloudTTS.js';
import { COMMAND_ALIASES } from '../src/models/ModelRatings.js';

export async function runCloudTtsTests(): Promise<boolean> {
  console.log('\n--- Running CloudTTS (Google TTS / ONLY-FREE cap) Tests ---');
  let passed = true;

  function assert(cond: boolean, msg: string) {
    if (cond) {
      console.log(`  ✓ ${msg}`);
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      passed = false;
    }
  }

  function makeTmp(): string {
    return fs.mkdtempSync(path.join(os.tmpdir(), 'evabot-tts-test-'));
  }

  /** Mock fetch returning a fixed audioContent, recording call count + body. */
  function mockFetch(calls: Array<{ url: string; body: string }>, audio = 'U29tZUF1ZGlvQnl0ZXM=') {
    const fn: any = async (url: string, init: any) => {
      calls.push({ url, body: init.body });
      return {
        ok: true,
        status: 200,
        text: async () => '',
        json: async () => ({ audioContent: audio }),
      } as any;
    };
    return fn;
  }

  const fakeCreds = async () => ({ token: 'test-token' });

  // 1. Voice resolution (persona aliases)
  {
    const tts = new CloudTTS({ dataDir: makeTmp(), getCredentials: fakeCreds });
    assert(tts.resolveVoice({ persona: 'eva', lang: 'uk' }) === 'uk-UA-Chirp3-HD-Aoede', 'persona eva + lang uk → uk-UA-Chirp3-HD-Aoede (female, Chirp3-HD 1M chars/mo free)');
    assert(tts.resolveVoice({ persona: 'adam', lang: 'ru' }) === 'ru-RU-Chirp3-HD-Fenrir', 'persona adam + lang ru → ru-RU-Chirp3-HD-Fenrir (male, Chirp3-HD 1M chars/mo free)');
    assert(tts.resolveVoice({ lang: 'ru-RU' }) === 'ru-RU-Chirp3-HD-Aoede', 'lang ru (no persona, default female) → ru-RU-Chirp3-HD-Aoede');
    assert(tts.resolveVoice({ lang: 'uk-UA' }) === 'uk-UA-Chirp3-HD-Aoede', 'lang uk (no persona, default female) → uk-UA-Chirp3-HD-Aoede');
    assert(tts.resolveVoice({ lang: 'en' }) === 'en-US-Chirp3-HD-Aoede', 'lang en (default) → eva voice (en-US-Chirp3-HD-Aoede, FEMALE)');
    assert(tts.resolveVoice({ lang: 'en', persona: 'adam' }) === 'en-US-Chirp3-HD-Fenrir', 'lang en + persona adam → en-US-Chirp3-HD-Fenrir (MALE)');
    assert(tts.resolveVoice({ persona: 'eva', lang: 'ru' }) === 'ru-RU-Chirp3-HD-Aoede', 'persona eva + lang ru → ru-RU-Chirp3-HD-Aoede (FEMALE)');
    assert(tts.resolveVoice({ voiceName: 'uk-UA-Standard-B' }) === 'uk-UA-Standard-B', 'explicit voiceName wins over persona');
    assert(voiceFamily('uk-UA-Wavenet-B') === 'wavenet', 'family detection: Wavenet');
    assert(voiceFamily('ru-RU-Chirp3-HD-Kore') === 'chirp3-hd', 'family detection: Chirp3-HD');
    assert(languageCodeOf('uk-UA-Wavenet-B') === 'uk-UA', 'languageCode extraction from voice name');
  }

  // 2. Request-body builder correctness
  {
    const body = buildSynthesizeRequest('Привіт', 'uk-UA-Wavenet-B');
    assert(JSON.stringify(body.input) === '{"text":"Привіт"}', 'request body: input.text exact');
    assert(body.voice?.name === 'uk-UA-Wavenet-B', 'request body: voice.name');
    assert(body.voice?.languageCode === 'uk-UA', 'request body: voice.languageCode');
    assert(body.audioConfig?.audioEncoding === 'MP3', 'request body: MP3 encoding');
  }

  // 3. Usage counter persistence + successful synthesis
  {
    const dir = makeTmp();
    const calls: Array<{ url: string; body: string }> = [];
    const tts = new CloudTTS({ dataDir: dir, fetchFn: mockFetch(calls), getCredentials: fakeCreds });
    const r1 = await tts.synthesize('Привіт, я Ева', { persona: 'eva', lang: 'uk' });
    assert(r1.ok === true && r1.base64Audio === 'U29tZUF1ZGlvQnl0ZXM=', 'synthesize returns base64 audio on success');
    assert(r1.voice === 'uk-UA-Chirp3-HD-Aoede', 'synthesize uses eva voice');
    assert(r1.charCount === 'Привіт, я Ева'.length, 'charCount matches text length');
    assert(tts.getMonthChars() === 'Привіт, я Ева'.length, 'monthly counter charged after successful synthesis');
    assert(calls.length === 1, 'exactly one API call');
    assert(calls[0].url === 'https://texttospeech.googleapis.com/v1/text:synthesize', 'POST /v1/text:synthesize endpoint');
    const persisted = JSON.parse(fs.readFileSync(path.join(dir, 'tts-usage.json'), 'utf8'));
    assert(persisted.chars === 'Привіт, я Ева'.length && persisted.month === CloudTTS.currentMonth(), 'usage counter persisted at data/tts-usage.json {month, chars}');
  }

  // 4. Cache hit path: identical text+voice → no fetch, no counter change
  {
    const dir = makeTmp();
    const calls: Array<{ url: string; body: string }> = [];
    const tts = new CloudTTS({ dataDir: dir, fetchFn: mockFetch(calls), getCredentials: fakeCreds });
    await tts.synthesize('Кешований текст', { persona: 'eva' });
    const after1 = tts.getMonthChars();
    const r2 = await tts.synthesize('Кешований текст', { persona: 'eva' });
    assert(r2.ok === true && r2.cached === true, 'identical (text+voice) resolves from cache');
    assert(r2.base64Audio === 'U29tZUF1ZGlvQnl0ZXM=', 'cache hit returns audio');
    assert(calls.length === 1, 'cache hit does not call the API');
    assert(tts.getMonthChars() === after1, 'cache hit does not increment usage counter');
    assert(fs.existsSync(path.join(dir, 'tts-cache')), 'tts-cache directory exists');
  }

  // 5. ONLY-FREE cap enforcement (counter persisted over 900k → refuse)
  {
    const dir = makeTmp();
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'tts-usage.json'), JSON.stringify({ month: CloudTTS.currentMonth(), chars: 899_990 }));
    const calls: Array<{ url: string; body: string }> = [];
    const tts = new CloudTTS({ dataDir: dir, fetchFn: mockFetch(calls), getCredentials: fakeCreds });
    const r = await tts.synthesize('Це вже понад безкоштовний ліміт', { persona: 'eva' });
    assert(r.ok === false && r.overCap === true, 'over-cap request refused (never silently spends money)');
    assert(r.payPerCharAfterCap === true, 'over-cap result labeled pay-per-char after cap');
    assert(calls.length === 0, 'no API call when over cap');
    assert(tts.getMonthChars() === 899_990, 'counter unchanged after refusal');
    assert(r.error?.includes('900000'), 'refusal error mentions the cap');
  }

  // 6. Cap edge: text that fits exactly within remaining allowance is allowed
  {
    const dir = makeTmp();
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'tts-usage.json'), JSON.stringify({ month: CloudTTS.currentMonth(), chars: 900_000 - 10 }));
    const tts = new CloudTTS({ dataDir: dir, fetchFn: mockFetch([]), getCredentials: fakeCreds });
    const r = await tts.synthesize('0123456789', { persona: 'adam' });
    assert(r.ok === true, 'text fitting exactly within cap is synthesized');
    assert(tts.getMonthChars() === 900_000, 'counter reaches the cap exactly');
    const r2 = await tts.synthesize('one more', { persona: 'adam' });
    assert(r2.ok === false && r2.overCap === true, 'next request after cap is refused');
  }

  // 7. Monthly rollover
  {
    const dir = makeTmp();
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'tts-usage.json'), JSON.stringify({ month: '2020-01', chars: 500_000 }));
    const tts = new CloudTTS({ dataDir: dir, getCredentials: fakeCreds });
    assert(tts.getMonthChars() === 0, 'usage counter resets on month rollover');
  }

  // 8. Errors never throw into chat flow
  {
    const dir = makeTmp();
    const failing: any = async () => { throw new Error('network down'); };
    const tts = new CloudTTS({ dataDir: dir, fetchFn: failing, getCredentials: fakeCreds });
    const r = await tts.synthesize('текст', { persona: 'eva' });
    assert(r.ok === false && r.error?.includes('network down'), 'fetch failure resolves ok:false, never throws');
    const noCreds = new CloudTTS({ dataDir: dir, fetchFn: mockFetch([]), getCredentials: async () => null });
    const r2 = await noCreds.synthesize('текст', { persona: 'eva' });
    assert(r2.ok === false && r2.error?.includes('credentials'), 'missing credentials resolve ok:false');
  }

  // 9. /say aliases registered in COMMAND_ALIASES
  {
    assert(COMMAND_ALIASES['/скажи'] === '/say', 'COMMAND_ALIASES: /скажи → /say');
    assert(COMMAND_ALIASES['/сказать'] === '/say', 'COMMAND_ALIASES: /сказать → /say');
  }

  // 10. /api/tts/status contract fields
  {
    const tts = new CloudTTS({ dataDir: makeTmp(), getCredentials: fakeCreds });
    assert(typeof tts.getCap() === 'number' && tts.getCap() === 900_000, 'default cap = 900,000 chars/month (Chirp3-HD/Wavenet free-tier safety margin)');
    assert(tts.getEvaVoice() === 'uk-UA-Chirp3-HD-Aoede' && tts.getAdamVoice() === 'ru-RU-Chirp3-HD-Fenrir', 'status exposes eva/adam default Chirp3-HD voices');
  }

  console.log('--- CloudTTS tests done ---');
  return passed;
}
