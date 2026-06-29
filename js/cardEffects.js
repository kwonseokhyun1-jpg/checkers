/**
 * Card targeting UI + AI auto-play
 */
import { COLORS, SIZE, isDarkSquare, inBounds, piecesOfColor, enemyPieces, getAdjacentEmpty, getLeapfrogTargets, getTeleportTargets, getBoltTarget, getCryoBoltTarget, getAdjacentForwardBoltTarget, getBackstepTarget, getDashDestinations, getDiagonalThroughSquares, getDiagonalAdjacentSquares, hasMandatoryJumps, pieceHasLegalMoves, pieceHasIntrinsicMoves, isFortified, getAllMovesForColor } from "./board.js";
import { collapsedSquareKey, ensureConstitutionTurns, isInDarknessZone, sk, handLimit } from "./gameMeta.js";
import { applyCard, applyEffect, chainLightningCanTarget, callForwardMoveOk, deportCanTarget, getDisplacementDestinations, longStepOk, magnetHasPull, ownBackRank, randomTeleportHasDestination, reviveSquareAllowed } from "./cardEffectHandlers.js";
import { drawRandomCard, createCardInstance } from "./cards.js";
import { friendlyHasDebuffs, pieceHasIronWillDebuff } from "./pieceStatus.js";

export { applyCard, applyEffect };
export { findCullTarget, cullVictimSnapshot, CULL_ANIMATION_MS } from "./cullAnimation.js";

export function initCardState(state) {
  state.squares = state.squares || {};
  state.captured = state.captured || { [COLORS.RED]: [], [COLORS.BLACK]: [] };
}

export function isInstant(card) {
  return card.mode === "instant" || card.mode === "discard_pick";
}

export function getInstantCastBlockReason(state, color, card) {
  if (card.effect === "ignore" && !hasMandatoryJumps(state.board, color, state)) {
    return "Ignore only when capture is mandatory.";
  }
  if (card.effect === "constitution" && !piecesOfColor(state.board, color).some((p) => p.king)) {
    return "Constitution requires at least one king.";
  }
  if (card.effect === "last_king" && piecesOfColor(state.board, color).length !== 1) {
    return "Last King requires exactly one piece on the board.";
  }
  if (card.effect === "purify" && !friendlyHasDebuffs(state.board, color)) {
    return "Purify requires at least one debuffed friendly piece.";
  }
  return null;
}

export function canCastInstant(state, color, card) {
  return getInstantCastBlockReason(state, color, card) === null;
}

/** Traps armed in secret — opponent must not see which card was played until it triggers. */
export function isHiddenTrapSpell(card) {
  const effect = card?.effect || card?.id;
  return (
    effect === "counterspell" ||
    effect === "vengeance" ||
    effect === "landmine" ||
    effect === "quicksand" ||
    effect === "last_stand" ||
    effect === "deflect_1"
  );
}

