/**
 * Simple per-effect SVG motifs for spell cards (64×64 viewBox).
 * Each illustration depicts the card mechanic at a glance.
 */

function wrap(inner) {
  return `<g class="card-motif" opacity="0.95">${inner}</g>`;
}

function piece(x, y, r = 5, o = 0.88) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="currentColor" opacity="${o}"/>`;
}

function enemy(x, y, r = 5) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="currentColor" opacity="0.5"/><circle cx="${x}" cy="${y}" r="${r + 2}" fill="none" stroke="currentColor" stroke-width="1.3" opacity="0.55"/>`;
}

function ghost(x, y, r = 4) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="3 2" opacity="0.45"/>`;
}

function arrow(x1, y1, x2, y2, w = 2.2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;
  return `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="currentColor" stroke-width="${w}" fill="none" stroke-linecap="round"/>
    <path d="M${x2} ${y2} L${x2 - ux * 6 + px * 3.5} ${y2 - uy * 6 + py * 3.5} M${x2} ${y2} L${x2 - ux * 6 - px * 3.5} ${y2 - uy * 6 - py * 3.5}" stroke="currentColor" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
}

function arcJump(x1, y1, xm, ym, x2, y2) {
  return `<path d="M${x1} ${y1} Q${xm} ${ym - 10} ${x2} ${y2}" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
    ${arrow(x2 - 4, y2 + 2, x2, y2, 1.8)}`;
}

function shield(x, y, s = 1) {
  return `<path d="M${x} ${y - 10 * s} L${x + 9 * s} ${y - 4 * s} L${x + 9 * s} ${y + 6 * s} C${x + 9 * s} ${y + 14 * s} ${x} ${y + 18 * s} ${x} ${y + 18 * s} C${x} ${y + 18 * s} ${x - 9 * s} ${y + 14 * s} ${x - 9 * s} ${y + 6 * s} L${x - 9 * s} ${y - 4 * s} Z" fill="currentColor" opacity="0.28" stroke="currentColor" stroke-width="1.6"/>`;
}

function crown(x, y) {
  return `<path d="M${x - 10} ${y + 4} L${x - 6} ${y - 6} L${x - 2} ${y + 1} L${x + 2} ${y - 8} L${x + 6} ${y + 1} L${x + 10} ${y - 6} L${x + 10} ${y + 6} H${x - 10} Z" fill="currentColor" opacity="0.75"/>`;
}

function square(x, y, w = 10, o = 0.35) {
  return `<rect x="${x - w / 2}" y="${y - w / 2}" width="${w}" height="${w}" rx="1.5" fill="currentColor" opacity="${o}" stroke="currentColor" stroke-width="1.2"/>`;
}

function bolt(x1, y1, x2, y2) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return `<path d="M${x1} ${y1} L${mx + 3} ${my - 2} L${mx - 2} ${my + 4} L${x2} ${y2}" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function column(x, y1, y2) {
  return `<rect x="${x - 4}" y="${y1}" width="8" height="${y2 - y1}" rx="2" fill="currentColor" opacity="0.18" stroke="currentColor" stroke-width="1.4"/>`;
}

function xMark(x, y, s = 6) {
  return `<path d="M${x - s} ${y - s} L${x + s} ${y + s} M${x + s} ${y - s} L${x - s} ${y + s}" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>`;
}

function ring(x, y, r) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="currentColor" stroke-width="1.6" opacity="0.55"/>`;
}

/** Red game-token disc used in combat spell art. */
function token(x, y, r = 5) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#dc2626" stroke="#7f1d1d" stroke-width="1.4"/>`;
}

/** Jagged impact / burst shape. */
function burst(x, y, s = 8, fill = "#fbbf24", stroke = "#b45309") {
  return `<path d="M${x} ${y - s} L${x + s * 0.4} ${y - s * 0.4} L${x + s} ${y} L${x + s * 0.4} ${y + s * 0.4} L${x} ${y + s} L${x - s * 0.4} ${y + s * 0.4} L${x - s} ${y} L${x - s * 0.4} ${y - s * 0.4} Z" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`;
}

/** Full-bleed card art: solid background + illustration, no generic card overlay. */
function fullBleed(bg, inner) {
  return `<rect width="64" height="64" fill="${bg}"/>${inner}`;
}

/** Premium legendary art with radial gradient backdrop. */
function legendaryBleed(id, top, bottom, inner) {
  const gid = `lg-${id}`;
  return `<defs>
    <radialGradient id="${gid}" cx="50%" cy="38%" r="72%">
      <stop offset="0%" stop-color="${top}"/>
      <stop offset="55%" stop-color="${bottom}"/>
      <stop offset="100%" stop-color="${bottom}" stop-opacity="0.92"/>
    </radialGradient>
    <filter id="${gid}-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.2" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="64" height="64" fill="url(#${gid})"/>
  ${inner}`;
}

/** Premium common art with slate radial gradient. */
function commonBleed(id, top, bottom, inner) {
  const gid = `cm-${id}`;
  return `<defs>
    <radialGradient id="${gid}" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="${top}"/>
      <stop offset="55%" stop-color="${bottom}"/>
      <stop offset="100%" stop-color="${bottom}" stop-opacity="0.94"/>
    </radialGradient>
    <filter id="${gid}-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="0.7" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="64" height="64" fill="url(#${gid})"/>
  ${inner}`;
}

/** Premium uncommon art with teal-blue radial gradient. */
function uncommonBleed(id, top, bottom, inner) {
  const gid = `uc-${id}`;
  return `<defs>
    <radialGradient id="${gid}" cx="50%" cy="38%" r="72%">
      <stop offset="0%" stop-color="${top}"/>
      <stop offset="52%" stop-color="${bottom}"/>
      <stop offset="100%" stop-color="${bottom}" stop-opacity="0.93"/>
    </radialGradient>
    <filter id="${gid}-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="0.8" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="64" height="64" fill="url(#${gid})"/>
  ${inner}`;
}

/** Premium rare art with violet radial gradient. */
function rareBleed(id, top, bottom, inner) {
  const gid = `ra-${id}`;
  return `<defs>
    <radialGradient id="${gid}" cx="50%" cy="38%" r="72%">
      <stop offset="0%" stop-color="${top}"/>
      <stop offset="52%" stop-color="${bottom}"/>
      <stop offset="100%" stop-color="${bottom}" stop-opacity="0.93"/>
    </radialGradient>
    <filter id="${gid}-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="0.9" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="64" height="64" fill="url(#${gid})"/>
  ${inner}`;
}

/** Premium epic art with gold-to-purple radial gradient. */
function epicBleed(id, top, bottom, inner) {
  const gid = `ep-${id}`;
  return `<defs>
    <radialGradient id="${gid}" cx="50%" cy="36%" r="74%">
      <stop offset="0%" stop-color="${top}"/>
      <stop offset="50%" stop-color="${bottom}"/>
      <stop offset="100%" stop-color="${bottom}" stop-opacity="0.94"/>
    </radialGradient>
    <filter id="${gid}-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="64" height="64" fill="url(#${gid})"/>
  ${inner}`;
}

/** Blue ally token used in epic spell art. */
function ally(x, y, r = 5) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#2563eb" stroke="#1e3a8a" stroke-width="1.4"/>`;
}

export const FULL_BLEED_EFFECTS = new Set([
  "nudge",
  "backstep",
  "retreat_3",
  "anchor_2",
  "recall",
  "repel",
  "leapfrog",
  "random_teleport",
  "rally",
  "coin_flip",
  "butterfly",
  "ignore",
  "iron_will",
  "demote",
  "quicksand",
  "create_foe",
  "barrier",
  "panic",
  "swap_friendly",
  "sidestep",
  "press",
  "shield_1",
  "snowball",
  "long_step",
  "shield_2",
  "poison_3",
  "deflect_1",
  "forward_bolt",
  "crown",
  "blink_2",
  "landmine",
  "reverse_only_2",
  "root_2",
  "sacrifice",
  "scatter",
  "mass_nudge",
  "sanctuary_pulse",
  "last_stand",
  "cryo_bolt",
  "collapse",
  "last_king",
  "snipe",
  "dominion",
  "backstab",
  "bomb",
  "berserk",
  "bounty",
  "chain_lightning",
  "clone",
  "confusion",
  "constitution",
  "counterspell",
  "cull",
  "deep_freeze",
  "deport",
  "destroy_unshielded",
  "duel",
  "earthquake",
  "execution",
  "hostile_swap",
  "link_fate",
  "magnet",
  "mind_control",
  "purify",
  "pyromancy",
  "quick_march",
  "revive",
  "shockwave",
  "bishop_2",
  "rook_2",
  "offering",
  "tangle",
  "call_forward",
  "blizzard",
  "bulwark",
  "darkness",
  "fortify",
  "hibernation",
  "vengeance",
  "sanctuary",
  "fusion",
  "chameleon",
  "blind",
  "trickster",
]);

/** @param {string} [effect] */
export function isFullBleedEffect(effect) {
  return FULL_BLEED_EFFECTS.has(effect);
}

/** Gloved hand with dagger thrusting between two tokens. */
function backstabMotif() {
  return `${token(18, 52, 5.5)}${token(38, 52, 5.5)}
    <path d="M30 4 C28 12 26 22 28 32 L30 40" stroke="#1a1a1a" stroke-width="7" stroke-linecap="round" fill="none"/>
    <path d="M30 4 C28 12 26 22 28 32 L30 40" stroke="#3d3d3d" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M30 40 L28 54" stroke="#cbd5e1" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M30 40 L38 48 L32 50 L26 46 Z" fill="#e2e8f0" stroke="#1a1a1a" stroke-width="1.2"/>
    ${burst(32, 48, 6, "#ef4444", "#991b1b")}`;
}

