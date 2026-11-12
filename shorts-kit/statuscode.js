// Inside Out: HTTP status code components (status card, sad "not found" page, OK page, room door with number plate,
// early error-code list, smoke puffs). Flat fills, one darker shade, one light highlight, ink outlines only on graphics.
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

const GREEN = '#5BAE6A', BLUE = '#3A7BD5', WOOD = '#C8734A', WOOD_D = '#A85E3A', WOOD_L = '#DB8E66', BRASS = '#E0B23A';
export const STATUS_COLS = { ok: GREEN, client: C.red, server: C.navy, soft: '#E57A8A' };

/** a status-code card (600x420 at s = 1): big code + label. hi = index of a digit to underline in yellow (-1 none),
 *  squish 0..1 makes it wobble like jelly (for "soft") */
export function statusCard(x, y, s, code = '200', label = 'OK', col = GREEN, rot = 0, hi = -1, squish = 0, t = 0) {
  if (s <= 0) return;
  const sx = 1 + Math.sin(t * 9) * 0.06 * squish, sy = 1 - Math.sin(t * 9) * 0.06 * squish;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * sx, s * sy);
  rr(-300, -210, 600, 420, squish > 0 ? 90 : 40); ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 12; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-270, -190, 540, 40, 20); ctx.fillStyle = 'rgba(255,255,255,0.16)'; ctx.fill();
  ctx.fillStyle = C.white; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = '900 210px Inter';
  const cw = ctx.measureText(code).width, digits = code.split('');
  let cx = -cw / 2;
  digits.forEach((d, i) => {
    const w = ctx.measureText(d).width;
    ctx.fillStyle = i === hi ? C.yellow : C.white; ctx.fillText(d, cx + w / 2, -35);
    if (i === hi) { rr(cx + 6, 62, w - 12, 16, 8); ctx.fillStyle = C.yellow; ctx.fill(); }
    cx += w;
  });
  ctx.fillStyle = C.white; ctx.letterSpacing = '6px'; let fs = 62; ctx.font = `900 ${fs}px Inter`; while (ctx.measureText(label).width > 520 && fs > 30) { fs -= 2; ctx.font = `900 ${fs}px Inter`; } ctx.fillText(label, 0, 135); ctx.letterSpacing = '0px';
  ctx.restore();
}

/** content for browser(): a sad "page not found" page. p 0..1 pops it in */
export function sadPage(p = 1) {
  return (w, h) => {
    ctx.fillStyle = '#FBEFF0'; ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.save(); ctx.translate(0, -h * 0.14); ctx.scale(p, p);
    circle(0, 0, 110, C.yellow); circle(-38, -20, 13, C.ink); circle(38, -20, 13, C.ink);
    ctx.beginPath(); ctx.arc(0, 62, 48, Math.PI * 1.15, Math.PI * 1.85); ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.strokeStyle = C.ink; ctx.stroke();
    ctx.restore();
    ctx.globalAlpha = p; ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '900 54px Inter'; ctx.fillText('OOPS!', 0, h * 0.12);
    ctx.font = '800 34px Inter'; ctx.fillText('Page not found', 0, h * 0.12 + 62); ctx.globalAlpha = 1;
  };
}

/** content for browser(): a happy normal page (header, picture, text lines) */
export function okPage(col = BLUE) {
  return (w, h) => {
    ctx.fillStyle = col; ctx.fillRect(-w / 2, -h / 2, w, 64);
    rr(-w / 2 + 40, -h / 2 + 100, w * 0.44, h * 0.42, 16); ctx.fillStyle = C.sky; ctx.fill();
    circle(-w / 2 + 40 + w * 0.12, -h / 2 + 100 + h * 0.13, 30, C.yellow);
    ctx.beginPath(); ctx.moveTo(-w / 2 + 40, -h / 2 + 100 + h * 0.42); ctx.lineTo(-w / 2 + 40 + w * 0.2, -h / 2 + 100 + h * 0.2); ctx.lineTo(-w / 2 + 40 + w * 0.44, -h / 2 + 100 + h * 0.42); ctx.fillStyle = GREEN; ctx.fill();
    for (let i = 0; i < 5; i++) { rr(20, -h / 2 + 110 + i * 46, w * 0.36 - (i % 2) * 60, 20, 10); ctx.fillStyle = '#B9C6CF'; ctx.fill(); }
    for (let i = 0; i < 3; i++) { rr(-w / 2 + 40, h * 0.12 + i * 46, w - 80 - i * 90, 20, 10); ctx.fillStyle = '#B9C6CF'; ctx.fill(); }
  };
}

