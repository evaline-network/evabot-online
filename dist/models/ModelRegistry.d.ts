export interface ModelPricing {
    inputPer1MTokensUSD: string;
    outputPer1MTokensUSD: string;
    inputPer1MTokensEUR: string;
    outputPer1MTokensEUR: string;
    freeTierStatus: '100% Free Quota Available' | 'Paid / Pay-As-You-Go Only';
    freeTierDetails: string;
}
export interface GeminiModelInfo {
    id: string;
    name: string;
    provider: 'Google DeepMind' | 'Anthropic (Google Vertex AI)';
    category: 'Gemini Next-Gen' | 'Gemini Long-Context' | 'Claude via Vertex AI' | 'Open Gemma';
    description: string;
    contextWindow: number;
    maxOutputTokens: number;
    recommended: boolean;
    tier: 'Free Quota + Paid' | 'Vertex AI Enterprise' | 'Open Weights';
    pricing: ModelPricing;
}
export declare const COMPLETE_GOOGLE_MODEL_CATALOG: GeminiModelInfo[];
export declare const GEMINI_MODELS: GeminiModelInfo[];
export declare class ModelRegistry {
    static getAllModels(): GeminiModelInfo[];
    static getModelById(id: string): GeminiModelInfo | undefined;
    static isValidModel(id: string): boolean;
    static getDefaultModel(): GeminiModelInfo;
    static getFreeModels(): GeminiModelInfo[];
    static getPaidOnlyModels(): GeminiModelInfo[];
}