export function getCardHint(card) {
  const hints = {
    instant: "Instant effect — no targeting needed.",
    friendly: "Click one of your pieces.",
    enemy: "Click an enemy piece.",
    empty: "Click an empty dark square.",
    f_empty: "Click your piece, then a destination.",
    f_f: "Click two of your pieces.",
    f_e: "Click your piece, then an enemy.",
    f_e_adj: "Click your piece, then an adjacent enemy.",
    e_e: "Click two enemy pieces to link their fate.",
    e_empty: "Click an enemy, then an empty square.",
    pyromancy_hint: "Click an enemy piece, then an empty dark square to ignite.",
    e_e_adj: "Click two adjacent enemies.",
    f_f_adj: "Click two adjacent friendly pieces.",
    diagonal: "Click your piece, then a strike target on its diagonal.",
    any_piece: "Click any piece, then a second piece to copy.",
    snowball_hint: "Click an enemy piece to freeze it.",
    any_square: "Click a square on the board.",
    column: "Tap a file letter (a–h) below the board.",
    row: "Tap a rank number (1–8) beside the board.",
    e_e: "Click two enemy pieces to link their fate.",
    empty_empty: "Click two empty dark squares.",
    discard_pick: "Choose a card from your hand to discard.",
  };
  if (card.effect === "counterspell" || card.id === "counterspell") {
    return "Hidden trap — cancels their next spell when they cast it.";
  }
  if (card.effect === "vengeance" || card.id === "vengeance") {
    return "Hidden trap — destroys the next enemy who captures your piece.";
  }
  if (card.effect === "last_stand" || card.id === "last_stand") {
    return "Hidden trap — piece survives capture with an ultra shield for 3 turns.";
  }
  if (card.effect === "deflect_1" || card.id === "deflect") {
    return "Hidden trap — next spell hit within 2 turns reflects to the closest enemy.";
  }
  if (card.effect === "pyromancy") return hints.pyromancy_hint;
  if (card.effect === "snowball") return hints.snowball_hint;
  if (card.effect === "deep_freeze") return "Click your piece, then an adjacent diagonal square to choose direction.";
  if (card.effect === "barrier") return "Click a dark square — enemies cannot enter it next turn.";
  if (card.effect === "displacement") {
    return "Click your piece, then an empty square on your side of the board.";
  }
  if (card.effect === "mass_nudge") {
    return "Click your piece, then where it moves; optionally pick a second piece and destination.";
  }
  return hints[card.mode] || "Click valid targets on the board.";
}

export function picksRequiredForCard(card, picks = [], state = null, color = null) {
  if (card.effect === "snowball") return 1;
  if (card.effect === "mass_nudge" && state && color) {
    if (picks.length < 2) return 2;
    if (picks.length === 2 && massNudgeHasAnotherPiece(state, color, picks)) return 4;
    return picks.length;
  }
  const TWO_PICK_MODES = new Set([
    "f_empty",
    "f_f",
    "f_e",
    "f_e_adj",
    "e_empty",
    "e_e",
    "e_e_adj",
    "f_f_adj",
    "diagonal",
    "any_piece",
    "empty_empty",
  ]);
  return TWO_PICK_MODES.has(card.mode) ? 2 : 1;
}

function massNudgeCanMovePiece(state, color, row, col, exclude = []) {
  const p = at(state, row, col);
  if (!p || p.color !== color || pieceCloakedByDarkness(state, row, col)) return false;
  if (exclude.some(([er, ec]) => er === row && ec === col)) return false;
  return getAdjacentEmpty(state.board, p).some(([r, c]) => emptyDark(state, r, c));
}

export function massNudgeHasAnotherPiece(state, color, picks) {
  if (picks.length < 2) return false;
  const used = picks.filter((_, i) => i % 2 === 0);
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (massNudgeCanMovePiece(state, color, r, c, used)) return true;
    }
  }
  return false;
}

function friendlyWithAdjacentEnemy(state, color) {
  const o = color === COLORS.RED ? COLORS.BLACK : COLORS.RED;
  const res = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const p = at(state, r, c);
      if (!p || p.color !== color || pieceCloakedByDarkness(state, r, c)) continue;
      let found = false;
      for (let dr = -1; dr <= 1 && !found; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (!dr && !dc) continue;
          const ep = at(state, r + dr, c + dc);
          if (ep && ep.color === o && !pieceCloakedByDarkness(state, r + dr, c + dc)) {
            found = true;
            break;
          }
        }
      }
      if (found) res.push([r, c]);
    }
  }
  return res;
}

function adjacentEnemiesTo(state, color, row, col) {
  const o = color === COLORS.RED ? COLORS.BLACK : COLORS.RED;
  const res = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      const r = row + dr;
      const c = col + dc;
      const p = at(state, r, c);
      if (p && p.color === o && !pieceCloakedByDarkness(state, r, c)) res.push([r, c]);
    }
  }
  return res;
}

