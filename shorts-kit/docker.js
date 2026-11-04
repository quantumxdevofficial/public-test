// Inside Out: DOCKER components (shipping container box, gear, version tag, library block, OS block on a cart,
// dock crane, cargo ship, sea, hard hat). Same flat look: flat fills, one darker shade, one light highlight,
// ink outlines only on graphics/cards. No brand logos: Docker is named only in pills.
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

const BLUE = '#3A7BD5', BLUE_D = '#2A5FAE', GREEN = '#5BAE6A', ORANGE = '#C8734A', ORANGE_D = '#A55A35', GREY = '#9AA1AE', GREY_D = '#737B89';
export const BOX_COLS = [[BLUE, BLUE_D], [C.red, '#A81F2D'], [GREEN, '#3F8A4E'], [ORANGE, ORANGE_D], [C.yellow, '#E6B82E']];

/** shipping container. s = 1 → 440x240, origin = centre. ci = colour index (BOX_COLS). open 0..1 = lid lifted (top-loading
 * cutaway: the front panel drops to show inside, call inside() to draw contents in local coords before the front closes). */
export function container(x, y, s, ci = 0, label = null, open = 0, rot = 0, inside = null) {
  if (s <= 0) return;
  const [col, dark] = BOX_COLS[ci % BOX_COLS.length];
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  // back wall (visible when open)
  rr(-220, -120, 440, 240, 14); ctx.fillStyle = dark; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  if (inside) { ctx.save(); rr(-210, -110, 420, 220, 10); ctx.clip(); inside(); ctx.restore(); }
  // front panel slides down as it opens (stays clipped above the floor line)
  const drop = clamp(open) * 240;
  if (drop < 238) {
    ctx.save(); ctx.beginPath(); ctx.rect(-240, -140, 480, 270); ctx.clip();
    ctx.translate(0, drop);
    rr(-220, -120, 440, 240, 14); ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
    for (let i = -3; i <= 3; i++) { rr(i * 56 - 9, -96, 18, 192, 9); ctx.fillStyle = dark; ctx.fill(); }
    rr(-220, -120, 440, 26, [14, 14, 0, 0]); ctx.fillStyle = dark; ctx.fill();
    ell(-150, -70, 36, 10, 'rgba(255,255,255,0.35)');
    if (label) {
      ctx.font = '900 54px Inter'; const w = ctx.measureText(label).width + 50;
      rr(-w / 2, -36, w, 72, 36); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
      ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, 3);
    }
    ctx.restore();
  }
  // corner posts
  for (const sx of [-1, 1]) { rr(sx * 220 - 14, -124, 28, 248, 8); ctx.fillStyle = C.ink; ctx.fill(); }
  ctx.restore();
}

/** flat gear (a setting). s = 1 → r 90 */
export function gear(x, y, s, rot = 0, col = GREY) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.fillStyle = C.ink;
  for (let i = 0; i < 8; i++) { ctx.save(); ctx.rotate(i * TAU / 8); rr(-24, -112, 48, 50, 10); ctx.fill(); ctx.restore(); }
  circle(0, 0, 92, C.ink);
  ctx.fillStyle = col;
  for (let i = 0; i < 8; i++) { ctx.save(); ctx.rotate(i * TAU / 8); rr(-17, -104, 34, 44, 7); ctx.fill(); ctx.restore(); }
  circle(0, 0, 84, col); circle(0, 0, 32, C.ink); circle(0, 0, 24, C.bg);
  ell(-36, -44, 18, 9, 'rgba(255,255,255,0.4)', -0.6);
  ctx.restore();
}

/** luggage-style version tag "v3.12". s = 1 → 300x130 */
export function versionTag(x, y, s, text, col = C.yellow, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-150, -20); ctx.lineTo(-110, -65); ctx.lineTo(150, -65); ctx.lineTo(150, 65); ctx.lineTo(-110, 65); ctx.lineTo(-150, 20); ctx.closePath();
  ctx.lineJoin = 'round'; ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  circle(-105, 0, 16, C.ink); circle(-105, 0, 9, C.bg);
  ctx.fillStyle = C.ink; ctx.font = '900 76px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 30, 4);
  ctx.restore();
}

