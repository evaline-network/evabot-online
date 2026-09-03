import { ChatSession } from '../src/core/ChatSession.js';
import { Config } from '../src/core/Config.js';

export function runChatTests(): boolean {
  console.log('\n--- Running ChatSession & Currency Compliance Tests ---');
  let passed = true;

  function assert(cond: boolean, msg: string) {
    if (cond) {
      console.log(`  ✓ ${msg}`);
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      passed = false;
    }
  }

  const session = new ChatSession({
    model: 'gemini-2.5-flash',
    maxHistoryTurns: 5,
  });

  assert(session.getModel() === 'gemini-2.5-flash', 'Session initializes with correct model');
  assert(session.getHistory().length === 0, 'Session starts with empty history');

  const switched = session.setModel('gemini-2.5-pro');
  assert(switched && session.getModel() === 'gemini-2.5-pro', 'Model switched to gemini-2.5-pro');

  const invalidSwitch = session.setModel('fake-model');
  assert(!invalidSwitch && session.getModel() === 'gemini-2.5-pro', 'Invalid model switch safely rejected');

  // Currency Compliance Verification
  const systemPrompt = session.getSystemInstruction();
  const containsRub = systemPrompt.includes('RUB') || systemPrompt.includes('₽');
  assert(!containsRub, 'System prompt contains NO rubles (RUB / ₽)');
  assert(systemPrompt.includes('USD') && systemPrompt.includes('EUR'), 'System prompt enforces USD ($) and EUR (€)');

  assert(Config.supportedCurrencies.includes('USD') && Config.supportedCurrencies.includes('EUR'), 'Config enforces USD and EUR only');

  return passed;
}
