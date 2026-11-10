// Inside Out: BUG-STORY components (cartoon beetle "bug", moth, relay-computer wall, open logbook with taped moth,
// old paper letter with lightbulb, shop/cart phone screen, museum frame). Flat fills, one darker shade, one light
// highlight, ink outlines only on graphics/cards. No real people drawn.
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

const GREEN = '#5BAE6A', BLUE = '#3A7BD5', PAPER = '#F6EBCF', PAPER_D = '#E2D2AA', BROWN = '#8A6A4A', BROWN_D = '#6E523A';

/** cartoon software bug (green beetle with eyes). s = 1 → ~120 px body. t animates legs, rot = heading (0 = facing up) */
export function beetle(x, y, s, t = 0, rot = 0, col = GREEN) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.strokeStyle = C.ink; ctx.lineWidth = 8; ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) for (const sd of [-1, 1]) {
    const w = Math.sin(t * 18 + i * 2 + (sd > 0 ? 1.5 : 0)) * 0.25;
    ctx.beginPath(); ctx.moveTo(sd * 40, -20 + i * 30); ctx.lineTo(sd * 78, -34 + i * 34 + w * 30); ctx.stroke();
  }
  for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sd * 14, -70); ctx.quadraticCurveTo(sd * 30, -110, sd * 46, -112); ctx.stroke(); circle(sd * 46, -112, 7, C.ink); }
  ell(0, 10, 52, 62, C.ink); ell(0, 10, 46, 56, col);
  ctx.beginPath(); ctx.moveTo(0, -40); ctx.lineTo(0, 64); ctx.lineWidth = 6; ctx.stroke();
  ell(-18, -10, 12, 22, 'rgba(255,255,255,0.35)', 0.2);
  ell(0, -52, 34, 26, C.ink);
  circle(-13, -56, 10, C.white); circle(13, -56, 10, C.white); circle(-11, -57, 5, C.ink); circle(15, -57, 5, C.ink);
  ctx.restore();
}

/** moth (soft grey-brown wings). flap 0..1 folds the wings in, s = 1 → ~260 px wide */
export function moth(x, y, s, flap = 0, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  const k = 1 - flap * 0.6;
  for (const sd of [-1, 1]) {
    ctx.save(); ctx.scale(sd * k, 1);
    ctx.beginPath(); ctx.moveTo(6, -30); ctx.bezierCurveTo(80, -110, 150, -70, 130, -10); ctx.bezierCurveTo(115, 20, 50, 15, 6, 6); ctx.closePath();
    ctx.fillStyle = '#9C8A74'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(6, 6); ctx.bezierCurveTo(60, 20, 100, 50, 80, 85); ctx.bezierCurveTo(60, 105, 20, 60, 6, 26); ctx.closePath();
    ctx.fillStyle = '#7D6C58'; ctx.fill(); ctx.stroke();
    circle(85, -45, 13, '#C9B79C'); circle(52, 50, 9, '#C9B79C');
    ctx.restore();
  }
  ell(0, 10, 13, 52, C.ink); ell(0, 8, 9, 46, '#5E4E3E');
  ctx.strokeStyle = C.ink; ctx.lineWidth = 5; ctx.lineCap = 'round';
  for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sd * 4, -38); ctx.quadraticCurveTo(sd * 22, -80, sd * 44, -86); ctx.stroke(); }
  ctx.restore();
}

/** a wall of 1940s relay computer panels (cabinets of little relays + blinking lamps). origin = centre, 900x900 at s = 1.
 *  hole: [col, row] relay slot drawn open/empty (for the moth), or null */
