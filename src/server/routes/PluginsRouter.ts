import { Router, withErrorHandling } from './Router.js';
import { pluginManager } from '../../core/plugin-system/PluginManager.js';

export function createPluginsRouter(): Router {
  const router = new Router();

  router.get('/api/plugins', withErrorHandling(async (ctx) => {
    ctx.sendJson(200, {
      count: pluginManager.list().length,
      plugins: pluginManager.list(),
    });
  }));

  router.get('/api/plugins/health', withErrorHandling(async (ctx) => {
    const health = await pluginManager.healthCheckAll();
    ctx.sendJson(200, { health });
  }));

  router.get('/api/plugins/:id', withErrorHandling(async (ctx) => {
    const id = (ctx as any).params?.id || ctx.pathname.split('/').pop();
    const plugin = pluginManager.get(id);
    if (!plugin) {
      ctx.sendJson(404, { error: `Plugin ${id} not found` });
      return;
    }
    ctx.sendJson(200, {
      id,
      manifest: plugin.manifest,
      status: pluginManager.getStatus(id),
    });
  }));

  router.post('/api/plugins/:id/enable', withErrorHandling(async (ctx) => {
    const id = (ctx as any).params?.id || ctx.pathname.split('/')[3];
    await pluginManager.enable(id);
    ctx.sendJson(200, { enabled: true, id });
  }));

  router.post('/api/plugins/:id/disable', withErrorHandling(async (ctx) => {
    const id = (ctx as any).params?.id || ctx.pathname.split('/')[3];
    await pluginManager.disable(id);
    ctx.sendJson(200, { disabled: true, id });
  }));

  return router;
}
