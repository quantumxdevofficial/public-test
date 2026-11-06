// HOW DOES A WEBSITE REMEMBER YOUR PASSWORD?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));   // E(0) can be a tiny positive float: keep hidden things hidden
const heldPhone = (screen) => (x, y) => K.phone(x + 12, y - 70, 0.3, screen);
const PW = 'sunny123', HASH = K.fakeHash(1, 10), HASH2 = K.fakeHash(7, 10), HASH_A = K.fakeHash(3, 10), HASH_B = K.fakeHash(11, 10);
const MIX = '#8E7CC3';
// flat = / ≠ sign (the font has no glyph for these). s = 1 → 120 wide
function eq(x, y, s, col = C.ink, no = false) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const dy of [-26, 26]) { rr(-60, dy - 13, 120, 26, 13); ctx.fillStyle = col; ctx.fill(); }
  if (no) { ctx.rotate(-0.9); rr(-80, -12, 160, 24, 12); ctx.fillStyle = col; ctx.fill(); }
  ctx.restore();
}   // blended "gibberish" colour inside the blender

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · HOOK: hero types a password; the site's server thinks "?" ─────
  {
    const st = cut(0), ws = Wd('website', 0) - st, rm = Wd('remember', 0) - st, pw = Wd('password', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 700], zoom: 0.06, note: 'room; hero with login phone left; server slides in on "website"; thought bubble with ? on "remember"; PASSWORD chip on "password"',
      draw(lt, d, t) {
        K.room();
        const hit = lt > pw;
        K.man({ x: 300, y: 1210, s: 1.0, arm: K.PHONE_ARM, holding: heldPhone(() => K.loginScreen(8 * seg(lt, 0.1, 1.2), t)), eyes: hit ? 'wide' : 'n', mouth: hit ? 'o' : 'flat', brow: hit ? 1 : 0.4, look: 0.8 });
        if (lt > ws) K.server(820, lerp(1500, 860, eob(seg(lt, ws, ws + 0.4))), 0.62, t);
        if (lt > rm) { const p = E(seg(lt, rm, rm + 0.3)); circle(860, 380, 150 * p, C.white); circle(760, 540, 30 * p, C.white); circle(800, 600, 18 * p, C.white); bigText('?', 860, 390, 190, C.ink, 0.1, p); }
        if (hit) K.chip(540, 200, 0.8 * E(seg(lt, pw, pw + 0.3)), PW, 'plain', 1e9, -0.04, null);
      } });
    cue(st + 0.15, 'tock', { gain: 0.2 }); cue(st + ws, 'slide', { dur: 0.35, gain: 0.3 }); cue(st + rm, 'pop', { gain: 0.4 }); cue(st + pw, 'boing', { gain: 0.4 });
  }

  // ── 2 · Well, a good one doesn't keep it at all ────────────────────────
  {
    const st = cut(1), gd = Wd('good', 1) - st, dn = Wd("doesn't", 1) - st, al = Wd('all', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 700], zoom: 0.1, note: 'database centre; sunny123 chip drops toward it, stops above; red X slams on "doesn\'t"; NOT STORED pill on "all"',
      draw(lt, d, t) {
        fillAll(C.sky); circle(540, 760, 560, '#CFE8F3');
        K.database(540, 860, 1.0, 0);
        if (lt > gd) K.pill('GOOD SITE', 540, 1180, 52, C.ink, C.white, E(seg(lt, gd, gd + 0.25)));
        const y = lerp(-100, 420, eob(seg(lt, 0.05, 0.5)));
        K.chip(540, y + 80, 1.0, PW, 'plain', 1e9, Math.sin(lt * 3) * 0.04);
        if (lt > dn) K.redX(540, 500, lerp(1.4, 0.75, eo(seg(lt, dn, dn + 0.2))), 1);
        if (lt > al) K.pill('NEVER SAVED', 540, 180, 70, C.red, C.white, E(seg(lt, al, al + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'zip', { gain: 0.3 }); cue(st + gd, 'pop', { gain: 0.3 }); cue(st + dn, 'slam', { gain: 0.55 }); cue(st + al, 'pop', { gain: 0.4 });
  }

  // ── 3 · Instead, it runs it through a hash ─────────────────────────────
  {
    const st = cut(2), rn = Wd('runs', 2) - st, hs = Wd('hash', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 760], zoom: 0.1, note: 'blender (HASH) rises in; sunny123 chip drops into the jar from "runs"; HASH label flashes yellow pill on "hash"',
      draw(lt, d, t) {
        fillAll(C.bg); circle(540, 760, 560, '#F1E2C8');
        const by = lerp(1700, 800, eob(seg(lt, 0, 0.4)));
        const u = seg(lt, rn, rn + 0.6);
        const inJar = u >= 1;
        K.blender(540, by, 1.15, 0, inJar ? '#FFFFFF' : null, t);
        if (!inJar) K.chip(540, lerp(220, 640, eio(u)), lerp(0.9, 0.5, u), PW, 'plain', 1e9, u * 0.6);
        else K.chip(540, 690, 0.5, PW, 'plain', 1e9, 0.6);
        if (lt > hs) K.pill('HASH', 860, 300, 80, C.yellow, C.ink, E(seg(lt, hs, hs + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'slide', { dur: 0.35, gain: 0.3 }); cue(st + rn, 'zip', { gain: 0.3 }); cue(st + rn + 0.6, 'plop', { gain: 0.45 }); cue(st + hs, 'pop', { gain: 0.45 });
  }

  // ── 4 · a one-way blender that turns it into gibberish ─────────────────
  {
    const st = cut(3), ow = Wd('one-way', 3) - st, bl = Wd('blender', 3) - st, tu = Wd('turns', 3) - st, gb = Wd('gibberish', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 700], zoom: 0.05, note: 'blender spins from "blender"; ONE-WAY arrow sign on "one-way"; gold hash chip shoots out on "gibberish"',
      draw(lt, d, t) {
        fillAll(C.bg); circle(540, 760, 560, '#F1E2C8');
        const sp = clamp(seg(lt, bl, bl + 0.3) - seg(lt, gb + 0.3, gb + 0.6));
        K.blender(540, 860, 1.15, sp, lt > tu ? MIX : '#FFFFFF', t);
        if (lt < tu) K.chip(540, 750, 0.5, PW, 'plain', 1e9, 0.6 + Math.sin(t * 30) * 0.3 * sp);
        if (lt > ow) { const p = E(seg(lt, ow, ow + 0.3)); K.pill('ONE-WAY', 360, 210, 70, C.ink, C.white, p); K.arrow(720, 210, 140 * p, 0, p); }
        if (lt > gb) { const p = eo(seg(lt, gb, gb + 0.4)); K.chip(lerp(540, 540, p), lerp(560, 365, p), lerp(0.4, 0.85, p), HASH, 'hash', 1e9, lerp(0.4, -0.04, p)); K.burst(540, 365, 2.4, clamp(1 - (lt - gb) * 2.5)); }
      } });
    cue(st, 'whoosh'); cue(st + ow, 'pop', { gain: 0.4 }); cue(st + bl, 'sizzle', { dur: Math.max(0.5, gb - bl + 0.3), gain: 0.3 }); cue(st + gb, 'sparkle', { dur: 0.4, gain: 0.45 });
  }

  // ── 5 · and only that gibberish gets saved ─────────────────────────────
  {
    const st = cut(4), on = Wd('only', 4) - st, gb = Wd('gibberish', 4) - st, sv = Wd('saved', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 700], zoom: 0.08, note: 'hash chip flies down into database (left); table on right shows alex → hash row on "saved"; database rim glows',
      draw(lt, d, t) {
        fillAll(C.sky); circle(540, 760, 560, '#CFE8F3');
        K.database(540, 900, 0.85, lt > sv ? clamp(1 - (lt - sv) * 1.5) + 0.3 : 0);
        const u = seg(lt, gb, sv);
        if (u < 1) K.chip(540, lerp(240, 760, eio(u)), lerp(1.0, 0.4, u), HASH, 'hash');
        if (lt > on && u <= 0) K.pill('ONLY THIS', 540, 400, 52, C.yellow, C.ink, E(seg(lt, on, on + 0.25)));
        if (lt > sv) { K.dbTable(540, 230, 0.95 * E(seg(lt, sv, sv + 0.3)), [['alex', HASH, 'hash']]); K.check(880, 760, 0.5 * E(seg(lt, sv + 0.15, sv + 0.4))); }
      } });
    cue(st, 'whoosh'); cue(st + on, 'pop', { gain: 0.35 }); cue(st + gb, 'slide', { dur: 0.5, gain: 0.3 }); cue(st + sv, 'thud', { gain: 0.5 }); cue(st + sv + 0.1, 'sparkle', { dur: 0.35, gain: 0.35 });
  }

  // ── 6 · When you log in, it blends what you type ───────────────────────
  {
    const st = cut(5), lg = Wd('log', 5) - st, bl = Wd('blends', 5) - st, ty = Wd('type', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.08, note: 'phone login left types dots from "log"; small blender right spins on "blends"; typed chip hops phone→blender',
      draw(lt, d, t) {
        fillAll(C.bg); circle(540, 760, 560, '#E9E2D2');
        K.phone(270, 760, 0.85, () => K.loginScreen(8 * seg(lt, lg, bl), t));
        const sp = clamp(seg(lt, bl, bl + 0.25));
        K.blender(800, 820, 0.75, sp, lt > bl ? MIX : null, t);
        const u = seg(lt, bl - 0.35, bl);
        if (u > 0 && u < 1) { const [x, y] = K.arcAt(330, 600, 800, 560, 260, eio(u)); K.chip(x, y, 0.5, PW); }
        if (lt > lg) K.pill('LOG IN', 270, 230, 64, C.ink, C.white, E(seg(lt, lg, lg + 0.25)));
        if (lt > ty) K.pill('SAME BLENDER', 800, 300, 52, C.yellow, C.ink, E(seg(lt, ty, ty + 0.25)));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 4; k++) cue(st + lg + k * 0.15, 'tock', { gain: 0.2 }); cue(st + bl - 0.35, 'zip', { gain: 0.3 }); cue(st + bl, 'sizzle', { dur: 0.7, gain: 0.25 }); cue(st + ty, 'pop', { gain: 0.35 });
  }

  // ── 7 · and if the gibberish matches, you're in ────────────────────────
  {
    const st = cut(6), gb = Wd('gibberish', 6) - st, mt = Wd('matches', 6) - st, yi = Wd('in', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 700], zoom: 0.1, note: 'NEW hash chip (top) and SAVED hash chip (bottom) slide in; = sign + both turn green on "matches"; big check + door-open YOU\'RE IN pill on "in"',
      draw(lt, d, t) {
        fillAll(C.sky); circle(540, 720, 560, '#CFE8F3');
        const ok = lt > mt;
        K.chip(lerp(-400, 540, eo(seg(lt, 0, 0.35))), 430, 1.05, HASH, ok ? 'green' : 'hash', 1e9, 0, 'JUST TYPED');
        K.chip(lerp(1500, 540, eo(seg(lt, gb - 0.2, gb + 0.15))), 790, 1.05, HASH, ok ? 'green' : 'hash', 1e9, 0, 'SAVED');
        if (ok) eq(540, 610, E(seg(lt, mt, mt + 0.2)));
        if (lt > yi) { K.check(540, 1050, 0.75 * E(seg(lt, yi, yi + 0.25))); K.pill("YOU'RE IN", 540, 200, 76, C.yellow, C.ink, E(seg(lt, yi, yi + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + gb - 0.2, 'slide', { dur: 0.35, gain: 0.3 }); cue(st + mt, 'pop', { gain: 0.45 }); cue(st + yi, 'sparkle', { dur: 0.4, gain: 0.5 });
  }

  // ── 8 · Change just one letter, and it looks totally different ─────────
  {
    const st = cut(7), on = Wd('one', 7) - st, lt7 = Wd('letter', 7) - st, lk = Wd('looks', 7) - st, df = Wd('different', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 700], zoom: 0.1, note: 'sunny123 chip; last char flips to 4 on "letter" (yellow box); arrows down; two hashes appear: old vs totally new; red ≠ on "different"',
      draw(lt, d, t) {
        fillAll(C.bg); circle(540, 720, 560, '#F1E2C8');
        const changed = lt > lt7;
        K.chip(300, 300, 0.85, PW, 'plain', 1e9, 0, 'BEFORE'); K.chip(780, 300, 0.85, changed ? 'sunny124' : PW, 'plain', 1e9, 0, 'AFTER');
        if (lt > on) { const p = E(seg(lt, on, on + 0.25)); ctx.save(); ctx.globalAlpha = clamp(p); ctx.lineWidth = 9; ctx.strokeStyle = C.red; rr(895, 248, 50, 104, 12); ctx.stroke(); ctx.restore(); }
        if (lt > lk) { const p = E(seg(lt, lk, lk + 0.3)); K.arrow(300, 560, 180 * p, Math.PI / 2, p); K.arrow(780, 560, 180 * p, Math.PI / 2, p); }
        if (lt > lk + 0.2) { K.chip(300, 780, 0.75 * E(seg(lt, lk + 0.2, lk + 0.45)), HASH, 'hash'); }
        if (lt > df - 0.15) { K.chip(780, 780, 0.75 * E(seg(lt, df - 0.15, df + 0.1)), HASH2, 'hash'); }
        if (lt > df) { eq(540, 780, 0.8 * E(seg(lt, df, df + 0.2)), C.red, true); K.pill('TOTALLY DIFFERENT', 540, 1050, 60, C.red, C.white, E(seg(lt, df, df + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + on, 'pop', { gain: 0.35 }); cue(st + lt7, 'tock', { gain: 0.3 }); cue(st + lk, 'slide', { dur: 0.3, gain: 0.25 }); cue(st + df, 'slam', { gain: 0.5 });
  }

  // ── 9 · Good sites even add a random pinch of salt ─────────────────────
  {
    const st = cut(8), rd = Wd('random', 8) - st, pn = Wd('pinch', 8) - st, sl = Wd('salt', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 760], zoom: 0.1, note: 'blender with sunny123 inside; salt shaker swings in, tilts and pours from "pinch"; SALT pill on "salt", random extra chip x7Qp',
      draw(lt, d, t) {
        fillAll(C.bg); circle(540, 760, 560, '#E9E2D2');
        K.blender(480, 860, 1.05, 0, '#FFFFFF', t);
        K.chip(480, 790, 0.45, PW, 'plain', 1e9, 0.6);
        const sx = lerp(1300, 760, eo(seg(lt, 0.05, 0.45))), tilt = lerp(0, 2.5, eio(seg(lt, pn - 0.25, pn + 0.1)));
        K.saltShaker(sx, 360, 1.15, tilt);
        if (lt > pn) K.saltGrains(640, 420, seg(lt, pn, d), 18, 240);
        if (lt > rd) K.chip(860, 640, 0.6 * E(seg(lt, rd, rd + 0.25)), '+x7Qp', 'plain', 1e9, 0.08, null);
        if (lt > sl) K.pill('SALT', 260, 260, 84, C.yellow, C.ink, E(seg(lt, sl, sl + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'slide', { dur: 0.4, gain: 0.3 }); cue(st + rd, 'pop', { gain: 0.35 }); cue(st + pn, 'sparkle', { dur: 0.7, gain: 0.35 }); cue(st + sl, 'pop', { gain: 0.45 });
  }

  // ── 10 · so two people with the same password look different ──────────
  {
    const st = cut(9), tw = Wd('two', 9) - st, sm = Wd('same', 9) - st, df = Wd('different', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 700], zoom: 0.08, note: 'two people icons with the same sunny123 chip (from "two"/"same"); table below: alex / sam with different hashes on "different"',
      draw(lt, d, t) {
        fillAll(C.sky); circle(540, 720, 560, '#CFE8F3');
        for (const [k, x, col] of [[0, 300, '#3A7BD5'], [1, 780, '#E57A8A']]) {
          const a = tw + k * 0.12;
          if (lt > a) K.personIcon(x, 380, 1.5 * E(seg(lt, a, a + 0.25)), col);
          if (lt > sm) K.chip(x, 560, 0.7 * E(seg(lt, sm + k * 0.1, sm + k * 0.1 + 0.25)), PW);
        }
        if (lt > sm) eq(540, 560, 0.8 * E(seg(lt, sm, sm + 0.2)));
        if (lt > df - 0.2) K.dbTable(540, 760, 0.95 * E(seg(lt, df - 0.2, df + 0.1)), [['alex', HASH_A, 'hash'], ['sam', HASH_B, 'hash']]);
        if (lt > df) K.pill('STILL DIFFERENT', 540, 180, 64, C.yellow, C.ink, E(seg(lt, df, df + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + tw, 'pop', { gain: 0.35 }); cue(st + tw + 0.12, 'pop', { gain: 0.3 }); cue(st + sm, 'boing', { gain: 0.3 }); cue(st + df - 0.2, 'thud', { gain: 0.45 }); cue(st + df, 'sparkle', { dur: 0.35, gain: 0.35 });
  }

  // ── 11 · But here's the twist ──────────────────────────────────────────
  {
    const st = cut(10), tw = Wd('twist', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 700], zoom: 0.14, note: 'hero close-up, brows up; red TWIST pill slams on "twist" + shock lines',
      draw(lt, d, t) {
        K.room();
        const hit = lt > tw;
        K.man({ x: 540, y: 1240, s: 1.5, eyes: hit ? 'wide' : 'n', mouth: hit ? 'o' : 'smirk', brow: hit ? 1 : 0.5 });
        if (hit) { K.pill('TWIST', 540, 220, 100, C.red, C.white, E(seg(lt, tw, tw + 0.25))); K.shockLines(540, 560, 300, clamp((lt - tw) * 5)); }
      } });
    cue(st, 'whoosh'); cue(st + tw, 'slam', { gain: 0.5 });
  }

  // ── 12 · if a site ever emails you your old password ──────────────────
  {
    const st = cut(11), em = Wd('emails', 11) - st, od = Wd('old', 11) - st, pw = Wd('password', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 720], zoom: 0.1, note: 'envelope flies in on "emails" and opens; postcard "YOUR PASSWORD IS: sunny123" rises out on "old"; red warning on "password"',
      draw(lt, d, t) {
        fillAll(C.bg); circle(540, 740, 560, '#F6D9DC');
        const ex = lerp(1400, 540, eo(seg(lt, em - 0.1, em + 0.3)));
        const open = seg(lt, em + 0.3, od);
        const card = eo(seg(lt, od, od + 0.4));
        if (card > 0) K.postcard(540, lerp(980, 600, card), lerp(0.6, 1.3, card), -0.04, ['YOUR PASSWORD IS:', PW]);
        K.envelope(ex, lerp(980, 1080, card), 2.4, 0, null, open);
        if (lt > pw) { K.warning(880, 300, 0.9 * E(seg(lt, pw, pw + 0.25))); K.pill('EMAILED BACK?!', 400, 230, 60, C.red, C.white, E(seg(lt, pw, pw + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + em - 0.1, 'zip', { gain: 0.4 }); cue(st + od, 'slide', { dur: 0.4, gain: 0.3 }); cue(st + pw, 'alarm', { dur: 0.5, gain: 0.25 });
  }

  // ── 13 · it was storing the real thing ─────────────────────────────────
  {
    const st = cut(12), so = Wd('storing', 12) - st, re = Wd('real', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 700], zoom: 0.12, note: 'database + table with PLAIN passwords in red (alex sunny123, sam dragon7) from "storing"; red REAL PASSWORDS pill + alarm on "real"',
      draw(lt, d, t) {
        fillAll(C.bg); circle(540, 740, 560, '#F6D9DC');
        K.database(540, 950, 0.7, 0);
        if (lt > so) K.dbTable(540, 260, 0.95 * E(seg(lt, so, so + 0.3)), [['alex', PW, 'red'], ['sam', 'dragon7', 'red']]);
        if (lt > re) { K.pill('REAL PASSWORDS!', 540, 170, 64, C.red, C.white, E(seg(lt, re, re + 0.25))); K.burst(540, 400, 3, clamp(1 - (lt - re) * 2.5)); K.warning(860, 860, 0.7 * E(seg(lt, re, re + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + so, 'thud', { gain: 0.45 }); cue(st + re, 'slam', { gain: 0.5 }); cue(st + re + 0.1, 'alarm', { dur: 0.6, gain: 0.25 });
  }

  // ── 14 · A smart website never actually knows your password (loop) ────
  {
    const st = cut(13), sm = Wd('smart', 13) - st, nv = Wd('never', 13) - st, kn = Wd('knows', 13) - st, pw = Wd('password', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.06, note: 'hero left with phone; server right with a gold hash chip above; ? bubble on "knows"; hero wags finger then winks on "password"',
      draw(lt, d, t) {
        K.room();
        K.server(820, 860, 0.62, t);
        if (lt > sm) K.pill('SMART SITE', 820, 1140, 48, C.ink, C.white, E(seg(lt, sm, sm + 0.25)));
        if (lt > nv) K.chip(800, 520, 0.75 * E(seg(lt, nv, nv + 0.3)), HASH, 'hash', 1e9, 0, 'ONLY KNOWS');
        if (lt > kn) { const p = E(seg(lt, kn, kn + 0.25)); K.chip(800, 250, 0.6 * p, PW, 'plain'); if (p > 0.5) K.redX(800, 250, 0.42 * p, 1); }
        const wag = lt > nv ? Math.sin(lt * 11) * 0.35 : 0;
        K.man({ x: 330, y: 1240, s: 0.9, arm: K.armPose(K.ARM.down, K.ARM.point, eo(seg(lt, nv, nv + 0.3))), finger: lt > nv ? wag : null, eyes: lt > pw + 0.1 ? 'wink' : 'n', mouth: lt > pw + 0.1 ? 'grin' : 'smirk', brow: 0.6, look: 0.4 });
      } });
    cue(st, 'whoosh'); cue(st + sm, 'pop', { gain: 0.3 }); cue(st + nv, 'sparkle', { dur: 0.35, gain: 0.35 }); cue(st + kn, 'slam', { gain: 0.4 }); cue(st + pw + 0.1, 'boing', { gain: 0.4 });
  }

  return { shots: S, cues: CUES };
}
