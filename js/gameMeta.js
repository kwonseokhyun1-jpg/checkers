/** Global match state: gems modifiers, square terrain, turn flags */

import { COLORS, SIZE, inBounds, isDarkSquare } from "./board.js";
import { drawToHand } from "./deckPile.js";

export function createMatchMeta() {
  return {
    handMax: { [COLORS.RED]: 6, [COLORS.BLACK]: 6 },
    drawDiscount: { [COLORS.RED]: 0, [COLORS.BLACK]: 0 },
    freeDraw: { [COLORS.RED]: false, [COLORS.BLACK]: false },
    optionalJumps: { [COLORS.RED]: false, [COLORS.BLACK]: false },
    cardsLeft: { [COLORS.RED]: 1, [COLORS.BLACK]: 1 },
    movementCardPlayed: { [COLORS.RED]: false, [COLORS.BLACK]: false },
    pendingDouble: { [COLORS.RED]: false, [COLORS.BLACK]: false },
    pendingRicochet: { [COLORS.RED]: false, [COLORS.BLACK]: false },
    pendingRegicide: { [COLORS.RED]: false, [COLORS.BLACK]: false },
    pendingConduct: { [COLORS.RED]: false, [COLORS.BLACK]: false },
    counterspell: { [COLORS.RED]: false, [COLORS.BLACK]: false },
    vengeance: { [COLORS.RED]: false, [COLORS.BLACK]: false },
    blindNext: { [COLORS.RED]: false, [COLORS.BLACK]: false },
    blinded: { [COLORS.RED]: false, [COLORS.BLACK]: false },
    confuseNext: { [COLORS.RED]: false, [COLORS.BLACK]: false },
    shatterSilenceNext: { [COLORS.RED]: false, [COLORS.BLACK]: false },
    shatterSilenced: { [COLORS.RED]: false, [COLORS.BLACK]: false },
    mirrorBoardTurns: { [COLORS.RED]: 0, [COLORS.BLACK]: 0 },
    highlightTurns: { [COLORS.RED]: 0, [COLORS.BLACK]: 0 },
    dominionTurn: { [COLORS.RED]: false, [COLORS.BLACK]: false },
    prospectPending: { [COLORS.RED]: 0, [COLORS.BLACK]: 0 },
    constitutionTurns: { [COLORS.RED]: 0, [COLORS.BLACK]: 0 },
    forcedCapturePieceId: null,
    lastCard: { [COLORS.RED]: null, [COLORS.BLACK]: null },
    lastMove: { [COLORS.RED]: null, [COLORS.BLACK]: null },
    timeSlipUsed: { [COLORS.RED]: false, [COLORS.BLACK]: false },
    revivesUsed: { [COLORS.RED]: 0, [COLORS.BLACK]: 0 },
    fogPieceId: { [COLORS.RED]: null, [COLORS.BLACK]: null },
    fogTurns: { [COLORS.RED]: 0, [COLORS.BLACK]: 0 },
    pocket: null,
    pocketReturnTurn: 0,
    turnNumber: 0,
    collapsedSquare: null,
    extraSpellCast: { [COLORS.RED]: false, [COLORS.BLACK]: false },
    bearBonusUsed: { [COLORS.RED]: false, [COLORS.BLACK]: false },
    pendingPressMove: { [COLORS.RED]: false, [COLORS.BLACK]: false },
    pendingCoinFlipSquare: null,
    pendingRandomTeleport: null,
  };
}

export const MINE_DURATION_TURNS = 2;

export function getMineOwner(sq) {
  if (!sq?.mine) return null;
  return typeof sq.mine === "object" ? sq.mine.owner : sq.mine;
}

export function placeMine(sq, owner, hidden = false) {
  if (hidden) {
    sq.hiddenMine = { owner, turnsLeft: MINE_DURATION_TURNS };
    return;
  }
  sq.mine = { owner, turnsLeft: MINE_DURATION_TURNS };
}

export function revealMine(sq) {
  if (!sq?.hiddenMine) return;
  sq.mine = { ...sq.hiddenMine };
  delete sq.hiddenMine;
}

export function placeHiddenQuicksand(sq, owner) {
  sq.hiddenQuicksand = { owner };
}

export function tickMineDurability(state, ownerColor) {
  if (!state?.squares || !ownerColor) return;
  for (const sq of Object.values(state.squares)) {
    if (!sq) continue;
    if (sq.hiddenMine?.owner === ownerColor && sq.hiddenMine.turnsLeft != null) {
      sq.hiddenMine.turnsLeft -= 1;
      if (sq.hiddenMine.turnsLeft <= 0) delete sq.hiddenMine;
    }
    if (sq?.mine && typeof sq.mine === "object") {
      if (sq.mine.owner !== ownerColor || sq.mine.turnsLeft == null) continue;
      sq.mine.turnsLeft -= 1;
      if (sq.mine.turnsLeft <= 0) delete sq.mine;
    }
  }
}

