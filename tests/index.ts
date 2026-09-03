import { runModelTests } from './models.test.js';
import { runChatTests } from './chat.test.js';
import { runServerTests } from './server.test.js';
import { runCoreEngineTests } from './core-engine.test.js';
import { runUniversalClientTests } from './universal_client.test.js';
import { runConsiliumTests } from './consilium.test.js';
import { runRolesTests } from './roles.test.js';

async function runAllTests(): Promise<void> {
  console.log('================================================================');
  console.log('⚡ EVABOT MODULAR MULTI-LLM & CONSILIUM — AUTOMATED TEST SUITE');
  console.log('================================================================');

  const results = await Promise.all([
    runModelTests(),
    runChatTests(),
    runServerTests(),
    runCoreEngineTests(),
    runUniversalClientTests(),
    runConsiliumTests(),
    runRolesTests(),
  ]);

  const allPassed = results.every(Boolean);

  console.log('\n================================================================');
  if (allPassed) {
    console.log('✅ ALL 7 TEST SUITES (100% OF TESTS) PASSED SUCCESSFULLY!');
    console.log('================================================================\n');
    process.exit(0);
  } else {
    console.error('❌ SOME TESTS FAILED.');
    console.log('================================================================\n');
    process.exit(1);
  }
}

runAllTests();
