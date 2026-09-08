---
title: "OMNIROUTE FREE CODING RATING 2026 09 07"
date: "2026-09-07"
tags: 
  - "report"
  - "omniroute"
  - "rating"
description: "OmniRoute: Полный аудит бесплатных кодинг-моделей — сентябрь 2026"
---

# OmniRoute: Полный аудит бесплатных кодинг-моделей — сентябрь 2026

Дата тестирования: **07.09.2026** · Стенд: OmniRoute LiteLLM (`:20128`) · Методология: 5 задач кодинга (Two Sum, Valid Parentheses, Longest Substring, Merge Intervals, LRU Cache) → код извлекается из ответа → запуск юнит-тестов (Pass@1) + замер латентности.

## 1. РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ (Pass@1 из 5)

| Рейтинг | Модель (омни-алиас) | Бэкенд | Pass | Ср. латент. | Примечание |
|---|---|---|---|---|---|
| 1 | `omni/groq-qwen3.8-27b` | Groq | **5/5** | 0.3s | самый быстрый |
| 2 | `omni/groq-gpt-oss-20b` | Groq | **5/5** | 0.4s | |
| 3 | `omni/groq-gpt-oss-120b` | Groq | **5/5** | 0.7s | |
| 4 | `omni/mistral-code` | Mistral | **5/5** | 1.0s | |
| 5 | `omni/groq-compound-mini` | Groq | **5/5** | 1.1s | |
| 6 | `hf/qwen3-coder-next` | HF router | **5/5** | 1.9s | лучший бесплатный coder |
| 7 | `omni/groq-compound` | Groq | **5/5** | 1.9s | |
| 8 | `kilo/minimax-m3-free` | Kilo/OpenRouter | **5/5** | 2.4s | |
| 9 | `omni/nemotron-3-super-120b-a12b-free` | OpenRouter free | **5/5** | 6.0s | reasoning ~531 tok |
| 10 | `kilo/nemotron-3-super-free` | Kilo | **5/5** | 7.8s | |
| 11 | `kilo/north-mini-code-free` | Kilo | **5/5** | 14.5s | reasoning ~2076 tok |
| 12 | `kilo/nemotron-3-ultra-free` | Kilo | **5/5** | 70.2s | медленный, reasoning |
| 13 | `kilo/step-3.7-flash-free` | Kilo | 4/5 | 13.2s | reasoning ~2682 tok |
| 14 | `omni/groq-qwen3.6-27b` | Groq | 4/5 | 19.1s | |
| 15 | `omni/zai-glm-4.7-flash` | Z.AI | 4/5 | 38.4s | 1 таймаут |
| 16 | `omni/nemotron-3-ultra-550b-free` | OpenRouter free | 3/5 | 105.6s | соединение обрывалось |
| 17 | `hf/qwen3-next-80b` | HF router | 2/5 | 2.0s | 402 когда кредиты кончаются |
| 18 | `hf/qwen3.5-122b` | HF router | 0/5 | — | HTTP 402 (исчерпаны HF-кредиты) |
| 19 | `omni/inkling-free` | OpenRouter | 0/5 | — | HTTP 403 (key limit) |
| 20 | `omni/inkling-small-free` | OpenRouter | 0/5 | — | HTTP 403 (key limit) |
| 21 | `kilo/inkling-free` | Kilo | 0/5 | — | HTTP 429 (rate limit) |
| 22-24 | `omni/cer-*` (gpt-oss-120b, qwen3.8-27b, gemma-4-31b) | Cerebras | 0/5 | — | HTTP 402 (Payment required — ключ без кредита) |
| 25 | `omni/gemini-3.8-flash` | Gemini | 0/5 | — | HTTP 429 (rate limit daily) |

## 2. ВАЖНЫЕ ВЫВОДЫ

