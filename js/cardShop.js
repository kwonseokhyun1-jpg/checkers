/** Buy extra copies of owned spells from the collection inventory */
import { getCardDef, MAX_COPIES_PER_CARD } from "./cardCatalog.js";
import { addToCollection, collectionCount, collectionRoom, saveProfile } from "./storage.js";

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

  if (owned >= MAX_COPIES_PER_CARD) {
    return { success: false, message: `You already own the maximum (${MAX_COPIES_PER_CARD} copies).` };
  }

  const cost = getBuyCost(def.rarity);
  if (profile.gems < cost) {
    return { success: false, message: `Need ${cost} gems (${profile.gems} available).` };
  }

  profile.gems -= cost;
  const added = addToCollection(profile, cardId, 1);
  if (!added) {
    profile.gems += cost;
    saveProfile(profile);
    return { success: false, message: `You already own the maximum (${MAX_COPIES_PER_CARD} copies).` };
  }

  return {
    success: true,
    cost,
    message: `+1 ${def.name} for ${cost} gems (${owned + added} owned).`,
  };
}