/** Spherical bomb with lit fuse and explosion burst. */
function bombMotif() {
  return `<ellipse cx="32" cy="58" rx="18" ry="4" fill="#000" opacity="0.25"/>
    <circle cx="32" cy="34" r="18" fill="#1a1a1a" stroke="#0a0a0a" stroke-width="2"/>
    <circle cx="32" cy="34" r="14" fill="#262626"/>
    <ellipse cx="27" cy="29" rx="5" ry="4" fill="#444" opacity="0.35"/>
    <path d="M38 22 C44 16 46 10 44 4" stroke="#78716c" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="44" cy="3" r="4" fill="#f97316" stroke="#ea580c" stroke-width="1"/>
    <path d="M45 0 L49 -2 M43 2 L39 0 M46 5 L50 4" stroke="#fde047" stroke-width="1.6" stroke-linecap="round"/>
    ${burst(32, 34, 10, "#fbbf24", "#b45309")}
    <path d="M14 18 L18 14 M50 20 L54 16 M12 40 L8 44 M52 44 L56 48" stroke="#fde68a" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>`;
}

/** Branching lightning striking chained enemy tokens. */
function chainLightningMotif() {
  return `<ellipse cx="32" cy="58" rx="22" ry="5" fill="#0c1929" opacity="0.5"/>
    <path d="M32 4 L26 20 L34 20 L18 46 L36 24 L28 24 L40 4 Z" fill="#f0f9ff" stroke="#1e40af" stroke-width="1.2" stroke-linejoin="round" filter="url(#lg-cl-glow)"/>
    <path d="M36 24 L50 10 L44 26 L58 18 L48 36" fill="none" stroke="#e0f2fe" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M26 20 L12 12 L18 28 L6 22" fill="none" stroke="#bae6fd" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    ${token(22, 50, 4.5)}${token(38, 44, 4.5)}
    <path d="M22 50 L38 44" stroke="#93c5fd" stroke-width="1.8" stroke-dasharray="2 2" opacity="0.8"/>
    <path d="M48 8 L51 5 M56 16 L59 13 M10 10 L7 7 M6 24 L3 21" stroke="#7dd3fc" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="32" cy="24" r="8" fill="#38bdf8" opacity="0.15"/>`;
}

/** Shattering shield over a doomed enemy token. */
function shatterMotif() {
  return `<path d="M32 10 L44 18 V32 C44 40 32 48 32 48 C32 48 20 40 20 32 V18 Z" fill="#6366f1" opacity="0.35" stroke="#a5b4fc" stroke-width="1.6"/>
    <path d="M32 10 L44 18 V32 C44 40 32 48 32 48 C32 48 20 40 20 32 V18 Z" fill="none" stroke="#c7d2fe" stroke-width="0.8" opacity="0.6"/>
    <path d="M24 22 L40 38 M40 22 L24 38" stroke="#e0e7ff" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M18 16 L22 20 M46 14 L42 18 M14 34 L18 30 M50 36 L46 32" stroke="#c7d2fe" stroke-width="1.4" stroke-linecap="round" opacity="0.8"/>
    ${token(32, 52, 5.5)}
    ${burst(32, 28, 9, "#818cf8", "#4338ca")}
    <path d="M12 24 L16 28 L10 32 M52 26 L48 30 L54 34" stroke="#a5b4fc" stroke-width="1.2" fill="none" opacity="0.65"/>`;
}

/** Twin flames engulfing an enemy and a burning tile. */
function pyromancyMotif() {
  return `<rect x="38" y="38" width="14" height="14" rx="2" fill="#292524" stroke="#78716c" stroke-width="1"/>
    <rect x="38" y="38" width="14" height="14" rx="2" fill="#f97316" opacity="0.35"/>
    ${token(22, 48, 5)}
    <path d="M16 28 C18 18 22 10 26 16 C28 8 32 4 34 14 C36 6 40 10 42 20 C44 12 48 16 46 26 C48 20 52 24 50 32" fill="#f97316" opacity="0.85"/>
    <path d="M18 30 C20 22 24 16 28 20 C30 14 34 12 36 18 C38 14 42 16 44 24" fill="#fbbf24" opacity="0.9"/>
    <path d="M38 34 C40 26 42 20 44 24 C46 18 48 22 46 30" fill="#fb923c" opacity="0.8"/>
    <path d="M20 32 Q22 36 24 32" stroke="#fde047" stroke-width="1.2" fill="none"/>
    <circle cx="30" cy="22" r="6" fill="#fbbf24" opacity="0.2"/>`;
}

/** Spirit rising from the back rank to rejoin the board. */
function reviveMotif() {
  return `<path d="M8 54 H56" stroke="#14532d" stroke-width="2" opacity="0.5"/>
    <rect x="10" y="50" width="44" height="6" rx="1" fill="#166534" opacity="0.35"/>
    ${ghost(32, 38, 7)}
    <path d="M32 44 L32 30" stroke="#86efac" stroke-width="2" stroke-dasharray="3 2" opacity="0.7"/>
    ${piece(32, 24, 6, 0.85)}
    <circle cx="32" cy="24" r="10" fill="#4ade80" opacity="0.12"/>
    <path d="M26 14 L32 8 L38 14" stroke="#bbf7d0" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M20 20 C24 16 28 18 32 14 C36 18 40 16 44 20" stroke="#86efac" stroke-width="1.2" fill="none" opacity="0.45"/>`;
}

/** Board cracking as corner pieces slide toward center. */
function earthquakeMotif() {
  return `<path d="M8 8 L56 8 L56 56 L8 56 Z" fill="none" stroke="#78716c" stroke-width="1.2" opacity="0.35"/>
    <path d="M32 12 L28 28 L36 28 Z M32 52 L28 36 L36 36 Z M12 32 L28 28 L28 36 Z M52 32 L36 28 L36 36 Z" fill="#57534e" opacity="0.45"/>
    <path d="M26 26 L38 38 M38 26 L26 38" stroke="#a8a29e" stroke-width="1.8" stroke-linecap="round"/>
    ${token(16, 16, 3.5)}${token(48, 16, 3.5)}${token(16, 48, 3.5)}${token(48, 48, 3.5)}
    ${arrow(20, 20, 28, 28, 1.6)}${arrow(44, 20, 36, 28, 1.6)}${arrow(20, 44, 28, 36, 1.6)}${arrow(44, 44, 36, 36, 1.6)}
    <circle cx="32" cy="32" r="4" fill="#d6d3d1" opacity="0.25"/>
    <path d="M14 54 L18 50 M50 54 L46 50 M54 14 L50 18 M10 14 L14 18" stroke="#d6d3d1" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/>`;
}

/** Berserker teleport arc onto an enemy. */
function berserkMotif() {
  return `${token(46, 28, 5)} ${xMark(46, 28, 5)}
    ${piece(18, 46, 5, 0.9)}
    ${arcJump(22, 42, 34, 24, 44, 30)}
    <circle cx="18" cy="46" r="8" fill="#ef4444" opacity="0.15"/>
    <circle cx="46" cy="28" r="10" fill="#ef4444" opacity="0.2"/>
    <path d="M10 46 C16 38 22 32 30 28" stroke="#fca5a5" stroke-width="1.5" fill="none" opacity="0.5" stroke-dasharray="3 2"/>
    <path d="M14 12 L18 8 M50 10 L46 6 M52 50 L48 54" stroke="#fecaca" stroke-width="1.4" stroke-linecap="round" opacity="0.55"/>`;
}

/** Shadow hand reaching down to cull a token. */
function cullMotif() {
  return `${token(32, 54, 6)}
    <path d="M14 4 C12 14 10 26 14 36 C16 44 22 48 28 46" fill="#4c1d95" stroke="#2e1065" stroke-width="1.4"/>
    <path d="M28 46 L30 40 L36 42 L38 36 L44 38 L48 32 L52 36" fill="none" stroke="#1e1b4b" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16 10 C18 20 20 30 24 38" stroke="#a78bfa" stroke-width="2" fill="none" opacity="0.65"/>
    <path d="M46 6 C44 18 42 30 44 40" stroke="#a78bfa" stroke-width="2" fill="none" opacity="0.55"/>
    <path d="M24 8 C22 16 20 24 22 32" stroke="#c4b5fd" stroke-width="1.5" fill="none" opacity="0.4"/>
    <circle cx="50" cy="12" r="2" fill="#e9d5ff" opacity="0.9"/>`;
}

/** Two armored knights clashing swords. */
function duelMotif() {
  const knight = (x, flip, plume) => {
    const sx = flip ? -1 : 1;
    return `<g transform="translate(${x}, 40) scale(${sx}, 1)">
      <rect x="-7" y="-4" width="14" height="20" rx="2" fill="#9ca3af" stroke="#374151" stroke-width="1.2"/>
      <path d="M-8 -4 L0 -16 L8 -4 Z" fill="#6b7280" stroke="#374151" stroke-width="1.2"/>
      <path d="M0 -16 L0 -22" stroke="${plume}" stroke-width="4" stroke-linecap="round"/>
      <path d="M6 6 L16 -10" stroke="#cbd5e1" stroke-width="2.8" stroke-linecap="round"/>
      <path d="M6 6 L14 -8" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/>
    </g>`;
  };
  return `${knight(18, false, "#dc2626")}${knight(46, true, "#2563eb")}${burst(32, 32, 7)}`;
}

