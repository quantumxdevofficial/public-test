// WHAT IS AN API?: the shot list (the only file that changes per video, with script.json).
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';

// shared wide layout: phone (client) on the left, server on the right
const PH = [230, 800, 0.8], SV = [852, 790, 0.85];
const R1 = [PH[0] + 120, PH[1] - 270], R2 = [SV[0] - 130, SV[1] - 250];   // route ends (phone top-right → server top-left)
const JSON_ROWS = [
  [['{', C.white]],
  [['  "temp": ', C.white], ['31', C.yellow], [',', C.white]],
  [['  "sky": ', C.white], ['"sunny"', C.yellow]],
  [['}', C.white]],
];
function sky(t) {
  fillAll(C.bg);
  for (const [x, y, s] of [[180, 300, 1], [760, 210, 0.8], [520, 420, 0.6]]) {
    const dx = Math.sin(t * 0.3 + x) * 14; ell(x + dx, y, 90 * s, 34 * s, C.white); ell(x + dx + 40 * s, y - 22 * s, 60 * s, 38 * s, C.white);
  }
  ctx.fillStyle = C.floor; ctx.fillRect(-300, 1140, W + 600, 900);
}
function heldPhone(screen) { return (x, y) => K.phone(x + 12, y - 70, 0.3, screen); }
function wideScene(t, screen, label = 1) {
  sky(t);
  K.phone(PH[0], PH[1], PH[2], screen);
  K.server(SV[0], SV[1], SV[2], t);
  if (label > 0) { K.pill('YOUR APP', PH[0], 1175, 40, C.ink, C.white, label); K.pill('SERVER', SV[0], 1175, 40, C.ink, C.white, label); }
}

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · HOOK: puzzled hero with his phone, "API?" pops ───────────────────
  {
    const st = cut(0), api = Wd('api', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 760], note: 'hero holds phone, puzzled; API? burst on "API"',
      draw(lt) {
        K.room();
        const hit = lt > api;
        K.man({ x: 540, y: 1200, s: 1.6, arm: K.PHONE_ARM, holding: heldPhone(K.homeScreen),
          eyes: hit ? 'wide' : 'n', mouth: hit ? 'o' : 'flat', brow: hit ? 1 : 0.4, look: Math.sin(lt * 3) * 0.6 });
        if (hit) { const p = eob(seg(lt, api, api + 0.25)); K.burst(800, 300, 1.6, clamp((lt - api) * 4)); bigText('API?', 800, 300, 150, C.yellow, -0.1, p); }
        K.shockLines(540, 640, 290, hit ? clamp((lt - api) * 5) : 0);
      } });
    cue(st + api, 'pop'); cue(st + api + 0.05, 'boing', { gain: 0.45 });
  }

  // ── 2 · tap the weather app ─────────────────────────────────────────────
  {
    const st = cut(1), tap = Wd('open', 1) - st + 0.05;
    add({ id: 'S02', at: st, cam: [540, 700], zoom: 0.1, note: 'phone close-up, finger taps weather tile on "open", app opens',
      draw(lt, d, t) {
        fillAll(C.sky); circle(540, 760, 620, '#CFE8F3');
        const ox = 540, oy = 740, s = 1.3, tx = ox + K.WEATHER_TILE[0] * s, ty = oy + K.WEATHER_TILE[1] * s;
        const open = eo(seg(lt, tap + 0.1, tap + 0.45));
        K.phone(ox, oy, s, () => {
          K.homeScreen();
          if (open > 0) { ctx.save(); ctx.translate(K.WEATHER_TILE[0] * (1 - open), K.WEATHER_TILE[1] * (1 - open)); ctx.scale(lerp(0.24, 1, open), lerp(0.11, 1, open)); K.weatherScreen('– –°', 0, t); ctx.restore(); }
        });
        const fin = lt < tap ? eo(seg(lt, 0, tap)) : 1 - eio(seg(lt, tap + 0.15, tap + 0.55));
        K.ripple(tx, ty, seg(lt, tap, tap + 0.45));
        K.tapFinger(tx, ty, fin, lt > tap && lt < tap + 0.15 ? 1 : 0);
      } });
    cue(st, 'whoosh'); cue(st + tap, 'pop', { gain: 0.6 }); cue(st + tap + 0.12, 'zip', { gain: 0.4 });
  }

  // ── 3 · x-ray inside the phone: no forecast in here ─────────────────────
  {
    const st = cut(2), know = Wd('know', 2) - st, fc = Wd('forecast', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 800], zoom: 0.12, note: 'x-ray phone: chips, battery, empty FORECAST box, red ? on "know"',
      draw(lt, d, t) {
        K.xray(t);
        K.phoneXray(540, 740, 1.3, t);
        const bp = eob(seg(lt, fc - 0.1, fc + 0.2));
        if (bp > 0) {
          ctx.save(); ctx.translate(540, 980); ctx.scale(bp, bp);
          ctx.beginPath(); ctx.roundRect(-190, -110, 380, 220, 26); ctx.fillStyle = C.xnavy; ctx.fill();
          ctx.setLineDash([22, 16]); ctx.lineWidth = 8; ctx.strokeStyle = C.cyan; ctx.stroke(); ctx.setLineDash([]);
          ctx.fillStyle = C.cyan; ctx.font = '900 54px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('FORECAST', 0, -30);
          ctx.globalAlpha = 0.6; ctx.font = '900 46px Inter'; ctx.fillText('EMPTY', 0, 40); ctx.restore();
        }
        if (lt > know) bigText('?', 880, 330, 230, C.red, 0.15 + Math.sin(lt * 6) * 0.05, eob(seg(lt, know, know + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + know, 'boing', { gain: 0.4 }); cue(st + fc, 'pop', { gain: 0.5 });
  }

  // ── 4 · the request travels to the server ───────────────────────────────
  {
    const st = cut(3), go = Wd('request', 3) - st, land = Wd('server', 3) - st + 0.2;
    add({ id: 'S04', at: st, cam: [540, 700], zoom: 0.08, note: 'GET /weather envelope flies phone → server, lands on "server"',
      draw(lt, d, t) {
        wideScene(t, () => K.weatherScreen('– –°', 0, t), eob(seg(lt, 0.1, 0.4)));
        const u = eio(seg(lt, go, land));
        K.route(...R1, ...R2, 320, 0, Math.max(u, seg(lt, 0, go)));
        if (lt > go - 0.3) {
          const [ex, ey] = lt < go ? [R1[0], lerp(R1[1] + 60, R1[1], eo(seg(lt, go - 0.3, go)))] : K.arcAt(...R1, ...R2, 320, u);
          const inS = lt > land ? 1 - eo(seg(lt, land, land + 0.25)) : 1;
          if (inS > 0) K.envelope(ex, ey, 0.75 * inS, (u > 0 && u < 1) ? (u - 0.5) * 0.6 : 0, inS > 0.6 ? 'GET /weather' : null);
          if (u > 0.2 && u < 0.95) K.speedLines(ex - 60, ey, 0.5);
        }
        if (lt > land) K.burst(SV[0], SV[1] - 200, 1.3, 1 - seg(lt, land, land + 0.5));
      } });
    cue(st, 'whoosh'); cue(st + go, 'slide', { dur: land - go }); cue(st + land, 'thud', { gain: 0.7 });
  }

  // ── 5a · strict rules → the server flips into a MENU ────────────────────
  const rest = Wd('restaurant', 4) - 0.1;
  {
    const st = cut(4), flip = Wd('menu', 4) - st - 0.2, rules = Wd('rules', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 700], zoom: 0.2, note: 'server close-up flips into a menu card on "menu"',
      draw(lt, d, t) {
        fillAll(C.bg);
        const f = seg(lt, flip, flip + 0.36), sx = Math.abs(Math.cos(f * Math.PI));
        if (f < 0.5) {
          ctx.save(); ctx.translate(540, 720); ctx.scale(sx, 1); ctx.translate(-540, -720); K.server(540, 720, 1.05, t); ctx.restore();
          K.envelope(540, 300 + Math.sin(lt * 3) * 10, 0.85, 0, 'GET /weather');
          if (lt > rules) { const p = eob(seg(lt, rules, rules + 0.25)); K.burst(540, 720, 2.2, 1 - seg(lt, rules, rules + 0.6)); K.pill('STRICT RULES', 540, 720, 64, C.yellow, C.ink, p); }
        } else K.menuCard(540, 720, 0.95, ['/weather', '/forecast', '/alerts'], -1, 0, 0, sx);
      } });
    cue(st, 'whoosh'); cue(st + rules, 'thud', { gain: 0.6 }); cue(st + flip + 0.18, 'zip', { gain: 0.5 }); cue(st + flip + 0.36, 'pop');
  }
  // ── 5b · …like at a restaurant: the hero reads the menu ─────────────────
  add({ id: 'S05b', at: rest, cam: [540, 700], note: 'hero holds the menu like at a restaurant',
    draw(lt) {
      K.room();
      K.man({ x: 540, y: 1220, s: 1.55, arm: K.PHONE_ARM, holding: (x, y) => K.menuCard(x + 10, y - 10, 0.3, ['/weather', '/forecast', '/alerts']),
        eyes: 'n', look: 0.6, mouth: 'smile', brow: 0.5 });
    } });
  cue(rest, 'whoosh');

  // ── 6 · only what's listed: /weather gets highlighted + tick ────────────
  {
    const st = cut(5), only = Wd('only', 5) - st, listed = Wd('listed', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 520], zoom: 0.14, note: 'menu close-up: /weather highlighted on "only", tick on "listed"',
      draw(lt) {
        fillAll(C.bg);
        K.menuCard(540, 700, 1.25, ['/weather', '/forecast', '/alerts'], 0, eo(seg(lt, only, only + 0.4)), eob(seg(lt, listed, listed + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + only, 'slide', { dur: 0.4, gain: 0.5 }); cue(st + listed, 'pop');
  }

  // ── 7a · the API is the gate between them ──────────────────────────────
  const appl = Wd('application', 6) - 0.1;
  {
    const st = cut(6), api = Wd('api', 6) - st;
    const A = [PH[0] + 130, 790], B = [SV[0] - 130, 790];
    add({ id: 'S07', at: st, cam: [540, 760], zoom: 0.08, note: 'API gate pops between phone and server; envelope passes through, letters light on "API"',
      draw(lt, d, t) {
        wideScene(t, () => K.weatherScreen('– –°', 0, t), 1);
        const lit = lt > api ? eo(seg(lt, api, api + 0.2)) : 0;
        K.apiGate(541, 840, 0.58, [lit, lit, lit], eob(seg(lt, 0.05, 0.4)));
        const u = eio(seg(lt, 0.3, api + 0.5));
        if (u > 0 && u < 1) { const [ex, ey] = K.arcAt(...A, ...B, 40, u); K.envelope(ex, ey, 0.55, 0, null); }
        if (lt > api) K.burst(540, 590, 1.2, 1 - seg(lt, api, api + 0.5));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'pop', { gain: 0.6 }); cue(st + 0.3, 'slide', { dur: api + 0.2 }); cue(st + api, 'sparkle', { dur: 0.6, gain: 0.6 });
  }
  // ── 7b · A·P·I light up one by one ──────────────────────────────────────
  {
    const a = Wd('application', 6), p = Wd('programming', 6), i = Wd('interface', 6);
    const words = [['APPLICATION', a], ['PROGRAMMING', p], ['INTERFACE', i]];
    add({ id: 'S07b', at: appl, cam: [540, 420], zoom: 0.1, note: 'gate close-up: A, P, I light on each word',
      draw(lt) {
        fillAll(C.bg);
        const tt = appl + lt, on = (w) => eo(seg(tt, w, w + 0.18));
        K.apiGate(540, 860, 1.5, [on(a), on(p), on(i)]);
        words.forEach(([w, wt], k) => {
          if (tt <= wt) return;
          const current = k === 2 || tt < words[k + 1][1];
          K.pill(w, 540, 640 + k * 120, 52, current ? C.ink : '#55555E', C.white, eob(seg(tt, wt, wt + 0.22)));
        });
      } });
    cue(appl, 'whoosh'); cue(a, 'pop', { gain: 0.55 }); cue(p, 'pop', { gain: 0.55 }); cue(i, 'pop', { gain: 0.55 });
  }

  // ── 8a · the answer comes back ──────────────────────────────────────────
  const called = Wd('called', 7) - 0.1;
  {
    const st = cut(7), go = Wd('sends', 7) - st, land = Wd('answer', 7) - st + 0.25;
    add({ id: 'S08', at: st, cam: [540, 700], zoom: 0.08, note: '200 OK envelope flies server → phone, lands after "answer"',
      draw(lt, d, t) {
        wideScene(t, () => K.weatherScreen('– –°', 0, t), 1);
        const u = eio(seg(lt, go, land));
        K.route(...R2, ...R1, 320, 0, Math.max(u, seg(lt, 0, go)));
        const [ex, ey] = K.arcAt(...R2, ...R1, 320, u);
        const inS = lt > land ? 1 - eo(seg(lt, land, land + 0.2)) : eob(seg(lt, 0, 0.3));
        if (inS > 0) K.envelope(ex, ey, 0.75 * inS, (0.5 - u) * 0.6, inS > 0.6 ? '200 OK' : null);
        if (lt > land) K.burst(PH[0], PH[1] - 200, 1.2, 1 - seg(lt, land, land + 0.5));
      } });
    cue(st, 'whoosh'); cue(st + go, 'slide', { dur: land - go }); cue(st + land, 'thud', { gain: 0.6 });
  }
  // ── 8b · it opens into JSON ─────────────────────────────────────────────
  {
    const js = Wd('jason', 7);
    add({ id: 'S08b', at: called, cam: [540, 720], zoom: 0.1, note: 'envelope opens, JSON card types out',
      draw(lt) {
        fillAll(C.bg);
        const tt = called + lt, op = eo(seg(lt, 0, 0.25));
        K.envelope(540, 1080, 1.0, 0, null, op);
        const sc = eob(seg(lt, 0.15, 0.45));
        K.jsonCard(540, lerp(1000, 640, eo(seg(lt, 0.15, 0.45))), 1.2, JSON_ROWS, Math.max(0, (lt - 0.15) * 55), sc);
      } });
    cue(called + 0.05, 'pop', { gain: 0.55 }); cue(js, 'sparkle', { dur: 0.7, gain: 0.45 });
  }

  // ── 9 · the app turns it into a sunny icon ─────────────────────────────
  {
    const st = cut(8), turns = Wd('turns', 8) - st, sunny = Wd('sunny', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 620], zoom: 0.12, note: 'JSON card flies into phone; 31° on "turns", sun pops on "sunny"',
      draw(lt, d, t) {
        fillAll(C.sky); circle(540, 760, 620, '#CFE8F3');
        K.phone(540, 740, 1.3, () => K.weatherScreen(lt > turns ? '31°' : '– –°', eob(seg(lt, sunny, sunny + 0.35)), t));
        const fly = eio(seg(lt, 0, turns));
        if (fly < 1) K.jsonCard(540, lerp(300, 700, fly), lerp(0.7, 0.15, fly), JSON_ROWS, 1e9, 1);
        if (lt > sunny) for (const [x, y, k] of [[250, 330, 0], [840, 420, 1], [860, 1060, 2], [230, 980, 3]]) K.burst(x, y, 0.8, 1 - seg(lt, sunny + k * 0.08, sunny + 0.6 + k * 0.08));
      } });
    cue(st, 'whoosh'); cue(st + turns, 'pop'); cue(st + sunny, 'sparkle', { dur: 0.9 });
  }

  // ── 10 · ordering off the menu: GET /pizza ─────────────────────────────
  {
    const st = cut(9), go = Wd('order', 9) - st, arrive = Wd('menu', 9) - st + 0.15;
    add({ id: 'S10', at: st, cam: [540, 700], zoom: 0.08, note: 'GET /pizza envelope wobbles phone → server',
      draw(lt, d, t) {
        wideScene(t, () => K.weatherScreen('31°', 1, t), 1);
        const u = eio(seg(lt, go, arrive));
        K.route(...R1, ...R2, 320, 0, Math.max(u, seg(lt, 0, go)));
        const [ex, ey] = K.arcAt(...R1, ...R2, 320, u);
        K.envelope(ex, ey + Math.sin(lt * 9) * 12, 0.75 * eob(seg(lt, 0, 0.3)), Math.sin(lt * 7) * 0.25, 'GET /pizza');
      } });
    cue(st, 'whoosh'); cue(st + go, 'slide', { dur: arrive - go }); cue(st + arrive, 'boing', { gain: 0.5 });
  }

  // ── 11 · 404 ────────────────────────────────────────────────────────────
  {
    const st = cut(10), err = Wd('error', 10) - st, four = Wd('four', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 600], zoom: 0.08, note: '404 card slams on "error"; red X on "four oh four"; hero frowns',
      draw(lt) {
        fillAll(C.bg); ctx.fillStyle = C.floor; ctx.fillRect(-300, 1560, W + 600, 700);
        const hit = lt > err, sh = hit ? Math.sin(lt * 60) * 10 * Math.max(0, 1 - (lt - err) * 2.5) : 0;
        K.man({ x: 540, y: 1330, s: 1.25, arm: K.PHONE_ARM, holding: heldPhone(() => K.weatherScreen('31°', 1, 0)),
          eyes: hit ? 'wide' : 'n', mouth: hit ? 'flat' : 'smile', frown: lt > four, brow: hit && lt < four ? 1 : 0 });
        if (lt > err - 0.15) K.errorCard(540 + sh, 450, 0.95 * lerp(1.5, 1, eo(seg(lt, err - 0.15, err + 0.05))), -0.04);
        if (lt > four) K.redX(840, 270, lerp(0.7, 0.32, eo(seg(lt, four, four + 0.2))), 1);
      } });
    cue(st, 'whoosh'); cue(st + err, 'slam'); cue(st + four + 0.1, 'thud', { gain: 0.6 });
  }

  // ── 12 · every app is talking to an API (wink) ─────────────────────────
  {
    const st = cut(11), every = Wd('every', 11) - st, api = Wd('api', 11) - st;
    const apps = [180, 413, 667, 900], servers = [[240, 300], [540, 260], [840, 300]];
    const tileCol = ['#3A7BD5', '#E57A8A', '#5BAE6A', '#C8734A'];
    add({ id: 'S12', at: st, cam: [540, 760], zoom: 0.06, note: 'app tiles stream envelopes to servers; hero winks on "API"',
      draw(lt, d, t) {
        fillAll(C.bg); ctx.fillStyle = C.floor; ctx.fillRect(-300, 1560, W + 600, 700);
        servers.forEach(([x, y], k) => { const p = eob(seg(lt, 0.1 + k * 0.08, 0.4 + k * 0.08)); if (p > 0) K.server(x, y, 0.42 * p, t + k); });
        apps.forEach((x, k) => {
          const p = eob(seg(lt, every - 0.1 + k * 0.08, every + 0.2 + k * 0.08)); if (p <= 0) return;
          if (k === 1) K.weatherTile(x, 600, 1.1 * p); else K.appTile(x, 600, 1.1 * p, tileCol[k]);
        });
        if (lt > every + 0.2) for (let k = 0; k < 8; k++) {
          const a = apps[k % 4], [sx, sy] = servers[(k * 2 + 1) % 3], u = ((lt - every) * 0.9 + k * 0.37) % 1, up = k % 2 === 0;
          const [ex, ey] = up ? [lerp(a, sx, u), lerp(545, sy + 80, u)] : [lerp(sx, a, u), lerp(sy + 80, 545, u)];
          K.envelope(ex, ey, 0.36, 0, null);
        }
        K.man({ x: 540, y: 1330, s: 1.25, arm: K.armPose(K.ARM.down, K.ARM.point, eio(seg(lt, api - 0.3, api))), finger: lt > api ? 0.2 : null,
          eyes: lt > api && lt < api + 1.4 ? 'wink' : 'n', mouth: lt > api ? 'grin' : 'smirk', smirk: true, brow: 0.3 });
      } });
    cue(st, 'whoosh'); cue(st + every, 'pop', { gain: 0.5 }); cue(st + every + 0.2, 'bubbles', { dur: 1.5, gain: 0.35 }); cue(st + api, 'boing', { gain: 0.45 });
  }

  return { shots: S, cues: CUES };
}
