/** Short effect bullets for card hover tooltips */
const TAGS = {
  nudge: ["Move your piece 1 adjacent square"],
  shield_2: ["Shield 2 turns — cannot be captured"],
  forward_bolt: ["Destroy first enemy on forward diagonal"],
  trickster: ["Swap 4 random pieces on the board"],
  purify: ["Removes all shields and curses board-wide"],
  chain_lightning: ["Strike adjacent enemies only", "Up to 2 kills if enemies touch each other", "Your piece is paralyzed 2 turns"],
  fireblast: ["Your piece, then first enemy ahead — burns through shields"],
  freeze_1: ["Enemy cannot move on their next turn"],
  freeze_2: ["Enemy cannot move on their next turn"],
  deep_freeze: ["Freeze all enemies on one diagonal through your piece for 2 turns"],
  retreat_3: ["Backward movement for 3 turns"],
  crown: ["Instantly crown a friendly piece"],
  swap_friendly: ["Swap two friendly pieces"],
  quick_march: ["Same piece moves again after your step"],
  offering: ["Sacrifice your piece to draw 2 cards from deck"],
  destroy_unshielded: ["Destroy any unshielded enemy", "You cannot cast spells on your next turn"],
  revive: ["Requires a captured friendly piece", "Place on any empty dark square", "Revived piece cannot capture this turn"],
  blink_2: ["Teleport within 2 squares"],
  long_step: ["Leap 2 squares diagonally (no capture)"],
  sidestep: ["Step 1 square horizontally"],
  mine: ["Trap on empty square for 2 turns — destroys lander"],
  detonate: ["Destroy self + adjacent enemies"],
  venom: ["Poison — 2 ticks destroys target"],
  bomb: ["Arm friendly piece", "On next move: explodes", "Kills all adjacent pieces"],
  root_2: ["Enemy cannot jump/capture next turn"],
  silence_3: ["Suppress special movement 3 turns"],
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
