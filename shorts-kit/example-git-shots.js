// GIT vs GITHUB: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));   // E(0) can be a tiny positive float: keep hidden things hidden

const BLUE = '#3A7BD5', GREEN = '#5BAE6A';
function desk() { fillAll(C.bg); ctx.fillStyle = C.floor; ctx.fillRect(-300, 1100, W + 600, 900); }
function sky(t) {
  fillAll(C.sky);
  for (const [x, y, s] of [[160, 1080, 1], [880, 1150, 0.8]]) { const dx = Math.sin(t * 0.3 + x) * 14; ell(x + dx, y, 90 * s, 34 * s, C.white); ell(x + dx + 40 * s, y - 22 * s, 60 * s, 38 * s, C.white); }
}

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · HOOK: GIT pill vs GITHUB pill, "=" with "?" ────────────────────
  {
    const st = cut(0), g = Wd('git', 0) - st, gh = Wd('github', 0) - st, sm = Wd('same', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 760], zoom: 0.06, note: 'hero scratches head; GIT pill (laptop) left on "Git", GITHUB pill (cloud) right on "GitHub", = ? on "same"',
      draw(lt, d, t) {
        desk();
        K.man({ x: 540, y: 1260, s: 1.15, arm: K.ARM.point, finger: -0.3, eyes: 'n', brow: lt > sm ? 0.9 : 0.4, mouth: lt > sm ? 'o' : 'flat', look: Math.sin(lt * 3) });
        const a = E(seg(lt, g, g + 0.3)), b = E(seg(lt, gh, gh + 0.3));
        if (a > 0) { K.laptop(230, 320, 0.46 * a, () => K.codeScreen(1, t)); K.pill('GIT', 230, 500, 56, C.ink, C.white, a); }
        if (b > 0) { K.cloud(850, 300, 0.55, C.white, b); K.pill('GITHUB', 850, 500, 56, C.ink, C.white, b); }
        if (lt > sm) { const p = E(seg(lt, sm, sm + 0.25)); bigText('=', 540, 400, 170, C.white, 0, p); bigText('?', 610, 300, 120, C.yellow, 0.2, p); }
      } });
    cue(st + g, 'pop', { gain: 0.5 }); cue(st + gh, 'pop', { gain: 0.5 }); cue(st + sm, 'boing', { gain: 0.45 });
  }

  // ── 2 · Not even close: red X over the "=" , finger wag ────────────────
  {
    const st = cut(1), cl = Wd('close', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 700], zoom: 0.12, note: 'close-up hero wags finger; red X slams over the = sign on "close"',
      draw(lt, d, t) {
        desk();
        K.man({ x: 540, y: 1300, s: 1.6, arm: K.ARM.point, finger: Math.sin(lt * 11) * 0.35, eyes: 'n', smirk: true, mouth: 'smirk', brow: 0.3 });
        bigText('=', 540, 330, 220, C.white, 0, 1);
        K.pill('GIT', 230, 330, 56, C.ink, C.white, 1); K.pill('GITHUB', 850, 330, 56, C.ink, C.white, 1);
        if (lt > cl - 0.1) K.redX(540, 330, lerp(0.9, 0.42, eo(seg(lt, cl - 0.1, cl + 0.1))), 1);
      } });
    cue(st, 'whoosh'); cue(st + cl - 0.05, 'slam', { gain: 0.8 });
  }

  // ── 3 · Git is a free tool on your computer ────────────────────────────
  {
    const st = cut(2), g = Wd('git', 2) - st, fr = Wd('free', 2) - st, lv = Wd('lives', 2) - st, cp = Wd('computer', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 760], zoom: 0.1, note: 'laptop on desk types code; GIT pill on "Git", FREE tag on "free", house roof pops on laptop on "lives", YOUR COMPUTER on "computer"',
      draw(lt, d, t) {
        desk();
        K.laptop(540, 780, 1.2, () => K.codeScreen(seg(lt, 0, 2.2), t));
        if (lt > g) K.pill('GIT', 540, 300, 80, C.yellow, C.ink, E(seg(lt, g, g + 0.25)));
        if (lt > fr) K.pill('FREE', 870, 470, 50, GREEN, C.white, E(seg(lt, fr, fr + 0.25)));
        if (lt > lv) K.roof(200, 470, 0.8 * E(seg(lt, lv, lv + 0.3)), C.red);
        if (lt > cp) K.pill('YOUR COMPUTER', 540, 1150, 52, C.ink, C.white, E(seg(lt, cp, cp + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + g, 'pop'); cue(st + fr, 'pop', { gain: 0.45 }); cue(st + lv, 'thud', { gain: 0.4 }); cue(st + cp, 'pop', { gain: 0.5 });
  }

  // ── 4 · every time you make a commit ───────────────────────────────────
  {
    const st = cut(3), cm = Wd('commit', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 760], zoom: 0.12, note: 'project folder; COMMIT button; finger taps it on "commit", ripple',
      draw(lt, d, t) {
        fillAll(C.bg);
        K.folder(540, 560, 1.4, C.yellow, 'MY PROJECT');
        const press = lt > cm && lt < cm + 0.18 ? 1 : 0;
        K.pill('COMMIT', 540, 1000 + press * 8, 76, press ? C.yellow : BLUE, press ? C.ink : C.white, 1);
        K.ripple(540, 1000, seg(lt, cm, cm + 0.5));
        const fin = lt < cm ? eo(seg(lt, 0.1, cm)) : 1 - eio(seg(lt, cm + 0.2, cm + 0.7));
        K.tapFinger(560, 1010, fin, press);
      } });
    cue(st, 'whoosh'); cue(st + cm, 'pop', { gain: 0.7 });
  }

  // ── 5 · it takes a snapshot of your whole project ──────────────────────
  {
    const st = cut(4), sn = Wd('snapshot', 4) - st, pj = Wd('project', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 760], zoom: 0.1, note: 'flash on "snapshot"; polaroid v3 drops onto the timeline next to v1, v2; timeline dot pops on "project"',
      draw(lt, d, t) {
        fillAll(C.bg);
        K.flash(540, 600, seg(lt, sn, sn + 0.45));
        K.snapshot(250, 560, 0.75, -0.12, 1); K.snapshot(540, 560, 0.75, 0.06, 2);
        const p = E(seg(lt, sn, sn + 0.4));
        if (p > 0) K.snapshot(830, lerp(300, 560, p), 0.75 * lerp(1.4, 1, p), lerp(0.4, -0.05, p), 3);
        K.commitLine(250, 830, 940, 3, lt > pj ? 3 : 2 + seg(lt, sn + 0.3, sn + 0.5) * 0.99);
        if (lt > pj) K.pill('SNAPSHOT', 540, 1120, 60, C.yellow, C.ink, E(seg(lt, pj, pj + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sn, 'sparkle', { dur: 0.5, gain: 0.5 }); cue(st + sn + 0.35, 'thud', { gain: 0.5 }); cue(st + pj, 'pop');
  }

  // ── 6 · Broke something? Jump back in time ─────────────────────────────
  {
    const st = cut(5), jp = Wd('jump', 5) - st, tm = Wd('time', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.1, note: 'laptop shows red error + warning; on "jump" rewind arrow spins, marker slides back to v2; code turns fine; BACK IN TIME on "time"',
      draw(lt, d, t) {
        fillAll(C.bg);
        const fixed = lt > jp + 0.5;
        K.laptop(540, 560, 0.9, () => { if (!fixed) { ctx.fillStyle = '#5A1F2B'; ctx.fillRect(-300, -180, 600, 360); K.codeScreen(1, t, 2); K.warning(0, 0, 0.8 + Math.sin(lt * 12) * 0.05); } else K.codeScreen(1, t, 1); });
        K.commitLine(250, 830, 1000, 3, 3, 1, eo(seg(lt, jp + 0.3, jp + 0.6)));
        const mx = lerp(830, 540, eio(seg(lt, jp, jp + 0.6)));
        ctx.beginPath(); ctx.moveTo(mx, 930); ctx.lineTo(mx - 30, 880); ctx.lineTo(mx + 30, 880); ctx.closePath(); ctx.fillStyle = C.red; ctx.fill();
        if (lt > jp) K.rewind(880, 230, 0.7, eo(seg(lt, jp, jp + 0.4)), -lt * 4);
        if (fixed) K.check(540, 560, 0.8 * E(seg(lt, jp + 0.5, jp + 0.75)));
        if (lt > tm) K.pill('BACK IN TIME', 540, 1140, 58, C.yellow, C.ink, E(seg(lt, tm, tm + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'alarm', { dur: 0.6, gain: 0.3 }); cue(st + jp, 'zip'); cue(st + jp + 0.5, 'sparkle', { dur: 0.5, gain: 0.45 }); cue(st + tm, 'pop', { gain: 0.5 });
  }

  // ── 7 · it even works with no internet ─────────────────────────────────
  {
    const st = cut(6), wk = Wd('works', 6) - st, it = Wd('internet', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 760], zoom: 0.1, note: 'laptop keeps typing; Wi-Fi icon gets red slash on "internet"; green check on "works"',
      draw(lt, d, t) {
        desk();
        K.laptop(540, 860, 1.1, () => K.codeScreen((lt * 0.5) % 1, t, 3));
        const ws = E(seg(lt, 0.05, 0.35));
        K.wifiIcon(300, 420, 1.1 * ws, 0, C.yellow);
        if (lt > it - 0.1) K.slash(300, 380, 0.75, clamp((lt - it + 0.1) * 6));
        if (lt > wk) K.check(800, 380, 0.9 * E(seg(lt, wk, wk + 0.3)));
      } });
    cue(st, 'whoosh'); cue(st + wk, 'pop', { gain: 0.5 }); cue(st + it, 'slam', { gain: 0.55 });
  }

  // ── 8 · GitHub is a website ────────────────────────────────────────────
  {
    const st = cut(7), gh = Wd('github', 7) - st, ws = Wd('website', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 720], zoom: 0.14, note: 'big browser window slides up; GITHUB pill on "GitHub", WEBSITE tag on "website"',
      draw(lt, d, t) {
        fillAll(C.bg);
        K.webPage(540, lerp(1100, 740, E(seg(lt, 0, 0.35))), 2.3, BLUE);
        if (lt > gh) K.pill('GITHUB', 540, 300, 84, C.yellow, C.ink, E(seg(lt, gh, gh + 0.25)));
        if (lt > ws) K.pill('WEBSITE', 780, 1150, 52, C.ink, C.white, E(seg(lt, ws, ws + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + gh, 'pop'); cue(st + ws, 'pop', { gain: 0.45 });
  }

  // ── 9 · a giant online home where you upload projects ──────────────────
  {
    const st = cut(8), on = Wd('online', 8) - st, hm = Wd('home', 8) - st, up = Wd('upload', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 760], zoom: 0.08, note: 'cloud grows on "online", roof on it on "home"; laptop below, folders fly up into the cloud on "upload"',
      draw(lt, d, t) {
        sky(t);
        K.cloud(540, 430, 0.95, C.white, E(seg(lt, on - 0.2, on + 0.2)));
        if (lt > hm) K.roof(540, 350, 0.8 * E(seg(lt, hm, hm + 0.3)), C.red);
        K.laptop(540, 1060, 0.6, () => K.codeScreen(1, t, 1));
        if (lt > up) {
          K.upArrow(860, 830, E(seg(lt, up, up + 0.25)) * 0.8);
          for (let k = 0; k < 3; k++) { const u = eio(seg(lt, up + k * 0.2, up + k * 0.2 + 0.8)); if (u > 0 && u < 1) K.folder(540 + (k - 1) * 70, lerp(980, 520, u), 0.45 * (1 - u * 0.4), [C.yellow, C.pink, GREEN][k], null, Math.sin(k + lt * 5) * 0.15); }
        }
      } });
    cue(st, 'whoosh'); cue(st + on, 'pop', { gain: 0.45 }); cue(st + hm, 'thud', { gain: 0.4 }); cue(st + up, 'slide', { dur: 1.0, gain: 0.45 });
  }

  // ── 10 · so your team can grab the code and work together ──────────────
  {
    const st = cut(9), tm = Wd('team', 9) - st, gb = Wd('grab', 9) - st, tg = Wd('together', 9) - st;
    const seats = [[180, 980, BLUE], [420, 1060, C.pink], [660, 1060, GREEN], [900, 980, '#C8734A']];
    add({ id: 'S10', at: st, cam: [540, 760], zoom: 0.08, note: 'cloud top; 4 teammates pop in at the cut; folders drop to each on "grab"; dotted links on "together"',
      draw(lt, d, t) {
        sky(t);
        K.cloud(540, 370, 0.8, C.white);
        seats.forEach(([x, y, c], k) => K.buddy(x, y, 0.95 * E(seg(lt, 0.1 + k * 0.1, 0.4 + k * 0.1)), c, k % 2 ? '#C8734A' : C.hair, 1, t + k));
        if (lt > gb) seats.forEach(([x, y], k) => { const u = eio(seg(lt, gb + k * 0.08, gb + k * 0.08 + 0.6)); if (u < 1) K.folder(lerp(540, x, u), lerp(470, y - 190, u), 0.35, C.yellow); });
        if (lt > tg) { const p = eo(seg(lt, tg, tg + 0.4)); for (let k = 0; k < 3; k++) K.route(seats[k][0], seats[k][1] - 260, seats[k + 1][0], seats[k + 1][1] - 260, 80, 0, p, 0.5); }
      } });
    cue(st, 'whoosh'); cue(st + tm, 'pop', { gain: 0.5 }); cue(st + gb, 'slide', { dur: 0.6, gain: 0.4 }); cue(st + tg, 'sparkle', { dur: 0.6, gain: 0.4 });
  }

  // ── 11 · The wild part? Linus Torvalds built Git ───────────────────────
  {
    const st = cut(10), wd = Wd('wild', 10) - st, lt0 = Wd('linus', 10) - st, bt = Wd('built', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.1, note: 'hero shocked on "wild"; then laptop typing fast with LINUS TORVALDS pill and commit dots growing on "built"',
      draw(lt, d, t) {
        if (lt < lt0 - 0.05) {
          K.room();
          K.man({ x: 540, y: 1300, s: 1.6, eyes: 'wide', mouth: 'o', brow: 1, arm: K.ARM.mouth });
          K.shockLines(540, 1300 - 350 * 1.6, 230, eo(seg(lt, wd, wd + 0.2)));
        } else {
          desk();
          K.laptop(540, 820, 1.1, () => K.codeScreen(seg(lt, lt0, lt0 + 1.4), t, 4));
          K.pill('LINUS TORVALDS', 540, 330, 66, C.yellow, C.ink, E(seg(lt, lt0, lt0 + 0.25)));
          if (lt > bt) K.commitLine(250, 830, 1190, 5, seg(lt, bt, bt + 0.9) * 5);
        }
      } });
    cue(st, 'whoosh'); cue(st + wd, 'boing', { gain: 0.45 }); cue(st + lt0 - 0.05, 'whoosh'); cue(st + lt0, 'pop'); cue(st + bt, 'sparkle', { dur: 0.8, gain: 0.4 });
  }

  // ── 12 · in about ten days, back in 2005 ───────────────────────────────
  {
    const st = cut(11), tn = Wd('ten', 11) - st, tw = Wd('two', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 760], zoom: 0.14, note: 'calendar drops on "ten" (10 DAYS); 2005 pill slams on "two"',
      draw(lt) {
        fillAll(C.bg);
        const p = E(seg(lt, 0, Math.max(0.3, tn)));
        K.calendar(540, lerp(-400, 700, p), 0.95, '10', 'DAYS', lerp(-0.2, 0.03, p));
        if (lt > tn) K.burst(540, 700, 3, clamp(1 - (lt - tn) * 2));
        if (lt > tw) K.pill('2005', 540, 1160, 80, C.yellow, C.ink, E(seg(lt, tw, tw + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + tn, 'thud', { gain: 0.6 }); cue(st + tw, 'slam', { gain: 0.6 });
  }

  // ── 13 · Microsoft bought GitHub for $7.5 billion ──────────────────────
  {
    const st = cut(12), ms = Wd('microsoft', 12) - st, bg = Wd('bought', 12) - st, sv = Wd('seven', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 760], zoom: 0.12, note: 'GITHUB cloud; MICROSOFT pill on "Microsoft"; cash stacks pile up on "bought"; $7.5 BILLION slams on "seven"',
      draw(lt, d, t) {
        fillAll(C.bg);
        K.cloud(540, 430, 0.7, C.white); K.pill('GITHUB', 540, 470, 60, C.ink, C.white, 1);
        if (lt > ms) K.pill('MICROSOFT', 540, 230, 60, BLUE, C.white, E(seg(lt, ms, ms + 0.25)));
        for (let k = 0; k < 3; k++) { const p = E(seg(lt, bg + k * 0.15, bg + k * 0.15 + 0.3)); if (p > 0) K.cash(260 + k * 280, lerp(-200, 1000, p), 0.75, 4, (k - 1) * 0.08); }
        if (lt > sv) { K.burst(540, 760, 3, clamp(1 - (lt - sv) * 2)); bigText('$7.5 BILLION', 540, 760, 120, C.yellow, -0.05, E(seg(lt, sv, sv + 0.3))); }
      } });
    cue(st, 'whoosh'); cue(st + ms, 'pop'); cue(st + bg, 'thud', { gain: 0.5 }); cue(st + bg + 0.3, 'thud', { gain: 0.4 }); cue(st + sv, 'slam', { gain: 0.8 });
  }

  // ── 14 · So Git saves your code ────────────────────────────────────────
  {
    const st = cut(13), sv = Wd('saves', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.1, note: 'laptop with GIT pill; on "saves" commit dots pop and a check',
      draw(lt, d, t) {
        desk();
        K.laptop(540, 760, 1.05, () => K.codeScreen(1, t, 1));
        K.pill('GIT', 540, 330, 80, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        K.commitLine(270, 810, 1170, 4, 1 + seg(lt, sv, sv + 0.6) * 3);
        if (lt > sv) K.pill('SAVES', 860, 470, 52, C.ink, C.white, E(seg(lt, sv, sv + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sv, 'pop');
  }

  // ── 15 · and GitHub shares it with the world (loop) ────────────────────
  {
    const st = cut(14), gh = Wd('github', 14) - st, sh = Wd('shares', 14) - st, wl = Wd('world', 14) - st;
    add({ id: 'S15', at: st, cam: [540, 760], zoom: 0.06, note: 'hero front, globe behind; folders fly out from cloud to the globe on "shares"; wink + grin on "world"',
      draw(lt, d, t) {
        fillAll(C.bg); ctx.fillStyle = C.floor; ctx.fillRect(-300, 1560, W + 600, 700);
        K.globe(820, 420, 1.6, t);
        K.cloud(250, 360, 0.42, C.white); K.pill('GITHUB', 250, 380, 40, C.ink, C.white, E(seg(lt, gh, gh + 0.25)));
        if (lt > sh) for (let k = 0; k < 3; k++) { const u = eio(seg(lt, sh + k * 0.18, sh + k * 0.18 + 0.7)); if (u > 0 && u < 1) { const [x, y] = K.arcAt(330, 300, 760, 360, 160, u); K.folder(x, y, 0.3, [C.yellow, C.pink, GREEN][k]); } }
        K.man({ x: 540, y: 1300, s: 1.2, arm: K.ARM.point, finger: -0.2, eyes: lt > wl ? 'wink' : 'n', mouth: lt > wl ? 'grin' : 'smirk', smirk: true, brow: 0.5 });
        if (lt > wl) K.pill('THE WORLD', 820, 680, 50, C.yellow, C.ink, E(seg(lt, wl, wl + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sh, 'slide', { dur: 0.9, gain: 0.4 }); cue(st + wl, 'boing', { gain: 0.45 });
  }

  return { shots: S, cues: CUES };
}
