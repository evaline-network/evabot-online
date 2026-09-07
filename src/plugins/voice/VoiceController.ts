import http from 'node:http';
import {
  DEFAULT_VOICE_PLUGIN_CONFIG,
  VOICE_PERSONAS,
  AUTO_PERSONA_PROMPT,
  VoicePersonaId,
  VoicePluginSettings,
} from './VoicePluginConfig.js';
import { Config } from '../../core/Config.js';
import { GoogleAuthProvider } from '../../core/GoogleAuthProvider.js';
import { logger } from '../../core/Logger.js';

export class VoiceController {
  private static settings: VoicePluginSettings = { ...DEFAULT_VOICE_PLUGIN_CONFIG };

  public static getSettings(): VoicePluginSettings {
    return this.settings;
  }

  public static isEnabled(): boolean {
    return this.settings.enabled;
  }

  public static setEnabled(enabled: boolean): void {
    this.settings.enabled = enabled;
    logger.info('VoiceController', `Voice Plugin enabled state set to: ${enabled}`);
  }

  public static setActivePersona(persona: VoicePersonaId): void {
    this.settings.activePersona = persona;
    logger.info('VoiceController', `Voice Plugin active persona set to: ${persona}`);
  }

  public static async handleRequest(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    pathname: string
  ): Promise<boolean> {
    if (!pathname.startsWith('/api/voice')) {
      return false;
    }

    const sendJson = (status: number, data: any) => {
      res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Gemini-Key',
      });
      res.end(JSON.stringify(data));
    };

    // 1. GET /api/voice/status
    if (pathname === '/api/voice/status' && req.method === 'GET') {
      const creds = await GoogleAuthProvider.getCredentials();
      sendJson(200, {
        enabled: this.settings.enabled,
        activePersona: this.settings.activePersona,
        model: this.settings.model,
        endpoint: this.settings.endpoint,
        personas: VOICE_PERSONAS,
        supportedLanguages: this.settings.supportedLanguages,
        hasServerKey: Boolean(creds || Config.geminiApiKey),
      });
      return true;
    }

    // 2. GET /api/voice/config
    if (pathname === '/api/voice/config' && req.method === 'GET') {
      const creds = await GoogleAuthProvider.getCredentials();
      const serverKey = (creds && creds.type === 'api_key') ? creds.token : Config.geminiApiKey;
      const activePersonaSpec = this.settings.activePersona === 'auto'
        ? null
        : VOICE_PERSONAS[this.settings.activePersona as 'eva' | 'adam'];

      sendJson(200, {
        enabled: this.settings.enabled,
        model: this.settings.model,
        endpoint: this.settings.endpoint,
        activePersona: this.settings.activePersona,
        sampleRateInput: this.settings.sampleRateInput,
        sampleRateOutput: this.settings.sampleRateOutput,
        apiKey: serverKey || '',
        systemInstruction: activePersonaSpec
          ? activePersonaSpec.systemPrompt
          : AUTO_PERSONA_PROMPT,
        voiceName: activePersonaSpec ? activePersonaSpec.voiceName : 'Aoede',
        personas: VOICE_PERSONAS,
      });
      return true;
    }

    // 3. POST /api/voice/toggle
    if (pathname === '/api/voice/toggle' && req.method === 'POST') {
      try {
        const body = await this.parseJsonBody(req);
        if (typeof body.enabled === 'boolean') {
          this.setEnabled(body.enabled);
        } else {
          this.setEnabled(!this.settings.enabled);
        }
        sendJson(200, {
          success: true,
          enabled: this.settings.enabled,
        });
      } catch (err: any) {
        sendJson(400, { error: err.message || 'Invalid body' });
      }
      return true;
    }

    // 4. POST /api/voice/persona
    if (pathname === '/api/voice/persona' && req.method === 'POST') {
      try {
        const body = await this.parseJsonBody(req);
        const persona = body.persona as VoicePersonaId;
        if (persona === 'eva' || persona === 'adam' || persona === 'auto') {
          this.setActivePersona(persona);
          sendJson(200, {
            success: true,
            activePersona: this.settings.activePersona,
          });
        } else {
          sendJson(400, { error: 'Invalid persona. Expected: "eva", "adam", or "auto"' });
        }
      } catch (err: any) {
        sendJson(400, { error: err.message || 'Invalid body' });
      }
      return true;
    }

    return false;
  }

  private static parseJsonBody(req: http.IncomingMessage): Promise<any> {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
        if (body.length > 1024 * 1024) reject(new Error('Payload too large'));
      });
      req.on('end', () => {
        if (!body.trim()) return resolve({});
        try {
          resolve(JSON.parse(body));
        } catch {
          reject(new Error('Malformed JSON body'));
        }
      });
      req.on('error', reject);
    });
  }
}
