// Scaling components (Day 4: vertical vs horizontal scaling). Same flat look: flat fills, one darker shade, ink outlines on graphics.
import { ctx, C, lerp, clamp, rr, circle, ell, line } from './lib.js';

const GREEN = '#5BAE6A', CHIP = '#2E3440', CHIP_L = '#454D5C', GOLD = '#E6B82E';

/** CPU chip: dark square with gold pins and a "CPU" label. s = 1 → 240 px square body */
export function cpuChip(x, y, s, rot = 0, label = 'CPU') {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  for (let i = 0; i < 5; i++) { const k = -80 + i * 40;
    rr(k - 9, -150, 18, 40, 4); ctx.fillStyle = GOLD; ctx.fill(); rr(k - 9, 110, 18, 40, 4); ctx.fill();
    rr(-150, k - 9, 40, 18, 4); ctx.fill(); rr(110, k - 9, 40, 18, 4); ctx.fill(); }
  rr(-120, -120, 240, 240, 22); ctx.fillStyle = CHIP; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-80, -80, 160, 160, 14); ctx.fillStyle = CHIP_L; ctx.fill();
  circle(-95, -95, 9, GOLD);
  ctx.fillStyle = C.white; ctx.font = '900 62px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, 4);
  ctx.restore();
}

/** RAM stick: green board with black memory chips and gold contacts. s = 1 → 460x140 */
export function ramStick(x, y, s, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-230, -70, 460, 140, 12); ctx.fillStyle = GREEN; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-230, 40, 460, 30, [0, 0, 12, 12]); ctx.fillStyle = '#3F8A4E'; ctx.fill();
  for (let i = 0; i < 4; i++) { rr(-200 + i * 104, -50, 80, 72, 8); ctx.fillStyle = CHIP; ctx.fill(); }
  for (let i = 0; i < 18; i++) { rr(-212 + i * 24, 46, 12, 22, 3); ctx.fillStyle = GOLD; ctx.fill(); }
  ctx.fillStyle = C.ink; ctx.fillRect(-14, 40, 28, 34);
  ctx.restore();
}

/** red "ceiling" bar: a thick dashed red line across at y with a MAX label at its right end */
export function ceiling(y, x0 = 80, x1 = 1000, a = 1, label = 'MAX') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(a);
  ctx.setLineDash([46, 26]); line([[x0, y], [x1, y]], C.red, 16); ctx.setLineDash([]);
  ctx.restore();
}

/** thermometer (sick!). Drawn pointing from (x, y) along rot; s = 1 → 260 long. hot 0..1 fills red */
export function thermometer(x, y, s, rot = 0, hot = 1) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(0, -20, 240, 40, 20); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
  circle(240, 0, 30, C.white); ctx.beginPath(); ctx.arc(240, 0, 30, 0, Math.PI * 2); ctx.stroke();
  circle(240, 0, 20, C.red); rr(lerp(220, 40, clamp(hot)), -8, lerp(20, 200, clamp(hot)), 16, 8); ctx.fillStyle = C.red; ctx.fill();
  ctx.restore();
}

/** tiny face-down "sick" swirl (dizzy) above a head: three small ink arcs spinning */
export function dizzy(x, y, r, t, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y);
  for (let i = 0; i < 3; i++) { const an = t * 3 + i * 2.09; const px = Math.cos(an) * r, py = Math.sin(an) * r * 0.35;
    ctx.beginPath(); ctx.arc(px, py, 16, 0, Math.PI * 1.5); ctx.strokeStyle = C.ink; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.stroke(); }
  ctx.restore();
}
