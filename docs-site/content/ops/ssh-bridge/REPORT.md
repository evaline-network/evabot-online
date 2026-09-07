---
title: "REPORT"
date: "2026-09-06"
tags: 
  - "ssh-bridge"
  - "ops"
  - "report"
description: "Отчёт: настройка evabot — SSH-мост, Google Cloud, opencode LSP/MCP"
---

# Отчёт: настройка evabot — SSH-мост, Google Cloud, opencode LSP/MCP

Дата формирования: 2026-09-06
VM: evabot-agent-vm (gcloud project `evabot-agent-server`, номер 873069440066)
Пользователь на VM: evabot

## 1. SSH-мост и физическое устройство

Скрипт-мост: `~/ssh-bridge/bridge.sh` (chmod +x). Состояние: `~/.ssh-bridge/state.json`.

- Текущий SSH-клиент (эта сессия): **100.102.22.45** → устройство **`macbook-air-2018`**
  - Tailscale: `evabot.online@`, статус **active**; прямая связь через реальный IP **46.211.35.184** (домашняя сеть), RTT ~98ms
  - rDNS: `macbook-air-2018.tail5e2476.ts.net`
  - ping: OK; открытые порты: 22 (SSH), 5173 (dev-сервер)
  - MAC: скрыта (трафик идёт через Tailscale overlay)

- VNC-клиент: 46.211.35.184 → порт 5900 (Xtigervnc) — тот же домашний адрес

- OS клиента по Tailscale: linux (MacBook Air 2018)

- Прямой SSH VM→клиент: не настроен (нет ключа на клиенте) → нужен обратный туннель:

  ```text
  # НА КЛИЕНТЕ (macbook-air-2018):
  ssh -o ServerAliveInterval=60 -N -R 8022:localhost:22 evabot@100.66.98.4
  # ПОТОМ НА VM:
  ssh -p 8022 evabot@localhost
  ```

### Tailscale-инвентарь (evabot.online@)

| IP | Устройство | ОС | Статус |
|---|---|---|---|
| 100.66.98.4 | evabot-agent-vm | linux | online (эта VM) |
| 100.102.22.45 | macbook-air-2018 | linux | active (клиент) |
| 100.125.200.49 | evaline-micro-vm | linux | online |
| 100.127.10.65 | debian | linux | offline 30d |
| 100.126.165.5 | oppo-a5-pro-5g | android | offline 3d |
| 100.80.216.27 | pixel-10-pro-xl | android | offline 1d |

## 2. Google Cloud

- Аккаунт: **<evabot.online@gmail.com>** (active), сервисный 873069440066-compute@...

- Проект: `evabot-agent-server`, номер 873069440066

- Включены API (включено вручную сегодня): Gmail, Calendar, Sheets, Drive, Custom Search (+ cloudapis, serviceusage)

### API-ключи

- Найден 1 ключ: `gemini-api-first` (uid 5f3d721d-8e11-4472-840f-1b4a30be1231)
  - keyString: ``[REDACTED-GCP-KEY — хранить только в env]``
  - ограничение: только `generativelanguage.googleapis.com` (Gemini) — уже зарестрейнено

- В конфиге opencode лежит ДРУГОЙ ключ: `[REDACTED-API-KEY]` — lookup в apikeys API → **не найден** (возможно, ключ из другого проекта/аккаунта или удалён). Проверить принадлежность!

- Баннер Google "unrestricted API keys / Gemini" — вероятно, касается ключа AIza... либо исчезнет через 24ч после фикса

### OAuth для google-MCP

- Нужен OAuth Client ID (Web application) — создать вручную в консоли:
  <https://console.cloud.google.com/apis/credentials?project=evabot-agent-server>

- Redirect URIs (порты в конфиге):
  - <http://localhost:3000/auth/callback> (calendar)
  - <http://localhost:3001/callback> (gmail)
  - <http://localhost:3002/callback> (sheets)
  - <http://localhost:3003/callback> (drive)

- OAuth consent screen: требуется настроить один раз + добавить <evabot.online@gmail.com> в Test users

## 3. opencode (v1.18.29)

Конфиг: `~/.config/opencode/opencode.json`

- **AUTH**: `opencode auth list` → **0 credentials**; auth.json отсутствует. opencode НЕ подключён к аккаунту через OAuth (используется provider.google.options.apiKey)

- **LSP**: включён; добавлены html (vscode-html-language-server) и markdown (marksman)
  - Установлено/работает: typescript (tls 6.0.0, tsc 5.9.3), pyright 1.1.413, eslint 10.10.0+typescript-eslint (нашёл 6 реальных ошибок в evabot-backend/src/server/server.ts)
  - vue/svelte/astro: не нужны (в проектах нет фреймворков)

- **MCP**: включены 15 серверов (filesystem, git, github, fetch, memory, sequential-thinking, sqlite, context7, markdownlint, chrome-devtools, docker, google-cloud, gmail, google-calendar, google-sheets, google-drive, google-maps, google-search, firebase, notebooklm)
  - У google-серверов и firebase пустые ключи → активация готова, но работать начнут после заполнения secret'ов
  - notebooklm: OAuth не нужен — одноразовый вход через инструмент `setup_auth` (Chrome)

## 4. ToDo / открытые вопросы

- [!] Создать OAuth Client ID + Secret в консоли и вписать в opencode.json

- [!] Проверить назначение ключа AIzaSyBmg... (возможно мусор/другой проект) — при желании сгенерировать новый ключ OpenAI-style через gcloud и заменить в `provider.google.options.apiKey`

- [!] Узнать username на macbook-air-2018 для двустороннего exec/console

- [ ] Настроить постоянный обратный туннель (autossh/systemd) на клиенте

## Related

- [[ops/ssh-bridge/BRIDGE_REPORT|Bridge Report]]

---

Back to [[index]]
