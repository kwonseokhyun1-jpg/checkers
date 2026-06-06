import { squareName } from "./board.js";

/** Strip synced history list from a stored snapshot (re-attached when viewing). */
export function captureStateSnapshot(state) {
  const hook = state.meta?.achievementHook;
  if (hook) state.meta.achievementHook = null;
  let snap;
  try {
    snap = structuredClone(state);
  } catch {
    snap = JSON.parse(JSON.stringify(state));
  } finally {
    if (hook) state.meta.achievementHook = hook;
  }
  delete snap.moveHistory;
  if (snap.meta) delete snap.meta.achievementHook;
  return snap;
}

/** State used for board/hand rendering while scrubbing PvP history. */
export function buildViewState(liveState, viewIndex) {
  if (viewIndex == null || viewIndex < 0) return liveState;
  const history = liveState.moveHistory;
  if (!history?.length || viewIndex >= history.length) return liveState;
  const entry = history[viewIndex];
  if (!entry?.snapshot) return liveState;
  const view = structuredClone(entry.snapshot);
  view.moveHistory = history;
  return view;
}

function pieceLetter(piece) {
  if (!piece) return "";
  if (piece.king) return "K";
  if (piece.knightTurns > 0 || piece.isKnight) return "N";
  if (piece.rookTurns > 0) return "R";
  if (piece.bishopTurns > 0) return "B";
  return "";
}

/** Short chess-style label for a piece move (e.g. Nxf3, e4). */
export function formatPieceMoveLabel(board, move) {
  const piece = board[move.from[0]]?.[move.from[1]];
  const dest = squareName(move.to[0], move.to[1]);
  const letter = pieceLetter(piece);
  const cap = move.captures?.length ? "x" : "";
  if (letter) return `${letter}${cap}${dest}`;
  const from = squareName(move.from[0], move.from[1]);
  return cap ? `${from}x${dest}` : `${from}-${dest}`;
}

export function ensureMoveHistory(state) {
  if (!state.moveHistory) state.moveHistory = [];
  return state.moveHistory;
}

export function appendHistoryEntry(state, entry) {
  const history = ensureMoveHistory(state);
  history.push({
    ...entry,
    snapshot: captureStateSnapshot(state),
  });
  return history.length - 1;
}

export function ensureStartHistory(state) {
  const history = ensureMoveHistory(state);
  if (history.length) return history;
  history.push({ type: "start", label: "Start", snapshot: captureStateSnapshot(state) });
  return history;
}

/** Full-move number prefix for red/black pairs (1. e4 e5). */
export function formatHistoryChipLabel(entry, index) {
  if (entry.type === "start") return entry.label;
  const ply = index;
  const moveNum = Math.ceil(ply / 2);
  if (entry.color === "red") return `${moveNum}. ${entry.label}`;
  return entry.label;
}

export function highlightForHistoryEntry(entry) {
  if (entry.type === "move" && entry.from && entry.to) {
    return { from: entry.from, to: entry.to, captures: entry.captures || [] };
  }
  if (entry.type === "spell" && entry.picks?.length) {
    const [r, c] = entry.picks[0];
    return {
      from: [r, c],
      to: entry.picks.length > 1 ? entry.picks[1] : [r, c],
      captures: [],
    };
  }
  return null;
}
