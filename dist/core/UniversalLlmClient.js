import { GeminiClient } from './GeminiClient.js';
import { Config } from './Config.js';
import { logger } from './Logger.js';
import { ModelRegistry } from '../models/ModelRegistry.js';
export class UniversalLlmClient {
    geminiClient;
    constructor(apiKeyOrToken) {
        this.geminiClient = new GeminiClient(apiKeyOrToken || Config.geminiApiKey || undefined);
    }
    /**
     * Automatically resolves provider based on model name or explicit option
     */
    resolveProvider(model, explicitProvider) {
        if (explicitProvider) {
            return explicitProvider;
        }
        const m = model.toLowerCase();
        if (m.startsWith('omniroute/')) {
            return 'omniroute';
        }
        if (m.startsWith('opencode/')) {
            return 'opencode';
        }
        if (m.startsWith('openrouter/') ||
            m.endsWith(':free')) {
            return 'openrouter';
        }
        const modelInfo = ModelRegistry.getModelById(model);
        if (modelInfo) {
            if (modelInfo.category.startsWith('OpenRouter') ||
                modelInfo.tier === 'OpenRouter Paid' ||
                modelInfo.tier === '100% Free Community' ||
                modelInfo.provider === 'OpenRouter') {
                return 'openrouter';
            }
            if (modelInfo.category.startsWith('OmniRoute') || modelInfo.tier === 'OmniRoute Daemon' || modelInfo.provider === 'OmniRoute') {
                return 'omniroute';
            }
            if (modelInfo.category.startsWith('OpenCode') || modelInfo.tier === 'OpenCode Platform' || modelInfo.provider === 'OpenCode AI') {
                return 'opencode';
            }
            if (modelInfo.provider === 'Google DeepMind') {
                return 'google';
            }
        }
        if (m.startsWith('anthropic/') ||
            m.startsWith('openai/') ||
            m.startsWith('deepseek/') ||
            m.startsWith('qwen/') ||
            m.startsWith('mistralai/') ||
            m.startsWith('microsoft/') ||
            m.startsWith('x-ai/') ||
            m.startsWith('cohere/') ||
            m.startsWith('meta-llama/')) {
            return 'openrouter';
        }
        return 'google';
    }
    /**
     * Normalizes input messages from either ChatMessage[] or UniversalMessage[] or string
     */
    normalizeToUniversal(input) {
        if (typeof input === 'string') {
            return [{ role: 'user', content: input }];
        }
        if (!Array.isArray(input) || input.length === 0) {
            return [];
        }
        // Check if it's ChatMessage[]
        if ('parts' in input[0]) {
            const chatMsgs = input;
            return chatMsgs.map((m) => ({
                role: m.role === 'model' ? 'assistant' : 'user',
                content: m.parts.map((p) => p.text || '').join('\n'),
            }));
        }
        return input;
    }
    /**
     * Converts UniversalMessage[] to Gemini ChatMessage[] and extracts system prompt
     */
    toGeminiFormat(messages, defaultSystem) {
        let systemInstruction = defaultSystem;
        const contents = [];
        for (const msg of messages) {
            if (msg.role === 'system') {
                systemInstruction = systemInstruction ? `${systemInstruction}\n${msg.content}` : msg.content;
            }
            else {
                contents.push({
                    role: msg.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: msg.content }],
                });
            }
        }
        return { contents, systemInstruction };
    }
    /**
     * Strips provider prefixes like 'omniroute/' or 'opencode/' or 'openrouter/' for upstream payload if needed
     */
    cleanModelId(model, provider) {
        if (provider === 'omniroute' && model.startsWith('omniroute/')) {
            return model.replace('omniroute/', '');
        }
        if (provider === 'opencode' && model.startsWith('opencode/')) {
            return model.replace('opencode/', '');
        }
        if (provider === 'openrouter' && model.startsWith('openrouter/')) {
            return model.replace('openrouter/', '');
        }
        return model;
    }
    /**
     * Generates content without streaming across any supported provider
     */
    async generateContent(model, messages, options = {}) {
        const provider = this.resolveProvider(model, options.provider);
        const universalMsgs = this.normalizeToUniversal(messages);
        logger.debug('UniversalLlmClient', `Generating unary response via provider: ${provider} [model: ${model}]`);
        if (provider === 'google') {
            const { contents, systemInstruction } = this.toGeminiFormat(universalMsgs, options.systemInstruction || Config.defaultSystemInstruction);
            if (options.apiKey) {
                this.geminiClient.setApiKey(options.apiKey);
            }
            return this.geminiClient.generateContent(model, contents, {
                temperature: options.temperature,
                maxOutputTokens: options.maxOutputTokens,
                systemInstruction,
                signal: options.signal,
            });
        }
        return this.generateOpenAiCompatible(provider, model, universalMsgs, options);
    }
    /**
     * Streams content chunk-by-chunk via SSE across any supported provider
     */
    async streamContent(model, messages, onChunk, options = {}) {
        const provider = this.resolveProvider(model, options.provider);
        const universalMsgs = this.normalizeToUniversal(messages);
        logger.debug('UniversalLlmClient', `Streaming response via provider: ${provider} [model: ${model}]`);
        if (provider === 'google') {
            const { contents, systemInstruction } = this.toGeminiFormat(universalMsgs, options.systemInstruction || Config.defaultSystemInstruction);
            if (options.apiKey) {
                this.geminiClient.setApiKey(options.apiKey);
            }
            return this.geminiClient.streamContent(model, contents, onChunk, {
                temperature: options.temperature,
                maxOutputTokens: options.maxOutputTokens,
                systemInstruction,
                signal: options.signal,
            });
        }
        return this.streamOpenAiCompatible(provider, model, universalMsgs, onChunk, options);
    }
    /**
     * Handles OpenAI-compatible providers: OmniRoute, OpenRouter, OpenCode Go
     */
    getProviderEndpointConfig(provider, optionsApiKey) {
        if (provider === 'omniroute') {
            const url = `${Config.omnirouteBaseUrl}/chat/completions`;
            const apiKey = optionsApiKey || Config.omnirouteApiKey || 'omniroute-token';
            return {
                url,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
            };
        }
        if (provider === 'openrouter') {
            const url = `${Config.openrouterBaseUrl}/chat/completions`;
            const apiKey = optionsApiKey || Config.openrouterApiKey || process.env.OPENROUTER_API_KEY || '';
            return {
                url,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': 'https://evabot.online',
                    'X-Title': 'EvaBot Autonomous Agent',
                },
            };
        }
        // opencode (OpenCode Go)
        const url = `${Config.opencodeBaseUrl}/chat/completions`;
        const apiKey = optionsApiKey || Config.opencodeApiKey || process.env.OPENCODE_API_KEY || 'opencode-token';
        return {
            url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'X-Client': 'EvaBot-OpenCode-Go-Adapter',
            },
        };
    }
    buildOpenAiMessages(messages, systemInstruction) {
        const formatted = [];
        const effectiveSystem = systemInstruction || Config.defaultSystemInstruction;
        if (effectiveSystem) {
            formatted.push({ role: 'system', content: effectiveSystem });
        }
        for (const msg of messages) {
            formatted.push({
                role: msg.role === 'assistant' ? 'assistant' : msg.role === 'system' ? 'system' : 'user',
                content: msg.content,
            });
        }
        return formatted;
    }
    async generateOpenAiCompatible(provider, model, messages, options) {
        const { url, headers } = this.getProviderEndpointConfig(provider, options.apiKey);
        const targetModel = this.cleanModelId(model, provider);
        const payload = {
            model: targetModel,
            messages: this.buildOpenAiMessages(messages, options.systemInstruction),
            temperature: options.temperature ?? 0.7,
            max_tokens: options.maxOutputTokens ?? 4096,
            stream: false,
        };
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
            signal: options.signal,
        });
        if (!response.ok) {
            const errText = await response.text();
            let errorDetail = errText;
            try {
                const json = JSON.parse(errText);
                errorDetail = json.error?.message || json.message || errText;
            }
            catch {
                // use raw
            }
            logger.error('UniversalLlmClient', `${provider} API Error ${response.status}: ${errorDetail}`);
            throw new Error(`${provider.toUpperCase()} API Error (${response.status}): ${errorDetail}`);
        }
        const data = await response.json();
        const output = data.choices?.[0]?.message?.content;
        if (typeof output !== 'string') {
            return '[No content returned by model]';
        }
        return output;
    }
    async streamOpenAiCompatible(provider, model, messages, onChunk, options) {
        const { url, headers } = this.getProviderEndpointConfig(provider, options.apiKey);
        const targetModel = this.cleanModelId(model, provider);
        const payload = {
            model: targetModel,
            messages: this.buildOpenAiMessages(messages, options.systemInstruction),
            temperature: options.temperature ?? 0.7,
            max_tokens: options.maxOutputTokens ?? 4096,
            stream: true,
        };
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
            signal: options.signal,
        });
        if (!response.ok) {
            const errText = await response.text();
            let errorDetail = errText;
            try {
                const json = JSON.parse(errText);
                errorDetail = json.error?.message || json.message || errText;
            }
            catch {
                // use raw
            }
            logger.error('UniversalLlmClient', `${provider} Stream Error ${response.status}: ${errorDetail}`);
            throw new Error(`${provider.toUpperCase()} Stream Error (${response.status}): ${errorDetail}`);
        }
        if (!response.body) {
            throw new Error(`Empty response body from ${provider}`);
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
                    const dataStr = trimmed.slice(6).trim();
                    if (dataStr === '[DONE]')
                        continue;
                    try {
                        const parsed = JSON.parse(dataStr);
                        const delta = parsed.choices?.[0]?.delta?.content;
                        if (delta) {
                            fullText += delta;
                            onChunk(delta);
                        }
                    }
                    catch {
                        // Buffer fragment
                    }
                }
            }
        }
        // Process leftover buffer
        if (buffer.trim().startsWith('data: ')) {
            const dataStr = buffer.trim().slice(6).trim();
            if (dataStr !== '[DONE]') {
                try {
                    const parsed = JSON.parse(dataStr);
                    const delta = parsed.choices?.[0]?.delta?.content;
                    if (delta) {
                        fullText += delta;
                        onChunk(delta);
                    }
                }
                catch {
                    // ignore
                }
            }
        }
        return fullText;
    }
}