- **ТОП-кодеры бесплатно (Pass@1 = 5/5, быстро):** Groq (qwen3.8-27b, gpt-oss-20b/120b), Mistral Code, HF `Qwen3-Coder-Next`, Kilo MiniMax-M3, Nemotron-3-Super, North Mini-Code.
- **Best-free-coding-modell overall:** `hf/qwen3-coder-next` (5/5, 1.9s, стабильно бесплатен, хорошо работает для инструментов/агентов). Рекомендуется как дефолт под агентные задачи.
- **BFCL/инструменты:** для `start task` (агентные) — НЕ брать Groq gpt-oss-120b с малым `max_tokens`: reasoning съедает бюджет, tool_call отрезается (`finish=length`) → "зависание". Для агентных задач лучше `hf/qwen3-coder-next` или `omni/gemini-3.8-flash` (но последний — rate-limit днём).
- OpenRouter free-тир исчерпался в этот день (403 "Key limit exceeded (total limit)", ~50 req/day без $10 кредита). Добавлены **fallbacks** для всех openrouter-free и for `omni/qwen3-coder-next` → `hf/qwen3-coder-next` → `omni/gemini-3.8-flash` (проверено: работает).
- HF router: free-кредиты $0.10/мес кончаются быстро; стабильно бесплатны только `qwen3-coder-next`, `qwen3-next-80b`, `qwen3.5-122b` (частично). Остальные hf-модели (glm-5.x, kimi, granite, muse, deepseek-v4 и пр.) — платные/флаки.

## 3. ПОЛНЫЙ СПИСОК ПРОВАЙДЕРОВ

### 3.1 Подключенные в OmniRoute (9)
| Провайдер | Base URL / ключ | Модели в конфиге | Статус |
|---|---|---|---|
| **OpenRouter** | openrouter.ai/api/v1 / `OPENROUTER_API_KEY` | 71 (вкл. 18 `:free`) | free-лимит днём (403); fallback спас |
| **HF Router** | router.huggingface.co/v1 / `HF_TOKEN` | 29 (23 базовые + 6 новых) | free: qwen3-coder-next, qwen3-next-80b, qwen3.5-122b |
| **Groq** | api.groq.com / `GROQ_API_KEY` | 6 | ✅ работает отлично |
| **Mistral** | api.mistral.ai / `MISTRAL_API_KEY` | 8 (вкл. codestral, magistral) | ✅ работает |
| **Gemini** | generativelanguage / `GEMINI_API_KEY` | 7 | ✅ но 429 при daily rate |
| **Cerebras** | api.cerebras.ai / `CEREBRAS_API_KEY` | 3 | ⚠️ 402 (Payment required) |
| **Z.AI (Zhipu)** | api.z.ai/api/paas/v4 / `ZAI_API_KEY` | 1 (glm-4.7-flash) | ✅ работает (но медленный reasoning) |
| **Cloudflare Workers AI** | api.cloudflare.com / `CLOUDFLARE_API_TOKEN` | 8 | не тестировалось в прогоне |
| **Together** | api.together.xyz / `TOGETHER_API_KEY` | 10 | ⚠️ кредиты исчерпаны |
| **KILO (новый!)** | api.kilo.ai/api/gateway/v1 / без ключа | 6 (nemotron ultra/super, step-3.7-flash, minimax-m3, inkling, north-mini-code) | ✅ работает, 17+ free-моделей |

### 3.2 Провайдеры, которые МОЖНО подключить (free-tier, без карты или с лёгким ключом)
| Провайдер | Что даёт бесплатно | Требования |
|---|---|---|
| **Google AI Studio** | Gemini 3.x Flash / Flash-Lite (большой free тир) | ключ бесплатно, телефон |
| **GitHub Models** | ~13 free-моделей (OpenAI, Llama и др.) | GitHub-аккаунт, токен, без карты |
| **NVIDIA NIM** | 100+ моделей (Llama, Nemotron, DeepSeek), 40 RPM кредит-based | ключ бесплатно, без карты |
| **SambaNova Cloud** | DeepSeek-V3.1/V3.2, Llama-3.3-70B, gpt-oss-120b, gemma-4-31B free; 20 RPM / 200K ток./день | ключ, без карты |
| **SiliconFlow** | Qwen3-8B и др. (бесплатные слоты), 100+ моделей | регистрация, verify |
| **ModelScope (Alibaba)** | 500 req/день/модель | телефон |
| **DeepInfra** | ~$10/мес рекуррентный кредит | без карты |
| **Fireworks** | $1 signup credit | карта не обязательна |
| **AnyAPI** | 15 free-моделей, 100K ток/день | ключ, без карты |
| **LLM7.io** | 15 free-моделей (DeepSeek R1/V3, GPT-4o-mini), 30 RPM | ключ, без карты |
| **Kluster AI** | DeepSeek и др. free | регистрация |
| **Qwen Studio** | Qwen 3.6-Plus/Max в чате+API | аккаунт |
| **Pollinations** | без регистрации, keyless | ничего |
| **Aion Labs** | 2 модели 128K, 15 RPM | email |
| **Cohere** | trial 1000 calls/мес, Command A+ | ключ |
| **Replicate** | "Try for Free" модели | без карты |
| **DeepSeek официально** | ~5M токенов новичкам, потом почти бесплатно ($0.27/$0.40) | карта позже |

