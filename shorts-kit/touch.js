// Touchscreen components (How Does a Touchscreen Know Where You Touched?): flat Inside Out look.
// touchGrid, layerStack, glovedFinger, sausage, sausageTap, bolt, sparks, winterBg, snowfall, crosshair
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line, rnd } from './lib.js';

const WIRE = '#8FB3D9', WIRE_LIT = '#3A7BD5', GLASS = '#BFE3F2', KNIT = '#B8323F', KNIT_D = '#93242F', KNIT_L = '#D9535F';
const MEAT = '#C8734A', MEAT_D = '#A9552F', MEAT_L = '#E09A72', NIGHT = '#1E2A44', NIGHT_D = '#17213A';

/**
 * the see-through wire grid with a charge dot on every crossing.
 * centred at (x, y); cols x rows crossings, gap px apart. o = {
 *   grow 0..1 (wires draw in), wireA (wire alpha), charge(i, j) → 0..1 dot size (yellow), scanRow / scanCol (float index, lights a wire),
 *   hit: [i, j] red ring at that crossing, hitP 0..1 }
 */
export function touchGrid(x, y, cols, rows, gap, o = {}) {
  const { grow = 1, wireA = 1, charge = () => 1, scanRow = null, scanCol = null, hit = null, hitP = 0 } = o;
  const x0 = x - (cols - 1) * gap / 2, y0 = y - (rows - 1) * gap / 2, ext = gap * 0.5;
  ctx.save(); ctx.globalAlpha = wireA; ctx.lineCap = 'round';
  for (let j = 0; j < rows; j++) {                     // rows (horizontal wires)
    const lit = scanRow != null && Math.abs(scanRow - j) < 0.5, yy = y0 + j * gap, g = clamp(grow * 1.4 - j * 0.04);
    if (g <= 0) continue;
    line([[x0 - ext, yy], [lerp(x0 - ext, x0 + (cols - 1) * gap + ext, g), yy]], lit ? C.yellow : WIRE, lit ? 16 : 9);
  }
  for (let i = 0; i < cols; i++) {                     // columns (vertical wires)
    const lit = scanCol != null && Math.abs(scanCol - i) < 0.5, xx = x0 + i * gap, g = clamp(grow * 1.4 - 0.25 - i * 0.04);
    if (g <= 0) continue;
    line([[xx, y0 - ext], [xx, lerp(y0 - ext, y0 + (rows - 1) * gap + ext, g)]], lit ? C.yellow : WIRE_LIT, lit ? 16 : 9);
  }
  ctx.restore();
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const c = clamp(charge(i, j)); if (c <= 0.02) continue;
    const xx = x0 + i * gap, yy = y0 + j * gap, r = gap * 0.13 * c;
    circle(xx, yy, r + 5, C.ink); circle(xx, yy, r, C.yellow); circle(xx - r * 0.3, yy - r * 0.3, r * 0.3, C.white);
  }
  if (hit && hitP > 0) crosshair(x0 + hit[0] * gap, y0 + hit[1] * gap, hitP);
}
/** position of crossing (i, j) for a grid drawn with the same args */
export const gridXY = (x, y, cols, rows, gap, i, j) => [x - (cols - 1) * gap / 2 + i * gap, y - (rows - 1) * gap / 2 + j * gap];

/** red target ring + ticks. p 0..1 pops it in */
export function crosshair(x, y, p, col = C.red) {
  if (p <= 0) return;
  const r = 70 * (1.6 - 0.6 * clamp(p));
  ctx.save(); ctx.globalAlpha = clamp(p * 2); ctx.strokeStyle = col; ctx.lineWidth = 12; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
  for (let k = 0; k < 4; k++) { const a = k * TAU / 4; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * (r - 22), y + Math.sin(a) * (r - 22)); ctx.lineTo(x + Math.cos(a) * (r + 26), y + Math.sin(a) * (r + 26)); ctx.stroke(); }
  ctx.restore();
}

/** exploded phone screen: SCREEN (bottom), GRID (middle), GLASS (top) as tilted flat layers. sep 0..1 pulls them apart; lift 0..1 raises the glass further */
export function layerStack(x, y, s, sep = 1, lift = 0, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const gapY = lerp(30, 200, sep);
  const layer = (k, fn) => { ctx.save(); ctx.translate(0, gapY * (1 - k) + (k === 2 ? -lift * 120 : 0)); ctx.transform(1, 0, -0.55, 0.42, 0, 0); fn(); ctx.restore(); };
  // screen
  layer(0, () => {
    rr(-300, -330, 600, 660, 60); ctx.fillStyle = C.ink; ctx.fill();
    rr(-270, -300, 540, 600, 40); ctx.fillStyle = '#DCEEF6'; ctx.fill();
    const T = ['#3A7BD5', '#E57A8A', '#5BAE6A', '#C8734A', '#FFD43B', '#1F2A44'];
    let k = 0; for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { rr(-200 + c * 150 - 50, -220 + r * 140 - 50, 100, 100, 26); ctx.fillStyle = T[k++ % 6]; ctx.fill(); }
  });
  // grid
  layer(1, () => {
    ctx.lineCap = 'round';
    for (let j = 0; j < 7; j++) line([[-270, -270 + j * 90], [270, -270 + j * 90]], WIRE, 10);
    for (let i = 0; i < 6; i++) line([[-250 + i * 100, -300], [-250 + i * 100, 300]], WIRE_LIT, 10);
    for (let j = 0; j < 7; j++) for (let i = 0; i < 6; i++) circle(-250 + i * 100, -270 + j * 90, 13, C.yellow);
  });
  // glass
  layer(2, () => {
    ctx.globalAlpha = 0.55; rr(-300, -330, 600, 660, 60); ctx.fillStyle = GLASS; ctx.fill(); ctx.globalAlpha = 1;
    ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
    ctx.globalAlpha = 0.8; ctx.strokeStyle = C.white; ctx.lineCap = 'round';
    ctx.lineWidth = 34; ctx.beginPath(); ctx.moveTo(-200, -260); ctx.lineTo(-40, 120); ctx.stroke();
    ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(-100, -270); ctx.lineTo(40, 60); ctx.stroke();
    ctx.globalAlpha = 1;
  });
  ctx.restore();
}

