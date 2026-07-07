/** SVG art for Small and Big Mystery Box vault cards */

const SMALL = {
  accent: "#c4b5fd",
  glow: "rgba(167, 139, 250, 0.55)",
  body: "#2a1848",
  bodyHi: "#4c2d7a",
  lid: "#6b46c1",
  trim: "#e9d5ff",
  gold: "#fbbf24",
  gemSpell: "#7dd3fc",
  gemCosmetic: "#f0abfc",
};

const BIG = {
  accent: "#fde68a",
  glow: "rgba(251, 191, 36, 0.6)",
  body: "#3d2810",
  bodyHi: "#6b4420",
  lid: "#b45309",
  trim: "#fef3c7",
  gold: "#fcd34d",
  gemSpell: "#38bdf8",
  gemCosmetic: "#e879f9",
};

function mysteryDefs(palette, id) {
  const { body, bodyHi, lid, trim, gold, gemSpell, gemCosmetic, glow } = palette;
  return `
    <defs>
      <linearGradient id="${id}-body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bodyHi}"/>
        <stop offset="45%" stop-color="${body}"/>
        <stop offset="100%" stop-color="#0c0618"/>
      </linearGradient>
      <linearGradient id="${id}-lid" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${lid}"/>
        <stop offset="55%" stop-color="${bodyHi}"/>
        <stop offset="100%" stop-color="${body}"/>
      </linearGradient>
      <radialGradient id="${id}-inner" cx="50%" cy="35%" r="70%">
        <stop offset="0%" stop-color="${trim}" stop-opacity="0.85"/>
        <stop offset="50%" stop-color="${gold}" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#0a0610" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="${id}-band" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${gold}"/>
        <stop offset="100%" stop-color="${bodyHi}"/>
      </linearGradient>
      <linearGradient id="${id}-gemSpell" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${gemSpell}"/>
        <stop offset="100%" stop-color="${trim}"/>
      </linearGradient>
      <linearGradient id="${id}-gemCosmetic" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${gemCosmetic}"/>
        <stop offset="100%" stop-color="${trim}"/>
      </linearGradient>
      <filter id="${id}-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="2.5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="${id}-softGlow">
        <feGaussianBlur stdDeviation="3" result="g"/>
        <feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <radialGradient id="${id}-aura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${glow}"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
    </defs>`;
}

function questionMark(x, y, scale, fill, opacity = 1) {
  const s = scale;
  return `
    <g transform="translate(${x} ${y}) scale(${s})" opacity="${opacity}">
      <path d="M0 -8 C4 -8 6 -5 6 -2 C6 1 3 2 2 5 L-2 5 C-1 1 2 0 2 -2 C2 -4 0 -5 -2 -5 C-4 -5 -5 -3 -5 -1" fill="none" stroke="${fill}" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="0" cy="9" r="2" fill="${fill}"/>
    </g>`;
}

function starSparkle(cx, cy, r, fill, opacity = 0.9) {
  return `<path d="M${cx} ${cy - r} L${cx + r * 0.28} ${cy - r * 0.28} L${cx + r} ${cy} L${cx + r * 0.28} ${cy + r * 0.28} L${cx} ${cy + r} L${cx - r * 0.28} ${cy + r * 0.28} L${cx - r} ${cy} L${cx - r * 0.28} ${cy - r * 0.28} Z" fill="${fill}" opacity="${opacity}"/>`;
}

function smallMysteryBody(id, palette) {
  const { trim, gold } = palette;
  return `
    <ellipse cx="60" cy="92" rx="40" ry="8" fill="rgba(0,0,0,0.45)"/>
    <circle cx="60" cy="52" r="46" fill="url(#${id}-aura)" opacity="0.55"/>
    <g class="mystery-box-svg__float">
      <rect x="26" y="48" width="68" height="38" rx="6" fill="url(#${id}-body)" stroke="${trim}" stroke-width="2"/>
      <rect x="30" y="58" width="60" height="4" rx="1" fill="url(#${id}-band)" opacity="0.9"/>
      <rect x="30" y="68" width="60" height="3" rx="1" fill="${gold}" opacity="0.4"/>
      <rect x="52" y="54" width="16" height="16" rx="3" fill="url(#${id}-band)" stroke="${trim}" stroke-width="1"/>
      <circle cx="60" cy="62" r="3.5" fill="#1a0f28" stroke="${gold}" stroke-width="1"/>
      <circle cx="44" cy="72" r="5" fill="url(#${id}-gemSpell)" filter="url(#${id}-glow)"/>
      <circle cx="76" cy="72" r="5" fill="url(#${id}-gemCosmetic)" filter="url(#${id}-glow)"/>
      <path d="M18 48 L60 24 L102 48 Z" fill="url(#${id}-lid)" stroke="${trim}" stroke-width="2" filter="url(#${id}-glow)"/>
      <path d="M24 48 L60 30 L96 48" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
      <rect x="22" y="44" width="76" height="5" rx="1" fill="url(#${id}-band)" opacity="0.75"/>
      ${questionMark(60, 36, 1.1, trim, 0.95)}
      ${starSparkle(34, 30, 4, gold, 0.7)}
      ${starSparkle(86, 32, 3.5, trim, 0.55)}
      ${starSparkle(60, 18, 3, gold, 0.85)}
    </g>`;
}

