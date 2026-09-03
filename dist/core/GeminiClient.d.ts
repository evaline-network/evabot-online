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
export declare class GeminiClient {
    private explicitToken?;
    private tokenType;
    private baseUrl;
    constructor(apiKeyOrToken?: string);
    setApiKey(apiKey: string): void;
    setBearerToken(token: string): void;
    hasApiKey(): boolean;
    /**
     * Resolves authentication credentials: uses explicit key if set,
     * otherwise queries GoogleAuthProvider for ambient Google Cloud / ADC credentials.
     */
    private resolveAuth;
    /**
     * Generates content without streaming
     */
    generateContent(model: string, contents: ChatMessage[], options?: GenerationOptions): Promise<string>;
    /**
     * Streams content chunk-by-chunk via Server-Sent Events (SSE)
     */
    streamContent(model: string, contents: ChatMessage[], onChunk: (chunk: string) => void, options?: GenerationOptions): Promise<string>;
}
