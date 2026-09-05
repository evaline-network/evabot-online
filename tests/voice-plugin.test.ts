import {
  VOICE_PERSONAS,
  DEFAULT_VOICE_PLUGIN_CONFIG,
  VoiceController,
} from '../src/plugins/voice/index.js';
import { LOCALE_POLICY } from '../src/core/LocalePolicy.js';
import http from 'node:http';

export async function runVoicePluginTests(): Promise<boolean> {
  console.log('\n--- Running Voice Plugin Tests ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✓ ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ ${testName}`);
      failed++;
    }
  }

  // 1. Persona Configuration Test
  assert(VOICE_PERSONAS.eva.voiceName === 'Aoede', 'Eva persona uses Aoede neural voice');
  assert(VOICE_PERSONAS.eva.gender === 'female', 'Eva persona has female gender');
  assert(VOICE_PERSONAS.eva.role.includes('Frontend'), 'Eva persona role focuses on Frontend');

  assert(VOICE_PERSONAS.adam.voiceName === 'Fenrir', 'Adam persona uses Fenrir neural voice');
  assert(VOICE_PERSONAS.adam.gender === 'male', 'Adam persona has male gender');
  assert(VOICE_PERSONAS.adam.role.includes('Backend'), 'Adam persona role focuses on Backend');

  // 2. Multilingual & Locale Policy Test
  assert(
    DEFAULT_VOICE_PLUGIN_CONFIG.supportedLanguages.length === 5 &&
    DEFAULT_VOICE_PLUGIN_CONFIG.supportedLanguages.includes('ru') &&
    DEFAULT_VOICE_PLUGIN_CONFIG.supportedLanguages.includes('uk') &&
    DEFAULT_VOICE_PLUGIN_CONFIG.supportedLanguages.includes('en') &&
    DEFAULT_VOICE_PLUGIN_CONFIG.supportedLanguages.includes('pl') &&
    DEFAULT_VOICE_PLUGIN_CONFIG.supportedLanguages.includes('ro'),
    'Supported languages strictly include RU, UK, EN, PL, RO'
  );

  // Check Zero-Tolerance Policy: Forbidden terms must not be in system prompts
  const evaPromptLower = VOICE_PERSONAS.eva.systemPrompt.toLowerCase();
  const adamPromptLower = VOICE_PERSONAS.adam.systemPrompt.toLowerCase();
  assert(evaPromptLower.includes('odesa') && evaPromptLower.includes('ukraine'), 'Eva system prompt includes Odesa, Ukraine location');
  assert(adamPromptLower.includes('odesa') && adamPromptLower.includes('ukraine'), 'Adam system prompt includes Odesa, Ukraine location');
  assert(
    !evaPromptLower.includes('ruble') && !evaPromptLower.includes('rub') && !evaPromptLower.includes('₽'),
    'Eva prompt contains no forbidden currencies'
  );
  assert(
    !adamPromptLower.includes('ruble') && !adamPromptLower.includes('rub') && !adamPromptLower.includes('₽'),
    'Adam prompt contains no forbidden currencies'
  );

  // 3. Audio Sample Rates
  assert(DEFAULT_VOICE_PLUGIN_CONFIG.sampleRateInput === 16000, 'Audio input sample rate is 16,000 Hz');
  assert(DEFAULT_VOICE_PLUGIN_CONFIG.sampleRateOutput === 24000, 'Audio output sample rate is 24,000 Hz');

  // 4. Voice Controller State Management
  VoiceController.setEnabled(true);
  assert(VoiceController.isEnabled() === true, 'VoiceController.setEnabled(true) works');
  VoiceController.setEnabled(false);
  assert(VoiceController.isEnabled() === false, 'VoiceController.setEnabled(false) works');
  VoiceController.setEnabled(true);

  VoiceController.setActivePersona('adam');
  assert(VoiceController.getSettings().activePersona === 'adam', 'VoiceController.setActivePersona("adam") works');
  VoiceController.setActivePersona('eva');
  assert(VoiceController.getSettings().activePersona === 'eva', 'VoiceController.setActivePersona("eva") works');

  // 5. Simulated Request Dispatch
  let mockResStatus = 0;
  let mockResHeaders: Record<string, string> = {};
  let mockResBody = '';

  const createMockRes = (): any => ({
    writeHead: (status: number, headers: Record<string, string>) => {
      mockResStatus = status;
      mockResHeaders = headers;
    },
    end: (data: string) => {
      mockResBody = data;
    },
  });

  const mockReqStatus: any = { method: 'GET' };
  const handledStatus = await VoiceController.handleRequest(mockReqStatus, createMockRes(), '/api/voice/status');
  assert(handledStatus === true, 'VoiceController handles /api/voice/status');
  assert(mockResStatus === 200, 'Status endpoint returns HTTP 200');
  const statusJson = JSON.parse(mockResBody);
  assert(statusJson.enabled === true, 'Status JSON contains enabled flag');
  assert(statusJson.personas.eva.voiceName === 'Aoede', 'Status JSON contains Eva persona specs');

  const mockReqConfig: any = { method: 'GET' };
  const handledConfig = await VoiceController.handleRequest(mockReqConfig, createMockRes(), '/api/voice/config');
  assert(handledConfig === true, 'VoiceController handles /api/voice/config');
  assert(mockResStatus === 200, 'Config endpoint returns HTTP 200');
  const configJson = JSON.parse(mockResBody);
  assert(configJson.model === DEFAULT_VOICE_PLUGIN_CONFIG.model, 'Config JSON returns active model');
  assert(configJson.voiceName === 'Aoede', 'Config JSON returns active voice name');

  console.log(`Voice Plugin Tests Finished: ${passed} passed, ${failed} failed.`);
  return failed === 0;
}

if (process.argv[1] && process.argv[1].endsWith('voice-plugin.test.ts')) {
  runVoicePluginTests().then((ok) => {
    process.exit(ok ? 0 : 1);
  });
}
