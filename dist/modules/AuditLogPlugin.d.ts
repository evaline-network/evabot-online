import { IEvaBotPlugin } from '../plugins/IEvaBotPlugin.js';
import { Language } from '../core/Types.js';
export declare class AuditLogPlugin implements IEvaBotPlugin {
    id: string;
    name: string;
    version: string;
    screenId: string;
    tabTitle: Record<Language, string>;
    init(manager: any): void;
    render(lang: Language): string;
}
