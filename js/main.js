import {
  DRAW_COST,
  START_GEMS,
  HAND_MAX,
  CARDS,
  CARD_IDS,
  drawRandomCard,
  createCardInstance,
} from "./cards.js";
import {
  SIZE,
  COLORS,
  isDarkSquare,
  createInitialBoard,
  getAllMovesForColor,
  applyMove,
  countPieces,
  tickEffects,
  getBoltTarget,
  getAdjacentEmpty,
  getTeleportTargets,
  enemyPieces,
  piecesOfColor,
  movePiece,
  removePiece,
  getPiece,
} from "./board.js";
import { runAiTurn } from "./ai.js";

const PHASE = { CARDS: "cards", MOVE: "move" };

/** @type {ReturnType<typeof createGameState>} */
let state;
let cardPlay = null;
let selectedSquare = null;
let validTargets = [];
let validMoves = [];

function createGameState() {
  return {
    board: createInitialBoard(),
    gems: { red: START_GEMS, black: START_GEMS },
    hands: { red: [], black: [] },
    turn: COLORS.RED,
    phase: PHASE.CARDS,
    pendingDouble: { red: false, black: false },
    extraMovePieceId: null,
    gameOver: null,
  };
}

const $ = (id) => document.getElementById(id);

function setMessage(text) {
  $("message").textContent = text || "";
}

function updateGemsUI() {
  $("gems-red").textContent = String(state.gems.red);
  $("gems-black").textContent = String(state.gems.black);
}

function renderHand() {
  const handEl = $("hand-red");
  const countEl = $("hand-count");
  handEl.innerHTML = "";
  countEl.textContent = `${state.hands.red.length}/${HAND_MAX}`;

  for (const card of state.hands.red) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `card-mini ${card.rarity || "common"}`;
    btn.innerHTML = `<span class="card-name">${card.name}</span><span class="card-desc">${card.desc}</span>`;
    const canPlay = state.turn === COLORS.RED && state.phase === PHASE.CARDS && !state.gameOver;
    if (!canPlay) btn.classList.add("disabled");
    btn.addEventListener("click", () => {
      if (canPlay) startCardPlay(card);
    });
    handEl.appendChild(btn);
  }

  const oppHand = $("hand-black");
  oppHand.innerHTML = "";
  for (let i = 0; i < state.hands.black.length; i++) {
    const div = document.createElement("div");
    div.className = "card-mini";
    div.textContent = "?";
    oppHand.appendChild(div);
  }
}

function updateTurnBanner() {
  const banner = $("turn-banner");
  if (state.gameOver) {
    banner.textContent = "Game over";
    banner.className = "turn-banner";
    return;
  }
  if (state.turn === COLORS.RED) {
    banner.textContent =
      state.phase === PHASE.CARDS
        ? "Your turn — play cards or move"
        : "Select a piece to move";
    banner.className = "turn-banner";
  } else {
    banner.textContent = "Shadow Court is thinking…";
    banner.className = "turn-banner opponent-turn";
  }
}

function renderBoard() {
  const boardEl = $("board");
  boardEl.innerHTML = "";

  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const sq = document.createElement("button");
      sq.type = "button";
      sq.className = `square ${isDarkSquare(row, col) ? "dark" : "light"}`;
      sq.dataset.row = String(row);
      sq.dataset.col = String(col);
      sq.setAttribute("aria-label", `Square ${row + 1}, ${col + 1}`);

      const key = `${row},${col}`;
      if (selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col) {
        sq.classList.add("selected");
      }
      if (validTargets.some(([r, c]) => r === row && c === col)) {
        sq.classList.add("playable", "target");
      }
      const moveHere = validMoves.find((m) => m.to[0] === row && m.to[1] === col);
      if (moveHere) {
        sq.classList.add("playable");
        if (moveHere.captures?.length) sq.classList.add("capture-target");
        else sq.classList.add("target");
      }

      const piece = state.board[row][col];
      if (piece) {
        const el = document.createElement("span");
        el.className = `piece ${piece.color}${piece.king ? " king" : ""}`;
        if (piece.shieldTurns > 0) el.classList.add("shielded");
        if (piece.frozenTurns > 0) el.classList.add("frozen");
        if (piece.isKnight) el.classList.add("knight-mark");
        if (piece.retreatTurns > 0) el.classList.add("retreat-mark");
        sq.appendChild(el);
      }

      sq.addEventListener("click", () => onSquareClick(row, col));
      boardEl.appendChild(sq);
    }
  }
}

