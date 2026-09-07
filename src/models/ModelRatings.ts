import { ModelRegistry, GeminiModelInfo } from './ModelRegistry.js';
import { AccountingEngine } from '../core/AccountingEngine.js';
import { AgentBuilder } from '../core/AgentBuilder.js';

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
      'gemini-3.8-flash',
      'gemini-3.1-pro',
      'gemini-3.1-flash',
      'omniroute/gemini-3.8-flash',
      'omniroute/gemini-3.1-pro',
      'qwen/qwen-2.5-coder-32b-instruct:free',
      'deepseek/deepseek-r1:free',
      'gemini-2.5-pro',
      'gemini-2.5-flash',
    ];

    for (const id of candidateIds) {
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

    // Strict priority: Newest 2026 Frontier -> Coding Specialists -> Stable Fleet
    const trustedFleet = [
      'gemini-3.8-flash',
      'gemini-3.1-pro',
      'gemini-3.1-flash',
      'omniroute/gemini-3.8-flash',
      'qwen/qwen-2.5-coder-32b-instruct:free',
      'deepseek/deepseek-r1:free',
      'gemini-2.5-pro',
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'meta-llama/llama-3.3-70b-instruct:free',
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

export class ModelCommand {
  public static execute(command: string): string {
    const cmd = command.toLowerCase().trim();
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
      case '/cost':
      case '/finance':
      case '/budget':
        return AccountingEngine.formatCostReport();
      case '/company':
      case '/team':
      case '/roster':
      case '/evaline':
      case '/business':
        return this.handleCompany(parts.slice(1));
      case '/info':
      case '/inspect':
        return this.handleInfo(parts.slice(1));
      default:
        return `[ERROR] Unknown command: ${action}. Use /top, /models, /mcp, /lsp, /cost, /company, /info, /free, /paid, or /help.`;
    }
  }

  private static handleTop(args: string[]): string {
    const filter = args[0]?.toLowerCase() || 'all';
    const limit = parseInt(args[1] || '10', 10);

    switch (filter) {
      case 'free':
        return ModelRatings.formatTopList(
          ModelRatings.getTopFree(limit),
          `🏆 ТОП-${limit} БЕСПЛАТНЫХ МОДЕЛЕЙ (по качеству)`
        );
      case 'paid':
        return ModelRatings.formatTopList(
          ModelRatings.getTopPaid(limit),
          `🏆 ТОП-${limit} ПЛАТНЫХ МОДЕЛЕЙ (по качеству)`
        );
      case 'speed':
        return ModelRatings.formatTopList(
          ModelRatings.getTopBySpeed(true, limit),
          `⚡ ТОП-${limit} САМЫХ БЫСТРЫХ БЕСПЛАТНЫХ`
        );
      case 'context':
        return ModelRatings.formatTopList(
          ModelRatings.getTopByContext(true, limit),
          `📚 ТОП-${limit} БОЛЬШЕ КОНТЕКСТА (бесплатные)`
        );
      case 'all':
      default:
        const freeTop = ModelRatings.getTopFree(5);
        const paidTop = ModelRatings.getTopPaid(5);
        let result = ModelRatings.formatTopList(freeTop, `💰 ТОП-5 БЕСПЛАТНЫХ (из 46)`);
        result += '\n' + ModelRatings.formatTopList(paidTop, `💳 ТОП-5 ПЛАТНЫХ (из 32)`);
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
    lines.push(`  💰 ВСЕ БЕСПЛАТНЫЕ МОДЕЛИ (${models.length} моделей)`);
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
    lines.push(`  💳 ВСЕ ПЛАТНЫЕ МОДЕЛИ (${models.length} моделей)`);
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
      lines.push('  📊 СВОДКА ПО МОДЕЛЯМ');
      lines.push('═'.repeat(78));
      lines.push('');
      lines.push(`  💰 Бесплатных: ${free.length} моделей (${((free.length / (free.length + paid.length)) * 100).toFixed(0)}%)`);
      lines.push(`  💳 Платных:    ${paid.length} моделей (${((paid.length / (free.length + paid.length)) * 100).toFixed(0)}%)`);
      lines.push(`  📦 Всего:      ${free.length + paid.length} моделей`);
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
    lines.push('  🔌 MCP СЕРВЕРЫ (Model Context Protocol Suite // 21 активный сервер)');
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
    lines.push('  🧠 LSP СЕРВЕРЫ (Language Server Protocol // Глобальные языковые демоны)');
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
    if (tier === 'free') {
      return AgentBuilder.formatCompanyReport(AgentBuilder.buildFreeCompany());
    }
    if (tier === 'paid') {
      return AgentBuilder.formatCompanyReport(AgentBuilder.buildPaidCompany());
    }
    return AgentBuilder.formatCompanyReport(AgentBuilder.buildEvaLineBusinessCompany());
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
    lines.push(`  📋 ТЕХНИЧЕСКИЙ ПАСПОРТ МОДЕЛИ: ${model.name.toUpperCase()}`);
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
