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

function groundShadow(cx = 32, cy = 56, rx = 18, ry = 4) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#000" opacity="0.3"/>`;
}

function sparkles(pts, color = "#e2e8f0", opacity = 0.55) {
  return pts.map(([x, y, r = 1]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${opacity}"/>`).join("");
}

function allyPro(x, y, r = 5.5) {
  return `${ally(x, y, r)}
    <ellipse cx="${x - r * 0.2}" cy="${y - r * 0.3}" rx="${r * 0.45}" ry="${r * 0.3}" fill="#93c5fd" opacity="0.5"/>
    <circle cx="${x}" cy="${y}" r="${r + 2.5}" fill="none" stroke="#60a5fa" stroke-width="0.9" opacity="0.22"/>`;
}

function tokenPro(x, y, r = 5.5) {
  return `${token(x, y, r)}
    <ellipse cx="${x - r * 0.2}" cy="${y - r * 0.3}" rx="${r * 0.45}" ry="${r * 0.3}" fill="#fca5a5" opacity="0.45"/>
    <circle cx="${x}" cy="${y}" r="${r + 2}" fill="none" stroke="#f87171" stroke-width="0.8" opacity="0.22"/>`;
}

function destRing(x, y, r = 6, color = "#cbd5e1") {
  return `<circle cx="${x}" cy="${y}" r="${r + 3}" fill="${color}" opacity="0.08"/>
    <circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${color}" stroke-width="1.5" stroke-dasharray="3 2" opacity="0.72"/>
    <circle cx="${x}" cy="${y}" r="2" fill="${color}" opacity="0.42"/>`;
}

function motionArrow(x1, y1, x2, y2, color = "#e2e8f0", w = 2.6) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;
  return `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${color}" stroke-width="${w + 1.4}" fill="none" stroke-linecap="round" opacity="0.22"/>
    <path d="M${x1} ${y1} L${x2} ${y2}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round"/>
    <path d="M${x2} ${y2} L${x2 - ux * 6 + px * 3.5} ${y2 - uy * 6 + py * 3.5} M${x2} ${y2} L${x2 - ux * 6 - px * 3.5} ${y2 - uy * 6 - py * 3.5}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
}

function energyArc(x1, y1, x2, y2, color = "#93c5fd", w = 2) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - 8;
  return `<path d="M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}" stroke="${color}" stroke-width="${w + 1.2}" fill="none" opacity="0.24"/>
    <path d="M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
}

function shieldPro(x, y, fill = "#60a5fa", stroke = "#93c5fd", filterId = "") {
  const filt = filterId ? ` filter="url(#${filterId})"` : "";
  return `<path d="M${x} ${y - 14} L${x + 11} ${y - 6} L${x + 11} ${y + 8} C${x + 11} ${y + 16} ${x} ${y + 22} ${x} ${y + 22} C${x} ${y + 22} ${x - 11} ${y + 16} ${x - 11} ${y + 8} L${x - 11} ${y - 6} Z" fill="${fill}" opacity="0.42" stroke="${stroke}" stroke-width="1.8"${filt}/>
    <path d="M${x} ${y - 10} L${x + 6} ${y - 5} L${x + 6} ${y + 4} C${x + 6} ${y + 9} ${x} ${y + 13} ${x} ${y + 13} C${x} ${y + 13} ${x - 6} ${y + 9} ${x - 6} ${y + 4} L${x - 6} ${y - 5} Z" fill="${stroke}" opacity="0.28"/>`;
}

function trapTile(x, y, w = 28, hidden = true) {
  return `<rect x="${x - w / 2}" y="${y - w / 2}" width="${w}" height="${w}" rx="2" fill="#292524" opacity="0.55" stroke="#57534e" stroke-width="1.4"/>
    ${hidden ? `<path d="M${x - 6} ${y - 6} L${x + 6} ${y + 6} M${x + 6} ${y - 6} L${x - 6} ${y + 6}" stroke="#a8a29e" stroke-width="1.2" opacity="0.35"/>` : ""}
    <rect x="${x - w / 2 + 2}" y="${y - w / 2 + 2}" width="${w - 4}" height="${w - 4}" rx="1" fill="none" stroke="#78716c" stroke-width="0.8" opacity="0.32"/>`;
}

function runeGlow(x, y, s = 5, color = "#c4b5fd") {
  return `<circle cx="${x}" cy="${y}" r="${s + 4}" fill="${color}" opacity="0.12"/>
    <path d="M${x} ${y - s} L${x + s * 0.6} ${y - s * 0.2} L${x + s} ${y + s * 0.4} L${x + s * 0.3} ${y + s} L${x - s * 0.3} ${y + s} L${x - s} ${y + s * 0.4} L${x - s * 0.6} ${y - s * 0.2} Z" fill="none" stroke="${color}" stroke-width="1.2" opacity="0.65"/>`;
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

/** Premium common art with slate radial gradient, vignette, and dust motes. */
function commonBleed(id, top, bottom, inner) {
  const gid = `cm-${id}`;
  const vig = `cm-vig-${id}`;
  return `<defs>
    <radialGradient id="${gid}" cx="50%" cy="36%" r="76%">
      <stop offset="0%" stop-color="${top}"/>
      <stop offset="42%" stop-color="${bottom}"/>
      <stop offset="100%" stop-color="#0b1220" stop-opacity="0.96"/>
    </radialGradient>
    <radialGradient id="${vig}" cx="50%" cy="50%" r="58%">
      <stop offset="55%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.42"/>
    </radialGradient>
    <filter id="${gid}-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="0.85" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="64" height="64" fill="url(#${gid})"/>
  <g opacity="0.38">${sparkles([[10, 12, 0.8], [54, 8, 1], [48, 52, 0.7], [8, 44, 0.9], [32, 6, 1.2], [58, 30, 0.6]], "#cbd5e1", 0.45)}</g>
  <rect width="64" height="64" fill="url(#${vig})"/>
  <g filter="url(#${gid}-glow)">${inner}</g>`;
}

/** Premium uncommon art with teal-blue radial gradient and arcane wisps. */
function uncommonBleed(id, top, bottom, inner) {
  const gid = `uc-${id}`;
  const vig = `uc-vig-${id}`;
  return `<defs>
    <radialGradient id="${gid}" cx="50%" cy="34%" r="78%">
      <stop offset="0%" stop-color="${top}"/>
      <stop offset="40%" stop-color="${bottom}"/>
      <stop offset="100%" stop-color="#061525" stop-opacity="0.96"/>
    </radialGradient>
    <radialGradient id="${vig}" cx="50%" cy="50%" r="58%">
      <stop offset="50%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.38"/>
    </radialGradient>
    <filter id="${gid}-glow" x="-25%" y="-25%" width="150%" height="150%">
      <feGaussianBlur stdDeviation="1" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="64" height="64" fill="url(#${gid})"/>
  <g opacity="0.5">${sparkles([[12, 10, 1], [52, 14, 1.2], [6, 36, 0.8], [58, 48, 1], [28, 8, 0.9], [44, 56, 0.7]], "#7dd3fc", 0.55)}</g>
  <path d="M8 20 C18 14 26 18 32 10 C38 18 46 14 56 20" stroke="#38bdf8" stroke-width="0.8" fill="none" opacity="0.18"/>
  <rect width="64" height="64" fill="url(#${vig})"/>
  <g filter="url(#${gid}-glow)">${inner}</g>`;
}

/** Premium rare art with violet radial gradient and constellation glow. */
function rareBleed(id, top, bottom, inner) {
  const gid = `ra-${id}`;
  const vig = `ra-vig-${id}`;
  return `<defs>
    <radialGradient id="${gid}" cx="50%" cy="32%" r="80%">
      <stop offset="0%" stop-color="${top}"/>
      <stop offset="38%" stop-color="${bottom}"/>
      <stop offset="100%" stop-color="#12061f" stop-opacity="0.97"/>
    </radialGradient>
    <radialGradient id="${vig}" cx="50%" cy="50%" r="58%">
      <stop offset="48%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.4"/>
    </radialGradient>
    <filter id="${gid}-glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="1.15" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="64" height="64" fill="url(#${gid})"/>
  <g opacity="0.55">${sparkles([[10, 8, 1.1], [54, 12, 1.3], [8, 50, 0.9], [56, 44, 1], [32, 4, 1.4], [20, 28, 0.8], [48, 30, 0.9]], "#e9d5ff", 0.6)}</g>
  <circle cx="32" cy="28" r="22" fill="none" stroke="#c4b5fd" stroke-width="0.6" opacity="0.15"/>
  <circle cx="32" cy="28" r="14" fill="none" stroke="#a78bfa" stroke-width="0.5" opacity="0.12"/>
  <rect width="64" height="64" fill="url(#${vig})"/>
  <g filter="url(#${gid}-glow)">${inner}</g>`;
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
      <ellipse cx="0" cy="8" rx="9" ry="3" fill="#000" opacity="0.2"/>
      <rect x="-7" y="-4" width="14" height="20" rx="2" fill="#9ca3af" stroke="#374151" stroke-width="1.2"/>
      <path d="M-8 -4 L0 -16 L8 -4 Z" fill="#6b7280" stroke="#374151" stroke-width="1.2"/>
      <path d="M0 -16 L0 -22" stroke="${plume}" stroke-width="4" stroke-linecap="round"/>
      <path d="M6 6 L16 -10" stroke="#cbd5e1" stroke-width="2.8" stroke-linecap="round"/>
      <path d="M6 6 L14 -8" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/>
    </g>`;
  };
  return `${groundShadow(32, 54, 20, 4)}
    ${knight(18, false, "#dc2626")}${knight(46, true, "#2563eb")}
    ${burst(32, 32, 8, "#fbbf24", "#b45309")}
    <path d="M24 28 L40 36 M40 28 L24 36" stroke="#fde68a" stroke-width="1.2" opacity="0.35"/>`;
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
  return `${groundShadow(28, 54, 16, 3.5)}
    ${allyPro(22, 44, 5.5)}
    <path d="M22 44 C16 34 18 22 28 16" stroke="#c4b5fd" stroke-width="2.2" fill="none" opacity="0.75"/>
    <circle cx="28" cy="16" r="4" fill="#e9d5ff" opacity="0.85"/>
    <circle cx="28" cy="16" r="7" fill="#a78bfa" opacity="0.15"/>
    <rect x="34" y="10" width="15" height="22" rx="2" fill="#4c1d95" stroke="#a78bfa" stroke-width="1.5" transform="rotate(10 41.5 21)"/>
    <rect x="43" y="14" width="15" height="22" rx="2" fill="#5b21b6" stroke="#c4b5fd" stroke-width="1.5" transform="rotate(-8 50.5 25)"/>
    <path d="M38 18 L44 18 M38 22 H46 M38 26 H44" stroke="#e9d5ff" stroke-width="1" opacity="0.6"/>
    <path d="M47 22 L53 22 M47 26 H55" stroke="#ddd6fe" stroke-width="1" opacity="0.5"/>
    <path d="M30 12 L36 8 M46 10 L52 6" stroke="#f0e6ff" stroke-width="1.2" stroke-linecap="round" opacity="0.45"/>
    <text x="38" y="50" font-size="7" fill="#e9d5ff" opacity="0.85" font-weight="700">+2</text>`;
}

/** Two enemies swapping places while frozen. */
function tangleMotif() {
  return `${groundShadow(32, 52, 20, 3.5)}
    ${tokenPro(20, 34, 5.5)}${tokenPro(44, 34, 5.5)}
    <path d="M26 34 C32 26 38 26 44 34" stroke="#fca5a5" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M38 34 C32 42 26 42 20 34" stroke="#93c5fd" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M38 28 L44 34 L40 38" stroke="#fca5a5" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M26 40 L20 34 L24 30" stroke="#93c5fd" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M14 18 L18 22 M50 18 L46 22" stroke="#bae6fd" stroke-width="1.6" stroke-linecap="round" opacity="0.7"/>
    <path d="M16 14 C20 10 24 12 18 18" stroke="#e0f2fe" stroke-width="1.2" fill="none" opacity="0.55"/>
    <path d="M48 14 C44 10 40 12 46 18" stroke="#e0f2fe" stroke-width="1.2" fill="none" opacity="0.55"/>
    <circle cx="16" cy="20" r="5" fill="#7dd3fc" opacity="0.12" stroke="#bae6fd" stroke-width="1"/>`;
}

/** Bishop diagonal slide paths from a piece. */
function bishopMarkMotif() {
  return `${groundShadow(32, 54, 16, 3)}
    ${allyPro(32, 48, 5.5)}
    <path d="M32 44 L12 24 M32 44 L52 24" stroke="#c4b5fd" stroke-width="2.6" fill="none" stroke-linecap="round" opacity="0.8"/>
    <path d="M16 28 L20 24 M48 28 L44 24" stroke="#e9d5ff" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
    ${runeGlow(42, 18, 4, "#e9d5ff")}
    <text x="38" y="22" font-size="14" fill="#f0e6ff" opacity="0.95">♗</text>
    <circle cx="18" cy="26" r="3" fill="#a78bfa" opacity="0.55"/>
    <circle cx="46" cy="26" r="3" fill="#a78bfa" opacity="0.55"/>`;
}

/** Rook rank and file slide paths from a piece. */
function rookMarkMotif() {
  return `${groundShadow(32, 54, 16, 3)}
    ${allyPro(32, 48, 5.5)}
    <path d="M32 44 V12 M32 44 H10 M32 44 H54" stroke="#c4b5fd" stroke-width="2.6" fill="none" stroke-linecap="round" opacity="0.8"/>
    <path d="M32 16 V8 M10 44 H6 M54 44 H58" stroke="#e9d5ff" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    ${runeGlow(42, 18, 4, "#e9d5ff")}
    <text x="38" y="22" font-size="14" fill="#f0e6ff" opacity="0.95">♜</text>
    <rect x="28" y="10" width="8" height="5" rx="1" fill="#a78bfa" opacity="0.42" stroke="#c4b5fd" stroke-width="0.8"/>`;
}

/** Enemy pulled forward along a diagonal. */
function callForwardMotif() {
  return `${groundShadow(30, 52, 18, 3.5)}
    ${tokenPro(44, 22, 5.5)}
    <circle cx="44" cy="22" r="10" fill="none" stroke="#fca5a5" stroke-width="1.6" opacity="0.5"/>
    <circle cx="44" cy="22" r="14" fill="#ef4444" opacity="0.08"/>
    <path d="M40 26 C32 32 26 36 20 40" stroke="#f87171" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M24 38 L20 40 L22 36" stroke="#f87171" stroke-width="2" fill="none" stroke-linecap="round"/>
    ${destRing(20, 40, 5, "#93c5fd")}
    <path d="M48 16 L52 12 M14 46 L10 50" stroke="#e9d5ff" stroke-width="1.3" stroke-linecap="round" opacity="0.45"/>
    <path d="M30 34 L36 28" stroke="#fde68a" stroke-width="1.4" stroke-dasharray="2 2" opacity="0.5"/>`;
}

/** Horizontal blizzard freezing a row of enemies. */
function blizzardMotif() {
  return `${groundShadow(32, 54, 24, 4)}
    <path d="M6 32 H58" stroke="#bae6fd" stroke-width="4" opacity="0.35"/>
    <path d="M6 32 H58" stroke="#e0f2fe" stroke-width="1.6" opacity="0.9"/>
    ${tokenPro(18, 32, 4)}${tokenPro(32, 32, 4)}${tokenPro(46, 32, 4)}
    <path d="M12 24 L16 28 M26 24 L30 28 M40 24 L44 28" stroke="#e0f2fe" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M14 22 L18 26 M28 22 L32 26 M42 22 L46 26" stroke="#7dd3fc" stroke-width="1.2" stroke-linecap="round" opacity="0.75"/>
    <path d="M46 14 L50 10 M52 18 L56 14 M10 18 L6 14" stroke="#e0f2fe" stroke-width="1.4" stroke-linecap="round" opacity="0.65"/>
    <circle cx="50" cy="12" r="6" fill="#7dd3fc" opacity="0.15"/>`;
}

/** Diagonal line of allies sharing a bulwark shield. */
function bulwarkMotif() {
  return `${groundShadow(32, 54, 20, 3.5)}
    ${allyPro(16, 46, 4.5)}${allyPro(32, 32, 5)}${allyPro(48, 18, 4.5)}
    <path d="M10 50 L54 14" stroke="#c4b5fd" stroke-width="2" opacity="0.4" stroke-dasharray="4 3"/>
    <path d="M26 26 L38 38 L26 46 L14 38 Z" fill="#7c3aed" opacity="0.42" stroke="#c4b5fd" stroke-width="1.8" transform="translate(6, 2)"/>
    <path d="M30 30 L34 34 M34 30 L30 34" stroke="#f0e6ff" stroke-width="1.6" stroke-linecap="round" opacity="0.65"/>
    <circle cx="32" cy="34" r="12" fill="#a78bfa" opacity="0.1"/>`;
}

/** Darkness void protecting pieces in a 7-square zone. */
function darknessMotif() {
  return `<circle cx="32" cy="32" r="22" fill="#1e1b4b" opacity="0.62" stroke="#6d28d9" stroke-width="1.8"/>
    <circle cx="32" cy="32" r="15" fill="#312e81" opacity="0.42"/>
    <circle cx="32" cy="32" r="8" fill="#4c1d95" opacity="0.25"/>
    ${allyPro(32, 32, 4)}${ally(24, 24, 3)}${ally(40, 24, 3)}${ally(24, 40, 3)}${ally(40, 40, 3)}
    <path d="M18 18 L46 46 M46 18 L18 46" stroke="#a78bfa" stroke-width="0.9" opacity="0.28"/>
    <circle cx="32" cy="32" r="22" fill="none" stroke="#c4b5fd" stroke-width="1.4" opacity="0.45"/>
    <circle cx="32" cy="32" r="26" fill="none" stroke="#7c3aed" stroke-width="0.6" opacity="0.2"/>`;
}

/** Piece fortified in rings, then shielded. */
function fortifyMotif() {
  return `${groundShadow(32, 56, 14, 3)}
    ${allyPro(32, 34, 6)}
    <circle cx="32" cy="34" r="13" fill="none" stroke="#a78bfa" stroke-width="2.2" opacity="0.7"/>
    <circle cx="32" cy="34" r="18" fill="none" stroke="#7c3aed" stroke-width="1.6" opacity="0.5"/>
    <circle cx="32" cy="34" r="23" fill="none" stroke="#6d28d9" stroke-width="1" opacity="0.3"/>
    <path d="M32 16 L32 22 M32 46 L32 52 M16 34 L22 34 M42 34 L48 34" stroke="#c4b5fd" stroke-width="1.8" stroke-linecap="round" opacity="0.55"/>
    ${shieldPro(32, 30, "#7c3aed", "#e9d5ff")}
    <text x="20" y="54" font-size="6" fill="#ddd6fe" opacity="0.7" font-weight="700">HOLD</text>`;
}

/** Sleeping piece awakening into a crowned bear-marked king. */
function hibernationMotif() {
  return `${groundShadow(32, 56, 14, 3)}
    ${allyPro(32, 38, 6)}
    <text x="18" y="18" font-size="9" fill="#c4b5fd" opacity="0.8" font-style="italic">zzz</text>
    <path d="M22 12 C28 8 36 8 42 12" stroke="#a78bfa" stroke-width="1.6" fill="none" opacity="0.5"/>
    <path d="M22 16 L26 10 L30 14 L32 6 L34 14 L38 10 L42 16 L42 22 H22 Z" fill="#fbbf24" opacity="0.82" stroke="#b45309" stroke-width="1.2"/>
    <circle cx="32" cy="52" r="4" fill="#fbbf24" opacity="0.4"/>
    <path d="M26 50 C30 46 34 46 38 50" stroke="#fde68a" stroke-width="1.8" fill="none" opacity="0.6"/>`;
}

/** Hidden vengeance trap with blood counters on a piece. */
function vengeanceMotif() {
  return `${groundShadow(30, 54, 16, 3.5)}
    ${allyPro(28, 36, 6)}
    <circle cx="46" cy="24" r="8" fill="none" stroke="#f87171" stroke-width="1.8" opacity="0.6"/>
    <circle cx="46" cy="24" r="11" fill="#ef4444" opacity="0.08"/>
    <path d="M34 32 L42 26" stroke="#fca5a5" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M16 50 L20 46 M18 52 L22 48" stroke="#dc2626" stroke-width="1.8" stroke-linecap="round" opacity="0.75"/>
    <circle cx="18" cy="50" r="2.2" fill="#ef4444" opacity="0.85"/>
    <circle cx="22" cy="48" r="2" fill="#ef4444" opacity="0.65"/>
    <path d="M12 16 L16 20 L12 24 L8 20 Z" fill="#4c1d95" opacity="0.55" stroke="#a78bfa" stroke-width="1.2"/>
    <text x="10" y="20" font-size="5" fill="#e9d5ff" opacity="0.6">?</text>
    <path d="M8 20 L14 26" stroke="#c4b5fd" stroke-width="1" stroke-dasharray="2 2" opacity="0.4"/>`;
}

/** Hex sanctuary shielding allies from capture. */
function sanctuaryMotif() {
  return `${groundShadow(32, 54, 18, 3.5)}
    <path d="M32 8 L50 18 V38 L32 50 L14 38 V18 Z" fill="#312e81" opacity="0.48" stroke="#a78bfa" stroke-width="1.8"/>
    <path d="M32 12 L46 20 V36 L32 46 L18 36 V20 Z" fill="none" stroke="#c4b5fd" stroke-width="0.8" opacity="0.35"/>
    ${allyPro(32, 30, 4)}${ally(24, 22, 3)}${ally(40, 22, 3)}${ally(24, 38, 3)}${ally(40, 38, 3)}
    <path d="M32 12 L34 22 H44 L36 28 L38 38 L32 32 L26 38 L28 28 L20 22 H30 Z" fill="#c4b5fd" opacity="0.5" stroke="#f0e6ff" stroke-width="0.9"/>`;
}

/** Two allies merging into one empowered piece. */
function fusionMotif() {
  return `${groundShadow(32, 54, 18, 3.5)}
    ${allyPro(18, 40, 4.5)}${allyPro(46, 40, 4.5)}
    <path d="M24 40 C28 32 36 32 40 40" stroke="#fde68a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M22 38 L30 30 M42 38 L34 30" stroke="#fbbf24" stroke-width="1.4" opacity="0.45"/>
    <circle cx="32" cy="26" r="8" fill="#2563eb" stroke="#93c5fd" stroke-width="2.2" opacity="0.9"/>
    <ellipse cx="32" cy="24" rx="5" ry="3" fill="#93c5fd" opacity="0.35"/>
    <path d="M28 20 L32 14 L36 20" stroke="#fbbf24" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M26 30 H38 M32 24 V32" stroke="#e9d5ff" stroke-width="1.5" opacity="0.5"/>`;
}

/** Chameleon copying multiple movement patterns. */
function chameleonMotif() {
  return `${groundShadow(32, 54, 16, 3)}
    ${allyPro(32, 34, 6)}
    <ellipse cx="32" cy="20" rx="10" ry="6" fill="#a78bfa" opacity="0.28"/>
    <path d="M12 20 L32 34 L52 20" stroke="#86efac" stroke-width="2" fill="none" opacity="0.6"/>
    <path d="M32 8 L32 34 M12 48 L32 34 L52 48" stroke="#93c5fd" stroke-width="2" fill="none" opacity="0.6"/>
    <path d="M16 16 L32 34 L48 48" stroke="#fca5a5" stroke-width="1.6" fill="none" opacity="0.45" stroke-dasharray="3 2"/>
    <circle cx="12" cy="20" r="3.5" fill="#4ade80" opacity="0.6" stroke="#86efac" stroke-width="1"/>
    <circle cx="52" cy="20" r="3.5" fill="#60a5fa" opacity="0.6" stroke="#93c5fd" stroke-width="1"/>
    <circle cx="12" cy="48" r="3.5" fill="#f87171" opacity="0.5" stroke="#fca5a5" stroke-width="1"/>`;
}

/** Blindfold blocking opponent card play. */
function blindMotif() {
  return `${groundShadow(32, 54, 18, 3.5)}
    <path d="M14 28 C24 20 40 20 50 28 C40 36 24 36 14 28 Z" fill="#312e81" opacity="0.72" stroke="#a78bfa" stroke-width="1.8"/>
    <path d="M20 28 H44" stroke="#1e1b4b" stroke-width="2.8"/>
    <path d="M18 26 C26 24 38 24 46 26" stroke="#c4b5fd" stroke-width="1" fill="none" opacity="0.4"/>
    <rect x="36" y="10" width="17" height="24" rx="2" fill="#4c1d95" stroke="#c4b5fd" stroke-width="1.4" transform="rotate(12 44.5 22)"/>
    <path d="M38 16 L52 30 M52 16 L38 30" stroke="#f87171" stroke-width="2.6" stroke-linecap="round"/>
    <circle cx="46" cy="24" r="9" fill="none" stroke="#fca5a5" stroke-width="1.4" opacity="0.5"/>
    <circle cx="46" cy="24" r="12" fill="#ef4444" opacity="0.06"/>`;
}

/** Trickster chaos — pieces scattered with crossing swap trails. */
function tricksterMotif() {
  return `${groundShadow(32, 54, 22, 4)}
    ${allyPro(14, 18, 3.5)}${tokenPro(50, 18, 3.5)}${allyPro(14, 48, 3.5)}${tokenPro(50, 48, 3.5)}
    <path d="M18 18 L46 46 M50 18 L18 46" stroke="#c4b5fd" stroke-width="2" opacity="0.6"/>
    <path d="M18 18 L50 18 M14 48 L50 48 M18 18 L18 48 M50 18 L50 48" stroke="#a78bfa" stroke-width="1.1" opacity="0.32" stroke-dasharray="3 2"/>
    ${runeGlow(32, 32, 5, "#fde68a")}
    <text x="28" y="36" font-size="11" fill="#fde68a" opacity="0.9">✦</text>
    <path d="M22 22 L42 38 M42 22 L22 38" stroke="#e9d5ff" stroke-width="1.3" opacity="0.45"/>`;
}

/* ── Common spell motifs ── */

function nudgeMotif() {
  return `${groundShadow(28, 54, 16, 3.5)}
    ${allyPro(18, 44, 5.5)}
    ${destRing(40, 26, 6, "#cbd5e1")}
    ${motionArrow(24, 40, 36, 30, "#e2e8f0", 2.8)}
    <path d="M20 38 C24 34 28 32 32 30" stroke="#94a3b8" stroke-width="1.4" fill="none" opacity="0.35"/>
    <path d="M14 20 L18 16 M46 14 L50 10" stroke="#cbd5e1" stroke-width="1.2" stroke-linecap="round" opacity="0.4"/>`;
}

function backstepMotif() {
  return `${groundShadow(32, 54, 14, 3.5)}
    ${allyPro(32, 22, 5.5)}
    ${destRing(32, 46, 6, "#cbd5e1")}
    ${motionArrow(32, 28, 32, 40, "#e2e8f0", 2.8)}
    <path d="M26 34 C28 38 30 40 32 42" stroke="#94a3b8" stroke-width="1.4" fill="none" opacity="0.35"/>
    <ellipse cx="32" cy="48" rx="8" ry="3" fill="#64748b" opacity="0.2"/>`;
}

function retreatMotif() {
  return `${groundShadow(32, 54, 14, 3.5)}
    ${allyPro(32, 28, 5.5)}
    ${motionArrow(32, 34, 32, 50, "#93c5fd", 2.8)}
    <path d="M24 46 L32 52 L40 46" stroke="#60a5fa" stroke-width="1.6" fill="none" opacity="0.45"/>
    <text x="42" y="48" font-size="8" fill="#cbd5e1" opacity="0.9" font-weight="700">×3</text>
    <circle cx="32" cy="40" r="10" fill="none" stroke="#93c5fd" stroke-width="1" opacity="0.25"/>`;
}

function anchorMotif() {
  return `${groundShadow(32, 54, 18, 3.5)}
    ${allyPro(22, 36, 4.5)}${allyPro(42, 36, 4.5)}
    <path d="M32 10 V26 M32 26 C32 34 24 36 24 42 C24 48 32 50 32 50 C32 50 40 48 40 42 C40 36 32 34 32 26 Z" fill="#94a3b8" opacity="0.72" stroke="#e2e8f0" stroke-width="1.6"/>
    <path d="M28 30 L36 30 M30 38 L34 38" stroke="#cbd5e1" stroke-width="1.2" opacity="0.45"/>
    <path d="M18 36 L26 36 M38 36 L46 36" stroke="#64748b" stroke-width="1.4" stroke-dasharray="2 2" opacity="0.35"/>`;
}

function recallMotif() {
  return `${groundShadow(32, 54, 20, 4)}
    ${allyPro(32, 26, 5.5)}
    ${motionArrow(32, 32, 32, 44, "#93c5fd", 2.4)}
    <path d="M8 50 H56" stroke="#64748b" stroke-width="2.2" opacity="0.55"/>
    <rect x="10" y="48" width="44" height="6" rx="1" fill="#475569" opacity="0.45" stroke="#64748b" stroke-width="0.8"/>
    <path d="M14 46 L18 42 M50 46 L46 42" stroke="#94a3b8" stroke-width="1.2" stroke-linecap="round" opacity="0.4"/>
    <text x="16" y="47" font-size="5" fill="#cbd5e1" opacity="0.75" font-weight="600">BACK ROW</text>`;
}

function repelMotif() {
  return `${groundShadow(30, 54, 18, 3.5)}
    ${allyPro(22, 36, 5)}${tokenPro(38, 36, 5)}
    ${destRing(52, 36, 5, "#fca5a5")}
    ${motionArrow(28, 36, 48, 36, "#fde68a", 2.6)}
    <path d="M34 32 L42 32" stroke="#fbbf24" stroke-width="1.4" opacity="0.45"/>`;
}

function leapfrogMotif() {
  return `${groundShadow(28, 54, 18, 3.5)}
    ${allyPro(14, 48, 4.5)}${ally(28, 34, 4)}
    ${destRing(44, 20, 5, "#cbd5e1")}
    ${energyArc(18, 44, 42, 24, "#93c5fd", 2.4)}
    <path d="M40 26 L44 22 M40 26 L44 30" stroke="#93c5fd" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <ellipse cx="28" cy="36" rx="6" ry="3" fill="#1e3a8a" opacity="0.25"/>`;
}

function randomTeleportMotif() {
  return `${groundShadow(32, 54, 16, 3.5)}
    ${allyPro(32, 40, 5.5)}
    <path d="M14 16 Q32 4 50 16 Q42 32 32 26 Q22 32 14 16" stroke="#c4b5fd" stroke-width="2" fill="#7c3aed" fill-opacity="0.12" opacity="0.65" stroke-dasharray="3 2"/>
    ${destRing(26, 18, 4, "#93c5fd")}
    <text x="40" y="20" font-size="12" fill="#fde68a" opacity="0.92" font-weight="700">?</text>
    <path d="M20 12 L24 8 M44 10 L48 6" stroke="#e9d5ff" stroke-width="1.2" stroke-linecap="round" opacity="0.45"/>`;
}

function rallyMotif() {
  return `${groundShadow(32, 54, 20, 4)}
    ${allyPro(32, 32, 6)}${allyPro(16, 46, 3.5)}${allyPro(48, 46, 3.5)}
    <circle cx="32" cy="32" r="20" fill="none" stroke="#93c5fd" stroke-width="1.8" opacity="0.45"/>
    <circle cx="32" cy="32" r="14" fill="#2563eb" opacity="0.08"/>
    <path d="M16 46 L24 38 M48 46 L40 38" stroke="#60a5fa" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
    <path d="M32 14 L34 20 H40 L35 24 L37 30 L32 26 L27 30 L29 24 L24 20 H30 Z" fill="#60a5fa" opacity="0.2" stroke="#93c5fd" stroke-width="0.8"/>`;
}

function ignoreMotif() {
  return `${groundShadow(32, 54, 14, 3.5)}
    ${allyPro(32, 36, 6)}
    <circle cx="18" cy="22" r="10" fill="#ef4444" opacity="0.1" stroke="#f87171" stroke-width="1.4"/>
    <path d="M14 18 L22 26 M22 18 L14 26" stroke="#f87171" stroke-width="2.8" stroke-linecap="round"/>
    <text x="36" y="20" font-size="7" fill="#cbd5e1" opacity="0.85" font-weight="700">SKIP</text>
    <path d="M28 30 L36 30" stroke="#94a3b8" stroke-width="1.4" stroke-dasharray="2 2" opacity="0.4"/>`;
}

function ironWillMotif() {
  return `${groundShadow(32, 54, 16, 3.5)}
    ${allyPro(32, 34, 6)}
    <path d="M14 20 C22 34 18 48 32 48 C46 48 42 34 50 20" stroke="#94a3b8" stroke-width="2.4" fill="none"/>
    <path d="M18 28 L26 36 M46 28 L38 36" stroke="#e2e8f0" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M20 30 L24 34 M44 30 L40 34" stroke="#64748b" stroke-width="1.4" stroke-linecap="round" opacity="0.45"/>
    <circle cx="32" cy="34" r="12" fill="none" stroke="#cbd5e1" stroke-width="0.8" opacity="0.25"/>`;
}

function demoteMotif() {
  return `${groundShadow(32, 54, 14, 3.5)}
    ${tokenPro(32, 38, 6)}
    <path d="M20 14 L24 4 L28 10 L32 2 L36 10 L40 4 L44 14 L44 20 H20 Z" fill="#fbbf24" opacity="0.65" stroke="#b45309" stroke-width="1.2"/>
    <path d="M22 16 L40 34 M40 16 L22 34" stroke="#fca5a5" stroke-width="2.4" opacity="0.8"/>
    <path d="M28 8 L32 12 L36 8" stroke="#fde68a" stroke-width="1.2" fill="none" opacity="0.5"/>`;
}

function quicksandMotif() {
  return `${groundShadow(32, 54, 16, 3.5)}
    ${trapTile(32, 36, 30)}
    <path d="M18 44 C26 36 38 36 46 44 C38 52 26 52 18 44 Z" fill="#a8a29e" opacity="0.55"/>
    <path d="M22 40 C28 36 36 36 42 40" stroke="#d6d3d1" stroke-width="1.4" fill="none" opacity="0.45"/>
    <path d="M24 46 C30 42 34 42 40 46" stroke="#78716c" stroke-width="1.2" fill="none" opacity="0.35"/>
    <text x="38" y="18" font-size="8" fill="#d6d3d1" opacity="0.65" font-weight="700">?</text>`;
}

function createFoeMotif() {
  return `${groundShadow(32, 54, 14, 3.5)}
    <rect x="18" y="20" width="28" height="28" rx="2" fill="#292524" opacity="0.42" stroke="#57534e" stroke-width="1.4"/>
    <path d="M20 22 H44 M20 46 H44 M20 22 V46 M44 22 V46" stroke="#78716c" stroke-width="0.6" opacity="0.25"/>
    ${tokenPro(32, 34, 6)}
    <path d="M38 16 L44 10 M40 20 L46 14" stroke="#fca5a5" stroke-width="1.6" stroke-linecap="round" opacity="0.65"/>
    <text x="40" y="18" font-size="10" fill="#fca5a5" opacity="0.9" font-weight="700">+</text>`;
}

function barrierMotif() {
  return `${groundShadow(32, 54, 14, 3.5)}
    <rect x="20" y="16" width="24" height="32" rx="2" fill="#334155" opacity="0.38" stroke="#64748b" stroke-width="1.4"/>
    <path d="M24 18 V46 M40 18 V46" stroke="#cbd5e1" stroke-width="3.2" opacity="0.85"/>
    <path d="M22 24 H42 M22 32 H42 M22 40 H42" stroke="#94a3b8" stroke-width="1" opacity="0.4"/>
    <path d="M26 20 L30 24 L26 28 M38 20 L34 24 L38 28" stroke="#e2e8f0" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/>`;
}

function panicMotif() {
  return `${groundShadow(32, 54, 14, 3.5)}
    ${tokenPro(32, 24, 6)}
    <path d="M26 16 L30 12 M38 16 L34 12" stroke="#fca5a5" stroke-width="1.6" stroke-linecap="round" opacity="0.65"/>
    ${motionArrow(32, 32, 32, 48, "#fca5a5", 2.8)}
    <path d="M26 48 L32 42 L38 48" stroke="#fca5a5" stroke-width="2" fill="none" stroke-linecap="round"/>
    <circle cx="32" cy="30" r="10" fill="#ef4444" opacity="0.08"/>`;
}

function shadowSwapMotif() {
  return `${groundShadow(32, 54, 18, 3.5)}
    ${allyPro(18, 34, 5.5)}${allyPro(46, 34, 5.5)}
    <path d="M24 34 L40 34" stroke="#93c5fd" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M40 30 L24 30" stroke="#c4b5fd" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M32 24 L32 44" stroke="#fde68a" stroke-width="1.6" stroke-dasharray="2 2" opacity="0.55"/>
    <circle cx="32" cy="34" r="6" fill="#a78bfa" opacity="0.12"/>`;
}

function sidestepMotif() {
  return `${groundShadow(28, 54, 16, 3.5)}
    ${allyPro(14, 34, 5.5)}
    ${destRing(48, 34, 6, "#cbd5e1")}
    ${motionArrow(20, 34, 42, 34, "#e2e8f0", 2.8)}
    <path d="M24 30 L28 34 L24 38" stroke="#94a3b8" stroke-width="1.4" fill="none" opacity="0.35"/>
    <text x="30" y="20" font-size="6" fill="#cbd5e1" opacity="0.6">×2</text>`;
}

function pressMotif() {
  return `${groundShadow(32, 54, 16, 3.5)}
    ${tokenPro(32, 30, 6)}
    ${motionArrow(32, 38, 32, 52, "#fca5a5", 2.8)}
    <path d="M32 52 L28 46 M32 52 L36 46" stroke="#fca5a5" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M22 52 H42" stroke="#64748b" stroke-width="1.6" opacity="0.5"/>
    <path d="M26 46 L30 50 L34 46 L38 50" stroke="#f87171" stroke-width="1.2" fill="none" opacity="0.4"/>`;
}

function wardMotif() {
  return `${groundShadow(32, 56, 14, 3)}
    ${allyPro(32, 38, 6)}
    ${shieldPro(32, 32, "#60a5fa", "#93c5fd")}
    <circle cx="32" cy="32" r="16" fill="none" stroke="#93c5fd" stroke-width="1" opacity="0.3"/>`;
}

function snowballMotif() {
  return `${groundShadow(32, 54, 16, 3.5)}
    ${allyPro(32, 36, 6)}
    <circle cx="18" cy="20" r="8" fill="#e0f2fe" opacity="0.5" stroke="#7dd3fc" stroke-width="1.6"/>
    <path d="M14 16 L22 24 M22 16 L14 24" stroke="#bae6fd" stroke-width="1.2" stroke-linecap="round" opacity="0.55"/>
    <path d="M20 26 L30 32" stroke="#bae6fd" stroke-width="1.8" stroke-dasharray="2 2" opacity="0.6"/>
    <path d="M16 12 L18 8 M20 14 L24 10" stroke="#e0f2fe" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/>`;
}

/* ── Uncommon spell motifs ── */

function longStepMotif() {
  return `${groundShadow(30, 54, 18, 3.5)}
    ${allyPro(16, 48, 5.5)}
    ${destRing(48, 16, 6, "#7dd3fc")}
    ${motionArrow(20, 44, 44, 20, "#bae6fd", 2.8)}
    <path d="M24 40 L30 34 L36 28" stroke="#38bdf8" stroke-width="1.4" fill="none" opacity="0.35" stroke-dasharray="2 2"/>`;
}

function aegisMotif() {
  return `${groundShadow(32, 56, 14, 3)}
    ${allyPro(32, 38, 6)}
    ${shieldPro(32, 30, "#38bdf8", "#7dd3fc")}
    <circle cx="32" cy="36" r="18" fill="none" stroke="#bae6fd" stroke-width="1.6" opacity="0.5"/>
    <circle cx="32" cy="36" r="22" fill="none" stroke="#38bdf8" stroke-width="0.8" opacity="0.25"/>`;
}

function poisonMotif() {
  return `${groundShadow(32, 54, 14, 3.5)}
    ${tokenPro(32, 32, 6)}
    <circle cx="32" cy="18" r="10" fill="#86efac" opacity="0.15" stroke="#4ade80" stroke-width="1.2"/>
    <path d="M28 10 C30 14 34 14 36 10 M26 16 C32 20 38 16" stroke="#86efac" stroke-width="1.6" fill="none" opacity="0.7"/>
    <path d="M26 44 H38" stroke="#4ade80" stroke-width="2.4" opacity="0.6"/>
    <path d="M28 48 H36" stroke="#22c55e" stroke-width="1.6" opacity="0.4"/>
  <circle cx="32" cy="32" r="12" fill="none" stroke="#86efac" stroke-width="1" opacity="0.3"/>`;
}

function deflectMotif() {
  return `${groundShadow(26, 54, 14, 3.5)}
    ${allyPro(24, 38, 5.5)}
    <path d="M24 28 L30 22 V36 C30 42 24 46 24 46 C24 46 18 42 18 36 V24 Z" fill="#38bdf8" opacity="0.35" stroke="#7dd3fc" stroke-width="1.6"/>
    <path d="M32 26 L50 16" stroke="#fde68a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    ${token(50, 16, 4)}
    <path d="M34 28 L40 20" stroke="#fbbf24" stroke-width="1.8" opacity="0.7"/>
    <path d="M14 18 L18 22 L14 26 L10 22 Z" fill="#4c1d95" opacity="0.45" stroke="#a78bfa" stroke-width="1"/>
    <text x="12" y="52" font-size="6" fill="#cbd5e1" opacity="0.55" font-weight="600">TRAP</text>`;
}

function stabMotif() {
  return `${groundShadow(30, 54, 16, 3.5)}
    ${allyPro(22, 48, 4.5)}${tokenPro(42, 24, 5.5)}
    <path d="M26 44 L38 30" stroke="#fde68a" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M36 28 L42 20 L40 32 L48 28 Z" fill="#e2e8f0" stroke="#64748b" stroke-width="1.2"/>
    ${burst(40, 26, 5, "#ef4444", "#991b1b")}`;
}

function crownMotif() {
  return `${groundShadow(32, 56, 14, 3)}
    ${allyPro(32, 40, 6)}
    <path d="M20 18 L24 6 L28 12 L32 2 L36 12 L40 6 L44 18 L44 26 H20 Z" fill="#fbbf24" opacity="0.88" stroke="#b45309" stroke-width="1.4"/>
    <circle cx="32" cy="28" r="10" fill="#fbbf24" opacity="0.18"/>
    <path d="M24 14 L28 10 L32 14 L36 10 L40 14" stroke="#fde68a" stroke-width="1" fill="none" opacity="0.5"/>
    <circle cx="32" cy="8" r="3" fill="#fde68a" opacity="0.35"/>`;
}

function blinkMotif() {
  return `${groundShadow(30, 54, 18, 3.5)}
    ${allyPro(18, 46, 5)}${token(44, 18, 4.5)}
    <circle cx="44" cy="18" r="12" fill="#38bdf8" opacity="0.1" stroke="#7dd3fc" stroke-width="1.8" opacity="0.6"/>
    <path d="M24 42 L38 24" stroke="#bae6fd" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-dasharray="4 3"/>
    <circle cx="44" cy="18" r="3.5" fill="#38bdf8" opacity="0.75"/>
    <path d="M20 40 L16 44 M46 14 L50 10" stroke="#e0f2fe" stroke-width="1.2" stroke-linecap="round" opacity="0.45"/>`;
}

function landmineMotif() {
  return `${groundShadow(32, 54, 14, 3.5)}
    ${trapTile(32, 36, 30)}
    <circle cx="32" cy="36" r="6" fill="#dc2626" stroke="#7f1d1d" stroke-width="1.6"/>
    <ellipse cx="30" cy="34" rx="2" ry="1.5" fill="#fca5a5" opacity="0.4"/>
    <path d="M28 32 L36 40 M36 32 L28 40" stroke="#fca5a5" stroke-width="2"/>
    <path d="M32 28 L32 24 M28 30 L24 28 M36 30 L40 28" stroke="#ef4444" stroke-width="1.2" stroke-linecap="round" opacity="0.45"/>`;
}

function backpedalMotif() {
  return `${groundShadow(32, 54, 16, 3.5)}
    ${tokenPro(32, 22, 6)}
    ${motionArrow(32, 30, 32, 48, "#fca5a5", 2.8)}
    <path d="M22 50 H42" stroke="#64748b" stroke-width="2" opacity="0.5"/>
    <path d="M26 48 L32 42 L38 48" stroke="#fca5a5" stroke-width="1.8" fill="none" opacity="0.6"/>
    <rect x="20" y="50" width="24" height="4" rx="1" fill="#475569" opacity="0.35"/>`;
}

function rootMotif() {
  return `${groundShadow(32, 54, 14, 3.5)}
    ${tokenPro(32, 26, 6)}
    <path d="M20 44 C28 34 36 34 44 44 M22 50 C30 40 34 40 42 50" stroke="#86efac" stroke-width="2.2" fill="none" opacity="0.8"/>
    <path d="M26 46 L32 36 L38 46" stroke="#4ade80" stroke-width="1.6" fill="none" opacity="0.55"/>
    <path d="M28 42 L24 48 M36 42 L40 48" stroke="#22c55e" stroke-width="1.4" stroke-linecap="round" opacity="0.4"/>`;
}

function sacrificeMotif() {
  return `${groundShadow(30, 54, 18, 3.5)}
    <circle cx="18" cy="42" r="5.5" fill="#2563eb" opacity="0.25" stroke="#93c5fd" stroke-width="1.4" stroke-dasharray="3 2"/>
    ${tokenPro(46, 24, 6)}
    <path d="M24 38 L42 28" stroke="#fde68a" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M44 20 L50 26 M44 28 L50 22 M40 24 L50 24 M44 20 L44 30" stroke="#ef4444" stroke-width="2.2" stroke-linecap="round"/>
    <circle cx="18" cy="42" r="8" fill="#dc2626" opacity="0.08"/>`;
}

function scatterMotif() {
  return `${groundShadow(32, 54, 16, 3.5)}
    <rect x="28" y="28" width="8" height="8" rx="1" fill="#475569" opacity="0.5" stroke="#94a3b8" stroke-width="1.2"/>
    ${allyPro(32, 14, 3)}${tokenPro(50, 32, 3)}${allyPro(32, 50, 3)}${tokenPro(14, 32, 3)}
    <path d="M32 24 L32 16" stroke="#bae6fd" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M36 32 L48 32" stroke="#bae6fd" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M32 36 L32 46" stroke="#bae6fd" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M28 32 L16 32" stroke="#bae6fd" stroke-width="2" fill="none" stroke-linecap="round"/>
    <circle cx="32" cy="32" r="14" fill="none" stroke="#7dd3fc" stroke-width="0.8" opacity="0.25"/>`;
}

function displacementMotif() {
  return `${groundShadow(26, 54, 18, 3.5)}
    ${allyPro(14, 42, 4.5)}${allyPro(32, 42, 4.5)}
    <path d="M18 38 L12 26" stroke="#93c5fd" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M36 38 L42 26" stroke="#93c5fd" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    ${destRing(12, 26, 4, "#7dd3fc")}${destRing(42, 26, 4, "#7dd3fc")}
    <path d="M20 36 L28 36" stroke="#60a5fa" stroke-width="1.4" opacity="0.35"/>`;
}

function sanctuaryPulseMotif() {
  return `${groundShadow(32, 54, 22, 4)}
    <path d="M6 44 H58" stroke="#64748b" stroke-width="2.4" opacity="0.55"/>
    <rect x="8" y="42" width="48" height="5" rx="1" fill="#475569" opacity="0.35"/>
    ${allyPro(14, 44, 3.5)}${allyPro(28, 44, 3.5)}${allyPro(42, 44, 3.5)}
    <path d="M24 34 L28 38 L24 42 L20 38 Z" fill="#38bdf8" opacity="0.5" stroke="#7dd3fc" stroke-width="1.4" transform="translate(4, 0)"/>
    <circle cx="32" cy="38" r="12" fill="none" stroke="#7dd3fc" stroke-width="1" opacity="0.3"/>`;
}

function lastStandMotif() {
  return `${groundShadow(32, 56, 14, 3)}
    ${allyPro(32, 34, 6)}
    ${shieldPro(32, 28, "#38bdf8", "#7dd3fc")}
    <path d="M14 50 L28 36" stroke="#fde68a" stroke-width="2.4" opacity="0.6"/>
    <path d="M12 16 L16 20 L12 24 L8 20 Z" fill="#4c1d95" opacity="0.45" stroke="#a78bfa" stroke-width="1"/>
    <text x="10" y="18" font-size="6" fill="#e9d5ff" opacity="0.55">?</text>`;
}

function cryoBoltMotif() {
  return `${groundShadow(30, 54, 18, 3.5)}
    ${tokenPro(42, 22, 5.5)}${allyPro(20, 48, 4.5)}
    <path d="M24 44 L38 28" stroke="#e0f2fe" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M40 14 L46 22 L34 22 Z" fill="#7dd3fc" opacity="0.75" stroke="#bae6fd" stroke-width="1"/>
    <path d="M44 12 L48 8 M38 16 L34 12" stroke="#e0f2fe" stroke-width="1.4" stroke-linecap="round" opacity="0.65"/>
    <circle cx="42" cy="22" r="8" fill="#7dd3fc" opacity="0.12"/>`;
}

function collapseMotif() {
  return `${groundShadow(32, 54, 14, 3.5)}
    ${trapTile(32, 36, 30, false)}
    ${ally(32, 34, 4)}
    <path d="M20 44 L32 32 L44 44 M22 50 L42 50" stroke="#a8a29e" stroke-width="2.2" opacity="0.7" stroke-linecap="round"/>
    <path d="M26 30 L38 42 M38 30 L26 42" stroke="#78716c" stroke-width="1.6" opacity="0.5"/>
    <path d="M24 38 L28 42 M36 38 L40 42" stroke="#d6d3d1" stroke-width="1.2" stroke-linecap="round" opacity="0.4"/>`;
}

function lastKingMotif() {
  return `${groundShadow(32, 56, 14, 3)}
    ${allyPro(32, 38, 7)}
    <path d="M20 16 L24 4 L28 10 L32 0 L36 10 L40 4 L44 16 L44 24 H20 Z" fill="#fbbf24" opacity="0.85" stroke="#b45309" stroke-width="1.4"/>
    ${shieldPro(32, 34, "#38bdf8", "#7dd3fc")}
    <circle cx="32" cy="12" r="4" fill="#fde68a" opacity="0.3"/>`;
}

function snipeMotif() {
  return `${groundShadow(32, 54, 20, 4)}
    ${allyPro(16, 50, 4)}${tokenPro(50, 12, 5.5)}
    <path d="M20 46 L46 16" stroke="#fde68a" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <circle cx="50" cy="12" r="10" fill="none" stroke="#fca5a5" stroke-width="1.6" opacity="0.5"/>
    <circle cx="50" cy="12" r="6" fill="#ef4444" opacity="0.1"/>
    <path d="M44 18 L50 12 L48 22" stroke="#ef4444" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M18 44 L22 40 M46 18 L50 14" stroke="#fbbf24" stroke-width="1.2" stroke-linecap="round" opacity="0.45"/>`;
}

function dominionMotif() {
  return `${groundShadow(32, 54, 18, 3.5)}
    ${allyPro(20, 26, 4.5)}${allyPro(44, 26, 4.5)}
    <path d="M20 32 L20 50" stroke="#93c5fd" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M44 32 L44 50" stroke="#93c5fd" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M20 50 L16 44 M20 50 L24 44" stroke="#93c5fd" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M44 50 L40 44 M44 50 L48 44" stroke="#93c5fd" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M16 50 H48" stroke="#64748b" stroke-width="1.4" opacity="0.4"/>
    <circle cx="32" cy="40" r="14" fill="none" stroke="#60a5fa" stroke-width="0.8" opacity="0.2"/>`;
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
