// System Design series components (restaurant analogy). Same flat look: flat fills, one darker shade, ink outlines on graphics.
import { ctx, C, W, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

const GREEN = '#5BAE6A', GREEN_D = '#3F8A4E', WOOD = '#C8734A', WOOD_D = '#A65C38', STEEL = '#7A8494', STEEL_D = '#5E6775';

/** white chef hat sitting on the hero's head. Pass the hero's (x, y, s). drop 0..1 = how far it has dropped in */
export function chefHat(mx, my, s, drop = 1) {
  if (drop <= 0) return;
  ctx.save(); ctx.translate(mx, my + (-350 - 96) * s - (1 - drop) * 500); ctx.scale(s, s);
  rr(-100, -10, 200, 70, 14); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
  for (const [x, y, r] of [[-70, -60, 62], [70, -60, 62], [0, -95, 80]]) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = C.white; ctx.fill(); ctx.stroke(); }
  rr(-96, -40, 192, 60, 12); ctx.fillStyle = C.white; ctx.fill();
  line([[-60, 10], [-60, 52]], '#E4DCCB', 8); line([[0, 10], [0, 52]], '#E4DCCB', 8); line([[60, 10], [60, 52]], '#E4DCCB', 8);
  ctx.restore();
}

/** order ticket (paper slip). s = 1 → 150x200. done = green tick */
export function ticket(x, y, s, rot = 0, done = false) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-75, -100, 150, 200, 10); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-75, -100, 150, 40, [10, 10, 0, 0]); ctx.fillStyle = C.red; ctx.fill();
  for (let i = 0; i < 4; i++) line([[-50, -30 + i * 30], [i % 2 ? 20 : 45, -30 + i * 30]], '#C9C2B5', 10);
  if (done) { ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 16; ctx.strokeStyle = GREEN; ctx.beginPath(); ctx.moveTo(-30, 50); ctx.lineTo(-5, 75); ctx.lineTo(40, 25); ctx.stroke(); }
  ctx.restore();
}

/** stove + pan with flames. s = 1 → 520 wide counter top at y. fire 0..1 */
export function stove(x, y, s, t = 0, fire = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-260, 0, 520, 300, 16); ctx.fillStyle = STEEL; ctx.fill();
  rr(-260, 0, 520, 40, [16, 16, 0, 0]); ctx.fillStyle = STEEL_D; ctx.fill();
  rr(-200, 100, 400, 150, 12); ctx.fillStyle = C.navy; ctx.fill();
  for (const k of [-120, 0, 120]) circle(k, 60, 18, C.ink);
  if (fire > 0) for (let i = 0; i < 5; i++) {
    const fx = -80 + i * 40, h = (40 + 18 * Math.sin(t * 14 + i * 2)) * fire;
    ctx.beginPath(); ctx.moveTo(fx - 16, -6); ctx.quadraticCurveTo(fx, -6 - h * 1.6, fx + 16, -6); ctx.closePath(); ctx.fillStyle = '#F29A3A'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(fx - 8, -6); ctx.quadraticCurveTo(fx, -6 - h * 0.9, fx + 8, -6); ctx.closePath(); ctx.fillStyle = C.yellow; ctx.fill();
  }
  ell(0, -30, 150, 34, C.ink); ell(0, -36, 130, 24, '#3B3B44'); line([[140, -34], [300, -60]], C.ink, 22);
  ctx.restore();
}

/** a dish on a plate. s = 1 → plate 220 wide. col = food colour */
export function dish(x, y, s, col = '#F29A3A', steam = 0, t = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ell(0, 20, 110, 30, '#C9C2B5'); ell(0, 12, 110, 30, C.white); ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.ellipse(0, 12, 110, 30, 0, 0, TAU); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(0, 4, 70, 56, 0, Math.PI, TAU); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.stroke();
  ell(-26, -26, 18, 8, 'rgba(255,255,255,0.5)', -0.4);
  if (steam > 0) { ctx.globalAlpha = steam * 0.7; for (let i = -1; i <= 1; i++) { const p = (t * 0.8 + i * 0.3 + 1) % 1; ctx.beginPath(); ctx.moveTo(i * 30, -60 - p * 50); ctx.quadraticCurveTo(i * 30 + 16, -80 - p * 50, i * 30, -100 - p * 50); ctx.strokeStyle = '#C9C2B5'; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.stroke(); } ctx.globalAlpha = 1; }
  ctx.restore();
}

