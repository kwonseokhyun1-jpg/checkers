#!/bin/sh
# Copy static web app into Capacitor webDir (www/)
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/www"
rm -rf "$OUT"
mkdir -p "$OUT"
for item in index.html manifest.json css js assets icons supabase; do
  if [ -e "$ROOT/$item" ]; then
    cp -R "$ROOT/$item" "$OUT/"
  fi
done
echo "Synced web app to www/"
