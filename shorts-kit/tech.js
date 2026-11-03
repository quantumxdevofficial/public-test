// Inside Out: TECH components (phones, servers, requests). Same look as the rest of the kit:
// flat fills, one darker shade, one light highlight, ink outlines only on graphics/cards.
// Cyan is used ONLY for the x-ray "inside the device" view (phoneXray).
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

const MONO = "'DejaVu Sans Mono', monospace";
const SUN_SHADE = '#F5B82E', GREEN = '#5BAE6A', TILE = ['#3A7BD5', '#E57A8A', '#5BAE6A', '#C8734A', '#FFD43B', '#1F2A44'];

/** quadratic arc from (x1,y1) to (x2,y2) bulging up by h: point at u 0..1 */
export function arcAt(x1, y1, x2, y2, h, u) {
  const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2 - h, a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, c = u * u;
  return [a * x1 + b * cx + c * x2, a * y1 + b * cy + c * y2];
}
/** dotted route along that arc, drawn from u0 to u1 */
export function route(x1, y1, x2, y2, h, u0 = 0, u1 = 1, a = 0.35) {
  if (u1 <= u0) return;
  ctx.save(); ctx.globalAlpha = a;
  for (let u = 0; u <= 1.0001; u += 0.035) if (u >= u0 && u <= u1) { const [px, py] = arcAt(x1, y1, x2, y2, h, u); circle(px, py, 8, C.ink); }
  ctx.restore();
}

/** phone. Body 380x760 at s = 1, centred. screen(lt) draws in screen-local coords (332x700 box centred on 0,0), clipped. */
export function phone(x, y, s, screen, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-190, -380, 380, 760, 64); ctx.fillStyle = C.ink; ctx.fill();
  rr(150, -380, 40, 760, [0, 64, 64, 0]); ctx.fillStyle = '#2A2A30'; ctx.fill();
  rr(-198, -200, 10, 90, 4); ctx.fillStyle = C.ink; ctx.fill();
  ctx.save(); rr(-166, -350, 332, 700, 42); ctx.clip();
  ctx.fillStyle = C.white; ctx.fillRect(-166, -350, 332, 700);
  if (screen) screen();
  ctx.restore();
  rr(-50, -340, 100, 26, 13); ctx.fillStyle = C.ink; ctx.fill();
  ctx.restore();
}
/** small rounded app tile */
export function appTile(x, y, s, color) {
  rr(x - 40 * s, y - 40 * s, 80 * s, 80 * s, 20 * s); ctx.fillStyle = color; ctx.fill();
  rr(x - 40 * s, y - 40 * s, 80 * s, 26 * s, [20 * s, 20 * s, 0, 0]); ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fill();
}
/** the weather app icon (sky tile + sun + cloud) */
export function weatherTile(x, y, s) {
  rr(x - 40 * s, y - 40 * s, 80 * s, 80 * s, 20 * s); ctx.fillStyle = C.sky; ctx.fill();
  circle(x - 8 * s, y - 8 * s, 20 * s, C.yellow);
  ell(x + 10 * s, y + 14 * s, 24 * s, 14 * s, C.white); ell(x - 6 * s, y + 18 * s, 18 * s, 11 * s, C.white);
}
/** home screen: grid of app tiles; the weather tile sits at WEATHER_TILE */
export const WEATHER_TILE = [0, -40];
export function homeScreen() {
  ctx.fillStyle = '#DCEEF6'; ctx.fillRect(-166, -350, 332, 700);
  ctx.fillStyle = C.ink; ctx.font = '900 30px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('9:41', 0, -290);
  let k = 0;
  for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) {
    const tx = -100 + c * 100, ty = -200 + r * 120;
    if (tx === WEATHER_TILE[0] && ty === WEATHER_TILE[1]) weatherTile(tx, ty, 1);
    else appTile(tx, ty, 1, TILE[k++ % TILE.length]);
  }
}
/** weather app screen. temp = text ('– –°' or '31°'); sunP 0..1 grows the sun; t = time (rays spin) */
export function weatherScreen(temp, sunP = 0, t = 0) {
  ctx.fillStyle = C.sky; ctx.fillRect(-166, -350, 332, 700);
  ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = '900 34px Inter'; ctx.fillText('WEATHER', 0, -280);
  if (sunP > 0) sun(0, -110, 0.75 * sunP, t);
  else { ctx.save(); ctx.globalAlpha = 0.35; ctx.setLineDash([16, 14]); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.arc(0, -110, 80, 0, TAU); ctx.stroke(); ctx.restore(); }
  ctx.fillStyle = C.ink; ctx.font = '900 120px Inter'; ctx.fillText(temp, 0, 70);
  for (let i = 0; i < 3; i++) { rr(-130, 170 + i * 52, 260, 32, 16); ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fill(); }
}

