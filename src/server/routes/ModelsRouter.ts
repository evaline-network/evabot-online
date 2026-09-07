import { Router, withErrorHandling } from './Router.js';
import { ModelRegistry } from '../../models/ModelRegistry.js';
import { ModelRatings, ModelCommand } from '../../models/ModelRatings.js';
import { logger, LogCategory } from '../../core/Logger.js';

export function createModelsRouter(): Router {
  const router = new Router();

  router.get('/api/models', withErrorHandling(async (ctx) => {
    ctx.sendJson(200, {
      models: ModelRegistry.getAllModels(),
      categories: ModelRegistry.getCategories(),
      defaultModel: 'gemini-2.5-flash',
      stats: {
        total: ModelRegistry.getAllModels().length,
        free: ModelRegistry.getFreeModels().length,
        paid: ModelRegistry.getPaidOnlyModels().length,
      },
    });
  }));

  router.get('/api/models/free', withErrorHandling(async (ctx) => {
    const models = ModelRegistry.getFreeModels();
    ctx.sendJson(200, {
      count: models.length,
      models: models.map((m) => ({ ...m, rating: ModelRatings.computeRating(m) })),
    });
  }));

  router.get('/api/models/paid', withErrorHandling(async (ctx) => {
    const models = ModelRegistry.getPaidOnlyModels();
    ctx.sendJson(200, {
      count: models.length,
      models: models.map((m) => ({ ...m, rating: ModelRatings.computeRating(m) })),
    });
  }));

  router.get('/api/models/top', withErrorHandling(async (ctx) => {
    const dimension = (ctx.query.get('dimension') || 'quality') as 'quality' | 'speed' | 'context' | 'cost';
    const limit = parseInt(ctx.query.get('limit') || '10', 10);
    const freeOnly = ctx.query.get('free') === 'true';
    const entries = ModelRatings.rankByDimension(dimension, limit, freeOnly);
    ctx.sendJson(200, { dimension, freeOnly, limit, count: entries.length, entries });
  }));

  router.post('/api/models/command', withErrorHandling(async (ctx) => {
    const body = await ctx.parseJsonBody();
    const command = body.command || '';
    const result = ModelCommand.execute(command);
    logger.info(LogCategory.USER, 'MODEL_COMMAND', command, { ip: ctx.clientIp });
    ctx.sendJson(200, { result });
  }));

  return router;
}
