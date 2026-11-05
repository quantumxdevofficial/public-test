// Inside Out: CLOUD components (photo card, gallery/backup phone screen, whiteboard + marker, network-diagram box,
// underwater scene, sea-floor cable, fish). Same flat look: flat fills, one darker shade, one light highlight,
// ink outlines only on graphics/cards. No brand logos.
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

const BLUE = '#3A7BD5', GREEN = '#5BAE6A', SEA_D = '#1F4F8F', SEA_DD = '#163B6E', SAND = '#D9C79A', SAND_D = '#C4B07E';

/** a photo card (white border, sky + sun + green hills). s = 1 → 200x170 */
export function photo(x, y, s, rot = 0, a = 1) {
  if (s <= 0 || a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-100, -85, 200, 170, 16); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.save(); rr(-84, -69, 168, 118, 8); ctx.clip();
  ctx.fillStyle = C.sky; ctx.fillRect(-84, -69, 168, 118);
  circle(44, -36, 18, C.yellow);
  ctx.fillStyle = GREEN; ctx.beginPath(); ctx.moveTo(-90, 52); ctx.lineTo(-30, -14); ctx.lineTo(16, 30); ctx.lineTo(46, 4); ctx.lineTo(90, 52); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#3F8A4E'; ctx.beginPath(); ctx.moveTo(-30, -14); ctx.lineTo(-6, 12); ctx.lineTo(-40, 52); ctx.lineTo(-90, 52); ctx.closePath(); ctx.fill();
  ctx.restore();
  ctx.restore();
}

/** gallery phone screen: one big photo + a "backing up" bar (p 0..1) with a small cloud icon */
export function galleryScreen(p = 0, done = false) {
  ctx.fillStyle = '#DCEEF6'; ctx.fillRect(-166, -350, 332, 700);
  ctx.fillStyle = C.ink; ctx.font = '900 30px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('9:41', 0, -290);
  photo(0, -90, 1.45, 0);
  for (let i = 0; i < 3; i++) photo(-100 + i * 100, 120, 0.4, 0);
  rr(-130, 210, 260, 90, 24); ctx.fillStyle = C.white; ctx.fill();
  miniCloud(-80, 255, 0.55, done ? GREEN : BLUE);
  rr(-40, 244, 140, 22, 11); ctx.fillStyle = '#C9D6DE'; ctx.fill();
  if (p > 0) { rr(-40, 244, 140 * clamp(p), 22, 11); ctx.fillStyle = done ? GREEN : BLUE; ctx.fill(); }
}
/** small icon cloud (no outline), s = 1 → ~110x60 */
export function miniCloud(x, y, s, col = C.white) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  circle(-26, 6, 26, col); circle(4, -12, 34, col); circle(34, 6, 24, col); rr(-52, 6, 110, 30, 15); ctx.fillStyle = col; ctx.fill();
  ctx.restore();
}

/** whiteboard on the wall, w x h centred at (x, y) */
export function whiteboard(x, y, w = 900, h = 760) {
  rr(x - w / 2 - 20, y - h / 2 - 20, w + 40, h + 40, 24); ctx.fillStyle = '#9AA1AE'; ctx.fill();
  rr(x - w / 2, y - h / 2, w, h, 14); ctx.fillStyle = C.white; ctx.fill();
  rr(x - 200, y + h / 2 + 18, 400, 26, 10); ctx.fillStyle = '#737B89'; ctx.fill();
}
/** a hand-drawn network-diagram box (computer icon) with a label, drawn in marker blue */
export function diagramBox(x, y, s, label, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.lineWidth = 10; ctx.strokeStyle = BLUE; ctx.lineJoin = 'round';
  rr(-80, -60, 160, 110, 10); ctx.stroke();
  line([[-40, 70], [40, 70]], BLUE, 10); line([[0, 50], [0, 70]], BLUE, 10);
  if (label) { ctx.fillStyle = BLUE; ctx.font = '900 40px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, -4); }
  ctx.restore();
}
/** marker-drawn cloud outline, p 0..1 = how much of the outline is drawn. s = 1 → ~420x240 */
export function markerCloud(x, y, s, p = 1, col = BLUE, wob = 0) {
  if (p <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (1 + wob), s * (1 - wob * 0.6));
  const bumps = [[-150, 30, 70, Math.PI * 0.5, Math.PI * 1.5], [-70, -50, 85, Math.PI * 0.95, Math.PI * 1.85], [60, -60, 90, Math.PI * 1.15, Math.PI * 2.05], [150, 20, 75, Math.PI * 1.45, Math.PI * 2.5]];
  ctx.lineWidth = 12; ctx.strokeStyle = col; ctx.lineCap = 'round';
  const total = bumps.length + 1, k = p * total;
  bumps.forEach(([bx, by, r, a0, a1], i) => { const q = clamp(k - i); if (q > 0) { ctx.beginPath(); ctx.arc(bx, by, r, a0, lerp(a0, a1, q)); ctx.stroke(); } });
  const q = clamp(k - bumps.length); if (q > 0) line([[150, 95], [lerp(150, -150, q), 95]], col, 12);
  ctx.restore();
}
/** marker pen. tip at (x, y) */
export function marker(x, y, rot = -0.7) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(18, -30); ctx.lineTo(-18, -30); ctx.closePath(); ctx.fillStyle = BLUE; ctx.fill();
  rr(-24, -170, 48, 140, 12); ctx.fillStyle = C.ink; ctx.fill(); rr(-24, -200, 48, 40, 12); ctx.fillStyle = BLUE; ctx.fill();
  ctx.restore();
}