/** x-ray view inside a phone (cyan on the x-ray film). q = 0..1 empty "forecast" box glows; centred, 380x760 at s=1 */
export function phoneXray(x, y, s, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = C.cyan; ctx.lineWidth = 9; ctx.lineJoin = 'round';
  rr(-190, -380, 380, 760, 64); ctx.fillStyle = C.xnavy; ctx.fill(); ctx.stroke();
  ctx.lineWidth = 6;
  // battery
  rr(-140, 60, 280, 250, 24); ctx.stroke(); for (let i = 0; i < 4; i++) line([[-110 + i * 70, 100], [-110 + i * 70, 270]], C.cyan, 5);
  // chips with pins
  for (const [cx, cy, w] of [[-70, -230, 100], [70, -230, 90], [0, -110, 120]]) {
    rr(cx - w / 2, cy - w / 2, w, w, 10); ctx.fillStyle = C.cyan; ctx.globalAlpha = 0.25; ctx.fill(); ctx.globalAlpha = 1; ctx.stroke();
    for (let k = -2; k <= 2; k++) { line([[cx + k * w / 6, cy - w / 2], [cx + k * w / 6, cy - w / 2 - 14]], C.cyan, 4); line([[cx + k * w / 6, cy + w / 2], [cx + k * w / 6, cy + w / 2 + 14]], C.cyan, 4); }
  }
  // traces
  line([[-70, -180], [-70, -140], [-40, -110]], C.cyan, 4); line([[70, -185], [70, -140], [40, -110]], C.cyan, 4); line([[0, -50], [0, 60]], C.cyan, 4);
  circle(110, -320, 18, C.cyan); circle(110, -320, 10, C.xnavy);
  ctx.restore();
}

/** server rack, 340x520 at s = 1, centred. t blinks the lights */
export function server(x, y, s, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-150, 240, 60, 40, 8); ctx.fillStyle = C.ink; ctx.fill(); rr(90, 240, 60, 40, 8); ctx.fill();
  rr(-170, -260, 340, 520, 30); ctx.fillStyle = C.navy; ctx.fill();
  rr(110, -260, 60, 520, [0, 30, 30, 0]); ctx.fillStyle = '#16263C'; ctx.fill();
  for (let i = 0; i < 4; i++) {
    const uy = -225 + i * 118;
    rr(-140, uy, 280, 92, 14); ctx.fillStyle = C.pants; ctx.fill();
    for (let v = 0; v < 5; v++) { rr(-110 + v * 30, uy + 26, 14, 40, 7); ctx.fillStyle = C.pantsShade; ctx.fill(); }
    const on = Math.sin(t * 9 + i * 2.1) > -0.2;
    circle(70, uy + 46, 14, on ? C.yellow : '#6B5A1E'); circle(108, uy + 46, 14, GREEN);
  }
  ctx.restore();
}

/** envelope (a request / response). 220x140 at s = 1. open 0..1 lifts the flap; label = small pill under it */
export function envelope(x, y, s, rot = 0, label = null, open = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.lineJoin = 'round';
  if (open > 0) { ctx.beginPath(); ctx.moveTo(-110, -70); ctx.lineTo(0, -70 - 90 * open); ctx.lineTo(110, -70); ctx.closePath(); ctx.fillStyle = '#E9E4DA'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke(); }
  rr(-110, -70, 220, 140, 14); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
  if (open <= 0) { ctx.beginPath(); ctx.moveTo(-104, -64); ctx.lineTo(0, 10); ctx.lineTo(104, -64); ctx.stroke(); }
  ctx.restore();
  if (label) {
    ctx.save(); ctx.translate(x, y + 115 * s); ctx.scale(s, s);
    ctx.font = `700 36px ${MONO}`; const w = ctx.measureText(label).width + 40;
    rr(-w / 2, -30, w, 60, 30); ctx.fillStyle = C.ink; ctx.fill();
    ctx.fillStyle = C.white; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, 2);
    ctx.restore();
  }
}

/** restaurant-style menu card of endpoints. 600x760 at s = 1. hi = row index, hiP 0..1 highlight, tickP 0..1 */
export function menuCard(x, y, s, items, hi = -1, hiP = 0, tickP = 0, sx = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sx, s);
  rr(-300, -380, 600, 760, 40); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-300, -380, 600, 170, [40, 40, 0, 0]); ctx.fillStyle = C.ink; ctx.fill();
  ctx.fillStyle = C.white; ctx.font = '900 84px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.letterSpacing = '8px';
  ctx.fillText('MENU', 18, -292); ctx.letterSpacing = '0px';
  // fork + knife
  line([[-215, -330], [-215, -250]], C.yellow, 10); for (const d of [-14, 0, 14]) line([[-215 + d, -335], [-215 + d, -305]], C.yellow, 6);
  line([[215, -335], [215, -250]], C.yellow, 10); ell(221, -310, 10, 26, C.yellow);
  items.forEach((it, i) => {
    const ry = -110 + i * 150;
    if (i === hi && hiP > 0) { rr(-260, ry - 52, 520 * hiP, 104, 20); ctx.fillStyle = C.yellow; ctx.fill(); }
    ctx.fillStyle = C.ink; ctx.font = `700 58px ${MONO}`; ctx.textAlign = 'left'; ctx.fillText(it, -230, ry + 2);
    if (i < items.length - 1) { ctx.save(); ctx.globalAlpha = 0.15; line([[-240, ry + 75], [240, ry + 75]], C.ink, 4); ctx.restore(); }
    if (i === hi && tickP > 0) {
      ctx.save(); ctx.translate(205, ry); ctx.scale(tickP, tickP); circle(0, 0, 40, GREEN);
      line([[-18, 0], [-4, 15], [20, -14]], C.white, 11); ctx.restore();
    }
  });
  ctx.restore();
}

