/**
 * Mage titles unlocked via achievements — equip + display helpers.
 */

export const TITLE_RARITIES = ["common", "uncommon", "rare", "epic", "legendary", "mythic"];

/** @type {{ id: string, name: string, display: string, rarity: string, glow: string, color?: string, achievementId?: string, boxExclusive?: boolean }[]} */
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
  {
    id: "title_explorer",
    name: "Explorer",
    display: "Explorer",
    rarity: "legendary",
    glow: "frost",
    achievementId: "explorer",
  },
  {
    id: "title_the_brave",
    name: "The Brave",
    display: "The Brave",
    rarity: "rare",
    glow: "ember",
    boxExclusive: true,
  },
  {
    id: "title_ruthless",
    name: "Ruthless",
    display: "Ruthless",
    rarity: "epic",
    glow: "crimson",
    boxExclusive: true,
  },
  {
    id: "title_the_eternal",
    name: "The Eternal",
    display: "The Eternal",
    rarity: "legendary",
    glow: "frost",
    boxExclusive: true,
  },
  {
    id: "title_dark_mage",
    name: "Dark Mage",
    display: "Dark Mage",
    rarity: "epic",
    glow: "violet",
    color: "dark-purple",
    boxExclusive: true,
  },
  {
    id: "title_bloodthirsty",
    name: "Bloodthirsty",
    display: "Bloodthirsty",
    rarity: "epic",
    glow: "crimson",
    color: "crimson",
    boxExclusive: true,
  },
  {
    id: "title_angelic",
    name: "Angelic",
    display: "Angelic",
    rarity: "legendary",
    glow: "cyan",
    boxExclusive: true,
  },
  {
    id: "title_the_brilliant",
    name: "The Brilliant",
    display: "The Brilliant",
    rarity: "legendary",
    glow: "gold",
    boxExclusive: true,
  },
  {
    id: "title_omnipotent",
    name: "Omnipotent",
    display: "Omnipotent",
    rarity: "mythic",
    glow: "rainbow",
    boxExclusive: true,
  },
];

export const MAGE_TITLE_BY_ID = Object.fromEntries(MAGE_TITLES.map((t) => [t.id, t]));
export const TITLE_BY_ACHIEVEMENT = Object.fromEntries(
  MAGE_TITLES.filter((t) => t.achievementId).map((t) => [t.achievementId, t])
);
export const TITLE_BOX_TITLES = MAGE_TITLES.filter((t) => t.boxExclusive);
export const TITLE_BOX_TITLE_IDS = new Set(TITLE_BOX_TITLES.map((t) => t.id));

export const TITLE_RARITY_CLASS = {
  common: "mage-title--common",
  uncommon: "mage-title--uncommon",
  rare: "mage-title--rare",
  epic: "mage-title--epic",
  legendary: "mage-title--legendary",
  mythic: "mage-title--mythic",
};

export const TITLE_COLOR_CLASS = {
  crimson: "mage-title--color-crimson",
  "dark-purple": "mage-title--color-dark-purple",
};

export function titleTagClasses(title, { compact = false } = {}) {
  return [
    "mage-title-tag",
    TITLE_RARITY_CLASS[title.rarity] || "",
    TITLE_COLOR_CLASS[title.color] || "",
    `mage-title-tag--glow-${title.glow}`,
    compact ? "mage-title-tag--compact" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

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

export function unlockTitleFromBox(profile, titleId) {
  if (!TITLE_BOX_TITLE_IDS.has(titleId)) return null;
  if (!profile.cosmetics) profile.cosmetics = { unlockedTitles: [], equippedTitle: null };
  if (!profile.cosmetics.unlockedTitles) profile.cosmetics.unlockedTitles = [];
  if (!profile.cosmetics.unlockedTitles.includes(titleId)) {
    profile.cosmetics.unlockedTitles.push(titleId);
    return MAGE_TITLE_BY_ID[titleId];
  }
  return null;
}

export function titleTagHtml(titleId, { compact = false } = {}) {
  const title = MAGE_TITLE_BY_ID[titleId];
  if (!title) return "";
  return `<span class="${titleTagClasses(title, { compact })}" title="${title.name} Mage Title">[${title.display}]</span>`;
}

export function equippedTitleTagHtml(profile, opts) {
  const id = getEquippedTitleId(profile);
  if (!id || !ownsTitle(profile, id)) return "";
  return titleTagHtml(id, opts);
}
