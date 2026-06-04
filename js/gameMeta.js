/** Global match state: gems modifiers, square terrain, turn flags */

import { COLORS, SIZE } from "./board.js";

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
    deflectTrap: { [COLORS.RED]: false, [COLORS.BLACK]: false },
    blindNext: { [COLORS.RED]: false, [COLORS.BLACK]: false },
    confuseNext: { [COLORS.RED]: false, [COLORS.BLACK]: false },
    shatterSilenceNext: { [COLORS.RED]: false, [COLORS.BLACK]: false },
    shatterSilenced: { [COLORS.RED]: false, [COLORS.BLACK]: false },
    mirrorBoardTurns: { [COLORS.RED]: 0, [COLORS.BLACK]: 0 },
    highlightTurns: { [COLORS.RED]: 0, [COLORS.BLACK]: 0 },
    dominionTurn: { [COLORS.RED]: false, [COLORS.BLACK]: false },
    prospectPending: { [COLORS.RED]: 0, [COLORS.BLACK]: 0 },
    constitutionTurns: { [COLORS.RED]: 0, [COLORS.BLACK]: 0 },
    mindControlId: null,
    mindControlController: null,
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

export const QUICKSAND_DURATION_TURNS = 4;

export function placeHiddenQuicksand(sq, owner, turnsLeft = QUICKSAND_DURATION_TURNS) {
  sq.hiddenQuicksand = { owner, turnsLeft };
}

export function tickMineDurability(state, ownerColor) {
  if (!state?.squares || !ownerColor) return;
  for (const sq of Object.values(state.squares)) {
    if (!sq) continue;
    if (sq.hiddenQuicksand?.owner === ownerColor && sq.hiddenQuicksand.turnsLeft != null) {
      sq.hiddenQuicksand.turnsLeft -= 1;
      if (sq.hiddenQuicksand.turnsLeft <= 0) delete sq.hiddenQuicksand;
    }
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

export function startTurnMeta(state, color) {
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

export function tryConsumeCounterspell(state, casterColor) {
  const trapOwner = casterColor === COLORS.BLACK ? COLORS.RED : COLORS.BLACK;
  if (!state.meta.counterspell?.[trapOwner]) return null;
  state.meta.counterspell[trapOwner] = false;
  return { trapOwner };
}

export function hasCounterspellArmed(state, color) {
  return !!state.meta.counterspell?.[color];
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

/** Dark squares in darkness aura (center + neighbors) */
export function isInDarknessZone(state, r, c) {
  if (!state?.squares) return false;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const sq = state.squares[sk(r + dr, c + dc)];
      if (sq?.darkness > 0) return true;
    }
  }
  return false;
}

export function isSanctuaryProtected(state, r, c, pieceColor) {
  const sq = state?.squares?.[sk(r, c)];
  return sq?.sanctuary === pieceColor && (sq.sanctuaryTurns ?? 0) > 0;
}
