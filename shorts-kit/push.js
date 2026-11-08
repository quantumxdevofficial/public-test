// Inside Out: PUSH NOTIFICATION components. Flat fills, one darker shade, one highlight, ink outlines on graphics.
// lockScreen, notifBanner, battery, bell, pushHub, openLine, chatApp, sleepyTile, zzz
import { ctx, C, TAU, lerp, clamp, rr, circle, ell } from './lib.js';

const GREEN = '#5BAE6A', BLUE = '#3A7BD5';

/** a notification banner card. s = 1 → 300x92 (fits a phone screen). icon colour, title, body text */
export function notifBanner(x, y, s, title = 'Sam', body = 'you up?', col = GREEN, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  rr(-150, -46, 300, 92, 24); ctx.fillStyle = 'rgba(255,255,255,0.96)'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-134, -30, 60, 60, 16); ctx.fillStyle = col; ctx.fill();
  // speech bubble glyph on the icon
  ell(-104, -4, 20, 15, C.white); ctx.beginPath(); ctx.moveTo(-116, 6); ctx.lineTo(-122, 18); ctx.lineTo(-106, 9); ctx.fillStyle = C.white; ctx.fill();
  ctx.fillStyle = C.ink; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.font = '900 30px Inter'; ctx.fillText(title, -60, -14);
  ctx.font = '600 24px Inter'; ctx.fillStyle = '#4A5060'; ctx.fillText(body, -60, 18);
  ctx.restore();
}

/** lock screen (phone() screen fn). banners = [[title, body, col, p]] slide down from the top; t = time */
export function lockScreen(banners = [], t = 0, dark = false) {
  ctx.fillStyle = dark ? '#1F2A44' : '#3A5A8C'; ctx.fillRect(-166, -350, 332, 700);
  circle(90, 230, 170, dark ? '#24324F' : '#4A6BA0');
  ctx.fillStyle = C.white; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = '900 92px Inter'; ctx.fillText('9:41', 0, -210);
  ctx.font = '600 24px Inter'; ctx.fillText('Sunday', 0, -150);
  banners.forEach(([ti, bo, col, p], k) => {
    if (p <= 0) return;
    const y = lerp(-420, -50 + k * 106, clamp(p));
    notifBanner(0, y, 1.0, ti, bo, col);
  });
}

/** battery icon. s = 1 → 260x130. level 0..1; colour turns red below 0.25 */
export function battery(x, y, s, level = 1, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  rr(-130, -65, 260, 130, 26); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 12; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(132, -26, 22, 52, [0, 10, 10, 0]); ctx.fillStyle = C.ink; ctx.fill();
  const L = clamp(level), col = L < 0.25 ? C.red : L < 0.55 ? C.yellow : GREEN;
  if (L > 0.01) { rr(-112, -47, 224 * L, 94, 14); ctx.fillStyle = col; ctx.fill(); rr(-112, -47, 224 * L, 26, [14, 14, 0, 0]); ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fill(); }
  ctx.restore();
}

