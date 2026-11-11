// Inside Out: CAPTCHA components (robot, "I'm not a robot" widget, mouse cursor, cursor trail, picture-puzzle grid,
// squiggly-word card, open old book, house-number plate, concert ticket). Flat fills, one darker shade, one light
// highlight, ink outlines only on graphics/cards.
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

const GREEN = '#5BAE6A', BLUE = '#3A7BD5', STEEL = '#AEB7C4', STEEL_D = '#8C96A5', STEEL_L = '#D3D9E2', PAPER = '#F6EBCF', PAPER_D = '#E2D2AA';

/** friendly flat robot (bot). s = 1 → ~300 wide, ~460 tall; origin = body centre. t animates antenna, eyes 'n'|'x'|'sus', arm 0..1 raises right arm */
export function robot(x, y, s, t = 0, o = {}) {
  if (s <= 0) return;
  const { eyes = 'n', arm = 0, col = STEEL, rot = 0 } = o;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.lineCap = 'round';
  // legs
  for (const sd of [-1, 1]) { rr(sd * 60 - 26, 110, 52, 110, 16); ctx.fillStyle = STEEL_D; ctx.fill(); rr(sd * 60 - 40, 200, 80, 34, 14); ctx.fillStyle = C.ink; ctx.fill(); }
  // left arm (down)
  line([[-150, -40], [-176, 70]], STEEL_D, 34); circle(-178, 82, 26, STEEL_D);
  // body
  rr(-150, -110, 300, 240, 40); ctx.fillStyle = col; ctx.fill();
  rr(70, -110, 80, 240, [0, 40, 40, 0]); ctx.fillStyle = 'rgba(0,0,0,0.10)'; ctx.fill();
  rr(-80, -60, 160, 110, 20); ctx.fillStyle = C.navy; ctx.fill();
  for (let i = 0; i < 3; i++) circle(-44 + i * 44, -5, 14, [C.red, C.yellow, GREEN][i]);
  // right arm (raises)
  const ex = 150 + 40, ey = lerp(60, -120, arm), hx = lerp(176, 210, arm), hy = lerp(70, -230, arm);
  line([[150, -40], [lerp(176, ex, arm), lerp(70, ey, arm)]], STEEL_D, 34); line([[lerp(176, ex, arm), lerp(70, ey, arm)], [hx, hy]], STEEL_D, 34); circle(hx, hy, 26, STEEL_D);
  // neck + head
  rr(-30, -150, 60, 50, 10); ctx.fillStyle = STEEL_D; ctx.fill();
  line([[0, -330], [0, -390]], STEEL_D, 12); circle(0, -398 + Math.sin(t * 6) * 4, 20, C.red);
  rr(-130, -340, 260, 200, 44); ctx.fillStyle = col; ctx.fill();
  rr(-130, -340, 260, 60, [44, 44, 0, 0]); ctx.fillStyle = STEEL_L; ctx.fill();
  for (const sd of [-1, 1]) { rr(sd * 130 - (sd > 0 ? 0 : 26), -280, 26, 70, 10); ctx.fillStyle = STEEL_D; ctx.fill(); }
  rr(-100, -290, 200, 110, 30); ctx.fillStyle = C.navy; ctx.fill();
  for (const sd of [-1, 1]) {
    const cx = sd * 46, cy = -238;
    if (eyes === 'x') { line([[cx - 16, cy - 16], [cx + 16, cy + 16]], C.red, 10); line([[cx + 16, cy - 16], [cx - 16, cy + 16]], C.red, 10); }
    else if (eyes === 'sus') { rr(cx - 22, cy - 6, 44, 14, 7); ctx.fillStyle = C.cyan; ctx.fill(); }
    else { circle(cx, cy, 20, C.cyan); circle(cx + 6, cy - 6, 6, C.white); }
  }
  rr(-36, -202, 72, 10, 5); ctx.fillStyle = C.cyan; ctx.fill();
  ctx.restore();
}

