/**
 * LocalePolicy — Единая локальная политика EvaLine / EvaBot.
 *
 * Проецирует официальную позицию проекта: система базируется в Украине.
 * Запрещены любые упоминания РФ, русского языка и рубля.
 * Разрешённые языки: английский (EN), украинский (UK).
 * Разрешённые валюты: USD ($), EUR (€), гривна (UAH / ₴).
 */

export const LOCALE_POLICY = {
  country: 'Ukraine',
  city: 'Odesa',
  countryCode: 'UA',
  primaryLanguages: ['en', 'uk', 'ru'],
  supportedCurrencies: ['USD', 'EUR', 'UAH'],
  displayCurrencies: ['USD', 'EUR'],
  forbiddenTerms: [
    'Russia', 'Russian Federation', 'RUB', 'rubles', 'ruble', '₽',
    'россия', 'рф', 'москва', 'российский', 'российские',
  ],
  systemInstructionSuffix:
    'LOCALE POLICY: This project is based in Odesa, Ukraine. You must never reference, mention, or imply Russia, the Russian Federation, ' +
    'Russian currency, Russian goods, products, manufacturers, brands, companies, or services. All ties to the aggressor state are strictly banned. ' +
    'Supported languages are Ukrainian, English, and Russian. ' +
    'Supported currencies are the Ukrainian hryvnia (UAH / ₴), USD ($), and EUR (€). Russian currency is strictly prohibited. ' +
    'All financial figures, quotas, and pricing estimates must strictly be in USD ($) or EUR (€).',
} as const;

/**
 * Appends the locale policy to any system prompt / instruction.
 * Ensures every LLM agent (solo/broadcast/dialogue/consilium and all roles)
 * enforces the same Ukraine-based rule set.
 */
export function applyLocalePolicy(systemPrompt: string): string {
  return `${systemPrompt}\n${LOCALE_POLICY.systemInstructionSuffix}`.trim();
}
