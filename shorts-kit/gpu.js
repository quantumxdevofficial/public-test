// GPU topic components (What Actually Is a GPU?): flat Inside Out look.
// gpuCard, gpuChip, worker, workerCrowd, pixelScreen, sceneColor, stepTiles, matrixCard, gamepad
import { ctx, C, lerp, clamp, rr, circle, ell, line, TAU } from './lib.js';

const GREEN = '#5BAE6A', GREEN_D = '#3F8A4E', CHIP = '#2E3440', CHIP_L = '#454D5C', GOLD = '#E6B82E', OFF = '#3A4150';
const BOARD = '#2B3A55', BOARD_D = '#1F2B40';

/** a graphics card seen from the side: shroud with two spinning fans, gold contacts. s = 1 → 820x360. glow 0..1 lights the stripe */
export function gpuCard(x, y, s, t = 0, glow = 0, label = 'GPU') {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // pcb + gold fingers + bracket
  rr(-380, 120, 700, 60, 10); ctx.fillStyle = GREEN_D; ctx.fill();
  for (let i = 0; i < 14; i++) { rr(-300 + i * 30, 170, 20, 34, 4); ctx.fillStyle = GOLD; ctx.fill(); }
  rr(-430, -170, 50, 360, 10); ctx.fillStyle = '#9AA1AE'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
  // shroud
  rr(-390, -160, 780, 300, 40); ctx.fillStyle = BOARD; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-390, 90, 780, 50, [0, 0, 40, 40]); ctx.fillStyle = BOARD_D; ctx.fill();
  // glow stripe
  rr(-360, 100, 720, 18, 9); ctx.fillStyle = glow > 0.5 ? C.yellow : '#3E4E6E'; ctx.fill();
  // fans
  for (const fx of [-190, 190]) {
    circle(fx, -10, 118, BOARD_D); circle(fx, -10, 104, '#56637E');
    ctx.save(); ctx.translate(fx, -10); ctx.rotate(t * 9 + (fx > 0 ? 0.5 : 0));
    for (let k = 0; k < 7; k++) { ctx.rotate(TAU / 7); ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(60, -30, 96, 8); ctx.quadraticCurveTo(50, 10, 0, 0); ctx.fillStyle = '#7B88A3'; ctx.fill(); }
    ctx.restore();
    circle(fx, -10, 30, CHIP); circle(fx - 8, -18, 8, '#56637E');
  }
  if (label) { rr(-62, -140, 124, 52, 14); ctx.fillStyle = C.yellow; ctx.fill(); ctx.fillStyle = C.ink; ctx.font = '900 38px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, -112); }
  ctx.restore();
}

/** a GPU chip from above packed with tiny cores. cols x rows cells; fill 0..1 = share of cores present; busy(i, j) 0..1 lights a core */
export function gpuChip(x, y, s, cols = 16, rows = 16, fill = 1, busy = () => 0, label = '') {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (let i = 0; i < 9; i++) { const k = -240 + i * 60;
    rr(k - 10, -330, 20, 46, 5); ctx.fillStyle = GOLD; ctx.fill(); rr(k - 10, 284, 20, 46, 5); ctx.fill();
    rr(-330, k - 10, 46, 20, 5); ctx.fill(); rr(284, k - 10, 46, 20, 5); ctx.fill(); }
  rr(-290, -290, 580, 580, 36); ctx.fillStyle = GREEN_D; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-260, -260, 520, 520, 22); ctx.fillStyle = CHIP; ctx.fill();
  const cell = 500 / Math.max(cols, rows);
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const h = ((i * 73 + j * 151) % 97) / 97; if (h >= fill) continue;
    const b = clamp(busy(i, j));
    rr(-250 + i * cell + cell * 0.14, -250 + j * cell + cell * 0.14, cell * 0.72, cell * 0.72, cell * 0.16);
    ctx.fillStyle = b > 0.5 ? C.yellow : OFF; ctx.fill();
  }
  if (label) { rr(-120, -42, 240, 84, 20); ctx.fillStyle = C.ink; ctx.fill(); ctx.fillStyle = C.white; ctx.font = '900 56px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, 2); }
  ctx.restore();
}

