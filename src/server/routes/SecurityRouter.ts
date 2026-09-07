import { Router, withErrorHandling } from './Router.js';
import { Security } from '../../core/Security.js';

export function createSecurityRouter(): Router {
  const router = new Router();

  router.get('/api/security/status', withErrorHandling(async (ctx) => {
    ctx.sendJson(200, Security.getStats());
  }));

  router.get('/api/security/report', withErrorHandling(async (ctx) => {
    ctx.res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    ctx.res.end(Security.getSecurityReport());
  }));

  router.post('/api/security/block', withErrorHandling(async (ctx) => {
    const body = await ctx.parseJsonBody();
    const { ip, reason, durationMs } = body;
    if (!ip) {
      ctx.sendJson(400, { error: 'Missing "ip" parameter' });
      return;
    }
    Security.blockIP(ip, reason || 'manual block', durationMs);
    ctx.sendJson(200, { blocked: ip, reason });
  }));

  router.post('/api/security/unblock', withErrorHandling(async (ctx) => {
    const body = await ctx.parseJsonBody();
    const { ip } = body;
    if (!ip) {
      ctx.sendJson(400, { error: 'Missing "ip" parameter' });
      return;
    }
    Security.unblockIP(ip);
    ctx.sendJson(200, { unblocked: ip });
  }));

  return router;
}
