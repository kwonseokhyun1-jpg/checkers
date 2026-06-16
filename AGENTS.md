# AGENTS.md

## Cursor Cloud specific instructions

Arcane Checkers is a **static, vanilla HTML/CSS/JS web app** (no framework, no bundler, no
`package.json`/lockfile). The only runtime dependency is `@supabase/supabase-js`, imported in the
browser from the `esm.sh` CDN, so **the page needs internet access to load**. Node 22 and Python 3
are preinstalled.

### Run the app (dev)
Serve the repo root with any static server and open the URL — see `README.md`:
```
python3 -m http.server 8080   # then open http://localhost:8080
```
Hot reload is just a browser refresh (no build step / no watcher).

### Auth gate (important, non-obvious)
`js/supabaseConfig.js` is committed with **live hosted Supabase keys**, so the whole game is gated
behind an account screen ("Create account" / "Sign in"). To reach the game you must create or sign
into an account against the live Supabase project. Email confirmation is disabled, so **Create
account signs you in immediately** and reveals the game (single-player vs AI, deck builder, shop,
quests all work after sign-in). PvP additionally uses Supabase Realtime.

### Lint / test / build
- **Lint:** `bash scripts/validate-js.sh` (runs `node --check` on every `js/*.js`).
- **Logic tests:** `node scripts/test-*.mjs` (each is standalone, no deps).
- **Smoke/E2E (CI):** needs Playwright + Chromium (provided by the update script), then
  `node scripts/smoke-test.mjs http://127.0.0.1:8080/index.html`.
- There is **no build step**; CI (`.github/workflows/deploy-pages.yml`) only validates JS, runs the
  smoke test, and deploys the root to `gh-pages`.

### Known pre-existing failures (NOT environment issues — do not "fix" as setup)
- `scripts/smoke-test.mjs` fails (and fails identically in GitHub Actions CI) because it clicks the
  `play` tab, which is now hidden behind the auth gate added later. The page itself loads with no JS
  errors.
- `scripts/test-pvp-live.mjs` and `scripts/test-pvp-sync.mjs` import `@supabase/supabase-js` as a
  Node package (not the CDN) and need live Supabase credentials — they are not part of CI.
- `scripts/test-small-mystery-box.mjs` fails on a stochastic/logic assertion independent of the
  environment.
