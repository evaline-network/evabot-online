import { ModelRegistry, GEMINI_MODELS } from '../src/models/ModelRegistry.js';

export function runModelTests(): boolean {
  console.log('\n--- Running ModelRegistry Tests ---');
  let passed = true;

  function assert(cond: boolean, msg: string) {
    if (cond) {
      console.log(`  ✓ ${msg}`);
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      passed = false;
    }
  }

  const all = ModelRegistry.getAllModels();
  assert(all.length >= 4, `At least 4 Gemini models registered (found ${all.length})`);

  const flash25 = ModelRegistry.getModelById('gemini-2.5-flash');
  assert(Boolean(flash25), 'gemini-2.5-flash is registered');
  assert(flash25?.recommended === true, 'gemini-2.5-flash is marked as recommended');

  const pro25 = ModelRegistry.getModelById('gemini-2.5-pro');
  assert(Boolean(pro25), 'gemini-2.5-pro is registered');

  const defaultModel = ModelRegistry.getDefaultModel();
  assert(defaultModel.id === 'gemini-2.5-flash', 'Default model is gemini-2.5-flash');

  assert(ModelRegistry.isValidModel('gemini-2.0-flash'), 'gemini-2.0-flash is valid');
  assert(!ModelRegistry.isValidModel('non-existent-gpt-model'), 'Invalid model returns false');

  return passed;
}
