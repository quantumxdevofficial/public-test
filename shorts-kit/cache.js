// Caching (System Design day 6) components. Same flat look: flat fills, one darker shade, ink outlines on graphics.
import { ctx, C, TAU, clamp, lerp, rr, circle, ell, line } from './lib.js';

const CRUST = '#E0A15A', CRUST_D = '#C4823F', CHEESE = '#FFD43B', CHEESE_D = '#F2B92B', PEP = '#D62839', MOLD = '#8FB46A', MOLD_D = '#6F9550';

/** top-down pizza. r = 130 px at s = 1. slices 0..8 = how many slices are left, stale 0..1 turns it green and mouldy */
export function pizza(x, y, s, rot = 0, slices = 8, stale = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  const n = clamp(slices, 0, 8), a1 = (n / 8) * TAU;
  const wedge = (r) => { ctx.beginPath(); if (n < 8) ctx.moveTo(0, 0); ctx.arc(0, 0, r, -Math.PI / 2, -Math.PI / 2 + a1); if (n < 8) ctx.closePath(); };
  wedge(134); ctx.fillStyle = CRUST_D; ctx.fill();
  wedge(128); ctx.fillStyle = CRUST; ctx.fill();
  wedge(104); ctx.fillStyle = stale > 0.5 ? '#D9C66A' : CHEESE; ctx.fill();
  ctx.save(); wedge(104); ctx.clip();
  for (const [px, py] of [[-50, -40], [40, -55], [55, 25], [-20, 50], [-60, 20], [10, -5], [-5, -75], [70, -10]]) { circle(px, py, 18, PEP); circle(px - 5, py - 5, 6, '#E85A66'); }
  for (const [px, py, r] of [[-30, -10, 10], [30, 50, 8], [-60, -70, 7]]) ell(px, py, r * 1.6, r, CHEESE_D, 0.4);
  if (stale > 0) { ctx.globalAlpha = stale * 0.55; ctx.fillStyle = MOLD; ctx.fillRect(-140, -140, 280, 280); ctx.globalAlpha = stale;
    for (const [px, py, r] of [[-40, 10, 26], [45, -30, 20], [20, 60, 18], [-55, -55, 14]]) { circle(px, py, r, MOLD_D); circle(px - r * 0.3, py - r * 0.3, r * 0.35, MOLD); } }
  ctx.restore();
  if (n < 8) for (let k = 0; k <= n; k += n) { const a = -Math.PI / 2 + (k / 8) * TAU; line([[0, 0], [Math.cos(a) * 128, Math.sin(a) * 128]], CRUST_D, 6); }
  else for (let k = 0; k < 4; k++) { const a = k * Math.PI / 4; line([[Math.cos(a) * -104, Math.sin(a) * -104], [Math.cos(a) * 104, Math.sin(a) * 104]], 'rgba(196,130,63,0.55)', 4); }
  ctx.restore();
}

/** green "stink" squiggles rising from (x, y). a = alpha */
export function stink(x, y, t, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.lineCap = 'round'; ctx.lineWidth = 12; ctx.strokeStyle = MOLD_D;
  for (let i = -1; i <= 1; i++) { const p = (t * 0.7 + i * 0.33 + 1) % 1, bx = x + i * 70, by = y - p * 90;
    ctx.globalAlpha = a * (1 - p * 0.7); ctx.beginPath(); ctx.moveTo(bx, by);
    for (let k = 1; k <= 4; k++) ctx.quadraticCurveTo(bx + (k % 2 ? 26 : -26), by - k * 26 + 13, bx, by - k * 26);
    ctx.stroke(); }
  ctx.restore();
}

/** black bow tie for the waiter. Pass the hero's (x, y, s) */
export function bowtie(mx, my, s) {
  ctx.save(); ctx.translate(mx, my - 198 * s); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-46, -24); ctx.lineTo(-46, 24); ctx.closePath(); ctx.moveTo(0, 0); ctx.lineTo(46, -24); ctx.lineTo(46, 24); ctx.closePath();
  ctx.fillStyle = C.ink; ctx.fill(); circle(0, 0, 12, C.ink);
  ctx.restore();
}

/** a flat silver serving tray held flat; draws a dish/pizza on it via `on(x, y)` */
export function tray(x, y, s, on = null) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ell(0, 8, 150, 26, '#5E6775'); ell(0, 0, 150, 26, '#C9CED6');
  ctx.restore();
  if (on) on(x, y - 10 * s);
}

/** hourglass-style expiry timer card ("TTL"). left 1..0 = time remaining; red when low */
export function expiryTimer(x, y, s, left = 1, t = 0, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  const col = left < 0.25 ? C.red : '#3A7BD5';
  circle(0, 0, 150, C.ink); circle(0, 0, 130, C.white);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 112, -Math.PI / 2, -Math.PI / 2 + TAU * clamp(left)); ctx.closePath(); ctx.fillStyle = col; ctx.fill();
  rr(-30, -200, 60, 44, 10); ctx.fillStyle = C.ink; ctx.fill();
  circle(0, 0, 20, C.ink);
  ctx.restore();
}

/** warm shelf with heat lamps (like readyShelf) holding up to 3 side-on pizzas.
 *  items = [p0, p1, p2] scale 0..1 per slot (0 = empty), stale = [0..1 x3], glow 0..1 = yellow outline highlight */
export function warmShelf(x, y, s, items = [1, 1, 1], t = 0, stale = [0, 0, 0], glow = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  line([[-300, -250], [-300, -200]], C.ink, 8); line([[300, -250], [300, -200]], C.ink, 8);
  rr(-350, -280, 700, 40, 12); ctx.fillStyle = '#5E6775'; ctx.fill();
  for (const k of [-220, 0, 220]) { ctx.beginPath(); ctx.moveTo(k - 60, -200); ctx.lineTo(k + 60, -200); ctx.lineTo(k + 40, -240); ctx.lineTo(k - 40, -240); ctx.closePath(); ctx.fillStyle = '#7A8494'; ctx.fill();
    ctx.globalAlpha = 0.25 + 0.08 * Math.sin(t * 5 + k); ctx.beginPath(); ctx.moveTo(k - 60, -200); ctx.lineTo(k + 90, 40); ctx.lineTo(k - 90, 40); ctx.closePath(); ctx.fillStyle = C.yellow; ctx.fill(); ctx.globalAlpha = 1; }
  if (glow > 0) { ctx.globalAlpha = glow; rr(-370, -300, 740, 400, 30); ctx.lineWidth = 16; ctx.strokeStyle = C.yellow; ctx.stroke(); ctx.globalAlpha = 1; }
  rr(-350, 40, 700, 36, 10); ctx.fillStyle = '#7A8494'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  items.forEach((p, i) => { if (p <= 0) return; const px = -220 + i * 220;
    ctx.save(); ctx.translate(px, 8 - (1 - p) * 40); ctx.scale(1, 0.42); pizza(0, 0, 0.62 * p, 0, 8, stale[i] || 0); ctx.restore();
    ell(px, 26, 90 * p, 10, 'rgba(0,0,0,0.12)'); });
  ctx.restore();
}
