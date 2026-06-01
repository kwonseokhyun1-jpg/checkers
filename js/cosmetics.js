/**
 * Profile cosmetics: avatars, frames, banners, piece skins — catalog, boxes, equip helpers.
 */

export const COSMETIC_TYPES = ["avatar", "frame", "banner", "pieceSkin"];

export const COSMETIC_RARITIES = ["common", "uncommon", "rare", "epic", "legendary"];

const RARITY_GEM_DUPE = { common: 5, uncommon: 10, rare: 20, epic: 40, legendary: 80 };

/** @type {{ id: string, type: string, name: string, rarity: string, desc: string }[]} */
export const COSMETIC_ITEMS = [
  { id: "avatar_default", type: "avatar", name: "Initiate", rarity: "common", desc: "Default profile portrait." },
  { id: "avatar_mystic", type: "avatar", name: "Mystic Seer", rarity: "uncommon", desc: "Arcane violet gaze." },
  { id: "avatar_shadow", type: "avatar", name: "Shadow Duelist", rarity: "rare", desc: "Cloaked checker champion." },
  { id: "avatar_sun", type: "avatar", name: "Solar Crown", rarity: "epic", desc: "Radiant gold sigil." },
  { id: "avatar_void", type: "avatar", name: "Void Walker", rarity: "legendary", desc: "Starfield anomaly portrait." },


  { id: "frame_default", type: "frame", name: "Iron Ring", rarity: "common", desc: "Simple steel portrait ring." },
  { id: "frame_bronze", type: "frame", name: "Bronze Filigree", rarity: "uncommon", desc: "Wrought bronze knotwork." },
  { id: "frame_silver", type: "frame", name: "Silver Sigil", rarity: "rare", desc: "Arcane silver halo." },
  { id: "frame_gold", type: "frame", name: "Gilded Crown", rarity: "epic", desc: "Radiant gold coronet frame." },
  { id: "frame_legend", type: "frame", name: "Astral Halo", rarity: "legendary", desc: "Prismatic starlit border." },

  { id: "banner_default", type: "banner", name: "Classic Board", rarity: "common", desc: "Standard arcane banner." },
  { id: "banner_nebula", type: "banner", name: "Nebula Veil", rarity: "uncommon", desc: "Cosmic purple drift." },
  { id: "banner_crimson", type: "banner", name: "Crimson War", rarity: "rare", desc: "Battle-worn red standard." },
  { id: "banner_storm", type: "banner", name: "Storm Sigil", rarity: "epic", desc: "Lightning-framed colors." },
  { id: "banner_aurora", type: "banner", name: "Aurora Gate", rarity: "legendary", desc: "Prismatic legendary frame." },

  { id: "skin_classic", type: "pieceSkin", name: "Classic Disc", rarity: "common", desc: "Traditional checker pieces." },
  { id: "skin_ember", type: "pieceSkin", name: "Ember Core", rarity: "uncommon", desc: "Glowing coal gradients." },
  { id: "skin_frost", type: "pieceSkin", name: "Frost Shard", rarity: "rare", desc: "Icy crystal pieces." },
  { id: "skin_arcane", type: "pieceSkin", name: "Arcane Rune", rarity: "epic", desc: "Floating rune crowns." },
  { id: "skin_void", type: "pieceSkin", name: "Void Marble", rarity: "legendary", desc: "Dark starlit marbles." },
];

export const COSMETIC_BY_ID = Object.fromEntries(COSMETIC_ITEMS.map((c) => [c.id, c]));

export const COSMETIC_BOXES = [
  {
    id: "style_crate",
    name: "Style Crate",
    cost: 75,
    pulls: 2,
    weights: { common: 45, uncommon: 35, rare: 15, epic: 4, legendary: 1 },
  },
  {
    id: "arcane_vanity",
    name: "Arcane Vanity",
    cost: 150,
    pulls: 3,
    weights: { common: 20, uncommon: 35, rare: 30, epic: 12, legendary: 3 },
  },
  {
    id: "legend_relic",
    name: "Legend Relic",
    cost: 300,
    pulls: 4,
    weights: { common: 5, uncommon: 20, rare: 35, epic: 30, legendary: 10 },
  },
];

