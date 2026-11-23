// HOW DOES GOOGLE MAPS KNOW THERE'S TRAFFIC?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const TR = K.TRAFFIC;
const disc = () => { fillAll(C.bg); circle(540, 740, 520, '#E4DCCB'); };
const dark = () => { fillAll('#20232B'); circle(540, 740, 540, '#2A2E38'); };
const heldPhone = (screen) => (x, y) => K.phone(x + 12, y - 70, 0.3, screen);
const PX = 540, PY = 720, PS = 1.15;
/** phone screen: traffic map + search bar */
const mapS = (o) => () => { K.trafficMap(0, 0, 332, 700, { k: 1, ...o }); rr(-140, -320, 280, 64, 32); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = '#D5D9DF'; ctx.stroke(); circle(-104, -288, 12, TR.blue); rr(-80, -296, 160, 16, 8); ctx.fillStyle = '#C9CED6'; ctx.fill(); };
/** a car with a phone on its roof (top view). bubble = speed text */
function phoneCar(x, y, s, col, ph = 1, bubble = null, bc = TR.green, bs = 0) {
  K.carTop(x, y, s, col);
  K.miniPhone(x - 6 * s, y, 0.55 * s * ph, 0);
  if (bubble && bs > 0) K.speedBubble(x, y - 60 * s, bubble, bc, bs, 40);
}
const CARC = ['#3A7BD5', '#E57A8A', '#5BAE6A', '#C8734A', '#FFD43B', '#8E6BD6'];

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · How does Google Maps know a road is jammed ───────────────
  {
    const st = cut(0), gm = Wd('Google', 0) - st, ja = Wd('jammed', 0) - st, rd = Wd('road', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 720], zoom: 0.14, note: 'big phone map, blue dot driving; route green; red jam segment floods ahead on "jammed"',
      draw(lt, d, t) {
        disc();
        const jp = eio(seg(lt, rd, ja + 0.1));
        K.phone(PX, PY, PS * E(seg(lt, 0, 0.3)), mapS({ segs: [{ u0: 0, u1: 1, col: TR.green }, { u0: 0.55, u1: lerp(0.55, 0.85, jp), col: TR.red }], car: lerp(0.08, 0.25, seg(lt, 0, d)), t }));
        if (lt > gm) K.pill('GOOGLE MAPS', 540, 200, 60, C.white, C.ink, E(seg(lt, gm, gm + 0.25)));
        if (lt > ja) { K.pill('JAMMED!', 830, 560, 62, TR.red, C.white, E(seg(lt, ja + 0.1, ja + 0.35))); K.burst(830, 560, 2.2, 1 - seg(lt, ja + 0.1, ja + 0.6)); }
      } });
    cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + rd, 'slide', { dur: 0.6, gain: 0.25 }); cue(st + ja + 0.1, 'pop', { gain: 0.5 });
  }
  // ── 2 · before you even get there? ─────────────────────────────
  {
    const st = cut(1), ev = Wd('even', 1) - st, th = Wd('there', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 760], zoom: 0.12, note: 'top-down road: your blue car far left, jam of cars far right; "?" pops over the jam on "there"',
      draw(lt, d, t) {
        fillAll('#A9D69B');
        const lanes = K.highway(780, 2, 150);
        const cx = lerp(-120, 200, eo(seg(lt, 0, d)));
        K.carTop(cx, lanes[1], 0.9, TR.blue, lt > ev ? 1 : 0);
        for (let k = 0; k < 4; k++) K.carTop(620 + k * 150, lanes[0], 0.7, CARC[k + 1]);
        for (let k = 0; k < 3; k++) K.carTop(700 + k * 160, lanes[1], 0.7, CARC[(k + 3) % 6]);
        if (lt > ev) K.pill('YOU', Math.max(cx, 120), 590, 52, TR.blue, C.white, E(seg(lt, ev, ev + 0.25)));
        if (lt > th - 0.1) K.pill('?', 830, 540, 120, C.yellow, C.ink, E(seg(lt, th - 0.1, th + 0.2)));
        K.pill('2 KM AHEAD', 830, 1020, 48, C.ink, C.white, E(seg(lt, th, th + 0.3)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 1.2, gain: 0.2 }); cue(st + th, 'boing', { gain: 0.35 });
  }
  // ── 3 · There's no camera watching every street. ──────────────
  {
    const st = cut(2), ca = Wd('camera', 2) - st, sr = Wd('street', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 700], zoom: 0.1, note: 'CCTV camera rises over a street on "camera", sweeps; red X slams on "street"',
      draw(lt, d, t) {
        fillAll(C.sky);
        K.skyline(1000, 900, '#D5DCE6', 0);
        K.sideStreet(1000, 0);
        for (let k = 0; k < 3; k++) K.carTop(((k * 400 + lt * 160) % 1300) - 100, 1200, 0.75, CARC[k]);
        K.cctv(420, lerp(1300, 560, eob(seg(lt, ca - 0.45, ca + 0.05))), 1.1, Math.sin(lt * 2.5) * 0.18);
        if (lt > sr) K.redX(480, 620, lerp(1.6, 0.85, eo(seg(lt, sr, sr + 0.2))), 1);
      } });
    cue(st, 'whoosh'); cue(st + ca - 0.3, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + sr + 0.05, 'slam', { gain: 0.5 });
  }
  // ── 4 · The secret is phones, like yours. ─────────────────────
  {
    const st = cut(3), ph = Wd('phones', 3) - st, yo = Wd('yours', 3) - st;
    const spots = [[180, 330], [900, 330], [150, 720], [930, 720], [200, 1080], [880, 1080]];
    add({ id: 'S04', at: st, cam: [540, 700], zoom: 0.12, note: 'hero holding phone with map; six phones pop around him on "phones"; YOURS on "yours"',
      draw(lt, d, t) {
        K.room();
        spots.forEach(([x, y], k) => K.miniPhone(x, y, 1.3 * E(seg(lt, ph + k * 0.06, ph + k * 0.06 + 0.25)), 0));
        K.man({ x: 540, y: 1150, s: 0.95, arm: K.PHONE_ARM, holding: heldPhone(mapS({ segs: [{ u0: 0, u1: 1, col: TR.green }], car: 0.3, t })), eyes: lt > yo ? 'wide' : 'n', mouth: lt > yo ? 'o' : 'smile', brow: lt > yo ? 0.8 : 0.3 });
        if (lt > yo) K.pill('YOURS', 540, 200, 66, C.yellow, C.ink, E(seg(lt, yo, yo + 0.25)));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 6; k += 2) cue(st + ph + k * 0.06, 'pop', { gain: 0.3 }); cue(st + yo, 'sparkle', { dur: 0.5, gain: 0.3 });
  }
  // ── 5 · Phones with location turned on send back how fast they're moving, ─────
  {
    const st = cut(4), lo = Wd('location', 4) - st, fa = Wd('fast', 4) - st, mv = Wd('moving', 4) - st;
    const SPD = ['48 km/h', '52 km/h', '45 km/h'];
    add({ id: 'S05', at: st, cam: [540, 720], zoom: 0.1, note: 'top-down road, three cars with phones on roofs; location pin on "location"; yellow pings fly up to Google servers; speed bubbles on "fast"',
      draw(lt, d, t) {
        fillAll('#A9D69B');
        const lanes = K.highway(980, 2, 170);
        const xs = [0, 1, 2].map((k) => ((k * 400 + lt * 200) % 1200) - 60);
        xs.forEach((x, k) => phoneCar(x, lanes[k % 2], 1, CARC[k], 1, SPD[k], TR.green, E(seg(lt, fa + k * 0.1, fa + k * 0.1 + 0.25))));
        K.dataCenter(540, 360, 0.8, t, lt > mv ? 1 : 0);
        if (lt > lo) {
          for (let k = 0; k < 3; k++) { const u = ((lt - lo) * 0.9 + k * 0.33) % 1; K.signalDot(lerp(xs[k], 540, u), lerp(lanes[k % 2] - 60, 470, u), 0.9); }
          K.pill('LOCATION ON', 540, 620, 54, TR.blue, C.white, E(seg(lt, lo, lo + 0.25)) * (lt < mv ? 1 : 0));
        }
        if (lt > mv) K.pill('SPEED + SPOT', 540, 620, 54, C.ink, C.white, E(seg(lt, mv, mv + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + lo, 'pop', { gain: 0.35 }); cue(st + lo + 0.1, 'slide', { dur: 1.2, gain: 0.2 }); cue(st + fa, 'pop', { gain: 0.4 }); cue(st + mv, 'pop', { gain: 0.35 });
  }
  // ── 6 · with no names attached. ──────────────────────────────
  {
    const st = cut(5), na = Wd('names', 5) - st, at = Wd('attached', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 700], zoom: 0.12, note: 'location ping ticket; NAME row struck out red on "names"; ANONYMOUS stamp on "attached"',
      draw(lt, d, t) {
        disc();
        K.dataTicket(540, 650, 1.15, [['SPEED', '48 km/h'], ['ROAD', 'MAIN ST'], ['NAME', 'SAM LEE']], { nameRow: 2, strike: seg(lt, na, na + 0.3), sc: E(seg(lt, 0, 0.3)) });
        if (lt > at) { ctx.save(); ctx.translate(560, 1060); ctx.rotate(-0.08); const sc = lerp(1.6, 1, eo(seg(lt, at, at + 0.18))); ctx.scale(sc, sc);
          rr(-260, -60, 520, 120, 20); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 12; ctx.strokeStyle = TR.green; ctx.stroke(); ctx.font = '900 66px Inter'; ctx.fillStyle = TR.green; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('ANONYMOUS', 0, 4); ctx.restore(); }
      } });
    cue(st, 'whoosh'); cue(st + na, 'zip', { gain: 0.3 }); cue(st + at, 'thud', { gain: 0.45 });
  }
  // ── 7 · So when lots of them crawl along one road, ─────────────
  {
    const st = cut(6), lo = Wd('lots', 6) - st, cr = Wd('crawl', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 760], zoom: 0.12, note: 'cars pile in bumper to bumper on "lots"; they crawl, red "6 km/h" bubbles on "crawl"',
      draw(lt, d, t) {
        fillAll('#A9D69B');
        const lanes = K.highway(860, 2, 170);
        for (let k = 0; k < 12; k++) {
          const lane = k % 2, idx = Math.floor(k / 2), tx = 1000 - idx * 200 - lane * 90;
          const x = lerp(tx - 1300, tx, eo(seg(lt, lo - 0.6 + idx * 0.05, lo + 0.1 + idx * 0.05))) + lt * 12;
          phoneCar(x, lanes[lane], 0.85, CARC[k % 6], 1, k % 3 === 0 ? '6 km/h' : null, TR.red, E(seg(lt, cr + idx * 0.06, cr + idx * 0.06 + 0.25)));
        }
        if (lt > cr) K.pill('CRAWLING', 540, 1110, 60, TR.red, C.white, E(seg(lt, cr + 0.2, cr + 0.45)));
      } });
    cue(st, 'whoosh'); cue(st + Math.max(0.05, lo - 0.5), 'slide', { dur: 0.6, gain: 0.25 }); cue(st + cr, 'pop', { gain: 0.4 });
  }
  // ── 8 · that road turns orange, then red. ─────────────────────
  {
    const st = cut(7), or = Wd('orange', 7) - st, re = Wd('red', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 700], zoom: 0.14, note: 'big phone map; main road section green → orange on "orange" → red on "red"',
      draw(lt, d, t) {
        disc();
        const op = seg(lt, or - 0.1, or + 0.3), rp = seg(lt, re - 0.1, re + 0.3);
        const segs = [{ u0: 0, u1: 1, col: TR.green }, { u0: 0.3, u1: lerp(0.3, 0.8, eio(op)), col: TR.orange }];
        if (rp > 0) segs.push({ u0: 0.3, u1: lerp(0.3, 0.8, eio(rp)), col: TR.red });
        K.phone(PX, PY, PS, mapS({ segs }));
        if (lt > or) K.pill('ORANGE', 210, 300, 56, TR.orange, C.white, E(seg(lt, or, or + 0.25)));
        if (lt > re) K.pill('RED', 880, 300, 56, TR.red, C.white, E(seg(lt, re, re + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + or, 'pop', { gain: 0.4 }); cue(st + re, 'pop', { gain: 0.5 });
  }
  // ── 9 · Add years of past traffic for that hour, ──────────────
  {
    const st = cut(8), ye = Wd('years', 8) - st, tr = Wd('traffic', 8) - st, ho = Wd('hour', 8) - st;
    const V = [0.15, 0.2, 0.55, 0.95, 0.7, 0.4, 0.45, 0.5, 0.85, 0.6, 0.3];
    const LB = ['5', '', '7', '8', '', '', '', '', '5PM', '', ''];
    add({ id: 'S09', at: st, cam: [540, 700], zoom: 0.1, note: 'calendar pages flip on "years"; hour bar chart grows on "traffic"; 8 AM bar goes red on "hour"',
      draw(lt, d, t) {
        disc();
        const flips = Math.floor(clamp((lt - ye) / 0.12, 0, 6));
        K.calendar(250, 330, 0.42 * E(seg(lt, ye - 0.2, ye + 0.1)), String(2019 + flips), 'YEARS', -0.08);
        K.hourChart(540, 1080, 0.95, V, LB, { p: seg(lt, tr - 0.2, tr + 0.6), hi: 3, hiP: seg(lt, ho, ho + 0.2) });
        if (lt > ho) K.pill('8 AM RUSH', 760, 330, 60, TR.red, C.white, E(seg(lt, ho, ho + 0.25)));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 5; k++) cue(st + ye + k * 0.12, 'tock', { gain: 0.25 }); cue(st + tr, 'slide', { dur: 0.6, gain: 0.2 }); cue(st + ho, 'pop', { gain: 0.45 });
  }
  // ── 10 · and it can guess the jam before it happens. ──────────
  {
    const st = cut(9), gu = Wd('guess', 9) - st, ja = Wd('jam', 9) - st, hp = Wd('happens', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 700], zoom: 0.12, note: 'phone map; dashed predicted red section appears ahead on "jam"; stopwatch "IN 20 MIN" on "happens"',
      draw(lt, d, t) {
        disc();
        const jp = eio(seg(lt, ja - 0.1, ja + 0.4));
        K.phone(PX, PY, PS, () => {
          mapS({ segs: [{ u0: 0, u1: 1, col: TR.green }], car: 0.12, t })();
          if (jp > 0) { ctx.save(); ctx.setLineDash([22, 16]); K.polyLine(K.MAIN_ROAD, 0.5, lerp(0.5, 0.85, jp), TR.red, 26); ctx.restore(); }
        });
        if (lt > gu) K.pill('PREDICTED', 540, 190, 60, C.ink, C.white, E(seg(lt, gu, gu + 0.25)));
        K.stopwatch(905, 980, 0.36 * E(seg(lt, hp - 0.1, hp + 0.2)), lt * 3);
        if (lt > hp) K.pill('IN 20 MIN', 880, 1150, 46, TR.red, C.white, E(seg(lt, hp + 0.1, hp + 0.35)));
      } });
    cue(st, 'whoosh'); cue(st + gu, 'pop', { gain: 0.35 }); cue(st + ja, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + hp, 'tock', { gain: 0.35 });
  }
  // ── 11 · But here's the catch. ────────────────────────────────
  {
    const st = cut(10), ca = Wd('catch', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 700], zoom: 0.16, note: 'dark; warning triangle slams on "catch"',
      draw(lt, d, t) {
        dark();
        if (lt < ca - 0.15) bigText('BUT...', 540, 700, 230, C.white, -0.05, E(seg(lt, 0.05, 0.3)));
        if (lt > ca - 0.15) K.warning(540, 700, lerp(2.2, 1.5, eo(seg(lt, ca - 0.15, ca + 0.1))));
        K.shockLines(540, 700, 330, seg(lt, ca, ca + 0.3));
      } });
    cue(st, 'whoosh'); cue(st + ca - 0.1, 'slam', { gain: 0.45 });
  }
  // ── 12 · In twenty twenty, an artist in Berlin ───────────────
  {
    const st = cut(11), ar = Wd('artist', 11) - st, be = Wd('Berlin', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 760], zoom: 0.1, note: '2020 calendar; artist hero pops up on "artist"; Berlin skyline with TV tower rises on "Berlin"',
      draw(lt, d, t) {
        fillAll(C.sky);
        K.skyline(lerp(1700, 1250, eo(seg(lt, be - 0.3, be + 0.3))), 860, '#C9CFDA', 1);
        K.calendar(250, 400, 0.45 * E(seg(lt, 0, 0.3)), '2020', 'FEB', -0.06);
        if (lt > ar - 0.2) K.man({ x: 560, y: lerp(1900, 1000, eob(seg(lt, ar - 0.2, ar + 0.2))), s: 0.8, eyes: 'n', mouth: 'smirk', smirk: true, brow: 0.4, arm: K.ARM.hip, armL: K.ARM.wave });
        if (lt > be) K.pill('BERLIN', 860, 280, 60, C.ink, C.white, E(seg(lt, be, be + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ar - 0.15, 'boing', { gain: 0.3 }); cue(st + be, 'pop', { gain: 0.4 });
  }
  // ── 13 · slowly pulled ninety nine phones in a little wagon, ──
  {
    const st = cut(12), ni = Wd('ninety', 12) - st, wa = Wd('wagon', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 820], zoom: 0.1, note: 'side street; hero walks slowly pulling a red wagon full of phones; "99 PHONES" on "ninety"',
      draw(lt, d, t) {
        fillAll(C.sky);
        K.skyline(1100, 900, '#D5DCE6', 0.6);
        K.sideStreet(1100, -lt * 60);
        const hx = 700 + lt * 22, bob = Math.abs(Math.sin(lt * 5)) * 10;
        K.wagon(hx - 540, 1048, 1, 99, lt, lt > ni ? 1 : 0, -1);
        K.man({ x: hx, y: 655 - bob, s: 0.72, arm: K.ARM.down, armL: { e: [230, 120], h: [300, 330] }, eyes: 'n', mouth: 'smile', brow: 0.3 });
        if (lt > ni) K.pill('99 PHONES', 540, 230, 68, C.yellow, C.ink, E(seg(lt, ni, ni + 0.25)));
        if (lt > wa) K.tag('WAGON', 200, 700, hx - 540, 900, 50, E(seg(lt, wa, wa + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 2.4, gain: 0.15 }); cue(st + ni, 'pop', { gain: 0.45 }); cue(st + wa, 'pop', { gain: 0.35 });
  }
  // ── 14 · and empty streets turned red. ───────────────────────
  {
    const st = cut(13), em = Wd('empty', 13) - st, re = Wd('red', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 700], zoom: 0.14, note: 'phone map of an empty street, wagon dot crawling; road floods red on "red"; TRAFFIC JAM?! pill',
      draw(lt, d, t) {
        disc();
        const rp = eio(seg(lt, re - 0.35, re + 0.25));
        K.phone(PX, PY, PS, mapS({ segs: [{ u0: 0, u1: 1, col: TR.green }, { u0: 0.2, u1: lerp(0.2, 0.9, rp), col: TR.red }], pin: lerp(0.3, 0.34, seg(lt, 0, d)) }));
        if (lt > em) K.pill('0 CARS', 200, 280, 56, C.ink, C.white, E(seg(lt, em, em + 0.25)));
        if (lt > re) K.pill('TRAFFIC JAM?!', 760, 1170, 54, TR.red, C.white, E(seg(lt, re + 0.15, re + 0.4)));
      } });
    cue(st, 'whoosh'); cue(st + em, 'pop', { gain: 0.3 }); cue(st + re - 0.1, 'slide', { dur: 0.5, gain: 0.25 }); cue(st + re + 0.2, 'boing', { gain: 0.4 });
  }
  // ── 15 · So that traffic jam? It might just be phones. ────────
  {
    const st = cut(14), tr = Wd('traffic', 14) - st, ju = Wd('just', 14) - st, ph = Wd('phones', 14) - st;
    add({ id: 'S15', at: st, cam: [540, 650], zoom: 0.1, note: 'hero holds phone with red road, then winks to camera; wagon of phones rolls in on "phones"',
      draw(lt, d, t) {
        K.room();
        K.wagon(lerp(1500, 840, eo(seg(lt, ph - 0.4, ph + 0.1))), 1180, 0.7, 99, lt, 1);
        K.man({ x: 450, y: 1150, s: 0.95, arm: K.PHONE_ARM, holding: heldPhone(mapS({ segs: [{ u0: 0, u1: 1, col: TR.red }], car: 0.3, t })), eyes: lt > ju ? 'wink' : 'n', mouth: lt > ju ? 'grin' : 'flat', smirk: lt > ju, brow: lt > ju ? 0.5 : 0.1 });
        if (lt > tr) K.pill('TRAFFIC JAM?', 540, 190, 60, TR.red, C.white, E(seg(lt, tr, tr + 0.25)));
        if (lt > ph) K.pill('JUST PHONES', 820, 860, 54, C.yellow, C.ink, E(seg(lt, ph + 0.1, ph + 0.35)));
      } });
    cue(st, 'whoosh'); cue(st + tr, 'pop', { gain: 0.35 }); cue(st + ph - 0.4, 'slide', { dur: 0.5, gain: 0.25 }); cue(st + ph + 0.1, 'boing', { gain: 0.4 });
  }
  return { shots: S, cues: CUES };
}
