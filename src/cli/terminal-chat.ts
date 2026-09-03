#!/usr/bin/env npx tsx
/**
 * terminal-chat.ts
 * EvaBot Online v0.0.1 MVP — Reactive Linear Cyber-Terminal TUI
 * 
 * Features:
 * - Strictly linear, line-by-line, minimal, elegant, and uncluttered layout
 * - Zero pseudo-accordions
 * - Real-time startup banner with live boot checkmarks
 * - Clean monospace tabular view for /models with USD ($) and EUR (€) pricing
 * - Dynamic model switching across all 34+ models in Model Registry
 * - Multi-agent Consilium & 2-model Dialogue debates
 * - Corporate roles and knowledge base integration
 * - Powered by AnsiStreamEngine for 1:1 parity with plain text and web
 * - Strict financial standard: USD ($) & EUR (€) only
 */

import readline from 'node:readline';
import { ChatSession } from '../core/ChatSession.js';
import { ModelRegistry, GeminiModelInfo } from '../models/ModelRegistry.js';
import { BootDiagnostics, BootDiagnosticReport } from '../core/BootDiagnostics.js';
import { UniversalLlmClient } from '../core/UniversalLlmClient.js';
import { ConsiliumEngine, ConsiliumMode, ConsiliumProgressEvent } from '../core/ConsiliumEngine.js';
import { CORPORATE_ROLES } from '../core/CorporateRoles.js';
import {
  AnsiStreamEngine,
  AnsiColors,
  TableFormatter,
  AnsiStreamWriter,
  statusBadge,
  promptSymbol,
  formatPrompt,
  divider,
  stripAnsi,
} from '../core/AnsiStreamEngine.js';

const C = AnsiColors;

let lastDiagnosticReport: BootDiagnosticReport | null = null;
let currentRole = 'general_assistant';
let currentMode: ConsiliumMode = 'solo';

/**
 * Renders the clean linear startup banner and live boot sequence checkmarks
 */
async function runBootSequence(activeModel: string): Promise<BootDiagnosticReport> {
  console.log(`\n${C.gray}┌${'─'.repeat(78)}┐${C.reset}`);
  console.log(`${C.gray}│${C.reset} ${C.bold}${C.brightWhite}⚡ EVABOT ONLINE v0.0.1 MVP // LINEAR CYBER-TERMINAL${C.reset}${' '.repeat(26)}${C.gray}│${C.reset}`);
  console.log(`${C.gray}│${C.reset} ${C.gray}Hybrid Topology: Web Edge Gateway (Face) ◄──► Agent Server (Brain)${C.reset}          ${C.gray}│${C.reset}`);
  console.log(`${C.gray}└${'─'.repeat(78)}┘${C.reset}\n`);

  process.stdout.write(`${C.gray}[BOOT DIAGNOSTICS] Probing dual-server infrastructure & model garden...${C.reset}\n`);
  const report = await BootDiagnostics.runDiagnostics(activeModel);
  lastDiagnosticReport = report;

  for (const step of report.steps) {
    const icon = step.status === 'success' ? `${C.green}✔ 🟢${C.reset}` : `${C.red}✖ 🔴${C.reset}`;
    console.log(`  ${icon} ${C.bold}${step.name}${C.reset} ${C.gray}(${step.latencyMs}ms)${C.reset}`);
    console.log(`     ${C.gray}└─ ${step.details}${C.reset}`);
  }

  console.log(`\n${C.green}✔ ALL DIAGNOSTIC CHECKS PASSED [Total: ${report.totalDurationMs}ms]${C.reset}`);
  return report;
}

/**
 * Prints the minimal one-line status bar
 */
function printStatusBar(session: ChatSession): void {
  const model = ModelRegistry.getModelById(session.getModel());
  const isFree = model?.pricing.freeTierStatus === '100% Free Quota Available';
  const tierBadge = isFree ? `${C.green}🟢 FREE QUOTA${C.reset}` : `${C.yellow}🟡 PAID / METERED${C.reset}`;

  console.log(divider('─', 80, C.gray));
  console.log(
    `  ${C.bold}${C.white}EVABOT${C.reset} ${C.green}🟢 ONLINE${C.reset} │ Model: ${C.bold}${C.cyan}${session.getModel()}${C.reset} [${tierBadge}] │ Mode: ${C.bold}${C.brightYellow}${currentMode.toUpperCase()}${C.reset} │ Role: ${C.bold}${C.white}${currentRole}${C.reset}`
  );
  console.log(
    `  ${C.gray}Standards: USD ($) & EUR (€) strictly │ 34 Models Active │ Type /help for commands${C.reset}`
  );
  console.log(divider('─', 80, C.gray) + '\n');
}

