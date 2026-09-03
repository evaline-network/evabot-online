import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { logger } from './Logger.js';

export interface AuthCredentials {
  token: string;
  type: 'bearer' | 'api_key';
  source: string;
  account: string;
}

export class GoogleAuthProvider {
  private static cachedCredentials: AuthCredentials | null = null;
  private static expiresAt: number = 0;

  /**
   * Resolves the active Google Cloud / Google AI credentials automatically.
   * Order of precedence:
   * 1. In-memory unexpired cache
   * 2. GEMINI_API_KEY environment variable / .env
   * 3. Google Compute Engine VM Metadata Token (100% native on GCP instances)
   * 4. Google ADC (Application Default Credentials) refresh_token exchange for evabot.online@gmail.com
   * 5. Local gcloud CLI access token
   */
  public static async getCredentials(): Promise<AuthCredentials | null> {
    const now = Date.now();
    if (this.cachedCredentials && now < this.expiresAt) {
      return this.cachedCredentials;
    }

    // 1. Environment Variable
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) {
      this.cachedCredentials = {
        token: process.env.GEMINI_API_KEY.trim(),
        type: 'api_key',
        source: 'Environment (GEMINI_API_KEY)',
        account: 'evabot.online@gmail.com',
      };
      this.expiresAt = now + 24 * 3600 * 1000;
      return this.cachedCredentials;
    }

    // 2. Google ADC refresh token exchange (full cloud-platform scope for evabot.online@gmail.com)
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
