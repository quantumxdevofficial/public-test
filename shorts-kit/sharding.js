// (11/30) Sharding components: a torn piece of the order book with a range label, a name tag with a highlighted
// first letter (the shard key), flat flames (a hot shard), a C-A-P triangle for the next-day tease.
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

/** jagged torn piece of an order book page. s = 1 → 300x380. label = range tab ("A-H"), col = tab colour,
 *  n = order lines drawn, torn = which sides are ragged: 'l' | 'r' | 'lr' */
export function bookPiece(x, y, s, label = 'A-H', col = C.red, rot = 0, n = 4, torn = 'lr', a = 1) {
  if (s <= 0 || a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  const jag = (x0, top, bot, dir) => { const pts = []; let k = 0; for (let yy = top; yy <= bot; yy += 38, k++) pts.push([x0 + (k % 2 ? 18 : -6) * dir, yy]); return pts; };
  const L = torn.includes('l') ? jag(-150, -190, 190, 1) : [[-150, -190], [-150, 190]];
  const R = torn.includes('r') ? jag(150, -190, 190, -1) : [[150, -190], [150, 190]];
  ctx.beginPath(); ctx.moveTo(L[0][0], -190);
  for (const p of R) ctx.lineTo(p[0], p[1]);
  ctx.lineTo(R[R.length - 1][0], 190);
  for (let i = L.length - 1; i >= 0; i--) ctx.lineTo(L[i][0], L[i][1]);
  ctx.closePath(); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 8; ctx.lineJoin = 'round'; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-150 + 30, -190 + 8, 240, 26, 8); ctx.fillStyle = col; ctx.fill();
  for (let k = 0; k < 4; k++) {
    const py = -110 + k * 62;
    if (k < n) { circle(-95, py, 12, col); rr(-70, py - 9, 160, 18, 9); ctx.fillStyle = '#3C3C44'; ctx.fill(); }
    else { rr(-70, py - 4, 160, 10, 5); ctx.fillStyle = '#E4DCCB'; ctx.fill(); }
  }
  if (label) {
    ctx.font = '900 64px Inter'; const w = ctx.measureText(label).width + 60;
    rr(-w / 2, 140, w, 92, 26); ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
    ctx.fillStyle = C.white; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, 188);
  }
  ctx.restore();
}

/** "HELLO my name is" style tag. s = 1 → 460x240. hi 0..1 highlights the first letter in a yellow box */
export function nameTag(x, y, s, name = 'ASHA', hi = 0, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-230, -120, 460, 240, 30); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-230, -120, 460, 70, [30, 30, 0, 0]); ctx.fillStyle = C.red; ctx.fill(); ctx.lineWidth = 10; ctx.stroke();
  ctx.fillStyle = C.white; ctx.font = '900 36px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.letterSpacing = '6px'; ctx.fillText('CUSTOMER', 0, -84); ctx.letterSpacing = '0px';
  ctx.font = '900 104px Inter'; ctx.textAlign = 'left';
  const first = name[0], rest = name.slice(1), wF = ctx.measureText(first).width, wR = ctx.measureText(rest).width, x0 = -(wF + wR) / 2;
  if (hi > 0) { ctx.save(); ctx.translate(x0 + wF / 2, 30); ctx.scale(1 + hi * 0.15, 1 + hi * 0.15); rr(-wF / 2 - 14, -62, wF + 28, 124, 18); ctx.fillStyle = C.yellow; ctx.globalAlpha = clamp(hi); ctx.fill(); ctx.restore(); }
  ctx.fillStyle = C.ink; ctx.fillText(first, x0, 34); ctx.fillText(rest, x0 + wF, 34);
  ctx.restore();
}

/** flat flames (overload / hot spot). s = 1 → ~260 wide, base at y. t = time */
export function flames(x, y, s, t = 0, a = 1) {
  if (s <= 0 || a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s);
  const tongue = (dx, h, w, col) => {
    const f = 1 + Math.sin(t * 14 + dx) * 0.08;
    ctx.beginPath(); ctx.moveTo(dx - w, 0);
    ctx.quadraticCurveTo(dx - w * 0.9, -h * 0.55 * f, dx + Math.sin(t * 9 + dx) * 14, -h * f);
    ctx.quadraticCurveTo(dx + w * 0.9, -h * 0.55 * f, dx + w, 0); ctx.closePath(); ctx.fillStyle = col; ctx.fill();
  };
  for (const [dx, h, w] of [[-80, 150, 60], [0, 220, 80], [80, 160, 60]]) tongue(dx, h, w, C.red);
  for (const [dx, h, w] of [[-70, 90, 36], [0, 140, 50], [70, 100, 36]]) tongue(dx, h, w, '#F29A3A');
  tongue(0, 70, 30, C.yellow);
  ctx.restore();
}

/** C-A-P triangle (tomorrow's tease). s = 1 → ~420 wide. a = alpha, lit = 0..3 corners shown */
export function capTriangle(x, y, s, lit = 3, a = 1) {
  if (s <= 0 || a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s);
  const P = [[0, -200], [210, 160], [-210, 160]];
  ctx.beginPath(); P.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py))); ctx.closePath();
  ctx.lineWidth = 16; ctx.lineJoin = 'round'; ctx.strokeStyle = C.ink; ctx.stroke();
  ['C', 'A', 'P'].forEach((L, i) => {
    if (i >= lit) return;
    const [px, py] = P[i]; circle(px, py, 74, C.ink); circle(px, py, 62, [C.yellow, C.cyan, C.pink][i]);
    ctx.fillStyle = C.ink; ctx.font = '900 76px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(L, px, py + 4);
  });
  ctx.restore();
}
