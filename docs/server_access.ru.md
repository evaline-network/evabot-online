# Руководство по подключению к серверам EvaBot

**Дата:** 5 сентября 2026 г.
**Проект GCP:** `evabot-agent-server` (номер: `873069440066`)
**Домены:** evabot.online, evaline.online

---

## 1. Список серверов

| Сервер | Роль | Зона GCP | Тип машины | Регион |
| :--- | :--- | :--- | :--- | :--- |
| `evabot-agent-vm` | Вычислительное ядро (EvaBot Brain) | `europe-west3-a` | `c3-standard-8` (8 vCPU, 32 ГБ) | Франкфурт |
| `evaline-micro-vm` | Edge-прокси, веб-шлюз, Caddy | `us-central1-a` | `e2-micro` (Always Free) | Айова |

---

## 2. Сетевые адреса

| Сервер | Внешний IP | Внутренний IP (VPC) | Tailscale IP | Домен |
| :--- | :--- | :--- | :--- | :--- |
| `evabot-agent-vm` | `34.159.202.82` | `10.156.0.2` | `100.66.98.4` | — |
| `evaline-micro-vm` | `136.114.26.252` | `10.128.0.2` | `100.125.200.49` | `evabot.online` |

> ⚠️ Внешний IP может меняться после перезапуска инстанса без статического резервирования. Надёжные постоянные адреса — внутренний VPC и Tailscale.

---

## 3. Способы подключения к `evabot-agent-vm`

### 3.1. SSH через Google Cloud SDK (рекомендуется, не нужен внешний IP)

```bash
gcloud compute ssh evabot-agent-vm --zone=europe-west3-a
```

Или через публичный ключ локальной машины:

```bash
ssh evabot@34.159.202.82
ssh evabot@10.156.0.2        # изнутри VPC
ssh evabot@100.66.98.4       # через Tailscale из любого места
```

Пользователь на сервере: `evabot`.

### 3.2. SSH с пробросом портов (туннели)

Code-Server (8080) и шлюз Antigravity (9090) локально, без открытия портов наружу:

```bash
gcloud compute ssh evabot-agent-vm --zone=europe-west3-a -- -L 8080:localhost:8080 -L 9090:localhost:9090 -N
```

После этого:
- IDE Code-Server: `http://localhost:8080`
- Шлюз Antigravity: `http://localhost:9090`

### 3.3. Web IDE Code-Server (порт 8080)

- Локально через туннель: `http://localhost:8080`
- По Tailscale: `http://100.66.98.4:8080`
- Служба systemd: `code-server@evabot.service`
- Конфигурация: `/home/evabot/.config/code-server/config.yaml`
- Пароль входа: задан в `config.yaml` (поле `password`)

Совет: никогда не открывайте порт 8080 в интернет без аутентификации — используйте SSH-туннель или Tailscale.

### 3.4. Графический рабочий стол VNC (порт 5901)

Рабочий стол XFCE4 пользователя `evabot`:

- Адрес: `34.159.202.82:5901` (внешний) или `100.66.98.4:5901` (Tailscale)
- Пользователь: `evabot`
- Пароль: тот, что задан в `/home/evabot/.vnc/passwd`
- Запуск сервера:
  ```bash
  sudo -u evabot vncserver :1 -localhost no -geometry 1360x850 -depth 24 -SecurityTypes VncAuth
  ```
- Остановка сервера:
  ```bash
  sudo -u evabot vncserver -kill :1
  ```

Клиенты: TigerVNC (`vncviewer`), RealVNC, Remmina, TightVNC, или встроенный клиент из кода (browser noVNC).

### 3.5. Веб-сервер (порты 80/443)

- Nginx слушает `0.0.0.0:80`
- Открытые firewall-теги инстанса: `http-server`, `https-server`
- Основной сайт хостится на `evaline-micro-vm` и проксируется на этот узел.

### 3.6. Backend EvaBot Brain (порт 3000)

- Служба systemd: `evabot-brain.service`
- Адрес: `http://localhost:3000` (на сервере), рабочий каталог `/var/www/evabot-backend`
- Логи: `/var/log/evabot-brain.log`, `/var/log/evabot-brain.error.log`

### 3.7. Шлюз Antigravity (порт 9090)

- REST API телеметрии и оркестрации
- Проверка статуса: `curl http://localhost:9090/status`

---

## 4. Подключение к `evaline-micro-vm`

### 4.1. SSH через Google Cloud SDK

```bash
gcloud compute ssh evaline-micro-vm --zone=us-central1-a
```

### 4.2. SSH напрямую / через Tailscale

```bash
ssh evabot@136.114.26.252
ssh evabot@10.128.0.2
ssh evabot@100.125.200.49
```

### 4.3. Веб-сервер (Caddy)

- Сайты: `https://evabot.online`, `https://evaline.online`
- Caddy автоматически выпускает TLS-сертификаты через Let's Encrypt
- Перезагрузка конфигурации: `sudo systemctl reload caddy`

---

## 5. Подключение через Tailscale (VPN-меш)

Tailscale обеспечивает частный сетевой мост между всеми устройствами без необходимости открывать порты в интернет. Устройства в сети `evabot.online@`:

| Устройство | IP Tailscale | Статус |
| :--- | :--- | :--- |
| `evabot-agent-vm` | `100.66.98.4` | online |
| `evaline-micro-vm` | `100.125.200.49` | online |
| `macbook-air-2018` | `100.102.22.45` | активен |
| `debian` | `100.127.10.65` | оффлайн |
| `oppo-a5-pro-5g` | `100.126.165.5` | оффлайн |
| `pixel-10-pro-xl` | `100.80.216.27` | оффлайн |

Проверка сети:

```bash
sudo tailscale status
```

Принцип безопасности: подключение по внешнему IP разрешено только для SSH и портов 80/443. Всё остальное (IDE, VNC, backend, шлюз) — через Tailscale или SSH-туннели.

---

## 6. Проверка состояния серверов

```bash
# SSH на вычислительный узел
gcloud compute ssh evabot-agent-vm --zone=europe-west3-a

# Службы
systemctl status evabot-brain
systemctl status code-server@evabot

# Открытые порты
ss -tlnp

# Достижимость внешнего адреса
curl -I https://evabot.online
```

---

## 7. Быстрая справочная таблица

| Что нужно | Команда / адрес |
| :--- | :--- |
| Терминал вычислительного узла | `gcloud compute ssh evabot-agent-vm --zone=europe-west3-a` |
| Терминал микроserвера | `gcloud compute ssh evaline-micro-vm --zone=us-central1-a` |
| Web IDE (туннель) | `localhost:8080` |
| Web IDE (Tailscale) | `100.66.98.4:8080` |
| Рабочий стол VNC | `34.159.202.82:5901` |
| Backend API | `localhost:3000` |
| Сайт | `https://evabot.online` |