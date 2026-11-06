// Inside Out: HTTPS components (padlock, address bar, postcard, key, scramble card, tune icon, peeking eyes,
// login phone screen, scam page). Same flat look: flat fills, one darker shade, one light highlight,
// ink outlines only on graphics/cards. No brand logos: browsers and sites are generic / fictional.
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line, rnd } from './lib.js';

const MONO = "'DejaVu Sans Mono', monospace";
const GOLD = '#FFD43B', GOLD_D = '#E6B82E', GOLD_L = '#FFE680', GREEN = '#5BAE6A', BLUE = '#3A7BD5', STEEL = '#9AA1AE';
const CARD = '#FFF8E8', CARD_D = '#E9DFC6';

/** padlock. s = 1 → body 240x200, shackle above (total ~360 tall), origin = body centre.
 *  open 0..1 lifts the shackle (its right leg leaves the body). col = body colour */
export function padlock(x, y, s, open = 0, col = GOLD, rot = 0) {
  if (s <= 0) return;
  const dark = col === GOLD ? GOLD_D : col === C.red ? '#A81F2D' : '#2F67BE';
  const lite = col === GOLD ? GOLD_L : 'rgba(255,255,255,0.3)';
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  // shackle (rotates around its left leg as it opens)
  ctx.save(); ctx.translate(-70, -100 - 50 * open); ctx.rotate(-0.5 * open); ctx.translate(70, 0);
  ctx.lineCap = 'butt';
  for (const [w, c] of [[52, C.ink], [34, STEEL]]) { ctx.beginPath(); ctx.moveTo(-70, 20); ctx.lineTo(-70, -60); ctx.arc(0, -60, 70, Math.PI, 0); ctx.lineTo(70, 20); ctx.strokeStyle = c; ctx.lineWidth = w; ctx.stroke(); }
  ctx.beginPath(); ctx.arc(0, -60, 70, Math.PI * 1.15, Math.PI * 1.45); ctx.strokeStyle = '#C9CDD6'; ctx.lineWidth = 10; ctx.stroke();
  ctx.restore();
  // body
  rr(-120, -100, 240, 200, 36); ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.save(); rr(-120, -100, 240, 200, 36); ctx.clip(); ctx.fillStyle = dark; ctx.fillRect(60, -110, 80, 230); ctx.restore();
  rr(-120, -100, 240, 200, 36); ctx.stroke();
  rr(-92, -76, 120, 22, 11); ctx.fillStyle = lite; ctx.fill();
  circle(0, -6, 26, C.ink); rr(-10, 0, 20, 50, 8); ctx.fill();
  ctx.restore();
}

/** tune icon (two slider lines with knobs) = the icon Chrome uses now. s = 1 → 120 wide */
export function tuneIcon(x, y, s, col = C.ink) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  line([[-60, -26], [60, -26]], col, 14); line([[-60, 26], [60, 26]], col, 14);
  circle(-22, -26, 22, C.white); ctx.lineWidth = 12; ctx.strokeStyle = col; ctx.beginPath(); ctx.arc(-22, -26, 20, 0, TAU); ctx.stroke();
  circle(24, 26, 22, C.white); ctx.beginPath(); ctx.arc(24, 26, 20, 0, TAU); ctx.stroke();
  ctx.restore();
}

/** browser address bar. w wide, 120 tall, centred at (x, y).
 *  icon: 'lock' | 'open' (red open lock) | 'warn' (red "NOT SECURE") | 'tune' | null. iconS scales the icon (pop).
 *  url chars typed = urlChars; sCol colours the "s" in https:// (hiS 0..1) */
