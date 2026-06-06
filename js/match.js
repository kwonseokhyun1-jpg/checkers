/**
 * In-match controller: 30-card deck, 3 start hand, max 5, 1 spell/turn, draw every 2 turns
 */
import {
  SIZE,
  COLORS,
  isDarkSquare,
  createInitialBoard,
  getAllMovesForColor,
  applyMove,
  countPieces,
  tickEffects,
  tickEndTurnEffects,
  findPressExtraPiece,
} from "./board.js";
import { createMatchMeta, startTurnMeta, tickMeta, tryConsumeCounterspell, isSquareCollapsed } from "./gameMeta.js";
import {
  initCardState,
  isInstant,
  getCardHint,
  getValidTargets,
  playInstant,
  applyCard,
} from "./cardEffects.js";
import { planAiTurnWork, runAiTurn, cloneMatchState, syncPlannedAiState, applyAiReplayEntry } from "./ai.js";
import { formatPieceStatusMessage, getPieceStatus } from "./pieceStatus.js";
import { DRAW_EVERY_TURNS, START_HAND, getCardDef } from "./cardCatalog.js";
import { renderSpellCardEl } from "./cardArt.js";
import { showCardPreview } from "./cardPreview.js";
import { initDeckPiles, drawToHand, pileRemaining } from "./deckPile.js";
import { buildAiDeck } from "./deckRules.js";
import { starsForRemainingPieces, formatStars } from "./adventure.js";
import {
  findCullTarget,
  cullVictimSnapshot,
  buildAnimSpec,
  MIN_SPELL_ANIM_MS,
} from "./spellAnimations.js";
import { applySquareSpellFx, mountSpellOverlay, removeSpellOverlay, revealCoinFlipResult, animateCoinDropToSquare } from "./spellFx.js";
import { pickCoinFlipVictim, pickRandomTeleportDestination } from "./cardEffectHandlers.js";
import { boardFxDuration } from "./boardFx.js";
import { planTrickster, getChainLightningAnimSquares, getSanctuaryCells, getDarknessZoneCells } from "./cardEffectHandlers.js";
import { isInDarknessZone } from "./gameMeta.js";
import { saveMatchCheckpoint, clearMatchCheckpoint } from "./matchLifecycle.js";
import { createMatchAchievementTracker } from "./achievementTracker.js";
import {
  appendHistoryEntry,
  buildViewState,
  ensureStartHistory,
  formatHistoryChipLabel,
  formatPieceMoveLabel,
  highlightForHistoryEntry,
} from "./moveHistory.js";

export const PHASE = { CARDS: "cards", MOVE: "move" };

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/** Extra time the top spell banner stays visible */
const SPELL_BANNER_EXTRA_MS = 1000;

/** Enemy turn replay pacing (ms) */
const AI_PACE = {
  beforeTurn: 1000,
  spellWindUp: 1200,
  spellAnimMax: 1800,
  spellSettle: 600,
  moveAnnounce: 600,
  moveSettle: 500,
  afterSpellBeforeMove: 1000,
  message: 600,
  explosion: 1000,
  replayTimeout: 14000,
};

const TWO_PICK_MODES = new Set([
  "f_empty",
  "f_f",
  "f_e",
  "f_e_adj",
  "e_empty",
  "e_e",
  "e_e_adj",
  "f_f_adj",
  "diagonal",
  "any_piece",
  "empty_empty",
]);

export function isPvpTerminalBoard(state, localColor) {
  if (!state?.board) return false;
  const opp = localColor === COLORS.RED ? COLORS.BLACK : COLORS.RED;
  return countPieces(state.board, localColor) === 0 || countPieces(state.board, opp) === 0;
}

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
    gems: { [COLORS.RED]: 0, [COLORS.BLACK]: 0 },
    pvpSpellSeq: 0,
    pvpLastSpell: null,
    moveHistory: [],
  };
  initCardState(state);
  initDeckPiles(state, playerDeckIds, aiDeckIds || buildAiDeck());
  drawToHand(state, COLORS.RED, START_HAND);
  drawToHand(state, COLORS.BLACK, START_HAND);
  return state;
}

function picksRequired(card) {
  if (card.effect === "snowball") return 1;
  return TWO_PICK_MODES.has(card.mode) ? 2 : 1;
}

function usesAxisPick(card) {
  return card?.mode === "row" || card?.mode === "column";
}

function axisPickMessage(card) {
  if (card?.mode === "row") return `${card.name} — tap a rank number (1–8) beside the board.`;
  if (card?.mode === "column") return `${card.name} — tap a file letter (a–h) below the board.`;
  return null;
}

export class MatchSession {
  /**
   * @param {object} [options]
   * @param {string[]} [options.aiDeckIds]
   * @param {string} [options.opponentName]
   */
  constructor(deckCardIds, rootEl, onExit, onWin, options = {}) {
    this.cosmetics = options.cosmetics || null;
    this.profile = options.profile || null;
    this.isPvp = !!options.pvp;
    this.localColor = options.localColor ?? COLORS.RED;
    this.opponentColor = this.localColor === COLORS.RED ? COLORS.BLACK : COLORS.RED;
    /** In PvP, black (guest) sees the board from their side — pieces advance toward them. */
    this.boardFlipped = this.isPvp && this.localColor === COLORS.BLACK;
    this.opponentName = options.opponentName || "Opponent";
    this.onStateSync = options.onStateSync ?? null;
    this.onPvpWin = options.onPvpWin ?? null;
    this._syncBusy = false;
    this._lastPvpSpellSeq = options.initialState?.pvpLastSpell?.seq ?? 0;
    if (options.initialState) {
      this.state = options.initialState;
    } else {
      this.state = createMatchState(deckCardIds, options.aiDeckIds ?? null);
    }
    this.root = rootEl;
    this.onExit = () => {
      this.dispose();
      onExit?.();
    };
    this.onWin = onWin;
    this.winRewarded = false;
    this.cardPlay = null;
    this.selectedSquare = null;
    this.validTargets = [];
    this.validMoves = [];
    this.drag = null;
    this._suppressClick = false;
    this.aiHighlight = null;
    this.cullAnimation = null;
    this.spellAnimation = null;
    this.boardFx = null;
    this.selectedColumn = null;
    this.selectedRow = null;
    this.actionBusy = false;
    this._gameOverUiShown = false;
    this._aiTurnPending = false;
    this.historyViewIndex = null;
    this._pendingHistoryMove = null;
    this._pendingHistoryLabel = null;
    this._onKeyDown = (e) => this.onKeyDown(e);
    this.achievementTracker =
      this.profile && !this.isPvp ? createMatchAchievementTracker(this.profile, this.localColor) : null;
    if (this.achievementTracker) {
      this.state.meta.achievementHook = this.achievementTracker;
    }
    this.bindEls();
    if (this.hasMoveHistory()) ensureStartHistory(this.state);
    if (!(options.initialState && this.isPvp)) {
      if (
        options.initialState &&
        !this.isPvp &&
        this.state.turn === this.opponentColor &&
        !this.state.gameOver
      ) {
        setTimeout(() => {
          void this.runOpponentTurn().catch((err) => console.error("AI turn failed:", err));
        }, AI_PACE.beforeTurn);
      } else {
        this.beginPlayerTurn();
      }
    }
    this.render();
  }

  $(id) {
    return this.root.querySelector(`#${id}`);
  }

  hasMoveHistory() {
    return !!this.$("pvp-move-history");
  }

  isViewingHistory() {
    return this.hasMoveHistory() && this.historyViewIndex != null;
  }

  getViewState() {
    return buildViewState(this.state, this.historyViewIndex);
  }

  recordHistoryEntry(label, type, extras = {}) {
    if (!this.hasMoveHistory()) return;
    appendHistoryEntry(this.state, { label, type, ...extras });
    this.historyViewIndex = null;
  }

  setHistoryViewIndex(index) {
    if (!this.hasMoveHistory()) return;
    const max = (this.state.moveHistory?.length ?? 0) - 1;
    if (max < 0) {
      this.historyViewIndex = null;
    } else if (index == null || index >= max) {
      this.historyViewIndex = null;
    } else {
      this.historyViewIndex = Math.max(0, index);
    }
    const entry =
      this.historyViewIndex != null ? this.state.moveHistory[this.historyViewIndex] : null;
    this.aiHighlight = entry ? highlightForHistoryEntry(entry) : null;
    this.selectedSquare = null;
    this.validMoves = [];
    this.cancelCardPlay();
    this.updateHistoryNavUI();
    this.render();
  }

  stepHistory(delta) {
    const history = this.state.moveHistory;
    if (!history?.length) return;
    const max = history.length - 1;
    const current = this.historyViewIndex ?? max;
    this.setHistoryViewIndex(current + delta);
  }

  updateHistoryNavUI() {
    const bar = this.$("pvp-move-history");
    if (!bar) return;
    const history = this.state.moveHistory ?? [];
    const max = history.length - 1;
    const viewIdx = this.historyViewIndex ?? max;
    const prevBtn = this.$("pvp-history-prev");
    const nextBtn = this.$("pvp-history-next");
    const track = this.$("pvp-history-track");
    const status = this.$("pvp-history-status");

    if (prevBtn) prevBtn.disabled = viewIdx <= 0;
    if (nextBtn) nextBtn.disabled = viewIdx >= max;

    if (status) {
      const reviewing = this.isViewingHistory();
      status.classList.toggle("hidden", !reviewing);
      if (reviewing) {
        const entry = history[viewIdx];
        status.textContent = entry
          ? `Reviewing: ${formatHistoryChipLabel(entry, viewIdx)} — tap › for live`
          : "Reviewing earlier position";
      }
    }

    if (!track) return;
    track.innerHTML = "";
    const start = Math.max(1, viewIdx - 2);
    const end = Math.min(max, viewIdx + 2);
    for (let i = start; i <= end; i++) {
      const entry = history[i];
      if (!entry || entry.type === "start") continue;
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "pvp-move-history__chip";
      chip.setAttribute("role", "listitem");
      if (i === viewIdx) chip.classList.add("pvp-move-history__chip--active");
      else if (i < viewIdx) chip.classList.add("pvp-move-history__chip--past");
      chip.textContent = formatHistoryChipLabel(entry, i);
      chip.addEventListener("click", () => this.setHistoryViewIndex(i));
      track.appendChild(chip);
    }
  }