/** stack of three code books (libraries). s = 1 → 240x200 */
export function libBooks(x, y, s, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  [[C.pink, C.pinkDark, -10], [BLUE, BLUE_D, 8], [GREEN, '#3F8A4E', -4]].forEach(([c, d, dx], i) => {
    const yy = 60 - i * 62;
    rr(-120 + dx, yy - 30, 240, 60, 10); ctx.fillStyle = c; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
    rr(-100 + dx, yy - 30, 22, 60, 0); ctx.fillStyle = d; ctx.fill();
    rr(-40 + dx, yy - 8, 120, 14, 7); ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.fill();
  });
  ctx.restore();
}

/** small app card (code window with a play triangle). s = 1 → 260x200 */
export function appCard(x, y, s, rot = 0, col = BLUE) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-130, -100, 260, 200, 26); ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-130, -100, 260, 44, [26, 26, 0, 0]); ctx.fillStyle = C.ink; ctx.fill();
  for (const [i, c] of [[0, C.red], [1, C.yellow], [2, GREEN]]) circle(-100 + i * 26, -78, 8, c);
  ctx.beginPath(); ctx.moveTo(-30, -30); ctx.lineTo(50, 18); ctx.lineTo(-30, 66); ctx.closePath(); ctx.fillStyle = C.white; ctx.fill();
  ctx.restore();
}

/** a heavy grey "OS" block on a wooden cart with wheels (the virtual machine's baggage). s = 1 → 520 wide, ~560 tall.
 * Origin = cart floor centre. app = draw a small app card on top. wob = wheel rotation */
export function osCart(x, y, s, wob = 0, app = true) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const wx of [-170, 170]) { ctx.save(); ctx.translate(wx, 40); ctx.rotate(wob); circle(0, 0, 56, C.ink); circle(0, 0, 40, GREY_D); rr(-6, -40, 12, 80, 4); ctx.fillStyle = C.ink; ctx.fill(); ctx.restore(); }
  rr(-260, -20, 520, 50, 12); ctx.fillStyle = ORANGE; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-220, -400, 440, 380, 26); ctx.fillStyle = GREY; ctx.fill(); ctx.stroke();
  rr(110, -400, 110, 380, [0, 26, 26, 0]); ctx.fillStyle = GREY_D; ctx.fill(); ctx.lineWidth = 8; ctx.stroke();
  for (let i = 0; i < 3; i++) { rr(-180, -350 + i * 60, 260, 26, 13); ctx.fillStyle = GREY_D; ctx.fill(); }
  ctx.fillStyle = C.ink; ctx.font = '900 120px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('OS', -50, -100);
  if (app) appCard(0, -470, 0.5);
  ctx.restore();
}
/** rope from a hand point to the cart handle */
export function rope(x1, y1, x2, y2, sag = 40) {
  ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = '#8A6A3A'; ctx.lineWidth = 12;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo((x1 + x2) / 2, Math.max(y1, y2) + sag, x2, y2); ctx.stroke(); ctx.restore();
}

/** flat sea from y down, gentle waves */
export function sea(y, t = 0) {
  ctx.fillStyle = BLUE; ctx.beginPath(); ctx.moveTo(-300, 2400);
  for (let x = -300; x <= 1380; x += 30) ctx.lineTo(x, y + Math.sin(x * 0.012 + t * 2) * 14);
  ctx.lineTo(1380, 2400); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 8; ctx.lineCap = 'round';
  for (let i = 0; i < 6; i++) { const wx = (i * 230 + t * 40) % 1300 - 100, wy = y + 70 + (i % 3) * 70; ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx + 70, wy); ctx.stroke(); }
}

