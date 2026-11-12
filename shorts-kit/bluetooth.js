// Inside Out: Bluetooth components (earbud, music note, channel strip, viking king, rune stone, flags, chain link).
// Flat fills, one darker shade, one light highlight, ink outlines only on graphics.
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

const BT = '#3A7BD5', GOLD = '#E0B23A', STONE = '#9AA0A6', STONE_D = '#7D838A', STONE_L = '#B8BDC2';
const BEARD = '#C8734A', BEARD_D = '#A85E3A', TUNIC = '#3E7F4C', TUNIC_D = '#326A3F', CLOAK = '#8A4B2E';
export const BT_BLUE = BT;

/** a white earbud: round head + stem. s = 1 → ~130 x 230. xray = cutaway with battery + radio chip + antenna (cyan) */
export function earbud(x, y, s, rot = 0, xray = false, glow = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  const body = xray ? C.xnavy : C.white, edge = xray ? C.cyan : C.ink, shade = xray ? C.xnavy : '#DCD8D0';
  ctx.lineWidth = 8; ctx.strokeStyle = edge; ctx.lineJoin = 'round';
  rr(-6, 10, 46, 190, 23); ctx.fillStyle = body; ctx.fill(); ctx.stroke();
  if (!xray) { rr(20, 20, 16, 170, 8); ctx.fillStyle = shade; ctx.fill(); }
  ctx.beginPath(); ctx.arc(0, 0, 64, 0, TAU); ctx.fillStyle = body; ctx.fill(); ctx.stroke();
  if (!xray) { ell(-6, 4, 44, 44, shade); circle(-14, -4, 26, '#4A4E58'); ell(22, -30, 14, 8, C.white, -0.6); }
  else {
    rr(-34, -30, 56, 56, 12); ctx.stroke();                         // battery
    line([[-20, -16], [-20, 12]], C.cyan, 5); line([[-2, -16], [-2, 12]], C.cyan, 5);
    rr(-2, 70, 40, 40, 6); ctx.fillStyle = glow > 0 ? C.yellow : 'rgba(79,209,232,0.3)'; ctx.globalAlpha = glow > 0 ? 0.4 + 0.6 * glow : 1; ctx.fill(); ctx.globalAlpha = 1; ctx.stroke();
    line([[17, 110], [17, 185]], C.cyan, 6);                         // antenna
    for (let k = 0; k < 3; k++) line([[0, 76 + k * 14], [-10, 76 + k * 14]], C.cyan, 4);
  }
  ctx.restore();
}

/** a flat music note (eighth note). s = 1 → ~90 x 130 */
export function musicNote(x, y, s, col = C.yellow, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.lineWidth = 8; ctx.strokeStyle = C.ink;
  ctx.beginPath(); ctx.ellipse(-20, 40, 30, 22, -0.4, 0, TAU); ctx.fillStyle = col; ctx.fill(); ctx.stroke();
  rr(4, -70, 14, 112, 6); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(10, -70); ctx.quadraticCurveTo(60, -50, 46, -6); ctx.quadraticCurveTo(44, -40, 14, -38); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}

/** a row of n radio channels as bars. cur = hopper channel (-1 none), busy(i) → 0..1 how jammed channel i is */
export function channelStrip(x, y, w, h, n = 79, cur = -1, busy = () => 0, sc = 1, t = 0) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  rr(-w / 2 - 24, -h / 2 - 24, w + 48, h + 48, 28); ctx.fillStyle = C.ink; ctx.fill();
  const bw = w / n;
  for (let i = 0; i < n; i++) {
    const b = busy(i), bx = -w / 2 + i * bw;
    const bh = h * (0.35 + 0.1 * Math.sin(i * 1.7 + t * 3) + 0.55 * b);
    ctx.fillStyle = b > 0.05 ? C.red : '#3A4458';
    ctx.fillRect(bx + bw * 0.15, h / 2 - bh, bw * 0.7, bh);
  }
  if (cur >= 0) { const bx = -w / 2 + cur * bw; ctx.fillStyle = C.yellow; ctx.fillRect(bx - bw * 0.6, -h / 2, bw * 2.2, h); }
  ctx.restore();
}
/** x of channel i inside a channelStrip centred at x with width w */
export const channelX = (x, w, n, i) => x - w / 2 + (i + 0.5) * w / n;

/** friendly cartoon viking king: crown, ginger beard, green tunic, brown cloak. origin = chest centre, s = 1 → ~1000 px tall.
 *  o = { mouth: 'smile' | 'grin' (grin shows his one blue tooth), wave 0..1 raises the right hand, look -1..1, t } */