export function relayWall(x, y, s, t = 0, hole = null) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (let p = 0; p < 3; p++) {
    const px = -450 + p * 300;
    rr(px + 8, -450, 284, 900, 18); ctx.fillStyle = '#4A5568'; ctx.fill();
    rr(px + 8, -450, 284, 40, [18, 18, 0, 0]); ctx.fillStyle = '#3A4252'; ctx.fill();
    for (let r = 0; r < 9; r++) for (let c = 0; c < 4; c++) {
      const rx = px + 30 + c * 64, ry = -390 + r * 88;
      const isHole = hole && hole[0] === p * 4 + c && hole[1] === r;
      rr(rx, ry, 52, 70, 8); ctx.fillStyle = isHole ? '#1A1F2A' : '#C9CDD6'; ctx.fill();
      if (!isHole) { rr(rx + 6, ry + 6, 40, 22, 5); ctx.fillStyle = '#9AA1AE'; ctx.fill(); }
      const on = Math.sin(t * 6 + (p * 4 + c) * 1.7 + r * 2.3) > 0.4;
      circle(rx + 26, ry + 52, 8, on ? C.yellow : '#7A6A2A');
    }
  }
  ctx.restore();
}
/** canvas coords of a relay slot centre in a relayWall(x, y, s) */
export const relaySlot = (x, y, s, col, row) => {
  const p = Math.floor(col / 4), c = col % 4;
  return [x + (-450 + p * 300 + 30 + c * 64 + 26) * s, y + (-390 + row * 88 + 35) * s];
};

/** strip of clear tape. s = 1 → 260x56 */
export function tape(x, y, s, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-130, -28, 260, 56, 6); ctx.fillStyle = 'rgba(235,240,245,0.75)'; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(26,26,30,0.35)'; ctx.stroke();
  ctx.restore();
}

/** open logbook: 900x620 at s = 1, origin = spine centre. left page ruled lines with times; right page blank for the moth.
 *  note = handwritten text on the right page, chars = how many characters shown */
export function logbook(x, y, s, note = '', chars = 0, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-470, -330, 940, 660, 30); ctx.fillStyle = BROWN_D; ctx.fill();
  rr(-450, -310, 900, 620, 18); ctx.fillStyle = PAPER; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.fillStyle = PAPER_D; ctx.fillRect(-12, -310, 24, 620);
  ctx.strokeStyle = '#B9C7D8'; ctx.lineWidth = 3;
  for (let i = 0; i < 11; i++) for (const sx of [-420, 40]) { ctx.beginPath(); ctx.moveTo(sx, -240 + i * 50); ctx.lineTo(sx + 380, -240 + i * 50); ctx.stroke(); }
  ctx.fillStyle = '#3A3A6A'; ctx.font = 'italic 700 30px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  const times = ['0800', '1000', '1100', '1525', '1545', '1600', '1700'];
  times.forEach((tm, i) => { ctx.fillText(tm, -410, -250 + i * 50 + 50); rr(-300, -270 + i * 50 + 45, 120 + ((i * 47) % 140), 10, 5); ctx.fillStyle = '#6A6A90'; ctx.fill(); ctx.fillStyle = '#3A3A6A'; });
  if (note && chars > 0) {
    ctx.fillStyle = '#2A2A5A'; ctx.font = 'italic 700 40px Inter';
    const shown = note.slice(0, Math.floor(chars)); const words = shown.split(' ');
    let lineTxt = '', ly = 150; const lines = [];
    for (const w of words) { const test = lineTxt ? lineTxt + ' ' + w : w; if (ctx.measureText(test).width > 370 && lineTxt) { lines.push(lineTxt); lineTxt = w; } else lineTxt = test; }
    lines.push(lineTxt);
    lines.forEach((l, i) => ctx.fillText(l, 50, ly + i * 50));
  }
  ctx.restore();
}
/** where the moth sits on a logbook(x, y, s): right page, upper middle */
export const logbookMothSpot = (x, y, s) => [x + 240 * s, y - 120 * s];

