// (5/30) WHAT IS A LOAD BALANCER?: the shot list. Kitchen analogy, continuing from day 4 (more chefs): a manager at the
// kitchen door gets every order first and hands each one to a chef. Round robin = take turns (1, 2, 3, back to 1);
// smarter = least connections (chef with the fewest orders). Sick chef = failed health check, gets no orders, customers
// never notice. Apps: request → load balancer → a healthy server. One door outside, lots of servers inside. Tease: caching.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T, lineWords } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const GREEN = '#5BAE6A', BLUE = '#3A7BD5', ORANGE = '#F29A3A', PURPLE = '#8A63D2';
const PCOLS = [BLUE, C.pink, GREEN, ORANGE, PURPLE, C.red];
const bg = (ring = '#CFE8F3', base = C.sky) => { fillAll(base); circle(540, 740, 560, ring); };
const cook = (o) => { K.man(o); K.chefHat(o.x, o.y, o.s, o.hat ?? 1); };
// the manager = hero with a headset, holding a clipboard
const boss = (o, ticks = 0) => { K.man({ arm: K.PHONE_ARM, holding: (x, y) => K.clipboard(x + 10, y - 60, 0.55 * o.s / 0.6, 0.1, ticks), ...o }); K.headset(o.x, o.y, o.s); };
const X3 = [200, 540, 880];
// three chefs at three small stoves along the bottom
const chefs = (t, o = {}) => X3.forEach((x, k) => {
  const p = o.pop ? o.pop(k) : 1; if (p <= 0) return;
  K.stove(x, 1080, 0.42 * p, t + k, o.fire ? o.fire(k) : 1);
  const f = o.face ? o.face(k) : {};
  cook({ x, y: 1020 + (1 - p) * 400, s: 0.5, arm: K.ARM.hip, eyes: 'n', mouth: 'smile', brow: 0.4, look: 0, ...f });
});
const shake = (lt, a0, a1, amp = 10) => (lt > a0 && lt < a1 ? Math.sin(lt * 70) * amp : 0);

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · Yesterday we hired more chefs, ──
  {
    const st = cut(0), ye = Wd('yesterday', 0) - st, hi = Wd('hired', 0) - st, ch = Wd('chefs', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 760], zoom: 0.08, note: 'DAY 5 / 30 pill; YESTERDAY: SCALING pill on "yesterday"; three chefs pop in at stoves from "hired"; MORE CHEFS on "chefs"',
      draw(lt, d, t) {
        K.kitchen(1180);
        K.pill('DAY 5 / 30', 540, 170, 64, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        if (lt > ye) K.pill('YESTERDAY: SCALING', 540, 290, 50, C.ink, C.white, E(seg(lt, ye, ye + 0.25)));
        chefs(t, { pop: (k) => E(seg(lt, 0.15 + k * 0.2, 0.45 + k * 0.2)), face: () => ({ mouth: lt > ch ? 'grin' : 'smile' }) });
        if (lt > ch) K.pill('MORE CHEFS', 540, 470, 60, C.yellow, C.ink, E(seg(lt, ch, ch + 0.25)));
      } });
    cue(st + 0.05, 'pop', { gain: 0.35 }); for (let k = 0; k < 3; k++) cue(st + 0.15 + k * 0.2, 'pop', { gain: 0.3 }); cue(st + ch, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 2 · but who decides which chef cooks each order? ──
  {
    const st = cut(1), de = Wd('decides', 1) - st, ch = Wd('chef', 1) - st, or = Wd('order', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 700], zoom: 0.1, note: 'tickets rain into a pile top centre; chefs look up wide-eyed on "decides"; ? bubbles on "chef"; WHO? on "order"',
      draw(lt, d, t) {
        K.kitchen(1180);
        chefs(t, { face: (k) => ({ eyes: lt > de ? 'wide' : 'n', mouth: lt > de ? 'o' : 'smile', brow: lt > de ? 1 : 0.4, look: k === 0 ? 0.8 : k === 2 ? -0.8 : 0 }) });
        for (let k = 0; k < 10; k++) { const a = k * 0.07; if (lt < a) continue; K.ticket(540 + (rnd(k) - 0.5) * 260, lerp(-200, 400 - k * 12, eo(clamp((lt - a) / 0.35))), 0.45, (rnd(k + 5) - 0.5) * 0.8); }
        if (lt > ch) X3.forEach((x, k) => K.bubble(x + 70, 620, 0.75, '?', E(seg(lt, ch + k * 0.1, ch + k * 0.1 + 0.25)), -1));
        if (lt > or) bigText('WHO?', 540, 200, 150, C.yellow, -0.05, E(seg(lt, or, or + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 0.6, gain: 0.2 }); cue(st + de, 'boing', { gain: 0.3 }); cue(st + or, 'pop', { gain: 0.4 });
  }

  // ── 3 · Meet the load balancer. ──
  {
    const st = cut(2), lo = Wd('load', 2) - st, ba = Wd('balancer', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 700], zoom: 0.08, note: 'LB box drops in centre on "load" with a burst; three servers below; on "balancer" envelopes flow in from the top and fan out to all three; LOAD BALANCER pill',
      draw(lt, d, t) {
        bg();
        if (lt > lo - 0.1) K.lbBox(540, lerp(-200, 560, eo(seg(lt, lo - 0.1, lo + 0.2))), 1, t, lt > ba ? Math.floor((lt - ba) * 3.2) % 3 : -1);
        if (lt > lo + 0.15 && lt < lo + 0.6) K.burst(540, 560, 3, clamp(1 - (lt - lo - 0.15) * 2.4));
        for (let k = 0; k < 3; k++) K.server(220 + k * 320, 1000, 0.36 * E(seg(lt, 0.05 + k * 0.08, 0.3 + k * 0.08)), t + k);
        if (lt > ba) for (let k = 0; k < 9; k++) { const q = (lt - ba) * 1.6 - k / 3; if (q < 0) continue; const u = q % 1, tg = k % 3;
          const [x, y] = u < 0.4 ? [540, lerp(250, 450, u / 0.4)] : K.arcAt(540, 680, 220 + tg * 320, 850, 60, (u - 0.4) / 0.6); K.envelope(x, y, 0.24, 0); }
        if (lt > ba) K.pill('LOAD BALANCER', 540, 220, 72, C.yellow, C.ink, E(seg(lt, ba, ba + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + lo + 0.15, 'thud', { gain: 0.4 }); cue(st + ba, 'pop', { gain: 0.4 }); cue(st + ba, 'slide', { dur: 0.9, gain: 0.25 });
  }

  // ── 4 · Picture a manager at the kitchen door. ──
  {
    const st = cut(3), ma = Wd('manager', 3) - st, ki = Wd('kitchen', 3) - st, dr = Wd('door', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 760], zoom: 0.08, note: 'kitchen with a swing door on the right; manager (headset + clipboard) slides in on "manager" + MANAGER pill; door swings open on "door" and a ticket peeks in',
      draw(lt, d, t) {
        K.kitchen(1180);
        const op = lt > dr ? E(seg(lt, dr, dr + 0.3)) * 0.7 : 0;
        K.swingDoor(830, 1180, 1, op);
        if (lt > dr) K.ticket(lerp(1000, 820, eo(seg(lt, dr + 0.1, dr + 0.5))), 860, 0.45, -0.2);
        const m = E(seg(lt, ma - 0.1, ma + 0.25));
        if (m > 0) boss({ x: lerp(-200, 380, m), y: 1080, s: 0.75, eyes: 'n', mouth: 'smile', brow: 0.5, look: 0.6 });
        if (lt > ma) K.pill('MANAGER', 380, 230, 64, C.yellow, C.ink, E(seg(lt, ma, ma + 0.25)));
        if (lt > ki) K.pill('KITCHEN DOOR', 830, 560, 46, C.ink, C.white, E(seg(lt, ki, ki + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ma, 'slide', { dur: 0.35, gain: 0.3 }); cue(st + ma + 0.2, 'pop', { gain: 0.35 }); cue(st + dr, 'boing', { gain: 0.25 });
  }

  // ── 5 · Every order goes to him first, ──
  {
    const st = cut(4), or = Wd('order', 4) - st, hi = Wd('him', 4) - st, fi = Wd('first', 4) - st;
    add({ id: 'S05', at: st, cam: [480, 760], zoom: 0.1, note: 'manager centre-left; from "order" tickets fly in from the door (right) one by one into his clipboard; ticks fill; HIM FIRST pill on "first"',
      draw(lt, d, t) {
        K.kitchen(1180);
        K.swingDoor(900, 1180, 0.9, 0.55 + 0.1 * Math.sin(lt * 8));
        const n = lt > or ? Math.min(4, 1 + Math.floor((lt - or) / 0.3)) : 0;
        boss({ x: 380, y: 1080, s: 0.75, eyes: 'n', mouth: lt > fi ? 'grin' : 'smile', brow: 0.5, look: 0.8 }, n);
        for (let k = 0; k < 5; k++) { const a = or + k * 0.3 - 0.4; if (lt < a) continue; const u = clamp((lt - a) / 0.4); if (u >= 1) continue;
          const [x, y] = K.arcAt(900, 820, 520, 760, 160, eo(u)); K.ticket(x, y, 0.4, (1 - u) * 0.6); }
        if (lt > hi) K.arrow(760, 520, 260 * E(seg(lt, hi, hi + 0.3)), Math.PI, 1);
        if (lt > fi) K.pill('HIM FIRST', 380, 230, 64, C.yellow, C.ink, E(seg(lt, fi, fi + 0.25)));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 4; k++) cue(st + or + k * 0.3 - 0.4, 'zip', { gain: 0.2 }); cue(st + fi, 'pop', { gain: 0.4 });
  }

  // ── 6 · and he hands it to a chef. ──
  {
    const st = cut(5), ha = Wd('hands', 5) - st, ch = Wd('chef', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 780], zoom: 0.08, note: 'manager left, one chef at a stove right; on "hands" a ticket arcs from his clipboard to the chef; chef grins + green tick on "chef"',
      draw(lt, d, t) {
        K.kitchen(1180);
        K.stove(780, 1060, 0.6, t, 1);
        cook({ x: 780, y: 1040, s: 0.62, arm: K.ARM.hip, eyes: 'n', mouth: lt > ch ? 'grin' : 'smile', brow: 0.5, look: -0.8 });
        boss({ x: 270, y: 1080, s: 0.7, eyes: 'n', mouth: 'smile', brow: 0.5, look: 0.8 }, 1);
        if (lt > ha) { const u = eo(seg(lt, ha, ha + 0.5)); const [x, y] = K.arcAt(420, 700, 680, 560, 240, u); K.ticket(x, y, 0.45, (1 - u) * 1.2, lt > ch + 0.1); }
        if (lt > ch) K.check(920, 380, 0.45, E(seg(lt, ch, ch + 0.25)));
        if (lt > ha) K.pill('HANDS IT OUT', 400, 230, 58, C.ink, C.white, E(seg(lt, ha, ha + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ha, 'slide', { dur: 0.5, gain: 0.3 }); cue(st + ch, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 7 · The simplest way is taking turns, ──
  {
    const st = cut(6), si = Wd('simplest', 6) - st, ta = Wd('taking', 6) - st, tu = Wd('turns', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 760], zoom: 0.08, note: 'three chefs; manager small top centre; number badges 1 2 3 pop over the chefs from "taking"; TAKE TURNS pill on "turns"',
      draw(lt, d, t) {
        K.kitchen(1180);
        chefs(t);
        boss({ x: 540, y: 470, s: 0.38, eyes: 'n', mouth: 'smile', brow: 0.5, look: 0 });
        X3.forEach((x, k) => K.countBadge(x, 600, 50, k + 1, BLUE, E(seg(lt, ta + k * 0.12, ta + k * 0.12 + 0.25))));
        if (lt > si) K.pill('SIMPLEST', 540, 150, 56, C.ink, C.white, E(seg(lt, si, si + 0.25)));
        if (lt > tu) K.pill('TAKE TURNS', 540, 1200, 64, C.yellow, C.ink, E(seg(lt, tu, tu + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + si, 'pop', { gain: 0.3 }); for (let k = 0; k < 3; k++) cue(st + ta + k * 0.12, 'pop', { gain: 0.25 }); cue(st + tu, 'pop', { gain: 0.4 });
  }

  // ── 8 · one, two, three, then back to one. ──
  {
    const st = cut(7), w = lineWords(7);
    const hits = [w[0].s, w[1].s, w[2].s, w[w.length - 1].s].map((v) => v - st), tgt = [0, 1, 2, 0], bk = Wd('back', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 760], zoom: 0.08, note: 'manager top centre; on each of "one / two / three / one" a ticket arcs to chef 1, 2, 3, then chef 1 again; that badge turns yellow; red arrow back right-to-left on "back"',
      draw(lt, d, t) {
        K.kitchen(1180);
        chefs(t, { face: (k) => ({ mouth: hits.some((h, i) => tgt[i] === k && lt > h + 0.3 && lt < h + 0.8) ? 'grin' : 'smile' }) });
        boss({ x: 540, y: 470, s: 0.38, eyes: 'n', mouth: 'smile', brow: 0.5, look: 0 });
        let cur = -1; hits.forEach((h, i) => { if (lt > h) cur = tgt[i]; });
        X3.forEach((x, k) => K.countBadge(x, 600, 50, k + 1, k === cur ? C.yellow : BLUE));
        hits.forEach((h, i) => { if (lt < h - 0.15) return; const u = clamp((lt - h + 0.15) / 0.35); if (u >= 1) return; const [x, y] = K.arcAt(600, 400, X3[tgt[i]], 760, 100, eo(u)); K.ticket(x, y, 0.36, 0); });
        if (lt > bk) K.arrow(830, 205, 560 * E(seg(lt, bk, bk + 0.3)), Math.PI, 1);
      } });
    cue(st, 'whoosh'); hits.forEach((h) => cue(st + h, 'pop', { gain: 0.35 })); cue(st + bk, 'slide', { dur: 0.4, gain: 0.25 });
  }

  // ── 9 · That's called round robin. ──
  {
    const st = cut(8), ro = Wd('round', 8) - st, rb = Wd('robin', 8) - st;
    const P3 = [[540, 440], [800, 890], [280, 890]];
    add({ id: 'S09', at: st, cam: [540, 720], zoom: 0.08, note: 'three servers in a triangle on a dashed circle; an envelope travels the circle visiting each in turn (reached one gets a yellow light); ROUND ROBIN pill on "robin"',
      draw(lt, d, t) {
        bg();
        ctx.save(); ctx.globalAlpha = 0.35; ctx.setLineDash([24, 22]); ctx.lineWidth = 12; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.arc(540, 740, 300, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
        const a = -Math.PI / 2 + Math.max(0, lt - 0.1) * 3.4;
        const near = (k) => { const ang = Math.atan2(P3[k][1] - 740, P3[k][0] - 540); const diff = Math.abs((((a - ang) % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2) - Math.PI); return diff < 0.45; };
        P3.forEach(([x, y], k) => { K.server(x, y, 0.3 * E(seg(lt, k * 0.08, 0.25 + k * 0.08)), t + k); if (near(k)) K.countBadge(x + 80, y - 110, 30, k + 1, C.yellow); });
        K.envelope(540 + Math.cos(a) * 300, 740 + Math.sin(a) * 300, 0.26, 0);
        if (lt > rb) K.pill('ROUND ROBIN', 540, 200, 76, C.yellow, C.ink, E(seg(lt, rb, rb + 0.25)));
        void ro;
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 1.0, gain: 0.25 }); cue(st + rb, 'pop', { gain: 0.45 });
  }

  // ── 10 · Smarter ones pick the chef with the fewest orders. ──
  {
    const st = cut(9), sm = Wd('smarter', 9) - st, pi = Wd('pick', 9) - st, fe = Wd('fewest', 9) - st, or = Wd('orders', 9) - st;
    const N = [4, 1, 3];
    add({ id: 'S10', at: st, cam: [540, 760], zoom: 0.08, note: 'three chefs with ticket stacks + count badges 4 / 1 / 3; on "fewest" the middle badge turns green and a ticket flies to him; FEWEST ORDERS pill on "orders"',
      draw(lt, d, t) {
        K.kitchen(1180);
        chefs(t, { face: (k) => ({ eyes: k === 0 && lt > pi ? 'closed' : 'n', mouth: k === 1 && lt > fe ? 'grin' : k === 0 ? 'flat' : 'smile' }) });
        X3.forEach((x, k) => { for (let j = 0; j < N[k]; j++) K.ticket(x + 110, 860 - j * 42, 0.32 * E(seg(lt, 0.05 + j * 0.06, 0.3 + j * 0.06)), (rnd(j + k * 7) - 0.5) * 0.3);
          const n = N[k] + (k === 1 && lt > fe + 0.45 ? 1 : 0); K.countBadge(x - 70, 600, 46, n, k === 1 && lt > fe ? GREEN : C.red, E(seg(lt, 0.1, 0.35))); });
        if (lt > fe) { const u = eo(seg(lt, fe, fe + 0.45)); const [x, y] = K.arcAt(540, 300, 650, 810, 80, u); if (u < 1) K.ticket(x, y, 0.36, 0); }
        if (lt > sm) K.pill('SMARTER', 540, 200, 60, C.ink, C.white, E(seg(lt, sm, sm + 0.25)));
        if (lt > or) K.pill('FEWEST ORDERS', 540, 1200, 60, C.yellow, C.ink, E(seg(lt, or, or + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'pop', { gain: 0.25 }); cue(st + sm, 'pop', { gain: 0.3 }); cue(st + fe, 'zip', { gain: 0.35 }); cue(st + fe + 0.45, 'thud', { gain: 0.3 }); cue(st + or, 'pop', { gain: 0.4 });
  }

  // ── 11 · And if a chef gets sick, ──
  {
    const st = cut(10), ch = Wd('chef', 10) - st, si = Wd('sick', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.12, note: 'three chefs; red arrow points at the middle chef on "chef"; on "sick" thermometer in mouth, eyes closed, dizzy swirl, droops; stove fire dies; SICK! red pill',
      draw(lt, d, t) {
        K.kitchen(1180);
        const sk = E(seg(lt, si, si + 0.3)), droop = eo(seg(lt, si, si + 0.6)) * 30;
        X3.forEach((x, k) => { const sick = k === 1 && lt > si; K.stove(x, 1080, 0.42, t + k, k === 1 ? 1 - sk : 1);
          cook({ x, y: 1020 + (k === 1 ? droop : 0), s: 0.5, arm: sick ? K.ARM.down : K.ARM.hip, eyes: sick ? 'closed' : 'n', mouth: sick ? 'flat' : 'smile', frown: sick, brow: sick ? 0 : 0.4, look: k === 1 ? 0 : k === 0 ? 0.6 : -0.6 }); });
        if (lt > si) { const hy = 1020 + droop - 272 * 0.5; K.thermometer(548, hy + 4, 0.32 * sk, -0.35, clamp((lt - si) / 0.5)); K.dizzy(540, 1020 + droop - 640 * 0.5, 60, t, sk); }
        if (lt > ch && lt < si) K.arrow(540, 380, 140 * E(seg(lt, ch, ch + 0.25)), Math.PI / 2, 1);
        if (lt > si) K.pill('SICK!', 540, 300, 72, C.red, C.white, sk);
      } });
    cue(st, 'whoosh'); cue(st + ch, 'pop', { gain: 0.3 }); cue(st + si, 'boing', { gain: 0.3 }); cue(st + si + 0.2, 'alarm', { dur: 0.5, gain: 0.25 });
  }

  // ── 12 · he stops sending that chef any, ──
  {
    const st = cut(11), sto = Wd('stops', 11) - st, ch = Wd('chef', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 760], zoom: 0.08, note: 'manager top centre; tickets keep flowing to the left and right chefs only; on "stops" a red X slams over the path to the sick middle chef; NO ORDERS red pill on "chef"',
      draw(lt, d, t) {
        K.kitchen(1180);
        X3.forEach((x, k) => { const sick = k === 1; K.stove(x, 1080, 0.42, t + k, sick ? 0 : 1);
          cook({ x, y: 1020 + (sick ? 30 : 0), s: 0.5, arm: sick ? K.ARM.down : K.ARM.hip, eyes: sick ? 'closed' : 'n', mouth: sick ? 'flat' : 'grin', frown: sick, brow: sick ? 0 : 0.4, look: 0 }); });
        K.thermometer(548, 1050 - 136 + 4, 0.32, -0.35, 1); K.dizzy(540, 1050 - 320, 60, t, 1);
        boss({ x: 540, y: 360, s: 0.3, eyes: 'n', mouth: 'smirk', smirk: true, brow: 0.5, look: 0 });
        for (let k = 0; k < 8; k++) { const q = lt * 1.3 - k * 0.25; if (q < 0) continue; const u = q % 1, tg = k % 2 ? 2 : 0; const [x, y] = K.arcAt(590, 330, X3[tg], 760, 100, eo(u)); K.ticket(x, y, 0.32, 0); }
        if (lt > sto) K.redX(540, 630, lerp(1.0, 0.4, eo(seg(lt, sto, sto + 0.2))), 1);
        if (lt > ch) K.pill('NO ORDERS', 540, 140, 60, C.red, C.white, E(seg(lt, ch, ch + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 1.0, gain: 0.2 }); cue(st + sto, 'slam', { gain: 0.4 }); cue(st + ch, 'pop', { gain: 0.35 });
  }

  // ── 13 · so customers never notice. ──
  {
    const st = cut(12), cu = Wd('customers', 12) - st, no = Wd('notice', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 760], zoom: 0.1, note: 'dining room: hero sits behind a table; on "customers" a steaming dish lands on the table; on "notice" he grins + green tick; CUSTOMER pill',
      draw(lt, d, t) {
        bg('#F7E3C8', C.bg);
        K.man({ x: 540, y: 960, s: 0.7, arm: K.ARM.hip, eyes: 'n', mouth: lt > no ? 'grin' : 'smile', brow: lt > no ? 0.8 : 0.4, look: 0 });
        K.table(540, 1110, 1.7);
        if (lt > cu) K.dish(540, lerp(300, 1050, eo(seg(lt, cu, cu + 0.35))), 0.9, ORANGE, lt > cu + 0.35 ? 1 : 0, t);
        if (lt > no) K.check(870, 470, 0.5, E(seg(lt, no, no + 0.25)));
        if (lt > cu) K.pill('CUSTOMER', 540, 200, 62, C.ink, C.white, E(seg(lt, cu, cu + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + cu + 0.35, 'thud', { gain: 0.3 }); cue(st + no, 'sparkle', { dur: 0.5, gain: 0.3 });
  }

  // ── 14 · Apps work the same way: ──
  {
    const st = cut(13), ap = Wd('apps', 13) - st, wa = Wd('way', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.08, note: 'left: a chef; right: a server; app tiles pop above on "apps"; big yellow = between them on "way" with CHEF / SERVER pills',
      draw(lt, d, t) {
        bg();
        cook({ x: 270, y: 900, s: 0.5, arm: K.ARM.hip, eyes: 'n', mouth: 'smile', brow: 0.4, look: 0.6 });
        K.server(810, 840, 0.48 * E(seg(lt, 0, 0.25)), t);
        if (lt > ap) [[380, 250], [540, 220], [700, 250]].forEach(([x, y], k) => K.appTile(x, y, 1.1 * E(seg(lt, ap + k * 0.08, ap + k * 0.08 + 0.25)), PCOLS[k]));
        if (lt > wa) bigText('=', 540, 820, 220, C.yellow, 0, E(seg(lt, wa, wa + 0.25)));
        if (lt > wa) { K.pill('CHEF', 270, 1200, 50, C.ink, C.white, E(seg(lt, wa, wa + 0.25))); K.pill('SERVER', 810, 1200, 50, C.ink, C.white, E(seg(lt, wa + 0.05, wa + 0.3))); }
      } });
    cue(st, 'whoosh'); cue(st + ap, 'pop', { gain: 0.35 }); cue(st + wa, 'slam', { gain: 0.3 });
  }

  // ── 15 · your request hits the load balancer, ──
  {
    const st = cut(14), re = Wd('request', 14) - st, hi = Wd('hits', 14) - st, ba = Wd('balancer', 14) - st;
    add({ id: 'S15', at: st, cam: [540, 760], zoom: 0.08, note: 'hero with phone left; from "request" an envelope arcs from his phone to the LB box (right); on "hits" the box shakes + burst; LOAD BALANCER pill on "balancer"',
      draw(lt, d, t) {
        bg();
        K.man({ x: 250, y: 800, s: 0.5, arm: K.PHONE_ARM, holding: (x, y) => K.phone(x + 12, y - 70, 0.22, () => K.homeScreen()), eyes: 'n', mouth: 'smile', brow: 0.4, look: 0.6 });
        const sh = shake(lt, hi + 0.15, hi + 0.4, 8);
        K.lbBox(720 + sh, 960, 0.75, t, -1);
        if (lt > re) { const u = eo(seg(lt, re, hi + 0.15)); if (u < 1) { const [x, y] = K.arcAt(320, 560, 680, 900, 260, u); K.envelope(x, y, 0.3, 0); } }
        if (lt > hi + 0.15 && lt < hi + 0.6) K.burst(720, 960, 2.4, clamp(1 - (lt - hi - 0.15) * 2.4));
        if (lt > re) K.pill('REQUEST', 320, 230, 54, C.ink, C.white, E(seg(lt, re, re + 0.25)));
        if (lt > ba) K.pill('LOAD BALANCER', 680, 1180, 58, C.yellow, C.ink, E(seg(lt, ba, ba + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + re, 'slide', { dur: 0.4, gain: 0.3 }); cue(st + hi + 0.15, 'thud', { gain: 0.4 }); cue(st + ba, 'pop', { gain: 0.4 });
  }

  // ── 16 · and it picks a healthy server for you. ──
  {
    const st = cut(15), pi = Wd('picks', 15) - st, he = Wd('healthy', 15) - st, sv = Wd('server', 15) - st;
    const SX = [220, 540, 860];
    add({ id: 'S16', at: st, cam: [540, 760], zoom: 0.08, note: 'LB box top; three servers below, middle one dimmed with a red X (down); on "picks" the right output lights and an envelope travels to the right server; green ticks on the healthy ones on "healthy"; HEALTHY SERVER pill',
      draw(lt, d, t) {
        bg();
        K.lbBox(540, 420, 0.8, t, lt > pi ? 2 : -1);
        SX.forEach((x, k) => { if (k === 2 && lt > pi + 0.55) return; K.server(x, 900, 0.36, k === 1 ? 0 : t + k);
          if (k === 1) { ctx.save(); ctx.globalAlpha = 0.45; rr(x - 64, 900 - 96, 128, 196, 12); ctx.fillStyle = C.ink; ctx.fill(); ctx.restore(); K.redX(x, 900, 0.45, 1); } });
        if (lt > he) [0, 2].forEach((k, j) => K.check(SX[k], 680, 0.3, E(seg(lt, he + j * 0.1, he + j * 0.1 + 0.25))));
        if (lt > pi) { const u = eo(seg(lt, pi, pi + 0.55)); const [x, y] = K.arcAt(600, 480, 860, 820, 80, u); if (u < 1) K.envelope(x, y, 0.26, 0); else K.server(860, 900, 0.36 * (1 + 0.06 * Math.sin((lt - pi) * 20) * clamp(1 - (lt - pi - 0.55) * 3)), t + 2); }
        if (lt > sv) K.pill('HEALTHY SERVER', 540, 1200, 58, C.yellow, C.ink, E(seg(lt, sv, sv + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + pi, 'slide', { dur: 0.5, gain: 0.3 }); cue(st + he, 'sparkle', { dur: 0.4, gain: 0.3 }); cue(st + sv, 'pop', { gain: 0.4 });
  }

  // ── 17 · One door outside, lots of servers inside. ──
  {
    const st = cut(16), dr = Wd('door', 16) - st, ou = Wd('outside', 16) - st, sv = Wd('servers', 16) - st, ins = Wd('inside', 16) - st;
    add({ id: 'S17', at: st, cam: [540, 740], zoom: 0.12, note: 'top: phones (outside) send envelopes down to one LB box set in a wall; below the wall a grid of small servers fills in from "servers"; OUTSIDE / INSIDE pills',
      draw(lt, d, t) {
        fillAll(C.sky);
        ctx.fillStyle = '#E4DCCB'; ctx.fillRect(-300, 580, W + 600, 1400);
        ctx.fillStyle = C.pot; ctx.fillRect(-300, 545, W + 600, 70);
        for (let k = 0; k < 5; k++) K.phone(140 + k * 200, 300, 0.2, () => K.homeScreen());
        for (let k = 0; k < 10; k++) { const q = lt * 1.2 - k * 0.2; if (q < 0) continue; const u = q % 1; if (u > 0.92) continue; const [x, y] = K.arcAt(140 + (k % 5) * 200, 400, 540, 540, 40, u); K.envelope(x, y, 0.18, 0); }
        K.lbBox(540, 580, 0.7 * E(seg(lt, dr - 0.1, dr + 0.2)), t, Math.floor(lt * 4) % 3);
        for (let k = 0; k < 12; k++) { const r = Math.floor(k / 4), c = k % 4, a = sv - 0.1 + k * 0.04; K.server(195 + c * 230, 800 + r * 160, 0.2 * E(seg(lt, a, a + 0.2)), t + k); }
        if (lt > ou) K.pill('OUTSIDE', 540, 130, 54, C.ink, C.white, E(seg(lt, ou, ou + 0.25)));
        if (lt > ins) K.pill('INSIDE', 540, 1215, 54, C.yellow, C.ink, E(seg(lt, ins, ins + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + dr, 'thud', { gain: 0.35 }); cue(st + ou, 'pop', { gain: 0.3 }); cue(st + sv, 'sparkle', { dur: 0.6, gain: 0.25 }); cue(st + ins, 'pop', { gain: 0.4 });
  }

  // ── 18 · Tomorrow: caching. ──
  {
    const st = cut(17), ca = Wd('caching', 17) - st;
    add({ id: 'S18', at: st, cam: [540, 700], zoom: 0.03, note: 'hero winks + points with DAY 5 / 30 pill; on "caching" a ready shelf of hot dishes drops in above him (ready before you order = cache); NEXT: CACHING pill',
      draw(lt, d, t) {
        bg();
        K.man({ x: 540, y: 1120, s: 0.8, arm: K.ARM.point, finger: Math.sin(lt * 9) * 0.25, eyes: lt < ca ? 'wink' : 'wide', mouth: 'smirk', smirk: true, brow: 0.6 });
        K.pill('DAY 5 / 30', 540, 170, 64, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        if (lt > ca - 0.1) K.readyShelf(540, lerp(-200, 560, eo(seg(lt, ca - 0.1, ca + 0.25))), 0.75, 3, t);
        if (lt > ca) K.pill('NEXT: CACHING', 540, 1200, 60, C.ink, C.white, E(seg(lt, ca, ca + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + ca + 0.2, 'thud', { gain: 0.35 }); cue(st + ca, 'sparkle', { dur: 0.6, gain: 0.3 });
  }

  return { shots: S, cues: CUES };
}