/** Bloodied battle axe striking a token. */
function executionMotif() {
  return `${token(42, 54, 6)}
    <path d="M10 58 L10 30" stroke="#92400e" stroke-width="4" stroke-linecap="round"/>
    <path d="M10 30 L10 16 L30 10 L34 22 L28 34 Z" fill="#9ca3af" stroke="#374151" stroke-width="1.4"/>
    <path d="M14 18 L24 14 L28 24 L18 28 Z" fill="#dc2626" opacity="0.75"/>
    <path d="M36 42 L44 52" stroke="#78716c" stroke-width="2" stroke-linecap="round" opacity="0.65"/>
    <circle cx="42" cy="50" r="2" fill="#a16207" opacity="0.75"/>
    <circle cx="38" cy="46" r="1.5" fill="#a16207" opacity="0.55"/>`;
}

/** Horseshoe magnet yanking an enemy toward an ally. */
function magnetMotif() {
  return `${ally(20, 38, 5.5)}${token(50, 38, 5.5)}
    <path d="M28 14 C20 14 14 22 14 32 C14 42 20 50 28 50" fill="none" stroke="#dc2626" stroke-width="5" stroke-linecap="round"/>
    <path d="M36 14 C44 14 50 22 50 32 C50 42 44 50 36 50" fill="none" stroke="#1d4ed8" stroke-width="5" stroke-linecap="round"/>
    <rect x="26" y="10" width="12" height="6" rx="2" fill="#64748b" stroke="#334155" stroke-width="1"/>
    <path d="M44 38 L30 38" stroke="#fbbf24" stroke-width="2.2" stroke-dasharray="3 2" opacity="0.85"/>
    <path d="M40 38 L32 38 M32 38 L34 36 M32 38 L34 40" stroke="#fde68a" stroke-width="2" fill="none" stroke-linecap="round"/>`;
}

/** Piece taking two rapid marching steps. */
function quickMarchMotif() {
  return `${ally(32, 44, 6)}
    <path d="M32 38 L32 26" stroke="#93c5fd" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M32 26 L32 14" stroke="#60a5fa" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M32 38 L28 34 M32 38 L36 34" stroke="#93c5fd" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M32 26 L28 22 M32 26 L36 22" stroke="#60a5fa" stroke-width="2" fill="none" stroke-linecap="round"/>
    <ellipse cx="24" cy="50" rx="5" ry="3" fill="#1e3a8a" opacity="0.35"/>
    <ellipse cx="40" cy="50" rx="5" ry="3" fill="#1e3a8a" opacity="0.35"/>
    <circle cx="32" cy="10" r="4" fill="#2563eb" opacity="0.25" stroke="#93c5fd" stroke-width="1.2" stroke-dasharray="2 2"/>`;
}

/** Armed piece releasing a paralyzing shockwave. */
function shockwaveMotif() {
  return `${ally(32, 36, 6)}
    <circle cx="32" cy="36" r="10" fill="none" stroke="#c4b5fd" stroke-width="2" opacity="0.7" filter="url(#ep-sw-glow)"/>
    <circle cx="32" cy="36" r="16" fill="none" stroke="#a78bfa" stroke-width="1.6" opacity="0.55"/>
    <circle cx="32" cy="36" r="22" fill="none" stroke="#8b5cf6" stroke-width="1.2" opacity="0.4"/>
    ${token(14, 28, 3.5)}${token(50, 28, 3.5)}${token(14, 44, 3.5)}${token(50, 44, 3.5)}
    <path d="M14 28 L12 24 M50 28 L52 24 M14 44 L12 48 M50 44 L52 48" stroke="#e9d5ff" stroke-width="1.4" stroke-linecap="round" opacity="0.65"/>
    <path d="M28 20 L30 16 L34 20" stroke="#fbbf24" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
}

/** Hypnotic beam converting an enemy to your side. */
function mindControlMotif() {
  return `${token(46, 30, 6)}
    <circle cx="46" cy="30" r="9" fill="none" stroke="#f87171" stroke-width="1.4" opacity="0.5"/>
    <circle cx="24" cy="30" r="12" fill="none" stroke="#c4b5fd" stroke-width="2" opacity="0.75"/>
    <circle cx="24" cy="30" r="5" fill="#7c3aed" opacity="0.55" stroke="#e9d5ff" stroke-width="1.4"/>
    <circle cx="24" cy="30" r="2" fill="#f0e6ff"/>
    <path d="M24 18 C30 22 30 38 24 42 C18 38 18 22 24 18 Z" fill="#a78bfa" opacity="0.35"/>
    <path d="M36 30 L40 30" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M30 24 C34 28 34 32 30 36" stroke="#fde68a" stroke-width="1.8" fill="none" opacity="0.7"/>
    <path d="M46 30 L40 30" stroke="#fca5a5" stroke-width="1.5" stroke-dasharray="2 2" opacity="0.6"/>`;
}

/** Dizzy enemy with chaotic random paths. */
function confusionMotif() {
  return `${token(32, 34, 6)}
    <path d="M18 18 C26 26 18 34 26 42 C34 34 42 42 46 28 C42 18 34 22 28 16" stroke="#c4b5fd" stroke-width="2.2" fill="none" opacity="0.75"/>
    <path d="M22 14 C30 20 24 28 32 24" stroke="#a78bfa" stroke-width="1.6" fill="none" opacity="0.55"/>
    <text x="44" y="16" font-size="9" fill="#fde68a" opacity="0.9">?</text>
    <text x="12" y="48" font-size="8" fill="#fde68a" opacity="0.7">?</text>
    <path d="M26 30 L30 26 M34 30 L38 34 M30 38 L26 42" stroke="#f0e6ff" stroke-width="1.6" stroke-linecap="round" opacity="0.6"/>`;
}

/** Hidden trap rune cancelling an incoming spell. */
function counterspellMotif() {
  return `<path d="M32 48 L44 36 L38 30 L50 18 L42 16 L32 26 L22 16 L14 18 L26 30 L20 36 Z" fill="#4c1d95" opacity="0.45" stroke="#a78bfa" stroke-width="1.4"/>
    <path d="M32 48 L44 36 L38 30 L50 18 L42 16 L32 26 L22 16 L14 18 L26 30 L20 36 Z" fill="none" stroke="#c4b5fd" stroke-width="0.8" opacity="0.5"/>
    <path d="M24 28 L40 44 M40 28 L24 44" stroke="#f87171" stroke-width="2.8" stroke-linecap="round"/>
    <path d="M10 10 L22 22 L16 28 L28 40" fill="none" stroke="#fbbf24" stroke-width="2.4" stroke-linecap="round" opacity="0.65"/>
    <circle cx="10" cy="10" r="4" fill="#fde68a" opacity="0.5"/>`;
}

/** Diagonal ice beam freezing enemies in a line. */
function deepFreezeMotif() {
  return `${ally(32, 50, 4.5)}
    <path d="M8 56 L56 8" stroke="#bae6fd" stroke-width="3" opacity="0.55"/>
    <path d="M8 56 L56 8" stroke="#e0f2fe" stroke-width="1.4" opacity="0.85"/>
    ${token(20, 44, 4)}${token(32, 32, 4)}${token(44, 20, 4)}
    <path d="M18 40 L22 36 M26 28 L30 24 M38 16 L42 12" stroke="#e0f2fe" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M16 38 L20 42 M24 26 L28 30 M36 14 L40 18" stroke="#7dd3fc" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>
    <text x="46" y="14" font-size="8" fill="#e0f2fe" opacity="0.85">❄</text>`;
}

/** Two pieces crossing to swap positions. */
function hostileSwapMotif() {
  return `${ally(20, 40, 5.5)}${token(44, 24, 5.5)}
    <path d="M26 36 C32 30 38 28 44 28" stroke="#93c5fd" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M38 28 L44 28 L42 24 M44 28 L42 32" stroke="#93c5fd" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M38 32 C32 38 26 40 20 40" stroke="#fca5a5" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M26 40 L20 40 L22 36 M20 40 L22 44" stroke="#fca5a5" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M28 34 L36 30" stroke="#fde68a" stroke-width="1.5" stroke-dasharray="2 2" opacity="0.6"/>`;
}

/** Cleansing light washing debuffs from allied pieces. */
function purifyMotif() {
  return `${ally(20, 44, 4)}${ally(44, 44, 4)}
    <path d="M32 8 L34 20 H44 L36 26 L38 38 L32 32 L26 38 L28 26 L20 20 H30 Z" fill="#fde68a" opacity="0.75" stroke="#f59e0b" stroke-width="1.2" filter="url(#ep-pu-glow)"/>
    <path d="M16 36 L20 40 M48 36 L44 40" stroke="#86efac" stroke-width="1.6" stroke-linecap="round" opacity="0.65"/>
    <path d="M18 30 L22 34 M46 30 L42 34" stroke="#fca5a5" stroke-width="1.4" stroke-linecap="round" opacity="0.4"/>
    <circle cx="32" cy="24" r="14" fill="#fbbf24" opacity="0.12"/>`;
}

/** Wanted poster with checker piece — mark enemy for jump-capture reward. */
function bountyMotif() {
  return `<rect x="12" y="6" width="40" height="52" rx="3" fill="#fef3c7" stroke="#d97706" stroke-width="2.2"/>
    <text x="32" y="18" text-anchor="middle" font-size="7.5" font-weight="bold" fill="#92400e" font-family="Georgia,serif">WANTED</text>
    <line x1="16" y1="22" x2="48" y2="22" stroke="#d97706" stroke-width="1.2"/>
    <circle cx="32" cy="38" r="12" fill="#dc2626" stroke="#7f1d1d" stroke-width="2"/>
    <ellipse cx="28" cy="34" rx="4.5" ry="3" fill="rgba(255,255,255,0.35)"/>
    <text x="32" y="52" text-anchor="middle" font-size="6" font-weight="bold" fill="#b45309">REWARD</text>`;
}

