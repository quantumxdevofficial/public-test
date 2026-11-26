// (19/30) API gateway components (hotel / front-desk analogy). Flat look: flat fills, one darker shade, ink outlines.
// hotel (building with room windows + one front door; lit = rooms lit, door = yellow glow on the door), hallway (corridor of
// numbered room doors), frontDesk (receptionist behind a desk with a service bell; ding 0..1), idBadge (ID card; ok 0..1 =
// green tick), gateway (the A-P-I gate with a down 0..1 state: grey, cracked, sparks), knockLines (little impact marks).
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

const WOOD = '#C8734A', WOOD_D = '#A65C38', GREEN = '#5BAE6A', BLUE = '#3A7BD5', GREY = '#8E949E', GREY_D = '#5F646E';
const txt = (s, x, y, size, col = C.white, ls = 2) => { ctx.fillStyle = col; ctx.font = `900 ${size}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.letterSpacing = `${ls}px`; ctx.fillText(s, x, y); ctx.letterSpacing = '0px'; };

/** hotel building. s = 1 → 560 wide x ~800 tall centred on (x, y). lit = how many of the 16 room windows glow yellow
 *  (fractional pops). door 0..1 = yellow highlight ring around the front door. */
export function hotel(x, y, s, t = 0, lit = 0, door = 0, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc); ctx.lineJoin = 'round';
  rr(-280, -360, 560, 690, 18); ctx.fillStyle = '#F7F4EE'; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(200, -360, 80, 690, [0, 18, 18, 0]); ctx.fillStyle = '#E4DCCB'; ctx.fill();
  rr(-220, -470, 440, 100, 22); ctx.fillStyle = C.red; ctx.fill(); ctx.lineWidth = 8; ctx.stroke();
  txt('HOTEL', 0, -418, 70, C.white, 6);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    const i = r * 4 + c, wx = -195 + c * 130, wy = -300 + r * 115, p = clamp(lit - i);
    rr(wx - 40, wy - 38, 80, 76, 10); ctx.fillStyle = p > 0.5 ? C.yellow : '#CFE8F3'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
    line([[wx, wy - 38], [wx, wy + 38]], C.ink, 4);
  }
  // front door + awning
  const d = clamp(door);
  if (d > 0) { ctx.save(); ctx.globalAlpha = d; rr(-120, 150, 240, 200, 30); ctx.fillStyle = C.yellow; ctx.fill(); ctx.restore(); }
  rr(-80, 180, 160, 150, [14, 14, 0, 0]); ctx.fillStyle = WOOD; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  line([[0, 186], [0, 330]], C.ink, 5); circle(-18, 260, 8, C.ink); circle(18, 260, 8, C.ink);
  ctx.beginPath(); ctx.moveTo(-130, 175); ctx.lineTo(130, 175); ctx.lineTo(110, 135); ctx.lineTo(-110, 135); ctx.closePath(); ctx.fillStyle = C.red; ctx.fill(); ctx.lineWidth = 7; ctx.stroke();
  line([[-330, 332], [330, 332]], C.ink, 10);
  ctx.restore();
}

/** a hotel corridor with four numbered room doors. s = 1 → 1000 wide x 460 tall centred on (x, y). */
export function hallway(x, y, s, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  rr(-500, -230, 1000, 400, 0); ctx.fillStyle = '#F2E3C8'; ctx.fill();
  rr(-500, 170, 1000, 80, 0); ctx.fillStyle = '#B85C5C'; ctx.fill();
  line([[-500, 170], [500, 170]], C.ink, 8);
  const cols = [BLUE, GREEN, '#8A63D2', '#F29A3A'];
  for (let i = 0; i < 4; i++) {
    const dx = -375 + i * 250;
    rr(dx - 85, -170, 170, 340, [12, 12, 0, 0]); ctx.fillStyle = cols[i]; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
    rr(dx - 45, -140, 90, 44, 10); ctx.fillStyle = C.white; ctx.fill(); txt(String(101 + i), dx, -116, 34, C.ink, 1);
    circle(dx + 55, 10, 11, C.yellow);
  }
  ctx.restore();
}

/** hotel front desk: receptionist (blazer, red bow tie) behind a wooden desk with a FRONT DESK sign and a service bell.
 *  s = 1 → 640 wide; origin = desk top centre. ding 0..1 bounces the bell + ring lines. smile true by default. */
export function frontDesk(x, y, s, t = 0, ding = 0, point = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = 'round';
  // receptionist
  const bob = Math.sin(t * 3) * 3;
  ctx.save(); ctx.translate(-60, bob);
  rr(-95, -180, 190, 200, [60, 60, 0, 0]); ctx.fillStyle = C.navy; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-30, -180); ctx.lineTo(0, -120); ctx.lineTo(30, -180); ctx.closePath(); ctx.fillStyle = C.white; ctx.fill();
  ctx.beginPath(); ctx.moveTo(0, -165); ctx.lineTo(-30, -185); ctx.lineTo(-30, -145); ctx.closePath(); ctx.moveTo(0, -165); ctx.lineTo(30, -185); ctx.lineTo(30, -145); ctx.closePath(); ctx.fillStyle = C.red; ctx.fill();
  circle(0, -260, 72, C.skin); ell(0, -312, 74, 34, C.hair);
  circle(-24, -260, 8, C.ink); circle(24, -260, 8, C.ink); circle(-21, -263, 3, C.white); circle(27, -263, 3, C.white);
  ctx.beginPath(); ctx.arc(0, -236, 22, 0.15 * Math.PI, 0.85 * Math.PI); ctx.lineWidth = 7; ctx.strokeStyle = C.mouth; ctx.lineCap = 'round'; ctx.stroke();
  if (point > 0) { // arm pointing right
    const p = clamp(point); line([[60, -120], [lerp(80, 220, p), lerp(-60, -170, p)]], C.navy, 40); circle(lerp(80, 230, p), lerp(-60, -178, p), 22, C.skin);
  }
  ctx.restore();
  // desk
  rr(-320, -20, 640, 40, 10); ctx.fillStyle = WOOD_D; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-290, 20, 580, 230, [0, 0, 12, 12]); ctx.fillStyle = WOOD; ctx.fill(); ctx.stroke();
  rr(-200, 80, 400, 80, 18); ctx.fillStyle = C.navy; ctx.fill(); txt('FRONT DESK', 0, 122, 46, C.yellow, 3);
  // service bell
  const b = Math.sin(Math.PI * clamp(ding)) * 18;
  ctx.save(); ctx.translate(200, -20 - b);
  ell(0, 0, 70, 12, GREY_D); ctx.beginPath(); ctx.arc(0, -4, 54, Math.PI, 0); ctx.closePath(); ctx.fillStyle = '#C9CED6'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-8, -76, 16, 20, 4); ctx.fillStyle = C.ink; ctx.fill(); circle(0, -80, 12, C.ink);
  ell(-20, -30, 16, 8, C.white, -0.5);
  ctx.restore();
  if (ding > 0 && ding < 1) { ctx.save(); ctx.globalAlpha = 1 - ding; for (const an of [-2.3, -1.57, -0.85]) line([[200 + Math.cos(an) * 90, -60 + Math.sin(an) * 90], [200 + Math.cos(an) * 140, -60 + Math.sin(an) * 140]], C.ink, 10); ctx.restore(); }
  ctx.restore();
}

/** an ID card. s = 1 → 400x260 centred. ok 0..1 pops a green tick badge on the corner */
export function idBadge(x, y, s, ok = 0, sc = 1, rot = 0) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * sc, s * sc);
  rr(-200, -130, 400, 260, 26); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-200, -130, 400, 64, [26, 26, 0, 0]); ctx.fillStyle = BLUE; ctx.fill(); ctx.stroke();
  txt('ID', 0, -97, 44, C.white, 6);
  rr(-170, -40, 130, 140, 16); ctx.fillStyle = '#CFE8F3'; ctx.fill();
  circle(-105, 5, 32, C.skin); ell(-105, -20, 33, 16, C.hair); rr(-145, 42, 80, 58, [30, 30, 0, 0]); ctx.fillStyle = C.shirt; ctx.fill();
  line([[-10, -20], [160, -20]], '#C9C2B5', 16); line([[-10, 25], [130, 25]], '#C9C2B5', 16); line([[-10, 70], [100, 70]], '#C9C2B5', 16);
  const o = clamp(ok);
  if (o > 0) { ctx.save(); ctx.translate(170, -120); const k = o < 1 ? lerp(0, 1.15, o) : 1; ctx.scale(k, k); circle(0, 0, 62, C.ink); circle(0, 0, 54, GREEN);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 16; ctx.strokeStyle = C.white; ctx.beginPath(); ctx.moveTo(-24, 0); ctx.lineTo(-6, 18); ctx.lineTo(26, -18); ctx.stroke(); ctx.restore(); }
  ctx.restore();
}

/** the A-P-I gate (same shape as K.apiGate) with a broken state. lit = [a, p, i] 0..1; down 0..1 → grey, cracked, sparks.
 *  s = 1 → 480 wide, from y-330 (sign top) to y+320 (pillar feet). */
export function gateway(x, y, s, lit = [1, 1, 1], sc = 1, down = 0, t = 0) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  const dn = clamp(down) > 0.5, body = dn ? GREY_D : C.ink;
  rr(-200, -200, 70, 520, 18); ctx.fillStyle = body; ctx.fill(); rr(130, -200, 70, 520, 18); ctx.fill();
  rr(-240, -330, 480, 150, 30); ctx.fill();
  ['A', 'P', 'I'].forEach((L, i) => {
    const tx = -140 + i * 140, on = dn ? 0 : clamp(lit[i] || 0);
    rr(tx - 56, -310, 112, 112, 22); ctx.fillStyle = on > 0.5 ? C.yellow : (dn ? GREY : '#3A3A42'); ctx.fill();
    ctx.save(); ctx.translate(tx, -254); const p = 1 + 0.25 * Math.sin(Math.PI * clamp(on * 2 - 1)); ctx.scale(p, p);
    txt(L, 0, 4, 84, on > 0.5 ? C.ink : (dn ? '#C9CED6' : C.white), 0); ctx.restore();
  });
  if (dn) {
    line([[-60, -330], [-20, -270], [-70, -230], [-30, -180]], C.ink, 10);
    ctx.strokeStyle = C.yellow; ctx.lineCap = 'round'; ctx.lineWidth = 12;
    for (let i = 0; i < 5; i++) { const an = -Math.PI / 2 + (i - 2) * 0.45 + Math.sin(t * 20 + i) * 0.12, r0 = 360, r1 = 420 + 20 * Math.sin(t * 25 + i * 3);
      ctx.beginPath(); ctx.moveTo(Math.cos(an) * r0 * 0.6, Math.sin(an) * r0 - 30); ctx.lineTo(Math.cos(an) * r1 * 0.6, Math.sin(an) * r1 - 30); ctx.stroke(); }
  }
  ctx.restore();
}

/** short knock marks next to (x, y), pointing left (toward a door on the left). a 0..1 */
export function knockLines(x, y, s, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(a);
  for (const an of [-0.6, 0, 0.6]) line([[x + Math.cos(an) * 30 * s, y + Math.sin(an) * 30 * s], [x + Math.cos(an) * 80 * s, y + Math.sin(an) * 80 * s]], C.ink, 12 * s);
  ctx.restore();
}
