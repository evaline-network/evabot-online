# Отчет о развертывании вычислительного ядра EvaBot Brain (evabot-agent-vm)

## Краткое резюме
Вычислительный движок («Brain») для автономного агента EvaBot успешно развернут, настроен и запущен на высокопроизводительном инстансе Google Cloud Compute Engine `evabot-agent-vm` в зоне `europe-west3-a`.

## Параметры развертывания
- **Целевой сервер:** `evabot-agent-vm` (`c3-standard-8`, 8 vCPU, 32 ГБ RAM)
- **Зона GCP:** `europe-west3-a`
- **Внутренний IP:** `10.156.0.2`
- **Tailscale Mesh IP:** `100.66.98.4`
- **Рабочая директория:** `/var/www/evabot-backend` (символическая ссылка `/home/evabot/evabot-backend`)
- **Системный сервис:** `evabot-brain.service` (systemd)
- **Пользователь службы:** `evabot:evabot`
- **Сетевые интерфейсы:** `http://localhost:3000`, `http://100.66.98.4:3000`, `http://0.0.0.0:3000`
- **Среда Node.js:** Node.js `v22.23.2`, npm `10.9.8`

## Результаты проверки работоспособности
- **Эндпоинты:** `GET http://localhost:3000/api/health` и `GET http://100.66.98.4:3000/api/health`
- **HTTP Статус:** `200 OK`
- **Ответ сервиса:**
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

## Системные ресурсы и потребление памяти
- **Идентификатор процесса (PID):** `127004`
- **RSS (физическая память процесса):** `~61 - 62 МБ` (куча Node.js + реестр моделей)
- **CGroup Memory (systemd):** `17.3 МБ`
- **Нагрузка на CPU:** `< 0.1%` (режим ожидания)
- **Количество доступных моделей:** 20 рабочих моделей Gemini (2.5 Pro, Flash, Thinking, Flash-Lite)
- **Источник аутентификации:** Сервис метаданных Google Compute Engine (`evabot.online@gmail.com`)

## Команды управления
```bash
# Проверка статуса
sudo systemctl status evabot-brain.service

# Просмотр журналов в реальном времени
sudo journalctl -u evabot-brain.service -f
cat /var/log/evabot-brain.log
```
