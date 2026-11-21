// Inside Out: FACE ID components (How Does Face ID Actually Know It's You?). Flat fills, one darker shade, one highlight.
// Cyan = the "infrared / inside the phone" view only. Yellow = nearest depth / highlight. Red = rejected.
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';
import { heroHead } from './kit.js';

const GREEN = '#5BAE6A', IR_DARK = '#17304D', IR_MID = '#21436A';
export const FACE_GREEN = GREEN;
const hash = (i, j) => { const v = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return v - Math.floor(v); };

/** the hero's head as a bust, centred on the face oval (face oval rx 102, ry 112 at s = 1).
 *  o = head options (eyes, mouth, brow, look, smirk) + { bust: true, hair, shirt, skin } colour overrides */
export function faceHead(x, y, s, o = {}) {
  if (s <= 0) return;
  const keep = { hair: C.hair, hairHi: C.hairHi, skin: C.skin, skinShade: C.skinShade };
  if (o.hair) { C.hair = o.hair; C.hairHi = o.hairHi || o.hair; }
  if (o.skin) { C.skin = o.skin; C.skinShade = o.skinShade || o.skin; }
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (o.bust !== false) {
    rr(-170, 150, 340, 260, [110, 110, 30, 30]); ctx.fillStyle = o.shirt || C.shirt; ctx.fill();
    rr(-36, 80, 72, 100, 22); ctx.fillStyle = C.skin; ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, 156, 46, 26, 0, 0, Math.PI); ctx.fillStyle = C.skin; ctx.fill();
  }
  ctx.translate(0, 350 - 12);
  heroHead(o);
  ctx.restore();
  Object.assign(C, keep);
}

/** infrared silhouette of the same head (what the IR camera sees): dark navy flat shapes */
export function irFace(x, y, s, a = 1) {
  if (s <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s);
  rr(-170, 150, 340, 260, [110, 110, 30, 30]); ctx.fillStyle = IR_DARK; ctx.fill();
  rr(-36, 80, 72, 100, 22); ctx.fillStyle = IR_MID; ctx.fill();
  ell(0, -46, 116, 94, IR_DARK);
  for (const sd of [-1, 1]) ell(sd * 104, 2, 22, 28, IR_MID);
  ell(0, 0, 102, 112, IR_MID);
  ctx.restore();
}

/** depth of a face point (local, face-centred), 0 = edge, 1 = nose tip */
function depthAt(dx, dy) {
  const e = 1 - (dx / 102) ** 2 - (dy / 112) ** 2; if (e <= 0) return -1;
  let z = Math.sqrt(e) * 0.72;
  z += 0.32 * Math.exp(-((dx / 22) ** 2 + ((dy - 26) / 40) ** 2));     // nose
  z -= 0.18 * Math.exp(-(((Math.abs(dx) - 40) / 22) ** 2 + ((dy + 4) / 16) ** 2)); // eye sockets
  return clamp(z, 0, 1);
}

/** dot pattern sprayed over the face oval. p 0..1 = how much has landed (sweeps top → bottom).
 *  o = { depth: 0..1 (dots sized + coloured by depth), col, read: 0..1 (dots turn yellow as read), flat: bool, r } */
