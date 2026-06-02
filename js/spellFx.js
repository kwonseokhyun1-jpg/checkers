/**
 * Spell-specific board/square visual FX (paired with spellAnimations.js specs).
 */

/** @type {Record<string, string>} */
export const EFFECT_VISUAL = {
  coin_flip: "coin",
  duel: "duel",
  forward_bolt: "stab",
  snipe: "snipe",
  backstab: "backstab",
  sacrifice: "sacrifice",
  execution: "execution",
  cull: "shadow",
  cryo_bolt: "cryo",
  destroy_unshielded: "shatter",
  chain_lightning: "lightning",
  fireblast: "fire",
  vengeance: "vengeance",
  hibernation: "hibernation",
  bomb: "bomb_arm",
  landmine: "landmine_arm",
};

export function visualForEffect(effect) {
  if (effect === "bomb") return EFFECT_VISUAL.bomb_arm;
  if (effect === "landmine") return EFFECT_VISUAL.landmine_arm;
  return EFFECT_VISUAL[effect] || null;
}

/**
 * @param {HTMLElement} square
 * @param {string} visual
 * @param {string} animRole
 * @param {{ from?: number[], to?: number[], row: number, col: number }} ctx
 */
export function applySquareSpellFx(square, visual, animRole, ctx) {
  if (!visual || !square) return;
  square.classList.add(`spell-fx-${visual}`);
  const { from, to, row, col } = ctx;
  if (visual === "duel" && from && to) {
    if (from[0] === row && from[1] === col) square.classList.add("spell-fx-duel-attacker");
    if (to[0] === row && to[1] === col) square.classList.add("spell-fx-duel-defender");
  }
  if (visual === "sacrifice" && from && to) {
    if (from[0] === row && from[1] === col) square.classList.add("spell-fx-sacrifice-altar");
    if (to[0] === row && to[1] === col) square.classList.add("spell-fx-sacrifice-victim");
  }
  if (visual === "stab" || visual === "cryo" || visual === "fire") {
    if (from && from[0] === row && from[1] === col) square.classList.add("spell-fx-caster");
    if (to && to[0] === row && to[1] === col) square.classList.add("spell-fx-victim");
  }
  if (visual === "backstab" && from && from[0] === row && from[1] === col) {
    square.classList.add("spell-fx-backstab-assassin");
  }
  if (visual === "backstab" && to && to[0] === row && to[1] === col) {
    square.classList.add("spell-fx-backstab-victim");
  }
  if (visual === "snipe" && to && to[0] === row && to[1] === col) {
    square.classList.add("spell-fx-snipe-target");
  }
  if (visual === "execution" && animRole === "kill") {
    square.classList.add("spell-fx-execution-block");
  }
  if (visual === "shatter" && animRole === "kill") {
    square.classList.add("spell-fx-shatter-target");
  }
  if (visual === "lightning") {
    square.classList.add("spell-fx-lightning-node");
  }
  if (visual === "vengeance" && animRole === "buff") {
    square.classList.add("spell-fx-vengeance-mark");
  }
  if (visual === "hibernation" && animRole === "buff") {
    square.classList.add("spell-fx-hibernate-bed");
  }
  if (visual === "bomb_arm" && animRole === "buff") {
    square.classList.add("spell-fx-bomb-arm");
  }
  if (visual === "landmine_arm" && (animRole === "terrain" || animRole === "hit")) {
    square.classList.add("spell-fx-mine-arm");
  }
  if (visual === "coin" && animRole === "kill") {
    square.classList.add("spell-fx-coin-victim");
  }
}

/**
 * Full-board overlay for effects with no picks (coin flip).
 * @param {HTMLElement} boardFrame
 * @param {string} overlayKind
 */
export function mountSpellOverlay(boardFrame, overlayKind) {
  if (!boardFrame || !overlayKind) return null;
  const el = document.createElement("div");
  el.className = `spell-board-overlay spell-board-overlay--${overlayKind}`;
  el.setAttribute("aria-hidden", "true");
  boardFrame.appendChild(el);
  return el;
}

export function removeSpellOverlay(el) {
  el?.remove();
}
