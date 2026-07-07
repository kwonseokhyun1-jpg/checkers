import { drawChestCard, grantChestCard } from "./chests.js";
import { drawCosmeticItem } from "./cosmetics.js";
import { isCosmeticsUnlocked } from "./adventure.js";
import { saveProfile } from "./storage.js";

export const MYSTERY_BOX_COST = 10;
export const BIG_MYSTERY_BOX_COST = 20;

/** Small Mystery Box (10★): chance each open grants cosmetics instead of spells. */
export const SMALL_MYSTERY_BOX_COSMETIC_CHANCE = 0.5;

/** When a spell pull is a duplicate (3 copies owned), chance to refund stars instead of gems. */
export const MYSTERY_BOX_DUPE_STAR_CHANCE = 0.1;

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

function grantCardTier(profile, tier, { starRefundChance = 0 } = {}) {
  const pulls = [];
  let bonusGems = 0;
  let bonusStars = 0;
  for (let i = 0; i < tier.cards; i++) {
    const card = drawChestCard(profile, tier);
    const pull = grantChestCard(profile, card, { starRefundChance });
    pulls.push(pull);
    if (pull.gemRefund) bonusGems += pull.gemRefund;
    if (pull.starRefund) bonusStars += pull.starRefund;
  }
  if (bonusGems) profile.gems = (profile.gems || 0) + bonusGems;
  if (bonusStars) profile.stars = (profile.stars ?? 0) + bonusStars;
  return { pulls, bonusGems, bonusStars };
}

function grantCosmeticTier(profile, tier) {
  profile.cosmetics = profile.cosmetics || {};
  const pulls = [];
  let bonusGems = 0;
  for (let i = 0; i < tier.pulls; i++) {
    const item = drawCosmeticItem(profile, tier.weights);
    if (item) {
      pulls.push(item);
      if (item.duplicate) bonusGems += item.gemRefund || 5;
    }
  }
  if (bonusGems) profile.gems = (profile.gems || 0) + bonusGems;
  return { pulls, bonusGems };
}

export function openMysteryBox(profile) {
  if ((profile.stars ?? 0) < MYSTERY_BOX_COST) {
    return { success: false, message: "Not enough stars." };
  }
  profile.stars = (profile.stars ?? 0) - MYSTERY_BOX_COST;

  const cosmeticsAllowed = isCosmeticsUnlocked(profile);
  const isCosmetic = cosmeticsAllowed && Math.random() < SMALL_MYSTERY_BOX_COSMETIC_CHANCE;
  if (!isCosmetic) {
    const tier = pickTier(CARD_TIERS);
    const { pulls, bonusGems, bonusStars } = grantCardTier(profile, tier, {
      starRefundChance: MYSTERY_BOX_DUPE_STAR_CHANCE,
    });
    saveProfile(profile);
    return {
      success: true,
      kind: "card",
      tier,
      pulls,
      bonusGems,
      bonusStars,
      message: `Cards from ${tier.name}`,
    };
  }

  const tier = pickTier(COS_TIERS);
  const { pulls, bonusGems } = grantCosmeticTier(profile, tier);
  saveProfile(profile);
  return { success: true, kind: "cosmetic", tier, pulls, bonusGems, message: `Cosmetics from ${tier.name}` };
}

export function openBigMysteryBox(profile) {
  if ((profile.stars ?? 0) < BIG_MYSTERY_BOX_COST) {
    return { success: false, message: "Not enough stars." };
  }
  profile.stars = (profile.stars ?? 0) - BIG_MYSTERY_BOX_COST;

  const cardTier = pickTier(CARD_TIERS, { premium: true });
  const { pulls: cardPulls, bonusGems: cardBonusGems, bonusStars } = grantCardTier(profile, cardTier, {
    starRefundChance: MYSTERY_BOX_DUPE_STAR_CHANCE,
  });
  let cosPulls = [];
  let bonusGems = cardBonusGems;
  let cosTier = null;
  if (isCosmeticsUnlocked(profile)) {
    cosTier = pickTier(COS_TIERS, { premium: true });
    const cosResult = grantCosmeticTier(profile, cosTier);
    cosPulls = cosResult.pulls;
    bonusGems += cosResult.bonusGems;
  }
  saveProfile(profile);

  return {
    success: true,
    kind: cosPulls.length ? "both" : "card",
    cardTier,
    cardPulls,
    cosTier,
    cosPulls,
    bonusGems,
    bonusStars,
    message: cosPulls.length
      ? `Big haul: ${cardPulls.length} spells + ${cosPulls.length} cosmetics`
      : `Cards from ${cardTier.name}`,
  };
}
