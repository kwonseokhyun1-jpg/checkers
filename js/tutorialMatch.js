/**
 * Interactive practice match — teaches movement, captures, kings, and spells in-game.
 */
import { COLORS, SIZE, isDarkSquare, createPiece } from "./board.js";
import { createMatchMeta } from "./gameMeta.js";
import { initCardState } from "./cardEffects.js";
import { getCardDef } from "./cardCatalog.js";
import { createCardInstance } from "./cards.js";
import { buildStarterDeckCardIds } from "./storage.js";
import { MatchSession, PHASE } from "./match.js";
import { getMatchHtml } from "./matchView.js";
import { getEquippedCosmetics } from "./cosmetics.js";
import { enterMatchMode, exitMatchMode } from "./matchLifecycle.js";
import { mobileConfirm } from "./mobileConfirm.js";
import { dismissAppSplash } from "./splash.js";
import { dismissInteractiveTutorial } from "./tutorial.js";

const TUTORIAL_DECK = buildStarterDeckCardIds();

function emptyBoard() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
}

function place(board, row, col, color, king = false) {
  if (!isDarkSquare(row, col)) return;
  board[row][col] = createPiece(color, row, col, king);
}

function snowballCard() {
  const def = getCardDef("snowball");
  return def ? createCardInstance(def) : null;
}

function baseTutorialState(overrides = {}) {
  const board = overrides.board ?? emptyBoard();
  const state = {
    board,
    hands: {
      [COLORS.RED]: overrides.redHand ?? [],
      [COLORS.BLACK]: overrides.blackHand ?? [],
    },
    turn: overrides.turn ?? COLORS.RED,
    phase: overrides.phase ?? PHASE.MOVE,
    meta: createMatchMeta(),
    squares: {},
    captured: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    gameOver: null,
    turnNumber: { [COLORS.RED]: overrides.redTurn ?? 1, [COLORS.BLACK]: overrides.blackTurn ?? 0 },
    spellPlayed: {
      [COLORS.RED]: overrides.spellPlayedRed ?? true,
      [COLORS.BLACK]: overrides.spellPlayedBlack ?? true,
    },
    gems: { [COLORS.RED]: 0, [COLORS.BLACK]: 0 },
    pvpSpellSeq: 0,
    pvpLastSpell: null,
    moveHistory: [],
    drawPile: { red: [], black: [] },
    discardPile: { red: [], black: [] },
  };
  initCardState(state);
  return state;
}

/** @typedef {{ id: string, title: string, body: string, hint?: string, buildState: () => object, validateTurnEnd?: (session: import('./match.js').MatchSession, lastMove?: object, ctx?: { promoted?: boolean }) => boolean | "accept", validateSpell?: (session: import('./match.js').MatchSession, card: object, picks: number[][]) => boolean, skipOpponentTurn?: boolean, autoAdvance?: boolean }} TutorialStep */

