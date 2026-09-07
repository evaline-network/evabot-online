export type Lang = 'en' | 'uk' | 'ru';
/**
 * Site node configuration. Each independent node (domain) carries a single
 * `site.config.js` that describes its identity, modules, i18n and theme.
 * The core engine reads `window.__SITE_CONFIG__` and renders accordingly,
 * while remaining fully independent from other nodes.
 */
export interface SiteConfig {
    /** Unique node id, e.g. "evabot.online" */
    siteId: string;
    /** Short machine handle, e.g. "evabot" */
    siteKey: string;
    title: string;
    tagline: string;
    /** Functional specialization label (EN/UK/RU) */
    section: Record<Lang, string>;
    /** Ordered list of mesh nodes for navigation (links + labels per lang) */
    nodes: Array<{
        id: string;
        url: string;
        label: Record<Lang, string>;
    }>;
    /** Which modules are enabled for this node */
    modules: {
        worklog: boolean;
        hopTest: boolean;
        telemetry: boolean;
        chat: boolean;
    };
    /** Optional accent color in hex for CSS mode */
    accent?: string;
    /** API base used for /api/* calls (relative by default) */
    apiBase?: string;
}
export interface MeshHealth {
    nodes: Array<{
        id: string;
        url: string;
        status: 'online' | 'offline' | 'unknown';
        latencyMs?: number;
    }>;
    checkedAt: number;
}
export declare function defaultConfig(): SiteConfig;
/** Reads the global site config injected by the host HTML. */
export declare function loadSiteConfig(): SiteConfig;
