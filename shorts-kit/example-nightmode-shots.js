// HOW DOES YOUR PHONE TAKE BRIGHT PHOTOS IN THE DARK?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const disc = () => { fillAll(C.bg); circle(540, 740, 520, '#E4DCCB'); };
const nightDisc = () => { fillAll(C.bg); circle(540, 740, 520, C.navy); };
const talk = (lt) => (Math.sin(lt * 18) > 0 ? 'o' : 'smile');
const DIM = 0.12;

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · How does your phone take bright photos in the dark? ──
  {
    const st = cut(0), ph = Wd('phone', 0) - st, br = Wd('bright', 0) - st, dk = Wd('dark', 0) - st;
    add({ id: 'S01', at: st, cam: [600, 700], zoom: 0.12, note: 'night disc: hero beside a big phone; phone shows a dark scene that turns bright on "bright"; moon + ? on "dark"',
      draw(lt, d, t) {
        nightDisc();
        if (lt > dk) { K.moon(880, 300, 70 * E(seg(lt, dk, dk + 0.3)), C.yellow, C.navy); }
        K.man({ x: 250, y: 880, s: 0.62, arm: K.ARM.point, finger: 0.5, eyes: lt > br ? 'wide' : 'n', mouth: lt > br ? 'o' : 'smile', brow: lt > br ? 0.8 : 0.3, look: 1 });
        const b = lerp(DIM, 1, eo(seg(lt, br, br + 0.5)));
        K.phone(700, 720, lerp(0.75, 0.82, E(seg(lt, ph, ph + 0.3))), () => K.nightScene(0, -20, 332, 600, { bright: b, border: false }));
        if (lt > br) K.burst(700, 720, 1.1, 1 - seg(lt, br, br + 0.6));
        if (lt > dk) K.qmark(250, 320, 0.85, E(seg(lt, dk, dk + 0.3)), Math.sin(lt * 6) * 0.12);
      } });
    cue(st + br, 'sparkle', { dur: 0.5, gain: 0.35 }); cue(st + dk, 'boing', { gain: 0.3 });
  }
  // ── 2 · Well, at night the camera sensor catches so little light ──
  {
    const st = cut(1), se = Wd('sensor', 1) - st, li = Wd('little', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 700], zoom: 0.14, note: 'sensor grid of light buckets; a few yellow photons trickle in; SENSOR tag on "sensor"; SO LITTLE LIGHT pill on "little"',
      draw(lt, d, t) {
        nightDisc();
        K.sensorGrid(540, 760, 1.15 * E(seg(lt, 0, 0.35)), lt, 2.2);
        if (lt > se && lt < li) K.tag('SENSOR', 540, 200, 540, 400, 64, E(seg(lt, se, se + 0.25)));
        if (lt > li) K.pill('SO LITTLE LIGHT', 540, 200, 62, C.yellow, C.ink, E(seg(lt, li, li + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + se, 'pop', { gain: 0.4 }); cue(st + li, 'pop', { gain: 0.4 });
  }
  // ── 3 · that random noise shows up as grainy speckles. ──
  {
    const st = cut(2), no = Wd('noise', 2) - st, sp = Wd('speckles', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 700], zoom: 0.25, note: 'a dark night photo; grain flickers in on "noise" (NOISE pill red); camera pushes in on "speckles" (GRAINY pill)',
      draw(lt, d, t) {
        disc();
        const nz = eo(seg(lt, no - 0.1, no + 0.4));
        K.nightScene(540, 720, 820, 615, { bright: 0.35, noise: nz, seed: Math.floor(lt * 10) });
        if (lt > no && lt < sp) K.pill('NOISE', 540, 260, 70, C.red, C.white, E(seg(lt, no, no + 0.25)));
        if (lt > sp) K.pill('GRAINY', 540, 260, 70, C.yellow, C.ink, E(seg(lt, sp, sp + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + no, 'sizzle', { dur: 0.6, gain: 0.2 }); cue(st + sp, 'pop', { gain: 0.4 });
  }
  // ── 4 · So night mode doesn't take one photo. ──
  {
    const st = cut(3), ni = Wd('night', 3) - st, on = Wd('one', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 720], zoom: 0.1, note: 'NIGHT MODE pill on "night"; one grainy photo drops in; red X slams on "one"',
      draw(lt, d, t) {
        disc();
        if (lt > ni) { K.pill('NIGHT MODE', 540, 230, 66, C.navy, C.white, E(seg(lt, ni, ni + 0.25))); }
        K.nightScene(540, lerp(-400, 760, eob(seg(lt, 0.1, 0.5))), 640, 480, { bright: 0.35, noise: 0.8, seed: Math.floor(lt * 10) });
        if (lt > on) { K.pill('1 PHOTO', 540, 1130, 56, C.ink, C.white, E(seg(lt, on, on + 0.2))); K.redX(540, 760, lerp(1.6, 1, eo(seg(lt, on + 0.1, on + 0.3))), 1); }
      } });
    cue(st, 'whoosh'); cue(st + 0.45, 'thud', { gain: 0.35 }); cue(st + on + 0.12, 'slam', { gain: 0.35 });
  }
  // ── 5 · It quietly snaps up to fifteen of them, ──
  {
    const st = cut(4), sn = Wd('snaps', 4) - st, fi = Wd('fifteen', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 720], zoom: 0.12, note: 'from "snaps" grainy photos fly in one by one into a messy pile, counter ticks up and hits 15 on "fifteen"',
      draw(lt, d, t) {
        disc();
        const s0 = 0.05, n = Math.min(15, 1 + Math.floor(15 * seg(lt, s0, fi)));
        for (let i = 0; i < n; i++) {
          const a = seg(lt, s0 + i * (fi - s0) / 15, s0 + i * (fi - s0) / 15 + 0.2);
          const x = 540 + (rnd(i * 3.3) - 0.5) * 220, y = 760 + (rnd(i * 5.1) - 0.5) * 220;
          K.nightScene(lerp(1400, x, eo(a)), y, 480, 360, { bright: 0.35, noise: 0.8, seed: i + 1, rot: (rnd(i * 2.2) - 0.5) * 0.5 });
        }
        if (n > 0) K.pill(`x${n}`, 540, 220, 80, n === 15 ? C.yellow : C.ink, n === 15 ? C.ink : C.white, 1 + (n === 15 ? 0.15 * (1 - seg(lt, fi, fi + 0.3)) : 0));
      } });
    cue(st, 'whoosh');
    for (let i = 0; i < 15; i++) cue(st + 0.05 + i * (fi - 0.05) / 15, 'tock', { gain: 0.18 });
    cue(st + fi, 'pop', { gain: 0.45 });
  }
  // ── 6 · lines them up to cancel out your shaky hands, ──
  {
    const st = cut(5), up = Wd('up', 5) - st, sh = Wd('shaky', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 720], zoom: 0.1, note: 'five photos stacked crooked, snap into alignment on "up" (LINED UP); on "shaky" a small phone jitters + SHAKY HANDS pill',
      draw(lt, d, t) {
        disc();
        const al = eio(seg(lt, up - 0.1, up + 0.5));
        for (let i = 4; i >= 0; i--) {
          const ox = (rnd(i * 4.4) - 0.5) * 200 * (1 - al), oy = (rnd(i * 6.6) - 0.5) * 200 * (1 - al), r = (rnd(i * 8.8) - 0.5) * 0.4 * (1 - al);
          K.nightScene(540 + ox, 700 + oy, 600, 450, { bright: 0.35, noise: 0.7, seed: i + 1, rot: r });
        }
        if (lt > up && lt < sh) K.pill('LINED UP', 540, 220, 66, C.ink, C.white, E(seg(lt, up + 0.3, up + 0.5)));
        if (lt > sh) {
          K.pill('SHAKY HANDS', 540, 220, 64, C.yellow, C.ink, E(seg(lt, sh, sh + 0.25)));
          const j = Math.sin(lt * 40) * 10;
          K.phone(880 + j, 1080, 0.3, () => K.nightCamScreen(t, 0, 0, 0), j * 0.01);
          K.shockLines(880, 1080, 150, 0.8);
        }
      } });
    cue(st, 'whoosh'); cue(st + up + 0.4, 'thud', { gain: 0.35 }); cue(st + sh, 'boing', { gain: 0.3 });
  }
  // ── 7 · and averages them together. ──
  {
    const st = cut(6), av = Wd('averages', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 720], zoom: 0.16, note: 'the aligned stack collapses into ONE photo that brightens and loses grain on "averages"; AVERAGE pill',
      draw(lt, d, t) {
        disc();
        const m = eio(seg(lt, av, av + 0.9));
        for (let i = 4; i >= 1; i--) { if (m < 1) K.nightScene(540 + i * 14 * (1 - m), 700 - i * 14 * (1 - m), 600, 450, { bright: 0.35, noise: 0.7, seed: i + 1 }); }
        K.nightScene(540, 700, 600, 450, { bright: lerp(0.35, 1, m), noise: lerp(0.7, 0.05, m), seed: 1 });
        if (lt > av) K.pill('AVERAGE', 540, 230, 70, C.yellow, C.ink, E(seg(lt, av, av + 0.25)));
        if (m > 0.6) K.burst(540, 700, 1.3, 1 - seg(lt, av + 0.6, av + 1.2));
      } });
    cue(st, 'whoosh'); cue(st + av, 'sparkle', { dur: 0.8, gain: 0.35 });
  }
  // three frames in a column (for lines 8-9)
  const trio = (hd, hn, nz) => { for (let i = 0; i < 3; i++) K.nightScene(540, 390 + i * 330, 380, 285, { bright: 0.45, noise: nz, seed: i * 7 + 3, hiDetail: hd, hiNoise: hn }); };
  // ── 8 · The real details show up in every frame, ──
  {
    const st = cut(7), de = Wd('details', 7) - st, ev = Wd('every', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 720], zoom: 0.08, note: 'three frames in a column; house + moon get yellow rings on "details"; SAME EVERY TIME pill on "every"',
      draw(lt, d, t) {
        disc();
        trio(lt > de ? E(seg(lt, de, de + 0.3)) : 0, 0, 0.25);
        if (lt > ev) K.pill('SAME EVERY TIME', 540, 150, 56, C.yellow, C.ink, E(seg(lt, ev, ev + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + de, 'sparkle', { dur: 0.4, gain: 0.3 }); cue(st + ev, 'pop', { gain: 0.4 });
  }
  // ── 9 · but the noise lands somewhere different each time, ──
  {
    const st = cut(8), no = Wd('noise', 8) - st, di = Wd('different', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 720], zoom: 0.08, note: 'same three frames, grain flares on "noise"; red rings land on DIFFERENT specks in each frame on "different"',
      draw(lt, d, t) {
        disc();
        trio(0, lt > di ? E(seg(lt, di, di + 0.3)) : 0, lerp(0.25, 0.9, eo(seg(lt, no, no + 0.3))));
        if (lt > di) K.pill('RANDOM SPOTS', 540, 150, 56, C.red, C.white, E(seg(lt, di, di + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + no, 'sizzle', { dur: 0.5, gain: 0.2 }); cue(st + di, 'pop', { gain: 0.4 });
  }
  // ── 10 · so it mostly cancels out. ──
  {
    const st = cut(9), ca = Wd('cancels', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 720], zoom: 0.14, note: 'the three frames slide together into one; grain fades and the photo goes clean on "cancels"; green check',
      draw(lt, d, t) {
        disc();
        const m = eio(seg(lt, 0, ca + 0.2));
        for (let i = 0; i < 3; i++) if (m < 1) K.nightScene(540, lerp(390 + i * 330, 720, m), lerp(380, 640, m), lerp(285, 480, m), { bright: 0.45, noise: 0.9, seed: i * 7 + 3 });
        const c = eo(seg(lt, ca, ca + 0.5));
        if (m >= 1) K.nightScene(540, 720, 640, 480, { bright: lerp(0.5, 1, c), noise: lerp(0.6, 0, c), seed: 3 });
        if (lt > ca + 0.2) K.check(870, 380, 0.9, E(seg(lt, ca + 0.2, ca + 0.45)));
      } });
    cue(st, 'whoosh'); cue(st + ca, 'sparkle', { dur: 0.6, gain: 0.35 });
  }
  // ── 11 · That's why your phone tells you to hold still. ──
  {
    const st = cut(10), wh = Wd('why', 10) - st, te = Wd('tells', 10) - st, sl = Wd('still', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 640], zoom: 0.14, note: 'hero beside a big phone: HOLD STILL appears on "tells", capture ring fills; hero freezes stiff (eyes wide) on "still"',
      draw(lt, d, t) {
        nightDisc();
        const frozen = lt > sl;
        K.man({ x: 280, y: 880, s: 0.62, arm: K.ARM.point, finger: 0.4, eyes: frozen ? 'wide' : 'n', mouth: frozen ? 'flat' : talk(lt), brow: frozen ? 0.9 : 0.3, look: 1 });
        const p = seg(lt, te, d), n = Math.floor(p * 15);
        K.phone(740, 680, 0.95, () => K.nightCamScreen(t, p, n, lt > te ? E(seg(lt, te, te + 0.3)) : 0, lerp(0.15, 0.7, p)));
        if (lt > wh && lt < te) K.qmark(280, 330, 0.7, E(seg(lt, wh, wh + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + te, 'pop', { gain: 0.4 }); cue(st + sl, 'thud', { gain: 0.3 });
  }
  // ── 12 · And on a tripod, some phones keep going for four whole minutes, ──
  {
    const st = cut(11), tr = Wd('tripod', 11) - st, ke = Wd('keep', 11) - st, fo = Wd('four', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 700], zoom: 0.12, note: 'tripod rises on "tripod" with a phone on top; on "keep" a stopwatch spins; 4 MINUTES pill on "four"',
      draw(lt, d, t) {
        nightDisc();
        for (let i = 0; i < 14; i++) circle(120 + rnd(i * 3.1) * 840, 280 + rnd(i * 7.3) * 300, 6, C.white);
        const up = eo(seg(lt, tr - 0.2, tr + 0.35));
        const ty = lerp(1500, 760, up);
        K.tripod(380, ty, 0.85);
        K.phone(380, ty - 230, 0.6, () => K.nightCamScreen(t, seg(lt, ke, d), 0, 0, 0.6));
        if (lt > ke) K.stopwatch(790, 820, 0.55 * E(seg(lt, ke, ke + 0.3)), (lt - ke) * 6);
        if (lt > fo) K.pill('4 MINUTES', 790, 1170, 60, C.yellow, C.ink, E(seg(lt, fo, fo + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + tr, 'slide', { dur: 0.4, gain: 0.3 }); cue(st + ke, 'tock', { gain: 0.3 }); cue(st + fo, 'pop', { gain: 0.45 });
  }
  // ── 13a · in short chunks, ──
  {
    const st = cut(12), ch = Wd('chunks', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 720], zoom: 0.1, note: 'one long yellow time bar splits into 15 short chunks on "chunks"; UP TO 16 SEC EACH pill',
      draw(lt, d, t) {
        nightDisc();
        const sp = eo(seg(lt, ch, ch + 0.4)), gap = 14 * sp, w = (820 - gap * 14) / 15;
        for (let i = 0; i < 15; i++) {
          const x = 130 + i * (w + gap), fill = clamp(seg(lt, 0, d) * 15 - i);
          rr(x, 690, w, 90, 12); ctx.fillStyle = '#22304A'; ctx.fill();
          rr(x, 690, w * Math.max(fill, sp > 0.99 ? 1 : 0), 90, 12); ctx.fillStyle = C.yellow; ctx.fill();
        }
        if (lt > ch) K.pill('UP TO 16 SEC EACH', 540, 470, 56, C.white, C.ink, E(seg(lt, ch + 0.2, ch + 0.45)));
        K.pill('4 MIN', 540, 940, 56, C.ink, C.white, 1);
      } });
    cue(st, 'whoosh'); cue(st + ch, 'pop', { gain: 0.4 });
  }
  // ── 13b · so the stars stay sharp dots instead of streaks. ──
  {
    const st = Wd('so', 12) - 0.08, sa = Wd('stars', 12) - st, dt = Wd('dots', 12) - st, sk = Wd('streaks', 12) - st;
    add({ id: 'S14', at: st, cam: [540, 720], zoom: 0.08, note: 'two sky photos: top one with sharp dot stars gets a check on "dots"; bottom one with streaky stars gets a red X on "streaks"',
      draw(lt, d, t) {
        disc();
        K.nightScene(540, 420, 560, 420, { bright: 0.75, stars: 'dots' });
        if (lt > sk - 0.3) K.nightScene(540, 1000, 480, 360, { bright: 0.75, stars: 'streak', rot: 0.03 * E(seg(lt, sk - 0.3, sk)) });
        if (lt > sa && lt < dt) K.burst(540, 300, 0.8, 1 - seg(lt, sa, sa + 0.5));
        if (lt > dt) K.check(860, 260, 0.6, E(seg(lt, dt, dt + 0.25)));
        if (lt > sk) K.redX(540, 1000, lerp(1.3, 0.8, eo(seg(lt, sk, sk + 0.2))), 1);
      } });
    cue(st, 'whoosh'); cue(st + sa, 'sparkle', { dur: 0.4, gain: 0.3 }); cue(st + dt, 'pop', { gain: 0.4 }); cue(st + sk + 0.05, 'slam', { gain: 0.35 });
  }
  // ── 14 · So your night photo is really fifteen photos in a trench coat. ──
  {
    const st = cut(13), fi = Wd('fifteen', 13) - st, tr = Wd('trench', 13) - st;
    add({ id: 'S15', at: st, cam: [540, 640], zoom: 0.14, note: 'one clean night photo; on "fifteen" it fans into a stack (15 PHOTOS); on "trench" the stack is a figure in a trench coat + hat that sways',
      draw(lt, d, t) {
        disc();
        if (lt < tr) {
          const sp = eo(seg(lt, fi, fi + 0.4));
          for (let i = 4; i >= 0; i--) K.nightScene(540 + i * 22 * sp, 720 - i * 22 * sp, 600, 450, { bright: 1 });
          if (lt > fi) K.pill('15 PHOTOS', 540, 260, 70, C.yellow, C.ink, E(seg(lt, fi, fi + 0.25)));
        } else {
          K.trenchStack(540, 760, lerp(0.6, 1, E(seg(lt, tr, tr + 0.35))), Math.sin(lt * 3) * 0.05, t);
          K.pill('TRENCH COAT', 540, 170, 62, C.ink, C.white, E(seg(lt, tr + 0.1, tr + 0.35)));
        }
      } });
    cue(st, 'whoosh'); cue(st + fi, 'pop', { gain: 0.4 }); cue(st + tr, 'boing', { gain: 0.35 });
  }
  return { shots: S, cues: CUES };
}
