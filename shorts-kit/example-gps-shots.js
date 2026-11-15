// HOW DOES YOUR PHONE KNOW WHERE YOU ARE? (GPS): the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const disc = () => { fillAll(C.bg); circle(540, 740, 520, '#E4DCCB'); };
const office = () => { fillAll(C.bg); ctx.fillStyle = C.floor; ctx.fillRect(-300, 1400, W + 600, 900); };
const heldPhone = (screen) => (x, y) => K.phone(x + 12, y - 70, 0.3, screen);
const PX = 540, PY = 740, PS = 1.2;
const mapS = (t, o = {}) => () => K.mapScreen(t, o);
const dotAt = (x0, y0, x1, y1, u) => [lerp(x0, x1, u), lerp(y0, y1, u)];

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · How does your phone know exactly where you are? ────────────
  {
    const st = cut(0), ph = Wd('phone', 0) - st, ex = Wd('exactly', 0) - st, ar = Wd('are', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 740], zoom: 0.14, note: 'phone pops on "phone" showing a map with the blue dot; red pin drops onto the dot on "exactly"; WHERE AM I? pill on "are"',
      draw(lt, d, t) {
        office();
        K.phone(PX, PY, PS * E(seg(lt, 0, 0.3)), mapS(t, { dot: E(seg(lt, ph, ph + 0.3)) }));
        if (lt > ex - 0.15) K.mapPin(PX, lerp(380, PY + 40 * PS, eob(seg(lt, ex - 0.15, ex + 0.15))), 0.7, C.red);
        if (lt > ar) K.pill('WHERE AM I?', 540, 250, 76, C.yellow, C.ink, E(seg(lt, ar, ar + 0.25)));
      } });
    cue(st + 0.05, 'pop', { gain: 0.4 }); cue(st + ex + 0.1, 'thud', { gain: 0.35 }); cue(st + ar, 'pop', { gain: 0.45 });
  }
  // ── 2 · About twenty thousand kilometres up ────────────────────────
  {
    const st = cut(1), tw = Wd('twenty', 1) - st, th = Wd('thousand', 1) - st, up = Wd('up', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 500], zoom: 0.12, note: 'space; Earth curve at the bottom; altitude line grows up from Earth; 20,000 KM pill on "thousand"; satellite pops at the top on "up"',
      draw(lt, d, t) {
        K.space(t); K.earthCap(1120, t * 20);
        const g = eio(seg(lt, tw - 0.2, up));
        ctx.save(); ctx.setLineDash([24, 18]); line([[540, 1110], [540, lerp(1110, 470, g)]], C.yellow, 12); ctx.restore();
        K.satellite(540, 330, 0.8 * E(seg(lt, up - 0.1, up + 0.25)), Math.sin(t) * 0.05, t);
        if (lt > th) K.pill('20,000 KM', 790, 800, 64, C.yellow, C.ink, E(seg(lt, th, th + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + tw - 0.2, 'slide', { dur: 0.8, gain: 0.25 }); cue(st + th, 'pop', { gain: 0.4 }); cue(st + up, 'pop', { gain: 0.45 });
  }
  // ── 3 · around thirty GPS satellites circle the Earth ──────────────
  {
    const st = cut(2), th = Wd('thirty', 2) - st, sa = Wd('satellites', 2) - st, ea = Wd('earth', 2) - st;
    const ORB = [[440, 150, 0.35], [440, 150, -0.35], [470, 120, 1.2], [400, 170, -1.0]];
    add({ id: 'S03', at: st, cam: [540, 740], zoom: 0.1, note: 'Earth in the middle; dashed orbits draw in; satellites pop onto them from "thirty" and circle; ≈30 SATELLITES pill on "satellites"; Earth spins',
      draw(lt, d, t) {
        K.space(t);
        const sats = [];
        ORB.forEach(([rx, ry, rot], k) => {
          K.orbitRing(540, 740, rx, ry, clamp(seg(lt, 0, 0.4)), rot);
          for (let j = 0; j < 3; j++) {
            const n = k * 3 + j, a = (j / 3) * Math.PI * 2 + lt * 0.5 * (k % 2 ? 1 : -1) + k;
            const lx = Math.cos(a) * rx, ly = Math.sin(a) * ry;
            const x = 540 + lx * Math.cos(rot) - ly * Math.sin(rot), y = 740 + lx * Math.sin(rot) + ly * Math.cos(rot);
            sats.push({ x, y, back: Math.sin(a) < 0, p: E(seg(lt, th - 0.2 + n * 0.06, th + 0.1 + n * 0.06)) });
          }
        });
        for (const s of sats) if (s.back) K.satellite(s.x, s.y, 0.16 * s.p, 0, t);
        K.globe(540, 740, 2.6, t * 1.5);
        for (const s of sats) if (!s.back) K.satellite(s.x, s.y, 0.2 * s.p, 0, t);
        if (lt > sa) K.pill('≈ 30 SATELLITES', 540, 190, 70, C.yellow, C.ink, E(seg(lt, sa, sa + 0.25)));
        if (lt > ea) K.pill('EARTH', 540, 1170, 56, C.ink, C.white, E(seg(lt, ea, ea + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + th - 0.2, 'sparkle', { dur: 0.8, gain: 0.25 }); cue(st + sa, 'pop', { gain: 0.4 }); cue(st + ea, 'pop', { gain: 0.3 });
  }
  // ── 4a · and each one sends ─────────────────────────────────────────
  {
    const st = cut(3), on = Wd('one', 3) - st, se = Wd('sends', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 600], zoom: 0.14, note: 'one big satellite over Earth; red target on it on "one"; signal waves pour down toward Earth from "sends"',
      draw(lt, d, t) {
        K.space(t); K.earthCap(1180, t * 20);
        if (lt > se - 0.05) K.waves(540, 590, lt - se, { ang: Math.PI / 2, spread: 0.7, n: 4, maxR: 520, speed: 1.4, col: C.yellow, w: 18 });
        K.satellite(540, 440, 1.0, Math.sin(t) * 0.04, t);
        if (lt > on - 0.05 && lt < se + 0.2) K.crosshair(540, 440, E(seg(lt, on - 0.05, on + 0.2)) * (1 - seg(lt, se, se + 0.2)));
      } });
    cue(st, 'whoosh'); cue(st + on, 'pop', { gain: 0.35 }); cue(st + se, 'sparkle', { dur: 0.6, gain: 0.3 });
  }
  // ── 4b · where it is and the exact time ────────────────────────────
  {
    const st = Wd('where', 3) - 0.12, is = Wd('is', 3) - st, ex = Wd('exact', 3) - st, ti = Wd('time', 3) - st;
    add({ id: 'S05', at: st, cam: [540, 760], zoom: 0.12, note: 'satellite at top; a message card slides down from it; row "I\'M HERE" + mini map pin on "is"; ticking time row on "exact"/"time"',
      draw(lt, d, t) {
        K.space(t);
        K.satellite(540, 270, 0.6, 0, t);
        const cy = lerp(330, 820, eo(seg(lt, 0, 0.4))), sc = clamp(seg(lt, 0, 0.3));
        ctx.save(); ctx.translate(540, cy); ctx.scale(sc, sc);
        rr(-380, -240, 760, 480, 46); ctx.fillStyle = C.ink; ctx.fill(); rr(-368, -228, 736, 456, 38); ctx.fillStyle = C.white; ctx.fill();
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        if (lt > is - 0.1) { const a = E(seg(lt, is - 0.1, is + 0.15)); ctx.save(); ctx.globalAlpha = clamp(a); K.mapPin(-270, -50, 0.5 * a); ctx.font = '900 78px Inter'; ctx.fillStyle = C.ink; ctx.textAlign = 'left'; ctx.fillText("I'M HERE", -190, -110); ctx.restore(); }
        if (lt > ex - 0.1) {
          const a = clamp(seg(lt, ex - 0.1, ex + 0.15)), ms = Math.floor((lt * 1000 * 7.3) % 1000).toString().padStart(3, '0'), us = Math.floor((lt * 1e6 * 3.1) % 1000).toString().padStart(3, '0');
          ctx.save(); ctx.globalAlpha = a; rr(-330, 30, 660, 150, 30); ctx.fillStyle = lt > ti ? C.yellow : '#EEF1F4'; ctx.fill();
          ctx.font = '900 66px Inter'; ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.fillText(`12:00:07.${ms}${us}`, 0, 108); ctx.restore();
        }
        ctx.restore();
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'slide', { dur: 0.4, gain: 0.2 }); cue(st + is, 'pop', { gain: 0.35 }); cue(st + ti, 'pop', { gain: 0.4 });
  }
  // ── 5 · from an atomic clock on board ──────────────────────────────
  {
    const st = cut(4), at = Wd('atomic', 4) - st, cl = Wd('clock', 4) - st, bo = Wd('board', 4) - st;
    add({ id: 'S06', at: st, cam: [540, 700], zoom: 0.12, note: 'big clock with an atom badge, hand sweeping; ATOMIC CLOCK pill on "atomic"; satellite pops above, dashed link + ON BOARD on "board"',
      draw(lt, d, t) {
        disc();
        const k = eio(seg(lt, bo - 0.2, bo + 0.2)), s = lerp(1.35, 1.0, k), y = lerp(740, 880, k);
        if (lt > bo - 0.1) { ctx.save(); ctx.setLineDash([20, 16]); line([[540, 340], [540, y - 200 * s]], C.ink, 8); ctx.restore(); K.satellite(540, 260, 0.55 * E(seg(lt, bo - 0.1, bo + 0.2)), 0, t); }
        K.clockFace(540, y, s * E(seg(lt, 0, 0.3)), lt * 4, { atom: true });
        if (lt > at) K.pill('ATOMIC CLOCK', 540, lt > bo - 0.2 ? 1150 : 190, 66, C.yellow, C.ink, E(seg(lt, at, at + 0.25)));
        if (lt > bo) K.pill('ON BOARD', 850, 440, 52, C.ink, C.white, E(seg(lt, bo, bo + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + at, 'pop', { gain: 0.4 }); for (let i = 0; i < 4; i++) cue(st + cl + i * 0.25, 'tock', { gain: 0.18 }); cue(st + bo, 'pop', { gain: 0.4 });
  }
  // ── 6a · Your phone catches a few ──────────────────────────────────
  const SATS = [[190, 300], [540, 210], [890, 320]];
  const PH = [540, 900], PHS = 0.5, PTOP = [540, 900 - 380 * 0.5 + 20];
  {
    const st = cut(5), ca = Wd('catches', 5) - st, fe = Wd('few', 5) - st;
    add({ id: 'S07', at: st, cam: [540, 700], zoom: 0.12, note: 'three satellites up top, phone on Earth; yellow signal blips travel down into the phone from "catches"; 3 SIGNALS pill on "few"',
      draw(lt, d, t) {
        K.space(t); K.earthCap(1110, t * 20);
        SATS.forEach(([x, y], k) => {
          K.satellite(x, y, 0.32, 0, t + k);
          const u = (lt - ca + 0.3 + k * 0.17) * 1.3;
          if (u > 0) { const f = u % 1; const [bx, by] = dotAt(x, y + 50, PTOP[0], PTOP[1], f); K.signalDot(bx, by, 1); }
        });
        K.phone(PH[0], PH[1], PHS, mapS(t));
        if (lt > fe) K.pill('3 SIGNALS', 540, 590, 60, C.yellow, C.ink, E(seg(lt, fe, fe + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ca, 'slide', { dur: 0.6, gain: 0.2 }); cue(st + fe, 'pop', { gain: 0.4 });
  }
  // ── 6b · and checks how late each signal arrived ───────────────────
  {
    const st = Wd('and', 5) - 0.1, la = Wd('late', 5) - st, ar = Wd('arrived', 5) - st;
    const LANES = [[600, 0.067, 0], [810, 0.072, 0.25], [1020, 0.079, 0.5]];
    add({ id: 'S08', at: st, cam: [540, 760], zoom: 0.1, note: 'stopwatch on top; three lanes: blip races from a tiny satellite to a phone; each finishes at a different moment and shows its delay (0.067 / 0.072 / 0.079 s) from "late"',
      draw(lt, d, t) {
        disc();
        K.stopwatch(540, 340, 0.7, lt * 6);
        LANES.forEach(([y, sec, off], k) => {
          const a = E(seg(lt, 0.05 + k * 0.08, 0.3 + k * 0.08)); if (a <= 0) return;
          ctx.save(); ctx.globalAlpha = clamp(a);
          rr(90, y - 70, 900, 140, 70); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
          ctx.setLineDash([16, 14]); line([[230, y], [680, y]], '#C9CED6', 8); ctx.setLineDash([]);
          K.satellite(170, y, 0.18, 0, t); K.phone(720, y, 0.15, null);
          const u = eio(seg(lt, la - 0.6, la + off)); K.signalDot(lerp(230, 700, u), y, 0.9);
          if (u >= 1) K.pill(sec.toFixed(3) + ' s', 870, y, 40, C.yellow, C.ink, E(seg(lt, la + off, la + off + 0.2)));
          ctx.restore();
        });
        if (lt > ar) K.pill('HOW LATE?', 540, 1180, 56, C.ink, C.white, E(seg(lt, ar, ar + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + la, 'pop', { gain: 0.3 }); cue(st + la + 0.25, 'pop', { gain: 0.3 }); cue(st + la + 0.5, 'pop', { gain: 0.3 });
  }
  // ── 7a · and since they fly at light speed ─────────────────────────
  {
    const st = cut(6), fl = Wd('fly', 6) - st, sp = Wd('speed', 6) - st;
    add({ id: 'S09', at: st, cam: [540, 700], zoom: 0.16, note: 'satellite top-left, phone bottom-right; blips zip along the diagonal with speed lines from "fly"; 300,000 KM / SEC pill on "speed"',
      draw(lt, d, t) {
        K.space(t);
        K.satellite(220, 330, 0.5, 0.5, t); K.phone(840, 960, 0.4, mapS(t));
        if (lt > fl - 0.15) for (let k = 0; k < 3; k++) { const f = ((lt - fl + 0.15) * 2.4 + k / 3) % 1; const [x, y] = dotAt(270, 400, 800, 840, f); K.speedLines(x, y, 0.8); K.signalDot(x, y, 1.1); }
        if (lt > sp) K.pill('300,000 KM / SEC', 540, 190, 66, C.yellow, C.ink, E(seg(lt, sp, sp + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + fl - 0.1, 'zip', { gain: 0.35 }); cue(st + sp, 'pop', { gain: 0.4 });
  }
  // ── 7b · that delay gives the distance ─────────────────────────────
  {
    const st = Wd('that', 6) - 0.1, de = Wd('delay', 6) - st, di = Wd('distance', 6) - st;
    add({ id: 'S10', at: st, cam: [540, 650], zoom: 0.1, note: 'formula stack: DELAY 0.07 s on "delay" × LIGHT SPEED = ≈ 21,000 KM AWAY on "distance"',
      draw(lt, d, t) {
        disc();
        K.pill('DELAY  0.07 s', 540, 320, 70, C.ink, C.white, E(seg(lt, 0.02, 0.27)));
        if (lt > de + 0.25) bigText('×', 540, 470, 110, C.ink, 0, E(seg(lt, de + 0.25, de + 0.45)));
        K.pill('LIGHT SPEED', 540, 620, 70, C.ink, C.white, E(seg(lt, de + 0.35, de + 0.6)));
        if (lt > di - 0.15) bigText('=', 540, 770, 110, C.ink, 0, E(seg(lt, di - 0.15, di + 0.05)));
        K.pill('≈ 21,000 KM AWAY', 540, 940, 72, C.yellow, C.ink, E(seg(lt, di, di + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + de, 'pop', { gain: 0.35 }); cue(st + de + 0.4, 'pop', { gain: 0.3 }); cue(st + di, 'thud', { gain: 0.4 });
  }
  // ── 8a · With four of them, there's just one spot ──────────────────
  const P = [560, 760];
  const S4 = [[150, 300], [930, 280], [120, 1180], [960, 1160]];
  const rangeView = (lt, t, grow, meet) => {
    fillAll('#EEF1E6'); K.streetMap(540, 960, 1700, 2600, 0, 0);
    S4.forEach(([x, y], k) => K.rangeCircle(x, y, Math.hypot(x - P[0], y - P[1]), grow(k), k % 2 ? K.GPS_FOIL : C.red, 0.95));
    S4.forEach(([x, y], k) => K.satellite(x, y, 0.22, 0, t + k));
    if (meet > 0) K.crosshair(P[0], P[1], meet);
  };
  {
    const st = cut(7), fo = Wd('four', 7) - st, on = Wd('one', 7) - st, sp = Wd('spot', 7) - st;
    add({ id: 'S11', at: st, cam: [P[0], P[1]], zoom: 0.12, note: 'top-down map, four satellites at the corners; distance circles grow one by one from "four"; they cross at one point; red target on "spot"',
      draw(lt, d, t) {
        rangeView(lt, t, (k) => eio(seg(lt, fo - 0.2 + k * 0.22, fo + 0.3 + k * 0.22)), E(seg(lt, sp, sp + 0.25)));
        if (lt > on) K.pill('ONE SPOT', 540, 190, 72, C.yellow, C.ink, E(seg(lt, on, on + 0.25)));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 4; k++) cue(st + fo - 0.2 + k * 0.22, 'slide', { dur: 0.4, gain: 0.15 }); cue(st + sp, 'pop', { gain: 0.45 });
  }
  // ── 8b · where the distances meet ──────────────────────────────────
  {
    const st = Wd('where', 7) - 0.1, di = Wd('distances', 7) - st, me = Wd('meet', 7) - st;
    add({ id: 'S12', at: st, cam: [P[0], P[1]], zoom: 0.35, note: 'push in on the crossing; blue dot pops in the target on "meet"',
      draw(lt, d, t) {
        rangeView(lt, t, () => 1, 1);
        if (lt > me) K.blueDot(P[0], P[1], 1.3 * E(seg(lt, me, me + 0.25)), t);
        if (lt > di) K.pill('ALL MEET HERE', 540, 420, 66, C.ink, C.white, E(seg(lt, di, di + 0.25)));
      } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(st + me, 'pop', { gain: 0.5 });
  }
  // ── 9 · and that's you ─────────────────────────────────────────────
  {
    const st = cut(8), yo = Wd('you', 8) - st;
    add({ id: 'S13', at: st, cam: [540, 650], zoom: 0.1, note: 'hero holding the phone (map + blue dot); a blue pin drops above his head on "you"; YOU! pill',
      draw(lt, d, t) {
        office();
        K.man({ x: 540, y: 1150, s: 0.95, arm: K.PHONE_ARM, holding: heldPhone(mapS(t)), eyes: lt > yo ? 'wide' : 'n', mouth: lt > yo ? 'grin' : 'smile', brow: 0.6 });
        if (lt > yo - 0.15) K.mapPin(540, lerp(150, 600, eob(seg(lt, yo - 0.15, yo + 0.15))), 0.8, K.GPS_DOT);
        if (lt > yo) K.pill('YOU!', 540, 190, 80, C.yellow, C.ink, E(seg(lt, yo, yo + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + yo, 'boing', { gain: 0.4 });
  }
  // ── 10a · Here's the twist: up there ───────────────────────────────
  {
    const st = cut(9), tw = Wd('twist', 9) - st, th = Wd('there', 9) - st;
    add({ id: 'S14', at: st, cam: [540, 600], zoom: 0.16, note: 'red TWIST pill; satellite in space; its clock (red rim) pops below on "there"',
      draw(lt, d, t) {
        K.space(t); K.earthCap(1230, t * 20);
        K.satellite(540, 500, 0.9, Math.sin(t) * 0.05, t);
        if (lt > th - 0.1) K.clockFace(540, 900, 0.6 * E(seg(lt, th - 0.1, th + 0.2)), lt * 5, { atom: true, col: C.red });
        if (lt > tw) K.pill('TWIST', 540, 190, 80, C.red, C.white, E(seg(lt, tw, tw + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + tw, 'slam', { gain: 0.3 }); cue(st + th, 'pop', { gain: 0.35 });
  }
  // ── 10b · clocks run a tiny bit fast, thanks to Einstein ───────────
  {
    const st = Wd('clocks', 9) - 0.1, ru = Wd('run', 9) - st, fa = Wd('fast', 9) - st, ei = Wd('einstein', 9) - st;
    add({ id: 'S15', at: st, cam: [540, 700], zoom: 0.1, note: 'two clocks: GROUND vs SATELLITE; the satellite hand creeps ahead from "run"; +0.000038 s / DAY on "fast"; RELATIVITY pill on "Einstein"',
      draw(lt, d, t) {
        disc();
        const a = lt * 3, lead = 0.5 * eio(seg(lt, ru, fa + 0.3));
        K.clockFace(290, 640, 0.95 * E(seg(lt, 0, 0.25)), a, { label: 'GROUND' });
        K.clockFace(790, 640, 0.95 * E(seg(lt, 0.08, 0.33)), a + lead, { atom: true, col: lead > 0.05 ? C.red : C.ink, label: 'SATELLITE' });
        if (lt > fa) K.pill('+0.000038 s / DAY', 540, 1080, 62, C.yellow, C.ink, E(seg(lt, fa, fa + 0.25)));
        if (lt > ei) K.pill('RELATIVITY', 540, 190, 76, C.ink, C.white, E(seg(lt, ei, ei + 0.25)));
      } });
    cue(st, 'whoosh'); for (let i = 0; i < 6; i++) cue(st + ru + i * 0.2, 'tock', { gain: 0.16 }); cue(st + fa, 'pop', { gain: 0.4 }); cue(st + ei, 'sparkle', { dur: 0.5, gain: 0.3 });
  }
  // ── 11a · and without a fix, your blue dot would drift ─────────────
  {
    const st = cut(10), fi = Wd('fix', 10) - st, dot = Wd('dot', 10) - st, dr = Wd('drift', 10) - st;
    add({ id: 'S16', at: st, cam: [540, 740], zoom: 0.12, note: 'phone map: red pin = where you really are; blue dot drifts away with a dashed red trail from "drift"; NO FIX pill on "fix"',
      draw(lt, d, t) {
        office();
        const u = eio(seg(lt, dr - 0.1, d + 0.3));
        K.phone(PX, PY, PS, () => { K.mapScreen(t, { dx: 110 * u, dy: -190 * u, trail: u }); K.mapPin(0, 40, 0.3); });
        if (lt > dot) K.crosshair(PX + 110 * u * PS, PY + (40 - 190 * u) * PS, E(seg(lt, dot, dot + 0.2)) * (1 - seg(lt, dr, dr + 0.2)));
        if (lt > fi) K.pill('NO FIX', 540, 190, 76, C.red, C.white, E(seg(lt, fi, fi + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + fi, 'slam', { gain: 0.25 }); cue(st + dr, 'slide', { dur: 1.0, gain: 0.25 });
  }
  // ── 11b · ten kilometres a day ─────────────────────────────────────
  {
    const st = Wd('ten', 10) - 0.12, te = Wd('ten', 10) - st, da = Wd('day', 10) - st;
    add({ id: 'S17', at: st, cam: [540, 760], zoom: 0.14, note: 'zoomed-out map: red pin bottom-left, blue dot slides far to the top-right with a dashed red line; 10 KM tag on "ten"; EVERY DAY! pill on "day"',
      draw(lt, d, t) {
        fillAll('#EEF1E6'); K.streetMap(540, 960, 1700, 2600, lt * -20, 0);
        const u = eio(seg(lt, 0, da + 0.2)), [bx, by] = dotAt(260, 1000, 830, 420, u);
        ctx.save(); ctx.setLineDash([24, 18]); line([[260, 1000], [bx, by]], C.red, 12); ctx.restore();
        K.mapPin(260, 1060, 0.6); K.blueDot(bx, by, 1.1, t);
        if (lt > te) K.pill('10 KM', 660, 820, 64, C.ink, C.white, E(seg(lt, te, te + 0.25)));
        if (lt > da) K.pill('EVERY DAY!', 540, 190, 76, C.red, C.white, E(seg(lt, da, da + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + te, 'pop', { gain: 0.35 }); cue(st + da, 'alarm', { dur: 0.6, gain: 0.25 });
  }
  // ── 12a · And your phone never talks back ──────────────────────────
  {
    const st = cut(11), ph = Wd('phone', 11) - st, ba = Wd('back', 11) - st;
    add({ id: 'S18', at: st, cam: [540, 700], zoom: 0.12, note: 'phone on Earth, satellites above; a red arrow tries to go up from the phone and gets a red X on "back"',
      draw(lt, d, t) {
        K.space(t); K.earthCap(1110, t * 20);
        SATS.forEach(([x, y], k) => K.satellite(x, y, 0.3, 0, t + k));
        K.phone(PH[0], PH[1], PHS, mapS(t));
        if (lt > ph) K.arrow(540, lerp(640, 540, eo(seg(lt, ph, ph + 0.4))), 260, -Math.PI / 2, clamp(seg(lt, ph, ph + 0.2)));
        if (lt > ba) K.redX(540, 540, lerp(0.9, 0.5, eo(seg(lt, ba, ba + 0.2))), 1);
      } });
    cue(st, 'whoosh'); cue(st + ph, 'slide', { dur: 0.3, gain: 0.2 }); cue(st + ba, 'slam', { gain: 0.35 });
  }
  // ── 12b · It just listens ──────────────────────────────────────────
  {
    const st = Wd('it', 11) - 0.1, li = Wd('listens', 11) - st;
    add({ id: 'S19', at: st, cam: [540, 650], zoom: 0.12, note: 'hero with the phone; signal blips rain down into it; wink + JUST LISTENS pill on "listens"',
      draw(lt, d, t) {
        office();
        K.man({ x: 540, y: 1150, s: 0.95, arm: K.PHONE_ARM, holding: heldPhone(mapS(t)), eyes: lt > li ? 'wink' : 'n', mouth: 'grin', smirk: true, brow: 0.5 });
        for (let k = 0; k < 5; k++) { const f = (lt * 1.2 + k / 5) % 1; K.signalDot(lerp(820 + k * 55, 650, f), lerp(120, 960, f), 1.2 * (1 - f * 0.4)); }
        if (lt > li) K.pill('JUST LISTENS', 540, 190, 72, C.yellow, C.ink, E(seg(lt, li, li + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + li, 'boing', { gain: 0.4 });
  }

  return { shots: S, cues: CUES };
}
