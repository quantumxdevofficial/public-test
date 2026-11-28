// Keyboard matrix components (How does your keyboard know which key you pressed?):
// kbBoard, kbKeyXY, KB_QWERTY, KB_AZERTY, KB_CODES, matrixGrid, matrixXY, crossClose, crossroads, layoutCard,
// lookupCard, typedScreen. Flat fills, one darker shade, one light highlight, ink outlines on graphics.
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

const KW = 84, KH = 108, PITCH = 96, RSTEP = 126;
const ROWWIRE = '#F29A3A', COLWIRE = C.cyan, GREEN = '#5BAE6A', ROAD = '#6E7686';
export const KB_QWERTY = ['QWERTYUIOP'.split(''), 'ASDFGHJKL'.split(''), 'ZXCVBNM'.split('')];
export const KB_AZERTY = ['AZERTYUIOP'.split(''), 'QSDFGHJKLM'.split('').slice(0, 9), 'WXCVBN,'.split('')];
// USB HID usage IDs (Keyboard/Keypad page): a = 4 … z = 29
const hid = (ch) => String(ch.charCodeAt(0) - 61);
export const KB_CODES = KB_QWERTY.map((r) => r.map(hid));

const keyX = (r, c) => -438 + [0, PITCH / 2, PITCH * 1.5][r] + c * PITCH;
const keyY = (r) => -136 + r * RSTEP;
/** centre of key (row r, column c) for a kbBoard drawn at (x, y, s) */
export function kbKeyXY(x, y, s, r, c) { return [x + s * keyX(r, c), y + s * keyY(r)]; }

/** flat keyboard, s = 1 → 1000 x 420, origin = centre. o = { rows (labels), hi: {'r,c': 'y'|'r'|'ring'}, press: {'r,c': 0..1},
 *  a (key alpha, for x-ray reveals), size (label font px) } */
export function kbBoard(x, y, s, o = {}) {
  if (s <= 0) return;
  const rows = o.rows || KB_QWERTY, hi = o.hi || {}, press = o.press || {}, a = o.a ?? 1;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha = a;
  rr(-500, -210, 1000, 420, 40); ctx.fillStyle = '#D9DDE3'; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  rows.forEach((row, r) => row.forEach((lab, c) => {
    const k = r + ',' + c, h = hi[k], pr = press[k] || 0, kx = keyX(r, c) - KW / 2, ky = keyY(r) - KH / 2;
    rr(kx, ky + 6, KW, KH, 14); ctx.fillStyle = '#AEB4BE'; ctx.fill();
    rr(kx, ky + pr * 6, KW, KH, 14); ctx.fillStyle = h === 'y' ? C.yellow : h === 'r' ? C.red : C.white; ctx.fill();
    if (h === 'ring') { ctx.lineWidth = 9; ctx.strokeStyle = C.yellow; ctx.stroke(); }
    ctx.font = `800 ${o.size || (String(lab).length > 1 ? 44 : 54)}px Inter`;
    ctx.fillStyle = h === 'r' ? C.white : C.ink; ctx.fillText(lab, kx + KW / 2, ky + KH / 2 + 2 + pr * 6);
  }));
  rr(-260, 154, 520, 44, 14); ctx.fillStyle = C.white; ctx.fill();
  ctx.restore();
}

/** position of matrix crossing (column c, row r) for a matrixGrid at (x, y, s) — lines up with kbBoard's top row */
export function matrixXY(x, y, s, c, r) { return [x + s * (-438 + c * PITCH), y + s * keyY(r)]; }
/** the hidden wire grid: 10 columns x 3 rows, same scale as kbBoard. o = { rowP, colP (draw progress 0..1), rowHi, colHi
 *  (index lit yellow), scan (row index lit, fractional = between), hit: [c, r], hitP 0..1, a, pads } */
