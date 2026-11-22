// (16/30) Message queue components. Flat look: flat fills, one darker shade, ink outlines on graphics.
// ticketRail (kitchen order rail with clips), railTicket (a numbered ticket hanging from the rail),
// queueTube (the app-side queue: a rounded channel), msgCard (a message card with a label), serviceBox (a labelled
// app service), buyScreen (phone shop screen with a BUY button), freezeTint (icy overlay for "freeze").
import { ctx, C, W, H, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

const STEEL = '#7A8494', STEEL_D = '#5E6775', GREEN = '#5BAE6A', BLUE = '#3A7BD5';

/** a steel order rail from x0 to x1 at y (the bar the tickets clip onto) */
export function ticketRail(x0, x1, y, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  for (const x of [x0 + 30, x1 - 30]) { rr(x - 10, y - 70, 20, 80, 6); ctx.fillStyle = STEEL_D; ctx.fill(); }
  rr(x0, y - 14, x1 - x0, 44, 20); ctx.fillStyle = STEEL; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(x0 + 14, y - 6, x1 - x0 - 28, 10, 5); ctx.fillStyle = '#A7AFBC'; ctx.fill();
  ctx.restore();
}

/** a ticket hanging from the rail at (x, railY). s = 1 → 150x200. num = order number shown, sw = swing angle */
export function railTicket(x, railY, s, num = null, sw = 0, col = C.red, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, railY); ctx.rotate(sw); ctx.scale(s * sc, s * sc);
  rr(-75, 20, 150, 200, 10); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-75, 20, 150, 40, [10, 10, 0, 0]); ctx.fillStyle = col; ctx.fill();
  for (let i = 0; i < 3; i++) line([[-50, 150 + i * 24], [i % 2 ? 10 : 40, 150 + i * 24]], '#C9C2B5', 9);
  if (num != null) { ctx.fillStyle = C.ink; ctx.font = '900 70px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(num), 0, 102); }
  rr(-26, -6, 52, 40, 8); ctx.fillStyle = C.ink; ctx.fill(); rr(-18, 0, 36, 18, 5); ctx.fillStyle = STEEL; ctx.fill();
  ctx.restore();
}

/** the app-side queue: a long rounded channel from x0 to x1 centred on y, h tall, with a faint arrow (flow → right) */
export function queueTube(x0, x1, y, h = 170, a = 1, label = null) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  rr(x0, y - h / 2, x1 - x0, h, h / 2); ctx.fillStyle = '#DDE6EE'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(x0 + 12, y + h / 2 - 34, x1 - x0 - 24, 20, 10); ctx.fillStyle = '#C3CFDA'; ctx.fill();
  if (label) { ctx.fillStyle = C.ink; ctx.font = '900 40px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.letterSpacing = '3px'; ctx.fillText(label, (x0 + x1) / 2, y - h / 2 - 40); ctx.letterSpacing = '0px'; }
  ctx.restore();
}

/** a message card: s = 1 → 120x84 envelope-like card with a coloured stripe. label optional (drawn above) */
export function msgCard(x, y, s, col = C.yellow, label = null, rot = 0, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * sc, s * sc);
  rr(-60, -42, 120, 84, 12); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-60, -42, 26, 84, [12, 0, 0, 12]); ctx.fillStyle = col; ctx.fill();
  line([[-20, -14], [40, -14]], '#C9C2B5', 9); line([[-20, 10], [28, 10]], '#C9C2B5', 9);
  if (label) { ctx.font = '900 38px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const w = ctx.measureText(label).width + 36;
    rr(-w / 2, -110, w, 56, 28); ctx.fillStyle = C.ink; ctx.fill(); ctx.fillStyle = C.white; ctx.fillText(label, 0, -81); }
  ctx.restore();
}

/** an app service box (rounded navy box with a coloured badge + label underneath). state: null | 'ok' | 'down' */
export function serviceBox(x, y, s, label = 'SHOP', col = BLUE, t = 0, state = null, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  const down = state === 'down';
  rr(-110, -110, 220, 220, 34); ctx.fillStyle = down ? '#4A4F5A' : C.navy; ctx.fill();
  rr(-80, -80, 160, 110, 18); ctx.fillStyle = down ? '#6B707A' : col; ctx.fill();
  for (let i = 0; i < 3; i++) circle(-50 + i * 50, 66, 12, down ? C.red : (Math.sin(t * 8 + i * 2) > -0.3 ? GREEN : '#2E5A37'));
  ctx.fillStyle = C.ink; ctx.font = '900 44px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.letterSpacing = '2px'; ctx.fillText(label, 0, 160); ctx.letterSpacing = '0px';
  if (state === 'ok') { ctx.lineCap = 'round'; ctx.lineJoin = 'round'; for (const [w, c] of [[30, C.ink], [18, GREEN]]) { ctx.lineWidth = w; ctx.strokeStyle = c; ctx.beginPath(); ctx.moveTo(-36, -26); ctx.lineTo(-8, 2); ctx.lineTo(40, -50); ctx.stroke(); } }
  if (down) { ctx.lineCap = 'round'; for (const [w, c] of [[30, C.ink], [18, C.red]]) { ctx.lineWidth = w; ctx.strokeStyle = c; ctx.beginPath(); ctx.moveTo(-36, -60); ctx.lineTo(36, 10); ctx.moveTo(36, -60); ctx.lineTo(-36, 10); ctx.stroke(); } }
  ctx.restore();
}

/** a shop screen for K.phone(…, screen): product card + big green BUY button. press 0..1 darkens the button */
export function buyScreen(press = 0) {
  ctx.fillStyle = '#F7F4EE'; ctx.fillRect(-300, -600, 600, 1200);
  rr(-170, -330, 340, 300, 26); ctx.fillStyle = '#F7D88A'; ctx.fill();
  circle(0, -190, 80, C.red); ell(-24, -216, 26, 16, C.pinkLight, -0.5); rr(-6, -290, 12, 40, 6); ctx.fillStyle = C.leaf; ctx.fill();
  line([[-150, 30], [120, 30]], '#C9C2B5', 22); line([[-150, 80], [40, 80]], '#C9C2B5', 22);
  rr(-170, 160, 340, 120, 30); ctx.fillStyle = press > 0.5 ? '#3F8A4E' : GREEN; ctx.fill();
  ctx.fillStyle = C.white; ctx.font = '900 76px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('BUY', 0, 224);
}
/** where the BUY button sits on buyScreen (local screen coords) */
export const BUY_BTN = [0, 220];

/** icy freeze overlay: light-blue wash + frost corners. a 0..1 */
export function freezeTint(a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = 0.35 * a; ctx.fillStyle = '#9FD8F0'; ctx.fillRect(-300, -300, W + 600, H + 600);
  ctx.globalAlpha = 0.8 * a;
  for (const [cx, cy] of [[-60, -60], [W + 60, -60], [-60, 1250], [W + 60, 1250]]) { ctx.beginPath(); ctx.arc(cx, cy, 260, 0, TAU); ctx.fillStyle = '#E8F6FC'; ctx.fill(); }
  ctx.restore();
}
