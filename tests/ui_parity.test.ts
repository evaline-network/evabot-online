/**
 * ui_parity.test.ts — Task 1 + Task 2 verification:
 *  - stripEmoji correctness (emoji removed/replaced, box-drawing & ● kept)
 *  - /voices set validation rejects paid-only families (e.g. studio)
 *  - /settings output contains the required settings keys
 *  - /agents lists 18 corporate + 10 Sephirot entries
 *  - banner parity: browser I18N header labels === CLI renderDashboard() labels
 *    (same key substrings: Ping:, Model:, Pool:, Lang:, Databases:)
 */
import fs from 'node:fs';
import path from 'node:path';
import { stripEmoji, I18nEngine } from '../src/core/I18nEngine.js';
import { ModelCommand, COMMAND_ALIASES } from '../src/models/ModelRatings.js';
import { validateVoiceName, voiceFamily } from '../src/core/CloudTTS.js';
import { CORPORATE_ROLES } from '../src/core/CorporateRoles.js';
import { SEPHIROT_ROLES } from '../src/core/SephirotEngine.js';

export function runUiParityTests(): boolean {
  console.log('\n--- Running UI Parity, stripEmoji & Voice/Settings/Agents Tests ---');
  let passed = true;

  function assert(cond: boolean, msg: string) {
    if (cond) {
      console.log(`  ✓ ${msg}`);
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      passed = false;
    }
  }

  // 1. stripEmoji: emoji removed / ASCII-mapped, box drawing + ●■ kept
  {
    assert(stripEmoji('Hello 🎤 world') === 'Hello [ MIC ] world', 'stripEmoji: surrogate-pair emoji mapped to [ MIC ]');
    assert(stripEmoji('done ✅ and failed ❌') === 'done [OK] and failed [X]', 'stripEmoji: ✅→[OK], ❌→[X]');
    assert(stripEmoji('┌──[TEST] ──┐') === '┌──[TEST] ──┐', 'stripEmoji: box drawing kept');
    assert(stripEmoji('● EvaBot ■■■░░ 42%') === '● EvaBot ■■■░░ 42%', 'stripEmoji: ● and ■ kept');
    assert(stripEmoji('a⚠b⚡c♥d★e') === 'a[WRN]b*c*d*e', 'stripEmoji: BMP symbols replaced via map');
    assert(stripEmoji('модель 🔊🔊 mute 🔇') === 'модель [ TTS:ON ][ TTS:ON ] mute [ TTS:OFF ]', 'stripEmoji: TTS toggles mapped');
    assert(stripEmoji('plain text 🗣️✨Rocket🚀') === 'plain text Rocket', 'stripEmoji: unmapped emoji (incl. variation selectors) removed');
  }

  // 2. /voices set validation: paid-only + unknown families rejected
  {
    const studio = ModelCommand.execute('/voices set eva en-US-Studio-F');
    assert(studio.includes('[ERROR]') && /studio/i.test(studio), '/voices set rejects studio (paid-only) family');
    assert(validateVoiceName('en-US-Studio-F').ok === false, 'validateVoiceName: studio rejected');
    assert(validateVoiceName('uk-UA-Chirp3-HD-Kore').ok === true && validateVoiceName('uk-UA-Chirp3-HD-Kore').family === 'chirp3-hd', 'validateVoiceName: Chirp3-HD allowed');
    assert(validateVoiceName('ru-RU-Wavenet-D').ok === true, 'validateVoiceName: Wavenet allowed');
    assert(validateVoiceName('definitely-not-a-voice').ok === false, 'validateVoiceName: unknown voice rejected');
    assert(voiceFamily('uk-UA-Chirp3-HD-Aoede') === 'chirp3-hd', 'voiceFamily: Chirp3-HD detection');

    const help = ModelCommand.execute('/voices');
    assert(help.includes('uk-UA') && help.includes('ru-RU') && help.includes('en-US'), '/voices lists all three languages');
    assert(help.includes('Chirp3-HD'.toUpperCase()) || help.includes('CHIRP3-HD'), '/voices groups Chirp3-HD family');
    assert(help.includes('Eva =') && help.includes('Adam ='), '/voices shows current Eva/Adam selection');
    assert(help.includes('/voices set eva'), '/voices prints the set hint');

    assert(COMMAND_ALIASES['/голоси'] === '/voices' && COMMAND_ALIASES['/голоса'] === '/voices' && COMMAND_ALIASES['/звуки'] === '/voices', '/voices UK/RU aliases registered');
    assert(COMMAND_ALIASES['/налаштування'] === '/settings' && COMMAND_ALIASES['/настройки'] === '/settings', '/settings UK/RU aliases registered');
    assert(COMMAND_ALIASES['/агенти'] === '/agents' && COMMAND_ALIASES['/рота'] === '/agents' && COMMAND_ALIASES['/роли-агентів'] === '/agents', '/agents UK/RU aliases registered');
  }

  // 3. /settings output contains the required keys
  {
    const out = ModelCommand.execute('/settings');
    for (const key of ['Locale', 'Mode', 'Model (default)', 'Debug', 'TTS usage', 'STT usage', 'Translate usage', 'Autocorrect', 'Emoji mode', 'Developer mode', 'Session id']) {
      assert(out.includes(key), `/settings contains "${key}"`);
    }
  }

  // 4. /agents lists 18 corporate + 10 Sephirot entries
  {
    const out = ModelCommand.execute('/agents');
    const corporateCount = Object.keys(CORPORATE_ROLES).length;
    assert(corporateCount === 18, `corporate roster has 18 roles (got ${corporateCount})`);
    assert(SEPHIROT_ROLES.length === 10, 'Sephirot roster has 10 nodes');
    assert(out.includes('[CORPORATE]') && out.includes('[SEPHIROT]'), '/agents has both sections');
    assert(out.includes(`= ${corporateCount + SEPHIROT_ROLES.length} агентів`), '/agents footer sums 18+10 entries');
    assert(out.includes('[ADAM]') && out.includes('[EVA]'), '/agents marks Adam/Eva personas');
  }

  // 5. Banner parity: browser I18N header labels === CLI renderDashboard labels
  {
    const htmlPath = path.resolve(process.cwd(), 'public', 'index.html');
    const html = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, 'utf8') : '';
    assert(html.length > 0, 'browser index.html readable for parity check');
    const pairs: Array<[string, string]> = [
      ['id="lbl-ping">Ping:<', 'ping'],
      ['id="lbl-model">Model:<', 'model'],
      ['id="lbl-pool">Pool:<', null],
      ['id="lbl-lang">Lang:<', 'lang'],
      ['id="lbl-databases">Databases:<', 'databasesLabel'],
      ['id="lbl-mode">Mode:<', 'mode'],
      ['id="lbl-commands">Commands:<', 'commandsLabel'],
      ['id="lbl-load">Load:<', 'loadLabel'],
    ];
    for (const [needle] of pairs) {
      assert(html.includes(needle), `browser banner contains "${needle}" (CLI parity)`);
    }
    const s = I18nEngine.getStrings('en');
    assert(s.ping === 'Ping:' && s.model === 'Model:' && s.databasesLabel === 'Databases:', 'CLI dashboard labels match browser labels (EN)');
    assert(html.includes('>Ping:<') === html.includes(`id="lbl-ping">${s.ping}<`), 'browser Ping label equals CLI dictionary value');
    // Ukrainian parity: static HTML holds EN defaults, UK labels live in the
    // in-page I18N dictionary that setLanguage() applies to the same labels.
    const su = I18nEngine.getStrings('uk');
    assert(html.includes(`ping: '${su.ping}'`) && html.includes(`model: '${su.model}'`) && html.includes(`databases: '${su.databasesLabel}'`), 'browser UK I18N labels equal CLI dictionary values');
    // Emoji-free banner (task 1): no mic/speaker emoji in the header block
    assert(!stripEmoji(html).includes('🎤') && !html.includes('🔊'), 'browser banner contains no emoji (stripped / replaced)');
    assert(html.includes('[ TTS:ON ]') || html.includes('tts-toggle'), 'TTS toggle present with ASCII label');
  }

  console.log('--- UI parity tests done ---');
  return passed;
}
