// HOW DOES A ZIP FILE MAKE FILES SMALLER?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const GREEN = '#5BAE6A', BLUE = '#2F6FE0';
const TOK = ['TO', 'BE', 'OR', 'NOT', 'TO', 'BE'];
/** x centres of a row of word tiles at scale s, centred on cx */
const rowX = (tokens, s, cx = 540, gap = 22) => {
  const ws = tokens.map((t) => K.tileWidth(t) * s), tot = ws.reduce((a, b) => a + b, 0) + gap * (tokens.length - 1);
  let x = cx - tot / 2; return ws.map((w) => { const c = x + w / 2; x += w + gap; return c; });
};
const backdrop = () => { fillAll(C.bg); circle(540, 720, 540, '#E4DCCB'); };
const fileCard = (x, y, w, h, title = 'speech.txt') => {
  rr(x - w / 2, y - h / 2 + 12, w, h, 34); ctx.fillStyle = '#D7CFBF'; ctx.fill();
  rr(x - w / 2, y - h / 2, w, h, 34); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
  rr(x - w / 2, y - h / 2, w, 90, [34, 34, 0, 0]); ctx.fillStyle = C.navy; ctx.fill(); ctx.stroke();
  ctx.fillStyle = C.white; ctx.font = '900 46px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(title, x, y - h / 2 + 47);
};

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1a · How does a zip file make your files smaller ──
  {
    const st = cut(0), zi = Wd('zip', 0) - st, fi = Wd('files', 0) - st, sm = Wd('smaller', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 760], zoom: 0.1, note: 'room: hero left looks at a big zip file that pops in on "zip"; three docs fly into it on "files"; it squashes small on "smaller"',
      draw(lt, d, t) {
        K.room();
        const shr = eio(seg(lt, sm - 0.1, sm + 0.35));
        K.man({ x: 300, y: 1260, s: 1.25, arm: lt > sm ? K.ARM.point : K.ARM.down, finger: lt > sm ? 0.3 : undefined, eyes: lt > sm ? 'wide' : 'n', mouth: lt > sm ? 'o' : 'smile', brow: lt > sm ? 0.9 : 0.3, look: 0.6 });
        if (lt > zi) K.zipFile(790, 600, lerp(1.1, 0.6, shr) * E(seg(lt, zi, zi + 0.3)), { squash: shr * 0.6, open: 0 });
        if (lt > fi - 0.1) for (let k = 0; k < 3; k++) {
          const u = eio(seg(lt, fi - 0.1 + k * 0.12, fi + 0.4 + k * 0.12));
          if (u < 1) K.docPage(lerp(360 + k * 170, 790, u), lerp(240, 600, u), lerp(0.9, 0.2, u), 3, [BLUE, C.pink, GREEN][k], (k - 1) * 0.2);
        }
        if (lt > sm) K.pill('SMALLER', 790, 1000, 72, C.yellow, C.ink, E(seg(lt, sm, sm + 0.25)));
      } });
    cue(st + zi, 'pop', { gain: 0.5 }); cue(st + fi, 'slide', { dur: 0.6, gain: 0.25 }); cue(st + sm, 'zip', { gain: 0.4 });
  }
  // ── 1b · without losing a single bit? ──
  {
    const st = Wd('without', 0) - 0.08, lo = Wd('losing', 0) - st, bi = Wd('bit', 0) - st;
    add({ id: 'S01b', at: st, cam: [540, 700], zoom: 0.12, note: 'small zip file unzips; the doc pops back out whole; NOTHING LOST + green check on "bit"',
      draw(lt, d, t) {
        backdrop();
        const op = eio(seg(lt, 0.05, lo + 0.3));
        K.zipFile(540, 820, 0.85, { open: op });
        if (lt > lo) { const u = E(seg(lt, lo, lo + 0.4)); K.docPage(540, lerp(800, 420, u), lerp(0.3, 1.5, u), 3, BLUE); }
        if (lt > lo && lt < bi) K.pill('LOSE ANYTHING?', 540, 1120, 60, C.red, C.white, E(seg(lt, lo, lo + 0.25)));
        if (lt > bi) { K.check(800, 360, 0.75 * E(seg(lt, bi, bi + 0.25)), 1); K.pill('NOTHING LOST', 540, 1120, 64, GREEN, C.white, E(seg(lt, bi, bi + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'zip', { gain: 0.35 }); cue(st + lo, 'pop', { gain: 0.4 }); cue(st + bi, 'sparkle', { dur: 0.4, gain: 0.3 });
  }
  // ── 2 · Well, most files are full of repeats ──
  {
    const st = cut(1), fu = Wd('full', 1) - st, re = Wd('repeats', 1) - st;
    const xs = rowX(TOK, 0.95);
    add({ id: 'S02', at: st, cam: [540, 700], zoom: 0.1, note: 'a text file card: TO BE OR NOT TO BE tiles pop in word by word; the repeated TO/BE tiles turn yellow on "repeats"',
      draw(lt, d, t) {
        backdrop();
        fileCard(540, 700, 1000, 520);
        TOK.forEach((w, i) => {
          const rep = i === 0 || i === 1 || i === 4 || i === 5;
          const hi = rep && lt > re ? E(seg(lt, re + (i % 2) * 0.06, re + 0.25 + (i % 2) * 0.06)) : 0;
          K.wordTile(xs[i], 760 - hi * 20, 0.95, w, { sc: E(seg(lt, 0.05 + i * 0.12, 0.3 + i * 0.12)), bg: hi > 0.5 ? C.yellow : C.white });
        });
        if (lt > fu) K.pill('FULL OF REPEATS', 540, 1080, 64, C.ink, C.white, E(seg(lt, fu, fu + 0.25)));
      } });
    cue(st, 'whoosh'); TOK.forEach((_, i) => cue(st + 0.1 + i * 0.12, 'tock', { gain: 0.18 })); cue(st + re, 'pop', { gain: 0.45 });
  }
  // ── 3 · the same words and patterns again and again ──
  {
    const st = cut(2), wo = Wd('words', 2) - st, pa = Wd('patterns', 2) - st, ag = Wd('again', 2) - st;
    const xs = rowX(TOK, 0.62, 540, 14);
    add({ id: 'S03', at: st, cam: [540, 700], zoom: 0.12, note: 'zoom out: the file card holds the line many times, scrolling; repeat tiles light yellow row by row on "again"',
      draw(lt, d, t) {
        backdrop();
        fileCard(540, 700, 760, 900, 'big-file.txt');
        ctx.save(); rr(160, 340, 760, 750, 10); ctx.clip();
        const scroll = (lt * 60) % 120;
        for (let r = 0; r < 8; r++) {
          const y = 360 + r * 120 - scroll;
          const lit = lt > ag ? seg(lt, ag + r * 0.08, ag + 0.15 + r * 0.08) : (lt > wo ? seg(lt, wo, wo + 0.3) * (r === 1 ? 1 : 0) : 0);
          TOK.forEach((w, i) => { const rep = i !== 2 && i !== 3; K.wordTile(xs[i], y, 0.62, w, { bg: rep && lit > 0.5 ? C.yellow : C.white }); });
        }
        ctx.restore();
        if (lt > pa) K.pill('SAME PATTERN', 540, 190, 64, C.yellow, C.ink, E(seg(lt, pa, pa + 0.25)));
        if (lt > ag) bigText('x6', 880, 1080, 120, C.yellow, -0.12, E(seg(lt, ag, ag + 0.3)));
      } });
    cue(st, 'whoosh'); cue(st + wo, 'pop', { gain: 0.35 }); cue(st + pa, 'pop', { gain: 0.4 }); cue(st + ag, 'sparkle', { dur: 0.5, gain: 0.3 });
  }
  // ── 4 · So zip writes each pattern just once ──
  {
    const st = cut(3), zi = Wd('zip', 3) - st, wr = Wd('writes', 3) - st, on = Wd('once', 3) - st;
    const four = TOK.slice(0, 4), xs = rowX(four, 1.05);
    add({ id: 'S04', at: st, cam: [540, 700], zoom: 0.1, note: 'zip file (top) open; TO BE OR NOT are written one by one on "writes" with an ink underline; WRITTEN ONCE on "once"',
      draw(lt, d, t) {
        backdrop();
        K.zipFile(540, 400, 0.6 * E(seg(lt, 0, 0.3)), { open: 0.6 });
        four.forEach((w, i) => K.wordTile(xs[i], 800, 1.05, w, { sc: E(seg(lt, wr + i * 0.14, wr + 0.25 + i * 0.14)) }));
        if (lt > wr) { const p = seg(lt, wr, wr + 0.65); rr(xs[0] - 80, 900, (xs[3] - xs[0] + 160) * p, 12, 6); ctx.fillStyle = C.ink; ctx.fill(); }
        if (lt > on) K.pill('WRITTEN ONCE', 540, 1060, 64, C.yellow, C.ink, E(seg(lt, on, on + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + wr, 'slide', { dur: 0.6, gain: 0.2 }); four.forEach((_, i) => cue(st + wr + i * 0.14, 'tock', { gain: 0.2 })); cue(st + on, 'pop', { gain: 0.45 });
  }
  // ── 5 · and every repeat becomes a tiny note ──
  {
    const st = cut(4), re = Wd('repeat', 4) - st, ti = Wd('tiny', 4) - st;
    const xs = rowX(TOK, 0.8), four = rowX(TOK.slice(0, 4), 0.8, 420);
    add({ id: 'S05', at: st, cam: [540, 720], zoom: 0.1, note: 'full row; the second TO BE turns pink on "repeat", then squeezes into one small yellow note chip on "tiny"; the row slides tight',
      draw(lt, d, t) {
        backdrop();
        const sq = eio(seg(lt, ti - 0.15, ti + 0.3)), slide = eio(seg(lt, ti, ti + 0.4));
        TOK.forEach((w, i) => {
          if (i < 4) { K.wordTile(lerp(xs[i], four[i], slide), 760, 0.8, w); return; }
          const red = lt > re ? seg(lt, re, re + 0.2) : 0;
          if (sq < 1) K.wordTile(lerp(xs[i], 860, sq), 760, 0.8 * (1 - sq * 0.8), w, { bg: red > 0.5 ? C.pink : C.white });
        });
        if (lt > re && sq < 0.5) K.pill('REPEAT', (xs[4] + xs[5]) / 2, 600, 56, C.red, C.white, E(seg(lt, re, re + 0.25)));
        if (sq > 0.5) K.noteChip(860, 760, 1, '2', { sc: E(seg(lt, ti + 0.05, ti + 0.35)) });
        if (lt > ti + 0.2) K.pill('TINY NOTE', 740, 600, 56, C.yellow, C.ink, E(seg(lt, ti + 0.2, ti + 0.45)));
      } });
    cue(st, 'whoosh'); cue(st + re, 'pop', { gain: 0.4 }); cue(st + ti, 'zip', { gain: 0.35 }); cue(st + ti + 0.2, 'pop', { gain: 0.4 });
  }
  // ── 6 · copy that from back there ──
  {
    const st = cut(5), co = Wd('copy', 5) - st, th = Wd('there', 5) - st;
    const four = rowX(TOK.slice(0, 4), 0.8, 420);
    add({ id: 'S06', at: st, cam: [600, 720], zoom: 0.12, note: 'dashed arrow arcs back from the note chip to TO BE; COPY 2 WORDS bubble on "copy"; TO BE light yellow on "there"',
      draw(lt, d, t) {
        backdrop();
        const hi = lt > th ? E(seg(lt, th, th + 0.25)) : 0;
        TOK.slice(0, 4).forEach((w, i) => K.wordTile(four[i], 760, 0.8, w, { bg: i < 2 && hi > 0.5 ? C.yellow : C.white }));
        K.noteChip(860, 760, 1, '2');
        K.backArrow(860, (four[0] + four[1]) / 2, 670, 300, eo(seg(lt, co - 0.1, th)), C.ink, 10);
        if (lt > co) K.bubble(760, 1020, 0.9, 'COPY 2 WORDS', E(seg(lt, co, co + 0.25)), 0);
        if (hi > 0) { ctx.save(); ctx.globalAlpha = hi; rr(four[0] - 90, 670, four[1] - four[0] + 180, 180, 30); ctx.lineWidth = 10; ctx.strokeStyle = C.yellow; ctx.stroke(); ctx.restore(); }
      } });
    cue(st, 'whoosh'); cue(st + co, 'slide', { dur: 0.7, gain: 0.25 }); cue(st + th, 'pop', { gain: 0.45 });
  }
  // ── 7 · Then the most common letters get the shortest codes ──
  {
    const st = cut(6), co = Wd('common', 6) - st, sh = Wd('shortest', 6) - st, cd = Wd('codes', 6) - st;
    const rows = [['E', '01', C.yellow], ['T', '110', C.cyan], ['Q', '1110100', C.cyan]];
    add({ id: 'S07', at: st, cam: [540, 700], zoom: 0.1, note: 'letters E, T, Q with use bars; on "common" E gets MOST USED; on "shortest" bit codes draw: E short, Q long',
      draw(lt, d, t) {
        backdrop();
        rows.forEach(([ch, bits, col], i) => {
          const y = 480 + i * 230, a = E(seg(lt, 0.05 + i * 0.12, 0.3 + i * 0.12));
          K.wordTile(190, y, 1.15, ch, { sc: a, bg: i === 0 && lt > co ? C.yellow : C.white });
          if (lt < sh) K.sizeMeter(330, y, 560, [0.95, 0.6, 0.08][i] * eo(seg(lt, 0.1, co + 0.2)), '', i === 0 ? C.yellow : '#9AA1AE');
          else K.bitBar(310, y, 1.1, bits, eo(seg(lt, sh + i * 0.15, sh + 0.45 + i * 0.15)), col);
        });
        if (lt > co && lt < sh) K.pill('MOST USED', 610, 330, 60, C.ink, C.white, E(seg(lt, co, co + 0.25)));
        if (lt > cd) K.pill('SHORTEST CODE', 540, 1120, 64, C.yellow, C.ink, E(seg(lt, cd, cd + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + co, 'pop', { gain: 0.4 }); cue(st + sh, 'slide', { dur: 0.6, gain: 0.2 }); cue(st + cd, 'pop', { gain: 0.45 });
  }
  // ── 8 · like nicknames for your best friends ──
  {
    const st = cut(7), ni = Wd('nicknames', 7) - st, fr = Wd('friends', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 700], zoom: 0.12, note: 'room: a long name card CHRISTOPHER squashes into CHRIS on "nicknames"; hero waves + grins on "friends"',
      draw(lt, d, t) {
        K.room();
        const sq = eio(seg(lt, ni - 0.1, ni + 0.3));
        const fd = lt > fr;
        K.man({ x: 540, y: 1270, s: 1.3, arm: fd ? K.ARM.wave : K.ARM.down, eyes: 'n', mouth: fd ? 'grin' : 'smile', brow: fd ? 0.7 : 0.3, look: 0 });
        K.wordCard(540, 300, lerp(0.75, 0.9, sq), sq < 0.5 ? 'CHRISTOPHER' : 'CHRIS', { size: 110, bg: sq > 0.5 ? C.yellow : C.white, sc: E(seg(lt, 0, 0.3)) * (1 - Math.sin(Math.PI * sq) * 0.25) });
        if (lt > ni + 0.2) K.pill('SHORT = SMALL', 540, 490, 56, C.ink, C.white, E(seg(lt, ni + 0.2, ni + 0.45)));
      } });
    cue(st, 'whoosh'); cue(st + ni, 'zip', { gain: 0.35 }); cue(st + fr, 'boing', { gain: 0.3 });
  }
  // ── 9 · Unzip it, and your computer follows the notes ──
  {
    const st = cut(8), un = Wd('Unzip', 8) - st, cp = Wd('computer', 8) - st, no = Wd('notes', 8) - st;
    const xs = rowX(['TO', 'BE', 'OR', 'NOT'], 0.62, -70, 12);
    add({ id: 'S09', at: st, cam: [540, 700], zoom: 0.1, note: 'zip file unzips on "Unzip"; laptop slides up on "computer"; on screen the note chip sends a dashed arrow back to TO BE on "notes"',
      draw(lt, d, t) {
        backdrop();
        const up = eio(seg(lt, cp - 0.3, cp + 0.2));
        K.zipFile(lerp(540, 860, up), lerp(700, 330, up), lerp(1.0, 0.45, up), { open: eio(seg(lt, un - 0.05, un + 0.5)) });
        if (up > 0) K.laptop(500, lerp(1500, 780, up), 1.1, () => {
          ['TO', 'BE', 'OR', 'NOT'].forEach((w, i) => K.wordTile(xs[i], 40, 0.62, w));
          K.noteChip(215, 40, 0.7, '2');
          K.backArrow(215, (xs[0] + xs[1]) / 2, 0, 120, eo(seg(lt, no - 0.2, no + 0.4)), C.ink, 7);
        });
        if (lt > no) K.pill('FOLLOW NOTES', 500, 1110, 60, C.yellow, C.ink, E(seg(lt, no, no + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + un, 'zip', { gain: 0.45 }); cue(st + cp - 0.2, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + no, 'pop', { gain: 0.4 });
  }
  // ── 10 · to rebuild every byte exactly ──
  {
    const st = cut(9), rb = Wd('rebuild', 9) - st, ex = Wd('exactly', 9) - st;
    const xs = rowX(TOK, 0.8), four = rowX(TOK.slice(0, 4), 0.8, 420);
    add({ id: 'S10', at: st, cam: [540, 720], zoom: 0.1, note: 'the note chip pops open into TO BE tiles on "rebuild"; the row slides back to full; green check + 100% SAME on "exactly"',
      draw(lt, d, t) {
        backdrop();
        const ex2 = eio(seg(lt, rb - 0.1, rb + 0.35));
        TOK.forEach((w, i) => {
          if (i < 4) { K.wordTile(lerp(four[i], xs[i], ex2), 760, 0.8, w); return; }
          if (ex2 > 0.3) K.wordTile(lerp(860, xs[i], ex2), 760, 0.8 * ex2, w, { bg: lt > ex ? C.white : C.yellow });
        });
        if (ex2 < 0.6) K.noteChip(860, 760, 1 - ex2 * 1.6, '2');
        if (ex2 > 0.5 && ex2 < 1) K.burst(xs[4] + 60, 760, 1.4, 1 - ex2);
        if (lt > ex) { K.check(540, 460, 0.8 * E(seg(lt, ex, ex + 0.25)), 1); K.pill('100% SAME', 540, 1060, 68, GREEN, C.white, E(seg(lt, ex, ex + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + rb, 'pop', { gain: 0.45 }); cue(st + ex, 'sparkle', { dur: 0.5, gain: 0.35 });
  }
  // ── 11 · The twist? A famous file called forty-two dot zip ──
  {
    const st = cut(10), tw = Wd('twist', 10) - st, fa = Wd('famous', 10) - st, ft = Wd('forty-two', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 700], zoom: 0.14, note: 'THE TWIST pill + "?"; on "famous" a spotlight circle; red zip file labelled 42 slams in on "forty-two"; 42.zip pill',
      draw(lt, d, t) {
        backdrop();
        if (lt < fa + 0.2) bigText('?', 540, 720, 420, C.yellow, Math.sin(lt * 5) * 0.08, E(seg(lt, 0, 0.3)) * (1 - seg(lt, fa - 0.1, fa + 0.2)));
        if (lt > tw) K.pill('THE TWIST', 540, 220, 76, C.yellow, C.ink, E(seg(lt, tw, tw + 0.25)));
        if (lt > fa) { ctx.save(); ctx.globalAlpha = 0.5 * E(seg(lt, fa, fa + 0.3)); circle(540, 740, 380, C.white); ctx.restore(); }
        if (lt > fa) { const red = lt > ft; K.zipFile(540, lerp(-300, 740, eob(seg(lt, fa, fa + 0.4))), 1.2 * (red ? 1 + 0.12 * Math.sin(Math.PI * seg(lt, ft, ft + 0.3)) : 1), { label: red ? '42' : '?', labelSize: 88, col: red ? C.red : '#C9CDD6', colD: red ? '#A81F2D' : '#9AA1AE', rot: -0.05 }); if (red) K.burst(540, 740, 3, 1 - seg(lt, ft, ft + 0.4)); }
        if (lt > ft + 0.4) K.pill('42.zip', 540, 1110, 72, C.ink, C.white, E(seg(lt, ft + 0.4, ft + 0.65)));
      } });
    cue(st, 'whoosh'); cue(st + tw, 'pop', { gain: 0.45 }); cue(st + fa, 'sparkle', { dur: 0.4, gain: 0.25 }); cue(st + fa + 0.35, 'thud', { gain: 0.45 }); cue(st + ft, 'pop', { gain: 0.5 });
  }
  // ── 12 · is only forty-two kilobytes ──
  {
    const st = cut(11), ft = Wd('forty-two', 11) - st, kb = Wd('kilobytes', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 700], zoom: 0.1, note: 'red 42 zip; size meter barely fills; 42 KB pill on "forty-two"; TINY! on "kilobytes"',
      draw(lt, d, t) {
        backdrop();
        K.zipFile(540, 520, 0.85, { label: '42', labelSize: 88, col: C.red, colD: '#A81F2D', rot: -0.05 });
        K.sizeMeter(260, 920, 600, 0.04 * eo(seg(lt, ft, ft + 0.4)), 'SIZE', BLUE, null);
        if (lt > ft) K.pill('42 KB', 540, 1060, 72, C.yellow, C.ink, E(seg(lt, ft, ft + 0.25)));
        if (lt > kb) bigText('TINY!', 830, 300, 110, C.white, 0.15, E(seg(lt, kb, kb + 0.3)));
      } });
    cue(st, 'whoosh'); cue(st + ft, 'pop', { gain: 0.45 }); cue(st + kb, 'boing', { gain: 0.3 });
  }
  // ── 13 · but fully unzipped, it would fill millions of gigabytes ──
  {
    const st = cut(12), un = Wd('unzipped', 12) - st, fi = Wd('fill', 12) - st, mi = Wd('millions', 12) - st, gb = Wd('gigabytes', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 700], zoom: 0.1, note: 'red zip unzips into 16 zips on "unzipped"; on "fill" rows of server racks fill the frame; MILLIONS then 4,500,000 GB pill on "gigabytes"',
      draw(lt, d, t) {
        backdrop();
        const sp = eio(seg(lt, un, un + 0.5)), rack = eio(seg(lt, fi - 0.1, mi + 0.3));
        if (rack < 1) {
          ctx.save(); ctx.globalAlpha = 1 - rack;
          if (sp < 1) K.zipFile(540, 700, 1.0 * (1 - sp * 0.6), { open: sp * 2, label: '42', labelSize: 88, col: C.red, colD: '#A81F2D' });
          if (sp > 0.3) K.zipGrid(540, 700, 4, 4, 210, 0.5, 16 * seg(sp, 0.3, 1) + 0.5, t);
          ctx.restore();
        }
        if (rack > 0) K.serverGrid(110, 330, 9, 1 + Math.floor(rack * 5), 108, 150, 1.05, t, () => (rack > 0.3 ? 1 : 0));
        if (lt > mi) K.pill('MILLIONS', 540, 190, 72, C.yellow, C.ink, E(seg(lt, mi, mi + 0.25)) * (1 - seg(lt, gb - 0.1, gb)));
        if (lt > gb) K.pill('4,500,000 GB', 540, 190, 68, C.red, C.white, E(seg(lt, gb, gb + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + un, 'zip', { gain: 0.45 }); cue(st + un + 0.1, 'pop', { gain: 0.35 }); cue(st + fi, 'slide', { dur: 1.0, gain: 0.3 }); cue(st + gb, 'slam', { gain: 0.45 });
  }
  // ── 14 · So a zip isn't magic, it's just really good note taking ──
  {
    const st = cut(13), ma = Wd('magic', 13) - st, go = Wd('good', 13) - st, nt = Wd('note', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 640], zoom: 0.14, note: 'room: hero holds the zip file; sparkles + red X on "magic"; on "note" a yellow NOTES chip pops and hero points at camera with a smirk',
      draw(lt, d, t) {
        K.room();
        const pt = lt > go;
        K.man({ x: 540, y: 1280, s: 1.4, arm: pt ? K.ARM.point : K.PHONE_ARM, finger: pt ? -0.2 : undefined, holding: pt ? null : (x, y) => K.zipFile(x + 10, y - 90, 0.32, { label: null }), eyes: 'n', mouth: pt ? 'smirk' : 'smile', smirk: pt, brow: pt ? 0.6 : 0.3, look: 0 });
        if (lt > ma - 0.2 && lt < go) { for (let k = 0; k < 4; k++) K.sparkleStar(300 + k * 160, 300 + Math.sin(k * 2) * 60, 0.7, E(seg(lt, ma - 0.2 + k * 0.05, ma + k * 0.05))); K.redX(540, 320, 0.45 * E(seg(lt, ma + 0.1, ma + 0.3)), 1); }
        if (lt > ma && lt < go) K.pill('NOT MAGIC', 540, 520, 60, C.red, C.white, E(seg(lt, ma, ma + 0.25)));
        if (lt > nt - 0.1) K.noteChip(540, 330, 1.6, 'NOTES', { sc: E(seg(lt, nt - 0.1, nt + 0.2)), rot: -0.05 });
      } });
    cue(st, 'whoosh'); cue(st + ma, 'sparkle', { dur: 0.4, gain: 0.3 }); cue(st + ma + 0.15, 'slam', { gain: 0.35 }); cue(st + nt, 'pop', { gain: 0.5 }); cue(st + nt + 0.4, 'boing', { gain: 0.3 });
  }

  return { shots: S, cues: CUES };
}