export const DEFAULT_COSMETICS = {
  owned: {
    avatar: ["avatar_default"],
    frame: ["frame_default"],
    banner: ["banner_default"],
    pieceSkin: ["skin_classic"],
  },
  equipped: {
    avatar: "avatar_default",
    frame: "frame_default",
    banner: "banner_default",
    pieceSkin: "skin_classic",
  },
};

export function normalizeCosmetics(raw) {
  const base = structuredClone(DEFAULT_COSMETICS);
  if (!raw || typeof raw !== "object") return base;
  for (const t of COSMETIC_TYPES) {
    const list = raw.owned?.[t];
    if (Array.isArray(list)) {
      base.owned[t] = [...new Set([...DEFAULT_COSMETICS.owned[t], ...list.filter((id) => COSMETIC_BY_ID[id]?.type === t)])];
    }
  }
  for (const t of COSMETIC_TYPES) {
    const id = raw.equipped?.[t];
    if (id && base.owned[t]?.includes(id)) base.equipped[t] = id;
  }
  return base;
}

export function getEquippedCosmetics(profile) {
  return normalizeCosmetics(profile?.cosmetics);
}

export function ownsCosmetic(profile, id) {
  const item = COSMETIC_BY_ID[id];
  if (!item) return false;
  return profile.cosmetics?.owned?.[item.type]?.includes(id) ?? false;
}

function pickRarity(weights) {
  const roll = Math.random() * 100;
  let acc = 0;
  for (const r of COSMETIC_RARITIES) {
    acc += weights[r] || 0;
    if (roll <= acc) return r;
  }
  return "common";
}

function poolOfRarity(rarity) {
  return COSMETIC_ITEMS.filter((c) => c.rarity === rarity);
}

export function openCosmeticBox(profile, boxId) {
  const box = COSMETIC_BOXES.find((b) => b.id === boxId);
  if (!box) return { success: false, message: "Unknown cosmetic box." };
  if (profile.gems < box.cost) return { success: false, message: "Not enough gems." };

  profile.cosmetics = normalizeCosmetics(profile.cosmetics);
  profile.gems -= box.cost;
  const pulls = [];
  let bonusGems = 0;

  for (let i = 0; i < box.pulls; i++) {
    let item = null;
    for (let attempt = 0; attempt < 40; attempt++) {
      const rarity = pickRarity(box.weights);
      const pool = poolOfRarity(rarity);
      const pick = pool[Math.floor(Math.random() * pool.length)];
      if (!pick) continue;
      if (!profile.cosmetics.owned[pick.type].includes(pick.id)) {
        profile.cosmetics.owned[pick.type].push(pick.id);
        item = { ...pick, duplicate: false };
        break;
      }
      item = { ...pick, duplicate: true };
      bonusGems += RARITY_GEM_DUPE[pick.rarity] || 5;
      break;
    }
    if (item) pulls.push(item);
  }

  if (bonusGems) profile.gems += bonusGems;
  return { success: true, box, pulls, bonusGems };
}

export function equipCosmetic(profile, type, id) {
  if (!COSMETIC_TYPES.includes(type)) return { success: false, message: "Invalid slot." };
  profile.cosmetics = normalizeCosmetics(profile.cosmetics);
  if (!profile.cosmetics.owned[type]?.includes(id)) {
    return { success: false, message: "You do not own that cosmetic." };
  }
  profile.cosmetics.equipped[type] = id;
  return { success: true, message: "Equipped!" };
}

export function cosmeticCssClass(item) {
  if (!item) return "";
  return item.id.replace(/_/g, "-");
}
