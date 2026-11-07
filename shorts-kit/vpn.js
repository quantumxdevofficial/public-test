// Inside Out: VPN components (tunnel, ISP building, VPN switch, coffee cup, house, snoop).
// Same flat look: flat fills, one darker shade, one light highlight, ink outlines only on graphics. No brand logos.
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line as lineP, rnd } from './lib.js';
const line = (x0, y0, x1, y1, col, w) => { ctx.save(); ctx.lineCap = 'round'; lineP([[x0, y0], [x1, y1]], col, w); ctx.restore(); };

const GOLD = '#FFD43B', GOLD_D = '#E6B82E', GREEN = '#5BAE6A', GREEN_D = '#3F8A4E', BLUE = '#3A7BD5', STEEL = '#9AA1AE';
const TUN = '#2B3A5C', TUN_D = '#1C2742', TUN_L = '#3E5280';

/** a tiny closed padlock icon (for the tunnel). s = 1 → 60 px tall */
export function miniLock(x, y, s, col = GOLD) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.arc(0, -8, 15, Math.PI, 0); ctx.lineWidth = 8; ctx.strokeStyle = STEEL; ctx.stroke();
  line(-15, -8, -15, 2, STEEL, 8); line(15, -8, 15, 2, STEEL, 8);
  rr(-22, 0, 44, 34, 8); ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = C.ink; ctx.stroke();
  circle(0, 15, 5, C.ink);
  ctx.restore();
}

/** the VPN tunnel: a thick armoured pipe from (x0,y0) to (x1,y1), built up to p (0..1).
 *  t moves gold packets/locks inside; w = pipe width; flow 0..1 shows the moving locks */
export function tunnel(x0, y0, x1, y1, p = 1, t = 0, { w = 150, flow = 1, rings = true } = {}) {
  if (p <= 0) return;
  const ex = lerp(x0, x1, p), ey = lerp(y0, y1, p), len = Math.hypot(x1 - x0, y1 - y0), ang = Math.atan2(y1 - y0, x1 - x0);
  ctx.save(); ctx.lineCap = 'round';
  line(x0, y0, ex, ey, C.ink, w + 20); line(x0, y0, ex, ey, TUN_D, w); line(x0, y0, ex, ey, TUN, w * 0.72);
  ctx.save(); ctx.translate(x0, y0); ctx.rotate(ang);
  line(0, -w * 0.22, len * p, -w * 0.22, TUN_L, w * 0.12);
  if (rings) for (let d = 60; d < len * p - 20; d += 120) { rr(d - 9, -w / 2, 18, w, 6); ctx.fillStyle = TUN_D; ctx.fill(); }
  if (flow > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(0, -w / 2, len * p, w); ctx.clip(); ctx.globalAlpha = flow;
    for (let k = 0; k < Math.ceil(len / 170) + 1; k++) {
      const d = ((t * 260 + k * 170) % (len + 170)) - 85;
      ctx.save(); ctx.translate(d, 0); ctx.rotate(-ang); miniLock(0, 0, 0.9); ctx.restore();
    }
    ctx.restore();
  }
  ctx.restore();
  ctx.restore();
}

/** the internet provider building. s = 1 → 300x400 (base at y + 200), antenna on top, sign with label */
export function ispBuilding(x, y, s, label = 'ISP', t = 0, col = '#7C8391') {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  line(60, -200, 60, -300, C.ink, 10); circle(60, -305, 14, C.red);
  if (Math.sin(t * 5) > 0) circle(60, -305, 26, 'rgba(214,40,57,0.25)');
  rr(-150, -200, 300, 400, 18); ctx.fillStyle = '#5E6575'; ctx.fill();
  rr(-150, -200, 280, 400, 18); ctx.fillStyle = col; ctx.fill();
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
    const lit = rnd(r * 5 + c * 3 + Math.floor(t * 1.5)) > 0.4;
    rr(-118 + c * 82, -60 + r * 62, 56, 40, 6); ctx.fillStyle = lit ? '#FFE680' : '#4A5060'; ctx.fill();
  }
  rr(-120, -170, 240, 86, 14); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.fillStyle = C.ink; ctx.font = '900 56px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, -125);
  ctx.restore();
}

