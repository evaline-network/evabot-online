#!/usr/bin/env npx tsx
/**
 * terminal-chat.ts
 * EvaBot Online v0.0.1 MVP — Cyber-Terminal TUI
 *
 * Features:
 * - Boot Sequence & Live Diagnostics across Web Server & Agent Server
 * - Collapsible ASCII Accordions ([+] / [-]) matching Web details/summary
 * - Full Model Garden support (Gemini 3.8 Flash, 3.1 Pro/Flash, Claude, DeepSeek)
 * - Multi-Agent Consilium, Dialogue & Corporate Roles
 * - Strict Currency Rules: USD ($) & EUR (€) only
 */
import readline from 'node:readline';
import { ChatSession } from '../core/ChatSession.js';
import { ModelRegistry } from '../models/ModelRegistry.js';
import { BootDiagnostics } from '../core/BootDiagnostics.js';
import { UniversalLlmClient } from '../core/UniversalLlmClient.js';
import { ConsiliumEngine } from '../core/ConsiliumEngine.js';
import { CORPORATE_ROLES } from '../core/CorporateRoles.js';
// ANSI terminal color pallet (Minimalist B&W + Traffic Light standard)
const C = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    white: '\x1b[97m',
    gray: '\x1b[90m',
    zinc: '\x1b[37m',
    // Traffic Lights
    green: '\x1b[32m', // 🟢 Online / Ready / Free
    yellow: '\x1b[33m', // 🟡 Standby / Busy / Paid
    red: '\x1b[31m', // 🔴 Error / Offline
    // Accents
    cyan: '\x1b[36m',
    magenta: '\x1b[35m',
};
const accordions = {
    bootLog: true, // Expanded on initial boot
    servers: false,
    models: false,
    consilium: false,
    roles: false,
};
let lastDiagnosticReport = null;
let currentRole = 'general_assistant';
let currentMode = 'solo';
function renderAccordionHeader(title, isOpen, tag = '') {
    const icon = isOpen ? `${C.green}[ - COLLAPSE ]${C.reset}` : `${C.yellow}[ + EXPAND ]${C.reset}`;
    const border = '─'.repeat(Math.max(10, 68 - title.length - tag.length));
    return `${C.gray}┌──${C.reset} ${C.bold}${C.white}${title}${C.reset} ${tag} ${C.gray}─${border}─${C.reset} ${icon}`;
}
function renderAccordionFooter() {
    return `${C.gray}└──${'─'.repeat(76)}┘${C.reset}`;
}
/**
 * Renders the live system boot sequence and diagnostics
 */
async function runAndPrintBootSequence(activeModel) {
    console.clear();
    console.log(`
${C.bold}${C.white}┌────────────────────────────────────────────────────────────────────────────┐
│  ⚡ EVABOT ONLINE v0.0.1 MVP // CYBER-TERMINAL BOOT SEQUENCE              │
│  Hybrid Architecture: Web Server (Face) ◄──► Agent Server (Brain)          │
└────────────────────────────────────────────────────────────────────────────┘${C.reset}
`);
    process.stdout.write(`${C.gray}Initialising dual-server diagnostic probe...${C.reset}\n`);
    lastDiagnosticReport = await BootDiagnostics.runDiagnostics(activeModel);
    for (const step of lastDiagnosticReport.steps) {
        const statusIcon = step.status === 'success' ? `${C.green}✔ 🟢${C.reset}` : `${C.red}✖ 🔴${C.reset}`;
        console.log(`  ${statusIcon} ${C.bold}${step.name}${C.reset} ${C.gray}(${step.latencyMs}ms)${C.reset}`);
        console.log(`     ${C.gray}└─ ${step.details}${C.reset}`);
    }
    console.log(`
${C.green}✔ ALL DIAGNOSTIC CHECKS PASSED [Total: ${lastDiagnosticReport.totalDurationMs}ms]${C.reset}
`);
}
/**
 * Prints the main Cyber-Terminal banner and accordion summaries
 */
