/**
 * AudioPCMStreamer — High-performance Web Audio API PCM capture & playback engine
 * Handles 16kHz linear PCM recording and 24kHz linear PCM playback with interruption support.
 */
export declare class AudioPCMRecorder {
    private audioCtx;
    private mediaStream;
    private sourceNode;
    private processorNode;
    private isRecording;
    private onChunkCallback;
    private analyserNode;
    getAnalyser(): AnalyserNode | null;
    getIsRecording(): boolean;
    start(onChunk: (base64Pcm16: string) => void): Promise<void>;
    stop(): void;
}
export declare class AudioPCMPlayer {
    private audioCtx;
    private analyserNode;
    private nextPlayTime;
    private isPlaying;
    private activeSources;
    private onPlaybackStateChange;
    constructor(onStateChange?: (isPlaying: boolean) => void);
    getAnalyser(): AnalyserNode | null;
    getIsPlaying(): boolean;
    private initContext;
    /**
     * Enqueues a base64 encoded 24kHz 16-bit linear PCM chunk for seamless audio playback.
     */
    playChunk(base64Pcm: string): void;
    /**
     * Immediately stops all active audio playback (Barge-in / Interruption).
     */
    stop(): void;
    close(): void;
}
