import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { AddCommand, stripHtml } from '../src/core/AddCommand.js';
import { knowledgeBase } from '../src/core/KnowledgeBase.js';

const ROSTER_PATH = fs.existsSync(path.resolve(process.cwd(), 'data'))
  ? path.resolve(process.cwd(), 'data', 'add-roster.json')
  : '/var/www/evabot-backend/data/add-roster.json';

export async function runAddCommandTests(): Promise<boolean> {
  console.log('\n--- Running AddCommand Tests (/add universal command) ---');
  let passed = true;

  function assert(cond: boolean, msg: string) {
    if (cond) {
      console.log(`  ✓ ${msg}`);
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      passed = false;
    }
  }

  try {
    // --- help / no args ---
    const bare = await AddCommand.execute('/add');
    assert(bare.includes('/add db'), 'bare /add → help lists /add db');
    assert(bare.includes('/add context'), 'help lists /add context');
    assert(bare.includes('/add agent'), 'help lists /add agent');
    const help = await AddCommand.execute('/add help');
    assert(help.includes('/add link'), '/add help → help text');
    assert(help.includes('RU:'), 'help contains RU brief');

    // --- /add db ---
    const dbOut = await AddCommand.execute('/add db Тестовий документ | Ціна виробництва килимків EVA — від $25 за м²');
    assert(dbOut.includes('[ADD] Document added'), '/add db returns confirmation');
    assert(dbOut.includes('lang=UK'), '/add db detects Ukrainian (іїє markers)');
    const dbIdMatch = /id=(user-\d+)/.exec(dbOut);
    assert(!!dbIdMatch, '/add db generates user-<ts> id');
    const dbId = dbIdMatch ? dbIdMatch[1] : '';
    const stored = knowledgeBase.listDocuments().find((d) => d.id === dbId);
    assert(!!stored, '/add db document stored in KB memory');
    assert(stored ? stored.tags.includes('user') : false, 'stored doc carries user tag');

    const dbEn = await AddCommand.execute('/add db Price list | EVA mats from $25 per square meter');
    assert(/id=/.test(dbEn) && dbEn.includes('lang=EN'), '/add db english → lang=EN');

    assert((await AddCommand.execute('/add db NoContent')).includes('Usage: /add db'), '/add db missing content → usage');
    assert((await AddCommand.execute('/add db NoTitle | ')).includes('Usage: /add db'), '/add db empty content → usage');

    // /add kb alias
    const kbAlias = await AddCommand.execute('/add kb Alias doc | Теж працює');
    assert(kbAlias.includes('[ADD] Document added'), '/add kb alias works like /add db');

    // --- /add context ---
    const ctxOut = await AddCommand.execute('/add context Ім’я клієнта: Тарас. Тон: діловий.');
    assert(ctxOut.includes("[ADD] Context injected into session 'default'"), '/add context injects into default session');
    assert((await AddCommand.execute('/add context')).includes('Usage: /add context'), '/add context without args → usage');

    // --- /add bot / human / agent ---
    const botOut = await AddCommand.execute('/add bot EvaBot');
    assert(botOut.includes('[ADD] Bot "EvaBot" registered'), '/add bot registers participant');
    assert(botOut.includes('Roster size:'), '/add bot reports roster size');
    assert((await AddCommand.execute('/add human Тарас')).includes('Human "Тарас" registered'), '/add human registers participant');

    const agentOut = await AddCommand.execute('/add agent Analyst Фокус на ринкових даних та цінах');
    assert(agentOut.includes('[ADD] Agent "Analyst" registered'), '/add agent registers with prompt');
    assert(agentOut.includes('with prompt'), '/add agent prompt detected');
    const roster: { bots: string[]; humans: string[]; agents: Array<{ name: string; prompt?: string }>; media: unknown[] } =
      JSON.parse(fs.readFileSync(ROSTER_PATH, 'utf8'));
    assert(roster.bots.includes('EvaBot'), 'roster file contains bot');
    assert(roster.humans.includes('Тарас'), 'roster file contains human');
    assert(roster.agents.some((a: { name: string; prompt?: string }) => a.name === 'Analyst' && (a.prompt || '').includes('ринкових')), 'roster file contains agent with prompt');
    assert((await AddCommand.execute('/add agent')).includes('Usage: /add agent'), '/add agent without args → usage');

    // agent re-registration updates prompt, no duplicate
    const agentsBefore = roster.agents.length;
    await AddCommand.execute('/add agent Analyst Новий промпт');
    const roster2 = JSON.parse(fs.readFileSync(ROSTER_PATH, 'utf8'));
    assert(roster2.agents.length === agentsBefore, 'agent re-registration does not duplicate');
    assert(roster2.agents.some((a) => a.name === 'Analyst' && a.prompt === 'Новий промпт'), 'agent re-registration updates prompt');

    // --- /add link validation (no network needed) ---
    assert((await AddCommand.execute('/add link')).includes('Usage: /add link'), '/add link without url → usage');
    const badLink = await AddCommand.execute('/add link ftp://not-http.example');
    assert(badLink.includes('[ERROR]'), '/add link non-http scheme → error');

    // --- file with text content ---
    const fileOut = await AddCommand.execute('/add file', {
      file: { name: 'notes.md', mime: 'text/markdown', data: Buffer.from('# Notes\n\nEVA production in Chornomorsk, Ukraine.', 'utf8') },
    });
    assert(fileOut.includes('[ADD] File "notes.md"'), 'text file ingested into KB');
    assert(fileOut.includes('Knowledge Base'), 'text file confirms KB ingestion');

    const binOut = await AddCommand.execute('/add media', {
      file: { name: 'voice.ogg', mime: 'audio/ogg', data: Buffer.from([0x4f, 0x67, 0x67, 0x53, 0x00]) },
    });
    assert(binOut.includes('[ADD] Binary media "voice.ogg"'), 'binary media stored as metadata');
    assert(binOut.includes('media metadata'), 'binary media roster confirmation');

    assert((await AddCommand.execute('/add file')).includes('No file payload'), '/add file without upload → usage hint');
    assert((await AddCommand.execute('/add unknown-sub')).includes('Unknown /add subcommand'), 'unknown subcommand → error');

    // --- stripHtml helper ---
    assert(stripHtml('<p>Hello <b>world</b></p><script>evil()</script>') === 'Hello world', 'stripHtml removes tags + scripts');
    assert(stripHtml('a &amp; b &lt;c&gt;') === 'a & b <c>', 'stripHtml decodes entities');

    // --- language heuristic ---
    assert(AddCommand.detectLanguage('Привіт, як справи?') === 'uk', 'detectLanguage uk (ї)');
    assert(AddCommand.detectLanguage('Привет, как дела?') === 'ru', 'detectLanguage ru');
    assert(AddCommand.detectLanguage('Hello there') === 'en', 'detectLanguage en');
  } catch (err: unknown) {
    console.error(`  ✗ FAIL: unexpected exception: ${err instanceof Error ? err.stack : String(err)}`);
    passed = false;
  }

  console.log(passed ? '  AddCommand: ALL PASS' : '  AddCommand: FAILURES');
  return passed;
}

// Allow standalone execution: npx tsx tests/add_command.test.ts
if (process.argv[1] && process.argv[1].includes('add_command')) {
  runAddCommandTests().then((ok) => process.exit(ok ? 0 : 1));
}
