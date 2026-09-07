#!/usr/bin/env bash
# secrets.sh — helper for EvaBot secrets in Google Cloud Secret Manager
# Project: evabot-agent-server | secrets prefixed evabot-
# Usage: secrets.sh {get|set|list|pull-env} [args]
#
#   get    <name>            print secret value (name without evabot- prefix ok)
#   set    <name> [file|-]   create secret or add new version (rotation)
#   list                     list all evabot-* secrets with version counts
#   pull-env                 output "export VAR=value" lines from all secrets
#
# Free-tier note: 6 active versions. `set` rotates a version (1/secret).

set -euo pipefail

PROJECT="evabot-agent-server"
PREFIX="evabot-"

_full_name() {
  local n="$1"
  [[ "$n" == "$PREFIX"* ]] && printf '%s' "$n" || printf '%s%s' "$PREFIX" "$n"
}

cmd_get() {
  local name; name="$(_full_name "$1")"
  gcloud secrets versions access latest --secret="$name" --project "$PROJECT"
}

cmd_set() {
  local name file; name="$(_full_name "$1")"; file="${2:--}"
  if gcloud secrets describe "$name" --project "$PROJECT" >/dev/null 2>&1; then
    # rotate: adds a new version (still 1 active version per secret)
    printf '' | gcloud secrets versions add "$name" --data-file="$file" --project "$PROJECT"
  else
    gcloud secrets create "$name" --data-file="$file" --project "$PROJECT"
  fi
}

cmd_list() {
  gcloud secrets list --project "$PROJECT" --filter="name:$PREFIX" \
    --format="table(name.basename():label=SECRET, version_count.latest:label=LATEST_VER, labels:label=LABELS)"
}

cmd_pull_env() {
  # Convert secret name evabot-foo-bar -> VAR FOO_BAR (uppercase, - -> _)
  for name in $(gcloud secrets list --project "$PROJECT" --filter="name:$PREFIX" --format="value(name.basename())"); do
    local var="${name#"$PREFIX"}"
    var="$(printf '%s' "$var" | tr '[:lower:]-' '[:upper:]_')"
    local val; val="$(gcloud secrets versions access latest --secret="$name" --project "$PROJECT")"
    # safe quoting: single-quote, escape embedded single quotes
    val="${val//\'/\'\\\'\'}"
    printf 'export %s='"'"'%s'"'"'\n' "$var" "$val"
  done
}

case "${1:-}" in
  get)      shift; cmd_get "$@" ;;
  set)      shift; cmd_set "$@" ;;
  list)     cmd_list ;;
  pull-env) cmd_pull_env ;;
  *) echo "Usage: $0 {get <name>|set <name> [file]|list|pull-env}" >&2; exit 1 ;;
esac
