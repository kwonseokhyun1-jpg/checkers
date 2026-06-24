/**
 * Guided meta tutorial — open chests and build a deck after the practice match.
 */
import { dismissMetaTutorial, isTutorialPassthroughTarget } from "./tutorial.js";
import { DECK_SIZE } from "./cardCatalog.js";
import { mobileConfirm } from "./mobileConfirm.js";

/** @typedef {{ id: string, title: string, body: string, hint?: string, autoAdvance?: boolean, highlight?: string, allowed?: string[], actionSelector?: string, onEnter?: () => void }} MetaStep */

/** @type {MetaStep[]} */
const STEPS = [
  {
    id: "intro",
    title: "Grow your collection",
    body: "You start with gems to open spell chests in the Shop. New cards go into your collection for deck building.",
    autoAdvance: true,
  },
  {
    id: "shop-tab",
    title: "Open the Shop",
    body: "Tap the Shop tab to browse spell chests.",
    hint: "Tap Shop in the menu below.",
    highlight: '[data-tab="chests"]',
    allowed: ['[data-tab="chests"]'],
    actionSelector: '[data-tab="chests"]',
  },
  {
    id: "open-chest",
    title: "Open a spell chest",
    body: "Spend gems on a Bronze Chest — you will get three new spells for your collection.",
    hint: "Tap Open on the Bronze Chest.",
    highlight: '#chest-list .chest-card--bronze .chest-open[data-id="bronze"]',
    allowed: [
      '#chest-list .chest-card--bronze',
      '#chest-list .chest-card--bronze *',
      ".chest-open-overlay",
      ".chest-open-overlay *",
    ],
    actionSelector: '#chest-list .chest-card--bronze .chest-open[data-id="bronze"]',
  },
  {
    id: "deck-tab",
    title: "Build your deck",
    body: `Tap Decks to open the deck builder and customize your ${DECK_SIZE}-card battle list.`,
    hint: "Tap Decks in the menu below.",
    highlight: '[data-tab="deck"]',
    allowed: ['[data-tab="deck"]'],
    actionSelector: '[data-tab="deck"]',
  },
  {
    id: "open-deck",
    title: "Edit your deck",
    body: "Tap your Starter Deck to view and edit the cards you take into battle.",
    hint: "Tap the Starter Deck tile.",
    highlight: ".deck-row",
    allowed: [".deck-row", ".deck-row *"],
    actionSelector: ".deck-row",
  },
  {
    id: "remove-card",
    title: "Make room in your deck",
    body: `Your deck holds ${DECK_SIZE} spells. Tap × on one in the strip above to remove it and make room for something new.`,
    hint: "Tap × on a card in your deck strip.",
    highlight: ".deck-slot-remove--visible",
    allowed: [".deck-slot-remove", ".deck-slot-remove--visible", ".deck-slot-wrap", ".deck-slot-wrap *"],
    actionSelector: ".deck-slot-remove--visible, .deck-slot-remove",
  },
  {
    id: "add-card",
    title: "Add a new spell",
    body: "Tap + Add to deck on a spell from your collection — try one you just pulled from the chest.",
    hint: "Tap + Add to deck on any owned spell.",
    highlight: ".deck-editor-tile__action--add, .deck-editor-tile__action--buy",
    allowed: [
      ".deck-editor-tile__action--add",
      ".deck-editor-tile__action--buy",
      ".deck-editor-tile__card",
      ".card-preview-modal",
      ".card-preview-modal *",
    ],
    actionSelector: ".deck-editor-tile__action--add, .deck-editor-tile__action--buy",
  },
  {
    id: "save-deck",
    title: "Save your deck",
    body: `When you are happy with your list, tap Save. You need ${DECK_SIZE} cards before battling in Adventure.`,
    hint: "Tap Save in the deck editor.",
    highlight: "#btn-save-deck",
    allowed: ["#btn-save-deck"],
    actionSelector: "#btn-save-deck",
  },
  {
    id: "done",
    title: "You are ready!",
    body: "Your deck is saved. Head to Play when you want your first Adventure battle — good luck!",
    autoAdvance: true,
  },
];

