# Store screenshots

Signed-in marketing screenshots for Google Play / App Store listings.

| Folder | Size | Files |
|--------|------|-------|
| `phone/` | 390×844 | `01-match`, `02-adventure`, `04-shop`, `05-quests` |
| `tablet-7/` | 600×1024 | `01-match`, `02-adventure`, `04-shop`, `05-decks` |
| `tablet-10/` | 1200×1920 | same |

Regenerate (requires `SCREENSHOT_EMAIL` and `SCREENSHOT_PASSWORD` for signed-in shots):

```bash
npm run screenshots:auth      # phone + both tablets (signed in)
npm run screenshots:tablet    # 7″ and 10″ only (signed in)
npm run screenshots:tablet:guest  # 7″ and 10″ guest mode (no credentials)
```

Phone only: `SCREENSHOT_SIZES=phone npm run screenshots:auth`
