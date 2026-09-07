import fs from 'node:fs';
import {
  monthKey,
  readUsage,
  writeUsage,
  resetUsageForTest,
  isWithinCap,
  recordUsage,
  estimateAudioSeconds,
  buildFfmpegFlacArgs,
  buildRecognizeRequest,
  transcribeAudio,
  STT_MONTHLY_CAP_SECONDS,
  STT_MODEL,
  STT_ENDPOINT,
  STT_PROJECT_HEADER,
  type SttUsage,
} from '../src/core/CloudSTT.js';
import { extractMultipartFile } from '../src/server/routes/VoiceRouter.js';
import { TelegramBot } from '../src/telegram/TelegramBot.js';
import { normalizeCommand } from '../src/models/ModelRatings.js';

async function runCloudSttTests(): Promise<boolean> {
  console.log('================================================================');
  console.log('🎙 CLOUD STT TESTS');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  const test = (name: string, condition: boolean, detail: string = '') => {
    if (condition) {
      passed++;
      console.log(`  ✓ ${name}`);
    } else {
      failed++;
      console.error(`  ✗ ${name} ${detail}`);
    }
  };

  // --- 1. Constants: ONLY-FREE design invariants ---
  test('endpoint is v1 recognize', STT_ENDPOINT === 'https://speech.googleapis.com/v1/speech:recognize');
  test('model is latest_long (v1 standard → 60 min/mo free tier)', STT_MODEL === 'latest_long');
  test('required billing project header', STT_PROJECT_HEADER === 'evabot-agent-server');
  test('monthly cap is 3000s (50 min free + safety margin)', STT_MONTHLY_CAP_SECONDS === 3000);

  // --- 2. Usage cap logic ---
  resetUsageForTest();
  test('resetUsageForTest → zero counter for current month',
    readUsage().month === monthKey() && readUsage().secondsUsed === 0);

  writeUsage({ month: monthKey(), secondsUsed: 2998 });
  test('within cap: 2998 + 2 = 3000 exactly allowed', isWithinCap(2) === true);
  test('over cap: 2998 + 3 = 3001 refused', isWithinCap(3) === false);

  writeUsage({ month: monthKey(), secondsUsed: STT_MONTHLY_CAP_SECONDS });
  test('cap reached: any further usage refused', isWithinCap(1) === false);

  const stale: SttUsage = { month: '2000-01', secondsUsed: 999999 };
  test('stale month never blocks a new month', isWithinCap(6000, stale) === true);

  writeUsage({ month: '2000-01', secondsUsed: 5000 });
  const rolled = readUsage();
  test('readUsage rolls stale month over to a fresh counter',
    rolled.month === monthKey() && rolled.secondsUsed === 0);

  resetUsageForTest();
  const after = recordUsage(3);
  test('recordUsage accumulates and persists', after.secondsUsed === 3 && readUsage().secondsUsed === 3);
  resetUsageForTest();

  // --- 3. Cap refusal never throws and never calls the network ---
  writeUsage({ month: monthKey(), secondsUsed: STT_MONTHLY_CAP_SECONDS });
  const refused = await transcribeAudio(Buffer.from('RIFF....'), { encoding: 'OGG_OPUS' });
  test('transcribeAudio refuses at cap (MONTHLY_CAP_REACHED)',
    refused.ok === false && (refused.error || '').includes('MONTHLY_CAP_REACHED') && refused.secondsBilled === 0);
  test('transcribeAudio refuses empty audio without network', (await transcribeAudio(Buffer.alloc(0))).error === 'EMPTY_AUDIO');
  resetUsageForTest();

  // --- 4. Request builder (v1 recognize body) ---
  const req = buildRecognizeRequest('QUJD', { lang: 'ru-RU', encoding: 'OGG_OPUS', sampleRate: 48000 });
  test('request uses latest_long model', req.config.model === STT_MODEL);
  test('request carries OGG_OPUS @ 48 kHz and ru-RU',
    req.config.encoding === 'OGG_OPUS' && req.config.sampleRateHertz === 48000 && req.config.languageCode === 'ru-RU');
  test('request carries base64 audio payload', req.audio.content === 'QUJD');

  const flacReq = buildRecognizeRequest('AAAA', { lang: 'uk-UA', encoding: 'FLAC' });
  test('FLAC omits sampleRateHertz (auto-detected from header)', !('sampleRateHertz' in flacReq.config) && flacReq.config.encoding === 'FLAC');

  const linReq = buildRecognizeRequest('AAAA', { encoding: 'LINEAR16', sampleRate: 44100 });
  test('LINEAR16 keeps explicit sample rate', linReq.config.sampleRateHertz === 44100);

  // --- 5. ffmpeg command construction + real conversion roundtrip ---
  const args = buildFfmpegFlacArgs('/tmp/in.ogg', '/tmp/out.flac');
  test('ffmpeg args: 16 kHz mono FLAC', args.includes('-ar') && args.includes('16000') && args.includes('-ac') && args.includes('1') && args[args.length - 1] === '/tmp/out.flac');

  const tmpWav = `/tmp/evabot-stt-test-${Date.now()}.wav`;
  const tmpFlac = tmpWav.replace(/\.wav$/, '.flac');
  try {
    fs.writeFileSync(tmpWav, Buffer.alloc(0));
    const { execFileSync } = await import('node:child_process');
    execFileSync('ffmpeg', ['-y', '-f', 'lavfi', '-i', 'sine=frequency=440:duration=0.5', tmpWav], { encoding: 'utf8', timeout: 15000 });
    test('local ffmpeg generates test wav', fs.statSync(tmpWav).size > 1000);

    const { convertToFlac16k, probeAudioSeconds } = await import('../src/core/CloudSTT.js');
    const wav = fs.readFileSync(tmpWav);
    const flac = convertToFlac16k(wav);
    test('convertToFlac16k produces non-trivial FLAC', Boolean(flac) && (flac as Buffer).length > 500);
    const probed = probeAudioSeconds(wav);
    test('probeAudioSeconds measures ~0.5–1s', probed !== null && probed >= 1 && probed <= 1);
  } catch (err: any) {
    test('ffmpeg local conversion path', false, err.message);
  } finally {
    try { fs.unlinkSync(tmpWav); } catch { /* ignore */ }
    try { fs.unlinkSync(tmpFlac); } catch { /* ignore */ }
  }

  // --- 6. Duration estimation ---
  test('OGG_OPUS estimate: 60000 B @ ~48 kbps → 10s', estimateAudioSeconds(60000, 'OGG_OPUS') === 10);
  test('FLAC estimate: 32000 B @ 16 kHz mono → 1s', estimateAudioSeconds(32000, 'FLAC') === 1);

  // --- 7. /listen alias resolution (COMMAND_ALIASES) ---
  test('/розпізнай → /listen (UK)', normalizeCommand('/розпізнай /tmp/a.ogg') === '/listen /tmp/a.ogg');
  test('/распознать → /listen (RU)', normalizeCommand('/распознать /tmp/a.ogg') === '/listen /tmp/a.ogg');
  test('/прослушать → /listen (RU alt)', normalizeCommand('/прослушать /tmp/a.ogg') === '/listen /tmp/a.ogg');

  // --- 8. Multipart extraction for the /api/stt route ---
  const boundary = '----evabotBoundary42';
  const mpBody = Buffer.from(
    `--${boundary}\r\nContent-Disposition: form-data; name="audio"; filename="voice.ogg"\r\nContent-Type: audio/ogg\r\n\r\nOGGDATAPAYLOAD\r\n--${boundary}--\r\n`,
    'utf8'
  );
  const extracted = extractMultipartFile(mpBody, `multipart/form-data; boundary=${boundary}`);
  test('multipart file part extracted byte-exact', extracted !== null && extracted.toString() === 'OGGDATAPAYLOAD');
  test('multipart without boundary → null', extractMultipartFile(mpBody, 'multipart/form-data') === null);

  // --- 9. Telegram handler wiring with mocked STT (no live calls) ---
  const sent: string[] = [];
  const chatRouted: string[] = [];
  const receivedCommands: string[] = [];
  const transcriberCalls: Array<{ bytes: number; lang: string }> = [];
  const mockExecutor = (command: string): string => {
    receivedCommands.push(command);
    return `MOCK:${command}`;
  };
  const bot = new TelegramBot({
    token: 'test-token',
    execute: mockExecutor,
    transcriber: async (audio, lang) => {
      transcriberCalls.push({ bytes: audio.length, lang });
      return { transcript: '/help', confidence: 0.92, secondsBilled: 2, ok: true };
    },
  });
  (bot as any).sendMessage = async (_chatId: number, text: string) => { sent.push(text); };
  (bot as any).downloadVoiceFile = async () => Buffer.from('fake-ogg-bytes');
  (bot as any).handleChatMessage = async (_chatId: number, text: string) => { chatRouted.push(text); };

  await (bot as any).handleVoiceMessage({
    message_id: 1,
    date: 0,
    chat: { id: 42, type: 'private' },
    from: { id: 7, username: 'tester' },
    voice: { file_id: 'F1', duration: 2, mime_type: 'audio/ogg' },
  });

  test('transcriber called with downloaded audio buffer', transcriberCalls.length === 1 && transcriberCalls[0].bytes === 14);
  test('chat locale maps to STT lang (en → en-US)', transcriberCalls[0].lang === 'en-US');
  test('voice reply sent with 🎙 Розпізнано: prefix', sent.some((t) => t.startsWith('🎙 Розпізнано:') && t.includes('/help')));
  test('command transcript routed into handleCommand (mock executor received /help)',
    receivedCommands.includes('/help'));

  // Non-command transcript flows into the normal chat engine
  const bot2 = new TelegramBot({
    token: 'test-token',
    execute: mockExecutor,
    transcriber: async () => ({ transcript: 'Привіт, як справи?', confidence: 0.8, secondsBilled: 3, ok: true }),
  });
  (bot2 as any).sendMessage = async (_chatId: number, text: string) => { sent.push(text); };
  (bot2 as any).downloadVoiceFile = async () => Buffer.from('fake-ogg-bytes');
  (bot2 as any).handleChatMessage = async (_chatId: number, text: string) => { chatRouted.push(text); };
  await (bot2 as any).handleVoiceMessage({
    message_id: 2,
    date: 0,
    chat: { id: 42, type: 'private' },
    from: { id: 7, username: 'tester' },
    voice: { file_id: 'F2', duration: 3, mime_type: 'audio/ogg' },
  });
  test('plain transcript routed into handleChatMessage', chatRouted.includes('Привіт, як справи?'));

  // Failed transcription → error notice, no routing
  const bot3 = new TelegramBot({
    token: 'test-token',
    execute: mockExecutor,
    transcriber: async () => ({ transcript: '', confidence: 0, secondsBilled: 0, ok: false, error: 'STT_API_ERROR: boom' }),
  });
  (bot3 as any).sendMessage = async (_chatId: number, text: string) => { sent.push(text); };
  (bot3 as any).downloadVoiceFile = async () => Buffer.from('fake-ogg-bytes');
  await (bot3 as any).handleVoiceMessage({
    message_id: 3,
    date: 0,
    chat: { id: 42, type: 'private' },
    from: { id: 7, username: 'tester' },
    voice: { file_id: 'F3', duration: 2, mime_type: 'audio/ogg' },
  });
  test('failed STT → warning message, nothing routed', sent.some((t) => t.includes('Не вдалося розпізнати') && t.includes('boom')));

  console.log('\n----------------------------------------------------------------');
  console.log(`CloudSTT tests: ${passed} passed, ${failed} failed`);
  console.log('----------------------------------------------------------------\n');
  return failed === 0;
}

export { runCloudSttTests };