/** Two enemies chained by a glowing fate thread. */
function linkFateMotif() {
  return `${token(18, 34, 5.5)}${token(46, 34, 5.5)}
    <path d="M24 34 H40" stroke="#c4b5fd" stroke-width="2.5"/>
    <circle cx="32" cy="34" r="4" fill="#7c3aed" stroke="#e9d5ff" stroke-width="1.4"/>
    <path d="M24 34 C28 28 36 28 40 34 C36 40 28 40 24 34 Z" fill="none" stroke="#a78bfa" stroke-width="1.6" opacity="0.65"/>
    <path d="M18 34 L14 30 M18 34 L14 38 M46 34 L50 30 M46 34 L50 38" stroke="#f87171" stroke-width="1.4" stroke-linecap="round" opacity="0.55"/>`;
}

/** Original piece with a translucent duplicate beside it. */
function cloneMotif() {
  return `${ally(22, 36, 5.5)}
    <circle cx="42" cy="36" r="5.5" fill="#2563eb" opacity="0.35" stroke="#93c5fd" stroke-width="1.6" stroke-dasharray="3 2"/>
    <path d="M28 36 L36 36" stroke="#fde68a" stroke-width="2" stroke-dasharray="3 2" opacity="0.7"/>
    <path d="M42 36 L42 30 M42 36 L42 42 M36 36 L48 36" stroke="#93c5fd" stroke-width="1.2" opacity="0.45"/>
    <circle cx="42" cy="36" r="9" fill="#7c3aed" opacity="0.1"/>`;
}

/** Crowned king protected by a golden constitution scroll. */
function constitutionMotif() {
  return `${ally(32, 40, 6)}
    <path d="M22 14 L26 6 L30 12 L32 4 L34 12 L38 6 L42 14 L42 48 L22 48 Z" fill="#fef3c7" stroke="#d97706" stroke-width="1.4" opacity="0.85"/>
    <path d="M26 20 H38 M26 26 H38 M26 32 H34" stroke="#92400e" stroke-width="1.2" opacity="0.55"/>
    <path d="M22 10 L26 4 L30 10 L32 2 L34 10 L38 4 L42 10" fill="#fbbf24" stroke="#b45309" stroke-width="1"/>
    <path d="M32 40 L32 28" stroke="#93c5fd" stroke-width="2" opacity="0.45"/>
    <path d="M24 34 L32 28 L40 34" fill="#2563eb" opacity="0.35" stroke="#1e3a8a" stroke-width="1.2"/>`;
}

