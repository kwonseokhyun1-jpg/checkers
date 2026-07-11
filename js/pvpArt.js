/** PvP Arena & Leaderboard decorative SVG art */

const ARENA_PALETTE = {
  gold: "#e8c547",
  goldDim: "#c9a227",
  goldGlow: "rgba(232, 197, 71, 0.45)",
  ember: "#f6ad55",
  stone: "#2a3448",
  stoneDark: "#121a28",
  sky: "#0c1018",
};

const LEADERBOARD_PALETTE = {
  gem: "#5ce1e6",
  gemDim: "#38b2ac",
  gemGlow: "rgba(92, 225, 230, 0.4)",
  violet: "#9f7aea",
  stone: "#1e2a3d",
  stoneDark: "#0f1520",
  sky: "#0a1018",
};

function svgDefs(id, accent, glow) {
  return `
    <defs>
      <linearGradient id="${id}-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${glow.sky || glow}"/>
        <stop offset="45%" stop-color="${glow.stone || '#1a2438'}"/>
        <stop offset="100%" stop-color="#080a12"/>
      </linearGradient>
      <radialGradient id="${id}-glow" cx="50%" cy="30%" r="55%">
        <stop offset="0%" stop-color="${accent}" stop-opacity="0.18"/>
        <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="${id}-pillar" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${glow.stoneDark || '#0f1520'}"/>
        <stop offset="30%" stop-color="${glow.stone || '#2a3448'}"/>
        <stop offset="70%" stop-color="${glow.stone || '#2a3448'}"/>
        <stop offset="100%" stop-color="${glow.stoneDark || '#0f1520'}"/>
      </linearGradient>
      <filter id="${id}-soft" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.4"/>
      </filter>
      <filter id="${id}-glow-filter" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="2.2" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>`;
}

