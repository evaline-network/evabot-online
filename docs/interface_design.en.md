# EvaBot Online - Interface Design

## Overview
This document outlines the line-by-line text-based interface blueprint for the EvaBot engine. The design is intended to be implemented universally across both Terminal (CLI) and Web UIs, ensuring identical user experience, maximum functionality, and high aesthetic value.

## Core Principles
1. **Mobile-First & Minimalistic**: Optimized for portrait mode, fitting narrow screens (e.g., Termux). Navigation and input are designed for single-finger usage.
2. **Progressive Disclosure**:
   - **Screen 1 (Main Chat)**: Keeps the focus on the conversation. Features minimal controls, but clearly displays the selected model, token count, and real-time session cost.
   - **Screen 2 (Settings)**: Accessed via the menu toggle, revealing deeper configurations (model selection, temperature, advanced prompts, and detailed statistics).
3. **Unified Identity**: Text-based boundaries (`===`, `---`) scale elegantly in both raw CLI and retro-styled Web UIs.

## Requirements Compliance
- **Session Costs**: Strictly displayed in **USD ($)** or **EUR (€)** across all screens.
- **Locale Policy**: Adheres to the Zero-Tolerance Policy (no restricted regions or currencies).
