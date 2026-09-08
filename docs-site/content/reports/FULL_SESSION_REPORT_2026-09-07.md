---
title: Повний звіт сесії 2026-09-07 — EvaBot Global Upgrade
date: 2026-09-07
tags: [report, session, evabot, google-cloud, voice, commands]
description: "Повний звіт: 40+ виконаних задач — інфраструктура, команди, голос, Google Cloud free-tier, безпека"
---

# Повний звіт сесії — 2026-09-07 (вечір/ніч)

## 1. Інфраструктура та діагностика
- Обидві VM RUNNING: evabot-agent-vm (europe-west3-a, c3-standard-8), evaline-micro-vm (us-central1-a, e2-micro). Диск 46%, RAM 10/31Gi.
- Сервіси: evabot-brain (:3000), omniroute (LiteLLM :20128), **evabot-voice (:8000 — новий systemd-юнит, FastAPI)**, nginx, n8n (docker), code-server, watchdog-таймер, model-monitor-таймер.
- evabot.online → 200; /docs/ → 200 (через Caddy micro-VM → nginx compute-VM → Quartz build).

## 2. Безкоштовні моделі — діагноз + ремонт
- **HF** — місячні кредити вичерпано (402) → шлях: новий ключ або Pro. Прибрано з OmniRoute.
- **Z.ai** — модель glm-4.7-flash видалена провайдером; баланс ключа порожній → вимкнено, конфіг оновлено.
- **OpenRouter** — 30+ старих `:free` слагів знято з роздачі; актуальний список (15-16) отримано живим API.
- **Groq/Cerebras** — llama-3.3-70b видалена у Groq; Cerebras: payment required → прибрано.
- **OmniRoute rebuild**: 156 → 35 записів, кожна прожита live-смок-тестом (25/42 → фінал 35 моделей, gelma/gemma/rate-limit ідентифіковані).
- **Gemini**: знайдено і виправлено ПЛАТНИЙ трафік через Vertex AI → переведено на generativelanguage free-tier API-ключ ($0, live-верифіковано, метрика generate_content_free_tier_requests). Vertex лише при EVA_VERTEX_ENABLED=1.
- **Google AI Pro НЕ впливає на API-квоти** — це лише підписка на застосунки (NotebookLM, Code Assist тощо). Документ: docs/models/GEMINI_QUOTA_VERIFICATION.md.

## 3. Команди (28, з тримовними аліасами EN/UK/RU)
- Нові серверні: /history /memory /search /find /services /servers /products /who /news /health /sephirot /sys /debug /log /monitor /voices /settings /agents /developer /translate /say /listen /cost+
- Локальні: /autocorrect /voice eva|adam /tts /emoji /lang /clear
- Системна обізнаність: SYSTEM_CONTEXT інжектиться в кожен промпт → бот правильно відповідає «яка модель підключена» (live-перевірка: gemini-3.8-flash, evabot-agent-vm, Франкфурт).
- Тест: 17/17 команд живі через API.

## 4. Голос (Google Cloud, тільки free)
- **Cloud TTS**: Ева = uk-UA-Chirp3-HD-Aoede (жіночий), Адам = ru-RU-Chirp3-HD-Fenrir (чоловічий) — Chirp3-HD 1M симв/міс free; ліміт 900k з відмовою ДО запиту; кеш у data/tts-cache; /api/tts + /api/tts/status; браузер грає серверний звук, fallback — browser TTS.
- **Cloud STT**: v1 latest_long (60 хв/міс free, ліміт 50 хв), Telegram voice → розпізнавання → команда/чат; /listen; ffmpeg-фолбек OGG→FLAC; live roundtrip OK.
- **Translate v3**: /translate <to> <text>, 480k симв/міс free; live-верифіковано uk→en.
- Voice-команди в браузері: wake-слова ева/єва/eva/адам, 20 фраз→команд.

## 5. Пам'ять vs Історія
- Пам'ять (постійне): knowledge-base (1086 FTS chunks, Chroma 1075), Memory KB 178 docs, data/products.json (23), компанія-досьє.
- Історія (звернення): SQLite FTS5 data/chat-history.db — усі чати (web/CLI/telegram/consilium) персистяться, /search повнотекстовий, /history [N].
- OpLog: ring 1000 + data/operations.jsonl (ротация 5MB), /log [N] [рівень|kind|текст].

