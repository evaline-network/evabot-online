import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { ModelRegistry } from '../models/ModelRegistry.js';
import { ModelRatings, ModelCommand } from '../models/ModelRatings.js';
import { UniversalLlmClient } from '../core/UniversalLlmClient.js';
import { ConsiliumEngine } from '../core/ConsiliumEngine.js';
import { CORPORATE_ROLES } from '../core/CorporateRoles.js';
import { GoogleAuthProvider } from '../core/GoogleAuthProvider.js';
import { BootDiagnostics } from '../core/BootDiagnostics.js';
import { Config } from '../core/Config.js';
import { logger } from '../core/Logger.js';
import { ClusterMonitor } from '../core/ClusterMonitor.js';
import { TuiRenderer } from '../core/TuiRenderer.js';
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
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Gemini-Key, X-OmniRoute-Key, X-OpenRouter-Key',
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
            catch {
                reject(new Error('Malformed JSON body'));
            }
        });
        req.on('error', reject);
    });
}
export function createServer() {
    ClusterMonitor.init();
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
                version: 'v0.0.1 MVP',
                server: 'evabot-online-edge',
                uptimeSeconds: Math.floor(process.uptime()),
                memoryUsageMb: Math.round(process.memoryUsage().rss / (1024 * 1024)),
                systemLoad: os.loadavg()[0].toFixed(2),
                cpuCores: os.cpus().length,
                totalMemoryMb: Math.round(os.totalmem() / (1024 * 1024)),
                freeMemoryMb: Math.round(os.freemem() / (1024 * 1024)),
                availableModels: ModelRegistry.getAllModels().length,
                hasServerApiKey: Boolean(creds),
                authSource: creds ? creds.source : 'None',
                account: creds ? creds.account : 'evabot.online@gmail.com',
                supportedProviders: ['google', 'omniroute', 'openrouter', 'opencode'],
                omnirouteEndpoint: Config.omnirouteBaseUrl,
                availableRolesCount: Object.keys(CORPORATE_ROLES).length,
                cluster: {
                    evaBrain: {
                        host: 'evabot-agent-vm',
                        role: 'AI Neural Core, Consilium & API Backend',
                        location: 'europe-west3-a (Frankfurt, Germany)',
                        ipWan: '34.159.202.82',
                        ipMesh: '100.66.98.4',
                        cpu: '8 vCPU (Intel Xeon Sapphire Rapids)',
                        systemLoad: os.loadavg()[0].toFixed(2),
                        memoryTotalMb: Math.round(os.totalmem() / (1024 * 1024)),
                        memoryFreeMb: Math.round(os.freemem() / (1024 * 1024)),
                        memoryUsedMb: Math.round((os.totalmem() - os.freemem()) / (1024 * 1024)),
                        status: 'HEALTHY [OK]',
                    },
                    evaFace: {
                        host: 'evaline-micro-vm',
                        role: 'Edge Ingress, Caddy & Mesh Gateway',
                        location: 'us-central1-a (Iowa, USA)',
                        ipWan: '136.114.26.252',
                        ipMesh: '100.125.200.49',
                        cpu: '2 vCPU (e2-micro)',
                        loadAvg: ClusterMonitor.getMicroMetrics().loadAvg,
                        cpuPct: ClusterMonitor.getMicroMetrics().cpuPct,
                        memoryTotalMb: ClusterMonitor.getMicroMetrics().memTotalMb,
                        memoryUsedMb: ClusterMonitor.getMicroMetrics().memUsedMb,
                        memoryFreeMb: ClusterMonitor.getMicroMetrics().memFreeMb,
                        memoryAvailMb: ClusterMonitor.getMicroMetrics().memAvailMb,
                        uptimeStr: ClusterMonitor.getMicroMetrics().uptimeStr,
                        oomShield: 'ACTIVE',
                        webServer: 'Caddy 2.11 (TLS 1.3 / HTTP/3 QUIC)',
                        domains: ['evabot.online', 'evaline.network', 'evaline.online', 'evaline.website'],
                        status: 'HEALTHY [OK]',
                    },
                    wireguard: {
                        status: 'OPERATIONAL [OK]',
                        tunnel: '100.125.200.49 (USA) <-> 100.66.98.4 (Germany)',
                        cipher: 'ChaCha20-Poly1305',
                        latencyMs: ClusterMonitor.getMeshLatency(),
                    },
                    processes: ClusterMonitor.getProcesses(),
                }
            });
            return;
        }
        // Live Real-Time Logs & Process Inspection
        if (pathname === '/api/logs' && req.method === 'GET') {
            sendJson(res, 200, {
                success: true,
                clusterTime: new Date().toISOString(),
                meshLatencyMs: ClusterMonitor.getMeshLatency(),
                microMetrics: ClusterMonitor.getMicroMetrics(),
                domainLogs: ClusterMonitor.getDomainLogs(),
                systemLogs: ClusterMonitor.getSystemLogs(),
                processes: ClusterMonitor.getProcesses(),
            });
            return;
        }
        // Live Boot Sequence & Diagnostics Probe
        if (pathname === '/api/diagnostics/boot' && req.method === 'GET') {
            const activeModel = parsedUrl.searchParams.get('model') || 'gemini-3.8-flash';
            const report = await BootDiagnostics.runDiagnostics(activeModel);
            sendJson(res, 200, report);
            return;
        }
        // Master Chronicle & Daily Worklog API Endpoints (TSV / LOG / TXT / MD)
        if (pathname === '/api/worklog' && req.method === 'GET') {
            const tsvPath = path.resolve(process.cwd(), 'worklog.tsv');
            const logPath = path.resolve(process.cwd(), 'worklog.log');
            const mdPath = path.resolve(process.cwd(), 'WORKLOG.md');
            let rows = [];
            if (fs.existsSync(tsvPath)) {
                const lines = fs.readFileSync(tsvPath, 'utf8').trim().split('\n');
                for (let i = 1; i < lines.length; i++) {
                    const parts = lines[i].split('\t');
                    if (parts.length >= 6) {
                        rows.push({
                            timestamp: parts[0],
                            host: parts[1],
                            actor: parts[2],
                            category: parts[3],
                            status: parts[4],
                            event: parts.slice(5).join('\t'),
                        });
                    }
                }
            }
            sendJson(res, 200, {
                success: true,
                totalEvents: rows.length,
                updatedAt: fs.existsSync(tsvPath) ? fs.statSync(tsvPath).mtime.toISOString() : new Date().toISOString(),
                rows: rows,
                formats: {
                    tsv: '/api/worklog/tsv',
                    log: '/api/worklog/log',
                    txt: '/api/worklog/txt',
                    raw: '/api/worklog/raw',
                },
            });
            return;
        }
        if ((pathname === '/api/worklog/tsv' || pathname === '/api/worklog.tsv') && req.method === 'GET') {
            const tsvPath = path.resolve(process.cwd(), 'worklog.tsv');
            if (fs.existsSync(tsvPath)) {
                res.writeHead(200, {
                    'Content-Type': 'text/tab-separated-values; charset=utf-8',
                    'Access-Control-Allow-Origin': '*',
                });
                res.end(fs.readFileSync(tsvPath, 'utf8'));
            }
            else {
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('worklog.tsv not found');
            }
            return;
        }
        if ((pathname === '/api/worklog/log' || pathname === '/api/worklog.log') && req.method === 'GET') {
            const logPath = path.resolve(process.cwd(), 'worklog.log');
            if (fs.existsSync(logPath)) {
                res.writeHead(200, {
                    'Content-Type': 'text/plain; charset=utf-8',
                    'Access-Control-Allow-Origin': '*',
                });
                res.end(fs.readFileSync(logPath, 'utf8'));
            }
            else {
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('worklog.log not found');
            }
            return;
        }
        if ((pathname === '/api/worklog/txt' || pathname === '/api/worklog.txt') && req.method === 'GET') {
            const txtPath = path.resolve(process.cwd(), 'worklog.txt');
            if (fs.existsSync(txtPath)) {
                res.writeHead(200, {
                    'Content-Type': 'text/plain; charset=utf-8',
                    'Access-Control-Allow-Origin': '*',
                });
                res.end(fs.readFileSync(txtPath, 'utf8'));
            }
            else {
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('worklog.txt not found');
            }
            return;
        }
        if (pathname === '/api/worklog/raw' && req.method === 'GET') {
            const worklogPath = path.resolve(process.cwd(), 'WORKLOG.md');
            if (fs.existsSync(worklogPath)) {
                const md = fs.readFileSync(worklogPath, 'utf8');
                res.writeHead(200, {
                    'Content-Type': 'text/markdown; charset=utf-8',
                    'Access-Control-Allow-Origin': '*',
                });
                res.end(md);
            }
            else {
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('WORKLOG.md not found');
            }
            return;
        }
        // Model List & Categorization
        if (pathname === '/api/models' && req.method === 'GET') {
            sendJson(res, 200, {
                models: ModelRegistry.getAllModels(),
                categories: ModelRegistry.getCategories(),
                defaultModel: Config.defaultModel,
                stats: {
                    total: ModelRegistry.getAllModels().length,
                    free: ModelRegistry.getFreeModels().length,
                    paid: ModelRegistry.getPaidOnlyModels().length,
                },
            });
            return;
        }
        // Free Models Only
        if (pathname === '/api/models/free' && req.method === 'GET') {
            const models = ModelRegistry.getFreeModels();
            sendJson(res, 200, {
                count: models.length,
                models: models.map((m) => ({
                    ...m,
                    rating: ModelRatings.computeRating(m),
                })),
            });
            return;
        }
        // Paid Models Only
        if (pathname === '/api/models/paid' && req.method === 'GET') {
            const models = ModelRegistry.getPaidOnlyModels();
            sendJson(res, 200, {
                count: models.length,
                models: models.map((m) => ({
                    ...m,
                    rating: ModelRatings.computeRating(m),
                })),
            });
            return;
        }
        // Top Models (by dimension)
        if (pathname === '/api/models/top' && req.method === 'GET') {
            const dimension = (parsedUrl.searchParams.get('dimension') || 'quality');
            const limit = parseInt(parsedUrl.searchParams.get('limit') || '10', 10);
            const freeOnly = parsedUrl.searchParams.get('free') === 'true';
            const entries = ModelRatings.rankByDimension(dimension, limit, freeOnly);
            sendJson(res, 200, {
                dimension,
                freeOnly,
                limit,
                count: entries.length,
                entries,
            });
            return;
        }
        // Execute Model Command (for terminal)
        if (pathname === '/api/models/command' && req.method === 'POST') {
            try {
                const body = await parseJsonBody(req);
                const command = body.command || '';
                const result = ModelCommand.execute(command);
                sendJson(res, 200, { result });
            }
            catch (err) {
                sendJson(res, 500, { error: err.message });
            }
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
                    provider: provider,
                    apiKey,
                });
                sendJson(res, 200, {
                    response: responseText,
                    model: targetModel,
                    provider: client.resolveProvider(targetModel, provider),
                });
            }
            catch (err) {
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
                const fullText = await client.streamContent(targetModel, messages, (chunk) => {
                    res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
                }, {
                    systemInstruction: systemInstruction || Config.defaultSystemInstruction,
                    provider: provider,
                    apiKey,
                });
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
        // Consilium Multi-Agent Engine (Solo, Broadcast, Dialogue, Consilium)
        if (pathname === '/api/consilium' && req.method === 'POST') {
            try {
                const body = await parseJsonBody(req);
                const { prompt, mode = 'consilium', models, participants, rounds, synthesizerModel, systemInstruction, apiKey, useKnowledgeBase = true, } = body;
                if (!prompt || typeof prompt !== 'string') {
                    sendJson(res, 400, { error: 'Missing or invalid "prompt" parameter' });
                    return;
                }
                const validModes = ['solo', 'broadcast', 'dialogue', 'consilium'];
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
            }
            catch (err) {
                logger.error('Server', `Consilium error: ${err.message}`);
                sendJson(res, 500, { error: err.message || 'Consilium execution error' });
            }
            return;
        }
        // Raw un-ui Markdown & Text Template Serving
        if (pathname === '/raw' || pathname === '/site.unui.md' || pathname === '/site.unui.txt' || pathname === '/unui' || pathname.endsWith('.unui.md') || pathname.endsWith('.unui.txt')) {
            const host = (req.headers.host || 'evabot.online').toString();
            if (pathname.endsWith('.unui.txt') || pathname === '/site.unui.txt') {
                const raw = TuiRenderer.getRawTextTemplate(host);
                res.writeHead(200, {
                    'Content-Type': 'text/plain; charset=utf-8',
                    'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, proxy-revalidate',
                    'Access-Control-Allow-Origin': '*',
                });
                res.end(raw);
                return;
            }
            const raw = TuiRenderer.getRawTemplate(host);
            res.writeHead(200, {
                'Content-Type': 'text/markdown; charset=utf-8',
                'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, proxy-revalidate',
                'Access-Control-Allow-Origin': '*',
            });
            res.end(raw);
            return;
        }
        // Unified TUI & Console Dynamic Serving (curl / terminal browsers / modern browsers)
        if (pathname === '/' || pathname === '/index.html' || pathname === '/terminal.txt' || pathname === '/plain') {
            const host = (req.headers.host || 'evabot.online').toString();
            const userAgent = (req.headers['user-agent'] || '').toLowerCase();
            const isCurlOrCli = pathname === '/terminal.txt' || pathname === '/plain' || /(curl|wget|httpie)/i.test(userAgent);
            if (isCurlOrCli) {
                const text = TuiRenderer.renderText(host);
                res.writeHead(200, {
                    'Content-Type': 'text/plain; charset=utf-8',
                    'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, proxy-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                    'Access-Control-Allow-Origin': '*',
                });
                res.end(text);
                return;
            }
            else {
                const html = TuiRenderer.renderHtml(host);
                res.writeHead(200, {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, proxy-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                    'Clear-Site-Data': '"cache"',
                    'Access-Control-Allow-Origin': '*',
                });
                res.end(html);
                return;
            }
        }
        // Static File Serving
        let filePath = '';
        if (pathname.startsWith('/dist/')) {
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
        logger.info('Server', `[+] EvaBot HTTP Server listening on http://${host}:${port}`);
    });
}
if (process.argv[1] && (process.argv[1].endsWith('server.js') || process.argv[1].endsWith('server.ts'))) {
    startServer();
}