/** underwater background: surface band at top (y0), deep blue down to the sand at yS. t sways light rays */
export function underwater(t = 0, y0 = 160, yS = 1150) {
  ctx.fillStyle = C.sky; ctx.fillRect(-300, -300, 1680, y0 + 300);
  ctx.fillStyle = BLUE; ctx.beginPath(); ctx.moveTo(-300, 2400);
  for (let x = -300; x <= 1380; x += 30) ctx.lineTo(x, y0 + Math.sin(x * 0.012 + t * 2) * 12);
  ctx.lineTo(1380, 2400); ctx.closePath(); ctx.fill();
  ctx.fillStyle = SEA_D; ctx.fillRect(-300, y0 + 380, 1680, 2400);
  ctx.fillStyle = SEA_DD; ctx.fillRect(-300, y0 + 720, 1680, 2400);
  ctx.save(); ctx.globalAlpha = 0.08; ctx.fillStyle = C.white;
  for (let i = 0; i < 4; i++) { const bx = 80 + i * 280 + Math.sin(t * 0.8 + i) * 30; ctx.beginPath(); ctx.moveTo(bx, y0); ctx.lineTo(bx + 90, y0); ctx.lineTo(bx + 220, yS); ctx.lineTo(bx + 60, yS); ctx.closePath(); ctx.fill(); }
  ctx.restore();
  ctx.fillStyle = SAND; ctx.beginPath(); ctx.moveTo(-300, 2400);
  for (let x = -300; x <= 1380; x += 40) ctx.lineTo(x, yS + Math.sin(x * 0.006) * 24);
  ctx.lineTo(1380, 2400); ctx.closePath(); ctx.fill();
  ctx.fillStyle = SAND_D; ctx.fillRect(-300, yS + 90, 1680, 1200);
  for (const [x, h] of [[120, 120], [180, 80], [900, 140], [960, 90]]) { ctx.strokeStyle = GREEN; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, yS + 10); ctx.quadraticCurveTo(x + Math.sin(t * 2 + x) * 30, yS - h / 2, x + Math.sin(t * 2 + x + 1) * 20, yS - h); ctx.stroke(); }
}
/** sea-floor cable along y (gentle wave), from x0 to x1, p 0..1 = how far it is laid */
export function seaCable(x0, x1, y, p = 1) {
  if (p <= 0) return;
  const xe = lerp(x0, x1, clamp(p));
  for (const [w, c] of [[30, C.ink], [18, '#2E3B58']]) {
    ctx.save(); ctx.lineCap = 'round'; ctx.lineWidth = w; ctx.strokeStyle = c; ctx.beginPath();
    for (let x = x0; x <= xe; x += 20) { const yy = y + Math.sin(x * 0.008) * 18; x === x0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); }
    ctx.stroke(); ctx.restore();
  }
}
export const seaCableY = (x, y) => y + Math.sin(x * 0.008) * 18;
/** glowing data pulse riding the cable */
export function pulse(x, y, r = 18) { circle(x, y, r * 1.8, 'rgba(255,212,59,0.35)'); circle(x, y, r, C.yellow); }
/** simple flat fish. flip = -1 faces left */
export function fish(x, y, s, flip = 1, col = '#F29A3A', t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * flip, s);
  const wag = Math.sin(t * 10) * 0.25;
  ctx.save(); ctx.translate(-50, 0); ctx.rotate(wag); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-40, -30); ctx.lineTo(-40, 30); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.restore();
  ell(0, 0, 60, 36, col); ell(10, -10, 30, 10, 'rgba(255,255,255,0.35)');
  circle(32, -6, 9, C.white); circle(34, -6, 5, C.ink);
  ctx.restore();
}
/** a small "offline" data center: dark windows. Draw over K.dataCenter footprint with alpha a */
export function darken(x, y, s, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a * 0.6; ctx.translate(x, y); ctx.scale(s, s);
  rr(-380, -330, 760, 560, 26); ctx.fillStyle = C.ink; ctx.fill();
  ctx.restore();
}
