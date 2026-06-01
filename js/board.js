/** Checkers board logic with card-effect modifiers */

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

let nextPieceId = 1;

export function isDarkSquare(row, col) {
  return (row + col) % 2 === 1;
}

export function inBounds(row, col) {
  return row >= 0 && row < SIZE && col >= 0 && col < SIZE;
}

export const SIGIL_MOVES = 2;

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
    silenced: 0,
    hexed: 0,
    rusted: false,
    bombArmed: false,
    anchored: 0,
    fortifyTurns: 0,
    venom: 0,
    superMan: 0,
    hunterMark: false,
    lastStand: false,
    mirrorShield: false,
    ghostGuard: false,
    phalanxId: 0,
    knightCapture: false,
    pawnZeal: false,
    panicTurn: false,
    promoteZone: false,
    succession: false,
    twinId: null,
    chameleonFrom: null,
    chameleonTurns: 0,
  };
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

export function removePiece(board, row, col) {
  board[row][col] = null;
}

export function movePiece(board, fromR, fromC, toR, toC) {
  const piece = board[fromR][fromC];
  board[fromR][fromC] = null;
  setPiece(board, toR, toC, piece);
  decrementSigilMoves(piece);
  return piece;
}

function isProtected(piece) {
  return piece && piece.shieldTurns > 0;
}

function isFrozen(piece) {
  return piece && piece.frozenTurns > 0;
}

function squareBlocked(state, r, c) {
  if (!inBounds(r, c)) return true;
  const key = sk(r, c);
  if (state?.meta?.collapsed?.has(key)) return true;
  const sq = state?.squares?.[key];
  if (sq?.obstacle) return true;
  if (sq?.ghostBlock > 0) return true;
  return false;
}

const KNIGHT_OFFSETS = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];

export function getKnightMoves(board, piece, state, canCapture = false) {
  const moves = [];
  for (const [dr, dc] of KNIGHT_OFFSETS) {
    const nr = piece.row + dr, nc = piece.col + dc;
    if (!inBounds(nr, nc) || !isDarkSquare(nr, nc) || squareBlocked(state, nr, nc)) continue;
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
    while (inBounds(r, c) && isDarkSquare(r, c) && !squareBlocked(state, r, c)) {
      if (board[r][c]) break;
      moves.push({ from: [piece.row, piece.col], to: [r, c], captures: [], type: "step" });
      r += dr; c += dc;
    }
  }
  return moves;
}

export function forwardDirs(piece, dominion = false) {
  if (hasKnightSigil(piece)) return [];
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
  if (isFrozen(piece) || piece.fortifyTurns > 0) return moves;
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
    if (!inBounds(nr, nc) || !isDarkSquare(nr, nc) || squareBlocked(state, nr, nc)) continue;
    if (!board[nr][nc]) {
      moves.push({ from: [piece.row, piece.col], to: [nr, nc], captures: [], type: "step" });
    } else if (piece.wraithTurns > 0) {
      /* pass through not implemented for landing */
    }
  }

  if (piece.superMan > 0) {
    for (const [dr, dc] of dirs) {
      const nr = piece.row + dr * 2, nc = piece.col + dc * 2;
      if (inBounds(nr, nc) && isDarkSquare(nr, nc) && !board[nr][nc] && !squareBlocked(state, nr, nc))
        moves.push({ from: [piece.row, piece.col], to: [nr, nc], captures: [], type: "step" });
    }
  }
  return moves;
}

export function getJumpMoves(board, piece, color, state = null) {
  const moves = [];
  if (isFrozen(piece) || piece.rooted > 0 || piece.fortifyTurns > 0) return moves;
  if (hasKnightSigil(piece) && !piece.knightCapture) return moves;
  if (hasKnightSigil(piece) && piece.knightCapture)
    return getKnightMoves(board, piece, state, true);

  let dirs;
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

  for (const [dr, dc] of dirs) {
    const mr = piece.row + dr, mc = piece.col + dc;
    const lr = piece.row + dr * 2, lc = piece.col + dc * 2;
    if (!inBounds(lr, lc) || !isDarkSquare(lr, lc) || squareBlocked(state, lr, lc)) continue;
    const mid = getPiece(board, mr, mc);
    if (!mid || mid.color === piece.color) continue;
    if (isProtected(mid)) continue;
    if (piece.stoneTurns > 0) continue;
    if (board[lr][lc]) continue;
    moves.push({ from: [piece.row, piece.col], to: [lr, lc], captures: [[mr, mc]], type: "jump" });
  }
  return moves;
}

export function getAllMovesForColor(board, color, state = null) {
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
  const piece = movePiece(board, fr, fc, tr, tc);
  for (const [cr, cc] of move.captures) {
    const cap = board[cr][cc];
    if (cap && state) {
      if (!state.captured[cap.color]) state.captured[cap.color] = [];
      state.captured[cap.color].push({ king: cap.king });
      if (cap.succession) {
        const mates = piecesOfColor(board, cap.color).filter((p) => !p.king);
        if (mates.length) mates[0].king = true;
      }
    }
    removePiece(board, cr, cc);
  }
  if (!piece.king && !piece.rusted) {
    if (piece.color === COLORS.RED && tr === 0) piece.king = true;
    if (piece.color === COLORS.BLACK && tr === SIZE - 1) piece.king = true;
  }
  const sq = state ? getSq(state, tr, tc) : null;
  if (sq?.sanctified === piece.color && !piece.king) piece.king = true;
  if (sq?.quicksand) { piece.frozenTurns = Math.max(piece.frozenTurns, 1); sq.quicksand = false; }
  if (sq?.mine && sq.mine !== piece.color) {
    removePiece(board, tr, tc);
    sq.mine = null;
  }
  if (piece.bombArmed) {
    piece.bombArmed = false;
    explodeBombAt(board, state, tr, tc);
    if (state) state.lastExplosion = [tr, tc];
    return null;
  }
  return piece;
}

export function countPieces(board, color) {
  let n = 0;
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) if (board[r][c]?.color === color) n++;
  return n;
}

export function tickEffects(board, color, state = null) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const p = board[r][c];
      if (!p || p.color !== color) continue;
      const dec = (k) => { if (p[k] > 0) p[k]--; };
      dec("shieldTurns"); dec("frozenTurns"); dec("retreatTurns");
      dec("queenTurns"); dec("wraithTurns");
      dec("stoneTurns"); dec("rooted"); dec("slowed"); dec("silenced"); dec("hexed");
      dec("anchored"); dec("fortifyTurns"); dec("superMan"); dec("chameleonTurns");
      if (p.venom > 0) {
        p.venom--;
        if (p.venom <= 0) removePiece(board, r, c);
      }
      if (p.panicTurn) { p.panicTurn = false; }
      if (p.pawnZeal) p.pawnZeal = false;
      if (p.promoteZone) p.promoteZone = false;
    }
  }
  if (state?.squares) {
    for (const k of Object.keys(state.squares)) {
      const sq = state.squares[k];
      if (sq.ghostBlock > 0) sq.ghostBlock--;
      if (sq.sanctuaryTurns > 0) { sq.sanctuaryTurns--; if (sq.sanctuaryTurns <= 0) delete sq.sanctuary; }
      if (sq.darkness > 0) sq.darkness--;
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
