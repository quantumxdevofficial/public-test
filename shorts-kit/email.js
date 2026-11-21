// Inside Out: EMAIL DELIVERY components. Flat fills, one darker shade, one highlight, ink outlines on graphics.
// composeScreen, inboxScreen, addressCard, atSign, mailEnvelope, filterGate, mxServer
import { ctx, C, lerp, clamp, rr, circle, ell, line } from './lib.js';

const BLUE = '#3A7BD5', GREEN = '#5BAE6A', MONO = "'DejaVu Sans Mono', monospace";

/** phone screen (for phone()): new-email form. typed 0..1 types the body lines; press 0..1 = SEND button pressed; gone 0..1 = form flies away */
export function composeScreen(typed = 1, press = 0, gone = 0, to = 'sam@gmail.com') {
  ctx.fillStyle = C.white; ctx.fillRect(-166, -350, 332, 700);
  ctx.fillStyle = BLUE; ctx.fillRect(-166, -350, 332, 110);
  ctx.fillStyle = C.white; ctx.font = '900 32px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('New email', -140, -292);
  ctx.save(); ctx.globalAlpha = 1 - clamp(gone); ctx.translate(0, -gone * 120);
  ctx.fillStyle = '#6A7080'; ctx.font = '700 24px Inter'; ctx.fillText('To:', -140, -200);
  ctx.fillStyle = C.ink; ctx.font = `700 24px ${MONO}`; ctx.fillText(to, -90, -200);
  line([[-150, -170], [150, -170]], '#DADDE3', 3);
  const ws = [250, 200, 270, 150, 220];
  ws.forEach((w, i) => { const k = clamp(typed * ws.length - i); if (k > 0) { rr(-140, -130 + i * 46, w * k, 22, 11); ctx.fillStyle = '#C9CED8'; ctx.fill(); } });
  ctx.restore();
  // SEND button
  const sy = 240 + press * 6, ss = 1 - press * 0.08;
  ctx.save(); ctx.translate(0, sy); ctx.scale(ss, ss);
  rr(-120, -42, 240, 84, 42); ctx.fillStyle = press > 0.5 ? '#2F67BE' : BLUE; ctx.fill();
  ctx.fillStyle = C.white; ctx.font = '900 38px Inter'; ctx.textAlign = 'center'; ctx.fillText('SEND ➤', 0, 3);
  ctx.restore();
}

/** phone screen (for phone()): inbox list. p 0..1 slides the new (bold, blue-dot) email in at the top */
export function inboxScreen(p = 1, from = 'You', subj = 'Hi Sam!') {
  ctx.fillStyle = C.white; ctx.fillRect(-166, -350, 332, 700);
  ctx.fillStyle = BLUE; ctx.fillRect(-166, -350, 332, 110);
  ctx.fillStyle = C.white; ctx.font = '900 34px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('Inbox', -140, -292);
  const off = lerp(0, 110, clamp(p));
  for (let i = 0; i < 5; i++) {
    const y = -180 + i * 110 + off;
    circle(-112, y, 30, ['#E57A8A', '#F29A3A', '#5BAE6A', '#7C8391', '#C8734A'][i]);
    rr(-66, y - 24, 180, 18, 9); ctx.fillStyle = '#C9CED8'; ctx.fill(); rr(-66, y + 8, 130, 14, 7); ctx.fillStyle = '#E1E4EA'; ctx.fill();
    line([[-150, y + 55], [150, y + 55]], '#EEF0F3', 3);
  }
  if (p > 0) {
    const y = lerp(-300, -180, clamp(p));
    ctx.save(); ctx.globalAlpha = clamp(p * 2);
    rr(-160, y - 52, 320, 104, 14); ctx.fillStyle = '#EAF2FD'; ctx.fill();
    circle(-112, y, 30, BLUE); ctx.fillStyle = C.white; ctx.font = '900 30px Inter'; ctx.textAlign = 'center'; ctx.fillText('@', -112, y + 2);
    ctx.fillStyle = C.ink; ctx.textAlign = 'left'; ctx.font = '900 28px Inter'; ctx.fillText(from, -66, y - 16);
    ctx.font = '600 22px Inter'; ctx.fillStyle = '#4A5060'; ctx.fillText(subj, -66, y + 18);
    circle(136, y - 16, 10, BLUE);
    ctx.restore();
  }
}

