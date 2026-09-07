import { logger } from './Logger.js';
import { GoogleAuthProvider } from './GoogleAuthProvider.js';
export class GeminiClient {
    explicitToken;
    tokenType = 'api_key';
    baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
    vertexBaseUrl = 'https://europe-west3-aiplatform.googleapis.com/v1/projects/evabot-agent-server/locations/europe-west3/publishers/google';
    constructor(apiKeyOrToken) {
        if (apiKeyOrToken) {
            this.setApiKey(apiKeyOrToken);
        }
    }
    setApiKey(apiKey) {
        const trimmed = apiKey.trim();
        if (trimmed.includes('AIzaSyBmgELFPYjax4lWcFIZd183EpqQwVqAVlA')) {
            return;
        }
        this.explicitToken = trimmed;
        if (trimmed.startsWith('ya29.')) {
            this.tokenType = 'bearer';
        }
        else {
            this.tokenType = 'api_key';
        }
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
        const cleanModel = model.replace(/^models\//, '');
        let url;
        const payload = {
            contents,
            generationConfig: {
                temperature: options.temperature ?? 0.7,
                maxOutputTokens: options.maxOutputTokens ?? 4096,
            },
        };
        if (auth.type === 'bearer') {
            url = `${this.vertexBaseUrl}/models/${encodeURIComponent(cleanModel)}:generateContent`;
            if (options.systemInstruction) {
                payload.systemInstruction = {
                    parts: [{ text: options.systemInstruction }],
                };
            }
        }
        else {
            url = `${this.baseUrl}/models/${encodeURIComponent(cleanModel)}:generateContent?key=${auth.token}`;
            if (options.systemInstruction) {
                payload.system_instruction = {
                    parts: [{ text: options.systemInstruction }],
                };
            }
        }
        logger.debug('GeminiClient', `Sending unary request to ${cleanModel}`, {
            messageCount: contents.length,
            authType: auth.type,
            endpoint: auth.type === 'bearer' ? 'Vertex AI' : 'Generative Language',
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
            // If Vertex AI returns 404 for a model not yet available in europe-west3, fallback to gemini-2.5-flash
            if (response.status === 404 && auth.type === 'bearer' && cleanModel !== 'gemini-2.5-flash') {
                logger.warn('GeminiClient', `Model "${cleanModel}" not found on Vertex AI in europe-west3. Falling back to gemini-2.5-flash`);
                return this.generateContent('gemini-2.5-flash', contents, options);
            }
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
            const apiName = auth.type === 'bearer' ? 'Vertex AI API' : 'Google AI API';
            logger.error('GeminiClient', `HTTP Error ${response.status}: ${parsedErr}`);
            throw new Error(`${apiName} Error (${response.status}): ${parsedErr}`);
        }
        const data = await response.json();
        const candidate = data.candidates?.[0];
        const parts = candidate?.content?.parts;
        if (Array.isArray(parts) && parts.length > 0) {
            const text = parts.map((p) => p.text || '').join('');
            if (text.length > 0) {
                return text;
            }
        }
        if (candidate?.finishReason) {
            return `[Completed with reason: ${candidate.finishReason}]`;
        }
        return '[No response text received from model]';
    }
    /**
     * Streams content chunk-by-chunk via Server-Sent Events (SSE)
     */
    async streamContent(model, contents, onChunk, options = {}) {
        const auth = await this.resolveAuth();
        const cleanModel = model.replace(/^models\//, '');
        let url;
        const payload = {
            contents,
            generationConfig: {
                temperature: options.temperature ?? 0.7,
                maxOutputTokens: options.maxOutputTokens ?? 4096,
            },
        };
        if (auth.type === 'bearer') {
            url = `${this.vertexBaseUrl}/models/${encodeURIComponent(cleanModel)}:streamGenerateContent?alt=sse`;
            if (options.systemInstruction) {
                payload.systemInstruction = {
                    parts: [{ text: options.systemInstruction }],
                };
            }
        }
        else {
            url = `${this.baseUrl}/models/${encodeURIComponent(cleanModel)}:streamGenerateContent?alt=sse&key=${auth.token}`;
            if (options.systemInstruction) {
                payload.system_instruction = {
                    parts: [{ text: options.systemInstruction }],
                };
            }
        }
        logger.debug('GeminiClient', `Starting stream request to ${cleanModel}`, {
            messageCount: contents.length,
            authType: auth.type,
            endpoint: auth.type === 'bearer' ? 'Vertex AI' : 'Generative Language',
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
            // If Vertex AI returns 404 for a model not yet available in europe-west3, fallback to gemini-2.5-flash
            if (response.status === 404 && auth.type === 'bearer' && cleanModel !== 'gemini-2.5-flash') {
                logger.warn('GeminiClient', `Model "${cleanModel}" not found on Vertex AI in europe-west3. Falling back to gemini-2.5-flash`);
                return this.streamContent('gemini-2.5-flash', contents, onChunk, options);
            }
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
            const apiName = auth.type === 'bearer' ? 'Vertex AI API' : 'Google AI API';
            logger.error('GeminiClient', `Stream HTTP Error ${response.status}: ${parsedErr}`);
            throw new Error(`${apiName} Error (${response.status}): ${parsedErr}`);
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
