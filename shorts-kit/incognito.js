// Inside Out tech kit: incognito / private browsing (eye mask, dark private browser window, history list card,
// form card, court gavel, stack of record sheets). Flat look: flat fills, one darker shade, ink outlines on graphics.
// No browser brand logos: the private window is a generic dark window with a plain eye mask.
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';
const GREEN = '#5BAE6A', DARK = '#2A2F3A', DARK2 = '#353B48', PURPLE = '#6B4FA0';
const MONO = "'DejaVu Sans Mono', monospace";

/** a plain eye mask (the "private" symbol). s = 1 → ~360 wide. col = mask colour */
export function mask(x, y, s, rot = 0, col = DARK) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.lineJoin = 'round';
  // strap
  line([[-170, -10], [-215, -40]], C.ink, 16); line([[170, -10], [215, -40]], C.ink, 16);
  const shape = () => {
    ctx.beginPath(); ctx.moveTo(-180, -20);
    ctx.bezierCurveTo(-170, -95, -60, -90, 0, -55);
    ctx.bezierCurveTo(60, -90, 170, -95, 180, -20);
    ctx.bezierCurveTo(185, 55, 90, 85, 30, 40);
    ctx.quadraticCurveTo(0, 20, -30, 40);
    ctx.bezierCurveTo(-90, 85, -185, 55, -180, -20); ctx.closePath();
  };
  shape(); ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 12; ctx.strokeStyle = C.ink; ctx.stroke();
  ell(-100, -48, 46, 12, 'rgba(255,255,255,0.18)', -0.2);
  for (const sd of [-1, 1]) { ell(sd * 85, 2, 46, 30, C.bg, sd * 0.12); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke(); }
  ctx.restore();
}

/** a private (dark) browser window. w x h centred at (x, y). content(w, h) draws in local coords; shows a small mask in the bar */
export function privateBrowser(x, y, w, h, content = null, sc = 1, label = 'Private window') {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  rr(-w / 2, -h / 2, w, h, 30); ctx.fillStyle = DARK2; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-w / 2, -h / 2, w, 92, [30, 30, 0, 0]); ctx.fillStyle = DARK; ctx.fill(); ctx.stroke();
  for (const [i, c] of [[0, C.red], [1, C.yellow], [2, GREEN]]) circle(-w / 2 + 40 + i * 36, -h / 2 + 46, 11, c);
  rr(-w / 2 + 160, -h / 2 + 22, w - 200, 48, 24); ctx.fillStyle = '#4A5160'; ctx.fill();
  mask(-w / 2 + 200, -h / 2 + 48, 0.1, 0, C.ink);
  ctx.fillStyle = '#C9CDD6'; ctx.font = '800 28px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText(label, -w / 2 + 240, -h / 2 + 47);
  if (content) { ctx.save(); ctx.translate(0, 46); rr(-w / 2 + 6, -h / 2 + 46, w - 12, h - 98, [0, 0, 26, 26]); ctx.clip(); content(w, h - 92); ctx.restore(); }
  ctx.restore();
}

/** history list card. s = 1 → 560 wide. rows = strings; shown = rows visible; wipe 0..1 rows slide out to the right */
export function historyCard(x, y, s, rows, shown = 1e9, wipe = 0, title = 'HISTORY', rot = 0) {
  if (s <= 0) return;
  const n = rows.length, h = 120 + n * 86;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-280, -h / 2, 560, h, 32); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-280, -h / 2, 560, 96, [32, 32, 0, 0]); ctx.fillStyle = PURPLE; ctx.fill(); ctx.stroke();
  // clock icon
  circle(-220, -h / 2 + 48, 26, C.white); line([[-220, -h / 2 + 48], [-220, -h / 2 + 32]], C.ink, 6); line([[-220, -h / 2 + 48], [-208, -h / 2 + 54]], C.ink, 6);
  ctx.fillStyle = C.white; ctx.font = '900 44px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(title, -180, -h / 2 + 50);
  ctx.save(); rr(-276, -h / 2 + 96, 552, h - 100, [0, 0, 30, 30]); ctx.clip();
  for (let i = 0; i < Math.min(n, shown); i++) {
    const yy = -h / 2 + 150 + i * 86, dx = clamp(wipe * (n + 1) - i) * 700;
    ctx.save(); ctx.translate(dx, 0);
    circle(-226, yy, 16, ['#E57A8A', '#3A7BD5', '#5BAE6A', '#F29A3A'][i % 4]);
    ctx.fillStyle = C.ink; ctx.font = `700 40px ${MONO}`; ctx.fillText(rows[i], -190, yy + 2);
    line([[-250, yy + 43], [250, yy + 43]], '#E4DCCB', 4);
    ctx.restore();
  }
  ctx.restore();
  ctx.restore();
}

/** a little form card: label + a field with typed text. s = 1 → 520x260. chars = typed characters */
export function formCard(x, y, s, label = 'NAME', text = 'Sam Lee', chars = 1e9, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-260, -130, 520, 260, 30); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.fillStyle = C.ink; ctx.font = '900 40px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(label, -215, -70);
  rr(-220, -30, 440, 110, 18); ctx.fillStyle = '#F4F1EA'; ctx.fill(); ctx.lineWidth = 6; ctx.stroke();
  const shown = text.slice(0, Math.max(0, Math.floor(chars)));
  ctx.fillStyle = C.ink; ctx.font = `700 50px ${MONO}`; ctx.fillText(shown, -195, 27);
  const cw = ctx.measureText(shown).width; rr(-190 + cw, 0, 6, 54, 3); ctx.fillStyle = C.ink; ctx.fill();
  ctx.restore();
}

/** court gavel. s = 1 → ~420 wide. rot = swing angle (0 = head level, resting at a slight tilt) */
export function gavel(x, y, s, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.lineJoin = 'round';
  rr(-20, -10, 40, 300, 18); ctx.fillStyle = '#8A5A3B'; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-170, -110, 340, 120, 30); ctx.fillStyle = '#A86D45'; ctx.fill(); ctx.stroke();
  rr(-170, -110, 70, 120, [30, 0, 0, 30]); ctx.fillStyle = '#C8734A'; ctx.fill(); ctx.stroke();
  rr(100, -110, 70, 120, [0, 30, 30, 0]); ctx.fillStyle = '#C8734A'; ctx.fill(); ctx.stroke();
  ell(-30, -86, 50, 10, 'rgba(255,255,255,0.3)');
  ctx.restore();
}
/** the gavel's sound block. s = 1 → 300 wide */
export function gavelBlock(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ell(0, 30, 150, 34, '#6E4630'); rr(-150, -20, 300, 50, 0); ctx.fillStyle = '#8A5A3B'; ctx.fill(); ell(0, -20, 150, 34, '#A86D45');
  ctx.beginPath(); ctx.ellipse(0, -20, 150, 34, 0, 0, TAU); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.restore();
}

/** a record sheet (paper with lines). s = 1 → 140x180 */
export function recordSheet(x, y, s, rot = 0, col = C.white) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-70, -90, 140, 180, 14); ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
  for (let i = 0; i < 4; i++) line([[-44, -50 + i * 32], [44 - (i % 2) * 24, -50 + i * 32]], '#9AA1AE', 9);
  ctx.restore();
}