/** a little worker (one core). s = 1 → ~140x220. col = shirt, glasses = smart look, hold = colour of the block in its hands (null = none), bob 0..1 */
export function worker(x, y, s, col = C.shirt, o = {}) {
  if (s <= 0) return;
  const { glasses = false, hold = null, bob = 0, mouth = 'smile', eyes = 'n' } = o;
  ctx.save(); ctx.translate(x, y - bob * 18); ctx.scale(s, s);
  rr(-52, 10, 104, 110, [40, 40, 14, 14]); ctx.fillStyle = col; ctx.fill();
  rr(-40, 110, 34, 40, 8); ctx.fillStyle = C.pants; ctx.fill(); rr(6, 110, 34, 40, 8); ctx.fill();
  circle(0, -40, 56, C.skin); ell(0, -78, 56, 26, C.hair);
  for (const sd of [-1, 1]) {
    if (eyes === 'wink' && sd > 0) { ctx.beginPath(); ctx.moveTo(sd * 20 - 9, -38); ctx.quadraticCurveTo(sd * 20, -46, sd * 20 + 9, -38); ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.lineCap = 'round'; ctx.stroke(); }
    else { ell(sd * 20, -38, 6, 8, C.ink); circle(sd * 20 + 2, -41, 2.4, C.white); }
    if (glasses) { ctx.beginPath(); ctx.arc(sd * 20, -38, 16, 0, TAU); ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.stroke(); }
  }
  if (glasses) line([[-4, -40], [4, -40]], C.ink, 5);
  ctx.beginPath();
  if (mouth === 'o') { ell(0, -12, 8, 10, C.mouth); }
  else { ctx.moveTo(-14, -16); ctx.quadraticCurveTo(0, -4, 14, -16); ctx.strokeStyle = C.mouth; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.stroke(); }
  if (hold) { line([[-40, 40], [-20, 64]], C.skin, 16); line([[40, 40], [20, 64]], C.skin, 16); rr(-30, 50, 60, 52, 10); ctx.fillStyle = hold; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.stroke(); }
  ctx.restore();
}

/** a grid crowd of tiny workers. holdFn(i, j) → colour or null, bobFn(i, j) → 0..1 */
export function workerCrowd(x, y, cols, rows, gap, s, holdFn = () => null, bobFn = () => 0, pop = 1) {
  const cols4 = [C.shirt, '#5BAE6A', '#E57A8A', '#F29A3A', '#B07CD8'];
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const p = clamp(pop * 1.6 - ((i * 7 + j * 13) % 11) / 11 * 0.6); if (p <= 0) continue;
    worker(x - (cols - 1) * gap / 2 + i * gap, y - (rows - 1) * gap / 2 + j * gap * 1.15, s * p, cols4[(i + j * 2) % 5], { hold: holdFn(i, j), bob: bobFn(i, j) });
  }
}

/** a colour for pixel (i, j) of a small landscape (sky, sun, hills); u 0..1 nudges the sun across */
export function sceneColor(i, j, cols, rows, u = 0) {
  const fx = i / cols, fy = j / rows, sx = lerp(0.25, 0.75, u), sy = lerp(0.42, 0.28, Math.sin(u * Math.PI));
  if (Math.hypot(fx - sx, (fy - sy) * rows / cols) < 0.11) return C.yellow;
  const hill = 0.62 + 0.08 * Math.sin(fx * 7 + 1);
  if (fy > hill + 0.12) return '#3F8A4E';
  if (fy > hill) return GREEN;
  return fy < 0.3 ? '#7EC8E8' : C.sky;
}

