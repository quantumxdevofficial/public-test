// Inside Out: OPTICAL MOUSE components (How Does Your Mouse Know Where You Moved It?). Flat fills, one darker shade,
// one light highlight, ink outlines on graphics.
// pcMouse, mouseBottom, mouseXray, bumpTexture, snapFrame, monitor, glassSlab, woodMouse, mouseAnimal, jumpCursor
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line, rnd } from './lib.js';

const SHELL = '#E9ECF1', SHELL_D = '#C5CBD5', SHELL_L = '#FFFFFF', DARK = '#3A3F4B', LED = '#FF3B3B';
const WOOD = '#C8734A', WOOD_D = '#A85C38', WOOD_L = '#DA8E66', METAL = '#8E9AAB', METAL_D = '#6E7A8C';
const DESK = '#D9A577', DESK_D = '#B98459', DESK_L = '#EBC39A';
export const MOUSE_COLS = { SHELL, SHELL_D, LED, DESK, DESK_D, DESK_L };

function mouseShape() { ctx.beginPath(); ctx.ellipse(0, 0, 150, 230, 0, 0, TAU); }

/** computer mouse from the top. s = 1 → 300 x 460. cord = length of cord out the top (px, local). rot radians */
export function pcMouse(x, y, s, rot = 0, cord = 260, click = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.lineJoin = 'round';
  if (cord > 0) { ctx.beginPath(); ctx.moveTo(0, -225); ctx.bezierCurveTo(0, -225 - cord * 0.5, 60, -225 - cord * 0.6, 40, -225 - cord); ctx.lineWidth = 16; ctx.strokeStyle = DARK; ctx.lineCap = 'round'; ctx.stroke(); }
  mouseShape(); ctx.fillStyle = SHELL; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.save(); mouseShape(); ctx.clip(); ctx.fillStyle = SHELL_D; ctx.fillRect(70, -240, 100, 480); ctx.restore();
  ell(-80, 40, 22, 90, SHELL_L, 0.1);
  line([[0, -228], [0, -40]], C.ink, 7);
  line([[-140, -40], [140, -40]], C.ink, 7);
  if (click > 0) { ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, 150, 230, 0, 0, TAU); ctx.clip(); ctx.globalAlpha = 0.35 * click; ctx.fillStyle = C.yellow; ctx.fillRect(-150, -240, 150, 200); ctx.restore(); }
  rr(-16, -175, 32, 70, 16); ctx.fillStyle = DARK; ctx.fill();
  ctx.restore();
}

/** mouse flipped over (bottom view). glow 0..1 lights the red LED window. s = 1 → 300 x 460 */
export function mouseBottom(x, y, s, glow = 1, t = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  mouseShape(); ctx.fillStyle = DARK; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  // skid pads
  for (const [px, py, w, h] of [[-60, -200, 120, 26], [-110, 160, 60, 24], [50, 160, 60, 24]]) { rr(px, py, w, h, 12); ctx.fillStyle = '#5A606D'; ctx.fill(); }
  // sensor window
  rr(-60, -30, 120, 120, 30); ctx.fillStyle = '#23262E'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  if (glow > 0) { ctx.save(); ctx.globalAlpha = 0.45 * glow * (0.85 + 0.15 * Math.sin(t * 12)); circle(0, 30, 120, LED); ctx.restore(); }
  circle(0, 30, 34, glow > 0 ? LED : '#7A2A2A'); circle(-10, 20, 10, '#FFB0B0');
  ctx.restore();
}

/** a bumpy surface patch (flat shades), drawn in rect (x, y, w, h). off = [dx, dy] slide, k = bump scale */
export function bumpTexture(x, y, w, h, off = [0, 0], k = 1, base = DESK) {
  ctx.save(); rr(x, y, w, h, 0); ctx.clip();
  ctx.fillStyle = base; ctx.fillRect(x, y, w, h);
  const cell = 70 * k;
  const ox = off[0], oy = off[1];
  const i0 = Math.floor((-ox) / cell) - 1, i1 = Math.ceil((w - ox) / cell) + 1;
  const j0 = Math.floor((-oy) / cell) - 1, j1 = Math.ceil((h - oy) / cell) + 1;
  for (let i = i0; i <= i1; i++) for (let j = j0; j <= j1; j++) {
    const r = rnd(i * 31.7 + j * 7.3);
    const bx = x + ox + i * cell + rnd(i * 3 + j * 17) * cell, by = y + oy + j * cell + rnd(i * 11 + j * 5) * cell;
    const rad = (10 + r * 22) * k;
    ell(bx + 4 * k, by + 5 * k, rad, rad * 0.8, DESK_D, r * 3);
    ell(bx, by, rad, rad * 0.8, r > 0.6 ? DESK_L : '#E2B184', r * 3);
  }
  ctx.restore();
}

