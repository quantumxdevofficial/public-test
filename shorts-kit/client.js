// Inside Out: CLIENT vs SERVER components (System Design day 2). Flat fills, one darker shade, ink outlines on graphics.
// bubble, veg, pantry, feedScreen, loadingScreen
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';
import { photo } from './cloud.js';

const GREEN = '#5BAE6A', GREEN_D = '#3F8A4E', ORANGE = '#F29A3A', WOOD = '#C8734A', WOOD_D = '#A65C38';

/** speech bubble with text. s = 1 → auto width x 120 high. tail: -1 = tail bottom-left, 1 = bottom-right, 0 = none. sc pops it */
export function bubble(x, y, s, text, sc = 1, tail = -1, bg = C.white, fg = C.ink, size = 56) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  ctx.font = `900 ${size}px Inter`; const w = ctx.measureText(text).width + 80, h = size + 64;
  ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.fillStyle = bg;
  if (tail) { ctx.beginPath(); ctx.moveTo(tail * w * 0.18 - 26, h / 2 - 6); ctx.lineTo(tail * w * 0.34, h / 2 + 50); ctx.lineTo(tail * w * 0.18 + 26, h / 2 - 6); ctx.closePath(); ctx.fill(); ctx.stroke(); }
  rr(-w / 2, -h / 2, w, h, h / 2); ctx.fill(); ctx.stroke();
  if (tail) { ctx.beginPath(); ctx.moveTo(tail * w * 0.18 - 21, h / 2 - 8); ctx.lineTo(tail * w * 0.18 + 21, h / 2 - 8); ctx.lineWidth = 10; ctx.strokeStyle = bg; ctx.stroke(); }
  ctx.fillStyle = fg; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 4);
  ctx.restore();
}

/** one ingredient. kind: 'tomato' | 'carrot' | 'cheese' | 'leaf'. s = 1 → ~100 px */
export function veg(x, y, s, kind = 'tomato', rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  if (kind === 'tomato') { circle(0, 6, 48, '#B81F30'); circle(0, 0, 46, C.red); ell(-16, -16, 14, 8, 'rgba(255,255,255,0.45)', -0.5); for (let k = 0; k < 5; k++) { const a = k * TAU / 5 - Math.PI / 2; ell(Math.cos(a) * 14, -42 + Math.sin(a) * 6, 14, 6, GREEN, a); } }
  else if (kind === 'carrot') { ctx.beginPath(); ctx.moveTo(-28, -40); ctx.lineTo(28, -40); ctx.lineTo(0, 60); ctx.closePath(); ctx.fillStyle = ORANGE; ctx.fill(); ctx.beginPath(); ctx.moveTo(8, -40); ctx.lineTo(28, -40); ctx.lineTo(4, 44); ctx.closePath(); ctx.fillStyle = '#D9822B'; ctx.fill(); for (const d of [-14, 0, 14]) ell(d, -58, 8, 22, GREEN, d * 0.03); }
  else if (kind === 'cheese') { ctx.beginPath(); ctx.moveTo(-50, 30); ctx.lineTo(50, 30); ctx.lineTo(50, -10); ctx.lineTo(-50, -40); ctx.closePath(); ctx.fillStyle = C.yellow; ctx.fill(); ctx.fillStyle = '#E8B92A'; ctx.fillRect(-50, 18, 100, 12); circle(-10, 2, 9, '#E8B92A'); circle(22, 14, 6, '#E8B92A'); }
  else { ell(0, 0, 50, 30, GREEN, -0.4); ell(6, -4, 36, 16, '#7CC487', -0.4); line([[-38, 22], [36, -20]], GREEN_D, 5); }
  ctx.restore();
}

/** wooden pantry shelf (two boards) with ingredients. s = 1 → 520 wide. n = how many items are shown (fractional pops the next) */
export function pantry(x, y, s, n = 8) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const kinds = ['tomato', 'carrot', 'cheese', 'leaf'];
  for (let r = 0; r < 2; r++) {
    const by = -60 + r * 170;
    for (let i = 0; i < 4; i++) { const k = r * 4 + i, p = clamp(n - k); if (p > 0) veg(-195 + i * 130, by - 52 - (1 - p) * 40, 0.85 * p, kinds[(i + r) % 4]); }
    rr(-260, by, 520, 30, 8); ctx.fillStyle = WOOD; ctx.fill(); ctx.fillStyle = WOOD_D; ctx.fillRect(-260, by + 20, 520, 10);
  }
  rr(-250, 140, 20, 30, 4); ctx.fillStyle = WOOD_D; ctx.fill(); rr(230, 140, 20, 30, 4); ctx.fill();
  ctx.restore();
}

/** a social feed screen for phone(). p 0..1 = how many posts have loaded (empty grey cards before) */
export function feedScreen(p = 1, t = 0) {
  ctx.fillStyle = '#F7F4EE'; ctx.fillRect(-166, -350, 332, 700);
  ctx.fillStyle = C.white; ctx.fillRect(-166, -350, 332, 90);
  ctx.fillStyle = C.ink; ctx.font = '900 34px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('Feed', -140, -305);
  circle(130, -305, 18, C.red);
  for (let k = 0; k < 2; k++) {
    const y = -150 + k * 300, q = clamp(p * 2 - k);
    circle(-120, y - 80, 20, q > 0 ? [ORANGE, GREEN][k] : '#D9D4CA'); rr(-90, y - 92, 120, 22, 11); ctx.fillStyle = '#D9D4CA'; ctx.fill();
    if (q > 0) { ctx.save(); ctx.globalAlpha = q; photo(0, y + 60, 1.4, 0); ctx.restore(); }
    else { rr(-140, y - 59, 280, 238, 16); ctx.fillStyle = '#E2DCD0'; ctx.fill(); }
  }
}
