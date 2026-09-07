import type { SiteConfig } from './config.js';
/**
 * Theme engine: manages the terminal look & feel.
 * Default is NOCSS (pure terminal, structural <pre> text). Toggling to CSS mode
 * injects a minimal inline stylesheet that keeps the same linear layout but adds
 * colors, spacing and responsive grid behaviour.
 * This keeps every node independent: it never depends on external CDNs.
 */
export declare class Theme {
    private cfg;
    enabled: boolean;
    constructor(cfg: SiteConfig);
    toggle(): boolean;
    apply(): void;
    /** Returns the standard NOCSS toggle label based on state + language. */
    label(onText: string, offText: string): string;
}
