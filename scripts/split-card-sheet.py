#!/usr/bin/env python3
"""Split a category card sheet into individual card art files.

Usage:
  python3 scripts/split-card-sheet.py attack assets/sheets/attack.png
  python3 scripts/split-card-sheet.py --all
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets" / "cards"
SHEETS = ROOT / "assets" / "sheets"
MANIFEST = ROOT / "js" / "cardArtManifest.js"

CATEGORY_CARDS: dict[str, list[str]] = {
    "attack": [
        "backstab", "bomb", "chain_lightning", "coin_flip", "cryo_bolt",
        "cull", "duel", "execution", "poison", "pyromancy",
        "sacrifice", "shatter", "snipe", "stab",
    ],
    "control": [
        "backpedal", "blind", "blizzard", "confusion", "deep_freeze", "demote",
        "panic", "press", "root", "shockwave", "snowball", "tangle",
    ],
    "defense": [
        "aegis", "anchor", "backrank_protection", "barrier", "bulwark", "darkness",
        "iron_will", "rally", "revive", "sanctuary", "stall", "ward",
    ],
    "movement": [
        "backstep", "berserk", "bishops_mark", "call_forward", "chameleon", "deport",
        "displacement", "hostile_swap", "leapfrog", "long_step", "magnet", "nudge",
        "quick_march", "random_teleport", "recall", "repel", "retreat", "rooks_mark",
        "scatter", "shadow_swap", "sidestep", "teleport",
    ],
    "trap": [
        "counterspell", "deflect", "landmine", "last_stand", "quicksand", "vengeance",
    ],
    "special": [
        "bounty", "butterfly", "clone", "collapse", "constitution", "create_foe",
        "crown", "dominion", "earthquake", "fusion", "hibernation", "ignore",
        "last_king", "link_fate", "mind_control", "offering", "purify", "trickster",
    ],
}

CATEGORY_SKIP: dict[str, set[int]] = {
    # Legacy 16-card attack sheet skipped unnamed + snap; pre-trimmed sheets need no skip.
    "attack": set(),
}

CATEGORY_GRID_ROWS: dict[str, list[int]] = {
    "attack": [5, 5, 4],
    "control": [6, 6],
    "defense": [6, 6],
    "movement": [7, 7, 8],
    "trap": [3, 3],
    "special": [6, 6, 6],
}

# Uploaded sheets dropped in repo root (UUID filenames)
ROOT_SHEET_MAP: dict[str, str] = {
    "attack_sheet_removed_snap_nameless.png": "attack",
    "43c41ca1-3a29-41ea-9acd-aeb441a4cfc5.png": "defense",
    "621e110a-6c9c-4dff-8bdb-ee476bf5a0b4.png": "special",
    "64e309bb-bed6-45d8-ba1f-fc217acfedeb.png": "trap",
    "6bd26ff3-19fa-4854-96e2-8982ee60affe.png": "movement",
    "7d6841b0-22e3-4716-9454-1a211350e2fd.png": "control",
}


def grid_card_boxes(
    img: Image.Image,
    row_counts: list[int],
    margin_x: float = 0.02,
    margin_y: float = 0.03,
    gap_x: float = 0.015,
    gap_y: float = 0.04,
) -> list[tuple[int, int, int, int]]:
    """Split sheet into a fixed row grid."""
    w, h = img.size
    mx = int(w * margin_x)
    my = int(h * margin_y)
    gx = int(w * gap_x)
    gy = int(h * gap_y)
    inner_w = w - 2 * mx
    inner_h = h - 2 * my
    row_h = (inner_h - gy * (len(row_counts) - 1)) // len(row_counts)
    boxes: list[tuple[int, int, int, int]] = []
    y = my
    for count in row_counts:
        cell_w = (inner_w - gx * (count - 1)) // count
        x = mx
        for _ in range(count):
            boxes.append((x, y, x + cell_w, y + row_h))
            x += cell_w + gx
        y += row_h + gy
    return boxes


def write_manifest(urls: dict[str, str]) -> None:
    lines = [
        "/** Auto-generated card art manifest — run scripts/split-card-sheet.py */",
        "",
        "/** @type {Record<string, string>} */",
        "export const CARD_ART_URLS = " + json.dumps(urls, indent=2) + ";",
        "",
        "/** @param {string} id */",
        "export function cardArtUrl(id) {",
        "  return CARD_ART_URLS[id] || null;",
        "}",
        "",
        "/** @param {string} id */",
        "export function hasCardArt(id) {",
        "  return id in CARD_ART_URLS;",
        "}",
        "",
    ]
    MANIFEST.write_text("\n".join(lines), encoding="utf-8")


def load_existing_manifest() -> dict[str, str]:
    if not MANIFEST.exists():
        return {}
    text = MANIFEST.read_text(encoding="utf-8")
    m = re.search(r"export const CARD_ART_URLS = (\{[\s\S]*?\});", text)
    if not m:
        return {}
    return json.loads(m.group(1))


def normalize_root_sheets() -> list[tuple[str, Path]]:
    """Move UUID-named uploads from repo root into assets/sheets/."""
    SHEETS.mkdir(parents=True, exist_ok=True)
    found: list[tuple[str, Path]] = []
    for filename, category in ROOT_SHEET_MAP.items():
        src = ROOT / filename
        if not src.exists():
            continue
        dest = SHEETS / f"{category}.png"
        if src.resolve() != dest.resolve():
            shutil.copy2(src, dest)
        found.append((category, dest))
    return found


def split_category(
    category: str,
    sheet: Path,
    *,
    skip: set[int] | None = None,
    row_counts: list[int] | None = None,
    dry_run: bool = False,
    urls: dict[str, str] | None = None,
) -> dict[str, str]:
    if not sheet.exists():
        raise SystemExit(f"Sheet not found: {sheet}")

    skip = skip if skip is not None else CATEGORY_SKIP.get(category, set())
    names = CATEGORY_CARDS[category]
    row_counts = row_counts or CATEGORY_GRID_ROWS.get(category, [])
    if not row_counts:
        raise SystemExit(f"No grid layout for category: {category}")

    img = Image.open(sheet)
    boxes = grid_card_boxes(img, row_counts)
    usable = [b for i, b in enumerate(boxes) if i not in skip]

    if len(usable) != len(names):
        print(f"[{category}] detected {len(boxes)} cards, {len(usable)} after skip, expected {len(names)}")
        for i, b in enumerate(boxes):
            mark = " SKIP" if i in skip else ""
            print(f"  [{i}]{mark} {b}")
        raise SystemExit(f"Card count mismatch for {category}")

    out_dir = ASSETS / category
    out_dir.mkdir(parents=True, exist_ok=True)
    if urls is None:
        urls = load_existing_manifest()

    for name, box in zip(names, usable):
        rel = f"assets/cards/{category}/{name}.webp"
        out_path = ROOT / rel
        if dry_run:
            print(f"would write {rel} from {box}")
            continue
        crop = img.crop(box).convert("RGB")
        crop.save(out_path, "WEBP", quality=90, method=6)
        urls[name] = rel
        print(f"wrote {rel}")

    return urls


def split_all(dry_run: bool = False) -> None:
    sheets = normalize_root_sheets()
    # Also pick up sheets already in assets/sheets/
    for category in CATEGORY_CARDS:
        path = SHEETS / f"{category}.png"
        if path.exists() and (category, path) not in sheets:
            sheets.append((category, path))

    if not sheets:
        print("No sheets found in repo root or assets/sheets/")
        return

    urls = load_existing_manifest()
    for category, path in sorted(sheets, key=lambda x: x[0]):
        print(f"\n=== {category} ({path.name}) ===")
        urls = split_category(category, path, dry_run=dry_run, urls=urls)

    if not dry_run:
        write_manifest(urls)
        print(f"\nupdated {MANIFEST.relative_to(ROOT)} ({len(urls)} cards total)")


def main() -> None:
    parser = argparse.ArgumentParser(description="Split card sheet into individual art files")
    parser.add_argument("category", nargs="?", choices=sorted(CATEGORY_CARDS.keys()))
    parser.add_argument("sheet", nargs="?", type=Path, help="Path to the category sheet image")
    parser.add_argument("--all", action="store_true", help="Process all sheets in assets/sheets/")
    parser.add_argument("--skip", type=str, default="", help="Comma-separated 0-based indices to skip")
    parser.add_argument("--grid-rows", type=str, default="", help="Fixed row layout, e.g. 5,6,5")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    if args.all:
        split_all(dry_run=args.dry_run)
        return

    if not args.category or not args.sheet:
        parser.error("category and sheet required unless --all is used")

    sheet = args.sheet if args.sheet.is_absolute() else ROOT / args.sheet
    skip = CATEGORY_SKIP.get(args.category, set())
    if args.skip:
        skip |= {int(x.strip()) for x in args.skip.split(",") if x.strip()}

    row_counts = CATEGORY_GRID_ROWS.get(args.category, [])
    if args.grid_rows:
        row_counts = [int(x.strip()) for x in args.grid_rows.split(",") if x.strip()]

    urls = split_category(
        args.category,
        sheet,
        skip=skip,
        row_counts=row_counts,
        dry_run=args.dry_run,
    )
    if not args.dry_run:
        write_manifest(urls)
        print(f"updated {MANIFEST.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
