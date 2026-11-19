// Undo components (What actually happens when you press Ctrl+Z?): plate, plateStack, pileTray, undoArrow, docEdit
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

export const PLATE_COLS = { TYPE: '#3A7BD5', DELETE: '#E57A8A', MOVE: '#5BAE6A', BOLD: '#8A6BD1', PASTE: '#F29A3A' };
export const PLATE_H = 84;   // vertical pitch of a stacked plate at s = 1

/** one "action plate", seen edge-on: a white dish with a coloured label band. 440x76 at s = 1, origin = centre.
 *  label e.g. 'TYPE'; o = { rot, a, glow (yellow ring 0..1), col } */
export function plate(x, y, s, label = 'TYPE', o = {}) {
  if (s <= 0) return;
  const col = o.col || PLATE_COLS[label] || '#3A7BD5';
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s, s); ctx.globalAlpha = clamp(o.a ?? 1);
  if (o.glow > 0) { ctx.save(); ctx.globalAlpha *= clamp(o.glow); rr(-246, -54, 492, 112, 56); ctx.lineWidth = 14; ctx.strokeStyle = C.yellow; ctx.stroke(); ctx.restore(); }
  rr(-220, -30, 440, 70, 35); ctx.fillStyle = '#D7CFBF'; ctx.fill();                  // shadow / underside
  rr(-220, -38, 440, 70, 35); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-176, -24, 352, 42, 21); ctx.fillStyle = col; ctx.fill();
  rr(-200, -32, 90, 8, 4); ctx.fillStyle = '#EEF0F3'; ctx.fill();                   // rim highlight
  ctx.fillStyle = C.white; ctx.font = '900 34px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.letterSpacing = '3px'; ctx.fillText(label, 0, -2); ctx.letterSpacing = '0px';
  ctx.restore();
}

/** a tray / shelf the pile sits on, with a title under it (e.g. 'UNDO'). 520 wide at s = 1, origin = tray top centre */
export function pileTray(x, y, s, title = 'UNDO', col = C.ink, flash = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-260, 0, 520, 40, 14); ctx.fillStyle = flash > 0 ? C.red : '#B9814F'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-200, 40, 30, 50, 8); ctx.fillStyle = '#9A663B'; ctx.fill(); ctx.stroke();
  rr(170, 40, 30, 50, 8); ctx.fill(); ctx.stroke();
  ctx.font = '900 54px Inter'; ctx.letterSpacing = '4px'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const tw = ctx.measureText(title).width + 60;
  rr(-tw / 2, 110, tw, 80, 40); ctx.fillStyle = col; ctx.fill();
  ctx.fillStyle = C.white; ctx.fillText(title, 0, 152); ctx.letterSpacing = '0px';
  ctx.restore();
}

/** a pile of plates on a tray. labels bottom → top. y = tray top. o = { title, col, hide (top n hidden), glowTop } */
export function plateStack(x, y, s, labels, o = {}) {
  if (o.tray !== false) pileTray(x, y, s, o.title || 'UNDO', o.col || C.ink, o.flash || 0);
  const n = labels.length - (o.hide || 0);
  for (let i = 0; i < n; i++) plate(x, y - s * (44 + i * PLATE_H), s, labels[i], { glow: i === n - 1 ? o.glowTop || 0 : 0 });
}
/** y of the i-th plate slot in a stack drawn at (x, y, s) */
export const slotY = (y, s, i) => y - s * (44 + i * PLATE_H);

/** a thick curved "go back" arrow (counter-clockwise), p 0..1 how much is drawn. r = radius */
export function undoArrow(x, y, r, p = 1, col = C.yellow, flip = false) {
  if (p <= 0) return;
  ctx.save(); ctx.translate(x, y); if (flip) ctx.scale(-1, 1);
  const a0 = -0.2, a1 = a0 - 1.6 * Math.PI * clamp(p);
  ctx.lineCap = 'round';
  for (const [w, c] of [[44, C.ink], [28, col]]) { ctx.beginPath(); ctx.arc(0, 0, r, a0, a1, true); ctx.lineWidth = w; ctx.strokeStyle = c; ctx.stroke(); }
  const hx = Math.cos(a1) * r, hy = Math.sin(a1) * r, tang = a1 - Math.PI / 2;
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(tang);
  ctx.beginPath(); ctx.moveTo(0, -48); ctx.lineTo(56, 0); ctx.lineTo(0, 48); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.restore();
  ctx.restore();
}

/** document body (draw inside appWindow inner, 0,0 = body centre). st = { chars (of 'Hello there'), del 0..1 (word 'there'
 *  shrinks away), img (x offset of the picture block, 0 = left slot, 1 = right slot), cursor } */
export function docEdit(st = {}, t = 0) {
  const txt = 'Hello there', chars = Math.floor(clamp(st.chars ?? 11, 0, 11));
  ctx.font = '900 76px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  const del = clamp(st.del || 0);
  const a = txt.slice(0, Math.min(chars, 6)), b = chars > 6 ? txt.slice(6, chars) : '';
  const x0 = -320, y0 = -130;
  ctx.fillStyle = C.ink; ctx.fillText(a, x0, y0);
  let cx = x0 + ctx.measureText(a).width;
  if (b && del < 1) {
    ctx.save(); ctx.globalAlpha = 1 - del; const bw = ctx.measureText(b).width;
    if (del > 0) { rr(cx - 6, y0 - 46, bw + 12, 92, 10); ctx.fillStyle = '#F6C9D0'; ctx.fill(); }
    ctx.translate(cx, y0); ctx.scale(1 - del * 0.6, 1 - del * 0.6); ctx.fillStyle = C.ink; ctx.fillText(b, 0, 0); ctx.restore();
    cx += bw * (1 - del);
  }
  if (st.cursor !== false && Math.floor(t * 2.5) % 2 === 0) { rr(cx + 6, y0 - 42, 8, 84, 3); ctx.fillStyle = '#3A7BD5'; ctx.fill(); }
  // text lines
  for (let i = 0; i < 2; i++) { rr(x0, -30 + i * 44, i ? 380 : 620, 18, 9); ctx.fillStyle = '#D9DDE3'; ctx.fill(); }
  // picture block (moves between the left and right slot)
  const ix = lerp(-200, 160, clamp(st.img || 0));
  rr(-320, 120, 640, 200, 18); ctx.setLineDash([16, 12]); ctx.lineWidth = 5; ctx.strokeStyle = '#D9DDE3'; ctx.stroke(); ctx.setLineDash([]);
  rr(ix - 110, 130, 220, 180, 16); ctx.fillStyle = C.sky; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  circle(ix + 50, 175, 22, C.yellow);
  ctx.beginPath(); ctx.moveTo(ix - 104, 304); ctx.lineTo(ix - 30, 210); ctx.lineTo(ix + 40, 304); ctx.closePath(); ctx.fillStyle = '#5BAE6A'; ctx.fill();
}
