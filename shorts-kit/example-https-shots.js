// WHAT DOES THE PADLOCK IN YOUR BROWSER MEAN?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));   // E(0) can be a tiny positive float: keep hidden things hidden
const heldPhone = (screen) => (x, y) => K.phone(x + 12, y - 70, 0.3, screen);
const ME = [190, 760], SITE = [890, 760];                // you (phone/laptop) on the left, the website on the right
const HOPS = [[370, 520], [540, 700], [710, 520]];         // strangers' machines in between

// a phone + a server with a dotted route through HOPS
function network(t, lit = -1) {
  fillAll(C.sky); ctx.fillStyle = C.floor; ctx.fillRect(-300, 1080, W + 600, 900);
  K.phone(ME[0], ME[1], 0.55, () => K.loginScreen(8, t));
  K.server(SITE[0], ME[1] + 20, 0.55, t);
  const pts = [[ME[0] + 60, ME[1] - 120], ...HOPS, [SITE[0] - 60, ME[1] - 120]];
  for (let i = 0; i < pts.length - 1; i++) line([pts[i], pts[i + 1]], 'rgba(26,26,30,0.25)', 10);
  HOPS.forEach(([x, y], k) => { K.router(x, y + 40, 0.36, t + k); });
  return pts;
}
// position along the polyline pts at u 0..1 (equal time per segment)
function along(pts, u) {
  const n = pts.length - 1, k = Math.min(n - 1, Math.floor(clamp(u) * n)), f = clamp(u) * n - k;
  return [lerp(pts[k][0], pts[k + 1][0], f), lerp(pts[k][1], pts[k + 1][1], f)];
}

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · HOOK: hero with phone; big address bar; padlock drops on "padlock"; ? on "mean" ──
  {
    const st = cut(0), pl = Wd('padlock', 0) - st, br = Wd('browser', 0) - st, mn = Wd('mean', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 700], zoom: 0.06, note: 'room; hero with phone; address bar slides down on "browser"; giant padlock drops on "padlock"; ? on "mean"',
      draw(lt, d, t) {
        K.room();
        const hit = lt > mn;
        K.man({ x: 300, y: 1210, s: 1.0, arm: K.PHONE_ARM, holding: heldPhone(() => K.loginScreen(0, t)), eyes: hit ? 'wide' : 'n', mouth: hit ? 'o' : 'flat', brow: hit ? 1 : 0.4, look: 0.8 });
        if (lt > pl) { const y = lerp(-300, 720, eob(seg(lt, pl, pl + 0.45))); K.padlock(780, y, 1.15, 0, undefined, Math.sin(lt * 2) * 0.06); }
        if (lt > br) K.addressBar(540, lerp(-120, 230, eo(seg(lt, br, br + 0.35))), 860, 'https://mybank.com', 'lock');
        if (hit) { K.burst(780, 720, 2.6, clamp((lt - mn) * 3)); bigText('?', 960, 470, 220, C.yellow, 0.15, E(seg(lt, mn, mn + 0.25))); }
      } });
    cue(st + pl, 'zip', { gain: 0.4 }); cue(st + pl + 0.4, 'thud', { gain: 0.5 }); cue(st + br, 'slide', { dur: 0.35, gain: 0.3 }); cue(st + mn, 'boing', { gain: 0.4 });
  }

  // ── 2 · When you type a password ───────────────────────────────────────
  {
    const st = cut(1), ty = Wd('type', 1) - st, pw = Wd('password', 1) - st, d0 = Le(1) - L(1) + 0.25;
    add({ id: 'S02', at: st, cam: [540, 760], zoom: 0.12, note: 'phone close-up, login form; dots type in from "type"; PASSWORD pill on "password"',
      draw(lt, d, t) {
        fillAll(C.sky); circle(540, 760, 560, '#CFE8F3');
        K.phone(540, 780, 1.15, () => K.loginScreen(8 * seg(lt, ty, d0), t));
        if (lt > pw) K.pill('PASSWORD', 540, 240, 70, C.yellow, C.ink, E(seg(lt, pw, pw + 0.25)));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 4; k++) cue(st + ty + k * 0.2, 'tock', { gain: 0.22 }); cue(st + pw, 'pop', { gain: 0.45 });
  }

  // ── 3 · it hops through strangers' machines on the way ─────────────────
  {
    const st = cut(2), hp = Wd('hops', 2) - st, sg = Wd('strangers', 2) - st, wy = Wd('way', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 700], zoom: 0.08, note: 'phone left, server right, 3 routers between; envelope hops from "hops"; peeking eyes pop on each router from "strangers\'"; ON THE WAY',
      draw(lt, d, t) {
        const pts = network(t);
        HOPS.forEach(([x, y], k) => { const a = sg + k * 0.15; if (lt > a) K.peekEyes(x, y - 60, 0.75 * E(seg(lt, a, a + 0.25)), Math.sin(t * 3 + k), 0); });
        const u = seg(lt, hp, d - 0.1);
        if (u > 0) { const [x, y] = along(pts, u); K.envelope(x, y - 50 - Math.abs(Math.sin(u * Math.PI * 4)) * 50, 0.55, Math.sin(lt * 8) * 0.12); }
        if (lt > sg) K.pill("STRANGERS' MACHINES", 540, 230, 54, C.ink, C.white, E(seg(lt, sg, sg + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + hp, 'boing', { gain: 0.3 }); for (let k = 0; k < 3; k++) cue(st + sg + k * 0.15, 'pop', { gain: 0.3 });
  }

  // ── 4a · and with plain HTTP ───────────────────────────────────────────
  {
    const st = cut(3), ht = Wd('http', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 600], zoom: 0.1, note: 'address bar types http://mybank.com; red NOT SECURE tag + open red lock on "HTTP"',
      draw(lt, d, t) {
        fillAll(C.bg); circle(540, 640, 560, '#F6D9DC');
        K.addressBar(540, 520, 900, 'http://mybank.com', lt > ht ? 'warn' : null, 1, 18 * seg(lt, 0, ht), E(seg(lt, ht, ht + 0.25)));
        if (lt > ht) K.padlock(540, 900, 1.1 * E(seg(lt, ht + 0.1, ht + 0.4)), 1, C.red);
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'tock', { gain: 0.2 }); cue(st + ht, 'slam', { gain: 0.45 }); cue(st + ht + 0.2, 'alarm', { dur: 0.4, gain: 0.2 });
  }

  // ── 4b · it's like a postcard anyone can read ──────────────────────────
  {
    const st = Wd("it's", 3) - 0.08, pc = Wd('postcard', 3) - st, an = Wd('anyone', 3) - st, rd = Wd('read', 3) - st;
    const EYES = [[200, 380], [880, 400], [170, 1050], [900, 1060], [540, 250]];
    add({ id: 'S05', at: st, cam: [540, 720], zoom: 0.1, note: 'postcard with PASSWORD: sunny123 flies in on "postcard"; peeking eyes all around from "anyone"; magnifier on "read"',
      draw(lt, d, t) {
        fillAll(C.bg); circle(540, 720, 560, '#F1E2C8');
        K.postcard(lerp(1300, 540, eo(seg(lt, 0, 0.4))), 720, 1.3, -0.05 + (lt > pc ? 0.04 * Math.sin(Math.PI * seg(lt, pc, pc + 0.3)) : 0));
        if (lt > pc) K.pill('A POSTCARD', 540, 1180, 64, C.yellow, C.ink, E(seg(lt, pc, pc + 0.25)));
        EYES.forEach(([x, y], k) => { const a = an + k * 0.1; if (lt > a) K.peekEyes(x, y, 0.95 * E(seg(lt, a, a + 0.25)), x < 540 ? 1 : -1, 0); });
        if (lt > rd) K.magnifier(lerp(850, 560, eio(seg(lt, rd, rd + 0.4))), 700, 1.8, -0.6);
      } });
    cue(st, 'whoosh'); cue(st + 0.02, 'zip', { gain: 0.35 }); cue(st + pc, 'pop', { gain: 0.4 }); for (let k = 0; k < 5; k++) cue(st + an + k * 0.1, 'pop', { gain: 0.25 }); cue(st + rd, 'slide', { dur: 0.4, gain: 0.25 });
  }

  // ── 5 · But with HTTPS, the S means secure ─────────────────────────────
  {
    const st = cut(4), hs = Wd('https', 4) - st, ss = Wd('s', 4) - st, sc = Wd('secure', 4) - st;
    add({ id: 'S06', at: st, cam: [540, 640], zoom: 0.1, note: 'address bar https://mybank.com; the S highlights + big yellow S on "S"; padlock snaps shut on "secure"',
      draw(lt, d, t) {
        fillAll(C.sky); circle(540, 680, 560, '#CFE8F3');
        K.addressBar(540, 300, 900, 'https://mybank.com', lt > sc ? 'lock' : null, 1, 19 * seg(lt, 0, hs + 0.2), E(seg(lt, sc, sc + 0.25)), clamp((lt - ss) * 4));
        const open = lt < sc ? 1 : 1 - eo(seg(lt, sc, sc + 0.15));
        K.padlock(540, 860, 1.25, open, lt > sc ? undefined : C.red);
        if (lt > ss && lt < sc + 0.1) bigText('S', 860, 620, 260, C.yellow, 0.12, E(seg(lt, ss, ss + 0.2)));
        if (lt > sc) { K.burst(540, 860, 3.2, clamp(1 - (lt - sc) * 2.5)); K.pill('SECURE', 540, 1160, 72, C.yellow, C.ink, E(seg(lt, sc, sc + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + ss, 'pop', { gain: 0.45 }); cue(st + sc, 'thud', { gain: 0.55 }); cue(st + sc + 0.05, 'sparkle', { dur: 0.4, gain: 0.35 });
  }

  // ── 6 · browser and site agree on a secret key ─────────────────────────
  {
    const st = cut(5), br = Wd('browser', 5) - st, si = Wd('site', 5) - st, ag = Wd('agree', 5) - st, sk = Wd('secret', 5) - st;
    add({ id: 'S07', at: st, cam: [540, 720], zoom: 0.08, note: 'laptop (YOU) left, server (SITE) right; a handshake ↔ on "agree"; matching gold keys pop on both on "secret"',
      draw(lt, d, t) {
        fillAll(C.sky); ctx.fillStyle = C.floor; ctx.fillRect(-300, 1060, W + 600, 900);
        K.laptop(230, 880, 0.75, () => K.loginScreen(8, t));
        K.server(850, 820, 0.8, t);
        if (lt > br) K.pill('BROWSER', 230, 1150, 44, C.ink, C.white, E(seg(lt, br, br + 0.25)));
        if (lt > si) K.pill('SITE', 850, 1150, 44, C.ink, C.white, E(seg(lt, si, si + 0.25)));
        if (lt > ag) { const u = eio(seg(lt, ag, sk)); K.route(330, 640, 750, 600, 260, 0, u, 0.6); K.route(750, 600, 330, 640, 260, 0, u, 0.6); }
        if (lt > sk) for (const [x, r] of [[230, -0.3], [850, 0.3]]) K.key(x, 380, 0.7 * E(seg(lt, sk, sk + 0.3)), r);
        if (lt > sk) K.pill('SAME SECRET KEY', 540, 230, 56, C.yellow, C.ink, E(seg(lt, sk + 0.1, sk + 0.35)));
      } });
    cue(st, 'whoosh'); cue(st + br, 'pop', { gain: 0.3 }); cue(st + si, 'pop', { gain: 0.3 }); cue(st + ag, 'slide', { dur: 0.5, gain: 0.3 }); cue(st + sk, 'sparkle', { dur: 0.5, gain: 0.45 });
  }

  // ── 7 · scramble everything into gibberish ─────────────────────────────
  {
    const st = cut(6), scm = Wd('scramble', 6) - st, gb = Wd('gibberish', 6) - st;
    add({ id: 'S08', at: st, cam: [540, 720], zoom: 0.12, note: 'message card sunny123; key turns beside it; letters scramble left→right from "scramble"; GIBBERISH pill',
      draw(lt, d, t) {
        fillAll(C.bg); circle(540, 720, 560, '#F1E2C8');
        const p = seg(lt, scm, gb + 0.2);
        K.scrambleCard(540, 760, 1.5, 'sunny123', p, Math.floor(lt * 14), Math.sin(lt * 30) * 0.02 * (p > 0 && p < 1 ? 1 : 0), p > 0.5 ? 'LOCKED' : 'YOUR PASSWORD');
        K.key(800, 470, 0.75, -0.5 + eio(seg(lt, scm - 0.2, scm + 0.3)) * 1.6);
        if (lt > gb) K.pill('GIBBERISH', 540, 1120, 72, C.yellow, C.ink, E(seg(lt, gb, gb + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + scm, 'sparkle', { dur: 0.8, gain: 0.35 }); cue(st + gb, 'pop', { gain: 0.5 });
  }

  // ── 8 · only the two of them can unlock ────────────────────────────────
  {
    const st = cut(7), on = Wd('only', 7) - st, tw = Wd('two', 7) - st, un = Wd('unlock', 7) - st;
    add({ id: 'S09', at: st, cam: [540, 680], zoom: 0.08, note: 'network again; locked card travels; snoop eyes see junk (?) from "only"; at the server the key turns it back to sunny123 on "unlock"',
      draw(lt, d, t) {
        const pts = network(t);
        HOPS.forEach(([x, y], k) => { K.peekEyes(x, y - 60, 0.75, 0, 0); if (lt > on + k * 0.2) bigText('?', x + 70, y - 140, 90, C.white, 0.2, E(seg(lt, on + k * 0.2, on + k * 0.2 + 0.2))); });
        const u = seg(lt, 0, un - 0.1);
        const [x, y] = along(pts, u);
        const opened = lt > un;
        K.scrambleCard(opened ? SITE[0] : x, opened ? 330 : y - 90, 0.42, 'sunny123', opened ? 1 - seg(lt, un, un + 0.3) : 1, Math.floor(lt * 14));
        if (lt > tw) K.key(SITE[0] + 110, 470, 0.35 * E(seg(lt, tw, tw + 0.25)), 0.3);
        if (lt > un) K.check(SITE[0], 560, 0.5 * E(seg(lt, un + 0.2, un + 0.45)));
        if (lt > tw) K.pill('ONLY THESE TWO', 540, 220, 56, C.yellow, C.ink, E(seg(lt, tw, tw + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'slide', { dur: 1.2, gain: 0.25 }); cue(st + on, 'boing', { gain: 0.25 }); cue(st + un, 'sparkle', { dur: 0.4, gain: 0.45 });
  }

  // ── 9 · That's what the padlock means: a private line ──────────────────
  {
    const st = cut(8), pl = Wd('padlock', 8) - st, pr = Wd('private', 8) - st;
    add({ id: 'S10', at: st, cam: [540, 700], zoom: 0.1, note: 'phone ←→ server joined by a thick tube; padlock clamps onto the tube on "padlock"; PRIVATE LINE pill on "private"',
      draw(lt, d, t) {
        fillAll(C.sky); ctx.fillStyle = C.floor; ctx.fillRect(-300, 1080, W + 600, 900);
        K.phone(170, 760, 0.55, () => K.loginScreen(8, t));
        K.server(910, 780, 0.55, t);
        line([[250, 700], [830, 700]], C.ink, 70); line([[250, 700], [830, 700]], lt > pr ? C.yellow : '#9AA1AE', 46);
        for (let k = 0; k < 4; k++) { const x = 260 + ((lt * 260 + k * 145) % 570); K.packet(x, 700, 0.28); }
        if (lt > pl) K.padlock(540, lerp(200, 640, eob(seg(lt, pl, pl + 0.35))), 0.8);
        if (lt > pr) K.pill('PRIVATE LINE', 540, 1000, 72, C.yellow, C.ink, E(seg(lt, pr, pr + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + pl, 'zip', { gain: 0.35 }); cue(st + pl + 0.3, 'thud', { gain: 0.5 }); cue(st + pr, 'sparkle', { dur: 0.4, gain: 0.4 });
  }

  // ── 10 · twist: it doesn't mean the site is safe ───────────────────────
  {
    const st = cut(9), tw = Wd('twist', 9) - st, dn = Wd("doesn't", 9) - st, sf = Wd('safe', 9) - st;
    add({ id: 'S11', at: st, cam: [540, 720], zoom: 0.1, note: 'TWIST red pill; padlock + SAFE SITE? card; red X slams on "safe"',
      draw(lt, d, t) {
        fillAll(C.bg); circle(540, 740, 560, '#F6D9DC');
        if (lt > tw) K.pill('TWIST', 540, 240, 84, C.red, C.white, E(seg(lt, tw, tw + 0.25)));
        K.padlock(540, 760, 1.4 * E(seg(lt, 0, 0.35)), 0, undefined, Math.sin(lt * 2) * 0.05);
        if (lt > dn) K.pill('= SAFE SITE?', 540, 1100, 66, C.ink, C.white, E(seg(lt, dn, dn + 0.25)));
        if (lt > sf) K.redX(540, 760, lerp(1.9, 1.15, eo(seg(lt, sf, sf + 0.2))), 1);
      } });
    cue(st, 'whoosh'); cue(st + tw, 'slam', { gain: 0.45 }); cue(st + dn, 'pop', { gain: 0.35 }); cue(st + sf, 'slam', { gain: 0.6 });
  }

  // ── 11 · Nearly every scam site has a padlock too ──────────────────────
  {
    const st = cut(10), sc = Wd('scam', 10) - st, pl = Wd('padlock', 10) - st;
    add({ id: 'S12', at: st, cam: [540, 700], zoom: 0.08, note: 'fake prize page in a browser; a hook dangles in on "scam"; the bar padlock pops big + burst on "padlock"',
      draw(lt, d, t) {
        fillAll(C.sky);
        K.browser(540, 760, 860, 900, '', K.scamPage(t), 1);
        K.addressBar(540, 300, 900, 'https://win-prize.xyz', 'lock', 1, 1e9, lt > pl ? 1 + 0.9 * Math.sin(Math.PI * seg(lt, pl, pl + 0.5)) : 1);
        if (lt > sc) K.hook(880, lerp(-200, 560, eob(seg(lt, sc, sc + 0.4))), 0.9, Math.sin(lt * 3) * 0.08);
        if (lt > pl) { K.burst(140, 300, 2, clamp(1 - (lt - pl) * 2)); K.pill('SCAMS GET IT TOO', 540, 1180, 56, C.red, C.white, E(seg(lt, pl, pl + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + sc, 'zip', { gain: 0.35 }); cue(st + pl, 'slam', { gain: 0.45 }); cue(st + pl + 0.2, 'alarm', { dur: 0.5, gain: 0.25 });
  }

  // ── 12 · so few people knew what it meant (11%) ────────────────────────
  {
    const st = cut(11), fw = Wd('few', 11) - st, pp = Wd('people', 11) - st, kn = Wd('knew', 11) - st;
    const COLS = ['#3A7BD5', '#E57A8A', '#5BAE6A', '#C8734A', '#1F2A44'];
    add({ id: 'S13', at: st, cam: [540, 720], zoom: 0.08, note: 'grid of 30 people icons pops in on "people"; ? over most, 3 get a ✓ on "knew"; ONLY 11% GOT IT pill',
      draw(lt, d, t) {
        fillAll(C.bg); circle(540, 720, 560, '#E9E2D2');
        for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) {
          const k = r * 6 + c, a = 0.04 + k * 0.012, got = k === 3 || k === 14 || k === 25;
          if (lt > a) K.personIcon(165 + c * 150, 480 + r * 160, 0.95 * E(seg(lt, a, a + 0.2)), COLS[k % 5], lt > kn ? E(seg(lt, kn, kn + 0.25)) : 0, got);
        }
        if (lt > fw) K.pill('ONLY 11% GOT IT', 540, 230, 64, C.yellow, C.ink, E(seg(lt, fw, fw + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + fw, 'pop', { gain: 0.45 }); cue(st + 0.04, 'sparkle', { dur: 0.4, gain: 0.3 }); cue(st + kn, 'boing', { gain: 0.35 });
  }

  // ── 13 · Chrome swapped it for a different icon ────────────────────────
  {
    const st = cut(12), sw = Wd('swapped', 12) - st, ic = Wd('icon', 12) - st;
    add({ id: 'S14', at: st, cam: [540, 600], zoom: 0.12, note: 'big icon tile: padlock spins away and the tune (slider) icon spins in on "swapped"; NEW ICON pill on "icon"; small address bar shows tune icon',
      draw(lt, d, t) {
        fillAll(C.sky); circle(540, 680, 560, '#CFE8F3');
        const f = seg(lt, sw - 0.1, sw + 0.35), sx = Math.abs(Math.cos(f * Math.PI));
        rr(290, 430, 500, 500, 90); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 12; ctx.strokeStyle = C.ink; ctx.stroke();
        ctx.save(); ctx.translate(540, 700); ctx.scale(Math.max(0.02, sx), 1);
        if (f < 0.5) K.padlock(0, 20, 1.0); else K.tuneIcon(0, -20, 2.4);
        ctx.restore();
        if (f >= 1) K.burst(540, 680, 4, clamp(1 - (lt - sw - 0.35) * 2.5));
        K.addressBar(540, 1110, 760, 'mybank.com', f < 0.5 ? 'lock' : 'tune', 0.85);
        if (lt > ic) K.pill('NEW ICON', 540, 250, 72, C.yellow, C.ink, E(seg(lt, ic, ic + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sw - 0.1, 'zip', { gain: 0.4 }); cue(st + sw + 0.3, 'pop', { gain: 0.5 }); cue(st + ic, 'pop', { gain: 0.4 });
  }

  // ── 14 · So the padlock locks the line, not the liar (loop) ────────────
  {
    const st = cut(13), lk = Wd('locks', 13) - st, ln = Wd('line', 13) - st, nt = Wd('not', 13) - st, li = Wd('liar', 13) - st;
    add({ id: 'S15', at: st, cam: [540, 760], zoom: 0.06, note: 'hero centre; gold line above with padlock clamping on "locks"; red scam card with hook on "liar"; hero wags finger + wink',
      draw(lt, d, t) {
        K.room();
        const lineOn = lt > ln - 0.1;
        line([[60, 300], [1020, 300]], C.ink, 44); line([[60, 300], [1020, 300]], lineOn ? C.yellow : '#9AA1AE', 26);
        if (lt > lk) K.padlock(300, lerp(60, 330, eob(seg(lt, lk, lk + 0.3))), 0.55);
        if (lt > nt) { K.scrambleCard(770, lerp(1500, 620, eob(seg(lt, nt, nt + 0.35))), 0.9, 'LIAR.XYZ', 0, 0, 0.08, 'STILL A SCAM'); }
        if (lt > li) K.redX(770, 620, 0.9 * E(seg(lt, li, li + 0.2)), 1);
        const wag = lt > li ? Math.sin(lt * 11) * 0.35 : 0;
        K.man({ x: 420, y: 1240, s: 0.9, arm: K.armPose(K.ARM.down, K.ARM.point, eo(seg(lt, nt, nt + 0.3))), finger: lt > nt ? wag : null, eyes: lt > li + 0.15 ? 'wink' : 'n', mouth: lt > li + 0.15 ? 'grin' : 'smirk', brow: 0.6 });
      } });
    cue(st, 'whoosh'); cue(st + lk, 'zip', { gain: 0.35 }); cue(st + lk + 0.25, 'thud', { gain: 0.5 }); cue(st + nt, 'slide', { dur: 0.35, gain: 0.3 }); cue(st + li, 'slam', { gain: 0.5 }); cue(st + li + 0.3, 'boing', { gain: 0.4 });
  }

  return { shots: S, cues: CUES };
}
