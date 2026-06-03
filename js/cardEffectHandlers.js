/**
 * Spell effect implementations for Card Checkers
 */
import {
  SIZE, COLORS, isDarkSquare, inBounds, movePiece, removePiece,
  getAdjacentEmpty, getTeleportTargets, getBoltTarget, getFireblastRay, getBackstepTarget, piecesOfColor, enemyPieces,
  createPiece, getAllMovesForColor, countPieces,
} from "./board.js";
import { sk, getSq, handLimit, placeMine, placeHiddenQuicksand } from "./gameMeta.js";
import { drawRandomCard, createCardInstance, CARD_REGISTRY } from "./cards.js";
import { drawToHand } from "./deckPile.js";
import { findCullTarget, cullVictimSnapshot } from "./cullAnimation.js";
import { cleanseAllPieces } from "./pieceStatus.js";
import { isSquareCollapsed, setCollapsedSquare } from "./gameMeta.js";

const opp = (c) => (c === COLORS.RED ? COLORS.BLACK : COLORS.RED);
const ok = (m = "Spell cast.", extra = {}) => ({ success: true, message: m, ...extra });
const fail = (m) => ({ success: false, message: m });
const p0 = (p) => p[0];
const p1 = (p) => p[1];

function at(state, r, c) { return state.board[r]?.[c] ?? null; }
function blocked(state, r, c) {
  if (!inBounds(r, c)) return true;
  const k = sk(r, c);
  if (isSquareCollapsed(state.meta, r, c)) return true;
  if (state.squares[k]?.obstacle) return true;
  return false;
}
function emptyDark(state, r, c) {
  return isDarkSquare(r, c) && !blocked(state, r, c) && !at(state, r, c);
}
function enemyCardCanMove(p) {
  return p && !(p.anchored > 0);
}

function swapAt(state, r1, c1, r2, c2) {
  const a = at(state, r1, c1), b = at(state, r2, c2);
  state.board[r1][c1] = b;
  state.board[r2][c2] = a;
  if (a) { a.row = r2; a.col = c2; }
  if (b) { b.row = r1; b.col = c1; }
}

function findPieceById(state, id) {
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      const p = at(state, r, c);
      if (p && p.id === id) return { p, r, c };
    }
  return null;
}

function clearLinkedFate(p) {
  if (!p?.linkedFateId) return;
  p.linkedFateId = null;
}

function triggerLinkedFate(state, deadPiece, by) {
  const partnerId = deadPiece?.linkedFateId;
  if (!partnerId) return;
  deadPiece.linkedFateId = null;
  const hit = findPieceById(state, partnerId);
  if (!hit) return;
  hit.p.linkedFateId = null;
  kill(state, hit.r, hit.c, by, false, { linkFate: true });
}

function kill(state, r, c, by, nonCap = true, opts = {}) {
  const p = at(state, r, c);
  if (!p) return false;
  if (!opts.linkFate && p.shieldTurns > 0) { p.shieldTurns--; return false; }
  if (!opts.linkFate && p.king && state.meta.constitutionTurns[p.color] > 0 && nonCap) return false;
  if (!opts.linkFate && p.lastStand) { p.lastStand = false; p.shieldTurns = 1; return false; }
  if (!opts.linkFate && p.deflectTurns > 0) {
    p.deflectTurns = 0;
    const es = enemyPieces(state.board, by);
    if (es.length) { const t = es[Math.floor(Math.random() * es.length)]; removePiece(state.board, t.row, t.col); }
    return false;
  }
  if (!opts.linkFate && p.mirrorShield) {
    p.mirrorShield = false;
    const es = enemyPieces(state.board, by);
    if (es.length) { const t = es[Math.floor(Math.random() * es.length)]; removePiece(state.board, t.row, t.col); }
    return false;
  }
  if (!state.captured[p.color]) state.captured[p.color] = [];
  state.captured[p.color].push({ color: p.color, king: p.king });
  const partnerId = p.linkedFateId;
  removePiece(state.board, r, c);
  if (p.ghostGuard) getSq(state, r, c).ghostBlock = 2;
  if (partnerId && !opts.linkFate) {
    const hit = findPieceById(state, partnerId);
    if (hit) {
      hit.p.linkedFateId = null;
      kill(state, hit.r, hit.c, by, false, { linkFate: true });
    }
  }
  return true;
}

function adjacentSquares(r, c) {
  const out = [];
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      const nr = r + dr, nc = c + dc;
      if (inBounds(nr, nc) && isDarkSquare(nr, nc)) out.push([nr, nc]);
    }
  return out;
}
function enemySquaresAdjacentTo(state, r, c, color) {
  return adjacentSquares(r, c).filter(([ar, ac]) => {
    const t = at(state, ar, ac);
    return t && t.color !== color;
  });
}

function shufflePick(arr, n) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}
export function planTrickster(state) {
  const all = [];
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      const p = at(state, r, c);
      if (p) all.push({ r, c, p });
    }
  if (all.length < 2) return null;
  const n = Math.min(6, all.length);
  const picked = shufflePick(all, n);
  const from = picked.map((x) => [x.r, x.c]);
  const to = from.map((_, i) => from[(i + 1) % n]);
  return { picked, from, to, squares: [...from, ...to] };
}
export function getChainLightningAnimSquares(state, pr, pc, color) {
  const chain = bestChainLightningHits(state, pr, pc, color);
  return [[pr, pc], ...chain];
}

