// HOW DOES A TOUCHSCREEN KNOW WHERE YOU TOUCHED?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const disc = () => { fillAll(C.bg); circle(540, 740, 520, '#E4DCCB'); };
const office = () => { fillAll(C.bg); ctx.fillStyle = C.floor; ctx.fillRect(-300, 1400, W + 600, 900); };
// big phone at (540, 740, 1.2); screen-local (sx, sy) → world
const PX = 540, PY = 740, PS = 1.2;
const pw = (sx, sy) => [PX + sx * PS, PY + sy * PS];
const TAP = [0, -40];                      // the weather tile (screen-local)
// close-up grid
const G = { x: 540, y: 740, c: 6, r: 6, g: 140 };
const gxy = (i, j) => K.gridXY(G.x, G.y, G.c, G.r, G.g, i, j);
const HIT = [3, 2];
const grid = (o) => K.touchGrid(G.x, G.y, G.c, G.r, G.g, o);
const panel = () => { rr(G.x - 440, G.y - 440, 880, 880, 60); ctx.fillStyle = '#E9F3F8'; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke(); };
// charge at a crossing when a finger pulls charge from HIT (u 0..1)
const pulled = (u) => (i, j) => { const d = Math.hypot(i - HIT[0], j - HIT[1]); return d < 0.1 ? 1 - 0.85 * u : d < 1.5 ? 1 - 0.3 * u : 1; };
const appOpen = (u) => () => { K.homeScreen(); if (u > 0) { const k = eo(clamp(u)); ctx.save(); ctx.globalAlpha = clamp(u * 3); rr(lerp(-40, -166, k), lerp(-80, -350, k), lerp(80, 332, k), lerp(80, 700, k), lerp(20, 0, k)); ctx.fillStyle = C.sky; ctx.fill(); ctx.restore(); if (u > 0.6) { K.sun(0, -120, 0.9 * E(seg(u, 0.6, 1)), 0); ctx.fillStyle = C.ink; ctx.font = '900 90px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('31°', 0, 120); } } };

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · How does your phone know exactly where you touched it? ─────
  {
    const st = cut(0), ph = Wd('phone', 0) - st, ex = Wd('exactly', 0) - st, to = Wd('touched', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 700], zoom: 0.14, note: 'phone pops on "phone"; finger comes in and taps the weather tile on "touched", ripple + red target; HOW? pill on "exactly"',
      draw(lt, d, t) {
        office();
        const p = E(seg(lt, 0, 0.3));
        K.phone(PX, PY, PS * p, () => K.homeScreen());
        const [tx, ty] = pw(...TAP), press = lt > to ? 1 - seg(lt, to + 0.15, to + 0.4) : 0;
        K.tapFinger(tx, ty, eio(seg(lt, ex - 0.3, to)), press);
        K.ripple(tx, ty, seg(lt, to, to + 0.6));
        K.crosshair(tx, ty, E(seg(lt, to + 0.05, to + 0.3)));
        if (lt > ex) K.pill('HOW?', 540, 190, 80, C.yellow, C.ink, E(seg(lt, ex, ex + 0.25)));
      } });
    cue(st + 0.05, 'pop', { gain: 0.4 }); cue(st + ex - 0.2, 'slide', { dur: 0.4, gain: 0.2 }); cue(st + to, 'pop', { gain: 0.5 });
  }
  // ── 2a · Well, under the glass ─────────────────────────────────────
  {
    const st = cut(1), gl = Wd('glass', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 740], zoom: 0.1, note: 'exploded layers: glass lifts off on "glass", GLASS tag',
      draw(lt, d, t) {
        disc();
        const sep = eio(seg(lt, 0.05, gl + 0.1)), lift = E(seg(lt, gl - 0.05, gl + 0.3));
        K.layerStack(540, 820, 1.1, sep, lift, t);
        if (lt > gl) K.pill('GLASS', 540, 200, 70, C.ink, C.white, E(seg(lt, gl, gl + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + gl - 0.05, 'zip', { gain: 0.3 }); cue(st + gl + 0.05, 'pop', { gain: 0.35 });
  }
  // ── 2b · there's a see-through grid of tiny wires ──────────────────
  {
    const st = Wd('grid', 1) - 0.55, gr = Wd('grid', 1) - st, wi = Wd('wires', 1) - st;
    add({ id: 'S03', at: st, cam: [540, 740], zoom: 0.14, note: 'phone face-on, wire grid draws across the screen from "grid"; GRID pill; wires flash yellow on "wires"',
      draw(lt, d, t) {
        office();
        const sc = Math.floor((lt - wi) * 10);
        K.phone(PX, PY, PS, () => { K.homeScreen(); ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.fillRect(-166, -350, 332, 700);
          K.touchGrid(0, 0, 4, 8, 82, { grow: eio(seg(lt, gr - 0.2, wi)), charge: () => 0, scanRow: lt > wi ? sc % 8 : null }); });
        if (lt > gr) K.pill('GRID', 540, 190, 76, C.yellow, C.ink, E(seg(lt, gr, gr + 0.25)));
        if (lt > wi) K.pill('TINY WIRES', 540, 1190, 56, C.ink, C.white, E(seg(lt, wi, wi + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + gr - 0.2, 'slide', { dur: 0.8, gain: 0.25 }); cue(st + wi, 'sparkle', { dur: 0.4, gain: 0.25 });
  }
  // ── 3 · with a small electric charge sitting on every crossing ──────
  {
    const st = cut(2), el = Wd('electric', 2) - st, ch = Wd('charge', 2) - st, cr = Wd('crossing', 2) - st;
    add({ id: 'S04', at: st, cam: [540, 740], zoom: 0.12, note: 'close-up grid panel; bolt on "electric"; yellow charge dots pop crossing by crossing from "charge", all full on "crossing"',
      draw(lt, d, t) {
        disc(); panel();
        grid({ charge: (i, j) => E(seg(lt, ch - 0.1 + (i + j) * 0.06, ch + 0.15 + (i + j) * 0.06)) });
        if (lt > el - 0.1) K.bolt(540, 740, 2.2 * E(seg(lt, el - 0.1, el + 0.2)) * (1 - seg(lt, ch - 0.1, ch + 0.1)));
        if (lt > ch) K.pill('CHARGE', 540, 160, 70, C.yellow, C.ink, E(seg(lt, ch, ch + 0.25)));
        if (lt > cr) K.pill('ON EVERY CROSSING', 540, 1180, 50, C.ink, C.white, E(seg(lt, cr, cr + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + el - 0.1, 'pop', { gain: 0.3 }); cue(st + ch, 'sparkle', { dur: 0.9, gain: 0.3 }); cue(st + cr, 'pop', { gain: 0.3 });
  }
  // ── 4 · Your body conducts electricity ─────────────────────────────
  {
    const st = cut(3), bo = Wd('body', 3) - st, el = Wd('electricity', 3) - st;
    add({ id: 'S05', at: st, cam: [540, 700], zoom: 0.12, note: 'hero, sparks orbit him from "body"; bolts at his raised finger and CONDUCTOR pill on "electricity"',
      draw(lt, d, t) {
        K.room();
        K.man({ x: 540, y: 1100, s: 0.95, arm: K.ARM.point, finger: -0.2, eyes: lt > el ? 'wide' : 'n', mouth: lt > el ? 'grin' : 'smile', brow: 0.6 });
        K.sparks(540, 760, 360, t, E(seg(lt, bo - 0.1, bo + 0.2)));
        if (lt > el - 0.1) { const p = E(seg(lt, el - 0.1, el + 0.2)); K.bolt(770, 700, 0.6 * p, 0.3); K.bolt(870, 790, 0.45 * p, -0.4); }
        if (lt > el) K.pill('CONDUCTOR', 540, 190, 70, C.yellow, C.ink, E(seg(lt, el, el + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + bo, 'sparkle', { dur: 0.6, gain: 0.3 }); cue(st + el, 'pop', { gain: 0.4 });
  }
  // ── 5a · so when your finger gets close ────────────────────────────
  {
    const st = cut(4), fi = Wd('finger', 4) - st, cl = Wd('close', 4) - st;
    const [hx, hy] = gxy(...HIT);
    add({ id: 'S06', at: st, cam: [hx, hy], zoom: 0.16, note: 'charged grid; fingertip glides in from "finger" and hovers just over the crossing on "close"; CLOSE pill',
      draw(lt, d, t) {
        disc(); panel();
        grid({});
        K.tapFinger(hx, hy, lerp(0, 0.97, eio(seg(lt, fi - 0.2, cl + 0.05))));
        if (lt > cl) K.pill('CLOSE', 540, 160, 70, C.ink, C.white, E(seg(lt, cl, cl + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + fi - 0.15, 'slide', { dur: 0.5, gain: 0.25 });
  }
  // ── 5b · it pulls a little charge away from that spot ──────────────
  {
    const st = Wd('it', 4) - 0.1, pu = Wd('pulls', 4) - st, sp = Wd('spot', 4) - st;
    const [hx, hy] = gxy(...HIT);
    add({ id: 'S07', at: st, cam: [hx, hy], zoom: 0.2, note: 'finger touching; charge drains from that crossing into the fingertip from "pulls" (dots stream up); red target on "spot"',
      draw(lt, d, t) {
        disc(); panel();
        const u = eio(seg(lt, pu - 0.1, sp));
        grid({ charge: pulled(u), hit: HIT, hitP: E(seg(lt, sp, sp + 0.25)) });
        if (lt > pu - 0.1 && lt < sp + 0.4) for (let k = 0; k < 6; k++) { const f = ((lt - pu + 0.1) * 1.6 + k / 6) % 1; circle(hx + Math.sin(k * 2.1) * 40 * (1 - f), hy - f * 70, 12 * (1 - f * 0.5), C.yellow); }
        K.tapFinger(hx, hy, 1, 0);
        if (lt > pu) K.pill('PULLS CHARGE', 540, 160, 64, C.yellow, C.ink, E(seg(lt, pu, pu + 0.25)));
      } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(st + pu, 'sparkle', { dur: 0.8, gain: 0.3 }); cue(st + sp, 'pop', { gain: 0.45 });
  }
  // ── 6 · The phone scans every row and column many times a second ────
  {
    const st = cut(5), ro = Wd('row', 5) - st, co = Wd('column', 5) - st, ti = Wd('times', 5) - st;
    add({ id: 'S08', at: st, cam: [540, 740], zoom: 0.12, note: 'grid with the drained crossing; a yellow bar sweeps down the rows from "row", then across columns from "column"; from "times" both sweep fast; MANY x A SECOND pill',
      draw(lt, d, t) {
        disc(); panel();
        let sr = null, sc = null;
        if (lt > ti) { sr = ((lt - ti) * 30) % G.r; sc = ((lt - ti) * 30 + 2) % G.c; }
        else if (lt > co) sc = Math.min(G.c - 0.6, (lt - co) * 9);
        else if (lt > ro - 0.1) sr = Math.min(G.r - 0.6, (lt - ro + 0.1) * 9);
        grid({ charge: pulled(1), scanRow: sr == null ? null : Math.round(sr), scanCol: sc == null ? null : Math.round(sc) });
        if (lt > ti) K.pill('MANY × A SECOND', 540, 160, 62, C.yellow, C.ink, E(seg(lt, ti, ti + 0.25)));
        else K.pill('SCANNING', 540, 160, 62, C.ink, C.white, E(seg(lt, 0.1, 0.35)));
      } });
    cue(st, 'whoosh'); cue(st + ro, 'slide', { dur: 0.5, gain: 0.25 }); cue(st + co, 'slide', { dur: 0.5, gain: 0.25 });
    for (let i = 0; i < 6; i++) cue(st + ti + i * 0.15, 'tock', { gain: 0.2 });
  }
  // ── 7a · finds the crossing where the charge dropped ───────────────
  {
    const st = cut(6), cr = Wd('crossing', 6) - st, dr = Wd('dropped', 6) - st;
    add({ id: 'S09', at: st, cam: [...gxy(...HIT)], zoom: 0.18, note: 'row + column wires lock onto the drained crossing on "crossing"; red target + FOUND IT pill on "dropped"',
      draw(lt, d, t) {
        disc(); panel();
        const lock = lt > cr - 0.1;
        grid({ charge: pulled(1), scanRow: lock ? HIT[1] : Math.round((lt * 24) % G.r), scanCol: lock ? HIT[0] : Math.round((lt * 24 + 3) % G.c), hit: HIT, hitP: E(seg(lt, dr - 0.05, dr + 0.2)) });
        if (lt > dr) K.pill('FOUND IT', 540, 160, 70, C.yellow, C.ink, E(seg(lt, dr, dr + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + cr - 0.1, 'thud', { gain: 0.35 }); cue(st + dr, 'pop', { gain: 0.45 });
  }
  // ── 7b · and that's your tap ───────────────────────────────────────
  {
    const st = Wd('your', 6) - 0.35, ta = Wd('tap', 6) - st;
    const [tx, ty] = pw(...TAP);
    add({ id: 'S10', at: st, cam: [540, 700], zoom: 0.12, note: 'back to the phone: finger taps the weather tile on "tap", ripple, app opens to 31° sun',
      draw(lt, d, t) {
        office();
        K.phone(PX, PY, PS, appOpen(seg(lt, ta + 0.05, ta + 0.6)));
        K.tapFinger(tx, ty, eio(seg(lt, 0, ta)), lt > ta ? 1 - seg(lt, ta + 0.1, ta + 0.3) : 0);
        K.ripple(tx, ty, seg(lt, ta, ta + 0.6));
        if (lt > ta) K.pill('TAP!', 540, 190, 80, C.yellow, C.ink, E(seg(lt, ta, ta + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ta, 'pop', { gain: 0.5 }); cue(st + ta + 0.1, 'sparkle', { dur: 0.4, gain: 0.25 });
  }
  // ── 8 · Here's the twist: that's why normal gloves don't work ───────
  {
    const st = cut(7), tw = Wd('twist', 7) - st, gl = Wd('gloves', 7) - st, wo = Wd('work', 7) - st;
    const [tx, ty] = pw(...TAP);
    add({ id: 'S11', at: st, cam: [540, 720], zoom: 0.12, note: 'warning on "twist"; then phone + red knit gloved finger taps on "gloves" (nothing happens); red X on "work"',
      draw(lt, d, t) {
        disc();
        if (lt < gl - 0.25) { K.warning(540, 740, lt < tw - 0.1 ? E(seg(lt, 0, 0.25)) * 0.8 : lerp(0.8, 1.5, E(seg(lt, tw - 0.1, tw + 0.15)))); return; }
        K.phone(PX, PY, PS * E(seg(lt, gl - 0.25, gl)), () => K.homeScreen());
        const tapT = (lt - gl) % 0.7;
        K.glovedFinger(tx, ty, eio(seg(lt, gl - 0.2, gl + 0.15)), lt > gl + 0.15 ? Math.max(0, Math.sin(tapT * 9)) : 0);
        if (lt > gl) K.pill('GLOVES', 540, 190, 72, C.ink, C.white, E(seg(lt, gl, gl + 0.25)));
        if (lt > wo) K.redX(540, 700, lerp(1.8, 1.1, eo(seg(lt, wo, wo + 0.2))), 1);
      } });
    cue(st, 'whoosh'); cue(st + tw, 'slam', { gain: 0.45 }); cue(st + gl - 0.2, 'whoosh', { gain: 0.5 }); cue(st + wo, 'slam', { gain: 0.4 });
  }
  // ── 9 · because fabric doesn't conduct, so the screen can't feel you ─
  {
    const st = cut(8), fa = Wd('fabric', 8) - st, co = Wd('conduct', 8) - st, ca = Wd("can't", 8) - st;
    const [hx, hy] = gxy(...HIT);
    add({ id: 'S12', at: st, cam: [hx, hy], zoom: 0.14, note: 'close-up grid: gloved finger presses the crossing; charge stays full; FABRIC pill on "fabric"; sparks fizzle on "conduct"; red NO TOUCH pill on "can\'t"',
      draw(lt, d, t) {
        disc(); panel();
        grid({});
        K.glovedFinger(hx, hy, eio(seg(lt, 0, 0.5)), Math.max(0, Math.sin(lt * 8)) * 0.6);
        if (lt > fa) K.pill('FABRIC', 540, 160, 70, C.ink, C.white, E(seg(lt, fa, fa + 0.25)) * (1 - seg(lt, ca - 0.15, ca)));
        if (lt > co && lt < ca + 0.4) { const f = seg(lt, co, co + 0.6); K.sparks(hx, hy, 70 + 40 * f, t, 1 - f, 5); }
        if (lt > ca) { K.pill('NO TOUCH', 540, 160, 70, C.red, C.white, E(seg(lt, ca, ca + 0.25))); K.redX(hx - 220, hy - 160, 0.6 * E(seg(lt, ca, ca + 0.2)), 1); }
      } });
    cue(st, 'whoosh'); cue(st + fa, 'pop', { gain: 0.35 }); cue(st + co, 'sizzle', { dur: 0.5, gain: 0.2 }); cue(st + ca, 'slam', { gain: 0.35 });
  }
  // ── 10a · But a sausage does ───────────────────────────────────────
  {
    const st = cut(9), sa = Wd('sausage', 9) - st, dn = Wd('does', 9) - st;
    add({ id: 'S13', at: st, cam: [540, 720], zoom: 0.14, note: 'sausage spins in with a burst on "sausage"; sparks around it + CONDUCTS! pill on "does"',
      draw(lt, d, t) {
        disc();
        const p = E(seg(lt, 0, 0.3));
        if (lt > sa) K.burst(540, 720, 3.2, 1 - seg(lt, sa, sa + 0.5));
        const pump = lt > sa ? 1 + 0.15 * Math.sin(seg(lt, sa, sa + 0.3) * Math.PI) : 1;
        K.sausage(540, 720, 1.6 * p * pump, lerp(-1.2, -0.25, p) + Math.sin(lt * 4) * 0.04);
        if (lt > dn) { K.sparks(540, 720, 380, t, E(seg(lt, dn, dn + 0.2))); K.pill('CONDUCTS!', 540, 220, 76, C.yellow, C.ink, E(seg(lt, dn, dn + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.3 }); cue(st + sa, 'boing', { gain: 0.45 }); cue(st + dn, 'sparkle', { dur: 0.5, gain: 0.3 });
  }
  // ── 10b · and one freezing winter in Korea ─────────────────────────
  {
    const st = Wd('and', 9) - 0.1, fr = Wd('freezing', 9) - st, ko = Wd('korea', 9) - st;
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.12, note: 'winter night, snow falls; hero with phone; shivers + FREEZING pill + snowflakes on "freezing"; SOUTH KOREA · 2010 pill on "korea"',
      draw(lt, d, t) {
        K.winterBg();
        K.snowfall(t, 46, E(seg(lt, 0, 0.3)));
        const shiver = lt > fr ? Math.sin(lt * 40) * 6 : 0;
        K.man({ x: 540 + shiver, y: 1120, s: 0.9, arm: K.PHONE_ARM, holding: (x, y) => K.phone(x + 12, y - 70, 0.3, () => K.homeScreen()), eyes: 'n', mouth: lt > fr ? 'flat' : 'smile', frown: lt > fr, brow: 0.3, look: 0.5 });
        if (lt > fr) { for (let k = 0; k < 3; k++) K.snowflake(300 + k * 240, 430 - (k % 2) * 60, 0.6 * E(seg(lt, fr + k * 0.08, fr + k * 0.08 + 0.25)), lt + k); K.pill('FREEZING', 540, 200, 72, C.cyan, C.ink, E(seg(lt, fr, fr + 0.25)) * (1 - seg(lt, ko - 0.15, ko))); }
        if (lt > ko) K.pill('SOUTH KOREA · 2010', 540, 200, 60, C.yellow, C.ink, E(seg(lt, ko, ko + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + fr, 'sparkle', { dur: 0.4, gain: 0.2 }); cue(st + ko, 'pop', { gain: 0.4 });
  }
  // ── 11 · people used sausages as phone pens! ───────────────────────
  {
    const st = cut(10), sa = Wd('sausages', 10) - st, pe = Wd('pens', 10) - st;
    const [tx, ty] = pw(...TAP);
    add({ id: 'S15', at: st, cam: [540, 720], zoom: 0.14, note: 'snowy night; a hand holds a sausage like a pen and taps the phone on "sausages"; the app opens; SAUSAGE STYLUS pill on "pens"',
      draw(lt, d, t) {
        K.winterBg(); K.snowfall(t, 30, 0.8);
        const hitT = sa + 0.2;
        K.phone(PX, PY, PS, appOpen(seg(lt, hitT + 0.05, hitT + 0.6)));
        K.sausageTap(tx, ty, eio(seg(lt, sa - 0.25, hitT)), lt > hitT ? 1 - seg(lt, hitT + 0.1, hitT + 0.3) : 0);
        K.ripple(tx, ty, seg(lt, hitT, hitT + 0.6));
        if (lt > pe) K.pill('SAUSAGE STYLUS', 540, 190, 64, C.yellow, C.ink, E(seg(lt, pe, pe + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sa - 0.2, 'slide', { dur: 0.4, gain: 0.2 }); cue(st + sa + 0.2, 'pop', { gain: 0.5 }); cue(st + pe, 'boing', { gain: 0.4 });
  }
  // ── 12a · No buttons, no pressure ──────────────────────────────────
  {
    const st = cut(11), bu = Wd('buttons', 11) - st, pr = Wd('pressure', 11) - st;
    add({ id: 'S16', at: st, cam: [540, 740], zoom: 0.12, note: 'two cards: a keypad gets a red X on "buttons", a press-down arrow gets a red X on "pressure"',
      draw(lt, d, t) {
        disc();
        const p1 = E(seg(lt, bu - 0.25, bu)), p2 = E(seg(lt, pr - 0.25, pr));
        if (p1 > 0) { ctx.save(); ctx.translate(310, 720); ctx.scale(p1, p1); rr(-190, -240, 380, 480, 40); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
          for (let j = 0; j < 4; j++) for (let i = 0; i < 3; i++) { rr(-150 + i * 105, -200 + j * 105, 85, 85, 20); ctx.fillStyle = '#B9BFCA'; ctx.fill(); } ctx.restore();
          if (lt > bu + 0.1) K.redX(310, 720, lerp(1.6, 1, eo(seg(lt, bu + 0.1, bu + 0.3))), 1); }
        if (p2 > 0) { ctx.save(); ctx.translate(770, 720); ctx.scale(p2, p2); rr(-190, -240, 380, 480, 40); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
          K.arrow(0, -180, 220, Math.PI / 2, 1); rr(-130, 120, 260, 40, 12); ctx.fillStyle = C.ink; ctx.fill(); ctx.restore();
          if (lt > pr + 0.1) K.redX(770, 720, lerp(1.6, 1, eo(seg(lt, pr + 0.1, pr + 0.3))), 1); }
      } });
    cue(st, 'whoosh'); cue(st + bu + 0.1, 'slam', { gain: 0.3 }); cue(st + pr + 0.1, 'slam', { gain: 0.3 });
  }
  // ── 12b · just your electric fingertip ─────────────────────────────
  {
    const st = Wd('just', 11) - 0.1, el = Wd('electric', 11) - st, fi = Wd('fingertip', 11) - st;
    add({ id: 'S17', at: st, cam: [540, 650], zoom: 0.14, note: 'hero to camera, finger up; sparks + bolt at fingertip on "electric"; wink + YOUR FINGERTIP pill on "fingertip"',
      draw(lt, d, t) {
        K.room();
        K.man({ x: 540, y: 1150, s: 1.0, arm: K.ARM.point, finger: Math.sin(lt * 9) * 0.15, eyes: lt > fi ? 'wink' : 'n', mouth: 'grin', smirk: true, brow: 0.4 });
        const fx = 540 + 205, fy = 1150 - 300 - 90;
        if (lt > el - 0.1) { K.sparks(fx, fy, 90, t, E(seg(lt, el - 0.1, el + 0.2)), 5); K.bolt(fx + 120, fy - 70, 0.55 * E(seg(lt, el, el + 0.2)), 0.4); }
        if (lt > fi) K.pill('YOUR FINGERTIP', 540, 190, 64, C.yellow, C.ink, E(seg(lt, fi, fi + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + el, 'sparkle', { dur: 0.5, gain: 0.3 }); cue(st + fi, 'boing', { gain: 0.4 });
  }

  return { shots: S, cues: CUES };
}
