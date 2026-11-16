// Fingerprint components (How Does Your Phone Know It's Your Fingerprint?): flat Inside Out look.
// printRidges, fingerprint, printMinutiae, minutiaMarks, fingerPad, ridgeSide, pixelPrint, fpIcon, fpLockScreen,
// secureChip, wombBaby, dnaHelix, passDots
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line, rnd } from './lib.js';

const GREEN = '#5BAE6A', BLUE = '#3A7BD5', INKR = '#5A3A2E', CHIP = '#2A3346', CHIP_D = '#1C2333';
export const FP_GREEN = GREEN;

// ── the print model (local units, s = 1 → pad ~ 260 wide x 340 tall, centred on 0,0) ──
const RX = 130, RY = 170, GAP = 15, N = 13;
const radAt = (k, th, seed) => {
  const w = Math.sin(3 * th + seed * 1.7) * 3 + Math.sin(5 * th + seed * 2.9) * 2 + Math.sin(2 * th + seed) * k * 0.6;
  return k * GAP + w;
};
const ptAt = (k, th, seed) => { const r = radAt(k, th, seed); return [Math.cos(th) * r * 0.82, Math.sin(th) * r * 1.08 + 18 - k * 1.2]; };
/** per-seed ridge breaks (ridge endings) and splits (bifurcations) */
function features(seed) {
  const br = [], sp = [];
  for (let k = 3; k < N; k++) {
    if (rnd(seed * 31 + k) < 0.55) br.push({ k, a: rnd(seed * 17 + k * 3) * TAU, w: 0.35 + rnd(seed * 7 + k) * 0.25 });
    if (rnd(seed * 13 + k * 5) < 0.4) sp.push({ k, a: rnd(seed * 23 + k * 9) * TAU });
  }
  return { br, sp };
}
const inPad = (x, y) => (x * x) / (RX * RX) + (y * y) / (RY * RY) < 1;
/** list of minutiae {x, y, type: 'end'|'split'} for a seed, inside the pad (local units, s = 1) */
export function printMinutiae(seed = 1) {
  const { br, sp } = features(seed), out = [];
  for (const b of br) for (const a of [b.a, b.a + b.w]) { const [x, y] = ptAt(b.k, a, seed); if ((x * x) / ((RX - 22) ** 2) + (y * y) / ((RY - 22) ** 2) < 1) out.push({ x, y, type: 'end' }); }
  for (const s of sp) { const [x, y] = ptAt(s.k, s.a, seed); if ((x * x) / ((RX - 22) ** 2) + (y * y) / ((RY - 22) ** 2) < 1) out.push({ x, y, type: 'split' }); }
  return out;
}
/** draw the ridges only (no pad). p 0..1 reveal from the centre out; col; w = line width */
export function printRidges(seed = 1, p = 1, col = INKR, w = 7) {
  const { br, sp } = features(seed);
  ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, RX, RY, 0, 0, TAU); ctx.clip();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = col; ctx.lineWidth = w;
  const kMax = 1 + p * (N + 4);
  for (let k = 1; k < Math.min(N + 4, kMax); k++) {
    const b = br.find((q) => q.k === k);
    const a0 = b ? b.a + b.w : 0, a1 = b ? b.a + TAU : TAU;
    ctx.beginPath();
    for (let i = 0; i <= 120; i++) { const [x, y] = ptAt(k, lerp(a0, a1, i / 120), seed); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.stroke();
  }
  for (const s of sp) if (s.k + 1 < kMax) {
    const [x0, y0] = ptAt(s.k, s.a, seed), [x1, y1] = ptAt(s.k + 1, s.a + 0.22, seed);
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1) / 2 + 3, (y0 + y1) / 2, x1, y1); ctx.stroke();
  }
  ctx.restore();
}
/** a fingerprint card: skin-tone oval pad with ridges. o = { p reveal, bg pad colour, col ridge colour, card (white card behind) } */
export function fingerprint(x, y, s, seed = 1, o = {}) {
  const { p = 1, bg = C.skin, col = INKR, card = false, a = 1, w = 7 } = o;
  if (s <= 0 || a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  if (card) { rr(-175, -215, 350, 430, 36); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke(); }
  if (bg) { ell(0, 0, RX, RY, bg); }
  printRidges(seed, p, col, w);
  ctx.restore();
}
/** minutia markers for a print drawn at (x, y, s). p 0..1 pop; only = 'end'|'split'|null; hi 0..1 pulses the chosen type; dots = draw as plain dots */
export function minutiaMarks(x, y, s, seed = 1, p = 1, o = {}) {
  const { only = null, hi = 0, links = 0, col = C.yellow, dim = null } = o;
  if (p <= 0) return;
  const pts = printMinutiae(seed);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (links > 0) {               // constellation lines between neighbours
    ctx.save(); ctx.globalAlpha *= clamp(links); ctx.strokeStyle = col; ctx.lineWidth = 5 / Math.max(0.4, s) * 1.2;
    const sorted = [...pts].sort((a, b) => Math.atan2(a.y, a.x) - Math.atan2(b.y, b.x));
    ctx.beginPath(); sorted.forEach((q, i) => (i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y))); ctx.closePath(); ctx.stroke();
    ctx.restore();
  }
  pts.forEach((q, i) => {
    const pp = clamp(p * (pts.length + 3) - i * 0.6); if (pp <= 0) return;
    if (only && q.type !== only && dim != null) { ctx.save(); ctx.globalAlpha *= dim; }
    const big = only === q.type ? 1 + 0.35 * hi : 1, r = 14 * pp * big;
    if (q.type === 'end') { circle(q.x, q.y, r + 5, C.ink); circle(q.x, q.y, r, col); }
    else { ctx.save(); ctx.translate(q.x, q.y); ctx.rotate(Math.PI / 4); rr(-r - 5, -r - 5, 2 * r + 10, 2 * r + 10, 4); ctx.fillStyle = C.ink; ctx.fill(); rr(-r, -r, 2 * r, 2 * r, 3); ctx.fillStyle = col === C.yellow ? C.cyan : col; ctx.fill(); ctx.restore(); }
    if (only && q.type !== only && dim != null) ctx.restore();
  });
  ctx.restore();
}
/** a big index finger pointing UP from the bottom, pad facing the viewer, print on it. tipY = top of the finger */
export function fingerPad(x, tipY, s, seed = 1, printP = 1) {
  ctx.save(); ctx.translate(x, tipY); ctx.scale(s, s);
  rr(-165, 0, 330, 1400, [165, 165, 40, 40]); ctx.fillStyle = C.skin; ctx.fill();
  rr(85, 60, 80, 1340, [0, 120, 0, 0]); ctx.fillStyle = C.skinShade; ctx.fill();
  ctx.fillStyle = C.skinShade; for (const yy of [470, 560]) { rr(-110, yy, 200, 12, 6); ctx.fill(); }
  ctx.translate(-8, 205); ctx.scale(0.95, 0.95);
  ell(0, 0, RX + 6, RY + 6, '#E0AA8B');
  printRidges(seed, printP, INKR, 8);
  ctx.restore();
}
/**
 * cross-section: skin with ridges/valleys over a row of sensor pixels.
 * (x, y) = sensor surface centre; w total width; o = { lower 0..1 skin comes down, read 0..1 pixels light up, n pixels, t, lbl }
 */
