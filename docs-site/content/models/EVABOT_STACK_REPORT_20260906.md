---
title: "EVABOT STACK REPORT 20260906"
date: "2026-09-06"
tags: 
  - "models"
  - "stack"
  - "report"
description: "EvaBot — Отчёт по агентской экосистеме CLI и бесплатным LLM"
---

# EvaBot — Отчёт по агентской экосистеме CLI и бесплатным LLM

**Дата:** 2026-09-06 · **Сервер:** evabot-agent-vm (GCP europe-west3-a, c3-standard-8, Debian 13)
**Связка:** opencode · kilo/Kilo Code · agy (Antigravity 2.0) · omniroute (LiteLLM) · openrouter · huggingface · groq · cerebras · z.ai · cloudflare · mistral · together

---

## 1. CLI-инструменты (установка и статус)

| CLI | Версия | Свои free-LLM | Подключение к роутеру |
|---|---|---|---|
| opencode | 1.18.29 | Zen-каталог: ~7 free-моделей (`nemotron-3-ultra-free` 1M ctx, `mimo-v2.5-free`, `muse-spark-*-free`, `big-pickle`) | 9 провайдеров incl. omniroute/groq |
| agy (Antigravity CLI) | 1.1.27 | ✅ **да, топ**: Gemini 3.8/3.7/3.6 Flash, 3.1 Pro, Claude Sonnet 4.6, Opus 4.6 Thinking, GPT-OSS 120B (бесплатно через Google OAuth) | платформенный, кастом нельзя |
| kilo / **Kilo Code** | 7.5.14 | стартовые кредиты kilo.ai (капля) | ✅ omniroute: `kilocode`/`kilo-code` (глобально) + ярлык «Kilo Code (CLI)» + расширение v7.5.15 в code-server (Antigravity IDE :8080) |
| qwen (Qwen Code) | 0.23.0 (последняя) | ❌ **Qwen OAuth free ЗАКРЫТ 15.04.2026** | ✅ omniroute (`~/.qwen/settings.json`), тест `QWEN OK` |
| claude (Claude Code) | 2.1.263 | ❌ (только платная подписка) | через `omniroute launch`/`setup-claude` (не настроено) |
| omniroute | 3.8.50 | — сам роутер (LiteLLM :20128, 103 модели) | — |

**Gemini CLI: ЗАКРЫТ 18.06.2026** (consumer-auth отключён; официальная замена — Antigravity CLI `agy`, уже установлен). Enterprise/API-key — исключение. Не устанавливать.

**Не ставим (дубли):** Crush, Goose, Continue, Cline, Roo, Codex, Aider — те же модели через общий роутер; ставить только ради специфичного UX.

## 2. Топ бесплатных моделей для кодинга (консенсус, полный отчёт: FREE_MODEL_EVAL_REPORT_20260906.md)

| # | Модель | Балл | Латентность | Роль |
|---|---|---|---|---|
| 1 | groq/gpt-oss-120b | 5/5 | 3.2s | рабочая лошадка |
| 2 | groq/qwen3.8-27b | 5/5 | 1.0s | быстрые задачи |
| 3 | agy/gemini-3.1-pro | 5/5 | 60s | самый умный |
| 4 | agy/claude-sonnet-4.6 | 5/5 | 43s | тяжёлый дебаг |
| 5 | or/minimax-m3:free | 5/5 | 9.8s | 1M контекста (429-пул) |
| 6-9 | cf/nemotron-3-120b, cf/mistral-small-3.1, agy/gemini-3.8-flash, or/nemotron-3-super:free | 5/5 | 21-31s | резервы |
| 10 | mistral/codestral | 4/5 | 5.9s | FIM-специалист (2 RPM) |

## 3. Критические нюансы конфигурации

- **Groq free: TPM 8000** — системные промпты TUI-агентов (~19K токенов у qwen) НЕ проходят через groq-модели → дефолт для qwen/kilo = `omni/zai-glm-4.7-flash` (без TPM-лимита)

- **zai/glm-4.7-flash**: включать `thinking: disabled` (иначе verbose-рассуждения съедают бюджет токенов и режут код)

- **OpenRouter free-модели**: upstream 429 (общий пул) — норма; retry через 5-10с

- **Mistral free (Experiment)**: 2 RPM — для чата непригоден, только редкие вызовы; codestral/mistral-code/ministral-8b работают

- **Cerebras**: ожидает активации плана в Billing (Payment required)

- **Together**: кредиты исчерпаны → платный

- **HF: РАБОТАЕТ.** «Отозванный токен» был ложной тревогой: (1) временный 401-сбой HF ~12:24, (2) параллельный агент закомментировал hf-блок и подменил токен плейсхолдером в omniroute.env. Токен ротирован на новый (vault: HF_TOKEN), все 19 hf-моделей протестированы ✅

- ⚠️ **Имена hf-моделей: `hf/*` БЕЗ префикса `omni/`** (hf/glm-5.3-flash, hf/kimi-k3...) — обращения вида `omni/hf-*` дают 400 Invalid model name

- ⚠️ **Мульти-агентный конфликт**: на сервере параллельно работают ещё минимум 2 агентские сессии (opencode pts/6, agy pts/7 с --dangerously-skip-permissions), которые редактируют /opt/omniroute/config.yaml и omniroute.env. Перед правками сверять mtime и состояние hf-блока

- **inkling:free / leanstral**: 403 — закрыты для free-аккаунтов

- **GitHub Models**: retirement brownout — проект закрывается, PAT оставлен в vault для github-MCP

## 4. Ключи и безопасность

- **Vault**: `~/.secrets/keys.env` (600) — единый источник: GEMINI_API_KEY, OPENROUTER_API_KEY, LITELLM_MASTER_KEY, HF_TOKEN, GROQ_API_KEY, CEREBRAS_API_KEY, MISTRAL_API_KEY, ZAI_API_KEY, CLOUDFLARE_API_TOKEN/ACCOUNT_ID, GITHUB_PAT (+ заготовки: TOGETHER, NVIDIA)

- GPG cv25519-шифрование (key id 5C515AD8F47587EC284B066BF5337C72742B78D9)

- Бэкапы: локально `~/.secrets/backups/` (30 версий) + оффсайт `evaline-micro-vm:~/.secrets-backup/` (+ private-key.asc)

- Cron: ежедневно 03:17 (`backup-secrets.sh`), восстановление: `restore.sh` (проверено)

## 5. Артефакты

- `FREE_MODEL_EVAL_REPORT_20260906.md` — методика и результаты тестирования моделей

- `eval_final_20260906.json` / `eval_retest_20260906.json` / `eval_results_20260906.json` — данные

- `eval_models.py`, `eval_retest.py` — скрипты тестов

## Related

- [[models/FREE_MODEL_EVAL_REPORT_20260906|Free Model Eval]]

---

Back to [[index]]
