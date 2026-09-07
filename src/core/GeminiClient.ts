import { logger } from './Logger.js';
import { GoogleAuthProvider, AuthCredentials } from './GoogleAuthProvider.js';

export interface ChatMessagePart {
  text: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: ChatMessagePart[];
}

export interface GenerationOptions {
  temperature?: number;
  maxOutputTokens?: number;
  systemInstruction?: string;
  signal?: AbortSignal;
}

export class GeminiClient {
  private explicitToken?: string;
  private tokenType: 'api_key' | 'bearer' = 'api_key';
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta';
  private vertexBaseUrl: string = 'https://europe-west3-aiplatform.googleapis.com/v1/projects/evabot-agent-server/locations/europe-west3/publishers/google';

  constructor(apiKeyOrToken?: string) {
    if (apiKeyOrToken) {
      this.setApiKey(apiKeyOrToken);
    }
  }

  public setApiKey(apiKey: string): void {
    const trimmed = apiKey.trim();
    if (trimmed.includes('AIzaSyBmgELFPYjax4lWcFIZd183EpqQwVqAVlA')) {
      return;
    }
    this.explicitToken = trimmed;
    if (trimmed.startsWith('ya29.')) {
      this.tokenType = 'bearer';
    } else {
      this.tokenType = 'api_key';
    }
  }

  public setBearerToken(token: string): void {
    this.explicitToken = token.trim();
    this.tokenType = 'bearer';
  }

  public hasApiKey(): boolean {
    return Boolean(this.explicitToken && this.explicitToken.length > 5);
  }

  /**
   * Resolves authentication credentials: uses explicit key if set,
   * otherwise queries GoogleAuthProvider for ambient Google Cloud / ADC credentials.
   */
  private async resolveAuth(): Promise<{ token: string; type: 'api_key' | 'bearer'; headers: Record<string, string> }> {
    if (this.explicitToken && this.explicitToken.length > 5) {
      return {
        token: this.explicitToken,
        type: this.tokenType,
        headers: this.tokenType === 'bearer'
          ? { 'Authorization': `Bearer ${this.explicitToken}` }
          : { 'x-goog-api-key': this.explicitToken },
      };
    }

    const autoCreds = await GoogleAuthProvider.getCredentials();
    if (autoCreds) {
      return {
        token: autoCreds.token,
        type: autoCreds.type,
        headers: autoCreds.type === 'bearer'
          ? { 'Authorization': `Bearer ${autoCreds.token}` }
          : { 'x-goog-api-key': autoCreds.token },
      };
    }

    throw new Error(
      "Google AI credentials not configured. Please supply an API key in the interface or configure Google Cloud credentials."
    );
  }

  private getVertexLocations(cleanModel: string): string[] {
    if (cleanModel.includes('pro')) {
      return ['us-central1', 'europe-west3'];
    }
    return ['europe-west3', 'us-central1'];
  }

  private getVertexUrl(location: string, cleanModel: string, streaming: boolean): string {
    const action = streaming ? 'streamGenerateContent?alt=sse' : 'generateContent';
    return `https://${location}-aiplatform.googleapis.com/v1/projects/evabot-agent-server/locations/${location}/publishers/google/models/${encodeURIComponent(cleanModel)}:${action}`;
  }

