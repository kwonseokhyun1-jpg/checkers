/**
 * Guided meta tutorial — open chests and build a deck after the practice match.
 */
import { dismissMetaTutorial } from "./tutorial.js";

/** @typedef {{ id: string, title: string, body: string, hint?: string, autoAdvance?: boolean, highlight?: string, allowed?: string[], onEnter?: () => void }} MetaStep */

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
  },
  {
    id: "open-chest",
    title: "Open a spell chest",
    body: "Spend gems on a Bronze Chest — you will get three new spells for your collection.",
    hint: "Tap Open on the Bronze Chest.",
    highlight: ".chest-card--bronze",
    allowed: [".chest-card--bronze", ".chest-card--bronze *", ".chest-open-overlay", ".chest-open-overlay *"],
  },
  {
    id: "deck-tab",
    title: "Build your deck",
    body: "Tap Decks to open the deck builder and customize your 30-card battle list.",
    hint: "Tap Decks in the menu below.",
    highlight: '[data-tab="deck"]',
    allowed: ['[data-tab="deck"]'],
  },
  {
    id: "open-deck",
    title: "Edit your deck",
    body: "Tap your Starter Deck to view and edit the cards you take into battle.",
    hint: "Tap the Starter Deck row.",
    highlight: ".deck-row",
    allowed: [".deck-row", ".deck-row *"],
  },
  {
    id: "remove-card",
    title: "Make room in your deck",
    body: "Your deck holds 30 spells. Tap × on one in the strip above to remove it and make room for something new.",
    hint: "Tap × on a card in your deck strip.",
    highlight: ".deck-slot-remove--visible",
    allowed: [".deck-slot-remove", ".deck-slot-remove--visible", ".deck-slot-wrap", ".deck-slot-wrap *"],
  },
  {
    id: "add-card",
    title: "Add a new spell",
    body: "Tap + Add to deck on a spell from your collection — try one you just pulled from the chest.",
    hint: "Tap + Add to deck on any owned spell.",
    highlight: ".deck-collection-row__action--add, .deck-collection-row__action--buy",
    allowed: [
      ".deck-collection-row__action--add",
      ".deck-collection-row__action--buy",
      ".deck-collection-row__main",
      ".deck-collection-row__thumb",
      ".card-preview-overlay",
      ".card-preview-overlay *",
    ],
  },
  {
    id: "save-deck",
    title: "Save your deck",
    body: "When you are happy with your list, tap Save. You need 30 cards before battling in Adventure.",
    hint: "Tap Save in the deck editor.",
    highlight: "#btn-save-deck, #btn-save-deck-bottom",
    allowed: ["#btn-save-deck", "#btn-save-deck-bottom"],
  },
  {
    id: "done",
    title: "You are ready!",
    body: "Your deck is saved. Head to Play when you want your first Adventure battle — good luck!",
    autoAdvance: true,
  },
];

function overlayHtml() {
  return `
    <div id="tutorial-meta-overlay" class="tutorial-meta-overlay" role="dialog" aria-live="polite">
      <div id="tutorial-meta-spotlight" class="tutorial-meta-spotlight hidden" aria-hidden="true"></div>
      <div class="tutorial-meta-card panel game-panel">
        <p id="tutorial-meta-step" class="tutorial-meta-step"></p>
        <h3 id="tutorial-meta-title" class="tutorial-meta-title"></h3>
        <p id="tutorial-meta-body" class="tutorial-meta-body"></p>
        <p id="tutorial-meta-hint" class="tutorial-meta-hint hidden"></p>
        <div class="tutorial-meta-actions">
          <button type="button" id="tutorial-meta-skip" class="btn-text">Skip tutorial</button>
          <button type="button" id="tutorial-meta-continue" class="btn-primary hidden">Continue</button>
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
  }

  function positionSpotlight() {
    if (!highlightEl || !spotlight) return;
    const rect = highlightEl.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    const pad = 6;
    spotlight.style.left = `${Math.max(0, rect.left - pad)}px`;
    spotlight.style.top = `${Math.max(0, rect.top - pad)}px`;
    spotlight.style.width = `${rect.width + pad * 2}px`;
    spotlight.style.height = `${rect.height + pad * 2}px`;
    spotlight.classList.remove("hidden");
  }

  function scheduleSpotlight() {
    cancelAnimationFrame(spotlightRaf);
    spotlightRaf = requestAnimationFrame(() => {
      positionSpotlight();
      spotlightRaf = requestAnimationFrame(positionSpotlight);
    });
  }

  function applyHighlight(selector) {
    clearHighlight();
    if (!selector) return;
    const el = document.querySelector(selector);
    if (!el) return;
    highlightEl = el;
    highlightEl.classList.add("tutorial-meta-highlight");
    scheduleSpotlight();
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

  function onCapturePointer(e) {
    if (!controller?.active) return;
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target.closest("#tutorial-meta-overlay")) return;
    if (isAllowedTarget(target)) return;
    e.preventDefault();
    e.stopPropagation();
  }

  function teardown() {
    controller = null;
    cancelAnimationFrame(spotlightRaf);
    clearHighlight();
    document.body.classList.remove("tutorial-meta-active");
    document.removeEventListener("click", onCapturePointer, true);
    document.removeEventListener("touchend", onCapturePointer, true);
    window.removeEventListener("resize", scheduleSpotlight);
    window.removeEventListener("scroll", scheduleSpotlight, true);
    overlay?.remove();
  }

  function finishTutorial() {
    dismissMetaTutorial({ persist: true, profile, saveProfile });
    teardown();
    onComplete?.();
  }

  function askSkip() {
    if (window.confirm("Skip the collection and deck tutorial? You can explore the Shop and Decks anytime.")) {
      finishTutorial();
    }
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
    applyHighlight(step.highlight);
    if (step.highlight) {
      setTimeout(() => applyHighlight(step.highlight), 120);
      setTimeout(() => applyHighlight(step.highlight), 400);
    }
    step.onEnter?.();
    scheduleSpotlight();
  }

  function onEvent(event, data) {
    const step = STEPS[stepIndex];
    if (!step) return;

    if (step.id === "shop-tab" && event === "tab-changed" && data?.tab === "chests") {
      setTimeout(advanceStep, 300);
    } else if (step.id === "open-chest" && event === "chest-opened") {
      setTimeout(advanceStep, 500);
    } else if (step.id === "deck-tab" && event === "tab-changed" && data?.tab === "deck") {
      setTimeout(advanceStep, 300);
    } else if (step.id === "open-deck" && event === "deck-edit-opened") {
      setTimeout(advanceStep, 300);
    } else if (step.id === "remove-card" && event === "card-removed-from-deck") {
      setTimeout(advanceStep, 400);
    } else if (step.id === "add-card" && event === "card-added-to-deck") {
      setTimeout(advanceStep, 400);
    } else if (step.id === "save-deck" && event === "deck-saved") {
      setTimeout(advanceStep, 400);
    }
  }

  controller = {
    active: true,
    onEvent,
    finish: finishTutorial,
  };

  skipBtn?.addEventListener("click", askSkip);
  continueBtn?.addEventListener("click", advanceStep);
  document.addEventListener("click", onCapturePointer, true);
  document.addEventListener("touchend", onCapturePointer, true);
  window.addEventListener("resize", scheduleSpotlight);
  window.addEventListener("scroll", scheduleSpotlight, true);

  renderStep();
}
