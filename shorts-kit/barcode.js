// Barcode components (How Does a Barcode Actually Work?): flat Inside Out look.
// upcModules, barcode, barcodeX, scanGun, scanBeam, snackBag, checkout, onOffWave, priceTable, beach, sandMorse, gumPack, digitBox
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

export const BEAM_RED = '#FF3B4A', SAND = '#F2D49B', SAND_D = '#D9B676', SEA = '#4FA9D9', SEA_D = '#3A8FC0';
export const UPC = '036000291452';   // a valid UPC-A (check digit 2)
const T = (txt, x, y, size, col, align = 'center', weight = 900) => {
  ctx.font = `${weight} ${size}px Inter`; ctx.fillStyle = col; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(txt, x, y);
};
const LC = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'];
const inv = (s) => s.split('').map((b) => (b === '1' ? '0' : '1')).join('');

/** real UPC-A module list (95 modules, 1 = black) + guard flags + digit index of each module (-1 = guard) */
export function upcModules(code = UPC) {
  const m = [], g = [], di = [];
  const push = (bits, guard, d) => { for (const b of bits) { m.push(+b); g.push(guard); di.push(d); } };
  push('101', true, -1);
  for (let k = 0; k < 6; k++) push(LC[+code[k]], false, k);
  push('01010', true, -1);
  for (let k = 6; k < 12; k++) push(inv(LC[+code[k]]), false, k);
  push('101', true, -1);
  return { m, g, di };
}
const MODS = upcModules();

/** x of module edge k for a barcode centred at x with width w (95 modules) */
export const barcodeX = (x, w, k) => x - w / 2 + (k / 95) * w;

/** white label with a real UPC-A. (x, y) = centre of the bars, w x h bars.
 * o: { reveal 0..1 (bars drawn left→right), digits (bool), hiDigit (index lit yellow), hiP 0..1, checkP 0..1 (last digit ringed),
 *      label (bool white card), sc (pop) , stretch 0..1 (bars grow down from short dashes, for the Morse shot) } */
export function barcode(x, y, w, h, o = {}) {
  const { reveal = 1, digits = true, hiDigit = -1, hiP = 1, checkP = 0, label = true, sc = 1, ink = C.ink } = o;
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.translate(-x, -y);
  const mw = w / 95;
  if (label) {
    ctx.save(); ctx.globalAlpha = 0.14; rr(x - w / 2 - 70 + 12, y - h / 2 - 50 + 14, w + 140, h + (digits ? 170 : 100), 26); ctx.fillStyle = C.ink; ctx.fill(); ctx.restore();
    rr(x - w / 2 - 70, y - h / 2 - 50, w + 140, h + (digits ? 170 : 100), 26); ctx.fillStyle = C.white; ctx.fill();
  }
  if (hiDigit >= 0 && hiP > 0) {
    const ks = MODS.di.indexOf(hiDigit), ke = MODS.di.lastIndexOf(hiDigit) + 1;
    ctx.save(); ctx.globalAlpha = clamp(hiP); rr(barcodeX(x, w, ks) - 6, y - h / 2 - 16, (ke - ks) * mw + 12, h + 32, 10); ctx.fillStyle = C.yellow; ctx.fill(); ctx.restore();
  }
  const n = Math.floor(95 * clamp(reveal));
  ctx.fillStyle = ink;
  for (let k = 0; k < n; k++) {
    if (!MODS.m[k]) continue;
    const hh = MODS.g[k] ? h + 40 : h;
    ctx.fillRect(barcodeX(x, w, k), y - h / 2, mw + 0.6, hh);
  }
  if (digits && reveal >= 1) {
    const fs = Math.max(20, mw * 6.2);
    T(UPC[0], barcodeX(x, w, 0) - fs * 0.6, y + h / 2 + fs * 0.75, fs * 0.8, ink);
    for (let k = 1; k < 11; k++) {
      const ks = MODS.di.indexOf(k), ke = MODS.di.lastIndexOf(k) + 1;
      T(UPC[k], (barcodeX(x, w, ks) + barcodeX(x, w, ke)) / 2, y + h / 2 + fs * 0.75, fs, k === hiDigit ? C.ink : ink);
    }
    T(UPC[11], barcodeX(x, w, 95) + fs * 0.6, y + h / 2 + fs * 0.75, fs * 0.8, ink);
    if (checkP > 0) {
      ctx.save(); ctx.globalAlpha = clamp(checkP); ctx.lineWidth = 9; ctx.strokeStyle = C.red;
      ctx.beginPath(); ctx.arc(barcodeX(x, w, 95) + fs * 0.6, y + h / 2 + fs * 0.75, fs * 0.75 * lerp(1.6, 1, clamp(checkP)), 0, TAU); ctx.stroke(); ctx.restore();
    }
  }
  ctx.restore();
}