/** Gold star heads + silver skull tails — coin frozen mid-spin with 50/50 fate trails. */
function coinFlipMotif() {
  const star = (cx, cy, r) => {
    const pts = [];
    for (let i = 0; i < 5; i++) {
      const outer = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const inner = outer + Math.PI / 5;
      pts.push([cx + Math.cos(outer) * r, cy + Math.sin(outer) * r]);
      pts.push([cx + Math.cos(inner) * r * 0.42, cy + Math.sin(inner) * r * 0.42]);
    }
    return `<polygon points="${pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")}" fill="#fde68a" stroke="#b45309" stroke-width="0.8"/>`;
  };

  const skull = (cx, cy, s) => `
    <ellipse cx="${cx}" cy="${cy - s * 0.15}" rx="${s * 0.72}" ry="${s * 0.82}" fill="#cbd5e1" stroke="#475569" stroke-width="0.9"/>
    <ellipse cx="${cx - s * 0.28}" cy="${cy - s * 0.1}" rx="${s * 0.2}" ry="${s * 0.24}" fill="#1e293b"/>
    <ellipse cx="${cx + s * 0.28}" cy="${cy - s * 0.1}" rx="${s * 0.2}" ry="${s * 0.24}" fill="#1e293b"/>
    <path d="M${cx - s * 0.22} ${cy + s * 0.18} Q${cx} ${cy + s * 0.42} ${cx + s * 0.22} ${cy + s * 0.18}" fill="none" stroke="#475569" stroke-width="0.8"/>
    <path d="M${cx - s * 0.16} ${cy + s * 0.34} V${cy + s * 0.58} M${cx} ${cy + s * 0.3} V${cy + s * 0.58} M${cx + s * 0.16} ${cy + s * 0.34} V${cy + s * 0.58}" stroke="#64748b" stroke-width="0.7"/>`;

  const coinRim = (cx, cy, r, stroke) =>
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${stroke}" stroke-width="1.1" opacity="0.55"/>
     <circle cx="${cx}" cy="${cy}" r="${r - 2.2}" fill="none" stroke="${stroke}" stroke-width="0.6" opacity="0.35" stroke-dasharray="1.8 1.4"/>`;

  return `<defs>
    <radialGradient id="cf-gold" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#fff6c8"/>
      <stop offset="55%" stop-color="#d4a017"/>
      <stop offset="100%" stop-color="#6b4a0a"/>
    </radialGradient>
    <radialGradient id="cf-silver" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#f1f5f9"/>
      <stop offset="55%" stop-color="#94a3b8"/>
      <stop offset="100%" stop-color="#334155"/>
    </radialGradient>
    <radialGradient id="cf-bg" cx="50%" cy="50%" r="72%">
      <stop offset="0%" stop-color="#2a2218"/>
      <stop offset="45%" stop-color="#14100c"/>
      <stop offset="100%" stop-color="#080604"/>
    </radialGradient>
  </defs>
  <rect width="64" height="64" fill="url(#cf-bg)"/>
  <ellipse cx="32" cy="56" rx="20" ry="4" fill="#000" opacity="0.35"/>
  <path d="M6 34 C14 28 20 24 28 22" stroke="#fbbf24" stroke-width="1.6" fill="none" opacity="0.55" stroke-linecap="round"/>
  <path d="M58 30 C50 24 44 20 36 18" stroke="#93c5fd" stroke-width="1.6" fill="none" opacity="0.5" stroke-linecap="round"/>
  <circle cx="12" cy="30" r="1.4" fill="#fde68a" opacity="0.8"/>
  <circle cx="18" cy="26" r="1" fill="#fbbf24" opacity="0.65"/>
  <circle cx="52" cy="28" r="1.4" fill="#cbd5e1" opacity="0.75"/>
  <circle cx="46" cy="22" r="1" fill="#94a3b8" opacity="0.55"/>
  <g transform="translate(20, 34) rotate(-18)">
    <circle cx="0" cy="0" r="15" fill="url(#cf-gold)" stroke="#b45309" stroke-width="1.6"/>
    ${coinRim(0, 0, 15, "#fbbf24")}
    ${star(0, 0, 6.5)}
  </g>
  <g transform="translate(44, 30) rotate(22)">
    <circle cx="0" cy="0" r="14" fill="url(#cf-silver)" stroke="#64748b" stroke-width="1.6"/>
    ${coinRim(0, 0, 14, "#cbd5e1")}
    ${skull(0, 0, 9)}
  </g>
  <path d="M26 48 C30 44 34 44 38 48" stroke="#fbbf24" stroke-width="1.4" fill="none" opacity="0.45"/>
  <text x="32" y="60" text-anchor="middle" font-size="6.5" fill="#fde68a" opacity="0.7" font-weight="700">50 / 50</text>
  ${token(14, 50, 3.2)}${ally(50, 50, 3.2)}`;
}

/** Enemy pulled back through a portal to its starting square. */
function deportMotif() {
  return `${token(46, 22, 5.5)}
    <ellipse cx="20" cy="42" rx="12" ry="10" fill="#4c1d95" opacity="0.45" stroke="#a78bfa" stroke-width="1.6"/>
    <ellipse cx="20" cy="42" rx="7" ry="5" fill="#1e1b4b" opacity="0.55"/>
    <circle cx="20" cy="42" r="3" fill="#c4b5fd" opacity="0.65"/>
    <path d="M40 26 C34 30 28 34 24 38" stroke="#fca5a5" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M24 38 L20 42 L16 38" stroke="#fca5a5" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M10 50 H30" stroke="#78716c" stroke-width="2" opacity="0.5"/>
    <rect x="12" y="50" width="16" height="4" rx="1" fill="#57534e" opacity="0.4"/>
    <text x="12" y="49" font-size="5" fill="#d6d3d1" opacity="0.7">start</text>`;
}

/** Ally piece dissolving into two drawn cards. */
function offeringMotif() {
  return `${ally(22, 44, 5.5)}
    <path d="M22 44 C18 36 20 26 28 20" stroke="#c4b5fd" stroke-width="2" fill="none" opacity="0.7"/>
    <circle cx="28" cy="20" r="3" fill="#e9d5ff" opacity="0.8"/>
    <rect x="36" y="12" width="14" height="20" rx="2" fill="#4c1d95" stroke="#a78bfa" stroke-width="1.4" transform="rotate(8 43 22)"/>
    <rect x="44" y="16" width="14" height="20" rx="2" fill="#5b21b6" stroke="#c4b5fd" stroke-width="1.4" transform="rotate(-6 51 26)"/>
    <path d="M40 22 L46 22 M40 26 H48 M40 30 H46" stroke="#e9d5ff" stroke-width="1" opacity="0.55"/>
    <path d="M48 26 L54 26 M48 30 H56" stroke="#ddd6fe" stroke-width="1" opacity="0.45"/>
    <text x="38" y="48" font-size="7" fill="#e9d5ff" opacity="0.75">+2</text>`;
}

/** Two enemies swapping places while frozen. */
function tangleMotif() {
  return `${token(20, 34, 5.5)}${token(44, 34, 5.5)}
    <path d="M26 34 C32 28 38 28 44 34" stroke="#fca5a5" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M38 34 C32 40 26 40 20 34" stroke="#93c5fd" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M38 28 L44 34 L42 38" stroke="#fca5a5" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M26 40 L20 34 L22 30" stroke="#93c5fd" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <text x="16" y="22" font-size="8" fill="#bae6fd" opacity="0.85">❄</text>
    <text x="46" y="22" font-size="8" fill="#bae6fd" opacity="0.85">❄</text>
    <path d="M20 26 L24 30 M44 26 L40 30" stroke="#e0f2fe" stroke-width="1.4" stroke-linecap="round" opacity="0.6"/>`;
}

/** Bishop diagonal slide paths from a piece. */
function bishopMarkMotif() {
  return `${ally(32, 48, 5.5)}
    <path d="M32 44 L14 26 M32 44 L50 26" stroke="#c4b5fd" stroke-width="2.4" fill="none" stroke-linecap="round" opacity="0.75"/>
    <path d="M18 30 L22 26 M46 30 L42 26" stroke="#e9d5ff" stroke-width="1.4" stroke-linecap="round" opacity="0.55"/>
    <text x="40" y="20" font-size="14" fill="#e9d5ff" opacity="0.95">♗</text>
    <circle cx="20" cy="28" r="2.5" fill="#a78bfa" opacity="0.5"/>
    <circle cx="44" cy="28" r="2.5" fill="#a78bfa" opacity="0.5"/>`;
}

/** Rook rank and file slide paths from a piece. */
function rookMarkMotif() {
  return `${ally(32, 48, 5.5)}
    <path d="M32 44 V16 M32 44 H12 M32 44 H52" stroke="#c4b5fd" stroke-width="2.4" fill="none" stroke-linecap="round" opacity="0.75"/>
    <path d="M32 20 V12 M12 44 H8 M52 44 H56" stroke="#e9d5ff" stroke-width="1.4" stroke-linecap="round" opacity="0.45"/>
    <text x="40" y="20" font-size="14" fill="#e9d5ff" opacity="0.95">♜</text>
    <rect x="28" y="12" width="8" height="4" rx="1" fill="#a78bfa" opacity="0.35"/>`;
}

/** Enemy pulled forward along a diagonal. */
function callForwardMotif() {
  return `${token(44, 22, 5.5)}
    <circle cx="44" cy="22" r="9" fill="none" stroke="#fca5a5" stroke-width="1.4" opacity="0.45"/>
    <path d="M40 26 C34 32 28 36 22 40" stroke="#f87171" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M26 38 L22 40 L24 36" stroke="#f87171" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <circle cx="22" cy="40" r="3" fill="none" stroke="#93c5fd" stroke-width="1.4" stroke-dasharray="2 2" opacity="0.65"/>
    <path d="M48 18 L52 14 M16 44 L12 48" stroke="#e9d5ff" stroke-width="1.2" stroke-linecap="round" opacity="0.4"/>`;
}

/** Horizontal blizzard freezing a row of enemies. */
function blizzardMotif() {
  return `<path d="M8 32 H56" stroke="#bae6fd" stroke-width="3" opacity="0.55"/>
    <path d="M8 32 H56" stroke="#e0f2fe" stroke-width="1.4" opacity="0.85"/>
    ${token(18, 32, 4)}${token(32, 32, 4)}${token(46, 32, 4)}
    <path d="M14 26 L18 30 M28 26 L32 30 M42 26 L46 30" stroke="#e0f2fe" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M16 24 L20 28 M30 24 L34 28 M44 24 L48 28" stroke="#7dd3fc" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>
    <text x="46" y="18" font-size="9" fill="#e0f2fe" opacity="0.9">❄</text>
    <text x="10" y="46" font-size="7" fill="#bae6fd" opacity="0.65">row</text>`;
}

/** Diagonal line of allies sharing a bulwark shield. */
function bulwarkMotif() {
  return `${ally(16, 46, 4.5)}${ally(32, 32, 5)}${ally(48, 18, 4.5)}
    <path d="M12 50 L52 14" stroke="#c4b5fd" stroke-width="1.8" opacity="0.45" stroke-dasharray="4 3"/>
    <path d="M28 28 L36 36 L28 44 L20 36 Z" fill="#7c3aed" opacity="0.35" stroke="#c4b5fd" stroke-width="1.6" transform="translate(4, 4)"/>
    <path d="M30 30 L34 34 M34 30 L30 34" stroke="#e9d5ff" stroke-width="1.4" stroke-linecap="round" opacity="0.55"/>`;
}

/** Darkness void protecting pieces in a 7-square zone. */
function darknessMotif() {
  return `<circle cx="32" cy="32" r="20" fill="#1e1b4b" opacity="0.55" stroke="#6d28d9" stroke-width="1.6"/>
    <circle cx="32" cy="32" r="14" fill="#312e81" opacity="0.35"/>
    ${ally(32, 32, 4)}${ally(24, 24, 3)}${ally(40, 24, 3)}${ally(24, 40, 3)}${ally(40, 40, 3)}
    <path d="M20 20 L44 44 M44 20 L20 44" stroke="#a78bfa" stroke-width="0.8" opacity="0.25"/>
    <circle cx="32" cy="32" r="20" fill="none" stroke="#c4b5fd" stroke-width="1.2" opacity="0.4"/>`;
}

/** Piece fortified in rings, then shielded. */
function fortifyMotif() {
  return `${ally(32, 34, 6)}
    <circle cx="32" cy="34" r="12" fill="none" stroke="#a78bfa" stroke-width="2" opacity="0.65"/>
    <circle cx="32" cy="34" r="17" fill="none" stroke="#7c3aed" stroke-width="1.4" opacity="0.45"/>
    <path d="M32 18 L32 24 M32 44 L32 50 M18 34 L24 34 M40 34 L46 34" stroke="#c4b5fd" stroke-width="1.6" stroke-linecap="round" opacity="0.5"/>
    <path d="M32 22 L36 28 L32 34 L28 28 Z" fill="#e9d5ff" opacity="0.35" stroke="#c4b5fd" stroke-width="1.2"/>
    <text x="22" y="52" font-size="6" fill="#ddd6fe" opacity="0.65">hold</text>`;
}

/** Sleeping piece awakening into a crowned bear-marked king. */
function hibernationMotif() {
  return `${ally(32, 38, 6)}
    <text x="22" y="20" font-size="9" fill="#c4b5fd" opacity="0.75">zzz</text>
    <path d="M24 14 C28 10 36 10 40 14" stroke="#a78bfa" stroke-width="1.4" fill="none" opacity="0.45"/>
    ${crown(32, 50)}
    <path d="M26 48 C30 44 34 44 38 48" stroke="#fbbf24" stroke-width="1.6" fill="none" opacity="0.55"/>
    <circle cx="32" cy="52" r="3" fill="#fbbf24" opacity="0.35"/>`;
}

/** Hidden vengeance trap with blood counters on a piece. */
function vengeanceMotif() {
  return `${ally(28, 36, 6)}
    <circle cx="46" cy="24" r="7" fill="none" stroke="#f87171" stroke-width="1.6" opacity="0.55"/>
    <path d="M34 32 L42 26" stroke="#fca5a5" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M18 48 L22 44 M20 50 L24 46" stroke="#dc2626" stroke-width="1.6" stroke-linecap="round" opacity="0.7"/>
    <circle cx="20" cy="48" r="2" fill="#ef4444" opacity="0.8"/>
    <circle cx="24" cy="46" r="2" fill="#ef4444" opacity="0.6"/>
    <path d="M14 18 L18 22 L14 26 L10 22 Z" fill="#4c1d95" opacity="0.5" stroke="#a78bfa" stroke-width="1"/>
    <text x="12" y="22" font-size="5" fill="#e9d5ff" opacity="0.55">?</text>`;
}

/** Hex sanctuary shielding allies from capture. */
function sanctuaryMotif() {
  return `<path d="M32 10 L48 20 V38 L32 48 L16 38 V20 Z" fill="#312e81" opacity="0.4" stroke="#a78bfa" stroke-width="1.6"/>
    ${ally(32, 30, 4)}${ally(24, 22, 3)}${ally(40, 22, 3)}${ally(24, 38, 3)}${ally(40, 38, 3)}
    <path d="M32 14 L34 22 H42 L36 26 L38 34 L32 30 L26 34 L28 26 L22 22 H30 Z" fill="#c4b5fd" opacity="0.45" stroke="#e9d5ff" stroke-width="0.8"/>`;
}

/** Two allies merging into one empowered piece. */
function fusionMotif() {
  return `${ally(18, 40, 4.5)}${ally(46, 40, 4.5)}
    <path d="M24 40 C28 34 36 34 40 40" stroke="#fde68a" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <circle cx="32" cy="28" r="7" fill="#2563eb" stroke="#93c5fd" stroke-width="2" opacity="0.85"/>
    <path d="M28 24 L32 18 L36 24" stroke="#fbbf24" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M26 32 H38 M32 26 V34" stroke="#e9d5ff" stroke-width="1.4" opacity="0.45"/>`;
}

/** Chameleon copying multiple movement patterns. */
function chameleonMotif() {
  return `${ally(32, 34, 6)}
    <path d="M14 22 L32 34 L50 22" stroke="#86efac" stroke-width="1.8" fill="none" opacity="0.55"/>
    <path d="M32 12 L32 34 M14 46 L32 34 L50 46" stroke="#93c5fd" stroke-width="1.8" fill="none" opacity="0.55"/>
    <path d="M18 18 L32 34 L46 46" stroke="#fca5a5" stroke-width="1.4" fill="none" opacity="0.4" stroke-dasharray="3 2"/>
    <circle cx="14" cy="22" r="3" fill="#4ade80" opacity="0.55"/>
    <circle cx="50" cy="22" r="3" fill="#60a5fa" opacity="0.55"/>
    <circle cx="14" cy="46" r="3" fill="#f87171" opacity="0.45"/>
    <ellipse cx="32" cy="20" rx="8" ry="5" fill="#a78bfa" opacity="0.25"/>`;
}

