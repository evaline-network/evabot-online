import type { SiteConfig } from './config.js';

/**
 * Theme engine: manages the terminal look & feel.
 * Default is NOCSS (pure terminal, structural <pre> text). Toggling to CSS mode
 * injects a minimal inline stylesheet that keeps the same linear layout but adds
 * colors, spacing and responsive grid behaviour.
 * This keeps every node independent: it never depends on external CDNs.
 */
export class Theme {
  enabled = false;

  constructor(private cfg: SiteConfig) {
    const saved = localStorage.getItem('nocss');
    // NOCSS is the default (no saved value) — pure terminal experience.
    this.enabled = saved === null ? true : saved === '1';
    this.apply();
  }

  toggle(): boolean {
    this.enabled = !this.enabled;
    localStorage.setItem('nocss', this.enabled ? '1' : '0');
    this.apply();
    return this.enabled;
  }

  apply(): void {
    const style = document.getElementById('main-style') as HTMLStyleElement | null;
    if (style) {
      style.disabled = this.enabled; // disable <style> in NOCSS mode
    }
    let css = document.getElementById('core-theme-style') as HTMLStyleElement | null;
    if (!this.enabled) {
      if (css) css.remove();
      return;
    }
    if (!css) {
      css = document.createElement('style');
      css.id = 'core-theme-style';
      document.head.appendChild(css);
    }
    const accent = this.cfg.accent || '#3fb950';
    css.textContent = `
      html{font-size:16px;}
      html,body{background:#0d1117;color:#c9d1d9;font-family:'Roboto',sans-serif;
        margin:0;padding:12px 20px;line-height:1.45;width:100%;max-width:100%;overflow-x:hidden;}
      a{color:#58a6ff;text-decoration:none;} a:hover{text-decoration:underline;color:#79c0ff;}
      button{font-family:inherit;font-size:0.75rem;background:#21262d;color:#c9d1d9;border:1px solid #30363d;
        padding:5px 10px;cursor:pointer;border-radius:4px;}
      button:hover{background:#30363d;color:#fff;}
      button.active{background:#238636;border-color:#2ea043;color:#fff;}
      .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;width:100%;}
      .live-dot{color:${accent};animation:pulse-dot 2s infinite ease-in-out;}
      @keyframes pulse-dot{0%,100%{opacity:1;text-shadow:0 0 4px ${accent};}50%{opacity:.3;text-shadow:none;}}
      .spinner{color:#58a6ff;}
      pre,code{font-family:'Roboto Mono','Roboto',monospace;}
      pre{white-space:pre-wrap;word-break:break-word;background:transparent;margin:0 0 10px 0;font-size:0.8125rem;width:100%;}
      hr{border:none;border-top:1px solid #30363d;margin:12px 0;}
      .ok{color:${accent};font-weight:bold;}
      .dim{color:#8b949e;}
      @media(max-width:768px){.grid-2{grid-template-columns:1fr;}body{padding:8px 10px;font-size:0.75rem;}}
    `;
  }

  /** Returns the standard NOCSS toggle label based on state + language. */
  label(onText: string, offText: string): string {
    return this.enabled ? onText : offText;
  }
}
