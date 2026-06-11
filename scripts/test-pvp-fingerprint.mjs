#!/usr/bin/env node
/** Regression: stale poll at v5 must not block applying own push at v6. */

function matchRowFingerprint(row) {
  if (!row?.state_json) return `v${row?.version ?? 0}|nostate`;
  const s = row.state_json;
  const seq = s.pvpSpellSeq ?? 0;
  const tr = s.turn ?? "";
  const red = s.turnNumber?.red ?? 0;
  const blk = s.turnNumber?.black ?? 0;
  const hist = s.moveHistory?.length ?? 0;
  return `v${row.version ?? 0}|${tr}|${seq}|${red}|${blk}|${hist}`;
}

function shouldApplyPvpRow(row, pvpService, matchSession = null) {
  if (!row?.state_json) return false;
  if (row.status === "finished") return true;
  const ver = row.version ?? 0;
  const fp = matchRowFingerprint(row);
  if (fp === pvpService?._lastAppliedFingerprint) return false;
  if (matchSession?._syncBusy && ver < (pvpService?._lastVersion ?? 0)) return false;
  if (ver < (pvpService?._lastVersion ?? 0)) return false;
  return true;
}

const svc = { _lastVersion: 6, _lastAppliedFingerprint: "" };
const stale = {
  version: 5,
  status: "active",
  state_json: { turn: "red", pvpSpellSeq: 0, turnNumber: { red: 1, black: 0 }, moveHistory: [] },
};
const fresh = {
  version: 6,
  status: "active",
  state_json: { turn: "black", pvpSpellSeq: 1, turnNumber: { red: 1, black: 0 }, moveHistory: [{ n: 1 }] },
};

svc._lastAppliedFingerprint = matchRowFingerprint(stale);
console.log("stale skipped", !shouldApplyPvpRow(stale, svc, null));
console.log("fresh applied", shouldApplyPvpRow(fresh, svc, null));
if (shouldApplyPvpRow(stale, svc, null)) throw new Error("stale should be skipped");
if (!shouldApplyPvpRow(fresh, svc, null)) throw new Error("fresh should apply");
console.log("fingerprint tests ok");
