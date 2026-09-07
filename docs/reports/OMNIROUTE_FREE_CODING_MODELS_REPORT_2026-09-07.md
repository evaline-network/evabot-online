# 🎯 Справочник: Топ-10 Бесплатных Моделей для Кодинга по Каждому Провайдеру

**Дата обновления:** 2026-09-07  
**Провайдеры:** OmniRoute, Groq Cloud, Mistral AI, Hugging Face, Cloudflare Workers AI, OpenRouter  

---

## 1. OmniRoute (Единый роутер `:20128`)
*Эндпоинт:* `http://localhost:20128/v1/chat/completions` (токен: `omniroute-token`)  
*Все модели ниже проверены живыми тестами (100% Pass@1 на задачах LeetCode Medium/Hard)*

1. 🥇 **`omniroute/omni/groq-gpt-oss-120b`** — 1.03s, 100% Pass@1, 128k (Абсолютный лидер скорости и логики)
2. 🥈 **`omniroute/hf/qwen2.5-coder-32b`** — 1.10s, 100% Pass@1, 32k (Золотой стандарт кодинга)
3. 🥉 **`omniroute/omni/mistral-codestral`** — 2.18s, 100% Pass@1, 256k (Флагманский кодер Mistral, огромное окно)
4. **`omniroute/omni/groq-compound-mini`** — 2.18s, 100% Pass@1, 128k
5. **`omniroute/omni/groq-compound`** — 3.12s, 100% Pass@1, 128k
6. **`omniroute/omni/cf-mistral-small-3.1`** — 3.75s, 100% Pass@1, 32k
7. **`omniroute/omni/cf-llama-3.3-70b`** — 3.97s, 100% Pass@1, 128k
8. **`omniroute/omni/cf-qwen2.5-coder-32b`** — 4.67s, 100% Pass@1, 32k (Бесплатный бэкенд Cloudflare)
9. **`omniroute/omni/minimax-m3-free`** — 5.07s, 100% Pass@1, 1,000,000 токенов контекста
10. **`omniroute/hf/deepseek-r1`** — DeepSeek Reasoning, 100% Pass@1, 128k

---

## 2. Mistral AI (La Plateforme Free Tier)
*Лимиты:* 1 RPS (1 запрос в секунду), бесплатный ключ `MISTRAL_API_KEY`  
*Контекст:* 128k – 256k токенов

1. 🥇 **`codestral-latest`** (100% Pass@1, 2.18s, 256k) — Специализированный кодинг-флагман
2. 🥈 **`open-mistral-nemo`** (128k) — Легковесная и очень точная модель
3. 🥉 **`ministral-8b-latest`** (128k) — Сверхбыстрый локальный/агентный кодинг
4. **`mistral-code-fim-latest`** — Модель автодополнения (Fill-in-the-Middle)

---

## 3. Groq Cloud (Free Tier)
*Лимиты:* 30 RPM, 14,400 RPD, 128k контекст, аппаратные процессоры LPU

1. 🥇 **`openai/gpt-oss-120b`** (1.03s, 100% Pass@1, 128k)
2. 🥈 **`groq/compound-mini`** (2.18s, 100% Pass@1, 128k)
3. 🥉 **`groq/compound`** (3.12s, 100% Pass@1, 128k)
4. **`qwen/qwen3.8-27b`** (5.69s, 100% Pass@1, 128k)
5. **`openai/gpt-oss-20b`** (0.70s, 80% Pass@1, 128k)
6. **`qwen/qwen3.6-27b`** (~1.5s, 128k)

---

## 4. Cloudflare Workers AI (Free Tier)
*Лимиты:* 10,000 нейронов в день (обновляются каждые 24 часа), `CLOUDFLARE_API_TOKEN`

1. 🥇 **`@cf/qwen/qwen2.5-coder-32b-instruct`** (4.67s, 100% Pass@1, 32k) — Специализированный кодер
2. 🥈 **`@cf/meta/llama-3.3-70b-instruct-fp8-fast`** (3.97s, 100% Pass@1, 128k)
3. 🥉 **`@cf/mistralai/mistral-small-3.1-24b-instruct`** (3.75s, 100% Pass@1, 32k)
4. **`@cf/meta/llama-4-scout-17b-16e-instruct`** (4.59s, 100% Pass@1, 128k)
5. **`@cf/qwen/qwen3.8-27b`** (128k)
6. **`@cf/qwen/qwq-32b`** (Рассуждающая модель для сложных алгоритмов)
7. **`@cf/deepseek-ai/deepseek-r1-distill-qwen-32b`** (32k)
8. **`@cf/openai/gpt-oss-120b`** (128k)
9. **`@cf/meta/llama-3.1-8b-instruct-fp8`** (128k, сверхбыстрая)
10. **`@cf/meta/llama-3.2-3b-instruct`** (128k)

---

## 5. Hugging Face Serverless Router
*Лимиты:* ~1,000 запросов/день, задержка 1–2 сек между запросами (`HF_TOKEN`)

1. 🥇 **`Qwen/Qwen2.5-Coder-32B-Instruct`** (1.10s, 100% Pass@1, 32k)
2. 🥈 **`deepseek-ai/DeepSeek-R1`** (Reasoning, 128k)
3. 🥉 **`Qwen/Qwen2.5-Coder-7B-Instruct`** (1.83s, 80% Pass@1, 32k)
4. **`moonshotai/Kimi-K2.7-Code`** (32k)
5. **`zai-org/GLM-5.3-Flash`** (128k)
6. **`deepseek-ai/DeepSeek-V4-Flash-0731`** (32k)
7. **`deepseek-ai/DeepSeek-V4-Pro-0813`** (32k)
8. **`meta-llama/Llama-3.3-70B-Instruct`** (128k)
9. **`Qwen/Qwen3.8-27B`** (128k)
10. **`MiniMaxAI/MiniMax-M3`** (1M)

---

## 6. OpenRouter (`:free`)
*Лимиты:* 20 RPM, 200 запросов/день (`OPENROUTER_API_KEY`)

1. 🥇 **`cohere/north-mini-code:free`** (256k)
2. 🥈 **`minimax/minimax-m3:free`** (1M)
3. 🥉 **`nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free`** (256k)
4. **`poolside/laguna-s-2.1:free`** (262k)
5. **`poolside/laguna-xs-2.1:free`** (262k)
6. **`minimax/minimax-m2.7:free`** (196k)
7. **`google/gemma-4-31b-it:free`** (262k)
8. **`google/gemma-4-26b-a4b-it:free`** (262k)
9. **`nvidia/nemotron-3-super-120b-a12b:free`** (262k)
10. **`openrouter/free`** (Динамический роутер между бесплатными нодами)
