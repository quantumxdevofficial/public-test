// Latency vs throughput components (Inside Out flat look): top-down car, highway band, finish line, counter box.
import { ctx, C, W, clamp, rr, circle, TAU } from './lib.js';

/** top-down car pointing right. s = 1 → ~190 x 96 */
export function carTop(x, y, s, col = C.red, hi = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (hi > 0) { ctx.globalAlpha = 0.45 * hi; rr(-118, -66, 236, 132, 50); ctx.fillStyle = C.yellow; ctx.fill(); ctx.globalAlpha = 1; }
  for (const [wx, wy] of [[-55, -50], [55, -50], [-55, 50], [55, 50]]) { rr(wx - 24, wy - 10, 48, 20, 8); ctx.fillStyle = C.ink; ctx.fill(); }
  rr(-95, -46, 190, 92, 34); ctx.fillStyle = col; ctx.fill();
  ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-30, -36, 80, 72, 16); ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fill();
  rr(30, -34, 26, 68, 10); ctx.fillStyle = '#BFE3F2'; ctx.fill();
  rr(-52, -30, 18, 60, 8); ctx.fillStyle = '#BFE3F2'; ctx.fill();
  rr(-60, -40, 120, 12, 6); ctx.fillStyle = 'rgba(255,255,255,0.28)'; ctx.fill();
  circle(90, -30, 7, C.yellow); circle(90, 30, 7, C.yellow);
  ctx.restore();
}

/** a horizontal highway band centred at y with n lanes of height lh. Returns the lane centre ys. */
export function highway(y, n = 3, lh = 140, grass = '#A9D69B') {
  const h = n * lh, top = y - h / 2;
  ctx.fillStyle = grass; ctx.fillRect(-300, top - 70, W + 600, h + 140);
  ctx.fillStyle = '#4A4F5C'; ctx.fillRect(-300, top, W + 600, h);
  ctx.fillStyle = C.white; ctx.fillRect(-300, top + 6, W + 600, 10); ctx.fillRect(-300, top + h - 16, W + 600, 10);
  for (let k = 1; k < n; k++) for (let x = -300; x < W + 300; x += 120) { ctx.fillStyle = C.white; ctx.fillRect(x, top + k * lh - 5, 64, 10); }
  const lanes = []; for (let k = 0; k < n; k++) lanes.push(top + lh * (k + 0.5));
  return lanes;
}

/** checkered finish (or start) strip, vertical, from y0 to y1 at x */
export function finishLine(x, y0, y1, w = 44, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; const sq = w / 2;
  for (let yy = y0, r = 0; yy < y1; yy += sq, r++) for (let c = 0; c < 2; c++) { ctx.fillStyle = (r + c) % 2 ? C.ink : C.white; ctx.fillRect(x - w / 2 + c * sq, yy, sq, Math.min(sq, y1 - yy)); }
  ctx.restore();
}

/** ink counter box with big yellow digits and a small white label. s = 1 → 380 x 220 */
export function counterBox(x, y, s, text, label = '', col = C.yellow) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-190, -110, 380, 220, 34); ctx.fillStyle = C.ink; ctx.fill();
  rr(-170, -92, 340, 130, 22); ctx.fillStyle = '#2A2F3A'; ctx.fill();
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = '900 96px Inter, sans-serif'; ctx.fillStyle = col; ctx.fillText(String(text), 0, -26);
  if (label) { ctx.font = '900 40px Inter, sans-serif'; ctx.fillStyle = C.white; ctx.fillText(label, 0, 76); }
  ctx.restore();
}

/** a loading spinner ring (for a phone screen or anywhere). s = 1 → r 60 */
export function waitRing(x, y, s, t) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.lineWidth = 16; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(0, 0, 60, 0, TAU); ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, 60, t * 7, t * 7 + 1.9); ctx.strokeStyle = C.shirt; ctx.stroke();
  ctx.restore();
}