/** Full-panel arena backdrop — colosseum arches, torches, crossed blades */
export function arenaScenerySvgMarkup() {
  const id = "pvp-arena";
  const p = ARENA_PALETTE;
  return `<svg class="pvp-scenery-svg" viewBox="0 0 320 200" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    ${svgDefs(id, p.gold, { sky: p.sky, stone: p.stone, stoneDark: p.stoneDark })}
    <rect width="320" height="200" fill="url(#${id}-sky)"/>
    <rect width="320" height="200" fill="url(#${id}-glow)"/>
    <!-- distant arena arches -->
    <g opacity="0.55" fill="${p.stone}">
      <path d="M20 90 Q20 55 40 55 Q60 55 60 90 L60 120 L20 120 Z"/>
      <path d="M70 90 Q70 50 95 50 Q120 50 120 90 L120 120 L70 120 Z"/>
      <path d="M130 90 Q130 48 160 48 Q190 48 190 90 L190 120 L130 120 Z"/>
      <path d="M200 90 Q200 50 225 50 Q250 50 250 90 L250 120 L200 120 Z"/>
      <path d="M260 90 Q260 55 280 55 Q300 55 300 90 L300 120 L260 120 Z"/>
    </g>
    <g opacity="0.35" fill="${p.stoneDark}">
      <rect x="0" y="118" width="320" height="6"/>
      <rect x="0" y="124" width="320" height="76"/>
    </g>
    <!-- arena floor -->
    <ellipse cx="160" cy="138" rx="130" ry="18" fill="rgba(0,0,0,0.35)"/>
    <ellipse cx="160" cy="136" rx="100" ry="12" fill="${p.stoneDark}" opacity="0.6"/>
    <!-- pillars -->
    <rect x="28" y="72" width="10" height="52" fill="url(#${id}-pillar)" opacity="0.7"/>
    <rect x="282" y="72" width="10" height="52" fill="url(#${id}-pillar)" opacity="0.7"/>
    <!-- crossed swords centerpiece -->
    <g transform="translate(160 108)" opacity="0.85" filter="url(#${id}-glow-filter)">
      <g transform="rotate(-38)">
        <rect x="-3" y="-28" width="6" height="36" rx="1.5" fill="${p.goldDim}"/>
        <rect x="-5" y="6" width="10" height="4" rx="1" fill="${p.gold}"/>
        <circle cx="0" cy="12" r="3.5" fill="${p.gold}" opacity="0.9"/>
        <polygon points="0,-32 -4,-24 4,-24" fill="${p.gold}"/>
      </g>
      <g transform="rotate(38)">
        <rect x="-3" y="-28" width="6" height="36" rx="1.5" fill="${p.goldDim}"/>
        <rect x="-5" y="6" width="10" height="4" rx="1" fill="${p.gold}"/>
        <circle cx="0" cy="12" r="3.5" fill="${p.gold}" opacity="0.9"/>
        <polygon points="0,-32 -4,-24 4,-24" fill="${p.gold}"/>
      </g>
    </g>
    <!-- torches -->
    <g opacity="0.9">
      <rect x="42" y="88" width="3" height="14" fill="${p.stoneDark}"/>
      <ellipse cx="43.5" cy="86" rx="4" ry="5" fill="${p.ember}" filter="url(#${id}-glow-filter)" opacity="0.85"/>
      <ellipse cx="43.5" cy="85" rx="2" ry="2.5" fill="#fff8e0" opacity="0.55"/>
      <rect x="275" y="88" width="3" height="14" fill="${p.stoneDark}"/>
      <ellipse cx="276.5" cy="86" rx="4" ry="5" fill="${p.ember}" filter="url(#${id}-glow-filter)" opacity="0.85"/>
      <ellipse cx="276.5" cy="85" rx="2" ry="2.5" fill="#fff8e0" opacity="0.55"/>
    </g>
    <!-- floating embers -->
    <circle cx="90" cy="70" r="1.2" fill="${p.gold}" opacity="0.5" filter="url(#${id}-glow-filter)"/>
    <circle cx="230" cy="64" r="1" fill="${p.ember}" opacity="0.45" filter="url(#${id}-glow-filter)"/>
    <circle cx="160" cy="58" r="0.8" fill="${p.gold}" opacity="0.35" filter="url(#${id}-glow-filter)"/>
    <!-- banner pennants -->
    <g opacity="0.5">
      <path d="M55 62 L55 78 L68 70 Z" fill="${p.goldDim}"/>
      <path d="M252 60 L252 76 L265 68 Z" fill="${p.goldDim}"/>
    </g>
  </svg>`;
}

