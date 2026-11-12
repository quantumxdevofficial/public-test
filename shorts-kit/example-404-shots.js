// WHAT DOES 404 ACTUALLY MEAN?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const GREEN = '#5BAE6A', BLUE = '#3A7BD5';
const disc = () => { fillAll(C.bg); circle(540, 740, 520, '#E4DCCB'); };
/** phone screen: a page (0) that flips to the 404 card (1) */
const linkScreen = (f) => () => {
  if (f < 0.5) { ctx.fillStyle = BLUE; ctx.fillRect(-166, -350, 332, 90); for (let i = 0; i < 6; i++) { rr(-130, -220 + i * 70, 260 - (i % 3) * 50, 24, 12); ctx.fillStyle = i === 2 ? BLUE : '#B9C6CF'; ctx.fill(); } }
  else { ctx.fillStyle = '#FBEFF0'; ctx.fillRect(-166, -350, 332, 700); K.errorCard(0, -20, 0.5); }
};
const heldPhone = (f) => (x, y) => K.phone(x + 12, y - 70, 0.3, linkScreen(f));

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1a · HOOK: hero taps a link ─────────────────────────────────────
  {
    const st = cut(0), ck = Wd('clicked', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 760], zoom: 0.1, note: 'hero close-up holding phone, taps a link (finger + ripple on "clicked")',
      draw(lt, d, t) {
        K.room();
        K.man({ x: 540, y: 1300, s: 1.5, arm: K.PHONE_ARM, holding: heldPhone(0), eyes: 'n', mouth: 'smile', brow: 0.4, look: 0.6 });
        K.phone(820, 600, 0.75, linkScreen(0));
        if (lt > ck) { K.tapFinger(830, 560, E(seg(lt, ck - 0.1, ck + 0.15)), seg(lt, ck + 0.1, ck + 0.3)); K.ripple(830, 520, seg(lt, ck + 0.15, ck + 0.7)); }
      } });
    cue(st + ck + 0.15, 'pop', { gain: 0.35 });
  }
  // ── 1b · hit with a 404 ─────────────────────────────────────────────
  {
    const st = Wd('hit', 0) - 0.15, fr = Wd('four', 0) - st;
    add({ id: 'S02', at: st, cam: [540, 640], zoom: 0.16, note: 'red 404 card slams in big over the hero; hero shocked',
      draw(lt, d, t) {
        K.room();
        K.man({ x: 540, y: 1330, s: 1.5, arm: K.PHONE_ARM, holding: heldPhone(1), eyes: 'wide', mouth: 'o', brow: 1, look: 0 });
        K.shockLines(540, 420, 380, E(seg(lt, fr, fr + 0.3)) * 0.6);
        K.errorCard(540, 420, lerp(1.2, 0.75, eo(seg(lt, fr - 0.1, fr + 0.2))) * (lt > fr - 0.1 ? 1 : 0), Math.sin(lt * 4) * 0.04);
      } });
    cue(st, 'whoosh'); cue(st + fr, 'slam', { gain: 0.55 }); cue(st + fr + 0.1, 'boing', { gain: 0.35 });
  }

  // ── 2 · your browser asks for a page ────────────────────────────────
  {
    const st = cut(1), as = Wd('asks', 1) - st, pg = Wd('page', 1) - st;
    add({ id: 'S03', at: st, cam: [540, 720], zoom: 0.08, note: 'browser (left top) and server (right); request envelope flies browser → server from "asks"; PAGE, PLEASE? pill',
      draw(lt, d, t) {
        disc();
        K.browser(330, 560, 520, 400, 'site.com', null, E(seg(lt, 0, 0.3)));
        K.server(800, 840, 0.75, t);
        const u = eio(seg(lt, as, d - 0.1));
        K.route(330, 760, 760, 600, 220, 0, u);
        if (lt > as) { const [x, y] = K.arcAt(330, 760, 760, 600, 220, u); K.envelope(x, y, 0.8, Math.sin(lt * 5) * 0.1); }
        if (lt > pg) K.pill('PAGE, PLEASE?', 330, 1150, 56, C.yellow, C.ink, E(seg(lt, pg, pg + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + as, 'slide', { dur: 1.2, gain: 0.3 }); cue(st + pg, 'pop', { gain: 0.4 });
  }

  // ── 3 · the server answers with a 3-digit code ──────────────────────
  {
    const st = cut(2), an = Wd('answers', 2) - st, cd = Wd('code', 2) - st;
    add({ id: 'S04', at: st, cam: [540, 700], zoom: 0.12, note: 'server left; a code chip flies out and grows, digits rolling; 3-DIGIT CODE pill on "code"',
      draw(lt, d, t) {
        disc();
        K.server(270, 780, 0.7, t);
        const u = eo(seg(lt, an - 0.1, cd));
        const roll = lt < cd ? String(100 + Math.floor(rnd(Math.floor(lt * 14)) * 899)) : '? ? ?';
        if (lt > an - 0.1) K.codeChip(lerp(330, 700, u), lerp(700, 560, u), lerp(0.6, 1.8, u), roll);
        if (lt > cd) K.pill('A 3-DIGIT CODE', 700, 830, 58, C.yellow, C.ink, E(seg(lt, cd, cd + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + an, 'zip', { gain: 0.35 }); cue(st + cd, 'pop', { gain: 0.45 });
  }

  // ── 4 · 200 means OK, here's your page ──────────────────────────────
  {
    const st = cut(3), tw = Wd('two', 3) - st, pg = Wd('page', 3) - st;
    add({ id: 'S05', at: st, cam: [540, 700], zoom: 0.1, note: 'green 200 OK card pops on "two"; browser below fills with a normal page on "page" + check',
      draw(lt, d, t) {
        disc();
        K.statusCard(540, 400, 0.85 * E(seg(lt, tw - 0.1, tw + 0.2)), '200', 'OK', GREEN);
        K.browser(540, 930, 640, 440, 'site.com/page', lt > pg ? K.okPage(BLUE) : null, E(seg(lt, 0, 0.3)));
        if (lt > pg) K.check(800, 760, 0.5, E(seg(lt, pg, pg + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + tw, 'pop', { gain: 0.5 }); cue(st + pg, 'sparkle', { dur: 0.5, gain: 0.25 });
  }

  // ── 5 · a five means the server broke ───────────────────────────────
  {
    const st = cut(4), fv = Wd('five', 4) - st, br = Wd('broke', 4) - st;
    add({ id: 'S06', at: st, cam: [540, 700], zoom: 0.12, note: 'dark 5XX card with the 5 marked yellow; server below shakes and smokes on "broke"',
      draw(lt, d, t) {
        disc();
        K.statusCard(540, 360, 0.8 * E(seg(lt, fv - 0.15, fv + 0.15)), '5XX', 'SERVER ERROR', C.navy, 0, 0);
        const sh = lt > br ? Math.sin(lt * 50) * 8 * (1 - seg(lt, br + 0.4, br + 0.9)) : 0;
        K.server(540 + sh, 900, 0.6, t);
        if (lt > br) { K.smoke(470, 800, lt * 0.8, E(seg(lt, br, br + 0.3))); K.warning(760, 760, 0.7 * E(seg(lt, br, br + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + fv, 'pop', { gain: 0.45 }); cue(st + br, 'thud', { gain: 0.5 }); cue(st + br + 0.1, 'alarm', { dur: 0.6, gain: 0.18 });
  }

  // ── 6 · a four means the problem is the request ─────────────────────
  {
    const st = cut(5), fr = Wd('four', 5) - st, rq = Wd('request', 5) - st;
    add({ id: 'S07', at: st, cam: [540, 700], zoom: 0.12, note: 'red 4XX card with 4 marked yellow on "four"; the request envelope below gets a red ring + "?" on "request"',
      draw(lt, d, t) {
        disc();
        K.statusCard(540, 360, 0.8 * E(seg(lt, fr - 0.15, fr + 0.15)), '4XX', 'REQUEST PROBLEM', C.red, 0, 0);
        K.envelope(540, 880, 1.3, Math.sin(lt * 3) * 0.05);
        if (lt > rq) { const p = E(seg(lt, rq, rq + 0.3)); ctx.save(); ctx.lineWidth = 14; ctx.strokeStyle = C.red; ctx.beginPath(); ctx.arc(540, 880, 230 * p, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); bigText('?', 790, 760, 200, C.red, 0.15, p); }
      } });
    cue(st, 'whoosh'); cue(st + fr, 'pop', { gain: 0.45 }); cue(st + rq, 'boing', { gain: 0.4 });
  }

  // ── 7 · 404 means: I found the website ──────────────────────────────
  {
    const st = cut(6), fr = Wd('four', 6) - st, fd = Wd('found', 6) - st;
    add({ id: 'S08', at: st, cam: [540, 700], zoom: 0.1, note: '404 card slams top; server below gets a green check + WEBSITE FOUND pill on "found"',
      draw(lt, d, t) {
        disc();
        K.errorCard(540, 360, lerp(1.4, 0.8, eo(seg(lt, fr - 0.1, fr + 0.2))) * (lt > fr - 0.1 ? 1 : 0));
        K.server(540, 900, 0.6, t);
        if (lt > fd) { K.check(760, 760, 0.55, E(seg(lt, fd, fd + 0.25))); K.pill('WEBSITE FOUND', 540, 1190, 58, GREEN, C.white, E(seg(lt, fd, fd + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + fr, 'slam', { gain: 0.45 }); cue(st + fd, 'pop', { gain: 0.4 });
  }

  // ── 8 · but not that page ───────────────────────────────────────────
  {
    const st = cut(7), nt = Wd('not', 7) - st;
    add({ id: 'S09', at: st, cam: [540, 700], zoom: 0.18, note: 'magnifier sweeps over a dashed missing page with "?"; red X on "not"',
      draw(lt, d, t) {
        disc();
        K.webPage(270, 720, 1.0, BLUE, -0.08); K.webPage(810, 720, 1.0, GREEN, 0.08);
        K.missingPage(540, 700, 1.05 * E(seg(lt, 0, 0.25)));
        K.magnifier(540 + Math.sin(lt * 5) * 160, 600, 1.1);
        if (lt > nt) K.redX(540, 700, 0.8 * E(seg(lt, nt, nt + 0.25)), 1);
      } });
    cue(st, 'whoosh'); cue(st + nt, 'slam', { gain: 0.45 });
  }

  // ── 9 · that story about room 404 at CERN ───────────────────────────
  {
    const st = cut(8), rm = Wd('room', 8) - st, ce = Wd('cern', 8) - st;
    add({ id: 'S10', at: st, cam: [540, 640], zoom: 0.14, note: 'a wooden door with brass 404 plate rises on "room"; CERN pill on "CERN"',
      draw(lt, d, t) {
        fillAll(C.bg); rr(-300, 1080, W + 600, 900, 0); ctx.fillStyle = C.floor; ctx.fill();
        K.roomDoor(540, lerp(1100, 700, eo(seg(lt, 0, 0.35))), 1.0);
        if (lt > ce) K.pill('CERN', 540, 230, 80, C.ink, C.white, E(seg(lt, ce, ce + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'slide', { dur: 0.5, gain: 0.3 }); cue(st + ce, 'pop', { gain: 0.45 });
  }

  // ── 10 · where the web was born? ────────────────────────────────────
  {
    const st = cut(9), wb = Wd('web', 9) - st, bn = Wd('born', 9) - st;
    add({ id: 'S11', at: st, cam: [540, 680], zoom: 0.16, note: 'retro computer with a tiny first web page; globe pops above it on "web"; sparkle on "born"',
      draw(lt, d, t) {
        disc();
        K.retroPC(540, 860, 1.0, () => K.webPage(0, 0, 0.6, BLUE));
        if (lt > wb) K.globe(540, 380, 1.1 * E(seg(lt, wb, wb + 0.3)), t);
        if (lt > bn) K.burst(540, 380, 1.2, 1 - seg(lt, bn, bn + 0.6));
      } });
    cue(st, 'whoosh'); cue(st + wb, 'pop', { gain: 0.4 }); cue(st + bn, 'sparkle', { dur: 0.6, gain: 0.3 });
  }

  // ── 11a · total myth ────────────────────────────────────────────────
  {
    const st = cut(10), my = Wd('myth', 10) - st;
    add({ id: 'S12', at: st, cam: [540, 640], zoom: 0.1, note: 'the 404 door; big red X slams on "myth"',
      draw(lt, d, t) {
        fillAll(C.bg); rr(-300, 1080, W + 600, 900, 0); ctx.fillStyle = C.floor; ctx.fill();
        K.roomDoor(540, 700, 1.0);
        if (lt > my) K.redX(540, 680, lerp(1.9, 1.1, eo(seg(lt, my, my + 0.2))), 1);
      } });
    cue(st, 'whoosh'); cue(st + my, 'slam', { gain: 0.55 });
  }
  // ── 11b · just the next code on the list ────────────────────────────
  {
    const st = Wd('just', 10) - 0.1, nx = Wd('next', 10) - st, ls = Wd('list', 10) - st;
    add({ id: 'S13', at: st, cam: [540, 620], zoom: 0.1, note: 'ERROR CODES list fills 400..404 row by row, 404 row highlighted yellow on "list"',
      draw(lt, d, t) {
        disc();
        K.codeList(540, 680, 1.0 * E(seg(lt, 0, 0.25)), lerp(0, 5, seg(lt, 0.1, nx + 0.4)), 4, eo(seg(lt, ls, ls + 0.3)));
      } });
    cue(st, 'whoosh'); for (let i = 0; i < 5; i++) cue(st + 0.15 + i * 0.12, 'tock', { gain: 0.2 }); cue(st + ls, 'pop', { gain: 0.45 });
  }

  // ── 12 · here's the twist ───────────────────────────────────────────
  {
    const st = cut(11), tw = Wd('twist', 11) - st;
    add({ id: 'S14', at: st, cam: [540, 700], zoom: 0.2, note: 'red bg; hero close-up shocked; warning on "twist"',
      draw(lt, d, t) {
        fillAll(C.red); K.shockLines(540, 760, 520, 0.5);
        K.man({ x: 540, y: 1250, s: 1.6, eyes: 'wide', mouth: 'o', brow: 1, look: 0 });
        if (lt > tw) K.warning(540, 260, E(seg(lt, tw, tw + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + tw, 'slam', { gain: 0.55 }); cue(st, 'alarm', { dur: 0.8, gain: 0.2 });
  }

  // ── 13a · some sites show an error page ─────────────────────────────
  {
    const st = cut(12), er = Wd('error', 12) - st;
    add({ id: 'S15', at: st, cam: [540, 700], zoom: 0.1, note: 'browser shows the sad OOPS page on "error"',
      draw(lt, d, t) {
        disc();
        K.browser(540, 720, 760, 760, 'site.com/old-page', K.sadPage(E(seg(lt, er - 0.1, er + 0.25))), E(seg(lt, 0, 0.3)));
      } });
    cue(st, 'whoosh'); cue(st + er, 'pop', { gain: 0.4 });
  }
  // ── 13b · but secretly send 200 ─────────────────────────────────────
  {
    const st = Wd('secretly', 12) - 0.1, tw = Wd('two', 12) - st;
    add({ id: 'S16', at: st, cam: [540, 760], zoom: 0.14, note: 'sad page shrinks left; behind it a green 200 OK card slides out sneakily, SAYS OK pill on "two"',
      draw(lt, d, t) {
        disc();
        const sl = eio(seg(lt, 0, tw));
        K.statusCard(lerp(540, 760, sl), lerp(760, 820, sl), lerp(0.4, 0.62, sl), '200', 'OK', GREEN, 0.08);
        K.browser(lerp(540, 340, sl), 640, 760, 760, 'site.com/old-page', K.sadPage(1), lerp(1, 0.7, sl));
        if (lt > tw) K.pill('SAYS "OK"!', 760, 1160, 60, C.yellow, C.ink, E(seg(lt, tw, tw + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 0.8, gain: 0.25 }); cue(st + tw, 'pop', { gain: 0.5 });
  }

  // ── 14 · search engines mistake it for a real page ──────────────────
  {
    const st = cut(13), en = Wd('engines', 13) - st, rl = Wd('real', 13) - st;
    add({ id: 'S17', at: st, cam: [540, 720], zoom: 0.1, note: 'search-engine robot with magnifier reads the sad page + 200 tag; green check + A REAL PAGE? pill on "real"',
      draw(lt, d, t) {
        disc();
        K.browser(360, 600, 560, 560, 'site.com/old-page', K.sadPage(1), 1);
        K.codeChip(360, 950, 0.8, '200 OK');
        K.robot(820, 880, 0.9 * E(seg(lt, en - 0.2, en + 0.1)), t, { arm: 0.6 });
        if (lt > en) K.magnifier(640, 640 + Math.sin(lt * 4) * 30, 0.9);
        if (lt > rl) { K.check(820, 520, 0.5, E(seg(lt, rl, rl + 0.25))); K.pill('A REAL PAGE?', 540, 1180, 58, C.yellow, C.ink, E(seg(lt, rl, rl + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + en, 'pop', { gain: 0.35 }); cue(st + rl, 'boing', { gain: 0.4 });
  }

  // ── 15a · that's a soft 404, the page is gone ───────────────────────
  {
    const st = cut(14), sf = Wd('soft', 14) - st, gn = Wd('gone', 14) - st;
    add({ id: 'S18', at: st, cam: [540, 640], zoom: 0.12, note: 'pink jelly SOFT 404 card wobbles in on "soft"; missing page below pops on "gone"',
      draw(lt, d, t) {
        disc();
        K.statusCard(540, 400, 0.85 * E(seg(lt, Math.min(sf, 0.4) - 0.15, Math.min(sf, 0.4) + 0.2)), '404', 'SOFT', '#E57A8A', 0, -1, 1, lt);
        if (lt > gn - 0.1) K.missingPage(540, 900, 0.8 * E(seg(lt, gn - 0.1, gn + 0.2)));
      } });
    cue(st, 'whoosh'); cue(st + Math.min(sf, 0.4), 'boing', { gain: 0.45 }); cue(st + gn, 'pop', { gain: 0.35 });
  }
  // ── 15b · but nobody admits it ──────────────────────────────────────
  {
    const st = Wd('nobody', 14) - 0.1, ad = Wd('admits', 14) - st;
    add({ id: 'S19', at: st, cam: [540, 760], zoom: 0.12, note: 'hero to camera, smirk, finger wag on "admits"',
      draw(lt, d, t) {
        K.room();
        const p = eio(seg(lt, 0, 0.4));
        K.man({ x: 540, y: 1290, s: 2.0, arm: K.armPose(K.ARM.down, K.ARM.point, p), finger: lt > 0.3 ? Math.sin(lt * 11) * 0.35 : 0, mouth: lt > ad ? 'grin' : 'smirk', brow: 0.3, smirk: true });
      } });
    cue(st, 'whoosh'); cue(st + ad, 'pop', { gain: 0.5 });
  }

  return { shots: S, cues: CUES };
}
