// Inside Out: ZIP / COMPRESSION components (how a zip file shrinks files). Flat fills, one darker shade, ink outlines
// on graphics. zipFile, wordTile, tileWidth, noteChip, backArrow, bitBar, sizeMeter, zipGrid
import { ctx, C, lerp, clamp, rr, circle, line } from './lib.js';

const BLUE = '#2F6FE0', BLUE_D = '#2457B8', ZIPC = '#F2A93B', ZIPC_D = '#C9862A', GREY = '#D7CFBF';

/** a file icon with a zipper down the middle. s = 1 → 300x380. o: { open 0..1 (zipper pulled down), squash 0..1 (pressed flat),
 *  col (header colour), label (text on the page), rot, a } */
export function zipFile(x, y, s, o = {}) {
  if (s <= 0) return;
  const sq = clamp(o.squash || 0), open = clamp(o.open ?? 0), col = o.col || ZIPC, colD = o.colD || ZIPC_D;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s * (1 + sq * 0.12), s * (1 - sq * 0.38)); ctx.globalAlpha = clamp(o.a ?? 1);
  const w = 300, h = 380, f = 70;
  // shadow
  ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2 + 12); ctx.lineTo(w / 2 - f, -h / 2 + 12); ctx.lineTo(w / 2, -h / 2 + f + 12); ctx.lineTo(w / 2, h / 2 + 12); ctx.lineTo(-w / 2, h / 2 + 12); ctx.closePath(); ctx.fillStyle = GREY; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(w / 2 - f, -h / 2); ctx.lineTo(w / 2, -h / 2 + f); ctx.lineTo(w / 2, h / 2); ctx.lineTo(-w / 2, h / 2); ctx.closePath();
  ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 10; ctx.lineJoin = 'round'; ctx.strokeStyle = C.ink; ctx.stroke();
  // folded corner
  ctx.beginPath(); ctx.moveTo(w / 2 - f, -h / 2); ctx.lineTo(w / 2 - f, -h / 2 + f); ctx.lineTo(w / 2, -h / 2 + f); ctx.closePath(); ctx.fillStyle = colD; ctx.fill(); ctx.stroke();
  // zipper track: dark gap opens behind the pull
  const zx = -40, top = -h / 2 + 6, bot = h / 2 - 70, pullY = lerp(top + 40, bot, open);
  if (open > 0) { ctx.beginPath(); ctx.moveTo(zx, top); ctx.lineTo(zx - 26 * Math.min(1, open * 3), top + 20); ctx.lineTo(zx, pullY); ctx.lineTo(zx + 26 * Math.min(1, open * 3), top + 20); ctx.closePath(); ctx.fillStyle = C.ink; ctx.fill(); }
  for (let yy = top + 14; yy < bot; yy += 26) {
    const sp = yy < pullY ? 18 * Math.min(1, open * 3) : 0;
    rr(zx - 22 - sp, yy, 20, 14, 4); ctx.fillStyle = '#5A6070'; ctx.fill();
    rr(zx + 2 + sp, yy + 13, 20, 14, 4); ctx.fill();
  }
  // pull tab
  rr(zx - 22, pullY - 10, 44, 34, 8); ctx.fillStyle = '#8A93A6'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(zx - 14, pullY + 20, 28, 56, 12); ctx.fillStyle = '#8A93A6'; ctx.fill(); ctx.stroke(); circle(zx, pullY + 56, 7, C.ink);
  // label
  if (o.label !== null) {
    ctx.fillStyle = C.ink; ctx.font = `900 ${o.labelSize || 64}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(o.label || 'ZIP', 72, 60);
  }
  ctx.restore();
}

/** measured width of a wordTile at s = 1 */
export function tileWidth(text, size = 64) { ctx.save(); ctx.font = `900 ${size}px Inter`; const w = ctx.measureText(text).width + size * 0.9; ctx.restore(); return Math.max(w, size * 1.6); }

/** a word chip (one piece of text in a file). o: { bg, col, sc, size, ghost (dashed empty slot), rot, a }. origin = centre */
export function wordTile(x, y, s, text, o = {}) {
  const sc = o.sc ?? 1; if (sc <= 0 || s <= 0) return;
  const size = o.size || 64, w = tileWidth(text, size), h = size * 1.7;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s * sc, s * sc); ctx.globalAlpha = clamp(o.a ?? 1);
  if (o.ghost) {
    rr(-w / 2, -h / 2, w, h, 22); ctx.setLineDash([18, 14]); ctx.lineWidth = 7; ctx.strokeStyle = '#B9B0A0'; ctx.stroke(); ctx.setLineDash([]);
    ctx.restore(); return;
  }
  rr(-w / 2, -h / 2 + 9, w, h, 22); ctx.fillStyle = GREY; ctx.fill();
  rr(-w / 2, -h / 2, w, h, 22); ctx.fillStyle = o.bg || C.white; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
  ctx.fillStyle = o.col || C.ink; ctx.font = `900 ${size}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, size * 0.05);
  ctx.restore();
}

