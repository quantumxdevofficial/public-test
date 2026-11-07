// HOW DOES A QR CODE ACTUALLY WORK?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const heldPhone = (screen) => (x, y) => K.phone(x + 12, y - 70, 0.3, screen);
const GREEN = '#5BAE6A';
const bg = (ring = '#F1E2C8') => { fillAll(C.bg); circle(540, 740, 560, ring); };

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · HOOK: hero + QR sign; a web page pops out of his phone ─────────
  {
    const st = cut(0), qr = Wd('qr', 0) - st, sq = Wd('squares', 0) - st, ws = Wd('website', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 760], zoom: 0.06, note: 'room; hero with camera phone left; QR sign slides in on "QR"; brackets on "squares"; web page pops above on "website"',
      draw(lt, d, t) {
        K.room();
        const sy = lerp(2500, 820, eob(seg(lt, qr - 0.15, qr + 0.3)));
        K.qrSign(790, sy, 0.75, 'SCAN ME');
        if (lt > sq) K.scanBrackets(790, sy + 30, 340, E(seg(lt, sq, sq + 0.25)));
        const hit = lt > ws;
        K.man({ x: 280, y: 1220, s: 0.95, arm: K.PHONE_ARM, holding: heldPhone(K.cameraScreen(t, (lt * 0.8) % 1, hit ? 1 : 0)), eyes: hit ? 'wide' : 'n', mouth: hit ? 'o' : 'smile', brow: hit ? 1 : 0.4, look: 0.8 });
        if (hit) { const p = E(seg(lt, ws, ws + 0.3)); K.webPage(330, 260, 1.1 * p, '#3A7BD5', -0.08); K.burst(330, 260, 2.6, clamp(1 - (lt - ws) * 2.5)); }
      } });
    cue(st + 0.1, 'tock', { gain: 0.2 }); cue(st + qr - 0.15, 'slide', { dur: 0.4, gain: 0.3 }); cue(st + sq, 'pop', { gain: 0.35 }); cue(st + ws, 'sparkle', { dur: 0.4, gain: 0.45 });
  }

  // ── 2 · Well, every square is one bit ──────────────────────────────────
  {
    const st = cut(1), sq = Wd('square', 1) - st, bt = Wd('bit', 1) - st;
    const [cx, cy] = K.qrCell(540, 720, 820, 9, 11);
    add({ id: 'S02', at: st, cam: [cx, cy], zoom: 0.22, note: 'big QR pops in module by module; yellow box on one square on "square"; 1 BIT pill on "bit"',
      draw(lt, d, t) {
        bg('#E9E2D2');
        K.qrCode(540, 720, 820, { reveal: seg(lt, 0, 0.9) });
        if (lt > sq) { const p = E(seg(lt, sq, sq + 0.25)), q = 820 / 25 * 1.9 * p; ctx.lineWidth = 10; ctx.strokeStyle = C.yellow; rr(cx - q / 2, cy - q / 2, q, q, 8); ctx.stroke(); }
        if (lt > bt) K.pill('= 1 BIT', cx + 40, cy - 150, 60, C.ink, C.white, E(seg(lt, bt, bt + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'sparkle', { dur: 0.6, gain: 0.25 }); cue(st + sq, 'pop', { gain: 0.4 }); cue(st + bt, 'pop', { gain: 0.4 });
  }

  // ── 3 · black means one, and white means zero ──────────────────────────
  {
    const st = cut(2), on = Wd('one', 2) - st, wh = Wd('white', 2) - st, ze = Wd('zero', 2) - st;
    const m = K.qrMatrix(1), R0 = 8, C0 = 8, N = 5, q = 160, x0 = 540 - (N * q) / 2, y0 = 760 - (N * q) / 2;
    add({ id: 'S03', at: st, cam: [540, 760], zoom: 0.08, note: 'zoomed 5x5 patch of modules; "1" tiles pop on black squares on "one"; "0" tiles on white squares on "zero"',
      draw(lt, d, t) {
        bg('#E9E2D2');
        rr(x0 - 30, y0 - 30, N * q + 60, N * q + 60, 30); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
        for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
          const dark = m[R0 + r][C0 + c], X = x0 + c * q + q / 2, Y = y0 + r * q + q / 2, k = (r * N + c) * 0.025;
          if (dark) { ctx.fillStyle = C.ink; ctx.fillRect(X - q / 2 + 4, Y - q / 2 + 4, q - 8, q - 8); }
          if (dark && lt > on + k) K.bit(X, Y, '1', E(seg(lt, on + k, on + k + 0.2)), 100);
          if (!dark && lt > ze + k * 0.6) K.bit(X, Y, '0', E(seg(lt, ze + k * 0.6, ze + k * 0.6 + 0.2)), 100);
        }
        if (lt > on) K.pill('BLACK = 1', 300, 220, 58, C.ink, C.white, E(seg(lt, on, on + 0.25)));
        if (lt > wh) K.pill('WHITE = 0', 780, 220, 58, C.white, C.ink, E(seg(lt, wh, wh + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + on, 'pop', { gain: 0.4 }); cue(st + on + 0.2, 'sparkle', { dur: 0.4, gain: 0.25 }); cue(st + ze, 'pop', { gain: 0.4 }); cue(st + ze + 0.2, 'sparkle', { dur: 0.4, gain: 0.25 });
  }

  // ── 4 · and your camera reads them like a secret message ───────────────
  {
    const st = cut(3), cm = Wd('camera', 3) - st, rd = Wd('reads', 3) - st, ms = Wd('message', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 720], zoom: 0.08, note: 'phone with camera view rises; red scan line sweeps from "reads"; bit stream flies up and turns into link banner on "message"',
      draw(lt, d, t) {
        bg('#CFE8F3');
        const py = lerp(1700, 760, eob(seg(lt, 0, 0.4)));
        const scan = lt > rd ? (lt - rd) * 1.6 % 1 : -1, found = lt > ms ? eo(seg(lt, ms, ms + 0.35)) : 0;
        K.phone(540, py, 1.05, K.cameraScreen(t, found > 0 ? -1 : scan, found, 'menu.cafe'));
        if (lt > cm) K.pill('CAMERA', 540, 200, 60, C.ink, C.white, E(seg(lt, cm, cm + 0.25)));
        if (lt > rd && lt < ms + 0.3) for (let k = 0; k < 6; k++) {
          const u = ((lt - rd) * 1.2 + k / 6) % 1;
          const x = k % 2 ? 870 : 210; K.bit(x, lerp(1050, 380, u), rnd(k) > 0.5 ? '1' : '0', clamp(Math.sin(u * Math.PI) * 1.4), 80);
        }
        if (found > 0) K.burst(540, 760 + 230 * 1.05, 2.2, clamp(1 - (lt - ms) * 2.5));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'slide', { dur: 0.35, gain: 0.3 }); cue(st + cm, 'pop', { gain: 0.35 }); cue(st + rd, 'bubbles', { dur: Math.max(0.4, ms - rd), gain: 0.2 }); cue(st + ms, 'sparkle', { dur: 0.4, gain: 0.45 });
  }

  // ── 5 · Those three big squares in the corners? ────────────────────────
  {
    const st = cut(4), th = Wd('three', 4) - st, sq = Wd('squares', 4) - st, co = Wd('corners', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 740], zoom: 0.1, note: 'big QR; yellow rings around the three finder squares from "three"; numbered pills 1-2-3 pop at each corner on "corners"',
      draw(lt, d, t) {
        bg('#E9E2D2');
        K.qrCode(540, 740, 800, { finderHi: seg(lt, th, th + 0.3) });
        if (lt > sq) K.pill('FINDER SQUARES', 540, 220, 56, C.ink, C.white, E(seg(lt, sq, sq + 0.25)));
        const pts = [[0, 0], [0, 14], [14, 0]].map(([r, c]) => K.qrCell(540, 740, 800, r + 3, c + 3));
        pts.forEach(([x, y], k) => { if (lt > co + k * 0.12) K.pill(String(k + 1), x, y, 70, C.yellow, C.ink, E(seg(lt, co + k * 0.12, co + k * 0.12 + 0.25))); });
      } });
    cue(st, 'whoosh'); cue(st + th, 'sparkle', { dur: 0.4, gain: 0.3 }); cue(st + sq, 'pop', { gain: 0.35 }); for (let k = 0; k < 3; k++) cue(st + co + k * 0.12, 'pop', { gain: 0.35 });
  }

  // ── 6 · They tell your phone which way is up ───────────────────────────
  {
    const st = cut(5), tl = Wd('tell', 5) - st, ph = Wd('phone', 5) - st, up = Wd('up', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 700], zoom: 0.08, note: 'QR lies tilted/upside-down; spins upright from "tell"; yellow UP arrow beside it on "up"',
      draw(lt, d, t) {
        bg('#CFE8F3');
        const rot = lerp(Math.PI * 0.85, 0, eio(seg(lt, tl, up)));
        K.qrCode(470, 720, 560, { rot, finderHi: 1 });
        if (lt > ph) K.scanBrackets(470, 720, 700, E(seg(lt, ph, ph + 0.25)));
        if (lt > up) { K.upArrow(890, 680, 1.2 * E(seg(lt, up, up + 0.25))); K.pill('THIS WAY UP', 540, 230, 62, C.yellow, C.ink, E(seg(lt, up, up + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + tl, 'slide', { dur: Math.max(0.3, up - tl), gain: 0.3 }); cue(st + ph, 'pop', { gain: 0.3 }); cue(st + up, 'boing', { gain: 0.4 });
  }

  // ── 7 · so it scans from almost any angle ──────────────────────────────
  {
    const st = cut(6), sc = Wd('scans', 6) - st, an = Wd('angle', 6) - st;
    const tiles = [[300, 470, -0.6], [780, 470, 0.4], [300, 950, 2.6], [780, 950, -2.1]];
    add({ id: 'S07', at: st, cam: [540, 700], zoom: 0.08, note: 'four QRs at wild angles; each gets brackets + green check in turn from "scans"; ANY ANGLE pill on "angle"',
      draw(lt, d, t) {
        bg('#E9E2D2');
        tiles.forEach(([x, y, r], k) => {
          K.qrCode(x, y, 330, { rot: r + Math.sin(t * 2 + k) * 0.05, seed: 1 + k });
          const tk = sc + k * 0.3;
          if (lt > tk) { K.scanBrackets(x, y, 420, E(seg(lt, tk, tk + 0.2))); K.check(x + 130, y + 130, 0.4 * E(seg(lt, tk + 0.1, tk + 0.3))); }
        });
        if (lt > an) K.pill('ANY ANGLE', 540, 200, 70, C.yellow, C.ink, E(seg(lt, an, an + 0.25)));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 4; k++) cue(st + sc + k * 0.3, 'pop', { gain: 0.3 }); cue(st + an, 'sparkle', { dur: 0.35, gain: 0.35 });
  }

  // ── 8 · It even hides backup data ──────────────────────────────────────
  {
    const st = cut(7), hd = Wd('hides', 7) - st, bk = Wd('backup', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 740], zoom: 0.1, note: 'QR; data modules dim from "hides"; yellow-tinted backup blocks light up across the code on "backup"; BACKUP pill',
      draw(lt, d, t) {
        bg('#E9E2D2');
        K.qrCode(540, 740, 800, { dim: 0.7 * seg(lt, hd, hd + 0.3) });
        if (lt > bk) {
          const m = K.qrMatrix(1);
          for (let r = 0; r < 21; r++) for (let c = 0; c < 21; c++) {
            if (!m[r][c] || K.isFinder(r, c) || rnd(r * 7 + c * 3) < 0.55) continue;
            const k = (r + c) * 0.02, p = E(seg(lt, bk + k, bk + k + 0.2)); if (p <= 0) continue;
            const [x, y] = K.qrCell(540, 740, 800, r, c), q = 32 * p;
            ctx.fillStyle = C.yellow; ctx.fillRect(x - q / 2, y - q / 2, q, q);
          }
          K.pill('BACKUP DATA', 540, 220, 64, C.yellow, C.ink, E(seg(lt, bk, bk + 0.25)));
        }
      } });
    cue(st, 'whoosh'); cue(st + hd, 'tock', { gain: 0.25 }); cue(st + bk, 'sparkle', { dur: 0.6, gain: 0.4 });
  }

  // ── 9 · so with up to thirty percent torn off, it still works ──────────
  {
    const st = cut(8), up = Wd('up', 8) - st, to = Wd('torn', 8) - st, wk = Wd('works', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 740], zoom: 0.08, note: 'QR; corner rips away on "torn" (tear); red 30% pill on "up"; brackets + big green check + IT WORKS on "works"',
      draw(lt, d, t) {
        bg('#E9E2D2');
        const tr = eo(seg(lt, to, to + 0.35));
        K.qrCode(540, 740, 800, { tear: tr, tearBg: '#E9E2D2', rot: tr * 0.03 });
        if (tr > 0) { const p = tr; ctx.save(); ctx.translate(lerp(840, 980, p), lerp(1040, 1160, p)); ctx.rotate(p * 0.6); ctx.globalAlpha = clamp(1.4 - p); rr(-90, -90, 180, 180, 10); ctx.fillStyle = C.white; ctx.fill(); ctx.restore(); }
        if (lt > up) K.pill('UP TO 30% GONE', 540, 220, 60, C.red, C.white, E(seg(lt, up, up + 0.25)));
        if (lt > wk) { K.scanBrackets(540, 740, 900, E(seg(lt, wk, wk + 0.2))); K.check(540, 740, 1.1 * E(seg(lt, wk, wk + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + up, 'pop', { gain: 0.35 }); cue(st + to, 'zip', { gain: 0.45 }); cue(st + wk, 'sparkle', { dur: 0.4, gain: 0.5 });
  }

  // ── 10a · It was invented in Japan in nineteen ninety-four ─────────────
  {
    const st = cut(9), iv = Wd('invented', 9) - st, jp = Wd('japan', 9) - st, yr = Wd('nineteen', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 700], zoom: 0.08, note: 'flag rises and waves on "Japan"; INVENTED pill; big 1994 calendar drops on "nineteen"',
      draw(lt, d, t) {
        fillAll(C.sky); circle(540, 760, 560, '#CFE8F3');
        K.pill('INVENTED', 540, 200, 66, C.ink, C.white, E(seg(lt, 0.1, 0.35)));
        K.flag(330, lerp(2300, 620, eob(seg(lt, 0.05, 0.45))), 1.2, t * 4);
        if (lt > jp) K.burst(330, 600, 2.4, clamp(1 - (lt - jp) * 2.5));
        if (lt > yr) K.calendar(770, lerp(-600, 760, eob(seg(lt, yr, yr + 0.4))), 0.66, '94', '1994', 0.06);
      } });
    cue(st, 'whoosh'); cue(st + iv, 'pop', { gain: 0.35 }); cue(st + 0.05, 'slide', { dur: 0.4, gain: 0.3 }); cue(st + jp, 'pop', { gain: 0.35 }); cue(st + yr + 0.35, 'thud', { gain: 0.5 });
  }

  // ── 10b · to track car parts ───────────────────────────────────────────
  {
    const st = Wd('track', 9) - 0.15, tr = Wd('track', 9) - st, cp = Wd('car', 9) - st;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.1, note: 'factory belt; boxes with QR labels slide right with gears on top; brackets + check snap on the middle box on "car"',
      draw(lt, d, t) {
        fillAll(C.bg); ctx.fillStyle = C.floor; ctx.fillRect(-300, 1100, W + 600, 900);
        rr(-200, 1060, W + 400, 60, 30); ctx.fillStyle = C.pants; ctx.fill();
        for (let k = 0; k < 9; k++) circle(((k * 140 + lt * 120) % 1260) - 90, 1090, 18, '#7C8391');
        const off = (lt - cp) * 120;
        for (let k = -2; k <= 1; k++) { const bx = 540 + k * 520 + off; K.partBox(bx, 860, 0.8, 3 + k); K.gear(bx + 40, 640, 0.6, t * 2 + k); }
        if (lt > cp) { K.scanBrackets(540 + off - 64, 892, 220, E(seg(lt, cp, cp + 0.2))); K.pill('CAR PARTS', 540, 230, 66, C.yellow, C.ink, E(seg(lt, cp, cp + 0.25))); }
        if (lt > tr) K.pill('TRACKED', 540, 380, 50, C.ink, C.white, E(seg(lt, tr + 0.1, tr + 0.35)));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'slide', { dur: 1, gain: 0.2 }); cue(st + cp, 'pop', { gain: 0.4 });
  }

  // ── 11 · But here's the twist ──────────────────────────────────────────
  {
    const st = cut(10), tw = Wd('twist', 10) - st;
    add({ id: 'S12', at: st, cam: [540, 600], zoom: 0.14, note: 'room; hero holding camera phone, eyebrows up; red warning pops by his head on "twist"',
      draw(lt, d, t) {
        K.room();
        const hit = lt > tw;
        K.man({ x: 540, y: 1180, s: 1.0, arm: K.PHONE_ARM, holding: heldPhone(K.cameraScreen(t, (lt * 0.8) % 1, 0)), eyes: hit ? 'wide' : 'n', mouth: hit ? 'o' : 'smirk', brow: hit ? 1 : 0.6, smirk: !hit });
        if (hit) { K.warning(840, 380, 0.8 * E(seg(lt, tw, tw + 0.25))); K.shockLines(540, 830, 150, clamp((lt - tw) * 4)); }
      } });
    cue(st, 'whoosh'); cue(st + tw, 'slam', { gain: 0.45 });
  }

  // ── 12 · a QR code is just a link ──────────────────────────────────────
  {
    const st = cut(11), js = Wd('just', 11) - st, lk = Wd('link', 11) - st;
    add({ id: 'S13', at: st, cam: [540, 720], zoom: 0.08, note: 'QR top; arrow down from "just"; address bar with a typed link pops below on "link"',
      draw(lt, d, t) {
        bg('#CFE8F3');
        K.qrCode(540, 520, 520, { reveal: seg(lt, 0, 0.5) });
        if (lt > js) { const p = E(seg(lt, js, js + 0.3)); ctx.save(); ctx.globalAlpha = clamp(p); ctx.fillStyle = C.ink; ctx.beginPath(); ctx.moveTo(500, 820); ctx.lineTo(580, 820); ctx.lineTo(580, 880); ctx.lineTo(620, 880); ctx.lineTo(540, 960); ctx.lineTo(460, 880); ctx.lineTo(500, 880); ctx.closePath(); ctx.fill(); ctx.restore(); }
        if (lt > lk) { K.addressBar(540, 1060, 820, 'https://menu.cafe/order', null, E(seg(lt, lk, lk + 0.25)), (lt - lk) * 40); K.pill('JUST A LINK', 540, 180, 66, C.yellow, C.ink, E(seg(lt, lk, lk + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + js, 'slide', { dur: 0.3, gain: 0.25 }); cue(st + lk, 'pop', { gain: 0.45 });
  }

  // ── 13 · and scammers stick fake ones over real ones ───────────────────
  {
    const st = cut(12), sc = Wd('scammers', 12) - st, fk = Wd('fake', 12) - st, re = Wd('real', 12) - st;
    add({ id: 'S14', at: st, cam: [540, 720], zoom: 0.1, note: 'PAY PARKING sign; fake QR sticker slaps down over the real code on "fake"; corner peels on "real" showing the real one; red FAKE pill + REAL pill',
      draw(lt, d, t) {
        bg('#F6D9DC');
        const stk = eo(seg(lt, fk - 0.3, fk + 0.05)), peel = eo(seg(lt, re, re + 0.35));
        K.qrSign(540, 720, 1.05, 'PAY PARKING', { col: C.pants, sticker: stk, peel });
        if (lt > sc) K.pill('SCAMMERS', 540, 140, 56, C.ink, C.white, E(seg(lt, sc, sc + 0.25)));
        if (lt > fk + 0.05) { K.pill('FAKE STICKER', 300, 1180, 52, C.red, C.white, E(seg(lt, fk + 0.05, fk + 0.3))); K.burst(540, 760, 3, clamp(1 - (lt - fk - 0.05) * 2.5)); }
        if (lt > re) K.pill('REAL ONE UNDER', 790, 1180, 46, C.ink, C.white, E(seg(lt, re, re + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sc, 'pop', { gain: 0.3 }); cue(st + fk - 0.3, 'zip', { gain: 0.35 }); cue(st + fk + 0.05, 'slam', { gain: 0.5 }); cue(st + re, 'slide', { dur: 0.3, gain: 0.3 });
  }

  // ── 14 · So always check the link before you tap (loop) ────────────────
  {
    const st = cut(13), ck = Wd('check', 13) - st, lk = Wd('link', 13) - st, bf = Wd('before', 13) - st, tp = Wd('tap', 13) - st;
    add({ id: 'S15', at: st, cam: [540, 700], zoom: 0.06, note: 'room; hero left holding phone; address bar above with a weird link; magnifier slides over it on "check"; red alert on "link"; finger wag on "before", wink on "tap"',
      draw(lt, d, t) {
        K.room();
        K.addressBar(540, 240, 900, 'pay-parkng.xyz/login', null, E(seg(lt, 0.05, 0.35)));
        K.phone(790, 840, 0.7, K.cameraScreen(t, -1, 1, 'pay-parkng.xyz'));
        if (lt > ck) K.magnifier(lerp(220, 700, eio(seg(lt, ck, lk))), 270, 1.2, -0.6);
        if (lt > lk) K.alertBadge(960, 400, 0.75 * E(seg(lt, lk, lk + 0.25)));
        const wag = lt > bf ? Math.sin(lt * 11) * 0.35 : 0;
        K.man({ x: 340, y: 1240, s: 0.9, arm: K.armPose(K.ARM.down, K.ARM.point, eo(seg(lt, bf, bf + 0.3))), finger: lt > bf ? wag : null,
          eyes: lt > tp + 0.1 ? 'wink' : 'n', mouth: lt > tp + 0.1 ? 'grin' : 'smirk', brow: 0.6, look: 0.4 });
      } });
    cue(st, 'whoosh'); cue(st + ck, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + lk, 'alarm', { dur: 0.45, gain: 0.25 }); cue(st + tp + 0.1, 'boing', { gain: 0.4 });
  }

  return { shots: S, cues: CUES };
}