const HIGHLIGHT_PAD = 8;

function overlayHtml() {
  return `
    <div id="tutorial-meta-overlay" class="tutorial-meta-overlay" role="dialog" aria-live="polite">
      <div id="tutorial-meta-shield" class="tutorial-meta-shield hidden" aria-hidden="true"></div>
      <div id="tutorial-meta-spotlight" class="tutorial-meta-spotlight hidden" aria-hidden="true"></div>
      <div class="tutorial-meta-card panel game-panel">
        <p id="tutorial-meta-step" class="tutorial-meta-step"></p>
        <h3 id="tutorial-meta-title" class="tutorial-meta-title"></h3>
        <p id="tutorial-meta-body" class="tutorial-meta-body"></p>
        <p id="tutorial-meta-hint" class="tutorial-meta-hint hidden"></p>
        <div class="tutorial-meta-actions">
          <button type="button" id="tutorial-meta-continue" class="btn-primary hidden">Continue</button>
          <button type="button" id="tutorial-meta-skip" class="btn-text tutorial-skip-btn">Skip tutorial</button>
        </div>
      </div>
    </div>`;
}

/** @type {{ active: boolean, onEvent: (event: string, data?: object) => void, finish: () => void } | null} */
let controller = null;

export function isMetaTutorialActive() {
  return controller?.active ?? false;
}

export function notifyMetaTutorial(event, data) {
  controller?.onEvent(event, data);
}

/**
 * @param {{ profile: object, saveProfile: (p: object) => void, onComplete: () => void }} opts
 */
