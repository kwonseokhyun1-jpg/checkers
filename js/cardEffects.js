/**
 * Card targeting UI + AI auto-play
 */
import { COLORS, SIZE, isDarkSquare, inBounds, piecesOfColor, enemyPieces, getAdjacentEmpty, getTeleportTargets, getBoltTarget, getFireblastTarget } from "./board.js";
import { sk, handLimit } from "./gameMeta.js";
import { applyCard, applyEffect } from "./cardEffectHandlers.js";
import { drawRandomCard, createCardInstance } from "./cards.js";

export { applyCard, applyEffect };
export { findCullTarget, cullVictimSnapshot, CULL_ANIMATION_MS } from "./cullAnimation.js";

export function initCardState(state) {
  state.squares = state.squares || {};
  state.captured = state.captured || { [COLORS.RED]: [], [COLORS.BLACK]: [] };
}

export function isInstant(card) {
  return card.mode === "instant" || card.mode === "discard_pick";
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
    e_empty: "Click an enemy, then an empty square.",
    e_e_adj: "Click two adjacent enemies.",
    f_f_adj: "Click two adjacent friendly pieces.",
    diagonal: "Click your piece, then a strike target on its diagonal.",
    any_piece: "Click any piece, then a second piece to copy.",
    any_square: "Click a square on the board.",
    empty_empty: "Click two empty dark squares.",
    discard_pick: "Choose a card from your hand to discard.",
  };
  if (card.effect === "counterspell" || card.id === "counterspell") {
    return "Hidden trap — cancels their next spell when they cast it.";
  }
  return hints[card.mode] || "Click valid targets on the board.";
}

function at(state, r, c) {
  return state.board[r]?.[c] ?? null;
}

function emptyDark(state, r, c) {
  const k = sk(r, c);
  if (state.meta.collapsed?.has(k)) return false;
  if (state.squares[k]?.obstacle) return false;
  return isDarkSquare(r, c) && !at(state, r, c);
}

export function getValidTargets(state, color, card, picks) {
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
          if (p && p.color === color) res.push([r, c]);
        }
      return res;
    case "enemy":
      for (let r = 0; r < SIZE; r++)
        for (let c = 0; c < SIZE; c++) {
          const p = at(state, r, c);
          if (p && p.color === o) res.push([r, c]);
        }
      return res;
    case "empty":
      for (let r = 0; r < SIZE; r++)
        for (let c = 0; c < SIZE; c++) if (emptyDark(state, r, c)) res.push([r, c]);
      return res;
    case "any_square":
      for (let r = 0; r < SIZE; r++)
        for (let c = 0; c < SIZE; c++) if (inBounds(r, c)) res.push([r, c]);
      return res;
    case "f_empty": {
      if (picks.length === 0) return getValidTargets(state, color, { mode: "friendly" }, []);
      const [pr, pc] = picks[0];
      const p = at(state, pr, pc);
      if (!p || p.color !== color) return [];
      if (card.effect === "blink_2" || card.effect === "teleport") return getTeleportTargets(state.board, p);
      if (card.effect === "long_step")
        return [[pr + 2, pc + 2], [pr + 2, pc - 2], [pr - 2, pc + 2], [pr - 2, pc - 2]].filter(
          ([r, c]) => emptyDark(state, r, c)
        );
      if (card.effect === "sidestep")
        return [
          [pr, pc - 1],
          [pr, pc + 1],
        ].filter(([r, c]) => emptyDark(state, r, c));
      return getAdjacentEmpty(state.board, p).filter(([r, c]) => emptyDark(state, r, c));
    }
    case "f_f":
      return getValidTargets(state, color, { mode: "friendly" }, []);
    case "f_e":
    case "f_e_adj":
      if (picks.length === 0) return getValidTargets(state, color, { mode: "friendly" }, []);
      return getValidTargets(state, color, { mode: "enemy" }, []);
    case "e_empty":
      if (picks.length === 0) return getValidTargets(state, color, { mode: "enemy" }, []);
      return getValidTargets(state, color, { mode: "empty" }, []);
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
            if (card.mode === "e_e_adj" && p.color === o) res.push([r, c]);
            if (card.mode === "f_f_adj" && p.color === color) res.push([r, c]);
          }
        return res;
      }
    case "diagonal": {
      if (picks.length === 0) return getValidTargets(state, color, { mode: "friendly" }, []);
      const [pr, pc] = picks[0];
      const p = at(state, pr, pc);
      if (!p) return [];
      if (card.effect === "fireblast") return getFireblastTarget(state.board, p);
      return getBoltTarget(state.board, p);
    }
    case "any_piece":
      if (picks.length === 0) {
        for (let r = 0; r < SIZE; r++)
          for (let c = 0; c < SIZE; c++) if (at(state, r, c)) res.push([r, c]);
        return res;
      }
      return getValidTargets(state, color, { mode: "friendly" }, []);
    case "empty_empty":
      if (picks.length === 0) return getValidTargets(state, color, { mode: "empty" }, []);
      return getValidTargets(state, color, { mode: "empty" }, []);
    default:
      return [];
  }
}

export function playInstant(state, color, card) {
  if (card.mode === "discard_pick" && card.effect === "recycle") {
    return { success: false, message: "Select a card in hand to discard.", needsDiscard: true };
  }
  return applyCard(state, color, card, []);
}

function* pickSequences(state, color, card, max = 24) {
  const t0 = getValidTargets(state, color, card, []);
  if (card.mode === "instant") {
    yield [];
    return;
  }
  if (card.mode === "friendly" || card.mode === "enemy" || card.mode === "empty" || card.mode === "any_square") {
    for (const p of t0.slice(0, max)) yield [p];
    return;
  }
  if (card.mode === "f_f" || card.mode === "e_e_adj" || card.mode === "f_f_adj") {
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
  if (card.mode === "f_empty" || card.mode === "diagonal" || card.mode === "f_e" || card.mode === "e_empty") {
    let n = 0;
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
  if (isInstant(card)) return true;
  for (const _ of pickSequences(state, color, card, 8)) return true;
  return false;
}
