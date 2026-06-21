/**
 * Per-effect SVG motifs for spell cards (70×60 viewBox, 7:6 width:height).
 * Each illustration depicts the card mechanic at a glance with cartoony detail.
 */

const VB_W = 70;
const VB_H = 60;
const ART_SX = VB_W / 64;
const ART_SY = VB_H / 64;

/** Scale 64×64 design coordinates into the 7:6 art canvas. */
function artScene(inner) {
  return `<g transform="scale(${ART_SX}, ${ART_SY})">${inner}</g>`;
}

function wrap(inner) {
  return `<g class="card-motif" opacity="0.98">${inner}</g>`;
}

function piece(x, y, r = 5, o = 0.88) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="currentColor" opacity="${o}" stroke="#0f172a" stroke-width="0.8"/>`;
}

function enemy(x, y, r = 5) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#dc2626" opacity="0.65" stroke="#450a0a" stroke-width="1.4"/>
    <ellipse cx="${x - r * 0.25}" cy="${y - r * 0.35}" rx="${r * 0.4}" ry="${r * 0.25}" fill="#fca5a5" opacity="0.35"/>
    <circle cx="${x}" cy="${y}" r="${r + 2}" fill="none" stroke="#f87171" stroke-width="1.2" opacity="0.45"/>`;
}

function ghost(x, y, r = 4) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="3 2" opacity="0.5"/>
    <ellipse cx="${x}" cy="${y + r * 0.5}" rx="${r * 0.8}" ry="${r * 0.3}" fill="currentColor" opacity="0.12"/>`;
}

function arrow(x1, y1, x2, y2, w = 2.2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;
  return `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="#0f172a" stroke-width="${w + 1.2}" fill="none" stroke-linecap="round" opacity="0.35"/>
    <path d="M${x1} ${y1} L${x2} ${y2}" stroke="currentColor" stroke-width="${w}" fill="none" stroke-linecap="round"/>
    <path d="M${x2} ${y2} L${x2 - ux * 6 + px * 3.5} ${y2 - uy * 6 + py * 3.5} M${x2} ${y2} L${x2 - ux * 6 - px * 3.5} ${y2 - uy * 6 - py * 3.5}" stroke="currentColor" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
}

function arcJump(x1, y1, xm, ym, x2, y2) {
  return `<path d="M${x1} ${y1} Q${xm} ${ym - 10} ${x2} ${y2}" stroke="#0f172a" stroke-width="3.2" fill="none" stroke-linecap="round" opacity="0.3"/>
    <path d="M${x1} ${y1} Q${xm} ${ym - 10} ${x2} ${y2}" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    ${arrow(x2 - 4, y2 + 2, x2, y2, 1.8)}`;
}

function shield(x, y, s = 1) {
  return `<path d="M${x} ${y - 10 * s} L${x + 9 * s} ${y - 4 * s} L${x + 9 * s} ${y + 6 * s} C${x + 9 * s} ${y + 14 * s} ${x} ${y + 18 * s} ${x} ${y + 18 * s} C${x} ${y + 18 * s} ${x - 9 * s} ${y + 14 * s} ${x - 9 * s} ${y + 6 * s} L${x - 9 * s} ${y - 4 * s} Z" fill="currentColor" opacity="0.32" stroke="#0f172a" stroke-width="1.8"/>`;
}

function crown(x, y) {
  return `<path d="M${x - 10} ${y + 4} L${x - 6} ${y - 6} L${x - 2} ${y + 1} L${x + 2} ${y - 8} L${x + 6} ${y + 1} L${x + 10} ${y - 6} L${x + 10} ${y + 6} H${x - 10} Z" fill="#fbbf24" opacity="0.9" stroke="#92400e" stroke-width="1.4"/>
    <circle cx="${x - 6}" cy="${y - 4}" r="1.5" fill="#fde68a"/><circle cx="${x + 2}" cy="${y - 6}" r="1.5" fill="#fde68a"/><circle cx="${x + 8}" cy="${y - 4}" r="1.5" fill="#fde68a"/>`;
}

function square(x, y, w = 10, o = 0.35) {
  return `<rect x="${x - w / 2}" y="${y - w / 2}" width="${w}" height="${w}" rx="1.5" fill="currentColor" opacity="${o}" stroke="#0f172a" stroke-width="1.4"/>`;
}

function bolt(x1, y1, x2, y2) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return `<path d="M${x1} ${y1} L${mx + 3} ${my - 2} L${mx - 2} ${my + 4} L${x2} ${y2}" stroke="#0f172a" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.35"/>
    <path d="M${x1} ${y1} L${mx + 3} ${my - 2} L${mx - 2} ${my + 4} L${x2} ${y2}" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function column(x, y1, y2) {
  return `<rect x="${x - 4}" y="${y1}" width="8" height="${y2 - y1}" rx="2" fill="currentColor" opacity="0.22" stroke="#0f172a" stroke-width="1.6"/>`;
}

function xMark(x, y, s = 6) {
  return `<path d="M${x - s} ${y - s} L${x + s} ${y + s} M${x + s} ${y - s} L${x - s} ${y + s}" stroke="#0f172a" stroke-width="3.6" stroke-linecap="round" opacity="0.4"/>
    <path d="M${x - s} ${y - s} L${x + s} ${y + s} M${x + s} ${y - s} L${x - s} ${y + s}" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>`;
}

function ring(x, y, r) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="currentColor" stroke-width="1.8" opacity="0.6"/>`;
}

/** Cartoon red enemy checker disc. */
function token(x, y, r = 5) {
  return `<ellipse cx="${x}" cy="${y + r * 0.55}" rx="${r * 1.1}" ry="${r * 0.35}" fill="#000" opacity="0.28"/>
    <circle cx="${x}" cy="${y}" r="${r}" fill="#b91c1c" stroke="#450a0a" stroke-width="1.8"/>
    <circle cx="${x}" cy="${y}" r="${r * 0.82}" fill="#dc2626"/>
  <ellipse cx="${x - r * 0.28}" cy="${y - r * 0.32}" rx="${r * 0.42}" ry="${r * 0.28}" fill="#fca5a5" opacity="0.55"/>
    <path d="M${x - r * 0.35} ${y + r * 0.15} Q${x} ${y + r * 0.45} ${x + r * 0.35} ${y + r * 0.15}" fill="none" stroke="#7f1d1d" stroke-width="1.2" opacity="0.5"/>`;
}

/** Multi-layer cartoon burst / impact star. */
function burst(x, y, s = 8, fill = "#fbbf24", stroke = "#b45309") {
  const pts = [];
  for (let i = 0; i < 8; i++) {
    const outer = (i * Math.PI) / 4 - Math.PI / 2;
    const inner = outer + Math.PI / 8;
    pts.push([x + Math.cos(outer) * s, y + Math.sin(outer) * s]);
    pts.push([x + Math.cos(inner) * s * 0.45, y + Math.sin(inner) * s * 0.45]);
  }
  const d = pts.map(([px, py], i) => `${i === 0 ? "M" : "L"}${px.toFixed(1)} ${py.toFixed(1)}`).join(" ") + " Z";
  return `<circle cx="${x}" cy="${y}" r="${s * 0.55}" fill="${fill}" opacity="0.35"/>
    <path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="1.4" stroke-linejoin="round"/>
    <circle cx="${x - s * 0.2}" cy="${y - s * 0.2}" r="${s * 0.18}" fill="#fff" opacity="0.35"/>`;
}

function groundShadow(cx = 32, cy = 56, rx = 18, ry = 4) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx + 2}" ry="${ry + 1}" fill="#000" opacity="0.12"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#000" opacity="0.32"/>`;
}

function sparkles(pts, color = "#e2e8f0", opacity = 0.55) {
  return pts.map(([px, py, r = 1]) => {
    const s = r * 2.2;
    return `<path d="M${px} ${py - s} L${px + s * 0.3} ${py - s * 0.3} L${px + s} ${py} L${px + s * 0.3} ${py + s * 0.3} L${px} ${py + s} L${px - s * 0.3} ${py + s * 0.3} L${px - s} ${py} L${px - s * 0.3} ${py - s * 0.3} Z" fill="${color}" opacity="${opacity}"/>`;
  }).join("");
}

function allyPro(x, y, r = 5.5) {
  return `${ally(x, y, r)}
    <ellipse cx="${x - r * 0.22}" cy="${y - r * 0.34}" rx="${r * 0.48}" ry="${r * 0.32}" fill="#bfdbfe" opacity="0.65"/>
    <circle cx="${x}" cy="${y}" r="${r + 2.8}" fill="none" stroke="#60a5fa" stroke-width="1.1" opacity="0.28"/>
    <circle cx="${x}" cy="${y}" r="${r + 4.5}" fill="none" stroke="#93c5fd" stroke-width="0.7" opacity="0.15"/>`;
}

function tokenPro(x, y, r = 5.5) {
  return `${token(x, y, r)}
    <circle cx="${x}" cy="${y}" r="${r + 2.5}" fill="none" stroke="#f87171" stroke-width="1" opacity="0.28"/>
    <path d="M${x - 2} ${y - 1} L${x} ${y - 3} L${x + 2} ${y - 1}" stroke="#450a0a" stroke-width="1" fill="none" opacity="0.45"/>`;
}

function destRing(x, y, r = 6, color = "#cbd5e1") {
  return `<circle cx="${x}" cy="${y}" r="${r + 4}" fill="${color}" opacity="0.06"/>
    <circle cx="${x}" cy="${y}" r="${r + 1}" fill="none" stroke="${color}" stroke-width="2" stroke-dasharray="4 2" opacity="0.55"/>
    <circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${color}" stroke-width="1.6" opacity="0.82"/>
    <circle cx="${x}" cy="${y}" r="2.2" fill="${color}" opacity="0.5"/>`;
}

function motionArrow(x1, y1, x2, y2, color = "#e2e8f0", w = 2.6) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;
  return `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="#0f172a" stroke-width="${w + 2}" fill="none" stroke-linecap="round" opacity="0.28"/>
    <path d="M${x1} ${y1} L${x2} ${y2}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round"/>
    <path d="M${x2} ${y2} L${x2 - ux * 7 + px * 4} ${y2 - uy * 7 + py * 4} M${x2} ${y2} L${x2 - ux * 7 - px * 4} ${y2 - uy * 7 - py * 4}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
}

function energyArc(x1, y1, x2, y2, color = "#93c5fd", w = 2) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - 8;
  return `<path d="M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}" stroke="#0f172a" stroke-width="${w + 2.4}" fill="none" opacity="0.22"/>
    <path d="M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}" stroke="${color}" stroke-width="${w + 1}" fill="none" opacity="0.28"/>
    <path d="M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
}

function shieldPro(x, y, fill = "#60a5fa", stroke = "#93c5fd", filterId = "") {
  const filt = filterId ? ` filter="url(#${filterId})"` : "";
  return `<path d="M${x} ${y - 14} L${x + 11} ${y - 6} L${x + 11} ${y + 8} C${x + 11} ${y + 16} ${x} ${y + 22} ${x} ${y + 22} C${x} ${y + 22} ${x - 11} ${y + 16} ${x - 11} ${y + 8} L${x - 11} ${y - 6} Z" fill="${fill}" opacity="0.48" stroke="#0f172a" stroke-width="2.2"${filt}/>
    <path d="M${x} ${y - 14} L${x + 11} ${y - 6} L${x + 11} ${y + 8} C${x + 11} ${y + 16} ${x} ${y + 22} ${x} ${y + 22} C${x} ${y + 22} ${x - 11} ${y + 16} ${x - 11} ${y + 8} L${x - 11} ${y - 6} Z" fill="none" stroke="${stroke}" stroke-width="1.6"/>
    <path d="M${x} ${y - 10} L${x + 6} ${y - 5} L${x + 6} ${y + 4} C${x + 6} ${y + 9} ${x} ${y + 13} ${x} ${y + 13} C${x} ${y + 13} ${x - 6} ${y + 9} ${x - 6} ${y + 4} L${x - 6} ${y - 5} Z" fill="${stroke}" opacity="0.32"/>
    <path d="M${x - 2} ${y - 8} L${x + 3} ${y - 3}" stroke="#fff" stroke-width="1.2" opacity="0.35" stroke-linecap="round"/>`;
}

function trapTile(x, y, w = 28, hidden = true) {
  return `<rect x="${x - w / 2}" y="${y - w / 2}" width="${w}" height="${w}" rx="3" fill="#1c1917" opacity="0.65" stroke="#57534e" stroke-width="1.6"/>
    <rect x="${x - w / 2 + 3}" y="${y - w / 2 + 3}" width="${w - 6}" height="${w - 6}" rx="2" fill="#292524" opacity="0.5"/>
    ${hidden ? `<path d="M${x - 7} ${y - 7} L${x + 7} ${y + 7} M${x + 7} ${y - 7} L${x - 7} ${y + 7}" stroke="#a8a29e" stroke-width="1.4" opacity="0.4"/>` : ""}
    <rect x="${x - w / 2 + 2}" y="${y - w / 2 + 2}" width="${w - 4}" height="${w - 4}" rx="1" fill="none" stroke="#78716c" stroke-width="0.9" opacity="0.35"/>`;
}

function runeGlow(x, y, s = 5, color = "#c4b5fd") {
  return `<circle cx="${x}" cy="${y}" r="${s + 5}" fill="${color}" opacity="0.1"/>
    <circle cx="${x}" cy="${y}" r="${s + 2}" fill="none" stroke="${color}" stroke-width="0.8" opacity="0.35"/>
    <path d="M${x} ${y - s} L${x + s * 0.6} ${y - s * 0.2} L${x + s} ${y + s * 0.4} L${x + s * 0.3} ${y + s} L${x - s * 0.3} ${y + s} L${x - s} ${y + s * 0.4} L${x - s * 0.6} ${y - s * 0.2} Z" fill="none" stroke="${color}" stroke-width="1.4" opacity="0.72"/>`;
}

/** Full-bleed card art: solid background + illustration, no generic card overlay. */
function fullBleed(bg, inner) {
  return `<rect width="${VB_W}" height="${VB_H}" fill="${bg}"/>${artScene(inner)}`;
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
  <rect width="${VB_W}" height="${VB_H}" fill="url(#${gid})"/>
  ${artScene(inner)}`;
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
  <rect width="${VB_W}" height="${VB_H}" fill="url(#${gid})"/>
  <g opacity="0.38">${sparkles([[10, 12, 0.8], [54, 8, 1], [48, 52, 0.7], [8, 44, 0.9], [32, 6, 1.2], [58, 30, 0.6]], "#cbd5e1", 0.45)}</g>
  <rect width="${VB_W}" height="${VB_H}" fill="url(#${vig})"/>
  <g filter="url(#${gid}-glow)">${artScene(inner)}</g>`;
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
  <rect width="${VB_W}" height="${VB_H}" fill="url(#${gid})"/>
  <g opacity="0.5">${sparkles([[12, 10, 1], [52, 14, 1.2], [6, 36, 0.8], [58, 48, 1], [28, 8, 0.9], [44, 56, 0.7]], "#7dd3fc", 0.55)}</g>
  <path d="M8 20 C18 14 26 18 32 10 C38 18 46 14 56 20" stroke="#38bdf8" stroke-width="0.8" fill="none" opacity="0.18"/>
  <rect width="${VB_W}" height="${VB_H}" fill="url(#${vig})"/>
  <g filter="url(#${gid}-glow)">${artScene(inner)}</g>`;
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
  <rect width="${VB_W}" height="${VB_H}" fill="url(#${gid})"/>
  <g opacity="0.55">${sparkles([[10, 8, 1.1], [54, 12, 1.3], [8, 50, 0.9], [56, 44, 1], [32, 4, 1.4], [20, 28, 0.8], [48, 30, 0.9]], "#e9d5ff", 0.6)}</g>
  <circle cx="32" cy="28" r="22" fill="none" stroke="#c4b5fd" stroke-width="0.6" opacity="0.15"/>
  <circle cx="32" cy="28" r="14" fill="none" stroke="#a78bfa" stroke-width="0.5" opacity="0.12"/>
  <rect width="${VB_W}" height="${VB_H}" fill="url(#${vig})"/>
  <g filter="url(#${gid}-glow)">${artScene(inner)}</g>`;
}

