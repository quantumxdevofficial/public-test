// Inside Out: COOKIES components (choc-chip cookie with optional face, cookie note card with an ID, browser window,
// cookie jar = browser storage, shopping cart, sneaker, ad banner, retro 90s computer, cookie-consent phone screen,
// account screen). Same flat look: flat fills, one darker shade, one light highlight, ink outlines only on graphics.
// No brand logos.
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

const DOUGH = '#D9A066', DOUGH_D = '#B97F45', DOUGH_L = '#EBC28C', CHIP = '#4A2C1E', BLUE = '#3A7BD5', GREEN = '#5BAE6A';
const GLASS = '#E3EEF2', GLASS_D = '#BFD3DB';

/** choc-chip cookie. s = 1 → 300 px wide. bite 0..1 takes a bite out of the top right. face: null | 'n' | 'sly' */
export function cookie(x, y, s, rot = 0, bite = 0, face = null, t = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  if (bite > 0) {
    ctx.beginPath(); ctx.rect(-200, -200, 400, 400);
    const r = 70 * bite; for (const [bx, by] of [[110, -100], [150, -30], [50, -140]]) { ctx.moveTo(bx + r, by); ctx.arc(bx, by, r, 0, TAU); }
    ctx.clip('evenodd');
  }
  circle(0, 0, 150, DOUGH_D); circle(-6, -6, 140, DOUGH);
  ell(-60, -70, 50, 22, DOUGH_L, -0.6);
  for (const [cx, cy, r] of [[-70, 10, 20], [30, -60, 17], [60, 40, 22], [-20, 80, 16], [100, -10, 14], [-90, -60, 13], [10, 10, 12]]) {
    if (face && Math.abs(cx) < 70 && cy > -40 && cy < 60) continue;   // keep the face area clear
    rr(cx - r, cy - r * 0.8, r * 2, r * 1.6, r * 0.6); ctx.fillStyle = CHIP; ctx.fill();
  }
  if (face) {
    const look = face === 'sly' ? Math.sin(t * 3) * 6 : 0;
    for (const sd of [-1, 1]) {
      ell(sd * 40, -10, 20, face === 'sly' ? 12 : 22, C.white); circle(sd * 40 + 6 + look, -8, 10, C.ink);
      if (face === 'sly') { ctx.save(); ctx.strokeStyle = C.ink; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(sd * 62, -42); ctx.lineTo(sd * 18, -28); ctx.stroke(); ctx.restore(); }
    }
    ctx.strokeStyle = C.ink; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath();
    if (face === 'sly') { ctx.moveTo(-34, 44); ctx.quadraticCurveTo(10, 66, 40, 34); } else { ctx.moveTo(-30, 40); ctx.quadraticCurveTo(0, 64, 30, 40); }
    ctx.stroke();
  }
  ctx.restore();
}

/** the cookie as it really is: a small note card. s = 1 → 420x300. idChars = how many ID chars are shown */
export function noteCard(x, y, s, id = '4821', rot = 0, idChars = 1e9, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * sc, s * sc);
  ctx.beginPath(); ctx.moveTo(-210, -150); ctx.lineTo(150, -150); ctx.lineTo(210, -90); ctx.lineTo(210, 150); ctx.lineTo(-210, 150); ctx.closePath();
  ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(150, -150); ctx.lineTo(150, -90); ctx.lineTo(210, -90); ctx.closePath(); ctx.fillStyle = '#E4DCCB'; ctx.fill(); ctx.stroke();
  rr(-180, -120, 200, 54, 14); ctx.fillStyle = DOUGH; ctx.fill();
  cookie(-150, -93, 0.13);
  ctx.fillStyle = C.ink; ctx.font = '900 30px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('COOKIE', -125, -91);
  ctx.font = '900 44px Inter'; ctx.fillStyle = '#7A7A80'; ctx.fillText('ID', -180, 0);
  ctx.font = '900 100px Inter'; ctx.fillStyle = C.ink; ctx.fillText(id.slice(0, Math.max(0, Math.floor(idChars))), -110, 30);
  line([[-180, 110], [180, 110]], '#E4DCCB', 10);
  ctx.restore();
}

