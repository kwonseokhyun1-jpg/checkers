import {
  COLORS,
  getAllMovesForColor,
  getJumpMoves,
  applyMove,
  countPieces,
  squareName,
  findPanicPiece,
  getBackwardStepMoves,
  hasMandatoryJumps,
} from "./board.js";
import { tryAutoPlay, canAiPlay, applyCard, isHiddenTrapSpell, bombMoveWorthwhile, bestSnowballSetupScore, bestScatterCaptureScore } from "./cardEffects.js";
import { queueTrapHistoryReveal, isConfused, clearConfusion, payTollOnSpellCast } from "./gameMeta.js";
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
      if (state.meta.counterspell?.[human]) {
        state.meta.counterspell[human] = false;
        queueTrapHistoryReveal(state, { effect: "counterspell", color: human, picks: [] });
      }
      payTollOnSpellCast(state, aiColor);
      return true;
    }
    const idx = hand.findIndex((c) => c.id === entry.cardId);
    const card = idx >= 0 ? hand[idx] : getCardDef(entry.cardId);
    if (!card) return false;
    const res = applyCard(state, color, card, entry.picks || []);
    if (idx >= 0) hand.splice(idx, 1);
    if (!state.meta.extraSpellCast?.[aiColor]) state.spellPlayed[aiColor] = true;
    else state.meta.extraSpellCast[aiColor] = false;
    if (res?.success) payTollOnSpellCast(state, aiColor);
    return !!res?.success;
  }

  if (entry.type === "move") {
    const [fr, fc] = entry.from;
    if (!state.board[fr]?.[fc]) return false;
    if (entry.confused) clearConfusion(state.meta, color);
    if (entry.bearBonus) {
      if (!state.meta.bearBonusUsed) state.meta.bearBonusUsed = {};
      state.meta.bearBonusUsed[aiColor] = true;
    }
    if (entry.pressExtra) state.meta.pendingPressMove[color] = false;
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

function getChainJumpsFrom(board, color, state, fromR, fromC) {
  return getAllMovesForColor(board, color, state).filter(
    (m) => m.type === "jump" && m.from[0] === fromR && m.from[1] === fromC && m.captures?.length
  );
}

function opponentColor(color) {
  return color === COLORS.BLACK ? COLORS.RED : COLORS.BLACK;
}

/** True when the opponent has at least one jump capture on their next turn. */
function opponentCanCapture(board, victimColor, state) {
  const attacker = opponentColor(victimColor);
  return getAllMovesForColor(board, attacker, state).some((m) => m.captures?.length);
}

function getMandatoryJumpMoves(board, color, state) {
  const jumps = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece || piece.color !== color) continue;
      jumps.push(...getJumpMoves(board, piece, color, state));
    }
  }
  return jumps;
}

/** True when this capture move leaves the mover vulnerable to an opponent jump next turn. */
function captureMoveEnablesCounterCapture(state, color, move) {
  const sim = cloneMatchState(state);
  sim.board = state.board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
  if (!applyMove(sim.board, move, sim)) return false;
  return opponentCanCapture(sim.board, color, sim);
}

/**
 * Play Ignore instead of capturing when every mandatory jump would let the opponent
 * capture back and at least one non-capture move becomes available afterward.
 */
export function shouldAiPlayIgnore(state, color) {
  if (!hasMandatoryJumps(state.board, color, state)) return false;

  const jumpMoves = getMandatoryJumpMoves(state.board, color, state);
  if (!jumpMoves.length) return false;

  for (const move of jumpMoves) {
    if (!captureMoveEnablesCounterCapture(state, color, move)) return false;
  }

  const withIgnore = cloneMatchState(state);
  withIgnore.meta.optionalJumps[color] = true;
  return getAllMovesForColor(withIgnore.board, color, withIgnore).some((m) => !m.captures?.length);
}

