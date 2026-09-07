import { LOCALE_POLICY } from './LocalePolicy.js';
import { logger } from './Logger.js';

export interface AgentRule {
  id: string;
  name: string;
  category: 'axiom' | 'locale' | 'security' | 'production' | 'currency' | 'ergonomics' | 'custom';
  priority: number; // 1 = highest, non-negotiable
  enforced: boolean;
  description: string;
  ruleText: string;
  source: 'system' | 'custom';
}

export const DEFAULT_RULES: AgentRule[] = [
  {
    id: 'axiom-locale',
    name: 'Ukraine Locale & Anti-Aggressor Policy',
    category: 'locale',
    priority: 1,
    enforced: true,
    source: 'system',
    description: 'System origin is Odesa, Ukraine (UA). Zero-tolerance for the aggressor state (RU), entities, rubles, and domains.',
    ruleText: LOCALE_POLICY.systemInstructionSuffix,
  },
  {
    id: 'axiom-currency',
    name: 'Currency Standards (USD / EUR / UAH)',
    category: 'currency',
    priority: 1,
    enforced: true,
    source: 'system',
    description: 'All compute costs, cloud OpEx, model rates, and wholesale quotes strictly in USD ($) or EUR (€) (and UAH ₴ for domestic Ukraine).',
    ruleText:
      'CURRENCY RULE: All financial models, token metrics, cloud expenditures, and wholesale pricing must be calculated and displayed strictly in USD ($) or EUR (€). Ukrainian Hryvnia (UAH / ₴) is permitted exclusively for local Ukrainian manufacturing quotes. Any references to rubles (RUB) or aggressor financial networks are strictly banned.',
  },
  {
    id: 'axiom-trinity',
    name: 'Holy Trinity Agent Architecture (God, Eva, Adam)',
    category: 'axiom',
    priority: 1,
    enforced: true,
    source: 'system',
    description: 'God governs Adam and Eva. Adam commands Backend, Production & Security. Eva commands Frontend, UX & Diplomacy.',
    ruleText:
      'TRINITY ARCHITECTURE: EvaLine operates under a strict three-pillar hierarchy:\n' +
      '1. God (Supreme Arbiter & Creator): Governs global axioms, arbitrates Consilium deadlocks, holds final veto.\n' +
      '2. Adam (Backend, Production & Defense): Responsible for Frankfurt core (evabot-agent-vm, 100.66.98.4), physical EVA polymer specs, microservices, databases, zero-trust security.\n' +
      '3. Eva (Frontend, UX & Diplomacy): Responsible for Iowa edge ingress (evaline-micro-vm), domains (evabot.online, evaline.network, evaline.com.ua), Cyber-Terminal UI, 6-language client relations, conversions.',
  },
  {
    id: 'rule-production',
    name: 'EvaLine Physical EVA Polymer Manufacturing Specs',
    category: 'production',
    priority: 2,
    enforced: true,
    source: 'system',
    description: 'Real-world physical EVA material parameters: Shore hardness 20-75A, density 75-250 kg/m³, thickness 2-50mm, puzzle mats, tatami, certifications.',
    ruleText:
      'EVA PRODUCTION STANDARDS: EvaLine is a premier manufacturer of Ethylene Vinyl Acetate (EVA) polymer products. ' +
      'Technical specifications must strictly reflect actual manufacturing parameters:\n' +
      '- Hardness Range: 20 to 75 Shore A (soft orthopedics ~25-35A, puzzle mats ~30-40A, tatami ~45-55A, car mats ~55-65A, industrial technical sheets up to 75A).\n' +
      '- Density Range: 75 to 250 kg/m³.\n' +
      '- Thickness Range: 2 mm to 50 mm (sheets and rolls).\n' +
      '- Standard Sheet Dimensions: 1000x2000 mm, 1200x2000 mm, custom puzzle tiles (500x500 mm, 1000x1000 mm).\n' +
      '- Textures: Smooth, Diamond (ромб), Honeycomb (сота), Rice grain (рис), Tatami waffle.\n' +
      '- Quality & Compliance: Hypoallergenic, non-toxic, closed-cell foam, moisture-resistant, certified under European safety (CE, REACH, ISO 9001).',
  },
  {
    id: 'rule-security',
    name: 'Enterprise Zero-Trust & Secret Isolation',
    category: 'security',
    priority: 2,
    enforced: true,
    source: 'system',
    description: 'Zero-Trust security paradigm: principle of least privilege, no credentials in logs, TLS 1.3, rate limiting.',
    ruleText:
      'SECURITY BASELINE: Enforce strict Zero-Trust protocols across all interactions. Never output, echo, or log private API keys, service tokens, password hashes, or internal server IPs in public responses. All external traffic must be verified and sanitized.',
  },
  {
    id: 'rule-ergonomics',
    name: 'Minimalist Cyber-Terminal & Typography (un-ui 16px Roboto)',
    category: 'ergonomics',
    priority: 3,
    enforced: true,
    source: 'system',
    description: 'Single-viewport, 16px Roboto font standard, zero border boxes, monochrome B&W + 3 signal colors (🟢/🟡/🔴).',
    ruleText:
      'INTERFACE ERGONOMICS: Output clean, readable GitHub-flavored Markdown. Use concise, structured lists and clean tables. Do not produce verbose filler. Maintain exact parity between terminal CLI and web interfaces.',
  },
];

