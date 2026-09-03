export const COMPLETE_GOOGLE_MODEL_CATALOG = [
    // 1. Google Gemini 2.5 Series (State of the Art)
    {
        id: 'gemini-2.5-flash',
        name: 'Gemini 2.5 Flash',
        provider: 'Google DeepMind',
        category: 'Gemini Next-Gen',
        description: 'Fastest flagship model with native reasoning, multimodal comprehension, and superior real-time speed.',
        contextWindow: 1048576,
        maxOutputTokens: 8192,
        recommended: true,
        tier: 'Free Quota + Paid',
        pricing: {
            freeTierStatus: '100% Free Quota Available',
            freeTierDetails: 'Google AI Studio: 15 Requests/Min, 1,000,000 Tokens/Min, 1,500 Requests/Day for $0.00',
            inputPer1MTokensUSD: '$0.00 (Free) / $0.075 (Paid tier)',
            outputPer1MTokensUSD: '$0.00 (Free) / $0.30 (Paid tier)',
            inputPer1MTokensEUR: '€0.00 (Free) / €0.070 (Paid tier)',
            outputPer1MTokensEUR: '€0.00 (Free) / €0.280 (Paid tier)',
        },
    },
    {
        id: 'gemini-2.5-pro',
        name: 'Gemini 2.5 Pro',
        provider: 'Google DeepMind',
        category: 'Gemini Next-Gen',
        description: 'Google’s premier reasoning, code generation, and complex multi-step analytical engine.',
        contextWindow: 2097152,
        maxOutputTokens: 8192,
        recommended: false,
        tier: 'Free Quota + Paid',
        pricing: {
            freeTierStatus: '100% Free Quota Available',
            freeTierDetails: 'Google AI Studio: 2 Requests/Min, 32,000 Tokens/Min, 50 Requests/Day for $0.00',
            inputPer1MTokensUSD: '$0.00 (Free) / $1.25 (Paid tier)',
            outputPer1MTokensUSD: '$0.00 (Free) / $5.00 (Paid tier)',
            inputPer1MTokensEUR: '€0.00 (Free) / €1.17 (Paid tier)',
            outputPer1MTokensEUR: '€0.00 (Free) / €4.68 (Paid tier)',
        },
    },
    // 2. Google Gemini 2.0 Series
    {
        id: 'gemini-2.0-flash',
        name: 'Gemini 2.0 Flash',
        provider: 'Google DeepMind',
        category: 'Gemini Next-Gen',
        description: 'Ultra-low latency streaming model engineered for high-frequency interactive dialogues and agent tool calls.',
        contextWindow: 1048576,
        maxOutputTokens: 8192,
        recommended: false,
        tier: 'Free Quota + Paid',
        pricing: {
            freeTierStatus: '100% Free Quota Available',
            freeTierDetails: 'Google AI Studio: 15 Requests/Min, 1,000,000 Tokens/Min, 1,500 Requests/Day for $0.00',
            inputPer1MTokensUSD: '$0.00 (Free) / $0.10 (Paid tier)',
            outputPer1MTokensUSD: '$0.00 (Free) / $0.40 (Paid tier)',
            inputPer1MTokensEUR: '€0.00 (Free) / €0.093 (Paid tier)',
            outputPer1MTokensEUR: '€0.00 (Free) / €0.375 (Paid tier)',
        },
    },
    {
        id: 'gemini-2.0-flash-lite',
        name: 'Gemini 2.0 Flash Lite',
        provider: 'Google DeepMind',
        category: 'Gemini Next-Gen',
        description: 'Cost-optimized, ultra-efficient lightweight model designed for high-scale agent throughput.',
        contextWindow: 1048576,
        maxOutputTokens: 8192,
        recommended: false,
        tier: 'Free Quota + Paid',
        pricing: {
            freeTierStatus: '100% Free Quota Available',
            freeTierDetails: 'Google AI Studio: 30 Requests/Min, 1,500 Requests/Day for $0.00',
            inputPer1MTokensUSD: '$0.00 (Free) / $0.075 (Paid tier)',
            outputPer1MTokensUSD: '$0.00 (Free) / $0.30 (Paid tier)',
            inputPer1MTokensEUR: '€0.00 (Free) / €0.070 (Paid tier)',
            outputPer1MTokensEUR: '€0.00 (Free) / €0.280 (Paid tier)',
        },
    },
    // 3. Google Gemini 1.5 Series (Long Context)
    {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        provider: 'Google DeepMind',
        category: 'Gemini Long-Context',
        description: 'Groundbreaking 2,000,000 token context window capable of ingesting whole codebases and video archives.',
        contextWindow: 2097152,
        maxOutputTokens: 8192,
        recommended: false,
        tier: 'Free Quota + Paid',
        pricing: {
            freeTierStatus: '100% Free Quota Available',
            freeTierDetails: 'Google AI Studio: 2 Requests/Min, 32,000 Tokens/Min, 50 Requests/Day for $0.00',
            inputPer1MTokensUSD: '$0.00 (Free) / $1.25 (Paid tier)',
            outputPer1MTokensUSD: '$0.00 (Free) / $5.00 (Paid tier)',
            inputPer1MTokensEUR: '€0.00 (Free) / €1.17 (Paid tier)',
            outputPer1MTokensEUR: '€0.00 (Free) / €4.68 (Paid tier)',
        },
    },
    {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        provider: 'Google DeepMind',
        category: 'Gemini Long-Context',
        description: 'High-speed, cost-effective multimodal workhorse with 1M context support.',
        contextWindow: 1048576,
        maxOutputTokens: 8192,
        recommended: false,
        tier: 'Free Quota + Paid',
        pricing: {
            freeTierStatus: '100% Free Quota Available',
            freeTierDetails: 'Google AI Studio: 15 Requests/Min, 1,000,000 Tokens/Min for $0.00',
            inputPer1MTokensUSD: '$0.00 (Free) / $0.075 (Paid tier)',
            outputPer1MTokensUSD: '$0.00 (Free) / $0.30 (Paid tier)',
            inputPer1MTokensEUR: '€0.00 (Free) / €0.070 (Paid tier)',
            outputPer1MTokensEUR: '€0.00 (Free) / €0.280 (Paid tier)',
        },
    },
    // 4. Anthropic Claude on Google Cloud (Vertex AI Model Garden)
    {
        id: 'claude-3-7-sonnet',
        name: 'Claude 3.7 Sonnet (Vertex AI)',
        provider: 'Anthropic (Google Vertex AI)',
        category: 'Claude via Vertex AI',
        description: 'Hybrid reasoning and instant response model available through Google Cloud Vertex AI Model Garden.',
        contextWindow: 200000,
        maxOutputTokens: 8192,
        recommended: false,
        tier: 'Vertex AI Enterprise',
        pricing: {
            freeTierStatus: 'Paid / Pay-As-You-Go Only',
            freeTierDetails: 'Direct Google Cloud billing (no free quota tier on Vertex AI)',
            inputPer1MTokensUSD: '$3.00',
            outputPer1MTokensUSD: '$15.00',
            inputPer1MTokensEUR: '€2.80',
            outputPer1MTokensEUR: '€14.00',
        },
    },
    {
        id: 'claude-3-5-sonnet',
        name: 'Claude 3.5 Sonnet (Vertex AI)',
        provider: 'Anthropic (Google Vertex AI)',
        category: 'Claude via Vertex AI',
        description: 'Industry-standard coding and analytical model hosted on Google Cloud Vertex AI infrastructure.',
        contextWindow: 200000,
        maxOutputTokens: 8192,
        recommended: false,
        tier: 'Vertex AI Enterprise',
        pricing: {
            freeTierStatus: 'Paid / Pay-As-You-Go Only',
            freeTierDetails: 'Direct Google Cloud billing (no free quota tier on Vertex AI)',
            inputPer1MTokensUSD: '$3.00',
            outputPer1MTokensUSD: '$15.00',
            inputPer1MTokensEUR: '€2.80',
            outputPer1MTokensEUR: '€14.00',
        },
    },
    {
        id: 'claude-3-5-haiku',
        name: 'Claude 3.5 Haiku (Vertex AI)',
        provider: 'Anthropic (Google Vertex AI)',
        category: 'Claude via Vertex AI',
        description: 'High-speed compact model by Anthropic running inside Google Cloud Vertex AI.',
        contextWindow: 200000,
        maxOutputTokens: 8192,
        recommended: false,
        tier: 'Vertex AI Enterprise',
        pricing: {
            freeTierStatus: 'Paid / Pay-As-You-Go Only',
            freeTierDetails: 'Direct Google Cloud billing (no free quota tier on Vertex AI)',
            inputPer1MTokensUSD: '$0.80',
            outputPer1MTokensUSD: '$4.00',
            inputPer1MTokensEUR: '€0.75',
            outputPer1MTokensEUR: '€3.75',
        },
    },
    // 5. Open Gemma Models (Google DeepMind)
    {
        id: 'gemma-2-27b',
        name: 'Gemma 2 (27B Open Model)',
        provider: 'Google DeepMind',
        category: 'Open Gemma',
        description: 'Google’s state-of-the-art open-weights model deliverable via Vertex AI or self-hosted GPU.',
        contextWindow: 8192,
        maxOutputTokens: 4096,
        recommended: false,
        tier: 'Open Weights',
        pricing: {
            freeTierStatus: '100% Free Quota Available',
            freeTierDetails: 'Free open weights or standard Vertex AI prediction compute rate',
            inputPer1MTokensUSD: '$0.27',
            outputPer1MTokensUSD: '$0.27',
            inputPer1MTokensEUR: '€0.25',
            outputPer1MTokensEUR: '€0.25',
        },
    },
];
export const GEMINI_MODELS = COMPLETE_GOOGLE_MODEL_CATALOG;
export class ModelRegistry {
    static getAllModels() {
        return [...COMPLETE_GOOGLE_MODEL_CATALOG];
    }
    static getModelById(id) {
        return COMPLETE_GOOGLE_MODEL_CATALOG.find(m => m.id === id);
    }
    static isValidModel(id) {
        return COMPLETE_GOOGLE_MODEL_CATALOG.some(m => m.id === id);
    }
    static getDefaultModel() {
        return COMPLETE_GOOGLE_MODEL_CATALOG.find(m => m.recommended) || COMPLETE_GOOGLE_MODEL_CATALOG[0];
    }
    static getFreeModels() {
        return COMPLETE_GOOGLE_MODEL_CATALOG.filter(m => m.pricing.freeTierStatus === '100% Free Quota Available');
    }
    static getPaidOnlyModels() {
        return COMPLETE_GOOGLE_MODEL_CATALOG.filter(m => m.pricing.freeTierStatus === 'Paid / Pay-As-You-Go Only');
    }
}
