// Inside Out: 2FA / TOTP components. Flat fills, one darker shade, one highlight, ink outlines on graphics.
// authScreen, codeTiles, ringTimer, wallClock, airplane, airplaneScreen, codeEntryScreen, signalSlash
import { ctx, C, TAU, lerp, clamp, rr, circle, ell } from './lib.js';

const MONO = "'DejaVu Sans Mono', monospace";
const GREEN = '#5BAE6A', BLUE = '#3A7BD5';

/** countdown ring (time left in the 30 s window). r = radius, left 0..1 (1 = full), col = ring colour */
export function ringTimer(x, y, r, left = 1, col = BLUE, w = null) {
  if (r <= 0) return;
  const lw = w || r * 0.32;
  ctx.save(); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.strokeStyle = '#D9D3C4'; ctx.lineWidth = lw; ctx.stroke();
  const L = clamp(left), c = L < 0.2 ? C.red : col;
  if (L > 0.005) { ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + TAU * L); ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.stroke(); }
  ctx.restore();
}

/** six digit tiles "482 913". s = 1 → ~660x150. roll 0..1 rolls from `from` code to `code` (each tile slides up);
 *  hi 0..1 = yellow tiles; shown = how many tiles are visible (pop-in) */
export function codeTiles(x, y, s, code = '482913', o = {}) {
  if (s <= 0) return;
  const { from = null, roll = 1, hi = 0, shown = 6, tone = 'white' } = o;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (let i = 0; i < 6; i++) {
    const p = clamp(shown - i); if (p <= 0) continue;
    const cx = -275 + i * 100 + (i > 2 ? 50 : 0);
    ctx.save(); ctx.translate(cx, 0); ctx.scale(p, p);
    rr(-44, -70, 88, 140, 18);
    ctx.fillStyle = hi > 0.5 ? C.yellow : tone === 'navy' ? C.navy : C.white; ctx.fill();
    ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
    ctx.save(); rr(-44, -70, 88, 140, 18); ctx.clip();
    ctx.font = `700 96px ${MONO}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = tone === 'navy' && hi <= 0.5 ? C.yellow : C.ink;
    const r = from ? clamp(roll * 1.6 - i * 0.12) : 1;
    if (from && r < 1) ctx.fillText(from[i], 0, 6 - r * 150);
    ctx.fillText(code[i], 0, 6 + (1 - r) * 150);
    ctx.restore();
    ctx.restore();
  }
  ctx.restore();
}

/** authenticator app screen for phone(). code, left = ring time 0..1, o.from/roll for a rolling code, o.plane = airplane-mode bar */
export function authScreen(code = '482913', left = 1, o = {}) {
  ctx.fillStyle = '#F4F1EA'; ctx.fillRect(-166, -350, 332, 700);
  ctx.fillStyle = BLUE; ctx.fillRect(-166, -350, 332, 130);
  ctx.fillStyle = C.white; ctx.font = '900 30px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('AUTHENTICATOR', 0, -262);
  if (o.plane) { airplane(-120, -318, 0.16, 0, C.white); ctx.font = '900 18px Inter'; ctx.textAlign = 'left'; ctx.fillText('NO SIGNAL', -96, -318); }
  // account card
  rr(-146, -190, 292, 260, 26); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.fillStyle = '#4A5060'; ctx.font = '800 24px Inter'; ctx.textAlign = 'left'; ctx.fillText('mysite.com', -124, -156);
  codeTiles(0, -60, 0.43, code, { from: o.from, roll: o.roll ?? 1, hi: o.hi || 0 });
  ringTimer(110, 26, 22, left, BLUE, 10);
  // dim second account rows
  for (let k = 0; k < 2; k++) { rr(-146, 100 + k * 110, 292, 90, 22); ctx.fillStyle = '#E4DCCB'; ctx.fill(); rr(-124, 128 + k * 110, 140, 18, 9); ctx.fillStyle = '#C9C2B5'; ctx.fill(); rr(-124, 156 + k * 110, 200, 22, 11); ctx.fill(); }
}

/** website "enter your code" screen for laptop() (600x360 local area). typed 0..6 digits, ok 0..1 green success */
export function codeEntryScreen(code = '482913', typed = 0, ok = 0) {
  ctx.fillStyle = '#DCEEF6'; ctx.fillRect(-300, -180, 600, 360);
  ctx.fillStyle = BLUE; ctx.fillRect(-300, -180, 600, 70);
  ctx.fillStyle = C.white; ctx.font = '900 32px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('mysite.com', 0, -144);
  ctx.fillStyle = C.ink; ctx.font = '900 34px Inter'; ctx.fillText('ENTER YOUR CODE', 0, -66);
  for (let i = 0; i < 6; i++) {
    const cx = -200 + i * 72 + (i > 2 ? 32 : 0);
    rr(cx - 30, -24, 60, 84, 12); ctx.fillStyle = ok > 0.5 ? '#D6EED9' : C.white; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = ok > 0.5 ? GREEN : C.ink; ctx.stroke();
    if (i < Math.floor(typed)) { ctx.fillStyle = C.ink; ctx.font = `700 54px ${MONO}`; ctx.fillText(code[i], cx, 20); }
  }
  rr(-110, 90, 220, 60, 30); ctx.fillStyle = ok > 0.5 ? GREEN : C.ink; ctx.fill();
  ctx.fillStyle = C.white; ctx.font = '900 28px Inter'; ctx.fillText(ok > 0.5 ? 'WELCOME!' : 'VERIFY', 0, 121);
}

/** flat wall clock. s = 1 → r 200. sec = seconds hand angle source (seconds), min = minutes */
export function wallClock(x, y, s, sec = 0, min = 41, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  circle(0, 0, 200, C.ink); circle(0, 0, 182, C.white); circle(-30, -40, 120, '#F7F4EE');
  for (let i = 0; i < 12; i++) { ctx.save(); ctx.rotate(i * TAU / 12); rr(-6, -170, 12, i % 3 === 0 ? 34 : 20, 6); ctx.fillStyle = C.ink; ctx.fill(); ctx.restore(); }
  const hand = (ang, len, w, col) => { ctx.save(); ctx.rotate(ang); rr(-w / 2, -len, w, len + 18, w / 2); ctx.fillStyle = col; ctx.fill(); ctx.restore(); };
  hand((min / 60) * TAU * 0 + 0.35 * TAU, 90, 18, C.ink);
  hand((min / 60) * TAU, 135, 13, C.ink);
  hand((sec / 60) * TAU, 150, 7, C.red);
  circle(0, 0, 16, C.ink); circle(0, 0, 7, C.red);
  ctx.restore();
}

/** flat airplane silhouette (pointing right, rot rad). s = 1 → ~300 long */
export function airplane(x, y, s, rot = 0, col = C.ink) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.fillStyle = col;
  rr(-150, -22, 300, 44, 22); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-10, -18); ctx.lineTo(-80, -140); ctx.lineTo(-40, -140); ctx.lineTo(60, -18); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-10, 18); ctx.lineTo(-80, 140); ctx.lineTo(-40, 140); ctx.lineTo(60, 18); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-130, -14); ctx.lineTo(-165, -70); ctx.lineTo(-140, -70); ctx.lineTo(-100, -14); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-130, 14); ctx.lineTo(-165, 70); ctx.lineTo(-140, 70); ctx.lineTo(-100, 14); ctx.closePath(); ctx.fill();
  ctx.restore();
}

/** a round airplane-mode badge (orange disc with a white plane). on 0..1 pops it in */
export function planeBadge(x, y, s, on = 1) {
  if (s * on <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * on, s * on);
  circle(0, 0, 120, C.ink); circle(0, 0, 108, '#F29A3A'); circle(-30, -34, 40, 'rgba(255,255,255,0.18)');
  ctx.restore();
  airplane(x, y, 0.55 * s * on, -Math.PI / 4, C.white);
}

/** a red slash over something (no signal). s = 1 → 260 long */
export function signalSlash(x, y, s, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-Math.PI / 4); ctx.globalAlpha = a; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-130 * a, 0); ctx.lineTo(130 * a, 0); ctx.strokeStyle = C.ink; ctx.lineWidth = 46; ctx.stroke(); ctx.strokeStyle = C.red; ctx.lineWidth = 28; ctx.stroke();
  ctx.restore();
}