/** Full-panel leaderboard backdrop — trophy hall, podium, laurel wreaths */
export function leaderboardScenerySvgMarkup() {
  const id = "pvp-lb";
  const p = LEADERBOARD_PALETTE;
  return `<svg class="pvp-scenery-svg" viewBox="0 0 320 200" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    ${svgDefs(id, p.gem, { sky: p.sky, stone: p.stone, stoneDark: p.stoneDark })}
    <rect width="320" height="200" fill="url(#${id}-sky)"/>
    <rect width="320" height="200" fill="url(#${id}-glow)"/>
    <!-- hall columns -->
    <g opacity="0.45" fill="url(#${id}-pillar)">
      <rect x="24" y="50" width="12" height="90" rx="1"/>
      <rect x="284" y="50" width="12" height="90" rx="1"/>
      <rect x="68" y="62" width="8" height="78" rx="1" opacity="0.7"/>
      <rect x="244" y="62" width="8" height="78" rx="1" opacity="0.7"/>
    </g>
    <!-- vaulted ceiling hint -->
    <path d="M0 40 Q160 10 320 40 L320 55 Q160 28 0 55 Z" fill="${p.stone}" opacity="0.35"/>
    <!-- podium tiers -->
    <g opacity="0.7">
      <rect x="118" y="118" width="84" height="10" rx="2" fill="${p.stone}"/>
      <rect x="128" y="108" width="64" height="10" rx="2" fill="${p.stone}"/>
      <rect x="142" y="98" width="36" height="10" rx="2" fill="${p.gemDim}" opacity="0.6"/>
    </g>
    <!-- central trophy -->
    <g transform="translate(160 88)" filter="url(#${id}-glow-filter)" opacity="0.9">
      <path d="M-14 0 Q-14 -18 -6 -22 Q0 -24 6 -22 Q14 -18 14 0 L10 4 L-10 4 Z" fill="${p.gem}" opacity="0.85"/>
      <rect x="-8" y="4" width="16" height="6" rx="1" fill="${p.gemDim}"/>
      <rect x="-10" y="10" width="20" height="4" rx="1" fill="${p.gem}"/>
      <ellipse cx="0" cy="-14" rx="5" ry="3" fill="#fff" opacity="0.25"/>
      <!-- handles -->
      <path d="M-14 -6 Q-22 -4 -20 2 Q-18 6 -14 2" fill="none" stroke="${p.gem}" stroke-width="2" opacity="0.7"/>
      <path d="M14 -6 Q22 -4 20 2 Q18 6 14 2" fill="none" stroke="${p.gem}" stroke-width="2" opacity="0.7"/>
    </g>
    <!-- side trophies (smaller) -->
    <g transform="translate(108 100)" opacity="0.55">
      <path d="M-8 0 Q-8 -10 -3 -12 Q0 -13 3 -12 Q8 -10 8 0 L6 3 L-6 3 Z" fill="${p.violet}"/>
      <rect x="-5" y="3" width="10" height="4" rx="1" fill="${p.violet}" opacity="0.7"/>
    </g>
    <g transform="translate(212 100)" opacity="0.55">
      <path d="M-8 0 Q-8 -10 -3 -12 Q0 -13 3 -12 Q8 -10 8 0 L6 3 L-6 3 Z" fill="${p.violet}"/>
      <rect x="-5" y="3" width="10" height="4" rx="1" fill="${p.violet}" opacity="0.7"/>
    </g>
    <!-- laurel wreaths -->
    <g opacity="0.4" stroke="${p.gem}" stroke-width="1.2" fill="none">
      <ellipse cx="160" cy="72" rx="22" ry="10"/>
      <ellipse cx="160" cy="72" rx="18" ry="8" opacity="0.6"/>
    </g>
    <!-- star sparkles -->
    <g fill="${p.gem}" opacity="0.55" filter="url(#${id}-glow-filter)">
      <polygon points="160,42 161,46 165,46 162,48 163,52 160,50 157,52 158,48 155,46 159,46"/>
      <polygon points="80,55 80.6,57 83,57 81,58.4 81.6,60.5 80,59.2 78.4,60.5 79,58.4 77,57 79.4,57" opacity="0.7"/>
      <polygon points="240,52 240.6,54 243,54 241,55.4 241.6,57.5 240,56.2 238.4,57.5 239,55.4 237,54 239.4,54" opacity="0.7"/>
    </g>
    <!-- floor reflection -->
    <ellipse cx="160" cy="142" rx="110" ry="14" fill="rgba(92,225,230,0.06)"/>
  </svg>`;
}