export function addressBar(x, y, w, url, icon = 'lock', sc = 1, urlChars = 1e9, iconS = 1, hiS = 0) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  rr(-w / 2, -60, w, 120, 60); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  const ix = -w / 2 + 80;
  if (icon === 'lock') padlock(ix, 8, 0.22 * iconS, 0, GOLD);
  if (icon === 'open') padlock(ix, 8, 0.22 * iconS, 1, C.red);
  if (icon === 'tune') tuneIcon(ix, 0, 0.5 * iconS);
  let tx = -w / 2 + 140;
  if (icon === 'warn' && iconS > 0) {
    ctx.save(); ctx.translate(-w / 2 + 130, 0); ctx.scale(iconS, iconS);
    rr(-90, -36, 180, 72, 36); ctx.fillStyle = C.red; ctx.fill();
    ctx.fillStyle = C.white; ctx.font = '900 26px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('NOT SECURE', 0, 2);
    ctx.restore(); tx = -w / 2 + 240;
  }
  const shown = url.slice(0, Math.max(0, Math.floor(urlChars)));
  ctx.font = '800 44px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  const k = shown.indexOf('https');
  if (hiS > 0 && k === 0) {
    const pre = 'http', wPre = ctx.measureText(pre).width, wS = ctx.measureText('s').width;
    ctx.save(); ctx.globalAlpha = hiS; rr(tx + wPre - 8, -36, wS + 16, 72, 14); ctx.fillStyle = GOLD; ctx.fill(); ctx.restore();
  }
  ctx.fillStyle = C.ink; ctx.fillText(shown, tx, 3);
  ctx.restore();
}

/** postcard. s = 1 → 560x360. lines = text rows (handwriting-ish), shown up to chars */
export function postcard(x, y, s, rot = 0, lines = ['PASSWORD:', 'sunny123'], chars = 1e9) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-280, -180, 560, 360, 20); ctx.fillStyle = CARD; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(150, -150, 100, 120, 10); ctx.fillStyle = C.pink; ctx.fill(); rr(166, -134, 68, 88, 6); ctx.fillStyle = C.pinkLight; ctx.fill();
  circle(200, -90, 22, C.white);
  line([[40, -150], [40, 150]], CARD_D, 8);
  for (let i = 0; i < 3; i++) line([[70, 10 + i * 50], [250, 10 + i * 50]], CARD_D, 6);
  let left = chars;
  ctx.fillStyle = C.ink; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  lines.forEach((t, i) => {
    ctx.font = i === 0 ? '900 34px Inter' : `700 54px ${MONO}`;
    const n = Math.max(0, Math.min(t.length, Math.floor(left))); left -= t.length;
    ctx.fillStyle = i === 0 ? '#7A7A80' : C.ink; ctx.fillText(t.slice(0, n), -250, -90 + i * 90);
  });
  ctx.restore();
}

/** flat key. s = 1 → 300 long. col = bow colour */
export function key(x, y, s, rot = 0, col = GOLD) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-40, -18, 190, 36, 12); ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(100, 10, 22, 40, 6); ctx.fill(); ctx.stroke(); rr(130, 10, 20, 28, 6); ctx.fill(); ctx.stroke();
  rr(-40, -18, 190, 36, 12); ctx.fillStyle = col; ctx.fill();
  circle(-90, 0, 72, C.ink); circle(-90, 0, 62, col); circle(-90, 0, 24, C.ink); circle(-90, 0, 16, C.bg);
  ell(-112, -30, 20, 10, col === GOLD ? GOLD_L : 'rgba(255,255,255,0.35)', -0.6);
  ctx.restore();
}

const GLYPHS = '#$%&@*?!7xQ9ZK§¥Ω≈∆';
/** a message card. s = 1 → 520x220. text is scrambled by scr 0..1 (left to right); seed changes the junk.
 *  tone: 'plain' (white) | 'locked' (navy card with gold junk) */
