// HOW DOES YOUR SCREEN MAKE EVERY COLOR?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const disc = () => { fillAll(C.bg); circle(540, 740, 520, '#E4DCCB'); };
const dark = () => { fillAll('#20232B'); circle(540, 740, 540, '#2A2E38'); };
// a colourful picture inside a phone screen (332x700 local box)
const picture = (u = 0.3) => () => {
  const n = 8, m = 17, cw = 332 / n, ch = 700 / m;
  for (let j = 0; j < m; j++) for (let i = 0; i < n; i++) { ctx.fillStyle = K.sceneColor(i, j, n, m, u); ctx.fillRect(-166 + i * cw, -350 + j * ch, cw + 1, ch + 1); }
};
const heldPhone = (scr) => (x, y) => K.phone(x + 12, y - 70, 0.3, scr);
// pixel colours of the little scene, as sub-pixel levels
const hexLv = (h) => { const m = /rgb\((\d+),(\d+),(\d+)/.exec(h); if (m) return [m[1] / 255, m[2] / 255, m[3] / 255];
  return [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16) / 255); };
const sceneLv = (i, j) => hexLv(K.sceneColor(i, j, 8, 17, 0.3));
const OFFC = ['#4A2228', '#1F3A28', '#1E2848'];

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · How does your screen make every single color you see? ─────────
  {
    const st = cut(0), sc = Wd('screen', 0) - st, co = Wd('color', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 760], zoom: 0.12, note: 'hero holds phone; big phone with a colourful picture pops on "screen"; EVERY COLOR? pill on "color"',
      draw(lt, d, t) {
        K.room();
        K.man({ x: 300, y: 1260, s: 0.95, arm: K.PHONE_ARM, holding: heldPhone(picture(0.3)), eyes: lt > co ? 'wide' : 'n', mouth: lt > co ? 'o' : 'flat', brow: 0.7, look: 0.6 });
        K.phone(760, 700, 0.85 * E(seg(lt, sc - 0.15, sc + 0.2)), picture(0.2 + lt * 0.05));
        if (lt > co) K.pill('EVERY COLOR?', 700, 220, 66, C.yellow, C.ink, E(seg(lt, co, co + 0.25)));
      } });
    cue(st + sc - 0.1, 'pop', { gain: 0.4 }); cue(st + co, 'boing', { gain: 0.35 });
  }
  // ── 2 · Well, put a drop of water on it, and look closely ──────────────
  {
    const st = cut(1), dr = Wd('drop', 1) - st, wa = Wd('water', 1) - st, cl = Wd('closely', 1) - st;
    const LX = 540, LY = 640, land = wa + 0.05;
    add({ id: 'S02', at: st, cam: [540, 700], zoom: 0.16, note: 'big phone; a drop falls on "drop", lands on "water"; on "closely" the drop becomes a lens showing RGB sub-pixels',
      draw(lt, d, t) {
        disc();
        K.phone(540, 760, 1.25, picture(0.3));
        if (lt > dr - 0.1 && lt < land) K.waterDrop(LX, lerp(-150, LY, eio(seg(lt, dr - 0.1, land))), 1);
        if (lt >= land) {
          const zoom = lt < cl - 0.1 ? 0 : eio(seg(lt, cl - 0.1, cl + 0.4));
          const p = lerp(0.5, 1, E(seg(lt, cl - 0.1, cl + 0.25))) * E(seg(lt, land, land + 0.2));
          K.lens(LX, LY, 250, p, () => {
            if (zoom <= 0) { ctx.save(); ctx.translate(LX, LY); ctx.scale(2, 2); ctx.translate(0, -90); picture(0.3)(); ctx.restore(); return; }
            ctx.fillStyle = '#14161C'; ctx.fillRect(LX - 300, LY - 300, 600, 600);
            K.subpixelGrid(LX, LY, 5, 5, lerp(60, 120, zoom), (i, j) => sceneLv(i + 1, j + 4));
          });
        }
        if (lt > cl) K.pill('ZOOM IN', 540, 220, 66, C.yellow, C.ink, E(seg(lt, cl, cl + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + dr - 0.1, 'slide', { dur: 0.5, gain: 0.25 }); cue(st + land, 'plop', { gain: 0.5 }); cue(st + cl, 'sparkle', { dur: 0.5, gain: 0.3 });
  }
  // ── 3 · Every pixel is really three tiny lights ───────────────────────
  {
    const st = cut(2), px = Wd('pixel', 2) - st, th = Wd('three', 2) - st, li = Wd('lights', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 720], zoom: 0.14, note: 'one big pixel square on "pixel"; splits into three bars on "three"; they glow on "lights"',
      draw(lt, d, t) {
        dark();
        const sp = eio(seg(lt, th - 0.1, th + 0.25)), pop = E(seg(lt, px - 0.2, px + 0.1));
        if (sp < 0.05) { if (pop > 0) { rr(540 - 260 * pop, 720 - 260 * pop, 520 * pop, 520 * pop, 30 * pop); ctx.fillStyle = '#F2EEE4'; ctx.fill(); } }
        else {
          rr(540 - 270, 720 - 270, 540, 540, 30); ctx.fillStyle = '#14161C'; ctx.fill();
          ['r', 'g', 'b'].forEach((k, i) => { const bx = 540 + (i - 1) * lerp(0, 170, sp);
            rr(bx - 70, 720 - 230, 140, 460, 44); ctx.fillStyle = lt > li ? K.SUB[k] : ['#B53040', '#36A04F', '#3560C0'][i]; ctx.fill(); });
          if (lt > li) K.shockLines(540, 720, 340, 1 - seg(lt, li, li + 0.5));
        }
        K.pill(lt > th ? '1 PIXEL = 3 LIGHTS' : '1 PIXEL', 540, 260, 64, lt > th ? C.yellow : C.white, C.ink, pop);
      } });
    cue(st, 'whoosh'); cue(st + px, 'pop', { gain: 0.35 }); cue(st + th, 'zip', { gain: 0.35 }); cue(st + li, 'sparkle', { dur: 0.4, gain: 0.3 });
  }
  // ── 4 · one red, one green and one blue ───────────────────────────────
  {
    const st = cut(3), w = [Wd('red', 3), Wd('green', 3), Wd('blue', 3)].map((v) => v - st);
    add({ id: 'S04', at: st, cam: [540, 720], zoom: 0.1, note: 'three bars; each lights up with its RED / GREEN / BLUE pill on its word',
      draw(lt, d, t) {
        dark();
        rr(540 - 270, 720 - 270, 540, 540, 30); ctx.fillStyle = '#14161C'; ctx.fill();
        ['r', 'g', 'b'].forEach((k, i) => { const on = lt > w[i] - 0.05, bx = 540 + (i - 1) * 170, p = E(seg(lt, w[i] - 0.05, w[i] + 0.2));
          rr(bx - 70, 720 - 230, 140, 460, 44); ctx.fillStyle = on ? K.SUB[k] : OFFC[i]; ctx.fill();
          if (on) { K.pill(['RED', 'GREEN', 'BLUE'][i], bx, i === 1 ? 1130 : 1060, 50, K.SUB[k], C.white, p); K.burst(bx, 720, 1.2, 1 - seg(lt, w[i], w[i] + 0.35)); } });
      } });
    cue(st, 'whoosh'); w.forEach((v) => cue(st + v, 'pop', { gain: 0.35 }));
  }
  // ── 5a · Each light can glow ─────────────────────────────────────────
  {
    const st = cut(4), gl = Wd('glow', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 760], zoom: 0.1, note: 'red sub-pixel left + red dimmer right; slider sweeps from "glow", bar brightness follows',
      draw(lt, d, t) {
        disc();
        const v = 0.55 - 0.4 * Math.cos(lt * 4.5);
        K.subpixel(310, 780, 420, [v, 0, 0], E(seg(lt, 0, 0.3)), true);
        K.dimmer(760, 790, 0.95, 'r', v, E(seg(lt, 0, 0.3)));
        if (lt > gl) K.pill('DIMMABLE', 540, 230, 64, C.ink, C.white, E(seg(lt, gl, gl + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + gl, 'slide', { dur: 1.0, gain: 0.25 });
  }
  // ── 5b · at 256 brightness levels ────────────────────────────────────
  {
    const st = Wd('two', 4) - 0.15, lv = Wd('levels', 4) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.12, note: 'a staircase of red steps from dark to full grows; counter 0→255; 256 LEVELS pill on "levels"',
      draw(lt, d, t) {
        disc();
        const u = eio(seg(lt, 0, lv)), n = 32;
        for (let i = 0; i < n; i++) { if (i / n > u) break; const v = i / (n - 1);
          rr(200 + i * 21.5, 1050 - 18 - v * 520, 18, 18 + v * 520, 6); ctx.fillStyle = K.rgbCss(lerp(0.12, 0.91, v), lerp(0.05, 0.19, v), lerp(0.07, 0.25, v)); ctx.fill(); }
        line([[180, 1062], [900, 1062]], C.ink, 10);
        ctx.font = '900 120px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 22; ctx.lineJoin = 'round';
        const num = String(Math.round(255 * u)); ctx.strokeStyle = C.ink; ctx.strokeText(num, 330, 420); ctx.fillStyle = K.SUB.r; ctx.fillText(num, 330, 420);
        if (lt > lv) K.pill('256 LEVELS', 540, 230, 70, C.yellow, C.ink, E(seg(lt, lv, lv + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 1.2, gain: 0.22 }); cue(st + lv, 'thud', { gain: 0.4 });
  }
  // ── 6 · and mixing them gives over sixteen million colors ─────────────
  {
    const st = cut(5), mx = Wd('mixing', 5) - st, mi = Wd('million', 5) - st, co = Wd('colors', 5) - st;
    add({ id: 'S07', at: st, cam: [540, 760], zoom: 0.12, note: 'three dimmers move from "mixing", swatch shows the mix; counter lands on 16,777,216 on "million"; COLORS! on "colors"',
      draw(lt, d, t) {
        disc();
        const a = lt < mx ? 0 : lt - mx;
        const v = [0.5 + 0.45 * Math.sin(a * 4.1), 0.5 + 0.45 * Math.sin(a * 3.3 + 2), 0.5 + 0.45 * Math.sin(a * 5.2 + 4)];
        ['r', 'g', 'b'].forEach((k, i) => K.dimmer(200 + i * 165, 860, 0.62, k, v[i], E(seg(lt, i * 0.08, 0.3 + i * 0.08)), false));
        K.swatch(830, 860, 140, K.rgbCss(...v), E(seg(lt, mx - 0.1, mx + 0.2)));
        const u = eio(seg(lt, mx, mi + 0.1));
        rr(110, 300, 860, 170, 36); ctx.fillStyle = C.ink; ctx.fill();
        ctx.font = '900 100px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = C.yellow; ctx.fillText(Math.round(16777216 * u).toLocaleString('en-US'), 540, 388);
        if (lt > co) K.pill('COLORS!', 830, 640, 60, C.yellow, C.ink, E(seg(lt, co, co + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + mx, 'slide', { dur: 1.3, gain: 0.22 }); cue(st + mi + 0.1, 'thud', { gain: 0.4 }); cue(st + co, 'pop', { gain: 0.35 });
  }
  // ── 7 · All three at full blast? That's white. ────────────────────────
  {
    const st = cut(6), fu = Wd('full', 6) - st, wh = Wd('white', 6) - st;
    add({ id: 'S08', at: st, cam: [540, 760], zoom: 0.12, note: 'three sliders shoot to 255 on "full"; swatch turns white on "white"; WHITE pill',
      draw(lt, d, t) {
        disc();
        const v = 0.25 + 0.75 * clamp(E(seg(lt, fu - 0.15, fu + 0.2)));
        ['r', 'g', 'b'].forEach((k, i) => K.dimmer(200 + i * 165, 900, 0.62, k, v, 1, true));
        K.swatch(830, 900, 140, K.rgbCss(v, v, v), 1);
        if (lt > wh) { K.pill('WHITE', 830, 680, 60, C.white, C.ink, E(seg(lt, wh, wh + 0.25))); K.shockLines(830, 900, 200, 1 - seg(lt, wh, wh + 0.5)); }
      } });
    cue(st, 'whoosh'); cue(st + fu - 0.1, 'zip', { gain: 0.35 }); cue(st + wh, 'sparkle', { dur: 0.4, gain: 0.3 });
  }
  // ── 8 · All three off? That's black. ─────────────────────────────────
  {
    const st = cut(7), of = Wd('off', 7) - st, bl = Wd('black', 7) - st;
    add({ id: 'S09', at: st, cam: [540, 760], zoom: 0.12, note: 'sliders drop to 0 on "off"; swatch black on "black"; BLACK pill',
      draw(lt, d, t) {
        disc();
        const v = clamp(1 - E(seg(lt, of - 0.15, of + 0.15)));
        ['r', 'g', 'b'].forEach((k, i) => K.dimmer(200 + i * 165, 900, 0.62, k, v, 1, true));
        K.swatch(830, 900, 140, lt > bl - 0.05 ? '#0A0A0C' : K.rgbCss(v, v, v), 1);
        if (lt > bl) K.pill('BLACK', 830, 680, 60, C.ink, C.white, E(seg(lt, bl, bl + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + of - 0.1, 'thud', { gain: 0.35 }); cue(st + bl, 'pop', { gain: 0.3 });
  }
  // ── 9 · But here's the wild part ─────────────────────────────────────
  {
    const st = cut(8), wi = Wd('wild', 8) - st;
    add({ id: 'S10', at: st, cam: [540, 740], zoom: 0.14, note: 'hero, finger up; warning slams in on "wild"',
      draw(lt, d, t) {
        K.room();
        K.man({ x: 540, y: 1250, s: 1.1, arm: K.ARM.point, finger: Math.sin(lt * 11) * 0.3, eyes: lt > wi ? 'wide' : 'n', mouth: lt > wi ? 'o' : 'smirk', brow: 1, look: 0 });
        if (lt > wi - 0.1) K.warning(540, 300, lerp(1.4, 0.8, E(seg(lt, wi - 0.1, wi + 0.15))));
      } });
    cue(st, 'whoosh'); cue(st + wi - 0.05, 'slam', { gain: 0.45 });
  }
  // ── 10 · the yellow in these captions isn't yellow light at all ──────
  {
    const st = cut(9), ca = Wd('captions', 9) - st, li = Wd('light', 9) - st, al = Wd('all', 9) - st;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.12, note: 'big YELLOW word; arrow points down at the caption on "captions"; a yellow bulb pops on "light" and gets a red X on "all"',
      draw(lt, d, t) {
        disc();
        bigText('YELLOW', 540, 520, 170, C.yellow, -0.04, E(seg(lt, 0, 0.3)));
        if (lt > ca && lt < li - 0.1) K.arrow(540, 820, 260 * E(seg(lt, ca, ca + 0.2)), Math.PI / 2, 1);
        if (lt > li - 0.1) { const p = E(seg(lt, li - 0.1, li + 0.2));
          rr(540 - 55 * p, 900 + 100 * p, 110 * p, 80 * p, 14); ctx.fillStyle = '#9AA1AE'; ctx.fill();
          circle(540, 900, 125 * p, C.ink); circle(540, 900, 110 * p, C.yellow); ell(500, 860, 26 * p, 14 * p, C.white, -0.6);
          K.pill('YELLOW LIGHT?', 540, 260, 60, C.ink, C.white, p); }
        if (lt > al) K.redX(540, 930, lerp(1.6, 1, eo(seg(lt, al, al + 0.2))), 1);
      } });
    cue(st, 'whoosh'); cue(st + ca, 'pop', { gain: 0.3 }); cue(st + li - 0.05, 'pop', { gain: 0.35 }); cue(st + al + 0.05, 'slam', { gain: 0.45 });
  }
  // ── 11 · It's just red and green, glowing side by side ───────────────
  {
    const st = cut(10), re = Wd('red', 10) - st, gr = Wd('green', 10) - st, si = Wd('side', 10) - st;
    add({ id: 'S12', at: st, cam: [540, 740], zoom: 0.14, note: 'YELLOW word at top; a water-drop lens shows its pixels: only red + green lit, blue dark; RED / GREEN / BLUE OFF pills',
      draw(lt, d, t) {
        disc();
        bigText('YELLOW', 540, 300, 130, C.yellow, 0, 1);
        K.lens(540, 760, 320, E(seg(lt, 0, 0.3)), () => {
          ctx.fillStyle = '#14161C'; ctx.fillRect(160, 380, 760, 760);
          K.subpixelGrid(540, 760, 3, 3, 200, () => [lt > re - 0.05 ? 1 : 0.15, lt > gr - 0.05 ? 1 : 0.15, 0]);
        });
        if (lt > re) K.pill('RED', 250, 1160, 56, K.SUB.r, C.white, E(seg(lt, re, re + 0.25)));
        if (lt > gr) K.pill('GREEN', 830, 1160, 56, K.SUB.g, C.white, E(seg(lt, gr, gr + 0.25)));
        if (lt > si) K.pill('BLUE OFF', 540, 1190, 50, C.ink, C.white, E(seg(lt, si, si + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + re, 'pop', { gain: 0.35 }); cue(st + gr, 'pop', { gain: 0.35 }); cue(st + si, 'tock', { gain: 0.3 });
  }
  // ── 12 · and your brain blends them into yellow ──────────────────────
  {
    const st = cut(11), br = Wd('brain', 11) - st, bl = Wd('blends', 11) - st, ye = Wd('yellow', 11) - st;
    add({ id: 'S13', at: st, cam: [540, 760], zoom: 0.12, note: 'red + green beams from a pixel into a big eye; brain pops on "brain", a nerve line rises; yellow swatch bursts out on "yellow"',
      draw(lt, d, t) {
        disc();
        K.subpixel(190, 1020, 200, [1, 1, 0], 1);
        K.bigEye(600, 1020, 0.75, -0.6);
        const u = seg(lt, 0.05, Math.max(0.4, bl));
        K.beam(300, 990, 470, 1000, K.SUB.r, u, 18); K.beam(300, 1050, 470, 1040, K.SUB.g, u, 18);
        K.colorBrain(600, 560, 0.95 * E(seg(lt, br - 0.15, br + 0.15)), lt > bl ? Math.max(0, Math.sin((lt - bl) * 12)) : 0);
        if (lt > bl) line([[600, 920], [600, lerp(920, 700, eo(seg(lt, bl, bl + 0.3)))]], C.ink, 14);
        if (lt > ye - 0.05) { K.swatch(900, 560, 100, C.yellow, E(seg(lt, ye - 0.05, ye + 0.2))); K.burst(900, 560, 1.4, 1 - seg(lt, ye, ye + 0.4)); }
        if (lt > ye) K.pill('= YELLOW', 820, 360, 56, C.yellow, C.ink, E(seg(lt, ye, ye + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 0.6, gain: 0.22 }); cue(st + br - 0.1, 'boing', { gain: 0.35 }); cue(st + ye, 'sparkle', { dur: 0.5, gain: 0.3 });
  }
  // ── 13 · Three tiny lights, and your eyes do the rest ────────────────
  {
    const st = cut(12), ey = Wd('eyes', 12) - st, re = Wd('rest', 12) - st;
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.14, note: 'hero with phone; one big pixel with RGB bars above right; hero winks on "eyes"; R + G + B pill on "rest"',
      draw(lt, d, t) {
        K.room();
        K.subpixel(770, 560, 300 * E(seg(lt, 0, 0.3)), [1, 1, 1], 1);
        K.man({ x: 330, y: 1260, s: 0.95, arm: K.PHONE_ARM, holding: heldPhone(picture(0.3)), eyes: lt > ey ? 'wink' : 'n', mouth: lt > ey ? 'grin' : 'smile', smirk: lt > ey, brow: 0.5, look: 0.5 });
        if (lt > re) K.pill('R + G + B', 770, 300, 70, C.yellow, C.ink, E(seg(lt, re, re + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ey, 'boing', { gain: 0.35 }); cue(st + re, 'pop', { gain: 0.4 });
  }

  return { shots: S, cues: CUES };
}
