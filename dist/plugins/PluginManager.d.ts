import { IEvaBotPlugin } from './IEvaBotPlugin.js';
import { Language } from '../core/Types.js';
export declare class PluginManager {
    private plugins;
    private disabledPlugins;
    private currentLanguage;
    private activeScreenId;
    registerPlugin(plugin: IEvaBotPlugin): void;
    getPlugins(): IEvaBotPlugin[];
    getEnabledPlugins(): IEvaBotPlugin[];
    getPlugin(id: string): IEvaBotPlugin | undefined;
    isPluginEnabled(id: string): boolean;
    togglePluginState(id: string): void;
    setLanguage(lang: Language): void;
    getLanguage(): Language;
    setScreen(screenId: string): void;
    toggleAllAccordions(expand: boolean): void;
    renderPluginControlPanel(): string;
    renderNavTabs(): string;
    renderAll(): void;
}
