import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { ModelRegistry } from '../models/ModelRegistry.js';
import { GeminiClient } from '../core/GeminiClient.js';
import { GoogleAuthProvider } from '../core/GoogleAuthProvider.js';
import { Config } from '../core/Config.js';
import { logger } from '../core/Logger.js';
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.ico': 'image/x-icon',
};
function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Gemini-Key',
    });
    res.end(JSON.stringify(data));
}
function parseJsonBody(req) {
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
            }
            catch (err) {
                reject(new Error('Malformed JSON body'));
            }
        });
        req.on('error', reject);
    });
}
export function createServer() {
    return http.createServer(async (req, res) => {
        const parsedUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
        const pathname = parsedUrl.pathname;
        // Handle CORS preflight
        if (req.method === 'OPTIONS') {
            res.writeHead(204, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Gemini-Key',
            });
            res.end();
            return;
        }
        // Health Check & Ambient Google Cloud Auth Status
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
        // Chat (Unary non-streaming)
        if (pathname === '/api/chat' && req.method === 'POST') {
            try {
                const body = await parseJsonBody(req);
                const { message, model, history = [], apiKey, systemInstruction } = body;
                if (!message || typeof message !== 'string') {
                    sendJson(res, 400, { error: 'Missing or invalid "message" parameter' });
                    return;
                }
                const targetModel = ModelRegistry.isValidModel(model) ? model : Config.defaultModel;
                const client = new GeminiClient(apiKey || Config.geminiApiKey || undefined);
                const contents = [
                    ...history,
                    { role: 'user', parts: [{ text: message.trim() }] },
                ];
                const responseText = await client.generateContent(targetModel, contents, {
                    systemInstruction: systemInstruction || Config.defaultSystemInstruction,
                });
                sendJson(res, 200, {
                    response: responseText,
                    model: targetModel,
                });
            }
            catch (err) {
                logger.error('Server', `Chat error: ${err.message}`);
                const status = (err.message && (err.message.includes('credentials') || err.message.includes('API key'))) ? 401 : 500;
                sendJson(res, status, { error: err.message || 'Internal server error' });
            }
            return;
        }
        // Chat (Real-time SSE Streaming)
        if (pathname === '/api/chat/stream' && req.method === 'POST') {
            try {
                const body = await parseJsonBody(req);
                const { message, model, history = [], apiKey, systemInstruction } = body;
                if (!message || typeof message !== 'string') {
                    sendJson(res, 400, { error: 'Missing or invalid "message" parameter' });
                    return;
                }
                const targetModel = ModelRegistry.isValidModel(model) ? model : Config.defaultModel;
                const client = new GeminiClient(apiKey || Config.geminiApiKey || undefined);
                const contents = [
                    ...history,
                    { role: 'user', parts: [{ text: message.trim() }] },
                ];
                res.writeHead(200, {
                    'Content-Type': 'text/event-stream; charset=utf-8',
                    'Cache-Control': 'no-cache, no-transform',
                    'Connection': 'keep-alive',
                    'Access-Control-Allow-Origin': '*',
                });
                const fullText = await client.streamContent(targetModel, contents, (chunk) => {
                    res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
                }, { systemInstruction: systemInstruction || Config.defaultSystemInstruction });
                res.write(`data: ${JSON.stringify({ done: true, fullText })}\n\n`);
                res.end();
            }
            catch (err) {
                logger.error('Server', `Stream error: ${err.message}`);
                if (!res.headersSent) {
                    sendJson(res, 500, { error: err.message || 'Internal server error' });
                }
                else {
                    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
                    res.end();
                }
            }
            return;
        }
        // Static File Serving
        let filePath = '';
        if (pathname === '/' || pathname === '/index.html') {
            filePath = path.resolve(process.cwd(), 'public', 'index.html');
        }
        else if (pathname.startsWith('/dist/')) {
            filePath = path.resolve(process.cwd(), pathname.slice(1));
        }
        else {
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
export function startServer(port = Config.serverPort, host = Config.serverHost) {
    const server = createServer();
    server.listen(port, host, () => {
        logger.info('Server', `⚡ EvaBot HTTP Server listening on http://${host}:${port}`);
    });
}
if (process.argv[1] && (process.argv[1].endsWith('server.js') || process.argv[1].endsWith('server.ts'))) {
    startServer();
}
