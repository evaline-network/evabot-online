---
title: "KANBAN desktop"
date: "2026-09-06"
tags: 
  - "kanban"
  - "desktop"
  - "antigravity"
description: "📋 Antigravity 2.0 — Project Kanban Board"
---

# 📋 Antigravity 2.0 — Project Kanban Board

**Last Updated:** September 6, 2026
**Host:** `EvaBrain` (evabot-agent-vm, europe-west3-a, c3-standard-8, 8 vCPU) · `EvaFace` (evaline-micro-vm, us-central1-a, e2-micro)
**GCP Project:** `evabot-agent-server` · Account: `<evabot.online@gmail.com>`

---

## 🔴 To Do / Backlog

- [x] **TASK-01:** Аудит среды EvaFace (`evaline-micro-vm`):
  - SSH доступ по ключам восстановлен и проверен (`evabot@100.125.200.49`).
  - Сервер: Debian GNU/Linux 13 (trixie), e2-micro, Caddy 2.11, Tailscale 100.125.200.49.

- [ ] **TASK-02:** Единый шрифт системы — JetBrains Mono (моно, один размер):
  - XFCE / GTK / xfce4-terminal / code-server / браузер.
  - Установить шрифт JetBrains Mono (сейчас в системе его нет).

- [ ] **TASK-03:** Персистентность терминалов и сессий (не закрываться при рестарте VNC):
  - Перенести задачи в tmux-сессии (`tmux new -s`, автоприкрепление).
  - Автостарт `xfce4-terminal -- tmux attach` через `~/.config/autostart/terminals.desktop`.

## 🟡 In Progress / Under Execution

- [ ] **TASK-04:** VNC: «реальный» десктоп вместо виртуальной сессии:
  - Это headless VM — физического экрана нет, десктоп может жить только в X.
  - Вариант A: продолжить использовать TigerVNC `:1` как основной десктоп сервера.
  - Вариант B: `Xorg :0` + `lightdm` greeter + `x11vnc` для просмотра display :0.

- [ ] **TASK-05:** Единый Kanban процессов:
  - Синхронизировать задачи с `/home/evabot/Desktop/evabot-online/KANBAN.md`.
  - Обновлять `KANBAN.md` при каждом изменении статуса.

## 🟢 Done / Completed

- [x] **TASK-06:** Аудит сервера EvaBrain (`evabot-agent-vm`):
  - Сервисы: `antigravity-daemon` (порт 9090), `evabot-brain` (3000), `omniroute` LiteLLM (20128), code-server (8080), nginx, docker+`n8n` (5678), tailscale, VNC (5901).
  - SDK: Python 3.13.5, Node 22.23.2, глобальные npm: pyright, typescript, TS-language-server, marksman, vscode-langservers.
  - Агенты/CLI: `/usr/bin/claude`, `/usr/local/bin/opencode`, `/usr/local/bin/qwen-code`, `/usr/local/bin/omnicode`, `evabot-cli`.

- [x] **TASK-07:** Найден существующий Kanban: `/home/evabot/Desktop/evabot-online/KANBAN.md` (формат — образец).

- [x] **TASK-08:** Нативная интеграция Google Vertex AI в `GeminiClient` и живая генерация чата:
  - Реализован роутинг на нативный Vertex AI REST API (`europe-west3-aiplatform.googleapis.com`) при наличии Bearer токена ADC (`<evabot.online@gmail.com>`).
  - Поддержаны оба режима генерации: унарный `generateContent` и потоковый SSE `streamGenerateContent?alt=sse`.
  - Устранены ошибки 401/400: боевой эндпоинт `/api/chat` возвращает HTTP 200 OK с реальными ответами модели.

- [x] **TASK-09:** Оптимизация и устранение перегрузки памяти на EvaFace (`evaline-micro-vm`):
  - Отключены фоновые процессы (`conky` вычищен из autostart, службы остановлены).
  - Сформирован и применен startup-script с инжекцией SSH-ключей и оптимизацией ресурсов.