/** Blindfold blocking opponent card play. */
function blindMotif() {
  return `<path d="M16 28 C24 22 40 22 48 28 C40 34 24 34 16 28 Z" fill="#312e81" opacity="0.65" stroke="#a78bfa" stroke-width="1.6"/>
    <path d="M22 28 H42" stroke="#1e1b4b" stroke-width="2.4"/>
    <rect x="38" y="12" width="16" height="22" rx="2" fill="#4c1d95" stroke="#c4b5fd" stroke-width="1.2" transform="rotate(12 46 23)"/>
    <path d="M40 18 L52 30 M52 18 L40 30" stroke="#f87171" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="46" cy="24" r="8" fill="none" stroke="#fca5a5" stroke-width="1.2" opacity="0.45"/>`;
}

/** Trickster chaos — pieces scattered with crossing swap trails. */
function tricksterMotif() {
  return `${ally(14, 18, 3.5)}${token(50, 18, 3.5)}${ally(14, 48, 3.5)}${token(50, 48, 3.5)}
    <path d="M18 18 L46 46 M50 18 L18 46" stroke="#c4b5fd" stroke-width="1.6" opacity="0.55"/>
    <path d="M18 18 L50 18 M14 48 L50 48 M18 18 L18 48 M50 18 L50 48" stroke="#a78bfa" stroke-width="1" opacity="0.3" stroke-dasharray="3 2"/>
    <text x="28" y="34" font-size="10" fill="#fde68a" opacity="0.8">✦</text>
    <path d="M24 22 L40 38 M40 22 L24 38" stroke="#e9d5ff" stroke-width="1.2" opacity="0.4"/>`;
}

/* ── Common spell motifs ── */

function nudgeMotif() {
  return `${ally(18, 44, 5.5)}
    <circle cx="40" cy="26" r="6" fill="none" stroke="#cbd5e1" stroke-width="1.6" stroke-dasharray="3 2" opacity="0.65"/>
    <path d="M24 40 L34 32" stroke="#e2e8f0" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M34 32 L30 30 M34 32 L32 36" stroke="#e2e8f0" stroke-width="2" fill="none" stroke-linecap="round"/>`;
}

function backstepMotif() {
  return `${ally(32, 22, 5.5)}
    <circle cx="32" cy="46" r="6" fill="none" stroke="#cbd5e1" stroke-width="1.6" stroke-dasharray="3 2" opacity="0.65"/>
    <path d="M32 28 L32 40" stroke="#e2e8f0" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M32 40 L28 36 M32 40 L36 36" stroke="#e2e8f0" stroke-width="2" fill="none" stroke-linecap="round"/>`;
}

function retreatMotif() {
  return `${ally(32, 28, 5.5)}
    <path d="M32 34 L32 50" stroke="#93c5fd" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M32 50 L28 44 M32 50 L36 44" stroke="#93c5fd" stroke-width="2" fill="none" stroke-linecap="round"/>
    <text x="42" y="48" font-size="8" fill="#cbd5e1" opacity="0.85">×3</text>`;
}

function anchorMotif() {
  return `${ally(22, 36, 4.5)}${ally(42, 36, 4.5)}
    <path d="M32 12 V28 M32 28 C32 34 26 36 26 42 C26 46 32 48 32 48 C32 48 38 46 38 42 C38 36 32 34 32 28 Z" fill="#94a3b8" opacity="0.65" stroke="#e2e8f0" stroke-width="1.4"/>`;
}

function recallMotif() {
  return `${ally(32, 26, 5.5)}
    <path d="M32 32 L32 44" stroke="#93c5fd" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M10 50 H54" stroke="#64748b" stroke-width="2" opacity="0.55"/>
    <rect x="12" y="48" width="40" height="5" rx="1" fill="#475569" opacity="0.4"/>
    <text x="14" y="47" font-size="5" fill="#cbd5e1" opacity="0.7">back row</text>`;
}

function repelMotif() {
  return `${ally(22, 36, 5)}${token(38, 36, 5)}
    <circle cx="52" cy="36" r="5" fill="none" stroke="#fca5a5" stroke-width="1.4" stroke-dasharray="2 2" opacity="0.55"/>
    <path d="M28 36 L48 36" stroke="#fde68a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M48 36 L44 32 M48 36 L44 40" stroke="#fde68a" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
}

function leapfrogMotif() {
  return `${ally(14, 48, 4.5)}${ally(28, 34, 4)}
    <circle cx="44" cy="20" r="5" fill="none" stroke="#cbd5e1" stroke-width="1.6" stroke-dasharray="3 2" opacity="0.65"/>
    <path d="M18 44 Q28 20 42 24" stroke="#93c5fd" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M40 26 L44 22 M40 26 L44 30" stroke="#93c5fd" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
}

function randomTeleportMotif() {
  return `${ally(32, 40, 5.5)}
    <path d="M16 16 Q32 6 48 16 Q40 30 32 26 Q24 30 16 16" stroke="#c4b5fd" stroke-width="1.8" fill="none" opacity="0.55" stroke-dasharray="3 2"/>
    <text x="40" y="20" font-size="12" fill="#fde68a" opacity="0.9">?</text>
    <circle cx="26" cy="18" r="4" fill="#2563eb" opacity="0.35" stroke="#93c5fd" stroke-width="1.2" stroke-dasharray="2 2"/>`;
}

function rallyMotif() {
  return `${ally(32, 32, 6)}${ally(16, 46, 3.5)}${ally(48, 46, 3.5)}
    <circle cx="32" cy="32" r="18" fill="none" stroke="#93c5fd" stroke-width="1.6" opacity="0.45"/>
  <path d="M16 46 L22 38 M48 46 L42 38" stroke="#60a5fa" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="0.55"/>`;
}

function butterflyMotif() {
  return `<rect x="18" y="18" width="28" height="28" rx="2" fill="#334155" opacity="0.35" stroke="#64748b" stroke-width="1.2"/>
    ${ally(24, 26, 3)}${ally(38, 28, 3)}${token(28, 40, 3)}${token(40, 38, 3)}
    <path d="M24 26 Q32 16 38 28 Q32 44 28 40" stroke="#cbd5e1" stroke-width="1.6" fill="none" opacity="0.55"/>`;
}

function ignoreMotif() {
  return `${ally(32, 36, 6)}
    <path d="M14 18 L22 26 M22 18 L14 26" stroke="#f87171" stroke-width="2.6" stroke-linecap="round"/>
    <text x="36" y="20" font-size="8" fill="#cbd5e1" opacity="0.75">skip</text>`;
}

function ironWillMotif() {
  return `${ally(32, 34, 6)}
    <path d="M16 22 C24 34 20 46 32 46 C44 46 40 34 48 22" stroke="#94a3b8" stroke-width="2.2" fill="none"/>
    <path d="M20 30 L28 38 M44 30 L36 38" stroke="#e2e8f0" stroke-width="2.4" stroke-linecap="round"/>`;
}

function demoteMotif() {
  return `${token(32, 38, 6)}
    <path d="M22 14 L26 6 L30 12 L32 4 L34 12 L38 6 L42 14 L42 20 H22 Z" fill="#fbbf24" opacity="0.55" stroke="#b45309" stroke-width="1"/>
    <path d="M24 16 L40 32 M40 16 L24 32" stroke="#fca5a5" stroke-width="2.2" opacity="0.75"/>`;
}

function quicksandMotif() {
  return `<rect x="18" y="22" width="28" height="28" rx="2" fill="#44403c" opacity="0.45" stroke="#78716c" stroke-width="1.2"/>
    <path d="M20 42 C26 36 38 36 44 42 C38 48 26 48 20 42 Z" fill="#a8a29e" opacity="0.5"/>
    <text x="38" y="20" font-size="8" fill="#d6d3d1" opacity="0.55">?</text>`;
}

function createFoeMotif() {
  return `<rect x="20" y="22" width="24" height="24" rx="2" fill="#292524" opacity="0.35" stroke="#57534e" stroke-width="1.2"/>
    ${token(32, 34, 6)}
    <text x="40" y="20" font-size="9" fill="#fca5a5" opacity="0.85">+</text>`;
}

function barrierMotif() {
  return `<rect x="22" y="18" width="20" height="28" rx="2" fill="#334155" opacity="0.3" stroke="#64748b" stroke-width="1.2"/>
    <path d="M26 20 V44 M38 20 V44" stroke="#cbd5e1" stroke-width="3" opacity="0.8"/>
    <path d="M24 24 H40 M24 32 H40 M24 40 H40" stroke="#94a3b8" stroke-width="1" opacity="0.35"/>`;
}

function panicMotif() {
  return `${token(32, 24, 6)}
    <path d="M32 32 L32 48" stroke="#fca5a5" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M26 48 L32 42 L38 48" stroke="#fca5a5" stroke-width="2" fill="none" stroke-linecap="round"/>`;
}

function shadowSwapMotif() {
  return `${ally(18, 34, 5.5)}${ally(46, 34, 5.5)}
    <path d="M24 34 L40 34" stroke="#93c5fd" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M40 30 L24 30" stroke="#c4b5fd" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M32 26 L32 42" stroke="#fde68a" stroke-width="1.4" stroke-dasharray="2 2" opacity="0.5"/>`;
}

function sidestepMotif() {
  return `${ally(14, 34, 5.5)}
    <circle cx="48" cy="34" r="6" fill="none" stroke="#cbd5e1" stroke-width="1.6" stroke-dasharray="3 2" opacity="0.65"/>
    <path d="M20 34 L42 34" stroke="#e2e8f0" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M42 34 L38 30 M42 34 L38 38" stroke="#e2e8f0" stroke-width="2" fill="none" stroke-linecap="round"/>`;
}

