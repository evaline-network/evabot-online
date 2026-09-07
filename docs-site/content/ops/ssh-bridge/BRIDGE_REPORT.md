---
title: "BRIDGE REPORT"
date: "2026-09-06"
tags: 
  - "ssh-bridge"
  - "ops"
  - "report"
description: "Отчёт: двусторонний SSH-мост VM ↔ ноутбук"
---

# Отчёт: двусторонний SSH-мост VM ↔ ноутбук

Дата: 2026-09-06
Сетевой стек: Google Cloud VM `evabot-agent-vm` ↔ ноутбук `macbook-air-2018` через Tailscale

## Устройства

| Роль | Tailscale IP | Имя | ОС | Логин |
|---|---|---|---|---|
| VM (opencode) | 100.66.98.4 | evabot-agent-vm | (GCP Linux) | evabot |
| Клиент | 100.102.22.45 | macbook-air-2018 | Fedora 7.1.9 (kernel t2.fc44) | fedor |

Домашний IP клиента: 46.211.35.184. rDNS: macbook-air-2018.tail5e2476.ts.net. Открытые порты: 22 (SSH), 5173 (dev-сервер).

## Скрипты (на VM: ~/ssh-bridge/)

- `bridge.sh` — детект клиентов, identify, инвентарь, exec/push/console, построение моста

- `tunnel.sh` — обратный SSH-туннель (запускается на ноутбуке); поддерживает автозапуск через systemd (`install-elevated`)

## Ключи

| Направление | Ключ | Где лежит |
|---|---|---|
| VM → клиент | `~/.ssh/ts_key` (pubkey добавлен в authorized_keys на ноутбуке) | обе машины |
| клиент → VM | `~/.ssh/vm_tunnel` (pubkey добавлен в ~/.ssh/authorized_keys на VM) | ноутбук |

## Туннель (запущен в фоне с ноутбука)

- Команда: `TUNNEL_VM_PORT=8222 TUNNEL_SSH_KEY=/home/fedor/.ssh/vm_tunnel ~/ssh-bridge/tunnel.sh run`

- Порт на VM: 127.0.0.1:8222 → SSH ноутбука (localhost:22)

- Автопереподключение: встроено в tunnel.sh (ServerAliveInterval 60, цикл sleep 5)

- Процесс: запущен через `setsid nohup ... &` (pid на ноутбуке виден как `tunnel.sh run`)

## Проверено (всё OK, RC=0)

1. VM → ноутбук прямой (Tailscale): `ssh -i ~/.ssh/ts_key fedor@100.102.22.45 "hostname; uname -sr"`
   → `macbook-air-2018 / Linux 7.1.9-200.t2.fc44.x86_64`

2. VM → ноутбук через туннель: `ssh -p 8222 -i ~/.ssh/ts_key fedor@localhost` → OK

3. ноутбук → VM: `ssh -i ~/.ssh/vm_tunnel evabot@100.66.98.4 "hostname"` → `evabot-agent-vm`

4. `bridge.sh bridge 100.102.22.45 fedor` → "OK: прямой SSH VM->клиент работает"

5. `bridge.sh exec 100.102.22.45 fedor "uname -sr"` → `Linux 7.1.9-200.t2.fc44.x86_64`

## Полезные команды (с VM)

- Выполнить на ноутбуке: `~/ssh-bridge/bridge.sh exec 100.102.22.45 fedor "<cmd>"`

- Интерактив на ноутбук: `~/ssh-bridge/bridge.sh console 100.102.22.45 fedor`

- Скопировать файл: `~/ssh-bridge/bridge.sh push 100.102.22.45 fedor <src> <dst>`

- Через туннель напрямую: `ssh -p 8222 fedor@localhost`

## На ноутбуке (для автозапуска туннеля)

```text
sudo ./ssh-bridge/tunnel.sh install-elevated
```

(ключ уже задаётся переменными TUNNEL_SSH_KEY/TUNNEL_VM_PORT, прописать при желании в systemd-юнит)

## Сопутствующее (ранее в этом отчёте)

- gcloud: аккаунт <evabot.online@gmail.com>, проект evabot-agent-server; включены API Gmail/Calendar/Sheets/Drive/CustomSearch

- API-ключ gemini-api-first ограничен generativelanguage.googleapis.com; ключ AIzaSy... из opencode.json в apikeys API не найден — проверить принадлежность

- OAuth Client ID для MCP: требует создания в консоли (redirect URIs localhost:3000/3001/3002/3003)

- opencode: LSP (typescript/pyright/eslint/html/markdown) и 15 MCP-серверов настроены; auth 0 credentials − OAuth-вход не выполнен

## Related

- [[ops/ssh-bridge/REPORT|SSH Bridge Report]]

---

Back to [[index]]
