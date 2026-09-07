import { Router, withErrorHandling } from './Router.js';
import { UniversalLlmClient, LlmProvider } from '../../core/UniversalLlmClient.js';
import { ConsiliumEngine, ConsiliumMode } from '../../core/ConsiliumEngine.js';
import { Config } from '../../core/Config.js';
import { CORPORATE_ROLES, KnowledgeBaseConnector } from '../../core/CorporateRoles.js';
import { rulesEngine } from '../../core/RulesEngine.js';
import { applyLocalePolicy } from '../../core/LocalePolicy.js';
import { logger } from '../../core/Logger.js';
import { ChatHistoryStore, CONSILIUM_SESSION_ID } from '../../core/ChatHistoryStore.js';
import { I18nEngine } from '../../core/I18nEngine.js';
import { isDebugOn, startSpan, renderDebugFooter } from '../../core/OpLog.js';

/**
 * Fire-and-forget chat persistence: a DB failure must never break the chat flow.
 */
function persistChatMessage(
  sessionId: string,
  role: string,
  content: string,
  model?: string
): void {
  try {
    ChatHistoryStore.getInstance().appendMessage({
      sessionId,
      role,
      content,
      model: model || '',
      lang: I18nEngine.getLocale(),
    });
  } catch (err: any) {
    logger.warn('ChatRouter', `Chat history persistence skipped: ${err.message}`);
  }
}

export class ChatRouter extends Router {
  private kbConnector: KnowledgeBaseConnector;