export function startMetaTutorial({ profile, saveProfile, onComplete }) {
  let stepIndex = 0;
  let highlightEl = null;
  let spotlightRaf = 0;

  document.body.insertAdjacentHTML("beforeend", overlayHtml());
  document.body.classList.add("tutorial-meta-active");

  const overlay = document.getElementById("tutorial-meta-overlay");
  const shield = document.getElementById("tutorial-meta-shield");
  const spotlight = document.getElementById("tutorial-meta-spotlight");
  const stepEl = document.getElementById("tutorial-meta-step");
  const titleEl = document.getElementById("tutorial-meta-title");
  const bodyEl = document.getElementById("tutorial-meta-body");
  const hintEl = document.getElementById("tutorial-meta-hint");
  const skipBtn = document.getElementById("tutorial-meta-skip");
  const continueBtn = document.getElementById("tutorial-meta-continue");

  function clearHighlight() {
    highlightEl?.classList.remove("tutorial-meta-highlight");
    highlightEl = null;
    spotlight?.classList.add("hidden");
    shield?.classList.add("hidden");
    overlay?.classList.remove("tutorial-meta-overlay--card-top");
  }

  function getHighlightRect() {
    if (!highlightEl) return null;
    const rect = highlightEl.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return null;
    return rect;
  }

  function updateShieldHole(rect) {
    if (!shield) return;
    if (!rect) {
      shield.classList.add("hidden");
      return;
    }

    const left = Math.max(0, rect.left - HIGHLIGHT_PAD);
    const top = Math.max(0, rect.top - HIGHLIGHT_PAD);
    const right = Math.min(window.innerWidth, rect.right + HIGHLIGHT_PAD);
    const bottom = Math.min(window.innerHeight, rect.bottom + HIGHLIGHT_PAD);

    shield.style.clipPath = `polygon(
      0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%,
      ${left}px ${top}px,
      ${left}px ${bottom}px,
      ${right}px ${bottom}px,
      ${right}px ${top}px,
      ${left}px ${top}px
    )`;
    shield.classList.remove("hidden");
  }

  function positionSpotlight() {
    const rect = getHighlightRect();
    if (!rect || !spotlight) {
      spotlight?.classList.add("hidden");
      shield?.classList.add("hidden");
      return;
    }

    const left = Math.max(0, rect.left - HIGHLIGHT_PAD);
    const top = Math.max(0, rect.top - HIGHLIGHT_PAD);
    const width = rect.width + HIGHLIGHT_PAD * 2;
    const height = rect.height + HIGHLIGHT_PAD * 2;

    spotlight.style.left = `${left}px`;
    spotlight.style.top = `${top}px`;
    spotlight.style.width = `${width}px`;
    spotlight.style.height = `${height}px`;
    spotlight.classList.remove("hidden");
    updateShieldHole(rect);
    positionTutorialCard(rect);
  }

  function positionTutorialCard(highlightRect) {
    if (!overlay) return;
    const card = overlay.querySelector(".tutorial-meta-card");
    if (!card) return;

    if (!highlightRect) {
      overlay.classList.remove("tutorial-meta-overlay--card-top");
      return;
    }

    const cardHeight = card.offsetHeight + 28;
    const viewHeight = window.innerHeight;
    const rootStyle = getComputedStyle(document.documentElement);
    const navPx =
      (parseFloat(rootStyle.getPropertyValue("--nav-height")) || 4.25) *
      (parseFloat(rootStyle.fontSize) || 16);
    const bottomChrome = navPx + 16;
    const spaceBelow = viewHeight - highlightRect.bottom - bottomChrome;
    const spaceAbove = highlightRect.top;
    const preferTop = spaceBelow < cardHeight + 16 || spaceBelow < spaceAbove;

    overlay.classList.toggle("tutorial-meta-overlay--card-top", preferTop);
  }

  function scheduleSpotlight() {
    cancelAnimationFrame(spotlightRaf);
    spotlightRaf = requestAnimationFrame(() => {
      positionSpotlight();
      spotlightRaf = requestAnimationFrame(positionSpotlight);
    });
  }

  function scrollHighlightIntoView() {
    if (!highlightEl) return;
    highlightEl.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
    window.setTimeout(scheduleSpotlight, 280);
    window.setTimeout(scheduleSpotlight, 520);
  }

  function applyHighlight(selector) {
    clearHighlight();
    if (!selector) return;
    const el = document.querySelector(selector);
    if (!el) return;
    highlightEl = el;
    highlightEl.classList.add("tutorial-meta-highlight");
    scrollHighlightIntoView();
    scheduleSpotlight();
  }

  function findActionElement(step) {
    if (!step?.actionSelector) return null;
    return document.querySelector(step.actionSelector);
  }

  function isAllowedTarget(target) {
    const step = STEPS[stepIndex];
    if (!step) return true;
    if (step.autoAdvance) {
      return target.closest("#tutorial-meta-continue, #tutorial-meta-skip");
    }
    const allowed = step.allowed || [];
    return allowed.some((sel) => target.closest(sel));
  }

  function proxyActionClick(target) {
    const step = STEPS[stepIndex];
    if (!step?.actionSelector || step.autoAdvance) return false;
    if (!isAllowedTarget(target)) return false;

    const action = findActionElement(step);
    if (!action || action.disabled) return false;
    if (target.closest(step.actionSelector)) return false;

    action.click();
    return true;
  }

  function onShieldPointer(e) {
    if (!controller?.active) return;
    const step = STEPS[stepIndex];
    if (step?.autoAdvance) return;
    e.preventDefault();
    e.stopPropagation();
  }

  function onCapturePointer(e) {
    if (!controller?.active) return;
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (isTutorialPassthroughTarget(target)) return;

    if (isAllowedTarget(target)) {
      if (e.type === "click" && proxyActionClick(target)) {
        e.preventDefault();
        e.stopPropagation();
      }
      return;
    }

    e.preventDefault();
    e.stopPropagation();
  }

  function teardown() {
    controller = null;
    cancelAnimationFrame(spotlightRaf);
    clearHighlight();
    document.body.classList.remove("tutorial-meta-active");
    document.removeEventListener("click", onCapturePointer, true);
    document.removeEventListener("pointerup", onCapturePointer, true);
    window.removeEventListener("resize", scheduleSpotlight);
    window.removeEventListener("scroll", scheduleSpotlight, true);
    shield?.removeEventListener("click", onShieldPointer);
    shield?.removeEventListener("pointerup", onShieldPointer);
    overlay?.remove();
  }

  function finishTutorial() {
    dismissMetaTutorial({ persist: true, profile, saveProfile });
    teardown();
    onComplete?.();
  }

  async function askSkip() {
    const ok = await mobileConfirm(
      "Skip the collection and deck tutorial? You can explore the Shop and Decks anytime.",
      {
        title: "Skip tutorial?",
        confirmLabel: "Skip",
        cancelLabel: "Keep going",
        destructive: true,
      }
    );
    if (ok) finishTutorial();
  }

  function advanceStep() {
    stepIndex += 1;
    if (stepIndex >= STEPS.length) {
      finishTutorial();
      return;
    }
    renderStep();
  }

  function renderStep() {
    const step = STEPS[stepIndex];
    if (!step) {
      finishTutorial();
      return;
    }

    const lessonSteps = STEPS.filter((s) => !s.autoAdvance);
    const lessonNum = lessonSteps.findIndex((s) => s.id === step.id) + 1;

    if (stepEl) {
      stepEl.textContent = step.autoAdvance
        ? ""
        : lessonNum > 0
          ? `Step ${lessonNum} of ${lessonSteps.length}`
          : "";
    }
    if (titleEl) titleEl.textContent = step.title;
    if (bodyEl) bodyEl.textContent = step.body;
    if (hintEl) {
      hintEl.textContent = step.hint || "";
      hintEl.classList.toggle("hidden", !step.hint);
    }
    continueBtn?.classList.toggle("hidden", !step.autoAdvance);

    step.onEnter?.();
    applyHighlight(step.highlight);
    if (step.highlight) {
      window.setTimeout(() => applyHighlight(step.highlight), 120);
      window.setTimeout(() => applyHighlight(step.highlight), 400);
    }
    scheduleSpotlight();
  }

  function onEvent(event, data) {
    const step = STEPS[stepIndex];
    if (!step) return;

    if (step.id === "shop-tab" && event === "tab-changed" && data?.tab === "chests") {
      window.setTimeout(advanceStep, 300);
    } else if (step.id === "open-chest" && event === "chest-opened") {
      window.setTimeout(advanceStep, 500);
    } else if (step.id === "deck-tab" && event === "tab-changed" && data?.tab === "deck") {
      window.setTimeout(advanceStep, 300);
    } else if (step.id === "open-deck" && event === "deck-edit-opened") {
      window.setTimeout(advanceStep, 300);
    } else if (step.id === "remove-card" && event === "card-removed-from-deck") {
      window.setTimeout(advanceStep, 400);
    } else if (step.id === "add-card" && event === "card-added-to-deck") {
      window.setTimeout(advanceStep, 400);
    } else if (step.id === "save-deck" && event === "deck-saved") {
      window.setTimeout(advanceStep, 400);
    }
  }

  controller = {
    active: true,
    onEvent,
    finish: finishTutorial,
  };

  skipBtn?.addEventListener("click", askSkip);
  continueBtn?.addEventListener("click", advanceStep);
  shield?.addEventListener("click", onShieldPointer);
  shield?.addEventListener("pointerup", onShieldPointer);
  document.addEventListener("click", onCapturePointer, true);
  document.addEventListener("pointerup", onCapturePointer, true);
  window.addEventListener("resize", scheduleSpotlight);
  window.addEventListener("scroll", scheduleSpotlight, true);

  renderStep();
}