function bigMysteryBody(id, palette) {
  const { trim, gold } = palette;
  return `
    <ellipse cx="60" cy="94" rx="48" ry="10" fill="rgba(0,0,0,0.5)"/>
    <circle cx="60" cy="50" r="52" fill="url(#${id}-aura)" opacity="0.7"/>
    <g class="mystery-box-svg__float">
      <rect x="18" y="46" width="84" height="44" rx="7" fill="url(#${id}-body)" stroke="${trim}" stroke-width="2.5"/>
      <rect x="22" y="58" width="76" height="5" rx="1" fill="url(#${id}-band)" opacity="0.95"/>
      <rect x="22" y="70" width="76" height="4" rx="1" fill="${gold}" opacity="0.45"/>
      <rect x="22" y="80" width="76" height="3" rx="1" fill="${trim}" opacity="0.25"/>
      <rect x="48" y="52" width="24" height="20" rx="4" fill="url(#${id}-band)" stroke="${gold}" stroke-width="1.5"/>
      <circle cx="60" cy="62" r="5" fill="#1a1008" stroke="${gold}" stroke-width="1.5"/>
      <ellipse cx="60" cy="60" rx="3" ry="1.5" fill="${gold}" opacity="0.3"/>
      <circle cx="32" cy="76" r="7" fill="url(#${id}-gemSpell)" filter="url(#${id}-softGlow)"/>
      <circle cx="88" cy="76" r="7" fill="url(#${id}-gemCosmetic)" filter="url(#${id}-softGlow)"/>
      <path d="M12 46 L60 14 L108 46 Z" fill="url(#${id}-lid)" stroke="${trim}" stroke-width="2.5" filter="url(#${id}-glow)"/>
      <path d="M18 46 L60 20 L102 46" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="1.2"/>
      <rect x="16" y="41" width="88" height="6" rx="1.5" fill="url(#${id}-band)" opacity="0.9"/>
      <path d="M52 18 L60 8 L68 18 L64 18 L66 26 L60 22 L54 26 L56 18 Z" fill="${gold}" filter="url(#${id}-glow)"/>
      ${questionMark(60, 30, 1.35, trim)}
      ${starSparkle(24, 24, 5, gold, 0.9)}
      ${starSparkle(96, 26, 4.5, trim, 0.75)}
      ${starSparkle(60, 6, 4, gold, 1)}
      ${starSparkle(42, 14, 3, trim, 0.6)}
      ${starSparkle(78, 14, 3, gold, 0.65)}
      ${starSparkle(48, 86, 3.5, gold, 0.8)}
      ${starSparkle(72, 86, 3.5, gold, 0.8)}
    </g>`;
}

function mysteryBoxSvg(variant) {
  const big = variant === "big";
  const palette = big ? BIG : SMALL;
  const id = big ? "mysteryBig" : "mysterySmall";
  const body = big ? bigMysteryBody(id, palette) : smallMysteryBody(id, palette);

  return `<svg class="mystery-box-svg ${big ? "mystery-box-svg--big" : "mystery-box-svg--small"}" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    ${mysteryDefs(palette, id)}
    ${body}
  </svg>`;
}

/** Static thumbnail for Mystery Box vault card */
export function mysteryBoxSvgMarkup() {
  return mysteryBoxSvg("small");
}

const TITLE_BOX_PALETTE = {
  accent: "#fde68a",
  glow: "rgba(251, 191, 36, 0.55)",
  body: "#2a1a10",
  bodyHi: "#4a3020",
  lid: "#92400e",
  trim: "#fef3c7",
  gold: "#fbbf24",
  scroll: "#fff7ed",
};

