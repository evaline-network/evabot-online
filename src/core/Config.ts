import fs from 'node:fs';
import path from 'node:path';

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

/**
 * Parses simple .env file without external dependencies
 */
function loadDotEnv(): void {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
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
  } catch {
    // Ignore error if filesystem not accessible
  }
}

loadDotEnv();

export const Config: SystemConfig = {
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  defaultModel: process.env.DEFAULT_MODEL || 'gemini-2.5-flash',
  serverPort: parseInt(process.env.PORT || '3000', 10),
  serverHost: process.env.HOST || '0.0.0.0',
  defaultSystemInstruction: 
    "You are EvaBot, an advanced autonomous AI agent. " +
    "You provide clear, accurate, concise, and structured answers with code snippets and markdown formatting when relevant. " +
    "You operate in English, Ukrainian, and Russian depending on the user's input language. " +
    "All financial figures and pricing estimates must strictly be in USD ($) or EUR (€).",
  supportedCurrencies: ['USD', 'EUR'],
  omnirouteBaseUrl: process.env.OMNIROUTE_BASE_URL || 'http://100.66.98.4:20128/v1',
  omnirouteApiKey: process.env.OMNIROUTE_API_KEY || 'omniroute-default',
  openrouterBaseUrl: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  openrouterApiKey: process.env.OPENROUTER_API_KEY || '',
  opencodeBaseUrl: process.env.OPENCODE_BASE_URL || 'http://100.66.98.4:20128/v1',
  opencodeApiKey: process.env.OPENCODE_API_KEY || '',
};
