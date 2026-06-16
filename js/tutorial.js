const TUTORIAL_KEY = "arcane_checkers_tutorial_v1";
const INTERACTIVE_TUTORIAL_KEY = "arcane_checkers_interactive_tutorial_v1";
const PENDING_SIGNUP_TUTORIAL_KEY = "arcane_checkers_pending_signup_tutorial_v1";

export function markPendingSignupTutorial() {
  try {
    sessionStorage.setItem(PENDING_SIGNUP_TUTORIAL_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function clearPendingSignupTutorial() {
  try {
    sessionStorage.removeItem(PENDING_SIGNUP_TUTORIAL_KEY);
  } catch {
    /* ignore */
  }
}

function hasPendingSignupTutorial() {
  try {
    return sessionStorage.getItem(PENDING_SIGNUP_TUTORIAL_KEY) === "1";
  } catch {
    return false;
  }
}

/** Reset tutorial completion so a brand-new account always gets the practice lesson. */
export function prepareInteractiveTutorialForNewAccount(profile, saveProfile) {
  markPendingSignupTutorial();
  try {
    localStorage.removeItem(INTERACTIVE_TUTORIAL_KEY);
    localStorage.removeItem(TUTORIAL_KEY);
  } catch {
    /* ignore */
  }
  if (profile) {
    delete profile.interactiveTutorialDone;
    delete profile.tutorialDone;
    saveProfile?.(profile);
  }
}

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
  clearPendingSignupTutorial();
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
  if (hasPendingSignupTutorial()) return true;
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
