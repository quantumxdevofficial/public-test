// WHAT ACTUALLY IS RAM?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const GREEN = '#5BAE6A', PC = K.PAPER_COLS;
const disc = () => { fillAll(C.bg); circle(540, 740, 520, '#E4DCCB'); };
/** office background: wall + floor line at y 1400 */
const office = () => { fillAll(C.bg); ctx.fillStyle = C.floor; ctx.fillRect(-300, 1400, W + 600, 900); };
/** laptop screens */
const appsScreen = (n = 3, t = 0) => () => { for (let i = 0; i < n; i++) { rr(-260 + i * 180, -140, 160, 120, 14); ctx.fillStyle = PC[i % PC.length]; ctx.fill(); } K.codeLines(-260, 30, 520, 3, 1, 40, 2); };
const slowScreen = (t) => () => { ctx.fillStyle = '#E4DCCB'; ctx.fillRect(-300, -180, 600, 360); K.spinner(0, 0, 0.9, t); };

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1a · What actually is ram? ─────────────────────────────────────
  {
    const st = cut(0), rm = Wd('ram', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 760], zoom: 0.12, note: 'hero in room, finger up; RAM stick pops above him with "RAM?" on "ram"',
      draw(lt, d, t) {
        K.room();
        const p = E(seg(lt, rm, rm + 0.3));
        K.man({ x: 540, y: 1250, s: 1.25, arm: K.ARM.point, finger: -0.4, eyes: 'n', mouth: lt > rm ? 'o' : 'flat', brow: 0.6, look: 0.4 });
        if (lt > rm) { K.ramStick(540, 330, p * 1.1, Math.sin(lt * 3) * 0.06); K.pill('RAM?', 540, 160, 70, C.yellow, C.ink, p); }
      } });
    cue(st + rm, 'pop', { gain: 0.45 });
  }
  // ── 1b · why does everyone want more of it? ────────────────────────
  {
    const st = Wd('why', 0) - 0.1, ev = Wd('everyone', 0) - st, mo = Wd('more', 0) - st;
    add({ id: 'S02', at: st, cam: [540, 720], zoom: 0.14, note: 'laptop on a disc; RAM sticks drop in one after another from "everyone"; MORE RAM pill on "more"',
      draw(lt, d, t) {
        disc();
        K.laptop(540, 900, 0.85, appsScreen(3, t));
        for (let i = 0; i < 4; i++) { const a = ev - 0.1 + i * 0.22; if (lt > a) K.ramStick(540 + (i - 1.5) * 60, lerp(-200, 520 - i * 60, eo(seg(lt, a, a + 0.3))), 0.75, (i - 1.5) * 0.12); }
        if (lt > mo) K.pill('MORE RAM!', 540, 200, 72, C.yellow, C.ink, E(seg(lt, mo, mo + 0.25)));
      } });
    cue(st, 'whoosh'); for (let i = 0; i < 4; i++) cue(st + ev + 0.15 + i * 0.22, 'thud', { gain: 0.25 }); cue(st + mo, 'pop', { gain: 0.45 });
  }
  // ── 2 · Think of your computer as a desk ───────────────────────────
  {
    const st = cut(1), cp = Wd('computer', 1) - st, dk = Wd('desk', 1) - st;
    add({ id: 'S03', at: st, cam: [540, 760], zoom: 0.12, note: 'laptop pops in on "computer"; desk rises under it on "desk", laptop lands on top',
      draw(lt, d, t) {
        office();
        const dy = lerp(1900, 1020, eo(seg(lt, dk - 0.15, dk + 0.25)));
        K.desk(540, dy, 1.05);
        const ly = Math.min(lerp(700, 760, eio(seg(lt, 0, 1))), dy - 14 - 262 * 0.7);
        K.laptop(540, ly, 0.7, appsScreen(3, t), E(seg(lt, cp - 0.2, cp + 0.15)));
        if (lt > dk) K.pill('DESK', 540, 250, 76, C.ink, C.white, E(seg(lt, dk, dk + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + cp - 0.1, 'pop', { gain: 0.35 }); cue(st + dk + 0.2, 'thud', { gain: 0.4 });
  }
  // ── 3 · Storage is the filing cabinet, where your files live for good ──
  {
    const st = cut(2), cb = Wd('cabinet', 2) - st, fl = Wd('files', 2) - st, gd = Wd('good', 2) - st;
    add({ id: 'S04', at: st, cam: [540, 760], zoom: 0.1, note: 'STORAGE pill + SSD; cabinet slides in on "cabinet"; folders fly into the open drawer on "files"; green check on "good"',
      draw(lt, d, t) {
        office();
        K.pill('STORAGE', 540, 230, 76, C.ink, C.white, E(seg(lt, 0.05, 0.3)));
        K.folder(540, 420, 0.5 * E(seg(lt, 0.15, 0.45)), PC[0]);
        const cx = lerp(1500, 540, eo(seg(lt, cb - 0.3, cb + 0.15)));
        const open = seg(lt, fl - 0.3, fl) * (1 - seg(lt, gd - 0.4, gd - 0.1));
        K.fileCabinet(cx, 1400, 1.2, open);
        for (let i = 0; i < 3; i++) { const a = fl + i * 0.2, u = seg(lt, a, a + 0.45); if (u > 0 && u < 1) K.folder(lerp(150 + i * 390, 540, eio(u)), lerp(560, 520, u) - Math.sin(u * Math.PI) * 150, 0.45 * (1 - u * 0.5), PC[i]); }
        if (lt > gd) K.check(820, 520, E(seg(lt, gd, gd + 0.25)), 1);
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'pop', { gain: 0.35 }); cue(st + cb - 0.2, 'slide', { dur: 0.4, gain: 0.3 });
    cue(st + fl, 'slide', { dur: 0.7, gain: 0.25 }); cue(st + gd - 0.1, 'thud', { gain: 0.35 }); cue(st + gd, 'pop', { gain: 0.4 });
  }
  // ── 4a · but ram is the desk ───────────────────────────────────────
  {
    const st = cut(3), rm = Wd('ram', 3) - st, dk = Wd('desk', 3) - st;
    add({ id: 'S05', at: st, cam: [540, 700], zoom: 0.12, note: 'RAM stick big centre on "ram"; it bursts into the desk on "desk"',
      draw(lt, d, t) {
        disc();
        const sw = seg(lt, dk - 0.2, dk);
        if (sw < 0.5) K.ramStick(540, 700, 1.6 * E(seg(lt, 0, 0.25)) * (1 - sw * 2), Math.sin(lt * 3) * 0.04);
        else K.desk(540, 820, 1.05 * eo(seg(lt, dk - 0.05, dk + 0.15)));
        if (sw > 0 && sw < 1) K.burst(540, 760, 3, 1 - Math.abs(sw * 2 - 1));
        K.pill('RAM', 540, 250, 80, C.yellow, C.ink, E(seg(lt, 0.05, 0.3)));
        if (lt > dk) K.pill('= DESK', 540, 380, 64, C.ink, C.white, E(seg(lt, dk, dk + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + rm, 'pop', { gain: 0.4 }); cue(st + dk, 'sparkle', { dur: 0.5, gain: 0.3 });
  }
  // ── 4b · holding whatever you're using right now ───────────────────
  {
    const st = Wd('holding', 3) - 0.12, us = Wd('using', 3) - st, nw = Wd('now', 3) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.12, note: 'desk with laptop; work sheets land on the desk one by one; RIGHT NOW pill on "now"',
      draw(lt, d, t) {
        office();
        K.desk(540, 1060, 1.05);
        K.laptop(540, 1046 - 262 * 0.55, 0.55, appsScreen(3, t));
        const spots = [[200, -0.12], [880, 0.1], [330, 0.05], [750, -0.06]];
        spots.forEach(([x, r], i) => { const a = 0.15 + i * (us / 3); if (lt > a) K.paper(x, lerp(300, 1046 - 100 * 0.9, eob(seg(lt, a, a + 0.3))), 0.9, PC[i], r); });
        if (lt > nw) K.pill('RIGHT NOW', 540, 250, 70, C.yellow, C.ink, E(seg(lt, nw, nw + 0.25)));
      } });
    cue(st, 'whoosh'); for (let i = 0; i < 4; i++) cue(st + 0.35 + i * (us / 3), 'thud', { gain: 0.22 }); cue(st + nw, 'pop', { gain: 0.4 });
  }
  // ── 5 · The desk is way faster to grab from ────────────────────────
  {
    const st = cut(4), fs = Wd('faster', 4) - st, gr = Wd('grab', 4) - st;
    add({ id: 'S07', at: st, cam: [540, 760], zoom: 0.1, note: 'split: desk left (paper zips up fast, FAST) vs cabinet right (drawer, wait ring, SLOW)',
      draw(lt, d, t) {
        office();
        line([[540, 360], [540, 1400]], '#D9D0BE', 10);
        K.desk(280, 1080, 0.6);
        K.fileCabinet(810, 1400, 0.9, seg(lt, 0.2, 1.6));
        K.pill('RAM', 280, 260, 64, GREEN, C.white, E(seg(lt, 0.05, 0.3)));
        K.pill('STORAGE', 810, 260, 64, C.ink, C.white, E(seg(lt, 0.15, 0.4)));
        const cyc = ((lt - fs + 0.3) % 0.6 + 0.6) % 0.6 / 0.6;
        if (lt > fs - 0.3) { const y = lerp(1000, 520, eo(cyc)); K.paper(280, y, 0.7, PC[Math.floor((lt - fs) / 0.6 + 5) % 4]); K.speedLines(250, y + 120, 1 - cyc); }
        else K.paper(280, 1000, 0.7, PC[0]);
        if (lt > fs) K.pill('FAST', 280, 400, 70, C.yellow, C.ink, E(seg(lt, fs, fs + 0.25)));
        K.waitRing(810, 560, 0.9, t);
        if (lt > gr) K.pill('SLOW', 810, 400, 60, C.red, C.white, E(seg(lt, gr, gr + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + fs, 'zip', { gain: 0.4 }); cue(st + fs + 0.6, 'zip', { gain: 0.3 }); cue(st + gr, 'pop', { gain: 0.35 });
  }
  // ── 6 · so every app you open gets copied onto it ──────────────────
  {
    const st = cut(5), op = Wd('open', 5) - st, cp = Wd('copied', 5) - st;
    add({ id: 'S08', at: st, cam: [540, 760], zoom: 0.12, note: 'cabinet right opens on "open"; app sheets arc from drawer onto the desk left on "copied"',
      draw(lt, d, t) {
        office();
        K.desk(330, 1080, 0.75);
        K.fileCabinet(860, 1400, 0.9, seg(lt, op - 0.2, op + 0.1));
        if (lt > op - 0.1) K.appTile(860, 690, 1.3 * E(seg(lt, op - 0.1, op + 0.15)), C.shirt);
        for (let i = 0; i < 3; i++) {
          const a = cp - 0.15 + i * 0.25, u = eio(seg(lt, a, a + 0.5));
          if (lt > a) { const [x, y] = K.arcAt(860, 700, 180 + i * 150, 1080 - 14 - 100 * 0.7 - i * 20, 360, u); K.paper(x, y, 0.7, PC[i], (1 - u) * 0.6 - 0.1 + i * 0.08); }
        }
        if (lt > cp) K.pill('COPY', 540, 260, 70, C.yellow, C.ink, E(seg(lt, cp, cp + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + op - 0.1, 'pop', { gain: 0.35 }); cue(st + cp - 0.1, 'slide', { dur: 0.9, gain: 0.3 });
  }
  // ── 7 · Open too many tabs and the desk fills up ───────────────────
  {
    const st = cut(6), tb = Wd('tabs', 6) - st, fu = Wd('fills', 6) - st;
    add({ id: 'S09', at: st, cam: [540, 760], zoom: 0.16, note: 'desk with laptop; sheets pile up into tall wobbling stacks from "tabs"; meter climbs to 97% red on "fills"',
      draw(lt, d, t) {
        office();
        const sh = lt > fu ? Math.sin(lt * 40) * 4 : 0;
        K.desk(540, 1100, 1.05, sh);
        const n = Math.floor(clamp((lt - tb + 0.4) / (fu - tb + 0.4)) * 7) + (lt > tb - 0.4 ? 1 : 0);
        for (const [k, x] of [[0, 220], [1, 380], [2, 700], [3, 860]]) K.paperStack(x, 1086, 0.8, Math.max(0, n - (k % 2)), PC.slice(k), t, lt > fu ? 3 : 0);
        K.laptop(540, 1086 - 262 * 0.42, 0.42, appsScreen(3, t));
        K.memMeter(540, 260, 0.95, lerp(0.35, 0.97, eio(seg(lt, 0.1, fu + 0.2))));
      } });
    cue(st, 'whoosh'); for (let i = 0; i < 6; i++) cue(st + tb - 0.3 + i * 0.13, 'pop', { gain: 0.18 }); cue(st + fu, 'alarm', { dur: 0.7, gain: 0.25 });
  }
  // ── 8a · so stuff gets shoved back in the cabinet ──────────────────
  {
    const st = cut(7), sh = Wd('shoved', 7) - st, cb = Wd('cabinet', 7) - st;
    add({ id: 'S10', at: st, cam: [540, 760], zoom: 0.12, note: 'full desk left; sheets fly from desk into the open cabinet drawer right on "shoved"; BACK TO STORAGE pill',
      draw(lt, d, t) {
        office();
        K.desk(330, 1080, 0.75);
        for (const [k, x] of [[0, 140], [1, 260], [2, 400], [3, 520]]) K.paperStack(x, 1069, 0.6, 5 - (lt > sh + k * 0.18 ? 2 : 0), PC.slice(k));
        K.fileCabinet(860, 1400, 0.9, seg(lt, sh - 0.3, sh));
        for (let i = 0; i < 4; i++) { const a = sh + i * 0.18, u = eio(seg(lt, a, a + 0.45)); if (u > 0 && u < 1) { const [x, y] = K.arcAt(140 + i * 125, 900, 860, 820, 220, u); K.paper(x, y, 0.6, PC[i], u * 1.5); } }
        if (lt > cb) K.pill('BACK TO STORAGE', 540, 260, 60, C.red, C.white, E(seg(lt, cb, cb + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sh, 'slide', { dur: 0.9, gain: 0.3 }); cue(st + cb, 'thud', { gain: 0.3 });
  }
  // ── 8b · and everything slows down ─────────────────────────────────
  {
    const st = Wd('everything', 7) - 0.12, sl = Wd('slows', 7) - st;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.14, note: 'hero beside desk, laptop shows spinner, frown; snail crawls along the desk on "slows"',
      draw(lt, d, t) {
        office();
        K.man({ x: 260, y: 1000, s: 0.95, arm: K.ARM.hip, eyes: 'n', mouth: 'flat', frown: true, look: 0.8 });
        K.desk(700, 1120, 0.8);
        K.laptop(740, 1109 - 262 * 0.55, 0.55, slowScreen(t));
        if (lt > sl - 0.1) K.snail(lerp(470, 560, seg(lt, sl - 0.1, d)), 1109, 0.45 * E(seg(lt, sl - 0.1, sl + 0.2)), t * 0.5);
        if (lt > sl) K.pill('SLOW...', 700, 260, 70, C.red, C.white, E(seg(lt, sl, sl + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sl, 'boing', { gain: 0.3 });
  }
  // ── 9 · But here's the catch: ram only remembers while it has power ──
  {
    const st = cut(8), ct = Wd('catch', 8) - st, rm = Wd('remembers', 8) - st, pw = Wd('power', 8) - st;
    add({ id: 'S12', at: st, cam: [540, 720], zoom: 0.12, note: 'warning slams on "catch"; RAM stick with sheets floating above; plug slides into the socket and sparks on "power"',
      draw(lt, d, t) {
        disc();
        if (lt < rm - 0.1) K.warning(540, 700, lt < ct - 0.1 ? E(seg(lt, 0, 0.25)) * 0.8 : lerp(0.8, 1.6, E(seg(lt, ct - 0.1, ct + 0.15))));
        else {
          const p = E(seg(lt, rm - 0.1, rm + 0.2));
          line([[620, 790], [620, 980], [360, 980]], C.ink, 12);
          K.ramStick(620, 720, 1.2 * p);
          for (let i = 0; i < 3; i++) K.paper(500 + i * 120, 520 - Math.sin(lt * 4 + i) * 10, 0.55 * p, PC[i], (i - 1) * 0.12);
          K.socket(150, 980, 0.8);
          K.plug(lerp(-120, 260, eo(seg(lt, pw - 0.35, pw))), 980, 0.8, lt > pw ? 1 - seg(lt, pw + 0.5, pw + 1.2) * 0.6 : 0, 0, t);
        }
        if (lt > pw) K.pill('NEEDS POWER', 540, 250, 66, C.yellow, C.ink, E(seg(lt, pw, pw + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ct, 'slam', { gain: 0.45 }); cue(st + rm - 0.1, 'pop', { gain: 0.35 }); cue(st + pw, 'sparkle', { dur: 0.6, gain: 0.3 });
  }
  // ── 10 · Switch off, and the desk is wiped clean ───────────────────
  {
    const st = cut(9), sw = Wd('switch', 9) - st, wp = Wd('wiped', 9) - st, cl = Wd('clean', 9) - st;
    add({ id: 'S13', at: st, cam: [540, 760], zoom: 0.12, note: 'power button turns red on "switch" and room dims; broom sweeps the desk on "wiped"; sparkles on the empty desk on "clean"',
      draw(lt, d, t) {
        office();
        const off = lt > sw + 0.1;
        K.desk(540, 1100, 1.05);
        for (const [k, x] of [[0, 230], [1, 400], [2, 680], [3, 850]]) {
          const u = seg(lt, wp - 0.1 + k * 0.08, wp + 0.35 + k * 0.08);
          if (u < 1) { ctx.save(); ctx.globalAlpha = 1 - u; K.paperStack(x + u * 600, 1086 - Math.sin(u * Math.PI) * 120, 0.8, 3, PC.slice(k)); ctx.restore(); }
        }
        if (lt > wp - 0.2) K.broom(lerp(80, 1100, eio(seg(lt, wp - 0.2, cl + 0.1))), 1060, 0.9, -1.2);
        K.powerButton(540, 520, 0.9 * E(seg(lt, 0, 0.25)) * (1 - seg(lt, wp - 0.4, wp - 0.2)), off ? 0 : 1, seg(lt, sw - 0.05, sw + 0.05) * (1 - seg(lt, sw + 0.1, sw + 0.2)));
        if (lt > sw && lt < wp - 0.2) { ctx.save(); ctx.globalAlpha = 0.25; fillAll(C.navy); ctx.restore(); }
        if (lt > cl) for (let i = 0; i < 3; i++) K.sparkleStar(300 + i * 240, 960 - (i % 2) * 70, 0.7 * E(seg(lt, cl + i * 0.08, cl + 0.3 + i * 0.08)), 1);
      } });
    cue(st, 'whoosh'); cue(st + sw, 'tock', { gain: 0.5 }); cue(st + wp - 0.1, 'zip', { gain: 0.45 }); cue(st + cl, 'sparkle', { dur: 0.6, gain: 0.3 });
  }
  // ── 11 · which is why unsaved work disappears ──────────────────────
  {
    const st = cut(10), us = Wd('unsaved', 10) - st, ds = Wd('disappears', 10) - st;
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.14, note: 'hero left; doc card right with UNSAVED pill; it dissolves on "disappears"; hero shocked',
      draw(lt, d, t) {
        K.room();
        const gone = lt > ds;
        K.man({ x: 300, y: 1230, s: 1.05, arm: gone ? K.ARM.mouth : K.ARM.down, eyes: gone ? 'wide' : 'n', mouth: gone ? 'o' : 'smile', brow: gone ? 1 : 0.2, look: 0.8 });
        if (gone) K.shockLines(300, 860, 130, 1 - seg(lt, ds + 0.4, ds + 0.9));
        K.docCard(770, 760, 0.85, 'essay.doc', seg(lt, ds, ds + 0.8), t);
        if (lt > us && lt < ds + 0.8) K.pill('UNSAVED', 770, 420, 58, C.red, C.white, E(seg(lt, us, us + 0.25)) * (1 - seg(lt, ds + 0.4, ds + 0.8)));
      } });
    cue(st, 'whoosh'); cue(st + us, 'pop', { gain: 0.4 }); cue(st + ds, 'sparkle', { dur: 0.8, gain: 0.35 }); cue(st + ds + 0.1, 'gulp', { gain: 0.35 });
  }
  // ── 12 · and why a restart fixes so much ───────────────────────────
  {
    const st = cut(11), rs = Wd('restart', 11) - st, fx = Wd('fixes', 11) - st;
    add({ id: 'S15', at: st, cam: [540, 720], zoom: 0.12, note: 'green restart arrow spins in on "restart"; RAM meter drops from 97% red to 20% green on "fixes"; check',
      draw(lt, d, t) {
        disc();
        K.restartArrow(540, 650, 1.4 * E(seg(lt, 0, 0.25)), seg(lt, 0, rs + 0.2), lt > rs ? (lt - rs) * 1.2 * (1 - seg(lt, fx, fx + 0.4)) : 0);
        K.memMeter(540, 1050, 0.95, lerp(0.97, 0.2, eio(seg(lt, fx, fx + 0.6))));
        if (lt > fx + 0.3) K.check(830, 470, E(seg(lt, fx + 0.3, fx + 0.55)), 1);
      } });
    cue(st, 'whoosh'); cue(st + rs - 0.1, 'slide', { dur: 0.5, gain: 0.3 }); cue(st + fx, 'sparkle', { dur: 0.6, gain: 0.3 }); cue(st + fx + 0.35, 'pop', { gain: 0.4 });
  }
  // ── 13 · Clean desk, fresh start ───────────────────────────────────
  {
    const st = cut(12), cd = Wd('desk', 12) - st, fs = Wd('start', 12) - st;
    add({ id: 'S16', at: st, cam: [540, 760], zoom: 0.14, note: 'hero beside a clean, sparkling desk with laptop; winks at camera, finger up on "start"',
      draw(lt, d, t) {
        office();
        K.desk(720, 1150, 0.8);
        K.laptop(720, 1139 - 262 * 0.5, 0.5, appsScreen(1, t));
        K.man({ x: 280, y: 1040, s: 0.95, arm: lt > fs ? K.ARM.point : K.ARM.hip, finger: lt > fs ? Math.sin(lt * 9) * 0.2 : null, eyes: lt > fs ? 'wink' : 'n', mouth: lt > fs ? 'grin' : 'smirk', smirk: true, brow: 0.4 });
        for (let i = 0; i < 4; i++) K.sparkleStar(480 + i * 150, 820 - (i % 2) * 90, (0.4 + 0.25 * Math.sin(t * 5 + i)) * E(seg(lt, cd - 0.1 + i * 0.07, cd + 0.2 + i * 0.07)), 1);
        if (lt > fs) K.pill('FRESH START', 540, 250, 70, GREEN, C.white, E(seg(lt, fs, fs + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + cd, 'sparkle', { dur: 0.6, gain: 0.3 }); cue(st + fs, 'pop', { gain: 0.45 });
  }

  return { shots: S, cues: CUES };
}
