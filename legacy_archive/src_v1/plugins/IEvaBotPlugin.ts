import { Language } from '../core/Types.js';

export interface IEvaBotPlugin {
  id: string;
  name: string;
  version: string;
  screenId: string;
  tabTitle: Record<Language, string>;

  /**
   * Called when the plugin is registered with the system
   */
  init(manager: any): void;

  /**
   * Renders the NO-CSS HTML content for this plugin's screen
   */
  render(lang: Language): string;

  /**
   * Optional post-render DOM event listener binding
   */
  bindEvents?(lang: Language): void;

  /**
   * Optional event handler for cross-plugin events
   */
  handleEvent?(event: string, payload?: any): void;
}
