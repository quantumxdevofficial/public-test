// Noise-cancelling components (headphones, cupXray, earCanal, spikyWave, waveSum, jetEngine, planeWindow, pilotCap, mathCard, micGlow)
import { ctx, C, W, H, TAU, lerp, clamp, rnd, rr, circle, ell, line } from './lib.js';

export const NOISE_RED = C.red, ANTI_BLUE = '#3A7BD5', CALM_GREEN = '#5BAE6A';
const CUP = '#2A3142', CUP_L = '#3C4560', CUSH = '#1A1A1E';

/** over-ear headphones, front view, centred on a HEAD centre (x, y). s = 1 fits the hero's head at s = 1
 *  (head radius ~110). For K.man({x, y, s}) call headphones(x, y - 350 * s, s). on 0..1 drops them down from above. */
export function headphones(x, y, s, on = 1, glow = 0) {
  if (on <= 0) return;
  ctx.save(); ctx.translate(x, y - (1 - on) * 260 * s); ctx.scale(s, s); ctx.globalAlpha = clamp(on * 1.6);
  ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(0, -10, 150, Math.PI * 1.04, Math.PI * 1.96); ctx.strokeStyle = CUSH; ctx.lineWidth = 34; ctx.stroke();
  ctx.beginPath(); ctx.arc(0, -10, 150, Math.PI * 1.1, Math.PI * 1.9); ctx.strokeStyle = CUP_L; ctx.lineWidth = 14; ctx.stroke();
  for (const sd of [-1, 1]) {
    rr(sd * 150 - 34, -70, 68, 150, 30); ctx.fillStyle = CUSH; ctx.fill();
    rr(sd * 150 - 26 + sd * 16, -84, 60, 178, 28); ctx.fillStyle = CUP; ctx.fill();
    rr(sd * 150 - 12 + sd * 22, -60, 16, 120, 8); ctx.fillStyle = CUP_L; ctx.fill();
    if (glow > 0) { ctx.save(); ctx.globalAlpha = glow; circle(sd * 176, -64, 9, C.yellow); ctx.restore(); }
  }
  ctx.restore();
}

/** big x-ray cutaway of one ear cup, ear side on the RIGHT. 520x700 at s = 1, centred.
 *  o = { mic, chip, spk } 0..1 glow each part; t animates the speaker cone */
export const CUP_PARTS = { mic: [-205, -170], chip: [-60, 40], spk: [120, 0] };
export function cupXray(x, y, s, o = {}, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  // shell: rounded D shape, flat side (cushion) on the right
  rr(-250, -330, 470, 660, [220, 60, 60, 220]); ctx.fillStyle = 'rgba(79,209,232,0.08)'; ctx.fill();
  ctx.lineWidth = 12; ctx.strokeStyle = C.cyan; ctx.stroke();
  rr(200, -300, 70, 600, 34); ctx.fillStyle = 'rgba(79,209,232,0.18)'; ctx.fill(); ctx.lineWidth = 8; ctx.stroke();
  // wires mic -> chip -> speaker
  ctx.globalAlpha = 0.6; line([[-205, -140], [-205, 40], [-110, 40]], C.cyan, 6); line([[-10, 40], [60, 40], [60, 0], [80, 0]], C.cyan, 6); ctx.globalAlpha = 1;
  // mic capsule (outside facing left)
  const [mx, my] = CUP_PARTS.mic, mg = o.mic || 0;
  if (mg > 0) { ctx.save(); ctx.globalAlpha = mg * 0.45; circle(mx, my, 70, C.yellow); ctx.restore(); }
  rr(mx - 34, my - 26, 68, 52, 22); ctx.fillStyle = C.xnavy; ctx.fill(); ctx.strokeStyle = mg > 0.5 ? C.yellow : C.cyan; ctx.lineWidth = 8; ctx.stroke();
  for (const k of [-12, 0, 12]) line([[mx - 18, my + k], [mx + 18, my + k]], mg > 0.5 ? C.yellow : C.cyan, 4);
  // chip
  const [cx, cy] = CUP_PARTS.chip, cg = o.chip || 0;
  if (cg > 0) { ctx.save(); ctx.globalAlpha = cg * 0.45; circle(cx, cy, 95, C.yellow); ctx.restore(); }
  for (let i = -2; i <= 2; i++) { line([[cx + i * 18, cy - 62], [cx + i * 18, cy - 48]], C.cyan, 6); line([[cx + i * 18, cy + 48], [cx + i * 18, cy + 62]], C.cyan, 6); line([[cx - 62, cy + i * 18], [cx - 48, cy + i * 18]], C.cyan, 6); line([[cx + 48, cy + i * 18], [cx + 62, cy + i * 18]], C.cyan, 6); }
  rr(cx - 50, cy - 50, 100, 100, 14); ctx.fillStyle = cg > 0.5 ? C.yellow : C.xnavy; ctx.fill(); ctx.strokeStyle = cg > 0.5 ? C.yellow : C.cyan; ctx.lineWidth = 8; ctx.stroke();
  rr(cx - 26, cy - 26, 52, 52, 8); ctx.strokeStyle = cg > 0.5 ? C.ink : C.cyan; ctx.lineWidth = 5; ctx.stroke();
  // speaker cone, facing the ear (right)
  const [sx, sy] = CUP_PARTS.spk, sg = o.spk || 0, push = Math.sin(t * 40) * 8 * sg;
  ctx.beginPath(); ctx.moveTo(sx - 30, sy - 50); ctx.lineTo(sx + 50 + push, sy - 150); ctx.lineTo(sx + 50 + push, sy + 150); ctx.lineTo(sx - 30, sy + 50); ctx.closePath();
  ctx.fillStyle = 'rgba(79,209,232,0.15)'; ctx.fill(); ctx.strokeStyle = C.cyan; ctx.lineWidth = 8; ctx.stroke();
  rr(sx - 60, sy - 50, 34, 100, 10); ctx.fillStyle = C.cyan; ctx.fill();
  ctx.restore();
}

