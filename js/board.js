/** Checkers board logic with card-effect modifiers */
import { getMineOwner, tickMineDurability, collapsedSquareKey, isSanctuaryProtected, isInDarknessZone, revealMine, tryConsumeVengeance } from "./gameMeta.js";
import { queueBoardFx } from "./boardFx.js";

function sk(r, c) {
  return `${r},${c}`;
}

function getSq(state, r, c) {
  const key = sk(r, c);
  if (!state.squares[key]) state.squares[key] = {};
  return state.squares[key];
}



export const SIZE = 8;
export const COLORS = { RED: "red", BLACK: "black" };
export const FILES = "abcdefgh";

/** Algebraic square name (e.g. b6). Row 0 = rank 8, row 7 = rank 1. */
export function squareName(row, col) {
  return `${FILES[col]}${SIZE - row}`;
}

/** Board grid with a–h file labels and 1–8 rank labels. */
export function boardFrameHtml() {
  const fileBtn = (f, i) =>
    `<button type="button" class="board-file-btn" data-col="${i}" aria-label="File ${f}" disabled>${f}</button>`;
  const fileLabelsTop = [...FILES].map((f) => `<span class="board-label">${f}</span>`).join("");
  const fileLabelsBottom = [...FILES].map((f, i) => fileBtn(f, i)).join("");
  const rankBtn = (row) =>
    `<button type="button" class="board-rank-btn" data-row="${row}" aria-label="Rank ${SIZE - row}" disabled>${SIZE - row}</button>`;
  const rankLabels = Array.from({ length: SIZE }, (_, row) => rankBtn(row)).join("");
  return `
    <div class="board-frame" id="board-frame">
      <div class="board-files board-files--top" aria-hidden="true">${fileLabelsTop}</div>
      <div class="board-ranks" id="board-ranks-left">${rankLabels}</div>
      <div id="board" class="board" role="grid" aria-label="Checker board"></div>
      <div class="board-files board-files--bottom" id="board-files-bottom">${fileLabelsBottom}</div>
    </div>`;
}

let nextPieceId = 1;

export function isDarkSquare(row, col) {
  return (row + col) % 2 === 1;
}

export function inBounds(row, col) {
  return row >= 0 && row < SIZE && col >= 0 && col < SIZE;
}

export const SIGIL_MOVES = 2;
/** Shield turns granted when Last Stand triggers on capture. */
export const LAST_STAND_SHIELD_TURNS = 3;

export function hasKnightSigil(piece) {
  return piece && (piece.knightTurns > 0 || piece.isKnight) && !piece.silenced;
}

function decrementSigilMoves(piece) {
  if (!piece) return;
  if (piece.knightTurns > 0) {
    piece.knightTurns--;
    if (piece.knightTurns <= 0) piece.knightCapture = false;
  } else if (piece.isKnight) {
    piece.isKnight = false;
    piece.knightCapture = false;
  }
  if (piece.rookTurns > 0) piece.rookTurns--;
  if (piece.bishopTurns > 0) piece.bishopTurns--;
}


export function createPiece(color, row, col, king = false) {
  return {
    id: nextPieceId++,
    color,
    king,
    row,
    col,
    startRow: row,
    startCol: col,
    shieldTurns: 0,
    frozenTurns: 0,
    retreatTurns: 0,
    isKnight: false,
    knightTurns: 0,
    rookTurns: 0,
    bishopTurns: 0,
    queenTurns: 0,
    wraithTurns: 0,
    stoneTurns: 0,
    rooted: 0,
    slowed: 0,
    reverseOnlyTurns: 0,
    silenced: 0,
    hexed: 0,
    rusted: false,
    bombArmed: false,
    anchored: 0,
    fortifyTurns: 0,
    venom: 0,
    blazeTurns: 0,
    superMan: 0,
    lastStand: false,
    mirrorShield: false,
    ghostGuard: false,
    phalanxId: 0,
    knightCapture: false,
    pawnZeal: false,
    panicTurn: false,
    succession: false,
    twinId: null,
    chameleonFrom: null,
    chameleonTurns: 0,
    mindControlTurns: 0,
    mindControlOriginalColor: null,
    revivedNoCapture: false,
    berserkNoCapture: false,
    paralyzedTurns: 0,
    hibernationTurns: 0,
    bearAwakened: false,
    linkedFateId: null,
    isClone: false,
    cloneNoCaptureThisTurn: false,
  };
}

