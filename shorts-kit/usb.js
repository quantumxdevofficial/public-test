// Inside Out: FLASH MEMORY / USB STICK components (How Does a USB Stick Remember Your Files With No Power?).
// Flat fills, one darker shade, one light highlight, ink outlines on graphics.
// usbStick, flashChipBoard, memCellGrid, flashCell, electron, retroCamera, jailBars, FLASH_COLS
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

const BODY = '#3A7BD5', BODY_D = '#2F67BE', BODY_L = '#6FA0E6', METAL = '#B9C2CF', METAL_D = '#8E9AAB', METAL_L = '#E1E6EE';
const OXIDE = '#CFEFF6', OXIDE_D = '#9CD6E4', GATE = '#2F3A52', GATE_L = '#46536F', SILICON = '#9AA3B2', SILICON_D = '#7D8798';
const E_COL = '#3A7BD5', GREEN = '#3FAE5F';
export const FLASH_COLS = { BODY, METAL, OXIDE, GATE, E_COL, GREEN };

/** USB stick, side-on, connector to the right. s = 1 → ~700 x 190. o.cap 0..1 slides the connector out of view (unused),
 *  o.led 0..1 lights the little activity light, o.open 0..1 swaps the shell for a see-through x-ray outline with the board inside */
export function usbStick(x, y, s, rot = 0, o = {}) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.lineJoin = 'round';
  // connector
  rr(150, -62, 200, 124, 10); ctx.fillStyle = METAL; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.fillStyle = METAL_D; ctx.fillRect(160, 30, 180, 22);
  rr(220, -34, 36, 26, 4); ctx.fillStyle = C.ink; ctx.fill(); rr(286, -34, 36, 26, 4); ctx.fill();
  ctx.fillStyle = METAL_L; ctx.fillRect(166, -54, 170, 10);
  const open = o.open || 0;
  // body
  rr(-350, -95, 520, 190, 60);
  ctx.fillStyle = BODY; ctx.fill();
  ctx.save(); rr(-350, -95, 520, 190, 60); ctx.clip(); ctx.fillStyle = BODY_D; ctx.fillRect(-360, 40, 540, 70); ctx.restore();
  ell(-180, -52, 120, 16, BODY_L);
  // key ring hole
  circle(-290, 0, 26, C.bg); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.arc(-290, 0, 26, 0, TAU); ctx.stroke();
  rr(-350, -95, 520, 190, 60); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  if (open > 0) {
    ctx.save(); ctx.globalAlpha = open;
    rr(-350, -95, 520, 190, 60); ctx.fillStyle = C.navy; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.cyan; ctx.stroke();
    flashChipBoard(-60, 0, 1, o.chipGlow || 0);
    ctx.restore();
  }
  if ((o.led || 0) > 0) { ctx.save(); ctx.globalAlpha = o.led; circle(110, -55, 22, '#FFF6C2'); ctx.restore(); circle(110, -55, 11, C.yellow); }
  ctx.restore();
}

/** circuit board with one big memory chip (local, drawn inside usbStick when open). s = 1 → 420 x 140 */
export function flashChipBoard(x, y, s, glow = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-230, -62, 450, 124, 14); ctx.fillStyle = '#2E8A57'; ctx.fill();
  for (let k = 0; k < 7; k++) line([[-220 + k * 10, 46], [-160 + k * 30, 46]], '#5FC08A', 4);
  if (glow > 0) { ctx.save(); ctx.globalAlpha = 0.4 * glow; rr(-140, -60, 220, 120, 20); ctx.fillStyle = C.yellow; ctx.fill(); ctx.restore(); }
  for (let k = 0; k < 6; k++) { ctx.fillStyle = METAL; ctx.fillRect(-116 + k * 32, -58, 12, 10); ctx.fillRect(-116 + k * 32, 48, 12, 10); }
  rr(-130, -48, 200, 96, 10); ctx.fillStyle = C.ink; ctx.fill();
  ctx.fillStyle = C.white; ctx.font = '900 34px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('FLASH', -30, 2);
  rr(110, -30, 70, 60, 8); ctx.fillStyle = '#23262E'; ctx.fill();
  ctx.restore();
}

