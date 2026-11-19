// (13/30) STRONG vs EVENTUAL CONSISTENCY: the shot list. Continues from day 12 (CAP theorem, pizza branches, like counter).
// Hook: you like a post, your friend still sees the old number. Not a bug: eventual consistency. Analogy: the two pizza
// branches, price changes $10 → $12. Strong: no branch answers until every branch has the new price (right, but you
// wait). Eventual: each branch answers right away, so one still says $10 for a moment, then the news arrives and they
// agree. Bank balance needs strong; a like counter is fine with eventual (faster). Loop: the count isn't wrong, it's
// catching up. Tease: tomorrow, cache eviction (what gets kicked out of a full cache).
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const GREEN = '#5BAE6A', BLUE = '#3A7BD5';
const bg = (ring = '#CFE8F3', base = C.sky) => { fillAll(base); circle(540, 740, 560, ring); };
const warm = () => bg('#F7E3C8', C.bg);
const paper = () => { fillAll(C.bg); circle(540, 740, 600, '#EDE6D6'); };
const waiter = (o) => { K.man(o); K.bowtie(o.x, o.y, o.s); };
const SHOPL = [250, 820], SHOPR = [830, 820];          // two branches, origin = bottom centre
const WY = 450;                                        // phone wire height between the roofs

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const at = (w, i) => Wd(w, i);
  // branches + wire; tags: [leftText, rightText, rightStale]; dot u 0..1 = update travelling left → right
  const shops = (t, tags = ['$10', '$10', 0], dot = -1, glow = [0, 0]) => {
    line([[SHOPL[0], WY], [SHOPL[0], SHOPL[1] - 340]], C.ink, 12); line([[SHOPR[0], WY], [SHOPR[0], SHOPR[1] - 340]], C.ink, 12);
    K.phoneLine(SHOPL[0], WY, SHOPR[0], WY, 0, t);
    K.branchShop(SHOPL[0], SHOPL[1], 1, 1, C.red);
    K.branchShop(SHOPR[0], SHOPR[1], 1, 1, BLUE);
    K.priceTag(SHOPL[0], SHOPL[1] + 110, 0.62, tags[0], { col: tags[0] === '$12' ? C.yellow : C.white });
    K.priceTag(SHOPR[0], SHOPR[1] + 110, 0.62, tags[1], { col: tags[1] === '$12' ? C.yellow : C.white, stale: tags[2] || 0 });
    if (dot >= 0 && dot <= 1) { const p = K.arcAt(SHOPL[0], WY, SHOPR[0], WY, -70, dot); circle(p[0], p[1], 28, C.ink); circle(p[0], p[1], 20, C.yellow); }
  };

  // ── 1 · You like a post, and the count goes up, ──
  {
    const st = cut(0), li = at('like', 0) - st, go = at('goes', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 760], zoom: 0.1, note: 'DAY 13 / 30 pill; phone with a pizza post; finger taps heart on "like", heart fills red; count 1,204 → 1,205 on "goes" with a burst',
      draw(lt, d, t) {
        paper();
        K.pill('DAY 13 / 30', 540, 170, 64, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        const liked = lt > li + 0.15;
        K.phone(540, 780, 1.05, () => K.postCard(0, -10, 1.0, liked ? 1 : 0, lt > go ? '1,205' : '1,204', liked ? clamp(1 - (lt - li - 0.15) * 4) : 0));
        K.tapFinger(540 - 95 * 1.05, 780 + 135 * 1.05, eo(seg(lt, li - 0.35, li + 0.1)) * (1 - eo(seg(lt, li + 0.4, li + 0.8))), lt > li && lt < li + 0.3 ? 1 : 0);
        if (lt > go && lt < go + 0.5) K.burst(620, 930, 1.6, clamp(1 - (lt - go) * 2));
        if (lt > go) K.pill('+1', 820, 600, 70, C.red, C.white, E(seg(lt, go, go + 0.25)));
      } });
    cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + li + 0.12, 'pop', { gain: 0.35 }); cue(st + go, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 2 · but your friend still sees the old number. ──
  {
    const st = cut(1), fr = at('friend', 1) - st, ol = at('old', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 760], zoom: 0.1, note: 'two phones: YOU 1,205 left; FRIEND phone slides in on "friend" with 1,204; on "old" red behind badge + OLD red pill',
      draw(lt, d, t) {
        bg();
        K.phone(290, 760, 0.82, () => K.postCard(0, -10, 1.0, 1, '1,205'));
        K.pill('YOU', 290, 330, 50, C.ink, C.white, 1);
        if (lt > fr - 0.2) {
          const x = lerp(1300, 790, eo(seg(lt, fr - 0.2, fr + 0.2)));
          K.phone(x, 760, 0.82, () => K.postCard(0, -10, 1.0, 0, '1,204'));
          K.pill('FRIEND', x, 330, 50, C.ink, C.white, 1);
        }
        if (lt > ol) { K.syncBadge(940, 470, 1, false, E(seg(lt, ol, ol + 0.25)), t); K.pill('OLD NUMBER', 790, 1200, 58, C.red, C.white, E(seg(lt, ol, ol + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + fr - 0.2, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + ol, 'boing', { gain: 0.25 });
  }

  // ── 3 · That's not a bug. It's eventual consistency. ──
  {
    const st = cut(2), bu = at('bug', 2) - st, ev = at('eventual', 2) - st, co = at('consistency', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 720], zoom: 0.1, note: 'green beetle crawls in, red X slams on "bug"; on "eventual" X+bug zip off, EVENTUAL yellow pill slams + CONSISTENCY ink pill on "consistency"',
      draw(lt, d, t) {
        paper();
        const gone = lt > ev ? eo(seg(lt, ev, ev + 0.3)) : 0;
        ctx.save(); ctx.translate(-gone * 1200, 0);
        K.beetle(lerp(-200, 540, eo(seg(lt, 0, 0.5))), 760, 1.4, t, 0);
        if (lt > bu) K.redX(540, 760, lerp(1.4, 0.8, eo(seg(lt, bu, bu + 0.2))), 1);
        ctx.restore();
        if (lt > ev) {
          if (lt < ev + 0.5) K.burst(540, 700, 3.2, clamp(1 - (lt - ev) * 2));
          K.pill('EVENTUAL', 540, 700, 110, C.yellow, C.ink, lerp(1.5, 1, eo(seg(lt, ev, ev + 0.2))));
        }
        if (lt > co) K.pill('CONSISTENCY', 540, 880, 70, C.ink, C.white, E(seg(lt, co, co + 0.25)));
        if (lt > bu && lt < ev) K.pill('NOT A BUG', 540, 1180, 66, C.red, C.white, E(seg(lt, bu, bu + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + bu, 'slam', { gain: 0.35 }); cue(st + ev, 'zip', { gain: 0.3 }); cue(st + ev + 0.05, 'slam', { gain: 0.35 }); cue(st + co, 'pop', { gain: 0.3 });
  }

  // ── 4 · Remember our two pizza branches? ──
  {
    const st = cut(3), re = at('remember', 3) - st, br = at('branches', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 700], zoom: 0.08, note: 'YESTERDAY: CAP pill on "remember"; two branches + intact phone line pop in on "branches" with $10 tags',
      draw(lt, d, t) {
        warm();
        if (lt > re) K.pill('YESTERDAY: CAP', 540, 220, 52, C.ink, C.white, E(seg(lt, re, re + 0.25)));
        const u = E(seg(lt, 0.15, 0.55));
        if (u > 0) { ctx.save(); ctx.translate(540, 820); ctx.scale(u, u); ctx.translate(-540, -820); shops(t); ctx.restore(); }
        if (lt > br) K.pill('2 BRANCHES', 540, 1180, 62, C.yellow, C.ink, E(seg(lt, br, br + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + re, 'pop', { gain: 0.3 }); cue(st + br - 0.1, 'pop', { gain: 0.35 });
  }

  // ── 5 · The price just changed from ten to twelve dollars. ──
  {
    const st = cut(4), ch = at('changed', 4) - st, tw = at('twelve', 4) - st;
    add({ id: 'S05', at: st, cam: [250, 760], zoom: 0.14, note: 'left branch tag flips $10 → $12 (yellow) on "twelve" with a burst; NEW PRICE pill on "changed"; right still $10',
      draw(lt, d, t) {
        bg();
        shops(t, [lt > tw ? '$12' : '$10', '$10', 0]);
        if (lt > tw && lt < tw + 0.5) K.burst(SHOPL[0], SHOPL[1] + 110, 2.2, clamp(1 - (lt - tw) * 2));
        if (lt > ch) K.pill('NEW PRICE!', 250, 250, 60, C.red, C.white, E(seg(lt, ch, ch + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ch, 'pop', { gain: 0.3 }); cue(st + tw, 'sparkle', { dur: 0.35, gain: 0.3 });
  }

  // ── 6 · With strong consistency, no branch answers ──
  {
    const st = cut(5), sg = at('strong', 5) - st, an = at('answers', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.08, note: 'STRONG yellow pill top on "strong"; customer at blue branch asks "PRICE?"; on "answers" waiter hands on hips + red NO ANSWER YET pill + spinner',
      draw(lt, d, t) {
        warm();
        if (lt > sg) K.pill('STRONG CONSISTENCY', 540, 200, 58, C.yellow, C.ink, lerp(1.4, 1, eo(seg(lt, sg, sg + 0.2))));
        K.branchShop(760, 900, 1.3, 1, BLUE);
        waiter({ x: 830, y: 1010, s: 0.4, arm: K.ARM.hip, eyes: 'n', mouth: 'flat', brow: 0.7, look: -1 });
        K.man({ x: 250, y: 1010, s: 0.42, arm: K.ARM.point, finger: 0.3, eyes: 'n', mouth: 'o', brow: 0.6, look: 1 });
        K.bubble(270, 560, 0.8, 'PRICE?', E(seg(lt, 0.05, 0.3)), 0);
        if (lt > an) { K.spinner(960, 400, 0.9, t); K.pill('NO ANSWER YET', 540, 1190, 58, C.red, C.white, E(seg(lt, an, an + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'pop', { gain: 0.3 }); cue(st + sg, 'slam', { gain: 0.3 }); cue(st + an, 'tock', { gain: 0.25 });
  }

  // ── 7 · until every branch has the new price. ──
  {
    const st = cut(6), ev = at('every', 6) - st, pr = at('price', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 700], zoom: 0.08, note: 'update dot runs along the wire from "every"; right tag flips to $12 on "price"; green sync badges on both; then waiter bubble $12!',
      draw(lt, d, t) {
        bg();
        const u = seg(lt, ev - 0.1, pr);
        shops(t, ['$12', lt > pr ? '$12' : '$10', 0], lt < pr ? u : -1);
        if (lt < pr) K.spinner(SHOPR[0], 260, 0.7, t);
        if (lt > pr) { K.syncBadge(SHOPL[0] + 150, 300, 1, true, E(seg(lt, pr, pr + 0.25))); K.syncBadge(SHOPR[0] - 150, 300, 1, true, E(seg(lt, pr + 0.1, pr + 0.35))); }
        if (lt > pr) K.pill('ALL UPDATED', 540, 1180, 62, GREEN, C.white, E(seg(lt, pr, pr + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ev - 0.1, 'slide', { dur: 0.8, gain: 0.25 }); cue(st + pr, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 8 · Always right, but you wait. ──
  {
    const st = cut(7), ri = at('right', 7) - st, wa = at('wait', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 760], zoom: 0.1, note: 'customer gets $12 bubble; green check + RIGHT pill on "right"; on "wait" stopwatch hand sweeps + WAIT red pill, customer brow drops',
      draw(lt, d, t) {
        warm();
        K.man({ x: 540, y: 1010, s: 0.5, arm: K.ARM.down, eyes: 'n', mouth: lt > wa ? 'flat' : 'smile', brow: lt > wa ? 0.1 : 0.5 });
        K.priceTag(540, 340, 0.8, '$12', { col: C.yellow });
        if (lt > ri) { K.check(270, 560, 0.5, E(seg(lt, ri, ri + 0.25))); K.pill('RIGHT', 270, 720, 58, GREEN, C.white, E(seg(lt, ri, ri + 0.25))); }
        if (lt > wa) { K.stopwatch(820, 560, 0.42 * E(seg(lt, wa, wa + 0.25)), (lt - wa) * 5); K.pill('BUT WAIT…', 820, 1190, 58, C.red, C.white, E(seg(lt, wa, wa + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + ri, 'pop', { gain: 0.3 }); cue(st + wa, 'tock', { gain: 0.3 }); cue(st + wa + 0.4, 'tock', { gain: 0.2 });
  }

  // ── 9a · With eventual consistency, ──
  const eachAt = at('each', 8) - 0.12;
  {
    const st = cut(8), ev = at('eventual', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 700], zoom: 0.08, note: 'branches again ($12 / $10); EVENTUAL CONSISTENCY cyan pill slams on "eventual"',
      draw(lt, d, t) {
        paper();
        shops(t, ['$12', '$10', 0]);
        if (lt > ev) K.pill('EVENTUAL CONSISTENCY', 540, 200, 54, C.cyan, C.ink, lerp(1.4, 1, eo(seg(lt, ev, ev + 0.2))));
      } });
    cue(st, 'whoosh'); cue(st + ev, 'slam', { gain: 0.3 });
  }

  // ── 9b · each branch answers right away, ──
  {
    const st = eachAt, an = at('answers', 8) - st, aw = at('away', 8) - st;
    add({ id: 'S10', at: st, cam: [540, 760], zoom: 0.1, note: 'customer + grinning waiter at the blue branch; on "answers" waiter points, bubble "$10!" pops; FAST pill + speed lines on "away"',
      draw(lt, d, t) {
        warm();
        K.branchShop(760, 900, 1.3, 1, BLUE);
        waiter({ x: 830, y: 1010, s: 0.4, arm: lt > an ? K.ARM.point : K.ARM.down, finger: -0.3, eyes: 'n', mouth: 'grin', brow: 0.5, look: -1 });
        K.man({ x: 250, y: 1010, s: 0.42, arm: K.ARM.down, eyes: 'n', mouth: lt > an ? 'grin' : 'smile', brow: 0.5, look: 1 });
        if (lt > an) K.bubble(800, 470, 0.9, '$10!', E(seg(lt, an, an + 0.25)), 0);
        if (lt > aw) { K.speedLines(560, 470, clamp((lt - aw) * 4)); K.pill('INSTANT', 540, 1190, 66, C.cyan, C.ink, E(seg(lt, aw, aw + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + an, 'pop', { gain: 0.35 }); cue(st + aw, 'zip', { gain: 0.3 });
  }

  // ── 10 · so for a moment, one still says ten, ──
  {
    const st = cut(9), mo = at('moment', 9) - st, te = at('ten', 9) - st;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.1, note: 'branches $12 / $10; update dot already on its way; red behind badge + ≠ on "moment"; right tag greys with ? on "ten"',
      draw(lt, d, t) {
        bg();
        shops(t, ['$12', '$10', lt > te ? E(seg(lt, te, te + 0.3)) : 0], lerp(0.1, 0.55, seg(lt, 0, d)));
        if (lt > mo) { K.syncBadge(SHOPR[0] - 150, 300, 1, false, E(seg(lt, mo, mo + 0.25)), t); K.pill('≠', 540, 1000, 80, C.red, C.white, E(seg(lt, mo, mo + 0.25))); }
        if (lt > te) K.pill('STILL $10', 830, 1180, 56, C.red, C.white, E(seg(lt, te, te + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 1.2, gain: 0.2 }); cue(st + mo, 'boing', { gain: 0.25 }); cue(st + te, 'pop', { gain: 0.3 });
  }

  // ── 11 · but once the news arrives, they all agree. ──
  {
    const st = cut(10), ne = at('news', 10) - st, ar = at('arrives', 10) - st, ag = at('agree', 10) - st;
    add({ id: 'S12', at: st, cam: [540, 760], zoom: 0.1, note: 'dot finishes the trip and lands on "arrives": right tag flips to $12; green sync badges on both; ALL AGREE green pill on "agree"',
      draw(lt, d, t) {
        bg();
        const done = lt > ar;
        shops(t, ['$12', done ? '$12' : '$10', done ? 0 : 1], done ? -1 : lerp(0.55, 1, seg(lt, 0, ar)));
        if (done && lt < ar + 0.5) K.burst(SHOPR[0], SHOPR[1] + 110, 2.2, clamp(1 - (lt - ar) * 2));
        if (lt > ag) { K.syncBadge(SHOPL[0] + 150, 300, 1, true, E(seg(lt, ag, ag + 0.25))); K.syncBadge(SHOPR[0] - 150, 300, 1, true, E(seg(lt, ag + 0.1, ag + 0.35))); }
        if (lt > ag) K.pill('ALL AGREE', 540, 1180, 66, GREEN, C.white, E(seg(lt, ag, ag + 0.25)));
        else if (lt > ne) K.pill('UPDATE…', 540, 200, 54, C.ink, C.white, E(seg(lt, ne, ne + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ar, 'thud', { gain: 0.3 }); cue(st + ag, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 12 · Your bank balance needs strong. ──
  {
    const st = cut(11), bk = at('bank', 11) - st, ba = at('balance', 11) - st, sg = at('strong', 11) - st;
    add({ id: 'S13', at: st, cam: [540, 760], zoom: 0.1, note: 'bank building pops on "bank"; $500 balance tag on "balance"; S / STRONG card + STRONG pill on "strong"',
      draw(lt, d, t) {
        bg();
        K.bankBuilding(540, 1080, 1.2 * E(seg(lt, 0.02, 0.35)), lt > sg);
        if (lt > ba) K.priceTag(250, 380, 0.75 * E(seg(lt, ba, ba + 0.25)), '$500', { rot: -0.08 });
        if (lt > sg) K.letterCard(840, 380, 0.5, 'S', 'STRONG', C.yellow, E(seg(lt, sg, sg + 0.3)), 0.08);
        if (lt > sg) K.pill('NEEDS STRONG', 540, 1190, 66, C.yellow, C.ink, E(seg(lt, sg, sg + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + bk, 'thud', { gain: 0.3 }); cue(st + ba, 'pop', { gain: 0.3 }); cue(st + sg, 'slam', { gain: 0.3 });
  }

  // ── 13 · A like counter? Eventual is fine, and much faster. ──
  {
    const st = cut(12), co = at('counter', 12) - st, ev = at('eventual', 12) - st, fa = at('faster', 12) - st;
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.1, note: 'like counter pops on "counter", hearts float; E / EVENTUAL card on "eventual"; on "faster" counter ticks up fast + speed lines + MUCH FASTER cyan pill',
      draw(lt, d, t) {
        warm();
        const n = lt > fa ? 1205 + Math.floor((lt - fa) * 12) : 1205;
        K.likeCounter(540, 720, 1.3 * E(seg(lt, 0.02, 0.35)), n.toLocaleString('en-US'), lt > fa ? 0.5 + 0.5 * Math.sin(lt * 20) : 0);
        for (let j = 0; j < 5; j++) {
          const a = co + j * 0.3; if (lt < a) continue;
          const u = seg(lt, a, a + 1.0); if (u >= 1) continue;
          K.heartEmoji(360 + rnd(j + 3) * 360, lerp(560, 300, u), 0.35 * (1 - u * 0.5));
        }
        if (lt > ev) K.letterCard(860, 1000, 0.42, 'E', 'EVENTUAL', C.cyan, E(seg(lt, ev, ev + 0.3)), 0.08);
        if (lt > fa) { K.speedLines(260, 720, clamp((lt - fa) * 4)); K.pill('MUCH FASTER', 540, 1190, 64, C.cyan, C.ink, E(seg(lt, fa, fa + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + co, 'pop', { gain: 0.35 }); cue(st + ev, 'pop', { gain: 0.3 }); cue(st + fa, 'zip', { gain: 0.3 }); cue(st + fa + 0.1, 'sparkle', { dur: 0.4, gain: 0.25 });
  }

  // ── 14 · So that count isn't wrong. It's just catching up. ──
  {
    const st = cut(13), wr = at('wrong', 13) - st, ca = at('catching', 13) - st;
    add({ id: 'S15', at: st, cam: [540, 760], zoom: 0.12, note: 'YOU 1,205 and FRIEND 1,204 counters; red X over "WRONG?" pill on "wrong"; friend counter ticks to 1,205 on "catching", both green badges; waiter winks to camera',
      draw(lt, d, t) {
        paper();
        const up = lt > ca;
        K.pill('YOU', 300, 260, 44, C.ink, C.white, 1); K.pill('FRIEND', 780, 260, 44, C.ink, C.white, 1);
        K.likeCounter(300, 400, 0.95, '1,205');
        K.likeCounter(780, 400, 0.95, up ? '1,205' : '1,204', up ? clamp(1 - (lt - ca) * 3) : 0);
        if (lt > wr && lt < ca) { K.pill('WRONG?', 540, 610, 60, C.red, C.white, 1); K.redX(540, 610, lerp(0.8, 0.4, eo(seg(lt, wr, wr + 0.2))), 1); }
        if (up) { K.syncBadge(450, 300, 0.8, true, E(seg(lt, ca, ca + 0.25))); K.syncBadge(930, 300, 0.8, true, E(seg(lt, ca + 0.1, ca + 0.35))); K.pill('CAUGHT UP', 540, 610, 66, GREEN, C.white, E(seg(lt, ca, ca + 0.25))); }
        waiter({ x: 540, y: 1000, s: 0.42, arm: up ? K.ARM.point : K.ARM.hip, finger: Math.sin(lt * 9) * 0.25, eyes: up ? 'wink' : 'n', mouth: up ? 'grin' : 'smirk', smirk: true, brow: 0.7 });
      } });
    cue(st, 'whoosh'); cue(st + wr, 'slam', { gain: 0.3 }); cue(st + ca, 'pop', { gain: 0.35 }); cue(st + ca + 0.1, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 15 · Tomorrow: what gets kicked out of a full cache? ──
  {
    const st = cut(14), to = at('tomorrow', 14) - st, ki = at('kicked', 14) - st, ca = at('cache', 14) - st;
    add({ id: 'S16', at: st, cam: [540, 700], zoom: 0.03, note: 'DAY 13 / 30 + NEXT pill on "tomorrow"; full warm shelf of 3 pizzas; on "kicked" the left pizza zips off with speed lines + red ?; FULL CACHE pill on "cache"',
      draw(lt, d, t) {
        paper();
        K.pill('DAY 13 / 30', 540, 170, 64, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        if (lt > to) K.pill('NEXT', 540, 290, 48, C.ink, C.white, E(seg(lt, to, to + 0.25)));
        const kick = lt > ki ? eo(seg(lt, ki, ki + 0.45)) : 0;
        K.warmShelf(540, 760, 1, [kick > 0 ? 0 : 1, 1, 1], t, [0, 0, 0], 0);
        if (kick > 0 && kick < 1) { K.pizza(lerp(300, -250, kick), 700, 0.6, kick * 6); K.speedLines(lerp(300, -250, kick) + 380, 700, 1 - kick); }
        if (lt > ki) K.pill('?', 160, 520, 70, C.red, C.white, E(seg(lt, ki + 0.2, ki + 0.45)));
        if (lt > ca) K.pill('FULL CACHE', 540, 1080, 64, C.red, C.white, E(seg(lt, ca, ca + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + to, 'pop', { gain: 0.3 }); cue(st + ki, 'zip', { gain: 0.35 }); cue(st + ca, 'pop', { gain: 0.3 }); cue(st + ca + 0.2, 'sparkle', { dur: 0.4, gain: 0.25 });
  }

  return { shots: S, cues: CUES };
}
