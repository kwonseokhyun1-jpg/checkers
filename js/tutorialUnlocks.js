/**
 * Post–floor unlock tutorials for Quests, PvP, and Cosmetics.
 */
import {
  dismissQuestsTutorial,
  dismissPvpTutorial,
  dismissCosmeticsTutorial,
  isTutorialPassthroughTarget,
} from "./tutorial.js";
import { mobileConfirm } from "./mobileConfirm.js";

/** @typedef {{ id: string, title: string, body: string, hint?: string, autoAdvance?: boolean, highlight?: string, allowed?: string[], actionSelector?: string }} UnlockStep */

/** @type {UnlockStep[]} */
const QUESTS_STEPS = [
  {
    id: "intro",
    title: "Quests unlocked!",
    body: "Complete quests to track your progress and unlock mage titles for your profile.",
    autoAdvance: true,
  },
  {
    id: "quests-tab",
    title: "Open Quests",
    body: "Tap the Quests tab to see challenges and rewards.",
    hint: "Tap Quests in the menu below.",
    highlight: '[data-tab="quests"]',
    allowed: ['[data-tab="quests"]'],
    actionSelector: '[data-tab="quests"]',
  },
  {
    id: "quests-view",
    title: "Your quest list",
    body: "Win matches, clear Adventure floors, and hit milestones to complete quests — then claim titles from your Profile.",
    autoAdvance: true,
  },
];

/** @type {UnlockStep[]} */
const PVP_STEPS = [
  {
    id: "intro",
    title: "PvP unlocked!",
    body: "Challenge other players in real-time 1v1 matches.",
    autoAdvance: true,
  },
  {
    id: "pvp-tab",
    title: "Open PvP",
    body: "Tap the PvP tab to host or join a room.",
    hint: "Tap PvP in the menu below.",
    highlight: '[data-tab="pvp"]',
    allowed: ['[data-tab="pvp"]'],
    actionSelector: '[data-tab="pvp"]',
  },
  {
    id: "pvp-lobby",
    title: "PvP Hub",
    body: "Tap Arena to host or join matches. Tap Leaderboard for global ranks and live spectating.",
    autoAdvance: true,
  },
];

