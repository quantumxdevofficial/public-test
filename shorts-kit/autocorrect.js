// Autocorrect components (How does autocorrect know what you meant?): keyboard, keyXY, wordCard, wordList, dictBook,
// suggestBar, typeScreen, oddsBar, roadSign, officialDoc, dice, thoughtBubble, squiggle
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

const GREEN = '#5BAE6A', BLUE = '#3A7BD5', SIGN = '#1F7A4D';
const ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
const KW = 84, KH = 108, KG = 12, PITCH = KW + KG;

/** centre of a letter key, for a keyboard drawn at (x, y, s). Keyboard s = 1 → 1000 x 420, origin = centre */
export function keyXY(x, y, s, letter) {
  for (let r = 0; r < 3; r++) {
    const i = ROWS[r].indexOf(letter.toUpperCase());
    if (i >= 0) { const off = [0, PITCH / 2, PITCH * 1.5][r]; return [x + s * (-480 + KW / 2 + off + i * PITCH), y + s * (-150 + r * (KH + 18) + KH / 2 - 40)]; }
  }
  return [x, y];
}
/** flat phone keyboard. hi = { A: 'y' (yellow) | 'r' (red) | 'ring' (yellow outline) }, press = { A: 0..1 } */
export function keyboard(x, y, s, hi = {}, press = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-500, -210, 1000, 420, 40); ctx.fillStyle = '#D9DDE3'; ctx.fill();
  ctx.font = '800 54px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (let r = 0; r < 3; r++) {
    const off = [0, PITCH / 2, PITCH * 1.5][r];
    for (let i = 0; i < ROWS[r].length; i++) {
      const k = ROWS[r][i], kx = -480 + off + i * PITCH, ky = -150 + r * (KH + 18) - 40, h = hi[k], pr = press[k] || 0;
      rr(kx, ky + 6, KW, KH, 14); ctx.fillStyle = '#AEB4BE'; ctx.fill();
      rr(kx, ky + pr * 6, KW, KH, 14); ctx.fillStyle = h === 'y' ? C.yellow : h === 'r' ? C.red : C.white; ctx.fill();
      if (h === 'ring') { ctx.lineWidth = 9; ctx.strokeStyle = C.yellow; ctx.stroke(); }
      ctx.fillStyle = h === 'r' ? C.white : C.ink; ctx.fillText(k, kx + KW / 2, ky + KH / 2 + 2 + pr * 6);
    }
  }
  rr(-260, 170 - 40 + 24, 520, 60, 14); ctx.fillStyle = C.white; ctx.fill();        // space bar
  ctx.restore();
}