/** side cutaway of an ear canal ending in a pink eardrum on the right. Canal opening at (x, y). vib 0..1 = how hard the drum shakes */
export function earCanal(x, y, s, vib = 0, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // outer ear lump
  ell(-30, 0, 120, 260, C.skin); ell(-10, 0, 80, 200, C.skinShade);
  rr(-20, -90, 420, 180, 90); ctx.fillStyle = C.skinShade; ctx.fill();
  rr(-20, -70, 400, 140, 70); ctx.fillStyle = '#F2D2BE'; ctx.fill();
  // eardrum
  const b = Math.sin(t * 30) * 22 * vib;
  ctx.beginPath(); ctx.moveTo(380, -80); ctx.quadraticCurveTo(380 + b, 0, 380, 80); ctx.lineWidth = 26; ctx.strokeStyle = C.pinkDark; ctx.lineCap = 'round'; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(380, -80); ctx.quadraticCurveTo(380 + b, 0, 380, 80); ctx.lineWidth = 14; ctx.strokeStyle = C.pink; ctx.stroke();
  ctx.restore();
}

/** jagged, unpredictable wave (voices, sudden sounds) from x0 to x1 at y. seed picks the shape; phase scrolls */
export function spikyWave(x0, x1, y, amp, seed = 1, phase = 0, col = C.red, w = 12, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); const n = 34;
  for (let i = 0; i <= n; i++) {
    const k = Math.floor(i + phase * 6), v = (rnd(k * 3.1 + seed) * 2 - 1) * (0.35 + rnd(k * 1.7 + seed * 2) * 0.65);
    const X = lerp(x0, x1, i / n), Y = y + v * amp * (i === 0 || i === n ? 0 : 1);
    i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y);
  }
  ctx.stroke(); ctx.restore();
}

/** two waves that slide together and add up: m 0..1 merges them into their sum (flat line when anti = 1).
 *  Draws noise (red) at y - gap, anti (blue) at y + gap; at m = 1 both lie on y and the sum shows (green). */
export function waveSum(x0, x1, y, amp, freq, phase, gap, m, anti = 1) {
  const g = gap * (1 - m);
  const pts = (yy, sgn, A) => { ctx.beginPath(); for (let i = 0; i <= 240; i++) { const u = i / 240, X = lerp(x0, x1, u), Y = yy + sgn * Math.sin(u * freq * TAU + phase) * A; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } };
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const fade = 1 - clamp((m - 0.75) / 0.25);
  ctx.globalAlpha = fade; ctx.lineWidth = 14;
  pts(y - g, 1, amp * (1 - m * 0.9)); ctx.strokeStyle = NOISE_RED; ctx.stroke();
  pts(y + g, -anti, amp * (1 - m * 0.9)); ctx.strokeStyle = ANTI_BLUE; ctx.stroke();
  if (m > 0.6) { ctx.globalAlpha = clamp((m - 0.6) / 0.3); pts(y, 1, amp * (1 - anti) * 0.5); ctx.strokeStyle = CALM_GREEN; ctx.lineWidth = 18; ctx.stroke(); }
  ctx.restore();
}

