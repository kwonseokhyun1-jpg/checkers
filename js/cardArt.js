/**
 * Spell card UI — illustrated SVG art, rarity frames, tooltips
 */
import { getCardEffectTags, formatEffectTooltip } from "./cardEffectTags.js";
import { illustrationForCard, isFullBleedEffect } from "./cardIllustrations.js";

const THEME_STYLES = {
  movement: { symbol: "↗", label: "Motion", anim: "movement" },
  combat: { symbol: "⚔", label: "Strike", anim: "combat" },
  defense: { symbol: "🛡", label: "Ward", anim: "defense" },
  debuff: { symbol: "❄", label: "Curse", anim: "debuff" },
  transform: { symbol: "✦", label: "Morph", anim: "transform" },
  board: { symbol: "◇", label: "Terrain", anim: "board" },
  crown: { symbol: "♔", label: "Royal", anim: "crown" },
  arcane: { symbol: "✧", label: "Arcane", anim: "arcane" },
};

export const THEME_KEYS = [
  ["movement", ["nudge", "backstep", "long_step", "leapfrog", "recall", "teleport", "random_teleport", "displacement", "berserk", "dash"]],
  ["combat", ["stab", "shatter", "destroy", "snipe", "duel", "execution", "cull", "pyromancy", "backstab", "sacrifice", "chain_lightning", "cryo", "bomb", "magnet"]],
  ["special", ["create_foe", "clone", "earthquake"]],
  ["defense", ["shield", "ward", "aegis", "bulwark", "stall", "sanctuary", "barrier", "anchor", "iron_will", "hibernation", "constitution"]],
  ["debuff", ["root", "panic", "backpedal", "blizzard", "deep_freeze", "snowball", "blind", "confusion", "extract", "press", "tangle", "shockwave"]],
  ["board", ["quicksand", "landmine", "collapse", "darkness", "earthquake", "scatter", "call_forward"]],
  ["meta", ["counterspell", "vengeance", "last_stand", "martyr", "purify", "defuse", "trickster", "ignore", "offering", "mulligan", "quick_march", "dominion", "toll", "last_king", "revive", "mind_control", "zombify"]],
];

export function cardHue(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * 41) % 360;
  return h;
}

function cardVariant(id) {
  let v = 0;
  for (let i = 0; i < id.length; i++) v = (v + id.charCodeAt(i) * 13) % 3;
  return v;
}

export function inferTheme(card) {
  const blob = `${card.id} ${card.effect} ${card.name}`.toLowerCase();
  for (const [theme, keys] of THEME_KEYS) {
    if (!Array.isArray(keys)) continue;
    if (keys.some((k) => blob.includes(k))) return theme;
  }
  return "arcane";
}

function safeId(cardId) {
  return `ca${String(cardId).replace(/[^a-zA-Z0-9]/g, "")}`;
}

function starField(gid, hue, variant) {
  const pts = [
    [12, 18, 0.35], [48, 12, 0.5], [52, 44, 0.25], [18, 50, 0.4], [38, 28, 0.55],
  ];
  const offset = variant * 4;
  return pts
    .map(([x, y, o], i) => {
      const px = ((x + offset + i * 7) % 56) + 4;
      const py = ((y + offset * 2 + i * 5) % 52) + 6;
      return `<circle cx="${px}" cy="${py}" r="1.2" fill="hsl(${hue} 90% 85% / ${o})"/>`;
    })
    .join("");
}

