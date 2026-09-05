# EvaBot Engine – Mobile-First User Interface

This document describes the minimalist, mobile-first (portrait mode) UI for the EvaBot engine, designed for one-thumb control. The interface is structurally identical for Web browsers and Terminals (Linux/Termux).

## 1. Main Chat Screen (First Screen)

**Goal:** Maximum simplicity, showing only essential elements.

```text
┌──────────────────────────────────────┐
│ ☰ EvaBot                     1200 🪙 │
├──────────────────────────────────────┤
│                                      │
│ Eva: Hello! How can I help today?    │
│                                      │
│                                      │
│                                      │
│                                      │
│                                      │
│                                      │
│                                      │
│                                      │
├──────────────────────────────────────┤
│ ╭──────────────────────────────────╮ │
│ │ Type your message...         [↑] │ │
│ ╰──────────────────────────────────╯ │
└──────────────────────────────────────┘
```

**Key Elements:**
- **Header:** Hamburger menu (☰) on the left for settings, branding in the center, and current token balance on the right.
- **Chat Area:** Clean, distraction-free scrollable message list.
- **Input Area:** Rounded border (or styled equivalent in TUI) text input field positioned at the bottom for easy one-thumb typing. Send button `[↑]`.

## 2. Settings Menu (Second Screen)

**Goal:** Progressive disclosure of settings, accessed via the hamburger menu.

```text
┌──────────────────────────────────────┐
│ ← Back                      Settings │
├──────────────────────────────────────┤
│ Model Selection                      │
│ ◉ GPT-4o         $0.01 / 1K tokens   │
│ ◯ Claude 3.5 Sonnet  €0.015 / 1K tok │
│                                      │
│ Current Usage                        │
│ - Session Cost: $0.05                │
│ - Available Tokens: 12,500           │
│                                      │
│ Voice Options                        │
│ [ ] Enable Voice Output              │
│                                      │
│ Appearance                           │
│ [x] Dark Mode                        │
│                                      │
└──────────────────────────────────────┘
```

**Key Elements:**
- **Header:** Back button (`←`) on the left to return to the chat, title on the right.
- **Model Selection:** List of available models with their respective costs strictly in USD ($) or EUR (€).
- **Current Usage:** Real-time display of session cost and remaining available tokens.
- **Toggles:** Easy-to-reach checkboxes for Voice and Appearance settings.
