// Inside Out: GIT components (laptop, code lines, project folder, snapshot photo, commit timeline, rewind arrow,
// no-internet icon, cloud, upload arrow, mini people, cash stack). Same flat look: flat fills, one darker shade,
// one light highlight, ink outlines only on graphics/cards. No brand logos: Git / GitHub are named only in pills.
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

const GREEN = '#5BAE6A', BLUE = '#3A7BD5', ORANGE = '#C8734A', SCREEN = '#1F2A44';
export const CODE_COLS = ['#E57A8A', '#FFD43B', '#4FA3E8', '#5BAE6A', '#F4F1EA'];

/** rows of code as coloured bars inside a box (x, y = top left). n rows, chars 0..1 how much is typed */
export function codeLines(x, y, w, n = 6, typed = 1, rowH = 34, seed = 0) {
  for (let i = 0; i < n; i++) {
    const indent = ((i + seed) % 3 === 1 ? 40 : (i + seed) % 3 === 2 ? 80 : 0), full = w - indent - ((i * 53 + seed * 31) % 140);
    const p = clamp(typed * n - i); if (p <= 0) break;
    let cx = x + indent; const parts = [0.3, 0.45, 0.25];
    parts.forEach((f, k) => { const pw = full * f * p - 10; if (pw > 4) { rr(cx, y + i * rowH, pw, rowH * 0.5, rowH * 0.25); ctx.fillStyle = CODE_COLS[(i + k + seed) % CODE_COLS.length]; ctx.fill(); } cx += full * f * p; });
  }
}
/** laptop: screen 640x400, base below. Origin = screen centre. screen() draws in screen-local coords (-300..300, -180..180) */
export function laptop(x, y, s, screen, sc = 1) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  rr(-330, -210, 660, 420, 30); ctx.fillStyle = C.ink; ctx.fill();
  ctx.save(); rr(-300, -180, 600, 360, 14); ctx.clip(); ctx.fillStyle = SCREEN; ctx.fillRect(-300, -180, 600, 360); if (screen) screen(); ctx.restore();
  ctx.beginPath(); ctx.moveTo(-370, 210); ctx.lineTo(370, 210); ctx.lineTo(400, 250); ctx.quadraticCurveTo(400, 262, 386, 262); ctx.lineTo(-386, 262); ctx.quadraticCurveTo(-400, 262, -400, 250); ctx.closePath();
  ctx.fillStyle = '#C9CDD6'; ctx.fill(); rr(-70, 210, 140, 14, [0, 0, 8, 8]); ctx.fillStyle = '#9AA1AE'; ctx.fill();
  ctx.restore();
}
/** code-editor screen for the laptop: typed 0..1, t blinks the caret */
export function codeScreen(typed = 1, t = 0, seed = 0) {
  for (const [i, c] of [[0, C.red], [1, C.yellow], [2, GREEN]]) circle(-270 + i * 30, -155, 9, c);
  codeLines(-260, -110, 520, 7, typed, 40, seed);
}
/** project folder. s = 1 → 300x230. col = folder colour, label under the tab */
export function folder(x, y, s, col = C.yellow, label = null, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-150, -130, 120, 50, 16); ctx.fillStyle = '#E6B82E'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-150, -100, 300, 215, 22); ctx.fillStyle = '#E6B82E'; ctx.fill(); ctx.stroke();
  rr(-150, -70, 300, 185, 22); ctx.fillStyle = col; ctx.fill(); ctx.stroke();
  ell(-90, -45, 34, 9, 'rgba(255,255,255,0.5)');
  if (label) { ctx.fillStyle = C.ink; ctx.font = '900 40px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, 25); }
  ctx.restore();
}
/** polaroid snapshot of the project (folder + code inside). s = 1 → 300x340 */
export function snapshot(x, y, s, rot = 0, n = 1) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-150, -170, 300, 340, 16); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-125, -145, 250, 230, 8); ctx.fillStyle = SCREEN; ctx.fill();
  ctx.save(); rr(-125, -145, 250, 230, 8); ctx.clip(); codeLines(-105, -120, 210, 5, 1, 38, n); ctx.restore();
  ctx.fillStyle = C.ink; ctx.font = '900 36px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('v' + n, 0, 128);
  ctx.restore();
}
/** white camera flash ring burst at (x, y), p 0..1 */
export function flash(x, y, p) {
  if (p <= 0 || p >= 1) return;
  ctx.save(); ctx.globalAlpha = (1 - p) * 0.9; circle(x, y, 80 + p * 320, C.white); ctx.restore();
}
/** commit timeline: dots from x0 to x1 at y. shown = how many dots are visible (fractional pops the next), hi = highlighted dot */
export function commitLine(x0, x1, y, n, shown = n, hi = -1, hiP = 0, r = 34) {
  const dx = (x1 - x0) / (n - 1), last = Math.min(n - 1, Math.max(0, Math.ceil(shown) - 1));
  if (shown > 0) line([[x0, y], [x0 + dx * Math.max(0, Math.min(n - 1, shown - 1)), y]], C.ink, 16);
  for (let i = 0; i < n; i++) {
    const sc = clamp(shown - i); if (sc <= 0) break;
    const rr2 = r * (sc < 1 ? 0.6 + sc * 0.4 : 1) * (i === hi ? 1 + 0.3 * hiP : 1);
    if (i === hi && hiP > 0) { ctx.save(); ctx.globalAlpha = hiP; circle(x0 + dx * i, y, rr2 + 24, C.yellow); ctx.restore(); }
    circle(x0 + dx * i, y, rr2 + 8, C.ink); circle(x0 + dx * i, y, rr2, i === last && hi < 0 ? C.yellow : BLUE);
    circle(x0 + dx * i - rr2 * 0.3, y - rr2 * 0.3, rr2 * 0.25, 'rgba(255,255,255,0.5)');
  }
}
/** counter-clockwise "rewind" arrow ring. p 0..1 how much of the ring is drawn */
export function rewind(x, y, s, p = 1, rot = 0) {
  if (p <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.lineCap = 'round';
  const a0 = -0.4, a1 = a0 - p * (TAU * 0.8);
  for (const [w, c] of [[50, C.ink], [32, C.yellow]]) { ctx.lineWidth = w; ctx.strokeStyle = c; ctx.beginPath(); ctx.arc(0, 0, 120, a0, a1, true); ctx.stroke(); }
  const hx = Math.cos(a1) * 120, hy = Math.sin(a1) * 120, ta = a1 - Math.PI / 2;
  ctx.translate(hx, hy); ctx.rotate(ta);
  ctx.beginPath(); ctx.moveTo(0, -70); ctx.lineTo(60, 0); ctx.lineTo(-60, 0); ctx.closePath(); ctx.lineJoin = 'round'; ctx.lineWidth = 16; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.fillStyle = C.yellow; ctx.fill();
  ctx.restore();
}
/** red diagonal slash with ink outline (over an icon). s = 1 → 300 px long */
export function slash(x, y, s, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha = a; ctx.lineCap = 'round';
  for (const [w, c] of [[60, C.ink], [40, C.red]]) { ctx.lineWidth = w; ctx.strokeStyle = c; ctx.beginPath(); ctx.moveTo(-150, -150); ctx.lineTo(150, 150); ctx.stroke(); }
  ctx.restore();
}
/** big yellow check mark in an ink outline */
export function check(x, y, s, a = 1) {
  if (a <= 0 || s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha = a; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [w, c] of [[70, C.ink], [46, GREEN]]) { ctx.lineWidth = w; ctx.strokeStyle = c; ctx.beginPath(); ctx.moveTo(-110, 0); ctx.lineTo(-30, 80); ctx.lineTo(130, -100); ctx.stroke(); }
  ctx.restore();
}
/** flat cloud ("online"). s = 1 → ~520x260 */
export function cloud(x, y, s, col = C.white, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  const shape = (d) => { circle(-150, 40, 100 + d, col); circle(-40, -40, 140 + d, col); circle(110, -10, 115 + d, col); circle(190, 60, 80 + d, col); rr(-250, 40, 520, 100 + d, 50); ctx.fill(); };
  ctx.fillStyle = C.ink; shape(10);
  ctx.fillStyle = col; shape(0);
  ell(-60, -100, 60, 22, 'rgba(255,255,255,0.6)', -0.2);
  ctx.restore();
}
/** chunky up arrow (upload). p 0..1 grows it */
export function upArrow(x, y, s, col = C.yellow, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(0, -130); ctx.lineTo(110, -10); ctx.lineTo(42, -10); ctx.lineTo(42, 120); ctx.lineTo(-42, 120); ctx.lineTo(-42, -10); ctx.lineTo(-110, -10); ctx.closePath();
  ctx.lineJoin = 'round'; ctx.lineWidth = 14; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.fillStyle = col; ctx.fill();
  ctx.restore();
}
/** tiny friendly teammate (head + tee), origin = chest. shirt colour col; laptop in front if lap */
export function buddy(x, y, s, col = BLUE, hair = C.hair, lap = 0, t = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-90, -40, 180, 170, [60, 60, 20, 20]); ctx.fillStyle = col; ctx.fill();
  circle(0, -110, 70, C.skin); ell(0, -150, 72, 40, hair);
  for (const sd of [-1, 1]) { ell(sd * 24, -105, 8, 10, C.ink); circle(sd * 24 + 3, -109, 3, C.white); }
  ctx.beginPath(); ctx.moveTo(-16, -75); ctx.quadraticCurveTo(0, -62, 16, -75); ctx.strokeStyle = C.mouth; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.stroke();
  if (lap) { rr(-110, 40, 220, 120, 12); ctx.fillStyle = C.ink; ctx.fill(); rr(-96, 52, 192, 96, 8); ctx.fillStyle = SCREEN; ctx.fill(); ctx.save(); rr(-96, 52, 192, 96, 8); ctx.clip(); codeLines(-84, 64, 170, 3, 0.4 + 0.6 * ((t * 0.5) % 1), 26); ctx.restore(); }
  ctx.restore();
}
/** stack of cash bundles. s = 1 → 360 wide */
export function cash(x, y, s, n = 5, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  for (let i = 0; i < n; i++) {
    const yy = -i * 46;
    rr(-180, yy - 40, 360, 80, 12); ctx.fillStyle = '#3F8A4E'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
    rr(-170, yy - 32, 340, 54, 8); ctx.fillStyle = GREEN; ctx.fill();
    rr(-30, yy - 40, 60, 80, 4); ctx.fillStyle = C.yellow; ctx.fill();
    circle(-110, yy - 5, 18, '#3F8A4E'); circle(110, yy - 5, 18, '#3F8A4E');
  }
  ctx.restore();
}
/** little house roof + door on top of something ("home"), s = 1 → 220 wide */
export function roof(x, y, s, col = C.red) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-130, 0); ctx.lineTo(0, -110); ctx.lineTo(130, 0); ctx.closePath(); ctx.lineJoin = 'round'; ctx.lineWidth = 12; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.fillStyle = col; ctx.fill();
  rr(-90, 0, 180, 130, 6); ctx.fillStyle = C.white; ctx.fill(); ctx.stroke();
  rr(-28, 40, 56, 90, [28, 28, 0, 0]); ctx.fillStyle = ORANGE; ctx.fill(); ctx.stroke();
  ctx.restore();
}
