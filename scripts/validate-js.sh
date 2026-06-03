#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
failed=0
for f in "$root"/js/*.js; do
  if ! node --check "$f" >/dev/null 2>&1; then
    echo "Syntax error: ${f#$root/}"
    node --check "$f" 2>&1 || true
    failed=1
  fi
done
if [ "$failed" -ne 0 ]; then
  echo "JS validation failed."
  exit 1
fi
echo "All JS files OK ($(ls "$root"/js/*.js | wc -l) files)"
