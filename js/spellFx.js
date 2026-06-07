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
  pyromancy: "fire",
  vengeance: "vengeance",
  hibernation: "hibernation",
  bomb: "bomb_arm",
  landmine: "landmine_arm",

  nudge: "move",
  backstep: "move",
  recall: "move",
  repel: "move",
  leapfrog: "move",
  long_step: "move",
  blink_2: "move",
  random_teleport: "move",
  mass_nudge: "move",
  magnet: "move",
  deport: "move",
  call_forward: "move",
  retreat_3: "move",

  swap_friendly: "swap",
  hostile_swap: "swap",
  tangle: "swap",
  butterfly: "swap",
  fusion: "fusion",
  scatter: "scatter",
  earthquake: "quake",
  trickster: "trickster",

  shield_1: "shield",
  shield_2: "shield",
  bulwark: "shield",
  last_stand: "shield",
  anchor_2: "shield",
  deflect_1: "shield",
  fortify: "shield",
  fog_2: "shield",
  rally: "shield",
  stone_form: "shield",
  sanctuary_pulse: "shield",
  revive: "revive",
  iron_will: "shield",

  sanctuary: "aura",
  darkness: "aura",
  barrier: "barrier",
  create_foe: "summon",

  poison_3: "poison",
  hex_3: "curse",
  rust: "curse",
  demote: "curse",
  panic: "curse",
  press: "curse",
  reverse_only_2: "curse",
  root_2: "root",
  deep_freeze: "freeze",
  blizzard: "freeze",
  snowball: "snowball",
  berserk: "berserk",
  magnet: "move",
  link_fate: "curse",

  quicksand: "sink",
  collapse: "collapse",

  crown: "crown",
  bishop_2: "crown",
  rook_2: "crown",
  clone: "clone",
  offering: "offering",
  purify: "purify",
};

/** Full-screen overlays for instant / meta spells (no board picks). */
export const META_SPELL_OVERLAY = {
  blind: "blind",
  confusion: "confusion",
  press: "curse",
  counterspell: "counter",
  vengeance: "vengeance-arm",
  ignore: "ignore",
  quick_march: "march",
  mind_control: "possess",
  constitution: "constitution",
  dominion: "dominion",
  last_king: "crown-burst",
  purify: "purify",
};

export const VISUAL_DURATION_MS = {
  coin: 2400,
  duel: 1500,
  stab: 1200,
  snipe: 1300,
  backstab: 1200,
  sacrifice: 1600,
  execution: 1400,
  shadow: 2000,
  cryo: 1300,
  shatter: 1400,
  lightning: 1400,
  fire: 1300,
  vengeance: 1100,
  hibernation: 1200,
  bomb_arm: 1000,
  landmine_arm: 1000,
  move: 1100,
  swap: 1100,
  scatter: 1200,
  quake: 1400,
  shield: 1100,
  revive: 1300,
  aura: 1200,
  barrier: 1100,
  create_foe: 900,
  poison: 1200,
  curse: 1100,
  root: 1100,
  freeze: 1300,
  snowball: 1400,
  berserk: 1600,
  sink: 1200,
  collapse: 1300,
  crown: 1200,
  fusion: 1200,
  clone: 1200,
  offering: 1200,
  purify: 1200,
  trickster: 1400,
  meta: 1200,
};

export function visualForEffect(effect) {
  if (effect === "bomb") return EFFECT_VISUAL.bomb_arm;
  if (effect === "landmine") return EFFECT_VISUAL.landmine_arm;
  return EFFECT_VISUAL[effect] || null;
}

export function metaOverlayForEffect(effect) {
  return META_SPELL_OVERLAY[effect] || null;
}

export function durationForVisual(visual, fallback = 1000) {
  if (!visual) return fallback;
  if (visual.startsWith("meta-")) return VISUAL_DURATION_MS.meta;
  return VISUAL_DURATION_MS[visual] ?? fallback;
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
  if (animRole) square.classList.add(`spell-fx-role-${animRole}`);

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
  if (visual === "move") {
    if (from && from[0] === row && from[1] === col) square.classList.add("spell-fx-move-from");
    if (to && to[0] === row && to[1] === col) square.classList.add("spell-fx-move-to");
  }
  if (visual === "snowball") {
    if (to && to[0] === row && to[1] === col) square.classList.add("spell-fx-snowball-victim");
  }
  if (visual === "berserk") {
    if (from && from[0] === row && from[1] === col) square.classList.add("spell-fx-berserk-from");
    if (to && to[0] === row && to[1] === col) square.classList.add("spell-fx-berserk-to");
  }
  if (visual === "swap") {
    if (from && from[0] === row && from[1] === col) square.classList.add("spell-fx-swap-a");
    if (to && to[0] === row && to[1] === col) square.classList.add("spell-fx-swap-b");
  }
}

