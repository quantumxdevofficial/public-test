// (3/30) LATENCY VS THROUGHPUT: the shot list. Highway analogy: latency = how long ONE car takes start → finish,
// throughput = how many cars arrive per minute. Apps: latency = the wait after a tap (ms), throughput = requests/second.
// Twist: more lanes = more cars get through, but each car still drives just as long.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T, lineWords } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const GREEN = '#5BAE6A', BLUE = '#3A7BD5', ORANGE = '#F29A3A', PURPLE = '#8A63D2';
const CARS = [C.red, BLUE, ORANGE, GREEN, PURPLE, C.yellow, C.pink];
const bg = (ring = '#CFE8F3', base = C.sky) => { fillAll(base); circle(540, 740, 560, ring); };
const heldPhone = (screen) => (x, y) => K.phone(x + 12, y - 70, 0.3, screen);
const land = () => fillAll('#A9D69B');
const card = (x, y, w, h) => { rr(x - w / 2, y - h / 2, w, h, 40); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke(); };
// a steady stream of cars in each lane: lane k, i-th car; x wraps from -250 to W+250
const stream = (lanes, lt, speed, gapX, n = 1, skip = null) => {
  lanes.forEach((y, k) => { for (let i = 0; i < n; i++) {
    if (skip && skip(k, i)) continue;
    const span = W + 500, x = ((lt * speed + i * gapX + k * 170 + rnd(k) * 200) % span + span) % span - 250;
    K.carTop(x, y, 0.75, CARS[(k * 3 + i) % CARS.length]);
  } });
};

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · When people say an app is fast, ──
  {
    const st = cut(0), ap = Wd('app', 0) - st, fa = Wd('fast', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 700], zoom: 0.08, note: 'hero holding a phone; app opens on "app"; FAST! slams with speed lines on "fast", hero grins',
      draw(lt, d, t) {
        bg();
        K.man({ x: 540, y: 1000, s: 0.75, arm: K.PHONE_ARM, holding: heldPhone(() => (lt > ap ? K.feedScreen(1, t) : K.homeScreen())), eyes: 'n', mouth: lt > fa ? 'grin' : 'smile', brow: 0.5, look: 0.5 });
        if (lt > ap) K.ripple(605, 870, clamp((lt - ap) / 0.5));
        if (lt > fa) { K.speedLines(540, 300, 1); bigText('FAST!', 540, 300, 200, C.yellow, -0.06, E(seg(lt, fa, fa + 0.25))); }
      } });
    cue(st + ap, 'pop', { gain: 0.35 }); cue(st + fa, 'zip', { gain: 0.4 });
  }

  // ── 2 · they could mean two completely different things. ──
  {
    const st = cut(1), tw = Wd('two', 1) - st, df = Wd('different', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 720], zoom: 0.08, note: 'on "two" two cards pop: stopwatch HOW QUICK? and a pile of cars HOW MANY?; big yellow ≠ between them on "different"',
      draw(lt, d, t) {
        bg('#DDEFF6');
        const a = E(seg(lt, tw, tw + 0.3)), b = E(seg(lt, tw + 0.12, tw + 0.42));
        if (a > 0) { ctx.save(); ctx.translate(290, 720); ctx.scale(a, a); card(0, 0, 420, 600); K.stopwatch(0, -40, 0.5, t * 5); K.pill('HOW QUICK?', 0, 210, 50, C.ink, C.white); ctx.restore(); }
        if (b > 0) { ctx.save(); ctx.translate(790, 720); ctx.scale(b, b); card(0, 0, 420, 600); for (let k = 0; k < 6; k++) K.carTop(-80 + (k % 2) * 160, -190 + Math.floor(k / 2) * 120, 0.62, CARS[k]); K.pill('HOW MANY?', 0, 210, 50, C.ink, C.white); ctx.restore(); }
        if (lt > df) bigText('≠', 540, 720, 190, C.yellow, 0, E(seg(lt, df, df + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + tw, 'pop', { gain: 0.4 }); cue(st + tw + 0.12, 'pop', { gain: 0.3 }); cue(st + df, 'slam', { gain: 0.35 });
  }

  // ── 3 · Picture a highway. ──
  {
    const st = cut(2), hw = Wd('highway', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 760], zoom: 0.12, note: 'top-down highway, traffic flowing; HIGHWAY pill drops on "highway"',
      draw(lt, d, t) {
        land(); const lanes = K.highway(760, 3, 150);
        stream(lanes, lt + 3, 380, 520, 3);
        const sg = E(seg(lt, hw - 0.1, hw + 0.25));
        if (sg > 0) K.pill('HIGHWAY', 540, lerp(-100, 300, sg), 80, C.ink, C.yellow);
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 0.8, gain: 0.2 }); cue(st + hw, 'thud', { gain: 0.4 });
  }

  // ── 4 · Latency is how long one car takes ──
  {
    const st = cut(3), la = Wd('latency', 3) - st, ca = Wd('car', 3) - st, tk = Wd('takes', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 760], zoom: 0.08, note: 'empty highway, START strip left, FINISH strip right; LATENCY pill on "latency"; one red car glows on "car"; stopwatch pops on "takes"',
      draw(lt, d, t) {
        land(); const lanes = K.highway(760, 3, 150);
        K.finishLine(150, 535, 985); K.finishLine(930, 535, 985);
        K.carTop(290, lanes[1], 0.85 * E(seg(lt, 0, 0.3)), C.red, lt > ca ? 0.6 + 0.4 * Math.sin(lt * 8) : 0);
        if (lt > la) K.pill('LATENCY', 540, 260, 84, C.yellow, C.ink, E(seg(lt, la, la + 0.25)));
        if (lt > ca) K.tag('ONE CAR', 470, 1150, 300, 830, 54, E(seg(lt, ca, ca + 0.25)));
        if (lt > tk) K.stopwatch(880, 300, 0.3 * E(seg(lt, tk, tk + 0.25)), 0);
      } });
    cue(st, 'whoosh'); cue(st + la, 'pop', { gain: 0.4 }); cue(st + ca, 'pop', { gain: 0.3 }); cue(st + tk, 'pop', { gain: 0.35 });
  }

  // ── 5 · to get from the start to the finish. ──
  {
    const st = cut(4), gt = Wd('get', 4) - st, sa = Wd('start', 4) - st, fi = Wd('finish', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 760], zoom: 0.08, note: 'the red car drives START → FINISH (stopwatch hand runs while it drives); START pill on "start", FINISH pill + burst when it crosses on "finish"; ONE TRIP TIME pill',
      draw(lt, d, t) {
        land(); const lanes = K.highway(760, 3, 150);
        K.finishLine(150, 535, 985); K.finishLine(930, 535, 985);
        const u = eio(clamp((lt - gt + 0.05) / Math.max(0.4, fi - gt + 0.05)));
        if (u > 0 && u < 1) K.speedLines(lerp(290, 960, u) - 180, lanes[1], 0.6);
        K.carTop(lerp(290, 960, u), lanes[1], 0.85, C.red, 0.5);
        const run = clamp(lt - gt, 0, Math.max(0, fi - gt));
        K.stopwatch(880, 300, 0.3, run * 3);
        if (lt > sa) K.pill('START', 150, 470, 50, C.ink, C.white, E(seg(lt, sa, sa + 0.25)));
        if (lt > fi) { K.pill('FINISH', 930, 470, 50, C.ink, C.white, E(seg(lt, fi, fi + 0.25))); K.burst(960, lanes[1], 1.3, clamp(1 - (lt - fi) * 3)); K.pill('TIME FOR ONE TRIP', 540, 1160, 58, C.yellow, C.ink, E(seg(lt, fi + 0.15, fi + 0.4))); }
      } });
    cue(st, 'whoosh'); cue(st + gt, 'slide', { dur: Math.max(0.4, fi - gt), gain: 0.3 }); cue(st + sa, 'pop', { gain: 0.3 }); cue(st + fi, 'thud', { gain: 0.4 }); cue(st + fi + 0.15, 'pop', { gain: 0.35 });
  }

  // ── 6 · Throughput is how many cars arrive every minute. ──
  {
    const st = cut(5), th = Wd('throughput', 5) - st, ca = Wd('cars', 5) - st, ar = Wd('arrive', 5) - st, mi = Wd('minute', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.08, note: 'busy highway, FINISH strip right; THROUGHPUT pill on "throughput"; counter pops on "cars" and counts up as cars cross from "arrive"; label CARS / MINUTE on "minute"',
      draw(lt, d, t) {
        land(); const lanes = K.highway(760, 3, 150);
        stream(lanes, lt + 1, 420, 460, 4);
        K.finishLine(930, 535, 985);
        if (lt > th) K.pill('THROUGHPUT', 540, 140, 76, C.yellow, C.ink, E(seg(lt, th, th + 0.25)));
        if (lt > ca) { const n = lt < ar ? 0 : Math.floor(clamp((lt - ar) / (d - ar)) * 30); K.counterBox(540, 340, 0.75 * E(seg(lt, ca, ca + 0.25)), n, lt > mi ? 'CARS / MINUTE' : 'CARS'); }
      } });
    cue(st, 'whoosh'); cue(st + th, 'pop', { gain: 0.4 }); cue(st + ca, 'pop', { gain: 0.35 }); for (let k = 0; k < 5; k++) cue(st + ar + k * 0.3, 'tock', { gain: 0.2 }); cue(st + mi, 'pop', { gain: 0.3 });
  }

  // ── 7 · In apps, latency is the wait after you tap, ──
  {
    const st = cut(6), ap = Wd('apps', 6) - st, la = Wd('latency', 6) - st, wa = Wd('wait', 6) - st, tp = Wd('tap', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 700], zoom: 0.1, note: 'big phone; finger taps on "tap" (ripple), screen shows a spinner; LATENCY = THE WAIT pill on "wait"; hourglass-ish stopwatch',
      draw(lt, d, t) {
        bg();
        const tapAt = Math.min(tp, wa - 0.1);
        K.phone(540, 760, 0.95 * E(seg(lt, 0, 0.25)), () => { if (lt < tapAt + 0.1) K.homeScreen(); else { ctx.fillStyle = '#F7F4EE'; ctx.fillRect(-166, -350, 332, 700); K.waitRing(0, 0, 1.2, t); } });
        K.tapFinger(560, 700, eo(seg(lt, tapAt - 0.35, tapAt)), lt > tapAt && lt < tapAt + 0.2 ? 1 : 0);
        if (lt > tapAt) K.ripple(560, 700, clamp((lt - tapAt) / 0.5));
        if (lt > ap) K.pill('APPS', 540, 200, 64, C.ink, C.white, E(seg(lt, ap, ap + 0.25)));
        if (lt > wa) K.pill('LATENCY = THE WAIT', 540, 200, 64, C.yellow, C.ink, E(seg(lt, wa, wa + 0.25)));
        if (lt > la) K.stopwatch(890, 420, 0.24 * E(seg(lt, la, la + 0.25)), t * 4);
      } });
    cue(st, 'whoosh'); cue(st + ap, 'pop', { gain: 0.3 }); cue(st + la, 'pop', { gain: 0.3 }); cue(st + Math.min(tp, Wd('wait', 6) - st - 0.1), 'pop', { gain: 0.4 }); cue(st + wa, 'slam', { gain: 0.3 });
  }

  // ── 8 · measured in milliseconds, ──
  {
    const st = cut(7), me = Wd('measured', 7) - st, ms = Wd('milliseconds', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 700], zoom: 0.12, note: 'counter box ticks 0 → 120 ms from "measured"; pill 1 ms = 1/1000 SECOND on "milliseconds"',
      draw(lt, d, t) {
        bg('#DDEFF6');
        const n = Math.round(clamp((lt - me) / 0.9) * 120);
        K.counterBox(540, 640, 1.25 * E(seg(lt, 0, 0.25)), `${n} ms`, 'WAIT TIME');
        if (lt > ms) K.pill('1 ms = 1/1000 SECOND', 540, 1060, 58, C.yellow, C.ink, E(seg(lt, ms, ms + 0.25)));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 5; k++) cue(st + me + k * 0.16, 'tock', { gain: 0.18 }); cue(st + ms, 'pop', { gain: 0.4 });
  }

  // ── 9 · and throughput is how many requests ──
  {
    const st = cut(8), th = Wd('throughput', 8) - st, rq = Wd('requests', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 760], zoom: 0.08, note: 'column of phones left, server right; THROUGHPUT pill on "throughput"; on "requests" many envelopes stream along arcs into the server',
      draw(lt, d, t) {
        bg('#DDEFF6');
        K.server(800, 780, 0.75, t);
        for (let k = 0; k < 4; k++) K.phone(200, 420 + k * 220, 0.22 * E(seg(lt, k * 0.08, k * 0.08 + 0.25)), K.homeScreen);
        if (lt > rq) for (let k = 0; k < 10; k++) { const u = ((lt - rq) * 1.3 + k * 0.23) % 1, ly = 420 + (k % 4) * 220; if (lt - rq + k * 0.23 * 0.77 < 0) continue; const [x, y] = K.arcAt(280, ly, 740, 760, 80, u); K.envelope(x, y, 0.32, 0); }
        if (lt > th) K.pill('THROUGHPUT', 540, 200, 76, C.yellow, C.ink, E(seg(lt, th, th + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + th, 'pop', { gain: 0.4 }); cue(st + rq, 'slide', { dur: 1.0, gain: 0.3 });
  }

  // ── 10 · a server handles every second. ──
  {
    const st = cut(9), sv = Wd('server', 9) - st, hd = Wd('handles', 9) - st, sc = Wd('second', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 740], zoom: 0.1, note: 'big server centre (pops on "server"), gears spin on "handles", counter above climbs to 1,000; REQUESTS / SECOND label on "second"',
      draw(lt, d, t) {
        bg();
        K.server(540, 860, 0.85 * E(seg(lt, sv - 0.1, sv + 0.2)), t);
        if (lt > hd) { const p = E(seg(lt, hd, hd + 0.25)); K.gear(250, 760, 0.5 * p, t * 5, '#9AA3B2'); K.gear(830, 760, 0.5 * p, -t * 5, C.yellow); }
        const n = Math.round(clamp((lt - hd) / 1.0) * 1000);
        K.counterBox(540, 330, 0.95 * E(seg(lt, 0.05, 0.3)), n.toLocaleString('en-US'), lt > sc ? 'REQUESTS / SECOND' : 'REQUESTS');
      } });
    cue(st, 'whoosh'); cue(st + sv, 'thud', { gain: 0.35 }); cue(st + hd, 'pop', { gain: 0.3 }); cue(st + sc, 'pop', { gain: 0.4 });
  }

  // ── 11 · Here's the twist: ──
  {
    const st = cut(10), tw = Wd('twist', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.14, note: 'hero raises a finger, brows up; TWIST! slams in with shock lines on "twist"',
      draw(lt, d, t) {
        bg('#F7E3C8', C.bg);
        K.man({ x: 540, y: 1080, s: 0.85, arm: K.ARM.point, finger: Math.sin(lt * 10) * 0.3, eyes: 'wide', mouth: 'o', brow: 1, look: 0 });
        if (lt > tw) { K.shockLines(540, 330, 260, clamp(1 - (lt - tw) * 1.5)); bigText('TWIST!', 540, 330, 190, C.yellow, -0.06, E(seg(lt, tw, tw + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + tw, 'slam', { gain: 0.45 });
  }

  // ── 12 · add more lanes, and way more cars get through, ──
  {
    const st = cut(11), ln = Wd('lanes', 11) - st, mo = lineWords(11).filter((w) => w.w.toLowerCase().startsWith('more'))[1].s - st, th = Wd('through', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 760], zoom: 0.08, note: '2-lane road; on "lanes" it widens to 5 lanes (burst); from "more" cars fill every lane; counter jumps 30 → 75 on "through" with green THROUGHPUT ↑ pill',
      draw(lt, d, t) {
        land();
        const wide = lt > ln;
        const lanes = wide ? K.highway(760, 5, 120) : K.highway(760, 2, 150);
        if (wide && lt < ln + 0.3) K.burst(540, 760, 2.2, clamp(1 - (lt - ln) * 3.5));
        if (!wide) stream(lanes, lt + 2, 420, 460, 4);
        else stream(lanes, lt + 2, 420, 460, 4, (k, i) => lt < mo && (k === 0 || k > 2));
        if (lt > ln) K.pill('MORE LANES', 540, 1180, 58, C.ink, C.white, E(seg(lt, ln, ln + 0.25)));
        K.counterBox(540, 220, 0.62, lt > th ? Math.round(30 + 45 * clamp((lt - th) / 0.5)) : 30, 'CARS / MINUTE', lt > th ? '#8FE39B' : C.yellow);
      } });
    cue(st, 'whoosh'); cue(st + ln, 'slam', { gain: 0.35 }); cue(st + mo, 'slide', { dur: 0.6, gain: 0.3 }); cue(st + th, 'sparkle', { dur: 0.5, gain: 0.35 });
  }

  // ── 13 · but each car still drives just as long. ──
  {
    const st = cut(12), ca = Wd('car', 12) - st, sl = Wd('still', 12) - st, lo = Wd('long', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 760], zoom: 0.08, note: '5-lane busy highway with START/FINISH strips; the red car glows on "car" and drives at the same pace; stopwatch shows the same time; SAME TRIP TIME pill on "long"',
      draw(lt, d, t) {
        land(); const lanes = K.highway(760, 5, 120);
        K.finishLine(150, 460, 1060); K.finishLine(930, 460, 1060);
        stream(lanes, lt + 2, 420, 460, 4, (k) => k === 2);
        const dr = Math.max(0.6, lo - sl + 0.1), u = eio(clamp((lt - sl) / dr));
        K.carTop(lerp(290, 960, u), lanes[2], 0.85, C.red, lt > ca ? 0.6 + 0.4 * Math.sin(lt * 8) : 0);
        K.stopwatch(880, 220, 0.3, clamp(lt - sl, 0, dr) * 3);
        if (lt > lo) K.pill('SAME TRIP TIME', 540, 1180, 58, C.yellow, C.ink, E(seg(lt, lo, lo + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ca, 'pop', { gain: 0.3 }); cue(st + sl, 'slide', { dur: 0.8, gain: 0.25 }); cue(st + lo, 'thud', { gain: 0.4 });
  }

  // ── 14 · Great systems need both: ──
  {
    const st = cut(13), sy = Wd('systems', 13) - st, bo = Wd('both', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 720], zoom: 0.08, note: 'two cards: stopwatch LOW LATENCY and counter HIGH THROUGHPUT; green checks pop on both on "both"',
      draw(lt, d, t) {
        bg('#DDEFF6');
        const a = E(seg(lt, 0, 0.3)), b = E(seg(lt, 0.12, 0.42));
        if (a > 0) { ctx.save(); ctx.translate(290, 740); ctx.scale(a, a); card(0, 0, 440, 620); K.stopwatch(0, -60, 0.5, t * 2); K.pill('LOW LATENCY', 0, 220, 48, C.ink, C.white); ctx.restore(); }
        if (b > 0) { ctx.save(); ctx.translate(790, 740); ctx.scale(b, b); card(0, 0, 440, 620); K.counterBox(0, -60, 0.95, '9,999', 'PER SEC'); K.pill('HIGH THROUGHPUT', 0, 220, 38, C.ink, C.white); ctx.restore(); }
        if (lt > sy) K.pill('GREAT SYSTEMS', 540, 260, 70, C.yellow, C.ink, E(seg(lt, sy, sy + 0.25)));
        if (lt > bo) { K.check(380, 470, 0.5 * E(seg(lt, bo, bo + 0.25))); K.check(880, 470, 0.5 * E(seg(lt, bo + 0.12, bo + 0.37))); }
      } });
    cue(st, 'whoosh'); cue(st + sy, 'pop', { gain: 0.35 }); cue(st + bo, 'sparkle', { dur: 0.5, gain: 0.35 });
  }

  // ── 15 · short waits, and lots of traffic. ──
  {
    const st = cut(14), sh = Wd('short', 14) - st, lo = Wd('lots', 14) - st, tr = Wd('traffic', 14) - st;
    add({ id: 'S15', at: st, cam: [540, 760], zoom: 0.1, note: '4-lane highway; on "short" a red car zips across fast with speed lines (SHORT WAITS pill + check); from "lots" every lane fills with fast cars, LOTS OF TRAFFIC pill on "traffic"',
      draw(lt, d, t) {
        land(); const lanes = K.highway(760, 4, 140);
        if (lt > lo) stream(lanes, lt + 2, 700, 380, 5, (k, i) => (lt - lo) < (k * 0.08 + i * 0.05));
        else { const u = clamp((lt - sh) / 0.5); if (lt > sh && u < 1) { K.speedLines(lerp(-200, 1300, u) - 180, lanes[1], 0.7); K.carTop(lerp(-200, 1300, u), lanes[1], 0.85, C.red, 0.5); } }
        if (lt > sh + 0.2) K.pill('SHORT WAITS  ✓', 540, 300, 64, GREEN, C.white, E(seg(lt, sh + 0.2, sh + 0.45)));
        if (lt > tr) K.pill('LOTS OF TRAFFIC  ✓', 540, 1190, 60, C.yellow, C.ink, E(seg(lt, tr, tr + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sh, 'zip', { gain: 0.4 }); cue(st + sh + 0.2, 'pop', { gain: 0.35 }); cue(st + lo, 'slide', { dur: 0.6, gain: 0.3 }); cue(st + tr, 'pop', { gain: 0.4 });
  }

  // ── 16 · Tomorrow: one bigger computer, or more computers? ──
  {
    const st = cut(15), tm = Wd('tomorrow', 15) - st, bg2 = Wd('bigger', 15) - st, mo = Wd('more', 15) - st;
    add({ id: 'S16', at: st, cam: [540, 700], zoom: 0.03, note: 'hero winks with DAY 3 / 30 pill; on "bigger" he ducks out and one huge server grows; on "more" it splits into three small servers with a ? between',
      draw(lt, d, t) {
        bg();
        const dn = E(seg(lt, bg2 - 0.15, bg2 + 0.2));
        K.man({ x: 540, y: lerp(1120, 2700, dn), s: 0.95, arm: K.ARM.point, finger: Math.sin(lt * 9) * 0.25, eyes: lt < bg2 ? 'wink' : 'n', mouth: 'smirk', smirk: true, brow: 0.6 });
        K.pill('DAY 3 / 30', 540, 200, 70, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        const sp = E(seg(lt, mo, mo + 0.35));
        if (lt > bg2 && sp < 1) { K.server(540, 760, lerp(0.3, 1.0, E(seg(lt, bg2, bg2 + 0.4))) * (1 - sp), t); }
        if (lt > bg2 && lt < mo) K.pill('BIGGER?', 540, 1180, 60, C.ink, C.white, E(seg(lt, bg2 + 0.2, bg2 + 0.45)));
        if (lt > mo) { for (let k = 0; k < 3; k++) K.server(lerp(540, 220 + k * 320, sp), 800, 0.45 * sp, t + k); K.pill('OR MORE?', 540, 1180, 60, C.yellow, C.ink, sp); }
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.4 }); cue(st + bg2, 'boing', { gain: 0.35 }); cue(st + mo, 'pop', { gain: 0.4 }); cue(st + mo + 0.1, 'pop', { gain: 0.3 });
  }

  return { shots: S, cues: CUES };
}
