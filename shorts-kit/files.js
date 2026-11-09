// Inside Out tech kit: deleted files (trash can, storage block grid with a photo spread over blocks,
// table of contents card, hard drive, SSD, broom, recovery-app screen). Flat look, ink outlines on graphics.
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';
const GREEN = '#5BAE6A', BLUE = '#3A7BD5', STEEL = '#9AA1AE', STEEL_D = '#7C8391';
const MONO = "'DejaVu Sans Mono', monospace";
export const FILE_COLS = ['#F29A3A', '#E57A8A', '#5BAE6A', '#3A7BD5', '#B07CD8'];

/** trash can. s = 1 → ~260 wide, ~340 tall, origin = centre. lid 0..1 opens, n = papers sticking out, shake = x wobble */
export function trashCan(x, y, s, lid = 0, n = 0, shake = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x + shake, y); ctx.scale(s, s); ctx.lineJoin = 'round';
  for (let i = 0; i < n; i++) { ctx.save(); ctx.translate(-60 + i * 55, -120); ctx.rotate(-0.3 + i * 0.25); rr(-35, -60, 70, 90, 8); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.restore(); }
  ctx.beginPath(); ctx.moveTo(-120, -110); ctx.lineTo(120, -110); ctx.lineTo(95, 170); ctx.lineTo(-95, 170); ctx.closePath();
  ctx.fillStyle = STEEL; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.save(); ctx.clip(); ctx.fillStyle = STEEL_D; ctx.fillRect(50, -120, 90, 300); ctx.restore();
  for (const dx of [-50, 0, 50]) line([[dx, -70], [dx * 0.85, 130]], C.ink, 8);
  ctx.save(); ctx.translate(-130, -120); ctx.rotate(-lid * 1.2);
  rr(0, -30, 260, 34, 12); ctx.fillStyle = STEEL; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(100, -62, 60, 32, [12, 12, 0, 0]); ctx.fill(); ctx.stroke();
  ctx.restore();
  ctx.restore();
}

/** the photo scene (sky, sun, hills) in a w x h box with top-left at 0,0 */
function scene(w, h) {
  ctx.fillStyle = C.sky; ctx.fillRect(0, 0, w, h);
  circle(w * 0.74, h * 0.28, h * 0.14, C.yellow);
  ctx.fillStyle = GREEN; ctx.beginPath(); ctx.moveTo(0, h); ctx.lineTo(w * 0.32, h * 0.42); ctx.lineTo(w * 0.58, h * 0.76); ctx.lineTo(w * 0.76, h * 0.56); ctx.lineTo(w, h); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#3F8A4E'; ctx.beginPath(); ctx.moveTo(w * 0.32, h * 0.42); ctx.lineTo(w * 0.44, h * 0.62); ctx.lineTo(w * 0.24, h); ctx.lineTo(0, h); ctx.closePath(); ctx.fill();
}

/** storage blocks. Grid centred at x, y; cols x rows cells of `cell` px.
 *  o.photo = [c0, r0, pw, ph] cells that hold the photo (drawn as one picture cut into tiles)
 *  o.files = { idx: colourIndex } other files · o.free 0..1 green dashed FREE outline on photo cells
 *  o.over = number of photo tiles overwritten (row-major), o.overP 0..1 drop-in of the newest, o.overCols colours
 *  o.wipe 0..1 photo tiles cleared to blank (left to right) · o.glow 0..1 yellow ring around photo tiles · o.fade photo alpha */