export function ridgeSide(x, y, w, o = {}) {
  const { lower = 1, read = 0, n = 9, t = 0 } = o;
  const pw = w / n, amp = 52, base = y - 6 - amp - lerp(260, 0, lower);
  const surf = (xx) => base + amp + amp * Math.cos(Math.PI * (xx - x) / pw);  // ridge (lowest point) over even pixels (centre pixel = ridge when n is odd)
  // sensor pixels
  for (let i = 0; i < n; i++) {
    const px = x - w / 2 + i * pw, ridge = i % 2 === 0;
    rr(px + 6, y + 6, pw - 12, pw - 12, 12); ctx.fillStyle = '#2E3B5C'; ctx.fill();
    if (read > 0) {
      ctx.save(); ctx.globalAlpha = clamp(read * 1.5 - i * 0.05);
      rr(px + 6, y + 6, pw - 12, pw - 12, 12); ctx.fillStyle = ridge ? C.yellow : '#46557A'; ctx.fill();
      if (ridge) circle(px + pw / 2, y + 6 + (pw - 12) / 2, pw * 0.16, C.white);
      ctx.restore();
    }
  }
  rr(x - w / 2 - 20, y + pw - 4, w + 40, 34, 12); ctx.fillStyle = C.ink; ctx.fill();
  // skin
  ctx.beginPath(); ctx.moveTo(x - w / 2 - 300, base - 900);
  ctx.lineTo(x - w / 2 - 300, surf(x - w / 2 - 300));
  for (let xx = x - w / 2 - 300; xx <= x + w / 2 + 300; xx += 6) ctx.lineTo(xx, Math.min(y - 4, surf(xx)));
  ctx.lineTo(x + w / 2 + 300, base - 900); ctx.closePath(); ctx.fillStyle = C.skin; ctx.fill();
  ctx.beginPath(); for (let xx = x - w / 2 - 300; xx <= x + w / 2 + 300; xx += 6) { const yy = Math.min(y - 4, surf(xx)) - 26; xx === x - w / 2 - 300 ? ctx.moveTo(xx, yy) : ctx.lineTo(xx, yy); }
  ctx.strokeStyle = C.skinShade; ctx.lineWidth = 14; ctx.stroke();
  return { ridgeX: (i) => x - w / 2 + (i + 0.5) * pw, pw, base, amp };
}
/** the sensor's pixel image of a print: square cells, reveal row by row (scan 0..1). on = ridge cell colour */
export function pixelPrint(x, y, s, seed = 1, scan = 1, o = {}) {
  const { cell = 20, on = C.yellow, off = '#2E3B5C', frame = true } = o;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (frame) { rr(-200, -240, 400, 480, 28); ctx.fillStyle = C.navy; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke(); }
  // render ridges into an offscreen mask once per seed
  const key = '_fpmask' + seed; let m = pixelPrint[key];
  if (!m) {
    const cv = document.createElement('canvas'); cv.width = 300; cv.height = 380; const g = cv.getContext('2d');
    const keep = ctx; // draw with the shared helpers by swapping the context temporarily is messy: re-implement minimal stroke
    g.translate(150, 190); g.save(); g.beginPath(); g.ellipse(0, 0, RX, RY, 0, 0, TAU); g.clip(); g.lineCap = 'round'; g.strokeStyle = '#000'; g.lineWidth = 7;
    const { br, sp } = features(seed);
    for (let k = 1; k < N + 4; k++) { const b = br.find((q) => q.k === k); const a0 = b ? b.a + b.w : 0, a1 = b ? b.a + TAU : TAU; g.beginPath(); for (let i = 0; i <= 120; i++) { const [px, py] = ptAt(k, lerp(a0, a1, i / 120), seed); i ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke(); }
    for (const s2 of sp) { const [x0, y0] = ptAt(s2.k, s2.a, seed), [x1, y1] = ptAt(s2.k + 1, s2.a + 0.22, seed); g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); }
    g.restore(); void keep;
    const data = g.getImageData(0, 0, 300, 380).data;
    m = { data }; pixelPrint[key] = m;
  }
  const cols = Math.floor(360 / cell), rows = Math.floor(440 / cell), x0 = -cols * cell / 2, y0 = -rows * cell / 2;
  const shownRows = scan * rows;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const lx = x0 + (i + 0.5) * cell, ly = y0 + (j + 0.5) * cell;
    if ((lx * lx) / ((RX + 6) ** 2) + (ly * ly) / ((RY + 6) ** 2) > 1) continue;
    const sx = Math.round(lx + 150), sy = Math.round(ly + 190);
    const q = (sy * 300 + sx) * 4 + 3, hit = m.data[q] > 100 ? 1 : 0;
    const lit = j < shownRows;
    ctx.fillStyle = lit ? (hit ? on : off) : '#253049';
    ctx.fillRect(x0 + i * cell + 0.5, y0 + j * cell + 0.5, cell - 1, cell - 1);
  }
  if (scan > 0 && scan < 1) { ctx.fillStyle = C.cyan; ctx.fillRect(-190, y0 + shownRows * cell - 4, 380, 8); }
  ctx.restore();
}
/** the little fingerprint icon used on lock screens (concentric arcs). col; p glow */
export function fpIcon(x, y, s, col = C.white) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.lineCap = 'round';
  for (let k = 1; k <= 4; k++) { ctx.beginPath(); ctx.ellipse(0, 6, k * 12, k * 15, 0, Math.PI * (1.05 + k * 0.03), Math.PI * (2.0 - k * 0.02) + (k % 2 ? 0.9 : 0.5)); ctx.stroke(); }
  ctx.restore();
}
/** lock screen (draw inside K.phone): time, padlock-ish ring and the fingerprint spot. state: 0 locked, 1 unlocked, -1 rejected (red) */
export const fpLockScreen = (state = 0, glow = 0, t = 0) => () => {
  ctx.fillStyle = '#1F2A44'; ctx.fillRect(-166, -350, 332, 700);
  ctx.fillStyle = C.white; ctx.font = '900 64px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('9:41', 0, -240);
  ctx.font = '700 26px Inter'; ctx.fillStyle = '#AFC0DA'; ctx.fillText(state === 1 ? 'Unlocked' : state === -1 ? 'Try again' : 'Touch to unlock', 0, -170);
  const col = state === 1 ? GREEN : state === -1 ? C.red : C.white;
  if (glow > 0) { ctx.save(); ctx.globalAlpha = 0.35 * glow; circle(0, 210, 92, col); ctx.restore(); }
  circle(0, 210, 70, '#2E3B5C');
  fpIcon(0, 210, 1.05, col);
};
/** secure chip: dark square with pins and a gold padlock. lock 0..1 (padlock closes), glow */
export function secureChip(x, y, s, glow = 0, lockC = 1, padlockFn = null) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#9AA1AE';
  for (let i = 0; i < 6; i++) { const o = -125 + i * 50; rr(o - 9, -205, 18, 50, 6); ctx.fill(); rr(o - 9, 155, 18, 50, 6); ctx.fill(); rr(-205, o - 9, 50, 18, 6); ctx.fill(); rr(155, o - 9, 50, 18, 6); ctx.fill(); }
  if (glow > 0) { ctx.save(); ctx.globalAlpha = 0.35 * glow; rr(-200, -200, 400, 400, 50); ctx.fillStyle = C.yellow; ctx.fill(); ctx.restore(); }
  rr(-165, -165, 330, 330, 30); ctx.fillStyle = CHIP; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-130, -130, 260, 260, 20); ctx.fillStyle = CHIP_D; ctx.fill();
  if (padlockFn) padlockFn(0, 20, 0.55, 1 - lockC);
  ctx.restore();
}
/** curled baby inside a soft pink womb circle. t for a gentle bob */
export function wombBaby(x, y, s, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  circle(0, 0, 250, C.pinkDark); circle(0, 0, 230, C.pinkLight); circle(-60, -70, 60, 'rgba(255,255,255,0.25)');
  ctx.rotate(Math.sin(t * 2) * 0.05);
  ell(10, 40, 120, 95, C.skin, -0.5);                 // body
  ell(60, 90, 60, 36, C.skinShade, -0.2);              // legs tucked
  circle(-70, -70, 82, C.skin);                       // head
  ell(-30, -40, 30, 18, C.skinShade, 0.4);             // ear-ish shade
  ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(-95, -70, 12, 0.2, Math.PI - 0.2); ctx.stroke();       // closed eye
  ell(10, 20, 28, 22, C.skinShade);                    // little hand near face
  ctx.restore();
}
/** DNA double helix (flat). p 0..1 grows rungs, t spins */
export function dnaHelix(x, y, s, t = 0, p = 1) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineCap = 'round';
  const n = 11, h = 520;
  for (let i = 0; i < n * clamp(p); i++) {
    const yy = -h / 2 + (i / (n - 1)) * h, ph = t * 2 + i * 0.6, a = Math.sin(ph) * 110, b = -a;
    line([[a, yy], [b, yy]], i % 2 ? C.pink : C.cyan, 12);
  }
  for (const sgn of [1, -1]) {
    ctx.beginPath();
    for (let i = 0; i <= 60 * clamp(p); i++) { const yy = -h / 2 + (i / 60) * h, xx = sgn * Math.sin(t * 2 + (i / 60) * (n - 1) * 0.6) * 110; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
    ctx.strokeStyle = sgn > 0 ? BLUE : C.pinkDark; ctx.lineWidth = 22; ctx.stroke();
  }
  ctx.restore();
}
/** password field with n dots. s = 1 → 520x120 */
export function passDots(x, y, s, n = 8, shown = 8, a = 1) {
  if (s <= 0 || a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  rr(-260, -60, 520, 120, 30); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  for (let i = 0; i < Math.min(n, shown); i++) circle(-196 + i * 56, 0, 16, C.ink);
  ctx.restore();
}
