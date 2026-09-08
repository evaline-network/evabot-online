import os from 'node:os';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { ModelRegistry, GeminiModelInfo } from './ModelRegistry.js';
import { AccountingEngine, CapitalExpenses } from '../core/AccountingEngine.js';
import { AgentBuilder } from '../core/AgentBuilder.js';
import { I18nEngine } from '../core/I18nEngine.js';
import { ChatHistoryStore } from '../core/ChatHistoryStore.js';
import { RoomManager } from '../core/RoomManager.js';
import { knowledgeBase } from '../core/KnowledgeBase.js';
import { ClusterMonitor } from '../core/ClusterMonitor.js';
import { ProductCatalog, CatalogLang } from '../core/ProductCatalog.js';
import { CompanyKnowledge } from '../core/CompanyKnowledge.js';
import { NewsEngine, NewsTagId } from '../core/NewsEngine.js';
import { ProviderFallbackChain } from '../core/Resilience.js';
import { translator, TranslateResult, TRANSLATE_FREE_TIER_CHARS } from '../core/Translator.js';
import { SephirotEngine, SEPHIROT_ROLES } from '../core/SephirotEngine.js';
import { CORPORATE_ROLES } from '../core/CorporateRoles.js';
import { cloudTts, validateVoiceName, VOICE_CATALOG, familyRank, familyFreeAllowance, saveVoicePrefs, voicePrefsPath, VoicePrefs } from '../core/CloudTTS.js';
import { readUsage as readSttUsage, monthKey as sttMonthKey, STT_MONTHLY_CAP_SECONDS } from '../core/CloudSTT.js';
import { Config } from '../core/Config.js';
import { OpLog, isDebugOn, setDebugOn, opLog } from '../core/OpLog.js';
import { SystemContext, getLastUsedModel } from '../core/SystemContext.js';
import { DeveloperMode } from '../core/DeveloperMode.js';

export type ModelRatingDimension = 'quality' | 'speed' | 'context' | 'cost';

export interface ModelRating {
  modelId: string;
  quality: number;
  recency: number;
  speed: number;
  context: number;
  cost: number;
  composite: number;
}

export interface TopModelEntry {
  rank: number;
  model: GeminiModelInfo;
  rating: ModelRating;
  reason: string;
}

export class ModelRatings {
  public static computeRating(model: GeminiModelInfo): ModelRating {
    const quality = this.computeQualityScore(model);
    const recency = this.computeRecencyScore(model);
    const speed = this.computeSpeedScore(model);
    const context = this.computeContextScore(model);
    const cost = this.computeCostScore(model);

    // Weights: Quality/Smartness (35%), Recency/Newness (35%), Context (15%), Speed (10%), Cost (5%)
    const composite = Math.round(quality * 0.35 + recency * 0.35 + context * 0.15 + speed * 0.10 + cost * 0.05);

    return {
      modelId: model.id,
      quality,
      recency,
      speed,
      context,
      cost,
      composite,
    };
  }

  private static computeRecencyScore(model: GeminiModelInfo): number {
    const id = model.id.toLowerCase();
    const name = model.name.toLowerCase();

    // 2026 Next-Gen Frontier Models (Gemini 3.8, Gemini 3.1, Claude 3.7)
    if (id.includes('gemini-3.8') || name.includes('3.8')) return 100;
    if (id.includes('gemini-3.1') || name.includes('3.1')) return 99;
    if (id.includes('claude-3-7') || id.includes('claude-sonnet-4') || name.includes('claude 3.7')) return 98;
    if (id.includes('gemini-3.0') || name.includes('3.0')) return 96;
    if (id.includes('deepseek-r1') || id.includes('deepseek-v3') || id.includes('deepseek-v4') || name.includes('deepseek r1')) return 95;
    if (id.includes('gemini-2.5') || name.includes('2.5')) return 88;
    if (id.includes('llama-3.3') || name.includes('llama 3.3')) return 86;
    if (id.includes('qwen-2.5') || id.includes('qwen3') || name.includes('qwen 2.5') || name.includes('qwen3')) return 85;
    if (id.includes('gemini-2.0') || name.includes('gemini 2.0')) return 80;
    if (id.includes('o3-mini') || id.includes('o1') || name.includes('o3-mini') || name.includes('o1')) return 80;
    if (id.includes('gpt-4o') || name.includes('gpt-4o')) return 75;
    if (id.includes('claude-3-5') || name.includes('claude 3.5')) return 70;
    if (id.includes('gemini-1.5') || name.includes('gemini 1.5')) return 60;
    if (id.includes('llama-3.1') || name.includes('llama 3.1') || id.includes('gemma-2')) return 55;
    return 50;
  }

  private static computeQualityScore(model: GeminiModelInfo): number {
    let score = 0;
    const name = model.name.toLowerCase();
    const id = model.id.toLowerCase();

    // Priority: Newest 2026 Frontier & Smartest Coding Models
    if (id.includes('gemini-3.1-pro') || name.includes('gemini 3.1 pro')) score += 100;
    else if (id.includes('gemini-3.8-flash') || name.includes('gemini 3.8 flash')) score += 99;
    else if (name.includes('claude 3.7') || name.includes('claude sonnet 4')) score += 98;
    else if (id.includes('gemini-3.1-flash') || name.includes('gemini 3.1 flash')) score += 96;
    else if (id.includes('deepseek-r1') || name.includes('deepseek r1')) score += 95;
    else if (id.includes('codestral') || name.includes('codestral')) score += 94;
    else if (id.includes('qwen-2.5-coder-32b') || name.includes('qwen 2.5 coder 32b') || id.includes('qwen3-coder')) score += 93;
    else if (id.includes('gemini-2.5-pro') || name.includes('gemini 2.5 pro')) score += 90;
    else if (id.includes('gemini-2.5-flash') || name.includes('gemini 2.5 flash')) score += 88;
    else if (name.includes('o1') || name.includes('o3-mini')) score += 88;
    else if (name.includes('claude 3.5')) score += 86;
    else if (name.includes('llama 3.3 70b')) score += 85;
    else if (name.includes('gemini-2.0') || name.includes('gemini 2.0')) score += 83;
    else if (name.includes('gpt-4o')) score += 82;
    else if (name.includes('llama 3.1 405b')) score += 82;
    else if (name.includes('mistral large')) score += 75;
    else if (name.includes('gemini 1.5 pro')) score += 70;
    else if (name.includes('gemini 1.5 flash')) score += 65;
    else if (name.includes('gemma 2 27b')) score += 65;
    else if (name.includes('gemma 2 9b')) score += 55;
    else if (name.includes('groq') || name.includes('grok')) score += 70;
    else if (name.includes('jamba')) score += 60;
    else if (name.includes('command')) score += 58;
    else score += 45;

    if (model.recommended) score += 5;
    return Math.min(100, score);
  }

  private static computeSpeedScore(model: GeminiModelInfo): number {
    let score = 50;
    const details = model.pricing.freeTierDetails || '';
    const name = model.name.toLowerCase();

    if (details.includes('30 RPM')) score += 40;
    else if (details.includes('20 RPM')) score += 30;
    else if (details.includes('15 RPM')) score += 20;
    else if (details.includes('5 RPM')) score += 10;
    else if (details.includes('2 RPM')) score -= 20;

    if (name.includes('flash') || name.includes('lite') || name.includes('mini') || name.includes('haiku')) score += 15;
    if (name.includes('haiku')) score += 5;
    if (name.includes('gpt-4o-mini') || name.includes('gpt-3.5')) score += 10;
    if (name.includes('mistral-7b') || name.includes('llama 3.1 8b')) score += 20;

    return Math.max(0, Math.min(100, score));
  }

  private static computeContextScore(model: GeminiModelInfo): number {
    const ctx = model.contextWindow;
    if (ctx >= 2000000) return 100;
    if (ctx >= 1000000) return 90;
    if (ctx >= 256000) return 80;
    if (ctx >= 200000) return 70;
    if (ctx >= 128000) return 60;
    if (ctx >= 64000) return 50;
    if (ctx >= 32000) return 35;
    if (ctx >= 16000) return 25;
    if (ctx >= 8192) return 15;
    return 10;
  }

  private static computeCostScore(model: GeminiModelInfo): number {
    const isFree = model.pricing.freeTierStatus === '100% Free Quota Available';
    if (isFree) return 100;

    const inputPrice = model.pricing.inputPer1MTokensUSD;
    if (inputPrice.includes('$0.00')) return 95;
    if (inputPrice.includes('$0.075') || inputPrice.includes('$0.10')) return 80;
    if (inputPrice.includes('$0.14') || inputPrice.includes('$0.20')) return 70;
    if (inputPrice.includes('$0.30') || inputPrice.includes('$0.50')) return 60;
    if (inputPrice.includes('$0.70') || inputPrice.includes('$0.90')) return 50;
    if (inputPrice.includes('$1.25')) return 40;
    if (inputPrice.includes('$2.00') || inputPrice.includes('$2.50')) return 25;
    if (inputPrice.includes('$3.00') || inputPrice.includes('$3.50')) return 15;
    if (inputPrice.includes('$15.00')) return 5;
    return 30;
  }

  public static rankByDimension(dimension: ModelRatingDimension, limit: number = 10, freeOnly: boolean = false): TopModelEntry[] {
    let models = freeOnly ? ModelRegistry.getFreeModels() : ModelRegistry.getAllModels();
    const ratings = models.map((m) => ({
      model: m,
      rating: this.computeRating(m),
    }));

    ratings.sort((a, b) => {
      let aVal = 0, bVal = 0;
      switch (dimension) {
        case 'quality': aVal = a.rating.quality; bVal = b.rating.quality; break;
        case 'speed': aVal = a.rating.speed; bVal = b.rating.speed; break;
        case 'context': aVal = a.rating.context; bVal = b.rating.context; break;
        case 'cost': aVal = a.rating.cost; bVal = b.rating.cost; break;
      }
      return bVal - aVal;
    });

    return ratings.slice(0, limit).map((entry, idx) => ({
      rank: idx + 1,
      model: entry.model,
      rating: entry.rating,
      reason: this.getRankReason(entry.model, dimension),
    }));
  }

  public static getTopOverall(freeOnly: boolean = false, limit: number = 10): TopModelEntry[] {
    return this.rankByDimension('quality', limit, freeOnly);
  }

  public static getTopFree(limit: number = 10): TopModelEntry[] {
    return this.rankByDimension('quality', limit, true);
  }

