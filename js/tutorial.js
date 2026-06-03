const TUTORIAL_KEY = "arcane_checkers_tutorial_v1";

const STEPS = [
  {
    title: "Welcome to Arcane Checkers",
    body: "Build decks, cast spells, and capture every enemy piece. This quick tour covers cards and the Vault.",
  },
  {
    title: "Playing spells in battle",
    body: "On your turn, drag a spell from your hand onto the board or tap highlighted squares. One spell per turn — then move a piece. Tap End spell phase to skip casting.",
  },
  {
    title: "Opening the Vault",
    body: "Earn gems from adventure wins. Open the Vault tab to buy spell chests with gems. New cards go to your collection for deck building.",
  },
  {
    title: "Save your progress",
    body: "Progress saves automatically on this device. Sign in from the header to sync decks, stars, and collection to the cloud.",
  },
];

export function shouldShowTutorial(profile) {
  if (profile?.tutorialDone) return false;
  try {
    return localStorage.getItem(TUTORIAL_KEY) !== "done";
  } catch {
    return true;
  }
}

export function initTutorial({ profile, saveProfile, onDone }) {
  const modal = document.getElementById("tutorial-modal");
  if (!modal || !shouldShowTutorial(profile)) return;

  const titleEl = modal.querySelector("#tutorial-title");
  const bodyEl = modal.querySelector("#tutorial-body");
  const stepEl = modal.querySelector("#tutorial-step");
  const nextBtn = modal.querySelector("#tutorial-next");
  const skipBtn = modal.querySelector("#tutorial-skip");
  let index = 0;

  function render() {
    const step = STEPS[index];
    if (titleEl) titleEl.textContent = step.title;
    if (bodyEl) bodyEl.textContent = step.body;
    if (stepEl) stepEl.textContent = `${index + 1} / ${STEPS.length}`;
    if (nextBtn) nextBtn.textContent = index >= STEPS.length - 1 ? "Got it" : "Next";
  }

  function finish() {
    try {
      localStorage.setItem(TUTORIAL_KEY, "done");
    } catch {
      /* ignore */
    }
    profile.tutorialDone = true;
    saveProfile?.(profile);
    modal.classList.add("hidden");
    onDone?.();
  }

  nextBtn?.addEventListener("click", () => {
    if (index >= STEPS.length - 1) finish();
    else {
      index += 1;
      render();
    }
  });
  skipBtn?.addEventListener("click", finish);

  render();
  modal.classList.remove("hidden");
}
