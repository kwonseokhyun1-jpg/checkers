/**
 * Lists registry cards with no dedicated visual FX.
 * Run: node scripts/audit-card-animations.js
 */
import { CARD_REGISTRY } from "../js/cardRegistry.js";
import { visualForEffect, metaOverlayForEffect } from "../js/spellFx.js";
import { isRemovedCard, isEconomyCard, isKnightCard } from "../js/cardCatalog.js";

const REACTIVE_FX = {
  landmine: "mine blast (on trigger)",
  bomb: "bomb blast (on move)",
};

const withVisual = [];
const genericOnly = [];
const metaOverlayOnly = [];
const reactiveOnly = [];

for (const card of CARD_REGISTRY) {
  if (card.weight === 0 || isRemovedCard(card.id) || isEconomyCard(card.id) || isKnightCard(card.id)) {
    continue;
  }
  const eff = card.effect;
  if (REACTIVE_FX[eff]) {
    reactiveOnly.push({ id: card.id, name: card.name, note: REACTIVE_FX[eff] });
    continue;
  }
  if (eff === "cull") {
    withVisual.push({ id: card.id, name: card.name, visual: "shadow/cull" });
    continue;
  }
  const visual = visualForEffect(eff);
  const meta = metaOverlayForEffect(eff);
  if (visual || meta) {
    withVisual.push({ id: card.id, name: card.name, visual: visual || `overlay:${meta}` });
  } else if (card.mode === "instant" && !meta) {
    genericOnly.push({ id: card.id, name: card.name, effect: eff });
  } else {
    genericOnly.push({ id: card.id, name: card.name, effect: eff });
  }
}

console.log("=== Cards WITHOUT unique animation (generic square/banner only) ===\n");
genericOnly.forEach((c) => console.log(`- ${c.name} (${c.id}) [${c.effect}]`));
console.log(`\nTotal: ${genericOnly.length}\n`);

console.log("=== Cards WITH dedicated visuals ===\n");
withVisual.forEach((c) => console.log(`- ${c.name} (${c.id}) → ${c.visual}`));
console.log(`\nTotal: ${withVisual.length}\n`);

console.log("=== Reactive FX (not on cast) ===\n");
reactiveOnly.forEach((c) => console.log(`- ${c.name}: ${c.note}`));
