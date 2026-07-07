import { getPlayableCards, maxCopiesForCard } from "./cardCatalog.js";
import { RARITY_GEM_DUPE } from "./cosmetics.js";
import { addToCollection, collectionCount, saveProfile } from "./storage.js";

export const CHESTS = [
  { id: "bronze", name: "Bronze Chest", cost: 25, cards: 3, weights: { common: 70, uncommon: 25, rare: 5, epic: 0 } },
  { id: "silver", name: "Silver Chest", cost: 50, cards: 5, weights: { common: 50, uncommon: 35, rare: 12, epic: 3 } },
  { id: "gold", name: "Gold Chest", cost: 100, cards: 8, weights: { common: 32, uncommon: 38, rare: 22, epic: 6, legendary: 2 } },
];

function pickRarity(weights) {
  const roll = Math.random() * 100;
  let acc = 0;
  for (const r of ["common", "uncommon", "rare", "epic", "legendary"]) {
    acc += weights[r] || 0;
    if (roll <= acc) return r;
  }
  return "common";
}

function drawCardOfRarity(rarity) {
  const pool = getPlayableCards().filter((c) => c.rarity === rarity);
  if (!pool.length) return getPlayableCards()[0];
  return pool[Math.floor(Math.random() * pool.length)];
}

export function drawChestCard(_profile, chest) {
  const rarity = pickRarity(chest.weights);
  return drawCardOfRarity(rarity);
}

/**
 * Grant a pulled card to the collection, or convert to gems/stars when already at max copies.
 * @param {{ starRefundChance?: number }} [options] — mystery boxes pass 0.1 for a star refund roll.
 */
export function grantChestCard(profile, card, options = {}) {
  const { starRefundChance = 0 } = options;
  const owned = collectionCount(profile, card.id);
  if (owned < maxCopiesForCard(card)) {
    addToCollection(profile, card.id, 1);
    return { ...card, duplicate: false };
  }

  const gemRefund = RARITY_GEM_DUPE[card.rarity] || 5;
  if (starRefundChance > 0 && Math.random() < starRefundChance) {
    const starRefund = Math.random() < 0.5 ? 1 : 2;
    return { ...card, duplicate: true, starRefund };
  }
  return { ...card, duplicate: true, gemRefund };
}

export function openChest(profile, chestId) {
  const chest = CHESTS.find((c) => c.id === chestId);
  if (!chest) return { success: false, message: "Unknown chest." };
  if (profile.gems < chest.cost) return { success: false, message: "Not enough gems." };

  profile.gems -= chest.cost;
  const pulls = [];
  let bonusGems = 0;
  for (let i = 0; i < chest.cards; i++) {
    const card = drawChestCard(profile, chest);
    const pull = grantChestCard(profile, card);
    pulls.push(pull);
    if (pull.gemRefund) bonusGems += pull.gemRefund;
  }
  if (bonusGems) profile.gems += bonusGems;
  saveProfile(profile);
  return { success: true, pulls, chest, bonusGems };
}