/** Premium epic art with emerald radial gradient. */
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
  <rect width="${VB_W}" height="${VB_H}" fill="url(#${gid})"/>
  ${artScene(inner)}`;
}

/** Cartoon blue ally checker disc. */
function ally(x, y, r = 5) {
  return `<ellipse cx="${x}" cy="${y + r * 0.55}" rx="${r * 1.1}" ry="${r * 0.35}" fill="#000" opacity="0.28"/>
    <circle cx="${x}" cy="${y}" r="${r}" fill="#1d4ed8" stroke="#1e3a8a" stroke-width="1.8"/>
    <circle cx="${x}" cy="${y}" r="${r * 0.82}" fill="#2563eb"/>
    <ellipse cx="${x - r * 0.28}" cy="${y - r * 0.32}" rx="${r * 0.42}" ry="${r * 0.28}" fill="#93c5fd" opacity="0.55"/>
    <path d="M${x - r * 0.35} ${y + r * 0.15} Q${x} ${y + r * 0.45} ${x + r * 0.35} ${y + r * 0.15}" fill="none" stroke="#1e40af" stroke-width="1.2" opacity="0.45"/>`;
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
  "dash",
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
  return `${groundShadow(32, 54, 20, 4)}
    ${tokenPro(18, 52, 5.5)}${tokenPro(38, 52, 5.5)}
    <path d="M30 4 C28 12 26 22 28 32 L30 40" stroke="#0f172a" stroke-width="8" stroke-linecap="round" fill="none"/>
    <path d="M30 4 C28 12 26 22 28 32 L30 40" stroke="#4b5563" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path d="M28 12 C26 16 27 20 29 24" stroke="#6b7280" stroke-width="1.2" fill="none" opacity="0.5"/>
    <path d="M30 40 L28 54" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round"/>
    <path d="M30 40 L38 48 L32 50 L26 46 Z" fill="#f8fafc" stroke="#0f172a" stroke-width="1.6"/>
    <path d="M32 46 L40 52" stroke="#cbd5e1" stroke-width="2.5" stroke-linecap="round"/>
    ${burst(32, 48, 7, "#ef4444", "#991b1b")}
    <path d="M14 20 L18 16 M50 18 L54 14" stroke="#fca5a5" stroke-width="1.4" stroke-linecap="round" opacity="0.55"/>`;
}

/** Cartoon spherical bomb with lit fuse and fiery explosion. */
function bombMotif() {
  return `${groundShadow(32, 56, 20, 4)}
    <circle cx="32" cy="34" r="20" fill="#fbbf24" opacity="0.12"/>
    <circle cx="32" cy="34" r="18" fill="#0a0a0a" stroke="#000" stroke-width="2.4"/>
    <circle cx="32" cy="34" r="14.5" fill="#1a1a1a"/>
    <ellipse cx="26" cy="28" rx="6" ry="5" fill="#525252" opacity="0.45"/>
    <ellipse cx="36" cy="38" rx="3" ry="2" fill="#404040" opacity="0.35"/>
    <path d="M38 20 C44 14 48 8 46 2" stroke="#78716c" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M40 12 C42 10 44 8 43 4" stroke="#a8a29e" stroke-width="1.2" fill="none" opacity="0.6"/>
    <circle cx="46" cy="2" r="5" fill="#f97316" stroke="#c2410c" stroke-width="1.4"/>
    <circle cx="46" cy="2" r="3" fill="#fde047" opacity="0.85"/>
    <path d="M47 -1 L51 -3 M45 1 L41 -1 M48 4 L52 3 M44 4 L40 2" stroke="#fef08a" stroke-width="1.8" stroke-linecap="round"/>
    ${burst(32, 34, 12, "#fbbf24", "#b45309")}
    ${burst(32, 34, 7, "#fde68a", "#d97706")}
    <path d="M12 16 L16 12 M52 18 L56 14 M10 38 L6 42 M54 42 L58 46 M20 8 L24 4" stroke="#fde68a" stroke-width="1.6" stroke-linecap="round" opacity="0.75"/>
    <circle cx="14" cy="14" r="2" fill="#fbbf24" opacity="0.6"/><circle cx="54" cy="16" r="1.5" fill="#fde68a" opacity="0.5"/>`;
}

/** Branching cartoon lightning striking chained enemy tokens. */
function chainLightningMotif() {
  return `${groundShadow(32, 56, 24, 5)}
    <circle cx="32" cy="24" r="14" fill="#38bdf8" opacity="0.1"/>
    <path d="M32 2 L24 18 L34 18 L16 50 L38 22 L26 22 L42 2 Z" fill="#e0f2fe" stroke="#1e40af" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M32 2 L24 18 L34 18 L16 50 L38 22 L26 22 L42 2 Z" fill="#7dd3fc" opacity="0.35"/>
    <path d="M38 22 L54 6 L46 24 L60 14 L48 38" fill="none" stroke="#bae6fd" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M38 22 L54 6 L46 24 L60 14 L48 38" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.45"/>
    <path d="M26 18 L8 8 L16 28 L2 20 L14 40" fill="none" stroke="#93c5fd" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M26 18 L8 8 L16 28 L2 20" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity="0.4"/>
    ${tokenPro(22, 50, 4.5)}${tokenPro(38, 44, 4.5)}
    <path d="M22 50 L38 44" stroke="#93c5fd" stroke-width="2.2" stroke-dasharray="3 2" opacity="0.85"/>
    <circle cx="30" cy="49" r="2" fill="#fde047" opacity="0.7"/><circle cx="36" cy="46" r="1.5" fill="#fde047" opacity="0.6"/>
    <path d="M50 6 L53 3 M58 14 L61 11 M8 8 L5 5 M4 22 L1 19" stroke="#7dd3fc" stroke-width="1.8" stroke-linecap="round"/>
    ${sparkles([[48, 8, 0.8], [10, 10, 0.7], [56, 20, 0.9], [6, 24, 0.6]], "#e0f2fe", 0.7)}`;
}

/** Shattering shield over a doomed enemy token. */
function shatterMotif() {
  return `${groundShadow(32, 54, 18, 4)}
    <path d="M32 10 L44 18 V32 C44 40 32 48 32 48 C32 48 20 40 20 32 V18 Z" fill="#6366f1" opacity="0.42" stroke="#0f172a" stroke-width="2"/>
    <path d="M32 10 L44 18 V32 C44 40 32 48 32 48 C32 48 20 40 20 32 V18 Z" fill="none" stroke="#c7d2fe" stroke-width="1.2" opacity="0.7"/>
    <path d="M24 22 L40 38 M40 22 L24 38" stroke="#e0e7ff" stroke-width="2.8" stroke-linecap="round"/>
    <path d="M18 16 L22 20 M46 14 L42 18 M14 34 L18 30 M50 36 L46 32" stroke="#c7d2fe" stroke-width="1.6" stroke-linecap="round" opacity="0.85"/>
    ${tokenPro(32, 52, 5.5)}
    ${burst(32, 28, 10, "#818cf8", "#4338ca")}
    ${burst(32, 28, 5, "#e0e7ff", "#6366f1")}
    <path d="M10 24 L14 28 L8 32 M54 26 L50 30 L56 34" stroke="#a5b4fc" stroke-width="1.4" fill="none" opacity="0.7"/>`;
}

/** Twin cartoon flames engulfing an enemy and burning tile. */
function pyromancyMotif() {
  return `${groundShadow(32, 54, 18, 4)}
    <rect x="38" y="38" width="14" height="14" rx="2" fill="#292524" stroke="#57534e" stroke-width="1.4"/>
    <rect x="38" y="38" width="14" height="14" rx="2" fill="#f97316" opacity="0.4"/>
    <path d="M40 50 C42 46 44 44 46 46" stroke="#ea580c" stroke-width="1.2" fill="none"/>
    ${tokenPro(22, 48, 5)}
    <path d="M14 30 C18 16 24 8 28 16 C30 6 36 2 38 14 C42 4 48 10 50 22 C54 12 58 18 56 30 C60 22 62 28 58 36" fill="#f97316" opacity="0.9" stroke="#c2410c" stroke-width="1"/>
    <path d="M18 32 C22 22 26 18 30 22 C32 16 36 14 40 20 C42 16 46 18 48 26" fill="#fbbf24" opacity="0.95"/>
    <path d="M38 36 C42 28 44 22 48 26 C50 20 54 24 52 32" fill="#fb923c" opacity="0.85"/>
    <path d="M20 34 Q24 38 28 34" stroke="#fde047" stroke-width="1.4" fill="none"/>
    <circle cx="30" cy="22" r="8" fill="#fbbf24" opacity="0.22"/>
    ${sparkles([[16, 12, 0.7], [52, 14, 0.8], [44, 8, 0.6]], "#fde68a", 0.65)}`;
}

/** Spirit rising from the back rank to rejoin the board. */
function reviveMotif() {
  return `${groundShadow(32, 54, 22, 4)}
    <path d="M8 54 H56" stroke="#0f172a" stroke-width="3" opacity="0.25"/>
    <path d="M8 54 H56" stroke="#14532d" stroke-width="2.2" opacity="0.55"/>
    <rect x="10" y="50" width="44" height="6" rx="1.5" fill="#166534" opacity="0.42" stroke="#14532d" stroke-width="1"/>
    <rect x="12" y="51" width="40" height="3" rx="0.5" fill="#22c55e" opacity="0.2"/>
    ${ghost(32, 40, 7)}
    <path d="M32 46 L32 28" stroke="#0f172a" stroke-width="3.5" stroke-dasharray="4 3" opacity="0.2"/>
    <path d="M32 46 L32 28" stroke="#86efac" stroke-width="2.4" stroke-dasharray="4 3" opacity="0.75"/>
    <circle cx="32" cy="36" r="5" fill="#4ade80" opacity="0.18"/>
    <circle cx="32" cy="30" r="7" fill="#4ade80" opacity="0.14"/>
    ${allyPro(32, 22, 6)}
    <circle cx="32" cy="22" r="12" fill="#4ade80" opacity="0.15"/>
    <circle cx="32" cy="22" r="16" fill="none" stroke="#86efac" stroke-width="1.4" opacity="0.35"/>
    ${burst(32, 22, 9, "#4ade80", "#15803d")}
    <path d="M26 12 L32 4 L38 12" stroke="#0f172a" stroke-width="2.8" fill="none" stroke-linecap="round" opacity="0.3"/>
    <path d="M26 12 L32 4 L38 12" stroke="#bbf7d0" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M18 18 C24 14 28 16 32 12 C36 16 40 14 46 18" stroke="#86efac" stroke-width="1.6" fill="none" opacity="0.55"/>
    ${sparkles([[20, 10, 0.9], [44, 12, 0.8], [32, 6, 1.1], [14, 24, 0.7], [50, 22, 0.7]], "#bbf7d0", 0.65)}`;
}

/** Board cracking as corner pieces slide toward center. */
function earthquakeMotif() {
  return `${groundShadow(32, 56, 24, 5)}
    <path d="M8 8 L56 8 L56 56 L8 56 Z" fill="none" stroke="#0f172a" stroke-width="2.4" opacity="0.2"/>
    <path d="M8 8 L56 8 L56 56 L8 56 Z" fill="none" stroke="#78716c" stroke-width="1.6" opacity="0.4"/>
    <path d="M32 12 L28 28 L36 28 Z M32 52 L28 36 L36 36 Z M12 32 L28 28 L28 36 Z M52 32 L36 28 L36 36 Z" fill="#57534e" opacity="0.55" stroke="#44403c" stroke-width="1"/>
    <path d="M24 24 L40 40 M40 24 L24 40" stroke="#0f172a" stroke-width="3.2" stroke-linecap="round" opacity="0.25"/>
    <path d="M26 26 L38 38 M38 26 L26 38" stroke="#a8a29e" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M30 30 L34 34 M34 30 L30 34" stroke="#d6d3d1" stroke-width="1.4" stroke-linecap="round" opacity="0.6"/>
    ${tokenPro(16, 16, 4)}${tokenPro(48, 16, 4)}${tokenPro(16, 48, 4)}${tokenPro(48, 48, 4)}
    ${motionArrow(20, 20, 28, 28, "#d6d3d1", 2.2)}${motionArrow(44, 20, 36, 28, "#d6d3d1", 2.2)}
    ${motionArrow(20, 44, 28, 36, "#d6d3d1", 2.2)}${motionArrow(44, 44, 36, 36, "#d6d3d1", 2.2)}
    ${burst(32, 32, 8, "#d6d3d1", "#78716c")}
    <circle cx="32" cy="32" r="6" fill="#a8a29e" opacity="0.2"/>
  <path d="M14 54 L18 50 M50 54 L46 50 M54 14 L50 18 M10 14 L14 18" stroke="#d6d3d1" stroke-width="1.8" stroke-linecap="round" opacity="0.65"/>
    <path d="M8 32 L14 32 M50 32 L56 32 M32 8 L32 14 M32 50 L32 56" stroke="#a8a29e" stroke-width="1.4" stroke-linecap="round" opacity="0.4"/>`;
}

/** Berserker teleport arc onto an enemy. */
function berserkMotif() {
  return `${groundShadow(32, 54, 22, 4)}
    ${tokenPro(46, 28, 5.5)} ${xMark(46, 28, 6)}
    ${allyPro(18, 46, 5.5)}
    <path d="M22 42 Q34 8 44 30" stroke="#0f172a" stroke-width="4.2" fill="none" stroke-linecap="round" opacity="0.25"/>
    <path d="M22 42 Q34 8 44 30" stroke="#ef4444" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M22 42 Q34 8 44 30" stroke="#fca5a5" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="0.5" stroke-dasharray="3 2"/>
    ${motionArrow(40, 32, 44, 28, "#fde68a", 2.4)}
    <circle cx="18" cy="46" r="10" fill="#ef4444" opacity="0.18"/>
    <circle cx="46" cy="28" r="12" fill="#ef4444" opacity="0.22"/>
    ${burst(46, 28, 7, "#ef4444", "#991b1b")}
    <path d="M10 46 C16 38 22 32 30 28" stroke="#fca5a5" stroke-width="1.8" fill="none" opacity="0.55" stroke-dasharray="3 2"/>
    <path d="M14 12 L18 8 M50 10 L46 6 M52 50 L48 54" stroke="#fecaca" stroke-width="1.8" stroke-linecap="round" opacity="0.7"/>
    ${sparkles([[34, 14, 0.9], [40, 20, 0.7], [28, 18, 0.8]], "#fca5a5", 0.6)}`;
}

/** Shadow hand reaching down to cull a token. */
function cullMotif() {
  return `${groundShadow(32, 56, 16, 4)}
    ${tokenPro(32, 52, 6)}
    <circle cx="32" cy="52" r="10" fill="#7c3aed" opacity="0.12"/>
    <path d="M14 2 C10 14 8 28 12 38 C14 46 20 50 28 48" fill="#4c1d95" stroke="#0f172a" stroke-width="2.2"/>
    <path d="M14 2 C10 14 8 28 12 38 C14 46 20 50 28 48" fill="#4c1d95" stroke="#2e1065" stroke-width="1.4"/>
    <path d="M28 48 L30 40 L36 42 L38 34 L44 36 L48 28 L54 34" fill="none" stroke="#0f172a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M28 48 L30 40 L36 42 L38 34 L44 36 L48 28 L54 34" fill="none" stroke="#1e1b4b" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M30 40 L32 38 L34 40 M36 42 L38 40 L40 42 M44 36 L46 34 L48 36" stroke="#a78bfa" stroke-width="1.2" fill="none" opacity="0.5"/>
    <path d="M16 8 C18 20 20 32 24 40" stroke="#a78bfa" stroke-width="2.4" fill="none" opacity="0.7"/>
    <path d="M46 4 C42 18 40 32 44 42" stroke="#a78bfa" stroke-width="2.4" fill="none" opacity="0.6"/>
    <path d="M24 6 C20 16 18 26 20 34" stroke="#c4b5fd" stroke-width="1.8" fill="none" opacity="0.5"/>
    ${runeGlow(50, 10, 4, "#e9d5ff")}
    ${sparkles([[12, 6, 0.8], [48, 8, 1], [22, 4, 0.7], [36, 44, 0.9]], "#e9d5ff", 0.65)}`;
}

/** Two armored knights clashing swords. */
function duelMotif() {
  const knight = (x, flip, plume) => {
    const sx = flip ? -1 : 1;
    return `<g transform="translate(${x}, 40) scale(${sx}, 1)">
      <ellipse cx="0" cy="8" rx="10" ry="3.5" fill="#000" opacity="0.28"/>
      <rect x="-8" y="-4" width="16" height="22" rx="2.5" fill="#9ca3af" stroke="#0f172a" stroke-width="2"/>
      <rect x="-6" y="-2" width="12" height="16" rx="1.5" fill="#b0b8c4" opacity="0.5"/>
      <path d="M-9 -4 L0 -18 L9 -4 Z" fill="#6b7280" stroke="#0f172a" stroke-width="1.6"/>
      <path d="M-5 -8 L0 -14 L5 -8" fill="#94a3b8" opacity="0.45"/>
      <path d="M0 -18 L0 -24" stroke="#0f172a" stroke-width="5" stroke-linecap="round" opacity="0.3"/>
      <path d="M0 -18 L0 -24" stroke="${plume}" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="0" cy="-22" r="2" fill="${plume}" opacity="0.6"/>
      <path d="M6 6 L18 -12" stroke="#0f172a" stroke-width="4.2" stroke-linecap="round" opacity="0.3"/>
      <path d="M6 6 L18 -12" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>
      <path d="M6 6 L16 -10" stroke="#e2e8f0" stroke-width="1.4" stroke-linecap="round" opacity="0.6"/>
      <path d="M-2 2 L2 6" stroke="#64748b" stroke-width="1.4" stroke-linecap="round" opacity="0.5"/>
    </g>`;
  };
  return `${groundShadow(32, 54, 22, 4)}
    ${knight(18, false, "#dc2626")}${knight(46, true, "#2563eb")}
    ${burst(32, 30, 10, "#fbbf24", "#b45309")}
    ${burst(32, 30, 5, "#fde68a", "#d97706")}
    <path d="M24 26 L40 34 M40 26 L24 34" stroke="#0f172a" stroke-width="2" opacity="0.25"/>
    <path d="M24 26 L40 34 M40 26 L24 34" stroke="#fde68a" stroke-width="1.6" opacity="0.5"/>
    ${sparkles([[32, 24, 1], [26, 20, 0.7], [38, 20, 0.7]], "#fde68a", 0.7)}`;
}

/** Bloodied battle axe striking a token. */
function executionMotif() {
  return `${groundShadow(36, 56, 18, 4)}
    ${tokenPro(42, 52, 6)}
    <path d="M8 58 L8 28" stroke="#0f172a" stroke-width="6" stroke-linecap="round" opacity="0.3"/>
    <path d="M8 58 L8 28" stroke="#92400e" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M8 28 L8 12 L32 4 L36 20 L28 36 Z" fill="#9ca3af" stroke="#0f172a" stroke-width="2"/>
    <path d="M8 28 L8 12 L32 4 L36 20 L28 36 Z" fill="none" stroke="#64748b" stroke-width="1.2"/>
    <path d="M12 14 L26 8 L30 22 L16 28 Z" fill="#dc2626" opacity="0.85" stroke="#991b1b" stroke-width="1.2"/>
    <path d="M16 12 L22 10 L24 18" stroke="#fca5a5" stroke-width="1" fill="none" opacity="0.5"/>
    ${burst(42, 50, 8, "#ef4444", "#991b1b")}
    <path d="M34 40 L44 54" stroke="#0f172a" stroke-width="3" stroke-linecap="round" opacity="0.25"/>
    <path d="M34 40 L44 54" stroke="#dc2626" stroke-width="2.2" stroke-linecap="round" opacity="0.7"/>
    <circle cx="40" cy="48" r="2.2" fill="#dc2626" opacity="0.85"/>
    <circle cx="36" cy="44" r="1.8" fill="#ef4444" opacity="0.7"/>
    <circle cx="44" cy="52" r="1.5" fill="#b91c1c" opacity="0.6"/>
    ${sparkles([[38, 38, 0.7], [46, 46, 0.6]], "#fca5a5", 0.55)}`;
}

/** Horseshoe magnet yanking an enemy toward an ally. */
function magnetMotif() {
  return `${groundShadow(32, 54, 22, 4)}
    ${allyPro(20, 40, 5.5)}${tokenPro(50, 40, 5.5)}
    <path d="M28 12 C18 12 10 22 10 34 C10 46 18 54 28 54" fill="none" stroke="#0f172a" stroke-width="7" stroke-linecap="round" opacity="0.25"/>
    <path d="M28 12 C18 12 10 22 10 34 C10 46 18 54 28 54" fill="none" stroke="#dc2626" stroke-width="5.5" stroke-linecap="round"/>
    <path d="M36 12 C46 12 54 22 54 34 C54 46 46 54 36 54" fill="none" stroke="#0f172a" stroke-width="7" stroke-linecap="round" opacity="0.25"/>
    <path d="M36 12 C46 12 54 22 54 34 C54 46 46 54 36 54" fill="none" stroke="#1d4ed8" stroke-width="5.5" stroke-linecap="round"/>
    <rect x="24" y="6" width="16" height="8" rx="2.5" fill="#64748b" stroke="#0f172a" stroke-width="1.8"/>
    <ellipse cx="32" cy="10" rx="6" ry="2" fill="#94a3b8" opacity="0.4"/>
    <path d="M44 40 L28 40" stroke="#0f172a" stroke-width="3.5" stroke-dasharray="4 3" opacity="0.2"/>
    <path d="M44 40 L28 40" stroke="#fbbf24" stroke-width="2.8" stroke-dasharray="4 3" opacity="0.85"/>
    <path d="M40 40 L30 40 M30 40 L32 37 M30 40 L32 43" stroke="#fde68a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <circle cx="36" cy="40" r="3" fill="#fde047" opacity="0.35"/>
    ${sparkles([[34, 36, 0.7], [38, 44, 0.6], [32, 22, 0.8]], "#fde68a", 0.6)}`;
}

/** Piece taking two rapid marching steps. */
function quickMarchMotif() {
  return `${groundShadow(32, 54, 20, 4)}
    ${allyPro(32, 42, 6)}
    <path d="M32 36 L32 22" stroke="#0f172a" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M32 36 L32 22" stroke="#93c5fd" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M32 24 L32 10" stroke="#0f172a" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M32 24 L32 10" stroke="#60a5fa" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    ${motionArrow(32, 38, 32, 26, "#93c5fd", 2.4)}
    ${motionArrow(32, 24, 32, 12, "#60a5fa", 2.4)}
    <path d="M32 38 L26 34 M32 38 L38 34" stroke="#93c5fd" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M32 24 L26 20 M32 24 L38 20" stroke="#60a5fa" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <ellipse cx="24" cy="48" rx="6" ry="3.5" fill="#1e3a8a" opacity="0.4"/>
    <ellipse cx="40" cy="48" rx="6" ry="3.5" fill="#1e3a8a" opacity="0.4"/>
    <ellipse cx="28" cy="30" rx="5" ry="2.5" fill="#1e3a8a" opacity="0.25"/>
    <ellipse cx="36" cy="18" rx="5" ry="2.5" fill="#1e3a8a" opacity="0.25"/>
    ${destRing(32, 10, 5, "#93c5fd")}
    <text x="38" y="14" font-size="7" fill="#93c5fd" opacity="0.85" font-weight="700">×2</text>
    ${sparkles([[32, 8, 0.8], [20, 32, 0.6], [44, 32, 0.6]], "#bae6fd", 0.55)}`;
}

/** Armed piece releasing a paralyzing shockwave. */
function shockwaveMotif() {
  return `${groundShadow(32, 54, 22, 4)}
    ${allyPro(32, 36, 6)}
    <circle cx="32" cy="36" r="10" fill="#a78bfa" opacity="0.15"/>
    <circle cx="32" cy="36" r="10" fill="none" stroke="#0f172a" stroke-width="2.8" opacity="0.2"/>
    <circle cx="32" cy="36" r="10" fill="none" stroke="#c4b5fd" stroke-width="2.4" opacity="0.75"/>
    <circle cx="32" cy="36" r="16" fill="none" stroke="#a78bfa" stroke-width="2" opacity="0.6"/>
    <circle cx="32" cy="36" r="22" fill="none" stroke="#8b5cf6" stroke-width="1.6" opacity="0.45"/>
    <circle cx="32" cy="36" r="28" fill="none" stroke="#7c3aed" stroke-width="1" opacity="0.25"/>
    ${tokenPro(14, 28, 4)}${tokenPro(50, 28, 4)}${tokenPro(14, 44, 4)}${tokenPro(50, 44, 4)}
    <path d="M14 28 L10 22 M50 28 L54 22 M14 44 L10 50 M50 44 L54 50" stroke="#e9d5ff" stroke-width="1.8" stroke-linecap="round" opacity="0.75"/>
    <path d="M28 18 L32 12 L36 18" stroke="#0f172a" stroke-width="2.4" fill="none" stroke-linecap="round" opacity="0.25"/>
    <path d="M28 18 L32 12 L36 18" stroke="#fbbf24" stroke-width="2" fill="none" stroke-linecap="round"/>
    ${burst(32, 36, 6, "#c4b5fd", "#7c3aed")}
    ${sparkles([[32, 14, 0.9], [8, 36, 0.7], [56, 36, 0.7]], "#e9d5ff", 0.6)}`;
}

/** Hypnotic beam converting an enemy to your side. */
function mindControlMotif() {
  return `${groundShadow(32, 54, 22, 4)}
    ${tokenPro(48, 32, 6)}
    <circle cx="48" cy="32" r="11" fill="none" stroke="#0f172a" stroke-width="2" opacity="0.2"/>
    <circle cx="48" cy="32" r="11" fill="none" stroke="#f87171" stroke-width="1.8" opacity="0.55"/>
    <circle cx="22" cy="32" r="14" fill="#7c3aed" opacity="0.12"/>
    <circle cx="22" cy="32" r="14" fill="none" stroke="#0f172a" stroke-width="2.4" opacity="0.2"/>
    <circle cx="22" cy="32" r="14" fill="none" stroke="#c4b5fd" stroke-width="2.4" opacity="0.8"/>
    <circle cx="22" cy="32" r="6" fill="#7c3aed" opacity="0.65" stroke="#e9d5ff" stroke-width="1.8"/>
    <circle cx="22" cy="32" r="2.5" fill="#f0e6ff"/>
    <path d="M22 18 C30 22 30 42 22 46 C14 42 14 22 22 18 Z" fill="#a78bfa" opacity="0.42" stroke="#c4b5fd" stroke-width="1.2"/>
    <path d="M22 22 C26 24 26 40 22 42 C18 40 18 24 22 22 Z" fill="#c4b5fd" opacity="0.25"/>
    <path d="M34 32 L40 32" stroke="#0f172a" stroke-width="4" stroke-linecap="round" opacity="0.2"/>
    <path d="M34 32 L40 32" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>
    <path d="M28 24 C34 28 34 36 28 40" stroke="#fde68a" stroke-width="2.2" fill="none" opacity="0.8"/>
    <path d="M48 32 L40 32" stroke="#fca5a5" stroke-width="2" stroke-dasharray="3 2" opacity="0.65"/>
    ${sparkles([[22, 20, 0.8], [36, 28, 0.7], [36, 36, 0.7]], "#e9d5ff", 0.6)}`;
}

/** Dizzy enemy with chaotic random paths. */
function confusionMotif() {
  return `${groundShadow(32, 54, 18, 4)}
    ${tokenPro(32, 36, 6)}
    <circle cx="32" cy="36" r="14" fill="#a78bfa" opacity="0.1"/>
    <path d="M14 14 C24 24 14 34 26 44 C38 34 46 44 50 26 C44 14 34 18 26 12" stroke="#0f172a" stroke-width="3.6" fill="none" opacity="0.2"/>
    <path d="M14 14 C24 24 14 34 26 44 C38 34 46 44 50 26 C44 14 34 18 26 12" stroke="#c4b5fd" stroke-width="2.6" fill="none" opacity="0.8"/>
    <path d="M18 10 C28 18 22 28 32 22" stroke="#a78bfa" stroke-width="2" fill="none" opacity="0.65"/>
    <path d="M42 48 C36 42 30 46 24 40" stroke="#e9d5ff" stroke-width="1.6" fill="none" opacity="0.5" stroke-dasharray="3 2"/>
    <text x="10" y="50" font-size="10" fill="#fde68a" opacity="0.85" font-weight="700">?</text>
    <text x="48" y="16" font-size="8" fill="#c4b5fd" opacity="0.7" font-weight="700">?</text>
    <path d="M24 32 L30 26 M34 32 L40 36 M30 40 L24 46" stroke="#f0e6ff" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
    <path d="M28 20 C32 24 36 20 40 24" stroke="#fde68a" stroke-width="1.4" fill="none" opacity="0.5"/>
    ${sparkles([[16, 20, 0.8], [48, 38, 0.7], [32, 10, 0.9]], "#e9d5ff", 0.6)}`;
}

/** Hidden trap rune cancelling an incoming spell. */
function counterspellMotif() {
  return `${groundShadow(32, 54, 20, 4)}
    <path d="M32 48 L46 34 L38 26 L52 12 L42 8 L32 22 L22 8 L12 12 L26 26 L18 34 Z" fill="#4c1d95" opacity="0.55" stroke="#0f172a" stroke-width="2.4"/>
    <path d="M32 48 L46 34 L38 26 L52 12 L42 8 L32 22 L22 8 L12 12 L26 26 L18 34 Z" fill="none" stroke="#a78bfa" stroke-width="1.8" opacity="0.7"/>
    <path d="M32 48 L46 34 L38 26 L52 12 L42 8 L32 22 L22 8 L12 12 L26 26 L18 34 Z" fill="none" stroke="#c4b5fd" stroke-width="0.8" opacity="0.45"/>
    ${runeGlow(32, 30, 6, "#c4b5fd")}
    <path d="M22 26 L42 46 M42 26 L22 46" stroke="#0f172a" stroke-width="4" stroke-linecap="round" opacity="0.3"/>
    <path d="M22 26 L42 46 M42 26 L22 46" stroke="#f87171" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M6 8 L20 22 L12 30 L28 46" fill="none" stroke="#0f172a" stroke-width="3.6" stroke-linecap="round" opacity="0.2"/>
    <path d="M6 8 L20 22 L12 30 L28 46" fill="none" stroke="#fbbf24" stroke-width="2.8" stroke-linecap="round" opacity="0.7"/>
    <circle cx="6" cy="8" r="5" fill="#fde68a" opacity="0.6" stroke="#b45309" stroke-width="1.2"/>
    ${burst(32, 36, 7, "#a78bfa", "#4c1d95")}
    ${sparkles([[14, 14, 0.8], [48, 16, 0.7], [32, 8, 0.9]], "#e9d5ff", 0.6)}`;
}

/** Diagonal ice beam freezing enemies in a line. */
function deepFreezeMotif() {
  return `${groundShadow(32, 54, 22, 4)}
    ${allyPro(32, 50, 5)}
    <path d="M6 58 L58 6" stroke="#0f172a" stroke-width="5" opacity="0.2"/>
    <path d="M6 58 L58 6" stroke="#bae6fd" stroke-width="4" opacity="0.45"/>
    <path d="M6 58 L58 6" stroke="#e0f2fe" stroke-width="1.8" opacity="0.9"/>
    ${tokenPro(18, 46, 4.5)}${tokenPro(32, 32, 4.5)}${tokenPro(46, 18, 4.5)}
    <path d="M16 42 L20 38 M26 28 L30 24 M38 14 L42 10" stroke="#e0f2fe" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M14 40 L18 44 M24 26 L28 30 M36 12 L40 16" stroke="#7dd3fc" stroke-width="1.4" stroke-linecap="round" opacity="0.75"/>
    <path d="M20 44 L24 40 M34 26 L38 22 M46 12 L50 8" stroke="#38bdf8" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/>
    <text x="48" y="12" font-size="10" fill="#e0f2fe" opacity="0.9">❄</text>
    ${sparkles([[50, 10, 1], [12, 52, 0.8], [40, 20, 0.7]], "#e0f2fe", 0.7)}`;
}

/** Two pieces crossing to swap positions. */
function hostileSwapMotif() {
  return `${groundShadow(32, 54, 22, 4)}
    ${allyPro(20, 42, 5.5)}${tokenPro(44, 22, 5.5)}
    <path d="M26 38 C32 30 38 26 44 26" stroke="#0f172a" stroke-width="3.6" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M26 38 C32 30 38 26 44 26" stroke="#93c5fd" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M38 26 L44 26 L41 22 M44 26 L41 30" stroke="#93c5fd" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M38 30 C32 38 26 42 20 42" stroke="#0f172a" stroke-width="3.6" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M38 30 C32 38 26 42 20 42" stroke="#fca5a5" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M26 42 L20 42 L23 38 M20 42 L23 46" stroke="#fca5a5" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    ${energyArc(24, 38, 40, 26, "#fde68a", 2.2)}
    <path d="M28 34 L36 30" stroke="#fde68a" stroke-width="1.8" stroke-dasharray="3 2" opacity="0.65"/>
    ${destRing(20, 42, 5, "#93c5fd")}${destRing(44, 22, 5, "#fca5a5")}
    ${sparkles([[32, 32, 0.8], [28, 28, 0.6], [36, 36, 0.6]], "#fde68a", 0.55)}`;
}

/** Cleansing light washing debuffs from allied pieces. */
function purifyMotif() {
  return `${groundShadow(32, 54, 22, 4)}
    ${allyPro(20, 46, 4.5)}${allyPro(44, 46, 4.5)}
    <circle cx="32" cy="24" r="18" fill="#fbbf24" opacity="0.15"/>
    <path d="M32 6 L35 20 H48 L37 28 L40 42 L32 34 L24 42 L27 28 L16 20 H29 Z" fill="#fde68a" opacity="0.82" stroke="#0f172a" stroke-width="2"/>
    <path d="M32 6 L35 20 H48 L37 28 L40 42 L32 34 L24 42 L27 28 L16 20 H29 Z" fill="none" stroke="#f59e0b" stroke-width="1.4"/>
    <path d="M32 14 L34 22 H40 L35 26 L36 34 L32 30 L28 34 L29 26 L24 22 H30 Z" fill="#fff" opacity="0.25"/>
    <path d="M14 38 L18 42 M50 38 L46 42" stroke="#86efac" stroke-width="2" stroke-linecap="round" opacity="0.75"/>
    <path d="M16 32 L20 36 M48 32 L44 36" stroke="#fca5a5" stroke-width="1.6" stroke-linecap="round" opacity="0.45"/>
    ${burst(32, 26, 8, "#fde68a", "#d97706")}
    ${sparkles([[20, 12, 0.9], [44, 12, 0.8], [32, 4, 1], [14, 28, 0.7], [50, 28, 0.7]], "#fff", 0.55)}`;
}

/** Wanted poster with checker piece — mark enemy for jump-capture reward. */
function bountyMotif() {
  return `${groundShadow(32, 56, 18, 4)}
    <rect x="10" y="4" width="44" height="54" rx="4" fill="#fef3c7" stroke="#0f172a" stroke-width="2.8"/>
    <rect x="12" y="6" width="40" height="50" rx="3" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
    <text x="32" y="18" text-anchor="middle" font-size="8" font-weight="bold" fill="#92400e" font-family="Georgia,serif">WANTED</text>
    <line x1="14" y1="22" x2="50" y2="22" stroke="#d97706" stroke-width="1.6"/>
    <line x1="14" y1="24" x2="50" y2="24" stroke="#fbbf24" stroke-width="0.6" opacity="0.5"/>
    <circle cx="32" cy="38" r="14" fill="#dc2626" stroke="#0f172a" stroke-width="2.4"/>
    <circle cx="32" cy="38" r="11" fill="#b91c1c"/>
    <ellipse cx="27" cy="33" rx="5" ry="3.5" fill="#fca5a5" opacity="0.45"/>
    <path d="M26 42 Q32 46 38 42" fill="none" stroke="#7f1d1d" stroke-width="1.2" opacity="0.5"/>
    <circle cx="8" cy="8" r="2" fill="#78716c" opacity="0.6"/><circle cx="56" cy="8" r="2" fill="#78716c" opacity="0.6"/>
    <circle cx="8" cy="54" r="2" fill="#78716c" opacity="0.6"/><circle cx="56" cy="54" r="2" fill="#78716c" opacity="0.6"/>
    <text x="32" y="54" text-anchor="middle" font-size="7" font-weight="bold" fill="#b45309">REWARD</text>
    ${sparkles([[14, 10, 0.7], [50, 10, 0.7], [32, 28, 0.8]], "#fde68a", 0.6)}`;
}

/** Two enemies chained by a glowing fate thread. */
function linkFateMotif() {
  return `${groundShadow(32, 54, 22, 4)}
    ${tokenPro(18, 36, 5.5)}${tokenPro(46, 36, 5.5)}
    <path d="M24 36 H40" stroke="#0f172a" stroke-width="4" opacity="0.2"/>
    <path d="M24 36 H40" stroke="#c4b5fd" stroke-width="3.2"/>
    <circle cx="32" cy="36" r="5" fill="#7c3aed" stroke="#0f172a" stroke-width="1.6"/>
    <circle cx="32" cy="36" r="3" fill="#e9d5ff" opacity="0.6"/>
    <path d="M24 36 C28 28 36 28 40 36 C36 44 28 44 24 36 Z" fill="none" stroke="#0f172a" stroke-width="2.4" opacity="0.2"/>
    <path d="M24 36 C28 28 36 28 40 36 C36 44 28 44 24 36 Z" fill="none" stroke="#a78bfa" stroke-width="2" opacity="0.7"/>
    <path d="M18 36 L12 30 M18 36 L12 42 M46 36 L52 30 M46 36 L52 42" stroke="#f87171" stroke-width="1.8" stroke-linecap="round" opacity="0.65"/>
    <path d="M22 32 L26 36 L22 40 M42 32 L38 36 L42 40" stroke="#c4b5fd" stroke-width="1.4" fill="none" opacity="0.5"/>
    ${runeGlow(32, 36, 4, "#e9d5ff")}
    ${sparkles([[32, 28, 0.8], [32, 44, 0.7]], "#e9d5ff", 0.6)}`;
}

/** Original piece with a translucent duplicate beside it. */
function cloneMotif() {
  return `${groundShadow(32, 54, 20, 4)}
    ${allyPro(22, 38, 5.5)}
    <circle cx="42" cy="38" r="6" fill="#2563eb" opacity="0.2" stroke="#93c5fd" stroke-width="2" stroke-dasharray="4 2"/>
    <circle cx="42" cy="38" r="5.5" fill="#2563eb" opacity="0.35" stroke="#0f172a" stroke-width="1.6" stroke-dasharray="3 2"/>
    <ellipse cx="42" cy="38" rx="4.5" ry="4.5" fill="none" stroke="#93c5fd" stroke-width="1.4" stroke-dasharray="3 2"/>
    <ellipse cx="39" cy="35" rx="2.5" ry="1.8" fill="#93c5fd" opacity="0.35"/>
    <path d="M28 38 L36 38" stroke="#0f172a" stroke-width="3" stroke-dasharray="4 3" opacity="0.2"/>
    <path d="M28 38 L36 38" stroke="#fde68a" stroke-width="2.4" stroke-dasharray="4 3" opacity="0.75"/>
    <path d="M42 38 L42 30 M42 38 L42 46 M34 38 L50 38" stroke="#93c5fd" stroke-width="1.6" opacity="0.55"/>
    <circle cx="42" cy="38" r="11" fill="#7c3aed" opacity="0.12"/>
    <circle cx="42" cy="38" r="14" fill="none" stroke="#c4b5fd" stroke-width="0.8" opacity="0.3"/>
    ${sparkles([[36, 32, 0.7], [48, 34, 0.6], [42, 28, 0.8]], "#e9d5ff", 0.55)}`;
}

/** Crowned king protected by a golden constitution scroll. */
function constitutionMotif() {
  return `${groundShadow(32, 56, 18, 4)}
    ${allyPro(32, 42, 6)}
    <path d="M20 12 L24 2 L28 10 L32 0 L36 10 L40 2 L44 12 L44 50 L20 50 Z" fill="#fef3c7" stroke="#0f172a" stroke-width="2"/>
    <path d="M20 12 L24 2 L28 10 L32 0 L36 10 L40 2 L44 12 L44 50 L20 50 Z" fill="none" stroke="#d97706" stroke-width="1.4" opacity="0.85"/>
    <path d="M24 20 H40 M24 28 H40 M24 36 H34" stroke="#92400e" stroke-width="1.4" opacity="0.6"/>
    <path d="M26 22 H38 M26 30 H38" stroke="#fbbf24" stroke-width="0.6" opacity="0.4"/>
    <path d="M20 8 L24 0 L28 8 L32 -2 L36 8 L40 0 L44 8" fill="#fbbf24" stroke="#0f172a" stroke-width="1.4"/>
    <path d="M32 42 L32 28" stroke="#93c5fd" stroke-width="2.4" opacity="0.55"/>
    <path d="M22 36 L32 28 L42 36" fill="#2563eb" opacity="0.42" stroke="#0f172a" stroke-width="1.6"/>
    <path d="M26 34 L32 30 L38 34" fill="#60a5fa" opacity="0.3"/>
    ${shieldPro(32, 36, "#fbbf24", "#fde68a")}
    ${sparkles([[24, 6, 0.7], [40, 6, 0.7], [32, 16, 0.8]], "#fde68a", 0.55)}`;
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
  <rect width="${VB_W}" height="${VB_H}" fill="url(#cf-bg)"/>
  ${artScene(`<ellipse cx="32" cy="56" rx="20" ry="4" fill="#000" opacity="0.35"/>
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
  ${token(14, 50, 3.2)}${ally(50, 50, 3.2)}`)}`;
}

