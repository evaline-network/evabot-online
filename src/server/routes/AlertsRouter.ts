import { Router, withErrorHandling } from './Router.js';
import { alertManager, AlertSeverity } from '../../core/AlertManager.js';

export function createAlertsRouter(): Router {
  const router = new Router();

  router.get('/api/alerts', withErrorHandling(async (ctx) => {
    const limit = parseInt(ctx.query.get('limit') || '50', 10);
    const severity = (ctx.query.get('severity') || '') as AlertSeverity | '';
    const alerts = alertManager.getRecentAlerts(limit, severity || undefined);
    ctx.sendJson(200, { count: alerts.length, alerts });
  }));

  router.get('/api/alerts/stats', withErrorHandling(async (ctx) => {
    ctx.sendJson(200, alertManager.getStats());
  }));

  router.post('/api/alerts/send', withErrorHandling(async (ctx) => {
    const body = await ctx.parseJsonBody();
    const { severity, title, message, source, metadata } = body;
    if (!severity || !title || !message) {
      ctx.sendJson(400, { error: 'Missing severity/title/message' });
      return;
    }
    const event = await alertManager.alert(severity, title, message, source, metadata);
    ctx.sendJson(200, { sent: true, event });
  }));

  router.post('/api/alerts/channel', withErrorHandling(async (ctx) => {
    const body = await ctx.parseJsonBody();
    const { type, enabled } = body;
    alertManager.setChannelEnabled(type, enabled);
    ctx.sendJson(200, { type, enabled });
  }));

  router.get('/api/alerts/config', withErrorHandling(async (ctx) => {
    ctx.sendJson(200, alertManager.getConfig());
  }));

  return router;
}
