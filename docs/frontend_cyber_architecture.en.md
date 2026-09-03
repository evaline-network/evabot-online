# EvaBot Online // Cyber-Terminal Frontend Architecture

## 1. Executive Architectural Overview

The frontend architecture of EvaBot Online has been re-architected from the ground up into a high-performance, minimalist cyber-terminal interface. Designed for mission-critical multi-model operations, the interface enforces a strict monochrome visual hierarchy accented exclusively with standardized traffic-light status indicators.

## 2. Core Visual & UX Pillars

### 2.1 Pure Black & White Cyber-Terminal Aesthetic
- **Monochrome Base:** True pitch-black `#000000` background paired with high-contrast `#ffffff` typography, framed with sharp 1px monospace ASCII boundaries.
- **Typography:** Rendered using `JetBrains Mono`, establishing a technical aesthetic across all headers, prompts, bubbles, telemetry readouts, and code blocks.
- **Zero Distraction:** Unnecessary gradients, decorative blur overlays, and soft rounded bubbly elements have been replaced with sharp cyber-deck panels, ASCII glyphs, and responsive terminal prompts.

### 2.2 Standardized Traffic Light Status Indicators
All functional indicators strictly follow the cyber traffic light paradigm:
- 🟢 **Green (`#22c55e` / `emerald-400`):** System Online, Idle state, Active provider, Ready node, 100% Free quota tier available.
- 🟡 **Amber (`#eab308` / `amber-400`):** Transmission/Streaming in progress, Standby node, Paid / Pay-As-You-Go model tier.
- 🔴 **Red (`#ef4444` / `rose-500`):** Transmission error, Offline server, Stream aborted by operator.

### 2.3 2-Screen Application Ergonomics
The application is structured into two dedicated functional screens with smooth spring scrolling transitions:
1. **Screen 1 (`#screen-terminal`):**
   - Sticky cyber top bar with brand mark `EVABOT//CORE`, live status beacon, active mode/role tags, active model chip, and the reactive trilingual switcher.
   - Central message scroll canvas with ASCII frame message bubbles (`┌─`, `│`, `└─`) for both operator and assistant turns.
   - Fixed bottom prompt interface with interactive `>` prompt, auto-expanding textarea, transmission button (`[ TRANSMIT ↵ ]` / `[ STOP 🟡 ]`), and keyboard shortcut hints.
   - Smooth anchor button: `[ ↓ CONTROL PANEL // SYSTEM DECK ]`.
2. **Screen 2 (`#screen-control-deck`):**
   - Return navigation button: `[ ↑ RETURN TO TERMINAL ]`.
   - **Module 1 (Neural Providers):** 4 selectable routing providers — Google Cloud, OmniRoute, OpenRouter, and OpenCode Go.
   - **Module 2 (Model Selection & Quota Inspector):** Dynamic model catalog (24+ models), showing free/paid status badges, context windows, token limits, and pricing strictly in USD ($) and EUR (€).
   - **Module 3 (Operational Modes):** Solo, Broadcast, Dialogue, and Consilium.
   - **Module 4 (Corporate Roles & Personas):** 8 executive and engineering roles (CEO, CTO, CISO, CFO, UX/Design, Dev, AI Research, Legal) that dynamically configure system instructions.
   - **Module 5 (Real-Time System Telemetry):** Live uptime counter, RSS memory consumption, roundtrip API latency, active configuration readouts, and cloud authentication state.
   - **Module 6 (Security & Credentials):** In-browser encrypted local key vault for custom Gemini API keys and ambient auto-auth toggle.

### 2.4 Instant Reactive Trilingual Switcher (EN / UK / RU)
- **Header Switcher:** Instant toggling between `[ EN | UK | RU ]` without triggering page refreshes.
- **Data Binding:** Driven by `data-i18n` and `data-i18n-placeholder` attributes evaluated against an in-memory dictionary.
- **Strict Compliance:** In strict adherence to global project rules, all monetary calculations and displays are exclusively denominated in USD ($) and EUR (€), with zero mentions of prohibited currencies or regions.

## 3. Bundle Build & Performance Verification
The frontend client bundle is compiled using esbuild:
```bash
npx esbuild src/web/app.ts --bundle --outfile=dist/bundle.js --format=esm --target=es2022 --sourcemap
```
- **Output:** `dist/bundle.js` (97.0 KB), `dist/bundle.js.map` (135.3 KB)
- **Build Duration:** < 370 ms
- **Target:** ECMAScript 2022 ESM
