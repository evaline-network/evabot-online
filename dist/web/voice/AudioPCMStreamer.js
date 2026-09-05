/**
 * AudioPCMStreamer — High-performance Web Audio API PCM capture & playback engine
 * Handles 16kHz linear PCM recording and 24kHz linear PCM playback with interruption support.
 */
export class AudioPCMRecorder {
    audioCtx = null;
    mediaStream = null;
    sourceNode = null;
    processorNode = null;
    isRecording = false;
    onChunkCallback = null;
    analyserNode = null;
    getAnalyser() {
        return this.analyserNode;
    }
    getIsRecording() {
        return this.isRecording;
    }
    async start(onChunk) {
        if (this.isRecording)
            return;
        this.onChunkCallback = onChunk;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        // Request 16000Hz context or allow native with downsampling
        this.audioCtx = new AudioContextClass({ sampleRate: 16000 });
        if (this.audioCtx.state === 'suspended') {
            await this.audioCtx.resume();
        }
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                channelCount: 1,
                sampleRate: 16000,
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
            },
        });
        this.sourceNode = this.audioCtx.createMediaStreamSource(this.mediaStream);
        this.analyserNode = this.audioCtx.createAnalyser();
        this.analyserNode.fftSize = 256;
        // Use 2048 or 4096 buffer size for balanced latency (~128-256ms chunk)
        const bufferSize = 4096;
        this.processorNode = this.audioCtx.createScriptProcessor(bufferSize, 1, 1);
        this.processorNode.onaudioprocess = (e) => {
            if (!this.isRecording || !this.onChunkCallback)
                return;
            const inputData = e.inputBuffer.getChannelData(0);
            // Downsample / convert Float32 to 16-bit Int16 PCM Little-Endian
            const pcm16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
                const s = Math.max(-1, Math.min(1, inputData[i]));
                pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
            }
            // Convert Int16Array to Base64
            const buffer = new Uint8Array(pcm16.buffer);
            let binary = '';
            const len = buffer.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(buffer[i]);
            }
            const base64 = btoa(binary);
            this.onChunkCallback(base64);
        };
        this.sourceNode.connect(this.analyserNode);
        this.sourceNode.connect(this.processorNode);
        this.processorNode.connect(this.audioCtx.destination);
        this.isRecording = true;
    }
    stop() {
        this.isRecording = false;
        this.onChunkCallback = null;
        if (this.processorNode) {
            this.processorNode.disconnect();
            this.processorNode.onaudioprocess = null;
            this.processorNode = null;
        }
        if (this.sourceNode) {
            this.sourceNode.disconnect();
            this.sourceNode = null;
        }
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach((track) => track.stop());
            this.mediaStream = null;
        }
        if (this.audioCtx && this.audioCtx.state !== 'closed') {
            this.audioCtx.close().catch(() => { });
            this.audioCtx = null;
        }
    }
}
export class AudioPCMPlayer {
    audioCtx = null;
    analyserNode = null;
    nextPlayTime = 0;
    isPlaying = false;
    activeSources = [];
    onPlaybackStateChange = null;
    constructor(onStateChange) {
        if (onStateChange)
            this.onPlaybackStateChange = onStateChange;
    }
    getAnalyser() {
        return this.analyserNode;
    }
    getIsPlaying() {
        return this.isPlaying;
    }
    initContext() {
        if (!this.audioCtx || this.audioCtx.state === 'closed') {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContextClass({ sampleRate: 24000 });
            this.analyserNode = this.audioCtx.createAnalyser();
            this.analyserNode.fftSize = 256;
            this.analyserNode.connect(this.audioCtx.destination);
            this.nextPlayTime = this.audioCtx.currentTime;
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume().catch(() => { });
        }
    }
    /**
     * Enqueues a base64 encoded 24kHz 16-bit linear PCM chunk for seamless audio playback.
     */
    playChunk(base64Pcm) {
        this.initContext();
        if (!this.audioCtx || !this.analyserNode)
            return;
        try {
            const binaryString = atob(base64Pcm);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            // Convert 16-bit PCM bytes to Float32 [-1.0, 1.0]
            const int16 = new Int16Array(bytes.buffer);
            const float32 = new Float32Array(int16.length);
            for (let i = 0; i < int16.length; i++) {
                float32[i] = int16[i] / 32768.0;
            }
            // Create AudioBuffer at 24000Hz mono
            const audioBuffer = this.audioCtx.createBuffer(1, float32.length, 24000);
            audioBuffer.getChannelData(0).set(float32);
            const source = this.audioCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(this.analyserNode);
            const currentTime = this.audioCtx.currentTime;
            // Schedule immediately or seamlessly behind preceding buffer
            const startTime = Math.max(currentTime, this.nextPlayTime);
            source.start(startTime);
            this.nextPlayTime = startTime + audioBuffer.duration;
            this.activeSources.push(source);
            if (!this.isPlaying) {
                this.isPlaying = true;
                this.onPlaybackStateChange?.(true);
            }
            source.onended = () => {
                const idx = this.activeSources.indexOf(source);
                if (idx !== -1) {
                    this.activeSources.splice(idx, 1);
                }
                if (this.activeSources.length === 0 && this.audioCtx && this.audioCtx.currentTime >= this.nextPlayTime - 0.05) {
                    this.isPlaying = false;
                    this.onPlaybackStateChange?.(false);
                }
            };
        }
        catch (e) {
            console.warn('Failed to decode/play PCM chunk:', e);
        }
    }
    /**
     * Immediately stops all active audio playback (Barge-in / Interruption).
     */
    stop() {
        for (const source of this.activeSources) {
            try {
                source.stop();
                source.disconnect();
            }
            catch {
                // already stopped
            }
        }
        this.activeSources = [];
        if (this.audioCtx) {
            this.nextPlayTime = this.audioCtx.currentTime;
        }
        if (this.isPlaying) {
            this.isPlaying = false;
            this.onPlaybackStateChange?.(false);
        }
    }
    close() {
        this.stop();
        if (this.audioCtx && this.audioCtx.state !== 'closed') {
            this.audioCtx.close().catch(() => { });
            this.audioCtx = null;
        }
    }
}