export function executeTrickster(state, plan) {
  const entries = plan.picked.map((x, i) => ({
    piece: x.p,
    from: plan.from[i],
    to: plan.to[i],
  }));
  for (const e of entries) state.board[e.from[0]][e.from[1]] = null;
  for (const e of entries) {
    state.board[e.to[0]][e.to[1]] = e.piece;
    e.piece.row = e.to[0];
    e.piece.col = e.to[1];
  }
}

export function chainLightningCanTarget(state, pr, pc, color) {
  return enemySquaresAdjacentTo(state, pr, pc, color).length > 0;
}
function bestChainLightningHits(state, pr, pc, color) {
  const first = enemySquaresAdjacentTo(state, pr, pc, color);
  if (!first.length) return [];
  let best = [first[0]];
  for (const [r1, c1] of first) {
    const second = enemySquaresAdjacentTo(state, r1, c1).filter(
      ([r2, c2]) => !(r2 === pr && c2 === pc) && !(r2 === r1 && c2 === c1)
    );
    if (second.length) return [[r1, c1], second[0]];
  }
  return best;
}

function fri(state, color) { return piecesOfColor(state.board, color); }
function en(state, color) { return enemyPieces(state.board, color); }
function markMove(state, color) { state.meta.movementCardPlayed[color] = true; }
function backRow(color) { return color === COLORS.RED ? [5, 6, 7] : [0, 1, 2]; }
function promoRow(color) { return color === COLORS.RED ? 0 : 7; }


