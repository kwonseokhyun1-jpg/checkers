/** Spell categories for collection browsing and deck building */

export const CARD_CATEGORY_ORDER = ["attack", "defense", "movement", "trap", "special"];

export const CARD_CATEGORY_LABELS = {
  attack: "Attack",
  defense: "Defense",
  movement: "Movement",
  trap: "Trap",
  special: "Special",
};

/** @type {Record<string, import("./cardCategories.js").CardCategory>} */
const ID_TO_CATEGORY = {
  aegis: "defense",
  anchor: "defense",
  backpedal: "attack",
  backrank_protection: "defense",
  backstab: "attack",
  backstep: "movement",
  barrier: "defense",
  bishops_mark: "movement",
  blind: "attack",
  blizzard: "attack",
  bomb: "trap",
  bulwark: "defense",
  butterfly: "special",
  call_forward: "movement",
  chain_lightning: "attack",
  clone: "special",
  coin_flip: "special",
  collapse: "attack",
  confusion: "attack",
  constitution: "special",
  counterspell: "trap",
  crown: "special",
  cryo_bolt: "attack",
  cull: "attack",
  darkness: "trap",
  deep_freeze: "attack",
  deflect: "defense",
  demote: "attack",
  displacement: "movement",
  dominion: "special",
  double: "special",
  duel: "attack",
  earthquake: "attack",
  execution: "attack",
  fireblast: "attack",
  fog: "defense",
  fusion: "movement",
  hex: "attack",
  hibernation: "defense",
  hostile_swap: "attack",
  hunters_mark: "attack",
  ignore: "special",
  iron_will: "defense",
  landmine: "trap",
  last_king: "special",
  last_stand: "defense",
  leapfrog: "movement",
  long_step: "movement",
  magnet: "attack",
  nudge: "movement",
  offering: "special",
  overrun: "movement",
  panic: "attack",
  poison: "attack",
  possession: "special",
  press: "attack",
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
  root: "attack",
  rust: "attack",
  sacrifice: "attack",
  sanctuary: "defense",
  scatter: "movement",
  shadow_swap: "movement",
  shatter: "attack",
  snipe: "attack",
  stab: "attack",
  stall: "defense",
  stone_form: "defense",
  tangle: "attack",
  teleport: "movement",
  trickster: "special",
  vengeance: "defense",
  ward: "defense",
};

/** @typedef {"attack"|"defense"|"movement"|"trap"|"special"} CardCategory */

/**
 * @param {{ id: string, effect?: string, name?: string, desc?: string }} def
 * @returns {CardCategory}
 */
export function getCardCategory(def) {
  const mapped = ID_TO_CATEGORY[def?.id];
  if (mapped) return mapped;

  const blob = `${def?.id || ""} ${def?.effect || ""} ${def?.name || ""} ${def?.desc || ""}`.toLowerCase();
  if (/trap|mine|quicksand|counterspell|darkness/.test(blob)) return "trap";
  if (/shield|ward|aegis|sanctuary|barrier|anchor|deflect|stall|iron_will|vengeance|hibernation|fog|rally/.test(blob)) {
    return "defense";
  }
  if (/move|nudge|teleport|recall|leap|step|displace|swap|scatter|retreat|bishop|rook|fusion|overrun|promote/.test(blob)) {
    return "movement";
  }
  if (/destroy|damage|bolt|stab|snipe|duel|sacrifice|poison|hex|root|rust|panic|press|blind|freeze|lightning|fire|cull|execution|shatter|demote|tangle|magnet|earthquake|collapse/.test(blob)) {
    return "attack";
  }
  return "special";
}