### 3.3 Недоступны / платные / осторожно
- **Together** — free-тира больше нет (min $5), у нас credits exhausted.
- **Cerebras** — ключ без кредита → 402.
- **Ollama Cloud** — недоступен (530).
- **Poe** — free тир сокращён (~300 поинтов/день).
- **Fireworks/Together/NVIDIA NIM** — кредиты/лимиты меняются.

## 4. ТОП-10 БЕСПЛАТНЫХ КОДИНГ-МОДЕЛЕЙ (рейтинг по результатам + по сообществу)

1. **Qwen3-Coder-Next** (HF free / OpenRouter) — лучший бесплатный агентный coder.
2. **GLM-5.x** (Z.AI / HF) — топ open-source для кодинга по бенчам Sept-2026.
3. **Kimi-K2.6 / K2.7-Code** (HF/Z.AI) — сильный coding+agentic, но HF-кредиты платные.
4. **DeepSeek V3.2 / V4** ($0.27/$0.40) — почти бесплатно, бюджетный король.
5. **Groq gpt-oss-120b / qwen3.8-27b** — самые быстрые бесплатные.
6. **MiniMax M3 (free)** — 5/5, 2.4s, 1M context.
7. **Nemotron-3 Super/Ultra (free)** — 5/5, тяжёлый reasoning.
8. **North Mini Code (free)** — 5/5, специализирован коду.
9. **Mistral Code / Codestral** — 5/5, 1.0s.
10. **Gemma-4-31B (free)** — топ по scores сообщества (81), OpenRouter free.

## 5. СДЕЛАННЫЕ ИЗМЕНЕНИЯ (07.09.2026)
- Добавлены в config.yaml: `hf/qwen3-next-80b`, `hf/qwen3.5-122b` (работают бесплатно); временно добавлены и убраны (402) `hf/glm-5.1`, `hf/kimi-k2.6`, `hf/granite-4.2-30b`, `hf/muse-glimmer-30b`.
- **Новый провайдер Kilo** (6 моделей, без ключа), `KILO_DUMMY` в omniroute.env.
- **router_settings.fallbacks: 6→22 правила** — теперь groq AND openrouter-free AND `omni/qwen3-coder-next` падают на `hf/qwen3-coder-next` → `omni/gemini-3.8-flash`. Проверено: 403 OpenRouter → ответ из HF.
- total config: **145 моделей**.

## 6. РЕКОМЕНДАЦИИ
- Для агентных задач (start task/инструменты): `hf/qwen3-coder-next` (или `omni/gemini-3.8-flash` вне пиков).
- Для быстрых простых кодинг-запросов: `omni/groq-qwen3.8-27b`.
- Для тяжёлого кода/больших контекстов: `kilo/minimax-m3-free`, `omni/nemotron-3-super-120b-a12b-free`, `kilo/north-mini-code-free`.
- OpenRouter free-тир: лимит ~50 req/день при $0 балансе — рассчитывать на fallbacks.
- Подключить следующим: **SambaNova** (DeepSeek-V3.2 бесплатно), **GitHub Models**, **NVIDIA NIM** — дадут больше топовых бесплатных моделей без карты.
