import { runModelTests } from './models.test.js';
import { runChatTests } from './chat.test.js';
import { runServerTests } from './server.test.js';

async function runAllTests(): Promise<void> {
  console.log('================================================================');
  console.log('⚡ EVABOT MODULAR GEMINI LLM CHAT — AUTOMATED TEST SUITE');
  console.log('================================================================');

  const p1 = runModelTests();
  const p2 = runChatTests();
  const p3 = await runServerTests();

  console.log('\n================================================================');
  if (p1 && p2 && p3) {
    console.log('✅ ALL TESTS PASSED SUCCESSFULLY!');
    console.log('================================================================\n');
    process.exit(0);
  } else {
    console.error('❌ SOME TESTS FAILED.');
    console.log('================================================================\n');
    process.exit(1);
  }
}

runAllTests();
