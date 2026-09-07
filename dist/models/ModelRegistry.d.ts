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
    provider: 'Google DeepMind' | 'Anthropic' | 'Meta' | 'Mistral AI' | 'AI21 Labs' | 'Cohere' | 'DeepSeek' | 'OmniRoute' | 'OpenRouter' | 'OpenCode AI';
    category: 'Google Gemini (Next-Gen)' | 'Google Gemini (Long-Context)' | 'Google Gemma (Open Weights)' | 'Anthropic Claude on Google Cloud' | 'Meta Llama 3 on Google Cloud' | 'Mistral AI on Google Cloud' | 'DeepSeek on Google Cloud' | 'AI21 Labs & Cohere on Google Cloud' | 'OmniRoute Daemon Cluster' | 'OpenRouter Free Models' | 'OpenRouter Premium' | 'OpenCode Go Platforms';
    description: string;
    contextWindow: number;
    maxOutputTokens: number;
    recommended: boolean;
    tier: 'Free Quota + Paid' | 'Vertex AI Enterprise' | 'Open Weights' | '100% Free Community' | 'OmniRoute Daemon' | 'OpenCode Platform';
    protocol: 'google-genai' | 'google-vertex' | 'google-partner' | 'openai-compatible';
    pricing: ModelPricing;
}
export declare const COMPLETE_GOOGLE_MODEL_CATALOG: GeminiModelInfo[];
export declare const GEMINI_MODELS: GeminiModelInfo[];
export declare class ModelRegistry {
    static getAllModels(): GeminiModelInfo[];
    static getModelById(id: string): GeminiModelInfo | undefined;
    static isValidModel(id: string): boolean;
    static getDefaultModel(): GeminiModelInfo;
    static getCategories(): string[];
    static getModelsByCategory(category: string): GeminiModelInfo[];
    static getFreeModels(): GeminiModelInfo[];
    static getPaidOnlyModels(): GeminiModelInfo[];
}