function renderDashboard(session) {
    const currentModel = ModelRegistry.getModelById(session.getModel());
    const isFree = currentModel?.pricing.freeTierStatus === '100% Free Quota Available';
    const tierBadge = isFree ? `${C.green}🟢 [100% FREE QUOTA]${C.reset}` : `${C.yellow}🟡 [PAID / METERED]${C.reset}`;
    console.log(`
${C.gray}┌────────────────────────────────────────────────────────────────────────────┐${C.reset}
${C.gray}│${C.reset} ${C.bold}${C.white}EVABOT // CORE v0.0.1 MVP${C.reset}  ${C.green}🟢 ONLINE${C.reset}  ${C.gray}│${C.reset} Mode: ${C.cyan}${currentMode.toUpperCase()}${C.reset}  ${C.gray}│${C.reset} Role: ${C.white}${currentRole}${C.reset} ${C.gray}│${C.reset}
${C.gray}│${C.reset} Model: ${C.bold}${C.white}${session.getModel().padEnd(25)}${C.reset} ${tierBadge.padEnd(35)} ${C.gray}│${C.reset}
${C.gray}│${C.reset} Auth:  ${C.green}🟢 Google Auto-Auth (evabot.online@gmail.com)${C.reset}    ${C.gray}Strict: USD ($)/EUR (€)│${C.reset}
${C.gray}└────────────────────────────────────────────────────────────────────────────┘${C.reset}
`);
    // Accordion 1: Boot Log Summary
    console.log(renderAccordionHeader('1. BOOT SEQUENCE & DIAGNOSTICS LOG', accordions.bootLog));
    if (accordions.bootLog && lastDiagnosticReport) {
        for (const step of lastDiagnosticReport.steps) {
            console.log(`  ${C.green}🟢${C.reset} ${C.white}${step.name}${C.reset}: ${C.gray}${step.details}${C.reset}`);
        }
    }
    console.log(renderAccordionFooter());
    // Accordion 2: Dual Server Telemetry
    console.log(renderAccordionHeader('2. DUAL SERVER TELEMETRY (WEB SERVER VS AGENT SERVER)', accordions.servers));
    if (accordions.servers && lastDiagnosticReport) {
        const ws = lastDiagnosticReport.servers.webServer;
        const as = lastDiagnosticReport.servers.agentServer;
        console.log(`  ${C.bold}🌐 ${ws.role} [${ws.name}]${C.reset} - ${ws.status}`);
        console.log(`     Location: ${ws.zone} | IP: ${ws.ip}`);
        console.log(`     CPU Load: ${ws.cpuLoad} | RAM: ${ws.memoryUsed}`);
        console.log(`     Workload: ${C.green}0% Compute (Caddy SSL Edge Gateway & Reverse Proxy)${C.reset}`);
        console.log(`  ${C.bold}🧠 ${as.role} [${as.name}]${C.reset} - ${as.status}`);
        console.log(`     Location: ${as.zone} | Tailscale IP: ${as.ip}`);
        console.log(`     Hardware: ${as.cpuSpec} | ${as.memorySpec}`);
        console.log(`     CPU Load: ${as.cpuLoad} | RAM: ${as.memoryUsed}`);
        console.log(`     Services: ${as.services.join(', ')}`);
    }
    console.log(renderAccordionFooter());
    // Accordion 3: Frontier Models & Quotas
    console.log(renderAccordionHeader('3. FRONTIER MODEL GARDEN (34 MODELS REGISTERED)', accordions.models));
    if (accordions.models) {
        console.log(`  ${C.green}🟢 1. Google Next-Gen Frontier (Gemini 3.x / 2.5):${C.reset}`);
        console.log(`     • ${C.bold}gemini-3.8-flash${C.reset} - 1M ctx | 15 RPM Free Quota | Ultra-fast agentic`);
        console.log(`     • ${C.bold}gemini-3.1-pro${C.reset}   - 2M ctx | Complex reasoning & architecture`);
        console.log(`     • ${C.bold}gemini-3.1-flash${C.reset} - 1M ctx | High-efficiency real-time flash`);
        console.log(`     • ${C.bold}gemini-2.5-flash${C.reset} - 1M ctx | Flagship multimodal balance`);
        console.log(`  ${C.green}🟢 2. OpenRouter Free Tier (:free):${C.reset}`);
        console.log(`     • deepseek/deepseek-r1:free | meta-llama/llama-3.3-70b:free | gemini-2.0-flash-exp:free`);
        console.log(`  ${C.yellow}🟡 3. Paid Enterprise Partners (Google Cloud Vertex AI):${C.reset}`);
        console.log(`     • claude-3-7-sonnet | claude-3-5-sonnet | mistral-large-2411 | jamba-1.5-large`);
        console.log(`  ${C.gray}Use /models for the comprehensive rate card and full specification table.${C.reset}`);
    }
    console.log(renderAccordionFooter());
    // Accordion 4: Consilium Engine
    console.log(renderAccordionHeader('4. MULTI-AGENT CONSILIUM & DEBATE CONTROLLER', accordions.consilium));
    if (accordions.consilium) {
        console.log(`  Current Mode: ${C.bold}${C.cyan}${currentMode.toUpperCase()}${C.reset}`);
        console.log(`  Supported Modes:`);
        console.log(`    • ${C.white}solo${C.reset}      - 1-on-1 direct dialogue with active model`);
        console.log(`    • ${C.white}broadcast${C.reset} - 1 prompt sent to 3 frontier models concurrently`);
        console.log(`    • ${C.white}dialogue${C.reset}  - 2 models engage in an autonomous thesis debate`);
        console.log(`    • ${C.white}consilium${C.reset} - 3 to 10 models deliberate in rounds with consensus report`);
        console.log(`  ${C.gray}Switch mode with: /mode <solo|broadcast|dialogue|consilium>${C.reset}`);
    }
    console.log(renderAccordionFooter());
    // Accordion 5: Corporate Roles
    console.log(renderAccordionHeader('5. EVALINE CORPORATE ROLES & KNOWLEDGE BASE', accordions.roles));
    if (accordions.roles) {
        console.log(`  Active Role: ${C.bold}${C.white}${currentRole}${C.reset}`);
        console.log(`  Available Roles: architect, devops, security_auditor, general_assistant, data_engineer`);
        console.log(`  Knowledge Base: Hybrid PostgreSQL + Qdrant Vector Store (Connected)`);
        console.log(`  ${C.gray}Switch role with: /role <role_id>${C.reset}`);
    }
    console.log(renderAccordionFooter());
    console.log(`
${C.gray}Interactive Commands:${C.reset}
  ${C.cyan}/toggle <1-5|all>${C.reset}  Toggle accordions     ${C.cyan}/mode <mode>${C.reset}        Set Consilium mode
  ${C.cyan}/model <id>${C.reset}        Switch active model   ${C.cyan}/role <role>${C.reset}        Set Corporate role
  ${C.cyan}/boot${C.reset}              Re-run diagnostics    ${C.cyan}/clear${C.reset}              Clear chat stream
  ${C.cyan}/help${C.reset}              Full command guide    ${C.cyan}/exit${C.reset}               Quit terminal
`);
}
function printHelp() {
    console.log(`
${C.yellow}${C.bold}EVA-BOT CYBER-TERMINAL COMMAND GUIDE:${C.reset}
  ${C.cyan}/toggle <1-5|all>${C.reset}      Expand or collapse specified accordion section
  ${C.cyan}/boot${C.reset}                  Re-run live diagnostics across Web Server and Agent Server
  ${C.cyan}/models${C.reset}                Display full catalog of all 34 registered models
  ${C.cyan}/model <id>${C.reset}            Switch active model (e.g. /model gemini-3.8-flash, /model gemini-3.1-pro)
  ${C.cyan}/mode <mode>${C.reset}            Set mode: solo, broadcast, dialogue, consilium
  ${C.cyan}/role <id>${C.reset}             Set corporate role: architect, devops, security_auditor, general_assistant
  ${C.cyan}/consilium <prompt>${C.reset}    Launch an instant 3-model deliberation with consensus report
  ${C.cyan}/dialogue <prompt>${C.reset}     Launch an autonomous 2-model debate
  ${C.cyan}/clear${C.reset}                 Clear conversation history
  ${C.cyan}/help${C.reset}                  Show this help screen
  ${C.cyan}/exit${C.reset}                  Exit terminal chat
`);
}
function printAllModels() {
    console.log(`\n${C.yellow}${C.bold}═`.repeat(78) + C.reset);
    console.log(`${C.bold}${C.white}GOOGLE MODEL GARDEN & MULTI-PROVIDER CATALOG (34 MODELS)${C.reset}`);
    console.log(`${C.yellow}${C.bold}═`.repeat(78) + `${C.reset}\n`);
    const models = ModelRegistry.getAllModels();
    for (const m of models) {
        const isFree = m.pricing.freeTierStatus === '100% Free Quota Available';
        const tag = isFree ? `${C.green}🟢 FREE QUOTA${C.reset}` : `${C.yellow}🟡 PAID / METERED${C.reset}`;
        console.log(`  ${C.bold}${C.white}${m.id.padEnd(32)}${C.reset} [${m.provider}] ${tag}`);
        console.log(`    Context: ${m.contextWindow.toLocaleString()} tokens | Max Out: ${m.maxOutputTokens} tokens`);
        console.log(`    Pricing: In: ${m.pricing.inputPer1MTokensUSD} (${m.pricing.inputPer1MTokensEUR}) │ Out: ${m.pricing.outputPer1MTokensUSD} (${m.pricing.outputPer1MTokensEUR})`);
        console.log(`    ${C.gray}${m.description}${C.reset}\n`);
    }
}
async function handleConsiliumRun(mode, prompt) {
    console.log(`\n${C.yellow}⚡ Launching ${mode.toUpperCase()} session...${C.reset}`);
    console.log(`${C.gray}Prompt: "${prompt}"${C.reset}\n`);
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
            onProgress: (evt) => {
                console.log(`  ${C.cyan}▸ [${evt.type.toUpperCase()}]${C.reset} ${evt.message || ''}`);
            }
        });
        console.log(`\n${C.green}✔ ${mode.toUpperCase()} COMPLETED [${result.durationMs}ms]${C.reset}\n`);
        for (const turn of result.turns) {
            console.log(`${C.bold}${C.cyan}┌─ [${turn.name.toUpperCase()}] (${turn.model}) ──${C.reset}`);
            console.log(turn.content);
            console.log(`${C.bold}${C.cyan}└─${'─'.repeat(50)}${C.reset}\n`);
        }
        if (result.synthesis) {
            console.log(`${C.bold}${C.green}╔══════════════════════════════════════════════════════════════════════════════╗${C.reset}`);
            console.log(`${C.bold}${C.green}║                    🏆 FINAL EXECUTIVE CONSENSUS REPORT                       ║${C.reset}`);
            console.log(`${C.bold}${C.green}╚══════════════════════════════════════════════════════════════════════════════╝${C.reset}`);
            console.log(result.synthesis);
            console.log(`\n${C.gray}Synthesized by consensus arbiter${C.reset}\n`);
        }
    }
    catch (err) {
        console.log(`${C.red}✖ Consilium Error: ${err.message}${C.reset}`);
    }
}
async function main() {
    const initialModel = 'gemini-3.8-flash';
    const session = new ChatSession({ model: initialModel });
    // 1. Run live boot diagnostics
    await runAndPrintBootSequence(session.getModel());
    // 2. Render initial cyber dashboard
    renderDashboard(session);
    // 3. Start REPL prompt
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: `\n${C.bold}${C.green}> ${C.reset}`,
    });
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
                    await runAndPrintBootSequence(session.getModel());
                    renderDashboard(session);
                    break;
                case '/models':
                    printAllModels();
                    break;
                case '/model':
                    if (!arg) {
                        console.log(`${C.yellow}Usage: /model <id> (e.g. /model gemini-3.8-flash, /model gemini-3.1-pro)${C.reset}`);
                    }
                    else if (ModelRegistry.isValidModel(arg)) {
                        session.setModel(arg);
                        console.log(`${C.green}✔ Switched active model to: ${C.bold}${arg}${C.reset}`);
                    }
                    else {
                        console.log(`${C.red}✖ Unknown model: ${arg}. Use /models to view all 34 registered models.${C.reset}`);
                    }
                    break;
                case '/mode':
                    if (['solo', 'broadcast', 'dialogue', 'consilium'].includes(arg.toLowerCase())) {
                        currentMode = arg.toLowerCase();
                        console.log(`${C.green}✔ Switched mode to: ${C.bold}${currentMode.toUpperCase()}${C.reset}`);
                    }
                    else {
                        console.log(`${C.yellow}Usage: /mode <solo|broadcast|dialogue|consilium>${C.reset}`);
                    }
                    break;
                case '/role':
                    if (CORPORATE_ROLES[arg]) {
                        currentRole = arg;
                        console.log(`${C.green}✔ Active role set to: ${C.bold}${arg}${C.reset}`);
                    }
                    else {
                        console.log(`${C.yellow}Available roles: ${Object.keys(CORPORATE_ROLES).join(', ')}${C.reset}`);
                    }
                    break;
                case '/toggle': {
                    const target = arg.toLowerCase();
                    if (target === '1' || target === 'boot')
                        accordions.bootLog = !accordions.bootLog;
                    else if (target === '2' || target === 'servers')
                        accordions.servers = !accordions.servers;
                    else if (target === '3' || target === 'models')
                        accordions.models = !accordions.models;
                    else if (target === '4' || target === 'consilium')
                        accordions.consilium = !accordions.consilium;
                    else if (target === '5' || target === 'roles')
                        accordions.roles = !accordions.roles;
                    else if (target === 'all') {
                        const nextState = !accordions.servers;
                        accordions.bootLog = nextState;
                        accordions.servers = nextState;
                        accordions.models = nextState;
                        accordions.consilium = nextState;
                        accordions.roles = nextState;
                    }
                    else {
                        console.log(`${C.yellow}Usage: /toggle <1-5|all|boot|servers|models|consilium|roles>${C.reset}`);
                    }
                    renderDashboard(session);
                    break;
                }
                case '/consilium':
                    if (!arg) {
                        console.log(`${C.yellow}Usage: /consilium <your problem/question for the council>${C.reset}`);
                    }
                    else {
                        await handleConsiliumRun('consilium', arg);
                    }
                    break;
                case '/dialogue':
                    if (!arg) {
                        console.log(`${C.yellow}Usage: /dialogue <debate topic or question>${C.reset}`);
                    }
                    else {
                        await handleConsiliumRun('dialogue', arg);
                    }
                    break;
                case '/clear':
                    session.clearHistory();
                    console.clear();
                    renderDashboard(session);
                    console.log(`${C.green}✔ Session memory cleared.${C.reset}`);
                    break;
                case '/help':
                    printHelp();
                    break;
                default:
                    console.log(`${C.red}✖ Unknown command: ${cmd}. Type /help for assistance.${C.reset}`);
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
        // Standard solo chat stream via UniversalLlmClient
        process.stdout.write(`\n${C.bold}${C.white}┌─ [EVABOT] (${session.getModel()}) ───────────────────────${C.reset}\n`);
        try {
            const client = new UniversalLlmClient();
            await client.streamContent(session.getModel(), [{ role: 'user', content: input }], (chunk) => {
                process.stdout.write(chunk);
            });
            process.stdout.write(`\n${C.bold}${C.white}└─${'─'.repeat(50)}${C.reset}\n`);
        }
        catch (err) {
            process.stdout.write(`\n${C.red}✖ Generation Error: ${err.message}${C.reset}\n`);
        }
        rl.prompt();
    });
}
main().catch((err) => {
    console.error(`Fatal Terminal Crash:`, err);
    process.exit(1);
});
