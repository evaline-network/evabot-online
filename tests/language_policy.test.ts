import {
  LOCALE_POLICY,
  LANGUAGE_MIRRORING_RULE,
  detectMessageLanguage,
  languageLockInstruction,
  applyLocalePolicy,
} from '../src/core/LocalePolicy.js';
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

  console.log(passed ? '  LanguagePolicy: ALL PASS' : '  LanguagePolicy: FAILURES');
  return passed;
}
