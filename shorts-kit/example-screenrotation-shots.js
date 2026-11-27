// HOW DOES YOUR PHONE KNOW WHICH WAY IS UP?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const disc = () => { fillAll(C.bg); circle(540, 740, 520, '#E4DCCB'); };
const talk = (lt) => (Math.sin(lt * 18) > 0 ? 'o' : 'smile');
const R90 = -Math.PI / 2;

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · How does your phone know when to flip the screen sideways? ──
  {
    const st = cut(0), kn = Wd('know', 0) - st, fl = Wd('flip', 0) - st, si = Wd('sideways', 0) - st;
    add({ id: 'S01', at: st, cam: [600, 720], zoom: 0.12, note: 'hero beside a big phone playing a video; ? on "know"; phone turns sideways on "flip"; picture turns to fill on "sideways"',
      draw(lt, d, t) {
        disc();
        const r = R90 * eio(seg(lt, fl, fl + 0.45)), tu = eo(seg(lt, si, si + 0.4));
        K.man({ x: 250, y: 930, s: 0.62, arm: K.ARM.point, finger: 0.5, eyes: 'n', mouth: lt > kn ? 'o' : 'smile', brow: lt > kn ? 0.8 : 0.3, look: 1 });
        K.phone(700, 720, 0.82, () => K.rotVideoScreen(r, tu, t), r);
        if (lt > kn) K.qmark(250, 330, 0.85, E(seg(lt, kn, kn + 0.3)), Math.sin(lt * 6) * 0.12);
        if (lt > si) K.rotateIcon(890, 330, 0.55, E(seg(lt, si, si + 0.3)), (lt - si) * 2);
      } });
    cue(st + kn, 'boing', { gain: 0.3 }); cue(st + fl, 'slide', { dur: 0.45, gain: 0.3 }); cue(st + si, 'pop', { gain: 0.4 });
  }
  // ── 2 · Well, inside is a tiny chip called an accelerometer, ──
  {
    const st = cut(1), ins = Wd('inside', 1) - st, ch = Wd('chip', 1) - st, ac = Wd('accelerometer', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 650], zoom: 0.16, note: 'phone goes x-ray on "inside"; small chip glows yellow on "chip"; ACCELEROMETER tag on "accelerometer"',
      draw(lt, d, t) {
        K.xray(t);
        K.phoneXray(540, 760, 1.15, t);
        const cx = 540 + 90 * 1.15, cy = 760 - 10 * 1.15;
        if (lt > ch) K.accelChip(cx, cy, 0.42 * E(seg(lt, ch, ch + 0.3)), 0.6 + 0.4 * Math.sin(lt * 8), '');
        if (lt > ins && lt < ac) K.pill('INSIDE', 540, 180, 64, C.ink, C.white, E(seg(lt, ins, ins + 0.25)));
        if (lt > ac) K.tag('ACCELEROMETER', 540, 180, cx, cy - 50, 62, E(seg(lt, ac, ac + 0.3)));
      } });
    cue(st, 'whoosh'); cue(st + ch, 'sparkle', { dur: 0.4, gain: 0.35 }); cue(st + ac, 'pop', { gain: 0.4 });
  }
  // ── 3 · smaller than a grain of rice. ──
  {
    const st = cut(2), gr = Wd('grain', 2) - st, ri = Wd('rice', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 700], zoom: 0.14, note: 'macro: the chip sits on a fingertip; a grain of rice slides in beside it on "grain" and is bigger; SMALLER THAN RICE pill on "rice"',
      draw(lt, d, t) {
        disc();
        ell(540, 1120, 420, 340, C.skin); ell(540, 1080, 380, 300, '#F0C6AA'); ell(440, 980, 120, 50, '#F6D3BC', -0.3);
        K.accelChip(400, 820, 0.62, 0, 'ACCEL');
        if (lt > gr - 0.2) K.riceGrain(lerp(1300, 700, eo(seg(lt, gr - 0.2, gr + 0.25))), 830, 1.15, -0.25);
        if (lt > ri) K.pill('SMALLER THAN RICE', 540, 380, 62, C.yellow, C.ink, E(seg(lt, ri, ri + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + gr - 0.2, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + ri, 'pop', { gain: 0.4 });
  }
  // ── 4 · In there, a little block of silicon hangs on springs, ──
  {
    const st = cut(3), bl = Wd('block', 3) - st, sp = Wd('springs', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 700], zoom: 0.12, note: 'x-ray cutaway of the chip: frame fades in, block drops in on "block" (SILICON BLOCK pill), springs flash yellow on "springs" and the block bobs',
      draw(lt, d, t) {
        K.xray(t);
        const bob = lt > sp ? Math.sin((lt - sp) * 9) * 14 * Math.exp(-(lt - sp) * 2) : 0;
        K.mems(540, 720, 0.95, { frame: eo(seg(lt, 0, 0.4)), mass: eo(seg(lt, bl - 0.1, bl + 0.3)), dy: bob, hiMass: lt > bl && lt < sp ? 1 : 0, hiSprings: lt > sp ? 1 : 0 });
        if (lt > bl && lt < sp) K.pill('SILICON BLOCK', 540, 150, 60, C.ink, C.white, E(seg(lt, bl, bl + 0.25)));
        if (lt > sp) K.pill('SPRINGS', 540, 150, 64, C.yellow, C.ink, E(seg(lt, sp, sp + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + bl, 'thud', { gain: 0.35 }); cue(st + sp, 'boing', { gain: 0.35 });
  }
  // ── 5 · with comb-like fingers next to fixed ones. ──
  {
    const st = cut(4), fi = Wd('fingers', 4) - st, fx = Wd('fixed', 4) - st;
    add({ id: 'S05', at: st, cam: [700, 720], zoom: 0.2, note: 'push toward the right comb: moving fingers glow yellow on "fingers" (MOVING tag); fixed fingers glow on "fixed" (FIXED tag)',
      draw(lt, d, t) {
        K.xray(t);
        K.mems(540, 720, 0.95, { hiMoving: lt > fi && lt < fx ? 1 : 0, hiFixed: lt > fx ? 1 : 0 });
        if (lt > fi && lt < fx) K.tag('MOVING', 620, 240, 540 + 220 * 0.95, 720 - 180 * 0.95, 60, E(seg(lt, fi, fi + 0.25)));
        if (lt > fx) K.tag('FIXED', 640, 240, 540 + 230 * 0.95, 720 - 135 * 0.95, 64, E(seg(lt, fx, fx + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + fi, 'pop', { gain: 0.4 }); cue(st + fx, 'pop', { gain: 0.4 });
  }
  // ── 6 · When you tilt the phone, gravity tugs that block, ──
  {
    const st = cut(5), ti = Wd('tilt', 5) - st, gr = Wd('gravity', 5) - st, bl = Wd('block', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 720], zoom: 0.1, note: 'the chip frame tilts on "tilt"; big yellow GRAVITY arrow drops in on "gravity"; block slides toward the ground on "block"',
      draw(lt, d, t) {
        K.xray(t);
        const r = 0.5 * eio(seg(lt, ti - 0.1, ti + 0.45));
        const dy = 26 * eo(seg(lt, bl - 0.15, bl + 0.35)) * Math.cos(r);
        K.mems(540, 680, 0.78, { rot: r, dy, hiMass: lt > bl ? 1 : 0 });
        if (lt > gr) { K.gravArrow(850, 860, 300, E(seg(lt, gr, gr + 0.3))); K.pill('GRAVITY', 830, 1200, 56, C.yellow, C.ink, E(seg(lt, gr, gr + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + ti, 'slide', { dur: 0.45, gain: 0.25 }); cue(st + gr, 'thud', { gain: 0.35 }); cue(st + bl, 'slide', { dur: 0.3, gain: 0.3 });
  }
  // ── 7 · so the gaps between the fingers change by a few nanometers. ──
  {
    const st = cut(6), ga = Wd('gaps', 6) - st, ch = Wd('change', 6) - st, na = Wd('nanometers', 6) - st;
    add({ id: 'S07', at: st, cam: [620, 720], zoom: 0.12, note: 'comb close-up: gaps glow yellow on "gaps"; on "change" the block slides and the yellow gaps squeeze/widen; A FEW NANOMETERS pill on "nanometers"',
      draw(lt, d, t) {
        K.xray(t);
        const dy = 14 * Math.sin(seg(lt, ch, ch + 0.5) * Math.PI * 0.5) + (lt > ch + 0.5 ? Math.sin((lt - ch - 0.5) * 4) * 6 : 0);
        K.mems(540, 720, 1.1, { dy, hiGaps: E(seg(lt, ga, ga + 0.25)) });
        if (lt > na) K.pill('A FEW NANOMETERS', 540, 230, 62, C.ink, C.white, E(seg(lt, na, na + 0.25)));
        else if (lt > ga) K.pill('GAPS', 540, 230, 70, C.yellow, C.ink, E(seg(lt, ga, ga + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ga, 'sparkle', { dur: 0.3, gain: 0.3 }); cue(st + ch, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + na, 'pop', { gain: 0.4 });
  }
  // ── 8 · The chip feels that as a change in electricity, ──
  {
    const st = cut(7), fe = Wd('feels', 7) - st, ch = Wd('change', 7) - st, el = Wd('electricity', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 700], zoom: 0.12, note: 'chip wired to a dial meter: chip glows on "feels"; needle swings on "change"; lightning bolt + ELECTRICITY on "electricity"',
      draw(lt, d, t) {
        disc();
        const gl = lt > fe ? 0.6 + 0.4 * Math.sin(lt * 9) : 0;
        line([[330, 760], [330, 980], [740, 980], [740, 920]], C.ink, 14);
        if (lt > ch) { const u = (lt * 1.4) % 1; const p = u < 0.5 ? [330, lerp(760, 980, u * 2)] : [lerp(330, 740, (u - 0.5) * 2), 980]; circle(p[0], p[1], 16, C.yellow); }
        K.accelChip(330, 640, 0.85, gl, 'ACCEL');
        const v = lt > ch ? 0.25 + 0.6 * eob(seg(lt, ch, ch + 0.4)) + Math.sin(lt * 7) * 0.04 : 0.25;
        K.meter(740, 780, 0.9, v, lt > el ? E(seg(lt, el, el + 0.25)) : 0);
        if (lt > el) K.pill('ELECTRICITY', 540, 1180, 62, C.ink, C.white, E(seg(lt, el, el + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + fe, 'sparkle', { dur: 0.3, gain: 0.3 }); cue(st + ch, 'slide', { dur: 0.35, gain: 0.25 }); cue(st + el, 'pop', { gain: 0.4 });
  }
  // ── 9 · so it knows which way gravity is pulling, ──
  {
    const st = cut(8), kn = Wd('knows', 8) - st, wh = Wd('which', 8) - st, pu = Wd('pulling', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 700], zoom: 0.14, note: 'phone wobbles; a yellow arrow on its screen always points DOWN, appears on "which"; check on "knows"; THIS WAY IS DOWN pill on "pulling"',
      draw(lt, d, t) {
        disc();
        const r = Math.sin(lt * 1.8) * 0.5;
        K.phone(540, 720, 0.95, () => K.gravityScreen(r, lt > wh ? E(seg(lt, wh, wh + 0.3)) : 0, lt > pu ? (Math.sin(lt * 10) + 1) / 2 : 0), r);
        if (lt > kn) K.check(870, 330, 1.0, E(seg(lt, kn, kn + 0.25)));
        if (lt > pu) K.pill('THIS WAY IS DOWN', 540, 1200, 58, C.yellow, C.ink, E(seg(lt, pu, pu + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + kn, 'pop', { gain: 0.35 }); cue(st + wh, 'sparkle', { dur: 0.3, gain: 0.3 }); cue(st + pu, 'pop', { gain: 0.35 });
  }
  // ── 10 · and the screen turns to match. ──
  {
    const st = cut(9), sc = Wd('screen', 9) - st, tu = Wd('turns', 9) - st, ma = Wd('match', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 720], zoom: 0.14, note: 'sideways phone with the video still portrait; picture turns and fills on "turns"; check on "match"',
      draw(lt, d, t) {
        disc();
        K.phone(540, 760, 1.05, () => K.rotVideoScreen(R90, eio(seg(lt, tu, tu + 0.4)), t), R90);
        if (lt > sc && lt < ma) K.rotateIcon(540, 300, 0.6, E(seg(lt, sc, sc + 0.25)), (lt - sc) * 3);
        if (lt > ma) K.check(540, 300, 1.2, E(seg(lt, ma, ma + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + tu, 'slide', { dur: 0.4, gain: 0.3 }); cue(st + ma, 'sparkle', { dur: 0.4, gain: 0.35 });
  }
  // ── 11 · Here's the twist: lay your phone flat on a table, ──
  {
    const st = cut(10), tw = Wd('twist', 10) - st, fl = Wd('flat', 10) - st, ta = Wd('table', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.12, note: 'TWIST! text; side view: phone lowers and lands flat on a table on "flat"; FLAT ON A TABLE pill on "table"',
      draw(lt, d, t) {
        disc();
        K.tableSide(540, 860, 1, eo(seg(lt, fl - 0.4, fl + 0.05)), 1);
        if (lt > tw && lt < ta) bigText('TWIST!', 540, 260, 130, C.yellow, -0.05, E(seg(lt, tw, tw + 0.2)));
        if (lt > ta) K.pill('FLAT ON A TABLE', 540, 260, 62, C.ink, C.white, E(seg(lt, ta, ta + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + tw, 'boing', { gain: 0.3 }); cue(st + fl + 0.05, 'thud', { gain: 0.4 });
  }
  // ── 12 · and gravity points straight through the screen, ──
  {
    const st = cut(11), gr = Wd('gravity', 11) - st, sr = Wd('straight', 11) - st, sc = Wd('screen', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 800], zoom: 0.16, note: 'close side view: gravity arrow comes down on "gravity" and pierces straight through the lying phone on "straight"; THROUGH THE SCREEN pill',
      draw(lt, d, t) {
        disc();
        const p = lt > gr ? eo(seg(lt, gr, sr + 0.3)) : 0;
        K.tableSide(540, 1000, 1.3, 1, 1);
        if (lt > gr) {
          K.gravArrow(540, 260, lerp(300, 880, p), E(seg(lt, gr, gr + 0.25)));
          if (p > 0.6) { ctx.save(); ctx.beginPath(); ctx.rect(-300, 950, W + 600, 50); ctx.clip(); K.tableSide(540, 1000, 1.3, 1, 1); ctx.restore(); }
        }
        if (lt > sc) K.pill('THROUGH THE SCREEN', 540, 250, 58, C.yellow, C.ink, E(seg(lt, sc, sc + 0.25)));
        else if (lt > gr) K.pill('GRAVITY', 540, 250, 64, C.ink, C.white, E(seg(lt, gr, gr + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + gr, 'slide', { dur: 0.6, gain: 0.3 }); cue(st + sr + 0.3, 'thud', { gain: 0.35 }); cue(st + sc, 'pop', { gain: 0.35 });
  }
  // ── 13 · so it can't tell which side is up, and won't rotate. ──
  {
    const st = cut(12), ca = Wd("can't", 12) - st, up = Wd('up', 12) - st, wo = Wd("won't", 12) - st;
    add({ id: 'S13', at: st, cam: [540, 720], zoom: 0.12, note: 'top view: phone lying on a table spins slowly, its picture does NOT turn; ? marks on "can\'t" and "up"; rotate icon gets a red X on "won\'t"',
      draw(lt, d, t) {
        K.tableTop();
        const r = -lt * 0.9;
        ell(560, 760, 230, 400, 'rgba(0,0,0,0.12)', r);
        K.phone(540, 740, 0.95, () => K.rotVideoScreen(r, 0, t), r);
        if (lt > ca) K.qmark(200, 330, 0.8, E(seg(lt, ca, ca + 0.25)), Math.sin(lt * 6) * 0.15);
        if (lt > up) K.qmark(880, 330, 0.8, E(seg(lt, up, up + 0.25)), -Math.sin(lt * 6) * 0.15);
        if (lt > wo) { K.rotateIcon(540, 230, 0.6, E(seg(lt, wo, wo + 0.25))); K.redX(540, 230, 0.42, E(seg(lt, wo + 0.1, wo + 0.3))); }
      } });
    cue(st, 'whoosh'); cue(st + ca, 'boing', { gain: 0.3 }); cue(st + wo + 0.1, 'slam', { gain: 0.35 });
  }
  // ── 14+15 · Your phone doesn't see up, it feels it. ──
  {
    const st = cut(13), se = Wd('see', 13) - st, fe = Wd('feels', 14) - st;
    add({ id: 'S14', at: st, cam: [540, 640], zoom: 0.16, note: 'hero to camera holding his phone; SEE? pill gets a red X on "see"; on "feels" he winks, phone tilts, IT FEELS IT pill + gravity arrow',
      draw(lt, d, t) {
        disc();
        const tl = lt > fe ? 0.35 * eio(seg(lt, fe, fe + 0.4)) : 0;
        K.man({ x: 540, y: 960, s: 0.78, arm: K.PHONE_ARM, holding: (x, y) => K.phone(x + 10, y - 40, 0.3, () => K.rotVideoScreen(tl, 1, t), tl), eyes: lt > fe ? 'wink' : 'n', mouth: lt > fe ? 'smirk' : talk(lt), brow: 0.4 });
        if (lt > se && lt < fe) { K.pill('SEE?', 540, 210, 80, C.ink, C.white, E(seg(lt, se - 0.1, se + 0.15))); K.redX(540, 210, 0.42, E(seg(lt, se + 0.05, se + 0.25))); }
        if (lt > fe) { K.pill('IT FEELS IT', 540, 210, 80, C.yellow, C.ink, E(seg(lt, fe, fe + 0.25))); K.gravArrow(900, 520, 260, E(seg(lt, fe + 0.1, fe + 0.4))); }
      } });
    cue(st, 'whoosh'); cue(st + se + 0.05, 'slam', { gain: 0.3 }); cue(st + fe, 'sparkle', { dur: 0.5, gain: 0.35 });
  }
  return { shots: S, cues: CUES };
}
