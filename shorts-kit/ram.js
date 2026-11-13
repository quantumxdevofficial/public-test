// RAM components (desk = RAM, filing cabinet = storage). Same flat look: flat fills, one darker shade, ink outlines on graphics.
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

const WOOD = '#C8734A', WOOD_D = '#A85C38', WOOD_L = '#DA8E66', METAL = '#8E9AAB', METAL_D = '#6E7A8C', METAL_L = '#B4BFCC';
export const PAPER_COLS = ['#3A7BD5', '#E57A8A', '#5BAE6A', '#F29A3A', '#B07CD8', '#4FD1E8'];

/** a desk seen from the front. Origin = centre of the desk TOP surface. s = 1 → top is 760 wide; legs go down 420.
 *  Things "on the desk" sit at y = -14*s above the origin. */
export function desk(x, y, s, shake = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x + shake, y); ctx.scale(s, s);
  for (const lx of [-330, 290]) { rr(lx, 20, 40, 400, 10); ctx.fillStyle = WOOD_D; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke(); }
  rr(150, 40, 170, 200, 12); ctx.fillStyle = WOOD; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  for (const dy of [70, 160]) { rr(205, dy, 60, 14, 7); ctx.fillStyle = C.ink; ctx.fill(); }
  ctx.beginPath(); ctx.moveTo(150, 140); ctx.lineTo(320, 140); ctx.lineWidth = 6; ctx.stroke();
  rr(-380, -14, 760, 56, 14); ctx.fillStyle = WOOD; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-370, -6, 740, 14, 7); ctx.fillStyle = WOOD_L; ctx.fill();
  ctx.restore();
}

/** filing cabinet (3 drawers). Origin = centre bottom (on the floor). s = 1 → 360x680. open = 0..1 opens the TOP drawer */
export function fileCabinet(x, y, s, open = 0, label = null, shake = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x + shake, y); ctx.scale(s, s);
  rr(-180, -680, 360, 680, 22); ctx.fillStyle = METAL; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(110, -670, 60, 660, [0, 16, 16, 0]); ctx.fillStyle = METAL_D; ctx.fill();
  for (let i = 0; i < 3; i++) {
    const dy = -650 + i * 216, o = i === 0 ? open * 120 : 0;
    if (o > 0) { rr(-160, dy + 10, 320, 60, 10); ctx.fillStyle = METAL_D; ctx.fill();
      for (let k = 0; k < 5; k++) { rr(-130 + k * 55, dy - 30 - (k % 2) * 14, 44, 60, 6); ctx.fillStyle = PAPER_COLS[k]; ctx.fill(); } }
    rr(-160, dy + o * 0.3, 320, 196, 14); ctx.fillStyle = METAL_L; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
    rr(-50, dy + 40 + o * 0.3, 100, 30, 8); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 5; ctx.stroke();
    rr(-60, dy + 110 + o * 0.3, 120, 24, 12); ctx.fillStyle = C.ink; ctx.fill();
  }
  ctx.restore();
}

/** a sheet of work on the desk: white card with a coloured header bar and text lines. s = 1 → 160x200. Origin = centre */
export function paper(x, y, s, col = PAPER_COLS[0], rot = 0, a = 1) {
  if (s <= 0 || a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.globalAlpha = clamp(a);
  rr(-80, -100, 160, 200, 14); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-80, -100, 160, 50, [14, 14, 0, 0]); ctx.fillStyle = col; ctx.fill(); ctx.stroke();
  for (let i = 0; i < 4; i++) { rr(-56, -24 + i * 28, i === 3 ? 60 : 112, 12, 6); ctx.fillStyle = '#C9CDD6'; ctx.fill(); }
  ctx.restore();
}

/** a stack of n papers standing on the desk at (x, y = desk surface) */
export function paperStack(x, y, s, n, cols = PAPER_COLS, t = 0, wob = 0) {
  for (let i = 0; i < n; i++) paper(x + Math.sin(i * 2.3) * 8 * s + Math.sin(t * 14 + i) * wob, y - 100 * s - i * 26 * s, s, cols[i % cols.length], Math.sin(i * 1.7) * 0.06);
}

/** power plug + cable coming in from the left to (x, y). glow 0..1 yellow sparks; unplug 0..1 pulls it left */
export function plug(x, y, s, glow = 0, unplug = 0, t = 0) {
  ctx.save(); ctx.translate(x - unplug * 260 * s, y); ctx.scale(s, s);
  line([[-900, 60], [-300, 60], [-170, 0]], C.ink, 22);
  rr(-180, -60, 170, 120, 26); ctx.fillStyle = C.ink; ctx.fill();
  rr(-170, -48, 60, 96, 16); ctx.fillStyle = '#3A3A44'; ctx.fill();
  for (const py of [-26, 26]) { rr(-12, py - 10, 70, 20, 6); ctx.fillStyle = '#E6B82E'; ctx.fill(); }
  ctx.restore();
  if (glow > 0) { ctx.save(); ctx.globalAlpha = glow; for (let i = 0; i < 6; i++) { const an = i / 6 * TAU + t * 2; const r1 = 80 * s, r2 = (120 + 20 * Math.sin(t * 9 + i)) * s;
    line([[x + 70 * s + Math.cos(an) * r1, y + Math.sin(an) * r1], [x + 70 * s + Math.cos(an) * r2, y + Math.sin(an) * r2]], C.yellow, 12 * s); } ctx.restore(); }
}

