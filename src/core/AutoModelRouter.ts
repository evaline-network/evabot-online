/**
 * AutoModelRouter — /auto smart dynamic free-model selection (TASK-320).
 *
 * ONLY-FREE policy: the router picks exclusively from models with
 * pricing.freeTierStatus === '100% Free Quota Available'. It never selects a
 * paid model, so /auto can never generate billing.
 *
 * Selection inputs (per request):
 *  1. Context volume — estimated tokens of message + chat history; a model
 *     whose context window cannot hold the payload is disqualified.
 *  2. Task complexity — heuristic tiers: light chat / code / deep reasoning /
 *     longform. Complexity shifts quality weight up and speed weight down.
 *  3. Provider limits — RPM hints parsed from freeTierDetails + per-provider
 *     CircuitBreaker state (an open breaker disqualifies the whole provider).
 *
 * State: per-session auto flag + last decision cache. The auto flag and the
 * last used model are persisted per session in ChatHistoryStore (session_state
 * table, TASK-333) and survive restarts; the in-memory Set is a write-through
 * cache seeded lazily from the store on first access per session. lastDecision
 * stays in-process only.
 */

import { ModelRegistry, GeminiModelInfo } from '../models/ModelRegistry.js';
import { ModelRatings, ModelRating } from '../models/ModelRatings.js';
import { getBreaker, providerOfModel } from './Resilience.js';
import { OpLog } from './OpLog.js';
import { ChatHistoryStore } from './ChatHistoryStore.js';

export type TaskComplexity = 'light' | 'code' | 'reasoning' | 'longform';

export interface TaskAnalysis {
  estimatedTokens: number;
  complexity: TaskComplexity;
  isCode: boolean;
  needsLargeContext: boolean;
  signals: string[];
}

export interface AutoDecision {
  modelId: string;
  modelName: string;
  provider: string;
  complexity: TaskComplexity;
  estimatedTokens: number;
  contextWindow: number;
  score: number;
  reason: string;
  runnerUp?: string;
}

export interface AutoPickInput {
  message: string;
  history?: Array<{ role: string; content: string }>;
  /** History messages beyond this count are ignored for estimation. */
  historyLimit?: number;
}

/** Rough token estimate: ~4 chars per token plus per-message overhead. */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4) + 8;
}

