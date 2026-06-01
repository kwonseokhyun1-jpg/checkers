/**
 * In-match controller: 30-card deck, 3 start hand, max 5, 1 spell/turn, draw every 2 turns
 */
import { createCardInstance } from "./cards.js";
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
import { createMatchMeta, startTurnMeta, tickMeta } from "./gameMeta.js";
import {
  initCardState,
  isInstant,
  getCardHint,
  getValidTargets,
  playInstant,
  applyCard,
} from "./cardEffects.js";
import { runAiTurn } from "./ai.js";
import { MAX_HAND, DRAW_EVERY_TURNS, START_HAND } from "./cardCatalog.js";
import { renderSpellCardEl } from "./cardArt.js";
import { initDeckPiles, drawToHand, pileRemaining } from "./deckPile.js";
import { buildAiDeck } from "./deckRules.js";

export const PHASE = { CARDS: "cards", MOVE: "move" };

export function createMatchState(playerDeckIds, aiDeckIds = null) {
  const state = {
    board: createInitialBoard(),
    hands: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    turn: COLORS.RED,
    phase: PHASE.CARDS,
    meta: createMatchMeta(),
    squares: {},
    captured: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    gameOver: null,
    turnNumber: { [COLORS.RED]: 0, [COLORS.BLACK]: 0 },
    spellPlayed: { [COLORS.RED]: false, [COLORS.BLACK]: false },
  };
  initCardState(state);
  initDeckPiles(state, playerDeckIds, aiDeckIds || buildAiDeck());
  drawToHand(state, COLORS.RED, START_HAND);
  drawToHand(state, COLORS.BLACK, START_HAND);
  return state;
}

export class MatchSession {
  constructor(deckCardIds, rootEl, onExit, onWin) {
    this.state = createMatchState(deckCardIds);
    this.root = rootEl;
    this.onExit = onExit;
    this.onWin = onWin;
    this.winRewarded = false;
    this.cardPlay = null;
    this.selectedSquare = null;
    this.validTargets = [];
    this.validMoves = [];
    this.bindEls();
    this.beginPlayerTurn();
    this.render();
  }

  $(id) {
    return this.root.querySelector(`#${id}`);
  }

  bindEls() {
    this.root.querySelector("#btn-end-cards")?.addEventListener("click", () => this.beginMovePhase());
    this.root.querySelector("#btn-cancel-card")?.addEventListener("click", () => this.cancelCardPlay());
    this.root.querySelector("#btn-leave-match")?.addEventListener("click", () => this.onExit?.());
    this.root.querySelector("#btn-restart-match")?.addEventListener("click", () => this.onExit?.());
  }

  setMessage(text) {
    const el = this.$("message");
    if (el) el.textContent = text || "";
  }

  beginPlayerTurn() {
    const s = this.state;
    s.turnNumber.red++;
    s.spellPlayed.red = false;
    s.phase = PHASE.CARDS;
    if (s.turnNumber.red > 1 && s.turnNumber.red % DRAW_EVERY_TURNS === 0) {
      const n = drawToHand(s, COLORS.RED, 1);
      if (n) this.setMessage("Drew a card from your deck.");
    }
    startTurnMeta(s, COLORS.RED);
  }

  beginAiTurn() {
    const s = this.state;
    s.turnNumber.black++;
    s.spellPlayed.black = false;
    if (s.turnNumber.black > 1 && s.turnNumber.black % DRAW_EVERY_TURNS === 0) {
      drawToHand(s, COLORS.BLACK, 1);
    }
    startTurnMeta(s, COLORS.BLACK);
  }

  removeCardFromHand(card) {
    const hand = this.state.hands.red;
    const i = hand.findIndex((c) => c.instanceId === card.instanceId);
    if (i >= 0) hand.splice(i, 1);
  }

  finishCardPlay(msg) {
    if (this.cardPlay?.card) this.removeCardFromHand(this.cardPlay.card);
    this.state.spellPlayed.red = true;
    this.cardPlay = null;
    this.validTargets = [];
    this.selectedSquare = null;
    this.root.querySelector("#card-modal")?.classList.add("hidden");
    this.setMessage(msg || "Spell played (1 per turn).");
    this.render();
  }

  cancelCardPlay() {
    this.cardPlay = null;
    this.validTargets = [];
    this.selectedSquare = null;
    this.root.querySelector("#card-modal")?.classList.add("hidden");
    this.render();
  }

  startCardPlay(card) {
    if (this.state.spellPlayed.red) {
      this.setMessage("You already played a spell this turn.");
      return;
    }
    if (this.state.phase !== PHASE.CARDS || this.state.turn !== COLORS.RED) return;

    if (isInstant(card)) {
      const res = playInstant(this.state, COLORS.RED, card);
      if (!res.success) {
        this.setMessage(res.message);
        return;
      }
      this.removeCardFromHand(card);
      this.state.spellPlayed.red = true;
      this.setMessage(res.message);
      this.render();
      return;
    }

    this.cardPlay = { card, picks: [] };
    this.validTargets = getValidTargets(this.state, COLORS.RED, card, []);
    const modal = this.root.querySelector("#card-modal");
    if (modal) {
      const preview = this.root.querySelector("#modal-card-preview");
      if (preview) {
        preview.innerHTML = "";
        preview.appendChild(renderSpellCardEl(card, { compact: true }));
      }
      this.root.querySelector("#modal-title").textContent = card.name;
      this.root.querySelector("#modal-desc").textContent = card.desc;
      this.root.querySelector("#modal-hint").textContent = getCardHint(card);
      modal.classList.remove("hidden");
    }
    this.render();
  }

