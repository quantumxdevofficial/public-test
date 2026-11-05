// WHAT ACTUALLY IS A WEBSITE COOKIE?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));   // E(0) can be a tiny positive float: keep hidden things hidden
const heldPhone = (screen) => (x, y) => K.phone(x + 12, y - 70, 0.3, screen);
const SITE = [250, 560], JAR = [800, 760];

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · HOOK: hero on phone, cookie banner pops; a big cookie drops in on "cookie" ──
  {
    const st = cut(0), ck = Wd('cookie', 0) - st, ws = Wd('website', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 760], zoom: 0.06, note: 'room; hero looks at phone, consent banner slides up; cookie drops beside him on "cookie"; ? on "website"',
      draw(lt, d, t) {
        K.room();
        const hit = lt > ck;
        K.man({ x: 380, y: 1200, s: 1.3, arm: K.PHONE_ARM, holding: heldPhone(() => K.consentScreen(eo(seg(lt, 0.1, 0.6)))), eyes: hit ? 'wide' : 'n', mouth: hit ? 'o' : 'flat', brow: hit ? 1 : 0.4, look: 0.8 });
        if (hit) { const y = lerp(-300, 600, eob(seg(lt, ck, ck + 0.45))); K.cookie(790, y, 1.15, Math.sin(lt * 2) * 0.1); }
        if (lt > ws) { K.burst(790, 600, 2.6, clamp((lt - ws) * 3)); K.pill('A COOKIE?', 790, 230, 66, C.yellow, C.ink, E(seg(lt, ws, ws + 0.25))); }
      } });
    cue(st + 0.1, 'slide', { dur: 0.5, gain: 0.3 }); cue(st + ck, 'zip', { gain: 0.4 }); cue(st + ck + 0.4, 'thud', { gain: 0.5 }); cue(st + ws, 'boing', { gain: 0.4 });
  }

  // ── 2 · Nope, it's not a snack ──────────────────────────────────────────
  {
    const st = cut(1), nt = Wd('not', 1) - st, sn = Wd('snack', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 760], zoom: 0.1, note: 'big cookie on a plate; red X slams on "not"; NOT A SNACK pill on "snack"',
      draw(lt) {
        fillAll(C.bg); circle(540, 760, 560, '#F1E2C8');
        ell(540, 900, 360, 90, C.white); ell(540, 900, 300, 66, '#E4DCCB');
        K.cookie(540, 780, 1.6, Math.sin(lt * 1.5) * 0.05);
        if (lt > nt) K.redX(540, 780, lerp(1.8, 1, eo(seg(lt, nt, nt + 0.2))), 1);
        if (lt > sn) K.pill('NOT A SNACK', 540, 280, 72, C.red, C.white, E(seg(lt, sn, sn + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + nt, 'slam', { gain: 0.6 }); cue(st + sn, 'pop', { gain: 0.4 });
  }

  // ── 3 · It's a tiny note ────────────────────────────────────────────────
  {
    const st = cut(2), nt = Wd('note', 2) - st, tn = Wd('tiny', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 760], zoom: 0.12, note: 'cookie flips (scaleX) and becomes a note card on "note"; A TINY NOTE pill',
      draw(lt, d, t) {
        fillAll(C.bg); circle(540, 760, 520, '#F1E2C8');
        const f = seg(lt, nt - 0.25, nt + 0.05);
        const sx = Math.abs(Math.cos(f * Math.PI));
        ctx.save(); ctx.translate(540, 760); ctx.scale(Math.max(0.02, sx), 1);
        if (f < 0.5) K.cookie(0, 0, lerp(1.4, 1.0, eo(seg(lt, 0, tn + 0.2))), 0); else K.noteCard(0, 0, 1.5, '4821', 0, 0);
        ctx.restore();
        if (f >= 1) K.burst(540, 760, 4.5, clamp(1 - (lt - nt) * 2.5));
        if (lt > nt) K.pill('A TINY NOTE', 540, 300, 70, C.yellow, C.ink, E(seg(lt, nt, nt + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + nt - 0.25, 'zip', { gain: 0.35 }); cue(st + nt, 'pop', { gain: 0.5 });
  }

  // ── 4 · a website asks your browser to keep it ─────────────────────────
  {
    const st = cut(3), ws = Wd('website', 3) - st, as = Wd('asks', 3) - st, br = Wd('browser', 3) - st, kp = Wd('keep', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 760], zoom: 0.08, note: 'server (WEBSITE) left, jar (BROWSER) right; note arcs server→jar from "asks"; lid shuts on "keep"',
      draw(lt, d, t) {
        fillAll(C.sky); ctx.fillStyle = C.floor; ctx.fillRect(-300, 1060, W + 600, 900);
        K.server(SITE[0], 800, 0.85, t);
        if (lt > ws) K.pill('WEBSITE', SITE[0], 480, 46, C.ink, C.white, E(seg(lt, ws, ws + 0.25)));
        const lid = lt < as ? 0 : lt < kp ? eo(seg(lt, as, as + 0.3)) : 1 - eob(seg(lt, kp, kp + 0.3));
        const inJar = lt > kp - 0.05;
        K.jar(JAR[0], 880, 0.9, inJar ? 1 : 0, lid);
        const u = eio(seg(lt, as, kp - 0.05));
        if (u > 0 && u < 1) { const [x, y] = K.arcAt(SITE[0] + 60, 600, JAR[0], 680, 300, u); K.noteCard(x, y, 0.42, '4821', Math.sin(lt * 6) * 0.15); }
        if (lt > br && lt < kp) K.pill('YOUR BROWSER', JAR[0], 480, 46, C.ink, C.white, E(seg(lt, br, br + 0.25)));
        if (lt > kp) K.pill('SAVED!', JAR[0], 480, 56, C.yellow, C.ink, E(seg(lt, kp, kp + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ws, 'pop', { gain: 0.35 }); cue(st + as, 'slide', { dur: 0.9, gain: 0.35 }); cue(st + kp, 'thud', { gain: 0.5 });
  }

  // ── 5 · Inside: just a short ID number ─────────────────────────────────
  {
    const st = cut(4), us = Wd('usually', 4) - st, sh = Wd('short', 4) - st, nm = Wd('number', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 740], zoom: 0.14, note: 'close-up note card; ID digits type in from "short"; magnifier hovers; JUST AN ID pill on "number"',
      draw(lt, d, t) {
        fillAll(C.bg); circle(540, 760, 560, '#F1E2C8');
        K.noteCard(540, 760, 1.8, '4821', -0.03, 4 * seg(lt, sh - 0.1, nm));
        K.magnifier(lerp(900, 700, eio(seg(lt, us, nm))), 520 + Math.sin(lt * 3) * 15, 1.6, -0.6);
        if (lt < sh) K.pill('INSIDE', 540, 280, 64, C.ink, C.white, E(seg(lt, 0.1, 0.35)));
        if (lt > nm) K.pill('JUST AN ID', 540, 280, 72, C.yellow, C.ink, E(seg(lt, nm, nm + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sh - 0.1, 'tock', { gain: 0.3 }); cue(st + sh + 0.25, 'tock', { gain: 0.3 }); cue(st + nm, 'pop', { gain: 0.5 });
  }

  // ── 6 · every time you come back ───────────────────────────────────────
  {
    const st = cut(5), cb = Wd('come', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.1, note: 'browser window; URL types; store page loads on "come"; YOU\'RE BACK! pill',
      draw(lt, d, t) {
        fillAll(C.sky);
        const ld = lt > cb + 0.2;
        K.browser(540, 760, 900, 820, 'shop.com', ld ? K.storePage() : null, 1, 8 * seg(lt, 0.1, cb));
        if (!ld) K.spinner(540, 800, 1, t);
        if (ld) K.pill("YOU'RE BACK!", 540, 260, 66, C.yellow, C.ink, E(seg(lt, cb + 0.2, cb + 0.45)));
      } });
    cue(st, 'whoosh'); cue(st + cb + 0.2, 'pop', { gain: 0.45 });
  }

  // ── 7 · your browser hands that ID back to the site ────────────────────
  {
    const st = cut(6), hd = Wd('hands', 6) - st, id = Wd('id', 6) - st, si = Wd('site', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 760], zoom: 0.08, note: 'jar left, server right; lid lifts, note flies jar→server from "hands"; server checks it on "site"',
      draw(lt, d, t) {
        fillAll(C.sky); ctx.fillStyle = C.floor; ctx.fillRect(-300, 1060, W + 600, 900);
        const lid = lt < hd ? 0 : eo(seg(lt, hd - 0.1, hd + 0.2));
        K.jar(260, 880, 0.9, 1, lid);
        K.server(820, 800, 0.85, t);
        const u = eio(seg(lt, hd, si));
        if (u > 0 && u < 1) { const [x, y] = K.arcAt(260, 640, 780, 620, 280, u); K.noteCard(x, y, 0.42, '4821', Math.sin(lt * 6) * 0.15); }
        if (lt > id && lt < si) K.pill('ID 4821', 540, 300, 60, C.ink, C.white, E(seg(lt, id, id + 0.25)));
        if (lt > si) { K.check(820, 480, 0.6 * E(seg(lt, si, si + 0.25))); K.pill('"OH, IT\'S YOU!"', 540, 260, 58, C.yellow, C.ink, E(seg(lt, si + 0.1, si + 0.35))); }
      } });
    cue(st, 'whoosh'); cue(st + hd, 'slide', { dur: 0.9, gain: 0.35 }); cue(st + si, 'sparkle', { dur: 0.5, gain: 0.45 });
  }

  // ── 8 · remembers you're logged in ─────────────────────────────────────
  {
    const st = cut(7), rm = Wd('remembers', 7) - st, lg = Wd('logged', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 760], zoom: 0.1, note: 'phone with account page HI, SAM!; note card pops on "remembers"; check on "logged"; STILL LOGGED IN pill',
      draw(lt, d, t) {
        fillAll(C.sky); circle(540, 760, 560, '#CFE8F3');
        K.phone(540, 760, 1.2, () => K.accountScreen());
        if (lt > rm) K.noteCard(870, 470, 0.4 * E(seg(lt, rm, rm + 0.3)), '4821', 0.15);
        if (lt > lg) { K.check(800, 1000, 0.6 * E(seg(lt, lg, lg + 0.25))); K.pill('STILL LOGGED IN', 540, 230, 62, C.yellow, C.ink, E(seg(lt, lg, lg + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + rm, 'pop', { gain: 0.35 }); cue(st + lg, 'sparkle', { dur: 0.4, gain: 0.45 });
  }

  // ── 9 · what's still sitting in your cart ──────────────────────────────
  {
    const st = cut(8), stl = Wd('still', 8) - st, ct = Wd('cart', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 760], zoom: 0.1, note: 'big cart; items drop in one by one from "still"; CART SAVED pill on "cart"',
      draw(lt, d, t) {
        fillAll(C.bg); circle(540, 760, 560, '#F1E2C8');
        let n = 1, drop = 1;
        if (lt > stl) { const k = Math.floor((lt - stl) / 0.3); n = Math.min(3, 2 + k); drop = k >= 2 ? 1 : eob(seg(lt - stl - k * 0.3, 0, 0.25)); }
        K.cart(540, 820, 1.7, n, C.ink, drop);
        if (lt > ct) K.pill('CART SAVED', 540, 280, 72, C.yellow, C.ink, E(seg(lt, ct, ct + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + stl + 0.2, 'thud', { gain: 0.4 }); cue(st + stl + 0.5, 'thud', { gain: 0.4 }); cue(st + ct, 'pop', { gain: 0.5 });
  }

  // ── 10 · born in 1994 at Netscape ──────────────────────────────────────
  {
    const st = cut(9), bn = Wd('born', 9) - st, yr = Wd('nineteen', 9) - st, ns = Wd('netscape', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 760], zoom: 0.1, note: 'retro 90s PC; cookie pops on screen on "born"; 1994 slams in on "nineteen"; AT NETSCAPE pill',
      draw(lt, d, t) {
        fillAll(C.bg); circle(540, 800, 560, '#E9E2D2');
        K.retroPC(540, 860, 1.25, () => { if (lt > bn) K.cookie(0, 0, 0.6 * E(seg(lt, bn, bn + 0.3)), lt * 0.4); });
        if (lt > yr) bigText('1994', 540, 330, 200, C.yellow, -0.06, E(seg(lt, yr, yr + 0.25)));
        if (lt > ns) K.pill('AT NETSCAPE', 540, 1180, 56, C.ink, C.white, E(seg(lt, ns, ns + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + bn, 'pop', { gain: 0.4 }); cue(st + yr, 'slam', { gain: 0.5 }); cue(st + ns, 'pop', { gain: 0.4 });
  }

  // ── 11 · to help an online store remember your cart ────────────────────
  {
    const st = cut(10), sr = Wd('store', 10) - st, rm = Wd('remember', 10) - st, ct = Wd('cart', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.1, note: 'retro PC with old store page; cart pops on "store"; note card flies in on "remember"; FIRST JOB: CARTS',
      draw(lt, d, t) {
        fillAll(C.bg); circle(540, 800, 560, '#E9E2D2');
        K.retroPC(540, 860, 1.25, () => {
          ctx.fillStyle = '#3A7BD5'; ctx.fillRect(-200, -150, 400, 50);
          ctx.fillStyle = C.white; ctx.font = '900 30px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('STORE', -100, -124);
          if (lt > sr) K.cart(0, 30, 0.5 * E(seg(lt, sr, sr + 0.3)), 2, C.ink);
        });
        if (lt > rm) K.noteCard(lerp(1000, 820, eob(seg(lt, rm, rm + 0.35))), 470, 0.55, '4821', 0.12);
        if (lt > ct) K.pill('FIRST JOB: CARTS', 540, 260, 60, C.yellow, C.ink, E(seg(lt, ct, ct + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sr, 'thud', { gain: 0.4 }); cue(st + rm, 'zip', { gain: 0.4 }); cue(st + ct, 'pop', { gain: 0.5 });
  }

  // ── 12 · twist: some cookies belong to ad companies ────────────────────
  {
    const st = cut(11), tw = Wd('twist', 11) - st, ck = Wd('cookies', 11) - st, ad = Wd('ad', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 760], zoom: 0.1, note: 'TWIST red pill; sly-faced cookie rises on "cookies"; AD tag stamps on it on "ad"',
      draw(lt, d, t) {
        fillAll(C.bg); circle(540, 780, 560, '#F6D9DC');
        if (lt > tw) K.pill('TWIST', 540, 250, 84, C.red, C.white, E(seg(lt, tw, tw + 0.25)));
        K.cookie(540, 780 - (lt > ck ? 40 * Math.sin(clamp((lt - ck) * 5) * Math.PI) : 0), 1.7 * E(seg(lt, 0, 0.35)), Math.sin(lt * 2) * 0.06, 0, lt > ck ? 'sly' : 'n', t);
        if (lt > ad) {
          const sc = lerp(2.2, 1, eo(seg(lt, ad, ad + 0.2)));
          ctx.save(); ctx.translate(760, 560); ctx.rotate(0.2); ctx.scale(sc, sc);
          rr(-90, -50, 180, 100, 20); ctx.fillStyle = C.red; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
          ctx.fillStyle = C.white; ctx.font = '900 64px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('AD', 0, 4);
          ctx.restore();
          K.pill('FROM AD COMPANIES', 540, 1140, 52, C.ink, C.white, E(seg(lt, ad + 0.1, ad + 0.35)));
        }
      } });
    cue(st, 'whoosh'); cue(st + tw, 'slam', { gain: 0.5 }); cue(st + ck, 'slide', { dur: 0.4, gain: 0.3 }); cue(st + ad, 'slam', { gain: 0.45 }); cue(st + ad + 0.3, 'alarm', { dur: 0.5, gain: 0.25 });
  }

  // ── 13 · they follow you from site to site ─────────────────────────────
  const WIN = [[200, 520, '#3A7BD5'], [540, 860, '#5BAE6A'], [880, 520, '#F29A3A']];
  {
    const st = cut(12), fl = Wd('follow', 12) - st, s1 = Wd('site', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 700], zoom: 0.08, note: 'three small browser windows; sly cookie hops window to window from "follow"; FOLLOWS YOU pill',
      draw(lt, d, t) {
        fillAll(C.sky);
        WIN.forEach(([x, y, c], k) => K.browser(x, y, 300, 300, ['news', 'recipes', 'games'][k], (w, h) => { ctx.fillStyle = c; ctx.fillRect(-w / 2, -h / 2, w, 40); for (let i = 0; i < 3; i++) { rr(-w / 2 + 20, -h / 2 + 60 + i * 40, w - 60 - i * 30, 22, 11); ctx.fillStyle = '#D4D4D8'; ctx.fill(); } }));
        const u = clamp((lt - fl) / Math.max(0.6, d - fl - 0.3)) * 2;
        const k = Math.min(1, Math.floor(u)), f = u >= 2 ? 1 : u - k;
        const a = WIN[k], b = WIN[Math.min(2, k + 1)];
        const [x, y] = lt < fl ? [a[0], a[1] - 210] : K.arcAt(a[0], a[1] - 210, b[0], b[1] - 210, 160, eio(f));
        K.cookie(x, y, 0.5, Math.sin(lt * 8) * 0.2, 0, 'sly', t);
        if (lt > fl) K.pill('FOLLOWS YOU', 540, 230, 60, C.red, C.white, E(seg(lt, fl, fl + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + fl, 'boing', { gain: 0.35 }); cue(st + s1, 'boing', { gain: 0.35 });
  }

  // ── 14 · those shoes chase you everywhere (loop) ───────────────────────
  {
    const st = cut(13), sh = Wd('shoes', 13) - st, lk = Wd('looked', 13) - st, ch = Wd('chase', 13) - st, ev = Wd('everywhere', 13) - st;
    const ADS = [[220, 330, -0.12], [860, 380, 0.1], [170, 820, 0.08], [910, 860, -0.1], [540, 210, 0.04]];
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.06, note: 'hero centre; red shoe on "shoes"; shoe ads pop around him from "chase"; wink + grin on "everywhere"',
      draw(lt, d, t) {
        K.room();
        if (lt > sh && lt < ch) K.shoe(540, 260, 0.9 * E(seg(lt, sh, sh + 0.3)), -0.08, C.red);
        ADS.forEach(([x, y, r], k) => { const a0 = ch + k * 0.14; if (lt > a0) K.adBanner(x + Math.sin(t * 3 + k) * 10, y, 0.85 * E(seg(lt, a0, a0 + 0.25)), r); });
        K.man({ x: 540, y: 1250, s: 0.95, arm: K.armPose(K.ARM.down, K.ARM.hip, eo(seg(lt, lk, lk + 0.3))), eyes: lt > ev ? 'wink' : lt > ch ? 'wide' : 'n', mouth: lt > ev ? 'grin' : lt > ch ? 'o' : 'flat', brow: lt > ch ? 1 : 0.4, look: lt > lk && lt < ch ? -0.6 : 0 });
      } });
    cue(st, 'whoosh'); cue(st + sh, 'pop', { gain: 0.4 }); for (let k = 0; k < 5; k++) cue(st + ch + k * 0.14, 'pop', { gain: 0.3 }); cue(st + ev, 'boing', { gain: 0.45 });
  }

  return { shots: S, cues: CUES };
}
