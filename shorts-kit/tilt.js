// Inside Out: SCREEN ROTATION / ACCELEROMETER components. Flat fills, one darker shade, one highlight.
// Cyan only for the x-ray "inside the chip" view (mems).
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

const NAVY2 = '#2A2F3A', HILL = '#5BAE6A', HILL2 = '#3F8A4E', WOOD = '#C8946A', WOOD2 = '#A9744E', WOOD3 = '#DDAE84';

/** the accelerometer chip: small black package with pins and a tiny label. s = 1 → 220 x 220 */
export function accelChip(x, y, s, glow = 0, label = 'ACCEL') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (glow > 0) { ctx.save(); ctx.globalAlpha = 0.35 * glow; circle(0, 0, 190, C.yellow); ctx.restore(); }
  for (let k = -3; k <= 3; k++) for (const sgn of [-1, 1]) {
    rr(k * 26 - 7, sgn * 110 - (sgn < 0 ? 22 : 0), 14, 22, 3); ctx.fillStyle = '#B9BEC8'; ctx.fill();
    rr(sgn * 110 - (sgn < 0 ? 22 : 0), k * 26 - 7, 22, 14, 3); ctx.fill();
  }
  rr(-110, -110, 220, 220, 18); ctx.fillStyle = C.ink; ctx.fill();
  rr(-110, -110, 220, 40, [18, 18, 0, 0]); ctx.fillStyle = '#2A2A30'; ctx.fill();
  circle(-74, 70, 10, '#3A3A42');
  ctx.fillStyle = '#C9CFDA'; ctx.font = '900 40px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, 6);
  ctx.restore();
}

/** a grain of rice. s = 1 → 300 x 110 */
export function riceGrain(x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ell(0, 6, 150, 55, '#E4DCCB'); ell(0, 0, 150, 52, '#FBF8F1'); ell(-40, -20, 70, 12, C.white, -0.05);
  ctx.restore();
}

/** zig-zag spring from (x1,y1) to (x2,y2) */
function spring(x1, y1, x2, y2, n, amp, col, w) {
  const pts = [[x1, y1]], dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
  for (let i = 1; i < n * 2; i++) { const u = i / (n * 2), sgn = i % 2 ? 1 : -1; pts.push([x1 + dx * u + nx * amp * sgn, y1 + dy * u + ny * amp * sgn]); }
  pts.push([x2, y2]); line(pts, col, w);
}

/** MEMS accelerometer cutaway (x-ray, cyan). s = 1 → 760 x 920 frame. o = {
 *   dy: proof-mass shift in px (+ = down), rot: frame rotation, frame 0..1 (frame alpha), mass 0..1 (mass pops in),
 *   hiMass, hiSprings, hiMoving, hiFixed, hiGaps: 0..1 yellow highlights } */
export const MEMS_FINGERS = [-180, -90, 0, 90, 180];
export function mems(x, y, s, o = {}) {
  const dy = o.dy || 0, fa = o.frame ?? 1, ma = o.mass ?? 1;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s, s); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  // frame + fixed anchors
  ctx.save(); ctx.globalAlpha = fa;
  rr(-380, -460, 760, 920, 40); ctx.fillStyle = C.xnavy; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.cyan; ctx.stroke();
  const fixedCol = o.hiFixed ? C.yellow : C.cyan;
  for (const sg of [-1, 1]) {
    rr(sg * 330 - 25, -260, 50, 520, 10); ctx.fillStyle = C.cyan; ctx.globalAlpha = fa * 0.3; ctx.fill(); ctx.globalAlpha = fa; ctx.lineWidth = 7; ctx.strokeStyle = C.cyan; ctx.stroke();
    for (const fy of MEMS_FINGERS) {
      const yy = fy + 45, x0 = sg * 305, x1 = sg * 140;
      rr(Math.min(x0, x1), yy - 11, Math.abs(x0 - x1), 22, 8); ctx.fillStyle = fixedCol; ctx.globalAlpha = fa * (o.hiFixed ? 1 : 0.55); ctx.fill(); ctx.globalAlpha = fa;
    }
  }
  ctx.restore();
  // gaps (between each moving finger and the fixed finger below it)
  if (o.hiGaps > 0) {
    ctx.save(); ctx.globalAlpha = o.hiGaps;
    for (const sg of [-1, 1]) for (const fy of MEMS_FINGERS) {
      const top = fy + dy + 11, bot = fy + 45 - 11, xa = sg > 0 ? 150 : -295;
      if (bot > top) { ctx.fillStyle = C.yellow; ctx.fillRect(xa, top, 145, bot - top); }
    }
    ctx.restore();
  }
  // springs
  if (ma > 0) {
    ctx.save(); ctx.globalAlpha = Math.min(1, ma);
    const sc = o.hiSprings ? C.yellow : C.cyan;
    for (const sx of [-80, 80]) { spring(sx, -450, sx, -260 + dy, 5, 26, sc, o.hiSprings ? 10 : 8); spring(sx, 450, sx, 260 + dy, 5, 26, sc, o.hiSprings ? 10 : 8); }
    ctx.restore();
    // proof mass + moving fingers
    ctx.save(); ctx.translate(0, dy + (1 - Math.min(1, ma)) * -200); ctx.globalAlpha = Math.min(1, ma);
    const mc = o.hiMass ? C.yellow : C.cyan;
    for (const sg of [-1, 1]) for (const fy of MEMS_FINGERS) {
      const x0 = sg * 120, x1 = sg * 300;
      rr(Math.min(x0, x1), fy - 11, Math.abs(x1 - x0), 22, 8); ctx.fillStyle = o.hiMoving ? C.yellow : mc; ctx.fill();
    }
    rr(-130, -260, 260, 520, 22); ctx.fillStyle = o.hiMass ? C.yellow : '#2E6E86'; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = mc; ctx.stroke();
    for (let i = 0; i < 3; i++) for (let j = 0; j < 6; j++) { rr(-80 + i * 60 - 12, -210 + j * 80 - 12, 24, 24, 6); ctx.fillStyle = o.hiMass ? '#E0B520' : C.xnavy; ctx.fill(); }
    ctx.restore();
  }
  ctx.restore();
}