/** the "I'm not a robot" checkbox widget. s = 1 → 760 x 200. state: 0 empty, 1 spinning, 2 checked (p = check draw 0..1) */
export function robotBox(x, y, s, state = 0, t = 0, p = 1, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  rr(-380, -100, 760, 200, 22); ctx.fillStyle = '#F9F9F9'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = '#D3D3D3'; ctx.stroke();
  const bx = -300;
  if (state === 1) {
    ctx.save(); ctx.translate(bx, 0); ctx.rotate(t * 7); ctx.lineCap = 'round'; ctx.lineWidth = 12; ctx.strokeStyle = BLUE;
    ctx.beginPath(); ctx.arc(0, 0, 38, 0, TAU * 0.72); ctx.stroke(); ctx.restore();
  } else if (state === 2) {
    ctx.save(); ctx.translate(bx, 0); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 16; ctx.strokeStyle = GREEN;
    const k = clamp(p); ctx.beginPath(); ctx.moveTo(-36, 2);
    if (k < 0.35) ctx.lineTo(lerp(-36, -10, k / 0.35), lerp(2, 30, k / 0.35)); else { ctx.lineTo(-10, 30); ctx.lineTo(lerp(-10, 42, (k - 0.35) / 0.65), lerp(30, -36, (k - 0.35) / 0.65)); }
    ctx.stroke(); ctx.restore();
  } else { rr(bx - 42, -42, 84, 84, 8); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = '#B5B5B5'; ctx.stroke(); }
  ctx.fillStyle = C.ink; ctx.font = '700 58px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText("I'm not a robot", -220, 4);
  // little shield logo (generic)
  ctx.save(); ctx.translate(300, -12);
  ctx.beginPath(); ctx.moveTo(0, -40); ctx.lineTo(34, -26); ctx.lineTo(30, 14); ctx.quadraticCurveTo(0, 44, -30, 14); ctx.lineTo(-34, -26); ctx.closePath(); ctx.fillStyle = BLUE; ctx.fill();
  ctx.lineWidth = 8; ctx.strokeStyle = C.white; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(-2, 12); ctx.lineTo(16, -12); ctx.stroke();
  ctx.restore();
  ctx.restore();
}
/** where the checkbox is, for a robotBox drawn at (x, y, s) */
export const robotBoxCheck = (x, y, s) => [x - 300 * s, y];

/** mouse pointer arrow (white, ink outline). tip at (x, y). s = 1 → ~90 px tall */
export function cursor(x, y, s = 1, rot = 0, col = C.white) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 86); ctx.lineTo(22, 66); ctx.lineTo(38, 100); ctx.lineTo(54, 92); ctx.lineTo(38, 60); ctx.lineTo(64, 58); ctx.closePath();
  ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.restore();
}
/** a dotted/solid trail through pts up to fraction p (0..1). col, w; dash = true for dotted */
export function trail(pts, p = 1, col = C.yellow, w = 12, dash = false, a = 1) {
  if (p <= 0 || a <= 0) return null;
  const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = cum[cum.length - 1] * clamp(p);
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; if (dash) ctx.setLineDash([2, w * 2.2]);
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); let end = pts[0];
  for (let i = 1; i < pts.length; i++) { if (cum[i] <= L) { ctx.lineTo(pts[i][0], pts[i][1]); end = pts[i]; } else { const k = (L - cum[i - 1]) / ((cum[i] - cum[i - 1]) || 1); end = [lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)]; ctx.lineTo(end[0], end[1]); break; } }
  ctx.stroke(); ctx.restore();
  return end;
}
/** point at fraction u along pts */
export function trailAt(pts, u) {
  const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = cum[cum.length - 1] * clamp(u); let i = 1; while (i < cum.length - 1 && cum[i] < L) i++;
  const k = (L - cum[i - 1]) / ((cum[i] - cum[i - 1]) || 1); return [lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)];
}
/** a wobbly human path from (x0,y0) to (x1,y1): n points with gentle curves */
export function wobblyPath(x0, y0, x1, y1, n = 40, amp = 70, seed = 1) {
  const pts = [];
  for (let i = 0; i <= n; i++) { const u = i / n, b = Math.sin(u * Math.PI); pts.push([lerp(x0, x1, u) + Math.sin(u * 9 + seed) * amp * 0.5 * b, lerp(y0, y1, u) + Math.sin(u * 6.3 + seed * 2) * amp * b]); }
  return pts;
}

