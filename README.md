# Arcane Checkers

Classic checkers with a collectible spell-card layer. Earn **10 gems per win** to open chests and grow your collection. Spend **10 gems** to draw a random card, play effects on your turn, then make a normal checkers move.

## Game modes

1. **Chests** — Spend gems to open chests and grow your collection (economy spells are disabled).
2. **Deck Builder** — Build a 30-card deck (max 4 copies for commons/uncommons, max 3 for rares/epics/legendaries) from cards you own.
3. **Play** — Choose a deck and battle the AI (PvP planned).

### Match rules

- Start with **3 cards** in hand (max **5**)
- Play **1 spell** per turn, then move
- Draw **1 card every 2 turns** from your deck

## Play online

**[Play Arcane Checkers on GitHub Pages](https://kwonseokhyun1-jpg.github.io/checkers/)**

The site deploys automatically when changes are pushed to `main`.

**First-time setup:** In the repo go to **Settings → Pages**, set **Source** to **Deploy from a branch**, choose branch **`gh-pages`** and folder **`/ (root)`**, then save. After the first deploy workflow finishes (Actions tab), the link above will work within a minute or two.

## Play locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8080
```

Then visit http://localhost:8080

## Cards

| Card | Effect |
|------|--------|
| **Nudge** | Displace your piece 1 square to an adjacent empty dark square |
| **Aegis** | Shield a piece from capture for 2 turns |
| **Forward Bolt** | Destroy the first enemy along your piece's forward diagonal |
| **Frost Bind** | Freeze an enemy — it skips its next move |
| **Retreat** | Piece can move (and jump) backward for 3 turns |
| **Knight's Sigil** | Piece moves like a chess knight permanently |
| **Royal Decree** | Instantly crown a piece |
| **Shadow Swap** | Swap two of your pieces |
| **Bonus Step** | After your move, move the same piece again (non-capture) |
| **Gem Cache** | Gain 20 gems |
| **Shatter** | Destroy any unshielded enemy piece |
| **Blink** | Teleport your piece to any empty dark square within 2 steps |

## Rules

- You play as **Ruby Legion** (red, bottom). **Shadow Court** (black, top) is the AI.
- On your turn: play any number of cards (optional), tap **Done playing cards**, then move.
- Mandatory jumps when available; multi-jump chains when possible.
- Reach the far row to crown, or use **Royal Decree**.

## Online accounts & PvP

See **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** for Supabase auth, cloud saves, and 1v1 PvP.

## Mobile & App Store

The UI is optimized for phones (bottom navigation, safe areas, touch targets). See **[MOBILE.md](MOBILE.md)** for wrapping the game with Capacitor and submitting to the Apple App Store and Google Play.