export function sk(r, c) {
  return `${r},${c}`;
}

export function createSquareMeta() {
  return {};
}

export function getSq(state, r, c) {
  const key = sk(r, c);
  if (!state.squares[key]) state.squares[key] = {};
  return state.squares[key];
}

export function handLimit(state, color) {
  return Number.MAX_SAFE_INTEGER;
}

export function drawCostFor(state, color, baseCost) {
  if (state.meta.freeDraw[color]) return 0;
  return Math.max(0, baseCost - (state.meta.drawDiscount[color] || 0));
}

export function consumeFreeDraw(state, color) {
  if (state.meta.freeDraw[color]) {
    state.meta.freeDraw[color] = false;
    return true;
  }
  return false;
}

/** Ensure constitution counter exists (older saves / partial meta). */
export function ensureConstitutionTurns(meta) {
  if (!meta.constitutionTurns || typeof meta.constitutionTurns !== "object") {
    meta.constitutionTurns = { [COLORS.RED]: 0, [COLORS.BLACK]: 0 };
  }
  if (meta.constitutionTurns[COLORS.RED] == null) meta.constitutionTurns[COLORS.RED] = 0;
  if (meta.constitutionTurns[COLORS.BLACK] == null) meta.constitutionTurns[COLORS.BLACK] = 0;
  return meta.constitutionTurns;
}

export function startTurnMeta(state, color) {
  ensureConstitutionTurns(state.meta);
  state.meta.turnNumber += 1;
  const opp = color === COLORS.RED ? COLORS.BLACK : COLORS.RED;
  if (state.meta.prospectPending[color] > 0) {
    state.gems[color] += state.meta.prospectPending[color];
    state.meta.prospectPending[color] = 0;
  }
  state.meta.cardsLeft[color] = state.meta.parallelExtra?.[color] ? 2 : 1;
  state.meta.parallelExtra = state.meta.parallelExtra || {};
  state.meta.parallelExtra[color] = false;
  state.meta.movementCardPlayed[color] = false;
  state.meta.optionalJumps[color] = false;
  state.meta.dominionTurn[color] = false;
  state.meta.extraSpellCast[color] = false;
  state.meta.bearBonusUsed = state.meta.bearBonusUsed || { [COLORS.RED]: false, [COLORS.BLACK]: false };
  state.meta.bearBonusUsed[color] = false;
  if (state.meta.mirrorBoardTurns[opp] > 0) state.meta.mirrorBoardTurns[opp]--;
  if (state.meta.highlightTurns[opp] > 0) state.meta.highlightTurns[opp]--;
  if (state.meta.fogTurns[color] > 0) {
    state.meta.fogTurns[color]--;
    if (state.meta.fogTurns[color] <= 0) state.meta.fogPieceId[color] = null;
  }
  state.meta.shatterSilenced = state.meta.shatterSilenced || { [COLORS.RED]: false, [COLORS.BLACK]: false };
  if (state.meta.shatterSilenceNext?.[color]) {
    state.meta.shatterSilenceNext[color] = false;
    state.meta.shatterSilenced[color] = true;
  } else {
    state.meta.shatterSilenced[color] = false;
  }
  state.meta.blinded = state.meta.blinded || { [COLORS.RED]: false, [COLORS.BLACK]: false };
  if (state.meta.blindNext?.[color]) {
    state.meta.blindNext[color] = false;
    state.meta.blinded[color] = true;
  } else {
    state.meta.blinded[color] = false;
  }
  if (state.meta.constitutionTurns[color] > 0) state.meta.constitutionTurns[color]--;
  if (state.meta.collapsedSquare && typeof state.meta.collapsedSquare === "object") {
    state.meta.collapsedSquare.turnsLeft -= 1;
    if (state.meta.collapsedSquare.turnsLeft <= 0) state.meta.collapsedSquare = null;
  }
}

export function tickMeta(state, color) {
  if (state.meta.pocket && state.meta.pocketReturnTurn <= state.meta.turnNumber) {
    const { piece, r, c } = state.meta.pocket;
    if (!state.board[r][c]) state.board[r][c] = piece;
    piece.row = r;
    piece.col = c;
    state.meta.pocket = null;
  }
}

export const TRAP_EFFECT_LABELS = {
  counterspell: "Counterspell",
  vengeance: "Vengeance",
  landmine: "Landmine",
  quicksand: "Quicksand",
  last_stand: "Last Stand",
  deflect_1: "Deflect",
};

