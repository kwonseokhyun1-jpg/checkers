#!/usr/bin/env node
/**
 * Exercise every playable spell against many board setups.
 * Run: node scripts/test-all-spells.mjs
 */
import { readFileSync } from "fs";
import { getPlayableCards } from "../js/cardCatalog.js";
import { getValidTargets, tryAutoPlay } from "../js/cardEffects.js";
import { applyCard } from "../js/cardEffectHandlers.js";
import { createMatchState } from "../js/match.js";
import {
  COLORS,
  createPiece,
  setPiece,
  isDarkSquare,
  SIZE,
  getBackstepTarget,
  getJumpMoves,
  applyFreezeToPiece,
  applyVenomToPiece,
  applyBurnToPiece,
} from "../js/board.js";
import { createMatchMeta, tryConsumeCounterspell, tryConsumeVengeance } from "../js/gameMeta.js";
import { initCardState } from "../js/cardEffects.js";

const handlerKeys = new Set(
  [...readFileSync(new URL("../js/cardEffectHandlers.js", import.meta.url), "utf8").matchAll(
    /^\s{2}([a-z0-9_]+)\(state,/gm
  )].map((m) => m[1])
);

const COLOR = COLORS.RED;
const OPP = COLORS.BLACK;

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function baseState() {
  const state = {
    board: Array.from({ length: SIZE }, () => Array(SIZE).fill(null)),
    hands: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    turn: COLOR,
    meta: createMatchMeta(),
    squares: {},
    captured: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    gems: { [COLORS.RED]: 0, [COLORS.BLACK]: 0 },
    turnNumber: { [COLORS.RED]: 0, [COLORS.BLACK]: 0 },
  };
  initCardState(state);
  return state;
}

function place(state, color, row, col, king = false) {
  setPiece(state.board, row, col, createPiece(color, row, col, king));
}

const DARK = [];
for (let r = 0; r < SIZE; r++) {
  for (let c = 0; c < SIZE; c++) {
    if (isDarkSquare(r, c)) DARK.push([r, c]);
  }
}

function at(state, r, c) {
  return state.board[r]?.[c] ?? null;
}

function emptyDark(state, r, c) {
  return isDarkSquare(r, c) && !at(state, r, c);
}

function boardSetups(randomCount = 50) {
  const setups = [
    () => createMatchState(Array(30).fill("nudge")),
    () => { const s = baseState(); place(s, COLOR, 5, 1); return s; },
    () => { const s = baseState(); place(s, COLOR, 5, 0); place(s, COLOR, 4, 1); return s; },
    () => { const s = baseState(); place(s, COLOR, 5, 0); place(s, OPP, 6, 1); return s; },
    () => { const s = baseState(); place(s, COLOR, 5, 0); place(s, OPP, 3, 0); return s; },
    () => { const s = baseState(); place(s, COLOR, 4, 1); place(s, OPP, 3, 2); return s; },
    () => { const s = baseState(); for (const [r, c] of DARK.filter(([row, col]) => col === 0 && row <= 5)) place(s, OPP, r, c); return s; },
    () => { const s = baseState(); place(s, COLOR, 5, 0); place(s, OPP, 3, 2); return s; },
    () => { const s = baseState(); const only = DARK.find(([r]) => r === 5); place(s, COLOR, only[0], only[1]); return s; },
    () => { const s = baseState(); s.captured[COLOR] = [{ color: COLOR, row: 0, col: 1, king: false, id: "c1" }]; return s; },
    () => { const s = baseState(); place(s, COLOR, 5, 0); place(s, OPP, 2, 1, true); return s; },
    () => {
      const s = baseState();
      const e = createPiece(OPP, 0, 1);
      setPiece(s.board, 3, 2, e);
      return s;
    },
    () => {
      const s = baseState();
      const e = createPiece(OPP, 2, 1);
      setPiece(s.board, 4, 3, e);
      place(s, OPP, 0, 1);
      return s;
    },
  ];
  for (let i = 0; i < randomCount; i++) {
    setups.push(() => {
      const s = baseState();
      const shuffled = [...DARK].sort(() => Math.random() - 0.5);
      let red = 0, black = 0;
      for (const [r, c] of shuffled) {
        if (r >= 5 && red < 5 && Math.random() < 0.55) { place(s, COLOR, r, c, Math.random() < 0.15); red++; }
        else if (r <= 2 && black < 5 && Math.random() < 0.55) { place(s, OPP, r, c, Math.random() < 0.15); black++; }
      }
      if (Math.random() < 0.25) s.captured[COLOR].push({ color: COLOR, row: 0, col: 1, king: false, id: `cap${i}` });
      return s;
    });
  }
  return setups;
}

function leapfrogDestinations(state, color) {
  const out = [];
  for (const [r, c] of DARK) {
    const p = at(state, r, c);
    if (!p || p.color !== color) continue;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue;
        const mid = at(state, p.row + dr, p.col + dc);
        const tr = p.row + dr * 2, tc = p.col + dc * 2;
        if (mid?.color === color && emptyDark(state, tr, tc)) out.push([[p.row, p.col], [tr, tc]]);
      }
    }
  }
  return out;
}

