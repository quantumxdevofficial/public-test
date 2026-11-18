// (12/30) CAP theorem components: a phone line between two branches that can be cut (the partition), a price tag
// (fresh / maybe-old), a big letter card for C / A / P, a flat bank building and a like counter.
import { ctx, C, lerp, clamp, rr, circle, ell, line } from './lib.js';

/** sagging phone wire from (x1,y1) to (x2,y2). cut 0..1 = how far the two broken ends have dropped apart.
 *  t = time (spark flicker at the break while cut is fresh). Returns nothing. */
export function phoneLine(x1, y1, x2, y2, cut = 0, t = 0) {
  ctx.save(); ctx.lineCap = 'round';
  const mx = (x1 + x2) / 2, sag = 70;
  const seg = (ax, ay, bx, by, cx, cy) => {
    for (const [w, c] of [[18, C.ink], [8, '#5A6270']]) { ctx.beginPath(); ctx.moveTo(ax, ay); ctx.quadraticCurveTo(cx, cy, bx, by); ctx.lineWidth = w; ctx.strokeStyle = c; ctx.stroke(); }
  };
  // poles
  circle(x1, y1, 16, C.ink); circle(x2, y2, 16, C.ink);
  if (cut <= 0) {
    seg(x1, y1, x2, y2, mx, Math.max(y1, y2) + sag);
  } else {
    const d = clamp(cut), gap = 30 + d * 40, drop = d * 150;
    seg(x1, y1, mx - gap, Math.max(y1, y2) + sag * 0.6 + drop, lerp(x1, mx, 0.6), Math.max(y1, y2) + sag + drop * 0.4);
    seg(x2, y2, mx + gap, Math.max(y1, y2) + sag * 0.6 + drop, lerp(x2, mx, 0.6), Math.max(y1, y2) + sag + drop * 0.4);
    // little sparks at the two loose ends
    const fl = 0.5 + 0.5 * Math.sin(t * 40);
    for (const sx of [-1, 1]) {
      const ex = mx + sx * gap, ey = Math.max(y1, y2) + sag * 0.6 + drop;
      for (let k = 0; k < 4; k++) {
        const an = -Math.PI / 2 + (k - 1.5) * 0.6 + sx * 0.3, r = 26 + 18 * fl;
        line([[ex + Math.cos(an) * 10, ey + Math.sin(an) * 10], [ex + Math.cos(an) * r, ey + Math.sin(an) * r]], C.yellow, 7);
      }
    }
  }
  ctx.restore();
}

/** hanging price tag. s = 1 → 260x150. o: { col (tag colour), stale 0..1 (greys it and adds a '?' badge), rot } */
export function priceTag(x, y, s, text = '$10', o = {}) {
  if (s <= 0) return;
  const { col = C.white, stale = 0, rot = 0, fg = C.ink } = o;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-130, -75); ctx.lineTo(90, -75); ctx.lineTo(140, 0); ctx.lineTo(90, 75); ctx.lineTo(-130, 75); ctx.closePath();
  ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 9; ctx.lineJoin = 'round'; ctx.strokeStyle = C.ink; ctx.stroke();
  circle(88, 0, 16, C.ink); circle(88, 0, 9, C.bg);
  ctx.fillStyle = fg; ctx.font = '900 92px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, -24, 6);
  if (stale > 0) {
    ctx.globalAlpha = clamp(stale) * 0.35; rr(-130, -75, 270, 150, 4); ctx.fillStyle = '#7C8391'; ctx.fill(); ctx.globalAlpha = 1;
    const k = clamp(stale); ctx.save(); ctx.translate(-120, -80); ctx.scale(k, k);
    circle(0, 0, 44, C.ink); circle(0, 0, 36, C.red);
    ctx.fillStyle = C.white; ctx.font = '900 56px Inter'; ctx.fillText('?', 0, 4); ctx.restore();
  }
  ctx.restore();
}

/** big letter card: a rounded tile with one letter and its word under it. s = 1 → 380x420. sc animates the pop */
export function letterCard(x, y, s, letter = 'C', word = 'CONSISTENCY', col = C.yellow, sc = 1, rot = 0) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * sc, s * sc);
  rr(-190, -210, 380, 420, 46); ctx.fillStyle = C.ink; ctx.fill();
  rr(-176, -196, 352, 300, 36); ctx.fillStyle = col; ctx.fill();
  rr(-150, -176, 120, 26, 13); ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.fill();
  ctx.fillStyle = C.ink; ctx.font = '900 250px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(letter, 0, -40);
  ctx.fillStyle = C.white; let fs = 50; ctx.font = `900 ${fs}px Inter`;
  while (ctx.measureText(word).width > 340 && fs > 24) { fs -= 2; ctx.font = `900 ${fs}px Inter`; }
  ctx.fillText(word, 0, 158);
  ctx.restore();
}

/** flat bank building with columns. s = 1 → 420 wide, origin = bottom centre */
export function bankBuilding(x, y, s, glow = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-230, -300); ctx.lineTo(0, -430); ctx.lineTo(230, -300); ctx.closePath();
  ctx.fillStyle = '#E4DCCB'; ctx.fill(); ctx.lineWidth = 9; ctx.lineJoin = 'round'; ctx.strokeStyle = C.ink; ctx.stroke();
  circle(0, -350, 34, C.ink); circle(0, -350, 26, glow > 0 ? C.yellow : '#D9A93A');
  ctx.fillStyle = C.ink; ctx.font = '900 40px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('$', 0, -348);
  rr(-220, -300, 440, 40, 6); ctx.fillStyle = C.white; ctx.fill(); ctx.stroke();
  for (let k = 0; k < 4; k++) { const cx = -150 + k * 100; rr(cx - 26, -258, 52, 214, 6); ctx.fillStyle = C.white; ctx.fill(); ctx.stroke(); rr(cx - 10, -246, 8, 190, 4); ctx.fillStyle = '#E4DCCB'; ctx.fill(); }
  rr(-240, -44, 480, 44, 6); ctx.fillStyle = '#E4DCCB'; ctx.fill(); ctx.stroke();
  ctx.fillStyle = C.ink; ctx.font = '900 34px Inter'; ctx.letterSpacing = '8px'; ctx.fillText('BANK', 0, -279); ctx.letterSpacing = '0px';
  ctx.restore();
}

/** a like counter: white rounded box with a red heart and a number. s = 1 → 400x170 */
export function likeCounter(x, y, s, n = '1,204', beat = 0, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  rr(-200, -85, 400, 170, 85); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  const k = 0.55 * (1 + beat * 0.15);
  ctx.save(); ctx.translate(-105, 4); ctx.scale(k, k);
  ctx.beginPath(); ctx.moveTo(0, 80); ctx.bezierCurveTo(-120, 0, -110, -100, -50, -96); ctx.bezierCurveTo(-18, -94, 0, -70, 0, -50); ctx.bezierCurveTo(0, -70, 18, -94, 50, -96); ctx.bezierCurveTo(110, -100, 120, 0, 0, 80); ctx.closePath();
  ctx.fillStyle = C.red; ctx.fill(); ell(-48, -56, 22, 12, '#EE6672'); ctx.restore();
  ctx.fillStyle = C.ink; ctx.font = '900 76px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(n, 50, 6);
  ctx.restore();
}