/** Hub tile backdrop — arena colosseum, torches, crossed blades */
export function arenaHubTileScenerySvg() {
  const id = "pvp-tile-arena";
  const p = ARENA_PALETTE;
  return `<svg class="pvp-hub-tile-scenery-svg" viewBox="0 0 320 140" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    ${svgDefs(id, p.gold, { sky: p.sky, stone: p.stone, stoneDark: p.stoneDark })}
    <rect width="320" height="140" fill="url(#${id}-sky)"/>
    <rect width="320" height="140" fill="url(#${id}-glow)"/>
    <!-- arena arches -->
    <g opacity="0.5" fill="${p.stone}">
      <path d="M10 72 Q10 48 28 48 Q46 48 46 72 L46 96 L10 96 Z"/>
      <path d="M52 72 Q52 42 78 42 Q104 42 104 72 L104 96 L52 96 Z"/>
      <path d="M110 72 Q110 40 160 40 Q210 40 210 72 L210 96 L110 96 Z"/>
      <path d="M216 72 Q216 42 242 42 Q268 42 268 72 L268 96 L216 96 Z"/>
      <path d="M274 72 Q274 48 292 48 Q310 48 310 72 L310 96 L274 96 Z"/>
    </g>
    <rect x="0" y="94" width="320" height="46" fill="${p.stoneDark}" opacity="0.45"/>
    <ellipse cx="160" cy="98" rx="120" ry="14" fill="rgba(0,0,0,0.4)"/>
    <!-- crossed swords -->
    <g transform="translate(160 72)" opacity="0.9" filter="url(#${id}-glow-filter)">
      <g transform="rotate(-38)">
        <rect x="-2.5" y="-22" width="5" height="28" rx="1.2" fill="${p.goldDim}"/>
        <rect x="-4" y="4" width="8" height="3.5" rx="0.8" fill="${p.gold}"/>
        <circle cx="0" cy="9" r="3" fill="${p.gold}" opacity="0.9"/>
        <polygon points="0,-26 -3.5,-19 3.5,-19" fill="${p.gold}"/>
      </g>
      <g transform="rotate(38)">
        <rect x="-2.5" y="-22" width="5" height="28" rx="1.2" fill="${p.goldDim}"/>
        <rect x="-4" y="4" width="8" height="3.5" rx="0.8" fill="${p.gold}"/>
        <circle cx="0" cy="9" r="3" fill="${p.gold}" opacity="0.9"/>
        <polygon points="0,-26 -3.5,-19 3.5,-19" fill="${p.gold}"/>
      </g>
    </g>
    <!-- torches -->
    <g opacity="0.85">
      <rect x="36" y="68" width="2.5" height="12" fill="${p.stoneDark}"/>
      <ellipse cx="37.2" cy="66" rx="3.5" ry="4.5" fill="${p.ember}" filter="url(#${id}-glow-filter)"/>
      <ellipse cx="37.2" cy="65" rx="1.8" ry="2.2" fill="#fff8e0" opacity="0.55"/>
      <rect x="281" y="68" width="2.5" height="12" fill="${p.stoneDark}"/>
      <ellipse cx="282.2" cy="66" rx="3.5" ry="4.5" fill="${p.ember}" filter="url(#${id}-glow-filter)"/>
      <ellipse cx="282.2" cy="65" rx="1.8" ry="2.2" fill="#fff8e0" opacity="0.55"/>
    </g>
    <!-- pennants -->
    <g opacity="0.45">
      <path d="M48 52 L48 64 L58 58 Z" fill="${p.goldDim}"/>
      <path d="M262 50 L262 62 L272 56 Z" fill="${p.goldDim}"/>
    </g>
    <!-- embers -->
    <circle cx="100" cy="48" r="1.2" fill="${p.gold}" opacity="0.5" filter="url(#${id}-glow-filter)"/>
    <circle cx="220" cy="44" r="1" fill="${p.ember}" opacity="0.45" filter="url(#${id}-glow-filter)"/>
    <circle cx="160" cy="36" r="0.8" fill="${p.gold}" opacity="0.35" filter="url(#${id}-glow-filter)"/>
  </svg>`;
}

