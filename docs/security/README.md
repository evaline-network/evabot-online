# 🔐 Security Documentation

**Модульная структура security docs**

---

## 📂 Содержание

### [`SECURITY_AUDIT.md`](./SECURITY_AUDIT.md)
Полный аудит безопасности проекта:
- Обнаруженные угрозы
- WordPress exploit атаки
- Заблокированные IP
- Рекомендации по защите
- Fail2ban конфигурация

---

## 🔍 Как добавить новый аудит

1. Создай файл: `docs/security/AUDIT-YYYY-MM-DD.md`
2. Опиши инцидент: дата, тип атаки, IP, метод защиты
3. Добавь ссылку в этот README.md

---

**Last Audit:** 2026-09-07 (v0.0.2)  
**Threats Detected:** 432 WP exploit attempts blocked  
**Status:** ✅ All threats mitigated