function pressMotif() {
  return `${token(32, 30, 6)}
    <path d="M32 38 L32 52" stroke="#fca5a5" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M32 52 L28 46 M32 52 L36 46" stroke="#fca5a5" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M24 52 L40 52" stroke="#64748b" stroke-width="1.4" opacity="0.45"/>`;
}

function wardMotif() {
  return `${ally(32, 38, 6)}
    <path d="M32 18 L42 24 V36 C42 44 32 50 32 50 C32 50 22 44 22 36 V24 Z" fill="#60a5fa" opacity="0.35" stroke="#93c5fd" stroke-width="1.8"/>`;
}

function snowballMotif() {
  return `${ally(32, 36, 6)}
    <circle cx="18" cy="20" r="7" fill="#e0f2fe" opacity="0.45" stroke="#7dd3fc" stroke-width="1.4"/>
    <text x="14" y="24" font-size="9" fill="#0c4a6e" opacity="0.85">❄</text>
    <path d="M20 26 L30 32" stroke="#bae6fd" stroke-width="1.6" stroke-dasharray="2 2" opacity="0.55"/>`;
}

/* ── Uncommon spell motifs ── */

function longStepMotif() {
  return `${ally(16, 48, 5.5)}
    <circle cx="48" cy="16" r="6" fill="none" stroke="#7dd3fc" stroke-width="1.6" stroke-dasharray="3 2" opacity="0.65"/>
    <path d="M20 44 L44 20" stroke="#bae6fd" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M44 20 L40 18 M44 20 L42 24" stroke="#bae6fd" stroke-width="2" fill="none" stroke-linecap="round"/>`;
}

function aegisMotif() {
  return `${ally(32, 38, 6)}
    <path d="M32 16 L44 22 V36 C44 44 32 50 32 50 C32 50 20 44 20 36 V22 Z" fill="#38bdf8" opacity="0.35" stroke="#7dd3fc" stroke-width="1.8"/>
    <circle cx="32" cy="36" r="16" fill="none" stroke="#bae6fd" stroke-width="1.4" opacity="0.45"/>`;
}

function poisonMotif() {
  return `${token(32, 32, 6)}
    <text x="26" y="18" font-size="13" fill="#86efac" opacity="0.95">☠</text>
    <path d="M26 44 H38" stroke="#4ade80" stroke-width="2.2" opacity="0.55"/>
    <path d="M28 48 H36" stroke="#22c55e" stroke-width="1.4" opacity="0.35"/>`;
}

function deflectMotif() {
  return `${ally(24, 38, 5.5)}
    <path d="M24 30 L30 24 V36 C30 42 24 46 24 46 C24 46 18 42 18 36 V24 Z" fill="#38bdf8" opacity="0.3" stroke="#7dd3fc" stroke-width="1.4"/>
    <path d="M32 26 L48 18" stroke="#fde68a" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    ${token(50, 16, 4)}
    <path d="M34 28 L38 22" stroke="#fbbf24" stroke-width="1.6" opacity="0.65"/>
    <text x="14" y="52" font-size="6" fill="#cbd5e1" opacity="0.5">trap</text>`;
}

function stabMotif() {
  return `${ally(22, 48, 4.5)}${token(42, 24, 5.5)}
    <path d="M26 44 L38 30" stroke="#fde68a" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M36 28 L42 22 L40 32 L46 30 Z" fill="#e2e8f0" stroke="#64748b" stroke-width="1"/>`;
}

function crownMotif() {
  return `${ally(32, 40, 6)}
    <path d="M22 18 L26 8 L30 14 L32 4 L34 14 L38 8 L42 18 L42 24 H22 Z" fill="#fbbf24" opacity="0.85" stroke="#b45309" stroke-width="1.2"/>
    <circle cx="32" cy="28" r="8" fill="#fbbf24" opacity="0.15"/>`;
}

function blinkMotif() {
  return `${ally(18, 46, 5)}${token(44, 18, 4.5)}
    <circle cx="44" cy="18" r="10" fill="none" stroke="#7dd3fc" stroke-width="1.6" opacity="0.55"/>
    <path d="M24 42 L38 24" stroke="#bae6fd" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-dasharray="4 3"/>
    <circle cx="44" cy="18" r="3" fill="#38bdf8" opacity="0.65"/>`;
}

function landmineMotif() {
  return `<rect x="18" y="22" width="28" height="28" rx="2" fill="#292524" opacity="0.4" stroke="#57534e" stroke-width="1.2"/>
    <circle cx="32" cy="36" r="5" fill="#dc2626" stroke="#7f1d1d" stroke-width="1.4"/>
    <path d="M28 32 L36 40 M36 32 L28 40" stroke="#fca5a5" stroke-width="1.8"/>
    <text x="38" y="20" font-size="7" fill="#d6d3d1" opacity="0.5">?</text>`;
}

function backpedalMotif() {
  return `${token(32, 22, 6)}
    <path d="M32 30 L32 48" stroke="#fca5a5" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M24 50 H40" stroke="#64748b" stroke-width="1.8" opacity="0.45"/>
    <path d="M26 48 L32 42 L38 48" stroke="#fca5a5" stroke-width="1.6" fill="none" opacity="0.55"/>`;
}

function rootMotif() {
  return `${token(32, 26, 6)}
    <path d="M22 42 C28 34 36 34 42 42 M24 48 C30 40 34 40 40 48" stroke="#86efac" stroke-width="2" fill="none" opacity="0.75"/>
    <path d="M28 46 L32 38 L36 46" stroke="#4ade80" stroke-width="1.4" fill="none" opacity="0.5"/>`;
}

function sacrificeMotif() {
  return `${ally(18, 42, 5, 0.4)}${token(46, 24, 6)}
    <path d="M24 38 L42 28" stroke="#fde68a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M44 22 L48 26 M44 28 L48 24 M40 26 L48 26 M44 22 L44 30" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>`;
}

function scatterMotif() {
  return `<rect x="28" y="28" width="8" height="8" rx="1" fill="#475569" opacity="0.45" stroke="#94a3b8" stroke-width="1"/>
    ${ally(32, 14, 3)}${token(50, 32, 3)}${ally(32, 50, 3)}${token(14, 32, 3)}
    <path d="M32 24 L32 16" stroke="#bae6fd" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M36 32 L46 32" stroke="#bae6fd" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M32 36 L32 46" stroke="#bae6fd" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M28 32 L18 32" stroke="#bae6fd" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
}

function displacementMotif() {
  return `${ally(14, 42, 4.5)}${ally(32, 42, 4.5)}
    <path d="M18 38 L14 28" stroke="#93c5fd" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M36 38 L40 28" stroke="#93c5fd" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <circle cx="14" cy="26" r="4" fill="none" stroke="#7dd3fc" stroke-width="1.2" stroke-dasharray="2 2" opacity="0.55"/>
    <circle cx="40" cy="26" r="4" fill="none" stroke="#7dd3fc" stroke-width="1.2" stroke-dasharray="2 2" opacity="0.55"/>`;
}

function sanctuaryPulseMotif() {
  return `<path d="M8 44 H56" stroke="#64748b" stroke-width="2.2" opacity="0.5"/>
    ${ally(14, 44, 3.5)}${ally(28, 44, 3.5)}${ally(42, 44, 3.5)}
    <path d="M24 36 L28 40 L24 44 L20 40 Z" fill="#38bdf8" opacity="0.45" stroke="#7dd3fc" stroke-width="1.2" transform="translate(4, 0)"/>`;
}

function lastStandMotif() {
  return `${ally(32, 34, 6)}
    <path d="M32 20 L42 26 V38 C42 46 32 52 32 52 C32 52 22 46 22 38 V26 Z" fill="#38bdf8" opacity="0.35" stroke="#7dd3fc" stroke-width="1.6"/>
    <path d="M16 50 L28 38" stroke="#fde68a" stroke-width="2.2" opacity="0.55"/>
    <text x="12" y="18" font-size="7" fill="#cbd5e1" opacity="0.5">?</text>`;
}

function cryoBoltMotif() {
  return `${token(42, 22, 5.5)}${ally(20, 48, 4.5)}
    <path d="M24 44 L38 28" stroke="#e0f2fe" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M40 16 L44 22 L36 22 Z" fill="#7dd3fc" opacity="0.65"/>
    <text x="46" y="16" font-size="8" fill="#bae6fd" opacity="0.85">❄</text>`;
}

function collapseMotif() {
  return `<rect x="18" y="22" width="28" height="28" rx="2" fill="#292524" opacity="0.35" stroke="#57534e" stroke-width="1.2"/>
    ${ally(32, 34, 4)}
    <path d="M22 44 L32 34 L42 44 M24 50 L40 50" stroke="#a8a29e" stroke-width="2" opacity="0.65" stroke-linecap="round"/>
    <path d="M28 30 L36 38 M36 30 L28 38" stroke="#78716c" stroke-width="1.4" opacity="0.45"/>`;
}

function lastKingMotif() {
  return `${ally(32, 38, 7)}
    <path d="M22 16 L26 6 L30 12 L32 2 L34 12 L38 6 L42 16 L42 22 H22 Z" fill="#fbbf24" opacity="0.8" stroke="#b45309" stroke-width="1.2"/>
    <path d="M32 28 L36 34 L32 40 L28 34 Z" fill="#38bdf8" opacity="0.4" stroke="#7dd3fc" stroke-width="1.2"/>`;
}

function snipeMotif() {
  return `${ally(16, 50, 4)}${token(50, 12, 5.5)}
    <path d="M20 46 L46 16" stroke="#fde68a" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <circle cx="50" cy="12" r="8" fill="none" stroke="#fca5a5" stroke-width="1.4" opacity="0.45"/>
    <path d="M44 18 L50 12 L48 20" stroke="#ef4444" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
}

