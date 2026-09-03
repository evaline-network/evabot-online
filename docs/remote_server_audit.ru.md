# Отчет об аудите удаленного сервера и руководство по доступу

**Дата:** 03.09.2026  
**Целевой сервер:** `evabot-agent-vm`  
**Зона GCP:** `europe-west3-a`  
**Статус:** Онлайн и полностью функционирует  

---

## 1. Краткое резюме

Проведен полный аудит высокопроизводительного облачного сервера **`evabot-agent-vm`** через `gcloud compute ssh`. Все ключевые подсистемы, включая центральный процессор, 32 ГБ оперативной памяти DDR5, NVMe-накопитель, системные службы systemd, Python-шлюз Antigravity (порт 9090) и Web IDE Code-Server (порт 8080), работают в штатном режиме с оптимальными показателями.

---

## 2. Аппаратные характеристики и операционная система

| Параметр | Спецификация | Текущее состояние |
| :--- | :--- | :--- |
| **Операционная система** | Debian GNU/Linux 12 (bookworm) | Ядро: `6.1.0-52-cloud-amd64` (SMP PREEMPT_DYNAMIC) |
| **Процессор (CPU)** | Intel(R) Xeon(R) Platinum 8481C @ 2.70GHz | 8 vCPU (1 сокет, 8 логических ядер) |
| **Средняя загрузка** | Load Average (1, 5, 15 мин) | `0.00, 0.00, 0.00` (В режиме ожидания, нулевая нагрузка) |
| **Оперативная память (RAM)** | 32 ГБ скоростной DDR5 | **Всего:** 31 ГиБ<br>**Занято:** 1.3 ГиБ<br>**Доступно:** 30 ГиБ (Свободно: 19 ГиБ, Кэш/Буфер: 10 ГиБ) |
| **Файл подкачки (Swap)** | Linux Swap Space | 0 Б (Отключен за ненадобностью при 30 ГиБ доступной памяти) |
| **Дисковое пространство** | Быстрый NVMe SSD (`/dev/nvme0n1p1`) | **Всего:** 49 ГБ<br>**Занято:** 11 ГБ (22%)<br>**Свободно:** 37 ГБ (78%) |

---

## 3. Активные службы и сетевые порты

Результаты проверки активных служб и открытых сетевых сокетов:

```
tcp   LISTEN 0   511   0.0.0.0:8080   0.0.0.0:*   users:(("code-server",pid=41401))
tcp   LISTEN 0   511   0.0.0.0:80     0.0.0.0:*   users:(("nginx",pid=89044))
tcp   LISTEN 0   5     0.0.0.0:9090   0.0.0.0:*   users:(("python3",pid=37070))
tcp   LISTEN 0   511      [::]:80        [::]:*   users:(("nginx",pid=89044))
```

### 3.1. `code-server@evabot.service`
- **Имя службы:** `code-server@evabot.service` (юнит systemd)
- **Состояние:** `active (running)` с 02 сентября 08:34:24 UTC
- **PID процессов:** 41381 / 41401 (`/usr/lib/code-server`)
- **Адрес привязки:** `0.0.0.0:8080`

### 3.2. Python-шлюз Antigravity (Antigravity Gateway)
- **Состояние:** `active (running)` (PID 37070, пользователь `fedor`)
- **Описание:** REST API сервер телеметрии и оркестрации на базе Python
- **Адрес привязки:** `0.0.0.0:9090`

### 3.3. `nginx.service`
- **Имя службы:** `nginx.service`
- **Состояние:** `active (running)` с 02 сентября 11:29:22 UTC (PID 89044)
- **Адрес привязки:** `0.0.0.0:80` и `[::]:80`

---

## 4. Верификация API шлюза Antigravity (порт 9090)

Выполнен проверочный запрос к эндпоинту `http://localhost:9090/status`:

```bash
curl -s http://localhost:9090/status
```

**Ответ JSON (HTTP 200 OK):**
```json
{
  "status": "online",
  "server": "evabot-agent-vm",
  "tailscale_ip": "100.66.98.4",
  "antigravity_cli": true,
  "antigravity_ide": true
}
```

Подтверждение: Подсистемы `antigravity_cli` и `antigravity_ide` активны и готовы к удаленной оркестрации.

---

## 5. Проверка Web IDE Code-Server (порт 8080)

Проверка HTTP-ответа:
```bash
curl -I -s http://localhost:8080/
```
**Результат:**
```http
HTTP/1.1 302 Found
Location: ./login
```

### Конфигурация и данные доступа
- **Путь к файлу конфигурации:** `/home/evabot/.config/code-server/config.yaml`
- **Права доступа:** `-rw-r--r-- 1 evabot evabot`
- **Содержимое конфигурации:**
  ```yaml
  bind-addr: 0.0.0.0:8080
  auth: password
  password: antigravity-pass
  cert: false
  ```
- **Пароль для входа в веб-интерфейс:** `antigravity-pass`

---

## 6. Руководство: 0% потребления локальных ресурсов

Для выполнения ресурсоемких задач (компиляция кода, сборка Docker/npm, запуск ботов и моделей) без нагрузки на локальный ноутбук/ПК (0% локального CPU и 0% RAM):

### Вариант 1: Прямое подключение через сеть Tailscale (Рекомендуется)
Локальный компьютер и сервер `evabot-agent-vm` уже соединены через Tailscale:
- **Tailscale IP:** `100.66.98.4`
- **Web IDE в браузере:** [`http://100.66.98.4:8080/`](http://100.66.98.4:8080/)
- **Пароль:** `antigravity-pass`
- **Эндпоинт шлюза:** [`http://100.66.98.4:9090/status`](http://100.66.98.4:9090/status)

*Преимущества:* Не требуется запускать фоновые SSH-туннели. Вся разработка и исполнение происходят на 8-ядерном Xeon с 32 ГБ DDR5 RAM, а локальный браузер отображает лишь веб-интерфейс.

### Вариант 2: Защищенный SSH-туннель через Google Cloud SDK
При работе вне сети Tailscale:
```bash
gcloud compute ssh evabot-agent-vm --zone europe-west3-a -- -L 8080:localhost:8080 -L 9090:localhost:9090 -N
```
После чего открыть в браузере:
- IDE: [`http://localhost:8080`](http://localhost:8080)
- Шлюз: [`http://localhost:9090/status`](http://localhost:9090/status)

### Вариант 3: Локальный VS Code через Remote-SSH
Добавьте в локальный файл `~/.ssh/config`:
```ssh-config
Host evabot-agent-vm
    HostName 100.66.98.4
    User evabot
    IdentityFile ~/.ssh/google_compute_engine
```
Затем выберите в VS Code **Remote-SSH: Connect to Host -> evabot-agent-vm**. Все плагины, языковые серверы, терминалы и сборка выполняются на 100% на удаленном сервере.
