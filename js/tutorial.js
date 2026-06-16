const TUTORIAL_KEY = "arcane_checkers_tutorial_v1";
const INTERACTIVE_TUTORIAL_KEY = "arcane_checkers_interactive_tutorial_v1";
const META_TUTORIAL_KEY = "arcane_checkers_meta_tutorial_v1";
const QUESTS_TUTORIAL_KEY = "arcane_checkers_quests_tutorial_v1";
const PVP_TUTORIAL_KEY = "arcane_checkers_pvp_tutorial_v1";
const COSMETICS_TUTORIAL_KEY = "arcane_checkers_cosmetics_tutorial_v1";
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

/** Clear stale per-device "done" flags when the signed-in profile has not completed that tutorial. */
export function syncTutorialStorageWithProfile(profile) {
  if (!profile) return;
  const pairs = [
    [INTERACTIVE_TUTORIAL_KEY, profile.interactiveTutorialDone || profile.tutorialDone],
    [META_TUTORIAL_KEY, profile.metaTutorialDone || profile.tutorialDone],
    [QUESTS_TUTORIAL_KEY, profile.questsTutorialDone],
    [PVP_TUTORIAL_KEY, profile.pvpTutorialDone],
    [COSMETICS_TUTORIAL_KEY, profile.cosmeticsTutorialDone],
  ];
  try {
    for (const [key, done] of pairs) {
      if (!done && localStorage.getItem(key) === "done") {
        localStorage.removeItem(key);
      }
    }
  } catch {
    /* ignore */
  }
}

/** Reset tutorial completion so a brand-new account always gets the practice lesson. */
export function prepareInteractiveTutorialForNewAccount(profile, saveProfile) {
  markPendingSignupTutorial();
  try {
    localStorage.removeItem(INTERACTIVE_TUTORIAL_KEY);
    localStorage.removeItem(META_TUTORIAL_KEY);
    localStorage.removeItem(QUESTS_TUTORIAL_KEY);
    localStorage.removeItem(PVP_TUTORIAL_KEY);
    localStorage.removeItem(COSMETICS_TUTORIAL_KEY);
    localStorage.removeItem(TUTORIAL_KEY);
  } catch {
    /* ignore */
  }
  if (profile) {
    delete profile.interactiveTutorialDone;
    delete profile.metaTutorialDone;
    delete profile.questsTutorialDone;
    delete profile.pvpTutorialDone;
    delete profile.cosmeticsTutorialDone;
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
      opts.profile.metaTutorialDone = true;
    }
    opts.saveProfile?.(opts.profile);
  }
}

export function dismissInteractiveTutorial(opts = {}) {
  clearPendingSignupTutorial();
  if (opts.persist) {
    try {
      localStorage.setItem(INTERACTIVE_TUTORIAL_KEY, "done");
    } catch {
      /* ignore */
    }
    if (opts.profile) {
      opts.profile.interactiveTutorialDone = true;
    }
    opts.saveProfile?.(opts.profile);
  }
}

export function dismissMetaTutorial(opts = {}) {
  if (opts.persist) {
    try {
      localStorage.setItem(META_TUTORIAL_KEY, "done");
      localStorage.setItem(TUTORIAL_KEY, "done");
    } catch {
      /* ignore */
    }
    if (opts.profile) {
      opts.profile.metaTutorialDone = true;
      opts.profile.tutorialDone = true;
    }
    opts.saveProfile?.(opts.profile);
  }
}

export function shouldShowInteractiveTutorial(profile) {
  if (hasPendingSignupTutorial()) return true;
  if (profile?.interactiveTutorialDone) return false;
  if (profile?.tutorialDone) return false;
  try {
    return localStorage.getItem(INTERACTIVE_TUTORIAL_KEY) !== "done";
  } catch {
    return true;
  }
}

export function shouldShowMetaTutorial(profile) {
  if (profile?.metaTutorialDone || profile?.tutorialDone) return false;
  if (!profile?.interactiveTutorialDone) {
    try {
      if (localStorage.getItem(INTERACTIVE_TUTORIAL_KEY) !== "done") return false;
    } catch {
      return false;
    }
  }
  try {
    return localStorage.getItem(META_TUTORIAL_KEY) !== "done";
  } catch {
    return true;
  }
}

export function dismissQuestsTutorial(opts = {}) {
  if (opts.persist) {
    try {
      localStorage.setItem(QUESTS_TUTORIAL_KEY, "done");
    } catch {
      /* ignore */
    }
    if (opts.profile) {
      opts.profile.questsTutorialDone = true;
    }
    opts.saveProfile?.(opts.profile);
  }
}

export function dismissPvpTutorial(opts = {}) {
  if (opts.persist) {
    try {
      localStorage.setItem(PVP_TUTORIAL_KEY, "done");
    } catch {
      /* ignore */
    }
    if (opts.profile) {
      opts.profile.pvpTutorialDone = true;
    }
    opts.saveProfile?.(opts.profile);
  }
}

export function shouldShowQuestsTutorial(profile) {
  if (profile?.questsTutorialDone) return false;
  try {
    return localStorage.getItem(QUESTS_TUTORIAL_KEY) !== "done";
  } catch {
    return true;
  }
}

export function shouldShowPvpTutorial(profile) {
  if (profile?.pvpTutorialDone) return false;
  if (!profile?.questsTutorialDone) {
    try {
      if (localStorage.getItem(QUESTS_TUTORIAL_KEY) !== "done") return false;
    } catch {
      return false;
    }
  }
  try {
    return localStorage.getItem(PVP_TUTORIAL_KEY) !== "done";
  } catch {
    return true;
  }
}

export function dismissCosmeticsTutorial(opts = {}) {
  if (opts.persist) {
    try {
      localStorage.setItem(COSMETICS_TUTORIAL_KEY, "done");
    } catch {
      /* ignore */
    }
    if (opts.profile) {
      opts.profile.cosmeticsTutorialDone = true;
    }
    opts.saveProfile?.(opts.profile);
  }
}

export function shouldShowCosmeticsTutorial(profile) {
  if (profile?.cosmeticsTutorialDone) return false;
  try {
    return localStorage.getItem(COSMETICS_TUTORIAL_KEY) !== "done";
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