/** a tiny yellow "copy from back there" note: back-arrow glyph + short text. s = 1 → ~200x110. origin = centre */
export function noteChip(x, y, s, text = '↩', o = {}) {
  const sc = o.sc ?? 1; if (sc <= 0 || s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(s * sc, s * sc);
  ctx.font = '900 54px Inter'; const tw = ctx.measureText(text).width, w = tw + 120, h = 110;
  rr(-w / 2, -h / 2 + 9, w, h, 20); ctx.fillStyle = '#D9B12E'; ctx.fill();
  rr(-w / 2, -h / 2, w, h, 20); ctx.fillStyle = C.yellow; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
  // little curled back arrow on the left
  const ax = -w / 2 + 44;
  ctx.beginPath(); ctx.arc(ax + 6, 4, 20, -Math.PI * 0.9, Math.PI * 0.5); ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ax - 26, -18); ctx.lineTo(ax - 12, -4); ctx.lineTo(ax + 2, -22); ctx.lineJoin = 'round'; ctx.stroke();
  ctx.fillStyle = C.ink; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(text, ax + 34, 4);
  ctx.restore();
}

/** a dashed arc arrow from (x1, y) back to (x2, y), bulging up by h. p 0..1 draws it */
export function backArrow(x1, x2, y, h, p = 1, col = C.ink, lw = 9) {
  if (p <= 0) return;
  const N = 40, pts = [];
  for (let k = 0; k <= N * p; k++) { const u = k / N; pts.push([lerp(x1, x2, u), y - Math.sin(Math.PI * u) * h]); }
  ctx.save(); ctx.setLineDash([22, 16]); line(pts, col, lw); ctx.setLineDash([]);
  if (p > 0.95) {
    const [ex, ey] = pts[pts.length - 1], [px, py] = pts[pts.length - 3], an = Math.atan2(ey - py, ex - px);
    ctx.translate(ex, ey); ctx.rotate(an); ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(-30, -22); ctx.lineTo(-30, 22); ctx.closePath(); ctx.fillStyle = col; ctx.fill();
  }
  ctx.restore();
}

/** a row of 0/1 bit cells starting at x (left edge), centred on y. s = 1 → 56 px per bit. p 0..1 reveals cells. col = cell colour */
export function bitBar(x, y, s, bits, p = 1, col = C.cyan) {
  const n = Math.floor(bits.length * clamp(p) + 0.001), cw = 56 * s;
  ctx.save(); ctx.font = `900 ${Math.round(44 * s)}px 'DejaVu Sans Mono', monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (let i = 0; i < n; i++) {
    rr(x + i * cw, y - 36 * s, cw - 6 * s, 72 * s, 12 * s); ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 5 * s; ctx.strokeStyle = C.ink; ctx.stroke();
    ctx.fillStyle = C.ink; ctx.fillText(bits[i], x + i * cw + (cw - 6 * s) / 2, y + 3 * s);
  }
  ctx.restore();
}

/** horizontal size meter: label left, bar fills to frac. w = full width. origin = left edge, centre y */
export function sizeMeter(x, y, w, frac, label, col = BLUE, txt = null) {
  ctx.save();
  rr(x, y - 34, w, 68, 34); ctx.fillStyle = '#E4DCCB'; ctx.fill(); ctx.lineWidth = 7; ctx.strokeStyle = C.ink; ctx.stroke();
  if (frac > 0.02) { rr(x + 6, y - 28, (w - 12) * clamp(frac), 56, 28); ctx.fillStyle = col; ctx.fill(); }
  ctx.fillStyle = C.ink; ctx.font = '900 46px Inter'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.fillText(label, x - 24, y + 2);
  if (txt) { ctx.textAlign = 'left'; ctx.fillText(txt, x + w + 22, y + 2); }
  ctx.restore();
}

/** grid of tiny zip files (nested archives). n shown of cols x rows, cell = spacing. origin = grid centre */
export function zipGrid(x, y, cols, rows, cell, s, n = 1e9, t = 0) {
  let k = 0;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++, k++) {
    if (k >= n) return;
    const g = clamp(n - k);
    zipFile(x + (c - (cols - 1) / 2) * cell, y + (r - (rows - 1) / 2) * cell + Math.sin(t * 3 + k) * 4, s * g, { label: null });
  }
}
