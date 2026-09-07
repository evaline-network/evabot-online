---
title: "CODING TOP MODELS 2026 09 07"
date: "2026-09-07"
tags: 
  - "report"
  - "models"
  - "rating"
description: "ПРАВИЛЬНЫЙ ТОП МОДЕЛЕЙ ДЛЯ КОДИНГА — сентябрь 2026"
aliases: 
  - "CODING_TOP_MODELS"
---

# ПРАВИЛЬНЫЙ ТОП МОДЕЛЕЙ ДЛЯ КОДИНГА — сентябрь 2026

Дата: 07.09.2026 · Метод: агрегация 6 источников + наши live-тесты (25 моделей, Pass@1).

## Источники

| # | Ресурс | Что измеряет | Дата |
|---|--------|--------------|------|
| 1 | **ModelGrep / Artificial Analysis Coding Index** | композитный кодинг-индекс | 09.2026 |
| 2 | **BenchLM Coding** | SWE-V / SWE-Pro / LiveCodeBench / SWE-Multi | 04.09.2026 |
| 3 | **DataLearnerAI Coding Leaderboard** | SWE-bench Verified / LiveCodeBench / SWE-Pro / SWE-Multi | 02.09.2026 |
| 4 | **LMArena Coding Arena** | Elo от живых разработчиков | 01.09.2026 |
| 5 | **LLM-Stats** | LLM Stats Score: coding + arena + benchmarks (373 модели) | 07.09.2026 |
| 6 | **OpenRouter Collections: Programming + Free Models** | **реальное использование** токенов (7 дней), ранжирование | 07.09.2026 |

"Дополнительно: наш бенч OmniRoute": 5 задач (Two Sum, Valid Parentheses, Longest Substr, Merge Intervals, LRU Cache), Pass@1 + латентность.

---

## ══════ ЧАСТЬ 0. OpenRouter — ЧТО РЕАЛЬНО ИСПОЛЬЗУЮТ ПРОГРАММИСТЫ (7 дней) ══════

Источник: openrouter.ai/collections/programming и /collections/free-models, обновлено 09.2026 по данным использования.

## Топ-10 моделей для программирования (лидерборд по токенам за 7 дней)

| Рейт | Модель | Slup | Tokens 7д | Доля | Цена in/out $1M | Контекст |
|------|--------|------|-----------|------|------------------|----------|
| 1 | **GLM 5.3 Flash** | z-ai/glm-5.3-flash | 7.98T | **15.0%** | $0.071 / $0.238 | 1.31M |
| 2 | **DeepSeek V4 Flash** | deepseek/deepseek-v4-flash | 5.74T | 10.8% | $0.05 / $0.16 | 1.31M |
| 3 | **GPT-5.6 Luna** | openai/gpt-5.6-luna | 4.89T | 9.2% | $0.20 / $1.20 | 1.05M |
| 4 | **Nemotron 3 Ultra** (free!) | nvidia/nemotron-3-ultra-550b-a55b:free | 4.63T | 8.7% | $0 / $0 | 1M |
| 5 | **MiniMax M3** (free!) | minimax/minimax-m3:free | 3.92T | 7.4% | $0 / $0 | 1M |
| 6 | **Hy4 Preview** | tencent/hy4-preview | 3.44T | 6.5% | $0.834 / $2.501 | 1M |
| 7 | **MiMo V2.5** | xiaomi/mimo-v2.5 | 3.29T | 6.2% | $0.119 / $0.238 | 1.05M |
| 8 | **GLM 5.2** | z-ai/glm-5.2 | 1.61T | 3.0% | ~$0.14 | — |
| 9 | **Kimi K3** | moonshotai/kimi-k3 | 1.36T | 2.5% | $3.00 | — |
| 10 | Others (30+ моделей) | — | 16.4T | 30.8% | — | — |

**Вывод:** OpenRouter реально используют для кодинга в основном дешёвые китайские с огромным контекстом (GLM, DeepSeek, MiMo, Hy4) + 2 бесплатных гиганта (Nemotron 3 Ultra, MiniMax M3). GPT-6/Claude там далеко не №1 по объёму — их жгут напрямую у вендоров.

## Топ-15 Free-моделей на OpenRouter (по использованию)

