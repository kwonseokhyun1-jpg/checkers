/** Spell categories for collection browsing and deck building */

export const CARD_CATEGORY_ORDER = ["attack", "control", "defense", "movement", "trap", "special"];

export const CARD_CATEGORY_LABELS = {
  attack: "Attack",
  control: "Control",
  defense: "Defense",
  movement: "Movement",
  trap: "Trap",
  special: "Special",
};

/** @type {Record<string, import("./cardCategories.js").CardCategory>} */
const ID_TO_CATEGORY = {
  aegis: "defense",
  anchor: "defense",
  backpedal: "control",
  backstab: "attack",
  backstep: "movement",
  barrier: "defense",
  bishops_mark: "movement",
  blind: "control",
  blizzard: "control",
  snowball: "control",
  berserk: "movement",
  bomb: "attack",
  shockwave: "control",
  plague: "control",
  bulwark: "defense",
  create_foe: "special",
  call_forward: "movement",
  chain_lightning: "attack",
  clone: "special",
  coin_flip: "attack",
  collapse: "special",
  confusion: "control",
  constitution: "defense",
  counterspell: "trap",
  crown: "special",
  cryo_bolt: "attack",
  cull: "attack",
  darkness: "defense",
  dash: "movement",
  deep_freeze: "control",
  deflect: "trap",
  demote: "control",
  deport: "movement",
  displacement: "movement",
  dominion: "special",
  duel: "attack",
  earthquake: "special",
  execution: "attack",
  extract: "control",
  pyromancy: "attack",
  fusion: "special",
  hibernation: "special",
  hostile_swap: "movement",
  ignore: "special",
  iron_will: "defense",
  landmine: "trap",
  last_king: "special",
  bounty: "special",
  link_fate: "special",
  last_stand: "trap",
  martyr: "trap",
  leapfrog: "movement",
  long_step: "movement",
  magnet: "movement",
  nudge: "movement",
  offering: "special",
  panic: "control",
  poison: "attack",
  mind_control: "special",
  mulligan: "special",
  zombify: "special",
  press: "control",
  purify: "special",
  diffuse: "special",
  quick_march: "movement",
  quicksand: "trap",
  rally: "defense",
  recall: "movement",
  repel: "movement",
  random_teleport: "movement",
  retreat: "movement",
  revive: "defense",
  rooks_mark: "movement",
  root: "control",
  sacrifice: "attack",
  sanctuary: "defense",
  scatter: "movement",
  shadow_swap: "movement",
  sidestep: "movement",
  shatter: "attack",
  snipe: "attack",
  snowball: "control",
  stab: "attack",
  stall: "defense",
  tangle: "control",
  teleport: "movement",
  trickster: "special",
  toll: "special",
  vengeance: "trap",
  ward: "defense",
};

/** @typedef {"attack"|"control"|"defense"|"movement"|"trap"|"special"} CardCategory */

/**
 * @param {{ id: string, effect?: string, name?: string, desc?: string }} def
 * @returns {CardCategory}
 */
export function getCardCategory(def) {
  const mapped = ID_TO_CATEGORY[def?.id];
  if (mapped) return mapped;

  const blob = `${def?.id || ""} ${def?.effect || ""} ${def?.name || ""} ${def?.desc || ""}`.toLowerCase();
  if (/trap|mine|quicksand|counterspell|vengeance|last.?stand|martyr/.test(blob)) return "trap";
  if (/shield|ward|aegis|sanctuary|barrier|anchor|deflect|stall|iron_will|rally|darkness/.test(blob)) {
    return "defense";
  }
  if (/move|nudge|teleport|recall|leap|step|displace|swap|scatter|retreat|bishop|rook|overrun|promote|pull|push|shift|earthquake|magnet|repel/.test(blob)) {
    return "movement";
  }
  if (/freeze|blind|confusion|hex|root|panic|press|silence|paraly|control|cannot play|random|mark|poison|die in \d+ turn/.test(blob)) {
    return "control";
  }
  if (/\bdestroy\b|\bkills?\b|fireball|bolt|stab|snipe|duel|sacrifice|execution|shatter|cull|lightning/.test(blob)) {
    return "attack";
  }
  return "special";
}
