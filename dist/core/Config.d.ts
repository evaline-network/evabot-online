export interface SystemConfig {
    geminiApiKey: string;
    defaultModel: string;
    serverPort: number;
    serverHost: string;
    defaultSystemInstruction: string;
    supportedCurrencies: string[];
}
export declare const Config: SystemConfig;