const EFFECTS = {
  backstep(state, color, picks) { if(picks.length<2) return fail(); const [r1,c1]=p0(picks),[r2,c2]=p1(picks); const p=at(state,r1,c1); if(!p||p.color!==color) return fail(); const allowed=getBackstepTarget(state.board,p); if(!allowed.some(([r,c])=>r===r2&&c===c2)) return fail("No square behind"); movePiece(state.board,r1,c1,r2,c2); markMove(state,color); return ok("Backstep!"); },
  nudge(state, color, picks) { if(picks.length<2) return fail(); const [r1,c1]=p0(picks),[r2,c2]=p1(picks); const p=at(state,r1,c1); if(!p||p.color!==color||!getAdjacentEmpty(state.board,p).some(([r,c])=>r===r2&&c===c2)) return fail(); movePiece(state.board,r1,c1,r2,c2); markMove(state,color); return ok(); },
  shield_1(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); p.shieldTurns=Math.max(p.shieldTurns,1); return ok(); },
  shield_2(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); p.shieldTurns=Math.max(p.shieldTurns,2); return ok(); },
  forward_bolt(state, color, picks) { if(picks.length<2) return fail(); const [r1,c1]=p0(picks),[r2,c2]=p1(picks); const p=at(state,r1,c1); if(!p||p.color!==color) return fail(); if(!kill(state,r2,c2,color)) return fail(); return ok(); },
  fireblast(state, color, picks) {
    const [r1, c1] = p0(picks);
    const p = at(state, r1, c1);
    if (!p || p.color !== color) return fail();
    const ray = getFireblastRay(state.board, p);
    if (!ray) return fail("No enemy in the fireball path");
    const [r2, c2] = ray.target;
    const t = at(state, r2, c2);
    if (!t || t.color === color) return fail();
    if (t.shieldTurns > 0) t.shieldTurns = 0;
    if (!kill(state, r2, c2, color)) return fail();
    return ok("Fireblast!", { fireblastTo: ray.target, fireblastLine: ray.lineSquares });
  },
  freeze_1(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color===color) return fail(); p.frozenTurns=1; return ok(); },
  retreat_3(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); p.retreatTurns=3; return ok(); },
  knight_perm(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); p.knightTurns=2; p.isKnight=false; return ok(); },
  crown(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); p.king=true; return ok(); },
  swap_friendly(state, color, picks) { if(picks.length<2) return fail(); const [r1,c1]=p0(picks),[r2,c2]=p1(picks); const a=at(state,r1,c1),b=at(state,r2,c2); if(!a||!b||a.color!==color||b.color!==color) return fail(); swapAt(state,r1,c1,r2,c2); return ok(); },
  quick_march(state, color, picks) { state.meta.pendingDouble[color]=true; return ok(); },
  gems_20(state, color, picks) { state.gems[color] += 20; return ok(); },
  destroy_unshielded(state, color, picks) { const [r,c]=p0(picks); if(!kill(state,r,c,color)) return fail('Invalid or shielded'); state.meta.shatterSilenceNext[color]=true; return ok('Shatter — you cannot cast spells next turn.'); },
  blink_2(state, color, picks) { if(picks.length<2) return fail(); const [r1,c1]=p0(picks),[r2,c2]=p1(picks); const p=at(state,r1,c1); if(!p||p.color!==color) return fail(); const d=Math.max(Math.abs(r2-r1),Math.abs(c2-c1)); if(d<1||d>2||!emptyDark(state,r2,c2)) return fail(); movePiece(state.board,r1,c1,r2,c2); markMove(state,color); return ok(); },
  long_step(state, color, picks) { if(picks.length<2) return fail(); const [r1,c1]=p0(picks),[r2,c2]=p1(picks); const p=at(state,r1,c1); if(!p||p.color!==color) return fail(); if(Math.abs(r2-r1)!==2||Math.abs(c2-c1)!==2||!emptyDark(state,r2,c2)) return fail(); movePiece(state.board,r1,c1,r2,c2); markMove(state,color); return ok(); },
  sidestep(state, color, picks) { if(picks.length<2) return fail(); const [r1,c1]=p0(picks),[r2,c2]=p1(picks); const p=at(state,r1,c1); if(!p||p.color!==color||r1!==r2||Math.abs(c2-c1)!==1||!emptyDark(state,r2,c2)) return fail(); movePiece(state.board,r1,c1,r2,c2); markMove(state,color); return ok(); },
  chain_pull(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){ const e=at(state,r+dr,c+dc); if(e&&e.color!==color){ const nr=r+dr*2,nc=c+dc*2; if(emptyDark(state,nr,nc)) movePiece(state.board,e.row,e.col,nr,nc); return ok();}} return fail(); },
  repel(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){ const e=at(state,r+dr,c+dc); if(e&&e.color!==color){ const nr=e.row+dr,nc=e.col+dc; if(emptyDark(state,nr,nc)) movePiece(state.board,e.row,e.col,nr,nc); return ok();}} return fail(); },
  leapfrog(state, color, picks) { if(picks.length<2) return fail(); const [r1,c1]=p0(picks),[r2,c2]=p1(picks); const p=at(state,r1,c1); if(!p||p.color!==color) return fail(); const dr=Math.sign(r2-r1),dc=Math.sign(c2-c1); const mr=r1+dr,mc=c1+dc; const mid=at(state,mr,mc); if(!mid||mid.color!==color||!emptyDark(state,r2,c2)) return fail(); movePiece(state.board,r1,c1,r2,c2); markMove(state,color); return ok(); },
  phase_walk(state, color, picks) { return EFFECTS.leapfrog(state,color,picks); },
  corner_hop(state, color, picks) { if(picks.length<2) return fail(); const [r1,c1]=p0(picks),[r2,c2]=p1(picks); const p=at(state,r1,c1); if(!p||p.color!==color) return fail(); const qr=r1<4?4:0, qc=c1<4?4:0; if((r2<qr||r2>=qr+4||c2<qc||c2>=qc+4)&&!emptyDark(state,r2,c2)) return fail(); if(!emptyDark(state,r2,c2)) return fail(); movePiece(state.board,r1,c1,r2,c2); markMove(state,color); return ok(); },
  anchor_2(state, color, picks) { for (const p of fri(state, color)) p.anchored = 2; return ok('All your pieces are anchored for 2 turns.'); },
  drift(state, color, picks) { if(picks.length<2) return fail(); const [r1,c1]=p0(picks),[r2,c2]=p1(picks); const p=at(state,r1,c1); if(!p||p.color!==color||Math.abs(r2-r1)!==Math.abs(c2-c1)) return fail(); movePiece(state.board,r1,c1,r2,c2); markMove(state,color); return ok(); },
  recall(state, color, picks) { if(picks.length<2) return fail(); const [r1,c1]=p0(picks),[r2,c2]=p1(picks); const p=at(state,r1,c1); if(!p||p.color!==color) return fail(); const rows=backRow(color); if(!rows.includes(r2)||!emptyDark(state,r2,c2)) return fail(); movePiece(state.board,r1,c1,r2,c2); markMove(state,color); return ok(); },
  flank_3(state, color, picks) { if(picks.length<2) return fail(); const [r1,c1]=p0(picks),[r2,c2]=p1(picks); const p=at(state,r1,c1); if(!p||p.color!==color) return fail(); if(r1===r2&&c1===c2) return fail(); if(Math.abs(r2-r1)!==Math.abs(c2-c1)||Math.max(Math.abs(r2-r1),Math.abs(c2-c1))>3||!emptyDark(state,r2,c2)) return fail(); movePiece(state.board,r1,c1,r2,c2); markMove(state,color); return ok(); },
  rook_2(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); p.rookTurns=2; return ok(); },
  bishop_2(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); p.bishopTurns=2; return ok(); },
  pawn_zeal(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color||p.king) return fail(); p.pawnZeal=true; return ok(); },
  overrun(state, color, picks) { state.meta.pendingOverrun[color]=true; return ok(); },
  cross_bolt(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); for(const [tr,tc] of getBoltTarget(state.board,p)) kill(state,tr,tc,color); return ok(); },
  snipe(state, color, picks) { const [r,c]=p0(picks); const t=at(state,r,c); if(!t||t.color===color) return fail(); if(!kill(state,r,c,color)) return fail(); return ok(); },
  landmine(state, color, picks) { const [r,c]=p0(picks); if(!emptyDark(state,r,c)) return fail(); const sq=getSq(state,r,c); if(sq.mine||sq.hiddenMine) return fail("Square already trapped"); placeMine(sq, color, true); return ok(); },
  bomb(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); p.bombArmed=true; return ok("Bomb armed — explodes on next move."); },
  detonate(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); removePiece(state.board,r,c); for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){ const t=at(state,r+dr,c+dc); if(t&&t.color!==color) kill(state,r+dr,c+dc,color);} return ok(); },
  ricochet(state, color, picks) { state.meta.pendingRicochet[color]=true; return ok(); },
  duel(state, color, picks) { if(picks.length<2) return fail(); const [r1,c1]=p0(picks),[r2,c2]=p1(picks); const a=at(state,r1,c1),b=at(state,r2,c2); if(!a||a.color!==color||!b||b.color===color) return fail(); if(Math.max(Math.abs(r1-r2),Math.abs(c1-c2))!==1) return fail(); kill(state,r1,c1,color); kill(state,r2,c2,color); return ok(); },
  execution(state, color, picks) { const [r,c]=p0(picks); const t=at(state,r,c); if(!t||t.color===color) return fail(); const ms=getAllMovesForColor(state.board,t.color).filter(m=>m.from[0]===r&&m.from[1]===c); if(ms.length) return fail('Has moves'); kill(state,r,c,color); return ok(); },
  cull(state, color, picks) {
    const t = findCullTarget(state, color);
    if (!t) return fail("No target");
    const cullTarget = [t.row, t.col];
    const cullVictim = cullVictimSnapshot(t);
    kill(state, t.row, t.col, color);
    return ok("The weakest enemy is culled.", { cullTarget, cullVictim });
  },
  hunters_mark(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color===color) return fail(); p.hunterMark=true; return ok(); },
  venom(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color===color) return fail(); p.venom=(p.venom||0)+1; if(p.venom>=2) kill(state,r,c,color); return ok(); },
  gravity_well(state, color, picks) { const [r,c]=p0(picks); if(!emptyDark(state,r,c)) return fail(); for(const t of en(state,color)){ const dr=Math.sign(r-t.row),dc=Math.sign(c-t.col); const nr=t.row+dr,nc=t.col+dc; if((nr!==r||nc!==c)&&emptyDark(state,nr,nc)) movePiece(state.board,t.row,t.col,nr,nc);} return ok(); },
  spear_thrust(state, color, picks) { if(picks.length<2) return fail(); const [r1,c1]=p0(picks),[r2,c2]=p1(picks); const p=at(state,r1,c1); if(!p||p.color!==color) return fail(); const dr=r1===r2?0:Math.sign(r2-r1), dc=c1===c2?0:Math.sign(c2-c1); if(dr&&dc) return fail(); let r=r1+dr,c=c1+dc; while(inBounds(r,c)){ const t=at(state,r,c); if(t){ if(t.color!==color) kill(state,r,c,color); break;} r+=dr; c+=dc;} markMove(state,color); return ok(); },
  backstab(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); const dir=p.color===COLORS.RED?1:-1; for(const dc of [-1,1]){ const t=at(state,r+dir,c+dc); if(t&&t.color!==color){ kill(state,r+dir,c+dc,color); return ok();}} return fail(); },
  sacrifice(state, color, picks) { if(picks.length<2) return fail(); const [r1,c1]=p0(picks),[r2,c2]=p1(picks); const a=at(state,r1,c1),b=at(state,r2,c2); if(!a||a.color!==color||!b||b.color===color) return fail(); removePiece(state.board,r1,c1); kill(state,r2,c2,color); return ok(); },
  bulwark(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); for(let i=0;i<SIZE;i++){ const q=at(state,i,c-i+(p.col-p.row)); if(q&&q.color===color) q.shieldTurns=Math.max(q.shieldTurns,2);} return ok(); },
  mirror_shield(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); p.mirrorShield=true; return ok(); },
  phalanx(state, color, picks) { if(picks.length<2) return fail(); const a=at(state,...p0(picks)),b=at(state,...p1(picks)); if(!a||!b||a.color!==color||b.color!==color) return fail(); const gid=Date.now(); a.phalanxId=gid; b.phalanxId=gid; return ok(); },
  sanctuary(state, color, picks) {
    const [r,c]=p0(picks);
    const cells=[];
    for(let dr=-2;dr<=2;dr++) for(let dc=-2;dc<=2;dc++){
      const nr=r+dr,nc=c+dc;
      if(inBounds(nr,nc)&&isDarkSquare(nr,nc)) cells.push([nr,nc]);
    }
    let n=0;
    for(const [nr,nc] of cells.slice(0,6)){
      const sq=getSq(state,nr,nc); sq.sanctuary=color; sq.sanctuaryTurns=1; n++;
    }
    return n?ok():fail();
  },
  last_stand(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); p.lastStand=true; return ok(); },
  magnet(state, color, picks) {
    const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail();
    for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){
      if(!dr&&!dc) continue;
      const er=r+dr*2, ec=c+dc*2, lr=r+dr, lc=c+dc;
      const e=at(state,er,ec);
      if(e&&e.color!==color&&enemyCardCanMove(e)&&emptyDark(state,lr,lc)){
        movePiece(state.board,er,ec,lr,lc); markMove(state,color); return ok();
      }
    }
    return fail("No enemy 2 away to pull");
  },
  press(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color===color) return fail(); p.pressExtraMove=true; return ok(); },
  vengeance(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); p.vengeanceTurns=2; return ok(); },
  hibernation(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); if(p.hibernationTurns>0) return fail("Already hibernating."); p.hibernationTurns=2; p.bearAwakened=false; return ok("Hibernation — wakes as a king in 2 turns."); },
  barrier(state, color, picks) { const [r,c]=p0(picks); if(!emptyDark(state,r,c)) return fail(); const sq=getSq(state,r,c); sq.barrier={owner:color,turnsLeft:1}; return ok(); },
  iron_will(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); p.frozenTurns=0; p.rooted=0; return ok(); },
  revive(state, color, picks) { const [r,c]=p0(picks); const cap=state.captured[color]; if(!cap?.length) return fail('Revive requires a captured piece'); if(!emptyDark(state,r,c)) return fail(); const data=cap.pop(); const p=createPiece(color,r,c,data.king); p.revivedNoCapture=true; state.board[r][c]=p; return ok('Piece revived — it cannot capture this turn.'); },
  ghost_guard(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); p.ghostGuard=true; return ok(); },
  fortify(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); p.fortifyTurns=2; return ok(); },
  reverse_only_2(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color===color) return fail(); p.reverseOnlyTurns=2; p.noCaptureTurns=2; return ok(); },
  freeze_2(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color===color) return fail(); p.frozenTurns=1; return ok(); },
  deep_freeze(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); let n=0; for(let i=-SIZE+1;i<SIZE;i++){ const t=at(state,r+i,c+i); if(t&&t.color!==color){ t.frozenTurns=Math.max(t.frozenTurns||0,2); n++; }} return n?ok():fail("No enemies on that diagonal"); },
  root_2(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color===color) return fail(); p.rooted=1; return ok(); },
  slow_2(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color===color) return fail(); p.slowed=2; return ok(); },
  blind(state, color, picks) { state.meta.blindNext[opp(color)]=true; return ok(); },
  confusion(state, color, picks) { state.meta.confuseNext[opp(color)]=true; return ok(); },
  silence_3(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color===color) return fail(); p.silenced=3; return ok(); },
  rust(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color===color) return fail(); p.rustedTurns=3; p.rusted=false; return ok(); },
  hex_3(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color===color) return fail(); p.hexed=3; return ok(); },
  tangle(state, color, picks) { if(picks.length<2) return fail(); swapAt(state,...p0(picks),...p1(picks)); const a=at(state,...p0(picks)),b=at(state,...p1(picks)); if(a) a.frozenTurns=1; if(b) b.frozenTurns=1; return ok(); },
  fog_2(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); state.meta.fogPieceId[color]=p.id; state.meta.fogTurns[color]=2; return ok(); },
  panic(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color===color||p.king) return fail(); p.panicTurn=true; return ok(); },
  bribery_15(state, color, picks) { const o=opp(color); const n=Math.min(15,state.gems[o]); state.gems[o]-=n; state.gems[color]+=n; return ok(); },
  bishop_3(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); p.bishopTurns=2; return ok(); },
  rook_3(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); p.rookTurns=2; return ok(); },
  queen_2(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); p.queenTurns=2; return ok(); },
  demote(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color===color||!p.king) return fail(); p.king=false; return ok(); },
  promote_zone(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); p.promoteZone=true; return ok(); },
  link_fate(state, color, picks) {
    if (picks.length < 2) return fail("Pick two enemies");
    const [r1, c1] = p0(picks), [r2, c2] = p1(picks);
    const a = at(state, r1, c1), b = at(state, r2, c2);
    if (!a || !b || a.color === color || b.color === color) return fail();
    if (r1 === r2 && c1 === c2) return fail();
    if (a.linkedFateId) {
      const old = findPieceById(state, a.linkedFateId);
      if (old) old.p.linkedFateId = null;
      a.linkedFateId = null;
    }
    if (b.linkedFateId) {
      const old = findPieceById(state, b.linkedFateId);
      if (old) old.p.linkedFateId = null;
      b.linkedFateId = null;
    }
    a.linkedFateId = b.id;
    b.linkedFateId = a.id;
    return ok("Link Fate — when one falls, the other follows.");
  },
  clone(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color||p.king) return fail(); const adj=getAdjacentEmpty(state.board,p); if(!adj.length) return fail(); const [tr,tc]=adj[0]; const copy=createPiece(color,tr,tc,p.king); copy.bearAwakened=p.bearAwakened; return ok('Clone — duplicate on an adjacent square.'); },
  twin_soul(state, color, picks) { return EFFECTS.clone(state, color, picks); },
  fusion(state, color, picks) { if(picks.length<2) return fail(); const a=at(state,...p0(picks)),b=at(state,...p1(picks)); if(!a||!b||a.color!==color||b.color!==color) return fail(); if(Math.max(Math.abs(a.row-b.row),Math.abs(a.col-b.col))!==1) return fail(); removePiece(state.board,b.row,b.col); a.superMan=3; return ok(); },
  chameleon(state, color, picks) { if(picks.length<2) return fail(); const [r1,c1]=p0(picks),[r2,c2]=p1(picks); const a=at(state,r1,c1),b=at(state,r2,c2); if(!a||a.color!==color||!b) return fail(); a.chameleonFrom=b.id; a.chameleonTurns=2; return ok(); },
  wraith_2(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); p.wraithTurns=2; return ok(); },
  stone_form(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); p.king=true; p.stoneTurns=2; return ok(); },
  obstacle(state, color, picks) { const [r,c]=p0(picks); if(isDarkSquare(r,c)) return fail('Pick a light square'); getSq(state,r,c).obstacle=true; return ok(); },
  quicksand(state, color, picks) { const [r,c]=p0(picks); if(!emptyDark(state,r,c)) return fail(); placeHiddenQuicksand(getSq(state,r,c), color); return ok(); },
  sanctified(state, color, picks) { const [r,c]=p0(picks); if(!emptyDark(state,r,c)) return fail(); getSq(state,r,c).sanctified=color; return ok(); },
  warp_gate(state, color, picks) { if(picks.length<2) return fail(); const k1=sk(...p0(picks)),k2=sk(...p1(picks)); state.squares[k1]={...state.squares[k1],warp:k2}; state.squares[k2]={...state.squares[k2],warp:k1}; return ok(); },
  collapse(state, color, picks) { const [r,c]=p0(picks); if(!isDarkSquare(r,c)) return fail(); setCollapsedSquare(state.meta, r, c); const p=at(state,r,c); if(p){ removePiece(state.board,r,c); for(let r2=0;r2<SIZE;r2++) for(let c2=0;c2<SIZE;c2++) if(emptyDark(state,r2,c2)){ state.board[r2][c2]=p; p.row=r2; p.col=c2; break;}} return ok(); },
  mirror_board(state, color, picks) { state.meta.mirrorBoardTurns[opp(color)]=2; return ok(); },
  darkness(state, color, picks) { const [r,c]=p0(picks); getSq(state,r,c).darkness=2; return ok(); },
  highlight_path(state, color, picks) { state.meta.highlightTurns[opp(color)]=2; return ok(); },
  earthquake(state, color, picks) { const cr=3.5,cc=3.5; const all=fri(state,color).concat(en(state,color)); for(const p of all){ const dr=p.row<cr?1:p.row>cr?-1:0, dc=p.col<cc?1:p.col>cc?-1:0; const nr=p.row+dr,nc=p.col+dc; if(emptyDark(state,nr,nc)) movePiece(state.board,p.row,p.col,nr,nc);} return ok(); },
  prospect(state, color, picks) { state.gems[color]+=10; state.meta.prospectPending[color]=10; return ok(); },
  tax(state, color, picks) { const o=opp(color); state.gems[o]=Math.max(0,state.gems[o]-10); state.gems[color]+=5; return ok(); },
  gamble(state, color, picks) { if(state.gems[color]<15) return fail('Need 15 gems'); state.gems[color]-=15; for(let i=0;i<2;i++) state.hands[color].push(createCardInstance(drawRandomCard())); return ok(); },
  haggle(state, color, picks) { state.meta.drawDiscount[color]=5; return ok(); },
  recycle(state, color, picks) { if(picks.length<1) return fail('Discard a card'); return fail('Use discard UI'); },
  scout(state, color, picks) { for(let i=0;i<3;i++) state.hands[color].push(createCardInstance(drawRandomCard())); return ok(); },
  forge(state, color, picks) { const h=state.hands[color]; if(h.length<2) return fail('Need 2 cards'); h.splice(0,2); const rare=CARD_REGISTRY.filter(c=>c.rarity==='rare'||c.rarity==='epic'); h.push(createCardInstance(rare[Math.floor(Math.random()*rare.length)])); return ok(); },
  heist(state, color, picks) { const oh=state.hands[opp(color)]; if(!oh.length) return fail('No cards'); const c=oh.splice(Math.floor(Math.random()*oh.length),1)[0]; state.hands[color].push(c); return ok(); },
  donate(state, color, picks) { state.gems[color]=Math.max(0,state.gems[color]-20); state.gems[opp(color)]+=20; for(let i=0;i<2;i++) state.hands[color].push(createCardInstance(drawRandomCard())); return ok(); },
  interest(state, color, picks) { state.gems[color]+=Math.min(25,Math.floor(state.gems[color]/2)); return ok(); },
  bankrupt(state, color, picks) { state.gems[color]=Math.floor(state.gems[color]/2); state.gems[opp(color)]=Math.floor(state.gems[opp(color)]/2); return ok(); },
  coupon(state, color, picks) { state.meta.freeDraw[color]=true; return ok(); },
  hand_expand(state, color, picks) { state.meta.handMax[color]=8; return ok(); },
  mulligan(state, color, picks) { const h=state.hands[color]; const n=h.length; h.length=0; for(let i=0;i<n;i++) h.push(createCardInstance(drawRandomCard())); return ok(); },
  hostile_swap(state, color, picks) { if(picks.length<2) return fail(); const [r1,c1]=p0(picks),[r2,c2]=p1(picks); const a=at(state,r1,c1),b=at(state,r2,c2); if(!a||!b||a.color!==color||b.color===color) return fail(); if(!enemyCardCanMove(b)) return fail('Anchored'); if(a.shieldTurns||b.shieldTurns) return fail('Shielded'); swapAt(state,r1,c1,r2,c2); return ok(); },
  possession(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color===color||p.king) return fail(); state.meta.possessionId=p.id; state.meta.possessionController=color; return ok('Possession — control that piece when you move this turn.'); },
  identity_theft(state, color, picks) { if(picks.length<2) return fail(); const [r1,c1]=p0(picks),[r2,c2]=p1(picks); const a=at(state,r1,c1),b=at(state,r2,c2); if(!a||a.color!==color||!b||b.color===color) return fail(); a.chameleonFrom=b.id; a.chameleonTurns=3; return ok(); },
  call_forward(state, color, picks) { if(picks.length<2) return fail(); const [r1,c1]=p0(picks),[r2,c2]=p1(picks); const e=at(state,r1,c1); if(!e||e.color===color||!enemyCardCanMove(e)||!emptyDark(state,r2,c2)) return fail(); if(Math.max(Math.abs(r2-r1),Math.abs(c2-c1))>3) return fail(); movePiece(state.board,r1,c1,r2,c2); return ok('Call Forward!'); },
  mirror_move(state, color, picks) { state.meta.mirrorMovePending=color; return ok(); },
  offering(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); removePiece(state.board,r,c); state.meta.extraSpellCast[color]=true; state.meta.cardsLeft[color]=(state.meta.cardsLeft[color]||0)+1; return ok("Offering — cast another spell."); },
  parallel(state, color, picks) { state.meta.parallelExtra={...(state.meta.parallelExtra||{}), [color]:true}; state.meta.cardsLeft[color]=2; return ok(); },
  counterspell(state, color, picks) { state.meta.counterspell[color]=true; return ok(); },
  echo(state, color, picks) { const last=state.meta.lastCard[color]; if(!last) return fail('No previous card'); return applyEffect(state,color,last.effect,[]); },
  roulette(state, color, picks) { const card=drawRandomCard(); return applyEffect(state,color,card.effect,[]); },
  blizzard(state, color, picks) {
    const col = p0(picks)[1];
    let n = 0;
    for (let r = 0; r < SIZE; r++) {
      if (!isDarkSquare(r, col)) continue;
      const t = at(state, r, col);
      if (t && t.color !== color && !t.king) { t.frozenTurns = Math.max(t.frozenTurns || 0, 1); n++; }
    }
    return n ? ok() : fail("No enemies in that column");
  },
  fireline(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); const dir=p.color===COLORS.RED?-1:1; for(const dc of [-1,1]){ let rr=p.row+dir,cc=p.col+dc; while(inBounds(rr,cc)&&isDarkSquare(rr,cc)){ const t=at(state,rr,cc); if(t){ if(t.color!==color) kill(state,rr,cc,color); break;} rr+=dir; cc+=dc;}} return ok(); },
  sanctuary_pulse(state, color, picks) { const rows=backRow(color); for(let r=0;r<SIZE;r++) for(let c=0;c<SIZE;c++){ const p=at(state,r,c); if(p&&p.color===color&&rows.includes(r)) p.shieldTurns=Math.max(p.shieldTurns,1);} return ok(); },
  mass_nudge(state, color, picks) { let n=0; for(const p of [...fri(state,color)]){ if(n>=2) break; const adj=getAdjacentEmpty(state.board,p); if(adj.length){ const [tr,tc]=adj[0]; movePiece(state.board,p.row,p.col,tr,tc); n++; markMove(state,color);} } return n?ok():fail('No targets'); },
  chain_lightning(state, color, picks) {
    const [r, c] = p0(picks);
    const p = at(state, r, c);
    if (!p || p.color !== color) return fail();
    const chain = bestChainLightningHits(state, r, c, color);
    if (!chain.length) return fail("No adjacent enemies to chain");
    let hits = 0;
    for (const [tr, tc] of chain) {
      if (kill(state, tr, tc, color)) hits++;
    }
    if (hits) {
      p.paralyzedTurns = 2;
      return ok(`Chain Lightning — ${hits} struck. Your piece is paralyzed for 2 turns.`);
    }
    return fail("No valid targets");
  },
  poison_3(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color===color) return fail(); p.venom=3; return ok('Poison — dies in 3 turns.'); },
  deflect_1(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); p.deflectTurns=1; return ok('Deflect — next hit reflects to a random enemy.'); },
  trickster(state, color, picks) {
    let plan = state.meta.pendingTrickster;
    if (!plan) plan = planTrickster(state);
    if (!plan) return fail("Need at least 4 pieces on the board");
    executeTrickster(state, plan);
    state.meta.pendingTrickster = null;
    return ok("Trickster scrambles six random pieces!");
  },
  purify(state, color, picks) {
    cleanseAllPieces(state.board);
    return ok("Purify — all shields, buffs, and debuffs removed from every piece.");
  },
  vacuum(state, color, picks) { const [r,c]=p0(picks); if(!emptyDark(state,r,c)) return fail(); const all=fri(state,color).concat(en(state,color)); for(const p of all){ const dr=Math.sign(r-p.row),dc=Math.sign(c-p.col); const nr=p.row+dr,nc=p.col+dc; if((nr!==r||nc!==c)&&emptyDark(state,nr,nc)) movePiece(state.board,p.row,p.col,nr,nc);} return ok(); },
  scatter(state, color, picks) { const [r,c]=p0(picks); const all=[]; for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){ if(!dr&&!dc) continue; const pr=r+dr,pc=c+dc; const p=at(state,pr,pc); if(p) all.push(p);} for(const p of all){ const dr=Math.sign(p.row-r)||1, dc=Math.sign(p.col-c)||1; const nr=p.row+dr,nc=p.col+dc; if(emptyDark(state,nr,nc)) movePiece(state.board,p.row,p.col,nr,nc);} return ok(); },
  dominion(state, color, picks) { state.meta.dominionTurn[color]=true; return ok(); },
  rally(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){ const q=at(state,r+dr,c+dc); if(q&&q.color===color) q.retreatTurns=Math.max(q.retreatTurns,1);} return ok(); },
  coronation_day(state, color, picks) { const pr=promoRow(color); for(let r=0;r<SIZE;r++) for(let c=0;c<SIZE;c++){ const p=at(state,r,c); if(p&&p.color===color&&r===pr&&!p.king) p.king=true;} return ok(); },
  regicide(state, color, picks) { state.meta.pendingRegicide[color]=true; return ok(); },
  constitution(state, color, picks) { state.meta.constitutionTurns[color]=5; return ok(); },
  last_king(state, color, picks) { const ps=fri(state,color); if(ps.length!==1) return fail('Need exactly 1 piece'); const p=ps[0]; p.king=true; p.shieldTurns=2; return ok(); },
  succession(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color||p.king) return fail(); p.succession=true; return ok(); },
  coin_flip(state, color, picks) {
    let t = null;
    if (state.meta?.pendingCoinFlipSquare) {
      const [r, c] = state.meta.pendingCoinFlipSquare;
      state.meta.pendingCoinFlipSquare = null;
      t = at(state, r, c);
    }
    if (!t) {
      t = pickCoinFlipVictim(state, color);
    }
    if (!t) return fail();
    const victimColor = t.color;
    kill(state, t.row, t.col, color);
    return ok("Coin flip!", { victimSquare: [t.row, t.col], victimColor });
  },
  butterfly(state, color, picks) { const cells=[[3,2],[3,4],[4,3],[4,5]]; const pieces=cells.map(([r,c])=>at(state,r,c)).filter(Boolean); const spots=cells.filter(([r,c])=>!at(state,r,c)); let i=0; for(const p of pieces){ if(i>=spots.length) break; const [r,c]=spots[i++]; movePiece(state.board,p.row,p.col,r,c);} return ok(); },
  ignore(state, color, picks) { state.meta.optionalJumps[color]=true; return ok(); },
  pocket(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color) return fail(); removePiece(state.board,r,c); state.meta.pocket={piece:p,r,c}; state.meta.pocketReturnTurn=state.meta.turnNumber+2; return ok(); },
  uno_reverse(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color===color) return fail(); state.meta.forcedCapturePieceId=p.id; return ok(); },
  gems_5(state, color, picks) { state.gems[color] += 5; return ok(); },
  draw_1(state, color, picks) { state.hands[color].push(createCardInstance(drawRandomCard())); return ok(); },
  conduct(state, color, picks) { state.meta.pendingConduct[color]=true; return ok(); },
  cryo_bolt(state, color, picks) { if(picks.length<2) return fail(); const [r1,c1]=p0(picks),[r2,c2]=p1(picks); const t=at(state,r2,c2); if(t&&t.frozenTurns>0) t.shieldTurns=0; if(!kill(state,r2,c2,color)) return fail(); return ok(); },
  knights_charge(state, color, picks) { const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color||!(p.knightTurns > 0 || p.isKnight)) return fail(); p.knightCapture=true; return ok(); },
  shield_bash(state, color, picks) { if(picks.length<2) return fail(); const [r1,c1]=p0(picks),[r2,c2]=p1(picks); const p=at(state,r1,c1); if(!p||p.color!==color||p.shieldTurns<=0) return fail(); if(!getAdjacentEmpty(state.board,p).some(([r,c])=>r===r2&&c===c2)) return fail(); movePiece(state.board,r1,c1,r2,c2); for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){ const t=at(state,r2+dr,c2+dc); if(t&&t.color!==color) kill(state,r2+dr,c2+dc,color);} return ok(); },
  gem_knight(state, color, picks) { if(state.gems[color]<5) return fail('Need 5 gems'); const [r,c]=p0(picks); const p=at(state,r,c); if(!p||p.color!==color||!(p.knightTurns > 0 || p.isKnight)) return fail(); state.gems[color]-=5; p.shieldTurns=Math.max(p.shieldTurns,1); return ok(); },
};

export function pickCoinFlipVictim(state, color) {
  const pool = fri(state, color).concat(en(state, color));
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function applyEffect(state, color, effect, picks) {
  const fn = EFFECTS[effect];
  if (!fn) return fail("Unknown spell.");
  return fn(state, color, picks || []);
}

export function applyCard(state, color, card, picks) {
  state.meta.lastCard[color] = card.effect;
  return applyEffect(state, color, card.effect, picks);
}
