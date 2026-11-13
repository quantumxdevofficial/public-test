// CDN (System Design day 7) components. Same flat look: flat fills, one darker shade, ink outlines on graphics.
import { ctx, C, TAU, clamp, lerp, rr, circle, ell, line } from './lib.js';

const LAND = '#A9D69B', LAND_D = '#7FB86F', OCEAN = '#BFE3F2', OCEAN_D = '#A7D5E8';
const CONT = [
  [[-165, 65], [-140, 70], [-95, 72], [-75, 62], [-60, 50], [-80, 32], [-82, 25], [-97, 18], [-105, 22], [-118, 33], [-125, 48], [-150, 58]],
  [[-80, 10], [-60, 8], [-35, -7], [-40, -22], [-55, -35], [-70, -52], [-75, -40], [-72, -18], [-81, -5]],
  [[-10, 36], [-10, 44], [-5, 50], [5, 58], [20, 70], [60, 72], [100, 76], [140, 72], [170, 66], [160, 58], [140, 50], [130, 40], [122, 30], [120, 22], [108, 12], [100, 2], [95, 18], [80, 8], [72, 20], [58, 25], [50, 30], [35, 36], [28, 40], [15, 38]],
  [[-17, 20], [-10, 33], [10, 37], [32, 31], [43, 12], [51, 11], [40, -15], [32, -28], [20, -35], [12, -18], [9, 4], [-8, 5], [-17, 14]],
  [[114, -22], [130, -12], [145, -15], [153, -28], [147, -38], [135, -34], [115, -34]],
];
/** city lon/lat for mapXY */
export const CITY = { ny: [-74, 41], tokyo: [140, 36], london: [0, 51], mumbai: [73, 19], sydney: [151, -34], sao: [-46, -23], la: [-118, 34], lagos: [3, 6] };
/** map a city (or [lon, lat]) to canvas px for a flatMap drawn at (x, y, w, h) */
export function mapXY(x, y, w, h, c) { const [lo, la] = typeof c === 'string' ? CITY[c] : c; return [x + (lo / 180) * (w / 2) * 0.94, y - (la / 90) * (h / 2) * 0.94]; }

/** flat world map card (ocean + blob continents), centred at (x, y), w x h px. sc pops it in */
export function flatMap(x, y, w = 980, h = 560, sc = 1) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  rr(-w / 2 - 8, -h / 2 - 8, w + 16, h + 16, 44); ctx.fillStyle = C.ink; ctx.fill();
  rr(-w / 2, -h / 2, w, h, 38); ctx.fillStyle = OCEAN; ctx.fill();
  ctx.save(); rr(-w / 2, -h / 2, w, h, 38); ctx.clip();
  ctx.strokeStyle = OCEAN_D; ctx.lineWidth = 4; for (let k = -2; k <= 2; k++) { ctx.beginPath(); ctx.moveTo(-w / 2, k * h / 5); ctx.lineTo(w / 2, k * h / 5); ctx.stroke(); }
  ctx.lineJoin = 'round';
  for (const poly of CONT) for (const [col, dy] of [[LAND_D, 8], [LAND, 0]]) {
    ctx.beginPath(); poly.forEach((p, i) => { const [px, py] = mapXY(0, dy, w, h, p); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }); ctx.closePath();
    ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 18; ctx.strokeStyle = col; ctx.stroke();
  }
  const [jx, jy] = mapXY(0, 0, w, h, [141, 37]); ell(jx + 14, jy, 10, 26, LAND, 0.5);
  ctx.restore(); ctx.restore();
}

/** small pizza-branch storefront, origin = bottom centre (~260 x 300 px at s = 1). lit 0..1 lights the window */
export function branchShop(x, y, s, lit = 1, col = C.red) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-130, -230, 260, 230, [10, 10, 0, 0]); ctx.fillStyle = '#F7E3C8'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  // striped awning
  for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-150 + i * 60, -240); ctx.lineTo(-90 + i * 60, -240); ctx.lineTo(-90 + i * 60, -180); ctx.quadraticCurveTo(-120 + i * 60, -160, -150 + i * 60, -180); ctx.closePath(); ctx.fillStyle = i % 2 ? C.white : col; ctx.fill(); }
  rr(-156, -258, 312, 26, 8); ctx.fillStyle = C.ink; ctx.fill();
  // round pizza sign on the roof
  circle(0, -300, 50, C.ink); circle(0, -300, 42, '#E0A15A'); circle(0, -300, 32, C.yellow);
  for (const [a, b] of [[-12, -310], [12, -296], [-4, -288], [10, -316]]) circle(a, b, 6, C.red);
  // window + door
  rr(-104, -150, 120, 90, 8); ctx.fillStyle = lit > 0 ? C.yellow : '#9AA3AE'; ctx.globalAlpha = 1; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  line([[-44, -150], [-44, -60]], C.ink, 5);
  rr(40, -150, 66, 150, [8, 8, 0, 0]); ctx.fillStyle = col; ctx.fill(); ctx.stroke(); circle(92, -76, 6, C.ink);
  ctx.restore();
}

