// Streaming video components: movie frame (sharp or pixelated), film chunks, player bar, quality badge, ISP building.
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

export const MOVIE_SKY = '#7EC8E3', MOVIE_HILL = '#5BAE6A', MOVIE_HILL2 = '#3F8F52', STREAM_RED = '#D62839';

// draws the little movie scene into context g, in a 320x180 box centred on 0,0. t moves the car.
function scene(g, t, seed = 0) {
  g.fillStyle = MOVIE_SKY; g.fillRect(-160, -90, 320, 180);
  const sx = -90 + seed * 30;
  g.beginPath(); g.arc(sx + 170, -48, 26, 0, TAU); g.fillStyle = C.yellow; g.fill();
  g.fillStyle = C.white; g.beginPath(); g.ellipse(sx, -50, 34, 14, 0, 0, TAU); g.ellipse(sx + 26, -58, 22, 14, 0, 0, TAU); g.fill();
  g.fillStyle = MOVIE_HILL2; g.beginPath(); g.ellipse(-90, 70, 150, 80, 0, 0, TAU); g.fill();
  g.fillStyle = MOVIE_HILL; g.beginPath(); g.ellipse(90, 85, 170, 85, 0, 0, TAU); g.fill();
  g.fillStyle = '#4A4A55'; g.fillRect(-160, 52, 320, 38);
  g.fillStyle = C.white; for (let k = -4; k < 5; k++) g.fillRect(k * 40 - ((t * 120) % 40), 69, 22, 4);
  const cx = ((t * 70 + seed * 90) % 420) - 210;
  g.fillStyle = C.red; g.beginPath(); g.roundRect(cx - 34, 30, 68, 26, 8); g.fill(); g.beginPath(); g.roundRect(cx - 18, 16, 38, 20, 8); g.fill();
  g.fillStyle = '#BFE3F2'; g.fillRect(cx - 10, 20, 12, 12); g.fillRect(cx + 6, 20, 10, 12);
  g.fillStyle = C.ink; g.beginPath(); g.arc(cx - 18, 58, 9, 0, TAU); g.arc(cx + 20, 58, 9, 0, TAU); g.fill();
}

let OFF = null;
/** the movie picture, w x h px centred at (x, y). pix = block size in scene px (1 = sharp, 12+ = very blocky). */
export function movieFrame(x, y, w, h, t = 0, pix = 1, seed = 0) {
  ctx.save(); ctx.translate(x, y);
  if (pix <= 1.2) {
    ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w, h); ctx.clip();
    ctx.scale(w / 320, h / 180); scene(ctx, t, seed);
  } else {
    const lw = Math.max(4, Math.round(320 / pix)), lh = Math.max(3, Math.round(180 / pix));
    if (!OFF) OFF = document.createElement('canvas');
    OFF.width = lw; OFF.height = lh;
    const g = OFF.getContext('2d'); g.setTransform(lw / 320, 0, 0, lh / 180, lw / 2, lh / 2); scene(g, t, seed);
    ctx.imageSmoothingEnabled = false; ctx.drawImage(OFF, -w / 2, -h / 2, w, h); ctx.imageSmoothingEnabled = true;
  }
  ctx.restore();
}

/** one film chunk: a strip of film with sprocket holes around a movie frame. s = 1 → 240 x 200. label = small pill on top */
export function filmChunk(x, y, s, t = 0, o = {}) {
  if (s <= 0) return;
  const { pix = 1, seed = 0, rot = 0, a = 1, col = C.ink, hi = 0 } = o;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.globalAlpha *= a;
  if (hi > 0) { ctx.save(); ctx.globalAlpha *= hi; rr(-136, -116, 272, 232, 30); ctx.fillStyle = C.yellow; ctx.fill(); ctx.restore(); }
  rr(-120, -100, 240, 200, 18); ctx.fillStyle = col; ctx.fill();
  for (let k = 0; k < 5; k++) { rr(-100 + k * 44, -88, 24, 16, 5); ctx.fillStyle = C.bg; ctx.fill(); rr(-100 + k * 44, 72, 24, 16, 5); ctx.fill(); }
  movieFrame(0, 0, 216, 122, t, pix, seed);
  ctx.restore();
}

/** a long film strip of n chunks laid out from x0 (left edge) at y. gap = extra space between chunks (0 = joined) */
export function filmStrip(x0, y, s, n, t = 0, gap = 0, o = {}) {
  for (let k = 0; k < n; k++) filmChunk(x0 + (120 + k * (240 + gap)) * s, y, s, t, { seed: k * 0.7, ...o, rot: (o.wob || 0) * Math.sin(k * 2.1) });
}

