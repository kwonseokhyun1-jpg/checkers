/**
 * Spell cast animations — every board-affecting spell gets ≥1s visual feedback.
 */
import { SIZE, inBounds, isDarkSquare } from "./board.js";
import { findCullTarget, cullVictimSnapshot, CULL_ANIMATION_MS } from "./cullAnimation.js";

export const MIN_SPELL_ANIM_MS = 1000;
export { findCullTarget, cullVictimSnapshot, CULL_ANIMATION_MS };

/** Meta / hand / turn-rule spells — shimmer only, no board shake */
const META_EFFECTS = new Set([
  "quick_march", "overrun", "ricochet", "blind", "confusion", "counterspell", "dominion",
  "conduct", "mirror_move", "roulette", "rules_lawyer", "mirror_board", "highlight_path",
  "pocket", "possession", "chameleon", "identity_theft", "succession",
  "twin_soul", "last_king", "constitution", "sanctuary_pulse", "parallel", "echo",
]);

/** Board shake — heavy impact only */
const BOARD_SHAKE_EFFECTS = new Set([
  "destroy_unshielded",
  "shatter",
  "execution",
  "detonate",
  "chain_lightning", "purify",
  "earthquake",
  "fireline",
  "fireblast",
  "cross_bolt",
  "duel",
  "scatter",
  "vacuum",
  "blizzard",
  "deep_freeze",
  "gravity_well",
  "shield_bash",
  "cryo_bolt",
  "cull",
]);

const KILL_EFFECTS = new Set([
  "snipe", "destroy_unshielded", "execution", "forward_bolt", "fireblast", "cryo_bolt",
  "coin_flip", "sacrifice", "backstab", "shatter",
]);

/** Multi-target damage / lines — not movement */
const MULTI_KILL_EFFECTS = new Set([
  "cross_bolt", "detonate", "fireline", "chain_lightning", "purify", "duel",
  "shield_bash", "spear_thrust", "bulwark", "gravity_well",
  "earthquake", "blizzard", "sanctuary", "tangle", "scatter", "vacuum",
]);

const MOVE_EFFECTS = new Set([
  "blink_2", "long_step", "sidestep", "nudge", "chain_pull", "repel", "leapfrog",
  "phase_walk", "corner_hop", "drift", "recall", "flank_3", "warp_gate",
  "bridge", "bait_switch", "hostile_swap", "mass_nudge", "butterfly", "iron_will",
]);

const SWAP_EFFECTS = new Set([
  "swap_friendly", "hostile_swap", "tangle", "mirror_board", "bait_switch",
]);

const TERRAIN_EFFECTS = new Set([
  "mine", "decoy", "quicksand", "obstacle", "collapse", "sanctified",
]);

const BUFF_EFFECTS = new Set([
  "shield_2", "retreat_3", "knight_perm", "crown", "rook_2", "bishop_2", "bishop_3",
  "rook_3", "queen_2", "pawn_zeal", "anchor_2", "bomb", "mirror_shield", "phalanx",
  "last_stand", "ghost_guard", "fortify", "hunters_mark", "promote_zone", "revive",
  "wraith_2", "stone_form", "rally", "fusion",
]);

const DEBUFF_EFFECTS = new Set([
  "freeze_1", "freeze_2", "deep_freeze", "root_2", "slow_2", "silence_3", "rust", "hex_3", "fog_2",
  "panic", "demote", "reverse_only_2", "venom", "backpedal",
]);

function animShake(effect, type) {
  if (type === "instant" || type === "buff" || type === "move" || type === "swap" || type === "terrain") {
    return false;
  }
  if (META_EFFECTS.has(effect)) return false;
  if (BOARD_SHAKE_EFFECTS.has(effect)) return true;
  if (type === "kill") return ["destroy_unshielded", "shatter", "execution", "detonate"].includes(effect);
  return false;
}

function withSpec(base, effect) {
  return { ...base, shake: animShake(effect, base.type) };
}

function adjSquares(row, col) {
  const out = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      const r = row + dr;
      const c = col + dc;
      if (inBounds(r, c) && isDarkSquare(r, c)) out.push([r, c]);
    }
  }
  return out;
}

