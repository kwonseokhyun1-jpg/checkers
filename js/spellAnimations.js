/**
 * Spell cast animations — every board-affecting spell gets ≥1s visual feedback.
 */
import { SIZE, inBounds, isDarkSquare, diagonalDirectionFromPick } from "./board.js";
import { findCullTarget, cullVictimSnapshot, CULL_ANIMATION_MS } from "./cullAnimation.js";
import { visualForEffect, metaOverlayForEffect, durationForVisual } from "./spellFx.js";

export const MIN_SPELL_ANIM_MS = 1000;
export { findCullTarget, cullVictimSnapshot, CULL_ANIMATION_MS };

/** Meta / hand / turn-rule spells — shimmer only, no board shake */
const META_EFFECTS = new Set([
  "quick_march", "trickster", "ricochet", "blind", "confusion", "extract", "counterspell", "vengeance", "dominion",
  "deflect_1",
  "conduct", "mirror_move", "roulette", "ignore", "mirror_board", "highlight_path",
  "pocket", "mind_control", "zombify", "chameleon", "identity_theft", "succession",
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
  "pyromancy",
  "cross_bolt",
  "duel",
  "scatter",
  "vacuum",
  "blizzard", "column",
  "deep_freeze",
  "gravity_well",
  "shield_bash",
  "cryo_bolt",
  "snowball",
  "berserk",
  "cull",
]);

const KILL_EFFECTS = new Set([
  "snipe", "destroy_unshielded", "execution", "forward_bolt", "pyromancy",
  "coin_flip", "sacrifice", "backstab", "shatter",
]);

/** Multi-target damage / lines — not movement */
const MULTI_KILL_EFFECTS = new Set([
  "cross_bolt", "detonate", "fireline", "chain_lightning", "purify", "duel",
  "shield_bash", "spear_thrust", "bulwark", "gravity_well",
  "earthquake", "blizzard", "column", "sanctuary", "tangle", "scatter", "vacuum",
]);

const MOVE_EFFECTS = new Set([
  "blink_2", "long_step", "sidestep", "nudge", "chain_pull", "repel", "leapfrog",
  "phase_walk", "corner_hop", "drift", "recall", "flank_3", "warp_gate", "berserk", "random_teleport",
  "bait_switch", "hostile_swap", "mass_nudge", "displacement", "magnet", "deport", "call_forward", "dash", "iron_will",
]);

const SWAP_EFFECTS = new Set([
  "trickster",
  "swap_friendly", "hostile_swap", "tangle", "mirror_board", "bait_switch",
]);

const TERRAIN_EFFECTS = new Set([
  "landmine", "barrier", "quicksand", "create_foe", "obstacle", "collapse", "sanctified",
]);

const BUFF_EFFECTS = new Set([
  "shield_1", "shield_2", "retreat_3", "knight_perm", "crown", "rook_2", "bishop_2", "bishop_3",
  "rook_3", "queen_2", "pawn_zeal", "anchor_2", "bomb", "shockwave", "mirror_shield", "phalanx",
  "last_stand", "ghost_guard", "fortify", "hibernation", "stall", "revive",
  "wraith_2", "rally", "fusion", "create_foe",
]);

