import { DRAW_COST, START_GEMS, createCardInstance, drawRandomCard } from "./cards.js";
import {
  SIZE,
  COLORS,
  isDarkSquare,
  createInitialBoard,
  getAllMovesForColor,
  applyMove,
  countPieces,
  tickEffects,
} from "./board.js";
import { createMatchMeta, handLimit, drawCostFor, consumeFreeDraw, startTurnMeta, tickMeta } from "./gameMeta.js";
import {
  initCardState,
  isInstant,
  getCardHint,
  getValidTargets,
  playInstant,
  applyCard,
} from "./cardEffects.js";
import { runAiTurn } from "./ai.js";

const PHASE = { CARDS: "cards", MOVE: "move" };

let state;
let cardPlay = null;
let selectedSquare = null;
let validTargets = [];
let validMoves = [];

const $ = (id) => document.getElementById(id);

function createGameState() {
  return {
    board: createInitialBoard(),
    gems: { [COLORS.RED]: START_GEMS, [COLORS.BLACK]: START_GEMS },
    hands: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    turn: COLORS.RED,
    phase: PHASE.CARDS,
    meta: createMatchMeta(),
    squares: {},
    captured: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    gameOver: null,
  };
}

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
  const max = handLimit(state, COLORS.RED);
  handEl.innerHTML = "";
  countEl.textContent = `${state.hands.red.length}/${max}`;

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

  $("hand-black").innerHTML = "";
  for (let i = 0; i < state.hands.black.length; i++) {
    const div = document.createElement("div");
    div.className = "card-mini";
    div.textContent = "?";
    $("hand-black").appendChild(div);
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
      state.phase === PHASE.CARDS ? "Your turn — play cards or move" : "Select a piece to move";
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
      const key = `${row},${col}`;
      const terrain = state.squares[key];
      let cls = `square ${isDarkSquare(row, col) ? "dark" : "light"}`;
      if (terrain?.mine) cls += " has-mine";
      if (terrain?.quicksand) cls += " has-quicksand";
      sq.className = cls;
      sq.dataset.row = String(row);
      sq.dataset.col = String(col);

      if (selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col) sq.classList.add("selected");
      if (validTargets.some(([r, c]) => r === row && c === col)) sq.classList.add("playable", "target");
      const moveHere = validMoves.find((m) => m.to[0] === row && m.to[1] === col);
      if (moveHere) {
        sq.classList.add("playable");
        sq.classList.add(moveHere.captures?.length ? "capture-target" : "target");
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
  const isHuman = state.turn === COLORS.RED && !state.gameOver;
  const max = handLimit(state, COLORS.RED);
  const cost = drawCostFor(state, COLORS.RED, DRAW_COST);
  $("btn-draw").disabled =
    !isHuman || state.phase !== PHASE.CARDS || state.gems.red < cost || state.hands.red.length >= max;
  $("btn-end-cards").disabled = !isHuman || state.phase !== PHASE.CARDS;
}

function removeCardFromHand(card) {
  const hand = state.hands.red;
  const i = hand.findIndex((c) => c.instanceId === card.instanceId);
  if (i >= 0) hand.splice(i, 1);
}

function finishCardPlay(msg) {
  if (cardPlay?.card) removeCardFromHand(cardPlay.card);
  cardPlay = null;
  validTargets = [];
  selectedSquare = null;
  $("card-modal").classList.add("hidden");
  setMessage(msg || "Card played.");
  state.meta.cardsLeft.red = Math.max(0, (state.meta.cardsLeft.red || 1) - 1);
  refreshUI();
}

function cancelCardPlay() {
  cardPlay = null;
  validTargets = [];
  selectedSquare = null;
  $("card-modal").classList.add("hidden");
  refreshUI();
}

function startCardPlay(card) {
  if ((state.meta.cardsLeft.red || 0) <= 0 && !isInstant(card)) {
    setMessage("Play your other card first, or end card phase.");
    return;
  }

  if (isInstant(card)) {
    if (card.effect === "recycle") {
      setMessage("Click a card in your hand to discard for Recycle.");
      cardPlay = { card, picks: [], recycleMode: true };
      return;
    }
    const res = playInstant(state, COLORS.RED, card);
    if (!res.success) {
      setMessage(res.message);
      return;
    }
    removeCardFromHand(card);
    setMessage(res.message);
    state.meta.cardsLeft.red = Math.max(0, (state.meta.cardsLeft.red || 1) - 1);
    refreshUI();
    return;
  }

  cardPlay = { card, picks: [] };
  validTargets = getValidTargets(state, COLORS.RED, card, []);
  selectedSquare = null;
  $("modal-title").textContent = card.name;
  $("modal-desc").textContent = card.desc;
  $("modal-hint").textContent = getCardHint(card);
  $("card-modal").classList.remove("hidden");
  refreshUI();
}

function onCardTargetClick(row, col) {
  if (!cardPlay) return;

  if (cardPlay.recycleMode) return;

  const { card, picks } = cardPlay;
  const allowed = getValidTargets(state, COLORS.RED, card, picks);
  if (!allowed.some(([r, c]) => r === row && c === col)) {
    setMessage("Invalid target.");
    return;
  }

  picks.push([row, col]);
  const need = { f_empty: 2, f_f: 2, f_e: 2, f_e_adj: 2, e_empty: 2, e_e_adj: 2, f_f_adj: 2, diagonal: 2, any_piece: 2, empty_empty: 2 }[card.mode] || 1;

  if (picks.length < need) {
    validTargets = getValidTargets(state, COLORS.RED, card, picks);
    selectedSquare = picks[picks.length - 1];
    $("modal-hint").textContent = getCardHint(card) + ` (${picks.length}/${need})`;
    refreshUI();
    return;
  }

  const res = applyCard(state, COLORS.RED, card, picks);
  if (!res.success) {
    picks.pop();
    setMessage(res.message);
    validTargets = getValidTargets(state, COLORS.RED, card, picks);
    refreshUI();
    return;
  }
  finishCardPlay(res.message);
}

function onSquareClick(row, col) {
  if (state.gameOver || state.turn !== COLORS.RED) return;

  if (cardPlay) {
    onCardTargetClick(row, col);
    return;
  }

  if (state.phase !== PHASE.MOVE) return;

  const clickedMove = validMoves.find((m) => m.to[0] === row && m.to[1] === col);
  if (clickedMove) {
    executeHumanMove(clickedMove);
    return;
  }

  const piece = state.board[row][col];
  if (piece && piece.color === COLORS.RED) {
    selectedSquare = [row, col];
    validMoves = getAllMovesForColor(state.board, COLORS.RED, state).filter(
      (m) => m.from[0] === row && m.from[1] === col
    );
    setMessage(
      validMoves.length
        ? validMoves.some((m) => m.captures?.length)
          ? "Jump to capture!"
          : "Choose destination."
        : "This piece cannot move."
    );
    if (!validMoves.length) selectedSquare = null;
    refreshUI();
    return;
  }

  selectedSquare = null;
  validMoves = [];
  refreshUI();
}

function continueMultiJump(fromR, fromC) {
  const jumps = getAllMovesForColor(state.board, COLORS.RED, state).filter(
    (m) => m.type === "jump" && m.from[0] === fromR && m.from[1] === fromC && m.captures?.length
  );
  if (!jumps.length) return false;
  validMoves = jumps;
  selectedSquare = [fromR, fromC];
  setMessage("Continue jumping!");
  refreshUI();
  return true;
}

function executeHumanMove(move) {
  state.meta.lastMove.red = move;
  applyMove(state.board, move, state);
  const landR = move.to[0],
    landC = move.to[1];

  if (move.captures?.length && continueMultiJump(landR, landC)) return;

  selectedSquare = null;
  validMoves = [];

  if (state.meta.pendingDouble.red && move.type === "step") {
    state.meta.pendingDouble.red = false;
    const extras = getAllMovesForColor(state.board, COLORS.RED, state).filter(
      (m) => m.from[0] === landR && m.from[1] === landC && m.type === "step"
    );
    if (extras.length) {
      validMoves = extras;
      selectedSquare = [landR, landC];
      setMessage("Quick March — move again!");
      refreshUI();
      return;
    }
  }

  endHumanTurn();
}

function endHumanTurn() {
  if (checkWin()) return;
  tickEffects(state.board, COLORS.RED, state);
  tickMeta(state, COLORS.RED);
  state.turn = COLORS.BLACK;
  state.phase = PHASE.CARDS;
  startTurnMeta(state, COLORS.BLACK);
  refreshUI();
  setTimeout(runOpponentTurn, 500);
}

function checkWin() {
  if (countPieces(state.board, COLORS.BLACK) === 0) {
    showGameOver("Victory!", "You captured all enemy pieces.");
    return true;
  }
  if (countPieces(state.board, COLORS.RED) === 0) {
    showGameOver("Defeat", "The Shadow Court wiped your forces.");
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
  tickEffects(state.board, COLORS.BLACK, state);
  tickMeta(state, COLORS.BLACK);

  if (countPieces(state.board, COLORS.RED) === 0) {
    showGameOver("Defeat", "The Shadow Court destroyed your army.");
    return;
  }
  if (countPieces(state.board, COLORS.BLACK) === 0) {
    showGameOver("Victory!", "The Shadow Court falls!");
    return;
  }

  state.turn = COLORS.RED;
  state.phase = PHASE.CARDS;
  startTurnMeta(state, COLORS.RED);
  state.meta.cardsLeft.red = state.meta.parallelExtra?.red ? 2 : 1;
  setMessage("Your turn.");
  refreshUI();
}

function beginMovePhase() {
  if (state.gameOver || state.turn !== COLORS.RED) return;
  cancelCardPlay();
  state.phase = PHASE.MOVE;
  const moves = getAllMovesForColor(state.board, COLORS.RED, state);
  if (!moves.length) {
    setMessage("No moves — turn passes.");
    endHumanTurn();
    return;
  }
  setMessage("Select a piece to move.");
  refreshUI();
}

function drawCard() {
  if (state.turn !== COLORS.RED || state.phase !== PHASE.CARDS) return;
  const max = handLimit(state, COLORS.RED);
  const cost = drawCostFor(state, COLORS.RED, DRAW_COST);
  const free = consumeFreeDraw(state, COLORS.RED);
  if (!free && state.gems.red < cost) {
    setMessage("Not enough gems.");
    return;
  }
  if (!free) state.gems.red -= cost;
  if (state.hands.red.length >= max) {
    setMessage("Hand is full.");
    return;
  }
  const card = createCardInstance(drawRandomCard());
  state.hands.red.push(card);
  state.meta.drawDiscount.red = 0;
  setMessage(`Drew: ${card.name}`);
  refreshUI();
}

function init() {
  state = createGameState();
  initCardState(state);
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
    setMessage("New game — 135 spells in the deck! Draw cards for 10 gems.");
    refreshUI();
  });

  setMessage("135 spell cards available. Draw for 10 gems each.");
  refreshUI();
}

init();
