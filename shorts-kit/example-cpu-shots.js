// WHAT ACTUALLY IS A CPU?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const GREEN = '#5BAE6A', PC = K.PAPER_COLS, TAU = Math.PI * 2;
const disc = () => { fillAll(C.bg); circle(540, 740, 520, '#E4DCCB'); };
const office = () => { fillAll(C.bg); ctx.fillStyle = C.floor; ctx.fillRect(-300, 1400, W + 600, 900); };
const gameScreen = (t) => () => { ctx.fillStyle = '#2B3A55'; ctx.fillRect(-300, -180, 600, 360); circle(-150 + Math.sin(t * 3) * 60, 40, 40, C.yellow); for (let i = 0; i < 4; i++) { rr(-280 + i * 150, 120, 120, 40, 8); ctx.fillStyle = GREEN; ctx.fill(); } rr(80, -120, 160, 60, 12); ctx.fillStyle = C.red; ctx.fill(); };
/** a travelling wave pattern for the switch board */
const wave = (t, k = 0) => (i, j) => (Math.sin(i * 0.9 + j * 0.6 - t * 6 + k) > 0.2 ? 1 : 0);

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1a · What actually is a CPU ────────────────────────────────────
  {
    const st = cut(0), cp = Wd('cpu', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 760], zoom: 0.12, note: 'hero in room, finger up; CPU chip pops above him with "CPU?" on "cpu"',
      draw(lt, d, t) {
        K.room();
        const p = E(seg(lt, cp, cp + 0.3));
        K.man({ x: 540, y: 1250, s: 1.25, arm: K.ARM.point, finger: -0.4, eyes: 'n', mouth: lt > cp ? 'o' : 'flat', brow: 0.6, look: 0.4 });
        if (lt > cp) { K.cpuChip(540, 420, p * 1.05, Math.sin(lt * 3) * 0.06); K.pill('CPU?', 540, 200, 70, C.yellow, C.ink, p); }
      } });
    cue(st + cp, 'pop', { gain: 0.45 });
  }
  // ── 1b · and why is it called your computer's brain? ───────────────
  {
    const st = Wd('and', 0) - 0.1, br = Wd('brain', 0) - st;
    add({ id: 'S02', at: st, cam: [540, 720], zoom: 0.12, note: 'chip slides left, "=" then flat brain pops right on "brain"; BRAIN pill',
      draw(lt, d, t) {
        disc();
        K.cpuChip(lerp(540, 270, eio(seg(lt, br - 0.5, br - 0.1))), 720, lerp(1.4, 0.95, eio(seg(lt, br - 0.5, br - 0.1))), Math.sin(lt * 2) * 0.04);
        if (lt > br - 0.2) { const q = E(seg(lt, br - 0.2, br)); ctx.save(); ctx.translate(530, 725); ctx.scale(q, q); rr(-50, -38, 100, 24, 12); ctx.fillStyle = C.ink; ctx.fill(); rr(-50, 14, 100, 24, 12); ctx.fill(); ctx.restore(); }
        if (lt > br) { K.brain(800, 720, 0.85 * E(seg(lt, br, br + 0.3)), Math.sin(lt * 4) * 0.05); K.pill('BRAIN', 540, 300, 80, C.yellow, C.ink, E(seg(lt, br, br + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + br - 0.15, 'pop', { gain: 0.3 }); cue(st + br, 'boing', { gain: 0.35 });
  }
  // ── 2 · It's a little square chip ──────────────────────────────────
  {
    const st = cut(1), ch = Wd('chip', 1) - st;
    add({ id: 'S03', at: st, cam: [540, 760], zoom: 0.12, note: 'motherboard; chip drops into the empty socket on "chip"; CPU pill',
      draw(lt, d, t) {
        office();
        K.motherboard(540, 800, 1);
        K.cpuChip(540, lerp(-300, 800, eo(seg(lt, ch - 0.45, ch))), 0.95);
        if (lt > ch) { K.burst(540, 800, 2.4, 1 - seg(lt, ch, ch + 0.4)); K.pill('CPU', 540, 300, 80, C.ink, C.white, E(seg(lt, ch, ch + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + ch - 0.4, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + ch, 'thud', { gain: 0.45 });
  }
  // ── 3 · packed with billions of tiny switches called transistors ───
  {
    const st = cut(2), bi = Wd('billions', 2) - st, sw = Wd('switches', 2) - st, tr = Wd('transistors', 2) - st;
    add({ id: 'S04', at: st, cam: [540, 760], zoom: 0.18, note: 'chip zooms up, becomes a board of tiny switches filling from "billions", lights flicker on "switches"; TRANSISTORS pill',
      draw(lt, d, t) {
        disc();
        const g = seg(lt, 0, 0.6);
        if (g < 1) K.cpuChip(540, 760, lerp(0.95, 2.6, eio(g)));
        if (lt > 0.35) {
          const fill = seg(lt, bi - 0.3, bi + 0.6);
          K.switchGrid(540, 760, 10, 10, 66, (i, j) => (rnd(i * 10 + j) < fill ? (lt > sw ? wave(t)(i, j) : 1) : 0), seg(lt, 0.35, 0.6));
        }
        if (lt > bi) K.pill('BILLIONS', 540, 260, 74, C.yellow, C.ink, E(seg(lt, bi, bi + 0.25)) * (1 - seg(lt, tr - 0.2, tr)));
        if (lt > tr) K.pill('TRANSISTORS', 540, 260, 74, C.ink, C.white, E(seg(lt, tr, tr + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'zip', { gain: 0.3 }); cue(st + bi, 'sparkle', { dur: 0.6, gain: 0.25 }); cue(st + sw, 'pop', { gain: 0.3 }); cue(st + tr, 'pop', { gain: 0.4 });
  }
  // ── 4a · Each switch is just on or off ─────────────────────────────
  {
    const st = cut(3), on = Wd('on', 3) - st, of = Wd('off', 3) - st;
    add({ id: 'S05', at: st, cam: [540, 760], zoom: 0.12, note: 'one big wall switch; flips up yellow on "on", down grey on "off"; ON / OFF pills',
      draw(lt, d, t) {
        office();
        const v = lt < on ? 0 : lt < of ? eo(seg(lt, on, on + 0.12)) : 1 - eo(seg(lt, of, of + 0.12));
        if (v > 0.5) { ctx.save(); ctx.globalAlpha = 0.5 * v; circle(540, 780, 360, '#FFF3B0'); ctx.restore(); }
        K.toggleSwitch(540, 780, 1.4 * E(seg(lt, 0, 0.25)), v);
        if (lt > on && lt < of) K.pill('ON', 540, 300, 90, C.yellow, C.ink, E(seg(lt, on, on + 0.2)));
        if (lt > of) K.pill('OFF', 540, 300, 90, C.ink, C.white, E(seg(lt, of, of + 0.2)));
      } });
    cue(st, 'whoosh'); cue(st + on, 'tock', { gain: 0.5 }); cue(st + of, 'tock', { gain: 0.5 });
  }
  // ── 4b · a one or a zero ───────────────────────────────────────────
  {
    const st = Wd('one', 3) - 0.35, o1 = Wd('one', 3) - st, z0 = Wd('zero', 3) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.12, note: 'two switches: left ON with a big 1 tile on "one", right OFF with a 0 tile on "zero"',
      draw(lt, d, t) {
        disc();
        K.toggleSwitch(300, 860, 0.95, 1); K.toggleSwitch(780, 860, 0.95, 0);
        if (lt > o1 - 0.05) K.bit(300, 450, '1', E(seg(lt, o1 - 0.05, o1 + 0.2)), 200);
        if (lt > z0 - 0.05) K.bit(780, 450, '0', E(seg(lt, z0 - 0.05, z0 + 0.2)), 200);
      } });
    cue(st, 'whoosh'); cue(st + o1, 'pop', { gain: 0.4 }); cue(st + z0, 'pop', { gain: 0.4 });
  }
  // ── 5a · but flip them in clever patterns ──────────────────────────
  {
    const st = cut(4), fl = Wd('flip', 4) - st, pt = Wd('patterns', 4) - st;
    add({ id: 'S07', at: st, cam: [540, 760], zoom: 0.14, note: 'switch board; a wave of flips ripples across from "flip"; PATTERNS pill',
      draw(lt, d, t) {
        disc();
        K.switchGrid(540, 800, 9, 9, 76, lt > fl ? wave(t) : (i, j) => ((i + j) % 4 === 0 ? 1 : 0));
        if (lt > pt) K.pill('PATTERNS', 540, 280, 76, C.yellow, C.ink, E(seg(lt, pt, pt + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + fl, 'sparkle', { dur: 0.8, gain: 0.25 }); cue(st + pt, 'pop', { gain: 0.4 });
  }
  // ── 5b · and they can do math ──────────────────────────────────────
  {
    const st = Wd('they', 4) - 0.3, mt = Wd('math', 4) - st;
    add({ id: 'S08', at: st, cam: [540, 760], zoom: 0.12, note: 'small switch board below; "2 + 3" chip above, "= 5" lands on "math" with a check',
      draw(lt, d, t) {
        disc();
        K.switchGrid(540, 960, 8, 3, 70, wave(t, 1));
        if (lt > mt) K.burst(540, 560, 2.6, 1 - seg(lt, mt, mt + 0.4));
        K.codeChip(540, 560, 1.4 * E(seg(lt, 0, 0.25)), lt > mt ? '2 + 3 = 5' : '2 + 3');
        if (lt > mt) { K.check(820, 380, E(seg(lt, mt + 0.1, mt + 0.35)), 1); }
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'pop', { gain: 0.3 }); cue(st + mt, 'pop', { gain: 0.45 }); cue(st + mt + 0.15, 'sparkle', { dur: 0.4, gain: 0.25 });
  }
  // ── 6 · Its whole job is one simple loop ───────────────────────────
  {
    const st = cut(5), jb = Wd('job', 5) - st, lp = Wd('loop', 5) - st;
    add({ id: 'S09', at: st, cam: [540, 760], zoom: 0.12, note: 'chip centre; ONE JOB pill; loop ring grows around it on "loop", dot starts circling; THE LOOP pill',
      draw(lt, d, t) {
        disc();
        K.cpuChip(540, 800, 0.9 * E(seg(lt, 0, 0.25)));
        if (lt > jb) K.pill('ONE JOB', 540, 260, 70, C.ink, C.white, E(seg(lt, jb, jb + 0.25)) * (1 - seg(lt, lp - 0.2, lp)));
        if (lt > lp - 0.2) { K.cycleWheel(540, 800, 1.15, -1, Math.max(0, lt - lp) * 4, ['FETCH', 'DECODE', 'RUN'], E(seg(lt, lp - 0.2, lp + 0.15))); K.pill('THE LOOP', 540, 260, 74, C.yellow, C.ink, E(seg(lt, lp, lp + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + jb, 'pop', { gain: 0.35 }); cue(st + lp - 0.15, 'slide', { dur: 0.5, gain: 0.3 });
  }
  // ── 7 · fetch an instruction, decode it, run it, and repeat ────────
  {
    const st = cut(6), fe = Wd('fetch', 6) - st, de = Wd('decode', 6) - st, ru = Wd('run', 6) - st, rp = Wd('repeat', 6) - st;
    const marks = [fe, de, ru];
    add({ id: 'S10', at: st, cam: [540, 800], zoom: 0.1, note: 'loop ring; each station lights yellow on its word; centre card ADD 2+3 → = 5; on "repeat" the dot laps fast, NEXT',
      draw(lt, d, t) {
        disc();
        const act = lt < de ? 0 : lt < ru ? 1 : lt < rp ? 2 : Math.floor((lt - rp) * 5) % 3;
        let ang;
        if (lt < rp) { const k = lt < de ? 0 : lt < ru ? 1 : 2; ang = (k - 1 + eo(seg(lt, marks[k] - 0.2, marks[k] + 0.1))) * TAU / 3; }
        else ang = (TAU * 2 / 3) + (lt - rp) * 10.5;
        K.cycleWheel(540, 820, 1.15, act, ang);
        const ins = lt < de ? 'ADD' : lt < ru ? 'ADD 2+3' : '= 5';
        K.codeChip(540, 820, 0.8 * E(seg(lt, 0, 0.25)), lt < rp ? ins : 'NEXT');
        if (lt > rp) K.pill('REPEAT', 540, 260, 76, C.yellow, C.ink, E(seg(lt, rp, rp + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + fe, 'pop', { gain: 0.35 }); cue(st + de, 'pop', { gain: 0.35 }); cue(st + ru, 'pop', { gain: 0.35 }); cue(st + rp, 'zip', { gain: 0.4 });
  }
  // ── 8a · A three gigahertz chip ticks ──────────────────────────────
  {
    const st = cut(7), gz = Wd('gigahertz', 7) - st, tk = Wd('ticks', 7) - st;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.14, note: 'chip with 3 GHz pill; on "ticks" it pulses fast with shock lines',
      draw(lt, d, t) {
        disc();
        const beat = lt > tk ? Math.max(0, Math.sin((lt - tk) * 40)) : 0;
        K.cpuChip(540, 780, 1.25 * (1 + beat * 0.04));
        if (lt > tk) K.shockLines(540, 780, 260, 0.6 * beat);
        if (lt > gz) K.pill('3 GHz', 540, 330, 90, C.yellow, C.ink, E(seg(lt, gz, gz + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + gz, 'pop', { gain: 0.4 }); for (let i = 0; i < 4; i++) cue(st + tk + i * 0.16, 'tock', { gain: 0.3 });
  }
  // ── 8b · three billion times every second ──────────────────────────
  {
    const st = Wd('billion', 7) - 0.45, sc = Wd('second', 7) - st;
    add({ id: 'S12', at: st, cam: [540, 760], zoom: 0.12, note: 'counter races up to 3,000,000,000; stopwatch hand sweeps one full turn, lands on "second"',
      draw(lt, d, t) {
        disc();
        const u = eio(seg(lt, 0.05, sc + 0.1));
        K.stopwatch(540, 900, 0.85, u * TAU);
        rr(110, 300, 860, 250, 40); ctx.fillStyle = C.ink; ctx.fill(); rr(135, 322, 810, 140, 26); ctx.fillStyle = '#2A2F3A'; ctx.fill();
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '900 100px Inter, sans-serif'; ctx.fillStyle = C.yellow; ctx.fillText(Math.round(3e9 * u).toLocaleString('en-US'), 540, 396);
        ctx.font = '900 44px Inter, sans-serif'; ctx.fillStyle = C.white; ctx.fillText('TICKS', 540, 510);
        if (lt > sc) K.pill('EVERY SECOND', 540, 1190, 58, C.red, C.white, E(seg(lt, sc, sc + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 1.2, gain: 0.25 }); cue(st + sc + 0.1, 'thud', { gain: 0.4 });
  }
  // ── 9 · Here's the twist: one brain isn't enough anymore ───────────
  {
    const st = cut(8), tw = Wd('twist', 8) - st, br = Wd('brain', 8) - st, en = Wd('enough', 8) - st;
    add({ id: 'S13', at: st, cam: [540, 760], zoom: 0.14, note: 'warning slams on "twist"; then one small chip sweats as app tiles pile above it; NOT ENOUGH pill',
      draw(lt, d, t) {
        disc();
        if (lt < br - 0.15) K.warning(540, 740, lt < tw - 0.1 ? E(seg(lt, 0, 0.25)) * 0.8 : lerp(0.8, 1.5, E(seg(lt, tw - 0.1, tw + 0.15))));
        else {
          const p = E(seg(lt, br - 0.35, br - 0.05)), sh = lt > en ? Math.sin(lt * 40) * 6 : 0;
          K.cpuChip(540 + sh, 930, 1.1 * p);
          for (let i = 0; i < 6; i++) { const a = br + i * 0.12; if (lt > a) K.appTile(300 + (i % 3) * 240, lerp(-100, 600 - Math.floor(i / 3) * 210, eob(seg(lt, a, a + 0.3))), 1.4, PC[i % PC.length]); }
          if (lt > en) K.sweat(740, 760, t, 1);
        }
        if (lt > en) K.pill('NOT ENOUGH', 540, 1190, 62, C.red, C.white, E(seg(lt, en, en + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + tw, 'slam', { gain: 0.45 }); for (let i = 0; i < 6; i++) cue(st + br + 0.2 + i * 0.12, 'thud', { gain: 0.18 }); cue(st + en, 'alarm', { dur: 0.6, gain: 0.22 });
  }
  // ── 10a · so modern chips pack several cores ───────────────────────
  {
    const st = cut(9), co = Wd('several', 9) - st;
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.12, note: 'big chip; eight cores pop in one by one on "cores"; 8 CORES pill',
      draw(lt, d, t) {
        disc();
        const cores = Array.from({ length: 8 }, (_, i) => E(seg(lt, co - 0.2 + i * 0.08, co + 0.1 + i * 0.08)));
        K.multiCoreChip(540, 800, 1.15 * E(seg(lt, 0, 0.3)), 8, cores);
        if (lt > co) K.pill('8 CORES', 540, 220, 76, C.yellow, C.ink, E(seg(lt, co + 0.3, co + 0.55)));
      } });
    cue(st, 'whoosh'); for (let i = 0; i < 8; i++) cue(st + co - 0.1 + i * 0.08, 'pop', { gain: 0.16 });
  }
  // ── 10b · little CPUs working side by side ─────────────────────────
  {
    const st = Wd('little', 9) - 0.1, wk = Wd('working', 9) - st;
    add({ id: 'S15', at: st, cam: [540, 760], zoom: 0.14, note: 'cores light up yellow in turns from "working"; app tiles fly into different cores; SIDE BY SIDE pill',
      draw(lt, d, t) {
        disc();
        K.multiCoreChip(540, 820, 1.15, 8, null, (i) => (lt > wk - 0.2 + i * 0.06 ? (Math.sin(t * 9 + i * 1.7) > -0.3 ? 1 : 0) : 0));
        for (let i = 0; i < 4; i++) { const a = wk - 0.3 + i * 0.15, u = eio(seg(lt, a, a + 0.5)); if (u > 0 && u < 1) { const [x, y] = K.arcAt(160 + i * 250, 260, 330 + i * 140, 720 + (i % 2) * 200, 120, u); K.appTile(x, y, 0.8 * (1 - u * 0.6), PC[i % PC.length]); } }
        if (lt > wk) K.pill('SIDE BY SIDE', 540, 220, 66, C.ink, C.white, E(seg(lt, wk + 0.2, wk + 0.45)));
      } });
    cue(st, 'whoosh'); cue(st + wk - 0.3, 'slide', { dur: 0.8, gain: 0.25 }); cue(st + wk + 0.25, 'pop', { gain: 0.35 });
  }
  // ── 11 · And all that flipping is why your laptop gets warm ────────
  {
    const st = cut(10), fl = Wd('flipping', 10) - st, lp = Wd('laptop', 10) - st, wm = Wd('warm', 10) - st;
    add({ id: 'S16', at: st, cam: [540, 760], zoom: 0.12, note: 'switch board flickering on "flipping"; on "laptop" hero beside a laptop, heat waves rise, thermometer climbs red on "warm"',
      draw(lt, d, t) {
        if (lt < lp - 0.15) { disc(); K.switchGrid(540, 760, 9, 9, 76, (i, j) => (rnd(i * 9 + j + Math.floor(t * 14) * 81) > 0.5 ? 1 : 0)); return; }
        office();
        K.desk(700, 1150, 0.8);
        K.laptop(720, 1139 - 262 * 0.55, 0.55, gameScreen(t));
        K.man({ x: 250, y: 1040, s: 0.95, arm: lt > wm ? K.ARM.mouth : K.ARM.hip, eyes: lt > wm ? 'wide' : 'n', mouth: lt > wm ? 'o' : 'smile', brow: lt > wm ? 0.9 : 0.3, look: 0.8 });
        K.heatWaves(720, 820, t, seg(lt, lp, wm + 0.2), 360);
        if (lt > wm - 0.2) K.thermometer(250, 300, 1.2 * E(seg(lt, wm - 0.2, wm + 0.1)), 0, seg(lt, wm - 0.1, wm + 0.6));
        if (lt > wm) K.pill('WARM!', 800, 300, 66, C.red, C.white, E(seg(lt, wm, wm + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + fl, 'sparkle', { dur: 0.5, gain: 0.25 }); cue(st + lp - 0.15, 'whoosh', { gain: 0.5 }); cue(st + wm, 'sizzle', { dur: 0.6, gain: 0.25 });
  }
  // ── 12 · Tiny switches, giant brain ────────────────────────────────
  {
    const st = cut(11), sw = Wd('switches', 11) - st, br = Wd('brain', 11) - st;
    add({ id: 'S17', at: st, cam: [540, 760], zoom: 0.14, note: 'hero winks; small flicking switch on "switches", giant brain with chip on "brain"',
      draw(lt, d, t) {
        K.room();
        K.man({ x: 270, y: 1200, s: 1.0, arm: lt > br ? K.ARM.point : K.ARM.hip, finger: lt > br ? Math.sin(lt * 9) * 0.2 : null, eyes: lt > br ? 'wink' : 'n', mouth: lt > br ? 'grin' : 'smirk', smirk: true, brow: 0.4 });
        if (lt > sw - 0.1) K.toggleSwitch(800, 1020, 0.5 * E(seg(lt, sw - 0.1, sw + 0.2)), Math.sin(t * 8) > 0 ? 1 : 0);
        if (lt > br - 0.1) { K.brain(790, 700, 1.15 * E(seg(lt, br - 0.1, br + 0.25)), Math.sin(lt * 3) * 0.05); K.cpuChip(790, 700, 0.55 * E(seg(lt, br, br + 0.3))); }
      } });
    cue(st, 'whoosh'); cue(st + sw, 'tock', { gain: 0.4 }); cue(st + br, 'boing', { gain: 0.4 });
  }

  return { shots: S, cues: CUES };
}
