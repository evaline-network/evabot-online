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
  city: 'Chernomorsk',
  manufacturing: 'Chernomorsk, Promyslova st. 1, 62053, Ukraine',
  euHub: 'Bratislava, Obchodna 37, 81106, Slovakia',
  contacts: {
    phone: '+38 (067) 156 14 96',
    email: 'evaline.com.ua@gmail.com',
    domains: ['evaline.com.ua', 'eva-line.com'],
  },
  countryCode: 'UA',
  primaryLanguages: ['en', 'uk', 'ru'],
  supportedCurrencies: ['USD', 'EUR', 'UAH'],
  displayCurrencies: ['USD', 'EUR'],
  forbiddenTerms: [
    'Russia', 'Russian Federation', 'RUB', 'rubles', 'ruble', '₽',
    'россия', 'рф', 'москва', 'российский', 'российские',
  ],
  systemInstructionSuffix:
    'LOCALE POLICY: Company EvaLine manufacturing plant & headquarters are located in Chernomorsk, Ukraine (вул. Промислова, 1, 62053), ' +
    'with European office & logistics warehouse in Bratislava, Slovakia (81106 Bratislava, Obchodna 37). ' +
    'EvaLine is the premier Ukrainian full-cycle manufacturer of environmentally friendly polymer EVA materials (sheets, car mats, tatami, livestock mats, footwear, custom cutting). ' +
    'You must never reference, mention, or imply Russia, the Russian Federation, Russian currency, Russian goods, or services. All ties to the aggressor state are strictly banned. ' +
    'Supported languages are English, Ukrainian, and Russian. Supported currencies are UAH (₴), USD ($), and EUR (€). ' +
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
