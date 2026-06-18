#!/usr/bin/env python3
"""Split a category card sheet into individual card art files.

Usage:
  python3 scripts/split-card-sheet.py attack assets/sheets/attack.webp

Layout: auto-detects card regions on a dark background. Pass --skip to omit
cards (0-based left-to-right, top-to-bottom), e.g. attack sheet skips snap
and the nameless card: --skip 10,14
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets" / "cards"
MANIFEST = ROOT / "js" / "cardArtManifest.js"

CATEGORY_CARDS: dict[str, list[str]] = {
    "attack": [
        "backstab",
        "bomb",
        "chain_lightning",
        "coin_flip",
        "cryo_bolt",
        "cull",
        "duel",
        "execution",
        "poison",
        "pyromancy",
        "sacrifice",
        "shatter",
        "snipe",
        "stab",
    ],
}

CATEGORY_SKIP: dict[str, set[int]] = {
    # unnamed (row 2, col 6) and snap (row 3, col 4) on the attack sheet
    "attack": {10, 14},
}

CATEGORY_GRID_ROWS: dict[str, list[int]] = {
    "attack": [5, 6, 5],
}


def grid_card_boxes(
    img: Image.Image,
    row_counts: list[int],
    margin_x: float = 0.02,
    margin_y: float = 0.03,
    gap_x: float = 0.015,
    gap_y: float = 0.04,
) -> list[tuple[int, int, int, int]]:
    """Split sheet into a fixed row grid (e.g. attack: 5+6+5 cards)."""
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


def detect_card_boxes(img: Image.Image, min_area_ratio: float = 0.004) -> list[tuple[int, int, int, int]]:
    """Find card bounding boxes via brightness threshold + connected regions."""
    rgb = img.convert("RGB")
    w, h = rgb.size
    min_area = int(w * h * min_area_ratio)
    pixels = rgb.load()

    mask = [[False] * w for _ in range(h)]
    for y in range(h):
        for x in range(w):
            r, g, b = pixels[x, y]
            if r + g + b > 70:
                mask[y][x] = True

    visited = [[False] * w for _ in range(h)]
    boxes: list[tuple[int, int, int, int]] = []

    for y in range(h):
        for x in range(w):
            if not mask[y][x] or visited[y][x]:
                continue
            stack = [(x, y)]
            min_x = max_x = x
            min_y = max_y = y
            count = 0
            while stack:
                cx, cy = stack.pop()
                if cx < 0 or cy < 0 or cx >= w or cy >= h:
                    continue
                if visited[cy][cx] or not mask[cy][cx]:
                    continue
                visited[cy][cx] = True
                count += 1
                min_x = min(min_x, cx)
                max_x = max(max_x, cx)
                min_y = min(min_y, cy)
                max_y = max(max_y, cy)
                stack.extend([(cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)])

            area = (max_x - min_x + 1) * (max_y - min_y + 1)
            if count >= min_area and area >= min_area:
                pad = 2
                boxes.append(
                    (
                        max(0, min_x - pad),
                        max(0, min_y - pad),
                        min(w, max_x + pad + 1),
                        min(h, max_y + pad + 1),
                    )
                )

    # Merge overlapping / nested boxes — keep largest per cluster
    boxes.sort(key=lambda b: (b[1], b[0]))
    merged: list[tuple[int, int, int, int]] = []
    for box in boxes:
        if any(_overlap(box, kept) for kept in merged):
            continue
        merged.append(box)

    # Group into rows, sort left-to-right
    if not merged:
        return []
    heights = [b[3] - b[1] for b in merged]
    row_thresh = max(40, int(sum(heights) / len(heights) * 0.45))
    merged.sort(key=lambda b: (b[1] + b[3]) / 2)
    rows: list[list[tuple[int, int, int, int]]] = []
    for box in merged:
        cy = (box[1] + box[3]) / 2
        placed = False
        for row in rows:
            rcy = sum((b[1] + b[3]) / 2 for b in row) / len(row)
            if abs(cy - rcy) <= row_thresh:
                row.append(box)
                placed = True
                break
        if not placed:
            rows.append([box])
    ordered: list[tuple[int, int, int, int]] = []
    for row in sorted(rows, key=lambda r: sum((b[1] + b[3]) / 2 for b in r) / len(r)):
        ordered.extend(sorted(row, key=lambda b: b[0]))
    return ordered


def _overlap(a: tuple[int, int, int, int], b: tuple[int, int, int, int]) -> bool:
    ax1, ay1, ax2, ay2 = a
    bx1, by1, bx2, by2 = b
    return ax1 < bx2 and ax2 > bx1 and ay1 < by2 and ay2 > by1


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


def main() -> None:
    parser = argparse.ArgumentParser(description="Split card sheet into individual art files")
    parser.add_argument("category", choices=sorted(CATEGORY_CARDS.keys()))
    parser.add_argument("sheet", type=Path, help="Path to the category sheet image")
    parser.add_argument("--skip", type=str, default="", help="Comma-separated 0-based indices to skip")
    parser.add_argument(
        "--grid-rows",
        type=str,
        default="",
        help="Fixed row layout, e.g. 5,6,5 (overrides auto-detect)",
    )
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    category = args.category
    sheet = args.sheet if args.sheet.is_absolute() else ROOT / args.sheet
    if not sheet.exists():
        raise SystemExit(f"Sheet not found: {sheet}")

    skip = CATEGORY_SKIP.get(category, set())
    if args.skip:
        skip |= {int(x.strip()) for x in args.skip.split(",") if x.strip()}

    names = CATEGORY_CARDS[category]
    img = Image.open(sheet)

    if args.grid_rows:
        row_counts = [int(x.strip()) for x in args.grid_rows.split(",") if x.strip()]
    elif category in CATEGORY_GRID_ROWS:
        row_counts = CATEGORY_GRID_ROWS[category]
    else:
        row_counts = []

    if row_counts:
        boxes = grid_card_boxes(img, row_counts)
    else:
        boxes = detect_card_boxes(img)
    usable = [b for i, b in enumerate(boxes) if i not in skip]

    if len(usable) != len(names):
        print(f"Detected {len(boxes)} cards, {len(usable)} after skip, expected {len(names)}")
        for i, b in enumerate(boxes):
            mark = " SKIP" if i in skip else ""
            print(f"  [{i}]{mark} {b}")
        raise SystemExit("Card count mismatch — adjust --skip or sheet layout")

    out_dir = ASSETS / category
    out_dir.mkdir(parents=True, exist_ok=True)
    urls = load_existing_manifest()

    for name, box in zip(names, usable):
        rel = f"assets/cards/{category}/{name}.webp"
        out_path = ROOT / rel
        if args.dry_run:
            print(f"would write {rel} from {box}")
            continue
        crop = img.crop(box).convert("RGB")
        crop.save(out_path, "WEBP", quality=90, method=6)
        urls[name] = rel
        print(f"wrote {rel}")

    if not args.dry_run:
        write_manifest(urls)
        print(f"updated {MANIFEST.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