/** video player bar. w wide, origin = left end, centre y. played 0..1 (red), buffered 0..1 (light), knob at played */
export function playerBar(x, y, w, played, buffered, o = {}) {
  const { h = 22, bufCol = '#C9C2B5', hi = 0 } = o;
  rr(x, y - h / 2, w, h, h / 2); ctx.fillStyle = '#5A5A66'; ctx.fill();
  if (buffered > played) { rr(x, y - h / 2, w * buffered, h, h / 2); ctx.fillStyle = hi > 0 ? C.yellow : bufCol; ctx.fill(); }
  rr(x, y - h / 2, Math.max(h, w * played), h, h / 2); ctx.fillStyle = STREAM_RED; ctx.fill();
  circle(x + w * played, y, h * 1.15, C.white); circle(x + w * played, y, h * 0.75, STREAM_RED);
}

/** dark player panel: movie on top, bar at the bottom. s = 1 → 760 x 540, origin = centre */
export function player(x, y, s, t, o = {}) {
  const { pix = 1, played = 0.3, buffered = 0.42, hi = 0, spin = 0, seed = 0 } = o;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-380, -270, 760, 540, 36); ctx.fillStyle = C.ink; ctx.fill();
  ctx.save(); rr(-350, -240, 700, 394, 18); ctx.clip(); movieFrame(0, -43, 700, 394, t, pix, seed);
  if (spin > 0) { ctx.globalAlpha = 0.55 * spin; ctx.fillStyle = C.ink; ctx.fillRect(-350, -240, 700, 394); ctx.globalAlpha = 1; }
  ctx.restore();
  playerBar(-330, 210, 660, played, buffered, { hi });
  ctx.restore();
}

/** quality badge: rounded tag with a label (HD / SD / LOW). col = bg */
export function qualityBadge(x, y, s, text, col = C.ink, fg = C.white, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  ctx.font = '900 54px Inter'; const w = ctx.measureText(text).width + 50;
  rr(-w / 2, -42, w, 84, 16); ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.fillStyle = fg; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 3);
  ctx.restore();
}

/** internet-provider building: flat office block with a sign band and a glass server room window.
 *  s = 1 → 420 wide x 480 tall, origin = bottom centre. serverP 0..1 slides a server rack into the window. */
export function providerBuilding(x, y, s, t = 0, serverP = 0, label = 'INTERNET PROVIDER') {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-210, -480, 420, 480, [16, 16, 0, 0]); ctx.fillStyle = '#7A8BA8'; ctx.fill();
  rr(-210, -480, 90, 480, [16, 0, 0, 0]); ctx.fillStyle = '#6A7A96'; ctx.fill();
  rr(-190, -462, 380, 70, 12); ctx.fillStyle = C.ink; ctx.fill();
  ctx.fillStyle = C.white; ctx.font = '900 34px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, -425);
  for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) { rr(-170 + c * 90, -370 + r * 70, 60, 46, 6); ctx.fillStyle = '#BFE3F2'; ctx.fill(); }
  rr(-150, -215, 300, 215, [14, 14, 0, 0]); ctx.fillStyle = '#2C3E5C'; ctx.fill();
  ctx.save(); rr(-150, -215, 300, 215, [14, 14, 0, 0]); ctx.clip();
  if (serverP > 0) {
    const sy = lerp(-420, -105, clamp(serverP));
    for (let k = -1; k <= 1; k++) {
      ctx.save(); ctx.translate(k * 92, sy); rr(-40, -90, 80, 180, 10); ctx.fillStyle = C.ink; ctx.fill();
      for (let i = 0; i < 4; i++) { rr(-30, -78 + i * 42, 60, 30, 6); ctx.fillStyle = C.pants; ctx.fill(); circle(18, -63 + i * 42, 6, Math.sin(t * 8 + i * 2 + k) > -0.3 ? C.yellow : '#6B5A1E'); }
      ctx.restore();
    }
  }
  ctx.restore();
  ctx.restore();
}

/** a mini movie-chunk token for routes: small film tile. s = 1 → 110 x 90 */
export function chunkToken(x, y, s, t = 0, seed = 0, a = 1) {
  filmChunk(x, y, s * 0.46, t, { seed, a });
}
