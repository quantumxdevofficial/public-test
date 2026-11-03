// WHAT HAPPENS WHEN YOU PRESS ENTER ON GOOGLE?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';

const Q = 'how tall is a giraffe';
const IP = '142.250.80.46';
const DNS_ROWS = [['wiki.org', '208.80.154.224'], ['google.com', IP], ['cats.net', '104.21.3.17']];
const heldSearch = (screen) => (x, y) => K.phone(x + 12, y - 70, 0.3, screen);

function sky(t) {
  fillAll(C.bg);
  for (const [x, y, s] of [[180, 300, 1], [760, 210, 0.8], [520, 420, 0.6]]) {
    const dx = Math.sin(t * 0.3 + x) * 14; ell(x + dx, y, 90 * s, 34 * s, C.white); ell(x + dx + 40 * s, y - 22 * s, 60 * s, 38 * s, C.white);
  }
  ctx.fillStyle = C.floor; ctx.fillRect(-300, 1140, W + 600, 900);
}

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · HOOK: hero with phone, giant ENTER key slams down ───────────────
  {
    const st = cut(0), pr = Wd('press', 0) - st, en = Wd('enter', 0) - st, go = Wd('google', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 760], note: 'hero types on phone; giant ENTER key pops on "press" and presses on "Enter"; ? on "Google"',
      draw(lt, d, t) {
        K.room();
        K.man({ x: 400, y: 1220, s: 1.45, arm: K.PHONE_ARM, holding: heldSearch(() => K.searchScreen(Q, lt * 14, t)),
          eyes: lt > en ? 'wide' : 'n', mouth: lt > go ? 'o' : 'smile', brow: lt > en ? 0.9 : 0.2, look: 0.6 });
        const kp = eob(seg(lt, pr - 0.15, pr + 0.2)), press = lt > en ? Math.max(0, 1 - (lt - en) * 3) : 0;
        if (kp > 0) K.enterKey(840, 900, 0.85, press, kp);
        if (lt > en) K.burst(840, 900, 1.8, clamp(1 - (lt - en) * 2.5));
        if (lt > go) bigText('?', 860, 700, 150, C.yellow, 0.2, eob(seg(lt, go, go + 0.25)));
      } });
    cue(st + pr, 'pop', { gain: 0.5 }); cue(st + en, 'thud', { gain: 0.6 }); cue(st + go, 'boing', { gain: 0.45 });
  }

  // ── 2a · the browser asks a DNS server ──────────────────────────────────
  const where = Wd('where', 1) - 0.1;
  {
    const st = cut(1), br = Wd('browser', 1) - st, dns = Wd('dns', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 760], zoom: 0.08, note: 'phone left, DNS server right; envelope "google.com?" flies over on "asks"',
      draw(lt, d, t) {
        sky(t);
        K.phone(230, 800, 0.8, () => K.searchScreen(Q, 99, t));
        if (lt > br) K.pill('BROWSER', 230, 1200, 40, C.ink, C.white, eob(seg(lt, br, br + 0.25)));
        const sp = eob(seg(lt, dns - 0.35, dns));
        if (sp > 0) { K.server(852, 790, 0.85 * sp, t); K.pill('DNS', 852, 1200, 44, C.yellow, C.ink, sp); }
        const u = eio(seg(lt, br + 0.1, dns + 0.4));
        K.route(350, 530, 720, 560, 260, 0, u);
        if (u > 0 && u < 1) { const [ex, ey] = K.arcAt(350, 530, 720, 560, 260, u); K.envelope(ex, ey, 0.6, Math.sin(lt * 8) * 0.1, 'google.com?'); }
      } });
    cue(st, 'whoosh'); cue(st + br, 'pop', { gain: 0.5 }); cue(st + br + 0.1, 'slide', { dur: 0.9, gain: 0.45 }); cue(st + dns, 'thud', { gain: 0.5 });
  }
  // ── 2b · DNS book: where does google.com live? ──────────────────────────
  {
    const gl = Wd('google', 1) - where, lv = Wd('lives', 1) - where;
    add({ id: 'S02b', at: where, cam: [540, 740], zoom: 0.1, note: 'DNS phone book card; magnifier scans, google.com row highlights on "Google"',
      draw(lt) {
        fillAll(C.bg);
        K.dnsBook(540, 760, 1, DNS_ROWS, 1, eo(seg(lt, gl, gl + 0.3)), 0, eob(seg(lt, 0, 0.3)));
        const my = lt < gl ? lerp(660, 800, Math.sin(lt * 6) * 0.5 + 0.5) : 800;
        K.magnifier(lerp(300, 330, eo(seg(lt, 0, gl))), my, 0.9);
        if (lt > lv) bigText('?', 860, 300, 140, C.yellow, 0.15, eob(seg(lt, lv, lv + 0.25)));
      } });
    cue(where, 'whoosh'); cue(where + gl, 'pop'); cue(where + lv, 'boing', { gain: 0.4 });
  }

  // ── 3 · a number comes back: the IP address ────────────────────────────
  {
    const st = cut(2), num = Wd('number', 2) - st, ip = Wd('ip', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 760], zoom: 0.12, note: 'same DNS card; the IP number types out on "number"; IP ADDRESS pill on "IP"',
      draw(lt) {
        fillAll(C.bg);
        K.dnsBook(540, 760, 1, DNS_ROWS, 1, 1, seg(lt, num - 0.1, num + 0.6));
        if (lt > num) K.arrow(760, 560, 90, Math.PI / 2, clamp((lt - num) * 4));
        if (lt > ip) K.pill('IP ADDRESS', 700, 1180, 60, C.yellow, C.ink, eob(seg(lt, ip, ip + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + num, 'sparkle', { dur: 0.6, gain: 0.4 }); cue(st + ip, 'pop');
  }

  // ── 4 · the search splits into packets and zips off ────────────────────
  {
    const st = cut(3), sr = Wd('search', 3) - st, zp = Wd('zips', 3) - st, pk = Wd('packets', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 760], zoom: 0.1, note: 'search bar breaks into numbered packets on "zips", they fly off right; pill PACKETS',
      draw(lt, d, t) {
        fillAll(C.bg);
        const bp = 1 - seg(lt, zp - 0.05, zp + 0.25);
        if (bp > 0) { ctx.save(); ctx.globalAlpha = bp; K.searchBar(540, 700, 900, Q, 99, t, 50); ctx.restore(); }
        if (lt > sr && lt < zp) K.shockLines(540, 700, 480, 0.5);
        if (lt > zp - 0.05) for (let k = 0; k < 5; k++) {
          const u = seg(lt, zp + k * 0.12, zp + k * 0.12 + 1.1), x = lerp(220 + k * 160, 1300, eio(u)), y = 700 + Math.sin(k * 2 + lt * 6) * 40 - u * 120 * (k % 2 ? 1 : -1);
          K.packet(x, y, 1.1 * eob(seg(lt, zp - 0.05, zp + 0.2)), '#' + (k + 1), Math.sin(k + lt * 4) * 0.12);
        }
        if (lt > zp) K.speedLines(540, 700, 0.5);
        if (lt > pk) K.pill('PACKETS', 540, 420, 64, C.yellow, C.ink, eob(seg(lt, pk, pk + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + zp, 'zip'); cue(st + pk, 'pop', { gain: 0.6 });
  }

  // ── 5 · packets arrive at a nearby data center ─────────────────────────
  {
    const st = cut(4), nb = Wd('nearby', 4) - st, dc = Wd('data', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 800], zoom: 0.1, note: 'packets fly in from the left along a route into the data center; DATA CENTER pill on "data"',
      draw(lt, d, t) {
        sky(t);
        K.dataCenter(600, 910, 0.95, t);
        for (let k = 0; k < 5; k++) {
          const u = eio(seg(lt, k * 0.13, k * 0.13 + 1.0));
          if (u <= 0 || u >= 1) continue;
          const [x, y] = K.arcAt(-120, 900, 560, 1000, 520, u); K.packet(x, y, 0.75 * (1 - u * 0.4), '', 0);
        }
        K.route(-120, 900, 560, 1000, 520, 0, 1, 0.25);
        if (lt > nb) K.pill('NEARBY', 230, 450, 44, C.ink, C.white, eob(seg(lt, nb, nb + 0.25)));
        if (lt > dc) K.pill('DATA CENTER', 600, 560, 64, C.yellow, C.ink, eob(seg(lt, dc, dc + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.2, 'slide', { dur: 1.0, gain: 0.4 }); cue(st + 1.1, 'thud', { gain: 0.5 }); cue(st + dc, 'pop');
  }

  // ── 6 · it doesn't search the live internet ────────────────────────────
  {
    const st = cut(5), ds = Wd("doesn't", 5) - st, lv = Wd('live', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.08, note: 'spinning globe orbited by web pages; magnifier heads to it, red X on "doesn\'t"',
      draw(lt, d, t) {
        fillAll(C.bg);
        K.globe(540, 760, 2.6, t);
        for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2 + lt * 0.6; K.webPage(540 + Math.cos(a) * 400, 760 + Math.sin(a) * 400, 0.55, K.PAGE_COLS[k], Math.sin(a) * 0.2); }
        const mp = eo(seg(lt, 0.1, ds));
        if (lt < ds + 0.15) K.magnifier(lerp(1000, 760, mp), lerp(300, 520, mp), 1.2);
        if (lt > ds) K.redX(540, 760, lerp(1.6, 1, eo(seg(lt, ds, ds + 0.2))), 1);
        if (lt > lv) K.pill('LIVE WEB', 540, 230, 56, C.red, C.white, eob(seg(lt, lv, lv + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ds, 'slam'); cue(st + lv, 'pop', { gain: 0.5 });
  }

  // ── 7 · it searches its own giant index ────────────────────────────────
  {
    const st = cut(6), gi = Wd('giant', 6) - st, ix = Wd('index', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 740], zoom: 0.12, note: 'INDEX filing cabinet grows on "giant"; drawer slides out on "index"',
      draw(lt, d, t) {
        fillAll(C.bg); ctx.fillStyle = C.floor; ctx.fillRect(-300, 1140, W + 600, 900);
        const gp = lerp(0.7, 1.05, eob(seg(lt, gi - 0.1, gi + 0.35)));
        K.indexCabinet(540, 1140 - 320 * gp, gp, eo(seg(lt, ix, ix + 0.4)));
        K.magnifier(860, 560, 0.9, -0.6 + Math.sin(lt * 5) * 0.15);
        if (lt > ix) K.pill('INDEX', 540, 260, 70, C.yellow, C.ink, eob(seg(lt, ix, ix + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + gi, 'boing', { gain: 0.35 }); cue(st + ix, 'pop');
  }

  // ── 8 · a copy of hundreds of billions of pages ────────────────────────
  {
    const st = cut(7), cp = Wd('copy', 7) - st, hd = Wd('hundreds', 7) - st, pg = Wd('pages', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 760], zoom: 0.1, note: 'web page copied on "copy", then a wall of tiny pages fills in on "hundreds"; counter pill',
      draw(lt) {
        fillAll(C.bg);
        const fill = seg(lt, hd - 0.1, pg + 0.3);
        if (lt < hd) {
          K.webPage(540, 760, 1.6, K.PAGE_COLS[0]);
          if (lt > cp) K.webPage(lerp(540, 600, eo(seg(lt, cp, cp + 0.25))), lerp(760, 720, eo(seg(lt, cp, cp + 0.25))), 1.6, K.PAGE_COLS[1]);
        } else {
          const n = Math.floor(fill * 70);
          for (let k = 0; k < 70; k++) { if (k > n) break; const c = k % 10, r = Math.floor(k / 10); K.webPage(108 + c * 96, 500 + r * 104, 0.36 * eob(clamp((fill * 70 - k) / 3)), K.PAGE_COLS[k % 6]); }
          K.pill('100s OF BILLIONS', 540, 330, 70, C.yellow, C.ink, eob(seg(lt, hd, hd + 0.25)));
        }
      } });
    cue(st, 'whoosh'); cue(st + cp, 'pop', { gain: 0.5 }); cue(st + hd, 'sparkle', { dur: 1.2, gain: 0.45 }); cue(st + hd, 'pop');
  }

  // ── 9 · up to a thousand computers team up ─────────────────────────────
  {
    const st = cut(8), th = Wd('thousand', 8) - st, tm = Wd('team', 8) - st, qn = Wd('question', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 760], zoom: 0.14, note: 'grid of mini racks light up in a wave on "thousand"; query card in the middle on "question"',
      draw(lt, d, t) {
        fillAll(C.bg);
        const wave = (lt - th) * 900;
        K.serverGrid(110, 330, 8, 6, 123, 160, 0.95, t, (k, c, r) => (Math.hypot(c * 123 - 430, r * 160 - 400) < wave ? 1 : 0));
        if (lt > th) K.pill('UP TO 1,000', 540, 200, 64, C.yellow, C.ink, eob(seg(lt, th, th + 0.25)));
        if (lt > tm) for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2, p = eo(seg(lt, tm, tm + 0.4)); ctx.save(); ctx.globalAlpha = 0.35; line([[540 + Math.cos(a) * 140, 730 + Math.sin(a) * 90], [540 + Math.cos(a) * lerp(140, 470, p), 730 + Math.sin(a) * lerp(90, 420, p)]], C.ink, 8); ctx.restore(); }
        const qp = eob(seg(lt, qn - 0.2, qn + 0.1));
        if (qp > 0) { ctx.save(); ctx.translate(540, 730); ctx.scale(qp, qp); K.searchBar(0, 0, 820, Q, 99, t, 46); ctx.restore(); }
      } });
    cue(st, 'whoosh'); cue(st + th, 'sparkle', { dur: 1.0, gain: 0.45 }); cue(st + qn, 'pop');
  }

  // ── 10 · they rank the matches by usefulness ───────────────────────────
  {
    const st = cut(9), rk = Wd('rank', 9) - st, us = Wd('useful', 9) - st;
    const from = [2, 0, 3, 1], cols = [K.PAGE_COLS[0], K.PAGE_COLS[2], K.PAGE_COLS[1], K.PAGE_COLS[3]];
    add({ id: 'S10', at: st, cam: [540, 760], zoom: 0.08, note: 'four result cards shuffle into ranked order on "rank"; gold star on #1 on "useful"',
      draw(lt) {
        fillAll(C.bg);
        const u = eio(seg(lt, rk, rk + 0.8));
        for (let i = 3; i >= 0; i--) {
          const y0 = 380 + from[i] * 210, y1 = 380 + i * 210, x = 540 + Math.sin(u * Math.PI) * (i % 2 ? 90 : -90);
          K.resultCard(x, lerp(y0, y1, u), 1, i + 1, cols[i], i === 0 ? eob(seg(lt, us, us + 0.3)) : 0);
        }
      } });
    cue(st, 'whoosh'); cue(st + rk, 'slide', { dur: 0.8, gain: 0.45 }); cue(st + us, 'pop');
  }

  // ── 11 · the results fly back to your screen ───────────────────────────
  {
    const st = cut(10), rs = Wd('results', 10) - st, bk = Wd('back', 10) - st, sc = Wd('screen', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.1, note: 'data center right → envelope flies back along the arc to the phone; results fill the phone on "screen"',
      draw(lt, d, t) {
        sky(t);
        K.dataCenter(800, 860, 0.5, t, 1);
        const u = eio(seg(lt, rs, sc + 0.05));
        K.phone(230, 800, 0.8, () => K.searchScreen(Q, 99, t, seg(lt, sc - 0.05, sc + 0.6)));
        K.route(690, 700, 360, 560, 260, 1 - u, 1);
        if (u > 0 && u < 1) { const [ex, ey] = K.arcAt(690, 700, 360, 560, 260, 1 - u); K.envelope(ex, ey, 0.6, -0.1, 'results'); }
        if (lt > bk && lt < sc) K.speedLines(560, 560, 0.4);
      } });
    cue(st, 'whoosh'); cue(st + rs, 'slide', { dur: 0.9, gain: 0.45 }); cue(st + sc, 'pop');
  }

  // ── 12 · in about two tenths of a second ───────────────────────────────
  {
    const st = cut(11), tw = Wd('two', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 760], zoom: 0.2, note: 'stopwatch hand flicks; 0.2 SEC slams on "two"',
      draw(lt) {
        fillAll(C.bg);
        K.stopwatch(540, 600, 1.1, lt < tw ? lt * 14 : tw * 14 + Math.min(lt - tw, 0.15) * 2);
        if (lt > tw) { K.burst(540, 1100, 2, clamp(1 - (lt - tw) * 2)); bigText('0.2 SEC', 540, 1110, 150, C.yellow, -0.05, eob(seg(lt, tw, tw + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'tock', { gain: 0.5 }); cue(st + tw, 'slam', { gain: 0.8 });
  }

  // ── 13 · so every time you hit Enter ───────────────────────────────────
  {
    const st = cut(12), hit = Wd('hit', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 820], zoom: 0.14, note: 'phone close-up, finger taps the search bar on "hit"; ripple; ENTER key',
      draw(lt, d, t) {
        fillAll(C.sky); circle(540, 760, 620, '#CFE8F3');
        K.phone(540, 760, 1.3, () => K.searchScreen(Q, 99, t, seg(lt, hit + 0.1, hit + 0.8)));
        const tx = 690, ty = 740;
        const fin = lt < hit ? eo(seg(lt, 0, hit)) : 1 - eio(seg(lt, hit + 0.15, hit + 0.55));
        K.ripple(tx, ty, seg(lt, hit, hit + 0.45));
        K.tapFinger(tx, ty, fin, lt > hit && lt < hit + 0.15 ? 1 : 0);
        K.enterKey(920, 200, 0.5, lt > hit ? Math.max(0, 1 - (lt - hit) * 3) : 0, eob(seg(lt, 0.05, 0.35)));
      } });
    cue(st, 'whoosh'); cue(st + hit, 'pop', { gain: 0.6 });
  }

  // ── 14 · you wake up a thousand computers (loop) ───────────────────────
  {
    const st = cut(13), wk = Wd('wake', 13) - st, th = Wd('thousand', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.06, note: 'hero in front of a wall of racks; all light up on "wake"; wink + 1,000 on "thousand"',
      draw(lt, d, t) {
        fillAll(C.bg);
        const wave = (lt - wk) * 1400;
        K.serverGrid(80, 210, 9, 3, 115, 150, 0.85, t, (k, c, r) => (Math.hypot(c * 115 - 460, r * 150) < wave ? 1 : 0));
        ctx.fillStyle = C.floor; ctx.fillRect(-300, 1560, W + 600, 700);
        K.man({ x: 540, y: 1250, s: 1.3, arm: K.PHONE_ARM, holding: heldSearch(() => K.searchScreen(Q, 99, t, 1)),
          eyes: lt > th ? 'wink' : 'n', mouth: lt > th ? 'grin' : 'smirk', smirk: true, brow: lt > wk ? 0.8 : 0.3, look: 0 });
        if (lt > th) K.pill('1,000', 870, 660, 60, C.yellow, C.ink, eob(seg(lt, th, th + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + wk, 'sparkle', { dur: 1.0, gain: 0.45 }); cue(st + th, 'boing', { gain: 0.45 });
  }

  return { shots: S, cues: CUES };
}
