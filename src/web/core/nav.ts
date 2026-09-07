import type { SiteConfig, MeshHealth } from './config.js';
import type { I18n } from './i18n.js';

/**
 * EVALINE ECOSYSTEM MESH — navigation renderer.
 * Produces terminal-style HTML strings for mesh node listing,
 * footer, and health bar. Pure string output, no DOM manipulation.
 */
export class Nav {
  private cfg: SiteConfig;
  private i18n: I18n;

  constructor(cfg: SiteConfig, i18n: I18n) {
    this.cfg = cfg;
    this.i18n = i18n;
  }

  /** Build the mesh node listing as a terminal <pre> block. */
  render(): string {
    const title = this.i18n.t('mesh.title');
    const currentLabel = this.i18n.t('mesh.current');

    const lines = this.cfg.nodes.map((node, idx) => {
      const num = idx + 1;
      if (node.id === this.cfg.siteId) {
        return `  -> [${num}] <strong>${node.label[this.i18n.getLang()]}</strong> <em>${currentLabel}</em>`;
      }
      return `  -> [${num}] <a href="${node.url}">${node.label[this.i18n.getLang()]}</a>`;
    });

    return `<pre>\n${title}\n${lines.join('\n')}\n</pre>`;
  }

  /** Render the mesh footer string. */
  renderFooter(): string {
    return this.i18n.t('nav.footer');
  }

  /**
   * Render a health status bar from a MeshHealth snapshot.
   * Never throws — returns a safe fallback string on any error.
   */
  renderHealthBar(health: MeshHealth): string {
    try {
      const entries = (health.nodes || []).map((node) => {
        const status = node.status === 'online' ? 'OK' : 'OFFLINE';
        const cls = node.status === 'online' ? 'ok' : 'dim';
        return `  <span class="${cls}">${node.id}: ${status}</span>`;
      });

      return entries.join('\n');
    } catch {
      return '  <span class="dim">HEALTH: UNAVAILABLE</span>';
    }
  }
}
