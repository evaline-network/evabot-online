import { ChatMessage } from './GeminiClient.js';
export type LlmProvider = 'google' | 'omniroute' | 'openrouter' | 'opencode';
export interface UniversalMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export interface UniversalGenerationOptions {
    temperature?: number;
    maxOutputTokens?: number;
    systemInstruction?: string;
    provider?: LlmProvider;
    apiKey?: string;
    signal?: AbortSignal;
}
export declare class UniversalLlmClient {
    private geminiClient;
    constructor(apiKeyOrToken?: string);
    /**
     * Automatically resolves provider based on model name or explicit option
     */
    resolveProvider(model: string, explicitProvider?: LlmProvider): LlmProvider;
    /**
     * Normalizes input messages from either ChatMessage[] or UniversalMessage[] or string
     */
    normalizeToUniversal(input: string | UniversalMessage[] | ChatMessage[]): UniversalMessage[];
    /**
     * Converts UniversalMessage[] to Gemini ChatMessage[] and extracts system prompt
     */
    toGeminiFormat(messages: UniversalMessage[], defaultSystem?: string): {
        contents: ChatMessage[];
        systemInstruction?: string;
    };
    /**
     * Strips provider prefixes like 'omniroute/' or 'opencode/' or 'openrouter/' for upstream payload if needed
     */
    private cleanModelId;
    /**
     * Generates content without streaming across any supported provider
     */
    generateContent(model: string, messages: string | UniversalMessage[] | ChatMessage[], options?: UniversalGenerationOptions): Promise<string>;
    /**
     * Streams content chunk-by-chunk via SSE across any supported provider
     */
    streamContent(model: string, messages: string | UniversalMessage[] | ChatMessage[], onChunk: (chunk: string) => void, options?: UniversalGenerationOptions): Promise<string>;
    /**
     * Handles OpenAI-compatible providers: OmniRoute, OpenRouter, OpenCode Go
     */
    private getProviderEndpointConfig;
    private buildOpenAiMessages;
    private generateOpenAiCompatible;
    private streamOpenAiCompatible;
}
