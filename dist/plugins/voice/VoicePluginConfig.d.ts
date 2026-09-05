export type VoicePersonaId = 'eva' | 'adam' | 'auto';
export type GeminiVoiceName = 'Aoede' | 'Fenrir' | 'Puck' | 'Charon' | 'Kore';
export interface VoicePersonaSpec {
    id: VoicePersonaId;
    name: string;
    gender: 'female' | 'male' | 'adaptive';
    voiceName: GeminiVoiceName;
    title: string;
    role: string;
    description: string;
    systemPrompt: string;
}
export interface VoicePluginSettings {
    enabled: boolean;
    model: string;
    endpoint: string;
    sampleRateInput: number;
    sampleRateOutput: number;
    activePersona: VoicePersonaId;
    supportedLanguages: string[];
}
export declare const VOICE_PERSONAS: Record<'eva' | 'adam', VoicePersonaSpec>;
export declare const AUTO_PERSONA_PROMPT: string;
export declare const DEFAULT_VOICE_PLUGIN_CONFIG: VoicePluginSettings;
