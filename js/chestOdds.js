/** Format chest rarity weights for shop UI (matches mystery-box desc style). */

const RARITY_ORDER = ["common", "uncommon", "rare", "epic", "legendary"];

export function formatRarityOdds(weights, { minPct = 1 } = {}) {
  return RARITY_ORDER.filter((r) => (weights[r] ?? 0) >= minPct)
    .map((r) => `${weights[r]}% ${r}`)
    .join(" · ");
}
