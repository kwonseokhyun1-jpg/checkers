import { DRAW_COST, drawRandomCard, createCardInstance } from "./cards.js";
import {
  COLORS,
  getAllMovesForColor,
  applyMove,
  countPieces,

} from "./board.js";
import { handLimit, drawCostFor, consumeFreeDraw } from "./gameMeta.js";
import { tryAutoPlay, canAiPlay, isInstant } from "./cardEffects.js";

function scoreBoard(board, aiColor) {
  const human = aiColor === COLORS.BLACK ? COLORS.RED : COLORS.BLACK;
  let score = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p) continue;
      const sign = p.color === aiColor ? 1 : -1;
      score += 10 * sign;
      if (p.king) score += 4 * sign;
      if (p.isKnight) score += 3 * sign;
      if (p.shieldTurns) score += 2 * sign;
    }
  }
  if (countPieces(board, human) === 0) score += 500;
  if (countPieces(board, aiColor) === 0) score -= 500;
  return score;
}

export function pickBestMove(board, color, state) {
  const moves = getAllMovesForColor(board, color, state);
  if (!moves.length) return null;

  let best = moves[0];
  let bestScore = -Infinity;
  for (const move of moves) {
    const copy = board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
    applyMove(copy, move, state);
    const total = scoreBoard(copy, color) + (move.captures?.length || 0) * 8 + Math.random() * 2;
    if (total > bestScore) {
      bestScore = total;
      best = move;
    }
  }
  return best;
}

export function runAiTurn(state, onMessage) {
  const color = COLORS.BLACK;
  const hand = state.hands.black;
  const max = handLimit(state, color);
  const cost = drawCostFor(state, color, DRAW_COST);

  if (state.meta.blindNext?.[color]) {
    state.meta.blindNext[color] = false;
    onMessage?.("Shadow Court is blinded — skips cards.");
  } else if (hand.length < max && (state.gems.black >= cost || state.meta.freeDraw[color]) && Math.random() < 0.5) {
    if (!consumeFreeDraw(state, color)) state.gems.black -= cost;
    hand.push(createCardInstance(drawRandomCard()));
    onMessage?.("Shadow Court draws a card.");
  }

  if (state.meta.counterspell?.[COLORS.RED]) {
    state.meta.counterspell[COLORS.RED] = false;
  }

  let plays = state.meta.cardsLeft[color] || 1;
  while (plays > 0 && hand.length) {
    const playable = hand.filter((c) => canAiPlay(state, color, c));
    if (!playable.length) break;
    const card = playable[Math.floor(Math.random() * playable.length)];
    const idx = hand.indexOf(card);
    if (Math.random() < 0.6) {
      const res = tryAutoPlay(state, color, card);
      if (res.success) {
        hand.splice(idx, 1);
        onMessage?.(`Shadow Court plays ${card.name}.`);
        plays--;
        if (state.meta.counterspell?.[color]) {
          state.meta.counterspell[color] = false;
          onMessage?.("Your Counterspell fizzles their magic!");
          break;
        }
        continue;
      }
    }
    break;
  }

  let move;
  if (state.meta.confuseNext?.[color]) {
    state.meta.confuseNext[color] = false;
    const moves = getAllMovesForColor(state.board, color, state);
    move = moves[Math.floor(Math.random() * moves.length)] || null;
  } else {
    move = pickBestMove(state.board, color, state);
  }

  if (move) {
    applyMove(state.board, move, state);
    onMessage?.("Shadow Court moves.");
    if (state.meta.pendingDouble.black && move.type === "step") {
      state.meta.pendingDouble.black = false;
      const extra = getAllMovesForColor(state.board, color, state).filter(
        (m) => m.from[0] === move.to[0] && m.from[1] === move.to[1] && m.type === "step"
      );
      if (extra.length) applyMove(state.board, extra[0], state);
    }
  }
}
