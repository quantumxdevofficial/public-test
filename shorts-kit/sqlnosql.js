// SQL vs NoSQL (System Design day 8) components. Same flat look: flat fills, one darker shade, ink outlines on cards.
import { ctx, C, TAU, clamp, lerp, rr, circle, ell, line } from './lib.js';

const GREEN = '#5BAE6A', BLUE = '#3A7BD5', ORANGE = '#F29A3A', PURPLE = '#8A63D2';
const HAND = "900 italic 46px Inter";

/** strict ORDER FORM card. s = 1 → 520x640, origin = centre. fills = [name, pizza, size] 0..1 (how much handwriting shows) */
export function orderForm(x, y, s, fills = [1, 1, 1], rot = 0, vals = ['ASHA', 'PEPPERONI', 'LARGE']) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-260, -320, 520, 640, 30); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-260, -320, 520, 120, [30, 30, 0, 0]); ctx.fillStyle = C.red; ctx.fill(); ctx.stroke();
  ctx.fillStyle = C.white; ctx.font = '900 54px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('ORDER FORM', 0, -258);
  ['NAME', 'PIZZA', 'SIZE'].forEach((lab, i) => {
    const by = -160 + i * 150;
    ctx.fillStyle = C.ink; ctx.font = '900 30px Inter'; ctx.textAlign = 'left'; ctx.fillText(lab, -210, by);
    rr(-210, by + 22, 420, 84, 14); ctx.fillStyle = '#F4F1EA'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
    const f = clamp(fills[i] ?? 0);
    if (f > 0) {
      const v = vals[i], n = Math.ceil(v.length * f);
      ctx.fillStyle = BLUE; ctx.font = HAND; ctx.fillText(v.slice(0, n), -186, by + 66);
    }
  });
  ctx.restore();
}

/** SQL table: fixed header columns + rows. s = 1 → 860 wide, header 100, rows 96. rows = [[a, b, c]], shown 0..n (fractional pops the last row).
 *  o.lock 0..1 shows a small padlock badge on the header (fixed shape); o.hl = row index to highlight yellow */