/** Hub tile backdrop — trophy hall, podium, laurel wreath */
export function leaderboardHubTileScenerySvg() {
  const id = "pvp-tile-lb";
  const p = LEADERBOARD_PALETTE;
  return `<svg class="pvp-hub-tile-scenery-svg" viewBox="0 0 320 140" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    ${svgDefs(id, p.gem, { sky: p.sky, stone: p.stone, stoneDark: p.stoneDark })}
    <rect width="320" height="140" fill="url(#${id}-sky)"/>
    <rect width="320" height="140" fill="url(#${id}-glow)"/>
    <!-- vaulted ceiling -->
    <path d="M0 36 Q160 12 320 36 L320 48 Q160 24 0 48 Z" fill="${p.stone}" opacity="0.35"/>
    <!-- columns -->
    <g opacity="0.45" fill="url(#${id}-pillar)">
      <rect x="20" y="44" width="10" height="68" rx="1"/>
      <rect x="290" y="44" width="10" height="68" rx="1"/>
      <rect x="58" y="54" width="7" height="58" rx="1" opacity="0.7"/>
      <rect x="255" y="54" width="7" height="58" rx="1" opacity="0.7"/>
    </g>
    <!-- podium -->
    <g opacity="0.7">
      <rect x="112" y="96" width="96" height="8" rx="2" fill="${p.stone}"/>
      <rect x="124" y="88" width="72" height="8" rx="2" fill="${p.stone}"/>
      <rect x="138" y="80" width="44" height="8" rx="2" fill="${p.gemDim}" opacity="0.6"/>
    </g>
    <!-- central trophy -->
    <g transform="translate(160 68)" filter="url(#${id}-glow-filter)" opacity="0.92">
      <path d="M-12 0 Q-12 -16 -5 -19 Q0 -21 5 -19 Q12 -16 12 0 L9 4 L-9 4 Z" fill="${p.gem}" opacity="0.85"/>
      <rect x="-7" y="4" width="14" height="5" rx="1" fill="${p.gemDim}"/>
      <rect x="-9" y="9" width="18" height="4" rx="1" fill="${p.gem}"/>
      <ellipse cx="0" cy="-12" rx="4" ry="2.5" fill="#fff" opacity="0.28"/>
      <path d="M-12 -4 Q-18 -2 -16 4 Q-14 8 -12 4" fill="none" stroke="${p.gem}" stroke-width="1.8" opacity="0.7"/>
      <path d="M12 -4 Q18 -2 16 4 Q14 8 12 4" fill="none" stroke="${p.gem}" stroke-width="1.8" opacity="0.7"/>
    </g>
    <!-- side trophies -->
    <g transform="translate(104 78)" opacity="0.5">
      <path d="M-7 0 Q-7 -9 -2.5 -11 Q0 -12 2.5 -11 Q7 -9 7 0 L5 2.5 L-5 2.5 Z" fill="${p.violet}"/>
      <rect x="-4" y="2.5" width="8" height="3.5" rx="1" fill="${p.violet}" opacity="0.7"/>
    </g>
    <g transform="translate(216 78)" opacity="0.5">
      <path d="M-7 0 Q-7 -9 -2.5 -11 Q0 -12 2.5 -11 Q7 -9 7 0 L5 2.5 L-5 2.5 Z" fill="${p.violet}"/>
      <rect x="-4" y="2.5" width="8" height="3.5" rx="1" fill="${p.violet}" opacity="0.7"/>
    </g>
    <!-- laurel wreath -->
    <g opacity="0.4" stroke="${p.gem}" stroke-width="1.2" fill="none">
      <ellipse cx="160" cy="54" rx="20" ry="9"/>
      <ellipse cx="160" cy="54" rx="16" ry="7" opacity="0.6"/>
    </g>
    <!-- star sparkles -->
    <g fill="${p.gem}" opacity="0.55" filter="url(#${id}-glow-filter)">
      <polygon points="160,30 161,34 165,34 162,36 163,40 160,38 157,40 158,36 155,34 159,34"/>
      <polygon points="78,46 78.6,48 81,48 79,49.4 79.6,51.5 78,50.2 76.4,51.5 77,49.4 75,48 77.4,48" opacity="0.7"/>
      <polygon points="242,44 242.6,46 245,46 243,47.4 243.6,49.5 242,48.2 240.4,49.5 241,47.4 239,46 241.4,46" opacity="0.7"/>
    </g>
    <ellipse cx="160" cy="108" rx="100" ry="12" fill="rgba(92,225,230,0.06)"/>
  </svg>`;
}

