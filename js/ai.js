import { DRAW_COST, drawRandomCard, createCardInstance, HAND_MAX, CARD_IDS } from "./cards.js";
import {
  COLORS,
  getAllMovesForColor,
  applyMove,
  countPieces,
  getBoltTarget,
  getAdjacentEmpty,
  getTeleportTargets,
  enemyPieces,
  piecesOfColor,
  movePiece,
  removePiece,
} from "./board.js";

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
  score += (countPieces(board, human) === 0 ? 500 : 0);
  score -= (countPieces(board, aiColor) === 0 ? 500 : 0);
  return score;
}

export function pickBestMove(board, color) {
  const moves = getAllMovesForColor(board, color);
  if (moves.length === 0) return null;

  let best = moves[0];
  let bestScore = -Infinity;

  for (const move of moves) {
    const copy = board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
    applyMove(copy, move);
    const s = scoreBoard(copy, color);
    const captureBonus = (move.captures?.length || 0) * 8;
    const total = s + captureBonus + Math.random() * 2;
    if (total > bestScore) {
      bestScore = total;
      best = move;
    }
  }
  return best;
}

function tryPlayCard(state, cardId) {
  const board = state.board;
  const color = COLORS.BLACK;
  const hand = state.hands.black;
  const idx = hand.findIndex((c) => c.id === cardId);
  if (idx < 0) return false;

  const myPieces = piecesOfColor(board, color);
  const enemies = enemyPieces(board, color);

  switch (cardId) {
    case CARD_IDS.GEM_CACHE:
      state.gems.black += 20;
      hand.splice(idx, 1);
      return true;

    case CARD_IDS.AEGIS: {
      const p = myPieces[Math.floor(Math.random() * myPieces.length)];
      if (!p) return false;
      p.shieldTurns = 2;
      hand.splice(idx, 1);
      return true;
    }

    case CARD_IDS.FROST: {
      const e = enemies.filter((p) => p.frozenTurns <= 0);
      if (e.length === 0) return false;
      const t = e[Math.floor(Math.random() * e.length)];
      t.frozenTurns = 1;
      hand.splice(idx, 1);
      return true;
    }

    case CARD_IDS.KNIGHT: {
      const p = myPieces[Math.floor(Math.random() * myPieces.length)];
      if (!p) return false;
      p.isKnight = true;
      hand.splice(idx, 1);
      return true;
    }

    case CARD_IDS.CROWN: {
      const p = myPieces.find((x) => !x.king) || myPieces[0];
      if (!p) return false;
      p.king = true;
      hand.splice(idx, 1);
      return true;
    }

    case CARD_IDS.RETREAT: {
      const p = myPieces[Math.floor(Math.random() * myPieces.length)];
      if (!p) return false;
      p.retreatTurns = 3;
      hand.splice(idx, 1);
      return true;
    }

    case CARD_IDS.BOLT: {
      for (const p of myPieces) {
        const targets = getBoltTarget(board, p);
        if (targets.length) {
          removePiece(board, targets[0][0], targets[0][1]);
          hand.splice(idx, 1);
          return true;
        }
      }
      return false;
    }

    case CARD_IDS.NUDGE: {
      for (const p of myPieces) {
        const spots = getAdjacentEmpty(board, p);
        if (spots.length) {
          const [tr, tc] = spots[0];
          movePiece(board, p.row, p.col, tr, tc);
          hand.splice(idx, 1);
          return true;
        }
      }
      return false;
    }

    case CARD_IDS.SHATTER: {
      const killable = enemies.filter((e) => e.shieldTurns <= 0);
      if (killable.length === 0) return false;
      const t = killable[Math.floor(Math.random() * killable.length)];
      removePiece(board, t.row, t.col);
      hand.splice(idx, 1);
      return true;
    }

    case CARD_IDS.TELEPORT: {
      for (const p of myPieces) {
        const spots = getTeleportTargets(board, p);
        if (spots.length) {
          const [tr, tc] = spots[Math.floor(Math.random() * spots.length)];
          movePiece(board, p.row, p.col, tr, tc);
          hand.splice(idx, 1);
          return true;
        }
      }
      return false;
    }

    case CARD_IDS.SWAP: {
      if (myPieces.length < 2) return false;
      const a = myPieces[0];
      const b = myPieces[1];
      const ar = a.row, ac = a.col, br = b.row, bc = b.col;
      board[ar][ac] = b;
      board[br][bc] = a;
      a.row = br; a.col = bc;
      b.row = ar; b.col = ac;
      hand.splice(idx, 1);
      return true;
    }

    case CARD_IDS.DOUBLE:
      state.pendingDouble.black = true;
      hand.splice(idx, 1);
      return true;

    default:
      return false;
  }
}

export function runAiTurn(state, onMessage) {
  const gems = state.gems.black;
  const hand = state.hands.black;

  if (gems >= DRAW_COST && hand.length < HAND_MAX && Math.random() < 0.55) {
    state.gems.black -= DRAW_COST;
    hand.push(createCardInstance(drawRandomCard()));
    onMessage?.("Shadow Court draws a card.");
  }

  let played = true;
  while (played) {
    played = false;
    const playable = hand.filter((c) => c.id !== CARD_IDS.SWAP || piecesOfColor(state.board, COLORS.BLACK).length >= 2);
    if (playable.length === 0) break;
    const card = playable[Math.floor(Math.random() * playable.length)];
    if (Math.random() < 0.65 && tryPlayCard(state, card.id)) {
      played = true;
      onMessage?.(`Shadow Court plays ${card.name}.`);
    }
  }

  const move = pickBestMove(state.board, COLORS.BLACK);
  if (move) {
    applyMove(state.board, move);
    onMessage?.("Shadow Court moves.");
    if (state.pendingDouble.black && move.type === "step") {
      state.pendingDouble.black = false;
      const piece = state.board[move.to[0]][move.to[1]];
      if (piece) {
        const extra = getAllMovesForColor(state.board, COLORS.BLACK).filter(
          (m) => m.from[0] === move.to[0] && m.from[1] === move.to[1] && m.type === "step"
        );
        if (extra.length) applyMove(state.board, extra[0]);
      }
    }
  }
}
