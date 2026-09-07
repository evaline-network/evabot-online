#!/bin/bash

# EvaBot Terminal Launcher
# Запуск EvaBot Cyber-Terminal

echo "======================================"
echo "  EVABOT CYBER-TERMINAL v0.0.1 MVP   "
echo "======================================"
echo ""

# Проверка порта 3000
if lsof -i :3000 > /dev/null 2>&1; then
    echo "✓ Сервер уже запущен на порту 3000"
else
    echo "⚠ Сервер не запущен. Запускаю..."
    echo "  (Запустите вручную: cd /var/www/evabot-backend && npm run start)"
    echo ""
    exit 1
fi

echo ""
echo "Сервер доступен по адресам:"
echo "  • Web:    http://localhost:3000"
echo "  • TUI:    curl http://localhost:3000/terminal.txt"
echo "  • API:    http://localhost:3000/api/health"
echo ""
echo "Быстрый тест:"
echo "  curl -s http://localhost:3000/ | head -20"
echo ""
echo "Запуск веб-версии (простой HTML):"
echo "  open http://localhost:3000/evabot-terminal-v001.html"
echo ""
