/** Card definitions and draw pool for Card Checkers */

export const DRAW_COST = 10;
export const START_GEMS = 100;
export const HAND_MAX = 6;

export const CARD_IDS = {
  NUDGE: "nudge",
  AEGIS: "aegis",
  BOLT: "bolt",
  FROST: "frost",
  RETREAT: "retreat",
  KNIGHT: "knight",
  CROWN: "crown",
  SWAP: "swap",
  DOUBLE: "double",
  GEM_CACHE: "gem_cache",
  SHATTER: "shatter",
  TELEPORT: "teleport",
};

/** @type {Record<string, { id: string, name: string, desc: string, rarity: string, weight: number, targets: number }>} */
export const CARDS = {
  [CARD_IDS.NUDGE]: {
    id: CARD_IDS.NUDGE,
    name: "Nudge",
    desc: "Displace one of your pieces 1 square to an adjacent empty dark square.",
    rarity: "common",
    weight: 14,
    targets: 2,
  },
  [CARD_IDS.AEGIS]: {
    id: CARD_IDS.AEGIS,
    name: "Aegis",
    desc: "Shield a piece — it cannot be captured for 2 turns.",
    rarity: "common",
    weight: 12,
    targets: 1,
  },
  [CARD_IDS.BOLT]: {
    id: CARD_IDS.BOLT,
    name: "Forward Bolt",
    desc: "Eliminate the first enemy piece directly ahead along your piece's forward diagonal.",
    rarity: "uncommon",
    weight: 10,
    targets: 1,
  },
  [CARD_IDS.FROST]: {
    id: CARD_IDS.FROST,
    name: "Frost Bind",
    desc: "Freeze an enemy piece — it cannot move on its owner's next turn.",
    rarity: "uncommon",
    weight: 10,
    targets: 1,
  },
  [CARD_IDS.RETREAT]: {
    id: CARD_IDS.RETREAT,
    name: "Retreat Ward",
    desc: "Grant a piece backward movement for 3 turns.",
    rarity: "uncommon",
    weight: 9,
    targets: 1,
  },
  [CARD_IDS.KNIGHT]: {
    id: CARD_IDS.KNIGHT,
    name: "Knight's Sigil",
    desc: "Transform a piece — it moves like a chess knight until the end of the game.",
    rarity: "rare",
    weight: 6,
    targets: 1,
  },
  [CARD_IDS.CROWN]: {
    id: CARD_IDS.CROWN,
    name: "Royal Decree",
    desc: "Instantly crown one of your pieces (king movement).",
    rarity: "rare",
    weight: 6,
    targets: 1,
  },
  [CARD_IDS.SWAP]: {
    id: CARD_IDS.SWAP,
    name: "Shadow Swap",
    desc: "Swap positions of two of your pieces.",
    rarity: "uncommon",
    weight: 8,
    targets: 2,
  },
  [CARD_IDS.DOUBLE]: {
    id: CARD_IDS.DOUBLE,
    name: "Quick March",
    desc: "After your normal move, move the same piece again (non-capture step).",
    rarity: "rare",
    weight: 5,
    targets: 0,
  },
  [CARD_IDS.GEM_CACHE]: {
    id: CARD_IDS.GEM_CACHE,
    name: "Gem Cache",
    desc: "Gain 20 gems immediately.",
    rarity: "common",
    weight: 11,
    targets: 0,
  },
  [CARD_IDS.SHATTER]: {
    id: CARD_IDS.SHATTER,
    name: "Shatter",
    desc: "Destroy any enemy piece on the board (not shielded).",
    rarity: "epic",
    weight: 3,
    targets: 1,
  },
  [CARD_IDS.TELEPORT]: {
    id: CARD_IDS.TELEPORT,
    name: "Blink",
    desc: "Teleport your piece to any empty dark square within 2 steps (Chebyshev).",
    rarity: "rare",
    weight: 6,
    targets: 2,
  },
};

const POOL = Object.values(CARDS);
const TOTAL_WEIGHT = POOL.reduce((s, c) => s + c.weight, 0);

export function drawRandomCard() {
  let roll = Math.random() * TOTAL_WEIGHT;
  for (const card of POOL) {
    roll -= card.weight;
    if (roll <= 0) return { ...card };
  }
  return { ...POOL[0] };
}

export function createCardInstance(cardDef) {
  return {
    instanceId: `${cardDef.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ...cardDef,
  };
}
