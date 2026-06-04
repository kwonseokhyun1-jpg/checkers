/** Effects that last until the end of the opponent's next turn (after cast). */
import { COLORS } from "./board.js";

const opp = (c) => (c === COLORS.RED ? COLORS.BLACK : COLORS.RED);

export function scheduleClearAfterEnemyTurn(meta, field, ownerColor) {
  if (!meta.scheduledClears) meta.scheduledClears = [];
  meta.scheduledClears.push({ field, ownerColor, clearAfterColor: opp(ownerColor) });
}

export function runScheduledClearsWithBoard(meta, board, endingTurnColor) {
  if (!meta.scheduledClears?.length) return;
  const keep = [];
  for (const job of meta.scheduledClears) {
    if (job.clearAfterColor === endingTurnColor) {
      if (job.field === "promoteZone") clearPromoteZoneForColor(board, job.ownerColor);
      else applyScheduledClear(meta, job);
    } else {
      keep.push(job);
    }
  }
  meta.scheduledClears = keep;
}

function applyScheduledClear(meta, { field, ownerColor }) {
  switch (field) {
    case "optionalJumps":
      meta.optionalJumps[ownerColor] = false;
      break;
    case "dominionTurn":
      meta.dominionTurn[ownerColor] = false;
      break;
    case "blindNext":
      meta.blindNext[ownerColor] = false;
      break;
    case "confuseNext":
      meta.confuseNext[ownerColor] = false;
      break;
    default:
      break;
  }
}

export function clearPromoteZoneForColor(board, color) {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      const p = board[r][c];
      if (p?.color === color && p.promoteZone) p.promoteZone = false;
    }
  }
}

export function schedulePromoteZoneClear(meta, ownerColor) {
  scheduleClearAfterEnemyTurn(meta, "promoteZone", ownerColor);
}
