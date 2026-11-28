// Inside Out: NIGHT MODE components (night-scene photo card with grain, light sensor grid, tripod,
// night camera screen with HOLD STILL, a photo stack in a trench coat). Same flat look: flat fills,
// one darker shade, one light highlight, ink outlines only on graphics/cards.
import { ctx, C, TAU, lerp, clamp, rnd, rr, circle, ell, line } from './lib.js';

const hx = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
/** blend two hex colours, t 0..1 */
export function mixHex(a, b, t) {
  const A = hx(a), B = hx(b), u = clamp(t);
  return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], u))).join(',')})`;
}
const SPECK = ['#FFFFFF', '#E57A8A', '#5BAE6A', '#4FD1E8', '#FFD43B'];
const STARS = [[-220, -170], [-120, -120], [-40, -185], [60, -140], [140, -195], [-260, -90], [230, -150], [-170, -60], [20, -95]];

/** a night photo: sky, moon, stars, hill, house with a lit window, tree. Centred at (x, y), w x h (4:3 looks best).
 *  o: bright 0..1 (near-black → clear), noise 0..1 (grain), seed (grain pattern), stars 'dots'|'streak'|'none',
 *  hiDetail 0..1 (yellow rings on house + moon), hiNoise 0..1 (red rings on a few specks), border (white card) */
export function nightScene(x, y, w, h, o = {}) {
  const b = o.bright ?? 1, nz = o.noise ?? 0, seed = o.seed ?? 1, st = o.stars ?? 'dots';
  ctx.save(); ctx.translate(x, y);
  if (o.rot) ctx.rotate(o.rot);
  if (o.border !== false) { rr(-w / 2 - 18, -h / 2 - 18, w + 36, h + 36, 18); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke(); }
  ctx.save(); rr(-w / 2, -h / 2, w, h, 8); ctx.clip();
  ctx.scale(w / 600, h / 450);
  const k = (dark, lit) => mixHex(dark, lit, b);
  ctx.fillStyle = k('#06080F', '#24447A'); ctx.fillRect(-310, -235, 620, 470);
  // stars
  for (const [sx, sy] of STARS) {
    if (st === 'dots') circle(sx, sy, 6, k('#2A2A2A', '#FFFFFF'));
    else if (st === 'streak') { ctx.save(); ctx.lineCap = 'round'; ctx.lineWidth = 7; ctx.strokeStyle = k('#2A2A2A', '#FFFFFF'); ctx.beginPath(); ctx.arc(-40, 260, Math.hypot(sx + 40, sy - 260), Math.atan2(sy - 260, sx + 40) - 0.07, Math.atan2(sy - 260, sx + 40) + 0.07); ctx.stroke(); ctx.restore(); }
  }
  // moon
  circle(190, -130, 54, k('#3A3420', C.yellow)); circle(214, -150, 44, k('#06080F', '#24447A'));
  // hill + tree + house
  ell(-60, 260, 520, 170, k('#0B140E', '#2F5B3A')); ell(-60, 250, 500, 150, k('#0E1A12', '#3E7A4C'));
  rr(-215, 0, 26, 110, 6); ctx.fillStyle = k('#120C08', '#6B4A30'); ctx.fill();
  circle(-202, -30, 70, k('#0C1A10', '#5BAE6A')); circle(-226, -6, 44, k('#0F2014', '#6CC07B'));
  rr(20, -10, 190, 140, 6); ctx.fillStyle = k('#1A0F0A', '#C8734A'); ctx.fill();
  ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(115, -95); ctx.lineTo(230, -10); ctx.closePath(); ctx.fillStyle = k('#140A08', '#8E3B2E'); ctx.fill();
  rr(52, 20, 54, 50, 6); ctx.fillStyle = k('#8A6A10', C.yellow); ctx.fill();
  rr(135, 50, 44, 80, 6); ctx.fillStyle = k('#0E0805', '#5A3420'); ctx.fill();
  if (o.hiDetail > 0) {
    ctx.save(); ctx.globalAlpha = clamp(o.hiDetail); ctx.lineWidth = 12; ctx.strokeStyle = C.yellow;
    ctx.beginPath(); ctx.arc(115, 20, 150, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(190, -130, 80, 0, TAU); ctx.stroke(); ctx.restore();
  }
  // grain
  if (nz > 0) {
    ctx.save(); ctx.globalAlpha = clamp(nz);
    for (let i = 0; i < 260; i++) {
      const px = -300 + rnd(i * 3.1 + seed * 17.3) * 600, py = -225 + rnd(i * 7.7 + seed * 5.9) * 450, sz = 6 + rnd(i + seed * 3) * 8;
      ctx.fillStyle = SPECK[Math.floor(rnd(i * 1.3 + seed) * SPECK.length)]; ctx.fillRect(px, py, sz, sz);
    }
    ctx.restore();
  }
  if (o.hiNoise > 0) {
    ctx.save(); ctx.globalAlpha = clamp(o.hiNoise); ctx.lineWidth = 10; ctx.strokeStyle = C.red;
    for (let i = 0; i < 4; i++) { const px = -240 + rnd(i * 5.3 + seed * 11.1) * 480, py = -170 + rnd(i * 9.1 + seed * 2.7) * 340; ctx.beginPath(); ctx.arc(px, py, 34, 0, TAU); ctx.stroke(); }
    ctx.restore();
  }
  ctx.restore();
  ctx.restore();
}

/** the camera sensor as a grid of light buckets; photons (yellow) fall into a few. t = time, rate = photons per second */
export function sensorGrid(x, y, s, t = 0, rate = 3, cols = 6, rows = 5) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const cw = 110, gw = cols * cw, gh = rows * cw;
  rr(-gw / 2 - 30, -gh / 2 - 30, gw + 60, gh + 60, 30); ctx.fillStyle = '#3A3F4A'; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    const cx = -gw / 2 + i * cw + cw / 2, cy = -gh / 2 + j * cw + cw / 2;
    rr(cx - 44, cy - 44, 88, 88, 14); ctx.fillStyle = C.navy; ctx.fill();
    rr(cx - 44, cy - 44, 88, 18, [14, 14, 0, 0]); ctx.fillStyle = '#22304A'; ctx.fill();
    const lit = rnd(i * 13 + j * 7) < 0.16;
    if (lit) { const lv = clamp(t * 0.25) * 30; rr(cx - 38, cy + 38 - lv, 76, lv, 8); ctx.fillStyle = C.yellow; ctx.fill(); }
  }
  // falling photons
  const n = Math.floor(t * rate);
  for (let k = Math.max(0, n - 4); k <= n; k++) {
    const age = t - k / rate; if (age < 0 || age > 0.9) continue;
    const i = Math.floor(rnd(k * 3.7) * cols), j = Math.floor(rnd(k * 5.1) * rows);
    const cx = -gw / 2 + i * cw + cw / 2, cy = -gh / 2 + j * cw + cw / 2;
    const py = lerp(cy - 520, cy, clamp(age / 0.6));
    if (age < 0.6) { circle(cx, py, 16, C.yellow); line([[cx, py - 60], [cx, py - 18]], 'rgba(255,212,59,0.5)', 8); }
    else { ctx.save(); ctx.globalAlpha = 1 - (age - 0.6) / 0.3; circle(cx, cy, 30, C.yellow); ctx.restore(); }
  }
  ctx.restore();
}

/** a tripod (head at x, y). s = 1 → ~600 px tall */
export function tripod(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineCap = 'round';
  line([[0, 40], [-170, 600]], C.ink, 26); line([[0, 40], [170, 600]], C.ink, 26); line([[0, 40], [0, 620]], '#2A2A30', 26);
  rr(-60, 0, 120, 70, 16); ctx.fillStyle = C.ink; ctx.fill(); rr(-60, 0, 120, 18, [16, 16, 0, 0]); ctx.fillStyle = '#3A3A44'; ctx.fill();
  ctx.restore();
}

/** phone screen: night camera view. p 0..1 = capture progress ring, n = frames taken, hold = show HOLD STILL */
export function nightCamScreen(t = 0, p = 0, n = 0, hold = 1, bright = 0.3) {
  ctx.fillStyle = C.ink; ctx.fillRect(-170, -360, 340, 720);
  nightScene(0, -60, 332, 480, { bright, noise: 0.35 * (1 - bright), seed: Math.floor(t * 8), border: false });
  if (hold > 0) {
    ctx.save(); ctx.globalAlpha = clamp(hold);
    rr(-130, -300, 260, 56, 28); ctx.fillStyle = C.yellow; ctx.fill();
    ctx.fillStyle = C.ink; ctx.font = '900 30px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('HOLD STILL', 0, -270);
    ctx.restore();
  }
  circle(0, 270, 52, C.white); circle(0, 270, 40, C.ink); circle(0, 270, 32, C.white);
  if (p > 0) { ctx.save(); ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.strokeStyle = C.yellow; ctx.beginPath(); ctx.arc(0, 270, 52, -Math.PI / 2, -Math.PI / 2 + TAU * clamp(p)); ctx.stroke(); ctx.restore(); }
  if (n > 0) { ctx.fillStyle = C.white; ctx.font = '900 34px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(`${n}`, 120, 270); }
}

/** a stack of night photos wearing a trench coat and a hat (the punchline). s = 1 → ~700 tall; wob = sway */
export function trenchStack(x, y, s, wob = 0, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(wob); ctx.scale(s, s);
  const TAN = '#C8A06A', TAN2 = '#A9824F', TAN3 = '#DDBB85';
  // legs
  rr(-90, 300, 60, 150, 20); ctx.fillStyle = C.pants; ctx.fill(); rr(30, 300, 60, 150, 20); ctx.fill();
  ell(-60, 455, 60, 24, C.ink); ell(60, 455, 60, 24, C.ink);
  // coat
  ctx.beginPath(); ctx.moveTo(-150, -80); ctx.lineTo(150, -80); ctx.lineTo(200, 330); ctx.lineTo(-200, 330); ctx.closePath(); ctx.fillStyle = TAN; ctx.fill();
  ctx.beginPath(); ctx.moveTo(40, -80); ctx.lineTo(150, -80); ctx.lineTo(200, 330); ctx.lineTo(70, 330); ctx.closePath(); ctx.fillStyle = TAN2; ctx.fill();
  rr(-185, 120, 370, 34, 8); ctx.fillStyle = '#7E5E36'; ctx.fill(); rr(-24, 112, 48, 50, 8); ctx.fillStyle = C.yellow; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-150, -80); ctx.lineTo(-10, -80); ctx.lineTo(-60, 60); ctx.closePath(); ctx.fillStyle = TAN3; ctx.fill();
  ctx.beginPath(); ctx.moveTo(150, -80); ctx.lineTo(10, -80); ctx.lineTo(60, 60); ctx.closePath(); ctx.fillStyle = TAN3; ctx.fill();
  for (const by of [200, 260]) circle(-30, by, 10, '#7E5E36');
  // the photo stack peeking out as the "head"
  for (let i = 4; i >= 0; i--) nightScene(i * 7 - 14, -170 - i * 9, 260, 195, { bright: 0.9, border: true, rot: (i - 2) * 0.04 });
  // eyes peeking over the top card
  for (const ex of [-50, 50]) { circle(ex, -215, 20, C.white); circle(ex + 4, -213, 10, C.ink); }
  // hat
  ell(0, -280, 190, 30, '#3B2A20'); rr(-110, -380, 220, 105, [40, 40, 6, 6]); ctx.fillStyle = '#4A3628'; ctx.fill();
  rr(-110, -310, 220, 26, 4); ctx.fillStyle = C.ink; ctx.fill();
  ctx.restore();
}
