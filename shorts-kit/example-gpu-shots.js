// WHAT ACTUALLY IS A GPU?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const PC = K.PAPER_COLS;
const disc = () => { fillAll(C.bg); circle(540, 740, 520, '#E4DCCB'); };
const office = () => { fillAll(C.bg); ctx.fillStyle = C.floor; ctx.fillRect(-300, 1400, W + 600, 900); };
const scene = (u) => (i, j) => K.sceneColor(i, j, 24, 14, u);

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1a · What actually is a GPU ─────────────────────────────────────
  {
    const st = cut(0), gp = Wd('gpu', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 760], zoom: 0.12, note: 'hero in room, finger up; graphics card pops above him on "gpu", GPU? pill',
      draw(lt, d, t) {
        K.room();
        const p = E(seg(lt, gp - 0.1, gp + 0.25));
        K.man({ x: 540, y: 1250, s: 1.25, arm: K.ARM.point, finger: -0.4, eyes: 'n', mouth: lt > gp ? 'o' : 'flat', brow: 0.6, look: 0.4 });
        if (lt > gp - 0.1) { K.gpuCard(540, 440, 0.8 * p, t, 1, ''); K.pill('GPU?', 540, 200, 70, C.yellow, C.ink, p); }
      } });
    cue(st + gp - 0.1, 'pop', { gain: 0.45 });
  }
  // ── 1b · and why isn't the CPU enough? ─────────────────────────────
  {
    const st = Wd('and', 0) - 0.1, cp = Wd('cpu', 0) - st, en = Wd('enough', 0) - st;
    add({ id: 'S02', at: st, cam: [540, 740], zoom: 0.12, note: 'CPU chip left vs graphics card right, VS between; CPU wobbles with a red ENOUGH? pill on "enough"',
      draw(lt, d, t) {
        disc();
        const wob = lt > en ? Math.sin(lt * 14) * 0.08 : 0;
        K.cpuChip(250, 740, 0.85 * E(seg(lt, cp - 0.25, cp + 0.05)), wob);
        K.gpuCard(845, 740, 0.44 * E(seg(lt, 0, 0.3)), t, 1, 'GPU');
        bigText('VS', 520, 740, 90, C.white, 0, E(seg(lt, 0.2, 0.4)));
        if (lt > en) K.pill('ENOUGH?', 330, 450, 66, C.red, C.white, E(seg(lt, en, en + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + cp - 0.2, 'pop', { gain: 0.35 }); cue(st + en, 'boing', { gain: 0.35 });
  }
  // ── 2 · Well, your CPU has a few really smart cores ─────────────────
  {
    const st = cut(1), fw = Wd('few', 1) - st, sm = Wd('smart', 1) - st;
    add({ id: 'S03', at: st, cam: [540, 760], zoom: 0.12, note: 'CPU with 4 big cores popping on "few"; four glasses-wearing workers stand below on "smart"; CPU pill',
      draw(lt, d, t) {
        disc();
        const cores = Array.from({ length: 4 }, (_, i) => E(seg(lt, fw - 0.2 + i * 0.1, fw + 0.1 + i * 0.1)));
        K.multiCoreChip(540, 640, 0.95 * E(seg(lt, 0, 0.3)), 4, cores, (i) => (lt > sm ? 1 : 0));
        K.pill('CPU', 540, 250, 76, C.ink, C.white, E(seg(lt, 0.1, 0.35)));
        for (let i = 0; i < 4; i++) { const a = sm - 0.15 + i * 0.08; if (lt > a) K.worker(240 + i * 200, 1130, 0.9 * E(seg(lt, a, a + 0.3)), PC[i], { glasses: true, bob: Math.max(0, Math.sin(t * 5 + i)) * 0.3 }); }
      } });
    cue(st, 'whoosh'); for (let i = 0; i < 4; i++) cue(st + fw - 0.1 + i * 0.1, 'pop', { gain: 0.2 }); cue(st + sm, 'sparkle', { dur: 0.4, gain: 0.25 });
  }
  // ── 3 · great at tricky jobs, one step after another ────────────────
  {
    const st = cut(2), tr = Wd('tricky', 2) - st, sp = Wd('step', 2) - st, an = Wd('another', 2) - st;
    add({ id: 'S04', at: st, cam: [540, 760], zoom: 0.1, note: 'one smart worker walks under four step tiles that finish one by one from "step"; ONE AT A TIME pill on "another"',
      draw(lt, d, t) {
        office();
        const done = lt < sp ? 0.5 * seg(lt, tr, sp) : lerp(1, 4, seg(lt, sp, an + 0.3));
        const k = Math.min(3, Math.floor(done)), f = Math.min(3, done);
        K.stepTiles(540, 600, 1.25, 4, done);
        K.worker(540 + (f - 1.5) * 212, 1010, 1.6, PC[0], { glasses: true, bob: Math.max(0, Math.sin(t * 9)) * 0.4 });
        if (lt > tr) K.pill('TRICKY', 540, 290, 66, C.yellow, C.ink, E(seg(lt, tr, tr + 0.25)) * (1 - seg(lt, an - 0.2, an)));
        if (lt > an) K.pill('ONE AT A TIME', 540, 290, 62, C.ink, C.white, E(seg(lt, an, an + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + tr, 'pop', { gain: 0.3 }); for (let i = 0; i < 3; i++) cue(st + sp + i * ((an + 0.3 - sp) / 3), 'tock', { gain: 0.4 }); cue(st + an, 'pop', { gain: 0.35 });
  }
  // ── 4 · A GPU has thousands of simpler cores ────────────────────────
  {
    const st = cut(3), th = Wd('thousands', 3) - st, co = Wd('cores', 3) - st;
    add({ id: 'S05', at: st, cam: [540, 760], zoom: 0.16, note: 'GPU chip; tiny cores flood in from "thousands"; THOUSANDS pill',
      draw(lt, d, t) {
        disc();
        K.gpuChip(540, 780, 1.05 * E(seg(lt, 0, 0.3)), 24, 24, seg(lt, th - 0.2, co + 0.2), (i, j) => (lt > co ? (Math.sin(i * 0.7 + j * 0.5 - t * 7) > 0.3 ? 1 : 0) : 0));
        K.pill('GPU', 540, 300, 76, C.ink, C.white, E(seg(lt, 0.1, 0.35)) * (1 - seg(lt, th - 0.2, th)));
        if (lt > th) K.pill('THOUSANDS', 540, 300, 76, C.yellow, C.ink, E(seg(lt, th, th + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + th - 0.15, 'sparkle', { dur: 0.9, gain: 0.3 }); cue(st + th, 'pop', { gain: 0.4 });
  }
  // ── 5 · all doing tiny jobs at the exact same time ──────────────────
  {
    const st = cut(4), tj = Wd('tiny', 4) - st, sa = Wd('same', 4) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.12, note: 'a crowd of 6x5 tiny workers each with a grey block; on "same" every block turns yellow at once and all hop; SAME TIME pill',
      draw(lt, d, t) {
        disc();
        const on = lt > sa;
        K.workerCrowd(540, 760, 6, 5, 150, 0.6, () => (on ? C.yellow : '#B9BFCA'), () => (on ? Math.max(0, Math.sin((lt - sa) * 12)) : 0), seg(lt, 0, 0.5));
        if (lt > tj) K.pill('TINY JOBS', 540, 230, 66, C.ink, C.white, E(seg(lt, tj, tj + 0.25)) * (1 - seg(lt, sa - 0.2, sa)));
        if (on) { K.pill('SAME TIME', 540, 230, 72, C.yellow, C.ink, E(seg(lt, sa, sa + 0.25))); K.burst(540, 760, 3, 1 - seg(lt, sa, sa + 0.4)); }
      } });
    cue(st, 'whoosh'); cue(st + tj, 'pop', { gain: 0.3 }); cue(st + sa, 'slam', { gain: 0.35 }); cue(st + sa + 0.05, 'sparkle', { dur: 0.5, gain: 0.25 });
  }
  // ── 6 · And your screen is full of tiny jobs ────────────────────────
  {
    const st = cut(5), sc = Wd('screen', 5) - st, tj = Wd('tiny', 5) - st;
    add({ id: 'S07', at: st, cam: [540, 700], zoom: 0.1, note: 'monitor with a landscape; on "tiny" the picture zooms into chunky pixels with a grid',
      draw(lt, d, t) {
        office();
        const z = eio(seg(lt, tj - 0.3, tj + 0.2));
        const n = Math.round(lerp(96, 24, z)), m = Math.round(n * 14 / 24);
        K.pixelScreen(540, 720, lerp(1.05, 1.2, z) * E(seg(lt, 0, 0.3)), n, m, (i, j) => K.sceneColor(i, j, n, m, 0.3), z * 0.6);
        if (lt > tj) K.pill('PIXELS', 540, 260, 72, C.yellow, C.ink, E(seg(lt, tj, tj + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sc, 'pop', { gain: 0.3 }); cue(st + tj - 0.25, 'zip', { gain: 0.35 });
  }
  // ── 7a · because a 4K display ───────────────────────────────────────
  {
    const st = cut(6), fk = Wd('4k', 6) - st;
    add({ id: 'S08', at: st, cam: [540, 720], zoom: 0.12, note: 'big pixel screen; 4K pill slams on "4k"',
      draw(lt, d, t) {
        office();
        K.pixelScreen(540, 720, 1.2, 24, 14, scene(0.3), 0.6);
        if (lt > fk) K.pill('4K', 540, 260, 110, C.yellow, C.ink, E(seg(lt, fk, fk + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + fk, 'thud', { gain: 0.4 });
  }
  // ── 7b · has over eight million pixels ──────────────────────────────
  {
    const st = Wd('has', 6) - 0.1, mi = Wd('million', 6) - st, px = Wd('pixels', 6) - st;
    add({ id: 'S09', at: st, cam: [540, 760], zoom: 0.12, note: 'counter races to 8,294,400 landing on "million"; pixel grid below fills; PIXELS! on "pixels"',
      draw(lt, d, t) {
        disc();
        const u = eio(seg(lt, 0.05, mi + 0.1));
        K.pixelScreen(540, 900, 0.9, 24, 14, (i, j) => ((j * 24 + i) / 336 < u ? K.sceneColor(i, j, 24, 14, 0.3) : null), 0.6, false);
        rr(110, 290, 860, 250, 40); ctx.fillStyle = C.ink; ctx.fill(); rr(135, 312, 810, 140, 26); ctx.fillStyle = '#2A2F3A'; ctx.fill();
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '900 110px Inter, sans-serif'; ctx.fillStyle = C.yellow; ctx.fillText(Math.round(8294400 * u).toLocaleString('en-US'), 540, 386);
        ctx.font = '900 44px Inter, sans-serif'; ctx.fillStyle = C.white; ctx.fillText(lt > px ? 'PIXELS!' : 'PIXELS', 540, 500);
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 1.0, gain: 0.25 }); cue(st + mi + 0.1, 'thud', { gain: 0.4 }); cue(st + px, 'pop', { gain: 0.3 });
  }
  // ── 8a · and each one gets a new color ─────────────────────────────
  {
    const st = cut(7), co = Wd('color', 7) - st;
    add({ id: 'S10', at: st, cam: [540, 760], zoom: 0.18, note: 'zoom on a few big pixels; one pixel outlined red flips colour on "color"; a tiny worker holds the new colour',
      draw(lt, d, t) {
        disc();
        const cols = ['#7EC8E8', C.yellow, '#5BAE6A', C.pink, '#B07CD8'];
        const k = lt < co ? 0 : 1 + Math.floor((lt - co) * 6) % 4;
        K.pixelScreen(540, 700, 1, 4, 3, (i, j) => (i === 1 && j === 1 ? cols[k] : K.sceneColor(i + 10, j + 4, 24, 14, 0.3)), 0.9, false);
        ctx.save(); ctx.lineWidth = 14; ctx.strokeStyle = C.red; rr(540 - 380 + 190 - 4, 700 - 285 + 190 - 4, 198, 198, 10); ctx.stroke(); ctx.restore();
        K.worker(820, 1120, 1.1, PC[2], { hold: cols[k], bob: lt > co ? Math.max(0, Math.sin((lt - co) * 12)) * 0.5 : 0 });
        if (lt > co) K.pill('NEW COLOR', 540, 230, 66, C.yellow, C.ink, E(seg(lt, co, co + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + co, 'pop', { gain: 0.4 });
  }
  // ── 8b · sixty times a second ──────────────────────────────────────
  {
    const st = Wd('sixty', 7) - 0.3, ti = Wd('times', 7) - st, se = Wd('second', 7) - st;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.14, note: 'whole screen repaints (sun moving), stopwatch sweeps a full turn landing on "second"; 60x pill',
      draw(lt, d, t) {
        office();
        const u = eio(seg(lt, 0, se + 0.1));
        K.pixelScreen(540, 600, 0.95, 24, 14, scene(u), 0.5);
        K.stopwatch(540, 1070, 0.5, u * Math.PI * 2);
        if (lt > ti - 0.1) K.pill('60× / SECOND', 540, 230, 66, C.yellow, C.ink, E(seg(lt, ti - 0.1, ti + 0.15)));
      } });
    cue(st, 'whoosh'); for (let i = 0; i < 6; i++) cue(st + 0.1 + i * 0.18, 'tock', { gain: 0.22 }); cue(st + se, 'thud', { gain: 0.35 });
  }
  // ── 9 · Here's the twist: AI is tiny jobs too ───────────────────────
  {
    const st = cut(8), tw = Wd('twist', 8) - st, ai = Wd('ai', 8) - st, to = Wd('too', 8) - st;
    add({ id: 'S12', at: st, cam: [540, 760], zoom: 0.14, note: 'warning slams on "twist"; then a robot pops on "ai" with AI pill; tiny job blocks orbit it on "too"',
      draw(lt, d, t) {
        disc();
        if (lt < ai - 0.15) { K.warning(540, 740, lt < tw - 0.1 ? E(seg(lt, 0, 0.25)) * 0.8 : lerp(0.8, 1.5, E(seg(lt, tw - 0.1, tw + 0.15)))); return; }
        const p = E(seg(lt, ai - 0.15, ai + 0.2));
        K.robot(540, 880, 1.15 * p, t, { arm: lt > to ? 1 : 0 });
        K.pill('AI', 540, 230, 96, C.yellow, C.ink, p);
        if (lt > to - 0.1) for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + t * 1.5, q = E(seg(lt, to - 0.1 + i * 0.04, to + 0.2 + i * 0.04)); rr(540 + Math.cos(a) * 400 - 30 * q, 720 + Math.sin(a) * 300 - 30 * q, 60 * q, 60 * q, 10); ctx.fillStyle = C.yellow; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.stroke(); }
      } });
    cue(st, 'whoosh'); cue(st + tw, 'slam', { gain: 0.45 }); cue(st + ai - 0.1, 'boing', { gain: 0.35 }); cue(st + to, 'sparkle', { dur: 0.5, gain: 0.25 });
  }
  // ── 10 · mostly millions of simple multiplications ──────────────────
  {
    const st = cut(9), mi = Wd('millions', 9) - st, mu = Wd('multiplications', 9) - st;
    add({ id: 'S13', at: st, cam: [540, 760], zoom: 0.14, note: 'a card of small multiplications; on "multiplications" every cell answers at once (yellow); x MILLIONS pill',
      draw(lt, d, t) {
        disc();
        K.matrixCard(540, 780, 1, 5, 6, (i, j) => (lt > mu - 0.1 + ((i + j) % 3) * 0.03 ? 1 : 0), E(seg(lt, 0, 0.3)));
        if (lt > mi) K.pill('× MILLIONS', 540, 270, 72, C.ink, C.white, E(seg(lt, mi, mi + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + mi, 'pop', { gain: 0.35 }); cue(st + mu, 'sparkle', { dur: 0.6, gain: 0.3 });
  }
  // ── 11a · so the chips built for video games ────────────────────────
  {
    const st = cut(10), vg = Wd('video', 10) - st;
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.12, note: 'graphics card centre; gamepad pops on "video games" with a GAMES pill',
      draw(lt, d, t) {
        disc();
        K.gpuCard(540, 560, 0.85 * E(seg(lt, 0, 0.3)), t, 1, 'GPU');
        if (lt > vg - 0.1) { K.gamepad(540, 1000, 1.2 * E(seg(lt, vg - 0.1, vg + 0.2)), Math.sin(lt * 6) * 0.06, t); K.pill('GAMES', 540, 240, 72, C.yellow, C.ink, E(seg(lt, vg, vg + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + vg - 0.05, 'boing', { gain: 0.35 });
  }
  // ── 11b · now power chatbots ───────────────────────────────────────
  {
    const st = Wd('now', 10) - 0.1, cb = Wd('chatbots', 10) - st;
    add({ id: 'S15', at: st, cam: [540, 760], zoom: 0.12, note: 'graphics card left, arrow to a robot right; chat bubble pops on "chatbots"',
      draw(lt, d, t) {
        disc();
        K.gpuCard(260, 640, 0.42, t, 1, 'GPU');
        K.arrow(450, 640, 130 * E(seg(lt, 0, 0.3)), 0, 1);
        K.robot(810, 820, 0.8 * E(seg(lt, cb - 0.3, cb)), t, { arm: lt > cb ? 1 : 0 });
        if (lt > cb) { K.bubble(770, 360, 1, 'Hi there!', E(seg(lt, cb, cb + 0.25)), -1); K.pill('CHATBOTS', 400, 1130, 62, C.ink, C.white, E(seg(lt, cb + 0.1, cb + 0.35))); }
      } });
    cue(st, 'whoosh'); cue(st + cb - 0.25, 'pop', { gain: 0.3 }); cue(st + cb, 'pop', { gain: 0.45 });
  }
  // ── 12 · Thousands of tiny workers, one giant picture ───────────────
  {
    const st = cut(11), wk = Wd('workers', 11) - st, pi = Wd('picture', 11) - st;
    add({ id: 'S16', at: st, cam: [540, 760], zoom: 0.14, note: 'crowd of tiny workers holding coloured blocks; on "picture" they become the landscape on a big screen; hero winks',
      draw(lt, d, t) {
        if (lt < pi - 0.15) {
          disc();
          K.workerCrowd(540, 760, 6, 5, 150, 0.6, (i, j) => K.sceneColor(i * 4 + 1, j * 3 + 1, 24, 14, 0.3), (i, j) => (lt > wk ? Math.max(0, Math.sin(t * 10 + i + j)) * 0.5 : 0), 1);
          if (lt > wk) K.pill('TINY WORKERS', 540, 230, 64, C.ink, C.white, E(seg(lt, wk, wk + 0.25)));
          return;
        }
        office();
        K.pixelScreen(650, 600, 0.82 * E(seg(lt, pi - 0.15, pi + 0.15)), 24, 14, scene(0.3), 0.3);
        K.man({ x: 200, y: 1230, s: 0.85, arm: K.ARM.point, finger: Math.sin(lt * 9) * 0.2, eyes: 'wink', mouth: 'grin', smirk: true, brow: 0.4 });
        K.pill('ONE PICTURE', 650, 250, 66, C.yellow, C.ink, E(seg(lt, pi, pi + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + wk, 'pop', { gain: 0.3 }); cue(st + pi - 0.15, 'whoosh', { gain: 0.5 }); cue(st + pi, 'boing', { gain: 0.4 });
  }

  return { shots: S, cues: CUES };
}
