/**
 * Profile cosmetics: avatars, frames, banners, piece skins — catalog, boxes, equip helpers.
 */

export const COSMETIC_TYPES = ["avatar", "frame", "banner", "pieceSkin"];

export const COSMETIC_RARITIES = ["common", "uncommon", "rare", "epic", "legendary"];

const RARITY_GEM_DUPE = { common: 5, uncommon: 10, rare: 20, epic: 40, legendary: 80 };

/** @type {{ id: string, type: string, name: string, rarity: string, desc: string }[]} */
export const COSMETIC_ITEMS = [
  { id: "avatar_default", type: "avatar", name: "Default", rarity: "common", desc: "Standard portrait." },
  { id: "avatar_mystic", type: "avatar", name: "Purple Portrait", rarity: "uncommon", desc: "Purple portrait." },
  { id: "avatar_shadow", type: "avatar", name: "Shadow Profile", rarity: "rare", desc: "Dark purple portrait." },
  { id: "avatar_sun", type: "avatar", name: "Gold Crown", rarity: "epic", desc: "Gold crown portrait." },
  { id: "avatar_void", type: "avatar", name: "Starfield", rarity: "legendary", desc: "Dark starfield portrait." },


  { id: "frame_default", type: "frame", name: "Simple Frame", rarity: "common", desc: "Plain border." },
  { id: "frame_bronze", type: "frame", name: "Bronze Frame", rarity: "uncommon", desc: "Bronze border." },
  { id: "frame_silver", type: "frame", name: "Silver Frame", rarity: "rare", desc: "Silver frame." },
  { id: "frame_gold", type: "frame", name: "Gold Frame", rarity: "epic", desc: "Gold border." },
  { id: "frame_legend", type: "frame", name: "Star Frame", rarity: "legendary", desc: "Colorful star border." },

  { id: "banner_default", type: "banner", name: "Classic Board", rarity: "common", desc: "Classic checkerboard colors." },
  { id: "banner_nebula", type: "banner", name: "Nebula", rarity: "uncommon", desc: "Purple gradient banner." },
  { id: "banner_crimson", type: "banner", name: "Crimson", rarity: "rare", desc: "Red gradient banner." },
  { id: "banner_storm", type: "banner", name: "Storm", rarity: "epic", desc: "Blue lightning banner." },
  { id: "banner_aurora", type: "banner", name: "Aurora", rarity: "legendary", desc: "Rainbow gradient banner." },

  { id: "skin_classic", type: "pieceSkin", name: "Classic Disc", rarity: "common", desc: "Traditional checker pieces." },
  { id: "skin_ember", type: "pieceSkin", name: "Ember Core", rarity: "uncommon", desc: "Glowing coal gradients." },
  { id: "skin_frost", type: "pieceSkin", name: "Frost Shard", rarity: "rare", desc: "Icy crystal pieces." },
  { id: "skin_arcane", type: "pieceSkin", name: "Rune Glow", rarity: "epic", desc: "Glowing piece style." },
  { id: "skin_void", type: "pieceSkin", name: "Void Marble", rarity: "legendary", desc: "Dark starlit marbles." },
];

export const COSMETIC_BY_ID = Object.fromEntries(COSMETIC_ITEMS.map((c) => [c.id, c]));

