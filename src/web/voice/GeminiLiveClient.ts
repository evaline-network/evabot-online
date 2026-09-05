import {
  LiveClientMessage,
  LiveServerMessage,
} from '../../plugins/voice/GeminiLiveProtocol.js';
import {
  VOICE_PERSONAS,
  VoicePersonaId,
} from '../../plugins/voice/VoicePluginConfig.js';
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

export class GeminiLiveClient {
  private ws: WebSocket | null = null;
  private apiKey: string;
  private model: string;
  private endpoint: string;
  private persona: VoicePersonaId;
  private recorder: AudioPCMRecorder;
  private player: AudioPCMPlayer;
  private isConnected: boolean = false;
  private isConnecting: boolean = false;
  private isMicActive: boolean = false;

  private onTranscript?: (role: 'user' | 'model', text: string) => void;
  private onStatusChange?: (status: 'disconnected' | 'connecting' | 'connected' | 'listening' | 'speaking' | 'error', detail?: string) => void;
  private onPersonaChange?: (persona: VoicePersonaId) => void;

  constructor(options: LiveClientOptions) {
    this.apiKey = options.apiKey;
    this.model = options.model || 'models/gemini-2.0-flash-exp';
    this.endpoint = options.endpoint || 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent';
    this.persona = options.persona || 'eva';
    this.onTranscript = options.onTranscript;
    this.onStatusChange = options.onStatusChange;
    this.onPersonaChange = options.onPersonaChange;

    this.recorder = new AudioPCMRecorder();
    this.player = new AudioPCMPlayer((isPlaying) => {
      if (isPlaying) {
        this.onStatusChange?.('speaking');
      } else if (this.isMicActive) {
        this.onStatusChange?.('listening');
      } else if (this.isConnected) {
        this.onStatusChange?.('connected');
      }
    });
  }

  public getRecorder(): AudioPCMRecorder {
    return this.recorder;
  }

  public getPlayer(): AudioPCMPlayer {
    return this.player;
  }

  public getActivePersona(): VoicePersonaId {
    return this.persona;
  }

  public getIsConnected(): boolean {
    return this.isConnected;
  }

  public getIsMicActive(): boolean {
    return this.isMicActive;
  }

  public setApiKey(key: string): void {
    this.apiKey = key;
  }

  /**
   * Connects to the Gemini Live WebSocket endpoint and sends initial Setup message.
   */
  public async connect(): Promise<void> {
    if (this.isConnected || this.isConnecting) return;
    if (!this.apiKey) {
      this.onStatusChange?.('error', 'Missing Gemini API Key');
      throw new Error('Gemini API key is required to connect to Gemini Live.');
    }

    this.isConnecting = true;
    this.onStatusChange?.('connecting');

    const wsUrl = `${this.endpoint}?key=${encodeURIComponent(this.apiKey)}`;

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          this.isConnected = true;
          this.isConnecting = false;
          this.sendSetup();
          this.onStatusChange?.('connected');
          resolve();
        };

        this.ws.onmessage = async (event: MessageEvent) => {
          let textData = '';
          if (typeof event.data === 'string') {
            textData = event.data;
          } else if (event.data instanceof Blob) {
            textData = await event.data.text();
          }

          if (textData) {
            this.handleServerMessage(textData);
          }
        };

        this.ws.onerror = (err) => {
          console.error('[GeminiLiveClient] WebSocket error:', err);
          this.isConnecting = false;
          this.onStatusChange?.('error', 'Live WebSocket Error');
          reject(err);
        };