/** a snapshot photo of the surface: square frame w px, bumps shifted by off. label under it */
export function snapFrame(x, y, w, off = [0, 0], label = null, sc = 1, edge = C.ink) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  rr(-w / 2 - 14, -w / 2 - 14, w + 28, w + 28, 22); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = edge; ctx.stroke();
  bumpTexture(-w / 2, -w / 2, w, w, off, 1.1);
  if (label) { ctx.font = '900 46px Inter'; ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, w / 2 + 50); }
  ctx.restore();
}

/** side cutaway of the mouse on the surface (x-ray look). Origin = where the sensor meets the surface.
 *  s = 1 → ~520 wide. beam 0..1 draws the light path LED → surface → lens → sensor. flash 0..1 = camera snap */
export function mouseXray(x, y, s, t = 0, beam = 1, flash = 0, slide = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  // surface (bumpy line)
  ctx.beginPath(); ctx.moveTo(-420, 20);
  for (let k = 0; k <= 42; k++) { const px = -420 + k * 20; ctx.lineTo(px, 20 - 8 * Math.abs(Math.sin(k * 1.7 + slide))); }
  ctx.lineTo(420, 120); ctx.lineTo(-420, 120); ctx.closePath(); ctx.fillStyle = 'rgba(79,209,232,0.18)'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.cyan; ctx.stroke();
  // shell profile
  ctx.beginPath(); ctx.moveTo(-260, 0); ctx.bezierCurveTo(-260, -200, 140, -260, 260, -60); ctx.quadraticCurveTo(280, 0, 240, 0); ctx.closePath();
  ctx.fillStyle = 'rgba(79,209,232,0.12)'; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.cyan; ctx.stroke();
  // board
  rr(-200, -70, 380, 22, 8); ctx.fillStyle = C.cyan; ctx.fill();
  // LED (left), lens + sensor chip (centre)
  rr(-170, -48, 50, 34, 10); ctx.fillStyle = LED; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = C.white; ctx.stroke();
  rr(-40, -48, 80, 34, 8); ctx.fillStyle = C.yellow; ctx.fill(); ctx.stroke();
  ell(0, -4, 46, 12, 'rgba(255,255,255,0.8)');
  if (beam > 0) {
    const a = clamp(beam * 2), b = clamp(beam * 2 - 1);
    ctx.save(); ctx.globalAlpha = 0.9;
    line([[-145, -14], [lerp(-145, 0, a), lerp(-14, 14, a)]], LED, 20);
    if (b > 0) line([[0, 14], [0, lerp(14, -14, b)]], LED, 20);
    ctx.restore();
    if (b > 0) { ctx.save(); ctx.globalAlpha = 0.35; circle(0, 14, 40, LED); ctx.restore(); }
  }
  if (flash > 0) { ctx.save(); ctx.globalAlpha = flash; circle(0, -30, 70, C.white); ctx.restore(); }
  ctx.restore();
}

/** desktop monitor. s = 1 → 760 x 480 screen area 700 x 420. screen() draws in local coords (-350..350, -210..210) */
export function monitor(x, y, s, screen, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  rr(-60, 240, 120, 120, 10); ctx.fillStyle = '#9AA1AE'; ctx.fill();
  rr(-200, 350, 400, 40, 20); ctx.fillStyle = '#C9CDD6'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-380, -240, 760, 480, 30); ctx.fillStyle = C.ink; ctx.fill();
  ctx.save(); rr(-350, -210, 700, 420, 12); ctx.clip(); ctx.fillStyle = '#DCEBFA'; ctx.fillRect(-350, -210, 700, 420); if (screen) screen(); ctx.restore();
  ctx.restore();
}

