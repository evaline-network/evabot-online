import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { logger, LogCategory } from '../core/Logger.js';
import { Config } from '../core/Config.js';
import { Security, securityConfig } from '../core/Security.js';
import { ClusterMonitor } from '../core/ClusterMonitor.js';
import { GoogleAuthProvider } from '../core/GoogleAuthProvider.js';
import { pluginManager } from '../core/plugin-system/PluginManager.js';
import { TuiRenderer } from '../core/TuiRenderer.js';
import { consiliumPlugin } from '../plugins/consilium/index.js';
import { knowledgeBasePlugin } from '../plugins/knowledge-base/index.js';
import { llmProvidersPlugin } from '../plugins/llm-providers/index.js';
import { createModelsRouter } from './routes/ModelsRouter.js';
import { createLogsRouter } from './routes/LogsRouter.js';
import { createSecurityRouter } from './routes/SecurityRouter.js';
import { createAlertsRouter } from './routes/AlertsRouter.js';
import { createPluginsRouter } from './routes/PluginsRouter.js';
import { createVoiceRouter } from './routes/VoiceRouter.js';
import { Router, createRouteContext } from './routes/Router.js';
import { ChatRouter } from './routes/ChatRouter.js';
import { startTelegramBot } from '../telegram/TelegramBot.js';

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function sendJson(res: http.ServerResponse, statusCode: number, data: any): void {
  if (res.headersSent) return;
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Gemini-Key, X-OmniRoute-Key, X-OpenRouter-Key',
  });
  res.end(JSON.stringify(data));
}

function sendText(res: http.ServerResponse, statusCode: number, text: string, contentType: string = 'text/plain; charset=utf-8'): void {
  if (res.headersSent) return;
  res.writeHead(statusCode, {
    'Content-Type': contentType,
    'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, proxy-revalidate',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(text);
}

function parseJsonBody(req: http.IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 5 * 1024 * 1024) reject(new Error('Request body too large'));
    });
    req.on('end', () => {
      if (!body.trim()) return resolve({});
      try { resolve(JSON.parse(body)); } catch { reject(new Error('Malformed JSON body')); }
    });
    req.on('error', reject);
  });
}

async function initializePlugins(): Promise<void> {
  logger.info(LogCategory.SYSTEM, 'Server', 'Initializing plugin system...');
  await pluginManager.register(llmProvidersPlugin);
  await pluginManager.register(consiliumPlugin);
  await pluginManager.register(knowledgeBasePlugin);
  
  const list = pluginManager.list();
  logger.info(LogCategory.SYSTEM, 'Server', `Loaded ${list.length} plugins: ${list.map(p => p.id).join(', ')}`);
}

function buildRouter(): Router {
  const router = new Router();
  
  router.get('/api/health', async (ctx) => {
    const creds = await GoogleAuthProvider.getCredentials();
    const pluginList = pluginManager.list();
    const pluginStatuses = await pluginManager.healthCheckAll();
    
    const micro = ClusterMonitor.getMicroMetrics();
    const meshLatency = ClusterMonitor.getMeshLatency();
    const bLoad = os.loadavg()[0].toFixed(2);
    const bCpuPct = Math.min(100, Math.round((parseFloat(bLoad) / os.cpus().length) * 100));
    const bTotMem = Math.round(os.totalmem() / (1024 * 1024 * 1024));
    const bUsedMem = ((os.totalmem() - os.freemem()) / (1024 * 1024 * 1024)).toFixed(1);

    ctx.sendJson(200, {
      status: 'online',
      version: 'v0.1.0',
      server: 'evabot-online-edge',
      uptimeSeconds: Math.floor(process.uptime()),
      memoryUsageMb: Math.round(process.memoryUsage().rss / (1024 * 1024)),
      systemLoad: bLoad,
      cpuCores: os.cpus().length,
      totalMemoryMb: Math.round(os.totalmem() / (1024 * 1024)),
      freeMemoryMb: Math.round(os.freemem() / (1024 * 1024)),
      availableModels: 78,
      hasServerApiKey: Boolean(creds),
      authSource: creds ? creds.source : 'None',
      databases: {
        chroma: { name: 'ChromaDB Vector', count: 1075, status: 'OK' },
        fts: { name: 'SQLite FTS5', count: 1086, status: 'OK' },
        memoryKb: { name: 'Memory KnowledgeBase', count: 178, status: 'OK' },
        mcp: { name: 'MCP SQLite', status: 'OK' },
      },
      telemetry: {
        frankfurt: {
          load: bLoad,
          cpuPct: bCpuPct,
          memUsedGb: bUsedMem,
          memTotalGb: bTotMem,
        },
        iowa: {
          load: micro.loadAvg.split(',')[0],
          cpuPct: micro.cpuPct,
          memUsedMb: micro.memUsedMb,
          memTotalMb: micro.memTotalMb,
        },
        meshLatencyMs: meshLatency,
      },
      plugins: {
        loaded: pluginList.length,
        active: pluginList.filter(p => p.enabled).length,
        list: pluginList,
        health: pluginStatuses,
      },
    });
  });
  
  const subRouters = [
    createModelsRouter(),
    createLogsRouter(),
    createSecurityRouter(),
    createAlertsRouter(),
    createPluginsRouter(),
    createVoiceRouter(),
  ];
  
  for (const sub of subRouters) {
    for (const route of (sub as any).routes) {
      router.add(route.method, route.pattern as string, route.handler);
    }
  }
  
  const pluginRoutes = pluginManager.getAllPluginRoutes();
  for (const pr of pluginRoutes) {
    router.add(pr.method, pr.path, async (ctx) => {
      const body = ctx.method === 'GET' ? null : await ctx.parseJsonBody().catch(() => ({}));
      const queryObj: any = {};
      ctx.query.forEach((v, k) => { queryObj[k] = v; });
      try {
        const result = await pr.handler(body || {}, queryObj);
        ctx.sendJson(200, result);
      } catch (err: any) {
        ctx.sendJson(err.statusCode || 500, { error: err.message });
      }
    });
  }
  
  const chatRouter = new ChatRouter();
  for (const route of (chatRouter as any).routes) {
    router.add(route.method, route.pattern as string, route.handler);
  }
  
  return router;
}