/** Clones are destroyed instantly by freeze, poison, or burn instead of receiving the debuff. */
export function destroyPieceIfClone(board, state, row, col) {
  const p = board[row][col];
  if (!p?.isClone) return false;
  removePiece(board, row, col, { force: true, state });
  return true;
}

export function applyFreezeToPiece(board, state, row, col, turns) {
  if (destroyPieceIfClone(board, state, row, col)) return true;
  const piece = board[row][col];
  if (!piece) return false;
  piece.frozenTurns = Math.max(piece.frozenTurns || 0, turns);
  return true;
}

export function applyVenomToPiece(board, state, row, col, amount) {
  if (destroyPieceIfClone(board, state, row, col)) return true;
  const piece = board[row][col];
  if (!piece) return false;
  piece.venom = amount;
  return true;
}

export function applyBurnToPiece(board, state, row, col, turns) {
  if (destroyPieceIfClone(board, state, row, col)) return true;
  const piece = board[row][col];
  if (!piece) return false;
  piece.blazeTurns = turns;
  return true;
}

export function createInitialBoard() {
  nextPieceId = 1;
  const board = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (!isDarkSquare(row, col)) continue;
      if (row < 3) board[row][col] = createPiece(COLORS.BLACK, row, col);
      else if (row > 4) board[row][col] = createPiece(COLORS.RED, row, col);
    }
  }
  return board;
}

export function getPiece(board, row, col) {
  if (!inBounds(row, col)) return null;
  return board[row][col];
}

export function setPiece(board, row, col, piece) {
  if (piece) { piece.row = row; piece.col = col; }
  board[row][col] = piece;
}

function removeLinkedFatePartner(board, state, deadPiece) {
  const partnerId = deadPiece?.linkedFateId;
  if (!partnerId) return;
  deadPiece.linkedFateId = null;
  for (let lr = 0; lr < SIZE; lr++) {
    for (let lc = 0; lc < SIZE; lc++) {
      const lp = board[lr][lc];
      if (lp && lp.id === partnerId) {
        lp.linkedFateId = null;
        if (state) {
          if (!state.captured[lp.color]) state.captured[lp.color] = [];
          state.captured[lp.color].push({ king: lp.king });
        }
        board[lr][lc] = null;
        return;
      }
    }
  }
}

export function removePiece(board, row, col, { force = false, state = null } = {}) {
  const p = board[row][col];
  if (p?.cloneNoCaptureThisTurn && !force) return false;
  if (p && state) {
    if (!state.captured[p.color]) state.captured[p.color] = [];
    state.captured[p.color].push({ king: p.king });
    if (p.linkedFateId) removeLinkedFatePartner(board, state, p);
  }
  board[row][col] = null;
  return true;
}

export function movePiece(board, fromR, fromC, toR, toC) {
  const piece = board[fromR][fromC];
  board[fromR][fromC] = null;
  setPiece(board, toR, toC, piece);
  decrementSigilMoves(piece);
  return piece;
}

function isProtected(piece, state = null, r = null, c = null) {
  if (!piece) return false;
  if (piece.cloneNoCaptureThisTurn) return true;
  if (piece.shieldTurns > 0) return true;
  if (state != null && r != null && c != null) {
    if (isSanctuaryProtected(state, r, c, piece.color)) return true;
    if (isInDarknessZone(state, r, c)) return true;
  }
  return false;
}

function isFrozen(piece) {
  return piece && piece.frozenTurns > 0;
}

export function isFireBlockedForMover(state, r, c, moverColor) {
  if (!moverColor || !state?.squares) return false;
  const sq = state.squares[sk(r, c)];
  return !!(sq?.fireTurns > 0 && sq.fireOwner && sq.fireOwner !== moverColor);
}