export function faceDots(x, y, s, p = 1, o = {}) {
  if (p <= 0 || s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const step = 15, dep = o.depth || 0;
  for (let j = -8; j <= 8; j++) for (let i = -8; i <= 8; i++) {
    const h = hash(i, j), dx = i * step + (h - 0.5) * 7, dy = j * step * 1.05 + (hash(j, i) - 0.5) * 7;
    const z = o.flat ? 0.6 : depthAt(dx, dy); if (z < 0) continue;
    const when = (dy + 118) / 236 * 0.8 + h * 0.2; if (p < when) continue;
    const pop = clamp((p - when) / 0.08);
    const bx = dx * (1 + dep * z * 0.06), by = dy * (1 + dep * z * 0.04);
    let col = o.col || C.cyan;
    if (dep > 0.5) col = z > 0.8 ? C.yellow : z > 0.6 ? '#FFE58A' : z > 0.4 ? '#9FE6F1' : C.cyan;
    if (o.read !== undefined && o.read > when) col = C.yellow;
    circle(bx, by, (o.r || 3.6) * (1 + dep * (z - 0.4) * 1.1) * pop, col);
  }
  ctx.restore();
}

/** the 3D depth map: stepped flat layers (far = dark teal, near = yellow), turn = -1..1 fakes a head turn via parallax */
export function faceMesh(x, y, s, p = 1, turn = 0) {
  if (p <= 0 || s <= 0) return;
  const cols = ['#17405E', '#1F6F8B', '#2FA3BF', C.cyan, '#9FE6F1', '#FFE58A', C.yellow];
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const q = (k) => clamp(p * 6 - k * 0.7);
  // forehead → cheeks: stepped ovals, centre drifts toward the nose; parallax on turn
  const layers = [[0, 102, 112, 0], [0, 94, 104, 4], [0, 84, 96, 8], [0, 72, 86, 12]];
  layers.forEach(([cx, rx, ry, cy], k) => { const a = q(k); if (a > 0) ell(cx + turn * k * 8, cy, rx * a, ry * a, cols[k]); });
  // eye sockets (deep), cheekbones (mid)
  { const a = q(3); if (a > 0) for (const sd of [-1, 1]) { ell(sd * 52 + turn * 40, 34, 26 * a, 22 * a, cols[4]); ell(sd * 40 + turn * 30, -8, 28 * a, 18 * a, cols[0]); } }
  // brow ridge
  { const a = q(4); if (a > 0) for (const sd of [-1, 1]) ell(sd * 40 + turn * 44, -32, 30 * a, 9 * a, cols[4]); }
  // nose: ridge + tip, nearest = yellow
  { const a = q(5); if (a > 0) { rr(-12 * a + turn * 56, -20, 24 * a, 56 * a, 12); ctx.fillStyle = cols[5]; ctx.fill(); ell(turn * 64, 36, 24 * a, 18 * a, cols[6]); } }
  // lips + chin
  { const a = q(4); if (a > 0) { ell(turn * 46, 66, 32 * a, 11 * a, cols[4]); ell(turn * 40, 98, 30 * a, 12 * a, cols[3]); } }
  ctx.restore();
}

/** side profile of the head facing LEFT, centred on the skull. Returns surface points { nose: [x,y], cheek: [x,y] } */
export function profileHead(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-10, 80, 74, 150, 26); ctx.fillStyle = C.skin; ctx.fill();
  rr(-60, 190, 220, 140, [70, 70, 20, 20]); ctx.fillStyle = C.shirt; ctx.fill();
  ell(0, 10, 100, 112, C.skin);
  ctx.beginPath(); ctx.moveTo(-94, 6); ctx.lineTo(-134, 50); ctx.quadraticCurveTo(-130, 62, -96, 62); ctx.closePath(); ctx.fillStyle = C.skin; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-96, 30); ctx.lineTo(-120, 52); ctx.strokeStyle = C.skinShade; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.stroke();
  ctx.save(); ctx.beginPath(); ctx.rect(-200, -200, 400, 170); ctx.rect(30, -40, 200, 200); ctx.clip(); ell(14, -34, 112, 100, C.hair); ell(62, 10, 54, 96, C.hair); ctx.restore();
  ell(-74, -32, 24, 6, C.hair);
  ell(28, 18, 18, 26, C.skin); ell(30, 18, 8, 13, C.skinShade);
  ell(-62, 0, 8, 11, C.ink); circle(-64, -4, 3, C.white);
  ctx.beginPath(); ctx.moveTo(-94, 86); ctx.lineTo(-72, 88); ctx.strokeStyle = C.mouth; ctx.lineWidth = 7; ctx.stroke();
  ctx.restore();
  return { nose: [x - 134 * s, y + 50 * s], cheek: [x - 92 * s, y + 66 * s - 40 * s] };
}

/** phone seen edge-on (side view), facing right. h = length */
export function phoneEdge(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-22, -380, 44, 760, 22); ctx.fillStyle = C.ink; ctx.fill();
  rr(14, -380, 8, 760, 4); ctx.fillStyle = '#2A2A30'; ctx.fill();
  rr(16, -330, 14, 40, 6); ctx.fillStyle = '#3A1A22'; ctx.fill();
  ctx.restore();
}

/** the sensor strip at the top of the phone: dot projector (left), front camera, IR camera (right).
 *  proj 0..1 = projector glow, cam 0..1 = IR camera glow. Returns lens x offsets (scaled). */
