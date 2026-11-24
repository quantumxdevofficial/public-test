// HOW DOES YOUR MOUSE KNOW WHERE YOU MOVED IT?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const disc = () => { fillAll(C.bg); circle(540, 740, 520, '#E4DCCB'); };
const GREEN = '#3FAE5F';
const MON = [540, 470, 0.78];
const curOnMon = (ux, uy) => [MON[0] + ux * 230 * MON[2], MON[1] + uy * 130 * MON[2]];
const mat = (y) => { rr(160, y - 170, 760, 340, 40); ctx.fillStyle = '#2F3A52'; ctx.fill(); rr(180, y - 150, 720, 300, 30); ctx.fillStyle = '#3A4766'; ctx.fill(); };
const fmt = (n) => Math.floor(n).toLocaleString('en-US');

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · How does your mouse know where you moved it? ──────────
  {
    const st = cut(0), mo = Wd('moved', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 700], zoom: 0.12, note: 'monitor top, mouse on a mat below; mouse slides and cursor follows; HOW? pill on "moved"',
      draw(lt, d, t) {
        disc();
        const ux = Math.sin(lt * 2.2) * 0.8, uy = Math.sin(lt * 1.5 + 1) * 0.6;
        K.monitor(MON[0], MON[1], MON[2], K.desktopIcons, E(seg(lt, 0, 0.3)));
        const [cx, cy] = curOnMon(ux, uy); K.cursor(cx, cy, 0.8);
        mat(1010);
        K.pcMouse(540 + ux * 220, 1010 + uy * 70, 0.5, 0, 0);
        if (lt > mo) { K.pill('HOW?', 880, 180, 72, C.yellow, C.ink, E(seg(lt, mo, mo + 0.25))); K.burst(880, 180, 2, 1 - seg(lt, mo, mo + 0.5)); }
      } });
    cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + 0.2, 'slide', { dur: 1.2, gain: 0.15 }); cue(st + mo, 'pop', { gain: 0.45 });
  }
  // ── 2 · Flip it over, and there's a little red light ─────────
  {
    const st = cut(1), ov = Wd('over', 1) - st, re = Wd('red', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 700], zoom: 0.14, note: 'big mouse flips over (x squash) on "over"; bottom view; red LED lights on "red", RED LIGHT tag',
      draw(lt, d, t) {
        disc();
        const f = seg(lt, ov - 0.25, ov + 0.15), sx = Math.abs(Math.cos(f * Math.PI));
        ctx.save(); ctx.translate(540, 720); ctx.scale(Math.max(0.02, sx), 1); ctx.translate(-540, -720);
        if (f < 0.5) K.pcMouse(540, 720, 1.25, 0, 0); else K.mouseBottom(540, 720, 1.25, lt > re ? E(seg(lt, re, re + 0.2)) : 0, t);
        ctx.restore();
        if (lt > re) K.tag('RED LIGHT', 540, 1150, 540, 800, 58, E(seg(lt, re, re + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ov - 0.2, 'zip', { gain: 0.3 }); cue(st + re, 'sparkle', { dur: 0.4, gain: 0.3 });
  }
  // ── 3 · shining on your desk, ─────────────────────────────────
  {
    const st = cut(2), sh = Wd('shining', 2) - st, de = Wd('desk', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 720], zoom: 0.16, note: 'x-ray side cutaway of mouse on desk; red beam travels from LED down to the desk on "shining"; DESK tag on "desk"',
      draw(lt, d, t) {
        K.xray(t);
        K.mouseXray(540, 900, 1.9, t, 0.5 * seg(lt, sh - 0.1, sh + 0.4));
        if (lt > de) K.tag('DESK', 260, 1140, 400, 930, 56, E(seg(lt, de, de + 0.25)));
        if (lt > 0.1) K.tag('LED', 220, 420, 310, 820, 50, E(seg(lt, 0.1, 0.35)));
      } });
    cue(st, 'whoosh'); cue(st + sh, 'slide', { dur: 0.4, gain: 0.2 }); cue(st + de, 'pop', { gain: 0.35 });
  }
  // ── 4 · right next to a tiny camera ───────────────────────────
  {
    const st = cut(3), ca = Wd('camera', 3) - st, ti = Wd('tiny', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 760], zoom: 0.22, note: 'same cutaway; light bounces up into the yellow sensor chip; glow + TINY CAMERA tag on "camera"',
      draw(lt, d, t) {
        K.xray(t);
        K.mouseXray(540, 900, 1.9, t, lerp(0.5, 1, seg(lt, 0, ti)));
        if (lt > ti) { ctx.save(); ctx.globalAlpha = 0.4 * E(seg(lt, ti, ti + 0.3)); circle(540, 830, 110 + 8 * Math.sin(lt * 9), C.yellow); ctx.restore(); }
        if (lt > ca) K.tag('TINY CAMERA', 700, 400, 560, 810, 56, E(seg(lt, ca, ca + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ti, 'pop', { gain: 0.35 }); cue(st + ca, 'pop', { gain: 0.4 });
  }
  // ── 5 · snapping over a thousand pictures a second. ───────────
  {
    const st = cut(4), sn = Wd('snapping', 4) - st, th = Wd('thousand', 4) - st, se = Wd('second', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 700], zoom: 0.12, note: 'small cutaway top flashing; photos of the desk fly out and stack; counter 1,000+ on "thousand", PER SECOND on "second"',
      draw(lt, d, t) {
        K.xray(t);
        const fl = lt > sn ? Math.max(0, 1 - (((lt - sn) * 9) % 1) * 3) : 0;
        K.mouseXray(540, 400, 0.8, t, 1, fl * 0.8);
        const n = lt > sn ? Math.min(9, Math.floor((lt - sn) * 5) + 1) : 0;
        for (let k = 0; k < n; k++) K.snapFrame(300 + k * 60, 760 + (k % 2) * 16, 200, [k * 9, k * 4], null, 1, C.ink);
        if (lt > th - 0.1) K.wideCounter(540, 1080, 1.1 * E(seg(lt, th - 0.1, th + 0.15)), fmt(1000 * eio(seg(lt, th - 0.1, th + 0.5))) + '+', lt > se ? 'PICTURES PER SECOND' : 'PICTURES', C.yellow);
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 6; k++) cue(st + sn + k * 0.2, 'tock', { gain: 0.18 }); cue(st + th, 'slam', { gain: 0.35 }); cue(st + se, 'pop', { gain: 0.4 });
  }
  // ── 6 · Even a smooth desk is full of tiny bumps, ─────────────
  {
    const st = cut(5), sm = Wd('smooth', 5) - st, bu = Wd('bumps', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 720], zoom: 0.12, note: 'plain smooth desk top with mouse; SMOOTH? pill; magnifier lens grows after "smooth" and reveals bumps; TINY BUMPS pill on "bumps"',
      draw(lt, d, t) {
        fillAll(K.MOUSE_COLS.DESK); ctx.fillStyle = K.MOUSE_COLS.DESK_L; ctx.fillRect(-300, -300, W + 600, 120);
        if (lt < bu) K.pill('SMOOTH?', 540, 240, 62, C.white, C.ink, E(seg(lt, sm - 0.2, sm + 0.05)));
        K.pcMouse(230, 1100, 0.4, 0.2, 0);
        K.lens(600, 700, 360, E(seg(lt, sm + 0.1, sm + 0.6)), () => K.bumpTexture(240, 340, 720, 720, [lt * 10, 0], 1.6));
        if (lt > bu) K.pill('TINY BUMPS', 540, 240, 64, C.yellow, C.ink, E(seg(lt, bu, bu + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sm + 0.15, 'sparkle', { dur: 0.5, gain: 0.25 }); cue(st + bu, 'pop', { gain: 0.4 });
  }
  // ── 7 · so a chip compares each picture to the last, ──────────
  {
    const st = cut(6), ch = Wd('chip', 6) - st, co = Wd('compares', 6) - st, la = Wd('last', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 700], zoom: 0.1, note: 'chip on top; two photos BEFORE / NOW below; arrows from photos to chip on "compares"; label becomes LAST on "last"',
      draw(lt, d, t) {
        disc();
        K.cpuChip(540, 330, 0.75 * E(seg(lt, ch - 0.2, ch + 0.1)), 0, 'CHIP');
        const sl = 60 * eio(seg(lt, 0.2, 1.2));
        K.snapFrame(300, 820, 340, [0, 0], lt > la ? 'LAST' : 'BEFORE', E(seg(lt, 0, 0.3)));
        K.snapFrame(780, 820, 340, [sl, sl * 0.3], 'NOW', E(seg(lt, 0.15, 0.45)));
        if (lt > co) { const p = eio(seg(lt, co, co + 0.4)); line([[330, 600], [lerp(330, 470, p), lerp(600, 420, p)]], C.yellow, 16); line([[750, 600], [lerp(750, 610, p), lerp(600, 420, p)]], C.yellow, 16); }
      } });
    cue(st, 'whoosh'); cue(st + ch, 'pop', { gain: 0.4 }); cue(st + co, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + la, 'pop', { gain: 0.35 });
  }
  // ── 8 · sees how far the bumps slid, ──────────────────────────
  {
    const st = cut(7), fa = Wd('far', 7) - st, sl = Wd('slid', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 720], zoom: 0.16, note: 'one big photo; a bump ringed white (old spot) and yellow (new spot) slides; HOW FAR? on "far"; SLID pill on "slid"',
      draw(lt, d, t) {
        disc();
        const m = 140 * eio(seg(lt, 0.1, sl));
        K.snapFrame(540, 740, 640, [m, m * 0.4], null, 1);
        ctx.save(); ctx.lineWidth = 12; ctx.setLineDash([18, 14]); ctx.strokeStyle = C.white; ctx.beginPath(); ctx.arc(430, 660, 60, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
        ctx.save(); ctx.lineWidth = 14; ctx.strokeStyle = C.yellow; ctx.beginPath(); ctx.arc(430 + m, 660 + m * 0.4, 60, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
        if (lt > fa) K.pill('HOW FAR?', 540, 280, 60, C.ink, C.white, E(seg(lt, fa, fa + 0.3)));
        if (lt > sl) K.pill('SLID →', 540, 1170, 64, C.yellow, C.ink, E(seg(lt, sl, sl + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.2, 'slide', { dur: 0.8, gain: 0.2 }); cue(st + fa, 'pop', { gain: 0.35 }); cue(st + sl, 'pop', { gain: 0.4 });
  }
  // ── 9 · and moves your cursor to match. ───────────────────────
  {
    const st = cut(8), mv = Wd('moves', 8) - st, ma = Wd('match', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 700], zoom: 0.1, note: 'monitor + mouse on mat; mouse slides, cursor slides the same on "moves"; green MATCH pill on "match"',
      draw(lt, d, t) {
        disc();
        const u = eio(seg(lt, mv - 0.1, ma));
        K.monitor(MON[0], MON[1], MON[2], K.desktopIcons);
        const [cx, cy] = curOnMon(lerp(-0.7, 0.7, u), lerp(-0.4, 0.3, u));
        if (u > 0.02) K.trail([curOnMon(-0.7, -0.4), [cx, cy]], 1, C.yellow, 10, true);
        K.cursor(cx, cy, 0.8);
        mat(1010);
        K.pcMouse(540 + lerp(-0.7, 0.7, u) * 220, 1010 + lerp(-0.4, 0.3, u) * 70, 0.5, 0, 0);
        if (lt > ma) K.pill('MATCH!', 540, 170, 64, GREEN, C.white, E(seg(lt, ma, ma + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + mv, 'slide', { dur: 0.7, gain: 0.25 }); cue(st + ma, 'sparkle', { dur: 0.4, gain: 0.3 });
  }
  // ── 10 · That's why it goes crazy on glass. ───────────────────
  {
    const st = cut(9), cr = Wd('crazy', 9) - st, gl = Wd('glass', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 700], zoom: 0.12, note: 'monitor; mouse on a glass slab below; cursor jitters wildly on "crazy"; red warning; GLASS tag on "glass"',
      draw(lt, d, t) {
        disc();
        const j = lt > cr ? 1 : 0;
        K.monitor(MON[0], MON[1], MON[2], K.desktopIcons);
        const jx = j * (rnd(Math.floor(lt * 14)) - 0.5) * 1.6, jy = j * (rnd(Math.floor(lt * 14) + 9) - 0.5) * 1.4;
        const [cx, cy] = curOnMon(jx, jy); K.cursor(cx, cy, 0.8);
        if (j) K.shockLines(cx + 20, cy + 30, 70, 0.8);
        K.glassSlab(540, 1040, 0.95);
        K.pcMouse(540, 1010, 0.42, 0, 0);
        if (j) K.warning(820, 200, 0.7 * E(seg(lt, cr, cr + 0.25)));
        if (lt > gl) K.tag('GLASS', 200, 880, 330, 1010, 56, E(seg(lt, gl, gl + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + cr, 'alarm', { dur: 0.8, gain: 0.25 }); cue(st + gl, 'pop', { gain: 0.4 });
  }
  // ── 11 · There's nothing for the camera to grab onto. ─────────
  {
    const st = cut(10), no = Wd('nothing', 10) - st, gr = Wd('grab', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 720], zoom: 0.12, note: 'camera photo of glass = blank pale blue frame; red X on "nothing"; NO BUMPS on "grab"',
      draw(lt, d, t) {
        disc();
        ctx.save(); ctx.translate(540, 720);
        rr(-334, -334, 668, 668, 22); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
        rr(-320, -320, 640, 640, 0); ctx.fillStyle = '#BFE0EC'; ctx.fill();
        ctx.globalAlpha = 0.8; line([[-200, 200], [-60, -160]], C.white, 18); line([[40, 220], [160, -60]], C.white, 12); ctx.restore();
        K.pill('CAMERA VIEW', 540, 270, 52, C.ink, C.white);
        if (lt > no) K.redX(540, 720, lerp(1.8, 1, eo(seg(lt, no, no + 0.2))), 1);
        if (lt > gr) K.pill('NO BUMPS', 540, 1170, 62, C.red, C.white, E(seg(lt, gr, gr + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + no + 0.05, 'slam', { gain: 0.4 }); cue(st + gr, 'pop', { gain: 0.35 });
  }
  // ── 12 · And the very first mouse, from nineteen sixty four, ──
  {
    const st = cut(11), fi = Wd('first', 11) - st, ni = Wd('nineteen', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 720], zoom: 0.12, note: 'wooden mouse drops in on "first"; FIRST MOUSE pill; 1964 year card on "nineteen"',
      draw(lt, d, t) {
        disc();
        const dr = eob(seg(lt, 0.05, 0.45));
        if (dr > 0) K.woodMouse(400, lerp(-300, 1080, dr), 1.0, 0, Math.sin(lt * 4) * 0.5);
        if (lt > fi) K.pill('FIRST MOUSE', 540, 200, 62, C.yellow, C.ink, E(seg(lt, fi, fi + 0.25)));
        if (lt > ni - 0.1) K.yearCard(760, 560, 0.5 * E(seg(lt, ni - 0.1, ni + 0.2)), '1964', 'YEAR', 0.08);
      } });
    cue(st, 'whoosh'); cue(st + 0.4, 'thud', { gain: 0.4 }); cue(st + ni, 'slam', { gain: 0.35 });
  }
  // ── 13 · was a wooden box on two metal wheels, ────────────────
  {
    const st = cut(12), wo = Wd('wooden', 12) - st, wh = Wd('wheels', 12) - st, me = Wd('metal', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 860], zoom: 0.18, note: 'close on wooden mouse; WOOD tag on "wooden"; wheels spin + 2 METAL WHEELS tag on "metal"',
      draw(lt, d, t) {
        disc();
        const spin = lt > me ? (lt - me) * 8 : 0;
        K.woodMouse(440, 1000, 1.4, spin, Math.sin(lt * 4) * 0.5);
        if (lt > wo) K.tag('WOOD', 260, 380, 380, 720, 58, E(seg(lt, wo, wo + 0.25)));
        if (lt > me) K.tag('2 METAL WHEELS', 620, 1170, 580, 1000, 52, E(seg(lt, me, me + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + wo, 'pop', { gain: 0.35 }); cue(st + me, 'slide', { dur: 0.6, gain: 0.25 }); cue(st + wh, 'pop', { gain: 0.35 });
  }
  // ── 14 · nicknamed a mouse because its cord looked like a tail. ─
  {
    const st = cut(13), co = Wd('cord', 13) - st, ta = Wd('tail', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.12, note: 'wooden mouse with cord curling right; cord glows yellow on "cord"; cute mouse animal pops in on "tail"; = TAIL! pill',
      draw(lt, d, t) {
        disc();
        if (lt > co) { ctx.save(); ctx.globalAlpha = 0.35 * E(seg(lt, co, co + 0.3)); ctx.translate(250, 660); ctx.scale(0.92, 0.92); ctx.beginPath(); ctx.moveTo(180, -60); ctx.bezierCurveTo(280, -60, 300, -170, 400, -150); ctx.bezierCurveTo(470, -140, 470, -60, 540, -80); ctx.lineWidth = 60; ctx.strokeStyle = C.yellow; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore(); }
        K.woodMouse(250, 660, 0.92, 0, 0);
        K.mouseAnimal(580, 1170, 1.15, lt, E(seg(lt, ta - 0.2, ta + 0.1)));
        if (lt > co && lt < ta) K.pill('CORD', 680, 300, 58, C.ink, C.white, E(seg(lt, co, co + 0.25)));
        if (lt > ta) K.pill('= TAIL!', 680, 300, 64, C.yellow, C.ink, E(seg(lt, ta, ta + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + co, 'pop', { gain: 0.35 }); cue(st + ta - 0.1, 'boing', { gain: 0.4 });
  }
  // ── 15 · So when your cursor jumps, ───────────────────────────
  {
    const st = cut(14), ju = Wd('jumps', 14) - st;
    add({ id: 'S15', at: st, cam: [540, 560], zoom: 0.18, note: 'big monitor, cursor still, then leaps across the screen on "jumps" with shock lines; JUMP! pill',
      draw(lt, d, t) {
        disc();
        K.monitor(540, 600, 1.1, K.desktopIcons);
        const u = lt > ju ? eob(seg(lt, ju, ju + 0.25)) : 0;
        const cx = lerp(380, 760, u), cy = lerp(520, 330, u) - Math.sin(clamp(u) * Math.PI) * 120;
        K.cursor(cx, cy, 1.1);
        if (lt > ju) { K.shockLines(cx + 30, cy + 40, 100, 1 - seg(lt, ju + 0.3, ju + 0.9)); K.pill('JUMP!', 540, 1110, 64, C.red, C.white, E(seg(lt, ju, ju + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + ju, 'boing', { gain: 0.4 });
  }
  // ── 16 · don't blame the mouse. ───────────────────────────────
  {
    const st = cut(15), bl = Wd('blame', 15) - st, mo = Wd('mouse', 15) - st;
    add({ id: 'S16', at: st, cam: [540, 650], zoom: 0.1, note: 'room; hero holds a mouse, wags finger on "blame"; NOT THE MOUSE pill',
      draw(lt, d, t) {
        K.room();
        const w = lt > bl;
        K.man({ x: 540, y: 1150, s: 0.95, arm: K.PHONE_ARM, armL: w ? K.ARM.point : K.ARM.down, finger: w ? Math.sin(lt * 11) * 0.35 : undefined,
          holding: (x, y) => K.pcMouse(x + 14, y - 40, 0.28, 0.3, 0), eyes: 'n', mouth: w ? 'smirk' : 'flat', smirk: w, brow: w ? 0.7 : 0.2 });
        if (lt > mo) K.pill('NOT THE MOUSE', 540, 200, 60, C.red, C.white, E(seg(lt, mo, mo + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + bl, 'boing', { gain: 0.3 });
  }
  // ── 17 · Blame the desk. ──────────────────────────────────────
  {
    const st = cut(16), de = Wd('desk', 16) - st;
    add({ id: 'S17', at: st, cam: [540, 700], zoom: 0.12, note: 'hero behind a glass desk with the mouse on it; winks to camera on "desk"; BLAME THE DESK pill',
      draw(lt, d, t) {
        K.room();
        const w = lt > de;
        K.man({ x: 540, y: 1150, s: 0.85, arm: K.ARM.hip, armL: K.ARM.down, eyes: w ? 'wink' : 'n', mouth: w ? 'grin' : 'smile', smirk: w, brow: 0.5 });
        K.desk(540, 1010, 1.0);
        K.pcMouse(760, 975, 0.2, 0.2, 0);
        if (w) K.pill('BLAME THE DESK', 540, 190, 60, C.yellow, C.ink, E(seg(lt, de, de + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + de, 'sparkle', { dur: 0.5, gain: 0.35 });
  }
  return { shots: S, cues: CUES };
}
