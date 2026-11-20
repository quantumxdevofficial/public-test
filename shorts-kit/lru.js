// Cache eviction / LRU (System Design day 14) components. Same flat look: flat fills, one darker shade, ink outlines on graphics.
import { ctx, C, TAU, clamp, rr, circle, ell, line } from './lib.js';

/** flat cartoon boot that kicks. (x, y) = toe tip; swing 0..1 rotates it forward (kick), flip = kick to the left */
export function boot(x, y, s, swing = 0, flip = false) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); if (flip) ctx.scale(-1, 1); ctx.scale(s, s);
  ctx.rotate(-0.9 + swing * 0.9);
  // leg (pants) going up-left from the boot
  rr(-190, -420, 110, 360, 40); ctx.fillStyle = '#3A4A6B'; ctx.fill();
  rr(-190, -420, 36, 360, 18); ctx.fillStyle = '#4C5E86'; ctx.fill();
  // boot
  ctx.beginPath(); ctx.moveTo(-200, -110); ctx.lineTo(-70, -110); ctx.lineTo(-60, -50);
  ctx.quadraticCurveTo(10, -50, 10, 0); ctx.lineTo(-210, 0); ctx.closePath(); ctx.fillStyle = '#8B5A3C'; ctx.fill();
  rr(-215, -14, 230, 26, 10); ctx.fillStyle = '#5E3A26'; ctx.fill();
  ell(-60, -70, 26, 10, '#A87050', -0.2);
  ctx.restore();
}

/** small round clock badge with a label under it ("1 HR"). hot = red ring (stale / oldest) */
export function ageClock(x, y, s, label, hot = 0, t = 0, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  circle(0, 0, 70, hot > 0.5 ? C.red : C.ink); circle(0, 0, 56, C.white);
  ctx.lineCap = 'round';
  line([[0, 0], [0, -38]], C.ink, 10); line([[0, 0], [Math.cos(t * 2) * 30, Math.sin(t * 2) * 30]], hot > 0.5 ? C.red : C.ink, 8);
  circle(0, 0, 9, C.ink);
  ctx.font = '900 46px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const w = ctx.measureText(label).width + 40;
  rr(-w / 2, 90, w, 64, 32); ctx.fillStyle = hot > 0.5 ? C.red : C.ink; ctx.fill();
  ctx.fillStyle = C.white; ctx.fillText(label, 0, 124);
  ctx.restore();
}

/** a long flat counter / rail with FRONT (left) and BACK (right) end caps and a faint arrow along it */
export function lruRail(x0, x1, y, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  rr(x0, y, x1 - x0, 40, 14); ctx.fillStyle = '#7A8494'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(x0, y + 40, x1 - x0, 18, 8); ctx.fillStyle = '#5E6775'; ctx.fill();
  ctx.restore();
}

/** a pizza slot tag: coloured circle letter ("A") shown under a pizza */
export function slotTag(x, y, s, letter, col, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  circle(0, 0, 48, C.ink); circle(0, 0, 40, col);
  ctx.fillStyle = C.white; ctx.font = '900 54px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(letter, 0, 3);
  ctx.restore();
}

/** a red question mark (for "which one?") */
export function qmark(x, y, s, a = 1, rot = 0) {
  if (s <= 0 || a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.globalAlpha = a;
  ctx.font = '900 200px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineWidth = 24; ctx.strokeStyle = C.ink; ctx.lineJoin = 'round'; ctx.strokeText('?', 0, 0);
  ctx.fillStyle = C.red; ctx.fillText('?', 0, 0);
  ctx.restore();
}

/** cobweb in the corner of something (old, untouched). a = alpha */
export function cobweb(x, y, s, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha = a * 0.8;
  ctx.strokeStyle = '#9AA3AF'; ctx.lineWidth = 5;
  for (let k = 0; k <= 4; k++) { const an = (k / 4) * Math.PI / 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(an) * 120, Math.sin(an) * 120); ctx.stroke(); }
  for (const r of [40, 75, 110]) { ctx.beginPath(); for (let k = 0; k <= 4; k++) { const an = (k / 4) * Math.PI / 2, rr2 = r * (k % 4 ? 0.9 : 1); const px = Math.cos(an) * rr2, py = Math.sin(an) * rr2; k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); }
  ctx.restore();
}
