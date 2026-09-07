import type { SiteConfig, MeshHealth } from './config.js';
import type { I18n } from './i18n.js';
/**
 * EVALINE ECOSYSTEM MESH — navigation renderer.
 * Produces terminal-style HTML strings for mesh node listing,
 * footer, and health bar. Pure string output, no DOM manipulation.
 */
export declare class Nav {
    private cfg;
    private i18n;
    constructor(cfg: SiteConfig, i18n: I18n);
    /** Build the mesh node listing as a terminal <pre> block. */
    render(): string;
    /** Render the mesh footer string. */
    renderFooter(): string;
    /**
     * Render a health status bar from a MeshHealth snapshot.
     * Never throws — returns a safe fallback string on any error.
     */
    renderHealthBar(health: MeshHealth): string;
}