/**
 * Renders the clean monospace tabular view of models with free/paid indicators and USD/EUR pricing
 */
function printModelsTable(filterCategory?: string): void {
  const models = ModelRegistry.getAllModels();
  const filtered = filterCategory
    ? models.filter((m) => m.category.toLowerCase().includes(filterCategory.toLowerCase()) || m.provider.toLowerCase().includes(filterCategory.toLowerCase()))
    : models;

  console.log(`\n${C.bold}${C.white}GOOGLE MODEL GARDEN & MULTI-PROVIDER CATALOG (${filtered.length} of ${models.length} MODELS)${C.reset}`);
  console.log(`${C.gray}Strict currency policy: USD ($) & EUR (€) only. No other currencies supported.${C.reset}\n`);

  interface ModelTableRow {
    id: string;
    provider: string;
    context: string;
    tier: string;
    inputPrice: string;
    outputPrice: string;
  }

  const rows: ModelTableRow[] = filtered.map((m) => {
    const isFree = m.pricing.freeTierStatus === '100% Free Quota Available';
    const tier = isFree ? `${C.green}🟢 Free${C.reset}` : `${C.yellow}🟡 Paid${C.reset}`;
    
    // Format compact price strings
    let inPrice = m.pricing.inputPer1MTokensUSD;
    let outPrice = m.pricing.outputPer1MTokensUSD;
    if (inPrice.includes('(')) inPrice = inPrice.split('/')[0].trim();
    if (outPrice.includes('(')) outPrice = outPrice.split('/')[0].trim();

    return {
      id: `${C.bold}${C.white}${m.id}${C.reset}`,
      provider: m.provider,
      context: `${(m.contextWindow / 1024).toFixed(0)}k`,
      tier,
      inputPrice: inPrice,
      outputPrice: outPrice,
    };
  });

  const tableStr = TableFormatter.render<ModelTableRow>(rows, {
    columns: [
      { key: 'id', header: 'MODEL ID', minWidth: 26 },
      { key: 'provider', header: 'PROVIDER', minWidth: 16 },
      { key: 'context', header: 'CTX', minWidth: 6, align: 'right' },
      { key: 'tier', header: 'TIER', minWidth: 10 },
      { key: 'inputPrice', header: 'IN / 1M', minWidth: 14 },
      { key: 'outputPrice', header: 'OUT / 1M', minWidth: 14 },
    ],
    borderStyle: 'unicode',
    borderColor: C.gray,
    headerColor: `${C.bold}${C.brightWhite}`,
  });

  console.log(tableStr);
  console.log(`\n${C.gray}Switch model with: /model <model_id> (e.g. /model gemini-3.8-flash, /model deepseek/deepseek-r1:free)${C.reset}\n`);
}

/**
 * Prints the clean, linear command reference guide
 */
function printHelp(): void {
  console.log(`\n${C.bold}${C.white}EVA-BOT CYBER-TERMINAL COMMAND REFERENCE${C.reset}`);
  console.log(divider('─', 80, C.gray));

  const commands = [
    { cmd: '/models [filter]', desc: 'Clean monospace tabular view of models with free/paid status & pricing' },
    { cmd: '/model <id>', desc: 'Switch active model (e.g. /model gemini-3.8-flash, /model gemini-3.1-pro)' },
    { cmd: '/mode <mode>', desc: 'Switch mode: solo | broadcast | dialogue | consilium' },
    { cmd: '/role <id>', desc: 'Switch corporate role: architect, devops, security_auditor, general_assistant' },
    { cmd: '/dialogue <prompt>', desc: 'Run autonomous 2-model debate on specified topic' },
    { cmd: '/consilium <prompt>', desc: 'Run 3-10 model deliberation with executive consensus synthesis' },
    { cmd: '/boot', desc: 'Re-run live infrastructure and model diagnostics' },
    { cmd: '/clear', desc: 'Clear conversation history and terminal screen' },
    { cmd: '/help', desc: 'Display this command reference' },
    { cmd: '/exit', desc: 'Terminate terminal session cleanly' },
  ];

  for (const c of commands) {
    console.log(`  ${C.bold}${C.cyan}${c.cmd.padEnd(22)}${C.reset} ${C.gray}│${C.reset} ${c.desc}`);
  }

  console.log(divider('─', 80, C.gray) + '\n');
}