function squareBlocked(state, r, c, moverColor = null) {
  if (!inBounds(r, c)) return true;
  const key = sk(r, c);
  if (collapsedSquareKey(state?.meta) === key) return true;
  const sq = state?.squares?.[key];
  if (sq?.obstacle) return true;
  if (sq?.ghostBlock > 0) return true;
  if (sq?.barrier?.turnsLeft > 0 && moverColor && sq.barrier.owner !== moverColor) return true;
  if (isFireBlockedForMover(state, r, c, moverColor)) return true;
  return false;
}

const KNIGHT_OFFSETS = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];

export function getKnightMoves(board, piece, state, canCapture = false) {
  if (piece.revivedNoCapture || piece.cloneNoCaptureThisTurn || piece.berserkNoCapture) canCapture = false;
  const moves = [];
  for (const [dr, dc] of KNIGHT_OFFSETS) {
    const nr = piece.row + dr, nc = piece.col + dc;
    if (!inBounds(nr, nc) || !isDarkSquare(nr, nc) || squareBlocked(state, nr, nc, piece.color)) continue;
    const t = board[nr][nc];
    if (!t) moves.push({ from: [piece.row, piece.col], to: [nr, nc], captures: [], type: "step" });
    else if (canCapture && t.color !== piece.color && !isProtected(t))
      moves.push({ from: [piece.row, piece.col], to: [nr, nc], captures: [[nr, nc]], type: "jump" });
  }
  return moves;
}

function slideMoves(board, piece, state, dirs) {
  const moves = [];
  for (const [dr, dc] of dirs) {
    let r = piece.row + dr, c = piece.col + dc;
    while (inBounds(r, c) && isDarkSquare(r, c) && !squareBlocked(state, r, c, piece.color)) {
      if (board[r][c]) break;
      moves.push({ from: [piece.row, piece.col], to: [r, c], captures: [], type: "step" });
      r += dr; c += dc;
    }
  }
  return moves;
}

export function forwardDirs(piece, dominion = false) {
  if (hasKnightSigil(piece)) return [];
  if (piece.reverseOnlyTurns > 0) {
    return piece.color === COLORS.RED
      ? [[1, -1], [1, 1]]
      : [[-1, -1], [-1, 1]];
  }
  const dirs = [];
  const treatKing = piece.king && !(piece.slowed > 0);
  if (piece.color === COLORS.RED) {
    dirs.push([-1, -1], [-1, 1]);
    if (treatKing || piece.retreatTurns > 0 || dominion) dirs.push([1, -1], [1, 1]);
  } else {
    dirs.push([1, -1], [1, 1]);
    if (treatKing || piece.retreatTurns > 0 || dominion) dirs.push([-1, -1], [-1, 1]);
  }
  return dirs;
}

export function getStepMoves(board, piece, color, state = null) {
  const moves = [];
  if (piece.cloneNoCaptureThisTurn) return moves;
  if (isFrozen(piece) || piece.paralyzedTurns > 0 || piece.fortifyTurns > 0 || piece.hibernationTurns > 0) return moves;
  const dom = state?.meta?.dominionTurn?.[color];

  if (hasKnightSigil(piece))
    return getKnightMoves(board, piece, state, piece.knightCapture);

  if (piece.queenTurns > 0 && !piece.silenced) {
    moves.push(...getKnightMoves(board, piece, state, false));
  }
  if (piece.rookTurns > 0 && !piece.silenced) {
    const rd = [];
    for (let i = 0; i < SIZE; i++) { rd.push([0,i],[0,-i],[i,0],[-i,0]); }
    moves.push(...slideMoves(board, piece, state, rd));
  }
  if (piece.bishopTurns > 0 && !piece.silenced) {
    moves.push(...slideMoves(board, piece, state, [[-1,-1],[-1,1],[1,-1],[1,1]]));
  }

  const dirs = forwardDirs(piece, dom);
  for (const [dr, dc] of dirs) {
    const nr = piece.row + dr, nc = piece.col + dc;
    if (!inBounds(nr, nc) || !isDarkSquare(nr, nc) || squareBlocked(state, nr, nc, piece.color)) continue;
    if (!board[nr][nc]) {
      moves.push({ from: [piece.row, piece.col], to: [nr, nc], captures: [], type: "step" });
    } else if (piece.wraithTurns > 0) {
      /* pass through not implemented for landing */
    }
  }

  if (piece.superMan > 0) {
    for (const [dr, dc] of dirs) {
      const nr = piece.row + dr * 2, nc = piece.col + dc * 2;
      if (inBounds(nr, nc) && isDarkSquare(nr, nc) && !board[nr][nc] && !squareBlocked(state, nr, nc, piece.color))
        moves.push({ from: [piece.row, piece.col], to: [nr, nc], captures: [], type: "step" });
    }
  }
  return moves;
}

