/**
 * VoiceVisualizer — High-tech cybernetic audio visualizer for EvaBot Voice Module
 */
export class VoiceVisualizer {
    canvas;
    ctx;
    animationId = null;
    recorderAnalyser = null;
    playerAnalyser = null;
    mode = 'idle';
    personaTheme = 'eva';
    constructor(canvas) {
        this.canvas = canvas;
        const context = canvas.getContext('2d');
        if (!context)
            throw new Error('Could not obtain 2D canvas context');
        this.ctx = context;
    }
    setAnalysers(recorder, player) {
        this.recorderAnalyser = recorder;
        this.playerAnalyser = player;
    }
    setMode(mode) {
        this.mode = mode;
    }
    setPersonaTheme(theme) {
        this.personaTheme = theme;
    }
    start() {
        if (this.animationId !== null)
            return;
        const render = () => {
            this.draw();
            this.animationId = requestAnimationFrame(render);
        };
        this.animationId = requestAnimationFrame(render);
    }
    stop() {
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.clear();
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    draw() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerY = height / 2;
        this.ctx.fillStyle = 'rgba(10, 15, 20, 0.35)';
        this.ctx.fillRect(0, 0, width, height);
        let activeAnalyser = null;
        if (this.mode === 'listening') {
            activeAnalyser = this.recorderAnalyser;
        }
        else if (this.mode === 'speaking') {
            activeAnalyser = this.playerAnalyser;
        }
        if (!activeAnalyser || this.mode === 'idle') {
            // Draw subtle breathing cyber grid line
            const time = Date.now() * 0.003;
            const glowColor = this.personaTheme === 'eva' ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 255, 136, 0.4)';
            this.ctx.beginPath();
            this.ctx.strokeStyle = glowColor;
            this.ctx.lineWidth = 1.5;
            for (let x = 0; x < width; x += 4) {
                const y = centerY + Math.sin(x * 0.05 + time) * 3;
                if (x === 0)
                    this.ctx.moveTo(x, y);
                else
                    this.ctx.lineTo(x, y);
            }
            this.ctx.stroke();
            return;
        }
        const bufferLength = activeAnalyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        activeAnalyser.getByteFrequencyData(dataArray);
        const barCount = 32;
        const barWidth = (width / barCount) - 2;
        const step = Math.floor(bufferLength / barCount);
        const primaryColor = this.mode === 'listening'
            ? 'rgba(0, 240, 255, 0.85)' // Cyan for user listening
            : this.personaTheme === 'eva'
                ? 'rgba(255, 0, 128, 0.85)' // Magenta/Pink for Eva
                : 'rgba(0, 255, 136, 0.85)'; // Cyber Green for Adam
        const secondaryGlow = this.mode === 'listening'
            ? 'rgba(0, 240, 255, 0.3)'
            : this.personaTheme === 'eva'
                ? 'rgba(255, 0, 128, 0.3)'
                : 'rgba(0, 255, 136, 0.3)';
        for (let i = 0; i < barCount; i++) {
            const value = dataArray[i * step] || 0;
            const percent = value / 255;
            const barHeight = Math.max(4, percent * (height * 0.85));
            const x = i * (barWidth + 2);
            const y = centerY - barHeight / 2;
            // Outer glow
            this.ctx.fillStyle = secondaryGlow;
            this.ctx.fillRect(x - 1, y - 2, barWidth + 2, barHeight + 4);
            // Core bar
            this.ctx.fillStyle = primaryColor;
            this.ctx.fillRect(x, y, barWidth, barHeight);
        }
    }
}