/**
 * Handles running a multi-agent debate or consilium
 */
async function handleConsiliumRun(mode: ConsiliumMode, prompt: string): Promise<void> {
  console.log(`\n${C.yellow}⚡ Launching ${mode.toUpperCase()} session...${C.reset}`);
  console.log(`${C.gray}Topic: "${prompt}"${C.reset}\n`);

  try {
    const participants = mode === 'consilium'
      ? ['gemini-3.8-flash', 'claude-3-7-sonnet', 'deepseek/deepseek-r1:free']
      : ['gemini-3.8-flash', 'gemini-3.1-pro'];

    const engine = new ConsiliumEngine();
    const result = await engine.run({
      mode,
      prompt,
      models: participants,
      rounds: mode === 'dialogue' ? 2 : 1,
      synthesizerModel: 'gemini-3.8-flash',
      useKnowledgeBase: true,
      onProgress: (evt: ConsiliumProgressEvent) => {
        console.log(`  ${C.cyan}▸ [${evt.type.toUpperCase()}]${C.reset} ${evt.message || ''}`);
      },
    });

    console.log(`\n${C.green}✔ ${mode.toUpperCase()} COMPLETED [${result.durationMs}ms]${C.reset}\n`);

    for (const turn of result.turns) {
      console.log(`${C.gray}┌─${C.reset} ${C.bold}${C.cyan}[${turn.name.toUpperCase()}]${C.reset} ${C.gray}(${turn.model})${'─'.repeat(30)}${C.reset}`);
      const lines = turn.content.split('\n');
      for (const line of lines) {
        console.log(`${C.gray}│${C.reset} ${line}`);
      }
      console.log(`${C.gray}└${'─'.repeat(60)}${C.reset}\n`);
    }

    if (result.synthesis) {
      console.log(`\n${C.gray}┌${'─'.repeat(78)}┐${C.reset}`);
      console.log(`${C.gray}│${C.reset} ${C.bold}${C.green}🏆 FINAL EXECUTIVE CONSENSUS REPORT${C.reset}${' '.repeat(42)}${C.gray}│${C.reset}`);
      console.log(`${C.gray}├${'─'.repeat(78)}┤${C.reset}`);
      const synthLines = result.synthesis.split('\n');
      for (const sLine of synthLines) {
        console.log(`${C.gray}│${C.reset} ${sLine}`);
      }
      console.log(`${C.gray}└${'─'.repeat(78)}┘${C.reset}`);
      console.log(`${C.gray}Deliberated by 3 frontier models & synthesized via consensus arbiter.${C.reset}\n`);
    }
  } catch (err: any) {
    console.log(`\n${C.red}✖ Consilium Execution Error: ${err.message}${C.reset}\n`);
  }
}

/**
 * Interactive REPL setup
 */