/** big gravity arrow pointing down (world), yellow with ink outline. len px, a alpha/scale */
export function gravArrow(x, y, len, a = 1, ang = Math.PI / 2) {
  if (a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang - Math.PI / 2); ctx.globalAlpha = clamp(a);
  const L = len * clamp(a * 1.2);
  ctx.beginPath(); ctx.moveTo(-26, 0); ctx.lineTo(26, 0); ctx.lineTo(26, L - 70); ctx.lineTo(66, L - 70); ctx.lineTo(0, L); ctx.lineTo(-66, L - 70); ctx.lineTo(-26, L - 70); ctx.closePath();
  ctx.fillStyle = C.yellow; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.restore();
}

/** a dial meter (electric signal). v 0..1 needle; bolt 0..1 shows a lightning bolt. s = 1 → 420 wide */
export function meter(x, y, s, v = 0, bolt = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-210, -170, 420, 300, 36); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 60, 160, Math.PI * 1.1, Math.PI * 1.9); ctx.lineWidth = 26; ctx.strokeStyle = '#E4DCCB'; ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 60, 160, Math.PI * 1.7, Math.PI * 1.9); ctx.strokeStyle = C.yellow; ctx.stroke();
  const a = Math.PI * lerp(1.15, 1.85, clamp(v));
  line([[0, 60], [Math.cos(a) * 140, 60 + Math.sin(a) * 140]], C.red, 14); circle(0, 60, 22, C.ink);
  if (bolt > 0) {
    ctx.save(); ctx.translate(150, -150); ctx.scale(bolt, bolt); ctx.rotate(0.15);
    ctx.beginPath(); ctx.moveTo(10, -90); ctx.lineTo(-50, 10); ctx.lineTo(0, 10); ctx.lineTo(-20, 90); ctx.lineTo(50, -20); ctx.lineTo(0, -20); ctx.closePath();
    ctx.fillStyle = C.yellow; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.restore();
  }
  ctx.restore();
}

/** phone screen showing a video that stays upright. phoneRot = the phone's rotation (rad);
 *  turned 0..1 = how far the picture has turned to match (1 = upright in the world, landscape-filled) */