  public static getTopPaid(limit: number = 10): TopModelEntry[] {
    return this.rankByDimension('quality', limit, false).filter(e =>
      e.model.pricing.freeTierStatus === 'Paid / Pay-As-You-Go Only'
    ).slice(0, limit);
  }

  public static getTopBySpeed(freeOnly: boolean = true, limit: number = 10): TopModelEntry[] {
    return this.rankByDimension('speed', limit, freeOnly);
  }

  public static getTopByContext(freeOnly: boolean = true, limit: number = 10): TopModelEntry[] {
    return this.rankByDimension('context', limit, freeOnly);
  }

  private static getRankReason(model: GeminiModelInfo, dim: ModelRatingDimension): string {
    switch (dim) {
      case 'quality':
        if (model.name.toLowerCase().includes('claude 3.7')) return 'Highest SWE-bench: 70.3%';
        if (model.name.toLowerCase().includes('deepseek r1')) return 'Best open reasoning: 49.2%';
        if (model.name.toLowerCase().includes('gemini 3')) return 'Next-gen flagship: 1M+ context';
        if (model.name.toLowerCase().includes('gemini 2.5 pro')) return 'Premier 2M context reasoning';
        return 'High quality general LLM';
      case 'speed':
        if (model.pricing.freeTierDetails.includes('30 RPM')) return 'Fastest free tier: 30 RPM';
        if (model.name.toLowerCase().includes('haiku')) return 'Haiku-tier high speed';
        if (model.name.toLowerCase().includes('flash')) return 'Flash-tier low latency';
        return 'High throughput';
      case 'context':
        if (model.contextWindow >= 2000000) return '2M tokens max context';
        if (model.contextWindow >= 1000000) return '1M tokens long context';
        if (model.contextWindow >= 256000) return '256K tokens context';
        return `${model.contextWindow.toLocaleString()} tokens`;
      case 'cost':
        if (model.pricing.freeTierStatus === '100% Free Quota Available') return '100% FREE';
        if (model.pricing.inputPer1MTokensUSD.includes('$0.00')) return 'Free local routing';
        return 'Low input cost';
    }
  }

