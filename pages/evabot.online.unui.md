---
domain: evabot.online
badge: NEURAL CORE
role: AI Вычислительное Ядро, Оркестрация Агентов & Мульти-LLM Консилиум
infra: evabot-agent-vm · 8 vCPU Intel Xeon Sapphire Rapids · 32 GB RAM · Франкфурт (ФРГ) · IP: 34.159.202.82
target: Координация агентов, консилиум 78 моделей, векторная память и TUI-сервер.
theme: dark
---

┌── EVALINE CONSOLE // evabot.online [NEURAL CORE] ── ● LIVE ── [◐ ТЕМА] ──┐
│                                                                          │
> УЗЕЛ         : evabot.online [NEURAL CORE]
> РОЛЬ         : AI Вычислительное Ядро, Оркестрация Агентов & Мульти-LLM Консилиум
> ИНФРА        : evabot-agent-vm · 8 vCPU Intel Xeon Sapphire Rapids · 32 GB RAM · Франкфурт (ФРГ) · IP: 34.159.202.82
> НАЗНАЧЕНИЕ   : Координация агентов, консилиум 78 моделей, векторная память и TUI-сервер.
────────────────────────────────────────────────────────────────────────────
[ СЕТЬ EVALINE MESH // КЛАСТЕРНЫЕ УЗЛЫ ]:
  [*] evabot.online    :: AI Вычислительное Ядро [ТЕКУЩИЙ УЗЕЛ]
  [->] https://evaline.network :: Edge Mesh & WireGuard Магистраль
  [->] https://evaline.online  :: Контур Безопасности & OOM-Щит
  [->] https://evaline.website :: Мастер-Хроника Релизов & Worklog
────────────────────────────────────────────────────────────────────────────
<!-- SLOT:TELEMETRY -->
[ РЕАЛЬНАЯ ТЕЛЕМЕТРИЯ ДВУХ СЕРВЕРОВ // REALTIME DUAL-NODE TELEMETRY ]:
  • EVABRAIN (Compute Core / ФРГ): CPU: 5.60 (70%) [■■■■■■■□□□] | RAM: 9.7/31 GB (31%) | Uptime: 1d 12:00:00 | Статус: [HEALTHY]
  • EVAFACE  (Edge Ingress / США): Load: 0.03 (2%) [□□□□□□□□□□] | RAM: 473/964 MB (49%) | Uptime: 1 day | Ingress: [Caddy HTTP/3 OK]
  • WIREGUARD MESH BACKBONE:       100.125.200.49 (US) ⟷ 100.66.98.4 (EU) | Latency: 135 ms RTT | Потери: [0.0%]
  • ПУЛ МОДЕЛЕЙ И КЛАСТЕРА:        Активно: 78 моделей онлайн (Gemini, Claude, DeepSeek) | Режим: [ONLINE]
<!-- /SLOT:TELEMETRY -->
────────────────────────────────────────────────────────────────────────────
<!-- SLOT:PROCESS_WATCHER -->
[ РЕАЛЬНЫЕ ПРОЦЕССЫ КЛАСТЕРА // LIVE PROCESS WATCHER ]:
  PID     УЗЕЛ             ПРОЦЕСС / СЛУЖБА             CPU    ОЗУ      СТАТУС
  230770  evabot-agent-vm  evabot-brain (Node.js)       0.1%   83 MB    [HEALTHY]
  224914  evabot-agent-vm  omniroute (LiteLLM)          0.4%   287 MB   [HEALTHY]
  169534  cluster-mesh     tailscaled (WireGuard)       0.2%   79 MB    [OPERATIONAL]
  32403   evaline-micro-vm caddy (Edge)                 0.4%   42 MB    [HEALTHY]
<!-- /SLOT:PROCESS_WATCHER -->
────────────────────────────────────────────────────────────────────────────
<!-- SLOT:LOG_STREAM -->
[ РЕАЛЬНЫЙ ЖУРНАЛ ЗАПРОСОВ И ЛОГИ СЕТИ // LIVE ACCESS & SYSTEM LOGS ]:
  [12:00:00] [OK] 200 GET  evabot.online    /api/health (HTTP/2.0 160ms) ip:100.125.200.49
  [11:59:58] [OK] 200 GET  evabot.online    /api/logs (HTTP/2.0 162ms) ip:100.125.200.49
  [11:59:55] [OK] 200 GET  evaline.network  / (HTTP/3.0 165ms) ip:34.159.202.82
  [11:59:52] [OK] 200 GET  evaline.online   / (HTTP/3.0 161ms) ip:34.159.202.82
  [11:59:50] [OK] 200 GET  evaline.website  / (HTTP/3.0 159ms) ip:34.159.202.82
<!-- /SLOT:LOG_STREAM -->
────────────────────────────────────────────────────────────────────────────
evabot@evaline-mesh:~$ █
