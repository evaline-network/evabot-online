# Звіт про розгортання обчислювального вузла EvaBot Brain (evabot-agent-vm)

## Коротке резюме
Обчислювальний рушій («Brain») для автономного інтелектуального агента EvaBot успішно розгорнуто, налаштовано та активовано на високопродуктивному сервері Google Cloud Compute Engine `evabot-agent-vm` у зоні `europe-west3-a`.

## Параметри розгортання
- **Цільовий сервер:** `evabot-agent-vm` (`c3-standard-8`, 8 vCPU, 32 ГБ RAM)
- **Зона GCP:** `europe-west3-a`
- **Внутрішній IP:** `10.156.0.2`
- **Tailscale Mesh IP:** `100.66.98.4`
- **Робоча директорія:** `/var/www/evabot-backend` (символічне посилання `/home/evabot/evabot-backend`)
- **Системна служба:** `evabot-brain.service` (systemd)
- **Користувач служби:** `evabot:evabot`
- **Мережеві інтерфейси:** `http://localhost:3000`, `http://100.66.98.4:3000`, `http://0.0.0.0:3000`
- **Середовище Node.js:** Node.js `v22.23.2`, npm `10.9.8`

## Результати перевірки працездатності
- **Ендпоінти:** `GET http://localhost:3000/api/health` та `GET http://100.66.98.4:3000/api/health`
- **HTTP Статус:** `200 OK`
- **Відповідь сервісу:**
```json
{
  "status": "online",
  "server": "evabot-online-edge",
  "uptimeSeconds": 27,
  "memoryUsageMb": 61,
  "availableModels": 20,
  "hasServerApiKey": true,
  "authSource": "Google Compute Engine Service Account",
  "account": "evabot.online@gmail.com"
}
```

## Системні ресурси та використання пам'яті
- **Ідентифікатор процесу (PID):** `127004`
- **RSS (фізична пам'ять процесу):** `~61 - 62 МБ` (купа Node.js + реєстр моделей)
- **CGroup Memory (systemd):** `17.3 МБ`
- **Використання CPU:** `< 0.1%` (стан очікування)
- **Кількість доступних моделей:** 20 робочих моделей Gemini (2.5 Pro, Flash, Thinking, Flash-Lite)
- **Джерело автентифікації:** Сервіс метаданих Google Compute Engine (`evabot.online@gmail.com`)

## Команди керування
```bash
# Перевірка статусу
sudo systemctl status evabot-brain.service

# Перегляд журналів у реальному часі
sudo journalctl -u evabot-brain.service -f
cat /var/log/evabot-brain.log
```