/** cargo ship: hull 760 wide at s = 1, origin = deck centre. stack = number of containers on deck (fractional pops the next) */
export function ship(x, y, s, t = 0, stack = 4) {
  ctx.save(); ctx.translate(x, y + Math.sin(t * 2) * 6); ctx.rotate(Math.sin(t * 1.3) * 0.01); ctx.scale(s, s);
  const slots = [[-200, -60], [40, -60], [-80, -180], [160, -180], [280, -60]];
  for (let i = 0; i < slots.length; i++) { const p = clamp(stack - i); if (p > 0) container(slots[i][0], slots[i][1] - (1 - p) * 60, 0.52, i + 1); }
  rr(-380, -150, 120, 150, 14); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  for (let i = 0; i < 2; i++) { rr(-360 + i * 50, -120, 34, 30, 6); ctx.fillStyle = C.sky; ctx.fill(); }
  ctx.beginPath(); ctx.moveTo(-420, 0); ctx.lineTo(400, 0); ctx.lineTo(330, 150); ctx.lineTo(-380, 150); ctx.closePath();
  ctx.fillStyle = C.red; ctx.fill(); ctx.lineWidth = 9; ctx.stroke();
  ctx.fillStyle = C.pants; ctx.beginPath(); ctx.moveTo(-395, 90); ctx.lineTo(358, 90); ctx.lineTo(330, 150); ctx.lineTo(-380, 150); ctx.closePath(); ctx.fill();
  ctx.restore();
}

/** dock crane: a yellow tower at x with an arm reaching right; hook hangs at (hx, hy). Draw the load at the hook yourself. */
export function crane(x, base, top, hx, hy) {
  ctx.save(); ctx.lineCap = 'round';
  rr(x - 40, top, 80, base - top, 10); ctx.fillStyle = C.yellow; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  for (let y = top + 40; y < base - 40; y += 90) line([[x - 30, y], [x + 30, y + 70]], '#E6B82E', 10);
  rr(x - 100, top - 40, Math.max(hx - x + 200, 300), 60, 12); ctx.fillStyle = C.yellow; ctx.fill(); ctx.stroke();
  rr(x - 70, top - 120, 120, 90, 14); ctx.fillStyle = C.yellow; ctx.fill(); ctx.stroke(); rr(x - 50, top - 100, 60, 40, 6); ctx.fillStyle = C.sky; ctx.fill();
  rr(hx - 40, top - 30, 80, 40, 8); ctx.fillStyle = C.ink; ctx.fill();
  line([[hx, top + 10], [hx, hy]], C.ink, 8);
  ctx.beginPath(); ctx.arc(hx, hy + 22, 22, -Math.PI * 0.1, Math.PI * 1.1, false); ctx.lineWidth = 10; ctx.stroke();
  ctx.restore();
}

/** yellow hard hat sitting on the hero's head. Pass the hero's (x, y, s) */
export function hardHat(mx, my, s) {
  ctx.save(); ctx.translate(mx, my + (-350 - 70) * s); ctx.scale(s, s);
  ctx.beginPath(); ctx.ellipse(0, 0, 118, 92, 0, Math.PI, TAU); ctx.closePath(); ctx.fillStyle = C.yellow; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-150, -8, 300, 30, 14); ctx.fillStyle = '#E6B82E'; ctx.fill(); ctx.stroke();
  rr(-16, -88, 32, 80, 12); ctx.fillStyle = '#E6B82E'; ctx.fill();
  ell(-60, -50, 24, 10, 'rgba(255,255,255,0.5)', -0.5);
  ctx.restore();
}

/** sweat drops near a point (effort) */
export function sweat(x, y, t, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  for (let i = 0; i < 2; i++) { const p = (t * 1.6 + i * 0.5) % 1, dx = i * 40, dy = p * 60; ctx.save(); ctx.translate(x + dx, y + dy); ctx.globalAlpha = a * (1 - p);
    ctx.beginPath(); ctx.moveTo(0, -24); ctx.quadraticCurveTo(16, 0, 0, 10); ctx.quadraticCurveTo(-16, 0, 0, -24); ctx.fillStyle = C.sky; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.restore(); }
  ctx.restore();
}
