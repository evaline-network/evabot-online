import { ModelRegistry, GeminiModelInfo } from '../models/ModelRegistry.js';
import { AccountingEngine, AgentUnitCostSpec } from './AccountingEngine.js';

export interface AgentPersona {
  roleId: string;
  title: string;
  department: 'Leadership' | 'Engineering' | 'Quality & Security' | 'Research & Operations';
  mission: string;
  assignedModelId: string;
  assignedModelName: string;
  isFree: boolean;
  contextWindow: number;
  unitCost: AgentUnitCostSpec;
  requiredMcpTools: string[];
}

export interface AgentCompany {
  name: string;
  tier: 'Free Frontier Fleet' | 'Commercial Flagship Fleet';
  description: string;
  roster: AgentPersona[];
  totalHourlyCostUSD: number;
  averageTaskCostUSD: number;
}

export class AgentBuilder {
  /**
   * Top 10 Smartest FREE Models Company
   */
  public static buildFreeCompany(): AgentCompany {
    const specs = [
      {
        roleId: 'ceo_architect',
        title: 'CEO & System Architect',
        department: 'Leadership' as const,
        mission: 'Глобальная архитектура системы, стратегическое планирование и декомпозиция задач.',
        modelId: 'gemini-3.8-flash',
        tools: ['sequential-thinking', 'memory', 'sqlite'],
      },
      {
        roleId: 'cto_planner',
        title: 'CTO & Principal Engineer',
        department: 'Leadership' as const,
        mission: 'Техническое лидерство, 2M-контекстный анализ монорепозиториев и проектирование API.',
        modelId: 'gemini-3.1-pro',
        tools: ['filesystem', 'git', 'github'],
      },
      {
        roleId: 'lead_backend',
        title: 'Lead Backend Developer',
        department: 'Engineering' as const,
        mission: 'Разработка микросервисов, Node.js/TypeScript оптимизация и высоконагруженный бэкенд.',
        modelId: 'gemini-3.1-flash',
        tools: ['filesystem', 'docker', 'google-cloud'],
      },
      {
        roleId: 'frontend_engineer',
        title: 'Fullstack & Terminal UI Engineer',
        department: 'Engineering' as const,
        mission: 'Создание TUI интерфейсов, моноширинного Markdown рендеринга и веб-клиентов.',
        modelId: 'omniroute/gemini-3.8-flash',
        tools: ['chrome-devtools', 'fetch'],
      },
      {
        roleId: 'rag_data_architect',
        title: 'Data & Vector RAG Architect',
        department: 'Engineering' as const,
        mission: 'Управление ChromaDB, SQLite FTS5 и многоязычной базой знаний EvaLine.',
        modelId: 'omniroute/gemini-3.1-pro',
        tools: ['notebooklm', 'sqlite', 'memory'],
      },
      {
        roleId: 'lead_coder',
        title: 'Senior Coder & Refactoring Specialist',
        department: 'Engineering' as const,
        mission: 'Глубокая оптимизация алгоритмов, рефакторинг и кодогенерация на Coder 32B.',
        modelId: 'qwen/qwen-2.5-coder-32b-instruct:free',
        tools: ['filesystem', 'git'],
      },
      {
        roleId: 'deep_reasoner',
        title: 'Research & Deep Logic Scientist',
        department: 'Research & Operations' as const,
        mission: 'Сложные математические доказательства, верификация гипотез и дедуктивный анализ.',
        modelId: 'deepseek/deepseek-r1:free',
        tools: ['sequential-thinking', 'fetch'],
      },
      {
        roleId: 'security_auditor',
        title: 'Security Auditor & RedTeam Lead',
        department: 'Quality & Security' as const,
        mission: 'Аудит безопасности, OOM-защита, анализ утечек токенов и соответствие стандартам.',
        modelId: 'gemini-2.5-pro',
        tools: ['firebase', 'filesystem', 'markdownlint'],
      },
      {
        roleId: 'devops_sre',
        title: 'DevOps & SRE Engineer',
        department: 'Quality & Security' as const,
        mission: 'Мониторинг кластера Франкфурт ↔ Айова, systemd сервисы, логирование и развертывание.',
        modelId: 'gemini-2.5-flash',
        tools: ['docker', 'google-cloud', 'filesystem'],
      },
      {
        roleId: 'tech_writer',
        title: 'Technical Writer & Localization Lead',
        department: 'Research & Operations' as const,
        mission: 'Документация RFC, мультиязычные манифесты (UK/EN/RU/DE) и отчетность.',
        modelId: 'meta-llama/llama-3.3-70b-instruct:free',
        tools: ['markdownlint', 'git'],
      },
    ];

    return this.assembleCompany('EvaLine Autonomous AI Enterprise (100% Free Fleet)', 'Free Frontier Fleet', specs);
  }

