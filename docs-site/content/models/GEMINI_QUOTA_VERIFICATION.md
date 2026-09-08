---
title: Gemini Quota & Billing Verification
date: 2026-09-07
tags:
  - gemini
  - vertex-ai
  - quota
  - billing
  - research
description: Жива верификация фактического пути авторизации EvaBot к Gemini (ADC → Vertex AI), состояния биллинга проекта evabot-agent-server, лимитов free tier Gemini API и связи с подпиской Google AI Pro. Проверено live-пробами 2026-09-07.
---

# Gemini Quota & Billing Verification

> Исследование (без изменений `src/`). Live-пробы выполнены **2026-09-07** на VM `evabot-agent-vm` (europe-west3-a).
> Источники кода: `src/core/GoogleAuthProvider.ts`, `src/core/GeminiClient.ts`, `src/core/Config.ts`, `/opt/omniroute/omniroute.env`.

**Back to [[index]]**
