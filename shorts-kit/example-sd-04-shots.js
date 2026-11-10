// (4/30) VERTICAL VS HORIZONTAL SCALING: the shot list. Kitchen analogy: vertical scaling (scale up) = give your one chef
// a giant stove (one server gets more CPU + memory) — but stoves only get so big, and if that chef is sick nothing gets
// cooked. Horizontal scaling (scale out) = hire more chefs who share the orders (more servers). Tease: load balancer.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T, lineWords } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const GREEN = '#5BAE6A', BLUE = '#3A7BD5', ORANGE = '#F29A3A', PURPLE = '#8A63D2';
const PCOLS = [BLUE, C.pink, GREEN, ORANGE, PURPLE, C.red];
const bg = (ring = '#CFE8F3', base = C.sky) => { fillAll(base); circle(540, 740, 560, ring); };
const heldPhone = (screen) => (x, y) => K.phone(x + 12, y - 70, 0.3, screen);
const cook = (o) => { K.man(o); K.chefHat(o.x, o.y, o.s, o.hat ?? 1); };
// a ticket rail across the top with n tickets (fractional n pops the next one in)
const rail = (n, y = 200, done = false, x0 = 110, dx = 96) => {
  line([[60, y - 110], [1020, y - 110]], '#5E6775', 14);
  for (let k = 0; k < Math.ceil(n); k++) K.ticket(x0 + k * dx, y, 0.5 * E(clamp(n - k)), (rnd(k) - 0.5) * 0.18, done);
};
const shake = (lt, a0, a1, amp = 10) => (lt > a0 && lt < a1 ? Math.sin(lt * 70) * amp : 0);

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · Your app just went viral, ──
  {
    const st = cut(0), ap = Wd('app', 0) - st, vi = Wd('viral', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 700], zoom: 0.08, note: 'hero holds a phone (feed); app opens on "app"; hearts stream up from the phone + VIRAL! slams on "viral", hero grins',
      draw(lt, d, t) {
        bg();
        K.man({ x: 540, y: 1000, s: 0.75, arm: K.PHONE_ARM, holding: heldPhone(() => (lt > ap ? K.feedScreen(1, t) : K.homeScreen())), eyes: lt > vi ? 'wide' : 'n', mouth: lt > vi ? 'grin' : 'smile', brow: lt > vi ? 1 : 0.4, look: 0.5 });
        if (lt > ap) K.ripple(605, 870, clamp((lt - ap) / 0.5));
        if (lt > vi) {
          for (let k = 0; k < 9; k++) { const p = (lt - vi) * 1.1 - k * 0.07; if (p <= 0) continue; const u = p % 1;
            K.heart(lerp(600, 180 + rnd(k) * 720, eo(u)), lerp(820, 380 - rnd(k + 4) * 120, eo(u)), 0.4 * (1 - u * 0.5), 0); }
          bigText('VIRAL!', 540, 290, 190, C.yellow, -0.06, E(seg(lt, vi, vi + 0.25)));
        }
      } });
    cue(st + ap, 'pop', { gain: 0.35 }); cue(st + vi, 'sparkle', { dur: 0.6, gain: 0.35 }); cue(st + vi, 'slam', { gain: 0.3 });
  }

  // ── 2 · and now one server can't keep up. ──
  {
    const st = cut(1), sv = Wd('server', 1) - st, up = Wd('up', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 760], zoom: 0.1, note: 'one server centre; envelopes pour in from every side; load meter climbs to red; on "up" server shakes, sweats, red warning',
      draw(lt, d, t) {
        bg('#F7E3C8', C.bg);
        const sx = 520 + shake(lt, up - 0.1, d, 9);
        K.server(sx, 800, 0.8 * E(seg(lt, 0, 0.25)), t);
        K.loadMeter(930, 800, 90, 520, clamp(lt / (up + 0.1)));
        for (let k = 0; k < 14; k++) { const a0 = 0.15 + k * 0.08; if (lt < a0) continue; const u = clamp((lt - a0) / 0.6);
          const fx = k % 2 ? -120 : 1200, fy = 200 + rnd(k) * 900; K.envelope(lerp(fx, 520 + (rnd(k + 3) - 0.5) * 200, eo(u)), lerp(fy, 760 + (rnd(k + 7) - 0.5) * 300, eo(u)), 0.32, (rnd(k) - 0.5) * 0.6); }
        if (lt > sv) K.pill('ONE SERVER', 520, 230, 64, C.ink, C.white, E(seg(lt, sv, sv + 0.25)));
        if (lt > up) { K.warning(220, 470, 0.6 * E(seg(lt, up, up + 0.25))); K.sweat(700, 480, t, 1); }
      } });
    cue(st, 'whoosh'); cue(st + 0.15, 'slide', { dur: 1.0, gain: 0.25 }); cue(st + sv, 'pop', { gain: 0.35 }); cue(st + up, 'alarm', { dur: 0.6, gain: 0.3 });
  }

  // ── 3 · So do you get one bigger computer, ──
  {
    const st = cut(2), bi = Wd('bigger', 2) - st, co = Wd('computer', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 740], zoom: 0.06, note: 'small server centre; on "bigger" it grows into a huge server (burst); ONE BIGGER? pill on "computer"',
      draw(lt, d, t) {
        bg();
        const g = E(seg(lt, bi - 0.05, bi + 0.4));
        K.server(540, 760, lerp(0.45, 1.25, g), t);
        if (lt > bi && lt < bi + 0.4) K.burst(540, 760, 4, clamp(1 - (lt - bi) * 2.5));
        if (lt > co) K.pill('ONE BIGGER?', 540, 200, 70, C.yellow, C.ink, E(seg(lt, co, co + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + bi, 'boing', { gain: 0.35 }); cue(st + co, 'pop', { gain: 0.35 });
  }

  // ── 4 · or more computers? ──
  {
    const st = cut(3), mo = Wd('more', 3) - st, co = Wd('computers', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 740], zoom: 0.06, note: 'huge server splits into four normal servers on "more"; OR MORE? pill on "computers"',
      draw(lt, d, t) {
        bg();
        const sp = E(seg(lt, mo - 0.1, mo + 0.3));
        if (sp < 0.5) K.server(540, 760, 1.25 * (1 - sp * 2), t);
        for (let k = 0; k < 4; k++) K.server(lerp(540, 165 + k * 250, sp), lerp(760, 800, sp), 0.42 * sp, t + k);
        if (lt > co) K.pill('OR MORE?', 540, 200, 70, C.yellow, C.ink, E(seg(lt, co, co + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + mo, 'pop', { gain: 0.4 }); cue(st + mo + 0.1, 'pop', { gain: 0.3 }); cue(st + co, 'pop', { gain: 0.35 });
  }

  // ── 5 · Picture a busy kitchen. ──
  {
    const st = cut(4), bu = Wd('busy', 4) - st, ki = Wd('kitchen', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 820], zoom: 0.1, note: 'kitchen: chef at a normal stove; tickets fill the rail from "busy"; BUSY KITCHEN pill on "kitchen"',
      draw(lt, d, t) {
        K.kitchen(1180);
        K.stove(760, 1000, 0.7, t, 1);
        cook({ x: 360, y: 1060, s: 0.8, arm: K.ARM.hip, eyes: lt > bu ? 'wide' : 'n', mouth: lt > bu ? 'o' : 'smile', brow: 0.6, look: 0.6 });
        rail(clamp((lt - bu + 0.1) / 0.6) * 9, 210);
        if (lt > ki) K.pill('BUSY KITCHEN', 760, 1130, 54, C.yellow, C.ink, E(seg(lt, ki, ki + 0.25)));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 5; k++) cue(st + bu + k * 0.12, 'tock', { gain: 0.18 }); cue(st + ki, 'pop', { gain: 0.4 });
  }

  // ── 6 · Scaling up, or vertical scaling, ──
  {
    const st = cut(5), sc = Wd('scaling', 5) - st, ve = Wd('vertical', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.08, note: 'one server grows TALLER and wider; big red arrow points UP on "scaling (up)"; VERTICAL SCALING pill on "vertical"',
      draw(lt, d, t) {
        bg('#DDEFF6');
        const g = eio(clamp((lt - sc) / 1.4));
        ctx.save(); ctx.translate(430, 1060); ctx.scale(lerp(0.75, 1.0, g), lerp(0.75, 1.15, g)); K.server(0, -300, 1, t); ctx.restore();
        if (lt > sc) { K.arrow(880, 700, 520 * E(seg(lt, sc, sc + 0.3)), -Math.PI / 2, 1); K.pill('UP', 880, 1060, 60, C.ink, C.white, E(seg(lt, sc + 0.1, sc + 0.35))); }
        if (lt > ve) K.pill('VERTICAL SCALING', 540, 200, 70, C.yellow, C.ink, E(seg(lt, ve, ve + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sc, 'slide', { dur: 0.6, gain: 0.3 }); cue(st + ve, 'pop', { gain: 0.4 });
  }

  // ── 7 · means giving your one chef a giant stove. ──
  {
    const st = cut(6), ch = Wd('chef', 6) - st, gi = Wd('giant', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 820], zoom: 0.08, note: 'ONE CHEF pill on "chef"; on "giant" his stove swells huge (burst), flames roar, he grins and points',
      draw(lt, d, t) {
        K.kitchen(1180);
        const g = E(seg(lt, gi, gi + 0.45));
        K.stove(lerp(760, 690, g), lerp(1000, 900, g), lerp(0.7, 1.2, g), t, lerp(1, 1.8, g));
        cook({ x: 250, y: 1060, s: 0.8, arm: lt > gi ? K.ARM.point : K.ARM.hip, finger: lt > gi ? Math.sin(lt * 9) * 0.25 : null, eyes: 'n', mouth: lt > gi ? 'grin' : 'smile', brow: 0.6, look: 0.6 });
        if (lt > ch) K.pill('ONE CHEF', 250, 330, 56, C.ink, C.white, E(seg(lt, ch, ch + 0.25)));
        if (lt > gi) { K.burst(690, 760, 3.2, clamp(1 - (lt - gi) * 2)); K.pill('GIANT STOVE', 700, 230, 60, C.yellow, C.ink, E(seg(lt, gi, gi + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + ch, 'pop', { gain: 0.3 }); cue(st + gi, 'boing', { gain: 0.35 }); cue(st + gi + 0.1, 'sizzle', { dur: 0.8, gain: 0.25 });
  }

  // ── 8 · For servers, that's more CPU and memory. ──
  {
    const st = cut(7), sv = Wd('servers', 7) - st, cp = Wd('cpu', 7) - st, me = Wd('memory', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 760], zoom: 0.08, note: 'server centre; a CPU chip flies in from the left on "CPU" (+pill), a RAM stick from the right on "memory" (+pill); server grows a bit each time',
      draw(lt, d, t) {
        bg('#DDEFF6');
        const a = E(seg(lt, cp, cp + 0.35)), b = E(seg(lt, me, me + 0.35));
        K.server(540, 820, (0.7 + 0.08 * clamp((lt - cp - 0.35) * 5) + 0.08 * clamp((lt - me - 0.35) * 5)) * E(seg(lt, 0, 0.25)), t);
        if (lt > cp) { K.cpuChip(lerp(-200, 250, a), lerp(500, 470, a), 0.7, lerp(-1.2, 0, a)); K.pill('CPU = BRAINS', 250, 260, 50, C.yellow, C.ink, E(seg(lt, cp + 0.1, cp + 0.35))); }
        if (lt > me) { K.ramStick(lerp(1300, 820, b), lerp(470, 480, b), 0.62, lerp(1.0, 0.0, b)); K.pill('MEMORY', 820, 330, 50, C.yellow, C.ink, E(seg(lt, me + 0.1, me + 0.35))); }
        if (lt > sv) K.pill('ONE SERVER', 540, 1170, 56, C.ink, C.white, E(seg(lt, sv, sv + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sv, 'pop', { gain: 0.3 }); cue(st + cp, 'zip', { gain: 0.35 }); cue(st + cp + 0.35, 'thud', { gain: 0.3 }); cue(st + me, 'zip', { gain: 0.35 }); cue(st + me + 0.35, 'thud', { gain: 0.3 });
  }

  // ── 9 · Easy, but stoves only get so big, ──
  {
    const st = cut(8), ea = Wd('easy', 8) - st, sto = Wd('stoves', 8) - st, bi = Wd('big', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 760], zoom: 0.08, note: 'green check on "easy"; stove keeps growing from "stoves" until it bonks into a red dashed ceiling on "big" (wobble + MAX SIZE red pill)',
      draw(lt, d, t) {
        K.kitchen(1180);
        K.ceiling(740, 60, 1020, E(seg(lt, sto, sto + 0.25)));
        const g = clamp((lt - sto) / Math.max(0.3, bi - sto)), s = lerp(0.9, 1.45, eo(g)), wob = lt > bi ? Math.sin((lt - bi) * 40) * 0.03 * clamp(1 - (lt - bi) * 2) : 0;
        K.stove(540, 1130 - 200 * s, s * (1 + wob), t, 1.4);
        if (lt > ea && lt < sto + 0.2) K.check(540, 480, 0.7 * E(seg(lt, ea, ea + 0.25)));
        if (lt > bi) { K.burst(540, 740, 2.4, clamp(1 - (lt - bi) * 2.5)); K.pill('MAX SIZE', 820, 650, 56, C.red, C.white, E(seg(lt, bi, bi + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + ea, 'sparkle', { dur: 0.4, gain: 0.3 }); cue(st + sto, 'slide', { dur: Math.max(0.3, bi - sto), gain: 0.25 }); cue(st + bi, 'slam', { gain: 0.4 });
  }

  // ── 10 · and if that one chef gets sick, ──
  {
    const st = cut(9), ch = Wd('chef', 9) - st, si = Wd('sick', 9) - st;
    add({ id: 'S10', at: st, cam: [440, 740], zoom: 0.12, note: 'chef next to the giant stove; on "sick" a thermometer pops in his mouth, eyes close, dizzy swirls, he droops; SICK! red pill',
      draw(lt, d, t) {
        K.kitchen(1180);
        K.stove(820, 880, 1.0, t, 1.2);
        const sk = E(seg(lt, si, si + 0.3)), droop = eo(seg(lt, si, si + 0.6)) * 40;
        cook({ x: 380, y: 1100 + droop, s: 0.95, arm: lt > si ? K.ARM.down : K.ARM.hip, eyes: lt > si ? 'closed' : 'n', mouth: lt > si ? 'flat' : 'smile', brow: lt > si ? 0 : 0.5, frown: lt > si, look: 0.4 });
        const hy = 1100 + droop - 272 * 0.95;
        if (lt > si) { K.thermometer(390, hy + 6, 0.55 * sk, -0.35, clamp((lt - si) / 0.5)); K.dizzy(380, 1100 + droop - 640 * 0.95, 90, t, sk); K.pill('SICK!', 380, 260, 62, C.red, C.white, sk); }
        if (lt > ch && lt < si) K.pill('ONE CHEF', 380, 260, 56, C.ink, C.white, E(seg(lt, ch, ch + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ch, 'pop', { gain: 0.3 }); cue(st + si, 'boing', { gain: 0.3 }); cue(st + si + 0.2, 'alarm', { dur: 0.5, gain: 0.25 });
  }

  // ── 11 · nothing gets cooked. ──
  {
    const st = cut(10), no = Wd('nothing', 10) - st, co = Wd('cooked', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.1, note: 'empty kitchen, giant stove cold (no fire); full ticket rail + tickets pile up; big red X slams on "nothing"; APP DOWN red pill on "cooked"',
      draw(lt, d, t) {
        K.kitchen(1180);
        K.stove(540, 900, 1.0, t, 0);
        rail(9, 210);
        for (let k = 0; k < 8; k++) { const a = k * 0.08; if (lt < a) continue; K.ticket(150 + rnd(k + 2) * 780, lerp(-150, 1120 + (k % 3) * 25, eo(clamp((lt - a) / 0.45))), 0.5, (rnd(k + 9) - 0.5)); }
        if (lt > no) K.redX(540, 700, lerp(1.6, 0.9, eo(seg(lt, no, no + 0.2))), 1);
        if (lt > co) K.pill('APP DOWN', 540, 1170, 62, C.red, C.white, E(seg(lt, co, co + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'thud', { gain: 0.25 }); cue(st + no, 'slam', { gain: 0.45 }); cue(st + co, 'pop', { gain: 0.35 });
  }

  // ── 12 · Scaling out, or horizontal scaling, ──
  {
    const st = cut(11), sc = Wd('scaling', 11) - st, ho = Wd('horizontal', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 760], zoom: 0.08, note: 'one server left; red arrow points RIGHT (OUT) on "scaling"; normal-size servers pop in one by one across the row; HORIZONTAL SCALING pill on "horizontal"',
      draw(lt, d, t) {
        bg('#DDEFF6');
        for (let k = 0; k < 4; k++) { const a = k === 0 ? 0 : sc + 0.15 + k * 0.25; K.server(165 + k * 250, 820, 0.42 * E(seg(lt, a, a + 0.25)), t + k); }
        if (lt > sc) { K.arrow(540, 450, 760 * E(seg(lt, sc, sc + 0.35)), 0, 1); K.pill('OUT', 540, 1110, 60, C.ink, C.white, E(seg(lt, sc + 0.1, sc + 0.35))); }
        if (lt > ho) K.pill('HORIZONTAL SCALING', 540, 220, 66, C.yellow, C.ink, E(seg(lt, ho, ho + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sc, 'slide', { dur: 0.5, gain: 0.3 }); for (let k = 1; k < 4; k++) cue(st + sc + 0.15 + k * 0.25, 'pop', { gain: 0.25 }); cue(st + ho, 'pop', { gain: 0.4 });
  }

  // ── 13 · means hiring more chefs who share the orders. ──
  {
    const st = cut(12), hi = Wd('hiring', 12) - st, sh = Wd('share', 12) - st, or = Wd('orders', 12) - st;
    const X = [200, 540, 880];
    add({ id: 'S13', at: st, cam: [540, 780], zoom: 0.08, note: 'three chefs at three normal stoves pop in from "hiring"; from "share" tickets fly from the rail to each chef in turn; green ticks on "orders"',
      draw(lt, d, t) {
        K.kitchen(1180);
        line([[60, 100], [1020, 100]], '#5E6775', 14);
        X.forEach((x, k) => { const a = k === 0 ? 0 : hi + (k - 1) * 0.2, p = E(seg(lt, a, a + 0.3)); if (p <= 0) return;
          K.stove(x, 1080, 0.42 * p, t + k, 1);
          cook({ x, y: 1020 + (1 - p) * 400, s: 0.5, arm: K.ARM.hip, eyes: 'n', mouth: lt > or ? 'grin' : 'smile', brow: 0.4, look: 0 }); });
        for (let k = 0; k < 6; k++) { const a = sh + k * 0.12, u = eo(clamp((lt - a) / 0.4)), tx = X[k % 3], ty = 520 - Math.floor(k / 3) * 70;
          if (lt < a) K.ticket(150 + k * 150, 210, 0.42, (rnd(k) - 0.5) * 0.2); else K.ticket(lerp(150 + k * 150, tx + 90, u), lerp(210, ty, u), 0.42, 0, lt > or + k * 0.05); }
        if (lt > hi) K.pill('MORE CHEFS', 540, 400, 58, C.yellow, C.ink, E(seg(lt, hi, hi + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + hi, 'pop', { gain: 0.35 }); cue(st + hi + 0.2, 'pop', { gain: 0.3 }); cue(st + sh, 'slide', { dur: 0.8, gain: 0.25 }); cue(st + or, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 14 · That's adding more servers, ──
  {
    const st = cut(13), ad = Wd('adding', 13) - st, sv = Wd('servers', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.08, note: 'row of 3 servers; on "adding" three more drop in below to make a 3x2 rack with +1 tags; MORE SERVERS on "servers"',
      draw(lt, d, t) {
        bg();
        for (let k = 0; k < 6; k++) { const r = Math.floor(k / 3), c = k % 3, a = k < 3 ? 0 : ad + (k - 3) * 0.12;
          if (r === 0) K.server(220 + c * 320, 560, 0.36 * E(seg(lt, 0, 0.25)), t + k);
          else if (lt > a) K.server(220 + c * 320, lerp(-300, 980, eo(seg(lt, a, a + 0.3))), 0.36, t + k); }
        for (let k = 3; k < 6; k++) { const a = ad + (k - 3) * 0.12; if (lt > a + 0.3) K.pill('+1', 220 + (k % 3) * 320 + 100, 860, 40, GREEN, C.white, E(seg(lt, a + 0.3, a + 0.5))); }
        if (lt > sv) K.pill('MORE SERVERS', 540, 230, 66, C.yellow, C.ink, E(seg(lt, sv, sv + 0.25)));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 3; k++) cue(st + ad + k * 0.12 + 0.3, 'thud', { gain: 0.25 }); cue(st + sv, 'pop', { gain: 0.4 });
  }

  // ── 15 · and it's how the biggest apps grow. ──
  {
    const st = cut(14), bi = Wd('biggest', 14) - st, ap = Wd('apps', 14) - st, gr = Wd('grow', 14) - st;
    add({ id: 'S15', at: st, cam: [540, 700], zoom: 0.14, note: 'a big grid of small servers fills the screen from "biggest"; app tiles pop on "apps"; HOW BIG APPS GROW pill on "grow"',
      draw(lt, d, t) {
        bg('#DDEFF6');
        for (let k = 0; k < 20; k++) { const r = Math.floor(k / 5), c = k % 5, a = k * 0.05; K.server(140 + c * 200, 470 + r * 190, 0.2 * E(seg(lt, a, a + 0.25)), t + k); }
        if (lt > ap) [[200, 250], [540, 220], [880, 250]].forEach(([x, y], k) => K.appTile(x, y, 0.8 * E(seg(lt, ap + k * 0.08, ap + k * 0.08 + 0.25)), PCOLS[k]));
        if (lt > gr) K.pill('HOW BIG APPS GROW', 540, 1210, 56, C.yellow, C.ink, E(seg(lt, gr, gr + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st, 'sparkle', { dur: 0.8, gain: 0.25 }); cue(st + ap, 'pop', { gain: 0.35 }); cue(st + gr, 'pop', { gain: 0.4 });
  }

  // ── 16 · But wait, who hands out the orders? ──
  {
    const st = cut(15), wa = Wd('wait', 15) - st, ha = Wd('hands', 15) - st, or = Wd('orders', 15) - st;
    const X = [200, 540, 880];
    add({ id: 'S16', at: st, cam: [540, 760], zoom: 0.1, note: 'three chefs; a pile of tickets drops in the middle top on "wait"; ? bubbles above the chefs on "hands"; big WHO? on "orders"',
      draw(lt, d, t) {
        K.kitchen(1180);
        X.forEach((x, k) => { K.stove(x, 1080, 0.42, t + k, 1); cook({ x, y: 1020, s: 0.5, arm: K.ARM.hip, eyes: lt > wa ? 'wide' : 'n', mouth: lt > wa ? 'o' : 'smile', brow: lt > wa ? 1 : 0.4, look: x < 540 ? 0.8 : x > 540 ? -0.8 : 0 }); });
        if (lt > wa) for (let k = 0; k < 9; k++) { const a = wa + k * 0.04; K.ticket(540 + (rnd(k) - 0.5) * 220, lerp(-200, 330 - k * 12, eo(clamp((lt - a) / 0.35))), 0.45, (rnd(k + 5) - 0.5) * 0.8); }
        if (lt > ha) X.forEach((x, k) => K.bubble(x + 70, 560, 0.8, '?', E(seg(lt, ha + k * 0.1, ha + k * 0.1 + 0.25)), -1));
        if (lt > or) bigText('WHO?', 540, 1180, 150, C.yellow, -0.05, E(seg(lt, or, or + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + wa, 'thud', { gain: 0.35 }); cue(st + ha, 'boing', { gain: 0.3 }); cue(st + or, 'pop', { gain: 0.4 });
  }

  // ── 17 · Tomorrow: the load balancer. ──
  {
    const st = cut(16), lo = Wd('load', 16) - st, ba = Wd('balancer', 16) - st;
    add({ id: 'S17', at: st, cam: [540, 700], zoom: 0.03, note: 'hero winks with DAY 4 / 30 pill; on "load" he ducks out and a host stand rises centre with 3 servers behind; on "balancer" envelopes fan out to all three; LOAD BALANCER pill',
      draw(lt, d, t) {
        bg();
        const dn = E(seg(lt, lo - 0.15, lo + 0.2));
        K.man({ x: 540, y: lerp(1120, 2700, dn), s: 0.95, arm: K.ARM.point, finger: Math.sin(lt * 9) * 0.25, eyes: lt < lo ? 'wink' : 'n', mouth: 'smirk', smirk: true, brow: 0.6 });
        K.pill('DAY 4 / 30', 540, 200, 70, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        if (lt > lo - 0.15) {
          const p = E(seg(lt, lo - 0.15, lo + 0.2));
          for (let k = 0; k < 3; k++) K.server(220 + k * 320, 520, 0.32 * p, t + k);
          K.hostStand(540, lerp(1400, 860, p), 0.8);
          if (lt > ba) for (let k = 0; k < 6; k++) { const q = (lt - ba) * 1.6 - k / 6; if (q < 0) continue; const u = q % 1, tgt = k % 3; const [x, y] = K.arcAt(540, 820, 220 + tgt * 320, 640, 120, u); K.envelope(x, y, 0.28, 0); }
          if (lt > ba) K.pill('LOAD BALANCER', 540, 1180, 60, C.ink, C.white, E(seg(lt, ba, ba + 0.25)));
        }
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.4 }); cue(st + lo, 'boing', { gain: 0.35 }); cue(st + ba, 'slide', { dur: 0.8, gain: 0.3 }); cue(st + ba, 'pop', { gain: 0.35 });
  }

  return { shots: S, cues: CUES };
}
