// (12/30) CAP THEOREM: the shot list. Continues from day 11 (sharding spread the data across machines).
// What if the machines stop talking? C = consistency (everyone sees the latest data), A = availability (every request
// gets an answer), P = partition tolerance (surviving a broken network). Analogy: two pizza branches sharing one menu,
// the phone line between them is cut right as the price changes. A customer asks the far branch: answer with a
// maybe-old price (available) or say try again later (consistent). During a cut you can't have both. A bank would
// rather wait, a like counter would rather answer. Loop: line cut? pick right or pick fast. Tease: strong vs eventual.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const GREEN = '#5BAE6A', BLUE = '#3A7BD5';
const bg = (ring = '#CFE8F3', base = C.sky) => { fillAll(base); circle(540, 740, 560, ring); };
const warm = () => bg('#F7E3C8', C.bg);
const paper = () => { fillAll(C.bg); circle(540, 740, 600, '#EDE6D6'); };
const waiter = (o) => { K.man(o); K.bowtie(o.x, o.y, o.s); };
const FX = [200, 540, 880];
const SHOPL = [250, 900], SHOPR = [830, 900];          // two branches, origin = bottom centre
const WIRE = [[250, 520], [830, 520]];                  // phone line between their roofs

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const at = (w, i) => Wd(w, i);
  const shops = (cutP = 0, t = 0) => {
    line([[WIRE[0][0], WIRE[0][1]], [WIRE[0][0], 560]], C.ink, 12); line([[WIRE[1][0], WIRE[1][1]], [WIRE[1][0], 560]], C.ink, 12);
    K.phoneLine(WIRE[0][0], WIRE[0][1], WIRE[1][0], WIRE[1][1], cutP, t);
    K.branchShop(SHOPL[0], SHOPL[1], 1, 1, C.red);
    K.branchShop(SHOPR[0], SHOPR[1], 1, 1, BLUE);
  };

  // ── 1 · Yesterday we split our data across machines. ──
  {
    const st = cut(0), ye = at('yesterday', 0) - st, da = at('data', 0) - st, ma = at('machines', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 760], zoom: 0.08, note: 'DAY 12 / 30 pill; YESTERDAY: SHARDING; three SHARD databases drop in one by one from "data"; dashed links between them; glow on "machines"',
      draw(lt, d, t) {
        paper();
        K.pill('DAY 12 / 30', 540, 170, 64, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        if (lt > ye) K.pill('YESTERDAY: SHARDING', 540, 290, 42, C.ink, C.white, E(seg(lt, ye, ye + 0.25)));
        if (lt > ma) for (let k = 0; k < 2; k++) K.dashArc(FX[k] + 90, 760, FX[k + 1] - 90, 760, 60, eo(seg(lt, ma, ma + 0.4)), C.ink, 10, 0.5);
        for (let k = 0; k < 3; k++) {
          const a = 0.2 + k * 0.25; if (lt < a) continue;
          K.database(FX[k], lerp(-300, 900, eob(seg(lt, a, a + 0.4))), 0.5, lt > ma ? 0.5 : 0, 'SHARD ' + (k + 1));
        }
      } });
    cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + ye, 'pop', { gain: 0.3 }); for (let k = 0; k < 3; k++) cue(st + 0.55 + k * 0.25, 'thud', { gain: 0.25 }); cue(st + ma, 'sparkle', { dur: 0.4, gain: 0.25 });
  }

  // ── 2 · But what if they stop talking? ──
  {
    const st = cut(1), wh = at('what', 1) - st, ta = at('talking', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 820], zoom: 0.12, note: 'three databases joined by wires; on "talking" both wires snap (sparks), red slashes on the gaps, databases wobble; NO TALKING red pill',
      draw(lt, d, t) {
        bg();
        const broke = lt > ta;
        for (let k = 0; k < 3; k++) {
          ctx.save(); ctx.translate(FX[k], 900); ctx.rotate(broke ? Math.sin(lt * 18 + k) * 0.04 : 0);
          K.database(0, 0, 0.5, 0, 'SHARD ' + (k + 1)); ctx.restore();
        }
        if (lt > wh) K.pill('WHAT IF…', 540, 300, 70, C.ink, C.white, E(seg(lt, wh, wh + 0.25)));
        for (let k = 0; k < 3; k++) line([[FX[k], 640], [FX[k], 800]], C.ink, 12);
        for (let k = 0; k < 2; k++) K.phoneLine(FX[k], 640, FX[k + 1], 640, broke ? 0.5 * eo(seg(lt, ta, ta + 0.35)) : 0, t);
        if (broke) K.pill('NO TALKING', 540, 1190, 70, C.red, C.white, lerp(1.4, 1, eo(seg(lt, ta, ta + 0.2))));
      } });
    cue(st, 'whoosh'); cue(st + wh, 'pop', { gain: 0.3 }); cue(st + ta, 'zip', { gain: 0.35 }); cue(st + ta + 0.05, 'slam', { gain: 0.3 });
  }

  // ── 3 · That's where the Cap theorem comes in. ──
  {
    const st = cut(2), cp = at('cap', 2) - st, th = at('theorem', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 720], zoom: 0.1, note: 'big C-A-P triangle builds corner by corner from "cap"; CAP THEOREM yellow pill slams on "theorem" with a burst',
      draw(lt, d, t) {
        paper();
        const lit = lt > cp + 0.3 ? 3 : lt > cp + 0.15 ? 2 : lt > cp ? 1 : 0;
        K.capTriangle(540, 780, 1.25 * E(seg(lt, 0.02, 0.35)), lit);
        if (lt > th && lt < th + 0.5) K.burst(540, 260, 3.4, clamp(1 - (lt - th) * 2));
        if (lt > th) K.pill('CAP THEOREM', 540, 260, 96, C.yellow, C.ink, lerp(1.5, 1, eo(seg(lt, th, th + 0.2))));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 3; k++) cue(st + cp + k * 0.15, 'pop', { gain: 0.3 }); cue(st + th, 'slam', { gain: 0.4 });
  }

  // ── 4 · C: consistency, everyone sees the latest data. ──
  {
    const st = cut(3), se = at('sees', 3) - st, la = at('latest', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 760], zoom: 0.08, note: 'C card (yellow) top; two phones below; on "sees" both phones show the same $12 tag; on "latest" green checks + SAME LATEST DATA pill',
      draw(lt, d, t) {
        bg();
        K.letterCard(540, 390, 0.75, 'C', 'CONSISTENCY', C.yellow, E(seg(lt, 0, 0.3)));
        for (const [k, px] of [[0, 290], [1, 790]]) {
          K.phone(px, 900, 0.72, () => {
            if (lt > se + k * 0.1) K.priceTag(0, 0, 0.85 * E(seg(lt, se + k * 0.1, se + k * 0.1 + 0.3)), '$12', { col: C.yellow });
          });
          if (lt > la) K.check(px + 170, 640, 0.22, E(seg(lt, la + k * 0.1, la + k * 0.1 + 0.25)));
        }
        if (lt > la) K.pill('SAME LATEST DATA', 540, 1200, 58, GREEN, C.white, E(seg(lt, la, la + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'pop', { gain: 0.35 }); cue(st + se, 'pop', { gain: 0.25 }); cue(st + se + 0.1, 'pop', { gain: 0.25 }); cue(st + la, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 5 · A: availability, every request gets an answer. ──
  {
    const st = cut(4), rq = at('request', 4) - st, an = at('answer', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 760], zoom: 0.08, note: 'A card (cyan) top; customer left, server database right; on "request" a yellow dot arcs to it; on "answer" a green dot comes back + GOT IT bubble + check',
      draw(lt, d, t) {
        warm();
        K.letterCard(540, 390, 0.75, 'A', 'AVAILABILITY', C.cyan, E(seg(lt, 0, 0.3)));
        K.man({ x: 230, y: 960, s: 0.55, arm: lt > rq && lt < an ? K.ARM.wave : K.ARM.down, eyes: 'n', mouth: lt > an ? 'grin' : 'smile', brow: 0.4, look: 1 });
        K.database(830, 960, 0.6, lt > rq + 0.4 ? 0.5 : 0, 'SERVER');
        if (lt > rq && lt < rq + 0.5) K.dataDot(330, 780, 760, 820, 160, seg(lt, rq, rq + 0.45), C.yellow, 22);
        if (lt > an - 0.35 && lt < an + 0.1) K.dataDot(760, 820, 330, 780, 160, seg(lt, an - 0.35, an + 0.05), GREEN, 22);
        if (lt > an) { K.bubble(280, 640, 0.9, 'GOT IT!', E(seg(lt, an, an + 0.25)), 0); K.check(830, 700, 0.25, E(seg(lt, an, an + 0.25))); }
        if (lt > an) K.pill('ALWAYS ANSWERS', 540, 1200, 58, C.ink, C.cyan, E(seg(lt, an, an + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'pop', { gain: 0.35 }); cue(st + rq, 'slide', { dur: 0.45, gain: 0.25 }); cue(st + an, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 6 · P: partition tolerance, surviving a broken network. ──
  {
    const st = cut(5), pa = at('partition', 5) - st, su = at('surviving', 5) - st, ne = at('network', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.08, note: 'P card (pink) top; two databases joined by a wire; on "partition" the wire snaps + SPLIT pill; on "surviving" both keep glowing + checks; STILL RUNNING pill on "network"',
      draw(lt, d, t) {
        paper();
        K.letterCard(540, 390, 0.75, 'P', 'PARTITION TOLERANCE', C.pink, E(seg(lt, 0, 0.3)));
        K.phoneLine(340, 860, 740, 860, lt > pa ? eo(seg(lt, pa, pa + 0.35)) : 0, t);
        const alive = lt > su ? 0.4 + 0.3 * Math.sin(lt * 8) : 0;
        K.database(200, 970, 0.55, alive, 'NODE 1'); K.database(880, 970, 0.55, alive, 'NODE 2');
        if (lt > su) { K.check(330, 740, 0.2, E(seg(lt, su, su + 0.25))); K.check(750, 740, 0.2, E(seg(lt, su + 0.1, su + 0.35))); }
        if (lt > pa) K.pill('SPLIT!', 540, 1090, 54, C.red, C.white, E(seg(lt, pa, pa + 0.25)));
        if (lt > ne) K.pill('STILL RUNNING', 540, 1210, 62, C.ink, C.white, E(seg(lt, ne, ne + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'pop', { gain: 0.35 }); cue(st + pa, 'zip', { gain: 0.35 }); cue(st + su, 'sparkle', { dur: 0.4, gain: 0.25 }); cue(st + ne, 'pop', { gain: 0.3 });
  }

  // ── 7 · Picture two pizza branches sharing one menu, ──
  {
    const st = cut(6), br = at('branches', 6) - st, me = at('menu', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 760], zoom: 0.08, note: 'two branch shops pop up on "branches" (red left, blue right) with the phone line between roofs; on "menu" both get the same $10 tag + ONE MENU pill',
      draw(lt, d, t) {
        warm();
        const u = E(seg(lt, 0.05, 0.45));
        if (u > 0) { ctx.save(); ctx.translate(540, 900); ctx.scale(u, u); ctx.translate(-540, -900); shops(0, t); ctx.restore(); }
        if (lt > me) { K.priceTag(250, 1080, 0.7 * E(seg(lt, me, me + 0.25)), '$10'); K.priceTag(830, 1080, 0.7 * E(seg(lt, me + 0.1, me + 0.35)), '$10'); }
        if (lt > me) K.pill('ONE MENU', 540, 280, 72, C.yellow, C.ink, E(seg(lt, me, me + 0.25)));
        else if (lt > br) K.pill('2 BRANCHES', 540, 280, 66, C.ink, C.white, E(seg(lt, br, br + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.15, 'pop', { gain: 0.3 }); cue(st + br, 'pop', { gain: 0.3 }); cue(st + me, 'pop', { gain: 0.3 });
  }

  // ── 8 · when the phone line between them gets cut. ──
  {
    const st = cut(7), ph = at('phone', 7) - st, cu = at('cut', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 700], zoom: 0.1, note: 'left price flips $10→$12 at shot start; an update dot runs along the wire from "phone"; scissors snip on "cut" before it arrives, sparks, dot falls; LINE CUT red pill',
      draw(lt, d, t) {
        bg();
        const cP = lt > cu ? eo(seg(lt, cu, cu + 0.35)) : 0;
        shops(cP, t);
        const nw = lt > 0.2;
        K.priceTag(250, 1080, 0.7, nw ? '$12' : '$10', { col: nw ? C.yellow : C.white });
        K.priceTag(830, 1080, 0.7, '$10');
        if (lt > ph - 0.1) {
          if (lt < cu) { const p = K.arcAt(250, 520, 830, 520, -70, seg(lt, ph - 0.1, cu) * 0.45); circle(p[0], p[1], 26, C.ink); circle(p[0], p[1], 19, C.yellow); }
          else { const fy = 580 + (lt - cu) * (lt - cu) * 2400; if (fy < 1300) { circle(500, fy, 26, C.ink); circle(500, fy, 19, C.yellow); } }
        }
        if (lt > cu - 0.3 && lt < cu + 0.5) K.scissors(560, 640, 0.6, lt < cu ? 0.8 : 0.05, -1.4);
        if (lt > cu) K.pill('LINE CUT', 540, 260, 84, C.red, C.white, lerp(1.4, 1, eo(seg(lt, cu, cu + 0.2))));
        else if (lt > ph) K.pill('PRICE UPDATE', 540, 260, 56, C.ink, C.white, E(seg(lt, ph, ph + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.2, 'pop', { gain: 0.3 }); cue(st + ph, 'slide', { dur: 0.5, gain: 0.25 }); cue(st + cu, 'slam', { gain: 0.4 }); cue(st + cu + 0.05, 'zip', { gain: 0.3 });
  }

  // ── 9 · A customer asks for today's price. ──
  {
    const st = cut(8), cu = at('customer', 8) - st, pr = at('price', 8) - st;
    add({ id: 'S09', at: st, cam: [640, 760], zoom: 0.1, note: 'blue branch big centre-right with its $10 tag, broken wire stub above; customer walks in from left on "customer"; bubble TODAY\'S PRICE? on "price"',
      draw(lt, d, t) {
        warm();
        K.branchShop(740, 960, 1.5, 1, BLUE);
        K.priceTag(760, 1130, 0.7, '$10');
        const wx = lerp(-200, 230, eo(seg(lt, cu - 0.2, cu + 0.4)));
        K.man({ x: wx, y: 1010, s: 0.42, arm: lt > pr ? K.ARM.point : K.ARM.down, finger: 0.3, eyes: 'n', mouth: lt > pr ? 'o' : 'smile', brow: 0.6, look: 1 });
        if (lt > pr) K.pill('LINE CUT', 760, 220, 50, C.red, C.white, 1);
        if (lt > pr) K.bubble(300, 560, 0.85, "TODAY'S PRICE?", E(seg(lt, pr, pr + 0.25)), 0);
      } });
    cue(st, 'whoosh'); cue(st + cu - 0.2, 'slide', { dur: 0.5, gain: 0.2 }); cue(st + pr, 'pop', { gain: 0.35 });
  }

  // ── 10 · Give a maybe-old price, and you stay available, ──
  {
    const st = cut(9), mb = at('maybe', 9) - st, av = at('available', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 760], zoom: 0.08, note: 'waiter answers bubble "$10!" right away; the $10 tag greys with a red ? on "maybe-old"; A card + AVAILABLE cyan pill on "available"',
      draw(lt, d, t) {
        bg();
        waiter({ x: 800, y: 980, s: 0.54, arm: K.ARM.point, finger: -0.3, eyes: 'n', mouth: 'grin', brow: 0.5, look: -1 });
        K.man({ x: 260, y: 980, s: 0.52, arm: K.ARM.down, eyes: 'n', mouth: 'smile', brow: 0.4, look: 1 });
        K.bubble(800, 380, 1.1, '$10!', E(seg(lt, 0.05, 0.3)), 0);
        K.priceTag(530, 560, 0.85, '$10', { stale: lt > mb ? E(seg(lt, mb, mb + 0.3)) : 0 });
        if (lt > mb) K.pill('MAYBE OLD', 530, 710, 50, C.red, C.white, E(seg(lt, mb, mb + 0.25)));
        if (lt > av) K.letterCard(230, 330, 0.5, 'A', 'AVAILABLE', C.cyan, E(seg(lt, av, av + 0.3)), -0.08);
        if (lt > av) K.pill('AVAILABLE', 540, 1200, 72, C.cyan, C.ink, lerp(1.3, 1, eo(seg(lt, av, av + 0.2))));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'pop', { gain: 0.35 }); cue(st + mb, 'boing', { gain: 0.25 }); cue(st + av, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 11 · or say try again later, and you stay consistent. ──
  {
    const st = cut(10), tr = at('try', 10) - st, la = at('later', 10) - st, cs = at('consistent', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.08, note: 'waiter hands on hips, bubble TRY AGAIN LATER on "try"; spinner over the customer on "later"; C card + CONSISTENT yellow pill on "consistent"',
      draw(lt, d, t) {
        warm();
        waiter({ x: 800, y: 980, s: 0.54, arm: K.ARM.hip, eyes: 'n', mouth: 'flat', brow: 0.8, look: -1 });
        K.man({ x: 260, y: 980, s: 0.52, arm: K.ARM.down, eyes: 'n', mouth: lt > la ? 'flat' : 'smile', brow: lt > la ? 0.1 : 0.4, look: 1 });
        K.bubble(680, 380, 0.95, 'TRY AGAIN LATER', E(seg(lt, Math.min(tr, 0.1), Math.min(tr, 0.1) + 0.25)), 0);
        if (lt > la) K.spinner(260, 560, 1.0, t);
        if (lt > cs) K.letterCard(540, 660, 0.55, 'C', 'CONSISTENT', C.yellow, E(seg(lt, cs, cs + 0.3)), 0.06);
        if (lt > cs) K.pill('CONSISTENT', 540, 1200, 72, C.yellow, C.ink, lerp(1.3, 1, eo(seg(lt, cs, cs + 0.2))));
      } });
    cue(st, 'whoosh'); cue(st + tr, 'pop', { gain: 0.35 }); cue(st + la, 'tock', { gain: 0.25 }); cue(st + cs, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 12 · During a cut, you can't have both. ──
  {
    const st = cut(11), cu = at('cut', 11) - st, bo = at('both', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 760], zoom: 0.1, note: 'broken wire across the top on "cut"; C and A cards slide toward each other, bump + bounce apart on "both"; red X between them; PICK ONE red pill',
      draw(lt, d, t) {
        paper();
        if (lt > cu - 0.1) K.phoneLine(150, 320, 930, 320, 1, t);
        const bump = lt < bo ? eio(seg(lt, 0.1, bo)) : 1 - eob(seg(lt, bo, bo + 0.35)) * 0.9;
        K.letterCard(lerp(220, 400, bump), 800, 0.7, 'C', 'CONSISTENT', C.yellow, 1, -0.05);
        K.letterCard(lerp(860, 680, bump), 800, 0.7, 'A', 'AVAILABLE', C.cyan, 1, 0.05);
        if (lt > bo) K.redX(540, 800, lerp(1.6, 0.8, eo(seg(lt, bo, bo + 0.2))), 1);
        if (lt > bo) K.pill('PICK ONE', 540, 1200, 80, C.red, C.white, E(seg(lt, bo, bo + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + cu, 'zip', { gain: 0.3 }); cue(st + bo, 'slam', { gain: 0.4 }); cue(st + bo + 0.05, 'boing', { gain: 0.2 });
  }

  // ── 13a · A bank would rather wait, ──
  const likeAt = at('like', 12) - 0.25;
  {
    const st = cut(12), bk = at('bank', 12) - st, wa = at('wait', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 760], zoom: 0.1, note: 'bank building pops on "bank"; spinner + C card + RATHER WAIT pill on "wait"',
      draw(lt, d, t) {
        bg();
        K.bankBuilding(540, 1080, 1.2 * E(seg(lt, bk - 0.15, bk + 0.2)), lt > wa);
        if (lt > wa) { K.spinner(220, 360, 0.8, t); K.letterCard(860, 360, 0.4, 'C', 'CONSISTENT', C.yellow, E(seg(lt, wa, wa + 0.3)), 0.08); }
        if (lt > wa) K.pill('RATHER WAIT', 540, 1200, 70, C.yellow, C.ink, E(seg(lt, wa, wa + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + bk, 'thud', { gain: 0.3 }); cue(st + wa, 'tock', { gain: 0.25 });
  }

  // ── 13b · a like counter would rather answer. ──
  {
    const st = likeAt, co = at('counter', 12) - st, an = Wd('answer', 12) - st;
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.1, note: 'like counter pops on "counter", hearts float up; on "answer" counter ticks up instantly + A card + RATHER ANSWER cyan pill',
      draw(lt, d, t) {
        warm();
        K.likeCounter(540, 760, 1.3 * E(seg(lt, co - 0.25, co + 0.1)), lt > an ? '1,205' : '1,204', lt > an ? clamp(1 - (lt - an) * 3) : 0);
        for (let j = 0; j < 5; j++) {
          const a = co + j * 0.25; if (lt < a) continue;
          const u = seg(lt, a, a + 1.0); if (u >= 1) continue;
          K.heartEmoji(360 + rnd(j + 3) * 360, lerp(600, 330, u), 0.35 * (1 - u * 0.5));
        }
        if (lt > an) K.letterCard(860, 1010, 0.4, 'A', 'AVAILABLE', C.cyan, E(seg(lt, an, an + 0.3)), 0.08);
        if (lt > an) K.pill('RATHER ANSWER', 540, 1200, 66, C.cyan, C.ink, E(seg(lt, an, an + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + co, 'pop', { gain: 0.35 }); cue(st + an, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 14 · Line cut? Pick right, or pick fast. ──
  {
    const st = cut(13), cu = at('cut', 13) - st, ri = at('right', 13) - st, fa = at('fast', 13) - st;
    add({ id: 'S15', at: st, cam: [540, 760], zoom: 0.12, note: 'waiter centre to camera, broken wire overhead on "cut"; C/RIGHT card pops left on "right", A/FAST card right on "fast"; waiter winks + points',
      draw(lt, d, t) {
        bg();
        if (lt > cu - 0.1) K.phoneLine(150, 300, 930, 300, 1, t);
        waiter({ x: 540, y: 980, s: 0.58, arm: lt > fa ? K.ARM.point : K.ARM.hip, finger: Math.sin(lt * 9) * 0.25, eyes: lt > fa ? 'wink' : 'n', mouth: lt > fa ? 'grin' : 'smirk', smirk: true, brow: 0.7 });
        if (lt > ri) K.letterCard(180, 620, 0.55, 'C', 'RIGHT', C.yellow, E(seg(lt, ri, ri + 0.25)), -0.08);
        if (lt > fa) K.letterCard(900, 620, 0.55, 'A', 'FAST', C.cyan, E(seg(lt, fa, fa + 0.25)), 0.08);
        if (lt > cu) K.pill('LINE CUT?', 540, 180, 66, C.red, C.white, E(seg(lt, cu, cu + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + cu, 'zip', { gain: 0.3 }); cue(st + ri, 'pop', { gain: 0.35 }); cue(st + fa, 'pop', { gain: 0.35 }); cue(st + fa + 0.1, 'sparkle', { dur: 0.3, gain: 0.25 });
  }

  // ── 15 · Tomorrow: strong versus eventual consistency. ──
  {
    const st = cut(14), to = at('tomorrow', 14) - st, sg = at('strong', 14) - st, ev = at('eventual', 14) - st;
    add({ id: 'S16', at: st, cam: [540, 700], zoom: 0.03, note: 'DAY 12 / 30 pill; two like counters 1,205 vs 1,198 drop in on "tomorrow" with a red ≠; STRONG pill on "strong", EVENTUAL pill on "eventual"; NEXT pill',
      draw(lt, d, t) {
        paper();
        K.pill('DAY 12 / 30', 540, 170, 64, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        if (lt > to) K.pill('NEXT', 540, 300, 48, C.ink, C.white, E(seg(lt, to, to + 0.25)));
        if (lt > to - 0.05) {
          K.likeCounter(540, 560, 0.95 * E(seg(lt, to - 0.05, to + 0.25)), '1,205');
          K.likeCounter(540, 820, 0.95 * E(seg(lt, to + 0.05, to + 0.35)), '1,198');
          if (lt > to + 0.4) K.pill('≠', 850, 690, 70, C.red, C.white, E(seg(lt, to + 0.4, to + 0.6)));
        }
        if (lt > sg) K.pill('STRONG', 300, 1080, 60, C.ink, C.white, E(seg(lt, sg, sg + 0.25)));
        if (lt > ev) K.pill('EVENTUAL', 770, 1080, 60, C.yellow, C.ink, E(seg(lt, ev, ev + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + to, 'thud', { gain: 0.25 }); cue(st + sg, 'pop', { gain: 0.3 }); cue(st + ev, 'pop', { gain: 0.3 }); cue(st + ev + 0.2, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  return { shots: S, cues: CUES };
}
