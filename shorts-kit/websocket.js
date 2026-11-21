// (15/30) Polling vs WebSockets components: walkie-talkie, radio waves, scoreboard card, gamepad card.
import { ctx, C, clamp, rr, circle, line } from './lib.js';

/** handheld walkie-talkie (flat dark body, antenna, grille, LED). s = 1 → ~120x260. talk 0..1 lights the LED */
export function walkieTalkie(x, y, s, talk = 0, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(28, -200, 22, 110, 11); ctx.fillStyle = C.ink; ctx.fill();
  rr(-62, -110, 124, 230, 26); ctx.fillStyle = '#2E3440'; ctx.fill();
  rr(-62, -110, 124, 46, [26, 26, 0, 0]); ctx.fillStyle = '#434C5E'; ctx.fill();
  rr(-42, -48, 84, 88, 12); ctx.fillStyle = '#1F232B'; ctx.fill();
  for (let k = 0; k < 4; k++) line([[-28, -30 + k * 20], [28, -30 + k * 20]], '#5E6775', 7);
  rr(-30, 60, 60, 34, 10); ctx.fillStyle = C.yellow; ctx.fill();
  circle(-30, -88, 10, talk > 0.5 ? '#5BAE6A' : '#7A1D26');
  ctx.restore();
}
/** radio wave arcs going out from (x, y) toward ang (rad); t animates; a = alpha */
export function radioWaves(x, y, s, ang = 0, t = 0, a = 1, col = C.yellow) {
  if (a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.lineCap = 'round';
  for (let k = 0; k < 3; k++) {
    const ph = (t * 1.6 + k / 3) % 1;
    ctx.globalAlpha = a * (1 - ph); ctx.lineWidth = 12 * s; ctx.strokeStyle = col;
    ctx.beginPath(); ctx.arc(0, 0, (30 + ph * 110) * s, -0.6, 0.6); ctx.stroke();
  }
  ctx.restore();
}
/** live score card: two team chips + score, LIVE dot. s = 1 → 300x200 */
export function scoreCard(x, y, s, a = 'LIV', b = 'MAD', score = '2 - 1', t = 0, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  rr(-150, -100, 300, 200, 30); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-150, -100, 300, 56, [30, 30, 0, 0]); ctx.fillStyle = C.red; ctx.fill();
  circle(-105, -72, 10, 0.5 + 0.5 * Math.sin(t * 8) > 0.4 ? C.white : '#F29AA7');
  ctx.fillStyle = C.white; ctx.font = '900 32px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('LIVE', -40, -70);
  ctx.fillStyle = C.ink; ctx.font = '900 30px Inter'; ctx.fillText(a, -95, 20); ctx.fillText(b, 95, 20);
  ctx.font = '900 58px Inter'; ctx.fillText(score, 0, 22);
  ctx.restore();
}
/** flat gamepad card (gameCard). s = 1 → ~300x180 */
export function gameCard(x, y, s, t = 0, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  rr(-150, -80, 300, 160, 80); ctx.fillStyle = '#8A63D2'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-104, -12, 64, 24, 8); ctx.fillStyle = C.ink; ctx.fill(); rr(-84, -32, 24, 64, 8); ctx.fill();
  const p = Math.floor(t * 4) % 4;
  [[78, -24, C.yellow], [106, 4, '#5BAE6A'], [78, 32, C.red], [50, 4, '#3A7BD5']].forEach(([bx, by, col], k) => circle(bx, by, k === p ? 17 : 14, col));
  ctx.restore();
}