/** code card that types JSON. rows = [[ [text, color], ... ], ...]; chars = how many characters are shown */
export function jsonCard(x, y, s, rows, chars = 1e9, sc = 1) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  rr(-340, -230, 680, 460, 36); ctx.fillStyle = C.navy; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  [C.red, C.yellow, GREEN].forEach((c, i) => circle(-290 + i * 40, -185, 12, c));
  ctx.font = `700 54px ${MONO}`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  let n = chars;
  rows.forEach((row, ri) => {
    let px = -290; const py = -100 + ri * 80;
    for (const [txt, col] of row) {
      if (n <= 0) break;
      const shown = txt.slice(0, Math.max(0, Math.floor(n))); n -= txt.length;
      ctx.fillStyle = col; ctx.fillText(shown, px, py); px += ctx.measureText(txt).width;
    }
  });
  ctx.restore();
}

/** flat sun: yellow disc, darker ring, spinning rays. 1 = 120 px radius disc */
export function sun(x, y, s, t = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(t * 0.6);
  for (let i = 0; i < 10; i++) { ctx.save(); ctx.rotate(i * TAU / 10); rr(-14, -200, 28, 56, 14); ctx.fillStyle = C.yellow; ctx.fill(); ctx.restore(); }
  ctx.restore();
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  circle(0, 0, 120, SUN_SHADE); circle(-6, -6, 110, C.yellow); ell(-40, -45, 30, 18, '#FFE88A', -0.6);
  ctx.restore();
}

/** red 404 card. 600x420 at s = 1 */
export function errorCard(x, y, s, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-300, -210, 600, 420, 40); ctx.fillStyle = C.red; ctx.fill(); ctx.lineWidth = 12; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.fillStyle = C.white; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = '900 210px Inter'; ctx.fillText('404', 0, -35);
  ctx.font = '900 62px Inter'; ctx.letterSpacing = '6px'; ctx.fillText('NOT FOUND', 0, 120); ctx.letterSpacing = '0px';
  ctx.restore();
}

/** the API "gate": two pillars and a beam with A P I tiles. lit = [a, p, i] each 0..1. 420 wide, 640 tall at s = 1 */
export function apiGate(x, y, s, lit = [0, 0, 0], sc = 1) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  rr(-200, -200, 70, 520, 18); ctx.fillStyle = C.ink; ctx.fill(); rr(130, -200, 70, 520, 18); ctx.fill();
  rr(-240, -330, 480, 150, 30); ctx.fill();
  ['A', 'P', 'I'].forEach((L, i) => {
    const tx = -140 + i * 140, on = clamp(lit[i] || 0);
    rr(tx - 56, -310, 112, 112, 22); ctx.fillStyle = on > 0.5 ? C.yellow : '#3A3A42'; ctx.fill();
    ctx.save(); ctx.translate(tx, -254); const p = 1 + 0.25 * Math.sin(Math.PI * clamp(on * 2 - 1)); ctx.scale(p, p);
    ctx.fillStyle = on > 0.5 ? C.ink : C.white; ctx.font = '900 84px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(L, 0, 4); ctx.restore();
  });
  ctx.restore();
}

/** a fingertip coming in from the bottom right to tap at (x, y). p 0..1 = how far in */
export function tapFinger(x, y, p, press = 0) {
  if (p <= 0) return;
  const ox = lerp(420, 0, p), oy = lerp(520, 0, p) + press * 14;
  ctx.save(); ctx.translate(x + ox, y + oy); ctx.rotate(-0.55);
  rr(-48, 0, 96, 520, 48); ctx.fillStyle = C.skin; ctx.fill();
  rr(14, 0, 34, 520, [0, 48, 0, 0]); ctx.fillStyle = C.skinShade; ctx.fill();
  rr(-30, 14, 60, 66, 26); ctx.fillStyle = '#F3D2BF'; ctx.fill();
  ctx.restore();
}
/** soft circular tap ripple */
export function ripple(x, y, p) {
  if (p <= 0 || p >= 1) return;
  ctx.save(); ctx.globalAlpha = 1 - p; ctx.strokeStyle = C.yellow; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(x, y, 30 + p * 90, 0, TAU); ctx.stroke(); ctx.restore();
}
