/** Arcane chest visuals and tier copy */

export const CHEST_TIERS = {
  bronze: {
    label: "Ember Cache",
    tagline: "Warm sparks · common finds",
    accent: "#cd7f32",
    glow: "rgba(205, 127, 50, 0.45)",
  },
  silver: {
    label: "Crystal Coffer",
    tagline: "Frost glass · rare glimmers",
    accent: "#a8b8d8",
    glow: "rgba(168, 184, 216, 0.5)",
  },
  gold: {
    label: "Sovereign Vault",
    tagline: "Royal seal · epic whispers",
    accent: "#e8c547",
    glow: "rgba(232, 197, 71, 0.55)",
  },
};

function chestColors(tier) {
  const t = CHEST_TIERS[tier] || CHEST_TIERS.bronze;
  const lid = tier === "gold" ? "#f5e6a8" : tier === "silver" ? "#e8eef8" : "#d4954a";
  const body = tier === "gold" ? "#7a5c12" : tier === "silver" ? "#4a5568" : "#5c3a1e";
  const trim = tier === "gold" ? "#ffe566" : tier === "silver" ? "#c8d8f0" : t.accent;
  return { t, lid, body, trim };
}

function chestDefs(tier, id) {
  const { lid, body, trim } = chestColors(tier);
  const gem =
    tier === "gold"
      ? "#ff6bcb"
      : tier === "silver"
        ? "#7dd3fc"
        : "#f6ad55";
  return `
    <defs>
      <linearGradient id="${id}-body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${body}"/>
        <stop offset="45%" stop-color="${lid}" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#120c08"/>
      </linearGradient>
      <linearGradient id="${id}-lid" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${lid}"/>
        <stop offset="100%" stop-color="${body}"/>
      </linearGradient>
      <radialGradient id="${id}-inner" cx="50%" cy="25%" r="75%">
        <stop offset="0%" stop-color="${trim}" stop-opacity="0.95"/>
        <stop offset="60%" stop-color="${trim}" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#0a0610" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="${id}-band" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${trim}"/>
        <stop offset="100%" stop-color="${body}"/>
      </linearGradient>
      <filter id="${id}-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2.5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="${id}-gemGlow">
        <feGaussianBlur stdDeviation="1" result="g"/>
        <feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <linearGradient id="${id}-gemFill" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${gem}"/>
        <stop offset="100%" stop-color="${trim}"/>
      </linearGradient>
    </defs>`;
}

function chestBands(id, trim) {
  return `
    <rect x="24" y="58" width="72" height="4" rx="1" fill="url(#${id}-band)" opacity="0.85"/>
    <rect x="24" y="68" width="72" height="3" rx="1" fill="${trim}" opacity="0.35"/>
    <circle cx="28" cy="60" r="2" fill="#1a1208"/>
    <circle cx="92" cy="60" r="2" fill="#1a1208"/>
    <circle cx="28" cy="69" r="1.5" fill="#1a1208" opacity="0.8"/>
    <circle cx="92" cy="69" r="1.5" fill="#1a1208" opacity="0.8"/>`;
}

function chestDecor(tier, trim, id) {
  const star =
    tier !== "bronze"
      ? `<path d="M60 24 L64 32 L72 32 L66 37 L68 45 L60 40 L52 45 L54 37 L48 32 L56 32 Z" fill="${trim}" opacity="0.9" filter="url(#${id}-glow)"/>`
      : `<path d="M58 30 L60 34 L64 34 L61 37 L62 41 L58 39 L54 41 L55 37 L52 34 L56 34 Z" fill="${trim}" opacity="0.7"/>`;
  const gem =
    tier === "gold"
      ? `<circle cx="60" cy="32" r="5" fill="url(#${id}-gemFill)" filter="url(#${id}-gemGlow)"/>
         <circle cx="60" cy="32" r="8" fill="none" stroke="${trim}" stroke-width="1" opacity="0.6"/>`
      : tier === "silver"
        ? `<rect x="56" y="28" width="8" height="8" rx="1" transform="rotate(45 60 32)" fill="url(#${id}-gemFill)" filter="url(#${id}-gemGlow)"/>`
        : "";
  const runes =
    tier === "gold"
      ? `<path d="M34 30 L38 26 M38 30 L34 26 M82 30 L86 26 M86 30 L82 26" stroke="${trim}" stroke-width="1" opacity="0.5"/>`
      : "";
  return `${star}${gem}${runes}`;
}

function chestBodyGroup(id, trim, tier, forStage) {
  const interior = forStage
    ? `<g class="chest-stage__interior">
        <rect x="26" y="46" width="68" height="36" rx="2" fill="url(#${id}-inner)" opacity="0"/>
      </g>`
    : "";
  const lidClass = forStage ? ` class="chest-stage__lid"` : "";
  const bodyClass = forStage ? ` class="chest-stage__body"` : "";
  const decor = chestDecor(tier, trim, id);

  return `
    ${interior}
    <g${bodyClass}>
      <rect x="22" y="42" width="76" height="44" rx="5" fill="url(#${id}-body)" stroke="${trim}" stroke-width="2"/>
      ${chestBands(id, trim)}
      <rect x="52" y="48" width="16" height="18" rx="3" fill="url(#${id}-band)" stroke="${trim}" stroke-width="1"/>
      <circle cx="60" cy="57" r="3.5" fill="#1a1208" stroke="${trim}" stroke-width="1"/>
      <ellipse cx="60" cy="55" rx="2" ry="1" fill="${trim}" opacity="0.25"/>
    </g>
    <g${lidClass}>
      <path d="M16 42 L60 18 L104 42 Z" fill="url(#${id}-lid)" stroke="${trim}" stroke-width="2" filter="url(#${id}-glow)"/>
      <path d="M22 42 L60 22 L98 42" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
      ${decor}
    </g>`;
}

/** Animated chest for opening cinematic (lid is a separate group) */
export function chestStageSvg(tier) {
  const { trim } = chestColors(tier);
  const id = `chestStage-${tier}`;

  return `<svg class="chest-stage-svg" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    ${chestDefs(tier, id)}
    <ellipse class="chest-stage__shadow" cx="60" cy="90" rx="44" ry="9" fill="rgba(0,0,0,0.5)"/>
    ${chestBodyGroup(id, trim, tier, true)}
  </svg>`;
}

/** Static chest thumbnail for vault cards */
export function chestSvgMarkup(tier) {
  const { trim } = chestColors(tier);
  const id = `chestCard-${tier}`;

  return `<svg class="chest-svg" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    ${chestDefs(tier, id)}
    <ellipse cx="60" cy="90" rx="44" ry="9" fill="rgba(0,0,0,0.5)"/>
    ${chestBodyGroup(id, trim, tier, false)}
  </svg>`;
}
