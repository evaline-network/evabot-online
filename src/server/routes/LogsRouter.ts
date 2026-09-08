import { Router, withErrorHandling } from './Router.js';
import { logger, LogLevel } from '../../core/Logger.js';
import { ClusterMonitor } from '../../core/ClusterMonitor.js';

export function createLogsRouter(): Router {
  const router = new Router();

  router.get('/api/logs', withErrorHandling(async (ctx) => {
    const domainLogs = ClusterMonitor.getDomainLogs();
    const systemLogs = ClusterMonitor.getSystemLogs();
    const processes = ClusterMonitor.getProcesses();
    const microMetrics = ClusterMonitor.getMicroMetrics();
    const meshLatencyMs = ClusterMonitor.getMeshLatency();
    ctx.sendJson(200, {
      domainLogs,
      systemLogs,
      processes,
      microMetrics,
      meshLatencyMs,
    });
  }));

  router.get('/api/logs/files', withErrorHandling(async (ctx) => {
    const files = logger.listLogFiles();
    const stats = logger.getLogFiles();
    ctx.sendJson(200, { files, paths: stats });
  }));

  router.get('/api/logs/read', withErrorHandling(async (ctx) => {
    const filename = ctx.query.get('file') || 'evabot.log';
    const lines = parseInt(ctx.query.get('lines') || '200', 10);
    const content = logger.readLogFile(filename, lines);
    ctx.sendJson(200, { filename, lines, content });
  }));

  router.get('/api/logs/recent', withErrorHandling(async (ctx) => {
    const limit = parseInt(ctx.query.get('limit') || '50', 10);
    const levelStr = ctx.query.get('level');
    const category = ctx.query.get('category');
    const level = levelStr ? LogLevel[levelStr.toUpperCase() as keyof typeof LogLevel] : undefined;
    const logs = logger.getRecentLogs(limit, level, category || undefined);
    ctx.sendJson(200, { count: logs.length, logs });
  }));

  return router;
}
