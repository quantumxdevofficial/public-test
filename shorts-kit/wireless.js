// WIRELESS CHARGING components (How Does Wireless Charging Actually Work?): flat Inside Out look.
// chargePad (top-down), padXray, coil + coilAt + currentDots, fieldLoops (side-view magnetic field), padSide, phoneSide,
// phoneBack (with x-ray coil), chargeBattery, heatRise, magnetRing, toothbrush (with x-ray coils), wallPlug, contactPins
// Copper = the coils. Cyan only for the x-ray "inside the device" views. Blue field lines (wifi WAVE blue).
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

export const COPPER = '#D9853B', COPPER_D = '#A85E22', COPPER_L = '#F2B27A', FIELD = '#3A7BD5';
const PAD = '#2A2A30', PAD_L = '#3A3A44', PAD_D = '#1E1E24', LED = '#5BAE6A', STEEL = '#AEB7C4', STEEL_D = '#8C96A5';

// ───────── coils ─────────
/** point on a flat spiral coil of outer radius r with `turns` turns, u 0 (inside) .. 1 (outside) */
export function coilAt(x, y, r, turns, u) {
  const a = u * turns * TAU - Math.PI / 2, rad = lerp(r * 0.28, r, u);
  return [x + Math.cos(a) * rad, y + Math.sin(a) * rad];
}
/** flat spiral coil of copper wire. p 0..1 = how much is drawn (from the outside in); glow 0..1 = yellow hot glow */
export function coil(x, y, r, turns = 6, p = 1, glow = 0, w = 0) {
  if (p <= 0 || r <= 0) return;
  const lw = w || Math.max(6, r / turns * 0.42), N = Math.ceil(turns * 64);
  const path = () => { ctx.beginPath(); let first = true; for (let i = N; i >= 0; i--) { const u = i / N; if (u < 1 - p) break; const [px, py] = coilAt(x, y, r, turns, u); if (first) { ctx.moveTo(px, py); first = false; } else ctx.lineTo(px, py); } };
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  path(); ctx.strokeStyle = COPPER_D; ctx.lineWidth = lw + 6; ctx.stroke();
  path(); ctx.strokeStyle = glow > 0 ? mix(COPPER, '#FFD43B', glow) : COPPER; ctx.lineWidth = lw; ctx.stroke();
  path(); ctx.strokeStyle = COPPER_L; ctx.globalAlpha = 0.55; ctx.lineWidth = lw * 0.3; ctx.stroke();
  ctx.restore();
}
function mix(a, b, t) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.round(lerp(v, pb[i], clamp(t))).toString(16).padStart(2, '0')).join('');
}
/** yellow current dots running along the spiral. phase = signed distance travelled (flip its direction to show AC) */
export function currentDots(x, y, r, turns, phase, a = 1, n = 18, size = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(a);
  const sz = size || Math.max(7, r / turns * 0.3);
  for (let k = 0; k < n; k++) {
    const u = (((k / n + phase) % 1) + 1) % 1, [px, py] = coilAt(x, y, r, turns, u);
    circle(px, py, sz + 3, C.ink); circle(px, py, sz, C.yellow);
  }
  ctx.restore();
}

// ───────── the charging pad ─────────
/** top-down charging pad (round puck). s = 1 → radius 280. led 0..1 lights the charge LED */
export function chargePad(x, y, s, led = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ell(14, 22, 290, 290, 'rgba(0,0,0,0.12)');
  circle(0, 0, 280, PAD_D); circle(0, -6, 272, PAD);
  circle(0, -6, 210, PAD_L); circle(0, -6, 196, PAD);
  ell(-110, -150, 60, 22, 'rgba(255,255,255,0.10)', -0.6);
  circle(0, 236, 12, led > 0.5 ? LED : '#55555E');
  ctx.restore();
}
/** the pad seen through its lid (x-ray). reveal 0..1 fades the lid away; coil drawn with p = coilP */
export function padXray(x, y, s, reveal = 1, coilP = 1, glow = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  circle(0, 0, 280, C.cyan); circle(0, 0, 268, C.xnavy);
  ctx.save(); ctx.strokeStyle = 'rgba(79,209,232,0.25)'; ctx.lineWidth = 3;
  for (let k = -260; k <= 260; k += 52) { line([[k, -Math.sqrt(268 * 268 - k * k)], [k, Math.sqrt(268 * 268 - k * k)]], 'rgba(79,209,232,0.18)', 3); }
  ctx.restore();
  coil(0, 0, 200, 6, coilP, glow);
  // lead wires to the edge
  if (coilP > 0.95) { line([[200 * 0.28 * 0 + 0, -200 * 0.28], [-20, -150]], COPPER_D, 10); }
  ctx.restore();
  if (reveal < 1) { ctx.save(); ctx.globalAlpha = 1 - reveal; chargePad(x, y, s, 0); ctx.restore(); }
}