/** Enemy pulled back through a portal to its starting square. */
function deportMotif() {
  return `${groundShadow(24, 54, 20, 4)}
    ${tokenPro(48, 20, 5.5)}
    <ellipse cx="20" cy="40" rx="14" ry="12" fill="#4c1d95" opacity="0.55" stroke="#0f172a" stroke-width="2"/>
    <ellipse cx="20" cy="40" rx="14" ry="12" fill="none" stroke="#a78bfa" stroke-width="1.8"/>
    <ellipse cx="20" cy="40" rx="8" ry="6" fill="#1e1b4b" opacity="0.65"/>
    <circle cx="20" cy="40" r="4" fill="#c4b5fd" opacity="0.75"/>
    <circle cx="20" cy="40" r="2" fill="#f0e6ff"/>
    <path d="M42 24 C34 28 26 34 22 38" stroke="#0f172a" stroke-width="3.2" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M42 24 C34 28 26 34 22 38" stroke="#fca5a5" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    ${motionArrow(40, 22, 24, 36, "#fca5a5", 2.4)}
    <path d="M8 52 H32" stroke="#0f172a" stroke-width="2.8" opacity="0.25"/>
    <path d="M8 52 H32" stroke="#78716c" stroke-width="2.2" opacity="0.55"/>
    <rect x="10" y="50" width="20" height="5" rx="1.5" fill="#57534e" opacity="0.5" stroke="#44403c" stroke-width="1"/>
    <text x="12" y="49" font-size="5.5" fill="#d6d3d1" opacity="0.8" font-weight="600">start</text>
    ${sparkles([[18, 32, 0.8], [28, 28, 0.6]], "#e9d5ff", 0.55)}`;
}