function refreshUI() {
  updateGemsUI();
  renderHand();
  updateTurnBanner();
  renderBoard();
  updateButtons();
}

function updateButtons() {
  const isHumanTurn = state.turn === COLORS.RED && !state.gameOver;
  $("btn-draw").disabled =
    !isHumanTurn ||
    state.phase !== PHASE.CARDS ||
    state.gems.red < DRAW_COST ||
    state.hands.red.length >= HAND_MAX;
  $("btn-end-cards").disabled = !isHumanTurn || state.phase !== PHASE.CARDS;
}

function startCardPlay(card) {
  if (card.id === CARD_IDS.GEM_CACHE) {
    state.gems.red += 20;
    removeCardFromHand(card);
    setMessage("Gem Cache: +20 gems!");
    refreshUI();
    return;
  }
  if (card.id === CARD_IDS.DOUBLE) {
    state.pendingDouble.red = true;
    removeCardFromHand(card);
    setMessage("Quick March armed — after your move, move again!");
    refreshUI();
    return;
  }

  cardPlay = { card, picks: [] };
  validTargets = [];
  validMoves = [];
  selectedSquare = null;

  $("modal-title").textContent = card.name;
  $("modal-desc").textContent = card.desc;
  $("modal-hint").textContent = getCardHint(card.id);
  $("card-modal").classList.remove("hidden");
  refreshUI();
}

function getCardHint(cardId) {
  const hints = {
    [CARD_IDS.NUDGE]: "Click your piece, then an adjacent empty square.",
    [CARD_IDS.AEGIS]: "Click one of your pieces to shield.",
    [CARD_IDS.BOLT]: "Click your piece to fire along its forward diagonal.",
    [CARD_IDS.FROST]: "Click an enemy piece to freeze.",
    [CARD_IDS.RETREAT]: "Click one of your pieces.",
    [CARD_IDS.KNIGHT]: "Click one of your pieces to transform.",
    [CARD_IDS.CROWN]: "Click one of your pieces to crown.",
    [CARD_IDS.SWAP]: "Click two of your pieces to swap.",
    [CARD_IDS.SHATTER]: "Click an enemy piece (not shielded).",
    [CARD_IDS.TELEPORT]: "Click your piece, then destination within 2 squares.",
  };
  return hints[cardId] || "Click valid squares.";
}

function cancelCardPlay() {
  cardPlay = null;
  validTargets = [];
  selectedSquare = null;
  $("card-modal").classList.add("hidden");
  refreshUI();
}

function removeCardFromHand(card) {
  const hand = state.hands.red;
  const i = hand.findIndex((c) => c.instanceId === card.instanceId);
  if (i >= 0) hand.splice(i, 1);
}

function finishCardPlay() {
  removeCardFromHand(cardPlay.card);
  cardPlay = null;
  validTargets = [];
  selectedSquare = null;
  $("card-modal").classList.add("hidden");
  setMessage("Card played.");
  refreshUI();
}

