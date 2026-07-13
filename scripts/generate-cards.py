#!/usr/bin/env python3
"""Generate js/cardRegistry.js from spell definitions."""

# (id, name, desc, rarity, weight, mode, effect)
# mode: instant | friendly | enemy | empty | f_empty | f_f | f_e | e_empty | diagonal
SPELLS = [
    # === IN GAME (12) ===
    ("nudge", "Nudge", "Displace one of your pieces 1 square forward-diagonal onto an empty dark square.", "common", 8, "f_empty", "nudge"),
    ("aegis", "Aegis", "Shield a piece — it cannot be captured for 2 turns.", "common", 7, "friendly", "shield_2"),
    ("bolt", "Forward Bolt", "Eliminate the first enemy piece directly ahead along your piece's forward diagonal.", "uncommon", 6, "diagonal", "forward_bolt"),
    ("frost", "Frost Bind", "Freeze an enemy piece — it cannot move on its owner's next turn.", "uncommon", 6, "enemy", "freeze_1"),
    ("retreat", "Retreat", "Grant a piece backward movement for 3 turns.", "uncommon", 6, "friendly", "retreat_3"),    ("crown", "Royal Decree", "Instantly crown one of your pieces (king movement).", "rare", 4, "friendly", "crown"),
    ("swap", "Shadow Swap", "Swap positions of two of your pieces.", "uncommon", 5, "f_f", "swap_friendly"),
    ("double", "Bonus Step", "After your normal move, move the same piece again (non-capture step).", "rare", 3, "instant", "quick_march"),
    ("gem_cache", "Gem Cache", "Gain 20 gems immediately.", "common", 7, "instant", "gems_20"),
    ("shatter", "Shatter", "Destroy any enemy piece on the board (not shielded).", "epic", 2, "enemy", "destroy_unshielded"),
    ("teleport", "Blink", "Teleport your piece to any empty dark square within 2 steps (Chebyshev).", "rare", 4, "f_empty", "blink_2"),
    # === MOVEMENT ===
    ("long_step", "Long Step", "Move one of your pieces 2 squares diagonally if the path is clear (no capture).", "uncommon", 5, "f_empty", "long_step"),
    ("sidestep", "Sidestep", "Skip 2 columns left or right along the same row to an empty dark square.", "common", 6, "f_empty", "sidestep"),
    ("chain_pull", "Chain Pull", "Pull an adjacent enemy piece 1 square toward you into an empty dark square behind it.", "rare", 3, "friendly", "chain_pull"),
    ("repel", "Repel", "Push an adjacent enemy piece 1 square away if the landing square is empty.", "uncommon", 4, "friendly", "repel"),
    ("leapfrog", "Leapfrog", "Jump your piece over a friendly piece to land on the empty square beyond.", "uncommon", 4, "f_empty", "leapfrog"),
    ("phase_walk", "Phase Walk", "Move through one friendly piece to land on the empty square beyond it.", "rare", 3, "f_empty", "phase_walk"),
    ("corner_hop", "Corner Hop", "Teleport to any empty dark square in the opposite corner quadrant of the board.", "rare", 3, "f_empty", "corner_hop"),
    ("backstep", "Backstep", "Move one of your pieces 1 square straight backward onto an empty dark square.", "common", 6, "f_empty", "backstep"),
    ("anchor", "Anchor", "Your piece cannot be moved by enemy cards for 2 turns (still moves on your turn).", "uncommon", 4, "friendly", "anchor_2"),
    ("drift", "Drift", "Slide a piece any number of empty squares along one diagonal until blocked.", "epic", 2, "f_empty", "drift"),
    ("recall", "Recall", "Return one of your pieces to an empty dark square on your back row (only playable when your back row has an empty space).", "uncommon", 4, "f_empty", "recall"),
    ("flank", "Flank", "Move your piece to any empty dark square up to 3 steps away along a diagonal.", "uncommon", 4, "f_empty", "flank_3"),
    ("rooks_mark", "Rook's Mark", "For 2 turns, a piece may slide along a rank or file over empty dark squares.", "uncommon", 4, "friendly", "rook_2"),
    ("bishops_mark", "Bishop's Mark", "For 2 turns, a piece may slide along either diagonal over empty dark squares.", "uncommon", 4, "friendly", "bishop_2"),
    ("pawns_zeal", "Pawn's Zeal", "A non-king takes one extra forward step this turn after your main move.", "common", 4, "friendly", "pawn_zeal"),
    ("overrun", "Overrun", "After a capture this turn, slide 1 more square forward along the same diagonal if empty.", "uncommon", 4, "instant", "overrun"),
    # === CAPTURE ===
    ("cross_bolt", "Cross Bolt", "Destroy the first enemy on both forward diagonals from your piece (if any).", "rare", 3, "friendly", "cross_bolt"),
    ("snipe", "Snipe", "Destroy an enemy exactly 2 squares away on a diagonal with nothing between.", "uncommon", 4, "enemy", "snipe"),
    ("mine", "Mine", "Place a trap on an empty dark square; next enemy to land there is destroyed.", "uncommon", 5, "empty", "mine"),
    ("detonate", "Detonate", "Destroy your own piece to also destroy all adjacent enemies (not shielded).", "rare", 3, "friendly", "detonate"),
    ("ricochet", "Ricochet", "Arm your next capture to also remove an enemy 2 squares behind the captured piece.", "rare", 3, "instant", "ricochet"),
    ("duel", "Duel", "Choose your piece and an adjacent enemy; both are destroyed unless shielded. If the enemy is frozen or paralyzed, your piece survives.", "uncommon", 4, "f_e_adj", "duel"),
    ("execution", "Execution", "Destroy an enemy piece that has no legal moves.", "rare", 3, "enemy", "execution"),
    ("cull", "Cull", "Destroy the weakest enemy (non-king preferred, fewest escape squares).", "rare", 3, "instant", "cull"),
    ("venom", "Venom", "Enemy takes 1 damage; 2 damage destroys it (shield blocks 1 tick).", "common", 5, "enemy", "venom"),
    ("gravity_well", "Gravity Well", "Pull all enemies adjacent to a square 1 step toward that square.", "rare", 3, "empty", "gravity_well"),
    ("spear_thrust", "Spear Thrust", "Destroy the first enemy along a rank or file from your piece.", "uncommon", 4, "f_empty", "spear_thrust"),
    ("backstab", "Backstab", "Destroy an enemy behind your piece on a backward diagonal if adjacent.", "uncommon", 4, "friendly", "backstab"),
    ("sacrifice", "Sacrifice", "Destroy one of your men to destroy any enemy man (not kings).", "uncommon", 4, "f_e", "sacrifice"),
    # === DEFENSE ===
    ("bulwark", "Bulwark", "All your pieces on one diagonal line gain shield for 2 turns.", "rare", 3, "friendly", "bulwark"),
    ("mirror_shield", "Mirror Shield", "Next enemy spell on this piece reflects to a random enemy.", "epic", 2, "friendly", "mirror_shield"),
    ("phalanx", "Phalanx", "Two adjacent friendly pieces share protection — both must be jumped together.", "rare", 3, "f_f_adj", "phalanx"),
    ("sanctuary", "Sanctuary", "Friendly pieces on the target dark square and its 6 surrounding dark squares cannot be captured for 1 turn.", "rare", 3, "empty", "sanctuary"),
    ("last_stand", "Last Stand", "Hidden trap on a friendly piece — if it would be captured or destroyed, it survives with an ultra shield for 3 turns instead (invisible until it triggers; expires after 1 of your turn cycles if unused).", "rare", 3, "friendly", "last_stand"),
    ("decoy", "Decoy", "Place a decoy on an empty dark square; blocks one enemy move then vanishes.", "common", 5, "empty", "decoy"),
    ("iron_will", "Iron Will", "A frozen or paralyzed friendly piece may move once (consumes debuff).", "common", 5, "friendly", "iron_will"),
    ("revive", "Revive", "Return a captured man to any empty dark square on your side of the board.", "epic", 2, "empty", "revive"),
    ("ghost_guard", "Ghost Guard", "When a friendly piece is captured, its square blocks enemies for 2 turns.", "rare", 3, "friendly", "ghost_guard"),
    ("fortify", "Fortify", "Piece is immobile and invulnerable for 2 turns, then gains shield for 1 turn.", "rare", 3, "friendly", "fortify"),
    # === CROWD CONTROL ===
    ("deep_freeze", "Deep Freeze", "Freeze every enemy on one diagonal through your piece for 2 turns.", "uncommon", 4, "diagonal", "deep_freeze"),
    ("root", "Root", "Enemy cannot jump or capture for 2 turns (can still step).", "uncommon", 4, "enemy", "root_2"),
    ("slow", "Slow", "Enemy kings move like men for 2 turns.", "uncommon", 4, "enemy", "slow_2"),
    ("blind", "Blind", "Opponent cannot play cards on their next turn.", "rare", 3, "instant", "blind"),
    ("confusion", "Confusion", "On opponent's next turn, their move is chosen randomly.", "epic", 2, "instant", "confusion"),
    ("silence", "Silence", "Suppress knight/retreat/bishop/rook movement on an enemy for 3 turns.", "uncommon", 4, "enemy", "silence_3"),
    ("tangle", "Tangle", "Swap two enemies and freeze both for 1 turn.", "rare", 3, "e_e", "tangle"),
    ("panic", "Panic", "Force an enemy man to step backward on its owner's next turn if possible.", "uncommon", 4, "enemy", "panic"),
    ("bribery", "Bribery", "Steal up to 15 gems from opponent.", "uncommon", 4, "instant", "bribery_15"),
    # === TRANSFORMATION ===
    ("bishops_sigil", "Bishop's Sigil", "Piece slides diagonally any distance over empties for 3 turns.", "rare", 3, "friendly", "bishop_3"),
    ("rooks_sigil", "Rook's Sigil", "Piece slides along rank/file over empties for 3 turns.", "rare", 3, "friendly", "rook_3"),    ("demote", "Demote", "Turn an enemy king back into a man.", "epic", 2, "enemy", "demote"),
    ("twin_soul", "Twin Soul", "Split a man into two tokens on adjacent squares; linked fate.", "epic", 2, "friendly", "twin_soul"),
    ("fusion", "Fusion", "Merge two adjacent friendly men into one piece with the Awoken Bear mark — after each move with it, move again.", "rare", 3, "f_f_adj", "fusion"),
    ("chameleon", "Chameleon", "Copy any piece's movement tags on the board for 2 turns.", "rare", 3, "any_piece", "chameleon"),
    ("wraith_form", "Wraith Form", "Piece passes through enemies for 2 turns (no capture while passing).", "rare", 3, "friendly", "wraith_2"),
    # === BOARD ===
    ("obstacle", "Obstacle", "Mark a light square as permanently impassable.", "uncommon", 4, "any_square", "obstacle"),
    ("quicksand", "Quicksand", "Hidden trap on an empty dark square — the next piece to end a turn there is frozen (invisible until it triggers).", "common", 6, "empty", "quicksand"),
    ("sanctified_tile", "Sanctified Tile", "Friendly pieces entering this dark square are crowned.", "rare", 3, "empty", "sanctified"),
    ("warp_gate", "Warp Gate", "Link two empty dark squares for instant travel between them.", "rare", 3, "empty_empty", "warp_gate"),
    ("collapse", "Collapse", "Remove a dark square from play for 3 turns (only one collapsed square at a time); piece on it relocates.", "common", 6, "empty", "collapse"),
    ("mirror_board", "Mirror Board", "Confuse the AI's targeting for its next turn.", "common", 5, "instant", "mirror_board"),
    ("darkness", "Darkness", "Pieces on the 6 dark squares around a point cannot be captured, cannot capture, and cannot be targeted or destroyed for 2 turns.", "rare", 3, "empty", "darkness"),
    ("highlight_path", "Highlight Path", "Reduce AI strength slightly for 2 turns (reveals intent).", "common", 5, "instant", "highlight_path"),
    ("earthquake", "Earthquake", "All pieces shift 1 square toward board center if possible.", "epic", 2, "instant", "earthquake"),
    # === ECONOMY ===
    ("prospect", "Prospect", "Gain 10 gems now and 10 more at the start of your next turn.", "common", 6, "instant", "prospect"),
    ("tax", "Tax", "Opponent loses 10 gems; you gain 5.", "uncommon", 4, "instant", "tax"),
    ("gamble", "Gamble", "Pay 15 gems; draw 2 cards.", "uncommon", 4, "instant", "gamble"),
    ("haggle", "Haggle", "Your next card draw costs 5 gems instead of 10.", "common", 5, "instant", "haggle"),
    ("recycle", "Recycle", "Discard 1 card from hand, draw 2 cards.", "common", 5, "discard_pick", "recycle"),
    ("scout", "Scout", "Look at 3 random cards from the pool; add one to your hand.", "uncommon", 4, "instant", "scout"),
    ("forge", "Forge", "Discard 2 cards to add a random rare or epic to your hand.", "rare", 3, "instant", "forge"),
    ("heist", "Heist", "Steal a random card from opponent's hand.", "rare", 3, "instant", "heist"),
    ("donate", "Donate", "Give opponent 20 gems; you draw 2 cards.", "common", 5, "instant", "donate"),
    ("interest", "Interest", "Gain gems equal to half your total (max 25).", "uncommon", 4, "instant", "interest"),
    ("bankrupt", "Bankrupt", "Both players lose half their gems.", "rare", 3, "instant", "bankrupt"),
    ("coupon", "Coupon", "Your next card draw is free.", "common", 5, "instant", "coupon"),
    ("hand_expand", "Hand Expand", "Your hand limit becomes 8 for the rest of the game.", "rare", 3, "instant", "hand_expand"),
    ("mulligan", "Mulligan", "Discard your hand, then draw that many cards; you may cast another spell this turn.", "rare", 3, "instant", "mulligan"),
    # === SWAPS / TRICKS ===
    ("hostile_swap", "Hostile Swap", "Swap one of your pieces with an unshielded enemy within 3 squares (Chebyshev).", "epic", 2, "f_e", "hostile_swap"),
    ("identity_theft", "Identity Theft", "Your piece copies an enemy's movement tags for 3 turns.", "rare", 3, "f_e", "identity_theft"),
    ("bait_switch", "Bait and Switch", "Swap an enemy with an empty square up to 2 steps away.", "rare", 3, "e_empty", "bait_switch"),
    ("mirror_move", "Mirror Move", "After opponent moves, copy their move pattern with your piece if legal.", "rare", 3, "instant", "mirror_move"),
    ("parallel", "Parallel", "Play one additional card this turn.", "rare", 3, "instant", "parallel"),
    ("counterspell", "Counterspell", "Set a hidden trap: the next enemy spell is auto-cancelled when they cast it.", "uncommon", 5, "instant", "counterspell"),
    ("echo", "Echo", "Repeat the last card you played.", "rare", 3, "instant", "echo"),
    ("roulette", "Roulette", "Random card effect hits a random valid target.", "epic", 2, "instant", "roulette"),
    # === MULTI ===
    ("blizzard", "Blizzard", "Freeze up to 3 enemy men along a diagonal line you choose.", "rare", 3, "friendly", "blizzard"),
    ("fireline", "Fireline", "Forward Bolt hits every enemy along one forward diagonal.", "rare", 3, "friendly", "fireline"),
    ("sanctuary_pulse", "Sanctuary Pulse", "Shield all your pieces in your back row for 1 turn.", "uncommon", 4, "instant", "sanctuary_pulse"),
    ("mass_nudge", "Mass Nudge", "Move up to 2 friendly pieces 1 square each (adjacent empty).", "uncommon", 4, "instant", "mass_nudge"),
    ("chain_lightning", "Chain Lightning", "Destroy first enemy in a line; chains up to 3 times.", "epic", 2, "friendly", "chain_lightning"),
    ("vacuum", "Vacuum", "Pull all pieces 1 step toward a chosen empty dark square.", "rare", 3, "empty", "vacuum"),
    ("scatter", "Scatter", "Push every piece adjacent to a square 1 step away radially.", "rare", 3, "empty", "scatter"),
    ("dominion", "Dominion", "All your men may move backward for 2 turns.", "uncommon", 4, "instant", "dominion"),
    ("rally", "Rally", "All pieces adjacent to a friendly piece gain retreat for 1 turn.", "uncommon", 4, "friendly", "rally"),
    # === KINGS ===
    ("coronation_day", "Coronation Day", "All your men on the promotion row become kings.", "epic", 2, "instant", "coronation_day"),
    ("exile_king", "Exile King", "Teleport enemy king to a random empty square on their back row.", "epic", 2, "enemy", "exile_king"),
    ("regicide", "Regicide", "If you capture a king this turn, gain 30 gems.", "rare", 3, "instant", "regicide"),
    ("constitution", "Constitution", "Requires a king. Your kings cannot be destroyed by non-capture effects for 5 turns.", "epic", 2, "instant", "constitution"),
    ("last_king", "Last King", "If you have only 1 piece, it becomes a king with shield for 2 turns.", "epic", 2, "instant", "last_king"),
    ("succession", "Succession", "When your king is captured, a chosen man becomes king instantly.", "rare", 3, "friendly", "succession"),
    # === CHAOS ===
    ("wild_magic", "Wild Magic", "Apply a random card effect from the entire pool.", "epic", 2, "instant", "wild_magic"),
    ("coin_flip", "Coin Flip", "50% destroy random enemy; 50% destroy random friendly.", "rare", 3, "instant", "coin_flip"),
    ("rules_lawyer", "Rules Lawyer", "Jumps are optional for you this turn (not mandatory).", "uncommon", 4, "instant", "rules_lawyer"),
    ("pocket_dimension", "Pocket Dimension", "Remove a friendly piece for 1 turn; it returns to the same square.", "rare", 3, "friendly", "pocket"),
    ("uno_reverse", "Uno Reverse", "Opponent must capture with a specific piece if possible next turn.", "rare", 3, "enemy", "uno_reverse"),
    ("krabby_patty", "Krabby Patty", "Gain 5 gems. Delicious.", "common", 6, "instant", "gems_5"),
    ("loading", "Loading…", "Draw 1 card.", "common", 6, "instant", "draw_1"),
    # === SYNERGY ===
    ("conduct", "Conduct", "If you played a movement card this turn, your checker step may be 2 squares.", "uncommon", 4, "instant", "conduct"),
    ("cryo_bolt", "Cryo Bolt", "Bolt along your diagonal: freezes a normal enemy, or destroys a frozen or paralyzed one (breaks shield).", "uncommon", 3, "diagonal", "cryo_bolt"),    ("shield_bash", "Shield Bash", "A shielded piece moves 1 square and destroys adjacent unshielded enemy.", "uncommon", 4, "friendly", "shield_bash"),]