  /**
   * Top 10 Smartest PAID Models Company
   */
  public static buildPaidCompany(): AgentCompany {
    const specs = [
      {
        roleId: 'enterprise_architect',
        title: 'Enterprise Chief Architect',
        department: 'Leadership' as const,
        mission: 'Высший SWE-bench 70.3% анализ, гибридное пошаговое рассуждение и системный дизайн.',
        modelId: 'claude-3-7-sonnet',
        tools: ['sequential-thinking', 'memory'],
      },
      {
        roleId: 'math_stem_scientist',
        title: 'Lead Scientist & Algorithmic Reasoner',
        department: 'Leadership' as const,
        mission: 'Комплексные STEM-вычисления, продвинутая олимпиадная логика и синтез.',
        modelId: 'openai/o3-mini',
        tools: ['sequential-thinking'],
      },
      {
        roleId: 'deep_planner',
        title: 'Deep Multi-Step Problem Solver',
        department: 'Research & Operations' as const,
        mission: 'Анализ критических уязвимостей и многошаговые цепочки логических решений.',
        modelId: 'openai/o1',
        tools: ['sequential-thinking', 'sqlite'],
      },
      {
        roleId: 'lead_fullstack',
        title: 'Senior Omnimodal Engineer',
        department: 'Engineering' as const,
        mission: 'Мультимодальная интеграция, обработка диаграмм, изображений и сложного кода.',
        modelId: 'gpt-4o',
        tools: ['chrome-devtools', 'fetch'],
      },
      {
        roleId: 'fast_coder',
        title: 'Specialized High-Speed Coder',
        department: 'Engineering' as const,
        mission: 'Сверхбыстрая генерация чистого кода на Codestral 2501.',
        modelId: 'mistralai/codestral-2501',
        tools: ['filesystem', 'git'],
      },
      {
        roleId: 'autonomous_dev',
        title: 'Autonomous Software Engineer',
        department: 'Engineering' as const,
        mission: 'Фронтирный кодинг и агентная разработка сложных модулей.',
        modelId: 'claude-3-5-sonnet',
        tools: ['filesystem', 'github'],
      },
      {
        roleId: 'rapid_qa',
        title: 'Rapid Verification & QA Inspector',
        department: 'Quality & Security' as const,
        mission: 'Быстрый прогон тестов, поиск регрессий и статический анализ.',
        modelId: 'claude-3-5-haiku',
        tools: ['filesystem', 'markdownlint'],
      },
      {
        roleId: 'massive_scale_analyst',
        title: 'Massive Open-Weights Analyst (405B)',
        department: 'Research & Operations' as const,
        mission: 'Анализ огромных массивов неструктурированных данных на 405-миллиардной модели.',
        modelId: 'meta-llama/llama-3.1-405b',
        tools: ['sqlite', 'memory'],
      },
      {
        roleId: 'mega_context_investigator',
        title: '2M Mega-Context Investigator',
        department: 'Research & Operations' as const,
        mission: 'Аудит гигантских кодовых баз и сопоставление сотен файлов в 2M контексте.',
        modelId: 'gemini-1.5-pro',
        tools: ['filesystem', 'notebooklm'],
      },
      {
        roleId: 'dedicated_code_reviewer',
        title: 'Dedicated Code Reviewer & SRE',
        department: 'Quality & Security' as const,
        mission: 'Строгий аудит пул-реквестов, стиль кода и интеграционные тесты.',
        modelId: 'qwen/qwen-2.5-coder-32b-instruct',
        tools: ['git', 'github'],
      },
    ];

    return this.assembleCompany('EvaLine Commercial Titan Enterprise (Paid Flagship Fleet)', 'Commercial Flagship Fleet', specs);
  }