## 6. Бухгалтерія
- /cost → CAPITAL INVESTMENTS: сервер $300 ($10/день), підписки $100, API-токени $100, Pixel 10 Pro XL $1000. Разом $1500.

## 7. Документація
- Quartz 5 портал (48+ файлів, Obsidian frontmatter, [[wikilinks]], 0 битих лінків, markdownlint), /docs/ назовні.
- docs/COMMANDS.md — повний довідник команд + додаток нових.
- Нові доки: CLOUD_TTS, CLOUD_STT, CLOUD_TRANSLATE, SECRETS_MANAGER, GEMINI_QUOTA_VERIFICATION, TELEGRAM_BOT, OPENCODE_EXTENSIONS+APPLIED, SEPHIROT_CONSILIUM, DESKTOP_AUDIT, MODEL_MONITOR.

## 8. Консиліум Сефірот
- 10 агентів Древа Жизні (Kether→Malkuth), Tetraxis-лупи, Adam=Tiferet/Eve=Hod персони, 3 раунди, /sephirot topic|status|tree.

## 9. Стійкість
- CircuitBreaker (google/omniroute/openrouter/hf/zai/groq/cerebras/cloudflare/mistral/opencode), фолбек-ланцюги, withTimeout 45с.
- Watchdog systemd (кожні 5 хв, авто-рестарт brain при 3 фейлах) + Restart=always override.
- Model Monitor: 10 джерел (LiteLLM DB 3818 моделей, OpenRouter 428, Groq/Cerebras/Zai, HF trending, Aider 158 рядків), топ-10 FREE/PAID для кодингу, таймер 12год.

## 10. opencode
- MCP додано: serena (21 tools), task-master-ai, codebase-memory; LSP: bash/yaml/dockerfile.
- omni-список синхронізовано з живим проксі (35).

## 11. Безпека
- Secret Manager: 12 секретів створено+верифіковано, демоція до 6 активних (free tier).
- Аудит: знайдено закоммічені ключі в історії git (AIza в 6 комітах, sk-or-v1 в 2, hf_ в 5) — рекомендація: ротація; PAT у remote URL — рекомендовано gh auth setup-git (не змінено без дозволу).
- /developer: пароль (тимчасово qwer1234), constant-time compare, маскування пароля в історії/логах.

## 12. UI
- Де-емодзі: 85 рядків → 0 у live-виводі (16 команд перевірено скриптом) + 0 у рендері браузера; stripEmoji захисний рендер, /emoji on|off.
- Паритет термінал/браузер: баннер байт-в-байт однаковий.
- Автодоповнення (навчальний словник), авто-виправлення описок, голосовий ввід.

## 13. Desktop
- Чистка виконана: 27.3MB → _archive/cleanup-2026-09-07 (нічого не видалено), evaline-com-ua дублікат верифіковано cmp-дифом.

## 14. Нагрузочний тест
- 10 одночасних консиліум-агентів + 10 паралельних стрімів: load 1.6-1.9 (без зростання), brain 0.3% mem → сервер тримає легко.

## 15. Pushes на GitHub (branch main)
- 9be39b1 → 4172816 → 7342a50 → be13dfd (+ цей звіт). Всі 25+ тест-сьютів проходять.

## ЗАЛИШИЛОСЬ (потрібні дії користувача)
1. TELEGRAM_BOT_TOKEN — створити бота в BotFather, додати в .env, перезапустити (модуль готовий).
2. HF токен вичерпано (402) — новий ключ або Pro.
3. Z.ai баланс, Cerebras payment — поповнення, якщо потрібні ці провайдери.
4. Custom Search JSON API: створити Programmable Search Engine (CX ID) у консолі — після цього /news+web-search стануть повними.
5. Ротація скомпрометованих в історії git ключів (AIza старий вже відкликаний; sk-or-v1/hf_ — рекомендовано перегенерувати).
6. EVADEV_PASSWORD=qwer1234 — тимчасовий; змінити на складний після налаштування.
7. sync-mcp — прогнати для розповсюдження MCP-змін на всі 5 середовищ агентів.

Back to [[index]]
