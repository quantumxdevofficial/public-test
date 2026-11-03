// HOW DOES WI-FI WORK?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';

const BITS = '10110100'.split('');
const homePhone = (x, y) => K.phone(x + 12, y - 70, 0.3, K.homeScreen);
function buffering(t) { fillAll('#DCEEF6'); ctx.fillStyle = C.ink; ctx.font = '900 30px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('9:41', 0, -290); K.spinner(0, -40, 1, t); rr(-120, 120, 240, 26, 13); ctx.fillStyle = '#B9C6CF'; ctx.fill(); rr(-120, 120, 50, 26, 13); ctx.fillStyle = C.red; ctx.fill(); }
function shelfRoom() { fillAll(C.bg); ctx.fillStyle = C.floor; ctx.fillRect(-300, 1560, W + 600, 700); ctx.fillStyle = C.pot; ctx.fillRect(160, 1020, 760, 28); ctx.fillStyle = '#A85D3A'; ctx.fillRect(160, 1048, 760, 12); }

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · HOOK: hero with phone, Wi-Fi icon pops ──────────────────────────
  {
    const st = cut(0), wf = Wd('wifi', 0) - st, wk = Wd('work', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 760], note: 'hero holds phone; Wi-Fi icon pops on "Wi-Fi", bars fill, ? on "work"',
      draw(lt) {
        K.room();
        const hit = lt > wf;
        K.man({ x: 540, y: 1200, s: 1.6, arm: K.PHONE_ARM, holding: homePhone, eyes: lt > wk ? 'wide' : 'n', mouth: lt > wk ? 'o' : 'smile', brow: hit ? 0.8 : 0.2, look: -0.4 });
        if (hit) { K.wifiIcon(820, 330, 1.15 * eob(seg(lt, wf, wf + 0.3)), Math.min(3, Math.floor((lt - wf) * 8) + 1)); }
        if (lt > wk) bigText('?', 960, 230, 150, C.yellow, 0.2, eob(seg(lt, wk, wk + 0.25)));
      } });
    cue(st + wf, 'pop'); cue(st + wk, 'boing', { gain: 0.45 });
  }

  // ── 2 · router plugged into the internet ────────────────────────────────
  {
    const st = cut(1), rt = Wd('router', 1) - st, net = Wd('internet', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 820], zoom: 0.1, note: 'router pops on shelf; globe on "internet"; data dots run down the cable',
      draw(lt, d, t) {
        shelfRoom();
        const sock = [880, 1260], rp = eob(seg(lt, rt - 0.1, rt + 0.25));
        K.cable(sock[0], sock[1], 640, 990);
        if (rp > 0) K.router(540, 950, 1.15 * rp, t);
        const gp = eob(seg(lt, net - 0.1, net + 0.25));
        if (gp > 0) { K.globe(880, 560, gp, t); ctx.save(); ctx.setLineDash([2, 26]); ctx.lineCap = 'round'; ctx.lineWidth = 14; ctx.strokeStyle = C.ink; ctx.globalAlpha = 0.4; ctx.beginPath(); ctx.moveTo(880, 690); ctx.lineTo(880, 1185); ctx.stroke(); ctx.restore(); }
        if (lt > net) for (let k = 0; k < 6; k++) {
          const u = ((lt - net) * 0.9 + k / 6) % 1;
          const [px, py] = u < 0.5 ? [880, lerp(690, 1190, u * 2)] : K.cableAt(sock[0], sock[1], 640, 990, (u - 0.5) * 2);
          rr(px - 16, py - 16, 32, 32, 6); ctx.fillStyle = C.yellow; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = C.ink; ctx.stroke();
        }
      } });
    cue(st, 'whoosh'); cue(st + rt, 'thud', { gain: 0.6 }); cue(st + net, 'pop'); cue(st + net + 0.2, 'slide', { dur: 1.2, gain: 0.4 });
  }

  // ── 3 · data turns into radio waves ─────────────────────────────────────
  {
    const st = cut(2), turns = Wd('turns', 2) - st, radio = Wd('radio', 2) - st, inv = Wd('invisible', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 820], zoom: 0.14, note: 'router close-up: data squares go in, blue waves pour out on "radio"',
      draw(lt, d, t) {
        fillAll(C.bg);
        K.router(540, 1000, 1.5, t);
        for (let k = 0; k < 5; k++) { const u = clamp((lt - k * 0.18) / 0.8); if (u <= 0 || u >= 1 || lt > radio) continue; const y = lerp(1500, 1060, eio(u)); rr(540 - 22, y - 22, 44, 44, 8); ctx.fillStyle = C.yellow; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke(); }
        if (lt > turns) K.burst(540, 1000, 2.4, 1 - seg(lt, turns, turns + 0.5));
        const wa = eo(seg(lt, radio - 0.1, radio + 0.3));
        if (wa > 0) { K.waves(320, 700, lt, { ang: -Math.PI * 0.7, spread: 0.5, maxR: 520, a: wa, dash: lt > inv ? [26, 22] : null }); K.waves(760, 700, lt, { ang: -Math.PI * 0.3, spread: 0.5, maxR: 520, a: wa, dash: lt > inv ? [26, 22] : null }); K.waves(540, 840, lt + 0.3, { ang: -Math.PI / 2, spread: 0.7, maxR: 620, a: wa }); }
      } });
    cue(st, 'whoosh'); cue(st + turns, 'pop', { gain: 0.5 }); cue(st + radio, 'sparkle', { dur: 1.2, gain: 0.5 });
  }

  // ── 4 · ones and zeros ride the wave ────────────────────────────────────
  {
    const st = cut(3), carry = Wd('carry', 3) - st, ones = Wd('ones', 3) - st, zeros = Wd('zeros', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 760], zoom: 0.08, note: 'big sine wave; 1/0 tiles pop on crests ("ones", "zeros")',
      draw(lt) {
        fillAll(C.bg);
        const ph = -lt * 3.2;
        K.sine(-100, 1180, 820, 150, 3.5, ph, K.WAVE, 22);
        BITS.forEach((b, k) => {
          const x = 70 + k * 135, u = (x + 100) / 1280, y = 820 + Math.sin(u * 3.5 * Math.PI * 2 + ph) * 150 - 120;
          const at = (b === '1' ? ones : zeros) + (k % 4) * 0.08;
          K.bit(x, y, b, eob(seg(lt, at, at + 0.25)), 92);
        });
        if (lt > carry - 0.2 && lt < ones) bigText('DATA', 540, 470, 120, C.yellow, -0.05, eob(seg(lt, carry - 0.2, carry + 0.1)));
      } });
    cue(st, 'whoosh'); cue(st + ones, 'pop', { gain: 0.6 }); cue(st + zeros, 'pop', { gain: 0.6 });
  }

  // ── 5 · billions of times a second ──────────────────────────────────────
  {
    const st = cut(4), wig = Wd('wiggles', 4) - st, bil = Wd('billions', 4) - st, sec = Wd('second', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 800], zoom: 0.18, note: 'wave speeds up into a blur; 2.4 BILLION / SEC counter on "billions", stopwatch on "second"',
      draw(lt) {
        fillAll(C.bg);
        const f = lerp(2, 16, eio(seg(lt, wig, bil + 0.4)));
        K.sine(-100, 1180, 960, 110, f, -lt * (4 + f * 1.6), K.WAVE, lerp(20, 10, seg(f, 2, 16)));
        if (lt > bil) { const p = eob(seg(lt, bil, bil + 0.3)); K.pill('2,400,000,000', 540, 560, 84, C.yellow, C.ink, p); K.pill('WIGGLES / SECOND', 540, 700, 46, C.ink, C.white, p); }
        if (lt > sec) K.stopwatch(860, 300, 0.42 * eob(seg(lt, sec, sec + 0.25)), lt * 9);
      } });
    cue(st, 'whoosh'); cue(st + wig, 'zip', { gain: 0.5 }); cue(st + bil, 'pop'); cue(st + sec, 'tock');
  }

  // ── 6a · waves reach the phone ──────────────────────────────────────────
  const catches = Wd('catches', 5) - 0.12;
  {
    const st = cut(5);
    add({ id: 'S06', at: st, cam: [540, 760], note: 'hero with phone, waves roll in from the router at the left',
      draw(lt, d, t) {
        K.room();
        rr(60, 700, 220, 20, 6); ctx.fillStyle = C.pot; ctx.fill();
        K.router(170, 660, 0.4, t);
        K.waves(170, 600, lt, { ang: 0.15, spread: 0.55, maxR: 700, a: 1, w: 14 });
        K.man({ x: 640, y: 1200, s: 1.5, arm: K.PHONE_ARM, holding: homePhone, eyes: 'n', mouth: 'smile', look: -0.8 });
      } });
    cue(st, 'whoosh');
  }
  // ── 6b · x-ray: the antenna catches them → data ─────────────────────────
  {
    const dt = Wd('data', 5);
    add({ id: 'S06b', at: catches, cam: [540, 760], zoom: 0.12, note: 'x-ray phone: antenna trace lights as waves hit; binary appears on "data"',
      draw(lt, d, t) {
        K.xray(t);
        K.waves(-60, 520, lt, { ang: 0, spread: 0.45, maxR: 520, col: C.cyan, w: 12, a: 0.9 });
        K.phoneXray(600, 760, 1.2, t);
        const glow = 0.6 + 0.4 * Math.sin(lt * 10);
        ctx.save(); ctx.globalAlpha = glow; line([[600 - 205, 400], [600 - 205, 560], [600 - 120, 560]], C.yellow, 14); ctx.restore();
        K.tag('ANTENNA', 250, 300, 395, 420, 46, eob(seg(lt, 0.15, 0.45)));
        const tt = catches + lt;
        if (tt > dt) { ctx.save(); ctx.globalAlpha = clamp((tt - dt) * 4); ctx.fillStyle = C.cyan; ctx.font = "700 56px 'DejaVu Sans Mono', monospace"; ctx.textAlign = 'center'; ctx.fillText('1011 0100', 600, 1160); ctx.restore(); K.pill('DATA', 600, 1050, 50, C.yellow, C.ink, eob(seg(tt, dt, dt + 0.25))); }
      } });
    cue(catches, 'whoosh'); cue(catches + 0.15, 'pop', { gain: 0.5 }); cue(dt, 'sparkle', { dur: 0.6, gain: 0.5 });
  }

  // ── 7a · two bands ──────────────────────────────────────────────────────
  const point = Wd('point', 6) - 0.35;
  {
    const st = cut(6), bands = Wd('bands', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 800], zoom: 0.1, note: 'router splits into blue + pink waves on "bands"',
      draw(lt, d, t) {
        fillAll(C.bg);
        K.router(540, 1020, 1.3, t);
        const sp = eo(seg(lt, bands, bands + 0.4));
        K.waves(540 - 200 * sp, 760, lt, { ang: -Math.PI / 2 - 0.5 * sp, spread: 0.45, maxR: 560, col: K.WAVE, w: 18 });
        if (sp > 0) K.waves(540 + 200 * sp, 760, lt * 1.8, { ang: -Math.PI / 2 + 0.5 * sp, spread: 0.45, maxR: 400, col: K.WAVE5, w: 12, n: 6, a: sp });
      } });
    cue(st, 'whoosh'); cue(st + bands, 'pop');
  }
  // ── 7b · 2.4 GHz vs 5 GHz ───────────────────────────────────────────────
  {
    const four = Wd('four', 6), five = Wd('five', 6);
    add({ id: 'S07b', at: point, cam: [540, 760], zoom: 0.08, note: 'two panels: slow wide 2.4 GHz wave vs fast tight 5 GHz wave',
      draw(lt) {
        fillAll(C.bg);
        const tt = point + lt, a = eob(seg(tt, four - 0.2, four + 0.15)), b = eob(seg(tt, five - 0.1, five + 0.2));
        if (a > 0) { rr(70, 330, 940, 330, 40); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.save(); rr(70, 330, 940, 330, 40); ctx.clip(); K.sine(70, 1010, 520, 70 * a, 2.5, -lt * 4, K.WAVE, 18); ctx.restore(); K.pill('2.4 GHz', 540, 330, 64, K.WAVE, C.white, a); }
        if (b > 0) { rr(70, 790, 940, 330, 40); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.save(); rr(70, 790, 940, 330, 40); ctx.clip(); K.sine(70, 1010, 980, 70 * b, 6, -lt * 9, K.WAVE5, 14); ctx.restore(); K.pill('5 GHz', 540, 790, 64, K.WAVE5, C.white, b); }
      } });
    cue(point, 'whoosh'); cue(four, 'pop', { gain: 0.55 }); cue(five, 'pop', { gain: 0.55 });
  }

  // ── 8 · 2.4 goes farther through walls ─────────────────────────────────
  {
    const st = cut(7), far = Wd('farther', 7) - st, wl = Wd('walls', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 800], zoom: 0.08, note: 'blue 2.4 waves pass through two brick walls to a phone far right',
      draw(lt, d, t) {
        fillAll(C.bg); ctx.fillStyle = C.floor; ctx.fillRect(-300, 1140, W + 600, 900);
        K.router(130, 1080, 0.42, t);
        K.waves(130, 1010, lt * 0.8, { ang: -0.12, spread: 0.42, maxR: 950, col: K.WAVE, w: 18, n: 5 });
        const wa = eob(seg(lt, wl - 0.25, wl + 0.1));
        if (wa > 0) { K.wall(420, 860, 70, 560 * wa); K.wall(680, 860, 70, 560 * wa); }
        K.phone(930, 860, 0.42, () => K.weatherScreen('✓', 1, t));
        K.pill('2.4 GHz', 540, 420, 56, K.WAVE, C.white, eob(seg(lt, 0.05, 0.35)));
        if (lt > far) K.pill('FARTHER', 930, 1080, 44, C.yellow, C.ink, eob(seg(lt, far, far + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + far, 'pop'); cue(st + wl - 0.1, 'thud', { gain: 0.55 });
  }

  // ── 9 · 5 GHz faster, but blocked ──────────────────────────────────────
  {
    const st = cut(8), fast = Wd('faster', 8) - st, blk = Wd('blocked', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 800], zoom: 0.08, note: 'pink 5 GHz waves zip fast; a wall slams up and stops them on "blocked" (red X)',
      draw(lt, d, t) {
        fillAll(C.bg); ctx.fillStyle = C.floor; ctx.fillRect(-300, 1140, W + 600, 900);
        K.router(130, 1080, 0.42, t);
        const wa = eob(seg(lt, blk - 0.25, blk + 0.05));
        K.waves(130, 1010, lt * 2.2, { ang: -0.12, spread: 0.42, maxR: 950, col: K.WAVE5, w: 12, n: 7, stopAt: wa > 0 ? 470 : Infinity });
        if (lt > fast && lt < blk) K.speedLines(560, 880, 0.6);
        if (wa > 0) K.wall(560, 860, 80, 560 * wa);
        K.phone(930, 860, 0.42, () => (lt > blk ? buffering(t) : K.weatherScreen('✓', 1, t)));
        K.pill('5 GHz', 540, 420, 56, K.WAVE5, C.white, eob(seg(lt, 0.05, 0.35)));
        if (lt > fast) K.pill('FASTER', 300, 600, 44, C.yellow, C.ink, eob(seg(lt, fast, fast + 0.25)));
        if (lt > blk) K.redX(560, 860, lerp(0.7, 0.35, eo(seg(lt, blk, blk + 0.2))), 1);
      } });
    cue(st, 'whoosh'); cue(st + fast, 'zip'); cue(st + blk, 'slam');
  }

  // ── 10a · the weird part ────────────────────────────────────────────────
  const mw = Wd('microwave', 9) - 0.12;
  {
    const st = cut(9), wd = Wd('weird', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 700], note: 'hero leans in, brow up, "weird part"',
      draw(lt) {
        K.room();
        K.man({ x: 540, y: 1220, s: 1.7, arm: K.armPose(K.ARM.down, K.ARM.point, eio(seg(lt, 0, 0.35))), finger: Math.sin(lt * 9) * 0.25, eyes: lt > wd ? 'wide' : 'n', mouth: 'smirk', smirk: true, brow: lt > wd ? 1 : 0.4 });
        if (lt > wd) K.shockLines(540, 625, 300, clamp((lt - wd) * 5));
      } });
    cue(st, 'whoosh'); cue(st + wd, 'boing', { gain: 0.45 });
  }
  // ── 10b · microwave + same 2.4 band ─────────────────────────────────────
  {
    const same = Wd('same', 9), band = Wd('band', 9);
    add({ id: 'S10b', at: mw, cam: [540, 820], zoom: 0.1, note: 'kitchen: microwave turns on; 2.45 GHz tag next to router 2.4 GHz tag on "same"',
      draw(lt, d, t) {
        K.kitchen(1100);
        const tt = mw + lt, on = lt > 0.25 ? 1 : 0;
        K.microwave(400, 940, 1.0, t, on);
        K.router(870, 1050, 0.42, t);
        K.waves(870, 990, lt, { ang: -Math.PI / 2, spread: 0.5, maxR: 260, col: K.WAVE, w: 10 });
        if (tt > same) { const p = eob(seg(tt, same, same + 0.25)); K.pill('2.45 GHz', 400, 690, 54, C.red, C.white, p); K.pill('2.4 GHz', 870, 690, 54, K.WAVE, C.white, eob(seg(tt, same + 0.12, same + 0.37))); }
        if (tt > band) bigText('=', 640, 690, 110, C.yellow, 0, eob(seg(tt, band, band + 0.2)));
      } });
    cue(mw, 'whoosh'); cue(mw + 0.25, 'tock'); cue(mw + 0.3, 'alarm', { dur: 1.2, gain: 0.25 }); cue(same, 'pop'); cue(band, 'pop', { gain: 0.5 });
  }

  // ── 11a · leftovers spinning, noise floods the band ────────────────────
  const slow = Wd('slow', 10) - 0.12;
  {
    const st = cut(10);
    add({ id: 'S11', at: st, cam: [460, 900], zoom: 0.16, note: 'microwave running, red noise rings swamp the blue waves',
      draw(lt, d, t) {
        K.kitchen(1100);
        K.microwave(400, 940, 1.0, t, 1);
        K.noise(340, 920, lt, 330, eo(seg(lt, 0.2, 0.6)));
        K.router(870, 1050, 0.42, t);
        K.waves(870, 990, lt, { ang: -Math.PI * 0.75, spread: 0.4, maxR: 300, col: K.WAVE, w: 10, a: 1 - 0.6 * seg(lt, 0.3, 1) });
      } });
    cue(st, 'whoosh'); cue(st, 'alarm', { dur: slow - st, gain: 0.25 });
  }
  // ── 11b · the phone buffers ─────────────────────────────────────────────
  {
    const wf = Wd('wifi', 10);
    add({ id: 'S11b', at: slow, cam: [540, 720], zoom: 0.12, note: 'phone close-up buffering, Wi-Fi icon drops to one red bar on "Wi-Fi"',
      draw(lt, d, t) {
        fillAll('#DCEEF6');
        K.phone(540, 760, 1.25, () => buffering(t));
        const tt = slow + lt;
        if (tt > wf) K.wifiIcon(850, 300, 0.9 * eob(seg(tt, wf, wf + 0.25)), 1, C.red);
      } });
    cue(slow, 'whoosh'); cue(wf, 'boing', { gain: 0.4 });
  }

  // ── 12 · check the kitchen (loop) ──────────────────────────────────────
  {
    const st = cut(11), lag = Wd('lags', 11) - st, kit = Wd('kitchen', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 760], zoom: 0.06, note: 'hero in kitchen points at the microwave and winks on "kitchen"',
      draw(lt, d, t) {
        K.kitchen(1100);
        K.microwave(230, 900, 0.62, t, 1);
        if (lt > lag) K.noise(200, 890, lt, 190, 0.8);
        K.man({ x: 640, y: 1260, s: 1.45, armL: K.armPose(K.ARM.down, K.ARM.point, eio(seg(lt, kit - 0.4, kit))), arm: K.PHONE_ARM, holding: (x, y) => K.phone(x + 12, y - 70, 0.3, () => buffering(t)),
          eyes: lt > kit ? 'wink' : 'n', mouth: lt > kit ? 'grin' : 'smirk', smirk: true, brow: 0.3, look: -0.6 });
      } });
    cue(st, 'whoosh'); cue(st + kit, 'boing', { gain: 0.45 });
  }

  return { shots: S, cues: CUES };
}
