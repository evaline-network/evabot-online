#!/usr/bin/env npx tsx
import readline from 'node:readline';
import { ChatSession } from '../core/ChatSession.js';
import { ModelRegistry } from '../models/ModelRegistry.js';
import { logger } from '../core/Logger.js';
// ANSI escape codes for beautiful terminal styling
const C = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    magenta: '\x1b[35m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    gray: '\x1b[90m',
    white: '\x1b[97m',
};
function printBanner(session) {
    console.log(`
${C.cyan}${C.bold}╔════════════════════════════════════════════════════════════════════════════════╗
║                     ⚡ EVABOT MODULAR GEMINI LLM CHAT ⚡                       ║
║                           UNIVERSAL TERMINAL CLI                               ║
╠════════════════════════════════════════════════════════════════════════════════╣${C.reset}
║ ${C.yellow}Active Model:${C.reset}   ${C.bold}${session.getModel().padEnd(30)}${C.reset} ${C.gray}│ Commands: /help, /models, /model${C.reset} ║
║ ${C.green}API Status:${C.reset}     ${(session.hasApiKey() ? 'API Key Configured' : 'No Key (use /key)').padEnd(30)} ${C.gray}│ Strict Currency: USD ($) & EUR (€)${C.reset}║
${C.cyan}${C.bold}╚════════════════════════════════════════════════════════════════════════════════╝${C.reset}
`);
}
function printHelp() {
    console.log(`
${C.yellow}${C.bold}Available Commands:${C.reset}
  ${C.cyan}/models${C.reset}              - List all available Gemini models
  ${C.cyan}/model <id>${C.reset}          - Switch active model (e.g. /model gemini-2.5-pro)
  ${C.cyan}/clear${C.reset}               - Clear current conversation memory
  ${C.cyan}/history${C.reset}             - Show number of messages in current session
  ${C.cyan}/key <apiKey>${C.reset}        - Set or change Gemini API key in session
  ${C.cyan}/system <instruction>${C.reset} - Update system instruction / persona
  ${C.cyan}/help${C.reset}                - Show this command reference
  ${C.cyan}/exit${C.reset} (or ${C.cyan}exit${C.reset})     - Quit chat session
`);
}
function printModels() {
    console.log(`\n${C.yellow}${C.bold}Supported Google Gemini Models:${C.reset}`);
    for (const m of ModelRegistry.getAllModels()) {
        const recTag = m.recommended ? `${C.green}[RECOMMENDED]${C.reset}` : '';
        console.log(`  ${C.cyan}${C.bold}${m.id.padEnd(20)}${C.reset} ${recTag} [Tier: ${m.tier}]`);
        console.log(`    ${C.gray}${m.description}${C.reset}`);
    }
    console.log();
}
/**
 * Parses command-line arguments for one-shot mode or non-interactive usage
 */
