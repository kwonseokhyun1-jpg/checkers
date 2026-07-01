/**
 * In-match controller: deck size from DECK_SIZE, 3 start hand, max 5, 1 spell/turn, draw every 2 turns
 */
import {
  SIZE,
  COLORS,
  LAST_STAND_SHIELD_TURNS,
  VENGEANCE_BLOOD_TURNS,
  PLAGUE_TURNS,
  isDarkSquare,
  createInitialBoard,
  getAllMovesForColor,
  applyMove,
  countPieces,
  tickEffects,
  tickEndTurnEffects,
  findPanicPiece,
  getBackwardStepMoves,
} from "./board.js";
import { createMatchMeta, startTurnMeta, tickMeta, tryConsumeCounterspell, isSquareCollapsed, ensureConstitutionTurns, takeTrapHistoryReveal, flushPendingBountyMessage, hasVengeanceArmed, isConfused, clearConfusion } from "./gameMeta.js";
import {
  initCardState,
  isInstant,
  canCastInstant,
  getInstantCastBlockReason,
  isHiddenTrapSpell,
  getCardHint,
  getValidTargets,
  playInstant,
  applyCard,
  picksRequiredForCard,
} from "./cardEffects.js";
import { planAiTurnWork, runAiTurn, cloneMatchState, syncPlannedAiState, applyAiReplayEntry } from "./ai.js";
import { formatPieceStatusMessage, getPieceStatus } from "./pieceStatus.js";
import { DRAW_EVERY_TURNS, START_HAND, getCardDef } from "./cardCatalog.js";
import { pieceSkinCssSuffix } from "./cosmetics.js";
import { renderSpellCardEl } from "./cardArt.js";
import { getCardEffectTags } from "./cardEffectTags.js";
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
import {
  applySquareSpellFx,
  mountSpellOverlay,
  removeSpellOverlay,
  revealCoinFlipResult,
  formatCoinFlipResult,
} from "./spellFx.js";
import { pickCoinFlipVictim, pickRandomTeleportDestination } from "./cardEffectHandlers.js";
import { boardFxDuration } from "./boardFx.js";
import { planTrickster, getChainLightningAnimSquares, getSanctuaryCells, getDarknessZoneCells } from "./cardEffectHandlers.js";
import { isInDarknessZone } from "./gameMeta.js";
import {
  saveMatchCheckpoint,
  clearMatchCheckpoint,
  consumeLeaveConfirmSkip,
  clearPendingNavigationTab,
} from "./matchLifecycle.js";
import { mobileConfirm } from "./mobileConfirm.js";
import { createMatchAchievementTracker } from "./achievementTracker.js";
import { recordSpellPlayed } from "./profileStats.js";
import { saveProfile } from "./storage.js";
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

const BOUNTY_WANTED_SVG = `<svg viewBox="0 0 24 28" aria-hidden="true"><rect x="1" y="1" width="22" height="26" rx="2" fill="#fef3c7" stroke="#d97706" stroke-width="1.4"/><text x="12" y="9" text-anchor="middle" font-size="4.8" font-weight="700" fill="#92400e" font-family="Georgia,serif">WANTED</text><line x1="4" y1="11.5" x2="20" y2="11.5" stroke="#d97706" stroke-width="0.8"/><circle cx="12" cy="19" r="5.2" fill="#dc2626" stroke="#7f1d1d" stroke-width="1"/><ellipse cx="10" cy="17.2" rx="2.2" ry="1.4" fill="rgba(255,255,255,0.35)"/></svg>`;

/** Extra time the top spell banner stays visible */
const SPELL_BANNER_EXTRA_MS = 1000;

const COIN_FLIP_SPIN_MS = 800;
const COIN_FLIP_REVEAL_MS = 180;
const COIN_FLIP_VICTIM_MS = 650;

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

export function isMutualElimination(state) {
  if (!state?.board) return false;
  return countPieces(state.board, COLORS.RED) === 0 && countPieces(state.board, COLORS.BLACK) === 0;
}

export function isPvpTerminalBoard(state, localColor) {
  if (!state?.board) return false;
  const opp = localColor === COLORS.RED ? COLORS.BLACK : COLORS.RED;
  return countPieces(state.board, localColor) === 0 || countPieces(state.board, opp) === 0;
}