def js_str(s):
    return s.replace("\\", "\\\\").replace('"', '\\"')

lines = [
    "/** Auto-generated card registry — do not edit by hand; run scripts/generate-cards.py */",
    "",
    "export const CARD_PLAY_MODES = {",
    '  INSTANT: "instant",',
    '  FRIENDLY: "friendly",',
    '  ENEMY: "enemy",',
    '  EMPTY: "empty",',
    '  F_EMPTY: "f_empty",',
    '  F_F: "f_f",',
    '  F_E: "f_e",',
    '  F_E_ADJ: "f_e_adj",',
    '  E_EMPTY: "e_empty",',
    '  E_E_ADJ: "e_e_adj",',
    '  F_F_ADJ: "f_f_adj",',
    '  DIAGONAL: "diagonal",',
    '  ANY_PIECE: "any_piece",',
    '  ANY_SQUARE: "any_square",',
    '  EMPTY_EMPTY: "empty_empty",',
    '  DISCARD_PICK: "discard_pick",',
    "};",
    "",
    "export const CARD_REGISTRY = [",
]
for s in SPELLS:
    id_, name, desc, rarity, weight, mode, effect = s
    lines.append(
        f'  {{ id: "{id_}", name: "{js_str(name)}", desc: "{js_str(desc)}", '
        f'rarity: "{rarity}", weight: {weight}, mode: "{mode}", effect: "{effect}" }},'
    )
lines.append("];")
lines.append("")
lines.append("export const CARD_IDS = Object.fromEntries(CARD_REGISTRY.map((c) => [c.id.toUpperCase().replace(/[^A-Z0-9]/g, '_'), c.id]));")
lines.append("")
lines.append("export const CARDS = Object.fromEntries(CARD_REGISTRY.map((c) => [c.id, c]));")

out = "/workspace/js/cardRegistry.js"
with open(out, "w") as f:
    f.write("\n".join(lines) + "\n")
print(f"Wrote {len(SPELLS)} cards to {out}")
