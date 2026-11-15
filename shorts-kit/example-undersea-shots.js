// HOW DOES THE INTERNET CROSS THE OCEAN? (undersea cables): the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const disc = () => { fillAll(C.bg); circle(540, 740, 520, '#E4DCCB'); };
const office = () => { fillAll(C.bg); ctx.fillStyle = C.floor; ctx.fillRect(-300, 1400, W + 600, 900); };
const heldPhone = (screen) => (x, y) => K.phone(x + 12, y - 70, 0.3, screen);

// world map
const MX = 540, MY = 720, MW = 1000, MH = 600;
const city = (c) => K.mapXY(MX, MY, MW, MH, c);
const qpt = (a, b, h, u) => { const cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2 - h; return [(1 - u) ** 2 * a[0] + 2 * (1 - u) * u * cx + u * u * b[0], (1 - u) ** 2 * a[1] + 2 * (1 - u) * u * cy + u * u * b[1]]; };
function cableArc(a, b, h, p = 1, col = C.red, w = 9) {
  if (p <= 0) return;
  for (const [ww, c] of [[w + 6, C.ink], [w, col]]) {
    ctx.save(); ctx.lineCap = 'round'; ctx.lineWidth = ww; ctx.strokeStyle = c; ctx.beginPath();
    const n = 40; for (let i = 0; i <= n * clamp(p); i++) { const [x, y] = qpt(a, b, h, i / n); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.stroke(); ctx.restore();
  }
}
const ROUTES = [['ny', 'london', 40], [[-120, 34], [-157, 21], 20], ['sao', 'lagos', 30], ['tokyo', 'sydney', -40], [[140, 36], [176, 18], 20],
  [[-80, 25], [-17, 15], 20], [[-74, 39], [-9, 38], -30], [[73, 15], [97, 4], 20], [[40, -22], [115, -32], 30], [[-46, -25], [18, -34], -20]];
const routes = (p, col = C.red) => ROUTES.forEach(([a, b, h], k) => cableArc(city(a), city(b), h, p(k), col));
const EXTRA = Array.from({ length: 14 }, (_, k) => { const r = ROUTES[k % ROUTES.length]; return [city(r[0]), city(r[1]), r[2] + (k < 10 ? 25 : -25) * (k % 2 ? 1 : -1)]; });

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · How does the internet get across an ocean? ──────────────────
  {
    const st = cut(0), it = Wd('internet', 0) - st, ac = Wd('across', 0) - st, oc = Wd('ocean', 0) - st;
    const A = city('ny'), B = city('london');
    add({ id: 'S01', at: st, cam: [540, 700], zoom: 0.14, note: 'world map; phones at New York and London; a message card hops from NY on "across", stalls over the Atlantic; big ? + OCEAN pill on "ocean"',
      draw(lt, d, t) {
        fillAll(C.bg);
        K.flatMap(MX, MY, MW, MH, E(seg(lt, 0, 0.3)));
        K.phone(A[0], A[1] - 40, 0.22 * E(seg(lt, 0.15, 0.4)), () => K.homeScreen());
        K.phone(B[0], B[1] - 40, 0.22 * E(seg(lt, 0.25, 0.5)), () => K.homeScreen());
        if (lt > it) K.globe(540, 290, 0.9 * E(seg(lt, it, it + 0.25)), t);
        const u = eo(seg(lt, ac, oc)) * 0.5;
        if (lt > ac) { const [x, y] = qpt(A, B, 200, u); K.envelope(x, y - 40 + Math.sin(lt * 10) * 6 * (u >= 0.5 ? 1 : 0), 0.45); }
        if (lt > oc) { bigText('?', 540, 620, 200, C.red, Math.sin(lt * 6) * 0.08, E(seg(lt, oc, oc + 0.25))); K.pill('OCEAN', 540, 1150, 70, C.ink, C.white, E(seg(lt, oc, oc + 0.25))); }
      } });
    cue(st + 0.05, 'pop', { gain: 0.4 }); cue(st + it, 'pop', { gain: 0.35 }); cue(st + ac, 'slide', { dur: 0.5, gain: 0.25 }); cue(st + oc, 'boing', { gain: 0.35 });
  }
  // ── 2 · You'd guess satellites, but nope ────────────────────────────
  {
    const st = cut(1), sa = Wd('satellites', 1) - st, no = Wd('nope', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 600], zoom: 0.12, note: 'space, Earth curve; satellite drops in on "satellites" beaming down; big red X on "nope"',
      draw(lt, d, t) {
        K.space(t); K.earthCap(1150, t * 20);
        const p = E(seg(lt, sa - 0.15, sa + 0.2));
        if (lt > sa && lt < no) K.waves(540, 640, lt - sa, { ang: Math.PI / 2, spread: 0.6, n: 3, maxR: 420, speed: 1.4, col: C.yellow, w: 16 });
        K.satellite(540, lerp(-200, 500, p), 0.9 * clamp(p * 1.2), Math.sin(t) * 0.05, t);
        if (lt > sa) K.pill('SATELLITES?', 540, 190, 72, C.white, C.ink, E(seg(lt, sa, sa + 0.25)));
        if (lt > no) K.redX(540, 520, lerp(1.6, 1.0, eo(seg(lt, no, no + 0.2))), 1);
      } });
    cue(st, 'whoosh'); cue(st + sa - 0.1, 'slide', { dur: 0.3, gain: 0.25 }); cue(st + no + 0.05, 'slam', { gain: 0.4 });
  }
  // ── 3 · almost all of it runs through cables ────────────────────────
  {
    const st = cut(2), al = Wd('all', 2) - st, ru = Wd('runs', 2) - st, cb = Wd('cables', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 720], zoom: 0.1, note: 'world map; cable lines draw across the oceans from "runs"; 99% pill on "all"; CABLES pill on "cables"',
      draw(lt, d, t) {
        fillAll(C.bg); K.flatMap(MX, MY, MW, MH);
        routes((k) => eio(seg(lt, ru - 0.2 + k * 0.08, ru + 0.4 + k * 0.08)));
        if (lt > al) K.pill('≈ 99% OF IT', 540, 260, 76, C.yellow, C.ink, E(seg(lt, al, al + 0.25)));
        if (lt > cb) K.pill('CABLES', 540, 1150, 72, C.red, C.white, E(seg(lt, cb, cb + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + al, 'pop', { gain: 0.4 }); cue(st + ru, 'slide', { dur: 0.8, gain: 0.25 }); cue(st + cb, 'pop', { gain: 0.4 });
  }
  // ── 4 · lying right on the sea floor ───────────────────────────────
  {
    const st = cut(3), ri = Wd('right', 3) - st, fl = Wd('floor', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 820], zoom: 0.1, note: 'camera sinks underwater; fish swim; cable on the sand with yellow data pulses; SEA FLOOR pill on "floor"',
      draw(lt, d, t) {
        const sink = eio(seg(lt, 0, 0.7));
        ctx.save(); ctx.translate(0, lerp(500, 0, sink));
        K.underwater(t, 160, 1080);
        K.fish(lerp(-150, 1250, (lt * 0.18) % 1), 520, 0.8, 1, '#F29A3A', t);
        K.fish(lerp(1250, -150, (lt * 0.14 + 0.4) % 1), 760, 0.6, -1, C.pink, t);
        K.seaCable(-300, 1380, 1060, 1);
        if (lt > ri) for (let k = 0; k < 5; k++) { const x = -300 + (((lt - ri) * 900 + k * 340) % 1700); K.pulse(x, K.seaCableY(x, 1060), 20); }
        ctx.restore();
        if (lt > fl) K.pill('ON THE SEA FLOOR', 540, 330, 66, C.yellow, C.ink, E(seg(lt, fl, fl + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'bubbles', { dur: 0.8, gain: 0.35 }); cue(st + ri, 'zip', { gain: 0.35 }); cue(st + fl, 'pop', { gain: 0.45 });
  }
  // ── 5 · Hundreds of them stretch over a million kilometres ─────────
  {
    const st = cut(4), hu = Wd('hundreds', 4) - st, sr = Wd('stretch', 4) - st, mi = Wd('million', 4) - st, km = Wd('kilometres', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 720], zoom: 0.12, note: 'map fills with many cables from "hundreds"; HUNDREDS OF CABLES pill; km counter rolls up to 1,000,000+ KM on "million"',
      draw(lt, d, t) {
        fillAll(C.bg); K.flatMap(MX, MY, MW, MH);
        routes(() => 1);
        EXTRA.forEach(([a, b, h], k) => cableArc(a, b, h, eio(seg(lt, hu + k * 0.05, hu + 0.4 + k * 0.05)), k % 3 ? '#3A7BD5' : '#F29A3A', 7));
        if (lt > hu) K.pill('HUNDREDS OF CABLES', 540, 260, 64, C.ink, C.white, E(seg(lt, hu, hu + 0.25)));
        if (lt > sr) {
          const n = Math.round(lerp(0, 1000000, eo(seg(lt, sr, mi + 0.2))));
          K.pill(n.toLocaleString('en-US') + (lt > mi + 0.2 ? '+ KM' : ' KM'), 540, 1150, 70, lt > mi + 0.2 ? C.yellow : C.white, C.ink, E(seg(lt, sr, sr + 0.25)));
        }
      } });
    cue(st, 'whoosh'); cue(st + hu, 'sparkle', { dur: 0.7, gain: 0.25 }); for (let i = 0; i < 6; i++) cue(st + sr + i * 0.14, 'tock', { gain: 0.14 }); cue(st + km, 'pop', { gain: 0.45 });
  }
  // ── 6a · and way down deep ─────────────────────────────────────────
  {
    const st = cut(5), dp = Wd('deep', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.1, note: 'camera dives: water darkens, depth line grows; cable on the dark sea floor; DEEP SEA pill on "deep"',
      draw(lt, d, t) {
        const g = eio(seg(lt, 0, dp + 0.3));
        ctx.save(); ctx.translate(0, lerp(300, 0, g));
        K.underwater(t, -900, 1080);
        ctx.restore();
        K.depthBand(g);
        ctx.save(); ctx.setLineDash([24, 18]); line([[180, 160], [180, lerp(160, 960, g)]], C.yellow, 10); ctx.restore();
        K.seaCable(-300, 1380, 1060, 1);
        if (lt > dp) K.pill('DEEP SEA', 540, 300, 76, C.yellow, C.ink, E(seg(lt, dp, dp + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'bubbles', { dur: 1.0, gain: 0.3 }); cue(st + dp, 'pop', { gain: 0.4 });
  }
  // ── 6b · they're only as thick as a garden hose ─────────────────────
  {
    const st = Wd("they're", 5) - 0.12, th = Wd('thick', 5) - st, ga = Wd('garden', 5) - st, ho = Wd('hose', 5) - st;
    add({ id: 'S07', at: st, cam: [540, 650], zoom: 0.1, note: 'cable end-on (left) pops; ≈ 2 CM tag on "thick"; garden hose end pops next to it on "garden"; SAME SIZE! pill on "hose"',
      draw(lt, d, t) {
        disc();
        K.cableSection(310, 640, 0.9 * E(seg(lt, 0, 0.3)), 0, t);
        if (lt > th) { ctx.save(); ctx.globalAlpha = clamp(seg(lt, th, th + 0.2)); line([[130, 870], [490, 870]], C.ink, 8); line([[130, 845], [130, 895]], C.ink, 8); line([[490, 845], [490, 895]], C.ink, 8); ctx.restore(); K.pill('≈ 2 CM', 310, 950, 56, C.yellow, C.ink, E(seg(lt, th, th + 0.25))); }
        if (lt > ga - 0.1) K.hoseEnd(770, 640, 0.9 * E(seg(lt, ga - 0.1, ga + 0.2)));
        if (lt > ga) K.pill('GARDEN HOSE', 770, 1150, 52, C.ink, C.white, E(seg(lt, ga, ga + 0.25)));
        if (lt > ho) K.pill('SAME SIZE!', 540, 250, 76, C.yellow, C.ink, E(seg(lt, ho, ho + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + th, 'pop', { gain: 0.35 }); cue(st + ga, 'pop', { gain: 0.4 }); cue(st + ho, 'boing', { gain: 0.35 });
  }
  // ── 7 · Inside are hair-thin strands of glass ──────────────────────
  {
    const st = cut(6), ins = Wd('inside', 6) - st, sd = Wd('strands', 6) - st, gl = Wd('glass', 6) - st;
    add({ id: 'S08', at: st, cam: [540, 640], zoom: 0.16, note: 'big cable cross-section; layers peel in from "inside" (steel, copper, gel); coloured glass fibres pop in on "strands"; GLASS pill on "glass"',
      draw(lt, d, t) {
        disc();
        const p = clamp(lerp(0, 0.74, seg(lt, ins, sd)) + lerp(0, 0.26, seg(lt, sd, sd + 0.5)));
        K.cableSection(540, 650, 1.9, p, t);
        if (lt > sd + 0.3) K.tag('FIBRES', 880, 260, 600, 600, 50, E(seg(lt, sd + 0.3, sd + 0.55)));
        if (lt > gl) K.pill('GLASS', 540, 1170, 76, C.yellow, C.ink, E(seg(lt, gl, gl + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ins, 'slide', { dur: 0.6, gain: 0.2 }); cue(st + sd, 'sparkle', { dur: 0.6, gain: 0.3 }); cue(st + gl, 'pop', { gain: 0.4 });
  }
  // ── 8 · and your messages zip through them as flashes of light ─────
  {
    const st = cut(7), me = Wd('messages', 7) - st, zi = Wd('zip', 7) - st, fl = Wd('flashes', 7) - st, li = Wd('light', 7) - st;
    const Y = [420, 640, 860];
    add({ id: 'S09', at: st, cam: [540, 640], zoom: 0.12, note: 'three glass fibres across the screen; chat bubbles pop at left on "messages", shrink into yellow light flashes that zip right from "zip"; FLASHES OF LIGHT pill on "flashes"',
      draw(lt, d, t) {
        fillAll('#1E2A44');
        Y.forEach((y) => K.fiber(-300, 1380, y, 30));
        Y.forEach((y, k) => {
          const b = E(seg(lt, me + k * 0.1, me + 0.25 + k * 0.1)) * (1 - seg(lt, zi - 0.05, zi + 0.15));
          if (b > 0) K.bubble(250 + k * 40, y - 70, 1.15, ['hey!', 'lol', 'ok'][k], b);
          if (lt > zi) for (let j = 0; j < 3; j++) { const x = -200 + (((lt - zi) * 1500 + j * 520 + k * 170) % 1700); K.lightFlash(x, y, 180, 1, 22); }
        });
        if (lt > fl) K.pill('FLASHES OF LIGHT', 540, 1060, 64, C.yellow, C.ink, E(seg(lt, fl, fl + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + me, 'pop', { gain: 0.35 }); cue(st + zi, 'zip', { gain: 0.45 }); cue(st + li, 'sparkle', { dur: 0.4, gain: 0.3 });
  }
  // ── 9 · Every so often, a repeater boosts the light ────────────────
  {
    const st = cut(8), re = Wd('repeater', 8) - st, bo = Wd('boosts', 8) - st;
    const RX = 540, CY = 900;
    add({ id: 'S10', at: st, cam: [540, 800], zoom: 0.12, note: 'underwater, cable across; a flash travels left→right getting dimmer; repeater pod drops onto the cable on "repeater"; flash passes through and comes out bright on "boosts"; BOOST! pill',
      draw(lt, d, t) {
        K.underwater(t, -400, 960); K.depthBand(0.5);
        K.seaCable(-300, 1380, CY, 1);
        const rp = E(seg(lt, re - 0.15, re + 0.2));
        if (lt > re - 0.15) K.repeater(RX, lerp(400, K.seaCableY(RX, CY), clamp(rp)), 0.8, lt > bo ? 1 : 0);
        const x = lerp(-150, RX, seg(lt, 0, bo)) + (lt > bo ? (lt - bo) * 900 : 0);
        const a = lt < bo ? lerp(1, 0.25, seg(lt, 0, bo)) : 1;
        if (x < 1300 && Math.abs(x - RX) > 60) K.lightFlash(x, K.seaCableY(x, CY), 130, a, 22);
        if (lt > re) K.pill('REPEATER', 540, 300, 70, C.ink, C.white, E(seg(lt, re, re + 0.25)));
        if (lt > bo) K.pill('BOOST!', 540, 460, 76, C.yellow, C.ink, E(seg(lt, bo, bo + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + re, 'thud', { gain: 0.35 }); cue(st + bo, 'sparkle', { dur: 0.5, gain: 0.35 }); cue(st + bo + 0.1, 'zip', { gain: 0.35 });
  }
  // ── 10 · so it can cross a whole ocean ──────────────────────────────
  {
    const st = cut(9), cr = Wd('cross', 9) - st, oc = Wd('ocean', 9) - st;
    const AM = (c) => K.mapXY(830, 1132, 3000, 1800, c), A = AM('ny'), B = AM('london');
    add({ id: 'S11', at: st, cam: [540, 700], zoom: 0.1, note: 'map; NY→London cable with small repeater dots; a light flash races across from "cross"; envelope lands at London; ACROSS THE OCEAN! pill on "ocean"',
      draw(lt, d, t) {
        fillAll(C.bg); K.flatMap(830, 1132, 3000, 1800);
        cableArc(A, B, 120, 1, C.red, 16);
        for (let k = 1; k < 6; k++) { const [x, y] = qpt(A, B, 120, k / 6); circle(x, y, 18, C.ink); circle(x, y, 12, '#AEB7C4'); }
        const u = eio(seg(lt, cr - 0.1, oc + 0.1));
        if (u > 0 && u < 1) { const [x, y] = qpt(A, B, 120, u); circle(x, y, 44, 'rgba(255,212,59,0.4)'); circle(x, y, 26, C.yellow); }
        K.phone(B[0] + 40, B[1] - 150, 0.4, () => K.homeScreen());
        if (u >= 1) K.envelope(B[0] + 40, B[1] - 360, 0.6 * E(seg(lt, oc + 0.1, oc + 0.35)));
        if (lt > oc) K.pill('ACROSS THE OCEAN!', 540, 1180, 62, C.yellow, C.ink, E(seg(lt, oc, oc + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + cr - 0.1, 'slide', { dur: 0.8, gain: 0.3 }); cue(st + oc + 0.1, 'pop', { gain: 0.45 });
  }
  // ── 11a · Here's the twist: sharks ──────────────────────────────────
  {
    const st = cut(10), tw = Wd('twist', 10) - st, sh = Wd('sharks', 10) - st;
    add({ id: 'S12', at: st, cam: [540, 760], zoom: 0.1, note: 'underwater with the cable; TWIST pill (red) on "twist"; a shark swims in from the right on "sharks"',
      draw(lt, d, t) {
        K.underwater(t, 160, 1080);
        K.seaCable(-300, 1380, 1060, 1);
        const sx = lerp(1500, 600, eo(seg(lt, sh - 0.3, sh + 0.5)));
        K.shark(sx, 700, 1.0, -1, t);
        if (lt > tw) K.pill('TWIST', 540, 300, 80, C.red, C.white, E(seg(lt, tw, tw + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + tw, 'slam', { gain: 0.3 }); cue(st + sh - 0.3, 'slide', { dur: 0.7, gain: 0.3 });
  }
  // ── 11b · have actually bitten these cables! ───────────────────────
  {
    const st = Wd('have', 10) - 0.1, bi = Wd('bitten', 10) - st, cb = Wd('cables', 10) - st;
    add({ id: 'S13', at: st, cam: [600, 900], zoom: 0.2, note: 'close: shark noses down to the cable, jaw opens, CHOMP! on "bitten" with shock lines; IT REALLY HAPPENS pill on "cables"',
      draw(lt, d, t) {
        K.underwater(t, -200, 1080);
        K.seaCable(-300, 1380, 1060, 1);
        const dive = eio(seg(lt, 0, bi));
        const bite = lt < bi - 0.3 ? 0 : lt < bi ? seg(lt, bi - 0.3, bi) : Math.max(0, 1 - seg(lt, bi, bi + 0.15)) * 0.3 + 0.1 * Math.abs(Math.sin((lt - bi) * 14));
        const shake = lt > bi && lt < bi + 0.6 ? Math.sin(lt * 50) * 8 : 0;
        ctx.save(); ctx.translate(lerp(820, 830, dive) + shake, lerp(620, 985, dive)); ctx.rotate(lerp(0.15, -0.38, dive));
        K.shark(0, 0, 1.1, -1, t, bite);
        ctx.restore();
        if (lt > bi) { K.shockLines(560, 1050, 150, 1 - seg(lt, bi + 0.3, bi + 0.6)); bigText('CHOMP!', 540, 470, 140, C.yellow, -0.08, E(seg(lt, bi, bi + 0.2))); }
        if (lt > cb) K.pill('IT REALLY HAPPENS', 540, 300, 60, C.ink, C.white, E(seg(lt, cb, cb + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + bi, 'slam', { gain: 0.4 }); cue(st + cb, 'pop', { gain: 0.35 });
  }
  // ── 12a · But the real villains ─────────────────────────────────────
  {
    const st = cut(11), re = Wd('real', 11) - st, vi = Wd('villains', 11) - st;
    add({ id: 'S14', at: st, cam: [540, 600], zoom: 0.12, note: 'sea surface view: shark swims off left; fishing boat and a big ship sail in at the surface on "villains"; THE REAL VILLAINS red pill',
      draw(lt, d, t) {
        K.underwater(t, 640, 1080);
        K.seaCable(-300, 1380, 1060, 1);
        K.shark(lerp(600, -500, eio(seg(lt, 0, 0.9))), 880, 0.6, -1, t);
        K.trawler(lerp(-400, 300, eo(seg(lt, re - 0.2, vi + 0.3))), 640, 0.7, t);
        K.ship(lerp(1500, 860, eo(seg(lt, re, vi + 0.4))), 600, 0.45, t, 3);
        if (lt > re) K.pill('THE REAL VILLAINS', 540, 230, 66, C.red, C.white, E(seg(lt, re, re + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + re, 'slam', { gain: 0.3 }); cue(st + re, 'slide', { dur: 0.8, gain: 0.25 });
  }
  // ── 12b · are fishing nets and ship anchors ─────────────────────────
  {
    const st = Wd('are', 11) - 0.1, ne = Wd('nets', 11) - st, an = Wd('anchors', 11) - st;
    add({ id: 'S15', at: st, cam: [540, 760], zoom: 0.1, note: 'side view: trawler drags a net down onto the cable on "nets"; anchor drops on its chain and hits the cable on "anchors" (shock lines); MOST BREAKS pill',
      draw(lt, d, t) {
        K.underwater(t, 300, 1080);
        K.seaCable(-300, 1380, 1060, 1);
        K.trawler(260, 300, 0.55, t);
        const nd = eio(seg(lt, 0, ne));
        K.net(330, 330, lerp(380, 420, nd), lerp(560, 950, nd), 300, 1);
        if (lt > ne) K.warning(330, 780, 0.45 * E(seg(lt, ne, ne + 0.2)));
        const ad = eio(seg(lt, an - 0.5, an));
        const ay = lerp(240, 720, ad);
        if (lt > an - 0.5) { K.chain(800, 260, 800, ay); K.anchor(800, ay, 0.75); }
        if (lt > an) { K.shockLines(800, 1050, 140, 1 - seg(lt, an + 0.3, an + 0.6)); K.pill('MOST BREAKS', 540, 1180, 66, C.red, C.white, E(seg(lt, an, an + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + ne - 0.4, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + ne, 'pop', { gain: 0.35 }); cue(st + an - 0.5, 'slide', { dur: 0.5, gain: 0.3 }); cue(st + an, 'thud', { gain: 0.5 });
  }
  // ── 13a · So that meme you just sent ────────────────────────────────
  {
    const st = cut(12), me = Wd('meme', 12) - st, se = Wd('sent', 12) - st;
    add({ id: 'S16', at: st, cam: [540, 650], zoom: 0.1, note: 'hero holding his phone; meme card pops above the phone on "meme" and flies off right on "sent"',
      draw(lt, d, t) {
        office();
        K.man({ x: 540, y: 1150, s: 0.95, arm: K.PHONE_ARM, holding: heldPhone(() => K.homeScreen()), eyes: 'n', mouth: 'grin', brow: 0.5 });
        const fly = eio(seg(lt, se, se + 0.5));
        if (lt > me) K.memeCard(lerp(640, 1300, fly), lerp(380, 200, fly), 0.8 * E(seg(lt, me, me + 0.25)), lerp(-0.08, 0.4, fly));
      } });
    cue(st, 'whoosh'); cue(st + me, 'pop', { gain: 0.4 }); cue(st + se, 'zip', { gain: 0.4 });
  }
  // ── 13b · abroad probably went for a swim ───────────────────────────
  {
    const st = Wd('abroad', 12) - 0.1, wn = Wd('went', 12) - st, sw = Wd('swim', 12) - st;
    add({ id: 'S17', at: st, cam: [540, 760], zoom: 0.12, note: 'underwater: the meme card (snorkel mask on) rides along the cable past fish; IT WENT FOR A SWIM pill on "swim"',
      draw(lt, d, t) {
        K.underwater(t, 160, 1080);
        K.fish(lerp(1250, -150, (lt * 0.2) % 1), 480, 0.7, -1, C.pink, t);
        K.seaCable(-300, 1380, 1060, 1);
        for (let k = 0; k < 4; k++) { const x = -300 + ((lt * 700 + k * 420) % 1700); K.pulse(x, K.seaCableY(x, 1060), 16); }
        const mx = lerp(-200, 560, eo(seg(lt, 0, wn + 0.2)));
        K.memeCard(mx, 800 + Math.sin(lt * 5) * 16, 0.7, Math.sin(lt * 4) * 0.1, lt > wn - 0.1);
        if (lt > sw) K.pill('IT WENT FOR A SWIM', 540, 300, 62, C.yellow, C.ink, E(seg(lt, sw, sw + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'bubbles', { dur: 1.0, gain: 0.3 }); cue(st + wn, 'plop', { gain: 0.35 }); cue(st + sw, 'boing', { gain: 0.4 });
  }

  return { shots: S, cues: CUES };
}
