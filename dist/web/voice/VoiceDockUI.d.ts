import { VoicePersonaId } from '../../plugins/voice/VoicePluginConfig.js';
export declare class VoiceDockUI {
    private container;
    private client;
    private visualizer;
    private canvas;
    private isEnabled;
    private activePersona;
    private currentApiKey;
    private transcriptEntries;
    constructor();
    init(): Promise<void>;
    setApiKey(key: string): void;
    setPersona(persona: VoicePersonaId): void;
    togglePlugin(enabled?: boolean): void;
    private render;
    private setupEventListeners;
    private handleMicButtonClick;
    private initClient;
    private handleStatusChange;
    private updateStatusOverlay;
    private updatePersonaButtons;
    private appendTranscript;
    private escapeHtml;
    destroy(): void;
}
