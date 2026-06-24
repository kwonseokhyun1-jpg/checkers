# Arcane Checkers — Mobile & App Store Guide

Ship the same HTML/CSS/JS build to phones via **PWA** (Add to Home Screen) or native stores with **[Capacitor](https://capacitorjs.com/)**.

## What’s in the repo

| Item | Purpose |
|------|---------|
| `icons/icon.svg` | Source app icon — red + black checker pieces, arcane spark |
| `icons/icon-192.png`, `icons/icon-512.png` | PWA / home-screen / store icon sizes |
| `manifest.json` | Installable PWA metadata |
| `css/splash.css` + `js/splash.js` | Animated cold-start splash (matches icon art) |
| `screenshots/` | README / store listing captures (regenerate with `npm run screenshots`) |
| `mobile/capacitor.config.example.json` | Copy to `capacitor.config.json` after `npx cap init` |

## Quick test (browser)

1. Serve the repo: `python3 -m http.server 8080`
2. Open on a phone or Chrome DevTools (≤390px width).
3. Reload — you should see the animated splash, then the game shell.
4. **Add to Home Screen** — the red/black icon should appear on the launcher.

---

## Capacitor setup

From the project root (Node 18+):

```bash
npm install
npm run cap:init    # first time only — copies example config, adds iOS/Android
npm run cap:sync    # after any web asset change
npm run cap:ios     # open Xcode
npm run cap:android # open Android Studio
```

### First-time init (manual alternative)

```bash
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/splash-screen
npx cap init "Arcane Checkers" com.yourname.arcanecheckers --web-dir .
cp mobile/capacitor.config.example.json capacitor.config.json
# Edit appId in capacitor.config.json
npx cap add ios
npx cap add android
npx cap sync
```

- **`webDir`**: `.` — static files live at repo root (`index.html`, `js/`, `css/`).
- **Bundle ID**: must be unique (e.g. `com.yourname.arcanecheckers`).
- **Splash**: native launch uses `#080a12` (same as `manifest.json`); in-app animated splash runs on every web cold start.

### Xcode (iOS)

1. `npm run cap:ios`
2. **Signing & Capabilities** → your Team, automatic signing.
3. **Assets → AppIcon** — drag `icons/icon-512.png` or export 1024×1024 from `icons/icon.svg`.
4. Run on a **physical device** before App Store submission.

### Android Studio

1. `npm run cap:android`
2. Build → Generate Signed Bundle (AAB) for Play Console.

---

## App Store Connect checklist

- [ ] Unique bundle ID / application ID
- [ ] **1024×1024** icon (export from `icons/icon.svg`)
- [ ] Screenshots — use `screenshots/` or capture from Simulator (`npm run screenshots`)
- [ ] Privacy policy URL (required if you collect account data via Supabase)
- [ ] Test deck builder, shop, adventure match, and PvP on a real device

See [capacitorjs.com/docs](https://capacitorjs.com/docs) for platform-specific details.

---

## Regenerate screenshots

```bash
python3 -m http.server 8765 &
npm run screenshots
```

Writes PNGs into `screenshots/` for README and store listings.
