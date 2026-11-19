// WHAT ACTUALLY HAPPENS WHEN YOU PRESS CTRL+Z?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const disc = () => { fillAll(C.bg); circle(540, 740, 520, '#E4DCCB'); };
const press = (lt, t0) => (lt < t0 ? 0 : clamp(1 - Math.abs(lt - t0 - 0.08) / 0.12));
const ctrlZ = (x, y, s, pz, hi = false) => { K.keycap(x - 200 * s, y, s, 'CTRL', pz > 0 ? 1 : 0, 1.3); bigText('+', x + 20 * s, y - 20 * s, 100 * s, C.ink); K.keycap(x + 230 * s, y, s, 'Z', pz, 1, hi); };
const ALL = ['TYPE', 'DELETE', 'MOVE'];

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · HOOK: hero, CTRL + Z keys above; Z slams on "Z" ──────────────
  {
    const st = cut(0), pr = Wd('press', 0) - st, z = Wd('z', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 600], zoom: 0.1, note: 'hero close-up; CTRL + Z keycaps drop in on "press", Z pushes down + turns yellow on "Z", hero wide-eyed',
      draw(lt, d, t) {
        K.room();
        const got = lt > z;
        K.man({ x: 540, y: 1330, s: 1.45, arm: K.armPose(K.ARM.down, K.ARM.point, eo(seg(lt, 0.2, 0.6))), finger: 0,
          eyes: got ? 'wide' : 'n', mouth: got ? 'o' : 'smile', brow: got ? 1 : 0.4, look: 0.3 });
        const k = E(seg(lt, pr - 0.3, pr + 0.1));
        if (k > 0) {
          ctx.save(); ctx.translate(540, 300); ctx.scale(k, k); ctrlZ(0, 0, 0.95, press(lt, z - 0.05), got); ctx.restore();
          if (got) K.sparkleStar(870, 150, 0.8, clamp(1 - (lt - z) * 1.2));
        }
      } });
    cue(st + pr - 0.2, 'pop', { gain: 0.35 }); cue(st + z, 'thud', { gain: 0.4 }); cue(st + z + 0.1, 'boing', { gain: 0.3 });
  }

  // ── 2 · type, delete or move: the doc changes on each word ───────────
  {
    const st = cut(1), ty = Wd('type', 1) - st, de = Wd('delete', 1) - st, mv = Wd('move', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 760], zoom: 0.08, note: 'Docs window: "Hello there" types on "type", "there" shrinks away on "delete", picture slides right on "move"; TYPE / DELETE / MOVE pills',
      draw(lt, d, t) {
        disc();
        const chars = lerp(0, 11, seg(lt, ty - 0.2, de - 0.15)), del = seg(lt, de, de + 0.3), img = eio(seg(lt, mv, mv + 0.45));
        K.appWindow(540, 780, 880, 820, 'docs', () => K.docEdit({ chars, del, img }, t));
        const pl = [['TYPE', ty, 230], ['DELETE', de, 540], ['MOVE', mv, 850]];
        for (const [lab, w, x] of pl) if (lt > w) K.pill(lab, x, 260, 52, K.PLATE_COLS[lab], C.white, E(seg(lt, w, w + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ty, 'tock', { gain: 0.3 }); cue(st + ty + 0.15, 'tock', { gain: 0.3 }); cue(st + de, 'zip', { gain: 0.3 }); cue(st + mv, 'slide', { dur: 0.45, gain: 0.25 });
  }

  // ── 3 · your app writes it down on a hidden list ─────────────────────
  {
    const st = cut(2), wr = Wd('writes', 2) - st, hd = Wd('hidden', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 740], zoom: 0.1, note: 'Docs window slides left; a HISTORY list slides out from behind it, rows write in from "writes"; HIDDEN pill on "hidden"',
      draw(lt, d, t) {
        disc();
        const out = eio(seg(lt, 0, wr));
        const shown = clamp(Math.floor((lt - wr) / 0.25) + 1, 0, 3);
        K.historyCard(lerp(540, 720, out), 780, lerp(0.8, 0.95, out), ['TYPE "there"', 'DELETE "there"', 'MOVE picture'], shown, 0, 'UNDO LIST');
        K.appWindow(lerp(540, 215, out), lerp(780, 840, out), 880, 820, 'docs', () => K.docEdit({ img: 1, del: 1, cursor: false }, t), lerp(1, 0.44, out));
        if (lt > hd) K.pill('HIDDEN', 720, 360, 62, C.ink, C.white, E(seg(lt, hd, hd + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'slide', { dur: 0.4, gain: 0.2 }); for (let i = 0; i < 3; i++) cue(st + wr + i * 0.25, 'tock', { gain: 0.3 }); cue(st + hd, 'pop', { gain: 0.35 });
  }

  // ── 4 · stacked like plates, newest on top ───────────────────────────
  {
    const st = cut(3), pl = Wd('plates', 3) - st, nw = Wd('newest', 3) - st, tp = Wd('top', 3) - st;
    const drops = [0.1, pl - 0.1, nw - 0.25];
    add({ id: 'S04', at: st, cam: [540, 800], zoom: 0.1, note: 'plates drop onto the UNDO tray one by one: TYPE, DELETE, MOVE (last on "newest"); NEWEST arrow on "top"',
      draw(lt, d, t) {
        disc();
        K.pileTray(540, 1120, 1.2, 'UNDO');
        for (let i = 0; i < 3; i++) {
          const u = eo(seg(lt, drops[i], drops[i] + 0.3)); if (u <= 0) continue;
          K.plate(540, lerp(-150, K.slotY(1120, 1.2, i), u), 1.2, ALL[i], { glow: i === 2 && lt > tp ? 1 : 0 });
        }
        if (lt > tp) { const a = E(seg(lt, tp, tp + 0.25)); K.arrow(880, K.slotY(1120, 1.2, 2), 120 * a, Math.PI, a); K.pill('NEWEST', 540, 380, 64, C.yellow, C.ink, a); }
      } });
    cue(st, 'whoosh'); for (const dt of drops) cue(st + dt + 0.3, 'thud', { gain: 0.35 }); cue(st + tp, 'pop', { gain: 0.35 });
  }

  // ── 5 · undo lifts the top plate off and reverses it ─────────────────
  {
    const st = cut(4), un = Wd('undo', 4) - st, li = Wd('lifts', 4) - st, rv = Wd('reverses', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 760], zoom: 0.08, note: 'CTRL+Z presses on "undo"; MOVE plate lifts off on "lifts"; mini doc: picture slides back left with a yellow back-arrow on "reverses"',
      draw(lt, d, t) {
        disc();
        ctrlZ(540, 230, 0.7, press(lt, un), lt > un);
        const lf = eio(seg(lt, li - 0.05, li + 0.4));
        K.plateStack(300, 1140, 0.95, ALL, { hide: 1 });
        K.plate(lerp(300, 330, lf), lerp(K.slotY(1140, 0.95, 2), 560, lf), 0.95, 'MOVE', { glow: 1, rot: lf * -0.08 });
        const back = eio(seg(lt, rv, rv + 0.5));
        K.appWindow(790, 900, 820, 820, 'docs', () => K.docEdit({ chars: 11, del: 1, img: 1 - back, cursor: false }, t), 0.52);
        if (lt > rv - 0.1) K.undoArrow(790, 560, 95, eo(seg(lt, rv - 0.1, rv + 0.35)));
      } });
    cue(st, 'whoosh'); cue(st + un, 'tock', { gain: 0.4 }); cue(st + li, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + rv, 'zip', { gain: 0.3 });
  }

  // ── 6 · every extra press goes one more step back ───────────────────
  {
    const st = cut(5), pr = Wd('press', 5) - st, bk = Wd('back', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.08, note: 'CTRL+Z presses again on "press"; DELETE plate lifts up to join MOVE; "there" comes back in the doc on "back"; 2 STEPS BACK pill',
      draw(lt, d, t) {
        disc();
        ctrlZ(540, 230, 0.7, press(lt, pr), lt > pr);
        const lf = eio(seg(lt, pr + 0.05, pr + 0.45));
        K.pileTray(300, 1140, 0.95, 'UNDO'); K.plate(300, K.slotY(1140, 0.95, 0), 0.95, 'TYPE');
        K.plate(330, 560, 0.95, 'MOVE', { rot: -0.08 });
        K.plate(lerp(300, 330, lf), lerp(K.slotY(1140, 0.95, 1), 470, lf), 0.95, 'DELETE', { glow: 1, rot: lf * -0.05 });
        const back = seg(lt, bk - 0.1, bk + 0.3);
        K.appWindow(790, 900, 820, 820, 'docs', () => K.docEdit({ chars: 11, del: 1 - back, img: 0, cursor: false }, t), 0.52);
        if (lt > bk - 0.1) K.undoArrow(790, 560, 95, eo(seg(lt, bk - 0.1, bk + 0.3)));
        if (lt > bk) K.pill('2 STEPS BACK', 790, 1230, 46, C.ink, C.white, E(seg(lt, bk, bk + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + pr, 'tock', { gain: 0.4 }); cue(st + pr + 0.05, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + bk, 'pop', { gain: 0.35 });
  }

  // ── 7 · but those plates aren't thrown away ─────────────────────────
  {
    const st = cut(6), th = Wd('thrown', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 760], zoom: 0.1, note: 'the two lifted plates hover over an open trash can, wobbling; big red X slams over the can on "thrown"',
      draw(lt, d, t) {
        disc();
        K.trashCan(540, 1000, 1.3, 0.6);
        const bob = Math.sin(lt * 4) * 12;
        K.plate(540, 480 + bob, 1, 'DELETE', { rot: 0.04 });
        K.plate(540, 390 + bob, 1, 'MOVE', { rot: -0.04 });
        if (lt > th) K.redX(540, 980, lerp(1.6, 0.9, eo(seg(lt, th, th + 0.2))), 1);
      } });
    cue(st, 'whoosh'); cue(st + th, 'slam', { gain: 0.5 });
  }

  // ── 8 · they wait on a second pile ──────────────────────────────────
  {
    const st = cut(7), sc = Wd('second', 7) - st, pi = Wd('pile', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 780], zoom: 0.08, note: 'UNDO pile (TYPE) left; REDO tray rises on the right on "second"; MOVE then DELETE plates land there on "pile"',
      draw(lt, d, t) {
        disc();
        K.plateStack(290, 1120, 0.9, ['TYPE']);
        const tr = eo(seg(lt, sc - 0.3, sc + 0.1));
        if (tr > 0) K.pileTray(790, lerp(1700, 1120, tr), 0.9, 'REDO', '#8A6BD1');
        const l1 = eio(seg(lt, sc, pi)), l2 = eio(seg(lt, sc + 0.15, pi + 0.2));
        K.plate(lerp(540, 790, l1), lerp(420, K.slotY(1120, 0.9, 0), l1), 0.9, 'MOVE');
        K.plate(lerp(540, 790, l2), lerp(330, K.slotY(1120, 0.9, 1), l2), 0.9, 'DELETE');
      } });
    cue(st, 'whoosh'); cue(st + sc - 0.2, 'slide', { dur: 0.3, gain: 0.2 }); cue(st + pi, 'thud', { gain: 0.35 }); cue(st + pi + 0.2, 'thud', { gain: 0.35 });
  }

  // ── 9 · and that's what redo puts back ──────────────────────────────
  {
    const st = cut(8), rd = Wd('redo', 8) - st, bk = Wd('back', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 780], zoom: 0.08, note: 'REDO pill on "redo"; top REDO plate (DELETE) arcs back onto the UNDO pile on "back"; forward arrow',
      draw(lt, d, t) {
        disc();
        K.pileTray(290, 1120, 0.9, 'UNDO'); K.plate(290, K.slotY(1120, 0.9, 0), 0.9, 'TYPE');
        K.pileTray(790, 1120, 0.9, 'REDO', '#8A6BD1'); K.plate(790, K.slotY(1120, 0.9, 0), 0.9, 'MOVE');
        const u = eio(seg(lt, rd, bk + 0.1));
        const [x, y] = K.arcAt(790, K.slotY(1120, 0.9, 1), 290, K.slotY(1120, 0.9, 1), 380, u);
        K.plate(x, y, 0.9, 'DELETE', { glow: 1, rot: Math.sin(u * Math.PI) * 0.15 });
        if (lt > rd) K.pill('REDO', 540, 260, 70, '#8A6BD1', C.white, E(seg(lt, rd, rd + 0.25)));
        if (lt > bk) K.undoArrow(540, 560, 80, eo(seg(lt, bk, bk + 0.3)), C.yellow, true);
      } });
    cue(st, 'whoosh'); cue(st + rd, 'pop', { gain: 0.35 }); cue(st + rd + 0.05, 'slide', { dur: 0.5, gain: 0.25 }); cue(st + bk + 0.1, 'thud', { gain: 0.4 });
  }

  // ── 10 · here's the catch ───────────────────────────────────────────
  {
    const st = cut(9), ca = Wd('catch', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 600], zoom: 0.14, note: 'hero raises a finger, frowns; warning sign pops beside his head on "catch"',
      draw(lt, d, t) {
        K.room();
        K.man({ x: 540, y: 1330, s: 1.45, arm: K.armPose(K.ARM.down, K.ARM.point, eo(seg(lt, 0.05, 0.4))), finger: lt > ca ? Math.sin(lt * 11) * 0.3 : 0,
          eyes: 'n', mouth: lt > ca ? 'flat' : 'smirk', brow: 0.9, frown: lt > ca, look: 0 });
        if (lt > ca - 0.1) K.warning(180, 820, 0.9 * E(seg(lt, ca - 0.1, ca + 0.2)));
      } });
    cue(st, 'whoosh'); cue(st + ca, 'alarm', { dur: 0.5, gain: 0.25 });
  }

  // ── 11 · do anything new, and that redo pile gets wiped ─────────────
  {
    const st = cut(10), nw = Wd('new', 10) - st, wp = Wd('wiped', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 780], zoom: 0.1, note: 'new BOLD plate drops on the UNDO pile on "new"; REDO tray flashes red and its plate flies off-screen on "wiped"; WIPED pill',
      draw(lt, d, t) {
        disc();
        const dr = eo(seg(lt, nw - 0.1, nw + 0.25));
        K.plateStack(290, 1120, 0.9, ['TYPE', 'DELETE']);
        if (dr > 0) K.plate(290, lerp(-120, K.slotY(1120, 0.9, 2), dr), 0.9, 'BOLD', { glow: lt > nw + 0.3 && lt < wp ? 1 : 0 });
        const fl = lt > wp && lt < wp + 0.6 ? 1 : 0;
        K.pileTray(790, 1120, 0.9, 'REDO', '#8A6BD1', fl);
        const k = eio(seg(lt, wp - 0.05, wp + 0.4));
        K.plate(lerp(790, 1400, k), lerp(K.slotY(1120, 0.9, 0), 700, k), 0.9, 'MOVE', { rot: k * 1.2, a: 1 - k * 0.3 });
        if (lt > wp) K.pill('WIPED', 790, 560, 70, C.red, C.white, E(seg(lt, wp, wp + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + nw + 0.15, 'thud', { gain: 0.4 }); cue(st + wp, 'zip', { gain: 0.4 }); cue(st + wp + 0.05, 'slam', { gain: 0.3 });
  }

  // ── 12 · and why Z? ─────────────────────────────────────────────────
  {
    const st = cut(11), z = Wd('z', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 640], zoom: 0.16, note: 'giant yellow Z keycap spins in above the puzzled hero; question marks on "Z"',
      draw(lt, d, t) {
        K.room();
        K.man({ x: 540, y: 1420, s: 1.3, eyes: 'n', mouth: 'o', brow: 1, look: -0.3 });
        const k = E(seg(lt, 0, 0.35));
        ctx.save(); ctx.translate(540, 360); ctx.rotate((1 - k) * -0.6 + Math.sin(lt * 3) * 0.05); K.keycap(0, 0, 1.3 * k, 'Z', 0, 1, true); ctx.restore();
        if (lt > z) { bigText('?', 250, 720, 150 * E(seg(lt, z, z + 0.2)), C.ink, -0.2); bigText('?', 840, 780, 120 * E(seg(lt, z + 0.1, z + 0.3)), C.ink, 0.25); }
      } });
    cue(st, 'whoosh'); cue(st + 0.2, 'boing', { gain: 0.3 }); cue(st + z, 'pop', { gain: 0.3 });
  }

  // ── 13a · in 1983, Apple's Lisa ─────────────────────────────────────
  {
    const st = cut(12), yr = Wd('nineteen', 12) - st, li = Wd('lisa', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 700], zoom: 0.08, note: 'retro computer with an Undo/Cut/Copy/Paste menu; 1983 pill on "nineteen", APPLE LISA pill + Undo highlight on "Lisa"',
      draw(lt, d, t) {
        disc();
        K.retroPC(540, 760, 1.1, () => {
          ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.font = '900 50px Inter';
          const items = ['Undo', 'Cut', 'Copy', 'Paste'];
          for (let i = 0; i < 4; i++) { const yy = -105 + i * 62; if (i === 0 && lt > li) { rr(-170, yy - 30, 340, 60, 10); ctx.fillStyle = C.yellow; ctx.fill(); } ctx.fillStyle = '#2A3A3A'; ctx.fillText(items[i], -140, yy + 2); }
        });
        if (lt > yr - 0.1) K.pill('1983', 540, 250, 90, C.yellow, C.ink, E(seg(lt, yr - 0.1, yr + 0.2)));
        if (lt > li) K.pill('APPLE LISA', 540, 1170, 60, C.ink, C.white, E(seg(lt, li, li + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + yr, 'pop', { gain: 0.35 }); cue(st + li, 'pop', { gain: 0.35 });
  }

  // ── 13b · put it next to X, C and V ─────────────────────────────────
  {
    const st = Wd('put', 12) - 0.12, nx = Wd('next', 12) - st, x = Wd('x', 12) - st, c = Wd('c', 12) - st, v = Wd('v', 12) - st;
    add({ id: 'S14', at: st, cam: [400, 820], zoom: 0.1, note: 'keyboard close-up: Z goes yellow on "next", X, C, V ring yellow on their words; labels UNDO CUT COPY PASTE above',
      draw(lt, d, t) {
        disc();
        const hi = {};
        if (lt > nx - 0.1) hi.Z = 'y'; if (lt > x) hi.X = 'ring'; if (lt > c) hi.C = 'ring'; if (lt > v) hi.V = 'ring';
        const kx = 700, ky = 920, ks = 1.4;
        K.keyboard(kx, ky, ks, hi, { Z: press(lt, nx - 0.1), X: press(lt, x), C: press(lt, c), V: press(lt, v) });
        const labs = [['Z', 'UNDO', nx - 0.1, C.yellow, C.ink], ['X', 'CUT', x, C.ink, C.white], ['C', 'COPY', c, C.ink, C.white], ['V', 'PASTE', v, C.ink, C.white]];
        labs.forEach(([k, lab, w, bg, fg], i) => { if (lt > w) { const [px, py] = K.keyXY(kx, ky, ks, k); K.pill(lab, px, 520 - (i % 2) * 90, 44, bg, fg, E(seg(lt, w, w + 0.2))); } });
      } });
    cue(st, 'whoosh'); cue(st + nx, 'pop', { gain: 0.4 }); cue(st + x, 'tock', { gain: 0.3 }); cue(st + c, 'tock', { gain: 0.3 }); cue(st + v, 'tock', { gain: 0.3 });
  }

  // ── 14 · so one hand reaches them all ───────────────────────────────
  {
    const st = cut(13), hd = Wd('hand', 13) - st, re = Wd('reaches', 13) - st;
    add({ id: 'S15', at: st, cam: [540, 760], zoom: 0.03, note: 'CTRL Z X C V keycaps in a row; a yellow arc spans them on "hand"; ONE HAND pill; each key bounces in turn on "reaches"',
      draw(lt, d, t) {
        disc();
        const ks = ['CTRL', 'Z', 'X', 'C', 'V'], xs = [230, 410, 565, 720, 875];
        ks.forEach((k, i) => { const q = lt - re - i * 0.1; const b = q > 0 && q < 0.26 ? Math.sin(q / 0.26 * Math.PI) : 0;
          K.keycap(xs[i], 900, 0.7, k, b, i ? 1 : 1.25, i === 1); });
        const p = eo(seg(lt, hd - 0.2, hd + 0.3));
        if (p > 0) { ctx.save(); ctx.beginPath(); ctx.arc(541, 980, 400, Math.PI + 0.25, Math.PI + 0.25 + (Math.PI - 0.5) * p); ctx.lineCap = 'round';
          ctx.lineWidth = 30; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.lineWidth = 18; ctx.strokeStyle = C.yellow; ctx.stroke(); ctx.restore(); }
        if (lt > hd) K.pill('ONE HAND', 540, 380, 70, C.yellow, C.ink, E(seg(lt, hd, hd + 0.25)));
        if (lt > hd + 0.3) K.pill('MOUSE HAND FREE', 540, 1170, 44, C.ink, C.white, E(seg(lt, hd + 0.3, hd + 0.55)));
      } });
    cue(st, 'whoosh'); cue(st + hd - 0.2, 'slide', { dur: 0.4, gain: 0.2 }); cue(st + hd, 'pop', { gain: 0.35 }); for (let i = 0; i < 5; i++) cue(st + re + i * 0.1, 'tock', { gain: 0.25 });
  }

  // ── 15a · so Control Z isn't magic ──────────────────────────────────
  {
    const st = cut(14), mg = Wd('magic', 14) - st;
    add({ id: 'S16', at: st, cam: [540, 620], zoom: 0.08, note: 'hero to camera with CTRL+Z keys floating in sparkles; red X slams over the keys on "magic"',
      draw(lt, d, t) {
        K.room();
        K.man({ x: 540, y: 1330, s: 1.45, eyes: 'n', mouth: 'smirk', brow: 0.6, look: 0 });
        ctrlZ(540, 300, 0.6, 0, true);
        for (let i = 0; i < 4; i++) K.sparkleStar(250 + i * 190, 170 + (i % 2) * 260, 0.5 + 0.2 * Math.sin(lt * 6 + i), lt > mg ? 0.4 : 1);
        if (lt > mg) K.redX(540, 300, lerp(1.1, 0.6, eo(seg(lt, mg, mg + 0.2))), 1);
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'sparkle', { dur: 0.6, gain: 0.25 }); cue(st + mg, 'slam', { gain: 0.45 });
  }

  // ── 15b · it's just a stack of plates (loop) ────────────────────────
  {
    const st = Wd("it's", 14) - 0.12, sk = Wd('stack', 14) - st, pl = Wd('plates', 14) - st;
    add({ id: 'S17', at: st, cam: [540, 700], zoom: 0.1, note: 'hero points to an UNDO pile beside him; plates stack up on "stack"; CTRL + Z pill on top plate on "plates", hero winks',
      draw(lt, d, t) {
        K.room();
        K.man({ x: 360, y: 1330, s: 1.3, arm: K.armPose(K.ARM.down, K.ARM.point, eo(seg(lt, 0.05, 0.4))), finger: 0,
          eyes: lt > pl + 0.25 ? 'wink' : 'n', mouth: lt > pl ? 'grin' : 'smirk', brow: 0.6, look: 0.3 });
        K.pileTray(820, 1150, 0.7, 'UNDO');
        const labs = ['TYPE', 'DELETE', 'MOVE', 'BOLD', 'PASTE'];
        for (let i = 0; i < 5; i++) { const u = eo(seg(lt, sk - 0.3 + i * 0.08, sk - 0.05 + i * 0.08)); if (u > 0) K.plate(820, lerp(-100, K.slotY(1150, 0.7, i), u), 0.7, labs[i], { glow: i === 4 && lt > pl ? 1 : 0 }); }
        if (lt > pl) K.pill('CTRL + Z', 820, 520, 56, C.yellow, C.ink, E(seg(lt, pl, pl + 0.25)));
      } });
    cue(st, 'whoosh'); for (let i = 0; i < 5; i++) cue(st + sk - 0.05 + i * 0.08, 'tock', { gain: 0.25 }); cue(st + pl, 'pop', { gain: 0.35 }); cue(st + pl + 0.25, 'boing', { gain: 0.3 });
  }

  return { shots: S, cues: CUES };
}