/** flat jet engine, front view. s = 1 → radius 230. t spins the fan */
export function jetEngine(x, y, s, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  circle(0, 0, 240, '#8E9AAB'); circle(0, 0, 214, '#B4BFCC'); circle(0, 0, 190, '#2A3142');
  ctx.save(); ctx.rotate(t * 9);
  for (let i = 0; i < 14; i++) { ctx.save(); ctx.rotate(i * TAU / 14); ctx.beginPath(); ctx.moveTo(10, -8); ctx.quadraticCurveTo(110, -40, 182, -16); ctx.lineTo(182, 14); ctx.quadraticCurveTo(110, 4, 10, 10); ctx.closePath(); ctx.fillStyle = '#6E7A8C'; ctx.fill(); ctx.restore(); }
  ctx.restore();
  circle(0, 0, 50, '#B4BFCC'); ell(-14, -16, 18, 10, C.white);
  ell(-150, -150, 40, 18, 'rgba(255,255,255,0.5)', -0.8);
  ctx.restore();
}

/** oval airplane window with clouds sliding past. s = 1 → 300x420 */
export function planeWindow(x, y, s, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-170, -230, 340, 460, 150); ctx.fillStyle = '#D8CCB4'; ctx.fill();
  rr(-140, -200, 280, 400, 130); ctx.fillStyle = C.sky; ctx.fill();
  ctx.save(); rr(-140, -200, 280, 400, 130); ctx.clip();
  for (let i = 0; i < 4; i++) { const cx = ((rnd(i) * 600 - t * 260 + i * 200) % 600 + 600) % 600 - 300, cy = -120 + i * 90; ell(cx, cy, 70, 26, C.white); ell(cx + 40, cy - 14, 44, 24, C.white); }
  ctx.restore();
  ctx.restore();
}

/** pilot cap drawn on a head centre (same convention as headphones). s = hero scale */
export function pilotCap(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-120, -86); ctx.quadraticCurveTo(-130, -190, 0, -196); ctx.quadraticCurveTo(130, -190, 120, -86); ctx.closePath(); ctx.fillStyle = C.pants; ctx.fill();
  rr(-124, -100, 248, 30, 12); ctx.fillStyle = C.ink; ctx.fill();
  ell(0, -76, 120, 22, C.ink); ell(0, -82, 116, 16, '#2A3142');
  circle(0, -140, 22, C.yellow); circle(0, -140, 10, '#E0B22A');
  ctx.restore();
}

/** small boom mic on the right side of a headset (head-centre convention) */
export function boomMic(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-170, 30); ctx.quadraticCurveTo(-140, 110, -40, 92); ctx.strokeStyle = CUSH; ctx.lineWidth = 12; ctx.stroke();
  ell(-36, 92, 22, 16, CUSH);
  ctx.restore();
}

/** notepad with the idea: red wave + blue flipped wave = flat green line. p 0..1 writes it in stages. s = 1 → 640x760 */
export function mathCard(x, y, s, p = 1, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-320, -380, 640, 760, 30); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.globalAlpha = 0.25; for (let k = 0; k < 10; k++) line([[-280, -270 + k * 68], [280, -270 + k * 68]], C.shirt, 3); ctx.globalAlpha = 1;
  for (let k = 0; k < 6; k++) { circle(-240 + k * 96, -380, 16, C.ink); }
  const pa = clamp(p * 3), pb = clamp(p * 3 - 1), pc = clamp(p * 3 - 2);
  const part = (yy, sgn, col, q) => { if (q <= 0) return; ctx.save(); ctx.beginPath(); ctx.rect(-260, yy - 80, 520 * q, 160); ctx.clip(); ctx.strokeStyle = col; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); for (let i = 0; i <= 120; i++) { const u = i / 120, X = lerp(-240, 240, u), Y = yy + sgn * Math.sin(u * 2.5 * TAU) * 55; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke(); ctx.restore(); };
  part(-230, 1, NOISE_RED, pa);
  if (pb > 0) { ctx.fillStyle = C.ink; ctx.font = '900 80px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.globalAlpha = clamp(pb * 3); ctx.fillText('+', 0, -110); ctx.globalAlpha = 1; }
  part(0, -1, ANTI_BLUE, pb);
  if (pc > 0) { ctx.fillStyle = C.ink; ctx.font = '900 80px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.globalAlpha = clamp(pc * 3); ctx.fillText('=', 0, 120); ctx.globalAlpha = 1; }
  if (pc > 0) { ctx.save(); ctx.beginPath(); ctx.rect(-260, 160, 520 * pc, 160); ctx.clip(); line([[-240, 240], [240, 240]], CALM_GREEN, 16); ctx.restore(); }
  ctx.restore();
}
