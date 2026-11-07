// Inside Out: QR-code components (QR grid, scan brackets, camera screen, sign stand, sticker, part box, flag).
// Same flat look: flat fills, one darker shade, one light highlight, ink outlines only on graphics/cards.
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line, rnd } from './lib.js';

const GOLD = '#FFD43B', CARD = '#FFFFFF', BOX = '#C8734A', BOX_D = '#A85E38', BOX_L = '#DE9468';
export const QN = 21;   // a version-1 QR is 21x21 modules

const cache = {};
/** deterministic 21x21 module matrix (1 = dark) with real finder + timing patterns; data modules pseudo-random */
export function qrMatrix(seed = 1) {
  if (cache[seed]) return cache[seed];
  const m = [];
  for (let r = 0; r < QN; r++) { m.push([]); for (let c = 0; c < QN; c++) m[r].push(rnd(seed * 17.3 + r * 21 + c * 1.37) > 0.52 ? 1 : 0); }
  const finder = (r0, c0) => {
    for (let r = -1; r <= 7; r++) for (let c = -1; c <= 7; c++) {
      const R = r0 + r, Cc = c0 + c; if (R < 0 || Cc < 0 || R >= QN || Cc >= QN) continue;
      const ring = Math.max(Math.abs(r - 3), Math.abs(c - 3));
      m[R][Cc] = (ring === 3 || ring <= 1) ? 1 : 0;
      if (r === -1 || c === -1 || r === 7 || c === 7) m[R][Cc] = 0;
    }
  };
  finder(0, 0); finder(0, QN - 7); finder(QN - 7, 0);
  for (let k = 8; k < QN - 8; k++) { m[6][k] = k % 2 === 0 ? 1 : 0; m[k][6] = k % 2 === 0 ? 1 : 0; }
  m[QN - 8][8] = 1;
  cache[seed] = m; return m;
}
/** true if module (r, c) is part of one of the three finder squares */
export const isFinder = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= QN - 7) || (r >= QN - 7 && c < 7);

/**
 * a QR code. size = full width in px incl. white quiet zone; centred at (x, y).
 * o = { seed, reveal 0..1 (modules pop in, in reading order), finderHi 0..1 (finders glow yellow),
 *       bits 0..1 (overlay 1/0 digits on a zoomed patch), dim 0..1 (dims data modules), rot, col (dark colour),
 *       tear 0..1 (bottom-right chunk ripped off), tearBg (colour behind the tear), bracket: false }
 */
export function qrCode(x, y, size, o = {}) {
  if (size <= 0) return;
  const m = qrMatrix(o.seed || 1), q = size / (QN + 4), reveal = o.reveal ?? 1, col = o.col || C.ink;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0);
  rr(-size / 2, -size / 2, size, size, q * 0.8); ctx.fillStyle = CARD; ctx.fill();
  if (o.outline !== false) { ctx.lineWidth = Math.max(4, q * 0.35); ctx.strokeStyle = C.ink; ctx.stroke(); }
  const x0 = -size / 2 + 2 * q, y0 = -size / 2 + 2 * q;
  for (let r = 0; r < QN; r++) for (let c = 0; c < QN; c++) {
    if (!m[r][c]) continue;
    const fin = isFinder(r, c);
    const ord = (r * QN + c) / (QN * QN), p = fin ? clamp(reveal * 3) : clamp((reveal - ord * 0.8) * 5);
    if (p <= 0) continue;
    const fill = col;
    ctx.globalAlpha = (!fin && o.dim) ? 1 - 0.75 * o.dim : 1;
    const sz = q * 1.02 * p;
    ctx.fillStyle = fill; ctx.fillRect(x0 + c * q + (q - sz) / 2, y0 + r * q + (q - sz) / 2, sz, sz);
  }
  ctx.globalAlpha = 1;
  if (o.finderHi > 0) {
    const a = clamp(o.finderHi);
    for (const [r, c] of [[0, 0], [0, QN - 7], [QN - 7, 0]]) {
      ctx.save(); ctx.globalAlpha = a; ctx.lineWidth = q * 0.7; ctx.strokeStyle = GOLD;
      rr(x0 + c * q - q * 0.9, y0 + r * q - q * 0.9, 8.8 * q, 8.8 * q, q * 1.4); ctx.stroke(); ctx.restore();
    }
  }
  if (o.tear > 0) {
    // ripped-off bottom-right chunk: jagged polygon in the background colour, with a paper-white torn edge
    const tr = clamp(o.tear), cx = size / 2 + 4, cy = size / 2 + 4, R = size * 0.62 * tr;
    const pts = [];
    for (let k = 0; k <= 14; k++) { const a = Math.PI + (k / 14) * (Math.PI / 2), j = 1 + (k % 2 ? 0.1 : -0.06) + (rnd(k + 3) - 0.5) * 0.12; pts.push([cx + Math.cos(a) * R * j, cy + Math.sin(a) * R * j]); }
    ctx.beginPath(); ctx.moveTo(cx, cy); for (const p of pts) ctx.lineTo(p[0], p[1]); ctx.closePath();
    ctx.fillStyle = o.tearBg || C.bg; ctx.fill();
    ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.strokeStyle = '#E4DCCB'; ctx.lineWidth = q * 0.5; ctx.lineJoin = 'round'; ctx.stroke();
  }
  ctx.restore();
}
/** the module centre (in canvas px) of module (r, c) for a qrCode drawn at (x, y, size), unrotated */
export const qrCell = (x, y, size, r, c) => { const q = size / (QN + 4); return [x - size / 2 + 2 * q + (c + 0.5) * q, y - size / 2 + 2 * q + (r + 0.5) * q]; };