/** notification bell. s = 1 → 200 tall. ring 0..1 swings it; badge = number shown in a red dot (0 = none) */
export function bell(x, y, s, ring = 0, badge = 0, t = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(Math.sin(t * 22) * 0.3 * ring);
  ctx.beginPath(); ctx.moveTo(-80, 60); ctx.bezierCurveTo(-70, 30, -70, -80, 0, -85); ctx.bezierCurveTo(70, -80, 70, 30, 80, 60); ctx.closePath();
  ctx.fillStyle = C.yellow; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(30, -60); ctx.bezierCurveTo(55, -40, 55, 10, 60, 45); ctx.lineWidth = 14; ctx.strokeStyle = '#F5B82E'; ctx.stroke();
  rr(-95, 55, 190, 26, 13); ctx.fillStyle = C.yellow; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  circle(0, 100, 20, C.ink); circle(0, -95, 14, C.ink);
  ctx.restore();
  if (badge) {
    circle(x + 70 * s, y - 70 * s, 42 * s, C.red);
    ctx.fillStyle = C.white; ctx.font = `900 ${50 * s}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(badge), x + 70 * s, y - 68 * s);
  }
}

/** the push service hub (Apple / Google relay): navy tower with a bell sign + label pill. s = 1 → 320x440 (base at y + 220) */
export function pushHub(x, y, s, label = 'APPLE / GOOGLE', t = 0, glow = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (glow > 0) { ctx.globalAlpha = 0.35 * glow; circle(0, -20, 300, C.yellow); ctx.globalAlpha = 1; }
  rr(-160, -220, 320, 440, 26); ctx.fillStyle = C.navy; ctx.fill();
  rr(90, -220, 70, 440, [0, 26, 26, 0]); ctx.fillStyle = '#16263C'; ctx.fill();
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
    const on = Math.sin(t * 6 + r * 1.9 + c * 2.7) > -0.2;
    rr(-120 + c * 80, 20 + r * 56, 50, 34, 8); ctx.fillStyle = on ? C.yellow : '#3A3A2A'; ctx.fill();
  }
  ctx.restore();
  bell(x, y - 110 * s, 0.75 * s, glow, 0, t);
  ctx.save(); ctx.translate(x, y + 260 * s); ctx.scale(s, s);
  ctx.font = '900 40px Inter'; const w = ctx.measureText(label).width + 50;
  rr(-w / 2, -32, w, 64, 32); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, 2);
  ctx.restore();
}

/** the always-open line: thick dashed rope from (x0,y0) to (x1,y1), drawn up to p 0..1; dashes march with t */
export function openLine(x0, y0, x1, y1, p = 1, t = 0, col = GREEN, w = 22) {
  if (p <= 0) return;
  const ex = lerp(x0, x1, p), ey = lerp(y0, y1, p);
  ctx.save(); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(ex, ey); ctx.strokeStyle = C.ink; ctx.lineWidth = w + 12; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(ex, ey); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke();
  ctx.setLineDash([26, 34]); ctx.lineDashOffset = -t * 120;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(ex, ey); ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = w * 0.4; ctx.stroke();
  ctx.restore();
}
/** point along openLine at u 0..1 */
export const lineAt = (x0, y0, x1, y1, u) => [lerp(x0, x1, u), lerp(y0, y1, u)];

/** app tile with a closed / sleeping look (grey overlay + zzz). s = 1 → 80 px tile */
export function sleepyTile(x, y, s, col = BLUE, t = 0, sleep = 1) {
  rr(x - 40 * s, y - 40 * s, 80 * s, 80 * s, 20 * s); ctx.fillStyle = col; ctx.fill();
  rr(x - 40 * s, y - 40 * s, 80 * s, 26 * s, [20 * s, 20 * s, 0, 0]); ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fill();
  if (sleep > 0) {
    ctx.save(); ctx.globalAlpha = sleep;
    ctx.lineWidth = 5 * s; ctx.strokeStyle = C.white; ctx.lineCap = 'round';
    for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(x + sd * 15 * s, y - 2 * s, 9 * s, 0.2, Math.PI - 0.2); ctx.stroke(); }
    ctx.restore();
    zzz(x + 40 * s, y - 50 * s, s, t, sleep);
  }
}
/** floating z z z */
export function zzz(x, y, s, t = 0, a = 1) {
  ctx.save(); ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (let k = 0; k < 3; k++) {
    const u = (t * 0.6 + k / 3) % 1;
    ctx.globalAlpha = a * Math.sin(u * Math.PI);
    ctx.font = `900 ${(22 + k * 8) * s}px Inter`; ctx.fillText('z', x + u * 30 * s + k * 10 * s, y - u * 60 * s);
  }
  ctx.restore();
}

/** a chat app screen (phone() screen fn): bubbles appear with p values; typed = text in the input */
export function chatApp(msgs = [], typed = '', t = 0) {
  ctx.fillStyle = '#EAF4EC'; ctx.fillRect(-166, -350, 332, 700);
  ctx.fillStyle = GREEN; ctx.fillRect(-166, -350, 332, 110);
  circle(-110, -285, 28, C.white); ctx.fillStyle = C.white; ctx.font = '900 30px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('You', -70, -285);
  msgs.forEach(([txt, mine, p], k) => {
    if (p <= 0) return;
    ctx.save(); ctx.globalAlpha = clamp(p);
    const y = -170 + k * 90, w = 220;
    rr(mine ? 166 - 20 - w : -146, y - 32, w, 64, 24); ctx.fillStyle = mine ? '#C9EFC0' : C.white; ctx.fill();
    ctx.fillStyle = C.ink; ctx.font = '700 26px Inter'; ctx.textAlign = 'center'; ctx.fillText(txt, mine ? 166 - 20 - w / 2 : -146 + w / 2, y);
    ctx.restore();
  });
  rr(-146, 270, 230, 56, 28); ctx.fillStyle = C.white; ctx.fill();
  ctx.fillStyle = C.ink; ctx.font = '600 24px Inter'; ctx.textAlign = 'left'; ctx.fillText(typed, -126, 298);
  circle(122, 298, 30, GREEN);
  ctx.beginPath(); ctx.moveTo(110, 284); ctx.lineTo(138, 298); ctx.lineTo(110, 312); ctx.closePath(); ctx.fillStyle = C.white; ctx.fill();
}
