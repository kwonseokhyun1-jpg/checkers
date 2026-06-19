import { getPlayableCards, maxCopiesForCard } from "./cardCatalog.js";
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

export function drawChestCard(profile, chest) {
  const room = (card) => (profile.collection[card.id] || 0) < maxCopiesForCard(card);
  for (let attempt = 0; attempt < 48; attempt++) {
    const rarity = pickRarity(chest.weights);
    const card = drawCardOfRarity(rarity);
    if (room(card)) return card;
  }
  const pool = getPlayableCards().filter(room);
  if (pool.length) return pool[Math.floor(Math.random() * pool.length)];
  return drawCardOfRarity(pickRarity(chest.weights));
}

export function openChest(profile, chestId) {
  const chest = CHESTS.find((c) => c.id === chestId);
  if (!chest) return { success: false, message: "Unknown chest." };
  if (profile.gems < chest.cost) return { success: false, message: "Not enough gems." };

  profile.gems -= chest.cost;
  const pulls = [];
  for (let i = 0; i < chest.cards; i++) {
    const card = drawChestCard(profile, chest);
    pulls.push(card);
    addToCollection(profile, card.id, 1);
  }
  saveProfile(profile);
  return { success: true, pulls, chest };
}
