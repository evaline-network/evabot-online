#!/usr/bin/env bash
# sync-docs.sh — sync documentation sources into the Quartz site content tree,
# then rebuild the docs site (docs-site/public) for nginx to serve.
#
# Docs sources (source of truth): <root>/docs/, <root>/WORKLOG.md, <root>/MANIFESTO.md
# Site content: <root>/docs-site/content/
#
# Sync is frontmatter-aware: site pages carry Quartz frontmatter (title/date/tags)
# that raw sources don't have. For each mapping:
#   - source has frontmatter  -> copied as-is
#   - dest exists with fm     -> keep dest frontmatter, replace body with source
#   - dest missing            -> generate frontmatter (title from first H1, date from mtime)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DOCS="$ROOT/docs"
CONTENT="$ROOT/docs-site/content"

log() { printf '[sync-docs] %s\n' "$*"; }

has_frontmatter() {
  [ -f "$1" ] && head -1 "$1" | grep -q '^---[[:space:]]*$'
}

frontmatter_of() {
  awk 'NR==1{next} /^---[[:space:]]*$/{exit} {print}' "$1"
}

body_of() {
  if has_frontmatter "$1"; then
    awk 'NR==1{next} /^---[[:space:]]*$/{if(seen){exit}else{seen=1;next}} seen{print}' "$1"
  else
    cat "$1"
  fi
}

strip_leading_blanks() {
  awk 'found || $0 !~ /^[[:space:]]*$/{found=1; print}'
}

title_of() {
  local t
  t="$(grep -m1 '^# ' "$1" | sed 's/^#[[:space:]]*//' || true)"
  [ -z "${t:-}" ] && t="$(basename "$1" .md)"
  printf '%s' "$t"
}

# Quote scalar YAML values that contain ": " (inner colon breaks naive parsing)
fm_sanitize() {
  awk '
    /^[[:space:]]*[A-Za-z0-9_-]+:[[:space:]]/ {
      line=$0
      val=$0; sub(/^[^:]*:[[:space:]]*/, "", val)
      if (val != "" && val !~ /^["\[{]/ && val ~ /:([[:space:]]|$)/) {
        gsub(/"/, "\\\"", val)
        sub(/:[[:space:]].*/, "", line)
        print line ": \"" val "\""
        next
      }
      print
      next
    }
    { print }
  '
}

sync_file() {
  local src="$1" dest="$2"
  if [ ! -f "$src" ]; then
    log "WARN: missing source $src — skipped"
    return 0
  fi
  mkdir -p "$(dirname "$dest")"
  local fm="" body tmp
  body="$(body_of "$src" | strip_leading_blanks)"
  if has_frontmatter "$src"; then
    fm="$(frontmatter_of "$src" | fm_sanitize)"
  elif [ -f "$dest" ] && has_frontmatter "$dest"; then
    fm="$(frontmatter_of "$dest" | fm_sanitize)"
  else
    fm="$(printf 'title: "%s"\ndate: "%s"\n' "$(title_of "$src")" "$(date -r "$src" +%F)")"
  fi
  tmp="$(mktemp)"
  { printf -- '---\n%s\n---\n\n' "$fm"; printf '%s\n' "$body"; } > "$tmp"
  if [ -f "$dest" ] && cmp -s "$tmp" "$dest"; then
    log "up-to-date: ${dest#"$ROOT"/}"
  else
    mv "$tmp" "$dest"
    log "synced: ${src#"$ROOT"/} -> ${dest#"$ROOT"/}"
  fi
}

# --- 1. architecture/ -------------------------------------------------------
for f in "$DOCS"/architecture/*.md; do
  sync_file "$f" "$CONTENT/architecture/$(basename "$f")"
done

# --- 2. models/ -------------------------------------------------------------
for f in "$DOCS"/models/*.md; do
  sync_file "$f" "$CONTENT/models/$(basename "$f")"
done

# --- 3. ops/ (incl. known ops docs missing from the site) -------------------
for f in "$DOCS"/ops/*.md; do
  sync_file "$f" "$CONTENT/ops/$(basename "$f")"
done

# --- 4. reports/ ------------------------------------------------------------
for f in "$DOCS"/reports/*.md; do
  sync_file "$f" "$CONTENT/reports/$(basename "$f")"
done

# --- 5. dev/ (root-level dev docs live in docs/ root or subdirs) ------------
sync_file "$DOCS/COMMANDS.md"                     "$CONTENT/dev/COMMANDS.md"
sync_file "$DOCS/kanban/KANBAN.md"                "$CONTENT/dev/KANBAN.md"
sync_file "$DOCS/kanban/README.md"                "$CONTENT/dev/KANBAN-README.md"
sync_file "$DOCS/development/CODE_AUDIT_v0.0.2.md" "$CONTENT/dev/CODE_AUDIT_v0.0.2.md"

# --- 6. journal/ ------------------------------------------------------------
sync_file "$ROOT/WORKLOG.md" "$CONTENT/journal/WORKLOG.md"

# --- 7. overview/ (root manifests) ------------------------------------------
sync_file "$ROOT/MANIFESTO.md" "$CONTENT/overview/MANIFESTO.md"

# --- 8. model monitor (live report -> journal, must land BEFORE quartz build) -
sync_file "$ROOT/data/model-monitor/REPORT.md" "$CONTENT/journal/MODEL_MONITOR.md"

# --- 9. build ---------------------------------------------------------------
cd "$ROOT/docs-site"
log "running quartz build..."
./quartz/bootstrap-cli.mjs build
log "build complete -> $ROOT/docs-site/public"
