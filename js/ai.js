import { COLORS, getAllMovesForColor, applyMove, countPieces, squareName } from "./board.js";
import { tryAutoPlay, canAiPlay } from "./cardEffects.js";

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
      if (p.knightTurns > 0 || p.isKnight) score += 3 * sign;
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

/**
 * Run AI turn; returns a replay log for the UI.
 * @returns {Array<{type: string, [key: string]: unknown}>}
 */
export function runAiTurn(state, opponentName = "Opponent") {
  const color = COLORS.BLACK;
  const hand = state.hands.black;
  const log = [];

  if (state.meta.blindNext?.[color]) {
    state.meta.blindNext[color] = false;
    log.push({ type: "message", text: `${opponentName} is blinded — skips spells.` });
  } else if (!state.spellPlayed.black && hand.length) {
    const playable = hand.filter((c) => canAiPlay(state, color, c));
    if (playable.length && Math.random() < 0.7) {
      const card = playable[Math.floor(Math.random() * playable.length)];
      const idx = hand.indexOf(card);
      const res = tryAutoPlay(state, color, card);
      if (res.success) {
        hand.splice(idx, 1);
        state.spellPlayed.black = true;
        log.push({
          type: "spell",
          cardName: card.name,
          cardId: card.id,
          text: res.message || `Cast ${card.name}`,
        });
        if (state.meta.counterspell?.[COLORS.RED]) {
          state.meta.counterspell[COLORS.RED] = false;
          log.push({ type: "message", text: "Your Counterspell cancels their magic!" });
        }
      }
    }
  }

  let move;
  if (state.meta.confuseNext?.[color]) {
    state.meta.confuseNext[color] = false;
    const moves = getAllMovesForColor(state.board, color, state);
    move = moves[Math.floor(Math.random() * moves.length)] || null;
    if (move) log.push({ type: "message", text: "Confusion — random move!" });
  } else {
    move = pickBestMove(state.board, color, state);
  }

  if (move) {
    const cap = move.captures?.length || 0;
    log.push({
      type: "move",
      from: [...move.from],
      to: [...move.to],
      captures: move.captures ? move.captures.map((c) => [...c]) : [],
      moveKind: move.type,
      text: cap
        ? `Moved ${squareName(move.from[0], move.from[1])} → ${squareName(move.to[0], move.to[1])} (captured ${cap})`
        : `Moved ${squareName(move.from[0], move.from[1])} → ${squareName(move.to[0], move.to[1])}`,
    });
    applyMove(state.board, move, state);
    if (state.meta.pendingDouble.black && move.type === "step") {
      state.meta.pendingDouble.black = false;
      const extra = getAllMovesForColor(state.board, color, state).filter(
        (m) => m.from[0] === move.to[0] && m.from[1] === move.to[1] && m.type === "step"
      );
      if (extra.length) {
        const ex = extra[0];
        applyMove(state.board, ex, state);
        log.push({
          type: "move",
          from: [...ex.from],
          to: [...ex.to],
          captures: ex.captures ? ex.captures.map((c) => [...c]) : [],
          moveKind: ex.type,
          text: `Quick follow-up ${squareName(ex.from[0], ex.from[1])} → ${squareName(ex.to[0], ex.to[1])}`,
        });
      }
    }
  } else {
    log.push({ type: "message", text: `${opponentName} had no legal move.` });
  }

  return log;
}