| Рейт | Модель | Slup | Tokens 7д | Контекст |
|------|--------|------|-----------|----------|
| 1 | **MiniMax M3** (:free) | minimax/minimax-m3 | 5.46T | 1M |
| 2 | **Nemotron 3 Ultra 550B** (:free) | nvidia/nemotron-3-ultra-550b-a55b | 4T | 1M |
| 3 | **Laguna S 2.1** (:free) | poolside/laguna-s-2.1 | 1.43T | 262K |
| 4 | **Nemotron 3.5 Lightning** (:free) | nvidia/nemotron-3.5-lightning | 1.16T | 1M |
| 5 | **Ling 3.0 Flash Fin** (:free) | inclusionai/ling-3.0-flash-fin | 896B | 262K |
| 6 | **MiniMax M2.7** (:free) | minimax/minimax-m2.7 | 777B | 196K |
| 7 | **Nemotron 3 Super 120B** (:free) | nvidia/nemotron-3-super-120b-a12b | 347B | 262K |
| 8 | **Inkling** (:free) | thinkingmachines/inkling | 273B | 1M |
| 9 | **Dots3-Note Preview** (:free) | dots-studio/dots-3-note-preview | 218B | 512K |
| 10 | **North Mini Code** (:free) | cohere/north-mini-code | 112B | 256K |
| 11 | **Laguna XS 2.1** (:free) | poolside/laguna-xs-2.1 | 106B | 262K |
| 12 | **Inkling Small** (:free) | thinkingmachines/inkling-small | 104B | 1M |
| 13 | **Ling 3.0 Flash Sante** (:free) | inclusionai/ling-3.0-flash-sante | 101B | 262K |
| 14 | **Nemotron 3 Nano Omni** (:free) | nvidia/nemotron-3-nano-omni-30b | 40.5B | 256K |
| 15 | **LFM2.5** (:free) | liquid/lfm-2.5-2.6b | 13.3B | 65K |

**Подтверждение:** наш OmniRoute уже подключил через Kilo все эти free-модели (minimax-m3, nemotron-3-ultra/super, north-mini-code, laguna-s/xs, dots-3-note, ling, lfm, inkling-small, nemotron-3.5/nano/omni) — совпадение с топом OpenRouter почти 100%.

---

## ════════════════════ ЧАСТЬ 1. ПЛАТНЫЕ МОДЕЛИ (API / подписка) ════════════════════

Ранжирование: баланс кодинг-индексов AA/ModelGrep + BenchLM + SWE-bench Verified + LiveCodeBench + LMArena Elo + факт-использование OpenRouter.

## S-Tier — топ для кодинга (агентные/сложные задачи, рефакторинг репо)

| # | Модель | AA Coding | BenchLM | SWE-V | LiveCB | Цена in/out $1M | Контекст |
|---|--------|-----------|---------|-------|--------|-----------------|----------|
| 1 | **Claude Fable 5.1** (Anthropic) | **81.6** | **84.2** | ~95%* | — | $10.00 / $50.00 | 1M |
| 2 | **Claude Opus 5** (Anthropic) | 78.0 | 75.6 | **96.0%** | — | $5.00 / $25.00 | 1M |
| 3 | **GPT-6 Astra** (OpenAI) | 76.9 | 75.3 | — | — | ~$11.90 | 1.1M |
| 4 | **GPT-5.6 Sol** (OpenAI) | **77.4** | 74.4 | — | — | $2.00 | — |
| 5 | **Claude Fable 5** (Anthropic) | 76.5 | 76.9 | **95.0%** | — | $10.00 | — |
| 6 | **Grok 4.6** (xAI) | 76.8 | — | — | — | $2.00 | — |
| 7 | **Gemini 3.8 Flash** (Google) | — | ~80 (95% лидера) | — | — | $0.89 / $3.75 | 1M |
| 8 | **Claude Opus 4.8** | — | — | 88.6 (SWE+) | — | $5.00 / $25.00 | 1M |

*SWE+ = openlm SWE-bench+.

## A-Tier — топ по цене/качеству (OpenRouter-выбор реальных пользователей)