export function sqlGrid(x, y, s, rows, shown = 1e9, o = {}) {
  if (s <= 0) return;
  const head = o.head || ['NAME', 'PIZZA', 'SIZE'], cw = o.cw || [260, 360, 240], Wd = cw.reduce((a, b) => a + b, 0);
  const n = Math.min(rows.length, Math.ceil(shown)), h = 100 + rows.length * 96;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-Wd / 2, 0, Wd, h, 26); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-Wd / 2, 0, Wd, 100, [26, 26, 0, 0]); ctx.fillStyle = BLUE; ctx.fill(); ctx.stroke();
  // grid lines (always: the shape is fixed even when empty)
  let cx = -Wd / 2; ctx.lineWidth = 5; ctx.strokeStyle = '#C9C2B5';
  for (let c = 0; c < cw.length - 1; c++) { cx += cw[c]; ctx.beginPath(); ctx.moveTo(cx, 100); ctx.lineTo(cx, h - 8); ctx.stroke(); }
  for (let r = 1; r < rows.length; r++) { ctx.beginPath(); ctx.moveTo(-Wd / 2 + 8, 100 + r * 96); ctx.lineTo(Wd / 2 - 8, 100 + r * 96); ctx.stroke(); }
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  cx = -Wd / 2; head.forEach((t, c) => { ctx.fillStyle = C.white; ctx.font = '900 38px Inter'; ctx.fillText(t, cx + 26, 52); cx += cw[c]; });
  for (let r = 0; r < n; r++) {
    const a = r === n - 1 ? clamp(shown - r) : 1, ry = 100 + r * 96;
    ctx.save(); ctx.globalAlpha = a;
    if (o.hl === r) { ctx.fillStyle = 'rgba(255,212,59,0.55)'; ctx.fillRect(-Wd / 2 + 6, ry + 4, Wd - 12, 88); }
    cx = -Wd / 2; rows[r].forEach((t, c) => { ctx.fillStyle = C.ink; ctx.font = '800 40px Inter'; ctx.fillText(t, cx + 26 + (1 - a) * 30, ry + 50); cx += cw[c]; });
    ctx.restore();
  }
  if ((o.lock || 0) > 0) {
    ctx.save(); ctx.translate(Wd / 2 - 10, -10); ctx.scale(o.lock, o.lock);
    circle(0, 0, 54, C.ink); circle(0, 0, 46, C.yellow);
    ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.arc(0, -6, 15, Math.PI, 0); ctx.stroke();
    rr(-22, -6, 44, 32, 6); ctx.fillStyle = C.ink; ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

/** one notebook page's content in page-local coords (page box 360x500, origin = centre).
 *  kind: 'order' | 'photo' | 'toppings' | 'chat' | 'blank' */
export function pageContent(kind, a = 1) {
  if (a <= 0 || kind === 'blank') return;
  ctx.save(); ctx.globalAlpha *= a; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  if (kind === 'order') {
    ctx.fillStyle = BLUE; ctx.font = '900 italic 40px Inter'; ctx.fillText('Asha', -140, -170);
    ctx.font = '800 italic 34px Inter'; ctx.fillText('pepperoni, L', -140, -100);
  } else if (kind === 'photo') {
    ctx.fillStyle = BLUE; ctx.font = '900 italic 40px Inter'; ctx.fillText('Ravi', -140, -190);
    ctx.save(); ctx.translate(0, 10); ctx.rotate(-0.06);
    rr(-130, -110, 260, 210, 10); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
    rr(-114, -94, 228, 150, 4); ctx.fillStyle = C.sky; ctx.fill();
    ctx.beginPath(); ctx.moveTo(-114, 56); ctx.lineTo(-40, -10); ctx.lineTo(20, 30); ctx.lineTo(60, 0); ctx.lineTo(114, 56); ctx.closePath(); ctx.fillStyle = GREEN; ctx.fill();
    circle(70, -54, 22, C.yellow);
    ctx.restore();
  } else if (kind === 'toppings') {
    ctx.fillStyle = BLUE; ctx.font = '900 italic 40px Inter'; ctx.fillText('Meera', -140, -190);
    [['olives', C.ink], ['extra cheese', C.yellow], ['chilli', C.red], ['corn', ORANGE], ['basil', GREEN]].forEach(([t, c], i) => {
      circle(-120, -110 + i * 66, 18, c); ctx.lineWidth = 4; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.arc(-120, -110 + i * 66, 18, 0, TAU); ctx.stroke();
      ctx.fillStyle = C.ink; ctx.font = '800 italic 32px Inter'; ctx.fillText(t, -86, -108 + i * 66);
    });
  } else if (kind === 'chat') {
    ctx.fillStyle = BLUE; ctx.font = '900 italic 40px Inter'; ctx.fillText('Sam', -140, -190);
    for (let i = 0; i < 3; i++) { const w = [220, 160, 250][i], mine = i % 2; rr(mine ? 130 - w : -140, -130 + i * 100, w, 70, 30); ctx.fillStyle = mine ? '#CFEFD6' : '#E8EEF8'; ctx.fill(); }
  }
  ctx.restore();
}

/** open spiral notebook (two pages). s = 1 → 820x580, origin = centre. left/right = page kinds; la/ra = content alpha.
 *  flip 0..1 turns the right page over to the left (shows `next` on the new right page underneath) */
export function notebook(x, y, s, left = 'order', right = 'photo', la = 1, ra = 1, flip = 0, next = 'blank', na = 1) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-420, -300, 840, 600, 34); ctx.fillStyle = ORANGE; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  const page = (px, kind, a) => {
    rr(px - 190, -270, 380, 540, 16); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.rect(px - 190, -270, 380, 540); ctx.clip();
    for (let k = 0; k < 9; k++) line([[px - 170, -200 + k * 56], [px + 170, -200 + k * 56]], '#DCE8F5', 3);
    ctx.translate(px, 0); pageContent(kind, a); ctx.restore();
  };
  page(-200, left, la);
  page(200, flip > 0 ? next : right, flip > 0 ? na : ra);
  if (flip > 0 && flip < 1) {          // the turning page squashes over the spine
    const k = Math.cos(flip * Math.PI), w = 380 * Math.abs(k), px = k > 0 ? w / 2 + 10 : -w / 2 - 10;
    rr(px - w / 2, -270, w, 540, 16); ctx.fillStyle = k > 0 ? C.white : '#F0ECE4'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  }
  for (let k = 0; k < 8; k++) { const yy = -240 + k * 68; ctx.lineWidth = 8; ctx.strokeStyle = '#9AA1AE'; ctx.beginPath(); ctx.ellipse(0, yy, 26, 14, 0, 0, TAU); ctx.stroke(); }
  ctx.restore();
}

/** a NoSQL "document" card: a page with a coloured tab and `n` text bars of uneven length (each one a different shape).
 *  s = 1 → 200 wide, height grows with n. origin = centre */
export function docPage(x, y, s, n = 3, col = BLUE, rot = 0, a = 1) {
  if (s <= 0 || a <= 0) return;
  const h = 70 + n * 44;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.globalAlpha *= a;
  rr(-100, -h / 2, 200, h, 16); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-100, -h / 2, 200, 40, [16, 16, 0, 0]); ctx.fillStyle = col; ctx.fill(); ctx.stroke();
  for (let i = 0; i < n; i++) { const w = [130, 90, 150, 110, 70][(i + n) % 5]; rr(-76, -h / 2 + 62 + i * 44, w, 18, 9); ctx.fillStyle = '#C9CDD6'; ctx.fill(); }
  ctx.restore();
}
export const DOC_COLS = [BLUE, C.pink, GREEN, ORANGE, PURPLE, C.red];