// ───────── side views (cross-section) ─────────
/** wire cross-sections of a flat coil seen from the side: a row of copper dots either side of the centre */
export function coilSide(x, y, r, turns = 5, glow = 0, rr_ = 0) {
  const d = rr_ || Math.max(8, r / turns * 0.38);
  for (let i = 0; i < turns; i++) {
    const off = lerp(r * 0.28, r, turns === 1 ? 1 : i / (turns - 1));
    for (const sx of [-1, 1]) { circle(x + sx * off, y, d + 3, COPPER_D); circle(x + sx * off, y, d, glow > 0 ? mix(COPPER, '#FFD43B', glow) : COPPER); }
  }
}
/** charging pad from the side, cut open: slab with the coil row inside. s=1 → 560 wide, top surface at y - 40 */
export function padSide(x, y, s, glow = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-280, -40, 560, 90, 36); ctx.fillStyle = PAD_D; ctx.fill();
  rr(-280, -40, 560, 70, 36); ctx.fillStyle = PAD; ctx.fill();
  rr(-240, -22, 480, 40, 18); ctx.fillStyle = C.xnavy; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.cyan; ctx.stroke();
  coilSide(0, -2, 200, 6, glow, 11);
  ctx.restore();
}
/** phone from the side, cut open: slab with a coil row near the back (bottom) and a battery. top-of-coil y = y + 14*s */
export function phoneSide(x, y, s, glow = 0, level = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-230, -34, 460, 68, 26); ctx.fillStyle = C.ink; ctx.fill();
  rr(-216, -24, 432, 48, 16); ctx.fillStyle = C.xnavy; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.cyan; ctx.stroke();
  // battery block (top half)
  rr(-170, -18, 340, 16, 6); ctx.fillStyle = '#3B4A5E'; ctx.fill();
  if (level > 0) { rr(-170, -18, 340 * clamp(level), 16, 6); ctx.fillStyle = LED; ctx.fill(); }
  coilSide(0, 12, 150, 5, glow, 8);
  ctx.restore();
}
/** magnetic field loops around a coil centred at (x, y), seen from the side. h = height reach, w = width,
 *  phase = flow offset (sign flips direction), a = alpha, k = how many loops grown (0..n) */
export function fieldLoops(x, y, w, h, phase = 0, a = 1, grow = 1, n = 3, col = FIELD) {
  if (a <= 0 || grow <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(a); ctx.strokeStyle = col; ctx.lineWidth = 12; ctx.lineCap = 'round';
  ctx.setLineDash([34, 22]); ctx.lineDashOffset = -phase * 140;
  for (let k = 1; k <= n; k++) {
    const g = clamp(grow * n - (k - 1)); if (g <= 0) continue;
    const ax = (w / 2) * k / n, ry = h * (0.55 + 0.45 * k / n) * g;
    for (const sx of [-1, 1]) {
      ctx.beginPath(); ctx.ellipse(x + sx * ax, y, ax, ry, 0, 0, TAU);
      if (sx < 0) { ctx.save(); ctx.lineDashOffset = phase * 140; ctx.stroke(); ctx.restore(); } else ctx.stroke();
    }
  }
  ctx.restore();
}
/** N / S pole tags either side of the coil (flip = which way the field points now) */
export function poles(x, yTop, yBot, flip, s = 1) {
  const tg = (txt, y, bg) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); circle(0, 0, 46, C.ink); circle(0, 0, 38, bg); ctx.fillStyle = C.white; ctx.font = '900 46px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 3); ctx.restore(); };
  tg(flip ? 'S' : 'N', yTop, flip ? FIELD : C.red); tg(flip ? 'N' : 'S', yBot, flip ? C.red : FIELD);
}

