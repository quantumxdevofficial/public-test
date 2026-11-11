// Inside Out: emoji components (flat emoji faces in two "vendor" looks, heart emoji, code chip, Unicode list card,
// empty "tofu" box, person emoji for the family, invisible joiner ghost, chat screen with an emoji bubble).
// Flat fills, one darker shade, one light highlight, ink outlines only on graphics/cards.
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

const MONO = 'ui-monospace, Menlo, Consolas, monospace';
const TEAR = '#7FC8F8', GREEN = '#5BAE6A';
// look 'a' = round bright yellow face, look 'b' = warmer orange face with different eyes/mouth (another vendor's art)
const LOOK = { a: ['#FFD43B', '#F2B92A', '#FFE68A'], b: ['#F9B233', '#E0951F', '#FCCB6B'] };

/** emoji face. s = 1 → 200 px wide. kind 'laugh' | 'smile' | 'wow'; look 'a' | 'b'; t animates tears */
export function emojiFace(x, y, s, kind = 'laugh', look = 'a', t = 0, rot = 0) {
  if (s <= 0) return;
  const [base, shade, hi] = LOOK[look] || LOOK.a;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  circle(0, 0, 100, shade); circle(-6, -6, 94, base); ell(-34, -48, 30, 16, hi);
  if (kind === 'laugh') {
    if (look === 'a') {
      for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(sd * 36, -14, 18, Math.PI * 1.1, Math.PI * 1.9); ctx.strokeStyle = C.ink; ctx.lineWidth = 11; ctx.stroke(); }
      ctx.beginPath(); ctx.moveTo(-58, 18); ctx.quadraticCurveTo(0, 26, 58, 18); ctx.quadraticCurveTo(0, 96, -58, 18); ctx.fillStyle = C.mouth; ctx.fill();
      ctx.beginPath(); ctx.moveTo(-46, 22); ctx.quadraticCurveTo(0, 30, 46, 22); ctx.lineTo(40, 34); ctx.quadraticCurveTo(0, 42, -40, 34); ctx.closePath(); ctx.fillStyle = C.white; ctx.fill();
    } else {
      for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sd * 52, -30); ctx.lineTo(sd * 24, -14); ctx.lineTo(sd * 52, 0); ctx.strokeStyle = C.ink; ctx.lineWidth = 11; ctx.stroke(); }
      rr(-50, 16, 100, 52, [8, 8, 40, 40]); ctx.fillStyle = C.mouth; ctx.fill();
      ell(0, 54, 30, 12, C.pink);
    }
    const drip = (t * 1.6) % 1;
    for (const sd of [-1, 1]) {
      const tx = sd * (look === 'a' ? 70 : 76), ty = -6 + drip * 30;
      ctx.beginPath(); ctx.moveTo(tx, ty - 26); ctx.quadraticCurveTo(tx + sd * 24, ty + 4, tx, ty + 16); ctx.quadraticCurveTo(tx - sd * 20, ty + 4, tx, ty - 26); ctx.fillStyle = TEAR; ctx.fill();
    }
  } else if (kind === 'wow') {
    for (const sd of [-1, 1]) { ell(sd * 34, -18, 13, 18, C.ink); circle(sd * 34 + 4, -24, 5, C.white); }
    ell(0, 44, 22, 26, C.mouth);
  } else {
    for (const sd of [-1, 1]) { ell(sd * 34, -20, 11, 16, C.ink); circle(sd * 34 + 3, -25, 4, C.white); }
    ctx.beginPath(); ctx.moveTo(-46, 24); ctx.quadraticCurveTo(0, 66, 46, 24); ctx.strokeStyle = C.mouth; ctx.lineWidth = 11; ctx.stroke();
  }
  ctx.restore();
}

/** red heart emoji. s = 1 → ~200 wide */
export function heartEmoji(x, y, s, beat = 0) {
  if (s <= 0) return;
  const k = 1 + 0.08 * beat;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * k, s * k);
  const path = () => { ctx.beginPath(); ctx.moveTo(0, 80); ctx.bezierCurveTo(-120, 0, -110, -100, -50, -96); ctx.bezierCurveTo(-18, -94, 0, -70, 0, -50); ctx.bezierCurveTo(0, -70, 18, -94, 50, -96); ctx.bezierCurveTo(110, -100, 120, 0, 0, 80); ctx.closePath(); };
  path(); ctx.fillStyle = '#B81F2E'; ctx.fill();
  ctx.translate(-5, -5); path(); ctx.fillStyle = C.red; ctx.fill();
  ell(-48, -56, 22, 12, '#EE6672');
  ctx.restore();
}

/** dark code chip with a yellow monospace code (e.g. 'U+1F602'). s = 1 → height 110 */
export function codeChip(x, y, s, text, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.font = `900 64px ${MONO}`; const w = ctx.measureText(text).width + 70;
  rr(-w / 2, -55, w, 110, 26); ctx.fillStyle = C.ink; ctx.fill();
  rr(-w / 2 + 8, -47, w - 16, 26, 14); ctx.fillStyle = '#2E2E36'; ctx.fill();
  ctx.fillStyle = C.yellow; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 4);
  ctx.restore();
}

