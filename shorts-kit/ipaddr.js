// Inside Out: IP ADDRESS components (address label, octet tiles, map pin, video screen, stamp, mailbox,
// address blocks shelf, name card). Same flat look: flat fills, one darker shade, one light highlight,
// ink outlines only on graphics/cards. No brand logos.
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

const MONO = "'DejaVu Sans Mono', monospace";
const GREEN = '#5BAE6A', BLUE = '#3A7BD5', GOLD_D = '#E6B82E';

/** shipping-label style address tag: small header pill + mono text. Width fits the text. chars = typed-in count. sc pops */
export function ipLabel(x, y, s, text, { head = 'IP', chars = 1e9, col = C.yellow, sc = 1, rot = 0, size = 54 } = {}) {
  if (sc <= 0 || s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * sc, s * sc);
  ctx.font = `700 ${size}px ${MONO}`;
  const full = ctx.measureText(text).width, w = Math.max(full + 70, 260), h = size * 2.3;
  rr(-w / 2, -h / 2, w, h, 22); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-w / 2, -h / 2, w, size * 0.62, [22, 22, 0, 0]); ctx.fillStyle = col; ctx.fill(); ctx.stroke();
  if (head) { ctx.font = `900 ${Math.round(size * 0.42)}px Inter`; ctx.fillStyle = C.ink; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(head, -w / 2 + 24, -h / 2 + size * 0.32); }
  ctx.font = `700 ${size}px ${MONO}`; ctx.fillStyle = C.ink; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  const shown = text.slice(0, Math.max(0, Math.floor(chars)));
  ctx.fillText(shown, -full / 2, size * 0.36);
  ctx.restore();
}

/** four number tiles with dots between. nums = ['98','51','24','6']; tiles[i] 0..1 pop each tile; dots 0..1; hi = tile index lit red */
export function octets(x, y, s, nums, tiles = [1, 1, 1, 1], dots = 1, hi = -1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const tw = 190, gap = 64, total = 4 * tw + 3 * gap;
  for (let i = 0; i < 4; i++) {
    const p = tiles[i]; if (p <= 0) continue;
    const cx = -total / 2 + tw / 2 + i * (tw + gap);
    ctx.save(); ctx.translate(cx, 0); ctx.scale(p, p);
    rr(-tw / 2, -120, tw, 240, 30); ctx.fillStyle = i === hi ? C.red : C.ink; ctx.fill();
    rr(-tw / 2 + 14, -106, tw - 28, 140, 20); ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fill();
    ctx.font = '900 104px Inter'; ctx.fillStyle = i === hi ? C.white : C.yellow; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(nums[i], 0, 6);
    ctx.restore();
  }
  if (dots > 0) for (let i = 0; i < 3; i++) {
    const cx = -total / 2 + tw + gap / 2 + i * (tw + gap);
    circle(cx, 92, 24 * dots, C.red);
  }
  ctx.restore();
}

/** map pin (where). s = 1 → 160 wide, 230 tall; tip at (x, y) */
export function mapPin(x, y, s, col = C.red) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ell(0, 0, 50, 14, 'rgba(0,0,0,0.15)');
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(-30, -60, -80, -100, -80, -150); ctx.arc(0, -150, 80, Math.PI, 0); ctx.bezierCurveTo(80, -100, 30, -60, 0, 0); ctx.closePath();
  ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  circle(0, -150, 32, C.white);
  ell(-38, -186, 16, 9, 'rgba(255,255,255,0.4)', -0.7);
  ctx.restore();
}

/** video player phone screen: dark frame, play button (play 0..1 turns into a moving picture), progress bar */
export function videoScreen(play = 0, t = 0) {
  ctx.fillStyle = C.navy; ctx.fillRect(-166, -350, 332, 700);
  rr(-150, -170, 300, 200, 18); ctx.fillStyle = play > 0 ? C.sky : '#2A2F3A'; ctx.fill();
  if (play > 0) {
    ctx.save(); rr(-150, -170, 300, 200, 18); ctx.clip();
    circle(60 + Math.sin(t * 2) * 20, -120, 30, C.yellow);
    ell(-60 + (t * 40) % 80, -30, 120, 50, GREEN); ell(90, -10, 110, 46, '#3F8A4E');
    ctx.restore();
  }
  if (play < 1) {
    ctx.save(); ctx.globalAlpha = 1 - play; circle(0, -70, 52, C.red);
    ctx.beginPath(); ctx.moveTo(-16, -98); ctx.lineTo(28, -70); ctx.lineTo(-16, -42); ctx.closePath(); ctx.fillStyle = C.white; ctx.fill(); ctx.restore();
  }
  rr(-150, 60, 300, 12, 6); ctx.fillStyle = '#3A4256'; ctx.fill();
  rr(-150, 60, 300 * clamp(play * 0.35 + (play > 0 ? (t * 0.05) % 0.6 : 0)), 12, 6); ctx.fillStyle = C.red; ctx.fill();
  for (let i = 0; i < 3; i++) { rr(-150, 110 + i * 70, 90, 54, 10); ctx.fillStyle = '#2A2F3A'; ctx.fill(); rr(-48, 116 + i * 70, 190 - i * 30, 14, 7); ctx.fillStyle = '#4A5268'; ctx.fill(); rr(-48, 142 + i * 70, 120, 12, 6); ctx.fill(); }
}

