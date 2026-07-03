#!/bin/sh
# Build the Vite bundle and copy into Capacitor webDir (www/)
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/www"
cd "$ROOT"
npm run build
rm -rf "$OUT"
mkdir -p "$OUT"
cp -R "$ROOT/dist/." "$OUT/"
echo "Built and synced web app to www/"