export function matrixGrid(x, y, s, o = {}) {
  if (s <= 0) return;
  const rowP = o.rowP ?? 1, colP = o.colP ?? 1;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha = o.a ?? 1; ctx.lineCap = 'round';
  for (let c = 0; c < 10; c++) {
    const cx = -438 + c * PITCH, lit = o.colHi === c, p = clamp(colP * 1.6 - c * 0.06);
    if (p > 0) line([[cx, -200], [cx, lerp(-200, 200, p)]], lit ? C.yellow : COLWIRE, lit ? 16 : 10);
  }
  for (let r = 0; r < 3; r++) {
    const ry = keyY(r), lit = o.rowHi === r || (o.scan != null && Math.round(o.scan) === r), p = clamp(rowP * 1.6 - r * 0.25);
    if (p > 0) line([[-490, ry], [lerp(-490, 480, p), ry]], lit ? C.yellow : ROWWIRE, lit ? 16 : 10);
  }
  if (o.pads !== false && rowP > 0.9 && colP > 0.9) for (let c = 0; c < 10; c++) for (let r = 0; r < 3; r++) circle(-438 + c * PITCH, keyY(r), 12, C.ink);
  if (o.hit && (o.hitP ?? 1) > 0) {
    const [hc, hr] = o.hit, p = o.hitP ?? 1, hx = -438 + hc * PITCH, hy = keyY(hr);
    ctx.globalAlpha = 0.35 * p; circle(hx, hy, 70 * p, C.yellow); ctx.globalAlpha = 1; circle(hx, hy, 22, C.yellow);
    ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.arc(hx, hy, 22, 0, TAU); ctx.stroke();
  }
  ctx.restore();
}

/** close-up of one crossing with its key above, side-cut. press 0..1 pushes the key, conn 0..1 lights the contact.
 *  s = 1 → ~700 px wide. rowLit / colLit 0..1 light the two wires */
export function crossClose(x, y, s, press = 0, conn = 0, rowLit = 0, colLit = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineCap = 'round';
  // row wire across, column wire down (front view of the crossing)
  line([[-360, 120], [360, 120]], rowLit > 0.5 ? C.yellow : ROWWIRE, 26);
  line([[0, -40], [0, 460]], colLit > 0.5 ? C.yellow : COLWIRE, 26);
  // contact pad: two halves that meet when pressed
  const gap = lerp(34, 0, conn);
  rr(-70, 120 - 40 - gap, 140, 30, 12); ctx.fillStyle = conn > 0.95 ? C.yellow : '#C9CDD6'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
  circle(0, 120, 40, conn > 0.95 ? C.yellow : '#8E96A6'); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.arc(0, 120, 40, 0, TAU); ctx.stroke();
  if (conn > 0.95) { ctx.globalAlpha = 0.35; circle(0, 120, 110, C.yellow); ctx.globalAlpha = 1; }
  // key + stem above
  const dy = press * 60;
  rr(-20, -150 + dy, 40, 120, 10); ctx.fillStyle = '#9AA1AE'; ctx.fill();
  rr(-150, -330 + dy, 300, 190, 34); ctx.fillStyle = '#AEB4BE'; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-150, -350 + dy, 300, 170, 34); ctx.fillStyle = C.white; ctx.fill(); ctx.stroke();
  rr(-125, -336 + dy, 250, 24, 12); ctx.fillStyle = '#F1F1F4'; ctx.fill();
  ctx.fillStyle = C.ink; ctx.font = '900 96px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('K', 0, -262 + dy);
  ctx.restore();
}

/** a tiny road crossroads (two grey roads, dashed lines, a yellow car). s = 1 → 420 px square. car 0..1 drives across */
export function crossroads(x, y, s, car = 0.5) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-210, -210, 420, 420, 40); ctx.fillStyle = '#9BD08A'; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.save(); rr(-210, -210, 420, 420, 40); ctx.clip();
  ctx.fillStyle = ROAD; ctx.fillRect(-210, -60, 420, 120); ctx.fillRect(-60, -210, 120, 420);
  ctx.setLineDash([26, 20]); ctx.lineWidth = 8; ctx.strokeStyle = C.white;
  ctx.beginPath(); ctx.moveTo(-210, 0); ctx.lineTo(-70, 0); ctx.moveTo(70, 0); ctx.lineTo(210, 0); ctx.moveTo(0, -210); ctx.lineTo(0, -70); ctx.moveTo(0, 70); ctx.lineTo(0, 210); ctx.stroke();
  ctx.setLineDash([]);
  const cx = lerp(-260, 260, car);
  rr(cx - 46, 8, 92, 44, 12); ctx.fillStyle = C.yellow; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(cx - 22, 14, 44, 18, 6); ctx.fillStyle = '#BFE3F2'; ctx.fill();
  ctx.restore(); ctx.restore();
}

