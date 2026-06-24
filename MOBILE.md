# Arcane Checkers — Mobile & App Store Guide

This game is a **mobile-first web app** (HTML/CSS/JS). Ship it via **PWA** (Add to Home Screen) or wrap with **[Capacitor](https://capacitorjs.com/)** for the Apple App Store and Google Play.

## What’s in the repo

| Item | Purpose |
|------|---------|
| `css/mobile-game.css` | Bottom tab bar, safe areas, touch targets, match UI polish, install banner, chest reveals, deck editor, profile/quests, mystery box, PvP history, account settings, prebattle |
| `js/mobileConfirm.js` | Bottom-sheet confirm on phones (leave match, resume, tutorial skip) |
| `js/installPrompt.js` | Add-to-home-screen install banner (Chrome + iOS hint) |
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
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android @capacitor/splash-screen
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

---

## Path to the App Store (iOS)

### Prerequisites

- **Mac** with **Xcode** (required to build and upload iOS apps)
- **Apple Developer Program** — [developer.apple.com](https://developer.apple.com/programs/) — **$99/year**
- **Node.js** 18+ on your Mac

### Configure Xcode

In Xcode (opened via `npm run cap:ios`):

1. Select the **App** target → **Signing & Capabilities** → choose your **Team** and enable **Automatically manage signing**.
2. Set **Display Name**, **Version**, and **Build** numbers.
3. Add app icons: **Assets.xcassets → AppIcon** — drag in `icons/icon-512.png` or export 1024×1024 from `icons/icon.svg`.
4. **Deployment Info**: iPhone, portrait (matches `manifest.json` orientation).
5. Build and run on a **physical device** (Simulator is fine for UI; test gameplay on device).

### App Store Connect listing

1. Go to [App Store Connect](https://appstoreconnect.apple.com/).
2. **My Apps** → **+** → **New App** → iOS, name, bundle ID, SKU.
3. Fill **metadata**: description, keywords, category (**Games**), age rating questionnaire, privacy policy URL (required if you collect data via Supabase).
4. **Screenshots**: use `screenshots/` or capture 6.7", 6.5", and 5.5" iPhone sizes from Simulator.
5. **App Privacy**: declare data practices.

### Submit for review

1. In Xcode: **Product → Archive** → **Distribute App** → **App Store Connect**.
2. In App Store Connect: attach the build, complete **Export Compliance**, submit for **Review**.

Review usually takes **1–3 days**. Test the **release** build on a real phone first.

---

## Google Play (Android)

```bash
npm install @capacitor/android   # if not already added via cap:init
npx cap add android
npx cap sync android
npm run cap:android
```

- **Google Play Console** — one-time **$25** registration.
- Upload **AAB** from Android Studio; add store listing, screenshots, content rating, and data safety forms.

---

## Regenerate screenshots

```bash
python3 -m http.server 8765 &
npm run screenshots
```

Writes PNGs into `screenshots/` for README and store listings.

---

## Updating the game

1. Change HTML/CSS/JS in this repo and deploy (or copy files into the Capacitor `webDir`).
2. Run `npm run cap:sync` and rebuild in Xcode / Android Studio.
3. Bump version/build numbers and submit an update.

---

## Checklist before first submission

- [ ] Test deck builder, shop, profile, and a full adventure match on a **real phone**
- [ ] Replace placeholder bundle ID and developer account
- [ ] High-quality **1024×1024** App Store icon (export from `icons/icon.svg`)
- [ ] Screenshots and short description
- [ ] Privacy policy URL (even a simple GitHub Pages doc is fine)
- [ ] No broken external links in production build

For questions specific to Capacitor: [capacitorjs.com/docs](https://capacitorjs.com/docs).
