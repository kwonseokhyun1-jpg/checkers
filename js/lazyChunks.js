/** @type {Promise<{ MatchSession: typeof import("./match.js").MatchSession, getMatchHtml: typeof import("./matchView.js").getMatchHtml }> | null} */
let matchChunk = null;

export function loadMatchChunk() {
  if (!matchChunk) {
    matchChunk = Promise.all([
      import("./match.js"),
      import("./matchView.js"),
      import("../css/spell-visuals.css"),
      import("../css/chess-theme.css"),
    ]).then(([match, matchView]) => ({
      MatchSession: match.MatchSession,
      getMatchHtml: matchView.getMatchHtml,
    }));
  }
  return matchChunk;
}

/** @type {Promise<{ initPvpUI: typeof import("./pvpUI.js").initPvpUI, clearAllWaitingRoomsOnce: typeof import("./pvp.js").clearAllWaitingRoomsOnce }> | null} */
let pvpChunk = null;

export function loadPvpChunk() {
  if (!pvpChunk) {
    pvpChunk = Promise.all([import("./pvpUI.js"), import("./pvp.js")]).then(([ui, pvp]) => ({
      initPvpUI: ui.initPvpUI,
      clearAllWaitingRoomsOnce: pvp.clearAllWaitingRoomsOnce,
    }));
  }
  return pvpChunk;
}

/** @type {Promise<typeof import("./profileUI.js")> | null} */
let profileUIChunk = null;

export function loadProfileUIChunk() {
  if (!profileUIChunk) profileUIChunk = import("./profileUI.js");
  return profileUIChunk;
}

/** @type {Promise<typeof import("./settingsUI.js")> | null} */
let settingsUIChunk = null;

export function loadSettingsUIChunk() {
  if (!settingsUIChunk) {
    settingsUIChunk = Promise.all([
      import("./settingsUI.js"),
      import("../css/settings.css"),
    ]).then(([settings]) => settings);
  }
  return settingsUIChunk;
}

/** @type {Promise<{ playChestOpenAnimation: typeof import("./chestOpenAnimation.js").playChestOpenAnimation, playCosmeticOpenAnimation: typeof import("./cosmeticOpenAnimation.js").playCosmeticOpenAnimation }> | null} */
let animationsChunk = null;

export function loadAnimationsChunk() {
  if (!animationsChunk) {
    animationsChunk = Promise.all([
      import("./chestOpenAnimation.js"),
      import("./cosmeticOpenAnimation.js"),
    ]).then(([chest, cosmetic]) => ({
      playChestOpenAnimation: chest.playChestOpenAnimation,
      playCosmeticOpenAnimation: cosmetic.playCosmeticOpenAnimation,
    }));
  }
  return animationsChunk;
}

/** @type {Promise<typeof import("./tutorialMeta.js")> | null} */
let tutorialMetaChunk = null;

export function loadTutorialMetaChunk() {
  if (!tutorialMetaChunk) tutorialMetaChunk = import("./tutorialMeta.js");
  return tutorialMetaChunk;
}

/** @type {Promise<typeof import("./tutorialUnlocks.js")> | null} */
let tutorialUnlocksChunk = null;

export function loadTutorialUnlocksChunk() {
  if (!tutorialUnlocksChunk) tutorialUnlocksChunk = import("./tutorialUnlocks.js");
  return tutorialUnlocksChunk;
}

/** @type {Promise<typeof import("./tutorialMatch.js")> | null} */
let tutorialMatchChunk = null;

export function loadTutorialMatchChunk() {
  if (!tutorialMatchChunk) tutorialMatchChunk = import("./tutorialMatch.js");
  return tutorialMatchChunk;
}