/** Ally piece dissolving into two drawn cards. */
function offeringMotif() {
  return `${groundShadow(28, 54, 18, 4)}
    ${allyPro(22, 44, 5.5)}
    <path d="M22 44 C14 32 16 18 28 12" stroke="#0f172a" stroke-width="3.2" fill="none" opacity="0.2"/>
    <path d="M22 44 C14 32 16 18 28 12" stroke="#c4b5fd" stroke-width="2.6" fill="none" opacity="0.8"/>
    <circle cx="28" cy="12" r="5" fill="#e9d5ff" opacity="0.9" stroke="#a78bfa" stroke-width="1.4"/>
    <circle cx="28" cy="12" r="8" fill="#a78bfa" opacity="0.18"/>
    <rect x="32" y="8" width="16" height="24" rx="2.5" fill="#4c1d95" stroke="#0f172a" stroke-width="2" transform="rotate(10 40 20)"/>
    <rect x="32" y="8" width="16" height="24" rx="2.5" fill="none" stroke="#a78bfa" stroke-width="1.4" transform="rotate(10 40 20)"/>
    <rect x="42" y="12" width="16" height="24" rx="2.5" fill="#5b21b6" stroke="#0f172a" stroke-width="2" transform="rotate(-8 50 24)"/>
    <rect x="42" y="12" width="16" height="24" rx="2.5" fill="none" stroke="#c4b5fd" stroke-width="1.4" transform="rotate(-8 50 24)"/>
    <path d="M36 16 L44 16 M36 20 H48 M36 24 H44" stroke="#e9d5ff" stroke-width="1.2" opacity="0.65"/>
    <path d="M46 20 L54 20 M46 24 H56" stroke="#ddd6fe" stroke-width="1.2" opacity="0.55"/>
    <path d="M28 10 L34 6 M46 8 L52 4" stroke="#f0e6ff" stroke-width="1.4" stroke-linecap="round" opacity="0.55"/>
    <text x="36" y="50" font-size="8" fill="#e9d5ff" opacity="0.9" font-weight="700">+2</text>
    ${sparkles([[30, 8, 0.8], [52, 6, 0.7], [24, 28, 0.6]], "#e9d5ff", 0.6)}`;
}