  /**
   * Generates content without streaming
   */
  public async generateContent(
    model: string,
    contents: ChatMessage[],
    options: GenerationOptions = {}
  ): Promise<string> {
    const auth = await this.resolveAuth();
    const cleanModel = model.replace(/^models\//, '');

    const payload: any = {
      contents,
      generationConfig: {
        temperature: options.temperature ?? 0.7,
        maxOutputTokens: options.maxOutputTokens ?? 4096,
      },
    };

    if (auth.type === 'bearer') {
      if (options.systemInstruction) {
        payload.systemInstruction = {
          parts: [{ text: options.systemInstruction }],
        };
      }

      const locations = this.getVertexLocations(cleanModel);
      for (let i = 0; i < locations.length; i++) {
        const loc = locations[i];
        const url = this.getVertexUrl(loc, cleanModel, false);

        logger.debug('GeminiClient', `Sending unary request to ${cleanModel} via Vertex AI (${loc})`, {
          messageCount: contents.length,
        });

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...auth.headers,
          },
          body: JSON.stringify(payload),
          signal: options.signal,
        });

        if (response.status === 404) {
          logger.warn('GeminiClient', `Model "${cleanModel}" returned 404 in ${loc}.`);
          if (i < locations.length - 1) {
            continue;
          }
          if (cleanModel !== 'gemini-2.5-flash') {
            logger.warn('GeminiClient', `Model "${cleanModel}" not found on Vertex AI across locations. Falling back to gemini-2.5-flash`);
            return this.generateContent('gemini-2.5-flash', contents, options);
          }
        }

        if (!response.ok) {
          const errText = await response.text();
          let parsedErr = errText;
          try {
            const jsonErr = JSON.parse(errText);
            if (jsonErr.error?.message) parsedErr = jsonErr.error.message;
          } catch {}
          throw new Error(`Vertex AI API Error (${response.status}): ${parsedErr}`);
        }

        const data: any = await response.json();
        const candidate = data.candidates?.[0];
        const parts = candidate?.content?.parts;
        if (Array.isArray(parts) && parts.length > 0) {
          const text = parts.map((p: any) => p.text || '').join('');
          if (text.length > 0) return text;
        }
        if (candidate?.finishReason) return `[Completed with reason: ${candidate.finishReason}]`;
        return '[No response text received from model]';
      }
      throw new Error(`Model ${cleanModel} failed on all Vertex AI endpoints.`);
    } else {
      const url = `${this.baseUrl}/models/${encodeURIComponent(cleanModel)}:generateContent?key=${auth.token}`;
      if (options.systemInstruction) {
        payload.system_instruction = {
          parts: [{ text: options.systemInstruction }],
        };
      }

      logger.debug('GeminiClient', `Sending unary request to ${cleanModel}`, {
        messageCount: contents.length,
        authType: auth.type,
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...auth.headers,
        },
        body: JSON.stringify(payload),
        signal: options.signal,
      });

      if (!response.ok) {
        const errText = await response.text();
        let parsedErr = errText;
        try {
          const jsonErr = JSON.parse(errText);
          if (jsonErr.error?.message) parsedErr = jsonErr.error.message;
        } catch {}
        throw new Error(`Google AI API Error (${response.status}): ${parsedErr}`);
      }

      const data: any = await response.json();
      const candidate = data.candidates?.[0];
      const parts = candidate?.content?.parts;
      if (Array.isArray(parts) && parts.length > 0) {
        const text = parts.map((p: any) => p.text || '').join('');
        if (text.length > 0) return text;
      }
      if (candidate?.finishReason) return `[Completed with reason: ${candidate.finishReason}]`;
      return '[No response text received from model]';
    }
  }

  /**
   * Streams content chunk-by-chunk via Server-Sent Events (SSE)
   */
  public async streamContent(
    model: string,
    contents: ChatMessage[],
    onChunk: (chunk: string) => void,
    options: GenerationOptions = {}
  ): Promise<string> {
    const auth = await this.resolveAuth();
    const cleanModel = model.replace(/^models\//, '');

    const payload: any = {
      contents,
      generationConfig: {
        temperature: options.temperature ?? 0.7,
        maxOutputTokens: options.maxOutputTokens ?? 4096,
      },
    };

    if (auth.type === 'bearer') {
      if (options.systemInstruction) {
        payload.systemInstruction = {
          parts: [{ text: options.systemInstruction }],
        };
      }

      const locations = this.getVertexLocations(cleanModel);
      let activeResponse: Response | null = null;

      for (let i = 0; i < locations.length; i++) {
        const loc = locations[i];
        const url = this.getVertexUrl(loc, cleanModel, true);

        logger.debug('GeminiClient', `Starting stream request to ${cleanModel} via Vertex AI (${loc})`, {
          messageCount: contents.length,
        });

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...auth.headers,
          },
          body: JSON.stringify(payload),
          signal: options.signal,
        });

        if (response.status === 404) {
          logger.warn('GeminiClient', `Model "${cleanModel}" stream returned 404 in ${loc}.`);
          if (i < locations.length - 1) {
            continue;
          }
          if (cleanModel !== 'gemini-2.5-flash') {
            logger.warn('GeminiClient', `Model "${cleanModel}" not found on Vertex AI across locations. Falling back to gemini-2.5-flash`);
            return this.streamContent('gemini-2.5-flash', contents, onChunk, options);
          }
        }

        if (!response.ok) {
          const errText = await response.text();
          let parsedErr = errText;
          try {
            const jsonErr = JSON.parse(errText);
            if (jsonErr.error?.message) parsedErr = jsonErr.error.message;
          } catch {}
          throw new Error(`Vertex AI API Stream Error (${response.status}): ${parsedErr}`);
        }

        activeResponse = response;
        break;
      }

      if (!activeResponse || !activeResponse.body) {
        throw new Error("Response body is empty.");
      }

      return this.readStreamBody(activeResponse, onChunk);
    } else {
      const url = `${this.baseUrl}/models/${encodeURIComponent(cleanModel)}:streamGenerateContent?alt=sse&key=${auth.token}`;
      if (options.systemInstruction) {
        payload.system_instruction = {
          parts: [{ text: options.systemInstruction }],
        };
      }

      logger.debug('GeminiClient', `Starting stream request to ${cleanModel}`, {
        messageCount: contents.length,
        authType: auth.type,
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...auth.headers,
        },
        body: JSON.stringify(payload),
        signal: options.signal,
      });

      if (!response.ok) {
        const errText = await response.text();
        let parsedErr = errText;
        try {
          const jsonErr = JSON.parse(errText);
          if (jsonErr.error?.message) parsedErr = jsonErr.error.message;
        } catch {}
        throw new Error(`Google AI API Error (${response.status}): ${parsedErr}`);
      }

      if (!response.body) {
        throw new Error("Response body is empty.");
      }

      return this.readStreamBody(response, onChunk);
    }
  }

  private async readStreamBody(response: Response, onChunk: (chunk: string) => void): Promise<string> {
    const reader = response.body!.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const jsonStr = trimmed.slice(6).trim();
          if (jsonStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const candidate = parsed.candidates?.[0];
            const parts = candidate?.content?.parts;
            if (Array.isArray(parts)) {
              for (const part of parts) {
                if (part.text) {
                  fullText += part.text;
                  onChunk(part.text);
                }
              }
            }
          } catch {
            // Buffer fragment or invalid JSON
          }
        }
      }
    }

    // Process leftover buffer
    if (buffer.trim().startsWith('data: ')) {
      try {
        const jsonStr = buffer.trim().slice(6).trim();
        const parsed = JSON.parse(jsonStr);
        const parts = parsed.candidates?.[0]?.content?.parts;
        if (Array.isArray(parts)) {
          for (const part of parts) {
            if (part.text) {
              fullText += part.text;
              onChunk(part.text);
            }
          }
        }
      } catch {
        // ignore
      }
    }

    return fullText;
  }
}
