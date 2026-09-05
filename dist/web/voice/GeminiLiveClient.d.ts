import { VoicePersonaId } from '../../plugins/voice/VoicePluginConfig.js';
import { AudioPCMPlayer, AudioPCMRecorder } from './AudioPCMStreamer.js';
export interface LiveClientOptions {
    apiKey: string;
    model?: string;
    endpoint?: string;
    persona?: VoicePersonaId;
    onTranscript?: (role: 'user' | 'model', text: string) => void;
    onStatusChange?: (status: 'disconnected' | 'connecting' | 'connected' | 'listening' | 'speaking' | 'error', detail?: string) => void;
    onPersonaChange?: (persona: VoicePersonaId) => void;
}
export declare class GeminiLiveClient {
    private ws;
    private apiKey;
    private model;
    private endpoint;
    private persona;
    private recorder;
    private player;
    private isConnected;
    private isConnecting;
    private isMicActive;
    private onTranscript?;
    private onStatusChange?;
    private onPersonaChange?;
    constructor(options: LiveClientOptions);
    getRecorder(): AudioPCMRecorder;
    getPlayer(): AudioPCMPlayer;
    getActivePersona(): VoicePersonaId;
    getIsConnected(): boolean;
    getIsMicActive(): boolean;
    setApiKey(key: string): void;
    /**
     * Connects to the Gemini Live WebSocket endpoint and sends initial Setup message.
     */
    connect(): Promise<void>;
    /**
     * Sends initial Setup payload selecting the persona's voice and character system prompt.
     */
    private sendSetup;
    /**
     * Switch persona (Eva ♀ / Adam ♂) dynamically.
     */
    switchPersona(newPersona: VoicePersonaId): Promise<void>;
    /**
     * Starts microphone PCM streaming.
     */
    startMic(): Promise<void>;
    /**
     * Stops microphone PCM streaming.
     */
    stopMic(): void;
    toggleMic(): Promise<void> | void;
    /**
     * Sends a 16kHz PCM audio chunk to Gemini Live.
     */
    private sendAudioChunk;
    /**
     * Sends a user text turn over the live connection.
     */
    sendText(text: string): void;
    /**
     * Handles incoming WebSocket messages from Google Gemini Live API.
     */
    private handleServerMessage;
    /**
     * Detects spoken triggers for dynamic character handoff ("Ева", "Адам").
     */
    private checkVoicePersonaTrigger;
    disconnect(): void;
    destroy(): void;
}
