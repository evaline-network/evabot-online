import http from 'node:http';
import { VoicePersonaId, VoicePluginSettings } from './VoicePluginConfig.js';
export declare class VoiceController {
    private static settings;
    static getSettings(): VoicePluginSettings;
    static isEnabled(): boolean;
    static setEnabled(enabled: boolean): void;
    static setActivePersona(persona: VoicePersonaId): void;
    static handleRequest(req: http.IncomingMessage, res: http.ServerResponse, pathname: string): Promise<boolean>;
    private static parseJsonBody;
}
