/**
 * Simple procedural art for spell cards (theme + unique hue per card id)
 */

const THEME_STYLES = {
  movement: { symbol: "↗", label: "Motion" },
  combat: { symbol: "⚔", label: "Strike" },
  defense: { symbol: "🛡", label: "Ward" },
  debuff: { symbol: "❄", label: "Curse" },
  transform: { symbol: "✦", label: "Morph" },
  board: { symbol: "◇", label: "Terrain" },
  crown: { symbol: "♔", label: "Royal" },
  arcane: { symbol: "✧", label: "Arcane" },
};

const THEME_KEYS = [
  ["crown", ["crown", "coronation", "exile_king", "succession", "last_king", "constitution", "demote", "royal", "regicide"]],
  ["combat", ["bolt", "shatter", "destroy", "snipe", "detonate", "duel", "execution", "cull", "venom", "fireline", "backstab", "sacrifice", "lightning", "cryo", "cross", "spear", "hunters", "ricochet", "bash", "mine", "overrun"]],
  ["defense", ["shield", "aegis", "bulwark", "fortify", "sanctuary", "last_stand", "decoy", "ghost", "mirror_shield", "phalanx", "anchor", "iron_will", "pulse"]],
  ["debuff", ["freeze", "frost", "root", "slow", "blind", "confusion", "silence", "rust", "hex", "tangle", "fog", "panic", "bind", "deep_freeze", "blizzard"]],
  ["transform", ["knight", "bishop", "rook", "queen", "fusion", "chameleon", "wraith", "stone", "twin", "identity", "promote", "charge", "sigil", "demote"]],
  ["board", ["obstacle", "bridge", "quicksand", "sanctified", "warp", "collapse", "darkness", "earthquake", "vacuum", "scatter", "gravity", "butterfly", "corner"]],
  ["movement", ["nudge", "blink", "step", "sidestep", "pull", "repel", "leap", "phase", "drift", "recall", "flank", "swap", "hostile", "bait", "mass_nudge", "march", "zeal", "retreat", "dominion", "parallel", "pocket", "possession", "uno", "mirror_move", "time_slip", "echo", "wild", "roulette", "coin", "rules", "conduct", "loading", "draw"]],
];

export function cardHue(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * 41) % 360;
  return h;
}

export function inferTheme(card) {
  const blob = `${card.id} ${card.effect} ${card.name}`.toLowerCase();
  for (const [theme, keys] of THEME_KEYS) {
    if (keys.some((k) => blob.includes(k))) return theme;
  }
  return "arcane";
}

function artSvg(theme, hue, cardId) {
  const gid = `g${String(cardId).replace(/[^a-zA-Z0-9]/g, "")}`;
  const shapes = {
    movement: `<path d="M20 44 L44 20 M44 20 L36 20 M44 20 L44 28" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="28" cy="36" r="6" fill="currentColor" opacity="0.35"/>`,
    combat: `<path d="M16 40 L32 16 L40 24 L24 48 Z" fill="currentColor" opacity="0.5"/>
      <path d="M28 20 L44 36" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`,
    defense: `<path d="M32 14 L48 22 L48 38 C48 48 32 54 32 54 C32 54 16 48 16 38 L16 22 Z" fill="currentColor" opacity="0.45" stroke="currentColor" stroke-width="2"/>`,
    debuff: `<circle cx="32" cy="32" r="14" fill="none" stroke="currentColor" stroke-width="2" opacity="0.6"/>
      <path d="M24 28 L32 38 L40 26" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
    transform: `<polygon points="32,14 46,30 38,46 26,46 18,30" fill="currentColor" opacity="0.4" stroke="currentColor" stroke-width="2"/>`,
    board: `<rect x="14" y="18" width="36" height="28" rx="4" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M20 26 H44 M20 34 H36" stroke="currentColor" stroke-width="2" opacity="0.5"/>`,
    crown: `<path d="M14 38 L20 24 L26 32 L32 20 L38 32 L44 24 L50 38 Z" fill="currentColor" opacity="0.5"/>
      <rect x="14" y="38" width="36" height="6" rx="1" fill="currentColor"/>`,
    arcane: `<circle cx="32" cy="32" r="18" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.4"/>
      <circle cx="32" cy="32" r="8" fill="currentColor" opacity="0.55"/>`,
  };
  const inner = shapes[theme] || shapes.arcane;
  return `<svg class="spell-card__svg" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style="--art-hue:${hue}">
    <defs>
      <radialGradient id="${gid}" cx="50%" cy="40%" r="55%">
        <stop offset="0%" stop-color="hsl(${hue} 70% 65% / 0.9)"/>
        <stop offset="100%" stop-color="hsl(${hue} 50% 25% / 0.15)"/>
      </radialGradient>
    </defs>
    <rect width="64" height="64" fill="url(#${gid})"/>
    ${inner}
  </svg>`;
}

/**
 * @param {object} def — card definition { id, name, desc, rarity }
 * @param {object} [opts]
 */
export function renderSpellCardEl(def, opts = {}) {
  const theme = inferTheme(def);
  const hue = cardHue(def.id);
  const style = THEME_STYLES[theme];
  const tag = opts.button ? "button" : "div";
  const el = document.createElement(tag);
  if (opts.button) el.type = "button";

  el.className = [
    "spell-card",
    def.rarity,
    `theme-${theme}`,
    opts.compact ? "compact" : "",
    opts.tiny ? "tiny" : "",
    opts.disabled ? "disabled" : "",
    opts.selected ? "selected" : "",
  ]
    .filter(Boolean)
    .join(" ");

  el.style.setProperty("--card-hue", String(hue));
  el.dataset.cardId = def.id;

  el.innerHTML = `
    <div class="spell-card__frame">
      <div class="spell-card__art" aria-hidden="true">
        ${artSvg(theme, hue, def.id)}
        <span class="spell-card__sigil">${style.symbol}</span>
      </div>
      <div class="spell-card__body">
        <span class="spell-card__rarity">${def.rarity}</span>
        <h3 class="spell-card__name">${escapeHtml(def.name)}</h3>
        ${opts.meta ? `<p class="spell-card__meta">${escapeHtml(opts.meta)}</p>` : ""}
        ${!opts.compact && !opts.tiny ? `<p class="spell-card__desc">${escapeHtml(def.desc)}</p>` : ""}
      </div>
    </div>
  `;

  if (opts.onClick) {
    el.addEventListener("click", (e) => {
      if (!opts.disabled) opts.onClick(e, def);
    });
  }
  return el;
}

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
