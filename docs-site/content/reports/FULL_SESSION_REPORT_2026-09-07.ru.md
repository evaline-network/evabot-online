---
title: Полный отчёт сессии 2026-09-07 — EvaBot Global Upgrade
date: 2026-09-07
tags: [report, session, evabot, google-cloud, voice, commands, ru]
aliases: [FULL_SESSION_REPORT_RU]
description: "Полный отчёт: 40+ выполненных задач — инфраструктура, команды, голос, Google Cloud free-tier, безопасность"
---

# Полный отчёт сессии — 2026-09-07 (вечер/ночь)

## 1. Инфраструктура и диагностика
- Обе VM RUNNING: evabot-agent-vm (europe-west3-a, c3-standard-8), evaline-micro-vm (us-central1-a, e2-micro). Диск 46%, RAM 10/31Gi.
- Сервисы: evabot-brain (:3000), omniroute (LiteLLM :20128), **evabot-voice (:8000 — новый systemd-юнит, FastAPI)**, nginx, n8n (docker), code-server, watchdog-таймер, model-monitor-таймер.
- evabot.online → 200; /docs/ → 200 (Caddy micro-VM → nginx compute-VM → Quartz build).

## 2. Бесплатные модели — диагноз + ремонт
- **HF** — месячные кредиты исчерпаны (402) → путь: новый ключ или Pro. Убрано из OmniRoute.
- **Z.ai** — модель glm-4.7-flash удалена провайдером; баланс ключа пуст → отключено, конфиг обновлён.
- **OpenRouter** — 30+ старых `:free` слагов сняты с раздачи; актуальный список (15-16) получен живым API.
- **Groq/Cerebras** — llama-3.3-70b удалена у Groq; Cerebras: payment required → убрано.
- **OmniRoute rebuild**: 156 → 35 записей, каждая прожита live-смок-тестом (финал: 35 моделей, gemma/rate-limit идентифицированы).
- **Gemini**: найден и исправлен ПЛАТНЫЙ трафик через Vertex AI → переведён на generativelanguage free-tier API-ключ ($0, live-верифицировано, метрика generate_content_free_tier_requests). Vertex только при EVA_VERTEX_ENABLED=1.
- **Google AI Pro НЕ влияет на API-квоты** — это лишь подписка на приложения (NotebookLM, Code Assist и т.д.). Документ: docs/models/GEMINI_QUOTA_VERIFICATION.md.

## 3. Команды (28, с трёхъязычными алиасами EN/UK/RU)
- Новые серверные: /history /memory /search /find /services /servers /products /who /news /health /sephirot /sys /debug /log /monitor /voices /settings /agents /developer /translate /say /listen /cost+
- Локальные: /autocorrect /voice eva|adam /tts /emoji /lang /clear
- Системная осведомлённость: SYSTEM_CONTEXT инжектится в каждый промпт → бот правильно отвечает «какая модель подключена» (live-проверка: gemini-3.8-flash, evabot-agent-vm, Франкфурт).
- Тест: 17/17 команд живы через API.

## 4. Голос (Google Cloud, только free)
- **Cloud TTS**: Ева = uk-UA-Chirp3-HD-Aoede (женский), Адам = ru-RU-Chirp3-HD-Fenrir (мужской) — Chirp3-HD 1M симв/мес free; лимит 900k с отказом ДО запроса; кеш в data/tts-cache; /api/tts + /api/tts/status; браузер играет серверный звук, fallback — browser TTS.
- **Cloud STT**: v1 latest_long (60 мин/мес free, лимит 50 мин), Telegram voice → распознавание → команда/чат; /listen; ffmpeg-фолбек OGG→FLAC; live roundtrip OK.
- **Translate v3**: /translate <to> <text>, 480k симв/мес free; live-верифицировано uk→en.
- Voice-команды в браузере: wake-слова ева/єва/eva/адам, 20 фраз→команд.

## 5. Память vs История
- Память (постоянное): knowledge-base (1086 FTS chunks, Chroma 1075), Memory KB 178 docs, data/products.json (23), досье компании.
- История (обращение): SQLite FTS5 data/chat-history.db — все чаты (web/CLI/telegram/consilium) персистятся, /search полнотекстовый, /history [N].
- OpLog: ring 1000 + data/operations.jsonl (ротация 5MB), /log [N] [уровень|kind|текст].