const DEBUFF_EFFECTS = new Set([
  "freeze_1", "freeze_2", "snowball", "deep_freeze", "root_2", "slow_2", "silence_3", "fog_2",
  "panic", "demote", "reverse_only_2", "venom", "plague", "backpedal",
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

function animDurationForEffect(effect, fallback = MIN_SPELL_ANIM_MS) {
  const visual = visualForEffect(effect);
  const ms = visual ? durationForVisual(visual, fallback) : fallback;
  return Math.max(MIN_SPELL_ANIM_MS, ms ?? fallback);
}

function withVisual(base, effect) {
  const visual = visualForEffect(effect);
  if (!visual) return withSpec(base, effect);
  return withSpec({ ...base, visual }, effect);
}

function finishSpec(base, effect) {
  if (base.visual || base.overlay) return withSpec(base, effect);
  const metaOverlay = !base.squares?.length ? metaOverlayForEffect(effect) : null;
  if (metaOverlay) {
    const duration = Math.max(base.duration ?? MIN_SPELL_ANIM_MS, durationForVisual("meta", MIN_SPELL_ANIM_MS));
    return withSpec({ ...base, duration, overlay: metaOverlay }, effect);
  }
  const visual = visualForEffect(effect);
  if (!visual) return withSpec(base, effect);
  const duration = Math.max(base.duration ?? MIN_SPELL_ANIM_MS, animDurationForEffect(effect, base.duration));
  return withSpec({ ...base, visual, duration }, effect);
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
export function buildAnimSpec(card, picks = [], _color, extra = {}) {
  const effect = card.effect;
  const mode = card.mode || "instant";
  const p = picks.map((x) => [...x]);
  const label = card.name || "Spell";



  if (effect === "sanctuary" && extra.sanctuaryCells?.length) {
    return finishSpec({
      type: "buff",
      visual: "aura",
      duration: Math.max(MIN_SPELL_ANIM_MS, 1200),
      label,
      squares: extra.sanctuaryCells,
      from: p[0],
      to: p[0],
    }, effect);
  }

  if (effect === "darkness" && extra.darknessCells?.length) {
    return finishSpec({
      type: "debuff",
      visual: "aura",
      duration: Math.max(MIN_SPELL_ANIM_MS, 1200),
      label,
      squares: extra.darknessCells,
      from: p[0],
      to: p[0],
    }, effect);
  }

  if (effect === "trickster" && extra.tricksterSquares?.length) {
    return finishSpec({
      type: "swap",
      visual: "trickster",
      duration: Math.max(MIN_SPELL_ANIM_MS, 1400),
      label,
      squares: extra.tricksterSquares.slice(0, 8),
      from: extra.tricksterSquares[0],
      to: extra.tricksterSquares[4],
    }, effect);
  }

  if (effect === "pyromancy" && p.length >= 2) {
    const squares = extra.pyromancySquares || p.slice(0, 2);
    return finishSpec({
      type: "multi",
      visual: "fire",
      duration: Math.max(MIN_SPELL_ANIM_MS, 1400),
      label,
      squares,
      from: squares[0],
      to: squares[1],
    }, effect);
  }

  if (effect === "chain_lightning" && extra.chainSquares?.length) {
    const sq = extra.chainSquares;
    return finishSpec({
      type: "multi",
      visual: "lightning",
      duration: Math.max(MIN_SPELL_ANIM_MS, 1400),
      label,
      squares: sq,
      from: sq[0],
      to: sq[sq.length - 1],
      lineSquares: sq,
    }, effect);
  }

  if (effect === "coin_flip") {
    return withVisual({
      type: "instant",
      duration: animDurationForEffect(effect),
      label,
      squares: [],
      overlay: "coin",
    }, effect);
  }

  if (effect === "cull") {
    return withVisual({ type: "cull", duration: CULL_ANIMATION_MS, label, squares: [] }, effect);
  }

  if (effect === "cryo_bolt" && p.length >= 2) {
    const dur = animDurationForEffect(effect);
    const lineSquares = squaresBetween(p[0], p[1]);
    if (extra.cryoShatter) {
      return withVisual({
        type: "kill",
        duration: dur,
        label,
        squares: [p[1]],
        from: p[0],
        to: p[1],
        lineSquares,
      }, effect);
    }
    return finishSpec({
      type: "debuff",
      visual: "freeze",
      duration: dur,
      label,
      squares: [p[1]],
      from: p[0],
      to: p[1],
      lineSquares,
    }, effect);
  }

  if (META_EFFECTS.has(effect) && !p.length) {
    const overlay = metaOverlayForEffect(effect);
    const duration = overlay ? Math.max(MIN_SPELL_ANIM_MS, durationForVisual("meta", MIN_SPELL_ANIM_MS)) : MIN_SPELL_ANIM_MS;
    return finishSpec({ type: "instant", duration, label, squares: [], overlay: overlay || undefined }, effect);
  }

  if (KILL_EFFECTS.has(effect) && p.length) {
    const dur = animDurationForEffect(effect);
    if (effect === "forward_bolt") {
      return withVisual({
        type: "kill",
        duration: dur,
        label,
        squares: [p[1]],
        from: p[0],
        to: p[1],
        lineSquares: squaresBetween(p[0], p[1]),
      }, effect);
    }
    if (effect === "sacrifice") {
      return withVisual({
        type: "kill",
        duration: dur,
        label,
        squares: p,
        from: p[0],
        to: p[1],
      }, effect);
    }
    if (effect === "backstab" && extra.backstabTo) {
      return withVisual({
        type: "kill",
        duration: dur,
        label,
        squares: [extra.backstabTo],
        from: p[0],
        to: extra.backstabTo,
      }, effect);
    }
    if (effect === "snipe" || effect === "execution" || effect === "destroy_unshielded") {
      return withVisual({
        type: "kill",
        duration: dur,
        label,
        squares: p,
        to: p[0],
      }, effect);
    }
    return withVisual({
      type: "kill",
      duration: dur,
      label,
      squares: [p[p.length - 1]],
      to: p[p.length - 1],
    }, effect);
  }

  if (effect === "berserk" && p.length >= 2) {
    return finishSpec({
      type: "move",
      visual: "berserk",
      duration: animDurationForEffect("berserk"),
      label,
      squares: p.slice(0, 2),
      from: p[0],
      to: p[1],
      lineSquares: squaresBetween(p[0], p[1]),
    }, effect);
  }

  if ((MOVE_EFFECTS.has(effect) || (p.length >= 2 && mode !== "empty_empty")) && p.length >= 2) {
    const lineSquares = squaresBetween(p[0], p[1]);
    return finishSpec({
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
    const dur = effect === "duel" ? animDurationForEffect("duel") : Math.max(MIN_SPELL_ANIM_MS, 1200);
    return withVisual({
      type: "multi",
      duration: dur,
      label,
      squares,
      from: p[0],
      to: p[1],
      lineSquares: p.length >= 2 ? squaresBetween(p[0], p[1]) : [],
    }, effect);
  }

  if (SWAP_EFFECTS.has(effect) && p.length >= 2) {
    return finishSpec({
      type: "swap",
      duration: MIN_SPELL_ANIM_MS,
      label,
      squares: p.slice(0, 2),
      from: p[0],
      to: p[1],
    }, effect);
  }

  if (effect === "landmine" && p.length === 1) {
    return withVisual({
      type: "terrain",
      duration: animDurationForEffect("landmine"),
      label,
      squares: p,
      to: p[0],
    }, "landmine");
  }

  if (effect === "quicksand" && p.length === 1) {
    return withSpec({
      type: "terrain",
      duration: MIN_SPELL_ANIM_MS,
      label,
      squares: [],
    }, effect);
  }

  if ((effect === "hibernation" || effect === "bomb" || effect === "shockwave") && p.length === 1) {
    return withVisual({
      type: "buff",
      duration: animDurationForEffect(effect),
      label,
      squares: p,
      to: p[0],
    }, effect);
  }

  if (TERRAIN_EFFECTS.has(effect) && p.length) {
    return finishSpec({ type: "terrain", duration: MIN_SPELL_ANIM_MS, label, squares: p }, effect);
  }

  if (effect === "snowball" && p.length === 1) {
    return finishSpec({
      type: "debuff",
      visual: "snowball",
      duration: animDurationForEffect("snowball"),
      label,
      squares: p,
      to: p[0],
    }, effect);
  }

  if (effect === "deep_freeze" && p.length >= 2) {
    const [from, to] = p;
    const dir = diagonalDirectionFromPick(from[0], from[1], to[0], to[1]);
    let lineSquares = squaresBetween(from, to);
    if (dir) {
      const [dr, dc] = dir;
      lineSquares = [];
      for (let i = -SIZE + 1; i < SIZE; i++) {
        const r = from[0] + dr * i;
        const c = from[1] + dc * i;
        if (inBounds(r, c) && isDarkSquare(r, c)) lineSquares.push([r, c]);
      }
    }
    return finishSpec({
      type: "debuff",
      visual: "freeze",
      duration: animDurationForEffect("deep_freeze"),
      label,
      squares: p.slice(0, 2),
      from,
      to,
      lineSquares,
    }, effect);
  }

  if (p.length === 1) {
    if (mode === "enemy" || DEBUFF_EFFECTS.has(effect)) {
      return finishSpec({ type: "debuff", duration: MIN_SPELL_ANIM_MS, label, squares: p }, effect);
    }
    if (mode === "friendly" || BUFF_EFFECTS.has(effect)) {
      return finishSpec({ type: "buff", duration: MIN_SPELL_ANIM_MS, label, squares: p }, effect);
    }
    if (mode === "empty" || mode === "any_square") {
      return finishSpec({ type: "terrain", duration: MIN_SPELL_ANIM_MS, label, squares: p }, effect);
    }
    return finishSpec({ type: "generic", duration: MIN_SPELL_ANIM_MS, label, squares: p }, effect);
  }

  if (p.length >= 2) {
    return finishSpec({
      type: "generic",
      duration: MIN_SPELL_ANIM_MS,
      label,
      squares: p,
      from: p[0],
      to: p[1],
      lineSquares: squaresBetween(p[0], p[1]),
    }, effect);
  }

  return finishSpec({ type: "instant", duration: MIN_SPELL_ANIM_MS, label, squares: [] }, effect);
}

export function needsBoardAnimation(card) {
  if (!card) return false;
  if (card.effect === "cull") return true;
  if (META_EFFECTS.has(card.effect)) return false;
  return true;
}