/** red wavy "misspelled" underline from x0 to x0 + w (p = how much is drawn) */
export function squiggle(x0, y, w, p = 1, col = C.red, lw = 8) {
  if (p <= 0) return;
  ctx.beginPath();
  for (let i = 0; i <= w * p; i += 6) { const yy = y + Math.sin(i * 0.25) * 7; i === 0 ? ctx.moveTo(x0 + i, yy) : ctx.lineTo(x0 + i, yy); }
  ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.stroke();
}
/** white word card with big text. o = { squiggle 0..1, chars (typed so far), col (text), bg, sc, rot, size, cursor } */
export function wordCard(x, y, s, text, o = {}) {
  const sc = o.sc ?? 1; if (sc <= 0 || s <= 0) return;
  const size = o.size || 120, shown = text.slice(0, Math.floor(o.chars ?? 1e9));
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s * sc, s * sc);
  ctx.font = `900 ${size}px Inter`; ctx.letterSpacing = '4px';
  const tw = Math.max(ctx.measureText(text).width, size * 1.4), w = tw + size * 0.9, h = size * 1.7;
  rr(-w / 2, -h / 2 + 10, w, h, 34); ctx.fillStyle = '#D7CFBF'; ctx.fill();
  rr(-w / 2, -h / 2, w, h, 34); ctx.fillStyle = o.bg || C.white; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.fillStyle = o.col || C.ink; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText(shown, -tw / 2, size * 0.04);
  const sw = ctx.measureText(shown).width;
  if (o.cursor && Math.floor(o.cursor * 2.5) % 2 === 0) { ctx.fillStyle = BLUE; ctx.fillRect(-tw / 2 + sw + 6, -size * 0.45, 9, size * 0.9); }
  ctx.letterSpacing = '0px';
  if (o.squiggle) squiggle(-tw / 2, size * 0.52, tw, o.squiggle);
  ctx.restore();
}
/** a word-list card (dictionary page / old spellchecker list). hi = row index highlighted yellow (hiP 0..1). s = 1 → 560 wide */
export function wordList(x, y, s, words, hi = -1, hiP = 1, title = null, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  const h = words.length * 92 + (title ? 120 : 40);
  rr(-280, -h / 2, 560, h, 34); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  let y0 = -h / 2 + 20;
  if (title) { rr(-280, -h / 2, 560, 100, [34, 34, 0, 0]); ctx.fillStyle = C.navy; ctx.fill(); ctx.lineWidth = 9; ctx.stroke();
    ctx.fillStyle = C.white; ctx.font = '900 48px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(title, 0, -h / 2 + 52); y0 += 100; }
  ctx.font = '800 50px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  words.forEach((w, i) => {
    const yy = y0 + 46 + i * 92;
    if (i === hi && hiP > 0) { rr(-250, yy - 38, 500 * clamp(hiP), 76, 18); ctx.fillStyle = C.yellow; ctx.fill(); }
    ctx.fillStyle = C.ink; ctx.fillText(w, -220, yy + 2);
  });
  ctx.restore();
}
/** a thick dictionary book, face-on. s = 1 → 520 x 660 */
export function dictBook(x, y, s, rot = 0, label = 'DICTIONARY') {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-250, -320, 520, 660, 30); ctx.fillStyle = '#EDE6D6'; ctx.fill();                  // page block
  for (let i = 0; i < 6; i++) line([[260, -290 + i * 6 * 18], [260, -280 + i * 6 * 18 + 70]], '#D7CFBF', 6);
  rr(-260, -330, 500, 660, 30); ctx.fillStyle = C.red; ctx.fill();
  rr(-260, -330, 70, 660, [30, 0, 0, 30]); ctx.fillStyle = '#A81F2E'; ctx.fill();
  rr(-150, -200, 330, 120, 18); ctx.fillStyle = C.yellow; ctx.fill();
  ctx.fillStyle = C.ink; ctx.font = '900 50px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 15, -138);
  ctx.fillStyle = C.white; ctx.font = '900 130px Inter'; ctx.fillText('A–Z', 15, 90);
  ctx.restore();
}
/** keyboard suggestion strip: three words, middle bold; hi = slot highlighted yellow. s = 1 → 900 x 110 */
export function suggestBar(x, y, s, words, hi = -1, hiP = 1) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-450, -55, 900, 110, 26); ctx.fillStyle = '#E9ECF0'; ctx.fill();
  for (let i = 0; i < 3; i++) {
    const cx = -300 + i * 300;
    if (i === hi && hiP > 0) { rr(cx - 135 * hiP, -44, 270 * hiP, 88, 20); ctx.fillStyle = C.yellow; ctx.fill(); }
    if (i > 0) line([[cx - 150, -30], [cx - 150, 30]], '#B9BEC6', 5);
    ctx.fillStyle = C.ink; ctx.font = `${i === 1 ? 900 : 700} 50px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(words[i] || '', cx, 3);
  }
  ctx.restore();
}
/** phone screen (for phone()): message field with typed text, a suggestion strip and a mini keyboard */
export function typeScreen(text = '', o = {}) {
  ctx.fillStyle = '#EAF4EC'; ctx.fillRect(-166, -350, 332, 700);
  ctx.fillStyle = GREEN; ctx.fillRect(-166, -350, 332, 110);
  circle(-110, -285, 28, C.white); ctx.fillStyle = C.white; ctx.font = '900 30px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(o.name || 'Sam', -70, -285);
  rr(-150, -40, 300, 80, 26); ctx.fillStyle = C.white; ctx.fill();
  ctx.fillStyle = C.ink; ctx.font = '800 38px Inter'; ctx.fillText(text, -128, 2);
  const tw = ctx.measureText(text).width;
  if (o.squiggle) squiggle(-128, 26, tw, o.squiggle, C.red, 5);
  if (o.cursor != null && Math.floor(o.cursor * 2.5) % 2 === 0) { ctx.fillStyle = BLUE; ctx.fillRect(-124 + tw, -22, 5, 44); }
  if (o.sugg) suggestBar(0, 85, 0.35, o.sugg, o.hi ?? -1, o.hiP ?? 1);
  keyboard(0, 225, 0.33, o.keys || {}, o.press || {});
}
/** horizontal odds bar: label, fill to pct (0..100) * p, win = yellow fill + check */
export function oddsBar(x, y, s, label, pct, p = 1, win = false) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = C.ink; ctx.font = '900 60px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(label, -430, 0);
  rr(-120, -40, 520, 80, 40); ctx.fillStyle = '#E4DCCB'; ctx.fill();
  const w = Math.max(80, 520 * pct / 100 * clamp(p));
  rr(-120, -40, w, 80, 40); ctx.fillStyle = win ? C.yellow : '#B9BEC6'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.fillStyle = C.ink; ctx.font = '900 44px Inter'; const big = w > 200; ctx.textAlign = big ? 'right' : 'left'; ctx.fillText(Math.round(pct * clamp(p)) + '%', big ? -120 + w - 22 : -120 + w + 18, 2);
  ctx.restore();
}
/** green road sign on two posts: big city name + small sub line. s = 1 → 820 wide sign, posts down to +520 */
export function roadSign(x, y, s, text = 'CUPERTINO', sub = 'CALIFORNIA', rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  for (const px of [-260, 260]) { rr(px - 20, 0, 40, 520, 10); ctx.fillStyle = '#8E96A3'; ctx.fill(); }
  rr(-410, -190, 820, 330, 34); ctx.fillStyle = SIGN; ctx.fill();
  rr(-388, -168, 776, 286, 22); ctx.lineWidth = 10; ctx.strokeStyle = C.white; ctx.stroke();
  ctx.fillStyle = C.white; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = '900 112px Inter'; ctx.fillText(text, 0, -50);
  ctx.font = '800 52px Inter'; ctx.letterSpacing = '6px'; ctx.fillText(sub, 0, 62); ctx.letterSpacing = '0px';
  ctx.restore();
}
/** an official-looking document page: blue header, generic round seal, text lines, one line with a yellow-highlighted word. s = 1 → 600 x 800 */
export function officialDoc(x, y, s, hiP = 0, rot = 0, word = 'Cupertino', col = BLUE) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-292, -392, 600, 800, 20); ctx.fillStyle = '#D7CFBF'; ctx.fill();
  rr(-300, -400, 600, 800, 20); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-300, -400, 600, 120, [20, 20, 0, 0]); ctx.fillStyle = col; ctx.fill();
  circle(-210, -340, 42, C.white); circle(-210, -340, 30, col);
  for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * TAU / 5; circle(-210 + Math.cos(a) * 16, -340 + Math.sin(a) * 16, 6, C.yellow); }
  for (let i = 0; i < 3; i++) rr(-140, -368 + i * 22, 300 - i * 70, 12, 6), ctx.fillStyle = C.white, ctx.fill();
  for (let i = 0; i < 9; i++) {
    const yy = -220 + i * 62;
    if (i === 4) {
      ctx.font = '800 44px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      rr(-240, yy - 9, 90, 18, 9); ctx.fillStyle = '#C9CDD3'; ctx.fill();
      const ww = ctx.measureText(word).width;
      if (hiP > 0) { rr(-130, yy - 30, (ww + 20) * clamp(hiP), 60, 12); ctx.fillStyle = C.yellow; ctx.fill(); }
      ctx.fillStyle = C.ink; ctx.fillText(word, -120, yy + 2);
      rr(-90 + ww + 20, yy - 9, 230 - ww, 18, 9); ctx.fillStyle = '#C9CDD3'; ctx.fill();
    } else { rr(-240, yy - 9, i % 3 === 2 ? 320 : 480, 18, 9); ctx.fillStyle = '#C9CDD3'; ctx.fill(); }
  }
  rr(60, 330, 180, 14, 7); ctx.fillStyle = C.ink; ctx.fill();
  ctx.restore();
}
/** a flat die. face 1..6 */
export function dice(x, y, s, face = 6, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-100, -92, 200, 200, 36); ctx.fillStyle = '#C9C2B5'; ctx.fill();
  rr(-100, -100, 200, 200, 36); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  const P = { 1: [[0, 0]], 2: [[-45, -45], [45, 45]], 3: [[-45, -45], [0, 0], [45, 45]], 4: [[-45, -45], [45, -45], [-45, 45], [45, 45]],
    5: [[-45, -45], [45, -45], [0, 0], [-45, 45], [45, 45]], 6: [[-45, -50], [45, -50], [-45, 0], [45, 0], [-45, 50], [45, 50]] }[face];
  for (const [px, py] of P) circle(px, py, 18, face === 1 ? C.red : C.ink);
  ctx.restore();
}
/** thought bubble (cloud + two small dots trailing to (tx, ty)); inner() draws inside, centred at 0,0. s = 1 → 520 x 380 */
export function thoughtBubble(x, y, s, tx, ty, inner = null) {
  if (s <= 0) return;
  for (const [k, r] of [[0.25, 22], [0.5, 34]]) { circle(lerp(tx, x, k), lerp(ty, y, k), (r + 7) * s, C.ink); circle(lerp(tx, x, k), lerp(ty, y, k), r * s, C.white); }
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const CL = [[-150, 20, 120], [0, -60, 150], [150, 10, 120], [60, 100, 110], [-70, 100, 110]];
  for (const [cx, cy, r] of CL) circle(cx, cy, r + 10, C.ink);
  for (const [cx, cy, r] of CL) circle(cx, cy, r, C.white);
  if (inner) inner();
  ctx.restore();
}