/** red rubber stamp with text, rotated. a = alpha, s pops */
export function stamp(x, y, s, text = 'SOLD OUT', rot = -0.2, a = 1) {
  if (s <= 0 || a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.globalAlpha = a;
  ctx.font = '900 110px Inter'; const w = ctx.measureText(text).width + 90;
  rr(-w / 2, -95, w, 190, 26); ctx.lineWidth = 18; ctx.strokeStyle = C.red; ctx.stroke();
  rr(-w / 2 + 22, -73, w - 44, 146, 14); ctx.lineWidth = 6; ctx.stroke();
  ctx.fillStyle = C.red; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 6);
  ctx.restore();
}

/** a mailbox on a post with an address plate. s = 1 → 240 wide, post down to y + 300. flag 0..1 raises the flag */
export function mailbox(x, y, s, plate = '12', flag = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-18, 40, 36, 260, 8); ctx.fillStyle = '#7A4A2A'; ctx.fill();
  ctx.save(); ctx.translate(100, -10); ctx.rotate(-flag * Math.PI / 2); rr(-8, -90, 16, 90, 6); ctx.fillStyle = C.ink; ctx.fill(); rr(-8, -90, 60, 40, 6); ctx.fillStyle = C.red; ctx.fill(); ctx.restore();
  ctx.beginPath(); ctx.moveTo(-120, 60); ctx.lineTo(-120, -20); ctx.arc(0, -20, 120, Math.PI, 0); ctx.lineTo(120, 60); ctx.closePath(); ctx.fillStyle = BLUE; ctx.fill();
  rr(60, -100, 60, 160, [0, 60, 0, 0]); ctx.fillStyle = '#2F67BE'; ctx.fill();
  rr(-80, -10, 130, 56, 10); ctx.fillStyle = C.white; ctx.fill();
  ctx.fillStyle = C.ink; ctx.font = '900 42px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(plate, -15, 20);
  ctx.restore();
}

/** a shelf of address blocks (yellow crates). n crates; taken 0..n = how many have been lifted away (they rise + fade) */
export function blockShelf(x, y, s, n = 5, taken = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const cw = 150, total = n * cw + (n - 1) * 20;
  rr(-total / 2 - 40, 90, total + 80, 34, 10); ctx.fillStyle = '#7A4A2A'; ctx.fill();
  rr(-total / 2 - 20, 124, 26, 120, 6); ctx.fill(); rr(total / 2 - 6, 124, 26, 120, 6); ctx.fill();
  for (let i = 0; i < n; i++) {
    const k = clamp(taken - i); if (k >= 1) continue;
    const cx = -total / 2 + cw / 2 + i * (cw + 20), cy = 15 - k * 260;
    ctx.save(); ctx.globalAlpha = clamp(1 - k * 1.6); ctx.translate(cx, cy);
    rr(-cw / 2, -75, cw, 150, 18); ctx.fillStyle = C.yellow; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
    rr(-cw / 2, -75, cw, 36, [18, 18, 0, 0]); ctx.fillStyle = GOLD_D; ctx.fill(); ctx.stroke();
    ctx.fillStyle = C.ink; ctx.font = `700 34px ${MONO}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('IP', 0, 20);
    ctx.restore();
  }
  ctx.restore();
}

/** a name / ID card (who you are). s = 1 → 420x260 */
export function nameCard(x, y, s, name = 'SAM LEE', rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-210, -130, 420, 260, 26); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-210, -130, 420, 60, [26, 26, 0, 0]); ctx.fillStyle = BLUE; ctx.fill(); ctx.stroke();
  rr(-180, -45, 120, 140, 14); ctx.fillStyle = '#DCEEF6'; ctx.fill();
  circle(-120, 0, 30, C.skin); ell(-120, -20, 32, 16, C.hair); rr(-160, 36, 80, 50, [30, 30, 0, 0]); ctx.fillStyle = BLUE; ctx.fill();
  ctx.fillStyle = C.ink; ctx.font = '900 40px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(name, -30, -10);
  rr(-30, 30, 200, 14, 7); ctx.fillStyle = '#B9C6CF'; ctx.fill(); rr(-30, 60, 150, 14, 7); ctx.fill();
  ctx.restore();
}