export function scrambleCard(x, y, s, text = 'sunny123', scr = 0, seed = 0, rot = 0, label = null) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  const locked = scr >= 0.999;
  rr(-260, -110, 520, 220, 28); ctx.fillStyle = scr > 0.5 ? C.navy : C.white; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const done = i / text.length < scr;
    out += done ? GLYPHS[Math.floor(rnd(i * 13 + seed * 7) * GLYPHS.length)] : text[i];
  }
  ctx.font = `700 76px ${MONO}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = scr > 0.5 ? GOLD : C.ink; ctx.fillText(out, 0, 8);
  if (label) { ctx.font = '900 30px Inter'; ctx.fillStyle = scr > 0.5 ? '#9AA9C0' : '#7A7A80'; ctx.fillText(label, 0, -78); }
  ctx.restore();
}

/** a pair of peeking eyes (a snoop). s = 1 → 120 wide. look -1..1 moves pupils, blink 0..1 */
export function peekEyes(x, y, s, look = 0, blink = 0, col = C.navy) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ell(0, 8, 88, 52, col);
  for (const sd of [-1, 1]) {
    ell(sd * 34, 4, 26, 30 * (1 - blink * 0.9), C.white);
    if (blink < 0.5) circle(sd * 34 + look * 9, 8, 13, C.ink);
  }
  ctx.restore();
}

/** phone screen: login form (for phone()). typed = password dots shown (0..8), p = form slide-in */
export function loginScreen(typed = 0, t = 0) {
  ctx.fillStyle = '#DCEEF6'; ctx.fillRect(-166, -350, 332, 700);
  ctx.fillStyle = BLUE; ctx.fillRect(-166, -350, 332, 140);
  ctx.fillStyle = C.white; ctx.font = '900 40px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('LOG IN', 0, -262);
  ctx.fillStyle = '#7A7A80'; ctx.font = '900 24px Inter'; ctx.textAlign = 'left';
  ctx.fillText('EMAIL', -136, -150); ctx.fillText('PASSWORD', -136, -10);
  for (const yy of [-120, 20]) { rr(-136, yy, 272, 72, 18); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.stroke(); }
  rr(-116, -98, 180, 26, 13); ctx.fillStyle = '#B8D6E6'; ctx.fill();
  const n = Math.floor(clamp(typed, 0, 8));
  for (let i = 0; i < n; i++) circle(-106 + i * 30, 56, 10, C.ink);
  if (Math.sin(t * 12) > 0) rr(-112 + n * 30, 36, 5, 40, 2), ctx.fillStyle = C.ink, ctx.fill();
  rr(-136, 140, 272, 76, 38); ctx.fillStyle = C.ink; ctx.fill();
  ctx.fillStyle = C.white; ctx.font = '900 30px Inter'; ctx.textAlign = 'center'; ctx.fillText('ENTER', 0, 180);
}

/** content for cookies' browser(): a fake "prize" scam page (fictional). p 0..1 */
export function scamPage(t = 0) {
  return (w, h) => {
    ctx.fillStyle = C.red; ctx.fillRect(-w / 2, -h / 2, w, 110);
    ctx.fillStyle = C.white; ctx.font = '900 54px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('YOU WON!!!', 0, -h / 2 + 56);
    const b = 1 + 0.05 * Math.sin(t * 8);
    ctx.save(); ctx.translate(0, -h / 2 + 230); ctx.scale(b, b);
    ctx.fillStyle = GOLD; ctx.beginPath();
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, r = i % 2 ? 70 : 110; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
    ctx.closePath(); ctx.fill(); ctx.fillStyle = C.ink; ctx.font = '900 48px Inter'; ctx.fillText('$$$', 0, 4);
    ctx.restore();
    ctx.fillStyle = '#7A7A80'; ctx.font = '900 26px Inter'; ctx.textAlign = 'left';
    ctx.fillText('ENTER YOUR PASSWORD', -w / 2 + 50, -h / 2 + 400);
    rr(-w / 2 + 50, -h / 2 + 425, w - 100, 70, 18); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.stroke();
    rr(-w / 2 + 50, -h / 2 + 520, w - 100, 76, 38); ctx.fillStyle = C.red; ctx.fill();
    ctx.fillStyle = C.white; ctx.font = '900 32px Inter'; ctx.textAlign = 'center'; ctx.fillText('CLAIM PRIZE', 0, -h / 2 + 560);
  };
}

/** fishing hook (scam bait). s = 1 → ~200 tall, line goes up from the top */
export function hook(x, y, s, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  line([[0, -900], [0, -100]], C.ink, 6);
  ctx.lineCap = 'round';
  for (const [w, c] of [[26, C.ink], [14, STEEL]]) { ctx.beginPath(); ctx.moveTo(0, -110); ctx.lineTo(0, 30); ctx.arc(-50, 30, 50, 0, Math.PI * 0.95); ctx.strokeStyle = c; ctx.lineWidth = w; ctx.stroke(); }
  circle(0, -110, 16, C.ink);
  ctx.restore();
}

/** a tiny person icon for crowds. s = 1 → 120 tall. q 0..1 shows a "?" above */
export function personIcon(x, y, s, col = BLUE, q = 0, got = false) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  circle(0, -40, 26, C.skin); ell(0, -56, 27, 14, C.hair);
  rr(-34, -10, 68, 70, [30, 30, 8, 8]); ctx.fillStyle = col; ctx.fill();
  if (q > 0) { ctx.globalAlpha = q; ctx.fillStyle = got ? GREEN : C.ink; ctx.font = '900 52px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(got ? '✓' : '?', 0, -110); ctx.globalAlpha = 1; }
  ctx.restore();
}
