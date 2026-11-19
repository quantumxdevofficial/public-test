// (13/30) Strong vs eventual consistency components: a social post card (photo + heart + like count) for phone
// screens, and a "sync" badge showing a copy is up to date (green) or behind (red, with a lag clock).
import { ctx, C, clamp, rr, circle, ell, line } from './lib.js';
const GREEN = '#5BAE6A';

function heartPath(k) {
  ctx.beginPath(); ctx.moveTo(0, 80 * k); ctx.bezierCurveTo(-120 * k, 0, -110 * k, -100 * k, -50 * k, -96 * k);
  ctx.bezierCurveTo(-18 * k, -94 * k, 0, -70 * k, 0, -50 * k); ctx.bezierCurveTo(0, -70 * k, 18 * k, -94 * k, 50 * k, -96 * k);
  ctx.bezierCurveTo(110 * k, -100 * k, 120 * k, 0, 0, 80 * k); ctx.closePath();
}
/** social post card. s = 1 → 300x420, origin = centre. liked 0..1 fills the heart red; n = like count text;
 *  beat 0..1 pops the heart; who = small name over the photo */
export function postCard(x, y, s, liked = 0, n = '1,204', beat = 0, who = 'PIZZA PAL') {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-150, -210, 300, 420, 28); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  circle(-110, -172, 20, '#E0A15A'); ctx.fillStyle = C.ink; ctx.font = '900 26px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(who, -80, -170);
  // photo: a pizza on a blue plate
  rr(-130, -140, 260, 220, 16); ctx.fillStyle = '#CFE8F3'; ctx.fill();
  circle(0, -30, 86, '#3A7BD5'); circle(0, -30, 70, '#E0A15A'); circle(0, -30, 56, C.yellow);
  for (const [a, b] of [[-22, -50], [20, -40], [-8, -6], [26, -2], [-30, -20]]) circle(a, b, 10, C.red);
  // heart + count
  const k = 0.42 * (1 + beat * 0.35);
  ctx.save(); ctx.translate(-90, 145);
  heartPath(k); ctx.fillStyle = liked > 0 ? C.red : C.white; ctx.globalAlpha = 1; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
  if (liked > 0) ell(-20 * k / 0.42, -24 * k / 0.42, 9, 5, '#EE6672');
  ctx.restore();
  ctx.fillStyle = C.ink; ctx.font = '900 58px Inter'; ctx.textAlign = 'left'; ctx.fillText(n, -40, 148);
  ctx.restore();
}

/** round sync badge: ok = true → green check "up to date", false → red with a little clock (behind). sc animates */
export function syncBadge(x, y, s, ok = true, sc = 1, t = 0) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  circle(0, 0, 60, C.ink); circle(0, 0, 50, ok ? GREEN : C.red);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (ok) { ctx.lineWidth = 14; ctx.strokeStyle = C.white; ctx.beginPath(); ctx.moveTo(-24, 2); ctx.lineTo(-6, 20); ctx.lineTo(26, -18); ctx.stroke(); }
  else {
    circle(0, 0, 32, C.white); circle(0, 0, 24, C.red); circle(0, 0, 20, C.white);
    const a = t * 6; line([[0, 0], [Math.cos(a) * 15, Math.sin(a) * 15]], C.ink, 6); line([[0, 0], [0, -11]], C.ink, 6);
  }
  ctx.restore();
}
