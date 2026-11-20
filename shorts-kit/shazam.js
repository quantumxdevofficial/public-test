// Inside Out: SONG RECOGNITION components (how Shazam-style apps work). Flat fills, one darker shade, ink outlines
// on graphics. The spectrogram is the "x-ray of the sound", so it uses the navy/cyan x-ray look with yellow peaks.
// listenButton, listenScreen, resultScreen, SPEC, specCell, spectrogram, PEAKS, peakAt, peakStar, peakLinks, hashChip,
// songCard, songShelf, matchPlot, cafeCup, cafe, speaker, oldPhone, smsBubble
import { ctx, C, TAU, lerp, clamp, rnd, rr, circle, ell, line } from './lib.js';

const BLUE = '#2F6FE0', BLUE_D = '#2457B8', GREEN = '#5BAE6A', WOOD = '#C8734A', WOOD_D = '#A65C38';
const MONO = "'DejaVu Sans Mono', monospace";

/** generic round "listen" button: blue disc with a white sound-wave mark. pulse 0..1 grows rings; t animates */
export function listenButton(x, y, s, t = 0, pulse = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (let k = 0; k < 3; k++) {
    const p = (t * 0.9 + k / 3) % 1;
    ctx.globalAlpha = pulse * (1 - p) * 0.5; circle(0, 0, 100 + p * 120, BLUE);
  }
  ctx.globalAlpha = 1;
  circle(0, 6, 104, BLUE_D); circle(0, 0, 100, BLUE);
  ell(-34, -46, 34, 16, 'rgba(255,255,255,0.22)', -0.5);
  // white sound-wave bars
  const hs = [36, 70, 100, 60, 84, 40];
  for (let i = 0; i < hs.length; i++) {
    const h = hs[i] * (0.75 + 0.25 * Math.sin(t * 9 + i * 1.7) * pulse);
    rr(-62 + i * 24, -h / 2, 14, h, 7); ctx.fillStyle = C.white; ctx.fill();
  }
  ctx.restore();
}
/** phone screen (332x700, centred): blue listening screen. t animates, pulse 0..1 */
export function listenScreen(t = 0, pulse = 1, label = 'LISTENING...') {
  ctx.fillStyle = '#DCEBFF'; ctx.fillRect(-166, -350, 332, 700);
  listenButton(0, -20, 0.95, t, pulse);
  ctx.fillStyle = C.ink; ctx.font = '900 30px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(label, 0, 230);
}
/** phone screen: song found card. p 0..1 slides it up */
export function resultScreen(p = 1, title = 'SONG FOUND!') {
  ctx.fillStyle = '#DCEBFF'; ctx.fillRect(-166, -350, 332, 700);
  ctx.save(); ctx.translate(0, (1 - p) * 500);
  rr(-140, -230, 280, 280, 30); ctx.fillStyle = C.pink; ctx.fill();
  circle(0, -90, 90, C.pinkDark); circle(0, -90, 26, C.pinkLight);
  ctx.fillStyle = C.ink; ctx.font = '900 34px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(title, 0, 110);
  rr(-120, 150, 240, 22, 11); ctx.fillStyle = '#9AA3B2'; ctx.fill();
  rr(-80, 192, 160, 22, 11); ctx.fill();
  ctx.restore();
}

