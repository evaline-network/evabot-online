import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { ModelRegistry } from '../models/ModelRegistry.js';
import { UniversalLlmClient, LlmProvider } from '../core/UniversalLlmClient.js';
import { ConsiliumEngine, ConsiliumMode, ConsiliumParticipant } from '../core/ConsiliumEngine.js';
import { CORPORATE_ROLES } from '../core/CorporateRoles.js';
import { GoogleAuthProvider } from '../core/GoogleAuthProvider.js';
import { Config } from '../core/Config.js';
import { logger } from '../core/Logger.js';

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

function sendJson(res: http.ServerResponse, statusCode: number, data: any): void {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Gemini-Key, X-OmniRoute-Key, X-OpenRouter-Key',
  });
  res.end(JSON.stringify(data));
}

function parseJsonBody(req: http.IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 5 * 1024 * 1024) { // 5MB limit
        reject(new Error('Request body too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Malformed JSON body'));
      }
    });
    req.on('error', reject);
  });
}

export function createServer(): http.Server {
  return http.createServer(async (req, res) => {
    const parsedUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Gemini-Key, X-OmniRoute-Key, X-OpenRouter-Key',
      });
      res.end();
      return;
    }

    // Health Check & System Status
    if (pathname === '/api/health' && req.method === 'GET') {
      const creds = await GoogleAuthProvider.getCredentials();
      sendJson(res, 200, {
        status: 'online',
        server: 'evabot-online-edge',
        uptimeSeconds: Math.floor(process.uptime()),
        memoryUsageMb: Math.round(process.memoryUsage().rss / (1024 * 1024)),
        availableModels: ModelRegistry.getAllModels().length,
        hasServerApiKey: Boolean(creds),
        authSource: creds ? creds.source : 'None',
        account: creds ? creds.account : 'evabot.online@gmail.com',
        supportedProviders: ['google', 'omniroute', 'openrouter', 'opencode'],
        omnirouteEndpoint: Config.omnirouteBaseUrl,
        availableRolesCount: Object.keys(CORPORATE_ROLES).length,
      });
      return;
    }

    // Model List & Categorization
    if (pathname === '/api/models' && req.method === 'GET') {
      sendJson(res, 200, {
        models: ModelRegistry.getAllModels(),
        categories: ModelRegistry.getCategories(),
        defaultModel: Config.defaultModel,
      });
      return;
    }

    // EvaLine Corporate Roles Endpoint
    if (pathname === '/api/roles' && req.method === 'GET') {
      const rolesList = Object.values(CORPORATE_ROLES).map((role) => ({
        id: role.id,
        name: role.name,
        title: role.title,
        department: role.department,
        description: role.description,
        preferredModel: role.preferredModel,
        suggestedTemperature: role.suggestedTemperature,
        knowledgeAccessLevel: role.knowledgeAccessLevel,
        systemPrompt: role.systemPrompt,
      }));

      sendJson(res, 200, {
        roles: rolesList,
        count: rolesList.length,
      });
      return;
    }

    // Chat (Unary non-streaming via UniversalLlmClient)
    if (pathname === '/api/chat' && req.method === 'POST') {
      try {
        const body = await parseJsonBody(req);
        const { message, model, history = [], apiKey, systemInstruction, provider } = body;

        if (!message || typeof message !== 'string') {
          sendJson(res, 400, { error: 'Missing or invalid "message" parameter' });
          return;
        }

        const targetModel = model || Config.defaultModel;
        const client = new UniversalLlmClient(apiKey || Config.geminiApiKey || undefined);

        const messages = [
          ...history,
          { role: 'user', content: message.trim() },
        ];

        const responseText = await client.generateContent(targetModel, messages, {
          systemInstruction: systemInstruction || Config.defaultSystemInstruction,
          provider: provider as LlmProvider | undefined,
          apiKey,
        });

        sendJson(res, 200, {
          response: responseText,
          model: targetModel,
          provider: client.resolveProvider(targetModel, provider),
        });
      } catch (err: any) {
        logger.error('Server', `Chat error: ${err.message}`);
        const status = (err.message && (err.message.includes('credentials') || err.message.includes('API key'))) ? 401 : 500;
        sendJson(res, status, { error: err.message || 'Internal server error' });
      }
      return;
    }

    // Chat (Real-time SSE Streaming via UniversalLlmClient)
    if (pathname === '/api/chat/stream' && req.method === 'POST') {
      try {
        const body = await parseJsonBody(req);
        const { message, model, history = [], apiKey, systemInstruction, provider } = body;

        if (!message || typeof message !== 'string') {
          sendJson(res, 400, { error: 'Missing or invalid "message" parameter' });
          return;
        }

        const targetModel = model || Config.defaultModel;
        const client = new UniversalLlmClient(apiKey || Config.geminiApiKey || undefined);

        const messages = [
          ...history,
          { role: 'user', content: message.trim() },
        ];

        res.writeHead(200, {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
        });

        const fullText = await client.streamContent(
          targetModel,
          messages,
          (chunk) => {
            res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
          },
          {
            systemInstruction: systemInstruction || Config.defaultSystemInstruction,
            provider: provider as LlmProvider | undefined,
            apiKey,
          }
        );

        res.write(`data: ${JSON.stringify({ done: true, fullText })}\n\n`);
        res.end();
      } catch (err: any) {
        logger.error('Server', `Stream error: ${err.message}`);
        if (!res.headersSent) {
          sendJson(res, 500, { error: err.message || 'Internal server error' });
        } else {
          res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
          res.end();
        }
      }
      return;
    }

    // Consilium Multi-Agent Engine (Solo, Broadcast, Dialogue, Consilium)
    if (pathname === '/api/consilium' && req.method === 'POST') {
      try {
        const body = await parseJsonBody(req);
        const {
          prompt,
          mode = 'consilium',
          models,
          participants,
          rounds,
          synthesizerModel,
          systemInstruction,
          apiKey,
          useKnowledgeBase = true,
        } = body;

        if (!prompt || typeof prompt !== 'string') {
          sendJson(res, 400, { error: 'Missing or invalid "prompt" parameter' });
          return;
        }

        const validModes: ConsiliumMode[] = ['solo', 'broadcast', 'dialogue', 'consilium'];
        if (!validModes.includes(mode)) {
          sendJson(res, 400, {
            error: `Invalid "mode" parameter. Expected one of: ${validModes.join(', ')}`,
          });
          return;
        }

        const engine = new ConsiliumEngine(apiKey || Config.geminiApiKey || undefined);

        const result = await engine.run({
          mode,
          prompt: prompt.trim(),
          models,
          participants,
          rounds: typeof rounds === 'number' ? rounds : undefined,
          synthesizerModel,
          systemInstruction,
          apiKey,
          useKnowledgeBase: Boolean(useKnowledgeBase),
        });

        sendJson(res, 200, {
          success: true,
          result,
        });
      } catch (err: any) {
        logger.error('Server', `Consilium error: ${err.message}`);
        sendJson(res, 500, { error: err.message || 'Consilium execution error' });
      }
      return;
    }

    // Static File Serving
    let filePath = '';
    if (pathname === '/' || pathname === '/index.html') {
      filePath = path.resolve(process.cwd(), 'public', 'index.html');
    } else if (pathname.startsWith('/dist/')) {
      filePath = path.resolve(process.cwd(), pathname.slice(1));
    } else {
      filePath = path.resolve(process.cwd(), 'public', pathname.slice(1));
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    // 404 Fallback
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
  });
}

export function startServer(port: number = Config.serverPort, host: string = Config.serverHost): void {
  const server = createServer();
  server.listen(port, host, () => {
    logger.info('Server', `⚡ EvaBot HTTP Server listening on http://${host}:${port}`);
  });
}

if (process.argv[1] && (process.argv[1].endsWith('server.js') || process.argv[1].endsWith('server.ts'))) {
  startServer();
}
