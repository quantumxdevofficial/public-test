// (11/30) SHARDING: the shot list. Pizza-chain analogy, continuing from day 10 (replication gave the database copies).
// Each copy still holds EVERY order; soon that's too much for one machine. Sharding splits the data into pieces.
// Analogy: tear the order book by name, A-H / I-P / Q-Z. Each piece = a shard on its own machine, so each stores less
// and does less work. Shard key: Asha → starts with A → shard one. Catch: bad key → one shard slammed (hot spot),
// the others idle. Loop: too big for one machine? Split it. Tease: the CAP theorem.
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
const tiltDb = (x, y, s, rot, glow, label) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); K.database(0, 0, s, glow, label); ctx.restore(); };
const SH = [['A-H', C.red], ['I-P', BLUE], ['Q-Z', GREEN]];
const FX = [220, 540, 860];

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const at = (w, i) => Wd(w, i);

  // ── 1 · Yesterday we gave our database copies, ──
  {
    const st = cut(0), ye = at('yesterday', 0) - st, db = at('database', 0) - st, co = at('copies', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 760], zoom: 0.08, note: 'DAY 11 / 30 pill; YESTERDAY: REPLICATION; LEADER database (crown) drops in on "database"; two COPY databases slide out on "copies"',
      draw(lt, d, t) {
        paper();
        for (const [k, sx] of [[0, -1], [1, 1]]) {
          if (lt < co - 0.05) continue;
          const u = eo(seg(lt, co - 0.05 + k * 0.1, co + 0.35 + k * 0.1));
          K.database(540 + sx * lerp(0, 330, u), lerp(800, 880, u), 0.45, 0, 'COPY');
        }
        K.database(540, lerp(-400, 800, eo(seg(lt, 0.08, 0.45))), 0.55, lt > db ? 0.5 : 0, 'LEADER');
        K.crown(540, lerp(-560, 700, eo(seg(lt, 0.15, 0.55))), 0.42, 1);
        K.pill('DAY 11 / 30', 540, 170, 64, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        if (lt > ye) K.pill('YESTERDAY: REPLICATION', 540, 290, 42, C.ink, C.white, E(seg(lt, ye, ye + 0.25)));
      } });
    cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + ye, 'pop', { gain: 0.3 }); cue(st + 0.45, 'thud', { gain: 0.3 }); cue(st + db, 'pop', { gain: 0.25 }); cue(st + co, 'slide', { dur: 0.45, gain: 0.3 });
  }

  // ── 2 · but each copy still holds every order, ──
  {
    const st = cut(1), ea = at('each', 1) - st, ev = at('every', 1) - st, or = at('order', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 760], zoom: 0.1, note: 'three databases in a row (COPY, LEADER, COPY), each glows on "each"; from "every" tickets rain into ALL three; EVERY ORDER x3 pill on "order"',
      draw(lt, d, t) {
        bg();
        for (let k = 0; k < 3; k++) {
          K.database(FX[k], 860, 0.42, lt > ea + k * 0.12 ? 0.5 : 0, k === 1 ? 'LEADER' : 'COPY');
          for (let j = 0; j < 4; j++) {
            const a = ev + j * 0.14 + k * 0.05; if (lt < a || lt > a + 0.45) continue;
            const u = eio(seg(lt, a, a + 0.42));
            K.ticket(FX[k] + (rnd(j + k * 7) - 0.5) * 120, lerp(330, 760, u), 0.36 * (1 - u * 0.5), (1 - u) * (rnd(j + k) - 0.5));
          }
        }
        K.crown(540, 760, 0.3, 1);
        if (lt > or) K.pill('EVERY ORDER  ×3', 540, 1190, 62, C.ink, C.yellow, lerp(1.3, 1, eo(seg(lt, or, or + 0.25))));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 3; k++) cue(st + ea + k * 0.12, 'pop', { gain: 0.2 }); for (let j = 0; j < 4; j += 2) cue(st + ev + j * 0.14, 'slide', { dur: 0.35, gain: 0.15 }); cue(st + or, 'slam', { gain: 0.3 });
  }

  // ── 3 · and soon that's too much for one machine. ──
  {
    const st = cut(2), so = at('soon', 2) - st, mu = at('much', 2) - st, ma = at('machine', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 800], zoom: 0.12, note: 'one database swells bigger + wobbles from "soon"; load meter right climbs to red; sweat drops; on "machine" smoke + red TOO BIG pill',
      draw(lt, d, t) {
        warm();
        const g = eio(seg(lt, so, ma + 0.2)), over = lt > mu;
        tiltDb(470, 860, lerp(0.5, 0.82, g), over ? Math.sin(lt * 14) * 0.04 : 0, 0, 'ORDERS');
        K.loadMeter(930, 820, 90, 520, lerp(0.2, 1, g));
        ctx.fillStyle = C.ink; ctx.font = '900 40px Inter'; ctx.textAlign = 'center'; ctx.fillText('LOAD', 930, 1120);
        if (over) K.sweat(700, 540, t, clamp((lt - mu) * 3));
        if (lt > ma) K.smokePuffs(470, 560, t, clamp((lt - ma) * 3));
        if (lt > so) K.pill('MORE & MORE ORDERS', 540, 230, 50, C.ink, C.white, E(seg(lt, so, so + 0.25)));
        if (lt > ma) K.pill('TOO BIG', 470, 1200, 76, C.red, C.white, lerp(1.4, 1, eo(seg(lt, ma, ma + 0.2))));
      } });
    cue(st, 'whoosh'); cue(st + so, 'slide', { dur: 0.8, gain: 0.2 }); cue(st + mu, 'boing', { gain: 0.2 }); cue(st + ma, 'alarm', { dur: 0.6, gain: 0.15 }); cue(st + ma, 'thud', { gain: 0.35 });
  }

  // ── 4 · Sharding splits the data into pieces. ──
  {
    const st = cut(3), sh = at('sharding', 3) - st, sp = at('splits', 3) - st, pc = at('pieces', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 760], zoom: 0.08, note: 'SHARDING pill slams with burst; big ORDERS database centre; on "splits" it splits into three smaller A-H / I-P / Q-Z databases; = PIECES pill on "pieces"',
      draw(lt, d, t) {
        bg();
        if (lt < sp) K.database(540, 820, 0.7, 0, 'ORDERS');
        else {
          const u = eo(seg(lt, sp, sp + 0.4));
          for (let k = 0; k < 3; k++) K.database(lerp(540, FX[k], u), lerp(820, 860, u), lerp(0.6, 0.4, u), lt > pc ? 0.5 : 0, SH[k][0]);
          if (lt < sp + 0.5) K.burst(540, 820, 3.2, clamp(1 - (lt - sp) * 2));
        }
        if (lt > sh && lt < sh + 0.5) K.burst(540, 250, 3.4, clamp(1 - (lt - sh) * 2));
        if (lt > sh) K.pill('SHARDING', 540, 250, 100, C.yellow, C.ink, lerp(1.5, 1, eo(seg(lt, sh, sh + 0.2))));
        if (lt > pc) K.pill('= PIECES', 540, 1190, 66, C.ink, C.white, E(seg(lt, pc, pc + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sh, 'slam', { gain: 0.4 }); cue(st + sp, 'zip', { gain: 0.3 }); cue(st + sp + 0.1, 'pop', { gain: 0.3 }); cue(st + pc, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 5 · Think of tearing the order book by name: ──
  {
    const st = cut(4), te = at('tearing', 4) - st, bk = at('book', 4) - st, nm = at('name', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 760], zoom: 0.08, note: 'cook left; ALL ORDERS book right; on "tearing" it shakes then rips into three torn pieces that spread; ranges appear + BY NAME pill on "name"',
      draw(lt, d, t) {
        warm();
        cook({ x: 220, y: 960, s: 0.48, arm: lt > te ? K.ARM.point : K.ARM.hip, finger: 0.4, eyes: lt > te ? 'wide' : 'n', mouth: lt > te ? 'grin' : 'smile', brow: 0.6, look: 1 });
        const rip = te + 0.35;
        if (lt < rip) {
          const sh = lt > te ? Math.sin(lt * 50) * 8 : 0;
          K.orderBook(680 + sh, lerp(1700, 720, eo(seg(lt, 0.02, 0.35))), 0.68, 8, -1, { col: C.red, label: 'ALL ORDERS' });
        } else {
          const u = eo(seg(lt, rip, rip + 0.4));
          for (let k = 0; k < 3; k++) K.bookPiece(680 + (k - 1) * lerp(130, 270, u), 720 + (k === 1 ? -lerp(0, 60, u) : 0), 0.62, lt > nm ? SH[k][0] : '', SH[k][1], (k - 1) * 0.12 * u, 4, k === 0 ? 'r' : k === 2 ? 'l' : 'lr');
          if (lt < rip + 0.5) K.burst(680, 720, 2.6, clamp(1 - (lt - rip) * 2));
        }
        if (lt > bk) K.pill('ORDER BOOK', 680, 240, 54, C.ink, C.white, E(seg(lt, bk, bk + 0.25)));
        if (lt > nm) K.pill('BY NAME', 540, 1200, 70, C.yellow, C.ink, E(seg(lt, nm, nm + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.3, 'thud', { gain: 0.25 }); cue(st + te + 0.35, 'zip', { gain: 0.35 }); cue(st + te + 0.4, 'pop', { gain: 0.25 }); cue(st + nm, 'pop', { gain: 0.3 });
  }

  // ── 6 · A to H here, I to P there, Q to Z there. ──
  {
    const st = cut(5), h1 = at('h', 5) - st, p1 = at('p', 5) - st, z1 = at('z', 5) - st;
    const lands = [h1 - 0.15, p1 - 0.15, z1 - 0.15];
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.06, note: 'three torn pieces slam down one by one on "H", "P", "Z": A-H left, I-P centre, Q-Z right, each with a bounce + burst',
      draw(lt, d, t) {
        paper();
        for (let k = 0; k < 3; k++) {
          if (lt < lands[k] - 0.25) continue;
          const u = eob(seg(lt, lands[k] - 0.25, lands[k] + 0.1));
          K.bookPiece(FX[k], lerp(-400, 760, u), 0.82, SH[k][0], SH[k][1], (1 - u) * (k - 1) * 0.6, 4, k === 0 ? 'r' : k === 2 ? 'l' : 'lr');
          if (lt > lands[k] + 0.05 && lt < lands[k] + 0.5) K.burst(FX[k], 760, 2.2, clamp(1 - (lt - lands[k] - 0.05) * 2.2));
        }
      } });
    cue(st, 'whoosh'); for (const l of lands) cue(st + l + 0.05, 'thud', { gain: 0.3 });
  }

  // ── 7 · Each piece is a shard, on its own machine, ──
  {
    const st = cut(6), pc = at('piece', 6) - st, sd = at('shard', 6) - st, ma = at('machine', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 760], zoom: 0.08, note: 'three pieces top row; on "shard" each drops into its own database below (SHARD 1/2/3); OWN MACHINE pill on "machine"',
      draw(lt, d, t) {
        bg();
        for (let k = 0; k < 3; k++) {
          const dbIn = E(seg(lt, ma - 0.5 + k * 0.08, ma - 0.15 + k * 0.08));
          const a = sd + k * 0.12, u = eio(seg(lt, a, a + 0.45));
          if (dbIn > 0) K.database(FX[k], 930, 0.4 * dbIn, lt > a + 0.45 ? 0.6 : 0, 'SHARD ' + (k + 1));
          if (u < 1) K.bookPiece(FX[k], lerp(500, 860, u), lerp(0.62, 0.15, u), SH[k][0], SH[k][1], 0, 4, k === 0 ? 'r' : k === 2 ? 'l' : 'lr', 1 - u * 0.6);
          if (lt > a + 0.45) K.pill(SH[k][0], FX[k], 650, 48, SH[k][1], C.white, E(seg(lt, a + 0.45, a + 0.7)));
          if (lt > pc && u === 0) K.burst(FX[k], 500, 1.4, clamp(1 - (lt - pc) * 3));
        }
        if (lt > sd) K.pill('SHARD', 540, 230, 90, C.yellow, C.ink, lerp(1.4, 1, eo(seg(lt, sd, sd + 0.2))));
        if (lt > ma) K.pill('OWN MACHINE', 540, 1210, 60, C.ink, C.white, E(seg(lt, ma, ma + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + pc, 'pop', { gain: 0.25 }); cue(st + sd, 'slam', { gain: 0.3 }); for (let k = 0; k < 3; k++) cue(st + sd + k * 0.12 + 0.4, 'plop', { gain: 0.2 }); cue(st + ma, 'pop', { gain: 0.3 });
  }

  // ── 8 · so each one stores less and does less work. ──
  {
    const st = cut(7), ls = at('less', 7) - st, wk = at('work', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 760], zoom: 0.08, note: 'three shard databases, a load meter beside each starts FULL (red) and drops to a third (green) on "less"; STORES LESS pill, LESS WORK green pill on "work"; checks',
      draw(lt, d, t) {
        warm();
        const lv = lerp(0.95, 0.3, eio(seg(lt, ls, ls + 0.5)));
        for (let k = 0; k < 3; k++) {
          K.database(FX[k] - 30, 820, 0.36, lt > wk ? 0.5 : 0, SH[k][0]);
          K.loadMeter(FX[k] + 110, 820, 50, 300, lv);
          if (lt > wk) K.check(FX[k] - 30, 580, 0.2, E(seg(lt, wk + k * 0.08, wk + k * 0.08 + 0.25)));
        }
        if (lt > ls) K.pill('STORES LESS', 540, 270, 62, C.ink, C.white, E(seg(lt, ls, ls + 0.25)));
        if (lt > wk) K.pill('LESS WORK', 540, 1200, 70, GREEN, C.white, lerp(1.3, 1, eo(seg(lt, wk, wk + 0.2))));
      } });
    cue(st, 'whoosh'); cue(st + ls, 'slide', { dur: 0.5, gain: 0.25 }); cue(st + wk, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 9 · To find Asha's order, look at the shard key. ──
  {
    const st = cut(8), fi = at('find', 8) - st, or = at('order', 8) - st, ky = at('key', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 760], zoom: 0.1, note: 'waiter left; FIND ORDER pill on "find"; on "order" the ASHA name tag pops up right; on "key" a gold key swings in pointing at the name + SHARD KEY = NAME pill',
      draw(lt, d, t) {
        bg();
        waiter({ x: 230, y: 980, s: 0.46, arm: lt > ky ? K.ARM.point : K.ARM.hip, finger: 0.3, eyes: 'n', mouth: 'smile', brow: lt > fi ? 0.7 : 0.3, look: 1 });
        if (lt > fi) K.pill('FIND ORDER', 540, 230, 60, C.ink, C.white, E(seg(lt, fi, fi + 0.25)));
        if (lt > or - 0.1) K.nameTag(700, 680, 0.85 * E(seg(lt, or - 0.1, or + 0.2)), 'ASHA', 0, -0.04);
        if (lt > ky) { const u = eob(seg(lt, ky, ky + 0.35)); K.key(lerp(1200, 600, u), 1000, 1.2, lerp(1, -0.35, u)); }
        if (lt > ky) K.pill('SHARD KEY = NAME', 540, 1200, 58, C.yellow, C.ink, E(seg(lt, ky, ky + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + fi, 'pop', { gain: 0.25 }); cue(st + or, 'pop', { gain: 0.35 }); cue(st + ky, 'slide', { dur: 0.3, gain: 0.25 }); cue(st + ky + 0.3, 'sparkle', { dur: 0.3, gain: 0.3 });
  }

  // ── 10 · Her name starts with A, so it's shard one. ──
  {
    const st = cut(9), aa = at('a', 9) - st, on = at('one', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 760], zoom: 0.08, note: 'ASHA tag top; "A" highlights yellow on "a"; a dot arcs down to SHARD 1 (A-H, left) which glows + check on "one"; the other two shards dim',
      draw(lt, d, t) {
        paper();
        K.nameTag(540, 380, 0.75, 'ASHA', lt > aa ? E(seg(lt, aa, aa + 0.25)) : 0);
        for (let k = 0; k < 3; k++) {
          const hit = k === 0 && lt > on;
          ctx.save(); if (lt > on && k > 0) ctx.globalAlpha = 0.45;
          K.database(FX[k], 930, 0.38, hit ? 0.8 : 0, 'SHARD ' + (k + 1));
          K.pill(SH[k][0], FX[k], 690, 44, SH[k][1], C.white, 1);
          ctx.restore();
        }
        K.dataDot(470, 470, 220, 620, 120, seg(lt, aa + 0.05, Math.max(aa + 0.4, on - 0.1)), C.yellow, 22);
        if (lt > on) { K.check(330, 830, 0.22, E(seg(lt, on, on + 0.25))); K.burst(220, 900, 2.4, clamp(1 - (lt - on) * 2)); }
        if (lt > on) K.pill('STRAIGHT TO SHARD 1', 540, 1200, 54, GREEN, C.white, E(seg(lt, on, on + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + aa, 'pop', { gain: 0.35 }); cue(st + aa + 0.15, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + on, 'sparkle', { dur: 0.4, gain: 0.35 });
  }

  // ── 11 · The catch? Pick a bad key, and one shard gets slammed, ──
  {
    const st = cut(10), ca = at('catch', 10) - st, bd = at('bad', 10) - st, sd = at('shard', 10) - st, sl = at('slammed', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.1, note: 'warning + THE CATCH; on "bad" a red key + BAD KEY; from "shard" tickets all pour into SHARD 2; on "slammed" it shakes, flames, sweat, SLAMMED red pill',
      draw(lt, d, t) {
        bg();
        if (lt < bd - 0.08) {
          K.warning(540, 720, E(seg(lt, 0.05, 0.35)) * 1.4);
          if (lt > ca) K.pill('THE CATCH', 540, 1150, 70, C.red, C.white, E(seg(lt, ca, ca + 0.25)));
          return;
        }
        for (let k = 0; k < 3; k++) {
          const hot = k === 1 && lt > sl;
          tiltDb(FX[k], 920, 0.38, hot ? Math.sin(lt * 30) * 0.05 : 0, 0, 'SHARD ' + (k + 1));
        }
        if (lt > sl) { K.flames(540, 760, 0.8 * E(seg(lt, sl, sl + 0.3)), t); K.sweat(680, 700, t, 1); }
        for (let j = 0; j < 10; j++) {
          const a = sd + j * 0.09; if (lt < a || lt > a + 0.45) continue;
          const u = eio(seg(lt, a, a + 0.42)), sx = (rnd(j) - 0.5) * 700;
          K.ticket(540 + sx * (1 - u), lerp(420, 800, u), 0.34 * (1 - u * 0.4), (1 - u) * (rnd(j + 4) - 0.5));
        }
        const kU = eob(seg(lt, bd - 0.08, bd + 0.25));
        K.key(lerp(-200, 380, kU), 300, 0.9, 0, C.red);
        K.pill('BAD KEY', 760, 300, 56, C.red, C.white, kU);
        if (lt > sl) K.pill('SLAMMED', 540, 1200, 76, C.red, C.white, lerp(1.4, 1, eo(seg(lt, sl, sl + 0.2))));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slam', { gain: 0.3 }); cue(st + bd - 0.08, 'whoosh'); cue(st + bd, 'boing', { gain: 0.25 }); for (let j = 0; j < 10; j += 3) cue(st + sd + j * 0.09, 'slide', { dur: 0.3, gain: 0.15 }); cue(st + sl, 'slam', { gain: 0.4 }); cue(st + sl + 0.1, 'alarm', { dur: 0.6, gain: 0.15 });
  }

  // ── 12 · while the others sit idle. ──
  {
    const st = cut(11), ot = at('others', 11) - st, id = at('idle', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 820], zoom: 0.1, note: 'SHARD 2 still burning; on "others" SHARD 1 + 3 glow briefly; on "idle" zzz float over them; their meters empty vs the full red one; IDLE pill',
      draw(lt, d, t) {
        warm();
        for (let k = 0; k < 3; k++) {
          const hot = k === 1;
          tiltDb(FX[k], 920, 0.38, hot ? Math.sin(lt * 30) * 0.05 : 0, !hot && lt > ot && lt < id ? 0.5 : 0, 'SHARD ' + (k + 1));
          K.loadMeter(FX[k], 470, 60, 220, hot ? 1 : 0.06);
          if (!hot && lt > id) K.zzz(FX[k] + 90, 760, 2.2, t, E(seg(lt, id, id + 0.3)));
        }
        K.flames(540, 760, 0.8, t);
        if (lt > id) K.pill('IDLE', 540, 1200, 80, C.ink, C.white, lerp(1.3, 1, eo(seg(lt, id, id + 0.2))));
      } });
    cue(st, 'whoosh'); cue(st + ot, 'pop', { gain: 0.25 }); cue(st + id, 'boing', { gain: 0.2 }); cue(st + id + 0.1, 'tock', { gain: 0.2 });
  }

  // ── 13 · Too big for one machine? Split it. ──
  {
    const st = cut(12), bg2 = at('big', 12) - st, ma = at('machine', 12) - st, sp = at('split', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 760], zoom: 0.12, note: 'cook right, to camera; swelling ORDERS database left wobbling, TOO BIG? red pill; on "split" it bursts into three A-H / I-P / Q-Z; cook winks + points; SPLIT IT yellow pill',
      draw(lt, d, t) {
        bg();
        cook({ x: 860, y: 1000, s: 0.44, arm: lt > sp ? K.ARM.point : K.ARM.hip, finger: -0.3, eyes: lt > sp ? 'wink' : 'n', mouth: lt > sp ? 'grin' : 'smirk', smirk: true, brow: 0.7, look: -1 });
        if (lt < sp) tiltDb(400, 830, lerp(0.55, 0.75, eio(seg(lt, 0, ma))), Math.sin(lt * 12) * 0.035, 0, 'ORDERS');
        else {
          const u = eo(seg(lt, sp, sp + 0.35));
          for (let k = 0; k < 3; k++) K.database(lerp(400, [170, 400, 630][k], u), lerp(830, [960, 760, 960][k], u), lerp(0.7, 0.32, u), 0.5, SH[k][0]);
          if (lt < sp + 0.5) K.burst(400, 830, 3.4, clamp(1 - (lt - sp) * 2));
        }
        if (lt > bg2 && lt < sp) K.pill('TOO BIG?', 400, 260, 72, C.red, C.white, E(seg(lt, bg2, bg2 + 0.25)));
        if (lt > sp) K.pill('SPLIT IT', 540, 260, 96, C.yellow, C.ink, lerp(1.5, 1, eo(seg(lt, sp, sp + 0.2))));
      } });
    cue(st, 'whoosh'); cue(st + bg2, 'pop', { gain: 0.3 }); cue(st + sp, 'zip', { gain: 0.35 }); cue(st + sp + 0.05, 'slam', { gain: 0.35 }); cue(st + sp + 0.15, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 14 · Tomorrow: the CAP theorem. ──
  {
    const st = cut(13), to = at('tomorrow', 13) - st, cp = at('cap', 13) - st, th = at('theorem', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 700], zoom: 0.03, note: 'waiter winks + points, DAY 11 / 30 pill; on "cap" the C-A-P triangle builds corner by corner on the right; NEXT: CAP THEOREM pill on "theorem"',
      draw(lt, d, t) {
        bg();
        waiter({ x: 230, y: 1120, s: 0.7, arm: K.ARM.point, finger: Math.sin(lt * 9) * 0.25, eyes: lt < cp ? 'wink' : 'wide', mouth: 'smirk', smirk: true, brow: 0.6 });
        K.pill('DAY 11 / 30', 540, 170, 64, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        if (lt > to - 0.05) {
          const lit = lt > cp + 0.24 ? 3 : lt > cp + 0.12 ? 2 : lt > cp ? 1 : 0;
          K.capTriangle(740, 700, 0.8 * E(seg(lt, to - 0.05, to + 0.25)), lit);
        }
        if (lt > th) K.pill('NEXT: CAP THEOREM', 620, 330, 50, C.ink, C.white, E(seg(lt, th, th + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + to, 'thud', { gain: 0.25 }); for (let k = 0; k < 3; k++) cue(st + cp + k * 0.12, 'pop', { gain: 0.25 }); cue(st + th, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  return { shots: S, cues: CUES };
}