export function blockGrid(x, y, cols, rows, cell, o = {}) {
  const W0 = cols * cell, H0 = rows * cell, gx = x - W0 / 2, gy = y - H0 / 2, pad = 6;
  rr(gx - 26, gy - 26, W0 + 52, H0 + 52, 30); ctx.fillStyle = C.navy; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  const [c0, r0, pw, ph] = o.photo || [-1, -1, 0, 0];
  const inPhoto = (c, r) => c >= c0 && c < c0 + pw && r >= r0 && r < r0 + ph;
  const pIdx = (c, r) => (r - r0) * pw + (c - c0);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const cx = gx + c * cell + pad, cy = gy + r * cell + pad, s = cell - pad * 2, idx = r * cols + c;
    rr(cx, cy, s, s, 10); ctx.fillStyle = '#26344D'; ctx.fill();
    const fc = o.files && o.files[idx];
    if (fc != null) { rr(cx, cy, s, s, 10); ctx.fillStyle = FILE_COLS[fc % FILE_COLS.length]; ctx.fill(); continue; }
    if (!inPhoto(c, r)) continue;
    const k = pIdx(c, r), n = pw * ph;
    const wiped = ((c - c0) + 0.5) / pw < (o.wipe || 0);
    const over = o.over || 0;
    if (wiped) continue;
    if (k < Math.floor(over) || (k === Math.floor(over) && (o.overP || 0) > 0 && over > k)) continue;
    ctx.save(); ctx.globalAlpha *= (o.fade == null ? 1 : o.fade);
    rr(cx, cy, s, s, 10); ctx.clip();
    ctx.translate(gx + c0 * cell, gy + r0 * cell); scene(pw * cell, ph * cell);
    ctx.restore();
  }
  // overwritten tiles (drawn on top, newest drops in)
  const over = o.over || 0, cols2 = o.overCols || FILE_COLS;
  for (let k = 0; k < Math.ceil(over) && k < pw * ph; k++) {
    const c = c0 + (k % pw), r = r0 + Math.floor(k / pw);
    const cx = gx + c * cell + pad, cy = gy + r * cell + pad, s = cell - pad * 2;
    const p = k < Math.floor(over) ? 1 : clamp(over - k);
    if (p <= 0) continue;
    const dy = (1 - p) * -150;
    ctx.save(); ctx.globalAlpha *= clamp(p * 3);
    rr(cx, cy + dy, s, s, 10); ctx.fillStyle = cols2[(k * 3 + 1) % cols2.length]; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.stroke();
    ctx.restore();
  }
  if (pw && (o.free || 0) > 0) {
    ctx.save(); ctx.globalAlpha *= o.free; ctx.setLineDash([22, 14]); ctx.lineDashOffset = -(o.t || 0) * 60;
    rr(gx + c0 * cell + 2, gy + r0 * cell + 2, pw * cell - 4, ph * cell - 4, 14); ctx.lineWidth = 10; ctx.strokeStyle = GREEN; ctx.stroke();
    ctx.restore();
  }
  if (pw && (o.glow || 0) > 0) {
    ctx.save(); ctx.globalAlpha *= o.glow;
    rr(gx + c0 * cell - 6, gy + r0 * cell - 6, pw * cell + 12, ph * cell + 12, 18); ctx.lineWidth = 14; ctx.strokeStyle = C.yellow; ctx.stroke();
    ctx.restore();
  }
}
/** centre of the photo region of a blockGrid drawn with the same args */
export const gridRegion = (x, y, cols, rows, cell, [c0, r0, pw, ph]) => {
  const gx = x - cols * cell / 2, gy = y - rows * cell / 2;
  return [gx + (c0 + pw / 2) * cell, gy + (r0 + ph / 2) * cell, pw * cell, ph * cell];
};

/** table of contents card. rows = [[name, where, colourIdx]], o.hi row highlighted (0..1 o.hiP),
 *  o.strike row index struck with o.strikeP 0..1, o.gone 0..1 that row fades & collapses, title on top */
export function tocCard(x, y, s, rows, o = {}) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const rowH = 96, h = 100 + rows.length * rowH + 20;
  rr(-360, 0, 720, h, 30); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-360, 0, 720, 96, [30, 30, 0, 0]); ctx.fillStyle = C.ink; ctx.fill();
  ctx.fillStyle = C.white; ctx.font = '900 38px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(o.title || 'TABLE OF CONTENTS', 0, 50);
  rows.forEach(([name, where, ci], i) => {
    const ry = 100 + i * rowH + rowH / 2 + 10;
    let a = 1;
    if (o.strike === i) a = 1 - (o.gone || 0);
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a;
    if (o.hi === i && (o.hiP || 0) > 0) { ctx.globalAlpha *= o.hiP; rr(-340, ry - 42, 680, 84, 18); ctx.fillStyle = 'rgba(255,212,59,0.55)'; ctx.fill(); ctx.globalAlpha /= o.hiP; }
    rr(-320, ry - 24, 48, 48, 10); ctx.fillStyle = FILE_COLS[ci % FILE_COLS.length]; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.stroke();
    ctx.fillStyle = C.ink; ctx.font = '900 42px Inter'; ctx.textAlign = 'left'; ctx.fillText(name, -250, ry + 2);
    ctx.font = `700 38px ${MONO}`; ctx.fillStyle = BLUE; ctx.textAlign = 'right'; ctx.fillText(where, 330, ry + 2);
    if (o.strike === i && (o.strikeP || 0) > 0) line([[-335, ry], [lerp(-335, 335, clamp(o.strikeP)), ry]], C.red, 14);
    ctx.restore();
  });
  ctx.restore();
}

