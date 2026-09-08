---
domain: evaline.network
badge: EDGE MESH
role: Edge Mesh, Транс-региональная Сетевая Маршрутизация & WireGuard Магистраль
infra: evaline-micro-vm · 2 vCPU e2-micro · 1 GB RAM · Айова (США) · IP: 136.114.26.252
target: Глобальный Ingress-шлюз, HTTP/3 QUIC терминация, WireGuard туннель Франкфурт ↔ Айова.
theme: dark
---

┌── EVALINE CONSOLE // evaline.network [EDGE MESH] ── ● LIVE ── [◐ ТЕМА] ──┐
│                                                                          │
> УЗЕЛ         : evaline.network [EDGE MESH & PROCESS FLOW]
> РОЛЬ         : Интерактивный Визуализатор Процессов Кластера, Агентов и LLM
> ИНФРА        : evaline-micro-vm (Айова) ⟷ evabot-agent-vm (Франкфурт) · Mesh: 124ms
> НАЗНАЧЕНИЕ   : Мониторинг процессов, потоки LLM-провайдеров, шина MCP, защита памяти.
────────────────────────────────────────────────────────────────────────────
[ СЕТЬ EVALINE MESH // КЛАСТЕРНЫЕ УЗЛЫ ]:
  [->] https://evabot.online   :: AI Вычислительное Ядро & Чат-терминал
  [*] evaline.network  :: Интерактивный Визуализатор Процессов & LLM [ТЕКУЩИЙ УЗЕЛ]
  [->] https://evaline.online  :: Манифест Компании & Контур Безопасности
  [->] https://evaline.website :: Единый Центр Входа & Репозитории
────────────────────────────────────────────────────────────────────────────
<!-- SLOT:TELEMETRY -->
[ РЕАЛЬНАЯ ТЕЛЕМЕТРИЯ ДВУХ СЕРВЕРОВ // REALTIME DUAL-NODE TELEMETRY ]:
  • EVABRAIN (Compute Core / ФРГ): CPU: 5.60 (70%) [■■■■■■■□□□] | RAM: 16.0/31 GB (51%) | Uptime: 2d 13:00:00 | Статус: [HEALTHY] 🟢
  • EVAFACE  (Edge Ingress / США): Load: 0.15 (8%) [■□□□□□□□□□] | RAM: 440/964 MB (46%) | Uptime: 2 days | Ingress: [Caddy HTTP/3 OK] 🟢
  • WIREGUARD MESH BACKBONE:       100.125.200.49 (US) ⟷ 100.66.98.4 (EU) | Latency: 124 ms RTT | Потери: [0.0%] 🟢
  • ПУЛ МОДЕЛЕЙ И КЛАСТЕРА:        Активно: 78 моделей онлайн (Gemini, Claude, DeepSeek) | Режим: [ONLINE] 🟢
<!-- /SLOT:TELEMETRY -->
────────────────────────────────────────────────────────────────────────────
<!-- SLOT:LLM_MATRIX -->
[ МАТРИЦА LLM-ПРОВАЙДЕРОВ И МОДЕЛЕЙ // LLM & MULTI-AGENT STATUS ]:
  • GOOGLE GEMINI (ADC):   Gemini 2.5 Flash, 3.8 Flash, Pro (1M ctx)     | [ONLINE] 🟢
  • OMNIROUTE (Port 20128): 78 моделей · LPU Groq/Cerebras (800 t/s)      | [ONLINE] 🟢
  • OPENROUTER HUB:        56 бесплатных кодинг-моделей (DeepSeek, Qwen)  | [ONLINE] 🟢
  • OPENCODE AGENTS:       21 MCP-инструмент · Автономная разработка     | [ONLINE] 🟢
<!-- /SLOT:LLM_MATRIX -->
────────────────────────────────────────────────────────────────────────────
<!-- SLOT:SECURITY_SHIELD -->
[ КОНТУР БЕЗОПАСНОСТИ И ЗАЩИТЫ // SECURITY & AUTO-REAP SHIELD ]:
  • EARLYOOM DAEMON:       Active (Пороги: <10% RAM, >80% Swap)          | [ARMED] 🟢
  • EVA-WATCHDOG TIMER:    Каждые 3 мин (Сброс Tl-пауз > 20 мин)         | [ACTIVE] 🟢
  • FAIL2BAN SSH JAIL:     Активен · Мониторинг брутфорса и ботнетов     | [ARMED] 🟢
  • WIREGUARD ENCRYPTION:  ChaCha20-Poly1305 · Закрытый контур           | [SECURE] 🟢
<!-- /SLOT:SECURITY_SHIELD -->
────────────────────────────────────────────────────────────────────────────
<!-- SLOT:PROCESS_WATCHER -->
[ РЕАЛЬНЫЕ ПРОЦЕССЫ КЛАСТЕРА // LIVE PROCESS WATCHER ]:
  PID     УЗЕЛ             ПРОЦЕСС / СЛУЖБА             CPU    ОЗУ      СТАТУС
  737946  evabot-agent-vm  evabot-brain (Node.js)       0.1%   105 MB   [HEALTHY] 🟢
  389265  evabot-agent-vm  evabot-voice (FastAPI)       0.2%   35 MB    [HEALTHY] 🟢
  1095108 evabot-agent-vm  omniroute (LiteLLM 78)       1.3%   1248 MB  [HEALTHY] 🟢
  169534  cluster-mesh     tailscaled (WireGuard)       0.3%   62 MB    [OPERATIONAL] 🟢
  32403   evaline-micro-vm caddy (Edge Ingress)         0.1%   37 MB    [HEALTHY] 🟢
<!-- /SLOT:PROCESS_WATCHER -->
────────────────────────────────────────────────────────────────────────────
<!-- SLOT:LOG_STREAM -->
[ РЕАЛЬНЫЙ ЖУРНАЛ ЗАПРОСОВ И ЛОГИ СЕТИ // LIVE ACCESS & SYSTEM LOGS ]:
  [11:10:21] [OK] 200 GET  evaline.network  /api/health (HTTP/3.0 124ms) ip:100.66.98.4
  [11:10:18] [OK] 200 GET  evaline.network  /api/logs   (HTTP/3.0 124ms) ip:100.66.98.4
  [11:10:15] [OK] 200 GET  evabot.online    /           (HTTP/2.0 125ms) ip:100.125.200.49
  [11:10:12] [OK] 200 GET  evaline.online   /manifesto  (HTTP/3.0 124ms) ip:34.159.202.82
<!-- /SLOT:LOG_STREAM -->
────────────────────────────────────────────────────────────────────────────
evabot@evaline-mesh:~$ █
