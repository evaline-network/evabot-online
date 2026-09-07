import { runModelTests } from './models.test.js';
import { runChatTests } from './chat.test.js';
import { runServerTests } from './server.test.js';
import { runCoreEngineTests } from './core-engine.test.js';
import { runUniversalClientTests } from './universal_client.test.js';
import { runConsiliumTests } from './consilium.test.js';
import { runRolesTests } from './roles.test.js';
import { runAnsiStreamEngineTests } from './ansi_stream_engine.test.js';
import { runPluginManagerTests, runEventBusTests } from './plugin-manager.test.js';
import { runLLMProvidersTests } from './llm-providers.test.js';
import { runKnowledgeBaseTests } from './knowledge-base.test.js';
import { runPluginConsiliumTests } from './consilium-new.test.js';
import { runAccountingAndBuilderTests } from './accounting_and_builder.test.js';
import { runCommandsAndHistoryTests } from './commands_and_history.test.js';
import { runProductsTests } from './products.test.js';
import { runTelegramTests } from './telegram.test.js';
import { runResilienceTests } from './resilience.test.js';
import { runDebugLogTests } from './debug_log.test.js';

async function runAllTests(): Promise<void> {
  console.log('================================================================');
  console.log('⚡ EVABOT v0.1.0 — FULL TEST SUITE (19 test suites)');
  console.log('================================================================\n');

  const results = [
    await runModelTests(),
    await runChatTests(),
    await runServerTests(),
    await runCoreEngineTests(),
    await runUniversalClientTests(),
    await runConsiliumTests(),
    await runRolesTests(),
    await runAnsiStreamEngineTests(),
    await runPluginManagerTests(),
    await runEventBusTests(),
    await runLLMProvidersTests(),
    await runKnowledgeBaseTests(),
    await runPluginConsiliumTests(),
    await runAccountingAndBuilderTests(),
    await runCommandsAndHistoryTests(),
    await runProductsTests(),
    await runTelegramTests(),
    await runResilienceTests(),
    await runDebugLogTests(),
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
    'PluginManagerTests',
    'EventBusTests',
    'LLMProvidersTests',
    'KnowledgeBaseTests',
    'ConsiliumNewTests',
    'AccountingAndBuilderTests',
    'CommandsAndHistoryTests',
    'ProductsTests',
    'TelegramTests',
    'ResilienceTests',
    'DebugLogTests',
  ];

  let allPassed = true;
  console.log('\n================================================================');
  results.forEach((res, i) => {
    if (res) {
      console.log(`✓ Suite PASSED: ${testNames[i]}`);
    } else {
      console.error(`❌ Suite FAILED: ${testNames[i]}`);
      allPassed = false;
    }
  });

  console.log('\n================================================================');
  if (allPassed) {
    console.log('✅ ALL 19 TEST SUITES (100% OF TESTS) PASSED SUCCESSFULLY!');
    console.log('================================================================\n');
    process.exit(0);
  } else {
    console.error('❌ SOME TESTS FAILED.');
    console.log('================================================================\n');
    process.exit(1);
  }
}

runAllTests();