export function squaresBetween(from, to) {
  if (!from || !to) return [];
  const [r1, c1] = from;
  const [r2, c2] = to;
  const dr = r2 === r1 ? 0 : Math.sign(r2 - r1);
  const dc = c2 === c1 ? 0 : Math.sign(c2 - c1);
  const out = [];
  let r = r1;
  let c = c1;
  out.push([r, c]);
  while (r !== r2 || c !== c2) {
    r += dr;
    c += dc;
    if (!inBounds(r, c)) break;
    out.push([r, c]);
  }
  return out;
}

function uniqueSquares(list) {
  const seen = new Set();
  const out = [];
  for (const [r, c] of list) {
    const k = `${r},${c}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push([r, c]);
  }
  return out;
}

/**
 * @param {{ effect: string, mode?: string, name?: string }} card
 * @param {number[][]} picks
 */
export function buildAnimSpec(card, picks = [], _color) {
  const effect = card.effect;
  const mode = card.mode || "instant";
  const p = picks.map((x) => [...x]);
  const label = card.name || "Spell";

  if (effect === "cull") {
    return withSpec({ type: "cull", duration: CULL_ANIMATION_MS, label, squares: [] }, effect);
  }

  if (META_EFFECTS.has(effect) && !p.length) {
    return withSpec({ type: "instant", duration: MIN_SPELL_ANIM_MS, label, squares: [] }, effect);
  }

  if (KILL_EFFECTS.has(effect) && p.length) {
    return withSpec({
      type: "kill",
      duration: MIN_SPELL_ANIM_MS,
      label,
      squares: [p[p.length - 1]],
    }, effect);
  }

  if ((MOVE_EFFECTS.has(effect) || (p.length >= 2 && mode !== "empty_empty")) && p.length >= 2) {
    const lineSquares = squaresBetween(p[0], p[1]);
    return withSpec({
      type: "move",
      duration: MIN_SPELL_ANIM_MS,
      label,
      squares: p.slice(0, 2),
      from: p[0],
      to: p[1],
      lineSquares,
    }, effect);
  }

  if (MULTI_KILL_EFFECTS.has(effect)) {
    let squares = [...p];
    if (p[0] && (effect === "detonate" || effect === "duel")) {
      squares = uniqueSquares([...squares, ...adjSquares(p[0][0], p[0][1])]);
    }
    if (p.length >= 2) {
      squares = uniqueSquares([...squares, ...squaresBetween(p[0], p[1])]);
    }
    return withSpec({
      type: "multi",
      duration: Math.max(MIN_SPELL_ANIM_MS, 1200),
      label,
      squares,
      from: p[0],
      to: p[1],
      lineSquares: p.length >= 2 ? squaresBetween(p[0], p[1]) : [],
    }, effect);
  }

  if (SWAP_EFFECTS.has(effect) && p.length >= 2) {
    return withSpec({
      type: "swap",
      duration: MIN_SPELL_ANIM_MS,
      label,
      squares: p.slice(0, 2),
      from: p[0],
      to: p[1],
    }, effect);
  }

  if (TERRAIN_EFFECTS.has(effect) && p.length) {
    return withSpec({ type: "terrain", duration: MIN_SPELL_ANIM_MS, label, squares: p }, effect);
  }

  if (p.length === 1) {
    if (mode === "enemy" || DEBUFF_EFFECTS.has(effect)) {
      return withSpec({ type: "debuff", duration: MIN_SPELL_ANIM_MS, label, squares: p }, effect);
    }
    if (mode === "friendly" || BUFF_EFFECTS.has(effect)) {
      return withSpec({ type: "buff", duration: MIN_SPELL_ANIM_MS, label, squares: p }, effect);
    }
    if (mode === "empty" || mode === "any_square") {
      return withSpec({ type: "terrain", duration: MIN_SPELL_ANIM_MS, label, squares: p }, effect);
    }
    return withSpec({ type: "generic", duration: MIN_SPELL_ANIM_MS, label, squares: p }, effect);
  }

  if (p.length >= 2) {
    return withSpec({
      type: "generic",
      duration: MIN_SPELL_ANIM_MS,
      label,
      squares: p,
      from: p[0],
      to: p[1],
      lineSquares: squaresBetween(p[0], p[1]),
    }, effect);
  }

  return withSpec({ type: "instant", duration: MIN_SPELL_ANIM_MS, label, squares: [] }, effect);
}

export function needsBoardAnimation(card) {
  if (!card) return false;
  if (card.effect === "cull") return true;
  if (META_EFFECTS.has(card.effect)) return false;
  return true;
}