function specialPickCombos(state, card, limit = 64) {
  if (card.id === "leapfrog") return leapfrogDestinations(state, COLOR).slice(0, limit);
  if (card.id === "backstep") {
    const combos = [];
    for (const [r, c] of DARK) {
      const p = at(state, r, c);
      if (!p || p.color !== COLOR) continue;
      for (const dest of getBackstepTarget(state.board, p, state)) combos.push([[r, c], dest]);
    }
    return combos.slice(0, limit);
  }
  if (card.id === "fusion") {
    const combos = [];
    for (const [r, c] of DARK) {
      const p = at(state, r, c);
      if (!p || p.color !== COLOR || p.king) continue;
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue;
        const nr = r + dr, nc = c + dc;
        const q = at(state, nr, nc);
        if (q && q.color === COLOR && !q.king) combos.push([[r, c], [nr, nc]]);
      }
    }
    return combos.slice(0, limit);
  }
  return null;
}

function uiPickCombos(state, card, limit = 64) {
  const combos = [];
  const t0 = getValidTargets(state, COLOR, card, []);
  if (card.mode === "instant" || card.mode === "discard_pick") return [[]];
  if (card.effect === "snowball") {
    for (const p of t0.slice(0, limit)) combos.push([p]);
    return combos;
  }
  if (["friendly", "enemy", "empty", "any_square", "column", "row"].includes(card.mode)) {
    for (const p of t0.slice(0, limit)) combos.push([p]);
    return combos;
  }
  if (["f_f", "e_e_adj", "f_f_adj"].includes(card.mode)) {
    let n = 0;
    for (const a of t0) for (const b of getValidTargets(state, COLOR, card, [a])) { combos.push([a, b]); if (++n >= limit) return combos; }
    return combos;
  }
  let n = 0;
  for (const a of t0) for (const b of getValidTargets(state, COLOR, card, [a])) { combos.push([a, b]); if (++n >= limit) return combos; }
  return combos;
}

function attemptCast(state, card, uiOnly = false) {
  if (!uiOnly && tryAutoPlay(state, COLOR, card).success) return { ok: true, via: "tryAutoPlay" };
  const combos = uiOnly ? uiPickCombos(state, card, 80) : specialPickCombos(state, card, 80) ?? uiPickCombos(state, card, 80);
  for (const picks of combos) {
    const trial = deepClone(state);
    try { if (applyCard(trial, COLOR, card, picks).success) return { ok: true, via: "manual" }; }
    catch (e) { return { ok: false, throw: e.message }; }
  }
  return { ok: false };
}

const cards = getPlayableCards();
const setups = boardSetups(50);
const rows = [];