  onCardTargetClick(row, col) {
    if (!this.cardPlay) return;
    const { card, picks } = this.cardPlay;
    const allowed = getValidTargets(this.state, COLORS.RED, card, picks);
    if (!allowed.some(([r, c]) => r === row && c === col)) {
      this.setMessage("Invalid target.");
      return;
    }
    picks.push([row, col]);
    const need =
      { f_empty: 2, f_f: 2, f_e: 2, f_e_adj: 2, e_empty: 2, e_e_adj: 2, f_f_adj: 2, diagonal: 2, any_piece: 2, empty_empty: 2 }[
        card.mode
      ] || 1;
    if (picks.length < need) {
      this.validTargets = getValidTargets(this.state, COLORS.RED, card, picks);
      this.selectedSquare = picks[picks.length - 1];
      this.render();
      return;
    }
    const res = applyCard(this.state, COLORS.RED, card, picks);
    if (!res.success) {
      picks.pop();
      this.setMessage(res.message);
      this.validTargets = getValidTargets(this.state, COLORS.RED, card, picks);
      this.render();
      return;
    }
    this.finishCardPlay(res.message);
  }

  onSquareClick(row, col) {
    const s = this.state;
    if (s.gameOver || s.turn !== COLORS.RED) return;
    if (this.cardPlay) {
      this.onCardTargetClick(row, col);
      return;
    }
    if (s.phase !== PHASE.MOVE) return;

    const clicked = this.validMoves.find((m) => m.to[0] === row && m.to[1] === col);
    if (clicked) {
      this.executeHumanMove(clicked);
      return;
    }

    const piece = s.board[row][col];
    if (piece && piece.color === COLORS.RED) {
      this.selectedSquare = [row, col];
      this.validMoves = getAllMovesForColor(s.board, COLORS.RED, s).filter(
        (m) => m.from[0] === row && m.from[1] === col
      );
      this.setMessage(
        this.validMoves.length
          ? this.validMoves.some((m) => m.captures?.length)
            ? "Jump to capture!"
            : "Choose destination."
          : "This piece cannot move."
      );
      if (!this.validMoves.length) this.selectedSquare = null;
      this.render();
      return;
    }
    this.selectedSquare = null;
    this.validMoves = [];
    this.render();
  }

  continueMultiJump(fromR, fromC) {
    const jumps = getAllMovesForColor(this.state.board, COLORS.RED, this.state).filter(
      (m) => m.type === "jump" && m.from[0] === fromR && m.from[1] === fromC && m.captures?.length
    );
    if (!jumps.length) return false;
    this.validMoves = jumps;
    this.selectedSquare = [fromR, fromC];
    this.setMessage("Continue jumping!");
    this.render();
    return true;
  }

  executeHumanMove(move) {
    const s = this.state;
    s.meta.lastMove.red = move;
    applyMove(s.board, move, s);
    const [landR, landC] = move.to;
    if (move.captures?.length && this.continueMultiJump(landR, landC)) return;

    this.selectedSquare = null;
    this.validMoves = [];

    if (s.meta.pendingDouble.red && move.type === "step") {
      s.meta.pendingDouble.red = false;
      const extras = getAllMovesForColor(s.board, COLORS.RED, s).filter(
        (m) => m.from[0] === landR && m.from[1] === landC && m.type === "step"
      );
      if (extras.length) {
        this.validMoves = extras;
        this.selectedSquare = [landR, landC];
        this.setMessage("Quick March — move again!");
        this.render();
        return;
      }
    }
    this.endHumanTurn();
  }

  endHumanTurn() {
    if (this.checkWin()) return;
    tickEffects(this.state.board, COLORS.RED, this.state);
    tickMeta(this.state, COLORS.RED);
    this.state.turn = COLORS.BLACK;
    this.state.phase = PHASE.CARDS;
    this.beginAiTurn();
    this.render();
    setTimeout(() => this.runOpponentTurn(), 500);
  }

  checkWin() {
    const s = this.state;
    if (countPieces(s.board, COLORS.BLACK) === 0) {
      this.showGameOver("Victory!", "You captured all enemy pieces.");
      return true;
    }
    if (countPieces(s.board, COLORS.RED) === 0) {
      this.showGameOver("Defeat", "The Shadow Court wiped your forces.");
      return true;
    }
    return false;
  }

