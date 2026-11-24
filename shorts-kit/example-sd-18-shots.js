// (18/30) MONOLITH VS MICROSERVICES: the shot list. Analogy: one big kitchen vs a food court.
// Should your app be one big program or lots of small ones? One kitchen cooks everything (pizza, sushi, dessert in one
// room) = a monolith: one app, shipped in one piece. Simple to start, but if the fryer breaks the whole kitchen stops.
// A food court: each stall cooks one thing with its own team = microservices, small apps talking over APIs. Sushi closes,
// pizza keeps selling; a busy stall adds cooks on its own. Twist: now you run ten kitchens, not one, so many teams start
// with a monolith and split it later. Loop: one kitchen to start, a food court to grow. Tease: API gateway.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const GREEN = '#5BAE6A', BLUE = '#3A7BD5', ORANGE = '#F29A3A', PURPLE = '#8A63D2';
const MCOL = [C.yellow, GREEN, ORANGE, C.pink, BLUE, PURPLE];
const bg = (ring = '#CFE8F3', base = C.sky) => { fillAll(base); circle(540, 740, 560, ring); };
const warm = () => bg('#F7E3C8', C.bg);
// the three food-court stalls
const ST = [{ x: 200, label: 'PIZZA', col: C.red, kind: 'pizza' }, { x: 540, label: 'SUSHI', col: BLUE, kind: 'sushi' }, { x: 880, label: 'CAKE', col: PURPLE, kind: 'cake' }];
const qmark = (x, y, s, a, col = C.red) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.fillStyle = col; ctx.font = `900 ${Math.max(1, 120 * s)}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?', x, y); ctx.restore(); };

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const at = (w, i) => Wd(w, i);

  // ── 1 · Should your app be one big program, or lots of small ones? ──
  {
    const st = cut(0), ap = at('app', 0) - st, bi = at('big', 0) - st, sm = at('small', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 720], zoom: 0.08, note: 'DAY 18 / 30; one navy block pops on "app"; ONE BIG? pill on "big"; on "small" it splits into six coloured blocks + LOTS OF SMALL? pill',
      draw(lt, d, t) {
        bg();
        K.pill('DAY 18 / 30', 540, 170, 64, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        K.splitBlock(540, 720, 1.05 * E(seg(lt, 0.05, 0.35)), eo(seg(lt, sm, sm + 0.45)), t);
        if (lt > bi && lt < sm) K.pill('ONE BIG?', 540, 1110, 66, C.ink, C.white, E(seg(lt, bi, bi + 0.25)));
        if (lt > sm) K.pill('LOTS OF SMALL?', 540, 1110, 66, C.ink, C.white, E(seg(lt, sm, sm + 0.25)));
        if (lt > bi) { qmark(160, 520, 1, seg(lt, bi, bi + 0.3)); qmark(930, 560, 0.8, seg(lt, sm, sm + 0.3), BLUE); }
      } });
    cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + 0.1, 'thud', { gain: 0.3 }); cue(st + bi, 'pop', { gain: 0.25 }); cue(st + sm, 'sparkle', { dur: 0.5, gain: 0.25 });
  }

  // ── 2 · Picture one kitchen that cooks everything, ──
  {
    const st = cut(1), ki = at('kitchen', 1) - st, ev = at('everything', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 700], zoom: 0.1, note: 'the big kitchen building springs up; ONE KITCHEN pill on "kitchen"; cooks bob in the three windows; food pops in all windows on "everything"',
      draw(lt, d, t) {
        warm();
        K.bigKitchen(540, 760, 1.15, t, lt > ev ? (lt - ev) * 6 : 0, 0, 'KITCHEN', E(seg(lt, 0.05, 0.4)));
        if (lt > ki) K.pill('ONE KITCHEN', 540, 230, 70, C.yellow, C.ink, E(seg(lt, ki, ki + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'thud', { gain: 0.3 }); cue(st + ki, 'pop', { gain: 0.3 }); cue(st + ev, 'pop', { gain: 0.2 }); cue(st + ev + 0.17, 'pop', { gain: 0.2 }); cue(st + ev + 0.34, 'pop', { gain: 0.2 });
  }

  // ── 3 · pizza, sushi, dessert, all in one room. ──
  {
    const st = cut(2), pz = at('pizza', 2) - st, su = at('sushi', 2) - st, de = at('dessert', 2) - st, ro = at('room', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 760], zoom: 0.08, note: 'kitchen (no food yet in windows); big food icons pop above on "pizza" "sushi" "dessert"; on "room" they drop into the windows and a 1 ROOM pill slams',
      draw(lt, d, t) {
        warm();
        const dr = eio(seg(lt, ro - 0.1, ro + 0.35));
        K.bigKitchen(540, 860, 1.15, t, lt > ro + 0.3 ? 3 : 0, 0, 'KITCHEN');
        [[pz, 'pizza'], [su, 'sushi'], [de, 'cake']].forEach(([w, k], i) => {
          if (lt > w && dr < 1) { const x0 = 250 + i * 290, x1 = 540 + (-250 + i * 250 + 50) * 1.15, y1 = 860 - 40 * 1.15; K.foodIcon(lerp(x0, x1, dr), lerp(330, y1, dr), lerp(1.3, 0.7, dr), k, 0, E(seg(lt, w, w + 0.25))); }
        });
        if (lt > ro) K.pill('1 ROOM', 540, 220, 76, C.ink, C.white, lerp(1.5, 1, eo(seg(lt, ro, ro + 0.2))));
      } });
    cue(st, 'whoosh'); cue(st + pz, 'pop', { gain: 0.3 }); cue(st + su, 'pop', { gain: 0.3 }); cue(st + de, 'pop', { gain: 0.3 }); cue(st + ro, 'slam', { gain: 0.3 });
  }

  // ── 4 · That's a monolith: one app, shipped in one piece. ──
  {
    const st = cut(3), mo = at('monolith', 3) - st, ap = at('app', 3) - st, sh = at('shipped', 3) - st, pi = at('piece', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 720], zoom: 0.1, note: 'MONOLITH pill slams; on "app" a navy block labelled 1 APP; on "shipped" the whole block slides right onto a server; ONE PIECE pill on "piece"',
      draw(lt, d, t) {
        bg();
        if (lt > mo && lt < mo + 0.5) K.burst(540, 260, 3.2, clamp(1 - (lt - mo) * 2));
        K.pill(lt > mo ? 'MONOLITH' : '???', 540, 260, 100, lt > mo ? C.yellow : C.ink, lt > mo ? C.ink : C.white, lt > mo ? lerp(1.6, 1, eo(seg(lt, mo, mo + 0.2))) : E(seg(lt, 0, 0.25)));
        K.server(800, 800, 0.75, t);
        const g = eio(seg(lt, sh, pi + 0.1)), bx = lerp(330, 800, g), by = lerp(760, 470, g), bs = lerp(0.85, 0.55, g);
        K.splitBlock(bx, by, bs * E(seg(lt, ap - 0.25, ap + 0.05)), 0, t);
        if (lt > ap && g < 0.3) K.pill('1 APP', 330, 1030, 60, C.ink, C.white, E(seg(lt, ap, ap + 0.25)));
        if (lt > pi) K.pill('ONE PIECE', 540, 1120, 70, C.yellow, C.ink, E(seg(lt, pi, pi + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + mo, 'slam', { gain: 0.35 }); cue(st + ap, 'pop', { gain: 0.3 }); cue(st + sh, 'slide', { dur: 0.6, gain: 0.22 }); cue(st + pi + 0.1, 'thud', { gain: 0.3 });
  }

  // ── 5 · Simple to start, but if the fryer breaks, ──
  {
    const st = cut(4), si = at('simple', 4) - st, fr = at('fryer', 4) - st, br = at('breaks', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 760], zoom: 0.14, note: 'green SIMPLE ✓ pill; on "fryer" a fryer slides in big; on "breaks" sparks, red blinking light, smoke + warning sign',
      draw(lt, d, t) {
        warm();
        K.pill('SIMPLE ✓', 540, 230, 70, GREEN, C.white, E(seg(lt, si, si + 0.25)) * (lt < fr ? 1 : lerp(1, 0.85, seg(lt, fr, fr + 0.2))));
        const fy = 820 + (lt > br ? Math.sin(lt * 40) * 6 : 0);
        if (lt > br) K.kitchenSmoke(540, fy - 220, 1, t, seg(lt, br, br + 0.3));
        K.fryer(540, fy, 1.25, t, lt > br ? 1 : 0);
        if (lt > fr && lt < br) K.pill('FRYER', 540, 1150, 56, C.ink, C.white, E(seg(lt, fr, fr + 0.25)));
        if (lt > br) K.warning(860, 520, 0.6 * E(seg(lt, br, br + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + si, 'pop', { gain: 0.3 }); cue(st + fr, 'pop', { gain: 0.2 }); cue(st + br, 'slam', { gain: 0.35 }); cue(st + br + 0.1, 'sizzle', { dur: 0.6, gain: 0.18 });
  }

  // ── 6 · the whole kitchen stops. ──
  {
    const st = cut(5), wh = at('whole', 5) - st, so = at('stops', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.1, note: 'big kitchen with smoke rising from the left window; on "stops" ALL the lights go out (grey), red X slams, ALL DOWN pill',
      draw(lt, d, t) {
        warm();
        K.kitchenSmoke(330, 560, 0.9, t, 1);
        K.bigKitchen(540, 820, 1.1, t, 3, lt > so ? 1 : 0, 'KITCHEN');
        if (lt > wh && lt < so) K.pill('WHOLE KITCHEN?', 540, 230, 60, C.ink, C.white, E(seg(lt, wh, wh + 0.25)));
        if (lt > so) { K.redX(540, 800, lerp(1.6, 0.95, eo(seg(lt, so, so + 0.2))), 1); K.pill('ALL DOWN', 540, 230, 80, C.red, C.white, E(seg(lt, so, so + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + wh, 'pop', { gain: 0.2 }); cue(st + so, 'slam', { gain: 0.4 }); cue(st + so + 0.1, 'alarm', { dur: 0.8, gain: 0.15 });
  }

  // ── 7 · Now picture a food court, ──
  {
    const st = cut(6), fo = at('food', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 760], zoom: 0.1, note: 'three separate stalls (PIZZA / SUSHI / CAKE) pop in one by one; FOOD COURT pill on "food"',
      draw(lt, d, t) {
        bg();
        ST.forEach((s, k) => K.foodStall(s.x, 780, 0.95, s.label, s.col, s.kind, t + k, 1, 0, E(seg(lt, 0.1 + k * 0.15, 0.4 + k * 0.15))));
        if (lt > fo) K.pill('FOOD COURT', 540, 250, 76, C.yellow, C.ink, E(seg(lt, fo, fo + 0.25)));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 3; k++) cue(st + 0.1 + k * 0.15, 'pop', { gain: 0.22 }); cue(st + fo, 'pop', { gain: 0.3 });
  }

  // ── 8 · where each stall cooks one thing with its own team. ──
  {
    const st = cut(7), ea = at('each', 7) - st, on = at('one', 7) - st, ow = at('own', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 820], zoom: 0.08, note: 'stalls bounce one by one on "each"; on "one" a 1 THING pill; on "own team" each stall gets a coloured team of 2 person icons below it',
      draw(lt, d, t) {
        warm();
        ST.forEach((s, k) => { const b = Math.sin(Math.PI * clamp((lt - ea - k * 0.15) / 0.3)) * 30; K.foodStall(s.x, 680 - b, 0.95, s.label, s.col, s.kind, t + k);
          for (let j = 0; j < 2; j++) K.personIcon(s.x - 55 + j * 110, 1130, 1.05 * E(seg(lt, ow + k * 0.1 + j * 0.05, ow + k * 0.1 + j * 0.05 + 0.25)), s.col); });
        if (lt > on) K.pill('1 THING EACH', 540, 210, 64, C.ink, C.white, E(seg(lt, on, on + 0.25)));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 3; k++) cue(st + ea + k * 0.15, 'boing', { gain: 0.12 }); cue(st + on, 'pop', { gain: 0.3 }); cue(st + ow, 'pop', { gain: 0.25 });
  }

  // ── 9 · That's microservices: small apps that talk over APIs. ──
  {
    const st = cut(8), mi = at('microservices', 8) - st, sm = at('small', 8) - st, ta = at('talk', 8) - st, ap = at('apis', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 760], zoom: 0.1, note: 'MICROSERVICES pill slams; on "small" three service boxes (PIZZA/SUSHI/CAKE) pop; on "talk" dashed links + message cards travel between them; API tags on "APIs"',
      draw(lt, d, t) {
        bg();
        if (lt > mi && lt < mi + 0.5) K.burst(540, 260, 3.4, clamp(1 - (lt - mi) * 2));
        if (lt > mi) K.pill('MICROSERVICES', 540, 260, 84, C.yellow, C.ink, lerp(1.5, 1, eo(seg(lt, mi, mi + 0.2))));
        const pos = [[220, 1000], [540, 620], [860, 1000]];
        if (lt > ta) { K.dashArc(300, 930, 470, 690, 40, eo(seg(lt, ta, ta + 0.35)), C.ink, 8, 0.4); K.dashArc(610, 690, 780, 930, 40, eo(seg(lt, ta + 0.1, ta + 0.45)), C.ink, 8, 0.4); K.dashArc(320, 1040, 760, 1040, 60, eo(seg(lt, ta + 0.2, ta + 0.55)), C.ink, 8, 0.4); }
        pos.forEach(([x, y], k) => K.serviceBox(x, y, 0.9, ST[k].label, ST[k].col, t + k, null, E(seg(lt, 0.05 + k * 0.1, 0.3 + k * 0.1))));
        if (lt > ta) { const g = ((lt - ta) * 0.9) % 1; const [x1, y1] = K.arcAt(300, 930, 470, 690, 40, eio(g)); K.msgCard(x1, y1, 0.5, C.yellow); const [x2, y2] = K.arcAt(780, 930, 610, 690, 40, eio((g + 0.5) % 1)); K.msgCard(x2, y2, 0.5, GREEN); }
        if (lt > ap) { K.pill('API', 340, 760, 48, C.ink, C.white, E(seg(lt, ap, ap + 0.25))); K.pill('API', 740, 760, 48, C.ink, C.white, E(seg(lt, ap + 0.08, ap + 0.33))); }
      } });
    cue(st, 'whoosh'); cue(st + mi, 'slam', { gain: 0.35 }); cue(st + sm, 'pop', { gain: 0.25 }); cue(st + ta, 'slide', { dur: 0.6, gain: 0.2 }); cue(st + ap, 'pop', { gain: 0.3 });
  }

  // ── 10 · If sushi closes, pizza keeps selling, ──
  {
    const st = cut(9), su = at('sushi', 9) - st, cl = at('closes', 9) - st, pz = at('pizza', 9) - st, se = at('selling', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 780], zoom: 0.1, note: 'three stalls; on "closes" SUSHI shutter rolls down (CLOSED); on "pizza" open stalls bounce; food goes to their customers; OTHERS STILL OPEN pill on "selling"',
      draw(lt, d, t) {
        warm();
        ST.forEach((s, k) => { const b = k !== 1 && lt > pz ? Math.abs(Math.sin((lt - pz) * 7)) * 14 : 0; K.foodStall(s.x, 720 - b, 0.95, s.label, s.col, s.kind, t + k, 1, k === 1 ? eio(seg(lt, cl, cl + 0.4)) : 0); });
        for (const k of [0, 2]) { K.personIcon(ST[k].x - 40, 1140, 1, MCOL[k + 2]); K.personIcon(ST[k].x + 60, 1140, 1, MCOL[k + 3]);
          if (lt > se) { const g = ((lt - se) * 1.4 + k * 0.3) % 1; K.foodIcon(ST[k].x, lerp(900, 1060, g), 0.4, ST[k].kind, 0, 1 - g * 0.3); } }
        if (lt > su && lt < cl) K.pill('SUSHI', 540, 230, 60, BLUE, C.white, E(seg(lt, su, su + 0.25)));
        if (lt > se) K.pill('OTHERS STILL OPEN', 540, 230, 60, GREEN, C.white, E(seg(lt, se, se + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + cl, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + cl + 0.4, 'thud', { gain: 0.3 }); cue(st + pz, 'pop', { gain: 0.25 }); cue(st + se, 'sparkle', { dur: 0.5, gain: 0.22 });
  }

  // ── 11 · and a busy stall adds cooks on its own. ──
  {
    const st = cut(10), bu = at('busy', 10) - st, co = at('cooks', 10) - st, ow = at('own', 10) - st;
    add({ id: 'S11', at: st, cam: [380, 760], zoom: 0.1, note: 'PIZZA stall big left with a customer line (BUSY! pill); on "cooks" two more cooks pop into its window (3 cooks); +2 COOKS pill; other stalls small on the right unchanged',
      draw(lt, d, t) {
        warm();
        K.foodStall(330, 700, 1.3, 'PIZZA', C.red, 'pizza', t, lt > co ? Math.min(3, 1 + (lt - co) * 5) : 1);
        for (let k = 0; k < 2; k++) K.foodStall(860, 520 + k * 420, 0.62, ST[k + 1].label, ST[k + 1].col, ST[k + 1].kind, t + k);
        for (let j = 0; j < 4; j++) K.personIcon(140 + j * 130, 1160, 0.95 * E(seg(lt, bu - 0.2 + j * 0.07, bu + j * 0.07)), MCOL[(j + 1) % 6]);
        if (lt > bu && lt < co) K.pill('BUSY!', 330, 230, 70, C.red, C.white, E(seg(lt, bu, bu + 0.25)));
        if (lt > co) K.pill('+2 COOKS', 330, 230, 70, C.yellow, C.ink, E(seg(lt, co, co + 0.25)));
        if (lt > ow) K.pill('ONLY PIZZA', 860, 260, 46, C.ink, C.white, E(seg(lt, ow, ow + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + bu, 'pop', { gain: 0.25 }); cue(st + co, 'pop', { gain: 0.3 }); cue(st + co + 0.2, 'pop', { gain: 0.25 }); cue(st + ow, 'pop', { gain: 0.2 });
  }

  // ── 12 · But now you're running ten kitchens, not one. ──
  {
    const st = cut(11), ru = at('running', 11) - st, te = at('ten', 11) - st, no = at('not', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 740], zoom: 0.12, note: 'one stall, then ten small stalls pop in a 5x2 grid on "ten" with tangled red dashed links; 10 KITCHENS red pill; MORE TO RUN on "not"',
      draw(lt, d, t) {
        bg();
        const P = []; for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) P.push([140 + c * 200, 700 + r * 400]);
        if (lt > te + 0.3) for (let k = 0; k < 9; k++) { const a = P[k], b = P[(k * 3 + 4) % 10]; K.dashArc(a[0], a[1] - 60, b[0], b[1] - 60, 50, eo(seg(lt, te + 0.3 + k * 0.04, te + 0.6 + k * 0.04)), C.red, 6, 0.4); }
        P.forEach(([x, y], k) => { const s = ST[k % 3]; K.foodStall(x, y, 0.42, s.label, s.col, s.kind, t + k, 1, 0, E(seg(lt, te - 0.15 + k * 0.04, te + 0.1 + k * 0.04))); });
        if (lt < te - 0.15) K.foodStall(540, 760, 0.9, 'PIZZA', C.red, 'pizza', t);
        if (lt > te) K.pill('10 KITCHENS', 540, 240, 76, C.red, C.white, E(seg(lt, te, te + 0.25)));
        else if (lt > ru) K.pill('RUNNING…', 540, 240, 66, C.ink, C.white, E(seg(lt, ru, ru + 0.25)));
        if (lt > no) K.pill('MORE TO RUN', 540, 420, 52, C.ink, C.white, E(seg(lt, no, no + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ru, 'pop', { gain: 0.2 }); for (let k = 0; k < 10; k += 2) cue(st + te - 0.15 + k * 0.04, 'pop', { gain: 0.14 }); cue(st + te + 0.3, 'slide', { dur: 0.5, gain: 0.18 }); cue(st + no, 'boing', { gain: 0.25 });
  }

  // ── 13 · So many teams start with a monolith and split it later. ──
  {
    const st = cut(12), ma = at('many', 12) - st, mo = at('monolith', 12) - st, sp = at('split', 12) - st, la = at('later', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 740], zoom: 0.1, note: 'team icons; 1. START: MONOLITH pill + one navy block on "monolith"; on "split" it breaks into six coloured blocks; 2. SPLIT LATER pill on "later"',
      draw(lt, d, t) {
        warm();
        if (lt > ma && lt < mo) K.pill('MANY TEAMS', 540, 240, 64, C.ink, C.white, E(seg(lt, ma, ma + 0.25)));
        if (lt > mo) K.pill('1. START: MONOLITH', 540, 240, 60, C.ink, C.white, E(seg(lt, mo, mo + 0.25)));
        if (lt > ma) for (let j = 0; j < 3; j++) K.personIcon(400 + j * 140, 470, 1 * E(seg(lt, ma + j * 0.06, ma + 0.25 + j * 0.06)), MCOL[j + 1]);
        K.splitBlock(540, 840, 0.95 * E(seg(lt, 0.05, 0.35)), eo(seg(lt, sp, sp + 0.5)), t);
        if (lt > la) K.pill('2. SPLIT LATER', 540, 1150, 64, C.yellow, C.ink, E(seg(lt, la, la + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ma, 'pop', { gain: 0.25 }); cue(st + mo, 'thud', { gain: 0.3 }); cue(st + sp, 'sparkle', { dur: 0.5, gain: 0.25 }); cue(st + la, 'pop', { gain: 0.3 });
  }

  // ── 14 · One kitchen to start, a food court to grow. ──
  {
    const st = cut(13), ki = at('kitchen', 13) - st, fo = at('food', 13) - st, gr = at('grow', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.1, note: 'hero chef bottom; on "kitchen" a small kitchen pops top-left (START); on "food court" three small stalls pop top-right (GROW) with an arrow between; hero winks on "grow"',
      draw(lt, d, t) {
        bg();
        const ks = E(seg(lt, ki - 0.1, ki + 0.2)), fs = E(seg(lt, fo - 0.1, fo + 0.2));
        K.bigKitchen(250, 470, 0.36, t, 3, 0, 'KITCHEN', ks);
        if (ks > 0) K.pill('START', 250, 290, 50, C.ink, C.white, ks);
        for (let k = 0; k < 3; k++) K.foodStall(700 + k * 140, 480, 0.36, ST[k].label, ST[k].col, ST[k].kind, t + k, 1, 0, E(seg(lt, fo - 0.1 + k * 0.08, fo + 0.2 + k * 0.08)));
        if (fs > 0) K.arrow(500, 480, 130, 0, fs);
        if (lt > gr) K.pill('GROW', 840, 290, 50, C.yellow, C.ink, E(seg(lt, gr, gr + 0.25)));
        K.man({ x: 540, y: 1000, s: 0.42, arm: lt > gr ? K.ARM.point : K.ARM.wave, finger: lt > gr ? 0.3 : null, eyes: lt > gr ? 'wink' : 'n', mouth: lt > gr ? 'grin' : 'smile', brow: 0.6 });
        K.chefHat(540, 1000, 0.42, 1);
      } });
    cue(st, 'whoosh'); cue(st + ki, 'pop', { gain: 0.3 }); cue(st + fo, 'pop', { gain: 0.3 }); cue(st + gr, 'sparkle', { dur: 0.5, gain: 0.22 });
  }

  // ── 15 · Tomorrow: the API gateway. ──
  {
    const st = cut(14), to = at('tomorrow', 14) - st, ap = at('api', 14) - st, ga = at('gateway', 14) - st;
    add({ id: 'S15', at: st, cam: [540, 700], zoom: 0.03, note: 'DAY 18 / 30; NEXT pill; the A-P-I gate lights letter by letter on "API" and bursts on "gateway"',
      draw(lt, d, t) {
        bg();
        K.pill('DAY 18 / 30', 540, 170, 64, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        if (lt > to) K.pill('NEXT: API GATEWAY', 540, 310, 56, C.ink, C.white, E(seg(lt, to, to + 0.25)));
        const l = (k) => clamp((lt - ap - k * 0.12) * 5);
        K.apiGate(540, 900, 1.05, [l(0), l(1), l(2)], E(seg(lt, 0.05, 0.35)));
        if (lt > ga && lt < ga + 0.6) K.burst(540, 640, 3, clamp(1 - (lt - ga) * 1.8));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + to, 'pop', { gain: 0.3 }); cue(st + ap, 'pop', { gain: 0.25 }); cue(st + ga, 'sparkle', { dur: 0.5, gain: 0.25 });
  }

  return { shots: S, cues: CUES };
}