/** the giant Unicode list: a card with rows [code, drawFn]. hi = index of highlighted row, scroll = px offset */
const ROWS = [['U+1F600', 'smile'], ['U+1F601', 'smile'], ['U+1F602', 'laugh'], ['U+1F603', 'wow'], ['U+2764', 'heart'], ['U+1F604', 'smile'], ['U+1F605', 'wow'], ['U+1F606', 'laugh']];
export function unicodeList(x, y, s, hi = -1, scroll = 0, hiP = 1) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-330, -440, 660, 880, 40); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-330, -440, 660, 130, [40, 40, 0, 0]); ctx.fillStyle = C.ink; ctx.fill();
  ctx.fillStyle = C.white; ctx.font = '900 66px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('UNICODE', 0, -375);
  ctx.save(); rr(-320, -300, 640, 730, 30); ctx.clip();
  for (let k = -2; k < 14; k++) {
    const ry = -240 + k * 120 - scroll; if (ry < -360 || ry > 500) continue;
    const [code, kind] = ROWS[((k % ROWS.length) + ROWS.length) % ROWS.length];
    if (k === hi && hiP > 0) { ctx.save(); ctx.globalAlpha = clamp(hiP); rr(-310, ry - 54, 620, 108, 24); ctx.fillStyle = C.yellow; ctx.fill(); ctx.restore(); }
    ctx.fillStyle = C.ink; ctx.font = `800 52px ${MONO}`; ctx.textAlign = 'left'; ctx.fillText(code, -270, ry + 2);
    if (kind === 'heart') heartEmoji(210, ry + 6, 0.38); else emojiFace(210, ry, 0.42, kind, 'a', 0);
    line([[-300, ry + 60], [300, ry + 60]], '#E4DCCB', 4);
  }
  ctx.restore();
  ctx.restore();
}

/** empty "tofu" box: what an old phone shows for a code it doesn't know. s = 1 → 180 x 220 */
export function tofu(x, y, s, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-90, -110, 180, 220, 18); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 14; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.restore();
}

/** person emoji (yellow head + shoulders). s = 1 → ~180 wide. hair colour, kid = smaller head-to-body */
export function personEmoji(x, y, s, hair = C.hair, shirt = C.shirt, look = 'a') {
  if (s <= 0) return;
  const [base, shade] = LOOK[look] || LOOK.a;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-90, 40, 180, 140, [80, 80, 20, 20]); ctx.fillStyle = shirt; ctx.fill();
  circle(0, -40, 78, shade); circle(-4, -44, 74, base);
  ctx.beginPath(); ctx.arc(-4, -50, 76, Math.PI * 1.05, Math.PI * 1.95); ctx.closePath(); ctx.fillStyle = hair; ctx.fill();
  for (const sd of [-1, 1]) { ell(sd * 26 - 4, -36, 9, 13, C.ink); circle(sd * 26 - 1, -40, 3.5, C.white); }
  ctx.beginPath(); ctx.moveTo(-26, -6); ctx.quadraticCurveTo(-4, 14, 18, -6); ctx.strokeStyle = C.mouth; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.stroke();
  ctx.restore();
}

/** the invisible zero width joiner: a dashed ghost box with a "+" glue. a = alpha, t animates the dash */
export function joiner(x, y, s, a = 1, t = 0) {
  if (s <= 0 || a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha = a;
  ctx.setLineDash([18, 14]); ctx.lineDashOffset = -t * 60; ctx.lineWidth = 8; ctx.strokeStyle = C.ink;
  rr(-46, -70, 92, 140, 18); ctx.stroke(); ctx.setLineDash([]);
  line([[-22, 0], [22, 0]], C.ink, 12); line([[0, -22], [0, 22]], C.ink, 12);
  ctx.restore();
}

/** phone screen: a chat with one emoji message. draw(x, y) paints the emoji at the bubble; p 0..1 = bubble pops in */
export function emojiChat(draw, p = 1, mine = true, name = 'Chat') {
  ctx.fillStyle = '#EAF4EC'; ctx.fillRect(-166, -350, 332, 700);
  ctx.fillStyle = GREEN; ctx.fillRect(-166, -350, 332, 110);
  circle(-110, -285, 28, C.white); ctx.fillStyle = C.white; ctx.font = '900 30px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(name, -70, -285);
  if (p > 0) {
    ctx.save(); const bx = mine ? 40 : -40; ctx.translate(bx, -20); ctx.scale(clamp(p), clamp(p));
    rr(-110, -110, 220, 220, 44); ctx.fillStyle = mine ? '#C9EFC0' : C.white; ctx.fill();
    draw(0, 0);
    ctx.restore();
  }
  rr(-146, 270, 230, 56, 28); ctx.fillStyle = C.white; ctx.fill();
  circle(122, 298, 30, GREEN);
  ctx.beginPath(); ctx.moveTo(110, 284); ctx.lineTo(138, 298); ctx.lineTo(110, 312); ctx.closePath(); ctx.fillStyle = C.white; ctx.fill();
}

/** small vendor badge under a phone: an apple-free generic label pill, e.g. 'iPHONE' / 'ANDROID' */
export function osBadge(x, y, s, text, col = C.ink) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.font = '900 46px Inter'; const w = ctx.measureText(text).width + 60;
  rr(-w / 2, -38, w, 76, 38); ctx.fillStyle = col; ctx.fill();
  ctx.fillStyle = C.white; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 2);
  ctx.restore();
}
