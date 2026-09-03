import { logger } from './Logger.js';
export class GeminiClient {
    apiKey;
    baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
    constructor(apiKey) {
        this.apiKey = apiKey.trim();
    }
    setApiKey(apiKey) {
        this.apiKey = apiKey.trim();
    }
    hasApiKey() {
        return Boolean(this.apiKey && this.apiKey.length > 5);
    }
    /**
     * Generates content without streaming
     */
    async generateContent(model, contents, options = {}) {
        if (!this.hasApiKey()) {
            throw new Error("Gemini API key is not configured. Please set GEMINI_API_KEY or provide it in the chat interface.");
        }
        const url = `${this.baseUrl}/models/${encodeURIComponent(model)}:generateContent?key=${this.apiKey}`;
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
        logger.debug('GeminiClient', `Sending unary request to ${model}`, { messageCount: contents.length });
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
            throw new Error(`Gemini API Error (${response.status}): ${parsedErr}`);
        }
        const data = await response.json();
        const candidate = data.candidates?.[0];
        if (!candidate?.content?.parts?.[0]?.text) {
            if (candidate?.finishReason) {
                return `[Completed with reason: ${candidate.finishReason}]`;
            }
            return '[No response text received from Gemini]';
        }
        return candidate.content.parts.map((p) => p.text || '').join('');
    }
    /**
     * Streams content chunk-by-chunk via Server-Sent Events (SSE)
     */
    async streamContent(model, contents, onChunk, options = {}) {
        if (!this.hasApiKey()) {
            throw new Error("Gemini API key is not configured. Please set GEMINI_API_KEY or provide it in the chat interface.");
        }
        const url = `${this.baseUrl}/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse&key=${this.apiKey}`;
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
        logger.debug('GeminiClient', `Starting stream request to ${model}`, { messageCount: contents.length });
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
            throw new Error(`Gemini API Error (${response.status}): ${parsedErr}`);
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