export function vikingKing(x, y, s, o = {}) {
  if (s <= 0) return;
  const t = o.t || 0, wv = o.wave || 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // cloak behind
  ctx.beginPath(); ctx.moveTo(-170, -200); ctx.lineTo(-230, 560); ctx.lineTo(230, 560); ctx.lineTo(170, -200); ctx.closePath(); ctx.fillStyle = CLOAK; ctx.fill();
  // legs + boots
  rr(-120, 200, 110, 380, 36); ctx.fillStyle = C.pants; ctx.fill(); rr(10, 200, 110, 380, 36); ctx.fill();
  rr(-134, 530, 130, 70, 30); ctx.fillStyle = BEARD_D; ctx.fill(); rr(4, 530, 130, 70, 30); ctx.fill();
  // left arm down
  line([[-150, -150], [-190, 40], [-170, 170]], TUNIC_D, 56); circle(-170, 180, 34, C.skin);
  // tunic
  ctx.beginPath(); ctx.moveTo(-60, -220); ctx.bezierCurveTo(-140, -220, -170, -190, -170, -120); ctx.lineTo(-150, 260); ctx.lineTo(150, 260); ctx.lineTo(170, -120);
  ctx.bezierCurveTo(170, -190, 140, -220, 60, -220); ctx.closePath(); ctx.fillStyle = TUNIC; ctx.fill();
  rr(-150, 120, 300, 46, 12); ctx.fillStyle = BEARD_D; ctx.fill(); rr(-30, 116, 60, 54, 10); ctx.fillStyle = GOLD; ctx.fill();
  // right arm (waves)
  const ex = lerp(190, 240, wv), ey = lerp(40, -150, wv), hx = lerp(170, 290 + Math.sin(t * 10) * 30 * wv, wv), hy = lerp(170, -330, wv);
  line([[150, -150], [ex, ey], [hx, hy]], TUNIC_D, 56); circle(hx, hy, 36, C.skin);
  // head
  ctx.save(); ctx.translate(0, -360);
  for (const sd of [-1, 1]) ell(sd * 100, 10, 22, 28, C.skin);
  ell(0, 10, 100, 110, C.skin);
  // beard
  ctx.beginPath(); ctx.moveTo(-104, 0); ctx.quadraticCurveTo(-110, 150, -40, 190); ctx.quadraticCurveTo(0, 230, 40, 190); ctx.quadraticCurveTo(110, 150, 104, 0);
  ctx.quadraticCurveTo(80, 70, 40, 60); ctx.lineTo(-40, 60); ctx.quadraticCurveTo(-80, 70, -104, 0); ctx.closePath(); ctx.fillStyle = BEARD; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-60, 52); ctx.quadraticCurveTo(0, 30, 60, 52); ctx.quadraticCurveTo(0, 64, -60, 52); ctx.fillStyle = BEARD_D; ctx.fill();  // moustache
  // hair sides
  ell(-96, -40, 26, 50, BEARD); ell(96, -40, 26, 50, BEARD);
  // eyes + brows
  const lk = o.look || 0;
  for (const sd of [-1, 1]) { ell(sd * 38 + lk * 6, -6, 11, 14, C.ink); circle(sd * 38 + 4 + lk * 6, -11, 4, C.white); line([[sd * 62, -42], [sd * 18, -48]], BEARD_D, 12); }
  ctx.globalAlpha = 0.3; for (const sd of [-1, 1]) ell(sd * 60, 30, 18, 11, C.pink); ctx.globalAlpha = 1;
  // mouth
  if (o.mouth === 'grin') {
    ctx.beginPath(); ctx.moveTo(-40, 74); ctx.quadraticCurveTo(0, 130, 40, 74); ctx.closePath(); ctx.fillStyle = C.mouth; ctx.fill();
    for (let k = 0; k < 4; k++) { rr(-34 + k * 17.5, 74, 15, 18, 4); ctx.fillStyle = k === 2 ? BT : C.white; ctx.fill(); }
  } else { ctx.beginPath(); ctx.moveTo(-26, 78); ctx.quadraticCurveTo(0, 96, 26, 78); ctx.strokeStyle = C.mouth; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.stroke(); }
  // crown
  ctx.beginPath(); ctx.moveTo(-96, -70); ctx.lineTo(-104, -170); ctx.lineTo(-52, -120); ctx.lineTo(0, -190); ctx.lineTo(52, -120); ctx.lineTo(104, -170); ctx.lineTo(96, -70); ctx.closePath();
  ctx.fillStyle = C.yellow; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.lineJoin = 'round'; ctx.stroke();
  rr(-96, -96, 192, 30, 8); ctx.fillStyle = GOLD; ctx.fill(); ctx.stroke();
  circle(0, -82, 10, C.red); circle(-56, -82, 8, BT); circle(56, -82, 8, BT);
  ctx.restore();
  ctx.restore();
}

