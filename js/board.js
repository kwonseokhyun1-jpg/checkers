/** Checkers board logic with card-effect modifiers */

export const SIZE = 8;
export const COLORS = { RED: "red", BLACK: "black" };

let nextPieceId = 1;

export function isDarkSquare(row, col) {
  return (row + col) % 2 === 1;
}

export function inBounds(row, col) {
  return row >= 0 && row < SIZE && col >= 0 && col < SIZE;
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
  };
}

export function clonePiece(p) {
  return { ...p };
}

/** @returns {(import('./board.js').Piece | null)[][]} */
export function createInitialBoard() {
  nextPieceId = 1;
  const board = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));

  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (!isDarkSquare(row, col)) continue;
      if (row < 3) {
        board[row][col] = createPiece(COLORS.BLACK, row, col);
      } else if (row > 4) {
        board[row][col] = createPiece(COLORS.RED, row, col);
      }
    }
  }
  return board;
}

export function getPiece(board, row, col) {
  if (!inBounds(row, col)) return null;
  return board[row][col];
}

export function setPiece(board, row, col, piece) {
  if (piece) {
    piece.row = row;
    piece.col = col;
  }
  board[row][col] = piece;
}

export function removePiece(board, row, col) {
  board[row][col] = null;
}

export function movePiece(board, fromR, fromC, toR, toC) {
  const piece = board[fromR][fromC];
  board[fromR][fromC] = null;
  setPiece(board, toR, toC, piece);
  return piece;
}

export function forwardDirs(color, king, retreatTurns, isKnight) {
  if (isKnight) return [];
  const dirs = [];
  if (color === COLORS.RED) {
    dirs.push([-1, -1], [-1, 1]);
    if (king || retreatTurns > 0) dirs.push([1, -1], [1, 1]);
  } else {
    dirs.push([1, -1], [1, 1]);
    if (king || retreatTurns > 0) dirs.push([-1, -1], [-1, 1]);
  }
  return dirs;
}

const KNIGHT_OFFSETS = [
  [-2, -1], [-2, 1], [-1, -2], [-1, 2],
  [1, -2], [1, 2], [2, -1], [2, 1],
];

function isProtected(piece) {
  return piece && piece.shieldTurns > 0;
}

function isFrozen(piece) {
  return piece && piece.frozenTurns > 0;
}

export function getKnightMoves(board, piece) {
  const moves = [];
  for (const [dr, dc] of KNIGHT_OFFSETS) {
    const nr = piece.row + dr;
    const nc = piece.col + dc;
    if (!inBounds(nr, nc) || !isDarkSquare(nr, nc)) continue;
    if (!board[nr][nc]) {
      moves.push({
        from: [piece.row, piece.col],
        to: [nr, nc],
        captures: [],
        type: "step",
      });
    }
  }
  return moves;
}

export function getStepMoves(board, piece, color) {
  const moves = [];
  if (isFrozen(piece)) return moves;

  if (piece.isKnight) {
    return getKnightMoves(board, piece);
  }

  const dirs = forwardDirs(piece.color, piece.king, piece.retreatTurns, false);
  for (const [dr, dc] of dirs) {
    const nr = piece.row + dr;
    const nc = piece.col + dc;
    if (!inBounds(nr, nc) || !isDarkSquare(nr, nc)) continue;
    if (!board[nr][nc]) {
      moves.push({
        from: [piece.row, piece.col],
        to: [nr, nc],
        captures: [],
        type: "step",
      });
    }
  }
  return moves;
}