/** True when this piece has a legal move whose landing square pulses adjacent enemies (bomb/shockwave). */
function armedMoveEffectCanHitAdjacentEnemy(state, color, row, col) {
  if (!pieceHasLegalMoves(state.board, color, state, row, col)) return false;
  const o = color === COLORS.RED ? COLORS.BLACK : COLORS.RED;
  const moves = getAllMovesForColor(state.board, color, state).filter(
    (m) => m.from[0] === row && m.from[1] === col
  );
  for (const move of moves) {
    const [tr, tc] = move.to;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue;
        const p = at(state, tr + dr, tc + dc);
        if (p && p.color === o && !pieceCloakedByDarkness(state, tr + dr, tc + dc)) return true;
      }
    }
  }
  return false;
}

function at(state, r, c) {
  return state.board[r]?.[c] ?? null;
}

function squareBlocked(state, r, c) {
  const k = sk(r, c);
  if (collapsedSquareKey(state.meta) === k) return true;
  if (state.squares[k]?.obstacle) return true;
  return false;
}

function emptyDark(state, r, c) {
  if (squareBlocked(state, r, c)) return false;
  return isDarkSquare(r, c) && !at(state, r, c);
}

function darkSquare(state, r, c) {
  if (squareBlocked(state, r, c)) return false;
  return isDarkSquare(r, c);
}

function pieceCloakedByDarkness(state, r, c) {
  return isInDarknessZone(state, r, c);
}

function deepFreezeHasEnemyOnDiagonal(state, color, r, c) {
  const o = color === COLORS.RED ? COLORS.BLACK : COLORS.RED;
  for (const [er, ec] of getDiagonalThroughSquares(r, c)) {
    const t = at(state, er, ec);
    if (t && t.color === o && !pieceCloakedByDarkness(state, er, ec)) return true;
  }
  return false;
}

function berserkEnemyBackRows(color) {
  return color === COLORS.RED ? [0, 1, 2] : [5, 6, 7];
}

function getBerserkDestinations(state, color) {
  const enemyBack = berserkEnemyBackRows(color);
  const spots = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (enemyBack.includes(r)) continue;
      if (!isDarkSquare(r, c) || squareBlocked(state, r, c)) continue;
      const t = at(state, r, c);
      if (t && t.color === color) continue;
      if (t && t.color !== color && pieceCloakedByDarkness(state, r, c)) continue;
      spots.push([r, c]);
    }
  }
  return spots;
}

/** True when berserk landing on this square removes the occupant (not just teleports). */
function berserkWouldDestroyAt(state, color, r, c) {
  const t = at(state, r, c);
  if (!t || t.color === color) return false;
  if (pieceCloakedByDarkness(state, r, c)) return false;
  if (isInDarknessZone(state, r, c)) return false;
  if (t.cloneNoCaptureThisTurn) return false;
  if (isFortified(t)) return false;
  if (t.king && ensureConstitutionTurns(state.meta)[t.color] > 0) return false;
  if (t.lastStand) return false;
  if ((t.deflectTurns || 0) > 0) return false;
  if (t.mirrorShield) return false;
  return true;
}

/** Single-target friendly spells that shield or protect a piece. */
const FRONT_ROW_PROTECTION_EFFECTS = new Set([
  "shield_1",
  "shield_2",
  "last_stand",
  "fortify",
  "deflect_1",
  "mirror_shield",
  "ghost_guard",
  "bulwark",
]);

/** Enemy-targeting spells that should hit the opponent's front line first. */
const ENEMY_FRONT_ROW_EFFECTS = new Set(["snowball"]);

/** Armed-move spells (bomb/shockwave) — prefer the friendly front row that can move and pulse enemies. */
const FRIENDLY_FRONT_ROW_OFFENSIVE_EFFECTS = new Set(["bomb", "shockwave"]);

/** Friendly spells that only make sense on pieces able to move this turn. */
const FRIENDLY_REQUIRES_MOVABLE = new Set([
  "bomb",
  "shockwave",
  "bishop_2",
  "bishop_3",
  "rook_2",
  "rook_3",
]);

