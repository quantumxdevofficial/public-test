// Inside Out: Wi-Fi components (router, radio waves, bits, walls, microwave, kitchen).
// Flat fills, one darker shade, one highlight. Radio waves use WAVE blue (2.4 GHz) and WAVE5 pink (5 GHz);
// microwave-oven noise is red (the problem). Cyan only inside the x-ray phone.
import { ctx, C, W, H, TAU, lerp, clamp, rr, circle, ell, line, fillAll } from './lib.js';

export const WAVE = '#3A7BD5', WAVE5 = '#E57A8A';
const GREEN = '#5BAE6A', STEEL = '#C9CDD6', STEEL_D = '#9AA1AE';
const MONO = "'DejaVu Sans Mono', monospace";

/** Wi-Fi symbol: dot + 3 arcs. bars 0..3 lit (yellow), rest grey. s = 1 → ~200 px wide */
export function wifiIcon(x, y, s, bars = 3, col = C.yellow) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    const r = 50 + i * 42, on = bars > i;
    for (const [w, c] of [[30, C.ink], [18, on ? col : '#B9B4AA']]) { ctx.lineWidth = w; ctx.strokeStyle = c; ctx.beginPath(); ctx.arc(0, 0, r, -Math.PI * 0.75, -Math.PI * 0.25); ctx.stroke(); }
  }
  circle(0, 0, 22, C.ink); circle(0, 0, 14, bars > 0 ? col : '#B9B4AA');
  ctx.restore();
}

/** router: 420x150 body at s = 1, two antennas, blinking LEDs. Origin = body centre */
export function router(x, y, s, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const sx of [-1, 1]) { ctx.save(); ctx.translate(sx * 150, -60); ctx.rotate(sx * 0.12); rr(-14, -200, 28, 210, 14); ctx.fillStyle = C.ink; ctx.fill(); circle(0, -200, 20, C.ink); ctx.restore(); }
  rr(-210, -75, 420, 150, 34); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-210, 25, 420, 50, [0, 0, 34, 34]); ctx.fillStyle = '#E2DED6'; ctx.fill(); rr(-210, -75, 420, 150, 34); ctx.stroke();
  for (let i = 0; i < 5; i++) circle(-120 + i * 60, -18, 13, Math.sin(t * 10 + i * 1.7) > -0.3 ? GREEN : '#2F5E39');
  rr(-60, -170, 120, 20, 10); ctx.fillStyle = 'rgba(0,0,0,0)'; ctx.fill();
  ctx.restore();
}

/** expanding wave arcs from (x, y) facing ang (rad), spread = half-angle. n rings over maxR px. a = alpha */
export function waves(x, y, t, { ang = 0, spread = 0.6, n = 4, maxR = 600, speed = 1, col = WAVE, w = 16, a = 1, dash = null, stopAt = Infinity } = {}) {
  if (a <= 0) return;
  ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = col; ctx.lineWidth = w; if (dash) ctx.setLineDash(dash);
  for (let i = 0; i < n; i++) {
    const p = ((t * speed + i / n) % 1), r = 40 + p * maxR;
    if (r > stopAt) continue;
    ctx.globalAlpha = a * (1 - p) ** 0.7;
    ctx.beginPath(); ctx.arc(x, y, r, ang - spread, ang + spread); ctx.stroke();
  }
  ctx.restore();
}