function scoreMove(board, color, state, move) {
  const sim = cloneMatchState(state);
  sim.board = board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
  if (!applyMove(sim.board, move, sim)) return { score: -Infinity, safe: false };
  const safe = !opponentCanCapture(sim.board, color, sim);
  let score = scoreBoard(sim.board, color) + (move.captures?.length || 0) * 8 + Math.random() * 2;
  for (const [cr, cc] of move.captures || []) {
    const victim = board[cr]?.[cc];
    if (victim?.frozenTurns > 0 || victim?.paralyzedTurns > 0) score += 15;
  }
  return { score, safe };
}

export function pickBestMove(board, color, state, moves = null) {
  const pool = moves ?? getAllMovesForColor(board, color, state);
  if (!pool.length) return null;

  const rated = pool.map((move) => ({ move, ...scoreMove(board, color, state, move) }));
  const safe = rated.filter((r) => r.safe);
  const candidates = safe.length ? safe : rated;

  let best = candidates[0];
  for (const entry of candidates) {
    if (entry.score > best.score) best = entry;
  }
  return best.move;
}

function findArmedSquares(board, color, key) {
  const squares = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p?.color === color && p[key]) squares.push([r, c]);
    }
  }
  return squares;
}

function movePulsesAdjacentEnemy(board, color, move) {
  const enemy = color === COLORS.RED ? COLORS.BLACK : COLORS.RED;
  const [tr, tc] = move.to;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      const p = board[tr + dr]?.[tc + dc];
      if (p?.color === enemy) return true;
    }
  }
  return false;
}

/** After Bomb is armed, move that piece and prefer lines that trade favorably. */
function pickBombFollowUpMove(board, color, state) {
  const armed = findArmedSquares(board, color, "bombArmed");
  if (!armed.length) return null;
  const armedKeys = new Set(armed.map(([r, c]) => `${r},${c}`));
  const bombMoves = getAllMovesForColor(board, color, state).filter((m) =>
    armedKeys.has(`${m.from[0]},${m.from[1]}`)
  );
  if (!bombMoves.length) return null;
  const worthwhile = bombMoves.filter((m) => bombMoveWorthwhile(state, color, m));
  return pickBestMove(board, color, state, worthwhile.length ? worthwhile : bombMoves);
}

function isAdjacentSquare(r1, c1, r2, c2) {
  return Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1 && (r1 !== r2 || c1 !== c2);
}

function jumpCapturesSquare(move, row, col) {
  return move.captures?.some(([cr, cc]) => cr === row && cc === col) ?? false;
}

/** After Snowball, move adjacent to the frozen target to set up a jump capture. */
function pickSnowballFollowUpMove(board, color, state, target) {
  if (!target) return null;
  const [er, ec] = target;
  const approachMoves = getAllMovesForColor(board, color, state).filter((m) =>
    isAdjacentSquare(m.to[0], m.to[1], er, ec)
  );
  if (!approachMoves.length) return null;

  const rated = approachMoves.map((move) => {
    let bonus = 0;
    const simBoard = board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
    const piece = simBoard[move.from[0]][move.from[1]];
    simBoard[move.from[0]][move.from[1]] = null;
    simBoard[move.to[0]][move.to[1]] = piece;
    piece.row = move.to[0];
    piece.col = move.to[1];
    if (
      getAllMovesForColor(simBoard, color, state).some(
        (m) =>
          m.from[0] === move.to[0] &&
          m.from[1] === move.to[1] &&
          jumpCapturesSquare(m, er, ec)
      )
    ) {
      bonus += 100;
    }
    if (move.captures?.length) bonus += 40;
    return { move, bonus };
  });
  rated.sort((a, b) => b.bonus - a.bonus);
  const bestBonus = rated[0].bonus;
  const top = rated.filter((r) => r.bonus === bestBonus).map((r) => r.move);
  return pickBestMove(board, color, state, top);
}

/** After Shockwave is armed, move that piece and prefer lines that pulse adjacent enemies. */
function pickShockwaveFollowUpMove(board, color, state) {
  const armed = findArmedSquares(board, color, "shockwaveArmed");
  if (!armed.length) return null;
  const armedKeys = new Set(armed.map(([r, c]) => `${r},${c}`));
  const shockMoves = getAllMovesForColor(board, color, state).filter((m) =>
    armedKeys.has(`${m.from[0]},${m.from[1]}`)
  );
  if (!shockMoves.length) return null;
  const effective = shockMoves.filter((m) => movePulsesAdjacentEnemy(board, color, m));
  return pickBestMove(board, color, state, effective.length ? effective : shockMoves);
}