/** flat snowflake (cold). s = 1 → ~120 px */
export function snowflake(x, y, s, rot = 0, a = 1) {
  if (s <= 0 || a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.globalAlpha *= a;
  for (const [w, c] of [[22, C.ink], [12, C.white]]) for (let k = 0; k < 3; k++) {
    const an = k * Math.PI / 3; ctx.save(); ctx.rotate(an);
    line([[0, -60], [0, 60]], c, w); for (const sy of [-1, 1]) { line([[0, sy * 34], [-18, sy * 52]], c, w * 0.8); line([[0, sy * 34], [18, sy * 52]], c, w * 0.8); }
    ctx.restore();
  }
  ctx.restore();
}

/** a small "edge server" tower: navy box with lights; origin = centre (~120 x 170 at s = 1). copy 0..1 shows a file chip on top */
export function edgeServer(x, y, s, t = 0, glow = 0, col = '#3A7BD5') {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (glow > 0) { ctx.globalAlpha = glow; circle(0, 0, 130, C.yellow); ctx.globalAlpha = 1; }
  rr(-64, -88, 128, 176, 18); ctx.fillStyle = C.ink; ctx.fill();
  rr(-56, -80, 112, 160, 14); ctx.fillStyle = C.navy; ctx.fill();
  for (let i = 0; i < 3; i++) { const uy = -66 + i * 48; rr(-44, uy, 88, 36, 8); ctx.fillStyle = C.pants; ctx.fill();
    circle(26, uy + 18, 7, Math.sin(t * 8 + i * 2 + x) > -0.3 ? C.yellow : '#6B5A1E'); circle(-24, uy + 18, 7, col); }
  ctx.restore();
}

/** media card: 'video' (play triangle) or 'image' (mountain + sun). ~200 x 150 at s = 1 */
export function mediaCard(x, y, s, kind = 'video', rot = 0, a = 1) {
  if (s <= 0 || a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.globalAlpha *= a;
  rr(-100, -75, 200, 150, 18); ctx.fillStyle = C.ink; ctx.fill();
  rr(-90, -65, 180, 130, 12); ctx.fillStyle = kind === 'video' ? C.red : C.sky; ctx.fill();
  if (kind === 'video') { ctx.beginPath(); ctx.moveTo(-24, -34); ctx.lineTo(36, 0); ctx.lineTo(-24, 34); ctx.closePath(); ctx.fillStyle = C.white; ctx.fill(); }
  else { ctx.save(); rr(-90, -65, 180, 130, 12); ctx.clip(); circle(46, -26, 20, C.yellow);
    ctx.beginPath(); ctx.moveTo(-100, 70); ctx.lineTo(-30, -10); ctx.lineTo(20, 40); ctx.lineTo(50, 14); ctx.lineTo(100, 70); ctx.closePath(); ctx.fillStyle = '#5BAE6A'; ctx.fill(); ctx.restore(); }
  ctx.restore();
}

/** big dashed arc between two points that draws itself (p 0..1) */
export function dashArc(x1, y1, x2, y2, h, p = 1, col = C.ink, w = 10, a = 0.6) {
  if (p <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.setLineDash([24, 18]); ctx.lineWidth = w; ctx.strokeStyle = col; ctx.lineCap = 'round';
  ctx.beginPath(); const n = 40;
  for (let i = 0; i <= n * clamp(p); i++) { const u = i / n, cx = (x1 + x2) / 2, cy = (y1 + y2) / 2 - h, x = (1 - u) * (1 - u) * x1 + 2 * (1 - u) * u * cx + u * u * x2, y = (1 - u) * (1 - u) * y1 + 2 * (1 - u) * u * cy + u * u * y2; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
  ctx.stroke(); ctx.restore();
}
