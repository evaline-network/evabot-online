export interface SystemConfig {
    geminiApiKey: string;
    defaultModel: string;
    serverPort: number;
    serverHost: string;
    defaultSystemInstruction: string;
    supportedCurrencies: string[];
    omnirouteBaseUrl: string;
    omnirouteApiKey: string;
    openrouterBaseUrl: string;
    openrouterApiKey: string;
    opencodeBaseUrl: string;
    opencodeApiKey: string;
}
export declare const Config: SystemConfig;