- [x] **TASK-10:** Роутинг доменов, устранение 404 (`evaline.online`) и Graceful Fallback на EvaFace:
  - Caddy развернут и настроен для обслуживания 3 доменов: `evabot.online`, `evaline.network`, `evaline.online`.
  - Устранены 404: каждый домен отдает уникальный кибер-терминальный TUI HTML+JS статус-лендинг с live telemetry.
  - Проксирование `/api/*` (включая `/api/health`) направлено на EvaBrain (`100.66.98.4:3000`) через шифрованный Tailscale mesh.
  - Все эндпоинты возвращают HTTP/2 200 OK.

- [x] **TASK-11:** Защита сетевого периметра EvaBrain:
  - Порты 3000 (`evabot-brain`) и 20128 (`omniroute`) закрыты от публичного интернета через iptables.
  - Разрешен доступ строго через `tailscale0` (включая `EvaFace` 100.125.200.49), Tailscale IP (`100.66.98.4`) и локально (`127.0.0.1` / loopback).
  - Установлен `iptables-persistent` / `netfilter-persistent`, правила сохранены в `/etc/iptables/rules.v4` и проверены.

- [x] **TASK-12:** Включение моделей линейки Gemini 3.x в `ModelRegistry.ts` и OmniRoute:
  - Зарегистрированы `gemini-3.8-flash` и `gemini-3.1-pro` с точными лимитами токенов (1M/2M) и строгой тарификацией USD ($) и EUR (€).
  - Модели включены в кластер `omniroute/gemini-3.8-flash` и `omniroute/gemini-3.1-pro`.

- [x] **TASK-13:** Подключение и запуск домена `evaline.website`:
  - Настроен DNS A-запись на `136.114.26.252`.
  - Развернут кибер-TUI лендинг `/var/www/evaline.website/index.html`.
  - В Caddyfile добавлен блок для `evaline.website` и `www.evaline.website` с автоматическим TLS 1.3 Let's Encrypt и reverse-proxy `/api/*`.

- [x] **TASK-14:** Синхронизированный построчный лог и хроника `WORKLOG.md`:
  - Создан мастер-лог `WORKLOG.md` (начиная с 1 августа 2026 г. по текущий момент).
  - Настроены эндпоинты: `https://<domain>/worklog.md` (raw), `/api/worklog` (JSON API) и `/api/worklog/raw` с поддержкой CORS.
  - Синхронизирован между `EvaBrain` и всеми веб-директориями `EvaFace`.

- [x] **TASK-15:** Фикс недоступности сайтов (QUIC/IP/SNI):
  - Разрешен трафик HTTP/3 (QUIC / `udp:443`) в GCP Cloud Firewall (`default-allow-http3`).
  - В Caddy добавлен глобальный `default_sni evabot.online` и обработчик прямого IP `136.114.26.252`.

- [x] **TASK-16:** Разделение специализаций 4 доменов и сквозная TUI-навигация:
  - Ликвидировано дублирование контента между доменами.
  - На всех сайтах внедрен сквозной терминальный навигационный бар (`EVALINE ECOSYSTEM MESH`) с подсветкой активного узла.

- [x] **TASK-17:** Построчный лог событий (1 строка = 1 событие) в форматах TSV, LOG, TXT:
  - Реализован строгий формат хроники «1 строка = 1 событие» с 1 августа 2026 г. (всего 66 событий).
  - Сгенерированы и синхронизированы файлы `worklog.tsv`, `worklog.log`, `worklog.txt`.

- [x] **TASK-18:** Минималистичный живой текстовый интерфейс на основе Markdown-HTML:
  - Убраны лишние декоративные элементы, тяжелые рамки и перегруженные стили со всех сайтов.

