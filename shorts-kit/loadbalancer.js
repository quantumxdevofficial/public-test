// (5/30) Load balancer components. Same flat look: flat fills, one darker shade, ink outlines on graphics.
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

const GREEN = '#5BAE6A', STEEL = '#7A8494', STEEL_D = '#5E6775', WOOD = '#C8734A', WOOD_D = '#A65C38';

/** headset on the hero's head (the "manager"). Pass the hero's (x, y, s). */
export function headset(mx, my, s) {
  ctx.save(); ctx.translate(mx, my - 350 * s); ctx.scale(s, s);
  ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(0, 0, 126, Math.PI * 1.08, Math.PI * 1.92); ctx.strokeStyle = C.ink; ctx.lineWidth = 20; ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, 126, Math.PI * 1.08, Math.PI * 1.92); ctx.strokeStyle = STEEL_D; ctx.lineWidth = 10; ctx.stroke();
  for (const sd of [-1, 1]) { rr(sd * 118 - 22, -30, 44, 76, 18); ctx.fillStyle = C.ink; ctx.fill(); rr(sd * 118 - 14, -22, 28, 60, 12); ctx.fillStyle = C.red; ctx.fill(); }
  ctx.beginPath(); ctx.moveTo(-112, 30); ctx.quadraticCurveTo(-110, 96, -40, 92); ctx.strokeStyle = C.ink; ctx.lineWidth = 9; ctx.stroke();
  circle(-36, 92, 14, C.ink);
  ctx.restore();
}

/** clipboard with an order list. s = 1 → 180x240. ticks = how many rows are ticked */
export function clipboard(x, y, s, rot = 0, ticks = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-90, -120, 180, 240, 14); ctx.fillStyle = WOOD; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-72, -96, 144, 200, 8); ctx.fillStyle = C.white; ctx.fill();
  rr(-40, -136, 80, 34, 10); ctx.fillStyle = STEEL; ctx.fill(); ctx.stroke();
  for (let i = 0; i < 4; i++) { const yy = -60 + i * 44; line([[-20, yy], [52, yy]], '#C9C2B5', 10);
    if (i < ticks) { ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 9; ctx.strokeStyle = GREEN; ctx.beginPath(); ctx.moveTo(-54, yy); ctx.lineTo(-44, yy + 10); ctx.lineTo(-28, yy - 10); ctx.stroke(); }
    else circle(-42, yy, 8, '#C9C2B5'); }
  ctx.restore();
}

/** load balancer box: flat navy appliance with a "one in, three out" fan icon. s = 1 → 460x200, centred.
 *  pick = which output lights up yellow (0..2, -1 none), t blinks the LEDs */
export function lbBox(x, y, s, t = 0, pick = -1) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-230, -100, 460, 200, 30); ctx.fillStyle = C.navy; ctx.fill();
  rr(150, -100, 80, 200, [0, 30, 30, 0]); ctx.fillStyle = '#16263C'; ctx.fill();
  rr(-200, -72, 320, 144, 20); ctx.fillStyle = C.pants; ctx.fill();
  // fan icon: one line in, splitting into three arrows
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  line([[-170, 0], [-80, 0]], C.white, 14);
  for (let k = 0; k < 3; k++) {
    const ty = -46 + k * 46, col = k === pick ? C.yellow : C.white;
    ctx.beginPath(); ctx.moveTo(-80, 0); ctx.quadraticCurveTo(-20, 0, 50, ty); ctx.strokeStyle = col; ctx.lineWidth = 12; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(48, ty - 16); ctx.lineTo(80, ty); ctx.lineTo(48, ty + 16); ctx.closePath(); ctx.fillStyle = col; ctx.fill();
  }
  circle(-80, 0, 16, C.yellow);
  for (let i = 0; i < 3; i++) circle(190, -50 + i * 50, 13, Math.sin(t * 8 + i * 2) > -0.3 ? GREEN : '#2E5A37');
  ctx.restore();
}

/** kitchen swing door in a frame. s = 1 → 300x520, origin = bottom centre. open 0..1 swings the panel */
export function swingDoor(x, y, s, open = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-170, -540, 340, 540, [18, 18, 0, 0]); ctx.fillStyle = WOOD_D; ctx.fill();
  rr(-150, -520, 300, 520, [10, 10, 0, 0]); ctx.fillStyle = '#3B2A20'; ctx.fill();
  const w = 300 * lerp(1, 0.35, clamp(open));
  rr(-150, -520, w, 520, [10, 10, 0, 0]); ctx.fillStyle = WOOD; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  ell(-150 + w / 2, -360, w * 0.26, 56, '#CFE8F3'); ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(-150 + w / 2, -360, w * 0.26, 56, 0, 0, TAU); ctx.stroke();
  rr(-150 + w - 40, -260, 20, 70, 8); ctx.fillStyle = STEEL; ctx.fill();
  ctx.restore();
}

/** small round badge with a number (orders in a chef's queue). col = fill */
export function countBadge(x, y, r, n, col = C.red, sc = 1) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  circle(0, 0, r + 7, C.ink); circle(0, 0, r, col);
  ctx.fillStyle = C.white; ctx.font = `900 ${Math.round(r * 1.15)}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(n), 0, 3);
  ctx.restore();
}
