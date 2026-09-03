import { IEvaBotPlugin } from '../plugins/IEvaBotPlugin.js';
import { Language } from '../core/Types.js';
export declare class MarkdownLivePlugin implements IEvaBotPlugin {
    id: string;
    name: string;
    version: string;
    screenId: string;
    tabTitle: Record<Language, string>;
    private templateEn;
    init(manager: any): void;
    render(lang: Language): string;
    private escapeHtml;
}
