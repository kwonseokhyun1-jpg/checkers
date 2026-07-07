#!/usr/bin/env python3
"""Build cardEffectHandlers.js effect map."""
import os

HANDLERS = r'''
import {
  SIZE, COLORS, isDarkSquare, inBounds, movePiece, removePiece, getPiece,
  getAdjacentEmpty, getTeleportTargets, getBoltTarget, piecesOfColor, enemyPieces,
  createPiece, getAllMovesForColor, applyMove,
} from "./board.js";
import { sk, getSq, handLimit } from "./gameMeta.js";
import { CARD_REGISTRY, drawRandomCard, createCardInstance } from "./cards.js";

const opp = (c) => (c === COLORS.RED ? COLORS.BLACK : COLORS.RED);

function ok(msg = "") { return { success: true, message: msg }; }
function fail(msg) { return { success: false, message: msg }; }

function pieceAt(state, r, c) { return state.board[r]?.[c] ?? null; }
function isBlocked(state, r, c) {
  const key = sk(r, c);
  if (state.meta.collapsed?.has?.(key)) return true;
  const sq = state.squares[key];
  if (sq?.obstacle) return true;
  return false;
}
function canLand(state, r, c) {
  return inBounds(r, c) && isDarkSquare(r, c) && !isBlocked(state, r, c) && !pieceAt(state, r, c);
}

function destroyAt(state, r, c, byColor, effectName = "") {
  const p = pieceAt(state, r, c);
  if (!p) return false;
  if (p.shieldTurns > 0) {
    p.shieldTurns--;
    return false;
  }
  if (p.king && state.meta.constitutionTurns[p.color] > 0 && effectName !== "capture") return false;
  if (p.mirrorShield) {
    p.mirrorShield = false;
    const enemies = enemyPieces(state.board, byColor);
    if (enemies.length) {
      const t = enemies[Math.floor(Math.random() * enemies.length)];
      removePiece(state.board, t.row, t.col);
    }
    return false;
  }
  if (p.lastStand) {
    p.lastStand = false;
    p.lastStandTurns = 0;
    p.shieldTurns = 3;
    return false;
  }
  state.captured[p.color].push({ ...p });
  removePiece(state.board, r, c);
  const g = getSq(state, r, c);
  if (p.ghostGuard) g.ghostBlock = 2;
  return true;
}

function swapPieces(state, r1, c1, r2, c2) {
  const a = pieceAt(state, r1, c1);
  const b = pieceAt(state, r2, c2);
  state.board[r1][c1] = b;
  state.board[r2][c2] = a;
  if (a) { a.row = r2; a.col = c2; }
  if (b) { b.row = r1; b.col = c1; }
}

function pick1(picks) { return picks[0]; }

export function applyEffect(state, color, effect, picks) {
  const handler = EFFECTS[effect];
  if (!handler) return fail("Unknown spell effect.");
  return handler(state, color, picks);
}

export function autoPicks(state, color, card) {
  const gen = AUTO_PICK[card.mode];
  if (!gen) return picksForInstant();
  return gen(state, color, card) || [];
}

function picksForInstant() { return [[]]; }

const EFFECTS = {
'''

# Append effect entries as JS functions - use code generation for each effect type
effects_code = []

def add(name, body):
    effects_code.append(f"  {name}(state, color, picks) {{\n    {body}\n  }},")

