// (15/30) POLLING VS WEBSOCKETS: the shot list. Restaurant analogy (same kitchen as the earlier days):
// polling = a waiter running to the kitchen every few seconds asking "is my pizza ready yet?" (no, no, no, still no:
// most trips come back empty and waste energy on both sides). WebSocket = the waiter wears a walkie-talkie, the line
// to the kitchen stays open, the chef just says "ready!" the second it's done, and either side can talk any time.
// That's how live chats, scores and games feel instant. Loop: one open line beats a thousand questions. Tease: message queues.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T, lineWords } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const GREEN = '#5BAE6A', BLUE = '#3A7BD5', ORANGE = '#F29A3A', PURPLE = '#8A63D2';
const bg = (ring = '#CFE8F3', base = C.sky) => { fillAll(base); circle(540, 740, 560, ring); };
const waiter = (o) => { K.man(o); K.bowtie(o.x, o.y, o.s); };
const cook = (o) => { K.man(o); K.chefHat(o.x, o.y, o.s, o.hat ?? 1); };
const chat = (n) => () => K.chatApp([['hey!', false, 1], ['hi :)', true, 1], ['look!', false, n]], '', 0);

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const at = (w, i) => Wd(w, i);

  // ── 1 · How does a chat app show a new message ──
  {
    const st = cut(0), me = at('message', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 700], zoom: 0.08, note: 'DAY 15 / 30 pill; phone with a chat app rises; on "message" a new bubble pops in with a ripple + badge',
      draw(lt, d, t) {
        bg();
        K.pill('DAY 15 / 30', 540, 170, 64, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        K.phone(540, lerp(1300, 720, eo(seg(lt, 0, 0.45))), 0.95, chat(E(seg(lt, me, me + 0.25))));
        if (lt > me) { K.ripple(540, 560, seg(lt, me, me + 0.6)); K.countBadge(760, 380, 40, '1', C.red, E(seg(lt, me, me + 0.2))); }
      } });
    cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + 0.2, 'slide', { dur: 0.4, gain: 0.2 }); cue(st + me, 'pop', { gain: 0.45 });
  }

  // ── 2 · the second your friend hits send? ──
  {
    const st = cut(1), fr = at('friend', 1) - st, se = at('send', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 700], zoom: 0.1, note: 'friend left holding a phone, your phone right; on "send" an envelope zips across; INSTANTLY? pill',
      draw(lt, d, t) {
        bg('#F7E3C8', C.bg);
        K.man({ x: 250, y: 900, s: 0.5, arm: K.PHONE_ARM, holding: (x, y) => K.phone(x + 10, y - 30, 0.16, () => K.homeScreen()), eyes: 'n', mouth: lt > se ? 'grin' : 'smile', brow: 0.5, look: 0.6 });
        if (lt > fr - 0.1) K.pill('FRIEND', 250, 330, 50, C.ink, C.white, E(seg(lt, fr - 0.1, fr + 0.15)));
        K.phone(800, 640, 0.6, chat(lt > se + 0.45 ? 1 : 0));
        if (lt > se) { const u = seg(lt, se, se + 0.45); if (u < 1) { const [x, y] = K.arcAt(300, 600, 800, 560, 220, eo(u)); K.envelope(x, y, 0.3, 0); K.speedLines(x, y, 0.8); } }
        if (lt > se + 0.3) K.pill('INSTANTLY?', 540, 1110, 64, C.yellow, C.ink, E(seg(lt, se + 0.3, se + 0.55)));
      } });
    cue(st, 'whoosh'); cue(st + se, 'zip', { gain: 0.35 }); cue(st + se + 0.45, 'pop', { gain: 0.35 });
  }

  // ── 3 · The simple way is called polling. ──
  {
    const st = cut(2), si = at('simple', 2) - st, po = at('polling', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 720], zoom: 0.1, note: 'phone left, server right; little envelopes hop phone→server over and over; POLLING slams on "polling"',
      draw(lt, d, t) {
        bg();
        K.phone(230, 760, 0.42, () => K.homeScreen());
        K.server(850, 780, 0.6, t);
        for (let k = 0; k < 3; k++) { const q = lt * 1.4 - k * 0.33; if (q < 0) continue; const u = q % 1; const [x, y] = K.arcAt(320, 700, 760, 700, 160, u); K.envelope(x, y, 0.22, 0); }
        if (lt > si) K.pill('THE SIMPLE WAY', 540, 1080, 52, C.ink, C.white, E(seg(lt, si, si + 0.25)));
        if (lt > po && lt < po + 0.5) K.burst(540, 360, 3.2, clamp(1 - (lt - po) * 2));
        if (lt > po) K.pill('POLLING', 540, 360, 110, C.yellow, C.ink, lerp(1.6, 1, eo(seg(lt, po, po + 0.2))));
      } });
    cue(st, 'whoosh'); cue(st + si, 'pop', { gain: 0.3 }); cue(st + po, 'slam', { gain: 0.4 });
  }

  // ── 4 · It's like a waiter running to the kitchen every few seconds, ──
  {
    const st = cut(3), wa = at('waiter', 3) - st, ru = at('running', 3) - st, ki = at('kitchen', 3) - st, se = at('seconds', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 760], zoom: 0.08, note: 'kitchen: table left, swinging door right; waiter runs back and forth between them from "running"; on "seconds" EVERY 5 SEC pill',
      draw(lt, d, t) {
        K.kitchen(1180);
        K.table(180, 1060, 0.55);
        K.swingDoor(880, 1180, 0.9, lt > ru ? 0.6 * Math.max(0, Math.sin((lt - ru) * Math.PI * 1.6)) : 0);
        if (lt > ki) K.pill('KITCHEN', 880, 590, 50, C.ink, C.white, E(seg(lt, ki, ki + 0.25)));
        const r = lt > ru ? (lt - ru) * 0.8 : 0, ph = r % 1, tri = ph < 0.5 ? ph * 2 : 2 - ph * 2;
        const x = lerp(330, 720, eio(tri)), dir = ph < 0.5 ? 1 : -1;
        const ws = E(seg(lt, wa - 0.3, wa)); if (ws > 0) waiter({ x, y: 1000, s: 0.42 * ws, arm: K.ARM.hip, eyes: 'n', mouth: lt > ru ? 'o' : 'smile', brow: 0.6, look: dir * 0.8 });
        if (lt > ru && Math.abs(tri - 0.5) < 0.4) { ctx.save(); if (dir < 0) { ctx.translate(2 * x, 0); ctx.scale(-1, 1); } K.speedLines(x - 30, 900, 0.7); ctx.restore(); }
        if (lt > se) K.pill('EVERY 5 SEC', 540, 300, 64, C.yellow, C.ink, E(seg(lt, se, se + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ru, 'slide', { dur: 0.6, gain: 0.2 }); cue(st + ru + 0.62, 'slide', { dur: 0.6, gain: 0.2 }); cue(st + ru + 1.25, 'slide', { dur: 0.6, gain: 0.2 }); cue(st + se, 'pop', { gain: 0.35 });
  }

  // ── 5 · asking, is my pizza ready yet? ──
  {
    const st = cut(4), as = at('asking', 4) - st, pz = at('pizza', 4) - st, re = at('ready', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 720], zoom: 0.1, note: 'waiter left, cook behind the stove right; bubble READY YET? on "asking"; pizza with ? on "pizza"',
      draw(lt, d, t) {
        K.kitchen(1180);
        K.stove(760, 900, 0.7, t, 1);
        cook({ x: 760, y: 720, s: 0.38, arm: K.ARM.hip, eyes: 'n', mouth: 'flat', brow: 0.5, look: -0.7 });
        waiter({ x: 270, y: 1000, s: 0.45, arm: K.ARM.point, eyes: 'n', mouth: 'o', brow: 0.9, look: 0.7 });
        if (lt > as) K.bubble(330, 380, 1, 'READY YET?', E(seg(lt, as, as + 0.25)), 1);
        if (lt > pz) { K.pizza(780, 300, 0.45 * E(seg(lt, pz, pz + 0.25)), lt * 0.5); K.qmark(900, 230, 0.4 * E(seg(lt, re, re + 0.25)), 1, Math.sin(lt * 6) * 0.1); }
      } });
    cue(st, 'whoosh'); cue(st + as, 'pop', { gain: 0.35 }); cue(st + pz, 'pop', { gain: 0.3 }); cue(st + re, 'boing', { gain: 0.25 });
  }

  // ── 6 · No. No. No. Still no. ──
  {
    const st = cut(5), ws = lineWords(5).map((w) => w.s - st);
    add({ id: 'S06', at: st, cam: [540, 720], zoom: 0.12, note: 'cook shakes head; a red NO stamp slams on each "No"; STILL NO on "Still"',
      draw(lt, d, t) {
        bg('#F7E3C8', C.bg);
        cook({ x: 540, y: 980, s: 0.5, arm: K.ARM.hip, armL: K.ARM.hip, eyes: 'closed', mouth: 'flat', brow: 0.2, look: Math.sin(lt * 14) * 0.9 });
        const pos = [[260, 330, -0.12], [800, 360, 0.1], [300, 560, 0.08], [780, 560, -0.08]];
        [0, 1, 2, 3].forEach((wi, k) => { const a = ws[wi]; if (a == null || lt < a) return; const [x, y, r] = pos[k]; ctx.save(); ctx.translate(x, y); ctx.rotate(r); K.pill(k === 3 ? 'STILL NO' : 'NO', 0, 0, k === 3 ? 76 : 70, C.red, C.white, lerp(1.6, 1, eo(seg(lt, a, a + 0.15)))); ctx.restore(); });
      } });
    cue(st, 'whoosh'); [0, 1, 2, 3].forEach((wi) => { if (ws[wi] != null) cue(st + ws[wi], 'slam', { gain: 0.22 }); });
  }

  // ── 7 · Most trips come back empty, ──
  {
    const st = cut(6), tr = at('trips', 6) - st, em = at('empty', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 700], zoom: 0.08, note: 'grid of 6 trays (trips) pop in; 5 empty get red X on "empty"; only the last has a pizza; 5 OF 6 EMPTY pill',
      draw(lt, d, t) {
        bg();
        for (let k = 0; k < 6; k++) {
          const x = 250 + (k % 3) * 290, y = 520 + Math.floor(k / 3) * 300, a = tr - 0.2 + k * 0.1;
          K.tray(x, y, 0.75 * E(seg(lt, a, a + 0.2)), k === 5 ? (px, py) => K.pizza(px, py - 10, 0.32, 0) : null);
          if (k < 5 && lt > em + k * 0.06) K.redX(x, y - 10, 0.22, E(seg(lt, em + k * 0.06, em + k * 0.06 + 0.15)));
        }
        if (lt > tr) K.pill('TRIPS', 540, 270, 60, C.ink, C.white, E(seg(lt, tr, tr + 0.25)));
        if (lt > em) K.pill('5 OF 6 EMPTY', 540, 1080, 64, C.red, C.white, E(seg(lt, em, em + 0.25)));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 6; k++) cue(st + tr - 0.2 + k * 0.1, 'pop', { gain: 0.18 }); cue(st + em, 'slam', { gain: 0.3 });
  }

  // ── 8 · which wastes energy on both sides. ──
  {
    const st = cut(7), wa = at('wastes', 7) - st, en = at('energy', 7) - st, bo = at('both', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 720], zoom: 0.1, note: 'phone left with a battery draining, server right with a load meter rising; WASTED on "wastes"; BOTH SIDES on "both"',
      draw(lt, d, t) {
        bg('#F7E3C8', C.bg);
        K.phone(270, 620, 0.42, () => K.homeScreen());
        K.server(810, 640, 0.55, t);
        const u = eo(seg(lt, wa, en + 0.6));
        K.battery(270, 990, 0.7, lerp(0.95, 0.18, u));
        K.loadMeter(1000, 640, 60, 300, lerp(0.2, 0.92, u));
        for (let k = 0; k < 2; k++) { const q = lt * 1.5 - k * 0.5; if (q < 0) continue; const [x, y] = K.arcAt(360, 560, 720, 560, 120, q % 1); K.envelope(x, y, 0.18, 0); }
        if (lt > wa) K.pill('WASTED', 540, 300, 64, C.red, C.white, E(seg(lt, wa, wa + 0.25)));
        if (lt > bo) K.pill('BOTH SIDES', 540, 1120, 60, C.yellow, C.ink, E(seg(lt, bo, bo + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + wa, 'alarm', { dur: 0.7, gain: 0.12 }); cue(st + bo, 'pop', { gain: 0.35 });
  }

  // ── 9 · The smarter way is a WebSocket. ──
  {
    const st = cut(8), sm = at('smarter', 8) - st, ws = at('websocket', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 720], zoom: 0.12, note: 'phone left, server right; on "smarter" a green open line grows between them; WEBSOCKET slams on "WebSocket"',
      draw(lt, d, t) {
        bg();
        K.phone(230, 760, 0.42, () => K.homeScreen());
        K.server(850, 780, 0.6, t);
        K.openLine(320, 700, 760, 700, eo(seg(lt, sm, sm + 0.5)), t);
        if (lt > sm) K.pill('SMARTER', 540, 1080, 56, C.ink, C.white, E(seg(lt, sm, sm + 0.25)));
        if (lt > ws && lt < ws + 0.5) K.burst(540, 380, 3.4, clamp(1 - (lt - ws) * 2));
        if (lt > ws) K.pill('WEBSOCKET', 540, 380, 104, C.yellow, C.ink, lerp(1.6, 1, eo(seg(lt, ws, ws + 0.2))));
      } });
    cue(st, 'whoosh'); cue(st + sm, 'slide', { dur: 0.5, gain: 0.2 }); cue(st + ws, 'slam', { gain: 0.4 });
  }

  // ── 10 · Now the waiter just wears a walkie-talkie, ──
  {
    const st = cut(9), wk = at('walkie', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 760], zoom: 0.12, note: 'waiter close-up; on "walkie" a walkie-talkie drops into his hand (held) with a burst; WALKIE-TALKIE pill',
      draw(lt, d, t) {
        bg();
        const has = lt > wk + 0.3;
        waiter({ x: 540, y: 960, s: 0.62, arm: has ? K.PHONE_ARM : K.ARM.hip, holding: has ? (x, y) => K.walkieTalkie(x + 6, y - 40, 0.55) : undefined, eyes: 'n', mouth: has ? 'grin' : 'smile', brow: 0.5, look: 0 });
        if (lt > wk && !has) K.walkieTalkie(620, lerp(-200, 860, eo(seg(lt, wk, wk + 0.3))), 0.55);
        if (lt > wk + 0.3) K.burst(620, 840, 2, clamp(1 - (lt - wk - 0.3) * 2.5));
        if (lt > wk) K.pill('WALKIE-TALKIE', 540, 260, 60, C.yellow, C.ink, E(seg(lt, wk, wk + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + wk + 0.3, 'thud', { gain: 0.3 }); cue(st + wk + 0.3, 'sparkle', { dur: 0.4, gain: 0.2 });
  }

  // ── 11 · and the line to the kitchen stays open. ──
  {
    const st = cut(10), li = at('line', 10) - st, ki = at('kitchen', 10) - st, op = at('open', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 720], zoom: 0.1, note: 'waiter left with walkie, cook right behind stove with walkie; on "line" a green open line grows between the radios; ALWAYS OPEN pill',
      draw(lt, d, t) {
        K.kitchen(1180);
        K.stove(800, 900, 0.6, t, 1);
        cook({ x: 800, y: 740, s: 0.38, arm: K.PHONE_ARM, holding: (x, y) => K.walkieTalkie(x, y - 30, 0.36, 1), eyes: 'n', mouth: 'smile', brow: 0.5, look: -0.6 });
        waiter({ x: 260, y: 960, s: 0.45, arm: K.PHONE_ARM, holding: (x, y) => K.walkieTalkie(x + 4, y - 30, 0.42, 1), eyes: 'n', mouth: 'smile', brow: 0.5, look: 0.6 });
        K.openLine(310, 890, 790, 700, eo(seg(lt, li, li + 0.5)), t);
        if (lt > ki) K.pill('KITCHEN', 800, 380, 48, C.ink, C.white, E(seg(lt, ki, ki + 0.25)));
        if (lt > op) K.pill('ALWAYS OPEN', 600, 1110, 64, GREEN, C.white, E(seg(lt, op, op + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + li, 'slide', { dur: 0.5, gain: 0.2 }); cue(st + op, 'pop', { gain: 0.35 });
  }

  // ── 12 · The second the pizza's done, the chef just says so. ──
  {
    const st = cut(11), dn = at('done', 11) - st, ch = at('chef', 11) - st, sa = at('says', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 720], zoom: 0.1, note: 'pizza pops out on "done"; on "chef" radio waves; on "says" a PIZZA READY! bubble rides the line to the waiter, who lights up',
      draw(lt, d, t) {
        K.kitchen(1180);
        K.stove(800, 900, 0.6, t, 1);
        if (lt > dn) K.pizza(620, lerp(900, 850, eo(seg(lt, dn, dn + 0.25))), 0.32 * E(seg(lt, dn, dn + 0.25)), 0);
        cook({ x: 800, y: 740, s: 0.38, arm: K.PHONE_ARM, holding: (x, y) => K.walkieTalkie(x, y - 30, 0.36, 1), eyes: 'n', mouth: lt > sa ? 'grin' : 'smile', brow: 0.6, look: -0.6 });
        const heard = lt > sa + 0.55;
        waiter({ x: 260, y: 960, s: 0.45, arm: K.PHONE_ARM, holding: (x, y) => K.walkieTalkie(x + 4, y - 30, 0.42, 1), eyes: heard ? 'wide' : 'n', mouth: heard ? 'grin' : 'smile', brow: heard ? 0.9 : 0.5, look: 0.6 });
        K.openLine(310, 890, 790, 700, 1, t);
        if (lt > dn) K.pill('DONE!', 660, 1100, 56, C.ink, C.white, E(seg(lt, dn, dn + 0.25)));
        if (lt > ch) K.radioWaves(770, 680, 1, Math.PI - 0.38, t, E(seg(lt, ch, ch + 0.2)));
        if (lt > sa) { const u = eio(seg(lt, sa, sa + 0.55)); K.bubble(lerp(650, 470, u), lerp(645, 600, u), 0.8, 'PIZZA READY!', E(seg(lt, sa, sa + 0.2)), 0, C.yellow, C.ink, 54); }
      } });
    cue(st, 'whoosh'); cue(st + dn, 'pop', { gain: 0.35 }); cue(st + sa, 'slide', { dur: 0.55, gain: 0.2 }); cue(st + sa + 0.55, 'sparkle', { dur: 0.4, gain: 0.25 });
  }

  // ── 13 · And either side can talk at any time. ──
  {
    const st = cut(12), ei = at('either', 12) - st, ta = at('talk', 12) - st, an = at('any', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 720], zoom: 0.1, note: 'phone left, server right on the open line; envelopes travel BOTH ways; BOTH WAYS pill; ANY TIME pill',
      draw(lt, d, t) {
        bg();
        K.phone(230, 760, 0.42, () => K.homeScreen());
        K.server(850, 780, 0.6, t);
        K.openLine(320, 700, 760, 700, 1, t);
        if (lt > ei) { const u = ((lt - ei) * 0.9) % 1; K.envelope(lerp(340, 740, u), 610, 0.22, 0); }
        if (lt > ta) { const u = ((lt - ta) * 0.9) % 1; K.envelope(lerp(740, 340, u), 790, 0.22, 0); }
        if (lt > ei) K.pill('BOTH WAYS', 540, 380, 70, C.ink, C.white, E(seg(lt, ei, ei + 0.25)));
        if (lt > an) K.pill('ANY TIME', 540, 1080, 70, C.yellow, C.ink, E(seg(lt, an, an + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ei, 'slide', { dur: 0.5, gain: 0.2 }); cue(st + ta, 'slide', { dur: 0.5, gain: 0.2 }); cue(st + an, 'pop', { gain: 0.35 });
  }

  // ── 14 · That's how live chats, scores and games feel instant. ──
  {
    const st = cut(13), ch = at('chats', 13) - st, sc = at('scores', 13) - st, ga = at('games', 13) - st, ins = at('instant', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 720], zoom: 0.08, note: 'three cards pop on their words: chat phone (left), LIVE scoreboard (top right), gamepad (bottom right); INSTANT slams with burst',
      draw(lt, d, t) {
        bg('#F7E3C8', C.bg);
        K.phone(270, 720, 0.5 * E(seg(lt, 0, 0.3)), chat(1));
        if (lt > sc) K.scoreCard(770, 580, 1.15, 'RED', 'BLU', '2 - 1', t, E(seg(lt, sc, sc + 0.25)));
        if (lt > ga) K.gameCard(770, 920, 1.05, t, E(seg(lt, ga, ga + 0.25)));
        if (lt > ins && lt < ins + 0.5) K.burst(540, 260, 3, clamp(1 - (lt - ins) * 2));
        if (lt > ins) K.pill('INSTANT', 540, 260, 100, C.yellow, C.ink, lerp(1.6, 1, eo(seg(lt, ins, ins + 0.2))));
      } });
    cue(st, 'whoosh'); cue(st + ch, 'pop', { gain: 0.3 }); cue(st + sc, 'pop', { gain: 0.3 }); cue(st + ga, 'pop', { gain: 0.3 }); cue(st + ins, 'slam', { gain: 0.4 });
  }

  // ── 15 · One open line beats a thousand questions. ──
  {
    const st = cut(14), op = at('open', 14) - st, be = at('beats', 14) - st, th = at('thousand', 14) - st;
    add({ id: 'S15', at: st, cam: [540, 720], zoom: 0.1, note: 'left: pile of red ? (questions) keeps growing; right: green open line between two radios; on "beats" tick on the right; 1 LINE vs 1000 ? pills',
      draw(lt, d, t) {
        bg();
        line([[540, 300], [540, 1150]], '#9AA3AF', 6);
        const n = Math.min(18, 3 + Math.floor(lt * 9));
        for (let k = 0; k < n; k++) K.qmark(110 + rnd(k) * 320, 380 + rnd(k + 30) * 600, 0.36, lt > be ? 0.45 : 1, (rnd(k + 7) - 0.5) * 0.8);
        K.walkieTalkie(680, 520, 0.42, 1); K.walkieTalkie(900, 900, 0.42, 1);
        K.openLine(700, 560, 880, 860, eo(seg(lt, op - 0.2, op + 0.3)), t);
        if (lt > be) K.check(790, 330, 0.5, E(seg(lt, be, be + 0.25)));
        if (lt > th) K.pill('1000 ?', 270, 1100, 64, C.red, C.white, E(seg(lt, th, th + 0.25)));
        if (lt > op) K.pill('1 LINE', 800, 1100, 64, GREEN, C.white, E(seg(lt, op, op + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + op, 'slide', { dur: 0.4, gain: 0.2 }); cue(st + be, 'slam', { gain: 0.35 }); cue(st + th, 'pop', { gain: 0.3 });
  }

  // ── 16 · Tomorrow: message queues. ──
  {
    const st = cut(15), to = at('tomorrow', 15) - st, me = at('message', 15) - st;
    add({ id: 'S16', at: st, cam: [540, 700], zoom: 0.03, note: 'waiter winks + points; DAY 15 / 30; NEXT: MESSAGE QUEUES; on "message" a row of order tickets slides in single file',
      draw(lt, d, t) {
        bg();
        K.pill('DAY 15 / 30', 540, 170, 64, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        waiter({ x: 540, y: 1060, s: 0.6, arm: K.ARM.point, finger: Math.sin(lt * 9) * 0.25, eyes: lt > me ? 'wink' : 'n', mouth: 'smirk', smirk: true, brow: 0.6 });
        if (lt > to) K.pill('NEXT: MESSAGE QUEUES', 540, 310, 48, C.ink, C.white, E(seg(lt, to, to + 0.25)));
        if (lt > me) for (let k = 0; k < 4; k++) { const u = eo(seg(lt, me + k * 0.08, me + k * 0.08 + 0.4)); K.ticket(lerp(1300, 240 + k * 200, u), 520, 0.55, 0); }
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + to, 'pop', { gain: 0.3 }); cue(st + me, 'slide', { dur: 0.5, gain: 0.25 });
  }

  return { shots: S, cues: CUES };
}
