import {
  LOCALE_POLICY,
  LANGUAGE_MIRRORING_RULE,
  detectMessageLanguage,
  languageLockInstruction,
  applyLocalePolicy,
} from '../src/core/LocalePolicy.js';
import { EVA_IDENTITY_RULE, ADAM_IDENTITY_RULE, ROLE_SPLIT_RULE, personaRuleFor, applyPersonaPolicy } from '../src/core/PersonaPolicy.js';
import { Config } from '../src/core/Config.js';

export function runLanguagePolicyTests(): boolean {
  console.log('\n--- Running Language Policy Tests (LANGUAGE MIRRORING) ---');
  let passed = true;

  function assert(cond: boolean, msg: string) {
    if (cond) {
      console.log(`  ✓ ${msg}`);
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      passed = false;
    }
  }

  // detectMessageLanguage
  assert(detectMessageLanguage('Привіт, як справи? Буть ласка') === 'uk', 'Ukrainian detected (ії + words)');
  assert(detectMessageLanguage('Привет, как дела?') === 'ru', 'Russian detected');
  assert(detectMessageLanguage('Hello, how are you?') === 'en', 'English detected');
  assert(detectMessageLanguage('Скільки коштує виробництво килимків?') === 'uk', 'Ukrainian production question');
  assert(detectMessageLanguage('') === 'en', 'empty → en default');
  assert(detectMessageLanguage('   ') === 'en', 'whitespace → en default');
  assert(detectMessageLanguage('Привет') === 'ru', 'ambiguous Cyrillic without UK markers → ru');
  assert(detectMessageLanguage('Дякую, це те що треба!') === 'uk', 'UK markers dominate');

  // languageLockInstruction
  assert(languageLockInstruction('Привіт').includes('Ukrainian'), 'lock names Ukrainian');
  assert(languageLockInstruction('Привет').includes('Russian'), 'lock names Russian');
  assert(languageLockInstruction('Hello').includes('English'), 'lock names English');

  // Rules present in policy surfaces
  assert(applyLocalePolicy('base').includes('LANGUAGE MIRRORING'), 'applyLocalePolicy embeds mirroring rule');
  assert(LANGUAGE_MIRRORING_RULE.includes('Never switch languages'), 'rule forbids spontaneous switching');
  assert(Config.defaultSystemInstruction.includes('LANGUAGE MIRRORING'), 'default system instruction carries the rule');
  assert(LOCALE_POLICY.primaryLanguages.includes('uk'), 'uk in primary languages');

  // PersonaPolicy (Eva/Adam identity locks + role split)
  assert(Config.defaultSystemInstruction.includes('You are Eva, the Face of EvaLine'), 'default instruction speaks as Eva (Face of EvaLine)');
  assert(Config.defaultSystemInstruction.includes('female first person'), 'default instruction enforces female first person');
  assert(personaRuleFor('eva') === EVA_IDENTITY_RULE && personaRuleFor('adam') === ADAM_IDENTITY_RULE, 'personaRuleFor returns identity rules');
  assert(personaRuleFor(undefined) === ROLE_SPLIT_RULE, 'neutral persona → ROLE SPLIT only');
  const evaApplied = applyPersonaPolicy('base', 'eva');
  assert(evaApplied.includes('IDENTITY LOCK (EVA)') && evaApplied.includes('ROLE SPLIT'), 'applyPersonaPolicy(eva) embeds Eva identity lock + role split');
  const adamApplied = applyPersonaPolicy('base', 'adam');
  assert(adamApplied.includes('IDENTITY LOCK (ADAM)') && adamApplied.includes('ROLE SPLIT'), 'applyPersonaPolicy(adam) embeds Adam identity lock + role split');
  assert(applyPersonaPolicy('base').includes('ROLE SPLIT') && !applyPersonaPolicy('base').includes('IDENTITY LOCK'), 'neutral applyPersonaPolicy appends role split only');
  assert(applyLocalePolicy('base', 'eva').includes('IDENTITY LOCK (EVA)'), 'applyLocalePolicy with persona eva embeds identity lock');
  assert(applyLocalePolicy('base').includes('ROLE SPLIT') && !applyLocalePolicy('base').includes('IDENTITY LOCK'), 'applyLocalePolicy without persona: role split, no identity lock (backwards compat)');
  assert(!EVA_IDENTITY_RULE.includes('RUB') && !ADAM_IDENTITY_RULE.includes('RUB'), 'persona rules contain no rubles');

  console.log(passed ? '  LanguagePolicy: ALL PASS' : '  LanguagePolicy: FAILURES');
  return passed;
}
