import { drawChestCard, grantChestCard } from "./chests.js";
import { drawCosmeticItem } from "./cosmetics.js";
import { isCosmeticsUnlocked } from "./adventure.js";
import { trackDailyQuestEvent } from "./dailyQuests.js";
import {
  ownsTitle,
  TITLE_BOX_TITLES,
  unlockTitleFromBox,
} from "./mageTitles.js";
import { saveProfile } from "./storage.js";

export const MYSTERY_BOX_COST = 10;
export const TITLE_BOX_COST = 10;

/** Mystery Box: each of the 6 pulls is cosmetics vs spells (when cosmetics unlocked). */
export const MYSTERY_BOX_PULL_COUNT = 6;
export const MYSTERY_BOX_MIX_COSMETIC_CHANCE = 0.5;

/** When a spell pull is a duplicate (3 copies owned), chance to refund stars instead of gems. */
export const MYSTERY_BOX_DUPE_STAR_CHANCE = 0.1;

/** Stars refunded when a Title Box pull is a duplicate. */
export const TITLE_BOX_DUPE_STAR_REFUND = 3;

const CARD_TIERS = [
  { id: "bronze", name: "Bronze Chest", cards: 3, weights: { common: 70, uncommon: 25, rare: 5, epic: 0 } },
  { id: "silver", name: "Silver Chest", cards: 5, weights: { common: 50, uncommon: 35, rare: 12, epic: 3 } },
  { id: "gold", name: "Gold Chest", cards: 8, weights: { common: 32, uncommon: 38, rare: 22, epic: 6, legendary: 2 } },
];

const COS_TIERS = [
  { id: "bronze", name: "Bronze Cosmetic Box", pulls: 3, weights: { common: 70, uncommon: 25, rare: 5, epic: 0 } },
  { id: "silver", name: "Silver Cosmetic Box", pulls: 5, weights: { common: 50, uncommon: 35, rare: 12, epic: 3 } },
  { id: "gold", name: "Gold Cosmetic Box", pulls: 8, weights: { common: 32, uncommon: 38, rare: 22, epic: 6, legendary: 2 } },
];

function pickTier(tiers, { premium = false } = {}) {
  const roll = Math.random() * 100;
  if (premium) {
    if (roll > 50) return tiers[2];
    if (roll > 15) return tiers[1];
    return tiers[0];
  }
  if (roll > 70) return tiers[2];
  if (roll > 35) return tiers[1];
  return tiers[0];
}

export function openMysteryBox(profile) {
  if ((profile.stars ?? 0) < MYSTERY_BOX_COST) {
    return { success: false, message: "Not enough stars." };
  }
  profile.stars = (profile.stars ?? 0) - MYSTERY_BOX_COST;

  const cosmeticsAllowed = isCosmeticsUnlocked(profile);
  const cardPulls = [];
  const cosPulls = [];
  let bonusGems = 0;
  let bonusStars = 0;

  for (let i = 0; i < MYSTERY_BOX_PULL_COUNT; i++) {
    const isCosmetic = cosmeticsAllowed && Math.random() < MYSTERY_BOX_MIX_COSMETIC_CHANCE;
    if (isCosmetic) {
      const tier = pickTier(COS_TIERS);
      const item = drawCosmeticItem(profile, tier.weights);
      if (item) {
        cosPulls.push(item);
        if (item.duplicate) bonusGems += item.gemRefund || 10;
      }
    } else {
      const tier = pickTier(CARD_TIERS);
      const card = drawChestCard(profile, tier);
      const pull = grantChestCard(profile, card, {
        starRefundChance: MYSTERY_BOX_DUPE_STAR_CHANCE,
      });
      cardPulls.push(pull);
      if (pull.gemRefund) bonusGems += pull.gemRefund;
      if (pull.starRefund) bonusStars += pull.starRefund;
    }
  }

  if (bonusGems) profile.gems = (profile.gems || 0) + bonusGems;
  if (bonusStars) profile.stars = (profile.stars ?? 0) + bonusStars;
  trackDailyQuestEvent(profile, "boxes_opened", 1);
  saveProfile(profile);

  const kind =
    cardPulls.length && cosPulls.length ? "mixed" : cardPulls.length ? "card" : "cosmetic";

  return {
    success: true,
    kind,
    cardPulls,
    cosPulls,
    bonusGems,
    bonusStars,
    message: `Got ${cardPulls.length} spells and ${cosPulls.length} cosmetics`,
  };
}

export function openTitleBox(profile) {
  if ((profile.stars ?? 0) < TITLE_BOX_COST) {
    return { success: false, message: "Not enough stars." };
  }
  profile.stars = (profile.stars ?? 0) - TITLE_BOX_COST;

  const unowned = TITLE_BOX_TITLES.filter((t) => !ownsTitle(profile, t.id));
  let pull;
  let bonusStars = 0;

  if (unowned.length) {
    const title = unowned[Math.floor(Math.random() * unowned.length)];
    unlockTitleFromBox(profile, title.id);
    pull = { ...title, duplicate: false };
  } else {
    const title = TITLE_BOX_TITLES[Math.floor(Math.random() * TITLE_BOX_TITLES.length)];
    bonusStars = TITLE_BOX_DUPE_STAR_REFUND;
    profile.stars = (profile.stars ?? 0) + bonusStars;
    pull = { ...title, duplicate: true, starRefund: bonusStars };
  }

  trackDailyQuestEvent(profile, "boxes_opened", 1);
  saveProfile(profile);
  return {
    success: true,
    kind: "title",
    pulls: [pull],
    bonusStars,
    message: pull.duplicate
      ? `Duplicate ${pull.name} — +${bonusStars} ★ refunded`
      : `Unlocked title: ${pull.name}`,
  };
}