export function getJumpMoves(board, piece, color, state = null) {
  const moves = [];
  if (piece.cloneNoCaptureThisTurn) return moves;
  if (piece.revivedNoCapture || piece.berserkNoCapture) return moves;
  if (piece.reverseOnlyTurns > 0 || piece.noCaptureTurns > 0) return moves;
  if (isFrozen(piece) || piece.paralyzedTurns > 0 || piece.rooted > 0 || piece.fortifyTurns > 0 || piece.hibernationTurns > 0) return moves;
  if (hasKnightSigil(piece) && !piece.knightCapture) return moves;
  if (hasKnightSigil(piece) && piece.knightCapture)
    return getKnightMoves(board, piece, state, true);

  let dirs;
  if (piece.reverseOnlyTurns > 0) {
    dirs = forwardDirs(piece, state?.meta?.dominionTurn?.[color]);
  } else {
    const treatKing = piece.king && !(piece.slowed > 0);
    const dom = state?.meta?.dominionTurn?.[color];
    if (treatKing) dirs = [[-1,-1],[-1,1],[1,-1],[1,1]];
    else if (piece.color === COLORS.RED) {
      dirs = [[-1,-1],[-1,1]];
      if (piece.retreatTurns > 0 || dom) dirs.push([1,-1],[1,1]);
    } else {
      dirs = [[1,-1],[1,1]];
      if (piece.retreatTurns > 0 || dom) dirs.push([-1,-1],[-1,1]);
    }
  }

  for (const [dr, dc] of dirs) {
    const mr = piece.row + dr, mc = piece.col + dc;
    const lr = piece.row + dr * 2, lc = piece.col + dc * 2;
    if (!inBounds(lr, lc) || !isDarkSquare(lr, lc) || squareBlocked(state, lr, lc, piece.color)) continue;
    const mid = getPiece(board, mr, mc);
    if (!mid || mid.color === piece.color) continue;
    if (isProtected(mid, state, mr, mc)) continue;
    if (piece.stoneTurns > 0) continue;
    if (board[lr][lc]) continue;
    moves.push({ from: [piece.row, piece.col], to: [lr, lc], captures: [[mr, mc]], type: "jump" });
  }
  return moves;
}

export function getAllMovesForColor(board, color, state = null) {
  const panicked = findPanicPiece(board, color);
  if (panicked) {
    const panicMoves = getBackwardStepMoves(board, panicked, state);
    if (panicMoves.length) return panicMoves;
  }
  const jumps = [], steps = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const piece = board[r][c];
      if (!piece || piece.color !== color) continue;
      jumps.push(...getJumpMoves(board, piece, color, state));
      steps.push(...getStepMoves(board, piece, color, state));
    }
  }
  if (state?.meta?.optionalJumps?.[color]) return jumps.length ? jumps : steps;
  if (jumps.length > 0) return jumps;
  return steps;
}

