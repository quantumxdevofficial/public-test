// WHAT ACTUALLY HAPPENS WHEN YOU COPY AND PASTE?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const disc = () => { fillAll(C.bg); circle(540, 740, 520, '#E4DCCB'); };
const press = (lt, t0) => (lt < t0 ? 0 : clamp(1 - Math.abs(lt - t0 - 0.08) / 0.12));

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · HOOK: hero; Hello! card gets copied, a twin pops out on "paste" ──
  {
    const st = cut(0), cp = Wd('copy', 0) - st, ps = Wd('paste', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 600], zoom: 0.1, note: 'hero close-up; Hello! card above, selection sweeps on "copy", twin card pops out on "paste"',
      draw(lt, d, t) {
        K.room();
        const got = lt > ps;
        K.man({ x: 540, y: 1330, s: 1.45, arm: K.armPose(K.ARM.down, K.ARM.point, eo(seg(lt, 0.2, 0.6))), finger: 0,
          eyes: got ? 'wide' : 'n', mouth: got ? 'o' : 'smile', brow: got ? 1 : 0.4, look: 0.4 });
        const tw = E(seg(lt, ps, ps + 0.35));
        K.textCard(lerp(540, 300, eo(seg(lt, ps, ps + 0.35))), 320, 1.0, 'Hello!', { sel: seg(lt, cp - 0.1, cp + 0.25) * (got ? 0 : 1) });
        if (got) K.textCard(lerp(540, 780, eo(seg(lt, ps, ps + 0.35))), 320, 1.0, 'Hello!', { sc: tw });
      } });
    cue(st + cp, 'pop', { gain: 0.3 }); cue(st + ps, 'boing', { gain: 0.35 });
  }

  // ── 2a · hit copy: CTRL + C ───────────────────────────────────────────
  {
    const st = cut(1), cp = Wd('copy', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 760], zoom: 0.1, note: 'Hello! card selected; CTRL + C keycaps; C presses on "copy"',
      draw(lt, d, t) {
        disc();
        K.textCard(540, 470, 1, 'Hello!', { sel: 1 });
        const held = lt > cp - 0.15 && lt < cp + 0.45 ? 1 : 0;
        K.keycap(330, 900, 1.1, 'CTRL', held, 1.3);
        bigText('+', 560, 880, 110, C.ink);
        K.keycap(770, 900, 1.1, 'C', press(lt, cp - 0.05), 1, lt > cp);
        if (lt > cp) K.sparkleStar(820, 690, 0.8, clamp(1 - (lt - cp) * 1.2));
      } });
    cue(st, 'whoosh'); cue(st + cp - 0.12, 'tock', { gain: 0.35 }); cue(st + cp, 'tock', { gain: 0.35 });
  }

  // ── 2b · tucks it into a hidden spot called the clipboard ─────────────
  {
    const st = Wd('tucks', 1) - 0.15, hd = Wd('hidden', 1) - st, cb = Wd('clipboard', 1) - st;
    add({ id: 'S03', at: st, cam: [540, 760], zoom: 0.1, note: 'Hello! card slides down into a clipboard that rises; CLIPBOARD pill on "clipboard"',
      draw(lt, d, t) {
        disc();
        const b = eo(seg(lt, hd - 0.4, hd + 0.1));
        const u = eio(seg(lt, 0.1, hd + 0.2));
        K.clipboardBoard(540, lerp(1700, 820, b), 1, null, 0, lt > cb ? clamp((lt - cb) * 3) : 0);
        K.textCard(540, lerp(300, 800, u), lerp(1, 0.7, u), 'Hello!', { rot: Math.sin(lt * 3) * 0.04 * (1 - u) });
        if (lt > cb) K.pill('CLIPBOARD', 540, 260, 70, C.ink, C.white, E(seg(lt, cb, cb + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 0.6, gain: 0.25 }); cue(st + hd + 0.15, 'thud', { gain: 0.4 }); cue(st + cb, 'pop', { gain: 0.4 });
  }

  // ── 3a · which holds just one thing ───────────────────────────────────
  {
    const st = cut(2), one = Wd('one', 2) - st;
    add({ id: 'S04', at: st, cam: [540, 760], zoom: 0.08, note: 'clipboard with ONE Hello! card; yellow "1" badge pops on "one"',
      draw(lt, d, t) {
        disc();
        K.clipboardBoard(540, 820, 1, () => K.textCard(0, 0, 0.7, 'Hello!'));
        if (lt > one) { const p = E(seg(lt, one, one + 0.25)); circle(830, 460, 95 * p, C.yellow); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.arc(830, 460, 95 * p, 0, Math.PI * 2); ctx.stroke(); bigText('1', 830, 464, 120 * p, C.ink); }
      } });
    cue(st, 'whoosh'); cue(st + one, 'pop', { gain: 0.4 });
  }

  // ── 3b · so your next copy replaces it ────────────────────────────────
  {
    const st = Wd('so', 2) - 0.12, nx = Wd('next', 2) - st, rp = Wd('replaces', 2) - st;
    add({ id: 'S05', at: st, cam: [540, 760], zoom: 0.1, note: 'new Pizza? card slides in from the right on "next", knocks Hello! off on "replaces"; REPLACED pill',
      draw(lt, d, t) {
        disc();
        const k = eo(seg(lt, rp - 0.1, rp + 0.35));
        const inn = eio(seg(lt, nx - 0.1, rp));
        K.clipboardBoard(540, 820, 1, () => {
          K.textCard(lerp(0, -420, k), lerp(0, 120, k), 0.7, 'Hello!', { rot: -k * 0.8, a: 1 - k });
          if (inn >= 1) K.textCard(0, 0, 0.7, 'Pizza?', { col: C.red });
        });
        if (inn > 0 && inn < 1) K.textCard(lerp(1150, 540, inn), 850, 0.7, 'Pizza?', { col: C.red });
        if (lt > rp) K.pill('REPLACED', 540, 260, 70, C.red, C.white, E(seg(lt, rp, rp + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + nx - 0.1, 'slide', { dur: 0.5, gain: 0.25 }); cue(st + rp, 'zip', { gain: 0.35 }); cue(st + rp + 0.1, 'pop', { gain: 0.35 });
  }

  // ── 4 · but here's the clever part ────────────────────────────────────
  {
    const st = cut(3), cl = Wd('clever', 3) - st;
    add({ id: 'S06', at: st, cam: [540, 600], zoom: 0.12, note: 'hero raises a finger, smirks; burst behind head on "clever"',
      draw(lt, d, t) {
        K.room();
        if (lt > cl) K.burst(540, 420, 1.3 * E(seg(lt, cl, cl + 0.3)), 1);
        K.man({ x: 540, y: 1300, s: 1.45, arm: K.armPose(K.ARM.down, K.ARM.point, eo(seg(lt, 0.05, 0.45))), finger: lt > cl ? Math.sin(lt * 11) * 0.3 : 0,
          eyes: 'n', mouth: lt > cl ? 'grin' : 'smirk', brow: 0.8, look: 0 });
      } });
    cue(st, 'whoosh'); cue(st + cl, 'sparkle', { dur: 0.5, gain: 0.3 });
  }

  // ── 5 · it saves your text in several formats at once ─────────────────
  {
    const st = cut(4), sv = Wd('several', 4) - st, fm = Wd('formats', 4) - st, on = Wd('once', 4) - st;
    add({ id: 'S07', at: st, cam: [540, 700], zoom: 0.08, note: 'Hello! card on top; format cards fan out: PLAIN on "several", FANCY on "formats", IMAGE on "once"',
      draw(lt, d, t) {
        disc();
        const up = eio(seg(lt, sv - 0.4, sv));
        K.textCard(540, lerp(700, 300, up), lerp(1.4, 0.85, up), 'Hello!', { sel: 1 - up });
        if (up < 1) bigText('x3', 860, lerp(470, 160, up), 110 * E(seg(lt, 0.3, 0.6)) * (1 - up), C.yellow, 0.15);
        const xs = [220, 540, 860], ts = [sv, fm, on], kinds = ['plain', 'fancy', 'image'];
        for (let i = 0; i < 3; i++) {
          const p = eo(seg(lt, ts[i] - 0.15, ts[i] + 0.25));
          if (p <= 0) continue;
          K.formatCard(lerp(540, xs[i], p), lerp(360, 820, p), 0.95, kinds[i], { rot: (i - 1) * 0.08 * p, sc: E(seg(lt, ts[i] - 0.15, ts[i] + 0.2)) });
        }
      } });
    cue(st, 'whoosh'); cue(st + sv, 'pop', { gain: 0.35 }); cue(st + fm, 'pop', { gain: 0.35 }); cue(st + on, 'pop', { gain: 0.4 });
  }

  // ── 6 · the app you paste into grabs the one it understands ──────────
  {
    const st = cut(5), ps = Wd('paste', 5) - st, gr = Wd('grabs', 5) - st, un = Wd('understands', 5) - st;
    add({ id: 'S08', at: st, cam: [540, 700], zoom: 0.08, note: 'three format cards up top; Docs window rises; on "grabs" FANCY (ring) drops into Docs; bold blue Hello! on "understands"',
      draw(lt, d, t) {
        disc();
        const w = eo(seg(lt, 0, ps + 0.1));
        const g = eio(seg(lt, gr, un));
        K.appWindow(540, lerp(1600, 920, w), 820, 560, 'docs', () => {
          if (lt > un - 0.05) K.textCard(0, 70, 0.95 * E(seg(lt, un - 0.05, un + 0.25)), 'Hello!');
        });
        K.formatCard(220, 330, 0.7, 'plain');
        K.formatCard(860, 330, 0.7, 'image');
        if (g < 1) K.formatCard(540, lerp(330, 900, g), 0.7 * (1 - g * 0.6), 'fancy', { ring: seg(lt, gr - 0.2, gr) });
      } });
    cue(st, 'whoosh'); cue(st + ps, 'slide', { dur: 0.4, gain: 0.2 }); cue(st + gr, 'zip', { gain: 0.3 }); cue(st + un, 'pop', { gain: 0.4 });
  }

  // ── 7a · which is why pasting into a plain notepad ───────────────────
  {
    const st = cut(6), np = Wd('notepad', 6) - st;
    add({ id: 'S09', at: st, cam: [540, 760], zoom: 0.08, note: 'Notepad window rises; on "notepad" it skips FANCY and grabs PLAIN (yellow ring)',
      draw(lt, d, t) {
        disc();
        const w = eo(seg(lt, 0, 0.45));
        K.appWindow(540, lerp(1600, 900, w), 820, 540, 'notepad');
        const g = eio(seg(lt, np, d));
        K.formatCard(760, 330, 0.7, 'fancy', { rot: 0.06 });
        K.formatCard(lerp(320, 540, g), lerp(330, 880, g), 0.7 * (1 - g * 0.6), 'plain', { rot: -0.06 * (1 - g), ring: seg(lt, np - 0.2, np) });
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 0.4, gain: 0.2 }); cue(st + np, 'zip', { gain: 0.3 });
  }

  // ── 7b · drops the bold ──────────────────────────────────────────────
  {
    const st = Wd('drops', 6) - 0.15, bd = Wd('bold', 6) - st;
    add({ id: 'S10', at: st, cam: [540, 700], zoom: 0.1, note: 'close-up Notepad: plain grey Hello! lands; big B icon gets the red X on "bold"',
      draw(lt, d, t) {
        disc();
        K.appWindow(540, 900, 860, 600, 'notepad', () => K.textCard(0, 40, 1.05, 'Hello!', { style: 'plain', sc: E(seg(lt, 0.05, 0.35)) }));
        const b = E(seg(lt, bd - 0.3, bd));
        if (b > 0) { ctx.save(); ctx.translate(540, 300); ctx.scale(b * 1.3, b * 1.3); rr(-110, -110, 220, 220, 36); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke();
          ctx.fillStyle = C.ink; ctx.font = '900 170px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('B', 0, 8); ctx.restore(); }
        if (lt > bd) K.redX(540, 300, lerp(1.4, 0.7, eo(seg(lt, bd, bd + 0.2))), 1);
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'thud', { gain: 0.3 }); cue(st + bd, 'slam', { gain: 0.45 });
  }

  // ── 8 · and the name is older than computers ─────────────────────────
  {
    const st = cut(7), ol = Wd('older', 7) - st, cm = Wd('computers', 7) - st;
    add({ id: 'S11', at: st, cam: [540, 700], zoom: 0.1, note: 'old PC slides in; on "older" scissors and glue drop in front; on "computers" PC moves aside',
      draw(lt, d, t) {
        disc();
        const pc = eo(seg(lt, 0, 0.4)), aside = eio(seg(lt, cm, cm + 0.4));
        K.retroPC(lerp(lerp(1500, 540, pc), 820, aside), lerp(700, 480, aside), lerp(1, 0.6, aside), () => {
          ctx.fillStyle = '#2A3A3A'; ctx.font = '900 56px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('COPY', 0, 50); ctx.fillText('PASTE', 0, 130);
        });
        const a = E(seg(lt, ol - 0.1, ol + 0.25)), b = E(seg(lt, ol + 0.1, ol + 0.45));
        if (a > 0) K.scissors(330, lerp(-300, 1000, clamp(a)), 1.0 * a, 0.5 + Math.sin(lt * 9) * 0.25, -0.5);
        if (b > 0) K.glueBottle(760, lerp(-300, 1080, clamp(b)), 0.95 * b, 0.12);
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 0.4, gain: 0.2 }); cue(st + ol + 0.15, 'thud', { gain: 0.4 }); cue(st + ol + 0.4, 'thud', { gain: 0.35 }); cue(st + cm, 'zip', { gain: 0.25 });
  }

  // ── 9a · editors used to cut paragraphs out with scissors ────────────
  {
    const st = cut(8), ct = Wd('cut', 8) - st, sc = Wd('scissors', 8) - st;
    add({ id: 'S12', at: st, cam: [540, 760], zoom: 0.1, note: 'old typed page; scissors trace a red dashed cut round the middle paragraph from "cut"; strip lifts out on "scissors"',
      draw(lt, d, t) {
        fillAll('#E4DCCB');
        const p = seg(lt, ct - 0.1, sc + 0.1);
        const lift = eo(seg(lt, sc + 0.1, sc + 0.5));
        K.oldPage(540, 800, 1.15, { rows: 3, dash: lift > 0 ? -1 : 1, dashP: p, gap: lift > 0 ? 1 : -1 });
        // scissors follow the cut path (paragraph 1 rect in page coords = (-215, -80) 430x160)
        const per = 2 * (430 + 160); let px = -215, py = -80, left = per * p;
        for (const [dx, dy] of [[430, 0], [0, 160], [-430, 0], [0, -160]]) { const Ls = Math.abs(dx + dy), k = Math.min(1, left / Ls); px += dx * k; py += dy * k; left -= Ls; if (left <= 0) break; }
        if (lift > 0) K.paperStrip(lerp(540, 600, lift), lerp(800, 600, lift), 1.15 * lerp(1, 1.08, lift), lerp(0, -0.08, lift));
        const sx = 540 + px * 1.15, sy = 800 + py * 1.15;
        if (lift <= 0) K.scissors(sx, sy, 0.75 * E(seg(lt, 0, 0.3)), 0.5 + Math.sin(lt * 16) * 0.4, Math.floor(p * 4 - 1e-6) * Math.PI / 2);
        else K.scissors(lerp(sx, 960, lift), lerp(sy, 300, lift), 0.75, 0.6, -0.6);
      } });
    cue(st, 'whoosh'); cue(st + ct, 'slide', { dur: Math.max(0.3, sc - ct), gain: 0.25 }); cue(st + sc + 0.1, 'pop', { gain: 0.35 });
  }

  // ── 9b · and paste them onto a new page ─────────────────────────────
  {
    const st = Wd('paste', 8) - 0.15, pg = Wd('page', 8) - st;
    add({ id: 'S13', at: st, cam: [540, 760], zoom: 0.1, note: 'new page with an empty slot; glue bottle dabs the slot; strip drops in and lands on "page"',
      draw(lt, d, t) {
        fillAll('#E4DCCB');
        K.oldPage(540, 860, 1.05, { rows: 3, empty: 1 });
        const gl = seg(lt, 0.05, pg - 0.25);
        ctx.save(); ctx.globalAlpha = 0.9; for (let i = 0; i < 5; i++) { const q = clamp(gl * 5 - i); if (q > 0) ell(540 - 160 + i * 80, 860, 26 * q, 14 * q, C.white); } ctx.restore();
        const dr = eo(seg(lt, pg - 0.35, pg));
        if (dr < 1) K.glueBottle(lerp(380, 700, gl), 770 + Math.sin(gl * 20) * 8 - 230 * 0.8, 0.8, Math.PI, 0);
        K.paperStrip(540, lerp(150, 860, dr), 1.05, lerp(0.15, 0, dr));
        if (lt > pg) K.shockLines(540, 860, 300, clamp(1 - (lt - pg) * 2));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 0.4, gain: 0.2 }); cue(st + pg, 'thud', { gain: 0.45 });
  }

  // ── 10a · in the seventies, Larry Tesler at Xerox ───────────────────
  {
    const st = cut(9), sv = Wd('seventies', 9) - st, ts = Wd('tesler', 9) - st, xr = Wd('xerox', 9) - st;
    add({ id: 'S14', at: st, cam: [540, 700], zoom: 0.08, note: '1970s pill on "seventies"; retro PC with an editor; pills LARRY TESLER, XEROX pop',
      draw(lt, d, t) {
        disc();
        K.retroPC(540, 760, 1.1, () => { for (let i = 0; i < 4; i++) { rr(-160, 20 + i * 44, i === 3 ? 160 : 320, 16, 8); ctx.fillStyle = '#9BB3A8'; ctx.fill(); } });
        if (lt > sv - 0.1) K.pill('1970s', 540, 250, 80, C.yellow, C.ink, E(seg(lt, sv - 0.1, sv + 0.2)));
        if (lt > ts) K.pill('LARRY TESLER', 330, 1170, 50, C.ink, C.white, E(seg(lt, ts, ts + 0.25)));
        if (lt > xr) K.pill('XEROX', 820, 1170, 50, C.shirt, C.white, E(seg(lt, xr, xr + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sv, 'pop', { gain: 0.35 }); cue(st + ts, 'pop', { gain: 0.3 }); cue(st + xr, 'pop', { gain: 0.3 });
  }

  // ── 10b · borrowed the words ─────────────────────────────────────────
  {
    const st = Wd('borrowed', 9) - 0.12, wd = Wd('words', 9) - st;
    add({ id: 'S15', at: st, cam: [540, 700], zoom: 0.12, note: 'close-up PC screen: CUT / COPY / PASTE rows type in; PASTE highlighted on "words"',
      draw(lt, d, t) {
        disc();
        const items = ['CUT', 'COPY', 'PASTE'], shown = clamp(Math.floor(lt / 0.22) + 1, 0, 3);
        K.retroPC(540, 760, 1.5, () => {
          ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.font = '900 60px Inter';
          for (let i = 0; i < shown; i++) {
            const y = -120 + i * 80;
            if (i === 2 && lt > wd) { rr(-170, y - 34, 340 * eo(seg(lt, wd, wd + 0.2)), 68, 12); ctx.fillStyle = C.yellow; ctx.fill(); }
            ctx.fillStyle = '#2A3A3A'; ctx.fillText(items[i], -140, y + 2);
          }
        });
      } });
    cue(st, 'whoosh'); for (let i = 0; i < 3; i++) cue(st + i * 0.22, 'tock', { gain: 0.3 }); cue(st + wd, 'pop', { gain: 0.35 });
  }

  // ── 11a · so every paste is really just ──────────────────────────────
  {
    const st = cut(10), rl = Wd('really', 10) - st;
    add({ id: 'S16', at: st, cam: [540, 640], zoom: 0.08, note: 'hero to camera, smirk; scissors left and glue right float in beside his head',
      draw(lt, d, t) {
        K.room();
        K.man({ x: 540, y: 1330, s: 1.45, eyes: 'n', mouth: 'smirk', brow: 0.6, look: 0 });
        const a = E(seg(lt, rl - 0.2, rl + 0.15));
        K.scissors(200, 330 + Math.sin(lt * 3) * 10, 0.6 * a, 0.5 + Math.sin(lt * 8) * 0.2, -0.4);
        K.glueBottle(880, 380 + Math.sin(lt * 3 + 1) * 10, 0.75 * a, 0.15);
      } });
    cue(st, 'whoosh'); cue(st + rl, 'pop', { gain: 0.3 });
  }

  // ── 11b · digital scissors and glue (loop) ──────────────────────────
  {
    const st = Wd('digital', 10) - 0.15, dg = Wd('digital', 10) - st, sc = Wd('scissors', 10) - st, gl = Wd('glue', 10) - st;
    add({ id: 'S17', at: st, cam: [540, 600], zoom: 0.1, note: 'scissors flip into a CTRL X keycap on "scissors", glue flips into CTRL V on "glue"; hero grins + winks',
      draw(lt, d, t) {
        K.room();
        K.man({ x: 540, y: 1330, s: 1.45, arm: K.armPose(K.ARM.down, K.ARM.point, eo(seg(lt, gl, gl + 0.3))), finger: lt > gl ? Math.sin(lt * 11) * 0.35 : null,
          eyes: lt > gl + 0.4 ? 'wink' : 'n', mouth: lt > gl ? 'grin' : 'smirk', brow: 0.6, look: 0 });
        const f1 = seg(lt, sc - 0.15, sc + 0.1), f2 = seg(lt, gl - 0.15, gl + 0.1);
        const sx1 = Math.max(0.02, Math.abs(Math.cos(f1 * Math.PI))), sx2 = Math.max(0.02, Math.abs(Math.cos(f2 * Math.PI)));
        ctx.save(); ctx.translate(200, 330); ctx.scale(sx1, 1);
        if (f1 < 0.5) K.scissors(0, 0, 0.6, 0.5, -0.4); else { K.keycap(0, -30, 0.75, 'X', 0, 1, true); bigText('CTRL', 0, 110, 60, C.white); }
        ctx.restore();
        ctx.save(); ctx.translate(880, 380); ctx.scale(sx2, 1);
        if (f2 < 0.5) K.glueBottle(0, 0, 0.75, 0.15); else { K.keycap(0, -50, 0.75, 'V', 0, 1, true); bigText('CTRL', 0, 90, 60, C.white); }
        ctx.restore();
        if (lt > dg) K.pill('DIGITAL', 540, 130, 56, C.ink, C.white, E(seg(lt, dg, dg + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sc - 0.1, 'zip', { gain: 0.3 }); cue(st + gl - 0.1, 'zip', { gain: 0.3 }); cue(st + gl + 0.4, 'boing', { gain: 0.35 });
  }

  return { shots: S, cues: CUES };
}