// ── spectrogram ──
export const SPEC = { cols: 14, rows: 9 };
/** the bright peaks [col, row] (row 0 = high notes at the top) */
export const PEAKS = [[1, 6], [3, 3], [4, 7], [6, 2], [7, 5], [9, 6], [10, 1], [12, 4], [13, 7]];
/** loudness 0..1 of a cell */
export function specCell(c, r) {
  let v = 0.15 + rnd(c * 31 + r * 7) * 0.3 + (r / SPEC.rows) * 0.15;
  for (const [pc, pr] of PEAKS) { const d = Math.hypot(c - pc, (r - pr) * 1.2); v = Math.max(v, 1 - d * 0.42); }
  return clamp(v);
}
const shade = (v) => (v > 0.85 ? C.yellow : v > 0.6 ? '#4FD1E8' : v > 0.4 ? '#2C7FA6' : v > 0.25 ? '#1B4F73' : '#143756');
/** spectrogram card. (x, y) = centre, w x h box. reveal 0..1 sweeps left→right. dim 0..1 fades non-peak cells (keeps peaks only) */
export function spectrogram(x, y, w, h, reveal = 1, dim = 0, axes = true) {
  const { cols, rows } = SPEC, cw = w / cols, ch = h / rows, x0 = x - w / 2, y0 = y - h / 2;
  rr(x0 - 24, y0 - 24, w + 48, h + 48, 28); ctx.fillStyle = C.ink; ctx.fill();
  ctx.fillStyle = '#0B2238'; ctx.fillRect(x0, y0, w, h);
  for (let c = 0; c < cols; c++) {
    if ((c + 0.5) / cols > reveal) continue;
    for (let r = 0; r < rows; r++) {
      const v = specCell(c, r), isPeak = PEAKS.some(([pc, pr]) => pc === c && pr === r);
      ctx.globalAlpha = isPeak ? 1 : 1 - dim * 0.9;
      ctx.fillStyle = shade(v); ctx.fillRect(x0 + c * cw + 3, y0 + r * ch + 3, cw - 6, ch - 6);
    }
  }
  ctx.globalAlpha = 1;
  if (axes) {
    ctx.fillStyle = C.ink; ctx.font = '900 34px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('TIME →', x, y0 + h + 62);
    ctx.save(); ctx.translate(x0 - 62, y); ctx.rotate(-Math.PI / 2); ctx.fillText('NOTE →', 0, 0); ctx.restore();
  }
}
/** canvas position of peak i for a spectrogram drawn at (x, y, w, h) */
export function peakAt(i, x, y, w, h) {
  const [c, r] = PEAKS[i]; return [x - w / 2 + (c + 0.5) * w / SPEC.cols, y - h / 2 + (r + 0.5) * h / SPEC.rows];
}
/** flat 5-point star. s = scale (1 → r 40) */
export function peakStar(x, y, s, col = C.yellow, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.beginPath();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, R = i % 2 ? 17 : 40; ctx.lineTo(Math.cos(a) * R, Math.sin(a) * R); }
  ctx.closePath(); ctx.fillStyle = C.ink; ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.fillStyle = col; ctx.fill();
  ctx.restore();
}
/** links between consecutive peaks (pairs i → i+1), drawn up to n (fractional grows the next) */
export function peakLinks(pts, n, col = C.white, w = 8) {
  for (let i = 0; i < pts.length - 1; i++) {
    const p = clamp(n - i); if (p <= 0) continue;
    const [ax, ay] = pts[i], [bx, by] = pts[i + 1];
    line([[ax, ay], [lerp(ax, bx, p), lerp(ay, by, p)]], col, w);
  }
}
/** small code chip ("A7-3F") like a hash */
export function hashChip(x, y, s, text, sc = 1, bg = C.white) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  ctx.font = `900 40px ${MONO}`; const w = ctx.measureText(text).width + 48;
  rr(-w / 2, -36, w, 72, 18); ctx.fillStyle = C.ink; ctx.fill();
  rr(-w / 2 + 6, -30, w - 12, 60, 14); ctx.fillStyle = bg; ctx.fill();
  ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 2);
  ctx.restore();
}

// ── song library ──
const COVERS = [C.pink, '#3A7BD5', GREEN, C.pot, '#8E6CD8', '#F29A3A', C.red, '#1F2A44'];
/** one song card (cover square + two text lines). lit 0..1 = green match glow, dimmed 0..1 greys it */
export function songCard(x, y, s, k = 0, lit = 0, dimmed = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (lit > 0) { ctx.globalAlpha = lit; rr(-176, -76, 352, 152, 34); ctx.fillStyle = GREEN; ctx.fill(); ctx.globalAlpha = 1; }
  ctx.globalAlpha = 1 - dimmed * 0.6;
  rr(-160, -60, 320, 120, 24); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-140, -42, 84, 84, 14); ctx.fillStyle = COVERS[k % COVERS.length]; ctx.fill();
  circle(-98, 0, 24, 'rgba(0,0,0,0.18)'); circle(-98, 0, 7, C.white);
  rr(-38, -26, 160, 18, 9); ctx.fillStyle = C.ink; ctx.fill();
  rr(-38, 10, 110, 16, 8); ctx.fillStyle = '#9AA3B2'; ctx.fill();
  ctx.restore();
}
/** the scrolling song library: columns of cards scrolling up by scroll px. match = index that lights (or -1) */
export function songShelf(x, y, w, h, scroll = 0, lit = 0, match = -1) {
  ctx.save(); rr(x - w / 2, y - h / 2, w, h, 36); ctx.fillStyle = '#E4DCCB'; ctx.fill(); ctx.clip();
  const rowH = 150, cols = 2, cw = w / cols;
  for (let r = -2; r < h / rowH + 3; r++) for (let c = 0; c < cols; c++) {
    const yy = y - h / 2 + 90 + r * rowH - (scroll % rowH), k = r + Math.floor(scroll / rowH);
    const idx = k * cols + c;
    songCard(x - w / 2 + cw * (c + 0.5), yy, 0.82, idx * 3 + c, idx === match ? lit : 0, match >= 0 && idx !== match ? lit : 0);
  }
  ctx.restore();
}
/** match plot: dots of (sample time, song time). Matching song's dots line up on a diagonal. on 0..1 lights the line */
export function matchPlot(x, y, s, n = 1, on = 0, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-300, -300, 600, 600, 36); ctx.fillStyle = C.ink; ctx.fill();
  rr(-284, -284, 568, 568, 28); ctx.fillStyle = '#0B2238'; ctx.fill();
  const N = 22;
  for (let i = 0; i < N; i++) {
    if (i / N > n) continue;
    const onLine = i % 2 === 0, u = i / N;
    const px = lerp(-230, 230, onLine ? u : rnd(i * 5.3)), py = onLine ? lerp(230, -230, u) : lerp(-230, 230, rnd(i * 9.1));
    circle(px, py, 15, onLine && on > 0 ? C.yellow : '#4FD1E8');
  }
  if (on > 0) { ctx.globalAlpha = on; ctx.setLineDash([24, 20]); line([[-250, 250], [lerp(-250, 250, on), lerp(250, -250, on)]], C.yellow, 10); ctx.setLineDash([]); }
  ctx.restore();
}

