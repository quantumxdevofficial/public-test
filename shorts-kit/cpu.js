// CPU topic components (What Actually Is a CPU?): flat Inside Out look.
import { ctx, C, lerp, clamp, rr, circle, ell, line, TAU } from './lib.js';

const GREEN = '#5BAE6A', GREEN_D = '#3F8A4E', CHIP = '#2E3440', CHIP_L = '#454D5C', GOLD = '#E6B82E', OFF = '#3A4150';

/** a light switch on a wall plate. s = 1 → 220x340. on 0..1 slides the knob up (yellow) */
export function toggleSwitch(x, y, s, on = 0, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-110, -170, 220, 340, 36); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-62, -120, 124, 240, 30); ctx.fillStyle = '#E4DCCB'; ctx.fill();
  const k = clamp(on), ky = lerp(50, -50, k);
  rr(-52, ky - 56, 104, 112, 24); ctx.fillStyle = k > 0.5 ? C.yellow : '#9AA1AE'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-36, ky - 44, 72, 20, 10); ctx.fillStyle = k > 0.5 ? '#FFE680' : '#B9BFCA'; ctx.fill();
  circle(0, -145, 7, '#C9C2B5'); circle(0, 145, 7, '#C9C2B5');
  ctx.restore();
}

/** a board of tiny transistor switches: cols x rows cells, onFn(i, j) → 0..1 lights a cell yellow */
export function switchGrid(x, y, cols, rows, cell, onFn = () => 0, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  const w = cols * cell, h = rows * cell;
  rr(x - w / 2 - 18, y - h / 2 - 18, w + 36, h + 36, 22); ctx.fillStyle = CHIP; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const v = clamp(onFn(i, j)), cx = x - w / 2 + i * cell, cy = y - h / 2 + j * cell;
    rr(cx + cell * 0.12, cy + cell * 0.12, cell * 0.76, cell * 0.76, cell * 0.18);
    ctx.fillStyle = v > 0.5 ? C.yellow : OFF; ctx.fill();
  }
  ctx.restore();
}

/** a flat pink brain. s = 1 → ~300x230 */
export function brain(x, y, s, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  const lobes = [[-80, -40, 90], [10, -70, 95], [90, -20, 85], [-60, 50, 80], [50, 50, 85]];
  for (const [lx, ly, r] of lobes) circle(lx, ly, r + 8, C.pinkDark);
  for (const [lx, ly, r] of lobes) circle(lx, ly, r, C.pink);
  ctx.lineCap = 'round'; ctx.lineWidth = 12; ctx.strokeStyle = C.pinkDark;
  ctx.beginPath(); ctx.moveTo(0, -140); ctx.bezierCurveTo(-20, -60, 30, 0, 0, 120); ctx.stroke();
  for (const [a, b, c2, d] of [[-120, -30, -70, -70], [-110, 50, -60, 20], [60, -80, 110, -40], [70, 30, 120, 60]]) {
    ctx.beginPath(); ctx.moveTo(a, b); ctx.quadraticCurveTo((a + c2) / 2, b - 30, c2, d); ctx.stroke();
  }
  ell(-60, -80, 30, 14, C.pinkLight, -0.4);
  ctx.restore();
}

/** a green motherboard with gold traces and an empty CPU socket at its centre. s = 1 → 820x620 */
export function motherboard(x, y, s, sc = 1) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  rr(-410, -310, 820, 620, 30); ctx.fillStyle = GREEN; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.lineWidth = 8; ctx.strokeStyle = GOLD; ctx.lineCap = 'round';
  for (let i = 0; i < 5; i++) { const k = -120 + i * 60;
    ctx.beginPath(); ctx.moveTo(-170, k); ctx.lineTo(-300, k); ctx.lineTo(-340, k + (i - 2) * 40); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(170, k); ctx.lineTo(300, k); ctx.lineTo(340, k - (i - 2) * 40); ctx.stroke(); }
  for (let i = 0; i < 3; i++) { rr(-360 + i * 90, 200, 60, 70, 8); ctx.fillStyle = CHIP; ctx.fill(); }
  rr(160, 190, 200, 80, 10); ctx.fillStyle = GREEN_D; ctx.fill();
  rr(-170, -170, 340, 340, 26); ctx.fillStyle = GREEN_D; ctx.fill();
  rr(-150, -150, 300, 300, 20); ctx.fillStyle = '#E4DCCB'; ctx.fill();
  ctx.restore();
}

