const TUTORIAL_KEY = "arcane_checkers_tutorial_v1";
const INTERACTIVE_TUTORIAL_KEY = "arcane_checkers_interactive_tutorial_v1";

export function dismissTutorial(opts = {}) {
  const modal = document.getElementById("tutorial-modal");
  if (modal) modal.classList.add("hidden");

  if (opts.persist) {
    try {
      localStorage.setItem(TUTORIAL_KEY, "done");
    } catch {
      /* ignore */
    }
    if (opts.profile) {
      opts.profile.tutorialDone = true;
      opts.profile.interactiveTutorialDone = true;
    }
    opts.saveProfile?.(opts.profile);
  }
}

export function dismissInteractiveTutorial(opts = {}) {
  if (opts.persist) {
    try {
      localStorage.setItem(INTERACTIVE_TUTORIAL_KEY, "done");
      localStorage.setItem(TUTORIAL_KEY, "done");
    } catch {
      /* ignore */
    }
    if (opts.profile) {
      opts.profile.interactiveTutorialDone = true;
      opts.profile.tutorialDone = true;
    }
    opts.saveProfile?.(opts.profile);
  }
}

export function shouldShowInteractiveTutorial(profile) {
  if (profile?.interactiveTutorialDone || profile?.tutorialDone) return false;
  try {
    return localStorage.getItem(INTERACTIVE_TUTORIAL_KEY) !== "done";
  } catch {
    return true;
  }
}

/** @deprecated Legacy modal tutorial — replaced by interactive practice match. */
export function shouldShowTutorial(profile) {
  return false;
}

/** @deprecated Legacy modal tutorial — replaced by interactive practice match. */
export function initTutorial() {}
