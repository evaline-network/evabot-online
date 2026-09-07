/**
 * VoiceVisualizer — High-tech cybernetic audio visualizer for EvaBot Voice Module
 */
export declare class VoiceVisualizer {
    private canvas;
    private ctx;
    private animationId;
    private recorderAnalyser;
    private playerAnalyser;
    private mode;
    private personaTheme;
    constructor(canvas: HTMLCanvasElement);
    setAnalysers(recorder: AnalyserNode | null, player: AnalyserNode | null): void;
    setMode(mode: 'idle' | 'listening' | 'speaking'): void;
    setPersonaTheme(theme: 'eva' | 'adam'): void;
    start(): void;
    stop(): void;
    private clear;
    private draw;
}
