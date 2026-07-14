#!/usr/bin/env bash
# Install Playwright Chromium only when screenshot or browser automation is needed.
# Do not add this to environment.json install — it downloads ~150–200 MB per cold VM.
set -euo pipefail
cd "$(dirname "$0")/../.."
npm install playwright --no-save
npx playwright install chromium
