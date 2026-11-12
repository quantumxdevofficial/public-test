// (6/30) WHAT IS CACHING?: the shot list. Kitchen analogy, continuing from day 5 (load balancer sends orders to chefs):
// everyone orders the same pizza; cooking from scratch each time is slow, so the kitchen keeps a few ready on a warm
// shelf by the door = the cache. Waiter checks the shelf first: there = HIT (instant), not there = MISS (chef cooks it
// and puts a copy on the shelf). Apps: popular data in fast memory, skip the slow trip to the database. Old pizza goes
// bad → cached data gets an expiry timer (TTL). Tease: CDN.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T, lineWords } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const GREEN = '#5BAE6A', BLUE = '#3A7BD5', ORANGE = '#F29A3A', PURPLE = '#8A63D2';
const PCOLS = [BLUE, C.pink, GREEN, ORANGE, PURPLE, C.red];
const bg = (ring = '#CFE8F3', base = C.sky) => { fillAll(base); circle(540, 740, 560, ring); };
const cook = (o) => { K.man(o); K.chefHat(o.x, o.y, o.s, o.hat ?? 1); };
const waiter = (o) => { K.man(o); K.bowtie(o.x, o.y, o.s); };
const X3 = [200, 540, 880];
const chefs = (t, o = {}) => X3.forEach((x, k) => {
  const p = o.pop ? o.pop(k) : 1; if (p <= 0) return;
  K.stove(x, 1080, 0.42 * p, t + k, 1);
  const f = o.face ? o.face(k) : {};
  cook({ x, y: 1020 + (1 - p) * 400, s: 0.5, arm: K.ARM.hip, eyes: 'n', mouth: 'smile', brow: 0.4, look: 0, ...f });
});

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const at = (w, i) => Wd(w, i);

  // ── 1 · Yesterday we sent each order to the right chef, ──
  {
    const st = cut(0), ye = at('yesterday', 0) - st, or = at('order', 0) - st, ch = at('chef', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 760], zoom: 0.08, note: 'DAY 6 / 30 pill; YESTERDAY: LOAD BALANCER pill; three chefs; on "order" a ticket arcs from the top to the right chef; chef grins + tick on "chef"',
      draw(lt, d, t) {
        K.kitchen(1180);
        K.pill('DAY 6 / 30', 540, 170, 64, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        if (lt > ye) K.pill('YESTERDAY: LOAD BALANCER', 540, 290, 44, C.ink, C.white, E(seg(lt, ye, ye + 0.25)));
        chefs(t, { face: (k) => ({ mouth: k === 2 && lt > ch ? 'grin' : 'smile', look: k === 2 ? -0.5 : 0 }) });
        if (lt > or) { const u = eo(seg(lt, or, ch)); if (u < 1) { const [x, y] = K.arcAt(540, 380, 880, 760, 120, u); K.ticket(x, y, 0.4, (1 - u) * 0.8); } }
        if (lt > ch) K.check(880, 560, 0.35, E(seg(lt, ch, ch + 0.25)));
      } });
    cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + ye, 'pop', { gain: 0.3 }); cue(st + or, 'slide', { dur: 0.5, gain: 0.25 }); cue(st + ch, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 2 · but what if everyone orders the same pizza? ──
  {
    const st = cut(1), ev = at('everyone', 1) - st, pz = at('pizza', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 700], zoom: 0.1, note: 'from "everyone" a crowd of tickets rains into a pile; on "pizza" a big pizza slams in centre with 6 small copies orbiting; chefs wide-eyed; SAME PIZZA? pill',
      draw(lt, d, t) {
        K.kitchen(1180);
        chefs(t, { face: (k) => ({ eyes: lt > pz ? 'wide' : 'n', mouth: lt > pz ? 'o' : 'smile', brow: lt > pz ? 1 : 0.4, look: k === 0 ? 0.6 : k === 2 ? -0.6 : 0 }) });
        for (let k = 0; k < 10; k++) { const a = ev + k * 0.06; if (lt < a) continue; K.ticket(540 + (rnd(k) - 0.5) * 700, lerp(-200, 330 + rnd(k + 3) * 120, eo(clamp((lt - a) / 0.35))), 0.36, (rnd(k + 5) - 0.5) * 0.8); }
        if (lt > pz - 0.1) { const p = E(seg(lt, pz - 0.1, pz + 0.2)); K.pizza(540, 520, 1.25 * p, lt * 0.6);
          for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3 + lt * 0.8; K.pizza(540 + Math.cos(a) * 330, 520 + Math.sin(a) * 210, 0.35 * E(seg(lt, pz + 0.1 + k * 0.06, pz + 0.35 + k * 0.06)), a); } }
        if (lt > pz) K.pill('SAME PIZZA?', 540, 150, 64, C.yellow, C.ink, E(seg(lt, pz, pz + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ev, 'slide', { dur: 0.6, gain: 0.2 }); cue(st + pz, 'thud', { gain: 0.4 }); cue(st + pz + 0.1, 'pop', { gain: 0.35 });
  }

  // ── 3 · Cooking it from scratch every time is slow. ──
  {
    const st = cut(2), sc = at('scratch', 2) - st, sl = at('slow', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 760], zoom: 0.1, note: 'one chef at a big stove left, sweating; stopwatch right ticking from the start; queue of tickets grows top; SLOW red pill on "slow"',
      draw(lt, d, t) {
        K.kitchen(1180);
        K.stove(330, 1070, 0.65, t, 1);
        cook({ x: 330, y: 1030, s: 0.62, arm: K.ARM.hip, eyes: lt > sl ? 'closed' : 'n', mouth: lt > sl ? 'flat' : 'o', frown: lt > sl, brow: 0.2, look: 0.4 });
        if (lt > sc) K.sweat(400, 640, t, E(seg(lt, sc, sc + 0.3)));
        K.stopwatch(800, 680, 0.42 * E(seg(lt, 0.05, 0.3)), Math.max(0, lt - 0.2) * 5);
        for (let k = 0; k < 6; k++) { const a = 0.2 + k * 0.25; K.ticket(160 + k * 150, 300, 0.32 * E(seg(lt, a, a + 0.2)), (rnd(k) - 0.5) * 0.4); }
        if (lt > sl) K.pill('SLOW', 800, 1000, 70, C.red, C.white, E(seg(lt, sl, sl + 0.25)));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 6; k++) cue(st + 0.25 + k * 0.33, 'tock', { gain: 0.2 }); cue(st + sl, 'boing', { gain: 0.3 });
  }

  // ── 4 · So the kitchen keeps a few ready, ──
  {
    const st = cut(3), ki = at('kitchen', 3) - st, re = at('ready', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 740], zoom: 0.08, note: 'chef right grins; the warm shelf drops in on "kitchen"; three pizzas pop onto it on "ready"; READY pill',
      draw(lt, d, t) {
        K.kitchen(1180);
        cook({ x: 830, y: 1030, s: 0.55, arm: K.ARM.point, eyes: 'n', mouth: lt > re ? 'grin' : 'smile', brow: 0.6, look: -0.8 });
        K.warmShelf(430, lerp(-300, 680, eo(seg(lt, ki - 0.1, ki + 0.25))), 0.8, [0, 1, 2].map((k) => E(seg(lt, re + k * 0.12, re + k * 0.12 + 0.25))), t);
        if (lt > re) K.pill('READY', 430, 230, 70, C.yellow, C.ink, E(seg(lt, re, re + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ki + 0.2, 'thud', { gain: 0.35 }); for (let k = 0; k < 3; k++) cue(st + re + k * 0.12, 'pop', { gain: 0.3 });
  }

  // ── 5 · on a warm shelf right by the door. ──
  {
    const st = cut(4), sh = at('shelf', 4) - st, dr = at('door', 4) - st;
    add({ id: 'S05', at: st, cam: [600, 760], zoom: 0.1, note: 'shelf with 3 pizzas left-centre, swing door right; on "shelf" the shelf glows; on "door" the door swings and a red arrow points from door to shelf; BY THE DOOR pill',
      draw(lt, d, t) {
        K.kitchen(1180);
        K.swingDoor(900, 1180, 0.95, lt > dr ? 0.6 * E(seg(lt, dr, dr + 0.3)) : 0);
        K.warmShelf(390, 760, 0.8, [1, 1, 1], t, [0, 0, 0], lt > sh ? 0.5 + 0.5 * Math.sin(lt * 8) : 0);
        if (lt > dr) K.arrow(720, 520, 220 * E(seg(lt, dr, dr + 0.3)), Math.PI, 1);
        if (lt > sh) K.pill('WARM SHELF', 390, 300, 60, C.ink, C.white, E(seg(lt, sh, sh + 0.25)));
        if (lt > dr) K.pill('BY THE DOOR', 760, 1200, 60, C.yellow, C.ink, E(seg(lt, dr, dr + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sh, 'sparkle', { dur: 0.4, gain: 0.25 }); cue(st + dr, 'boing', { gain: 0.25 }); cue(st + dr + 0.05, 'pop', { gain: 0.35 });
  }

  // ── 6 · That shelf is a cache. ──
  {
    const st = cut(5), ca = at('cache', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 720], zoom: 0.1, note: 'big shelf centre on blue bg; on "cache" a burst and a huge yellow CACHE pill slams above',
      draw(lt, d, t) {
        bg();
        K.warmShelf(540, 820, 1.05 * E(seg(lt, 0, 0.25)), [1, 1, 1], t, [0, 0, 0], lt > ca ? 1 : 0);
        if (lt > ca && lt < ca + 0.5) K.burst(540, 400, 3.2, clamp(1 - (lt - ca) * 2));
        if (lt > ca) K.pill('CACHE', 540, 400, 120, C.yellow, C.ink, lerp(1.6, 1, eo(seg(lt, ca, ca + 0.2))));
      } });
    cue(st, 'whoosh'); cue(st + ca, 'slam', { gain: 0.4 });
  }

  // ── 7a · When an order comes in, ──
  {
    const st = cut(6), or = at('order', 6) - st;
    add({ id: 'S07', at: st, cam: [480, 760], zoom: 0.08, note: 'waiter (bow tie) centre-left; on "order" a ticket flies in from the door on the right into his hand; NEW ORDER pill',
      draw(lt, d, t) {
        K.kitchen(1180);
        K.swingDoor(900, 1180, 0.95, 0.5 + 0.1 * Math.sin(lt * 8));
        const got = lt > or + 0.45;
        waiter({ x: 400, y: 1060, s: 0.72, arm: K.PHONE_ARM, holding: got ? (x, y) => K.ticket(x + 10, y - 50, 0.42, 0.1) : undefined, eyes: 'n', mouth: got ? 'grin' : 'smile', brow: 0.5, look: 0.7 });
        if (lt > or && !got) { const u = eo(seg(lt, or, or + 0.45)); const [x, y] = K.arcAt(920, 820, 520, 760, 160, u); K.ticket(x, y, 0.42, (1 - u) * 0.8); }
        if (lt > or) K.pill('NEW ORDER', 400, 230, 60, C.ink, C.white, E(seg(lt, or, or + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + or, 'zip', { gain: 0.3 }); cue(st + or + 0.45, 'pop', { gain: 0.3 });
  }

  // ── 7b · the waiter checks the shelf first. ──
  {
    const st = at('waiter', 6) - 0.08, wa = at('waiter', 6) - st, sh = at('shelf', 6) - st, fi = at('first', 6) - st;
    add({ id: 'S08', at: st, cam: [540, 760], zoom: 0.1, note: 'waiter left looks right at the shelf (right); WAITER pill; on "shelf" a magnifier sweeps across the shelf; on "first" CHECK SHELF 1ST pill',
      draw(lt, d, t) {
        K.kitchen(1180);
        waiter({ x: 230, y: 1060, s: 0.66, arm: K.ARM.hip, eyes: 'n', mouth: 'o', brow: 0.8, look: 0.9 });
        K.warmShelf(700, 780, 0.7, [1, 1, 1], t);
        if (lt > sh) { const u = eio(seg(lt, sh, sh + 0.7)); K.magnifier(lerp(560, 860, u), 690, 0.5, -0.6); }
        if (lt > wa) K.pill('WAITER', 230, 300, 56, C.ink, C.white, E(seg(lt, wa, wa + 0.25)));
        if (lt > fi) K.pill('CHECK SHELF 1ST', 660, 1200, 56, C.yellow, C.ink, E(seg(lt, fi, fi + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sh, 'slide', { dur: 0.6, gain: 0.25 }); cue(st + fi, 'pop', { gain: 0.4 });
  }

  // ── 8 · If it's there, that's a hit, served instantly. ──
  {
    const st = cut(7), th = at('there', 7) - st, hi = at('hit', 7) - st, ins = at('instantly', 7) - st;
    add({ id: 'S09', at: st, cam: [540, 760], zoom: 0.08, note: 'shelf top with 3 pizzas; on "there" shelf glows; on "hit" HIT green pill + tick; on "instantly" the middle pizza zips down to the customer at a table with speed lines',
      draw(lt, d, t) {
        bg('#F7E3C8', C.bg);
        const gone = lt > ins;
        K.warmShelf(540, 560, 0.75, [1, gone ? 0 : 1, 1], t, [0, 0, 0], lt > th && !gone ? 0.6 : 0);
        K.man({ x: 540, y: 1060, s: 0.55, arm: K.ARM.hip, eyes: 'n', mouth: lt > ins + 0.35 ? 'grin' : 'smile', brow: 0.5, look: 0 });
        K.table(540, 1170, 1.4);
        if (gone) { const u = eo(seg(lt, ins, ins + 0.3)); K.pizza(540, lerp(560, 1110, u), lerp(0.45, 0.55, u), 0, 8); if (u < 1) K.speedLines(540, lerp(560, 1110, u), 1); }
        if (lt > hi) { K.pill('HIT!', 220, 300, 80, GREEN, C.white, E(seg(lt, hi, hi + 0.25))); K.check(860, 300, 0.4, E(seg(lt, hi + 0.05, hi + 0.3))); }
      } });
    cue(st, 'whoosh'); cue(st + th, 'sparkle', { dur: 0.3, gain: 0.25 }); cue(st + hi, 'pop', { gain: 0.45 }); cue(st + ins, 'zip', { gain: 0.35 }); cue(st + ins + 0.3, 'thud', { gain: 0.3 });
  }

  // ── 9 · If not, it's a miss, ──
  {
    const st = cut(8), no = at('not', 8) - st, mi = at('miss', 8) - st;
    add({ id: 'S10', at: st, cam: [540, 760], zoom: 0.1, note: 'empty shelf; waiter below looks up shocked on "not"; red X slams over the shelf + MISS red pill on "miss"',
      draw(lt, d, t) {
        K.kitchen(1180);
        K.warmShelf(540, 640, 0.8, [0, 0, 0], t);
        waiter({ x: 540, y: 1080, s: 0.55, arm: K.ARM.hip, eyes: lt > no ? 'wide' : 'n', mouth: lt > no ? 'o' : 'smile', brow: lt > no ? 1 : 0.4, look: 0 });
        if (lt > mi) K.redX(540, 600, lerp(0.9, 0.5, eo(seg(lt, mi, mi + 0.2))), 1);
        if (lt > mi) K.pill('MISS', 540, 230, 90, C.red, C.white, E(seg(lt, mi, mi + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + no, 'boing', { gain: 0.25 }); cue(st + mi, 'slam', { gain: 0.4 });
  }

  // ── 10 · so the chef cooks it and puts a copy on the shelf. ──
  {
    const st = cut(9), co = at('cooks', 9) - st, cp = at('copy', 9) - st, sh = at('shelf', 9) - st;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.08, note: 'chef at stove bottom-left; on "cooks" a pizza appears in his hand; on "copy" a pizza arcs up onto the empty shelf top-right; + COPY pill; shelf glows on "shelf"',
      draw(lt, d, t) {
        K.kitchen(1180);
        K.warmShelf(700, 600, 0.7, [0, lt > cp + 0.45 ? 1 : 0, 0], t, [0, 0, 0], lt > sh ? 0.7 : 0);
        K.stove(260, 1080, 0.5, t, 1);
        const has = lt > co;
        cook({ x: 260, y: 1030, s: 0.55, arm: K.PHONE_ARM, holding: has ? (x, y) => K.pizza(x + 10, y - 40, 0.42 * E(seg(lt, co, co + 0.25)), lt * 0.3) : undefined, eyes: 'n', mouth: has ? 'grin' : 'smile', brow: 0.5, look: 0.7 });
        if (lt > cp && lt < cp + 0.45) { const u = eo(seg(lt, cp, cp + 0.45)); const [x, y] = K.arcAt(320, 640, 700, 590, 200, u); K.pizza(x, y, 0.4, u * 3); }
        if (lt > co) K.pill('COOK IT', 260, 300, 54, C.ink, C.white, E(seg(lt, co, co + 0.25)));
        if (lt > cp) K.pill('+ COPY', 700, 1200, 64, C.yellow, C.ink, E(seg(lt, cp, cp + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + co, 'sizzle', { dur: 0.6, gain: 0.2 }); cue(st + cp, 'slide', { dur: 0.45, gain: 0.3 }); cue(st + cp + 0.45, 'thud', { gain: 0.3 }); cue(st + sh, 'sparkle', { dur: 0.4, gain: 0.25 });
  }

  // ── 11 · Apps do the exact same thing: ──
  {
    const st = cut(10), ap = at('apps', 10) - st, th = at('thing', 10) - st;
    add({ id: 'S12', at: st, cam: [540, 760], zoom: 0.08, note: 'left: small warm shelf; right: a phone with app tiles; on "thing" big yellow = between them; SHELF / APP pills',
      draw(lt, d, t) {
        bg();
        K.warmShelf(270, 860, 0.45, [1, 1, 1], t);
        K.phone(800, 780, 0.42 * E(seg(lt, ap - 0.1, ap + 0.2)), () => K.homeScreen());
        if (lt > th) bigText('=', 540, 820, 220, C.yellow, 0, E(seg(lt, th, th + 0.25)));
        if (lt > th) { K.pill('SHELF', 270, 1200, 50, C.ink, C.white, E(seg(lt, th, th + 0.25))); K.pill('APP', 800, 1200, 50, C.ink, C.white, E(seg(lt, th + 0.05, th + 0.3))); }
      } });
    cue(st, 'whoosh'); cue(st + ap, 'pop', { gain: 0.35 }); cue(st + th, 'slam', { gain: 0.3 });
  }

  // ── 12 · they keep popular data in fast memory, ──
  {
    const st = cut(11), po = at('popular', 11) - st, da = at('data', 11) - st, me = at('memory', 11) - st;
    add({ id: 'S13', at: st, cam: [540, 760], zoom: 0.1, note: 'big RAM stick centre; on "popular" small data pills (profile, feed, prices) drop onto it; on "memory" FAST MEMORY yellow pill + burst',
      draw(lt, d, t) {
        bg();
        K.ramStick(540, 900, 1.5 * E(seg(lt, 0, 0.25)));
        ['PROFILE', 'FEED', 'PRICES'].forEach((s, k) => { const a = po + k * 0.15; if (lt < a) return; K.pill(s, 240 + k * 300, lerp(200, 700, eo(seg(lt, a, a + 0.35))), 44, PCOLS[k], C.white, 1); });
        if (lt > da) K.pill('POPULAR DATA', 540, 200, 56, C.ink, C.white, E(seg(lt, da, da + 0.25)));
        if (lt > me && lt < me + 0.5) K.burst(540, 900, 4, clamp(1 - (lt - me) * 2));
        if (lt > me) K.pill('FAST MEMORY', 540, 1200, 64, C.yellow, C.ink, E(seg(lt, me, me + 0.25)));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 3; k++) cue(st + po + k * 0.15 + 0.3, 'thud', { gain: 0.2 }); cue(st + me, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 13 · and skip the slow trip to the database. ──
  {
    const st = cut(12), sk = at('skip', 12) - st, tr = at('trip', 12) - st;
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.08, note: 'phone top-left, RAM stick top-right (close), database far bottom; envelopes zip phone→RAM fast; dashed long road down to the DB gets a red X on "skip"; FAST / SLOW TRIP pills',
      draw(lt, d, t) {
        bg();
        K.phone(200, 470, 0.3, () => K.homeScreen());
        K.ramStick(780, 440, 0.6);
        K.database(780, 1000, 0.75, 0, 'DATABASE');
        ctx.save(); ctx.setLineDash([26, 22]); ctx.lineWidth = 12; ctx.strokeStyle = C.ink; ctx.globalAlpha = 0.4; ctx.beginPath(); ctx.moveTo(260, 620); ctx.quadraticCurveTo(300, 1100, 560, 960); ctx.stroke(); ctx.restore();
        for (let k = 0; k < 6; k++) { const q = lt * 2.2 - k * 0.4; if (q < 0) continue; const u = q % 1; const [x, y] = K.arcAt(290, 430, 640, 430, 90, u); K.envelope(x, y, 0.2, 0); }
        if (lt > sk) K.redX(400, 900, lerp(0.7, 0.35, eo(seg(lt, sk, sk + 0.2))), 1);
        if (lt > tr) K.pill('SLOW TRIP', 330, 1200, 56, C.red, C.white, E(seg(lt, tr, tr + 0.25)));
        if (lt > sk) K.pill('FAST', 520, 250, 54, C.yellow, C.ink, E(seg(lt, sk, sk + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 1.2, gain: 0.2 }); cue(st + sk, 'slam', { gain: 0.35 }); cue(st + tr, 'pop', { gain: 0.35 });
  }

  // ── 14 · But old pizza goes bad, ──
  {
    const st = cut(13), pz = at('pizza', 13) - st, ba = at('bad', 13) - st;
    add({ id: 'S15', at: st, cam: [540, 720], zoom: 0.12, note: 'big pizza centre; on "pizza" it starts turning green and mouldy; stink lines on "bad"; GONE BAD red pill; waiter right recoils',
      draw(lt, d, t) {
        bg('#E8EFD9', C.bg);
        const stl = clamp((lt - pz) / Math.max(0.3, ba - pz + 0.3));
        K.pizza(460, 700, 1.6, 0.2, 8, lt > pz ? stl : 0);
        if (lt > ba) K.stink(460, 470, t, E(seg(lt, ba, ba + 0.3)));
        waiter({ x: 880, y: 1080, s: 0.5, arm: K.ARM.hip, eyes: lt > ba ? 'closed' : 'n', mouth: lt > ba ? 'flat' : 'smile', frown: lt > ba, brow: 0.3, look: -0.8 });
        if (lt > ba) K.pill('GONE BAD', 460, 1200, 64, C.red, C.white, E(seg(lt, ba, ba + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + pz, 'bubbles', { dur: 0.6, gain: 0.2 }); cue(st + ba, 'boing', { gain: 0.3 });
  }

  // ── 15 · so cached data gets an expiry timer. ──
  {
    const st = cut(14), da = at('data', 14) - st, ex = at('expiry', 14) - st, ti = at('timer', 14) - st, end = Le(14) - st;
    const run = Math.max(0.6, end - ex + 0.1);
    add({ id: 'S16', at: st, cam: [540, 760], zoom: 0.08, note: 'PRICES data pill above a RAM stick; on "expiry" a round timer pops next to it and drains; at zero the pill poofs (burst); EXPIRY TIMER pill',
      draw(lt, d, t) {
        bg();
        K.ramStick(540, 1000, 1.2);
        const left = lt > ex ? clamp(1 - (lt - ex) / run) : 1, gone = left <= 0;
        if (!gone) K.pill('PRICES', 360, 640, 70, PCOLS[2], C.white, E(seg(lt, da - 0.1, da + 0.2)));
        else K.burst(360, 640, 3, clamp(1 - (lt - ex - run) * 2.5));
        if (lt > ex) K.expiryTimer(780, 620, 0.9, left, t, E(seg(lt, ex, ex + 0.25)));
        if (lt > ti) K.pill('EXPIRY TIMER', 540, 230, 64, C.yellow, C.ink, E(seg(lt, ti, ti + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ex, 'pop', { gain: 0.35 }); for (let k = 0; k < 4; k++) cue(st + ex + 0.25 + k * 0.3, 'tock', { gain: 0.2 }); cue(st + ex + run, 'zip', { gain: 0.3 });
  }

  // ── 16 · Tomorrow: the CDN. ──
  {
    const st = cut(15), cd = at('cdn', 15) - st;
    add({ id: 'S17', at: st, cam: [540, 700], zoom: 0.03, note: 'waiter winks + points with DAY 6 / 30 pill; on "CDN" a globe drops in above him with tiny warm shelves around it (caches all over the world); NEXT: CDN pill',
      draw(lt, d, t) {
        bg();
        waiter({ x: 540, y: 1120, s: 0.8, arm: K.ARM.point, finger: Math.sin(lt * 9) * 0.25, eyes: lt < cd ? 'wink' : 'wide', mouth: 'smirk', smirk: true, brow: 0.6 });
        K.pill('DAY 6 / 30', 540, 170, 64, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        if (lt > cd - 0.1) { const y = lerp(-200, 440, eo(seg(lt, cd - 0.1, cd + 0.25))); K.globe(540, y, 1.3, t);
          for (let k = 0; k < 4; k++) { const a = -Math.PI * 0.9 + k * Math.PI * 0.6 + lt * 0.4; K.warmShelf(540 + Math.cos(a) * 400, y + Math.sin(a) * 210 + 60, 0.24 * E(seg(lt, cd + 0.2 + k * 0.08, cd + 0.45 + k * 0.08)), [1, 1, 1], t); } }
        if (lt > cd) K.pill('NEXT: CDN', 540, 1200, 60, C.ink, C.white, E(seg(lt, cd, cd + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + cd + 0.2, 'thud', { gain: 0.35 }); cue(st + cd, 'sparkle', { dur: 0.6, gain: 0.3 });
  }

  return { shots: S, cues: CUES };
}