/** Two enemies swapping places while frozen. */
function tangleMotif() {
  return `${groundShadow(32, 52, 22, 4)}
    ${tokenPro(20, 34, 5.5)}${tokenPro(44, 34, 5.5)}
    <path d="M26 34 C32 24 38 24 44 34" stroke="#0f172a" stroke-width="3.6" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M26 34 C32 24 38 24 44 34" stroke="#fca5a5" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M38 34 C32 44 26 44 20 34" stroke="#0f172a" stroke-width="3.6" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M38 34 C32 44 26 44 20 34" stroke="#93c5fd" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M38 28 L44 34 L40 38" stroke="#fca5a5" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M26 40 L20 34 L24 30" stroke="#93c5fd" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M14 16 L18 20 M50 16 L46 20" stroke="#bae6fd" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
    <path d="M16 12 C22 8 26 10 18 18" stroke="#e0f2fe" stroke-width="1.6" fill="none" opacity="0.65"/>
    <path d="M48 12 C42 8 38 10 46 18" stroke="#e0f2fe" stroke-width="1.6" fill="none" opacity="0.65"/>
    <circle cx="16" cy="18" r="6" fill="#7dd3fc" opacity="0.15" stroke="#0f172a" stroke-width="1.4"/>
    <circle cx="16" cy="18" r="6" fill="none" stroke="#bae6fd" stroke-width="1.2"/>
    <circle cx="48" cy="18" r="6" fill="#7dd3fc" opacity="0.15" stroke="#0f172a" stroke-width="1.4"/>
    <circle cx="48" cy="18" r="6" fill="none" stroke="#bae6fd" stroke-width="1.2"/>
    ${sparkles([[32, 34, 0.9], [16, 14, 0.7], [48, 14, 0.7]], "#e0f2fe", 0.6)}`;
}

/** Bishop diagonal slide paths from a piece. */
function bishopMarkMotif() {
  return `${groundShadow(32, 54, 18, 4)}
    ${allyPro(32, 48, 5.5)}
    <path d="M32 44 L10 22 M32 44 L54 22" stroke="#0f172a" stroke-width="3.6" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M32 44 L10 22 M32 44 L54 22" stroke="#c4b5fd" stroke-width="2.8" fill="none" stroke-linecap="round" opacity="0.85"/>
    <path d="M14 26 L18 22 M50 26 L46 22" stroke="#e9d5ff" stroke-width="1.8" stroke-linecap="round" opacity="0.7"/>
    ${runeGlow(44, 16, 5, "#e9d5ff")}
    <text x="40" y="20" font-size="16" fill="#f0e6ff" opacity="0.95">♗</text>
    <circle cx="16" cy="24" r="4" fill="#a78bfa" opacity="0.65" stroke="#0f172a" stroke-width="1.2"/>
    <circle cx="48" cy="24" r="4" fill="#a78bfa" opacity="0.65" stroke="#0f172a" stroke-width="1.2"/>
    ${destRing(14, 22, 3, "#c4b5fd")}${destRing(50, 22, 3, "#c4b5fd")}
    ${sparkles([[12, 18, 0.7], [52, 18, 0.7], [32, 36, 0.6]], "#e9d5ff", 0.55)}`;
}

/** Rook rank and file slide paths from a piece. */
function rookMarkMotif() {
  return `${groundShadow(32, 54, 18, 4)}
    ${allyPro(32, 48, 5.5)}
    <path d="M32 44 V8 M32 44 H6 M32 44 H58" stroke="#0f172a" stroke-width="3.6" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M32 44 V8 M32 44 H6 M32 44 H58" stroke="#c4b5fd" stroke-width="2.8" fill="none" stroke-linecap="round" opacity="0.85"/>
    <path d="M32 12 V4 M6 44 H2 M58 44 H62" stroke="#e9d5ff" stroke-width="1.8" stroke-linecap="round" opacity="0.6"/>
    ${runeGlow(44, 16, 5, "#e9d5ff")}
    <text x="40" y="20" font-size="16" fill="#f0e6ff" opacity="0.95">♜</text>
    <rect x="26" y="6" width="12" height="6" rx="1.5" fill="#a78bfa" opacity="0.5" stroke="#0f172a" stroke-width="1.2"/>
    <rect x="28" y="8" width="8" height="2" rx="0.5" fill="#c4b5fd" opacity="0.4"/>
    ${destRing(32, 8, 3, "#c4b5fd")}${destRing(6, 44, 3, "#c4b5fd")}${destRing(58, 44, 3, "#c4b5fd")}
    ${sparkles([[32, 6, 0.7], [4, 44, 0.6], [60, 44, 0.6]], "#e9d5ff", 0.55)}`;
}

/** Enemy pulled forward along a diagonal. */
function callForwardMotif() {
  return `${groundShadow(30, 52, 20, 4)}
    ${tokenPro(46, 20, 5.5)}
    <circle cx="46" cy="20" r="12" fill="none" stroke="#0f172a" stroke-width="2" opacity="0.2"/>
    <circle cx="46" cy="20" r="12" fill="none" stroke="#fca5a5" stroke-width="1.8" opacity="0.55"/>
    <circle cx="46" cy="20" r="16" fill="#ef4444" opacity="0.1"/>
    <path d="M42 24 C32 30 24 36 18 42" stroke="#0f172a" stroke-width="3.4" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M42 24 C32 30 24 36 18 42" stroke="#f87171" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    ${motionArrow(40, 22, 20, 40, "#fca5a5", 2.6)}
    ${destRing(18, 42, 6, "#93c5fd")}
    <path d="M50 12 L54 8 M12 48 L8 52" stroke="#e9d5ff" stroke-width="1.6" stroke-linecap="round" opacity="0.55"/>
    <path d="M28 32 L36 24" stroke="#fde68a" stroke-width="1.6" stroke-dasharray="3 2" opacity="0.55"/>
    ${sparkles([[36, 26, 0.7], [22, 38, 0.6]], "#fca5a5", 0.5)}`;
}

/** Forward-diagonal dash with impact on enemy square. */
function dashMotif() {
  return `${groundShadow(30, 54, 18, 4)}
    ${allyPro(18, 50, 5)}
    ${tokenPro(44, 28, 5)}
    ${motionArrow(22, 46, 40, 32, "#c4b5fd", 2.8)}
    ${destRing(42, 30, 5, "#a78bfa")}
    ${burst(44, 28, 5, "#ef4444", "#991b1b")}
    <path d="M34 36 L46 24" stroke="#fde68a" stroke-width="1.4" stroke-dasharray="3 2" opacity="0.5"/>
    ${sparkles([[38, 34, 0.7]], "#e9d5ff", 0.5)}`;
}

/** Horizontal blizzard freezing a row of enemies. */
function blizzardMotif() {
  return `${groundShadow(32, 54, 26, 4)}
    <path d="M4 32 H60" stroke="#0f172a" stroke-width="6" opacity="0.15"/>
    <path d="M4 32 H60" stroke="#bae6fd" stroke-width="4.5" opacity="0.4"/>
    <path d="M4 32 H60" stroke="#e0f2fe" stroke-width="2" opacity="0.9"/>
    ${tokenPro(16, 32, 4.5)}${tokenPro(32, 32, 4.5)}${tokenPro(48, 32, 4.5)}
    <path d="M10 22 L14 26 M24 22 L28 26 M38 22 L42 26 M50 22 L54 26" stroke="#e0f2fe" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M12 20 L16 24 M26 20 L30 24 M40 20 L44 24 M52 20 L56 24" stroke="#7dd3fc" stroke-width="1.4" stroke-linecap="round" opacity="0.8"/>
    <path d="M48 10 L52 6 M54 14 L58 10 M8 16 L4 12 M6 22 L2 18" stroke="#e0f2fe" stroke-width="1.6" stroke-linecap="round" opacity="0.7"/>
    <circle cx="52" cy="8" r="7" fill="#7dd3fc" opacity="0.18"/>
    <text x="50" y="12" font-size="10" fill="#e0f2fe" opacity="0.85">❄</text>
    ${sparkles([[8, 10, 0.8], [56, 12, 0.9], [32, 18, 0.7]], "#e0f2fe", 0.65)}`;
}

/** Diagonal line of allies sharing a bulwark shield. */
function bulwarkMotif() {
  return `${groundShadow(32, 54, 22, 4)}
    ${allyPro(14, 48, 4.5)}${allyPro(32, 32, 5.5)}${allyPro(50, 16, 4.5)}
    <path d="M8 52 L56 12" stroke="#0f172a" stroke-width="3" opacity="0.2" stroke-dasharray="5 3"/>
    <path d="M8 52 L56 12" stroke="#c4b5fd" stroke-width="2.2" opacity="0.45" stroke-dasharray="5 3"/>
    <path d="M24 24 L40 40 L24 48 L8 40 Z" fill="#7c3aed" opacity="0.5" stroke="#0f172a" stroke-width="2.2" transform="translate(4, 2)"/>
    <path d="M24 24 L40 40 L24 48 L8 40 Z" fill="none" stroke="#c4b5fd" stroke-width="1.6" transform="translate(4, 2)"/>
    <path d="M28 30 L34 36 M34 30 L28 36" stroke="#f0e6ff" stroke-width="2" stroke-linecap="round" opacity="0.75"/>
    <circle cx="32" cy="36" r="14" fill="#a78bfa" opacity="0.12"/>
    ${shieldPro(32, 34, "#7c3aed", "#e9d5ff")}
    ${sparkles([[20, 40, 0.7], [44, 24, 0.7], [32, 28, 0.8]], "#e9d5ff", 0.55)}`;
}

/** Darkness void protecting pieces in a 7-square zone. */
function darknessMotif() {
  return `${groundShadow(32, 54, 24, 4)}
    <circle cx="32" cy="32" r="24" fill="#1e1b4b" opacity="0.68" stroke="#0f172a" stroke-width="2.4"/>
    <circle cx="32" cy="32" r="24" fill="none" stroke="#6d28d9" stroke-width="1.8"/>
    <circle cx="32" cy="32" r="17" fill="#312e81" opacity="0.48"/>
    <circle cx="32" cy="32" r="10" fill="#4c1d95" opacity="0.32"/>
    ${allyPro(32, 32, 4.5)}${allyPro(22, 22, 3.5)}${allyPro(42, 22, 3.5)}${allyPro(22, 42, 3.5)}${allyPro(42, 42, 3.5)}
    <path d="M16 16 L48 48 M48 16 L16 48" stroke="#a78bfa" stroke-width="1.2" opacity="0.32"/>
    <circle cx="32" cy="32" r="24" fill="none" stroke="#c4b5fd" stroke-width="1.6" opacity="0.5"/>
    <circle cx="32" cy="32" r="28" fill="none" stroke="#7c3aed" stroke-width="0.8" opacity="0.25"/>
    ${sparkles([[16, 10, 0.7], [48, 10, 0.7], [10, 32, 0.6], [54, 32, 0.6]], "#c4b5fd", 0.45)}`;
}

/** Piece fortified in rings, then shielded. */
function fortifyMotif() {
  return `${groundShadow(32, 56, 16, 4)}
    ${allyPro(32, 34, 6)}
    <circle cx="32" cy="34" r="14" fill="none" stroke="#0f172a" stroke-width="2.8" opacity="0.2"/>
    <circle cx="32" cy="34" r="14" fill="none" stroke="#a78bfa" stroke-width="2.4" opacity="0.75"/>
    <circle cx="32" cy="34" r="19" fill="none" stroke="#7c3aed" stroke-width="1.8" opacity="0.55"/>
    <circle cx="32" cy="34" r="24" fill="none" stroke="#6d28d9" stroke-width="1.2" opacity="0.35"/>
    <path d="M32 14 L32 20 M32 48 L32 54 M14 34 L20 34 M44 34 L50 34" stroke="#c4b5fd" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
    ${shieldPro(32, 30, "#7c3aed", "#e9d5ff")}
    <text x="18" y="54" font-size="7" fill="#ddd6fe" opacity="0.8" font-weight="700">HOLD</text>
    ${sparkles([[32, 12, 0.8], [12, 34, 0.6], [52, 34, 0.6]], "#e9d5ff", 0.5)}`;
}

/** Sleeping piece awakening into a crowned bear-marked king. */
function hibernationMotif() {
  return `${groundShadow(32, 56, 16, 4)}
    ${allyPro(32, 38, 6)}
    <text x="14" y="16" font-size="11" fill="#c4b5fd" opacity="0.85" font-style="italic" font-weight="600">zzz</text>
    <path d="M20 10 C28 6 36 6 44 10" stroke="#a78bfa" stroke-width="2" fill="none" opacity="0.55"/>
    <path d="M20 14 L24 6 L28 12 L32 2 L36 12 L40 6 L44 14 L44 22 H20 Z" fill="#fbbf24" opacity="0.88" stroke="#0f172a" stroke-width="1.6"/>
    <path d="M20 14 L24 6 L28 12 L32 2 L36 12 L40 6 L44 14 L44 22 H20 Z" fill="none" stroke="#b45309" stroke-width="1.2"/>
    <circle cx="24" cy="10" r="1.5" fill="#fde68a"/><circle cx="32" cy="6" r="1.5" fill="#fde68a"/><circle cx="40" cy="10" r="1.5" fill="#fde68a"/>
    <circle cx="32" cy="52" r="5" fill="#fbbf24" opacity="0.45"/>
    <path d="M24 50 C30 44 34 44 40 50" stroke="#fde68a" stroke-width="2" fill="none" opacity="0.7"/>
    ${burst(32, 14, 5, "#fde68a", "#b45309")}
    ${sparkles([[32, 4, 0.8], [18, 8, 0.6], [46, 8, 0.6]], "#fde68a", 0.55)}`;
}

/** Hidden vengeance trap with blood counters on a piece. */
function vengeanceMotif() {
  return `${groundShadow(30, 54, 18, 4)}
    ${allyPro(28, 36, 6)}
    <circle cx="48" cy="22" r="10" fill="none" stroke="#0f172a" stroke-width="2" opacity="0.2"/>
    <circle cx="48" cy="22" r="10" fill="none" stroke="#f87171" stroke-width="2" opacity="0.65"/>
    <circle cx="48" cy="22" r="13" fill="#ef4444" opacity="0.1"/>
    <path d="M34 32 L44 24" stroke="#0f172a" stroke-width="3.4" stroke-linecap="round" opacity="0.2"/>
    <path d="M34 32 L44 24" stroke="#fca5a5" stroke-width="2.8" stroke-linecap="round"/>
    <path d="M14 50 L18 46 M20 52 L24 48" stroke="#dc2626" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
    <circle cx="16" cy="50" r="2.5" fill="#ef4444" opacity="0.9" stroke="#991b1b" stroke-width="0.8"/>
    <circle cx="22" cy="48" r="2.2" fill="#ef4444" opacity="0.7"/>
    <path d="M10 14 L14 18 L10 22 L6 18 Z" fill="#4c1d95" opacity="0.6" stroke="#0f172a" stroke-width="1.4"/>
    <path d="M10 14 L14 18 L10 22 L6 18 Z" fill="none" stroke="#a78bfa" stroke-width="1.2"/>
    <text x="8" y="19" font-size="6" fill="#e9d5ff" opacity="0.7" font-weight="700">?</text>
    <path d="M6 18 L14 26" stroke="#c4b5fd" stroke-width="1.2" stroke-dasharray="3 2" opacity="0.45"/>
    ${sparkles([[12, 12, 0.7], [46, 18, 0.6]], "#fca5a5", 0.5)}`;
}

/** Hex sanctuary shielding allies from capture. */
function sanctuaryMotif() {
  return `${groundShadow(32, 54, 20, 4)}
    <path d="M32 6 L52 16 V40 L32 52 L12 40 V16 Z" fill="#312e81" opacity="0.55" stroke="#0f172a" stroke-width="2.4"/>
    <path d="M32 6 L52 16 V40 L32 52 L12 40 V16 Z" fill="none" stroke="#a78bfa" stroke-width="1.8"/>
    <path d="M32 10 L48 18 V38 L32 48 L16 38 V18 Z" fill="none" stroke="#c4b5fd" stroke-width="0.9" opacity="0.4"/>
    ${allyPro(32, 30, 4.5)}${allyPro(22, 20, 3.5)}${allyPro(42, 20, 3.5)}${allyPro(22, 40, 3.5)}${allyPro(42, 40, 3.5)}
    <path d="M32 10 L35 22 H46 L38 28 L40 40 L32 34 L24 40 L26 28 L18 22 H29 Z" fill="#c4b5fd" opacity="0.55" stroke="#0f172a" stroke-width="1.2"/>
    <path d="M32 10 L35 22 H46 L38 28 L40 40 L32 34 L24 40 L26 28 L18 22 H29 Z" fill="none" stroke="#f0e6ff" stroke-width="0.9"/>
    ${sparkles([[32, 8, 0.8], [14, 28, 0.6], [50, 28, 0.6]], "#e9d5ff", 0.5)}`;
}

