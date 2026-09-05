import { GeminiLiveClient } from './GeminiLiveClient.js';
import { VoiceVisualizer } from './VoiceVisualizer.js';
export class VoiceDockUI {
    container = null;
    client = null;
    visualizer = null;
    canvas = null;
    isEnabled = true;
    activePersona = 'eva';
    currentApiKey = '';
    transcriptEntries = [];
    constructor() {
        this.currentApiKey = localStorage.getItem('evabot_gemini_key') || '';
    }
    async init() {
        // 1. Fetch server voice config
        try {
            const res = await fetch('/api/voice/config');
            if (res.ok) {
                const data = await res.json();
                this.isEnabled = data.enabled ?? true;
                if (!this.currentApiKey && data.apiKey) {
                    this.currentApiKey = data.apiKey;
                }
                if (data.activePersona) {
                    this.activePersona = data.activePersona;
                }
            }
        }
        catch (e) {
            console.warn('[VoiceDockUI] Could not fetch voice config from server:', e);
        }
        this.render();
        this.setupEventListeners();
    }
    setApiKey(key) {
        this.currentApiKey = key;
        if (this.client) {
            this.client.setApiKey(key);
        }
    }
    setPersona(persona) {
        this.activePersona = persona;
        this.updatePersonaButtons();
        if (this.client) {
            this.client.switchPersona(persona);
        }
        if (this.visualizer) {
            this.visualizer.setPersonaTheme(persona === 'adam' ? 'adam' : 'eva');
        }
    }
    togglePlugin(enabled) {
        this.isEnabled = typeof enabled === 'boolean' ? enabled : !this.isEnabled;
        // Sync with backend
        fetch('/api/voice/toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ enabled: this.isEnabled }),
        }).catch(() => { });
        const dock = document.getElementById('voice-live-dock');
        if (dock) {
            dock.style.display = this.isEnabled ? 'block' : 'none';
        }
        const toggleBtn = document.getElementById('voice-plugin-toggle-btn');
        if (toggleBtn) {
            toggleBtn.textContent = this.isEnabled ? '[ PLUGIN: ON 🟢 ]' : '[ PLUGIN: OFF ⚪ ]';
            toggleBtn.classList.toggle('active', this.isEnabled);
        }
        if (!this.isEnabled && this.client) {
            this.client.disconnect();
        }
    }
    render() {
        // Check if dock already exists
        let dock = document.getElementById('voice-live-dock');
        if (!dock) {
            dock = document.createElement('div');
            dock.id = 'voice-live-dock';
            dock.className = 'cyber-voice-dock';
            document.body.appendChild(dock);
        }
        this.container = dock;
        this.container.style.display = this.isEnabled ? 'block' : 'none';
        this.container.innerHTML = `
      <div class="voice-dock-header">
        <div class="voice-dock-title">
          <span class="voice-dock-pulse"></span>
          <span>GEMINI LIVE // NEURAL VOICE ENGINE</span>
          <span class="voice-dock-badge">v2.0 MULTIMODAL</span>
        </div>
        <div class="voice-dock-actions">
          <button id="voice-plugin-toggle-btn" class="voice-dock-btn small ${this.isEnabled ? 'active' : ''}">
            ${this.isEnabled ? '[ PLUGIN: ON 🟢 ]' : '[ PLUGIN: OFF ⚪ ]'}
          </button>
          <button id="voice-dock-minimize-btn" class="voice-dock-btn small">[ – ]</button>
        </div>
      </div>

      <div id="voice-dock-body" class="voice-dock-body">
        <div class="voice-persona-selector">
          <button id="voice-select-eva" class="persona-tab-btn ${this.activePersona === 'eva' ? 'active' : ''}">
            <span class="persona-indicator ♀"></span>
            <strong>EVA (Ева)</strong>
            <span class="persona-sub">Aoede • FrontEnd & UX</span>
          </button>
          <button id="voice-select-adam" class="persona-tab-btn ${this.activePersona === 'adam' ? 'active' : ''}">
            <span class="persona-indicator ♂"></span>
            <strong>ADAM (Адам)</strong>
            <span class="persona-sub">Fenrir • BackEnd & Cloud</span>
          </button>
        </div>

        <div class="voice-visualizer-container">
          <canvas id="voice-canvas" width="480" height="90"></canvas>
          <div id="voice-status-overlay" class="voice-status-overlay">READY TO CONNECT</div>
        </div>

        <div class="voice-controls-row">
          <button id="voice-main-mic-btn" class="voice-mic-btn">
            <span class="mic-icon">🎙️</span>
            <span id="voice-mic-label" class="mic-label">START VOICE STREAM</span>
            <span class="mic-shortcut">[Alt+V]</span>
          </button>
          <button id="voice-disconnect-btn" class="voice-dock-btn" style="display:none;">
            [ DISCONNECT ]
          </button>
        </div>

        <div class="voice-langs-bar">
          <span class="langs-label">LANGUAGES:</span>
          <span class="lang-tag">UK (Українська)</span>
          <span class="lang-tag">EN (English)</span>
          <span class="lang-tag">RU (Русский)</span>
          <span class="lang-tag">PL (Polski)</span>
          <span class="lang-tag">RO (Română)</span>
        </div>

        <div class="voice-transcript-wrapper">
          <div class="voice-transcript-title">LIVE NEURAL TRANSCRIPTION:</div>
          <div id="voice-transcript-stream" class="voice-transcript-stream">
            <div class="transcript-placeholder">Direct audio streaming ready. Press button or say "Ева" / "Адам" to speak.</div>
          </div>
        </div>
      </div>
    `;
        this.canvas = document.getElementById('voice-canvas');
        if (this.canvas) {
            this.visualizer = new VoiceVisualizer(this.canvas);
            this.visualizer.setPersonaTheme(this.activePersona === 'adam' ? 'adam' : 'eva');
            this.visualizer.start();
        }
    }
    setupEventListeners() {
        // Toggle plugin button
        document.getElementById('voice-plugin-toggle-btn')?.addEventListener('click', () => {
            this.togglePlugin();
        });
        // Minimize button
        const minBtn = document.getElementById('voice-dock-minimize-btn');
        const dockBody = document.getElementById('voice-dock-body');
        minBtn?.addEventListener('click', () => {
            if (dockBody) {
                const isCollapsed = dockBody.style.display === 'none';
                dockBody.style.display = isCollapsed ? 'block' : 'none';
                if (minBtn)
                    minBtn.textContent = isCollapsed ? '[ – ]' : '[ + ]';
            }
        });
        // Persona buttons
        document.getElementById('voice-select-eva')?.addEventListener('click', () => {
            this.setPersona('eva');
        });
        document.getElementById('voice-select-adam')?.addEventListener('click', () => {
            this.setPersona('adam');
        });
        // Main mic button
        const micBtn = document.getElementById('voice-main-mic-btn');
        micBtn?.addEventListener('click', () => {
            this.handleMicButtonClick();
        });
        // Disconnect button
        document.getElementById('voice-disconnect-btn')?.addEventListener('click', () => {
            if (this.client) {
                this.client.disconnect();
            }
        });
        // Keyboard shortcut: Alt + V
        window.addEventListener('keydown', (e) => {
            if (e.altKey && (e.key === 'v' || e.key === 'V')) {
                e.preventDefault();
                this.handleMicButtonClick();
            }
        });
    }
    async handleMicButtonClick() {
        if (!this.client) {
            await this.initClient();
        }
        if (!this.client)
            return;
        if (this.client.getIsMicActive()) {
            this.client.stopMic();
        }
        else {
            try {
                await this.client.startMic();
            }
            catch (err) {
                this.updateStatusOverlay(`Error: ${err.message || 'Microphone error'}`);
            }
        }
    }
    async initClient() {
        const apiKey = this.currentApiKey || localStorage.getItem('evabot_gemini_key') || '';
        if (!apiKey) {
            const promptKey = prompt('Enter Google Gemini API Key for Gemini Live Multimodal Voice (stored locally in browser):', '');
            if (promptKey && promptKey.trim()) {
                this.currentApiKey = promptKey.trim();
                localStorage.setItem('evabot_gemini_key', this.currentApiKey);
            }
            else {
                alert('Gemini API key is required to stream Gemini Live voice.');
                return;
            }
        }
        this.client = new GeminiLiveClient({
            apiKey: this.currentApiKey,
            persona: this.activePersona,
            onTranscript: (role, text) => {
                this.appendTranscript(role, text);
            },
            onStatusChange: (status, detail) => {
                this.handleStatusChange(status, detail);
            },
            onPersonaChange: (newPersona) => {
                this.activePersona = newPersona;
                this.updatePersonaButtons();
                if (this.visualizer) {
                    this.visualizer.setPersonaTheme(newPersona === 'adam' ? 'adam' : 'eva');
                }
            },
        });
        if (this.visualizer) {
            this.visualizer.setAnalysers(this.client.getRecorder().getAnalyser(), this.client.getPlayer().getAnalyser());
        }
    }
    handleStatusChange(status, detail) {
        const overlay = document.getElementById('voice-status-overlay');
        const micBtn = document.getElementById('voice-main-mic-btn');
        const micLabel = document.getElementById('voice-mic-label');
        const disconnectBtn = document.getElementById('voice-disconnect-btn');
        if (disconnectBtn) {
            disconnectBtn.style.display = status !== 'disconnected' ? 'inline-block' : 'none';
        }
        if (this.visualizer) {
            if (status === 'listening') {
                this.visualizer.setMode('listening');
            }
            else if (status === 'speaking') {
                this.visualizer.setMode('speaking');
            }
            else {
                this.visualizer.setMode('idle');
            }
        }
        switch (status) {
            case 'connecting':
                if (overlay)
                    overlay.textContent = 'CONNECTING TO GEMINI LIVE...';
                if (micBtn)
                    micBtn.classList.remove('active', 'speaking');
                if (micLabel)
                    micLabel.textContent = 'CONNECTING...';
                break;
            case 'connected':
                if (overlay)
                    overlay.textContent = `LIVE CONNECTED • ${this.activePersona.toUpperCase()}`;
                if (micBtn)
                    micBtn.classList.remove('active', 'speaking');
                if (micLabel)
                    micLabel.textContent = 'MUTE / TAP TO TALK';
                break;
            case 'listening':
                if (overlay)
                    overlay.textContent = 'LISTENING TO MICROPHONE...';
                if (micBtn) {
                    micBtn.classList.add('active');
                    micBtn.classList.remove('speaking');
                }
                if (micLabel)
                    micLabel.textContent = 'LIVE STREAMING [ACTIVE]';
                break;
            case 'speaking':
                const personaName = this.activePersona === 'adam' ? 'ADAM (♂)' : 'EVA (♀)';
                if (overlay)
                    overlay.textContent = `${personaName} IS SPEAKING...`;
                if (micBtn)
                    micBtn.classList.add('speaking');
                if (micLabel)
                    micLabel.textContent = `${personaName} TRANSMITTING`;
                break;
            case 'disconnected':
                if (overlay)
                    overlay.textContent = detail ? `DISCONNECTED: ${detail}` : 'OFFLINE • READY';
                if (micBtn)
                    micBtn.classList.remove('active', 'speaking');
                if (micLabel)
                    micLabel.textContent = 'START VOICE STREAM';
                break;
            case 'error':
                if (overlay)
                    overlay.textContent = `ERROR: ${detail || 'Unknown'}`;
                if (micBtn)
                    micBtn.classList.remove('active', 'speaking');
                if (micLabel)
                    micLabel.textContent = 'RETRY VOICE STREAM';
                break;
        }
    }
    updateStatusOverlay(text) {
        const overlay = document.getElementById('voice-status-overlay');
        if (overlay)
            overlay.textContent = text;
    }
    updatePersonaButtons() {
        const evaBtn = document.getElementById('voice-select-eva');
        const adamBtn = document.getElementById('voice-select-adam');
        if (evaBtn)
            evaBtn.classList.toggle('active', this.activePersona === 'eva');
        if (adamBtn)
            adamBtn.classList.toggle('active', this.activePersona === 'adam');
    }
    appendTranscript(role, text) {
        const stream = document.getElementById('voice-transcript-stream');
        if (!stream)
            return;
        const placeholder = stream.querySelector('.transcript-placeholder');
        if (placeholder) {
            placeholder.remove();
        }
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const line = document.createElement('div');
        line.className = `transcript-line ${role}`;
        const personaTag = role === 'model'
            ? (this.activePersona === 'adam' ? '[ADAM ♂]' : '[EVA ♀]')
            : '[YOU 🎙️]';
        line.innerHTML = `
      <span class="transcript-time">${time}</span>
      <strong class="transcript-tag">${personaTag}:</strong>
      <span class="transcript-text">${this.escapeHtml(text)}</span>
    `;
        stream.appendChild(line);
        stream.scrollTop = stream.scrollHeight;
    }
    escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    destroy() {
        if (this.client) {
            this.client.destroy();
            this.client = null;
        }
        if (this.visualizer) {
            this.visualizer.stop();
            this.visualizer = null;
        }
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
    }
}
