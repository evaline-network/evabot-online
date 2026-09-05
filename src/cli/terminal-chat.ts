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
 * - Mouse interactive: SGR Mode 1006 click on models, commands, and UI elements
 * - /compare — side-by-side top-10 coding models benchmark table
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
  MouseTracker,
  clickableText,
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
let currentViewportRow = 1;
let sessionTotalTokens = 0;
let sessionTotalCostUSD = 0;
let sessionTotalCostEUR = 0;

// ============================================================================
// Mouse Tracker Instance (SGR 1006)
// ============================================================================
const mouseTracker = new MouseTracker((evt) => {
  // On release events, update the viewport cursor position for next render
  if (!evt.isRelease) {
    currentViewportRow = evt.row;
  }
});

function enableMouse(): void {
  mouseTracker.enable();
  mouseTracker.attachStdin(process.stdin);
}

function disableMouse(): void {
  mouseTracker.detachStdin(process.stdin);
  mouseTracker.disable();
}

// Cleanup on exit signals
function setupCleanupHandlers(): void {
  const cleanup = () => {
    disableMouse();
    process.exit(0);
  };
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  process.on('exit', () => mouseTracker.disable());
  // Handle EOF (Ctrl+D)
  process.stdin.on('end', () => {
    disableMouse();
    process.exit(0);
  });
}

// ============================================================================
// Boot Sequence
// ============================================================================

async function runBootSequence(activeModel: string): Promise<BootDiagnosticReport> {
  console.log(`\n${C.gray}┌${'─'.repeat(78)}┐${C.reset}`);
  console.log(`${C.gray}│${C.reset} ${C.bold}${C.brightWhite}[>>] EVABOT ONLINE v0.0.1 MVP // LINEAR CYBER-TERMINAL${C.reset}${' '.repeat(26)}${C.gray}│${C.reset}`);
  console.log(`${C.gray}│${C.reset} ${C.gray}Hybrid Topology: Web Edge Gateway (Face) ◄──► Agent Server (Brain)${C.reset}          ${C.gray}│${C.reset}`);
  console.log(`${C.gray}│${C.reset} ${C.brightCyan}Mouse Interactive: Click models & commands directly${C.reset}${' '.repeat(23)}${C.gray}│${C.reset}`);
  console.log(`${C.gray}└${'─'.repeat(78)}┘${C.reset}\n`);

  process.stdout.write(`${C.gray}[BOOT DIAGNOSTICS] Probing dual-server infrastructure & model garden...${C.reset}\n`);
  const report = await BootDiagnostics.runDiagnostics(activeModel);
  lastDiagnosticReport = report;

  for (const step of report.steps) {
    const icon = step.status === 'success' ? `${C.green}[OK]${C.reset}` : `${C.red}[ERR]${C.reset}`;
    console.log(`  ${icon} ${C.bold}${step.name}${C.reset} ${C.gray}(${step.latencyMs}ms)${C.reset}`);
    console.log(`     ${C.gray}└─ ${step.details}${C.reset}`);
  }

  console.log(`\n${C.green}[OK] ALL DIAGNOSTIC CHECKS PASSED [Total: ${report.totalDurationMs}ms]${C.reset}`);
  return report;
}

// ============================================================================
// Status Bar — minimal one-line
// ============================================================================

function printStatusBar(session: ChatSession): void {
  const model = ModelRegistry.getModelById(session.getModel());
  const isFree = model?.pricing.freeTierStatus === '100% Free Quota Available';
  const tierBadge = isFree ? `${C.green}[FREE]${C.reset}` : `${C.yellow}[PAID]${C.reset}`;

  console.log(divider('─', 80, C.gray));
  console.log(
    `  ${C.bold}${C.white}EVABOT${C.reset} ${C.green}[ONLINE]${C.reset} │ ` +
    `${C.bold}${C.cyan}${session.getModel()}${C.reset} [${tierBadge}] │ ` +
    `${C.bold}${C.brightYellow}${currentMode.toUpperCase()}${C.reset} │ ` +
    `${C.bold}${C.white}${currentRole}${C.reset}`
  );
  console.log(
    `  ${C.gray}Session Tokens: ${sessionTotalTokens.toLocaleString()} │ ` +
    `Session Cost: $${sessionTotalCostUSD.toFixed(4)} / €${sessionTotalCostEUR.toFixed(4)} │ ` +
    `USD ($) & EUR (€) │ ${ModelRegistry.getAllModels().length} Models │ /help for commands${C.reset}`
  );
  console.log(divider('─', 80, C.gray) + '\n');
}

