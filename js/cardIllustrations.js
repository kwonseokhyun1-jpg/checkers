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

/** @type {Record<string, (variant: number) => string>} */
export const EFFECT_ILLUSTRATIONS = {
  nudge: () => wrap(`${piece(18, 42)} ${ghost(36, 28)} ${arrow(24, 38, 32, 32)}`),
  backstep: () => wrap(`${piece(32, 24)} ${ghost(32, 44)} ${arrow(32, 30, 32, 40)}`),
  retreat_3: () => wrap(`${piece(32, 30)} ${arrow(32, 34, 32, 48)}<text x="44" y="46" font-size="8" fill="currentColor" opacity="0.7">×3</text>`),
  leapfrog: () => wrap(`${piece(14, 46)} ${piece(28, 34, 4.5)} ${ghost(44, 22)} ${arcJump(18, 42, 28, 34, 42, 24)}`),
  long_step: () => wrap(`${piece(18, 46)} ${ghost(46, 18)} ${arrow(22, 42, 42, 22, 2.4)}`),
  blink_2: () => wrap(`${piece(20, 44)} ${ring(44, 20, 8)} ${piece(44, 20, 4, 0.35)} ${arrow(26, 40, 38, 26)}<circle cx="44" cy="20" r="3" fill="currentColor" opacity="0.6"/>`),
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
  destroy_unshielded: () => wrap(`${enemy(32, 32, 7)} ${xMark(32, 32, 8)}`),
  fireblast: () => wrap(`${piece(32, 48, 5)} ${column(32, 10, 42)}<path d="M28 18 L32 8 L36 18 L32 14 Z" fill="currentColor" opacity="0.65"/><path d="M26 26 L32 16 L38 26" stroke="currentColor" stroke-width="1.8" fill="none"/>`),
  snipe: () => wrap(`${piece(18, 48, 4)} ${enemy(50, 14, 5)} ${arrow(22, 44, 46, 18, 2)}`),
  duel: () => wrap(`${piece(22, 38, 5)} ${enemy(42, 38, 5)} ${xMark(32, 38, 5)}`),
  sacrifice: () => wrap(`${piece(20, 40, 5, 0.35)} ${arrow(26, 36, 44, 28)} ${enemy(46, 26, 6)} ${xMark(46, 26, 5)}`),
  cull: () => wrap(`${enemy(32, 34, 6)}<text x="26" y="38" font-size="9" fill="currentColor" opacity="0.65">♟</text> ${xMark(32, 34, 7)}`),
  execution: () => wrap(`${enemy(32, 34, 6)}<path d="M18 48 H46 M24 48 V42 M40 48 V42" stroke="currentColor" stroke-width="1.8" opacity="0.45"/> ${xMark(32, 34, 6)}`),
  chain_lightning: () => wrap(`${piece(16, 44, 4)} ${bolt(22, 38, 32, 30)} ${bolt(32, 30, 42, 22)} ${enemy(46, 18, 4)} ${xMark(44, 18, 4)}`),
  backstab: () => wrap(`${piece(28, 40, 5)} ${enemy(40, 28, 5)} ${arrow(32, 36, 38, 32)}`),
  cryo_bolt: () => wrap(`${enemy(40, 26, 5)} ${piece(22, 44, 4)} ${bolt(26, 40, 36, 30)}<path d="M40 18 L44 22 L36 22 Z" fill="currentColor" opacity="0.5"/>`),
  bomb: () => wrap(`${piece(32, 36, 6)}<circle cx="32" cy="36" r="10" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5"/><path d="M32 20 V26" stroke="currentColor" stroke-width="2"/><circle cx="32" cy="18" r="2.5" fill="currentColor" opacity="0.8"/>`),
  magnet: () => wrap(`${piece(20, 36, 5)} ${enemy(48, 36, 5)} ${arrow(44, 36, 28, 36)}<text x="12" y="22" font-size="10" fill="currentColor" opacity="0.6">U</text>`),

  hex_3: () => wrap(`${enemy(32, 32, 6)}<path d="M32 16 L42 22 V34 L32 40 L22 34 V22 Z" fill="none" stroke="currentColor" stroke-width="1.8" opacity="0.7"/>`),
  poison_3: () => wrap(`${enemy(32, 30, 6)}<text x="27" y="18" font-size="11" fill="currentColor" opacity="0.85">☠</text><path d="M28 40 H36" stroke="currentColor" stroke-width="2" opacity="0.45"/>`),
  rust: () => wrap(`${enemy(32, 34, 6)} ${crown(32, 22)}<path d="M24 20 L40 36 M40 20 L24 36" stroke="currentColor" stroke-width="1.5" opacity="0.45"/>`),
  root_2: () => wrap(`${enemy(32, 28, 6)}<path d="M24 40 C28 34 36 34 40 40 M26 44 C30 38 34 38 38 44" stroke="currentColor" stroke-width="1.8" fill="none" opacity="0.65"/>`),
  panic: () => wrap(`${enemy(32, 26, 6)} ${arrow(32, 32, 32, 46)}<path d="M26 48 L32 42 L38 48" stroke="currentColor" stroke-width="1.6" fill="none"/>`),
  blizzard: () => wrap(`${column(32, 12, 50)}${enemy(32, 22, 3)}${enemy(32, 32, 3)}${enemy(32, 42, 3)}<text x="40" y="20" font-size="8" fill="currentColor" opacity="0.55">❄</text>`),
  deep_freeze: () => wrap(`${piece(32, 48, 4)}<path d="M10 54 L54 10" stroke="currentColor" stroke-width="2" opacity="0.45"/>${enemy(22, 40, 3)}${enemy(32, 30, 3)}${enemy(42, 20, 3)}`),
  reverse_only_2: () => wrap(`${enemy(32, 24, 6)} ${arrow(32, 28, 32, 44)}<path d="M24 48 H40" stroke="currentColor" stroke-width="1.8" opacity="0.4"/>`),
  press: () => wrap(`${enemy(32, 28, 6)} ${arrow(32, 34, 32, 44)} ${arrow(38, 34, 38, 44)}`),
  tangle: () => wrap(`${enemy(22, 32, 5)} ${enemy(42, 32, 5)} ${arrow(28, 32, 36, 32)} ${arrow(36, 28, 28, 28)}<path d="M22 26 L42 38 M42 26 L22 38" stroke="currentColor" stroke-width="1.2" opacity="0.4"/>`),
  blind: () => wrap(`<path d="M16 28 C24 22 40 22 48 28 C40 34 24 34 16 28 Z" fill="currentColor" opacity="0.35"/><path d="M22 28 H42" stroke="currentColor" stroke-width="2"/>`),
  confusion: () => wrap(`${enemy(32, 32, 6)}<path d="M20 20 C28 28 20 36 28 44 C36 36 44 44 44 28" stroke="currentColor" stroke-width="1.8" fill="none" opacity="0.65"/>`),
  fog_2: () => wrap(`${piece(32, 34, 6)}<ellipse cx="32" cy="24" rx="16" ry="8" fill="currentColor" opacity="0.22"/>`),

  crown: () => wrap(`${piece(32, 38, 6)} ${crown(32, 24)}`),
  demote: () => wrap(`${enemy(32, 36, 6)} ${crown(32, 18)}<path d="M24 16 L40 32 M40 16 L24 32" stroke="currentColor" stroke-width="1.8" opacity="0.55"/>`),
  stone_form: () => wrap(`${piece(32, 34, 6)} ${crown(32, 20)}<rect x="22" y="28" width="20" height="18" rx="3" fill="currentColor" opacity="0.25" stroke="currentColor" stroke-width="1.5"/>`),
  fusion: () => wrap(`${piece(20, 38, 5)} ${piece(44, 38, 5)} ${arrow(26, 38, 38, 38)} ${piece(32, 30, 7, 0.55)}`),
  clone: () => wrap(`${piece(24, 34, 5)} ${piece(42, 34, 5, 0.45)} ${arrow(30, 34, 36, 34)}`),
  chameleon: () => wrap(`${piece(32, 34, 6)}<path d="M18 22 H46 M18 30 H46 M18 38 H46" stroke="currentColor" stroke-width="1.2" opacity="0.25"/><circle cx="20" cy="22" r="3" fill="currentColor" opacity="0.5"/><circle cx="44" cy="30" r="3" fill="currentColor" opacity="0.35"/>`),
  promote_zone: () => wrap(`${piece(32, 38, 6)}<path d="M12 28 H52" stroke="currentColor" stroke-width="2" opacity="0.45"/>${crown(32, 18)}`),
  hibernation: () => wrap(`${piece(32, 36, 6)}<text x="24" y="22" font-size="9" fill="currentColor" opacity="0.55">zzz</text>${crown(32, 48)}`),

  quicksand: () => wrap(`${square(32, 34, 16, 0.15)}<path d="M20 40 C26 36 38 36 44 40 C38 44 26 44 20 40 Z" fill="currentColor" opacity="0.35"/><text x="38" y="24" font-size="7" fill="currentColor" opacity="0.45">?</text>`),
  landmine: () => wrap(`${square(32, 34, 16, 0.15)}<circle cx="32" cy="34" r="4" fill="currentColor" opacity="0.55"/><path d="M28 30 L36 38 M36 30 L28 38" stroke="currentColor" stroke-width="1.5"/>`),
  collapse: () => wrap(`${square(32, 34, 16, 0.2)} ${piece(32, 34, 4)}<path d="M24 42 L32 34 L40 42 M26 46 L38 46" stroke="currentColor" stroke-width="1.6" opacity="0.55"/>`),
  darkness: () => wrap(`${ring(32, 32, 16)}<ellipse cx="32" cy="32" rx="14" ry="10" fill="currentColor" opacity="0.3"/>${piece(32, 32, 4)}`),
  scatter: () => wrap(`${square(32, 32, 8, 0.25)}${piece(32, 20, 3)}${piece(48, 32, 3)}${piece(32, 44, 3)}${piece(16, 32, 3)}${arrow(32, 28, 32, 22)}${arrow(36, 32, 44, 32)}`),
  butterfly: () => wrap(`${square(32, 32, 18, 0.12)}${piece(26, 28, 3)}${piece(38, 30, 3)}${piece(30, 38, 3)}${piece(40, 36, 3)}<path d="M26 28 Q32 20 38 30 Q32 42 30 38" stroke="currentColor" stroke-width="1.4" fill="none" opacity="0.5"/>`),
  call_forward: () => wrap(`${enemy(40, 28, 5)} ${ghost(24, 40)} ${arrow(36, 32, 28, 38)}`),
  earthquake: () => wrap(`${piece(16, 20, 3)}${piece(48, 20, 3)}${piece(16, 48, 3)}${piece(48, 48, 3)}${arrow(20, 24, 28, 30)}${arrow(44, 24, 36, 30)}${arrow(20, 44, 28, 38)}${arrow(44, 44, 36, 38)}`),

  coin_flip: () => wrap(`<circle cx="32" cy="32" r="14" fill="currentColor" opacity="0.25" stroke="currentColor" stroke-width="2"/><text x="27" y="36" font-size="10" fill="currentColor" opacity="0.8">50</text>`),
  ignore: () => wrap(`${piece(32, 36, 6)}<path d="M14 20 L22 28 M22 20 L14 28" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><text x="36" y="22" font-size="8" fill="currentColor" opacity="0.55">skip</text>`),
  counterspell: () => wrap(`${shield(32, 30, 0.9)}<path d="M26 30 L38 42 M38 30 L26 42" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>`),
  purify: () => wrap(`${piece(24, 34, 4)} ${enemy(40, 34, 4)}<path d="M32 14 L34 22 H42 L35 27 L38 35 L32 30 L26 35 L29 27 L22 22 H30 Z" fill="currentColor" opacity="0.45"/>`),
  trickster: () => wrap(`${piece(18, 22, 3)}${piece(46, 22, 3)}${piece(18, 46, 3)}${piece(46, 46, 3)}<path d="M18 22 L46 46 M46 22 L18 46" stroke="currentColor" stroke-width="1.2" opacity="0.45"/>`),
  offering: () => wrap(`${piece(24, 40, 5, 0.35)}<path d="M40 18 L48 26 L40 34 L32 26 Z" fill="currentColor" opacity="0.35"/><text x="34" y="28" font-size="7" fill="currentColor" opacity="0.65">+1</text>`),
  quick_march: () => wrap(`${piece(32, 38, 6)} ${arrow(32, 34, 32, 24)} ${arrow(32, 34, 32, 14)}`),
  constitution: () => wrap(`${piece(32, 36, 6)} ${crown(32, 20)} ${shield(32, 34, 0.7)}<text x="42" y="48" font-size="7" fill="currentColor" opacity="0.5">5t</text>`),
  last_king: () => wrap(`${piece(32, 36, 7)} ${crown(32, 20)} ${shield(32, 34, 0.65)}`),
  revive: () => wrap(`${ghost(32, 40)} ${arrow(32, 44, 32, 34)} ${piece(32, 28, 5, 0.7)}<path d="M24 48 H40" stroke="currentColor" stroke-width="1.5" opacity="0.35"/>`),
  possession: () => wrap(`${piece(18, 40, 4)} ${enemy(44, 28, 6)}<path d="M18 36 C28 30 38 28 44 28" stroke="currentColor" stroke-width="1.4" fill="none" stroke-dasharray="3 2"/>`),
  link_fate: () => wrap(`${enemy(22, 32, 5)} ${enemy(42, 32, 5)}<path d="M28 32 H36" stroke="currentColor" stroke-width="2"/><circle cx="32" cy="32" r="3" fill="currentColor" opacity="0.6"/>`),
  hunters_mark: () => wrap(`${enemy(40, 26, 5)}<circle cx="40" cy="26" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M40 14 V18 M40 34 V38 M28 26 H32 M48 26 H52" stroke="currentColor" stroke-width="1.5"/>`),
  bishop_2: () => wrap(`${piece(32, 48, 5)}<path d="M32 44 L14 26 M32 44 L50 26" stroke="currentColor" stroke-width="2" opacity="0.55" stroke-dasharray="5 3"/>`),
  rook_2: () => wrap(`${piece(32, 48, 5)}<path d="M32 44 V18 M32 44 H14 M32 44 H50" stroke="currentColor" stroke-width="2" opacity="0.55" stroke-dasharray="5 3"/>`),
  hostile_swap: () => wrap(`${piece(22, 36, 5)} ${enemy(42, 36, 5)} ${arrow(28, 36, 36, 36)} ${arrow(36, 32, 28, 32)}`),
};

/**
 * @param {{ id: string, effect?: string }} def
 * @param {number} [variant=0]
 */
export function illustrationForCard(def, variant = 0) {
  const fn = EFFECT_ILLUSTRATIONS[def.effect];
  return fn ? fn(variant) : null;
}