  showGameOver(title, text) {
    this.state.gameOver = title;
    const won = title.startsWith("Victory");
    let displayText = text;
    if (won && !this.winRewarded) {
      this.winRewarded = true;
      this.onWin?.();
      displayText = `${text} +10 gems!`;
    }
    const overlay = this.root.querySelector("#game-over");
    if (overlay) {
      this.root.querySelector("#game-over-title").textContent = title;
      this.root.querySelector("#game-over-text").textContent = displayText;
      overlay.classList.remove("hidden");
    }
    this.render();
  }

  runOpponentTurn() {
    const s = this.state;
    if (s.gameOver) return;
    runAiTurn(s, (m) => this.setMessage(m));
    tickEffects(s.board, COLORS.BLACK, s);
    tickMeta(s, COLORS.BLACK);

    if (countPieces(s.board, COLORS.RED) === 0) {
      this.showGameOver("Defeat", "The Shadow Court destroyed your army.");
      return;
    }
    if (countPieces(s.board, COLORS.BLACK) === 0) {
      this.showGameOver("Victory!", "The Shadow Court falls!");
      return;
    }

    s.turn = COLORS.RED;
    s.phase = PHASE.CARDS;
    this.beginPlayerTurn();
    this.setMessage("Your turn — 1 spell max, then move.");
    this.render();
  }

  beginMovePhase() {
    const s = this.state;
    if (s.gameOver || s.turn !== COLORS.RED) return;
    this.cancelCardPlay();
    s.phase = PHASE.MOVE;
    const moves = getAllMovesForColor(s.board, COLORS.RED, s);
    if (!moves.length) {
      this.setMessage("No moves — turn passes.");
      this.endHumanTurn();
      return;
    }
    this.setMessage("Select a piece to move.");
    this.render();
  }

  renderHand() {
    const handEl = this.$("hand-red");
    const countEl = this.$("hand-count");
    if (!handEl) return;
    handEl.innerHTML = "";
    const s = this.state;
    if (countEl) countEl.textContent = `${s.hands.red.length}/${MAX_HAND}`;
    const pileEl = this.$("pile-count");
    if (pileEl) pileEl.textContent = String(pileRemaining(s, COLORS.RED));

    const canPlay =
      s.turn === COLORS.RED && s.phase === PHASE.CARDS && !s.gameOver && !s.spellPlayed.red;

    for (const card of s.hands.red) {
      const el = renderSpellCardEl(card, {
        button: true,
        compact: true,
        disabled: !canPlay,
        onClick: () => {
          if (canPlay) this.startCardPlay(card);
        },
      });
      handEl.appendChild(el);
    }

    const opp = this.$("hand-black");
    if (opp) {
      opp.innerHTML = "";
      for (let i = 0; i < s.hands.black.length; i++) {
        const div = document.createElement("div");
        div.className = "card-mini";
        div.textContent = "?";
        opp.appendChild(div);
      }
    }
  }

  renderBoard() {
    const boardEl = this.$("board");
    if (!boardEl) return;
    boardEl.innerHTML = "";
    const s = this.state;

    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        const sq = document.createElement("button");
        sq.type = "button";
        const key = `${row},${col}`;
        const terrain = s.squares[key];
        let cls = `square ${isDarkSquare(row, col) ? "dark" : "light"}`;
        if (terrain?.mine) cls += " has-mine";
        if (terrain?.quicksand) cls += " has-quicksand";
        sq.className = cls;

        if (this.selectedSquare?.[0] === row && this.selectedSquare?.[1] === col) sq.classList.add("selected");
        if (this.validTargets.some(([r, c]) => r === row && c === col)) sq.classList.add("playable", "target");
        const moveHere = this.validMoves.find((m) => m.to[0] === row && m.to[1] === col);
        if (moveHere) {
          sq.classList.add("playable");
          sq.classList.add(moveHere.captures?.length ? "capture-target" : "target");
        }

        const piece = s.board[row][col];
        if (piece) {
          const el = document.createElement("span");
          el.className = `piece ${piece.color}${piece.king ? " king" : ""}`;
          if (piece.shieldTurns > 0) el.classList.add("shielded");
          if (piece.frozenTurns > 0) el.classList.add("frozen");
          if (piece.isKnight) el.classList.add("knight-mark");
          if (piece.retreatTurns > 0) el.classList.add("retreat-mark");
          sq.appendChild(el);
        }
        sq.addEventListener("click", () => this.onSquareClick(row, col));
        boardEl.appendChild(sq);
      }
    }
  }

  render() {
    const s = this.state;
    const banner = this.$("turn-banner");
    if (banner) {
      if (s.gameOver) banner.textContent = "Game over";
      else if (s.turn === COLORS.RED) {
        const spellNote = s.spellPlayed.red ? "Spell used · " : "1 spell available · ";
        banner.textContent =
          s.phase === PHASE.CARDS ? `${spellNote}play a card or continue` : "Select a piece to move";
        banner.className = "turn-banner";
      } else {
        banner.textContent = "Shadow Court is thinking…";
        banner.className = "turn-banner opponent-turn";
      }
    }
    const endBtn = this.root.querySelector("#btn-end-cards");
    if (endBtn) endBtn.disabled = s.turn !== COLORS.RED || s.phase !== PHASE.CARDS || !!s.gameOver;
    this.renderHand();
    this.renderBoard();
  }
}
