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

  // ============================================================================
  // Free vs Paid Model Tags Verification
  // ============================================================================
  console.log('  [ModelRegistry: Free vs Paid Tags Verification]');

  const allModels = ModelRegistry.getAllModels();
  const freeModels = ModelRegistry.getFreeModels();
  const paidModels = ModelRegistry.getPaidOnlyModels();

  assert(allModels.length >= 30, `Comprehensive catalog has at least 30 models (found ${allModels.length})`);
  assert(freeModels.length > 0, `Free models list is non-empty (found ${freeModels.length})`);
  assert(paidModels.length > 0, `Paid-only models list is non-empty (found ${paidModels.length})`);
  assert(
    freeModels.length + paidModels.length === allModels.length,
    `Free models (${freeModels.length}) + Paid models (${paidModels.length}) strictly equals total models (${allModels.length})`
  );

  // Validate freeTierStatus values on every model
  const validStatuses = ['100% Free Quota Available', 'Paid / Pay-As-You-Go Only'];
  for (const model of allModels) {
    const status = model.pricing.freeTierStatus;
    assert(validStatuses.includes(status), `Model ${model.id} has valid freeTierStatus tag (${status})`);
    assert(
      typeof model.pricing.freeTierDetails === 'string' && model.pricing.freeTierDetails.trim().length > 0,
      `Model ${model.id} has non-empty freeTierDetails`
    );
  }

  // Verify known free models are in getFreeModels()
  const expectedFreeModelIds = [
    'deepseek/deepseek-r1:free',
    'meta-llama/llama-3.3-70b:free',
    'google/gemini-2.0-flash-exp:free',
    'qwen/qwen-2.5-coder-32b-instruct:free',
    'mistralai/mistral-7b-instruct:free',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemma-2-27b-it',
    'gemma-2-9b-it',
    'omniroute/gemini-2.5-pro',
    'omniroute/deepseek-r1',
    'opencode/go-coder-32b',
    'opencode/go-fast',
  ];

  for (const freeId of expectedFreeModelIds) {
    const found = freeModels.some((m) => m.id === freeId);
    assert(found, `Expected free model ${freeId} is correctly tagged as 100% Free Quota Available`);
  }

  // Verify known paid-only models are in getPaidOnlyModels()
  const expectedPaidModelIds = [
    'claude-3-7-sonnet',
    'claude-3-5-sonnet',
    'claude-3-5-haiku',
    'llama-3.3-70b-instruct',
    'llama-3.2-90b-vision-instruct',
    'llama-3.1-405b-instruct',
    'mistral-large-2411',
    'codestral-2501',
    'deepseek-r1',
    'jamba-1.5-large',
    'command-r-plus',
    'omniroute/claude-3.5-sonnet',
    'openrouter/deepseek-chat',
  ];

  for (const paidId of expectedPaidModelIds) {
    const found = paidModels.some((m) => m.id === paidId);
    assert(found, `Expected paid model ${paidId} is correctly tagged as Paid / Pay-As-You-Go Only`);
  }

  // ============================================================================
  // Strict USD ($) and EUR (€) Pricing Format & Zero Rubles Verification
  // ============================================================================
  console.log('  [ModelRegistry: Strict USD ($) & EUR (€) Currency Format]');

  for (const model of allModels) {
    const p = model.pricing;

    // USD format check
    assert(p.inputPer1MTokensUSD.includes('$'), `Model ${model.id} inputPer1MTokensUSD contains "$" symbol`);
    assert(p.outputPer1MTokensUSD.includes('$'), `Model ${model.id} outputPer1MTokensUSD contains "$" symbol`);

    // EUR format check
    assert(p.inputPer1MTokensEUR.includes('€'), `Model ${model.id} inputPer1MTokensEUR contains "€" symbol`);
    assert(p.outputPer1MTokensEUR.includes('€'), `Model ${model.id} outputPer1MTokensEUR contains "€" symbol`);

    // Zero Rubles Check across all fields
    const fullText = `${model.id} ${model.name} ${model.description} ${p.inputPer1MTokensUSD} ${p.outputPer1MTokensUSD} ${p.inputPer1MTokensEUR} ${p.outputPer1MTokensEUR} ${p.freeTierDetails} ${p.freeTierStatus}`;
    const hasForbiddenCurrency = fullText.includes('RUB') || fullText.includes('₽') || fullText.toLowerCase().includes('ruble');
    assert(!hasForbiddenCurrency, `Model ${model.id} metadata & pricing is 100% free of rubles (RUB / ₽)`);
  }

  return passed;
}
