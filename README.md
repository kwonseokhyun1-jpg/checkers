# Arcane Checkers

Classic checkers with a collectible spell-card layer. Build a **30-card deck**, battle through **Adventure** (50 floors across 5 worlds), open **Shop** chests to grow your collection, and challenge the AI or other players in **PvP**.

## App tabs

| Tab | What it does |
|-----|----------------|
| **Decks** | Build and save 30-card battle lists (max **3 copies** per spell). |
| **Shop** | Spend **gems** on spell chests; cosmetic boxes unlock at Adventure floor 5; spend **stars** on mystery boxes. |
| **Play** | Adventure map — clear floors for gems and stars. |
| **PvP** | Host or join 1v1 rooms (sign-in required). |
| **Quests** | Daily quests for gems and stars; title quests for mage titles (sign-in required). |

Profile and Settings are available from the header.

## Adventure

- **5 worlds × 10 floors** (50 levels total). Worlds 4–5 unlock after clearing floor 30.
- Each floor pits your deck against a themed AI opponent with its own spell deck.
- **First clear:** +50 gems · **Repeat clear:** +20 gems. Stars are awarded for strong performances and feed the Shop's star mystery boxes.
- Floor 50 unlocks **Challenge mode** on the final map.

## Match rules

- Start with **4 cards** in hand; draw **1 card every 2 turns** from your deck.
- On your turn: optionally cast **1 spell** (some cards like **Parallel** grant an extra cast), then make a normal checkers move.
- Mandatory jumps when available; multi-jump chains when possible.
- Reach the far row to crown, or use spells such as **Royal Decree**.

## Economy

| Currency | How to earn | How to spend |
|----------|-------------|--------------|
| **Gems** | Adventure clears, daily quests, duplicate refunds | Spell chests (Bronze 25 · Silver 50 · Gold 100), buying extra card copies in Decks |
| **Stars** | Adventure victories, daily quests | Star mystery boxes in Shop (cosmetics and spells) |

New profiles start with **200 gems**. Extra copies bought in the deck editor cost **10 / 20 / 30 / 40 / 50 gems** by rarity (common → legendary). Chest rarity odds are shown on each chest card in the Shop.

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

For Capacitor / native builds: `npm install` then see **[MOBILE.md](MOBILE.md)**.

## Screenshots

Store and marketing captures live in **`assets/store/`**:

| File | Scene |
|------|--------|
| `01-decks.png` | Deck list |
| `02-adventure.png` | Adventure map |
| `03-match.png` | In-match board + spell hand |
| `04-shop.png` | Shop / chests |
| `05-pvp.png` | PvP lobby |

Regenerate after major UI changes:

```bash
python3 -m http.server 8765 &
node scripts/capture-store-screenshots.mjs
```

See **[MOBILE.md](MOBILE.md)** for PWA install, animated splash, and Capacitor / App Store setup.

## Cards

**85 spells** across common, uncommon, rare, epic, and legendary rarities. Full descriptions: **[SPELLS.md](SPELLS.md)**.

A few highlights:

| Card | Effect |
|------|--------|
| **Nudge** | Displace your piece 1 square forward-diagonal onto an empty dark square |
| **Aegis** | Shield a piece from capture for 2 turns |
| **Forward Bolt** | Destroy the first enemy along your piece's forward diagonal |
| **Frost Bind** | Freeze an enemy — it skips its next move |
| **Knight's Sigil** | Piece moves like a chess knight permanently |
| **Royal Decree** | Instantly crown a piece |
| **Shatter** | Destroy any unshielded enemy piece (you skip spells next turn) |
| **Chain Lightning** | Destroy up to 2 chained adjacent enemies from your piece |

## Checkers rules

- You play as **Ruby Legion** (red, bottom). **Shadow Court** (black, top) is the AI in Adventure.
- Mandatory jumps when available; multi-jump chains when possible.
- Reach the far row to crown, or use crown spells.

## Online accounts & PvP

See **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** for Supabase auth, cloud saves, and 1v1 PvP matchmaking. PvP and Quests require a signed-in account; guests can play Adventure and browse Decks/Shop locally.

## Mobile & App Store

The UI is optimized for phones (bottom navigation, safe areas, touch targets). Red/black app icon, animated splash, and Capacitor wrap — see **[MOBILE.md](MOBILE.md)** for PWA install and App Store / Google Play submission.
