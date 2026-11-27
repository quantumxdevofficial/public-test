// Airplane mode components (What Does Airplane Mode Actually Do?). Same flat Inside Out look:
// flat fills, one darker shade, one light highlight, ink outlines only on graphics.
// cellTower, signalBars, controlCenter, ccScreen, jetSide, hills, buzzZig, antennaGlow
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

const STEEL = '#7A8494', STEEL_D = '#5E6775', PANEL = '#E9ECF1', ORANGE = '#F29A3A', GREEN = '#5BAE6A', BLUE = '#3A7BD5';
const HILL = '#8CCB7E', HILL_D = '#6FB262';
export const AIR_ORANGE = ORANGE, CELL_GREEN = GREEN, AIR_BLUE = BLUE;

/** cell tower: steel lattice mast with three white antenna panels and a red top light.
 *  s = 1 → ~260 wide, 700 tall; (x, y) = base centre. lit 0..1 glows the panels yellow */
export function cellTower(x, y, s, lit = 0, t = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineCap = 'round';
  // legs
  line([[-110, 0], [-26, -620]], STEEL_D, 18); line([[110, 0], [26, -620]], STEEL_D, 18);
  // cross bracing
  for (let k = 0; k < 6; k++) {
    const y0 = -k * 100, y1 = -(k + 1) * 100, w0 = lerp(110, 26, k / 6.2), w1 = lerp(110, 26, (k + 1) / 6.2);
    line([[-w0, y0], [w1, y1]], STEEL, 9); line([[w0, y0], [-w1, y1]], STEEL, 9); line([[-w1, y1], [w1, y1]], STEEL, 9);
  }
  // antenna panels
  for (const sx of [-1, 0, 1]) {
    rr(sx * 62 - 20, -700, 40, 120, 10); ctx.fillStyle = C.ink; ctx.fill();
    rr(sx * 62 - 14, -694, 28, 108, 7); ctx.fillStyle = lit > 0 ? `rgba(255,212,59,${0.35 + 0.65 * lit})` : PANEL; ctx.fill();
    if (!(lit > 0)) { rr(sx * 62 - 14, -694, 28, 108, 7); ctx.fillStyle = PANEL; ctx.fill(); }
  }
  line([[0, -700], [0, -770]], C.ink, 10);
  circle(0, -778, 16, Math.sin(t * 5) > -0.2 ? C.red : '#8E1B26');
  // base block
  rr(-130, -24, 260, 40, 10); ctx.fillStyle = STEEL_D; ctx.fill();
  ctx.restore();
}
/** tower top (where waves come from) for a tower drawn at (x, y, s) */
export const towerTop = (x, y, s) => [x, y - 640 * s];

/** 4 signal bars (status bar style). n = how many lit; col = lit colour. s = 1 → 120x90 */
export function signalBars(x, y, s, n = 4, col = C.ink, dim = '#C9CFDA') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (let i = 0; i < 4; i++) { const h = 24 + i * 20; rr(-60 + i * 32, 45 - h, 22, h, 6); ctx.fillStyle = i < n ? col : dim; ctx.fill(); }
  ctx.restore();
}

/** one round control-centre button (r = 62). on 0..1 blends from grey to col; icon = 'plane'|'cell'|'wifi'|'bt' */
function ccButton(x, y, on, col, icon, cross = 0) {
  const off = '#3A3F4B';
  circle(x, y, 64, on > 0.5 ? col : off);
  if (on > 0 && on < 1) { ctx.save(); ctx.globalAlpha = on; circle(x, y, 64, col); ctx.restore(); }
  const fg = C.white;
  ctx.save(); ctx.translate(x, y); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (icon === 'plane') {
    ctx.rotate(-Math.PI / 4); ctx.fillStyle = fg;
    rr(-40, -7, 80, 14, 7); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-4, -6); ctx.lineTo(-24, -40); ctx.lineTo(-12, -40); ctx.lineTo(18, -6); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-4, 6); ctx.lineTo(-24, 40); ctx.lineTo(-12, 40); ctx.lineTo(18, 6); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-34, -5); ctx.lineTo(-44, -22); ctx.lineTo(-36, -22); ctx.lineTo(-26, -5); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-34, 5); ctx.lineTo(-44, 22); ctx.lineTo(-36, 22); ctx.lineTo(-26, 5); ctx.closePath(); ctx.fill();
  } else if (icon === 'cell') {
    line([[0, 34], [0, -26]], fg, 9);
    for (const r of [22, 38]) { ctx.beginPath(); ctx.arc(0, -16, r, -Math.PI * 0.85, -Math.PI * 0.15); ctx.strokeStyle = fg; ctx.lineWidth = 7; ctx.stroke(); }
  } else if (icon === 'wifi') {
    circle(0, 26, 8, fg);
    for (const r of [24, 44]) { ctx.beginPath(); ctx.arc(0, 30, r, -Math.PI * 0.78, -Math.PI * 0.22); ctx.strokeStyle = fg; ctx.lineWidth = 8; ctx.stroke(); }
  } else if (icon === 'bt') {
    ctx.beginPath(); ctx.moveTo(-16, -16); ctx.lineTo(18, 14); ctx.lineTo(0, 32); ctx.lineTo(0, -32); ctx.lineTo(18, -14); ctx.lineTo(-16, 16);
    ctx.strokeStyle = fg; ctx.lineWidth = 8; ctx.stroke();
  }
  ctx.restore();
  if (cross > 0) { ctx.save(); ctx.globalAlpha = cross; line([[x - 40, y + 40], [x + 40, y - 40]], C.red, 12); ctx.restore(); }
}
/** control-centre tile with 4 buttons (plane, cell, wifi, bt). s = 1 → 330x330 card.
 *  o = { plane, cell, wifi, bt } each 0..1 (1 = on), crossCell 0..1 draws a red slash on the cell button */
