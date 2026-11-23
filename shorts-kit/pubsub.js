// (17/30) Pub/Sub components. Flat look: flat fills, one darker shade, ink outlines on graphics.
// topicHub (the topic: a navy broadcast box with radiating rings + label), subscribeBtn (red SUBSCRIBE / grey
// SUBSCRIBED pill), channelPage (a generic channel card: banner, avatar, name, subscribe button), parcel (cardboard box),
// rewardCoin (gold points coin with a star), splitBlock (one big block that splits into small blocks, for the tease).
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

const GREEN = '#5BAE6A', PURPLE = '#8A63D2';

/** the topic: navy rounded box with a broadcast antenna, rings pulsing out (glow 0..1) and a label pill below. s = 1 → 260x220 */
export function topicHub(x, y, s, label = 'TOPIC', t = 0, glow = 0, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  if (glow > 0) for (let k = 0; k < 3; k++) { const ph = (t * 1.2 + k / 3) % 1; ctx.save(); ctx.globalAlpha = glow * 0.5 * (1 - ph); ctx.beginPath(); ctx.arc(0, -10, 150 + ph * 160, 0, TAU); ctx.lineWidth = 12; ctx.strokeStyle = PURPLE; ctx.stroke(); ctx.restore(); }
  line([[0, -110], [0, -170]], C.ink, 14); circle(0, -180, 22, C.red);
  for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(0, -180, 46, sd > 0 ? -0.6 : Math.PI - 0.6 + 0.0, sd > 0 ? 0.6 : Math.PI + 0.6); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.lineCap = 'round'; ctx.stroke(); }
  rr(-130, -110, 260, 220, 40); ctx.fillStyle = C.navy; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-100, -80, 200, 120, 22); ctx.fillStyle = PURPLE; ctx.fill();
  // three "copy" arrows fanning out inside the screen
  ctx.strokeStyle = C.white; ctx.lineWidth = 12; ctx.lineCap = 'round';
  for (const a of [-0.5, 0, 0.5]) { ctx.beginPath(); ctx.moveTo(-50, -20); ctx.lineTo(-50 + Math.cos(a) * 110, -20 + Math.sin(a) * 110 * 0.6); ctx.stroke(); }
  circle(-50, -20, 16, C.yellow);
  for (let i = 0; i < 3; i++) circle(-50 + i * 50, 76, 11, Math.sin(t * 8 + i * 2) > -0.3 ? GREEN : '#2E5A37');
  if (label) { ctx.font = '900 46px Inter'; ctx.letterSpacing = '2px'; const w = ctx.measureText(label).width + 50;
    rr(-w / 2, 140, w, 70, 35); ctx.fillStyle = C.ink; ctx.fill(); ctx.fillStyle = C.white; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, 177); ctx.letterSpacing = '0px'; }
  ctx.restore();
}

/** subscribe button. on 0..1 blends red SUBSCRIBE → grey SUBSCRIBED. s = 1 → ~360x96 */
export function subscribeBtn(x, y, s, on = 0, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  const sub = on > 0.5, txt = sub ? 'SUBSCRIBED' : 'SUBSCRIBE';
  ctx.font = '900 44px Inter'; ctx.letterSpacing = '2px'; const w = ctx.measureText(txt).width + 70;
  rr(-w / 2, -48, w, 96, 48); ctx.fillStyle = sub ? '#8E949E' : C.red; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.fillStyle = C.white; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 3); ctx.letterSpacing = '0px';
  ctx.restore();
}

/** a generic video channel card: banner, round avatar (avatar(x, y) draws inside), name bar, N videos, subscribe button.
 *  s = 1 → 760x620 centred on (x, y). on = subscribed 0..1 */
export function channelPage(x, y, s, name = 'QuantumXDev', on = 0, avatar = null, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  rr(-380, -310, 760, 620, 40); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-380, -310, 760, 200, [40, 40, 0, 0]); ctx.fillStyle = '#3A7BD5'; ctx.fill(); ctx.lineWidth = 10; ctx.stroke();
  ctx.save(); rr(-380, -310, 760, 200, [40, 40, 0, 0]); ctx.clip(); for (let i = 0; i < 6; i++) circle(-300 + i * 140, -110 + (i % 2) * 40, 60, '#4D8BE0'); ctx.restore();
  circle(-230, -100, 104, C.ink); circle(-230, -100, 92, C.yellow);
  if (avatar) avatar(-230, -100);
  ctx.fillStyle = C.ink; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.font = '900 54px Inter'; ctx.fillText(name, -100, -40);
  line([[-100, 20], [180, 20]], '#C9C2B5', 20);
  for (let i = 0; i < 3; i++) { rr(-330 + i * 225, 120, 205, 130, 16); ctx.fillStyle = ['#F29A3A', '#5BAE6A', '#E57A8A'][i]; ctx.fill(); }
  ctx.restore();
  subscribeBtn(x + 0 * s * sc, y + 70 * s * sc, 0.85 * s * sc, on);
}

/** cardboard parcel (closed box with tape). s = 1 → 220x170 */
export function parcel(x, y, s, rot = 0, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * sc, s * sc);
  rr(-110, -70, 220, 160, 12); ctx.fillStyle = '#D9A066'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-110, -70, 220, 46, [12, 12, 0, 0]); ctx.fillStyle = '#E8B57E'; ctx.fill(); ctx.lineWidth = 7; ctx.stroke();
  ctx.fillStyle = '#B67E45'; ctx.fillRect(-20, -70, 40, 160); rr(30, 20, 60, 40, 6); ctx.fillStyle = C.white; ctx.fill();
  ctx.restore();
}

/** gold points coin with a white star. spin 0..1 squashes it like it's turning */
export function rewardCoin(x, y, s, spin = 0, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc * Math.max(0.15, Math.abs(Math.cos(spin * Math.PI))), s * sc);
  circle(0, 0, 80, C.ink); circle(0, 0, 72, '#F5B82E'); circle(0, 0, 54, C.yellow);
  ctx.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 18 : 40, a = -Math.PI / 2 + i * Math.PI / 5; i ? ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
  ctx.closePath(); ctx.fillStyle = C.white; ctx.fill();
  ctx.restore();
}

/** tease: one big MONOLITH block (p = 0) that splits into a grid of small service blocks (p = 1) */
export function splitBlock(x, y, s, p = 0, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const cols = ['#3A7BD5', GREEN, '#F29A3A', C.pink, PURPLE, C.yellow];
  for (let i = 0; i < 6; i++) {
    const cx = (i % 3 - 1) * 130, cy = (Math.floor(i / 3) - 0.5) * 130, k = clamp(p);
    const gx = cx * lerp(1, 1.9, k), gy = cy * lerp(1, 1.9, k);
    rr(gx - 65 + 6 * k, gy - 65 + 6 * k, 130 - 12 * k, 130 - 12 * k, lerp(4, 26, k)); ctx.fillStyle = k > 0.05 ? cols[i] : C.navy; ctx.fill();
    ctx.lineWidth = 7; ctx.strokeStyle = C.ink; if (k > 0.05) ctx.stroke();
  }
  if (p <= 0.05) { rr(-195, -130, 390, 260, 30); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke(); }
  ctx.restore();
}
