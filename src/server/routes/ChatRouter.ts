import { Router, withErrorHandling } from './Router.js';
import { UniversalLlmClient, LlmProvider } from '../../core/UniversalLlmClient.js';
import { ConsiliumEngine, ConsiliumMode } from '../../core/ConsiliumEngine.js';
import { Config } from '../../core/Config.js';
import { CORPORATE_ROLES, KnowledgeBaseConnector } from '../../core/CorporateRoles.js';
import { rulesEngine } from '../../core/RulesEngine.js';
import { applyLocalePolicy } from '../../core/LocalePolicy.js';
import { logger } from '../../core/Logger.js';

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
      const responseText = await client.generateContent(targetModel, messages, {
        systemInstruction: effectiveInstruction,
        provider: provider as LlmProvider | undefined,
        apiKey,
      });

      logger.logUserAction('CHAT_MESSAGE', { model: targetModel, length: message.length, roleId }, ctx.clientIp);
      ctx.sendJson(200, {
        response: responseText,
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
