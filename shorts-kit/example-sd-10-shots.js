// (10/30) REPLICATION: the shot list. Pizza-chain analogy, continuing from day 9 (indexing made finding orders instant).
// All ten million orders live on ONE database; if that machine dies every order is gone. Replication = keeping copies.
// Analogy: a head chef with the master order book, every new order copied into the other cooks' books.
// Leader takes all writes, followers copy every change; reads can go to any copy, so more people get served at once.
// If the leader crashes, a follower is promoted and takes over. Catch: a copy can lag a moment behind (replication lag).
// One database is a gamble, copies are insurance. Tease: sharding.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const GREEN = '#5BAE6A', BLUE = '#3A7BD5', ORANGE = '#F29A3A';
const bg = (ring = '#CFE8F3', base = C.sky) => { fillAll(base); circle(540, 740, 560, ring); };
const warm = () => bg('#F7E3C8', C.bg);
const paper = () => { fillAll(C.bg); circle(540, 740, 600, '#EDE6D6'); };
const waiter = (o) => { K.man(o); K.bowtie(o.x, o.y, o.s); };
const cook = (o) => { K.man(o); K.chefHat(o.x, o.y, o.s, o.hat ?? 1); };
// a tilted database (wobble / crash)
const tiltDb = (x, y, s, rot, glow, label) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); K.database(0, 0, s, glow, label); ctx.restore(); };
const shield = (x, y, s, a = 1) => {
  if (s <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(0, -200); ctx.lineTo(170, -140); ctx.lineTo(160, 40); ctx.quadraticCurveTo(130, 160, 0, 220); ctx.quadraticCurveTo(-130, 160, -160, 40); ctx.lineTo(-170, -140); ctx.closePath();
  ctx.fillStyle = GREEN; ctx.fill(); ctx.lineWidth = 12; ctx.strokeStyle = C.ink; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, -200); ctx.lineTo(0, 220); ctx.quadraticCurveTo(-130, 160, -160, 40); ctx.lineTo(-170, -140); ctx.closePath(); ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fill();
  ctx.restore();
};
const die = (x, y, s, rot) => {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-90, -90, 180, 180, 30); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  for (const [a, b] of [[-45, -45], [45, 45], [0, 0], [45, -45], [-45, 45]]) circle(a, b, 16, C.red);
  ctx.restore();
};

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const at = (w, i) => Wd(w, i);

  // ── 1 · Yesterday we made finding orders instant, ──
  {
    const st = cut(0), ye = at('yesterday', 0) - st, fi = at('finding', 0) - st, ins = at('instant', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 760], zoom: 0.08, note: 'DAY 10 / 30 pill; YESTERDAY: INDEXING; tree drops in; from "finding" a red dot hops to a leaf; on "instant" green check + burst',
      draw(lt, d, t) {
        paper();
        const p = lt < fi ? 0 : lerp(0.01, 3, clamp((lt - fi) / Math.max(0.5, ins - fi)));
        ctx.save(); ctx.translate(0, lerp(-900, 0, eo(seg(lt, 0, 0.35)))); K.bTree(540, 460, 0.95, p); ctx.restore();
        K.pill('DAY 10 / 30', 540, 170, 64, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        if (lt > ye) K.pill('YESTERDAY: INDEXING', 540, 290, 42, C.ink, C.white, E(seg(lt, ye, ye + 0.25)));
        if (lt > ins) { K.check(880, 1100, 0.35, E(seg(lt, ins, ins + 0.25))); K.burst(880, 1100, 2.2, clamp(1 - (lt - ins) * 2)); }
      } });
    cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + 0.3, 'thud', { gain: 0.3 }); cue(st + ye, 'pop', { gain: 0.3 }); cue(st + fi, 'boing', { gain: 0.2 }); cue(st + ins, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 2 · but all ten million live on one database. ──
  {
    const st = cut(1), al = at('all', 1) - st, mi = at('million', 1) - st, on = at('one', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 760], zoom: 0.12, note: 'ORDERS database centre; tickets rain into it from "all"; 10,000,000 counter on "million"; ONLY ONE red pill + glow on "one"',
      draw(lt, d, t) {
        bg();
        K.database(540, 800, 0.85, lt > on ? 0.6 : 0, 'ORDERS');
        for (let k = 0; k < 12; k++) {
          const a = al + k * 0.09; if (lt < a || lt > a + 0.55) continue;
          const u = eio(seg(lt, a, a + 0.5)), side = k % 2 ? 1 : -1;
          const [x, y] = K.arcAt(540 + side * (380 + rnd(k) * 120), 380 + rnd(k + 3) * 300, 540, 700, 180, u);
          K.ticket(x, y, 0.5 * (1 - u * 0.5), (1 - u) * side * 0.6);
        }
        if (lt > mi) K.pill('10,000,000 ORDERS', 540, 300, 60, C.ink, C.yellow, lerp(1.3, 1, eo(seg(lt, mi, mi + 0.25))));
        if (lt > on) K.pill('ONLY ONE', 540, 1180, 66, C.red, C.white, E(seg(lt, on, on + 0.25)));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 12; k += 3) cue(st + al + k * 0.09, 'slide', { dur: 0.35, gain: 0.14 }); cue(st + mi, 'slam', { gain: 0.35 }); cue(st + on, 'pop', { gain: 0.35 });
  }

  // ── 3 · If that one machine dies, every order is gone. ──
  {
    const st = cut(2), dy = at('dies', 2) - st, ev = at('every', 2) - st, go = at('gone', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 760], zoom: 0.1, note: 'database centre-left, waiter right; on "dies" it tilts, red X + smoke, waiter shocked; from "every" tickets around it fade + fall away; ALL GONE red pill on "gone"',
      draw(lt, d, t) {
        warm();
        const dead = lt > dy, tl = dead ? -0.12 * eo(seg(lt, dy, dy + 0.3)) : Math.sin(lt * 3) * 0.02;
        for (let k = 0; k < 6; k++) {
          const fall = lt > ev + k * 0.07 ? eio(seg(lt, ev + k * 0.07, ev + k * 0.07 + 0.6)) : 0;
          ctx.save(); ctx.globalAlpha = 1 - fall;
          K.ticket(k < 3 ? 130 : 700, lerp(450 + (k % 3) * 200, 1300, fall), 0.4, (rnd(k) - 0.5) * 0.6 + fall);
          ctx.restore();
        }
        tiltDb(430, 820, 0.7, tl, 0, 'ORDERS');
        if (dead) { K.smokePuffs(430, 640, t, clamp((lt - dy) * 3)); K.redX(430, 760, lerp(1.6, 0.9, eo(seg(lt, dy, dy + 0.2))), 1); }
        waiter({ x: 890, y: 1000, s: 0.42, arm: dead ? K.ARM.mouth : K.ARM.down, eyes: dead ? 'wide' : 'n', mouth: dead ? 'o' : 'smile', brow: dead ? 1 : 0.3, look: -1 });
        if (lt > dy) K.pill('MACHINE DOWN', 430, 260, 56, C.ink, C.white, E(seg(lt, dy, dy + 0.25)));
        if (lt > go) K.pill('ALL GONE', 540, 1180, 72, C.red, C.white, lerp(1.4, 1, eo(seg(lt, go, go + 0.2))));
      } });
    cue(st, 'whoosh'); cue(st + dy, 'slam', { gain: 0.4 }); cue(st + dy + 0.1, 'alarm', { dur: 0.7, gain: 0.15 }); cue(st + ev, 'zip', { gain: 0.25 }); cue(st + go, 'thud', { gain: 0.35 });
  }

  // ── 4 · Replication fixes that, by keeping copies. ──
  {
    const st = cut(3), rp = at('replication', 3) - st, th = at('that', 3) - st, co = at('copies', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 700], zoom: 0.08, note: 'REPLICATION pill slams with burst; ORDERS database centre, green check on "that"; on "copies" two COPY databases slide out left and right',
      draw(lt, d, t) {
        bg();
        for (const [k, sx] of [[0, -1], [1, 1]]) {
          if (lt < co - 0.05) continue;
          const u = eo(seg(lt, co - 0.05 + k * 0.1, co + 0.35 + k * 0.1));
          K.database(540 + sx * lerp(0, 330, u), lerp(780, 860, u), 0.5, 0, 'COPY');
        }
        K.database(540, 760, 0.62, lt > th ? 0.5 : 0, 'ORDERS');
        if (lt > rp && lt < rp + 0.5) K.burst(540, 230, 3.4, clamp(1 - (lt - rp) * 2));
        if (lt > rp) K.pill('REPLICATION', 540, 230, 96, C.yellow, C.ink, lerp(1.5, 1, eo(seg(lt, rp, rp + 0.2))));
        if (lt > th) K.check(540, 420, 0.3, E(seg(lt, th, th + 0.25)));
        if (lt > co) K.pill('= COPIES', 540, 1180, 64, C.ink, C.white, E(seg(lt, co, co + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + rp, 'slam', { gain: 0.4 }); cue(st + th, 'sparkle', { dur: 0.3, gain: 0.25 }); cue(st + co, 'slide', { dur: 0.45, gain: 0.3 }); cue(st + co + 0.1, 'pop', { gain: 0.3 });
  }

  // ── 5 · Think of a head chef with the master order book, ──
  {
    const st = cut(4), ch = at('chef', 4) - st, ma = at('master', 4) - st, bk = at('book', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 760], zoom: 0.08, note: 'head chef left; HEAD CHEF pill on "chef" + crown pops on his hat; on "master" the big red MASTER book slides in right, burst on "book"',
      draw(lt, d, t) {
        warm();
        cook({ x: 290, y: 880, s: 0.55, arm: lt > ma ? K.ARM.point : K.ARM.hip, finger: 0.4, eyes: 'n', mouth: 'smile', brow: 0.5, look: 1 });
        if (lt > ch) K.crown(290, lerp(200, 548, eob(seg(lt, ch, ch + 0.3))), 0.55, 1);
        if (lt > ma) K.orderBook(760, lerp(1700, 760, eo(seg(lt, ma, ma + 0.35))), 0.7, 6, lt > bk ? 5 : -1, { col: C.red, label: 'MASTER' });
        if (lt > bk && lt < bk + 0.5) K.burst(760, 760, 2.8, clamp(1 - (lt - bk) * 2));
        if (lt > ch) K.pill('HEAD CHEF', 290, 200, 56, C.ink, C.white, E(seg(lt, ch, ch + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ch, 'pop', { gain: 0.35 }); cue(st + ma, 'slide', { dur: 0.35, gain: 0.25 }); cue(st + bk, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 6 · and every new order gets copied into the other cooks' books. ──
  {
    const st = cut(5), nw = at('new', 5) - st, cp = at('copied', 5) - st, bks = at('books', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.08, note: 'MASTER book top centre; NEW ORDER ticket drops in on "new" → line 7 appears; on "copied" two yellow dots arc to the blue + green COPY books below, which get line 7 on arrival; checks on "books"',
      draw(lt, d, t) {
        bg();
        const nm = lt > nw + 0.35 ? 7 : 6;
        K.orderBook(540, 470, 0.68, nm, nm === 7 ? 6 : -1, { col: C.red, label: 'MASTER' });
        if (lt > nw - 0.05 && lt < nw + 0.4) { const u = eio(seg(lt, nw - 0.05, nw + 0.35)); K.ticket(lerp(940, 620, u), lerp(150, 420, u), 0.45 * (1 - u * 0.6), 0.4 * (1 - u)); }
        if (lt > nw) K.pill('NEW ORDER', 860, 190, 46, GREEN, C.white, E(seg(lt, nw, nw + 0.25)));
        for (const [k, x, col] of [[0, 270, BLUE], [1, 810, GREEN]]) {
          const a = cp + k * 0.12, arr = lt > a + 0.55;
          K.orderBook(x, 960, 0.55, arr ? 7 : 6, arr ? 6 : -1, { col, label: 'COPY' });
          K.dataDot(540, 600, x, 860, 220, seg(lt, a, a + 0.55));
          if (lt > bks) K.check(x + 170, 820, 0.22, E(seg(lt, bks + k * 0.1, bks + k * 0.1 + 0.25)));
        }
        if (lt > cp) K.pill('COPIED', 540, 1210, 60, C.yellow, C.ink, E(seg(lt, cp, cp + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + nw + 0.3, 'thud', { gain: 0.3 }); cue(st + cp, 'zip', { gain: 0.25 }); cue(st + cp + 0.55, 'pop', { gain: 0.25 }); cue(st + cp + 0.67, 'pop', { gain: 0.25 }); cue(st + bks, 'sparkle', { dur: 0.4, gain: 0.25 });
  }

  // ── 7 · In databases, the leader takes all the writes, ──
  {
    const st = cut(6), db = at('databases', 6) - st, ld = at('leader', 6) - st, tk = at('takes', 6) - st, wr = at('writes', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 760], zoom: 0.08, note: 'LEADER database centre drops on "databases"; crown lands on it on "leader"; from "takes" tickets fly in from phones on both sides; ALL WRITES pill on "writes"',
      draw(lt, d, t) {
        bg();
        K.database(540, lerp(-400, 820, eo(seg(lt, 0.02, 0.35))), 0.75, lt > wr ? 0.5 : 0, 'LEADER');
        if (lt > ld) K.crown(540, lerp(200, 650, eob(seg(lt, ld, ld + 0.3))), 0.6, 1);
        K.phone(150, 560, 0.42, () => K.homeScreen(), 0.1);
        K.phone(930, 560, 0.42, () => K.homeScreen(), -0.1);
        for (let k = 0; k < 6; k++) {
          const a = tk + k * 0.16, side = k % 2 ? 1 : -1;
          if (lt < a || lt > a + 0.5) continue;
          const u = eio(seg(lt, a, a + 0.48)); const [x, y] = K.arcAt(540 + side * 390, 560, 540, 760, 160, u);
          K.ticket(x, y, 0.4 * (1 - u * 0.4), side * (1 - u) * 0.5);
        }
        if (lt > wr) K.pill('ALL WRITES', 540, 1190, 66, C.yellow, C.ink, E(seg(lt, wr, wr + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.3, 'thud', { gain: 0.3 }); cue(st + ld + 0.25, 'pop', { gain: 0.35 }); for (let k = 0; k < 6; k += 2) cue(st + tk + k * 0.16, 'slide', { dur: 0.35, gain: 0.15 }); cue(st + wr, 'pop', { gain: 0.3 });
  }

  // ── 8 · and the followers copy every change. ──
  {
    const st = cut(7), fo = at('followers', 7) - st, cp = at('copy', 7) - st, ch = at('change', 7) - st;
    const FX = [220, 540, 860];
    add({ id: 'S08', at: st, cam: [540, 720], zoom: 0.1, note: 'LEADER with crown top; three COPY databases drop in a row on "followers"; on "copy" dots stream down to each; followers glow on "change"',
      draw(lt, d, t) {
        bg();
        K.database(540, 430, 0.55, 0.5, 'LEADER'); K.crown(540, 320, 0.42, 1);
        for (let k = 0; k < 3; k++) {
          const a = 0.05 + k * 0.1;
          K.database(FX[k], lerp(-300, 950, eo(seg(lt, a, a + 0.3))), 0.4, lt > ch ? 0.6 : 0, 'COPY');
          for (let j = 0; j < 3; j++) K.dataDot(540, 640, FX[k], 860, 60, seg(lt, cp + j * 0.22 + k * 0.05, cp + j * 0.22 + k * 0.05 + 0.45), C.yellow, 16);
        }
        if (lt > fo) K.pill('FOLLOWERS', 540, 1200, 64, C.ink, C.white, E(seg(lt, fo, fo + 0.25)));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 3; k++) cue(st + 0.2 + k * 0.1, 'thud', { gain: 0.2 }); cue(st + cp, 'zip', { gain: 0.25 }); cue(st + ch, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 9 · Now reads can go to any copy, ──
  {
    const st = cut(8), rd = at('reads', 8) - st, cp = at('copy', 8) - st;
    const FX = [220, 540, 860];
    add({ id: 'S09', at: st, cam: [540, 760], zoom: 0.08, note: 'three databases (COPY, LEADER, COPY) bottom row; phones drop in on top; on "reads" each phone sends an arrow down; on "copy" all three glow',
      draw(lt, d, t) {
        bg();
        for (let k = 0; k < 3; k++) {
          K.database(FX[k], 910, 0.42, lt > cp ? 0.6 : 0, k === 1 ? 'LEADER' : 'COPY');
          if (k === 1) K.crown(540, 815, 0.32, 1);
          K.phone(FX[k], lerp(-300, 400, eo(seg(lt, 0.05 + k * 0.08, 0.4 + k * 0.08))), 0.36, () => K.homeScreen(), 0);
          if (lt > rd + k * 0.1) { const u = eo(seg(lt, rd + k * 0.1, rd + k * 0.1 + 0.3)); K.arrow(FX[k], 600, lerp(30, 110, u), Math.PI / 2, u); }
        }
        if (lt > rd) K.pill('READS', 540, 170, 72, GREEN, C.white, E(seg(lt, rd, rd + 0.25)));
        if (lt > cp) K.pill('ANY COPY', 540, 1210, 60, C.yellow, C.ink, E(seg(lt, cp, cp + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.2, 'slide', { dur: 0.3, gain: 0.2 }); for (let k = 0; k < 3; k++) cue(st + rd + k * 0.1, 'pop', { gain: 0.2 }); cue(st + cp, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 10 · so way more people get served at once. ──
  {
    const st = cut(9), mo = at('more', 9) - st, pe = at('people', 9) - st, sv = at('served', 9) - st;
    const FX = [220, 540, 860];
    add({ id: 'S10', at: st, cam: [540, 700], zoom: 0.1, note: 'three databases top row; from "people" a crowd of 9 small diners pops in below (3 per database); on "served" checks pop over each diner; MORE READERS pill on "more"',
      draw(lt, d, t) {
        warm();
        for (let k = 0; k < 3; k++) K.database(FX[k], 470, 0.32, lt > sv ? 0.5 : 0, k === 1 ? 'LEADER' : 'COPY');
        K.crown(540, 400, 0.26, 1);
        for (let k = 0; k < 9; k++) {
          const a = 0.1 + k * 0.06, g = Math.floor(k / 3), x = FX[g] + ((k % 3) - 1) * 90, y = 960 + (k % 2) * 30;
          const sc = E(seg(lt, a, a + 0.25));
          if (sc > 0) K.man({ x, y, s: 0.17 * sc, arm: lt > sv ? K.ARM.wave : K.ARM.down, eyes: 'n', mouth: lt > sv ? 'grin' : 'smile', brow: 0.4 });
          if (lt > sv + k * 0.04) K.check(x, y - 120, 0.12, E(seg(lt, sv + k * 0.04, sv + k * 0.04 + 0.2)));
        }
        if (lt > mo) K.pill('MORE READERS', 540, 190, 60, C.ink, C.white, E(seg(lt, mo, mo + 0.25)));
        if (lt > sv) K.pill('SERVED', 540, 1210, 64, GREEN, C.white, E(seg(lt, sv, sv + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + mo, 'pop', { gain: 0.3 }); for (let k = 0; k < 9; k += 2) cue(st + 0.15 + k * 0.06, 'pop', { gain: 0.15 }); cue(st + sv, 'sparkle', { dur: 0.5, gain: 0.3 });
  }

  // ── 11 · And if the leader crashes, ──
  {
    const st = cut(10), ld = at('leader', 10) - st, cr = at('crashes', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.14, note: 'LEADER close, crown on top (bounces on "leader"); on "crashes" it tilts, red X slam, smoke, crown tumbles off to the right; LEADER DOWN red pill',
      draw(lt, d, t) {
        bg();
        const dead = lt > cr;
        tiltDb(540, 820, 0.8, dead ? -0.14 * eo(seg(lt, cr, cr + 0.3)) : 0, 0, 'LEADER');
        const cu = seg(lt, cr, cr + 0.8);
        if (!dead) K.crown(540, 660 - (lt > ld ? Math.abs(Math.sin((lt - ld) * 9)) * 40 * clamp(1 - (lt - ld) * 1.5) : 0), 0.6, 1);
        else { ctx.save(); ctx.translate(lerp(540, 900, cu), lerp(660, 1080, cu * cu)); ctx.rotate(cu * 2.4); K.crown(0, 0, 0.6, 1); ctx.restore(); }
        if (dead) { K.smokePuffs(540, 640, t, clamp((lt - cr) * 3)); K.redX(540, 780, lerp(1.7, 1, eo(seg(lt, cr, cr + 0.2))), 1); }
        if (lt > cr) K.pill('LEADER DOWN', 540, 260, 70, C.red, C.white, lerp(1.4, 1, eo(seg(lt, cr, cr + 0.2))));
      } });
    cue(st, 'whoosh'); cue(st + ld, 'boing', { gain: 0.2 }); cue(st + cr, 'slam', { gain: 0.45 }); cue(st + cr + 0.1, 'alarm', { dur: 0.6, gain: 0.15 });
  }

  // ── 12 · a follower gets promoted and takes over. ──
  {
    const st = cut(11), fo = at('follower', 11) - st, pr = at('promoted', 11) - st, ov = at('over', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 760], zoom: 0.1, note: 'dead leader faded left with red X; COPY databases centre + right; on "follower" the centre one pulses; on "promoted" the crown arcs onto it + burst, label becomes LEADER; NEW LEADER green pill on "over"',
      draw(lt, d, t) {
        bg();
        ctx.save(); ctx.globalAlpha = 0.55; tiltDb(190, 900, 0.4, -0.14, 0, 'LEADER'); ctx.restore();
        K.redX(190, 860, 0.5, 0.8);
        const up = lt > pr + 0.4;
        K.database(870, 980, 0.34, 0, 'COPY');
        K.database(560, lerp(820, 760, eo(seg(lt, pr, pr + 0.4))), 0.5, lt > fo ? (up ? 0.8 : 0.4 + Math.sin(lt * 12) * 0.2) : 0, up ? 'LEADER' : 'COPY');
        if (lt > pr) { const u = eio(seg(lt, pr, pr + 0.4)); const [x, y] = K.arcAt(900, 160, 560, 620, 120, u); K.crown(x, y, 0.5, 1); }
        if (up && lt < pr + 0.9) K.burst(560, 580, 2.6, clamp(1 - (lt - pr - 0.4) * 2));
        if (lt > pr) K.pill('PROMOTED', 560, 260, 64, C.yellow, C.ink, E(seg(lt, pr, pr + 0.25)));
        if (lt > ov) K.pill('NEW LEADER', 560, 1200, 66, GREEN, C.white, E(seg(lt, ov, ov + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + fo, 'pop', { gain: 0.25 }); cue(st + pr, 'slide', { dur: 0.4, gain: 0.3 }); cue(st + pr + 0.4, 'sparkle', { dur: 0.5, gain: 0.35 }); cue(st + ov, 'pop', { gain: 0.35 });
  }

  // ── 13 · The catch? A copy can lag a moment behind. ──
  {
    const st = cut(12), ca = at('catch', 12) - st, cp = at('copy', 12) - st, lg = at('lag', 12) - st, bh = at('behind', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 740], zoom: 0.08, note: 'warning triangle + THE CATCH; from "copy": LEADER book (7 lines) top-left vs COPY book (5 lines + 2 red dashed empty slots) bottom-right, stopwatch; LAG red pill on "lag"; dots catch up after "behind"',
      draw(lt, d, t) {
        bg();
        if (lt < cp - 0.08) {
          K.warning(540, 700, E(seg(lt, 0.05, 0.35)) * 1.4);
          if (lt > ca) K.pill('THE CATCH', 540, 1150, 70, C.red, C.white, E(seg(lt, ca, ca + 0.25)));
          return;
        }
        const cn = lt > bh + 0.5 ? 7 : lt > bh + 0.25 ? 6 : 5;
        K.orderBook(310, 540, 0.55, 7, 6, { col: C.red, label: 'LEADER' });
        K.orderBook(770, 960, 0.55, cn, -1, { col: BLUE, label: 'COPY', lag: 7 - cn });
        K.stopwatch(830, 580, 0.3, lt * 5);
        K.dataDot(420, 680, 740, 880, 80, seg(lt, bh, bh + 0.3), C.yellow, 16);
        K.dataDot(420, 680, 740, 880, 80, seg(lt, bh + 0.2, bh + 0.5), C.yellow, 16);
        if (lt > lg) K.pill('LAG', 280, 980, 80, C.red, C.white, lerp(1.4, 1, eo(seg(lt, lg, lg + 0.2))));
        if (lt > bh) K.pill('A MOMENT BEHIND', 540, 220, 52, C.ink, C.white, E(seg(lt, bh, bh + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slam', { gain: 0.3 }); cue(st + cp - 0.08, 'whoosh'); cue(st + lg, 'boing', { gain: 0.3 }); cue(st + bh, 'zip', { gain: 0.2 }); cue(st + bh + 0.5, 'pop', { gain: 0.25 });
  }

  // ── 14a · One database is a gamble. ──
  const cps = at('copies', 13);
  {
    const st = cut(13), db = at('database', 13) - st, ga = at('gamble', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.1, note: 'one lonely database wobbling; on "gamble" a big dice tumbles in and lands beside it; GAMBLE red pill',
      draw(lt, d, t) {
        warm();
        tiltDb(420, 820, 0.7, Math.sin(lt * 7) * 0.05, 0, 'ORDERS');
        if (lt > db) K.pill('ONE DATABASE', 420, 260, 56, C.ink, C.white, E(seg(lt, db, db + 0.25)));
        if (lt > ga - 0.2) { const u = eo(seg(lt, ga - 0.2, ga + 0.3)); die(lerp(1200, 860, u), lerp(500, 980, u), 0.75, (1 - u) * 5); }
        if (lt > ga) K.pill('GAMBLE', 540, 1180, 74, C.red, C.white, lerp(1.4, 1, eo(seg(lt, ga, ga + 0.2))));
      } });
    cue(st, 'whoosh'); cue(st + db, 'pop', { gain: 0.3 }); cue(st + ga - 0.2, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + ga + 0.25, 'thud', { gain: 0.35 });
  }

  // ── 14b · Copies are insurance. ──
  {
    const st = cps - 0.08, ins = at('insurance', 13) - st;
    add({ id: 'S15', at: st, cam: [540, 760], zoom: 0.1, note: 'three databases (COPY, LEADER, COPY) drop in; green shield grows behind them on "insurance" with burst; INSURANCE green pill',
      draw(lt, d, t) {
        bg();
        if (lt > ins - 0.1) shield(540, 760, lerp(0, 2.3, eob(seg(lt, ins - 0.1, ins + 0.25))), 1);
        for (const [k, x] of [[0, 230], [1, 540], [2, 850]]) K.database(x, lerp(-300, 800, eo(seg(lt, k * 0.08, 0.35 + k * 0.08))), 0.4, lt > ins ? 0.6 : 0, k === 1 ? 'LEADER' : 'COPY');
        K.crown(540, lerp(-420, 705, eo(seg(lt, 0.08, 0.43))), 0.32, 1);
        if (lt > ins && lt < ins + 0.5) K.burst(540, 760, 3.4, clamp(1 - (lt - ins) * 2));
        if (lt > ins) K.pill('INSURANCE', 540, 1210, 70, GREEN, C.white, lerp(1.4, 1, eo(seg(lt, ins, ins + 0.2))));
        K.pill('COPIES', 540, 260, 64, C.yellow, C.ink, E(seg(lt, 0.05, 0.3)));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 3; k++) cue(st + 0.3 + k * 0.08, 'thud', { gain: 0.15 }); cue(st + ins, 'sparkle', { dur: 0.5, gain: 0.35 });
  }

  // ── 15 · Tomorrow: sharding. ──
  {
    const st = cut(14), to = at('tomorrow', 14) - st, sh = at('sharding', 14) - st;
    add({ id: 'S16', at: st, cam: [540, 700], zoom: 0.03, note: 'waiter winks + points, DAY 10 / 30 pill; big ORDERS database drops right on "tomorrow"; on "sharding" it splits into three small A-H / I-P / Q-Z databases; NEXT: SHARDING pill',
      draw(lt, d, t) {
        bg();
        waiter({ x: 230, y: 1120, s: 0.7, arm: K.ARM.point, finger: Math.sin(lt * 9) * 0.25, eyes: lt < sh ? 'wink' : 'wide', mouth: 'smirk', smirk: true, brow: 0.6 });
        K.pill('DAY 10 / 30', 540, 170, 64, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        if (lt > to && lt < sh) K.database(720, lerp(-300, 680, eo(seg(lt, to, to + 0.35))), 0.5, 0, 'ORDERS');
        if (lt > sh) for (const [k, lab] of [[0, 'A-H'], [1, 'I-P'], [2, 'Q-Z']]) { const u = eo(seg(lt, sh, sh + 0.35)); K.database(720 + (k - 1) * lerp(0, 230, u), lerp(680, 760 + (k === 1 ? -80 : 60), u), 0.3, 0.5, lab); }
        if (lt > sh) K.pill('NEXT: SHARDING', 600, 320, 52, C.ink, C.white, E(seg(lt, sh, sh + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + to + 0.3, 'thud', { gain: 0.3 }); cue(st + sh, 'zip', { gain: 0.3 }); cue(st + sh + 0.1, 'pop', { gain: 0.35 });
  }

  return { shots: S, cues: CUES };
}