function parseArgs() {
    const args = process.argv.slice(2);
    const result = {};
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--prompt' || args[i] === '-p') {
            result.prompt = args[++i];
        }
        else if (args[i] === '--model' || args[i] === '-m') {
            result.model = args[++i];
        }
        else if (args[i] === '--system' || args[i] === '-s') {
            result.system = args[++i];
        }
        else if (args[i] === '--key' || args[i] === '-k') {
            result.apiKey = args[++i];
        }
    }
    return result;
}
async function main() {
    const cliArgs = parseArgs();
    const session = new ChatSession({
        model: cliArgs.model,
        systemInstruction: cliArgs.system,
        apiKey: cliArgs.apiKey,
    });
    // Non-interactive one-shot mode
    if (cliArgs.prompt) {
        if (!session.hasApiKey()) {
            console.error(`${C.red}Error: GEMINI_API_KEY is not set. Provide via --key or GEMINI_API_KEY environment variable.${C.reset}`);
            process.exit(1);
        }
        try {
            await session.sendMessage(cliArgs.prompt, (chunk) => {
                process.stdout.write(chunk);
            });
            process.stdout.write('\n');
            process.exit(0);
        }
        catch (err) {
            console.error(`\n${C.red}Failed: ${err.message}${C.reset}`);
            process.exit(1);
        }
        return;
    }
    // Interactive REPL mode
    printBanner(session);
    if (!session.hasApiKey()) {
        console.log(`${C.yellow}Notice: GEMINI_API_KEY is not configured yet.${C.reset}`);
        console.log(`${C.gray}Type /key <YOUR_GEMINI_API_KEY> to authenticate.${C.reset}\n`);
    }
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const promptUser = () => {
        rl.question(`${C.green}${C.bold}You > ${C.reset}`, async (input) => {
            const line = input.trim();
            if (!line) {
                promptUser();
                return;
            }
            if (line === 'exit' || line === '/exit' || line === '/quit') {
                console.log(`${C.cyan}Goodbye!${C.reset}`);
                rl.close();
                process.exit(0);
                return;
            }
            if (line === '/help') {
                printHelp();
                promptUser();
                return;
            }
            if (line === '/models') {
                printModels();
                promptUser();
                return;
            }
            if (line.startsWith('/model')) {
                const parts = line.split(' ');
                if (parts.length < 2) {
                    console.log(`${C.yellow}Active model:${C.reset} ${session.getModel()}`);
                    console.log(`Use: /model <model-id> to switch. Example: /model gemini-2.5-pro`);
                }
                else {
                    const newModel = parts[1].trim();
                    if (session.setModel(newModel)) {
                        console.log(`${C.green}Successfully switched to ${newModel}${C.reset}`);
                    }
                    else {
                        console.log(`${C.red}Invalid model: "${newModel}". Type /models to see valid options.${C.reset}`);
                    }
                }
                promptUser();
                return;
            }
            if (line.startsWith('/key')) {
                const parts = line.split(' ');
                if (parts.length < 2) {
                    console.log(`Use: /key <your_api_key>`);
                }
                else {
                    const key = parts[1].trim();
                    session.setApiKey(key);
                    console.log(`${C.green}API key set for this session.${C.reset}`);
                }
                promptUser();
                return;
            }
            if (line === '/clear') {
                session.clearHistory();
                console.log(`${C.green}Conversation history cleared.${C.reset}`);
                promptUser();
                return;
            }
            if (line === '/history') {
                console.log(`History turns: ${session.getHistory().length / 2}`);
                promptUser();
                return;
            }
            if (line.startsWith('/system')) {
                const newSystem = line.replace(/^\/system\s*/, '').trim();
                if (!newSystem) {
                    console.log(`${C.yellow}Current system instruction:${C.reset}\n${session.getSystemInstruction()}`);
                }
                else {
                    session.setSystemInstruction(newSystem);
                    console.log(`${C.green}System instruction updated.${C.reset}`);
                }
                promptUser();
                return;
            }
            // Normal prompt to Gemini
            if (!session.hasApiKey()) {
                console.log(`${C.red}Please provide your GEMINI_API_KEY first using /key <api_key>${C.reset}`);
                promptUser();
                return;
            }
            process.stdout.write(`${C.magenta}${C.bold}EvaBot (${session.getModel()}) > ${C.reset}`);
            try {
                await session.sendMessage(line, (chunk) => {
                    process.stdout.write(chunk);
                });
                process.stdout.write('\n\n');
            }
            catch (err) {
                console.log(`\n${C.red}[Error]: ${err.message}${C.reset}\n`);
            }
            promptUser();
        });
    };
    promptUser();
}
if (process.argv[1] && (process.argv[1].endsWith('terminal-chat.js') || process.argv[1].endsWith('terminal-chat.ts'))) {
    main().catch((err) => {
        logger.error('TerminalChat', 'Unhandled CLI exception', err);
        process.exit(1);
    });
}