export function controlCenter(x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-165, -165, 330, 330, 54); ctx.fillStyle = '#23262E'; ctx.fill();
  ccButton(-72, -72, o.plane ?? 0, ORANGE, 'plane');
  ccButton(72, -72, o.cell ?? 1, GREEN, 'cell', o.crossCell || 0);
  ccButton(-72, 72, o.wifi ?? 1, BLUE, 'wifi');
  ccButton(72, 72, o.bt ?? 1, BLUE, 'bt');
  ctx.restore();
}
/** a phone screen (for K.phone) showing the status bar + control centre. o as controlCenter + bars (0..4) */
export function ccScreen(o = {}) {
  ctx.fillStyle = '#5A6378'; ctx.fillRect(-166, -350, 332, 700);
  ctx.fillStyle = C.white; ctx.font = '900 30px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('9:41', -130, -300);
  if ((o.plane ?? 0) > 0.5) { ctx.save(); ctx.translate(90, -300); ctx.rotate(-Math.PI / 4); ctx.fillStyle = C.white; rr(-18, -4, 36, 8, 4); ctx.fill(); ctx.beginPath(); ctx.moveTo(-2, 0); ctx.lineTo(-12, -20); ctx.lineTo(8, 0); ctx.lineTo(-12, 20); ctx.closePath(); ctx.fill(); ctx.restore(); }
  else signalBars(90, -306, 0.38, o.bars ?? 4, C.white, 'rgba(255,255,255,0.3)');
  controlCenter(0, -40, 0.9, o);
  rr(-140, 150, 280, 90, 30); ctx.fillStyle = '#23262E'; ctx.fill();
  rr(-140, 260, 130, 60, 22); ctx.fill(); rr(10, 260, 130, 60, 22); ctx.fill();
}

/** side-view airliner pointing right. s = 1 → ~760 long; (x, y) = fuselage centre */
export function jetSide(x, y, s, t = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // far wing
  ctx.beginPath(); ctx.moveTo(-40, -10); ctx.lineTo(-170, -70); ctx.lineTo(-120, -70); ctx.lineTo(60, -10); ctx.closePath(); ctx.fillStyle = '#C9CFDA'; ctx.fill();
  // tail fin
  ctx.beginPath(); ctx.moveTo(-300, -30); ctx.lineTo(-370, -190); ctx.lineTo(-310, -190); ctx.lineTo(-200, -40); ctx.closePath(); ctx.fillStyle = BLUE; ctx.fill();
  // body
  ctx.beginPath(); ctx.moveTo(-380, -40); ctx.lineTo(260, -56); ctx.quadraticCurveTo(380, -50, 390, 6); ctx.quadraticCurveTo(380, 56, 250, 56); ctx.lineTo(-300, 50); ctx.quadraticCurveTo(-360, 40, -380, -40); ctx.closePath();
  ctx.fillStyle = C.white; ctx.fill();
  ctx.save(); ctx.clip(); ctx.fillStyle = '#DCE1E8'; ctx.fillRect(-400, 22, 820, 50); ctx.fillStyle = BLUE; ctx.fillRect(-400, 6, 820, 12); ctx.restore();
  // windows + cockpit
  for (let i = 0; i < 13; i++) rr(-250 + i * 38, -26, 20, 24, 8), ctx.fillStyle = '#2A3142', ctx.fill();
  ctx.beginPath(); ctx.moveTo(318, -36); ctx.lineTo(360, -30); ctx.lineTo(372, -10); ctx.lineTo(322, -14); ctx.closePath(); ctx.fillStyle = '#2A3142'; ctx.fill();
  // near wing + engine
  ctx.beginPath(); ctx.moveTo(-30, 20); ctx.lineTo(-160, 130); ctx.lineTo(-100, 130); ctx.lineTo(90, 26); ctx.closePath(); ctx.fillStyle = '#AEB7C4'; ctx.fill();
  rr(-40, 60, 120, 52, 26); ctx.fillStyle = STEEL; ctx.fill(); ell(-36, 86, 12, 24, '#2A3142');
  ctx.restore();
}

/** rolling green hills along y (top edge), filling down past the screen */
export function hills(y, off = 0) {
  ctx.fillStyle = HILL_D; ctx.beginPath(); ctx.moveTo(-300, 2300);
  for (let x = -300; x <= 1380; x += 20) ctx.lineTo(x, y + 40 + Math.sin((x + off) * 0.006) * 40); ctx.lineTo(1380, 2300); ctx.closePath(); ctx.fill();
  ctx.fillStyle = HILL; ctx.beginPath(); ctx.moveTo(-300, 2300);
  for (let x = -300; x <= 1380; x += 20) ctx.lineTo(x, y + 90 + Math.sin((x + off) * 0.009 + 1.5) * 30); ctx.lineTo(1380, 2300); ctx.closePath(); ctx.fill();
}

/** red zig-zag "buzz" lines around a point (ears). a = alpha, t jitters them */
export function buzzZig(x, y, r, a = 1, t = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = C.red; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const an of [-0.5, 0, 0.5]) {
    const j = Math.sin(t * 40 + an * 9) * 6;
    ctx.save(); ctx.translate(x, y); ctx.rotate(an);
    ctx.beginPath(); ctx.moveTo(r, j); for (let k = 1; k <= 4; k++) ctx.lineTo(r + k * 22, (k % 2 ? -16 : 16) + j); ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}
