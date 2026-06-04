/**
 * Per-match achievement event tracking (player-local matches only).
 */
import { countPieces, COLORS, SIZE } from "./board.js";
import {
  incrementAchievement,
  syncArcaneMastery,
  isAchievementComplete,
} from "./achievements.js";

function opponentColor(color) {
  return color === COLORS.RED ? COLORS.BLACK : COLORS.RED;
}

export function createMatchAchievementTracker(profile, localColor) {
  if (!profile) return null;

  const opp = opponentColor(localColor);
  let dirty = false;
  const session = {
    usedSacrificeOffering: false,
    opponentCapturedUs: false,
    kingsPromotedThisMatch: 0,
    spellCapturesThisTurn: 0,
    notifiedComplete: new Set(),
  };

  const persistIfNeeded = () => {
    if (!dirty) return;
    dirty = false;
    import("./storage.js").then(({ saveProfile }) => saveProfile(profile)).catch(() => {});
  };

  const applyIncrements = (events) => {
    for (const [id, amount] of events) {
      if (isAchievementComplete(profile, id)) continue;
      const { newlyComplete } = incrementAchievement(profile, id, amount);
      if (newlyComplete.length) dirty = true;
    }
  };

  const countKings = (state, color) => {
    let n = 0;
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const p = state.board[r]?.[c];
        if (p?.color === color && p.king) n++;
      }
    }
    return n;
  };

  const onSpellBefore = (state) => {
    session._oppBefore = countPieces(state.board, opp);
    session._kingsBefore = countKings(state, localColor);
    session._spellKills = 0;
  };

  const onSpellAfter = (state, effect, res) => {
    if (!res?.success) return;
    const oppAfter = countPieces(state.board, opp);
    const kills = Math.max(0, (session._oppBefore ?? oppAfter) - oppAfter);
    session._spellKills = kills;

    if (effect === "chain_lightning") {
      applyIncrements([["storm_summoner", 1]]);
    }
    if (effect === "sacrifice" || effect === "offering") {
      session.usedSacrificeOffering = true;
    }
    if (effect === "mind_control" || effect === "hostile_swap") {
      applyIncrements([["mind_bender", 1]]);
    }
    if (effect === "blizzard" || effect === "deep_freeze") {
      const frozen = res.freezeCount ?? parseFreezeCount(res.message) ?? 0;
      if (frozen >= 3) applyIncrements([["frozen_hearth", 1]]);
    }

    session.spellCapturesThisTurn += kills;
    if (session.spellCapturesThisTurn >= 4) {
      applyIncrements([["magical_sweep", 1]]);
    }
    const kingsAfter = countKings(state, localColor);
    const kingGain = kingsAfter - (session._kingsBefore ?? kingsAfter);
    for (let i = 0; i < kingGain; i++) onKingPromoted();
    persistIfNeeded();
  };

  const onMoveAfter = (state) => {
    const kingsAfter = countKings(state, localColor);
    const kingGain = kingsAfter - (session._kingsBefore ?? kingsAfter);
    session._kingsBefore = kingsAfter;
    for (let i = 0; i < kingGain; i++) onKingPromoted();
    persistIfNeeded();
  };

  const onMoveBefore = (state) => {
    session._kingsBefore = countKings(state, localColor);
  };

  const onTrapTriggered = (trapOwner, victimColor) => {
    if (trapOwner !== localColor || victimColor === localColor) return;
    applyIncrements([["silent_assassin", 1]]);
    persistIfNeeded();
  };

  const onOurPieceCaptured = () => {
    session.opponentCapturedUs = true;
  };

  const onKingPromoted = () => {
    session.kingsPromotedThisMatch += 1;
    if (session.kingsPromotedThisMatch >= 4) {
      applyIncrements([["royal_fleet", 1]]);
      persistIfNeeded();
    }
  };

  const onTurnStart = () => {
    session.spellCapturesThisTurn = 0;
  };

  const onVictory = (state) => {
    const remaining = countPieces(state.board, localColor);
    if (remaining === 1) applyIncrements([["close_call", 1]]);
    if (!session.opponentCapturedUs) applyIncrements([["no_mercy", 1]]);
    if (session.usedSacrificeOffering) applyIncrements([["calculated_sacrifice", 1]]);
    persistIfNeeded();
  };

  return {
    localColor,
    onSpellBefore,
    onSpellAfter,
    onMoveBefore,
    onMoveAfter,
    onTrapTriggered,
    onOurPieceCaptured,
    onKingPromoted,
    onTurnStart,
    onVictory,
    dispose: persistIfNeeded,
  };
}

function parseFreezeCount(message) {
  if (!message || typeof message !== "string") return 0;
  const m = message.match(/(\d+)\s+frozen/i);
  return m ? Number(m[1]) : 0;
}

/** Run on profile load / collection updates */
export function refreshProfileAchievements(profile) {
  const ids = syncArcaneMastery(profile);
  if (ids.length) {
    import("./storage.js").then(({ saveProfile }) => saveProfile(profile)).catch(() => {});
  }
}
