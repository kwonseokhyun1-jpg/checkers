/**
 * Reactive board effects (mine, bomb, vengeance) — not spell casts.
 */
import { SIZE, inBounds } from "./board.js";

/** @param {import("./board.js").GameState|null} state */
export function queueBoardFx(state, kind, centerRow, centerCol, extraSquares = null) {
  if (!state) return;
  /** @type {number[][]} */
  let squares = extraSquares ? extraSquares.map(([r, c]) => [r, c]) : [];
  if (!extraSquares) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const r = centerRow + dr;
        const c = centerCol + dc;
        if (inBounds(r, c)) squares.push([r, c]);
      }
    }
  }
  const seen = new Set();
  squares = squares.filter(([r, c]) => {
    const k = `${r},${c}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  state.boardFx = { kind, center: [centerRow, centerCol], squares };
}

export const BOARD_FX_MS = {
  bomb: 1200,
  mine: 1000,
  vengeance: 1100,
};

export function boardFxDuration(kind) {
  return BOARD_FX_MS[kind] ?? 1000;
}