const CODE_SIGNALS: Array<[RegExp, string]> = [
  [/```/, 'fenced code block'],
  [/\b(function|class|const|let|var|import|export|def|async|await|return)\b/, 'source-code keywords'],
  [/\b(SELECT|INSERT|UPDATE|DELETE|JOIN)\b.*\b(FROM|INTO|SET)\b/i, 'SQL'],
  [/\b(debug|bug|error|exception|stack ?trace|refactor|compile|typescript|python|javascript|json|api)\b/i, 'debug/dev vocabulary'],
  [/\b(баг|ошибк\w+|исключени\w+|рефактор\w*|компиляц\w+|отлад\w+|класс|функци\w+|скрипт\w*|запрос\w*)\b/i, 'debug/dev vocabulary (RU)'],
  [/\b(баг|помилк\w+|виняток\w+|рефакторин\w+|налагоджен\w+|клас|функц\w+|скрипт\w*)\b/i, 'debug/dev vocabulary (UK)'],
  [/^[ \t]*[{<\[#]|;\s*$/m, 'code-like punctuation'],
];

const REASONING_SIGNALS: Array<[RegExp, string]> = [
  [/\b(prove|proof|theorem|logic|strategy|architect|design|compare|trade-?off|analyz|аналіз|дослідж|доказ|стратег)\w*/i, 'analytical vocabulary'],
  [/\?{2,}|\bwhy\b|\bчому\b|\bпочему\b/i, 'deep-why question'],
  [/^(порівняй|сравни|compare|проанализ|проаналіз)/i, 'explicit analysis request'],
];

const LONGFORM_SIGNALS: Array<[RegExp, string]> = [
  [/\b(essay|статья|стаття|report|доклад|документ|перепиши|rewrite|summarize|summary|резюмируй|конспект)\w*/i, 'longform request'],
  [/\b(переведи|translate)\b/i, 'translation task'],
];

/**
 * Heuristic task analysis: volume + complexity tier.
 */
export function analyzeTask(input: AutoPickInput): TaskAnalysis {
  const historyLimit = input.historyLimit ?? 12;
  const history = (input.history || []).slice(-historyLimit);
  const historyText = history.map((m) => m.content || '').join('\n');
  const fullText = `${historyText}\n${input.message || ''}`;

  const estimatedTokens = estimateTokens(fullText);
  const signals: string[] = [];

  let isCode = false;
  for (const [re, label] of CODE_SIGNALS) {
    if (re.test(input.message)) {
      isCode = true;
      signals.push(label);
      break;
    }
  }

  let isReasoning = false;
  for (const [re, label] of REASONING_SIGNALS) {
    if (re.test(input.message)) {
      isReasoning = true;
      signals.push(label);
      break;
    }
  }

  let isLongform = false;
  for (const [re, label] of LONGFORM_SIGNALS) {
    if (re.test(input.message)) {
      isLongform = true;
      signals.push(label);
      break;
    }
  }

  const needsLargeContext = estimatedTokens > 60_000;
  if (needsLargeContext) signals.push(`large payload ~${(estimatedTokens / 1000).toFixed(0)}k tok`);

  let complexity: TaskComplexity;
  if (isCode) complexity = 'code';
  else if (isReasoning) complexity = 'reasoning';
  else if (isLongform || estimatedTokens > 12_000) complexity = 'longform';
  else complexity = 'light';

  return { estimatedTokens, complexity, isCode, needsLargeContext, signals };
}

/** Parses the RPM hint embedded in freeTierDetails ('15 RPM', '30 RPM', ...). */
function rpmOf(model: GeminiModelInfo): number {
  const m = model.pricing.freeTierDetails.match(/(\d+)\s*RPM/i);
  return m ? parseInt(m[1], 10) : 0;
}

/**
 * Per-complexity weight profile. Quality dominates hard tasks; speed
 * dominates light chat; context always matters for big payloads.
 */
function weightsFor(complexity: TaskAnalysis['complexity']): { quality: number; context: number; speed: number; limit: number } {
  switch (complexity) {
    case 'code':
      return { quality: 0.55, context: 0.25, speed: 0.05, limit: 0.15 };
    case 'reasoning':
      return { quality: 0.55, context: 0.20, speed: 0.05, limit: 0.20 };
    case 'longform':
      return { quality: 0.30, context: 0.45, speed: 0.05, limit: 0.20 };
    case 'light':
    default:
      return { quality: 0.30, context: 0.10, speed: 0.40, limit: 0.20 };
  }
}

/** Context fit 0..100: plenty of headroom over the estimated payload. */
function contextFit(contextWindow: number, estimatedTokens: number): number {
  if (estimatedTokens === 0) return 60;
  const ratio = contextWindow / (estimatedTokens * 1.5);
  if (ratio >= 8) return 100;
  if (ratio >= 4) return 90;
  if (ratio >= 2) return 75;
  if (ratio >= 1) return 50;
  return 0; // payload would not fit — disqualified upstream anyway
}

/** Provider-limit health 0..100 from RPM hints + breaker state. */
function limitHealth(model: GeminiModelInfo): { score: number; open: boolean } {
  const provider = providerOfModel(model.id);
  const breaker = getBreaker(provider);
  if (breaker.getState() === 'open') return { score: 0, open: true };
  const rpm = rpmOf(model);
  let score = 50;
  if (rpm >= 30) score = 100;
  else if (rpm >= 20) score = 85;
  else if (rpm >= 15) score = 70;
  else if (rpm >= 5) score = 45;
  else if (rpm > 0) score = 25;
  return { score, open: false };
}

/** Curated free fleet — real registry ids only, LIVE-VERIFIED on OpenRouter
 *  2026-09-08 (queried /api/v1/models with $0 pricing + live chat matrix).
 *  POLICY: Gemini on our Google account is RESERVED FOR DEVELOPMENT.
 *  Removed after live testing: thinkingmachines/inkling{,-small}:free (403
 *  'agentic harnesses only'), nvidia/nemotron-3-ultra (55B MoE exceeds the
 *  45s interactive deadline). `openrouter/free` is the always-working
 *  terminal fallback. */
const AUTO_FLEET_IDS = [
  'openrouter/free',
  'nvidia/nemotron-3-super-120b-a12b:free',
  'dots-studio/dots-3-note-preview:free',
  'cohere/north-mini-code:free',
  'inclusionai/ling-3.0-flash-sante:free',
  'poolside/laguna-s-2.1:free',
  'google/gemma-4-31b-it:free',
  'omni/cf-gpt-oss-120b',
  'omni/cf-llama-3.3-70b',
  'omni/groq-gpt-oss-120b',
  'omni/zai-glm-5.3-flash',
];

/**
 * AutoModelRouter — session registry + scoring engine.
 */
export class AutoModelRouter {
  private static autoSessions = new Set<string>();
  private static seededSessions = new Set<string>();
  private static lastDecision = new Map<string, AutoDecision>();

  /** Lazily seeds the in-memory auto-flag cache from the persisted store (once per session). */
  private static ensureSeeded(sessionId: string): void {
    if (AutoModelRouter.seededSessions.has(sessionId)) return;
    AutoModelRouter.seededSessions.add(sessionId);
    try {
      const state = ChatHistoryStore.getInstance().getSessionState(sessionId);
      if (state.autoEnabled) AutoModelRouter.autoSessions.add(sessionId);
    } catch {
      // persistence is best-effort — never break routing on store errors
    }
  }

  public static isActive(sessionId: string): boolean {
    AutoModelRouter.ensureSeeded(sessionId);
    return AutoModelRouter.autoSessions.has(sessionId);
  }

  public static setActive(sessionId: string, on: boolean): void {
    AutoModelRouter.seededSessions.add(sessionId);
    if (on) AutoModelRouter.autoSessions.add(sessionId);
    else {
      AutoModelRouter.autoSessions.delete(sessionId);
      AutoModelRouter.lastDecision.delete(sessionId);
    }
    try {
      ChatHistoryStore.getInstance().setSessionAuto(sessionId, on);
    } catch {
      // persistence is best-effort
    }
  }

  public static activeSessions(): string[] {
    return [...AutoModelRouter.autoSessions];
  }

  public static getLastDecision(sessionId: string): AutoDecision | null {
    return AutoModelRouter.lastDecision.get(sessionId) || null;
  }

  /**
   * Picks the best free model for the request. Deterministic, synchronous,
   * offline (no network) — only registry data + breaker state.
   */
  public static pick(input: AutoPickInput, sessionId: string = 'cli'): AutoDecision {
    const analysis = analyzeTask(input);
    const weights = weightsFor(analysis.complexity);

    let best: { model: GeminiModelInfo; score: number } | null = null;
    let runnerUp: string | undefined;
    const considered: string[] = [];

    for (const id of AUTO_FLEET_IDS) {
      const model = ModelRegistry.getModelById(id);
      if (!model) continue;
      if (model.pricing.freeTierStatus !== '100% Free Quota Available') continue;
      // Hard disqualify: context cannot hold the payload with headroom.
      if (model.contextWindow < analysis.estimatedTokens * 1.2) continue;
      const { open } = limitHealth(model);
      if (open) continue;

      const rating: ModelRating = ModelRatings.computeRating(model);
      const fit = contextFit(model.contextWindow, analysis.estimatedTokens);
      const health = limitHealth(model).score;
      const score =
        rating.quality * weights.quality +
        fit * weights.context +
        rating.speed * weights.speed +
        health * weights.limit;
      considered.push(`${id}:${Math.round(score)}`);

      if (!best || score > best.score) {
        runnerUp = best?.model.id;
        best = { model, score };
      }
    }

    // Guaranteed terminal fallback: openrouter/free meta-router (never dies
    // from a single model removal). Gemini is reserved for development.
    const chosen = best?.model
      || ModelRegistry.getModelById('openrouter/free')
      || ModelRegistry.getModelById('nvidia/nemotron-3-super-120b-a12b:free')
      || ModelRegistry.getFreeModels()[0];
    const decision: AutoDecision = {
      modelId: chosen.id,
      modelName: chosen.name,
      provider: providerOfModel(chosen.id),
      complexity: analysis.complexity,
      estimatedTokens: analysis.estimatedTokens,
      contextWindow: chosen.contextWindow,
      score: Math.round(best?.score ?? 0),
      reason: AutoModelRouter.explain(chosen, analysis, weights),
      runnerUp,
    };
    AutoModelRouter.lastDecision.set(sessionId, decision);
    try {
      ChatHistoryStore.getInstance().setSessionLastModel(sessionId, decision.modelId);
    } catch {
      // persistence is best-effort
    }
    OpLog.getInstance().log('info', 'auto', `/auto ${sessionId} → ${decision.modelId} (complexity=${analysis.complexity}, tokens≈${analysis.estimatedTokens}, score=${decision.score})`);
    return decision;
  }

  private static explain(model: GeminiModelInfo, analysis: TaskAnalysis, weights: { quality: number; context: number; speed: number; limit: number }): string {
    const tier: Record<TaskAnalysis['complexity'], string> = {
      light: 'простой диалог → приоритет скорости',
      code: 'код/отладка → приоритет качества',
      reasoning: 'глубокий анализ → приоритет качества',
      longform: 'длинный контекст → приоритет объёма окна',
    };
    const signals = analysis.signals.length > 0 ? `; сигналы: ${analysis.signals.slice(0, 3).join(', ')}` : '';
    return `${tier[analysis.complexity]} (Q×${weights.quality} C×${weights.context} S×${weights.speed} L×${weights.limit}); окно ${model.contextWindow.toLocaleString()} tok против ~${analysis.estimatedTokens.toLocaleString()} tok${signals}`;
  }

  /** Human-readable status block for the /auto command. */
  public static formatStatus(sessionId: string): string {
    const active = AutoModelRouter.isActive(sessionId);
    const decision = AutoModelRouter.getLastDecision(sessionId);
    const lines: string[] = [];
    lines.push('');
    lines.push('═'.repeat(78));
    lines.push('  AUTO — ДИНАМИЧЕСКИЙ ВЫБОР БЕСПЛАТНЫХ МОДЕЛЕЙ');
    lines.push('═'.repeat(78));
    lines.push(`  Статус для сессии "${sessionId}": ${active ? '[ON] включён' : '[OFF] выключен'}`);
    lines.push('');
    lines.push('  Как работает:');
    lines.push('    • Оценивает объём контекста (сообщение + история) и сложность задачи');
    lines.push('    • Сложность: light (болтовня) / code / reasoning / longform');
    lines.push('    • Выбирает ЛУЧШУЮ БЕСПЛАТНУЮ модель под задачу (только free-квоты, $0)');
    lines.push('    • Учитывает лимиты провайдера (RPM/RPD) и CircuitBreaker-статус');
    lines.push('    • Модели с открытым breaker или тесным контекстным окном — исключаются');
    lines.push('');
    lines.push('  Команды:');
    lines.push('    /auto on          — включить авто-выбор для этой сессии');
    lines.push('    /auto off         — выключить (вернуться к дефолтной модели)');
    lines.push('    /auto test <текст> — показать, какую модель выберет движок и почему');
    lines.push('    /auto fleet       — пул моделей, из которых выбирает /auto');
    if (decision) {
      lines.push('');
      lines.push('  ПОСЛЕДНЕЕ РЕШЕНИЕ:');
      lines.push(`    • Модель    : ${decision.modelName} (${decision.modelId})`);
      lines.push(`    • Провайдер : ${decision.provider} | Score: ${decision.score}/100`);
      lines.push(`    • Сложность : ${decision.complexity} | Объём: ~${decision.estimatedTokens.toLocaleString()} tok / окно ${decision.contextWindow.toLocaleString()} tok`);
      lines.push(`    • Причина   : ${decision.reason}`);
    }
    lines.push('═'.repeat(78));
    return lines.join('\n');
  }

  /** Renders the candidate fleet table for /auto fleet. */
  public static formatFleet(): string {
    const lines: string[] = [];
    lines.push('');
    lines.push('═'.repeat(78));
    lines.push(`  AUTO-FLEET — ПУЛ БЕСПЛАТНЫХ МОДЕЛЕЙ (${AUTO_FLEET_IDS.length})`);
    lines.push('═'.repeat(78));
    for (const id of AUTO_FLEET_IDS) {
      const m = ModelRegistry.getModelById(id);
      if (!m) {
        lines.push(`  [MISSING] ${id} — нет в реестре!`);
        continue;
      }
      const r = ModelRatings.computeRating(m);
      lines.push(`  ${m.id.padEnd(44)} ctx:${String(m.contextWindow).padStart(8)}  Q${r.quality} S${r.speed} → ${m.pricing.freeTierDetails.substring(0, 40)}`);
    }
    lines.push('═'.repeat(78));
    return lines.join('\n');
  }
}