/** old paper letter with a lightbulb doodle and scribbled lines. 520x680 at s = 1. hi 0..1 highlights the word BUGS */
export function oldLetter(x, y, s, hi = 0, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-260, -340, 520, 680, 14); ctx.fillStyle = PAPER; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.fillStyle = '#B9A57E'; for (let i = 0; i < 9; i++) { if (i === 4) continue; rr(-210, -260 + i * 58, 300 + ((i * 61) % 120), 12, 6); ctx.fill(); }
  // highlighted "bugs" on row 4
  if (hi > 0) { ctx.save(); ctx.globalAlpha = hi; rr(-60, -260 + 4 * 58 - 30, 220, 60, 12); ctx.fillStyle = C.yellow; ctx.fill(); ctx.restore(); }
  rr(-210, -260 + 4 * 58 - 6, 130, 12, 6); ctx.fillStyle = '#B9A57E'; ctx.fill();
  ctx.fillStyle = '#2A2A5A'; ctx.font = 'italic 900 52px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('"bugs"', -50, -260 + 4 * 58);
  ctx.restore();
}

/** flat lightbulb. glow 0..1 lights it */
export function bulb(x, y, s, glow = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (glow > 0) { ctx.save(); ctx.globalAlpha = 0.35 * glow; circle(0, -30, 150, C.yellow); ctx.restore(); }
  circle(0, -40, 90, C.ink); circle(0, -40, 82, glow > 0.5 ? C.yellow : '#F4E7A8');
  ell(-30, -70, 18, 28, C.white, -0.4);
  rr(-46, 40, 92, 70, 12); ctx.fillStyle = '#9AA1AE'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-46, 58 + i * 18); ctx.lineTo(46, 58 + i * 18); ctx.stroke(); }
  ctx.restore();
}

/** phone screen: checkout with a cart icon and the charge lines. charges = number of charge rows (0..2, fractional pops) */
export function cartScreen(charges = 0, bad = 0) {
  ctx.fillStyle = '#EEF4F8'; ctx.fillRect(-166, -350, 332, 700);
  ctx.fillStyle = BLUE; ctx.fillRect(-166, -350, 332, 110);
  ctx.fillStyle = C.white; ctx.font = '900 40px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('CHECKOUT', 0, -280);
  // cart icon
  ctx.save(); ctx.translate(0, -140); ctx.strokeStyle = C.ink; ctx.lineWidth = 10; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-90, -50); ctx.lineTo(-60, -50); ctx.lineTo(-35, 30); ctx.lineTo(70, 30); ctx.lineTo(90, -25); ctx.lineTo(-50, -25); ctx.stroke();
  circle(-25, 58, 13, C.ink); circle(60, 58, 13, C.ink); ctx.restore();
  for (let i = 0; i < 2; i++) {
    const p = clamp(charges - i); if (p <= 0) continue;
    ctx.save(); ctx.translate(0, 20 + i * 120); ctx.scale(p, p);
    rr(-140, -45, 280, 90, 18); ctx.fillStyle = i === 1 && bad > 0 ? C.red : C.white; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.stroke();
    ctx.fillStyle = i === 1 && bad > 0 ? C.white : C.ink; ctx.font = '900 46px Inter'; ctx.fillText('– $20', 0, 2);
    ctx.restore();
  }
}

/** museum frame on a wall with a spotlight cone; draws inner() in frame-local coords (-200..200, -150..150). 480x380 at s = 1 */
export function museumFrame(x, y, s, inner, light = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (light > 0) { ctx.save(); ctx.globalAlpha = 0.28 * light; ctx.beginPath(); ctx.moveTo(-60, -520); ctx.lineTo(60, -520); ctx.lineTo(330, 260); ctx.lineTo(-330, 260); ctx.closePath(); ctx.fillStyle = '#FFF4C2'; ctx.fill(); ctx.restore(); }
  rr(-240, -190, 480, 380, 10); ctx.fillStyle = '#C9A13A'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-212, -162, 424, 324, 6); ctx.fillStyle = '#A88424'; ctx.fill();
  rr(-200, -150, 400, 300, 4); ctx.fillStyle = PAPER; ctx.fill();
  ctx.save(); rr(-200, -150, 400, 300, 4); ctx.clip(); if (inner) inner(); ctx.restore();
  rr(-90, 220, 180, 50, 8); ctx.fillStyle = C.ink; ctx.fill(); ctx.fillStyle = C.white; ctx.font = '900 30px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('1947', 0, 246);
  ctx.restore();
}