/** a browser window. w x h centred at (x, y). url = text in the address bar; content(w, h) draws in local coords */
export function browser(x, y, w, h, url = 'shop.com', content = null, sc = 1, urlChars = 1e9) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  rr(-w / 2, -h / 2, w, h, 30); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-w / 2, -h / 2, w, 92, [30, 30, 0, 0]); ctx.fillStyle = '#E4DCCB'; ctx.fill(); ctx.stroke();
  for (const [i, c] of [[0, C.red], [1, C.yellow], [2, GREEN]]) circle(-w / 2 + 40 + i * 36, -h / 2 + 46, 11, c);
  rr(-w / 2 + 160, -h / 2 + 22, w - 200, 48, 24); ctx.fillStyle = C.white; ctx.fill();
  ctx.fillStyle = C.ink; ctx.font = '800 30px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText(url.slice(0, Math.max(0, Math.floor(urlChars))), -w / 2 + 186, -h / 2 + 47);
  if (content) { ctx.save(); ctx.translate(0, 46); rr(-w / 2 + 6, -h / 2 + 46, w - 12, h - 98, [0, 0, 26, 26]); ctx.clip(); content(w, h - 92); ctx.restore(); }
  ctx.restore();
}
/** generic store page content for browser(): header bar + product tiles. col = header colour */
export function storePage(col = BLUE, cartN = 0) {
  return (w, h) => {
    ctx.fillStyle = col; ctx.fillRect(-w / 2, -h / 2, w, 70);
    rr(-w / 2 + 24, -h / 2 + 18, 140, 34, 17); ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fill();
    cart(w / 2 - 60, -h / 2 + 36, 0.28, cartN, C.white);
    const tw = (w - 100) / 3;
    for (let i = 0; i < 3; i++) {
      const tx = -w / 2 + 25 + i * (tw + 25);
      rr(tx, -h / 2 + 100, tw, tw * 1.1, 16); ctx.fillStyle = '#F4F1EA'; ctx.fill();
      if (i === 0) shoe(tx + tw / 2, -h / 2 + 100 + tw * 0.55, tw / 380, 0, C.red);
      else circle(tx + tw / 2, -h / 2 + 100 + tw * 0.55, tw * 0.25, i === 1 ? C.yellow : GREEN);
    }
  };
}

/** glass cookie jar (= storage in your browser). s = 1 → 300x380. n notes inside; lid 0 = closed, 1 = lifted */
export function jar(x, y, s, n = 0, lid = 0, label = 'BROWSER') {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-150, -150, 300, 330, 60); ctx.fillStyle = GLASS; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  for (let i = 0; i < n; i++) noteCard(-50 + (i % 3) * 50, 120 - Math.floor(i / 3) * 50 - (i % 2) * 14, 0.28, '', (i % 2 ? 0.2 : -0.15));
  rr(-120, -120, 30, 200, 15); ctx.fillStyle = C.white; ctx.globalAlpha = 0.7; ctx.fill(); ctx.globalAlpha = 1;
  rr(-110, -190, 220, 44, 14); ctx.fillStyle = GLASS_D; ctx.fill(); ctx.stroke();
  ctx.save(); ctx.translate(lid * 60, -205 - lid * 110); ctx.rotate(lid * 0.5);
  rr(-130, -26, 260, 52, 20); ctx.fillStyle = C.red; ctx.fill(); ctx.stroke(); circle(0, -34, 20, C.red); ctx.beginPath(); ctx.arc(0, -34, 20, 0, TAU); ctx.stroke();
  ctx.restore();
  if (label) { rr(-100, -40, 200, 60, 12); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 6; ctx.stroke(); ctx.fillStyle = C.ink; ctx.font = '900 34px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, -9); }
  ctx.restore();
}

/** shopping cart. s = 1 → ~320 px wide. items = boxes inside (0..4) */
export function cart(x, y, s, items = 0, col = C.ink, drop = 1) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const IC = [C.red, C.yellow, GREEN, BLUE];
  for (let i = 0; i < items; i++) { const yy = (i === items - 1 ? lerp(-260, 0, drop) : 0); rr(-110 + i * 55, -90 + yy, 60, 70, 10); ctx.fillStyle = IC[i % 4]; ctx.fill(); }
  ctx.strokeStyle = col; ctx.lineWidth = 22;
  ctx.beginPath(); ctx.moveTo(-190, -110); ctx.lineTo(-140, -110); ctx.lineTo(-100, 40); ctx.lineTo(130, 40); ctx.lineTo(160, -80); ctx.lineTo(-125, -80); ctx.stroke();
  circle(-80, 100, 28, col); circle(110, 100, 28, col);
  ctx.restore();
}