/** hard drive (top view, cover off). s = 1 → 420x560, origin = centre; t spins the platter, arm 0..1 swings */
export function hardDrive(x, y, s, t = 0, arm = 0.3) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-210, -280, 420, 560, 34); ctx.fillStyle = STEEL; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  for (const [sx, sy] of [[-180, -250], [180, -250], [-180, 250], [180, 250]]) circle(sx, sy, 12, STEEL_D);
  circle(0, -60, 165, '#C9CDD6'); ctx.beginPath(); ctx.arc(0, -60, 165, 0, TAU); ctx.stroke();
  for (const r of [130, 95]) { ctx.beginPath(); ctx.arc(0, -60, r, t * 3, t * 3 + 4.5); ctx.lineWidth = 6; ctx.strokeStyle = '#E2E5EA'; ctx.stroke(); }
  circle(0, -60, 44, STEEL_D); circle(0, -60, 18, C.ink);
  ctx.save(); ctx.translate(130, 180); ctx.rotate(-2.0 - arm * 0.6);
  rr(-14, -14, 230, 28, 12); ctx.fillStyle = C.ink; ctx.fill(); circle(210, 0, 16, C.yellow);
  ctx.restore();
  circle(130, 180, 36, C.ink); circle(130, 180, 14, STEEL);
  ctx.restore();
}

/** SSD stick (M.2). s = 1 → 640x200, origin = centre */
export function ssd(x, y, s, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-320, -100, 640, 200, 16); ctx.fillStyle = '#2E7D4F'; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  for (let i = 0; i < 9; i++) { ctx.fillStyle = C.yellow; ctx.fillRect(-312, -82 + i * 19, 22, 10); }
  for (const cx of [-180, -20, 140]) { rr(cx - 62, -66, 124, 132, 10); ctx.fillStyle = C.ink; ctx.fill(); rr(cx - 50, -54, 40, 16, 4); ctx.fillStyle = '#3A3A44'; ctx.fill(); }
  ell(270, 0, 22, 22, C.bg); ctx.beginPath(); ctx.arc(270, 0, 22, 0, TAU); ctx.lineWidth = 6; ctx.stroke();
  ctx.fillStyle = C.white; ctx.font = '900 34px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('SSD', -20, 82);
  ctx.restore();
}

/** broom. s = 1 → ~520 long, origin = bristle centre, rot tilts */
export function broom(x, y, s, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.lineJoin = 'round';
  rr(-12, -420, 24, 380, 10); ctx.fillStyle = '#C8734A'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-60, -60, 120, 40, 10); ctx.fillStyle = C.red; ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-60, -20); ctx.lineTo(60, -20); ctx.lineTo(95, 100); ctx.lineTo(-95, 100); ctx.closePath(); ctx.fillStyle = C.yellow; ctx.fill(); ctx.stroke();
  for (const dx of [-45, -15, 15, 45]) line([[dx * 0.8, -10], [dx * 1.4, 92]], '#E6B82E', 6);
  ctx.restore();
}

/** recovery app screen for laptop(): scanning bar p 0..1, found = number of files found (-1 = still scanning), none = 0 found in red */
export function recoveryScreen(p = 0, found = -1, t = 0) {
  ctx.fillStyle = '#1F2A44'; ctx.fillRect(-300, -180, 600, 360);
  ctx.fillStyle = C.white; ctx.font = '900 34px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('FILE RECOVERY', 0, -130);
  rr(-230, -70, 460, 34, 17); ctx.fillStyle = '#34425E'; ctx.fill();
  if (p > 0) { rr(-230, -70, 460 * clamp(p), 34, 17); ctx.fillStyle = found === 0 ? C.red : GREEN; ctx.fill(); }
  ctx.font = `700 30px ${MONO}`; ctx.fillStyle = '#C9D6DE';
  ctx.fillText(found < 0 ? 'SCANNING' + '.'.repeat(1 + Math.floor(t * 4) % 3) : found === 0 ? '0 FILES FOUND' : `FOUND: photo.jpg`, 0, 10);
  if (found === 0) { ctx.fillStyle = C.red; ctx.font = '900 40px Inter'; ctx.fillText('NOTHING LEFT', 0, 90); }
  else if (found > 0) { ctx.fillStyle = GREEN; ctx.font = '900 40px Inter'; ctx.fillText('RESTORED', 0, 90); }
}
