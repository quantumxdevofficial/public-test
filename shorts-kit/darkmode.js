// Dark mode components (Does Dark Mode Actually Save Battery?): flat Inside Out look.
// darkFeed, moon, modeToggle, lcdPanel, oledPanel, lcdLayers, powerMeter, brightSlider, studyCard
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

const mix = (a, b, t) => { const p = (h) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16)); const A = p(a), B = p(b);
  return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], clamp(t)))).join(',')})`; };
export const BACKLIGHT = '#FFE58A', BACKLIGHT_D = '#F5C842', PIX_LIT = '#F7F4EE', PIX_OFF = '#0A0A0D', LCD_BLACK = '#4A4636';
export const DM_GREEN = '#5BAE6A';

/** a social-feed app in screen-local coords (332x700 box). dark 0..1 blends light → dark theme */
export function darkFeed(dark = 0) {
  const bg = mix('#F2F2F5', '#000000', dark), card = mix('#FFFFFF', '#17171C', dark), bar = mix('#C9CAD2', '#3A3A44', dark), ttl = mix('#1A1A1E', '#F2F2F5', dark);
  ctx.fillStyle = bg; ctx.fillRect(-166, -350, 332, 700);
  ctx.fillStyle = ttl; ctx.font = '900 30px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('Feed', -140, -285);
  for (let k = 0; k < 3; k++) {
    const y = -235 + k * 195;
    rr(-146, y, 292, 175, 24); ctx.fillStyle = card; ctx.fill();
    circle(-108, y + 38, 22, ['#3A7BD5', '#E57A8A', DM_GREEN][k]);
    rr(-74, y + 26, 130, 14, 7); ctx.fillStyle = bar; ctx.fill();
    rr(-126, y + 78, 252, 14, 7); ctx.fill(); rr(-126, y + 106, 200, 14, 7); ctx.fill(); rr(-126, y + 134, 150, 14, 7); ctx.fill();
  }
}

/** flat crescent moon. r = radius; bg = colour behind it (used to cut the crescent) */
export function moon(x, y, r, col = C.yellow, bg = C.ink) {
  circle(x, y, r, col); circle(x + r * 0.45, y - r * 0.3, r * 0.8, bg);
}

/** dark mode switch. s = 1 → 240x120. on 0..1 slides the knob; sc pops it */
export function modeToggle(x, y, s, on = 0, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  rr(-120, -60, 240, 120, 60); ctx.fillStyle = mix('#C9CAD2', '#1F2A44', on); ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  const kx = lerp(-60, 60, clamp(on));
  circle(kx, 0, 46, C.white); circle(kx - 12, -12, 12, '#ECECEC');
  if (on > 0.5) moon(kx, 0, 26, C.yellow, C.white); else { circle(kx, 0, 18, C.yellow); for (let i = 0; i < 8; i++) { const a = i * TAU / 8; line([[kx + Math.cos(a) * 25, Math.sin(a) * 25], [kx + Math.cos(a) * 33, Math.sin(a) * 33]], C.yellow, 6); } }
  ctx.restore();
}

/** LCD front view: a grid of pixels lit from one backlight. fn(i,j) → 0 (black) .. 1 (white). glow 0..1 = backlight on.
 * black pixels still show a dim yellowish glow when the backlight is on (light leaks through). */
export function lcdPanel(x, y, cols, rows, cell, fn, glow = 1, t = 0) {
  const w = cols * cell, h = rows * cell, x0 = x - w / 2, y0 = y - h / 2;
  rr(x0 - 26, y0 - 26, w + 52, h + 52, 30); ctx.fillStyle = C.ink; ctx.fill();
  rr(x0 - 12, y0 - 12, w + 24, h + 24, 20); ctx.fillStyle = mix('#14161C', BACKLIGHT, glow * 0.55); ctx.fill();
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const v = fn(i, j), px = x0 + i * cell, py = y0 + j * cell;
    rr(px + cell * 0.08, py + cell * 0.08, cell * 0.84, cell * 0.84, cell * 0.16);
    ctx.fillStyle = glow <= 0 ? '#14161C' : v > 0.5 ? mix('#14161C', PIX_LIT, glow) : mix('#14161C', LCD_BLACK, glow); ctx.fill();
    if (glow > 0 && v <= 0.5) { ell(px + cell * 0.5, py + cell * 0.5, cell * 0.22, cell * 0.22, `rgba(255,229,138,${0.35 * glow * (0.8 + 0.2 * Math.sin(t * 5 + i + j))})`); }
  }
}

/** OLED front view: every pixel is its own little light. fn(i,j) → 0..1 brightness. off pixels are true black. */
export function oledPanel(x, y, cols, rows, cell, fn) {
  const w = cols * cell, h = rows * cell, x0 = x - w / 2, y0 = y - h / 2;
  rr(x0 - 26, y0 - 26, w + 52, h + 52, 30); ctx.fillStyle = C.ink; ctx.fill();
  rr(x0 - 12, y0 - 12, w + 24, h + 24, 20); ctx.fillStyle = PIX_OFF; ctx.fill();
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const v = clamp(fn(i, j)), px = x0 + i * cell, py = y0 + j * cell;
    rr(px + cell * 0.08, py + cell * 0.08, cell * 0.84, cell * 0.84, cell * 0.16);
    ctx.fillStyle = v <= 0.02 ? PIX_OFF : mix('#2A2A30', PIX_LIT, v); ctx.fill();
    if (v <= 0.02) { rr(px + cell * 0.08, py + cell * 0.08, cell * 0.84, cell * 0.84, cell * 0.16); ctx.lineWidth = 3; ctx.strokeStyle = '#1C1C22'; ctx.stroke(); }
    if (v > 0.6) { rr(px + cell * 0.2, py + cell * 0.18, cell * 0.24, cell * 0.12, cell * 0.06); ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fill(); }
  }
}

/** exploded side-ish view of an LCD: a yellow backlight sheet behind, the pixel sheet in front.
 * split 0..1 pulls the layers apart (backlight moves up-left); glow 0..1 lights the backlight + rays through the pixels */
export function lcdLayers(x, y, s, split = 1, glow = 0, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const dx = -150 * split, dy = -150 * split;
  // backlight sheet
  ctx.save(); ctx.translate(dx, dy);
  rr(-200, -300, 400, 600, 40); ctx.fillStyle = mix('#3A3A42', BACKLIGHT, glow); ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  if (glow > 0) { rr(-170, -270, 120, 30, 15); ctx.fillStyle = `rgba(255,255,255,${0.6 * glow})`; ctx.fill(); }
  ctx.restore();
  // light rays between the layers
  if (glow > 0 && split > 0.3) {
    ctx.save(); ctx.globalAlpha = glow * clamp((split - 0.3) / 0.4);
    for (let k = 0; k < 5; k++) { const yy = -220 + k * 110, ph = (t * 1.6 + k * 0.3) % 1;
      line([[dx + 40, yy + dy + 40], [lerp(dx + 40, 20, ph), lerp(yy + dy + 40, yy + 20, ph)]], BACKLIGHT_D, 14); }
    ctx.restore();
  }
  // pixel sheet (front)
  rr(-200, -300, 400, 600, 40); ctx.fillStyle = '#1B1D24'; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  for (let j = 0; j < 6; j++) for (let i = 0; i < 4; i++) {
    rr(-170 + i * 87, -270 + j * 92, 70, 72, 12);
    ctx.fillStyle = (i + j) % 3 === 0 ? mix('#2A2A30', LCD_BLACK, glow) : mix('#2A2A30', PIX_LIT, glow); ctx.fill();
  }
  ctx.restore();
}

/** semicircle power gauge. v 0..1 moves the needle (left = low, right = high). s = 1 → 360 wide */
export function powerMeter(x, y, s, v, label = 'POWER', sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  rr(-200, -200, 400, 290, 40); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.lineCap = 'butt'; ctx.lineWidth = 40;
  [[DM_GREEN, 0, 0.4], [C.yellow, 0.4, 0.7], [C.red, 0.7, 1]].forEach(([c, a, b]) => { ctx.beginPath(); ctx.arc(0, 30, 140, Math.PI + a * Math.PI, Math.PI + b * Math.PI); ctx.strokeStyle = c; ctx.stroke(); });
  const a = Math.PI + clamp(v) * Math.PI;
  line([[0, 30], [Math.cos(a) * 120, 30 + Math.sin(a) * 120]], C.ink, 14); circle(0, 30, 22, C.ink);
  ctx.fillStyle = C.ink; ctx.font = '900 40px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, 70 + 0);
  ctx.restore();
}

/** brightness slider: small sun left, big sun right, yellow fill up to v. w = track width */
export function brightSlider(x, y, w, v, sc = 1) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  rr(-w / 2 - 110, -70, w + 220, 140, 70); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  const sunI = (sx, r) => { circle(sx, 0, r, C.ink); for (let i = 0; i < 8; i++) { const a = i * TAU / 8; line([[sx + Math.cos(a) * r * 1.45, Math.sin(a) * r * 1.45], [sx + Math.cos(a) * r * 1.9, Math.sin(a) * r * 1.9]], C.ink, 6); } };
  sunI(-w / 2 - 55, 12); sunI(w / 2 + 55, 20);
  rr(-w / 2, -18, w, 36, 18); ctx.fillStyle = '#D9D4C8'; ctx.fill();
  const fw = w * clamp(v); rr(-w / 2, -18, Math.max(fw, 36), 36, 18); ctx.fillStyle = C.yellow; ctx.fill();
  const kx = -w / 2 + fw; circle(kx, 0, 38, C.ink); circle(kx, 0, 30, C.white);
  ctx.restore();
}

/** a study / lab report card with a bar chart. s = 1 → 400x500 */
export function studyCard(x, y, s, rot = 0, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * sc, s * sc);
  rr(-200, -250, 400, 500, 30); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-60, -275, 120, 50, 14); ctx.fillStyle = '#8A8F9C'; ctx.fill();
  ctx.fillStyle = C.ink; ctx.font = '900 44px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('STUDY', 0, -170);
  [0.85, 0.55, 0.3, 0.7].forEach((h, i) => { rr(-150 + i * 80, 170 - h * 260, 56, h * 260, 10); ctx.fillStyle = [C.shirt, C.yellow, DM_GREEN, C.pink][i]; ctx.fill(); });
  line([[-170, 175], [170, 175]], C.ink, 8);
  ctx.restore();
}