        this.ws.onclose = (event) => {
          this.isConnected = false;
          this.isConnecting = false;
          this.stopMic();
          this.player.stop();
          this.onStatusChange?.('disconnected', `Closed (code: ${event.code})`);
        };
      } catch (e: any) {
        this.isConnecting = false;
        this.onStatusChange?.('error', e.message || 'Connection failed');
        reject(e);
      }
    });
  }

  /**
   * Sends initial Setup payload selecting the persona's voice and character system prompt.
   */
  private sendSetup(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const personaKey = this.persona === 'adam' ? 'adam' : 'eva';
    const personaSpec = VOICE_PERSONAS[personaKey];

    const setupMsg: LiveClientMessage = {
      setup: {
        model: this.model,
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: personaSpec.voiceName,
              },
            },
          },
          temperature: 0.7,
        },
        systemInstruction: {
          parts: [{ text: personaSpec.systemPrompt }],
        },
      },
    };

    this.ws.send(JSON.stringify(setupMsg));
  }

  /**
   * Switch persona (Eva ♀ / Adam ♂) dynamically.
   */
  public async switchPersona(newPersona: VoicePersonaId): Promise<void> {
    if (this.persona === newPersona) return;
    this.persona = newPersona;
    this.onPersonaChange?.(newPersona);

    // If currently connected, reconnect to apply new voice configuration
    if (this.isConnected) {
      const wasMicActive = this.isMicActive;
      this.disconnect();
      await this.connect();
      if (wasMicActive) {
        await this.startMic();
      }
    }
  }

  /**
   * Starts microphone PCM streaming.
   */
  public async startMic(): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }

    await this.recorder.start((base64Chunk: string) => {
      this.sendAudioChunk(base64Chunk);
    });

    this.isMicActive = true;
    this.onStatusChange?.('listening');
  }

  /**
   * Stops microphone PCM streaming.
   */
  public stopMic(): void {
    this.recorder.stop();
    this.isMicActive = false;
    if (this.isConnected) {
      this.onStatusChange?.('connected');
    }
  }

  public toggleMic(): Promise<void> | void {
    if (this.isMicActive) {
      this.stopMic();
    } else {
      return this.startMic();
    }
  }

  /**
   * Sends a 16kHz PCM audio chunk to Gemini Live.
   */
  private sendAudioChunk(base64Pcm: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const chunkMsg: LiveClientMessage = {
      realtimeInput: {
        mediaChunks: [
          {
            mimeType: 'audio/pcm;rate=16000',
            data: base64Pcm,
          },
        ],
      },
    };

    this.ws.send(JSON.stringify(chunkMsg));
  }

  /**
   * Sends a user text turn over the live connection.
   */
  public sendText(text: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    // Check for persona invocations in text
    this.checkVoicePersonaTrigger(text);

    const textMsg: LiveClientMessage = {
      clientContent: {
        turns: [
          {
            role: 'user',
            parts: [{ text }],
          },
        ],
        turnComplete: true,
      },
    };

    this.ws.send(JSON.stringify(textMsg));
    this.onTranscript?.('user', text);
  }

  /**
   * Handles incoming WebSocket messages from Google Gemini Live API.
   */
  private handleServerMessage(jsonText: string): void {
    try {
      const msg: LiveServerMessage = JSON.parse(jsonText);

      if (msg.error) {
        console.error('[GeminiLiveClient] Server error:', msg.error);
        this.onStatusChange?.('error', msg.error.message || 'Gemini API Error');
        return;
      }

      if (msg.serverContent) {
        // Handle interruption (User barge-in)
        if (msg.serverContent.interrupted) {
          this.player.stop();
          return;
        }

        const modelTurn = msg.serverContent.modelTurn;
        if (modelTurn && modelTurn.parts) {
          for (const part of modelTurn.parts) {
            // Audio output from model
            if (part.inlineData && part.inlineData.data) {
              this.player.playChunk(part.inlineData.data);
            }
            // Text transcription / output from model
            if (part.text) {
              this.onTranscript?.('model', part.text);
              this.checkVoicePersonaTrigger(part.text);
            }
          }
        }
      }
    } catch (e) {
      console.warn('[GeminiLiveClient] Error parsing server message:', e);
    }
  }

  /**
   * Detects spoken triggers for dynamic character handoff ("Ева", "Адам").
   */
  private checkVoicePersonaTrigger(text: string): void {
    const lower = text.toLowerCase();
    if (this.persona !== 'adam' && (lower.includes('адам') || lower.includes('adam'))) {
      // Trigger switch to Adam
      setTimeout(() => this.switchPersona('adam'), 200);
    } else if (this.persona !== 'eva' && (lower.includes('ева') || lower.includes('єва') || lower.includes('eva'))) {
      // Trigger switch to Eva
      setTimeout(() => this.switchPersona('eva'), 200);
    }
  }

  public disconnect(): void {
    this.stopMic();
    this.player.stop();
    if (this.ws) {
      try {
        this.ws.close();
      } catch {
        // ignore
      }
      this.ws = null;
    }
    this.isConnected = false;
    this.isConnecting = false;
    this.onStatusChange?.('disconnected');
  }

  public destroy(): void {
    this.disconnect();
    this.recorder.stop();
    this.player.close();
  }
}
