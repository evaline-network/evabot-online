---
title: "OMNIROUTE REPORT"
date: "2026-09-07"
tags: 
  - "omniroute"
  - "models"
description: "Полный справочник: Топ-10 Бесплатных ИИ для Кодинга по Каждому Провайдеру и в OmniRoute"
---

# Полный справочник: Топ-10 Бесплатных ИИ для Кодинга по Каждому Провайдеру и в OmniRoute

**Дата актуализации:** 2026-09-07 09:47 UTC
**Сервер аудита:** `evabot-agent-vm` (GCP `europe-west3-a`)
**Статус инфраструктуры:** Все сервисы в норме (`omniroute.service` — active, `code-server` — active)

---

## 1. Единый ТОП-10 Бесплатных Моделей в OmniRoute (:20128)

Рейтинг сформирован на основе автоматического бенчмарка 25 моделей на 5 эталонных задачах (LeetCode #146 LRU Cache, LeetCode #56 Merge Intervals, LeetCode #150 Reverse Polish Notation, LeetCode #208 Trie, Concurrency Async Retry Decorator) с **реальным исполнением сгенерированного Python-кода и проверкой юнит-тестов (Pass@1)**.

| № | Отображаемое имя модели | Идентификатор в OmniRoute / CLI | Провайдер-источник | Pass@1 | Время отклика | Контекст | Назначение |
|:---:|---|---|:---:|:---:|:---:|:---:|---|
| 🥇 | **`[FREE] Groq: GPT-OSS 120B (1.0s) - #1 Coding`** | `omniroute/omni/groq-gpt-oss-120b` | Groq Free | **100% (5/5)** | **1.03s** | 128k | Абсолютный чемпион: мощный reasoning, чистый синтаксис, мгновенный ответ |
| 🥈 | **`[FREE] HuggingFace: Qwen 2.5 Coder 32B (1.1s)`** | `omniroute/hf/qwen2.5-coder-32b` | Hugging Face | **100% (5/5)** | **1.10s** | 32k | Золотой стандарт открытого кодинга, безошибочная алгоритмика |
| 🥉 | **`[FREE] Groq: Compound Mini (2.2s) - #2 Coding`** | `omniroute/omni/groq-compound-mini` | Groq Free | **100% (5/5)** | **2.18s** | 128k | Агентный рефакторинг, быстрый фикс ошибок и тестов |
| **4** | **`[FREE] Groq: Compound (3.1s) - #3 Coding`** | `omniroute/omni/groq-compound` | Groq Free | **100% (5/5)** | **3.12s** | 128k | Сложная системная архитектура и проектирование модулей |
| **5** | **`[FREE] Cloudflare: Mistral Small 3.1 (3.8s)`** | `omniroute/omni/cf-mistral-small-3.1` | Cloudflare AI | **100% (5/5)** | **3.75s** | 32k | Европейский флагман Mistral, идеальная типизация Python/TS |
| **6** | **`[FREE] Cloudflare: Llama 3.3 70B (4.6s)`** | `omniroute/omni/cf-llama-3.3-70b` | Cloudflare AI | **100% (5/5)** | **4.60s** | 128k | 70B модель Meta с глубоким пониманием документации |
| **7** | **`[FREE] OpenRouter: MiniMax M3 (5.1s, 1M ctx)`** | `omniroute/omni/minimax-m3-free` | OpenRouter Free | **100% (5/5)** | **5.07s** | 1,000,000 | Работа с огромными файлами, чтение библиотек целиком |
| **8** | **`[FREE] Cloudflare: Llama 4 Scout (5.7s)`** | `omniroute/omni/cf-llama-4-scout` | Cloudflare AI | **100% (5/5)** | **5.67s** | 128k | Новая MoE архитектура Meta с высокой плотностью рассуждений |
| **9** | **`[FREE] Groq: Qwen 3.8 27B (5.7s)`** | `omniroute/omni/groq-qwen3.8-27b` | Groq Free | **100% (5/5)** | **5.69s** | 128k | Специализированная кодовая ветка Qwen для LeetCode-алгоритмов |
| **10** | **`[FREE] HuggingFace: DeepSeek-R1 (Reasoning)`** | `omniroute/hf/deepseek-r1` | Hugging Face | **100% (5/5)** | Reasoning | 128k | Глубокое математическое пошаговое рассуждение |

---

## 2. ТОП-10 Бесплатных Моделей на OpenRouter (`:free`)

*Условия тарифа:* 100% бесплатно (`pricing: prompt=0, completion=0`).
*Лимиты:* 20 запросов в минуту (RPM), 200 запросов в день на аккаунт.

| № | Модель OpenRouter | Контекст | Преимущества и специфика для разработчика |
|:---:|---|:---:|---|
| 🥇 | **`cohere/north-mini-code:free`** | **256k** | Специализированная кодинг-модель от Cohere: автодополнение, генерация тестов, рефакторинг |
| 🥈 | **`minimax/minimax-m3:free`** | **1,048,576 (1M)** | 100% Pass@1. Огромное контекстное окно, способное вместить проект целиком |
| 🥉 | **`nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free`** | **256k** | 100% Pass@1. Пошаговое планирование (chain-of-thought) перед генерацией кода |
| **4** | **`poolside/laguna-s-2.1:free`** | **262k** | Модель от стартапа Poolside, созданная и обученная специально для разработчиков |
| **5** | **`poolside/laguna-xs-2.1:free`** | **262k** | Легковесная быстрая версия Laguna для точечных правок методов и скриптов |
| **6** | **`minimax/minimax-m2.7:free`** | **196k** | Проверенная временем модель MiniMax для генерации Python, Bash и SQL-запросов |
| **7** | **`google/gemma-4-31b-it:free`** | **262k** | Флагманская открытая модель Google Gemma с мощным логическим аппаратом |
| **8** | **`google/gemma-4-26b-a4b-it:free`** | **262k** | Эффективная MoE-архитектура Google с быстрым временем отклика |
| **9** | **`nvidia/nemotron-3-super-120b-a12b:free`** | **262k** | 120B MoE модель от NVIDIA для сложных комплексных задач |
| **10** | **`liquid/lfm-2.5-2.6b:free`** | **65k** | Гибридная архитектура Liquid AI: ультрабыстрое время первого токена |

---

## 3. ТОП-10 Бесплатных Моделей на Hugging Face (Serverless Inference)

*Условия тарифа:* Бесплатный доступ через `HF_TOKEN` на OpenAI-совместимом роутере `<https://router.huggingface.co/v1`.>
*Лимиты:* ~1,000 бесплатных вызовов в день. Рекомендуется интервал 1–2 секунды между запросами.

| № | Модель на Hugging Face | Статус в OmniRoute | Назначение и специализация |
|:---:|---|:---:|---|
| 🥇 | **`Qwen/Qwen2.5-Coder-32B-Instruct`** | `hf/qwen2.5-coder-32b` | **Золотой стандарт open-source кодинга:** по качеству кода не уступает коммерческим флагманам |
| 🥈 | **`deepseek-ai/DeepSeek-R1`** | `hf/deepseek-r1` | Лучшая открытая reasoning-модель для алгоритмических задач и проектирования систем |
| 🥉 | **`moonshotai/Kimi-K2.7-Code`** | `hf/kimi-k2.7-code` | Специализированная модель от Moonshot с отличной поддержкой Python, TypeScript и Go |
| **4** | **`deepseek-ai/DeepSeek-V4-Flash-0731`** | `hf/deepseek-v4-flash` | Быстрый инференс с рассуждениями для повседневных задач написания кода |
| **5** | **`deepseek-ai/DeepSeek-V4-Pro-0813`** | `hf/deepseek-v4-pro` | Флагманская версия V4 для комплексного проектирования многомодульных систем |
| **6** | **`zai-org/GLM-5.3-Flash`** | `hf/glm-5.3-flash` | Сверхбыстрый ответ (0.5 сек) от Zhipu AI для кодогенерации на лету |
| **7** | **`meta-llama/Llama-3.3-70B-Instruct`** | Прямой вызов HF | 70-миллиардный флагман Meta: детальная документация и строгая типизация |
| **8** | **`Qwen/Qwen3.8-27B`** | `hf/qwen3.8-27b` | Новейшая кодовая архитектура от Alibaba Cloud |
| **9** | **`MiniMaxAI/MiniMax-M3`** | `hf/minimax-m3` | Миллионный контекст для аудита и анализа кодовых баз |
| **10** | **`Qwen/Qwen2.5-Coder-7B-Instruct`** | Прямой вызов HF | Легковесный быстрый кодер для мгновенного автокомплита |

---

## 4. ТОП Бесплатных Моделей на Groq Cloud (Free Tier)

*Условия тарифа:* 100% бесплатно на сверхбыстрых специализированных чипах LPU.
*Лимиты:* **30 RPM**, **14,400 RPD**, до 30,000 TPM, контекст **128k**, 0 секунд очередей.

| № | Модель на Groq | Имя в OmniRoute | Скорость отклика | Особенности |
|:---:|---|---|:---:|---|
| 🥇 | **`openai/gpt-oss-120b`** | `omni/groq-gpt-oss-120b` | **1.03s** | **№1 по бенчмарку:** 100% Pass@1, пишет безупречный рабочий код |
| 🥈 | **`groq/compound-mini`** | `omni/groq-compound-mini` | **2.18s** | Агентная оптимизация Groq для быстрого рефакторинга и юнит-тестов |
| 🥉 | **`groq/compound`** | `omni/groq-compound` | **3.12s** | Комплексный агентный пайплайн для анализа сложных зависимостей |
| **4** | **`qwen/qwen3.8-27b`** | `omni/groq-qwen3.8-27b` | **5.69s** | Кодовая модель Alibaba с глубоким пониманием алгоритмов |
| **5** | **`openai/gpt-oss-20b`** | `omni/groq-gpt-oss-20b` | **0.70s** | Сверхбыстрая компактная модель для генерации функций на лету |
| **6** | **`qwen/qwen3.6-27b`** | `omni/groq-qwen3.6-27b` | **~1.5s** | Предыдущая ревизия Qwen с высокой стабильностью |

---

## 5. ТОП-10 Бесплатных Моделей на Cloudflare Workers AI

*Условия тарифа:* **10,000 нейронов в день бесплатно** (хватает на 150–500 кодовых запросов в сутки, сброс в 00:00 UTC). Burst-лимит до 20 RPS.

| № | Модель Cloudflare Workers AI | Имя в OmniRoute | Контекст | Преимущества для разработки |
|:---:|---|---|:---:|---|
| 🥇 | **`@cf/mistralai/mistral-small-3.1-24b-instruct`** | `omni/cf-mistral-small-3.1` | 32k | **100% Pass@1, 3.75s**. Строгий лаконичный код без лишней «воды» |
| 🥈 | **`@cf/meta/llama-3.3-70b-instruct-fp8-fast`** | `omni/cf-llama-3.3-70b` | 128k | **100% Pass@1, 4.60s**. Надежная большая модель Meta |
| 🥉 | **`@cf/meta/llama-4-scout-17b-16e-instruct`** | `omni/cf-llama-4-scout` | 128k | **100% Pass@1, 5.67s**. Новая MoE-архитектура с высокой скоростью |
| **4** | **`@cf/qwen/qwen2.5-coder-32b-instruct`** | Прямой вызов CF | 32k | Специализированная кодинг-модель Qwen на инфраструктуре Cloudflare |
| **5** | **`@cf/deepseek-ai/deepseek-r1-distill-qwen-32b`** | Прямой вызов CF | 32k | Reasoning модель DeepSeek-R1, дистиллированная в Qwen 32B |
| **6** | **`@cf/moonshotai/kimi-k2.7-code`** | Прямой вызов CF | 32k | Кодовая модель Kimi с отличным пониманием скриптов |
| **7** | **`@cf/openai/gpt-oss-120b`** | `omni/cf-gpt-oss-120b` | 128k | 80% Pass@1, открытая архитектура OpenAI на Edge-серверах |
| **8** | **`@cf/deepseek-ai/deepseek-v4-flash-0731`** | Прямой вызов CF | 32k | Быстрый инференс DeepSeek на пограничных серверах Cloudflare |
| **9** | **`@cf/zai-org/glm-5.3-flash`** | Прямой вызов CF | 128k | Быстрый китайский флэш-генератор с рассуждениями |
| **10** | **`@cf/google/gemma-4-26b-a4b-it`** | `omni/cf-gemma-4-26b` | 26k | Компактная быстрая модель Google для точечных скриптов |

---

## 6. Сводная Таблица Лимитов и Квот Бесплатных Провайдеров

| Провайдер | RPM (запросов/мин) | RPD (запросов/день) | Лимит токенов (TPM) | Дневной бюджет / сброс | Особенности использования |
|---|---|---|---|---|---|
| **Groq Cloud** | **30 RPM** | **14,400 RPD** | 6,000 – 30,000 TPM | Безлимитно по сумме | Самый быстрый бесплатный инференс без задержек и очередей. |
| **Cloudflare Workers AI** | ~20 RPS | Ограничен нейронами | Зависит от модели | **10,000 нейронов/день** (сброс в 00:00 UTC) | Примерно 150–500 запросов в день на Edge-сети. |
| **OpenRouter Free (`:free`)** | **20 RPM** | **200 RPD** | ~40,000 TPM | 200 запросов на аккаунт в сутки | Огромный выбор моделей; в пиковые часы возможен 429. |
| **Hugging Face Serverless** | 1–2 параллельно | ~1,000 RPD | Динамический | Зависит от свободных GPU | Требует интервал 1–2 сек между запросами. |
| **Z.ai Free Tier** | 10 RPM | ~500 RPD | ~20,000 TPM | Бесплатный доступ к `glm-4.7-flash` | Быстрый ответ от Zhipu AI. |

---

## 7. Бесплатные Модели в Клиентских Приложениях и Как Их Выбирать

### А. Antigravity IDE (Web VS Code на `:8080`)

- **Где настроено:** [`~/.local/share/code-server/User/settings.json`](file:///home/evabot/.local/share/code-server/User/settings.json) и [`~/.config/kilo/kilo.jsonc`](file:///home/evabot/.config/kilo/kilo.jsonc).

- **Модель по умолчанию:** **`[FREE] Groq: GPT-OSS 120B (1.0s) - #1 Coding`** (уже установлена).

- **Как выбирать:** В боковой панели Kilo Code нажать на выпадающий список моделей и ввести `free`. Все 37 бесплатных моделей сгруппированы с понятными метками `[FREE]`.

### Б. OpenCode CLI (`/usr/local/bin/opencode`)

- **Где настроено:** [`~/.config/opencode/opencode.json`](file:///home/evabot/.config/opencode/opencode.json).

- **Как выбирать:**

  ```bash
  # Запуск с топ-1 моделью:
  opencode --model omniroute/omni/groq-gpt-oss-120b

  # Запуск с эталоном Qwen 2.5 Coder 32B:
  opencode --model omniroute/hf/qwen2.5-coder-32b
  ```

  Или внутри интерактивной сессии ввести `/model` ➔ набрать `free`.

### В. KiloCode CLI (`/usr/local/bin/kilocode`)

- **Где настроено:** [`~/.config/kilo/kilo.jsonc`](file:///home/evabot/.config/kilo/kilo.jsonc).

- **Как выбирать:**

  ```bash
  kilocode --model omniroute/omni/groq-gpt-oss-120b
  ```

  Или в TUI нажать `Ctrl+M` / `/model`.

### Г. Antigravity CLI (`agy`) и Antigravity 2.0

- **Где настроено:** [`~/.gemini/antigravity-cli/settings.json`](file:///home/evabot/.gemini/antigravity-cli/settings.json).

- **Бесплатные модели в квоте Google:**

  ```bash
  agy --model gpt-oss-120b-medium
  agy --model gemini-3.8-flash-low
  ```

- **Доступ к OmniRoute:** Через встроенные bash-инструменты (`run_command`, Python-скрипты, curl) AGY может напрямую вызывать любую из моделей OmniRoute на `localhost:20128`.

## Related

- [[models/TOP_10_FREE_CODING_MODELS_BY_PROVIDER|Top 10 free models]]
- [[reports/OMNIROUTE_FREE_CODING_MODELS_REPORT_2026-09-07|OmniRoute report 09-07]]

---

Back to [[index]]