/** desktop-ish screen with a few app icons */
export function desktopIcons() {
  const cols = ['#3A7BD5', '#E57A8A', '#5BAE6A', '#F29A3A'];
  cols.forEach((c, i) => { rr(-310, -180 + i * 95, 70, 70, 16); ctx.fillStyle = c; ctx.fill(); });
  rr(-350, 170, 700, 40, 0); ctx.fillStyle = '#1F2A44'; ctx.fill();
}

/** glass tabletop seen at an angle. s = 1 → 800 x 220. Transparent fill + shine strokes */
export function glassSlab(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-340, -110); ctx.lineTo(400, -110); ctx.lineTo(340, 110); ctx.lineTo(-400, 110); ctx.closePath();
  ctx.fillStyle = 'rgba(160,215,235,0.45)'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = '#7FB9CF'; ctx.stroke();
  ctx.globalAlpha = 0.9; line([[-220, 70], [-120, -70]], C.white, 14); line([[-150, 70], [-90, -10]], C.white, 8); line([[200, 70], [260, -10]], C.white, 10);
  ctx.restore();
}

/** Engelbart's 1964 wooden mouse (3/4 side view). Origin = bottom centre. s = 1 → 360 x 260. wheel = rotation, tail = cord wiggle */
export function woodMouse(x, y, s, wheel = 0, tail = 0, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  // cord out of the back like a tail
  ctx.beginPath(); ctx.moveTo(180, -60);
  ctx.bezierCurveTo(280, -60 + tail * 30, 300, -170 - tail * 20, 400, -150); ctx.bezierCurveTo(470, -140, 470, -60, 540, -80);
  ctx.lineWidth = 14; ctx.strokeStyle = DARK; ctx.stroke();
  // wheels (metal discs peeking under)
  for (const wx of [-100, 100]) {
    circle(wx, -10, 42, METAL_D); circle(wx, -10, 34, METAL);
    ctx.save(); ctx.translate(wx, -10); ctx.rotate(wheel); line([[-30, 0], [30, 0]], METAL_D, 6); line([[0, -30], [0, 30]], METAL_D, 6); ctx.restore();
  }
  // box
  rr(-180, -220, 360, 200, 26); ctx.fillStyle = WOOD; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-180, -80, 360, 60, [0, 0, 26, 26]); ctx.fillStyle = WOOD_D; ctx.fill();
  rr(-180, -220, 360, 200, 26); ctx.lineWidth = 10; ctx.stroke();
  for (let k = 0; k < 3; k++) line([[-150, -180 + k * 34], [lerp(60, 140, rnd(k)), -180 + k * 34]], WOOD_L, 6);
  // red button
  rr(60, -250, 90, 40, 12); ctx.fillStyle = C.red; ctx.fill(); ctx.lineWidth = 7; ctx.stroke();
  ctx.restore();
}

/** a cute grey mouse (the animal), side view facing left. Origin = feet centre. s = 1 → ~420 wide. tail wiggle */
export function mouseAnimal(x, y, s, t = 0, sc = 1) {
  if (s * sc <= 0) return;
  const G = '#A7ADB8', GD = '#8A909C';
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(130, -60); ctx.bezierCurveTo(240, -40 + Math.sin(t * 5) * 30, 260, -160, 360, -120 + Math.sin(t * 5 + 1) * 20);
  ctx.lineWidth = 12; ctx.strokeStyle = C.pink; ctx.stroke();
  ell(20, -90, 150, 95, GD); ell(10, -98, 142, 88, G);
  ell(-150, -120, 75, 60, G, -0.2);
  circle(-110, -190, 48, GD); circle(-112, -192, 38, C.pinkLight);
  circle(-205, -110, 14, C.pink);
  circle(-160, -135, 11, C.ink); circle(-163, -139, 4, C.white);
  line([[-200, -100], [-260, -90]], C.ink, 4); line([[-200, -96], [-255, -70]], C.ink, 4);
  for (const fx of [-60, 80]) ell(fx, -4, 30, 12, C.pinkLight);
  ell(-20, -130, 50, 22, '#C3C8D0', -0.2);
  ctx.restore();
}