export function getJumpMoves(board, piece, color) {
  const moves = [];
  if (isFrozen(piece) || piece.isKnight) return moves;

  let dirs;
  if (piece.king) {
    dirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  } else if (piece.color === COLORS.RED) {
    dirs = [[-1, -1], [-1, 1]];
    if (piece.retreatTurns > 0) dirs.push([1, -1], [1, 1]);
  } else {
    dirs = [[1, -1], [1, 1]];
    if (piece.retreatTurns > 0) dirs.push([-1, -1], [-1, 1]);
  }

  for (const [dr, dc] of dirs) {
    const mr = piece.row + dr;
    const mc = piece.col + dc;
    const lr = piece.row + dr * 2;
    const lc = piece.col + dc * 2;
    if (!inBounds(lr, lc) || !isDarkSquare(lr, lc)) continue;
    const mid = getPiece(board, mr, mc);
    if (!mid || mid.color === piece.color) continue;
    if (isProtected(mid)) continue;
    if (board[lr][lc]) continue;
    moves.push({
      from: [piece.row, piece.col],
      to: [lr, lc],
      captures: [[mr, mc]],
      type: "jump",
    });
  }
  return moves;
}

export function getAllMovesForColor(board, color) {
  const jumps = [];
  const steps = [];

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const piece = board[r][c];
      if (!piece || piece.color !== color) continue;
      const j = getJumpMoves(board, piece, color);
      const s = getStepMoves(board, piece, color);
      jumps.push(...j);
      steps.push(...s);
    }
  }

  if (jumps.length > 0) return jumps;
  return steps;
}

export function applyMove(board, move) {
  const [fr, fc] = move.from;
  const [tr, tc] = move.to;
  const piece = movePiece(board, fr, fc, tr, tc);

  for (const [cr, cc] of move.captures) {
    removePiece(board, cr, cc);
  }

  if (!piece.king) {
    if (piece.color === COLORS.RED && tr === 0) piece.king = true;
    if (piece.color === COLORS.BLACK && tr === SIZE - 1) piece.king = true;
  }

  return piece;
}

export function countPieces(board, color) {
  let n = 0;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c]?.color === color) n++;
    }
  }
  return n;
}

export function tickEffects(board, color) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const p = board[r][c];
      if (!p || p.color !== color) continue;
      if (p.shieldTurns > 0) p.shieldTurns--;
      if (p.frozenTurns > 0) p.frozenTurns--;
      if (p.retreatTurns > 0) p.retreatTurns--;
    }
  }
}

/** Forward bolt: first enemy along forward diagonal from piece */
export function getBoltTarget(board, piece) {
  const dir = piece.color === COLORS.RED ? -1 : 1;
  const diagonals = [[dir, -1], [dir, 1]];
  const targets = [];

  for (const [dr, dc] of diagonals) {
    let r = piece.row + dr;
    let c = piece.col + dc;
    while (inBounds(r, c) && isDarkSquare(r, c)) {
      const cell = board[r][c];
      if (cell) {
        if (cell.color !== piece.color && !isProtected(cell)) {
          targets.push([r, c]);
        }
        break;
      }
      r += dr;
      c += dc;
    }
  }
  return targets;
}

export function getAdjacentEmpty(board, piece) {
  const spots = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = piece.row + dr;
      const nc = piece.col + dc;
      if (!inBounds(nr, nc) || !isDarkSquare(nr, nc)) continue;
      if (!board[nr][nc]) spots.push([nr, nc]);
    }
  }
  return spots;
}

export function getTeleportTargets(board, piece) {
  const spots = [];
  for (let dr = -2; dr <= 2; dr++) {
    for (let dc = -2; dc <= 2; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = piece.row + dr;
      const nc = piece.col + dc;
      if (!inBounds(nr, nc) || !isDarkSquare(nr, nc)) continue;
      if (!board[nr][nc]) spots.push([nr, nc]);
    }
  }
  return spots;
}

export function piecesOfColor(board, color) {
  const list = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const p = board[r][c];
      if (p && p.color === color) list.push(p);
    }
  }
  return list;
}

export function enemyPieces(board, color) {
  const opp = color === COLORS.RED ? COLORS.BLACK : COLORS.RED;
  return piecesOfColor(board, opp);
}
