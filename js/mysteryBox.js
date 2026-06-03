import { drawChestCard } from "./chests.js";
import { drawCosmeticItem } from "./cosmetics.js";
import { addToCollection, saveProfile } from "./storage.js";

export const MYSTERY_BOX_COST = 10;

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

function pickTier(tiers) {
  const roll = Math.random() * 100;
  if (roll > 70) return tiers[2];
  if (roll > 35) return tiers[1];
  return tiers[0];
}

export function openMysteryBox(profile) {
  if ((profile.stars ?? 0) < MYSTERY_BOX_COST) {
    return { success: false, message: "Not enough stars." };
  }
  profile.stars = (profile.stars ?? 0) - MYSTERY_BOX_COST;

  const isCard = Math.random() < 0.5;
  if (isCard) {
    const tier = pickTier(CARD_TIERS);
    const pulls = [];
    for (let i = 0; i < tier.cards; i++) {
      const card = drawChestCard(profile, tier);
      pulls.push(card);
      addToCollection(profile, card.id, 1);
    }
    saveProfile(profile);
    return { success: true, kind: "card", tier, pulls, message: `Cards from ${tier.name}` };
  }

  profile.cosmetics = profile.cosmetics || {};
  const tier = pickTier(COS_TIERS);
  const pulls = [];
  let bonusGems = 0;
  for (let i = 0; i < tier.pulls; i++) {
    const item = drawCosmeticItem(profile, tier.weights);
    if (item) {
      pulls.push(item);
      if (item.duplicate) bonusGems += item.gemRefund ?? 0;
    }
  }
  if (bonusGems) profile.gems = (profile.gems || 0) + bonusGems;
  saveProfile(profile);
  return { success: true, kind: "cosmetic", tier, pulls, bonusGems, message: `Cosmetics from ${tier.name}` };
}
