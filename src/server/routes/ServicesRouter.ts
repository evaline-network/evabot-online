import { Router, withErrorHandling } from './Router.js';
import { Config } from '../../core/Config.js';
import { Security } from '../../core/Security.js';
import { pluginManager } from '../../core/plugin-system/PluginManager.js';

interface ServiceStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'offline';
  details?: string;
}

export function createServicesRouter(): Router {
  const router = new Router();

  router.get('/api/services', withErrorHandling(async (ctx) => {
    const services: ServiceStatus[] = [];

    const securityStatus = Security.getStats();
    services.push({
      name: 'security',
      status: 'healthy',
      details: `${securityStatus.blockedIPs} blocked IPs`,
    });

    const pluginHealth = await pluginManager.healthCheckAll();
    for (const [id, info] of Object.entries(pluginHealth)) {
      services.push({
        name: `plugin:${id}`,
        status: info.status === 'healthy' ? 'healthy' : info.status === 'degraded' ? 'degraded' : 'offline',
        details: info.message,
      });
    }

    const allHealthy = services.every((s) => s.status === 'healthy');
    ctx.sendJson(200, {
      status: allHealthy ? 'healthy' : 'degraded',
      services,
    });
  }));

  router.get('/api/services/health', withErrorHandling(async (ctx) => {
    const pluginHealth = await pluginManager.healthCheckAll();
    ctx.sendJson(200, {
      security: { status: 'healthy' },
      plugins: pluginHealth,
    });
  }));

  return router;
}