/** @type {TutorialStep[]} */
const STEPS = [
  {
    id: "intro",
    title: "Practice battle",
    body: "You will learn the basics in a short guided match — moving, capturing, crowning kings, and casting spells.",
    buildState() {
      return baseTutorialState();
    },
    autoAdvance: true,
  },
  {
    id: "move",
    title: "Move a piece",
    body: "Tap one of your red pieces, then tap a highlighted square to move forward.",
    hint: "Tap your piece, then tap a glowing square.",
    buildState() {
      const board = emptyBoard();
      place(board, 5, 0, COLORS.RED);
      place(board, 2, 5, COLORS.BLACK);
      return baseTutorialState({ board, phase: PHASE.MOVE, spellPlayedRed: true });
    },
    validateTurnEnd(_session, lastMove) {
      return lastMove?.type === "step" && !(lastMove.captures?.length);
    },
    skipOpponentTurn: true,
  },
  {
    id: "capture",
    title: "Capture an enemy",
    body: "Jump diagonally over an enemy piece to capture it. Captures are mandatory when available.",
    hint: "Select your piece and jump over the black piece.",
    buildState() {
      const board = emptyBoard();
      place(board, 5, 6, COLORS.RED);
      place(board, 4, 5, COLORS.BLACK);
      place(board, 1, 0, COLORS.BLACK);
      return baseTutorialState({ board, phase: PHASE.MOVE, spellPlayedRed: true });
    },
    validateTurnEnd(session) {
      return (session.state.captured[COLORS.BLACK]?.length ?? 0) >= 1;
    },
    skipOpponentTurn: true,
  },
  {
    id: "multi-capture",
    title: "Chain captures",
    body: "When several enemies line up, you can capture them all in one turn. Keep jumping while jumps are available!",
    hint: "Jump over the first piece, then keep jumping.",
    buildState() {
      const board = emptyBoard();
      place(board, 5, 2, COLORS.RED);
      place(board, 4, 3, COLORS.BLACK);
      place(board, 2, 5, COLORS.BLACK);
      place(board, 0, 7, COLORS.BLACK);
      return baseTutorialState({ board, phase: PHASE.MOVE, spellPlayedRed: true });
    },
    validateTurnEnd(session) {
      return (session.state.captured[COLORS.BLACK]?.length ?? 0) >= 2;
    },
    skipOpponentTurn: true,
  },
  {
    id: "king",
    title: "Crown a king",
    body: "Reach the far row to promote your piece to a king. Then step backward — kings can move and capture in both directions.",
    hint: "Move to the back rank, then step your king backward.",
    buildState() {
      const board = emptyBoard();
      place(board, 1, 4, COLORS.RED);
      place(board, 0, 1, COLORS.BLACK);
      return baseTutorialState({ board, phase: PHASE.MOVE, spellPlayedRed: true });
    },
    validateTurnEnd(session, lastMove, { promoted = false } = {}) {
      let hasKing = false;
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          const p = session.state.board[r][c];
          if (p?.color === COLORS.RED && p.king) hasKing = true;
        }
      }
      if (!hasKing) return false;
      if (!promoted) return "accept";
      if (!lastMove) return false;
      return lastMove.to[0] > lastMove.from[0];
    },
    skipOpponentTurn: true,
  },
  {
    id: "snowball",
    title: "Cast Snowball",
    body: "Drag Snowball from your hand onto an enemy, or tap the card then tap the target. It freezes them — they cannot move on their next turn.",
    hint: "Play Snowball on the black piece.",
    async buildState() {
      const board = emptyBoard();
      place(board, 6, 5, COLORS.RED);
      place(board, 4, 3, COLORS.BLACK);
      const snowball = snowballCard();
      return baseTutorialState({
        board,
        phase: PHASE.CARDS,
        spellPlayedRed: false,
        redHand: snowball ? [snowball] : [],
      });
    },
    validateSpell(_session, card, picks) {
      return card?.id === "snowball" && picks?.[0]?.[0] === 4 && picks[0][1] === 3;
    },
    skipOpponentTurn: true,
  },
  {
    id: "snowball-adjacent",
    title: "Close the distance",
    body: "The enemy is frozen. Move next to them so you can capture on your next turn.",
    hint: "Move adjacent to the frozen piece.",
    buildState() {
      const board = emptyBoard();
      const red = createPiece(COLORS.RED, 6, 5);
      const black = createPiece(COLORS.BLACK, 4, 3);
      black.frozenTurns = 1;
      board[6][5] = red;
      board[4][3] = black;
      return baseTutorialState({ board, phase: PHASE.MOVE, spellPlayedRed: true });
    },
    validateTurnEnd(_session, lastMove) {
      if (!lastMove) return false;
      const [tr, tc] = lastMove.to;
      return Math.abs(tr - 4) <= 1 && Math.abs(tc - 3) <= 1 && (tr !== 4 || tc !== 3);
    },
    skipOpponentTurn: true,
  },
  {
    id: "snowball-capture",
    title: "Capture the frozen piece",
    body: "They still cannot move — jump over them to capture!",
    hint: "Jump to capture the frozen enemy.",
    buildState() {
      const board = emptyBoard();
      place(board, 5, 4, COLORS.RED);
      const black = createPiece(COLORS.BLACK, 4, 3);
      black.frozenTurns = 1;
      board[4][3] = black;
      return baseTutorialState({
        board,
        phase: PHASE.MOVE,
        spellPlayedRed: true,
        redTurn: 2,
      });
    },
    validateTurnEnd(session) {
      return (session.state.captured[COLORS.BLACK]?.length ?? 0) >= 1;
    },
    skipOpponentTurn: true,
  },
  {
    id: "cards-tip",
    title: "Spells change the game",
    body: "Your deck has many spells — barriers, teleports, shields, and more. Combine movement with cards to outplay opponents. You are ready to play!",
    buildState() {
      return baseTutorialState();
    },
    autoAdvance: true,
  },
];

