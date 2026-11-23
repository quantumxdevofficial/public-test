// Traffic components (How Does Google Maps Know There's Traffic?): flat Inside Out look.
// TRAFFIC colours, trafficMap (phone map with a coloured main road), polyAt/polyLine, cctv, miniPhone, speedBubble,
// dataTicket, hourChart, skyline, wagon (handcart of phones), sideRoad
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line, rnd } from './lib.js';

export const TRAFFIC = { green: '#3FAE5F', orange: '#F29A3A', red: '#D62839', dark: '#8E1B26', blue: '#2F7DF6' };
const MAP = '#EEF1E6', ROAD = '#FFFFFF', ROAD_E = '#D9DDD2', PARK = '#BFE3B4', WATER = '#BFE3F2', BLD = '#E2E3D8';

/** length-parametrised point on a polyline pts at u 0..1 → [x, y, angle] */
export function polyAt(pts, u) {
  const L = []; let tot = 0;
  for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(l); tot += l; }
  let d = clamp(u) * tot;
  for (let i = 0; i < L.length; i++) {
    if (d <= L[i] || i === L.length - 1) {
      const k = L[i] ? clamp(d / L[i]) : 0, a = pts[i], b = pts[i + 1];
      return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), Math.atan2(b[1] - a[1], b[0] - a[0])];
    }
    d -= L[i];
  }
  return [...pts[0], 0];
}
/** draw the polyline from u0 to u1 (rounded) */
export function polyLine(pts, u0, u1, col, w) {
  if (u1 <= u0) return;
  const N = 60, P = [];
  for (let k = 0; k <= N; k++) { const u = lerp(u0, u1, k / N); const [x, y] = polyAt(pts, u); P.push([x, y]); }
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; line(P, col, w); ctx.restore();
}
/** the main road used on map screens (screen-local 332x700 coords) */
export const MAIN_ROAD = [[-200, 300], [-60, 200], [-40, 40], [60, -80], [70, -220], [200, -330]];
/** a flat map (screen-local or any box). segs = [{u0, u1, col}] traffic colours on MAIN_ROAD (scaled by k) */
export function trafficMap(cx, cy, w, h, { segs = [], k = 1, road = MAIN_ROAD, car = null, pin = null, t = 0 } = {}) {
  ctx.save(); rr(cx - w / 2, cy - h / 2, w, h, 0); ctx.clip();
  ctx.fillStyle = MAP; ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
  ctx.translate(cx, cy); ctx.scale(k, k);
  for (let i = -4; i <= 4; i++) for (let j = -6; j <= 6; j++) {
    const q = (i * 31 + j * 17 + 400) % 6;
    const col = q === 0 ? PARK : q === 3 ? WATER : BLD;
    rr(i * 120 - 46, j * 120 - 46, 92, 92, 12); ctx.fillStyle = col; ctx.fill();
  }
  for (let i = -4; i <= 4; i++) { line([[i * 120 + 60, -900], [i * 120 + 60, 900]], ROAD, 14); line([[-700, i * 120 + 60], [700, i * 120 + 60]], ROAD, 14); }
  const R = road;
  polyLine(R, 0, 1, ROAD_E, 44); polyLine(R, 0, 1, ROAD, 34);
  for (const sg of segs) polyLine(R, sg.u0, sg.u1, sg.col, 24);
  if (pin) { const [px, py] = polyAt(R, pin); circle(px, py, 22, C.white); circle(px, py, 15, TRAFFIC.blue); }
  if (car !== null) { const [px, py] = polyAt(R, car); ctx.globalAlpha = 0.3; circle(px, py, 34 + 10 * Math.sin(t * 5), TRAFFIC.blue); ctx.globalAlpha = 1; circle(px, py, 22, C.white); circle(px, py, 16, TRAFFIC.blue); }
  ctx.restore();
}
/** CCTV camera on a pole. s = 1 → ~300 wide. look = sweep angle */
export function cctv(x, y, s, look = 0, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  rr(-14, 0, 28, 420, 10); ctx.fillStyle = '#8C96A5'; ctx.fill(); rr(-14, 0, 10, 420, [10, 0, 0, 10]); ctx.fillStyle = '#AEB7C4'; ctx.fill();
  ctx.rotate(0.25 + look);
  rr(-40, -30, 80, 40, 10); ctx.fillStyle = '#8C96A5'; ctx.fill();
  rr(-150, -110, 220, 100, 24); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-150, -110, 220, 30, [24, 24, 0, 0]); ctx.fillStyle = '#D5D9DF'; ctx.fill();
  rr(-190, -100, 46, 80, 12); ctx.fillStyle = C.ink; ctx.fill(); circle(-176, -60, 22, '#2F3A52'); circle(-182, -66, 8, '#7FB0EE');
  circle(40, -60, 9, C.red);
  ctx.restore();
}
/** small top-view phone glyph (for cars/crowds). s = 1 → 60 x 104 */
export function miniPhone(x, y, s, glow = 0, scr = TRAFFIC.blue) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (glow > 0) { ctx.globalAlpha = 0.45 * glow; circle(0, 0, 78, C.yellow); ctx.globalAlpha = 1; }
  rr(-30, -52, 60, 104, 14); ctx.fillStyle = C.ink; ctx.fill();
  rr(-23, -42, 46, 84, 8); ctx.fillStyle = scr; ctx.fill();
  rr(-17, -36, 14, 30, 5); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fill();
  ctx.restore();
}
/** speech-bubble speed label above (x, y): "8 km/h". col = traffic colour of the text */
export function speedBubble(x, y, text, col = TRAFFIC.green, sc = 1, size = 44) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  ctx.font = `900 ${size}px Inter`; const w = ctx.measureText(text).width + size * 0.9, h = size * 1.5;
  rr(-w / 2, -h - 22, w, h, h / 2); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-14, -24); ctx.lineTo(0, -2); ctx.lineTo(14, -24); ctx.closePath(); ctx.fillStyle = C.white; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-14, -22); ctx.lineTo(0, -2); ctx.lineTo(14, -22); ctx.stroke();
  ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, -h / 2 - 20);
  ctx.restore();
}
/** data ticket a phone sends: rows of [label, value]; strike = 0..1 crosses out the NAME row (index nameRow) */
export function dataTicket(x, y, s, rows, { strike = 0, nameRow = -1, sc = 1, show = 99 } = {}) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  const h = 90 + rows.length * 96;
  rr(-300, -h / 2 + 12, 600, h, 34); ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fill();
  rr(-300, -h / 2, 600, h, 34); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-300, -h / 2, 600, 70, [34, 34, 0, 0]); ctx.fillStyle = TRAFFIC.blue; ctx.fill(); ctx.stroke();
  ctx.font = '900 38px Inter'; ctx.fillStyle = C.white; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('LOCATION PING', 0, -h / 2 + 37);
  rows.forEach(([k, v], i) => {
    if (i >= show) return;
    const yy = -h / 2 + 120 + i * 96;
    ctx.textAlign = 'left'; ctx.font = '900 40px Inter'; ctx.fillStyle = '#8C96A5'; ctx.fillText(k, -250, yy);
    ctx.textAlign = 'right'; ctx.font = '900 50px Inter'; ctx.fillStyle = C.ink; ctx.fillText(v, 250, yy);
    if (i === nameRow && strike > 0) { line([[60, yy], [lerp(60, 270, clamp(strike)), yy]], C.red, 14); }
  });
  ctx.restore();
}
/** bar chart of traffic by hour; hi = index highlighted, p = grow 0..1. box w 760 x h 420 at s=1, origin = baseline centre */
export function hourChart(x, y, s, vals, labels, { p = 1, hi = -1, hiP = 0 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-420, -500, 840, 600, 36); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  const n = vals.length, bw = 640 / n;
  for (let i = 0; i < n; i++) {
    const v = vals[i] * clamp(p * 1.4 - i * 0.05), bx = -320 + i * bw + 8, bh = 340 * v;
    const col = i === hi && hiP > 0 ? TRAFFIC.red : v > 0.7 ? TRAFFIC.orange : '#9FC7EE';
    rr(bx, -bh, bw - 16, bh, 10); ctx.fillStyle = col; ctx.fill();
    if (i === hi && hiP > 0) { ctx.save(); ctx.globalAlpha = clamp(hiP); rr(bx - 8, -bh - 8, bw, bh + 8, 14); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.restore(); }
  }
  line([[-340, 0], [340, 0]], C.ink, 8);
  ctx.font = '900 30px Inter'; ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  labels.forEach((l, i) => { if (l) ctx.fillText(l, -320 + i * bw + bw / 2, 48); });
  ctx.restore();
}
/** flat city skyline along y (bottom), with a TV-tower (Berlin) silhouette at tx */
export function skyline(y, tx = 700, col = '#C9CFDA', tower = 1) {
  ctx.fillStyle = col;
  for (let i = 0; i < 12; i++) { const w = 90 + rnd(i) * 80, h = 160 + rnd(i + 5) * 300, x = -100 + i * 110; rr(x, y - h, w, h + 400, 8); ctx.fill(); }
  if (tower > 0) {
    ctx.save(); ctx.translate(tx, y); ctx.scale(tower, tower);
    rr(-16, -760, 32, 760, 10); ctx.fillStyle = '#AEB7C4'; ctx.fill();
    rr(-40, -120, 80, 120, 14); ctx.fill();
    circle(0, -560, 70, '#AEB7C4'); ell(0, -560, 70, 16, '#8C96A5');
    rr(-6, -880, 12, 130, 6); ctx.fillStyle = '#8C96A5'; ctx.fill(); circle(0, -880, 9, C.red);
    ctx.restore();
  }
  ctx.fillStyle = '#9AA3B2'; ctx.fillRect(-300, y, 1680, 600);
}
/** red handcart full of phones, side view; flip = -1 points the handle right; handle points left to (x-250, y-160)*s. s = 1 → ~420 wide. n = phones shown, t wobble */
export function wagon(x, y, s, n = 99, t = 0, glow = 0, flip = 1) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * flip, s);
  line([[-180, -40], [-300, -170]], C.ink, 14); rr(-330, -186, 60, 24, 12); ctx.fillStyle = C.ink; ctx.fill();
  // phones piled in the tub
  const N = Math.min(n, 40);
  for (let k = 0; k < N; k++) {
    const col = k % 9, row = Math.floor(k / 9), px = -160 + col * 40 + (row % 2) * 18, py = -120 - row * 34 + Math.sin(t * 9 + k) * 2;
    ctx.save(); ctx.translate(px, py); ctx.rotate((rnd(k) - 0.5) * 0.7);
    rr(-18, -30, 36, 60, 8); ctx.fillStyle = C.ink; ctx.fill(); rr(-13, -24, 26, 46, 5); ctx.fillStyle = glow > 0 && k % 3 === 0 ? C.yellow : TRAFFIC.blue; ctx.fill();
    ctx.restore();
  }
  // tub
  ctx.beginPath(); ctx.moveTo(-200, -110); ctx.lineTo(200, -110); ctx.lineTo(175, 20); ctx.lineTo(-175, 20); ctx.closePath();
  ctx.fillStyle = C.red; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-195, -110, 390, 26, 8); ctx.fillStyle = '#B21F30'; ctx.fill();
  rr(-150, -70, 120, 14, 7); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fill();
  for (const wx of [-110, 110]) { ctx.save(); ctx.translate(wx, 50); ctx.rotate(t * 3); circle(0, 0, 52, C.ink); circle(0, 0, 22, '#AEB7C4'); line([[-36, 0], [36, 0]], '#AEB7C4', 8); ctx.restore(); }
  ctx.restore();
}
/** side-view street: pavement band with kerb at y */
export function sideStreet(y, off = 0) {
  ctx.fillStyle = '#C9CFDA'; ctx.fillRect(-300, y, 1680, 140);
  ctx.fillStyle = '#AEB7C4'; for (let x = -300 + ((off % 160) + 160) % 160 - 160; x < 1400; x += 160) ctx.fillRect(x, y, 8, 140);
  ctx.fillStyle = '#4A4F5C'; ctx.fillRect(-300, y + 140, 1680, 700);
  ctx.fillStyle = C.white; for (let x = -300 + ((off % 240) + 240) % 240 - 240; x < 1400; x += 240) ctx.fillRect(x, y + 330, 120, 14);
}
