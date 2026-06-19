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

export const FULL_BLEED_EFFECTS = new Set([
  "backstab",
  "bomb",
  "berserk",
  "chain_lightning",
  "cull",
  "destroy_unshielded",
  "duel",
  "earthquake",
  "execution",
  "pyromancy",
  "revive",
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

function tickMarks(x, y, count, size = 5, gap = 6) {
  return Array.from({ length: count }, (_, i) =>
    `<rect x="${x + i * gap}" y="${y}" width="${size}" height="${size}" rx="1" fill="currentColor" opacity="0.75"/>`
  ).join("");
}

/** @type {Record<string, (variant: number) => string>} */
export const EFFECT_ILLUSTRATIONS = {
  nudge: () => wrap(`${piece(18, 42)} ${ghost(36, 28)} ${arrow(24, 38, 32, 32)}`),
  backstep: () => wrap(`${piece(32, 24)} ${ghost(32, 44)} ${arrow(32, 30, 32, 40)}`),
  retreat_3: () => wrap(`${piece(32, 30)} ${arrow(32, 34, 32, 48)}<text x="44" y="46" font-size="8" fill="currentColor" opacity="0.7">×3</text>`),
  leapfrog: () => wrap(`${piece(14, 46)} ${piece(28, 34, 4.5)} ${ghost(44, 22)} ${arcJump(18, 42, 28, 34, 42, 24)}`),
  long_step: () => wrap(`${piece(18, 46)} ${ghost(46, 18)} ${arrow(22, 42, 42, 22, 2.4)}`),
  sidestep: () => wrap(`${piece(14, 32)} ${ghost(46, 32)} ${arrow(20, 32, 42, 32, 2.4)}`),
  blink_2: () => wrap(`${piece(20, 44)} ${ring(44, 20, 8)} ${piece(44, 20, 4, 0.35)} ${arrow(26, 40, 38, 26)}<circle cx="44" cy="20" r="3" fill="currentColor" opacity="0.6"/>`),
  random_teleport: () =>
    wrap(
      `${piece(32, 40, 5)}<path d="M18 18 Q32 8 46 18 Q38 32 32 28 Q26 32 18 18" stroke="currentColor" stroke-width="1.6" fill="none" opacity="0.45" stroke-dasharray="3 2"/><text x="40" y="22" font-size="11" fill="currentColor" opacity="0.75">?</text>${piece(28, 20, 3.5, 0.4)}`
    ),
  recall: () => wrap(`${piece(32, 28)} ${arrow(32, 32, 32, 44)}<path d="M14 48 H50" stroke="currentColor" stroke-width="2" opacity="0.45"/><text x="18" y="46" font-size="6" fill="currentColor" opacity="0.55">back row</text>`),
  repel: () => wrap(`${piece(24, 36)} ${enemy(40, 36)} ${ghost(54, 36)} ${arrow(30, 36, 48, 36)}`),
  mass_nudge: () => wrap(`${piece(16, 40)} ${piece(32, 40)} ${arrow(20, 36, 16, 28)} ${arrow(36, 36, 40, 28)}`),
  swap_friendly: () => wrap(`${piece(18, 32)} ${piece(46, 32)} ${arrow(24, 32, 40, 32)} ${arrow(40, 28, 24, 28)}`),
  dominion: () => wrap(`${piece(22, 28)} ${piece(42, 28)} ${arrow(22, 32, 22, 44)} ${arrow(42, 32, 42, 44)}`),

  shield_1: () => wrap(`${piece(32, 36, 6)} ${shield(32, 34, 0.9)}`),
  shield_2: () => wrap(`${piece(32, 36, 6)} ${shield(32, 34, 0.85)} ${ring(32, 36, 16)}`),
  bulwark: () => wrap(`${piece(16, 46)} ${piece(32, 32)} ${piece(48, 18)} ${shield(32, 32, 0.7)}<path d="M12 50 L52 14" stroke="currentColor" stroke-width="1.5" opacity="0.35" stroke-dasharray="4 3"/>`),
  barrier: () => wrap(`${square(32, 32, 14, 0.2)}<path d="M26 20 V44 M38 20 V44" stroke="currentColor" stroke-width="2.5" opacity="0.75"/>`),
  last_stand: () => wrap(`${piece(32, 34, 6)} ${shield(32, 32, 0.8)}<path d="M18 48 L28 38" stroke="currentColor" stroke-width="2" opacity="0.5"/>`),
  fortify: () => wrap(`${piece(32, 34, 6)} ${ring(32, 34, 14)} ${ring(32, 34, 18)}<text x="24" y="52" font-size="7" fill="currentColor" opacity="0.55">hold</text>`),
  sanctuary_pulse: () => wrap(`<path d="M12 42 H52" stroke="currentColor" stroke-width="2" opacity="0.4"/>${piece(16, 42, 4)}${piece(28, 42, 4)}${piece(40, 42, 4)}${piece(52, 42, 4, 0.35)}${shield(28, 40, 0.55)}`),
  sanctuary: () => wrap(`${ring(32, 32, 18)}${piece(32, 32, 4)}${enemy(20, 24, 3)}${enemy(44, 40, 3)}<path d="M20 24 L32 32 L44 40" stroke="currentColor" stroke-width="1.2" opacity="0.35" stroke-dasharray="3 2"/>`),
  deflect_1: () => wrap(`${piece(24, 36)} ${shield(24, 34, 0.65)} ${arrow(34, 30, 48, 24)} ${enemy(50, 22, 4)}<path d="M30 28 L36 22" stroke="currentColor" stroke-width="1.8" opacity="0.6"/>`),
  anchor_2: () => wrap(`${piece(24, 34)} ${piece(40, 34)}<path d="M32 14 V28 M32 28 C32 34 26 36 26 42 C26 46 32 48 32 48 C32 48 38 46 38 42 C38 36 32 34 32 28 Z" fill="currentColor" opacity="0.55"/>`),
  iron_will: () => wrap(`${piece(32, 34, 6)}<path d="M18 24 C24 34 20 44 32 44 C44 44 40 34 46 24" stroke="currentColor" stroke-width="2" fill="none"/><path d="M22 30 L28 36 M42 30 L36 36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`),
  vengeance: () => wrap(`${piece(28, 36, 6)} ${enemy(46, 28, 5)} ${arrow(34, 32, 42, 30)}<circle cx="46" cy="28" r="9" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.45"/>`),
  rally: () => wrap(`${piece(32, 34, 6)} ${piece(18, 42, 4)} ${piece(46, 42, 4)} ${ring(32, 34, 20)}`),

  forward_bolt: () => wrap(`${piece(24, 44)} ${enemy(40, 28, 5)} ${bolt(28, 40, 38, 32)}`),
  destroy_unshielded: () => legendaryBleed("sh", "#4338ca", "#1e1b4b", shatterMotif()),
  pyromancy: () => legendaryBleed("py", "#ea580c", "#431407", pyromancyMotif()),
  snipe: () => wrap(`${piece(18, 48, 4)} ${enemy(50, 14, 5)} ${arrow(22, 44, 46, 18, 2)}`),
  duel: () => fullBleed("#d4b896", duelMotif()),
  sacrifice: () => wrap(`${piece(20, 40, 5, 0.35)} ${arrow(26, 36, 44, 28)} ${enemy(46, 26, 6)} ${xMark(46, 26, 5)}`),
  cull: () => fullBleed("#7c3aed", cullMotif()),
  execution: () => fullBleed("#5c3d2e", executionMotif()),
  chain_lightning: () => legendaryBleed("cl", "#2563eb", "#0c1929", chainLightningMotif()),
  backstab: () => fullBleed("#c4a574", backstabMotif()),
  cryo_bolt: () => wrap(`${enemy(40, 26, 5)} ${piece(22, 44, 4)} ${bolt(26, 40, 36, 30)}<path d="M40 18 L44 22 L36 22 Z" fill="currentColor" opacity="0.5"/>`),
  bomb: () => legendaryBleed("bm", "#f59e0b", "#78350f", bombMotif()),
  shockwave: () => wrap(`${piece(32, 36, 6)}<circle cx="32" cy="36" r="8" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.45"/><circle cx="32" cy="36" r="14" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.35"/><circle cx="32" cy="36" r="20" fill="none" stroke="currentColor" stroke-width="1" opacity="0.25"/>`),
  magnet: () => wrap(`${piece(20, 36, 5)} ${enemy(48, 36, 5)} ${arrow(44, 36, 28, 36)}<text x="12" y="22" font-size="10" fill="currentColor" opacity="0.6">U</text>`),

  poison_3: () => wrap(`${enemy(32, 30, 6)}<text x="27" y="18" font-size="11" fill="currentColor" opacity="0.85">☠</text><path d="M28 40 H36" stroke="currentColor" stroke-width="2" opacity="0.45"/>`),
  root_2: () => wrap(`${enemy(32, 28, 6)}<path d="M24 40 C28 34 36 34 40 40 M26 44 C30 38 34 38 38 44" stroke="currentColor" stroke-width="1.8" fill="none" opacity="0.65"/>`),
  panic: () => wrap(`${enemy(32, 26, 6)} ${arrow(32, 32, 32, 46)}<path d="M26 48 L32 42 L38 48" stroke="currentColor" stroke-width="1.6" fill="none"/>`),
  blizzard: () => wrap(`<path d="M12 32 H52" stroke="currentColor" stroke-width="2" opacity="0.45"/>${enemy(22, 32, 3)}${enemy(32, 32, 3)}${enemy(42, 32, 3)}<text x="40" y="20" font-size="8" fill="currentColor" opacity="0.55">❄</text>`),
  snowball: () => wrap(`${piece(32, 34, 6)}<circle cx="20" cy="22" r="5" fill="currentColor" opacity="0.35"/><text x="16" y="25" font-size="8" fill="currentColor" opacity="0.7">❄</text>`),
  berserk: () => legendaryBleed("bk", "#991b1b", "#450a0a", berserkMotif()),
  create_foe: () => wrap(`${square(32, 34, 16, 0.15)}${enemy(32, 34, 6)}<text x="38" y="22" font-size="7" fill="currentColor" opacity="0.55">+</text>`),
  deep_freeze: () => wrap(`${piece(32, 48, 4)}<path d="M10 54 L54 10" stroke="currentColor" stroke-width="2" opacity="0.45"/>${enemy(22, 40, 3)}${enemy(32, 30, 3)}${enemy(42, 20, 3)}`),
  reverse_only_2: () => wrap(`${enemy(32, 24, 6)} ${arrow(32, 28, 32, 44)}<path d="M24 48 H40" stroke="currentColor" stroke-width="1.8" opacity="0.4"/>`),
  press: () => wrap(`${enemy(32, 32, 6)} ${arrow(32, 38, 32, 48)}`),
  tangle: () => wrap(`${enemy(22, 32, 5)} ${enemy(42, 32, 5)} ${arrow(28, 32, 36, 32)} ${arrow(36, 28, 28, 28)}<path d="M22 26 L42 38 M42 26 L22 38" stroke="currentColor" stroke-width="1.2" opacity="0.4"/>`),
  blind: () => wrap(`<path d="M16 28 C24 22 40 22 48 28 C40 34 24 34 16 28 Z" fill="currentColor" opacity="0.35"/><path d="M22 28 H42" stroke="currentColor" stroke-width="2"/>`),
  confusion: () => wrap(`${enemy(32, 32, 6)}<path d="M20 20 C28 28 20 36 28 44 C36 36 44 44 44 28" stroke="currentColor" stroke-width="1.8" fill="none" opacity="0.65"/>`),
  fog_2: () => wrap(`${piece(32, 34, 6)}<ellipse cx="32" cy="24" rx="16" ry="8" fill="currentColor" opacity="0.22"/>`),

  crown: () => wrap(`${piece(32, 38, 6)} ${crown(32, 24)}`),
  demote: () => wrap(`${enemy(32, 36, 6)} ${crown(32, 18)}<path d="M24 16 L40 32 M40 16 L24 32" stroke="currentColor" stroke-width="1.8" opacity="0.55"/>`),
  fusion: () => wrap(`${piece(20, 38, 5)} ${piece(44, 38, 5)} ${arrow(26, 38, 38, 38)} ${piece(32, 30, 7, 0.55)}`),
  clone: () => wrap(`${piece(24, 34, 5)} ${piece(42, 34, 5, 0.45)} ${arrow(30, 34, 36, 34)}`),
  chameleon: () => wrap(`${piece(32, 34, 6)}<path d="M18 22 H46 M18 30 H46 M18 38 H46" stroke="currentColor" stroke-width="1.2" opacity="0.25"/><circle cx="20" cy="22" r="3" fill="currentColor" opacity="0.5"/><circle cx="44" cy="30" r="3" fill="currentColor" opacity="0.35"/>`),
  hibernation: () => wrap(`${piece(32, 36, 6)}<text x="24" y="22" font-size="9" fill="currentColor" opacity="0.55">zzz</text>${crown(32, 48)}`),

  quicksand: () => wrap(`${square(32, 34, 16, 0.15)}<path d="M20 40 C26 36 38 36 44 40 C38 44 26 44 20 40 Z" fill="currentColor" opacity="0.35"/><text x="38" y="24" font-size="7" fill="currentColor" opacity="0.45">?</text>`),
  landmine: () => wrap(`${square(32, 34, 16, 0.15)}<circle cx="32" cy="34" r="4" fill="currentColor" opacity="0.55"/><path d="M28 30 L36 38 M36 30 L28 38" stroke="currentColor" stroke-width="1.5"/>`),
  collapse: () => wrap(`${square(32, 34, 16, 0.2)} ${piece(32, 34, 4)}<path d="M24 42 L32 34 L40 42 M26 46 L38 46" stroke="currentColor" stroke-width="1.6" opacity="0.55"/>`),
  darkness: () => wrap(`${ring(32, 32, 16)}<ellipse cx="32" cy="32" rx="14" ry="10" fill="currentColor" opacity="0.3"/>${piece(32, 32, 4)}`),
  scatter: () => wrap(`${square(32, 32, 8, 0.25)}${piece(32, 20, 3)}${piece(48, 32, 3)}${piece(32, 44, 3)}${piece(16, 32, 3)}${arrow(32, 28, 32, 22)}${arrow(36, 32, 44, 32)}`),
  butterfly: () => wrap(`${square(32, 32, 18, 0.12)}${piece(26, 28, 3)}${piece(38, 30, 3)}${piece(30, 38, 3)}${piece(40, 36, 3)}<path d="M26 28 Q32 20 38 30 Q32 42 30 38" stroke="currentColor" stroke-width="1.4" fill="none" opacity="0.5"/>`),
  call_forward: () => wrap(`${enemy(40, 28, 5)} ${ghost(24, 40)} ${arrow(36, 32, 28, 38)}`),
  earthquake: () => legendaryBleed("eq", "#78716c", "#292524", earthquakeMotif()),

  coin_flip: () => wrap(`<circle cx="32" cy="32" r="14" fill="currentColor" opacity="0.25" stroke="currentColor" stroke-width="2"/><text x="27" y="36" font-size="10" fill="currentColor" opacity="0.8">50</text>`),
  ignore: () => wrap(`${piece(32, 36, 6)}<path d="M14 20 L22 28 M22 20 L14 28" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><text x="36" y="22" font-size="8" fill="currentColor" opacity="0.55">skip</text>`),
  counterspell: () => wrap(`${shield(32, 30, 0.9)}<path d="M26 30 L38 42 M38 30 L26 42" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>`),
  purify: () => wrap(`${piece(24, 34, 4)} ${enemy(40, 34, 4)}<path d="M32 14 L34 22 H42 L35 27 L38 35 L32 30 L26 35 L29 27 L22 22 H30 Z" fill="currentColor" opacity="0.45"/>`),
  trickster: () => wrap(`${piece(18, 22, 3)}${piece(46, 22, 3)}${piece(18, 46, 3)}${piece(46, 46, 3)}<path d="M18 22 L46 46 M46 22 L18 46" stroke="currentColor" stroke-width="1.2" opacity="0.45"/>`),
  offering: () => wrap(`${piece(24, 40, 5, 0.35)}<path d="M40 18 L48 26 L40 34 L32 26 Z" fill="currentColor" opacity="0.35"/><text x="34" y="28" font-size="7" fill="currentColor" opacity="0.65">+2</text>`),
  quick_march: () => wrap(`${piece(32, 38, 6)} ${arrow(32, 34, 32, 24)} ${arrow(32, 34, 32, 14)}`),
  constitution: () => wrap(`${piece(32, 36, 6)} ${crown(32, 20)} ${shield(32, 34, 0.7)}<text x="42" y="48" font-size="7" fill="currentColor" opacity="0.5">5t</text>`),
  last_king: () => wrap(`${piece(32, 36, 7)} ${crown(32, 20)} ${shield(32, 34, 0.65)}`),
  revive: () => legendaryBleed("rv", "#15803d", "#052e16", reviveMotif()),
  mind_control: () => wrap(`${enemy(44, 30, 6)}<circle cx="32" cy="32" r="9" fill="none" stroke="currentColor" stroke-width="1.6" opacity="0.7"/><circle cx="32" cy="32" r="3" fill="currentColor" opacity="0.85"/><path d="M32 20 V26 M32 38 V44 M20 32 H26 M38 32 H44" stroke="currentColor" stroke-width="1.4" opacity="0.55"/>`),
  bounty: () => wrap(`${enemy(32, 32, 6)}<circle cx="32" cy="32" r="14" fill="none" stroke="currentColor" stroke-width="1.6" opacity="0.55"/><text x="26" y="20" font-size="10" fill="currentColor" opacity="0.85">$</text><rect x="42" y="40" width="12" height="16" rx="2" fill="currentColor" opacity="0.35"/><rect x="44" y="44" width="8" height="2" fill="currentColor" opacity="0.5"/>`),
  link_fate: () => wrap(`${enemy(22, 32, 5)} ${enemy(42, 32, 5)}<path d="M28 32 H36" stroke="currentColor" stroke-width="2"/><circle cx="32" cy="32" r="3" fill="currentColor" opacity="0.6"/>`),
  bishop_2: () =>
    wrap(
      `${piece(32, 48, 5)}<path d="M32 44 L14 26 M32 44 L50 26" stroke="currentColor" stroke-width="2" opacity="0.55" stroke-dasharray="5 3"/><text x="44" y="22" font-size="13" fill="currentColor" opacity="0.9">♗</text>${tickMarks(38, 26, 2)}`
    ),
  rook_2: () =>
    wrap(
      `${piece(32, 48, 5)}<path d="M32 44 V18 M32 44 H14 M32 44 H50" stroke="currentColor" stroke-width="2" opacity="0.55" stroke-dasharray="5 3"/><text x="44" y="22" font-size="13" fill="currentColor" opacity="0.9">♜</text>${tickMarks(38, 26, 2)}`
    ),
  hostile_swap: () => wrap(`${piece(22, 36, 5)} ${enemy(42, 36, 5)} ${arrow(28, 36, 36, 36)} ${arrow(36, 32, 28, 32)}`),
  deport: () => wrap(`${enemy(44, 28, 5)} ${ghost(20, 40)} ${arrow(40, 30, 24, 38)}<path d="M14 48 H50" stroke="currentColor" stroke-width="2" opacity="0.45"/><text x="14" y="46" font-size="6" fill="currentColor" opacity="0.55">start</text>`),
};

/**
 * @param {{ id: string, effect?: string }} def
 * @param {number} [variant=0]
 */
export function illustrationForCard(def, variant = 0) {
  const fn = EFFECT_ILLUSTRATIONS[def.effect];
  return fn ? fn(variant) : null;
}
