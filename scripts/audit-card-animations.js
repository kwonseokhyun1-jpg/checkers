/**
 * Lists registry cards with no dedicated visual FX (unique visual, boardFx trigger, or cull).
 * Run: node scripts/audit-card-animations.js
 */
import { CARD_REGISTRY } from "../js/cardRegistry.js";
import { EFFECT_VISUAL } from "../js/spellFx.js";

const META_NO_BOARD = new Set([
  "quick_march", "overrun", "trickster", "ricochet", "blind", "confusion", "counterspell", "dominion",
  "conduct", "mirror_move", "roulette", "ignore", "mirror_board", "highlight_path",
  "pocket", "possession", "chameleon", "identity_theft", "succession",
  "twin_soul", "last_king", "constitution", "sanctuary_pulse", "parallel", "echo",
]);

const REACTIVE_FX = {
  landmine: "mine blast (on trigger)",
  bomb: "bomb blast (on move)",
};

const withVisual = [];
const genericOnly = [];
const metaBannerOnly = [];
const reactiveOnly = [];

for (const card of CARD_REGISTRY) {
  if (card.weight === 0) continue;
  const eff = card.effect;
  if (REACTIVE_FX[eff]) {
    reactiveOnly.push({ id: card.id, name: card.name, note: REACTIVE_FX[eff] });
    continue;
  }
  if (eff === "cull") {
    withVisual.push({ id: card.id, name: card.name, visual: "shadow/cull" });
    continue;
  }
  const visual = EFFECT_VISUAL[eff] || (eff === "bomb" ? "bomb_arm" : eff === "landmine" ? "landmine_arm" : null);
  if (visual) {
    withVisual.push({ id: card.id, name: card.name, visual });
  } else if (META_NO_BOARD.has(eff)) {
    metaBannerOnly.push({ id: card.id, name: card.name });
  } else {
    genericOnly.push({ id: card.id, name: card.name, effect: eff });
  }
}

console.log("=== Cards WITHOUT unique animation (generic square/banner only) ===\n");
genericOnly.forEach((c) => console.log(`- ${c.name} (${c.id}) [${c.effect}]`));
console.log(`\nTotal: ${genericOnly.length}\n`);

console.log("=== Meta / instant (banner shimmer only, no board squares) ===\n");
metaBannerOnly.forEach((c) => console.log(`- ${c.name} (${c.id})`));
console.log(`\nTotal: ${metaBannerOnly.length}\n`);

console.log("=== Reactive FX (not on cast) ===\n");
reactiveOnly.forEach((c) => console.log(`- ${c.name}: ${c.note}`));
