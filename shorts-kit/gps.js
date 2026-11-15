// GPS components (How Does Your Phone Know Where You Are?): flat Inside Out look.
// satellite, space, earthCap, orbitRing, atomClock, rangeCircle, mapScreen, blueDot, signalDot, clockFace
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line, rnd } from './lib.js';

const PANEL = '#3A7BD5', PANEL_D = '#2A5FAE', PANEL_L = '#7FB0EE', FOIL = '#E6B82E', FOIL_D = '#C49A1E', STEEL = '#AEB7C4', STEEL_D = '#8C96A5';
const SPACE = '#1E2A44', SPACE_D = '#17213A', SEA = '#3A7BD5', LAND = '#5BAE6A', LAND_D = '#3F8A4E';
const MAP = '#EEF1E6', ROAD = '#FFFFFF', PARK = '#BFE3B4', WATER = '#BFE3F2', DOT = '#2F7DF6';

/** GPS satellite: gold body, two blue solar panels, dish pointing down. s = 1 → ~520 wide */
export function satellite(x, y, s, rot = 0, t = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  // panel arms
  line([[-200, 0], [200, 0]], STEEL_D, 14);
  for (const sx of [-1, 1]) {
    ctx.save(); ctx.translate(sx * 180, 0);
    rr(sx > 0 ? 0 : -150, -55, 150, 110, 8); ctx.fillStyle = C.ink; ctx.fill();
    rr(sx > 0 ? 6 : -144, -49, 138, 98, 5); ctx.fillStyle = PANEL; ctx.fill();
    ctx.strokeStyle = PANEL_D; ctx.lineWidth = 5;
    for (let k = 1; k < 4; k++) { const xx = (sx > 0 ? 6 : -144) + k * 34.5; line([[xx, -49], [xx, 49]], PANEL_D, 5); }
    line([[sx > 0 ? 6 : -144, 0], [sx > 0 ? 144 : -6, 0]], PANEL_D, 5);
    rr(sx > 0 ? 12 : -138, -43, 40, 18, 4); ctx.fillStyle = PANEL_L; ctx.fill();
    ctx.restore();
  }
  // body
  rr(-62, -70, 124, 140, 14); ctx.fillStyle = C.ink; ctx.fill();
  rr(-55, -63, 110, 126, 10); ctx.fillStyle = FOIL; ctx.fill();
  rr(-55, 20, 110, 43, [0, 0, 10, 10]); ctx.fillStyle = FOIL_D; ctx.fill();
  rr(-42, -52, 30, 50, 6); ctx.fillStyle = '#F4D46A'; ctx.fill();
  // dish + antenna
  ctx.beginPath(); ctx.moveTo(-40, 70); ctx.lineTo(40, 70); ctx.lineTo(24, 100); ctx.lineTo(-24, 100); ctx.closePath(); ctx.fillStyle = STEEL; ctx.fill();
  ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.stroke();
  line([[0, 100], [0, 126]], C.ink, 8); circle(0, 130, 9, C.red);
  // blinking light
  if (Math.sin(t * 6) > 0) circle(42, -54, 8, C.red);
  ctx.restore();
}
/** deep-space background with soft dot stars */
export function space(t = 0) {
  ctx.fillStyle = SPACE; ctx.fillRect(-300, -300, 1680, 2520);
  for (let i = 0; i < 70; i++) {
    const x = rnd(i) * 1500 - 210, y = rnd(i + 99) * 2300 - 190, r = 2 + rnd(i + 7) * 4;
    ctx.globalAlpha = 0.4 + 0.5 * Math.abs(Math.sin(t * 1.5 + i)); circle(x, y, r, '#FFFFFF');
  }
  ctx.globalAlpha = 1;
}
/** a big curved piece of Earth (top of a huge globe) whose top edge is at y. off scrolls continents */
export function earthCap(y, off = 0, R = 1700) {
  const cx = 540, cy = y + R;
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R + 16, 0, TAU); ctx.fillStyle = '#9FD3EA'; ctx.fill();
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fillStyle = SEA; ctx.fill(); ctx.clip();
  for (let k = -2; k < 4; k++) {
    const x = ((k * 520 + off) % 2600 + 2600) % 2600 - 900;
    ell(x, y + 140, 230, 110, LAND); ell(x + 120, y + 260, 140, 90, LAND); ell(x - 60, y + 110, 110, 40, LAND_D);
  }
  ctx.restore();
}
/** dashed orbit ellipse */
export function orbitRing(x, y, rx, ry, a = 1, rot = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.setLineDash([18, 22]); ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, TAU); ctx.stroke(); ctx.restore();
}
/** clock face. ang = second-hand angle (rad); atom = draw the little atom badge; col = rim colour */
export function clockFace(x, y, s, ang = 0, { atom = false, col = C.ink, label = null } = {}) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  circle(0, 0, 200, col); circle(0, 0, 178, C.white);
  for (let k = 0; k < 12; k++) { const a = k * TAU / 12; line([[Math.cos(a) * 150, Math.sin(a) * 150], [Math.cos(a) * 168, Math.sin(a) * 168]], C.ink, k % 3 ? 6 : 12); }
  if (atom) {
    ctx.save(); ctx.globalAlpha = 0.9; ctx.strokeStyle = C.cyan; ctx.lineWidth = 8;
    for (const r of [0, TAU / 3, 2 * TAU / 3]) { ctx.beginPath(); ctx.ellipse(0, 60, 70, 24, r, 0, TAU); ctx.stroke(); }
    circle(0, 60, 14, C.red); ctx.restore();
  }
  line([[0, 0], [Math.cos(-1.2) * 80, Math.sin(-1.2) * 80]], C.ink, 16);
  line([[0, 0], [Math.cos(ang - Math.PI / 2) * 140, Math.sin(ang - Math.PI / 2) * 140]], C.red, 8);
  circle(0, 0, 16, C.ink);
  if (label) { ctx.font = '900 54px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = C.ink; ctx.fillText(label, 0, 260); }
  ctx.restore();
}
/** a range circle (distance from a satellite) drawn growing to radius r. p 0..1 grows it */
export function rangeCircle(x, y, r, p = 1, col = FOIL, a = 1) {
  if (p <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.lineWidth = 12; ctx.strokeStyle = col; ctx.setLineDash([30, 18]);
  ctx.beginPath(); ctx.arc(x, y, r * clamp(p), 0, TAU); ctx.stroke(); ctx.restore();
}
/** the blue "you are here" dot with a pulsing halo */
export function blueDot(x, y, s = 1, t = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const p = (t * 0.9) % 1;
  ctx.globalAlpha = 0.35 * (1 - p); circle(0, 0, 40 + p * 70, DOT); ctx.globalAlpha = 1;
  circle(0, 0, 40, C.white); circle(0, 0, 30, DOT); circle(-9, -9, 8, 'rgba(255,255,255,0.6)');
  ctx.restore();
}
/** flat street map filling a box (cx, cy, w, h); ox/oy pan it. Draws in current coords. */
export function streetMap(cx, cy, w, h, ox = 0, oy = 0) {
  ctx.save(); rr(cx - w / 2, cy - h / 2, w, h, 0); ctx.clip();
  ctx.fillStyle = MAP; ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
  ctx.translate(cx + ox, cy + oy);
  for (let i = -6; i <= 6; i++) for (let j = -8; j <= 8; j++) {
    const k = (i * 31 + j * 17 + 400) % 7;
    if (k === 0) { rr(i * 180 - 70, j * 180 - 70, 140, 140, 16); ctx.fillStyle = PARK; ctx.fill(); }
    if (k === 3) { rr(i * 180 - 70, j * 180 - 70, 140, 140, 16); ctx.fillStyle = WATER; ctx.fill(); }
  }
  for (let i = -6; i <= 6; i++) { line([[i * 180 + 90, -1600], [i * 180 + 90, 1600]], ROAD, i % 2 ? 22 : 34); line([[-1200, i * 180 + 90], [1200, i * 180 + 90]], ROAD, i % 2 ? 22 : 34); }
  line([[-1200, 700], [1200, -500]], '#FFD98A', 30);
  ctx.restore();
}
/** phone map screen (screen-local coords 332x700): street map, blue dot at (dx, dy) offset; pin = red true-position pin */
export function mapScreen(t = 0, { dx = 0, dy = 0, dot = 1, ox = 0, oy = 0, trail = 0 } = {}) {
  streetMap(0, 0, 332, 700, ox, oy);
  if (trail > 0) { ctx.save(); ctx.setLineDash([14, 12]); line([[0, 40], [dx, 40 + dy]], C.red, 8); ctx.restore(); }
  blueDot(dx, 40 + dy, 0.9 * dot, t);
  rr(-140, -320, 280, 64, 32); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#D5D9DF'; ctx.stroke();
  circle(-104, -288, 12, DOT); rr(-80, -296, 160, 16, 8); ctx.fillStyle = '#C9CED6'; ctx.fill();
}
/** a small yellow signal blip (travels along a path) */
export function signalDot(x, y, s = 1) {
  circle(x, y, 24 * s, C.ink); circle(x, y, 17 * s, C.yellow); circle(x - 5 * s, y - 5 * s, 6 * s, C.white);
}
export const GPS_DOT = DOT, GPS_FOIL = FOIL;
