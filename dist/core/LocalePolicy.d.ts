/**
 * LocalePolicy — Единая локальная политика EvaLine / EvaBot.
 *
 * Проецирует официальную позицию проекта: система базируется в Украине.
 * Запрещены любые упоминания РФ, русского языка и рубля.
 * Разрешённые языки: английский (EN), украинский (UK).
 * Разрешённые валюты: USD ($), EUR (€), гривна (UAH / ₴).
 */
export declare const LOCALE_POLICY: {
    readonly country: "Ukraine";
    readonly city: "Odesa";
    readonly countryCode: "UA";
    readonly primaryLanguages: readonly ["en", "uk", "ru"];
    readonly supportedCurrencies: readonly ["USD", "EUR", "UAH"];
    readonly displayCurrencies: readonly ["USD", "EUR"];
    readonly forbiddenTerms: readonly ["Russia", "Russian Federation", "RUB", "rubles", "ruble", "₽", "россия", "рф", "москва", "российский", "российские"];
    readonly systemInstructionSuffix: string;
};
/**
 * Appends the locale policy to any system prompt / instruction.
 * Ensures every LLM agent (solo/broadcast/dialogue/consilium and all roles)
 * enforces the same Ukraine-based rule set.
 */
export declare function applyLocalePolicy(systemPrompt: string): string;
