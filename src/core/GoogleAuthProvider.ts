import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, execSync } from 'node:child_process';
import { logger } from './Logger.js';

export interface AuthCredentials {
  token: string;
  type: 'bearer' | 'api_key';
  source: string;
  account: string;
}

/**
 * Gemini free-tier key resolution (TASK-331).
 * ONLY-FREE rule: keys on the Gemini API free tier cost $0.
 * The legacy hard-coded literal was REVOKED (verified 2026-09-07:
 * API_KEY_INVALID) and has been REMOVED from source control.
 *
 * Resolution order for the live free-tier key:
 * 1. `GEMINI_API_KEY` env (loaded from backend .env by Config).
 * 2. GCP Secret Manager secret `evabot-gemini-api-key`
 *    (project evabot-agent-server, Gemini API free tier, $0), read lazily
 *    on first use via `gcloud secrets versions access` (ADC is available on
 *    the VM), cached in memory for the process lifetime, 10s timeout.
 *
 * On failure the resolver returns '' so callers degrade gracefully; the key
 * value is NEVER logged — only the resolution source.
 */
const GEMINI_SECRET_NAME = 'evabot-gemini-api-key';
let cachedSecretManagerKey: string | null = null;

/** Reads the Gemini free-tier key from Secret Manager (cached in memory, '' on failure). */
export function getGeminiApiKeyFromSecretManager(): string {
  if (cachedSecretManagerKey !== null) {
    return cachedSecretManagerKey;
  }
  try {
    const out = execFileSync(
      'gcloud',
      ['secrets', 'versions', 'access', 'latest', `--secret=${GEMINI_SECRET_NAME}`],
      { encoding: 'utf8', timeout: 10_000 },
    );
    cachedSecretManagerKey = out.trim();
    logger.info('GoogleAuthProvider', `Resolved Gemini free-tier key from Secret Manager secret '${GEMINI_SECRET_NAME}'`);
  } catch {
    cachedSecretManagerKey = '';
    logger.warn('GoogleAuthProvider', `Secret Manager secret '${GEMINI_SECRET_NAME}' unavailable — Gemini key fallback degraded (key value not logged)`);
  }
  return cachedSecretManagerKey;
}

/** Env-first resolution: GEMINI_API_KEY env → Secret Manager fallback → ''. */
export function resolveGeminiApiKey(): string {
  return process.env.GEMINI_API_KEY?.trim() || getGeminiApiKeyFromSecretManager();
}

/**
 * @deprecated TASK-331 compatibility shim — keeps existing importers working
 * without the hard-coded literal. String-coerces lazily to
 * resolveGeminiApiKey() (env → Secret Manager, '' on failure). New code must
 * use resolveGeminiApiKey() or Config.geminiApiKey instead.
 */
class LazyDefaultGeminiKey {
  valueOf(): string { return resolveGeminiApiKey(); }
  toString(): string { return resolveGeminiApiKey(); }
  trim(): string { return resolveGeminiApiKey(); }
  toJSON(): string { return resolveGeminiApiKey(); }
  [Symbol.toPrimitive](): string { return resolveGeminiApiKey(); }
}

export const DEFAULT_GEMINI_API_KEY = new LazyDefaultGeminiKey() as unknown as string;

export class GoogleAuthProvider {
  private static cachedCredentials: AuthCredentials | null = null;
  private static expiresAt: number = 0;

