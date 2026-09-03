import { UniversalLlmClient } from '../src/core/UniversalLlmClient.js';
import { Config } from '../src/core/Config.js';
import { ChatMessage } from '../src/core/GeminiClient.js';

export async function runUniversalClientTests(): Promise<boolean> {
  console.log('\n--- Running UniversalLlmClient & Multi-Provider Tests ---');
  let passed = true;

  function assert(cond: boolean, msg: string) {
    if (cond) {
      console.log(`  ✓ ${msg}`);
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      passed = false;
    }
  }

  const client = new UniversalLlmClient();

  // 1. Provider Resolution Tests
  assert(client.resolveProvider('gemini-2.5-flash') === 'google', 'Resolves standard Gemini model to google provider');
  assert(client.resolveProvider('gemini-2.5-pro') === 'google', 'Resolves Gemini 2.5 Pro to google provider');
  assert(client.resolveProvider('omniroute/gpt-4o') === 'omniroute', 'Resolves omniroute/ prefix to omniroute provider');
  assert(client.resolveProvider('opencode/deepseek-r1') === 'opencode', 'Resolves opencode/ prefix to opencode provider');
  assert(client.resolveProvider('openrouter/meta-llama/llama-3.3-70b') === 'openrouter', 'Resolves openrouter/ prefix to openrouter provider');
  assert(client.resolveProvider('deepseek/deepseek-r1:free') === 'openrouter', 'Resolves deepseek-r1:free to openrouter provider');
  assert(client.resolveProvider('meta-llama/llama-3.3-70b:free') === 'openrouter', 'Resolves llama-3.3-70b:free to openrouter provider');
  assert(client.resolveProvider('google/gemini-2.0-flash-exp:free') === 'openrouter', 'Resolves gemini-2.0-flash-exp:free to openrouter provider');

  // Explicit provider override test
  assert(client.resolveProvider('gemini-2.5-flash', 'omniroute') === 'omniroute', 'Explicit provider overrides model naming convention');

  // 2. Message Normalization Tests
  const fromString = client.normalizeToUniversal('Test user message');
  assert(fromString.length === 1 && fromString[0].role === 'user' && fromString[0].content === 'Test user message', 'Normalizes string to UniversalMessage[]');

  const rawChatMsgs: ChatMessage[] = [
    { role: 'user', parts: [{ text: 'Hello bot' }] },
    { role: 'model', parts: [{ text: 'Hello human' }] },
  ];
  const fromChatMsgs = client.normalizeToUniversal(rawChatMsgs);
  assert(fromChatMsgs.length === 2, 'Normalizes ChatMessage[] length');
  assert(fromChatMsgs[0].role === 'user' && fromChatMsgs[0].content === 'Hello bot', 'Converts user role and extracts content');
  assert(fromChatMsgs[1].role === 'assistant' && fromChatMsgs[1].content === 'Hello human', 'Converts model role to assistant');

  // 3. Gemini Format Conversion Tests
  const geminiConverted = client.toGeminiFormat([
    { role: 'system', content: 'You are EvaBot, strict compliance.' },
    { role: 'user', content: 'Explain quantum computing.' },
    { role: 'assistant', content: 'Quantum computing uses qubits.' },
  ], 'Default instruction');

  assert(geminiConverted.systemInstruction?.includes('strict compliance.'), 'Extracts system role into systemInstruction');
  assert(geminiConverted.contents.length === 2, 'Excludes system message from Gemini contents');
  assert(geminiConverted.contents[0].role === 'user', 'First turn is user');
  assert(geminiConverted.contents[1].role === 'model', 'Second turn converted to model');

  // 4. Currency and Sanctions Compliance
  const sysInst = Config.defaultSystemInstruction;
  const hasRubles = sysInst.includes('RUB') || sysInst.includes('₽');
  assert(!hasRubles, 'System prompt enforces strict NO rubles policy (RUB / ₽)');
  assert(sysInst.includes('USD') && sysInst.includes('EUR'), 'System prompt strictly enforces USD ($) and EUR (€)');

  return passed;
}