/** a gloved fingertip (red knit) coming in from the bottom right to (x, y). Same geometry as tapFinger. */
export function glovedFinger(x, y, p, press = 0) {
  if (p <= 0) return;
  const ox = lerp(420, 0, p), oy = lerp(520, 0, p) + press * 14;
  ctx.save(); ctx.translate(x + ox, y + oy); ctx.rotate(-0.55);
  rr(-56, -6, 112, 540, 56); ctx.fillStyle = KNIT; ctx.fill();
  rr(18, -6, 38, 540, [0, 56, 0, 0]); ctx.fillStyle = KNIT_D; ctx.fill();
  ctx.save(); rr(-56, -6, 112, 540, 56); ctx.clip();
  for (let k = 0; k < 9; k++) { const yy = 60 + k * 50; ctx.strokeStyle = KNIT_L; ctx.lineWidth = 6; ctx.beginPath();
    for (let xx = -60; xx <= 60; xx += 20) ctx.lineTo(xx, yy + ((xx / 20) % 2 ? 10 : 0)); ctx.stroke(); }
  rr(-60, 380, 120, 60, 0); ctx.fillStyle = C.white; ctx.fill();
  ctx.restore();
  ctx.restore();
}

/** a snack sausage. s = 1 → ~360x80, rot in rad */
export function sausage(x, y, s, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  for (const sd of [-1, 1]) { line([[sd * 178, 0], [sd * 204, sd * -8]], MEAT_D, 12); circle(sd * 206, sd * -9, 9, MEAT_D); }
  rr(-180, -42, 360, 84, 42); ctx.fillStyle = MEAT; ctx.fill();
  rr(-180, 8, 360, 34, [0, 0, 42, 42]); ctx.fillStyle = MEAT_D; ctx.fill();
  rr(-140, -28, 230, 16, 8); ctx.fillStyle = MEAT_L; ctx.fill();
  for (const k of [-60, 30, 110]) circle(k, 0, 5, MEAT_D);
  ctx.restore();
}
/** a hand holding a sausage like a pen, sausage tip at (x, y), coming in from bottom right. p 0..1 = how far in */
export function sausageTap(x, y, p, press = 0) {
  if (p <= 0) return;
  const ox = lerp(420, 0, p), oy = lerp(520, 0, p) + press * 14;
  ctx.save(); ctx.translate(x + ox, y + oy); ctx.rotate(-0.55);
  sausage(0, 190, 1, Math.PI / 2);
  rr(-70, 250, 140, 300, 60); ctx.fillStyle = C.skin; ctx.fill();
  rr(24, 250, 46, 300, [0, 60, 0, 0]); ctx.fillStyle = C.skinShade; ctx.fill();
  for (const k of [270, 320]) { rr(-86, k, 60, 40, 20); ctx.fillStyle = C.skin; ctx.fill(); }
  ctx.restore();
}

/** flat lightning bolt. s = 1 → ~90x160 */
export function bolt(x, y, s, rot = 0, col = C.yellow) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(14, -80); ctx.lineTo(-42, 12); ctx.lineTo(-4, 12); ctx.lineTo(-16, 80); ctx.lineTo(44, -14); ctx.lineTo(6, -14); ctx.closePath();
  ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.restore();
}
/** little zig-zag sparks orbiting (x, y) at radius r. a 0..1 */
export function sparks(x, y, r, t, a = 1, n = 6) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(a); ctx.strokeStyle = C.yellow; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (let k = 0; k < n; k++) {
    const ang = k * TAU / n + t * 1.6, px = x + Math.cos(ang) * r, py = y + Math.sin(ang) * r * 0.9, flick = (Math.floor(t * 12 + k) % 3) === 0 ? 0.6 : 1;
    ctx.save(); ctx.translate(px, py); ctx.rotate(ang + Math.PI / 2); ctx.scale(flick, flick);
    ctx.beginPath(); ctx.moveTo(-26, -10); ctx.lineTo(-8, 8); ctx.lineTo(4, -8); ctx.lineTo(26, 10); ctx.stroke(); ctx.restore();
  }
  ctx.restore();
}

/** cold night background: navy sky, snowy ground */
export function winterBg() {
  ctx.fillStyle = NIGHT; ctx.fillRect(-300, -300, 1680, 2520);
  ctx.fillStyle = NIGHT_D; ctx.fillRect(-300, 1100, 1680, 1200);
  ell(540, 1180, 1100, 160, '#E8EEF5');
  ctx.fillStyle = '#E8EEF5'; ctx.fillRect(-300, 1180, 1680, 1200);
}
/** falling flat snow dots */
export function snowfall(t, n = 40, a = 1) {
  ctx.save(); ctx.globalAlpha = a;
  for (let k = 0; k < n; k++) {
    const sp = 80 + rnd(k) * 120, x = rnd(k + 40) * 1200 - 60 + Math.sin(t * 1.3 + k) * 30, y = ((rnd(k + 90) * 2100 + t * sp) % 2100) - 150;
    circle(x, y, 6 + rnd(k + 7) * 10, C.white);
  }
  ctx.restore();
}
