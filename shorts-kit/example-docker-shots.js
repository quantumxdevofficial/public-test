// WHAT ACTUALLY IS DOCKER?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));   // E(0) can be a tiny positive float: keep hidden things hidden

const DOCK = '#8A6A3A', DOCK_D = '#6E532C';
function desk() { fillAll(C.bg); ctx.fillStyle = C.floor; ctx.fillRect(-300, 1100, W + 600, 900); }
function sky(t) {
  fillAll(C.sky);
  for (const [x, y, s] of [[160, 300, 1], [880, 240, 0.8]]) { const dx = Math.sin(t * 0.3 + x) * 14; ell(x + dx, y, 90 * s, 34 * s, C.white); ell(x + dx + 40 * s, y - 22 * s, 60 * s, 38 * s, C.white); }
}
function dock(x0, x1, y) { ctx.fillStyle = DOCK; ctx.fillRect(x0, y, x1 - x0, 80); ctx.fillStyle = DOCK_D; ctx.fillRect(x0, y + 70, x1 - x0, 30); }
// the packed container's contents (local coords of K.container)
function packed(n = 4, t = 0) {
  if (n > 0) K.appCard(-110, -10, 0.55, -0.05);
  if (n > 1) K.gear(60, -30, 0.5, t * 1.5);
  if (n > 2) K.versionTag(130, 60, 0.42, 'v3', C.yellow, 0.1);
  if (n > 3) K.libBooks(-40, 70, 0.42, 0.04);
}

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · HOOK: hero + a mystery container, DOCKER pill ──────────────────
  {
    const st = cut(0), dk = Wd('docker', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 760], zoom: 0.06, note: 'room, container drops in next to hero; "?" then DOCKER pill on "Docker"',
      draw(lt, d, t) {
        K.room();
        K.man({ x: 330, y: 1150, s: 0.95, arm: K.ARM.point, finger: -0.4, eyes: 'n', brow: lt > dk ? 1 : 0.4, mouth: lt > dk ? 'o' : 'flat', look: 1 });
        const p = E(seg(lt, 0.05, 0.5));
        K.container(780, lerp(-300, 900, p), 0.62, 0, null, 0, lerp(0.3, -0.04, p));
        if (lt > 0.5) bigText('?', 780, 700, 150, C.yellow, 0.15, E(seg(lt, 0.5, 0.75)));
        if (lt > dk) K.pill('DOCKER', 540, 230, 90, C.yellow, C.ink, E(seg(lt, dk, dk + 0.25)));
      } });
    cue(st + 0.45, 'thud', { gain: 0.6 }); cue(st + 0.55, 'boing', { gain: 0.35 }); cue(st + dk, 'pop');
  }

  // ── 2 · works on your laptop ───────────────────────────────────────────
  {
    const st = cut(1), ap = Wd('app', 1) - st, wk = Wd('works', 1) - st, lp = Wd('laptop', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 760], zoom: 0.1, note: 'laptop; app card pops on "app"; green check on "works"; YOUR LAPTOP on "laptop"',
      draw(lt, d, t) {
        desk();
        K.laptop(540, 780, 1.15, () => { K.codeScreen(1, t, 1); if (lt > ap) K.appCard(150, 50, 0.6 * E(seg(lt, ap, ap + 0.25))); });
        if (lt > wk) K.check(540, 330, 0.9 * E(seg(lt, wk, wk + 0.3)));
        if (lt > lp) K.pill('YOUR LAPTOP', 540, 1160, 56, C.ink, C.white, E(seg(lt, lp, lp + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ap, 'pop', { gain: 0.45 }); cue(st + wk, 'sparkle', { dur: 0.4, gain: 0.4 }); cue(st + lp, 'pop', { gain: 0.5 });
  }

  // ── 3 · but crashes on your friend's computer ──────────────────────────
  {
    const st = cut(2), cr = Wd('crashes', 2) - st, fr = Wd('friend', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 760], zoom: 0.12, note: 'friend behind laptop; on "crashes" screen goes red, warning shakes; friend shocked; FRIEND\'S PC pill',
      draw(lt, d, t) {
        desk();
        const bad = lt > cr, sh = bad ? Math.sin(lt * 60) * 8 * Math.max(0, 1 - (lt - cr) * 1.5) : 0;
        K.buddy(540, 470, 1.3, '#5BAE6A', '#C8734A');
        K.laptop(540 + sh, 860, 1.1, () => { if (bad) { ctx.fillStyle = '#5A1F2B'; ctx.fillRect(-300, -180, 600, 360); K.warning(0, 0, 0.9 + Math.sin(lt * 12) * 0.05); } else { K.codeScreen(1, t, 2); K.appCard(150, 50, 0.6); } });
        if (bad) K.shockLines(540, 330, 150, eo(seg(lt, cr, cr + 0.2)));
        if (lt > fr) K.pill("FRIEND'S PC", 540, 1180, 56, C.red, C.white, E(seg(lt, fr, fr + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + cr, 'alarm', { dur: 0.6, gain: 0.35 }); cue(st + cr + 0.05, 'slam', { gain: 0.5 }); cue(st + fr, 'pop', { gain: 0.45 });
  }

  // ── 4a · it's missing something ────────────────────────────────────────
  {
    const st = cut(3), ms = Wd('missing', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 700], zoom: 0.1, note: 'app card with 3 dashed slots; gear and books fill two, third slot stays empty with red ? on "missing"',
      draw(lt, d, t) {
        fillAll(C.bg);
        K.appCard(540, 420, 1.2);
        const slots = [[230, 860], [540, 860], [850, 860]];
        for (const [x, y] of slots) { ctx.save(); ctx.setLineDash([26, 18]); rr(x - 130, y - 110, 260, 220, 30); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.globalAlpha = 0.35; ctx.stroke(); ctx.restore(); }
        K.gear(230, 860, 0.9 * E(seg(lt, 0.1, 0.35)), t * 1.5);
        K.libBooks(540, 860, 0.85 * E(seg(lt, 0.25, 0.5)));
        if (lt > ms) bigText('?', 850, 860, 200, C.red, 0, E(seg(lt, ms, ms + 0.3)));
      } });
    cue(st, 'whoosh'); cue(st + 0.15, 'pop', { gain: 0.35 }); cue(st + 0.3, 'pop', { gain: 0.35 }); cue(st + ms, 'boing', { gain: 0.45 });
  }
  // ── 4b · like the right version ────────────────────────────────────────
  {
    const st = Wd('like', 3) - 0.08, vr = Wd('version', 3) - st;
    add({ id: 'S04b', at: st, cam: [540, 760], zoom: 0.12, note: 'APP NEEDS v3 vs PC HAS v2; red X on v2 + WRONG VERSION on "version"',
      draw(lt) {
        fillAll(C.bg);
        K.pill('APP NEEDS', 290, 420, 50, C.ink, C.white, 1); K.versionTag(290, 640, 1.1 * E(seg(lt, 0, 0.3)), 'v3', C.yellow, -0.05);
        K.pill('PC HAS', 790, 420, 50, C.ink, C.white, 1); K.versionTag(790, 640, 1.1 * E(seg(lt, 0.15, 0.45)), 'v2', '#C9CDD6', 0.06);
        if (lt > vr - 0.05) K.redX(790, 640, lerp(0.9, 0.45, eo(seg(lt, vr - 0.05, vr + 0.15))), 1);
        if (lt > vr) K.pill('WRONG VERSION', 540, 1000, 60, C.red, C.white, E(seg(lt, vr, vr + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + vr, 'slam', { gain: 0.7 });
  }

  // ── 5 · Docker fixes that by packing your app ─────────────────────────
  {
    const st = cut(4), dk = Wd('docker', 4) - st, pk = Wd('packing', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 760], zoom: 0.1, note: 'DOCKER pill on "Docker"; open container; app card drops in on "packing"',
      draw(lt, d, t) {
        fillAll(C.bg); ctx.fillStyle = C.floor; ctx.fillRect(-300, 1050, W + 600, 900);
        if (lt > dk) K.pill('DOCKER', 540, 260, 84, C.yellow, C.ink, E(seg(lt, dk, dk + 0.25)));
        const u = eio(seg(lt, pk, pk + 0.6));
        K.container(540, 820, 1.6, 0, null, 1, 0, () => { if (u >= 1) packed(1, t); });
        if (u < 1) K.appCard(lerp(540, 540 - 110 * 1.6, u), lerp(480, 820 - 10 * 1.6, u), lerp(1, 0.88, u), Math.sin(lt * 6) * 0.1 * (1 - u));
      } });
    cue(st, 'whoosh'); cue(st + dk, 'pop'); cue(st + pk, 'slide', { dur: 0.5, gain: 0.4 }); cue(st + pk + 0.55, 'thud', { gain: 0.5 });
  }

  // ── 6 · and everything it needs into one little box ───────────────────
  {
    const st = cut(5), ev = Wd('everything', 5) - st, bx = Wd('box', 5) - st;
    const items = [[(x, y, s) => K.gear(x, y, s * 0.9), 200, 360], [(x, y, s) => K.versionTag(x, y, s * 0.75, 'v3'), 540, 300], [(x, y, s) => K.libBooks(x, y, s * 0.8), 880, 360]];
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.1, note: 'gear, v3 tag, books fly into the open container from "everything"; front panel closes on "box"',
      draw(lt, d, t) {
        fillAll(C.bg); ctx.fillStyle = C.floor; ctx.fillRect(-300, 1050, W + 600, 900);
        let inn = 1;
        items.forEach((_, k) => { if (eio(seg(lt, ev + k * 0.3, ev + k * 0.3 + 0.55)) >= 1) inn = 2 + k; });
        const close = eio(seg(lt, bx - 0.1, bx + 0.25));
        K.container(540, 820, 1.6, 0, close > 0.6 ? 'APP' : null, 1 - close, 0, () => packed(inn, t));
        items.forEach(([f, x0, y0], k) => { const u = eio(seg(lt, ev + k * 0.3, ev + k * 0.3 + 0.55)); if (u < 1) f(lerp(x0, 540, u), lerp(y0, 800, u) - Math.sin(u * Math.PI) * 120, lerp(1, 0.6, u)); });
      } });
    cue(st, 'whoosh'); cue(st + ev, 'slide', { dur: 1.0, gain: 0.4 }); cue(st + bx + 0.15, 'slam', { gain: 0.6 });
  }

  // ── 7 · called a container ─────────────────────────────────────────────
  {
    const st = cut(6), ct = Wd('container', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 800], zoom: 0.2, note: 'closed container hops; CONTAINER pill + burst on "container"',
      draw(lt, d, t) {
        fillAll(C.bg); ctx.fillStyle = C.floor; ctx.fillRect(-300, 1050, W + 600, 900);
        const hop = Math.abs(Math.sin(seg(lt, ct, ct + 0.5) * Math.PI)) * 80;
        K.container(540, 820 - hop, 1.6, 0, 'APP');
        if (lt > ct) { K.burst(540, 820, 5, clamp(1 - (lt - ct) * 2)); K.pill('CONTAINER', 540, 380, 90, C.yellow, C.ink, E(seg(lt, ct, ct + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + ct, 'sparkle', { dur: 0.5, gain: 0.5 }); cue(st + ct + 0.45, 'thud', { gain: 0.4 });
  }

  // ── 8 · Now that box runs exactly the same ─────────────────────────────
  {
    const st = cut(7), rn = Wd('runs', 7) - st, sm = Wd('same', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 760], zoom: 0.1, note: 'container centre; on "runs" app pops above with ripple; on "same" it splits into three identical copies with = signs',
      draw(lt, d, t) {
        fillAll(C.bg);
        const spread = eio(seg(lt, sm - 0.1, sm + 0.35));
        for (const k of [-1, 1]) if (spread > 0) K.container(540 + k * 340 * spread, 760, 0.62, 0, 'APP');
        K.container(540, 760, lerp(1.1, 0.62, spread), 0, 'APP');
        if (lt > rn && spread < 0.5) { K.ripple(540, 420, seg(lt, rn, rn + 0.6)); K.appCard(540, 420, 0.7 * E(seg(lt, rn, rn + 0.25))); }
        if (spread > 0.9) for (const k of [-1, 1]) bigText('=', 540 + k * 170, 760, 110, C.yellow, 0, E(seg(lt, sm + 0.3, sm + 0.5)));
        if (spread > 0.9) K.pill('SAME', 540, 1000, 64, C.yellow, C.ink, E(seg(lt, sm + 0.3, sm + 0.55)));
      } });
    cue(st, 'whoosh'); cue(st + rn, 'pop', { gain: 0.5 }); cue(st + sm, 'slide', { dur: 0.4, gain: 0.4 }); cue(st + sm + 0.35, 'pop', { gain: 0.45 });
  }

  // ── 9 · on your laptop, a server, or the cloud ─────────────────────────
  {
    const st = cut(8), w = [Wd('laptop', 8), Wd('server', 8), Wd('cloud', 8)].map((v) => v - st);
    add({ id: 'S09', at: st, cam: [540, 760], zoom: 0.08, note: 'laptop / server / cloud in a row; a container drops onto each on its word with a green check',
      draw(lt, d, t) {
        sky(t); ctx.fillStyle = C.floor; ctx.fillRect(-300, 1120, W + 600, 900);
        K.laptop(190, 1010, 0.42, () => K.codeScreen(1, t, 1));
        K.server(540, 960, 0.62, t);
        K.cloud(880, 900, 0.5, C.white);
        const spots = [[190, 850], [540, 720], [880, 760]];
        spots.forEach(([x, y], k) => {
          if (lt < w[k] - 0.3) return;
          const p = eo(seg(lt, w[k] - 0.3, w[k]));
          K.container(x, lerp(-200, y, p), 0.48, 0, 'APP');
          if (lt > w[k]) K.check(x, y - 190, 0.42 * E(seg(lt, w[k], w[k] + 0.25)));
        });
      } });
    cue(st, 'whoosh'); w.forEach((v) => { cue(st + v - 0.05, 'thud', { gain: 0.45 }); cue(st + v + 0.05, 'pop', { gain: 0.35 }); });
  }

  // ── 10 · unlike a virtual machine ──────────────────────────────────────
  {
    const st = cut(9), vm = Wd('virtual', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 760], zoom: 0.1, note: 'small container left vs big OS cart right; VIRTUAL MACHINE pill on "virtual"',
      draw(lt, d, t) {
        desk();
        K.container(230, 1000, 0.55, 0, 'APP');
        K.pill('CONTAINER', 230, 800, 42, C.ink, C.white, 1);
        K.osCart(720, 1060, 0.95 * E(seg(lt, vm - 0.1, vm + 0.25)), 0, true);
        if (lt > vm) K.pill('VIRTUAL MACHINE', 720, 300, 54, C.yellow, C.ink, E(seg(lt, vm, vm + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + vm, 'thud', { gain: 0.6 }); cue(st + vm + 0.1, 'pop', { gain: 0.4 });
  }

  // ── 11 · it doesn't drag along a whole operating system ────────────────
  {
    const st = cut(10), dr = Wd('drag', 10) - st, wh = Wd('whole', 10) - st, os = Wd('system', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.08, note: 'hero strains pulling the heavy OS cart by a rope (sweat); OS pulses on "whole"; FULL OS pill on "system"',
      draw(lt, d, t) {
        desk();
        const mv = Math.max(0, lt - dr) * 30;
        const cx = 780 - mv, hx = 250 - mv * 0.5, hy = 1000, hs = 0.85;
        const pulse = Math.sin(Math.PI * seg(lt, wh, wh + 0.35)) * 0.08;
        K.osCart(cx, 1080, 0.8 + pulse, -mv * 0.02, true);
        const arm = { e: [210, -60], h: [300, -40] };
        K.rope(hx + 300 * hs, hy - 40 * hs, cx - 240 * 0.8, 1080 - 10 * 0.8, 30);
        K.man({ x: hx, y: hy, s: hs, arm, armL: K.ARM.down, eyes: 'closed', mouth: 'flat', frown: true });
        K.sweat(hx + 110, hy - 440 * hs, t, lt > dr ? 1 : 0);
        if (lt > os) K.pill('FULL OS', cx, 480, 60, C.red, C.white, E(seg(lt, os, os + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + dr, 'slide', { dur: 1.4, gain: 0.35 }); cue(st + wh, 'thud', { gain: 0.45 }); cue(st + os, 'pop', { gain: 0.5 });
  }

  // ── 12 · so it starts in seconds ───────────────────────────────────────
  {
    const st = cut(11), sa = Wd('starts', 11) - st, sc = Wd('seconds', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 760], zoom: 0.12, note: 'stopwatch; container zips in on "starts" with speed lines; check + SECONDS on "seconds"',
      draw(lt, d, t) {
        fillAll(C.bg);
        K.stopwatch(540, 560, 0.8, -Math.PI * 0.25 + Math.min(lt, sc) * 2.5);
        const u = eio(seg(lt, sa, sa + 0.4)), cx = lerp(-300, 540, u);
        K.container(cx, 1060, 0.6, 0, 'APP');
        K.speedLines(cx - 140, 1060, u > 0 && u < 1 ? 1 : clamp(1 - (lt - sa - 0.4) * 3));
        if (lt > sc) { K.check(860, 1020, 0.5 * E(seg(lt, sc, sc + 0.25))); K.pill('SECONDS', 540, 170, 70, C.yellow, C.ink, E(seg(lt, sc, sc + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'tock', { gain: 0.4 }); cue(st + sa, 'zip'); cue(st + sc, 'pop');
  }

  // ── 13 · And the name? A docker is a dock worker ───────────────────────
  {
    const st = cut(12), nm = Wd('name', 12) - st, dk = Wd('docker', 12) - st, wk = Wd('worker', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 760], zoom: 0.1, note: 'hero brow raise + DOCKER? on "name"; cut to dock, hard hat drops on "docker"; DOCK WORKER on "worker"',
      draw(lt, d, t) {
        if (lt < dk - 0.06) {
          K.room();
          K.man({ x: 540, y: 1300, s: 1.5, arm: K.ARM.point, finger: -0.2, brow: 1, mouth: 'smirk', smirk: true });
          if (lt > nm) K.pill('DOCKER?', 540, 230, 80, C.yellow, C.ink, E(seg(lt, nm, nm + 0.25)));
        } else {
          sky(t); K.sea(1180, t); dock(-300, 620, 1120);
          const mx = 320, my = 1120 - 620 * 0.85, ms = 0.85;
          K.man({ x: mx, y: my, s: ms, arm: K.ARM.wave, eyes: 'n', mouth: 'grin' });
          K.hardHat(mx, my - (1 - E(seg(lt, dk - 0.05, dk + 0.25))) * 300, ms);
          K.container(860, 1000, 0.5, 3); K.container(860, 880, 0.5, 2);
          if (lt > wk) K.pill('DOCK WORKER', 540, 200, 70, C.yellow, C.ink, E(seg(lt, wk, wk + 0.25)));
        }
      } });
    cue(st, 'whoosh'); cue(st + nm, 'pop', { gain: 0.45 }); cue(st + dk - 0.06, 'whoosh'); cue(st + dk + 0.2, 'thud', { gain: 0.45 }); cue(st + wk, 'pop');
  }

  // ── 14 · who loads shipping containers onto ships ──────────────────────
  {
    const st = cut(13), ld = Wd('loads', 13) - st, sp = Wd('ships', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.08, note: 'crane lifts a container on "loads" and lowers it onto the ship; SHIPS pill on "ships"',
      draw(lt, d, t) {
        sky(t); K.sea(1100, t); dock(-300, 300, 1040);
        const u = eio(seg(lt, ld, sp + 0.1));
        const hx = lerp(220, 720, eio(seg(u, 0.3, 0.75))), hy = lerp(810, 380, eio(seg(u, 0, 0.3))) + lerp(0, 230, eio(seg(u, 0.75, 1)));
        K.ship(660, 1060, 0.8, t, u >= 1 ? 5 : 4);
        K.crane(30, 1040, 260, hx, hy);
        if (u < 1) K.container(hx, hy + 110, 0.42, 4);
        else K.ripple(660, 900, seg(lt, sp + 0.1, sp + 0.6));
        if (lt > sp) K.pill('SHIPS', 660, 200, 70, C.yellow, C.ink, E(seg(lt, sp, sp + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ld, 'slide', { dur: 1.2, gain: 0.35 }); cue(st + sp + 0.1, 'thud', { gain: 0.5 });
  }

  // ── 15 · So next time it works on your machine ─────────────────────────
  {
    const st = cut(14), wk = Wd('works', 14) - st, mc = Wd('machine', 14) - st;
    add({ id: 'S15', at: st, cam: [540, 760], zoom: 0.1, note: 'hero hands on hips by laptop; check on "works"; WORKS ON MY MACHINE pill on "machine"',
      draw(lt, d, t) {
        desk();
        K.laptop(300, 900, 0.7, () => { K.codeScreen(1, t, 1); K.appCard(150, 50, 0.6); });
        K.man({ x: 800, y: 1100, s: 0.9, arm: K.ARM.hip, armL: K.ARM.hip, eyes: 'n', mouth: 'smirk', smirk: true, brow: 0.6 });
        if (lt > wk) K.check(300, 620, 0.55 * E(seg(lt, wk, wk + 0.25)));
        if (lt > mc) K.pill('WORKS ON MY MACHINE', 540, 220, 54, C.ink, C.white, E(seg(lt, mc, mc + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + wk, 'pop', { gain: 0.45 }); cue(st + mc, 'pop');
  }

  // ── 16 · just ship the box (loop) ──────────────────────────────────────
  {
    const st = cut(15), sh = Wd('ship', 15) - st, bx = Wd('box', 15) - st;
    add({ id: 'S16', at: st, cam: [540, 760], zoom: 0.06, note: 'hero on the dock points; the APP container flies off on an arc on "ship"; wink + grin + SHIP IT on "box"',
      draw(lt, d, t) {
        sky(t); K.sea(1180, t); dock(-300, 1400, 1120);
        const u = eio(seg(lt, sh, sh + 0.7));
        const [x, y] = u > 0 ? K.arcAt(700, 1000, 880, 420, 260, u) : [700, 1000];
        K.container(x, y, lerp(0.55, 0.3, u), 0, 'APP', 0, u * 0.3);
        const mx = 300, ms = 0.85, my = 1120 - 620 * ms;
        K.man({ x: mx, y: my, s: ms, arm: K.armPose(K.ARM.down, K.ARM.point, eo(seg(lt, sh - 0.1, sh + 0.15))), finger: -0.2, eyes: lt > bx ? 'wink' : 'n', mouth: lt > bx ? 'grin' : 'smirk', smirk: true, brow: 0.5 });
        if (lt > bx) K.pill('SHIP IT', 700, 240, 76, C.yellow, C.ink, E(seg(lt, bx, bx + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sh, 'zip'); cue(st + bx, 'boing', { gain: 0.45 });
  }

  return { shots: S, cues: CUES };
}
