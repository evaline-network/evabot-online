import { ChatMessage } from './GeminiClient.js';
export interface ChatSessionOptions {
    model?: string;
    systemInstruction?: string;
    apiKey?: string;
    maxHistoryTurns?: number;
}
export declare class ChatSession {
    private client;
    private currentModel;
    private systemInstruction;
    private history;
    private maxHistoryTurns;
    constructor(options?: ChatSessionOptions);
    getModel(): string;
    setModel(modelId: string): boolean;
    getSystemInstruction(): string;
    setSystemInstruction(instruction: string): void;
    setApiKey(apiKey: string): void;
    hasApiKey(): boolean;
    getHistory(): ChatMessage[];
    clearHistory(): void;
    trimHistory(): void;
    sendMessage(prompt: string, onChunk?: (chunk: string) => void): Promise<string>;
}
