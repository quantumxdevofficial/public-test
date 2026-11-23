// HOW DOES YOUR PHONE ALWAYS KNOW THE EXACT TIME?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const disc = () => { fillAll(C.bg); circle(540, 740, 520, '#E4DCCB'); };
const dark = () => { fillAll('#20232B'); circle(540, 740, 540, '#2A2E38'); };
const heldPhone = (screen) => (x, y) => K.phone(x + 12, y - 70, 0.3, screen);
const pad = (n) => String(Math.floor(n) % 60).padStart(2, '0');
const GREEN = '#3FAE5F', BLUE = '#3A7BD5';
const fmt = (n) => Math.floor(n).toLocaleString('en-US');

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · How does your phone know the exact time, ──────────────
  {
    const st = cut(0), ex = Wd('exact', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 720], zoom: 0.14, note: 'big phone, lock screen clock ticking seconds; EXACT pill + burst on "exact"',
      draw(lt, d, t) {
        disc();
        K.phone(540, 720, 1.15 * E(seg(lt, 0, 0.3)), K.timeScreen('9:41', pad(5 + lt), 'Monday'));
        if (lt > ex) { K.pill('EXACT TIME', 540, 190, 62, C.yellow, C.ink, E(seg(lt, ex, ex + 0.25))); K.burst(830, 190, 2, 1 - seg(lt, ex, ex + 0.5)); }
      } });
    cue(st + 0.05, 'pop', { gain: 0.35 }); for (let k = 1; k < 3; k++) cue(st + k * 1.0, 'tock', { gain: 0.25 }); cue(st + ex, 'pop', { gain: 0.45 });
  }
  // ── 2 · even if you never set it? ─────────────────────────────
  {
    const st = cut(1), ne = Wd('never', 1) - st, se = Wd('set', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 700], zoom: 0.12, note: 'hero holds phone, wall clock behind; "?" pops on "never"; red X over wall clock on "set"',
      draw(lt, d, t) {
        K.room();
        K.wallClock(330, 420, 0.6, lt * 8, 41);
        K.man({ x: 600, y: 1150, s: 0.95, arm: K.PHONE_ARM, holding: heldPhone(K.timeScreen('9:41', pad(7 + lt), 'Monday')), eyes: lt > ne ? 'wide' : 'n', mouth: lt > ne ? 'o' : 'smile', brow: lt > ne ? 0.8 : 0.3 });
        if (lt > ne) K.pill('?', 880, 300, 120, C.yellow, C.ink, E(seg(lt, ne, ne + 0.25)));
        if (lt > se) K.redX(330, 420, lerp(0.9, 0.45, eo(seg(lt, se, se + 0.2))), 1);
      } });
    cue(st, 'whoosh'); cue(st + ne, 'boing', { gain: 0.35 }); cue(st + se + 0.05, 'slam', { gain: 0.4 });
  }
  // ── 3 · Inside, there's a tiny quartz crystal ────────────────
  {
    const st = cut(2), ins = Wd('Inside', 2) - st, ti = Wd('tiny', 2) - st, qu = Wd('quartz', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 720], zoom: 0.16, note: 'phone flips to x-ray; tiny silver crystal can glows on the board on "tiny"; QUARTZ CRYSTAL tag on "quartz"',
      draw(lt, d, t) {
        K.xray(t);
        const xr = seg(lt, ins, ins + 0.3);
        if (xr < 1) K.phone(540, 720, 1.15, K.timeScreen('9:41', pad(9 + lt), 'Monday'));
        if (xr > 0) { ctx.save(); ctx.globalAlpha = xr; K.phoneXray(540, 720, 1.15, t); ctx.restore(); }
        if (lt > ti) {
          const g = E(seg(lt, ti, ti + 0.3));
          ctx.save(); ctx.globalAlpha = 0.4 * g; circle(700, 840, 70 + 8 * Math.sin(lt * 9), C.yellow); ctx.restore();
          K.crystalCan(700, 830, 0.32, 0.4, g);
        }
        if (lt > qu) K.tag('QUARTZ CRYSTAL', 500, 1130, 690, 870, 54, E(seg(lt, qu, qu + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ins, 'sparkle', { dur: 0.4, gain: 0.25 }); cue(st + ti, 'pop', { gain: 0.4 }); cue(st + qu, 'pop', { gain: 0.35 });
  }
  // ── 4a · that wobbles ─────────────────────────────────────────
  const th = Wd('thirty', 3);
  {
    const st = cut(3), wo = Wd('wobbles', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 700], zoom: 0.18, note: 'giant tuning-fork crystal; prongs start vibrating on "wobbles", motion strokes',
      draw(lt, d, t) {
        disc();
        const amp = 16 * seg(lt, wo - 0.1, wo + 0.2);
        K.quartzCrystal(540, 720, 1.25, Math.sin(lt * 55) * amp, E(seg(lt, 0, 0.3)));
        if (amp > 0) for (const sd of [-1, 1]) { ctx.save(); ctx.globalAlpha = 0.6 * (amp / 16); for (let k = 0; k < 3; k++) line([[540 + sd * (200 + k * 30), 420 + k * 40], [540 + sd * (200 + k * 30), 520 + k * 40]], C.ink, 10); ctx.restore(); }
        if (lt > wo) K.pill('WOBBLE!', 540, 230, 64, C.ink, C.white, E(seg(lt, wo, wo + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + wo, 'boing', { gain: 0.35 });
  }
  // ── 4b · thirty two thousand, seven hundred sixty eight times a second. ──
  {
    const st = th - 0.08, se = Wd('second', 3) - st;
    add({ id: 'S05', at: st, cam: [540, 700], zoom: 0.1, note: 'small vibrating crystal top; counter runs 0 → 32,768 as the number is said; PER SECOND label + stopwatch on "second"',
      draw(lt, d, t) {
        disc();
        K.quartzCrystal(540, 470, 0.6, Math.sin(lt * 55) * 12);
        const n = 32768 * eio(seg(lt, 0.05, se - 0.1));
        K.wideCounter(540, 960, 1.3, fmt(n), lt > se ? 'PER SECOND' : 'WOBBLES', C.yellow);
        K.stopwatch(880, 300, 0.32 * E(seg(lt, se - 0.1, se + 0.2)), lt * 6);
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 1.6, gain: 0.2 }); cue(st + se, 'pop', { gain: 0.45 });
  }
  // ── 5 · Your phone counts those wobbles like clock ticks, ─────
  {
    const st = cut(4), co = Wd('counts', 4) - st, ti = Wd('ticks', 4) - st;
    add({ id: 'S06', at: st, cam: [540, 720], zoom: 0.12, note: 'crystal left sends yellow pulses into a chip; every batch = one tick of the clock right; "32,768 = 1 TICK" on "ticks"',
      draw(lt, d, t) {
        disc();
        K.quartzCrystal(200, 600, 0.5, Math.sin(lt * 55) * 10);
        K.cpuChip(500, 560, 0.55, 0, 'COUNT');
        if (lt > co) for (let k = 0; k < 4; k++) { const u = (lt * 1.6 + k / 4) % 1; circle(lerp(290, 400, u), 560, 14, C.yellow); }
        const ticks = lt > co ? Math.floor((lt - co) * 1.6) : 0;
        K.wallClock(850, 560, 0.55, 10 + ticks, 41);
        if (lt > ti) K.pill('32,768 WOBBLES = 1 TICK', 540, 1030, 52, C.ink, C.white, E(seg(lt, ti, ti + 0.25)));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 3; k++) cue(st + co + 0.3 + k / 1.6, 'tock', { gain: 0.3 }); cue(st + ti, 'pop', { gain: 0.4 });
  }
  // ── 6 · but quartz drifts, a few seconds every week. ──────────
  {
    const st = cut(5), dr = Wd('drifts', 5) - st, se = Wd('seconds', 5) - st, we = Wd('week', 5) - st;
    add({ id: 'S07', at: st, cam: [540, 720], zoom: 0.12, note: 'two clocks: REAL vs PHONE; phone hand drifts ahead on "drifts"; red "+3 SEC" on "seconds"; 1 WEEK calendar on "week"',
      draw(lt, d, t) {
        disc();
        const off = 6 * eio(seg(lt, dr - 0.1, se + 0.3));
        K.wallClock(290, 640, 0.7, 20 + lt * 2, 41); K.wallClock(790, 640, 0.7, 20 + lt * 2 + off, 41);
        K.pill('REAL', 290, 400, 50, GREEN, C.white); K.pill('PHONE', 790, 400, 50, C.ink, C.white);
        if (lt > dr) K.pill('DRIFT', 540, 230, 64, C.red, C.white, E(seg(lt, dr, dr + 0.25)));
        if (lt > se) K.pill('+3 SEC', 790, 900, 58, C.red, C.white, E(seg(lt, se, se + 0.25)));
        if (lt > we - 0.15) K.calendar(290, 1000, 0.3 * E(seg(lt, we - 0.15, we + 0.15)), '1', 'WEEK', -0.08);
      } });
    cue(st, 'whoosh'); cue(st + dr, 'slide', { dur: 0.5, gain: 0.25 }); cue(st + se, 'pop', { gain: 0.45 }); cue(st + we, 'thud', { gain: 0.4 });
  }
  // ── 7 · So it quietly asks a time server online, ──────────────
  const PH = [230, 760], SV = [850, 700];
  {
    const st = cut(6), as = Wd('asks', 6) - st, sv = Wd('server', 6) - st;
    add({ id: 'S08', at: st, cam: [540, 700], zoom: 0.1, note: 'phone left, server right; "WHAT TIME?" envelope flies along dotted arc on "asks"; server pops on "server"',
      draw(lt, d, t) {
        disc();
        K.phone(PH[0], PH[1], 0.62, K.timeScreen('9:41', pad(14 + lt), 'Monday'));
        K.server(SV[0], SV[1], 0.62 * E(seg(lt, sv - 0.25, sv + 0.05)), t);
        if (lt > sv) K.pill('TIME SERVER', SV[0], 470, 46, C.ink, C.white, E(seg(lt, sv, sv + 0.25)));
        const u = eio(seg(lt, as, as + 1.1));
        if (lt > as) { K.route(PH[0] + 120, 560, SV[0] - 110, 560, 260, 0, u); const [x, y] = K.arcAt(PH[0] + 120, 560, SV[0] - 110, 560, 260, u); K.envelope(x, y - 20, 0.6, 0, 'WHAT TIME?'); }
      } });
    cue(st, 'whoosh'); cue(st + as, 'slide', { dur: 1.0, gain: 0.25 }); cue(st + sv, 'pop', { gain: 0.35 });
  }
  // ── 8 · and that server is set by atomic clocks, ──────────────
  {
    const st = cut(7), se = Wd('set', 7) - st, at = Wd('atomic', 7) - st;
    add({ id: 'S09', at: st, cam: [540, 720], zoom: 0.12, note: 'server left; atomic clock column rises right on "atomic"; yellow time pulses run along a cable from clock to server on "set"',
      draw(lt, d, t) {
        disc();
        K.server(300, 760, 0.7, t);
        const rise = eob(seg(lt, at - 0.35, at + 0.1));
        if (rise > 0) K.atomicClock(780, lerp(2500, 760, rise), 0.82, t, 1);
        line([[420, 900], [660, 900]], C.ink, 12);
        if (lt > se) for (let k = 0; k < 3; k++) { const u = ((lt - se) * 1.2 + k / 3) % 1; circle(lerp(660, 420, u), 900, 14, C.yellow); }
        if (lt > at) K.pill('ATOMIC CLOCK', 620, 300, 56, C.yellow, C.ink, E(seg(lt, at + 0.05, at + 0.3)));
      } });
    cue(st, 'whoosh'); cue(st + at - 0.3, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + at + 0.05, 'thud', { gain: 0.4 });
  }
  // ── 9 · where cesium atoms tick over nine billion times a second. ──
  {
    const st = cut(8), ce = Wd('cesium', 8) - st, ni = Wd('nine', 8) - st, se = Wd('second', 8) - st;
    add({ id: 'S10', at: st, cam: [540, 650], zoom: 0.14, note: 'dark; giant cesium atom spins on "cesium"; counter races to 9,192,631,770 on "nine"; PER SECOND on "second"',
      draw(lt, d, t) {
        dark();
        K.atom(540, 560, 1.05, lt * 3, seg(lt, ni, ni + 0.3), E(seg(lt, ce - 0.2, ce + 0.15)));
        if (lt > ce) K.pill('CESIUM ATOM', 540, 180, 56, C.white, C.ink, E(seg(lt, ce, ce + 0.25)));
        if (lt > ni - 0.1) { const n = 9192631770 * eio(seg(lt, ni - 0.1, se - 0.05)); K.wideCounter(540, 1010, 0.95 * E(seg(lt, ni - 0.1, ni + 0.15)), fmt(n), lt > se ? 'TICKS PER SECOND' : 'TICKS', C.yellow); }
      } });
    cue(st, 'whoosh'); cue(st + ce, 'sparkle', { dur: 0.6, gain: 0.3 }); cue(st + ni, 'slide', { dur: 0.8, gain: 0.2 }); cue(st + se, 'pop', { gain: 0.45 });
  }
  // ── 10 · It even subtracts the travel time, ───────────────────
  {
    const st = cut(9), su = Wd('subtracts', 9) - st, tr = Wd('travel', 9) - st;
    add({ id: 'S11', at: st, cam: [540, 700], zoom: 0.1, note: 'phone left, server right; arrow there and back; stopwatch; TRIP pill on "subtracts", − TRAVEL TIME on "travel"',
      draw(lt, d, t) {
        disc();
        K.phone(PH[0], PH[1], 0.62, K.timeScreen('9:41', pad(18 + lt), 'Monday'));
        K.server(SV[0], SV[1], 0.62, t);
        K.tripArrow(380, 560, 700, 560, eio(seg(lt, 0, 0.5)), C.ink);
        K.tripArrow(700, 880, 380, 880, eio(seg(lt, 0.4, 0.9)), BLUE);
        K.stopwatch(540, 720, 0.3, lt * 5);
        if (lt > su) K.pill('TRIP: 40 MS', 540, 300, 56, C.ink, C.white, E(seg(lt, su, su + 0.25)));
        if (lt > tr) K.pill('− TRAVEL TIME', 540, 1110, 58, C.red, C.white, E(seg(lt, tr, tr + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'zip', { gain: 0.25 }); cue(st + 0.45, 'zip', { gain: 0.25 }); cue(st + su, 'pop', { gain: 0.35 }); cue(st + tr, 'pop', { gain: 0.4 });
  }
  // ── 11 · so you're right to a split second. ───────────────────
  {
    const st = cut(10), ri = Wd('right', 10) - st, sp = Wd('split', 10) - st;
    add({ id: 'S12', at: st, cam: [540, 720], zoom: 0.16, note: 'big phone, digits snap to correct time on "right", green SYNCED badge; SPOT ON pill',
      draw(lt, d, t) {
        disc();
        const ok = lt > ri;
        K.phone(540, 720, 1.15, K.timeScreen('9:41', ok ? pad(20 + lt) : pad(23 + lt), 'Monday', seg(lt, ri, ri + 0.25)));
        if (ok) K.burst(540, 560, 2.6, 1 - seg(lt, ri, ri + 0.6));
        if (lt > sp) K.pill('SPOT ON', 540, 190, 62, C.yellow, C.ink, E(seg(lt, sp, sp + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ri, 'sparkle', { dur: 0.5, gain: 0.35 }); cue(st + sp, 'pop', { gain: 0.4 });
  }
  // ── 12 · And one American time service alone ──────────────────
  {
    const st = cut(11), am = Wd('American', 11) - st, sv = Wd('service', 11) - st;
    add({ id: 'S13', at: st, cam: [540, 760], zoom: 0.12, note: 'NIST data center rises on "American"; atomic clock beside it; NIST label on "service"',
      draw(lt, d, t) {
        fillAll(C.sky);
        ctx.fillStyle = C.floor; ctx.fillRect(-300, 1060, W + 600, 900);
        K.dataCenter(440, lerp(1600, 830, eob(seg(lt, am - 0.3, am + 0.1))), 0.95, t);
        K.atomicClock(900, 800, 0.55, t, 1);
        if (lt > am) K.pill('USA', 260, 250, 56, BLUE, C.white, E(seg(lt, am, am + 0.25)));
        if (lt > sv) K.pill('NIST TIME', 640, 250, 56, C.ink, C.white, E(seg(lt, sv, sv + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + am - 0.25, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + sv, 'pop', { gain: 0.4 });
  }
  // ── 13 · gets over twelve billion requests every day. ─────────
  {
    const st = cut(12), tw = Wd('twelve', 12) - st, da = Wd('day', 12) - st;
    const spots = Array.from({ length: 14 }, (_, k) => [80 + (k % 7) * 153, k < 7 ? 1100 : 1200]);
    add({ id: 'S14', at: st, cam: [540, 720], zoom: 0.12, note: 'NIST data center; a crowd of phones below fires yellow request dots up; counter "12 BILLION" on "twelve", "A DAY" on "day"',
      draw(lt, d, t) {
        disc();
        K.dataCenter(540, 380, 0.7, t, 1);
        spots.forEach(([x, y]) => K.miniPhone(x, y - 60, 0.9, 0));
        for (let k = 0; k < 18; k++) { const u = (lt * 1.3 + rnd(k)) % 1, [sx] = spots[k % 14]; circle(lerp(sx, 540 + (rnd(k + 3) - 0.5) * 300, u), lerp(980, 560, u), 12, C.yellow); }
        if (lt > tw - 0.1) K.wideCounter(540, 790, 1.1 * E(seg(lt, tw - 0.1, tw + 0.15)), '12 BILLION', lt > da ? 'REQUESTS A DAY' : 'REQUESTS', C.yellow);
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'bubbles', { dur: 2.0, gain: 0.15 }); cue(st + tw, 'slam', { gain: 0.4 }); cue(st + da, 'pop', { gain: 0.4 });
  }
  // ── 14 · So your phone isn't really keeping time. ─────────────
  {
    const st = cut(13), re = Wd('really', 13) - st;
    add({ id: 'S15', at: st, cam: [540, 650], zoom: 0.1, note: 'hero holds phone, brow raised, smirk on "really"; NOT REALLY pill',
      draw(lt, d, t) {
        K.room();
        const w = lt > re;
        K.man({ x: 540, y: 1150, s: 0.95, arm: K.PHONE_ARM, armL: w ? K.ARM.point : K.ARM.down, finger: w ? Math.sin(lt * 11) * 0.35 : undefined, holding: heldPhone(K.timeScreen('9:41', pad(25 + lt), 'Monday')), eyes: 'n', mouth: w ? 'smirk' : 'flat', smirk: w, brow: w ? 0.7 : 0.2 });
        if (lt > re) K.pill('NOT REALLY', 540, 200, 64, C.red, C.white, E(seg(lt, re, re + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + re, 'boing', { gain: 0.35 });
  }
  // ── 15 · It's borrowing it, from an atom. ─────────────────────
  {
    const st = cut(14), bo = Wd('borrowing', 14) - st, at = Wd('atom', 14) - st;
    add({ id: 'S16', at: st, cam: [540, 650], zoom: 0.12, note: 'chain: atom → server → hero phone; yellow dots flow on "borrowing"; hero winks to camera on "atom"',
      draw(lt, d, t) {
        K.room();
        K.atom(300, 640, 0.36, lt * 3, 0.6, E(seg(lt, 0, 0.3)));
        K.server(530, 600, 0.38, t);
        if (lt > bo) for (let k = 0; k < 3; k++) { const u = ((lt - bo) * 1.1 + k / 3) % 1; circle(lerp(410, 470, u), 600, 12, C.yellow); }
        const w = lt > at;
        K.man({ x: 680, y: 1150, s: 0.85, arm: K.PHONE_ARM, holding: heldPhone(K.timeScreen('9:41', pad(28 + lt), 'Monday', 1)), eyes: w ? 'wink' : 'n', mouth: w ? 'grin' : 'smile', smirk: w, brow: 0.4 });
        if (lt > bo && !w) K.pill('BORROWED TIME', 540, 190, 54, C.ink, C.white, E(seg(lt, bo, bo + 0.25)));
        if (w) K.pill('FROM AN ATOM', 540, 190, 58, C.yellow, C.ink, E(seg(lt, at, at + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + bo, 'slide', { dur: 0.8, gain: 0.2 }); cue(st + at, 'sparkle', { dur: 0.6, gain: 0.35 });
  }
  return { shots: S, cues: CUES };
}