function explodeBombAt(board, state, row, col) {
  const victims = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const r = row + dr, c = col + dc;
      if (!inBounds(r, c)) continue;
      const p = board[r][c];
      if (!p) continue;
      victims.push([r, c, p]);
    }
  }
  for (const [r, c, p] of victims) {
    if (state) {
      if (!state.captured[p.color]) state.captured[p.color] = [];
      state.captured[p.color].push({ king: p.king });
    }
    removePiece(board, r, c);
  }
  return victims.length;
}

export function applyMove(board, move, state = null) {
  const [fr, fc] = move.from;
  const [tr, tc] = move.to;
  let piece = movePiece(board, fr, fc, tr, tc);
  for (const [cr, cc] of move.captures) {
    const cap = board[cr][cc];
    if (cap) {
      const linkedPartner = cap.linkedFateId;
      if (cap && piece && tryConsumeVengeance(state, piece.color, cap.color)) {
        queueBoardFx(state, "vengeance", cr, cc, [[cr, cc], [piece.row, piece.col]]);
        state?.meta?.achievementHook?.onTrapTriggered?.(cap.color, piece.color);
        removePiece(board, piece.row, piece.col);
        piece = null;
      }
      if (cap && state) {
        if (!state.captured[cap.color]) state.captured[cap.color] = [];
        state.captured[cap.color].push({ king: cap.king });
        if (cap.succession) {
          const mates = piecesOfColor(board, cap.color).filter((p) => !p.king);
          if (mates.length) mates[0].king = true;
        }
      }
      cap.linkedFateId = null;
      removePiece(board, cr, cc);
      if (linkedPartner && state) {
        for (let lr = 0; lr < SIZE; lr++)
          for (let lc = 0; lc < SIZE; lc++) {
            const lp = board[lr][lc];
            if (lp && lp.id === linkedPartner) {
              lp.linkedFateId = null;
              if (!state.captured[lp.color]) state.captured[lp.color] = [];
              state.captured[lp.color].push({ king: lp.king });
              removePiece(board, lr, lc);
              break;
            }
          }
      }
    }
  }
  if (!piece) return null;
  if (!piece.king && !(piece.rustedTurns > 0)) {
    if (piece.color === COLORS.RED && tr === 0) piece.king = true;
    if (piece.color === COLORS.BLACK && tr === SIZE - 1) piece.king = true;
  }
  const sq = state ? getSq(state, tr, tc) : null;
  if (sq?.sanctified === piece.color && !piece.king) piece.king = true;
  if (sq?.hiddenQuicksand) {
    const qsOwner = sq.hiddenQuicksand.owner;
    delete sq.hiddenQuicksand;
    if (piece) {
      applyFreezeToPiece(board, state, tr, tc, 1);
      state?.meta?.achievementHook?.onTrapTriggered?.(qsOwner, piece.color);
    }
  }
  if (sq?.hiddenMine) {
    revealMine(sq);
    const mineOwner = getMineOwner(sq);
    if (mineOwner && mineOwner !== piece.color && piece) {
      queueBoardFx(state, "mine", tr, tc);
      state?.meta?.achievementHook?.onTrapTriggered?.(mineOwner, piece.color);
      removePiece(board, tr, tc);
      sq.mine = null;
      return null;
    }
  } else {
    const mineOwner = getMineOwner(sq);
    if (mineOwner && mineOwner !== piece.color && piece) {
      queueBoardFx(state, "mine", tr, tc);
      state?.meta?.achievementHook?.onTrapTriggered?.(mineOwner, piece.color);
      removePiece(board, tr, tc);
      sq.mine = null;
      return null;
    }
  }
  if (piece && piece.bombArmed) {
    piece.bombArmed = false;
    explodeBombAt(board, state, tr, tc);
    if (state) queueBoardFx(state, "bomb", tr, tc);
    return null;
  }
  return piece;
}


export function findPanicPiece(board, color) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const p = board[r][c];
      if (p && p.color === color && p.panicTurn) return p;
    }
  }
  return null;
}

export function backwardDirs(piece) {
  return piece.color === COLORS.RED
    ? [[1, -1], [1, 1]]
    : [[-1, -1], [-1, 1]];
}

