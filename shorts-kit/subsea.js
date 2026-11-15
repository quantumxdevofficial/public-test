// Undersea internet cable components (How Does the Internet Cross the Ocean?). Flat Inside Out look:
// flat fills, one darker shade, one light highlight, ink outlines on graphics.
// cableSection, hoseEnd, fiber, lightFlash, repeater, shark, anchor, chain, trawler, net, memeCard, depthBand
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

const STEEL = '#AEB7C4', STEEL_D = '#8C96A5', COPPER = '#C8734A', JACKET = '#2E3B58', GEL = '#BFE3F2';
const HOSE = '#5BAE6A', HOSE_D = '#3F8A4E', GLASS = '#E3F4FA';
const SHARK = '#8C96A5', SHARK_D = '#6F7988', BELLY = '#E3E7EC';
const FIB = ['#3A7BD5', '#F29A3A', '#5BAE6A', '#D62839', '#FFFFFF', '#FFD43B', '#9B6BD6', '#E57A8A'];

/** cable cut end-on. s = 1 → radius 200. p 0..1 reveals the layers from outside in. t pulses the fibres */
export function cableSection(x, y, s, p = 1, t = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  circle(0, 0, 208, C.ink);
  circle(0, 0, 200, JACKET); ell(-60, -110, 70, 26, '#3E4D6E', -0.5);
  const L = (k) => clamp(p * 4 - k);
  if (L(0) > 0) { // steel armour wires
    circle(0, 0, 150, C.ink);
    const n = 22; for (let i = 0; i < n * L(0); i++) { const a = (i / n) * TAU; circle(Math.cos(a) * 128, Math.sin(a) * 128, 18, STEEL); circle(Math.cos(a) * 128 - 5, Math.sin(a) * 128 - 5, 6, '#D5DBE3'); }
  }
  if (L(1) > 0) { circle(0, 0, 104 * L(1), COPPER); circle(0, 0, 92 * L(1), '#A85D3A'); }
  if (L(2) > 0) { circle(0, 0, 80 * L(2), C.ink); circle(0, 0, 74 * L(2), GEL); }
  if (L(3) > 0) {
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU + 0.2, r = 40, fx = Math.cos(a) * r, fy = Math.sin(a) * r, q = clamp(L(3) * 8 - i);
      if (q <= 0) continue;
      const glow = 0.5 + 0.5 * Math.sin(t * 8 + i * 1.7);
      circle(fx, fy, 19 * q, `rgba(255,212,59,${0.25 + 0.35 * glow})`);
      circle(fx, fy, 12 * q, FIB[i]); circle(fx, fy, 5 * q, C.white);
    }
  }
  ctx.restore();
}
/** garden hose seen end-on (green ring, dark hole) with a short body trailing down. s = 1 → radius 200 */
export function hoseEnd(x, y, s) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-200, 0, 400, 520, 0); ctx.fillStyle = HOSE_D; ctx.fill();
  rr(-200, 0, 120, 520, 0); ctx.fillStyle = HOSE; ctx.fill();
  circle(0, 0, 208, C.ink); circle(0, 0, 200, HOSE); ell(-60, -110, 70, 26, '#7FCB8B', -0.5);
  circle(0, 0, 128, C.ink); circle(0, 0, 120, '#24402A');
  ctx.restore();
}
/** one glass fibre: thin bright strand from x0 to x1 at y (w px thick) */
export function fiber(x0, x1, y, w = 26, col = GLASS) {
  rr(x0, y - w / 2 - 5, x1 - x0, w + 10, (w + 10) / 2); ctx.fillStyle = C.ink; ctx.fill();
  rr(x0, y - w / 2, x1 - x0, w, w / 2); ctx.fillStyle = col; ctx.fill();
  rr(x0, y - w / 2 + 3, x1 - x0, w * 0.28, w * 0.14); ctx.fillStyle = C.white; ctx.fill();
}
/** a flash of light (yellow streak) centred at (x, y), len px long, a = brightness 0..1 */
export function lightFlash(x, y, len = 160, a = 1, h = 26) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(a);
  rr(x - len / 2 - 14, y - h / 2 - 14, len + 28, h + 28, (h + 28) / 2); ctx.fillStyle = 'rgba(255,212,59,0.35)'; ctx.fill();
  rr(x - len / 2, y - h / 2, len, h, h / 2); ctx.fillStyle = C.yellow; ctx.fill();
  rr(x - len / 6, y - h / 4, len / 2, h / 2, h / 4); ctx.fillStyle = C.white; ctx.fill();
  ctx.restore();
}
/** repeater pod sitting on a cable at (x, y). s = 1 → 300 wide. glow 0..1 lights its band */
export function repeater(x, y, s, glow = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-158, -62, 316, 124, 62); ctx.fillStyle = C.ink; ctx.fill();
  rr(-150, -54, 300, 108, 54); ctx.fillStyle = STEEL; ctx.fill();
  rr(-150, 10, 300, 44, [0, 0, 54, 54]); ctx.fillStyle = STEEL_D; ctx.fill();
  rr(-120, -40, 120, 18, 9); ctx.fillStyle = '#D5DBE3'; ctx.fill();
  if (glow > 0) { rr(-40, -66, 80, 132, 14); ctx.fillStyle = `rgba(255,212,59,${0.35 * glow})`; ctx.fill(); }
  rr(-26, -54, 52, 108, 8); ctx.fillStyle = glow > 0.3 ? C.yellow : '#7A8494'; ctx.fill();
  ctx.restore();
}
/** friendly flat shark facing right (flip -1 = left). s = 1 → ~560 long. bite 0..1 opens the jaw, t swims */
export function shark(x, y, s, flip = 1, t = 0, bite = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y + Math.sin(t * 3) * 6); ctx.scale(s * flip, s);
  const wag = Math.sin(t * 7) * 0.18;
  // tail
  ctx.save(); ctx.translate(-230, 0); ctx.rotate(wag);
  ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(-90, -110); ctx.lineTo(-60, 0); ctx.lineTo(-80, 80); ctx.closePath(); ctx.fillStyle = SHARK_D; ctx.fill();
  ctx.restore();
  // dorsal + pectoral fins
  ctx.beginPath(); ctx.moveTo(-40, -70); ctx.lineTo(10, -170); ctx.lineTo(60, -70); ctx.closePath(); ctx.fillStyle = SHARK_D; ctx.fill();
  ctx.beginPath(); ctx.moveTo(10, 40); ctx.lineTo(-60, 120); ctx.lineTo(70, 50); ctx.closePath(); ctx.fillStyle = SHARK_D; ctx.fill();
  // body
  ctx.beginPath(); ctx.moveTo(280, 0);
  ctx.quadraticCurveTo(220, -90, 40, -85); ctx.quadraticCurveTo(-150, -70, -240, 0);
  ctx.quadraticCurveTo(-150, 70, 40, 80); ctx.quadraticCurveTo(220, 80, 280, 0); ctx.closePath();
  ctx.fillStyle = SHARK; ctx.fill();
  ctx.save(); ctx.clip(); ell(40, 75, 260, 55, BELLY); ctx.restore();
  // gills
  for (let k = 0; k < 3; k++) line([[90 - k * 22, -30], [80 - k * 22, 20]], SHARK_D, 7);
  // mouth / jaw
  const o = clamp(bite) * 70;
  if (o > 2) {
    ctx.beginPath(); ctx.moveTo(270, 8); ctx.lineTo(150, 22); ctx.lineTo(160, 22 + o); ctx.lineTo(250, 14 + o * 0.6); ctx.closePath(); ctx.fillStyle = C.mouth; ctx.fill();
    for (let k = 0; k < 4; k++) { const tx = 165 + k * 24; ctx.beginPath(); ctx.moveTo(tx, 22); ctx.lineTo(tx + 10, 38); ctx.lineTo(tx + 20, 22); ctx.closePath(); ctx.fillStyle = C.white; ctx.fill(); }
  } else line([[255, 18], [180, 26]], C.ink, 7);
  // eye
  circle(190, -22, 17, C.white); circle(195, -22, 10, C.ink); circle(198, -26, 4, C.white);
  ctx.restore();
}
/** ship anchor, origin = ring at the top. s = 1 → ~420 tall */
export function anchor(x, y, s, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.lineCap = 'round';
  for (const [w, c] of [[50, C.ink], [36, STEEL_D]]) {
    ctx.lineWidth = w; ctx.strokeStyle = c;
    ctx.beginPath(); ctx.arc(0, 0, 34, 0, TAU); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, 36); ctx.lineTo(0, 380); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-100, 100); ctx.lineTo(100, 100); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 230, 160, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
  }
  for (const sx of [-1, 1]) { const px = Math.cos(sx > 0 ? 0.15 * Math.PI : 0.85 * Math.PI) * 160, py = 230 + Math.sin(0.15 * Math.PI) * 160;
    ctx.beginPath(); ctx.moveTo(px - sx * 10, py + 30); ctx.lineTo(px + sx * 40, py - 50); ctx.lineTo(px + sx * 50, py + 10); ctx.closePath(); ctx.fillStyle = C.ink; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke(); }
  line([[-8, 60], [-8, 360]], STEEL, 8);
  ctx.restore();
}
/** anchor chain from (x0, y0) down to (x1, y1) */
export function chain(x0, y0, x1, y1) {
  const n = Math.max(1, Math.floor(Math.hypot(x1 - x0, y1 - y0) / 36));
  for (let i = 0; i < n; i++) { const u = (i + 0.5) / n; ell(lerp(x0, x1, u), lerp(y0, y1, u), i % 2 ? 9 : 14, 20, i % 2 ? C.ink : STEEL_D); }
}
/** small fishing boat, origin = waterline centre. s = 1 → ~520 wide */
export function trawler(x, y, s, t = 0) {
  ctx.save(); ctx.translate(x, y + Math.sin(t * 2) * 6); ctx.rotate(Math.sin(t * 1.4) * 0.02); ctx.scale(s, s);
  line([[60, -60], [60, -300]], C.ink, 14); line([[60, -280], [230, -40]], C.ink, 6);
  rr(-170, -170, 170, 120, 14); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  for (let i = 0; i < 2; i++) { rr(-150 + i * 70, -145, 50, 40, 6); ctx.fillStyle = C.sky; ctx.fill(); }
  ctx.beginPath(); ctx.moveTo(-260, -60); ctx.lineTo(260, -60); ctx.lineTo(200, 50); ctx.lineTo(-220, 50); ctx.closePath();
  ctx.fillStyle = '#F29A3A'; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.fillStyle = '#C97A22'; ctx.beginPath(); ctx.moveTo(-240, 10); ctx.lineTo(225, 10); ctx.lineTo(200, 50); ctx.lineTo(-220, 50); ctx.closePath(); ctx.fill();
  ctx.restore();
}
/** fishing net dragged from (x0, y0) (the boat) to a mesh bag centred at (x1, y1), w wide */
export function net(x0, y0, x1, y1, w = 360, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  line([[x0, y0], [x1 + w / 2, y1 - 110]], C.ink, 6); line([[x0, y0], [x1 + w / 2, y1 + 110]], C.ink, 6);
  ctx.beginPath(); ctx.moveTo(x1 + w / 2, y1 - 110); ctx.lineTo(x1 - w / 2, y1 - 40); ctx.lineTo(x1 - w / 2, y1 + 40); ctx.lineTo(x1 + w / 2, y1 + 110); ctx.closePath();
  ctx.fillStyle = 'rgba(244,241,234,0.18)'; ctx.fill(); ctx.save(); ctx.clip();
  ctx.strokeStyle = '#F4F1EA'; ctx.lineWidth = 5;
  for (let k = -12; k < 12; k++) { ctx.beginPath(); ctx.moveTo(x1 - w / 2 + k * 40, y1 - 150); ctx.lineTo(x1 - w / 2 + k * 40 + 300, y1 + 150); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x1 - w / 2 + k * 40, y1 + 150); ctx.lineTo(x1 - w / 2 + k * 40 + 300, y1 - 150); ctx.stroke(); }
  ctx.restore();
  ctx.beginPath(); ctx.moveTo(x1 + w / 2, y1 - 110); ctx.lineTo(x1 - w / 2, y1 - 40); ctx.lineTo(x1 - w / 2, y1 + 40); ctx.lineTo(x1 + w / 2, y1 + 110); ctx.closePath();
  ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.restore();
}
/** a meme card: laughing face + "LOL". s = 1 → 300 x 340. mask = snorkel mask on */
export function memeCard(x, y, s, rot = 0, mask = false) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-158, -178, 316, 356, 30); ctx.fillStyle = C.ink; ctx.fill();
  rr(-150, -170, 300, 340, 24); ctx.fillStyle = C.white; ctx.fill();
  circle(0, -30, 105, C.yellow); circle(-30, -60, 30, '#FFE58A');
  if (mask) {
    rr(-90, -95, 180, 70, 30); ctx.fillStyle = C.ink; ctx.fill(); rr(-80, -87, 160, 54, 24); ctx.fillStyle = C.cyan; ctx.fill();
    rr(-70, -80, 50, 16, 8); ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fill();
    line([[105, -70], [125, -170]], C.ink, 22); line([[105, -70], [125, -170]], C.red, 12);
  } else {
    ctx.lineWidth = 12; ctx.strokeStyle = C.ink; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(-38, -50, 20, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    ctx.beginPath(); ctx.arc(38, -50, 20, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
  }
  ctx.beginPath(); ctx.arc(0, -10, 55, 0.05 * Math.PI, 0.95 * Math.PI); ctx.closePath(); ctx.fillStyle = C.mouth; ctx.fill();
  ctx.fillStyle = C.ink; ctx.font = '900 64px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('LOL', 0, 128);
  ctx.restore();
}
/** darker deep-water wash over the whole frame (a 0..1) */
export function depthBand(a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(a) * 0.55; ctx.fillStyle = '#0E1A2B'; ctx.fillRect(-300, -300, 1680, 2520); ctx.restore();
}