  recordHistoryFromReplayEntry(entry) {
    if (!this.hasMoveHistory() || this.isPvp) return;
    const oc = this.opponentColor;
    if (entry.type === "spell") {
      const def = entry.cardId ? getCardDef(entry.cardId) : null;
      const cardName = entry.cardName || def?.name || "Spell";
      this.recordHistoryEntry(cardName, "spell", {
        color: oc,
        picks: entry.picks?.map((p) => [...p]) ?? [],
      });
    } else if (entry.type === "move") {
      this.recordHistoryEntry(entry.text, "move", {
        color: oc,
        from: entry.from ? [...entry.from] : undefined,
        to: entry.to ? [...entry.to] : undefined,
        captures: entry.captures?.map((c) => [...c]) ?? [],
      });
    }
  }

  bindBoardFrame() {
    const bottom = this.root.querySelector("#board-files-bottom");
    bottom?.addEventListener("click", (e) => {
      const btn = e.target.closest(".board-file-btn");
      if (!btn || btn.disabled) return;
      const col = Number(btn.dataset.col);
      if (Number.isNaN(col)) return;
      this.onColumnClick(col);
    });
    const ranks = this.root.querySelector("#board-ranks-left");
    ranks?.addEventListener("click", (e) => {
      const btn = e.target.closest(".board-rank-btn");
      if (!btn || btn.disabled) return;
      const row = Number(btn.dataset.row);
      if (Number.isNaN(row)) return;
      this.onRowClick(row);
    });
  }

  bindEls() {
    this.bindBoardFrame();
    this.root.querySelector("#btn-end-cards")?.addEventListener("click", () => this.beginMovePhase());
    this.root.querySelector("#btn-cancel-card")?.addEventListener("click", () => this.cancelCardPlay());
    this.root.querySelector("#btn-leave-match")?.addEventListener("click", () => {
      if (window.confirm("Leave this match? Your progress is saved — you can resume when you return.")) {
        saveMatchCheckpoint(this);
        this.onExit?.();
      }
    });
    this.root.querySelector("#btn-restart-match")?.addEventListener("click", () => this.onExit?.());
    this.$("pvp-history-prev")?.addEventListener("click", () => this.stepHistory(-1));
    this.$("pvp-history-next")?.addEventListener("click", () => this.stepHistory(1));
    this._onDocPointerMove = (e) => this.onDragMove(e);
    this._onDocPointerUp = (e) => this.onDragEnd(e);

    document.addEventListener("keydown", this._onKeyDown);
  }

  dispose() {
    this.achievementTracker?.dispose();
    document.removeEventListener("keydown", this._onKeyDown);
    document.removeEventListener("pointermove", this._onDocPointerMove);
    document.removeEventListener("pointerup", this._onDocPointerUp);
    document.removeEventListener("pointercancel", this._onDocPointerUp);
  }