/** wall socket the plug goes into. Origin = centre. s = 1 → 180x240 */
export function socket(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-90, -120, 180, 240, 26); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  for (const py of [-26, 26]) { rr(-24, py - 9, 48, 18, 6); ctx.fillStyle = C.ink; ctx.fill(); }
  ctx.restore();
}

/** round power button (⏻). on = 1 green ring, 0 grey; press 0..1 squashes */
export function powerButton(x, y, s, on = 1, press = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (1 - press * 0.08), s * (1 - press * 0.08));
  circle(0, 10, 150, '#9AA1AE'); circle(0, 0, 150, C.white); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.arc(0, 0, 150, 0, TAU); ctx.stroke();
  const col = on > 0.5 ? '#5BAE6A' : C.red;
  ctx.lineCap = 'round'; ctx.lineWidth = 26; ctx.strokeStyle = col;
  ctx.beginPath(); ctx.arc(0, 8, 70, -Math.PI / 2 + 0.6, -Math.PI / 2 - 0.6 + TAU); ctx.stroke();
  line([[0, -80], [0, 0]], col, 26);
  ctx.restore();
}

/** circular restart arrow. p 0..1 = how much of the circle is drawn (spins with t) */
export function restartArrow(x, y, s, p = 1, t = 0, col = '#5BAE6A') {
  if (s <= 0 || p <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(t * 4);
  const a1 = -Math.PI / 2, a2 = a1 + clamp(p) * TAU * 0.82;
  ctx.lineCap = 'round'; ctx.lineWidth = 46; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.arc(0, 0, 130, a1, a2); ctx.stroke();
  ctx.lineWidth = 30; ctx.strokeStyle = col; ctx.beginPath(); ctx.arc(0, 0, 130, a1, a2); ctx.stroke();
  ctx.save(); ctx.rotate(a2); ctx.translate(130, 0);
  ctx.beginPath(); ctx.moveTo(-58, 0); ctx.lineTo(58, 0); ctx.lineTo(0, 64); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.restore(); ctx.restore();
}

/** horizontal usage meter ("RAM 97%"). p 0..1 fill; turns red above 0.85. s = 1 → 640x90 */
export function memMeter(x, y, s, p, label = 'RAM', sc = 1) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  rr(-320, -45, 640, 90, 45); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  const w = 620 * clamp(p); if (w > 20) { rr(-310, -35, w, 70, 35); ctx.fillStyle = p > 0.85 ? C.red : '#5BAE6A'; ctx.fill(); }
  ctx.fillStyle = C.ink; ctx.font = '900 46px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(`${label} ${Math.round(clamp(p) * 100)}%`, 0, 3);
  ctx.restore();
}

/** a document card with a title and "UNSAVED" dot. fade 0..1 dissolves it into dots */
export function docCard(x, y, s, title = 'essay.doc', fade = 0, t = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.globalAlpha = 1 - clamp(fade);
  rr(-200, -260, 400, 520, 26); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-200, -260, 400, 90, [26, 26, 0, 0]); ctx.fillStyle = C.shirt; ctx.fill(); ctx.stroke();
  ctx.fillStyle = C.white; ctx.font = '900 40px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(title, 0, -214);
  for (let i = 0; i < 8; i++) { rr(-160, -130 + i * 44, i % 4 === 3 ? 180 : 320, 18, 9); ctx.fillStyle = '#C9CDD6'; ctx.fill(); }
  circle(160, -214, 16, C.red);
  ctx.restore();
  if (fade > 0) { ctx.save(); for (let i = 0; i < 26; i++) { const k = (i * 0.618) % 1, an = i * 2.4;
    const d = clamp(fade) * (120 + k * 260) * s; ctx.globalAlpha = clamp(fade * 2) * (1 - clamp(fade)) * 0.9 + 0.1 * (1 - clamp(fade));
    circle(x + Math.cos(an) * (d + k * 150 * s), y + Math.sin(an) * (d + k * 200 * s) - fade * 60 * s, (10 + k * 14) * s, i % 2 ? C.shirt : '#C9CDD6'); } ctx.restore(); }
}

/** sparkle star (4 points). a = alpha */
export function sparkleStar(x, y, s, a = 1, col = C.yellow) {
  if (a <= 0 || s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha = clamp(a);
  ctx.beginPath(); ctx.moveTo(0, -60); ctx.quadraticCurveTo(8, -8, 60, 0); ctx.quadraticCurveTo(8, 8, 0, 60); ctx.quadraticCurveTo(-8, 8, -60, 0); ctx.quadraticCurveTo(-8, -8, 0, -60);
  ctx.fillStyle = col; ctx.fill(); ctx.restore();
}

/** snail (slow!). s = 1 → ~260 wide. Origin = bottom centre */
export function snail(x, y, s, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-130, -40, 260, 40, 20); ctx.fillStyle = '#D9C27A'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
  line([[100, -36], [118, -100]], C.ink, 7); line([[120, -36], [150, -94]], C.ink, 7); circle(118, -104, 10, C.ink); circle(150, -98, 10, C.ink);
  circle(-10, -110, 90, C.pot); ctx.beginPath(); ctx.arc(-10, -110, 90, 0, TAU); ctx.stroke();
  ctx.beginPath(); for (let a = 0; a < TAU * 2.2; a += 0.1) { const r = 72 - a * 9; const px = -10 + Math.cos(a + t) * r, py = -110 + Math.sin(a + t) * r; a === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py); }
  ctx.strokeStyle = WOOD_D; ctx.lineWidth = 10; ctx.stroke();
  ctx.restore();
}
