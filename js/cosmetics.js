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
  { id: "avatar_scout", type: "avatar", name: "Scout", rarity: "common", desc: "Forest green portrait." },
  { id: "avatar_crystal", type: "avatar", name: "Crystal Eye", rarity: "uncommon", desc: "Teal crystal portrait." },
  { id: "avatar_moon", type: "avatar", name: "Moonlit", rarity: "rare", desc: "Silver moon portrait." },
  { id: "avatar_flame", type: "avatar", name: "Blaze", rarity: "epic", desc: "Fiery orange portrait." },
  { id: "avatar_cosmos", type: "avatar", name: "Cosmos", rarity: "legendary", desc: "Nebula swirl portrait." },
  { id: "avatar_sage", type: "avatar", name: "Sage", rarity: "common", desc: "Muted sage green portrait." },
  { id: "avatar_rookie", type: "avatar", name: "Rookie", rarity: "common", desc: "Sky blue cadet portrait." },
  { id: "avatar_aurora", type: "avatar", name: "Aurora", rarity: "uncommon", desc: "Northern lights portrait." },

  { id: "frame_default", type: "frame", name: "Simple Frame", rarity: "common", desc: "Plain border." },
  { id: "frame_bronze", type: "frame", name: "Bronze Frame", rarity: "uncommon", desc: "Bronze border." },
  { id: "frame_silver", type: "frame", name: "Silver Frame", rarity: "rare", desc: "Silver frame." },
  { id: "frame_gold", type: "frame", name: "Gold Frame", rarity: "epic", desc: "Gold border." },
  { id: "frame_legend", type: "frame", name: "Star Frame", rarity: "legendary", desc: "Colorful star border." },
  { id: "frame_oak", type: "frame", name: "Oak Frame", rarity: "common", desc: "Wood grain border." },
  { id: "frame_emerald", type: "frame", name: "Emerald Frame", rarity: "uncommon", desc: "Green gem border." },
  { id: "frame_sapphire", type: "frame", name: "Sapphire Frame", rarity: "rare", desc: "Blue sapphire border." },
  { id: "frame_ruby", type: "frame", name: "Ruby Frame", rarity: "epic", desc: "Crimson gem border." },
  { id: "frame_crown", type: "frame", name: "Crown Frame", rarity: "legendary", desc: "Royal crown border." },
  { id: "frame_iron", type: "frame", name: "Iron Frame", rarity: "common", desc: "Forged steel border." },
  { id: "frame_woven", type: "frame", name: "Woven Frame", rarity: "common", desc: "Braided rope border." },
  { id: "frame_copper", type: "frame", name: "Copper Frame", rarity: "uncommon", desc: "Warm copper border." },

  { id: "banner_default", type: "banner", name: "Classic Board", rarity: "common", desc: "Classic checkerboard colors." },
  { id: "banner_nebula", type: "banner", name: "Nebula", rarity: "uncommon", desc: "Purple gradient banner." },
  { id: "banner_crimson", type: "banner", name: "Crimson", rarity: "rare", desc: "Red gradient banner." },
  { id: "banner_storm", type: "banner", name: "Storm", rarity: "epic", desc: "Blue lightning banner." },
  { id: "banner_aurora", type: "banner", name: "Aurora", rarity: "legendary", desc: "Rainbow gradient banner." },
  { id: "banner_forest", type: "banner", name: "Forest", rarity: "common", desc: "Deep green woodland banner." },
  { id: "banner_sunset", type: "banner", name: "Sunset", rarity: "uncommon", desc: "Warm orange dusk banner." },
  { id: "banner_midnight", type: "banner", name: "Midnight", rarity: "rare", desc: "Dark blue night banner." },
  { id: "banner_ocean", type: "banner", name: "Ocean", rarity: "epic", desc: "Deep sea teal banner." },
  { id: "banner_eclipse", type: "banner", name: "Eclipse", rarity: "legendary", desc: "Solar eclipse banner." },
  { id: "banner_sand", type: "banner", name: "Sand Dune", rarity: "common", desc: "Warm desert sand banner." },
  { id: "banner_mist", type: "banner", name: "Mist", rarity: "common", desc: "Soft grey fog banner." },
  { id: "banner_dawn", type: "banner", name: "Dawn", rarity: "uncommon", desc: "Pink sunrise banner." },

  { id: "skin_classic", type: "pieceSkin", name: "Classic Disc", rarity: "common", desc: "Traditional checker pieces." },
  { id: "skin_ember", type: "pieceSkin", name: "Ember Core", rarity: "uncommon", desc: "Glowing coal gradients." },
  { id: "skin_frost", type: "pieceSkin", name: "Frost Shard", rarity: "rare", desc: "Icy crystal pieces." },
  { id: "skin_arcane", type: "pieceSkin", name: "Rune Glow", rarity: "epic", desc: "Glowing piece style." },
  { id: "skin_void", type: "pieceSkin", name: "Void Marble", rarity: "legendary", desc: "Dark starlit marbles." },
  { id: "skin_wood", type: "pieceSkin", name: "Wood Grain", rarity: "common", desc: "Natural wooden discs." },
  { id: "skin_moss", type: "pieceSkin", name: "Moss Stone", rarity: "uncommon", desc: "Earthy mossy stones." },
  { id: "skin_jade", type: "pieceSkin", name: "Jade Disc", rarity: "rare", desc: "Polished jade pieces." },
  { id: "skin_solar", type: "pieceSkin", name: "Solar Flare", rarity: "epic", desc: "Radiant sunlit pieces." },
  { id: "skin_prism", type: "pieceSkin", name: "Prism Shard", rarity: "legendary", desc: "Iridescent rainbow marbles." },
  { id: "skin_clay", type: "pieceSkin", name: "Clay Disc", rarity: "common", desc: "Terracotta clay pieces." },
  { id: "skin_slate", type: "pieceSkin", name: "Slate Stone", rarity: "common", desc: "Cool grey slate pieces." },
  { id: "skin_bronze", type: "pieceSkin", name: "Bronze Disc", rarity: "uncommon", desc: "Polished bronze pieces." },
];

