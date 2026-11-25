// Inside Out: SMART SPEAKER components (how a smart speaker hears its wake word). Flat fills, one darker shade,
// ink outlines on graphics. X-ray view of the speaker uses the navy/cyan x-ray look.
// RING_BLUE, smartSpeaker, speakerTop, tvSet, waveBars, wakeCard, micIcon, sideTable
import { ctx, C, TAU, lerp, clamp, rr, circle, ell, line } from './lib.js';

export const RING_BLUE = '#2F8CFF';
const BODY = '#3D4656', BODY_D = '#2E3542', TOP = '#4E586B', TOP_D = '#434C5D';

/** smart speaker: fabric cylinder with a light ring on top. s = 1 → 300 wide x ~420 tall, origin = centre.
 *  o = { ring 0..1 (light ring on), ringCol, t (moving sheen on the ring), xray (see-through: mics, chip, wires, cone),
 *        mics 0..1 (x-ray mic glow), chip 0..1 (x-ray chip glow), cut 0..1 (x-ray mic wire cut), beat 0..1 (cone pulse) } */
export function smartSpeaker(x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const XR = !!o.xray, t = o.t || 0;
  ell(0, 214, 170, 26, 'rgba(0,0,0,0.12)');
  const body = () => { ctx.beginPath(); ctx.moveTo(-150, -150); ctx.lineTo(-150, 180); ctx.ellipse(0, 180, 150, 40, 0, Math.PI, 0, true); ctx.lineTo(150, -150); ctx.closePath(); };
  body(); ctx.fillStyle = XR ? C.xnavy : BODY; ctx.fill();
  if (XR) { ctx.lineWidth = 8; ctx.strokeStyle = C.cyan; ctx.stroke(); }
  else {
    ctx.save(); body(); ctx.clip();
    ctx.fillStyle = BODY_D; ctx.fillRect(80, -200, 80, 460);
    for (let r = 0; r < 9; r++) for (let c = 0; c < 12; c++) circle(-132 + c * 24 + (r % 2) * 12, -100 + r * 32, 3.5, 'rgba(255,255,255,0.08)');
    ctx.restore();
  }
  if (XR) {
    // mic wires from the board to the four mics on top
    const cut = o.cut || 0;
    for (const mx of [-90, -30, 30, 90]) {
      line([[mx * 0.6, -40], [mx, -110], [mx, -150]], cut > 0 ? 'rgba(79,209,232,0.35)' : C.cyan, 7);
      if (cut > 0) { rr(mx - 18, -100 - 8, 36, 16, 6); ctx.fillStyle = C.xnavy; ctx.fill(); }
    }
    // board + chip
    rr(-110, -40, 220, 90, 16); ctx.fillStyle = '#123552'; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = C.cyan; ctx.stroke();
    const cg = o.chip || 0;
    for (let k = 0; k < 4; k++) { ctx.fillStyle = C.cyan; ctx.fillRect(-44 + k * 26, -50, 10, 10); ctx.fillRect(-44 + k * 26, 30, 10, 10); }
    rr(-52, -40, 104, 70, 12); ctx.fillStyle = cg > 0 ? C.yellow : C.navy; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.cyan; ctx.stroke();
    ctx.fillStyle = cg > 0 ? C.ink : C.cyan; ctx.font = '900 26px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('WAKE', 0, -4);
    // speaker cone
    const b = o.beat || 0;
    circle(0, 125, 62 + b * 8, C.cyan); circle(0, 125, 54 + b * 8, C.xnavy); circle(0, 125, 30 + b * 4, C.cyan); circle(0, 125, 22 + b * 4, C.xnavy);
  }
  // top
  ell(0, -150, 150, 40, XR ? '#123552' : TOP);
  if (!XR) ell(0, -146, 112, 26, TOP_D);
  const on = clamp(o.ring || 0), rc = o.ringCol || RING_BLUE;
  ctx.save(); ctx.beginPath(); ctx.ellipse(0, -150, 138, 33, 0, 0, TAU); ctx.lineWidth = 16; ctx.strokeStyle = '#262C37'; ctx.stroke();
  if (on > 0) {
    ctx.globalAlpha = on; ctx.strokeStyle = rc; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, -150, 138, 33, 0, t * 4, t * 4 + 1.1); ctx.lineWidth = 16; ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.stroke();
  }
  ctx.restore();
  // mics on top (dots) + two buttons
  const mg = o.mics || 0;
  for (const mx of [-90, -30, 30, 90]) circle(mx, -150 + (Math.abs(mx) > 60 ? -6 : 8) * 0, XR ? 12 : 6, XR ? (mg > 0 ? C.yellow : C.cyan) : '#262C37');
  if (!XR) { circle(-50, -134, 11, '#2A303C'); circle(50, -134, 11, '#2A303C'); }
  ctx.restore();
}

