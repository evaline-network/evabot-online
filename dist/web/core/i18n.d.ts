import type { Lang } from './config.js';
export type Glossary = Record<string, string>;
/**
 * Unified trilingual (EN/UK/RU) dictionary shared by every node via the core
 * bundle. Nodes may extend with their own keys; core keys are merged on top.
 */
export declare const CORE_GLOSSARY: Record<Lang, Glossary>;
export declare class I18n {
    private lang;
    private extra;
    constructor(extra?: Record<Lang, Glossary>);
    private resolveInitial;
    getLang(): Lang;
    setLang(lang: Lang): void;
    t(key: string): string;
    /** Applies translateable keys found on elements with [data-i18n]. */
    applyToDom(root?: ParentNode): void;
}