/** a grey rune stone with two runes (Hagall = H, Bjarkan = B) carved side by side. carve 0..1 per stroke, lab 0..1 shows H / B labels */
export function runeStone(x, y, s, carve = 1, lab = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-250, 300); ctx.quadraticCurveTo(-290, -150, -150, -300); ctx.quadraticCurveTo(0, -360, 170, -290); ctx.quadraticCurveTo(300, -150, 260, 300); ctx.closePath();
  ctx.fillStyle = STONE; ctx.fill();
  ctx.save(); ctx.clip(); ctx.beginPath(); ctx.moveTo(150, -340); ctx.quadraticCurveTo(220, 0, 170, 320); ctx.lineTo(320, 320); ctx.lineTo(320, -340); ctx.fillStyle = STONE_D; ctx.fill(); ctx.restore();
  ell(-150, -200, 50, 22, STONE_L, -0.5);
  rr(-300, 290, 600, 40, 20); ctx.fillStyle = STONE_D; ctx.fill();
  // strokes: [glyph centre x, points]
  const strokes = [
    [[-110, -150], [-110, 150]], [[-180, -70], [-40, 70]], [[-40, -70], [-180, 70]],           // ᚼ hagall
    [[100, -150], [100, 150]], [[100, -150], [180, -70], [100, 0], [180, 70], [100, 150]],    // ᛒ bjarkan
  ];
  const n = strokes.length;
  strokes.forEach((p, i) => {
    const u = clamp(carve * n - i); if (u <= 0) return;
    // partial polyline
    let total = 0; for (let k = 1; k < p.length; k++) total += Math.hypot(p[k][0] - p[k - 1][0], p[k][1] - p[k - 1][1]);
    let left = total * u; const pts = [p[0]];
    for (let k = 1; k < p.length && left > 0; k++) { const L = Math.hypot(p[k][0] - p[k - 1][0], p[k][1] - p[k - 1][1]), f = Math.min(1, left / L); pts.push([lerp(p[k - 1][0], p[k][0], f), lerp(p[k - 1][1], p[k][1], f)]); left -= L; }
    ctx.lineJoin = 'round'; line(pts, '#3F444B', 30);
  });
  if (lab > 0) {
    ctx.globalAlpha = lab; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '900 96px Inter';
    for (const [lx, l] of [[-110, 'H'], [140, 'B']]) { rr(lx - 60, 180, 120, 100, 24); ctx.fillStyle = C.yellow; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.fillStyle = C.ink; ctx.fillText(l, lx, 234); }
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

/** a small waving flag on a pole. kind 'dk' (red, white cross) | 'no' (red, white+blue cross). s = 1 → 300x200 cloth */
export function nordicFlag(x, y, s, kind = 'dk', t = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-170, -130, 18, 460, 9); ctx.fillStyle = C.ink; ctx.fill(); circle(-161, -134, 16, GOLD);
  ctx.save(); ctx.translate(-152, -120);
  ctx.beginPath(); ctx.moveTo(0, 0);
  const wv = (u) => Math.sin(u * 5 + t * 6) * 10 * u;
  for (let u = 0; u <= 1.001; u += 0.1) ctx.lineTo(u * 300, wv(u));
  for (let u = 1; u >= -0.001; u -= 0.1) ctx.lineTo(u * 300, 200 + wv(u));
  ctx.closePath(); ctx.fillStyle = C.red; ctx.fill(); ctx.save(); ctx.clip();
  const cross = (w, col) => { ctx.fillStyle = col; ctx.fillRect(100 - w / 2, -20, w, 260); ctx.fillRect(-10, 100 - w / 2, 330, w); };
  cross(40, C.white); if (kind === 'no') cross(20, '#1F3A7A');
  ctx.restore(); ctx.restore();
  ctx.restore();
}

/** two interlocked chain links (paired). s = 1 → ~300 wide. p 0..1 joins them */
export function chainLink(x, y, s, p = 1, rot = -0.3) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  const off = lerp(140, 60, clamp(p));
  for (const [sd, col] of [[-1, C.yellow], [1, GOLD]]) {
    rr(sd * off - 90, -50, 180, 100, 50); ctx.lineWidth = 46; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.lineWidth = 28; ctx.strokeStyle = col; ctx.stroke();
  }
  ctx.restore();
}