// ───────── phone back + battery ─────────
/** phone seen from the back. xr 0..1 = x-ray reveal showing the receiver coil + battery. coil glow 0..1 */
export function phoneBack(x, y, s, xr = 0, glow = 0, rot = 0, coilP = 1) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-190, -380, 380, 760, 64); ctx.fillStyle = C.ink; ctx.fill();
  rr(-176, -366, 352, 732, 52); ctx.fillStyle = '#3B4A6B'; ctx.fill();
  rr(-176, -366, 120, 732, [52, 0, 0, 52]); ctx.fillStyle = '#4A5B80'; ctx.fill();
  // camera bump
  rr(-150, -340, 150, 150, 40); ctx.fillStyle = '#2F3B57'; ctx.fill(); circle(-110, -300, 30, C.ink); circle(-40, -300, 30, C.ink); circle(-110, -230, 30, C.ink);
  circle(-110, -300, 12, '#55607A'); circle(-40, -300, 12, '#55607A'); circle(-110, -230, 12, '#55607A');
  if (xr > 0) {
    ctx.save(); ctx.globalAlpha = clamp(xr);
    rr(-176, -170, 352, 536, [0, 0, 52, 52]); ctx.fillStyle = C.xnavy; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.cyan; ctx.stroke();
    rr(-140, -140, 280, 470, 20); ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(79,209,232,0.55)'; ctx.stroke();
    ctx.restore();
    ctx.save(); ctx.globalAlpha = clamp(xr * 1.4 - 0.4); coil(0, 90, 130, 6, coilP, glow, 11); ctx.restore();
  }
  ctx.restore();
}
/** battery icon. s=1 → 300x150. level 0..1; bolt shows when charging */
export function chargeBattery(x, y, s, level, bolt = true, col = LED) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-150, -75, 300, 150, 28); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 14; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(156, -30, 26, 60, [0, 12, 12, 0]); ctx.fillStyle = C.ink; ctx.fill();
  if (level > 0) { rr(-132, -57, 264 * clamp(level), 114, 16); ctx.fillStyle = level < 0.2 ? C.red : col; ctx.fill(); }
  if (bolt) {
    ctx.beginPath(); ctx.moveTo(10, -60); ctx.lineTo(-34, 8); ctx.lineTo(-4, 8); ctx.lineTo(-14, 60); ctx.lineTo(34, -10); ctx.lineTo(4, -10); ctx.closePath();
    ctx.fillStyle = C.yellow; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.lineJoin = 'round'; ctx.stroke();
  }
  ctx.restore();
}
/** red wavy heat lines rising from (x, y). a 0..1 */
export function heatRise(x, y, s, t, a = 1, n = 3) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(a); ctx.strokeStyle = C.red; ctx.lineWidth = 12 * s; ctx.lineCap = 'round';
  for (let k = 0; k < n; k++) {
    const ox = x + (k - (n - 1) / 2) * 70 * s, rise = ((t * 0.9 + k * 0.33) % 1);
    ctx.save(); ctx.globalAlpha = clamp(a) * (1 - rise);
    ctx.beginPath();
    for (let i = 0; i <= 20; i++) { const v = i / 20, py = y - rise * 60 * s - v * 150 * s, px = ox + Math.sin(v * 9 + t * 6 + k) * 16 * s; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.stroke(); ctx.restore();
  }
  ctx.restore();
}
/** ring of magnets (alternating red / steel blocks). p 0..1 pops them in one by one */
export function magnetRing(x, y, r, p = 1, s = 1) {
  if (p <= 0) return;
  const n = 18;
  for (let k = 0; k < n; k++) {
    const g = clamp(p * n - k); if (g <= 0) continue;
    const a = k / n * TAU - Math.PI / 2;
    ctx.save(); ctx.translate(x + Math.cos(a) * r, y + Math.sin(a) * r); ctx.rotate(a + Math.PI / 2); ctx.scale(g * s, g * s);
    rr(-22, -14, 44, 28, 6); ctx.fillStyle = C.ink; ctx.fill();
    rr(-18, -10, 18, 20, [4, 0, 0, 4]); ctx.fillStyle = C.red; ctx.fill();
    rr(0, -10, 18, 20, [0, 4, 4, 0]); ctx.fillStyle = STEEL; ctx.fill();
    ctx.restore();
  }
}

