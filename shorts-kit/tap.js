// Tap-to-pay components (NFC card, payment terminal, one-time code, token card, shop). Flat Inside Out look.
import { ctx, C, TAU, clamp, lerp, rr, circle, line } from './lib.js';
import { COPPER, COPPER_L } from './wireless.js';

export const CARD_GOLD = '#E8B84A', CARD_GOLD_D = '#B98A24', CARD_BLUE = '#3A7BD5', CARD_BLUE_D = '#2F67BE';
export const TOKEN_GREEN = '#5BAE6A', TOKEN_GREEN_D = '#448A52';
const T = (txt, x, y, size, col, align = 'center', weight = 900) => {
  ctx.font = `${weight} ${size}px Inter`; ctx.fillStyle = col; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(txt, x, y);
};

/** the contactless symbol: four arcs. a = alpha */
export function contactless(x, y, s, col = C.white, a = 1, lit = 4) {
  if (a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha = clamp(a);
  ctx.strokeStyle = col; ctx.lineWidth = 9; ctx.lineCap = 'round';
  for (let k = 0; k < 4; k++) {
    if (k >= lit) ctx.globalAlpha = clamp(a) * 0.25;
    ctx.beginPath(); ctx.arc(-34 + k * 0, 0, 14 + k * 17, -0.85, 0.85); ctx.stroke();
  }
  ctx.restore();
}

/** gold EMV chip, centred. s = scale (1 = 96x74). glow 0..1 */
export function cardChip(x, y, s, glow = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (glow > 0) { ctx.save(); ctx.globalAlpha = 0.5 * glow; rr(-70, -58, 140, 116, 30); ctx.fillStyle = C.yellow; ctx.fill(); ctx.restore(); }
  rr(-48, -37, 96, 74, 14); ctx.fillStyle = glow > 0.5 ? '#FFE27A' : CARD_GOLD; ctx.fill();
  ctx.lineWidth = 4; ctx.strokeStyle = CARD_GOLD_D; ctx.stroke();
  line([[-48, -12], [-16, -12]], CARD_GOLD_D, 4); line([[-48, 12], [-16, 12]], CARD_GOLD_D, 4);
  line([[16, -12], [48, -12]], CARD_GOLD_D, 4); line([[16, 12], [48, 12]], CARD_GOLD_D, 4);
  rr(-16, -24, 32, 48, 8); ctx.stroke();
  ctx.restore();
}

/** payment card, front. s = 1 → 600x380. o: { col, colD, num, label, xr (0..1 x-ray), coilP, glow, chipGlow } */
export function payCard(x, y, s, rot = 0, o = {}) {
  const { col = CARD_BLUE, colD = CARD_BLUE_D, num = '•••• 4821', label = 'BANK', xr = 0, coilP = 1, glow = 0, chipGlow = 0 } = o;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.save(); ctx.globalAlpha = 0.16; rr(-300 + 16, -190 + 20, 600, 380, 34); ctx.fillStyle = C.ink; ctx.fill(); ctx.restore();
  // normal face
  if (xr < 1) {
    ctx.save(); ctx.globalAlpha = 1 - xr;
    rr(-300, -190, 600, 380, 34); ctx.fillStyle = col; ctx.fill();
    ctx.save(); rr(-300, -190, 600, 380, 34); ctx.clip();
    ctx.beginPath(); ctx.moveTo(60, -190); ctx.lineTo(300, -190); ctx.lineTo(300, 190); ctx.lineTo(-80, 190); ctx.closePath(); ctx.fillStyle = colD; ctx.fill();
    ctx.restore();
    T(label, -250, -130, 40, C.white, 'left');
    cardChip(-180, -20, 1, chipGlow);
    contactless(230, -120, 0.9, C.white, 1);
    T(num, -250, 110, 52, C.white, 'left', 800);
    circle(200, 115, 34, C.red); ctx.save(); ctx.globalAlpha = 0.85; circle(244, 115, 34, C.yellow); ctx.restore();
    ctx.restore();
  }
  // x-ray: navy body, cyan outline, copper coil around the edge, chip
  if (xr > 0) {
    ctx.save(); ctx.globalAlpha = clamp(xr);
    rr(-300, -190, 600, 380, 34); ctx.fillStyle = C.xnavy; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.cyan; ctx.stroke();
    cardCoil(0, 0, 1, coilP, glow);
    cardChip(-180, -20, 1, chipGlow);
    // leads from chip to coil
    if (coilP > 0.95) { line([[-228, -20], [-262, -20]], glow > 0.3 ? C.yellow : COPPER, 7); line([[-132, -20], [-120, -20], [-120, -160]], glow > 0.3 ? C.yellow : COPPER, 7); }
    ctx.restore();
  }
  ctx.restore();
}

/** rectangular coil loops near the card's edge, drawn progressively (p 0..1). glow 0..1 turns it yellow */
export function cardCoil(x, y, s, p = 1, glow = 0) {
  if (p <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const loops = 4, col = glow > 0.3 ? C.yellow : COPPER;
  ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  // total perimeter based progress
  let left = p * loops;
  for (let k = 0; k < loops && left > 0; k++) {
    const i = 22 + k * 16, w = 600 - 2 * i, h = 380 - 2 * i, per = 2 * (w + h);
    const f = clamp(left); left -= 1;
    ctx.setLineDash([per * f, per + 10]);
    ctx.strokeStyle = col; ctx.beginPath(); ctx.moveTo(-300 + i, -190 + i); ctx.lineTo(300 - i, -190 + i); ctx.lineTo(300 - i, 190 - i); ctx.lineTo(-300 + i, 190 - i); ctx.closePath(); ctx.stroke();
  }
  ctx.setLineDash([]);
  if (glow > 0) { ctx.save(); ctx.globalAlpha = 0.25 * glow; ctx.strokeStyle = C.yellow; ctx.lineWidth = 30; rr(-270, -160, 540, 320, 20); ctx.stroke(); ctx.restore(); }
  ctx.restore();
}

/** a card seen edge-on (thin bar), for side views. s = 1 → 600 wide */
export function cardSide(x, y, s, glow = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-300, -14, 600, 28, 12); ctx.fillStyle = CARD_BLUE; ctx.fill();
  rr(-300, 2, 600, 12, [0, 0, 12, 12]); ctx.fillStyle = CARD_BLUE_D; ctx.fill();
  if (glow > 0) { ctx.save(); ctx.globalAlpha = glow; rr(-260, -6, 520, 12, 6); ctx.fillStyle = C.yellow; ctx.fill(); ctx.restore(); }
  ctx.restore();
}

/** payment terminal, front. s = 1 → 360x560. screen: 'amount' | 'tap' | 'ok' | 'no' | 'wait'; amt text */
export function terminal(x, y, s, screen = 'tap', o = {}) {
  const { amt = '$4.50', glow = 0, t = 0 } = o;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.save(); ctx.globalAlpha = 0.16; rr(-180 + 16, -280 + 20, 360, 560, 50); ctx.fillStyle = C.ink; ctx.fill(); ctx.restore();
  rr(-180, -280, 360, 560, 50); ctx.fillStyle = '#2B3245'; ctx.fill();
  rr(100, -280, 80, 560, [0, 50, 50, 0]); ctx.fillStyle = '#232A3B'; ctx.fill();
  // screen
  const scol = screen === 'ok' ? TOKEN_GREEN : screen === 'no' ? C.red : '#DCEFF5';
  rr(-140, -240, 280, 200, 22); ctx.fillStyle = scol; ctx.fill();
  if (screen === 'ok') { ctx.save(); ctx.strokeStyle = C.white; ctx.lineWidth = 20; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(-50, -140); ctx.lineTo(-12, -100); ctx.lineTo(56, -180); ctx.stroke(); ctx.restore(); }
  else if (screen === 'no') { ctx.save(); ctx.strokeStyle = C.white; ctx.lineWidth = 20; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-40, -180); ctx.lineTo(40, -100); ctx.moveTo(40, -180); ctx.lineTo(-40, -100); ctx.stroke(); ctx.restore(); }
  else if (screen === 'wait') { ctx.save(); ctx.strokeStyle = C.navy; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, -140, 44, t * 6, t * 6 + 4.2); ctx.stroke(); ctx.restore(); }
  else { T(amt, 0, -175, 66, C.navy); if (screen === 'tap') contactless(14, -95, 0.62, C.navy, 1); }
  // contactless pad area + keypad
  if (glow > 0) { ctx.save(); ctx.globalAlpha = 0.45 * glow; circle(0, 120, 120, C.yellow); ctx.restore(); }
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) { rr(-120 + c * 84, 10 + r * 72, 68, 52, 14); ctx.fillStyle = '#3D4660'; ctx.fill(); }
  rr(-120, 226, 68, 36, 12); ctx.fillStyle = C.red; ctx.fill(); rr(-36, 226, 68, 36, 12); ctx.fillStyle = C.yellow; ctx.fill(); rr(48, 226, 68, 36, 12); ctx.fillStyle = TOKEN_GREEN; ctx.fill();
  ctx.restore();
}