/** Queue a trap spell for move history — logged after the action that triggered it. */
export function queueTrapHistoryReveal(state, { effect, color, picks = [] }) {
  if (!state || !effect || !color) return;
  state.pendingTrapHistory = {
    label: TRAP_EFFECT_LABELS[effect] || effect,
    effect,
    color,
    picks: picks.map((p) => [...p]),
  };
}

export function takeTrapHistoryReveal(state) {
  const entry = state?.pendingTrapHistory ?? null;
  if (state) state.pendingTrapHistory = null;
  return entry;
}

export function tryConsumeCounterspell(state, casterColor) {
  if (!state.meta.counterspell) {
    state.meta.counterspell = { [COLORS.RED]: false, [COLORS.BLACK]: false };
  }
  const trapOwner = casterColor === COLORS.BLACK ? COLORS.RED : COLORS.BLACK;
  if (!state.meta.counterspell[trapOwner]) return null;
  state.meta.counterspell[trapOwner] = false;
  queueTrapHistoryReveal(state, { effect: "counterspell", color: trapOwner, picks: [] });
  return { trapOwner };
}

export function hasCounterspellArmed(state, color) {
  return !!state.meta.counterspell?.[color];
}

export function tryConsumeVengeance(state, capturerColor, victimColor) {
  if (!state.meta.vengeance) {
    state.meta.vengeance = { [COLORS.RED]: false, [COLORS.BLACK]: false };
  }
  if (capturerColor === victimColor) return null;
  if (!state.meta.vengeance[victimColor]) return null;
  state.meta.vengeance[victimColor] = false;
  return { trapOwner: victimColor };
}

export function hasVengeanceArmed(state, color) {
  return !!state.meta.vengeance?.[color];
}

export function payBountyOnCapture(state, victim, capturerColor) {
  if (!state?.meta || !victim) return 0;
  const owner = victim.bountyBy;
  if (!owner || owner !== capturerColor) return 0;
  victim.bountyBy = null;
  const drawn = drawToHand(state, owner, 2);
  if (!drawn) return 0;
  if (!state.meta.pendingBountyDraw) {
    state.meta.pendingBountyDraw = { [COLORS.RED]: 0, [COLORS.BLACK]: 0 };
  }
  state.meta.pendingBountyDraw[owner] += drawn;
  return drawn;
}

export function flushPendingBountyMessage(meta, color) {
  const n = meta?.pendingBountyDraw?.[color] || 0;
  if (!n) return null;
  meta.pendingBountyDraw[color] = 0;
  return `Bounty — drew ${n} card${n === 1 ? "" : "s"}.`;
}

export function collapsedSquareKey(meta) {
  if (!meta?.collapsedSquare) return null;
  return typeof meta.collapsedSquare === "string"
    ? meta.collapsedSquare
    : meta.collapsedSquare.square;
}

export function isSquareCollapsed(meta, r, c) {
  return collapsedSquareKey(meta) === `${r},${c}`;
}

export const COLLAPSE_DURATION_TURNS = 3;

export function setCollapsedSquare(meta, r, c, turnsLeft = COLLAPSE_DURATION_TURNS) {
  meta.collapsedSquare = { square: `${r},${c}`, turnsLeft };
}

/** Six dark squares around a darkness core (hex ring; excludes center). */
export const DARKNESS_ZONE_OFFSETS = [
  [-1, -1], [-1, 1], [1, -1], [1, 1],
  [0, -2], [0, 2],
];

export function getDarknessZoneCellsAround(r, c) {
  const cells = [];
  for (const [dr, dc] of DARKNESS_ZONE_OFFSETS) {
    const nr = r + dr, nc = c + dc;
    if (inBounds(nr, nc) && isDarkSquare(nr, nc)) cells.push([nr, nc]);
  }
  return cells;
}

/** True when (r,c) is a dark square cloaked by an active darkness core. */
export function isInDarknessZone(state, r, c) {
  if (!state?.squares) return false;
  for (const key of Object.keys(state.squares)) {
    const sq = state.squares[key];
    if (!(sq?.darkness > 0)) continue;
    const [cr, cc] = key.split(",").map(Number);
    for (const [dr, dc] of DARKNESS_ZONE_OFFSETS) {
      if (cr + dr === r && cc + dc === c) return true;
    }
  }
  return false;
}

export function isSanctuaryProtected(state, r, c, pieceColor) {
  const sq = state?.squares?.[sk(r, c)];
  return sq?.sanctuary === pieceColor && (sq.sanctuaryTurns ?? 0) > 0;
}