function resolveCardTargets(row, col) {
  const { card, picks } = cardPlay;
  const board = state.board;
  const piece = board[row][col];

  switch (card.id) {
    case CARD_IDS.AEGIS:
    case CARD_IDS.RETREAT:
    case CARD_IDS.KNIGHT:
    case CARD_IDS.CROWN: {
      if (!piece || piece.color !== COLORS.RED) return false;
      if (card.id === CARD_IDS.AEGIS) piece.shieldTurns = 2;
      if (card.id === CARD_IDS.RETREAT) piece.retreatTurns = 3;
      if (card.id === CARD_IDS.KNIGHT) piece.isKnight = true;
      if (card.id === CARD_IDS.CROWN) piece.king = true;
      finishCardPlay();
      return true;
    }

    case CARD_IDS.FROST:
    case CARD_IDS.SHATTER: {
      if (!piece || piece.color !== COLORS.BLACK) return false;
      if (card.id === CARD_IDS.SHATTER && piece.shieldTurns > 0) {
        setMessage("That piece is shielded!");
        return false;
      }
      if (card.id === CARD_IDS.FROST) piece.frozenTurns = 1;
      else removePiece(board, row, col);
      finishCardPlay();
      return true;
    }

    case CARD_IDS.BOLT: {
      if (!piece || piece.color !== COLORS.RED) return false;
      const targets = getBoltTarget(board, piece);
      validTargets = targets;
      selectedSquare = [row, col];
      if (targets.length === 0) {
        setMessage("No enemy in line ahead.");
        return false;
      }
      if (targets.length === 1) {
        removePiece(board, targets[0][0], targets[0][1]);
        finishCardPlay();
        return true;
      }
      setMessage("Choose which diagonal to strike.");
      refreshUI();
      return true;
    }

    case CARD_IDS.NUDGE:
    case CARD_IDS.TELEPORT: {
      if (picks.length === 0) {
        if (!piece || piece.color !== COLORS.RED) return false;
        cardPlay.picks.push([row, col]);
        validTargets =
          card.id === CARD_IDS.NUDGE
            ? getAdjacentEmpty(board, piece)
            : getTeleportTargets(board, piece);
        selectedSquare = [row, col];
        if (validTargets.length === 0) {
          setMessage("No valid destination.");
          cardPlay.picks = [];
          return false;
        }
        refreshUI();
        return true;
      }
      const [pr, pc] = picks[0];
      const p = board[pr][pc];
      if (!validTargets.some(([r, c]) => r === row && c === col)) return false;
      movePiece(board, pr, pc, row, col);
      finishCardPlay();
      return true;
    }

    case CARD_IDS.SWAP: {
      if (!piece || piece.color !== COLORS.RED) return false;
      if (picks.length === 0) {
        picks.push([row, col]);
        validTargets = piecesOfColor(board, COLORS.RED)
          .filter((p) => p.row !== row || p.col !== col)
          .map((p) => [p.row, p.col]);
        refreshUI();
        return true;
      }
      const [r1, c1] = picks[0];
      const a = board[r1][c1];
      const b = board[row][col];
      if (!a || !b) return false;
      board[r1][c1] = b;
      board[row][col] = a;
      a.row = row;
      a.col = col;
      b.row = r1;
      b.col = c1;
      finishCardPlay();
      return true;
    }

    default:
      return false;
  }
}

function onBoltSecondClick(row, col) {
  if (!validTargets.some(([r, c]) => r === row && c === col)) return;
  removePiece(state.board, row, col);
  finishCardPlay();
}

function onSquareClick(row, col) {
  if (state.gameOver || state.turn !== COLORS.RED) return;

  if (cardPlay) {
    if (cardPlay.card.id === CARD_IDS.BOLT && cardPlay.picks.length === 0 && validTargets.length > 0) {
      onBoltSecondClick(row, col);
      return;
    }
    resolveCardTargets(row, col);
    return;
  }

  if (state.phase !== PHASE.MOVE) return;

  const moves = validMoves;
  const clickedMove = moves.find((m) => m.to[0] === row && m.to[1] === col);

  if (clickedMove) {
    executeHumanMove(clickedMove);
    return;
  }

  const piece = state.board[row][col];
  if (piece && piece.color === COLORS.RED) {
    selectedSquare = [row, col];
    const all = getAllMovesForColor(state.board, COLORS.RED);
    validMoves = all.filter((m) => m.from[0] === row && m.from[1] === col);
    if (validMoves.length === 0) {
      setMessage("This piece cannot move.");
      selectedSquare = null;
    } else {
      setMessage(validMoves.some((m) => m.captures?.length) ? "Jump to capture!" : "Choose destination.");
    }
    refreshUI();
    return;
  }

  selectedSquare = null;
  validMoves = [];
  refreshUI();
}

function continueMultiJump(fromR, fromC) {
  const jumps = getAllMovesForColor(state.board, COLORS.RED).filter(
    (m) =>
      m.type === "jump" &&
      m.from[0] === fromR &&
      m.from[1] === fromC &&
      m.captures?.length
  );
  if (jumps.length === 0) return false;
  validMoves = jumps;
  selectedSquare = [fromR, fromC];
  state.phase = PHASE.MOVE;
  setMessage("Continue jumping with the same piece!");
  refreshUI();
  return true;
}

