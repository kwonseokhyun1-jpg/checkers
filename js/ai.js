import { COLORS, getAllMovesForColor, applyMove, countPieces, squareName, findPressExtraPiece } from "./board.js";
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

export function applyAiLogEntry(state, entry, color) {
  if (entry.type === "spell" && !entry.countered) {
    const def = entry.cardId ? getCardDef(entry.cardId) : null;
    const card = {
      id: entry.cardId || def?.id,
      name: entry.cardName || def?.name,
      effect: entry.cardEffect || def?.effect,
      mode: entry.cardMode || def?.mode,
    };
    if (card.effect) applyCard(state, color, card, entry.picks || []);
    return;
  }
  if (entry.type === "move") {
    applyMove(
      state.board,
      { from: entry.from, to: entry.to, captures: entry.captures || [], type: entry.moveKind || "step" },
      state
    );
  }
}

/**
 * Run AI turn; returns a replay log for the UI.
 * @returns {Array<{type: string, [key: string]: unknown}>}
 */
export function runAiTurn(state, opponentName = "Opponent") {
  const color = COLORS.BLACK;
  const hand = state.hands.black;
  const log = [];

  if (state.meta.shatterSilenced?.[color]) {
    log.push({ type: "message", text: `${opponentName} is reeling from Shatter — no spells this turn.` });
  } else if (state.meta.blindNext?.[color]) {
    state.meta.blindNext[color] = false;
    log.push({ type: "message", text: `${opponentName} is blinded — skips spells.` });
  } else if (!state.spellPlayed.black && hand.length) {
    const playable = hand.filter((c) => canAiPlay(state, color, c));
    if (playable.length && Math.random() < 0.7) {
      const card = playable[Math.floor(Math.random() * playable.length)];
      const idx = hand.indexOf(card);
      const trapped = !!state.meta.counterspell?.[COLORS.RED];
      if (trapped) {
        state.meta.counterspell[COLORS.RED] = false;
        hand.splice(idx, 1);
        state.spellPlayed.black = true;
        log.push({
          type: "spell",
          cardName: card.name,
          cardId: card.id,
          cardDesc: card.desc,
          cardEffect: card.effect,
          cardMode: card.mode,
          picks: [],
          countered: true,
          text: `Cast ${card.name}`,
        });
      } else {
        const res = tryAutoPlay(state, color, card);
        if (res.success) {
          hand.splice(idx, 1);
          state.spellPlayed.black = true;
          log.push({
            type: "spell",
            cardName: card.name,
            cardId: card.id,
            cardDesc: card.desc,
            cardEffect: card.effect,
            cardMode: card.mode,
            picks: res.picks || [],
            text: res.message || `Cast ${card.name}`,
            ...(res.cullTarget ? { cullTarget: res.cullTarget, cullVictim: res.cullVictim } : {}),
          });
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
    const [br, bc] = move.to;
    const landed = state.board[br]?.[bc];
    if (landed?.bearAwakened && !state.meta.bearBonusUsed?.[COLORS.BLACK]) {
      state.meta.bearBonusUsed[COLORS.BLACK] = true;
      const extras = getAllMovesForColor(state.board, COLORS.BLACK, state).filter(
        (m) => m.from[0] === br && m.from[1] === bc
      );
      if (extras.length) {
        const extra = extras[Math.floor(Math.random() * extras.length)];
        applyMove(state.board, extra, state);
        if (state.boardFx) { /* FX shown on client replay */ }
      }
    }
    if (state.meta.pendingDouble.black && move.type === "step") {
      state.meta.pendingDouble.black = false;
      const extra = getAllMovesForColor(state.board, color, state).filter(
        (m) => m.from[0] === move.to[0] && m.from[1] === move.to[1] && (m.type === "step" || m.type === "jump")
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


  const pressed = findPressExtraPiece(state.board, color);
  if (pressed) {
    pressed.pressExtraMove = false;
    const pressMoves = getAllMovesForColor(state.board, color, state).filter(
      (m) => m.from[0] === pressed.row && m.from[1] === pressed.col
    );
    if (pressMoves.length) {
const bestPress = pressMoves.reduce((best, m) => {
        const copy = state.board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
        applyMove(copy, m, state);
        const sc = scoreBoard(copy, color) + (m.captures?.length || 0) * 8;
        return sc > best.score ? { move: m, score: sc } : best;
      }, { move: pressMoves[0], score: -Infinity }).move;
      applyMove(state.board, bestPress, state);
      log.push({
        type: "move",
        from: [...bestPress.from],
        to: [...bestPress.to],
        captures: bestPress.captures ? bestPress.captures.map((c) => [...c]) : [],
        moveKind: bestPress.type,
        text: `Press — extra move ${squareName(bestPress.from[0], bestPress.from[1])} → ${squareName(bestPress.to[0], bestPress.to[1])}`,
      });
    }
  }

  return log;
}