/** a microphone glyph, optional red slash. s = 1 → ~70x110 */
export function micIcon(x, y, s, col = C.white, slash = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineCap = 'round';
  rr(-20, -55, 40, 70, 20); ctx.fillStyle = col; ctx.fill();
  ctx.beginPath(); ctx.arc(0, 0, 34, 0.15, Math.PI - 0.15); ctx.lineWidth = 9; ctx.strokeStyle = col; ctx.stroke();
  line([[0, 34], [0, 52]], col, 9); line([[-20, 52], [20, 52]], col, 9);
  if (slash > 0) { ctx.globalAlpha = clamp(slash); line([[-42, -50], [42, 52]], C.red, 13); }
  ctx.restore();
}

/** close-up of the speaker top seen from above. s = 1 → 760 px disc. ring 0..1, ringCol, press 0..1 on the mute button, t */
export function speakerTop(x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  circle(0, 14, 390, 'rgba(0,0,0,0.12)');
  circle(0, 0, 380, BODY_D); circle(0, 0, 350, TOP); circle(0, 0, 260, TOP_D);
  const on = clamp(o.ring || 0), rc = o.ringCol || RING_BLUE, t = o.t || 0;
  ctx.beginPath(); ctx.arc(0, 0, 318, 0, TAU); ctx.lineWidth = 34; ctx.strokeStyle = '#262C37'; ctx.stroke();
  if (on > 0) { ctx.save(); ctx.globalAlpha = on; ctx.strokeStyle = rc; ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 318, t * 3, t * 3 + 0.9); ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.stroke(); ctx.restore(); }
  for (const a of [0.8, 2.35, 3.95, 5.5]) circle(Math.cos(a) * 200, Math.sin(a) * 200, 12, '#262C37');
  // action button (left) and mute button (right)
  circle(-120, 0, 78, '#2A303C'); circle(-120, 0, 66, '#353C4A'); circle(-120, 0, 14, '#8C95A6');
  const p = clamp(o.press || 0), red = o.ringCol === C.red && on > 0;
  circle(120, 0, 78, '#2A303C'); circle(120, 0, 66 - p * 6, red ? '#4A2A30' : '#353C4A');
  micIcon(120, 4, 0.75 - p * 0.05, red ? C.red : '#8C95A6', 1);
  ctx.restore();
}

/** flat TV on a little stand. s = 1 → 640 x 400 screen. screen(t) draws in local coords (-300..300, -180..180) */
export function tvSet(x, y, s, screen = null) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-24, 200, 48, 60, 8); ctx.fillStyle = C.ink; ctx.fill(); rr(-140, 250, 280, 24, 12); ctx.fill();
  rr(-330, -210, 660, 420, 26); ctx.fillStyle = C.ink; ctx.fill();
  rr(-300, -180, 600, 360, 10); ctx.fillStyle = '#2C3E5C'; ctx.fill();
  if (screen) { ctx.save(); rr(-300, -180, 600, 360, 10); ctx.clip(); screen(); ctx.restore(); }
  ctx.restore();
}

/** a waveform made of vertical bars between x0..x0+w, centred on y. seed picks the shape; a = how loud */
export function waveBars(x0, y, w, h, seed = 1, col = C.ink, a = 1, n = 18) {
  const bw = w / n;
  for (let k = 0; k < n; k++) {
    const v = Math.abs(Math.sin(k * 1.7 + seed * 2.3) * 0.6 + Math.sin(k * 0.55 + seed) * 0.4);
    const bh = Math.max(10, v * h * a);
    rr(x0 + k * bw + bw * 0.18, y - bh / 2, bw * 0.64, bh, bw * 0.3); ctx.fillStyle = col; ctx.fill();
  }
}

/** the stored wake-word pattern: white card with a label and a waveform. match 0..1 turns it green. sc pops it */
export function wakeCard(x, y, s, label, seed = 1, match = 0, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  const G = '#3FAE5F';
  rr(-230, -110, 460, 220, 28); ctx.fillStyle = match > 0.5 ? '#E3F4E6' : C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = match > 0.5 ? G : C.ink; ctx.stroke();
  ctx.fillStyle = C.ink; ctx.font = '900 40px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, -62);
  waveBars(-190, 30, 380, 110, seed, match > 0.5 ? G : C.ink);
  ctx.restore();
}

/** small side table the speaker sits on. Origin = centre of the top. s = 1 → 420 wide */
export function sideTable(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-170, 20, 26, 330, 10); ctx.fillStyle = '#A0643F'; ctx.fill(); rr(144, 20, 26, 330, 10); ctx.fill();
  rr(-210, -10, 420, 40, 14); ctx.fillStyle = C.pot; ctx.fill(); rr(-210, 16, 420, 14, 6); ctx.fillStyle = '#A0643F'; ctx.fill();
  ctx.restore();
}
