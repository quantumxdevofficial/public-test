// WHAT ACTUALLY IS THE CLOUD?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));   // E(0) can be a tiny positive float: keep hidden things hidden

function sky(t, floorY = 1140) {
  fillAll(C.sky);
  for (const [x, y, s] of [[160, 300, 1], [880, 240, 0.8]]) { const dx = Math.sin(t * 0.3 + x) * 14; ell(x + dx, y, 90 * s, 34 * s, C.white); ell(x + dx + 40 * s, y - 22 * s, 60 * s, 38 * s, C.white); }
  if (floorY) { ctx.fillStyle = C.floor; ctx.fillRect(-300, floorY, W + 600, 1200); }
}
const heldPhone = (screen) => (x, y) => K.phone(x + 12, y - 70, 0.3, screen);

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · HOOK: hero with phone, a big cloud above, CLOUD? ───────────────
  {
    const st = cut(0), cl = Wd('cloud', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 760], zoom: 0.06, note: 'room, hero holds phone and looks up; cloud drifts in; ? burst on "cloud"',
      draw(lt, d, t) {
        K.room();
        const hit = lt > cl;
        K.cloud(lerp(1400, 760, eo(seg(lt, 0, 0.7))), 460 + Math.sin(t * 2) * 10, 0.75, C.white);
        K.man({ x: 400, y: 1200, s: 1.3, arm: K.PHONE_ARM, holding: heldPhone(K.homeScreen), eyes: hit ? 'wide' : 'n', mouth: hit ? 'o' : 'flat', brow: hit ? 1 : 0.4, look: 0.8 });
        if (hit) { K.burst(760, 460, 1.4, clamp((lt - cl) * 4)); bigText('?', 760, 460, 170, C.yellow, 0.12, E(seg(lt, cl, cl + 0.25))); }
        if (hit) K.pill('THE CLOUD?', 540, 200, 70, C.yellow, C.ink, E(seg(lt, cl, cl + 0.25)));
      } });
    cue(st + 0.1, 'slide', { dur: 0.6, gain: 0.3 }); cue(st + cl, 'pop'); cue(st + cl + 0.05, 'boing', { gain: 0.4 });
  }

  // ── 2 · back up a photo from your phone ────────────────────────────────
  {
    const st = cut(1), bk = Wd('back', 1) - st, ph = Wd('photo', 1) - st, pn = Wd('phone', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 700], zoom: 0.1, note: 'phone close-up with gallery; backup bar fills from "back"; PHOTO tag on "photo"',
      draw(lt, d, t) {
        fillAll(C.sky); circle(540, 760, 620, '#CFE8F3');
        const p = seg(lt, bk, d - 0.1);
        K.phone(540, 740, 1.3, () => K.galleryScreen(p, p >= 1));
        if (lt > ph) K.pill('PHOTO', 860, 520, 56, C.yellow, C.ink, E(seg(lt, ph, ph + 0.25)));
        if (lt > pn) K.pill('YOUR PHONE', 540, 1150, 52, C.ink, C.white, E(seg(lt, pn, pn + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + bk, 'slide', { dur: 1.2, gain: 0.3 }); cue(st + ph, 'pop', { gain: 0.45 }); cue(st + pn, 'pop', { gain: 0.4 });
  }

  // ── 3 · it doesn't float up into the sky ───────────────────────────────
  {
    const st = cut(2), dn = Wd('doesn', 2) - st, sk = Wd('sky', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 700], zoom: 0.08, note: 'photo floats up from phone toward a cloud; red X slams on "doesn\'t"; NOT THE SKY on "sky"',
      draw(lt, d, t) {
        sky(t);
        K.cloud(540, 300, 0.7, C.white);
        K.phone(540, 1000, 0.5, () => K.galleryScreen(1, true));
        const up = eio(seg(lt, 0, dn + 0.3));
        const py = lerp(900, 620, up) + Math.sin(lt * 3) * 10;
        K.photo(540 + Math.sin(lt * 2) * 30, py, 0.9, Math.sin(lt * 2.5) * 0.12);
        if (lt > dn) K.redX(540, py, lerp(1.6, 0.8, eo(seg(lt, dn, dn + 0.2))), 1);
        if (lt > sk) K.pill('NOT THE SKY', 540, 1170, 56, C.red, C.white, E(seg(lt, sk, sk + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'sparkle', { dur: 0.6, gain: 0.3 }); cue(st + dn, 'slam', { gain: 0.6 }); cue(st + sk, 'pop', { gain: 0.4 });
  }

  // ── 4 · zips across the internet to a giant building ───────────────────
  {
    const st = cut(3), zp = Wd('zips', 3) - st, gi = Wd('giant', 3) - st, bd = Wd('building', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 760], zoom: 0.08, note: 'phone left; photo zips along dotted route on "zips"; data center rises on "giant"; BUILDING pill',
      draw(lt, d, t) {
        sky(t);
        K.phone(170, 900, 0.5, () => K.galleryScreen(1, true));
        const rise = E(seg(lt, gi - 0.15, gi + 0.3));
        if (rise > 0) { ctx.save(); ctx.translate(720, 1140); ctx.scale(1, rise); K.dataCenter(0, -230 * 0.75, 0.75, t); ctx.restore(); }
        const u = eio(seg(lt, zp, bd + 0.1));
        K.route(250, 700, 700, 760, 380, 0, u);
        if (u > 0 && u < 1) { const [x, y] = K.arcAt(250, 700, 700, 760, 380, u); K.photo(x, y, 0.5, Math.sin(lt * 9) * 0.15); K.speedLines(x - 90, y, 0.6); }
        if (lt > zp && lt < bd) K.pill('INTERNET', 470, 300, 46, C.ink, C.white, E(seg(lt, zp, zp + 0.25)));
        if (lt > bd) K.pill('GIANT BUILDING', 720, 300, 56, C.yellow, C.ink, E(seg(lt, bd, bd + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + zp, 'zip'); cue(st + gi - 0.1, 'thud', { gain: 0.55 }); cue(st + bd, 'pop', { gain: 0.45 });
  }

  // ── 5 · called a data center ───────────────────────────────────────────
  {
    const st = cut(4), dt = Wd('data', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 800], zoom: 0.18, note: 'big data center, windows blink; DATA CENTER pill + burst on "data"',
      draw(lt, d, t) {
        sky(t, 1180);
        K.dataCenter(540, 950, 1.25, t, lt > dt ? 1 : 0);
        if (lt > dt) { K.burst(540, 300, 3, clamp(1 - (lt - dt) * 2)); K.pill('DATA CENTER', 540, 300, 90, C.yellow, C.ink, E(seg(lt, dt, dt + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + dt, 'sparkle', { dur: 0.5, gain: 0.45 }); cue(st + dt + 0.05, 'pop');
  }

  // ── 6 · thousands of computers called servers ──────────────────────────
  {
    const st = cut(5), th = Wd('thousands', 5) - st, sv = Wd('servers', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.12, note: 'inside: grid of server racks lights up in a wave from "thousands"; SERVERS pill on "servers"',
      draw(lt, d, t) {
        fillAll(C.pants);
        const wave = lt > th ? (lt - th) * 900 : -1;
        K.serverGrid(110, 330, 8, 6, 123, 150, 0.95, t, (k, c, r) => (Math.hypot(c * 123 - 430, r * 150 - 380) < wave ? 1 : 0));
        if (lt > th && lt < sv) K.pill('THOUSANDS', 540, 220, 70, C.white, C.ink, E(seg(lt, th, th + 0.25)));
        if (lt > sv) K.pill('SERVERS', 540, 220, 84, C.yellow, C.ink, E(seg(lt, sv, sv + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + th, 'sparkle', { dur: 1.0, gain: 0.35 }); cue(st + sv, 'pop');
  }

  // ── 7 · copied to more than one building ───────────────────────────────
  const DC = [[540, 600, 0.5], [230, 1000, 0.36], [850, 1000, 0.36]];
  function threeDC(t, dark = 0) {
    sky(t, 1160);
    DC.forEach(([x, y, s], k) => { K.dataCenter(x, y, s, t, 1); if (k === 2) K.darken(x, y, s, dark); });
  }
  {
    const st = cut(6), cp = Wd('copied', 6) - st, on = Wd('one', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 760], zoom: 0.08, note: 'main data center; on "copied" two photo copies arc to two more buildings; checks; MORE THAN ONE pill',
      draw(lt, d, t) {
        threeDC(t);
        K.photo(DC[0][0], DC[0][1] - 230, 0.55, 0);
        for (let k = 1; k < 3; k++) {
          const u = eio(seg(lt, cp + (k - 1) * 0.2, cp + (k - 1) * 0.2 + 0.6));
          if (u <= 0) continue;
          const [x, y] = K.arcAt(DC[0][0], DC[0][1] - 230, DC[k][0], DC[k][1] - 200, 160, u);
          K.photo(x, y, 0.45, 0);
          if (u >= 1) K.check(DC[k][0] + 120, DC[k][1] - 230, 0.35 * E(seg(lt, cp + (k - 1) * 0.2 + 0.6, cp + (k - 1) * 0.2 + 0.85)));
        }
        if (lt > on) K.pill('MORE THAN ONE', 540, 240, 60, C.yellow, C.ink, E(seg(lt, on, on + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + cp, 'slide', { dur: 0.8, gain: 0.4 }); cue(st + cp + 0.6, 'pop', { gain: 0.35 }); cue(st + cp + 0.8, 'pop', { gain: 0.35 }); cue(st + on, 'pop', { gain: 0.45 });
  }

  // ── 8 · if one goes down, your photo survives ──────────────────────────
  {
    const st = cut(7), dw = Wd('down', 7) - st, sv = Wd('survives', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 760], zoom: 0.1, note: 'three buildings with photos; right one goes dark + warning on "down"; check + PHOTO SAFE on "survives"',
      draw(lt, d, t) {
        const dark = eo(seg(lt, dw - 0.05, dw + 0.25));
        const sh = lt > dw ? Math.sin(lt * 50) * 10 * Math.max(0, 1 - (lt - dw) * 2) : 0;
        ctx.save(); ctx.translate(sh, 0); threeDC(t, dark); ctx.restore();
        K.photo(DC[0][0], DC[0][1] - 230, 0.55, 0); K.photo(DC[1][0], DC[1][1] - 200, 0.45, 0);
        if (dark < 0.5) K.photo(DC[2][0], DC[2][1] - 200, 0.45, 0);
        if (lt > dw) { K.warning(DC[2][0], DC[2][1] - 20, 0.6); }
        if (lt > dw && lt < sv) K.pill('OFFLINE', DC[2][0], DC[2][1] - 230, 44, C.red, C.white, E(seg(lt, dw, dw + 0.25)));
        if (lt > sv) { K.check(DC[0][0] + 160, DC[0][1] - 260, 0.45 * E(seg(lt, sv, sv + 0.25))); K.pill('PHOTO SAFE', 540, 240, 64, C.yellow, C.ink, E(seg(lt, sv, sv + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + dw, 'alarm', { dur: 0.5, gain: 0.3 }); cue(st + dw + 0.03, 'thud', { gain: 0.5 }); cue(st + sv, 'sparkle', { dur: 0.5, gain: 0.45 });
  }

  // ── 9 · just someone else's computer ───────────────────────────────────
  {
    const st = cut(8), rl = Wd('really', 8) - st, el = Wd('else', 8) - st, cm = Wd('computer', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 760], zoom: 0.1, note: 'big cloud; on "really" it pops away to reveal a server; on "else\'s" a buddy pops beside it; SOMEONE ELSE\'S COMPUTER pill',
      draw(lt, d, t) {
        sky(t, 1150);
        const gone = eio(seg(lt, rl - 0.05, rl + 0.3));
        if (gone > 0) K.server(540, 860, 0.95 * E(seg(lt, rl, rl + 0.35)), t);
        if (lt > el) { const bp = E(seg(lt, el - 0.05, el + 0.25)); K.buddy(870, 820, 0.95 * bp, '#5BAE6A', '#C8734A'); K.laptop(870, 900, 0.32, () => K.codeScreen(1, t, 3), bp); }
        if (gone < 1) K.cloud(540, 820, 1.1, C.white, 1 + gone * 0.4);
        if (gone > 0 && gone < 1) K.burst(540, 820, 5, 1 - gone);
        if (lt > cm) K.pill("SOMEONE ELSE'S COMPUTER", 540, 260, 50, C.yellow, C.ink, E(seg(lt, cm, cm + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + rl, 'pop', { gain: 0.6 }); cue(st + el, 'boing', { gain: 0.4 }); cue(st + cm, 'pop', { gain: 0.5 });
  }

  // ── 10a · And the name? ────────────────────────────────────────────────
  {
    const st = cut(9), nm = Wd('name', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 760], zoom: 0.12, note: 'hero close, brow up, smirk; WHY "CLOUD"? pill on "name"',
      draw(lt) {
        K.room();
        K.man({ x: 540, y: 1300, s: 1.5, arm: K.ARM.point, finger: -0.2, brow: 1, mouth: 'smirk', smirk: true });
        if (lt > nm) K.pill('WHY "CLOUD"?', 540, 230, 76, C.yellow, C.ink, E(seg(lt, nm, nm + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + nm, 'pop', { gain: 0.5 });
  }
  // ── 10b · engineers used to draw the internet ──────────────────────────
  const BOXES = [[260, 520, 'PC'], [820, 520, 'PC'], [260, 980, 'PC'], [820, 980, 'PC']];
  function board(cloudP, wob = 0, label = 1) {
    fillAll(C.bg);
    K.whiteboard(540, 750, 940, 820);
    for (const [x, y, lb] of BOXES) {
      K.diagramBox(x, y, 0.85, lb);
      if (cloudP >= 1) line([[x + (x < 540 ? 70 : -70), y + (y < 750 ? 40 : -40)], [lerp(x, 540, 0.45), lerp(y, 750, 0.45)]], '#3A7BD5', 9);
    }
    K.markerCloud(540, 760, 0.85, cloudP, '#3A7BD5', wob);
    if (cloudP >= 1 && label > 0) { ctx.save(); ctx.globalAlpha = label; ctx.fillStyle = '#3A7BD5'; ctx.font = '900 46px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('INTERNET', 540, 770); ctx.restore(); }
  }
  {
    const st = Wd('engineers', 9) - 0.08, dr = Wd('draw', 9) - st, it = Wd('internet', 9) - st;
    add({ id: 'S10b', at: st, cam: [540, 760], zoom: 0.08, note: 'whiteboard network diagram with 4 PC boxes; marker draws a cloud from "draw", INTERNET written on "internet"',
      draw(lt, d, t) {
        const p = seg(lt, dr, it + 0.2);
        board(p, 0, E(seg(lt, it + 0.2, it + 0.4)));
        if (lt < dr + 0.1) K.pill('ENGINEERS', 540, 240, 60, C.ink, C.white, E(seg(lt, 0, 0.25)));
        if (p > 0 && p < 1) {
          const a = Math.PI * (1 + p * 1.6), mx = 540 + Math.cos(a) * 170, my = 760 + Math.sin(a) * 95;
          K.marker(mx, my);
        }
      } });
    cue(st, 'whoosh'); cue(st + dr, 'slide', { dur: it - dr + 0.2, gain: 0.25 }); cue(st + it + 0.25, 'pop', { gain: 0.4 });
  }

  // ── 11 · as a fluffy cloud on their diagrams ───────────────────────────
  {
    const st = cut(10), fl = Wd('fluffy', 10) - st, dg = Wd('diagrams', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.14, note: 'same board; cloud wobbles on "fluffy" with a burst; NETWORK DIAGRAMS pill on "diagrams"',
      draw(lt, d, t) {
        const wob = lt > fl ? Math.sin((lt - fl) * 18) * 0.08 * Math.max(0, 1 - (lt - fl) * 1.5) : 0;
        board(1, wob, 1);
        if (lt > fl) K.burst(540, 760, 4.5, clamp(1 - (lt - fl) * 2));
        if (lt > dg) K.pill('NETWORK DIAGRAMS', 540, 240, 58, C.yellow, C.ink, E(seg(lt, dg, dg + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + fl, 'boing', { gain: 0.45 }); cue(st + dg, 'pop', { gain: 0.5 });
  }

  // ── 12 · twist: data crossing oceans ───────────────────────────────────
  {
    const st = cut(11), tw = Wd('twist', 11) - st, cr = Wd('crossing', 11) - st, oc = Wd('oceans', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 760], zoom: 0.1, note: 'big globe; TWIST pill (red) on "twist"; a data pulse arcs across the ocean from "crossing"; ACROSS OCEANS pill',
      draw(lt, d, t) {
        fillAll(C.bg);
        K.globe(540, 700, 3.0, t * 0.4);
        if (lt > tw) K.pill('TWIST', 540, 240, 80, C.red, C.white, E(seg(lt, tw, tw + 0.25)));
        const u = eio(seg(lt, cr - 0.1, oc + 0.4));
        K.route(280, 600, 800, 800, 220, 0, u, 0.6);
        if (u > 0 && u < 1) { const [x, y] = K.arcAt(280, 600, 800, 800, 220, u); K.pulse(x, y, 24); }
        if (lt > oc) K.pill('ACROSS OCEANS', 540, 1160, 56, C.ink, C.white, E(seg(lt, oc, oc + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + tw, 'slam', { gain: 0.55 }); cue(st + cr, 'slide', { dur: 0.9, gain: 0.35 }); cue(st + oc, 'pop', { gain: 0.45 });
  }

  // ── 13 · travels through cables on the sea floor ───────────────────────
  {
    const st = cut(12), tr = Wd('travels', 12) - st, cb = Wd('cables', 12) - st, fl = Wd('floor', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 820], zoom: 0.1, note: 'camera sinks underwater; cable on the sand, yellow data pulses race along it from "travels"; CABLES pill, SEA FLOOR pill',
      draw(lt, d, t) {
        const sink = eio(seg(lt, 0, 0.6));
        ctx.save(); ctx.translate(0, lerp(500, 0, sink));
        K.underwater(t, 160, 1080);
        K.fish(lerp(-150, 1250, (lt * 0.18) % 1), 520, 0.8, 1, '#F29A3A', t);
        K.fish(lerp(1250, -150, (lt * 0.14 + 0.4) % 1), 760, 0.6, -1, C.pink, t);
        K.seaCable(-300, 1380, 1060, 1);
        if (lt > tr) for (let k = 0; k < 5; k++) { const x = -300 + (((lt - tr) * 900 + k * 340) % 1700); K.pulse(x, K.seaCableY(x, 1060), 20); }
        ctx.restore();
        if (lt > cb && lt < fl) K.pill('CABLES', 540, 330, 80, C.yellow, C.ink, E(seg(lt, cb, cb + 0.25)));
        if (lt > fl) K.pill('ON THE SEA FLOOR', 540, 330, 64, C.yellow, C.ink, E(seg(lt, fl, fl + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'bubbles', { dur: 0.8, gain: 0.35 }); cue(st + tr, 'zip', { gain: 0.5 }); cue(st + cb, 'pop', { gain: 0.45 }); cue(st + fl, 'pop', { gain: 0.45 });
  }

  // ── 14 · the cloud lives on the ground, and under the sea (loop) ───────
  {
    const st = cut(13), gr = Wd('ground', 13) - st, un = Wd('under', 13) - st, se = Wd('sea', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.06, note: 'hero on land beside a small data center, sea below with the cable; DC pops on "ground"; pulses on "under"; wink + grin on "sea"',
      draw(lt, d, t) {
        fillAll(C.sky);
        K.cloud(820, 170, 0.36, C.white);
        K.underwater(t, 760, 1180);
        ctx.fillStyle = C.floor; ctx.fillRect(-300, 700, 1680, 64);
        ctx.fillStyle = '#5BAE6A'; ctx.fillRect(-300, 690, 1680, 22);
        const dc = E(seg(lt, gr - 0.1, gr + 0.25));
        if (dc > 0) K.dataCenter(790, 700 - 230 * 0.42 * dc, 0.42 * dc, t, 1);
        K.seaCable(-300, 1380, 1150, 1);
        if (lt > un) for (let k = 0; k < 4; k++) { const x = -300 + (((lt - un) * 800 + k * 420) % 1700); K.pulse(x, K.seaCableY(x, 1150), 18); }
        const ms = 0.55, mx = 280, my = 700 - 620 * ms;
        K.man({ x: mx, y: my, s: ms, arm: K.armPose(K.ARM.down, K.ARM.point, eo(seg(lt, gr - 0.1, gr + 0.15))), finger: -0.2, eyes: lt > se ? 'wink' : 'n', mouth: lt > se ? 'grin' : 'smirk', smirk: true, brow: 0.5 });
        if (lt > gr) K.pill('ON THE GROUND', 790, 360, 44, C.ink, C.white, E(seg(lt, gr, gr + 0.25)));
        if (lt > se) K.pill('UNDER THE SEA', 540, 960, 56, C.yellow, C.ink, E(seg(lt, se, se + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + gr, 'thud', { gain: 0.45 }); cue(st + un, 'bubbles', { dur: 0.6, gain: 0.3 }); cue(st + se, 'boing', { gain: 0.45 });
  }

  return { shots: S, cues: CUES };
}
