import { logger } from './Logger.js';
import { GoogleAuthProvider } from './GoogleAuthProvider.js';
export class GeminiClient {
    explicitToken;
    tokenType = 'api_key';
    baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
    constructor(apiKeyOrToken) {
        if (apiKeyOrToken) {
            this.setApiKey(apiKeyOrToken);
        }
    }
    setApiKey(apiKey) {
        this.explicitToken = apiKey.trim();
        this.tokenType = 'api_key';
    }
    setBearerToken(token) {
        this.explicitToken = token.trim();
        this.tokenType = 'bearer';
    }
    hasApiKey() {
        return Boolean(this.explicitToken && this.explicitToken.length > 5);
    }
    /**
     * Resolves authentication credentials: uses explicit key if set,
     * otherwise queries GoogleAuthProvider for ambient Google Cloud / ADC credentials.
     */
    async resolveAuth() {
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
        throw new Error("Google AI credentials not configured. Please supply an API key in the interface or configure Google Cloud credentials.");
    }
    /**
     * Generates content without streaming
     */
    async generateContent(model, contents, options = {}) {
        const auth = await this.resolveAuth();
        // Build URL according to auth type
        let url = `${this.baseUrl}/models/${encodeURIComponent(model)}:generateContent`;
        if (auth.type === 'api_key') {
            url += `?key=${auth.token}`;
        }
        const payload = {
            contents,
            generationConfig: {
                temperature: options.temperature ?? 0.7,
                maxOutputTokens: options.maxOutputTokens ?? 4096,
            },
        };
        if (options.systemInstruction) {
            payload.system_instruction = {
                parts: [{ text: options.systemInstruction }],
            };
        }
        logger.debug('GeminiClient', `Sending unary request to ${model}`, {
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
                if (jsonErr.error?.message) {
                    parsedErr = jsonErr.error.message;
                }
            }
            catch {
                // use errText
            }
            logger.error('GeminiClient', `HTTP Error ${response.status}: ${parsedErr}`);
            throw new Error(`Google AI API Error (${response.status}): ${parsedErr}`);
        }
        const data = await response.json();
        const candidate = data.candidates?.[0];
        if (!candidate?.content?.parts?.[0]?.text) {
            if (candidate?.finishReason) {
                return `[Completed with reason: ${candidate.finishReason}]`;
            }
            return '[No response text received from model]';
        }
        return candidate.content.parts.map((p) => p.text || '').join('');
    }
    /**
     * Streams content chunk-by-chunk via Server-Sent Events (SSE)
     */
    async streamContent(model, contents, onChunk, options = {}) {
        const auth = await this.resolveAuth();
        let url = `${this.baseUrl}/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`;
        if (auth.type === 'api_key') {
            url += `&key=${auth.token}`;
        }
        const payload = {
            contents,
            generationConfig: {
                temperature: options.temperature ?? 0.7,
                maxOutputTokens: options.maxOutputTokens ?? 4096,
            },
        };
        if (options.systemInstruction) {
            payload.system_instruction = {
                parts: [{ text: options.systemInstruction }],
            };
        }
        logger.debug('GeminiClient', `Starting stream request to ${model}`, {
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
                if (jsonErr.error?.message) {
                    parsedErr = jsonErr.error.message;
                }
            }
            catch {
                // use errText
            }
            logger.error('GeminiClient', `Stream HTTP Error ${response.status}: ${parsedErr}`);
            throw new Error(`Google AI API Error (${response.status}): ${parsedErr}`);
        }
        if (!response.body) {
            throw new Error("Response body is empty.");
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        let fullText = '';
        while (true) {
            const { done, value } = await reader.read();
            if (done)
                break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed.startsWith('data: ')) {
                    const jsonStr = trimmed.slice(6).trim();
                    if (jsonStr === '[DONE]')
                        continue;
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
                    }
                    catch {
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
            }
            catch {
                // ignore
            }
        }
        return fullText;
    }
}