- [x] **TASK-19:** Режим NOCSS по умолчанию с выключателем и терминальными линейными элементами:
  - Интерфейс по умолчанию загружается без CSS (100% чистый терминальный линейный текст в `<pre>` и блоках).
  - В шапку каждого сайта добавлен тумблер `[ РЕЖИМ: NOCSS ВКЛЮЧЕН — Нажмите для включения CSS ]`.

- [x] **TASK-20:** Резиновая адаптивность интерфейса (Fluid Responsive) под любую ширину:
  - Ликвидировано появление горизонтального скролла на смартфонах и узких экранах.

- [x] **TASK-21:** Полноэкранный 100% Full-Width интерфейс с живыми аппаратными метриками и анимациями:
  - Сняты любые искусственные ограничения ширины (`max-width: 100%`, `width: 100%`). Интерфейс занимает всю полезную площадь экрана на любых дисплеях (от мобильных до 4K UltraWide).
  - Добавлены живые аппаратные ASCII-индикаторы с автообновлением: CPU Load bar (`[■■■□□□□□□□]`), RAM EvaBrain (DDR5) и EvaFace, сетевая задержка туннеля WireGuard (RTT мс), счетчик переданных пакетов, таймер аптайма ядра (`00:00:00`).
  - Добавлены терминальные анимации: пульсирующий неоновый индикатор активности `● LIVE`, вращающийся спиннер запросов (`⠋ ⠙ ⠹`), автоматическое заполнение шкал метрик в реальном времени.

---

## 📊 Task Matrix & Status

| Task ID | Component | Priority | Status |
| :--- | :--- | :--- | :--- |
| **TASK-01** | Аудит EvaFace (`evaline-micro-vm`) | P1 (High) | 🟢 Done |
| **TASK-02** | Единый шрифт JetBrains Mono | P2 (Medium) | 🔴 Backlog |
| **TASK-03** | Персистентность терминалов (tmux) | P1 (High) | 🔴 Backlog |
| **TASK-04** | VNC: реальный десктоп (x11vnc vs TigerVNC) | P2 (Medium) | 🟡 In Progress |
| **TASK-05** | Синхронизация Kanban-задач | P3 (Low) | 🟡 In Progress |
| **TASK-06** | Аудит EvaBrain (`evabot-agent-vm`) | P0 (Critical) | 🟢 Done |
| **TASK-07** | Найден эталонный KANBAN.md | P3 (Low) | 🟢 Done |
| **TASK-08** | Vertex AI в `GeminiClient` и живой чат | P0 (Critical) | 🟢 Done |
| **TASK-09** | Оптимизация RAM на EvaFace | P1 (High) | 🟢 Done |
| **TASK-10** | Caddy роутинг доменов, 404 & Fallback | P1 (High) | 🟢 Done |
| **TASK-11** | Защита сетевого периметра EvaBrain | P1 (High) | 🟢 Done |
| **TASK-12** | Поддержка моделей Gemini 3.x | P2 (Medium) | 🟢 Done |
| **TASK-13** | Подключение `evaline.website` | P1 (High) | 🟢 Done |
| **TASK-14** | Синхронизация `WORKLOG.md` & API | P1 (High) | 🟢 Done |
| **TASK-15** | Фикс недоступности сайтов (QUIC/IP/SNI) | P0 (Critical) | 🟢 Done |
| **TASK-16** | Разделение специализаций & Mesh-навигация | P1 (High) | 🟢 Done |
| **TASK-17** | Строгий построчный лог (TSV / LOG / TXT) | P1 (High) | 🟢 Done |
| **TASK-18** | Живой Markdown-HTML интерфейс | P1 (High) | 🟢 Done |
| **TASK-19** | Режим NOCSS с выключателем и TUI элементами | P1 (High) | 🟢 Done |
| **TASK-20** | Резиновая адаптивность под ширину экрана | P1 (High) | 🟢 Done |
| **TASK-21** | 100% Full-Width, живые метрики и анимации | P1 (High) | 🟢 Done |

## Related

- [[dev/KANBAN|Kanban (repo)]]

---

Back to [[index]]