export function notchBar(x, y, s, proj = 0, cam = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-170, -34, 340, 68, 34); ctx.fillStyle = C.ink; ctx.fill();
  const lens = (lx, r, col, g, gc) => {
    if (g > 0) { ctx.save(); ctx.globalAlpha = 0.45 * g; circle(lx, 0, r * 2.2, gc); ctx.restore(); }
    circle(lx, 0, r, '#2A2A30'); circle(lx, 0, r * 0.62, col); circle(lx - r * 0.25, -r * 0.25, r * 0.2, 'rgba(255,255,255,0.5)');
  };
  lens(-110, 20, proj > 0 ? C.red : '#3A1A22', proj, C.red);
  lens(-40, 9, '#3A3A44', 0, C.white);
  lens(30, 17, '#1F2A44', 0, C.white);
  lens(110, 20, cam > 0 ? C.cyan : '#1F3344', cam, C.cyan);
  ctx.restore();
  return { proj: x - 110 * s, cam: x + 110 * s };
}

/** Face ID glyph: four rounded corner brackets + a simple face. state 1 = check, -1 = sad */
export function faceIdIcon(x, y, s, col = C.white, state = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { ctx.beginPath(); ctx.moveTo(sx * 56, sy * 22); ctx.lineTo(sx * 56, sy * 44); ctx.quadraticCurveTo(sx * 56, sy * 56, sx * 44, sy * 56); ctx.lineTo(sx * 22, sy * 56); ctx.stroke(); }
  if (state === 1) { ctx.beginPath(); ctx.moveTo(-24, 2); ctx.lineTo(-6, 20); ctx.lineTo(26, -16); ctx.stroke(); }
  else {
    line([[-18, -18], [-18, -6]], col, 9); line([[18, -18], [18, -6]], col, 9);
    ctx.beginPath(); ctx.moveTo(3, -16); ctx.lineTo(3, 6); ctx.lineTo(-5, 6); ctx.stroke();
    ctx.beginPath(); if (state === -1) { ctx.moveTo(-20, 28); ctx.quadraticCurveTo(0, 14, 20, 28); } else { ctx.moveTo(-20, 18); ctx.quadraticCurveTo(0, 34, 20, 18); } ctx.stroke();
  }
  ctx.restore();
}

/** lock screen (inside K.phone). state 0 scanning, 1 unlocked (green), -1 rejected (red). scan 0..1 shows a moving scan line */
export const faceLockScreen = (state = 0, scan = 0, t = 0) => () => {
  ctx.fillStyle = '#1F2A44'; ctx.fillRect(-166, -350, 332, 700);
  ctx.fillStyle = C.white; ctx.font = '900 64px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('9:41', 0, -230);
  ctx.font = '700 26px Inter'; ctx.fillStyle = '#AFC0DA'; ctx.fillText(state === 1 ? 'Unlocked' : state === -1 ? 'Not recognized' : 'Face ID', 0, -160);
  const col = state === 1 ? GREEN : state === -1 ? C.red : C.white;
  if (state !== 0) { ctx.save(); ctx.globalAlpha = 0.3; circle(0, 60, 110, col); ctx.restore(); }
  faceIdIcon(0, 60, 1.25, col, state);
  if (scan > 0 && state === 0) { const yy = 60 + Math.sin(t * 6) * 60; ctx.save(); ctx.globalAlpha = scan; line([[-80, yy], [80, yy]], C.cyan, 6); ctx.restore(); }
};

/** a printed photo of the hero: white card with a sky panel. sx squashes it to show it's flat (edge-on) */
export function photoCard(x, y, s, rot = 0, sx = 1) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * Math.max(0.04, sx), s);
  rr(-170, -210, 340, 420, 18); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.save(); rr(-146, -186, 292, 320, 8); ctx.clip(); ctx.fillStyle = C.sky; ctx.fillRect(-146, -186, 292, 320);
  faceHead(0, -40, 0.95, {});
  ctx.restore();
  ctx.restore();
}

/** "1 in 1,000,000" badge: an ink card with the big number */
export function oddsCard(x, y, s, a = 1) {
  if (s <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s);
  rr(-400, -130, 800, 260, 50); ctx.fillStyle = C.ink; ctx.fill();
  ctx.fillStyle = C.yellow; ctx.font = '900 120px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('1,000,000', 0, 30);
  ctx.fillStyle = C.white; ctx.font = '900 54px Inter'; ctx.fillText('1 IN', 0, -78);
  ctx.restore();
}