/** After Scatter, capture immediately when the push opened a jump line. */
function pickScatterFollowUpMove(board, color, state) {
  const captureMoves = getAllMovesForColor(board, color, state).filter((m) => m.captures?.length);
  if (!captureMoves.length) return null;
  return pickBestMove(board, color, state, captureMoves);
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
  let snowballTarget = null;
  let scatterCast = false;

  if (state.meta.shatterSilenced?.[color]) {
    log.push({ type: "message", text: `${opponentName} is reeling from spell backlash — no spells this turn.` });
  } else if (state.meta.blinded?.[color]) {
    log.push({ type: "message", text: `${opponentName} is blinded — skips spells.` });
  } else if (isConfused(state.meta, color)) {
    log.push({ type: "message", text: `${opponentName} is confused — skips spells.` });
  } else if (!state.spellPlayed[aiColor] && hand.length) {
    while (!state.spellPlayed[aiColor] && hand.length) {
      let playable = hand.filter((c) => canAiPlay(state, color, c));
      if (!playable.length) break;
      const ignoreCard = playable.find((c) => c.effect === "ignore");
      if (ignoreCard && !shouldAiPlayIgnore(state, color)) {
        playable = playable.filter((c) => c.effect !== "ignore");
        if (!playable.length) break;
      }
      const snowballCard = playable.find((c) => c.effect === "snowball");
      const snowballScore = snowballCard ? bestSnowballSetupScore(state, color) : 0;
      const scatterCard = playable.find((c) => c.effect === "scatter");
      const scatterScore = scatterCard ? bestScatterCaptureScore(state, color) : 0;
      const card =
        ignoreCard && shouldAiPlayIgnore(state, color)
          ? ignoreCard
          : scatterCard && scatterScore >= 100
            ? scatterCard
            : snowballCard && snowballScore >= 100
              ? snowballCard
              : playable[Math.floor(Math.random() * playable.length)];
      const idx = hand.indexOf(card);
      const trapped = card.uncounterable ? false : !!state.meta.counterspell?.[human];
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
        break;
      }
      const res = tryAutoPlay(state, color, card);
      if (!res.success) break;
      if (card.effect === "snowball" && res.picks?.[0]) snowballTarget = [...res.picks[0]];
      if (card.effect === "scatter") scatterCast = true;
      hand.splice(idx, 1);
      const bonusSpell = !!state.meta.extraSpellCast?.[aiColor];
      if (!bonusSpell) state.spellPlayed[aiColor] = true;
      else state.meta.extraSpellCast[aiColor] = false;
      log.push({
        type: "spell",
        cardName: card.name,
        cardId: card.id,
        cardDesc: card.desc,
        cardEffect: card.effect,
        cardMode: card.mode,
        picks: res.picks || [],
        text: res.message || `Cast ${card.name}`,
        ...(isHiddenTrapSpell(card) ? { hidden: true } : {}),
        ...(res.cullTarget ? { cullTarget: res.cullTarget, cullVictim: res.cullVictim } : {}),
        ...(res.coinFlipSquare
          ? {
              coinFlipSquare: res.coinFlipSquare,
              coinFlipVictimColor: res.coinFlipVictimColor,
              coinFlipVictim: res.coinFlipVictim,
            }
          : {}),
      });
      if (!bonusSpell) break;
    }
  }

  let move;
  let confused = false;
  const panicked = findPanicPiece(state.board, color);
  const panicForced = panicked && getBackwardStepMoves(state.board, panicked, state).length > 0;
  if (isConfused(state.meta, color)) {
    confused = true;
    clearConfusion(state.meta, color);
    const moves = getAllMovesForColor(state.board, color, state);
    move = moves[Math.floor(Math.random() * moves.length)] || null;
    if (move) log.push({ type: "message", text: "Confusion — random move!" });
  } else {
    const bombArmed = findArmedSquares(state.board, color, "bombArmed");
    const shockwaveArmed = findArmedSquares(state.board, color, "shockwaveArmed");
    if (!panicForced) {
      if (bombArmed.length) move = pickBombFollowUpMove(state.board, color, state);
      else if (shockwaveArmed.length) move = pickShockwaveFollowUpMove(state.board, color, state);
      else if (scatterCast) move = pickScatterFollowUpMove(state.board, color, state);
      else if (snowballTarget) move = pickSnowballFollowUpMove(state.board, color, state, snowballTarget);
    }
    if (!move) move = pickBestMove(state.board, color, state);
    if (panicForced && move) log.push({ type: "message", text: "Panic — forced backward step!" });
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
    let [br, bc] = move.to;
    if (move.captures?.length) {
      while (true) {
        const chainJumps = getChainJumpsFrom(state.board, color, state, br, bc);
        if (!chainJumps.length) break;
        const next = pickBestMove(state.board, color, state, chainJumps);
        if (!next) break;
        const nextCap = next.captures?.length || 0;
        log.push({
          type: "move",
          from: [...next.from],
          to: [...next.to],
          captures: next.captures ? next.captures.map((c) => [...c]) : [],
          moveKind: next.type,
          text: nextCap
            ? `Continued ${squareName(next.from[0], next.from[1])} → ${squareName(next.to[0], next.to[1])} (captured ${nextCap})`
            : `Continued ${squareName(next.from[0], next.from[1])} → ${squareName(next.to[0], next.to[1])}`,
        });
        if (!applyMove(state.board, next, state)) break;
        [br, bc] = next.to;
        move = next;
      }
    }
    const landed = state.board[br]?.[bc];
    if (landed?.bearAwakened && !state.meta.bearBonusUsed?.[aiColor]) {
      if (!state.meta.bearBonusUsed) state.meta.bearBonusUsed = {};
      state.meta.bearBonusUsed[aiColor] = true;
      const extras = getAllMovesForColor(state.board, aiColor, state).filter(
        (m) => m.from[0] === br && m.from[1] === bc
      );
      if (extras.length) {
        const extra = pickBestMove(state.board, aiColor, state, extras);
        if (!extra) return log;
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
    if (state.meta.pendingDouble?.[aiColor]) {
      const extra = getAllMovesForColor(state.board, color, state).filter(
        (m) => m.from[0] === br && m.from[1] === bc && (m.type === "step" || m.type === "jump")
      );
      const safeExtra = extra.filter((m) => {
        const sim = cloneMatchState(state);
        if (!applyMove(sim.board, m, sim)) return false;
        return !opponentCanCapture(sim.board, color, sim);
      });
      if (safeExtra.length) {
        const ex = pickBestMove(state.board, color, state, safeExtra);
        if (!ex) {
          state.meta.pendingDouble[aiColor] = false;
          return log;
        }
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
        [br, bc] = ex.to;
      }
      state.meta.pendingDouble[aiColor] = false;
    }
    if (state.meta.pendingPressMove?.[color]) {
      state.meta.pendingPressMove[color] = false;
      const pressMoves = getAllMovesForColor(state.board, color, state).filter(
        (m) => m.from[0] === br && m.from[1] === bc && !m.captures?.length
      );
      if (pressMoves.length) {
        const bestPress = pickBestMove(state.board, color, state, pressMoves);
        if (!bestPress) return log;
        applyMove(state.board, bestPress, state);
        log.push({
          type: "move",
          from: [...bestPress.from],
          to: [...bestPress.to],
          captures: bestPress.captures ? bestPress.captures.map((c) => [...c]) : [],
          moveKind: bestPress.type,
          pressExtra: true,
          text: `Press — extra step (no capture) ${squareName(bestPress.from[0], bestPress.from[1])} → ${squareName(bestPress.to[0], bestPress.to[1])}`,
        });
      }
    }
  } else {
    log.push({ type: "message", text: `${opponentName} had no legal move.` });
    if (state.meta.pendingPressMove?.[color]) state.meta.pendingPressMove[color] = false;
  }

  return log;
}