/** Backward-diagonal step moves only (Panic). */
export function getBackwardStepMoves(board, piece, state = null) {
  const moves = [];
  if (piece.cloneNoCaptureThisTurn) return moves;
  if (isFrozen(piece) || piece.paralyzedTurns > 0 || piece.fortifyTurns > 0 || piece.hibernationTurns > 0) return moves;
  for (const [dr, dc] of backwardDirs(piece)) {
    const nr = piece.row + dr, nc = piece.col + dc;
    if (!inBounds(nr, nc) || !isDarkSquare(nr, nc) || squareBlocked(state, nr, nc, piece.color)) continue;
    if (!board[nr][nc]) {
      moves.push({ from: [piece.row, piece.col], to: [nr, nc], captures: [], type: "step" });
    }
  }
  return moves;
}

export function countPieces(board, color) {
  let n = 0;
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) if (board[r][c]?.color === color) n++;
  return n;
}


export function tickEndTurnEffects(board, color, state = null) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const p = board[r][c];
      if (!p || p.color !== color) continue;
      if (p.rooted > 0) p.rooted--;
      if (p.cloneNoCaptureThisTurn) p.cloneNoCaptureThisTurn = false;
      if (p.panicTurn) p.panicTurn = false;
    }
  }
  if (state?.squares) {
    for (const sq of Object.values(state.squares)) {
      if (!sq?.barrier?.turnsLeft) continue;
      if (sq.barrier.owner === color) continue;
      sq.barrier.turnsLeft--;
      if (sq.barrier.turnsLeft <= 0) delete sq.barrier;
    }
  }
}

export function tickEffects(board, color, state = null) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const p = board[r][c];
      if (!p || p.color !== color) continue;
      const dec = (k) => { if (p[k] > 0) p[k]--; };
      if (p.hibernationTurns > 0) {
        p.hibernationTurns--;
        if (p.hibernationTurns <= 0) {
          p.hibernationTurns = 0;
          p.king = true;
          p.bearAwakened = true;
        }
      }
      dec("shieldTurns"); dec("frozenTurns"); dec("paralyzedTurns"); dec("retreatTurns");
      dec("queenTurns"); dec("wraithTurns");
      dec("stoneTurns"); dec("slowed"); dec("reverseOnlyTurns"); dec("silenced"); dec("hexed");
      dec("anchored"); dec("fortifyTurns"); dec("superMan"); dec("chameleonTurns"); dec("rustedTurns"); dec("noCaptureTurns");
      dec("deflectTurns");
      if (p.venom > 0) {
        p.venom--;
        if (p.venom <= 0) removePiece(board, r, c, { state, force: p.isClone });
      }
      if (p.blazeTurns > 0) {
        p.blazeTurns--;
        if (p.blazeTurns <= 0) removePiece(board, r, c, { state, force: p.isClone });
      }
      if (p.mindControlTurns > 0) {
        p.mindControlTurns--;
        if (p.mindControlTurns <= 0) {
          if (p.mindControlOriginalColor) p.color = p.mindControlOriginalColor;
          p.mindControlOriginalColor = null;
          p.mindControlTurns = 0;
        }
      }
      if (p.revivedNoCapture) p.revivedNoCapture = false;
      if (p.berserkNoCapture) p.berserkNoCapture = false;
      if (p.rustedTurns > 0) {
        p.rustedTurns--;
        if (p.rustedTurns <= 0) {
          const promo = p.color === COLORS.RED ? 0 : SIZE - 1;
          if (p.row === promo) p.king = true;
        }
      }
    }
  }
  if (state?.squares) {
    tickMineDurability(state, color);
    for (const k of Object.keys(state.squares)) {
      const sq = state.squares[k];
      if (sq.ghostBlock > 0) sq.ghostBlock--;
      if (sq.sanctuaryTurns > 0 && sq.sanctuary === color) {
        sq.sanctuaryTurns--;
        if (sq.sanctuaryTurns <= 0) delete sq.sanctuary;
      }
      if (sq.darkness > 0) sq.darkness--;
      if (sq.fireTurns > 0) {
        sq.fireTurns--;
        if (sq.fireTurns <= 0) {
          delete sq.fireTurns;
          delete sq.fireOwner;
        }
      }
    }
  }
}

