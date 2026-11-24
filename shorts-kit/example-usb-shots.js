// HOW DOES A USB STICK REMEMBER YOUR FILES WITH NO POWER?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const disc = () => { fillAll(C.bg); circle(540, 740, 520, '#E4DCCB'); };
const GREEN = '#3FAE5F';
const CX = 540, CY = 640, CS = 1.45;                       // the big flash-cell cutaway
const cw = (lx, ly) => [CX + lx * CS, CY + ly * CS];
const SEATS = [[-110, -40], [-40, -48], [30, -40], [100, -46], [-80, 10], [-10, 6], [60, 12], [125, 4]];
const FCOLS = [C.yellow, '#E57A8A', '#5BAE6A', '#4FD1E8'];
const filesScreen = (p = 1) => () => {
  for (let k = 0; k < 4; k++) { const a = clamp(p * 4 - k); if (a > 0) K.folder(-195 + k * 130, 10, 0.55 * E(a), FCOLS[k]); }
};
const lastWord = (w, i) => { const hits = T.words.filter((x) => x.line === i && x.w.toLowerCase().replace(/[^a-z]/g, '').startsWith(w)); return hits[hits.length - 1].s; };

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1a · How does a USB stick remember your files ─────────────
  {
    const st = cut(0), us = Wd('usb', 0) - st, fi = Wd('files', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 700], zoom: 0.12, note: 'laptop showing folders; USB stick slides into its side on "USB"; folders copy onto it on "files"',
      draw(lt, d, t) {
        disc();
        K.laptop(500, 520, 0.95, filesScreen(seg(lt, 0, 0.6)));
        const slide = eio(seg(lt, us - 0.3, us + 0.25));
        K.usbStick(lerp(1450, 760, slide), 920, 0.7, Math.PI, { led: lt > fi ? 0.6 + 0.4 * Math.sin(lt * 14) : 0 });
        if (lt > fi) for (let k = 0; k < 3; k++) {
          const u = ((lt - fi) * 1.4 + k / 3) % 1;
          K.folder(lerp(450, 820, u), lerp(560, 900, u) - Math.sin(u * Math.PI) * 160, 0.4, FCOLS[k]);
        }
      } });
    cue(st + us - 0.2, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + us + 0.2, 'thud', { gain: 0.3 }); cue(st + fi, 'sparkle', { dur: 0.6, gain: 0.25 });
  }
  // ── 1b · with no power? ───────────────────────────────────────
  {
    const st = Wd('with', 0) - 0.08, po = Wd('power', 0) - st;
    add({ id: 'S01b', at: st, cam: [540, 650], zoom: 0.16, note: 'stick alone, cut cord with red X; files float above it; NO POWER? red pill on "power"',
      draw(lt, d, t) {
        disc();
        K.usbStick(540, 760, 1.05, 0);
        for (let k = 0; k < 3; k++) K.folder(380 + k * 160, 470 + Math.sin(lt * 3 + k) * 12, 0.45, FCOLS[k]);
        if (lt > po) { K.bolt(900, 560, 0.8 * E(seg(lt, po, po + 0.25)), 0.2, C.white); K.redX(900, 560, 0.8 * E(seg(lt, po, po + 0.25)), 1); K.pill('NO POWER?', 540, 1110, 66, C.red, C.white, E(seg(lt, po, po + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + po, 'slam', { gain: 0.3 });
  }
  // ── 2 · Inside are billions of tiny cells, each holding one bit.
  {
    const st = cut(1), bi = Wd('billions', 1) - st, ce = Wd('cells', 1) - st, b1 = Wd('bit', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 700], zoom: 0.14, note: 'stick turns see-through (x-ray board + FLASH chip); grid of cells zooms out of chip on "billions"; one cell + bit "1" on "bit"',
      draw(lt, d, t) {
        K.xray(t);
        const g = E(seg(lt, bi - 0.15, bi + 0.3));
        if (g < 1) { ctx.save(); ctx.globalAlpha = 1 - clamp(g); K.usbStick(540, 700, 1.15, 0, { open: E(seg(lt, 0, 0.4)), chipGlow: seg(lt, 0.4, 0.8) }); ctx.restore(); }
        if (g > 0) { ctx.save(); ctx.globalAlpha = clamp(g); K.memCellGrid(540, 680, 8, 8, 100, (c, r) => ((c * 7 + r * 3) % 5 < 2 ? 1 : 0), lerp(0.3, 1, g)); ctx.restore(); }
        if (lt > ce) K.pill('BILLIONS OF CELLS', 540, 210, 58, C.yellow, C.ink, E(seg(lt, ce, ce + 0.25)));
        if (lt > b1) { ctx.save(); ctx.lineWidth = 12; ctx.strokeStyle = C.yellow; rr(590, 530, 100, 100, 18); ctx.stroke(); ctx.restore();
          K.pill('1 CELL = 1 BIT', 540, 1120, 58, C.white, C.ink, E(seg(lt, b1, b1 + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + 0.3, 'sparkle', { dur: 0.4, gain: 0.25 }); cue(st + bi, 'zip', { gain: 0.3 }); cue(st + b1, 'pop', { gain: 0.4 });
  }
  // ── 3 · Every cell has a little box called a floating gate, ──
  {
    const st = cut(2), bo = Wd('box', 2) - st, fl = Wd('floating', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 640], zoom: 0.12, note: 'one cell side cutaway builds in; dark box pulses on "box"; FLOATING GATE tag on "floating"',
      draw(lt, d, t) {
        K.xray(t);
        K.flashCell(CX, CY, CS * E(seg(lt, 0, 0.35)), { t });
        if (lt > bo) { const p = 1 - seg(lt, bo + 0.4, bo + 1.0); ctx.save(); ctx.globalAlpha = p; rr(CX - 214, CY - 112, 428, 196, 26); ctx.lineWidth = 14; ctx.strokeStyle = C.yellow; ctx.stroke(); ctx.restore(); }
        if (lt > fl) K.tag('FLOATING GATE', 540, 1120, 540, CY + 70, 58, E(seg(lt, fl, fl + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + bo, 'pop', { gain: 0.35 }); cue(st + fl, 'pop', { gain: 0.4 });
  }
  // ── 4 · sealed in a thin wall of insulation. ─────────────────
  {
    const st = cut(3), se = Wd('sealed', 3) - st, wa = Wd('wall', 3) - st, ins = Wd('insulation', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 600], zoom: 0.18, note: 'same cell; wall outline glows yellow on "wall"; SEALED pill on "sealed"; INSULATION tag on "insulation"',
      draw(lt, d, t) {
        K.xray(t);
        K.flashCell(CX, CY, CS, { t, wall: lt > wa ? 0.6 + 0.4 * Math.sin(lt * 10) : 0 });
        if (lt > se) K.pill('SEALED', 540, 180, 60, C.white, C.ink, E(seg(lt, se, se + 0.25)));
        if (lt > ins) K.tag('INSULATION', 300, 1110, ...cw(-205, 60), 56, E(seg(lt, ins, ins + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + se, 'thud', { gain: 0.3 }); cue(st + wa, 'pop', { gain: 0.3 }); cue(st + ins, 'pop', { gain: 0.35 });
  }
  // ── 5 · When you save, a voltage shoves electrons through that wall,
  {
    const st = cut(4), sa = Wd('save', 4) - st, vo = Wd('voltage', 4) - st, sh = Wd('shoves', 4) - st, wa = Wd('wall', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 640], zoom: 0.14, note: 'SAVE pill on "save"; yellow bolt over the top gate on "voltage"; electrons jump from the channel up through the wall into the gate from "shoves"',
      draw(lt, d, t) {
        K.xray(t);
        const span = Math.max(0.8, wa + 0.3 - sh), prog = (lt - sh) / span * 8;
        const seated = clamp(Math.floor(prog - 0.6), 0, 8);
        K.flashCell(CX, CY, CS, { t, n: seated });
        for (let k = seated; k < 8; k++) {
          const sx = -260 + k * 74, [ex, ey] = SEATS[k];
          const u = clamp((prog - k) / 0.6, 0, 1);
          if (u <= 0) { K.electron(...cw(sx + Math.sin(t * 5 + k) * 10, 172), 20); continue; }
          K.electron(...cw(lerp(sx, ex, u), lerp(172, ey + 4, eio(u))), 22);
        }
        if (lt > vo) { K.bolt(CX + 150, CY - 400, 0.9 * E(seg(lt, vo, vo + 0.2)), 0.2); K.pill('VOLTAGE', 820, 180, 52, C.yellow, C.ink, E(seg(lt, vo, vo + 0.25))); }
        if (lt > sa) K.pill('SAVE', 240, 180, 56, C.white, C.ink, E(seg(lt, sa, sa + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sa, 'pop', { gain: 0.35 }); cue(st + vo, 'zip', { gain: 0.35 }); cue(st + sh, 'slide', { dur: 1.0, gain: 0.3 });
  }
  // ── 6 · and they get stuck inside. ───────────────────────────
  {
    const st = cut(5), stc = Wd('stuck', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 600], zoom: 0.24, note: 'gate full of electrons; they rattle (shake) on "stuck"; STUCK! pill',
      draw(lt, d, t) {
        K.xray(t);
        const sk = lt > stc ? Math.sin(lt * 40) * 6 * (1 - seg(lt, stc + 0.3, stc + 0.9)) : 0;
        K.flashCell(CX + sk, CY, CS, { t: t * (lt > stc ? 3 : 1), n: 8 });
        if (lt > stc) { K.pill('STUCK!', 540, 1110, 70, C.yellow, C.ink, E(seg(lt, stc, stc + 0.25))); K.shockLines(CX, CY - 10, 300, 1 - seg(lt, stc + 0.2, stc + 0.8)); }
      } });
    cue(st, 'whoosh'); cue(st + stc, 'boing', { gain: 0.35 });
  }
  // ── 7 · A full box blocks the current, that's a zero, ────────
  {
    const st = cut(6), fu = Wd('full', 6) - st, bl = Wd('blocks', 6) - st, ze = Wd('zero', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 640], zoom: 0.12, note: 'full cell; FULL pill; current dots hit a red stop on the channel on "blocks"; big bit 0 on "zero"',
      draw(lt, d, t) {
        K.xray(t);
        K.flashCell(CX, CY, CS, { t, n: 8, blocked: E(seg(lt, bl - 0.1, bl + 0.2)) });
        if (lt > fu) K.pill('FULL', 540, 180, 60, C.white, C.ink, E(seg(lt, fu, fu + 0.25)));
        if (lt > ze) K.bit(540, 1110, '0', E(seg(lt, ze, ze + 0.25)), 150);
      } });
    cue(st, 'whoosh'); cue(st + bl, 'thud', { gain: 0.35 }); cue(st + ze, 'pop', { gain: 0.45 });
  }
  // ── 8 · an empty one lets it flow, that's a one. ─────────────
  {
    const st = cut(7), em = Wd('empty', 7) - st, fl = Wd('flow', 7) - st, on = lastWord('one', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 640], zoom: 0.12, note: 'empty cell; EMPTY pill; yellow current dots stream along the channel on "flow"; big bit 1 on the last "one"',
      draw(lt, d, t) {
        K.xray(t);
        K.flashCell(CX, CY, CS, { t, n: 0, flow: E(seg(lt, fl - 0.1, fl + 0.2)) });
        if (lt > em) K.pill('EMPTY', 540, 180, 60, C.white, C.ink, E(seg(lt, em, em + 0.25)));
        if (lt > on) K.bit(540, 1110, '1', E(seg(lt, on, on + 0.25)), 150);
      } });
    cue(st, 'whoosh'); cue(st + fl, 'slide', { dur: 0.6, gain: 0.25 }); cue(st + on, 'pop', { gain: 0.45 });
  }
  // ── 9 · Unplug it, and the electrons just stay trapped, ──────
  {
    const st = cut(8), un = Wd('unplug', 8) - st, tr = Wd('trapped', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 650], zoom: 0.12, note: 'stick pulled out of a laptop on "unplug" (zip); inset cell full of electrons below; padlock + TRAPPED pill on "trapped"',
      draw(lt, d, t) {
        disc();
        K.laptop(380, 420, 0.7, filesScreen(1));
        const out = eio(seg(lt, un, un + 0.35));
        K.usbStick(lerp(700, 880, out), 560, 0.4, Math.PI, {});
        ctx.save(); rr(170, 760, 740, 440, 40); ctx.fillStyle = C.navy; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke(); rr(170, 760, 740, 440, 40); ctx.clip();
        K.flashCell(540, 990, 0.72, { t, n: 8 }); ctx.restore();
        if (lt > tr) { K.padlock(860, 790, 0.6 * E(seg(lt, tr, tr + 0.25)), 0); K.pill('TRAPPED', 540, 170, 64, C.yellow, C.ink, E(seg(lt, tr, tr + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + un, 'zip', { gain: 0.35 }); cue(st + tr, 'thud', { gain: 0.35 });
  }
  // ── 10 · so your files are still there next time. ────────────
  {
    const st = cut(9), sti = Wd('still', 9) - st, ti = Wd('time', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 650], zoom: 0.1, note: 'laptop, NEXT DAY pill; stick slides in, folders pop onto the screen on "still"; green STILL THERE pill on "time"',
      draw(lt, d, t) {
        disc();
        const inP = eio(seg(lt, 0.05, 0.4));
        K.laptop(500, 560, 0.95, filesScreen(seg(lt, sti - 0.1, sti + 0.4)));
        K.usbStick(lerp(1450, 760, inP), 960, 0.7, Math.PI, { led: lt > sti ? 1 : 0 });
        K.pill('NEXT DAY', 540, 200, 54, C.white, C.ink, E(seg(lt, 0, 0.25)));
        if (lt > ti) K.pill('STILL THERE ✓', 540, 1170, 60, GREEN, C.white, E(seg(lt, ti, ti + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.35, 'thud', { gain: 0.3 }); cue(st + sti, 'sparkle', { dur: 0.5, gain: 0.3 }); cue(st + ti, 'pop', { gain: 0.4 });
  }
  // ── 11 · And erasing wipes a whole block in one go, ──────────
  {
    const st = cut(10), er = Wd('erasing', 10) - st, bl = Wd('block', 10) - st, go = Wd('go', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 680], zoom: 0.12, note: 'cell grid; top half outlined yellow on "erasing"; white flash wipes every electron in it at once on "block"; ALL IN ONE GO pill',
      draw(lt, d, t) {
        K.xray(t);
        const wiped = lt > bl;
        K.memCellGrid(540, 680, 8, 8, 100, (c, r) => (r < 4 && wiped ? 0 : ((c + r) % 3 ? 1 : 0)));
        if (lt > er) { ctx.save(); ctx.lineWidth = 14; ctx.strokeStyle = C.yellow; ctx.globalAlpha = E(seg(lt, er, er + 0.2)); rr(130, 270, 820, 420, 24); ctx.stroke(); ctx.restore(); }
        if (wiped) { ctx.save(); ctx.globalAlpha = 0.9 * (1 - seg(lt, bl, bl + 0.45)); rr(140, 280, 800, 400, 20); ctx.fillStyle = C.white; ctx.fill(); ctx.restore(); }
        if (lt > er) K.pill('ERASE', 540, 190, 58, C.white, C.ink, E(seg(lt, er, er + 0.25)));
        if (lt > go) K.pill('ALL IN ONE GO', 540, 1140, 60, C.yellow, C.ink, E(seg(lt, go, go + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + er, 'pop', { gain: 0.3 }); cue(st + bl, 'zip', { gain: 0.4 }); cue(st + go, 'pop', { gain: 0.4 });
  }
  // ── 12 · which reminded a Toshiba engineer of a camera flash, ─
  {
    const st = cut(11), to = Wd('toshiba', 11) - st, ca = Wd('camera', 11) - st, fl = Wd('flash', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 680], zoom: 0.14, note: 'TOSHIBA ENGINEER pill on "Toshiba"; old camera drops in on "camera"; flash fires on "flash"',
      draw(lt, d, t) {
        disc();
        if (lt > to) K.pill('TOSHIBA ENGINEER', 540, 220, 56, C.ink, C.white, E(seg(lt, to, to + 0.25)));
        const drop = E(seg(lt, 0.05, 0.45));
        K.retroCamera(540, lerp(-300, 780, drop), 1.4, lt > fl ? 1 - seg(lt, fl + 0.15, fl + 0.9) : 0, 0);
        if (lt > fl) { fillAll(`rgba(255,255,255,${0.85 * (1 - seg(lt, fl, fl + 0.35))})`); K.pill('FLASH!', 540, 1150, 72, C.yellow, C.ink, E(seg(lt, fl, fl + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + to, 'pop', { gain: 0.35 }); cue(st + ca, 'thud', { gain: 0.3 }); cue(st + fl, 'sparkle', { dur: 0.5, gain: 0.45 });
  }
  // ── 13 · so that's why it's called flash memory. ─────────────
  {
    const st = cut(12), ca = Wd('called', 12) - st, fl = Wd('flash', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 650], zoom: 0.16, note: 'USB stick centre; big FLASH / MEMORY words slam on with a burst on "flash"',
      draw(lt, d, t) {
        disc();
        K.usbStick(540, 880, 0.95, -0.12);
        if (lt > fl) { K.burst(540, 480, 3.2, 1 - seg(lt, fl, fl + 0.6));
          bigText('FLASH', 540, 420, 190, C.yellow, -0.05, E(seg(lt, fl, fl + 0.25)));
          bigText('MEMORY', 540, 590, 120, C.white, -0.05, E(seg(lt, fl + 0.15, fl + 0.4))); }
        else if (lt > ca) K.pill('IT\'S CALLED...', 540, 480, 60, C.white, C.ink, E(seg(lt, ca, ca + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + fl, 'slam', { gain: 0.4 });
  }
  // ── 14 · Your files aren't just saved. ───────────────────────
  {
    const st = cut(13), sa = Wd('saved', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 650], zoom: 0.1, note: 'room; hero holds the USB stick up, brow raise; JUST SAVED? pill on "saved"',
      draw(lt, d, t) {
        K.room();
        K.man({ x: 540, y: 1150, s: 0.95, arm: K.PHONE_ARM, armL: K.ARM.down, holding: (x, y) => K.usbStick(x + 10, y - 80, 0.32, -1.3),
          eyes: 'n', mouth: lt > sa ? 'o' : 'smile', brow: lt > sa ? 0.8 : 0.3 });
        if (lt > sa) K.pill('JUST SAVED?', 540, 200, 60, C.white, C.ink, E(seg(lt, sa, sa + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sa, 'pop', { gain: 0.35 });
  }
  // ── 15 · They're locked in a tiny jail. ──────────────────────
  {
    const st = cut(14), lo = Wd('locked', 14) - st, ja = Wd('jail', 14) - st;
    add({ id: 'S15', at: st, cam: [540, 640], zoom: 0.14, note: 'cell full of electrons; jail bars slam down over the gate on "locked"; LOCKED UP pill on "jail"',
      draw(lt, d, t) {
        K.xray(t);
        K.flashCell(CX, CY, CS, { t, n: 8, bars: E(seg(lt, lo - 0.1, lo + 0.2)) });
        if (lt > ja) K.pill('LOCKED UP', 540, 1120, 68, C.yellow, C.ink, E(seg(lt, ja, ja + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + lo + 0.1, 'slam', { gain: 0.4 }); cue(st + ja, 'sparkle', { dur: 0.4, gain: 0.3 });
  }
  return { shots: S, cues: CUES };
}
