#!/usr/bin/env bash
#
# rollback.sh — instant manual rollback for evabot.online.
#
# Usage:
#   npm run rollback                 (interactive: pick release by number)
#   bash scripts/rollback.sh 20260908-184500   (direct, by timestamp)
#
# Safety: the CURRENT (live) state is snapshotted first as
# backups/releases/pre-rollback-<now>.tar.gz, so a rollback is itself
# reversible. Never touches data/, logs/, .env.
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

RELEASES_DIR="$REPO_ROOT/backups/releases"
SERVICE="evabot-brain"
HEALTH_URL="http://localhost:3000/api/health"
COMMAND_URL="http://localhost:3000/api/models/command"
GATE_SECONDS=30

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[0;33m'; BLUE='\033[0;34m'; NC='\033[0m'
info() { echo -e "${BLUE}[rollback]${NC} $*"; }
ok()   { echo -e "${GREEN}[ok]${NC} $*"; }
warn() { echo -e "${YELLOW}[warn]${NC} $*"; }
fail() { echo -e "${RED}[fail]${NC} $*"; }

health_check() {
  local body
  body="$(curl -sf -m 5 "$HEALTH_URL" 2>/dev/null)" || return 1
  echo "$body" | grep -q '"status":"online"' || return 1

  local code
  code="$(curl -s -m 10 -o /dev/null -w '%{http_code}' \
    -X POST "$COMMAND_URL" \
    -H 'Content-Type: application/json' \
    -d '{"command":"/help"}' 2>/dev/null)" || return 1
  [ "$code" = "200" ]
}

health_gate() {
  local deadline=$(( $(date +%s) + GATE_SECONDS ))
  while [ "$(date +%s)" -lt "$deadline" ]; do
    if health_check; then return 0; fi
    sleep 2
  done
  return 1
}

# --- List releases (newest first), show manifest summary -----------------
mapfile -t releases < <(
  ls -1 "$RELEASES_DIR" 2>/dev/null | grep -E '^[0-9]{8}-[0-9]{6}\.tar\.gz$' | sort -r
)

if [ "${#releases[@]}" -eq 0 ]; then
  fail "no releases found in $RELEASES_DIR"
  exit 1
fi

current="$(cat "$RELEASES_DIR/CURRENT" 2>/dev/null || echo '<none>')"

echo
echo "Available releases (newest first): CURRENT=$current"
echo "----------------------------------------------------------------"
for i in "${!releases[@]}"; do
  name="${releases[$i]}"
  ts="${name%.tar.gz}"
  marker=" "
  [ "$ts" = "$current" ] && marker="*"
  first_head="$(grep -m1 '^git_head:' "$RELEASES_DIR/$ts.manifest.txt" 2>/dev/null | cut -d' ' -f2 || true)"
  printf "%s %2d) %s  (%s)\n" "$marker" "$((i + 1))" "$ts" "${first_head:-?}"
done
echo "----------------------------------------------------------------"
echo "  * = currently deployed"

# --- Pick release ---------------------------------------------------------
chosen_ts="${1:-}"
if [ -n "$chosen_ts" ]; then
  chosen_ts="${chosen_ts%.tar.gz}"
  valid=no
  for name in "${releases[@]}"; do
    [ "${name%.tar.gz}" = "$chosen_ts" ] && valid=yes
  done
  if [ "$valid" != "yes" ]; then
    fail "release '$chosen_ts' not found"
    exit 1
  fi
else
  printf "Select release number to ROLLBACK to: "
  read -r num
  idx=$(( num - 1 ))
  if [ "$num" != "${num//[^0-9]/}" ] || [ "$idx" -lt 0 ] || [ "$idx" -ge "${#releases[@]}" ]; then
    fail "invalid selection: '$num'"
    exit 1
  fi
  chosen_ts="${releases[$idx]%.tar.gz}"
fi

target="$RELEASES_DIR/$chosen_ts.tar.gz"

if [ "$chosen_ts" = "$current" ]; then
  warn "'$chosen_ts' is the currently deployed release — re-deploying same files"
fi

# --- Validate target tarball ------------------------------------------------
local_tar_entries="$(tar -tzf "$target" 2>/dev/null)" || {
  fail "cannot read target tarball: $target"
  exit 1
}
echo "$local_tar_entries" | grep -q '^dist/server/server\.js$' || {
  fail "target tarball is invalid: missing dist/server/server.js"
  exit 1
}

# --- Safety snapshot of live state (rollback is reversible) ---------------
pre_ts="$(date +%Y%m%d-%H%M%S)"
pre_tarball="$RELEASES_DIR/pre-rollback-$pre_ts.tar.gz"
info "snapshotting CURRENT state -> $(basename "$pre_tarball")"
PRE_PATHS=(dist public package.json package-lock.json)
if [ -d "$REPO_ROOT/docs-site/public" ]; then
  PRE_PATHS+=(docs-site/public)
fi
tar -czf "$pre_tarball" -C "$REPO_ROOT" "${PRE_PATHS[@]}"

# --- Restore target release -----------------------------------------------
info "restoring release $chosen_ts over $REPO_ROOT"
rm -rf "$REPO_ROOT/dist"
tar -xzf "$target" -C "$REPO_ROOT"

# --- Restart + health gate -------------------------------------------------
info "restarting $SERVICE"
if ! sudo systemctl restart "$SERVICE"; then
  fail "systemctl restart FAILED after restore"
  fail "check: journalctl -u $SERVICE -n 100"
  exit 1
fi

if health_gate; then
  echo "$chosen_ts" > "$RELEASES_DIR/CURRENT"
  echo -e "${GREEN}=====================================================${NC}"
  echo -e "${GREEN} ROLLBACK SUCCESS — release $chosen_ts is live${NC}"
  echo -e "${GREEN}=====================================================${NC}"
  ok "health: /api/health=online, POST /api/models/command=200"
  ok "pre-rollback snapshot saved: $(basename "$pre_tarball")"
  exit 0
fi

echo -e "${RED}[fail]${NC} health gate FAILED after rollback within ${GATE_SECONDS}s"
journalctl -u "$SERVICE" --since "1 minute ago" --no-pager -n 30 || true

# Automatic recovery: re-restore the pre-rollback snapshot of the live state.
echo -e "${RED}=== ROLLBACK FAILED — attempting to restore pre-rollback snapshot ===${NC}"
pre_tar_entries="$(tar -tzf "$pre_tarball" 2>/dev/null)" || pre_tar_entries=""
echo "$pre_tar_entries" | grep -q '^dist/server/server\.js$' || {
  fail "pre-rollback snapshot is also invalid — manual intervention required"
  echo "$chosen_ts" > "$RELEASES_DIR/CURRENT"
  exit 1
}
rm -rf "$REPO_ROOT/dist"
tar -xzf "$pre_tarball" -C "$REPO_ROOT"
sudo systemctl restart "$SERVICE"
if health_gate; then
  echo -e "${YELLOW}=== RESTORED — previous live state is back and healthy; '${chosen_ts}' is NOT live ===${NC}"
  exit 1
fi
fail "pre-rollback snapshot ALSO failed the health gate — manual intervention required"
fail "check: journalctl -u $SERVICE -n 100"
exit 1