/** small restaurant/kitchen tile: a storefront with an awning and a tiny cook in the window. s = 1 → 260x300 (base at y + 150). lit 0..1 */
export function kitchenTile(x, y, s, t = 0, col = C.red, cook = true) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-130, -110, 260, 260, 14); ctx.fillStyle = '#F7F4EE'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
  // awning stripes
  for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-140 + i * 56, -110); ctx.lineTo(-84 + i * 56, -110); ctx.lineTo(-84 + i * 56, -70); ctx.arc(-112 + i * 56, -70, 28, 0, Math.PI); ctx.closePath(); ctx.fillStyle = i % 2 ? C.white : col; ctx.fill(); ctx.lineWidth = 5; ctx.stroke(); }
  rr(-140, -150, 280, 44, 10); ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 6; ctx.stroke();
  rr(-100, -20, 200, 130, 10); ctx.fillStyle = '#CFE8F3'; ctx.fill(); ctx.lineWidth = 6; ctx.stroke();
  if (cook) {
    const b = Math.sin(t * 6) * 4;
    circle(0, 40 + b, 30, C.skin); rr(-40, 70 + b, 80, 40, [20, 20, 0, 0]); ctx.fillStyle = C.white; ctx.fill();
    circle(-16, 0 + b, 20, C.white); circle(16, 0 + b, 20, C.white); circle(0, -10 + b, 24, C.white); rr(-26, 4 + b, 52, 14, 4); ctx.fill();
    circle(-10, 40 + b, 4, C.ink); circle(10, 40 + b, 4, C.ink);
  }
  ctx.restore();
}

/** host stand (podium). s = 1 → 220x300, origin = top centre */
export function hostStand(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-110, 0); ctx.lineTo(110, 0); ctx.lineTo(80, 300); ctx.lineTo(-80, 300); ctx.closePath(); ctx.fillStyle = WOOD; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(30, 0); ctx.lineTo(110, 0); ctx.lineTo(80, 300); ctx.lineTo(10, 300); ctx.closePath(); ctx.fillStyle = WOOD_D; ctx.fill();
  rr(-130, -26, 260, 30, 8); ctx.fillStyle = WOOD_D; ctx.fill(); ctx.stroke();
  ctx.restore();
}

/** a round table seen from the front with two chairs. s = 1 → 300 wide. state: 'free' (green sign) | 'busy' (red sign) | null */
export function table(x, y, s, state = null, sc = 1) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const sd of [-1, 1]) { rr(sd * 150 - 30, -40, 60, 120, 12); ctx.fillStyle = WOOD_D; ctx.fill(); }
  ell(0, -10, 150, 34, WOOD_D); ell(0, -18, 150, 32, WOOD); rr(-14, -10, 28, 110, 6); ctx.fillStyle = WOOD_D; ctx.fill(); ell(0, 100, 60, 14, WOOD_D);
  if (state && sc > 0) {
    ctx.save(); ctx.translate(0, -110); ctx.scale(sc, sc);
    circle(0, 0, 44, C.ink); circle(0, 0, 36, state === 'free' ? GREEN : C.red);
    ctx.fillStyle = C.white; ctx.font = '900 46px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(state === 'free' ? '✓' : '×', 0, 3);
    ctx.restore();
  }
  ctx.restore();
}

/** a pass-through shelf (heat lamp) with dishes ready. n dishes shown (fractional pops the next), skip = index left empty. s = 1 → 700 wide; dish i sits at (x + (-220 + i*220)*s, y + 10*s) */
export function readyShelf(x, y, s, n = 3, t = 0, skip = -1, cols = ['#F29A3A', '#5BAE6A', '#E57A8A', '#FFD43B']) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  line([[-300, -250], [-300, -200]], C.ink, 8); line([[300, -250], [300, -200]], C.ink, 8);
  rr(-350, -280, 700, 40, 12); ctx.fillStyle = STEEL_D; ctx.fill();
  for (const k of [-220, 0, 220]) { ctx.beginPath(); ctx.moveTo(k - 60, -200); ctx.lineTo(k + 60, -200); ctx.lineTo(k + 40, -240); ctx.lineTo(k - 40, -240); ctx.closePath(); ctx.fillStyle = STEEL; ctx.fill();
    ctx.globalAlpha = 0.25 + 0.08 * Math.sin(t * 5 + k); ctx.beginPath(); ctx.moveTo(k - 60, -200); ctx.lineTo(k + 90, 40); ctx.lineTo(k - 90, 40); ctx.closePath(); ctx.fillStyle = C.yellow; ctx.fill(); ctx.globalAlpha = 1; }
  rr(-350, 40, 700, 36, 10); ctx.fillStyle = STEEL; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  for (let i = 0; i < 3; i++) { const p = clamp(n - i); if (p > 0 && i !== skip) dish(-220 + i * 220, 10 - (1 - p) * 40, 0.8 * p, cols[i], 1, t); }
  ctx.restore();
}

/** stacked progress meter for "load": w x h at (x, y), level 0..1 (turns red above 0.75) */
export function loadMeter(x, y, w, h, level) {
  rr(x - w / 2, y - h / 2, w, h, 14); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
  const lv = clamp(level), ih = (h - 20) * lv;
  rr(x - w / 2 + 10, y + h / 2 - 10 - ih, w - 20, Math.max(0, ih), 8); ctx.fillStyle = lv > 0.75 ? C.red : lv > 0.45 ? C.yellow : GREEN; ctx.fill();
}