export function rotVideoScreen(phoneRot = 0, turned = 0, t = 0) {
  ctx.fillStyle = C.navy; ctx.fillRect(-400, -400, 800, 800);
  ctx.save(); ctx.rotate(-phoneRot * turned);
  const k = clamp(Math.abs(Math.sin(phoneRot)) * turned), w = lerp(300, 690, k), h = lerp(190, 326, k), yy = lerp(-150, 0, k);
  ctx.save(); rr(-w / 2, yy - h / 2, w, h, 16); ctx.clip();
  ctx.fillStyle = C.sky; ctx.fillRect(-w / 2, yy - h / 2, w, h);
  circle(w * 0.25 + Math.sin(t * 2) * 10, yy - h * 0.2, h * 0.15, C.yellow);
  ell(-w * 0.2 + Math.sin(t) * 15, yy + h * 0.4, w * 0.45, h * 0.35, HILL); ell(w * 0.3, yy + h * 0.5, w * 0.4, h * 0.32, HILL2);
  ctx.restore();
  rr(-w / 2, yy + h / 2 + 18, w, 10, 5); ctx.fillStyle = '#3A4256'; ctx.fill();
  rr(-w / 2, yy + h / 2 + 18, w * (0.3 + (t * 0.03) % 0.5), 10, 5); ctx.fillStyle = C.red; ctx.fill();
  if (k < 0.5) { ctx.globalAlpha = 1 - k * 2; for (let i = 0; i < 3; i++) { rr(-150, 60 + i * 70, 90, 54, 10); ctx.fillStyle = NAVY2; ctx.fill(); rr(-48, 66 + i * 70, 190 - i * 30, 14, 7); ctx.fillStyle = '#4A5268'; ctx.fill(); } }
  ctx.restore();
}

/** screen with an arrow that always points to world-down (gravity). phoneRot = phone rotation, a = alpha */
export function gravityScreen(phoneRot = 0, a = 1, pulse = 0) {
  ctx.fillStyle = C.xnavy; ctx.fillRect(-400, -400, 800, 800);
  ctx.save(); ctx.globalAlpha = 0.35; ctx.strokeStyle = C.cyan; ctx.lineWidth = 4;
  for (let i = -4; i <= 4; i++) { line([[i * 80, -400], [i * 80, 400]], C.cyan, 3); line([[-400, i * 80], [400, i * 80]], C.cyan, 3); }
  ctx.restore();
  if (a > 0) { ctx.save(); ctx.rotate(-phoneRot); ctx.scale(1 + pulse * 0.08, 1 + pulse * 0.08); gravArrow(0, -150, 300, a); ctx.restore(); }
}

/** side view of a table with a phone slab lying on it. drop 0..1 lowers the phone onto the top. Top surface at y */
export function tableSide(x, y, s, drop = 1, glowScreen = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-420, 30, 50, 520, 10); ctx.fillStyle = WOOD2; ctx.fill(); rr(370, 30, 50, 520, 10); ctx.fill();
  rr(-500, 0, 1000, 50, 14); ctx.fillStyle = WOOD; ctx.fill(); rr(-500, 0, 1000, 14, [14, 14, 0, 0]); ctx.fillStyle = WOOD3; ctx.fill();
  const py = lerp(-420, -34, clamp(drop)), tilt = (1 - clamp(drop)) * -0.35;
  ctx.save(); ctx.translate(0, py); ctx.rotate(tilt);
  rr(-260, 0, 520, 34, 16); ctx.fillStyle = C.ink; ctx.fill();
  rr(-246, -6, 492, 12, 6); ctx.fillStyle = glowScreen > 0 ? C.sky : '#3A4256'; ctx.fill();
  ctx.restore();
  ctx.restore();
}

/** top view of a wooden table surface (fills the frame) */
export function tableTop() {
  ctx.fillStyle = WOOD; ctx.fillRect(-300, -300, 1680, 2520);
  for (let i = 0; i < 14; i++) { ctx.fillStyle = i % 2 ? WOOD2 : WOOD3; ctx.globalAlpha = 0.35; ctx.fillRect(-300, -300 + i * 180 + 60, 1680, 10); }
  ctx.globalAlpha = 1;
}

/** "rotate" icon: two curved arrows in a circle (yellow). sc pop */
export function rotateIcon(x, y, s, sc = 1, spin = 0) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc); ctx.rotate(spin); ctx.lineCap = 'round';
  circle(0, 0, 150, C.white); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.arc(0, 0, 150, 0, TAU); ctx.stroke();
  for (const r0 of [0, Math.PI]) {
    for (const [w, c] of [[34, C.ink], [20, C.yellow]]) { ctx.beginPath(); ctx.arc(0, 0, 90, r0 + 0.3, r0 + 2.5); ctx.lineWidth = w; ctx.strokeStyle = c; ctx.stroke(); }
    const a = r0 + 2.5, hx = Math.cos(a) * 90, hy = Math.sin(a) * 90;
    ctx.save(); ctx.translate(hx, hy); ctx.rotate(a + Math.PI / 2);
    ctx.beginPath(); ctx.moveTo(0, -34); ctx.lineTo(40, 0); ctx.lineTo(0, 34); ctx.closePath(); ctx.fillStyle = C.yellow; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.restore();
  }
  ctx.restore();
}
