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
    private apiKey;
    private baseUrl;
    constructor(apiKey: string);
    setApiKey(apiKey: string): void;
    hasApiKey(): boolean;
    /**
     * Generates content without streaming
     */
    generateContent(model: string, contents: ChatMessage[], options?: GenerationOptions): Promise<string>;
    /**
     * Streams content chunk-by-chunk via Server-Sent Events (SSE)
     */
    streamContent(model: string, contents: ChatMessage[], onChunk: (chunk: string) => void, options?: GenerationOptions): Promise<string>;
}