  onKeyDown(e) {
    const tag = e.target?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || e.target?.isContentEditable) return;
    if (this.hasMoveHistory() && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
      e.preventDefault();
      this.stepHistory(e.key === "ArrowLeft" ? -1 : 1);
      return;
    }
    if (e.key !== "Enter" || e.repeat) return;
    const s = this.state;
    if (!s || s.gameOver || this.isViewingHistory() || s.turn !== this.localColor || this.actionBusy) return;
    if (s.phase === PHASE.CARDS) {
      e.preventDefault();
      this.beginMovePhase();
    }
  }

  canMovePieces() {
    const s = this.state;
    return (
      !this.isViewingHistory() &&
      s.turn === this.localColor &&
      !s.gameOver &&
      !this.actionBusy &&
      !this.cardPlay
    );
  }

  canPlaySpells() {
    const s = this.state;
    return (
      !this.isViewingHistory() &&
      s.turn === this.localColor &&
      s.phase === PHASE.CARDS &&
      !s.gameOver &&
      !s.spellPlayed[this.localColor] &&
      !s.meta.shatterSilenced?.[this.localColor] &&
      !s.meta.blinded?.[this.localColor] &&
      !this.actionBusy &&
      !this.cardPlay
    );
  }

  pickConfusedMove(color) {
    const s = this.state;
    if (!s.meta.confuseNext?.[color]) return null;
    s.meta.confuseNext[color] = false;
    const pool = getAllMovesForColor(s.board, color, s);
    if (!pool.length) return null;
    const move = pool[Math.floor(Math.random() * pool.length)];
    if (color === this.localColor) this.setMessage("Confusion — random move!");
    return move;
  }

  showPieceInfo(piece, row, col) {
    const infoEl = this.$("piece-info");
    const { buffs, curses } = getPieceStatus(piece);
    if (infoEl) {
      const buffText = buffs.length
        ? buffs.map((b) => (b.turns != null ? `${b.label} (${b.turns})` : b.label)).join(", ")
        : "None";
      const curseText = curses.length
        ? curses.map((c) => (c.turns != null ? `${c.label} (${c.turns})` : c.label)).join(", ")
        : "None";
      const side = piece.color === this.localColor ? "Your" : "Enemy";
      const role = piece.king ? "king" : "man";
      infoEl.innerHTML = `<strong>${side} ${role}</strong> <span class="piece-info__pos">(${row + 1}, ${col + 1})</span>
        <span class="piece-info__buffs">Buffs: ${buffText}</span>
        <span class="piece-info__curses">Curses: ${curseText}</span>`;
      infoEl.classList.remove("hidden");
    }
    this.setMessage(formatPieceStatusMessage(piece, row, col));
  }

  clearPieceInfo() {
    const infoEl = this.$("piece-info");
    if (infoEl) {
      infoEl.classList.add("hidden");
      infoEl.innerHTML = "";
    }
  }

  setMessage(text) {
    const el = this.$("message");
    if (el) el.textContent = text || "";
  }

  beginPlayerTurn() {
    this.beginTurn(this.localColor);
  }

  beginTurn(color) {
    const s = this.state;
    tickEffects(s.board, color, s);
    s.turnNumber[color]++;
    s.spellPlayed[color] = false;
    s.phase = PHASE.CARDS;
    this.actionBusy = false;
    this.cardPlay = null;
    if (s.boardFx) s.boardFx = null;
    if (s.turnNumber[color] > 1 && s.turnNumber[color] % DRAW_EVERY_TURNS === 0) {
      const n = drawToHand(s, color, 1);
      if (n) this.setMessage("Drew a card from your deck.");
    }
    startTurnMeta(s, color);
    if (color === this.localColor) {
      this.achievementTracker?.onTurnStart();
    }
    if (color === this.localColor && s.meta.shatterSilenced?.[color]) {
      this.setMessage("Shatter backlash — no spells this turn. Select a piece to move.");
    } else if (color === this.localColor && s.meta.blinded?.[color]) {
      this.setMessage("You are blinded — no spells this turn. Select a piece to move.");
    }
  }

  beginAiTurn() {
    this.beginTurn(this.opponentColor);
  }

  /** Apply authoritative state from PvP sync (opponent moved). */
  importState(nextState) {
    if (!nextState || this.actionBusy || this._syncBusy) return;
    const prevTurn = this.state?.turn;
    const prevSpellSeq = this.state?.pvpLastSpell?.seq ?? this._lastPvpSpellSeq ?? 0;
    const incomingSpell = nextState.pvpLastSpell;
    const replaySpell =
      this.isPvp &&
      incomingSpell &&
      incomingSpell.seq > prevSpellSeq &&
      incomingSpell.caster === this.opponentColor;

    this.state = nextState;
    if (incomingSpell?.seq) this._lastPvpSpellSeq = incomingSpell.seq;
    if (this.isPvp) ensureStartHistory(this.state);
    this.historyViewIndex = null;
    this.aiHighlight = null;
    this.cardPlay = null;
    this.validTargets = [];
    this.validMoves = [];
    this.selectedSquare = null;
    this.selectedColumn = null;
    this.selectedRow = null;
    this.endDrag();
    if (
      this.isPvp &&
      !nextState.gameOver &&
      prevTurn !== this.localColor &&
      nextState.turn === this.localColor
    ) {
      this.beginPlayerTurn();
    }
    this.updateSpellCastUI();
    this.applyPvpOutcomeFromBoard();
    this.updateHistoryNavUI();
    this.render();
    if (replaySpell) void this.replayOpponentPvpSpell(incomingSpell);
  }

  async replayOpponentPvpSpell(spell) {
    if (this.actionBusy) return;
    this.actionBusy = true;
    try {
      await this.playAiTurnPresentation(
        [
          {
            type: "spell",
            cardName: spell.cardName,
            cardId: spell.cardId,
            cardDesc: spell.cardDesc,
            cardEffect: spell.cardEffect,
            cardMode: spell.cardMode,
            picks: spell.picks || [],
            countered: !!spell.countered,
          },
        ],
        { applyEntries: false }
      );
    } finally {
      this.actionBusy = false;
      this.render();
    }
  }

  applyPvpOutcomeFromBoard() {
    if (!this.isPvp || this._gameOverUiShown) return;
    if (!isPvpTerminalBoard(this.state, this.localColor)) return;
    if (countPieces(this.state.board, this.opponentColor) === 0) {
      void this.showGameOver("Victory!", "You won the match!");
      return;
    }
    void this.showGameOver("Defeat", "You lost the match.");
  }

  pushPvpState() {
    if (!this.isPvp || !this.onStateSync) return Promise.resolve();
    if (this._syncBusy) return this._syncPromise ?? Promise.resolve();
    this._syncBusy = true;
    this._syncPromise = Promise.resolve(this.onStateSync(this.state)).finally(() => {
      this._syncBusy = false;
      this._syncPromise = null;
    });
    return this._syncPromise;
  }

  recordPvpSpell(card, picks = [], extras = {}) {
    if (!this.isPvp || !card) return;
    const seq = (this.state.pvpSpellSeq || 0) + 1;
    this.state.pvpSpellSeq = seq;
    this.state.pvpLastSpell = {
      seq,
      caster: this.localColor,
      cardId: card.id,
      cardName: card.name,
      cardDesc: card.desc,
      cardEffect: card.effect,
      cardMode: card.mode,
      picks: (picks || []).map((p) => [...p]),
      countered: !!extras.countered,
      ...(extras.cullTarget ? { cullTarget: extras.cullTarget, cullVictim: extras.cullVictim } : {}),
    };
    this._lastPvpSpellSeq = seq;
  }

  removeCardFromHand(card) {
    const hand = this.state.hands[this.localColor];
    const i = hand.findIndex((c) => c.instanceId === card.instanceId);
    if (i >= 0) hand.splice(i, 1);
  }

  updateSpellCastUI() {
    const bar = this.$("spell-cast-bar");
    if (!bar) return;
    const active = !!this.cardPlay;
    bar.classList.toggle("hidden", !active);
    this.root.querySelector(".match-wrap")?.classList.toggle("casting-spell", active);

    if (!active) return;
    const { card, picks } = this.cardPlay;
    const preview = this.$("spell-cast-preview");
    const hint = this.$("spell-cast-hint");
    if (preview) {
      preview.innerHTML = "";
      preview.appendChild(renderSpellCardEl(card, { static: true, compact: true, fullDesc: true }));
    }
    const need = picksRequired(card);
    const step = picks.length + 1;
    const base = getCardHint(card);
    if (hint) {
      hint.textContent =
        picks.length >= need
          ? base
          : card.mode === "column" || card.mode === "row"
          ? `${base}`
          : `${base} (${step}/${need} — click a highlighted square or drop the card on it)`;
    }
  }

  finishCardPlay(msg, replayExtras = {}) {
    const card = this.cardPlay?.card;
    const picks = this.cardPlay?.picks ? [...this.cardPlay.picks] : [];
    if (card) {
      this.recordPvpSpell(card, picks, replayExtras);
      this.removeCardFromHand(card);
    }
    if (!this.state.meta.extraSpellCast?.[this.localColor]) this.state.spellPlayed[this.localColor] = true;
    else this.state.meta.extraSpellCast[this.localColor] = false;
    this.cardPlay = null;
    this.validTargets = [];
    this.selectedSquare = null;
    this.selectedColumn = null;
    this.selectedRow = null;
    this.endDrag();
    this.updateSpellCastUI();
    this.setMessage(msg || "Spell played (1 per turn).");
    if (card && this.hasMoveHistory()) {
      this.recordHistoryEntry(card.name, "spell", {
        color: this.localColor,
        picks: picks.map((p) => [...p]),
      });
    }
    this.render();
    if (this.checkWin()) return;
    this.pushPvpState();
  }

  cancelCardPlay() {
    this.cardPlay = null;
    this.validTargets = [];
    this.selectedSquare = null;
    this.selectedColumn = null;
    this.selectedRow = null;
    this.endDrag();
    this.updateSpellCastUI();
    this.setMessage("Spell cancelled.");
    this.render();
  }

  startCardPlay(card) {
    if (this.state.spellPlayed[this.localColor]) {
      this.setMessage("You already played a spell this turn.");
      return false;
    }
    if (!this.canPlaySpells()) return false;

    if (isInstant(card)) {
      void this.castInstantSpell(card);
      return true;
    }

    const targets = getValidTargets(this.state, this.localColor, card, []);
    if (!targets.length) {
      this.setMessage("No valid targets for this spell right now.");
      return false;
    }

    if (this.cardPlay?.card?.instanceId === card.instanceId) {
      this.validTargets = getValidTargets(this.state, this.localColor, card, this.cardPlay.picks);
      this.updateSpellCastUI();
      return true;
    }

    this.selectedColumn = null;
    this.selectedRow = null;
    this.cardPlay = { card, picks: [] };
    this.validTargets = targets;
    this.updateSpellCastUI();
    this.setMessage(
      axisPickMessage(card) ??
        (card.effect === "pyromancy"
            ? `${card.name} — tap an enemy piece, then an empty dark square to ignite.`
            : card.effect === "sanctuary" || card.effect === "darkness"
              ? `${card.name} — tap a square; highlighted area shows the zone.`
              : card.effect === "clone"
                ? `${card.name} — tap your man, then pick where the copy spawns.`
                : `${card.name} — drag to the board or tap highlighted squares.`)
    );
    this.render();
  }

  onColumnClick(col) {
    if (!this.cardPlay || this.cardPlay.card.mode !== "column") return;
    this.selectedColumn = col;
    this.onCardTargetClick(3, col);
  }


  onRowClick(row) {
    if (!this.cardPlay || this.cardPlay.card.mode !== "row") return;
    this.selectedRow = row;
    this.onCardTargetClick(row, 3);
  }

  updateRowPickUI() {
    const frame = this.root.querySelector("#board-frame");
    const ranks = this.root.querySelector("#board-ranks-left");
    const castingRow = this.cardPlay?.card?.mode === "row";
    frame?.classList.toggle("row-pick", !!castingRow);
    if (!ranks) return;
    ranks.querySelectorAll(".board-rank-btn").forEach((btn) => {
      const row = Number(btn.dataset.row);
      btn.disabled = !castingRow;
      btn.classList.toggle("is-target", !!castingRow);
      btn.classList.toggle("is-active", castingRow && this.selectedRow === row);
    });
  }

  updateColumnPickUI() {
    const frame = this.root.querySelector("#board-frame");
    const bottom = this.root.querySelector("#board-files-bottom");
    const castingColumn = this.cardPlay?.card?.mode === "column";
    frame?.classList.toggle("column-pick", !!castingColumn);
    if (!bottom) return;
    bottom.querySelectorAll(".board-file-btn").forEach((btn) => {
      const col = Number(btn.dataset.col);
      btn.disabled = !castingColumn;
      btn.classList.toggle("is-target", !!castingColumn);
      btn.classList.toggle("is-active", castingColumn && this.selectedColumn === col);
    });
  }

  onCardTargetClick(row, col) {
    if (!this.cardPlay) return;
    const { card, picks } = this.cardPlay;
    const allowed = getValidTargets(this.state, this.localColor, card, picks);
    if (!allowed.some(([r, c]) => r === row && c === col)) {
      this.setMessage("Invalid target — pick a highlighted square.");
      return;
    }
    picks.push([row, col]);
    const need = picksRequired(card);
    if (picks.length < need) {
      this.validTargets = getValidTargets(this.state, this.localColor, card, picks);
      this.selectedSquare = picks[picks.length - 1];
      this.updateSpellCastUI();
      this.render();
      return;
    }
    void this.resolveTargetedSpell(card, [...picks]).then((res) => {
      if (!res.success) {
        if (res.countered) {
          this.finalizeCounteredSpell(card, res.message);
          return;
        }
        picks.pop();
        this.setMessage(res.message);
        this.validTargets = getValidTargets(this.state, this.localColor, card, picks);
        this.updateSpellCastUI();
        this.render();
        return;
      }
      this.finishCardPlay(res.message);
    });
  }

  squareAtPoint(clientX, clientY) {
    const el = document.elementFromPoint(clientX, clientY);
    const sq = el?.closest?.(".square");
    const board = this.$("board");
    if (!sq || !board?.contains(sq)) return null;
    const row = Number(sq.dataset.row);
    const col = Number(sq.dataset.col);
    if (Number.isNaN(row) || Number.isNaN(col)) return null;
    return [row, col];
  }

  beginDrag(card, sourceEl, clientX, clientY) {
    if (isInstant(card)) return;
    if (!this.startCardPlay(card)) return;

    this.endDrag();
    const ghost = renderSpellCardEl(card, { static: true, compact: true });
    ghost.classList.add("spell-drag-ghost");
    ghost.style.left = `${clientX}px`;
    ghost.style.top = `${clientY}px`;
    document.body.appendChild(ghost);

    this.drag = {
      card,
      ghost,
      sourceEl,
      moved: false,
      hover: null,
    };
    sourceEl?.classList.add("spell-card--dragging");
    document.addEventListener("pointermove", this._onDocPointerMove);
    document.addEventListener("pointerup", this._onDocPointerUp);
    document.addEventListener("pointercancel", this._onDocPointerUp);
  }

  onDragMove(e) {
    if (!this.drag?.ghost) return;
    const { ghost } = this.drag;
    ghost.style.left = `${e.clientX}px`;
    ghost.style.top = `${e.clientY}px`;

    const sq = this.squareAtPoint(e.clientX, e.clientY);
    if (this.drag.hover) {
      this.drag.hover.classList.remove("spell-drop-hover");
      this.drag.hover = null;
    }
    if (sq) {
      const [row, col] = sq;
      const board = this.$("board");
      const el = board?.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
      if (el) {
        this.drag.hover = el;
        el.classList.add("spell-drop-hover");
      }
    }
    if (Math.abs(e.movementX) + Math.abs(e.movementY) > 2) this.drag.moved = true;
  }

  onDragEnd(e) {
    if (!this.drag) return;
    const { moved, card } = this.drag;
    const sq = this.squareAtPoint(e.clientX, e.clientY);
    this.endDrag();

    if (moved && sq && this.cardPlay?.card?.instanceId === card.instanceId && !usesAxisPick(card)) {
      this._suppressClick = true;
      this.onCardTargetClick(sq[0], sq[1]);
      setTimeout(() => {
        this._suppressClick = false;
      }, 0);
    }
  }

  endDrag() {
    document.removeEventListener("pointermove", this._onDocPointerMove);
    document.removeEventListener("pointerup", this._onDocPointerUp);
    document.removeEventListener("pointercancel", this._onDocPointerUp);
    if (this.drag?.ghost) this.drag.ghost.remove();
    if (this.drag?.hover) this.drag.hover.classList.remove("spell-drop-hover");
    if (this.drag?.sourceEl) this.drag.sourceEl.classList.remove("spell-card--dragging");
    this.drag = null;
  }

  attachCardInput(el, card, canPlay) {
    const s = this.state;
    const hasTargets = isInstant(card) || getValidTargets(s, this.localColor, card, []).length > 0;
    const canCast = canPlay && this.canPlaySpells() && hasTargets;
    el.classList.toggle("disabled", !canCast);
    if (!canCast) {
      el.title =
        s.phase === PHASE.MOVE
          ? "Spells skipped — select a piece to move"
          : s.meta.shatterSilenced?.red
            ? "Shatter backlash — no spells this turn"
            : s.meta.blinded?.red
              ? "Blinded — no spells this turn"
              : s.spellPlayed[this.localColor]
              ? "Already cast a spell this turn"
              : !hasTargets
                ? "No valid targets for this spell"
                : "Spells unavailable";
      return;
    }
    el.title = canCast
      ? "Tap to view · drag onto the board to cast"
      : "Tap to view card";

    el.addEventListener("click", () => {
      if (this._suppressClick) return;
      showCardPreview(card, {
        meta: canCast ? "Cast this spell, then move a piece." : "Inspecting spell",
        onPlay: canCast ? () => this.startCardPlay(card) : undefined,
      });
    });

    if (!canCast || isInstant(card)) return;

    el.classList.add("spell-card--draggable");
    el.addEventListener("pointerdown", (e) => {
      if (!this.canPlaySpells() || e.button !== 0) return;
      const startX = e.clientX;
      const startY = e.clientY;
      let dragStarted = false;

      const onMove = (ev) => {
        if (dragStarted) {
          this.onDragMove(ev);
          return;
        }
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        if (Math.hypot(dx, dy) < 14) return;
        dragStarted = true;
        ev.preventDefault();
        try { el.setPointerCapture(ev.pointerId); } catch (_) {}
        this.beginDrag(card, el, ev.clientX, ev.clientY);
        this.onDragMove(ev);
      };

      const onUp = (ev) => {
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
        document.removeEventListener("pointercancel", onUp);
        if (dragStarted) this.onDragEnd(ev);
      };

      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
      document.addEventListener("pointercancel", onUp);
    });
  }

  onSquareClick(row, col) {
    if (this.isViewingHistory()) return;
    const s = this.state;
    if (s.gameOver || s.turn !== this.localColor) return;
    if (this.cardPlay) {
      const axisMsg = axisPickMessage(this.cardPlay.card);
      if (axisMsg) {
        this.setMessage(axisMsg);
        return;
      }
      this.onCardTargetClick(row, col);
      return;
    }

    if (!this.canMovePieces()) return;

    const clicked = this.validMoves.find((m) => m.to[0] === row && m.to[1] === col);
    if (clicked) {
      this.executeHumanMove(clicked);
      return;
    }

    const piece = s.board[row][col];
    if (piece) this.showPieceInfo(piece, row, col);

    if (piece && piece.color === this.localColor) {
      this.selectedSquare = [row, col];
      this.validMoves = getAllMovesForColor(s.board, this.localColor, s).filter(
        (m) => m.from[0] === row && m.from[1] === col
      );
      if (!this.validMoves.length) {
        this.setMessage(
          piece.paralyzedTurns > 0
            ? "Paralyzed — cannot move yet."
            : piece.frozenTurns > 0
              ? "Frozen — cannot move."
              : "This piece cannot move."
        );
        this.selectedSquare = null;
      } else {
        this.setMessage(
          this.validMoves.some((m) => m.captures?.length)
            ? "Jump to capture!"
            : "Choose destination."
        );
      }
      this.render();
      return;
    }
    this.selectedSquare = null;
    this.validMoves = [];
    if (!piece) this.clearPieceInfo();
    this.render();
  }

  continueMultiJump(fromR, fromC) {
    const s = this.state;
    const piece = s.board[fromR]?.[fromC];
    const movePool = getAllMovesForColor(s.board, this.localColor, s);
    const jumps = movePool.filter(
      (m) => m.type === "jump" && m.from[0] === fromR && m.from[1] === fromC && m.captures?.length
    );
    if (!jumps.length) return false;
    this.validMoves = jumps;
    this.selectedSquare = [fromR, fromC];
    this.setMessage("Continue jumping!");
    this.render();
    return true;
  }


  playBoardFx(s, onDone) {
    if (!s.boardFx?.squares?.length) {
      onDone?.();
      return;
    }
    this.boardFx = { ...s.boardFx, squares: s.boardFx.squares.map(([r, c]) => [r, c]) };
    s.boardFx = null;
    const kind = this.boardFx.kind || "bomb";
    const labels = {
      bomb: "Bomb detonates — adjacent pieces destroyed!",
      mine: "Landmine explodes!",
      vengeance: "Vengeance — blood for blood!",
    };
    this.setMessage(labels[kind] || "Blast!");
    const frame = this.$("board")?.closest(".board-frame");
    frame?.classList.add(`board-frame--fx-${kind}`, "board-frame--spell-impact");
    this.$("board")?.classList.add("board--spell-shake");
    this.render();
    const ms = boardFxDuration(kind);
    setTimeout(() => {
      this.boardFx = null;
      this.selectedColumn = null;
      this.selectedRow = null;
      frame?.classList.remove(`board-frame--fx-${kind}`, "board-frame--spell-impact");
      this.$("board")?.classList.remove("board--spell-shake");
      onDone?.();
      this.checkWin();
    }, ms);
  }

  tryBearBonusMove(s, color, landR, landC) {
    const landed = s.board[landR]?.[landC];
    if (!landed?.bearAwakened || s.meta.bearBonusUsed?.[color]) return false;
    const extras = getAllMovesForColor(s.board, color, s).filter(
      (m) => m.from[0] === landR && m.from[1] === landC
    );
    if (!extras.length) return false;
    s.meta.bearBonusUsed[color] = true;
    s.phase = PHASE.MOVE;
    this.validMoves = extras;
    this.selectedSquare = [landR, landC];
    this.setMessage("Awoken Bear — move again!");
    this.render();
    return true;
  }

  executeHumanMove(move) {
    const s = this.state;
    this._pendingHistoryMove = move;
    this._pendingHistoryLabel = formatPieceMoveLabel(s.board, move);
    if (s.turn === this.localColor && s.meta.confuseNext?.[this.localColor]) {
      const forced = this.pickConfusedMove(this.localColor);
      if (forced) move = forced;
    }
    this.cancelCardPlay();
    s.phase = PHASE.MOVE;
    s.meta.lastMove.red = move;
    const capBefore = s.captured[this.localColor]?.length ?? 0;
    this.achievementTracker?.onMoveBefore(s);
    applyMove(s.board, move, s);
    const capAfter = s.captured[this.localColor]?.length ?? 0;
    if (capAfter > capBefore) this.achievementTracker?.onOurPieceCaptured();
    this.achievementTracker?.onMoveAfter(s);

    const finish = () => {
      const [landR, landC] = move.to;
      if (move.captures?.length && this.continueMultiJump(landR, landC)) return;
      this.selectedSquare = null;
      this.validMoves = [];
      if (s.meta.pendingDouble.red && move.type === "step") {
        s.meta.pendingDouble.red = false;
        const extras = getAllMovesForColor(s.board, this.localColor, s).filter(
          (m) => m.from[0] === landR && m.from[1] === landC && (m.type === "step" || m.type === "jump")
        );
        if (extras.length) {
          this.validMoves = extras;
          this.selectedSquare = [landR, landC];
          this.setMessage("Quick March — move again!");
          this.render();
          return;
        }
      }
      if (this.tryBearBonusMove(s, this.localColor, landR, landC)) return;
      if (this.tryPressExtraMove(s, this.localColor)) return;
      this.endHumanTurn();
    };

    if (s.boardFx) {
      this.playBoardFx(s, finish);
      return;
    }

    finish();
  }

  tryPressExtraMove(s, color) {
    const pressed = findPressExtraPiece(s.board, color);
    if (!pressed) return false;
    pressed.pressExtraMove = false;
    const moves = getAllMovesForColor(s.board, color, s).filter(
      (m) => m.from[0] === pressed.row && m.from[1] === pressed.col
    );
    if (!moves.length) return false;
    s.phase = PHASE.MOVE;
    this.validMoves = moves;
    this.selectedSquare = [pressed.row, pressed.col];
    this.setMessage("Press — that piece must move again!");
    this.render();
    return true;
  }

  endHumanTurn() {
    if (this.checkWin()) return;
    tickEndTurnEffects(this.state.board, this.localColor, this.state);
    tickMeta(this.state, this.localColor);
    this.state.turn = this.opponentColor;
    this.state.phase = PHASE.CARDS;
    if (!this.isPvp) saveMatchCheckpoint(this);
    if (this._pendingHistoryMove && this.hasMoveHistory()) {
      const label =
        this._pendingHistoryLabel || formatPieceMoveLabel(this.state.board, this._pendingHistoryMove);
      this.recordHistoryEntry(label, "move", {
        color: this.localColor,
        from: [...this._pendingHistoryMove.from],
        to: [...this._pendingHistoryMove.to],
        captures: this._pendingHistoryMove.captures?.map((c) => [...c]) ?? [],
      });
      this._pendingHistoryMove = null;
      this._pendingHistoryLabel = null;
    }
    if (this.isPvp) {
      this.setMessage("Waiting for opponent…");
      this.render();
      this.pushPvpState();
      return;
    }
    this.beginAiTurn();
    this.render();
    setTimeout(() => {
      if (document.hidden) {
        this._aiTurnPending = true;
        return;
      }
      void this.runOpponentTurn().catch((err) => console.error("AI turn failed:", err));
    }, AI_PACE.beforeTurn);
  }

  checkWin() {
    const s = this.state;
    if (countPieces(s.board, this.opponentColor) === 0) {
      this.showGameOver("Victory!", this.isPvp ? "You won the match!" : "You captured all enemy pieces.");
      return true;
    }
    if (countPieces(s.board, this.localColor) === 0) {
      this.showGameOver("Defeat", this.isPvp ? "You lost the match." : "Your forces were wiped out.");
      return true;
    }
    return false;
  }

  async showGameOver(title, text) {
    if (this._gameOverUiShown) return;
    this._gameOverUiShown = true;
    this.state.gameOver = title;
    if (!this.isPvp) clearMatchCheckpoint();
    const won = title.startsWith("Victory");
    if (this.isPvp) {
      try {
        await this.pushPvpState();
      } catch {
        /* opponent may still resolve outcome from board or finished row */
      }
    }
    let displayText = text;
    let stars = 0;
    if (won && !this.isPvp) {
      const remaining = countPieces(this.state.board, this.localColor);
      stars = starsForRemainingPieces(remaining);
      if (!this.winRewarded) {
        this.winRewarded = true;
        const reward = this.onWin?.(stars, remaining);
        const gemNote = typeof reward === "string" ? reward : reward?.message;
        const starsGained = typeof reward === "object" ? reward?.starsGained || 0 : 0;
        const starLine = `${formatStars(stars)} (${remaining} piece${remaining === 1 ? "" : "s"} left)`;
        displayText = gemNote ? `${text}
${starLine}
${gemNote}` : `${text}
${starLine}`;
        this._pendingStarsGained = starsGained;
      }
    }
    const overlay = this.root.querySelector("#game-over");
    if (overlay) {
      this.root.querySelector("#game-over-title").textContent = title;
      const textEl = this.root.querySelector("#game-over-text");
      if (textEl) textEl.textContent = displayText;
      const starsEl = this.root.querySelector("#game-over-stars");
      if (starsEl) {
        starsEl.textContent = won ? formatStars(stars) : "";
        starsEl.classList.toggle("hidden", !won);
        starsEl.classList.toggle("game-over-stars--earned", won && stars > 0);
        starsEl.setAttribute("aria-label", won ? `${stars} of 3 stars` : "");
      }
      const gainEl = this.root.querySelector("#game-over-star-gain");
      if (gainEl) gainEl.classList.add("hidden");
      overlay.classList.remove("hidden");
      if (won && this._pendingStarsGained > 0) {
        const n = this._pendingStarsGained;
        this._pendingStarsGained = 0;
        if (gainEl) {
          gainEl.textContent = `+${n} ★ collected`;
          gainEl.classList.remove("hidden");
        }
        const { playStarCollectAnimation } = await import("./starCollectAnimation.js");
        await playStarCollectAnimation(n, starsEl);
      }
    }
    if (won && this.achievementTracker) {
      this.achievementTracker.onVictory(this.state);
    }
    if (this.isPvp) {
      this.onPvpWin?.(won);
    }
    this.cancelCardPlay();
    this.actionBusy = false;
    this.render();
  }


  squareInAnim(spec, row, col) {
    if (!spec) return null;
    const key = `${row},${col}`;
    if (spec.from && spec.from[0] === row && spec.from[1] === col) return "from";
    if (spec.to && spec.to[0] === row && spec.to[1] === col) return "to";
    if (spec.lineSquares?.some(([r, c]) => r === row && c === col)) return "line";
    if (spec.visual === "fire" && spec.lineSquares?.some(([r, c]) => r === row && c === col)) return "fire-line";
    if (spec.visual === "lightning" && spec.squares?.some(([r, c]) => r === row && c === col)) return "lightning";
    if (spec.squares?.some(([r, c]) => r === row && c === col)) {
      if (spec.type === "kill" || spec.type === "multi") return "kill";
      if (spec.type === "debuff") return "debuff";
      if (spec.type === "buff") return "buff";
      if (spec.type === "terrain") return "terrain";
      if (spec.type === "swap") return "swap";
      if (spec.type === "move") return "move";
      return "hit";
    }
    return null;
  }

  async runSpellAnimation(spec) {
    if (!spec || spec.type === "cull") return;
    this.spellAnimation = spec;
    const frame = this.$("board")?.closest(".board-frame");
    const board = this.$("board");
    let overlay = null;
    frame?.classList.add(`board-frame--spell-${spec.type}`);
    if (spec.visual) frame?.classList.add(`board-frame--fx-${spec.visual}`);
    if (spec.overlay) overlay = mountSpellOverlay(frame, spec.overlay);
    if (spec.shake) {
      frame?.classList.add("board-frame--spell-impact");
      board?.classList.add("board--spell-shake");
    }
    const banner = this.$("turn-banner");
    if (banner) {
      banner.textContent = spec.label ? `${spec.label}…` : "Spell resolves…";
      banner.className = `turn-banner spell-anim-${spec.type}`;
    }
    this.render();
    await delay((spec.duration ?? MIN_SPELL_ANIM_MS) + SPELL_BANNER_EXTRA_MS);
    this.spellAnimation = null;
    this.boardFx = null;
    this.selectedColumn = null;
    this.selectedRow = null;
    removeSpellOverlay(overlay);
    board?.classList.remove("board--spell-shake");
    frame?.classList.remove("board-frame--spell-impact");
    if (spec.visual) frame?.classList.remove(`board-frame--fx-${spec.visual}`);
    frame?.classList.remove(`board-frame--spell-${spec.type}`);
    if (banner) banner.classList.remove(`spell-anim-${spec.type}`);
  }

  async runVictimSquareFlash(spec) {
    if (!spec) return;
    this.spellAnimation = spec;
    const frame = this.$("board")?.closest(".board-frame");
    if (spec.visual) frame?.classList.add(`board-frame--fx-${spec.visual}`);
    this.render();
    await delay((spec.duration ?? 900) + 400);
    this.spellAnimation = null;
    this.boardFx = null;
    this.selectedColumn = null;
    this.selectedRow = null;
    if (spec.visual) frame?.classList.remove(`board-frame--fx-${spec.visual}`);
  }

  async runHiddenCounterspellCast() {
    const banner = this.$("turn-banner");
    if (banner) {
      banner.textContent = "Counterspell armed — hidden.";
      banner.className = "turn-banner spell-anim-instant";
    }
    this.render();
    await delay(450 + SPELL_BANNER_EXTRA_MS);
    if (banner) banner.className = "turn-banner";
  }

  async runHiddenVengeanceCast() {
    const banner = this.$("turn-banner");
    if (banner) {
      banner.textContent = "Vengeance armed — hidden.";
      banner.className = "turn-banner spell-anim-instant";
    }
    this.render();
    await delay(450 + SPELL_BANNER_EXTRA_MS);
    if (banner) banner.className = "turn-banner";
  }

  async runCounterspellReveal() {
    const frame = this.$("board")?.closest(".board-frame");
    frame?.classList.add("board-frame--counterspell");
    const banner = this.$("turn-banner");
    if (banner) {
      banner.textContent = "Counterspell!";
      banner.className = "turn-banner turn-banner--counterspell";
    }
    this.root.querySelector(".match-wrap")?.classList.add("match-wrap--counterspell");
    this.render();
    await delay(1200 + SPELL_BANNER_EXTRA_MS);
    frame?.classList.remove("board-frame--counterspell");
    this.root.querySelector(".match-wrap")?.classList.remove("match-wrap--counterspell");
    if (banner) {
      banner.classList.remove("turn-banner--counterspell");
      banner.className = "turn-banner";
    }
  }

  async playCullAnimation(row, col, victim = null) {
    const piece = this.state.board[row]?.[col];
    const snap = victim || (piece ? cullVictimSnapshot(piece) : null);
    this.cullAnimation = { row, col, victim: snap };
    const frame = this.$("board")?.closest(".board-frame");
    frame?.classList.add("board-frame--cull", "board-frame--fx-shadow", "board-frame--spell-impact");
    this.$("board")?.classList.add("board--spell-shake");
    const banner = this.$("turn-banner");
    if (banner) {
      banner.textContent = "Cull — the weakest falls…";
      banner.className = "turn-banner cull-casting";
    }
    this.render();
    await delay(2000 + SPELL_BANNER_EXTRA_MS);
    this.cullAnimation = null;
    this.$("board")?.classList.remove("board--spell-shake");
    frame?.classList.remove("board-frame--cull", "board-frame--fx-shadow", "board-frame--spell-impact");
    if (banner) banner.classList.remove("cull-casting");
  }

  finalizeCounteredSpell(card, message) {
    const picks = this.cardPlay?.picks ? [...this.cardPlay.picks] : [];
    this.recordPvpSpell(card, picks, { countered: true });
    this.removeCardFromHand(card);
    if (!this.state.meta.extraSpellCast?.[this.localColor]) {
      this.state.spellPlayed[this.localColor] = true;
    } else {
      this.state.meta.extraSpellCast[this.localColor] = false;
    }
    this.cardPlay = null;
    this.validTargets = [];
    this.selectedSquare = null;
    this.selectedColumn = null;
    this.selectedRow = null;
    this.endDrag();
    this.updateSpellCastUI();
    this.setMessage(message || "Enemy Counterspell! Your spell fizzles.");
    if (this.hasMoveHistory()) {
      this.recordHistoryEntry(card.name, "spell", {
        color: this.localColor,
        picks: picks.map((p) => [...p]),
      });
    }
    this.render();
    this.pushPvpState();
  }

  async applySpellWithAnimation(card, picks) {
    const finishSpellTrack = (res) => {
      this.achievementTracker?.onSpellAfter(this.state, card.effect, res);
      return res;
    };
    this.achievementTracker?.onSpellBefore(this.state);

    const countered = tryConsumeCounterspell(this.state, this.localColor);
    if (countered) {
      await this.runCounterspellReveal();
      return finishSpellTrack({ success: false, countered: true, message: "Enemy Counterspell! Your spell fizzles." });
    }

    if (card.effect === "cull") {
      const target = findCullTarget(this.state, this.localColor);
      if (!target) return finishSpellTrack({ success: false, message: "No enemy to cull." });
      const victim = cullVictimSnapshot(target);
      await this.playCullAnimation(target.row, target.col, victim);
      return finishSpellTrack(applyCard(this.state, this.localColor, card, picks));
    }

    if (card.effect === "counterspell") {
      const res = applyCard(this.state, this.localColor, card, picks);
      if (res.success) await this.runHiddenCounterspellCast();
      return finishSpellTrack(res);
    }

    if (card.effect === "vengeance") {
      const res = applyCard(this.state, this.localColor, card, picks);
      if (res.success) await this.runHiddenVengeanceCast();
      return finishSpellTrack(res);
    }

    const s = this.state;
    let extra = {};
    if (card.effect === "trickster") {
      const plan = planTrickster(s);
      if (!plan) return finishSpellTrack({ success: false, message: "Need at least 4 pieces on the board." });
      s.meta.pendingTrickster = plan;
      extra.tricksterSquares = plan.squares;
    }
    if (card.effect === "backstab" && picks.length) {
      const [r, c] = picks[0];
      const dir = this.localColor === COLORS.RED ? 1 : -1;
      for (const dc of [-1, 1]) {
        const t = s.board[r + dir]?.[c + dc];
        if (t && t.color !== this.localColor) {
          extra.backstabTo = [r + dir, c + dc];
          break;
        }
      }
    }
    if (card.effect === "chain_lightning" && picks.length) {
      const [pr, pc] = picks[0];
      extra.chainSquares = getChainLightningAnimSquares(s, pr, pc, this.localColor);
    }
    if (card.effect === "pyromancy" && picks.length >= 2) {
      extra.pyromancySquares = picks.slice(0, 2);
    }
    if (card.effect === "sanctuary" && picks.length) {
      extra.sanctuaryCells = getSanctuaryCells(picks[0][0], picks[0][1]);
    }
    if (card.effect === "darkness" && picks.length) {
      extra.darknessCells = getDarknessZoneCells(picks[0][0], picks[0][1]);
    }
    let animPicks = picks;
    if (card.effect === "random_teleport" && picks.length) {
      const [r, c] = picks[0];
      const dest = pickRandomTeleportDestination(s, r, c);
      if (!dest) return finishSpellTrack({ success: false, message: "No empty squares to teleport to." });
      s.meta.pendingRandomTeleport = dest;
      animPicks = [picks[0], dest];
    }
    if (card.effect === "coin_flip") {
      const victim = pickCoinFlipVictim(s, this.localColor);
      if (!victim) return finishSpellTrack({ success: false, message: "No valid targets" });

      const victimSquare = [victim.row, victim.col];
      const victimColor = victim.color;
      s.meta.pendingCoinFlipSquare = victimSquare;

      const spec = buildAnimSpec(card, [], this.localColor, extra);
      const board = this.$("board");
      const frame = board?.closest(".board-frame");
      let coinOverlay = null;
      if (spec.overlay) coinOverlay = mountSpellOverlay(board, spec.overlay);
      this.spellAnimation = spec;
      if (spec.visual) frame?.classList.add(`board-frame--fx-${spec.visual}`);
      frame?.classList.add("board-frame--spell-instant");
      const banner = this.$("turn-banner");
      if (banner) {
        banner.textContent = `${card.name}…`;
        banner.className = "turn-banner spell-anim-instant";
      }
      this.render();
      await delay(2700);
      revealCoinFlipResult(coinOverlay, { friendly: victimColor === this.localColor });
      await delay(450);
      await animateCoinDropToSquare(coinOverlay, board, victim.row, victim.col);
      const res = applyCard(this.state, this.localColor, card, picks);
      if (!res.success) s.meta.pendingCoinFlipSquare = null;
      if (res.success && res.victimSquare) {
        await this.runVictimSquareFlash({
          type: "kill",
          visual: "coin",
          duration: 900,
          label: card.name,
          squares: [res.victimSquare],
          to: res.victimSquare,
        });
      }
      removeSpellOverlay(coinOverlay);
      this.spellAnimation = null;
      if (spec.visual) frame?.classList.remove(`board-frame--fx-${spec.visual}`);
      frame?.classList.remove("board-frame--spell-instant");
      if (banner) banner.className = "turn-banner";
      return finishSpellTrack(res);
    }

    const spec = buildAnimSpec(card, animPicks, this.localColor, extra);
    await this.runSpellAnimation(spec);
    return finishSpellTrack(applyCard(this.state, this.localColor, card, picks));
  }

  async castInstantSpell(card) {
    if (this.actionBusy || this.state.spellPlayed[this.localColor]) return;
    if (!this.canPlaySpells()) return;
    this.actionBusy = true;
    this.cancelCardPlay();
    try {
      const res = await this.applySpellWithAnimation(card, []);
      if (!res.success) {
        if (res.countered) this.finalizeCounteredSpell(card, res.message);
        else this.setMessage(res.message || "Spell failed.");
        return;
      }
      this.recordPvpSpell(
        card,
        [],
        res.cullTarget ? { cullTarget: res.cullTarget, cullVictim: res.cullVictim } : {}
      );
      this.removeCardFromHand(card);
      if (!this.state.meta.extraSpellCast?.[this.localColor]) this.state.spellPlayed[this.localColor] = true;
      else this.state.meta.extraSpellCast[this.localColor] = false;
      if (card.effect === "counterspell") {
        this.setMessage("Counterspell armed. They won't know until they cast.");
      } else if (card.effect === "vengeance") {
        this.setMessage("Vengeance armed. They won't know until they capture.");
      } else {
        this.setMessage(res.message || "Spell cast.");
      }
      if (this.hasMoveHistory()) {
        this.recordHistoryEntry(card.name, "spell", { color: this.localColor, picks: [] });
      }
      if (this.checkWin()) return;
      this.render();
      this.pushPvpState();
    } finally {
      this.actionBusy = false;
    }
  }

  async resolveTargetedSpell(card, picks) {
    this.actionBusy = true;
    try {
      const res = await this.applySpellWithAnimation(card, picks);
      return res;
    } finally {
      this.actionBusy = false;
    }
  }


  showAiSpellBanner(cardName, cardDesc) {
    const banner = this.$("ai-spell-banner");
    const title = this.$("ai-spell-banner-title");
    const desc = this.$("ai-spell-banner-desc");
    if (title) title.textContent = cardName || "Spell";
    if (desc) desc.textContent = cardDesc || "";
    banner?.classList.remove("hidden");
    this.$("ai-action-panel")?.classList.add("ai-action-panel--casting");
    this.$("board")?.closest(".board-frame")?.classList.add("board-frame--ai-spell");
    this.$("turn-banner")?.classList.add("turn-banner--enemy-spell");
    if (this.$("turn-banner")) {
      this.$("turn-banner").textContent = `${this.opponentName} casts ${cardName}!`;
    }
  }

  hideAiSpellBanner() {
    this.$("ai-spell-banner")?.classList.add("hidden");
    this.$("ai-action-panel")?.classList.remove("ai-action-panel--casting");
    this.$("board")?.closest(".board-frame")?.classList.remove("board-frame--ai-spell");
    this.$("turn-banner")?.classList.remove("turn-banner--enemy-spell");
  }

  buildAiSpellAnimExtra(entry) {
    const extra = {};
    const picks = entry.picks || [];
    const s = this.state;
    const oc = this.opponentColor;
    if (entry.cardEffect === "chain_lightning" && picks.length) {
      const [pr, pc] = picks[0];
      extra.chainSquares = getChainLightningAnimSquares(s, pr, pc, oc);
    }
    if (entry.cardEffect === "pyromancy" && picks.length >= 2) {
      extra.pyromancySquares = picks.slice(0, 2);
    }
    if (entry.cardEffect === "sanctuary" && picks.length) {
      extra.sanctuaryCells = getSanctuaryCells(picks[0][0], picks[0][1]);
    }
    if (entry.cardEffect === "darkness" && picks.length) {
      extra.darknessCells = getDarknessZoneCells(picks[0][0], picks[0][1]);
    }
    if (entry.cardEffect === "trickster") {
      const plan = planTrickster(s);
      if (plan?.squares) extra.tricksterSquares = plan.squares;
    }
    return extra;
  }

  /** Replay AI log: announce + apply each step (PvP can pass applyEntries: false). */
  async playAiTurnPresentation(log, { applyEntries = true } = {}) {
    const aiLog = this.$("ai-action-log");
    const oc = this.opponentColor;
    let afterSpell = false;
    for (const entry of log) {
      if (entry.type === "spell") {
        const def = entry.cardId ? getCardDef(entry.cardId) : null;
        const cardName = entry.cardName || def?.name || "Spell";
        const cardDesc = entry.cardDesc || def?.desc || entry.text || "";

        if (aiLog) {
          aiLog.innerHTML += `<div class="ai-log-entry ai-log-entry--spell ai-log-entry--active">✦ Casting <strong>${cardName}</strong></div>`;
          aiLog.scrollTop = aiLog.scrollHeight;
        }

        this.showAiSpellBanner(cardName, cardDesc);
        this.setMessage(`${this.opponentName} is casting ${cardName}…`);
        this.$("board")?.classList.add("board--ai-spell");
        this.render();
        await delay(AI_PACE.spellWindUp);

        if (entry.countered) {
          if (aiLog) {
            const active = aiLog.querySelector(".ai-log-entry--active");
            if (active) {
              active.classList.remove("ai-log-entry--active");
              active.innerHTML = `✦ <strong>${cardName}</strong> — countered`;
            }
          }
          this.setMessage(`${this.opponentName} casts ${cardName}…`);
          this.render();
          await delay(400);
          if (applyEntries) {
            applyAiReplayEntry(this.state, entry, oc);
            this.recordHistoryFromReplayEntry(entry);
          }
          this.render();
          await this.runCounterspellReveal();
          this.setMessage("Your Counterspell cancels their magic!");
        } else {
          if (aiLog) {
            const active = aiLog.querySelector(".ai-log-entry--active");
            if (active) {
              active.classList.remove("ai-log-entry--active");
              active.innerHTML = `✦ Cast <strong>${cardName}</strong>`;
            }
          }
          this.setMessage(`${this.opponentName} cast ${cardName}!`);
          this.render();

          if (applyEntries) {
            if (entry.cardEffect === "cull" && entry.cullTarget) {
              const [cr, cc] = entry.cullTarget;
              await this.playCullAnimation(cr, cc, entry.cullVictim || null);
            } else {
              const spec = buildAnimSpec(
                {
                  effect: entry.cardEffect,
                  mode: entry.cardMode || def?.mode || "instant",
                  name: cardName,
                },
                entry.picks || [],
                oc,
                this.buildAiSpellAnimExtra(entry)
              );
              await this.runSpellAnimation(spec);
            }
            applyAiReplayEntry(this.state, entry, oc);
            this.recordHistoryFromReplayEntry(entry);
            this.render();
          } else {
            await delay(AI_PACE.spellAnimMax);
          }
        }

        this.$("board")?.classList.remove("board--ai-spell");
        this.hideAiSpellBanner();
        await delay(AI_PACE.spellSettle);
        afterSpell = true;
      } else if (entry.type === "move") {
        this.hideAiSpellBanner();
        if (afterSpell) {
          await delay(AI_PACE.afterSpellBeforeMove);
          afterSpell = false;
        }
        this.aiHighlight = {
          from: entry.from,
          to: entry.to,
          captures: entry.captures || [],
        };
        if (aiLog) {
          aiLog.innerHTML += `<div class="ai-log-entry ai-log-entry--move">♟ ${entry.text}</div>`;
          aiLog.scrollTop = aiLog.scrollHeight;
        }
        this.setMessage(entry.text);
        this.render();
        await delay(AI_PACE.moveAnnounce);
        if (applyEntries) {
          applyAiReplayEntry(this.state, entry, oc);
          this.recordHistoryFromReplayEntry(entry);
        }
        this.aiHighlight = null;
        this.render();
        if (this.state.boardFx) {
          await new Promise((resolve) => this.playBoardFx(this.state, resolve));
        }
        await delay(AI_PACE.moveSettle);
      } else if (entry.type === "message") {
        if (aiLog) {
          aiLog.innerHTML += `<div class="ai-log-entry">${entry.text}</div>`;
          aiLog.scrollTop = aiLog.scrollHeight;
        }
        if (applyEntries) applyAiReplayEntry(this.state, entry, oc);
        this.setMessage(entry.text);
        this.render();
        await delay(AI_PACE.message);
      }
    }

    if (aiLog) aiLog.scrollTop = aiLog.scrollHeight;
  }

  pauseForBackground() {
    this._aiTurnPending = true;
  }

  resumeFromBackground() {
    if (!this._aiTurnPending || this.isPvp) return;
    if (this.state.gameOver || this.state.turn === this.localColor) {
      this._aiTurnPending = false;
      return;
    }
    this._aiTurnPending = false;
    void this.runOpponentTurn().catch((err) => console.error("AI turn failed:", err));
  }

  async finishOpponentTurn(capBefore) {
    const s = this.state;
    const capAfter = s.captured[this.localColor]?.length ?? 0;
    if (capAfter > capBefore) this.achievementTracker?.onOurPieceCaptured();

    tickEndTurnEffects(s.board, this.opponentColor, s);
    tickMeta(s, this.opponentColor);

    if (countPieces(s.board, this.localColor) === 0) {
      this.showGameOver("Defeat", "You lost all your pieces.");
      return;
    }
    if (countPieces(s.board, this.opponentColor) === 0) {
      this.showGameOver("Victory!", "You cleared the stage!");
      return;
    }

    s.turn = this.localColor;
    s.phase = PHASE.CARDS;
    saveMatchCheckpoint(this);
    this.beginPlayerTurn();
    this.setMessage("Your turn — cast a spell or select a piece to move.");
    this.render();
  }

  async runOpponentTurn() {
    if (this.isPvp) return;
    if (document.hidden) {
      this._aiTurnPending = true;
      return;
    }
    this._aiTurnPending = false;
    const s = this.state;
    if (s.gameOver) return;

    this.actionBusy = true;
    this.setMessage(`${this.opponentName} is acting…`);
    this.render();

    const capBefore = s.captured[this.localColor]?.length ?? 0;
    const boardBefore = JSON.stringify(s.board);
    const oc = this.opponentColor;
    let log = [];
    let planned = null;

    try {
      ({ log, work: planned } = planAiTurnWork(s, this.opponentName, oc));
    } catch (err) {
      console.error("AI plan failed:", err);
    }

    if (!planned || !log.length) {
      try {
        planned = cloneMatchState(s);
        log = runAiTurn(planned, this.opponentName, oc);
      } catch (err2) {
        console.error("AI plan fallback failed:", err2);
      }
    }

    try {
      if (log.length) {
        await Promise.race([
          this.playAiTurnPresentation(log),
          delay(AI_PACE.replayTimeout),
        ]);
      }
    } catch (err) {
      console.error("AI presentation failed:", err);
    } finally {
      this.aiHighlight = null;
      this.cullAnimation = null;
      this.spellAnimation = null;
      this.boardFx = null;
      this.actionBusy = false;
      if (planned && JSON.stringify(s.board) === boardBefore) {
        syncPlannedAiState(s, planned);
        this.render();
      }
    }

    await this.finishOpponentTurn(capBefore);
  }

  beginMovePhase() {
    const s = this.state;
    if (s.gameOver || s.turn !== this.localColor) return;
    this.cancelCardPlay();
    s.phase = PHASE.MOVE;
    const confused = this.pickConfusedMove(this.localColor);
    if (confused) {
      this.executeHumanMove(confused);
      return;
    }
    const moves = getAllMovesForColor(s.board, this.localColor, s);
    if (!moves.length) {
      this.setMessage("No moves — turn passes.");
      this.endHumanTurn();
      return;
    }
    this.setMessage("Spell skipped — select a piece to move.");
    this.render();
  }


  getZonePreviewSets() {
    const sanctuary = new Set();
    const darkness = new Set();
    if (!this.cardPlay || this.cardPlay.picks.length > 0) return { sanctuary, darkness };
    const { card } = this.cardPlay;
    for (const [r, c] of this.validTargets) {
      if (card.effect === "sanctuary") {
        for (const [zr, zc] of getSanctuaryCells(r, c)) sanctuary.add(`${zr},${zc}`);
      }
      if (card.effect === "darkness") {
        for (const [zr, zc] of getDarknessZoneCells(r, c)) darkness.add(`${zr},${zc}`);
      }
    }
    return { sanctuary, darkness };
  }

  renderHand() {
    const handEl = this.$("hand-red");
    const countLabel = this.$("hand-count-label");
    if (!handEl) return;
    handEl.innerHTML = "";
    const s = this.getViewState();
    const n = s.hands[this.localColor].length;
    if (countLabel) {
      countLabel.textContent = n === 1 ? "1 card in hand" : `${n} cards in hand`;
    }

    const canPlay = this.canPlaySpells();
    const castingId = this.cardPlay?.card?.instanceId;
    handEl.classList.toggle("spell-hand--locked", !canPlay);

    for (const card of s.hands[this.localColor]) {
      const playable =
        canPlay && (isInstant(card) || getValidTargets(s, this.localColor, card, []).length > 0);
      const el = renderSpellCardEl(card, {
        button: true,
        compact: true,
        selected: castingId === card.instanceId,
        disabled: !playable,
      });
      this.attachCardInput(el, card, canPlay);
      handEl.appendChild(el);
    }

    const opp = this.$("hand-black");
    if (opp) {
      opp.innerHTML = "";
      for (let i = 0; i < s.hands[this.opponentColor].length; i++) {
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
    const boardFrame = this.root.querySelector("#board-frame");
    boardFrame?.classList.toggle("board-frame--local-flipped", this.boardFlipped);
    boardEl.innerHTML = "";
    const s = this.getViewState();
    const zonePreview = this.getZonePreviewSets();

    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        const sq = document.createElement("button");
        sq.type = "button";
        sq.dataset.row = String(row);
        sq.dataset.col = String(col);
        const key = `${row},${col}`;
        const terrain = s.squares[key];
        let cls = `square ${isDarkSquare(row, col) ? "dark" : "light"}`;
        if (terrain?.mine && !terrain?.hiddenMine) cls += " has-mine";
        if (terrain?.quicksand && !terrain?.hiddenQuicksand) cls += " has-quicksand";
        if (terrain?.barrier?.turnsLeft > 0) cls += " has-barrier";
        if (terrain?.sanctuary && terrain?.sanctuaryTurns > 0) cls += " has-sanctuary";
        if (terrain?.darkness > 0) cls += " has-darkness-core";
        else if (isInDarknessZone(s, row, col)) cls += " has-darkness-zone";
        if (terrain?.fireTurns > 0) cls += " has-fire-tile";
        if (zonePreview.sanctuary.has(key)) cls += " sanctuary-zone-preview";
        if (zonePreview.darkness.has(key)) cls += " darkness-zone-preview";
        if (isSquareCollapsed(s.meta, row, col)) cls += " square--collapsed";
        sq.className = cls;

        if (terrain?.barrier?.turnsLeft > 0) {
          const barrierEl = document.createElement("div");
          barrierEl.className = "barrier-indicator";
          barrierEl.setAttribute("aria-label", `Barrier — ${terrain.barrier.turnsLeft} turn${terrain.barrier.turnsLeft === 1 ? "" : "s"} left`);
          const mark = document.createElement("span");
          mark.className = "barrier-indicator__mark";
          mark.textContent = "▮";
          mark.setAttribute("aria-hidden", "true");
          const turns = document.createElement("span");
          turns.className = "barrier-indicator__turns";
          turns.textContent = String(terrain.barrier.turnsLeft);
          barrierEl.appendChild(mark);
          barrierEl.appendChild(turns);
          sq.appendChild(barrierEl);
        }


        if (terrain?.sanctuary && terrain?.sanctuaryTurns > 0) {
          const sanctuaryEl = document.createElement("div");
          sanctuaryEl.className = "sanctuary-indicator";
          sanctuaryEl.setAttribute("aria-label", `Sanctuary — ${terrain.sanctuaryTurns} turn${terrain.sanctuaryTurns === 1 ? "" : "s"} left`);
          const mark = document.createElement("span");
          mark.className = "sanctuary-indicator__mark";
          mark.textContent = "✦";
          mark.setAttribute("aria-hidden", "true");
          const turns = document.createElement("span");
          turns.className = "sanctuary-indicator__turns";
          turns.textContent = String(terrain.sanctuaryTurns);
          sanctuaryEl.appendChild(mark);
          sanctuaryEl.appendChild(turns);
          sq.appendChild(sanctuaryEl);
        }

        if (terrain?.darkness > 0 || isInDarknessZone(s, row, col)) {
          const darkEl = document.createElement("div");
          darkEl.className = "darkness-indicator";
          darkEl.setAttribute("aria-hidden", "true");
          sq.appendChild(darkEl);
        }

        if (terrain?.fireTurns > 0) {
          const fireEl = document.createElement("div");
          fireEl.className = "fire-tile-indicator";
          fireEl.setAttribute(
            "aria-label",
            `Burning tile — ${terrain.fireTurns} turn${terrain.fireTurns === 1 ? "" : "s"} left`
          );
          const flames = document.createElement("span");
          flames.className = "fire-tile-indicator__flames";
          flames.textContent = "🔥";
          flames.setAttribute("aria-hidden", "true");
          const turns = document.createElement("span");
          turns.className = "fire-tile-indicator__turns";
          turns.textContent = String(terrain.fireTurns);
          fireEl.appendChild(flames);
          fireEl.appendChild(turns);
          sq.appendChild(fireEl);
        }

        if (this.aiHighlight?.from?.[0] === row && this.aiHighlight?.from?.[1] === col) {
          sq.classList.add("ai-from");
        }
        if (this.aiHighlight?.to?.[0] === row && this.aiHighlight?.to?.[1] === col) {
          sq.classList.add("ai-to");
        }
        if (this.aiHighlight?.captures?.some(([r, c]) => r === row && c === col)) {
          sq.classList.add("ai-capture");
        }
        if (this.boardFx?.squares?.some(([r, c]) => r === row && c === col)) {
          sq.classList.add(`board-fx-${this.boardFx.kind}`, "board-fx-blast");
        } else if (this.explosionFlash?.[0] === row && this.explosionFlash?.[1] === col) {
          sq.classList.add("explosion-flash");
        }
        if (this.selectedSquare?.[0] === row && this.selectedSquare?.[1] === col) sq.classList.add("selected");
        if (this.cardPlay?.card?.mode === "column" && this.selectedColumn === col) {
          sq.classList.add("column-highlight");
        }
        if (this.cardPlay?.card?.mode === "row" && this.selectedRow === row) {
          sq.classList.add("row-highlight");
        }
        if (
          !usesAxisPick(this.cardPlay?.card) &&
          this.validTargets.some(([r, c]) => r === row && c === col)
        ) {
          sq.classList.add("playable", "target", "spell-target");
        }
        const moveHere = this.validMoves.find((m) => m.to[0] === row && m.to[1] === col);
        if (moveHere) {
          sq.classList.add("playable");
          sq.classList.add(moveHere.captures?.length ? "capture-target" : "target");
        }

        if (
          this.cullAnimation &&
          this.cullAnimation.row === row &&
          this.cullAnimation.col === col
        ) {
          sq.classList.add("cull-execution", "spell-fx-shadow");
        }

        const animRole = this.squareInAnim(this.spellAnimation, row, col);
        if (animRole) {
          sq.classList.add(`spell-anim-${animRole}`);
          const vis = this.spellAnimation?.visual;
          if (vis) {
            applySquareSpellFx(sq, vis, animRole, {
              from: this.spellAnimation.from,
              to: this.spellAnimation.to,
              row,
              col,
            });
            if (vis === "fire" && animRole === "fire-line") sq.classList.add("spell-fx-fire-line");
            if (vis === "trickster") sq.classList.add("spell-fx-trickster");
          }
          if (this.spellAnimation?.type) sq.classList.add(`spell-anim-type-${this.spellAnimation.type}`);
        }

        const piece = s.board[row][col];
        if (piece) {
          const el = document.createElement("span");
          let skinClass = "";
          if (piece.color === this.localColor && this.cosmetics?.equipped?.pieceSkin) {
            const skinId = this.cosmetics.equipped.pieceSkin;
            if (skinId && skinId !== "skin_classic") {
              skinClass = ` piece-skin-${skinId.replace("skin_", "")}`;
            }
          }
          el.className = `piece ${piece.color}${piece.king ? " king" : ""}${skinClass}`;
          if (piece.shieldTurns > 0) el.classList.add("shielded");
          if (piece.frozenTurns > 0) el.classList.add("frozen");
          if (piece.paralyzedTurns > 0) el.classList.add("paralyzed-mark");
          if (piece.knightTurns > 0 || piece.isKnight) el.classList.add("knight-mark");
          if (piece.retreatTurns > 0) el.classList.add("retreat-mark");
          if (piece.bishopTurns > 0) el.classList.add("bishop-mark");
          if (piece.rookTurns > 0) el.classList.add("rook-mark");
          if (piece.bombArmed) el.classList.add("bomb-armed");
          if (piece.hibernationTurns > 0) el.classList.add("hibernating");
          if (piece.bearAwakened) el.classList.add("bear-awoken");
          if (piece.linkedFateId) el.classList.add("linked-fate");
          if (piece.revivedNoCapture) el.classList.add("revived-mark");
          if (piece.isClone) el.classList.add("clone-mark");
          if (piece.berserkNoCapture) el.classList.add("berserk-mark");
          if (piece.venom > 0) el.classList.add("poisoned");
          if (piece.blazeTurns > 0) el.classList.add("burning");
          if (
            this.cullAnimation &&
            this.cullAnimation.row === row &&
            this.cullAnimation.col === col
          ) {
            el.classList.add("piece--cull-victim");
          } else if (animRole === "kill" && this.spellAnimation?.type === "kill") {
            el.classList.add("piece--spell-kill-victim");
          }
          sq.appendChild(el);
          if (piece.shieldTurns > 0) {
            const shield = document.createElement("div");
            shield.className = "shield-indicator";
            shield.setAttribute("aria-label", `Shield — ${piece.shieldTurns} turn${piece.shieldTurns === 1 ? "" : "s"} left`);
            const mark = document.createElement("span");
            mark.className = "shield-indicator__mark";
            mark.textContent = "🛡";
            mark.setAttribute("aria-hidden", "true");
            const turns = document.createElement("span");
            turns.className = "shield-indicator__turns";
            turns.textContent = String(piece.shieldTurns);
            shield.appendChild(mark);
            shield.appendChild(turns);
            sq.appendChild(shield);
          }
          if (piece.venom > 0) {
            const poison = document.createElement("div");
            poison.className = "poison-indicator";
            const mark = document.createElement("span");
            mark.className = "poison-indicator__mark";
            mark.textContent = "☠";
            mark.setAttribute("aria-hidden", "true");
            const bar = document.createElement("div");
            bar.className = "poison-indicator__bar";
            bar.setAttribute("role", "meter");
            bar.setAttribute("aria-label", `Poison — ${piece.venom} turns left`);
            bar.setAttribute("aria-valuenow", String(piece.venom));
            bar.setAttribute("aria-valuemin", "0");
            bar.setAttribute("aria-valuemax", "6");
            for (let i = 0; i < 6; i++) {
              const block = document.createElement("span");
              block.className =
                "poison-indicator__block" + (i < piece.venom ? " poison-indicator__block--filled" : "");
              bar.appendChild(block);
            }
            poison.appendChild(mark);
            poison.appendChild(bar);
            sq.appendChild(poison);
          }
          if (piece.blazeTurns > 0) {
            const fire = document.createElement("div");
            fire.className = "fire-indicator";
            const mark = document.createElement("span");
            mark.className = "fire-indicator__mark";
            mark.textContent = "🔥";
            mark.setAttribute("aria-hidden", "true");
            const bar = document.createElement("div");
            bar.className = "fire-indicator__bar";
            bar.setAttribute("role", "meter");
            bar.setAttribute("aria-label", `Burning — ${piece.blazeTurns} turns left`);
            bar.setAttribute("aria-valuenow", String(piece.blazeTurns));
            bar.setAttribute("aria-valuemin", "0");
            bar.setAttribute("aria-valuemax", "2");
            for (let i = 0; i < 2; i++) {
              const block = document.createElement("span");
              block.className =
                "fire-indicator__block" + (i < piece.blazeTurns ? " fire-indicator__block--filled" : "");
              bar.appendChild(block);
            }
            fire.appendChild(mark);
            fire.appendChild(bar);
            sq.appendChild(fire);
          }
          if (piece.bishopTurns > 0) {
            const bishop = document.createElement("div");
            bishop.className = "bishop-indicator";
            bishop.setAttribute(
              "aria-label",
              `Bishop's Mark — ${piece.bishopTurns} turn${piece.bishopTurns === 1 ? "" : "s"} left`
            );
            const mark = document.createElement("span");
            mark.className = "bishop-indicator__mark";
            mark.textContent = "♗";
            mark.setAttribute("aria-hidden", "true");
            const bar = document.createElement("div");
            bar.className = "bishop-indicator__bar";
            bar.setAttribute("role", "meter");
            bar.setAttribute("aria-label", `Bishop's Mark — ${piece.bishopTurns} turns left`);
            bar.setAttribute("aria-valuenow", String(piece.bishopTurns));
            bar.setAttribute("aria-valuemin", "0");
            bar.setAttribute("aria-valuemax", "2");
            for (let i = 0; i < 2; i++) {
              const block = document.createElement("span");
              block.className =
                "bishop-indicator__block" + (i < piece.bishopTurns ? " bishop-indicator__block--filled" : "");
              bar.appendChild(block);
            }
            bishop.appendChild(mark);
            bishop.appendChild(bar);
            sq.appendChild(bishop);
          }
          if (piece.rookTurns > 0) {
            const rook = document.createElement("div");
            rook.className = "rook-indicator";
            rook.setAttribute(
              "aria-label",
              `Rook's Mark — ${piece.rookTurns} turn${piece.rookTurns === 1 ? "" : "s"} left`
            );
            const mark = document.createElement("span");
            mark.className = "rook-indicator__mark";
            mark.textContent = "♜";
            mark.setAttribute("aria-hidden", "true");
            const bar = document.createElement("div");
            bar.className = "rook-indicator__bar";
            bar.setAttribute("role", "meter");
            bar.setAttribute("aria-label", `Rook's Mark — ${piece.rookTurns} turns left`);
            bar.setAttribute("aria-valuenow", String(piece.rookTurns));
            bar.setAttribute("aria-valuemin", "0");
            bar.setAttribute("aria-valuemax", "2");
            for (let i = 0; i < 2; i++) {
              const block = document.createElement("span");
              block.className =
                "rook-indicator__block" + (i < piece.rookTurns ? " rook-indicator__block--filled" : "");
              bar.appendChild(block);
            }
            rook.appendChild(mark);
            rook.appendChild(bar);
            sq.appendChild(rook);
          }
        } else if (
          this.cullAnimation &&
          this.cullAnimation.row === row &&
          this.cullAnimation.col === col &&
          this.cullAnimation.victim
        ) {
          const v = this.cullAnimation.victim;
          const el = document.createElement("span");
          el.className = `piece ${v.color}${v.king ? " king" : ""} piece--cull-victim piece--cull-ghost`;
          sq.appendChild(el);
        }
        sq.addEventListener("click", () => this.onSquareClick(row, col));
        boardEl.appendChild(sq);
      }
    }
  }

  render() {
    const s = this.getViewState();
    const live = this.state;
    const banner = this.$("turn-banner");
    if (banner) {
      if (this.isViewingHistory()) {
        const idx = this.historyViewIndex;
        const entry = live.moveHistory?.[idx];
        banner.textContent = entry
          ? `Reviewing — ${formatHistoryChipLabel(entry, idx)}`
          : "Reviewing earlier position";
        banner.className = "turn-banner history-review";
      } else if (s.gameOver) banner.textContent = "Game over";
      else if (s.turn === this.localColor) {
        const spellNote = s.meta.shatterSilenced?.[this.localColor]
          ? "No spells (Shatter backlash) · "
          : s.meta.blinded?.[this.localColor]
            ? "No spells (Blinded) · "
            : s.spellPlayed[this.localColor]
            ? "Spell used · "
            : "1 spell available · ";
        if (this.cardPlay) {
          const axisMsg = axisPickMessage(this.cardPlay.card);
          banner.textContent = axisMsg
            ? `Casting ${axisMsg}`
            : `Casting ${this.cardPlay.card.name} — drop on board or tap highlights`;
          banner.className = "turn-banner casting";
        } else {
          banner.textContent =
            s.phase === PHASE.CARDS
              ? `${spellNote}cast a spell or select a piece to move`
              : "Select a piece to move";
          banner.className = "turn-banner";
        }
      } else {
        banner.textContent = `${this.opponentName} is thinking…`;
        banner.className = "turn-banner opponent-turn";
      }
    }
    const endBtn = this.root.querySelector("#btn-end-cards");
    if (endBtn) {
      endBtn.disabled =
        this.isViewingHistory() ||
        live.turn !== this.localColor ||
        live.phase !== PHASE.CARDS ||
        !!live.gameOver;
    }
    this.updateSpellCastUI();
    this.updateColumnPickUI();
    this.updateRowPickUI();
    this.updatePlayerPanels();
    this.renderHand();
    this.renderBoard();
    if (this.hasMoveHistory()) this.updateHistoryNavUI();
  }

  updatePlayerPanels() {
    const youIcon = this.root.querySelector(".panel-player .piece-icon");
    if (youIcon) youIcon.className = `piece-icon ${this.localColor}`;
    const oppIcon = this.root.querySelector(".panel-opponent .piece-icon");
    if (oppIcon) oppIcon.className = `piece-icon ${this.opponentColor}`;
  }
}