/** Two allies merging into one empowered piece. */
function fusionMotif() {
  return `${groundShadow(32, 54, 20, 4)}
    ${allyPro(16, 42, 4.5)}${allyPro(48, 42, 4.5)}
    <path d="M22 42 C28 32 36 32 42 42" stroke="#0f172a" stroke-width="3.4" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M22 42 C28 32 36 32 42 42" stroke="#fde68a" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M20 40 L30 28 M44 40 L34 28" stroke="#fbbf24" stroke-width="1.6" opacity="0.55"/>
    <circle cx="32" cy="24" r="10" fill="#2563eb" stroke="#0f172a" stroke-width="2.4" opacity="0.92"/>
    <circle cx="32" cy="24" r="8" fill="#3b82f6"/>
    <ellipse cx="32" cy="22" rx="6" ry="3.5" fill="#93c5fd" opacity="0.4"/>
    <path d="M26 18 L32 10 L38 18" stroke="#0f172a" stroke-width="2.4" fill="none" stroke-linecap="round" opacity="0.25"/>
    <path d="M26 18 L32 10 L38 18" stroke="#fbbf24" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M24 28 H40 M32 22 V32" stroke="#e9d5ff" stroke-width="1.8" opacity="0.55"/>
    ${burst(32, 24, 7, "#60a5fa", "#1d4ed8")}
    ${sparkles([[24, 36, 0.7], [40, 36, 0.7], [32, 8, 0.9]], "#fde68a", 0.6)}`;
}

/** Chameleon copying multiple movement patterns. */
function chameleonMotif() {
  return `${groundShadow(32, 54, 18, 4)}
    ${allyPro(32, 34, 6)}
    <ellipse cx="32" cy="18" rx="12" ry="7" fill="#a78bfa" opacity="0.32" stroke="#c4b5fd" stroke-width="1"/>
    <path d="M10 18 L32 34 L54 18" stroke="#0f172a" stroke-width="3" fill="none" opacity="0.2"/>
    <path d="M10 18 L32 34 L54 18" stroke="#86efac" stroke-width="2.4" fill="none" opacity="0.65"/>
    <path d="M32 6 L32 34 M10 50 L32 34 L54 50" stroke="#0f172a" stroke-width="3" fill="none" opacity="0.2"/>
    <path d="M32 6 L32 34 M10 50 L32 34 L54 50" stroke="#93c5fd" stroke-width="2.4" fill="none" opacity="0.65"/>
    <path d="M14 14 L32 34 L50 50" stroke="#fca5a5" stroke-width="2" fill="none" opacity="0.5" stroke-dasharray="4 2"/>
    <circle cx="10" cy="18" r="4.5" fill="#4ade80" opacity="0.65" stroke="#0f172a" stroke-width="1.4"/>
    <circle cx="54" cy="18" r="4.5" fill="#60a5fa" opacity="0.65" stroke="#0f172a" stroke-width="1.4"/>
    <circle cx="10" cy="50" r="4.5" fill="#f87171" opacity="0.55" stroke="#0f172a" stroke-width="1.4"/>
    ${sparkles([[32, 12, 0.8], [8, 34, 0.6], [56, 34, 0.6]], "#e9d5ff", 0.55)}`;
}

/** Blindfold blocking opponent card play. */
function blindMotif() {
  return `${groundShadow(32, 54, 20, 4)}
    <path d="M12 26 C24 16 40 16 52 26 C40 38 24 38 12 26 Z" fill="#312e81" opacity="0.78" stroke="#0f172a" stroke-width="2.4"/>
    <path d="M12 26 C24 16 40 16 52 26 C40 38 24 38 12 26 Z" fill="none" stroke="#a78bfa" stroke-width="1.8"/>
    <path d="M18 26 H46" stroke="#0f172a" stroke-width="3.6"/>
    <path d="M18 26 H46" stroke="#1e1b4b" stroke-width="2.4"/>
    <path d="M16 24 C26 22 38 22 48 24" stroke="#c4b5fd" stroke-width="1.2" fill="none" opacity="0.45"/>
    <rect x="34" y="8" width="18" height="26" rx="2.5" fill="#4c1d95" stroke="#0f172a" stroke-width="2" transform="rotate(12 43 21)"/>
    <rect x="34" y="8" width="18" height="26" rx="2.5" fill="none" stroke="#c4b5fd" stroke-width="1.4" transform="rotate(12 43 21)"/>
    <path d="M36 14 L54 32 M54 14 L36 32" stroke="#0f172a" stroke-width="3.6" stroke-linecap="round" opacity="0.3"/>
    <path d="M36 14 L54 32 M54 14 L36 32" stroke="#f87171" stroke-width="2.8" stroke-linecap="round"/>
    <circle cx="46" cy="22" r="11" fill="none" stroke="#fca5a5" stroke-width="1.8" opacity="0.55"/>
    <circle cx="46" cy="22" r="14" fill="#ef4444" opacity="0.08"/>
    ${sparkles([[46, 16, 0.7], [24, 20, 0.5]], "#c4b5fd", 0.45)}`;
}

/** Trickster chaos — pieces scattered with crossing swap trails. */
function tricksterMotif() {
  return `${groundShadow(32, 54, 24, 4)}
    ${allyPro(12, 16, 4)}${tokenPro(52, 16, 4)}${allyPro(12, 50, 4)}${tokenPro(52, 50, 4)}
    <path d="M16 16 L48 50 M52 16 L16 50" stroke="#0f172a" stroke-width="3.2" opacity="0.2"/>
    <path d="M16 16 L48 50 M52 16 L16 50" stroke="#c4b5fd" stroke-width="2.4" opacity="0.65"/>
    <path d="M16 16 L52 16 M12 50 L52 50 M16 16 L16 50 M52 16 L52 50" stroke="#a78bfa" stroke-width="1.4" opacity="0.35" stroke-dasharray="4 2"/>
    ${runeGlow(32, 32, 6, "#fde68a")}
    <text x="26" y="38" font-size="14" fill="#fde68a" opacity="0.95" font-weight="700">✦</text>
    <path d="M20 20 L44 42 M44 20 L20 42" stroke="#e9d5ff" stroke-width="1.6" opacity="0.5"/>
    ${burst(32, 32, 6, "#fde68a", "#b45309")}
    ${sparkles([[8, 8, 0.7], [56, 8, 0.7], [8, 56, 0.7], [56, 56, 0.7]], "#fde68a", 0.6)}`;
}

/* ── Common spell motifs ── */

function nudgeMotif() {
  return `${groundShadow(28, 54, 18, 4)}
    ${allyPro(18, 44, 5.5)}
    ${destRing(42, 24, 6, "#cbd5e1")}
    ${motionArrow(24, 40, 38, 28, "#e2e8f0", 3)}
    <path d="M20 38 C26 32 32 28 36 26" stroke="#0f172a" stroke-width="2.4" fill="none" opacity="0.2"/>
    <path d="M20 38 C26 32 32 28 36 26" stroke="#94a3b8" stroke-width="1.6" fill="none" opacity="0.45"/>
    <ellipse cx="36" cy="28" rx="6" ry="3" fill="#64748b" opacity="0.2"/>
    <path d="M12 18 L16 14 M50 12 L54 8" stroke="#cbd5e1" stroke-width="1.6" stroke-linecap="round" opacity="0.5"/>
    ${sparkles([[40, 20, 0.7], [22, 36, 0.5]], "#e2e8f0", 0.45)}`;
}

function backstepMotif() {
  return `${groundShadow(32, 54, 16, 4)}
    ${allyPro(32, 20, 5.5)}
    ${destRing(32, 48, 6, "#cbd5e1")}
    ${motionArrow(32, 26, 32, 42, "#e2e8f0", 3)}
    <path d="M24 34 C28 40 30 44 32 46" stroke="#0f172a" stroke-width="2.4" fill="none" opacity="0.2"/>
    <path d="M24 34 C28 40 30 44 32 46" stroke="#94a3b8" stroke-width="1.6" fill="none" opacity="0.45"/>
    <ellipse cx="32" cy="50" rx="10" ry="3.5" fill="#64748b" opacity="0.28"/>
    <path d="M26 48 L32 54 L38 48" stroke="#94a3b8" stroke-width="1.4" fill="none" opacity="0.35"/>
    ${sparkles([[32, 16, 0.6], [32, 44, 0.5]], "#cbd5e1", 0.4)}`;
}

function retreatMotif() {
  return `${groundShadow(32, 54, 16, 4)}
    ${allyPro(32, 26, 5.5)}
    ${motionArrow(32, 32, 32, 50, "#93c5fd", 3)}
    <path d="M22 46 L32 54 L42 46" stroke="#60a5fa" stroke-width="2" fill="none" opacity="0.55"/>
    <text x="42" y="48" font-size="9" fill="#cbd5e1" opacity="0.95" font-weight="700">×3</text>
    <circle cx="32" cy="40" r="12" fill="none" stroke="#0f172a" stroke-width="1.4" opacity="0.15"/>
    <circle cx="32" cy="40" r="12" fill="none" stroke="#93c5fd" stroke-width="1.2" opacity="0.35"/>
    <ellipse cx="32" cy="36" rx="5" ry="2.5" fill="#1e3a8a" opacity="0.2"/>
    <ellipse cx="32" cy="44" rx="6" ry="2.5" fill="#1e3a8a" opacity="0.15"/>
    ${sparkles([[32, 22, 0.6]], "#93c5fd", 0.4)}`;
}

function anchorMotif() {
  return `${groundShadow(32, 54, 20, 4)}
    ${allyPro(20, 36, 4.5)}${allyPro(44, 36, 4.5)}
    <path d="M32 8 V24 M32 24 C32 34 22 36 22 44 C22 52 32 54 32 54 C32 54 42 52 42 44 C42 36 32 34 32 24 Z" fill="#94a3b8" opacity="0.78" stroke="#0f172a" stroke-width="2"/>
    <path d="M32 8 V24 M32 24 C32 34 22 36 22 44 C22 52 32 54 32 54 C32 54 42 52 42 44 C42 36 32 34 32 24 Z" fill="none" stroke="#e2e8f0" stroke-width="1.6"/>
    <path d="M26 28 L38 28 M28 38 L36 38" stroke="#cbd5e1" stroke-width="1.4" opacity="0.55"/>
    <path d="M16 36 L24 36 M40 36 L48 36" stroke="#64748b" stroke-width="1.6" stroke-dasharray="3 2" opacity="0.4"/>
    <path d="M30 10 L34 10 M32 6 L32 12" stroke="#e2e8f0" stroke-width="1.4" stroke-linecap="round" opacity="0.5"/>
    ${sparkles([[32, 6, 0.7]], "#cbd5e1", 0.4)}`;
}

function recallMotif() {
  return `${groundShadow(32, 54, 22, 4)}
    ${allyPro(32, 24, 5.5)}
    ${motionArrow(32, 30, 32, 46, "#93c5fd", 2.8)}
    <path d="M6 52 H58" stroke="#0f172a" stroke-width="3" opacity="0.2"/>
    <path d="M6 52 H58" stroke="#64748b" stroke-width="2.4" opacity="0.6"/>
    <rect x="8" y="48" width="48" height="7" rx="1.5" fill="#475569" opacity="0.5" stroke="#0f172a" stroke-width="1.2"/>
    <rect x="10" y="50" width="44" height="3" rx="0.5" fill="#64748b" opacity="0.3"/>
    <path d="M12 46 L16 42 M52 46 L48 42" stroke="#94a3b8" stroke-width="1.6" stroke-linecap="round" opacity="0.5"/>
    <text x="14" y="47" font-size="5.5" fill="#cbd5e1" opacity="0.85" font-weight="700">BACK ROW</text>
    ${sparkles([[20, 40, 0.5], [44, 40, 0.5]], "#93c5fd", 0.4)}`;
}

function repelMotif() {
  return `${groundShadow(30, 54, 20, 4)}
    ${allyPro(20, 36, 5)}${tokenPro(40, 36, 5)}
    ${destRing(54, 36, 5, "#fca5a5")}
    ${motionArrow(26, 36, 50, 36, "#fde68a", 3)}
    <path d="M32 30 L42 30" stroke="#0f172a" stroke-width="2.4" opacity="0.2"/>
    <path d="M32 30 L42 30" stroke="#fbbf24" stroke-width="1.8" opacity="0.55"/>
    ${burst(46, 36, 5, "#fca5a5", "#dc2626")}
    ${sparkles([[48, 32, 0.6]], "#fde68a", 0.45)}`;
}

function leapfrogMotif() {
  return `${groundShadow(28, 54, 20, 4)}
    ${allyPro(12, 50, 4.5)}${allyPro(28, 32, 4.5)}
    ${destRing(46, 16, 5, "#cbd5e1")}
    <path d="M16 46 Q30 10 44 20" stroke="#0f172a" stroke-width="4" fill="none" opacity="0.2"/>
    <path d="M16 46 Q30 10 44 20" stroke="#93c5fd" stroke-width="2.8" fill="none"/>
    ${energyArc(16, 46, 44, 20, "#93c5fd", 2.6)}
    <path d="M42 18 L46 14 M42 22 L46 26" stroke="#93c5fd" stroke-width="2" fill="none" stroke-linecap="round"/>
    <ellipse cx="28" cy="34" rx="7" ry="3.5" fill="#1e3a8a" opacity="0.3"/>
    ${sparkles([[30, 14, 0.8], [20, 38, 0.5]], "#bae6fd", 0.5)}`;
}

function randomTeleportMotif() {
  return `${groundShadow(32, 54, 18, 4)}
    ${allyPro(32, 40, 5.5)}
    <path d="M12 14 Q32 2 52 14 Q44 32 32 24 Q20 32 12 14" stroke="#0f172a" stroke-width="3" fill="#7c3aed" fill-opacity="0.15" opacity="0.3"/>
    <path d="M12 14 Q32 2 52 14 Q44 32 32 24 Q20 32 12 14" stroke="#c4b5fd" stroke-width="2.4" fill="#7c3aed" fill-opacity="0.12" opacity="0.7" stroke-dasharray="4 2"/>
    ${destRing(26, 16, 5, "#93c5fd")}${destRing(44, 28, 4, "#c4b5fd")}
    <text x="40" y="18" font-size="14" fill="#fde68a" opacity="0.95" font-weight="700">?</text>
    <path d="M18 10 L22 6 M46 8 L50 4" stroke="#e9d5ff" stroke-width="1.6" stroke-linecap="round" opacity="0.55"/>
    ${sparkles([[24, 12, 0.8], [48, 20, 0.7], [32, 6, 0.9]], "#e9d5ff", 0.55)}`;
}

function rallyMotif() {
  return `${groundShadow(32, 54, 22, 4)}
    ${allyPro(32, 30, 6)}${allyPro(14, 46, 4)}${allyPro(50, 46, 4)}
    <circle cx="32" cy="30" r="22" fill="none" stroke="#0f172a" stroke-width="2" opacity="0.15"/>
    <circle cx="32" cy="30" r="22" fill="none" stroke="#93c5fd" stroke-width="2" opacity="0.5"/>
    <circle cx="32" cy="30" r="16" fill="#2563eb" opacity="0.1"/>
    <path d="M14 46 L24 36 M50 46 L40 36" stroke="#0f172a" stroke-width="2.8" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M14 46 L24 36 M50 46 L40 36" stroke="#60a5fa" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.65"/>
    <path d="M32 12 L35 20 H42 L36 26 L38 32 L32 28 L26 32 L28 26 L22 20 H29 Z" fill="#60a5fa" opacity="0.28" stroke="#0f172a" stroke-width="1"/>
    <path d="M32 12 L35 20 H42 L36 26 L38 32 L32 28 L26 32 L28 26 L22 20 H29 Z" fill="none" stroke="#93c5fd" stroke-width="0.9"/>
    ${sparkles([[32, 10, 0.8], [16, 40, 0.5], [48, 40, 0.5]], "#93c5fd", 0.45)}`;
}

