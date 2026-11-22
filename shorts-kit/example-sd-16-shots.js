// (16/30) WHAT IS A MESSAGE QUEUE: the shot list. Restaurant analogy (same kitchen as the earlier days):
// a million people tap BUY at the same second → picture a busy Friday night restaurant. If every waiter had to stand
// and wait for the chef to finish, the place would freeze. So waiters clip their orders onto a rail and walk back to
// the tables; cooks grab tickets one by one, in order. That rail = a message queue. In an app: one service drops in a
// message ("send receipt") and moves on; workers pull messages when free; a crashed worker → the message waits, nothing
// lost; a rush → the queue gets longer, nothing breaks. Loop: don't wait on the chef, leave a ticket. Tease: pub/sub.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T, lineWords } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const GREEN = '#5BAE6A', BLUE = '#3A7BD5', ORANGE = '#F29A3A', PURPLE = '#8A63D2';
const MCOL = [C.yellow, GREEN, ORANGE, C.pink, BLUE, PURPLE];
const bg = (ring = '#CFE8F3', base = C.sky) => { fillAll(base); circle(540, 740, 560, ring); };
const waiter = (o) => { K.man(o); K.bowtie(o.x, o.y, o.s); };
const cook = (o) => { K.man(o); K.chefHat(o.x, o.y, o.s, o.hat ?? 1); };
const RAIL_Y = 380, slotX = (k) => 880 - k * 170;   // rail slots: slot 0 = the front (right end, nearest the cooks)

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const at = (w, i) => Wd(w, i);

  // ── 1 · What happens when a million people tap buy ──
  {
    const st = cut(0), mi = at('million', 0) - st, bu = at('buy', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 720], zoom: 0.08, note: 'DAY 16 / 30 pill; phone with a BUY screen rises; on "million" a crowd of people icons fills around; on "buy" the finger taps BUY',
      draw(lt, d, t) {
        bg();
        if (lt > mi) for (let k = 0; k < 14; k++) { const a = mi + k * 0.04, ang = -Math.PI + (k / 13) * Math.PI * 2, r = 400 + (k % 2) * 70;
          K.personIcon(540 + Math.cos(ang) * r, 720 + Math.sin(ang) * r * 0.95, 1.6 * E(seg(lt, a, a + 0.2)), MCOL[k % 6]); }
        const pr = lt > bu ? 1 : 0;
        K.phone(540, lerp(1300, 720, eo(seg(lt, 0, 0.45))), 0.72, () => K.buyScreen(pr));
        K.pill('DAY 16 / 30', 540, 170, 64, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        if (lt > mi) K.pill('1,000,000', 540, 330, 70, C.ink, C.white, E(seg(lt, mi, mi + 0.25)));
        if (lt > bu - 0.3) { const p = seg(lt, bu - 0.3, bu); K.tapFinger(540, 720 + 220 * 0.72, p, lt > bu ? 1 : 0); }
        if (lt > bu) K.ripple(540, 720 + 220 * 0.72, seg(lt, bu, bu + 0.6));
      } });
    cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + 0.2, 'slide', { dur: 0.4, gain: 0.2 }); cue(st + mi, 'pop', { gain: 0.3 }); cue(st + bu, 'pop', { gain: 0.45 });
  }

  // ── 2 · at the exact same second? ──
  {
    const st = cut(1), ex = at('exact', 1) - st, se = at('second', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 720], zoom: 0.12, note: 'one server right; a swarm of orders flies in from the left all at once; load meter jumps red; server shakes; SAME SECOND pill',
      draw(lt, d, t) {
        bg('#F7E3C8', C.bg);
        const sh = lt > ex ? Math.sin(lt * 50) * 8 * clamp((lt - ex) * 2) : 0;
        K.server(700 + sh, 720, 0.75, t);
        K.loadMeter(940, 720, 60, 360, lerp(0.25, 1, eo(seg(lt, ex, ex + 0.5))));
        for (let k = 0; k < 12; k++) { const a = 0.1 + rnd(k) * 0.6, u = lt < a ? 0 : ((lt - a) * 1.6) % 1; if (u <= 0) continue;
          const [x, y] = K.arcAt(-120, 300 + rnd(k + 9) * 800, 560, 600 + rnd(k + 3) * 240, 120, u); K.msgCard(x, y, 1.3, MCOL[k % 6]); }
        if (lt > ex) K.warning(700, 260, 0.6 * E(seg(lt, ex, ex + 0.25)));
        if (lt > se) K.pill('SAME SECOND', 420, 1110, 66, C.red, C.white, E(seg(lt, se, se + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.15, 'slide', { dur: 0.6, gain: 0.22 }); cue(st + ex, 'alarm', { dur: 0.8, gain: 0.12 }); cue(st + se, 'pop', { gain: 0.35 });
  }

  // ── 3 · Picture a restaurant on a crazy Friday night. ──
  {
    const st = cut(2), re = at('restaurant', 2) - st, cr = at('crazy', 2) - st, fr = at('friday', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 760], zoom: 0.08, note: 'restaurant: 4 full tables pop in on "restaurant"; waiter rushes across on "crazy"; FRIDAY NIGHT pill + moon',
      draw(lt, d, t) {
        K.kitchen(1180);
        const tbl = [[220, 760], [620, 760], [420, 1060], [860, 1060]];
        tbl.forEach(([x, y], k) => { const a = re - 0.15 + k * 0.08, s = E(seg(lt, a, a + 0.2)); K.table(x, y, 0.6 * s); if (s > 0) { K.personIcon(x - 75, y - 90, 1.2 * s, MCOL[k]); K.personIcon(x + 75, y - 90, 1.2 * s, MCOL[k + 2]); } });
        if (lt > cr) { const u = seg(lt, cr, cr + 1.3); const x = lerp(-150, 1250, u); waiter({ x, y: 930, s: 0.38, arm: K.PHONE_ARM, holding: (hx, hy) => K.tray(hx, hy - 10, 0.5, (px, py) => K.pizza(px, py - 8, 0.2, 0)), eyes: 'wide', mouth: 'o', brow: 0.9, look: 1 }); K.speedLines(x - 40, 900, 0.7); }
        if (lt > fr) { circle(160, 230, 70, C.yellow); circle(195, 210, 62, '#B85F3C'); K.pill('FRIDAY NIGHT', 600, 240, 64, C.ink, C.white, E(seg(lt, fr, fr + 0.25))); }
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 4; k++) cue(st + re - 0.15 + k * 0.08, 'pop', { gain: 0.16 }); cue(st + cr, 'zip', { gain: 0.3 }); cue(st + fr, 'pop', { gain: 0.35 });
  }

  // ── 4 · If every waiter had to wait for the chef to finish, ──
  {
    const st = cut(3), wa = at('waiter', 3) - st, wt = at('wait', 3) - st, ch = at('chef', 3) - st, fi = at('finish', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 760], zoom: 0.1, note: 'cook at the stove right; waiter stands beside him tapping foot; on "wait" two more waiters line up behind; stopwatch ticks on "finish"; WAITING... pill',
      draw(lt, d, t) {
        K.kitchen(1180);
        K.stove(800, 900, 0.6, t, 1);
        cook({ x: 800, y: 740, s: 0.38, arm: K.ARM.hip, eyes: 'n', mouth: 'flat', brow: 0.4, look: -0.3 });
        if (lt > ch) K.pill('CHEF', 800, 380, 48, C.ink, C.white, E(seg(lt, ch, ch + 0.25)));
        for (let k = 2; k >= 0; k--) { const a = k === 0 ? wa - 0.3 : wt - 0.1 + k * 0.12, s = E(seg(lt, a, a + 0.25)); if (s <= 0) continue;
          waiter({ x: 520 - k * 170, y: 960 + (k ? Math.sin(lt * 9 + k) * 4 : 0), s: 0.4 * s, arm: K.ARM.hip, armL: K.ARM.hip, eyes: lt > fi ? 'closed' : 'n', mouth: 'flat', brow: 0.2, frown: true, look: 0.8 }); }
        if (lt > fi) { K.stopwatch(220, 380, 0.32 * E(seg(lt, fi, fi + 0.2)), (lt - fi) * 6); K.pill('WAITING...', 480, 1110, 60, C.red, C.white, E(seg(lt, fi, fi + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + wa, 'pop', { gain: 0.25 }); cue(st + wt, 'pop', { gain: 0.2 }); cue(st + fi, 'tock', { gain: 0.3 }); cue(st + fi + 0.5, 'tock', { gain: 0.25 });
  }

  // ── 5 · the whole place would freeze. ──
  {
    const st = cut(4), pl = at('place', 4) - st, fz = at('freeze', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 800], zoom: 0.14, note: 'restaurant wide: tables with customers + a stuck waiter; on "freeze" an icy tint washes over, snowflakes spin in, red FROZEN pill',
      draw(lt, d, t) {
        K.kitchen(1180);
        const tbl = [[220, 760], [860, 760], [300, 1060], [800, 1060]];
        const iced = lt > fz;
        tbl.forEach(([x, y], k) => { K.table(x, y, 0.55, lt > pl ? 'busy' : null, E(seg(lt, pl + k * 0.06, pl + k * 0.06 + 0.2))); K.personIcon(x - 70, y - 80, 1.1, MCOL[k], iced ? 1 : 0); K.personIcon(x + 70, y - 80, 1.1, MCOL[k + 2], iced ? 1 : 0); });
        waiter({ x: 540, y: 920, s: 0.42, arm: K.ARM.hip, armL: K.ARM.hip, eyes: iced ? 'wide' : 'n', mouth: iced ? 'o' : 'flat', brow: iced ? 1 : 0.3 });
        K.freezeTint(eo(seg(lt, fz, fz + 0.35)));
        if (iced) { for (let k = 0; k < 5; k++) K.snowflake(150 + k * 195, 300 + (k % 2) * 140, 0.9 * E(seg(lt, fz + k * 0.05, fz + k * 0.05 + 0.25)), lt * 0.6 + k); K.pill('FROZEN', 540, 520, 90, C.red, C.white, lerp(1.6, 1, eo(seg(lt, fz, fz + 0.2)))); }
      } });
    cue(st, 'whoosh'); cue(st + pl, 'pop', { gain: 0.2 }); cue(st + fz, 'slam', { gain: 0.4 }); cue(st + fz + 0.05, 'sparkle', { dur: 0.5, gain: 0.2 });
  }

  // ── 6 · So waiters just clip their orders onto a rail ──
  {
    const st = cut(5), cl = at('clip', 5) - st, or = at('orders', 5) - st, ra = at('rail', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 600], zoom: 0.12, note: 'rail across the top of the kitchen; waiter reaches up and clips a ticket on "clip"; more tickets slide on "orders"; RAIL pill on "rail"',
      draw(lt, d, t) {
        K.kitchen(1180);
        K.ticketRail(80, 1000, RAIL_Y);
        const n = lt > or ? Math.min(4, 1 + Math.floor((lt - or) * 6)) : 0;
        for (let k = 1; k <= n; k++) K.railTicket(slotX(k), RAIL_Y, 0.85, k + 1, Math.sin(lt * 5 + k) * 0.04, C.red, E(seg(lt, or + (k - 1) * 0.16, or + (k - 1) * 0.16 + 0.2)));
        const up = lt > cl - 0.4;
        const arm = up ? K.armPose(K.ARM.down, K.ARM.wave, eo(seg(lt, cl - 0.4, cl))) : K.ARM.down;
        const w = { x: 760, y: 1000, s: 0.5, arm, eyes: 'n', mouth: 'smile', brow: 0.5, look: 0.4 };
        waiter(w);
        if (lt < cl) { const hx = w.x + arm.h[0] * w.s, hy = w.y + arm.h[1] * w.s; K.ticket(hx, hy - 30, 0.5, 0.2); }
        else K.railTicket(slotX(0), RAIL_Y, 0.85, 1, Math.sin((lt - cl) * 14) * 0.2 * Math.max(0, 1 - (lt - cl) * 2));
        if (lt > cl && lt < cl + 0.4) K.burst(slotX(0), RAIL_Y, 1.4, clamp(1 - (lt - cl) * 2.5));
        if (lt > ra) K.pill('RAIL', 300, 760, 80, C.yellow, C.ink, E(seg(lt, ra, ra + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + cl, 'thud', { gain: 0.3 }); for (let k = 0; k < 3; k++) cue(st + or + k * 0.16, 'pop', { gain: 0.16 }); cue(st + ra, 'pop', { gain: 0.35 });
  }

  // ── 7 · and walk straight back to the tables. ──
  {
    const st = cut(6), wk = at('walk', 6) - st, ta = at('tables', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 760], zoom: 0.08, note: 'rail with 5 tickets up top; waiter walks left (smiling) toward a table of customers; on "tables" the table gets a green tick; NO WAITING pill',
      draw(lt, d, t) {
        K.kitchen(1180);
        K.ticketRail(80, 1000, RAIL_Y);
        for (let k = 0; k < 5; k++) K.railTicket(slotX(k), RAIL_Y, 0.85, k + 1, Math.sin(lt * 4 + k) * 0.03);
        K.table(220, 1060, 0.6, lt > ta ? 'free' : null, E(seg(lt, ta, ta + 0.2)));
        K.personIcon(145, 970, 1.2, BLUE); K.personIcon(295, 970, 1.2, ORANGE);
        const u = eio(seg(lt, wk - 0.1, ta + 0.1)), x = lerp(860, 480, u);
        ctx.save(); ctx.translate(2 * x, 0); ctx.scale(-1, 1);
        waiter({ x, y: 960 + Math.abs(Math.sin(lt * 10)) * -10 * (u > 0 && u < 1 ? 1 : 0), s: 0.45, arm: K.ARM.hip, eyes: 'n', mouth: 'grin', brow: 0.6, look: 0.5 });
        ctx.restore();
        if (u > 0 && u < 1) K.speedLines(x + 300, 920, 0.5);
        if (lt > wk) K.pill('NO WAITING', 600, 1110, 62, GREEN, C.white, E(seg(lt, wk, wk + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + wk, 'slide', { dur: 0.7, gain: 0.2 }); cue(st + ta, 'pop', { gain: 0.35 });
  }

  // ── 8 · The cooks grab tickets one by one, in order. ──
  {
    const st = cut(7), co = at('cooks', 7) - st, gr = at('grab', 7) - st, on = at('one', 7) - st, or = at('order', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 650], zoom: 0.1, note: 'rail with numbered tickets 1-5; two cooks on the right; from "one" ticket 1, then 2, slide off the front to the cooks; the rest shift forward; IN ORDER pill with arrow',
      draw(lt, d, t) {
        K.kitchen(1180);
        K.stove(840, 1000, 0.45, t, 1);
        K.ticketRail(40, 960, RAIL_Y);
        const taken = clamp((lt - on) / 0.55, 0, 2.2);
        const nt = Math.floor(taken);
        for (let k = 0; k < 5; k++) {
          const q = k - taken;
          if (q < 0) { const g = clamp(-q); if (g < 1) { const x = lerp(slotX(0), 1300, eo(g)); K.railTicket(x, RAIL_Y + g * 200, 0.8, k + 1, g * 0.6); } continue; }
          K.railTicket(lerp(slotX(0), slotX(4), q / 4) - 40, RAIL_Y, 0.8, k + 1, Math.sin(lt * 4 + k) * 0.03);
        }
        const ck = E(seg(lt, co - 0.3, co));
        cook({ x: 700, y: 980, s: 0.34 * ck, arm: K.armPose(K.ARM.down, K.ARM.wave, lt > gr ? 0.5 + 0.5 * Math.sin((lt - gr) * 6) : 0), eyes: 'n', mouth: 'smile', brow: 0.5, look: -0.6 });
        cook({ x: 920, y: 980, s: 0.34 * ck, arm: K.ARM.hip, eyes: 'n', mouth: 'smile', brow: 0.4, look: -0.8 });
        if (lt > or) { K.arrow(470, 760, 520, 0, E(seg(lt, or, or + 0.2))); K.pill('IN ORDER', 470, 1110, 66, C.yellow, C.ink, E(seg(lt, or, or + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + co, 'pop', { gain: 0.25 }); cue(st + on, 'slide', { dur: 0.5, gain: 0.2 }); cue(st + on + 0.55, 'slide', { dur: 0.5, gain: 0.2 }); cue(st + or, 'pop', { gain: 0.35 });
  }

  // ── 9 · That rail is a message queue. ──
  {
    const st = cut(8), ra = at('rail', 8) - st, qu = at('queue', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 700], zoom: 0.14, note: 'rail with tickets centre; on "rail" it glows; on "queue" the tickets morph into message cards and MESSAGE QUEUE slams with a burst',
      draw(lt, d, t) {
        bg();
        const m = eo(seg(lt, qu - 0.15, qu + 0.2));
        if (m < 1) { ctx.save(); ctx.globalAlpha = 1 - m; K.ticketRail(80, 1000, 620); for (let k = 0; k < 5; k++) K.railTicket(slotX(k), 620, 0.85, k + 1, Math.sin(lt * 4 + k) * 0.03); ctx.restore(); }
        if (lt > ra && m < 1) { ctx.save(); ctx.globalAlpha = 0.25 * (1 - m) * (0.6 + 0.4 * Math.sin(lt * 10)); rr(60, 560, 960, 360, 40); ctx.fillStyle = C.yellow; ctx.fill(); ctx.restore(); }
        if (m > 0) { ctx.save(); ctx.globalAlpha = m; K.queueTube(90, 990, 760, 190); for (let k = 0; k < 5; k++) K.msgCard(slotX(k), 760, 0.95, MCOL[k], null, 0, m); ctx.restore(); }
        if (lt > qu && lt < qu + 0.5) K.burst(540, 380, 3.4, clamp(1 - (lt - qu) * 2));
        if (lt > qu) K.pill('MESSAGE QUEUE', 540, 380, 88, C.yellow, C.ink, lerp(1.6, 1, eo(seg(lt, qu, qu + 0.2))));
      } });
    cue(st, 'whoosh'); cue(st + ra, 'pop', { gain: 0.25 }); cue(st + qu, 'slam', { gain: 0.4 }); cue(st + qu, 'sparkle', { dur: 0.4, gain: 0.2 });
  }

  // ── 10 · In an app, one service drops in a message, ──
  {
    const st = cut(9), ap = at('app', 9) - st, sv = at('service', 9) - st, dr = at('drops', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 720], zoom: 0.1, note: 'SHOP service box left above the queue tube; on "drops" a yellow message card arcs from the box into the back of the queue',
      draw(lt, d, t) {
        bg('#F7E3C8', C.bg);
        K.queueTube(300, 1000, 900, 170, 1, 'QUEUE');
        for (let k = 0; k < 2; k++) K.msgCard(900 - k * 150, 900, 0.85, MCOL[k + 1]);
        K.serviceBox(190, 560, 1, 'SHOP', BLUE, t, null, E(seg(lt, ap - 0.2, ap + 0.1)));
        if (lt > sv) K.pill('SERVICE', 190, 330, 46, C.ink, C.white, E(seg(lt, sv, sv + 0.25)));
        if (lt > dr) { const u = eio(seg(lt, dr, dr + 0.6)); const [x, y] = K.arcAt(280, 560, 600, 900, 160, u); K.msgCard(x, y, 0.85, C.yellow, null, (1 - u) * 0.4); }
        else K.msgCard(300, 560, 0.85 * E(seg(lt, sv, sv + 0.25)), C.yellow);
        if (lt > dr + 0.6 && lt < dr + 1) K.burst(600, 900, 1.2, clamp(1 - (lt - dr - 0.6) * 2.5));
      } });
    cue(st, 'whoosh'); cue(st + sv, 'pop', { gain: 0.3 }); cue(st + dr, 'slide', { dur: 0.6, gain: 0.22 }); cue(st + dr + 0.6, 'thud', { gain: 0.25 });
  }

  // ── 11 · like, send a receipt, and moves on. ──
  {
    const st = cut(10), se = at('send', 10) - st, rc = at('receipt', 10) - st, mo = at('moves', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.1, note: 'the dropped card in the queue gets a SEND RECEIPT label; an envelope appears on "receipt"; on "moves" the SHOP box gets a green tick; MOVES ON pill',
      draw(lt, d, t) {
        bg('#F7E3C8', C.bg);
        K.queueTube(300, 1000, 900, 170, 1, 'QUEUE');
        for (let k = 0; k < 2; k++) K.msgCard(900 - k * 150, 900, 0.85, MCOL[k + 1]);
        K.msgCard(600, 900, 0.85, C.yellow, lt > se ? 'SEND RECEIPT' : null, 0, 1);
        if (lt > rc) K.envelope(820, 680, 0.6 * E(seg(lt, rc, rc + 0.25)), 0);
        K.serviceBox(190, 560, 1, 'SHOP', BLUE, t, lt > mo ? 'ok' : null);
        if (lt > mo) { K.pill('MOVES ON', 540, 1110, 66, GREEN, C.white, E(seg(lt, mo, mo + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + se, 'pop', { gain: 0.3 }); cue(st + rc, 'pop', { gain: 0.3 }); cue(st + mo, 'pop', { gain: 0.4 });
  }

  // ── 12 · Workers pull them out whenever they're free. ──
  {
    const st = cut(11), wo = at('workers', 11) - st, pu = at('pull', 11) - st, fr = at('free', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 760], zoom: 0.1, note: 'queue tube at y 520; three WORKER boxes below pop in on "workers"; from "pull" cards drop from the front into workers one at a time; WHEN FREE pill',
      draw(lt, d, t) {
        bg();
        K.queueTube(60, 900, 520, 170, 1, 'QUEUE');
        const taken = clamp((lt - pu) / 0.45, 0, 3);
        for (let k = 0; k < 5; k++) {
          const q = k - taken;
          if (q < 0) { const g = eio(clamp(-q)); const tx = 300 + k * 240; K.msgCard(lerp(800, tx, g), lerp(520, 880, g), 0.85 * (1 - 0.4 * g), MCOL[k]); continue; }
          K.msgCard(800 - q * 150, 520, 0.85, MCOL[k]);
        }
        for (let k = 0; k < 3; k++) K.serviceBox(300 + k * 240, 960, 0.75, 'WORKER', ORANGE, t + k, null, E(seg(lt, wo - 0.2 + k * 0.08, wo + k * 0.08 + 0.1)));
        if (lt > fr) K.pill('WHEN FREE', 540, 270, 66, C.yellow, C.ink, E(seg(lt, fr, fr + 0.25)));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 3; k++) cue(st + wo + k * 0.08, 'pop', { gain: 0.2 }); for (let k = 0; k < 3; k++) cue(st + pu + k * 0.45, 'slide', { dur: 0.35, gain: 0.18 }); cue(st + fr, 'pop', { gain: 0.35 });
  }

  // ── 13 · If a worker crashes, the message just waits, ──
  {
    const st = cut(12), cr = at('crashes', 12) - st, me = at('message', 12) - st, wa = at('waits', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 760], zoom: 0.12, note: 'one worker under the queue holding a card; on "crashes" it goes grey with a red X + smoke; on "message" the card floats back up into the front of the queue; STILL WAITING pill + glow',
      draw(lt, d, t) {
        bg('#F7E3C8', C.bg);
        K.queueTube(60, 900, 520, 170, 1, 'QUEUE');
        for (let k = 1; k < 4; k++) K.msgCard(800 - k * 150, 520, 0.85, MCOL[k]);
        const down = lt > cr;
        K.serviceBox(540, 960, 0.9, 'WORKER', ORANGE, t, down ? 'down' : null);
        if (down) { K.smokePuffs(540, 840, t, 0.9); if (lt < cr + 0.4) K.burst(540, 900, 2, clamp(1 - (lt - cr) * 2.5)); }
        const back = eio(seg(lt, me, me + 0.6));
        const x = lerp(540, 800, back), y = lerp(760, 520, back);
        if (lt > wa) { ctx.save(); ctx.globalAlpha = 0.35 + 0.2 * Math.sin(lt * 8); circle(800, 520, 110, C.yellow); ctx.restore(); }
        K.msgCard(x, y, 0.85, C.yellow, null, (1 - back) * (down ? Math.sin(lt * 20) * 0.1 : 0));
        if (lt > wa) K.pill('STILL WAITING', 540, 270, 64, C.ink, C.white, E(seg(lt, wa, wa + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + cr, 'slam', { gain: 0.35 }); cue(st + me, 'slide', { dur: 0.6, gain: 0.2 }); cue(st + wa, 'pop', { gain: 0.3 });
  }

  // ── 14 · so nothing gets lost. ──
  {
    const st = cut(13), no = at('nothing', 13) - st, lo = at('lost', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 720], zoom: 0.1, note: 'a fresh worker pops in and pulls the waiting card; on "lost" a big green tick + NOTHING LOST pill',
      draw(lt, d, t) {
        bg();
        K.queueTube(60, 900, 520, 170, 1, 'QUEUE');
        for (let k = 1; k < 4; k++) K.msgCard(800 - k * 150, 520, 0.85, MCOL[k]);
        K.serviceBox(540, 960, 0.9, 'WORKER', GREEN, t, lt > lo ? 'ok' : null, E(seg(lt, 0, 0.25)));
        const g = eio(seg(lt, no - 0.2, no + 0.35));
        K.msgCard(lerp(800, 540, g), lerp(520, 800, g), 0.85, C.yellow);
        if (lt > lo) { K.check(860, 860, 0.6, E(seg(lt, lo, lo + 0.25))); K.pill('NOTHING LOST', 540, 270, 72, GREEN, C.white, E(seg(lt, lo, lo + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + no - 0.2, 'slide', { dur: 0.5, gain: 0.2 }); cue(st + lo, 'sparkle', { dur: 0.5, gain: 0.25 }); cue(st + lo, 'pop', { gain: 0.35 });
  }

  // ── 15 · Big rush? The line gets longer, but nothing breaks. ──
  {
    const st = cut(14), ru = at('rush', 14) - st, li = at('line', 14) - st, lg = at('longer', 14) - st, br = at('breaks', 14) - st;
    add({ id: 'S15', at: st, cam: [540, 720], zoom: 0.08, note: 'SHOP left floods cards in on "rush"; the queue tube grows longer on "longer"; workers below keep pulling at a steady pace; NOTHING BREAKS pill',
      draw(lt, d, t) {
        bg('#F7E3C8', C.bg);
        const ext = eo(seg(lt, lg - 0.3, lg + 0.6));
        const x1 = lerp(620, 1010, ext);
        K.queueTube(230, x1, 560, 160, 1, lt > li ? 'QUEUE' : null);
        const n = Math.round(lerp(2, 5, clamp((lt - ru) / 1.5)));
        for (let k = 0; k < n; k++) K.msgCard(x1 - 80 - k * 130, 560, 0.75, MCOL[k % 6]);
        K.serviceBox(120, 560, 0.7, 'SHOP', BLUE, t);
        if (lt > ru) for (let k = 0; k < 4; k++) { const a = ru + k * 0.18, u = (lt - a) * 1.6; if (u > 0 && u < 1) K.msgCard(lerp(120, 240, u), lerp(300, 540, u), 0.6, MCOL[(k + 2) % 6]); }
        for (let k = 0; k < 3; k++) K.serviceBox(300 + k * 240, 1000, 0.6, 'WORKER', ORANGE, t + k);
        { const u = ((lt * 0.9) % 1), x = x1 - 80; K.msgCard(lerp(x, 540, eio(u)), lerp(620, 880, eio(u)), 0.8, C.yellow); }
        if (lt > ru) K.pill('RUSH!', 140, 250, 60, C.red, C.white, E(seg(lt, ru, ru + 0.25)));
        if (lt > lg) K.pill('LONGER', 760, 380, 56, C.ink, C.white, E(seg(lt, lg, lg + 0.25)));
        if (lt > br) K.pill('NOTHING BREAKS', 540, 1180, 60, GREEN, C.white, E(seg(lt, br, br + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ru, 'alarm', { dur: 0.5, gain: 0.1 }); for (let k = 0; k < 4; k++) cue(st + ru + k * 0.18, 'pop', { gain: 0.14 }); cue(st + lg, 'slide', { dur: 0.6, gain: 0.2 }); cue(st + br, 'pop', { gain: 0.4 });
  }

  // ── 16 · Don't wait on the chef. Leave a ticket. ──
  {
    const st = cut(15), wa = at('wait', 15) - st, le = at('leave', 15) - st, ti = at('ticket', 15) - st;
    add({ id: 'S16', at: st, cam: [540, 700], zoom: 0.1, note: 'waiter close-up wags finger on "wait"; on "leave" holds a ticket up and winks on "ticket"; LEAVE A TICKET pill',
      draw(lt, d, t) {
        bg();
        const lv = lt > le;
        waiter({ x: 540, y: 1000, s: 0.62, arm: lv ? K.ARM.wave : K.ARM.point, finger: lv ? null : Math.sin(lt * 11) * 0.35, holding: lv ? (x, y) => K.ticket(x, y - 70, 0.75, 0.15) : undefined, eyes: lt > ti ? 'wink' : 'n', mouth: lv ? 'grin' : 'smirk', smirk: !lv, brow: 0.6 });
        if (lt > wa && !lv) K.pill("DON'T WAIT", 540, 270, 66, C.red, C.white, E(seg(lt, wa, wa + 0.25)));
        if (lv) K.pill('LEAVE A TICKET', 540, 270, 70, C.yellow, C.ink, E(seg(lt, le, le + 0.25)));
        if (lt > ti && lt < ti + 0.5) K.burst(780, 400, 1.6, clamp(1 - (lt - ti) * 2));
      } });
    cue(st, 'whoosh'); cue(st + wa, 'pop', { gain: 0.3 }); cue(st + le, 'pop', { gain: 0.35 }); cue(st + ti, 'sparkle', { dur: 0.4, gain: 0.25 });
  }

  // ── 17 · Tomorrow: pub sub. ──
  {
    const st = cut(16), to = at('tomorrow', 16) - st, pu = at('pub', 16) - st;
    add({ id: 'S17', at: st, cam: [540, 700], zoom: 0.03, note: 'DAY 16 / 30; NEXT: PUB / SUB; on "pub" one message card fans out to three boxes at once (a hint of pub/sub)',
      draw(lt, d, t) {
        bg();
        K.pill('DAY 16 / 30', 540, 170, 64, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        if (lt > to) K.pill('NEXT: PUB / SUB', 540, 310, 60, C.ink, C.white, E(seg(lt, to, to + 0.25)));
        K.serviceBox(540, 600, 0.7, 'NEWS', PURPLE, t);
        for (let k = 0; k < 3; k++) {
          const tx = 220 + k * 320; K.serviceBox(tx, 1020, 0.55, ['A', 'B', 'C'][k], ORANGE, t + k);
          if (lt > pu) { const u = eio(seg(lt, pu, pu + 0.5)); K.msgCard(lerp(540, tx, u), lerp(700, 900, u), 0.6, C.yellow); }
        }
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + to, 'pop', { gain: 0.3 }); cue(st + pu, 'slide', { dur: 0.5, gain: 0.25 });
  }

  return { shots: S, cues: CUES };
}
