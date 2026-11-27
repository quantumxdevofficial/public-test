// Inside Out: RATE LIMITING components (speed-limit style sign, ferris wheel ride, ride gate with turnstile,
// little bot icon, refresh arrow, app screens: feed with refresh button / 429 error screen).
// Flat fills, one darker shade, one light highlight, ink outlines only on graphics.
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

const GREEN = '#5BAE6A', BLUE = '#3A7BD5', ORANGE = '#F29A3A', PURPLE = '#8A63D2', STEEL = '#8D99A6', STEEL_D = '#6B7785';
const txt = (s, x, y, size, col, ls = 2) => { ctx.fillStyle = col; ctx.font = `900 ${size}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.letterSpacing = `${ls}px`; ctx.fillText(s, x, y); ctx.letterSpacing = '0px'; };

/** round speed-limit style sign on a post: red ring, big number, small unit. s = 1 → sign r 230, post to y+520 */
export function limitSign(x, y, s, num = '100', unit = 'PER MIN', sc = 1, post = true) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  if (post) { rr(-22, 150, 44, 380, 10); ctx.fillStyle = STEEL_D; ctx.fill(); rr(-22, 150, 16, 380, 8); ctx.fillStyle = STEEL; ctx.fill(); }
  circle(0, 0, 238, C.ink); circle(0, 0, 228, C.red); circle(0, 0, 178, C.white);
  ell(-70, -120, 46, 18, 'rgba(255,255,255,0.35)', -0.5);
  txt(String(num), 0, -18, num.length > 2 ? 150 : 180, C.ink, 0);
  txt(unit, 0, 100, 44, C.ink, 3);
  ctx.restore();
}

/** a ferris wheel. s = 1 → wheel r 330, hub at (x, y), legs down to y+470. t turns it; cabins stay upright */
export function ferrisWheel(x, y, s, t = 0, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  ctx.lineCap = 'round';
  line([[0, 0], [-210, 470]], C.ink, 26); line([[0, 0], [210, 470]], C.ink, 26);
  rr(-280, 455, 560, 34, 17); ctx.fillStyle = C.ink; ctx.fill();
  ctx.beginPath(); ctx.arc(0, 0, 330, 0, TAU); ctx.lineWidth = 22; ctx.strokeStyle = C.navy; ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, 300, 0, TAU); ctx.lineWidth = 8; ctx.strokeStyle = STEEL; ctx.stroke();
  const a0 = t * 0.5, cols = [C.red, C.yellow, BLUE, GREEN, ORANGE, PURPLE, C.pink, BLUE];
  for (let i = 0; i < 8; i++) { const a = a0 + i * TAU / 8; line([[0, 0], [Math.cos(a) * 330, Math.sin(a) * 330]], C.navy, 10); }
  for (let i = 0; i < 8; i++) {
    const a = a0 + i * TAU / 8, cx = Math.cos(a) * 330, cy = Math.sin(a) * 330;
    line([[cx, cy], [cx, cy + 34]], C.ink, 8);
    rr(cx - 50, cy + 30, 100, 76, [14, 14, 30, 30]); ctx.fillStyle = cols[i]; ctx.fill();
    rr(cx - 36, cy + 40, 72, 26, 8); ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.fill();
  }
  circle(0, 0, 46, C.ink); circle(0, 0, 24, C.yellow);
  ctx.restore();
}

/** ride entrance: two posts, a striped arch with a label, a turnstile arm. open 0..1 swings the arm up.
 *  s = 1 → 520 wide, arch top y-420, floor y+300 */
export function rideGate(x, y, s, open = 0, label = 'RIDE', sc = 1, armCol = C.red) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  for (const sx of [-1, 1]) { rr(sx * 230 - 30, -300, 60, 600, 16); ctx.fillStyle = C.navy; ctx.fill(); rr(sx * 230 - 30, -300, 20, 600, 10); ctx.fillStyle = '#2E3D5C'; ctx.fill(); }
  rr(-280, -420, 560, 140, 30); ctx.fillStyle = C.ink; ctx.fill();
  ctx.save(); rr(-266, -406, 532, 112, 22); ctx.clip();
  for (let i = -8; i < 10; i++) { ctx.beginPath(); ctx.moveTo(i * 60, -410); ctx.lineTo(i * 60 + 30, -410); ctx.lineTo(i * 60 - 20, -290); ctx.lineTo(i * 60 - 50, -290); ctx.closePath(); ctx.fillStyle = i % 2 ? C.red : C.white; ctx.fill(); }
  ctx.restore();
  rr(-170, -390, 340, 80, 20); ctx.fillStyle = C.yellow; ctx.fill(); txt(label, 0, -348, 52, C.ink, 4);
  // turnstile arm pivots at the left post
  ctx.save(); ctx.translate(-200, 60); ctx.rotate(-clamp(open) * Math.PI * 0.45);
  rr(-10, -20, 410, 40, 20); ctx.fillStyle = C.ink; ctx.fill(); rr(0, -12, 395, 24, 12); ctx.fillStyle = armCol; ctx.fill();
  for (let k = 0; k < 4; k++) { ctx.fillStyle = C.white; ctx.fillRect(40 + k * 90, -12, 36, 24); }
  ctx.restore();
  circle(-200, 60, 30, C.ink); circle(-200, 60, 14, C.yellow);
  ctx.restore();
}

/** small friendly-ish bot head icon (for "flood of bots"). s = 1 → 140 wide */
export function botIcon(x, y, s, col = C.red, t = 0, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  line([[0, -70], [0, -105]], C.ink, 8); circle(0, -110, 14, C.yellow);
  rr(-70, -70, 140, 120, 30); ctx.fillStyle = col; ctx.fill();
  rr(-70, -70, 140, 30, [30, 30, 0, 0]); ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.fill();
  rr(-50, -40, 100, 54, 18); ctx.fillStyle = C.ink; ctx.fill();
  const bl = Math.sin(t * 7) > 0.85 ? 0.2 : 1;
  ctx.save(); ctx.translate(0, -13); ctx.scale(1, bl); circle(-22, 0, 11, C.yellow); circle(22, 0, 11, C.yellow); ctx.restore();
  rr(-44, 54, 88, 22, 10); ctx.fillStyle = C.ink; ctx.fill();
  ctx.restore();
}

/** circular refresh arrow. r = radius, rot spins it, col fill */
export function refreshIcon(x, y, r, rot = 0, col = BLUE, w = null) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  const lw = w || r * 0.32;
  ctx.beginPath(); ctx.arc(0, 0, r, -Math.PI * 0.35, Math.PI * 1.35); ctx.lineWidth = lw; ctx.strokeStyle = col; ctx.lineCap = 'butt'; ctx.stroke();
  const a = -Math.PI * 0.35, ex = Math.cos(a) * r, ey = Math.sin(a) * r;
  ctx.save(); ctx.translate(ex, ey); ctx.rotate(a + Math.PI / 2);
  ctx.beginPath(); ctx.moveTo(-lw * 1.1, 0); ctx.lineTo(lw * 1.1, 0); ctx.lineTo(0, -lw * 1.2); ctx.closePath(); ctx.rotate(0); ctx.fillStyle = col; ctx.fill();
  ctx.restore();
  ctx.restore();
}
/** where the refresh button sits on feedRefreshScreen (screen-local) */
export const REFRESH_BTN = [0, 230];
/** phone screen: a feed with grey posts and a big round refresh button. spin = icon rotation, press 0..1 darkens it, load 0..1 shows a top bar */
export function feedRefreshScreen(spin = 0, press = 0, load = 0) {
  ctx.fillStyle = '#F7F4EE'; ctx.fillRect(-300, -600, 600, 1200);
  ctx.fillStyle = BLUE; ctx.fillRect(-170, -350, 340, 90);
  txt('FEED', 0, -296, 40, C.white, 4);
  if (load > 0) { ctx.fillStyle = C.yellow; ctx.fillRect(-166, -262, 332 * clamp(load), 10); }
  for (let i = 0; i < 2; i++) {
    const y0 = -220 + i * 180;
    rr(-140, y0, 280, 150, 20); ctx.fillStyle = C.white; ctx.fill();
    circle(-96, y0 + 42, 26, i ? C.pink : C.yellow);
    line([[-56, y0 + 34], [100, y0 + 34]], '#C9C2B5', 16); line([[-56, y0 + 62], [40, y0 + 62]], '#DDD6C9', 14);
    line([[-110, y0 + 110], [110, y0 + 110]], '#DDD6C9', 14);
  }
  circle(REFRESH_BTN[0], REFRESH_BTN[1], 82, press > 0.5 ? '#2C63B3' : BLUE);
  refreshIcon(REFRESH_BTN[0], REFRESH_BTN[1], 40, spin, C.white, 14);
}
/** phone screen: the 429 error page. p 0..1 pops it in */
export function tooManyScreen(p = 1) {
  ctx.fillStyle = '#FBEFF0'; ctx.fillRect(-300, -600, 600, 1200);
  ctx.save(); ctx.translate(0, -150); ctx.scale(p, p);
  circle(0, 0, 100, C.red);
  rr(-14, -60, 28, 76, 14); ctx.fillStyle = C.white; ctx.fill(); circle(0, 44, 16, C.white);
  ctx.restore();
  ctx.globalAlpha = clamp(p);
  txt('429', 0, 30, 110, C.red, 2);
  txt('TOO MANY', 0, 130, 40, C.ink, 2); txt('REQUESTS', 0, 178, 40, C.ink, 2);
  rr(-130, 240, 260, 70, 35); ctx.fillStyle = C.ink; ctx.fill(); txt('TRY LATER', 0, 276, 32, C.white, 2);
  ctx.globalAlpha = 1;
}

/** a "BANNED" rubber stamp (rotated rectangle with text). a 0..1, sc pop */
export function banStamp(x, y, s, text = 'BANNED', col = C.red, rot = -0.18, sc = 1, a = 1) {
  if (s * sc <= 0 || a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * sc, s * sc); ctx.globalAlpha = clamp(a);
  ctx.font = '900 120px Inter'; ctx.letterSpacing = '8px'; const w = ctx.measureText(text).width + 90; ctx.letterSpacing = '0px';
  rr(-w / 2, -95, w, 190, 26); ctx.lineWidth = 20; ctx.strokeStyle = col; ctx.stroke();
  rr(-w / 2 + 22, -73, w - 44, 146, 14); ctx.lineWidth = 6; ctx.stroke();
  txt(text, 0, 6, 120, col, 8);
  ctx.restore();
}