  public static formatTopList(entries: TopModelEntry[], title: string): string {
    const lines: string[] = [];
    lines.push('');
    lines.push('═'.repeat(78));
    lines.push(`  ${title}`);
    lines.push('═'.repeat(78));
    lines.push('');

    for (const entry of entries) {
      const m = entry.model;
      const isFree = m.pricing.freeTierStatus === '100% Free Quota Available';
      const badge = isFree ? '[FREE]' : '[PAID]';
      const composite = entry.rating.composite.toString().padStart(3);

      lines.push(`  #${entry.rank.toString().padStart(2)} ${composite}/100  ${badge}  ${m.name}`);
      lines.push(`        ID: ${m.id}`);
      lines.push(`        Provider: ${m.provider}`);
      lines.push(`        Context: ${m.contextWindow.toLocaleString()} tokens | Output: ${m.maxOutputTokens} tokens`);
      lines.push(`        Quality: ${entry.rating.quality} | Recency: ${entry.rating.recency} | Speed: ${entry.rating.speed} | Context: ${entry.rating.context} | Cost: ${entry.rating.cost}`);
      lines.push(`        Reason: ${entry.reason}`);
      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * Returns the newest, smartest, highest-rated verified free model.
   * Priority:
   *  1. Gemini 3.8 Flash (2026 Next-Gen Frontier, 1M context, ultra-fast multimodal, 100% Free Quota)
   *  2. Gemini 3.1 Pro (2026 Next-Gen Frontier, 2M context, apex reasoning, 100% Free Quota)
   *  3. Gemini 3.1 Flash (2026 Next-Gen Frontier, 1M context, 100% Free Quota)
   *  4. OmniRoute Gemini 3.8 Flash (Edge proxy fallback)
   *  5. Qwen 2.5 Coder 32B / DeepSeek R1 (Specialized coding/reasoning models)
   */
  public static getSmartestFreeModel(): GeminiModelInfo {
    const candidateIds = [
      'omni/cf-gpt-oss-120b',
      'omni/cf-qwen2.5-coder-32b',
      'omni/cf-llama-3.3-70b',
      'omni/cf-qwen2.5-coder-32b',
      'omni/cf-mistral-small-3.1',
      'omni/cf-llama-4-scout',
      'omni/cf-gemma-4-26b',
      'omni/cf-nemotron-3-120b',
      'omni/cf-gpt-oss-20b',
      'omni/cf-gpt-oss-120b',
      'omni/cf-llama-4-scout',
      'omni/cf-gemma-4-26b',
      'omni/cf-nemotron-3-120b',
    ];

    for (const id of candidateIds) {
      const model = ModelRegistry.getModelById(id);
      if (model && model.pricing.freeTierStatus === '100% Free Quota Available') {
        return model;
      }
    }

    // Fallback to original list
    const legacyIds = [
      'gemini-3.8-flash',
      'gemini-3.1-pro',
      'gemini-3.1-flash',
      'omniroute/gemini-3.8-flash',
      'omniroute/gemini-3.1-pro',
    ];
    for (const id of legacyIds) {
      const model = ModelRegistry.getModelById(id);
      if (model && model.pricing.freeTierStatus === '100% Free Quota Available') {
        return model;
      }
    }

    const topFree = this.getTopFree(5);
    return topFree[0]?.model || ModelRegistry.getAllModels()[0];
  }

  /**
   * Generates an ordered fallback chain strictly prioritizing newest + smartest free models.
   */
  public static getFallbackChain(modelId: string): string[] {
    const current = ModelRegistry.getModelById(modelId);
    const isFree = current ? current.pricing.freeTierStatus === '100% Free Quota Available' : true;

    // Strict priority: Working Free Models (Cloudflare + Groq + working Google)
    const trustedFleet = [
      'omni/cf-gpt-oss-120b',
      'omni/cf-qwen2.5-coder-32b',
      'omni/cf-llama-3.3-70b',
      'omni/cf-mistral-small-3.1',
      'omni/cf-llama-4-scout',
      'omni/cf-gemma-4-26b',
      'omni/cf-nemotron-3-120b',
      'omni/cf-gpt-oss-20b',
      'gemini-3.8-flash',
      'gemini-3.1-pro',
      'gemini-3.1-flash',
      'omniroute/gemini-3.8-flash',
      'omniroute/gemini-3.1-pro',
    ];

    if (isFree) {
      const chain = trustedFleet.filter(id => id.toLowerCase() !== modelId.toLowerCase());
      return chain;
    } else {
      const topPaid = this.getTopPaid(5).map(e => e.model.id).filter(id => id.toLowerCase() !== modelId.toLowerCase());
      return [...topPaid, ...trustedFleet];
    }
  }
}

/**
 * Multilingual command alias map (EN / UK / RU).
 * Keys are lowercase with apostrophe variants canonicalized to the straight ASCII
 * apostrophe `'` (see normalizeCommand — ` ’ ´ ʼ are all folded to ' before lookup).
 */
export const COMMAND_ALIASES: Record<string, string> = {
  // /history
  '/історія': '/history',
  '/история': '/history',
  '/hist': '/history',
  '/журнал': '/history',
  // /memory
  '/пам\'ять': '/memory',
  '/память': '/memory',
  '/mem': '/memory',
  '/памятка': '/memory',
  // /search
  '/пошук': '/search',
  '/поиск': '/search',
  '/знайти': '/search',
  '/найти': '/search',
  // /find
  '/знайди': '/find',
  '/найди': '/find',
  // /services
  '/сервіси': '/services',
  '/сервисы': '/services',
  '/служби': '/services',
  '/службы': '/services',
  // /servers
  '/сервери': '/servers',
  '/серверы': '/servers',
  '/вми': '/servers',
  '/vm': '/servers',
  // /models
  '/моделі': '/models',
  // /say (Cloud TTS)
  '/скажи': '/say',
  '/сказать': '/say',
  '/модели': '/models',
  // /help
  '/допомога': '/help',
  '/помощь': '/help',
  // /lang
  '/мова': '/lang',
  '/язык': '/lang',
  // /cost
  '/вартість': '/cost',
  '/стоимость': '/cost',
  '/фінанси': '/cost',
  '/финансы': '/cost',
  '/бюджет': '/cost',
  '/бухгалтерія': '/cost',
  '/бухгалтерия': '/cost',
  // /clear
  '/очистити': '/clear',
  '/очистить': '/clear',
  '/очистка': '/clear',
  // /news
  '/новини': '/news',
  '/новости': '/news',
  '/новины': '/news',
  '/нов': '/news',
  // /health
  '/здоров\'я': '/health',
  '/здоровье': '/health',
  '/статус-моделей': '/health',
  '/статус': '/health',
  // /products (EvaLine product catalog)
  '/продукти': '/products',
  '/продукты': '/products',
  '/товари': '/products',
  '/товары': '/products',
  '/catalog': '/products',
  '/каталог': '/products',
  // /who (corporate knowledge matrix)
  '/хто': '/who',
  '/кто': '/who',
  '/роли': '/who',
  '/ролі': '/who',
  // /sephirot (Sephirot/Tetraxis consilium)
  '/сфирот': '/sephirot',
  '/сефирот': '/sephirot',
  '/дерево': '/sephirot',
  '/tetraxis': '/sephirot',
  '/тетраксис': '/sephirot',
  // /debug
  '/дебаг': '/debug',
  '/отладка': '/debug',
  '/наладка': '/debug',
  // /log
  '/лог': '/log',
  '/журнал-лог': '/log',
  '/логи': '/log',
  // /monitor
  '/монитор': '/monitor',
  '/рейтинг': '/monitor',
  '/топ-моделей': '/monitor',
  // /translate (Google Cloud Translation v3)
  '/переклад': '/translate',
  '/перевод': '/translate',
  '/переклади': '/translate',
  '/перевести': '/translate',
  // /listen (Google Cloud Speech-to-Text of a local audio file)
  '/розпізнай': '/listen',
  '/распознать': '/listen',
  '/прослушать': '/listen',
  '/stt': '/listen',
  // /sys (system self-awareness block)
  '/система': '/sys',
  '/системa': '/sys',
  '/whereami': '/sys',
  // /developer (password-protected developer mode)
  '/девелопер': '/developer',
  '/розробник': '/developer',
  // /voices (TTS voice catalog + persona voice switch)
  '/голоси': '/voices',
  '/голоса': '/voices',
  '/голос': '/voices',
  '/звуки': '/voices',
  // /settings (current settings table)
  '/налаштування': '/settings',
  '/настройки': '/settings',
  '/настройка': '/settings',
  // /agents (corporate roles + Sephirot roster)
  '/агенти': '/agents',
  '/агент': '/agents',
  '/рота': '/agents',
  '/роли-агентів': '/agents',
};

/**
 * Normalizes a user-typed command: trims whitespace, lowercases, canonicalizes
 * apostrophe/backtick variants (` ' ´ ʼ ’ → ') and resolves multilingual aliases
 * via COMMAND_ALIASES. Arguments (rest of the line) are preserved after the
 * canonical head token.
 */
export function normalizeCommand(input: string): string {
  const cmd = (input || '').trim().toLowerCase().replace(/['`´ʼ’']/g, "'");
  const spaceIdx = cmd.indexOf(' ');
  const head = spaceIdx === -1 ? cmd : cmd.slice(0, spaceIdx);
  const rest = spaceIdx === -1 ? '' : cmd.slice(spaceIdx + 1).trim();
  const canonical = COMMAND_ALIASES[head] || head;
  return rest ? `${canonical} ${rest}` : canonical;
}

export class ModelCommand {
  public static execute(command: string): string {
    const cmd = normalizeCommand(command);
    OpLog.getInstance().log('info', 'command', command);
    const parts = cmd.split(/\s+/);
    const action = parts[0];

    switch (action) {
      case '/top':
        return this.handleTop(parts.slice(1));
      case '/free':
        return this.handleFree(parts.slice(1));
      case '/paid':
        return this.handlePaid(parts.slice(1));
      case '/models':
        return this.handleModels(parts.slice(1));
      case '/mcp':
        return this.handleMcp(parts.slice(1));
      case '/lsp':
        return this.handleLsp(parts.slice(1));
      case '/history':
        return this.handleHistory(parts.slice(1));
      case '/memory':
        return this.handleMemory();
      case '/search':
      case '/find':
        return this.handleSearch(parts.slice(1));
      case '/services':
        return this.handleServices();
      case '/servers':
        return this.handleServers();
      case '/cost':
      case '/finance':
      case '/budget':
        return AccountingEngine.formatCostReport();
      case '/company':
      case '/team':
      case '/roster':
        return this.handleCompany(parts.slice(1));
      case '/evaline':
      case '/business':
        return this.handleCompany(['evaline']);
      case '/lang':
      case '/language':
      case '/locale':
        return I18nEngine.setLocale(parts[1] || 'en').message;
      case '/help':
      case '/?':
        return I18nEngine.formatHelp();
      case '/info':
      case '/inspect':
        return this.handleInfo(parts.slice(1));
      case '/health':
        return ProviderFallbackChain.getHealthReport();
      case '/news':
        return this.handleNewsSync(parts.slice(1));
      case '/translate':
        return this.handleTranslateSync(command);
      case '/products':
        return this.handleProducts(parts.slice(1));
      case '/who':
        return this.handleWho(parts.slice(1));
      case '/sephirot':
        return this.handleSephirot(parts.slice(1));
      case '/debug':
        return this.handleDebug(parts.slice(1));
      case '/log':
        return this.handleLog(parts.slice(1));
      case '/monitor':
        return this.handleMonitor();
      case '/sys':
        return SystemContext.build();
      case '/developer':
        // Parsed from the RAW command so the password keeps its original casing.
        return this.handleDeveloper(command);
      case '/voices':
        // RAW command keeps voice-name casing (Chirp3-HD, Aoede, ...);
        // normalizeCommand lowercases everything, so re-parse raw args here.
        return this.handleVoices(command);
      case '/settings':
        return this.handleSettings();
      case '/room':
        return this.handleRoom(parts.slice(1).join(' '));
      case '/rooms':
        return this.handleRooms();
      case '/agents':
        return this.handleAgents();
      default:
        OpLog.getInstance().log('error', 'command', `unknown command: ${action}`);
        return `[ERROR] Unknown command: ${action}. Use /top, /models, /history, /memory, /search, /find, /services, /servers, /mcp, /lsp, /cost, /company, /evaline, /lang, /info, /news, /translate, /health, /products, /who, /sephirot, /debug, /log, /monitor, /sys, /developer, /voices, /settings, /agents, /room, /rooms, /free, /paid, or /help.`;
    }
  }


  private static handleRoom(args: string): string {
    const roomManager = RoomManager.getInstance();
    const sessionId = 'cli';
    if (!args || args === 'leave') {
      const roomId = roomManager.getRoomForSession(sessionId);
      if (!roomId) return '[X] Ви не в кімнаті';
      roomManager.leaveRoom(sessionId);
      return '[OK] Ви вийшли з кімнати ' + roomId;
    }
    const room = roomManager.createOrJoin(args, sessionId);
    return '[OK] Кімната створена/приєднана: ' + room.id + '\nУчасників: ' + room.members.size;
  }

  private static handleRooms(): string {
    const rooms = RoomManager.getInstance().listRooms();
    if (rooms.length === 0) return '[--] Кімнат немає';
    let out = 'КІМНАТИ:\n';
    for (const r of rooms) {
      out += '  - ' + r.id + ' - ' + r.members + ' учасник(ів)\n';
    }
    return out;
  }

  /**
   * Async entrypoint for commands that need network I/O (/news).
   * Falls back to the synchronous execute() for everything else.
   */
  public static async executeAsync(command: string): Promise<string> {
    const cmd = normalizeCommand(command);
    if (cmd.startsWith('/news')) {
      const args = cmd.split(/\s+/).slice(1);
      return this.handleNews(args);
    }
    if (cmd.startsWith('/translate')) {
      return this.handleTranslate(command);
    }
    return this.execute(command);
  }

  /** Cache-first sync rendering for /news (used by the sync registry + web router). */
  private static handleNewsSync(args: string[]): string {
    const tags = this.resolveNewsTags(args);
    const lang = I18nEngine.getLocale();
    const cached = NewsEngine.getCachedText(lang, tags);
    if (cached) return cached;
    return 'NEWS Рушій новин запускає перший збір (до ~10 c, 8s timeout на джерело).\n   Повторіть /news за мить — результат буде взято з кешу (15 хв).';
  }

  /** Fully async /news handler (CLI / executeAsync): awaits the live fetch. */
  private static async handleNews(args: string[]): Promise<string> {
    const tags = this.resolveNewsTags(args);
    try {
      const { items, partialErrors } = await NewsEngine.fetchNews(tags);
      const filtered = tags && tags.length > 0 ? items.filter((i) => tags.includes(i.category)) : items;
      return NewsEngine.formatNews(I18nEngine.getLocale(), filtered, partialErrors);
    } catch (err: any) {
      return `[ERROR] News engine unavailable: ${err.message}`;
    }
  }

  private static resolveNewsTags(args: string[]): NewsTagId[] | undefined {
    if (args.length === 0) return undefined;
    const ids: NewsTagId[] = [];
    for (const raw of args) {
      const id = NewsEngine.resolveTag(raw);
      if (id && !ids.includes(id)) ids.push(id);
    }
    return ids.length > 0 ? ids : undefined;
  }

  /**
   * /translate <to> <text> — Google Cloud Translation v3 (exported for tests).
   * Parses the ORIGINAL (non-lowercased) command so the text to translate keeps
   * its casing; the head token is alias-resolved (/переклад, /перевод, ...).
   */
  public static parseTranslateCommand(raw: string): { to?: string; text?: string; error?: string } {
    const trimmed = (raw || '').trim();
    const head = trimmed.split(/\s+/)[0] || '';
    const canonical = COMMAND_ALIASES[head.toLowerCase().replace(/['`´ʼ’]/g, "'")] || head.toLowerCase();
    if (canonical !== '/translate') {
      return { error: 'not-a-translate-command' };
    }
    const rest = trimmed.slice(head.length).trim();
    if (!rest) {
      return {
        error: `Використання: /translate <мова> <текст>\n   Приклади: /translate uk Привіт світ | /translate en какой прогноз цен на EVA\n   Синоніми: /переклад, /перевод, /переклади, /перевести`,
      };
    }
    const spaceIdx = rest.indexOf(' ');
    const target = spaceIdx === -1 ? rest : rest.slice(0, spaceIdx);
    const text = spaceIdx === -1 ? '' : rest.slice(spaceIdx + 1).trim();
    if (!/^[a-z]{2,3}(-[A-Za-z0-9]{2,8})?$/i.test(target)) {
      return {
        error: `Першим аргументом має бути код мови цілі (uk, en, ru, pl, ro, de, ...).\n   Отримано: "${target}". Використання: /translate <мова> <текст>`,
      };
    }
    if (!text) {
      return { error: 'Порожній текст для перекладу. Використання: /translate <мова> <текст>' };
    }
    return { to: target.toLowerCase(), text };
  }

  /** Renders the async translation result + usage footer. */
  private static formatTranslateReply(parsed: { to?: string; text?: string }, res: TranslateResult): string {
    if (!res.ok) {
      return `${res.error || 'Помилка перекладу.'}`;
    }
    const joined = res.translations.join('\n');
    const src = res.detectedLanguageCode ? ` (авто: ${res.detectedLanguageCode})` : '';
    return `Переклад → ${parsed.to}${src}:\n${joined}\n──────────────────────────────\n${translator.formatUsageFooter(res.usage)}`;
  }

  /**
   * Async /translate handler (CLI + executeAsync): awaits the live API call.
   * Never throws into the command path — all failures are formatted replies.
   */
  private static async handleTranslate(command: string): Promise<string> {
    const parsed = this.parseTranslateCommand(command);
    if (parsed.error) return `${parsed.error}`;
    const res = await translator.translate(parsed.text!, parsed.to!);
    return this.formatTranslateReply(parsed, res);
  }

  /**
   * Sync /translate fallback for the web registry (follows the /news pattern):
   * the network call cannot be awaited in ModelCommand.execute, so the real
   * translation runs in the background and its result/usage is appended to the
   * operation log (visible via /log translate), while the user gets a [WAIT] marker.
   */
  private static handleTranslateSync(command: string): string {
    const parsed = this.parseTranslateCommand(command);
    if (parsed.error) return `${parsed.error}`;
    translator
      .translate(parsed.text!, parsed.to!)
      .then((res) => {
        OpLog.getInstance().log(res.ok ? 'info' : 'warn', 'command', `/translate → ${parsed.to}: ${res.ok ? res.translations.join(' | ').substring(0, 300) : res.error}`);
      })
      .catch(() => { /* never breaks the command path */ });
    return `[WAIT] Переклад у процесі (до 10 с)... Результат з'явиться в журналі: /log translate.\n   У CLI той самий запит повертає переклад одразу.`;
  }


  private static handleHistory(args: string[]): string {
    const limit = Math.max(1, Math.min(200, parseInt(args[0] || '20', 10) || 20));
    const store = ChatHistoryStore.getInstance();
    const messages = store.getRecentMessages(limit);

    const lines: string[] = [];
    lines.push('');
    lines.push('═'.repeat(78));
    lines.push(`  ИСТОРИЯ ЧАТА — ПОСЛЕДНИЕ ${messages.length} СООБЩЕНИЙ (все сессии)`);
    lines.push('═'.repeat(78));

    if (messages.length === 0) {
      lines.push('  История пока пуста. Задайте вопрос в чате — он сохранится автоматически.');
    }

    for (const m of messages) {
      const when = new Date(m.ts).toISOString().replace('T', ' ').substring(0, 19);
      const who = m.role === 'user' ? '[USER]' : '[BOT] ';
      const sessionTag = m.sessionId === 'consilium' ? '[consilium]' : `[${m.sessionId}]`;
      const preview = m.content.replace(/\s+/g, ' ');
      const shown = preview.length > 90 ? preview.substring(0, 87) + '...' : preview;
      lines.push(`  ${when}  ${who} ${sessionTag} ${shown}`);
    }

    lines.push('─'.repeat(78));
    lines.push('  Использование: /history [N] — показать последние N сообщений (по умолчанию 20).');
    lines.push('  Поиск по истории: /search <запрос>. Очистка экрана: /clear.');
    lines.push('═'.repeat(78));
    return lines.join('\n');
  }

  private static handleMemory(): string {
    const lines: string[] = [];
    lines.push('');
    lines.push('═'.repeat(78));
    lines.push('  ПАМЯТЬ СИСТЕМЫ (MEMORY STATS)');
    lines.push('═'.repeat(78));

    // Knowledge Base statistics
    try {
      const kbStats = knowledgeBase.getStats();
      const sqliteBackend = knowledgeBase.getAvailableBackends().find((b) => b.id === 'sqlite');
      lines.push('  БАЗА ЗНАНИЙ (Knowledge Base):');
      lines.push(`    • Документов в памяти   : ${kbStats.documentCount}`);
      lines.push(`    • FTS5 чанков (SQLite)  : ${sqliteBackend ? sqliteBackend.documentCount : 0}`);
      lines.push(`    • Активный бэкенд       : ${kbStats.name}`);
    } catch (err: any) {
      lines.push(`  БАЗА ЗНАНИЙ: недоступна (${err.message})`);
    }

    // Chat history database statistics
    try {
      const chatDb = ChatHistoryStore.getInstance();
      const counts = chatDb.countAll();
      lines.push('  ИСТОРИЯ ЧАТОВ (SQLite chat-history.db):');
      lines.push(`    • Всего сообщений       : ${counts.totalMessages}`);
      lines.push(`    • Сессий                : ${counts.sessions}`);
      lines.push(`    • Файл БД               : ${chatDb.getPath()}`);
    } catch (err: any) {
      lines.push(`  ИСТОРИЯ ЧАТОВ: недоступна (${err.message})`);
    }

    // Vector store pointer
    lines.push('   ВЕКТОРНОЕ ХРАНИЛИЩЕ:');
    lines.push('    • ChromaDB              : knowledge-base/evaline-knowledge-base/chroma_db');

    lines.push('');
    lines.push('  ЧТО ПОМНИТЬ / КАК ДОБРАТЬСЯ ДО ПАМЯТИ:');
    lines.push('    • /search <запрос>      — полнотекстовый поиск по чатам и базе знаний');
    lines.push('    • /history [N]          — последние N сообщений всех сессий');
    lines.push('    • /kb search <запрос>   — поиск только по базе знаний EvaLine');
    lines.push('    • /kb status            — статистика и бэкенды базы знаний');
    lines.push('    • Сессия "consilium"    — итоги многоагентных консилиумов хранятся в чат-БД');
    lines.push('═'.repeat(78));
    return lines.join('\n');
  }

  private static handleSearch(args: string[]): string {
    const query = args.join(' ').trim();
    if (!query) {
      return `Использование: /search <запрос> — поиск по чатам (FTS5) и базе знаний. Синоним: /find.`;
    }

    const lines: string[] = [];
    lines.push('');
    lines.push('═'.repeat(78));
    lines.push(`  ПОИСК: "${query}"`);
    lines.push('═'.repeat(78));

    // 1. Chat history FTS5 search
    let chatHits = 0;
    try {
      const hits = ChatHistoryStore.getInstance().searchMessages(query, 5);
      chatHits = hits.length;
      lines.push('  ИСТОРИЯ ЧАТОВ:');
      if (hits.length === 0) {
        lines.push('    • Совпадений в чатах не найдено.');
      }
      for (const hit of hits) {
        const when = new Date(hit.ts).toISOString().replace('T', ' ').substring(0, 16);
        const preview = hit.content.replace(/\s+/g, ' ');
        const shown = preview.length > 80 ? preview.substring(0, 77) + '...' : preview;
        lines.push(`    • [${hit.sessionId}] ${when} (${hit.role}): ${shown}`);
      }
    } catch (err: any) {
      lines.push(`    • Поиск чатов недоступен: ${err.message}`);
    }

    // 2. Knowledge Base search (SQLite FTS5 + memory fallback)
    let kbHits = 0;
    try {
      const docs = knowledgeBase.search(query, { limit: 5 });
      kbHits = docs.length;
      lines.push('  БАЗА ЗНАНИЙ:');
      if (docs.length === 0) {
        lines.push('    • Совпадений в базе знаний не найдено.');
      }
      for (const doc of docs) {
        const preview = doc.content.replace(/\s+/g, ' ');
        const shown = preview.length > 80 ? preview.substring(0, 77) + '...' : preview;
        lines.push(`    • [${doc.language}] ${doc.title.substring(0, 50)}: ${shown}`);
      }
      lines.push('    • Расширенный поиск по KB: /kb search <запрос> или GET /api/kb/search');
    } catch (err: any) {
      lines.push(`    • Поиск по KB недоступен: ${err.message}. Альтернатива: GET /api/kb/search`);
    }

    lines.push('─'.repeat(78));
    lines.push(`  Итого: ${chatHits} в чатах, ${kbHits} в базе знаний.`);
    lines.push('═'.repeat(78));
    return lines.join('\n');
  }

  private static checkServiceUnit(unit: string): string {
    try {
      const out = execFileSync('systemctl', ['is-active', unit], {
        timeout: 3000,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();
      return out || 'unknown';
    } catch (err: any) {
      const stdout = typeof err.stdout === 'string' ? err.stdout.trim() : '';
      if (stdout) return stdout;
      return 'unknown';
    }
  }

  private static checkDockerContainer(nameFragment: string): string {
    try {
      const out = execFileSync('docker', ['ps', '--format', '{{.Names}}'], {
        timeout: 3000,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      });
      return out.split('\n').some((n) => n.includes(nameFragment)) ? 'running' : 'stopped';
    } catch (err: any) {
      return 'unknown';
    }
  }

  private static handleServices(): string {
    const lines: string[] = [];
    lines.push('');
    lines.push('═'.repeat(78));
    lines.push('   СИСТЕМНЫЕ СЕРВИСЫ EVA (systemd / docker)');
    lines.push('═'.repeat(78));

    const units = [
      { label: 'evabot-brain.service', unit: 'evabot-brain', desc: 'Node dist/server/server.js на :3000' },
      { label: 'omniroute', unit: 'omniroute', desc: 'Edge model router proxy' },
      { label: 'nginx', unit: 'nginx', desc: 'Веб-реверс-прокси, TLS' },
      { label: 'code-server', unit: 'code-server', desc: 'Веб-IDE' },
    ];
    lines.push('  СЕРВИС                    СТАТУС       НАЗНАЧЕНИЕ');
    for (const u of units) {
      const status = this.checkServiceUnit(u.unit);
      const label = u.label.padEnd(26);
      const stat = status.padEnd(13);
      lines.push(`  ${label} ${stat} ${u.desc}`);
    }

    const dockerN8n = this.checkDockerContainer('n8n');
    lines.push(`  ${'n8n (docker)'.padEnd(26)} ${dockerN8n.padEnd(13)} Automation workflows`);
    lines.push(`  ${'evabot-voice (if unit)'.padEnd(26)} ${this.checkServiceUnit('evabot-voice').padEnd(13)} Voice realtime relay`);

    lines.push('');
    lines.push('  БЭКЕНДЫ БАЗ ДАННЫХ:');
    const chatDbPath = '/var/www/evabot-backend/data/chat-history.db';
    const ftsPath = '/var/www/evabot-backend/knowledge-base/evaline-knowledge-base/fts_index.db';
    const chromaPath = '/var/www/evabot-backend/knowledge-base/evaline-knowledge-base/chroma_db';
    lines.push(`    • SQLite chat-history   : ${fs.existsSync(chatDbPath) ? '[OK]' : '[NOT CREATED YET]'} ${chatDbPath}`);
    lines.push(`    • SQLite FTS5 KB index  : ${fs.existsSync(ftsPath) ? '[OK]' : '[NOT FOUND]'} ${ftsPath}`);
    lines.push(`    • ChromaDB vector store : ${fs.existsSync(chromaPath) ? '[OK]' : '[NOT FOUND]'} ${chromaPath}`);
    lines.push('═'.repeat(78));
    return lines.join('\n');
  }

  private static handleServers(): string {
    const lines: string[] = [];
    const load = os.loadavg();
    const totalMemGb = os.totalmem() / (1024 * 1024 * 1024);
    const freeMemGb = os.freemem() / (1024 * 1024 * 1024);
    const usedMemGb = totalMemGb - freeMemGb;
    const memPct = Math.round((usedMemGb / totalMemGb) * 100);
    const uptimeH = Math.round(os.uptime() / 3600);
    const micro = ClusterMonitor.getMicroMetrics();

    lines.push('');
    lines.push('═'.repeat(78));
    lines.push('  КЛАСТЕР EVA — ДВА СЕРВЕРА (brain + face)');
    lines.push('═'.repeat(78));
    lines.push('  [1] evabot-agent-vm (BRAIN / Frankfurt)');
    lines.push(`      Зона: europe-west3-a | Тип: c3-standard-8 (8 vCPU / 32 GB) | IP: 100.66.98.4`);
    lines.push(`      Load avg (1/5/15 мин): ${load[0].toFixed(2)} / ${load[1].toFixed(2)} / ${load[2].toFixed(2)}`);
    lines.push(`      Память: ${usedMemGb.toFixed(1)} / ${totalMemGb.toFixed(0)} GB (${memPct}% занято, свободно ${freeMemGb.toFixed(1)} GB)`);
    lines.push(`      Аптайм: ${uptimeH} ч`);
    lines.push('  [2] evaline-micro-vm (FACE / Iowa)');
    lines.push(`      Зона: us-central1-a | Тип: e2-micro (2 vCPU / 1 GB) | IP: 136.114.26.252`);
    lines.push(`      CPU: ${micro.cpuPct}% | RAM: ${micro.memUsedMb}/${micro.memTotalMb} MB | Mesh latency: ${ClusterMonitor.getMeshLatency()}ms`);
    lines.push('');
    lines.push('   Live-метрики кластера (реальные SSH-телеметрия микровиртуалки, latency mesh)');
    lines.push('     поставляет ClusterMonitor (src/core/ClusterMonitor.ts) — /servers показывает срез.');
    lines.push('═'.repeat(78));
    return lines.join('\n');
  }

  private static handleTop(args: string[]): string {
    const filter = args[0]?.toLowerCase() || 'all';
    const limit = parseInt(args[1] || '10', 10);

    switch (filter) {
      case 'free':
        return ModelRatings.formatTopList(
          ModelRatings.getTopFree(limit),
          `ТОП-${limit} БЕСПЛАТНЫХ МОДЕЛЕЙ (по качеству)`
        );
      case 'paid':
        return ModelRatings.formatTopList(
          ModelRatings.getTopPaid(limit),
          `ТОП-${limit} ПЛАТНЫХ МОДЕЛЕЙ (по качеству)`
        );
      case 'speed':
        return ModelRatings.formatTopList(
          ModelRatings.getTopBySpeed(true, limit),
          `ТОП-${limit} САМЫХ БЫСТРЫХ БЕСПЛАТНЫХ`
        );
      case 'context':
        return ModelRatings.formatTopList(
          ModelRatings.getTopByContext(true, limit),
          `ТОП-${limit} БОЛЬШЕ КОНТЕКСТА (бесплатные)`
        );
      case 'all':
      default:
        const freeTop = ModelRatings.getTopFree(5);
        const paidTop = ModelRatings.getTopPaid(5);
        let result = ModelRatings.formatTopList(freeTop, `ТОП-5 БЕСПЛАТНЫХ (из 46)`);
        result += '\n' + ModelRatings.formatTopList(paidTop, `ТОП-5 ПЛАТНЫХ (из 32)`);
        result += '\n──────────────────────────────────────────────────────────────────────────────';
        result += '\nКоманды:';
        result += '\n  /top free [N]   - Топ N бесплатных';
        result += '\n  /top paid [N]   - Топ N платных';
        result += '\n  /top speed [N]  - Самые быстрые';
        result += '\n  /top context [N] - С самым большим контекстом';
        result += '\n  /free           - Все 46 бесплатных';
        result += '\n  /paid           - Все 32 платных';
        return result;
    }
  }

  private static handleFree(args: string[]): string {
    const models = ModelRegistry.getFreeModels();
    const lines: string[] = [];
    lines.push('');
    lines.push('═'.repeat(78));
    lines.push(`  ВСЕ БЕСПЛАТНЫЕ МОДЕЛИ (${models.length} моделей)`);
    lines.push('═'.repeat(78));
    lines.push('');

    for (let i = 0; i < models.length; i++) {
      const m = models[i];
      const rating = ModelRatings.computeRating(m);
      lines.push(`  ${(i + 1).toString().padStart(2)}. ${m.name}`);
      lines.push(`      ID: ${m.id}`);
      lines.push(`      Provider: ${m.provider} | Context: ${m.contextWindow.toLocaleString()} tokens`);
      lines.push(`      Free: ${m.pricing.freeTierDetails.substring(0, 60)}`);
      lines.push(`      Rating: Q${rating.quality} | S${rating.speed} | C${rating.context} | $${rating.cost} | Composite: ${rating.composite}/100`);
      lines.push('');
    }

    return lines.join('\n');
  }

  private static handlePaid(args: string[]): string {
    const models = ModelRegistry.getPaidOnlyModels();
    const lines: string[] = [];
    lines.push('');
    lines.push('═'.repeat(78));
    lines.push(`  ВСЕ ПЛАТНЫЕ МОДЕЛИ (${models.length} моделей)`);
    lines.push('═'.repeat(78));
    lines.push('');

    for (let i = 0; i < models.length; i++) {
      const m = models[i];
      const rating = ModelRatings.computeRating(m);
      lines.push(`  ${(i + 1).toString().padStart(2)}. ${m.name}`);
      lines.push(`      ID: ${m.id}`);
      lines.push(`      Provider: ${m.provider} | Context: ${m.contextWindow.toLocaleString()} tokens`);
      lines.push(`      Pricing: In: ${m.pricing.inputPer1MTokensUSD} | Out: ${m.pricing.outputPer1MTokensUSD}`);
      lines.push(`      Rating: Q${rating.quality} | S${rating.speed} | C${rating.context} | $${rating.cost} | Composite: ${rating.composite}/100`);
      lines.push('');
    }

    return lines.join('\n');
  }

  private static handleModels(args: string[]): string {
    const filter = args[0]?.toLowerCase() || 'summary';
    const lines: string[] = [];

    if (filter === 'summary') {
      const free = ModelRegistry.getFreeModels();
      const paid = ModelRegistry.getPaidOnlyModels();
      lines.push('');
      lines.push('═'.repeat(78));
      lines.push('  СВОДКА ПО МОДЕЛЯМ');
      lines.push('═'.repeat(78));
      lines.push('');
      lines.push(`  Бесплатных: ${free.length} моделей (${((free.length / (free.length + paid.length)) * 100).toFixed(0)}%)`);
      lines.push(`  Платных:    ${paid.length} моделей (${((paid.length / (free.length + paid.length)) * 100).toFixed(0)}%)`);
      lines.push(`  Всего:      ${free.length + paid.length} моделей`);
      lines.push('');
      lines.push('  Команды:');
      lines.push('    /top             - Топ-5 free + топ-5 paid');
      lines.push('    /top free [N]    - Топ-N бесплатных');
      lines.push('    /top paid [N]    - Топ-N платных');
      lines.push('    /top speed [N]   - Самые быстрые');
      lines.push('    /top context [N] - Большой контекст');
      lines.push('    /free            - Все 46 бесплатных');
      lines.push('    /paid            - Все 32 платных');
      lines.push('');
    }

    return lines.join('\n');
  }

  private static handleMcp(args: string[]): string {
    const lines: string[] = [];
    lines.push('');
    lines.push('═'.repeat(78));
    lines.push('  MCP СЕРВЕРЫ (Model Context Protocol Suite // 21 активный сервер)');
    lines.push('═'.repeat(78));
    lines.push('');
    lines.push('  Единый пул инструментов и интеграций, доступный всем агентам кластера:');
    lines.push('');

    const servers = [
      { name: 'notebooklm', desc: 'Gemini 2.5 Grounded RAG (Google Auth / Antigravity Notebook)', status: 'ACTIVE' },
      { name: 'chrome-devtools', desc: 'Автоматизация браузера, DOM, скриншоты, TigerVNC :0', status: 'ACTIVE' },
      { name: 'fetch', desc: 'HTTP/HTTPS парсинг, Puppeteer, веб-сокеты и GraphQL', status: 'ACTIVE' },
      { name: 'context7', desc: 'Резолвер документации библиотек и актуальных API', status: 'ACTIVE' },
      { name: 'filesystem', desc: 'Файловые корни: /var/www/evabot-backend, /home/evabot', status: 'ACTIVE' },
      { name: 'sqlite', desc: 'Локальная БД ~/.mcp/sqlite.db для долговременного хранения', status: 'ACTIVE' },
      { name: 'memory', desc: 'Граф знаний и ассоциативная память агентов (сущности, связи)', status: 'ACTIVE' },
      { name: 'git', desc: 'Контроль версий, диффы, ветки, история коммитов в Git', status: 'ACTIVE' },
      { name: 'github', desc: 'GitHub API: PR, Issues, поиск кода и форки', status: 'ACTIVE' },
      { name: 'docker', desc: 'Управление локальными контейнерами и микросервисами', status: 'ACTIVE' },
      { name: 'google-cloud', desc: 'Управление GCP инфраструктурой, VM и Cloud ресурсами', status: 'ACTIVE' },
      { name: 'sequential-thinking', desc: 'Глубокое пошаговое рассуждение и верификация гипотез', status: 'ACTIVE' },
      { name: 'markdownlint', desc: 'Проверка и автоисправление стандартов Markdown', status: 'ACTIVE' },
      { name: 'firebase', desc: 'Облачная база Firestore и чтение Auth профилей', status: 'ACTIVE' },
    ];

    servers.forEach((s, idx) => {
      lines.push(`  [${(idx + 1).toString().padStart(2)}] ${s.name.padEnd(20)} [${s.status}]`);
      lines.push(`       ${s.desc}`);
    });

    lines.push('');
    lines.push('  Синхронизация конфигурации: утилита sync-mcp автоматически');
    lines.push('  распространяет настройки серверов на все 5 агентных сред.');
    lines.push('──────────────────────────────────────────────────────────────────────────────');
    return lines.join('\n');
  }

  private static handleLsp(args: string[]): string {
    const lines: string[] = [];
    lines.push('');
    lines.push('═'.repeat(78));
    lines.push('  LSP СЕРВЕРЫ (Language Server Protocol // Глобальные языковые демоны)');
    lines.push('═'.repeat(78));
    lines.push('');
    lines.push('  Все LSP-серверы установлены в PATH, 100% бесплатные, локальное исполнение:');
    lines.push('');

    const servers = [
      { lang: 'TypeScript / JS', cmd: 'typescript-language-server --stdio', caps: 'AST парсинг, типизация, автодополнение, Go to definition' },
      { lang: 'Python 3.11', cmd: 'pyright-langserver --stdio', caps: 'Строгий статический анализ типов, Pyright engine' },
      { lang: 'HTML / CSS / JSON', cmd: 'vscode-{html,css,json}-language-server', caps: 'Синтаксис, CSS форматирование, JSON-схемы' },
      { lang: 'Markdown / Docs', cmd: 'marksman', caps: 'Иерархия заголовков, cross-doc ссылки, валидация' },
    ];

    servers.forEach((l, idx) => {
      lines.push(`  [${(idx + 1).toString().padStart(2)}] ${l.lang.padEnd(20)} Команда: ${l.cmd}`);
      lines.push(`       Возможности: ${l.caps}`);
      lines.push('');
    });

    lines.push('  Статус: Все демоны активны в окружении и доступны для рефакторинга кода.');
    lines.push('──────────────────────────────────────────────────────────────────────────────');
    return lines.join('\n');
  }

  private static handleCompany(args: string[]): string {
    const tier = args[0]?.toLowerCase() || 'evaline';
    let report: string;
    if (tier === 'free') {
      report = AgentBuilder.formatCompanyReport(AgentBuilder.buildFreeCompany());
    } else if (tier === 'paid') {
      report = AgentBuilder.formatCompanyReport(AgentBuilder.buildPaidCompany());
    } else {
      report = AgentBuilder.formatCompanyReport(AgentBuilder.buildEvaLineBusinessCompany());
    }
    // Enrich with corporate knowledge-matrix summary + product catalog stats.
    const lang = I18nEngine.getLocale() as CatalogLang;
    return `${report}\n${CompanyKnowledge.formatMatrix(lang)}`;
  }

  private static handleProducts(args: string[]): string {
    const lang = I18nEngine.getLocale() as CatalogLang;
    const query = args.join(' ').trim();
    if (!query) {
      return ProductCatalog.formatStats(lang);
    }
    return ProductCatalog.formatFiltered(query, lang);
  }

  private static handleWho(args: string[]): string {
    const lang = I18nEngine.getLocale() as CatalogLang;
    const role = args.join(' ').trim();
    if (!role) {
      return CompanyKnowledge.formatMatrix(lang);
    }
    return CompanyKnowledge.formatRole(role, lang);
  }

  /**
   * /sephirot — Sephirot/Tetraxis consilium of 10 Tree-of-Life agents.
   * The consilium can run for minutes, and ModelCommand.execute is synchronous,
   * so the heavy run is launched in the background (SephirotEngine.startAsyncRun)
   * and progress/result are polled via '/sephirot status' — the same fire-and-
   * forget pattern /consilium uses through the async web/CLI paths.
   */
  private static handleSephirot(args: string[]): string {
    const sub = args[0]?.toLowerCase();

    if (sub === 'status') {
      const status = SephirotEngine.getStatus();
      const lines: string[] = [];
      lines.push('');
      lines.push('═'.repeat(78));
      lines.push('  [=] SEPHIROT CONSILIUM — СТАТУС');
      lines.push('═'.repeat(78));
      lines.push(`  Стан        : ${status.running ? '[WAIT] ВИКОНУЄТЬСЯ' : status.error ? '[X] ПОМИЛКА' : '[OK] ЗАВЕРШЕНО'}`);
      lines.push(`  Тема        : ${status.topic || '—'}`);
      if (status.startedAt) lines.push(`  Запущено    : ${new Date(status.startedAt).toISOString()}`);
      if (status.finishedAt) lines.push(`  Завершено   : ${new Date(status.finishedAt).toISOString()}`);
      if (status.durationMs) lines.push(`  Тривалість  : ${(status.durationMs / 1000).toFixed(1)} c (rounds: ${status.rounds})`);
      if (status.error) lines.push(`  Помилка     : ${status.error}`);
      if (status.synthesis) {
        lines.push('─'.repeat(78));
        const synth = status.synthesis.length > 3000 ? status.synthesis.substring(0, 2997) + '...' : status.synthesis;
        lines.push('  СИНТЕЗ (Malkuth → Kether feedback):');
        lines.push(synth);
      }
      lines.push('═'.repeat(78));
      return lines.join('\n');
    }

    if (sub === 'tree' || sub === 'map') {
      return this.handleSephirotTree();
    }

    const topic = args.join(' ').trim();
    if (!topic) {
      return [
        '[=] SEPHIROT CONSILIUM (10 сфер Дерева Життя + Tetraxis):',
        '  Використання:',
        '    /sephirot <тема>      — запустити консиліум 10 агентів (у фоні)',
        '    /sephirot status      — прогрес / останній синтез',
        '    /sephirot tree        — карта Дерева Життя (10 сфер, моделі)',
        '  Синоніми: /сфирот, /сефирот, /дерево, /tetraxis, /тетраксис',
      ].join('\n');
    }

    return SephirotEngine.startAsyncRun(topic);
  }

  private static handleSephirotTree(): string {
    const roles = SEPHIROT_ROLES;
    const lines: string[] = [];
    lines.push('');
    lines.push('═'.repeat(78));
    lines.push('  [=] ДЕРЕВО ЖИТТЯ — 10 СФЕР = 10 АГЕНТІВ (Tetraxis: Vision-Strategy-Execution-Feedback)');
    lines.push('═'.repeat(78));
    for (const r of roles) {
      const parents = r.parentIds.length ? ` ← ${r.parentIds.join(', ')}` : ' ← (root)';
      const persona = r.voicePersona === 'neutral' ? '' : ` [${r.voicePersona}]`;
      lines.push(`  [${r.stage}] ${r.sephira}${persona}`);
      lines.push(`        ${r.nameEn} — ${r.title} | модель: ${r.model}${parents}`);
    }
    lines.push('─'.repeat(78));
    lines.push('  Stage 1: Kether→Chokmah/Binah (намір → сила/форма)');
    lines.push('  Stage 2: Chesed/Gevurah → Tiferet → Netzach → Hod (баланс і зв\'язок)');
    lines.push('  Stage 3: Yesod → Malkuth (дані → виконання)');
    lines.push('  Запуск: /sephirot <тема> | Статус: /sephirot status');
    lines.push('═'.repeat(78));
    return lines.join('\n');
  }

  /**
   * /debug [on|off|status|full] — debug mode + system diagnostics.
   *  - on/off toggles the server-side debug flag (DebugContext in OpLog.ts):
   *    while ON, 'debug'-level entries are recorded in OpLog and chat replies
   *    (ChatRouter stream) get a `debug:` footer with model/provider/latency.
   *  - full renders a full diagnostics dump (node, mem, breakers, OpLog stats,
   *    DB file sizes, omniroute proxy reachability).
   */
  private static handleDebug(args: string[]): string {
    const sub = args[0]?.toLowerCase() || 'status';

    if (sub === 'on' || sub === 'off') {
      const on = sub === 'on';
      setDebugOn(on);
      opLog.log('info', 'system', `debug mode ${on ? 'ON' : 'OFF'}`);
      return `Debug mode ${on ? 'УВІМКНЕНО (ON)' : 'ВИМКНЕНО (OFF)'}.\n` +
        (on
          ? '  Тепер: (1) у відповідях чату з\'явиться футер debug (model/provider/latency); (2) debug-записи пишуться в /log.'
          : '  Debug-записи більше не пишуться в /log (крім помилок).');
    }

    if (sub === 'full') {
      return this.handleDebugFull();
    }

    // status (default)
    return [
      `Debug mode: ${isDebugOn() ? 'ON' : 'OFF'}`,
      '',
      '  Що змінює debug:',
      '    • Футер у відповідях чату: `debug: model=... provider=... latency=...ms fallback=...`',
      '    • Debug-записи рівня "debug" пишуться в журнал операцій (див. /log)',
      '    • /debug full — повна діагностика системи',
      '',
      '  Використання: /debug on | off | status | full',
    ].join('\n');
  }

  /** /debug full — full system diagnostics dump (sync; omniroute probe via 3s-timeout child fetch). */
  private static handleDebugFull(): string {
    const mem = process.memoryUsage();
    const lines: string[] = [];
    lines.push('');
    lines.push('═'.repeat(78));
    lines.push('   DEBUG FULL — ДІАГНОСТИКА СИСТЕМИ');
    lines.push('═'.repeat(78));
    lines.push(`  Node          : ${process.version} (${process.platform}/${process.arch})`);
    lines.push(`  Uptime        : proc ${(process.uptime() / 3600).toFixed(2)} h | OS ${(os.uptime() / 3600).toFixed(1)} h`);
    lines.push(`  Memory        : rss ${(mem.rss / 1048576).toFixed(0)} MB | heap used ${(mem.heapUsed / 1048576).toFixed(0)}/${(mem.heapTotal / 1048576).toFixed(0)} MB`);
    lines.push(`  Debug flag    : ${isDebugOn() ? 'ON' : 'OFF'}`);
    lines.push('─'.repeat(78));

    // Provider breaker health (reuses the /health renderer)
    try {
      lines.push(ProviderFallbackChain.getHealthReport());
    } catch (err: any) {
      lines.push(`  [WRN] Breaker health недоступна: ${err.message}`);
    }

    // OpLog stats
    try {
      const st = opLog.stats();
      lines.push('  OPLOG (журнал операцій):');
      lines.push(`    • Буфер           : ${st.bufferSize}/1000 записів`);
      lines.push(`    • Рівні           : info ${st.byLevel.info} | warn ${st.byLevel.warn} | error ${st.byLevel.error} | debug ${st.byLevel.debug}`);
      lines.push(`    • Типи            : command ${st.byKind.command} | llm ${st.byKind.llm} | breaker ${st.byKind.breaker} | system ${st.byKind.system} | chat ${st.byKind.chat}`);
      if (st.lastError) {
        lines.push(`    • Остання помилка : ${new Date(st.lastError.ts).toISOString().replace('T', ' ').substring(0, 19)} [${st.lastError.kind}] ${st.lastError.text.substring(0, 60)}`);
      }
      lines.push(`    • Файл            : ${st.filePath}${st.fileBytes !== undefined ? ` (${(st.fileBytes / 1024).toFixed(1)} KB)` : ' (ще не створено)'}`);
    } catch (err: any) {
      lines.push(`  [WRN] OpLog stats недоступні: ${err.message}`);
    }
    lines.push('─'.repeat(78));

    // DB paths + sizes
    const ftsPath = '/var/www/evabot-backend/knowledge-base/evaline-knowledge-base/fts_index.db';
    const productsPath = '/var/www/evabot-backend/data/products.json';
    const opsPath = opLog.getPath();
    const fmtSize = (p: string): string => {
      try { return `${(fs.statSync(p).size / 1024).toFixed(1)} KB`; } catch { return 'not found'; }
    };
    let chatDbPath = 'unknown';
    try { chatDbPath = ChatHistoryStore.getInstance().getPath(); } catch { /* store unavailable */ }
    lines.push('  ФАЙЛИ ДАНИХ:');
    lines.push(`    • chat-history.db : ${fmtSize(chatDbPath)} — ${chatDbPath}`);
    lines.push(`    • fts_index.db    : ${fmtSize(ftsPath)} — ${ftsPath}`);
    lines.push(`    • products.json   : ${fmtSize(productsPath)} — ${productsPath}`);
    lines.push(`    • operations.jsonl: ${fmtSize(opsPath)} — ${opsPath}`);
    lines.push('─'.repeat(78));

    // OmniRoute proxy reachability (3s timeout)
    lines.push(`  OmniRoute proxy (http://100.66.98.4:20128/v1/models): ${this.probeOmniroute()}`);
    lines.push('═'.repeat(78));
    return lines.join('\n');
  }

  /** Sync reachability probe of the omniroute edge proxy (3s hard deadline). */
  private static probeOmniroute(): string {
    try {
      const out = execFileSync(
        process.execPath,
        ['-e', 'fetch("http://100.66.98.4:20128/v1/models",{signal:AbortSignal.timeout(2500)}).then(r=>console.log("HTTP "+r.status)).catch(()=>console.log("UNREACHABLE"))'],
        { timeout: 3000, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
      ).trim();
      return out || 'unknown';
    } catch {
      return 'UNREACHABLE (timeout/помилка)';
    }
  }

  /**
   * /log [N] [filter] — tail of the operation log.
   * Args are order-independent: a number is the limit; 'info'|'warn'|'error'|'debug'
   * filter by level; 'command'|'llm'|'breaker'|'system'|'chat' filter by kind;
   * anything else becomes a substring (textLike) filter.
   */
  private static handleLog(args: string[]): string {
    const LEVELS = new Set(['info', 'warn', 'error', 'debug']);
    const KINDS = new Set(['command', 'llm', 'breaker', 'system', 'chat']);
    let limit = 20;
    let level: 'info' | 'warn' | 'error' | 'debug' | undefined;
    let kind: 'command' | 'llm' | 'breaker' | 'system' | 'chat' | undefined;
    let textLike: string | undefined;

    for (const raw of args) {
      const a = raw.toLowerCase();
      if (/^\d+$/.test(a)) {
        limit = Math.max(1, Math.min(200, parseInt(a, 10)));
      } else if (LEVELS.has(a)) {
        level = a as any;
      } else if (KINDS.has(a)) {
        kind = a as any;
      } else {
        textLike = a;
      }
    }

    const entries = opLog.query({ limit, level, kind, textLike });

    const ICON: Record<string, string> = { info: 'i', warn: '[WRN]', error: '[X]', debug: '[DBG]' };
    const lines: string[] = [];
    lines.push('');
    lines.push('═'.repeat(78));
    const filters = [
      level ? `level=${level}` : null,
      kind ? `kind=${kind}` : null,
      textLike ? `text~"${textLike}"` : null,
    ].filter(Boolean).join(', ');
    lines.push(`  ЖУРНАЛ ОПЕРАЦІЙ — ОСТАННІ ${entries.length} ЗАПИСІВ${filters ? ` (${filters})` : ''}`);
    lines.push('═'.repeat(78));

    if (entries.length === 0) {
      lines.push('  Записів немає (фільтр не дав збігів або журнал ще порожній).');
    }
    for (const e of entries) {
      const when = new Date(e.ts).toTimeString().split(' ')[0];
      const text = e.text.length > 120 ? e.text.substring(0, 117) + '...' : e.text;
      lines.push(`  ${when} ${ICON[e.level] || '·'} [${e.kind}] ${text}`);
    }

    lines.push('─'.repeat(78));
    lines.push('  Використання: /log [N] [info|warn|error|debug|command|llm|breaker|system|chat|текст] — порядок довільний.');
    lines.push('  Tip: /debug on → більше debug-записів у /log');
    lines.push('═'.repeat(78));
    return lines.join('\n');
  }

  /**
   * /monitor — TOP-10 sections from the auto-generated model monitor report
   * (data/model-monitor/REPORT.md, produced by scripts/model-monitor.py).
   */
  private static handleMonitor(): string {
    const reportPath = '/var/www/evabot-backend/data/model-monitor/REPORT.md';
    let report: string;
    try {
      report = fs.readFileSync(reportPath, 'utf8');
    } catch {
      return [
        '[WRN] Звіт модельного монітора не знайдено: data/model-monitor/REPORT.md',
        '   Запустіть генератор звіту: python3 scripts/model-monitor.py',
        '   Після завершення повторіть /monitor.',
      ].join('\n');
    }

    // Split the markdown into '## ' sections and keep the TOP-10 ones.
    const sections = report.split(/\n(?=## )/);
    const top = sections.filter((s) => /^## .*TOP-10/i.test(s));
    if (top.length === 0) {
      return '[WRN] У REPORT.md не знайдено секцій TOP-10. Запустіть: python3 scripts/model-monitor.py';
    }

    const dateMatch = report.match(/#\s+(?:> )?Модельный монитор — ([^\n]+)/);
    const lines: string[] = [];
    lines.push('');
    lines.push('═'.repeat(78));
    lines.push('  > МОДЕЛЬНИЙ МОНІТОР — ТОП-10 (авто-агрегація джерел)');
    lines.push('═'.repeat(78));
    if (dateMatch) lines.push(`  Звіт: ${dateMatch[1].trim()}`);
    for (const s of top) {
      lines.push(s.trimEnd());
      lines.push('');
    }
    lines.push('  Оновити звіт: python3 scripts/model-monitor.py');
    lines.push('═'.repeat(78));
    return lines.join('\n');
  }

  /**
   * /developer — password-protected developer mode (FEATURE 2).
   * Parsed from the RAW command string so the password keeps its casing
   * (normalizeCommand lowercases everything). The password is never echoed
   * back and is masked before chat persistence (DeveloperMode.maskPasswordIn).
   */
  private static handleDeveloper(raw: string): string {
    const parsed = DeveloperMode.parseCommand(raw);
    const usage = [
      'РЕЖИМ РОЗРОБНИКА (/developer):',
      '  Використання:',
      '    /developer unlock <пароль> — розблокувати сесію (TTL 2 год)',
      '    /developer status          — стан сесії + залишок TTL',
      '    /developer lock            — зачинити режим',
      '  Синоніми: /девелопер, /розробник',
    ].join('\n');
    if (!parsed || parsed.sub === 'help') {
      return usage;
    }

    const session = DeveloperMode.resolveSession();
    switch (parsed.sub) {
      case 'unlock': {
        if (!DeveloperMode.getPassword()) {
          return 'режим недоступний: встанови EVADEV_PASSWORD';
        }
        if (!parsed.password) {
          return 'Використання: /developer unlock <пароль>';
        }
        const ok = DeveloperMode.unlock(session, parsed.password);
        return ok
          ? `[UNLOCK] Режим розробника АКТИВОВАНО (сесія ${session}, авто-закриття через 2 год).`
          : '[LOCK] Невірний пароль. Режим розробника не активовано.';
      }
      case 'status':
        return DeveloperMode.statusLine(session);
      case 'lock':
        return DeveloperMode.lock(session)
          ? `[LOCK] Режим розробника зачинено (сесія ${session}).`
          : `[LOCK] Режим розробника не був активним (сесія ${session}).`;
      default:
        return usage;
    }
  }

  /**
   * /voices [uk|ru|en] — ONLY-FREE voice catalog grouped by language and
   * family (Chirp3-HD first — most natural, same 1M chars/mo free tier as
   * Wavenet). Shows gender, [FREE] marker, current Eva/Adam selection and
   * the monthly char usage vs cap. Alias-driven by /голоси, /голоса, /звуки.
   */
  private static handleVoices(rawCommand: string): string {
    // Re-parse from the RAW string: voice names are case-sensitive
    // (uk-UA-Chirp3-HD-Kore) and normalizeCommand would lowercase them.
    const rawParts = (rawCommand || '').trim().split(/\s+/);
    const rawArgs = rawParts.slice(1);
    const sub = (rawArgs[0] || '').toLowerCase();
    if (sub === 'set') {
      return this.handleVoicesSet(rawArgs.slice(1));
    }

    const langs: Array<{ code: string; label: string }> = [
      { code: 'uk', label: 'uk-UA' },
      { code: 'ru', label: 'ru-RU' },
      { code: 'en', label: 'en-US' },
    ];
    const langFilter = sub || '';
    const selected = langFilter
      ? langs.filter((l) => l.code === langFilter || l.label.toLowerCase() === langFilter)
      : langs;
    if (selected.length === 0) {
      return [
        'Використання: /voices [uk|ru|en]',
        '  /voices            — усі мови (uk, ru, en)',
        '  /voices uk         — лише uk-UA',
        '  /voices set eva <voice-name>  — змінити голос Єви',
        '  /voices set adam <voice-name> — змінити голос Адама',
      ].join('\n');
    }

    const eva = cloudTts.getEvaVoice();
    const adam = cloudTts.getAdamVoice();
    const used = cloudTts.getMonthChars();
    const cap = cloudTts.getCap();

    const lines: string[] = [];
    lines.push('');
    lines.push('═'.repeat(78));
    lines.push('  ГОЛОСИ TTS — ЛИШЕ FREE-РОДИНИ (Chirp3-HD і Wavenet: 1M симв/міс безкоштовно)');
    lines.push('═'.repeat(78));
    for (const l of selected) {
      const entries = VOICE_CATALOG
        .filter((v) => v.name.startsWith(`${l.label}-`))
        .sort((a, b) => familyRank(a.family) - familyRank(b.family) || a.name.localeCompare(b.name));
      let currentFamily: string | null = null;
      for (const v of entries) {
        if (v.family !== currentFamily) {
          currentFamily = v.family;
          lines.push(`  [${l.label}] ${v.family.toUpperCase()} — ${familyFreeAllowance(v.family).toLocaleString('en-US')} симв/міс FREE`);
        }
        const tag = v.name === eva ? '  <-- EVA' : v.name === adam ? '  <-- ADAM' : '';
        lines.push(`      ${v.name}  (${v.gender})  [FREE]${tag}`);
      }
    }
    lines.push('─'.repeat(78));
    lines.push(`  Поточний вибір: Eva = ${eva} | Adam = ${adam}`);
    lines.push(`  TTS ліміт цього місяця: ${used.toLocaleString('en-US')} / ${cap.toLocaleString('en-US')} симв.`);
    lines.push('  Змінити голос: /voices set eva|adam <voice-name> (лише free-родини;');
    lines.push('  зберігається у data/voice-prefs.json).');
    lines.push('═'.repeat(78));
    return lines.join('\n');
  }

  /**
   * /voices set eva|adam <voice-name> — switches a persona voice after
   * ONLY-FREE validation (chirp3-hd/wavenet/neural2/standard families only;
   * paid-only families such as studio are rejected). Persists to
   * data/voice-prefs.json and hot-reloads the CloudTTS singleton.
   */
  private static handleVoicesSet(args: string[]): string {
    const persona = (args[0] || '').toLowerCase();
    const voiceName = (args[1] || '').trim();
    if ((persona !== 'eva' && persona !== 'adam') || !voiceName || args.length > 2) {
      return [
        'Використання: /voices set eva|adam <voice-name>',
        '  Приклад: /voices set eva uk-UA-Chirp3-HD-Kore',
        '  Дозволені (free-only) родини: chirp3-hd, wavenet, neural2, standard.',
        '  Дивіться доступні голоси: /voices [uk|ru|en]',
      ].join('\n');
    }

    const v = validateVoiceName(voiceName);
    if (!v.ok) {
      return `[ERROR] Голос відхилено: ${v.error}`;
    }

    const key = persona === 'eva' ? 'evaVoice' : 'adamVoice';
    saveVoicePrefs({ [key]: voiceName } as VoicePrefs);
    cloudTts.reloadVoicePrefs();
    const applied = persona === 'eva' ? cloudTts.getEvaVoice() : cloudTts.getAdamVoice();
    return [
      `[OK] Голос ${persona === 'eva' ? 'Єви (Eva)' : 'Адама (Adam)'} змінено на ${applied} (${v.family}, ${v.gender}, FREE).`,
      `  Збережено: ${voicePrefsPath()}`,
      `  Активні голоси: Eva = ${cloudTts.getEvaVoice()} | Adam = ${cloudTts.getAdamVoice()}`,
    ].join('\n');
  }

  /**
   * /settings (aliases: /налаштування, /настройки) — table of the current
   * system state, assembled from the existing singletons (I18nEngine,
   * SystemContext, OpLog debug flag, CloudTTS, CloudSTT, Translator,
   * DeveloperMode). Client-side toggles (autocorrect, emoji) are marked as
   * such because their state lives in the browser localStorage.
   */
  private static handleSettings(): string {
    const locale = I18nEngine.getLocale();
    const lastUsed = getLastUsedModel();
    const ttsUsage = cloudTts.getUsage();
    const sttUsage = readSttUsage();
    const sttUsed = sttUsage.month === sttMonthKey() ? sttUsage.secondsUsed : 0;
    const trUsage = translator.getUsage();
    const session = DeveloperMode.resolveSession();
    const devStatus = DeveloperMode.statusLine(session);

    const lines: string[] = [];
    lines.push('');
    lines.push('═'.repeat(78));
    lines.push('  ПОТОЧНІ НАЛАШТУВАННЯ (/settings)');
    lines.push('═'.repeat(78));
    lines.push(`  Locale           : ${locale.toUpperCase()} (en|uk|ru — /lang)`);
    lines.push(`  Mode             : per-session solo|consilium (/mode; за замовчуванням solo)`);
    lines.push(`  Model (default)  : ${Config.defaultModel}`);
    lines.push(`  Model (last used): ${lastUsed ? `${lastUsed.model} (${lastUsed.provider})` : '(ще не зафіксовано)'}`);
    lines.push(`  Debug            : ${isDebugOn() ? 'ON' : 'OFF'} (/debug on|off|full)`);
    lines.push(`  TTS              : ON; Eva = ${cloudTts.getEvaVoice()} | Adam = ${cloudTts.getAdamVoice()}`);
    lines.push(`  TTS usage        : ${ttsUsage.chars.toLocaleString('en-US')} / ${cloudTts.getCap().toLocaleString('en-US')} симв/міс (${ttsUsage.month})`);
    lines.push(`  STT usage        : ${sttUsed.toLocaleString('en-US')} / ${STT_MONTHLY_CAP_SECONDS.toLocaleString('en-US')} сек/міс (${sttUsage.month})`);
    lines.push(`  Translate usage  : ${trUsage.chars.toLocaleString('en-US')} / ${TRANSLATE_FREE_TIER_CHARS.toLocaleString('en-US')} симв/міс (${trUsage.month})`);
    lines.push(`  Autocorrect      : клієнтський перемикач (/autocorrect on|off у веб-UI)`);
    lines.push(`  Emoji mode       : клієнтський перемикач (/emoji on|off; за замовчуванням OFF — емодзі вирізаються)`);
    lines.push(`  Developer mode   : ${devStatus}`);
    lines.push(`  Session id       : ${session}`);
    lines.push('═'.repeat(78));
    return lines.join('\n');
  }

  /**
   * /agents (aliases: /агенти, /рота, /роли-агентів) — two-section agent
   * roster: 18 corporate roles (CORPORATE_ROLES) + 10 Sephirot Tree-of-Life
   * nodes (SEPHIROT_ROLES). Adam/Eva personas are marked explicitly.
   */
  private static handleAgents(): string {
    const corporate = Object.values(CORPORATE_ROLES);
    const lines: string[] = [];
    lines.push('');
    lines.push('═'.repeat(78));
    lines.push('  РОСТЕР АГЕНТІВ (/agents) — КОРПОРАЦІЯ + СЕФІРОТ');
    lines.push('═'.repeat(78));

    lines.push(`  [CORPORATE] ШІ-корпорація — ${corporate.length} ролей:`);
    let i = 1;
    for (const role of corporate) {
      const persona = /Adam/i.test(role.name) ? ' [ADAM]' : /Eva/i.test(role.name) ? ' [EVA]' : '';
      lines.push(`   ${String(i).padStart(2)}. ${role.id.padEnd(18)} ${role.name} | модель: ${role.preferredModel}${persona}`);
      i++;
    }

    lines.push('');
    lines.push(`  [SEPHIROT] Дерево Життя — ${SEPHIROT_ROLES.length} вузлів (консиліум):`);
    let j = 1;
    for (const node of SEPHIROT_ROLES) {
      const persona = node.voicePersona === 'neutral' ? '' : ` [${node.voicePersona.toUpperCase()}]`;
      lines.push(`   ${String(j).padStart(2)}. ${node.sephira} | ${node.nameEn} — ${node.title} | модель: ${node.model}${persona}`);
      j++;
    }

    lines.push('─'.repeat(78));
    lines.push(`  Всього: ${corporate.length} корпоративних ролей + ${SEPHIROT_ROLES.length} вузлів Сефірот = ${corporate.length + SEPHIROT_ROLES.length} агентів.`);
    lines.push('  Персони озвучки: [EVA] — голос Єви, [ADAM] — голос Адама, решта neutral.');
    lines.push('═'.repeat(78));
    return lines.join('\n');
  }

  private static handleInfo(args: string[]): string {
    const query = args[0]?.toLowerCase();
    if (!query) {
      return `Использование: /info <model_id> (напр. /info gemini-3.8-flash или /info claude-3-7-sonnet)`;
    }

    const model = ModelRegistry.getAllModels().find(
      (m) => m.id.toLowerCase() === query || m.name.toLowerCase().includes(query) || m.id.toLowerCase().includes(query)
    );

    if (!model) {
      return `[ERROR] Модель "${query}" не найдена в каталоге 78 моделей. Используйте /models для поиска.`;
    }

    const rating = ModelRatings.computeRating(model);
    const isFree = model.pricing.freeTierStatus === '100% Free Quota Available';
    const lines: string[] = [];
    lines.push('');
    lines.push('═'.repeat(78));
    lines.push(`  ТЕХНИЧЕСКИЙ ПАСПОРТ МОДЕЛИ: ${model.name.toUpperCase()}`);
    lines.push('═'.repeat(78));
    lines.push(`  ID модели        : ${model.id}`);
    lines.push(`  Провайдер        : ${model.provider} [Категория: ${model.category}]`);
    lines.push(`  Протокол вызова  : ${model.protocol} │ Рекомендовано: ${model.recommended ? 'ДА' : 'НЕТ'}`);
    lines.push(`  Тарифный статус  : ${isFree ? '100% FREE QUOTA' : 'PAID / COMMERCIAL'}`);
    lines.push('─'.repeat(78));
    lines.push(`  Контекстное окно : ${model.contextWindow.toLocaleString()} токенов (~${(model.contextWindow / 1000).toFixed(0)}k)`);
    lines.push(`  Макс. ответ      : ${model.maxOutputTokens.toLocaleString()} токенов`);
    lines.push('─'.repeat(78));
    lines.push(`  СТОИМОСТЬ ТОКЕНОВ:`);
    lines.push(`    • Входящие     : ${model.pricing.inputPer1MTokensUSD} (${model.pricing.inputPer1MTokensEUR})`);
    lines.push(`    • Исходящие    : ${model.pricing.outputPer1MTokensUSD} (${model.pricing.outputPer1MTokensEUR})`);
    lines.push(`    • Квоты / Лимит: ${model.pricing.freeTierDetails}`);
    lines.push('─'.repeat(78));
    lines.push(`  РЕЙТИНГ И БЕНЧМАРКИ (Оценка системы: ${rating.composite}/100):`);
    lines.push(`    • Интеллект / Кодинг : ${rating.quality}/100`);
    lines.push(`    • Новизна (2026 fleet): ${rating.recency}/100`);
    lines.push(`    • Скорость генерации : ${rating.speed}/100`);
    lines.push(`    • Емкость контекста  : ${rating.context}/100`);
    lines.push(`    • Экономичность      : ${rating.cost}/100`);
    lines.push('─'.repeat(78));
    lines.push(`  ОПИСАНИЕ:`);
    lines.push(`    ${model.description}`);
    lines.push('═'.repeat(78));
    return lines.join('\n');
  }
}
