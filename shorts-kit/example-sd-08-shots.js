// (8/30) SQL VS NOSQL: the shot list. Pizza-chain analogy, continuing from day 7 (branches everywhere = CDN):
// all those branches need somewhere to write down every order. Way 1: a strict ORDER FORM with the same boxes every
// time (name, pizza, size) → neat rows = SQL, a table with a fixed shape (schema); great for payments where the
// numbers must add up. Way 2: a NOTEBOOK where every page can look different (a photo here, a toppings list there)
// = NoSQL: flexible, and easy to spread across lots of servers. Discord stores trillions of messages that way.
// Which wins? Neither: big apps use both. Tease: database indexing.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const GREEN = '#5BAE6A', BLUE = '#3A7BD5', ORANGE = '#F29A3A';
const bg = (ring = '#CFE8F3', base = C.sky) => { fillAll(base); circle(540, 740, 560, ring); };
const warm = () => bg('#F7E3C8', C.bg);
const waiter = (o) => { K.man(o); K.bowtie(o.x, o.y, o.s); };
const MX = 540, MY = 700, MW = 980, MH = 560;
const city = (c) => K.mapXY(MX, MY, MW, MH, c);
const paper = () => { fillAll(C.bg); circle(540, 740, 600, '#EDE6D6'); };
const ROWS = [['ASHA', 'PEPPERONI', 'LARGE'], ['RAVI', 'MARGHERITA', 'SMALL'], ['MEERA', 'VEGGIE', 'MEDIUM'], ['SAM', 'PEPPERONI', 'LARGE']];

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const at = (w, i) => Wd(w, i);

  // ── 1 · Yesterday we opened branches everywhere, ──
  {
    const st = cut(0), ye = at('yesterday', 0) - st, br = at('branches', 0) - st, ev = at('everywhere', 0) - st;
    const spots = ['ny', 'london', 'tokyo', 'sao', 'mumbai', 'sydney', 'la', 'lagos'];
    add({ id: 'S01', at: st, cam: [540, 700], zoom: 0.08, note: 'DAY 8 / 30 pill; YESTERDAY: CDN pill; world map; branch shops pop up city by city from "branches"',
      draw(lt, d, t) {
        paper();
        K.flatMap(MX, MY, MW, MH, E(seg(lt, 0, 0.3)));
        spots.forEach((c, k) => { const [x, y] = city(c); const a = br + k * 0.1; K.branchShop(x, y + 30, 0.34 * E(seg(lt, a, a + 0.25)), 1, k % 2 ? BLUE : C.red); });
        K.pill('DAY 8 / 30', 540, 170, 64, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        if (lt > ye) K.pill('YESTERDAY: CDN', 540, 290, 44, C.ink, C.white, E(seg(lt, ye, ye + 0.25)));
        if (lt > ev) K.pill('EVERYWHERE', 540, 1140, 60, C.yellow, C.ink, E(seg(lt, ev, ev + 0.25)));
      } });
    cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + ye, 'pop', { gain: 0.3 }); for (let k = 0; k < 8; k++) cue(st + br + k * 0.1 + 0.1, 'pop', { gain: 0.18 }); cue(st + ev, 'sparkle', { dur: 0.4, gain: 0.25 });
  }

  // ── 2 · but where do we write down every order? ──
  {
    const st = cut(1), wh = at('where', 1) - st, dn = at('down', 1) - st, or = at('order', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 760], zoom: 0.1, note: 'waiter centre, order tickets rain down around him from "down"; red ? above head on "where"; ORDERS badge counts up; on "order" the waiter goes wide-eyed',
      draw(lt, d, t) {
        warm();
        const shock = lt > or;
        waiter({ x: 540, y: 1000, s: 0.62, arm: K.ARM.hip, eyes: shock ? 'wide' : 'n', mouth: shock ? 'o' : 'flat', brow: shock ? 1 : 0.5, look: 0 });
        for (let k = 0; k < 10; k++) {
          const a = dn + k * 0.12; if (lt < a) continue;
          const side = k % 2 ? 1 : -1, x = 540 + side * (230 + rnd(k) * 160), y0 = lerp(-150, 520 + rnd(k + 3) * 520, eo(seg(lt, a, a + 0.45)));
          K.ticket(x, y0, 0.55, (rnd(k + 7) - 0.5) * 0.8);
        }
        if (lt > wh) bigText('?', 540, 280, 170, C.red, Math.sin(lt * 6) * 0.1, E(seg(lt, wh, wh + 0.25)));
        if (lt > dn) K.countBadge(860, 260, 70, Math.min(10, Math.floor((lt - dn) / 0.12) + 1), C.red, E(seg(lt, dn, dn + 0.2)));
        if (lt > or) K.pill('EVERY ORDER', 540, 1200, 60, C.ink, C.white, E(seg(lt, or, or + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + wh, 'boing', { gain: 0.25 }); for (let k = 0; k < 10; k += 2) cue(st + dn + k * 0.12 + 0.35, 'thud', { gain: 0.15 }); cue(st + or, 'pop', { gain: 0.35 });
  }

  // ── 3 · One way is a strict order form, ──
  {
    const st = cut(2), wy = at('way', 2) - st, sr = at('strict', 2) - st, fo = at('form', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 720], zoom: 0.1, note: 'WAY 1 pill on "way"; ORDER FORM card drops in centre on "order"; STRICT red pill + red rule lines around the boxes on "strict"',
      draw(lt, d, t) {
        bg();
        const fy = lerp(-500, 740, eo(seg(lt, sr - 0.2, sr + 0.25)));
        K.orderForm(540, fy, 1.15, [0, 0, 0]);
        if (lt > wy) K.pill('WAY 1', 540, 170, 66, C.yellow, C.ink, E(seg(lt, wy, wy + 0.25)));
        if (lt > sr) K.pill('STRICT', 540, 1190, 66, C.red, C.white, E(seg(lt, sr, sr + 0.25)));
        if (lt > fo) { K.burst(900, 170, 2.0, clamp(1 - (lt - fo) * 2)); K.check(900, 180, 0.26, E(seg(lt, fo, fo + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + wy, 'pop', { gain: 0.35 }); cue(st + sr + 0.2, 'thud', { gain: 0.35 }); cue(st + sr, 'pop', { gain: 0.3 }); cue(st + fo, 'slam', { gain: 0.25 });
  }

  // ── 4 · with the same boxes every single time. ──
  {
    const st = cut(3), sa = at('same', 3) - st, bx = at('boxes', 3) - st, ti = at('time', 3) - st;
    const XS = [195, 540, 885];
    add({ id: 'S04', at: st, cam: [540, 740], zoom: 0.08, note: 'three order forms slide in side by side, each filled with a different order; on "boxes" the matching boxes glow yellow across all three; SAME BOXES pill; on "time" a stamp of checks',
      draw(lt, d, t) {
        bg();
        XS.forEach((x, k) => {
          const a = k * 0.18, u = eo(seg(lt, a, a + 0.4));
          if (lt > bx) { ctx.save(); ctx.globalAlpha = 0.5 * E(seg(lt, bx, bx + 0.3)); for (let b = 0; b < 3; b++) { rr(x - 0.62 * 226, 760 + 0.62 * (-160 + b * 150 + 16), 0.62 * 452, 0.62 * 96, 12); ctx.fillStyle = C.yellow; ctx.fill(); } ctx.restore(); }
          K.orderForm(lerp(x + 900, x, u), 760, 0.62, [1, 1, 1], 0, ROWS[k]);
        });
        if (lt > sa) K.pill('SAME BOXES', 540, 300, 70, C.yellow, C.ink, E(seg(lt, sa, sa + 0.25)));
        if (lt > ti) XS.forEach((x, k) => K.check(x, 1150, 0.28, E(seg(lt, ti + k * 0.1, ti + k * 0.1 + 0.25))));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 3; k++) cue(st + k * 0.18, 'slide', { dur: 0.3, gain: 0.18 }); cue(st + sa, 'pop', { gain: 0.35 }); cue(st + bx, 'sparkle', { dur: 0.4, gain: 0.25 }); for (let k = 0; k < 3; k++) cue(st + ti + k * 0.1, 'pop', { gain: 0.22 });
  }

  // ── 5 · Name, pizza, size, all in neat rows. ──
  {
    const st = cut(4), nm = at('name', 4) - st, pz = at('pizza', 4) - st, sz = at('size', 4) - st, ro = at('rows', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 700], zoom: 0.08, note: 'empty table with NAME | PIZZA | SIZE columns; each header word pops yellow on its word; on "rows" four rows fill in one by one; ROWS pill',
      draw(lt, d, t) {
        bg();
        const shown = lt > ro - 0.2 ? clamp((lt - (ro - 0.2)) / 0.18, 0, 4) : 0;
        K.sqlGrid(540, 440, 1.08, ROWS, shown);
        [[nm, -310], [pz, -40], [sz, 270]].forEach(([w, dx], k) => { if (lt > w && lt < w + 0.6) K.burst(540 + dx * 1.08, 400, 1.8, clamp(1 - (lt - w) * 1.7)); });
        const hk = lt > sz ? 'SIZE' : lt > pz ? 'PIZZA' : lt > nm ? 'NAME' : null;
        if (hk && lt < ro) K.pill(hk, 540, 1100, 80, C.yellow, C.ink, lerp(1.3, 1, eo(seg(lt, lt > sz ? sz : lt > pz ? pz : nm, (lt > sz ? sz : lt > pz ? pz : nm) + 0.15))));
        if (lt > ro) K.pill('NEAT ROWS', 540, 1100, 70, C.ink, C.white, E(seg(lt, ro, ro + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + nm, 'pop', { gain: 0.3 }); cue(st + pz, 'pop', { gain: 0.3 }); cue(st + sz, 'pop', { gain: 0.3 }); for (let k = 0; k < 4; k++) cue(st + ro - 0.2 + k * 0.18 + 0.1, 'tock', { gain: 0.25 });
  }

  // ── 6 · That's SQL, a table with a fixed shape, ──
  {
    const st = cut(5), sq = at('sql', 5) - st, ta = at('table', 5) - st, sh = at('shape', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.1, note: 'SQL database cylinder left-top; on "SQL" huge SQL pill + burst; the full table slides up beneath on "table"; on "shape" a padlock badge locks the header + FIXED SHAPE pill',
      draw(lt, d, t) {
        bg();
        K.database(540, lerp(-300, 470, eo(seg(lt, 0, 0.35))), 0.75, lt > sq ? 0.6 : 0, 'SQL');
        if (lt > ta) K.sqlGrid(540, lerp(1500, 720, eo(seg(lt, ta, ta + 0.35))), 0.85, ROWS, 4, { lock: lt > sh ? E(seg(lt, sh, sh + 0.25)) : 0 });
        if (lt > sq && lt < sq + 0.5) K.burst(540, 180, 3.2, clamp(1 - (lt - sq) * 2));
        if (lt > sq) K.pill('SQL', 540, 180, 120, C.yellow, C.ink, lerp(1.6, 1, eo(seg(lt, sq, sq + 0.2))));
        if (lt > sh) K.pill('FIXED SHAPE', 540, 1200, 58, C.ink, C.white, E(seg(lt, sh, sh + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.3, 'thud', { gain: 0.3 }); cue(st + sq, 'slam', { gain: 0.4 }); cue(st + ta, 'slide', { dur: 0.35, gain: 0.25 }); cue(st + sh, 'thud', { gain: 0.35 });
  }

  // ── 7 · great for payments, where every number must add up. ──
  {
    const st = cut(6), pa = at('payments', 6) - st, nu = at('number', 6) - st, up = at('up', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 760], zoom: 0.08, note: 'cash stack drops on "payments" + PAYMENTS pill; a payments table fills row by row from "number"; on "up" the TOTAL row highlights + big check',
      draw(lt, d, t) {
        bg();
        K.cash(540, lerp(-200, 330, eo(seg(lt, 0, 0.35))), 0.75, 5);
        const rows = [['ASHA', '+ 500'], ['RAVI', '+ 300'], ['REFUND', '- 100'], ['TOTAL', '= 700', 'hash']];
        if (lt > nu - 0.1) K.dbTable(540, 520, 0.95, rows, clamp((lt - (nu - 0.1)) / 0.25, 0, 4), ['PAYMENT', 'AMOUNT']);
        if (lt > pa) K.pill('PAYMENTS', 540, 150, 70, C.yellow, C.ink, E(seg(lt, pa, pa + 0.25)));
        if (lt > up) { K.check(860, 1050, 0.36, E(seg(lt, up, up + 0.25))); K.pill('ADDS UP', 450, 1170, 60, GREEN, C.white, E(seg(lt, up, up + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + 0.3, 'thud', { gain: 0.3 }); cue(st + pa, 'pop', { gain: 0.3 }); for (let k = 0; k < 4; k++) cue(st + nu - 0.1 + k * 0.25 + 0.1, 'tock', { gain: 0.22 }); cue(st + up, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 8 · The other way is a notebook, ──
  {
    const st = cut(7), ot = at('other', 7) - st, nb = at('notebook', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 760], zoom: 0.1, note: 'the order form slides off left; WAY 2 pill on "other"; on "notebook" an orange spiral notebook drops in open (blank pages) + NOTEBOOK pill',
      draw(lt, d, t) {
        bg();
        K.orderForm(lerp(540, -500, eio(seg(lt, ot, ot + 0.4))), 760, 0.9, [1, 1, 1], -0.1 * seg(lt, ot, ot + 0.4));
        if (lt > nb - 0.15) K.notebook(540, lerp(-500, 760, eo(seg(lt, nb - 0.15, nb + 0.25))), 1.1, 'blank', 'blank');
        if (lt > ot) K.pill('WAY 2', 540, 170, 66, C.yellow, C.ink, E(seg(lt, ot, ot + 0.25)));
        if (lt > nb) K.pill('NOTEBOOK', 540, 1180, 66, ORANGE, C.white, E(seg(lt, nb, nb + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ot, 'zip', { gain: 0.25 }); cue(st + ot, 'pop', { gain: 0.3 }); cue(st + nb + 0.1, 'thud', { gain: 0.35 });
  }

  // ── 9 · where every page can look different, ──
  {
    const st = cut(8), pg = at('page', 8) - st, di = at('different', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 740], zoom: 0.12, note: 'open notebook; on "page" the left page writes a plain order; on "different" the right page fills with a chat-like note + DIFFERENT pill + boing',
      draw(lt, d, t) {
        bg();
        K.notebook(540, 760, 1.1, 'order', 'chat', E(seg(lt, pg, pg + 0.3)), lt > di ? E(seg(lt, di, di + 0.3)) : 0);
        if (lt > pg) K.pill('EVERY PAGE', 540, 230, 60, C.ink, C.white, E(seg(lt, pg, pg + 0.25)));
        if (lt > di) K.pill('DIFFERENT', 540, 1180, 72, C.yellow, C.ink, E(seg(lt, di, di + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + pg, 'pop', { gain: 0.3 }); cue(st + di, 'boing', { gain: 0.3 });
  }

  // ── 10 · photos on one page, extra toppings on the next. ──
  {
    const st = cut(9), ph = at('photos', 9) - st, tp = at('toppings', 9) - st, nx = at('next', 9) - st;
    const fl = tp - 0.35;
    add({ id: 'S10', at: st, cam: [600, 760], zoom: 0.14, note: 'notebook: right page gets a photo on "photos" (PHOTO pill); just before "toppings" the page flips and the new right page lists toppings with coloured dots (TOPPINGS pill)',
      draw(lt, d, t) {
        bg();
        const f = seg(lt, fl, fl + 0.35);
        K.notebook(540, 760, 1.1, f >= 0.5 ? 'photo' : 'order', 'photo', 1, E(seg(lt, ph, ph + 0.3)), f > 0 && f < 1 ? f : 0, 'toppings', 0);
        if (f >= 1) K.notebook(540, 760, 1.1, 'photo', 'toppings', 1, E(seg(lt, tp, tp + 0.35)));
        if (lt > ph && lt < fl + 0.2) K.pill('PHOTO', 760, 300, 64, BLUE, C.white, E(seg(lt, ph, ph + 0.25)));
        if (lt > tp) K.pill('TOPPINGS', 760, 300, 64, C.yellow, C.ink, E(seg(lt, tp, tp + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ph, 'pop', { gain: 0.35 }); cue(st + fl, 'slide', { dur: 0.35, gain: 0.25 }); cue(st + tp, 'pop', { gain: 0.35 }); cue(st + nx, 'sparkle', { dur: 0.3, gain: 0.2 });
  }

  // ── 11 · That's NoSQL, flexible, ──
  {
    const st = cut(10), ns = at('nosql', 10) - st, fx = at('flexible', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.1, note: 'NOSQL database centre; on "NoSQL" big NOSQL pill + burst; document pages of different heights orbit it; on "flexible" they stretch and squash, FLEXIBLE yellow pill',
      draw(lt, d, t) {
        bg();
        K.database(540, lerp(-300, 800, eo(seg(lt, 0, 0.35))), 0.8, lt > ns ? 0.6 : 0, 'NOSQL');
        for (let k = 0; k < 6; k++) {
          const a = k * Math.PI / 3 + lt * 0.6, wob = lt > fx ? 1 + Math.sin(lt * 9 + k) * 0.18 * E(seg(lt, fx, fx + 0.3)) : 1;
          ctx.save(); ctx.translate(540 + Math.cos(a) * 400, 760 + Math.sin(a) * 350); ctx.scale(1 / wob, wob);
          K.docPage(0, 0, 0.7 * E(seg(lt, 0.15 + k * 0.06, 0.4 + k * 0.06)), [1, 4, 2, 5, 3, 2][k], K.DOC_COLS[k], 0);
          ctx.restore();
        }
        if (lt > ns && lt < ns + 0.5) K.burst(540, 200, 3.2, clamp(1 - (lt - ns) * 2));
        if (lt > ns) K.pill('NOSQL', 540, 200, 110, C.yellow, C.ink, lerp(1.6, 1, eo(seg(lt, ns, ns + 0.2))));
        if (lt > fx) K.pill('FLEXIBLE', 540, 1210, 66, ORANGE, C.white, E(seg(lt, fx, fx + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.3, 'thud', { gain: 0.3 }); cue(st + ns, 'slam', { gain: 0.4 }); cue(st + fx, 'boing', { gain: 0.3 });
  }

  // ── 12 · and easy to spread across lots of servers. ──
  {
    const st = cut(11), sp = at('spread', 11) - st, lo = at('lots', 11) - st;
    const SV = [[200, 560], [540, 500], [880, 560], [200, 1000], [540, 1060], [880, 1000]];
    add({ id: 'S12', at: st, cam: [540, 780], zoom: 0.08, note: 'NOSQL database centre; on "spread" document pages fly out to six servers around it; servers pop in from "lots" and glow when a page lands; LOTS OF SERVERS pill',
      draw(lt, d, t) {
        bg();
        SV.forEach(([x, y], k) => K.edgeServer(x, y, 0.85 * E(seg(lt, 0.05 + k * 0.06, 0.3 + k * 0.06)), t, lt > sp + 0.5 + k * 0.06 ? 0.35 : 0, k % 2 ? GREEN : BLUE));
        K.database(540, 790, 0.5, 0, 'NOSQL');
        SV.forEach(([x, y], k) => { const a = sp + k * 0.06; if (lt < a) return; const u = eio(seg(lt, a, a + 0.5)); const [px, py] = K.arcAt(540, 760, x, y - 140, 120, u); K.docPage(px, py, 0.45, [1, 4, 2, 5, 3, 2][k], K.DOC_COLS[k], (1 - u) * 0.5); });
        if (lt > sp) K.pill('SPREAD OUT', 540, 230, 62, C.ink, C.white, E(seg(lt, sp, sp + 0.25)));
        if (lt > lo) K.pill('LOTS OF SERVERS', 540, 1230, 58, C.yellow, C.ink, E(seg(lt, lo, lo + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sp, 'slide', { dur: 0.6, gain: 0.3 }); for (let k = 0; k < 6; k++) cue(st + 0.15 + k * 0.06, 'pop', { gain: 0.15 }); cue(st + lo, 'sparkle', { dur: 0.4, gain: 0.25 });
  }

  // ── 13 · Discord stores trillions of messages like this. ──
  {
    const st = cut(12), dc = at('discord', 12) - st, tr = at('trillions', 12) - st, me = at('messages', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 760], zoom: 0.1, note: 'phone left with a chat app, bubbles popping; DISCORD pill on "Discord"; from "messages" chat bubbles stream into a NOSQL database right; TRILLIONS yellow pill on "trillions"',
      draw(lt, d, t) {
        bg();
        const msgs = [['pizza tonight?', false, E(seg(lt, 0.1, 0.35))], ['yes!!', true, E(seg(lt, 0.4, 0.65))], ['pepperoni', false, E(seg(lt, 0.7, 0.95))]];
        K.phone(250, 780, 0.75, () => K.chatApp(msgs, '', t));
        K.database(820, 820, 0.6, lt > me ? 0.4 : 0, 'NOSQL');
        if (lt > me) for (let k = 0; k < 5; k++) { const q = (lt - me) * 1.8 - k * 0.22; if (q < 0) continue; const u = q % 1; const [x, y] = K.arcAt(420, 640, 800, 640, 140, u); rr(x - 50, y - 26, 100, 52, 26); ctx.fillStyle = k % 2 ? '#CFEFD6' : C.white; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.stroke(); }
        if (lt > dc) K.pill('DISCORD', 540, 200, 70, '#5865F2', C.white, E(seg(lt, dc, dc + 0.25)));
        if (lt > tr) K.pill('TRILLIONS', 540, 1220, 76, C.yellow, C.ink, lerp(1.5, 1, eo(seg(lt, tr, tr + 0.2))));
      } });
    cue(st, 'whoosh'); cue(st + 0.15, 'pop', { gain: 0.2 }); cue(st + 0.45, 'pop', { gain: 0.2 }); cue(st + 0.75, 'pop', { gain: 0.2 }); cue(st + dc, 'pop', { gain: 0.3 }); cue(st + tr, 'slam', { gain: 0.35 }); cue(st + me, 'slide', { dur: 1, gain: 0.2 });
  }

  // ── 14 · So which one wins? Neither. Big apps use both. ──
  {
    const st = cut(13), wi = at('wins', 13) - st, ne = at('neither', 13) - st, bo = at('both', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.08, note: 'SQL (left) vs NOSQL (right) databases with a red VS; on "wins" a crown wobbles between them; on "neither" red X over the crown; on "both" a cable joins them, checks on both, BOTH pill; waiter grins',
      draw(lt, d, t) {
        bg();
        const both = lt > bo;
        if (both) line([[300, 640], [780, 640]], GREEN, 22 * E(seg(lt, bo, bo + 0.3)));
        K.database(260, 640, 0.6, both ? 0.5 : 0, 'SQL');
        K.database(820, 640, 0.6, both ? 0.5 : 0, 'NOSQL');
        if (!both) bigText('VS', 540, 660, 110, C.red, 0, E(seg(lt, 0, 0.25)));
        if (lt > wi - 0.1 && lt < bo) {
          const cx = 540 + Math.sin(lt * 5) * 200, cy = 330;
          ctx.save(); ctx.translate(cx, cy); ctx.scale(E(seg(lt, wi - 0.1, wi + 0.2)), E(seg(lt, wi - 0.1, wi + 0.2)));
          ctx.beginPath(); ctx.moveTo(-90, 50); ctx.lineTo(-100, -50); ctx.lineTo(-45, 0); ctx.lineTo(0, -70); ctx.lineTo(45, 0); ctx.lineTo(100, -50); ctx.lineTo(90, 50); ctx.closePath();
          ctx.fillStyle = C.yellow; ctx.fill(); ctx.lineWidth = 10; ctx.lineJoin = 'round'; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.restore();
          if (lt > ne) K.redX(cx, cy, 0.4, E(seg(lt, ne, ne + 0.2)));
        }
        if (both) { K.check(260, 380, 0.3, E(seg(lt, bo, bo + 0.25))); K.check(820, 380, 0.3, E(seg(lt, bo + 0.08, bo + 0.33))); }
        waiter({ x: 540, y: 1180, s: 0.42, arm: both ? K.ARM.wave : K.ARM.hip, eyes: 'n', mouth: both ? 'grin' : lt > ne ? 'smirk' : 'o', brow: 0.6, look: 0 });
        if (both) K.pill('BOTH', 540, 180, 90, C.yellow, C.ink, lerp(1.5, 1, eo(seg(lt, bo, bo + 0.2))));
      } });
    cue(st, 'whoosh'); cue(st + wi, 'pop', { gain: 0.3 }); cue(st + ne, 'slam', { gain: 0.35 }); cue(st + bo, 'sparkle', { dur: 0.5, gain: 0.3 });
  }

  // ── 15 · Tomorrow: database indexing. ──
  {
    const st = cut(14), to = at('tomorrow', 14) - st, ix = at('indexing', 14) - st;
    add({ id: 'S15', at: st, cam: [540, 700], zoom: 0.03, note: 'waiter winks + points with DAY 8 / 30 pill; on "tomorrow" a database drops right; on "indexing" an INDEX cabinet drops beside it with drawer sliding open; NEXT: INDEXING pill',
      draw(lt, d, t) {
        bg();
        waiter({ x: 300, y: 1120, s: 0.75, arm: K.ARM.point, finger: Math.sin(lt * 9) * 0.25, eyes: lt < ix ? 'wink' : 'wide', mouth: 'smirk', smirk: true, brow: 0.6 });
        K.pill('DAY 8 / 30', 540, 170, 64, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        if (lt > to) K.database(800, lerp(-300, 470, eo(seg(lt, to, to + 0.35))), 0.55, 0, 'DATABASE');
        if (lt > ix - 0.1) K.indexCabinet(800, lerp(-400, 900, eo(seg(lt, ix - 0.1, ix + 0.25))), 0.5, eo(seg(lt, ix + 0.3, ix + 0.6)));
        if (lt > ix) K.pill('NEXT: INDEXING', 540, 1230, 56, C.ink, C.white, E(seg(lt, ix, ix + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + to + 0.3, 'thud', { gain: 0.3 }); cue(st + ix + 0.2, 'thud', { gain: 0.3 }); cue(st + ix, 'pop', { gain: 0.35 });
  }

  return { shots: S, cues: CUES };
}
