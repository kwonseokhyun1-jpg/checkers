# Card Checkers

Classic checkers with a collectible spell-card layer. You and the AI each start with **100 gems**. Spend **10 gems** to draw a random card, play effects on your turn, then make a normal checkers move.

## Play online

**[Play Card Checkers on GitHub Pages](https://kwonseokhyun1-jpg.github.io/checkers/)**

The site deploys automatically when changes are pushed to `main`.

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
| **Retreat Ward** | Piece can move (and jump) backward for 3 turns |
| **Knight's Sigil** | Piece moves like a chess knight permanently |
| **Royal Decree** | Instantly crown a piece |
| **Shadow Swap** | Swap two of your pieces |
| **Quick March** | After your move, move the same piece again (non-capture) |
| **Gem Cache** | Gain 20 gems |
| **Shatter** | Destroy any unshielded enemy piece |
| **Blink** | Teleport your piece to any empty dark square within 2 steps |

## Rules

- You play as **Ruby Legion** (red, bottom). **Shadow Court** (black, top) is the AI.
- On your turn: play any number of cards (optional), tap **Done playing cards**, then move.
- Mandatory jumps when available; multi-jump chains when possible.
- Reach the far row to crown, or use **Royal Decree**.