/** Default profile catalog exclude toggles. */
export const DEFAULT_COSMETIC_EXCLUDE_OPTIONS = {
  others: true,
  unowned: false,
  owned: false,
  starters: false,
};

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
    pulls: 5,
    weights: { common: 50, uncommon: 35, rare: 12, epic: 3 },
  },
  {
    id: "gold",
    name: "Gold Cosmetic Box",
    cost: 100,
    pulls: 8,
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

/** Free starter items — never awarded from boxes (players already own them). */
export const STARTER_COSMETIC_IDS = new Set([
  "avatar_default",
  "frame_default",
  "banner_default",
  "skin_classic",
]);

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

function poolOfRarity(rarity, { excludeStarters = false } = {}) {
  return COSMETIC_ITEMS.filter(
    (c) => c.rarity === rarity && (!excludeStarters || !STARTER_COSMETIC_IDS.has(c.id))
  );
}

function unownedPullablePool(profile, rarity) {
  return poolOfRarity(rarity, { excludeStarters: true }).filter(
    (c) => !profile.cosmetics.owned[c.type].includes(c.id)
  );
}

export function drawCosmeticItem(profile, weightsOrBox) {
  const weights = weightsOrBox.weights || weightsOrBox;
  profile.cosmetics = normalizeCosmetics(profile.cosmetics);
  for (let attempt = 0; attempt < 40; attempt++) {
    const rarity = pickRarity(weights);
    const unowned = unownedPullablePool(profile, rarity);
    if (unowned.length) {
      const pick = unowned[Math.floor(Math.random() * unowned.length)];
      profile.cosmetics.owned[pick.type].push(pick.id);
      return { ...pick, duplicate: false };
    }
    const ownedPool = poolOfRarity(rarity, { excludeStarters: true });
    if (!ownedPool.length) continue;
    const pick = ownedPool[Math.floor(Math.random() * ownedPool.length)];
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
