// (10/30) Replication components: leader crown, open order book (master + copies), smoke puffs, a data dot on an arc.
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';
import { arcAt } from './tech.js';

/** flat gold crown (leader badge). s = 1 → 200 wide, base at y */
export function crown(x, y, s, a = 1) {
  if (s <= 0 || a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-100, 0); ctx.lineTo(-100, -90); ctx.lineTo(-50, -40); ctx.lineTo(0, -110); ctx.lineTo(50, -40); ctx.lineTo(100, -90); ctx.lineTo(100, 0); ctx.closePath();
  ctx.fillStyle = C.yellow; ctx.fill(); ctx.lineWidth = 9; ctx.lineJoin = 'round'; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-100, -26, 200, 26, 0); ctx.fillStyle = '#E8B820'; ctx.fill();
  circle(-100, -96, 14, C.red); circle(0, -118, 16, C.red); circle(100, -96, 14, C.red);
  ctx.restore();
}

/** open order book. s = 1 → 560x380. n = order lines written (0..8), hi = index of a line flashing yellow (-1 none),
 *  o.col cover colour, o.label tab text, o.lag = number of trailing lines shown as empty dashed "missing" slots */
export function orderBook(x, y, s, n = 4, hi = -1, o = {}) {
  if (s <= 0) return;
  const col = o.col || C.red;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-290, -180, 580, 380, 30); ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  for (const sx of [-1, 1]) {
    rr(sx < 0 ? -270 : 6, -160, 264, 340, 16); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  }
  line([[0, -165], [0, 185]], C.ink, 8);
  for (let k = 0; k < 8; k++) {
    const px = k < 4 ? -250 : 26, py = -120 + (k % 4) * 78;
    if (k < n) {
      if (k === hi) { rr(px - 8, py - 22, 240, 50, 10); ctx.fillStyle = C.yellow; ctx.fill(); }
      circle(px + 18, py + 3, 13, col);
      rr(px + 44, py - 6, 160, 18, 9); ctx.fillStyle = '#3C3C44'; ctx.fill();
    } else if (o.lag && k < n + o.lag) {
      ctx.save(); ctx.setLineDash([14, 10]); ctx.lineWidth = 5; ctx.strokeStyle = C.red; rr(px - 6, py - 20, 230, 46, 10); ctx.stroke(); ctx.restore();
    } else {
      rr(px + 44, py - 2, 160, 10, 5); ctx.fillStyle = '#E4DCCB'; ctx.fill();
    }
  }
  if (o.label) {
    ctx.font = '900 40px Inter'; const w = ctx.measureText(o.label).width + 50;
    rr(-w / 2, 190, w, 64, 18); ctx.fillStyle = C.ink; ctx.fill();
    ctx.fillStyle = C.white; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(o.label, 0, 224);
  }
  ctx.restore();
}

/** grey smoke puffs rising from (x, y). t = time, a = alpha */
export function smokePuffs(x, y, t, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  for (let k = 0; k < 5; k++) {
    const u = ((t * 0.6 + k / 5) % 1);
    const px = x + Math.sin(k * 2.3 + t * 2) * 40 * u + (k - 2) * 18, py = y - u * 260;
    ctx.globalAlpha = a * (1 - u) * 0.9;
    circle(px, py, 30 + u * 50, k % 2 ? '#8A8F99' : '#A7ACB5');
  }
  ctx.restore();
}

/** a little order dot travelling on an arc from (x1,y1) to (x2,y2), u 0..1 */
export function dataDot(x1, y1, x2, y2, h, u, col = C.yellow, r = 22) {
  if (u <= 0 || u >= 1) return;
  const [x, y] = arcAt(x1, y1, x2, y2, h, u);
  circle(x, y, r + 7, C.ink); circle(x, y, r, col); circle(x - r * 0.3, y - r * 0.3, r * 0.3, C.white);
}
