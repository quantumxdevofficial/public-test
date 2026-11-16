// HOW DOES YOUR PHONE KNOW IT'S YOUR FINGERPRINT?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const disc = () => { fillAll(C.bg); circle(540, 740, 520, '#E4DCCB'); };
const xbg = () => { fillAll(C.xnavy); ctx.strokeStyle = 'rgba(79,209,232,0.10)'; ctx.lineWidth = 3; for (let k = -300; k < W + 300; k += 90) { ctx.beginPath(); ctx.moveTo(k, -300); ctx.lineTo(k, H + 300); ctx.stroke(); } for (let k = -300; k < H + 300; k += 90) { ctx.beginPath(); ctx.moveTo(-300, k); ctx.lineTo(W + 300, k); ctx.stroke(); } };
const GREEN = K.FP_GREEN;
const PX = 540, PY = 700, PS = 1.3, FPY = PY + 210 * PS;   // phone + its fingerprint spot

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · How does your phone know it's your finger, and not mine? ──
  {
    const st = cut(0), ph = Wd('phone', 0) - st, fi = Wd('finger', 0) - st, mi = Wd('mine', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 760], zoom: 0.12, note: 'lock screen; finger in on "phone", unlocks green on "finger" (YOU ✓); on "mine" another tap → red, phone shakes (NOT ME ✗)',
      draw(lt, d, t) {
        disc();
        const st8 = lt > mi + 0.15 ? -1 : lt > fi ? 1 : 0;
        const shake = lt > mi + 0.15 ? Math.sin((lt - mi) * 50) * 14 * (1 - seg(lt, mi + 0.15, mi + 0.6)) : 0;
        K.phone(PX + shake, PY, PS * E(seg(lt, 0, 0.3)), K.fpLockScreen(st8, lt > fi - 0.1 ? 1 : 0, lt));
        let fp = eio(seg(lt, ph - 0.3, ph + 0.1));
        if (lt > fi + 0.4) fp = 1 - eio(seg(lt, fi + 0.4, mi - 0.15)) + eio(seg(lt, mi - 0.1, mi + 0.15));
        K.tapFinger(PX + shake, FPY, fp, 0);
        if (lt > fi && lt < mi + 0.15) K.pill('YOU ✓', 540, 180, 80, GREEN, C.white, E(seg(lt, fi, fi + 0.25)));
        if (lt > mi + 0.15) K.pill('NOT ME ✗', 540, 180, 80, C.red, C.white, E(seg(lt, mi + 0.15, mi + 0.4)));
      } });
    cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + ph, 'slide', { dur: 0.3, gain: 0.25 }); cue(st + fi, 'sparkle', { dur: 0.4, gain: 0.35 }); cue(st + mi + 0.15, 'boing', { gain: 0.4 });
  }
  // ── 2 · Well, your fingertip is covered in tiny ridges ────────────
  {
    const st = cut(1), ft = Wd('fingertip', 1) - st, ri = Wd('ridges', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 640], zoom: 0.25, note: 'big finger rises from the bottom, pad facing us; print draws in from "fingertip" to "ridges"; RIDGES pill',
      draw(lt, d, t) {
        fillAll(C.bg); circle(540, 640, 480, '#E4DCCB');
        const up = eo(seg(lt, 0, 0.45));
        K.fingerPad(540, lerp(1100, 330, up), 1.6, 1, eio(seg(lt, ft, ri + 0.2)));
        if (lt > ri) K.pill('RIDGES', 540, 170, 84, C.yellow, C.ink, E(seg(lt, ri, ri + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + ft, 'sparkle', { dur: 0.8, gain: 0.2 }); cue(st + ri, 'pop', { gain: 0.45 });
  }
  // ── 3 · and the sensor under it is a grid of tiny electric pixels ──
  {
    const st = cut(2), se = Wd('sensor', 2) - st, gr = Wd('grid', 2) - st, pi = Wd('pixels', 2) - st;
    const n = 9, cell = 84, x0 = 540 - n * cell / 2, y0 = 700 - n * cell / 2;
    add({ id: 'S03', at: st, cam: [540, 700], zoom: 0.14, note: 'x-ray: sensor chip pops on "sensor"; cells pop in a wave on "grid"; tiny charge dots blink on "pixels" + PIXELS pill',
      draw(lt, d, t) {
        xbg();
        const sp = E(seg(lt, 0, 0.35));
        ctx.save(); ctx.translate(540, 700); ctx.scale(sp, sp); ctx.translate(-540, -700);
        rr(x0 - 40, y0 - 40, n * cell + 80, n * cell + 80, 40); ctx.fillStyle = C.navy; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.cyan; ctx.stroke();
        for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
          const p = E(seg(lt, gr - 0.7 + (i + j) * 0.03, gr - 0.45 + (i + j) * 0.03)); if (p <= 0) continue;
          const cx = x0 + (i + 0.5) * cell, cy = y0 + (j + 0.5) * cell, h = (cell - 14) * p;
          rr(cx - h / 2, cy - h / 2, h, h, 10); ctx.fillStyle = '#2E3B5C'; ctx.fill();
          if (lt > pi) { const b = 0.5 + 0.5 * Math.sin(lt * 9 + i * 1.3 + j * 2.1); circle(cx, cy, 10 + 6 * b, C.yellow); }
        }
        ctx.restore();
        if (lt > se) K.pill('SENSOR', 540, 170, 80, C.cyan, C.ink, E(seg(lt, se, se + 0.25)));
        if (lt > pi) K.pill('PIXELS', 540, 1170, 72, C.yellow, C.ink, E(seg(lt, pi, pi + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + se, 'pop', { gain: 0.4 }); cue(st + gr, 'sparkle', { dur: 0.6, gain: 0.25 }); cue(st + pi, 'pop', { gain: 0.35 });
  }
  // ── 4 · Ridges touch the sensor, but valleys leave tiny air gaps ──
  const RS = { x: 540, y: 860, w: 910, n: 7 };
  {
    const st = cut(3), ri = Wd('ridges', 3) - st, to = Wd('touch', 3) - st, va = Wd('valleys', 3) - st, ga = Wd('gaps', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 820], zoom: 0.14, note: 'side cut-away: skin lowers onto the pixel row by "touch"; RIDGE tag on "ridges", VALLEY tag on "valleys", cyan air pockets + AIR GAP on "gaps"',
      draw(lt, d, t) {
        disc();
        const g = K.ridgeSide(RS.x, RS.y, RS.w, { lower: eio(seg(lt, 0, to + 0.15)), n: RS.n });
        if (lt > ga) {
          const a = E(seg(lt, ga, ga + 0.3));
          for (let i = 1; i < RS.n; i += 2) { ctx.save(); ctx.globalAlpha = 0.85; ell(g.ridgeX(i), RS.y - 26, 30 * a, 18 * a, C.cyan); ctx.restore(); }
          K.pill('AIR GAP', 540, 1170, 72, C.cyan, C.ink, a);
        }
        if (lt > ri) K.tag('RIDGE', 300, 300, g.ridgeX(2), RS.y - 60, 60, E(seg(lt, ri, ri + 0.25)));
        if (lt > va) K.tag('VALLEY', 800, 300, g.ridgeX(3), RS.y - 30, 60, E(seg(lt, va, va + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: to, gain: 0.2 }); cue(st + to + 0.1, 'thud', { gain: 0.35 }); cue(st + va, 'pop', { gain: 0.35 }); cue(st + ga, 'bubbles', { dur: 0.5, gain: 0.25 });
  }
  // ── 5a · so each pixel reads a different charge ──────────────────
  {
    const st = cut(4), pi = Wd('pixel', 4) - st, ch = Wd('charge', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 900], zoom: 0.16, note: 'same cut-away; pixels light left→right on "pixel": under ridges bright yellow, under valleys dim; STRONG / WEAK tags on "charge"',
      draw(lt, d, t) {
        disc();
        const g = K.ridgeSide(RS.x, RS.y, RS.w, { lower: 1, read: seg(lt, pi - 0.1, pi + 0.7), n: RS.n });
        if (lt > ch) {
          const a = E(seg(lt, ch, ch + 0.25));
          K.tag('STRONG', 300, 1150, g.ridgeX(2), RS.y + 60, 56, a);
          K.tag('WEAK', 800, 1150, g.ridgeX(3), RS.y + 60, 56, E(seg(lt, ch + 0.2, ch + 0.45)));
        }
      } });
    cue(st, 'whoosh'); cue(st + pi, 'sparkle', { dur: 0.6, gain: 0.25 }); cue(st + ch, 'pop', { gain: 0.35 }); cue(st + ch + 0.2, 'pop', { gain: 0.3 });
  }
  // ── 5b · and that draws your print ───────────────────────────────
  {
    const st = Wd('and', 4) - 0.1, dr = Wd('draws', 4) - st, pr = Wd('print', 4) - st;
    add({ id: 'S06', at: st, cam: [540, 700], zoom: 0.14, note: 'sensor image: rows of yellow/navy cells scan in top→bottom from "draws"; YOUR PRINT pill on "print"',
      draw(lt, d, t) {
        xbg();
        K.pixelPrint(540, 700, 1.75, 1, eio(seg(lt, dr - 0.2, pr + 0.15)), { cell: 6 });
        if (lt > pr) K.pill('YOUR PRINT', 540, 170, 80, C.yellow, C.ink, E(seg(lt, pr, pr + 0.25)));
      } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(st + dr - 0.2, 'slide', { dur: 0.7, gain: 0.25 }); cue(st + pr, 'pop', { gain: 0.45 });
  }
  // ── 6 · But it doesn't keep a photo ──────────────────────────────
  {
    const st = cut(5), dn = Wd('doesn', 5) - st, ph = Wd('photo', 5) - st;
    add({ id: 'S07', at: st, cam: [540, 720], zoom: 0.1, note: 'a print "photo" card drops in; red X slams on "photo"; NO PHOTO pill',
      draw(lt, d, t) {
        disc();
        K.fingerprint(540, lerp(-300, 720, eob(seg(lt, 0, 0.35))), 1.5, 1, { card: true });
        if (lt > ph) { K.redX(540, 720, lerp(1.9, 1.15, eo(seg(lt, ph, ph + 0.2))), 1); K.pill('NO PHOTO', 540, 170, 80, C.red, C.white, E(seg(lt, ph, ph + 0.25))); }
        else if (lt > dn) K.pill('PHOTO?', 540, 170, 80, C.ink, C.white, E(seg(lt, dn, dn + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.35, 'thud', { gain: 0.35 }); cue(st + ph + 0.05, 'slam', { gain: 0.5 });
  }
  // ── 7 · It marks the spots where lines end or split, and saves them as math ──
  {
    const st = cut(6), sp = Wd('spots', 6) - st, en = Wd('end', 6) - st, sl = Wd('split', 6) - st, ma = Wd('math', 6) - st;
    const FX = 540, FY = 740, FS = 2.1;
    add({ id: 'S08', at: st, cam: [540, 740], zoom: 0.12, note: 'big print; markers pop on "spots"; round ENDS pulse on "end"; diamond SPLITS pulse on "split"; print fades leaving a dot map + = MATH on "math"',
      draw(lt, d, t) {
        disc();
        const fade = 1 - eio(seg(lt, ma - 0.1, ma + 0.4));
        K.fingerprint(FX, FY, FS, 1, { a: 0.25 + 0.75 * fade });
        const only = lt > sl ? 'split' : lt > en ? 'end' : null, hi = 0.5 + 0.5 * Math.sin(lt * 12);
        K.minutiaMarks(FX, FY, FS, 1, seg(lt, sp - 0.05, sp + 0.6), { only: lt > ma ? null : only, hi, dim: lt > ma ? null : 0.3, links: seg(lt, ma, ma + 0.5) });
        if (lt > ma) K.pill('= MATH', 540, 170, 84, C.yellow, C.ink, E(seg(lt, ma, ma + 0.25)));
        else if (lt > sl) K.pill('SPLITS', 540, 170, 80, C.cyan, C.ink, E(seg(lt, sl, sl + 0.25)));
        else if (lt > en) K.pill('ENDS', 540, 170, 80, C.yellow, C.ink, E(seg(lt, en, en + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sp, 'sparkle', { dur: 0.5, gain: 0.3 }); cue(st + en, 'pop', { gain: 0.35 }); cue(st + sl, 'pop', { gain: 0.35 }); cue(st + ma, 'sparkle', { dur: 0.5, gain: 0.3 });
  }
  // ── 8 · locked in a secure chip that never leaves your phone ─────
  {
    const st = cut(7), se = Wd('secure', 7) - st, le = Wd('leaves', 7) - st, ph = Wd('phone', 7) - st;
    add({ id: 'S09', at: st, cam: [540, 760], zoom: 0.12, note: 'dot map shrinks into a chip; padlock snaps shut on "secure"; on "leaves" an arrow tries for the cloud and gets a red X; STAYS ON PHONE on "phone"',
      draw(lt, d, t) {
        disc();
        const sh = eio(seg(lt, 0, se));
        const pad = (x, y, s, open) => K.padlock(x, y, s, open);
        K.secureChip(540, 820, E(seg(lt, se - 0.35, se - 0.05)) * 1.1, lt > se ? 0.6 + 0.4 * Math.sin(lt * 8) : 0, eio(seg(lt, se, se + 0.25)), lt > se - 0.2 ? pad : null);
        if (sh < 1) K.minutiaMarks(540, lerp(740, 820, sh), lerp(2.1, 0.2, sh), 1, 1, { links: 1 });
        if (lt > le - 0.1) {
          const u = eo(seg(lt, le - 0.1, le + 0.3));
          K.miniCloud(900, 300, 1.5, '#3A7BD5');
          ctx.save(); ctx.setLineDash([22, 18]); line([[640, 600], [lerp(640, 790, u), lerp(600, 420, u)]], C.ink, 10); ctx.restore();
          K.redX(700, 530, lerp(1.1, 0.55, eo(seg(lt, le + 0.2, le + 0.4))), seg(lt, le + 0.2, le + 0.3));
        }
        if (lt > se) K.pill('SECURE CHIP', 540, 1170, 70, C.yellow, C.ink, E(seg(lt, se, se + 0.25)));
        if (lt > ph) K.pill('STAYS ON PHONE', 400, 190, 62, C.ink, C.white, E(seg(lt, ph, ph + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'zip', { gain: 0.3 }); cue(st + se, 'thud', { gain: 0.4 }); cue(st + le + 0.25, 'slam', { gain: 0.4 }); cue(st + ph, 'pop', { gain: 0.35 });
  }
  // ── 9 · Touch it again, and if the points match, you're in ───────
  {
    const st = cut(8), ag = Wd('again', 8) - st, po = Wd('points', 8) - st, ma = Wd('match', 8) - st, yi = Wd('in', 8) - st;
    add({ id: 'S10', at: st, cam: [540, 700], zoom: 0.12, note: 'lock screen, finger taps on "again"; saved (cyan) and new (yellow) dot maps fly in on "points", slide together on "match"; green unlock + UNLOCKED on "in"',
      draw(lt, d, t) {
        disc();
        const ok = lt > yi;
        K.phone(PX, PY, PS, K.fpLockScreen(ok ? 1 : 0, lt > ag ? 1 : 0, lt));
        K.tapFinger(PX, FPY, eio(seg(lt, 0, ag + 0.05)) * (1 - eio(seg(lt, po - 0.1, po + 0.2))), 0);
        if (lt > ag) K.ripple(PX, FPY, seg(lt, ag, ag + 0.6));
        if (lt > po - 0.1 && !ok) {
          const a = seg(lt, po - 0.1, po + 0.2), m = eio(seg(lt, ma - 0.2, ma + 0.25));
          ctx.save(); ctx.globalAlpha = a; rr(150, 330, 780, 520, 40); ctx.fillStyle = 'rgba(14,26,43,0.9)'; ctx.fill(); ctx.restore();
          K.minutiaMarks(lerp(350, 540, m), 590, 0.95, 1, a, { col: C.cyan, links: a });
          K.minutiaMarks(lerp(730, 540, m), 590, 0.95, 1, a, { col: C.yellow, links: a });
          if (lt > ma + 0.2) K.pill('MATCH!', 540, 180, 80, C.yellow, C.ink, E(seg(lt, ma + 0.2, ma + 0.45)));
        }
        if (ok) { K.pill('UNLOCKED', 540, 180, 80, GREEN, C.white, E(seg(lt, yi, yi + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + ag, 'pop', { gain: 0.3 }); cue(st + po, 'sparkle', { dur: 0.4, gain: 0.25 }); cue(st + ma, 'slide', { dur: 0.35, gain: 0.25 }); cue(st + yi, 'sparkle', { dur: 0.5, gain: 0.4 });
  }
  // ── 10 · The twist? Even identical twins have different fingerprints ──
  {
    const st = cut(9), tw = Wd('twist', 9) - st, ti = Wd('twins', 9) - st, df = Wd('different', 9) - st, fp = Wd('fingerprints', 9) - st;
    add({ id: 'S11', at: st, cam: [540, 700], zoom: 0.12, note: 'TWIST pill; two matching twin icons pop on "twins"; their print cards drop on "different" with a red ≠; minutiae pop on "fingerprints"',
      draw(lt, d, t) {
        disc();
        if (lt > tw && lt < ti) K.pill('THE TWIST', 540, 180, 84, C.red, C.white, E(seg(lt, tw, tw + 0.25)));
        { const b = lt < ti ? 0 : Math.abs(Math.sin((lt - ti) * 6)) * 12 * (1 - seg(lt, ti, ti + 0.8)); K.personIcon(330, 440 - b, 2.1 * E(seg(lt, 0.1, 0.4)), '#3A7BD5'); K.personIcon(750, 440 - b, 2.1 * E(seg(lt, 0.2, 0.5)), '#3A7BD5'); if (lt > ti && lt < ti + 0.6) K.burst(540, 440, 1.2, 1 - seg(lt, ti, ti + 0.6)); }
        if (lt > ti) { K.pill('IDENTICAL TWINS', 540, 180, 70, C.yellow, C.ink, E(seg(lt, ti, ti + 0.25))); }
        if (lt > df - 0.1) {
          const y1 = lerp(-300, 880, eob(seg(lt, df - 0.1, df + 0.25))), y2 = lerp(-300, 880, eob(seg(lt, df, df + 0.35)));
          K.fingerprint(330, y1, 0.85, 3, { card: true }); K.fingerprint(750, y2, 0.85, 8, { card: true });
          if (lt > df + 0.3) bigText('≠', 540, 880, 170, C.red, 0, E(seg(lt, df + 0.3, df + 0.5)));
        }
        if (lt > fp) { const p = seg(lt, fp, fp + 0.6); K.minutiaMarks(330, 880, 0.85, 3, p); K.minutiaMarks(750, 880, 0.85, 8, p); }
      } });
    cue(st, 'whoosh'); cue(st + tw, 'boing', { gain: 0.35 }); cue(st + ti, 'pop', { gain: 0.4 }); cue(st + df + 0.25, 'thud', { gain: 0.35 }); cue(st + df + 0.35, 'slam', { gain: 0.4 }); cue(st + fp, 'sparkle', { dur: 0.5, gain: 0.25 });
  }
  // ── 11 · because the womb shapes them too, not just your DNA ─────
  {
    const st = cut(10), wo = Wd('womb', 10) - st, to = Wd('too', 10) - st, dn = Wd('dna', 10) - st;
    add({ id: 'S12', at: st, cam: [540, 720], zoom: 0.12, note: 'curled baby in a pink womb circle pops on "womb" (WOMB pill); a tiny print glows on its hand on "too"; DNA helix + "+" pop on "DNA"',
      draw(lt, d, t) {
        disc();
        const shift = eio(seg(lt, dn - 0.35, dn));
        const wx = lerp(540, 330, shift), s0 = lerp(1, 0.82, shift);
        K.wombBaby(wx, 720, 1.05 * E(seg(lt, 0, 0.35)) * s0, lt);
        if (lt > to) { const hx = wx + 10 * 1.05 * s0, hy = 720 + 20 * 1.05 * s0; ctx.save(); ctx.globalAlpha = 0.5 + 0.5 * Math.sin(lt * 8); circle(hx, hy, 40 * s0, C.yellow); ctx.restore(); K.fingerprint(hx, hy, 0.16 * s0 * E(seg(lt, to, to + 0.25)), 2, { w: 14 }); }
        if (lt > wo) K.pill('WOMB', 540, 180, 84, C.pink, C.white, E(seg(lt, wo, wo + 0.25)));
        if (lt > dn - 0.1) {
          const p = E(seg(lt, dn - 0.1, dn + 0.25));
          bigText('+', 590, 720, 150, C.ink, 0, p);
          K.dnaHelix(820, 720, 0.75 * p, lt, 1);
          K.pill('+ DNA', 540, 1170, 72, C.yellow, C.ink, p);
        }
      } });
    cue(st, 'whoosh'); cue(st + wo, 'pop', { gain: 0.4 }); cue(st + to, 'sparkle', { dur: 0.4, gain: 0.3 }); cue(st + dn, 'pop', { gain: 0.45 });
  }
  // ── 12 · So your finger is a password nobody else was born with ──
  {
    const st = cut(11), fi = Wd('finger', 11) - st, pa = Wd('password', 11) - st, bo = Wd('born', 11) - st;
    add({ id: 'S13', at: st, cam: [540, 700], zoom: 0.16, note: 'big print card on "finger"; password dots type in above on "password"; ONE OF A KIND burst on "born"',
      draw(lt, d, t) {
        disc();
        if (lt > bo) K.burst(540, 820, 1.6, E(seg(lt, bo, bo + 0.3)));
        K.fingerprint(540, 820, 1.35 * E(seg(lt, 0, 0.35)) * (1 + 0.06 * E(seg(lt, fi, fi + 0.3)) - 0.06 * seg(lt, fi + 0.3, fi + 0.5)), 1, { card: true });
        if (lt > pa - 0.1) K.passDots(540, 300, 1.2 * E(seg(lt, pa - 0.1, pa + 0.15)), 8, (lt - pa) * 22);
        if (lt > bo) K.pill('ONE OF A KIND', 540, 1170, 72, C.yellow, C.ink, E(seg(lt, bo, bo + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + fi, 'pop', { gain: 0.4 }); for (let i = 0; i < 8; i++) cue(st + pa + i * 0.045, 'tock', { gain: 0.15 }); cue(st + bo, 'sparkle', { dur: 0.6, gain: 0.4 });
  }

  return { shots: S, cues: CUES };
}