/** a grid of memory cells seen from above. fn(c, r) → 0 empty, 1 full (blue dot), or null hidden; pop 0..1 per grid */
export function memCellGrid(x, y, cols, rows, cell, fn = () => 0, sc = 1) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  const w = cols * cell, h = rows * cell;
  rr(-w / 2 - 20, -h / 2 - 20, w + 40, h + 40, 24); ctx.fillStyle = C.ink; ctx.fill();
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const v = fn(c, r); if (v == null) continue;
    const cx = -w / 2 + c * cell + cell / 2, cy = -h / 2 + r * cell + cell / 2, q = cell * 0.82;
    rr(cx - q / 2, cy - q / 2, q, q, q * 0.2); ctx.fillStyle = OXIDE; ctx.fill();
    rr(cx - q * 0.32, cy - q * 0.32, q * 0.64, q * 0.64, q * 0.14); ctx.fillStyle = GATE; ctx.fill();
    if (v > 0) { ctx.save(); ctx.globalAlpha = clamp(v); circle(cx, cy, q * 0.2, E_COL); circle(cx - q * 0.06, cy - q * 0.06, q * 0.06, C.white); ctx.restore(); }
  }
  ctx.restore();
}

/** one electron: blue ball with a white minus. r = radius */
export function electron(x, y, r = 22, a = 1) {
  if (a <= 0 || r <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  circle(x, y, r + 4, C.ink); circle(x, y, r, E_COL);
  line([[x - r * 0.45, y], [x + r * 0.45, y]], C.white, Math.max(3, r * 0.22));
  ctx.restore();
}

// fixed electron seats inside the floating gate (local coords)
const SEATS = [[-110, -40], [-40, -48], [30, -40], [100, -46], [-80, 10], [-10, 6], [60, 12], [125, 4]];
/** side cutaway of ONE flash cell. s = 1 → ~640 x 460, origin = floating-gate centre.
 *  o.n electrons seated (0..8, fractional = last one fading in) · o.t time (jiggle) · o.flow 0..1 current dots along the
 *  channel · o.blocked 0..1 red stop on the channel · o.labels true draws GATE / WALL / CHANNEL tags · o.wall 0..1 wall
 *  highlight (yellow outline) · o.bars 0..1 jail bars drop over the gate */
export function flashCell(x, y, s, o = {}) {
  if (s <= 0) return;
  const t = o.t || 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = 'round';
  // control gate + wire
  line([[0, -250], [0, -175]], C.ink, 12);
  rr(-170, -190, 340, 54, 12); ctx.fillStyle = METAL; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.fillStyle = METAL_L; ctx.fillRect(-160, -182, 320, 10);
  // channel (silicon) with source / drain
  rr(-320, 130, 640, 100, 18); ctx.fillStyle = SILICON; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.fillStyle = SILICON_D; ctx.fillRect(-312, 196, 624, 26);
  rr(-320, 130, 120, 100, 18); ctx.fillStyle = '#6E7A8C'; ctx.fill(); ctx.stroke();
  rr(200, 130, 120, 100, 18); ctx.fill(); ctx.stroke();
  // insulation wall (oxide) around the floating gate
  rr(-220, -125, 440, 245, 30); ctx.fillStyle = OXIDE; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.fillStyle = OXIDE_D; ctx.fillRect(-212, 92, 424, 20);
  if ((o.wall || 0) > 0) { ctx.save(); ctx.globalAlpha = o.wall; rr(-226, -131, 452, 257, 34); ctx.lineWidth = 14; ctx.strokeStyle = C.yellow; ctx.stroke(); ctx.restore(); }
  // floating gate
  rr(-170, -85, 340, 150, 18); ctx.fillStyle = GATE; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.fillStyle = GATE_L; ctx.fillRect(-160, -77, 320, 12);
  const n = clamp(o.n || 0, 0, 8);
  for (let k = 0; k < Math.ceil(n); k++) {
    const a = Math.min(1, n - k), [ex, ey] = SEATS[k];
    electron(ex + Math.sin(t * 7 + k * 1.9) * 5, ey + 4 + Math.cos(t * 6 + k) * 4, 22, a);
  }
  // current along the channel
  const flow = o.flow || 0;
  if (flow > 0) {
    ctx.save(); ctx.globalAlpha = flow;
    for (let k = 0; k < 7; k++) { const u = ((t * 0.9 + k / 7) % 1); circle(lerp(-300, 300, u), 172, 14, C.yellow); }
    ctx.restore();
  }
  const bl = o.blocked || 0;
  if (bl > 0) {
    ctx.save(); ctx.globalAlpha = bl;
    for (let k = 0; k < 3; k++) circle(-280 + k * 40 + Math.sin(t * 10 + k) * 4, 172, 14, C.yellow);
    rr(-40, 140, 80, 80, 14); ctx.fillStyle = C.red; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
    line([[-20, 160], [20, 200]], C.white, 10); line([[20, 160], [-20, 200]], C.white, 10);
    ctx.restore();
  }
  if ((o.bars || 0) > 0) jailBars(0, -10, 380, 190, o.bars);
  ctx.restore();
}

/** jail bars that drop into place over a w x h area centred at (x, y). p 0..1 */
export function jailBars(x, y, w, h, p = 1) {
  if (p <= 0) return;
  ctx.save(); ctx.translate(x, y - (1 - p) * h * 0.9);
  ctx.globalAlpha *= Math.min(1, p * 2);
  const n = 6;
  for (let k = 0; k < n; k++) {
    const bx = -w / 2 + (k + 0.5) * (w / n);
    rr(bx - 11, -h / 2 - 10, 22, h + 20, 10); ctx.fillStyle = '#5A606D'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
    ctx.fillStyle = '#8A919E'; ctx.fillRect(bx - 6, -h / 2, 5, h);
  }
  rr(-w / 2 - 10, -h / 2 - 26, w + 20, 30, 10); ctx.fillStyle = '#5A606D'; ctx.fill(); ctx.stroke();
  rr(-w / 2 - 10, h / 2 - 4, w + 20, 30, 10); ctx.fill(); ctx.stroke();
  ctx.restore();
}

/** old-school camera with a flash bulb on top. flash 0..1 fires a white burst. s = 1 → 420 x 300 */
export function retroCamera(x, y, s, flash = 0, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.lineJoin = 'round';
  if (flash > 0) {
    ctx.save(); ctx.globalAlpha = flash;
    ctx.beginPath();
    for (let k = 0; k < 24; k++) { const a = (k / 24) * TAU, r = k % 2 ? 140 : 330; ctx.lineTo(120 + Math.cos(a) * r, -180 + Math.sin(a) * r); }
    ctx.closePath(); ctx.fillStyle = '#FFF6C2'; ctx.fill();
    circle(120, -180, 120, C.white);
    ctx.restore();
  }
  // flash unit
  rr(60, -230, 120, 80, 12); ctx.fillStyle = '#5A606D'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(74, -218, 92, 50, 8); ctx.fillStyle = flash > 0 ? C.white : '#E8EEF5'; ctx.fill();
  // body
  rr(-210, -150, 420, 280, 34); ctx.fillStyle = '#3A3F4B'; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.save(); rr(-210, -150, 420, 280, 34); ctx.clip(); ctx.fillStyle = '#2C3039'; ctx.fillRect(-220, 60, 440, 80); ctx.fillStyle = '#C8734A'; ctx.fillRect(-220, -60, 440, 100); ctx.restore();
  rr(-210, -150, 420, 280, 34); ctx.stroke();
  rr(-180, -190, 90, 44, 10); ctx.fillStyle = C.red; ctx.fill(); ctx.stroke();
  // lens
  circle(0, -5, 112, C.ink); circle(0, -5, 98, METAL); circle(0, -5, 70, '#23262E'); circle(0, -5, 40, '#2F3A52'); circle(-18, -24, 14, C.white);
  ctx.restore();
}
