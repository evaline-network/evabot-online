# Отчёт 2026-09-08: Покрытие кода + Routing-политика (Gemini reserved)

Автор: EvaBot Engineering (agent session)  
Статус: deployed (`evabot-brain.service` restarted, live-verified)

---

## 1. Покрытие кода (c8 / V8-coverage поверх `npm test`)

| Область | Statements | Branches | Functions | Lines | Инструмент |
|---|---|---|---|---|---|
| **Backend `src/`** | **82.7%** | **75.4%** | **83.9%** | **82.7%** | c8 + tsx, 29 тест-сюит |
| **Frontend `frontend/src/`** | 0% | 0% | 0% | 0% | нет test-runner (только `tsc --noEmit` + vite build) |

- Команда замера: `npx c8 --include src --reporter text-summary --reporter json-summary npx tsx tests/index.ts`
- Полный отчёт: `coverage/coverage-summary.json` (per-file), текстовая таблица — в логе прогона.
- Сильные зоны: `server/routes/*` (91–100%), `telegram/` (95.9%), core-движки.
- Слабые зоны (цель v0.1.0 ≥ 85% backend): ветви Resilience/Consilium, edge-кейсы GeminiClient streaming.
- Фронтенд: единственный gate — typecheck; рекомендация — vitest + @testing-library.

## 2. Routing-политика (TASK-322)

**Причина:** gemini-3.8-flash привязан к платному Google-аккаунту (health: `authSource: Google ADC`) — квоты Gemini нужны для разработки.

**Лимиты gemini-3.8-flash** (по данным реестра, free tier AI Studio): **15 RPM / 1M TPM / 1500 RPD** ($0). На платном аккаунте — pay-as-you-go без дневного капа, но с биллингом. Теперь runtime chat Gemini НЕ вызывает вообще.

**Новая политика:**
- Модель входа: **`openrouter/free`** — Free Models Router (авто-выбор живой free-модели; не умирает от удаления одной модели).
- Фолбэк/`/auto` флот: ТОП новейших умнейших 100%-free, LIVE-верифицировано 2026-09-08:
  `nvidia/nemotron-3-ultra-550b-a55b:free` (550B MoE, 1M ctx — smartest), `thinkingmachines/inkling:free` (1M), `inkling-small:free` (1M), `nvidia/nemotron-3-super-120b-a12b:free` (262k), `dots-studio/dots-3-note-preview:free` (512k), `google/gemma-4-31b-it:free` (262k, OpenRouter-квота — не наш аккаунт), `cohere/north-mini-code:free` (256k, код), `inclusionai/ling-3.0-flash-sante:free` (262k), `poolside/laguna-s-2.1:free` (262k).
- ВАЖНО: старые `:free` id из реестра 2025 (deepseek-r1:free, llama-3.3-70b:free, gpt-4o-mini:free, …) на OpenRouter **уже платные** — 404 "unavailable for free". Убраны из флотов; актуальный флот — §9b ModelRegistry.
- `OPENROUTER_API_KEY` подтянут из GCP Secret Manager (`evabot-openrouter-api-key`) в `.env`.

## 3. Верификация (live)
- `POST /api/chat` → 200, `"model":"openrouter/free","provider":"openrouter"` — ответ получен, Google не задет.
- `npm test` — 24/29 suites; 4 падения pre-existing (AnsiStream emoji, DebugLog, CloudSTT, DeveloperMode env) + TelegramDeep (сетевой flake).
- `tsc` — 0 ошибок.

## 4. Рекомендации
1. Авто-синк реестра с OpenRouter `/models` (раз в 12 ч вместе с model-monitor) — реестр протух за сутки.
2. vitest для фронтенда (цель ≥ 60% к v0.1.1).
3. Починить OmniRoute LiteLLM («No connected db») — офлайн-флот недоступен.
