/**
 * Mage titles unlocked via achievements — equip + display helpers.
 */

export const TITLE_RARITIES = ["common", "uncommon", "rare", "epic", "legendary", "mythic"];

/** @type {{ id: string, name: string, display: string, rarity: string, glow: string, achievementId: string }[]} */
export const MAGE_TITLES = [
  {
    id: "title_stormborn",
    name: "Stormborn",
    display: "Stormborn",
    rarity: "epic",
    glow: "cyan",
    achievementId: "storm_summoner",
  },
  {
    id: "title_tactician",
    name: "The Tactician",
    display: "The Tactician",
    rarity: "epic",
    glow: "violet",
    achievementId: "calculated_sacrifice",
  },
  {
    id: "title_survivor",
    name: "Survivor",
    display: "Survivor",
    rarity: "rare",
    glow: "ember",
    achievementId: "close_call",
  },
  {
    id: "title_decimator",
    name: "Decimator",
    display: "Decimator",
    rarity: "legendary",
    glow: "crimson",
    achievementId: "magical_sweep",
  },
  {
    id: "title_undefeated",
    name: "Undefeated",
    display: "Undefeated",
    rarity: "legendary",
    glow: "gold",
    achievementId: "no_mercy",
  },
  {
    id: "title_winters_wrath",
    name: "Winter's Wrath",
    display: "Winter's Wrath",
    rarity: "rare",
    glow: "frost",
    achievementId: "frozen_hearth",
  },
  {
    id: "title_dynast",
    name: "Dynast",
    display: "Dynast",
    rarity: "uncommon",
    glow: "amber",
    achievementId: "royal_fleet",
  },
  {
    id: "title_puppeteer",
    name: "Puppeteer",
    display: "Puppeteer",
    rarity: "rare",
    glow: "purple",
    achievementId: "mind_bender",
  },
  {
    id: "title_trapper",
    name: "Trapper",
    display: "Trapper",
    rarity: "common",
    glow: "forest",
    achievementId: "silent_assassin",
  },
  {
    id: "title_executioner",
    name: "Executioner",
    display: "Executioner",
    rarity: "epic",
    glow: "crimson",
    achievementId: "executioner",
  },
  {
    id: "title_grand_magus",
    name: "Grand Magus",
    display: "Grand Magus",
    rarity: "mythic",
    glow: "rainbow",
    achievementId: "arcane_mastery",
  },
  {
    id: "title_champion",
    name: "Champion",
    display: "Champion",
    rarity: "legendary",
    glow: "gold",
    achievementId: "champion",
  },
];

export const MAGE_TITLE_BY_ID = Object.fromEntries(MAGE_TITLES.map((t) => [t.id, t]));
export const TITLE_BY_ACHIEVEMENT = Object.fromEntries(MAGE_TITLES.map((t) => [t.achievementId, t]));

export const TITLE_RARITY_CLASS = {
  common: "mage-title--common",
  uncommon: "mage-title--uncommon",
  rare: "mage-title--rare",
  epic: "mage-title--epic",
  legendary: "mage-title--legendary",
  mythic: "mage-title--mythic",
};

export function getUnlockedTitles(profile) {
  return profile?.cosmetics?.unlockedTitles || [];
}

export function getEquippedTitleId(profile) {
  return profile?.cosmetics?.equippedTitle || null;
}

export function ownsTitle(profile, titleId) {
  return getUnlockedTitles(profile).includes(titleId);
}

export function equipTitle(profile, titleId) {
  if (!titleId) {
    profile.cosmetics.equippedTitle = null;
    return { success: true, message: "Title unequipped." };
  }
  if (!ownsTitle(profile, titleId)) {
    return { success: false, message: "Title not unlocked yet." };
  }
  profile.cosmetics.equippedTitle = titleId;
  return { success: true, message: "Title equipped!" };
}

export function unlockTitleForAchievement(profile, achievementId) {
  const title = TITLE_BY_ACHIEVEMENT[achievementId];
  if (!title) return null;
  if (!profile.cosmetics.unlockedTitles.includes(title.id)) {
    profile.cosmetics.unlockedTitles.push(title.id);
    return title;
  }
  return null;
}

export function titleTagHtml(titleId, { compact = false } = {}) {
  const title = MAGE_TITLE_BY_ID[titleId];
  if (!title) return "";
  const cls = [
    "mage-title-tag",
    TITLE_RARITY_CLASS[title.rarity] || "",
    `mage-title-tag--glow-${title.glow}`,
    compact ? "mage-title-tag--compact" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return `<span class="${cls}" title="${title.name} Mage Title">[${title.display}]</span>`;
}

export function equippedTitleTagHtml(profile, opts) {
  const id = getEquippedTitleId(profile);
  if (!id || !ownsTitle(profile, id)) return "";
  return titleTagHtml(id, opts);
}
