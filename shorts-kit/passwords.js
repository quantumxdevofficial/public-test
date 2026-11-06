// Inside Out: password-storage components (hash blender, hash strip, password database, salt shaker, text chip).
// Same flat look: flat fills, one darker shade, one light highlight, ink outlines only on graphics/cards.
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line, rnd } from './lib.js';

const MONO = "'DejaVu Sans Mono', monospace";
const GOLD = '#FFD43B', GREEN = '#5BAE6A', BLUE = '#3A7BD5', STEEL = '#9AA1AE', STEEL_D = '#7C8391', STEEL_L = '#C9CDD6';
const HEX = '0123456789abcdef';

/** a deterministic fake hash string (hex) for a seed. n chars */
export function fakeHash(seed, n = 10) {
  let s = '';
  for (let i = 0; i < n; i++) s += HEX[Math.floor(rnd(seed * 31.7 + i * 7.3) * 16)];
  return s;
}

/** the HASH blender. s = 1 → ~360 wide, ~620 tall (jar top ≈ -330, base bottom ≈ +290). origin = jar centre.
 *  spin 0..1 = blades whirring (whirl lines + shake), fill = colour of the mix inside (null = empty), t = time,
 *  label = text on the base */
export function blender(x, y, s, spin = 0, fill = null, t = 0, label = 'HASH') {
  if (s <= 0) return;
  const sh = spin > 0 ? Math.sin(t * 60) * 5 * spin : 0;
  ctx.save(); ctx.translate(x + sh, y); ctx.scale(s, s); ctx.lineJoin = 'round';
  // base
  ctx.beginPath(); ctx.moveTo(-170, 140); ctx.lineTo(170, 140); ctx.lineTo(190, 290); ctx.lineTo(-190, 290); ctx.closePath();
  ctx.fillStyle = C.red; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.save(); ctx.clip(); ctx.fillStyle = '#A81F2D'; ctx.fillRect(110, 130, 100, 170); ctx.restore();
  ctx.beginPath(); ctx.moveTo(-170, 140); ctx.lineTo(170, 140); ctx.lineTo(190, 290); ctx.lineTo(-190, 290); ctx.closePath(); ctx.stroke();
  ctx.fillStyle = C.white; ctx.font = '900 52px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, -10, 218);
  circle(140, 215, 18, spin > 0 ? GOLD : '#6B5A1E');
  // jar (glass)
  const jar = () => { ctx.beginPath(); ctx.moveTo(-150, -300); ctx.lineTo(150, -300); ctx.lineTo(120, 140); ctx.lineTo(-120, 140); ctx.closePath(); };
  jar(); ctx.fillStyle = 'rgba(207,232,243,0.85)'; ctx.fill();
  if (fill) {
    ctx.save(); jar(); ctx.clip();
    const top = -60 + (spin > 0 ? -60 * spin : 0);
    ctx.beginPath(); ctx.moveTo(-200, 200);
    for (let k = 0; k <= 20; k++) { const xx = -200 + k * 20; ctx.lineTo(xx, top + Math.sin(k * 0.9 + t * 14) * 16 * (0.3 + spin)); }
    ctx.lineTo(200, 200); ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
    ctx.restore();
  }
  // blades
  ctx.save(); ctx.translate(0, 110); ctx.scale(1, 0.35); ctx.rotate(t * 40 * spin);
  for (let k = 0; k < 4; k++) { ctx.rotate(TAU / 4); ell(55, 0, 60, 14, STEEL); }
  ctx.restore(); circle(0, 110, 14, STEEL_D);
  jar(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  line([[-110, -250], [-90, 80]], 'rgba(255,255,255,0.7)', 14);
  // lid
  rr(-168, -340, 336, 50, 18); ctx.fillStyle = C.ink; ctx.fill(); rr(-40, -372, 80, 40, 12); ctx.fill();
  // whirl lines
  if (spin > 0.05) {
    ctx.globalAlpha = spin; ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.lineCap = 'round';
    for (const sd of [-1, 1]) for (let k = 0; k < 3; k++) {
      ctx.beginPath(); ctx.arc(sd * (210 + k * 34), -70 + k * 10, 40 + k * 14, sd > 0 ? -0.9 : Math.PI - 0.5, sd > 0 ? 0.5 : Math.PI + 0.9); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

/** a text chip: a rounded card with monospace text. s = 1 → height 120, width fits text (min 300).
 *  tone: 'plain' (white, ink text) | 'hash' (navy, gold text) | 'red' (red, white text) | 'green'. chars = typed */
export function chip(x, y, s, text, tone = 'plain', chars = 1e9, rot = 0, label = null) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.font = `700 64px ${MONO}`;
  const w = Math.max(300, ctx.measureText(text).width + 80);
  const bg = { plain: C.white, hash: C.navy, red: C.red, green: GREEN }[tone], fg = { plain: C.ink, hash: GOLD, red: C.white, green: C.white }[tone];
  rr(-w / 2, -60, w, 120, 28); ctx.fillStyle = bg; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.fillStyle = fg; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const shown = text.slice(0, Math.max(0, Math.floor(chars)));
  ctx.textAlign = 'left'; ctx.fillText(shown, -ctx.measureText(text).width / 2, 6);
  if (label) { ctx.font = '900 30px Inter'; ctx.textAlign = 'center'; ctx.fillStyle = C.ink; ctx.fillText(label, 0, -92); }
  ctx.restore();
}

/** the site's password database: a stack of 3 cylinder discs. s = 1 → ~400 wide, ~440 tall (top ≈ -180, bottom ≈ +300).
 *  Draws the cylinder only; use dbTable for rows. glow 0..1 = yellow rim (saved!) */
export function database(x, y, s, glow = 0, label = 'DATABASE') {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (let k = 2; k >= 0; k--) {
    const cy = -130 + k * 130;
    rr(-200, cy, 400, 130, 0); ctx.fillStyle = k % 2 ? '#2A3B56' : C.pants; ctx.fill();
    ell(0, cy + 130, 200, 50, k % 2 ? '#2A3B56' : C.pants);
    circle(150, cy + 70, 12, k === 1 && glow > 0 ? GOLD : GREEN);
  }
  ell(0, -130, 200, 50, '#3B4F70'); ell(-60, -142, 70, 14, 'rgba(255,255,255,0.25)');
  if (glow > 0) { ctx.globalAlpha = glow; ctx.lineWidth = 14; ctx.strokeStyle = GOLD; ctx.beginPath(); ctx.ellipse(0, -130, 206, 54, 0, 0, TAU); ctx.stroke(); ctx.globalAlpha = 1; }
  ctx.fillStyle = C.white; ctx.font = '900 40px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, -20, 60);
  ctx.restore();
}

/** a little table of user → stored value rows. s = 1 → 760 wide, 110 per row. rows [[user, value, tone]], shown = rows visible */
export function dbTable(x, y, s, rows, shown = 1e9, head = ['USER', 'SAVED AS']) {
  if (s <= 0) return;
  const h = 90 + rows.length * 110;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-380, 0, 760, h, 30); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-380, 0, 760, 90, [30, 30, 0, 0]); ctx.fillStyle = C.ink; ctx.fill();
  ctx.fillStyle = C.white; ctx.font = '900 34px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText(head[0], -340, 46); ctx.fillText(head[1], -90, 46);
  rows.forEach(([u, v, tone], i) => {
    if (i >= shown) return;
    const ry = 90 + i * 110 + 55;
    if (i) line([[-360, ry - 55], [360, ry - 55]], '#E2DCD0', 4);
    ctx.fillStyle = C.ink; ctx.font = '900 40px Inter'; ctx.textAlign = 'left'; ctx.fillText(u, -340, ry + 2);
    ctx.font = `700 46px ${MONO}`; ctx.fillStyle = tone === 'red' ? C.red : tone === 'hash' ? BLUE : C.ink; ctx.fillText(v, -90, ry + 2);
  });
  ctx.restore();
}

/** salt shaker. s = 1 → ~170 wide, ~300 tall, origin = centre; rot tilts it (pour ≈ 2.4) */
export function saltShaker(x, y, s, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.lineJoin = 'round';
  rr(-80, -60, 160, 210, 40); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.save(); rr(-80, -60, 160, 210, 40); ctx.clip(); ctx.fillStyle = '#E9E4DA'; ctx.fillRect(40, -70, 60, 230); ctx.restore();
  rr(-80, -60, 160, 210, 40); ctx.stroke();
  rr(-90, -140, 180, 90, [60, 60, 10, 10]); ctx.fillStyle = STEEL; ctx.fill(); ctx.stroke();
  ell(-30, -112, 30, 10, STEEL_L);
  for (const [dx, dy] of [[-30, -120], [0, -128], [30, -120], [-15, -98], [15, -98]]) circle(dx, dy, 7, C.ink);
  ctx.fillStyle = C.ink; ctx.font = '900 64px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('S', -6, 50);
  ctx.restore();
}

/** falling salt grains from (x, y) for p 0..1 (deterministic) */
export function saltGrains(x, y, p, n = 18, fall = 260) {
  if (p <= 0) return;
  for (let i = 0; i < n; i++) {
    const f = (p * 2.2 + rnd(i) ) % 1, gx = x + (rnd(i * 3.1) - 0.5) * 70 + f * (rnd(i * 5.7) - 0.5) * 40;
    ctx.fillStyle = C.white; ctx.strokeStyle = C.ink; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.rect(gx - 7, y + f * fall - 7, 14, 14); ctx.fill(); ctx.stroke();
  }
}
