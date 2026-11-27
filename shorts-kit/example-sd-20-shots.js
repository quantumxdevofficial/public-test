// (20/30) WHAT IS RATE LIMITING: the shot list. Analogy: a theme park ride that only fits twenty people a minute.
// Ever tapped refresh again and again and the app said "too many requests"? That's rate limiting. A ride fits twenty
// people a minute, so someone at the gate counts heads. Servers do the same: each user gets, say, a hundred requests a
// minute. Go over and you get error 429, too many requests, try again later. It stops a buggy app or a flood of bots
// from crashing the server for everyone else. Twist: it's not a ban, wait a moment and you're let back in.
// Loop: so next time, just stop tapping refresh. Tease: idempotency.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const GREEN = '#5BAE6A', BLUE = '#3A7BD5', ORANGE = '#F29A3A', PURPLE = '#8A63D2';
const MCOL = [C.yellow, GREEN, ORANGE, C.pink, BLUE, PURPLE];
const bg = (ring = '#CFE8F3', base = C.sky) => { fillAll(base); circle(540, 740, 560, ring); };
const warm = () => bg('#F7E3C8', C.bg);
const park = () => { fillAll(C.sky); circle(860, 260, 80, C.yellow); ctx.fillStyle = '#A9D69B'; ctx.fillRect(-300, 1180, W + 600, 900); };
// phone screen point p (screen-local) on a phone drawn at (px, py, s)
const scr = (px, py, s, p) => [px + p[0] * s, py + p[1] * s];

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const at = (w, i) => Wd(w, i);

  // ── 1 · Ever tapped refresh again and again, ──
  {
    const st = cut(0), ta = at('tapped', 0) - st, ag = at('again', 0) - st, end = cut(1) - st;
    add({ id: 'S01', at: st, cam: [540, 780], zoom: 0.1, note: 'DAY 20 / 30; phone with a feed + big refresh button; finger taps it faster and faster from "tapped"; tap counter badge climbs',
      draw(lt, d, t) {
        bg();
        K.pill('DAY 20 / 30', 540, 200, 64, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        const s = 0.95, px = 540, py = 800;
        const rate = lt > ag ? 8 : 5, ph = lt > ta ? ((lt - ta) * rate) % 1 : 1, press = ph < 0.35 ? 1 : 0;
        const n = lt > ta ? 1 + Math.floor((lt - ta) * (lt > ag ? 7 : 4)) : 0;
        K.phone(px, py, s, () => K.feedRefreshScreen(lt > ta ? (lt - ta) * 9 : 0, press, lt > ta ? ph : 0));
        const [bx, by] = scr(px, py, s, K.REFRESH_BTN);
        K.tapFinger(bx, by, E(seg(lt, ta - 0.3, ta)), press);
        if (lt > ta) K.ripple(bx, by, ph * 1.4);
        if (n > 0) K.countBadge(px + 200, py - 330, 58, n, C.red, E(seg(lt, ta, ta + 0.2)));
      } });
    cue(st + 0.05, 'pop', { gain: 0.35 });
    for (let tt = ta; tt < end - 0.05; tt += (tt > ag ? 0.125 : 0.2)) cue(st + tt, 'tock', { gain: 0.2 });
  }

  // ── 2 · and the app said, too many requests? ──
  {
    const st = cut(1), to = at('too', 1) - st, rq = at('requests', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 760], zoom: 0.12, note: 'same phone; on "too" the screen flips to the red 429 page; TOO MANY REQUESTS pill on "requests"',
      draw(lt, d, t) {
        bg();
        const s = 0.95, px = 540, py = 800 + (lt > to && lt < to + 0.3 ? Math.sin(lt * 60) * 6 : 0);
        K.phone(px, py, s, () => (lt > to ? K.tooManyScreen(E(seg(lt, to, to + 0.3))) : K.feedRefreshScreen(lt * 9, 0, (lt * 3) % 1)));
        if (lt > rq) K.pill('TOO MANY REQUESTS', 540, 260, 58, C.red, C.white, E(seg(lt, rq, rq + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + to, 'slam', { gain: 0.3 }); cue(st + rq, 'pop', { gain: 0.3 });
  }

  // ── 3 · That's rate limiting. ──
  {
    const st = cut(2), ra = at('rate', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 700], zoom: 0.12, note: 'a speed-limit style sign "100 PER MIN" springs up; burst + RATE LIMITING pill on "rate"',
      draw(lt, d, t) {
        warm();
        K.limitSign(540, lerp(1600, 620, eob(seg(lt, 0.0, 0.4))), 1.0, '100', 'PER MIN');
        if (lt > ra && lt < ra + 0.6) K.burst(540, 620, 4, clamp(1 - (lt - ra) * 1.8));
        if (lt > ra) K.pill('RATE LIMITING', 540, 1180, 80, C.yellow, C.ink, lerp(1.5, 1, eo(seg(lt, ra, ra + 0.2))));
      } });
    cue(st, 'whoosh'); cue(st + 0.3, 'thud', { gain: 0.35 }); cue(st + ra, 'slam', { gain: 0.3 });
  }

  // ── 4 · Think of a theme park ride. ──
  {
    const st = cut(3), ri = at('ride', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 700], zoom: 0.12, note: 'theme park: a ferris wheel rises and turns; THEME PARK RIDE pill on "ride"',
      draw(lt, d, t) {
        park();
        K.ferrisWheel(540, lerp(1600, 620, eob(seg(lt, 0.0, 0.45))), 1.0, t);
        if (lt > ri) K.pill('THEME PARK RIDE', 540, 1200, 64, C.yellow, C.ink, E(seg(lt, ri, ri + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.35, 'thud', { gain: 0.3 }); cue(st + ri, 'sparkle', { dur: 0.5, gain: 0.22 });
  }

  // ── 5 · It only fits twenty people a minute, ──
  {
    const st = cut(4), fi = at('fits', 4) - st, tw = at('twenty', 4) - st, mi = at('minute', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 720], zoom: 0.08, note: 'small ferris wheel upper left; queue of people along the bottom; "20 PER MIN" sign pops on "twenty"; stopwatch on "minute"',
      draw(lt, d, t) {
        park();
        K.ferrisWheel(330, 560, 0.62, t);
        for (let k = 0; k < 7; k++) K.personIcon(180 + k * 120, 1130 + (k % 2) * 14, 1.25, MCOL[k % 6], 0);
        if (lt > tw) K.limitSign(820, 470, 0.55, '20', 'PER MIN', E(seg(lt, tw, tw + 0.3)), false);
        if (lt > mi) K.stopwatch(820, 860, 0.36 * E(seg(lt, mi, mi + 0.25)), (lt - mi) * 6);
        if (lt > fi && lt < tw) K.pill('ONLY FITS…', 540, 230, 58, C.ink, C.white, E(seg(lt, fi, fi + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + fi, 'pop', { gain: 0.2 }); cue(st + tw, 'pop', { gain: 0.35 }); cue(st + mi, 'tock', { gain: 0.3 }); cue(st + mi + 0.3, 'tock', { gain: 0.25 });
  }

  // ── 6 · so someone at the gate counts heads. ──
  {
    const st = cut(5), so = at('someone', 5) - st, ga = at('gate', 5) - st, he = at('heads', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.08, note: 'ride gate centre; staff member (yellow) left with a counter 17→20; people walk through one by one; on "heads" counter hits 20 (red) and the arm closes; FULL pill',
      draw(lt, d, t) {
        park();
        K.rideGate(560, 860, 0.85, 1 - seg(lt, he, he + 0.25), 'RIDE', E(seg(lt, 0, 0.3)));
        const passed = lt > ga ? Math.min(3, Math.floor((lt - ga) / Math.max(0.2, (he - ga) / 3) + 0.001)) : 0;
        for (let k = 0; k < 4; k++) {
          const blocked = k >= 3, g = blocked ? 0 : clamp((lt - ga) / Math.max(0.2, (he - ga) / 3) - k);
          const x = blocked ? lerp(1000, 820, eo(seg(lt, ga, he))) : lerp(860 + k * 110, 560, eo(clamp(g * 1.6))), y = blocked ? 1130 : lerp(1130, 980, eo(g));
          const sc = blocked ? 1.2 : 1.2 * (1 - eo(clamp(g * 2 - 1)));
          if (lt > ga - 0.3 || k < 3) K.personIcon(x, y, sc, MCOL[k + 1], 0);
        }
        if (lt > so) K.personIcon(180, 1130, 1.5 * E(seg(lt, so, so + 0.25)), C.yellow, 0, false);
        const n = 17 + passed;
        if (lt > so) K.counterBox(200, 330, 0.7 * E(seg(lt, so, so + 0.25)), `${n}/20`, 'THIS MINUTE', n >= 20 ? C.red : C.yellow);
        if (lt > he) K.pill('FULL!', 780, 420, 70, C.red, C.white, E(seg(lt, he, he + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + so, 'pop', { gain: 0.3 }); for (let k = 0; k < 3; k++) cue(st + ga + k * (he - ga) / 3, 'tock', { gain: 0.22 }); cue(st + he, 'thud', { gain: 0.35 });
  }

  // ── 7 · Servers do the same thing. ──
  {
    const st = cut(6), se = at('servers', 6) - st, sa = at('same', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 760], zoom: 0.1, note: 'server rack pops in on the right, a ride gate labelled LIMIT stands in front of it on the left; SAME IDEA pill on "same"',
      draw(lt, d, t) {
        warm();
        K.server(800, 800, E(seg(lt, se - 0.1, se + 0.2)), t);
        K.rideGate(330, 880, 0.62, 0, 'LIMIT', E(seg(lt, 0.15, 0.45)));
        if (lt > sa) K.pill('SAME IDEA', 540, 260, 70, C.yellow, C.ink, E(seg(lt, sa, sa + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + se, 'thud', { gain: 0.3 }); cue(st + sa, 'pop', { gain: 0.3 });
  }

  // ── 8 · Each user gets, say, a hundred requests a minute. ──
  {
    const st = cut(7), us = at('user', 7) - st, hu = at('hundred', 7) - st, rq = at('requests', 7) - st, mi = at('minute', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 760], zoom: 0.08, note: 'phone left (1 USER pill on "user"), server right; "100 PER MIN" sign on "hundred"; request cards fly phone→server from "requests" while a counter climbs; stopwatch on "minute"',
      draw(lt, d, t) {
        bg();
        K.phone(200, 820, 0.5, () => K.homeScreen());
        K.server(880, 820, 0.6, t);
        if (lt > us) K.pill('1 USER', 200, 1100, 48, BLUE, C.white, E(seg(lt, us, us + 0.25)));
        if (lt > hu) K.limitSign(540, 430, 0.5, '100', 'PER MIN', E(seg(lt, hu, hu + 0.3)), false);
        if (lt > rq) for (let k = 0; k < 4; k++) { const g = ((lt - rq) * 1.4 + k * 0.25) % 1, [x, y] = K.arcAt(300, 780, 760, 780, 120, eio(g)); K.msgCard(x, y, 0.75, MCOL[k], null, 0, clamp((lt - rq - k * 0.12) * 5)); }
        const n = lt > rq ? Math.min(99, Math.floor((lt - rq) * 45)) : 0;
        if (lt > rq) K.counterBox(540, 1050, 0.6 * E(seg(lt, rq, rq + 0.2)), `${n}/100`, 'REQUESTS', C.yellow);
        if (lt > mi) K.stopwatch(900, 400, 0.26 * E(seg(lt, mi, mi + 0.25)), (lt - mi) * 6);
      } });
    cue(st, 'whoosh'); cue(st + us, 'pop', { gain: 0.25 }); cue(st + hu, 'pop', { gain: 0.35 }); cue(st + rq, 'slide', { dur: 1.0, gain: 0.18 }); cue(st + mi, 'tock', { gain: 0.3 });
  }

  // ── 9 · Go over, and you get error four twenty-nine, ──
  {
    const st = cut(8), ov = at('over', 8) - st, ge = at('get', 8) - st, er = at('error', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 760], zoom: 0.1, note: 'counter shows 100/100 red; on "over" card #101 flies at the gate, the arm blocks it and it bounces back on "get"; red 429 card slams on "error"',
      draw(lt, d, t) {
        warm();
        K.server(890, 860, 0.5, t);
        K.rideGate(580, 900, 0.55, 0, 'LIMIT');
        if (lt < er) K.counterBox(300, 470, 0.6, '100', 'LIMIT HIT', C.red);
        if (lt > ov && lt < er + 0.3) {
          const g = clamp((lt - ov) / Math.max(0.3, ge - ov)), back = clamp((lt - ge) * 2.5);
          const x = lt < ge ? lerp(80, 420, eio(g)) : lerp(420, 160, eo(back)), y = 920 - Math.sin(back * Math.PI) * 120;
          K.msgCard(x, y, 0.7, C.red, '#101', back * -0.6);
        }
        if (lt > er) K.statusCard(540, 640, 0.95 * lerp(1.5, 1, eo(seg(lt, er, er + 0.2))), '429', 'TOO MANY REQUESTS', C.red, -0.04);
      } });
    cue(st, 'whoosh'); cue(st + ov, 'slide', { dur: 0.4, gain: 0.2 }); cue(st + ge, 'boing', { gain: 0.3 }); cue(st + er, 'slam', { gain: 0.4 });
  }

  // ── 10 · too many requests, try again later. ──
  {
    const st = cut(9), tr = at('try', 9) - st, ag = at('again', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 760], zoom: 0.1, note: 'phone shows the 429 page; on "try" a stopwatch appears beside it and ticks; TRY AGAIN LATER pill on "again"',
      draw(lt, d, t) {
        bg();
        K.phone(400, 790, 0.85, () => K.tooManyScreen(1));
        if (lt > tr) K.stopwatch(850, 700, 0.36 * E(seg(lt, tr, tr + 0.25)), (lt - tr) * 5);
        if (lt > ag) K.pill('TRY AGAIN LATER', 540, 250, 62, C.ink, C.white, E(seg(lt, ag, ag + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + tr, 'pop', { gain: 0.3 }); cue(st + ag, 'tock', { gain: 0.3 }); cue(st + ag + 0.4, 'tock', { gain: 0.25 });
  }

  // ── 11 · It stops one buggy app or a flood of bots ──
  {
    const st = cut(10), sp = at('stops', 10) - st, bu = at('buggy', 10) - st, fl = at('flood', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.1, note: 'gate centre-right, server far right; on "buggy" a shaking phone spams red cards that bounce off the arm; on "flood" bots pour in from the left; BLOCKED pill on "stops"',
      draw(lt, d, t) {
        warm();
        K.server(930, 860, 0.45, t);
        K.rideGate(640, 900, 0.5, 0, 'LIMIT');
        if (lt > bu) {
          const jx = Math.sin(lt * 50) * 6, sc = E(seg(lt, bu, bu + 0.2));
          K.phone(250 + jx, 660, 0.32 * sc, () => K.feedRefreshScreen(lt * 20, 1, 0));
          K.pill('BUGGY APP', 250, 440, 44, C.ink, C.white, sc);
          for (let k = 0; k < 3; k++) { const g = ((lt - bu) * 2.2 + k / 3) % 1; K.msgCard(lerp(330, 540, g), 720 + k * 40 - Math.sin(g * Math.PI) * 60, 0.45, C.red, null, g * 0.5); }
        }
        if (lt > fl) for (let k = 0; k < 5; k++) { const g = clamp((lt - fl) * 2.5 - k * 0.25); K.botIcon(lerp(-150, 200 + (k % 3) * 130, eo(g)), 1000 + Math.floor(k / 3) * 150, 0.7, [C.red, PURPLE, ORANGE][k % 3], t + k); }
        if (lt > sp) K.pill('BLOCKED', 640, 300, 66, C.red, C.white, E(seg(lt, sp, sp + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sp, 'pop', { gain: 0.3 }); cue(st + bu, 'boing', { gain: 0.25 }); cue(st + fl, 'slide', { dur: 0.8, gain: 0.2 });
  }

  // ── 12 · from crashing the server for everyone else. ──
  {
    const st = cut(11), cr = at('crashing', 11) - st, sv = at('server', 11) - st, ev = at('everyone', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 760], zoom: 0.1, note: 'server centre with a load meter that drops from red to green; warning flashes on "crashing" then goes; SERVER SAFE on "server"; a row of users get ticks on "everyone"',
      draw(lt, d, t) {
        bg();
        K.server(500, 700, 0.8, t);
        K.loadMeter(860, 700, 90, 360, lerp(0.9, 0.4, eo(seg(lt, cr + 0.2, sv + 0.3))));
        if (lt > cr && lt < sv) K.warning(170, 560, 0.4 * E(seg(lt, cr, cr + 0.2)));
        if (lt > sv) K.pill('SERVER SAFE', 540, 260, 66, GREEN, C.white, E(seg(lt, sv, sv + 0.25)));
        if (lt > ev) for (let k = 0; k < 5; k++) K.personIcon(160 + k * 190, 1160, 1.1 * E(seg(lt, ev - 0.1 + k * 0.06, ev + 0.15 + k * 0.06)), MCOL[k + 1], seg(lt, ev + 0.2 + k * 0.06, ev + 0.35 + k * 0.06), true);
      } });
    cue(st, 'whoosh'); cue(st + cr, 'alarm', { dur: 0.5, gain: 0.12 }); cue(st + sv, 'pop', { gain: 0.3 }); cue(st + ev, 'sparkle', { dur: 0.6, gain: 0.25 });
  }

  // ── 13 · But it's not a ban. ──
  {
    const st = cut(12), ba = at('ban', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 760], zoom: 0.14, note: 'a BANNED stamp slams down, then on "ban" a big red X crosses it out',
      draw(lt, d, t) {
        warm();
        K.banStamp(540, 760, 1.25, 'BANNED', C.red, -0.15, lerp(1.8, 1, eo(seg(lt, 0.05, 0.25))), seg(lt, 0.05, 0.15));
        if (lt > ba) K.redX(540, 760, lerp(1.6, 0.95, eo(seg(lt, ba, ba + 0.2))), 1);
      } });
    cue(st, 'whoosh'); cue(st + 0.15, 'thud', { gain: 0.35 }); cue(st + ba, 'slam', { gain: 0.35 });
  }

  // ── 14 · Wait a moment, and you're let back in. ──
  {
    const st = cut(13), mo = at('moment', 13) - st, le = at('let', 13) - st, inn = at('in', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.08, note: 'stopwatch ticks; on "moment" counter resets 100/100 → 0/100 (green); on "let" the gate arm lifts green and the waiting card goes through to the server; YOU\'RE BACK IN on "in"',
      draw(lt, d, t) {
        bg();
        K.server(890, 860, 0.5, t);
        const open = seg(lt, le, le + 0.3);
        K.rideGate(580, 900, 0.55, open, 'LIMIT', 1, open > 0.5 ? GREEN : C.red);
        const reset = lt > mo + 0.3;
        K.counterBox(300, 470, 0.6, reset ? '0/100' : '100', reset ? 'FRESH' : 'LIMIT HIT', reset ? GREEN : C.red);
        K.stopwatch(820, 470, 0.28, lt * 4);
        const g = seg(lt, le, inn + 0.4);
        if (g < 1) K.msgCard(lerp(160, 820, eio(g)), 920 - Math.sin(g * Math.PI) * 80, 0.7, BLUE);
        if (lt > inn) K.pill('YOU\'RE BACK IN', 540, 1170, 60, GREEN, C.white, E(seg(lt, inn, inn + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + mo, 'tock', { gain: 0.3 }); cue(st + mo + 0.3, 'pop', { gain: 0.3 }); cue(st + le, 'slide', { dur: 0.5, gain: 0.2 }); cue(st + inn, 'sparkle', { dur: 0.5, gain: 0.25 });
  }

  // ── 15 · So next time, just stop tapping refresh. ──
  {
    const st = cut(14), sp = at('stop', 14) - st, ta = at('tapping', 14) - st;
    add({ id: 'S15', at: st, cam: [540, 780], zoom: 0.1, note: 'loop: the phone + refresh button from shot 1; finger taps fast, on "stop" it pulls back + STOP TAPPING pill; JUST WAIT on "tapping"',
      draw(lt, d, t) {
        bg();
        const s = 0.95, px = 540, py = 800;
        const tapping = lt < sp, ph = tapping ? (lt * 8) % 1 : 1, press = tapping && ph < 0.35 ? 1 : 0;
        K.phone(px, py, s, () => K.feedRefreshScreen(tapping ? lt * 9 : 0, press, 0));
        const [bx, by] = scr(px, py, s, K.REFRESH_BTN);
        K.tapFinger(bx, by, tapping ? 1 : 1 - eo(seg(lt, sp, sp + 0.3)), press);
        if (lt > sp) K.pill('STOP TAPPING', 540, 240, 64, C.red, C.white, E(seg(lt, sp, sp + 0.25)));
        if (lt > ta) K.pill('JUST WAIT', 540, 1210, 56, C.yellow, C.ink, E(seg(lt, ta, ta + 0.25)));
      } });
    cue(st, 'whoosh'); for (let tt = 0.05; tt < sp; tt += 0.125) cue(st + tt, 'tock', { gain: 0.18 }); cue(st + sp, 'pop', { gain: 0.3 }); cue(st + ta, 'pop', { gain: 0.25 });
  }

  // ── 16 · Tomorrow: idempotency. ──
  {
    const st = cut(15), to = at('tomorrow', 15) - st, id = at('eye', 15) - st;
    add({ id: 'S16', at: st, cam: [540, 700], zoom: 0.03, note: 'DAY 20 / 30; NEXT: IDEMPOTENCY pill; phone with a BUY button tapped twice; TAP TWICE, PAY ONCE? pill',
      draw(lt, d, t) {
        bg();
        K.pill('DAY 20 / 30', 540, 170, 64, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        if (lt > to) K.pill('NEXT: IDEMPOTENCY', 540, 310, 58, C.ink, C.white, E(seg(lt, to, to + 0.25)));
        const s = 0.75, px = 540, py = 780, ph = lt > id ? ((lt - id) * 4) % 1 : 1, press = lt > id && ph < 0.35 && lt - id < 0.5 ? 1 : 0;
        K.phone(px, py, s, () => K.buyScreen(press));
        const [bx, by] = scr(px, py, s, K.BUY_BTN);
        K.tapFinger(bx, by, E(seg(lt, 0.1, 0.4)), press);
        if (lt > id + 0.5) K.pill('TAP TWICE, PAY ONCE?', 540, 1210, 50, GREEN, C.white, E(seg(lt, id + 0.5, id + 0.75)));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + to, 'pop', { gain: 0.3 }); cue(st + id, 'tock', { gain: 0.3 }); cue(st + id + 0.25, 'tock', { gain: 0.3 });
  }

  return { shots: S, cues: CUES };
}