function ignoreMotif() {
  return `${groundShadow(32, 54, 16, 4)}
    ${allyPro(32, 36, 6)}
    <circle cx="16" cy="20" r="12" fill="#ef4444" opacity="0.12" stroke="#0f172a" stroke-width="1.8"/>
    <circle cx="16" cy="20" r="12" fill="none" stroke="#f87171" stroke-width="1.6"/>
    <path d="M10 14 L22 26 M22 14 L10 26" stroke="#0f172a" stroke-width="3.6" stroke-linecap="round" opacity="0.3"/>
    <path d="M10 14 L22 26 M22 14 L10 26" stroke="#f87171" stroke-width="2.8" stroke-linecap="round"/>
    <text x="36" y="18" font-size="8" fill="#cbd5e1" opacity="0.9" font-weight="700">SKIP</text>
    <path d="M26 30 L38 30" stroke="#94a3b8" stroke-width="1.6" stroke-dasharray="3 2" opacity="0.45"/>
    ${sparkles([[16, 12, 0.6]], "#fca5a5", 0.4)}`;
}

function ironWillMotif() {
  return `${groundShadow(32, 54, 18, 4)}
    ${allyPro(32, 34, 6)}
    <path d="M12 18 C22 34 16 50 32 50 C48 50 42 34 52 18" stroke="#0f172a" stroke-width="3.2" fill="none" opacity="0.25"/>
    <path d="M12 18 C22 34 16 50 32 50 C48 50 42 34 52 18" stroke="#94a3b8" stroke-width="2.6" fill="none"/>
    <path d="M16 26 L26 36 M48 26 L38 36" stroke="#0f172a" stroke-width="3.4" stroke-linecap="round" opacity="0.25"/>
    <path d="M16 26 L26 36 M48 26 L38 36" stroke="#e2e8f0" stroke-width="2.8" stroke-linecap="round"/>
    <path d="M18 28 L24 34 M46 28 L40 34" stroke="#64748b" stroke-width="1.6" stroke-linecap="round" opacity="0.5"/>
    <circle cx="32" cy="34" r="14" fill="none" stroke="#cbd5e1" stroke-width="1" opacity="0.3"/>
    ${sparkles([[32, 20, 0.7]], "#e2e8f0", 0.4)}`;
}

function demoteMotif() {
  return `${groundShadow(32, 54, 16, 4)}
    ${tokenPro(32, 40, 6)}
    <path d="M18 12 L22 2 L26 8 L32 -2 L38 8 L42 2 L46 12 L46 20 H18 Z" fill="#fbbf24" opacity="0.72" stroke="#0f172a" stroke-width="2"/>
    <path d="M18 12 L22 2 L26 8 L32 -2 L38 8 L42 2 L46 12 L46 20 H18 Z" fill="none" stroke="#b45309" stroke-width="1.4"/>
    <path d="M20 14 L44 38 M44 14 L20 38" stroke="#0f172a" stroke-width="3.2" opacity="0.3"/>
    <path d="M20 14 L44 38 M44 14 L20 38" stroke="#fca5a5" stroke-width="2.6" opacity="0.85"/>
    <path d="M26 6 L32 10 L38 6" stroke="#fde68a" stroke-width="1.4" fill="none" opacity="0.55"/>
    ${burst(32, 26, 6, "#fca5a5", "#dc2626")}
    ${sparkles([[24, 4, 0.6], [40, 4, 0.6]], "#fde68a", 0.45)}`;
}

function quicksandMotif() {
  return `${groundShadow(32, 54, 18, 4)}
    ${trapTile(32, 36, 32)}
    <path d="M16 44 C26 34 38 34 48 44 C38 54 26 54 16 44 Z" fill="#a8a29e" opacity="0.62" stroke="#0f172a" stroke-width="1.6"/>
    <path d="M20 40 C28 36 36 36 44 40" stroke="#d6d3d1" stroke-width="1.6" fill="none" opacity="0.55"/>
    <path d="M22 46 C30 42 34 42 42 46" stroke="#78716c" stroke-width="1.4" fill="none" opacity="0.4"/>
    <text x="38" y="16" font-size="10" fill="#d6d3d1" opacity="0.75" font-weight="700">?</text>
    <path d="M24 38 L28 42 M36 38 L32 42" stroke="#d6d3d1" stroke-width="1.2" stroke-linecap="round" opacity="0.35"/>
    ${sparkles([[30, 36, 0.5]], "#d6d3d1", 0.35)}`;
}

function createFoeMotif() {
  return `${groundShadow(32, 54, 16, 4)}
    <rect x="16" y="18" width="32" height="32" rx="2.5" fill="#292524" opacity="0.48" stroke="#0f172a" stroke-width="2"/>
    <rect x="16" y="18" width="32" height="32" rx="2.5" fill="none" stroke="#57534e" stroke-width="1.4"/>
    <path d="M18 20 H46 M18 48 H46 M18 20 V48 M46 20 V48" stroke="#78716c" stroke-width="0.8" opacity="0.3"/>
    ${tokenPro(32, 34, 6)}
    <path d="M40 14 L46 8 M42 18 L48 12" stroke="#fca5a5" stroke-width="2" stroke-linecap="round" opacity="0.75"/>
    <text x="40" y="16" font-size="12" fill="#fca5a5" opacity="0.95" font-weight="700">+</text>
    ${burst(32, 34, 5, "#ef4444", "#991b1b")}
    ${sparkles([[46, 10, 0.7]], "#fca5a5", 0.5)}`;
}

function barrierMotif() {
  return `${groundShadow(32, 54, 16, 4)}
    <rect x="18" y="14" width="28" height="36" rx="2.5" fill="#334155" opacity="0.45" stroke="#0f172a" stroke-width="2"/>
    <rect x="18" y="14" width="28" height="36" rx="2.5" fill="none" stroke="#64748b" stroke-width="1.4"/>
    <path d="M22 16 V50 M42 16 V50" stroke="#0f172a" stroke-width="4.2" opacity="0.25"/>
    <path d="M22 16 V50 M42 16 V50" stroke="#cbd5e1" stroke-width="3.4" opacity="0.9"/>
    <path d="M20 22 H46 M20 32 H46 M20 42 H46" stroke="#94a3b8" stroke-width="1.2" opacity="0.45"/>
    <path d="M24 18 L28 22 L24 26 M38 18 L34 22 L38 26" stroke="#e2e8f0" stroke-width="1.4" stroke-linecap="round" opacity="0.55"/>
    ${sparkles([[32, 20, 0.5], [32, 40, 0.5]], "#cbd5e1", 0.35)}`;
}

function panicMotif() {
  return `${groundShadow(32, 54, 16, 4)}
    ${tokenPro(32, 22, 6)}
    <path d="M24 14 L28 10 M40 14 L36 10" stroke="#fca5a5" stroke-width="2" stroke-linecap="round" opacity="0.75"/>
    <path d="M26 12 L30 8 M38 12 L34 8" stroke="#ef4444" stroke-width="1.2" stroke-linecap="round" opacity="0.45"/>
    ${motionArrow(32, 30, 32, 50, "#fca5a5", 3)}
    <path d="M24 50 L32 42 L40 50" stroke="#0f172a" stroke-width="2.8" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M24 50 L32 42 L40 50" stroke="#fca5a5" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <circle cx="32" cy="28" r="12" fill="#ef4444" opacity="0.1"/>
    ${burst(32, 48, 5, "#fca5a5", "#dc2626")}
    ${sparkles([[28, 16, 0.6], [36, 16, 0.6]], "#fca5a5", 0.45)}`;
}

function shadowSwapMotif() {
  return `${groundShadow(32, 54, 20, 4)}
    ${allyPro(16, 34, 5.5)}${allyPro(48, 34, 5.5)}
    <path d="M22 34 L42 34" stroke="#0f172a" stroke-width="3.6" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M22 34 L42 34" stroke="#93c5fd" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M42 28 L22 28" stroke="#0f172a" stroke-width="3.6" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M42 28 L22 28" stroke="#c4b5fd" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M32 22 L32 46" stroke="#fde68a" stroke-width="2" stroke-dasharray="3 2" opacity="0.6"/>
    <circle cx="32" cy="34" r="8" fill="#a78bfa" opacity="0.15" stroke="#c4b5fd" stroke-width="1"/>
    ${runeGlow(32, 34, 4, "#c4b5fd")}
    ${sparkles([[32, 30, 0.7]], "#e9d5ff", 0.45)}`;
}

function sidestepMotif() {
  return `${groundShadow(28, 54, 18, 4)}
    ${allyPro(12, 34, 5.5)}
    ${destRing(50, 34, 6, "#cbd5e1")}
    ${motionArrow(18, 34, 44, 34, "#e2e8f0", 3)}
    <path d="M22 28 L28 34 L22 40" stroke="#0f172a" stroke-width="2" fill="none" opacity="0.2"/>
    <path d="M22 28 L28 34 L22 40" stroke="#94a3b8" stroke-width="1.6" fill="none" opacity="0.45"/>
    <text x="28" y="18" font-size="7" fill="#cbd5e1" opacity="0.7" font-weight="700">×2</text>
    <ellipse cx="28" cy="34" rx="5" ry="2.5" fill="#64748b" opacity="0.2"/>
    ${sparkles([[46, 30, 0.6]], "#e2e8f0", 0.4)}`;
}

function pressMotif() {
  return `${groundShadow(32, 54, 18, 4)}
    ${tokenPro(32, 28, 6)}
    ${motionArrow(32, 36, 32, 54, "#fca5a5", 3)}
    <path d="M32 54 L26 46 M32 54 L38 46" stroke="#0f172a" stroke-width="2.8" fill="none" stroke-linecap="round" opacity="0.25"/>
    <path d="M32 54 L26 46 M32 54 L38 46" stroke="#fca5a5" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M18 54 H46" stroke="#0f172a" stroke-width="2.4" opacity="0.25"/>
    <path d="M18 54 H46" stroke="#64748b" stroke-width="1.8" opacity="0.55"/>
    <path d="M24 46 L28 50 L32 46 L36 50 L40 46" stroke="#f87171" stroke-width="1.4" fill="none" opacity="0.45"/>
    ${burst(32, 52, 5, "#fca5a5", "#dc2626")}`;
}

function wardMotif() {
  return `${groundShadow(32, 56, 16, 4)}
    ${allyPro(32, 38, 6)}
    ${shieldPro(32, 30, "#60a5fa", "#93c5fd")}
    <circle cx="32" cy="32" r="18" fill="none" stroke="#0f172a" stroke-width="1.6" opacity="0.15"/>
    <circle cx="32" cy="32" r="18" fill="none" stroke="#93c5fd" stroke-width="1.2" opacity="0.35"/>
    ${sparkles([[32, 18, 0.7], [20, 32, 0.5], [44, 32, 0.5]], "#bae6fd", 0.4)}`;
}

function snowballMotif() {
  return `${groundShadow(32, 54, 18, 4)}
    ${allyPro(32, 36, 6)}
    <circle cx="16" cy="18" r="10" fill="#e0f2fe" opacity="0.55" stroke="#0f172a" stroke-width="2"/>
    <circle cx="16" cy="18" r="10" fill="none" stroke="#7dd3fc" stroke-width="1.6"/>
    <path d="M10 12 L22 24 M22 12 L10 24" stroke="#bae6fd" stroke-width="1.4" stroke-linecap="round" opacity="0.6"/>
    <path d="M18 26 L30 34" stroke="#0f172a" stroke-width="2.8" stroke-dasharray="3 2" opacity="0.2"/>
    <path d="M18 26 L30 34" stroke="#bae6fd" stroke-width="2" stroke-dasharray="3 2" opacity="0.7"/>
    <path d="M12 8 L14 4 M18 10 L22 6" stroke="#e0f2fe" stroke-width="1.4" stroke-linecap="round" opacity="0.55"/>
    ${sparkles([[14, 10, 0.7], [20, 22, 0.5]], "#e0f2fe", 0.5)}`;
}

/* ── Uncommon spell motifs ── */

function longStepMotif() {
  return `${groundShadow(30, 54, 20, 4)}
    ${allyPro(14, 50, 5.5)}
    ${destRing(50, 14, 6, "#7dd3fc")}
    ${motionArrow(18, 46, 46, 18, "#bae6fd", 3)}
    <path d="M20 42 L32 30 L40 22" stroke="#0f172a" stroke-width="2" fill="none" opacity="0.2" stroke-dasharray="3 2"/>
    <path d="M20 42 L32 30 L40 22" stroke="#38bdf8" stroke-width="1.6" fill="none" opacity="0.45" stroke-dasharray="3 2"/>
    <ellipse cx="30" cy="36" rx="6" ry="3" fill="#1e3a8a" opacity="0.2"/>
    ${sparkles([[48, 12, 0.7], [24, 38, 0.5]], "#bae6fd", 0.45)}`;
}

function aegisMotif() {
  return `${groundShadow(32, 56, 16, 4)}
    ${allyPro(32, 38, 6)}
    ${shieldPro(32, 28, "#38bdf8", "#7dd3fc")}
    <circle cx="32" cy="34" r="20" fill="none" stroke="#0f172a" stroke-width="1.8" opacity="0.15"/>
    <circle cx="32" cy="34" r="20" fill="none" stroke="#bae6fd" stroke-width="1.8" opacity="0.55"/>
    <circle cx="32" cy="34" r="24" fill="none" stroke="#38bdf8" stroke-width="1" opacity="0.3"/>
    ${sparkles([[32, 14, 0.8], [14, 34, 0.5], [50, 34, 0.5]], "#bae6fd", 0.45)}`;
}

function poisonMotif() {
  return `${groundShadow(32, 54, 16, 4)}
    ${tokenPro(32, 34, 6)}
    <circle cx="32" cy="16" r="12" fill="#86efac" opacity="0.18" stroke="#0f172a" stroke-width="1.6"/>
    <circle cx="32" cy="16" r="12" fill="none" stroke="#4ade80" stroke-width="1.4"/>
    <path d="M26 8 C30 12 34 12 38 8 M24 14 C32 20 40 14" stroke="#86efac" stroke-width="1.8" fill="none" opacity="0.75"/>
    <path d="M24 48 H40" stroke="#0f172a" stroke-width="3.2" opacity="0.2"/>
    <path d="M24 48 H40" stroke="#4ade80" stroke-width="2.6" opacity="0.65"/>
    <path d="M26 52 H38" stroke="#22c55e" stroke-width="1.8" opacity="0.45"/>
    <circle cx="32" cy="34" r="14" fill="none" stroke="#86efac" stroke-width="1.2" opacity="0.35"/>
    ${sparkles([[32, 10, 0.7], [28, 44, 0.5], [36, 44, 0.5]], "#86efac", 0.45)}`;
}