function executeHumanMove(move) {
  applyMove(state.board, move);
  const landR = move.to[0];
  const landC = move.to[1];

  if (move.captures?.length && continueMultiJump(landR, landC)) {
    return;
  }

  selectedSquare = null;
  validMoves = [];

  let extra = false;
  if (state.pendingDouble.red && move.type === "step") {
    state.pendingDouble.red = false;
    const piece = state.board[landR][landC];
    if (piece) {
      const extras = getAllMovesForColor(state.board, COLORS.RED).filter(
        (m) => m.from[0] === landR && m.from[1] === landC && m.type === "step"
      );
      if (extras.length) {
        state.phase = PHASE.MOVE;
        validMoves = extras;
        selectedSquare = [landR, landC];
        setMessage("Quick March — move again!");
        extra = true;
        refreshUI();
      }
    }
  }

  if (!extra) {
    endHumanTurn();
  }
}

function endHumanTurn() {
  if (checkWin()) return;
  tickEffects(state.board, COLORS.RED);
  state.turn = COLORS.BLACK;
  state.phase = PHASE.CARDS;
  refreshUI();
  setTimeout(runOpponentTurn, 600);
}

function checkWin() {
  const redLeft = countPieces(state.board, COLORS.RED);
  const blackLeft = countPieces(state.board, COLORS.BLACK);
  const redMoves = getAllMovesForColor(state.board, COLORS.RED);
  const blackMoves = getAllMovesForColor(state.board, COLORS.BLACK);

  if (redLeft === 0 || (state.turn === COLORS.RED && state.phase === PHASE.MOVE && redMoves.length === 0 && !cardPlay)) {
    // only check red stuck on move phase
  }

  if (blackLeft === 0) {
    showGameOver("Victory!", "You captured all enemy pieces.");
    return true;
  }
  if (redLeft === 0) {
    showGameOver("Defeat", "The Shadow Court wiped your forces.");
    return true;
  }
  if (state.turn === COLORS.BLACK && blackMoves.length === 0 && blackLeft > 0) {
    showGameOver("Victory!", "Shadow Court has no legal moves.");
    return true;
  }
  return false;
}

function showGameOver(title, text) {
  state.gameOver = title;
  $("game-over-title").textContent = title;
  $("game-over-text").textContent = text;
  $("game-over").classList.remove("hidden");
  refreshUI();
}

function runOpponentTurn() {
  if (state.gameOver) return;
  runAiTurn(state, setMessage);
  tickEffects(state.board, COLORS.BLACK);

  if (countPieces(state.board, COLORS.RED) === 0) {
    showGameOver("Defeat", "The Shadow Court destroyed your army.");
    return;
  }
  if (countPieces(state.board, COLORS.BLACK) === 0) {
    showGameOver("Victory!", "The Shadow Court falls!");
    return;
  }

  const blackMoves = getAllMovesForColor(state.board, COLORS.BLACK);
  if (blackMoves.length === 0) {
    showGameOver("Victory!", "Shadow Court is trapped with no moves.");
    return;
  }

  state.turn = COLORS.RED;
  state.phase = PHASE.CARDS;
  setMessage("Your turn.");
  refreshUI();
}

function beginMovePhase() {
  if (state.gameOver || state.turn !== COLORS.RED) return;
  cancelCardPlay();
  state.phase = PHASE.MOVE;
  selectedSquare = null;
  validMoves = [];
  const moves = getAllMovesForColor(state.board, COLORS.RED);
  if (moves.length === 0) {
    setMessage("No moves available — turn passes.");
    endHumanTurn();
    return;
  }
  setMessage("Select a piece to move.");
  refreshUI();
}

function drawCard() {
  if (state.turn !== COLORS.RED || state.phase !== PHASE.CARDS) return;
  if (state.gems.red < DRAW_COST) {
    setMessage("Not enough gems.");
    return;
  }
  if (state.hands.red.length >= HAND_MAX) {
    setMessage("Hand is full.");
    return;
  }
  state.gems.red -= DRAW_COST;
  const card = createCardInstance(drawRandomCard());
  state.hands.red.push(card);
  setMessage(`Drew: ${card.name}`);
  refreshUI();
}

function init() {
  state = createGameState();
  cardPlay = null;
  selectedSquare = null;
  validTargets = [];
  validMoves = [];
  $("game-over").classList.add("hidden");

  $("btn-draw").addEventListener("click", drawCard);
  $("btn-end-cards").addEventListener("click", beginMovePhase);
  $("btn-cancel-card").addEventListener("click", cancelCardPlay);
  $("btn-restart").addEventListener("click", () => {
    init();
    setMessage("New game — you have 100 gems. Draw cards for 10 gems each!");
    refreshUI();
  });

  setMessage("Welcome! You start with 100 gems. Draw spell cards for 10 gems.");
  refreshUI();
}

init();
