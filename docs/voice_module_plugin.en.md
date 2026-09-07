# EvaBot Gemini Live Voice Module Plugin — Specification & Architecture (EN)

## Executive Summary
The **EvaBot Gemini Live Voice Module** is an isolated, plug-and-play neural voice interaction system powered by Google's **Gemini Multimodal Live API** (`BidiGenerateContent` over WebSockets). It enables natural, bidirectional, human-like voice conversations with ultra-low latency, speech interruption support (barge-in), and dual distinct characters:
- **Eva (Ева)**: Lead Frontend & UX Director, articulate, warm, empathetic female neural voice (`Aoede`).
- **Adam (Адам)**: Chief Backend Architect & Cloud Lead, deep, authoritative, analytical male neural voice (`Fenrir`).

---

## Key Capabilities

### 1. Isolated Plugin Architecture
- Decoupled into `src/plugins/voice/` (backend controller and configuration) and `src/web/voice/` (client-side Web Audio streaming engine and UI).
- Can be toggled on/off on the fly (`POST /api/voice/toggle` or via the UI toggle switch `[ PLUGIN: ON/OFF ]`).
- Zero overhead on the core chat engine when deactivated.

### 2. Dual Neural Characters & Dynamic Switching
- **Eva (♀ / Aoede)**: Specializes in client-side architecture, user experience, typography, interface design, and front-end engineering.
- **Adam (♂ / Fenrir)**: Specializes in distributed systems, PostgreSQL, cloud clusters, security protocols, and backend reliability.
- **Voice-Activated Handoff**: When a user mentions *"Eva / Ева"* or *"Adam / Адам"* during speech, the system dynamically switches the active persona and voice model in real-time.

### 3. Native Multilingual Fluency
- Fluent in **5 languages**:
  - English (EN)
  - Ukrainian (UK)
  - Russian (RU)
  - Polish (PL)
  - Romanian (RO)
- Automatic code-switching based on user speech cadence.

### 4. Ultra-Low Latency Audio Pipeline
- **Microphone Capture**: 16,000 Hz 16-bit linear PCM little-endian streaming over WebSocket chunks.
- **Audio Playback**: 24,000 Hz 16-bit linear PCM audio buffer queue with jitter buffering and smooth transition scheduling.
- **Barge-In (Interruption)**: Immediate audio playback interruption when the user starts speaking or when the model signals an interruption.
- **Visualizer**: Real-time canvas oscilloscope rendering frequency bands and audio levels for both Eva and Adam.

---

## Local Policy Compliance
- **Base Location**: Odesa, Ukraine (UA).
- **Currency Standards**: Strictly USD ($) and EUR (€). Prohibited currencies (RUB) are blocked.
- **Zero-Tolerance**: Strict compliance with `LocalePolicy.ts`.
