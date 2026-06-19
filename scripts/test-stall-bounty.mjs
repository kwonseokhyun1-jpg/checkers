#!/usr/bin/env node
import { createMatchState } from "../js/match.js";
import { applyEffect } from "../js/cardEffectHandlers.js";
import {
  COLORS,
  createPiece,
  setPiece,
  resolveCapture,
  applyFreezeToPiece,
  applyVenomToPiece,
  tickEffects,
  getJumpMoves,
} from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { initCardState } from "../js/cardEffects.js";

function baseState() {
  const state = createMatchState(Array(20).fill("nudge"));
  initCardState(state);
  return state;
}

let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (cond) {
    passed++;
    console.log(`  ✓ ${msg}`);
  } else {
    failed++;
    console.error(`  ✗ ${msg}`);
  }
}

console.log("Stall / Fortify invulnerability");
{
  const state = baseState();
  const red = createPiece(COLORS.RED, 4, 3);
  setPiece(state.board, 4, 3, red);
  applyEffect(state, COLORS.RED, "fortify", [[4, 3]]);
  assert(red.fortifyTurns === 2, "fortify sets 2 turns");

  assert(!resolveCapture(state.board, state, 4, 3, COLORS.BLACK, { nonCap: true }), "spell kill blocked");
  assert(state.board[4][3] === red, "piece survives spell kill");

  assert(!applyFreezeToPiece(state.board, state, 4, 3, 2), "freeze blocked");
  assert(red.frozenTurns === 0, "no freeze applied");

  assert(!applyVenomToPiece(state.board, state, 4, 3, 3), "poison blocked");
  assert(red.venom === 0, "no poison applied");

  const bounty = applyEffect(state, COLORS.BLACK, "bounty", [[4, 3]]);
  assert(!bounty.success, "bounty mark blocked on fortified piece");
  assert(!red.bountyBy, "no bounty mark while fortified");

  tickEffects(state.board, COLORS.RED, state);
  tickEffects(state.board, COLORS.RED, state);
  assert(red.fortifyTurns === 0, "fortify expired");
  assert(red.shieldTurns >= 1, "gains shield after fortify ends");
}

console.log("\nBounty mark");
{
  const state = baseState();
  const red = createPiece(COLORS.RED, 4, 3);
  setPiece(state.board, 4, 3, red);
  const res = applyEffect(state, COLORS.BLACK, "bounty", [[4, 3]]);
  assert(res.success, "enemy can mark player piece");
  assert(red.bountyBy === COLORS.BLACK, "bountyBy stores caster color");
}

console.log("\nFortify blocks jump capture");
{
  const state = baseState();
  const red = createPiece(COLORS.RED, 4, 1, true);
  red.fortifyTurns = 2;
  const black = createPiece(COLORS.BLACK, 3, 2);
  setPiece(state.board, 4, 1, red);
  setPiece(state.board, 3, 2, black);
  const jumps = getJumpMoves(state.board, black, state);
  const canCaptureRed = jumps.some((m) => m.captures?.some(([r, c]) => r === 4 && c === 1));
  assert(!canCaptureRed, "fortified piece not a jump-capture target");
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