for (const card of cards) {
  const row = { id: card.id, name: card.name, mode: card.mode, status: "pass", notes: [] };
  if (!handlerKeys.has(card.effect)) { row.status = "error"; row.notes.push("Missing effect handler"); rows.push(row); continue; }

  let cast = null, thrown = null;
  for (const mk of setups) {
    try {
      const r = attemptCast(mk(), card, false);
      if (r.ok) { cast = r; break; }
      if (r.throw) { thrown = r.throw; break; }
    } catch (e) { thrown = e.message; break; }
  }
  if (thrown) { row.status = "error"; row.notes.push(`Runtime throw: ${thrown}`); rows.push(row); continue; }
  if (!cast) { row.status = "error"; row.notes.push("Handler never succeeded on any tested board"); rows.push(row); continue; }

  if (!setups.some((mk) => attemptCast(mk(), card, true).ok)) {
    row.status = "warn";
    row.notes.push("Works with correct picks but UI/AI targeting cannot find a valid play");
  }
  if (card.mode === "column" || card.mode === "row" || card.mode === "f_e_adj") {
    const autoWorks = setups.some((mk) => { try { return tryAutoPlay(mk(), card).success; } catch { return false; } });
    if (!autoWorks) row.notes.push(`tryAutoPlay omits ${card.mode} targeting`);
  }
  rows.push(row);
}




// Trickster excludes back-rank pieces
{
  const s = baseState();
  place(s, COLOR, 7, 1);
  place(s, COLOR, 5, 3);
  place(s, OPP, 0, 2);
  place(s, OPP, 2, 4);
  const plan = (await import("../js/cardEffectHandlers.js")).planTrickster(s);
  if (!plan) throw new Error("Trickster plan failed");
  if (plan.from.some(([r]) => r === 7 || r === 0)) throw new Error("Trickster must not pick back-rank pieces");
  console.log("Trickster back rank test: OK");
}

// Revive cannot place on your back rank
{
  const revive = cards.find((c) => c.id === "revive");
  const s = baseState();
  s.captured[COLOR] = [{ king: false }];
  const targets = getValidTargets(s, COLOR, revive, []);
  if (targets.some(([r]) => r === SIZE - 1)) throw new Error("Revive must not target red back rank");
  const backRankDark = DARK.find(([r]) => r === SIZE - 1);
  if (backRankDark) {
    const failRes = applyCard(s, COLOR, revive, [backRankDark]);
    if (failRes.success) throw new Error("Revive should fail on back rank");
  }
  const safe = targets[0];
  if (!safe) throw new Error("Revive needs at least one valid square");
  const okRes = applyCard(s, COLOR, revive, [safe]);
  if (!okRes.success || !at(s, safe[0], safe[1])) throw new Error("Revive should succeed off back rank");
  console.log("Revive back rank test: OK");
}

// Clone spawn pick
{
  const s = baseState();
  place(s, COLOR, 5, 2);
  const clone = cards.find((c) => c.id === "clone");
  const res = applyCard(s, COLOR, clone, [[5, 2], [4, 3]]);
  if (!res.success || !at(s, 4, 3) || !at(s, 5, 2)) throw new Error("Clone spawn pick failed");
  const copy = at(s, 4, 3);
  if (!copy.isClone || !copy.cloneNoCaptureThisTurn) throw new Error("Clone copy should be marked as clone");
  console.log("Clone spawn test: OK");
}

// Clone cannot capture the turn it spawns
{
  const s = baseState();
  const copy = createPiece(COLOR, 5, 2, false);
  copy.isClone = true;
  copy.cloneNoCaptureThisTurn = true;
  setPiece(s.board, 5, 2, copy);
  place(s, OPP, 4, 3);
  const jumps = getJumpMoves(s.board, copy, COLOR, s);
  if (jumps.length) throw new Error("Clone should not be able to capture on spawn turn");
  console.log("Clone no-capture turn test: OK");
}

// Clone dies instantly to freeze / poison / burn
{
  const s = baseState();
  const copy = createPiece(OPP, 3, 2, false);
  copy.isClone = true;
  setPiece(s.board, 3, 2, copy);
  if (!applyFreezeToPiece(s.board, s, 3, 2, 1) || at(s, 3, 2)) throw new Error("Freeze should destroy clone");
  const copy2 = createPiece(OPP, 3, 4, false);
  copy2.isClone = true;
  setPiece(s.board, 3, 4, copy2);
  if (!applyVenomToPiece(s.board, s, 3, 4, 6) || at(s, 3, 4)) throw new Error("Poison should destroy clone");
  const copy3 = createPiece(OPP, 4, 1, false);
  copy3.isClone = true;
  setPiece(s.board, 4, 1, copy3);
  if (!applyBurnToPiece(s.board, s, 4, 1, 2) || at(s, 4, 1)) throw new Error("Burn should destroy clone");
  console.log("Clone debuff fragility test: OK");
}

