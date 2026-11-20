// HOW DOES SHAZAM KNOW WHAT SONG IS PLAYING?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const GREEN = '#5BAE6A';
const notes = (x0, y0, x1, y1, lt, col = C.yellow, n = 3) => { for (let k = 0; k < n; k++) { const p = (lt * 0.45 + k / n) % 1; K.musicNote(lerp(x0, x1, p), lerp(y0, y1, p) + Math.sin(p * 9 + k) * 30, 0.6 * Math.sin(Math.PI * p), col, Math.sin(lt * 4 + k) * 0.25); } };
const heldPhone = (scr) => (x, y) => K.phone(x + 12, y - 70, 0.3, scr);
const heldOld = (scr) => (x, y) => K.oldPhone(x + 6, y - 100, 0.4, scr);
// spectrogram geometry shared by shots 3-5
const SX = 540, SY = 720, SW = 840, SH = 560;
const peaks = () => K.PEAKS.map((_, i) => K.peakAt(i, SX, SY, SW, SH));
const CODES = ['A7-3F', '9C-1B', 'E4-52', '3D-8A'];

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · How does Shazam name a song in just a few seconds? ──
  {
    const st = cut(0), sh = Wd('Shazam', 0) - st, so = Wd('song', 0) - st, fe = Wd('few', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 760], zoom: 0.1, note: 'cafe: speaker plays notes, hero holds phone up; big phone with listen button pops in on "Shazam"; WHAT SONG? on "song"; stopwatch on "few"',
      draw(lt, d, t) {
        K.cafe(t);
        K.speaker(170, 330, 0.9, Math.abs(Math.sin(t * 8)) * 0.6);
        notes(260, 300, 560, 160, lt, C.yellow, 3);
        K.man({ x: 380, y: 1250, s: 1.3, arm: K.PHONE_ARM, holding: heldPhone(() => K.listenScreen(t, 1, '')), eyes: 'n', mouth: lt > so ? 'o' : 'smile', brow: lt > so ? 0.8 : 0.3, look: -0.6 });
        if (lt > sh) K.phone(800, 700, 0.62 * E(seg(lt, sh, sh + 0.3)), () => K.listenScreen(t, 1));
        if (lt > so) K.pill('WHAT SONG?', 800, 250, 64, C.yellow, C.ink, E(seg(lt, so, so + 0.25)));
        if (lt > fe) K.stopwatch(800, 1110, 0.5 * E(seg(lt, fe, fe + 0.25)), lt * 6);
      } });
    cue(st + sh, 'pop', { gain: 0.45 }); cue(st + so, 'pop', { gain: 0.4 }); cue(st + fe, 'tock', { gain: 0.4 });
  }
  // ── 2 · Well, your phone listens and turns the sound into a picture ──
  {
    const st = cut(1), li = Wd('listens', 1) - st, sd = Wd('sound', 1) - st, pi = Wd('picture', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 700], zoom: 0.12, note: 'phone centre, ink sound wave runs into it on "listens"; on "picture" the phone shrinks away and a spectrogram card pops out',
      draw(lt, d, t) {
        fillAll(C.bg); circle(540, 720, 520, '#E4DCCB');
        const out = eio(seg(lt, pi - 0.2, pi + 0.25));
        if (out < 1) {
          K.phone(lerp(620, 900, out), lerp(720, 380, out), lerp(0.95, 0.4, out), () => K.listenScreen(t, 1));
          const reach = lerp(-150, 430, eo(seg(lt, li - 0.3, li + 0.6)));
          ctx.save(); ctx.globalAlpha = 1 - out; ctx.beginPath(); ctx.rect(-300, 0, reach + 300, H); ctx.clip();
          K.sine(-150, 430, 720, 70, 3, -lt * 12, C.ink, 14);
          ctx.restore();
          if (lt > sd) K.pill('SOUND', 220, 420, 64, C.ink, C.white, E(seg(lt, sd, sd + 0.25)) * (1 - out));
        }
        if (lt > pi - 0.1) {
          const p = E(seg(lt, pi - 0.1, pi + 0.3));
          ctx.save(); ctx.translate(540, 760); ctx.scale(p * 0.85, p * 0.85); K.spectrogram(0, 0, SW, SH, 1, 0, false); ctx.restore();
          K.pill('A PICTURE', 540, 330, 72, C.yellow, C.ink, E(seg(lt, pi + 0.1, pi + 0.35)));
        }
      } });
    cue(st, 'whoosh'); cue(st + li - 0.2, 'slide', { dur: 0.9, gain: 0.2 }); cue(st + sd, 'pop', { gain: 0.4 }); cue(st + pi, 'sparkle', { dur: 0.4, gain: 0.3 });
  }
  // ── 3 · a map of which notes are loudest at each moment ──
  {
    const st = cut(2), ma = Wd('map', 2) - st, no = Wd('notes', 2) - st, lo = Wd('loudest', 2) - st, mo = Wd('moment', 2) - st;
    const [px, py] = K.peakAt(3, SX, SY, SW, SH);
    add({ id: 'S03', at: st, cam: [540, 720], zoom: 0.1, note: 'spectrogram sweeps in left→right; TIME/NOTE axes; LOUDEST tag on a yellow cell on "loudest"; yellow time column on "moment"',
      draw(lt, d, t) {
        fillAll(C.bg);
        K.spectrogram(SX, SY, SW, SH, eo(seg(lt, 0, ma + 0.8)), 0, true);
        if (lt > ma) K.pill('SOUND MAP', 540, 230, 68, C.ink, C.white, E(seg(lt, ma, ma + 0.25)));
        if (lt > no) { ctx.save(); ctx.globalAlpha = 0.35 * (1 - seg(lt, lo - 0.1, lo + 0.2)); ctx.fillStyle = C.yellow; ctx.fillRect(SX - SW / 2 - 100, SY - SH / 2, 70, SH); ctx.restore(); }
        if (lt > lo) K.tag('LOUDEST', 840, 1150, px, py + 20, 60, E(seg(lt, lo, lo + 0.25)));
        if (lt > mo) { const cw = SW / K.SPEC.cols, c = Math.floor(seg(lt, mo, d) * (K.SPEC.cols - 1)); ctx.save(); ctx.lineWidth = 10; ctx.strokeStyle = C.yellow; ctx.strokeRect(SX - SW / 2 + c * cw, SY - SH / 2 - 8, cw, SH + 16); ctx.restore(); }
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 0.8, gain: 0.2 }); cue(st + ma, 'pop', { gain: 0.4 }); cue(st + lo, 'pop', { gain: 0.45 }); cue(st + mo, 'tock', { gain: 0.3 });
  }
  // ── 4 · It keeps only the brightest peaks, like stars ──
  {
    const st = cut(3), on = Wd('only', 3) - st, pe = Wd('peaks', 3) - st, sa = Wd('stars', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 720], zoom: 0.12, note: 'the rest of the grid fades away on "only"; yellow peaks remain; they pop into stars on "stars" on a night-sky navy',
      draw(lt, d, t) {
        const night = eio(seg(lt, sa - 0.2, sa + 0.3));
        fillAll(C.bg); ctx.save(); ctx.globalAlpha = night; fillAll(C.xnavy); ctx.restore();
        ctx.save(); ctx.globalAlpha = 1 - night; K.spectrogram(SX, SY, SW, SH, 1, eio(seg(lt, on - 0.1, on + 0.5)), false); ctx.restore();
        const P = peaks();
        if (lt > pe) P.forEach(([x, y], i) => { const g = E(seg(lt, pe + i * 0.04, pe + 0.25 + i * 0.04)); circle(x, y, 40 * g * (1 - night * 0.5), 'rgba(255,212,59,0.35)'); });
        if (lt > sa - 0.2) P.forEach(([x, y], i) => K.peakStar(x, y, 1.1 * E(seg(lt, sa - 0.2 + i * 0.03, sa + 0.1 + i * 0.03)), C.yellow, Math.sin(t * 2 + i) * 0.2));
        if (lt > on) K.pill(lt > pe ? 'PEAKS ONLY' : 'KEEP ONLY', 540, 230, 68, C.yellow, C.ink, E(seg(lt, on, on + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + on, 'zip', { gain: 0.3 }); cue(st + pe, 'pop', { gain: 0.4 }); cue(st + sa, 'sparkle', { dur: 0.6, gain: 0.35 });
  }
  // ── 5 · and links pairs of them into tiny codes called fingerprints ──
  {
    const st = cut(4), li = Wd('links', 4) - st, co = Wd('codes', 4) - st, fi = Wd('fingerprints', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 760], zoom: 0.1, note: 'night stars; white lines link pairs one after another on "links"; code chips pop below on "codes"; FINGERPRINTS pill on "fingerprints"',
      draw(lt, d, t) {
        fillAll(C.xnavy);
        const P = peaks();
        K.peakLinks(P, lerp(0, P.length - 1, eo(seg(lt, li - 0.1, co))), C.white, 8);
        P.forEach(([x, y], i) => K.peakStar(x, y, 1.1, C.yellow, Math.sin(t * 2 + i) * 0.2));
        if (lt > co - 0.1) CODES.forEach((c, i) => K.hashChip(180 + i * 240, 1150, 0.95, c, E(seg(lt, co - 0.1 + i * 0.08, co + 0.15 + i * 0.08))));
        if (lt > fi) K.pill('FINGERPRINTS', 540, 230, 72, C.yellow, C.ink, E(seg(lt, fi, fi + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + li, 'slide', { dur: 1.0, gain: 0.2 }); cue(st + co, 'pop', { gain: 0.4 }); cue(st + fi, 'pop', { gain: 0.5 });
  }
  // ── 6 · Then it checks those codes against millions of songs ──
  {
    const st = cut(5), ch = Wd('checks', 5) - st, mi = Wd('millions', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.1, note: 'code chips fly from the left column into a song library that scrolls fast; MILLIONS OF SONGS on "millions"',
      draw(lt, d, t) {
        fillAll(C.bg);
        const sp = 300 + 1600 * eio(seg(lt, mi - 0.6, mi + 0.3));
        K.songShelf(660, 760, 700, 900, lt * sp, 0, -1);
        CODES.forEach((c, i) => {
          const u = eio(seg(lt, ch - 0.2 + i * 0.15, ch + 0.5 + i * 0.15));
          K.hashChip(lerp(170, 560, u), lerp(420 + i * 190, 760, u), lerp(0.85, 0.4, u), c, 1 - seg(u, 0.85, 1));
        });
        if (lt > ch) K.pill('CHECK', 170, 260, 60, C.ink, C.white, E(seg(lt, ch, ch + 0.25)));
        if (lt > mi) K.pill('MILLIONS OF SONGS', 540, 1150, 64, C.yellow, C.ink, E(seg(lt, mi, mi + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ch, 'slide', { dur: 1.0, gain: 0.25 }); cue(st + mi, 'pop', { gain: 0.45 });
  }
  // ── 7 · and the song whose codes line up in the same order wins ──
  {
    const st = cut(6), lu = Wd('line', 6) - st, wi = Wd('wins', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 700], zoom: 0.1, note: 'match plot: dots appear; on "line up" the diagonal lights yellow; on "wins" a song card turns green with a check; MATCH! pill',
      draw(lt, d, t) {
        fillAll(C.bg);
        const win = E(seg(lt, wi - 0.1, wi + 0.25));
        K.matchPlot(540, lerp(620, 520, win), lerp(1.05, 0.85, win), eo(seg(lt, 0, lu)), eo(seg(lt, lu - 0.1, lu + 0.5)), t);
        if (lt > lu) K.pill('SAME ORDER', 540, 140, 60, C.yellow, C.ink, E(seg(lt, lu, lu + 0.25)) * (1 - win));
        if (lt > wi - 0.1) { K.songCard(540, 1080, 1.2 * win, 2, 1); K.check(800, 1030, 0.9 * win, 1); K.pill('MATCH!', 540, 140, 76, GREEN, C.white, win); }
      } });
    cue(st, 'whoosh'); cue(st + lu, 'slide', { dur: 0.5, gain: 0.2 }); cue(st + wi, 'slam', { gain: 0.4 }); cue(st + wi + 0.1, 'sparkle', { dur: 0.5, gain: 0.3 });
  }
  // ── 8 · That's why it still works in a noisy cafe ──
  {
    const st = cut(7), wo = Wd('works', 7) - st, no = Wd('noisy', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 720], zoom: 0.12, note: 'cafe: red noise rings + BLAH bubbles; phone shows SONG FOUND on "works" with green check; EVEN WHEN NOISY on "noisy"',
      draw(lt, d, t) {
        K.cafe(t);
        K.speaker(170, 330, 0.9, Math.abs(Math.sin(t * 8)) * 0.6);
        K.noise(300, 760, t, 160, 0.8); K.noise(850, 560, t + 0.4, 150, 0.8);
        K.bubble(260, 560, 0.8, 'BLAH', E(seg(lt, 0.1, 0.4)), -1); K.bubble(860, 380, 0.8, 'CLINK!', E(seg(lt, 0.4, 0.7)), 1);
        K.cafeCup(240, 1080, 1, t); K.cafeCup(880, 1080, 1, t + 1, C.pink);
        const f = seg(lt, wo - 0.2, wo + 0.3);
        K.phone(560, 820, 0.6, () => (f > 0 ? K.resultScreen(eo(f)) : K.listenScreen(t, 1)));
        if (lt > wo) K.check(760, 560, 0.8 * E(seg(lt, wo, wo + 0.25)), 1);
        if (lt > no) K.pill('EVEN WHEN NOISY', 560, 1150, 60, C.red, C.white, E(seg(lt, no, no + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'bubbles', { dur: 1.2, gain: 0.12 }); cue(st + wo, 'pop', { gain: 0.5 }); cue(st + no, 'pop', { gain: 0.4 });
  }
  // ── 9 · The twist? When Shazam launched in two thousand two ──
  {
    const st = cut(8), tw = Wd('twist', 8) - st, la = Wd('launched', 8) - st, tt = Wd('two', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 700], zoom: 0.12, note: 'TWIST pill; old candy-bar phone slides up on "launched"; 2002 card slams in on "two thousand"',
      draw(lt, d, t) {
        fillAll(C.bg); circle(540, 720, 520, '#E4DCCB');
        if (lt < tt + 0.2) bigText('?', 540, 720, 420, C.yellow, Math.sin(lt * 5) * 0.08, E(seg(lt, 0, 0.3)) * (1 - seg(lt, la - 0.2, la + 0.1)));
        if (lt > tw) K.pill('THE TWIST', 540, 220, 76, C.yellow, C.ink, E(seg(lt, tw, tw + 0.25)));
        if (lt > la) K.oldPhone(780, lerp(1500, 760, eob(seg(lt, la, la + 0.45))), 0.75, 'HELLO', '', 0.08);
        if (lt > tt) { const a = E(seg(lt, tt, tt + 0.3)); ctx.save(); ctx.translate(330, 700); ctx.scale(a, a); ctx.rotate(-0.06); rr(-220, -110, 440, 220, 40); ctx.fillStyle = C.ink; ctx.fill(); ctx.fillStyle = C.white; ctx.font = '900 150px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('2002', 0, 8); ctx.restore(); }
      } });
    cue(st, 'whoosh'); cue(st + tw, 'pop', { gain: 0.45 }); cue(st + la, 'slide', { dur: 0.5, gain: 0.25 }); cue(st + tt, 'thud', { gain: 0.45 });
  }
  // ── 10 · there was no app, you dialed two five eight zero ──
  {
    const st = cut(9), na = Wd('no', 9) - st, di = Wd('dialed', 9) - st;
    const keys = [['two', '2'], ['five', '5'], ['eight', '8'], ['zero', '0']].map(([w, k]) => [Wd(w, 9) - st, k]);
    add({ id: 'S10', at: st, cam: [540, 760], zoom: 0.14, note: 'app tile gets a red X on "no app"; close-up old phone, keys 2-5-8-0 light up one by one on their words, digits type on the screen',
      draw(lt, d, t) {
        fillAll(C.bg); circle(540, 760, 560, '#E4DCCB');
        let typed = '', pressed = '';
        for (const [kt, k] of keys) if (lt > kt) { typed += k; if (lt < kt + 0.25) pressed = k; }
        K.oldPhone(560, 820, 1.25, typed || ' ', pressed);
        if (lt < di + 0.2) { const g = 1 - seg(lt, di - 0.1, di + 0.2); K.appTile(800, 380, 2.6 * g, '#2F6FE0'); K.listenButton(800, 380, 0.42 * g, t, 0); if (lt > na) K.redX(800, 380, 0.5 * E(seg(lt, na, na + 0.2)) * g, 1); }
        if (lt > na && lt < di) K.pill('NO APP', 300, 260, 64, C.red, C.white, E(seg(lt, na, na + 0.25)));
        if (lt > di) K.pill('DIAL 2580', 300, 260, 64, C.yellow, C.ink, E(seg(lt, di, di + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + na, 'slam', { gain: 0.35 }); keys.forEach(([kt]) => cue(st + kt, 'tock', { gain: 0.45 }));
  }
  // ── 11 · held your phone up to the music, and got a text back ──
  {
    const st = cut(10), ph = Wd('phone', 10) - st, mu = Wd('music', 10) - st, te = Wd('text', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 700], zoom: 0.12, note: 'cafe: hero lifts the old phone toward the speaker on "phone up"; notes flow into it on "music"; green SMS with SONG + ARTIST pops on "text"',
      draw(lt, d, t) {
        K.cafe(t);
        K.speaker(170, 330, 0.9, Math.abs(Math.sin(t * 8)) * 0.6);
        const up = eio(seg(lt, ph - 0.3, ph + 0.2));
        const got = lt > te;
        K.man({ x: 520, y: 1250, s: 1.3, arm: K.armPose(K.PHONE_ARM, K.ARM.wave, up), holding: heldOld(got ? 'SMS!' : 'CALL'), eyes: 'n', mouth: got ? 'grin' : 'smile', brow: got ? 0.8 : 0.3, look: -0.7 });
        if (lt > mu - 0.3 && !got) notes(260, 330, 860, 620, lt, C.yellow, 3);
        if (lt > mu) K.pill('30 SEC CALL', 820, 200, 56, C.ink, C.white, E(seg(lt, mu, mu + 0.25)) * (1 - seg(lt, te - 0.1, te + 0.1)));
        if (got) K.smsBubble(660, 230, 0.9, ['SONG: ...', 'ARTIST: ...'], E(seg(lt, te, te + 0.3)));
      } });
    cue(st, 'whoosh'); cue(st + ph, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + mu, 'pop', { gain: 0.35 }); cue(st + te, 'boing', { gain: 0.35 });
  }
  // ── 12 · So every song you hear has a fingerprint, just like you ──
  {
    const st = cut(11), so = Wd('song', 11) - st, fi = Wd('fingerprint', 11) - st, yo = Wd('you', 11) - st;
    const yo2 = Wd('like', 11) - st + 0.15;
    add({ id: 'S12', at: st, cam: [540, 640], zoom: 0.14, note: 'room: hero centre; star-constellation card pops above on "song"; a real fingerprint card pops beside it on "fingerprint"; hero points at camera with smirk on "like you"',
      draw(lt, d, t) {
        K.room();
        const pt = lt > yo2;
        K.man({ x: 540, y: 1280, s: 1.4, arm: pt ? K.ARM.point : K.ARM.down, finger: pt ? -0.2 : undefined, eyes: 'n', mouth: pt ? 'smirk' : 'smile', smirk: pt, brow: pt ? 0.6 : 0.3, look: 0 });
        if (lt > so - 0.2) {
          const a = E(seg(lt, so - 0.2, so + 0.2));
          ctx.save(); ctx.translate(300, 380); ctx.scale(0.36 * a, 0.36 * a); rr(-480, -340, 960, 680, 50); ctx.fillStyle = C.xnavy; ctx.fill();
          const P = K.PEAKS.map((_, i) => K.peakAt(i, 0, 0, SW, SH)); K.peakLinks(P, P.length, C.white, 14); P.forEach(([x, y]) => K.peakStar(x, y, 1.8, C.yellow)); ctx.restore();
        }
        if (lt > fi) K.fingerprint(790, 380, 0.55 * E(seg(lt, fi, fi + 0.3)), 3, { card: true });
        if (lt > fi) bigText('=', 545, 380, 120, C.yellow, 0, E(seg(lt, fi + 0.1, fi + 0.35)));
      } });
    cue(st, 'whoosh'); cue(st + so, 'sparkle', { dur: 0.5, gain: 0.3 }); cue(st + fi, 'pop', { gain: 0.5 }); cue(st + yo, 'boing', { gain: 0.3 });
  }

  return { shots: S, cues: CUES };
}