export const COSMETIC_BOXES = [
  {
    id: "bronze",
    name: "Bronze Cosmetic Box",
    cost: 25,
    pulls: 3,
    weights: { common: 70, uncommon: 25, rare: 5, epic: 0 },
  },
  {
    id: "silver",
    name: "Silver Cosmetic Box",
    cost: 50,
    pulls: 6,
    weights: { common: 50, uncommon: 35, rare: 12, epic: 3 },
  },
  {
    id: "gold",
    name: "Gold Cosmetic Box",
    cost: 100,
    pulls: 9,
    weights: { common: 32, uncommon: 38, rare: 22, epic: 6, legendary: 2 },
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
  unlockedTitles: [],
  equippedTitle: null,
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
  if (Array.isArray(raw.unlockedTitles)) {
    base.unlockedTitles = [...new Set(raw.unlockedTitles.filter((id) => typeof id === "string" && id.startsWith("title_")))];
  }
  if (raw.equippedTitle && base.unlockedTitles.includes(raw.equippedTitle)) {
    base.equippedTitle = raw.equippedTitle;
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


export function drawCosmeticItem(profile, weightsOrBox) {
  const weights = weightsOrBox.weights || weightsOrBox;
  profile.cosmetics = normalizeCosmetics(profile.cosmetics);
  for (let attempt = 0; attempt < 40; attempt++) {
    const rarity = pickRarity(weights);
    const pool = poolOfRarity(rarity);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (!pick) continue;
    if (!profile.cosmetics.owned[pick.type].includes(pick.id)) {
      profile.cosmetics.owned[pick.type].push(pick.id);
      return { ...pick, duplicate: false };
    }
    const gemRefund = RARITY_GEM_DUPE[pick.rarity] || 5;
    return { ...pick, duplicate: true, gemRefund };
  }
  return null;
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
    const item = drawCosmeticItem(profile, box);
    if (!item) continue;
    pulls.push(item);
    if (item.duplicate) bonusGems += item.gemRefund || RARITY_GEM_DUPE[item.rarity] || 5;
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

export const DEFAULT_PIECE_SKIN = "skin_classic";

export const SAME_PIECE_SKIN_JOIN_MESSAGE =
  "You and the host have the same custom piece skin. Equip a different skin in Profile to join.";

/** @param {object} [profileOrCosmetics] profile or normalized cosmetics */
export function getEquippedPieceSkin(profileOrCosmetics) {
  const cosmetics =
    profileOrCosmetics?.equipped && profileOrCosmetics?.owned
      ? normalizeCosmetics(profileOrCosmetics)
      : getEquippedCosmetics(profileOrCosmetics);
  return cosmetics.equipped.pieceSkin || DEFAULT_PIECE_SKIN;
}

export function pieceSkinsConflict(skinA, skinB) {
  const a = skinA || DEFAULT_PIECE_SKIN;
  const b = skinB || DEFAULT_PIECE_SKIN;
  if (a === b && a === DEFAULT_PIECE_SKIN) return false;
  return a === b;
}

/** Prefer a stored match-row skin; fall back to live profile when the row still has the default. */
export function effectiveHostPieceSkin(storedSkin, profileSkin) {
  const stored = storedSkin || DEFAULT_PIECE_SKIN;
  if (stored !== DEFAULT_PIECE_SKIN) return stored;
  return profileSkin || DEFAULT_PIECE_SKIN;
}

/** Read equipped piece skin from a Supabase profiles row. */
export function pieceSkinFromProfileRow(profileRow) {
  const raw = profileRow?.profile_json?.cosmetics;
  return getEquippedPieceSkin(raw ? { cosmetics: raw } : null);
}

/** Override equipped piece skin (e.g. from a PvP match snapshot). */
export function cosmeticsWithPieceSkin(cosmetics, skinId) {
  const base =
    cosmetics?.equipped && cosmetics?.owned
      ? normalizeCosmetics(cosmetics)
      : normalizeCosmetics(cosmetics);
  if (!skinId || skinId === DEFAULT_PIECE_SKIN) return base;
  const resolved = structuredClone(base);
  if (!resolved.owned.pieceSkin.includes(skinId)) {
    resolved.owned.pieceSkin = [...resolved.owned.pieceSkin, skinId];
  }
  resolved.equipped.pieceSkin = skinId;
  return resolved;
}

/** CSS class suffix for an equipped piece skin, e.g. " piece-skin-ember". */
export function pieceSkinCssSuffix(skinId) {
  if (!skinId || skinId === DEFAULT_PIECE_SKIN) return "";
  return ` piece-skin-${skinId.replace("skin_", "")}`;
}
