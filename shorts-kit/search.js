// Inside Out: SEARCH components (search bar, Enter key, DNS book, packets, data center, index cabinet,
// web pages, ranked results, server grid). Same flat look: flat fills, one darker shade, one light highlight,
// ink outlines only on graphics/cards. No brand logos: the search screen is generic.
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

const MONO = "'DejaVu Sans Mono', monospace";
const GREEN = '#5BAE6A', BLUE = '#3A7BD5', KEY = '#D9D2C3';
export const PAGE_COLS = [BLUE, '#E57A8A', GREEN, '#C8734A', '#FFD43B', '#1F2A44'];

/** magnifying glass. s = 1 → lens radius 60 */
export function magnifier(x, y, s, rot = -0.6, col = C.ink) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-14, 56, 28, 90, 12); ctx.fillStyle = col; ctx.fill();
  ctx.beginPath(); ctx.arc(0, 0, 60, 0, TAU); ctx.lineWidth = 18; ctx.strokeStyle = col; ctx.stroke();
  ctx.globalAlpha = 0.25; circle(0, 0, 51, C.white); ctx.globalAlpha = 1;
  ctx.restore();
}

/** a search bar card (in any coords). w wide, q = query text, chars = typed chars, caret blink with t */
export function searchBar(x, y, w, q, chars = 1e9, t = 0, size = 38) {
  const h = size * 2.1;
  rr(x - w / 2, y - h / 2, w, h, h / 2); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  magnifier(x - w / 2 + h * 0.55, y - 4, size / 110, -0.6);
  ctx.fillStyle = C.ink; ctx.font = `800 ${size}px Inter`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  const shown = q.slice(0, Math.max(0, Math.floor(chars))), tx = x - w / 2 + h * 1.05;
  ctx.fillText(shown, tx, y + 2);
  if (Math.sin(t * 10) > 0) { const cw = ctx.measureText(shown).width; rr(tx + cw + 4, y - size * 0.55, 5, size * 1.1, 2); ctx.fill(); }
}

/** phone screen: a generic search page. q typed up to chars; results 0..1 slides in result cards */
export function searchScreen(q, chars = 1e9, t = 0, results = 0) {
  ctx.fillStyle = C.white; ctx.fillRect(-166, -350, 332, 700);
  ctx.fillStyle = C.ink; ctx.font = '900 30px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('9:41', 0, -305);
  const by = lerp(-120, -230, clamp(results * 3));
  if (results <= 0) { ctx.font = '900 64px Inter'; ctx.fillStyle = BLUE; ctx.fillText('Search', 0, -210); }
  searchBar(0, by, 290, q, chars, t, 22);
  for (let i = 0; i < 4; i++) {
    const p = clamp(results * 4 - i * 0.7 - 0.2); if (p <= 0) continue;
    ctx.save(); ctx.globalAlpha = p; ctx.translate(0, (1 - p) * 40);
    const ry = -150 + i * 120;
    rr(-140, ry, 280, 100, 16); ctx.fillStyle = '#EEF2F6'; ctx.fill();
    rr(-120, ry + 18, 150, 18, 9); ctx.fillStyle = BLUE; ctx.fill();
    rr(-120, ry + 48, 230, 12, 6); ctx.fillStyle = '#B9C6CF'; ctx.fill(); rr(-120, ry + 70, 180, 12, 6); ctx.fill();
    ctx.restore();
  }
}

/** big keyboard Enter key. s = 1 → 340x240. press 0..1 pushes the cap down */
export function enterKey(x, y, s, press = 0, sc = 1) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  rr(-170, -100, 340, 240, 40); ctx.fillStyle = C.ink; ctx.fill();
  const dy = press * 26;
  ctx.save(); ctx.translate(0, dy);
  rr(-160, -120, 320, 220, 34); ctx.fillStyle = KEY; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-136, -110, 272, 170, 26); ctx.fillStyle = C.white; ctx.fill();
  ctx.fillStyle = C.ink; ctx.font = '900 64px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('ENTER', 0, -55);
  line([[70, -5], [70, 25], [-60, 25]], C.ink, 12); ctx.beginPath(); ctx.moveTo(-82, 25); ctx.lineTo(-52, 5); ctx.lineTo(-52, 45); ctx.closePath(); ctx.fillStyle = C.ink; ctx.fill();
  ctx.restore();
  ctx.restore();
}

/** the DNS "phone book" card. rows = [[name, number], ...]; hi = highlighted row, hiP 0..1; numP 0..1 types the number */
export function dnsBook(x, y, s, rows, hi = -1, hiP = 0, numP = 1, sc = 1) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  rr(-400, -330, 800, 660, 40); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-400, -330, 800, 150, [40, 40, 0, 0]); ctx.fillStyle = C.ink; ctx.fill();
  ctx.fillStyle = C.yellow; ctx.font = '900 76px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.letterSpacing = '8px';
  ctx.fillText('DNS', 0, -252); ctx.letterSpacing = '0px';
  rows.forEach(([name, num], i) => {
    const ry = -100 + i * 140;
    if (i === hi && hiP > 0) { rr(-370, ry - 55, 740 * hiP, 110, 22); ctx.fillStyle = C.yellow; ctx.fill(); }
    ctx.fillStyle = C.ink; ctx.font = `700 46px ${MONO}`; ctx.textAlign = 'left'; ctx.fillText(name, -340, ry + 2);
    ctx.textAlign = 'right';
    const n = i === hi ? num.slice(0, Math.floor(num.length * clamp(numP))) : num;
    ctx.globalAlpha = i === hi ? 1 : 0.35; ctx.fillText(n, 350, ry + 2); ctx.globalAlpha = 1;
    if (i < rows.length - 1) { ctx.save(); ctx.globalAlpha = 0.15; line([[-360, ry + 70], [360, ry + 70]], C.ink, 4); ctx.restore(); }
  });
  ctx.restore();
}

