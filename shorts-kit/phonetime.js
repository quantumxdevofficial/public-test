// Inside Out: PHONE TIME components (How Does Your Phone Always Know the Exact Time?). Flat fills, one darker shade,
// one light highlight, ink outlines on graphics.
// quartzCrystal, crystalCan, atom, atomicClock, timeScreen, syncBadge2, tripArrow
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

const QZ = '#DDEBF3', QZ_D = '#B7CDDA', QZ_H = '#FFFFFF', STEEL = '#AEB7C4', STEEL_D = '#8C96A5', GREEN = '#3FAE5F', BLUE = '#3A7BD5';

/** tuning-fork quartz crystal (the shape inside a 32.768 kHz watch crystal). s = 1 → ~260 x 520.
 *  wob = prong swing in px (animate with Math.sin(t * 40) * amp) */
export function quartzCrystal(x, y, s, wob = 0, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc); ctx.lineJoin = 'round';
  const prong = (side) => {
    const dx = side * wob;
    ctx.beginPath(); ctx.moveTo(side * 30, 140); ctx.lineTo(side * 30 + dx * 0.3, -60); ctx.lineTo(side * 34 + dx, -250);
    ctx.lineTo(side * 120 + dx, -250); ctx.lineTo(side * 118 + dx * 0.3, -60); ctx.lineTo(side * 110, 140); ctx.closePath();
  };
  for (const sd of [-1, 1]) { prong(sd); ctx.fillStyle = QZ; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke(); }
  // base
  rr(-120, 120, 240, 140, 20); ctx.fillStyle = QZ; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-120, 200, 240, 60, [0, 0, 20, 20]); ctx.fillStyle = QZ_D; ctx.fill();
  // highlights
  for (const sd of [-1, 1]) { const dx = sd * wob; rr(sd * 60 + dx * 0.6 - 10, -230, 18, 180, 9); ctx.fillStyle = QZ_H; ctx.fill(); }
  // gold electrodes
  for (const sd of [-1, 1]) { const dx = sd * wob * 0.5; rr(sd * 75 + dx - 22, -150, 44, 150, 10); ctx.fillStyle = C.yellow; ctx.globalAlpha = 0.85; ctx.fill(); ctx.globalAlpha = 1; }
  // legs
  line([[-50, 260], [-50, 360]], STEEL_D, 14); line([[50, 260], [50, 360]], STEEL_D, 14);
  ctx.restore();
}
/** the tiny silver can a watch crystal lives in (closed). s = 1 → 120 x 320 */
export function crystalCan(x, y, s, rot = 0, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * sc, s * sc);
  rr(-60, -160, 120, 300, 60); ctx.fillStyle = STEEL; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(20, -150, 30, 280, 15); ctx.fillStyle = STEEL_D; ctx.fill();
  rr(-38, -130, 18, 200, 9); ctx.fillStyle = '#DDE3EA'; ctx.fill();
  line([[-22, 140], [-22, 220]], STEEL_D, 10); line([[22, 140], [22, 220]], STEEL_D, 10);
  ctx.restore();
}
/** a cesium atom: red/pink nucleus + 3 orbits with electrons. t spins electrons; glow 0..1 adds a yellow halo */
export function atom(x, y, s, t = 0, glow = 0, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  if (glow > 0) { ctx.globalAlpha = 0.35 * glow; circle(0, 0, 330, C.yellow); ctx.globalAlpha = 1; }
  const orbs = [0, TAU / 3, 2 * TAU / 3];
  ctx.lineWidth = 14; ctx.strokeStyle = BLUE;
  for (const r of orbs) { ctx.beginPath(); ctx.ellipse(0, 0, 270, 90, r, 0, TAU); ctx.stroke(); }
  // nucleus cluster
  const N = [[0, 0, C.red], [-34, -22, C.pink], [32, -26, C.red], [-30, 30, C.red], [34, 26, C.pink], [0, -46, C.pink], [2, 44, C.pink]];
  for (const [nx, ny, col] of N) { circle(nx, ny, 34, C.pinkDark); circle(nx - 3, ny - 3, 30, col); circle(nx - 12, ny - 12, 8, C.pinkLight); }
  orbs.forEach((r, k) => {
    const a = t * (5 + k) + k * 2;
    const ex = Math.cos(a) * 270, ey = Math.sin(a) * 90;
    const px = ex * Math.cos(r) - ey * Math.sin(r), py = ex * Math.sin(r) + ey * Math.cos(r);
    circle(px, py, 30, C.ink); circle(px, py, 22, C.yellow);
  });
  ctx.restore();
}
/** a tall lab atomic clock (cesium fountain column). s = 1 → 300 x 760, base at y + 380. glow 0..1 lights the window */
export function atomicClock(x, y, s, t = 0, glow = 1, label = 'CS') {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-170, 300, 340, 80, 16); ctx.fillStyle = C.pants; ctx.fill();
  rr(-110, -380, 220, 690, 110); ctx.fillStyle = STEEL; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(40, -360, 50, 650, 25); ctx.fillStyle = STEEL_D; ctx.fill();
  rr(-80, -340, 26, 400, 13); ctx.fillStyle = '#DDE3EA'; ctx.fill();
  for (const ry of [-200, 0, 180]) { rr(-124, ry, 248, 30, 12); ctx.fillStyle = STEEL_D; ctx.fill(); ctx.lineWidth = 6; ctx.stroke(); }
  // window with a bouncing atom cloud
  rr(-70, -140, 140, 120, 30); ctx.fillStyle = C.navy; ctx.fill(); ctx.lineWidth = 8; ctx.stroke();
  ctx.save(); rr(-70, -140, 140, 120, 30); ctx.clip();
  const by = -80 + Math.sin(t * 3) * 26;
  ctx.globalAlpha = 0.5 + 0.5 * glow; for (let k = 0; k < 7; k++) circle(Math.cos(k * 2.1 + t) * 26, by + Math.sin(k * 1.7) * 14, 9, C.yellow); ctx.globalAlpha = 1;
  ctx.restore();
  // label plate
  rr(-60, 70, 120, 80, 16); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.font = '900 52px Inter'; ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, 112);
  ctx.restore();
}
/** phone() screen: big clock digits. time = '9:41', sec = '07' (or null), sub = line under it, synced 0..1 shows a green tick row */
export const timeScreen = (time = '9:41', sec = null, sub = 'Monday', synced = 0, col = '#3A5A8C') => () => {
  ctx.fillStyle = col; ctx.fillRect(-166, -350, 332, 700);
  circle(110, 260, 190, 'rgba(255,255,255,0.08)'); circle(-130, -260, 120, 'rgba(255,255,255,0.06)');
  ctx.fillStyle = C.white; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = '900 104px Inter'; ctx.fillText(time, 0, -170);
  if (sec !== null) { rr(-70, -100, 140, 64, 32); ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fill(); ctx.font = '900 44px Inter'; ctx.fillStyle = C.white; ctx.fillText(':' + sec, 0, -67); }
  ctx.font = '600 28px Inter'; ctx.fillStyle = C.white; ctx.fillText(sub, 0, sec !== null ? -2 : -90);
  if (synced > 0) {
    ctx.save(); ctx.globalAlpha = clamp(synced);
    rr(-140, 140, 280, 84, 42); ctx.fillStyle = GREEN; ctx.fill();
    ctx.lineWidth = 9; ctx.strokeStyle = C.white; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(-104, 182); ctx.lineTo(-88, 198); ctx.lineTo(-62, 164); ctx.stroke();
    ctx.font = '900 34px Inter'; ctx.fillStyle = C.white; ctx.fillText('SYNCED', 22, 183);
    ctx.restore();
  }
};
/** a straight arrow with a head from (x1,y1) to (x2,y2), drawn up to p 0..1. col, w */
export function tripArrow(x1, y1, x2, y2, p = 1, col = C.ink, w = 14) {
  if (p <= 0) return;
  const ex = lerp(x1, x2, p), ey = lerp(y1, y2, p), a = Math.atan2(y2 - y1, x2 - x1);
  ctx.save(); ctx.lineCap = 'round'; line([[x1, y1], [ex, ey]], col, w);
  ctx.translate(ex, ey); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(-34, -26); ctx.lineTo(-34, 26); ctx.closePath(); ctx.fillStyle = col; ctx.fill();
  ctx.restore();
}
/** ink counter box that grows to fit its text (big yellow digits + small white label). s = 1 → 220 tall */
export function wideCounter(x, y, s, text, label = '', col = C.yellow) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.font = '900 96px Inter, sans-serif'; const tw = ctx.measureText(String(text)).width;
  ctx.font = '900 40px Inter, sans-serif'; const lw = ctx.measureText(label).width;
  const w = Math.max(380, tw + 80, lw + 80);
  rr(-w / 2, -110, w, 220, 34); ctx.fillStyle = C.ink; ctx.fill();
  rr(-w / 2 + 20, -92, w - 40, 130, 22); ctx.fillStyle = '#2A2F3A'; ctx.fill();
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = '900 96px Inter, sans-serif'; ctx.fillStyle = col; ctx.fillText(String(text), 0, -26);
  if (label) { ctx.font = '900 40px Inter, sans-serif'; ctx.fillStyle = C.white; ctx.fillText(label, 0, 76); }
  ctx.restore();
}
