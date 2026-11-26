// HOW DOES NETFLIX PLAY A MOVIE WITHOUT DOWNLOADING IT?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const disc = () => { fillAll(C.bg); circle(540, 740, 520, '#E4DCCB'); };
const talk = (lt) => (Math.sin(lt * 18) > 0 ? 'o' : 'smile');
const playIcon = (a) => { ctx.save(); ctx.globalAlpha = a; circle(0, 0, 70, C.red); ctx.fillStyle = C.white; ctx.beginPath(); ctx.moveTo(-22, -36); ctx.lineTo(38, 0); ctx.lineTo(-22, 36); ctx.fill(); ctx.restore(); };

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · How does Netflix play a movie ─────────────────────────
  {
    const st = cut(0), nf = Wd('netflix', 0) - st, mv = Wd('movie', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 640], zoom: 0.12, note: 'TV drops in with a play button; movie starts on "movie"; hero below grins; STREAMING pill on "Netflix"',
      draw(lt, d, t) {
        disc();
        const ty = lerp(-400, 420, E(seg(lt, 0, 0.4)));
        K.tvSet(540, ty, 1.0, () => {
          if (lt > mv) K.movieFrame(0, 0, 600, 360, t); else fillAll('#2C3E5C');
          if (lt < mv + 0.3) playIcon(1 - seg(lt, mv, mv + 0.3));
        });
        K.man({ x: 540, y: 990, s: 0.44, arm: K.ARM.down, eyes: lt > mv ? 'wide' : 'n', mouth: lt > mv ? 'grin' : 'smile', brow: lt > mv ? 0.6 : 0.2 });
        if (lt > nf) K.pill('STREAMING', 540, 140, 60, C.red, C.white, E(seg(lt, nf, nf + 0.25)));
      } });
    cue(st + 0.35, 'thud', { gain: 0.3 }); cue(st + nf, 'pop', { gain: 0.4 }); cue(st + mv, 'sparkle', { dur: 0.4, gain: 0.3 });
  }
  // ── 2 · without downloading the whole thing? ──────────────────
  {
    const st = cut(1), dl = Wd('downloading', 1) - st, th = Wd('thing', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 640], zoom: 0.1, note: 'giant MOVIE file with a crawling download bar (1%) + spinner; red X on "thing"',
      draw(lt, d, t) {
        disc();
        ctx.save(); ctx.translate(540, 560); rr(-260, -330, 520, 600, 40); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 12; ctx.strokeStyle = C.ink; ctx.stroke();
        K.movieFrame(0, -90, 400, 225, t); ctx.lineWidth = 8; ctx.strokeRect(-200, -202, 400, 225);
        ctx.fillStyle = C.ink; ctx.font = '900 64px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('MOVIE', 0, 110); ctx.font = '900 48px Inter'; ctx.fillStyle = '#7A7A86'; ctx.fillText('5 GB', 0, 185); ctx.restore();
        if (lt > dl) {
          const p = 0.01 + 0.03 * seg(lt, dl, d);
          K.playerBar(230, 960, 560, p, p, { h: 30 });
          K.spinner(890, 960, 0.4, t);
          K.pill('DOWNLOADING ' + Math.round(p * 100) + '%', 540, 1080, 50, C.ink, C.white, E(seg(lt, dl, dl + 0.25)));
        }
        if (lt > th) K.redX(540, 560, lerp(1.6, 1.1, E(seg(lt, th, th + 0.2))), 1);
      } });
    cue(st, 'whoosh'); cue(st + dl, 'pop', { gain: 0.35 }); cue(st + th, 'slam', { gain: 0.4 });
  }
  // ── 3 · Well, the movie is chopped into tiny chunks, ──────────
  {
    const st = cut(2), ch = Wd('chopped', 2) - st, ck = Wd('chunks', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 640], zoom: 0.08, note: 'film strip slides in; scissors snip down the joins on "chopped"; pieces spread apart on "chunks"',
      draw(lt, d, t) {
        disc();
        const s = 0.85, n = 4, gap = 50 * E(seg(lt, ck, ck + 0.35));
        const tot = n * 240 * s + (n - 1) * gap * s;
        const x0 = lerp(1100, 540 - tot / 2, E(seg(lt, 0, 0.5)));
        K.filmStrip(x0, 640, s, n, t, gap, { wob: 0.07 * gap / 50 });
        if (lt > ch - 0.3 && lt < ck + 0.2) {
          const u = seg(lt, ch - 0.3, ck + 0.1), k = Math.min(2, Math.floor(u * 3));
          const jx = 540 - 408 + (k + 1) * 204;
          K.scissors(jx, lerp(330, 860, (u * 3) % 1), 0.8, 0.5 + 0.5 * Math.sin(lt * 26), Math.PI / 2);
        }
        if (lt > ck) K.pill('CHUNKS', 540, 1000, 66, C.yellow, C.ink, E(seg(lt, ck, ck + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ch, 'zip', { gain: 0.3 }); cue(st + ck, 'pop', { gain: 0.45 });
  }
  // ── 4 · just a few seconds each, ──────────────────────────────
  {
    const st = cut(3), fe = Wd('few', 3) - st, se = Wd('seconds', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 640], zoom: 0.14, note: 'three chunks in a row; stopwatches pop above from "few"; "~4 SEC" pills on "seconds"',
      draw(lt, d, t) {
        disc();
        for (let k = 0; k < 3; k++) {
          const x = 220 + k * 320;
          K.filmChunk(x, 700, 1.15, t, { seed: k * 0.7 });
          if (lt > fe + k * 0.12) K.stopwatch(x, 430, 0.3 * E(seg(lt, fe + k * 0.12, fe + k * 0.12 + 0.25)), lt * 4 + k);
          if (lt > se + k * 0.1) K.pill('4 SEC', x, 940, 50, C.yellow, C.ink, E(seg(lt, se + k * 0.1, se + k * 0.1 + 0.25)));
        }
      } });
    cue(st, 'whoosh'); cue(st + fe, 'tock', { gain: 0.25 }); cue(st + se, 'pop', { gain: 0.4 });
  }
  // ── 5 · and the app grabs them one by one, ────────────────────
  {
    const st = cut(4), gr = Wd('grabs', 4) - st;
    const A = [820, 400], B = [300, 820];
    add({ id: 'S05', at: st, cam: [540, 640], zoom: 0.1, note: 'server top right, phone bottom left; chunks hop along a dotted arc into the phone one by one from "grabs"; CHUNK n counter',
      draw(lt, d, t) {
        disc();
        K.server(A[0], A[1], 0.55, t);
        const P1 = [A[0] - 40, A[1] + 120], P2 = [B[0] + 20, B[1] - 200];
        K.route(P1[0], P1[1], P2[0], P2[1], 200, 0, 1, 0.45);
        const n = lt > gr ? Math.floor((lt - gr) / 0.4) : -1;
        K.phone(B[0], B[1], 0.6, () => { K.movieFrame(0, -80, 332, 187, t); ctx.fillStyle = C.ink; ctx.font = '900 46px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('CHUNK ' + Math.max(1, n + 1), 0, 120); });
        if (lt > gr) {
          const u = ((lt - gr) % 0.4) / 0.4;
          const [px, py] = K.arcAt(P1[0], P1[1], P2[0], P2[1], 200, eio(u));
          K.chunkToken(px, py, 1, t, n * 0.7, 1 - seg(u, 0.85, 1));
        }
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 4; k++) cue(st + gr + k * 0.4 + 0.35, 'pop', { gain: 0.22 });
  }
  // ── 6 · a little ahead of where you're watching. ──────────────
  {
    const st = cut(5), ah = Wd('ahead', 5) - st, wa = Wd('watching', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 640], zoom: 0.12, note: 'player panel; red playhead ~30%, grey buffered part grows ahead; AHEAD arrow+pill on "ahead"; YOU tag on playhead at "watching"',
      draw(lt, d, t) {
        disc();
        const pl = 0.3 + lt * 0.015, bu = Math.min(0.62, pl + 0.05 + 0.27 * seg(lt, 0, ah + 0.4));
        K.player(540, 600, 1.2, t, { played: pl, buffered: bu });
        const by = 600 + 210 * 1.2, bx = 540 - 330 * 1.2, bw = 660 * 1.2;
        if (lt > ah) { K.arrow(bx + bw * pl + 50, by + 90, (bu - pl) * bw - 70, 0, E(seg(lt, ah, ah + 0.2))); K.pill('AHEAD', bx + bw * (pl + bu) / 2, by + 190, 54, C.yellow, C.ink, E(seg(lt, ah, ah + 0.25))); }
        if (lt > wa) K.tag('YOU', bx + bw * pl, 140, bx + bw * pl, 600 - 260, 50, E(seg(lt, wa, wa + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ah, 'pop', { gain: 0.35 }); cue(st + wa, 'pop', { gain: 0.35 });
  }
  // ── 7 · That saved up stretch is called the buffer. ───────────
  {
    const st = cut(6), sv = Wd('saved', 6) - st, bf = Wd('buffer', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 640], zoom: 0.16, note: 'close on the bar: saved chunks drop onto the buffered part from "saved"; it glows yellow + BUFFER pill on "buffer"',
      draw(lt, d, t) {
        disc();
        const bx = 140, bw = 800, by = 820, pl = 0.25, bu = 0.85;
        rr(90, 300, 900, 640, 40); ctx.fillStyle = C.ink; ctx.fill();
        K.playerBar(bx, by, bw, pl, bu, { h: 40, hi: lt > bf ? 1 : 0 });
        for (let k = 0; k < 3; k++) { const p = E(seg(lt, sv + k * 0.18, sv + k * 0.18 + 0.3)); if (p > 0) K.chunkToken(bx + bw * (pl + 0.1 + k * 0.2), lerp(300, 640, p), 1.6, t, k * 0.7); }
        if (lt > bf) { K.pill('BUFFER', bx + bw * 0.55, 1080, 72, C.yellow, C.ink, E(seg(lt, bf, bf + 0.25))); K.burst(bx + bw * 0.55, by, 1, 1 - seg(lt, bf, bf + 0.6)); }
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 3; k++) cue(st + sv + k * 0.18 + 0.25, 'thud', { gain: 0.2 }); cue(st + bf, 'pop', { gain: 0.45 });
  }
  // ── 8 · But here's the clever part. ───────────────────────────
  {
    const st = cut(7), cl = Wd('clever', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 640], zoom: 0.14, note: 'hero raises a finger, smirks; CLEVER! + burst on "clever"',
      draw(lt, d, t) {
        disc();
        K.man({ x: 540, y: 1000, s: 0.9, arm: lt > 0.2 ? K.ARM.point : K.ARM.down, finger: lt > 0.2 ? Math.sin(lt * 11) * 0.3 : null, eyes: 'n', mouth: lt > cl ? 'smirk' : talk(lt), brow: lt > cl ? 0.8 : 0.3 });
        if (lt > cl) { bigText('CLEVER!', 540, 250, 120, C.yellow, -0.06, E(seg(lt, cl, cl + 0.2))); K.burst(540, 250, 1.4, 1 - seg(lt, cl, cl + 0.6)); }
      } });
    cue(st, 'whoosh'); cue(st + cl, 'sparkle', { dur: 0.4, gain: 0.35 });
  }
  // ── 9 · Every chunk is stored in lots of qualities, ───────────
  {
    const st = cut(8), sto = Wd('stored', 8) - st, qu = Wd('qualities', 8) - st;
    const Q = [['HD', C.yellow, C.ink, 1], ['SD', C.white, C.ink, 14], ['LOW', C.red, C.white, 30]];
    add({ id: 'S09', at: st, cam: [540, 640], zoom: 0.1, note: 'one chunk splits into three copies stacked (sharp → blocky) from "stored"; HD / SD / LOW badges on "qualities"',
      draw(lt, d, t) {
        disc();
        for (let k = 2; k >= 0; k--) {
          const [lab, bg, fg, pix] = Q[k];
          const p = E(seg(lt, sto + k * 0.15, sto + k * 0.15 + 0.35));
          const y = lerp(640, 330 + k * 300, p);
          K.filmChunk(450, y, 1.15, t, { pix: p > 0 ? pix : 1, seed: 0.3 });
          if (lt > qu + k * 0.15) K.qualityBadge(820, y, 1, lab, bg, fg, E(seg(lt, qu + k * 0.15, qu + k * 0.15 + 0.25)));
        }
      } });
    cue(st, 'whoosh'); cue(st + sto, 'slide', { dur: 0.5, gain: 0.25 }); for (let k = 0; k < 3; k++) cue(st + qu + k * 0.15, 'pop', { gain: 0.3 });
  }
  // ── 10 · so when your Wi-Fi slows down, ───────────────────────
  {
    const st = cut(9), sl = Wd('slows', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 640], zoom: 0.12, note: 'router with Wi-Fi icon; bars drop 3 → 1 and turn red on "slows"; SLOW pill',
      draw(lt, d, t) {
        disc();
        K.router(540, 860, 1.1, t);
        const bars = lt < sl ? 3 : Math.max(1, 3 - Math.floor((lt - sl) / 0.25));
        K.wifiIcon(540, 470, 1.8, bars, bars < 3 ? C.red : C.yellow);
        if (lt > sl) K.pill('SLOW', 540, 1080, 66, C.red, C.white, E(seg(lt, sl, sl + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sl, 'boing', { gain: 0.3 });
  }
  // ── 11 · the app quietly switches to a blurrier version ───────
  {
    const st = cut(10), sw = Wd('switches', 10) - st, bl = Wd('blurrier', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 640], zoom: 0.12, note: 'player shows sharp movie with HD badge; a LOW chunk slides in on "switches" and the picture turns blocky; badge flips to LOW on "blurrier"',
      draw(lt, d, t) {
        disc();
        const pix = lt < sw ? 1 : lerp(2, 12, seg(lt, sw, sw + 0.25));
        K.player(540, 620, 1.2, t, { pix, played: 0.4 + lt * 0.02, buffered: 0.55 });
        const low = lt > bl;
        K.qualityBadge(870, 230, 1, low ? 'LOW' : 'HD', low ? C.red : C.yellow, low ? C.white : C.ink, low ? E(seg(lt, bl, bl + 0.25)) : 1);
        if (lt > sw - 0.3 && lt < sw + 0.05) K.chunkToken(lerp(1250, 540, eio(seg(lt, sw - 0.3, sw))), 560, 1.6, t, 0.3);
        if (lt > bl) K.pill('KEEPS PLAYING', 540, 1080, 56, C.ink, C.white, E(seg(lt, bl + 0.2, bl + 0.45)));
      } });
    cue(st, 'whoosh'); cue(st + sw - 0.3, 'slide', { dur: 0.3, gain: 0.25 }); cue(st + bl, 'pop', { gain: 0.4 });
  }
  // ── 12 · instead of stopping to spin. ─────────────────────────
  {
    const st = cut(11), sp = Wd('stopping', 11) - st, sn = Wd('spin', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 640], zoom: 0.14, note: 'frozen dark player with the loading spinner; BUFFERING pill on "stopping"; big red X slams on "spin"',
      draw(lt, d, t) {
        disc();
        K.player(540, 620, 1.2, 3.0, { spin: 1, played: 0.42, buffered: 0.42 });
        K.spinner(540, 570, 1.1, t);
        if (lt > sp) K.pill('BUFFERING...', 540, 180, 54, C.white, C.ink, E(seg(lt, sp, sp + 0.25)));
        if (lt > sn) K.redX(540, 570, lerp(1.8, 1.1, E(seg(lt, sn, sn + 0.2))), 1);
      } });
    cue(st, 'whoosh'); cue(st + sn, 'slam', { gain: 0.4 });
  }
  // ── 13 · And the twist? ───────────────────────────────────────
  {
    const st = cut(12), tw = Wd('twist', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 600], zoom: 0.22, note: 'hero close-up, eyes go wide, shock lines + ? on "twist"',
      draw(lt, d, t) {
        disc();
        K.man({ x: 540, y: 1150, s: 1.5, arm: K.ARM.down, eyes: lt > tw ? 'wide' : 'n', mouth: lt > tw ? 'o' : 'smile', brow: lt > tw ? 1 : 0.3 });
        if (lt > tw) { K.shockLines(540, 560, 360, clamp((lt - tw) * 5)); K.qmark(860, 300, 0.9, 1, Math.sin(lt * 6) * 0.12); }
      } });
    cue(st, 'whoosh'); cue(st + tw, 'boing', { gain: 0.4 });
  }
  // ── 14 · Those chunks often don't travel far at all. ──────────
  {
    const st = cut(13), tr = Wd('travel', 13) - st, fa = Wd('far', 13) - st;
    const A = [830, 480], B = [240, 900];
    const P1 = [A[0] - 80, A[1] - 120], P2 = [B[0] + 40, B[1] - 200];
    add({ id: 'S14', at: st, cam: [540, 640], zoom: 0.1, note: 'far data center top right, house bottom left; long dashed arc draws from "travel" with a chunk on it; red X + NOT FAR pill on "far"',
      draw(lt, d, t) {
        disc();
        K.dataCenter(A[0], A[1], 0.42, t);
        K.house(B[0], B[1], 0.9);
        if (lt > tr - 0.2) K.dashArc(P1[0], P1[1], P2[0], P2[1], 260, E(seg(lt, tr - 0.2, tr + 0.4)), C.ink, 10, 0.6);
        if (lt > tr && lt < fa) { const [px, py] = K.arcAt(P1[0], P1[1], P2[0], P2[1], 260, Math.min(0.5, (lt - tr) * 0.5)); K.chunkToken(px, py, 1, t, 0.3); }
        if (lt > fa) { K.redX(540, 360, lerp(1.4, 0.8, E(seg(lt, fa, fa + 0.2))), 1); K.pill('NOT FAR', 540, 1080, 60, C.yellow, C.ink, E(seg(lt, fa, fa + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + tr, 'slide', { dur: 0.6, gain: 0.25 }); cue(st + fa, 'slam', { gain: 0.35 });
  }
  // ── 15 · Netflix gives free servers to internet providers, ────
  {
    const st = cut(14), fr = Wd('free', 14) - st, sv = Wd('servers', 14) - st, pr = Wd('providers', 14) - st;
    add({ id: 'S15', at: st, cam: [540, 640], zoom: 0.1, note: 'internet provider building; FREE pill on "free"; three server racks drop into its glass room on "servers"; sign bursts on "providers"',
      draw(lt, d, t) {
        disc();
        const s = 1.35 * (lt > pr ? lerp(1.06, 1, E(seg(lt, pr, pr + 0.3))) : 1);
        K.providerBuilding(540, 1130, s, t, E(seg(lt, sv - 0.15, sv + 0.3)));
        if (lt > fr) K.pill('FREE', 860, 330, 70, C.yellow, C.ink, E(seg(lt, fr, fr + 0.25)));
        if (lt > pr) K.burst(540, 1130 - 425 * 1.35, 1.2, 1 - seg(lt, pr, pr + 0.6));
      } });
    cue(st, 'whoosh'); cue(st + fr, 'pop', { gain: 0.45 }); cue(st + sv + 0.25, 'thud', { gain: 0.4 }); cue(st + pr, 'sparkle', { dur: 0.4, gain: 0.3 });
  }
  // ── 16 · so your movie is already waiting close to home. ──────
  {
    const st = cut(15), wa = Wd('waiting', 15) - st, cl = Wd('close', 15) - st;
    const SX = 760, SY = 1010 - 95 * 0.85;
    add({ id: 'S16', at: st, cam: [540, 680], zoom: 0.12, note: 'provider building next to the house; chunk pulses in its server room from "waiting"; hops a short arc into the house on "close"; pin + CLOSE TO HOME',
      draw(lt, d, t) {
        disc();
        K.providerBuilding(760, 1010, 0.85, t, 1);
        K.house(270, 870, 0.95);
        const u = E(seg(lt, cl - 0.1, cl + 0.4));
        if (lt > wa) {
          if (u <= 0) K.chunkToken(SX, SY, 1.3 + 0.08 * Math.sin(lt * 8), t, 0.3);
          else if (u < 1) { const [px, py] = K.arcAt(SX, SY, 270, 880, 220, u); K.chunkToken(px, py, 1.3, t, 0.3); }
        }
        if (lt > cl + 0.3) { K.mapPin(270, 640, 0.6, C.red); K.pill('CLOSE TO HOME', 540, 1140, 56, C.yellow, C.ink, E(seg(lt, cl + 0.3, cl + 0.55))); }
      } });
    cue(st, 'whoosh'); cue(st + wa, 'pop', { gain: 0.3 }); cue(st + cl, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + cl + 0.35, 'pop', { gain: 0.4 });
  }
  // ── 17 · You're never watching the whole movie, ───────────────
  {
    const st = cut(16), ne = Wd('never', 16) - st, wh = Wd('whole', 16) - st;
    add({ id: 'S17', at: st, cam: [540, 600], zoom: 0.1, note: 'player below; the full film strip (whole movie) fades in above on "never", red X on "whole"',
      draw(lt, d, t) {
        disc();
        K.player(540, 800, 1.0, t, { played: 0.5, buffered: 0.62 });
        if (lt > ne) { ctx.save(); ctx.globalAlpha = seg(lt, ne, ne + 0.3); K.filmStrip(540 - 5 * 240 * 0.62 / 2, 330, 0.62, 5, t, 6); ctx.restore(); }
        if (lt > wh) K.redX(540, 330, lerp(1.3, 0.8, E(seg(lt, wh, wh + 0.2))), 1);
        if (lt > wh) K.pill('NEVER ALL OF IT', 540, 1150, 54, C.ink, C.white, E(seg(lt, wh + 0.2, wh + 0.45)));
      } });
    cue(st, 'whoosh'); cue(st + ne, 'pop', { gain: 0.3 }); cue(st + wh, 'slam', { gain: 0.35 });
  }
  // ── 18 · just the next few seconds. ───────────────────────────
  {
    const st = cut(17), nx = Wd('next', 17) - st, se = Wd('seconds', 17) - st;
    add({ id: 'S18', at: st, cam: [540, 600], zoom: 0.18, note: 'hero grins at camera with finger up; next two chunks pop above him glowing yellow on "next"; burst on "seconds"',
      draw(lt, d, t) {
        disc();
        K.man({ x: 540, y: 1180, s: 1.2, arm: K.ARM.point, finger: Math.sin(lt * 11) * 0.3, eyes: 'n', mouth: lt > se ? 'grin' : talk(lt), brow: 0.5 });
        for (let k = 0; k < 2; k++) if (lt > nx + k * 0.15) K.filmChunk(360 + k * 360, 230, 0.95 * E(seg(lt, nx + k * 0.15, nx + k * 0.15 + 0.3)), t, { seed: k * 0.7, hi: 1 });
        if (lt > se) K.burst(540, 230, 1.4, 1 - seg(lt, se, se + 0.6));
      } });
    cue(st, 'whoosh'); cue(st + nx, 'pop', { gain: 0.35 }); cue(st + nx + 0.15, 'pop', { gain: 0.3 }); cue(st + se, 'sparkle', { dur: 0.5, gain: 0.35 });
  }
  return { shots: S, cues: CUES };
}