/** the red scan line across a barcode at module position u 0..1 (or a fixed line when sweep < 0 → whole fan) */
export function scanBeam(x, y, w, h, u = 0.5, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(a);
  const lx = x - w / 2 - 40, rx = x + w / 2 + 40;
  ctx.fillStyle = 'rgba(255,59,74,0.25)'; ctx.fillRect(lx, y - 14, rx - lx, 28);
  ctx.fillStyle = BEAM_RED; ctx.fillRect(lx, y - 5, rx - lx, 10);
  const px = lerp(lx, rx, clamp(u));
  circle(px, y, 22, 'rgba(255,59,74,0.35)'); circle(px, y, 11, '#FFE1E4');
  ctx.restore();
}

/** handheld scanner gun. s = 1 → ~300 x 420. window faces down-left at angle rot. beam 0..1 shows the red fan to (bx, by) in world px */
export function scanGun(x, y, s, rot = 0, beam = 0, bx = null, by = null, bw = 360) {
  if (beam > 0 && bx !== null) {
    // fan from the window (approx world pos) to a horizontal line at (bx, by)
    const c = Math.cos(rot), sn = Math.sin(rot), wx = x + (-120 * c - 40 * sn) * s, wy = y + (-120 * sn + 40 * c) * s;
    ctx.save(); ctx.globalAlpha = 0.32 * clamp(beam); ctx.fillStyle = BEAM_RED;
    ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(bx - bw / 2, by); ctx.lineTo(bx + bw / 2, by); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.save(); ctx.globalAlpha = clamp(beam); ctx.fillStyle = BEAM_RED; ctx.fillRect(bx - bw / 2, by - 5, bw, 10); ctx.restore();
  }
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  // handle
  ctx.save(); ctx.translate(40, 60); ctx.rotate(0.28); rr(-50, 0, 100, 250, 40); ctx.fillStyle = '#2B3245'; ctx.fill(); rr(10, 0, 40, 250, [0, 40, 40, 0]); ctx.fillStyle = '#232A3B'; ctx.fill(); ctx.restore();
  // trigger
  rr(-34, 70, 30, 70, 14); ctx.fillStyle = C.yellow; ctx.fill();
  // head
  rr(-160, -60, 320, 140, 60); ctx.fillStyle = '#3D4660'; ctx.fill();
  rr(-160, 20, 320, 60, [0, 0, 60, 60]); ctx.fillStyle = '#2F3750'; ctx.fill();
  rr(-176, -44, 40, 108, 18); ctx.fillStyle = BEAM_RED; ctx.fill();
  rr(-170, -36, 14, 40, 7); ctx.fillStyle = '#FF9AA2'; ctx.fill();
  circle(90, -14, 12, '#5BAE6A');
  ctx.restore();
}

/** snack bag (generic). s = 1 → 360 x 480. col bag colour. back = show a barcode panel instead of the front art */
export function snackBag(x, y, s, rot = 0, col = '#F29A3A', back = false, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * sc, s * sc);
  ctx.beginPath(); ctx.moveTo(-170, -220); for (let k = 0; k <= 8; k++) ctx.lineTo(-170 + k * 42.5, k % 2 ? -236 : -220);
  ctx.lineTo(180, 220); for (let k = 8; k >= 0; k--) ctx.lineTo(-170 + k * 42.5 + 5, k % 2 ? 236 : 220); ctx.closePath();
  ctx.fillStyle = col; ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.10)'; ctx.fillRect(90, -220, 90, 440);
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(-150, -180, 26, 340);
  if (back) { barcode(0, 40, 220, 120, { digits: false, label: true }); T('NUTRITION', 0, -130, 34, C.white); }
  else { circle(0, -20, 110, C.yellow); T('CHIPS', 0, -20, 66, C.ink); T('CRUNCHY', 0, 140, 34, C.white); }
  ctx.restore();
}

/** checkout background: wall, counter top at y = top, black conveyor belt with moving stripes (t) */
export function checkout(t = 0, top = 1180) {
  ctx.fillStyle = '#EAF1F4'; ctx.fillRect(-300, -300, 1680, top + 300);
  ctx.fillStyle = '#DDE7EC'; for (let k = 0; k < 6; k++) ctx.fillRect(-300 + k * 360, -300, 180, top + 300);
  ctx.fillStyle = '#C8734A'; ctx.fillRect(-300, top, 1680, 900);
  ctx.fillStyle = '#B5653F'; ctx.fillRect(-300, top + 60, 1680, 20);
  ctx.fillStyle = '#2B2F3A'; ctx.fillRect(-300, top - 30, 1680, 60);
  ctx.fillStyle = '#3A3F4D'; const off = (t * 220) % 120; for (let k = -2; k < 18; k++) ctx.fillRect(-300 + k * 120 + off, top - 30, 12, 60);
}