// Pyromancy — burn enemy + tile
{
  const s = baseState();
  place(s, OPP, 3, 2);
  const pyro = cards.find((c) => c.id === "pyromancy");
  const res = applyCard(s, COLOR, pyro, [
    [3, 2],
    [4, 3],
  ]);
  if (!res.success) throw new Error("Pyromancy failed: " + res.message);
  const enemy = at(s, 3, 2);
  if (!enemy || enemy.blazeTurns !== 2) throw new Error("Pyromancy should set blazeTurns=2 on enemy");
  const sq = s.squares["3,3"] || s.squares["4,3"];
  const key = Object.keys(s.squares).find((k) => s.squares[k]?.fireTurns === 2);
  if (!key) throw new Error("Pyromancy should ignite empty dark tile");
  console.log("Pyromancy test: OK");
}

// Fusion behavior check
{
  const s = baseState();
  place(s, COLOR, 5, 0);
  place(s, COLOR, 4, 1);
  const fusionCard = cards.find((c) => c.id === "fusion");
  const res = applyCard(s, COLOR, fusionCard, [[5, 0], [4, 1]]);
  if (!res.success) throw new Error("Fusion manual test failed: " + res.message);
  const survivor = at(s, 5, 0);
  if (!survivor || !survivor.bearAwakened) throw new Error("Fusion should grant bearAwakened on survivor");
  if (survivor.superMan) throw new Error("Fusion should not use superMan leap");
  if (at(s, 4, 1)) throw new Error("Fusion should remove second piece");
  console.log("Fusion test: OK (bearAwakened, second piece removed)");
}

// Counterspell trap
{
  const s = baseState();
  s.meta.counterspell[COLOR] = true;
  const trapped = tryConsumeCounterspell(s, OPP);
  if (!trapped || trapped.trapOwner !== COLOR) throw new Error("Counterspell should trigger for opponent cast");
  if (s.meta.counterspell[COLOR]) throw new Error("Counterspell trap should be consumed");
  console.log("Counterspell test: OK");
}

// Vengeance trap
{
  const s = baseState();
  s.meta.vengeance[COLOR] = true;
  const trapped = tryConsumeVengeance(s, OPP, COLOR);
  if (!trapped || trapped.trapOwner !== COLOR) throw new Error("Vengeance should trigger when enemy captures your piece");
  if (s.meta.vengeance[COLOR]) throw new Error("Vengeance trap should be consumed");
  const s2 = baseState();
  s2.meta.vengeance[COLOR] = true;
  if (tryConsumeVengeance(s2, COLOR, COLOR)) throw new Error("Vengeance should not trigger on friendly capture");
  console.log("Vengeance test: OK");
}

// Backstep UI targeting check
{
  const s = baseState();
  place(s, COLOR, 5, 0);
  const backstep = cards.find((c) => c.id === "backstep");
  const t0 = getValidTargets(s, COLOR, backstep, []);
  if (!t0.some(([r, c]) => r === 5 && c === 0)) throw new Error("Backstep should highlight piece with valid backstep");
  const s2 = baseState();
  place(s2, COLOR, 7, 0);
  const t0b = getValidTargets(s2, COLOR, backstep, []);
  if (t0b.some(([r, c]) => r === 7 && c === 0)) throw new Error("Backstep should not highlight piece with no backstep dest");
  console.log("Backstep UI targeting test: OK");
}

const summary = { total: rows.length, pass: rows.filter((r) => r.status === "pass").length, warn: rows.filter((r) => r.status === "warn").length, error: rows.filter((r) => r.status === "error").length };
console.log(JSON.stringify({ summary, warnings: rows.filter((r) => r.status === "warn"), errors: rows.filter((r) => r.status === "error") }, null, 2));
if (summary.error > 0) process.exitCode = 1;