/** settings card "Keyboard layout" with two options; sel 0..1 moves the selection from English (US) to French */
export function layoutCard(x, y, s, sel = 0, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  rr(-360, -260, 720, 520, 40); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-360, -260, 720, 120, [40, 40, 0, 0]); ctx.fillStyle = '#E9ECF1'; ctx.fill();
  // gear
  ctx.save(); ctx.translate(-280, -200); for (let i = 0; i < 8; i++) { ctx.rotate(TAU / 8); rr(-9, -38, 18, 20, 4); ctx.fillStyle = '#6E7686'; ctx.fill(); } circle(0, 0, 26, '#6E7686'); circle(0, 0, 10, '#E9ECF1'); ctx.restore();
  ctx.fillStyle = C.ink; ctx.font = '900 54px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('LAYOUT', -220, -198);
  const opts = ['ENGLISH (US)', 'FRENCH'];
  opts.forEach((t, i) => {
    const yy = -50 + i * 170, on = i === 0 ? 1 - sel : sel;
    rr(-320, yy - 70, 640, 140, 30); ctx.fillStyle = on > 0.5 ? '#FFF3C4' : '#F4F1EA'; ctx.fill();
    circle(-240, yy, 36, C.white); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.arc(-240, yy, 36, 0, TAU); ctx.stroke();
    if (on > 0.05) circle(-240, yy, 20 * on, C.ink);
    ctx.fillStyle = C.ink; ctx.font = '900 56px Inter'; ctx.fillText(t, -180, yy + 2);
  });
  ctx.restore();
}

/** the computer's lookup table card: rows [code, letter]; hi = highlighted row index, hiP 0..1 */
export function lookupCard(x, y, s, rows, hi = -1, hiP = 1, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  const h = 120 + rows.length * 110;
  rr(-260, -h / 2, 520, h, 34); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.textBaseline = 'middle';
  rows.forEach(([code, lab], i) => {
    const yy = -h / 2 + 100 + i * 110;
    if (i === hi && hiP > 0) { rr(-230, yy - 48, 460, 96, 22); ctx.fillStyle = C.yellow; ctx.globalAlpha = hiP; ctx.fill(); ctx.globalAlpha = 1; }
    ctx.fillStyle = C.ink; ctx.font = "900 70px 'DejaVu Sans Mono', monospace"; ctx.textAlign = 'center'; ctx.fillText(code, -120, yy + 2);
    ctx.font = '900 60px Inter'; ctx.fillText('→', 0, yy);
    ctx.font = '900 76px Inter'; ctx.fillText(lab, 130, yy + 2);
  });
  ctx.restore();
}

/** text-editor screen for K.monitor (local coords -350..350, -210..210): typed text + blinking caret */
export function typedScreen(text = '', t = 0, col = C.ink, size = 150) {
  rr(-350, -210, 700, 60, 0); ctx.fillStyle = '#3A7BD5'; ctx.fill();
  for (const [i, c] of [[0, C.red], [1, C.yellow], [2, GREEN]]) circle(-320 + i * 30, -180, 9, c);
  ctx.fillStyle = col; ctx.font = `900 ${size}px Inter`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText(text, -300, 30);
  const w = ctx.measureText(text).width;
  if (Math.floor(t * 2.5) % 2 === 0) { rr(-300 + w + 10, 30 - size * 0.42, 12, size * 0.84, 4); ctx.fillStyle = C.ink; ctx.fill(); }
}