function overlayHtml() {
  return `
    <div id="tutorial-match-overlay" class="tutorial-match-overlay" role="dialog" aria-live="polite">
      <div class="tutorial-match-card panel game-panel">
        <p id="tutorial-match-step" class="tutorial-match-step"></p>
        <h3 id="tutorial-match-title" class="tutorial-match-title"></h3>
        <p id="tutorial-match-body" class="tutorial-match-body"></p>
        <div class="tutorial-match-actions">
          <button type="button" id="tutorial-match-continue" class="btn-primary hidden">Continue</button>
          <button type="button" id="tutorial-match-skip" class="btn-text tutorial-skip-btn">Skip tutorial</button>
        </div>
      </div>
    </div>`;
}

function renderOverlay(stepIndex, step, { showContinue = false } = {}) {
  const overlay = document.getElementById("tutorial-match-overlay");
  if (!overlay) return;
  const stepEl = overlay.querySelector("#tutorial-match-step");
  const titleEl = overlay.querySelector("#tutorial-match-title");
  const bodyEl = overlay.querySelector("#tutorial-match-body");
  const continueBtn = overlay.querySelector("#tutorial-match-continue");
  const playable = stepIndex > 0 && stepIndex < STEPS.length - 1;
  if (stepEl) stepEl.textContent = playable ? `Lesson ${stepIndex} of ${STEPS.length - 2}` : "";
  if (titleEl) titleEl.textContent = step.title;
  if (bodyEl) bodyEl.textContent = step.body;
  continueBtn?.classList.toggle("hidden", !showContinue);
  updateOverlayLayout(step);
}

function updateOverlayLayout(step) {
  const overlay = document.getElementById("tutorial-match-overlay");
  if (!overlay) return;
  const preferTop = !!step?.validateSpell;
  overlay.classList.toggle("tutorial-match-overlay--card-top", preferTop);
  syncMatchTutorialInset();
}

function syncMatchTutorialInset() {
  const overlay = document.getElementById("tutorial-match-overlay");
  if (!overlay) return;
  const atBottom =
    !overlay.classList.contains("tutorial-match-overlay--card-top") &&
    !document.body.classList.contains("card-preview-open");
  const inset = atBottom ? overlay.getBoundingClientRect().height : 0;
  document.documentElement.style.setProperty("--tutorial-match-inset", `${Math.ceil(inset)}px`);
}

/** Start a lesson turn — move-phase steps skip the spell phase. */
function beginTutorialStepTurn(session, state, step) {
  if (state.phase === PHASE.MOVE && state.spellPlayed?.[COLORS.RED]) {
    session.beginMovePhase({ spellMessage: step.hint || "Choose destination." });
    return;
  }
  session.beginPlayerTurn();
  if (step.hint) session.setMessage(step.hint);
}

/**
 * @param {{ profile: object, saveProfile: (p: object) => void, onComplete: () => void }} opts
 */
