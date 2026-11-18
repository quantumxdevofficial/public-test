// Copy & paste components (What actually happens when you copy and paste?):
// keycap, clipboardBoard, textCard, formatCard, appWindow, scissors, glueBottle, oldPage, paperStrip, dashCut
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

const BLUE = '#3A7BD5', SEL = '#BFD7F6', WOOD = '#B9814F', WOOD_D = '#9A663B', METAL = '#C9CDD6', METAL_D = '#9EA4B0';
const PARCH = '#F3E7C9', PARCH_D = '#E2D2AA';

/** a keyboard keycap with a label (e.g. 'CTRL', 'C'). 200x200 at s = 1 (w scales width). press 0..1 pushes it down */
export function keycap(x, y, s, label, press = 0, w = 1, hi = false) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const kw = 200 * w;
  rr(-kw / 2, -90, kw, 190, 34); ctx.fillStyle = '#AEB4BE'; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  const dy = press * 22;
  rr(-kw / 2, -100 + dy, kw, 170, 34); ctx.fillStyle = hi ? C.yellow : C.white; ctx.fill(); ctx.stroke();
  rr(-kw / 2 + 20, -86 + dy, kw - 40, 24, 12); ctx.fillStyle = hi ? '#FFE680' : '#F1F1F4'; ctx.fill();
  ctx.fillStyle = C.ink; ctx.font = `900 ${label.length > 2 ? 64 : 96}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(label, 0, -10 + dy);
  ctx.restore();
}

/** a wooden clipboard with a metal clip; 520x700 at s = 1, origin = centre. inner() draws on the paper (0,0 = paper centre) */
export function clipboardBoard(x, y, s, inner = null, rot = 0, glow = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  if (glow > 0) { ctx.save(); ctx.globalAlpha = 0.5 * glow; rr(-290, -380, 580, 760, 60); ctx.fillStyle = C.yellow; ctx.fill(); ctx.restore(); }
  rr(-260, -340, 520, 690, 40); ctx.fillStyle = WOOD_D; ctx.fill();
  rr(-260, -350, 520, 690, 40); ctx.fillStyle = WOOD; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-215, -270, 430, 580, 16); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 7; ctx.stroke();
  if (inner) { ctx.save(); rr(-215, -270, 430, 580, 16); ctx.clip(); ctx.translate(0, 30); inner(); ctx.restore(); }
  // clip
  rr(-130, -395, 260, 110, 28); ctx.fillStyle = METAL_D; ctx.fill(); ctx.lineWidth = 9; ctx.stroke();
  rr(-130, -405, 260, 100, 28); ctx.fillStyle = METAL; ctx.fill(); ctx.stroke();
  circle(0, -372, 22, C.white); ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(0, -372, 22, 0, TAU); ctx.stroke();
  rr(-90, -335, 180, 14, 7); ctx.fillStyle = C.white; ctx.fill();
  ctx.restore();
}

/** a card holding some copied text. style: 'fancy' (bold, coloured) | 'plain' (thin grey). sel 0..1 = blue selection sweep */
export function textCard(x, y, s, text = 'Hello!', o = {}) {
  const sc = o.sc ?? 1; if (s <= 0 || sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s * sc, s * sc); ctx.globalAlpha = clamp(o.a ?? 1);
  const style = o.style || 'fancy', size = 104;
  ctx.font = style === 'fancy' ? `900 ${size}px Inter` : `400 ${size}px Inter`;
  const tw = ctx.measureText(text).width, w = Math.max(tw + 110, 300), h = 190;
  rr(-w / 2, -h / 2 + 12, w, h, 34); ctx.fillStyle = '#D7CFBF'; ctx.fill();
  rr(-w / 2, -h / 2, w, h, 34); ctx.fillStyle = o.bg || C.white; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  const sel = clamp(o.sel || 0);
  if (sel > 0) { rr(-tw / 2 - 12, -size * 0.58, (tw + 24) * sel, size * 1.16, 12); ctx.fillStyle = SEL; ctx.fill(); }
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillStyle = style === 'fancy' ? (o.col || BLUE) : '#7A7F8A';
  ctx.fillText(text, -tw / 2, 4);
  if (style === 'fancy' && o.under !== false) { rr(-tw / 2, size * 0.48, tw, 10, 5); ctx.fillStyle = C.red; ctx.fill(); }
  ctx.restore();
}

/** a format card: label on a coloured tab + a sample. kind: 'plain' | 'fancy' | 'image'. 300x360 at s = 1 */
export function formatCard(x, y, s, kind = 'plain', o = {}) {
  const sc = o.sc ?? 1; if (s <= 0 || sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s * sc, s * sc);
  if (o.ring) { ctx.save(); ctx.globalAlpha = clamp(o.ring); rr(-174, -204, 348, 408, 46); ctx.lineWidth = 16; ctx.strokeStyle = C.yellow; ctx.stroke(); ctx.restore(); }
  rr(-150, -170, 300, 360, 30); ctx.fillStyle = '#D7CFBF'; ctx.fill();
  rr(-150, -180, 300, 360, 30); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  const tab = kind === 'plain' ? '#7A7F8A' : kind === 'fancy' ? BLUE : C.pink;
  rr(-150, -180, 300, 80, [30, 30, 0, 0]); ctx.fillStyle = tab; ctx.fill(); ctx.stroke();
  ctx.fillStyle = C.white; ctx.font = '900 44px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(kind === 'plain' ? 'PLAIN' : kind === 'fancy' ? 'FANCY' : 'IMAGE', 0, -138);
  if (kind === 'plain') {
    ctx.fillStyle = '#7A7F8A'; ctx.font = '400 64px Inter'; ctx.fillText('Hello!', 0, 0);
    for (let i = 0; i < 2; i++) { rr(-110, 60 + i * 40, i ? 140 : 220, 14, 7); ctx.fillStyle = '#C9CDD6'; ctx.fill(); }
  } else if (kind === 'fancy') {
    ctx.fillStyle = BLUE; ctx.font = '900 70px Inter'; ctx.fillText('Hello!', 0, 0);
    rr(-104, 40, 208, 9, 4); ctx.fillStyle = C.red; ctx.fill();
    rr(-110, 80, 220, 16, 8); ctx.fillStyle = C.pink; ctx.fill(); rr(-110, 116, 140, 16, 8); ctx.fillStyle = C.yellow; ctx.fill();
  } else {
    rr(-110, -80, 220, 220, 18); ctx.fillStyle = C.sky; ctx.fill();
    circle(50, -30, 26, C.yellow);
    ctx.beginPath(); ctx.moveTo(-110, 140); ctx.lineTo(-40, 30); ctx.lineTo(30, 140); ctx.closePath(); ctx.fillStyle = '#5BAE6A'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(0, 140); ctx.lineTo(60, 60); ctx.lineTo(110, 140); ctx.closePath(); ctx.fillStyle = '#4A9358'; ctx.fill();
  }
  ctx.restore();
}

/** an app window with a title bar. kind: 'docs' (blue bar) | 'notepad' (grey bar). w x h, origin = centre. inner() at body centre */
export function appWindow(x, y, w, h, kind = 'docs', inner = null, sc = 1) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  rr(-w / 2, -h / 2 + 14, w, h, 30); ctx.fillStyle = '#D7CFBF'; ctx.fill();
  rr(-w / 2, -h / 2, w, h, 30); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-w / 2, -h / 2, w, 100, [30, 30, 0, 0]); ctx.fillStyle = kind === 'docs' ? BLUE : '#7A7F8A'; ctx.fill(); ctx.stroke();
  ctx.fillStyle = C.white; ctx.font = '900 46px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText(kind === 'docs' ? 'Docs' : 'Notepad', -w / 2 + 40, -h / 2 + 52);
  for (let i = 0; i < 3; i++) circle(w / 2 - 50 - i * 46, -h / 2 + 50, 13, C.white);
  if (kind === 'docs') {   // toolbar with B I U
    rr(-w / 2 + 9, -h / 2 + 100, w - 18, 74, 0); ctx.fillStyle = '#E8EEF8'; ctx.fill();
    ctx.fillStyle = C.ink; ctx.font = '900 44px Inter'; ctx.fillText('B', -w / 2 + 40, -h / 2 + 138);
    ctx.font = 'italic 700 44px Inter'; ctx.fillText('I', -w / 2 + 100, -h / 2 + 138);
    ctx.font = '700 44px Inter'; ctx.fillText('U', -w / 2 + 150, -h / 2 + 138); rr(-w / 2 + 150, -h / 2 + 160, 30, 5, 2); ctx.fill();
  }
  if (inner) { ctx.save(); rr(-w / 2 + 9, -h / 2 + 100, w - 18, h - 109, [0, 0, 24, 24]); ctx.clip(); ctx.translate(0, 60); inner(); ctx.restore(); }
  ctx.restore();
}

/** a pair of flat scissors; open 0..1, origin = the pivot screw, blades point right at rot 0. ~420 px long at s = 1 */
export function scissors(x, y, s, open = 0.5, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  const a = 0.06 + 0.32 * clamp(open);
  for (const sg of [1, -1]) {
    ctx.save(); ctx.rotate(sg * a);
    // blade
    ctx.beginPath(); ctx.moveTo(-10, -sg * 4); ctx.lineTo(240, -sg * 4); ctx.lineTo(-10, sg * 26); ctx.closePath();
    ctx.fillStyle = sg > 0 ? METAL : '#DCE0E7'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.lineJoin = 'round'; ctx.stroke();
    // handle loop
    ctx.beginPath(); ctx.ellipse(-110, sg * 40, 70, 48, 0, 0, TAU); ctx.fillStyle = C.red; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(-110, sg * 40, 40, 22, 0, 0, TAU); ctx.fillStyle = C.bg; ctx.fill(); ctx.stroke();
    rr(-50, sg > 0 ? 0 : -26, 60, 26, 10); ctx.fillStyle = C.red; ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  circle(0, 0, 14, METAL_D); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, 14, 0, TAU); ctx.stroke();
  ctx.restore();
}

/** a glue bottle with an orange cone tip, standing upright (tip at -200 * s). drop 0..1 shows a glue drop at the tip */
export function glueBottle(x, y, s, rot = 0, drop = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-22, -130); ctx.lineTo(0, -200); ctx.lineTo(22, -130); ctx.closePath(); ctx.fillStyle = '#F08A3C'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-50, -140, 100, 40, 12); ctx.fillStyle = '#F08A3C'; ctx.fill(); ctx.stroke();
  rr(-90, -105, 180, 260, 34); ctx.fillStyle = C.white; ctx.fill(); ctx.stroke();
  rr(-90, -40, 180, 110, 0); ctx.fillStyle = C.yellow; ctx.fill(); ctx.stroke();
  ctx.fillStyle = C.ink; ctx.font = '900 46px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('GLUE', 0, 16);
  rr(56, -90, 16, 50, 8); ctx.fillStyle = '#EDEDF0'; ctx.fill();
  if (drop > 0) ell(0, -200 - 6 + 22 * drop, 12 * drop, 16 * drop, C.white);
  ctx.restore();
}

/** an old typed page (parchment). 520x700 at s = 1. rows = paragraph count; gap = index of a paragraph cut out (-1 none);
 *  dash = index of a paragraph with a dashed cut line (p 0..1 how far the cut has gone) */
export function oldPage(x, y, s, o = {}) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s, s);
  rr(-260, -340, 520, 700, 18); ctx.fillStyle = PARCH_D; ctx.fill();
  rr(-260, -350, 520, 700, 18); ctx.fillStyle = PARCH; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  const rows = o.rows ?? 3;
  for (let r = 0; r < rows; r++) {
    const py = -260 + r * 200;
    if (r === o.gap) { rr(-215, py - 20, 430, 160, 6); ctx.fillStyle = '#5A4030'; ctx.globalAlpha = 0.25; ctx.fill(); ctx.globalAlpha = 1; continue; }
    if (r === o.empty) continue;
    paraLines(0, py + 60);
    if (r === o.dash) dashCut(-215, py - 20, 430, 160, o.dashP ?? 1);
  }
  ctx.restore();
}
function paraLines(cx, cy) {
  for (let i = 0; i < 4; i++) { rr(cx - 190, cy - 54 + i * 34, i === 3 ? 200 : 380, 14, 7); ctx.fillStyle = '#8C7A5C'; ctx.fill(); }
}
/** dashed rectangle drawn p 0..1 of the way round (the cut line) */
export function dashCut(x, y, w, h, p = 1) {
  const per = 2 * (w + h), len = per * clamp(p);
  ctx.save(); ctx.setLineDash([22, 16]); ctx.lineWidth = 6; ctx.strokeStyle = C.red; ctx.beginPath(); ctx.moveTo(x, y);
  let left = len; const segs = [[w, 0], [0, h], [-w, 0], [0, -h]]; let px = x, py = y;
  for (const [dx, dy] of segs) { const L = Math.abs(dx + dy), k = Math.min(1, left / L); px += dx * k; py += dy * k; ctx.lineTo(px, py); left -= L; if (left <= 0) break; }
  ctx.stroke(); ctx.restore();
}
/** a cut-out paragraph strip (parchment). 430x160 at s = 1, origin = centre */
export function paperStrip(x, y, s, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-215, -70, 430, 160, 6); ctx.fillStyle = PARCH_D; ctx.fill();
  rr(-215, -80, 430, 160, 6); ctx.fillStyle = PARCH; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
  paraLines(0, 0);
  ctx.restore();
}