/** the CPU loop: three stations (FETCH, DECODE, RUN) on a ring, active one yellow; spin = angle of the travelling dot */
export function cycleWheel(x, y, s, active = -1, spin = 0, labels = ['FETCH', 'DECODE', 'RUN'], sc = 1) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  const R = 300;
  ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.lineWidth = 26; ctx.strokeStyle = '#D9D0BE'; ctx.stroke();
  // arrowheads (clockwise) between stations
  for (let k = 0; k < 3; k++) { const a = -Math.PI / 2 + (k + 0.5) * TAU / 3;
    ctx.save(); ctx.translate(Math.cos(a) * R, Math.sin(a) * R); ctx.rotate(a + Math.PI / 2 + Math.PI);
    ctx.beginPath(); ctx.moveTo(-26, 18); ctx.lineTo(0, -22); ctx.lineTo(26, 18); ctx.closePath(); ctx.fillStyle = '#B9AE98'; ctx.fill(); ctx.restore(); }
  // travelling dot
  circle(Math.cos(spin - Math.PI / 2) * R, Math.sin(spin - Math.PI / 2) * R, 26, C.yellow);
  ctx.beginPath(); ctx.arc(Math.cos(spin - Math.PI / 2) * R, Math.sin(spin - Math.PI / 2) * R, 26, 0, TAU); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.font = '900 58px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  labels.forEach((lab, k) => {
    const a = -Math.PI / 2 + k * TAU / 3, px = Math.cos(a) * R, py = Math.sin(a) * R, w = ctx.measureText(lab).width + 70;
    const on = k === active;
    ctx.save(); ctx.translate(px, py); if (on) ctx.scale(1.12, 1.12);
    rr(-w / 2, -50, w, 100, 50); ctx.fillStyle = on ? C.yellow : C.white; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
    ctx.fillStyle = C.ink; ctx.fillText(lab, 0, 4); ctx.restore();
  });
  ctx.restore();
}

/** a CPU chip seen from above with n cores inside (2 rows). cores[i] 0..1 = pop-in scale, busy(i) 0..1 = lit */
export function multiCoreChip(x, y, s, n = 8, cores = null, busy = () => 0, label = '') {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (let i = 0; i < 7; i++) { const k = -210 + i * 70;
    rr(k - 12, -310, 24, 50, 5); ctx.fillStyle = GOLD; ctx.fill(); rr(k - 12, 260, 24, 50, 5); ctx.fill();
    rr(-310, k - 12, 50, 24, 5); ctx.fill(); rr(260, k - 12, 50, 24, 5); ctx.fill(); }
  rr(-270, -270, 540, 540, 36); ctx.fillStyle = CHIP; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  const cols = Math.ceil(n / 2), cw = 440 / cols, ch = 190;
  for (let i = 0; i < n; i++) {
    const sc = cores ? clamp(cores[i] ?? 0, 0, 1.2) : 1; if (sc <= 0) continue;
    const cx = -220 + (i % cols) * cw + cw / 2, cy = i < cols ? -105 : 105;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc);
    const b = clamp(busy(i));
    rr(-cw / 2 + 10, -ch / 2 + 10, cw - 20, ch - 20, 16); ctx.fillStyle = b > 0.5 ? C.yellow : CHIP_L; ctx.fill();
    // tiny switch dots inside each core
    for (let r = 0; r < 3; r++) for (let q = 0; q < 2; q++) { const on = ((i * 7 + r * 3 + q + Math.floor(b * 9)) % 3) === 0;
      rr(-cw / 2 + 26 + q * (cw - 52) / 2, -ch / 2 + 30 + r * 45, (cw - 52) / 2 - 8, 30, 8); ctx.fillStyle = on ? (b > 0.5 ? '#E6B82E' : '#5A6374') : (b > 0.5 ? '#FFE680' : '#3A4150'); ctx.fill(); }
    ctx.restore();
  }
  if (label) { ctx.fillStyle = C.white; ctx.font = '900 54px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, 0); }
  ctx.restore();
}

/** wavy heat lines rising from (x, y); w = spread width */
export function heatWaves(x, y, t, a = 1, w = 300, n = 4, col = C.red) {
  if (a <= 0) return;
  ctx.save(); ctx.lineCap = 'round'; ctx.lineWidth = 16; ctx.strokeStyle = col;
  for (let i = 0; i < n; i++) {
    const p = ((t * 0.7 + i * 0.37) % 1), bx = x - w / 2 + (i + 0.5) * w / n, by = y - p * 180;
    ctx.globalAlpha = a * Math.sin(p * Math.PI);
    ctx.beginPath();
    for (let k = 0; k <= 12; k++) { const yy = by - k * 14, xx = bx + Math.sin(k * 0.8 + t * 6 + i) * 16; if (k) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy); }
    ctx.stroke();
  }
  ctx.restore();
}