  constructor() {
    super();
    this.kbConnector = new KnowledgeBaseConnector();

    this.post('/api/chat', withErrorHandling(async (ctx) => {
      const body = await ctx.parseJsonBody();
      const { message, model, history = [], apiKey, systemInstruction, provider, roleId, useKnowledgeBase = true } = body;
      if (!message || typeof message !== 'string') {
        ctx.sendJson(400, { error: 'Missing or invalid "message" parameter' });
        return;
      }
      const targetModel = model || Config.defaultModel;
      const client = new UniversalLlmClient(apiKey || Config.geminiApiKey || undefined);

      let effectiveInstruction = this.resolveSystemInstruction(roleId, systemInstruction);

      if (useKnowledgeBase) {
        try {
          const docs = await this.kbConnector.search(message, { limit: 3 });
          if (docs.length > 0) {
            effectiveInstruction += `\n${this.kbConnector.formatContextForPrompt(docs)}`;
          }
        } catch (e: any) {
          logger.warn('ChatRouter', `KB retrieval skipped: ${e.message}`);
        }
      }

      const messages = [...history, { role: 'user', content: message.trim() }];
      const span = startSpan(targetModel, client.resolveProvider(targetModel, provider));
      const responseText = await client.generateContent(targetModel, messages, {
        systemInstruction: effectiveInstruction,
        provider: provider as LlmProvider | undefined,
        apiKey,
      });
      span.end();
      const debugFooter = isDebugOn() ? `\n${renderDebugFooter(span)}` : '';

      const chatSessionId = typeof body.sessionId === 'string' && body.sessionId ? body.sessionId : 'web-default';
      persistChatMessage(chatSessionId, 'user', message.trim(), targetModel);
      persistChatMessage(chatSessionId, 'assistant', responseText, targetModel);

      logger.logUserAction('CHAT_MESSAGE', { model: targetModel, length: message.length, roleId }, ctx.clientIp);
      ctx.sendJson(200, {
        response: responseText + debugFooter,
        model: targetModel,
        provider: client.resolveProvider(targetModel, provider),
        roleId: roleId || 'default',
      });
    }));

    this.post('/api/chat/stream', withErrorHandling(async (ctx) => {
      const body = await ctx.parseJsonBody();
      const { message, model, history = [], apiKey, systemInstruction, provider, roleId, useKnowledgeBase = true } = body;
      if (!message || typeof message !== 'string') {
        ctx.sendJson(400, { error: 'Missing or invalid "message" parameter' });
        return;
      }
      const targetModel = model || Config.defaultModel;
      const client = new UniversalLlmClient(apiKey || Config.geminiApiKey || undefined);

      let effectiveInstruction = this.resolveSystemInstruction(roleId, systemInstruction);

      if (useKnowledgeBase) {
        try {
          const docs = await this.kbConnector.search(message, { limit: 3 });
          if (docs.length > 0) {
            effectiveInstruction += `\n${this.kbConnector.formatContextForPrompt(docs)}`;
          }
        } catch (e: any) {
          logger.warn('ChatRouter', `KB retrieval stream skipped: ${e.message}`);
        }
      }

      const messages = [...history, { role: 'user', content: message.trim() }];
      const span = startSpan(targetModel, client.resolveProvider(targetModel, provider));

      const chatSessionId = typeof body.sessionId === 'string' && body.sessionId ? body.sessionId : 'web-default';
      persistChatMessage(chatSessionId, 'user', message.trim(), targetModel);

      ctx.res.writeHead(200, {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      });

      const fullText = await client.streamContent(
        targetModel,
        messages,
        (chunk) => {
          ctx.res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
        },
        {
          systemInstruction: effectiveInstruction,
          provider: provider as LlmProvider | undefined,
          apiKey,
        }
      );
      span.end();
      const fullTextOut = isDebugOn() ? `${fullText}\n${renderDebugFooter(span)}` : fullText;

      persistChatMessage(chatSessionId, 'assistant', fullText, targetModel);

      ctx.res.write(`data: ${JSON.stringify({ done: true, fullText: fullTextOut })}\n\n`);
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
        mode,
        prompt: prompt.trim(),
        models,
        participants,
        rounds: typeof rounds === 'number' ? rounds : undefined,
        synthesizerModel,
        systemInstruction,
        apiKey,
        useKnowledgeBase: Boolean(useKnowledgeBase),
      });

      try {
        const historyStore = ChatHistoryStore.getInstance();
        historyStore.appendMessage({
          sessionId: CONSILIUM_SESSION_ID,
          role: 'user',
          content: prompt.trim(),
          model: mode,
          lang: I18nEngine.getLocale(),
        });
        const synthesized = (result as any)?.synthesis || (result as any)?.text || (result as any)?.response;
        if (typeof synthesized === 'string' && synthesized) {
          historyStore.appendMessage({
            sessionId: CONSILIUM_SESSION_ID,
            role: 'assistant',
            content: synthesized,
            model: synthesizerModel || mode,
            lang: I18nEngine.getLocale(),
          });
        }
      } catch (e: any) {
        logger.warn('ChatRouter', `Consilium history persistence skipped: ${e.message}`);
      }

      ctx.sendJson(200, { success: true, result });
    }));

    this.get('/api/roles', withErrorHandling(async (ctx) => {
      const rolesList = Object.values(CORPORATE_ROLES).map((role) => ({
        id: role.id,
        name: role.name,
        title: role.title,
        department: role.department,
        description: role.description,
        preferredModel: role.preferredModel,
        suggestedTemperature: role.suggestedTemperature,
        knowledgeAccessLevel: role.knowledgeAccessLevel,
        systemPrompt: role.systemPrompt,
      }));
      ctx.sendJson(200, { roles: rolesList, count: rolesList.length });
    }));

    this.get('/api/rules', withErrorHandling(async (ctx) => {
      const allRules = rulesEngine.getAllRules();
      const activeRules = rulesEngine.getActiveRules();
      ctx.sendJson(200, {
        total: allRules.length,
        activeCount: activeRules.length,
        rules: allRules,
        display: rulesEngine.formatRulesDisplay(),
      });
    }));

    this.post('/api/rules', withErrorHandling(async (ctx) => {
      const body = await ctx.parseJsonBody();
      const { action, name, ruleText, id, category, enforced } = body;

      if (action === 'reset') {
        rulesEngine.resetToDefaults();
        ctx.sendJson(200, { success: true, message: 'Rules successfully reset to defaults', rules: rulesEngine.getAllRules() });
        return;
      }

      if (action === 'add') {
        if (!name || !ruleText) {
          ctx.sendJson(400, { error: 'Missing name or ruleText for adding custom rule' });
          return;
        }
        const created = rulesEngine.addCustomRule(name, ruleText, category);
        ctx.sendJson(201, { success: true, rule: created, message: `Rule "${name}" added` });
        return;
      }

      if (action === 'remove') {
        if (!id) {
          ctx.sendJson(400, { error: 'Missing rule ID to remove' });
          return;
        }
        const success = rulesEngine.removeCustomRule(id);
        ctx.sendJson(200, { success, message: success ? `Rule ${id} removed` : `Rule ${id} not found or protected` });
        return;
      }

      if (action === 'toggle') {
        if (!id) {
          ctx.sendJson(400, { error: 'Missing rule ID to toggle' });
          return;
        }
        const success = rulesEngine.toggleRule(id, enforced);
        ctx.sendJson(200, { success, message: `Rule ${id} toggled` });
        return;
      }

      ctx.sendJson(400, { error: `Invalid action "${action}". Supported: add, remove, toggle, reset` });
    }));
  }

  private resolveSystemInstruction(roleId?: string, explicitInstruction?: string): string {
    let base = explicitInstruction;
    if (roleId && CORPORATE_ROLES[roleId]) {
      base = CORPORATE_ROLES[roleId].systemPrompt;
    } else if (!base) {
      base = Config.defaultSystemInstruction;
    }
    const withLocale = applyLocalePolicy(base);
    const withRules = `${withLocale}\n${rulesEngine.compileRulesInstruction()}`;
    return withRules;
  }
}