/** small ticket with a one-time code. tone: 'gold' | 'ghost' (dashed copy) */
export function codeTicket(x, y, s, text = 'A7F3-91', tone = 'gold', rot = 0, label = 'ONE-TIME') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  if (tone === 'ghost') {
    rr(-200, -80, 400, 160, 28); ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.fill();
    ctx.setLineDash([22, 14]); ctx.lineWidth = 8; ctx.strokeStyle = '#7C8391'; ctx.stroke(); ctx.setLineDash([]);
    T(text, 0, 14, 64, '#7C8391');
    T('COPY', 0, -48, 30, '#7C8391');
  } else {
    rr(-200, -80, 400, 160, 28); ctx.fillStyle = C.yellow; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
    T(text, 0, 16, 64, C.ink);
    T(label, 0, -48, 30, C.ink);
  }
  ctx.restore();
}

/** the little stand-in stamp ("TOKEN") */
export function tokenBadge(x, y, s, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha = clamp(a); ctx.rotate(-0.12);
  rr(-150, -48, 300, 96, 20); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = TOKEN_GREEN_D; ctx.stroke();
  T('TOKEN', 0, 4, 56, TOKEN_GREEN_D);
  ctx.restore();
}

/** a small shop front. s = 1 → 640 wide. open 0..1 */
export function shopFront(x, y, s, o = {}) {
  const { sign = 'SHOP', blind = 0 } = o;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-320, -260, 640, 520, 20); ctx.fillStyle = '#F29A3A'; ctx.fill();
  ctx.fillStyle = '#D9832C'; ctx.fillRect(160, -260, 160, 520);
  // awning stripes
  for (let k = 0; k < 8; k++) { ctx.fillStyle = k % 2 ? C.white : C.red; ctx.beginPath(); ctx.moveTo(-340 + k * 85, -230); ctx.lineTo(-340 + (k + 1) * 85, -230); ctx.lineTo(-340 + (k + 1) * 85, -150); ctx.arc(-340 + k * 85 + 42.5, -150, 42.5, 0, Math.PI); ctx.closePath(); ctx.fill(); }
  rr(-160, -320, 320, 80, 18); ctx.fillStyle = C.ink; ctx.fill(); T(sign, 0, -278, 50, C.white);
  // window + door
  rr(-270, -60, 300, 220, 16); ctx.fillStyle = C.sky; ctx.fill(); line([[-120, -60], [-120, 160]], C.white, 8);
  rr(80, -60, 170, 320, [16, 16, 0, 0]); ctx.fillStyle = '#7A4A2A'; ctx.fill(); circle(220, 110, 12, CARD_GOLD);
  if (blind > 0) { ctx.save(); ctx.globalAlpha = blind; rr(-270, -60, 300, 220 * blind, 16); ctx.fillStyle = '#7C8391'; ctx.fill(); ctx.restore(); }
  ctx.restore();
}

/** dimension marker between two y values with a label ("4 cm") */
export function gapRuler(x, y0, y1, label, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(a); ctx.strokeStyle = C.ink; ctx.lineWidth = 8; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.moveTo(x - 30, y0); ctx.lineTo(x + 30, y0); ctx.moveTo(x - 30, y1); ctx.lineTo(x + 30, y1); ctx.stroke();
  ctx.restore();
}
