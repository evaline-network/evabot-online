#!/usr/bin/env bash
# watchdog.sh — EvaBot brain hang watchdog (infrastructure script, no build).
#
# Checks:
#   1. http://localhost:3000/api/health  (evabot-brain) — must return HTTP 200
#   2. http://localhost:20128/health     (omniroute)    — optional, logged only
#
# Logic: 3 consecutive unhealthy probes of evabot-brain → `systemctl restart evabot-brain`.
# All output goes to /var/www/evabot-backend/logs/watchdog.log.
#
# ── INSTALL (run as root; DO NOT auto-install from repo) ────────────────────
#   sudo cp /var/www/evabot-backend/config/evabot-watchdog.service /etc/systemd/system/
#   sudo cp /var/www/evabot-backend/config/evabot-watchdog.timer   /etc/systemd/system/
#   sudo chmod +x /var/www/evabot-backend/config/watchdog.sh
#   sudo systemctl daemon-reload
#   sudo systemctl enable --now evabot-watchdog.timer
#   # verify: systemctl list-timers | grep evabot-watchdog
#
# NOTE: the main evabot-brain unit should also carry `Restart=always` so
# crashes (as opposed to hangs) are handled by systemd itself:
#   sudo systemctl edit evabot-brain   # add:  [Service]  Restart=always  RestartSec=5

set -u
LOG_DIR="/var/www/evabot-backend/logs"
LOG_FILE="${LOG_DIR}/watchdog.log"
STATE_FILE="${LOG_DIR}/watchdog.failcount"
BRAIN_URL="http://localhost:3000/api/health"
OMNIROUTER_URL="http://localhost:20128/health"
FAIL_THRESHOLD=3

mkdir -p "${LOG_DIR}"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >> "${LOG_FILE}"; }

brain_healthy() {
  curl -s -o /dev/null -m 10 -w '%{http_code}' "${BRAIN_URL}" | grep -q '^200$'
}

omniroute_status() {
  curl -s -o /dev/null -m 10 -w '%{http_code}' "${OMNIROUTER_URL}" 2>/dev/null || echo '000'
}

fail_count=0
[ -f "${STATE_FILE}" ] && fail_count="$(cat "${STATE_FILE}" 2>/dev/null || echo 0)"

if brain_healthy; then
  if [ "${fail_count}" -gt 0 ]; then
    log "brain healthy again after ${fail_count} failed probe(s)"
  fi
  echo 0 > "${STATE_FILE}"
else
  fail_count=$((fail_count + 1))
  echo "${fail_count}" > "${STATE_FILE}"
  log "brain UNHEALTHY (${fail_count}/${FAIL_THRESHOLD}) — ${BRAIN_URL} not 200"
  if [ "${fail_count}" -ge "${FAIL_THRESHOLD}" ]; then
    log "THRESHOLD REACHED — restarting evabot-brain"
    systemctl restart evabot-brain && log "systemctl restart evabot-brain OK" || log "ERROR: systemctl restart evabot-brain failed (need root?)"
    echo 0 > "${STATE_FILE}"
  fi
fi

omni="$(omniroute_status)"
if [ "${omni}" != "200" ]; then
  log "omniroute not healthy on :20128 (HTTP ${omni}) — logged, no restart action"
fi