  /**
   * Resolves the active Google Cloud / Google AI credentials automatically.
   * NOTE: bearer-first resolution is intended for Google Cloud APIs
   * (Translator, CloudTTS, CloudSTT) which require OAuth tokens.
   * Gemini (generativelanguage.googleapis.com) must NOT use these bearer
   * tokens (scope-insufficient on that endpoint) — GeminiClient resolves its
    * free-tier API key separately (GEMINI_API_KEY env → Secret Manager fallback).
   *
   * IMPORTANT: this method must NEVER return the Gemini API key (GEMINI_API_KEY
   * env is an AIza/AQ **API key**, not a bearer token — cloud consumers send it
   * as `Authorization: Bearer` and would get 401). The env branch was removed:
   * cloud consumers always get an OAuth bearer here.
   *
   * Order of precedence:
   * 1. In-memory unexpired cache
   * 2. Google Compute Engine VM Metadata Token (100% native on GCP instances)
   * 3. Google ADC (Application Default Credentials) refresh_token exchange for evabot.online@gmail.com
   * 4. Local gcloud CLI access token
   */
  public static async getCredentials(): Promise<AuthCredentials | null> {
    const now = Date.now();
    if (this.cachedCredentials && now < this.expiresAt) {
      return this.cachedCredentials;
    }

    // 1. Google ADC refresh token exchange (full cloud-platform scope for evabot.online@gmail.com)
    const adcToken = await this.exchangeAdcRefreshToken();
    if (adcToken) {
      this.cachedCredentials = {
        token: adcToken,
        type: 'bearer',
        source: 'Google ADC (evabot.online@gmail.com)',
        account: 'evabot.online@gmail.com',
      };
      this.expiresAt = now + 50 * 60 * 1000;
      logger.info('GoogleAuthProvider', 'Authenticated automatically via Google ADC refresh token');
      return this.cachedCredentials;
    }

    // 3. Google Compute Engine VM Metadata Server fallback
    const gceToken = await this.fetchGceMetadataToken();
    if (gceToken) {
      this.cachedCredentials = {
        token: gceToken,
        type: 'bearer',
        source: 'Google Compute Engine Service Account',
        account: 'evabot.online@gmail.com',
      };
      this.expiresAt = now + 50 * 60 * 1000; // 50 minutes
      logger.info('GoogleAuthProvider', 'Authenticated automatically via Google Compute Engine Metadata Service');
      return this.cachedCredentials;
    }

    // 4. Local gcloud CLI
    const gcloudToken = this.fetchGcloudCliToken();
    if (gcloudToken) {
      this.cachedCredentials = {
        token: gcloudToken,
        type: 'bearer',
        source: 'Google Cloud SDK (gcloud)',
        account: 'evabot.online@gmail.com',
      };
      this.expiresAt = now + 30 * 60 * 1000;
      logger.info('GoogleAuthProvider', 'Authenticated automatically via gcloud CLI');
      return this.cachedCredentials;
    }

    return null;
  }

  private static fetchGceMetadataToken(): Promise<string | null> {
    return new Promise((resolve) => {
      const options = {
        hostname: 'metadata.google.internal',
        port: 80,
        path: '/computeMetadata/v1/instance/service-accounts/default/token',
        method: 'GET',
        headers: {
          'Metadata-Flavor': 'Google',
        },
        timeout: 1000,
      };

      const req = http.request(options, (res) => {
        if (res.statusCode !== 200) {
          resolve(null);
          return;
        }

        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          try {
            const data = JSON.parse(body);
            resolve(data.access_token || null);
          } catch {
            resolve(null);
          }
        });
      });

      req.on('error', () => resolve(null));
      req.on('timeout', () => {
        req.destroy();
        resolve(null);
      });
      req.end();
    });
  }

  private static async exchangeAdcRefreshToken(): Promise<string | null> {
    try {
      const possiblePaths = [
        '/home/fedor/.config/gcloud/legacy_credentials/evabot.online@gmail.com/adc.json',
        path.join(process.env.HOME || '', '.config/gcloud/legacy_credentials/evabot.online@gmail.com/adc.json'),
        path.join(process.env.HOME || '', '.config/gcloud/application_default_credentials.json'),
      ];

      for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
          const raw = fs.readFileSync(p, 'utf8');
          const json = JSON.parse(raw);
          if (json.refresh_token && json.client_id && json.client_secret) {
            const params = new URLSearchParams({
              client_id: json.client_id,
              client_secret: json.client_secret,
              refresh_token: json.refresh_token,
              grant_type: 'refresh_token',
            });

            const res = await fetch('https://oauth2.googleapis.com/token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: params.toString(),
            });

            if (res.ok) {
              const data: any = await res.json();
              return data.access_token || null;
            }
          }
        }
      }
    } catch {
      // Ignore
    }
    return null;
  }

  private static fetchGcloudCliToken(): string | null {
    try {
      const output = execSync('gcloud auth print-access-token 2>/dev/null', {
        encoding: 'utf8',
        timeout: 3000,
      }).trim();
      if (output.startsWith('ya29.')) {
        return output;
      }
    } catch {
      // Ignore
    }
    return null;
  }
}
