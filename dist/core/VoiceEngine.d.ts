import { Language } from './Types.js';
export declare class VoiceEngine {
    private static instance;
    static getInstance(): VoiceEngine;
    speak(text: string, lang: Language, onEnd?: () => void): void;
    stop(): void;
}
