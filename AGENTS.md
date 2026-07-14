# Cloud agent guidelines

## Egress (network usage)

Cloud agent VMs have a monthly egress limit. Avoid burning it on repeated large downloads.

### Do not run on every task

- `npx playwright install chromium` or `npm ci` unless the user explicitly asks for screenshots or a clean install
- Store screenshot regeneration loops (`npm run screenshots:*` repeated with build + push)
- Android/iOS native builds (`cap sync`, Gradle) in the cloud agent unless required

Playwright is **not** installed during environment startup. When browser automation is truly needed, run once per session:

```bash
.cursor/scripts/install-playwright.sh
```

### Prefer instead

- `npm install` when `node_modules` already exists (incremental)
- `npm run build` and unit/smoke tests for verification
- GitHub Actions (`.github/workflows/ci.yml`) for Playwright and screenshot CI
- Local machine for store screenshot capture and binary asset pushes

### Screenshots and store assets

If the user needs Play Store / App Store screenshots, suggest running capture locally or via GitHub Actions rather than regenerating many PNGs inside a cloud agent session.