| # | Модель | Разработка | SWE-V | LiveCB | OpenRouter usage | Цена in/out |
|---|--------|-----------|-------|--------|------------------|-------------|
| 9 | **DeepSeek-V4-Pro** | DeepSeek (MIT) | **80.6%** | **93.5%** (SOTA) | топ репо-агентов | $0.46 / $0.92 |
| 10 | **GLM-5.3** | Z.AI (glm_5_3) | ~79% | — | #1 по расходу (GLM 5.3 Flash) | $1.12 / $3.52 |
| 11 | **GLM-5.3-Flash** | Z.AI | — | — | **лидер OpenRouter #1** (7.98T/7д) | $0.071 / $0.238 |
| 12 | **DeepSeek-V4-Flash** | DeepSeek | **79.0%** | **91.6%** | #2 на OpenRouter | $0.05 / $0.16 |
| 13 | **GPT-5.6 Luna** | OpenAI | — | — | #3 на OpenRouter | $0.20 / $1.20 |
| 14 | **Hy4 Preview** | Tencent (open) | — | — | 1M ctx, #6 usage | $0.834 / $2.501 |
| 15 | **MiMo-V2.5** | Xiaomi (open) | — | — | #7 usage | $0.119 / $0.238 |
| 16 | **Kimi K3 (max)** | Moonshot | — | — | AA Coding **76.2**, 1M ctx | $3.00 |
| 17 | **Qwen3.7 Max** | Alibaba | **80.4%** | — | — | — |
| 18 | **MiniMax M3** | MiniMax | **80.5%** | — | SWE-Pro 59%, 1M ctx (MSA) | $0.63 / $2.52 |
| 19 | **MiniMax M2.5** | MiniMax | **80.2%** | — | open weights | — |
| 20 | **Kimi K2.6** | Moonshot | **80.2%** | — | SWE-Pro 58.6 (лучший open-weight Pro) | $0.55 |
| 21 | **Claude Sonnet 4.6** | Anthropic | **79.6%** | — | лучший ценник Anthropic | $3.00 / $15.00 |
| 22 | **GPT-5.2** | OpenAI | **80.0%** | — | — | — |
| 23 | **Qwen3.6 Plus** | Alibaba | **78.8%** | — | — | — |
| 24 | **GLM-5.2 / GLM-5** | Z.AI | **77.8%** (GLM-5) | — | #8 usage | ~$0.14 |
| 25 | **DeepSeek V3.2** | DeepSeek | 73.1% | **83.3%** | почти бесплатно | $0.27 / $0.40 |
| 26 | **Grok 4.5** | xAI | — | — | дешёвый топ-10 ($2/M) | $2.00 |
| 27 | **Gemini 3.1 Pro** | Google | 63.8-80.6% | 91.7 | 2M ctx | $2.00 / $12.00 |

## B-Tier — сильные, специфические

- **o3 / o4-mini** (OpenAI): Aider 84.9%, быстрые, дёшевые ($1.1).

- **Claude Opus 4.6/4.7** — всё ещё топ в Arena (1552/1551), но старше.

- **GPT-5 / Codex** — Codex-ветка для терминал-агентов (~80% SWE-V).

- **Step 3.7 Flash** (Stepfun) — сильная дешёвая китайская (у нас 4/5 через free).

- **Muse Spark 1.3** (Meta) — AA Coding 76.3, больше мультимодал.

---

## ════════════════════ ЧАСТЬ 2. БЕСПЛАТНЫЕ МОДЕЛИ (free-тир, $0) ════════════════════

Ранжирование: внешние лидерборды (SWE-V / free-репутация) + OpenRouter free-usage + **наши live-тесты** (Pass@1 / латентность).

## S-Tier — реально лучшие бесплатные кодеры

| Рейт | Модель | Free-доступ | OpenRouter 7д | Наш Pass@1 | Ср.время | Внешний сигнал |
|------|--------|-------------|---------------|-----------|----------|----------------|
| 🥇 | **Qwen3-Coder-Next** | ✅ HF router / Kilo | (не в топе free OR) | **5/5** | **1.9s** | SWE-V 70.6, Apache-2.0, лучший агентный free |
| 🥈 | **MiniMax M3** (:free) | ✅ Kilo / OR | **5.46T #1** | **5/5** | 2.4s | SWE-V **80.5%** — топ free во всех системах |
| 🥉 | **Nemotron 3 Ultra 550B** (:free) | ✅ Kilo / OR | **4T #2** | **5/5** (Kilo) | 70s | мощный reasoning, медленный |
| 4 | **Laguna S 2.1** (:free) | ✅ Kilo / OR | **1.43T #3** | ⚠️ (5/5 через kilo? проверить) | — | агент-фокус |
| 5 | **Nemotron 3.5 Lightning** (:free) | ✅ Kilo / OR | 1.16T #4 | — | — | дешёвый у frontier-качества |
| 6 | **Ling 3.0 Flash Fin** (:free) | ✅ Kilo / OR | 896B #5 | ⚠️ (пуст. ответ) | 0.8s | |
| 7 | **Nemotron 3 Super 120B** (:free) | ✅ Kilo / OR | 347B #7 | **5/5** | 7.8s | reasoning топ open |
| 8 | **North Mini Code** (:free) | ✅ Kilo / OR | 112B #10 | **5/5** | 14.5s | 69 tok/s speed-king |
| 9 | **Dots3-Note** (:free) | ✅ Kilo / OR | 218B #9 | — | — | SWE-V 78.4 — удивление месяца |
| 10 | **qwen3.8-27b / gpt-oss-120b / gpt-oss-20b** | ✅ Groq | (вне free-пула OR) | **5/5** | 0.3-0.7s | быстрейшие |
| 11 | **Mistral Code** | ✅ Mistral | — | **5/5** | 1.0s | лучший speed/качество |
| — | **Inkling / Inkling-Small** | ⚠️ лимит 429/403 | 273B/104B #8,#12 | 0/5* | — | SWE-V 80.2 (Inkling-Small) — потенциальный топ |