/** VPN toggle switch. s = 1 → 300x150. on 0..1 slides the knob and turns it green */
export function vpnSwitch(x, y, s, on = 0, label = 'VPN') {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-150, -75, 300, 150, 75); ctx.fillStyle = on > 0.5 ? GREEN : '#B9BEC8'; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  const kx = lerp(-75, 75, on);
  circle(kx, 0, 58, C.white); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.arc(kx, 0, 58, 0, TAU); ctx.stroke();
  ctx.fillStyle = C.ink; ctx.font = '900 64px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, -130);
  ctx.fillStyle = C.white; ctx.font = '900 40px Inter'; ctx.fillText(on > 0.5 ? 'ON' : 'OFF', on > 0.5 ? -62 : 62, 2);
  ctx.restore();
}

/** a coffee cup with steam. s = 1 → 200 wide */
export function coffeeCup(x, y, s, t = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (let k = -1; k <= 1; k++) {
    ctx.beginPath(); const x0 = k * 40;
    for (let i = 0; i <= 12; i++) { const yy = -110 - i * 10, xx = x0 + Math.sin(i * 0.7 + t * 4 + k) * 12; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
    ctx.globalAlpha = 0.55; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.strokeStyle = C.white; ctx.stroke(); ctx.globalAlpha = 1;
  }
  ctx.beginPath(); ctx.arc(100, 0, 42, -Math.PI / 2, Math.PI / 2); ctx.lineWidth = 20; ctx.strokeStyle = '#C8734A'; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-100, -80); ctx.lineTo(100, -80); ctx.lineTo(80, 90); ctx.quadraticCurveTo(0, 110, -80, 90); ctx.closePath();
  ctx.fillStyle = '#C8734A'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-100, -80); ctx.lineTo(-40, -80); ctx.lineTo(-50, 96); ctx.quadraticCurveTo(-70, 94, -80, 90); ctx.closePath(); ctx.fillStyle = '#A85E38'; ctx.fill();
  ell(0, -80, 100, 18, '#5A3420');
  rr(-60, -20, 120, 50, 12); ctx.fillStyle = C.white; ctx.fill();
  ctx.fillStyle = '#A85E38'; ctx.font = '900 30px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('CAFE', 0, 6);
  ctx.restore();
}

/** a simple house. s = 1 → 300 wide, 300 tall (base at y + 150) */
export function house(x, y, s, col = '#F29A3A', t = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-130, -40, 260, 190, 10); ctx.fillStyle = col; ctx.fill();
  rr(-130, -40, 60, 190, [10, 0, 0, 10]); ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-160, -30); ctx.lineTo(0, -160); ctx.lineTo(160, -30); ctx.closePath(); ctx.fillStyle = C.red; ctx.fill();
  rr(-30, 50, 60, 100, [24, 24, 0, 0]); ctx.fillStyle = '#7A4A2A'; ctx.fill();
  rr(50, 10, 56, 50, 6); ctx.fillStyle = '#FFE680'; ctx.fill();
  rr(-106, 10, 56, 50, 6); ctx.fillStyle = '#FFE680'; ctx.fill();
  ctx.restore();
}

/** a hooded snoop (stranger on the network). s = 1 → 200 wide, 240 tall. look -1..1 */
export function snoop(x, y, s, look = 0, t = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-100, 10, 200, 130, [70, 70, 10, 10]); ctx.fillStyle = '#2A2F3A'; ctx.fill();
  circle(0, -40, 86, '#2A2F3A'); circle(-10, -46, 86, '#353B48');
  ell(0, -30, 60, 54, '#141820');
  for (const sd of [-1, 1]) { ell(sd * 24, -34, 15, 13, C.white); circle(sd * 24 + look * 6, -32, 7, C.ink); }
  ctx.restore();
}