/** a monitor whose picture is a grid of chunky pixels. colorFn(i, j) → colour or null (dark); grid = pixel grid line alpha */
export function pixelScreen(x, y, s, cols, rows, colorFn, grid = 0.5, stand = true) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const w = 760, h = w * rows / cols;
  if (stand) { rr(-40, h / 2 + 30, 80, 90, 6); ctx.fillStyle = '#9AA1AE'; ctx.fill(); rr(-160, h / 2 + 110, 320, 30, 14); ctx.fill(); }
  rr(-w / 2 - 30, -h / 2 - 30, w + 60, h + 60, 30); ctx.fillStyle = C.ink; ctx.fill();
  const c = w / cols;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    ctx.fillStyle = colorFn(i, j) || '#202634'; ctx.fillRect(-w / 2 + i * c, -h / 2 + j * c, c + 0.6, c + 0.6);
  }
  if (grid > 0) {
    ctx.globalAlpha = grid; ctx.strokeStyle = C.ink; ctx.lineWidth = Math.max(1.5, c * 0.08);
    ctx.beginPath();
    for (let i = 1; i < cols; i++) { ctx.moveTo(-w / 2 + i * c, -h / 2); ctx.lineTo(-w / 2 + i * c, h / 2); }
    for (let j = 1; j < rows; j++) { ctx.moveTo(-w / 2, -h / 2 + j * c); ctx.lineTo(w / 2, -h / 2 + j * c); }
    ctx.stroke(); ctx.globalAlpha = 1;
  }
  ctx.restore();
}

/** a row of numbered task tiles; done 0..n (fractional = current tile pops), active tile yellow */
export function stepTiles(x, y, s, n, done) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const g = 170; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '900 70px Inter';
  for (let k = 0; k < n; k++) {
    const px = -(n - 1) * g / 2 + k * g, state = done >= k + 1 ? 2 : done > k ? 1 : 0;
    ctx.save(); ctx.translate(px, 0); if (state === 1) ctx.scale(1.15, 1.15);
    rr(-66, -66, 132, 132, 24); ctx.fillStyle = state === 2 ? GREEN : state === 1 ? C.yellow : C.white; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
    ctx.fillStyle = state === 2 ? C.white : C.ink; ctx.fillText(state === 2 ? '✓' : String(k + 1), 0, 4); ctx.restore();
    if (k < n - 1) { ctx.beginPath(); ctx.moveTo(px + 76, -14); ctx.lineTo(px + 94, 0); ctx.lineTo(px + 76, 14); ctx.fillStyle = '#B9AE98'; ctx.fill(); }
  }
  ctx.restore();
}

/** a card full of small multiplications "a×b"; lit(i, j) 0..1 turns a cell yellow (answer shown) */
export function matrixCard(x, y, s, cols, rows, lit = () => 0, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  const cw = 150, ch = 96, w = cols * cw, h = rows * ch;
  rr(-w / 2 - 30, -h / 2 - 30, w + 60, h + 60, 30); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '900 40px Inter';
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const a = 2 + ((i * 3 + j * 5) % 8), b = 2 + ((i * 7 + j * 2) % 7), on = clamp(lit(i, j)) > 0.5;
    const cx = -w / 2 + i * cw + cw / 2, cy = -h / 2 + j * ch + ch / 2;
    rr(cx - cw / 2 + 8, cy - ch / 2 + 8, cw - 16, ch - 16, 14); ctx.fillStyle = on ? C.yellow : '#EDE7DA'; ctx.fill();
    ctx.fillStyle = C.ink; ctx.fillText(on ? String(a * b) : `${a}×${b}`, cx, cy + 2);
  }
  ctx.restore();
}

/** a flat game controller. s = 1 → 420x240 */
export function gamepad(x, y, s, rot = 0, t = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-120, -90); ctx.lineTo(120, -90); ctx.quadraticCurveTo(210, -90, 220, 20); ctx.quadraticCurveTo(230, 130, 160, 120);
  ctx.quadraticCurveTo(110, 115, 80, 60); ctx.lineTo(-80, 60); ctx.quadraticCurveTo(-110, 115, -160, 120); ctx.quadraticCurveTo(-230, 130, -220, 20); ctx.quadraticCurveTo(-210, -90, -120, -90); ctx.closePath();
  ctx.fillStyle = '#56637E'; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-150, -22, 90, 30, 6); ctx.fillStyle = C.ink; ctx.fill(); rr(-120, -52, 30, 90, 6); ctx.fill();
  const press = Math.floor(t * 4) % 4;
  [[120, -40, C.yellow], [160, -2, C.red], [120, 36, GREEN], [80, -2, C.cyan]].forEach(([bx, by, c], k) => circle(bx, by + (k === press ? 3 : 0), 20, k === press ? C.white : c));
  ctx.restore();
}