/** a data packet: yellow tile with ink outline and a tiny label. s = 1 → 110 px */
export function packet(x, y, s, label = '', rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-55, -55, 110, 110, 18); ctx.fillStyle = C.yellow; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-55, -55, 110, 30, [18, 18, 0, 0]); ctx.fillStyle = '#F5B82E'; ctx.fill(); ctx.stroke();
  if (label) { ctx.fillStyle = C.ink; ctx.font = `700 34px ${MONO}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, 18); }
  ctx.restore();
}

/** data center building. s = 1 → 720 wide, 460 tall (base at y + 230). t blinks windows */
export function dataCenter(x, y, s, t = 0, glow = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-360, -230, 720, 460, 26); ctx.fillStyle = C.navy; ctx.fill();
  rr(220, -230, 140, 460, [0, 26, 26, 0]); ctx.fillStyle = '#16263C'; ctx.fill();
  rr(-380, -260, 760, 50, 16); ctx.fillStyle = C.pants; ctx.fill();
  for (const fx of [-250, -120]) { rr(fx - 40, -320, 80, 64, 12); ctx.fillStyle = C.pants; ctx.fill(); circle(fx, -288, 22, '#2E3B58'); }
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) {
    const on = Math.sin(t * 7 + r * 1.7 + c * 2.3) > -0.3 || glow > 0.5;
    rr(-320 + c * 100, -180 + r * 90, 70, 50, 10); ctx.fillStyle = on ? C.yellow : '#4A4220'; ctx.fill();
  }
  rr(-50, 130, 100, 100, [16, 16, 0, 0]); ctx.fillStyle = C.ink; ctx.fill();
  ctx.restore();
}

/** a tiny web page. s = 1 → 200x260 */
export function webPage(x, y, s, col = BLUE, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-100, -130, 200, 260, 18); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-100, -130, 200, 56, [18, 18, 0, 0]); ctx.fillStyle = col; ctx.fill(); ctx.stroke();
  rr(-76, -50, 90, 70, 10); ctx.fillStyle = '#DCEEF6'; ctx.fill();
  for (let i = 0; i < 4; i++) { rr(-76, 38 + i * 22, i === 3 ? 90 : 150, 11, 5); ctx.fillStyle = '#B9C6CF'; ctx.fill(); }
  ctx.restore();
}

/** the INDEX filing cabinet. s = 1 → 420x640. open 0..1 slides the middle drawer out (cards inside) */
export function indexCabinet(x, y, s, open = 0, sc = 1) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  rr(-210, -320, 420, 640, 30); ctx.fillStyle = C.pants; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(130, -320, 80, 640, [0, 30, 30, 0]); ctx.fillStyle = C.pantsShade; ctx.fill();
  for (let i = 0; i < 4; i++) {
    const dy = -290 + i * 152, out = i === 1 ? open * 130 : 0;
    if (out > 0) { for (let k = 0; k < 6; k++) { rr(-150 + k * 50, dy - out * 0.9 + 10, 40, 80, 6); ctx.fillStyle = k % 2 ? C.white : '#EEF2F6'; ctx.fill(); } }
    ctx.save(); ctx.translate(0, out * 0.25); const sz = 1 + out / 900; ctx.scale(sz, sz);
    rr(-180, dy, 330, 130, 18); ctx.fillStyle = '#2E3B58'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
    rr(-90, dy + 26, 150, 44, 8); ctx.fillStyle = C.white; ctx.fill();
    rr(-50, dy + 86, 70, 18, 9); ctx.fillStyle = C.yellow; ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

/** one ranked result card. 760x150 at s = 1. rank number badge, star if starP */
export function resultCard(x, y, s, rank, col, starP = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-380, -75, 760, 150, 30); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  circle(-300, 0, 48, rank === 1 ? C.yellow : C.ink);
  ctx.fillStyle = rank === 1 ? C.ink : C.white; ctx.font = '900 56px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(rank), -300, 4);
  rr(-220, -40, 300, 28, 14); ctx.fillStyle = col; ctx.fill();
  rr(-220, 6, 440, 18, 9); ctx.fillStyle = '#B9C6CF'; ctx.fill(); rr(-220, 36, 330, 18, 9); ctx.fill();
  if (starP > 0) star(300, 0, 52 * starP);
  ctx.restore();
}
/** five-point star (yellow, ink outline) */
export function star(x, y, r) {
  if (r <= 0) return;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr2 = i % 2 ? r * 0.45 : r; ctx.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2); }
  ctx.closePath(); ctx.fillStyle = C.yellow; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.lineJoin = 'round'; ctx.stroke();
}

/** a tiny server rack for grids. s = 1 → 80x120. lit 0..1 */
export function miniRack(x, y, s, lit = 0, t = 0, k = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-40, -60, 80, 120, 12); ctx.fillStyle = C.navy; ctx.fill();
  for (let i = 0; i < 3; i++) {
    rr(-30, -50 + i * 36, 60, 28, 6); ctx.fillStyle = C.pants; ctx.fill();
    const on = lit > 0.5 && Math.sin(t * 11 + k * 1.3 + i * 2) > -0.4;
    circle(18, -36 + i * 36, 7, on ? C.yellow : '#4A4220');
  }
  ctx.restore();
}
/** grid of mini racks. lit(k, col, row) → 0..1 */
export function serverGrid(x0, y0, cols, rows, dx, dy, s, t, lit) {
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const k = r * cols + c; miniRack(x0 + c * dx + (r % 2) * dx * 0.0, y0 + r * dy, s, lit(k, c, r), t, k); }
}