// ───────── toothbrush ─────────
/** electric toothbrush standing on its charging base. (x, y) = base centre. xr 0..1 x-ray shows both coils; glow coils */
export function toothbrush(x, y, s, xr = 0, lift = 0, glow = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // base
  rr(-150, -40, 300, 100, 40); ctx.fillStyle = '#DCE3EA'; ctx.fill();
  rr(-150, 20, 300, 40, [0, 0, 40, 40]); ctx.fillStyle = '#C3CCD6'; ctx.fill();
  rr(-34, -110, 68, 90, 18); ctx.fillStyle = '#C3CCD6'; ctx.fill();   // the charging post
  if (xr > 0) {
    ctx.save(); ctx.globalAlpha = clamp(xr);
    rr(-34, -110, 68, 90, 18); ctx.fillStyle = C.xnavy; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.cyan; ctx.stroke();
    for (let k = 0; k < 4; k++) { ell(0, -96 + k * 20, 30, 9, COPPER_D); ell(0, -98 + k * 20, 26, 6, glow > 0 ? mix(COPPER, '#FFD43B', glow) : COPPER); }
    ctx.restore();
  }
  // handle (slides up by lift)
  ctx.save(); ctx.translate(0, -lift);
  rr(-60, -720, 120, 620, 56); ctx.fillStyle = C.white; ctx.fill();
  rr(20, -720, 40, 620, [0, 56, 56, 0]); ctx.fillStyle = '#E4E8EE'; ctx.fill();
  circle(0, -520, 24, C.pink); circle(0, -520, 12, C.pinkLight);
  // neck + head
  rr(-20, -980, 40, 280, 18); ctx.fillStyle = C.white; ctx.fill();
  rr(-34, -1090, 68, 130, 26); ctx.fillStyle = C.white; ctx.fill();
  for (let k = 0; k < 4; k++) { rr(-46, -1078 + k * 28, 18, 20, 6); ctx.fillStyle = k % 2 ? C.sky : C.white; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#B9C3CE'; ctx.stroke(); }
  if (xr > 0) {
    ctx.save(); ctx.globalAlpha = clamp(xr);
    rr(-50, -330, 100, 220, 30); ctx.fillStyle = C.xnavy; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.cyan; ctx.stroke();
    rr(-24, -320, 48, 110, 10); ctx.fillStyle = '#3B4A5E'; ctx.fill(); rr(-24, -260, 48, 50, [0, 0, 10, 10]); ctx.fillStyle = LED; ctx.fill();
    for (let k = 0; k < 4; k++) { ell(0, -186 + k * 20, 42, 10, COPPER_D); ell(0, -188 + k * 20, 38, 7, glow > 0 ? mix(COPPER, '#FFD43B', glow) : COPPER); }
    ctx.restore();
  }
  ctx.restore();
  ctx.restore();
}

// ───────── plug ─────────
/** a wall plug with its cable trailing down. s=1 → 180 wide */
export function wallPlug(x, y, s, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-40, -170, 22, 80, 6); ctx.fillStyle = STEEL; ctx.fill(); rr(18, -170, 22, 80, 6); ctx.fill();
  rr(-90, -100, 180, 170, 34); ctx.fillStyle = C.ink; ctx.fill();
  rr(-90, -100, 60, 170, [34, 0, 0, 34]); ctx.fillStyle = '#2E2E36'; ctx.fill();
  ctx.lineCap = 'round'; ctx.strokeStyle = C.ink; ctx.lineWidth = 30;
  ctx.beginPath(); ctx.moveTo(0, 60); ctx.bezierCurveTo(0, 200, 120, 180, 110, 320); ctx.stroke();
  ctx.restore();
}