function themeIllustration(theme, variant) {
  const v = variant;
  const shapes = {
    movement: `
      <g class="card-motif" opacity="0.95">
        <path d="M18 ${44 - v} L42 ${18 + v} M42 ${18 + v} L34 ${18 + v} M42 ${18 + v} L42 ${26 + v}" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <circle cx="26" cy="38" r="7" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/>
        <path d="M46 46 Q52 38 58 46" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.5"/>
      </g>`,
    combat: `
      <g class="card-motif">
        <path d="M14 42 L30 ${14 + v} L38 22 L22 50 Z" fill="currentColor" opacity="0.35"/>
        <path d="M26 ${18 + v} L50 42" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
        <circle cx="38" cy="30" r="10" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.45"/>
        <path d="M32 24 L44 36 M44 24 L32 36" stroke="currentColor" stroke-width="1.5" opacity="0.6"/>
      </g>`,
    defense: `
      <g class="card-motif">
        <path d="M32 12 L52 22 L52 40 C52 50 32 56 32 56 C32 56 12 50 12 40 L12 22 Z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="2"/>
        <path d="M32 20 L32 48" stroke="currentColor" stroke-width="2" opacity="0.5"/>
        <path d="M22 32 H42" stroke="currentColor" stroke-width="2" opacity="0.5"/>
      </g>`,
    debuff: `
      <g class="card-motif">
        <circle cx="32" cy="32" r="16" fill="none" stroke="currentColor" stroke-width="2" opacity="0.5"/>
        <path d="M24 ${28 + v} L32 40 L40 ${26 - v}" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M20 20 L24 24 M44 44 L40 40" stroke="currentColor" stroke-width="1.5" opacity="0.4"/>
      </g>`,
    transform: `
      <g class="card-motif">
        <polygon points="32,12 48,28 40,50 24,50 16,28" fill="currentColor" opacity="0.25" stroke="currentColor" stroke-width="2"/>
        <circle cx="32" cy="32" r="6" fill="currentColor" opacity="0.55"/>
        <path d="M32 16 L32 24 M32 40 L32 48 M16 28 L24 32 M40 32 L48 28" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
      </g>`,
    board: `
      <g class="card-motif">
        <rect x="12" y="16" width="40" height="32" rx="5" fill="none" stroke="currentColor" stroke-width="2"/>
        <path d="M18 26 H46 M18 34 H38 M18 42 H42" stroke="currentColor" stroke-width="1.5" opacity="0.45"/>
        <rect x="${20 + v}" y="22" width="8" height="8" rx="1" fill="currentColor" opacity="0.35"/>
      </g>`,
    crown: `
      <g class="card-motif">
        <path d="M12 40 L18 22 L26 30 L32 16 L38 30 L46 22 L52 40 Z" fill="currentColor" opacity="0.4"/>
        <rect x="12" y="40" width="40" height="8" rx="2" fill="currentColor"/>
        <circle cx="32" cy="24" r="4" fill="currentColor" opacity="0.7"/>
      </g>`,
    arcane: `
      <g class="card-motif">
        <circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.35"/>
        <circle cx="32" cy="32" r="12" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5"/>
        <circle cx="32" cy="32" r="5" fill="currentColor" opacity="0.65"/>
        <path d="M32 8 L32 14 M32 50 L32 56 M8 32 L14 32 M50 32 L56 32" stroke="currentColor" stroke-width="1.5" opacity="0.45"/>
      </g>`,
  };
  return shapes[theme] || shapes.arcane;
}

function cardArtHtml(theme, hue, cardId, def) {
  return artSvg(theme, hue, cardId, def);
}

function artSvg(theme, hue, cardId, def) {
  const gid = safeId(cardId);
  const accent = (hue + 42) % 360;
  const variant = cardVariant(cardId);
  const inner = (def && illustrationForCard(def, variant)) || themeIllustration(theme, variant);
  const fullBleed = def?.effect && isFullBleedEffect(def.effect) && inner;

  if (fullBleed) {
    return `<svg class="spell-card__svg spell-card__svg--full-bleed" viewBox="0 0 70 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid meet">${inner}</svg>`;
  }

  const stars = starField(gid, hue, variant);

  return `<svg class="spell-card__svg" viewBox="0 0 70 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <radialGradient id="${gid}-bg" cx="50%" cy="35%" r="65%">
        <stop offset="0%" stop-color="hsl(${hue} 75% 58% / 0.95)"/>
        <stop offset="55%" stop-color="hsl(${hue} 55% 32% / 0.5)"/>
        <stop offset="100%" stop-color="hsl(${hue} 40% 12% / 0.2)"/>
      </radialGradient>
      <linearGradient id="${gid}-beam" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="hsl(${accent} 90% 70% / 0)"/>
        <stop offset="45%" stop-color="hsl(${accent} 85% 65% / 0.35)"/>
        <stop offset="100%" stop-color="hsl(${accent} 70% 40% / 0)"/>
      </linearGradient>
      <filter id="${gid}-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="2" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <rect width="70" height="60" fill="url(#${gid}-bg)"/>
    <rect width="70" height="60" fill="url(#${gid}-beam)" opacity="0.9"/>
    <rect x="4" y="4" width="62" height="52" rx="8" fill="none" stroke="hsl(${hue} 60% 70% / 0.35)" stroke-width="1"/>
    ${stars}
    <g filter="url(#${gid}-glow)" color="hsl(${hue} 88% 88%)">${inner}</g>
  </svg>`;
}

function resolveSize(opts) {
  if (opts.tiny) return "tiny";
  if (opts.small) return "small";
  if (opts.compact) return "compact";
  return "full";
}

function buildEffectListHtml(def) {
  const tags = getCardEffectTags(def);
  if (!tags.length) return "";
  return `<ul class="spell-card__effects">${tags.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ul>`;
}

const titleFitObservers = new WeakMap();

