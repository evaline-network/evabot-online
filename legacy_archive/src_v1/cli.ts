#!/usr/bin/env npx tsx
/// <reference types="node" />
/**
 * EvaBot Live-Markdown Cyberpunk Terminal TUI Client & Automated CI Test Suite
 */

import { LiveMarkdownEngine } from './core/LiveMarkdownEngine.js';

// ANSI Color Escape Helpers for Terminal Parity
const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  gray: "\x1b[90m",
  bgDark: "\x1b[40m"
};

function getCyberTerminalBanner(): string {
  return `
${C.cyan}${C.bold}╔══════════════════════════════════════════════════════════════════════════════╗
║ ⚡ EVABOT ONLINE v0.0.1 // CYBERPUNK LIVE-MARKDOWN TERMINAL COMMAND CENTER  ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ ${C.magenta}SYSTEM:${C.reset} STARTER DEMO MODE v0.0.1  │ ${C.green}TELEMETRY:${C.reset} 1000ms TICK REAL-TIME    ${C.cyan}║
║ ${C.blue}NODE 1:${C.reset} Frankfurt c3-standard-8  │ ${C.yellow}NODE 2:${C.reset} Iowa e2-micro (Always Free) ${C.cyan}║
╚══════════════════════════════════════════════════════════════════════════════╝${C.reset}
`;
}

function getTerminal3DCyberFaceAscii(angle: number, voiceActive: boolean): string {
  const status = voiceActive ? `${C.magenta}${C.bold}[● VOICE MIC RECORDING...]${C.reset}` : `${C.cyan}[OFFLINE MODE - TYPE PROMPT BELOW]${C.reset}`;
  const eyeColor = voiceActive ? C.magenta : C.cyan;
  const mouthColor = voiceActive ? C.green : C.blue;

  return `
${C.gray}┌──────────────────────────────────────────────────────────────────────────────┐${C.reset}
${C.cyan}${C.bold}│ [3D CYBER MESH FACE // TERMINAL AVATAR WIREFRAME]                             │${C.reset}
${C.gray}│ ${status.padEnd(85)} │${C.reset}
${C.gray}│                                                                              │${C.reset}
${C.cyan}│                       .────────────────────────.                             │
│                      /   ${eyeColor}▲   ┌──────┐   ▲${C.cyan}   \\                            │
│                     │   ${eyeColor}███${C.cyan}  │  ${C.yellow}/\x1b[33m\\${C.cyan}  │  ${eyeColor}███${C.cyan}   │                            │
│                     │   ${eyeColor}▼   └──────┘   ▼${C.cyan}   │                            │
│                      \\        ${C.yellow}│  │${C.cyan}        /                             │
│                       \\       ${mouthColor}╭────╮${C.cyan}       /                              │
│                        \\      ${mouthColor}╰────╯${C.cyan}      /                               │
│                         '────────────────'                                   │${C.reset}
${C.gray}└──────────────────────────────────────────────────────────────────────────────┘${C.reset}
`;
}

function runTests(): number {
  console.log("================================================================================");
  console.log("RUNNING CYBERPUNK TERMINAL TUI AUTOMATED TEST SUITE (v0.0.1)");
  console.log("================================================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`${C.green}[PASS]${C.reset} ${msg}`);
      passed++;
    } else {
      console.error(`${C.magenta}[FAIL]${C.reset} ${msg}`);
      failed++;
    }
  }

  const engine = LiveMarkdownEngine.getInstance();
  const telemetry = engine.getTelemetry();

  // Test 1: Telemetry State
  assert(telemetry.frankfurtCpuPct > 0, "Telemetry Frankfurt CPU load active");
  assert(telemetry.iowaRamTotalMb === 1024, "Telemetry Iowa memory specification verified");

  // Test 2: Currency Compliance
  const sampleMd = `[metric:opex_usd] ([metric:opex_eur])`;
  const processed = engine.processLiveMarkdown(sampleMd);
  assert(!processed.includes('RUB') && !processed.includes('₽'), "Strict Currency compliance (No RUB/₽)");
  assert(processed.includes('$325.00') && processed.includes('€300.00'), "USD ($) and EUR (€) OpEx telemetry formatted correctly");

  // Test 3: Mode 1 - BEAUTIFUL_HYPER_UI Compiler
  const hyperOutput = engine.renderByMode("# TITLE\n### ACCORDION\n- Item", 'BEAUTIFUL_HYPER_UI');
  assert(hyperOutput.includes('hyper-container'), "Mode 1 (BEAUTIFUL_HYPER_UI) compiler verified");

  // Test 4: Mode 2 - PURE_NO_CSS_TUI Compiler
  const tuiOutput = engine.renderByMode("# TITLE\n### ACCORDION\n- Item", 'PURE_NO_CSS_TUI');
  assert(tuiOutput.includes('<h1>TITLE</h1>'), "Mode 2 (PURE_NO_CSS_TUI) compiler verified");

  // Test 5: Mode 3 - RAW_MARKDOWN Compiler
  const rawOutput = engine.renderByMode(sampleMd, 'RAW_MARKDOWN');
  assert(rawOutput.includes('RAW REACTIVE MARKDOWN SOURCE STREAM'), "Mode 3 (RAW_MARKDOWN) compiler verified");

  console.log("================================================================================");
  console.log(`TEST SUMMARY (v0.0.1 CYBERPUNK TUI): ${passed} PASSED, ${failed} FAILED`);
  console.log("================================================================================");

  return failed === 0 ? 0 : 1;
}

function showLiveStream(): void {
  const engine = LiveMarkdownEngine.getInstance();
  console.clear();
  console.log(getCyberTerminalBanner());
  console.log("\n>>> LIVE CYBERPUNK TERMINAL TUI TELEMETRY STREAM (1000ms TICK):");

  let ticks = 0;
  const interval = setInterval(() => {
    engine.tick();
    ticks++;
    const t = engine.getTelemetry();
    const ramBar = engine.generateProgressBar((t.frankfurtRamUsedMb / t.frankfurtRamTotalMb) * 100);
    const cpuBar = engine.generateProgressBar(t.frankfurtCpuPct, 100, 15);

    console.log(getTerminal3DCyberFaceAscii(ticks, t.voiceActive));
    console.log(`${C.cyan}[TICK ${ticks}]${C.reset} Uptime: ${C.yellow}${t.uptimeSeconds}s${C.reset} | Frankfurt CPU: ${C.magenta}${cpuBar}${C.reset} | RAM: ${C.green}${ramBar}${C.reset}`);
    console.log(`${C.blue}OpEx Balance:${C.reset} ${C.green}$${t.totalOpexUsd.toFixed(2)}${C.reset} (${C.green}€${t.totalOpexEur.toFixed(2)}${C.reset}) | Caddy: ${C.cyan}[ONLINE TLS 1.3]${C.reset}\n`);

    if (ticks >= 5) {
      clearInterval(interval);
      console.log("================================================================================");
      console.log("CYBERPUNK TERMINAL STREAMING COMPLETE.");
      process.exit(0);
    }
  }, 500);
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.includes('--test')) {
    process.exit(runTests());
  }

  if (args.includes('--live')) {
    showLiveStream();
    return;
  }

  console.log(getCyberTerminalBanner());
  runTests();
}

main();