/** on/off square-wave strip under a barcode: high where white (light back), low where black. reveal 0..1. x0..x0+w */
export function onOffWave(x, y, w, hgt, reveal = 1, col = C.yellow) {
  const mw = w / 95, n = Math.floor(95 * clamp(reveal));
  if (n <= 0) return;
  ctx.save(); ctx.lineWidth = 10; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.strokeStyle = col;
  ctx.beginPath();
  for (let k = 0; k < n; k++) {
    const yy = MODS.m[k] ? y + hgt / 2 : y - hgt / 2, xx = x - w / 2 + k * mw;
    if (k === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
    ctx.lineTo(xx + mw, yy);
  }
  ctx.stroke(); ctx.restore();
}

/** price lookup table card. rows = [[code, name, price]]. hi = row index lit, hiP 0..1. s = 1 → 760 wide */
export function priceTable(x, y, s, rows, hi = -1, hiP = 0, sc = 1) {
  if (s * sc <= 0) return;
  const rh = 96, w = 760, h = 110 + rows.length * rh;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  ctx.save(); ctx.globalAlpha = 0.15; rr(-w / 2 + 14, -h / 2 + 18, w, h, 30); ctx.fillStyle = C.ink; ctx.fill(); ctx.restore();
  rr(-w / 2, -h / 2, w, h, 30); ctx.fillStyle = C.white; ctx.fill();
  rr(-w / 2, -h / 2, w, 90, [30, 30, 0, 0]); ctx.fillStyle = C.navy; ctx.fill();
  T('STORE DATABASE', 0, -h / 2 + 46, 40, C.white);
  rows.forEach((r, i) => {
    const yy = -h / 2 + 110 + i * rh + rh / 2 - 10;
    if (i === hi && hiP > 0) { ctx.save(); ctx.globalAlpha = clamp(hiP); rr(-w / 2 + 16, yy - rh / 2 + 6, w - 32, rh - 12, 18); ctx.fillStyle = C.yellow; ctx.fill(); ctx.restore(); }
    T(r[0], -w / 2 + 40, yy, 34, '#5A6070', 'left', 800);
    T(r[1], 90, yy, 38, C.ink, 'left');
    T(r[2], w / 2 - 40, yy, 40, '#2F8A4A', 'right');
  });
  ctx.restore();
}

/** small digit box (a number tile) */
export function digitBox(x, y, s, d, col = C.white, fg = C.ink, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  rr(-40, -54, 80, 108, 16); ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  T(String(d), 0, 4, 66, fg);
  ctx.restore();
}

/** beach background: sky, sea with moving wave line (t), sand from y = top down */
export function beach(t = 0, top = 640) {
  ctx.fillStyle = C.sky; ctx.fillRect(-300, -300, 1680, top + 300);
  circle(860, 220, 90, C.yellow);
  ctx.fillStyle = SEA; ctx.fillRect(-300, top - 220, 1680, 240);
  ctx.fillStyle = SEA_D; ctx.fillRect(-300, top - 220, 1680, 30);
  ctx.fillStyle = SAND; ctx.fillRect(-300, top, 1680, 1700);
  ctx.save(); ctx.strokeStyle = C.white; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath();
  for (let xx = -300; xx <= 1380; xx += 20) { const yy = top + Math.sin(xx * 0.02 + t * 2) * 10; if (xx === -300) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy); }
  ctx.stroke(); ctx.restore();
  for (let k = 0; k < 18; k++) circle(rnd2(k) * 1080, top + 120 + rnd2(k + 40) * 1200, 6, SAND_D);
}
const rnd2 = (i) => { const x = Math.sin(i * 91.7 + 13.1) * 43758.5453; return x - Math.floor(x); };

/** Morse dots and dashes drawn in sand along a row at y; draw 0..1 traces them in; stretch 0..1 pulls each one down into a bar of length len */
export const MORSE = [0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0];   // 0 = dot, 1 = dash
export function sandMorse(x, y, w, draw = 1, stretch = 0, len = 420, col = '#B8935A') {
  const n = MORSE.length, gap = w / n;
  ctx.save(); ctx.fillStyle = col;
  for (let k = 0; k < n; k++) {
    if (k / n > draw) break;
    const cx = x - w / 2 + gap * (k + 0.5), bw = MORSE[k] ? gap * 0.78 : gap * 0.32, th = 30;
    // a stretched mark becomes a vertical bar: width shrinks for dashes→thick bar, dots→thin bar
    const ww = lerp(bw, MORSE[k] ? gap * 0.5 : gap * 0.2, stretch), hh = lerp(th, len, stretch);
    rr(cx - ww / 2, y - th / 2, ww, hh, Math.min(ww, hh) / 2); ctx.fill();
  }
  ctx.restore();
}

/** a stick-of-gum multipack (generic, yellow). s = 1 → 420 x 160. barcode shows a small code on the side */
export function gumPack(x, y, s, rot = 0, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * sc, s * sc);
  ctx.save(); ctx.globalAlpha = 0.15; rr(-210 + 12, -80 + 16, 420, 160, 22); ctx.fillStyle = C.ink; ctx.fill(); ctx.restore();
  rr(-210, -80, 420, 160, 22); ctx.fillStyle = C.yellow; ctx.fill();
  rr(-210, 20, 420, 60, [0, 0, 22, 22]); ctx.fillStyle = '#F0BE1E'; ctx.fill();
  rr(-190, -60, 250, 70, 16); ctx.fillStyle = C.white; ctx.fill();
  T('GUM', -65, -24, 52, C.red);
  T('10 STICKS', -65, 50, 30, C.ink);
  barcode(130, -10, 92, 60, { digits: false, label: true });
  ctx.restore();
}
