import { runModelTests } from './models.test.js';
import { runChatTests } from './chat.test.js';
import { runServerTests } from './server.test.js';
import { runCoreEngineTests } from './core-engine.test.js';
import { runUniversalClientTests } from './universal_client.test.js';
import { runConsiliumTests } from './consilium.test.js';
import { runRolesTests } from './roles.test.js';
import { runAnsiStreamEngineTests } from './ansi_stream_engine.test.js';
import { runVoicePluginTests } from './voice-plugin.test.js';

async function runAllTests(): Promise<void> {
  console.log('================================================================');
  console.log('⚡ EVABOT MODULAR MULTI-LLM & CONSILIUM — AUTOMATED TEST SUITE');
  console.log('================================================================');

  const results = [
    await runModelTests(),
    await runChatTests(),
    await runServerTests(),
    await runCoreEngineTests(),
    await runUniversalClientTests(),
    await runConsiliumTests(),
    await runRolesTests(),
    await runAnsiStreamEngineTests(),
    await runVoicePluginTests(),
  ];

  const testNames = [
    'ModelTests',
    'ChatTests',
    'ServerTests',
    'CoreEngineTests',
    'UniversalClientTests',
    'ConsiliumTests',
    'RolesTests',
    'AnsiStreamEngineTests',
    'VoicePluginTests',
  ];
  results.forEach((res, i) => {
    if (!res) console.error(`❌ Suite FAILED: ${testNames[i]}`);
    else console.log(`✓ Suite PASSED: ${testNames[i]}`);
  });

  const allPassed = results.every(Boolean);

  console.log('\n================================================================');
  if (allPassed) {
    console.log('✅ ALL 9 TEST SUITES (100% OF TESTS) PASSED SUCCESSFULLY!');
    console.log('================================================================\n');
    process.exit(0);
  } else {
    console.error('❌ SOME TESTS FAILED.');
    console.log('================================================================\n');
    process.exit(1);
  }
}

runAllTests();
