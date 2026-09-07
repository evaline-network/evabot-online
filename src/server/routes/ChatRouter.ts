import { Router, withErrorHandling } from './Router.js';
import { UniversalLlmClient, LlmProvider } from '../../core/UniversalLlmClient.js';
import { ConsiliumEngine, ConsiliumMode } from '../../core/ConsiliumEngine.js';
import { Config } from '../../core/Config.js';
import { CORPORATE_ROLES } from '../../core/CorporateRoles.js';
import { logger, LogCategory } from '../../core/Logger.js';

export class ChatRouter extends Router {
  constructor() {
    super();
    
    this.post('/api/chat', withErrorHandling(async (ctx) => {
      const body = await ctx.parseJsonBody();
      const { message, model, history = [], apiKey, systemInstruction, provider } = body;
      if (!message || typeof message !== 'string') {
        ctx.sendJson(400, { error: 'Missing or invalid "message" parameter' });
        return;
      }
      const targetModel = model || Config.defaultModel;
      const client = new UniversalLlmClient(apiKey || Config.geminiApiKey || undefined);
      const messages = [...history, { role: 'user', content: message.trim() }];
      const responseText = await client.generateContent(targetModel, messages, {
        systemInstruction: systemInstruction || Config.defaultSystemInstruction,
        provider: provider as LlmProvider | undefined, apiKey,
      });
      logger.logUserAction('CHAT_MESSAGE', { model: targetModel, length: message.length }, ctx.clientIp);
      ctx.sendJson(200, { response: responseText, model: targetModel, provider: client.resolveProvider(targetModel, provider) });
    }));

    this.post('/api/chat/stream', withErrorHandling(async (ctx) => {
      const body = await ctx.parseJsonBody();
      const { message, model, history = [], apiKey, systemInstruction, provider } = body;
      if (!message || typeof message !== 'string') {
        ctx.sendJson(400, { error: 'Missing or invalid "message" parameter' });
        return;
      }
      const targetModel = model || Config.defaultModel;
      const client = new UniversalLlmClient(apiKey || Config.geminiApiKey || undefined);
      const messages = [...history, { role: 'user', content: message.trim() }];
      
      ctx.res.writeHead(200, {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      });
      
      const fullText = await client.streamContent(
        targetModel, messages,
        (chunk) => { ctx.res.write(`data: ${JSON.stringify({ chunk })}\n\n`); },
        { systemInstruction: systemInstruction || Config.defaultSystemInstruction, provider: provider as LlmProvider | undefined, apiKey }
      );
      ctx.res.write(`data: ${JSON.stringify({ done: true, fullText })}\n\n`);
      ctx.res.end();
    }));

    this.post('/api/consilium', withErrorHandling(async (ctx) => {
      const body = await ctx.parseJsonBody();
      const { prompt, mode = 'consilium', models, participants, rounds, synthesizerModel, systemInstruction, apiKey, useKnowledgeBase = true } = body;
      if (!prompt || typeof prompt !== 'string') {
        ctx.sendJson(400, { error: 'Missing or invalid "prompt" parameter' });
        return;
      }
      const validModes: ConsiliumMode[] = ['solo', 'broadcast', 'dialogue', 'consilium'];
      if (!validModes.includes(mode)) {
        ctx.sendJson(400, { error: `Invalid "mode". Expected: ${validModes.join(', ')}` });
        return;
      }
      const engine = new ConsiliumEngine(apiKey || Config.geminiApiKey || undefined);
      const result = await engine.run({
        mode, prompt: prompt.trim(), models, participants,
        rounds: typeof rounds === 'number' ? rounds : undefined,
        synthesizerModel, systemInstruction, apiKey,
        useKnowledgeBase: Boolean(useKnowledgeBase),
      });
      ctx.sendJson(200, { success: true, result });
    }));

    this.get('/api/roles', withErrorHandling(async (ctx) => {
      const rolesList = Object.values(CORPORATE_ROLES).map((role) => ({
        id: role.id, name: role.name, title: role.title, department: role.department,
        description: role.description, preferredModel: role.preferredModel,
        suggestedTemperature: role.suggestedTemperature,
        knowledgeAccessLevel: role.knowledgeAccessLevel, systemPrompt: role.systemPrompt,
      }));
      ctx.sendJson(200, { roles: rolesList, count: rolesList.length });
    }));
  }
}
