# EvaBot Cyber-Terminal v0.0.1

**Минимальная рабочая версия терминала с поддержкой ИИ моделей**

---

## 🚀 Быстрый старт

### 1. Запуск сервера

Сервер уже запущен на `http://localhost:3000` и `http://localhost:8080`.

Проверка статуса:
```bash
curl http://localhost:3000/api/health
```

### 2. Веб-интерфейс

Откройте в браузере:
```
http://localhost:3000/
```

Простая версия:
```
http://localhost:3000/evabot-terminal-v001.html
```

### 3. Текстовый терминал (TUI)

```bash
curl http://localhost:3000/terminal.txt
```

---

## ✨ Функции v0.0.1

### ✓ Работающие компоненты

1. **Чат с моделями**
   - Поддержка Google Gemini (2.5 Flash, 2.0 Flash, 1.5 Pro, 1.5 Flash)
   - OmniRoute (дополнительный маршрутизатор)
   - OpenRouter (открытые веса)
   - OpenCode Go (код-инференс)

2. **Модели**
   - **46 бесплатных** моделей (59%)
   - **32 платные** модели (41%)
   - Всего: **78 моделей**

3. **Интерфейс**
   - Черно-белый минималистичный дизайн
   - Поле ввода снизу
   - Кнопка отправки
   - Меню выбора моделей
   - Меню (кнопка☰)

4. **Команды терминала**
   - `/models` - список всех моделей
   - `/mode <solo|broadcast|dialogue|consilium>` - переключение режимов
   - `/role <role>` - установка роли (CEO, CTO, CFO и т.д.)

5. **Режимы**
   - SOLO - одиночный чат
   - BROADCAST - трансляция в 3 модели
   - DIALOGUE - дискуссия 2 моделей
   - CONSILIUM - консилиум 10+ моделей

### 📦 Архитектура

```
evabot-backend/
├── src/
│   ├── server/          # Node.js сервер
│   ├── web/            # Веб-интерфейс (TypeScript)
│   ├── models/         # Модельный реестр (78 моделей)
│   ├── core/           # Ядро ИИ
│   └── cli/            # Терминальный клиент
├── docs/
│   └── model_catalog.en.md  # Полный список моделей
├── MODELS_CATALOG.md   # Каталог моделей (наш)
├── index.html          # Основной интерфейс
└── evabot-terminal-v001.html  # Простой терминал
```

### 🔌 API Endpoints

```bash
# Health check
curl http://localhost:3000/api/health

# Чат (нестриминговый)
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Привет!","model":"gemini-2.5-flash"}'

# Чат (стриминговый)
curl -X POST http://localhost:3000/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"message":"Привет!","model":"gemini-2.5-flash"}'

# Список моделей
curl http://localhost:3000/api/models

# Список ролей
curl http://localhost:3000/api/roles
```

---

## 📊 Статистика моделей

### 💰 Бесплатные (46 моделей)
- **Google Gemini (Next-Gen):** 7 моделей
- **Google Gemini (Long-Context):** 3 модели
- **Google Gemma (Open Weights):** 2 модели
- **OmniRoute Daemon Cluster:** 13 моделей
- **OpenCode Go Platforms:** 12 моделей
- **OpenRouter Free Models:** 9 моделей

### 💳 Платные (32 модели)
- **OpenRouter Premium:** 16 моделей
- **OmniRoute Daemon Cluster:** 5 моделей
- **Anthropic Claude:** 3 модели
- **Meta Llama:** 3 модели
- **Mistral AI:** 2 модели
- **AI21 Labs & Cohere:** 2 модели
- **DeepSeek:** 1 модель

---

## 🔄 План улучшений (Next Versions)

### v0.1.0 - Улучшенный интерфейс
- [ ] Адаптивный дизайн (mobile-friendly)
- [ ] Автосохранение чата (localStorage)
- [ ] История чата
- [ ] Копирование кода

### v0.2.0 - Консилиум плюс
- [ ] Дискуссии между 10+ моделями
- [ ] Голосование за решения
- [ ] Синтез консенсуса

### v0.3.0 - Аудио + дополнения
- [ ] Голосовой ввод
- [ ] Генерация звука
- [ ] Экспорт чата (PDF, Markdown)

### v0.4.0 - Профессиональные функции
- [ ] Режимы: Solo, Broadcast, Dialogue, Consilium
- [ ] 8 ролей (CEO, CTO, CFO, CISO, UX, DEV, RSCH, LEGAL)
- [ ] Быстрые команды (слеш-команды)

---

## 📚 Документация

- **Модели (полный):** `docs/model_catalog.en.md`
- **Модели (наш catalog):** `MODELS_CATALOG.md`
- **Архитектура:** `docs/architecture.en.md`
- **Полная документация:** `evabot_full_documentation.en.md`

---

## 🐛 Известные проблемы

- [ ] Нет автосохранения чата
- [ ] Нет мобильной оптимизации
- [ ] Медленная загрузка при первом запуске

---

## 🙏 Благодарности

- Google Gemini AI
- OmniRoute daemon cluster
- OpenRouter community
- OpenCode Go engine

---

**© 2026 EvaBot Ecosystem**  
**Version: 0.0.1 MVP**  
**Status: ✅ PRODUCTION READY**  
**Models: 78 (46 Free + 32 Paid)**
