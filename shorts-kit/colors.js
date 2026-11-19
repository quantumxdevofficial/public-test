// Screen colour components (How Does Your Screen Make Every Color?): flat Inside Out look.
// rgbCss, subpixel, subpixelGrid, waterDrop, lens, dimmer, swatch, bigEye, colorBrain, beam
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

export const SUB = { r: '#E8313F', g: '#3CC85A', b: '#3A6FE8' };          // lit sub-pixel colours
const SUB_OFF = { r: '#4A2228', g: '#1F3A28', b: '#1E2848' };             // dark (off) tones
const PANEL = '#14161C';
const mixHex = (a, b, t) => { const p = (h) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16)); const A = p(a), B = p(b);
  return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], clamp(t)))).join(',')})`; };
/** css colour of a pixel mixing r, g, b levels 0..1 */
export const rgbCss = (r, g, b) => `rgb(${Math.round(clamp(r) * 255)},${Math.round(clamp(g) * 255)},${Math.round(clamp(b) * 255)})`;
const subCol = (k, v) => mixHex(SUB_OFF[k] === undefined ? '#000000' : hexOf(SUB_OFF[k]), hexOf(SUB[k]), v);
const hexOf = (h) => h;

/** one pixel: dark cell with three vertical sub-pixel bars. cell = width px; lv = [r, g, b] 0..1; pop 0..1 */
export function subpixel(x, y, cell, lv = [1, 1, 1], pop = 1, frame = true) {
  if (pop <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(pop, pop);
  if (frame) { rr(-cell / 2, -cell / 2, cell, cell, cell * 0.08); ctx.fillStyle = PANEL; ctx.fill(); }
  const bw = cell * 0.26, gap = cell * 0.06, h = cell * 0.82;
  ['r', 'g', 'b'].forEach((k, i) => {
    const bx = -cell / 2 + gap + i * (bw + gap) + cell * 0.01;
    rr(bx, -h / 2, bw, h, bw * 0.35); ctx.fillStyle = subCol(k, lv[i]); ctx.fill();
    if (lv[i] > 0.6) { rr(bx + bw * 0.18, -h / 2 + h * 0.06, bw * 0.22, h * 0.4, bw * 0.11); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fill(); }
  });
  ctx.restore();
}

/** a grid of pixels drawn as sub-pixels. fn(i, j) → [r, g, b] levels */
export function subpixelGrid(x, y, cols, rows, cell, fn, frame = true) {
  const x0 = x - (cols - 1) * cell / 2, y0 = y - (rows - 1) * cell / 2;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) subpixel(x0 + i * cell, y0 + j * cell, cell, fn(i, j), 1, frame);
}

/** a flat water droplet seen from the side, falling. s = 1 → ~120x170 */
export function waterDrop(x, y, s) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(0, -95); ctx.bezierCurveTo(30, -40, 62, 0, 62, 32); ctx.arc(0, 32, 62, 0, Math.PI); ctx.bezierCurveTo(-62, 0, -30, -40, 0, -95);
  ctx.fillStyle = '#7FCBEA'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = '#3E9BC4'; ctx.stroke();
  ell(-22, 20, 12, 24, 'rgba(255,255,255,0.75)', 0.3);
  ctx.restore();
}

/** a water-drop lens sitting on a screen: draws inside(…) clipped to a circle of radius r, then a rim + glint. p 0..1 grows it */
export function lens(x, y, r, p, inside) {
  if (p <= 0) return;
  const R = r * p;
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, R, 0, TAU); ctx.clip(); inside(); ctx.restore();
  ctx.beginPath(); ctx.arc(x, y, R, 0, TAU); ctx.lineWidth = 16; ctx.strokeStyle = '#7FCBEA'; ctx.stroke();
  ctx.beginPath(); ctx.arc(x, y, R + 9, 0, TAU); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.beginPath(); ctx.arc(x, y, R * 0.78, -2.6, -1.9); ctx.lineWidth = R * 0.07; ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.stroke();
}

/** a vertical brightness slider for one colour. k = 'r'|'g'|'b', v 0..1; shows the 0-255 number above. s = 1 → 150x560 */
export function dimmer(x, y, s, k, v, pop = 1, showNum = true) {
  if (pop <= 0 || s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * pop, s * pop);
  rr(-75, -280, 150, 560, 40); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-18, -230, 36, 440, 18); ctx.fillStyle = SUB_OFF[k]; ctx.fill();
  const hh = 440 * clamp(v); rr(-18, 210 - hh, 36, hh, 18); ctx.fillStyle = SUB[k]; ctx.fill();
  const ky = 210 - hh; circle(0, ky, 40, C.ink); circle(0, ky, 32, C.white); circle(-9, ky - 9, 9, '#E4E4E4');
  ctx.restore();
  if (showNum) { ctx.save(); ctx.font = '900 54px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.lineWidth = 12; ctx.lineJoin = 'round'; ctx.strokeStyle = C.ink; const tx = String(Math.round(clamp(v) * 255)), ty = y - 330 * s * pop;
    ctx.strokeText(tx, x, ty); ctx.fillStyle = SUB[k]; ctx.fillText(tx, x, ty); ctx.restore(); }
}

/** a round colour swatch (the mixed result). col = css colour */
export function swatch(x, y, r, col, pop = 1) {
  if (pop <= 0) return;
  circle(x, y, (r + 10) * pop, C.ink); circle(x, y, r * pop, col);
  ell(x - r * 0.35 * pop, y - r * 0.4 * pop, r * 0.22 * pop, r * 0.12 * pop, 'rgba(255,255,255,0.45)', -0.6);
}

/** a big flat eye (white almond, blue iris). s = 1 → ~360x220. look -1..1 moves the iris */
export function bigEye(x, y, s, look = 0, blink = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s * (1 - blink * 0.9));
  ctx.beginPath(); ctx.moveTo(-180, 0); ctx.quadraticCurveTo(0, -150, 180, 0); ctx.quadraticCurveTo(0, 150, -180, 0);
  ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.save(); ctx.clip(); circle(look * 40, 0, 74, '#3A7BD5'); circle(look * 40, 0, 56, '#2F67BE'); circle(look * 40, 0, 34, C.ink); circle(look * 40 - 20, -22, 14, C.white); ctx.restore();
  ctx.restore();
}

/** flat pink brain (two lobes with folds). s = 1 → ~360x260. pulse 0..1 */
export function colorBrain(x, y, s, pulse = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (1 + pulse * 0.06), s * (1 + pulse * 0.06));
  const blob = () => { ctx.beginPath(); ctx.ellipse(0, 0, 180, 130, 0, 0, TAU); };
  blob(); ctx.fillStyle = C.pinkDark; ctx.fill(); ctx.save(); ctx.translate(-6, -8); ctx.scale(0.96, 0.94); blob(); ctx.fillStyle = C.pink; ctx.fill(); ctx.restore();
  line([[0, -120], [6, -60], [-6, 0], [4, 60], [0, 118]], C.pinkDark, 10);
  for (const sd of [-1, 1]) {
    line([[sd * 40, -90], [sd * 80, -60], [sd * 60, -20]], C.pinkDark, 9);
    line([[sd * 120, -60], [sd * 100, 0], [sd * 140, 30]], C.pinkDark, 9);
    line([[sd * 40, 30], [sd * 90, 60], [sd * 60, 100]], C.pinkDark, 9);
  }
  ell(-90, -70, 34, 16, C.pinkLight, -0.4);
  ctx.restore();
}

/** a straight flat light beam from (x1,y1) to (x2,y2), u 0..1 how far it has travelled */
export function beam(x1, y1, x2, y2, col, u, w = 26) {
  if (u <= 0) return;
  line([[x1, y1], [lerp(x1, x2, u), lerp(y1, y2, u)]], C.ink, w + 10);
  line([[x1, y1], [lerp(x1, x2, u), lerp(y1, y2, u)]], col, w);
}
