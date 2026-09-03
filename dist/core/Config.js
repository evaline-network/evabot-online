import fs from 'node:fs';
import path from 'node:path';
/**
 * Parses simple .env file without external dependencies
 */
function loadDotEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf8');
            const lines = content.split('\n');
            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith('#'))
                    continue;
                const eqIdx = trimmed.indexOf('=');
                if (eqIdx > 0) {
                    const key = trimmed.slice(0, eqIdx).trim();
                    let val = trimmed.slice(eqIdx + 1).trim();
                    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                        val = val.slice(1, -1);
                    }
                    if (!process.env[key]) {
                        process.env[key] = val;
                    }
                }
            }
        }
    }
    catch {
        // Ignore error if filesystem not accessible
    }
}
loadDotEnv();
export const Config = {
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    defaultModel: process.env.DEFAULT_MODEL || 'gemini-2.5-flash',
    serverPort: parseInt(process.env.PORT || '3000', 10),
    serverHost: process.env.HOST || '0.0.0.0',
    defaultSystemInstruction: "You are EvaBot, an advanced autonomous AI agent. " +
        "You provide clear, accurate, concise, and structured answers with code snippets and markdown formatting when relevant. " +
        "You operate in English, Ukrainian, and Russian depending on the user's input language. " +
        "All financial figures and pricing estimates must strictly be in USD ($) or EUR (€).",
    supportedCurrencies: ['USD', 'EUR'],
};
