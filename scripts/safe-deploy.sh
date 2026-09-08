#!/usr/bin/env bash
#
# safe-deploy.sh — atomic deploy with health gate + automatic rollback
# for evabot.online (evabot-brain.service).
#
# Usage: npm run deploy   (or)   bash scripts/safe-deploy.sh
#
# Flow:
#   1. Pre-flight (git dirty warning, npm run build)
#   2. Health baseline (abort if service is already unhealthy)
#   3. Release tarball snapshot -> backups/releases/<ts>.tar.gz + manifest
#   4. systemctl restart
#   5. Health gate (30s): /api/health status=online + POST /api/models/command
#   6. SUCCESS -> update backups/releases/CURRENT pointer
#   7. FAILURE -> automatic rollback to previous release
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
KEEP_RELEASES=10

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[0;33m'; BLUE='\033[0;34m'; NC='\033[0m'
info()  { echo -e "${BLUE}[deploy]${NC} $*"; }
ok()    { echo -e "${GREEN}[ok]${NC} $*"; }
warn()  { echo -e "${YELLOW}[warn]${NC} $*"; }
fail()  { echo -e "${RED}[fail]${NC} $*"; }

# ---------------------------------------------------------------
# Health probe: /api/health must report status=online (HTTP 200)
# and POST /api/models/command must return HTTP 200.
# ---------------------------------------------------------------
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

# Health gate: retry every 2s up to GATE_SECONDS.
health_gate() {
  local deadline=$(( $(date +%s) + GATE_SECONDS ))
  while [ "$(date +%s)" -lt "$deadline" ]; do
    if health_check; then return 0; fi
    sleep 2
  done
  return 1
}

# ---------------------------------------------------------------
# Prune: keep last KEEP_RELEASES standard releases (ISO ts names).
# Never touches pre-rollback-* snapshots, CURRENT, manifests of kept ones.
# ---------------------------------------------------------------
prune_releases() {
  mkdir -p "$RELEASES_DIR"
  local old
  while IFS= read -r old; do
    local base="${old%.tar.gz}"
    rm -f "$RELEASES_DIR/$old" "$RELEASES_DIR/$base.manifest.txt"
    info "pruned old release: $old"
  done < <(ls -1 "$RELEASES_DIR" 2>/dev/null \
           | grep -E '^[0-9]{8}-[0-9]{6}\.tar\.gz$' \
           | sort -r | tail -n +$(( KEEP_RELEASES + 1 )))
}

# ---------------------------------------------------------------
# Rollback: restore given tarball, restart, verify health.
# Sets global ROLLBACK_OK=yes/no.
# ---------------------------------------------------------------
do_rollback() {
  local tarball="$1"
  ROLLBACK_OK=no
  info "restoring previous release: $(basename "$tarball")"
  rm -rf "$REPO_ROOT/dist"
  tar -xzf "$tarball" -C "$REPO_ROOT"
  sudo systemctl restart "$SERVICE"
  if health_gate; then
    ROLLBACK_OK=yes
    ok "service is healthy again on previous release"
  else
    fail "service STILL unhealthy after rollback — manual intervention required"
    fail "check: journalctl -u $SERVICE -n 100"
  fi
}

# =================================================================
# 1. Pre-flight
# =================================================================
info "repo root: $REPO_ROOT"

if [ -n "$(git status --porcelain 2>/dev/null | head -20 || true)" ]; then
  warn "git worktree is DIRTY — deploying uncommitted state"
  git status --porcelain | head -20
else
  ok "git worktree clean @ $(git rev-parse --short HEAD)"
fi

info "running build: npm run build"
npm run build
ok "build succeeded"

# =================================================================
# 2. Health baseline
# =================================================================
if health_check; then
  ok "health baseline: service healthy"
else
  fail "health baseline FAILED — service is currently unhealthy"
  fail "fix the running service first (journalctl -u $SERVICE) before deploying"
  exit 1
fi

# =================================================================
# 3. Create release snapshot (tar.gz) + manifest
# =================================================================
mkdir -p "$RELEASES_DIR"
TS="$(date +%Y%m%d-%H%M%S)"
TARBALL="$RELEASES_DIR/$TS.tar.gz"
MANIFEST="$RELEASES_DIR/$TS.manifest.txt"
PREV_RELEASE=""
if [ -f "$RELEASES_DIR/CURRENT" ]; then
  PREV_RELEASE="$(cat "$RELEASES_DIR/CURRENT")"
fi

TAR_PATHS=(dist public package.json package-lock.json)
if [ -d "$REPO_ROOT/docs-site/public" ]; then
  TAR_PATHS+=(docs-site/public)
fi

info "creating release snapshot: $(basename "$TARBALL")"
tar -czf "$TARBALL" -C "$REPO_ROOT" "${TAR_PATHS[@]}"

{
  echo "release: $TS"
  echo "git_head: $(git rev-parse HEAD)"
  echo "date: $(date -u '+%Y-%m-%dT%H:%M:%SZ')"
  echo "npm_version: $(node -p "require('./package.json').version")"
  echo "contents: ${TAR_PATHS[*]}"
} > "$MANIFEST"

prune_releases

# =================================================================
# 4. Atomic switch + restart
# =================================================================
info "restarting $SERVICE"
if ! sudo systemctl restart "$SERVICE"; then
  fail "systemctl restart FAILED"
  if [ -n "$PREV_RELEASE" ] && [ -f "$RELEASES_DIR/$PREV_RELEASE.tar.gz" ]; then
    fail "starting AUTOMATIC ROLLBACK to $PREV_RELEASE"
    do_rollback "$RELEASES_DIR/$PREV_RELEASE.tar.gz"
    if [ "$ROLLBACK_OK" = "yes" ]; then
      echo -e "${RED}=== ROLLBACK DONE — deploy failed at restart, previous release restored ===${NC}"
    else
      echo -e "${RED}=== ROLLBACK FAILED — manual intervention required ===${NC}"
    fi
  else
    warn "no previous release to roll back to (CURRENT=$PREV_RELEASE)"
  fi
  exit 1
fi

# =================================================================
# 5. Health gate
# =================================================================
if health_gate; then
  echo "$TS" > "$RELEASES_DIR/CURRENT"
  ok "health gate PASSED: /api/health=online, POST /api/models/command=200"
  echo
  echo -e "${GREEN}=====================================================${NC}"
  echo -e "${GREEN} DEPLOY SUCCESS — release $TS is live${NC}"
  echo -e "${GREEN}=====================================================${NC}"
  info "git:        $(git rev-parse --short HEAD)"
  info "release:    $TARBALL"
  info "manifest:   $MANIFEST"
  info "rollback:   npm run rollback"
  exit 0
fi

# =================================================================
# 6. FAILURE -> automatic rollback
# =================================================================
echo -e "${RED}[fail]${NC} health gate FAILED within ${GATE_SECONDS}s after restart"
journalctl -u "$SERVICE" --since "1 minute ago" --no-pager -n 30 || true

if [ -n "$PREV_RELEASE" ] && [ -f "$RELEASES_DIR/$PREV_RELEASE.tar.gz" ]; then
  echo -e "${RED}=== STARTING AUTOMATIC ROLLBACK to $PREV_RELEASE ===${NC}"
  do_rollback "$RELEASES_DIR/$PREV_RELEASE.tar.gz"
  if [ "$ROLLBACK_OK" = "yes" ]; then
    echo -e "${RED}=====================================================${NC}"
    echo -e "${RED} ROLLBACK DONE — previous release $PREV_RELEASE is live${NC}"
    echo -e "${RED} New release $TS was reverted. Site is up and healthy.${NC}"
    echo -e "${RED}=====================================================${NC}"
  else
    echo -e "${RED}=== ROLLBACK COULD NOT RESTORE HEALTH — investigate manually ===${NC}"
  fi
  exit 1
else
  fail "no previous release available for rollback (CURRENT pointer was empty)"
  fail "site is DOWN with release $TS — check journalctl -u $SERVICE"
  echo "$TS" > "$RELEASES_DIR/CURRENT"
  exit 1
fi