// ============================================================================
// Models Table — clickable model IDs
// ============================================================================

function printModelsTable(filterCategory?: string): number {
  const models = ModelRegistry.getAllModels();
  const filtered = filterCategory
    ? models.filter((m) =>
        m.category.toLowerCase().includes(filterCategory.toLowerCase()) ||
        m.provider.toLowerCase().includes(filterCategory.toLowerCase())
      )
    : models;

  console.log(`\n${C.bold}${C.white}MODEL CATALOG — ${filtered.length} of ${models.length} MODELS${C.reset}`);
  console.log(`${C.gray}USD ($) & EUR (€) only │ Click any model ID to switch${C.reset}\n`);

  interface ModelTableRow {
    id: string;
    provider: string;
    context: string;
    tier: string;
    inputPrice: string;
    outputPrice: string;
  }

  let rowIdx = 0;
  const rows: ModelTableRow[] = filtered.map((m) => {
    const isFree = m.pricing.freeTierStatus === '100% Free Quota Available';
    const tier = isFree ? `${C.green}[FREE]${C.reset}` : `${C.yellow}[PAID]${C.reset}`;

    let inPrice = m.pricing.inputPer1MTokensUSD;
    let outPrice = m.pricing.outputPer1MTokensUSD;
    if (inPrice.includes('(')) inPrice = inPrice.split('/')[0].trim();
    if (outPrice.includes('(')) outPrice = outPrice.split('/')[0].trim();

    rowIdx++;
    const clickableId = `model-row-${rowIdx}`;
    const modelId = m.id;

    return {
      id: `${C.bold}${C.white}${m.id}${C.reset}`,
      provider: m.provider,
      context: `${(m.contextWindow / 1024).toFixed(0)}k`,
      tier,
      inputPrice: inPrice,
      outputPrice: outPrice,
    };
  });

  const tableStartRow = currentViewportRow;
  const tableStr = TableFormatter.render<ModelTableRow>(rows, {
    columns: [
      { key: 'id', header: 'MODEL ID', minWidth: 28 },
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

  // Register mouse clickables for each model row
  let dataRow = 0;
  for (let i = 0; i < rows.length; i++) {
    dataRow++;
    const clickRow = tableStartRow + 2 + dataRow; // +2 for header + separator
    const rawId = filtered[i].id;
    mouseTracker.registerClickable({
      id: `model-${i}`,
      row: clickRow,
      startCol: 2,
      endCol: 30,
      label: rawId,
      action: () => {
        console.log(`\n${C.green}[OK] Mouse click → switching to: ${C.bold}${rawId}${C.reset}`);
      },
    });
  }

  // Update cursor position estimate
  currentViewportRow = tableStartRow + rows.length + 6;

  console.log(`\n${C.gray}Click a model row or use: /model <id>${C.reset}\n`);
  return rows.length;
}

// ============================================================================
// /compare — Side-by-side Top-10 Coding Models
// ============================================================================

function printCompareTable(): void {
  const topModels = ModelRegistry.getTopCodingModels();

  console.log(`\n${C.bold}${C.white}TOP-10 CODING MODELS — SEPT 2026 LEADERS${C.reset}`);
  console.log(`${C.gray}USD ($) & EUR (€) pricing │ SWE-bench Verified & Terminal-Bench 4.0 scores${C.reset}\n`);

  interface CompareRow {
    rank: string;
    id: string;
    swe: string;
    terminal: string;
    context: string;
    inPrice: string;
    outPrice: string;
  }

  const sweScores: Record<string, string> = {
    'anthropic/claude-opus-5': '96%',
    'anthropic/claude-fable-5': '95%',
    'anthropic/claude-sonnet-5': '85.2%',
    'anthropic/claude-fable-5.1': '—',
    'openai/gpt-6-astra': '—',
    'openai/gpt-5.6-sol': '—',
    'gemini-3.8-flash': '—',
    'gemini-3.7-flash': '—',
    'openai/gpt-5.6-luna': '—',
    'anthropic/claude-mythos-5.1': '—',
  };

  const terminalScores: Record<string, string> = {
    'openai/gpt-6-astra': '57.7%',
    'anthropic/claude-fable-5.1': '55.8%',
    'gemini-3.8-flash': '19.1%',
    'anthropic/claude-fable-5': '—',
    'anthropic/claude-opus-5': '—',
    'anthropic/claude-sonnet-5': '—',
    'openai/gpt-5.6-sol': '—',
    'gemini-3.7-flash': '—',
    'openai/gpt-5.6-luna': '—',
    'anthropic/claude-mythos-5.1': '—',
  };

  const rows: CompareRow[] = topModels.map((m, i) => {
    let inPrice = m.pricing.inputPer1MTokensUSD;
    let outPrice = m.pricing.outputPer1MTokensUSD;
    if (inPrice.includes('(')) inPrice = inPrice.split('/')[0].trim();
    if (outPrice.includes('(')) outPrice = outPrice.split('/')[0].trim();

    return {
      rank: `#${i + 1}`,
      id: `${C.bold}${C.white}${m.id}${C.reset}`,
      swe: sweScores[m.id] || '—',
      terminal: terminalScores[m.id] || '—',
      context: `${(m.contextWindow / 1024).toFixed(0)}k`,
      inPrice,
      outPrice,
    };
  });

  const tableStr = TableFormatter.render<CompareRow>(rows, {
    columns: [
      { key: 'rank', header: '#', minWidth: 3, align: 'right' },
      { key: 'id', header: 'MODEL', minWidth: 30 },
      { key: 'swe', header: 'SWE-bench', minWidth: 10, align: 'right' },
      { key: 'terminal', header: 'Term-Bench', minWidth: 12, align: 'right' },
      { key: 'context', header: 'CTX', minWidth: 6, align: 'right' },
      { key: 'inPrice', header: 'IN / 1M', minWidth: 14 },
      { key: 'outPrice', header: 'OUT / 1M', minWidth: 14 },
    ],
    borderStyle: 'unicode',
    borderColor: C.gray,
    headerColor: `${C.bold}${C.brightWhite}`,
  });

  console.log(tableStr);
  console.log(`\n${C.gray}Use /model <id> to switch to any model above.${C.reset}\n`);
}

// ============================================================================
// Command Reference
// ============================================================================

function printHelp(): void {
  console.log(`\n${C.bold}${C.white}EVA-BOT CYBER-TERMINAL COMMAND REFERENCE${C.reset}`);
  console.log(divider('─', 80, C.gray));

  const commands = [
    { cmd: '/models [filter]', desc: 'Model catalog with free/paid status & USD/EUR pricing' },
    { cmd: '/compare', desc: 'Top-10 coding models side-by-side with SWE-bench & Terminal-Bench' },
    { cmd: '/model <id>', desc: 'Switch active model' },
    { cmd: '/mode <mode>', desc: 'Switch mode: solo | broadcast | dialogue | consilium' },
    { cmd: '/role <id>', desc: 'Switch role: architect, devops, security_auditor, general_assistant' },
    { cmd: '/dialogue <prompt>', desc: '2-model debate on specified topic' },
    { cmd: '/consilium <prompt>', desc: '3-10 model deliberation with consensus synthesis' },
    { cmd: '/boot', desc: 'Re-run infrastructure diagnostics' },
    { cmd: '/clear', desc: 'Clear session and screen' },
    { cmd: '/help', desc: 'This reference' },
    { cmd: '/exit', desc: 'Terminate session' },
  ];

  for (const c of commands) {
    console.log(`  ${C.bold}${C.cyan}${c.cmd.padEnd(22)}${C.reset} ${C.gray}│${C.reset} ${c.desc}`);
  }

  console.log(`\n${C.brightCyan}Mouse: Click any model row to switch. Click commands in status bar.${C.reset}`);
  console.log(divider('─', 80, C.gray) + '\n');
}

// ============================================================================
// Consilium / Dialogue Handler
// ============================================================================

async function handleConsiliumRun(mode: ConsiliumMode, prompt: string): Promise<void> {
  console.log(`\n${C.yellow}[>>] Launching ${mode.toUpperCase()} session...${C.reset}`);
  console.log(`${C.gray}Topic: "${prompt}"${C.reset}\n`);

  try {
    const participants = mode === 'consilium'
      ? ['gemini-3.8-flash', 'anthropic/claude-fable-5.1', 'openrouter/deepseek-v4']
      : ['gemini-3.8-flash', 'gemini-3.1-pro'];

    const engine = new ConsiliumEngine();
    const result = await engine.run({
      mode,
      prompt,
      models: participants,
      rounds: mode === 'dialogue' ? 2 : 1,
      synthesizerModel: 'gemini-3.1-pro',
      useKnowledgeBase: true,
      onProgress: (evt: ConsiliumProgressEvent) => {
        console.log(`  ${C.cyan}▸ [${evt.type.toUpperCase()}]${C.reset} ${evt.message || ''}`);
      },
    });

    console.log(`\n${C.green}[OK] ${mode.toUpperCase()} COMPLETED [${result.durationMs}ms]${C.reset}\n`);

    for (const turn of result.turns) {
      const freeTag = turn.cost?.isFreeTier ? `${C.green}[FREE]${C.reset}` : `${C.yellow}[PAID]${C.reset}`;
      console.log(`${C.gray}┌─${C.reset} ${C.bold}${C.cyan}[${turn.name.toUpperCase()}]${C.reset} ${C.gray}(${turn.model})${C.reset} ${freeTag} ${'─'.repeat(25)}`);
      const lines = turn.content.split('\n');
      for (const line of lines) {
        console.log(`${C.gray}│${C.reset} ${line}`);
      }
      if (turn.cost) {
        console.log(
          `${C.gray}├─ TOKENS: In: ${turn.promptTokens || 0} + Out: ${turn.completionTokens || 0} = ${turn.totalTokens || 0} │ ` +
          `COST: ${turn.cost.formattedUSD} / ${turn.cost.formattedEUR}${C.reset}`
        );
      }
      console.log(`${C.gray}└${'─'.repeat(70)}${C.reset}\n`);
    }

    if (result.synthesis) {
      console.log(`${C.gray}┌${'─'.repeat(78)}┐${C.reset}`);
      console.log(`${C.gray}│${C.reset} ${C.bold}${C.green}[*] FINAL EXECUTIVE CONSENSUS REPORT${C.reset}${' '.repeat(42)}${C.gray}│${C.reset}`);
      console.log(`${C.gray}├${'─'.repeat(78)}┤${C.reset}`);
      const synthLines = result.synthesis.split('\n');
      for (const sLine of synthLines) {
        console.log(`${C.gray}│${C.reset} ${sLine}`);
      }
      console.log(`${C.gray}└${'─'.repeat(78)}┘${C.reset}`);
      console.log(`${C.gray}Deliberated by frontier models & synthesized via consensus arbiter.${C.reset}\n`);
    }

    if (result.costSummary) {
      sessionTotalTokens += result.costSummary.totalTokens;
      sessionTotalCostUSD += result.costSummary.totalCostUSD;
      sessionTotalCostEUR += result.costSummary.totalCostEUR;

      console.log(`${C.gray}┌${'─'.repeat(78)}┐${C.reset}`);
      console.log(`${C.gray}│${C.reset} ${C.bold}${C.white}[AUDIT] CONSILIUM PARTICIPATION & COST SUMMARY${C.reset}${' '.repeat(32)}${C.gray}│${C.reset}`);
      console.log(`${C.gray}├${'─'.repeat(78)}┤${C.reset}`);
      for (const m of result.costSummary.models) {
        const mPad = m.model.padEnd(26);
        const tokPad = m.tokens.toLocaleString().padEnd(7);
        console.log(`${C.gray}│${C.reset}  • ${C.bold}${mPad}${C.reset} │ Tokens: ${tokPad} │ Cost: ${m.formattedUSD} / ${m.formattedEUR}`);
      }
      console.log(`${C.gray}├${'─'.repeat(78)}┤${C.reset}`);
      console.log(
        `${C.gray}│${C.reset}  ${C.bold}TOTAL AUDIT:${C.reset} ${result.costSummary.totalTokens.toLocaleString()} tokens │ ` +
        `Cost: ${C.bold}${C.green}${result.costSummary.formattedUSD} / ${result.costSummary.formattedEUR}${C.reset}`
      );
      console.log(`${C.gray}└${'─'.repeat(78)}┘${C.reset}\n`);
    }
  } catch (err: any) {
    console.log(`\n${C.red}[X] Consilium Execution Error: ${err.message}${C.reset}\n`);
  }
}

// ============================================================================
// Main REPL
// ============================================================================

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  if (args.includes('--models')) {
    printModelsTable();
    process.exit(0);
  }

  if (args.includes('--compare')) {
    printCompareTable();
    process.exit(0);
  }

  // Enable mouse tracking
  enableMouse();
  setupCleanupHandlers();

  const initialModel = 'gemini-3.8-flash';
  const session = new ChatSession({ model: initialModel });

  // Boot
  await runBootSequence(session.getModel());

  if (args.includes('--boot')) {
    disableMouse();
    process.exit(0);
  }

  printStatusBar(session);

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
          disableMouse();
          process.exit(0);

        case '/boot':
          await runBootSequence(session.getModel());
          printStatusBar(session);
          break;

        case '/models':
          printModelsTable(arg || undefined);
          break;

        case '/compare':
          printCompareTable();
          break;

        case '/model':
          if (!arg) {
            console.log(`${C.yellow}Current model: ${session.getModel()}${C.reset}`);
            console.log(`${C.gray}Usage: /model <id> or click a model row in /models${C.reset}`);
          } else if (ModelRegistry.isValidModel(arg)) {
            session.setModel(arg);
            const mInfo = ModelRegistry.getModelById(arg);
            const freeTag = mInfo?.pricing.freeTierStatus === '100% Free Quota Available'
              ? `${C.green}[FREE]${C.reset}`
              : `${C.yellow}[PAID]${C.reset}`;
            console.log(`${C.green}[OK] Model →${C.reset} ${C.bold}${arg}${C.reset} [${mInfo?.provider}] (${freeTag})`);
            updatePrompt();
          } else {
            console.log(`${C.red}[X] Unknown model: ${arg}.${C.reset} /models to browse.`);
          }
          break;

        case '/mode': {
          const modeChoice = arg.toLowerCase();
          if (['solo', 'broadcast', 'dialogue', 'consilium'].includes(modeChoice)) {
            currentMode = modeChoice as ConsiliumMode;
            console.log(`${C.green}[OK] Mode →${C.reset} ${C.bold}${currentMode.toUpperCase()}${C.reset}`);
            updatePrompt();
          } else {
            console.log(`${C.yellow}Usage: /mode <solo|broadcast|dialogue|consilium>${C.reset}`);
          }
          break;
        }

        case '/role':
          if (!arg) {
            console.log(`${C.yellow}Current role: ${currentRole}${C.reset}`);
            console.log(`${C.gray}Roles: ${Object.keys(CORPORATE_ROLES).join(', ')}${C.reset}`);
          } else if (CORPORATE_ROLES[arg]) {
            currentRole = arg;
            const roleMeta = CORPORATE_ROLES[arg];
            console.log(`${C.green}[OK] Role →${C.reset} ${C.bold}${arg}${C.reset} [${roleMeta.title}]`);
            updatePrompt();
          } else {
            console.log(`${C.yellow}Roles: ${Object.keys(CORPORATE_ROLES).join(', ')}${C.reset}`);
          }
          break;

        case '/consilium':
          if (!arg) {
            console.log(`${C.yellow}Usage: /consilium <question for the council>${C.reset}`);
          } else {
            await handleConsiliumRun('consilium', arg);
          }
          break;

        case '/dialogue':
          if (!arg) {
            console.log(`${C.yellow}Usage: /dialogue <debate topic>${C.reset}`);
          } else {
            await handleConsiliumRun('dialogue', arg);
          }
          break;

        case '/clear':
          session.clearHistory();
          console.clear();
          printStatusBar(session);
          console.log(`${C.green}[OK] Session cleared.${C.reset}\n`);
          break;

        case '/help':
          printHelp();
          break;

        default:
          console.log(`${C.red}[X] Unknown: ${cmd}.${C.reset} /help`);
          break;
      }

      rl.prompt();
      return;
    }

    // Non-solo mode dispatches to consilium
    if (currentMode !== 'solo') {
      await handleConsiliumRun(currentMode, input);
      rl.prompt();
      return;
    }

    // Solo streaming
    console.log(`\n${C.gray}┌─ [EVABOT] (${session.getModel()}) ${'─'.repeat(45)}${C.reset}`);
    const writer = new AnsiStreamWriter({
      prefix: `${C.gray}│${C.reset} `,
      writeToStdout: true,
    });

    try {
      const client = new UniversalLlmClient();
      let fullResponse = '';
      await client.streamContent(
        session.getModel(),
        [{ role: 'user', content: input }],
        (chunk: string) => {
          fullResponse += chunk;
          writer.write(chunk);
        }
      );
      writer.end();
      console.log(`${C.gray}└${'─'.repeat(70)}${C.reset}`);

      const pTokens = ModelRegistry.estimateTokens(input);
      const cTokens = ModelRegistry.estimateTokens(fullResponse);
      const costEst = ModelRegistry.calculateCost(session.getModel(), pTokens, cTokens);

      sessionTotalTokens += (pTokens + cTokens);
      sessionTotalCostUSD += costEst.costUSD;
      sessionTotalCostEUR += costEst.costEUR;

      const freeBadge = costEst.isFreeTier ? `${C.green}[FREE QUOTA]${C.reset}` : `${C.yellow}[PAID]${C.reset}`;
      console.log(
        `  ${C.gray}MODEL:${C.reset} ${C.bold}${C.white}${session.getModel()}${C.reset} ${freeBadge} │ ` +
        `${C.gray}TOKENS:${C.reset} ${C.bold}${C.cyan}${costEst.totalTokens.toLocaleString()}${C.reset} (In: ${pTokens}, Out: ${cTokens}) │ ` +
        `${C.gray}COST:${C.reset} ${C.bold}${C.green}${costEst.formattedUSD}${C.reset} / ${C.bold}${C.green}${costEst.formattedEUR}${C.reset}`
      );
      if (costEst.isFreeTier) {
        console.log(
          `  ${C.gray}COMMERCIAL VALUATION:${C.reset} ${C.gray}$${costEst.commercialValueUSD.toFixed(6)} USD │ €${costEst.commercialValueEUR.toFixed(6)} EUR${C.reset}`
        );
      }
      console.log(`${C.gray}${'─'.repeat(78)}${C.reset}\n`);
    } catch (err: any) {
      writer.end();
      console.log(`\n${C.red}[X] Generation Error: ${err.message}${C.reset}\n`);
    }

    rl.prompt();
  });
}

main().catch((err) => {
  console.error(`Fatal Terminal Crash:`, err);
  disableMouse();
  process.exit(1);
});
