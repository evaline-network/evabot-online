import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { logger, LogCategory } from '../core/Logger.js';
import { Config } from '../core/Config.js';
import { knowledgeBase } from '../core/KnowledgeBase.js';
import { Security, securityConfig } from '../core/Security.js';
import { ClusterMonitor } from '../core/ClusterMonitor.js';
import { GoogleAuthProvider } from '../core/GoogleAuthProvider.js';
import { TuiRenderer } from '../core/TuiRenderer.js';
import { createModelsRouter } from './routes/ModelsRouter.js';
import { createKbRouter } from './routes/KbRouter.js';
import { createLogsRouter } from './routes/LogsRouter.js';
import { createSecurityRouter } from './routes/SecurityRouter.js';
import { createAlertsRouter } from './routes/AlertsRouter.js';
import { Router, createRouteContext } from './routes/Router.js';
import { ChatRouter } from './routes/ChatRouter.js';

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

function buildRouter(): Router {
  const router = new Router();
  
  router.get('/api/health', async (ctx) => {
    const creds = await GoogleAuthProvider.getCredentials();
    ctx.sendJson(200, {
      status: 'online', version: 'v0.0.2', server: 'evabot-online-edge',
      uptimeSeconds: Math.floor(process.uptime()),
      memoryUsageMb: Math.round(process.memoryUsage().rss / (1024 * 1024)),
      systemLoad: os.loadavg()[0].toFixed(2),
      cpuCores: os.cpus().length,
      totalMemoryMb: Math.round(os.totalmem() / (1024 * 1024)),
      freeMemoryMb: Math.round(os.freemem() / (1024 * 1024)),
      availableModels: 78,
      hasServerApiKey: Boolean(creds),
      authSource: creds ? creds.source : 'None',
      kbEnabled: true,
      securityEnabled: true,
    });
  });
  
  const subRouters = [
    createModelsRouter(),
    createKbRouter(),
    createLogsRouter(),
    createSecurityRouter(),
    createAlertsRouter(),
  ];
  
  for (const sub of subRouters) {
    for (const route of (sub as any).routes) {
      router.add(route.method, route.pattern as string, route.handler);
    }
  }
  
  const chatRouter = new ChatRouter();
  for (const route of (chatRouter as any).routes) {
    router.add(route.method, route.pattern as string, route.handler);
  }
  
  return router;
}

export function createServer(): http.Server {
  ClusterMonitor.init();
  knowledgeBase.initialize().catch((err) => {
    logger.error(LogCategory.KB, 'INIT', `Failed to initialize KB: ${err.message}`);
  });
  
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
    
    // Security
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
    
    // Try router
    const match = router.match(method, pathname);
    if (match) {
      const ctx = createRouteContext(req, res, pathname, parsedUrl, {
        sendJson: (status, data) => sendJson(res, status, data),
        sendText: (status, text) => sendText(res, status, text),
        parseJsonBody: () => parseJsonBody(req),
      });
      await match.route.handler(ctx);
      return;
    }
    
    // Static files
    if (pathname.startsWith('/dist/') || pathname === '/') {
      let filePath = '';
      if (pathname.startsWith('/dist/')) {
        filePath = path.resolve(process.cwd(), pathname.slice(1));
      } else {
        // Root - serve index.html
        const indexPath = path.resolve(process.cwd(), 'public', 'index.html');
        if (fs.existsSync(indexPath)) {
          const content = fs.readFileSync(indexPath);
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(content);
          return;
        }
      }
      
      if (filePath && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
        return;
      }
    }
    
    // 404
    sendText(res, 404, 'Not Found');
  });
}

export function startServer(port: number = Config.serverPort, host: string = Config.serverHost): void {
  const server = createServer();
  server.listen(port, host, () => {
    logger.info(LogCategory.SYSTEM, 'Server', `[+] EvaBot HTTP Server listening on http://${host}:${port}`);
  });
}

if (process.argv[1] && (process.argv[1].endsWith('server.js') || process.argv[1].endsWith('server.ts'))) {
  startServer();
}