export function createMatchState(playerDeckIds, aiDeckIds = null, options = {}) {
  const state = {
    board: createInitialBoard({ challengeMode: !!options.challengeMode }),
    hands: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    turn: COLORS.RED,
    phase: PHASE.CARDS,
    meta: createMatchMeta(),
    squares: {},
    captured: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    gameOver: null,
    turnNumber: { [COLORS.RED]: 0, [COLORS.BLACK]: 0 },
    spellPlayed: { [COLORS.RED]: false, [COLORS.BLACK]: false },
    spellPhaseOpen: { [COLORS.RED]: true, [COLORS.BLACK]: true },
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

function picksRequired(card, picks = [], state = null, color = null) {
  return picksRequiredForCard(card, picks, state, color);
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
    this.opponentCosmetics = options.opponentCosmetics || null;
    this.profile = options.profile || null;
    this.isPvp = !!options.pvp;
    this.localColor = options.localColor ?? COLORS.RED;
    this.opponentColor = this.localColor === COLORS.RED ? COLORS.BLACK : COLORS.RED;
    /** In PvP, black (guest) sees the board from their side — pieces advance toward them. */
    this.boardFlipped = this.isPvp && this.localColor === COLORS.BLACK;
    this.opponentName = options.opponentName || "Opponent";
    this.onStateSync = options.onStateSync ?? null;
    this.onPvpWin = options.onPvpWin ?? null;
    this.onPvpForfeit = options.onPvpForfeit ?? null;
    this.onPvpPendingRow = options.onPvpPendingRow ?? null;
    this.skipCheckpoint = !!options.skipCheckpoint;
    /** @type {import('./tutorialMatch.js').TutorialHooks | null} */
    this.tutorialHooks = options.tutorialHooks ?? null;
    this._syncBusy = false;
    this._syncDirty = false;
    this._pendingPvpRow = null;
    /** Last server turn key we ran beginPlayerTurn for in PvP (`${turn}_${turnNumber[local]}_${moveHistory.length}`). */
    this._pvpLocalTurnKey = null;
    this._lastPvpSpellSeq = options.initialState?.pvpLastSpell?.seq ?? 0;
    if (options.initialState) {
      this.state = options.initialState;
      this.state.meta = { ...createMatchMeta(), ...this.state.meta };
      ensureConstitutionTurns(this.state.meta);
    } else {
      this.state = createMatchState(deckCardIds, options.aiDeckIds ?? null, {
        challengeMode: !!options.challengeMode,
      });
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
    this._suppressScrollClickTimer = null;
    this._handScrollBound = false;
    this.aiHighlight = null;
    this._moveAnimHideFrom = null;
    this.cullAnimation = null;
    this.coinFlipVictimAnim = null;
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
      this.profile && !this.isPvp
        ? createMatchAchievementTracker(this.profile, this.localColor, this.state)
        : null;
    if (this.achievementTracker) {
      this.state.meta.achievementHook = this.achievementTracker;
    }
    this.bindEls();
    if (this.hasMoveHistory()) ensureStartHistory(this.state);
    if (options.initialState && this.isPvp) {
      if (this.state.turn === this.localColor && !this.state.gameOver) {
        this._beginLocalPvpTurnIfNeeded(this.state);
      }
    } else if (!(options.initialState && this.isPvp)) {
      if (options.skipInitialTurn) {
        // Tutorial / restored snapshots set up turn phase after construction.
      } else if (
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

  recordPendingTrapHistory() {
    if (!this.hasMoveHistory()) return;
    const trap = takeTrapHistoryReveal(this.state);
    if (!trap) return;
    appendHistoryEntry(this.state, {
      label: trap.label,
      type: "spell",
      color: trap.color,
      picks: trap.picks,
      trapTriggered: true,
    });
    this.historyViewIndex = null;
    const aiLog = this.$("ai-action-log");
    if (aiLog) {
      aiLog.innerHTML += `<div class="ai-log-entry ai-log-entry--spell">✦ Trap: <strong>${trap.label}</strong></div>`;
      aiLog.scrollTop = aiLog.scrollHeight;
    }
  }

  recordHistoryWithTrapFollowUp(label, type, extras = {}) {
    this.recordHistoryEntry(label, type, extras);
    this.recordPendingTrapHistory();
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

    if (status) status.classList.add("hidden");

    if (!track) return;
    const entry = history[viewIdx];
    const reviewing = this.isViewingHistory();
    let label = "Start";
    if (entry) {
      label =
        entry.type === "start"
          ? entry.label || "Start"
          : formatHistoryChipLabel(entry, viewIdx);
      if (reviewing) label = `Reviewing: ${label}`;
    } else if (reviewing) {
      label = "Reviewing earlier position";
    }

    let labelEl = track.querySelector(".pvp-move-history__label");
    if (!labelEl) {
      track.innerHTML = "";
      labelEl = document.createElement("span");
      labelEl.className = "pvp-move-history__label";
      labelEl.setAttribute("aria-live", "polite");
      track.appendChild(labelEl);
    }
    labelEl.textContent = label;
    labelEl.classList.toggle("pvp-move-history__label--review", reviewing);
    track.setAttribute("aria-label", `Move ${viewIdx} of ${max}`);
  }

  recordHistoryFromReplayEntry(entry) {
    if (!this.hasMoveHistory() || this.isPvp) return;
    const oc = this.opponentColor;
    if (entry.type === "spell") {
      const def = entry.cardId ? getCardDef(entry.cardId) : null;
      const cardName = entry.cardName || def?.name || "Spell";
      const record = entry.countered ? this.recordHistoryEntry.bind(this) : this.recordHistoryWithTrapFollowUp.bind(this);
      record(cardName, "spell", {
        color: oc,
        picks: entry.picks?.map((p) => [...p]) ?? [],
      });
    } else if (entry.type === "move") {
      this.recordHistoryWithTrapFollowUp(entry.text, "move", {
        color: oc,
        from: entry.from ? [...entry.from] : undefined,
        to: entry.to ? [...entry.to] : undefined,
        captures: entry.captures?.map((c) => [...c]) ?? [],
      });
    }
  }

  shouldDeferTrapHistory(card) {
    return card && isHiddenTrapSpell(card);
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
    this.root.querySelector("#btn-cancel-card")?.addEventListener("click", () => this.cancelCardPlay());
    this.root.querySelector("#btn-leave-match")?.addEventListener("click", async () => {
      if (this.tutorialHooks?.onLeaveRequest) {
        this.tutorialHooks.onLeaveRequest();
        return;
      }
      const skipConfirm = consumeLeaveConfirmSkip();
      if (this.isPvp) {
        if (
          !skipConfirm &&
          !(await mobileConfirm("Leave this match? Your opponent wins automatically.", {
            title: "Leave match?",
            confirmLabel: "Leave",
            cancelLabel: "Stay",
            destructive: true,
          }))
        ) {
          clearPendingNavigationTab();
          return;
        }
        await this.onPvpForfeit?.();
        this.onExit?.();
        return;
      }
      if (
        !skipConfirm &&
        !(await mobileConfirm("Leave this match? Your progress is saved — you can resume when you return.", {
          title: "Leave match?",
          confirmLabel: "Leave",
          cancelLabel: "Stay",
        }))
      ) {
        clearPendingNavigationTab();
        return;
      }
      if (!this.skipCheckpoint) saveMatchCheckpoint(this);
      this.onExit?.();
    });
    this.root.querySelector("#btn-restart-match")?.addEventListener("click", () => this.onExit?.());
    this.$("pvp-history-prev")?.addEventListener("click", () => this.stepHistory(-1));
    this.$("pvp-history-next")?.addEventListener("click", () => this.stepHistory(1));
    this._onDocPointerMove = (e) => this.onDragMove(e);
    this._onDocPointerUp = (e) => this.onDragEnd(e);
    this.bindHandScroll();

    document.addEventListener("keydown", this._onKeyDown);
  }

  bindHandScroll() {
    const handEl = this.$("hand-red");
    if (!handEl || this._handScrollBound) return;
    this._handScrollBound = true;
    handEl.addEventListener(
      "scroll",
      () => {
        this._suppressClick = true;
        clearTimeout(this._suppressScrollClickTimer);
        this._suppressScrollClickTimer = setTimeout(() => {
          this._suppressClick = false;
        }, 280);
      },
      { passive: true }
    );
  }

  dispose() {
    this.achievementTracker?.dispose();
    clearTimeout(this._suppressScrollClickTimer);
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
      if (!this.canEndSpellPhase()) return;
      e.preventDefault();
      this.beginMovePhase();
    }
  }

  canMovePieces() {
    const s = this.state;
    if (
      !(
        !this.isViewingHistory() &&
        s.turn === this.localColor &&
        (s.phase === PHASE.MOVE || s.phase === PHASE.CARDS) &&
        !s.gameOver &&
        !this.actionBusy &&
        !this.cardPlay &&
        !isConfused(s.meta, this.localColor)
      )
    ) {
      return false;
    }
    if (this.tutorialHooks?.canMovePieces === false) return false;
    if (typeof this.tutorialHooks?.canMovePieces === "function") {
      return this.tutorialHooks.canMovePieces(this);
    }
    return true;
  }

  canEndSpellPhase() {
    if (this.tutorialHooks?.canEndSpellPhase === false) return false;
    if (typeof this.tutorialHooks?.canEndSpellPhase === "function") {
      return this.tutorialHooks.canEndSpellPhase(this);
    }
    return true;
  }

  ensureSpellPhaseOpen(color) {
    const s = this.state;
    if (!s.spellPhaseOpen) {
      s.spellPhaseOpen = { [COLORS.RED]: true, [COLORS.BLACK]: true };
    }
    if (s.spellPhaseOpen[color] === undefined) {
      s.spellPhaseOpen[color] = s.phase === PHASE.CARDS;
    }
    return !!s.spellPhaseOpen[color];
  }

  closeSpellPhase(color = this.localColor) {
    const s = this.state;
    if (!s.spellPhaseOpen) {
      s.spellPhaseOpen = { [COLORS.RED]: true, [COLORS.BLACK]: true };
    }
    s.spellPhaseOpen[color] = false;
  }

  canPlaySpells() {
    const s = this.state;
    return (
      !this.isViewingHistory() &&
      s.turn === this.localColor &&
      this.ensureSpellPhaseOpen(this.localColor) &&
      !s.gameOver &&
      !s.spellPlayed[this.localColor] &&
      !s.meta.shatterSilenced?.[this.localColor] &&
      !s.meta.blinded?.[this.localColor] &&
      !isConfused(s.meta, this.localColor) &&
      !this.actionBusy &&
      !this.cardPlay
    );
  }

  pickConfusedMove(color) {
    const s = this.state;
    if (!isConfused(s.meta, color)) return null;
    clearConfusion(s.meta, color);
    const pool = getAllMovesForColor(s.board, color, s);
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  async playPieceMoveAnimation(move, { message = null } = {}) {
    const board = this.$("board");
    if (!board) {
      await delay(AI_PACE.moveAnnounce);
      return;
    }

    const [fr, fc] = move.from;
    const [tr, tc] = move.to;
    this.aiHighlight = {
      from: move.from,
      to: move.to,
      captures: move.captures || [],
    };
    if (message) this.setMessage(message);
    this.render();

    await delay(280);

    const fromSq = board.querySelector(`[data-row="${fr}"][data-col="${fc}"]`);
    const toSq = board.querySelector(`[data-row="${tr}"][data-col="${tc}"]`);
    const pieceEl = fromSq?.querySelector(".piece");
    if (!fromSq || !toSq || !pieceEl) {
      this.aiHighlight = null;
      this.render();
      return;
    }

    const boardRect = board.getBoundingClientRect();
    const fromRect = fromSq.getBoundingClientRect();
    const toRect = toSq.getBoundingClientRect();
    const inset = 0.14;

    const flyer = pieceEl.cloneNode(true);
    flyer.classList.add("piece--ai-flying");
    flyer.style.position = "absolute";
    flyer.style.margin = "0";
    flyer.style.pointerEvents = "none";
    flyer.style.zIndex = "30";
    flyer.style.transition =
      "left 0.6s cubic-bezier(0.4, 0, 0.2, 1), top 0.6s cubic-bezier(0.4, 0, 0.2, 1)";

    const w = fromRect.width * (1 - 2 * inset);
    const h = fromRect.height * (1 - 2 * inset);
    flyer.style.left = `${fromRect.left - boardRect.left + fromRect.width * inset}px`;
    flyer.style.top = `${fromRect.top - boardRect.top + fromRect.height * inset}px`;
    flyer.style.width = `${w}px`;
    flyer.style.height = `${h}px`;
    board.appendChild(flyer);

    // Hide the board piece only after the flyer is in place (no render — that would remove the flyer).
    this._moveAnimHideFrom = [fr, fc];
    pieceEl.classList.add("piece--move-hidden");

    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    flyer.style.left = `${toRect.left - boardRect.left + toRect.width * inset}px`;
    flyer.style.top = `${toRect.top - boardRect.top + toRect.height * inset}px`;

    await new Promise((resolve) => {
      const finish = () => resolve();
      flyer.addEventListener("transitionend", finish, { once: true });
      setTimeout(finish, 680);
    });

    flyer.remove();
    this._moveAnimHideFrom = null;
    this.aiHighlight = null;
  }

  showPieceInfo(piece, row, col) {
    const infoEl = this.$("piece-info");
    let { buffs, curses } = getPieceStatus(piece);
    if (piece.color !== this.localColor) {
      buffs = buffs.filter((b) => b.label !== "Last Stand (ultra shield on capture)");
    }
    if (piece.king) {
      const turns = ensureConstitutionTurns(this.state.meta)[piece.color];
      if (turns > 0) buffs.push({ label: "Constitution", turns });
    }
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

  _pvpLocalTurnKeyFor(state) {
    const n = state.turnNumber?.[this.localColor] ?? 0;
    const hist = state.moveHistory?.length ?? 0;
    return `${state.turn}_${n}_${hist}`;
  }

  /** Run PvP turn-start cleanup once per authoritative server turn (spell flags, meta, draws). */
  _beginLocalPvpTurnIfNeeded(state, { prevTurn = null } = {}) {
    if (!this.isPvp || !state || state.gameOver || state.turn !== this.localColor) return false;
    const key = this._pvpLocalTurnKeyFor(state);
    if (key === this._pvpLocalTurnKey) {
      if (
        prevTurn === this.opponentColor &&
        (state.spellPlayed[this.localColor] ||
          (state.meta.shatterSilenced?.[this.localColor] &&
            !state.meta.shatterSilenceNext?.[this.localColor]))
      ) {
        this._resetLocalPvpTurnFlags();
        return true;
      }
      return false;
    }
    this._pvpLocalTurnKey = key;
    this.beginPlayerTurn();
    if (this.isPvp) void this.pushPvpState();
    return true;
  }

  /** Clear per-turn spell gates without advancing turn counters (stale synced state). */
  _resetLocalPvpTurnFlags() {
    const s = this.state;
    const color = this.localColor;
    s.spellPlayed[color] = false;
    s.phase = PHASE.CARDS;
    if (!s.spellPhaseOpen) s.spellPhaseOpen = { [COLORS.RED]: true, [COLORS.BLACK]: true };
    s.spellPhaseOpen[color] = true;
    this.actionBusy = false;
    this.cardPlay = null;
    this.selectedSquare = null;
    this.validMoves = [];
    startTurnMeta(s, color);
  }

  beginTurn(color) {
    const s = this.state;
    tickEffects(s.board, color, s);
    s.turnNumber[color]++;
    s.spellPlayed[color] = false;
    s.phase = PHASE.CARDS;
    if (!s.spellPhaseOpen) s.spellPhaseOpen = { [COLORS.RED]: true, [COLORS.BLACK]: true };
    s.spellPhaseOpen[color] = true;
    this.actionBusy = false;
    this.cardPlay = null;
    this.selectedSquare = null;
    this.validMoves = [];
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
      this.setMessage("Spell backlash — no spells this turn. Select a piece to move.");
    } else if (color === this.localColor && s.meta.blinded?.[color]) {
      this.setMessage("You are blinded — no spells this turn. Select a piece to move.");
    } else if (color === this.localColor && isConfused(s.meta, color)) {
      this.setMessage("Confusion — no spells. A random move will be chosen…");
      queueMicrotask(() => {
        if (
          s.turn === color &&
          s.phase === PHASE.CARDS &&
          !s.gameOver &&
          isConfused(s.meta, color) &&
          !this.actionBusy
        ) {
          void this.beginMovePhase();
        }
      });
    } else if (color === this.localColor && s.meta.pendingPressMove?.[color]) {
      this.setMessage("Press — you'll move again after your normal move. Select a piece.");
    }
  }

  beginAiTurn() {
    this.beginTurn(this.opponentColor);
  }

  /** Keep the latest match row while spell replay blocks sync. */
  queuePvpRow(row) {
    if (!row?.state_json) return;
    const ver = row.version ?? 0;
    const pendingVer = this._pendingPvpRow?.version ?? -1;
    if (ver >= pendingVer) this._pendingPvpRow = row;
  }

  flushPendingPvpRow() {
    const row = this._pendingPvpRow;
    this._pendingPvpRow = null;
    return row;
  }

  /** Apply authoritative state from PvP sync (opponent moved). */
  importState(nextState) {
    if (!nextState || this.actionBusy || this._syncBusy) return false;
    const prevTurn = this.state?.turn;
    const prevSpellSeq = this.state?.pvpLastSpell?.seq ?? this._lastPvpSpellSeq ?? 0;
    const incomingSpell = nextState.pvpLastSpell;
    const replaySpell =
      this.isPvp &&
      incomingSpell &&
      incomingSpell.seq > prevSpellSeq &&
      incomingSpell.caster === this.opponentColor;
    const prevLocalPvpDeck = this.isPvp
      ? {
          turnNumber: this.state?.turnNumber?.[this.localColor] ?? 0,
          hand: this.state?.hands?.[this.localColor],
          drawPile: this.state?.drawPile?.[this.localColor],
          discardPile: this.state?.discardPile?.[this.localColor],
        }
      : null;

    this.state = nextState;
    if (
      this.isPvp &&
      prevLocalPvpDeck &&
      prevLocalPvpDeck.turnNumber > (this.state.turnNumber?.[this.localColor] ?? 0)
    ) {
      this.state.turnNumber[this.localColor] = prevLocalPvpDeck.turnNumber;
      if (prevLocalPvpDeck.hand) this.state.hands[this.localColor] = prevLocalPvpDeck.hand;
      if (prevLocalPvpDeck.drawPile) this.state.drawPile[this.localColor] = prevLocalPvpDeck.drawPile;
      if (prevLocalPvpDeck.discardPile) {
        this.state.discardPile[this.localColor] = prevLocalPvpDeck.discardPile;
      }
    } else if (this.isPvp && this._syncDirty && prevLocalPvpDeck && this.state.turn === this.localColor) {
      if (prevLocalPvpDeck.hand) this.state.hands[this.localColor] = prevLocalPvpDeck.hand;
      if (prevLocalPvpDeck.drawPile) this.state.drawPile[this.localColor] = prevLocalPvpDeck.drawPile;
      if (prevLocalPvpDeck.discardPile) {
        this.state.discardPile[this.localColor] = prevLocalPvpDeck.discardPile;
      }
    }
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
    if (this.isPvp && !this.state.gameOver && this.state.turn === this.localColor) {
      this._beginLocalPvpTurnIfNeeded(this.state, { prevTurn });
    }
    this.updateSpellCastUI();
    this.applyPvpOutcomeFromBoard();
    this.updateHistoryNavUI();
    this.render();
    if (replaySpell) void this.replayOpponentPvpSpell(incomingSpell);
    return true;
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
            hidden: !!spell.hidden,
            ...this.pvpSpellReplayFields(spell),
          },
        ],
        { applyEntries: false }
      );
    } finally {
      this.actionBusy = false;
      const pendingRow = this.flushPendingPvpRow();
      if (pendingRow && this.onPvpPendingRow) {
        this.onPvpPendingRow(pendingRow);
      } else if (pendingRow?.state_json) {
        this.importState(pendingRow.state_json);
      } else {
        this.render();
      }
    }
  }

  applyPvpOutcomeFromBoard() {
    if (!this.isPvp || this._gameOverUiShown) return;
    if (!isPvpTerminalBoard(this.state, this.localColor)) return;
    if (isMutualElimination(this.state)) {
      void this.showGameOver("Tie!", "Both players lost all their pieces.");
      return;
    }
    if (countPieces(this.state.board, this.opponentColor) === 0) {
      void this.showGameOver("Victory!", "You won the match!");
      return;
    }
    void this.showGameOver("Defeat", "You lost the match.");
  }

  pushPvpState() {
    if (!this.isPvp || !this.onStateSync) return Promise.resolve();
    this._syncDirty = true;
    if (this._syncBusy) return this._syncPromise ?? Promise.resolve();
    return this._flushPvpState();
  }

  _flushPvpState() {
    if (!this._syncDirty || !this.onStateSync) return Promise.resolve();
    this._syncBusy = true;
    this._syncDirty = false;
    const state = this.state;
    this._syncPromise = Promise.resolve(this.onStateSync(state))
      .catch((err) => console.error("PvP state sync failed:", err))
      .finally(() => {
        this._syncBusy = false;
        this._syncPromise = null;
        const pendingRow = this.flushPendingPvpRow();
        if (pendingRow && this.onPvpPendingRow) {
          this.onPvpPendingRow(pendingRow);
        } else if (pendingRow?.state_json) {
          this.importState(pendingRow.state_json);
        }
        if (this._syncDirty) void this._flushPvpState();
      });
    return this._syncPromise;
  }

  copyPvpSquares(arr) {
    return (arr || []).map((p) => [...p]);
  }

  collectPvpAnimExtras(extra = {}, animPicks = null) {
    const out = {};
    if (extra.chainSquares?.length) out.chainSquares = this.copyPvpSquares(extra.chainSquares);
    if (extra.pyromancySquares?.length) out.pyromancySquares = this.copyPvpSquares(extra.pyromancySquares);
    if (extra.sanctuaryCells?.length) out.sanctuaryCells = this.copyPvpSquares(extra.sanctuaryCells);
    if (extra.darknessCells?.length) out.darknessCells = this.copyPvpSquares(extra.darknessCells);
    if (extra.tricksterSquares?.length) out.tricksterSquares = this.copyPvpSquares(extra.tricksterSquares);
    if (extra.backstabTo) out.backstabTo = [...extra.backstabTo];
    if (extra.cryoShatter != null) out.cryoShatter = extra.cryoShatter;
    if (animPicks?.length > 1) out.animPicks = this.copyPvpSquares(animPicks);
    return out;
  }

  pvpSpellReplayFields(spell) {
    if (!spell) return {};
    return {
      ...(spell.cullTarget ? { cullTarget: spell.cullTarget, cullVictim: spell.cullVictim } : {}),
      ...(spell.coinFlipSquare
        ? {
            coinFlipSquare: spell.coinFlipSquare,
            coinFlipVictimColor: spell.coinFlipVictimColor,
            coinFlipVictim: spell.coinFlipVictim,
          }
        : {}),
      ...(spell.chainSquares ? { chainSquares: spell.chainSquares } : {}),
      ...(spell.pyromancySquares ? { pyromancySquares: spell.pyromancySquares } : {}),
      ...(spell.sanctuaryCells ? { sanctuaryCells: spell.sanctuaryCells } : {}),
      ...(spell.darknessCells ? { darknessCells: spell.darknessCells } : {}),
      ...(spell.tricksterSquares ? { tricksterSquares: spell.tricksterSquares } : {}),
      ...(spell.backstabTo ? { backstabTo: spell.backstabTo } : {}),
      ...(spell.cryoShatter != null ? { cryoShatter: spell.cryoShatter } : {}),
      ...(spell.animPicks ? { animPicks: spell.animPicks } : {}),
    };
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
      hidden: !!extras.hidden || isHiddenTrapSpell(card),
      ...this.pvpSpellReplayFields(extras),
    };
    this._lastPvpSpellSeq = seq;
  }

  removeCardFromHand(card) {
    const hand = this.state.hands[this.localColor];
    const i = hand.findIndex((c) => c.instanceId === card.instanceId);
    if (i >= 0) hand.splice(i, 1);
  }

  recordSuccessfulSpellCast() {
    if (!this.profile) return;
    recordSpellPlayed(this.profile);
    saveProfile(this.profile);
  }

  dismissCardTargetingUI() {
    this.cardPlay = null;
    this.validTargets = [];
    this.selectedSquare = null;
    this.selectedColumn = null;
    this.selectedRow = null;
    this.endDrag();
    this.updateSpellCastUI();
  }

  updateSpellCastUI() {
    const bar = this.$("spell-cast-bar");
    if (!bar) return;
    const active = !!this.cardPlay;
    bar.classList.toggle("hidden", !active);
    this.root.querySelector(".match-wrap")?.classList.toggle("casting-spell", active);

    if (!active) return;
    const { card, picks } = this.cardPlay;
    const hint = this.$("spell-cast-hint");
    const desc = this.$("spell-cast-desc");
    const need = picksRequired(card, picks, this.state, this.localColor);
    const step = picks.length + 1;
    const base = getCardHint(card);
    if (hint) {
      hint.textContent =
        picks.length >= need
          ? base
          : card.mode === "column" || card.mode === "row"
            ? base
            : need > 1
              ? `${base} (${step}/${need})`
              : base;
    }
    if (desc) {
      const tags = getCardEffectTags(card);
      const text = tags.join(" · ");
      desc.textContent = text;
      const showDesc = !!text;
      desc.hidden = !showDesc;
      desc.setAttribute("aria-hidden", showDesc ? "false" : "true");
      bar.classList.toggle("spell-cast-bar--has-desc", showDesc);
    }
  }

  finishCardPlay(msg, replayExtras = {}, spellCtx = null) {
    const card = spellCtx?.card ?? this.cardPlay?.card;
    const picks = spellCtx?.picks ?? (this.cardPlay?.picks ? [...this.cardPlay.picks] : []);
    const bonusSpell = !!this.state.meta.extraSpellCast?.[this.localColor];
    if (card) {
      this.recordPvpSpell(card, picks, replayExtras);
      this.removeCardFromHand(card);
      this.recordSuccessfulSpellCast();
    }
    if (!bonusSpell) this.state.spellPlayed[this.localColor] = true;
    else this.state.meta.extraSpellCast[this.localColor] = false;
    this.dismissCardTargetingUI();
    if (card && this.hasMoveHistory() && !this.shouldDeferTrapHistory(card)) {
      this.recordHistoryEntry(card.name, "spell", {
        color: this.localColor,
        picks: picks.map((p) => [...p]),
      });
    }
    if (card && this.tutorialHooks?.onSpellPlayed) {
      this.tutorialHooks.onSpellPlayed(this, card, picks);
    }
    this.render();
    if (this.checkWin()) return;
    this.pushPvpState();
    if (!this.state.gameOver) {
      if (bonusSpell) {
        this.state.phase = PHASE.CARDS;
        this.setMessage(msg || "Cast another spell.");
        this.render();
        return;
      }
      const moveMsg = msg ? `${msg} Select a piece to move.` : undefined;
      if (this.canMovePieces()) {
        this.beginMovePhase({ afterSpell: true, spellMessage: moveMsg });
      }
    }
  }

  cancelCardPlay() {
    this.dismissCardTargetingUI();
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
      const blockReason = getInstantCastBlockReason(this.state, this.localColor, card);
      if (blockReason) {
        this.setMessage(blockReason);
        return false;
      }
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
    this.setMessage("");
    document.activeElement?.blur?.();
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
    const need = picksRequired(card, picks, this.state, this.localColor);
    if (picks.length < need) {
      this.validTargets = getValidTargets(this.state, this.localColor, card, picks);
      this.selectedSquare = picks[picks.length - 1];
      this.updateSpellCastUI();
      this.render();
      return;
    }
    const finalPicks = [...picks];
    const spellCtx = { card, picks: finalPicks };
    this.dismissCardTargetingUI();
    this.render();
    void this.resolveTargetedSpell(card, finalPicks)
      .then((res) => {
        if (!res.success) {
          if (res.countered) {
            this.finalizeCounteredSpell(card, res.message, finalPicks);
            return;
          }
          this.cardPlay = { card, picks: finalPicks.slice(0, -1) };
          this.setMessage(res.message);
          this.validTargets = getValidTargets(this.state, this.localColor, card, this.cardPlay.picks);
          this.updateSpellCastUI();
          this.render();
          return;
        }
        const replayExtras = {
          ...(res.pvpAnimExtras || {}),
          ...(res.cullTarget ? { cullTarget: res.cullTarget, cullVictim: res.cullVictim } : {}),
          ...(res.coinFlipSquare
            ? {
                coinFlipSquare: res.coinFlipSquare,
                coinFlipVictimColor: res.coinFlipVictimColor,
                coinFlipVictim: res.coinFlipVictim,
              }
            : {}),
        };
        this.finishCardPlay(res.message, replayExtras, spellCtx);
      })
      .catch((err) => {
        console.error("Targeted spell failed:", err);
        this.dismissCardTargetingUI();
        this.setMessage("Spell failed — try again.");
        this.render();
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
    const hasTargets =
      (isInstant(card) && canCastInstant(s, this.localColor, card)) ||
      getValidTargets(s, this.localColor, card, []).length > 0;
    const canCast = canPlay && this.canPlaySpells() && hasTargets;
    el.classList.toggle("disabled", !canCast);
    if (!canCast) {
      el.title =
        !this.ensureSpellPhaseOpen(this.localColor)
          ? "Spells skipped — select a piece to move"
          : s.meta.shatterSilenced?.[this.localColor]
            ? "Spell backlash — no spells this turn"
            : s.meta.blinded?.[this.localColor]
              ? "Blinded — no spells this turn"
              : isConfused(s.meta, this.localColor)
                ? "Confused — no spells this turn"
              : s.spellPlayed[this.localColor]
              ? "Already cast a spell this turn"
              : !hasTargets
                ? getInstantCastBlockReason(s, this.localColor, card) || "No valid targets for this spell"
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
      const handEl = el.closest(".spell-hand");
      const startX = e.clientX;
      const startY = e.clientY;
      const startScrollLeft = handEl?.scrollLeft ?? 0;
      let dragStarted = false;
      let handScrolled = false;

      const cleanup = () => {
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
        document.removeEventListener("pointercancel", onUp);
      };

      const suppressClickBriefly = () => {
        this._suppressClick = true;
        clearTimeout(this._suppressScrollClickTimer);
        this._suppressScrollClickTimer = setTimeout(() => {
          this._suppressClick = false;
        }, 280);
      };

      const onMove = (ev) => {
        if (handEl && Math.abs(handEl.scrollLeft - startScrollLeft) > 2) {
          handScrolled = true;
          cleanup();
          suppressClickBriefly();
          return;
        }
        if (dragStarted) {
          this.onDragMove(ev);
          return;
        }
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        const dist = Math.hypot(dx, dy);
        if (dist < 22) return;
        // Hand scrolls horizontally — sideways movement should scroll, not start a cast.
        if (Math.abs(dx) >= Math.abs(dy)) return;
        dragStarted = true;
        ev.preventDefault();
        try { el.setPointerCapture(ev.pointerId); } catch (_) {}
        this.beginDrag(card, el, ev.clientX, ev.clientY);
        this.onDragMove(ev);
      };

      const onUp = (ev) => {
        cleanup();
        if (handScrolled) {
          suppressClickBriefly();
          return;
        }
        if (!dragStarted) {
          const dx = ev.clientX - startX;
          const dy = ev.clientY - startY;
          if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) suppressClickBriefly();
          return;
        }
        this.onDragEnd(ev);
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
      if (this.ensureSpellPhaseOpen(this.localColor) && s.phase === PHASE.MOVE) {
        s.phase = PHASE.CARDS;
      }
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

  continueMultiJump(fromR, fromC, prefixMsg = null) {
    const s = this.state;
    const piece = s.board[fromR]?.[fromC];
    const movePool = getAllMovesForColor(s.board, this.localColor, s);
    const jumps = movePool.filter(
      (m) => m.type === "jump" && m.from[0] === fromR && m.from[1] === fromC && m.captures?.length
    );
    if (!jumps.length) return false;
    this.validMoves = jumps;
    this.selectedSquare = [fromR, fromC];
    this.setMessage(prefixMsg ? `${prefixMsg} Continue jumping!` : "Continue jumping!");
    this.render();
    return true;
  }


  clearDeflectArrow() {
    this._deflectArrowEl?.remove();
    this._deflectArrowEl = null;
  }

  mountDeflectArrow(from, to) {
    this.clearDeflectArrow();
    const board = this.$("board");
    if (!board) return;
    const fromSq = board.querySelector(`[data-row="${from[0]}"][data-col="${from[1]}"]`);
    const toSq = board.querySelector(`[data-row="${to[0]}"][data-col="${to[1]}"]`);
    if (!fromSq || !toSq) return;
    const br = board.getBoundingClientRect();
    const fr = fromSq.getBoundingClientRect();
    const tr = toSq.getBoundingClientRect();
    const x1 = fr.left + fr.width / 2 - br.left;
    const y1 = fr.top + fr.height / 2 - br.top;
    const x2 = tr.left + tr.width / 2 - br.left;
    const y2 = tr.top + tr.height / 2 - br.top;
    const layer = document.createElement("div");
    layer.className = "deflect-arrow-layer";
    layer.innerHTML = `<svg class="deflect-arrow-svg" viewBox="0 0 ${br.width} ${br.height}" aria-hidden="true"><defs><marker id="deflect-arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="currentColor"/></marker></defs><line class="deflect-arrow-line" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#deflect-arrowhead)"/></svg>`;
    board.appendChild(layer);
    this._deflectArrowEl = layer;
  }

  async flushTrapBoardFx(s) {
    if (!s.boardFx?.squares?.length) return;
    await new Promise((resolve) => this.playBoardFx(s, resolve));
    this.recordPendingTrapHistory();
  }

  async applyCardWithTrapFx(card, picks) {
    const res = applyCard(this.state, this.localColor, card, picks);
    if (res.success) await this.flushTrapBoardFx(this.state);
    return res;
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
      shockwave: "Shockwave — adjacent pieces paralyzed!",
      mine: "Landmine explodes!",
      vengeance: "Vengeance — blood for blood!",
      deflect: "Deflect — spell reflected!",
    };
    this.setMessage(labels[kind] || "Blast!");
    const frame = this.$("board")?.closest(".board-frame");
    frame?.classList.add(`board-frame--fx-${kind}`, "board-frame--spell-impact");
    if (kind === "deflect") frame?.classList.add("board-frame--fx-deflect");
    this.$("board")?.classList.add("board--spell-shake");
    this.render();
    if (kind === "deflect" && this.boardFx.from && this.boardFx.to) {
      this.mountDeflectArrow(this.boardFx.from, this.boardFx.to);
    }
    const ms = boardFxDuration(kind);
    setTimeout(() => {
      this.clearDeflectArrow();
      this.boardFx = null;
      this.selectedColumn = null;
      this.selectedRow = null;
      frame?.classList.remove(`board-frame--fx-${kind}`, "board-frame--spell-impact", "board-frame--fx-deflect");
      this.$("board")?.classList.remove("board--spell-shake");
      onDone?.();
      this.checkWin();
    }, ms);
  }

  tryQuickMarchMove(s, color, landR, landC) {
    if (!s.meta.pendingDouble?.[color]) return false;
    const extras = getAllMovesForColor(s.board, color, s).filter(
      (m) => m.from[0] === landR && m.from[1] === landC && (m.type === "step" || m.type === "jump")
    );
    if (!extras.length) return false;
    s.meta.pendingDouble[color] = false;
    s.phase = PHASE.MOVE;
    this.validMoves = extras;
    this.selectedSquare = [landR, landC];
    this.setMessage("Bonus Step — move again!");
    this.render();
    return true;
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
    if (s.phase === PHASE.CARDS && !this.canEndSpellPhase()) {
      this.setMessage(this.tutorialHooks?.spellPhaseBlockMessage || "Cast the spell first.");
      return;
    }
    const preMoveSnap = this.tutorialHooks ? cloneMatchState(s) : null;
    this._pendingHistoryMove = move;
    this._pendingHistoryLabel = formatPieceMoveLabel(s.board, move);
    if (s.turn === this.localColor && isConfused(s.meta, this.localColor)) {
      const forced = this.pickConfusedMove(this.localColor);
      if (!forced) {
        this.cancelCardPlay();
        this.setMessage("Confusion — no moves available.");
        this.endHumanTurn();
        return;
      }
      move = forced;
    }
    this.cancelCardPlay();
    this.closeSpellPhase(this.localColor);
    s.phase = PHASE.MOVE;
    s.meta.lastMove[this.localColor] = move;
    const capBefore = s.captured[this.localColor]?.length ?? 0;
    this.achievementTracker?.onMoveBefore(s);
    applyMove(s.board, move, s);
    const capAfter = s.captured[this.localColor]?.length ?? 0;
    if (capAfter > capBefore) this.achievementTracker?.onOurPieceCaptured();
    this.achievementTracker?.onMoveAfter(s);
    const bountyMsg = flushPendingBountyMessage(s.meta, this.localColor);
    this.tutorialHooks?.onHumanMove?.(move);

    const [landR, landC] = move.to;
    const pendingBoardFx = s.boardFx;
    s.boardFx = null;

    const finishTurn = () => {
      if (bountyMsg) this.setMessage(bountyMsg);
      if (this.tutorialHooks?.beforeEndHumanTurn) {
        const verdict = this.tutorialHooks.beforeEndHumanTurn(this, move);
        if (verdict === "block" && preMoveSnap) {
          const restored = cloneMatchState(preMoveSnap);
          for (const key of Object.keys(restored)) {
            if (key in s) s[key] = restored[key];
          }
          this.selectedSquare = null;
          this.validMoves = [];
          this.render();
          return;
        }
        if (verdict === "advance") return;
      }
      this.endHumanTurn();
    };

    const tryFollowUpMoves = () => {
      if (move.captures?.length && this.continueMultiJump(landR, landC, bountyMsg)) return true;
      this.selectedSquare = null;
      this.validMoves = [];
      if (this.tryQuickMarchMove(s, this.localColor, landR, landC)) return true;
      if (this.tryBearBonusMove(s, this.localColor, landR, landC)) return true;
      if (this.tryPressExtraMove(s, this.localColor, landR, landC)) return true;
      return false;
    };

    const playPendingBoardFx = (onDone) => {
      if (!pendingBoardFx) {
        onDone?.();
        return;
      }
      s.boardFx = pendingBoardFx;
      this.playBoardFx(s, onDone);
    };

    if (tryFollowUpMoves()) {
      playPendingBoardFx(() => this.render());
      return;
    }

    this.selectedSquare = null;
    this.validMoves = [];
    playPendingBoardFx(finishTurn);
  }

  tryPressExtraMove(s, color, landR, landC) {
    if (!s.meta.pendingPressMove?.[color]) return false;
    s.meta.pendingPressMove[color] = false;
    const moves = getAllMovesForColor(s.board, color, s).filter(
      (m) => m.from[0] === landR && m.from[1] === landC
    );
    if (!moves.length) return false;
    s.phase = PHASE.MOVE;
    this.validMoves = moves;
    this.selectedSquare = [landR, landC];
    this.setMessage("Press — move again!");
    this.render();
    return true;
  }

  async endHumanTurn() {
    if (this.checkWin()) return;
    tickEndTurnEffects(this.state.board, this.localColor, this.state);
    tickMeta(this.state, this.localColor);
    this.state.turn = this.opponentColor;
    this.state.phase = PHASE.CARDS;
    if (this.isPvp) {
      this.state.spellPlayed[this.opponentColor] = false;
    }
    if (!this.isPvp && !this.skipCheckpoint) saveMatchCheckpoint(this);
    if (this._pendingHistoryMove && this.hasMoveHistory()) {
      const label =
        this._pendingHistoryLabel || formatPieceMoveLabel(this.state.board, this._pendingHistoryMove);
      this.recordHistoryWithTrapFollowUp(label, "move", {
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
      await this.pushPvpState();
      return;
    }
    if (this.tutorialHooks?.skipOpponentTurn) {
      this.state.turn = this.localColor;
      this.beginPlayerTurn();
      this.render();
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
    if (this.tutorialHooks) return false;
    const s = this.state;
    if (isMutualElimination(s)) {
      this.showGameOver(
        this.isPvp ? "Tie!" : "Victory!",
        this.isPvp ? "Both players lost all their pieces." : "You cleared the floor!"
      );
      return true;
    }
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
    const isTie = title.startsWith("Tie");
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
    if (won && this.achievementTracker) {
      this.achievementTracker.onVictory(this.state);
    }
    const overlay = this.root.querySelector("#game-over");
    if (overlay) {
      const card = overlay.querySelector(".game-over-card");
      card?.classList.toggle("game-over-card--tie", isTie);
      card?.classList.toggle("game-over-card--victory", won);
      card?.classList.toggle("game-over-card--defeat", !won && !isTie);
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
    if (this.isPvp) {
      this.onPvpWin?.(isTie ? null : won);
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
    if (spec.overlay) overlay = mountSpellOverlay(board, spec.overlay);
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
    try {
      await delay((spec.duration ?? MIN_SPELL_ANIM_MS) + SPELL_BANNER_EXTRA_MS);
    } finally {
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

  async runHiddenDeflectCast() {
    const banner = this.$("turn-banner");
    if (banner) {
      banner.textContent = "Deflect armed — hidden.";
      banner.className = "turn-banner spell-anim-instant";
    }
    this.render();
    await delay(450 + SPELL_BANNER_EXTRA_MS);
    if (banner) banner.className = "turn-banner";
  }

  async runHiddenLastStandCast() {
    const banner = this.$("turn-banner");
    if (banner) {
      banner.textContent = "Last Stand armed — hidden.";
      banner.className = "turn-banner spell-anim-instant";
    }
    this.render();
    await delay(450 + SPELL_BANNER_EXTRA_MS);
    if (banner) banner.className = "turn-banner";
  }

  async runHiddenBoardTrapCast(card) {
    const banner = this.$("turn-banner");
    const label = card?.name || (card?.effect === "quicksand" ? "Quicksand" : "Landmine");
    if (banner) {
      banner.textContent = `${label} armed — hidden.`;
      banner.className = "turn-banner spell-anim-instant";
    }
    this.render();
    await delay(450 + SPELL_BANNER_EXTRA_MS);
    if (banner) banner.className = "turn-banner";
  }

  showTrapSpellBanner(cardName, cardDesc, { label = "Trap triggered" } = {}) {
    const banner = this.$("ai-spell-banner");
    const labelEl = this.root.querySelector(".ai-spell-banner__label");
    const title = this.$("ai-spell-banner-title");
    const desc = this.$("ai-spell-banner-desc");
    if (labelEl) labelEl.textContent = label;
    if (title) title.textContent = cardName || "Spell";
    if (desc) desc.textContent = cardDesc || "";
    banner?.classList.remove("hidden");
  }

  resetTrapSpellBanner() {
    const labelEl = this.root.querySelector(".ai-spell-banner__label");
    if (labelEl) labelEl.textContent = "Enemy spell";
    this.$("ai-spell-banner")?.classList.add("hidden");
  }

  async runCounterspellReveal({ trapOwner } = {}) {
    const def = getCardDef("counterspell");
    const cardName = def?.name || "Counterspell";
    const cardDesc =
      def?.desc || "Hidden trap: the next enemy spell is cancelled when they cast it.";
    const label =
      trapOwner == null
        ? "Trap triggered"
        : trapOwner === this.localColor
          ? "Your trap"
          : "Enemy trap";

    this.showTrapSpellBanner(cardName, cardDesc, { label });

    const frame = this.$("board")?.closest(".board-frame");
    frame?.classList.add("board-frame--counterspell");
    const banner = this.$("turn-banner");
    if (banner) {
      banner.textContent = `${cardName}!`;
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
    this.resetTrapSpellBanner();
  }

  async playCoinFlipAnimation(victimRow, victimCol, victimColor, cardName = "Coin Flip", victimSnap = null) {
    const board = this.$("board");
    const frame = board?.closest(".board-frame");
    const friendly = victimColor === this.localColor;
    const resultText = formatCoinFlipResult(friendly);
    const coinOverlay = mountSpellOverlay(board, "coin");
    frame?.classList.add("board-frame--fx-coin", "board-frame--spell-instant");
    const banner = this.$("turn-banner");
    if (banner) {
      banner.textContent = `${cardName}…`;
      banner.className = "turn-banner spell-anim-instant";
    }
    this.render();
    await delay(COIN_FLIP_SPIN_MS);
    revealCoinFlipResult(coinOverlay, { friendly, label: resultText });
    if (banner) {
      banner.textContent = resultText;
      banner.className = "turn-banner spell-anim-kill";
    }
    this.setMessage(resultText);
    this.render();
    await delay(COIN_FLIP_REVEAL_MS);
    removeSpellOverlay(coinOverlay);
    frame?.classList.remove("board-frame--fx-coin", "board-frame--spell-instant");
    const piece = this.state.board[victimRow]?.[victimCol];
    const snap = victimSnap || (piece ? cullVictimSnapshot(piece) : null);
    this.coinFlipVictimAnim = { row: victimRow, col: victimCol, victim: snap };
    this.spellAnimation = {
      type: "kill",
      visual: "coin",
      duration: COIN_FLIP_VICTIM_MS,
      label: cardName,
      squares: [[victimRow, victimCol]],
      to: [victimRow, victimCol],
    };
    frame?.classList.add("board-frame--spell-impact");
    board?.classList.add("board--spell-shake");
    this.render();
    await delay(COIN_FLIP_VICTIM_MS + 100);
    this.coinFlipVictimAnim = null;
    this.spellAnimation = null;
    board?.classList.remove("board--spell-shake");
    frame?.classList.remove("board-frame--spell-impact");
    if (banner) banner.className = "turn-banner";
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

  finalizeCounteredSpell(card, message, picksOverride = null) {
    const picks = picksOverride ?? (this.cardPlay?.picks ? [...this.cardPlay.picks] : []);
    this.recordPvpSpell(card, picks, { countered: true });
    this.removeCardFromHand(card);
    if (!this.state.meta.extraSpellCast?.[this.localColor]) {
      this.state.spellPlayed[this.localColor] = true;
    } else {
      this.state.meta.extraSpellCast[this.localColor] = false;
    }
    this.dismissCardTargetingUI();
    this.setMessage(message || "Enemy Counterspell! Your spell fizzles.");
    if (this.hasMoveHistory()) {
      this.recordHistoryEntry(card.name, "spell", {
        color: this.localColor,
        picks: picks.map((p) => [...p]),
      });
      this.recordPendingTrapHistory();
    }
    this.render();
    this.pushPvpState();
    if (this.state.turn === this.localColor && !this.state.gameOver) {
      this.beginMovePhase();
      this.setMessage(message || "Enemy Counterspell! Your spell fizzles.");
      this.render();
    }
  }

  async applySpellWithAnimation(card, picks) {
    let extra = {};
    let animPicks = picks;
    const finishSpellTrack = (res) => {
      this.achievementTracker?.onSpellAfter(this.state, card.effect, res);
      const pvpAnimExtras = this.collectPvpAnimExtras(extra, animPicks);
      if (!Object.keys(pvpAnimExtras).length) return res;
      return { ...res, pvpAnimExtras };
    };
    this.achievementTracker?.onSpellBefore(this.state);

    const countered = tryConsumeCounterspell(this.state, this.localColor);
    if (countered) {
      await this.runCounterspellReveal({ trapOwner: countered.trapOwner });
      return finishSpellTrack({ success: false, countered: true, message: "Enemy Counterspell! Your spell fizzles." });
    }

    if (card.effect === "cull") {
      const target = findCullTarget(this.state, this.localColor);
      if (!target) return finishSpellTrack({ success: false, message: "No enemy to cull." });
      const victim = cullVictimSnapshot(target);
      await this.playCullAnimation(target.row, target.col, victim);
      return finishSpellTrack(await this.applyCardWithTrapFx(card, picks));
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

    if (card.effect === "last_stand") {
      const res = applyCard(this.state, this.localColor, card, picks);
      if (res.success) await this.runHiddenLastStandCast();
      return finishSpellTrack(res);
    }

    if (card.effect === "deflect_1") {
      const res = applyCard(this.state, this.localColor, card, picks);
      if (res.success) await this.runHiddenDeflectCast();
      return finishSpellTrack(res);
    }

    if (card.effect === "landmine" || card.effect === "quicksand") {
      const res = applyCard(this.state, this.localColor, card, picks);
      if (res.success) await this.runHiddenBoardTrapCast(card);
      return finishSpellTrack(res);
    }

    if (card.effect === "quick_march") {
      return finishSpellTrack(await this.applyCardWithTrapFx(card, picks));
    }

    const s = this.state;
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

      s.meta.pendingCoinFlipSquare = [victim.row, victim.col];
      const victimSnap = cullVictimSnapshot(victim);
      await this.playCoinFlipAnimation(
        victim.row,
        victim.col,
        victim.color,
        card.name,
        victimSnap
      );
      const res = await this.applyCardWithTrapFx(card, picks);
      if (!res.success) s.meta.pendingCoinFlipSquare = null;
      return finishSpellTrack(res);
    }

    if (card.effect === "cryo_bolt" && animPicks.length >= 2) {
      const [r2, c2] = animPicks[1];
      const target = s.board[r2]?.[c2];
      const cryoShatter =
        target &&
        target.color !== this.localColor &&
        (target.frozenTurns > 0 || target.paralyzedTurns > 0);
      extra.cryoShatter = cryoShatter;
      if (cryoShatter) {
        await this.runSpellAnimation(buildAnimSpec(card, animPicks, this.localColor, extra));
        return finishSpellTrack(await this.applyCardWithTrapFx(card, picks));
      }
      const res = await this.applyCardWithTrapFx(card, picks);
      if (!res.success) return finishSpellTrack(res);
      this.render();
      await this.runSpellAnimation(buildAnimSpec(card, animPicks, this.localColor, extra));
      return finishSpellTrack(res);
    }

    if (card.effect === "bounty") {
      const res = await this.applyCardWithTrapFx(card, picks);
      if (!res.success) return finishSpellTrack(res);
      this.render();
      await this.runSpellAnimation(buildAnimSpec(card, animPicks, this.localColor, extra));
      return finishSpellTrack(res);
    }

    const spec = buildAnimSpec(card, animPicks, this.localColor, extra);
    await this.runSpellAnimation(spec);
    return finishSpellTrack(await this.applyCardWithTrapFx(card, picks));
  }

  async castInstantSpell(card) {
    if (this.actionBusy || this.state.spellPlayed[this.localColor]) return;
    if (!this.canPlaySpells()) return;
    const blockReason = getInstantCastBlockReason(this.state, this.localColor, card);
    if (blockReason) {
      this.setMessage(blockReason);
      return;
    }
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
        {
          ...(res.pvpAnimExtras || {}),
          ...(res.cullTarget ? { cullTarget: res.cullTarget, cullVictim: res.cullVictim } : {}),
          ...(res.coinFlipSquare
            ? {
                coinFlipSquare: res.coinFlipSquare,
                coinFlipVictimColor: res.coinFlipVictimColor,
                coinFlipVictim: res.coinFlipVictim,
              }
            : {}),
        }
      );
      this.removeCardFromHand(card);
      this.recordSuccessfulSpellCast();
      const bonusSpell = !!this.state.meta.extraSpellCast?.[this.localColor];
      if (!bonusSpell) this.state.spellPlayed[this.localColor] = true;
      else this.state.meta.extraSpellCast[this.localColor] = false;
      if (this.hasMoveHistory() && !this.shouldDeferTrapHistory(card)) {
        this.recordHistoryEntry(card.name, "spell", { color: this.localColor, picks: [] });
      }
      if (this.checkWin()) return;
      this.render();
      this.pushPvpState();
      if (!this.state.gameOver) {
        if (bonusSpell) {
          this.state.phase = PHASE.CARDS;
          this.setMessage(res.message || "Cast another spell.");
          return;
        }
        let moveMsg = "Spell cast — select a piece to move.";
        if (card.effect === "constitution") {
          moveMsg = "Constitution active — your kings are protected. Select a piece to move.";
        } else if (card.effect === "counterspell") {
          moveMsg = "Counterspell armed (hidden) — select a piece to move.";
        } else if (card.effect === "vengeance") {
          moveMsg = "Vengeance armed (hidden) — select a piece to move.";
        } else if (card.effect === "last_stand") {
          moveMsg = "Last Stand armed (hidden) — select a piece to move.";
        } else if (card.effect === "deflect_1") {
          moveMsg = "Deflect armed (hidden) — select a piece to move.";
        } else if (card.effect === "quick_march") {
          moveMsg = "Bonus Step — select a piece to move.";
        } else if (res.message) {
          moveMsg = `${res.message} Select a piece to move.`;
        }
        this.beginMovePhase({ afterSpell: true, spellMessage: moveMsg });
      }
    } catch (err) {
      console.error("Instant spell failed:", err);
      this.setMessage("Spell failed — try again.");
      this.render();
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
    this.resetTrapSpellBanner();
    this.$("ai-action-panel")?.classList.remove("ai-action-panel--casting");
    this.$("board")?.closest(".board-frame")?.classList.remove("board-frame--ai-spell");
    this.$("turn-banner")?.classList.remove("turn-banner--enemy-spell");
  }

  buildAiSpellAnimExtra(entry) {
    const extra = {};
    const picks = entry.picks || [];
    const s = this.state;
    const oc = this.opponentColor;
    if (entry.chainSquares?.length) extra.chainSquares = entry.chainSquares;
    else if (entry.cardEffect === "chain_lightning" && picks.length) {
      const [pr, pc] = picks[0];
      extra.chainSquares = getChainLightningAnimSquares(s, pr, pc, oc);
    }
    if (entry.pyromancySquares?.length) extra.pyromancySquares = entry.pyromancySquares;
    else if (entry.cardEffect === "pyromancy" && picks.length >= 2) {
      extra.pyromancySquares = picks.slice(0, 2);
    }
    if (entry.sanctuaryCells?.length) extra.sanctuaryCells = entry.sanctuaryCells;
    else if (entry.cardEffect === "sanctuary" && picks.length) {
      extra.sanctuaryCells = getSanctuaryCells(picks[0][0], picks[0][1]);
    }
    if (entry.darknessCells?.length) extra.darknessCells = entry.darknessCells;
    else if (entry.cardEffect === "darkness" && picks.length) {
      extra.darknessCells = getDarknessZoneCells(picks[0][0], picks[0][1]);
    }
    if (entry.tricksterSquares?.length) extra.tricksterSquares = entry.tricksterSquares;
    else if (entry.cardEffect === "trickster") {
      const plan = planTrickster(s);
      if (plan?.squares) extra.tricksterSquares = plan.squares;
    }
    if (entry.backstabTo) extra.backstabTo = entry.backstabTo;
    else if (entry.cardEffect === "backstab" && picks.length) {
      const [r, c] = picks[0];
      const dir = oc === COLORS.RED ? 1 : -1;
      for (const dc of [-1, 1]) {
        const t = s.board[r + dir]?.[c + dc];
        if (t && t.color !== oc) {
          extra.backstabTo = [r + dir, c + dc];
          break;
        }
      }
    }
    if (entry.cryoShatter != null) extra.cryoShatter = entry.cryoShatter;
    return extra;
  }

  async playSpellEntryVisual(entry, { cardName, def, oc }) {
    if (entry.cardEffect === "cull" && entry.cullTarget) {
      const [cr, cc] = entry.cullTarget;
      await this.playCullAnimation(cr, cc, entry.cullVictim || null);
      return;
    }
    if (entry.cardEffect === "coin_flip" && entry.coinFlipSquare) {
      const [vr, vc] = entry.coinFlipSquare;
      await this.playCoinFlipAnimation(
        vr,
        vc,
        entry.coinFlipVictimColor,
        cardName,
        entry.coinFlipVictim || null
      );
      return;
    }
    const animExtra = this.buildAiSpellAnimExtra(entry);
    const animCard = {
      effect: entry.cardEffect,
      mode: entry.cardMode || def?.mode || "instant",
      name: cardName,
    };
    const animPicks = entry.animPicks || entry.picks || [];
    const spec = buildAnimSpec(animCard, animPicks, oc, animExtra);
    await this.runSpellAnimation(spec);
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
        const hiddenTrap =
          !entry.countered &&
          (entry.hidden || isHiddenTrapSpell({ effect: entry.cardEffect, id: entry.cardId }));

        if (hiddenTrap) {
          if (applyEntries) applyAiReplayEntry(this.state, entry, oc);
          this.render();
          await delay(AI_PACE.message);
          afterSpell = true;
          continue;
        }

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
            this.render();
            await this.runCounterspellReveal({
              trapOwner: this.state.pendingTrapHistory?.color ?? this.localColor,
            });
            this.recordPendingTrapHistory();
          } else {
            const trap = takeTrapHistoryReveal(this.state);
            this.render();
            await this.runCounterspellReveal({ trapOwner: trap?.color });
          }
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
            if (entry.cardEffect === "coin_flip" && entry.coinFlipSquare) {
              await this.playSpellEntryVisual(entry, { cardName, def, oc });
              this.state.meta.pendingCoinFlipSquare = [...entry.coinFlipSquare];
              applyAiReplayEntry(this.state, entry, oc);
              this.state.meta.pendingCoinFlipSquare = null;
            } else if (entry.cardEffect === "cryo_bolt" && (entry.picks || []).length >= 2) {
              const animPicks = entry.animPicks || entry.picks || [];
              const animExtra = this.buildAiSpellAnimExtra(entry);
              let cryoApplied = false;
              if (entry.cryoShatter == null) {
                const [r2, c2] = animPicks[1];
                const target = this.state.board[r2]?.[c2];
                const cryoShatter =
                  target &&
                  target.color !== oc &&
                  (target.frozenTurns > 0 || target.paralyzedTurns > 0);
                animExtra.cryoShatter = cryoShatter;
                if (!cryoShatter) {
                  applyAiReplayEntry(this.state, entry, oc);
                  cryoApplied = true;
                  this.render();
                }
              }
              const animCard = {
                effect: entry.cardEffect,
                mode: entry.cardMode || def?.mode || "instant",
                name: cardName,
              };
              const spec = buildAnimSpec(animCard, animPicks, oc, animExtra);
              await this.runSpellAnimation(spec);
              if (!cryoApplied) {
                applyAiReplayEntry(this.state, entry, oc);
              }
            } else {
              const earlyMetaApply =
                entry.cardEffect === "confusion" ||
                entry.cardEffect === "blind" ||
                entry.cardEffect === "bounty";
              if (earlyMetaApply) applyAiReplayEntry(this.state, entry, oc);
              await this.playSpellEntryVisual(entry, { cardName, def, oc });
              if (!earlyMetaApply) applyAiReplayEntry(this.state, entry, oc);
            }
            this.recordHistoryFromReplayEntry(entry);
            this.render();
            if (this.state.boardFx) {
              await new Promise((resolve) => this.playBoardFx(this.state, resolve));
              this.recordPendingTrapHistory();
            }
          } else {
            await this.playSpellEntryVisual(entry, { cardName, def, oc });
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
        if (aiLog) {
          aiLog.innerHTML += `<div class="ai-log-entry ai-log-entry--move">♟ ${entry.text}</div>`;
          aiLog.scrollTop = aiLog.scrollHeight;
        }
        this.setMessage(entry.text);
        if (entry.confused) {
          await this.playPieceMoveAnimation(entry, { message: entry.text });
        } else {
          this.aiHighlight = {
            from: entry.from,
            to: entry.to,
            captures: entry.captures || [],
          };
          this.render();
          await delay(AI_PACE.moveAnnounce);
        }
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

    if (isMutualElimination(s)) {
      this.showGameOver("Victory!", "You cleared the floor!");
      return;
    }
    if (countPieces(s.board, this.localColor) === 0) {
      this.showGameOver("Defeat", "You lost all your pieces.");
      return;
    }
    if (countPieces(s.board, this.opponentColor) === 0) {
      this.showGameOver("Victory!", "You cleared the floor!");
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
      this._moveAnimHideFrom = null;
      this.cullAnimation = null;
      this.coinFlipVictimAnim = null;
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

  async beginMovePhase({ afterSpell = false, spellMessage = null } = {}) {
    const s = this.state;
    if (s.gameOver || s.turn !== this.localColor) return;
    if (!afterSpell && s.phase === PHASE.CARDS && !this.canEndSpellPhase()) {
      this.setMessage(this.tutorialHooks?.spellPhaseBlockMessage || "Cast the spell first.");
      return;
    }
    this.cancelCardPlay();
    if (!afterSpell) this.closeSpellPhase(this.localColor);
    s.phase = PHASE.MOVE;
    if (isConfused(s.meta, this.localColor)) {
      const forced = this.pickConfusedMove(this.localColor);
      if (forced) {
        this.actionBusy = true;
        try {
          await this.playPieceMoveAnimation(forced, { message: "Confusion — random move!" });
        } finally {
          this.actionBusy = false;
        }
        this.executeHumanMove(forced);
      } else {
        this.setMessage("Confusion — no moves available.");
        this.endHumanTurn();
      }
      return;
    }
    const panicked = findPanicPiece(s.board, this.localColor);
    if (panicked) {
      const panicMoves = getBackwardStepMoves(s.board, panicked, s);
      if (panicMoves.length) {
        this.selectedSquare = [panicked.row, panicked.col];
        this.validMoves = panicMoves;
        this.setMessage("Panic — step backward!");
        this.render();
        return;
      }
    }
    const moves = getAllMovesForColor(s.board, this.localColor, s);
    if (!moves.length) {
      this.setMessage("No moves — turn passes.");
      this.endHumanTurn();
      return;
    }
    this.setMessage(
      spellMessage ||
        (afterSpell ? "Spell cast — select a piece to move." : "Spell skipped — select a piece to move.")
    );
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
    this.bindHandScroll();

    for (const card of s.hands[this.localColor]) {
      const playable =
        canPlay &&
        ((isInstant(card) && canCastInstant(s, this.localColor, card)) ||
          getValidTargets(s, this.localColor, card, []).length > 0);
      const el = renderSpellCardEl(card, {
        button: true,
        compact: true,
        selected: castingId === card.instanceId,
        disabled: !playable,
      });
      this.attachCardInput(el, card, canPlay);
      handEl.appendChild(el);
    }

    const enemyCountLabel = this.$("enemy-hand-count-label");
    if (enemyCountLabel) {
      const oppN = s.hands[this.opponentColor].length;
      enemyCountLabel.textContent =
        oppN === 1 ? "1 card in hand" : `${oppN} cards in hand`;
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
        if (terrain?.hiddenMine?.owner === this.localColor) cls += " has-own-hidden-mine";
        if (terrain?.quicksand && !terrain?.hiddenQuicksand) cls += " has-quicksand";
        if (terrain?.hiddenQuicksand?.owner === this.localColor) cls += " has-own-hidden-quicksand";
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

        if (terrain?.hiddenMine?.owner === this.localColor) {
          const turnsLeft = terrain.hiddenMine.turnsLeft ?? 0;
          const mineEl = document.createElement("div");
          mineEl.className = "landmine-indicator";
          mineEl.setAttribute(
            "aria-label",
            `Your landmine — ${turnsLeft} turn${turnsLeft === 1 ? "" : "s"} left`
          );
          const mark = document.createElement("span");
          mark.className = "landmine-indicator__mark";
          mark.textContent = "⊗";
          mark.setAttribute("aria-hidden", "true");
          const turns = document.createElement("span");
          turns.className = "landmine-indicator__turns";
          turns.textContent = String(turnsLeft);
          mineEl.appendChild(mark);
          mineEl.appendChild(turns);
          sq.appendChild(mineEl);
        }

        if (terrain?.hiddenQuicksand?.owner === this.localColor) {
          const qsEl = document.createElement("div");
          qsEl.className = "quicksand-indicator";
          qsEl.setAttribute("aria-label", "Your quicksand trap");
          const mark = document.createElement("span");
          mark.className = "quicksand-indicator__mark";
          mark.textContent = "⊗";
          mark.setAttribute("aria-hidden", "true");
          const label = document.createElement("span");
          label.className = "quicksand-indicator__label";
          label.textContent = "QS";
          qsEl.appendChild(mark);
          qsEl.appendChild(label);
          sq.appendChild(qsEl);
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
          if (this.boardFx.kind === "deflect") {
            const [fr, fc] = this.boardFx.from || [];
            const [tr, tc] = this.boardFx.to || [];
            if (row === fr && col === fc) sq.classList.add("board-fx-deflect-from", "board-fx-blast");
            else if (row === tr && col === tc) sq.classList.add("board-fx-deflect-to", "board-fx-blast");
            else sq.classList.add("board-fx-deflect", "board-fx-blast");
          } else {
            sq.classList.add(`board-fx-${this.boardFx.kind}`, "board-fx-blast");
          }
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
        if (
          this.coinFlipVictimAnim &&
          this.coinFlipVictimAnim.row === row &&
          this.coinFlipVictimAnim.col === col
        ) {
          sq.classList.add("spell-fx-coin-victim");
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
          const skinSource =
            piece.color === this.localColor
              ? this.cosmetics
              : this.isPvp
                ? this.opponentCosmetics
                : null;
          const skinClass = this.isPvp
            ? pieceSkinCssSuffix(skinSource?.equipped?.pieceSkin)
            : piece.color === this.localColor
              ? pieceSkinCssSuffix(this.cosmetics?.equipped?.pieceSkin)
              : "";
          el.className = `piece ${piece.color}${piece.king ? " king" : ""}${skinClass}`;
          const showArmedLastStand = piece.lastStand && piece.color === this.localColor;
          if (piece.shieldTurns >= LAST_STAND_SHIELD_TURNS || showArmedLastStand) {
            el.classList.add("ultra-shielded");
          } else if (piece.shieldTurns > 0) {
            el.classList.add("shielded");
          }
          if (piece.frozenTurns > 0) el.classList.add("frozen");
          if (piece.paralyzedTurns > 0) el.classList.add("paralyzed-mark");
          if (piece.knightTurns > 0 || piece.isKnight) el.classList.add("knight-mark");
          if (piece.retreatTurns > 0) el.classList.add("retreat-mark");
          if (piece.bishopTurns > 0) el.classList.add("bishop-mark");
          if (piece.rookTurns > 0) el.classList.add("rook-mark");
          if (piece.bombArmed) el.classList.add("bomb-armed");
          if (piece.shockwaveArmed) el.classList.add("shockwave-armed");
          if (piece.color === this.localColor && hasVengeanceArmed(this.state, piece.color)) {
            el.classList.add("vengeance-armed");
          }
          const constitutionTurns = piece.king ? ensureConstitutionTurns(this.state.meta)[piece.color] : 0;
          if (constitutionTurns > 0) el.classList.add("constitution-mark");
          if (piece.hibernationTurns > 0) el.classList.add("hibernating");
          if (piece.bearAwakened) el.classList.add("bear-awoken");
          if (piece.linkedFateId) el.classList.add("linked-fate");
          if (piece.fortifyTurns > 0) el.classList.add("fortify-mark");
          if (piece.mindControlTurns > 0) el.classList.add("mind-controlled");
          if (piece.bountyBy) el.classList.add("bounty-mark");
          if (piece.revivedNoCapture) el.classList.add("revived-mark");
          if (piece.isClone) el.classList.add("clone-mark");
          if (piece.berserkNoCapture) el.classList.add("berserk-mark");
          if (piece.venom > 0) el.classList.add("poisoned");
          if (piece.blazeTurns > 0) el.classList.add("burning");
          if (piece.bloodTurns > 0) el.classList.add("vengeance-mark");
          if (piece.plagueTurns > 0) el.classList.add("plagued");
          if (
            this.cullAnimation &&
            this.cullAnimation.row === row &&
            this.cullAnimation.col === col
          ) {
            el.classList.add("piece--cull-victim");
          } else if (
            this.coinFlipVictimAnim &&
            this.coinFlipVictimAnim.row === row &&
            this.coinFlipVictimAnim.col === col
          ) {
            el.classList.add("piece--spell-kill-victim");
          } else if (animRole === "kill" && this.spellAnimation?.type === "kill") {
            el.classList.add("piece--spell-kill-victim");
          }
          if (
            this._moveAnimHideFrom?.[0] === row &&
            this._moveAnimHideFrom?.[1] === col
          ) {
            el.classList.add("piece--move-hidden");
          }
          sq.appendChild(el);
          if (piece.shieldTurns > 0 || showArmedLastStand) {
            const ultra =
              showArmedLastStand && piece.shieldTurns <= 0
                ? true
                : piece.shieldTurns >= LAST_STAND_SHIELD_TURNS;
            const turns =
              showArmedLastStand && piece.shieldTurns <= 0
                ? LAST_STAND_SHIELD_TURNS
                : piece.shieldTurns;
            const label = ultra
              ? showArmedLastStand && piece.shieldTurns <= 0
                ? "Last Stand armed (hidden trap)"
                : `Ultra shield — ${turns} turn${turns === 1 ? "" : "s"} left`
              : `Shield — ${turns} turn${turns === 1 ? "" : "s"} left`;
            const shield = document.createElement("div");
            shield.className = ultra ? "ultra-shield-indicator" : "shield-indicator";
            shield.setAttribute("aria-label", label);
            const mark = document.createElement("span");
            mark.className = ultra ? "ultra-shield-indicator__mark" : "shield-indicator__mark";
            mark.textContent = "🛡";
            mark.setAttribute("aria-hidden", "true");
            const turnsEl = document.createElement("span");
            turnsEl.className = ultra ? "ultra-shield-indicator__turns" : "shield-indicator__turns";
            turnsEl.textContent = String(turns);
            shield.appendChild(mark);
            shield.appendChild(turnsEl);
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
            bar.setAttribute("aria-valuemax", "3");
            for (let i = 0; i < 3; i++) {
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
          if (piece.bloodTurns > 0) {
            const blood = document.createElement("div");
            blood.className = "blood-indicator";
            const mark = document.createElement("span");
            mark.className = "blood-indicator__mark";
            mark.textContent = "🩸";
            mark.setAttribute("aria-hidden", "true");
            const bar = document.createElement("div");
            bar.className = "blood-indicator__bar";
            bar.setAttribute("role", "meter");
            bar.setAttribute("aria-label", `Vengeance blood — ${piece.bloodTurns} turn${piece.bloodTurns === 1 ? "" : "s"} left`);
            bar.setAttribute("aria-valuenow", String(piece.bloodTurns));
            bar.setAttribute("aria-valuemin", "0");
            bar.setAttribute("aria-valuemax", String(VENGEANCE_BLOOD_TURNS));
            for (let i = 0; i < VENGEANCE_BLOOD_TURNS; i++) {
              const block = document.createElement("span");
              block.className =
                "blood-indicator__block" + (i < piece.bloodTurns ? " blood-indicator__block--filled" : "");
              bar.appendChild(block);
            }
            blood.appendChild(mark);
            blood.appendChild(bar);
            sq.appendChild(blood);
          }
          if (piece.plagueTurns > 0) {
            const plague = document.createElement("div");
            plague.className =
              "plague-indicator" + (piece.plagueSeed ? " plague-indicator--seed" : "");
            const mark = document.createElement("span");
            mark.className = "plague-indicator__mark";
            mark.textContent = "☣";
            mark.setAttribute("aria-hidden", "true");
            const bar = document.createElement("div");
            bar.className = "plague-indicator__bar";
            bar.setAttribute("role", "meter");
            bar.setAttribute("aria-label", `Plague — ${piece.plagueTurns} turn${piece.plagueTurns === 1 ? "" : "s"} left`);
            bar.setAttribute("aria-valuenow", String(piece.plagueTurns));
            bar.setAttribute("aria-valuemin", "0");
            bar.setAttribute("aria-valuemax", String(PLAGUE_TURNS));
            for (let i = 0; i < PLAGUE_TURNS; i++) {
              const block = document.createElement("span");
              block.className =
                "plague-indicator__block" + (i < piece.plagueTurns ? " plague-indicator__block--filled" : "");
              bar.appendChild(block);
            }
            plague.appendChild(mark);
            plague.appendChild(bar);
            sq.appendChild(plague);
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
          if (constitutionTurns > 0) {
            const constitution = document.createElement("div");
            constitution.className = "constitution-indicator";
            constitution.setAttribute(
              "aria-label",
              `Constitution — ${constitutionTurns} turn${constitutionTurns === 1 ? "" : "s"} left`
            );
            const mark = document.createElement("span");
            mark.className = "constitution-indicator__mark";
            mark.textContent = "♛";
            mark.setAttribute("aria-hidden", "true");
            const bar = document.createElement("div");
            bar.className = "constitution-indicator__bar";
            bar.setAttribute("role", "meter");
            bar.setAttribute("aria-label", `Constitution — ${constitutionTurns} turns left`);
            bar.setAttribute("aria-valuenow", String(constitutionTurns));
            bar.setAttribute("aria-valuemin", "0");
            bar.setAttribute("aria-valuemax", "5");
            for (let i = 0; i < 5; i++) {
              const block = document.createElement("span");
              block.className =
                "constitution-indicator__block" + (i < constitutionTurns ? " constitution-indicator__block--filled" : "");
              bar.appendChild(block);
            }
            constitution.appendChild(mark);
            constitution.appendChild(bar);
            sq.appendChild(constitution);
          }
          if (piece.linkedFateId) {
            const link = document.createElement("div");
            link.className = "linked-fate-indicator";
            link.setAttribute(
              "aria-label",
              "Linked Fate — when one falls, the other follows"
            );
            const mark = document.createElement("span");
            mark.className = "linked-fate-indicator__mark";
            mark.textContent = "⛓";
            mark.setAttribute("aria-hidden", "true");
            link.appendChild(mark);
            sq.appendChild(link);
          }
          if (piece.fortifyTurns > 0) {
            const fortify = document.createElement("div");
            fortify.className = "fortify-indicator";
            fortify.setAttribute(
              "aria-label",
              `Fortified — ${piece.fortifyTurns} turn${piece.fortifyTurns === 1 ? "" : "s"} left (invulnerable)`
            );
            const mark = document.createElement("span");
            mark.className = "fortify-indicator__mark";
            mark.textContent = "⛊";
            mark.setAttribute("aria-hidden", "true");
            const turns = document.createElement("span");
            turns.className = "fortify-indicator__turns";
            turns.textContent = String(piece.fortifyTurns);
            fortify.appendChild(mark);
            fortify.appendChild(turns);
            sq.appendChild(fortify);
          }
          if (piece.mindControlTurns > 0) {
            const mc = document.createElement("div");
            mc.className = "mind-control-indicator";
            mc.setAttribute(
              "aria-label",
              `Mind controlled — ${piece.mindControlTurns} turn${piece.mindControlTurns === 1 ? "" : "s"} left`
            );
            const mark = document.createElement("span");
            mark.className = "mind-control-indicator__mark";
            mark.textContent = "👁";
            mark.setAttribute("aria-hidden", "true");
            const turns = document.createElement("span");
            turns.className = "mind-control-indicator__turns";
            turns.textContent = String(piece.mindControlTurns);
            mc.appendChild(mark);
            mc.appendChild(turns);
            sq.appendChild(mc);
          }
          if (piece.bountyBy) {
            const bounty = document.createElement("div");
            bounty.className = "bounty-indicator";
            bounty.setAttribute(
              "aria-label",
              piece.bountyBy === this.localColor
                ? "Bounty — jump-capture this piece to draw 2 cards"
                : "Bounty — enemy marked this piece for capture"
            );
            const mark = document.createElement("span");
            mark.className = "bounty-indicator__mark";
            mark.innerHTML = BOUNTY_WANTED_SVG;
            bounty.appendChild(mark);
            sq.appendChild(bounty);
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
        } else if (
          this.coinFlipVictimAnim &&
          this.coinFlipVictimAnim.row === row &&
          this.coinFlipVictimAnim.col === col &&
          this.coinFlipVictimAnim.victim
        ) {
          const v = this.coinFlipVictimAnim.victim;
          const el = document.createElement("span");
          el.className = `piece ${v.color}${v.king ? " king" : ""} piece--spell-kill-victim piece--cull-ghost`;
          sq.appendChild(el);
        }
        sq.addEventListener("click", () => this.onSquareClick(row, col));
        boardEl.appendChild(sq);
      }
    }

    const linkedPairs = [];
    const linkedSeen = new Set();
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        const piece = s.board[row][col];
        if (!piece?.linkedFateId) continue;
        const pairKey =
          piece.id < piece.linkedFateId
            ? `${piece.id}-${piece.linkedFateId}`
            : `${piece.linkedFateId}-${piece.id}`;
        if (linkedSeen.has(pairKey)) continue;
        linkedSeen.add(pairKey);
        for (let r = 0; r < SIZE; r++) {
          for (let c = 0; c < SIZE; c++) {
            const partner = s.board[r][c];
            if (partner?.id === piece.linkedFateId) {
              linkedPairs.push({ r1: row, c1: col, r2: r, c2: c });
              break;
            }
          }
        }
      }
    }
    if (linkedPairs.length) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.classList.add("linked-fate-overlay");
      svg.setAttribute("viewBox", "0 0 100 100");
      svg.setAttribute("preserveAspectRatio", "none");
      svg.setAttribute("aria-hidden", "true");
      for (const { r1, c1, r2, c2 } of linkedPairs) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", String(((c1 + 0.5) / SIZE) * 100));
        line.setAttribute("y1", String(((r1 + 0.5) / SIZE) * 100));
        line.setAttribute("x2", String(((c2 + 0.5) / SIZE) * 100));
        line.setAttribute("y2", String(((r2 + 0.5) / SIZE) * 100));
        svg.appendChild(line);
      }
      boardEl.appendChild(svg);
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
        if (this.cardPlay) {
          const axisMsg = axisPickMessage(this.cardPlay.card);
          banner.textContent = axisMsg
            ? `Casting ${axisMsg}`
            : `Casting ${this.cardPlay.card.name} — tap highlights on the board`;
          banner.className = "turn-banner casting";
        } else if (s.meta.shatterSilenced?.[this.localColor]) {
          banner.textContent = "No spells (backlash) — select a piece to move";
          banner.className = "turn-banner";
        } else if (s.meta.blinded?.[this.localColor]) {
          banner.textContent = "Blinded — select a piece to move";
          banner.className = "turn-banner";
        } else if (isConfused(s.meta, this.localColor)) {
          banner.textContent = "Confused — select a piece to move";
          banner.className = "turn-banner";
        } else {
          banner.textContent = this.ensureSpellPhaseOpen(this.localColor)
            ? "Cast a spell or select a piece to move"
            : "Select a piece to move";
          banner.className = "turn-banner";
        }
      } else {
        banner.textContent = `${this.opponentName} is thinking…`;
        banner.className = "turn-banner opponent-turn";
      }
    }
    const msgEl = this.$("message");
    if (msgEl && banner) {
      const bannerText = (banner.textContent || "").toLowerCase();
      const msgText = (msgEl.textContent || "").toLowerCase();
      const redundant =
        !!this.cardPlay ||
        (msgText.includes("select a piece") &&
          (bannerText.includes("select a piece") || bannerText.includes("cast a spell")));
      msgEl.classList.toggle("match-message--redundant", redundant);
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
    const youSkin = this.isPvp ? pieceSkinCssSuffix(this.cosmetics?.equipped?.pieceSkin) : "";
    const oppSkin = this.isPvp ? pieceSkinCssSuffix(this.opponentCosmetics?.equipped?.pieceSkin) : "";
    const youIcon = this.root.querySelector(".panel-player .piece-icon");
    if (youIcon) youIcon.className = `piece-icon ${this.localColor}${youSkin}`;
    const oppIcon = this.root.querySelector(".panel-opponent .piece-icon");
    if (oppIcon) oppIcon.className = `piece-icon ${this.opponentColor}${oppSkin}`;
  }
}