// ── places ──
/** a coffee cup with saucer. steam animates with t */
export function cafeCup(x, y, s, t = 0, col = C.white) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ell(0, 52, 90, 16, '#C9C2B5');
  ctx.beginPath(); ctx.arc(70, 0, 26, -1.3, 1.3); ctx.lineWidth = 12; ctx.strokeStyle = col; ctx.stroke();
  rr(-62, -40, 124, 92, [8, 8, 40, 40]); ctx.fillStyle = col; ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.fillRect(30, -40, 32, 70);
  ell(0, -40, 62, 12, '#6B3E26');
  ctx.globalAlpha = 0.6;
  for (let k = 0; k < 2; k++) { const ox = -20 + k * 34, ph = t * 3 + k; line([[ox, -60], [ox + Math.sin(ph) * 12, -95], [ox - Math.sin(ph) * 12, -130]], C.white, 8); }
  ctx.restore();
}
/** cafe background: warm wall, menu board, counter at y = top, speaker on the wall */
export function cafe(t = 0, top = 1150) {
  ctx.fillStyle = '#F2E3CF'; ctx.fillRect(-300, -300, 1680, 2520);
  ctx.fillStyle = '#E7D2B6'; for (let xx = -300; xx < 1400; xx += 120) ctx.fillRect(xx, -300, 60, top + 300);
  rr(560, 140, 420, 300, 20); ctx.fillStyle = '#2A3142'; ctx.fill(); rr(576, 156, 388, 268, 12); ctx.fillStyle = '#34405A'; ctx.fill();
  for (let i = 0; i < 4; i++) { rr(610, 200 + i * 56, 200 - i * 20, 18, 9); ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.fill(); rr(860, 200 + i * 56, 70, 18, 9); ctx.fillStyle = C.yellow; ctx.fill(); }
  ctx.fillStyle = WOOD; ctx.fillRect(-300, top, 1680, 60); ctx.fillStyle = WOOD_D; ctx.fillRect(-300, top + 60, 1680, 900);
}
/** wall speaker box. beat 0..1 pumps the cone */
export function speaker(x, y, s, beat = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-90, -130, 180, 260, 22); ctx.fillStyle = C.ink; ctx.fill(); rr(-80, -120, 160, 240, 16); ctx.fillStyle = '#2A2A30'; ctx.fill();
  circle(0, -60, 30, '#55555E'); circle(0, -60, 12, C.ink);
  circle(0, 40, 62 + beat * 6, '#55555E'); circle(0, 40, 26 + beat * 4, C.ink);
  ctx.restore();
}

// ── 2002 ──
/** old candy-bar phone with a tiny green screen and a keypad. screen = text (or fn), pressed = key label lit, s = 1 → 300x700 */
export function oldPhone(x, y, s, screen = '', pressed = '', rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-150, -350, 300, 700, 110); ctx.fillStyle = '#3B4A63'; ctx.fill();
  rr(70, -330, 60, 660, [0, 90, 90, 0]); ctx.fillStyle = '#2E3B50'; ctx.fill();
  rr(-60, -315, 120, 16, 8); ctx.fillStyle = C.ink; ctx.fill();
  rr(-110, -270, 220, 190, 22); ctx.fillStyle = C.ink; ctx.fill();
  rr(-96, -256, 192, 162, 14); ctx.fillStyle = '#A8C97A'; ctx.fill();
  ctx.fillStyle = '#2C3A1E'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  if (typeof screen === 'function') screen(); else { ctx.font = `900 48px ${MONO}`; ctx.fillText(screen, 0, -170); }
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
  for (let i = 0; i < 12; i++) {
    const kx = -80 + (i % 3) * 80, ky = -10 + Math.floor(i / 3) * 78, on = keys[i] === pressed;
    rr(kx - 32, ky - 26, 64, 52, 22); ctx.fillStyle = on ? C.yellow : '#C9D1DE'; ctx.fill();
    ctx.fillStyle = C.ink; ctx.font = '900 32px Inter'; ctx.fillText(keys[i], kx, ky + 2);
  }
  ctx.restore();
}
/** SMS message card in the old-phone look. sc pops it */
export function smsBubble(x, y, s, lines = ['SONG: ???', 'ARTIST: ???'], sc = 1) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  rr(-230, -110, 460, 220, 36); ctx.fillStyle = C.ink; ctx.fill(); rr(-222, -102, 444, 204, 30); ctx.fillStyle = '#A8C97A'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-150, 102); ctx.lineTo(-190, 160); ctx.lineTo(-100, 102); ctx.closePath(); ctx.fillStyle = C.ink; ctx.fill();
  ctx.fillStyle = '#2C3A1E'; ctx.font = `900 40px ${MONO}`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  lines.forEach((l, i) => ctx.fillText(l, -190, -40 + i * 70));
  ctx.restore();
}