export function startInteractiveTutorial({ profile, saveProfile, onComplete }) {
  let stepIndex = 0;
  let matchSession = null;
  let lastMove = null;
  let spellValidated = false;
  let kingStepPromoted = false;

  dismissAppSplash();
  document.querySelectorAll(".view").forEach((v) => v.classList.add("hidden"));
  const root = document.getElementById("view-match");
  if (!root) {
    onComplete?.();
    return;
  }
  root.classList.remove("hidden");
  root.innerHTML = getMatchHtml("Training dummy", { exitLabel: "Skip tutorial" });
  document.body.insertAdjacentHTML("beforeend", overlayHtml());
  document.body.classList.add("tutorial-match-active");
  enterMatchMode({
    kind: "tutorial",
    deckId: "deck-starter",
    deckCardIds: TUTORIAL_DECK,
    opponentName: "Training dummy",
  });

  const skipBtn = document.getElementById("tutorial-match-skip");
  const continueBtn = document.getElementById("tutorial-match-continue");
  const onLayoutChange = () => syncMatchTutorialInset();
  window.addEventListener("resize", onLayoutChange);
  window.addEventListener("card-preview-change", onLayoutChange);
  const insetObserver = new ResizeObserver(onLayoutChange);
  const overlayEl = document.getElementById("tutorial-match-overlay");
  if (overlayEl) insetObserver.observe(overlayEl);

  function finishTutorial() {
    dismissInteractiveTutorial({ persist: true, profile, saveProfile });
    matchSession?.dispose?.();
    matchSession = null;
    exitMatchMode({ clearCheckpoint: true });
    window.removeEventListener("resize", onLayoutChange);
    window.removeEventListener("card-preview-change", onLayoutChange);
    insetObserver.disconnect();
    document.documentElement.style.removeProperty("--tutorial-match-inset");
    document.getElementById("tutorial-match-overlay")?.remove();
    document.body.classList.remove("tutorial-match-active");
    root.innerHTML = "";
    root.classList.add("hidden");
    onComplete?.();
  }

  async function askSkip() {
    const ok = await mobileConfirm(
      "Skip the tutorial? You can always practice in Adventure mode.",
      {
        title: "Skip tutorial?",
        confirmLabel: "Skip",
        cancelLabel: "Keep going",
        destructive: true,
      }
    );
    if (ok) finishTutorial();
  }

  skipBtn?.addEventListener("click", askSkip);

  continueBtn?.addEventListener("click", () => advanceStep());

  const previewHooks = {
    skipOpponentTurn: true,
    onLeaveRequest: askSkip,
    canMovePieces: () => false,
    canEndSpellPhase: () => false,
  };

  function buildStepHooks(step) {
    return {
      skipOpponentTurn: !!step.skipOpponentTurn,
      onLeaveRequest: askSkip,
      spellPhaseBlockMessage: step.hint || "Play the spell shown in the lesson first.",
      canMovePieces() {
        if (spellValidated) return false;
        if (step.validateSpell) return false;
        return true;
      },
      canEndSpellPhase() {
        if (step.validateSpell) return false;
        return true;
      },
      onHumanMove(move) {
        lastMove = move;
      },
      onSpellPlayed(session, card, picks) {
        if (step.validateSpell?.(session, card, picks)) {
          spellValidated = true;
          setTimeout(() => advanceStep(), 600);
        }
      },
      beforeEndHumanTurn(session) {
        if (step.validateSpell) {
          session.setMessage(step.hint || "Play Snowball on the black piece first.");
          return "block";
        }
        const verdict = step.validateTurnEnd?.(session, lastMove, { promoted: kingStepPromoted });
        if (verdict === true) {
          setTimeout(() => advanceStep(), 400);
          return "advance";
        }
        if (verdict === "accept") {
          kingStepPromoted = true;
          session.setMessage("Crowned! Now step your king backward.");
          return "continue";
        }
        session.setMessage(step.hint || "Try again — follow the lesson hint above.");
        return "block";
      },
    };
  }

  function resetTutorialSessionState(session, state) {
    session.state = state;
    session.cardPlay = null;
    session.selectedSquare = null;
    session.validMoves = [];
    session.validTargets = [];
    session.actionBusy = false;
  }

  function mountTutorialBoard(state, hooks, step) {
    if (matchSession) {
      matchSession.tutorialHooks = hooks;
      resetTutorialSessionState(matchSession, state);
      if (step.autoAdvance) {
        matchSession.setMessage("");
      } else {
        beginTutorialStepTurn(matchSession, state, step);
      }
      matchSession.render();
      return;
    }

    matchSession = new MatchSession(
      TUTORIAL_DECK,
      root,
      finishTutorial,
      null,
      {
        opponentName: "Training dummy",
        cosmetics: getEquippedCosmetics(profile),
        profile,
        initialState: state,
        skipInitialTurn: true,
        skipCheckpoint: true,
        tutorialHooks: hooks,
      }
    );

    if (step.autoAdvance) {
      matchSession.setMessage("");
    } else {
      resetTutorialSessionState(matchSession, state);
      beginTutorialStepTurn(matchSession, state, step);
    }
    matchSession.render();
  }

  async function applyStep(index) {
    const step = STEPS[index];
    if (!step) {
      finishTutorial();
      return;
    }

    spellValidated = false;
    lastMove = null;
    kingStepPromoted = false;
    renderOverlay(index, step, { showContinue: !!step.autoAdvance });

    const state = await Promise.resolve(step.buildState());
    const hooks = step.autoAdvance ? previewHooks : buildStepHooks(step);
    mountTutorialBoard(state, hooks, step);
  }

  function advanceStep() {
    stepIndex += 1;
    if (stepIndex >= STEPS.length) {
      finishTutorial();
      return;
    }
    void applyStep(stepIndex);
  }

  void applyStep(0);
}
