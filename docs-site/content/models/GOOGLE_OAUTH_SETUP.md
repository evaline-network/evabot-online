---
title: "GOOGLE OAUTH SETUP"
date: "2026-09-06"
tags: 
  - "oauth"
  - "google"
  - "setup"
description: "Шпаргалка: подключение Google-серверов к opencode"
---

# Шпаргалка: подключение Google-серверов к opencode

Проект в GCP (уже создан и активен): **evabot-agent-server**
Google-аккаунт: <evabot.online@gmail.com> (владелец проекта).

---

## 1. OAuth-серверы: Gmail, Календарь, Sheets, Drive

Эти MCP-серверы требуют **OAuth-клиент (Client ID + Secret)** — это нельзя сгенерировать автоматически, нужен один раз ваш вход в Google Cloud Console.

### Шаги (Google Cloud Console)

1. Откройте <https://console.cloud.google.com/apis/credentials> → выберите проект `evabot-agent-server`.

2. Включите нужные API (APIs & Services → Library → Enable):
   - Gmail API
   - Google Calendar API
   - Google Sheets API
   - Google Drive API

3. Настройте экран согласия (**OAuth consent screen**): External, заполните название приложения и support email, добавьте свой аккаунт в **Test users**.

4. **Credentials → Create credentials → OAuth client ID → Web application**.

5. В **Authorized redirect URIs** добавьте ВСЕ (соответствуют портам из конфига):
   - `<http://localhost:3001/callback`> (gmail)
   - `<http://localhost:3000/auth/callback`> (calendar)
   - `<http://localhost:3002/callback`> (sheets)
   - `<http://localhost:3003/callback`> (drive)

6. Сохраните **Client ID** и **Client Secret**.

### Применение

В `~/.config/opencode/opencode.json` для серверов `gmail`, `google-calendar`, `google-sheets`, `google-drive`:

```jsonc
"gmail": {
  "type": "local",
  "command": ["npx", "-y", "gmail-mcp@latest"],
  "enabled": true,
  "environment": {
    "GOOGLE_CLIENT_ID": "<ваш Client ID>",
    "GOOGLE_CLIENT_SECRET": "<ваш Client Secret>",
    "PORT": "3001"
  }
}
```

То же для остальных трёх (порты: calendar=3000, sheets=3002, drive=3003).

> Нюанс: в stdio-режиме серверы ждут `GOOGLE_ACCESS_TOKEN`. Полный OAuth-флоу (консент) каждым пакетом делается один раз при первом запуске; токены сохраняются локально. Если сервер просит токен — запустите его в режиме `MCP_TRANSPORT=http` один раз, пройдите консент, после чего верните stdio-конфиг.

### Разблокировка аккаунта

Первый консент с External-проектом: в Google приложение в режиме testing — только для Test users. Когда всё заработает, можно опубликовать приложение (Publish app).

---

## 2. Google Maps

Требует **API-ключ** (биллинг включён, ключ тарифицируется).

1. Console → Library → включить **Maps JavaScript API** и **Places API**.

2. Credentials → Create credentials → API key.

3. В конфиге:

```jsonc
"google-maps": {
  "type": "local",
  "command": ["npx", "-y", "@modelcontextprotocol/server-google-maps@latest"],
  "enabled": true,
  "environment": { "GOOGLE_MAPS_API_KEY": "<ваш ключ>" }
}
```

> Пакет `@modelcontextprotocol/server-google-maps` объявлен устаревшим (deprecated) — при желании замените на актуальный аналог.

---

## 3. Google Search (если понадобится снова)

Пакет `google-search-mcp` сломан (ESM-заявлен, код CommonJS) — не использовать.
Рабочая замена — `google-search-api-mcp` (поиск через Gemini API, ключ уже есть в `provider.google`):

```jsonc
"google-search": {
  "type": "local",
  "command": ["npx", "-y", "google-search-api-mcp"],
  "enabled": true,
  "environment": { "GEMINI_API_KEY": "[REDACTED-API-KEY]" }
}
```

---

## 4. Firebase (уже настроено, не нужно ничего)

- Сервис-аккаунт `firebase-mcp-sa` + ключ: `~/.config/firebase-mcp/firebase-service-account.json`

- Конфиг: `~/.config/firebase-mcp/firebase-mcp.json`

- Включены: Firestore API + identitytoolkit, создана БД Firestore (eur3), роли `datastore.user` + `firebaseauth.admin`.

---

## После любых правок

1. `python3 -m json.tool ~/.config/opencode/opencode.json` — проверить JSON.

2. **Перезапустить opencode** (конфиг читается при старте).

3. Проверка статуса: `~/.local/share/opencode/log/opencode.log` → строки `server unavailable`.

## Related

- [[models/EVABOT_STACK_REPORT_20260906|EvaBot Stack Report]]

---

Back to [[index]]