/** a wooden door with a brass number plate. s = 1 → 380x700, origin = door centre. open 0..1 swings it */
export function roomDoor(x, y, s, num = '404', open = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-220, -380, 440, 760, [24, 24, 0, 0]); ctx.fillStyle = '#E4DCCB'; ctx.fill();
  rr(-190, -350, 380, 730, [14, 14, 0, 0]); ctx.fillStyle = C.navy; ctx.fill();
  ctx.save(); ctx.scale(1 - open * 0.75, 1);
  rr(-190, -350, 380, 730, [14, 14, 0, 0]); ctx.fillStyle = WOOD; ctx.fill();
  rr(150, -350, 40, 730, [0, 14, 0, 0]); ctx.fillStyle = WOOD_D; ctx.fill();
  for (const py of [-290, 40]) { rr(-140, py, 270, 280, 14); ctx.fillStyle = WOOD_D; ctx.fill(); rr(-128, py + 12, 246, 256, 10); ctx.fillStyle = WOOD_L; ctx.fill(); rr(-128, py + 24, 246, 244, 10); ctx.fillStyle = WOOD; ctx.fill(); }
  circle(130, 20, 22, BRASS); circle(124, 14, 8, '#F2D27A');
  rr(-110, -200, 220, 110, 18); ctx.fillStyle = BRASS; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '900 82px Inter'; ctx.fillText(num, 0, -142);
  ctx.restore();
  ctx.restore();
}

const LIST = [['400', 'BAD REQUEST'], ['401', 'UNAUTHORIZED'], ['402', 'PAYMENT'], ['403', 'FORBIDDEN'], ['404', 'NOT FOUND']];
/** the early error-code list card (680 wide). shown = rows visible (0..5, fractional pops the next row), hi = row to mark, hiP 0..1 */
export function codeList(x, y, s, shown = 5, hi = -1, hiP = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-340, -400, 680, 800, 36); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-340, -400, 680, 120, [36, 36, 0, 0]); ctx.fillStyle = C.red; ctx.fill(); ctx.stroke();
  ctx.fillStyle = C.white; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '900 58px Inter'; ctx.letterSpacing = '4px'; ctx.fillText('ERROR CODES', 0, -340); ctx.letterSpacing = '0px';
  LIST.forEach(([c, l], i) => {
    const p = clamp(shown - i); if (p <= 0) return;
    const ry = -210 + i * 130;
    ctx.save(); ctx.globalAlpha = p; ctx.translate(lerp(-60, 0, p), 0);
    if (i === hi && hiP > 0) { rr(-310, ry - 52, 620 * hiP, 104, 20); ctx.fillStyle = C.yellow; ctx.fill(); }
    ctx.fillStyle = C.ink; ctx.textAlign = 'left'; ctx.font = '900 72px Inter'; ctx.fillText(c, -280, ry + 4);
    ctx.font = '800 42px Inter'; ctx.fillText(l, -110, ry + 4);
    if (i < LIST.length - 1) line([[-300, ry + 65], [300, ry + 65]], '#E4DCCB', 6);
    ctx.restore();
  });
  ctx.restore();
}

/** flat grey smoke puffs rising from (x, y). a 0..1 strength */
export function smoke(x, y, t, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  for (let i = 0; i < 5; i++) {
    const u = (t * 0.6 + i / 5) % 1;
    circle(x + Math.sin(u * 6 + i) * 40, y - u * 260, lerp(30, 80, u), u > 0.5 ? '#B8B2A6' : '#8F897E');
  }
  ctx.restore();
}

/** a "page missing" outline: dashed page with a big question mark. s = 1 → 300x400 */
export function missingPage(x, y, s, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.setLineDash([30, 22]); rr(-150, -200, 300, 400, 24); ctx.lineWidth = 12; ctx.strokeStyle = '#A9A194'; ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = '#A9A194'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '900 220px Inter'; ctx.fillText('?', 0, 10);
  ctx.restore();
}
