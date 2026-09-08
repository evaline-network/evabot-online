import { Router, withErrorHandling } from './Router.js';
import { extractMultipartFile, readRawBody } from './VoiceRouter.js';
import { AddCommand, type AddFilePayload } from '../../core/AddCommand.js';
import { logger, LogCategory } from '../../core/Logger.js';

/**
 * Extracts the Content-Disposition filename and Content-Type of the first
 * multipart part that carries a filename (complements extractMultipartFile,
 * which returns only the raw part payload).
 */
function extractFileMeta(body: Buffer, contentType: string): { filename: string; mime: string } | null {
  const boundaryMatch = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType);
  if (!boundaryMatch) return null;
  const boundary = `--${(boundaryMatch[1] || boundaryMatch[2]).trim()}`;
  const marker = Buffer.from(boundary);
  let start = body.indexOf(marker);
  while (start !== -1) {
    const headerEnd = body.indexOf('\r\n\r\n', start);
    if (headerEnd === -1) break;
    const headers = body.slice(start, headerEnd).toString('utf8');
    if (/filename="/.test(headers) || /name="(audio|file)"/i.test(headers)) {
      const disposition = /Content-Disposition:[^\r\n]*/i.exec(headers)?.[0] || '';
      const filename = /filename="([^"]*)"/i.exec(disposition)?.[1] || `upload-${Date.now()}`;
      const mime = /Content-Type:\s*([^\r\n]+)/i.exec(headers)?.[1]?.trim() || 'application/octet-stream';
      return { filename, mime };
    }
    start = body.indexOf(marker, headerEnd);
  }
  return null;
}

export function createUploadRouter(): Router {
  const router = new Router();

  // POST /api/upload (multipart/form-data, field "file")
  //   → AddCommand.execute('/add file', {file}) — text-like files land in the
  //   Knowledge Base, binary files are stored as media metadata in the roster.
  router.post('/api/upload', withErrorHandling(async (ctx) => {
    const contentType = ctx.req.headers['content-type'] || '';
    if (!contentType.toLowerCase().includes('multipart/form-data')) {
      ctx.sendJson(400, { ok: false, error: 'Content-Type must be multipart/form-data.' });
      return;
    }
    const body = await readRawBody(ctx.req);
    const payload = extractMultipartFile(body, contentType);
    if (!payload || payload.length === 0) {
      ctx.sendJson(400, { ok: false, error: 'No file part found in multipart body.' });
      return;
    }
    const meta = extractFileMeta(body, contentType);
    const file: AddFilePayload = {
      name: meta?.filename || `upload-${Date.now()}`,
      mime: meta?.mime || 'application/octet-stream',
      data: payload,
    };
    logger.info(LogCategory.HTTP, 'UPLOAD', `${file.name} (${file.mime}, ${file.data.length} bytes) ip=${ctx.clientIp}`);
    const result = await AddCommand.execute('/add file', { file });
    ctx.sendJson(200, { ok: true, result });
  }));

  return router;
}
