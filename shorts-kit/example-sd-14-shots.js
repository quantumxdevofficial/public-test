// (14/30) CACHE EVICTION & LRU: the shot list. Kitchen analogy, continuing from day 6 (the warm shelf = the cache):
// the shelf only holds three pizzas; a fourth shows up, something gets kicked out = eviction. Which one? LRU, least
// recently used: every order moves a pizza to the front, the untouched one drifts to the back and gets kicked out.
// Apps do this with fast memory (small and pricey): popular data stays, forgotten data goes. Tease: polling vs WebSockets.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const GREEN = '#5BAE6A', BLUE = '#3A7BD5', ORANGE = '#F29A3A', PURPLE = '#8A63D2';
const COL = { A: BLUE, B: GREEN, C: ORANGE, D: PURPLE };
const bg = (ring = '#CFE8F3', base = C.sky) => { fillAll(base); circle(540, 740, 560, ring); };
const waiter = (o) => { K.man(o); K.bowtie(o.x, o.y, o.s); };
const cook = (o) => { K.man(o); K.chefHat(o.x, o.y, o.s, o.hat ?? 1); };
const SX = [240, 540, 840];
// a side-on pizza on the rail at (x, y) with its letter tag under it
const rp = (x, y, letter, s = 1, rot = 0) => { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(1, 0.5); K.pizza(0, 0, 0.95 * s, rot); ctx.restore(); K.slotTag(x, y + 120 * s, 0.9, letter, COL[letter], s); };
const glowBox = (x, col, lt) => { ctx.save(); ctx.globalAlpha = 0.5 + 0.4 * Math.sin(lt * 10); rr(x - 150, 450, 300, 300, 30); ctx.lineWidth = 14; ctx.strokeStyle = col; ctx.stroke(); ctx.restore(); };
const ends = () => { K.pill('FRONT', 200, 300, 48, C.ink, C.white, 1); K.pill('BACK', 880, 300, 48, C.ink, C.white, 1); };

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const at = (w, i) => Wd(w, i);

  // ── 1 · Remember our warm shelf, the cache? ──
  {
    const st = cut(0), re = at('remember', 0) - st, sh = at('shelf', 0) - st, ca = at('cache', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 740], zoom: 0.08, note: 'DAY 14 / 30 pill; warm shelf with 3 pizzas drops in; glows on "shelf"; CACHE pill on "cache"; waiter right',
      draw(lt, d, t) {
        K.kitchen(1180);
        K.pill('DAY 14 / 30', 540, 170, 64, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        K.warmShelf(470, lerp(-300, 720, eo(seg(lt, re, re + 0.35))), 0.75, [1, 1, 1], t, [0, 0, 0], lt > sh ? 0.6 + 0.4 * Math.sin(lt * 8) : 0);
        waiter({ x: 900, y: 1080, s: 0.5, arm: K.ARM.point, eyes: 'n', mouth: 'smile', brow: 0.5, look: -0.8 });
        if (lt > ca) K.pill('CACHE', 470, 330, 90, C.ink, C.white, E(seg(lt, ca, ca + 0.25)));
      } });
    cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + re + 0.3, 'thud', { gain: 0.3 }); cue(st + sh, 'sparkle', { dur: 0.4, gain: 0.25 }); cue(st + ca, 'pop', { gain: 0.4 });
  }

  // ── 2 · It only has room for three pizzas. ──
  {
    const st = cut(1), ro = at('room', 1) - st, th = at('three', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 720], zoom: 0.1, note: 'big shelf; on "room" the 3 slots get counted 1-2-3 with badges; on "three" FULL red pill',
      draw(lt, d, t) {
        bg();
        K.warmShelf(540, 760, 0.95, [1, 1, 1], t);
        for (let k = 0; k < 3; k++) { const a = ro + k * 0.18; if (lt > a) K.countBadge(540 + (-220 + k * 220) * 0.95, 560, 52, String(k + 1), C.ink, E(seg(lt, a, a + 0.2))); }
        if (lt > th) K.pill('FULL: 3 MAX', 540, 1100, 70, C.red, C.white, E(seg(lt, th, th + 0.25)));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 3; k++) cue(st + ro + k * 0.18, 'pop', { gain: 0.3 }); cue(st + th, 'slam', { gain: 0.3 });
  }

  // ── 3 · So what happens when a fourth one shows up? ──
  {
    const st = cut(2), fo = at('fourth', 2) - st, up = at('up', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 740], zoom: 0.1, note: 'full shelf top; chef bottom-right holds up a NEW hot pizza on "fourth"; red ? over the shelf on "up"; waiter left wide-eyed',
      draw(lt, d, t) {
        K.kitchen(1180);
        K.warmShelf(540, 560, 0.7, [1, 1, 1], t);
        const has = lt > fo;
        cook({ x: 820, y: 1060, s: 0.55, arm: K.PHONE_ARM, holding: has ? (x, y) => K.pizza(x + 10, y - 40, 0.45 * E(seg(lt, fo, fo + 0.25)), lt * 0.4) : undefined, eyes: 'n', mouth: has ? 'grin' : 'smile', brow: 0.5, look: -0.6 });
        if (has) K.pill('#4 NEW', 820, 230, 56, C.yellow, C.ink, E(seg(lt, fo, fo + 0.25)));
        waiter({ x: 250, y: 1080, s: 0.5, arm: K.ARM.hip, eyes: lt > up ? 'wide' : 'n', mouth: lt > up ? 'o' : 'smile', brow: lt > up ? 1 : 0.4, look: 0.6 });
        if (lt > up) K.qmark(540, 300, E(seg(lt, up, up + 0.25)), 1, Math.sin(lt * 6) * 0.1);
      } });
    cue(st, 'whoosh'); cue(st + fo, 'pop', { gain: 0.4 }); cue(st + up, 'boing', { gain: 0.3 });
  }

  // ── 4 · Something has to get kicked out, ──
  {
    const st = cut(3), ki = at('kicked', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 720], zoom: 0.1, note: 'shelf with 3 pizzas; a boot swings in from the left and on "kicked" the left pizza flies off-screen spinning, speed lines; new pizza drops into the gap',
      draw(lt, d, t) {
        bg('#F7E3C8', C.bg);
        const hit = lt > ki;
        K.warmShelf(560, 760, 0.85, [hit ? 0 : 1, 1, 1], t);
        const sw = lt < ki - 0.35 ? 0 : eo(seg(lt, ki - 0.35, ki));
        K.boot(lerp(-120, 280, eo(seg(lt, 0, 0.4))), 740, 0.9, hit ? clamp(1 - (lt - ki) * 2) : sw);
        if (hit) { const u = seg(lt, ki, ki + 0.6); if (u < 1) { const x = lerp(370, 1300, eo(u)), y = lerp(760, 300, u) + u * u * 200; K.pizza(x, y, 0.55, u * 10); K.speedLines(x, y, 1); } }
        if (lt > ki + 0.5) K.pizza(560 - 0.85 * 220, lerp(200, 735, eo(seg(lt, ki + 0.5, ki + 0.8))), 0.5, 0);
        if (hit) K.pill('KICKED OUT', 540, 1120, 70, C.red, C.white, E(seg(lt, ki, ki + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 0.4, gain: 0.2 }); cue(st + ki, 'slam', { gain: 0.35 }); cue(st + ki + 0.05, 'zip', { gain: 0.3 });
  }

  // ── 5 · and that's called eviction. ──
  {
    const st = cut(4), ev = at('eviction', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 720], zoom: 0.1, note: 'kicked pizza tumbles in from the left toward a swinging door; on "eviction" burst + big yellow EVICTION pill slams',
      draw(lt, d, t) {
        K.kitchen(1180);
        K.swingDoor(780, 1180, 0.95, 0.6 * Math.max(0, Math.sin(lt * 4)));
        const u = seg(lt, 0, 0.8); if (u < 1) K.pizza(lerp(200, 900, eo(u)), lerp(400, 820, u * u), 0.5, u * 8);
        if (lt > ev && lt < ev + 0.5) K.burst(540, 460, 3.2, clamp(1 - (lt - ev) * 2));
        if (lt > ev) K.pill('EVICTION', 540, 460, 120, C.yellow, C.ink, lerp(1.6, 1, eo(seg(lt, ev, ev + 0.2))));
      } });
    cue(st, 'whoosh'); cue(st + 0.6, 'thud', { gain: 0.25 }); cue(st + ev, 'slam', { gain: 0.4 });
  }

  // ── 6 · But which pizza goes? ──
  {
    const st = cut(5), pz = at('pizza', 5) - st, go = at('goes', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 720], zoom: 0.1, note: 'three pizzas A B C on a rail; on "pizza" a red ? bobs over each in turn; waiter puzzled below',
      draw(lt, d, t) {
        bg();
        K.lruRail(90, 990, 760);
        ['A', 'B', 'C'].forEach((l, k) => rp(SX[k], 700, l, E(seg(lt, k * 0.08, k * 0.08 + 0.25))));
        if (lt > pz) for (let k = 0; k < 3; k++) { const a = pz + k * 0.2; if (lt > a) K.qmark(SX[k], 470 + Math.sin(lt * 7 + k) * 14, 0.55 * E(seg(lt, a, a + 0.2)), 1); }
        waiter({ x: 540, y: 1120, s: 0.42, arm: K.ARM.hip, eyes: 'n', mouth: lt > go ? 'o' : 'flat', brow: 0.9, look: Math.sin(lt * 3) * 0.6 });
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 3; k++) cue(st + pz + k * 0.2, 'pop', { gain: 0.25 }); cue(st + go, 'boing', { gain: 0.25 });
  }

  // ── 7 · The most popular rule is LRU, ──
  {
    const st = cut(6), ru = at('rule', 6) - st, lr = at('lru', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 700], zoom: 0.12, note: 'clipboard rulebook drops in on "rule"; huge LRU letters slam on "LRU" with burst; MOST POPULAR RULE pill',
      draw(lt, d, t) {
        bg('#F7E3C8', C.bg);
        if (lt < lr + 0.1) K.clipboard(540, lerp(-400, 760, eo(seg(lt, 0, 0.35))), 1.7, Math.sin(lt * 3) * 0.04, lt > ru ? 3 : 0);
        if (lt > ru) K.pill('MOST POPULAR RULE', 540, 230, 56, C.ink, C.white, E(seg(lt, ru, ru + 0.25)));
        if (lt > lr && lt < lr + 0.5) K.burst(540, 760, 4, clamp(1 - (lt - lr) * 2));
        if (lt > lr) bigText('LRU', 540, 800, 300, C.yellow, -0.05, lerp(1.6, 1, eo(seg(lt, lr, lr + 0.2))));
      } });
    cue(st, 'whoosh'); cue(st + ru + 0.2, 'thud', { gain: 0.3 }); cue(st + lr, 'slam', { gain: 0.4 });
  }

  // ── 8 · short for least recently used. ──
  {
    const st = cut(7), le = at('least', 7) - st, rc = at('recently', 7) - st, us = at('used', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 720], zoom: 0.08, note: 'L / R / U letters stacked, each expands to its word on cue: LEAST, RECENTLY, USED',
      draw(lt, d, t) {
        bg();
        [['L', 'EAST', le, BLUE], ['R', 'ECENTLY', rc, GREEN], ['U', 'SED', us, ORANGE]].forEach(([a, b, w, col], k) => {
          const y = 420 + k * 260, open = lt > w;
          K.pill(open ? a + b : a, 540, y, 96, open ? col : C.ink, C.white, open ? lerp(1.3, 1, eo(seg(lt, w, w + 0.2))) : E(seg(lt, k * 0.1, k * 0.1 + 0.25)));
        });
      } });
    cue(st, 'whoosh'); cue(st + le, 'pop', { gain: 0.35 }); cue(st + rc, 'pop', { gain: 0.35 }); cue(st + us, 'pop', { gain: 0.4 });
  }

  // ── 9 · Every time someone orders a pizza, ──
  {
    const st = cut(8), or = at('orders', 8) - st, pz = at('pizza', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 720], zoom: 0.08, note: 'rail A B C (FRONT left, BACK right); customer bottom; on "orders" a ticket arcs from him to pizza B; B glows on "pizza"',
      draw(lt, d, t) {
        bg();
        K.lruRail(90, 990, 640); ends();
        ['A', 'B', 'C'].forEach((l, k) => rp(SX[k], 580, l));
        if (lt > pz) glowBox(SX[1], C.yellow, lt);
        K.man({ x: 540, y: 1100, s: 0.45, arm: lt > or ? K.ARM.point : K.ARM.hip, eyes: 'n', mouth: lt > or ? 'grin' : 'smile', brow: 0.5, look: 0 });
        if (lt > or) { const u = eo(seg(lt, or, or + 0.45)); if (u < 1) { const [x, y] = K.arcAt(620, 900, 540, 520, 160, u); K.ticket(x, y, 0.36, (1 - u) * 0.8); } }
        if (lt > or) K.pill('ORDER: B', 820, 1000, 50, C.yellow, C.ink, E(seg(lt, or, or + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + or, 'slide', { dur: 0.45, gain: 0.25 }); cue(st + pz, 'sparkle', { dur: 0.4, gain: 0.25 });
  }

  // ── 10 · it jumps to the front of the line. ──
  {
    const st = cut(9), ju = at('jumps', 9) - st, fr = at('front', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 720], zoom: 0.1, note: 'on "jumps" B hops in an arc to the FRONT slot while A slides to the middle; on "front" a tick + JUST USED pill',
      draw(lt, d, t) {
        bg();
        K.lruRail(90, 990, 640); ends();
        const u = eio(seg(lt, ju, ju + 0.55));
        rp(SX[2], 580, 'C');
        rp(lerp(SX[0], SX[1], u), 580, 'A');
        const [bx, by] = K.arcAt(SX[1], 580, SX[0], 580, 260, u); rp(bx, by, 'B');
        if (lt > ju && u < 1) K.speedLines(bx + 260, by, 0.7);
        if (lt > fr) K.check(SX[0], 420, 0.4, E(seg(lt, fr, fr + 0.25)));
        if (lt > fr) K.pill('JUST USED', 260, 1000, 56, C.yellow, C.ink, E(seg(lt, fr, fr + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ju, 'boing', { gain: 0.3 }); cue(st + ju + 0.55, 'thud', { gain: 0.25 }); cue(st + fr, 'pop', { gain: 0.35 });
  }

  // ── 11 · The one nobody has touched in the longest time ──
  {
    const st = cut(10), no = at('nobody', 10) - st, to = at('touched', 10) - st, lo = at('longest', 10) - st;
    add({ id: 'S11', at: st, cam: [700, 720], zoom: 0.12, note: 'B A C on the rail; clocks above: NOW, 5 MIN, 1 HR; on "nobody" C gets cobwebs; on "longest" C clock turns red',
      draw(lt, d, t) {
        bg();
        K.lruRail(90, 990, 640);
        [['B', 'NOW'], ['A', '5 MIN'], ['C', '1 HR']].forEach(([l, lab], k) => {
          rp(SX[k], 580, l);
          const a = 0.1 + k * 0.12; K.ageClock(SX[k], 290, 1.05, lab, k === 2 && lt > lo ? 1 : 0, t * (k === 2 ? 0.3 : 1), E(seg(lt, a, a + 0.25)));
        });
        if (lt > no) { K.cobweb(SX[2] + 140, 470, -0.9 * E(seg(lt, no, no + 0.3)) * -1, 1); }
        if (lt > to) K.pill('UNTOUCHED', SX[2] - 60, 1000, 56, C.red, C.white, E(seg(lt, to, to + 0.25)));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 3; k++) cue(st + 0.1 + k * 0.12, 'pop', { gain: 0.25 }); cue(st + no, 'sparkle', { dur: 0.4, gain: 0.2 }); for (let k = 0; k < 3; k++) cue(st + lo + k * 0.3, 'tock', { gain: 0.2 });
  }

  // ── 12 · drifts to the back, and that one gets kicked out. ──
  {
    const st = cut(11), ba = at('back', 11) - st, ki = at('kicked', 11) - st;
    add({ id: 'S12', at: st, cam: [600, 720], zoom: 0.1, note: 'B A C on the rail, C at BACK glows red on "back"; a boot from the right kicks C off on "kicked"; new pizza D drops into FRONT and the others shift right',
      draw(lt, d, t) {
        bg();
        K.lruRail(90, 990, 640); ends();
        const hit = lt > ki, sh = eio(seg(lt, ki + 0.35, ki + 0.75));
        rp(lerp(SX[0], SX[1], sh), 580, 'B'); rp(lerp(SX[1], SX[2], sh), 580, 'A');
        if (!hit) { rp(SX[2], 580, 'C'); if (lt > ba) glowBox(SX[2], C.red, lt); }
        else { const u = seg(lt, ki, ki + 0.6); if (u < 1) { const x = lerp(SX[2], 1350, eo(u)), y = lerp(580, 250, u) + u * u * 200; K.pizza(x, y, 0.55, -u * 10); } }
        K.boot(lerp(1300, 1010, eo(seg(lt, ki - 0.6, ki - 0.25))), 600, 0.9, lt < ki - 0.3 ? 0 : hit ? clamp(1 - (lt - ki) * 2) : eo(seg(lt, ki - 0.3, ki)), true);
        if (lt > ki + 0.75) rp(SX[0], lerp(150, 580, eo(seg(lt, ki + 0.75, ki + 1.05))), 'D');
        if (hit) K.pill('C EVICTED', 540, 1000, 66, C.red, C.white, E(seg(lt, ki, ki + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ba, 'alarm', { dur: 0.6, gain: 0.15 }); cue(st + ki, 'slam', { gain: 0.35 }); cue(st + ki + 0.05, 'zip', { gain: 0.3 }); cue(st + ki + 1.0, 'thud', { gain: 0.25 });
  }

  // ── 13 · Apps do this with memory, ──
  {
    const st = cut(12), ap = at('apps', 12) - st, me = at('memory', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 760], zoom: 0.08, note: 'left: small warm shelf; right: a phone; on "memory" a RAM stick rises below the phone and a yellow = sits between shelf and RAM',
      draw(lt, d, t) {
        bg();
        K.warmShelf(260, 820, 0.42, [1, 1, 1], t);
        K.phone(800, 560, 0.34 * E(seg(lt, ap - 0.1, ap + 0.2)), () => K.homeScreen());
        if (lt > me) { K.ramStick(800, lerp(1400, 980, eo(seg(lt, me, me + 0.3))), 0.75); bigText('=', 520, 830, 200, C.yellow, 0, E(seg(lt, me + 0.1, me + 0.35))); K.pill('MEMORY', 800, 1120, 50, C.ink, C.white, E(seg(lt, me + 0.1, me + 0.35))); }
      } });
    cue(st, 'whoosh'); cue(st + ap, 'pop', { gain: 0.35 }); cue(st + me + 0.25, 'thud', { gain: 0.3 }); cue(st + me + 0.15, 'slam', { gain: 0.25 });
  }

  // ── 14 · because fast memory is small and pricey. ──
  {
    const st = cut(13), sm = at('small', 13) - st, pr = at('pricey', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 720], zoom: 0.1, note: 'RAM stick next to a tall database; on "small" the RAM shrinks with a SMALL pill; on "pricey" a red $$$ pill',
      draw(lt, d, t) {
        bg();
        K.database(760, 760, 1.0, 0, 'DATABASE');
        const s = lt > sm ? lerp(1.0, 0.6, eo(seg(lt, sm, sm + 0.3))) : 1.0;
        K.ramStick(290, 760, s);
        K.pill('FAST', 290, 330, 56, C.ink, C.white, E(seg(lt, 0.05, 0.3)));
        if (lt > sm) K.pill('SMALL', 290, 1000, 60, C.yellow, C.ink, E(seg(lt, sm, sm + 0.25)));
        if (lt > pr) K.pill('$$$', 290, 560, 80, C.red, C.white, lerp(1.5, 1, eo(seg(lt, pr, pr + 0.2))));
      } });
    cue(st, 'whoosh'); cue(st + sm, 'boing', { gain: 0.3 }); cue(st + pr, 'slam', { gain: 0.35 });
  }

  // ── 15 · So popular data stays, and forgotten data goes. ──
  {
    const st = cut(14), stv = at('stays', 14) - st, fo = at('forgotten', 14) - st, go = at('goes', 14) - st;
    add({ id: 'S15', at: st, cam: [540, 720], zoom: 0.08, note: 'RAM stick with 3 data pills above; on "stays" PROFILE + FEED get ticks; on "forgotten" OLD POST greys out and on "goes" zips off right',
      draw(lt, d, t) {
        bg();
        K.ramStick(540, 900, 1.4);
        K.pill('PROFILE', 300, 560, 46, BLUE, C.white, E(seg(lt, 0, 0.25)));
        K.pill('FEED', 540, 430, 46, GREEN, C.white, E(seg(lt, 0.08, 0.33)));
        if (lt > stv) { K.check(470, 520, 0.3, E(seg(lt, stv, stv + 0.25))); K.check(660, 390, 0.3, E(seg(lt, stv + 0.1, stv + 0.35))); }
        const gx = lt > go ? lerp(800, 1400, eo(seg(lt, go, go + 0.4))) : 800;
        K.pill('OLD POST', gx, 600, 46, lt > fo ? '#9AA3AF' : ORANGE, C.white, E(seg(lt, 0.16, 0.41)));
        if (lt > go && lt < go + 0.4) K.speedLines(gx - 120, 600, 1);
        if (lt > stv) K.pill('STAYS', 380, 230, 60, GREEN, C.white, E(seg(lt, stv, stv + 0.25)));
        if (lt > go) K.pill('GOES', 760, 230, 60, C.red, C.white, E(seg(lt, go, go + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + stv, 'sparkle', { dur: 0.4, gain: 0.25 }); cue(st + go, 'zip', { gain: 0.35 });
  }

  // ── 16 · Tomorrow: polling versus WebSockets. ──
  {
    const st = cut(15), to = at('tomorrow', 15) - st, po = at('polling', 15) - st, we = at('websockets', 15) - st;
    add({ id: 'S16', at: st, cam: [540, 700], zoom: 0.03, note: 'waiter winks + points; DAY 14 / 30; on "polling" a phone+server left with envelopes going back and forth; on "WebSockets" phone+server right joined by a solid yellow line; NEXT pill',
      draw(lt, d, t) {
        bg();
        K.pill('DAY 14 / 30', 540, 170, 64, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        waiter({ x: 540, y: 1120, s: 0.6, arm: K.ARM.point, finger: Math.sin(lt * 9) * 0.25, eyes: lt > we ? 'wink' : 'n', mouth: 'smirk', smirk: true, brow: 0.6 });
        if (lt > po) { const p = E(seg(lt, po, po + 0.25)); K.phone(230, 470, 0.34 * p, () => K.homeScreen()); K.server(230, 830, 0.45 * p, t);
          for (let k = 0; k < 3; k++) { const q = (lt - po) * 1.6 - k * 0.33; if (q < 0) continue; const u = q % 1; K.envelope(230, lerp(640, 740, u), 0.2, 0); } }
        if (lt > we) { const p = E(seg(lt, we, we + 0.25)); K.phone(850, 470, 0.34 * p, () => K.homeScreen()); K.server(850, 830, 0.45 * p, t);
          line([[850, 650], [850, 750]], C.yellow, 20 * p); }
        if (lt > to) K.pill('NEXT: POLLING VS WEBSOCKETS', 540, 300, 40, C.ink, C.white, E(seg(lt, to, to + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + po, 'pop', { gain: 0.3 }); cue(st + we, 'sparkle', { dur: 0.5, gain: 0.3 });
  }

  return { shots: S, cues: CUES };
}
