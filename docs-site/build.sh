#!/usr/bin/env bash
# EvaBot Docs build helper: install deps if missing, then build Quartz site.
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -d node_modules ]; then
  echo "[build] node_modules missing -> npm ci"
  npm ci
fi

npx quartz build "$@"
echo "Build complete -> $(pwd)/public"
