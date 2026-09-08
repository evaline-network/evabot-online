---
title: EvaBot Command Reference
date: 2026-09-07
tags:
  - commands
  - reference
description: Повний реєстр команд EvaBot (веб-термінал, CLI, серверний реєстр) — синтаксис, аліаси EN/UK/RU, опції, голосові команди, гарячі клавіші та карта взаємодій.
---

<!-- markdownlint-disable MD013 MD025 MD060 -->

# EvaBot — Довідник команд (COMMANDS.md)

> Джерело істини: `src/models/ModelRatings.ts` (ModelCommand, COMMAND_ALIASES), `src/core/I18nEngine.ts`,
> `public/index.html` (handleCommand, SmartInput, VoiceEngine), `src/cli/terminal-chat.ts`,
> `src/server/routes/ModelsRouter.ts`. Жодна команда не додана «з голови» — кожна перевірена по коду.

## 1. Огляд: як працює командний рушій

EvaBot має **три шляхи виконання команд**, і вони не дублюють, а доповнюють одне одного:

| Шлях | Точка входу | Рушій | Примітка |
|---|---|---|---|
| **Web** (<https://evabot.online>) | `public/index.html` → `handleCommand()` | Локальний перехоплювач + делегування `POST /api/models/command` | См. § 2.2 |
| **CLI** (термінал) | `src/cli/terminal-chat.ts` → REPL `switch` | Локальні CLI-команди + `ModelCommand.execute(input)` | См. § 2.3 |
| **API** (довільний клієнт) | `POST /api/models/command` `{ "command": "/top free" }` | `ModelCommand.execute()` | `ModelsRouter.ts:62` |

**Нормалізація команд** — `normalizeCommand()` (`ModelRatings.ts:419`):

1. `trim()` + `toLowerCase()`.
2. Апострофи/лапки канонізуються: **`'` ´ ʼ ’ → `'`** (регекс `/['`´ʼ’']/g`) — тобто`/пам’ять`,`/пам'ять`,`/пам´ять` — одна й та сама команда.
3. Перший токен (head) резолвиться через `COMMAND_ALIASES`; аргументи (rest) зберігаються після канонічного head.
4. Невідома команда → `[ERROR] Unknown command: ...` зі списком валідних команд.

Приклади нормалізації: `/ІСТОРІЯ` → `/history`; `/пошук модели` → `/search модели`; `/Здоров'я` → `/health`.

**Мови:** усі довідкові виводи (`/help`) мають три локалі (en/uk/ru) в `I18nEngine`; аліаси UK/RU приймаються незалежно від активної мови. Вихідні тексти більшості server-команд (історія, пошук, фінанси) поки що російськомовні — це видно в коді, наведено як є.

**Веб-делегування** (`handleCommand`, `index.html:1462`): локально перехоплюються `/lang`, `/clear`, `/help`, `/history` (без аргументів), `/autocorrect`, `/voice`, `/tts`, `/mode`, `/consilium`; **все інше, що починається з `/`**, надсилається на сервер через `POST /api/models/command` → `ModelCommand.execute()`.
