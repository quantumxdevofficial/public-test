// (9/30) DATABASE INDEXING: the shot list. Pizza-chain analogy, continuing from day 8 (we saved every order in a database).
// Now there are ten million orders and a customer calls about Ravi's order. Without an index the database checks every row,
// one by one, like flipping every page of a book (full table scan). An index = the index at the back of a textbook:
// a sorted list of names, each pointing to exactly where its row lives. Databases keep it as a tree (B-tree), so even
// ten million rows take just a few hops. Catch: every new order must update the index too, so writes get slower.
// Index what you search, not everything. Tease: replication.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const GREEN = '#5BAE6A', BLUE = '#3A7BD5', ORANGE = '#F29A3A';
const bg = (ring = '#CFE8F3', base = C.sky) => { fillAll(base); circle(540, 740, 560, ring); };
const warm = () => bg('#F7E3C8', C.bg);
const paper = () => { fillAll(C.bg); circle(540, 740, 600, '#EDE6D6'); };
const waiter = (o) => { K.man(o); K.bowtie(o.x, o.y, o.s); };
const NAMES = ['ASHA', 'SAM', 'MEERA', 'JON', 'PRIYA', 'LEO', 'NINA', 'OMAR', 'ZOE', 'KABIR', 'LILY', 'DEV', 'TARA', 'MAX', 'ISHA', 'BEN'];
const PIZ = ['PEPPERONI', 'VEGGIE', 'MARGHERITA', 'HAWAIIAN', 'PANEER'];
const fmt = (n) => Math.floor(n).toLocaleString('en-US');
const scanRows = (off) => { const r = []; for (let k = 0; k < 6; k++) { const i = Math.floor(off) + k; r.push([fmt(i + 1), NAMES[i % NAMES.length], PIZ[i % PIZ.length]]); } return r; };
const IDX = [['ASHA', 'ROW 82'], ['BEN', 'ROW 4,019'], ['MEERA', 'ROW 513,377'], ['NINA', 'ROW 90,210'], ['RAVI', 'ROW 7,104,221'], ['SAM', 'ROW 3,650'], ['ZOE', 'ROW 2,288,004']];
const book = (x, y, s, sq = 1) => {               // closed textbook cover (flat), sq squashes x for a flip
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sq, s);
  rr(-300, -400, 620, 800, 26); ctx.fillStyle = '#E9E2D2'; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(-320, -410, 600, 800, 26); ctx.fillStyle = BLUE; ctx.fill(); ctx.stroke();
  rr(-320, -410, 70, 800, [26, 0, 0, 26]); ctx.fillStyle = '#2C5FA8'; ctx.fill();
  rr(-200, -260, 400, 150, 16); ctx.fillStyle = C.white; ctx.fill();
  ctx.fillStyle = C.ink; ctx.font = '900 64px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('TEXTBOOK', 0, -184);
  circle(0, 120, 90, C.yellow); rr(-60, 110, 120, 20, 10); ctx.fillStyle = C.ink; ctx.fill();
  ctx.restore();
};

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const at = (w, i) => Wd(w, i);

  // ── 1 · Yesterday we saved every pizza order, ──
  {
    const st = cut(0), ye = at('yesterday', 0) - st, sv = at('saved', 0) - st, or = at('order', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 760], zoom: 0.08, note: 'DAY 9 / 30 pill; YESTERDAY: SQL + NOSQL pill; database centre; from "saved" order tickets fly in from both sides into it; db glows on "order"',
      draw(lt, d, t) {
        paper();
        K.database(540, lerp(-400, 780, eo(seg(lt, 0, 0.35))), 0.9, lt > or ? 0.6 : 0, 'ORDERS');
        for (let k = 0; k < 6; k++) {
          const a = sv + k * 0.14; if (lt < a || lt > a + 0.6) continue;
          const u = eio(seg(lt, a, a + 0.55)), side = k % 2 ? 1 : -1;
          const [x, y] = K.arcAt(540 + side * 520, 520 + (k % 3) * 160, 540, 640, 160, u);
          K.ticket(x, y, 0.75 * (1 - u * 0.5), (1 - u) * side * 0.6);
        }
        K.pill('DAY 9 / 30', 540, 170, 64, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        if (lt > ye) K.pill('YESTERDAY: SQL + NOSQL', 540, 290, 42, C.ink, C.white, E(seg(lt, ye, ye + 0.25)));
      } });
    cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + 0.3, 'thud', { gain: 0.3 }); cue(st + ye, 'pop', { gain: 0.3 }); for (let k = 0; k < 6; k += 2) cue(st + sv + k * 0.14, 'slide', { dur: 0.4, gain: 0.15 }); cue(st + or, 'sparkle', { dur: 0.4, gain: 0.25 });
  }

  // ── 2 · but now there are ten million of them, ──
  {
    const st = cut(1), nw = at('now', 1) - st, mi = at('million', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 700], zoom: 0.12, note: 'database centre, tickets pile up around it; counter box counts up fast from "now" and lands on 10,000,000 on "million" (yellow burst); db wobbles',
      draw(lt, d, t) {
        bg();
        for (let k = 0; k < 14; k++) { const a = nw + k * 0.06; if (lt < a) continue; const side = k % 2 ? 1 : -1; K.ticket(540 + side * (260 + rnd(k) * 170), lerp(-150, 760 + rnd(k + 4) * 420, eo(seg(lt, a, a + 0.4))), 0.45, (rnd(k + 9) - 0.5)); }
        const wob = lt > mi ? Math.sin(lt * 30) * 0.03 * clamp(1 - (lt - mi) * 2) : 0;
        ctx.save(); ctx.translate(540, 900); ctx.rotate(wob); K.database(0, 0, 0.75, lt > mi ? 0.5 : 0, 'ORDERS'); ctx.restore();
        const v = lt < nw ? 4812 : lt < mi ? lerp(4812, 9200000, eio(seg(lt, nw, mi))) : 10000000;
        K.pill(fmt(v), 540, 300, 96, C.ink, lt > mi ? C.yellow : C.white, E(seg(lt, 0, 0.3)) * (lt > mi ? lerp(1.2, 1, eo(seg(lt, mi, mi + 0.25))) : 1));
        K.pill('ORDERS', 540, 470, 48, C.yellow, C.ink, E(seg(lt, 0.1, 0.4)));
        if (lt > mi && lt < mi + 0.6) K.burst(540, 330, 3.6, clamp(1 - (lt - mi) * 1.7));
      } });
    cue(st, 'whoosh'); cue(st + nw, 'slide', { dur: 0.9, gain: 0.2 }); for (let k = 0; k < 14; k += 3) cue(st + nw + k * 0.06 + 0.35, 'thud', { gain: 0.12 }); cue(st + mi, 'slam', { gain: 0.4 });
  }

  // ── 3 · and a customer calls asking about Ravi's order. ──
  {
    const st = cut(2), cu = at('customer', 2) - st, ca = at('calls', 2) - st, rv = at("ravi's", 2) - st;
    add({ id: 'S03', at: st, cam: [540, 760], zoom: 0.1, note: 'phone left rings with CUSTOMER calling screen (shakes from "calls"); waiter right, hand at mouth; on "Ravi\'s" a speech bubble RAVI\'S ORDER? pops',
      draw(lt, d, t) {
        warm();
        const ring = lt > ca ? Math.sin(lt * 40) * 0.05 : 0;
        K.phone(300, lerp(1500, 820, eo(seg(lt, 0, 0.35))), 0.82, () => K.callScreen('CUSTOMER', t), ring);
        waiter({ x: 800, y: 1000, s: 0.55, arm: K.ARM.mouth, eyes: lt > rv ? 'wide' : 'n', mouth: lt > rv ? 'o' : 'flat', brow: lt > rv ? 1 : 0.5, look: -1 });
        if (lt > cu) K.pill('CUSTOMER', 300, 300, 56, GREEN, C.white, E(seg(lt, cu, cu + 0.25)));
        if (lt > rv) K.bubble(640, 330, 1, "RAVI'S ORDER?", E(seg(lt, rv, rv + 0.25)), -1, C.white, C.ink, 56);
      } });
    cue(st, 'whoosh'); cue(st + ca, 'alarm', { dur: 0.8, gain: 0.15 }); cue(st + cu, 'pop', { gain: 0.3 }); cue(st + rv, 'pop', { gain: 0.35 });
  }

  // ── 4 · Without help, the database checks every row, ──
  {
    const st = cut(3), hp = at('help', 3) - st, db = at('database', 3) - st, rw = at('row', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 700], zoom: 0.08, note: 'NO INDEX red pill on "help"; table of orders (ROW | NAME | PIZZA) slides up on "database"; a scan highlight walks down the rows with a magnifier; on "row" the rows start scrolling',
      draw(lt, d, t) {
        bg();
        if (lt > hp) K.pill('NO INDEX', 540, 200, 70, C.red, C.white, E(seg(lt, hp, hp + 0.25)));
        const sc = lt > rw ? (lt - rw) * 6 : 0, hl = lt > db + 0.3 ? Math.floor((lt - db - 0.3) * 5) % 6 : -1;
        K.sqlGrid(540, lerp(1600, 360, eo(seg(lt, 0, 0.35))), 0.95, scanRows(sc), 6, { head: ['ROW', 'NAME', 'PIZZA'], cw: [230, 260, 370], hl });
        if (hl >= 0) K.magnifier(960, 360 + 0.95 * (100 + hl * 96 + 48), 0.6, -0.6);
        if (lt > rw) K.pill('EVERY ROW', 540, 1170, 60, C.ink, C.white, E(seg(lt, rw, rw + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + hp, 'slam', { gain: 0.3 }); cue(st + 0.05, 'slide', { dur: 0.35, gain: 0.25 }); for (let k = 0; k < 6; k++) cue(st + db + 0.3 + k * 0.2, 'tock', { gain: 0.16 });
  }

  // ── 5a · one by one, ──
  const lk = at('like', 4);
  {
    const st = cut(4), on = at('one', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 600], zoom: 0.14, note: 'close-up: rows scroll by fast with the scan highlight; CHECKED counter climbs; stopwatch spinning right; ONE BY ONE red pill',
      draw(lt, d, t) {
        bg();
        const off = 20 + lt * 9;
        K.sqlGrid(540, 330, 0.95, scanRows(off), 6, { head: ['ROW', 'NAME', 'PIZZA'], cw: [230, 260, 370], hl: Math.floor(lt * 9) % 6 });
        K.counterBox(330, 1080, 0.75, fmt(20 + lt * 9), 'CHECKED', C.white);
        K.stopwatch(800, 1080, 0.42, lt * 6);
        if (lt > on) K.pill('ONE BY ONE', 540, 200, 60, C.red, C.white, E(seg(lt, on, on + 0.25)));
      } });
    for (let k = 0; k < 8; k++) cue(st + 0.1 + k * 0.11, 'tock', { gain: 0.14 }); cue(st, 'whoosh');
  }

  // ── 5b · like flipping through every page of a book. ──
  {
    const st = lk - 0.08, fl = at('flipping', 4) - st, pg = at('page', 4) - st, bk = at('book', 4) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.1, note: 'orange notebook centre: from "flipping" its pages flip over and over fast; PAGE counter badge counts up from "page"; EVERY PAGE pill on "book"',
      draw(lt, d, t) {
        warm();
        const f = lt > fl ? ((lt - fl) * 3.2) % 1 : 0;
        K.notebook(540, 700, 1.05, 'order', 'order', 1, 1, f, 'order', 1);
        if (lt > pg) K.countBadge(880, 330, 70, Math.floor((lt - fl) * 3.2) + 1, C.red, E(seg(lt, pg, pg + 0.2)));
        if (lt > fl) K.pill('FLIPPING...', 400, 300, 60, C.ink, C.white, E(seg(lt, fl, fl + 0.25)));
        if (lt > bk) K.pill('EVERY PAGE', 540, 1150, 66, C.yellow, C.ink, E(seg(lt, bk, bk + 0.25)));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 6; k++) cue(st + fl + k / 3.2, 'slide', { dur: 0.2, gain: 0.15 }); cue(st + bk, 'thud', { gain: 0.3 });
  }

  // ── 6 · An index fixes that. ──
  {
    const st = cut(5), ix = at('index', 5) - st, th = at('that', 5) - st;
    add({ id: 'S07', at: st, cam: [540, 720], zoom: 0.1, note: 'on "index" a huge INDEX pill slams with burst; the index card drops in below; on "that" a green check',
      draw(lt, d, t) {
        bg();
        K.bookIndex(540, lerp(-700, 780, eo(seg(lt, ix, ix + 0.35))), 0.72, IDX, 7);
        if (lt > ix && lt < ix + 0.5) K.burst(540, 200, 3.4, clamp(1 - (lt - ix) * 2));
        if (lt > ix) K.pill('INDEX', 540, 200, 120, C.yellow, C.ink, lerp(1.6, 1, eo(seg(lt, ix, ix + 0.2))));
        if (lt > th) K.check(860, 1120, 0.4, E(seg(lt, th, th + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ix, 'slam', { gain: 0.4 }); cue(st + ix + 0.3, 'thud', { gain: 0.3 }); cue(st + th, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 7 · It's like the index at the back of a textbook, ──
  {
    const st = cut(6), bk = at('back', 6) - st, tb = at('textbook', 6) - st;
    const fl0 = bk - 0.1, fl1 = bk + 0.35;
    add({ id: 'S08', at: st, cam: [540, 760], zoom: 0.08, note: 'closed blue TEXTBOOK drops centre; on "back" it flips over (squash) to show the INDEX page on the back; THE BACK pill; TEXTBOOK pill on "textbook"',
      draw(lt, d, t) {
        bg();
        const f = seg(lt, fl0, fl1), sq = Math.abs(Math.cos(f * Math.PI));
        if (f < 0.5) book(540, lerp(-600, 760, eo(seg(lt, 0, 0.35))), 0.9, sq);
        else { ctx.save(); ctx.translate(540, 760); ctx.scale(sq, 1); K.bookIndex(0, 0, 0.9, IDX, 7); ctx.restore(); }
        if (lt > bk) K.pill('THE BACK', 540, 210, 66, C.ink, C.white, E(seg(lt, bk, bk + 0.25)));
        if (lt > tb) K.pill('TEXTBOOK', 540, 1200, 52, BLUE, C.white, E(seg(lt, tb, tb + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.3, 'thud', { gain: 0.3 }); cue(st + fl0, 'slide', { dur: 0.4, gain: 0.3 }); cue(st + bk, 'pop', { gain: 0.3 }); cue(st + tb, 'pop', { gain: 0.3 });
  }

  // ── 8 · a sorted list of names, ──
  {
    const st = cut(7), so = at('sorted', 7) - st, nm = at('names', 7) - st;
    add({ id: 'S09', at: st, cam: [540, 700], zoom: 0.12, note: 'index card, rows appear one after another A→Z from "sorted"; SORTED A-Z pill + yellow arrow down the left; on "names" the names flash yellow in turn',
      draw(lt, d, t) {
        bg();
        const shown = lt > so - 0.1 ? clamp((lt - so + 0.1) / 0.11, 0, 7) : 0;
        const hi = lt > nm ? Math.floor((lt - nm) * 10) % 7 : -1;
        K.bookIndex(600, 760, 0.85, IDX, shown, hi, hi >= 0 ? 1 : 0);
        if (lt > so) { line([[150, 470], [150, lerp(470, 1020, eo(seg(lt, so, so + 0.6)))]], C.yellow, 20); if (lt > so + 0.5) { ctx.beginPath(); ctx.moveTo(150, 1080); ctx.lineTo(110, 1020); ctx.lineTo(190, 1020); ctx.closePath(); ctx.fillStyle = C.yellow; ctx.fill(); } }
        if (lt > so) K.pill('SORTED A-Z', 540, 200, 66, C.yellow, C.ink, E(seg(lt, so, so + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + so, 'pop', { gain: 0.3 }); for (let k = 0; k < 7; k++) cue(st + so + k * 0.11, 'tock', { gain: 0.14 }); cue(st + nm, 'sparkle', { dur: 0.4, gain: 0.25 });
  }

  // ── 9 · each pointing to exactly where its row lives. ──
  {
    const st = cut(8), po = at('pointing', 8) - st, ex = at('exactly', 8) - st, rw = at('row', 8) - st, lv = at('lives', 8) - st;
    add({ id: 'S10', at: st, cam: [540, 700], zoom: 0.1, note: 'index card top (RAVI row highlighted on "pointing"); red arrow drops on "exactly" to a one-row table (ROW 7,104,221 | RAVI | VEGGIE) which highlights on "row"; check on "lives"',
      draw(lt, d, t) {
        bg();
        K.bookIndex(540, 520, 0.62, IDX, 7, lt > po ? 4 : -1, E(seg(lt, po, po + 0.25)));
        if (lt > ex) { const u = eo(seg(lt, ex, ex + 0.35)); K.arrow(540, lerp(800, 880, u), lerp(60, 180, u), Math.PI / 2, u); }
        if (lt > ex + 0.15) K.sqlGrid(540, lerp(1600, 990, eo(seg(lt, ex + 0.15, ex + 0.45))), 0.85, [['7,104,221', 'RAVI', 'VEGGIE']], 1, { head: ['ROW', 'NAME', 'PIZZA'], cw: [300, 230, 330], hl: lt > rw ? 0 : -1 });
        if (lt > lv) { K.check(930, 1050, 0.3, E(seg(lt, lv, lv + 0.25))); K.burst(930, 1050, 2, clamp(1 - (lt - lv) * 2)); }
        if (lt > po) K.pill('POINTS TO', 540, 140, 56, C.ink, C.white, E(seg(lt, po, po + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + po, 'pop', { gain: 0.3 }); cue(st + ex, 'zip', { gain: 0.3 }); cue(st + ex + 0.4, 'thud', { gain: 0.3 }); cue(st + lv, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 10 · Databases keep it as a tree, ──
  {
    const st = cut(9), kp = at('keep', 9) - st, tr = at('tree', 9) - st;
    add({ id: 'S11', at: st, cam: [540, 650], zoom: 0.1, note: 'database small at bottom-left; the tree is revealed top-down from "keep": root, 3 branches, 9 leaves; A TREE yellow pill on "tree"',
      draw(lt, d, t) {
        bg();
        K.database(150, 1110, 0.35, 0, 'DB');
        ctx.save(); const g = seg(lt, kp - 0.2, tr + 0.2);
        ctx.beginPath(); ctx.rect(-300, 0, 1680, lerp(460, 1250, eo(g))); ctx.clip();
        K.bTree(540, 400, 1, 0, E(seg(lt, 0, 0.3)));
        ctx.restore();
        if (lt > tr) K.pill('A TREE', 540, 190, 76, C.yellow, C.ink, lerp(1.5, 1, eo(seg(lt, tr, tr + 0.2))));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'pop', { gain: 0.3 }); cue(st + kp, 'slide', { dur: 0.6, gain: 0.2 }); cue(st + tr, 'pop', { gain: 0.35 });
  }

  // ── 11 · so even ten million rows take just a few hops. ──
  {
    const st = cut(10), ro = at('rows', 10) - st, ju = at('just', 10) - st, ho = at('hops', 10) - st;
    add({ id: 'S12', at: st, cam: [540, 700], zoom: 0.12, note: 'tree; 10,000,000 ROWS pill top on "rows"; from "just" a red dot hops root → R-Z → R (nodes turn yellow), HOPS badge counts 1-2-3; RAVI FOUND pill + check after "hops"',
      draw(lt, d, t) {
        bg();
        const p = lt < ju ? 0 : lerp(0.01, 3, clamp((lt - ju) / Math.max(0.6, ho - ju + 0.25)));
        K.bTree(540, 400, 1, p);
        if (lt > ro) K.pill('10,000,000 ROWS', 540, 190, 56, C.ink, C.white, E(seg(lt, ro, ro + 0.25)));
        if (p > 0) K.countBadge(930, 400, 64, Math.min(3, Math.floor(p) + 1), C.red, E(seg(lt, ju, ju + 0.2)));
        if (p >= 3) { K.pill('RAVI FOUND', 540, 1150, 60, GREEN, C.white, E(seg(lt, ho + 0.2, ho + 0.45))); K.check(740, 1030, 0.28, E(seg(lt, ho + 0.2, ho + 0.45))); }
      } });
    cue(st, 'whoosh'); cue(st + ro, 'pop', { gain: 0.3 }); cue(st + ju, 'boing', { gain: 0.2 }); cue(st + ju + 0.35, 'boing', { gain: 0.2 }); cue(st + ho, 'sparkle', { dur: 0.5, gain: 0.3 });
  }

  // ── 12 · But there's a catch. Every new order has to update the index too, ──
  {
    const st = cut(11), ca = at('catch', 11) - st, l12 = L(12) - 0.08 - st, or = at('order', 12) - st, up = at('update', 12) - st, to = at('too', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 720], zoom: 0.08, note: 'red warning triangle + THE CATCH pill; then (line 12) database left and index card right; a new ticket drops into the database on "order", then a copy flies into the index on "update" (new RIA row flashes); TWO WRITES pill on "too"',
      draw(lt, d, t) {
        bg();
        if (lt < l12) {
          K.warning(540, 700, E(seg(lt, 0.05, 0.35)) * 1.4);
          if (lt > ca) K.pill('THE CATCH', 540, 1100, 70, C.red, C.white, E(seg(lt, ca, ca + 0.25)));
          return;
        }
        const k = lt - l12;
        K.database(290, 820, 0.62, lt > or + 0.3 ? 0.5 : 0, 'ORDERS');
        const done = lt > up + 0.35;
        K.bookIndex(800, 780, 0.5, done ? [...IDX.slice(0, 4), ['RAVI', 'ROW 7,104,221'], ['RIA', 'NEW!'], IDX[5]] : IDX, 7, done ? 5 : -1, 1);
        if (k < 0.25 + Math.max(0, or - l12 - 0.3)) K.ticket(540, 250, 0.55 * E(seg(k, 0, 0.2)), 0);
        if (lt > or - 0.3 && lt < or + 0.3) { const u = eio(seg(lt, or - 0.3, or + 0.3)); K.ticket(lerp(540, 290, u), lerp(250, 650, u), 0.55, 0.3 * (1 - u)); }
        if (lt > up - 0.25 && lt < up + 0.35) { const u = eio(seg(lt, up - 0.25, up + 0.35)); K.ticket(lerp(540, 800, u), lerp(250, 640, u), 0.55, -0.3 * (1 - u)); }
        if (lt > or + 0.25) K.check(290, 470, 0.25, E(seg(lt, or + 0.25, or + 0.45)));
        if (done) K.check(800, 470, 0.25, E(seg(lt, up + 0.35, up + 0.55)));
        if (lt > to) K.pill('TWO WRITES', 540, 1190, 64, C.yellow, C.ink, E(seg(lt, to, to + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slam', { gain: 0.3 }); cue(st + l12, 'whoosh'); cue(st + or, 'thud', { gain: 0.3 }); cue(st + up + 0.3, 'thud', { gain: 0.3 }); cue(st + to, 'pop', { gain: 0.35 });
  }

  // ── 13 · so writes get slower. ──
  {
    const st = cut(13), wr = at('writes', 13) - st, sl = at('slower', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.1, note: 'a snail crawls left→right carrying an order ticket; WRITES pill on "writes"; on "slower" SLOWER red pill + stopwatch hand spins faster',
      draw(lt, d, t) {
        warm();
        const x = lerp(260, 520, lt / d);
        K.slowSnail(x, 860, 1.6, t);
        K.ticket(x - 30, 680, 0.55, Math.sin(lt * 4) * 0.08);
        if (lt > wr) K.pill('WRITES', 540, 300, 72, C.ink, C.white, E(seg(lt, wr, wr + 0.25)));
        K.stopwatch(880, 640, 0.32, lt * (lt > sl ? 9 : 2));
        if (lt > sl) K.pill('SLOWER', 540, 1140, 76, C.red, C.white, lerp(1.4, 1, eo(seg(lt, sl, sl + 0.2))));
      } });
    cue(st, 'whoosh'); cue(st + wr, 'pop', { gain: 0.3 }); cue(st + sl, 'boing', { gain: 0.3 });
  }

  // ── 14 · Index what you search, not everything. ──
  {
    const st = cut(14), ix = at('index', 14) - st, se = at('search', 14) - st, ev = at('everything', 14) - st;
    add({ id: 'S15', at: st, cam: [540, 740], zoom: 0.08, note: 'NAME column pill left with an index cabinet dropping under it + magnifier + green check on "search"; on "everything" a pile of four cabinets drops at right and a red X slams over it',
      draw(lt, d, t) {
        bg();
        K.pill('NAME', 300, 420, 64, BLUE, C.white, E(seg(lt, 0, 0.25)));
        K.magnifier(430, 330, 0.55 * E(seg(lt, ix, ix + 0.25)), -0.6);
        K.indexCabinet(300, lerp(-500, 800, eo(seg(lt, ix, ix + 0.35))), 0.55);
        if (lt > se) K.check(300, 1110, 0.3, E(seg(lt, se, se + 0.25)));
        if (lt > se) K.pill('SEARCHED', 300, 250, 50, GREEN, C.white, E(seg(lt, se, se + 0.25)));
        if (lt > ev - 0.3) for (let k = 0; k < 4; k++) { const a = ev - 0.3 + k * 0.08; K.indexCabinet(790 + (k % 2 ? 40 : -40), lerp(-500, 1000 - k * 190, eo(seg(lt, a, a + 0.3))), 0.3); }
        if (lt > ev) K.redX(790, 720, 0.6, E(seg(lt, ev + 0.15, ev + 0.35)));
        if (lt > ev) K.pill('NOT ALL', 790, 250, 50, C.red, C.white, E(seg(lt, ev, ev + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ix + 0.3, 'thud', { gain: 0.3 }); cue(st + se, 'sparkle', { dur: 0.3, gain: 0.25 }); for (let k = 0; k < 4; k++) cue(st + ev - 0.05 + k * 0.08, 'thud', { gain: 0.15 }); cue(st + ev + 0.15, 'slam', { gain: 0.35 });
  }

  // ── 15 · Tomorrow: replication. ──
  {
    const st = cut(15), to = at('tomorrow', 15) - st, rp = at('replication', 15) - st;
    add({ id: 'S16', at: st, cam: [540, 700], zoom: 0.03, note: 'waiter winks + points, DAY 9 / 30 pill; ORDERS database drops right on "tomorrow"; on "replication" two COPY databases slide out beneath it; NEXT: REPLICATION pill',
      draw(lt, d, t) {
        bg();
        waiter({ x: 260, y: 1120, s: 0.72, arm: K.ARM.point, finger: Math.sin(lt * 9) * 0.25, eyes: lt < rp ? 'wink' : 'wide', mouth: 'smirk', smirk: true, brow: 0.6 });
        K.pill('DAY 9 / 30', 540, 170, 64, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        if (lt > rp) for (let k = 0; k < 2; k++) { const u = eo(seg(lt, rp + k * 0.12, rp + 0.4 + k * 0.12)); K.database(lerp(780, k ? 920 : 640, u), lerp(560, 900, u), 0.32, 0, 'COPY'); }
        if (lt > to) K.database(780, lerp(-300, 560, eo(seg(lt, to, to + 0.35))), 0.42, lt > rp ? 0.5 : 0, 'ORDERS');
        if (lt > rp) K.pill('NEXT: REPLICATION', 540, 300, 50, C.ink, C.white, E(seg(lt, rp, rp + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + to + 0.3, 'thud', { gain: 0.3 }); cue(st + rp, 'slide', { dur: 0.4, gain: 0.3 }); cue(st + rp + 0.1, 'pop', { gain: 0.35 });
  }

  return { shots: S, cues: CUES };
}