/** big email address card "sam@gmail.com". s = 1 → ~860x200. hiP 0..1 sweeps a yellow highlight over the domain; atP pulses the @ */
export function addressCard(x, y, s, user = 'sam', domain = 'gmail.com', hiP = 0, atP = 0, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  ctx.font = `700 92px ${MONO}`;
  const wu = ctx.measureText(user).width, wa = ctx.measureText('@').width, wd = ctx.measureText(domain).width;
  const tw = wu + wa + wd, w = tw + 120;
  rr(-w / 2, -100, w, 200, 36); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  const x0 = -tw / 2;
  if (hiP > 0) { rr(x0 + wu + wa - 8, -58, (wd + 16) * clamp(hiP), 116, 18); ctx.fillStyle = C.yellow; ctx.fill(); }
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = C.ink;
  ctx.fillText(user, x0, 4);
  ctx.save(); ctx.translate(x0 + wu + wa / 2, 4); ctx.scale(1 + atP * 0.35, 1 + atP * 0.35); ctx.fillStyle = atP > 0 ? BLUE : C.ink; ctx.textAlign = 'center'; ctx.fillText('@', 0, 0); ctx.restore();
  ctx.fillText(domain, x0 + wu + wa, 4);
  ctx.restore();
}
/** x position (canvas) of the centre of the domain part of an addressCard drawn at (x, s) */
export function addressDomainX(x, s, user = 'sam', domain = 'gmail.com') {
  ctx.save(); ctx.font = `700 92px ${MONO}`;
  const wu = ctx.measureText(user).width, wa = ctx.measureText('@').width, wd = ctx.measureText(domain).width; ctx.restore();
  const tw = wu + wa + wd; return x + (-tw / 2 + wu + wa + wd / 2) * s;
}

/** a big chunky @ sign tile. s = 1 → 300 px. col = glyph colour */
export function atSign(x, y, s, rot = 0, col = C.yellow, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * sc, s * sc);
  rr(-150, -150, 300, 300, 60); ctx.fillStyle = C.ink; ctx.fill();
  rr(-150, -150, 300, 300 * 0.3, [60, 60, 0, 0]); ctx.fillStyle = '#2A2A30'; ctx.fill();
  ctx.fillStyle = col; ctx.font = '900 250px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('@', 0, 10);
  ctx.restore();
}

/** an envelope that is spam or ok: white envelope with a red SPAM band or a green tick dot. s = 1 → 220x140 */
export function mailEnvelope(x, y, s, spam = false, rot = 0, a = 1) {
  if (s <= 0 || a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.lineJoin = 'round';
  rr(-110, -70, 220, 140, 14); ctx.fillStyle = spam ? '#FBE3E6' : C.white; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-104, -64); ctx.lineTo(0, 10); ctx.lineTo(104, -64); ctx.stroke();
  if (spam) { rr(-80, 18, 160, 44, 10); ctx.fillStyle = C.red; ctx.fill(); ctx.fillStyle = C.white; ctx.font = '900 32px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('SPAM', 0, 41); }
  else { circle(78, 40, 20, GREEN); line([[68, 40], [76, 48], [90, 32]], C.white, 6); }
  ctx.restore();
}

/** the spam filter: a flat funnel/gate with a shield badge. s = 1 → 520 wide, 420 tall. glow 0..1 lights the shield */
export function filterGate(x, y, s, glow = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-260, -200); ctx.lineTo(260, -200); ctx.lineTo(70, 60); ctx.lineTo(70, 210); ctx.lineTo(-70, 210); ctx.lineTo(-70, 60); ctx.closePath();
  ctx.fillStyle = '#7C8391'; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-230, -180); ctx.lineTo(230, -180); ctx.lineTo(200, -140); ctx.lineTo(-200, -140); ctx.closePath(); ctx.fillStyle = '#9AA1AE'; ctx.fill();
  // shield
  ctx.save(); ctx.translate(0, -40);
  ctx.beginPath(); ctx.moveTo(0, -80); ctx.lineTo(70, -55); ctx.quadraticCurveTo(70, 40, 0, 85); ctx.quadraticCurveTo(-70, 40, -70, -55); ctx.closePath();
  ctx.fillStyle = glow > 0.5 ? C.yellow : C.white; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  line([[-28, 0], [-6, 24], [32, -22]], C.ink, 12);
  ctx.restore();
  ctx.restore();
}

/** a mail server: server() look + a small envelope badge on top. Draw with tech.server, then this badge. */
export function mailBadge(x, y, s, col = BLUE) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  circle(0, 0, 70, col); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.arc(0, 0, 70, 0, Math.PI * 2); ctx.stroke();
  rr(-40, -26, 80, 52, 8); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 5; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-37, -23); ctx.lineTo(0, 6); ctx.lineTo(37, -23); ctx.stroke();
  ctx.restore();
}

/** a calendar-style year card. s = 1 → 560x520. year text on a white card with a red top bar and binder rings */
export function yearCard(x, y, s, year = '1971', label = 'YEAR', rot = 0, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * sc, s * sc);
  rr(-280, -260, 560, 520, 40); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-280, -260, 560, 130, [40, 40, 0, 0]); ctx.fillStyle = C.red; ctx.fill(); ctx.stroke();
  for (const bx of [-140, 140]) { rr(bx - 16, -300, 32, 80, 16); ctx.fillStyle = C.ink; ctx.fill(); }
  ctx.fillStyle = C.white; ctx.font = '900 64px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.letterSpacing = '6px'; ctx.fillText(label, 0, -192); ctx.letterSpacing = '0px';
  ctx.fillStyle = C.ink; ctx.font = '900 210px Inter'; ctx.fillText(year, 0, 70);
  ctx.restore();
}
