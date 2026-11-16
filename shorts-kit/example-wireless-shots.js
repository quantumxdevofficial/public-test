// HOW DOES WIRELESS CHARGING ACTUALLY WORK?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const disc = () => { fillAll(C.bg); circle(540, 740, 520, '#E4DCCB'); };
const desk = () => { fillAll('#E4DCCB'); ctx.fillStyle = '#D8CCB4'; for (let k = -2; k < 9; k++) ctx.fillRect(-300, 120 + k * 260, W + 600, 8); };
const xbg = () => { fillAll(C.xnavy); ctx.strokeStyle = 'rgba(79,209,232,0.10)'; ctx.lineWidth = 3; for (let k = -300; k < W + 300; k += 90) { ctx.beginPath(); ctx.moveTo(k, -300); ctx.lineTo(k, H + 300); ctx.stroke(); } for (let k = -300; k < H + 300; k += 90) { ctx.beginPath(); ctx.moveTo(-300, k); ctx.lineTo(W + 300, k); ctx.stroke(); } };
// lock screen with the charging ring (pct 0..100)
const lockScreen = (pct, on = 1) => () => {
  ctx.fillStyle = '#1F2A44'; ctx.fillRect(-166, -350, 332, 700);
  ctx.fillStyle = C.white; ctx.font = '900 64px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('9:41', 0, -230);
  if (on > 0) {
    ctx.save(); ctx.globalAlpha = clamp(on);
    ctx.lineWidth = 22; ctx.strokeStyle = '#2E3B5C'; ctx.beginPath(); ctx.arc(0, 40, 100, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#5BAE6A'; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, 40, 100, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct / 100); ctx.stroke();
    K.bolt(0, 40, 0.7, 0);
    ctx.fillStyle = C.white; ctx.font = '900 44px Inter'; ctx.fillText(Math.round(pct) + '%', 0, 210);
    ctx.restore();
  }
};
// side-view stack: pad at PADY, phone above with a gap
const SX = 540, PADY = 900, PHY = 760;

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · How does your phone charge just lying on a pad? ───────────
  {
    const st = cut(0), ph = Wd('phone', 0) - st, ch = Wd('charge', 0) - st, pa = Wd('pad', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 740], zoom: 0.14, note: 'desk top-down: pad pops in; phone drops onto it on "phone"; charging ring lights on "charge"; NO CABLE? pill on "pad"',
      draw(lt, d, t) {
        desk();
        K.chargePad(540, 760, 1.25 * E(seg(lt, 0, 0.3)), lt > ch ? 1 : 0);
        const drop = eio(seg(lt, ph - 0.2, ph + 0.25));
        if (lt > ph - 0.2) {
          const sc = lerp(1.45, 1.0, drop);
          ctx.save(); ctx.globalAlpha = 0.18 * drop; rr(540 - 200 + 30, 760 - 390 + 40, 400, 780, 64); ctx.fillStyle = C.ink; ctx.fill(); ctx.restore();
          K.phone(540, 760 - (1 - drop) * 120, sc, lockScreen(lt > ch ? lerp(23, 24, seg(lt, ch, d)) : 23, E(seg(lt, ch, ch + 0.3))));
        }
        if (lt > ch) K.ripple(540, 800, seg(lt, ch, ch + 0.7));
        if (lt > pa) K.pill('NO CABLE?', 540, 190, 80, C.yellow, C.ink, E(seg(lt, pa, pa + 0.25)));
      } });
    cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + ph + 0.2, 'thud', { gain: 0.4 }); cue(st + ch, 'sparkle', { dur: 0.4, gain: 0.3 }); cue(st + pa, 'pop', { gain: 0.45 });
  }
  // ── 2 · Well, inside the pad there's a flat coil of wire ──────────
  {
    const st = cut(1), pa = Wd('pad', 1) - st, co = Wd('coil', 1) - st, wi = Wd('wire', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 760], zoom: 0.12, note: 'pad top-down; lid fades to x-ray on "pad"; copper coil winds in up to "coil"; COIL pill; WIRE tag on "wire"',
      draw(lt, d, t) {
        desk();
        const rev = eio(seg(lt, pa - 0.1, pa + 0.35));
        K.padXray(540, 760, 1.4, rev, eio(seg(lt, pa + 0.1, co + 0.2)), 0);
        if (lt > co) K.pill('COIL', 540, 190, 80, C.yellow, C.ink, E(seg(lt, co, co + 0.25)));
        if (lt > wi) K.tag('WIRE', 840, 1180, 760, 1010, 56, E(seg(lt, wi, wi + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + pa, 'sparkle', { dur: 0.4, gain: 0.25 }); cue(st + pa + 0.1, 'slide', { dur: 0.8, gain: 0.2 }); cue(st + co, 'pop', { gain: 0.4 }); cue(st + wi, 'pop', { gain: 0.3 });
  }
  // ── 3 · and electricity rushing back and forth through it ─────────
  {
    const st = cut(2), el = Wd('electricity', 2) - st, ba = Wd('back', 2) - st, fo = Wd('forth', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 760], zoom: 0.16, note: 'x-ray coil close-up; bolt on "electricity"; yellow current dots run one way on "back", reverse on "forth" (arrow flips); BACK & FORTH pill',
      draw(lt, d, t) {
        xbg();
        K.coil(540, 760, 380, 6, 1, 0, 26);
        let ph = 0, dir = 1;
        if (lt > el) ph = lt < fo ? (lt - el) * 0.35 : (fo - el) * 0.35 - (lt - fo) * 0.35;
        if (lt > fo) dir = -1;
        if (lt > fo + 0.6) { const w = Math.sin((lt - fo - 0.6) * 9); ph = (fo - el) * 0.35 - 0.21 + w * 0.04; dir = Math.cos((lt - fo - 0.6) * 9) > 0 ? 1 : -1; }
        K.currentDots(540, 760, 380, 6, ph, E(seg(lt, el - 0.1, el + 0.2)), 22, 13);
        if (lt > el - 0.15 && lt < ba) K.bolt(540, 760, 1.6 * E(seg(lt, el - 0.15, el + 0.15)) * (1 - seg(lt, ba - 0.2, ba)));
        if (lt > ba) { ctx.save(); ctx.translate(540, 250); ctx.scale(dir, 1); K.arrow(-110, 0, 220, 0, 1); ctx.restore(); }
        if (lt > ba) K.pill(lt > fo ? 'BACK & FORTH' : 'BACK…', 540, 1180, 64, C.yellow, C.ink, E(seg(lt, ba, ba + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + el, 'sparkle', { dur: 0.5, gain: 0.3 }); cue(st + ba, 'slide', { dur: 0.35, gain: 0.25 }); cue(st + fo, 'slide', { dur: 0.35, gain: 0.25 });
  }
  // ── 4a · makes a magnetic field ───────────────────────────────────
  {
    const st = cut(3), ma = Wd('magnetic', 3) - st, fi = Wd('field', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 820], zoom: 0.12, note: 'side cut-away of the pad; blue field loops grow out of the coil from "magnetic"; MAGNETIC FIELD pill on "field"',
      draw(lt, d, t) {
        disc();
        K.fieldLoops(SX, PADY - 2, 760, 330, lt * 0.8, 1, eio(seg(lt, ma - 0.15, fi + 0.4)));
        K.padSide(SX, PADY, 1.3, 0.4 + 0.3 * Math.sin(lt * 10));
        if (lt > fi) K.pill('MAGNETIC FIELD', 540, 230, 66, C.yellow, C.ink, E(seg(lt, fi, fi + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ma - 0.1, 'sparkle', { dur: 0.7, gain: 0.25 }); cue(st + fi, 'pop', { gain: 0.4 });
  }
  // ── 4b · that flips thousands of times a second ───────────────────
  {
    const st = Wd('that', 3) - 0.1, fl = Wd('flips', 3) - st, th = Wd('thousands', 3) - st, se = Wd('second', 3) - st;
    add({ id: 'S05', at: st, cam: [540, 820], zoom: 0.16, note: 'same pad; N/S tags swap on "flips", field flow reverses; from "thousands" they swap faster and faster; 1000s × A SECOND pill on "second"',
      draw(lt, d, t) {
        disc();
        let n = 0;
        if (lt > fl) n = 1;
        if (lt > th) { const u = lt - th; n = 1 + Math.floor(u * (4 + u * 12)); }
        const flip = n % 2 === 1, ph = flip ? -lt * 0.8 : lt * 0.8;
        K.fieldLoops(SX, PADY - 2, 760, 330, ph, 1, 1);
        K.padSide(SX, PADY, 1.3, 0.5);
        K.poles(SX, PADY - 300, PADY + 230, flip, 1.2);
        if (lt > fl && lt < th) K.pill('FLIP!', 540, 230, 76, C.ink, C.white, E(seg(lt, fl, fl + 0.25)));
        if (lt > th) K.pill(lt > se ? '1000s × A SECOND' : '1000s ×', 540, 230, 64, C.yellow, C.ink, E(seg(lt, th, th + 0.25)));
      } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(st + fl, 'boing', { gain: 0.35 });
    for (let i = 0; i < 7; i++) cue(st + th + i * 0.14, 'tock', { gain: 0.18 }); cue(st + se, 'pop', { gain: 0.4 });
  }
  // ── 5 · Your phone hides its own coil in the back ─────────────────
  {
    const st = cut(4), hi = Wd('hides', 4) - st, co = Wd('coil', 4) - st, ba = Wd('back', 4) - st;
    add({ id: 'S06', at: st, cam: [540, 740], zoom: 0.12, note: 'phone spins round to its back on "hides"; x-ray reveals a copper coil on "coil"; RECEIVER COIL tag on "back"',
      draw(lt, d, t) {
        disc();
        const spin = eio(seg(lt, hi - 0.25, hi + 0.25)), sx = Math.abs(Math.cos(spin * Math.PI));
        ctx.save(); ctx.translate(540, 740); ctx.scale(Math.max(0.02, sx), 1); ctx.translate(-540, -740);
        if (spin < 0.5) K.phone(540, 740, 1.15, lockScreen(23, 0));
        else K.phoneBack(540, 740, 1.15, eio(seg(lt, co - 0.25, co + 0.15)), 0, 0, eio(seg(lt, co - 0.2, co + 0.4)));
        ctx.restore();
        if (lt > ba) K.pill('RECEIVER COIL', 540, 190, 64, C.yellow, C.ink, E(seg(lt, ba, ba + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + hi - 0.2, 'zip', { gain: 0.3 }); cue(st + co, 'sparkle', { dur: 0.4, gain: 0.3 }); cue(st + ba, 'pop', { gain: 0.35 });
  }
  // ── 6a · and the flipping field pushes power through it ───────────
  {
    const st = cut(5), fl = Wd('flipping', 5) - st, pu = Wd('pushes', 5) - st, po = Wd('power', 5) - st;
    add({ id: 'S07', at: st, cam: [540, 820], zoom: 0.12, note: 'side cut-away: phone floats over the pad; field loops reach the phone coil from "flipping"; phone coil glows on "pushes"; bolt on "power"',
      draw(lt, d, t) {
        disc();
        const ph = Math.sin(lt * 7) > 0 ? lt * 0.8 : -lt * 0.8;
        K.fieldLoops(SX, PADY - 2, 760, 330, ph, 1, eio(seg(lt, fl - 0.2, fl + 0.3)));
        K.padSide(SX, PADY, 1.3, 0.5);
        const g = lt > pu ? 0.5 + 0.5 * Math.sin(lt * 14) : 0;
        K.phoneSide(SX, PHY, 1.25, g, lt > po ? lerp(0.25, 0.4, seg(lt, po, d)) : 0.25);
        if (lt > po - 0.1) K.bolt(SX + 360, PHY - 150, 0.8 * E(seg(lt, po - 0.1, po + 0.2)), 0.3);
        if (lt > pu) K.pill('POWER!', 540, 230, 76, C.yellow, C.ink, E(seg(lt, pu, pu + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + fl, 'sparkle', { dur: 0.6, gain: 0.25 }); cue(st + pu, 'pop', { gain: 0.4 }); cue(st + po, 'sparkle', { dur: 0.4, gain: 0.3 });
  }
  // ── 6b · no wires touching ────────────────────────────────────────
  {
    const st = Wd('no', 5) - 0.1, wi = Wd('wires', 5) - st, to = Wd('touching', 5) - st;
    add({ id: 'S08', at: st, cam: [540, 840], zoom: 0.2, note: 'push in on the gap between phone and pad; yellow GAP bracket on "wires"; NO WIRES pill on "touching"',
      draw(lt, d, t) {
        disc();
        K.fieldLoops(SX, PADY - 2, 760, 330, lt * 0.8, 0.6, 1);
        K.padSide(SX, PADY, 1.3, 0.5);
        K.phoneSide(SX, PHY, 1.25, 0.6, 0.42);
        if (lt > wi - 0.1) { const p = E(seg(lt, wi - 0.1, wi + 0.2)); ctx.save(); ctx.globalAlpha = clamp(p); line([[SX - 400, PHY + 45], [SX - 400, PADY - 55]], C.yellow, 12); line([[SX - 430, PHY + 45], [SX - 370, PHY + 45]], C.yellow, 12); line([[SX - 430, PADY - 55], [SX - 370, PADY - 55]], C.yellow, 12); ctx.restore(); }
        if (lt > to) K.pill('NO WIRES', 540, 230, 76, C.ink, C.white, E(seg(lt, to, to + 0.25)));
      } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(st + wi, 'pop', { gain: 0.3 }); cue(st + to, 'pop', { gain: 0.4 });
  }
  // ── 7 · That's induction, and it fills your battery ───────────────
  {
    const st = cut(6), ind = Wd('induction', 6) - st, fi = Wd('fills', 6) - st, ba = Wd('battery', 6) - st;
    add({ id: 'S09', at: st, cam: [540, 720], zoom: 0.14, note: 'INDUCTION slams in with a burst on "induction"; battery fills from red to full green from "fills"; % pill on "battery"',
      draw(lt, d, t) {
        disc();
        if (lt > ind) K.burst(540, 470, 2.6, 1 - seg(lt, ind, ind + 0.6));
        if (lt > ind - 0.05) bigText('INDUCTION', 540, 470, 120, C.yellow, -0.05, E(seg(lt, ind - 0.05, ind + 0.2)));
        const lv = lerp(0.12, 1, eio(seg(lt, fi - 0.1, ba + 0.4)));
        K.chargeBattery(540, 860, 1.6 * E(seg(lt, 0, 0.3)), lv, true);
        if (lt > ba) K.pill(Math.round(lv * 100) + '%', 540, 1130, 70, C.ink, C.white, E(seg(lt, ba, ba + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ind, 'slam', { gain: 0.35 }); cue(st + fi, 'sparkle', { dur: 0.9, gain: 0.3 }); cue(st + ba + 0.3, 'pop', { gain: 0.4 });
  }
  // ── 8 · The catch? The coils have to line up. ─────────────────────
  {
    const st = cut(7), ca = Wd('catch', 7) - st, co = Wd('coils', 7) - st, li = Wd('line', 7) - st;
    add({ id: 'S10', at: st, cam: [540, 760], zoom: 0.12, note: 'top-down x-ray: pad coil + phone outline/coil; warning sign on "catch"; phone coil slides onto the pad coil on "line"; LINE UP pill',
      draw(lt, d, t) {
        xbg();
        const off = lerp(260, 0, eio(seg(lt, li - 0.3, li + 0.2)));
        ctx.save(); ctx.strokeStyle = C.cyan; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(540, 760, 300, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
        K.coil(540, 760, 230, 6, 1, 0, 14);
        ctx.save(); rr(540 + off - 210, 760 - 420, 420, 840, 70); ctx.strokeStyle = C.white; ctx.lineWidth = 8; ctx.stroke(); ctx.restore();
        ctx.save(); ctx.globalAlpha = 0.85; K.coil(540 + off, 780, 150, 5, 1, lt > li + 0.2 ? 0.6 : 0, 10); ctx.restore();
        if (lt > ca - 0.05 && lt < co) K.warning(540, 760, 1.4 * E(seg(lt, ca - 0.05, ca + 0.2)));
        if (lt > co && lt < li) K.pill('COILS', 540, 220, 70, C.ink, C.white, E(seg(lt, co, co + 0.25)));
        if (lt > li) K.pill('LINE UP ✓', 540, 220, 72, C.yellow, C.ink, E(seg(lt, li, li + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ca, 'boing', { gain: 0.35 }); cue(st + li - 0.25, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + li + 0.2, 'thud', { gain: 0.35 });
  }
  // ── 9a · Slide it off centre and charging slows ───────────────────
  {
    const st = cut(8), ce = Wd('centre', 8) - st, sl = Wd('slows', 8) - st;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.12, note: 'top-down desk: phone slides off the pad up to "centre"; snail + SLOWER pill (red) on "slows"',
      draw(lt, d, t) {
        desk();
        K.chargePad(540, 820, 1.25, 1);
        const off = lerp(0, 230, eio(seg(lt, 0.1, ce + 0.15)));
        K.phone(540 + off, 720, 0.95, lockScreen(41, 1), 0.12 * seg(lt, 0.1, ce + 0.15));
        if (lt > sl) { K.snail(260, 1120, 0.8 * E(seg(lt, sl, sl + 0.3)), t); K.pill('SLOWER', 540, 200, 76, C.red, C.white, E(seg(lt, sl, sl + 0.25))); }
        else if (lt > ce) K.pill('OFF CENTRE', 540, 200, 66, C.ink, C.white, E(seg(lt, ce, ce + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.15, 'slide', { dur: 0.6, gain: 0.25 }); cue(st + ce, 'pop', { gain: 0.3 }); cue(st + sl, 'boing', { gain: 0.35 });
  }
  // ── 9b · wasting energy as heat ───────────────────────────────────
  {
    const st = Wd('wasting', 8) - 0.1, en = Wd('energy', 8) - st, he = Wd('heat', 8) - st;
    add({ id: 'S12', at: st, cam: [540, 820], zoom: 0.14, note: 'side cut-away, phone shifted right: field loops miss its coil; red heat waves rise from "energy"; thermometer + HEAT pill on "heat"',
      draw(lt, d, t) {
        disc();
        K.fieldLoops(SX, PADY - 2, 760, 330, lt * 0.8, 1, 1);
        K.padSide(SX, PADY, 1.3, 0.5);
        K.phoneSide(SX + 300, PHY, 1.25, 0.15, 0.45);
        if (lt > en) K.heatRise(SX - 120, PHY - 20, 1.2, t, E(seg(lt, en, he)));
        if (lt > he) { K.thermometer(200, 520, 0.9 * E(seg(lt, he, he + 0.25)), 0, 1); K.pill('HEAT', 540, 230, 80, C.red, C.white, E(seg(lt, he, he + 0.25))); }
      } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(st + en, 'sizzle', { dur: 0.9, gain: 0.25 }); cue(st + he, 'pop', { gain: 0.4 });
  }
  // ── 10 · so newer pads use magnets to snap it in place ────────────
  {
    const st = cut(9), ne = Wd('newer', 9) - st, ma = Wd('magnets', 9) - st, sn = Wd('snap', 9) - st, pl = Wd('place', 9) - st;
    add({ id: 'S13', at: st, cam: [540, 760], zoom: 0.14, note: 'x-ray top-down: magnet rings pop in on "magnets"; off-centre phone snaps to the middle on "snap" with burst; SNAP! pill',
      draw(lt, d, t) {
        xbg();
        ctx.save(); ctx.strokeStyle = C.cyan; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(540, 760, 300, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
        K.coil(540, 760, 200, 6, 1, 0, 13);
        K.magnetRing(540, 760, 250, eio(seg(lt, ma - 0.2, ma + 0.3)), 1.4);
        const snap = eob(seg(lt, sn - 0.05, sn + 0.2)), off = lerp(220, 0, snap), offy = lerp(-90, 0, snap);
        ctx.save(); rr(540 + off - 210, 760 + offy - 420, 420, 840, 70); ctx.strokeStyle = C.white; ctx.lineWidth = 8; ctx.stroke(); ctx.restore();
        ctx.save(); ctx.globalAlpha = 0.85; K.coil(540 + off, 760 + offy, 150, 5, 1, lt > sn ? 0.6 : 0, 10); ctx.restore();
        K.magnetRing(540 + off, 760 + offy, 250, eio(seg(lt, ma - 0.1, ma + 0.4)), 1.0);
        if (lt > sn) K.burst(540, 760, 2.4, 1 - seg(lt, sn, sn + 0.5));
        if (lt > ne - 0.1 && lt < ma) K.pill('NEWER PADS', 540, 220, 64, C.ink, C.white, E(seg(lt, ne - 0.1, ne + 0.15)));
        if (lt > ma && lt < sn) K.pill('MAGNETS', 540, 220, 72, C.red, C.white, E(seg(lt, ma, ma + 0.25)));
        if (lt > sn) K.pill('SNAP!', 540, 220, 80, C.yellow, C.ink, E(seg(lt, sn, sn + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ma, 'pop', { gain: 0.35 }); cue(st + sn, 'thud', { gain: 0.45 }); cue(st + sn + 0.05, 'slam', { gain: 0.25 }); cue(st + pl, 'sparkle', { dur: 0.4, gain: 0.25 });
  }
  // ── 11a · The twist: your toothbrush ──────────────────────────────
  {
    const st = cut(10), tw = Wd('twist', 10) - st, to = Wd('toothbrush', 10) - st;
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.14, note: 'TWIST pill on "twist"; toothbrush on its base bounces in with a burst on "toothbrush"',
      draw(lt, d, t) {
        disc();
        if (lt > tw) K.pill('TWIST', 540, 200, 80, C.yellow, C.ink, E(seg(lt, tw, tw + 0.25)));
        const bump = lt > to ? 1 + 0.12 * Math.sin(seg(lt, to, to + 0.3) * Math.PI) : 1;
        if (lt > to) K.burst(540, 760, 3, 1 - seg(lt, to, to + 0.6));
        K.toothbrush(540, 1160, 0.8 * E(seg(lt, 0.05, 0.4)) * bump, 0, 0, 0);
      } });
    cue(st, 'whoosh'); cue(st + tw, 'pop', { gain: 0.4 }); cue(st + to, 'boing', { gain: 0.45 });
  }
  // ── 11b · has charged this way for decades ────────────────────────
  {
    const st = Wd('has', 10) - 0.1, ch = Wd('charged', 10) - st, wa = Wd('way', 10) - st, de = Wd('decades', 10) - st;
    add({ id: 'S15', at: st, cam: [540, 700], zoom: 0.14, note: 'toothbrush goes x-ray on "charged": coil in the base post + coil in the handle; they glow and field loops show on "way"; calendar SINCE THE 90s + FOR DECADES pill on "decades"',
      draw(lt, d, t) {
        disc();
        const xr = eio(seg(lt, ch - 0.2, ch + 0.2)), g = lt > wa ? 0.5 + 0.5 * Math.sin(lt * 12) : 0;
        if (lt > wa) K.fieldLoops(540, 1160 - 0.8 * 150, 330, 170, lt * 0.9, E(seg(lt, wa, wa + 0.3)) * 0.9, 1, 2);
        K.toothbrush(540, 1160, 0.8, xr, 0, g);
        if (lt > ch && lt < de) K.pill('SAME TRICK', 540, 200, 66, C.ink, C.white, E(seg(lt, ch, ch + 0.25)));
        if (lt > de) { K.calendar(250, 640, 0.42 * E(seg(lt, de, de + 0.3)), '25+', 'YEARS', -0.1); K.pill('FOR DECADES', 540, 200, 66, C.yellow, C.ink, E(seg(lt, de, de + 0.25))); }
      } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(st + ch, 'sparkle', { dur: 0.5, gain: 0.3 }); cue(st + de, 'thud', { gain: 0.4 });
  }
  // ── 12a · No plug, no contact ─────────────────────────────────────
  {
    const st = cut(11), pl = Wd('plug', 11) - st, co = Wd('contact', 11) - st;
    add({ id: 'S16', at: st, cam: [540, 740], zoom: 0.12, note: 'two cards: a plug gets a red X on "plug"; two touching metal contacts get a red X on "contact"',
      draw(lt, d, t) {
        disc();
        const card = (x, p, draw) => { if (p <= 0) return; ctx.save(); ctx.translate(x, 720); ctx.scale(p, p); rr(-190, -240, 380, 480, 40); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.save(); rr(-190, -240, 380, 480, 40); ctx.clip(); draw(); ctx.restore(); ctx.restore(); };
        card(310, E(seg(lt, pl - 0.3, pl - 0.05)), () => K.wallPlug(0, -10, 0.8, 0));
        card(770, E(seg(lt, co - 0.3, co - 0.05)), () => { rr(-150, -40, 140, 70, 14); ctx.fillStyle = '#AEB7C4'; ctx.fill(); rr(10, -40, 140, 70, 14); ctx.fill(); rr(-30, -54, 60, 98, 12); ctx.fillStyle = K.COPPER; ctx.fill(); K.bolt(0, -150, 0.7, 0); });
        if (lt > pl + 0.05) K.redX(310, 720, lerp(1.6, 1, eo(seg(lt, pl + 0.05, pl + 0.25))), 1);
        if (lt > co + 0.05) K.redX(770, 720, lerp(1.6, 1, eo(seg(lt, co + 0.05, co + 0.25))), 1);
      } });
    cue(st, 'whoosh'); cue(st + pl + 0.05, 'slam', { gain: 0.3 }); cue(st + co + 0.05, 'slam', { gain: 0.3 });
  }
  // ── 12b · just two coils and a magnetic field ─────────────────────
  {
    const st = Wd('just', 11) - 0.1, tw = Wd('two', 11) - st, co = Wd('coils', 11) - st, fi = Wd('field', 11) - st;
    add({ id: 'S17', at: st, cam: [540, 700], zoom: 0.14, note: 'hero to camera holding his phone; two coils pop up either side on "coils"; field lines link them + wink + 2 COILS + 1 FIELD pill on "field"',
      draw(lt, d, t) {
        K.room();
        K.man({ x: 540, y: 1150, s: 0.95, arm: K.PHONE_ARM, holding: (x, y) => K.phone(x + 12, y - 70, 0.3, lockScreen(100, 1)), eyes: lt > fi ? 'wink' : 'n', mouth: 'grin', smirk: true, brow: 0.4 });
        const p = E(seg(lt, co - 0.2, co + 0.15));
        if (lt > fi) { ctx.save(); ctx.globalAlpha = E(seg(lt, fi, fi + 0.3)); ctx.strokeStyle = K.FIELD; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.setLineDash([30, 20]); ctx.lineDashOffset = -lt * 120; for (const dy of [-70, 0, 70]) { ctx.beginPath(); ctx.moveTo(250, 440 + dy); ctx.quadraticCurveTo(540, 440 + dy * 2.4 - 90, 830, 440 + dy); ctx.stroke(); } ctx.restore(); }
        if (p > 0) {
          const g = lt > fi ? 0.5 + 0.5 * Math.sin(lt * 12) : 0;
          for (const cx of [250, 830]) { ctx.save(); ctx.translate(cx, 440); ctx.scale(p, p); circle(0, 0, 125, C.xnavy); ctx.lineWidth = 6; ctx.strokeStyle = C.cyan; ctx.stroke(); K.coil(0, 0, 100, 5, 1, g, 10); ctx.restore(); }
        }
        if (lt > tw) K.pill(lt > fi ? '2 COILS + 1 FIELD' : '2 COILS', 540, 240, 60, C.yellow, C.ink, E(seg(lt, tw, tw + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + co, 'pop', { gain: 0.4 }); cue(st + fi, 'boing', { gain: 0.4 });
  }

  return { shots: S, cues: CUES };
}
