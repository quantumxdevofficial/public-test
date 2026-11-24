// (18/30) Monolith vs microservices components (kitchen / food-court analogy). Flat look: flat fills, one darker shade,
// ink outlines on graphics.
// foodIcon (pizza slice / sushi / cupcake), miniCook (tiny cook head with hat), fryer (deep fryer, broken = sparks + red),
// kitchenSmoke (grey puffs rising), bigKitchen (ONE big restaurant with three food windows sharing one roof; dark 0..1 = lights
// out), foodStall (a small food-court stall: awning, sign, window with food + n cooks; closed 0..1 pulls the shutter).
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

const STEEL = '#7A8494', STEEL_D = '#5E6775', GREY = '#8E949E', GREY_D = '#5F646E';

/** food icon. kind: 'pizza' | 'sushi' | 'cake'. s = 1 → ~120 px */
export function foodIcon(x, y, s, kind = 'pizza', rot = 0, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * sc, s * sc); ctx.lineJoin = 'round';
  if (kind === 'pizza') {
    ctx.beginPath(); ctx.moveTo(-62, -50); ctx.quadraticCurveTo(0, -78, 62, -50); ctx.lineTo(0, 64); ctx.closePath();
    ctx.fillStyle = '#F5C26B'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-50, -38); ctx.quadraticCurveTo(0, -60, 50, -38); ctx.lineTo(0, 50); ctx.closePath(); ctx.fillStyle = C.yellow; ctx.fill();
    for (const [px, py] of [[-20, -30], [18, -26], [0, 8]]) circle(px, py, 12, C.red);
  } else if (kind === 'sushi') {
    ell(0, 30, 66, 24, '#F3EFE6'); rr(-66, -10, 132, 40, 16); ctx.fillStyle = '#F3EFE6'; ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, -14, 70, 30, 0, 0, TAU); ctx.fillStyle = '#F29A6A'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
    for (const k of [-30, 0, 30]) line([[k - 10, -34], [k + 10, 6]], '#F7C4A3', 7);
    rr(-14, -12, 28, 52, 6); ctx.fillStyle = C.navy; ctx.fill();
  } else {
    ctx.beginPath(); ctx.moveTo(-50, 0); ctx.lineTo(50, 0); ctx.lineTo(36, 64); ctx.lineTo(-36, 64); ctx.closePath(); ctx.fillStyle = '#3A7BD5'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
    for (const k of [-24, 0, 24]) line([[k, 6], [k * 0.8, 58]], '#2F64AE', 6);
    circle(-28, -10, 30, C.pinkLight); circle(28, -10, 30, C.pinkLight); circle(0, -36, 34, C.pinkLight);
    circle(0, -70, 14, C.red);
  }
  ctx.restore();
}

/** a tiny cook head with a white hat (for windows / team badges). s = 1 → ~90 tall. b = bob offset */
export function miniCook(x, y, s, b = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y + b); ctx.scale(s, s);
  rr(-40, 30, 80, 40, [20, 20, 0, 0]); ctx.fillStyle = C.white; ctx.fill();
  circle(0, 0, 30, C.skin);
  circle(-16, -40, 20, C.white); circle(16, -40, 20, C.white); circle(0, -50, 24, C.white); rr(-26, -36, 52, 14, 4); ctx.fill();
  circle(-10, 0, 4, C.ink); circle(10, 0, 4, C.ink);
  ctx.restore();
}

/** grey smoke puffs rising from (x, y). a 0..1 */
export function kitchenSmoke(x, y, s, t = 0, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  for (let i = 0; i < 5; i++) { const p = (t * 0.7 + i / 5) % 1; circle(x + Math.sin(i * 2.3 + t * 2) * 30 * s, y - p * 260 * s, (30 + p * 46) * s, p > 0.5 ? '#B9BDC4' : GREY); }
  ctx.restore();
}

