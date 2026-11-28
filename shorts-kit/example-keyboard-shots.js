// HOW DOES YOUR KEYBOARD KNOW WHICH KEY YOU PRESSED?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const disc = () => { fillAll(C.bg); circle(540, 740, 520, '#E4DCCB'); };
const GREEN = '#3FAE5F';

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · How does your keyboard know which key you pressed? ─────
  {
    const st = cut(0), pr = Wd('pressed', 0) - st, tap = 0.55;
    add({ id: 'S01', at: st, cam: [540, 720], zoom: 0.12, note: 'monitor top, keyboard below; finger taps K at 0.55 s, K appears on screen; HOW? pill on "pressed"',
      draw(lt, d, t) {
        disc();
        const down = clamp(1 - Math.abs(lt - tap) / 0.12);
        K.monitor(540, 400, 0.72, () => K.typedScreen(lt > tap ? 'K' : '', lt), E(seg(lt, 0, 0.3)));
        const [kx, ky] = K.kbKeyXY(540, 1000, 0.95, 1, 7);
        K.kbBoard(540, 1000, 0.95, { press: { '1,7': down }, hi: lt > tap ? { '1,7': 'y' } : {} });
        K.tapFinger(kx, ky + 10, E(seg(lt, 0.05, 0.45)) * (lt > 1.2 ? 1 - seg(lt, 1.2, 1.6) : 1), down);
        K.ripple(kx, ky, seg(lt, tap, tap + 0.5));
        if (lt > pr) { K.pill('HOW?', 880, 190, 72, C.yellow, C.ink, E(seg(lt, pr, pr + 0.25))); K.burst(880, 190, 2, 1 - seg(lt, pr, pr + 0.5)); }
      } });
    cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + tap, 'tock', { gain: 0.35 }); cue(st + pr, 'pop', { gain: 0.45 });
  }
  // ── 2 · Well, hidden under the keys is a grid of wires, ────────
  {
    const st = cut(1), hi = Wd('hidden', 1) - st, gr = Wd('grid', 1) - st, wi = Wd('wires', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 760], zoom: 0.14, note: 'x-ray film; keyboard fades see-through from "hidden"; wire grid draws in on "grid"; GRID OF WIRES tag on "wires"',
      draw(lt, d, t) {
        K.xray(t);
        const g = eio(seg(lt, gr - 0.3, gr + 0.5));
        K.kbBoard(540, 760, 1, { a: lerp(1, 0.12, eio(seg(lt, hi, hi + 0.7))) });
        K.matrixGrid(540, 760, 1, { rowP: g, colP: g });
        if (lt > wi) K.pill('GRID OF WIRES', 540, 1130, 62, C.yellow, C.ink, E(seg(lt, wi, wi + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + hi, 'sparkle', { dur: 0.5, gain: 0.25 }); cue(st + gr, 'slide', { dur: 0.6, gain: 0.25 }); cue(st + wi, 'pop', { gain: 0.4 });
  }
  // ── 3 · rows running across and columns running down. ─────────
  {
    const st = cut(2), ro = Wd('rows', 2) - st, co = Wd('columns', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 760], zoom: 0.12, note: 'bare grid; rows sweep across in orange on "rows" (ROWS pill); columns drop down in cyan on "columns" (COLUMNS pill)',
      draw(lt, d, t) {
        K.xray(t);
        K.matrixGrid(540, 760, 1, { rowP: eio(seg(lt, ro - 0.1, ro + 0.7)), colP: eio(seg(lt, co - 0.1, co + 0.7)) });
        if (lt > ro) K.pill('ROWS →', 540, 420, 64, '#F29A3A', C.ink, E(seg(lt, ro, ro + 0.25)));
        if (lt > co) K.pill('COLUMNS ↓', 540, 1110, 64, C.cyan, C.ink, E(seg(lt, co, co + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ro, 'slide', { dur: 0.6, gain: 0.25 }); cue(st + co, 'slide', { dur: 0.6, gain: 0.25 });
  }
  // ── 4 · Press a key, and it connects one row to one column, ────
  {
    const st = cut(3), pr = Wd('press', 3) - st, cn = Wd('connects', 3) - st, ro = Wd('row', 3) - st, co = Wd('column', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 760], zoom: 0.12, note: 'close-up of one crossing under the K key; key pushes down on "press"; contact closes on "connects"; row lights on "row", column on "column"',
      draw(lt, d, t) {
        disc();
        const p = eio(seg(lt, pr, pr + 0.35)), c = seg(lt, cn - 0.15, cn + 0.1);
        K.crossClose(540, 700, 1.05, p, c, lt > ro ? 1 : 0, lt > co ? 1 : 0);
        if (c >= 1) K.burst(540, 826, 1.4, 1 - seg(lt, cn + 0.1, cn + 0.6));
        if (lt > ro) K.pill('ROW', 200, 930, 58, '#F29A3A', C.ink, E(seg(lt, ro, ro + 0.25)));
        if (lt > co) K.pill('COLUMN', 800, 1100, 58, C.cyan, C.ink, E(seg(lt, co, co + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + pr + 0.2, 'tock', { gain: 0.4 }); cue(st + cn, 'sparkle', { dur: 0.4, gain: 0.3 }); cue(st + ro, 'pop', { gain: 0.3 }); cue(st + co, 'pop', { gain: 0.3 });
  }
  // ── 5 · like a tiny crossroads. ────────────────────────────────
  {
    const st = cut(4), cr = Wd('crossroads', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 780], zoom: 0.14, note: 'grid with the K crossing glowing; a little road crossroads card pops below on "crossroads", yellow car drives through',
      draw(lt, d, t) {
        K.xray(t);
        K.matrixGrid(540, 560, 0.95, { rowHi: 1, colHi: 7, hit: [7, 1], hitP: 0.7 + 0.3 * Math.sin(lt * 8) });
        const [hx, hy] = K.matrixXY(540, 560, 0.95, 7, 1);
        const p = E(seg(lt, cr - 0.25, cr + 0.1));
        if (p > 0) { ctx.save(); ctx.globalAlpha = clamp(p); ctx.setLineDash([16, 14]); line([[hx, hy + 30], [540, 860]], C.yellow, 8); ctx.restore(); }
        K.crossroads(540, 1020, 0.62 * p, seg(lt, cr, d));
      } });
    cue(st, 'whoosh'); cue(st + cr - 0.2, 'boing', { gain: 0.35 }); cue(st + cr + 0.2, 'slide', { dur: 0.7, gain: 0.2 });
  }
  // ── 6 · A little chip checks the rows one by one, ─────────────
  {
    const st = cut(5), ch = Wd('chip', 5) - st, ck = Wd('checks', 5) - st, on = Wd('one', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.1, note: 'chip pops left on "chip", wired to the 3 rows; a yellow pulse lights row 1, 2, 3 in turn from "checks"; 1 BY 1 pill on "one"',
      draw(lt, d, t) {
        K.xray(t);
        const sc = lt > ck ? Math.floor((lt - ck) * 3.2) % 3 : -1;
        K.matrixGrid(650, 760, 0.85, { scan: sc >= 0 ? sc : null });
        const cs = E(seg(lt, ch - 0.25, ch + 0.05));
        if (cs > 0) for (let r = 0; r < 3; r++) { const y = 760 + 0.85 * (-136 + r * 126); line([[190, 760 + (r - 1) * 40], [235, y]], sc === r ? C.yellow : '#F29A3A', 8); }
        K.cpuChip(130, 760, 0.52 * cs, 0, 'CHIP');
        if (lt > on) K.pill('1 BY 1', 540, 1120, 66, C.yellow, C.ink, E(seg(lt, on, on + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ch, 'pop', { gain: 0.4 }); for (let k = 0; k < 4; k++) cue(st + ck + k * 0.31, 'tock', { gain: 0.18 }); cue(st + on, 'pop', { gain: 0.4 });
  }
  // ── 7 · hundreds of times every second, ───────────────────────
  {
    const st = cut(6), hu = Wd('hundreds', 6) - st, se = Wd('second', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 700], zoom: 0.14, note: 'grid scanning in a blur at the top; counter HUNDREDS on "hundreds", label PER SECOND on "second"',
      draw(lt, d, t) {
        K.xray(t);
        K.matrixGrid(540, 470, 0.8, { scan: Math.floor(lt * 30) % 3 });
        K.speedLines(540, 470, 0.5);
        if (lt > hu - 0.1) K.wideCounter(540, 960, 1.1 * E(seg(lt, hu - 0.1, hu + 0.15)), 'HUNDREDS', lt > se ? 'OF TIMES PER SECOND' : 'OF TIMES', C.yellow);
      } });
    cue(st, 'whoosh'); cue(st + hu, 'slam', { gain: 0.35 }); cue(st + se, 'pop', { gain: 0.4 });
  }
  // ── 8 · and the crossing that connects tells it exactly which key it was. ─
  {
    const st = cut(7), cr = Wd('crossing', 7) - st, cn = Wd('connects', 7) - st, ex = Wd('exactly', 7) - st, ke = Wd('key', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 700], zoom: 0.1, note: 'grid; scan stops on row 2; the K crossing flashes on "connects"; ROW 2 + COLUMN 8 pill on "exactly"; K keycap pops on "key"',
      draw(lt, d, t) {
        K.xray(t);
        const hit = lt > cn;
        K.matrixGrid(540, 560, 0.95, { scan: hit ? 1 : Math.floor(lt * 6) % 3, colHi: hit ? 7 : undefined, hit: lt > cr ? [7, 1] : null, hitP: hit ? 1 : 0.4 });
        const [hx, hy] = K.matrixXY(540, 560, 0.95, 7, 1);
        if (hit) K.burst(hx, hy, 1.4, 1 - seg(lt, cn, cn + 0.5));
        if (lt > ex) K.pill('ROW 2 + COLUMN 8', 540, 250, 60, C.ink, C.white, E(seg(lt, ex, ex + 0.25)));
        if (lt > ke) K.keycap(540, 1000, 0.85 * E(seg(lt, ke - 0.1, ke + 0.2)), 'K', 0, 1, true);
      } });
    cue(st, 'whoosh'); cue(st + cn, 'sparkle', { dur: 0.4, gain: 0.3 }); cue(st + ex, 'pop', { gain: 0.35 }); cue(st + ke, 'thud', { gain: 0.4 });
  }
  // ── 9 · But here's the twist: your keyboard doesn't know letters. ─
  {
    const st = cut(8), tw = Wd('twist', 8) - st, le = Wd('letters', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 700], zoom: 0.12, note: 'keyboard below; TWIST pill on "twist"; letter cards A B C float above; red X slams over them on "letters"',
      draw(lt, d, t) {
        disc();
        K.kbBoard(540, 1000, 0.9);
        ['A', 'B', 'C'].forEach((ch, i) => {
          const p = E(seg(lt, 0.15 + i * 0.12, 0.45 + i * 0.12)), y = 600 + Math.sin(lt * 3 + i) * 12;
          if (p > 0) K.keycap(300 + i * 240, y, 0.8 * p, ch, 0, 1, false);
        });
        if (lt > tw) K.pill('THE TWIST', 540, 250, 64, C.red, C.white, E(seg(lt, tw, tw + 0.25)));
        if (lt > le) K.redX(540, 600, lerp(1.9, 1.2, eo(seg(lt, le, le + 0.2))), 1);
      } });
    cue(st, 'whoosh'); cue(st + tw, 'boing', { gain: 0.35 }); cue(st + le + 0.05, 'slam', { gain: 0.4 });
  }
  // ── 10 · It just sends a number, like four for the A-key, ─────
  {
    const st = cut(9), se = Wd('sends', 9) - st, nu = Wd('number', 9) - st, fo = Wd('four', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 820], zoom: 0.12, note: 'keyboard; A key pressed on "sends"; a dark chip "4" rises from the A key on "number", pulses on "four"; SENDS: 4 pill',
      draw(lt, d, t) {
        disc();
        const [ax, ay] = K.kbKeyXY(540, 1000, 0.85, 1, 0);
        const down = clamp(1 - Math.abs(lt - se) / 0.15);
        K.kbBoard(540, 1000, 0.85, { press: { '1,0': down }, hi: lt > se ? { '1,0': 'y' } : {} });
        const u = eio(seg(lt, nu - 0.2, nu + 0.4));
        if (u > 0) { line([[ax, ay - 40], [lerp(ax, 420, u), lerp(ay - 40, 560, u)]], C.yellow, 10);
          const pulse = lt > fo ? 1 + 0.25 * Math.max(0, 1 - (lt - fo) * 4) : 1;
          K.codeChip(lerp(ax, 420, u), lerp(ay - 40, 560, u), 1.4 * pulse, '4'); }
        if (lt > nu) K.pill('SENDS A NUMBER', 620, 300, 58, C.ink, C.white, E(seg(lt, nu, nu + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + se, 'tock', { gain: 0.35 }); cue(st + nu - 0.1, 'zip', { gain: 0.3 }); cue(st + fo, 'pop', { gain: 0.45 });
  }
  // ── 11 · and your computer decides which letter that means. ────
  {
    const st = cut(10), co = Wd('computer', 10) - st, de = Wd('decides', 10) - st, le = Wd('letter', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 700], zoom: 0.1, note: 'monitor top pops on "computer"; lookup card 4→A 5→B 6→C on "decides"; "4" chip slides in from left; row 4→A lights + A typed on screen on "letter"',
      draw(lt, d, t) {
        disc();
        K.monitor(540, 400, 0.7, () => K.typedScreen(lt > le ? 'A' : '', lt), E(seg(lt, 0, 0.3)));
        K.lookupCard(620, 1000, 0.72, [['4', 'A'], ['5', 'B'], ['6', 'C']], lt > le ? 0 : -1, seg(lt, le, le + 0.2), E(seg(lt, de - 0.25, de + 0.05)));
        const u = eio(seg(lt, 0, de));
        K.codeChip(lerp(-120, 200, u), 920, 1.0, '4');
        if (lt > le) K.burst(540 - 160, 420, 1.2, 1 - seg(lt, le, le + 0.5));
      } });
    cue(st, 'whoosh'); cue(st + co, 'pop', { gain: 0.35 }); cue(st + 0.1, 'slide', { dur: 0.5, gain: 0.2 }); cue(st + de, 'pop', { gain: 0.35 }); cue(st + le, 'sparkle', { dur: 0.4, gain: 0.3 });
  }
  // ── 12 · So switch the layout to French, ──────────────────────
  {
    const st = cut(11), sw = Wd('switch', 11) - st, fr = Wd('french', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 740], zoom: 0.12, note: 'settings card LAYOUT pops on "switch"; selection moves from ENGLISH (US) to FRENCH on "French"; cursor clicks it',
      draw(lt, d, t) {
        disc();
        const sel = eio(seg(lt, fr - 0.15, fr + 0.15));
        K.layoutCard(540, 720, 1, sel, E(seg(lt, sw - 0.3, sw + 0.05)));
        const u = eio(seg(lt, sw + 0.1, fr - 0.1));
        K.cursor(lerp(900, 330, u), lerp(1150, 900, u), 1.1);
        if (lt > fr) K.ripple(300, 885, seg(lt, fr, fr + 0.5));
      } });
    cue(st, 'whoosh'); cue(st + sw, 'pop', { gain: 0.35 }); cue(st + fr, 'tock', { gain: 0.4 });
  }
  // ── 13 · and that same key suddenly types a Q. ────────────────
  {
    const st = cut(12), sa = Wd('same', 12) - st, su = Wd('suddenly', 12) - st, q = Wd('types', 12) - st + 0.1;
    add({ id: 'S13', at: st, cam: [540, 700], zoom: 0.14, note: 'monitor + same QWERTY keyboard; A key ringed on "same"; finger taps it on "suddenly"; a big red Q appears on screen on "Q" with shock lines',
      draw(lt, d, t) {
        disc();
        K.monitor(540, 400, 0.7, () => K.typedScreen(lt > q ? 'Q' : '', lt, lt > q ? C.red : C.ink));
        const [ax, ay] = K.kbKeyXY(540, 1000, 0.9, 1, 0);
        const down = clamp(1 - Math.abs(lt - q + 0.05) / 0.12);
        K.kbBoard(540, 1000, 0.9, { hi: lt > sa ? { '1,0': 'ring' } : {}, press: { '1,0': down } });
        K.tapFinger(ax, ay + 10, E(seg(lt, su - 0.2, su + 0.2)), down);
        if (lt > q) { K.shockLines(540 - 140, 410, 150, 1 - seg(lt, q + 0.3, q + 0.9)); K.pill('?!', 860, 220, 72, C.yellow, C.ink, E(seg(lt, q, q + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + sa, 'pop', { gain: 0.3 }); cue(st + q - 0.05, 'tock', { gain: 0.35 }); cue(st + q, 'boing', { gain: 0.45 });
  }
  // ── 14 · Your keyboard never typed a single letter. ───────────
  {
    const st = cut(13), ne = Wd('never', 13) - st, le = Wd('letter', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.12, note: 'big keyboard; every key flips from its letter to its number code on "never"; ONLY NUMBERS pill on "letter"',
      draw(lt, d, t) {
        disc();
        const f = seg(lt, ne - 0.1, ne + 0.25), sy = Math.abs(Math.cos(f * Math.PI));
        ctx.save(); ctx.translate(540, 760); ctx.scale(1, Math.max(0.03, sy)); ctx.translate(-540, -760);
        K.kbBoard(540, 760, 0.9, f < 0.5 ? {} : { rows: K.KB_CODES, size: 44 });
        ctx.restore();
        if (lt > le) K.pill('ONLY NUMBERS', 540, 1080, 66, C.yellow, C.ink, E(seg(lt, le, le + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ne - 0.05, 'zip', { gain: 0.3 }); cue(st + le, 'pop', { gain: 0.4 });
  }
  // ── 15 · It just told your computer where you pressed. ────────
  {
    const st = cut(14), wh = Wd('where', 14) - st, pr = Wd('pressed', 14) - st;
    add({ id: 'S15', at: st, cam: [540, 700], zoom: 0.12, note: 'room; hero behind a desk with a keyboard; WHERE YOU PRESSED pill on "where"; winks to camera on "pressed"',
      draw(lt, d, t) {
        K.room();
        const w = lt > pr;
        K.man({ x: 540, y: 1085, s: 0.85, arm: K.ARM.hip, armL: K.ARM.down, eyes: w ? 'wink' : 'n', mouth: w ? 'grin' : 'smile', smirk: w, brow: 0.5 });
        K.desk(540, 1010, 1.0);
        ctx.save(); ctx.translate(540, 982); ctx.scale(1, 0.32); K.kbBoard(0, -210 * 0.36, 0.36); ctx.restore();
        if (lt > wh) K.pill('WHERE YOU PRESSED', 540, 190, 58, C.yellow, C.ink, E(seg(lt, wh, wh + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + wh, 'pop', { gain: 0.35 }); cue(st + pr, 'sparkle', { dur: 0.5, gain: 0.35 });
  }
  return { shots: S, cues: CUES };
}