/** @type {UnlockStep[]} */
const COSMETICS_STEPS = [
  {
    id: "intro",
    title: "Cosmetics unlocked!",
    body: "Customize your avatar, frame, banner, and piece skin. Open cosmetic boxes in the Shop, then equip your favorites in Profile.",
    autoAdvance: true,
  },
  {
    id: "shop-tab",
    title: "Open the Shop",
    body: "Tap the Shop tab to browse cosmetic boxes.",
    hint: "Tap Shop in the menu below.",
    highlight: '[data-tab="chests"]',
    allowed: ['[data-tab="chests"]'],
    actionSelector: '[data-tab="chests"]',
  },
  {
    id: "cosmetics-vault-tab",
    title: "Cosmetic boxes",
    body: "Switch to the Cosmetics tab to see vanity boxes — avatars, frames, banners, and piece skins.",
    hint: "Tap Cosmetics in the shop tabs.",
    highlight: '[data-vault-tab="cosmetics"]',
    allowed: ['[data-vault-tab="cosmetics"]'],
    actionSelector: '[data-vault-tab="cosmetics"]',
  },
  {
    id: "open-cosmetic",
    title: "Open a cosmetic box",
    body: "Spend gems on a Bronze Cosmetic Box — you will unlock new profile items.",
    hint: "Tap Open on the Bronze Cosmetic Box.",
    highlight: '#cosmetic-box-list .cosmetic-box-card--bronze .btn-open-cosmetic',
    allowed: [
      '#cosmetic-box-list .cosmetic-box-card--bronze',
      '#cosmetic-box-list .cosmetic-box-card--bronze *',
      ".cosmetic-open-overlay",
      ".cosmetic-open-overlay *",
    ],
    actionSelector: '#cosmetic-box-list .cosmetic-box-card--bronze .btn-open-cosmetic',
  },
  {
    id: "profile-btn",
    title: "Open Profile",
    body: "Tap your portrait in the header, then choose Profile to equip your new cosmetics.",
    hint: "Tap your avatar, then tap Profile.",
    highlight: "#header-profile-btn",
    allowed: [
      "#header-profile-btn",
      "#header-profile-btn *",
      "#header-profile-dropdown",
      "#header-profile-dropdown *",
    ],
    actionSelector: '[data-profile-menu-action="profile"]',
  },
  {
    id: "equip-cosmetic",
    title: "Equip a cosmetic",
    body: "Tap any unlocked item to equip it — your avatar, frame, banner, and piece skin show in battle and PvP.",
    hint: "Tap Equip on a cosmetic you unlocked.",
    highlight: ".profile-cosmetic-card:not(.profile-cosmetic-card--equipped)",
    allowed: [".profile-cosmetic-card", ".profile-cosmetic-card *"],
    actionSelector: ".profile-cosmetic-card:not(.profile-cosmetic-card--equipped)",
  },
  {
    id: "done",
    title: "Looking great!",
    body: "Your style is saved. Keep opening boxes for more looks — good luck in Adventure!",
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

export function isUnlockTutorialActive() {
  return controller?.active ?? false;
}

export function notifyUnlockTutorial(event, data) {
  controller?.onEvent(event, data);
}

/**
 * @param {{
 *   steps: UnlockStep[],
 *   skipMessage: string,
 *   dismiss: (opts: object) => void,
 *   profile: object,
 *   saveProfile: (p: object) => void,
 *   onComplete: () => void,
 *   onEventMap: (step: UnlockStep, event: string, data?: object) => boolean,
 * }} opts
 */
function startSpotlightTutorial({ steps, skipMessage, dismiss, profile, saveProfile, onComplete, onEventMap }) {
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
      (parseFloat(rootStyle.getPropertyValue("--nav-height")) || 2.75) *
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
    const step = steps[stepIndex];
    if (!step) return true;
    if (step.autoAdvance) {
      return target.closest("#tutorial-meta-continue, #tutorial-meta-skip");
    }
    const allowed = step.allowed || [];
    return allowed.some((sel) => target.closest(sel));
  }

  function proxyActionClick(target) {
    const step = steps[stepIndex];
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
    const step = steps[stepIndex];
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
    dismiss({ persist: true, profile, saveProfile });
    teardown();
    onComplete?.();
  }

  async function askSkip() {
    const ok = await mobileConfirm(skipMessage, {
      title: "Skip tutorial?",
      confirmLabel: "Skip",
      cancelLabel: "Keep going",
      destructive: true,
    });
    if (ok) finishTutorial();
  }

  function advanceStep() {
    stepIndex += 1;
    if (stepIndex >= steps.length) {
      finishTutorial();
      return;
    }
    renderStep();
  }

  function renderStep() {
    const step = steps[stepIndex];
    if (!step) {
      finishTutorial();
      return;
    }

    const lessonSteps = steps.filter((s) => !s.autoAdvance);
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
      window.setTimeout(() => applyHighlight(step.highlight), 120);
      window.setTimeout(() => applyHighlight(step.highlight), 400);
    }
    scheduleSpotlight();
  }

  function onEvent(event, data) {
    const step = steps[stepIndex];
    if (!step) return;
    if (onEventMap(step, event, data)) {
      window.setTimeout(advanceStep, 300);
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

/**
 * @param {{ profile: object, saveProfile: (p: object) => void, onComplete: () => void }} opts
 */
export function startQuestsTutorial(opts) {
  startSpotlightTutorial({
    ...opts,
    steps: QUESTS_STEPS,
    skipMessage: "Skip the Quests tutorial? You can open Quests anytime from the menu.",
    dismiss: dismissQuestsTutorial,
    onEventMap: (step, event, data) =>
      step.id === "quests-tab" && event === "tab-changed" && data?.tab === "quests",
  });
}

/**
 * @param {{ profile: object, saveProfile: (p: object) => void, onComplete: () => void }} opts
 */
export function startPvpTutorial(opts) {
  startSpotlightTutorial({
    ...opts,
    steps: PVP_STEPS,
    skipMessage: "Skip the PvP tutorial? You can open PvP anytime from the menu.",
    dismiss: dismissPvpTutorial,
    onEventMap: (step, event, data) =>
      step.id === "pvp-tab" && event === "tab-changed" && data?.tab === "pvp",
  });
}

/**
 * @param {{ profile: object, saveProfile: (p: object) => void, onComplete: () => void }} opts
 */
export function startCosmeticsTutorial(opts) {
  startSpotlightTutorial({
    ...opts,
    steps: COSMETICS_STEPS,
    skipMessage: "Skip the cosmetics tutorial? You can open cosmetic boxes in the Shop anytime.",
    dismiss: dismissCosmeticsTutorial,
    onEventMap: (step, event, data) => {
      if (step.id === "shop-tab" && event === "tab-changed" && data?.tab === "chests") return true;
      if (step.id === "cosmetics-vault-tab" && event === "vault-tab-changed" && data?.tab === "cosmetics") return true;
      if (step.id === "open-cosmetic" && event === "cosmetic-box-opened") return true;
      if (step.id === "profile-btn" && event === "profile-opened") return true;
      if (step.id === "equip-cosmetic" && event === "cosmetic-equipped") return true;
      return false;
    },
  });
}