/** Most advanced row for this color (closest to the opponent). */
function frontRowRank(state, color) {
  let front = color === COLORS.RED ? Infinity : -Infinity;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const p = at(state, r, c);
      if (!p || p.color !== color) continue;
      if (color === COLORS.RED) front = Math.min(front, r);
      else front = Math.max(front, r);
    }
  }
  return front === Infinity || front === -Infinity ? null : front;
}

function preferRowTargets(targets, row) {
  if (row == null || !targets.length) return targets;
  const onRow = targets.filter(([r]) => r === row);
  return onRow.length ? onRow : targets;
}

/** Prefer front-row targets for AI spell picks (friendly protection or enemy debuffs). */
function prioritizeFrontRowTargets(state, color, card, targets) {
  if (!targets.length) return targets;
  if (FRONT_ROW_PROTECTION_EFFECTS.has(card.effect)) {
    return preferRowTargets(targets, frontRowRank(state, color));
  }
  if (ENEMY_FRONT_ROW_EFFECTS.has(card.effect)) {
    const opponent = color === COLORS.RED ? COLORS.BLACK : COLORS.RED;
    return preferRowTargets(targets, frontRowRank(state, opponent));
  }
  if (FRIENDLY_FRONT_ROW_OFFENSIVE_EFFECTS.has(card.effect)) {
    return preferRowTargets(targets, frontRowRank(state, color));
  }
  return targets;
}

/** True when dash landing on this square removes the occupant. */
function dashWouldKillAt(state, color, r, c) {
  const t = at(state, r, c);
  if (!t || t.color === color) return false;
  if (pieceCloakedByDarkness(state, r, c)) return false;
  if (t.shieldTurns > 0 || isFortified(t)) return false;
  return true;
}

function fEmptyFirstPickTargets(state, color, card) {
  const friends = getValidTargets(state, color, { mode: "friendly" }, []);
  const filter = (hasDest) => friends.filter(([r, c]) => {
    const piece = at(state, r, c);
    return piece && hasDest(piece, r, c);
  });
  if (card.effect === "clone") {
    return filter((piece) => !piece.king && getAdjacentEmpty(state.board, piece).some(([r, c]) => emptyDark(state, r, c)));
  }
  if (card.effect === "backstep") {
    return filter((piece) => getBackstepTarget(state.board, piece, state).length > 0);
  }
  if (card.effect === "leapfrog" || card.effect === "phase_walk") {
    return filter((piece) =>
      getLeapfrogTargets(state.board, piece, color).some(([r, c]) => emptyDark(state, r, c))
    );
  }
  if (card.effect === "recall") {
    const row = ownBackRank(color);
    const hasBackSpot = Array.from({ length: SIZE }, (_, c) => c).some((c) => emptyDark(state, row, c));
    return hasBackSpot ? friends : [];
  }
  if (card.effect === "long_step") {
    return filter((piece, r, c) =>
      [[r + 2, c + 2], [r + 2, c - 2], [r - 2, c + 2], [r - 2, c - 2]].some(([tr, tc]) => longStepOk(state, r, c, tr, tc))
    );
  }
  if (card.effect === "dash") {
    return filter((piece) => getDashDestinations(state, piece).length > 0);
  }
  if (card.effect === "blink_2" || card.effect === "teleport") {
    return filter((piece) => getTeleportTargets(state.board, piece).some(([r, c]) => emptyDark(state, r, c)));
  }
  if (card.effect === "berserk") {
    return getBerserkDestinations(state, color).length ? friends : [];
  }
  if (card.effect === "displacement") {
    return getDisplacementDestinations(state, color).length ? friends : [];
  }
  if (card.effect === "nudge") {
    return filter((piece) => getAdjacentEmpty(state.board, piece).some(([r, c]) => emptyDark(state, r, c)));
  }
  if (card.effect === "sidestep") {
    return filter((piece, r, c) =>
      [[r, c - 2], [r, c + 2]].some(([tr, tc]) => emptyDark(state, tr, tc))
    );
  }
  return friends;
}