/** Shrink long card titles so they stay on one line within the title bar. */
export function fitSpellCardName(cardEl) {
  const nameEl = cardEl?.querySelector?.(".spell-card__name");
  const frameEl = cardEl?.querySelector?.(".spell-card__title-frame");
  if (!nameEl || !frameEl) return;

  const applyFit = () => {
    nameEl.classList.add("spell-card__name--fit");
    nameEl.style.fontSize = "";
    nameEl.style.textOverflow = "";
    nameEl.style.overflow = "";

    const frameWidth = frameEl.clientWidth;
    if (frameWidth <= 0) return;

    let size = parseFloat(getComputedStyle(nameEl).fontSize);
    if (!size) return;

    const minSize = size * 0.55;
    while (nameEl.scrollWidth > frameWidth && size > minSize) {
      size -= 0.5;
      nameEl.style.fontSize = `${size}px`;
    }

    if (nameEl.scrollWidth > frameWidth) {
      nameEl.style.overflow = "hidden";
      nameEl.style.textOverflow = "ellipsis";
    }
  };

  applyFit();
  requestAnimationFrame(applyFit);

  if (!titleFitObservers.has(cardEl) && typeof ResizeObserver !== "undefined") {
    const ro = new ResizeObserver(() => applyFit());
    ro.observe(frameEl);
    titleFitObservers.set(cardEl, ro);
  }
}

/**
 * @param {object} def — { id, name, desc, rarity }
 * @param {object} [opts]
 */
export function renderSpellCardEl(def, opts = {}) {
  const theme = inferTheme(def);
  const hue = cardHue(def.id);
  const style = THEME_STYLES[theme] || THEME_STYLES.arcane;
  const size = resolveSize(opts);
  const hideRulesText = opts.hideDesc || opts.gallery;
  const showDesc = !hideRulesText && size !== "tiny";
  const showViewFullHint = opts.showViewFullHint || opts.gallery;
  const tag = opts.button ? "button" : "div";
  const el = document.createElement(tag);
  if (opts.button) el.type = "button";

  const rarityClass = def.rarity === "legendary" ? "legendary" : def.rarity;

  el.className = [
    "spell-card",
    `spell-card--${size}`,
    `spell-card--anim-${style.anim}`,
    rarityClass,
    def.rarity === "rare" ? "spell-card--rare-fx" : "",
    def.rarity === "epic" ? "spell-card--epic-fx" : "",
    def.rarity === "legendary" ? "spell-card--legendary-fx" : "",
    def.rarity === "uncommon" ? "spell-card--uncommon-fx" : "",
    def.rarity === "common" ? "spell-card--common-fx" : "",
    `theme-${theme}`,
    opts.disabled ? "disabled" : "",
    opts.selected ? "selected" : "",
    opts.static ? "static" : "",
    opts.deal ? "spell-card--deal" : "",
    opts.fullDesc ? "spell-card--full-desc" : "",
    opts.gallery ? "spell-card--gallery" : "",
  ]
    .filter(Boolean)
    .join(" ");

  el.style.setProperty("--card-hue", String(hue));
  el.dataset.cardId = def.id;
  el.title = formatEffectTooltip(def);

  const fxLayer =
    def.rarity === "legendary"
      ? '<div class="spell-card__fx spell-card__fx--legendary" aria-hidden="true"></div>'
      : def.rarity === "epic"
        ? '<div class="spell-card__fx spell-card__fx--epic" aria-hidden="true"></div>'
        : def.rarity === "rare"
          ? '<div class="spell-card__fx spell-card__fx--rare" aria-hidden="true"></div>'
          : def.rarity === "uncommon"
            ? '<div class="spell-card__fx spell-card__fx--uncommon" aria-hidden="true"></div>'
            : def.rarity === "common"
              ? '<div class="spell-card__fx spell-card__fx--common" aria-hidden="true"></div>'
              : "";

  const fullBleedArt = def?.effect && isFullBleedEffect(def.effect);

  el.innerHTML = `
    ${fxLayer}
    <div class="spell-card__frame">
      <div class="spell-card__title-frame">
        <h3 class="spell-card__name">${escapeHtml(def.name)}</h3>
      </div>
      <div class="spell-card__art-frame">
        <div class="spell-card__art spell-card__art--animated${fullBleedArt ? " spell-card__art--full-bleed" : ""}" aria-hidden="true">
          <div class="spell-card__art-shine"></div>
          ${cardArtHtml(theme, hue, def.id, def)}
          <span class="spell-card__sigil spell-card__sigil--effect" aria-hidden="true">${style.symbol}</span>
        </div>
      </div>
      <div class="spell-card__type-frame${showViewFullHint ? " spell-card__type-frame--with-hint" : ""}">
        <span class="spell-card__rarity">${def.rarity}</span>
        ${showViewFullHint ? '<span class="spell-card__view-full">Click to see full card</span>' : ""}
        ${opts.meta ? `<span class="spell-card__meta">${escapeHtml(opts.meta)}</span>` : ""}
      </div>
      ${showDesc ? `<div class="spell-card__text-frame"><p class="spell-card__desc">${escapeHtml(def.desc)}</p></div>` : ""}
    </div>
    <div class="spell-card__tooltip" role="tooltip">
      <strong>${escapeHtml(def.name)}</strong>
      ${buildEffectListHtml(def)}
    </div>
  `;

  if (opts.onClick) {
    el.addEventListener("click", (e) => opts.onClick(e, def));
  }

  fitSpellCardName(el);
  return el;
}

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
