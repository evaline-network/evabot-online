# EvaBot — Топ-10 моделей кодинга (Сентябрь 2026)

Актуально на **5 сентября 2026** по свежим релизам (1–4 сентября: GPT-6 Astra, Claude Fable 5.1, Gemini 3.8 Flash, Muse Spark 1.3) и лидерам SWE-bench / LiveCodeBench / Terminal-Bench (BenchLM, Artificial Analysis, DataCamp). Финансы строго в **USD ($) / EUR (€)**.

> Легенда: **SWE-V** = SWE-bench Verified, **Term-Bench** = Terminal-Bench 4.0, **AA Coding** = Artificial Analysis Coding Index, **FCode** = FrontierCode 1.1.

---

## 🟢 БЕСПЛАТНЫЕ (топ-10 самых умных для кодинга)

Бесплатный доступ: open-weight self-host + бесплатные эндпоинты (OpenRouter `:free`: 20 req/min, 50/день или 1000/день после $10).

| # | Модель | Провайдер | Контекст | Кодинг | Открытые веса |
|---|--------|-----------|---------|--------|--------------|
| 1 | **Qwen3.8 Max** | Alibaba | 1M | Кодинг-агент, open-weight лидер (~2.4T MoE) | ✅ |
| 2 | **GLM-5.3** | Z.AI | 1M | Coding ~68.3, self-host | ✅ |
| 3 | **Qwen3.8-27B** | Alibaba | 262K | Coding ~65.5, лёгкий агент | ✅ |
| 4 | **GLM-5.3-Flash** | Z.AI | 1M | Coding ~65.3, дешёвый флеш | ✅ |
| 5 | **GLM-5.2** | Z.AI | 1M | Coding ~65.0, open-weight | ✅ |
| 6 | **Hy4 preview** | Tencent | 1M | Coding ~68.9, open-weight | ✅ |
| 7 | **gpt-oss-120b** | OpenAI (OpenRouter) | 131K | Coding + reasoning-агент, $0 | ⚠️ |
| 8 | **Laguna M.1** | Poolside | 262K | Coding-агент (tools), $0 | ✅ |
| 9 | **gpt-oss-20b** | OpenAI (OpenRouter) | 131K | Быстрые кодинг-задачи, $0 | ✅ |
| 10 | **Laguna XS.2** | Poolside | 262K | Лёгкий coding-агент, $0 | ✅ |

**Для coding-агента (рекомендуем):** `Qwen3.8 Max` или `GLM-5.3` (open-weight лидеры), из бесплатных API — `gpt-oss-120b` / `Laguna M.1`.

---

## 🟡 ПЛАТНЫЕ (топ-10 самых умных для кодинга)

Closed frontier-модели сентябрь 2026 (BenchLM coding rank, Artificial Analysis, DataCamp).

| # | Модель | Провайдер | SWE-V | Term-Bench | FCode | AA Coding | $/1M in | $/1M out |
|---|--------|-----------|-------|-----------|-------|-----------|---------|----------|
| 1 | **Claude Fable 5.1** | Anthropic | — | 55.8% | 53.5% | — | $10.00 | $50.00 |
| 2 | **GPT-6 Astra** | OpenAI | — | **57.7%** | 53.3% | 76.9% | $10.00 | $50.00 |
| 3 | **Claude Opus 5** | Anthropic | **96%** | — | 53.4% | — | $5.00 | $25.00 |
| 4 | **Claude Fable 5** | Anthropic | 95% | — | 53.5% | — | $10.00 | $50.00 |
| 5 | **GPT-5.6 Sol** | OpenAI | — | 37.3% | — | — | $5.00 | $30.00 |
| 6 | **Gemini 3.8 Flash** | Google | — | 19.1% | — | 59 | $0.75 | $3.75 |
| 7 | **Gemini 3.7 Flash** | Google | — | — | — | — | $0.75 | $3.75 |
| 8 | **Claude Sonnet 5** | Anthropic | 85.2% | — | — | — | $2.00 | $10.00 |
| 9 | **GPT-5.6 Luna** | OpenAI | — | — | — | — | $1.00 | $6.00 |
| 10 | **GPT-5.6 Terra** | OpenAI | — | — | — | — | $2.50 | $15.00 |

**Лучшие по кодингу:** `Claude Opus 5` — топ по SWE-bench Verified (96%); `GPT-6 Astra` — лидер Terminal-Bench 4.0 (57.7%, новый 3 сент); `Claude Fable 5.1` — #1 BenchAlign (84.2). Оптимум цена/качество на агентских задачах — `GPT-5.6 Luna` / `Gemini 3.8 Flash`.

---

## 🆕 Самые свежие релизы (1–5 сентября 2026)
| Модель | Лаб | Дата | Цена $/1M in-out |
|--------|-----|------|------------------|
| **GPT-6 Astra** | OpenAI | 3 сен | $10 / $50 (1M ctx) |
| **Gemini 3.8 Flash** | Google | 2 сен | $0.75 / $3.75 |
| **Claude Mythos 5.1** | Anthropic | 1 сен | $10 / $50 |
| **Claude Fable 5.1** | Anthropic | 1 сен | $10 / $50 |
| **Muse Spark 1.3** | Meta | 2 сен | — (1M ctx) |
| **Qwen3.8-Max-0902** | Alibaba | 2 сен | — |
| **Ling 3.0 Flash Sante** | inclusionai | 4 сен | **Free** |

---

## Источники (Сентябрь 2026)
- BenchLM — [Coding leaderboard](https://benchlm.ai/coding), [GPT-6 Astra](https://benchlm.ai/models/gpt-6-astra)
- Artificial Analysis — [Benchmarking GPT-6 Astra](https://artificialanalysis.ai/articles/benchmarking-gpt-6-astra)
- DataCamp — [GPT-6 Astra](https://www.datacamp.com/blog/gpt-6-astra)
- AI Release Tracker / LLM Gateway — [свежие релизы](https://aireleasetracker.com/latest), [timeline](https://llmgateway.io/timeline)
- OpenRouter — [Free Models](https://openrouter.ai/collections/free-models)

> ⚠️ Бесплатный ростер OpenRouter меняется быстро — проверяйте live-фильтр перед продакшеном.