  private static assembleCompany(
    name: string,
    tier: 'Free Frontier Fleet' | 'Commercial Flagship Fleet',
    specs: Array<{
      roleId: string;
      title: string;
      department: 'Leadership' | 'Engineering' | 'Quality & Security' | 'Research & Operations';
      mission: string;
      modelId: string;
      tools: string[];
    }>
  ): AgentCompany {
    const roster: AgentPersona[] = [];
    let totalHourlyCostUSD = 0;
    let totalTaskCostUSD = 0;

    for (const s of specs) {
      const model = ModelRegistry.getModelById(s.modelId) || {
        id: s.modelId,
        name: s.modelId,
        contextWindow: 128000,
        pricing: { freeTierStatus: tier.includes('Free') ? '100% Free Quota Available' : 'Paid / Pay-As-You-Go Only' },
      } as any;

      const isFree = model.pricing.freeTierStatus === '100% Free Quota Available';
      const unitCost = AccountingEngine.calculateAgentUnitCost(s.title, s.modelId);

      totalHourlyCostUSD += unitCost.baseInfraCostPerHour;
      totalTaskCostUSD += unitCost.typicalTaskCostUSD;

      roster.push({
        roleId: s.roleId,
        title: s.title,
        department: s.department,
        mission: s.mission,
        assignedModelId: model.id,
        assignedModelName: model.name,
        isFree,
        contextWindow: model.contextWindow,
        unitCost,
        requiredMcpTools: s.tools,
      });
    }

    return {
      name,
      tier,
      description: `Автономная компания из 10 специализированных ИИ-агентов (${tier}) с фиксированными ролями, инструментами и учетом себестоимости.`,
      roster,
      totalHourlyCostUSD: parseFloat(totalHourlyCostUSD.toFixed(4)),
      averageTaskCostUSD: parseFloat((totalTaskCostUSD / roster.length).toFixed(4)),
    };
  }

  /**
   * Formats the Agent Company in authentic ASCII terminal layout
   */
  public static formatCompanyReport(company: AgentCompany): string {
    const lines: string[] = [];
    lines.push('');
    lines.push('═'.repeat(78));
    lines.push(`  🏢 КОНСТРУКТОР АГЕНТОВ // ${company.name.toUpperCase()}`);
    lines.push('═'.repeat(78));
    lines.push(`  Категория: ${company.tier} │ Ростер: 10 специализированных агентов`);
    lines.push(`  Экономика: Инфраструктура $${company.totalHourlyCostUSD}/час │ Ср. задача $${company.averageTaskCostUSD}`);
    lines.push('─'.repeat(78));
    lines.push('  #  РОЛЬ / СПЕЦИАЛИЗАЦИЯ           МОДЕЛЬ               КОНТЕКСТ   СТАТУС');
    lines.push('─'.repeat(78));

    company.roster.forEach((a, idx) => {
      const num = (idx + 1).toString().padStart(2);
      const title = a.title.padEnd(28).substring(0, 28);
      const model = a.assignedModelName.padEnd(20).substring(0, 20);
      const ctx = `${(a.contextWindow / 1000).toFixed(0)}k`.padStart(8);
      const badge = a.isFree ? '[100% FREE]' : '[PAID]';
      lines.push(`  ${num} ${title} ${model} ${ctx}   ${badge}`);
      lines.push(`     └─ Миссия: ${a.mission}`);
      lines.push(`     └─ Инструменты: ${a.requiredMcpTools.join(', ')} │ Себестоимость задачи: $${a.unitCost.typicalTaskCostUSD.toFixed(4)}`);
    });

    lines.push('═'.repeat(78));
    return lines.join('\n');
  }
}