/** deep fryer (steel box, oil, basket handle). s = 1 → 300 wide. broken 0..1 → red light, sparks */
export function fryer(x, y, s, t = 0, broken = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-150, -60, 300, 260, 20); ctx.fillStyle = STEEL; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(110, -60, 40, 260, [0, 20, 20, 0]); ctx.fillStyle = STEEL_D; ctx.fill();
  rr(-120, -50, 240, 50, 12); ctx.fillStyle = '#E2A93A'; ctx.fill();
  line([[-60, -20], [-60, -150], [60, -150]], C.ink, 16);
  rr(-100, 60, 200, 100, 14); ctx.fillStyle = C.navy; ctx.fill();
  const on = broken > 0.5 ? (Math.sin(t * 16) > 0 ? C.red : '#7A1E28') : '#5BAE6A';
  circle(-40, 110, 22, on); circle(40, 110, 22, broken > 0.5 ? '#3A3A42' : C.yellow);
  if (broken > 0) {
    ctx.globalAlpha = clamp(broken); ctx.strokeStyle = C.yellow; ctx.lineCap = 'round'; ctx.lineWidth = 12;
    for (let i = 0; i < 6; i++) { const an = -Math.PI / 2 + (i - 2.5) * 0.4 + Math.sin(t * 20 + i) * 0.1, r0 = 170, r1 = 230 + 20 * Math.sin(t * 25 + i * 3);
      ctx.beginPath(); ctx.moveTo(Math.cos(an) * r0, Math.sin(an) * r0 - 20); ctx.lineTo(Math.cos(an) * r1, Math.sin(an) * r1 - 20); ctx.stroke(); }
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

/** ONE big restaurant: a long building with a shared roof sign, three food windows (pizza / sushi / cake) with cooks,
 *  one door. s = 1 → 780 wide x 600 tall centred on (x, y). food 0..3 = how many windows show food (fractional pops).
 *  dark 0..1 = power out (grey windows). sign = roof text */
export function bigKitchen(x, y, s, t = 0, food = 3, dark = 0, sign = 'KITCHEN', sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  const d = clamp(dark) > 0.5;
  rr(-390, -220, 780, 470, 24); ctx.fillStyle = d ? '#D9D4CA' : '#F7F4EE'; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  // roof + sign
  ctx.beginPath(); ctx.moveTo(-420, -210); ctx.lineTo(-340, -300); ctx.lineTo(340, -300); ctx.lineTo(420, -210); ctx.closePath(); ctx.fillStyle = d ? GREY_D : C.red; ctx.fill(); ctx.stroke();
  ctx.fillStyle = C.white; ctx.font = '900 64px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.letterSpacing = '4px'; ctx.fillText(sign, 0, -252); ctx.letterSpacing = '0px';
  const kinds = ['pizza', 'sushi', 'cake'];
  for (let i = 0; i < 3; i++) {
    const wx = -250 + i * 250;
    rr(wx - 105, -170, 210, 200, 14); ctx.fillStyle = d ? '#5F646E' : '#CFE8F3'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
    if (!d) miniCook(wx - 40, -80, 0.85, Math.sin(t * 6 + i * 2) * 4);
    const p = clamp(food - i);
    if (p > 0) foodIcon(wx + 50, -40, 0.62, kinds[i], 0, p < 1 ? lerp(0, 1.15, p) : 1);
    rr(wx - 115, 26, 230, 22, 8); ctx.fillStyle = d ? GREY_D : '#C8734A'; ctx.fill();
  }
  // one shared door
  rr(-70, 90, 140, 160, [16, 16, 0, 0]); ctx.fillStyle = d ? GREY_D : '#C8734A'; ctx.fill(); ctx.lineWidth = 8; ctx.stroke();
  circle(40, 170, 10, C.ink);
  // shared pipe (everything on one line)
  line([[-330, 140], [-150, 140]], d ? GREY_D : STEEL_D, 22); line([[150, 140], [330, 140]], d ? GREY_D : STEEL_D, 22);
  ctx.restore();
}

/** a food-court stall: striped awning, coloured sign, window with its one food + n cooks. s = 1 → 300 wide x 420 tall,
 *  centred on (x, y). closed 0..1 pulls a grey shutter down with a red CLOSED tag. kind = food */
export function foodStall(x, y, s, label = 'PIZZA', col = C.red, kind = 'pizza', t = 0, n = 1, closed = 0, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  rr(-150, -120, 300, 320, 16); ctx.fillStyle = '#F7F4EE'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-165, -210, 330, 64, 14); ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 7; ctx.stroke();
  ctx.fillStyle = C.white; ctx.font = '900 44px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.letterSpacing = '2px'; ctx.fillText(label, 0, -176); ctx.letterSpacing = '0px';
  for (let i = 0; i < 6; i++) { const ax = -165 + i * 55; ctx.beginPath(); ctx.moveTo(ax, -146); ctx.lineTo(ax + 55, -146); ctx.lineTo(ax + 55, -118); ctx.arc(ax + 27.5, -118, 27.5, 0, Math.PI); ctx.closePath(); ctx.fillStyle = i % 2 ? C.white : col; ctx.fill(); ctx.lineWidth = 5; ctx.stroke(); }
  rr(-120, -70, 240, 170, 12); ctx.fillStyle = '#CFE8F3'; ctx.fill(); ctx.lineWidth = 6; ctx.stroke();
  const nn = Math.max(0, n), k = Math.ceil(nn);
  for (let i = 0; i < k; i++) { const p = clamp(nn - i), cx = k === 1 ? 0 : lerp(-70, 70, i / (k - 1)); miniCook(cx, 10, (k > 2 ? 0.62 : 0.78) * (p < 1 ? lerp(0, 1.15, p) : 1), Math.sin(t * 6 + i * 1.7) * 4); }
  rr(-140, 96, 280, 28, 8); ctx.fillStyle = '#C8734A'; ctx.fill(); ctx.lineWidth = 6; ctx.stroke();
  foodIcon(0, 160, 0.5, kind);
  const c = clamp(closed);
  if (c > 0) {
    const h = 290 * c;
    rr(-150, -120, 300, h, [16, 16, 0, 0]); ctx.fillStyle = GREY; ctx.fill(); ctx.lineWidth = 8; ctx.stroke();
    for (let yy = -100; yy < -120 + h - 10; yy += 34) line([[-130, yy], [130, yy]], GREY_D, 6);
    if (c > 0.9) { ctx.save(); ctx.translate(0, 40); ctx.rotate(-0.08); rr(-120, -38, 240, 76, 16); ctx.fillStyle = C.red; ctx.fill(); ctx.lineWidth = 6; ctx.stroke();
      ctx.fillStyle = C.white; ctx.font = '900 46px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('CLOSED', 0, 3); ctx.restore(); }
  }
  ctx.restore();
}