/** flat sneaker, facing right. s = 1 → ~380 px long */
export function shoe(x, y, s, rot = 0, col = C.red) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-190, 40, 380, 44, 22); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-180, 44); ctx.lineTo(-170, -70); ctx.quadraticCurveTo(-100, -90, -60, -50); ctx.quadraticCurveTo(40, 0, 150, 0); ctx.quadraticCurveTo(190, 10, 185, 44); ctx.closePath();
  ctx.fillStyle = col; ctx.fill(); ctx.stroke();
  for (let i = 0; i < 3; i++) line([[-60 + i * 34, -40 + i * 12], [-30 + i * 34, -56 + i * 12]], C.white, 9);
  ctx.beginPath(); ctx.moveTo(-170, -10); ctx.quadraticCurveTo(-60, 30, 60, 10); ctx.strokeStyle = C.white; ctx.lineWidth = 12; ctx.stroke();
  ctx.restore();
}

/** small ad card with a shoe and an "AD" tag. s = 1 → 300x240 */
export function adBanner(x, y, s, rot = 0, col = C.red) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-150, -120, 300, 240, 22); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  shoe(0, 0, 0.6, -0.08, col);
  rr(-138, -108, 72, 40, 10); ctx.fillStyle = C.yellow; ctx.fill(); ctx.fillStyle = C.ink; ctx.font = '900 26px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('AD', -102, -87);
  rr(-90, 70, 180, 34, 17); ctx.fillStyle = col; ctx.fill(); ctx.fillStyle = C.white; ctx.font = '900 22px Inter'; ctx.fillText('BUY NOW', 0, 88);
  ctx.restore();
}

/** a beige 90s desktop computer (CRT + keyboard). s = 1 → 520 wide. screen() draws inside 400x300 centred at (0, -80) */
export function retroPC(x, y, s, screen = null) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const B = '#E8DFC6', BD = '#CFC3A2';
  rr(-160, 160, 320, 60, 12); ctx.fillStyle = BD; ctx.fill();
  rr(-260, -290, 520, 440, 30); ctx.fillStyle = B; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-220, -250, 440, 340, 22); ctx.fillStyle = '#2A3A3A'; ctx.fill();
  ctx.save(); rr(-200, -230, 400, 300, 14); ctx.clip(); ctx.fillStyle = '#D8E8E0'; ctx.fillRect(-200, -230, 400, 300); ctx.translate(0, -80); if (screen) screen(); ctx.restore();
  circle(200, 120, 10, GREEN); rr(-120, 110, 160, 14, 7); ctx.fillStyle = BD; ctx.fill();
  rr(-280, 240, 560, 70, 14); ctx.fillStyle = B; ctx.fill(); ctx.stroke();
  for (let r = 0; r < 2; r++) for (let c = 0; c < 10; c++) { rr(-255 + c * 51, 252 + r * 28, 42, 20, 5); ctx.fillStyle = BD; ctx.fill(); }
  ctx.restore();
}

/** phone screen with a cookie-consent banner at the bottom (for phone()). p 0..1 slides the banner up */
export function consentScreen(p = 1) {
  ctx.fillStyle = '#DCEEF6'; ctx.fillRect(-166, -350, 332, 700);
  ctx.fillStyle = BLUE; ctx.fillRect(-166, -350, 332, 120);
  for (let i = 0; i < 4; i++) { rr(-130, -190 + i * 70, 260 - (i % 2) * 70, 30, 15); ctx.fillStyle = '#B8D6E6'; ctx.fill(); }
  const by = lerp(420, 150, p);
  rr(-160, by, 320, 190, 24); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  cookie(-110, by + 50, 0.16);
  rr(-70, by + 30, 200, 18, 9); ctx.fillStyle = '#D4D4D8'; ctx.fill(); rr(-70, by + 60, 150, 18, 9); ctx.fill();
  rr(-130, by + 110, 260, 54, 27); ctx.fillStyle = C.ink; ctx.fill();
  ctx.fillStyle = C.white; ctx.font = '900 26px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('ACCEPT', 0, by + 138);
}

/** phone screen: signed-in account page ("HI, SAM!") for phone() */
export function accountScreen(p = 1) {
  ctx.fillStyle = '#DCEEF6'; ctx.fillRect(-166, -350, 332, 700);
  ctx.fillStyle = BLUE; ctx.fillRect(-166, -350, 332, 120);
  circle(0, -110, 70, C.skin); ell(0, -150, 72, 36, C.hair); circle(-22, -110, 8, C.ink); circle(22, -110, 8, C.ink);
  ctx.fillStyle = C.ink; ctx.font = '900 46px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('HI, SAM!', 0, 10);
  for (let i = 0; i < 3; i++) { rr(-130, 80 + i * 70, 260, 44, 22); ctx.fillStyle = '#B8D6E6'; ctx.fill(); }
}
