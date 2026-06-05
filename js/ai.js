import { COLORS, getAllMovesForColor, applyMove, countPieces, squareName, findPressExtraPiece } from "./board.js";
import { tryAutoPlay, canAiPlay, applyCard } from "./cardEffects.js";
import { getCardDef } from "./cardCatalog.js";

/** Deep copy for AI planning without mutating the live match state. */
export function cloneMatchState(state) {
  const hook = state.meta?.achievementHook;
  if (hook) state.meta.achievementHook = null;
  try {
    return structuredClone(state);
  } catch {
    return JSON.parse(JSON.stringify(state));
  } finally {
    if (hook) state.meta.achievementHook = hook;
  }
}

/** Fingerprint for comparing whether replay applied the planned turn. */
export function aiStateDigest(state) {
  const meta = state.meta ? { ...state.meta } : {};
  delete meta.achievementHook;
  return JSON.stringify({
    board: state.board,
    hands: state.hands,
    meta,
    captured: state.captured,
    spellPlayed: state.spellPlayed,
    squares: state.squares,
  });
}

/** True when live state matches the planned AI result (board + hands). */
export function aiTurnMatchesPlan(live, planned) {
  return (
    JSON.stringify(live.board) === JSON.stringify(planned.board) &&
    JSON.stringify(live.hands) === JSON.stringify(planned.hands) &&
    JSON.stringify(live.spellPlayed) === JSON.stringify(planned.spellPlayed)
  );
}

/** Copy planned AI results onto live state (preserves achievementHook). */
export function syncPlannedAiState(live, planned) {
  const hook = live.meta?.achievementHook;
  const patch = JSON.parse(
    JSON.stringify({
      board: planned.board,
      hands: planned.hands,
      meta: planned.meta,
      captured: planned.captured,
      spellPlayed: planned.spellPlayed,
      squares: planned.squares,
      gems: planned.gems,
      boardFx: null,
    })
  );
  live.board = patch.board;
  live.hands = patch.hands;
  live.meta = patch.meta;
  live.captured = patch.captured;
  live.spellPlayed = patch.spellPlayed;
  live.squares = patch.squares;
  if (patch.gems) live.gems = patch.gems;
  live.boardFx = null;
  live.meta.achievementHook = hook;
}

/**
 * Plan an AI turn on a throwaway copy; returns replay log only.
 * @returns {Array<{type: string, [key: string]: unknown}>}
 */
export function planAiTurn(state, opponentName = "Opponent") {
  return planAiTurnWork(state, opponentName).log;
}

/**
 * Plan on a clone; returns log + final planned state for sync fallback.
 */
export function planAiTurnWork(state, opponentName = "Opponent", aiColor = COLORS.BLACK) {
  const work = cloneMatchState(state);
  const log = runAiTurn(work, opponentName, aiColor);
  return { log, work };
}

/**
 * Apply one replay log entry to live state (called from UI after announce/animation).
 */
