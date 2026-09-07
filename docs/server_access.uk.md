# Посібник з підключення до серверів EvaBot

**Дата:** 5 вересня 2026 р.
**Проєкт GCP:** `evabot-agent-server` (номер: `873069440066`)
**Домени:** evabot.online, evaline.online

---

## 1. Список серверів

| Сервер | Роль | Зона GCP | Тип машини | Регіон |
| :--- | :--- | :--- | :--- | :--- |
| `evabot-agent-vm` | Обчислювальне ядро (EvaBot Brain) | `europe-west3-a` | `c3-standard-8` (8 vCPU, 32 ГБ) | Франкфурт |
| `evaline-micro-vm` | Edge-проксі, веб-шлюз, Caddy | `us-central1-a` | `e2-micro` (Always Free) | Айова |

---

## 2. Мережеві адреси

| Сервер | Зовнішній IP | Внутрішній IP (VPC) | Tailscale IP | Домен |
| :--- | :--- | :--- | :--- | :--- |
| `evabot-agent-vm` | `34.159.202.82` | `10.156.0.2` | `100.66.98.4` | — |
| `evaline-micro-vm` | `136.114.26.252` | `10.128.0.2` | `100.125.200.49` | `evabot.online` |

> ⚠️ Зовнішній IP може змінюватися після перезапуску інстансу без статичного резервування. Надійні постійні адреси — внутрішній VPC та Tailscale.

---

## 3. Способи підключення до `evabot-agent-vm`

### 3.1. SSH через Google Cloud SDK (рекомендовано, без зовнішнього IP)

```bash
gcloud compute ssh evabot-agent-vm --zone=europe-west3-a
```

Або напряму з локальним ключем:

```bash
ssh evabot@34.159.202.82
ssh evabot@10.156.0.2        # зсередини VPC
ssh evabot@100.66.98.4       # через Tailscale з будь-якого місця
```

Користувач на сервері: `evabot`.

### 3.2. SSH з пробросом портів (тунелі)

Code-Server (8080) і шлюз Antigravity (9090) локально, без відкритих портів назовні:

```bash
gcloud compute ssh evabot-agent-vm --zone=europe-west3-a -- -L 8080:localhost:8080 -L 9090:localhost:9090 -N
```

Після цього:
- IDE Code-Server: `http://localhost:8080`
- Шлюз Antigravity: `http://localhost:9090`

### 3.3. Web IDE Code-Server (порт 8080)

- Локально через тунель: `http://localhost:8080`
- Через Tailscale: `http://100.66.98.4:8080`
- Служба systemd: `code-server@evabot.service`
- Конфігурація: `/home/evabot/.config/code-server/config.yaml`
- Пароль входу: заданий у `config.yaml` (поле `password`)

Порада: ніколи не відкривайте порт 8080 в інтернет без аутентифікації — використовуйте SSH-тунель або Tailscale.

### 3.4. Графічний робочий стіл VNC (порт 5901)

Робочий стіл XFCE4 користувача `evabot`:

- Адреса: `34.159.202.82:5901` (зовнішній) або `100.66.98.4:5901` (Tailscale)
- Користувач: `evabot`
- Пароль: той, що збережений у `/home/evabot/.vnc/passwd`
- Запуск сервера:
  ```bash
  sudo -u evabot vncserver :1 -localhost no -geometry 1360x850 -depth 24 -SecurityTypes VncAuth
  ```
- Зупинка сервера:
  ```bash
  sudo -u evabot vncserver -kill :1
  ```

Клієнти: TigerVNC (`vncviewer`), RealVNC, Remmina, TightVNC або вбудований noVNC у браузері.

### 3.5. Веб-сервер (порти 80/443)

- Nginx слухає `0.0.0.0:80`
- Відкриті firewall-теги інстансу: `http-server`, `https-server`
- Основний сайт хоститься на `evaline-micro-vm` і проксіюється на цей вузол.

### 3.6. Backend EvaBot Brain (порт 3000)

- Служба systemd: `evabot-brain.service`
- Адреса: `http://localhost:3000` (на сервері); робочий каталог `/var/www/evabot-backend`
- Логи: `/var/log/evabot-brain.log`, `/var/log/evabot-brain.error.log`

### 3.7. Шлюз Antigravity (порт 9090)

- REST API телеметрії та оркестрації
- Перевірка статусу: `curl http://localhost:9090/status`

---

## 4. Підключення до `evaline-micro-vm`

### 4.1. SSH через Google Cloud SDK

```bash
gcloud compute ssh evaline-micro-vm --zone=us-central1-a
```

### 4.2. SSH напряму / через Tailscale

```bash
ssh evabot@136.114.26.252
ssh evabot@10.128.0.2
ssh evabot@100.125.200.49
```

### 4.3. Веб-сервер (Caddy)

- Сайти: `https://evabot.online`, `https://evaline.online`
- Caddy автоматично випускає TLS-сертифікати через Let's Encrypt
- Перезавантаження конфігурації: `sudo systemctl reload caddy`

---

## 5. Підключення через Tailscale (VPN-меш)

Tailscale забезпечує приватний мережевий міст між усіма пристроями без відкритих портів в інтернет. Пристрої в мережі `evabot.online@`:

| Пристрій | IP Tailscale | Статус |
| :--- | :--- | :--- |
| `evabot-agent-vm` | `100.66.98.4` | online |
| `evaline-micro-vm` | `100.125.200.49` | online |
| `macbook-air-2018` | `100.102.22.45` | активний |
| `debian` | `100.127.10.65` | офлайн |
| `oppo-a5-pro-5g` | `100.126.165.5` | офлайн |
| `pixel-10-pro-xl` | `100.80.216.27` | офлайн |

Перевірка мережі:

```bash
sudo tailscale status
```

Принцип безпеки: доступ із зовнішнього IP дозволений лише для SSH і портів 80/443. Все інше (IDE, VNC, backend, шлюз) — через Tailscale або SSH-тунелі.

---

## 6. Перевірка стану серверів

```bash
# SSH на обчислювальний вузол
gcloud compute ssh evabot-agent-vm --zone=europe-west3-a

# Служби
systemctl status evabot-brain
systemctl status code-server@evabot

# Відкриті порти
ss -tlnp

# Доступність зовнішньої адреси
curl -I https://evabot.online
```

---

## 7. Швидка довідкова таблиця

| Що потрібно | Команда / адреса |
| :--- | :--- |
| Термінал обчислювального вузла | `gcloud compute ssh evabot-agent-vm --zone=europe-west3-a` |
| Термінал мікро-сервера | `gcloud compute ssh evaline-micro-vm --zone=us-central1-a` |
| Web IDE (тунель) | `localhost:8080` |
| Web IDE (Tailscale) | `100.66.98.4:8080` |
| Робочий стіл VNC | `34.159.202.82:5901` |
| Backend API | `localhost:3000` |
| Сайт | `https://evabot.online` |