function dominionMotif() {
  return `${ally(20, 26, 4.5)}${ally(44, 26, 4.5)}
    <path d="M20 32 L20 48" stroke="#93c5fd" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M44 32 L44 48" stroke="#93c5fd" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M20 48 L16 42 M20 48 L24 42" stroke="#93c5fd" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M44 48 L40 42 M44 48 L48 42" stroke="#93c5fd" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
}

export const EFFECT_ILLUSTRATIONS = {
  nudge: () => commonBleed("nu", "#94a3b8", "#1e293b", nudgeMotif()),
  backstep: () => commonBleed("bs", "#9ca3af", "#1f2937", backstepMotif()),
  retreat_3: () => commonBleed("ret", "#93c5fd", "#1e3a5f", retreatMotif()),
  leapfrog: () => commonBleed("lf", "#94a3b8", "#1e293b", leapfrogMotif()),
  long_step: () => uncommonBleed("ls", "#7dd3fc", "#1e3a5f", longStepMotif()),
  sidestep: () => commonBleed("ss", "#9ca3af", "#1f2937", sidestepMotif()),
  blink_2: () => uncommonBleed("bl", "#38bdf8", "#0c4a6e", blinkMotif()),
  random_teleport: () => commonBleed("rtp", "#a78bfa", "#312e81", randomTeleportMotif()),
  recall: () => commonBleed("rc", "#93c5fd", "#1e3a5f", recallMotif()),
  repel: () => commonBleed("rp", "#94a3b8", "#1e293b", repelMotif()),
  mass_nudge: () => uncommonBleed("mn", "#7dd3fc", "#1e3a5f", displacementMotif()),
  swap_friendly: () => commonBleed("sw", "#a78bfa", "#312e81", shadowSwapMotif()),
  dominion: () => uncommonBleed("dm", "#60a5fa", "#1e3a5f", dominionMotif()),

  shield_1: () => commonBleed("s1", "#60a5fa", "#1e3a5f", wardMotif()),
  shield_2: () => uncommonBleed("s2", "#38bdf8", "#0c4a6e", aegisMotif()),
  bulwark: () => rareBleed("bw", "#b794f4", "#553c7a", bulwarkMotif()),
  barrier: () => commonBleed("br", "#94a3b8", "#1f2937", barrierMotif()),
  last_stand: () => uncommonBleed("ls", "#38bdf8", "#0c4a6e", lastStandMotif()),
  fortify: () => rareBleed("fo", "#a78bfa", "#4c1d95", fortifyMotif()),
  sanctuary_pulse: () => uncommonBleed("sp", "#7dd3fc", "#1e3a5f", sanctuaryPulseMotif()),
  sanctuary: () => rareBleed("sa", "#c4b5fd", "#4c1d95", sanctuaryMotif()),
  deflect_1: () => uncommonBleed("df", "#38bdf8", "#0c4a6e", deflectMotif()),
  anchor_2: () => commonBleed("an", "#94a3b8", "#1f2937", anchorMotif()),
  iron_will: () => commonBleed("iw", "#9ca3af", "#1f2937", ironWillMotif()),
  vengeance: () => rareBleed("vg", "#9f7aea", "#3b0764", vengeanceMotif()),
  rally: () => commonBleed("rl", "#60a5fa", "#1e3a5f", rallyMotif()),

  forward_bolt: () => uncommonBleed("fb", "#fde68a", "#1e3a5f", stabMotif()),
  destroy_unshielded: () => legendaryBleed("sh", "#4338ca", "#1e1b4b", shatterMotif()),
  pyromancy: () => legendaryBleed("py", "#ea580c", "#431407", pyromancyMotif()),
  snipe: () => uncommonBleed("sn", "#fde68a", "#1e3a5f", snipeMotif()),
  duel: () => commonBleed("du", "#d4b896", "#3d2817", duelMotif()),
  sacrifice: () => uncommonBleed("sc", "#fca5a5", "#1e3a5f", sacrificeMotif()),
  cull: () => epicBleed("cu", "#a78bfa", "#2e1065", cullMotif()),
  execution: () => epicBleed("ex", "#d4a574", "#3d2817", executionMotif()),
  chain_lightning: () => legendaryBleed("cl", "#2563eb", "#0c1929", chainLightningMotif()),
  backstab: () => uncommonBleed("bk", "#c4a574", "#2d4a6e", backstabMotif()),
  cryo_bolt: () => uncommonBleed("cb", "#7dd3fc", "#0c4a6e", cryoBoltMotif()),
  bomb: () => legendaryBleed("bm", "#f59e0b", "#78350f", bombMotif()),
  shockwave: () => epicBleed("sw", "#c4b5fd", "#3b1f6e", shockwaveMotif()),
  magnet: () => epicBleed("mg", "#f0c060", "#312e81", magnetMotif()),

  poison_3: () => uncommonBleed("po", "#86efac", "#14532d", poisonMotif()),
  root_2: () => uncommonBleed("ro", "#86efac", "#14532d", rootMotif()),
  panic: () => commonBleed("pn", "#fca5a5", "#1f2937", panicMotif()),
  blizzard: () => rareBleed("bz", "#7dd3fc", "#1e3a5f", blizzardMotif()),
  snowball: () => commonBleed("sb", "#bae6fd", "#0c4a6e", snowballMotif()),
  berserk: () => legendaryBleed("bk", "#991b1b", "#450a0a", berserkMotif()),
  create_foe: () => commonBleed("cf", "#78716c", "#292524", createFoeMotif()),
  deep_freeze: () => epicBleed("df", "#7dd3fc", "#0c4a6e", deepFreezeMotif()),
  reverse_only_2: () => uncommonBleed("rv", "#fca5a5", "#1e3a5f", backpedalMotif()),
  press: () => commonBleed("pr", "#fca5a5", "#1f2937", pressMotif()),
  tangle: () => rareBleed("tg", "#93c5fd", "#312e81", tangleMotif()),
  blind: () => rareBleed("bl", "#a78bfa", "#4c1d95", blindMotif()),
  confusion: () => epicBleed("cf", "#c4b5fd", "#4c1d95", confusionMotif()),
  fog_2: () => wrap(`${piece(32, 34, 6)}<ellipse cx="32" cy="24" rx="16" ry="8" fill="currentColor" opacity="0.22"/>`),

  crown: () => uncommonBleed("cr", "#fbbf24", "#451a03", crownMotif()),
  demote: () => commonBleed("dm", "#fca5a5", "#1f2937", demoteMotif()),
  fusion: () => rareBleed("fu", "#8b5cf6", "#4c1d95", fusionMotif()),
  clone: () => epicBleed("cln", "#93c5fd", "#312e81", cloneMotif()),
  chameleon: () => rareBleed("ch", "#86efac", "#312e81", chameleonMotif()),
  hibernation: () => rareBleed("hi", "#c4b5fd", "#4c1d95", hibernationMotif()),

  quicksand: () => commonBleed("qs", "#a8a29e", "#292524", quicksandMotif()),
  landmine: () => uncommonBleed("lm", "#78716c", "#292524", landmineMotif()),
  collapse: () => uncommonBleed("co", "#78716c", "#292524", collapseMotif()),
  darkness: () => rareBleed("dk", "#6d28d9", "#1e1b4b", darknessMotif()),
  scatter: () => uncommonBleed("st", "#7dd3fc", "#1e3a5f", scatterMotif()),
  butterfly: () => commonBleed("bf", "#a78bfa", "#312e81", butterflyMotif()),
  call_forward: () => rareBleed("cfw", "#fca5a5", "#4c1d95", callForwardMotif()),
  earthquake: () => legendaryBleed("eq", "#78716c", "#292524", earthquakeMotif()),

  coin_flip: () => coinFlipMotif(),
  ignore: () => commonBleed("ig", "#94a3b8", "#1f2937", ignoreMotif()),
  counterspell: () => epicBleed("cs", "#a78bfa", "#2e1065", counterspellMotif()),
  purify: () => epicBleed("pu", "#fde68a", "#4a3520", purifyMotif()),
  trickster: () => rareBleed("tr", "#c4b5fd", "#553c7a", tricksterMotif()),
  offering: () => rareBleed("of", "#d8b4fe", "#553c7a", offeringMotif()),
  quick_march: () => epicBleed("qm", "#60a5fa", "#1e3a5f", quickMarchMotif()),
  constitution: () => epicBleed("co", "#fbbf24", "#451a03", constitutionMotif()),
  last_king: () => uncommonBleed("lk", "#fbbf24", "#1e3a5f", lastKingMotif()),
  revive: () => legendaryBleed("rv", "#15803d", "#052e16", reviveMotif()),
  mind_control: () => epicBleed("mc", "#c4b5fd", "#3b0764", mindControlMotif()),
  bounty: () => epicBleed("bo", "#fbbf24", "#451a03", bountyMotif()),
  link_fate: () => epicBleed("lf", "#a78bfa", "#2e1065", linkFateMotif()),
  bishop_2: () => rareBleed("bp", "#b794f4", "#4c1d95", bishopMarkMotif()),
  rook_2: () => rareBleed("rk", "#a78bfa", "#4c1d95", rookMarkMotif()),
  hostile_swap: () => epicBleed("hs", "#93c5fd", "#312e81", hostileSwapMotif()),
  deport: () => epicBleed("dp", "#c4b5fd", "#1e1b4b", deportMotif()),
};

/**
 * @param {{ id: string, effect?: string }} def
 * @param {number} [variant=0]
 */
export function illustrationForCard(def, variant = 0) {
  const fn = EFFECT_ILLUSTRATIONS[def.effect];
  return fn ? fn(variant) : null;
}