/** 3x3 picture-puzzle grid ("select all squares with traffic lights"). s = 1 → 720 wide incl. header. sel = [bool x9], hit = which tiles show the object */
export function puzzleGrid(x, y, s, sel = [], o = {}) {
  if (s <= 0) return;
  const { title = 'Select all squares with', obj = 'traffic lights', hit = [0, 1, 0, 1, 0, 0, 0, 1, 0], sc = 1 } = o;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  rr(-370, -470, 740, 940, 20); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = '#D3D3D3'; ctx.stroke();
  rr(-350, -450, 700, 170, 12); ctx.fillStyle = BLUE; ctx.fill();
  ctx.fillStyle = C.white; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.font = '600 40px Inter'; ctx.fillText(title, -320, -400);
  ctx.font = '900 62px Inter'; ctx.fillText(obj, -320, -330);
  const cs = 224, gx = -350, gy = -264;
  for (let i = 0; i < 9; i++) {
    const cx = gx + (i % 3) * (cs + 14) + cs / 2, cy = gy + Math.floor(i / 3) * (cs + 14) + cs / 2, k = sel[i] ? 0.82 : 1;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(k, k);
    ctx.save(); rr(-cs / 2, -cs / 2, cs, cs, 6); ctx.clip();
    ctx.fillStyle = C.sky; ctx.fillRect(-cs / 2, -cs / 2, cs, cs);
    ctx.fillStyle = '#9AA1AE'; ctx.fillRect(-cs / 2, cs * 0.18, cs, cs);       // road
    ctx.fillStyle = C.white; ctx.fillRect(-cs / 2 + ((i * 37) % 60), cs * 0.32, 50, 10);
    ell(-60 + (i * 23) % 90, -60, 40, 18, C.white);
    if (hit[i]) { rr(-18, -80, 36, 220, 6); ctx.fillStyle = '#4A5160'; ctx.fill(); rr(-36, -96, 72, 150, 14); ctx.fillStyle = C.ink; ctx.fill(); circle(0, -66, 16, C.red); circle(0, -22, 16, C.yellow); circle(0, 22, 16, GREEN); }
    else if (i % 2 === 0) { rr(-70, 10, 140, 50, 16); ctx.fillStyle = C.red; ctx.fill(); circle(-40, 64, 16, C.ink); circle(40, 64, 16, C.ink); }
    else { rr(-12, -40, 24, 120, 6); ctx.fillStyle = '#7A4A2A'; ctx.fill(); circle(0, -60, 54, C.leaf); }
    ctx.restore(); ctx.restore();
    if (sel[i]) { circle(cx - cs / 2 + 26, cy - cs / 2 + 26, 24, BLUE); ctx.lineWidth = 7; ctx.strokeStyle = C.white; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx - cs / 2 + 15, cy - cs / 2 + 27); ctx.lineTo(cx - cs / 2 + 23, cy - cs / 2 + 35); ctx.lineTo(cx - cs / 2 + 37, cy - cs / 2 + 17); ctx.stroke(); }
  }
  ctx.restore();
}
/** centre of tile i, for a puzzleGrid drawn at (x, y, s) */
export const puzzleTile = (x, y, s, i) => [x + s * (-350 + (i % 3) * 238 + 112), y + s * (-264 + Math.floor(i / 3) * 238 + 112)];

