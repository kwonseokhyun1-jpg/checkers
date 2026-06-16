/** Short effect bullets for card hover tooltips */
const TAGS = {
  nudge: ["Move your piece 1 adjacent square"],
  shield_1: ["Shield 1 turn — blocks one capture or spell hit"],
  shield_2: ["Shield 2 turns — cannot be captured"],
  forward_bolt: ["Destroy first enemy on forward diagonal (Stab)"],
  trickster: ["Swap up to 6 random pieces (not on back ranks)"],
  purify: ["Removes all debuffs from your pieces, including burn and freeze"],
  chain_lightning: ["Strike adjacent enemies only", "Up to 2 kills if enemies touch each other", "Your piece is paralyzed 2 turns"],
  pyromancy: ["Enemy piece + empty dark square — both burn 2 turns; fire tiles block enemies", "You cannot cast spells on your next turn"],
  freeze_1: ["Enemy cannot move on their next turn"],
  snowball: ["Freeze an enemy piece — cannot move on its owner's next turn"],
  freeze_2: ["Enemy cannot move on their next turn"],
  deep_freeze: ["Freeze all enemies on one diagonal through your piece for 2 turns"],
  retreat_3: ["Backward movement for 3 turns"],
  bishop_2: ["Diagonal slide over empty dark squares for 2 turns"],
  rook_2: ["Rank/file slide over empty dark squares for 2 turns"],
  crown: ["Instantly crown a friendly piece"],
  swap_friendly: ["Swap two friendly pieces"],
  quick_march: ["Same piece moves again; either step may capture"],
  offering: ["Sacrifice a friendly piece", "Draw 2 cards", "Cast another spell immediately"],
  destroy_unshielded: ["Destroy any unshielded enemy", "You cannot cast spells on your next turn"],
  revive: ["Requires a captured friendly piece", "Place on any empty dark square except your back rank", "Revived piece cannot capture this turn"],
  blink_2: ["Teleport within 2 squares"],
  random_teleport: ["Jump to a random empty dark square", "Crowned if you land on the back rank"],
  long_step: ["Epic: leap 2 squares diagonally (no capture)"],
  sidestep: ["Step 1 square horizontally"],
  landmine: ["Hidden trap 2 turns — destroys enemy lander"],
  quicksand: ["Hidden trap — freezes the next piece to land there"],
  detonate: ["Destroy self + adjacent enemies"],
  venom: ["Poison — 2 ticks destroys target"],
  bomb: ["Arm friendly piece", "On next move: explodes", "Kills all adjacent pieces"],
  press: ["Opponent must move again after their normal move on their next turn"],
  mind_control: ["Convert an enemy man to your color for 2 of your turns", "Reverts to the enemy afterward"],
  barrier: ["Place on any dark square", "Blocks enemies for 2 turn cycles"],
  vengeance: ["Hidden trap — destroys the next enemy who captures your piece", "Your piece survives 2 turns (blood counters), then dies"],
  hibernation: ["Sleep 2 turns (immobile)", "Wake as king + Awoken Bear", "Extra move every turn after"],
  root_2: ["Enemy cannot jump/capture next turn"],
  silence_3: ["Suppress special movement 3 turns"],
  poison_3: ["Enemy dies in 3 turns — 3-turn poison bar"],
  deflect_1: ["Next hit reflects to random enemy"],
  last_stand: ["Hidden trap — ultra shield on capture or destroy for 3 turns"],
  clone: ["Your man, then adjacent empty square — copy cannot capture or be taken this turn; dies to freeze/poison/burn"],
  deport: ["Send an enemy back to its game-start square", "Destroys any piece already on that square"],
  bounty: ["Mark an enemy piece", "When you jump-capture it, draw 2 cards", "Spell destroys do not count"],
  link_fate: ["Link two enemies — when one is destroyed, the other dies too"],
};

const MODE_TAGS = {
  instant: ["Instant — no board target"],
  friendly: ["Target your piece"],
  enemy: ["Target enemy piece"],
  empty: ["Target empty dark square"],
  f_empty: ["Your piece, then destination"],
  f_f: ["Two friendly pieces"],
  f_e: ["Your piece, then enemy"],
  f_e_adj: ["Your piece, then adjacent enemy"],
  diagonal: ["Your piece, then diagonal strike"],
  discard_pick: ["Choose a card to discard"],
  e_e: ["Two enemy pieces"],
  column: ["Pick a board file (a–h)"],
};

export function getCardEffectTags(def) {
  const lines = [];
  if (TAGS[def.effect]) lines.push(...TAGS[def.effect]);
  else if (def.desc) lines.push(def.desc);
  if (MODE_TAGS[def.mode]) lines.push(...MODE_TAGS[def.mode]);
  if (def.rarity === "epic" || def.rarity === "legendary") {
    lines.push(`${def.rarity.charAt(0).toUpperCase() + def.rarity.slice(1)} spell`);
  }
  return [...new Set(lines)];
}

export function formatEffectTooltip(def) {
  return getCardEffectTags(def).join(" · ");
}