export function createServer(): http.Server {
  ClusterMonitor.init();
  
  const router = buildRouter();
  
  return http.createServer(async (req, res) => {
    const parsedUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;
    const startTime = Date.now();
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || 'unknown';
    const userAgent = (req.headers['user-agent'] as string) || 'unknown';
    const method = req.method || 'GET';
    
    if (method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Gemini-Key, X-OmniRoute-Key, X-OpenRouter-Key',
      });
      res.end();
      return;
    }
    
    if (securityConfig.blockedIPs.has(clientIp)) {
      logger.warn(LogCategory.SYSTEM, 'SECURITY', `Blocked IP: ${clientIp} -> ${method} ${pathname}`);
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('403 Forbidden');
      return;
    }
    
    const rateCheck = Security.checkRateLimit(clientIp);
    res.setHeader('X-RateLimit-Limit', securityConfig.rateLimit.maxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', rateCheck.remaining.toString());
    res.setHeader('X-RateLimit-Reset', Math.ceil(rateCheck.resetIn / 1000).toString());
    
    if (!rateCheck.allowed) {
      res.writeHead(429, { 'Retry-After': Math.ceil(rateCheck.resetIn / 1000).toString() });
      res.end('429 Too Many Requests');
      return;
    }
    
    const suspCheck = Security.isSuspicious(pathname, method);
    if (suspCheck.suspicious) Security.recordSuspicious(clientIp, suspCheck.reason || 'unknown');
    
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      logger.logHttpRequest(method, pathname, res.statusCode, duration, clientIp, userAgent);
    });
    
    const match = router.match(method, pathname);
    if (match) {
      const ctx = createRouteContext(req, res, pathname, parsedUrl, {
        sendJson: (status, data) => sendJson(res, status, data),
        sendText: (status, text) => sendText(res, status, text),
        parseJsonBody: () => parseJsonBody(req),
      });
      try {
        await match.route.handler(ctx);
      } catch (err: any) {
        logger.error(LogCategory.HTTP, 'ROUTE', `${method} ${pathname}: ${err.message}`);
        if (!res.headersSent) {
          sendJson(res, 500, { error: err.message || 'Internal server error' });
        }
      }
      return;
    }
    
    const staticRoutes = [
      '/', '/index.html',
      '/manifesto', '/manifesto.html',
      '/manifesto-raw', '/manifesto-raw.html',
      '/manifesto-ru', '/manifesto-ru.html',
      '/manifesto-uk', '/manifesto-uk.html',
      '/manifesto-en', '/manifesto-en.html',
      '/manifesto.txt',
      '/hub', '/hub.html',
      '/network', '/network.html',
      '/visualize', '/visualize.html',
      '/terminal', '/terminal.txt', '/plain',
    ];

    if (pathname.startsWith('/dist/') || pathname.startsWith('/fonts/') || staticRoutes.includes(pathname)) {
      let filePath = '';
      const host = (req.headers.host || 'localhost').toLowerCase().replace(/^www\./, '');

      if (pathname.startsWith('/fonts/')) {
        // Self-hosted static fonts (public/fonts) — path-sanitized, no traversal
        const rel = pathname.slice('/fonts/'.length).replace(/\\/g, '/').replace(/\.\./g, '');
        filePath = path.resolve(process.cwd(), 'public', 'fonts', rel);
      } else if (pathname.startsWith('/dist/')) {
        filePath = path.resolve(process.cwd(), pathname.slice(1));
      } else if (pathname === '/manifesto.txt') {
        const txtPath = path.resolve(process.cwd(), 'public', 'manifesto.txt');
        if (fs.existsSync(txtPath)) {
          sendText(res, 200, fs.readFileSync(txtPath, 'utf-8'), 'text/plain; charset=utf-8');
          return;
        }
      } else if (pathname === '/manifesto-raw' || pathname === '/manifesto-raw.html') {
        filePath = path.resolve(process.cwd(), 'public', 'manifesto-raw.html');
      } else if (pathname === '/manifesto-ru' || pathname === '/manifesto-ru.html') {
        filePath = path.resolve(process.cwd(), 'public', 'manifesto-ru.html');
      } else if (pathname === '/manifesto-uk' || pathname === '/manifesto-uk.html') {
        filePath = path.resolve(process.cwd(), 'public', 'manifesto-uk.html');
      } else if (pathname === '/manifesto-en' || pathname === '/manifesto-en.html') {
        filePath = path.resolve(process.cwd(), 'public', 'manifesto-en.html');
      } else if (pathname === '/manifesto' || pathname === '/manifesto.html') {
        const ua = (req.headers['user-agent'] || '').toLowerCase();
        if (ua.includes('curl') || ua.includes('wget') || ua.includes('httpie')) {
          const txtPath = path.resolve(process.cwd(), 'public', 'manifesto.txt');
          if (fs.existsSync(txtPath)) {
            sendText(res, 200, fs.readFileSync(txtPath, 'utf-8'), 'text/plain; charset=utf-8');
            return;
          }
        }
        if (ua.includes('lynx') || ua.includes('w3m') || ua.includes('elinks')) {
          const lang = parsedUrl.searchParams.get('lang');
          const file = lang === 'uk' ? 'manifesto-uk.html' : lang === 'en' ? 'manifesto-en.html' : 'manifesto-ru.html';
          filePath = path.resolve(process.cwd(), 'public', file);
        } else {
          filePath = path.resolve(process.cwd(), 'public', 'manifesto.html');
        }
      } else if (pathname === '/hub' || pathname === '/hub.html') {
        filePath = path.resolve(process.cwd(), 'public', 'hub.html');
      } else if (pathname === '/network' || pathname === '/network.html' || pathname === '/visualize' || pathname === '/visualize.html') {
        filePath = path.resolve(process.cwd(), 'public', 'network.html');
      } else if (pathname === '/' || pathname === '/index.html') {
        const ua = (req.headers['user-agent'] || '').toLowerCase();
        const isCurl = ua.includes('curl') || ua.includes('wget') || ua.includes('httpie');
        const isTextBrowser = ua.includes('lynx') || ua.includes('w3m') || ua.includes('elinks');

        if (host.includes('evaline.online')) {
          if (isCurl) {
            const txtPath = path.resolve(process.cwd(), 'public', 'manifesto.txt');
            if (fs.existsSync(txtPath)) {
              sendText(res, 200, fs.readFileSync(txtPath, 'utf-8'), 'text/plain; charset=utf-8');
              return;
            }
          }
          if (isTextBrowser) {
            const lang = parsedUrl.searchParams.get('lang');
            const file = lang === 'uk' ? 'manifesto-uk.html' : lang === 'en' ? 'manifesto-en.html' : 'manifesto-ru.html';
            filePath = path.resolve(process.cwd(), 'public', file);
          } else {
            filePath = path.resolve(process.cwd(), 'public', 'manifesto.html');
          }
        } else if (isCurl || isTextBrowser) {
          const text = TuiRenderer.renderText(host);
          sendText(res, 200, text, 'text/plain; charset=utf-8');
          return;
        } else if (host.includes('evaline.website')) {
          filePath = path.resolve(process.cwd(), 'public', 'hub.html');
        } else if (host.includes('evaline.network')) {
          const text = TuiRenderer.renderHtml(host);
          sendText(res, 200, text, 'text/html; charset=utf-8');
          return;
        } else {
          filePath = path.resolve(process.cwd(), 'public', 'index.html');
        }
      } else if (pathname === '/terminal' || pathname === '/terminal.txt' || pathname === '/plain') {
        const isCurl = (req.headers['user-agent'] || '').toLowerCase().includes('curl');
        const text = isCurl ? TuiRenderer.renderText(host) : TuiRenderer.renderHtml(host);
        const contentType = isCurl ? 'text/plain; charset=utf-8' : 'text/html; charset=utf-8';
        sendText(res, 200, text, contentType);
        return;
      }
      
      if (filePath && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
        return;
      }
    }
    
    sendText(res, 404, 'Not Found');
  });
}

export async function startServerAsync(port: number = Config.serverPort, host: string = Config.serverHost): Promise<void> {
  await initializePlugins();
  const server = createServer();
  
  server.listen(port, host, () => {
    logger.info(LogCategory.SYSTEM, 'Server', `[+] EvaBot HTTP Server listening on http://${host}:${port}`);
  });

  try {
    startTelegramBot();
  } catch (err: any) {
    logger.warn(LogCategory.SYSTEM, 'Server', `Telegram bot init failed: ${err.message}`);
  }
  
  process.on('SIGTERM', async () => {
    logger.info(LogCategory.SYSTEM, 'Server', 'Shutting down...');
    await pluginManager.shutdownAll();
    server.close();
  });
}

export function startServer(port: number = Config.serverPort, host: string = Config.serverHost): void {
  startServerAsync(port, host).catch(err => {
    logger.error(LogCategory.SYSTEM, 'Server', `Failed to start: ${err.message}`);
  });
}

if (process.argv[1] && (process.argv[1].endsWith('server.js') || process.argv[1].endsWith('server.ts'))) {
  startServer();
}