function escapeSvgText(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function titleScrollFontSize(display) {
  const len = display.length;
  if (len > 12) return 4.2;
  if (len > 9) return 4.8;
  if (len > 7) return 5.4;
  return 6.2;
}

function titleScrollContent(display, bodyHi) {
  if (!display) {
    return `<path d="M44 32 H76 M44 36 H72 M44 40 H68" stroke="${bodyHi}" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>`;
  }
  const text = escapeSvgText(display);
  const fontSize = titleScrollFontSize(display);
  return `<text x="60" y="41" text-anchor="middle" font-size="${fontSize}" font-weight="700" fill="${bodyHi}" font-family="serif">${text}</text>`;
}

function titleBoxDefs(id, palette) {
  const { body, bodyHi, lid, trim, gold, glow } = palette;
  return `
    <defs>
      <linearGradient id="${id}-body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bodyHi}"/>
        <stop offset="45%" stop-color="${body}"/>
        <stop offset="100%" stop-color="#0c0618"/>
      </linearGradient>
      <linearGradient id="${id}-lid" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${lid}"/>
        <stop offset="55%" stop-color="${bodyHi}"/>
        <stop offset="100%" stop-color="${body}"/>
      </linearGradient>
      <radialGradient id="${id}-aura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${glow}"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
      <radialGradient id="${id}-inner" cx="50%" cy="35%" r="70%">
        <stop offset="0%" stop-color="${gold}" stop-opacity="0.95"/>
        <stop offset="60%" stop-color="${trim}" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#0a0610" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="${id}-band" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${gold}"/>
        <stop offset="100%" stop-color="${bodyHi}"/>
      </linearGradient>
      <filter id="${id}-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="2.5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>`;
}

function titleBoxBodyGroup(id, palette, { forStage = false, titleDisplay = "" } = {}) {
  const { bodyHi, trim, gold, scroll } = palette;
  const interior = forStage
    ? `<g class="chest-stage__interior">
        <rect x="28" y="48" width="64" height="32" rx="3" fill="url(#${id}-inner)" opacity="0"/>
        <circle cx="60" cy="58" r="14" fill="url(#${id}-inner)" opacity="0"/>
      </g>`
    : "";
  const lidClass = forStage ? ` class="chest-stage__lid"` : "";
  const bodyClass = forStage ? ` class="chest-stage__body"` : "";

  return `
    ${interior}
    <g${bodyClass}>
      <rect x="26" y="48" width="68" height="38" rx="6" fill="url(#${id}-body)" stroke="${trim}" stroke-width="2"/>
      <rect x="30" y="58" width="60" height="4" rx="1" fill="url(#${id}-band)" opacity="0.9"/>
      <rect x="52" y="54" width="16" height="16" rx="3" fill="url(#${id}-band)" stroke="${trim}" stroke-width="1"/>
      <circle cx="60" cy="62" r="3.5" fill="#1a0f08" stroke="${gold}" stroke-width="1"/>
    </g>
    <g${lidClass}>
      <path d="M18 48 L60 24 L102 48 Z" fill="url(#${id}-lid)" stroke="${trim}" stroke-width="2" filter="url(#${id}-glow)"/>
      <rect x="22" y="44" width="76" height="5" rx="1" fill="url(#${id}-band)" opacity="0.75"/>
      <rect x="42" y="28" width="36" height="22" rx="2" fill="${scroll}" stroke="${gold}" stroke-width="1.5" filter="url(#${id}-glow)"/>
      ${titleScrollContent(titleDisplay, bodyHi)}
      <text x="60" y="24" text-anchor="middle" font-size="7" font-weight="700" fill="${gold}" font-family="serif">T</text>
      ${starSparkle(34, 30, 4, gold, 0.7)}
      ${starSparkle(86, 32, 3.5, trim, 0.55)}
      ${starSparkle(60, 14, 3, gold, 0.85)}
    </g>`;
}

/** Animated title box for opening cinematic */
export function titleBoxStageSvg(titleDisplay = "") {
  const id = "titleBoxStage";
  const palette = TITLE_BOX_PALETTE;

  return `<svg class="chest-stage-svg mystery-box-svg mystery-box-svg--title" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    ${titleBoxDefs(id, palette)}
    <ellipse class="chest-stage__shadow" cx="60" cy="92" rx="40" ry="8" fill="rgba(0,0,0,0.45)"/>
    <circle cx="60" cy="52" r="46" fill="url(#${id}-aura)" opacity="0.55"/>
    ${titleBoxBodyGroup(id, palette, { forStage: true, titleDisplay })}
  </svg>`;
}

/** Static thumbnail for Title Box vault card */
export function titleBoxSvgMarkup() {
  return titleBoxSvg();
}

function titleBoxSvg() {
  const id = "titleBox";
  const palette = TITLE_BOX_PALETTE;

  return `<svg class="mystery-box-svg mystery-box-svg--title" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    ${titleBoxDefs(id, palette)}
    <ellipse cx="60" cy="92" rx="40" ry="8" fill="rgba(0,0,0,0.45)"/>
    <circle cx="60" cy="52" r="46" fill="url(#${id}-aura)" opacity="0.55"/>
    <g class="mystery-box-svg__float">
      ${titleBoxBodyGroup(id, palette)}
    </g>
  </svg>`;
}

/** @deprecated Use mysteryBoxSvgMarkup */
export function smallMysteryBoxSvgMarkup() {
  return mysteryBoxSvgMarkup();
}

/** @deprecated Big mystery box removed from star shop */
export function bigMysteryBoxSvgMarkup() {
  return mysteryBoxSvg("big");
}