export function getValidTargets(state, color, card, picks) {
  if (card.effect === "revive" && !(state.captured?.[color]?.length)) return [];
  const o = color === COLORS.RED ? COLORS.BLACK : COLORS.RED;
  const res = [];

  switch (card.mode) {
    case "instant":
    case "discard_pick":
      return [];
    case "friendly":
      for (let r = 0; r < SIZE; r++)
        for (let c = 0; c < SIZE; c++) {
          const p = at(state, r, c);
          if (!p || p.color !== color) continue;
          if (pieceCloakedByDarkness(state, r, c)) continue;
          if (FRIENDLY_REQUIRES_MOVABLE.has(card.effect) && !pieceHasLegalMoves(state.board, color, state, r, c)) continue;
          if (
            (card.effect === "bomb" || card.effect === "shockwave") &&
            !armedMoveEffectCanHitAdjacentEnemy(state, color, r, c)
          ) continue;
          if (card.effect === "chain_lightning" && !chainLightningCanTarget(state, r, c, color)) continue;
          if (card.effect === "magnet" && !magnetHasPull(state, color, r, c)) continue;
          if (card.effect === "random_teleport" && !randomTeleportHasDestination(state, r, c)) continue;
          if (card.effect === "iron_will" && !pieceHasIronWillDebuff(p)) continue;
          res.push([r, c]);
        }
      return res;
    case "enemy":
      for (let r = 0; r < SIZE; r++)
        for (let c = 0; c < SIZE; c++) {
          const p = at(state, r, c);
          if (p && p.color === o) {
            if (pieceCloakedByDarkness(state, r, c)) continue;
            if (card.effect === "snipe") {
              let found = false;
              for (const fp of piecesOfColor(state.board, color)) {
                const dr = r - fp.row, dc = c - fp.col;
                if (Math.abs(dr) === Math.abs(dc) && Math.abs(dr) >= 3) {
                  const stepR = Math.sign(dr), stepC = Math.sign(dc);
                  let clear = true;
                  for (let i = 1; i < Math.abs(dr); i++) {
                    if (at(state, fp.row + stepR * i, fp.col + stepC * i)) { clear = false; break; }
                  }
                  if (clear) { found = true; break; }
                }
              }
              if (found) res.push([r, c]);
            } else if (card.effect === "deport") {
              if (deportCanTarget(state, p, r, c)) res.push([r, c]);
            } else if (card.effect === "execution") {
              if (!pieceHasIntrinsicMoves(state.board, o, state, r, c)) res.push([r, c]);
            } else res.push([r, c]);
          }
        }
      return res;
    case "column":
      for (let c = 0; c < SIZE; c++) res.push([3, c]);
      return res;
    case "row":
      for (let r = 0; r < SIZE; r++) res.push([r, 3]);
      return res;
    case "any_square":
      for (let r = 0; r < SIZE; r++)
        for (let c = 0; c < SIZE; c++) if (inBounds(r, c)) res.push([r, c]);
      return res;
    case "f_empty": {
      if (card.effect === "mass_nudge") {
        if (picks.length === 0) {
          const res = [];
          for (let r = 0; r < SIZE; r++) {
            for (let c = 0; c < SIZE; c++) {
              if (massNudgeCanMovePiece(state, color, r, c)) res.push([r, c]);
            }
          }
          return res;
        }
        if (picks.length === 1) {
          const [pr, pc] = picks[0];
          const p = at(state, pr, pc);
          if (!p || p.color !== color) return [];
          return getAdjacentEmpty(state.board, p).filter(([r, c]) => emptyDark(state, r, c));
        }
        if (picks.length === 2) {
          const used = [picks[0]];
          const res = [];
          for (let r = 0; r < SIZE; r++) {
            for (let c = 0; c < SIZE; c++) {
              if (massNudgeCanMovePiece(state, color, r, c, used)) res.push([r, c]);
            }
          }
          return res;
        }
        if (picks.length === 3) {
          const [pr, pc] = picks[2];
          const p = at(state, pr, pc);
          if (!p || p.color !== color) return [];
          return getAdjacentEmpty(state.board, p).filter(([r, c]) => emptyDark(state, r, c));
        }
        return [];
      }
      if (picks.length === 0) return fEmptyFirstPickTargets(state, color, card);
      const [pr, pc] = picks[0];
      const p = at(state, pr, pc);
      if (!p || p.color !== color) return [];
      if (card.effect === "blink_2" || card.effect === "teleport") return getTeleportTargets(state.board, p);
      if (card.effect === "long_step")
        return [[pr + 2, pc + 2], [pr + 2, pc - 2], [pr - 2, pc + 2], [pr - 2, pc - 2]].filter(
          ([r, c]) => longStepOk(state, pr, pc, r, c)
        );
      if (card.effect === "dash") {
        return getDashDestinations(state, p).filter(([r, c]) => {
          const cell = at(state, r, c);
          if (!cell || cell.color === color) return true;
          return !pieceCloakedByDarkness(state, r, c) && cell.shieldTurns <= 0 && !isFortified(cell);
        });
      }
      if (card.effect === "sidestep")
        return [
          [pr, pc - 2],
          [pr, pc + 2],
        ].filter(([r, c]) => emptyDark(state, r, c));
      if (card.effect === "clone") return getAdjacentEmpty(state.board, p).filter(([r, c]) => emptyDark(state, r, c));
      if (card.effect === "backstep") return getBackstepTarget(state.board, p, state);
      if (card.effect === "leapfrog" || card.effect === "phase_walk") {
        return getLeapfrogTargets(state.board, p, color).filter(([r, c]) => emptyDark(state, r, c));
      }
      if (card.effect === "recall") {
        const row = ownBackRank(color);
        const spots = [];
        for (let c = 0; c < SIZE; c++) {
          if (emptyDark(state, row, c)) spots.push([row, c]);
        }
        return spots;
      }
      if (card.effect === "berserk") return getBerserkDestinations(state, color);
      if (card.effect === "displacement") return getDisplacementDestinations(state, color);
      return getAdjacentEmpty(state.board, p).filter(([r, c]) => emptyDark(state, r, c));
    }
    case "f_f":
      return getValidTargets(state, color, { mode: "friendly" }, []);
    case "f_e":
      if (picks.length === 0) return getValidTargets(state, color, { mode: "friendly" }, []);
      return getValidTargets(state, color, { mode: "enemy" }, []);
    case "f_e_adj":
      if (picks.length === 0) return friendlyWithAdjacentEnemy(state, color);
      return adjacentEnemiesTo(state, color, picks[0][0], picks[0][1]);
    case "e_empty":
      if (picks.length === 0) return getValidTargets(state, color, { mode: "enemy", effect: card.effect }, []);
      return getValidTargets(state, color, { mode: "empty", effect: card.effect }, picks);
    case "e_e":
      if (picks.length === 0) return getValidTargets(state, color, { mode: "enemy" }, []);
      {
        const [r0, c0] = picks[0];
        for (let r = 0; r < SIZE; r++)
          for (let c = 0; c < SIZE; c++) {
            const p = at(state, r, c);
            if (p && p.color === o && !(r === r0 && c === c0) && !pieceCloakedByDarkness(state, r, c)) res.push([r, c]);
          }
        return res;
      }
    case "e_e_adj":
    case "f_f_adj":
      if (picks.length === 0) return getValidTargets(state, color, { mode: card.mode === "e_e_adj" ? "enemy" : "friendly" }, []);
      {
        const [r0, c0] = picks[0];
        for (let dr = -1; dr <= 1; dr++)
          for (let dc = -1; dc <= 1; dc++) {
            if (!dr && !dc) continue;
            const r = r0 + dr,
              c = c0 + dc;
            const p = at(state, r, c);
            if (!p) continue;
            if (pieceCloakedByDarkness(state, r, c)) continue;
            if (card.mode === "e_e_adj" && p.color === o) res.push([r, c]);
            if (card.mode === "f_f_adj" && p.color === color) res.push([r, c]);
          }
        return res;
      }
    case "diagonal": {
      if (picks.length === 0) {
        const friends = getValidTargets(state, color, { mode: "friendly" }, []);
        if (card.effect === "deep_freeze") {
          return friends.filter(([r, c]) => deepFreezeHasEnemyOnDiagonal(state, color, r, c));
        }
        return friends;
      }
      const [pr, pc] = picks[0];
      const p = at(state, pr, pc);
      if (!p) return [];
      if (card.effect === "deep_freeze") return getDiagonalAdjacentSquares(pr, pc);
      if (card.effect === "forward_bolt") {
        return getAdjacentForwardBoltTarget(state.board, p).filter(([r, c]) => !pieceCloakedByDarkness(state, r, c));
      }
      if (card.effect === "cryo_bolt") {
        return getCryoBoltTarget(state.board, p).filter(([r, c]) => !pieceCloakedByDarkness(state, r, c));
      }
      return getBoltTarget(state.board, p).filter(([r, c]) => !pieceCloakedByDarkness(state, r, c));
    }
    case "any_piece":
      if (card.effect === "snowball") {
        if (picks.length === 0) {
          for (let r = 0; r < SIZE; r++)
            for (let c = 0; c < SIZE; c++) {
              const p = at(state, r, c);
              if (p && p.color === o && !pieceCloakedByDarkness(state, r, c)) res.push([r, c]);
            }
        }
        return res;
      }
      if (picks.length === 0) {
        for (let r = 0; r < SIZE; r++)
          for (let c = 0; c < SIZE; c++) {
            if (at(state, r, c) && !pieceCloakedByDarkness(state, r, c)) res.push([r, c]);
          }
        return res;
      }
      return getValidTargets(state, color, { mode: "friendly" }, []);
    case "empty_empty":
      if (picks.length === 0) return getValidTargets(state, color, { mode: "empty" }, []);
      return getValidTargets(state, color, { mode: "empty" }, []);
    case "empty": {
      const squareOk =
        card.effect === "barrier"
          ? (r, c) => darkSquare(state, r, c)
          : (r, c) => emptyDark(state, r, c) && (card.effect !== "revive" || reviveSquareAllowed(color, r));
      for (let r = 0; r < SIZE; r++)
        for (let c = 0; c < SIZE; c++)
          if (squareOk(r, c)) res.push([r, c]);
      if (card.effect === "call_forward" && picks.length === 1) {
        const [er, ec] = picks[0];
        return res.filter(([r, c]) => callForwardMoveOk(state, er, ec, r, c));
      }
      return res;
    }
    default:
      return [];
  }
}

