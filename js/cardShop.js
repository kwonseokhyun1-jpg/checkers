/** Buy extra copies of owned spells from the collection inventory */
import { getCardDef } from "./cardCatalog.js";
import { addToCollection, collectionCount, saveProfile } from "./storage.js";

export const BUY_COST_BY_RARITY = {
  common: 10,
  uncommon: 20,
  rare: 30,
  epic: 40,
  legendary: 50,
};

export function getBuyCost(rarity) {
  return BUY_COST_BY_RARITY[rarity] ?? 30;
}

/**
 * @param {object} profile
 * @param {string} cardId
 */
export function tryBuyCardCopy(profile, cardId) {
  const owned = collectionCount(profile, cardId);
  if (owned < 1) {
    return { success: false, message: "Unseal this spell from a chest first." };
  }

  const def = getCardDef(cardId);
  if (!def) return { success: false, message: "Unknown card." };

  const cost = getBuyCost(def.rarity);
  if (profile.gems < cost) {
    return { success: false, message: `Need ${cost} gems (${profile.gems} available).` };
  }

  profile.gems -= cost;
  addToCollection(profile, cardId, 1);
  saveProfile(profile);

  return {
    success: true,
    cost,
    message: `+1 ${def.name} for ${cost} gems (${owned + 1} owned).`,
  };
}
