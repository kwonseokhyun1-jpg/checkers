/**
 * Piece buff/curse labels, inspection UI copy, and Purify cleanse logic.
 */
import { squareNameLabeled } from "./board.js";

const BUFF_RULES = [
  { key: "shieldTurns", label: "Shield", turns: true },
  { key: "fortifyTurns", label: "Fortify", turns: true },
  { key: "retreatTurns", label: "Retreat", turns: true },
  { key: "knightTurns", label: "Knight Sigil", turns: true },
  { key: "rookTurns", label: "Rook's Mark", turns: true },
  { key: "bishopTurns", label: "Bishop's Mark", turns: true },
  { key: "queenTurns", label: "Queen's Grace", turns: true },
  { key: "wraithTurns", label: "Wraith Step", turns: true },
  { key: "superMan", label: "Superman Leap", turns: true },
  { key: "lastStand", label: "Last Stand (ultra shield on capture)", bool: true },
  { key: "mirrorShield", label: "Mirror Shield", bool: true },
  { key: "ghostGuard", label: "Ghost Guard", bool: true },
  { key: "bombArmed", label: "Bomb Armed", bool: true },
  { key: "shockwaveArmed", label: "Shockwave Armed", bool: true },
  { key: "hibernationTurns", label: "Hibernating", turns: true },
  { key: "bearAwakened", label: "Awoken Bear", bool: true },
  { key: "pawnZeal", label: "Pawn's Zeal", bool: true },
  { key: "succession", label: "Succession", bool: true },
];

const CURSE_RULES = [
  { key: "linkedFateId", label: "Linked Fate", bool: true },
  { key: "bountyBy", label: "Bounty (jump-capture to reward)", bool: true },
  { key: "frozenTurns", label: "Frozen", turns: true },
  { key: "paralyzedTurns", label: "Paralyzed", turns: true },
  { key: "rooted", label: "Rooted", turns: true },
  { key: "silenced", label: "Silenced", turns: true },
  { key: "venom", label: "Venom", turns: true },
  { key: "blazeTurns", label: "Burning", turns: true },
  { key: "bloodTurns", label: "Vengeance Blood", turns: true },
  { key: "plagueTurns", label: "Plague", turns: true },
  { key: "slowed", label: "Slowed", turns: true },
  { key: "reverseOnlyTurns", label: "Reverse March", turns: true },
  { key: "anchored", label: "Anchored", turns: true },
  { key: "panicTurn", label: "Panic", bool: true },
  { key: "revivedNoCapture", label: "Revived (no capture)", bool: true },
  { key: "berserkNoCapture", label: "Berserk (no capture)", bool: true },
  { key: "isClone", label: "Clone (fragile)", bool: true },
  { key: "cloneNoCaptureThisTurn", label: "Clone (no move/capture)", bool: true },
  { key: "mindControlTurns", label: "Mind controlled", turns: true },
];

function lineForRule(piece, rule) {
  const v = piece[rule.key];
  if (rule.bool) {
    if (!v) return null;
    return { label: rule.label };
  }
  if (rule.turns) {
    const n = Number(v) || 0;
    if (n <= 0) return null;
    return { label: rule.label, turns: n };
  }
  return null;
}

export function getPieceStatus(piece) {
  if (!piece) return { buffs: [], curses: [] };
  const buffs = [];
  const curses = [];
  if (piece.isKnight && !(piece.knightTurns > 0)) {
    buffs.push({ label: "Knight" });
  }
  for (const rule of BUFF_RULES) {
    const line = lineForRule(piece, rule);
    if (line) buffs.push(line);
  }
  for (const rule of CURSE_RULES) {
    const line = lineForRule(piece, rule);
    if (line) curses.push(line);
  }
  return { buffs, curses };
}

function formatLine(line) {
  return line.turns != null ? `${line.label} (${line.turns} turn${line.turns === 1 ? "" : "s"})` : line.label;
}

export function formatPieceStatusMessage(piece, row, col) {
  const { buffs, curses } = getPieceStatus(piece);
  const side = piece.color === "red" ? "Your" : "Enemy";
  const role = piece.king ? "king" : "man";
  const parts = [`${side} ${role} at ${squareNameLabeled(row, col)}`];
  if (buffs.length) parts.push(`Buffs: ${buffs.map(formatLine).join(", ")}`);
  else parts.push("Buffs: none");
  if (curses.length) parts.push(`Curses: ${curses.map(formatLine).join(", ")}`);
  else parts.push("Curses: none");
  return parts.join(" · ");
}

export function cleanseDebuffs(piece) {
  if (!piece) return;
  piece.frozenTurns = 0;
  piece.paralyzedTurns = 0;
  piece.rooted = 0;
  piece.silenced = 0;
  piece.venom = 0;
  piece.plagueTurns = 0;
  piece.plagueSeed = false;
  piece.plagueDeferBeginTick = false;
  piece.blazeTurns = 0;
  piece.blazeBy = null;
  piece.linkedFateId = null;
  piece.bountyBy = null;
  piece.slowed = 0;
  piece.reverseOnlyTurns = 0;
  piece.anchored = 0;
  piece.noCaptureTurns = 0;
  piece.panicTurn = false;
  piece.revivedNoCapture = false;
  piece.berserkNoCapture = false;
  piece.cloneNoCaptureThisTurn = false;
  piece.mindControlTurns = 0;
  piece.mindControlOriginalColor = null;
}

export function cleansePiece(piece) {
  if (!piece) return;
  cleanseDebuffs(piece);
  piece.shieldTurns = 0;
  piece.fortifyTurns = 0;
  piece.lastStand = false;
  piece.lastStandTurns = 0;
  piece.mirrorShield = false;
  piece.deflectTurns = 0;
  piece.ghostGuard = false;
  piece.hibernationTurns = 0;
  piece.bearAwakened = false;
  piece.bishopTurns = 0;
  piece.rookTurns = 0;
  piece.queenTurns = 0;
  piece.retreatTurns = 0;
}

export function pieceHasDebuffs(piece) {
  if (!piece) return false;
  return CURSE_RULES.some((rule) => lineForRule(piece, rule) !== null);
}

export function friendlyHasDebuffs(board, color) {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      const p = board[r][c];
      if (p && p.color === color && pieceHasDebuffs(p)) return true;
    }
  }
  return false;
}

/** Frozen, paralyzed, or rooted — debuffs Iron Will can consume to allow one move. */
export function pieceHasIronWillDebuff(piece) {
  if (!piece) return false;
  return piece.frozenTurns > 0 || piece.paralyzedTurns > 0 || piece.rooted > 0;
}

export function friendlyHasIronWillTarget(board, color) {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      const p = board[r][c];
      if (p && p.color === color && pieceHasIronWillDebuff(p)) return true;
    }
  }
  return false;
}

export function cleanseFriendlyDebuffs(board, color) {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      const p = board[r][c];
      if (p && p.color === color) cleanseDebuffs(p);
    }
  }
}

export function cleanseAllPieces(board) {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      cleansePiece(board[r][c]);
    }
  }
}
