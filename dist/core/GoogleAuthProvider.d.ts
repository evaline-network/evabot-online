export interface AuthCredentials {
    token: string;
    type: 'bearer' | 'api_key';
    source: string;
    account: string;
}
export declare class GoogleAuthProvider {
    private static cachedCredentials;
    private static expiresAt;
    /**
     * Resolves the active Google Cloud / Google AI credentials automatically.
     * Order of precedence:
     * 1. In-memory unexpired cache
     * 2. GEMINI_API_KEY environment variable / .env
     * 3. Google Compute Engine VM Metadata Token (100% native on GCP instances)
     * 4. Google ADC (Application Default Credentials) refresh_token exchange for evabot.online@gmail.com
     * 5. Local gcloud CLI access token
     */
    static getCredentials(): Promise<AuthCredentials | null>;
    private static fetchGceMetadataToken;
    private static exchangeAdcRefreshToken;
    private static fetchGcloudCliToken;
}