function deflectMotif() {
  return `${groundShadow(26, 54, 16, 4)}
    ${allyPro(24, 38, 5.5)}
    <path d="M24 26 L32 18 V38 C32 46 24 50 24 50 C24 50 16 46 16 38 V22 Z" fill="#38bdf8" opacity="0.42" stroke="#0f172a" stroke-width="2"/>
    <path d="M24 26 L32 18 V38 C32 46 24 50 24 50 C24 50 16 46 16 38 V22 Z" fill="none" stroke="#7dd3fc" stroke-width="1.6"/>
    <path d="M34 24 L54 12" stroke="#0f172a" stroke-width="3.2" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M34 24 L54 12" stroke="#fde68a" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    ${tokenPro(52, 12, 4.5)}
    <path d="M36 26 L44 16" stroke="#fbbf24" stroke-width="2" opacity="0.75"/>
    <path d="M10 14 L14 18 L10 22 L6 18 Z" fill="#4c1d95" opacity="0.55" stroke="#0f172a" stroke-width="1.4"/>
    <path d="M10 14 L14 18 L10 22 L6 18 Z" fill="none" stroke="#a78bfa" stroke-width="1.2"/>
    <text x="8" y="54" font-size="6.5" fill="#cbd5e1" opacity="0.65" font-weight="700">TRAP</text>
    ${sparkles([[48, 10, 0.6]], "#fde68a", 0.45)}`;
}

function stabMotif() {
  return `${groundShadow(30, 54, 18, 4)}
    ${allyPro(20, 50, 4.5)}${tokenPro(44, 22, 5.5)}
    <path d="M24 46 L40 28" stroke="#0f172a" stroke-width="4.2" fill="none" stroke-linecap="round" opacity="0.25"/>
    <path d="M24 46 L40 28" stroke="#fde68a" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M38 26 L46 16 L42 32 L52 26 Z" fill="#e2e8f0" stroke="#0f172a" stroke-width="1.6"/>
    <path d="M40 24 L44 20" stroke="#fff" stroke-width="1" opacity="0.4"/>
    ${burst(42, 24, 6, "#ef4444", "#991b1b")}
    ${sparkles([[42, 20, 0.7]], "#fde68a", 0.5)}`;
}

function crownMotif() {
  return `${groundShadow(32, 56, 16, 4)}
    ${allyPro(32, 40, 6)}
    <path d="M18 16 L22 4 L26 10 L32 -2 L38 10 L42 4 L46 16 L46 26 H18 Z" fill="#fbbf24" opacity="0.9" stroke="#0f172a" stroke-width="2"/>
    <path d="M18 16 L22 4 L26 10 L32 -2 L38 10 L42 4 L46 16 L46 26 H18 Z" fill="none" stroke="#b45309" stroke-width="1.4"/>
    <circle cx="22" cy="8" r="1.5" fill="#fde68a"/><circle cx="32" cy="2" r="1.5" fill="#fde68a"/><circle cx="42" cy="8" r="1.5" fill="#fde68a"/>
    <circle cx="32" cy="26" r="12" fill="#fbbf24" opacity="0.2"/>
    <path d="M22 12 L28 8 L32 12 L36 8 L42 12" stroke="#fde68a" stroke-width="1.2" fill="none" opacity="0.55"/>
    <circle cx="32" cy="6" r="4" fill="#fde68a" opacity="0.4"/>
    ${sparkles([[22, 4, 0.7], [32, 0, 0.8], [42, 4, 0.7]], "#fde68a", 0.6)}`;
}

function blinkMotif() {
  return `${groundShadow(30, 54, 20, 4)}
    ${allyPro(16, 48, 5)}${tokenPro(48, 16, 4.5)}
    <circle cx="48" cy="16" r="14" fill="#38bdf8" opacity="0.12" stroke="#0f172a" stroke-width="2"/>
    <circle cx="48" cy="16" r="14" fill="none" stroke="#7dd3fc" stroke-width="1.8" opacity="0.65"/>
    <path d="M22 44 L40 22" stroke="#0f172a" stroke-width="3.4" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M22 44 L40 22" stroke="#bae6fd" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-dasharray="5 3"/>
    <circle cx="48" cy="16" r="4" fill="#38bdf8" opacity="0.8" stroke="#0f172a" stroke-width="1"/>
    <path d="M18 42 L14 46 M50 12 L54 8" stroke="#e0f2fe" stroke-width="1.4" stroke-linecap="round" opacity="0.55"/>
    ${sparkles([[46, 12, 0.8], [24, 40, 0.5]], "#e0f2fe", 0.5)}`;
}

function landmineMotif() {
  return `${groundShadow(32, 54, 16, 4)}
    ${trapTile(32, 36, 32)}
    <circle cx="32" cy="36" r="7" fill="#dc2626" stroke="#0f172a" stroke-width="2"/>
    <circle cx="32" cy="36" r="5" fill="#b91c1c"/>
    <ellipse cx="30" cy="34" rx="2.5" ry="1.8" fill="#fca5a5" opacity="0.45"/>
    <path d="M26 30 L38 42 M38 30 L26 42" stroke="#0f172a" stroke-width="2.8" opacity="0.3"/>
    <path d="M26 30 L38 42 M38 30 L26 42" stroke="#fca5a5" stroke-width="2.2"/>
    <path d="M32 26 L32 22 M26 32 L22 30 M38 32 L42 30" stroke="#ef4444" stroke-width="1.4" stroke-linecap="round" opacity="0.55"/>
    ${sparkles([[32, 24, 0.6]], "#fca5a5", 0.4)}`;
}

function backpedalMotif() {
  return `${groundShadow(32, 54, 18, 4)}
    ${tokenPro(32, 20, 6)}
    ${motionArrow(32, 28, 32, 50, "#fca5a5", 3)}
    <path d="M18 52 H46" stroke="#0f172a" stroke-width="2.8" opacity="0.25"/>
    <path d="M18 52 H46" stroke="#64748b" stroke-width="2.2" opacity="0.55"/>
    <path d="M24 48 L32 40 L40 48" stroke="#fca5a5" stroke-width="2" fill="none" opacity="0.65"/>
    <rect x="18" y="50" width="28" height="5" rx="1.5" fill="#475569" opacity="0.42" stroke="#334155" stroke-width="1"/>
    ${sparkles([[32, 44, 0.5]], "#fca5a5", 0.4)}`;
}

function rootMotif() {
  return `${groundShadow(32, 54, 16, 4)}
    ${tokenPro(32, 24, 6)}
    <path d="M18 46 C28 34 36 34 46 46" stroke="#0f172a" stroke-width="3" fill="none" opacity="0.2"/>
    <path d="M18 46 C28 34 36 34 46 46" stroke="#86efac" stroke-width="2.4" fill="none" opacity="0.85"/>
    <path d="M20 52 C30 40 34 40 44 52" stroke="#4ade80" stroke-width="2" fill="none" opacity="0.65"/>
    <path d="M24 44 L32 34 L40 44" stroke="#22c55e" stroke-width="1.8" fill="none" opacity="0.6"/>
    <path d="M26 42 L22 50 M38 42 L42 50" stroke="#16a34a" stroke-width="1.6" stroke-linecap="round" opacity="0.45"/>
  <path d="M28 48 L24 54 M36 48 L40 54" stroke="#86efac" stroke-width="1.4" stroke-linecap="round" opacity="0.35"/>
    ${sparkles([[20, 40, 0.5], [44, 40, 0.5]], "#86efac", 0.4)}`;
}

function sacrificeMotif() {
  return `${groundShadow(30, 54, 20, 4)}
    <circle cx="16" cy="44" r="6" fill="#2563eb" opacity="0.28" stroke="#0f172a" stroke-width="1.8" stroke-dasharray="4 2"/>
    <circle cx="16" cy="44" r="6" fill="none" stroke="#93c5fd" stroke-width="1.4" stroke-dasharray="4 2"/>
    ${tokenPro(48, 22, 6)}
    <path d="M22 40 L44 28" stroke="#0f172a" stroke-width="3.2" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M22 40 L44 28" stroke="#fde68a" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M46 18 L54 26 M46 30 L54 22 M42 24 L54 24 M46 18 L46 32" stroke="#0f172a" stroke-width="2.8" stroke-linecap="round" opacity="0.25"/>
    <path d="M46 18 L54 26 M46 30 L54 22 M42 24 L54 24 M46 18 L46 32" stroke="#ef4444" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="16" cy="44" r="10" fill="#dc2626" opacity="0.1"/>
    ${burst(48, 22, 5, "#ef4444", "#991b1b")}`;
}

function scatterMotif() {
  return `${groundShadow(32, 54, 18, 4)}
    <rect x="26" y="26" width="12" height="12" rx="1.5" fill="#475569" opacity="0.55" stroke="#0f172a" stroke-width="1.8"/>
    <rect x="26" y="26" width="12" height="12" rx="1.5" fill="none" stroke="#94a3b8" stroke-width="1.2"/>
    ${allyPro(32, 12, 3.5)}${tokenPro(52, 32, 3.5)}${allyPro(32, 52, 3.5)}${tokenPro(12, 32, 3.5)}
    <path d="M32 22 L32 12" stroke="#0f172a" stroke-width="2.8" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M32 22 L32 12" stroke="#bae6fd" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M38 32 L50 32" stroke="#bae6fd" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M32 38 L32 48" stroke="#bae6fd" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M26 32 L14 32" stroke="#bae6fd" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <circle cx="32" cy="32" r="16" fill="none" stroke="#0f172a" stroke-width="1.2" opacity="0.15"/>
    <circle cx="32" cy="32" r="16" fill="none" stroke="#7dd3fc" stroke-width="0.9" opacity="0.3"/>
    ${sparkles([[32, 8, 0.6], [56, 32, 0.6], [32, 56, 0.6], [8, 32, 0.6]], "#bae6fd", 0.4)}`;
}

function massNudgeMotif() {
  return `${groundShadow(26, 54, 20, 4)}
    ${allyPro(12, 42, 4.5)}${allyPro(30, 42, 4.5)}
    <path d="M16 38 L8 24" stroke="#0f172a" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M16 38 L8 24" stroke="#93c5fd" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M34 38 L42 24" stroke="#0f172a" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M34 38 L42 24" stroke="#93c5fd" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    ${destRing(8, 24, 4.5, "#7dd3fc")}${destRing(42, 24, 4.5, "#7dd3fc")}
    <path d="M18 36 L28 36" stroke="#60a5fa" stroke-width="1.6" opacity="0.4"/>
    ${motionArrow(14, 38, 10, 26, "#93c5fd", 2.2)}${motionArrow(32, 38, 40, 26, "#93c5fd", 2.2)}
    ${sparkles([[8, 20, 0.6], [42, 20, 0.6]], "#bae6fd", 0.4)}`;
}

function displacementMotif() {
  return `${groundShadow(32, 54, 22, 4)}
    <path d="M4 30 H60" stroke="#0f172a" stroke-width="2.8" opacity="0.18"/>
    <path d="M4 30 H60" stroke="#64748b" stroke-width="2" opacity="0.45" stroke-dasharray="5 3"/>
    <rect x="6" y="30" width="52" height="22" rx="2" fill="#1e3a8a" opacity="0.14" stroke="#334155" stroke-width="1.2"/>
    <text x="10" y="38" font-size="5" fill="#93c5fd" opacity="0.75" font-weight="700">YOUR SIDE</text>
    ${ghost(44, 18, 5)}
    ${allyPro(18, 48, 5)}
    ${destRing(44, 18, 5.5, "#7dd3fc")}
    <path d="M22 44 Q34 20 44 18" stroke="#0f172a" stroke-width="3.6" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M22 44 Q34 20 44 18" stroke="#bae6fd" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-dasharray="5 3"/>
    ${energyArc(22, 44, 44, 18, "#38bdf8", 2.4)}
    <circle cx="44" cy="18" r="10" fill="#38bdf8" opacity="0.1" stroke="#0f172a" stroke-width="1.4"/>
    <circle cx="44" cy="18" r="10" fill="none" stroke="#7dd3fc" stroke-width="1.4" opacity="0.55"/>
    <path d="M40 14 L48 22 M48 14 L40 22" stroke="#e0f2fe" stroke-width="1.4" stroke-linecap="round" opacity="0.45"/>
    ${sparkles([[44, 10, 0.75], [30, 28, 0.55], [20, 46, 0.5]], "#bae6fd", 0.5)}`;
}

function sanctuaryPulseMotif() {
  return `${groundShadow(32, 54, 24, 4)}
    <path d="M4 46 H60" stroke="#0f172a" stroke-width="3" opacity="0.2"/>
    <path d="M4 46 H60" stroke="#64748b" stroke-width="2.6" opacity="0.6"/>
    <rect x="6" y="42" width="52" height="6" rx="1.5" fill="#475569" opacity="0.42" stroke="#334155" stroke-width="1"/>
    ${allyPro(12, 44, 4)}${allyPro(28, 44, 4)}${allyPro(44, 44, 4)}
    <path d="M22 32 L28 38 L22 44 L16 38 Z" fill="#38bdf8" opacity="0.55" stroke="#0f172a" stroke-width="1.6" transform="translate(2, 0)"/>
    <path d="M22 32 L28 38 L22 44 L16 38 Z" fill="none" stroke="#7dd3fc" stroke-width="1.2" transform="translate(2, 0)"/>
    <circle cx="32" cy="36" r="14" fill="none" stroke="#0f172a" stroke-width="1.4" opacity="0.15"/>
    <circle cx="32" cy="36" r="14" fill="none" stroke="#7dd3fc" stroke-width="1.2" opacity="0.35"/>
    <circle cx="32" cy="36" r="20" fill="none" stroke="#38bdf8" stroke-width="0.8" opacity="0.2"/>
    ${sparkles([[32, 28, 0.7], [12, 38, 0.5], [52, 38, 0.5]], "#bae6fd", 0.45)}`;
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
  mass_nudge: () => uncommonBleed("mn", "#7dd3fc", "#1e3a5f", massNudgeMotif()),
  displacement: () => uncommonBleed("dp", "#7dd3fc", "#1e3a5f", displacementMotif()),
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
  execution: () => epicBleed("ex", "#6ee7b7", "#14532d", executionMotif()),
  chain_lightning: () => legendaryBleed("cl", "#2563eb", "#0c1929", chainLightningMotif()),
  backstab: () => uncommonBleed("bk", "#c4a574", "#2d4a6e", backstabMotif()),
  cryo_bolt: () => uncommonBleed("cb", "#7dd3fc", "#0c4a6e", cryoBoltMotif()),
  bomb: () => legendaryBleed("bm", "#f59e0b", "#78350f", bombMotif()),
  shockwave: () => epicBleed("sw", "#c4b5fd", "#3b1f6e", shockwaveMotif()),
  magnet: () => epicBleed("mg", "#6ee7b7", "#14532d", magnetMotif()),

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
  dash: () => rareBleed("ds", "#c4b5fd", "#4c1d95", dashMotif()),
  earthquake: () => legendaryBleed("eq", "#78716c", "#292524", earthquakeMotif()),

  coin_flip: () => coinFlipMotif(),
  ignore: () => commonBleed("ig", "#94a3b8", "#1f2937", ignoreMotif()),
  counterspell: () => epicBleed("cs", "#a78bfa", "#2e1065", counterspellMotif()),
  purify: () => epicBleed("pu", "#6ee7b7", "#14532d", purifyMotif()),
  trickster: () => rareBleed("tr", "#c4b5fd", "#553c7a", tricksterMotif()),
  offering: () => rareBleed("of", "#d8b4fe", "#553c7a", offeringMotif()),
  quick_march: () => epicBleed("qm", "#60a5fa", "#1e3a5f", quickMarchMotif()),
  constitution: () => epicBleed("co", "#4ade80", "#14532d", constitutionMotif()),
  last_king: () => uncommonBleed("lk", "#fbbf24", "#1e3a5f", lastKingMotif()),
  revive: () => legendaryBleed("rv", "#15803d", "#052e16", reviveMotif()),
  mind_control: () => epicBleed("mc", "#c4b5fd", "#3b0764", mindControlMotif()),
  bounty: () => epicBleed("bo", "#4ade80", "#14532d", bountyMotif()),
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
