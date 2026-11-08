// HOW DO PUSH NOTIFICATIONS ACTUALLY WORK?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const GREEN = '#5BAE6A', BLUE = '#3A7BD5', PINK = '#E57A8A', ORANGE = '#F29A3A';
const heldPhone = (screen) => (x, y) => K.phone(x + 12, y - 70, 0.3, screen);
const bg = (ring = '#CFE8F3', base = C.sky) => { fillAll(base); circle(540, 740, 560, ring); };
const floor = () => { ctx.fillStyle = C.floor; ctx.fillRect(-300, 1100, W + 600, 900); };
const TILES = [BLUE, PINK, GREEN, '#C8734A', C.yellow, '#1F2A44'];
const sleepyHome = (t, sleep = 1, wake = -1) => () => {
  ctx.fillStyle = '#DCEEF6'; ctx.fillRect(-166, -350, 332, 700);
  ctx.fillStyle = C.ink; ctx.font = '900 30px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('9:41', 0, -290);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { const k = r * 3 + c; K.sleepyTile(-100 + c * 100, -190 + r * 125, 1, TILES[k % 6], t + k * 0.3, k === wake ? 0 : sleep); }
};
const msg = (p) => [['Sam', 'you up?', GREEN, p]];
const buzz = (t, a) => (a > 0 ? Math.sin(t * 90) * 10 * a : 0);
function along(pts, u) {
  const n = pts.length - 1, k = Math.min(n - 1, Math.floor(clamp(u) * n)), f = clamp(u) * n - k;
  return [lerp(pts[k][0], pts[k + 1][0], f), lerp(pts[k][1], pts[k + 1][1], f)];
}

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · HOOK: big locked phone buzzes, banner drops on "message" ───────
  {
    const st = cut(0), kn = Wd('know', 0) - st, ms = Wd('message', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 760], zoom: 0.08, note: 'big lock-screen phone; "?" on "know"; buzz + banner drops on "message"; bell rings',
      draw(lt, d, t) {
        bg();
        const bz = lt > ms ? clamp(1 - (lt - ms) * 2.2) : 0;
        K.phone(540 + buzz(t, bz), 760, 0.95, () => K.lockScreen(msg(eo(seg(lt, ms, ms + 0.35))), t), buzz(t, bz) * 0.004);
        if (lt > kn) bigText('?', 880, 330, 190, C.yellow, 0.15, E(seg(lt, kn, kn + 0.25)));
        if (lt > ms) { K.bell(220, 360, 0.8 * E(seg(lt, ms, ms + 0.25)), 1, 1, t); K.shockLines(540, 760, 420, bz); }
      } });
    cue(st + 0.1, 'tock', { gain: 0.2 }); cue(st + kn, 'pop', { gain: 0.35 }); cue(st + ms, 'boing', { gain: 0.4 }); cue(st + ms + 0.05, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 2 · even when the app is closed ─────────────────────────────────────
  {
    const st = cut(1), cl = Wd('closed', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 720], zoom: 0.1, note: 'phone home screen, every app tile asleep (zzz); APP CLOSED pill on "closed"',
      draw(lt, d, t) {
        bg('#E9E2D2', C.bg);
        K.phone(540, 780, 0.95, sleepyHome(t, eo(seg(lt, 0.1, 0.6))));
        if (lt > cl) K.pill('APP CLOSED', 540, 250, 66, C.ink, C.white, E(seg(lt, cl, cl + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.2, 'sparkle', { dur: 0.5, gain: 0.2 }); cue(st + cl, 'pop', { gain: 0.4 });
  }

  // ── 3 · You'd think every app keeps checking its own server ────────────
  const SV = [[850, 360], [850, 700], [850, 1040]];
  {
    const st = cut(2), th = Wd('think', 2) - st, ck = Wd('checking', 2) - st, sv = Wd('server', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 720], zoom: 0.08, note: 'phone left; three servers right pop in from "think"; packets ping back and forth from "checking"; ANY NEWS? pill; pill on "server"',
      draw(lt, d, t) {
        bg('#DDEFF6'); floor();
        SV.forEach(([x, y], k) => { const a = th + k * 0.15; if (lt > a) K.server(x, y, 0.42 * E(seg(lt, a, a + 0.25)), t); });
        K.phone(220, 720, 0.55, sleepyHome(t, 0.6));
        if (lt > ck) for (let k = 0; k < 3; k++) {
          const u = ((lt - ck) * 1.6 + k * 0.33) % 2, go = u < 1, uu = go ? u : 2 - u;
          const [x, y] = K.arcAt(330, 720, SV[k][0] - 90, SV[k][1], 120, uu); K.packet(x, y, 0.45, go ? '?' : '');
        }
        if (lt > ck) K.pill('ANY NEWS?', 330, 330, 54, C.yellow, C.ink, E(seg(lt, ck, ck + 0.25)));
        if (lt > sv) K.pill('THEIR SERVERS', 540, 1220, 50, C.ink, C.white, E(seg(lt, sv, sv + 0.25)));
      } });
    cue(st, 'whoosh'); [0, 1, 2].forEach((k) => cue(st + th + k * 0.15, 'pop', { gain: 0.3 })); cue(st + ck, 'slide', { dur: 1.0, gain: 0.25 }); cue(st + sv, 'pop', { gain: 0.35 });
  }

  // ── 4 · but that would drain your battery fast ─────────────────────────
  {
    const st = cut(3), dr = Wd('drain', 3) - st, fa = Wd('fast', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 700], zoom: 0.12, note: 'big battery drains green→red from "drain"; red warning + shock on "fast"',
      draw(lt, d, t) {
        bg('#F6D9DC', C.bg);
        const lv = lerp(1, 0.08, eio(seg(lt, dr - 0.1, fa + 0.15)));
        K.battery(540, 700, 2.2, lv);
        for (let k = 0; k < 5; k++) { const u = (lt * 1.5 + k / 5) % 1; if (lt > dr) K.packet(lerp(160, 920, (k * 0.23) % 1), lerp(1150, 380, u), 0.3, '?'); }
        if (lt > fa) { K.warning(540, 330, 0.7 * E(seg(lt, fa, fa + 0.25))); K.shockLines(540, 700, 380, clamp((lt - fa) * 4)); }
      } });
    cue(st, 'whoosh'); cue(st + dr, 'slide', { dur: 0.8, gain: 0.3 }); cue(st + fa, 'alarm', { dur: 0.6, gain: 0.3 });
  }

  // ── 5 · Instead, your phone keeps one line open ─────────────────────────
  const P5 = [230, 900], H5 = [820, 640];
  {
    const st = cut(4), on = Wd('one', 4) - st, op = Wd('open', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 760], zoom: 0.1, note: 'phone left, push hub right; green line grows phone→hub on "one"; ONE LINE pill; ALWAYS OPEN on "open"',
      draw(lt, d, t) {
        bg('#DDEFF6'); floor();
        K.pushHub(H5[0], H5[1], 0.7, '???', t);
        K.openLine(P5[0] + 60, P5[1] - 120, H5[0] - 100, H5[1] + 20, eio(seg(lt, on - 0.15, on + 0.45)), t);
        K.phone(P5[0], P5[1], 0.5, sleepyHome(t, 1));
        if (lt > on) K.pill('ONE LINE', 330, 330, 66, C.yellow, C.ink, E(seg(lt, on, on + 0.25)));
        if (lt > op) K.pill('ALWAYS OPEN', 560, 1210, 56, GREEN, C.white, E(seg(lt, op, op + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + on - 0.15, 'slide', { dur: 0.6, gain: 0.3 }); cue(st + on, 'pop', { gain: 0.4 }); cue(st + op, 'pop', { gain: 0.4 });
  }

  // ── 6 · to Apple or Google, shared by all your apps ─────────────────────
  {
    const st = cut(5), ap = Wd('apple', 5) - st, go = Wd('google', 5) - st, sh = Wd('shared', 5) - st;
    const PH = [540, 1000], HB = [540, 470];
    add({ id: 'S06', at: st, cam: [540, 700], zoom: 0.08, note: 'hub top labelled APPLE / GOOGLE on "Apple"/"Google"; line down to phone; app tiles around the phone plug into the line on "shared"',
      draw(lt, d, t) {
        bg('#E9E2D2', C.bg);
        const lab = lt > go ? 'APPLE / GOOGLE' : lt > ap ? 'APPLE' : '???';
        K.openLine(PH[0], PH[1] - 140, HB[0], HB[1] + 200, 1, t);
        K.pushHub(HB[0], HB[1], 0.6, lab, t, lt > ap ? clamp(1 - (lt - ap) * 2) : 0);
        K.phone(PH[0], PH[1], 0.36, sleepyHome(t, 1));
        if (lt > sh) for (let k = 0; k < 6; k++) {
          const a = sh + k * 0.1, p = E(seg(lt, a, a + 0.25)); if (p <= 0) continue;
          const x = k < 3 ? 170 + (k % 3) * 0 : 910, y = 820 + (k % 3) * 150;
          ctx.save(); ctx.setLineDash([4, 18]); line([[x, y], [PH[0], PH[1] - 100]], 'rgba(26,26,30,0.35)', 8); ctx.restore();
          K.appTile(x, y, 1.1 * p, TILES[k]);
        }
        if (lt > sh) K.pill('SHARED BY ALL APPS', 540, 160, 52, C.yellow, C.ink, E(seg(lt, sh, sh + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ap, 'pop', { gain: 0.4 }); cue(st + go, 'pop', { gain: 0.4 }); for (let k = 0; k < 6; k++) cue(st + sh + k * 0.1, 'pop', { gain: 0.22 });
  }

  // ── 7 · When your friend texts you, the app's server ────────────────────
  {
    const st = cut(6), fr = Wd('friend', 6) - st, tx = Wd('texts', 6) - st, sv = Wd('server', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 720], zoom: 0.08, note: 'friend (hero) left with chat app; bubble sends on "texts"; envelope flies to chat-app server right; pill on "server"',
      draw(lt, d, t) {
        K.room();
        const sent = eo(seg(lt, tx, tx + 0.25));
        K.man({ x: 280, y: 1230, s: 0.85, arm: K.PHONE_ARM, holding: heldPhone(() => K.chatApp([['you up?', true, sent]], sent > 0 ? '' : 'you up?', t)), eyes: 'n', mouth: lt > tx ? 'grin' : 'smile', brow: 0.4, look: 0.7 });
        if (lt > fr) K.pill('FRIEND', 280, 220, 56, C.ink, C.white, E(seg(lt, fr, fr + 0.25)));
        K.server(830, 700, 0.55, t);
        if (lt > tx) { const u = eio(seg(lt, tx + 0.1, tx + 0.8)); if (u < 1) { const [x, y] = K.arcAt(380, 720, 760, 620, 220, u); K.envelope(x, y, 0.5, 0); } }
        if (lt > sv) K.pill("CHAT APP'S SERVER", 760, 1180, 46, BLUE, C.white, E(seg(lt, sv, sv + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + fr, 'pop', { gain: 0.3 }); cue(st + tx + 0.1, 'zip', { gain: 0.35 }); cue(st + sv, 'pop', { gain: 0.35 });
  }

  // ── 8 · hands it to Apple or Google with your phone's token ─────────────
  {
    const st = cut(7), hd = Wd('hands', 7) - st, tk = Wd('token', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 720], zoom: 0.1, note: 'server left, hub right; envelope arcs server→hub from "hands"; yellow TOKEN tag on envelope on "token"',
      draw(lt, d, t) {
        bg('#DDEFF6'); floor();
        K.server(230, 800, 0.45, t);
        K.pushHub(830, 760, 0.6, 'APPLE / GOOGLE', t, lt > hd + 0.9 ? clamp(1 - (lt - hd - 0.9) * 2) : 0);
        K.route(320, 640, 760, 560, 260, 0, eo(seg(lt, hd - 0.1, hd + 0.5)));
        const u = eio(seg(lt, hd, hd + 1.0)), [x, y] = K.arcAt(320, 640, 760, 560, 260, u);
        K.envelope(x, y - 20, 0.6, 0);
        if (lt > tk) K.pill('TOKEN: 7f3a…', x, y - 130, 44, C.yellow, C.ink, E(seg(lt, tk, tk + 0.25)));
        if (lt > tk) K.pill("YOUR PHONE'S ADDRESS", 540, 1220, 46, C.ink, C.white, E(seg(lt, tk + 0.2, tk + 0.45)));
      } });
    cue(st, 'whoosh'); cue(st + hd, 'slide', { dur: 1.0, gain: 0.3 }); cue(st + tk, 'pop', { gain: 0.45 });
  }

  // ── 9 · and they push it down that open line ────────────────────────────
  {
    const st = cut(8), pu = Wd('push', 8) - st, op = Wd('open', 8) - st;
    const HB = [540, 430], PH = [540, 1000];
    add({ id: 'S09', at: st, cam: [540, 720], zoom: 0.1, note: 'hub top, line down to locked phone; envelope zips down the line on "push"; phone buzzes + banner when it lands on "open"',
      draw(lt, d, t) {
        bg('#E9E2D2', C.bg);
        const y0 = HB[1] + 190, y1 = PH[1] - 150;
        K.openLine(PH[0], y1, HB[0], y0, 1, t);
        K.pushHub(HB[0], HB[1], 0.55, 'APPLE / GOOGLE', t);
        const u = eio(seg(lt, pu - 0.05, op)), land = op;
        const bz = lt > land ? clamp(1 - (lt - land) * 2.5) : 0;
        K.phone(PH[0] + buzz(t, bz), PH[1], 0.4, () => K.lockScreen(msg(eo(seg(lt, land, land + 0.3))), t));
        if (u > 0 && u < 1) K.envelope(PH[0], lerp(y0, y1, u), 0.5, 0);
        if (lt > pu) bigText('PUSH!', 840, 760, 96, C.yellow, -0.15, E(seg(lt, pu, pu + 0.2)));
        if (lt > land) K.shockLines(PH[0], PH[1], 230, bz);
      } });
    cue(st, 'whoosh'); cue(st + pu, 'zip', { gain: 0.4 }); cue(st + op, 'boing', { gain: 0.4 });
  }

  // ── 10 · Apple switched this on for iPhones in two thousand nine ───────
  {
    const st = cut(9), sw = Wd('switched', 9) - st, ip = Wd('iphones', 9) - st, yr = Wd('two', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 720], zoom: 0.08, note: 'phone rises left with banner; PUSH switch flips on "switched"; iPHONE OS 3 pill on "iPhones"; 2009 calendar drops on "two"',
      draw(lt, d, t) {
        bg('#E9E2D2', C.bg);
        const py = lerp(1700, 800, eob(seg(lt, 0, 0.4)));
        K.phone(330, py, 0.75, () => K.lockScreen(msg(1), t));
        K.vpnSwitch(800, 360, 0.8, eo(seg(lt, sw, sw + 0.25)), 'PUSH');
        if (lt > ip) K.pill('iPHONE OS 3', 330, 200, 56, C.ink, C.white, E(seg(lt, ip, ip + 0.25)));
        if (lt > yr) K.calendar(800, lerp(-600, 840, eob(seg(lt, yr, yr + 0.4))), 0.55, '09', '2009', 0.06);
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'slide', { dur: 0.35, gain: 0.3 }); cue(st + sw, 'pop', { gain: 0.4 }); cue(st + ip, 'pop', { gain: 0.35 }); cue(st + yr + 0.35, 'thud', { gain: 0.5 });
  }

  // ── 11 · But here's the twist ──────────────────────────────────────────
  {
    const st = cut(10), tw = Wd('twist', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 600], zoom: 0.14, note: 'room; hero with phone smirks; red warning + shock on "twist"',
      draw(lt, d, t) {
        K.room();
        const hit = lt > tw;
        K.man({ x: 450, y: 1180, s: 1.0, arm: K.PHONE_ARM, holding: heldPhone(() => K.lockScreen(msg(1), t)), eyes: hit ? 'wide' : 'n', mouth: hit ? 'o' : 'smirk', brow: hit ? 1 : 0.6, smirk: !hit, look: 0.4 });
        if (hit) { K.warning(820, 360, 0.8 * E(seg(lt, tw, tw + 0.25))); K.shockLines(450, 830, 150, clamp((lt - tw) * 4)); }
      } });
    cue(st, 'whoosh'); cue(st + tw, 'slam', { gain: 0.45 });
  }

  // ── 12 · the app never actually talks to your phone ────────────────────
  {
    const st = cut(11), nv = Wd('never', 11) - st, tk = Wd('talks', 11) - st, ph = Wd('phone', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 700], zoom: 0.1, note: 'chat app server left, phone right; dotted direct path; red X slams on "never"; NO DIRECT LINE pill on "talks"',
      draw(lt, d, t) {
        bg('#F6D9DC', C.bg); floor();
        K.server(230, 760, 0.5, t);
        K.pill('CHAT APP', 230, 1150, 46, BLUE, C.white, 1);
        K.phone(850, 780, 0.5, () => K.lockScreen([], t));
        K.route(330, 640, 760, 640, 160, 0, 1, 0.35);
        if (lt > nv) K.redX(545, 660, lerp(1.6, 0.85, eo(seg(lt, nv, nv + 0.2))), 1);
        if (lt > tk) K.pill('NO DIRECT LINE', 545, 300, 60, C.red, C.white, E(seg(lt, tk, tk + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + nv, 'slam', { gain: 0.45 }); cue(st + tk, 'pop', { gain: 0.35 });
  }

  // ── 13 · Apple or Google deliver every buzz ─────────────────────────────
  {
    const st = cut(12), go = Wd('google', 12) - st, dl = Wd('deliver', 12) - st, bz = Wd('buzz', 12) - st;
    const HB = [540, 430], PHS = [[200, 1020], [540, 1060], [880, 1020]];
    const notes = [['Sam', 'you up?', GREEN], ['Mom', 'call me', PINK], ['Shop', 'shipped!', ORANGE]];
    add({ id: 'S13', at: st, cam: [540, 720], zoom: 0.08, note: 'hub top glowing on "Google"; lines to three phones; envelopes zip down from "deliver"; banners + buzz on "buzz"',
      draw(lt, d, t) {
        bg('#DDEFF6');
        PHS.forEach(([x, y]) => K.openLine(x, y - 140, HB[0], HB[1] + 170, 1, t));
        K.pushHub(HB[0], HB[1], 0.5, 'APPLE / GOOGLE', t, lt > go ? 1 : 0);
        PHS.forEach(([x, y], k) => {
          const a = dl + k * 0.12, u = eio(seg(lt, a, bz)), land = bz + k * 0.05, b = lt > land ? clamp(1 - (lt - land) * 2.5) : 0;
          K.phone(x + buzz(t, b), y, 0.34, () => K.lockScreen([[...notes[k], eo(seg(lt, land, land + 0.3))]], t));
          if (u > 0 && u < 1) { const [ex, ey] = along([[HB[0], HB[1] + 170], [x, y - 140]], u); K.envelope(ex, ey, 0.4, 0); }
        });
        if (lt > bz) K.bell(880, 330, 0.7 * E(seg(lt, bz, bz + 0.25)), 1, 3, t);
      } });
    cue(st, 'whoosh'); cue(st + go, 'sparkle', { dur: 0.4, gain: 0.3 }); cue(st + dl, 'slide', { dur: 0.6, gain: 0.3 }); cue(st + bz, 'boing', { gain: 0.4 }); cue(st + bz + 0.1, 'pop', { gain: 0.3 });
  }

  // ── 14 · That ping isn't from the app, it's from a line that never hangs up ─
  {
    const st = cut(13), is = Wd("isn't", 13) - st, li = Wd('line', 13) - st, up = Wd('up', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 680], zoom: 0.06, note: 'room; hero to camera; sleeping app tile gets red X on "isn\'t"; finger wag; green line rises to hub top-right on "line"; wink + grin on "up"',
      draw(lt, d, t) {
        K.room();
        const lp = eio(seg(lt, li - 0.1, li + 0.5));
        K.openLine(900, 800, 885, 450, lp, t);
        K.pushHub(880, 330, 0.4 * E(seg(lt, li - 0.2, li + 0.1)), 'APPLE / GOOGLE', t);
        K.sleepyTile(250, 640, 1.6, GREEN, t, 1);
        if (lt > is) K.redX(250, 640, lerp(1.2, 0.6, eo(seg(lt, is, is + 0.2))), 1);
        const wag = lt > is ? Math.sin(lt * 11) * 0.35 : 0;
        K.man({ x: 540, y: 1220, s: 0.9, arm: K.armPose(K.ARM.down, K.ARM.point, eo(seg(lt, is, is + 0.3))), finger: lt > is ? wag : null,
          eyes: lt > up ? 'wink' : 'n', mouth: lt > up ? 'grin' : 'smirk', brow: 0.6, look: 0 });
        K.bell(900, 830, 0.45, 1, 1, t);
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'pop', { gain: 0.3 }); cue(st + is, 'pop', { gain: 0.3 }); cue(st + li - 0.1, 'slide', { dur: 0.5, gain: 0.3 }); cue(st + up, 'boing', { gain: 0.4 });
  }

  return { shots: S, cues: CUES };
}