export function playInstant(state, color, card) {
  if (card.mode === "discard_pick" && card.effect === "recycle") {
    return { success: false, message: "Select a card in hand to discard.", needsDiscard: true };
  }
  const blockReason = getInstantCastBlockReason(state, color, card);
  if (blockReason) {
    return { success: false, message: blockReason };
  }
  return applyCard(state, color, card, []);
}

function getAiPickTargets(state, color, card) {
  const targets = getValidTargets(state, color, card, []);
  if (card.effect === "plague") {
    return targets.filter(([r, c]) => adjacentEnemiesTo(state, color, r, c).length > 0);
  }
  return targets;
}

function* pickSequences(state, color, card, max = 24) {
  const t0 = prioritizeFrontRowTargets(state, color, card, getAiPickTargets(state, color, card));
  if (card.mode === "instant") {
    if (canCastInstant(state, color, card)) yield [];
    return;
  }
  if (card.mode === "column" || card.mode === "row") {
    for (const p of t0.slice(0, max)) yield [p];
    return;
  }
  if (card.mode === "friendly" || card.mode === "enemy" || card.mode === "empty" || card.mode === "any_square") {
    for (const p of t0.slice(0, max)) yield [p];
    return;
  }
  if (card.mode === "f_f" || card.mode === "e_e" || card.mode === "e_e_adj" || card.mode === "f_f_adj" || card.mode === "f_e_adj") {
    let n = 0;
    for (const a of t0) {
      const t1 = getValidTargets(state, color, card, [a]);
      for (const b of t1) {
        yield [a, b];
        if (++n >= max) return;
      }
    }
    return;
  }
  if (card.effect === "mass_nudge") {
    let n = 0;
    const starters = getValidTargets(state, color, card, []);
    for (const a of starters) {
      const d1 = getValidTargets(state, color, card, [a]);
      for (const b of d1) {
        yield [a, b];
        if (++n >= max) return;
        const secondPieces = getValidTargets(state, color, card, [a, b]);
        for (const c of secondPieces) {
          const d2 = getValidTargets(state, color, card, [a, b, c]);
          for (const d of d2) {
            yield [a, b, c, d];
            if (++n >= max) return;
          }
        }
      }
    }
    return;
  }
  if (card.mode === "f_empty" || card.mode === "diagonal" || card.mode === "f_e" || card.mode === "e_empty") {
    let n = 0;
    if (card.effect === "berserk") {
      const destroySeqs = [];
      const otherSeqs = [];
      for (const a of t0) {
        const t1 = getValidTargets(state, color, card, [a]);
        for (const b of t1) {
          if (berserkWouldDestroyAt(state, color, b[0], b[1])) destroySeqs.push([a, b]);
          else otherSeqs.push([a, b]);
        }
      }
      for (const seq of destroySeqs) {
        yield seq;
        if (++n >= max) return;
      }
      for (const seq of otherSeqs) {
        yield seq;
        if (++n >= max) return;
      }
      return;
    }
    if (card.effect === "dash") {
      const killSeqs = [];
      const moveSeqs = [];
      for (const a of t0) {
        const t1 = getValidTargets(state, color, card, [a]);
        for (const b of t1) {
          if (dashWouldKillAt(state, color, b[0], b[1])) killSeqs.push([a, b]);
          else moveSeqs.push([a, b]);
        }
      }
      for (const seq of killSeqs) {
        yield seq;
        if (++n >= max) return;
      }
      for (const seq of moveSeqs) {
        yield seq;
        if (++n >= max) return;
      }
      return;
    }
    for (const a of t0) {
      const t1 = getValidTargets(state, color, card, [a]);
      for (const b of t1) {
        yield [a, b];
        if (++n >= max) return;
      }
      if (card.mode === "diagonal" && t1.length === 1) {
        yield [a, t1[0]];
        n++;
      }
    }
    return;
  }
  if (card.mode === "empty_empty") {
    let n = 0;
    for (const a of t0) {
      for (const b of t0) {
        if (a[0] === b[0] && a[1] === b[1]) continue;
        yield [a, b];
        if (++n >= max) return;
      }
    }
    return;
  }
  if (card.mode === "any_piece" && card.effect === "snowball") {
    for (const p of t0.slice(0, max)) yield [p];
  }
}

export function tryAutoPlay(state, color, card) {
  for (const picks of pickSequences(state, color, card)) {
    const res = applyCard(state, color, card, picks);
    if (res.success) return { ...res, picks: picks.map((p) => [...p]) };
  }
  if (isInstant(card)) {
    const res = applyCard(state, color, card, []);
    if (res.success) return { ...res, picks: [] };
    return res;
  }
  return { success: false, message: "No valid play" };
}

export function canAiPlay(state, color, card) {
  if (isInstant(card)) return canCastInstant(state, color, card);
  for (const _ of pickSequences(state, color, card, 8)) return true;
  return false;
}
