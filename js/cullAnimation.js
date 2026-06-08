/** Cull — pick weakest enemy (fewest legal moves; non-kings preferred). */
import { COLORS, enemyPieces, getAllMovesForColor } from "./board.js";
import { isInDarknessZone } from "./gameMeta.js";

export const CULL_ANIMATION_MS = 2000;

export function findCullTarget(state, color) {
  const enemies = enemyPieces(state.board, color).filter(
    (p) => !isInDarknessZone(state, p.row, p.col)
  );
  const nonKings = enemies.filter((p) => !p.king);
  const pool = nonKings.length ? nonKings : enemies;
  if (!pool.length) return null;

  return pool.sort((a, b) => {
    const movesA = getAllMovesForColor(state.board, a.color, state).filter(
      (m) => m.from[0] === a.row && m.from[1] === a.col
    ).length;
    const movesB = getAllMovesForColor(state.board, b.color, state).filter(
      (m) => m.from[0] === b.row && m.from[1] === b.col
    ).length;
    return movesA - movesB;
  })[0];
}

export function cullVictimSnapshot(piece) {
  if (!piece) return null;
  return { color: piece.color, king: !!piece.king };
}
