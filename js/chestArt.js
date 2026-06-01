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

export function chestSvgMarkup(tier) {
  const t = CHEST_TIERS[tier] || CHEST_TIERS.bronze;
  const lid = tier === "gold" ? "#f0d060" : tier === "silver" ? "#d4dce8" : "#b87333";
  const body = tier === "gold" ? "#8b6914" : tier === "silver" ? "#5a6578" : "#6b4423";
  const trim = t.accent;
  return `<svg class="chest-svg" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="chestBody-${tier}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${body}" stop-opacity="1"/>
        <stop offset="100%" stop-color="#1a1208" stop-opacity="1"/>
      </linearGradient>
      <linearGradient id="chestLid-${tier}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${lid}"/>
        <stop offset="100%" stop-color="${body}"/>
      </linearGradient>
      <filter id="chestGlow-${tier}">
        <feGaussianBlur stdDeviation="2" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <ellipse cx="60" cy="88" rx="42" ry="8" fill="rgba(0,0,0,0.45)"/>
    <rect x="22" y="42" width="76" height="44" rx="4" fill="url(#chestBody-${tier})" stroke="${trim}" stroke-width="2"/>
    <path d="M18 42 L60 22 L102 42 Z" fill="url(#chestLid-${tier})" stroke="${trim}" stroke-width="2" filter="url(#chestGlow-${tier})"/>
    <rect x="54" y="48" width="12" height="16" rx="2" fill="${trim}" opacity="0.9"/>
    <circle cx="60" cy="56" r="3" fill="#1a1208"/>
    ${tier !== "bronze" ? `<path d="M60 28 L64 36 L72 36 L66 41 L68 49 L60 44 L52 49 L54 41 L48 36 L56 36 Z" fill="${trim}" opacity="0.85"/>` : ""}
    ${tier === "gold" ? `<circle cx="60" cy="34" r="6" fill="none" stroke="${trim}" stroke-width="1.5" opacity="0.7"/>` : ""}
  </svg>`;
}
