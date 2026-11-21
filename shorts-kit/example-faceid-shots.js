// HOW DOES FACE ID ACTUALLY KNOW IT'S YOU?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T, lineWords } from './core/timing.js';
const lastW = (i) => lineWords(i).at(-1).s;
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const disc = (y = 740) => { fillAll(C.bg); circle(540, y, 520, '#E4DCCB'); };
const xbg = () => { fillAll(C.xnavy); ctx.strokeStyle = 'rgba(79,209,232,0.10)'; ctx.lineWidth = 3; for (let k = -300; k < W + 300; k += 90) { ctx.beginPath(); ctx.moveTo(k, -300); ctx.lineTo(k, H + 300); ctx.stroke(); } for (let k = -300; k < H + 300; k += 90) { ctx.beginPath(); ctx.moveTo(-300, k); ctx.lineTo(W + 300, k); ctx.stroke(); } };
const GREEN = K.FACE_GREEN;
const STRANGER = { hair: '#C9A15A', hairHi: '#DDB873', shirt: '#C8734A' };

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · How does your phone know it's your face, and not a photo of you? ──
  {
    const st = cut(0), ph = Wd('phone', 0) - st, fa = Wd('face', 0) - st, po = Wd('photo', 0) - st, yo = lastW(0) - st;
    add({ id: 'S01', at: st, cam: [540, 700], zoom: 0.12, note: 'hero face left + phone right; scan → green YOU ✓ on "face"; a photo card slides in on "photo", phone shakes red NOT YOU ✗ on "you"',
      draw(lt, d, t) {
        disc(700);
        const rej = lt > yo;
        const photoIn = eio(seg(lt, po - 0.3, po + 0.1));
        if (photoIn < 1) { ctx.save(); ctx.globalAlpha = 1 - photoIn; K.faceHead(300, 560, 1.45 * E(seg(lt, 0, 0.35)), { mouth: lt > fa ? 'grin' : 'smile' }); ctx.restore(); }
        if (photoIn > 0) K.photoCard(lerp(-250, 300, photoIn), 620, 0.95, -0.08);
        const shake = rej ? Math.sin((lt - yo) * 50) * 14 * (1 - seg(lt, yo, yo + 0.5)) : 0;
        const state = rej ? -1 : (lt > fa && photoIn <= 0) ? 1 : 0;
        K.phone(800 + shake, 660, 0.95 * E(seg(lt, ph - 0.35, ph)), K.faceLockScreen(state, 1, lt));
        if (state === 1) K.pill('YOU ✓', 540, 180, 80, GREEN, C.white, E(seg(lt, fa, fa + 0.25)));
        if (rej) K.pill('NOT YOU ✗', 540, 180, 80, C.red, C.white, E(seg(lt, yo, yo + 0.25)));
      } });
    cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + ph, 'pop', { gain: 0.3 }); cue(st + fa, 'sparkle', { dur: 0.4, gain: 0.35 }); cue(st + po - 0.3, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + yo, 'boing', { gain: 0.4 });
  }
  // ── 2 · Well, a tiny projector above the screen ───────────────────
  {
    const st = cut(1), pr = Wd('projector', 1) - st, sc = Wd('screen', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 520], zoom: 0.2, note: 'phone top fills frame; sensor strip zooms in; projector lens glows red + PROJECTOR tag on "projector"; screen lights + ABOVE THE SCREEN on "screen"',
      draw(lt, d, t) {
        disc(600);
        const z = eio(seg(lt, 0, 0.5)), py = lerp(980, 1250, z), ps = lerp(1.2, 2.4, z);
        const lit = lt > sc;
        K.phone(540, py, ps, () => { ctx.fillStyle = lit ? '#3A5A8A' : '#1F2A44'; ctx.fillRect(-166, -350, 332, 700); });
        const ny = py - 327 * ps;
        const nb = K.notchBar(540, ny, lerp(0.35, 0.75, z), lt > pr ? 0.6 + 0.4 * Math.sin(lt * 10) : 0, 0);
        if (lt > pr) K.tag('PROJECTOR', 300, 200, nb.proj, ny - 20, 62, E(seg(lt, pr, pr + 0.25)));
        if (lit) K.pill('ABOVE THE SCREEN', 540, 1130, 66, C.ink, C.white, E(seg(lt, sc, sc + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'zip', { gain: 0.25 }); cue(st + pr, 'pop', { gain: 0.4 }); cue(st + sc, 'pop', { gain: 0.35 });
  }
  // ── 3 · sprays thousands of invisible infrared dots across your face ──
  {
    const st = cut(2), sp = Wd('sprays', 2) - st, th = Wd('thousands', 2) - st, inf = Wd('infrared', 2) - st, dt = Wd('dots', 2) - st, fa = Wd('face', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 700], zoom: 0.12, note: 'infrared view: navy face silhouette; projector at top sprays a cone; dots land top→bottom from "sprays" to "face"; 1000s on "thousands", INFRARED on "infrared", INVISIBLE on "dots"',
      draw(lt, d, t) {
        xbg();
        K.irFace(540, 720, 2.3, E(seg(lt, 0, 0.3)));
        const p = eio(seg(lt, sp, fa + 0.3));
        const nb = K.notchBar(540, 150, 0.9, 0.7 + 0.3 * Math.sin(lt * 10), 0);
        if (p > 0 && p < 1) { ctx.save(); ctx.globalAlpha = 0.12; ctx.beginPath(); ctx.moveTo(nb.proj, 150); ctx.lineTo(180, 1000); ctx.lineTo(900, 1000); ctx.closePath(); ctx.fillStyle = C.red; ctx.fill(); ctx.restore(); }
        K.faceDots(540, 720, 2.3, p, { col: C.red, r: 3.4 });
        if (lt > th && lt < inf) K.pill('1000s OF DOTS', 540, 1140, 72, C.yellow, C.ink, E(seg(lt, th, th + 0.25)));
        if (lt > inf) K.pill('INFRARED', 540, 1140, 76, C.red, C.white, E(seg(lt, inf, inf + 0.25)));
        if (lt > dt) K.pill('INVISIBLE TO YOU', 780, 300, 50, C.ink, C.white, E(seg(lt, dt, dt + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sp, 'sparkle', { dur: fa - sp + 0.3, gain: 0.25 }); cue(st + th, 'pop', { gain: 0.35 }); cue(st + inf, 'pop', { gain: 0.35 }); cue(st + dt, 'pop', { gain: 0.3 });
  }
  // ── 4 · and a special camera reads where each one lands ──────────
  {
    const st = cut(3), ca = Wd('camera', 3) - st, re = Wd('reads', 3) - st, la = Wd('lands', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 680], zoom: 0.14, note: 'same IR view; IR camera lens glows cyan + IR CAMERA tag on "camera"; a scan line sweeps down from "reads" turning dots yellow; crosshairs pop on a few dots on "lands"',
      draw(lt, d, t) {
        xbg();
        K.irFace(540, 720, 2.3);
        const nb = K.notchBar(540, 150, 0.9, 0.5, lt > ca ? 0.6 + 0.4 * Math.sin(lt * 9) : 0);
        const r = eio(seg(lt, re, la + 0.2));
        K.faceDots(540, 720, 2.3, 1, { col: C.red, r: 3.4, read: r * 1.05 - 0.02 });
        if (r > 0 && r < 1) { const yy = lerp(440, 1000, r); line([[260, yy], [820, yy]], C.cyan, 8); }
        if (lt > ca) K.tag('IR CAMERA', 760, 330, nb.cam, 170, 56, E(seg(lt, ca, ca + 0.25)));
        if (lt > la) for (const [cx, cy, k] of [[430, 640, 0], [650, 760, 1], [540, 900, 2]]) {
          const a = E(seg(lt, la + k * 0.08, la + k * 0.08 + 0.25)); if (a <= 0) continue;
          ctx.save(); ctx.strokeStyle = C.yellow; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(cx, cy, 34 * a, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
          line([[cx - 52 * a, cy], [cx - 20 * a, cy]], C.yellow, 6); line([[cx + 20 * a, cy], [cx + 52 * a, cy]], C.yellow, 6); line([[cx, cy - 52 * a], [cx, cy - 20 * a]], C.yellow, 6); line([[cx, cy + 20 * a], [cx, cy + 52 * a]], C.yellow, 6);
        }
      } });
    cue(st, 'whoosh'); cue(st + ca, 'pop', { gain: 0.35 }); cue(st + re, 'slide', { dur: la - re + 0.2, gain: 0.2 }); cue(st + la, 'pop', { gain: 0.3 }); cue(st + la + 0.16, 'pop', { gain: 0.25 });
  }
  // ── 5 · Dots on your nose land closer than dots on your cheeks ───
  {
    const st = cut(4), no = Wd('nose', 4) - st, cl = Wd('closer', 4) - st, ch = Wd('cheeks', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 700], zoom: 0.12, note: 'side view: phone edge-on at left, head profile facing it; short yellow ray to nose tip on "nose" + CLOSER on "closer"; longer cyan ray to cheek + FARTHER on "cheeks"',
      draw(lt, d, t) {
        disc(700);
        const px = 150, py = 700;
        K.phoneEdge(px, py, 1.1);
        const g = K.profileHead(lerp(1300, 700, eo(seg(lt, 0, 0.4))), 600, 1.9);
        const sx = px + 30, sy = py - 330;
        const ray = (tx, ty, p, col) => { if (p <= 0) return; line([[sx, sy], [lerp(sx, tx, p), lerp(sy, ty, p)]], col, 10); if (p >= 1) circle(tx, ty, 14, col); };
        ray(g.nose[0], g.nose[1], eio(seg(lt, no - 0.15, no + 0.2)), C.yellow);
        ray(g.cheek[0], g.cheek[1], eio(seg(lt, ch - 0.15, ch + 0.2)), C.cyan);
        if (lt > cl) K.pill('NOSE = CLOSER', 540, 180, 66, C.yellow, C.ink, E(seg(lt, cl, cl + 0.25)));
        if (lt > ch) K.pill('CHEEK = FARTHER', 540, 1130, 62, C.cyan, C.ink, E(seg(lt, ch, ch + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 0.35, gain: 0.25 }); cue(st + no, 'zip', { gain: 0.25 }); cue(st + cl, 'pop', { gain: 0.35 }); cue(st + ch, 'zip', { gain: 0.25 }); cue(st + ch + 0.15, 'pop', { gain: 0.3 });
  }
  // ── 6 · so the pattern becomes a 3D map of your face ─────────────
  {
    const st = cut(5), pa = Wd('pattern', 5) - st, ma = Wd('map', 5) - st, fa = Wd('face', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 720], zoom: 0.14, note: 'IR view: dots re-size and re-colour by depth on "pattern" (near = yellow); stepped depth layers build on "map" + 3D MAP pill; map turns side to side on "face"',
      draw(lt, d, t) {
        xbg();
        const dp = eio(seg(lt, pa - 0.1, pa + 0.4)), mp = eio(seg(lt, ma - 0.35, ma + 0.25));
        const turn = lt > fa ? Math.sin((lt - fa) * 4) * 0.9 * seg(lt, fa, fa + 0.3) : 0;
        if (mp < 1) { ctx.save(); ctx.globalAlpha = 1 - mp; K.irFace(540, 720, 2.3); K.faceDots(540, 720, 2.3, 1, { col: C.red, r: 3.4, depth: dp }); ctx.restore(); }
        if (mp > 0) { K.irFace(540, 720, 2.3, mp); K.faceMesh(540, 720, 2.3, mp, turn); }
        if (lt > pa && lt < ma) K.pill('NEAR = YELLOW', 540, 180, 64, C.yellow, C.ink, E(seg(lt, pa, pa + 0.25)));
        if (lt > ma) K.pill('3D MAP', 540, 180, 84, C.cyan, C.ink, E(seg(lt, ma, ma + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + pa, 'sparkle', { dur: 0.5, gain: 0.25 }); cue(st + ma, 'pop', { gain: 0.45 }); cue(st + fa, 'slide', { dur: 0.6, gain: 0.2 });
  }
  // ── 7 · That's why a flat photo fails: it has no depth ───────────
  {
    const st = cut(6), fl = Wd('flat', 6) - st, fa = Wd('fails', 6) - st, de = Wd('depth', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 700], zoom: 0.1, note: 'photo card drops in; on "flat" it turns edge-on (a thin line) + FLAT pill; on "fails" back face-on with a red X; NO DEPTH on "depth"',
      draw(lt, d, t) {
        disc(700);
        const turn = seg(lt, fl - 0.05, fl + 0.18) - seg(lt, fa - 0.12, fa + 0.02);
        const sx = Math.cos(eio(clamp(turn)) * Math.PI * 0.47);
        K.photoCard(540, lerp(-400, 680, eob(seg(lt, 0, 0.35))), 1.35, 0, sx);
        if (lt > fl && lt < fa) K.pill('FLAT', 540, 180, 84, C.ink, C.white, E(seg(lt, fl, fl + 0.25)));
        if (lt > fa) { K.redX(540, 680, lerp(1.9, 1.2, eo(seg(lt, fa, fa + 0.2))), 1); K.pill('FAILS', 540, 180, 84, C.red, C.white, E(seg(lt, fa, fa + 0.25))); }
        if (lt > de) K.pill('NO DEPTH', 540, 1150, 72, C.yellow, C.ink, E(seg(lt, de, de + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.35, 'thud', { gain: 0.35 }); cue(st + fl, 'zip', { gain: 0.25 }); cue(st + fa + 0.05, 'slam', { gain: 0.5 }); cue(st + de, 'pop', { gain: 0.35 });
  }
  // ── 8 · It even checks that your eyes are open ───────────────────
  {
    const st = cut(7), ch = Wd('checks', 7) - st, ey = Wd('eyes', 7) - st, op = Wd('open', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 620], zoom: 0.18, note: 'close-up face, eyes closed; scan brackets on "checks"; brackets snap to the eyes on "eyes"; eyes pop open + EYES OPEN ✓ on "open"',
      draw(lt, d, t) {
        disc(640);
        const open = lt > op;
        K.faceHead(540, 640, 2.6, { eyes: open ? 'wide' : 'closed', mouth: open ? 'smile' : 'flat', brow: open ? 0.6 : 0 });
        if (lt > ch) {
          const f = eio(seg(lt, ey - 0.1, ey + 0.25));
          const cx = 540, cy = lerp(640, 640 + 6 * 2.6 - 12 * 2.6, f), hw = lerp(300, 200, f), hh = lerp(330, 70, f);
          const col = open ? GREEN : C.cyan;
          ctx.save(); ctx.globalAlpha = E(seg(lt, ch, ch + 0.2)); ctx.strokeStyle = col; ctx.lineWidth = 12; ctx.lineCap = 'round';
          for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { ctx.beginPath(); ctx.moveTo(cx + sx * hw, cy + sy * (hh - 40)); ctx.lineTo(cx + sx * hw, cy + sy * hh); ctx.lineTo(cx + sx * (hw - 40), cy + sy * hh); ctx.stroke(); }
          ctx.restore();
        }
        if (open) K.pill('EYES OPEN ✓', 540, 180, 76, GREEN, C.white, E(seg(lt, op, op + 0.25)));
        else if (lt > ch) K.pill('CHECKING…', 540, 180, 70, C.ink, C.white, E(seg(lt, ch, ch + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ch, 'pop', { gain: 0.3 }); cue(st + ey, 'slide', { dur: 0.3, gain: 0.2 }); cue(st + op, 'boing', { gain: 0.35 });
  }
  // ── 9 · then saves your face as math, locked inside the phone ────
  {
    const st = cut(8), fa = Wd('face', 8) - st, ma = Wd('math', 8) - st, ins = Wd('inside', 8) - st, ph = Wd('phone', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 700], zoom: 0.12, note: 'depth map; it turns into rows of numbers on "math" (= MATH); numbers shrink into the secure chip, padlock shuts on "inside"; phone appears around it + STAYS ON PHONE on "phone"',
      draw(lt, d, t) {
        disc(700);
        const toNum = eio(seg(lt, ma - 0.2, ma + 0.2)), inChip = eio(seg(lt, ins - 0.4, ins));
        if (toNum < 1) { ctx.save(); ctx.globalAlpha = 1 - toNum; rr(250, 330, 580, 760, 60); ctx.fillStyle = C.xnavy; ctx.fill(); K.faceMesh(540, 700, 2.0 * E(seg(lt, 0, 0.3)), 1, Math.sin(lt * 3) * 0.4); ctx.restore(); }
        if (toNum > 0 && inChip < 1) {
          ctx.save(); ctx.globalAlpha = toNum * (1 - inChip);
          ctx.translate(540, lerp(700, 760, inChip)); ctx.scale(1 - inChip * 0.85, 1 - inChip * 0.85);
          rr(-300, -230, 600, 460, 40); ctx.fillStyle = C.ink; ctx.fill();
          ctx.font = "700 46px 'DejaVu Sans Mono', monospace"; ctx.fillStyle = C.yellow; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ['0.82 1.37 0.44', '2.91 0.07 1.63', '0.58 3.12 0.96', '1.24 0.39 2.75', '0.71 1.88 0.13'].forEach((r, i) => ctx.fillText(r, 0, -168 + i * 84));
          ctx.restore();
        }
        if (inChip > 0) {
          const ps = E(seg(lt, ph - 0.1, ph + 0.25));
          if (ps > 0) K.phone(540, 760, 1.25 * ps, () => { ctx.fillStyle = '#E4DCCB'; ctx.fillRect(-166, -350, 332, 700); });
          K.secureChip(540, 760, 0.85 * Math.min(1, inChip * 1.2) * lerp(1, 0.6, ps), lt > ins ? 0.6 + 0.4 * Math.sin(lt * 8) : 0, eio(seg(lt, ins, ins + 0.25)), (x, y, s, o) => K.padlock(x, y, s, o));
        }
        if (lt > ma && lt < ins) K.pill('= MATH', 540, 180, 84, C.yellow, C.ink, E(seg(lt, ma, ma + 0.25)));
        if (lt > ins && lt < ph) K.pill('SECURE CHIP', 540, 180, 76, C.yellow, C.ink, E(seg(lt, ins, ins + 0.25)));
        if (lt > ph) K.pill('STAYS ON PHONE', 540, 180, 70, C.ink, C.white, E(seg(lt, ph, ph + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ma, 'sparkle', { dur: 0.4, gain: 0.3 }); cue(st + ins, 'thud', { gain: 0.4 }); cue(st + ph, 'pop', { gain: 0.35 });
  }
  // ── 10 · A random stranger? Less than a one in a million chance ──
  {
    const st = cut(9), sr = Wd('stranger', 9) - st, le = Wd('less', 9) - st, mi = Wd('million', 9) - st, chn = Wd('chance', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 640], zoom: 0.12, note: 'a stranger (blond, orange shirt) steps up to the phone on "stranger" → red NOT RECOGNIZED; odds card pops on "less", burst on "million"',
      draw(lt, d, t) {
        disc(640);
        const rej = lt > sr + 0.35;
        const sh = rej ? Math.sin((lt - sr) * 50) * 12 * (1 - seg(lt, sr + 0.35, sr + 0.8)) : 0;
        const up = eio(seg(lt, le - 0.3, le + 0.1));
        K.faceHead(lerp(-200, 330, eo(seg(lt, 0, 0.4))), lerp(560, 450, up), lerp(1.3, 0.95, up), { ...STRANGER, eyes: rej ? 'wide' : 'n', mouth: rej ? 'o' : 'smile' });
        K.phone(800 + sh, lerp(600, 470, up), lerp(0.85, 0.62, up), K.faceLockScreen(rej ? -1 : 0, 1, lt));
        if (lt > sr && lt < le) K.pill('STRANGER', 540, 180, 80, C.ink, C.white, E(seg(lt, sr, sr + 0.25)));
        if (lt > le) K.pill('LESS THAN', 540, 180, 80, C.ink, C.white, E(seg(lt, le, le + 0.25)));
        if (lt > mi) K.burst(540, 1000, 1.2, (1 - seg(lt, mi, mi + 0.6)) * 0.8);
        if (lt > le) K.oddsCard(540, 1000, E(seg(lt, le, le + 0.3)) * (1 + (lt > chn ? 0.05 * Math.sin((lt - chn) * 12) * (1 - seg(lt, chn, chn + 0.5)) : 0)), 1);
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 0.3, gain: 0.25 }); cue(st + sr + 0.35, 'boing', { gain: 0.35 }); cue(st + le, 'pop', { gain: 0.4 }); cue(st + mi, 'sparkle', { dur: 0.5, gain: 0.35 });
  }
  // ── 11 · But the twist? An identical twin might just unlock it ───
  {
    const st = cut(10), tw = Wd('twist', 10) - st, ti = Wd('twin', 10) - st, un = Wd('unlock', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 640], zoom: 0.14, note: 'THE TWIST pill; the hero, then his identical twin slides in on "twin" (same face); phone pops below and turns green UNLOCKED on "unlock"; hero shocked',
      draw(lt, d, t) {
        disc(640);
        const ok = lt > un + 0.1;
        K.faceHead(280, 520, 1.15, { eyes: ok ? 'wide' : 'n', mouth: ok ? 'o' : 'smile', brow: ok ? 1 : 0 });
        if (lt > ti - 0.2) K.faceHead(lerp(1300, 800, eob(seg(lt, ti - 0.2, ti + 0.2))), 520, 1.15, { mouth: ok ? 'grin' : 'smile', smirk: ok });
        if (lt > ti && !ok) K.pill('IDENTICAL TWIN', 540, 180, 72, C.yellow, C.ink, E(seg(lt, ti, ti + 0.25)));
        if (lt > tw && lt < ti) K.pill('THE TWIST', 540, 180, 84, C.red, C.white, E(seg(lt, tw, tw + 0.25)));
        if (lt > un - 0.3) K.phone(540, 990, 0.5 * E(seg(lt, un - 0.3, un)), K.faceLockScreen(ok ? 1 : 0, 1, lt));
        if (ok) { K.pill('UNLOCKED!', 540, 180, 84, GREEN, C.white, E(seg(lt, un + 0.1, un + 0.35))); K.shockLines(280, 400, 200, 1 - seg(lt, un + 0.1, un + 0.8)); }
      } });
    cue(st, 'whoosh'); cue(st + tw, 'boing', { gain: 0.35 }); cue(st + ti - 0.2, 'slide', { dur: 0.35, gain: 0.25 }); cue(st + un + 0.1, 'sparkle', { dur: 0.5, gain: 0.4 });
  }
  // ── 12 · because to your phone, they look almost exactly like you ──
  {
    const st = cut(11), ph = Wd('phone', 11) - st, al = Wd('almost', 11) - st, yo = Wd('exactly', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 620], zoom: 0.16, note: 'the phone\'s IR view: two depth maps side by side on "phone"; ≈ between them on "almost"; snaps back to the real hero who winks at camera on "you"',
      draw(lt, d, t) {
        const real = lt > yo - 0.05;
        if (!real) {
          xbg();
          K.irFace(300, 650, 1.35); K.faceMesh(300, 650, 1.35, eio(seg(lt, 0, 0.4)), 0);
          K.irFace(780, 650, 1.35); K.faceMesh(780, 650, 1.35, eio(seg(lt, 0.1, 0.5)), 0);
          if (lt > ph) K.pill("PHONE'S VIEW", 540, 180, 70, C.cyan, C.ink, E(seg(lt, ph, ph + 0.25)));
          if (lt > al) bigText('≈', 540, 650, 190, C.yellow, 0, E(seg(lt, al, al + 0.25)));
          if (lt > al) K.pill('ALMOST THE SAME', 540, 1080, 66, C.yellow, C.ink, E(seg(lt, al, al + 0.25)));
        } else {
          disc(640);
          K.faceHead(540, 600, lerp(1.6, 2.1, eo(seg(lt, yo - 0.05, yo + 0.4))), { eyes: 'wink', mouth: 'smirk', smirk: true, brow: 0.5 });
          K.pill('YOU?', 540, 180, 84, C.yellow, C.ink, E(seg(lt, yo, yo + 0.25)));
        }
      } });
    cue(st, 'whoosh'); cue(st + ph, 'pop', { gain: 0.35 }); cue(st + al, 'sparkle', { dur: 0.4, gain: 0.3 }); cue(st + yo, 'whoosh', { gain: 0.6 }); cue(st + yo + 0.1, 'boing', { gain: 0.35 });
  }

  return { shots: S, cues: CUES };
}