export function getBoltTarget(board, piece) {
  const dir = piece.color === COLORS.RED ? -1 : 1;
  const targets = [];
  for (const dc of [-1, 1]) {
    let r = piece.row + dir, c = piece.col + dc;
    while (inBounds(r, c) && isDarkSquare(r, c)) {
      const cell = board[r][c];
      if (cell) {
        if (cell.color !== piece.color && cell.shieldTurns <= 0) targets.push([r, c]);
        break;
      }
      r += dir; c += dc;
    }
  }
  return targets;
}

/** First enemy on each forward diagonal (Cryo Bolt — freeze or shatter frozen/paralyzed). */
export function getCryoBoltTarget(board, piece) {
  const dir = piece.color === COLORS.RED ? -1 : 1;
  const targets = [];
  for (const dc of [-1, 1]) {
    let r = piece.row + dir, c = piece.col + dc;
    while (inBounds(r, c) && isDarkSquare(r, c)) {
      const cell = board[r][c];
      if (cell) {
        if (cell.color !== piece.color) targets.push([r, c]);
        break;
      }
      r += dir; c += dc;
    }
  }
  return targets;
}

/** First enemy directly ahead on a forward diagonal (Forward Bolt). */
export function getAdjacentForwardBoltTarget(board, piece) {
  const dir = piece.color === COLORS.RED ? -1 : 1;
  const targets = [];
  for (const dc of [-1, 1]) {
    const r = piece.row + dir;
    const c = piece.col + dc;
    if (inBounds(r, c) && isDarkSquare(r, c)) {
      const cell = board[r][c];
      if (cell && cell.color !== piece.color && cell.shieldTurns <= 0) targets.push([r, c]);
    }
  }
  return targets;
}

/** One empty square backward-diagonal behind your piece (Backstep). */
export function getBackstepTarget(board, piece, state = null) {
  const forward =
    piece.color === COLORS.RED ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];
  const targets = [];
  for (const [dr, dc] of forward) {
    const r = piece.row - dr;
    const c = piece.col - dc;
    if (!inBounds(r, c) || !isDarkSquare(r, c) || board[r][c]) continue;
    if (state && squareBlocked(state, r, c, piece.color)) continue;
    targets.push([r, c]);
  }
  return targets;
}

export function getAdjacentEmpty(board, piece) {
  const spots = [];
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      const nr = piece.row + dr, nc = piece.col + dc;
      if (inBounds(nr, nc) && isDarkSquare(nr, nc) && !board[nr][nc]) spots.push([nr, nc]);
    }
  return spots;
}

/** Jump over a friendly piece to land two steps away (Leapfrog / Phase Walk). */
export function getLeapfrogTargets(board, piece, color) {
  const targets = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      const mr = piece.row + dr;
      const mc = piece.col + dc;
      const mid = board[mr]?.[mc];
      if (!mid || mid.color !== color) continue;
      const r2 = piece.row + dr * 2;
      const c2 = piece.col + dc * 2;
      if (inBounds(r2, c2) && isDarkSquare(r2, c2) && !board[r2][c2]) targets.push([r2, c2]);
    }
  }
  return targets;
}

export function getTeleportTargets(board, piece) {
  const spots = [];
  for (let dr = -2; dr <= 2; dr++)
    for (let dc = -2; dc <= 2; dc++) {
      if (!dr && !dc) continue;
      const nr = piece.row + dr, nc = piece.col + dc;
      if (inBounds(nr, nc) && isDarkSquare(nr, nc) && !board[nr][nc]) spots.push([nr, nc]);
    }
  return spots;
}

export function piecesOfColor(board, color) {
  const list = [];
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      const p = board[r][c];
      if (p && p.color === color) list.push(p);
    }
  return list;
}

export function enemyPieces(board, color) {
  return piecesOfColor(board, color === COLORS.RED ? COLORS.BLACK : COLORS.RED);
}