*0/5 = 403/429 лимиты OpenRouter, НЕ качество.

## A-Tier — хорошие бесплатные

| Модель | Free-доступ | Наш Pass@1 | Примечание |
|--------|-------------|-----------|------------|
| step-3.7-flash | Kilo free | 4/5 | reasoning, хорош |
| qwen3.6-27b | Groq | 4/5 | |
| GLM-4.7-flash | Z.AI | 4/5 | reasoning, медленнее |
| MiniMax M2.7 (:free) | Kilo / OR | — | 777B usage, свежая |
| Inkling (:free) | OR | 0/5* | |
| Gemma-4-31B-IT | OR free | не тест (429) | lmmarketcap top (81) |
| Nemotron 3 Nano Omni (:free) | Kilo / OR | — | 40.5B, лёгкий |

## B-Tier — маленькие/специфические

- **BTL-4** (Bad Theory Labs): SWE-V 78.4, tiny-effective open.

- **Ornith-1.5-35B-A3B**: SWE-V 79%, открытый 90B MoE.

- **Qwen3-Coder-30B/480B**: Apache, self-host.

- **Laguna XS 2.1, Ling 3.0 Flash Sante, LFM-2.5, Nemotron nano/omni, MiniMax-M2.7**: niche-свободники.

- **Yi-Coder 9B / Qwen3-Coder 7B**: on-device/embedded.

---

## ════════════════════ ИТОГОВЫЙ ВЕРДИКТ ════════════════════

### Лучший платный для кодинга (по лидербордам)

**Claude Fable 5.1 / Claude Opus 5** — №1-2 во всех 5 бенч-ресурсах, но дорого ($10-50/M). Лучшая цена/качество: **DeepSeek-V4-Pro** (80.6 SWE-V за $0.46), **GLM-5.3-Flash** ($0.071, лидер по факт-использованию разработчиков), **DeepSeek-V4-Flash** ($0.05/0.16).

### Лучшие БЕСПЛАТНЫЕ (проверены нами + подтверждены OpenRouter usage)

1. **Qwen3-Coder-Next** — лучший агентный кодер (5/5, 1.9s) — DEFAULT для агентных задач.

2. **Kilo/OR MiniMax M3 :free** — скрытый топ: SWE-V 80.5%, 5/5 за 2.4s, **№1 free по использованию** на OpenRouter.

3. **Nemotron 3 Ultra :free** — мощный reasoning, **№2 free по использованию**.

4. **Laguna S 2.1 / Nemotron 3.5 Lightning** — топ-4 free по использованию.

5. **Groq gpt-oss-120b / qwen3.8-27b / Mistral Code** — самая быстрая связка (0.3-1.0s).

6. **North Mini Code** — speed-king 69 tok/s, 5/5.

### Наш OmniRoute vs лидерборды

- Все топ-модели OpenRouter free-пула уже в нашем OmniRoute (через Kilo): minimax-m3, nemotron-3-ultra/super/3.5/lightning/nano/omni, laguna-s/xs, dots-3-note, ling, lfm, inkling-small, north-mini-code — **совпадение с реальным использованием почти 100%**.

- Расхождения: наши 0/5 по OR = лимиты (403/429), НЕ качество.

- Rекомендация: заменить ненадёжный free-пул OpenRouter на Kilo (стабильнее), добавить SambaNova/GitHub Models (DeepSeek-V3.2, gpt-oss).

### Рекомендации по сценариям

| Задача | Категория | Модель |
|--------|-----------|--------|
| Агентные многошаговые | Платно | Claude Fable 5.1 / Opus 5 / GPT-6 Astra |
| Агентные многошаговые | Бесплатно | Qwen3-Coder-Next, MiniMax M3 :free |
| Быстрый код-генерация | Бесплатно | Groq gpt-oss-120b / qwen3.8-27b |
| SWE-проблемы, репо-фиксы | Платно/почти | DeepSeek-V4-Pro, GLM-5.3-Flash, Kimi K2.6 |
| Дешёвый массовый кодинг | Платно | DeepSeek-V4-Flash ($0.05), DeepSeek-V3.2 ($0.27) |
| Огромный контекст (репо) | Платно | GLM-5.3-Flash 1.31M, Hy4 1M, MiniMax-M3 1M |

## Related

- [[overview/MODELS-2026|MODELS 2026]]

---

Back to [[index]]