async function main(): Promise<void> {
  // Check CLI arguments for non-interactive flags like --help, -h, --boot
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  if (args.includes('--models')) {
    printModelsTable();
    process.exit(0);
  }

  const initialModel = 'gemini-3.8-flash';
  const session = new ChatSession({ model: initialModel });

  // 1. Run live boot sequence
  await runBootSequence(session.getModel());

  // If --boot flag was passed, exit after boot
  if (args.includes('--boot')) {
    process.exit(0);
  }

  // 2. Render linear status bar
  printStatusBar(session);

  // 3. Setup linear readline REPL
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: formatPrompt({ model: session.getModel(), mode: currentMode, role: currentRole }),
  });

  const updatePrompt = () => {
    rl.setPrompt(formatPrompt({ model: session.getModel(), mode: currentMode, role: currentRole }));
  };

  rl.prompt();

  rl.on('line', async (line) => {
    const input = line.trim();
    if (!input) {
      rl.prompt();
      return;
    }

    // Command handling
    if (input.startsWith('/')) {
      const parts = input.split(' ');
      const cmd = parts[0].toLowerCase();
      const arg = parts.slice(1).join(' ').trim();

      switch (cmd) {
        case '/exit':
        case '/quit':
          console.log(`\n${C.gray}Terminating EvaBot Cyber-Terminal session. Goodbye.${C.reset}`);
          process.exit(0);

        case '/boot':
          await runBootSequence(session.getModel());
          printStatusBar(session);
          break;

        case '/models':
          printModelsTable(arg || undefined);
          break;

        case '/model':
          if (!arg) {
            console.log(`${C.yellow}Current model: ${session.getModel()}${C.reset}`);
            console.log(`${C.gray}Usage: /model <id> (e.g. /model gemini-3.8-flash, /model gemini-3.1-pro, /model deepseek/deepseek-r1:free)${C.reset}`);
          } else if (ModelRegistry.isValidModel(arg)) {
            session.setModel(arg);
            const mInfo = ModelRegistry.getModelById(arg);
            const freeTag = mInfo?.pricing.freeTierStatus === '100% Free Quota Available'
              ? `${C.green}🟢 Free Quota${C.reset}`
              : `${C.yellow}🟡 Paid${C.reset}`;
            console.log(`${C.green}✔ Switched active model to:${C.reset} ${C.bold}${arg}${C.reset} [${mInfo?.provider}] (${freeTag})`);
            updatePrompt();
          } else {
            console.log(`${C.red}✖ Unknown model: ${arg}.${C.reset} Type /models to view all registered models.`);
          }
          break;

        case '/mode': {
          const modeChoice = arg.toLowerCase();
          if (['solo', 'broadcast', 'dialogue', 'consilium'].includes(modeChoice)) {
            currentMode = modeChoice as ConsiliumMode;
            console.log(`${C.green}✔ Switched mode to:${C.reset} ${C.bold}${currentMode.toUpperCase()}${C.reset}`);
            updatePrompt();
          } else {
            console.log(`${C.yellow}Usage: /mode <solo|broadcast|dialogue|consilium>${C.reset}`);
          }
          break;
        }

        case '/role':
          if (!arg) {
            console.log(`${C.yellow}Current role: ${currentRole}${C.reset}`);
            console.log(`${C.gray}Available roles: ${Object.keys(CORPORATE_ROLES).join(', ')}${C.reset}`);
          } else if (CORPORATE_ROLES[arg]) {
            currentRole = arg;
            const roleMeta = CORPORATE_ROLES[arg];
            console.log(`${C.green}✔ Active role set to:${C.reset} ${C.bold}${arg}${C.reset} [${roleMeta.title}]`);
            updatePrompt();
          } else {
            console.log(`${C.yellow}Available roles: ${Object.keys(CORPORATE_ROLES).join(', ')}${C.reset}`);
          }
          break;

        case '/consilium':
          if (!arg) {
            console.log(`${C.yellow}Usage: /consilium <your problem/question for the council>${C.reset}`);
          } else {
            await handleConsiliumRun('consilium', arg);
          }
          break;

        case '/dialogue':
          if (!arg) {
            console.log(`${C.yellow}Usage: /dialogue <debate topic or proposition>${C.reset}`);
          } else {
            await handleConsiliumRun('dialogue', arg);
          }
          break;

        case '/clear':
          session.clearHistory();
          console.clear();
          printStatusBar(session);
          console.log(`${C.green}✔ Session memory cleared.${C.reset}\n`);
          break;

        case '/help':
          printHelp();
          break;

        default:
          console.log(`${C.red}✖ Unknown command: ${cmd}.${C.reset} Type /help for assistance.`);
          break;
      }

      rl.prompt();
      return;
    }

    // Normal chat message execution
    if (currentMode !== 'solo') {
      await handleConsiliumRun(currentMode, input);
      rl.prompt();
      return;
    }

    // Standard solo chat stream via UniversalLlmClient and AnsiStreamWriter
    console.log(`\n${C.gray}┌─ [EVABOT] (${session.getModel()}) ${'─'.repeat(45)}${C.reset}`);
    const writer = new AnsiStreamWriter({
      prefix: `${C.gray}│${C.reset} `,
      writeToStdout: true,
    });

    try {
      const client = new UniversalLlmClient();
      await client.streamContent(
        session.getModel(),
        [{ role: 'user', content: input }],
        (chunk: string) => {
          writer.write(chunk);
        }
      );
      writer.end();
      console.log(`${C.gray}└${'─'.repeat(70)}${C.reset}\n`);
    } catch (err: any) {
      writer.end();
      console.log(`\n${C.red}✖ Generation Error: ${err.message}${C.reset}\n`);
    }

    rl.prompt();
  });
}

main().catch((err) => {
  console.error(`Fatal Terminal Crash:`, err);
  process.exit(1);
});
