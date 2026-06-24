# Arcane Checkers — Mobile & App Store Guide

This game is built as a **mobile-first web app** (HTML/CSS/JS). You can ship it to the **Apple App Store** and **Google Play** by wrapping the same files in a native shell. The recommended tool is **[Capacitor](https://capacitorjs.com/)** (from the Ionic team).

## What’s already in the repo

| Item | Purpose |
|------|---------|
| `css/mobile-game.css` | Bottom tab bar, safe areas, touch targets, stacked deck builder |
| `manifest.json` | Installable PWA metadata |
| `icons/` | App icon source (`icon.svg`) and PNG sizes for stores |

Test on a phone: open your deployed URL (e.g. GitHub Pages) in Safari/Chrome, or use **Add to Home Screen** for a full-screen feel.

---

## Path to the App Store (iOS)

### 1. Prerequisites

- **Mac** with **Xcode** (required to build and upload iOS apps)
- **Apple Developer Program** — [developer.apple.com](https://developer.apple.com/programs/) — **$99/year**
- **Node.js** 18+ on your Mac

### 2. Wrap the game with Capacitor

From the project root on your Mac:

```bash
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/ios
npx cap init "Arcane Checkers" com.yourname.arcanecheckers --web-dir .
npx cap add ios
npx cap sync ios
npx cap open ios
```

- **`webDir`**: use `.` because this repo serves static files from the root (`index.html`, `js/`, `css/`).
- **Bundle ID**: must be unique (e.g. `com.yourname.arcanecheckers`).

### 3. Configure Xcode

In Xcode (opened via `npx cap open ios`):

1. Select the **App** target → **Signing & Capabilities** → choose your **Team** and enable **Automatically manage signing**.
2. Set **Display Name**, **Version**, and **Build** numbers.
3. Add app icons: **Assets.xcassets → AppIcon** — drag in `icons/icon-512.png` and let Xcode generate sizes, or use an icon generator.
4. **Deployment Info**: iPhone, portrait (matches `manifest.json` orientation).
5. Build and run on a **physical device** (Simulator is fine for UI; test gameplay on device).

### 4. App Store Connect listing

1. Go to [App Store Connect](https://appstoreconnect.apple.com/).
2. **My Apps** → **+** → **New App** → iOS, name, bundle ID, SKU.
3. Fill **metadata**: description, keywords, category (**Games**), age rating questionnaire, privacy policy URL (required if you collect data; local-only saves in `localStorage` may still need a simple privacy page).
4. **Screenshots**: 6.7", 6.5", and 5.5" iPhone sizes (capture from device or Simulator).
5. **App Privacy**: declare data practices (e.g. “Data Not Collected” if everything stays on device).

### 5. Submit for review

1. In Xcode: **Product → Archive** → **Distribute App** → **App Store Connect**.
2. In App Store Connect: attach the build, complete **Export Compliance** (games with only on-device logic often qualify for exemptions), submit for **Review**.

Review usually takes **1–3 days**. Common rejections: broken login, placeholder content, missing privacy policy, or crashes on launch — always test the **release** build on a real phone first.

---

## Google Play (Android)

```bash
npm install @capacitor/android
npx cap add android
npx cap sync android
npx cap open android
```

- **Google Play Console** — one-time **$25** registration.
- Create an app, upload **AAB** (Android App Bundle) from Android Studio, add store listing and screenshots, complete content rating and data safety forms.

---

## Optional: service worker (offline)

For offline play after install, add a small `sw.js` that caches `index.html`, `css/*`, and `js/*`. Capacitor already bundles assets in the native app, so offline is less critical for store builds than for browser PWA.

---

## Updating the game

1. Change HTML/CSS/JS in this repo and deploy (or copy files into the Capacitor `webDir`).
2. Run `npx cap sync` and rebuild in Xcode / Android Studio.
3. Bump version/build numbers and submit an update.

---

## Checklist before first submission

- [ ] Test deck builder, vault, profile, and a full adventure match on a **real phone**
- [ ] Replace placeholder bundle ID and developer account
- [ ] High-quality **1024×1024** App Store icon (export from `icons/icon.svg`)
- [ ] Screenshots and short description
- [ ] Privacy policy URL (even a simple GitHub Pages doc is fine)
- [ ] No broken external links in production build

For questions specific to Capacitor: [capacitorjs.com/docs](https://capacitorjs.com/docs).
