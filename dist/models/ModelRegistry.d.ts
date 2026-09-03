export interface GeminiModelInfo {
    id: string;
    name: string;
    description: string;
    contextWindow: number;
    maxOutputTokens: number;
    recommended: boolean;
    tier: 'Pro' | 'Flash' | 'Experimental';
}
export declare const GEMINI_MODELS: GeminiModelInfo[];
export declare class ModelRegistry {
    static getAllModels(): GeminiModelInfo[];
    static getModelById(id: string): GeminiModelInfo | undefined;
    static isValidModel(id: string): boolean;
    static getDefaultModel(): GeminiModelInfo;
}