function coinOverlayMarkup() {
  return `
    <div class="spell-coin-stage" aria-hidden="true">
      <div class="spell-coin-scene">
        <div class="spell-coin-flipper">
          <div class="spell-coin-face spell-coin-face--heads"><span>★</span><small>Heads</small></div>
          <div class="spell-coin-face spell-coin-face--tails"><span>☠</span><small>Tails</small></div>
        </div>
      </div>
      <p class="spell-coin-caption">Flipping…</p>
    </div>`;
}

function metaOverlayMarkup(kind) {
  const icons = {
    blind: "👁‍🗨",
    confusion: "🌀",
    counter: "🛡✧",
    "vengeance-arm": "⚔",
    ignore: "⊘",
    march: "⚑",
    possess: "👁",
    constitution: "♛",
    dominion: "⚜",
    "crown-burst": "♔",
    offering: "⚱",
    purify: "✦",
  };
  const labels = {
    blind: "Blind",
    confusion: "Confusion",
    counter: "Counterspell armed",
    "vengeance-arm": "Vengeance armed",
    ignore: "Optional jumps",
    march: "Quick March",
    possess: "Mind Control",
    constitution: "Constitution",
    dominion: "Dominion",
    "crown-burst": "Last King",
    offering: "Offering",
    purify: "Purify",
  };
  const icon = icons[kind] || "✧";
  const label = labels[kind] || "Spell";
  return `
    <div class="spell-meta-stage spell-meta-stage--${kind}" aria-hidden="true">
      <div class="spell-meta-burst">${icon}</div>
      <p class="spell-meta-caption">${label}</p>
    </div>`;
}

/**
 * Full-board overlay for effects with no picks (coin flip, meta spells).
 * @param {HTMLElement} boardFrame
 * @param {string} overlayKind
 */
export function mountSpellOverlay(boardFrame, overlayKind) {
  if (!boardFrame || !overlayKind) return null;
  const el = document.createElement("div");
  el.className = `spell-board-overlay spell-board-overlay--${overlayKind}`;
  el.setAttribute("aria-hidden", "true");
  if (overlayKind === "coin") {
    el.innerHTML = coinOverlayMarkup();
  } else {
    el.innerHTML = metaOverlayMarkup(overlayKind);
  }
  boardFrame.appendChild(el);
  return el;
}

/** @param {HTMLElement|null} overlay @param {{ friendly?: boolean, label?: string }} result */
export function revealCoinFlipResult(overlay, result = {}) {
  if (!overlay) return;
  const caption = overlay.querySelector(".spell-coin-caption");
  const flipper = overlay.querySelector(".spell-coin-flipper");
  if (flipper) {
    flipper.classList.add("spell-coin-flipper--landed");
    flipper.classList.add(result.friendly ? "spell-coin-flipper--tails" : "spell-coin-flipper--heads");
  }
  if (caption) {
    const side = result.friendly ? "Tails" : "Heads";
    const target = result.friendly ? "friendly piece" : "enemy piece";
    caption.textContent = result.label || `${side} — ${target}!`;
  }
}


/** Animate coin from board center down onto a target square. */
export function animateCoinDropToSquare(overlay, boardEl, row, col) {
  return new Promise((resolve) => {
    const stage = overlay?.querySelector(".spell-coin-stage");
    const sq = boardEl?.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
    if (!stage || !sq || !boardEl) {
      resolve();
      return;
    }
    const boardRect = boardEl.getBoundingClientRect();
    const sqRect = sq.getBoundingClientRect();
    const boardCx = boardRect.left + boardRect.width / 2;
    const boardCy = boardRect.top + boardRect.height / 2;
    const sqCx = sqRect.left + sqRect.width / 2;
    const sqCy = sqRect.top + sqRect.height / 2;
    stage.style.setProperty("--coin-drop-x", `${sqCx - boardCx}px`);
    stage.style.setProperty("--coin-drop-y", `${sqCy - boardCy}px`);
    const finish = () => {
      stage.classList.remove("spell-coin-stage--dropping");
      resolve();
    };
    const timer = setTimeout(finish, 750);
    stage.addEventListener(
      "transitionend",
      () => {
        clearTimeout(timer);
        finish();
      },
      { once: true }
    );
    requestAnimationFrame(() => stage.classList.add("spell-coin-stage--dropping"));
  });
}

export function removeSpellOverlay(el) {
  el?.remove();
}