export function applyAiReplayEntry(state, entry, aiColor = COLORS.BLACK) {
  const color = aiColor;
  const hand = state.hands[aiColor];

  if (entry.type === "spell") {
    if (entry.countered) {
      const idx = hand.findIndex((c) => c.id === entry.cardId);
      if (idx >= 0) hand.splice(idx, 1);
      state.spellPlayed[aiColor] = true;
      const human = aiColor === COLORS.BLACK ? COLORS.RED : COLORS.BLACK;
      if (state.meta.counterspell?.[human]) state.meta.counterspell[human] = false;
      return true;
    }
    const idx = hand.findIndex((c) => c.id === entry.cardId);
    const card = idx >= 0 ? hand[idx] : getCardDef(entry.cardId);
    if (!card) return false;
    const res = applyCard(state, color, card, entry.picks || []);
    if (idx >= 0) hand.splice(idx, 1);
    state.spellPlayed[aiColor] = true;
    return !!res?.success;
  }

  if (entry.type === "move") {
    const [fr, fc] = entry.from;
    if (!state.board[fr]?.[fc]) return false;
    if (entry.confused) state.meta.confuseNext[color] = false;
    if (entry.bearBonus) {
      if (!state.meta.bearBonusUsed) state.meta.bearBonusUsed = {};
      state.meta.bearBonusUsed[aiColor] = true;
    }
    if (entry.pressExtra) {
      const pressed = findPressExtraPiece(state.board, color);
      if (pressed) pressed.pressExtraMove = false;
    }
    if (entry.quickMarch) state.meta.pendingDouble[aiColor] = false;
    try {
      const piece = applyMove(
        state.board,
        {
          from: entry.from,
          to: entry.to,
          type: entry.moveKind,
          captures: entry.captures || [],
        },
        state
      );
      return piece != null;
    } catch {
      return false;
    }
  }

  if (entry.type === "message") {
    if (entry.clearBlind) state.meta.blindNext[color] = false;
    return true;
  }

  return true;
}

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
export function runAiTurn(state, opponentName = "Opponent", aiColor = COLORS.BLACK) {
  const color = aiColor;
  const human = aiColor === COLORS.BLACK ? COLORS.RED : COLORS.BLACK;
  const hand = state.hands[aiColor];
  const log = [];

  if (state.meta.shatterSilenced?.[color]) {
    log.push({ type: "message", text: `${opponentName} is reeling from Shatter — no spells this turn.` });
  } else if (state.meta.blindNext?.[color]) {
    log.push({ type: "message", text: `${opponentName} is blinded — skips spells.`, clearBlind: true });
    state.meta.blindNext[color] = false;
  } else if (!state.spellPlayed[aiColor] && hand.length) {
    const playable = hand.filter((c) => canAiPlay(state, color, c));
    if (playable.length) {
      const card = playable[Math.floor(Math.random() * playable.length)];
      const idx = hand.indexOf(card);
      const trapped = !!state.meta.counterspell?.[human];
      if (trapped) {
        state.meta.counterspell[human] = false;
        hand.splice(idx, 1);
        state.spellPlayed[aiColor] = true;
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
          state.spellPlayed[aiColor] = true;
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
  let confused = false;
  if (state.meta.confuseNext?.[color]) {
    confused = true;
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
      confused,
      text: cap
        ? `Moved ${squareName(move.from[0], move.from[1])} → ${squareName(move.to[0], move.to[1])} (captured ${cap})`
        : `Moved ${squareName(move.from[0], move.from[1])} → ${squareName(move.to[0], move.to[1])}`,
    });
    applyMove(state.board, move, state);
    const [br, bc] = move.to;
    const landed = state.board[br]?.[bc];
    if (landed?.bearAwakened && !state.meta.bearBonusUsed?.[aiColor]) {
      if (!state.meta.bearBonusUsed) state.meta.bearBonusUsed = {};
      state.meta.bearBonusUsed[aiColor] = true;
      const extras = getAllMovesForColor(state.board, aiColor, state).filter(
        (m) => m.from[0] === br && m.from[1] === bc
      );
      if (extras.length) {
        const extra = extras[Math.floor(Math.random() * extras.length)];
        applyMove(state.board, extra, state);
        log.push({
          type: "move",
          from: [...extra.from],
          to: [...extra.to],
          captures: extra.captures ? extra.captures.map((c) => [...c]) : [],
          moveKind: extra.type,
          bearBonus: true,
          text: `Awoken Bear — ${squareName(extra.from[0], extra.from[1])} → ${squareName(extra.to[0], extra.to[1])}`,
        });
      }
    }
    if (state.meta.pendingDouble?.[aiColor] && move.type === "step") {
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
          quickMarch: true,
          text: `Quick follow-up ${squareName(ex.from[0], ex.from[1])} → ${squareName(ex.to[0], ex.to[1])}`,
        });
      }
      state.meta.pendingDouble[aiColor] = false;
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
        pressExtra: true,
        text: `Press — extra move ${squareName(bestPress.from[0], bestPress.from[1])} → ${squareName(bestPress.to[0], bestPress.to[1])}`,
      });
    }
  }

  return log;
}
