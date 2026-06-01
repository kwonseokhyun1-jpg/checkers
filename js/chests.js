import { getPlayableCards } from "./cardCatalog.js";
import { saveProfile } from "./storage.js";

export const CHESTS = [
  { id: "bronze", name: "Bronze Reliquary", cost: 50, cards: 3, weights: { common: 70, uncommon: 25, rare: 5, epic: 0 } },
  { id: "silver", name: "Silver Reliquary", cost: 100, cards: 5, weights: { common: 50, uncommon: 35, rare: 12, epic: 3 } },
  { id: "gold", name: "Gold Reliquary", cost: 200, cards: 8, weights: { common: 35, uncommon: 40, rare: 20, epic: 5 } },
];

function pickRarity(weights) {
  const roll = Math.random() * 100;
  let acc = 0;
  for (const r of ["common", "uncommon", "rare", "epic"]) {
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

export function openChest(profile, chestId) {
  const chest = CHESTS.find((c) => c.id === chestId);
  if (!chest) return { success: false, message: "Unknown chest." };
  if (profile.gems < chest.cost) return { success: false, message: "Not enough gems." };

  profile.gems -= chest.cost;
  const pulls = [];
  for (let i = 0; i < chest.cards; i++) {
    const rarity = pickRarity(chest.weights);
    const card = drawCardOfRarity(rarity);
    pulls.push(card);
    profile.collection[card.id] = (profile.collection[card.id] || 0) + 1;
  }
  saveProfile(profile);
  return { success: true, pulls, chest };
}