/** camera viewfinder: four yellow corner brackets around a w-square at (x, y); p pops them; scanY 0..1 = laser line */
export function scanBrackets(x, y, w, p = 1, scanY = -1, col = GOLD) {
  if (p <= 0) return;
  const h = w / 2 * lerp(1.25, 1, p), L = w * 0.22;
  ctx.save(); ctx.globalAlpha = clamp(p); ctx.strokeStyle = col; ctx.lineWidth = Math.max(8, w * 0.035); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    ctx.beginPath(); ctx.moveTo(x + sx * h, y + sy * (h - L)); ctx.lineTo(x + sx * h, y + sy * h); ctx.lineTo(x + sx * (h - L), y + sy * h); ctx.stroke();
  }
  if (scanY >= 0 && scanY <= 1) { const yy = y - h + scanY * 2 * h; ctx.globalAlpha = 0.85; line([[x - h + 10, yy], [x + h - 10, yy]], C.red, Math.max(5, w * 0.015)); }
  ctx.restore();
}

/** phone screen content: camera view of a QR (for K.phone). found 0..1 slides up a link banner with url */
export function cameraScreen(t = 0, scanY = -1, found = 0, url = 'menu.cafe', seed = 1) {
  return () => {
    ctx.fillStyle = '#3A3F4A'; ctx.fillRect(-166, -350, 332, 700);
    ctx.fillStyle = '#4A505C'; ctx.fillRect(-166, 120, 332, 230);
    qrCode(0, -30, 230, { seed, outline: false });
    scanBrackets(0, -30, 260, 1, scanY);
    if (found > 0) {
      const y = lerp(420, 230, found);
      rr(-150, y - 50, 300, 100, 30); ctx.fillStyle = C.white; ctx.fill();
      circle(-100, y, 26, '#3A7BD5'); ctx.fillStyle = C.white; ctx.font = '900 26px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('↗', -100, y + 1);
      ctx.fillStyle = C.ink; ctx.font = '800 32px Inter'; ctx.textAlign = 'left'; ctx.fillText(url, -62, y + 2);
    }
  };
}

/** table sign / stand with a QR. s = 1 → 520 wide, ~760 tall; title on top. sticker 0..1 = a fake QR sticker
 *  sliding over the real one (peel 0..1 curls its corner) */
export function qrSign(x, y, s, title = 'SCAN TO PAY', o = {}) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-30, 330, 60, 120, 10); ctx.fillStyle = '#7C8391'; ctx.fill();
  rr(-150, 440, 300, 40, 20); ctx.fillStyle = '#7C8391'; ctx.fill();
  rr(-260, -380, 520, 720, 36); ctx.fillStyle = o.col || '#3A7BD5'; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(160, -380, 100, 720, [0, 36, 36, 0]); ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fill();
  ctx.fillStyle = C.white; ctx.font = '900 62px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(title, 0, -290);
  qrCode(0, 40, 400, { seed: o.seed || 1 });
  if (o.sticker > 0) {
    const sx = lerp(1100, 14, clamp(o.sticker)), pe = clamp(o.peel || 0);
    ctx.save(); ctx.translate(sx, 50); ctx.rotate(0.04);
    rr(-215, -215, 430, 430, 18); ctx.fillStyle = C.red; ctx.fill();
    qrCode(0, 0, 400, { seed: 9 });
    if (pe > 0) { ctx.beginPath(); ctx.moveTo(205, 205 - 120 * pe); ctx.lineTo(205 - 120 * pe, 205); ctx.lineTo(205 - 60 * pe, 205 - 60 * pe); ctx.closePath(); ctx.fillStyle = '#E4DCCB'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.stroke(); }
    ctx.restore();
  }
  ctx.restore();
}

/** cardboard box with a QR label (car parts). s = 1 → 420 wide */
export function partBox(x, y, s, seed = 3, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-210, -150); ctx.lineTo(-130, -230); ctx.lineTo(250, -230); ctx.lineTo(210, -150); ctx.closePath(); ctx.fillStyle = BOX_L; ctx.fill();
  ctx.beginPath(); ctx.moveTo(210, -150); ctx.lineTo(250, -230); ctx.lineTo(250, 120); ctx.lineTo(210, 200); ctx.closePath(); ctx.fillStyle = BOX_D; ctx.fill();
  rr(-210, -150, 420, 350, 6); ctx.fillStyle = BOX; ctx.fill();
  rr(-30, -150, 60, 350, 0); ctx.fillStyle = BOX_L; ctx.globalAlpha = 0.5; ctx.fill(); ctx.globalAlpha = 1;
  qrCode(-80, 40, 190, { seed, outline: false });
  ctx.restore();
}

/** flat Japan-style flag on a pole. s = 1 → 300x200 flag */
export function flag(x, y, s, wave = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-170, -110, 14, 420, 7); ctx.fillStyle = C.ink; ctx.fill(); circle(-163, -116, 14, GOLD);
  ctx.beginPath(); ctx.moveTo(-156, -100);
  for (let k = 0; k <= 10; k++) ctx.lineTo(-156 + k * 30, -100 + Math.sin(k * 0.7 + wave) * 8);
  for (let k = 10; k >= 0; k--) ctx.lineTo(-156 + k * 30, 100 + Math.sin(k * 0.7 + wave) * 8);
  ctx.closePath(); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  circle(-6, Math.sin(5 * 0.7 + wave) * 8, 58, C.red);
  ctx.restore();
}

/** a "fake link" warning badge for scam links: red circle with ! . s = 1 → r 80 */
export function alertBadge(x, y, s) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  circle(0, 0, 80, C.red); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.arc(0, 0, 80, 0, TAU); ctx.stroke();
  rr(-12, -52, 24, 66, 12); ctx.fillStyle = C.white; ctx.fill(); circle(0, 38, 13, C.white);
  ctx.restore();
}