## 6. Бухгалтерия
- /cost → CAPITAL INVESTMENTS: сервер $300 ($10/день), подписки $100, API-токены $100, Pixel 10 Pro XL $1000. Итого $1500.

## 7. Документация
- Quartz 5 портал (48+ файлов, Obsidian frontmatter, [[wikilinks]], 0 битых ссылок, markdownlint), /docs/ наружу.
- docs/COMMANDS.md — полный справочник команд + дополнение новых.
- Новые доки: CLOUD_TTS, CLOUD_STT, CLOUD_TRANSLATE, SECRETS_MANAGER, GEMINI_QUOTA_VERIFICATION, TELEGRAM_BOT, OPENCODE_EXTENSIONS+APPLIED, SEPHIROT_CONSILIUM, DESKTOP_AUDIT, MODEL_MONITOR.

## 8. Консиліум Сефирот
- 10 агентов Древа Жизни (Kether→Malkuth), Tetraxis-петли, Adam=Tiferet/Eve=Hod персоны, 3 раунда, /sephirot topic|status|tree.

## 9. Устойчивость
- CircuitBreaker (google/omniroute/openrouter/hf/zai/groq/cerebras/cloudflare/mistral/opencode), фолбэк-цепочки, withTimeout 45с.
- Watchdog systemd (каждые 5 мин, авто-рестарт brain при 3 фейлах) + Restart=always override.
- Model Monitor: 10 источников (LiteLLM DB 3818 моделей, OpenRouter 428, Groq/Cerebras/Zai, HF trending, Aider 158 строк), топ-10 FREE/PAID для кодинга, таймер 12ч.

## 10. opencode
- MCP добавлено: serena (21 tools), task-master-ai, codebase-memory; LSP: bash/yaml/dockerfile.
- omni-список синхронизирован с живым прокси (35).

## 11. Безопасность
- Secret Manager: 12 секретов создано+верифицировано, демоция до 6 активных (free tier).
- Аудит: найдены закоммиченные ключи в истории git (AIza в 6 коммитах, sk-or-v1 в 2, hf_ в 5) — рекомендация: ротация; PAT в remote URL — рекомендовано gh auth setup-git (не изменено без разрешения).
- /developer: пароль (временно qwer1234), constant-time compare, маскирование пароля в истории/логах.

## 12. UI
- Де-эмодзи: 85 строк → 0 в live-выводе (16 команд проверено скриптом) + 0 в рендере браузера; stripEmoji защитный рендер, /emoji on|off.
- Паритет терминал/браузер: баннер байт-в-байт одинаковый.
- Автодополнение (обучающийся словарь), авто-исправление опечаток, голосовой ввод.

## 13. Desktop
- Чистка выполнена: 27.3MB → _archive/cleanup-2026-09-07 (ничего не удалено), дубликат evaline-com-ua верифицирован cmp-дифом.

## 14. Нагрузочный тест
- 10 одновременных консилиум-агентов + 10 параллельных стримов: load 1.6-1.9 (без роста), brain 0.3% mem → сервер держит легко.

## 15. Pushes на GitHub (ветка main)
- 9be39b1 → 4172816 → 7342a50 → be13dfd → 4ecd65b (+ этот отчёт). Все 25+ тест-сьютов проходят.

## ОСТАЛОСЬ (нужны действия пользователя)
1. TELEGRAM_BOT_TOKEN — создать бота в BotFather, добавить в .env, перезапустить (модуль готов).
2. HF токен исчерпан (402) — новый ключ или Pro.
3. Z.ai баланс, Cerebras payment — пополнение, если нужны эти провайдеры.
4. Custom Search JSON API: создать Programmable Search Engine (CX ID) в консоли — после этого /news+web-search станут полными.
5. Ротация скомпрометированных в истории git ключей (старый AIza уже отозван; sk-or-v1/hf_ — рекомендовано перегенерировать).
6. EVADEV_PASSWORD=qwer1234 — временный; сменить на сложный после настройки.
7. sync-mcp — прогнать для распространения MCP-изменений на все 5 сред агентов.

Смотрите также: [[FULL_SESSION_REPORT_2026-09-07.en]] · [[FULL_SESSION_REPORT_2026-09-07.uk]] · Back to [[index]]
