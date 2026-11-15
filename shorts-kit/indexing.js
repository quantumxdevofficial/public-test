// Database indexing (System Design day 9) components. Same flat look: flat fills, one darker shade, ink outlines on cards.
import { ctx, C, TAU, clamp, lerp, rr, circle, ell, line } from './lib.js';

const GREEN = '#5BAE6A', BLUE = '#3A7BD5', ORANGE = '#F29A3A';

/** phone screen: incoming call from `name` (green bg, avatar, pulsing rings, two buttons). use inside K.phone(..., () => callScreen(...)) */
export function callScreen(name = 'CUSTOMER', t = 0) {
  ctx.fillStyle = '#2F7D4A'; ctx.fillRect(-166, -350, 332, 700);
  for (let k = 0; k < 3; k++) {
    const u = (t * 0.9 + k / 3) % 1;
    ctx.save(); ctx.globalAlpha = 0.5 * (1 - u); ctx.lineWidth = 6; ctx.strokeStyle = C.white;
    ctx.beginPath(); ctx.arc(0, -110, 70 + u * 90, 0, TAU); ctx.stroke(); ctx.restore();
  }
  circle(0, -110, 70, '#CFE8D6'); circle(0, -132, 26, GREEN); ell(0, -82, 42, 26, GREEN);
  ctx.fillStyle = C.white; ctx.font = '900 34px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(name, 0, 10); ctx.font = '700 24px Inter'; ctx.fillText('calling...', 0, 52);
  circle(-80, 240, 42, C.red); circle(80, 240, 42, '#7BD38A');
  for (const [x, rot] of [[-80, 2.4], [80, 0]]) {
    ctx.save(); ctx.translate(x, 240); ctx.rotate(rot); rr(-24, -8, 48, 16, 8); ctx.fillStyle = C.white; ctx.fill(); ctx.restore();
  }
}

/** textbook back-page INDEX card. s = 1 → 640x820, origin = centre. rows = [[name, where]], shown 0..n, hi = row to highlight (hiP 0..1),
 *  o.ptr 0..1 draws a red pointer arrow out of the right side of the highlighted row */
export function bookIndex(x, y, s, rows, shown = 1e9, hi = -1, hiP = 0, o = {}) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-330, -400, 660, 820, 26); ctx.fillStyle = C.pantsShade || '#23304A'; ctx.fill();               // book spine edge
  rr(-320, -410, 640, 820, 22); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-320, -410, 640, 120, [22, 22, 0, 0]); ctx.fillStyle = BLUE; ctx.fill(); ctx.stroke();
  ctx.fillStyle = C.white; ctx.font = '900 64px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('INDEX', 0, -348);
  const n = Math.min(rows.length, Math.ceil(shown)), rh = 600 / rows.length;
  for (let r = 0; r < n; r++) {
    const a = r === n - 1 ? clamp(shown - r) : 1, ry = -260 + r * rh + rh / 2;
    ctx.save(); ctx.globalAlpha = a;
    if (r === hi && hiP > 0) { ctx.globalAlpha = a * hiP; rr(-296, ry - rh / 2 + 8, 592, rh - 16, 14); ctx.fillStyle = C.yellow; ctx.fill(); ctx.globalAlpha = a; }
    ctx.fillStyle = C.ink; ctx.font = '900 44px Inter'; ctx.textAlign = 'left'; ctx.fillText(rows[r][0], -270, ry + 2);
    const nw = ctx.measureText(rows[r][0]).width;
    ctx.font = '800 36px Inter'; ctx.textAlign = 'right'; ctx.fillStyle = BLUE; ctx.fillText(rows[r][1], 270, ry + 2);
    const ww = ctx.measureText(rows[r][1]).width;
    for (let dx = -270 + nw + 22; dx < 270 - ww - 18; dx += 22) circle(dx, ry + 12, 4, '#B9B2A4');
    ctx.restore();
  }
  if (hi >= 0 && (o.ptr || 0) > 0) {
    const ry = -260 + hi * rh + rh / 2, len = 200 * clamp(o.ptr);
    line([[310, ry], [310 + len, ry]], C.red, 16);
    if (o.ptr > 0.6) { ctx.beginPath(); ctx.moveTo(310 + len + 34, ry); ctx.lineTo(310 + len - 6, ry - 30); ctx.lineTo(310 + len - 6, ry + 30); ctx.closePath(); ctx.fillStyle = C.red; ctx.fill(); }
  }
  ctx.restore();
}

/** B-tree: root → 3 branches → 3x3 leaves. Node boxes show letter ranges. p 0..3 lights the path root → 'R-Z' → 'R' → found row
 *  (yellow nodes + a yellow dot hopping along). sc pops the tree in. origin = root centre; ~900 wide, ~760 tall at s = 1 */
export const TREE_LEAVES = ['A', 'D', 'G', 'J', 'M', 'P', 'R', 'U', 'X'];
export function bTree(x, y, s, p = 0, sc = 1) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  const root = [0, 0], mids = [[-300, 260], [0, 260], [300, 260]], midL = ['A-I', 'J-Q', 'R-Z'];
  const leaves = TREE_LEAVES.map((_, i) => [-400 + i * 100, 520]);
  const path = [root, mids[2], leaves[6]];
  const lit = (lvl) => p >= lvl;
  // edges
  mids.forEach((m, i) => line([[0, 44], [m[0], m[1] - 44]], i === 2 && lit(1) ? C.yellow : '#9AA1AE', i === 2 && lit(1) ? 14 : 8));
  leaves.forEach((l, i) => { const m = mids[Math.floor(i / 3)]; const on = i === 6 && lit(2); line([[m[0], m[1] + 44], [l[0], l[1] - 40]], on ? C.yellow : '#9AA1AE', on ? 12 : 6); });
  const node = (cx, cy, w, h, txt, on, fs) => {
    rr(cx - w / 2, cy - h / 2, w, h, 18); ctx.fillStyle = on ? C.yellow : C.white; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
    ctx.fillStyle = C.ink; ctx.font = `900 ${fs}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, cx, cy + 2);
  };
  node(0, 0, 260, 96, 'A-Z', lit(0) && p > 0, 52);
  mids.forEach((m, i) => node(m[0], m[1], 210, 90, midL[i], i === 2 && lit(1), 46));
  leaves.forEach((l, i) => node(l[0], l[1], 84, 80, TREE_LEAVES[i], i === 6 && lit(2), 44));
  // the hopping dot
  if (p > 0 && p < 3) {
    const k = Math.min(1, Math.floor(p)), u = p - Math.floor(p), a = path[k], b = path[k + 1] || path[k];
    const hx = lerp(a[0], b[0], u), hy = lerp(a[1], b[1], u) - Math.sin(u * Math.PI) * 60;
    circle(hx, hy - 70, 24, C.ink); circle(hx, hy - 70, 17, C.red);
  }
  ctx.restore();
}

/** a tiny flat snail (slowness). s = 1 → ~220 wide. t animates the crawl wobble */
export function slowSnail(x, y, s, t = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const st = 1 + Math.sin(t * 4) * 0.05;
  ctx.save(); ctx.scale(st, 1); rr(-110, 10, 220, 50, 25); ctx.fillStyle = '#C9A27A'; ctx.fill(); ctx.restore();
  line([[80, 20], [95, -40]], '#C9A27A', 10); line([[100, 20], [125, -36]], '#C9A27A', 10);
  circle(95, -44, 10, C.ink); circle(125, -40, 10, C.ink);
  circle(-20, -20, 70, ORANGE); circle(-20, -20, 46, '#F6B868'); circle(-20, -20, 22, ORANGE);
  ctx.restore();
}