/** squiggly (distorted) word card, like an old text CAPTCHA. s = 1 → 640 x 220 */
export function squiggleCard(x, y, s, text = 'morning', rot = 0, wob = 0, chars = 1e9) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-320, -110, 640, 220, 18); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.save(); rr(-320, -110, 640, 220, 18); ctx.clip();
  ctx.fillStyle = '#ECE6DA'; for (let i = 0; i < 12; i++) ell(-300 + i * 56, Math.sin(i * 1.7) * 60, 24, 14, '#ECE6DA', i);
  const n = Math.min(text.length, Math.floor(chars)), sp = 560 / text.length;
  ctx.font = '900 120px Georgia'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (let i = 0; i < n; i++) {
    ctx.save(); ctx.translate(-280 + sp * (i + 0.5), Math.sin(i * 1.3 + wob) * 18); ctx.rotate(Math.sin(i * 2.1 + wob * 0.7) * 0.32); ctx.scale(1 + Math.sin(i * 0.9) * 0.14, 1 + Math.cos(i * 1.4) * 0.16);
    ctx.fillStyle = C.ink; ctx.fillText(text[i], 0, 0); ctx.restore();
  }
  ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.beginPath(); for (let xx = -320; xx <= 320; xx += 16) { const yy = 10 + Math.sin(xx * 0.018 + wob) * 34; xx === -320 ? ctx.moveTo(xx, yy) : ctx.lineTo(xx, yy); } ctx.stroke();
  ctx.restore();
  ctx.restore();
}

/** open old book with text lines. s = 1 → 760 x 480. hi = which word-blot (0..n) is highlighted yellow (-1 none) */
export function oldBook(x, y, s, hi = -1, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-400, -230, 800, 480, 24); ctx.fillStyle = '#8A4A3A'; ctx.fill();
  for (const sd of [-1, 1]) {
    ctx.beginPath(); ctx.moveTo(0, -200); ctx.quadraticCurveTo(sd * 180, -240, sd * 370, -205); ctx.lineTo(sd * 370, 220); ctx.quadraticCurveTo(sd * 180, 185, 0, 225); ctx.closePath();
    ctx.fillStyle = PAPER; ctx.fill();
  }
  line([[0, -200], [0, 225]], PAPER_D, 8);
  let k = 0;
  for (const sd of [-1, 1]) for (let r = 0; r < 7; r++) {
    const yy = -150 + r * 50; let xx = sd < 0 ? -330 : 40;
    for (let w = 0; w < 4; w++) { const ww = 40 + ((r * 7 + w * 13 + (sd + 1) * 5) % 50); if (xx + ww > (sd < 0 ? -40 : 330)) break;
      rr(xx, yy - 8, ww, 16, 8); ctx.fillStyle = k === hi ? C.yellow : '#9C8E74'; ctx.fill(); if (k === hi) { ctx.lineWidth = 4; ctx.strokeStyle = C.ink; ctx.stroke(); } xx += ww + 14; k++; }
  }
  ctx.restore();
}

/** house-number plate (blue, white digits). s = 1 → 300 x 180 */
export function numberPlate(x, y, s, num = '42', rot = 0, col = BLUE) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-150, -90, 300, 180, 26); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-134, -74, 268, 148, 18); ctx.fillStyle = col; ctx.fill();
  ctx.fillStyle = C.white; ctx.font = '900 120px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(num, 0, 6);
  ctx.restore();
}

/** concert ticket with a stub and a star. s = 1 → 460 x 200 */
export function concertTicket(x, y, s, rot = 0, col = C.pink) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.beginPath(); ctx.roundRect(-230, -100, 460, 200, 18); ctx.fillStyle = col; ctx.fill();
  circle(110, -100, 22, C.bg); circle(110, 100, 22, C.bg);
  ctx.setLineDash([12, 12]); line([[110, -78], [110, 78]], C.white, 6); ctx.setLineDash([]);
  ctx.fillStyle = C.white; ctx.font = '900 54px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('LIVE', -60, -20);
  ctx.font = '800 30px Inter'; ctx.fillText('ROW A · SEAT 7', -60, 40);
  ctx.save(); ctx.translate(172, 0); ctx.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 16 : 36, a = -Math.PI / 2 + i * Math.PI / 5; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fillStyle = C.yellow; ctx.fill(); ctx.restore();
  ctx.restore();
}
