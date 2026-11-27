// WHAT DOES AIRPLANE MODE ACTUALLY DO?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const disc = () => { fillAll(C.bg); circle(540, 740, 520, '#E4DCCB'); };
const sky = () => fillAll(C.sky);
const nth = (w, i, k) => { const n = w.toLowerCase(); const hits = T.words.filter((x) => x.line === i && x.w.toLowerCase().replace(/[^a-z0-9']/g, '').startsWith(n)); return hits[Math.min(k, hits.length - 1)].s; };
const exact = (w, i) => T.words.find((x) => x.line === i && x.w.toLowerCase().replace(/[^a-z0-9']/g, '') === w).s;
const talk = (lt) => (Math.sin(lt * 18) > 0 ? 'o' : 'smile');
const clouds = (t, y0 = 200) => { for (let i = 0; i < 5; i++) { const x = ((rnd(i) * 1500 - t * 90 * (1 + rnd(i + 4))) % 1500 + 1500) % 1500 - 210, y = y0 + rnd(i + 9) * 700; ell(x, y, 110, 40, C.white); ell(x + 60, y - 22, 70, 36, C.white); } };

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · What does airplane mode actually do to your phone? ──
  {
    const st = cut(0), ai = Wd('airplane', 0) - st, dd = exact('do', 0) - st, ph = Wd('phone', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 700], zoom: 0.12, note: 'hero beside a big phone; plane button glows; airplane badge pops on "airplane"; ? on "do"',
      draw(lt, d, t) {
        disc();
        K.airplane(lerp(-300, 1400, lt / 4), 230, 0.4, 0, '#C9CFDA');
        K.man({ x: 280, y: 900, s: 0.66, arm: K.ARM.point, finger: 0.5, eyes: 'n', mouth: lt > ph ? 'o' : 'smile', brow: lt > dd ? 0.8 : 0.3, look: 1 });
        K.phone(720, 720, 0.85, () => K.ccScreen({ plane: lt > ai ? 0.6 + 0.4 * Math.sin(lt * 8) : 0 }), 0.05);
        if (lt > ai) K.planeBadge(900, 300, 0.75, E(seg(lt, ai, ai + 0.3)));
        if (lt > dd) K.qmark(280, 340, 0.9, 1, Math.sin(lt * 6) * 0.12);
      } });
    cue(st + ai, 'pop', { gain: 0.45 }); cue(st + dd, 'boing', { gain: 0.3 });
  }
  // ── 2 · Well, your phone is basically a tiny radio, ─────────────
  {
    const st = cut(1), ph = Wd('phone', 1) - st, ra = Wd('radio', 1) - st;
    const AX = 540 + 110 * 1.15, AY = 760 - 320 * 1.15;
    add({ id: 'S02', at: st, cam: [540, 650], zoom: 0.16, note: 'phone goes x-ray; antenna lights yellow on "radio"; radio waves pour out; RADIO tag',
      draw(lt, d, t) {
        K.xray(t);
        K.phoneXray(540, 760, 1.15, t);
        if (lt > ph && lt < ra) K.pill('YOUR PHONE', 540, 1180, 60, C.ink, C.white, E(seg(lt, ph, ph + 0.25)));
        if (lt > ra) {
          K.waves(AX, AY, t, { ang: -Math.PI / 2, spread: 0.9, n: 4, maxR: 380, col: C.yellow, a: 0.9 });
          circle(AX, AY, 26 * E(seg(lt, ra, ra + 0.2)), C.yellow);
          K.tag('RADIO', 250, 200, AX - 20, AY, 64, E(seg(lt, ra, ra + 0.25)));
        }
      } });
    cue(st, 'whoosh'); cue(st + ra, 'sparkle', { dur: 0.4, gain: 0.35 });
  }
  // ── 3 · always calling out to nearby cell towers. ──────────────
  {
    const st = cut(2), ca = Wd('calling', 2) - st, to = Wd('towers', 2) - st;
    const P = [230, 800], TW = [[600, 1150, 0.5], [800, 1100, 0.42], [970, 1160, 0.36]];
    add({ id: 'S03', at: st, cam: [600, 760], zoom: 0.1, note: 'phone on the left sends dotted signals to three towers on the hills; towers light yellow on "towers"',
      draw(lt, d, t) {
        sky(); clouds(t, 150); K.hills(1050, 0);
        TW.forEach(([x, y, s], k) => K.cellTower(x, y, s, lt > to ? 1 : 0, t + k));
        K.phone(P[0], P[1], 0.5, () => K.ccScreen({ bars: lt > to ? 4 : 1 + Math.floor(seg(lt, 0, to) * 3) }));
        if (lt > ca) TW.forEach(([x, y, s], k) => {
          const [tx, ty] = K.towerTop(x, y, s), p = E(seg(lt, ca + k * 0.12, ca + 0.5 + k * 0.12)), h = 120 - k * 30;
          K.route(P[0] + 60, P[1] - 200, tx, ty, h, 0, p, 0.55);
          const u = ((lt - ca) * 0.9 + k * 0.3) % 1; if (p >= 1) { const [qx, qy] = K.arcAt(P[0] + 60, P[1] - 200, tx, ty, h, u); K.signalDot(qx, qy, 0.8); }
        });
        if (lt > to) K.pill('CELL TOWERS', 700, 230, 60, C.ink, C.white, E(seg(lt, to, to + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ca, 'slide', { dur: 0.6, gain: 0.25 }); cue(st + to, 'pop', { gain: 0.4 });
  }
  // ── 4 · Airplane mode switches that radio off, ─────────────────
  {
    const st = cut(3), sw = Wd('switches', 3) - st, of = Wd('off', 3) - st;
    const PS = 1.25, fx = 540 - 72 * 0.9 * PS, fy = 720 + (-40 - 72 * 0.9) * PS;
    add({ id: 'S04', at: st, cam: [540, 640], zoom: 0.16, note: 'big phone, control centre: finger taps the plane button on "switches" (turns orange); cell + Wi-Fi grey, red slash on cell on "off"; RADIO OFF pill',
      draw(lt, d, t) {
        disc();
        const pl = E(seg(lt, sw, sw + 0.2)), off = lt > of;
        K.phone(540, 720, PS, () => K.ccScreen({ plane: pl, cell: off ? 0 : 1, crossCell: off ? E(seg(lt, of, of + 0.2)) : 0, wifi: off ? 0 : 1, bars: 4 }));
        if (lt < sw + 0.6) K.tapFinger(fx + 20, fy + 20, clamp(lt / Math.max(0.2, sw)), lt > sw - 0.05 ? 1 : 0);
        if (lt > sw) K.ripple(fx, fy, seg(lt, sw, sw + 0.5));
        if (off) K.pill('RADIO OFF', 540, 170, 70, C.red, C.white, E(seg(lt, of, of + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sw, 'pop', { gain: 0.45 }); cue(st + of, 'thud', { gain: 0.35 });
  }
  // ── 5 · and Wi-Fi too, though you can turn Wi-Fi back on. ──────
  {
    const st = cut(4), wf = nth('wifi', 4, 0) - st, wf2 = nth('wifi', 4, 1) - st, bk = Wd('back', 4) - st;
    const CS = 2.2, BX = 540 - 72 * CS, BY = 700 + 72 * CS;
    add({ id: 'S05', at: st, cam: [540, 700], zoom: 0.14, note: 'control centre close-up: Wi-Fi button is grey (WI-FI OFF); finger flips it back blue on "back"; WI-FI BACK ON pill',
      draw(lt, d, t) {
        fillAll('#5A6378');
        const wOn = lt > bk ? E(seg(lt, bk, bk + 0.2)) : 0;
        K.controlCenter(540, 700, CS, { plane: 1, cell: 0, crossCell: 1, wifi: wOn, bt: 1 });
        if (lt > wf && lt < bk) K.pill('WI-FI OFF TOO', 540, 200, 64, C.ink, C.white, E(seg(lt, wf, wf + 0.25)));
        if (lt > wf2 - 0.3 && lt < bk + 0.5) K.tapFinger(BX + 20, BY + 20, clamp((lt - wf2 + 0.3) / Math.max(0.2, bk - wf2 + 0.3)), lt > bk - 0.05 ? 1 : 0);
        if (lt > bk) { K.ripple(BX, BY, seg(lt, bk, bk + 0.5)); K.pill('WI-FI BACK ON', 540, 200, 64, C.yellow, C.ink, E(seg(lt, bk, bk + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + wf, 'thud', { gain: 0.3 }); cue(st + bk, 'pop', { gain: 0.45 });
  }
  // ── 6 · So why does the plane care? ────────────────────────────
  {
    const st = cut(5), pl = Wd('plane', 5) - st, ca = Wd('care', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 650], zoom: 0.12, note: 'airliner glides in through clouds, arriving on "plane"; big ? pops on "care"',
      draw(lt, d, t) {
        sky(); clouds(t * 2, 250);
        K.jetSide(lerp(-500, 540, eo(seg(lt, 0, Math.max(0.3, pl + 0.2)))), 720 + Math.sin(lt * 2) * 10, 1.1, t);
        if (lt > ca) K.qmark(820, 360, 1.1, 1, Math.sin(lt * 6) * 0.12);
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 0.7, gain: 0.25 }); cue(st + ca, 'boing', { gain: 0.35 });
  }
  // ── 7 · Up high, one phone can reach lots of towers at once, ───
  {
    const st = cut(6), hi = Wd('high', 6) - st, ph = Wd('phone', 6) - st, lo = Wd('lots', 6) - st, on = Wd('once', 6) - st;
    const TW = [[140, 1170], [340, 1140], [540, 1180], [740, 1140], [940, 1170]], PX = 560, PY = 330, PS = 0.62;
    add({ id: 'S07', at: st, cam: [540, 650], zoom: 0.1, note: 'plane climbs high on "high"; a glowing phone dot in a window on "phone"; yellow beams to five towers from "lots"; all towers light on "once"',
      draw(lt, d, t) {
        sky(); clouds(t, 450); K.hills(1060, 300);
        const py = lerp(620, PY, E(seg(lt, 0, Math.max(0.3, hi + 0.2))));
        TW.forEach(([x, y], k) => K.cellTower(x, y, 0.32, lt > on ? 1 : 0, t + k));
        const DX = PX + 40 * PS, DY = py - 14 * PS;
        if (lt > lo) TW.forEach(([x, y], k) => { const [tx, ty] = K.towerTop(x, y, 0.32); const p = E(seg(lt, lo + k * 0.1, lo + 0.4 + k * 0.1)); if (p > 0) line([[DX, DY], [lerp(DX, tx, p), lerp(DY, ty, p)]], 'rgba(255,212,59,0.85)', 9); });
        K.jetSide(PX, py, PS, t);
        if (lt > ph) circle(DX, DY, 14 + 5 * Math.sin(lt * 10), C.yellow);
        if (lt > on) K.pill('5 TOWERS AT ONCE', 540, 130, 58, C.ink, C.white, E(seg(lt, on, on + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ph, 'pop', { gain: 0.3 }); cue(st + lo, 'slide', { dur: 0.6, gain: 0.3 }); cue(st + on, 'sparkle', { dur: 0.4, gain: 0.35 });
  }
  // ── 8 · which can jam the networks on the ground. ──────────────
  {
    const st = cut(7), ja = Wd('jam', 7) - st, gr = Wd('ground', 7) - st;
    const TW = [[230, 1160, 0.55], [540, 1130, 0.6], [850, 1160, 0.55]];
    add({ id: 'S08', at: st, cam: [540, 700], zoom: 0.14, note: 'ground level: three towers; static scribbles their tops on "jam"; warning + NETWORK JAM pill on "ground"',
      draw(lt, d, t) {
        sky(); K.hills(1020, 700);
        TW.forEach(([x, y, s], k) => { K.cellTower(x, y, s, 0, t + k); if (lt > ja) { const [tx, ty] = K.towerTop(x, y, s); K.noise(tx, ty - 60, t + k, 120, E(seg(lt, ja, ja + 0.3))); } });
        if (lt > gr) { K.warning(540, 230, E(seg(lt, gr, gr + 0.25)) * 0.7); K.pill('NETWORK JAM', 540, 1190, 60, C.red, C.white, E(seg(lt, gr, gr + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + ja, 'alarm', { dur: 0.8, gain: 0.2 }); cue(st + gr, 'slam', { gain: 0.35 });
  }
  // ── 9 · Pilots say it can make a little buzz in their headsets, ─
  {
    const st = cut(8), pi = Wd('pilots', 8) - st, bu = Wd('buzz', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 760], zoom: 0.12, note: 'cockpit: hero as pilot in cap + headset; red buzz zig-zags at both ears on "buzz", he winces; BZZZ text',
      draw(lt, d, t) {
        sky(); clouds(t * 3, 150);
        ctx.fillStyle = C.ink; ctx.fillRect(-300, -300, 260, H + 600); ctx.fillRect(W + 40, -300, 260, H + 600);
        const bz = lt > bu;
        K.man({ x: 540 + (bz ? Math.sin(lt * 50) * 3 : 0), y: 1300, s: 1.6, eyes: bz ? 'closed' : 'n', mouth: bz ? 'flat' : talk(lt), frown: bz, brow: 0.2 });
        K.pilotCap(540, 740, 1.6); K.headphones(540, 740, 1.6, 1); K.boomMic(540, 740, 1.6);
        ctx.fillStyle = '#2A3142'; ctx.fillRect(-300, 1180, W + 600, 900); ctx.fillStyle = C.ink; ctx.fillRect(-300, 1180, W + 600, 16);
        if (bz) { const a = E(seg(lt, bu, bu + 0.2)); K.buzzZig(790, 740, 40, a, t); ctx.save(); ctx.translate(1080, 0); ctx.scale(-1, 1); K.buzzZig(790, 740, 40, a, t); ctx.restore(); bigText('BZZZ', 540, 250, 130, C.red, -0.06, a); }
        else if (lt > pi) K.pill('PILOT', 540, 250, 64, C.ink, C.white, E(seg(lt, pi, pi + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + bu, 'alarm', { dur: 0.9, gain: 0.22 });
  }
  // ── 10 · but tests never showed it messing with navigation. ────
  {
    const st = cut(9), te = Wd('tests', 9) - st, na = Wd('navigation', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 680], zoom: 0.12, note: 'clipboard of test results ticks rows from "tests"; plane flies on safely behind; green check + NAVIGATION OK on "navigation"',
      draw(lt, d, t) {
        disc();
        K.airplane(lerp(-200, 1300, lt / Math.max(1, d)), 230, 0.5, 0, '#AEB7C4');
        const tk = lt > te ? Math.min(4, Math.floor(seg(lt, te, na) * 4.99)) : 0;
        K.clipboard(540, 740, 2.2, -0.04, tk);
        if (lt > te) K.pill('FAA TESTS', 540, 390, 58, C.ink, C.white, E(seg(lt, te, te + 0.25)));
        if (lt > na) { K.check(820, 560, 1.2, E(seg(lt, na, na + 0.25))); K.pill('NAVIGATION OK', 540, 1150, 62, K.CELL_GREEN, C.white, E(seg(lt, na, na + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + te, 'pop', { gain: 0.3 }); cue(st + na, 'sparkle', { dur: 0.4, gain: 0.35 });
  }
  // ── 11 · Here's the twist: GPS still works, ────────────────────
  {
    const st = cut(10), tw = Wd('twist', 10) - st, gp = Wd('gps', 10) - st, wo = Wd('works', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 700], zoom: 0.14, note: 'phone in airplane mode (badge) shows a map; blue dot appears on "GPS"; GPS STILL WORKS pill on "works"',
      draw(lt, d, t) {
        disc();
        K.phone(540, 740, 1.0, () => K.mapScreen(t, { dot: lt > gp ? E(seg(lt, gp, gp + 0.3)) : 0, dx: Math.sin(lt * 1.5) * 20 }));
        K.planeBadge(790, 360, 0.6, 1);
        if (lt > tw && lt < gp + 0.2) bigText('TWIST!', 540, 230, 120, C.yellow, -0.05, E(seg(lt, tw, tw + 0.2)));
        if (lt > wo) K.pill('GPS STILL WORKS', 540, 230, 60, C.yellow, C.ink, E(seg(lt, wo, wo + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + tw, 'boing', { gain: 0.3 }); cue(st + gp, 'pop', { gain: 0.4 }); cue(st + wo, 'sparkle', { dur: 0.4, gain: 0.3 });
  }
  // ── 12 · because your phone only listens to satellites. ────────
  {
    const st = cut(11), li = Wd('listens', 11) - st, sa = Wd('satellites', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 700], zoom: 0.12, note: 'space: two satellites beam waves DOWN to the phone; an UP arrow from the phone gets a red X on "listens"; ONLY LISTENS pill',
      draw(lt, d, t) {
        K.space(t); K.earthCap(1050, t * 40);
        const sp = E(seg(lt, 0, 0.4));
        K.satellite(230, 240, 0.45 * sp, 0.15, t); K.satellite(850, 270, 0.45 * sp, -0.15, t + 1);
        K.waves(240, 300, t, { ang: 1.0, spread: 0.3, n: 3, maxR: 520, col: K.GPS_FOIL, a: 0.8 });
        K.waves(840, 330, t + 0.4, { ang: Math.PI - 1.0, spread: 0.3, n: 3, maxR: 520, col: K.GPS_FOIL, a: 0.8 });
        K.phone(540, 900, 0.42, () => K.mapScreen(t));
        if (lt > li) { K.arrow(540, 520, 220, -Math.PI / 2, 0.9); K.redX(540, 520, 0.32, E(seg(lt, li, li + 0.2))); K.pill('ONLY LISTENS', 540, 1180, 60, C.yellow, C.ink, E(seg(lt, li, li + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + li, 'slam', { gain: 0.3 }); cue(st + sa, 'sparkle', { dur: 0.4, gain: 0.25 });
  }
  // ── 13 · Airplane mode doesn't make your phone deaf, ───────────
  {
    const st = cut(12), ma = Wd('make', 12) - st, de = Wd('deaf', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 700], zoom: 0.14, note: 'hero by a plane window, holding his phone in airplane mode; DEAF? pill gets a red X on "deaf"',
      draw(lt, d, t) {
        disc();
        K.planeWindow(820, 560, 0.9, t);
        K.man({ x: 360, y: 900, s: 0.68, arm: K.PHONE_ARM, holding: (x, y) => K.phone(x + 10, y - 40, 0.3, () => K.ccScreen({ plane: 1, cell: 0, crossCell: 1, wifi: 1 })), eyes: 'n', mouth: talk(lt), look: 1, brow: 0.4 });
        if (lt > ma) K.pill('DEAF?', 360, 230, 76, C.ink, C.white, E(seg(lt, ma, ma + 0.25)));
        if (lt > de) K.redX(360, 230, 0.4, E(seg(lt, de, de + 0.2)));
      } });
    cue(st, 'whoosh'); cue(st + ma, 'pop', { gain: 0.35 }); cue(st + de, 'slam', { gain: 0.35 });
  }
  // ── 14 · it just makes it quiet. ───────────────────────────────
  {
    const st = cut(13), ju = Wd('just', 13) - st, qu = Wd('quiet', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 640], zoom: 0.18, note: 'hero to camera, finger up, wags it and winks on "quiet"; airplane badge + QUIET pill',
      draw(lt, d, t) {
        disc();
        const sh = E(seg(lt, ju - 0.1, ju + 0.25));
        K.man({ x: 540, y: 960, s: 0.78, arm: K.armPose(K.ARM.down, K.ARM.point, Math.min(1, sh)), finger: sh > 0.6 ? (lt > qu ? Math.sin(lt * 11) * 0.35 : 0) : null, eyes: lt > qu ? 'wink' : 'n', mouth: lt > qu ? 'smirk' : 'smile', brow: 0.3 });
        K.planeBadge(830, 330, 0.7, E(seg(lt, 0, 0.3)));
        if (lt > qu) K.pill('QUIET', 540, 200, 84, C.yellow, C.ink, E(seg(lt, qu, qu + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + qu, 'sparkle', { dur: 0.5, gain: 0.35 });
  }
  return { shots: S, cues: CUES };
}
