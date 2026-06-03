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
  backrank_protection: "defense",
  backstab: "attack",
  backstep: "movement",
  barrier: "defense",
  bishops_mark: "movement",
  blind: "control",
  blizzard: "control",
  bomb: "trap",
  bulwark: "defense",
  butterfly: "special",
  call_forward: "movement",
  chain_lightning: "attack",
  clone: "special",
  coin_flip: "special",
  collapse: "trap",
  confusion: "control",
  constitution: "special",
  counterspell: "trap",
  crown: "special",
  cryo_bolt: "attack",
  cull: "attack",
  darkness: "trap",
  deep_freeze: "control",
  deflect: "defense",
  demote: "control",
  displacement: "movement",
  dominion: "special",
  double: "special",
  duel: "attack",
  earthquake: "movement",
  execution: "attack",
  fireblast: "attack",
  fog: "defense",
  fusion: "movement",
  hex: "control",
  hibernation: "defense",
  hostile_swap: "movement",
  hunters_mark: "control",
  ignore: "special",
  iron_will: "defense",
  landmine: "trap",
  last_king: "special",
  last_stand: "defense",
  leapfrog: "movement",
  long_step: "movement",
  magnet: "movement",
  nudge: "movement",
  offering: "special",
  overrun: "movement",
  panic: "control",
  poison: "control",
  possession: "special",
  press: "control",
  promote_zone: "movement",
  purify: "special",
  quick_march: "movement",
  quicksand: "trap",
  rally: "defense",
  recall: "movement",
  repel: "movement",
  retreat: "movement",
  revive: "special",
  rooks_mark: "movement",
  root: "control",
  rust: "control",
  sacrifice: "attack",
  sanctuary: "defense",
  scatter: "movement",
  shadow_swap: "movement",
  shatter: "attack",
  snipe: "attack",
  stab: "attack",
  stall: "defense",
  stone_form: "defense",
  tangle: "control",
  teleport: "movement",
  trickster: "special",
  vengeance: "defense",
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
  if (/trap|mine|quicksand|counterspell|darkness|collapse/.test(blob)) return "trap";
  if (/shield|ward|aegis|sanctuary|barrier|anchor|deflect|stall|iron_will|vengeance|hibernation|fog|rally/.test(blob)) {
    return "defense";
  }
  if (/move|nudge|teleport|recall|leap|step|displace|swap|scatter|retreat|bishop|rook|fusion|overrun|promote|pull|push|shift|earthquake|magnet|repel/.test(blob)) {
    return "movement";
  }
  if (/freeze|blind|confusion|hex|root|rust|panic|press|silence|paraly|control|cannot play|random|mark|poison|die in \d+ turn/.test(blob)) {
    return "control";
  }
  if (/\bdestroy\b|\bkills?\b|fireball|bolt|stab|snipe|duel|sacrifice|execution|shatter|cull|lightning/.test(blob)) {
    return "attack";
  }
  return "special";
}