/** Hub tile scenery wrapper */
export function pvpHubTileScenery(variant) {
  const svg =
    variant === "leaderboard" ? leaderboardHubTileScenerySvg() : arenaHubTileScenerySvg();
  return `<span class="pvp-hub-tile__scenery pvp-hub-tile__scenery--${variant}">${svg}</span>`;
}

/** Hub tile icon — crossed blades */
export function arenaHubIconSvg() {
  const id = "pvp-hub-arena";
  const p = ARENA_PALETTE;
  return `<svg class="pvp-hub-icon-svg" viewBox="0 0 64 64" aria-hidden="true">
    <defs>
      <radialGradient id="${id}-bg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${p.goldGlow}"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
      <filter id="${id}-glow">
        <feGaussianBlur stdDeviation="1.5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <circle cx="32" cy="32" r="28" fill="url(#${id}-bg)"/>
    <g transform="translate(32 34)" filter="url(#${id}-glow)">
      <g transform="rotate(-42)">
        <rect x="-2.5" y="-18" width="5" height="24" rx="1.2" fill="${p.goldDim}"/>
        <rect x="-4" y="4" width="8" height="3" rx="0.8" fill="${p.gold}"/>
        <polygon points="0,-22 -3.5,-15 3.5,-15" fill="${p.gold}"/>
      </g>
      <g transform="rotate(42)">
        <rect x="-2.5" y="-18" width="5" height="24" rx="1.2" fill="${p.goldDim}"/>
        <rect x="-4" y="4" width="8" height="3" rx="0.8" fill="${p.gold}"/>
        <polygon points="0,-22 -3.5,-15 3.5,-15" fill="${p.gold}"/>
      </g>
    </g>
    <circle cx="32" cy="34" r="4" fill="${p.gold}" opacity="0.35"/>
  </svg>`;
}

/** Hub tile icon — trophy cup */
export function leaderboardHubIconSvg() {
  const id = "pvp-hub-lb";
  const p = LEADERBOARD_PALETTE;
  return `<svg class="pvp-hub-icon-svg" viewBox="0 0 64 64" aria-hidden="true">
    <defs>
      <radialGradient id="${id}-bg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${p.gemGlow}"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
      <filter id="${id}-glow">
        <feGaussianBlur stdDeviation="1.5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <circle cx="32" cy="32" r="28" fill="url(#${id}-bg)"/>
    <g transform="translate(32 34)" filter="url(#${id}-glow)">
      <path d="M-12 0 Q-12 -16 -5 -19 Q0 -21 5 -19 Q12 -16 12 0 L9 4 L-9 4 Z" fill="${p.gem}"/>
      <rect x="-7" y="4" width="14" height="5" rx="1" fill="${p.gemDim}"/>
      <rect x="-9" y="9" width="18" height="4" rx="1" fill="${p.gem}"/>
      <ellipse cx="0" cy="-12" rx="4" ry="2.5" fill="#fff" opacity="0.3"/>
      <path d="M-12 -4 Q-18 -2 -16 4 Q-14 8 -12 4" fill="none" stroke="${p.gem}" stroke-width="1.8" opacity="0.75"/>
      <path d="M12 -4 Q18 -2 16 4 Q14 8 12 4" fill="none" stroke="${p.gem}" stroke-width="1.8" opacity="0.75"/>
    </g>
  </svg>`;
}

/** Decorative scenery wrapper for panel backgrounds */
export function pvpSceneryLayer(variant) {
  const svg =
    variant === "leaderboard" ? leaderboardScenerySvgMarkup() : arenaScenerySvgMarkup();
  return `<div class="pvp-scenery pvp-scenery--${variant}" aria-hidden="true">${svg}</div>`;
}