/** a sine wave from x0 to x1 at y. freq = cycles across, phase in rad */
export function sine(x0, x1, y, amp, freq, phase, col = WAVE, w = 14, a = 1) {
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  for (let i = 0; i <= 300; i++) { const u = i / 300, X = lerp(x0, x1, u), Y = y + Math.sin(u * freq * TAU + phase) * amp; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
  ctx.stroke(); ctx.restore();
}

/** binary digit tile ('1' / '0'). sc pops it */
export function bit(x, y, d, sc = 1, size = 90) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  rr(-size * 0.42, -size * 0.55, size * 0.84, size * 1.1, size * 0.2); ctx.fillStyle = d === '1' ? C.yellow : C.white; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.fillStyle = C.ink; ctx.font = `700 ${size * 0.8}px ${MONO}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(d, 0, size * 0.04);
  ctx.restore();
}

/** flat globe ("the internet"). s = 1 → radius 110 */
export function globe(x, y, s, t = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  circle(0, 0, 118, C.ink); circle(0, 0, 110, WAVE);
  ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 110, 0, TAU); ctx.clip();
  const o = (t * 30) % 220;
  for (const dx of [-o, 220 - o]) { ell(dx - 30, -30, 50, 36, GREEN); ell(dx + 40, 40, 36, 44, GREEN); ell(dx - 90, 50, 26, 20, GREEN); }
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.ellipse(0, 0, 50, 110, 0, 0, TAU); ctx.stroke(); line([[-110, 0], [110, 0]], 'rgba(255,255,255,0.45)', 5);
  ctx.restore();
}

/** brick wall slab, w x h, centred. a = alpha */
export function wall(x, y, w, h, a = 1) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y);
  rr(-w / 2, -h / 2, w, h, 12); ctx.fillStyle = C.pot; ctx.fill();
  ctx.save(); rr(-w / 2, -h / 2, w, h, 12); ctx.clip();
  ctx.strokeStyle = '#A85D3A'; ctx.lineWidth = 6;
  for (let r = 0, yy = -h / 2; yy < h / 2; yy += 52, r++) {
    line([[-w / 2, yy], [w / 2, yy]], '#A85D3A', 6);
    for (let xx = -w / 2 + (r % 2 ? 0 : 35); xx < w / 2; xx += 70) line([[xx, yy], [xx, yy + 52]], '#A85D3A', 6);
  }
  ctx.restore();
  rr(-w / 2, -h / 2, w, h, 12); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.restore();
}

/** wall socket with a cable going to (tx, ty) */
export function cable(x0, y0, tx, ty, p = 1) {
  ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = C.ink; ctx.lineWidth = 16;
  ctx.beginPath(); ctx.moveTo(x0, y0);
  const mx = (x0 + tx) / 2, my = Math.max(y0, ty) + 120;
  ctx.quadraticCurveTo(mx, my, tx, ty); ctx.stroke(); ctx.restore();
  rr(x0 - 50, y0 - 70, 100, 140, 18); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(x0 - 20, y0 - 30, 40, 50, 8); ctx.fillStyle = C.ink; ctx.fill();
}
export function cableAt(x0, y0, tx, ty, u) {
  const mx = (x0 + tx) / 2, my = Math.max(y0, ty) + 120, a = (1 - u) ** 2, b = 2 * (1 - u) * u, c = u * u;
  return [a * x0 + b * mx + c * tx, a * y0 + b * my + c * ty];
}

/** microwave oven 520x340 at s = 1. on 0..1 lights the inside; t spins the plate */
export function microwave(x, y, s, t = 0, on = 0, food = true) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-260, -170, 520, 340, 30); ctx.fillStyle = STEEL; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-260, 120, 520, 50, [0, 0, 30, 30]); ctx.fillStyle = STEEL_D; ctx.fill(); rr(-260, -170, 520, 340, 30); ctx.stroke();
  // window
  rr(-225, -135, 330, 250, 18); ctx.fillStyle = on > 0 ? '#FFE27A' : '#3B3F48'; ctx.fill(); ctx.lineWidth = 8; ctx.stroke();
  if (on > 0) { ctx.save(); ctx.globalAlpha = 0.35 + 0.15 * Math.sin(t * 8); rr(-225, -135, 330, 250, 18); ctx.fillStyle = C.yellow; ctx.fill(); ctx.restore(); }
  ell(-60, 80, 120, 22, on > 0 ? '#F2C94C' : '#2C3038');
  if (food) {
    const sx = Math.cos(t * 2.2);
    ctx.save(); ctx.translate(-60, 50); ctx.scale(0.7 + 0.3 * Math.abs(sx), 1);
    ctx.beginPath(); ctx.moveTo(-80, -20); ctx.lineTo(80, -20); ctx.quadraticCurveTo(70, 40, 0, 40); ctx.quadraticCurveTo(-70, 40, -80, -20); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
    ell(0, -22, 72, 16, C.pot); ell(-20, -28, 20, 8, '#E0956B'); ell(25, -25, 16, 7, C.leaf);
    ctx.restore();
  }
  // control panel
  rr(130, -135, 100, 250, 14); ctx.fillStyle = STEEL_D; ctx.fill();
  rr(145, -120, 70, 40, 8); ctx.fillStyle = C.ink; ctx.fill();
  ctx.fillStyle = on > 0 ? C.yellow : '#55555E'; ctx.font = `700 26px ${MONO}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(on > 0 ? '1:30' : '0:00', 180, -99);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) circle(162 + c * 36, -40 + r * 40, 12, C.ink);
  circle(180, 85, 24, C.ink); circle(180, 85, 14, STEEL);
  ctx.restore();
}

/** jagged red noise burst (interference) around (x, y) */
export function noise(x, y, t, r = 200, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = C.red; ctx.lineWidth = 12; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  for (let k = 0; k < 3; k++) {
    const p = (t * 1.4 + k / 3) % 1, R = r * (0.4 + p);
    ctx.globalAlpha = a * (1 - p);
    ctx.beginPath();
    for (let i = 0; i <= 36; i++) { const an = i / 36 * TAU, rr2 = R + (i % 2 ? 18 : -18); const X = x + Math.cos(an) * rr2, Y = y + Math.sin(an) * rr2 * 0.8; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
    ctx.stroke();
  }
  ctx.restore();
}

/** loading spinner (buffering) */
export function spinner(x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (let i = 0; i < 10; i++) { const an = i / 10 * TAU + Math.floor(t * 12) / 10 * TAU; ctx.globalAlpha = 0.15 + 0.85 * (i / 10); circle(Math.cos(an) * 70, Math.sin(an) * 70, 15, C.ink); }
  ctx.restore();
}

/** kitchen background: wall tiles, upper cabinets, counter top at y = top */
export function kitchen(top = 1180) {
  fillAll(C.bg);
  ctx.save(); ctx.globalAlpha = 0.5; ctx.strokeStyle = '#E4DCCB'; ctx.lineWidth = 4;
  for (let yy = 560; yy < top; yy += 80) line([[-300, yy], [W + 300, yy]], '#E4DCCB', 4);
  for (let xx = 0; xx < W; xx += 80) line([[xx, 560], [xx, top]], '#E4DCCB', 4);
  ctx.restore();
  for (const cx of [-40, 380, 800]) { rr(cx, 120, 380, 360, 18); ctx.fillStyle = C.pot; ctx.fill(); rr(cx + 20, 140, 340, 320, 12); ctx.fillStyle = '#D9895F'; ctx.fill(); rr(cx + 300, 280, 16, 70, 8); ctx.fillStyle = C.ink; ctx.fill(); }
  ctx.fillStyle = '#7A8494'; ctx.fillRect(-300, top, W + 600, 40);
  ctx.fillStyle = C.floor; ctx.fillRect(-300, top + 40, W + 600, 900);
}
