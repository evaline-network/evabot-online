export const GEMINI_MODELS = [
    {
        id: 'gemini-2.5-flash',
        name: 'Gemini 2.5 Flash',
        description: 'Ultra-fast, high-capability flagship model with native multimodal and reasoning skills.',
        contextWindow: 1048576,
        maxOutputTokens: 8192,
        recommended: true,
        tier: 'Flash',
    },
    {
        id: 'gemini-2.5-pro',
        name: 'Gemini 2.5 Pro',
        description: 'Google’s most powerful reasoning and coding model for complex engineering and analytical tasks.',
        contextWindow: 2097152,
        maxOutputTokens: 8192,
        recommended: false,
        tier: 'Pro',
    },
    {
        id: 'gemini-2.0-flash',
        name: 'Gemini 2.0 Flash',
        description: 'Next-generation low-latency model optimized for real-time interactive tasks.',
        contextWindow: 1048576,
        maxOutputTokens: 8192,
        recommended: false,
        tier: 'Flash',
    },
    {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        description: 'Established reasoning model featuring a 2-million-token context window for massive documents.',
        contextWindow: 2097152,
        maxOutputTokens: 8192,
        recommended: false,
        tier: 'Pro',
    },
    {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        description: 'Lightweight, rapid response model optimized for high throughput and general assistant queries.',
        contextWindow: 1048576,
        maxOutputTokens: 8192,
        recommended: false,
        tier: 'Flash',
    },
];
export class ModelRegistry {
    static getAllModels() {
        return [...GEMINI_MODELS];
    }
    static getModelById(id) {
        return GEMINI_MODELS.find(m => m.id === id);
    }
    static isValidModel(id) {
        return GEMINI_MODELS.some(m => m.id === id);
    }
    static getDefaultModel() {
        return GEMINI_MODELS.find(m => m.recommended) || GEMINI_MODELS[0];
    }
}
