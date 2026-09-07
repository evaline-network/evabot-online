# 📜 EvaBot Online — Worklog Index

**Modular worklog structure** — каждый файл = один месяц/релиз

---

## 📂 Структура

```
docs/worklog/
├── README.md                    # Этот файл (index)
├── 2026-august.md               # Дни 1-31 (август 2026)
├── 2026-september-pre-v002.md   # Сентябрь до v0.0.2
└── v0.0.2-release.md            # Релиз v0.0.2 (2026-09-07)
```

---

## 📅 Файлы по датам

### Август 2026
**Файл:** [`2026-august.md`](./2026-august.md)
**Период:** 2026-08-01 — 2026-08-31
**Содержание:** Архитектурный фундамент, GCP развертывание, Tailscale mesh, Caddy, OmniRoute

### Сентябрь 2026 (до v0.0.2)
**Файл:** [`2026-september-pre-v002.md`](./2026-september-pre-v002.md)
**Период:** 2026-09-01 — 2026-09-06
**Содержание:** MVP релиз v0.0.1, мониторинг, тестирование

### v0.0.2 Release
**Файл:** [`v0.0.2-release.md`](./v0.0.2-release.md)
**Дата:** 2026-09-07
**Содержание:** Security hardening, Knowledge Base, Refactoring, Alerting

---

## 🔍 Как добавить новую запись

1. Создай новый файл: `docs/worklog/YYYY-month-NN.md` или `docs/worklog/vX.Y.Z-release.md`
2. Используй шаблон:
```markdown
## 📅 YYYY-MM-DD — Краткое описание

### [Task Name]
- [x] Сделанная задача
- [x] Другая задача
- [ ] Открытая задача

### Метрики
- Строк кода: X
- Файлов: Y
- TypeScript errors: Z
```

3. Добавь ссылку в этот README.md

---

## 📊 Сводка по релизам

| Версия | Дата | Файл | Задач | Строк кода |
|--------|------|------|-------|-----------|
| v0.0.1 | 2026-09-03 | (pre-v002) | 10 | 12,498 |
| v0.0.2 | 2026-09-07 | [v0.0.2-release.md](./v0.0.2-release.md) | 25 | 11,272 |
| v0.1.0 | TBD | (planned) | TBD | TBD |

---

**Формат:** [Keep a Changelog](https://keepachangelog.com/)  
**Owner:** EvaBot Engineering Team  
**Last Updated:** 2026-09-07
