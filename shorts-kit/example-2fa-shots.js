// HOW DO 2FA CODES ACTUALLY WORK?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const GREEN = '#5BAE6A', BLUE = '#3A7BD5';
const bg = (ring = '#CFE8F3', base = C.sky) => { fillAll(base); circle(540, 740, 560, ring); };
const floor = () => { ctx.fillStyle = C.floor; ctx.fillRect(-300, 1100, W + 600, 900); };
const CODE_A = '739105', CODE = '482913';
const auth = (left, o = {}) => () => K.authScreen(o.code || CODE, left, o);
const heldPhone = (screen) => (x, y) => K.phone(x + 12, y - 70, 0.3, screen);
const site = (typed = 6, ok = 0) => () => K.codeEntryScreen(CODE, typed, ok);

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · HOOK: big authenticator phone, six digits pop on "six-digit" ────
  {
    const st = cut(0), sx = Wd('six', 0) - st, lg = Wd('login', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 760], zoom: 0.1, note: 'big phone with authenticator; code tiles go yellow on "six-digit"; LOGIN CODE pill on "login"',
      draw(lt, d, t) {
        bg();
        K.phone(540, 780, 1.05, auth(0.55 - lt * 0.03, { code: CODE_A, hi: lt > sx ? 1 : 0 }));
        if (lt > sx) bigText('6', 900, 330, 200, C.yellow, 0.15, E(seg(lt, sx, sx + 0.25)));
        if (lt > lg) K.pill('LOGIN CODE', 230, 300, 56, C.ink, C.white, E(seg(lt, lg, lg + 0.25)));
      } });
    cue(st + 0.1, 'tock', { gain: 0.2 }); cue(st + sx, 'pop', { gain: 0.4 }); cue(st + lg, 'pop', { gain: 0.3 });
  }
  // ── 1b · code rolls over on "change", ring refills; 30 s on "thirty" ────
  {
    const st = Wd('change', 0) - 0.12, ch = 0.12, th = Wd('thirty', 0) - st;
    add({ id: 'S01b', at: st, cam: [540, 700], zoom: 0.12, note: 'close on code tiles; ring empty red then code rolls to a new one on "change"; 30 SEC stopwatch on "thirty"',
      draw(lt, d, t) {
        bg('#E9E2D2', C.bg);
        const left = lt < ch ? 0.05 : eo(seg(lt, ch, ch + 0.4));
        K.ringTimer(540, 420, 120, left, BLUE, 40);
        K.codeTiles(540, 780, 1.35, CODE, { from: CODE_A, roll: eio(seg(lt, ch, ch + 0.45)) });
        if (lt > th) { K.stopwatch(860, 1080, 0.45 * E(seg(lt, th, th + 0.25)), lt * 3); K.pill('EVERY 30 SEC', 330, 1060, 56, C.yellow, C.ink, E(seg(lt, th, th + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + ch, 'slide', { dur: 0.45, gain: 0.3 }); cue(st + th, 'pop', { gain: 0.4 }); cue(st + th + 0.3, 'tock', { gain: 0.25 });
  }

  // ── 2 · where do they actually come from? ───────────────────────────────
  {
    const st = cut(1), cm = Wd('come', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 640], zoom: 0.14, note: 'room; hero holds phone with code, puzzled; big ? pops on "come"',
      draw(lt, d, t) {
        K.room();
        K.man({ x: 470, y: 1200, s: 0.95, arm: K.PHONE_ARM, holding: heldPhone(auth(0.9, {})), eyes: 'n', mouth: 'flat', brow: 0.9, look: 0.5 });
        if (lt > cm) bigText('?', 760, 330, 230, C.yellow, 0.18, E(seg(lt, cm, cm + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + cm, 'boing', { gain: 0.35 });
  }

  // ── 3 · You'd think a server texts them to you ──────────────────────────
  {
    const st = cut(2), sv = Wd('server', 2) - st, tx = Wd('texts', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 720], zoom: 0.08, note: 'server left pops on "server"; envelope arcs to phone right from "texts"; TEXT MESSAGE? pill',
      draw(lt, d, t) {
        bg('#DDEFF6'); floor();
        if (lt > sv - 0.15) K.server(230, 780, 0.5 * E(seg(lt, sv - 0.15, sv + 0.1)), t);
        K.phone(850, 780, 0.5, auth(0.8, {}));
        K.route(330, 640, 760, 640, 220, 0, eo(seg(lt, tx - 0.1, tx + 0.4)), 0.35);
        if (lt > tx) { const u = eio(seg(lt, tx, tx + 0.9)); if (u < 1) { const [x, y] = K.arcAt(330, 640, 760, 640, 220, u); K.envelope(x, y, 0.5, 0); } }
        if (lt > tx) K.pill('TEXT MESSAGE?', 540, 300, 58, C.ink, C.white, E(seg(lt, tx, tx + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sv - 0.1, 'pop', { gain: 0.35 }); cue(st + tx, 'zip', { gain: 0.35 });
  }

  // ── 4 · but nothing is sent at all ──────────────────────────────────────
  {
    const st = cut(3), no = Wd('nothing', 3) - st, se = Wd('sent', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 700], zoom: 0.1, note: 'same layout, empty dotted path; red X slams on "nothing"; NOTHING SENT pill on "sent"',
      draw(lt, d, t) {
        bg('#F6D9DC', C.bg); floor();
        K.server(230, 780, 0.5, t);
        K.phone(850, 780, 0.5, auth(0.7, {}));
        K.route(330, 640, 760, 640, 220, 0, 1, 0.3);
        if (lt > no) K.redX(545, 560, lerp(1.6, 0.85, eo(seg(lt, no, no + 0.2))), 1);
        if (lt > se) K.pill('NOTHING SENT', 540, 300, 62, C.red, C.white, E(seg(lt, se, se + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + no, 'slam', { gain: 0.45 }); cue(st + se, 'pop', { gain: 0.35 });
  }

  // ── 5 · When you scanned that QR code during setup ──────────────────────
  {
    const st = cut(4), sc = Wd('scanned', 4) - st, qr = Wd('qr', 4) - st, su = Wd('setup', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 720], zoom: 0.1, note: 'laptop top shows a QR; phone below scans it (scan line) from "scanned"; QR CODE / SETUP pills',
      draw(lt, d, t) {
        bg('#E9E2D2', C.bg);
        K.laptop(540, 470, 0.85, () => { ctx.fillStyle = C.white; ctx.fillRect(-300, -180, 600, 360); K.qrCode(0, 0, 300, { seed: 7 }); });
        const scanY = lt > sc ? -130 + ((lt - sc) * 260) % 200 : -1;
        const py = lerp(1500, 960, eo(seg(lt, 0, 0.45)));
        K.phone(540, py, 0.55, K.cameraScreen(t, scanY, 0, '', 7));
        if (lt > qr) K.pill('QR CODE', 860, 760, 50, C.yellow, C.ink, E(seg(lt, qr, qr + 0.25)));
        if (lt > su) K.pill('SETUP', 220, 760, 56, C.ink, C.white, E(seg(lt, su, su + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + sc, 'sparkle', { dur: 0.6, gain: 0.25 }); cue(st + qr, 'pop', { gain: 0.35 }); cue(st + su, 'pop', { gain: 0.35 });
  }

  // ── 6 · your phone and the website saved the same secret ────────────────
  {
    const st = cut(5), ph = Wd('phone', 5) - st, ws = Wd('website', 5) - st, sm = Wd('same', 5) - st, se = Wd('secret', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 720], zoom: 0.08, note: 'phone left (pops on "phone"), laptop right (on "website"); gold keys drop above both on "same"; SAME SECRET pill + chips on "secret"',
      draw(lt, d, t) {
        bg('#DDEFF6'); floor();
        K.phone(250, 860, 0.5 * E(seg(lt, ph - 0.1, ph + 0.15)), auth(1, {}));
        K.laptop(770, 900, 0.5 * E(seg(lt, ws - 0.1, ws + 0.15)), site(0, 0));
        if (lt > sm) {
          const p = eob(seg(lt, sm, sm + 0.4));
          K.key(265, lerp(-200, 520, p), 0.75, 0.2);
          K.key(785, lerp(-200, 560, p), 0.75, -0.2);
        }
        if (lt > se) {
          K.pill('SAME SECRET', 540, 260, 64, C.yellow, C.ink, E(seg(lt, se, se + 0.25)));
          K.chip(250, 1160, 0.65 * E(seg(lt, se, se + 0.25)), 'K7Q2…', 'hash');
          K.chip(770, 1160, 0.65 * E(seg(lt, se + 0.08, se + 0.33)), 'K7Q2…', 'hash');
        }
      } });
    cue(st, 'whoosh'); cue(st + ph, 'pop', { gain: 0.3 }); cue(st + ws, 'pop', { gain: 0.3 }); cue(st + sm + 0.3, 'thud', { gain: 0.45 }); cue(st + se, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 7 · Now, every thirty seconds ───────────────────────────────────────
  {
    const st = cut(6), th = Wd('thirty', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 700], zoom: 0.14, note: 'big countdown ring sweeping; "30s" inside on "thirty"; tick tock',
      draw(lt, d, t) {
        bg('#E9E2D2', C.bg);
        const left = 1 - ((lt * 0.55) % 1);
        K.ringTimer(540, 720, 300, left, BLUE, 90);
        K.wallClock(540, 720, 0.6 * (lt > th ? 1 - E(seg(lt, th, th + 0.2)) : 1), t * 12);
        if (lt > th) bigText('30s', 540, 730, 220, C.yellow, 0, E(seg(lt, th, th + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.2, 'tock', { gain: 0.3 }); cue(st + th, 'pop', { gain: 0.4 }); cue(st + th + 0.5, 'tock', { gain: 0.3 });
  }

  // ── 8 · your app mixes that secret with the current time ────────────────
  {
    const st = cut(7), mx = Wd('mixes', 7) - st, se = Wd('secret', 7) - st, tm = Wd('time', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 700], zoom: 0.08, note: 'blender MIX centre; key drops in on "secret", clock drops in on "time"; blender spins from "mixes"',
      draw(lt, d, t) {
        bg('#DDEFF6');
        const spin = lt > mx ? 1 : 0;
        const fill = lt > tm + 0.4 ? 'rgba(255,212,59,0.85)' : null;
        K.blender(540, 760, 0.75, spin, fill, t, 'MIX');
        { const u = eio(seg(lt, se - 0.2, se + 0.4)); if (u < 1) K.key(lerp(200, 520, u), lerp(300, 620, u), 0.6 * (1 - u * 0.4), u * 3); }
        { const u = eio(seg(lt, tm - 0.2, tm + 0.4)); if (u < 1) K.wallClock(lerp(880, 560, u), lerp(300, 620, u), 0.45 * (1 - u * 0.4), t * 10); }
        if (lt > tm) K.pill('SECRET + TIME', 540, 1210, 56, C.yellow, C.ink, E(seg(lt, tm, tm + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + mx, 'bubbles', { dur: 1.6, gain: 0.25 }); cue(st + se + 0.35, 'plop', { gain: 0.4 }); cue(st + tm + 0.35, 'plop', { gain: 0.4 });
  }

  // ── 9 · and squeezes out six digits ─────────────────────────────────────
  {
    const st = cut(8), sq = Wd('squeezes', 8) - st, sx = Wd('six', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 640], zoom: 0.1, note: 'blender spins; six code tiles pop out one by one below from "squeezes", go yellow on "six"',
      draw(lt, d, t) {
        bg('#DDEFF6');
        K.blender(540, 560, 0.62, 1, 'rgba(255,212,59,0.85)', t, 'MIX');
        const shown = lt > sq ? clamp((lt - sq) / 0.07, 0, 6) : 0;
        if (lt > sx) K.shockLines(540, 1050, 460, clamp((lt - sx) * 4));
        K.codeTiles(540, 1050, 1.25, CODE, { shown, hi: lt > sx ? 1 : 0 });
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 6; k++) cue(st + sq + k * 0.07, 'pop', { gain: 0.2 }); cue(st + sx, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 10 · The website does the same math ─────────────────────────────────
  {
    const st = cut(9), ws = Wd('website', 9) - st, sm = Wd('same', 9) - st, mt = Wd('math', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 700], zoom: 0.08, note: 'laptop top (website) with its own key + clock; mini blender spins on "same"; navy code tiles appear on "math"',
      draw(lt, d, t) {
        bg('#E9E2D2', C.bg);
        K.laptop(540, 420, 0.75, site(0, 0));
        if (lt > ws) K.pill('WEBSITE', 540, 160, 56, BLUE, C.white, E(seg(lt, ws, ws + 0.25)));
        K.key(200, 800, 0.5, 0.2); K.wallClock(890, 800, 0.38, t * 10);
        K.blender(540, 830, 0.42, lt > sm ? 1 : 0, lt > sm + 0.2 ? 'rgba(255,212,59,0.85)' : null, t, 'MIX');
        if (lt > mt) K.codeTiles(540, 1170, 0.9, CODE, { tone: 'navy', shown: clamp((lt - mt) / 0.05, 0, 6) });
      } });
    cue(st, 'whoosh'); cue(st + ws, 'pop', { gain: 0.3 }); cue(st + sm, 'bubbles', { dur: 0.6, gain: 0.2 }); cue(st + mt, 'pop', { gain: 0.4 });
  }

  // ── 11 · so if both numbers match, you're in ────────────────────────────
  {
    const st = cut(10), bo = Wd('both', 10) - st, ma = Wd('match', 10) - st, yi = Wd('in', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 700], zoom: 0.1, note: 'phone code tiles top, website navy tiles below; "=" on "match"; laptop WELCOME + big green check on "in"',
      draw(lt, d, t) {
        bg('#DDEFF6');
        K.pill('YOUR PHONE', 540, 210, 44, C.ink, C.white, 1);
        K.codeTiles(540, 340, 0.95, CODE, { hi: lt > ma ? 1 : 0 });
        K.pill('WEBSITE', 540, 500, 44, BLUE, C.white, 1);
        K.codeTiles(540, 630, 0.95, CODE, { tone: 'navy', hi: lt > ma ? 1 : 0 });
        if (lt > ma) bigText('=', 895, 485, 150, C.yellow, 0, E(seg(lt, ma, ma + 0.2)));
        K.laptop(540, 1000, 0.55, site(lt > ma ? 6 : clamp((lt - bo) * 6, 0, 6), lt > yi ? 1 : 0));
        if (lt > yi) K.check(870, 880, 0.8 * E(seg(lt, yi, yi + 0.25)), 1);
      } });
    cue(st, 'whoosh'); cue(st + bo, 'pop', { gain: 0.3 }); cue(st + ma, 'pop', { gain: 0.45 }); cue(st + yi, 'sparkle', { dur: 0.5, gain: 0.35 }); cue(st + yi, 'boing', { gain: 0.35 });
  }

  // ── 12 · But here's the twist ───────────────────────────────────────────
  {
    const st = cut(11), tw = Wd('twist', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 600], zoom: 0.14, note: 'room; hero with phone smirks; red warning + shock on "twist"',
      draw(lt, d, t) {
        K.room();
        const hit = lt > tw;
        K.man({ x: 450, y: 1180, s: 1.0, arm: K.PHONE_ARM, holding: heldPhone(auth(0.8, {})), eyes: hit ? 'wide' : 'n', mouth: hit ? 'o' : 'smirk', brow: hit ? 1 : 0.6, smirk: !hit, look: 0.4 });
        if (hit) { K.warning(820, 360, 0.8 * E(seg(lt, tw, tw + 0.25))); K.shockLines(450, 830, 150, clamp((lt - tw) * 4)); }
      } });
    cue(st, 'whoosh'); cue(st + tw, 'slam', { gain: 0.45 });
  }

  // ── 13 · it works even in airplane mode ─────────────────────────────────
  {
    const st = cut(12), wk = Wd('works', 12) - st, ap = Wd('airplane', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 720], zoom: 0.1, note: 'phone centre ticking code; plane flies across top; airplane badge + slashed wifi on "airplane"; green check on "works"',
      draw(lt, d, t) {
        bg('#F2E4D0', C.bg);
        K.airplane(lerp(-200, 1300, (lt * 0.45) % 1), 200, 0.5, -0.08, C.white);
        const off = lt > ap;
        K.phone(540, 820, 0.85, auth(1 - ((lt * 0.3) % 1), { plane: off }));
        if (lt > wk) K.check(890, 520, 0.6 * E(seg(lt, wk, wk + 0.25)), 1);
        if (lt > ap) { K.planeBadge(180, 480, 0.8, E(seg(lt, ap, ap + 0.25))); K.wifiIcon(180, 1000, 0.7, 3, '#9AA1AE'); K.signalSlash(180, 960, 0.9, eo(seg(lt, ap + 0.15, ap + 0.35))); }
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 1.2, gain: 0.15 }); cue(st + wk, 'pop', { gain: 0.4 }); cue(st + ap, 'pop', { gain: 0.4 }); cue(st + ap + 0.2, 'slam', { gain: 0.3 });
  }

  // ── 14 · because the code is made right on your phone ───────────────────
  {
    const st = cut(13), cd = Wd('code', 13) - st, md = Wd('made', 13) - st, ph = Wd('phone', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 720], zoom: 0.12, note: 'phone with navy inside view: key + clock merge into code tiles on "made"; CODE pill; MADE ON YOUR PHONE pill on "phone"',
      draw(lt, d, t) {
        bg('#DDEFF6');
        K.phone(540, 760, 1.0, () => {
          ctx.fillStyle = C.navy; ctx.fillRect(-166, -350, 332, 700);
          ctx.fillStyle = C.cyan; ctx.font = '900 28px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('INSIDE THE APP', 0, -290);
          const u = eio(seg(lt, md - 0.1, md + 0.45));
          if (u < 1) { K.key(lerp(-40, 0, u), lerp(-150, -20, u), 0.65 * (1 - u * 0.7), 0.3); K.wallClock(lerp(60, 0, u), lerp(120, -20, u), 0.48 * (1 - u * 0.7), t * 10);
          if (u <= 0) { ctx.fillStyle = C.yellow; ctx.font = '900 70px Inter'; ctx.fillText('+', 0, -15); } }
          if (u > 0.9) K.codeTiles(0, 0, 0.46, CODE, { hi: 1, shown: clamp((lt - md - 0.4) / 0.05, 0, 6) });
        });
        if (lt > cd) K.pill('CODE', 880, 560, 56, C.yellow, C.ink, E(seg(lt, cd, cd + 0.2)));
        if (lt > ph) K.pill('MADE ON YOUR PHONE', 540, 230, 54, C.ink, C.white, E(seg(lt, ph, ph + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + cd, 'pop', { gain: 0.3 }); cue(st + md, 'sparkle', { dur: 0.5, gain: 0.3 }); cue(st + ph, 'pop', { gain: 0.4 });
  }

  // ── 15 · Your phone and the website never talk ──────────────────────────
  {
    const st = cut(14), nv = Wd('never', 14) - st;
    add({ id: 'S15', at: st, cam: [540, 700], zoom: 0.1, note: 'phone left, laptop right, dotted path between; red X on "never"; NO CONNECTION pill',
      draw(lt, d, t) {
        bg('#F6D9DC', C.bg); floor();
        K.phone(230, 800, 0.5, auth(0.6, {}));
        K.laptop(780, 860, 0.45, site(0, 0));
        const pp = Wd('phone', 14) - st, pw = Wd('website', 14) - st;
        if (lt > pp) K.pill('PHONE', 230, 1130, 48, C.ink, C.white, E(seg(lt, pp, pp + 0.25)));
        if (lt > pw) K.pill('WEBSITE', 780, 1130, 48, BLUE, C.white, E(seg(lt, pw, pw + 0.25)));
        K.route(340, 640, 700, 640, 180, 0, 1, 0.3);
        if (lt > nv) K.redX(520, 560, lerp(1.6, 0.85, eo(seg(lt, nv, nv + 0.2))), 1);
        if (lt > nv) K.pill('NO CONNECTION', 540, 300, 60, C.red, C.white, E(seg(lt, nv + 0.15, nv + 0.4)));
      } });
    cue(st, 'whoosh'); cue(st + Wd('phone', 14) - st, 'pop', { gain: 0.3 }); cue(st + Wd('website', 14) - st, 'pop', { gain: 0.3 }); cue(st + nv, 'slam', { gain: 0.45 });
  }

  // ── 16 · they just both check the clock (to camera, loop) ───────────────
  {
    const st = Wd('they', 14) - 0.1, bo = Wd('both', 14) - st, ck = Wd('clock', 14) - st;
    add({ id: 'S16', at: st, cam: [540, 640], zoom: 0.08, note: 'room; hero to camera points at wall clock; phone + laptop pop beside the clock on "both"; wink + grin on "clock"',
      draw(lt, d, t) {
        K.room();
        K.wallClock(540, 330, 0.75, t * 8, 41);
        if (lt > bo) { K.phone(190, 400, 0.28 * E(seg(lt, bo, bo + 0.25)), auth(0.6, {})); K.laptop(890, 400, 0.28 * E(seg(lt, bo + 0.08, bo + 0.33)), site(6, 1)); }
        K.man({ x: 540, y: 1230, s: 0.85, arm: K.armPose(K.ARM.down, K.ARM.point, eo(seg(lt, 0, 0.3))), finger: -0.2,
          eyes: lt > ck ? 'wink' : 'n', mouth: lt > ck ? 'grin' : 'smirk', brow: 0.6, look: 0 });
      } });
    cue(st, 'whoosh'); cue(st + bo, 'pop', { gain: 0.3 }); cue(st + ck, 'tock', { gain: 0.35 }); cue(st + ck + 0.1, 'boing', { gain: 0.35 });
  }

  return { shots: S, cues: CUES };
}