add("gems_20", "state.gems[color] += 20; return ok('+20 gems');")
add("gems_5", "state.gems[color] += 5; return ok('Krabby Patty! +5 gems');")
add("draw_1", """
    const h = state.hands[color];
    if (h.length >= handLimit(state, color)) return fail('Hand full');
    h.push(createCardInstance(drawRandomCard()));
    return ok('Drew a card');
""")
add("shield_2", """
    const [r,c] = pick1(picks);
    const p = pieceAt(state,r,c);
    if (!p || p.color !== color) return fail('Invalid target');
    p.shieldTurns = 2; return ok();
""")
add("freeze_1", """
    const [r,c] = pick1(picks);
    const p = pieceAt(state,r,c);
    if (!p || p.color === color) return fail('Invalid target');
    p.frozenTurns = 1; return ok();
""")
add("freeze_2", """
    const [r,c] = pick1(picks);
    const p = pieceAt(state,r,c);
    if (!p || p.color === color) return fail('Invalid target');
    p.frozenTurns = 2; return ok();
""")
add("retreat_3", """
    const [r,c] = pick1(picks);
    const p = pieceAt(state,r,c);
    if (!p || p.color !== color) return fail('Invalid target');
    p.retreatTurns = 3; return ok();
""")
add("knight_perm", """
    const [r,c] = pick1(picks);
    const p = pieceAt(state,r,c);
    if (!p || p.color !== color) return fail('Invalid target');
    p.isKnight = true; return ok();
""")
add("crown", """
    const [r,c] = pick1(picks);
    const p = pieceAt(state,r,c);
    if (!p || p.color !== color) return fail('Invalid target');
    p.king = true; return ok();
""")
add("quick_march", """
    state.meta.pendingDouble[color] = true; return ok();
""")
add("destroy_unshielded", """
    const [r,c] = pick1(picks);
    const p = pieceAt(state,r,c);
    if (!p || p.color === color) return fail('Invalid target');
    if (!destroyAt(state,r,c,color)) return fail('Shielded!');
    return ok();
""")
add("nudge", """
    if (picks.length < 2) return fail('Need piece and destination');
    const [r1,c1] = picks[0], [r2,c2] = picks[1];
    const p = pieceAt(state,r1,c1);
    if (!p || p.color !== color) return fail('Invalid piece');
    if (!canLand(state,r2,c2)) return fail('Invalid square');
    movePiece(state.board,r1,c1,r2,c2);
    state.meta.movementCardPlayed[color] = true;
    return ok();
""")
add("blink_2", """
    if (picks.length < 2) return fail('Need two picks');
    const [r1,c1] = picks[0], [r2,c2] = picks[1];
    const p = pieceAt(state,r1,c1);
    if (!p || p.color !== color) return fail('Invalid piece');
    const dist = Math.max(Math.abs(r2-r1), Math.abs(c2-c1));
    if (dist < 1 || dist > 2 || !canLand(state,r2,c2)) return fail('Invalid destination');
    movePiece(state.board,r1,c1,r2,c2);
    state.meta.movementCardPlayed[color] = true;
    return ok();
""")
add("swap_friendly", """
    if (picks.length < 2) return fail('Need two pieces');
    const [r1,c1] = picks[0], [r2,c2] = picks[1];
    const a = pieceAt(state,r1,c1), b = pieceAt(state,r2,c2);
    if (!a || !b || a.color !== color || b.color !== color) return fail('Invalid');
    swapPieces(state,r1,c1,r2,c2); return ok();
""")
add("forward_bolt", """
    if (picks.length < 1) return fail('Pick your piece');
    const [r,c] = picks[0];
    const p = pieceAt(state,r,c);
    if (!p || p.color !== color) return fail('Invalid piece');
    if (picks.length === 1) return fail('Pick diagonal strike');
    const [tr,tc] = picks[1];
    if (!destroyAt(state,tr,tc,color)) return fail('No valid target');
    return ok();
""")
# ... more effects in full file

HANDLERS_END = r'''
};

export function tryAutoPlay(state, color, card) {
  const sequences = autoPicks(state, color, card);
  for (const picks of sequences) {
    const res = applyEffect(state, color, card.effect, picks);
    if (res.success) return res;
  }
  return fail("Could not play");
}
'''

# For brevity in build script, write minimal and we'll append full EFFECTS via second script
out = HANDLERS + "\n".join(effects_code) + HANDLERS_END
# Fix: HANDLERS has export function applyEffect before EFFECTS const - reorder

print("Partial - use full file write")
