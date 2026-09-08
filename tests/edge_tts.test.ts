/**
 * edge_tts.test.ts — EdgeTTS (Microsoft Edge-TTS / Azure Neural) tests.
 *
 * Hermetic tests (no subprocess, no network):
 *  - Catalog entries in VOICE_CATALOG (4 edge-neural voices, genders, family)
 *  - familyRank order: edge-neural BEFORE chirp3-hd
 *  - familyFreeAllowance('edge-neural') = unlimited-ish
 *  - validateVoiceName accepts edge voices (ONLY-FREE /voices set path)
 *  - Cache-key function (deterministic, voice+text sensitive)
 *  - Persona/lang/voiceName resolution + voice-prefs.json override
 *  - Failure policy: empty text throws, broken python throws
 *
 * Real-synthesis test: runs ONLY when `python3 -m edge_tts --help` works on
 * this host; otherwise it is SKIPPED (logs "skipped: edge-tts unavailable").
 *
 * NOTE: deliberately NOT registered in tests/index.ts (owner registers it).
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import {
  EdgeTTS,
  edgeCacheKey,
  isEdgeVoice,
  EDGE_VOICE_CATALOG,
  EDGE_TTS_DEFAULT_EVA_VOICE,
  EDGE_TTS_DEFAULT_ADAM_VOICE,
} from '../src/core/EdgeTTS.js';
import { VOICE_CATALOG, familyRank, familyFreeAllowance, validateVoiceName } from '../src/core/CloudTTS.js';

export async function runEdgeTtsTests(): Promise<boolean> {
  console.log('\n--- Running EdgeTTS (Microsoft Edge-TTS / ONLY-FREE primary) Tests ---');
  let passed = true;

  function assert(cond: boolean, msg: string) {
    if (cond) {
      console.log(`  OK ${msg}`);
    } else {
      console.error(`  FAIL: ${msg}`);
      passed = false;
    }
  }

  function makeTmp(): string {
    return fs.mkdtempSync(path.join(os.tmpdir(), 'evabot-edge-tts-test-'));
  }

  function edgeAvailable(): Promise<boolean> {
    return new Promise((resolve) => {
      execFile('python3', ['-m', 'edge_tts', '--help'], { timeout: 15_000 }, (err) => resolve(!err));
    });
  }

  // 1. Catalog entries (VOICE_CATALOG includes the 4 edge-neural voices)
  {
    for (const v of EDGE_VOICE_CATALOG) {
      const entry = VOICE_CATALOG.find((c) => c.name === v.name);
      assert(!!entry && entry.family === 'edge-neural' && entry.free === true, `VOICE_CATALOG contains ${v.name} (edge-neural, FREE)`);
    }
    const genders: Record<string, string> = Object.fromEntries(EDGE_VOICE_CATALOG.map((v) => [v.name, v.gender]));
    assert(genders['uk-UA-PolinaNeural'] === 'FEMALE', 'uk-UA-PolinaNeural is FEMALE');
    assert(genders['uk-UA-OstapNeural'] === 'MALE', 'uk-UA-OstapNeural is MALE');
    assert(genders['ru-RU-DmitryNeural'] === 'MALE', 'ru-RU-DmitryNeural is MALE');
    assert(genders['ru-RU-SvetlanaNeural'] === 'FEMALE', 'ru-RU-SvetlanaNeural is FEMALE');
    assert(EDGE_VOICE_CATALOG.length === 4, 'exactly 4 edge-neural catalog entries');
  }

  // 2. Rank order: edge-neural BEFORE chirp3-hd (and the rest)
  {
    assert(familyRank('edge-neural') < familyRank('chirp3-hd'), 'familyRank: edge-neural before chirp3-hd');
    assert(familyRank('chirp3-hd') < familyRank('wavenet'), 'familyRank: chirp3-hd before wavenet');
    assert(familyRank('wavenet') < familyRank('neural2') && familyRank('neural2') < familyRank('standard'), 'familyRank: wavenet < neural2 < standard');
  }

  // 3. Unlimited free allowance + ONLY-FREE validation
  {
    assert(familyFreeAllowance('edge-neural') >= 100_000_000, "familyFreeAllowance('edge-neural') is unlimited-ish (>= 100M)");
    assert(validateVoiceName('uk-UA-PolinaNeural').ok === true, 'validateVoiceName accepts uk-UA-PolinaNeural');
    assert(validateVoiceName('ru-RU-DmitryNeural').ok === true, 'validateVoiceName accepts ru-RU-DmitryNeural');
  }

  // 4. Cache-key function
  {
    const k1 = edgeCacheKey('uk-UA-PolinaNeural', 'Привіт');
    const k2 = edgeCacheKey('uk-UA-PolinaNeural', 'Привіт');
    const k3 = edgeCacheKey('ru-RU-DmitryNeural', 'Привіт');
    const k4 = edgeCacheKey('uk-UA-PolinaNeural', 'Бувай');
    assert(k1 === k2 && /^[0-9a-f]{40}$/.test(k1), 'edgeCacheKey deterministic sha1 hex');
    assert(k1 !== k3, 'edgeCacheKey differs per voice');
    assert(k1 !== k4, 'edgeCacheKey differs per text');
  }

  // 5. Persona/lang/voiceName resolution
  {
    const tts = new EdgeTTS({ dataDir: makeTmp() });
    assert(tts.getEvaVoice() === EDGE_TTS_DEFAULT_EVA_VOICE, `default eva voice = ${EDGE_TTS_DEFAULT_EVA_VOICE} (FEMALE)`);
    assert(tts.getAdamVoice() === EDGE_TTS_DEFAULT_ADAM_VOICE, `default adam voice = ${EDGE_TTS_DEFAULT_ADAM_VOICE} (MALE)`);
    assert(tts.resolveVoice({ persona: 'eva' }) === 'uk-UA-PolinaNeural', 'persona eva → uk-UA-PolinaNeural');
    assert(tts.resolveVoice({ persona: 'adam' }) === 'ru-RU-DmitryNeural', 'persona adam → ru-RU-DmitryNeural');
    assert(tts.resolveVoice({ lang: 'ru-RU' }) === 'ru-RU-DmitryNeural', 'lang ru → adam voice');
    assert(tts.resolveVoice({ lang: 'uk-UA' }) === 'uk-UA-PolinaNeural', 'lang uk → eva voice');
    assert(tts.resolveVoice({ voiceName: 'uk-UA-OstapNeural' }) === 'uk-UA-OstapNeural', 'explicit voiceName wins');
    assert(isEdgeVoice('ru-RU-SvetlanaNeural') && !isEdgeVoice('uk-UA-Chirp3-HD-Aoede'), 'isEdgeVoice distinguishes edge vs google catalog');
  }

  // 6. Runtime override via data/voice-prefs.json (Edge-Neural names only)
  {
    const dir = makeTmp();
    fs.writeFileSync(path.join(dir, 'voice-prefs.json'), JSON.stringify({ evaVoice: 'ru-RU-SvetlanaNeural', adamVoice: 'uk-UA-Chirp3-HD-Aoede' }));
    const tts = new EdgeTTS({ dataDir: dir });
    assert(tts.getEvaVoice() === 'ru-RU-SvetlanaNeural', 'voice-prefs.json overrides eva with an edge voice');
    assert(tts.getAdamVoice() === 'ru-RU-DmitryNeural', 'voice-prefs.json Google voice is IGNORED for the edge chain (default kept)');
    tts.reloadVoicePrefs();
    assert(tts.getEvaVoice() === 'ru-RU-SvetlanaNeural', 'reloadVoicePrefs re-applies the edge override');
  }

  // 7. Failure policy: throws (so the router falls back to Google TTS)
  {
    const tts = new EdgeTTS({ dataDir: makeTmp(), pythonBin: 'definitely-not-a-python3-binary-xyz' });
    let threw = false;
    try {
      await tts.synthesize('тест', { persona: 'eva' });
    } catch {
      threw = true;
    }
    assert(threw, 'broken python/bin → synthesize THROWS (caller falls back)');
    let emptyThrew = false;
    try {
      await new EdgeTTS({ dataDir: makeTmp() }).synthesize('   ');
    } catch {
      emptyThrew = true;
    }
    assert(emptyThrew, 'empty text → synthesize THROWS');
  }

  // 8. Real synthesis (skipped when edge-tts is unavailable on this host)
  {
    const ok = await edgeAvailable();
    if (!ok) {
      console.log('  skipped: edge-tts unavailable (python3 -m edge_tts --help failed)');
    } else {
      const dir = makeTmp();
      const tts = new EdgeTTS({ dataDir: dir });
      const t0 = Date.now();
      const r = await tts.synthesize('Привіт, я Ева.', { persona: 'eva' });
      const ms = Date.now() - t0;
      assert(r.provider === 'edge-tts' && r.cached === false, 'real synthesis: provider=edge-tts, cached=false');
      assert(r.voice === 'uk-UA-PolinaNeural', 'real synthesis uses uk-UA-PolinaNeural');
      assert(Buffer.isBuffer(r.audioBuffer) && r.audioBuffer.length > 1024, `real synthesis: mp3 bytes = ${r.audioBuffer.length} (${ms} ms)`);
      const r2 = await tts.synthesize('Привіт, я Ева.', { persona: 'eva' });
      assert(r2.cached === true && r2.audioBuffer.equals(r.audioBuffer), 'second identical call resolves from cache');
      assert(fs.existsSync(path.join(dir, 'tts-cache')), 'cache file stored under data/tts-cache/');
    }
  }

  console.log('--- EdgeTTS tests done ---');
  return passed;
}