export class RulesEngine {
  private static instance: RulesEngine;
  private rules: Map<string, AgentRule> = new Map();

  private constructor() {
    this.resetToDefaults();
  }

  public static getInstance(): RulesEngine {
    if (!RulesEngine.instance) {
      RulesEngine.instance = new RulesEngine();
    }
    return RulesEngine.instance;
  }

  public resetToDefaults(): void {
    this.rules.clear();
    for (const rule of DEFAULT_RULES) {
      this.rules.set(rule.id, { ...rule });
    }
    logger.info('RulesEngine', `Reset rules to ${this.rules.size} default rules`);
  }

  public getAllRules(): AgentRule[] {
    return Array.from(this.rules.values()).sort((a, b) => a.priority - b.priority);
  }

  public getActiveRules(): AgentRule[] {
    return this.getAllRules().filter((r) => r.enforced);
  }

  public getRule(id: string): AgentRule | undefined {
    return this.rules.get(id);
  }

  public addCustomRule(name: string, ruleText: string, category: AgentRule['category'] = 'custom'): AgentRule {
    const id = `custom-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const rule: AgentRule = {
      id,
      name: name.trim(),
      category,
      priority: 5,
      enforced: true,
      description: `Custom user-defined rule added at ${new Date().toISOString()}`,
      ruleText: ruleText.trim(),
      source: 'custom',
    };
    this.rules.set(id, rule);
    logger.info('RulesEngine', `Added custom rule: [${id}] ${name}`);
    return rule;
  }

  public removeCustomRule(id: string): boolean {
    const rule = this.rules.get(id);
    if (!rule) return false;
    if (rule.source === 'system') {
      logger.warn('RulesEngine', `Cannot delete built-in system rule: ${id}`);
      return false;
    }
    this.rules.delete(id);
    logger.info('RulesEngine', `Removed custom rule: ${id}`);
    return true;
  }

  public toggleRule(id: string, enforced?: boolean): boolean {
    const rule = this.rules.get(id);
    if (!rule) return false;
    if (rule.priority === 1) {
      logger.warn('RulesEngine', `Axiom rules with priority 1 cannot be disabled: ${id}`);
      return false;
    }
    rule.enforced = enforced !== undefined ? enforced : !rule.enforced;
    logger.info('RulesEngine', `Toggled rule ${id} -> enforced=${rule.enforced}`);
    return true;
  }

  /**
   * Compiles all active rules into a markdown-formatted instructions block
   */
  public compileRulesInstruction(): string {
    const activeRules = this.getActiveRules();
    if (activeRules.length === 0) return '';

    const lines: string[] = ['\n--- CORPORATE RULES & OPERATIONAL MANDATES ---'];
    for (const rule of activeRules) {
      lines.push(`[RULE ${rule.id.toUpperCase()}] (${rule.name}):\n${rule.ruleText}`);
    }
    lines.push('--- END CORPORATE RULES ---\n');
    return lines.join('\n\n');
  }

  /**
   * Formats active rules for terminal CLI or web chat display
   */
  public formatRulesDisplay(): string {
    const rules = this.getAllRules();
    const lines: string[] = [];
    lines.push('═══ EVALINE AGENT RULES & OPERATIONAL MANDATES ═══');
    lines.push(`Total Rules: ${rules.length} | Active: ${rules.filter((r) => r.enforced).length}\n`);

    for (const r of rules) {
      const status = r.enforced ? '[ENFORCED]' : '[DISABLED]';
      const prio = `P${r.priority}`;
      lines.push(`• [${prio}] ${r.id.padEnd(18)} ${status} ${r.name}`);
      lines.push(`  Category: ${r.category} | Source: ${r.source}`);
      lines.push(`  Description: ${r.description}`);
      lines.push(`  Rule: ${r.ruleText.substring(0, 160)}${r.ruleText.length > 160 ? '...' : ''}\n`);
    }

    lines.push('Commands:');
    lines.push('  /rule                 - Показать этот список правил');
    lines.push('  /rule add <название> | <текст правила> - Добавить кастомное правило');
    lines.push('  /rule reset           - Сбросить все правила к системным по умолчанию');
    return lines.join('\n');
  }
}

export const rulesEngine = RulesEngine.getInstance();
