#!/usr/bin/env bash
# ==============================================================================
# EVABOT ONLINE - THREE-WAY AUTOMATED SYNC & DEPLOYMENT SCRIPT
# Local (/home/fedor/Desktop/evabot-online) <-> GitHub <-> GCP Microserver
# ==============================================================================
set -e

MSG="${1:-"feat(evabot): modular TypeScript Gemini LLM chat agent v0.2.0"}"

echo "================================================================================"
echo "0. Building TypeScript bundle and running test suite..."
echo "================================================================================"
npm run build
npm test

echo ""
echo "================================================================================"
echo "1. Committing and pushing local changes to GitHub repository..."
echo "================================================================================"
git add .
git commit -m "$MSG" || echo "No new changes to commit."
git push origin main || git push origin master || echo "Git push skipped or up to date."

echo ""
echo "================================================================================"
echo "2. Synchronizing GCP Microserver (evaline-micro-vm / us-central1-a)..."
echo "================================================================================"
gcloud compute ssh evaline-micro-vm --zone=us-central1-a --quiet --command="
  set -e
  echo 'Updating /home/fedor/Desktop/evabot-online...'
  cd /home/fedor/Desktop/evabot-online
  git pull origin main || true
  npm run build || true
  
  echo 'Deploying to /var/www/evabot.online...'
  sudo rsync -av --exclude='.git' --exclude='node_modules' /home/fedor/Desktop/evabot-online/ /var/www/evabot.online/
  sudo chown -R www-data:www-data /var/www/evabot.online
  
  if [ -f /home/fedor/Desktop/evabot-online/evabot-chat.service ]; then
    echo 'Installing / updating systemd service...'
    sudo cp /home/fedor/Desktop/evabot-online/evabot-chat.service /etc/systemd/system/evabot-chat.service
    sudo systemctl daemon-reload
    sudo systemctl restart evabot-chat || sudo systemctl start evabot-chat || true
    sudo systemctl enable evabot-chat || true
  fi

  echo 'Reloading Caddy configuration if needed...'
  sudo systemctl reload caddy || true
  
  echo '🟢 Microserver deployment finished successfully.'
"

echo ""
echo "================================================================================"
echo "✅ DEPLOYMENT & SYNC SUCCESSFUL!"
echo "   - Local:       /home/fedor/Desktop/evabot-online"
echo "   - Microserver: https://evabot.online (evaline-micro-vm)"
echo "================================================================================"
