// HOW DO NOISE CANCELLING HEADPHONES WORK?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const xbg = () => { fillAll(C.xnavy); ctx.strokeStyle = 'rgba(79,209,232,0.10)'; ctx.lineWidth = 3; for (let k = -300; k < W + 300; k += 90) { ctx.beginPath(); ctx.moveTo(k, -300); ctx.lineTo(k, H + 300); ctx.stroke(); } for (let k = -300; k < H + 300; k += 90) { ctx.beginPath(); ctx.moveTo(-300, k); ctx.lineTo(W + 300, k); ctx.stroke(); } };
const sky = (t) => { fillAll(C.sky); for (let i = 0; i < 5; i++) { const cx = ((rnd(i) * 1500 - t * 120) % 1500 + 1500) % 1500 - 200, cy = 250 + i * 230; ell(cx, cy, 120, 40, C.white); ell(cx + 60, cy - 24, 80, 40, C.white); } };
const cabin = () => { fillAll('#E4DCCB'); ctx.fillStyle = '#D8CCB4'; ctx.fillRect(-300, 1180, W + 600, 900); };
const RED = K.NOISE_RED, BLUE = K.ANTI_BLUE, GREEN = K.CALM_GREEN;
// hero close-up with headphones (head centre = y - 560)
const hero = (o, hp = 1, glow = 0) => { K.man({ x: 540, y: 1250, s: 1.6, ...o }); K.headphones(540, 1250 - 350 * 1.6, 1.6, hp, glow); };

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · How do headphones make the noise around you just disappear? ──
  {
    const st = cut(0), hp = Wd('headphones', 0) - st, no = Wd('noise', 0) - st, di = Wd('disappear', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 720], zoom: 0.12, note: 'hero in noisy room (red noise rings); headphones drop on "headphones"; NOISE pill; noise fades + eyes close on "disappear"',
      draw(lt, d, t) {
        K.room();
        const quiet = eio(seg(lt, di - 0.1, di + 0.4));
        const na = 1 - quiet;
        K.noise(200, 560, t, 170, na); K.noise(880, 470, t + 0.3, 170, na); K.noise(860, 1000, t + 0.6, 150, na);
        const on = eio(seg(lt, hp - 0.25, hp + 0.2));
        hero({ eyes: lt > di ? 'closed' : 'n', mouth: lt > di ? 'smile' : 'flat', frown: lt < di, brow: lt > di ? 0.2 : 0 }, on > 0 ? on : 0);
        if (lt > no && lt < di + 0.3) K.pill('NOISE', 540, 230, 80, RED, C.white, E(seg(lt, no, no + 0.25)) * (1 - seg(lt, di, di + 0.3)));
        if (lt > di) K.pill('SILENCE?', 540, 230, 80, C.yellow, C.ink, E(seg(lt, di + 0.1, di + 0.35)));
      } });
    cue(st + 0.05, 'alarm', { dur: 1.2, gain: 0.12 }); cue(st + hp + 0.15, 'thud', { gain: 0.4 }); cue(st + no, 'pop', { gain: 0.4 }); cue(st + di, 'sparkle', { dur: 0.5, gain: 0.3 });
  }
  // ── 2 · Well, sound is waves of air hitting your eardrum ──
  {
    const st = cut(1), wa = Wd('waves', 1) - st, ea = Wd('eardrum', 1) - st;
    add({ id: 'S02', at: st, cam: [560, 760], zoom: 0.12, note: 'ear canal cutaway; ink sound wave travels in to the pink eardrum; SOUND = WAVES pill; drum shakes + EARDRUM tag on "eardrum"',
      draw(lt, d, t) {
        fillAll(C.bg); circle(540, 760, 520, '#E4DCCB');
        K.earCanal(260, 760, 1.35, lt > ea - 0.2 ? 1 : 0.3, t);
        const reach = lerp(-120, 770, eo(seg(lt, 0.1, ea)));
        ctx.save(); ctx.beginPath(); ctx.rect(-300, 0, reach + 300, H); ctx.clip();
        K.sine(-120, 770, 760, 42, 5, -lt * 12, C.ink, 12);
        ctx.restore();
        if (lt > wa) K.pill('SOUND = WAVES', 540, 300, 72, C.yellow, C.ink, E(seg(lt, wa, wa + 0.25)));
        if (lt > ea) K.tag('EARDRUM', 760, 1120, 770, 860, 60, E(seg(lt, ea, ea + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.2, 'slide', { dur: 1.2, gain: 0.2 }); cue(st + wa, 'pop', { gain: 0.4 }); cue(st + ea, 'boing', { gain: 0.3 });
  }
  // ── 3 · so microphones on the outside hear the noise ──
  {
    const st = cut(2), mi = Wd('microphones', 2) - st, ou = Wd('outside', 2) - st, no = Wd('noise', 2) - st;
    const CX = 600, CY = 760, CS = 1.1, mx = CX + K.CUP_PARTS.mic[0] * CS, my = CY + K.CUP_PARTS.mic[1] * CS;
    add({ id: 'S03', at: st, cam: [520, 700], zoom: 0.14, note: 'x-ray ear cup; mic glows on "microphones"; MIC tag on "outside"; red noise wave runs into the mic on "noise"',
      draw(lt, d, t) {
        xbg();
        K.cupXray(CX, CY, CS, { mic: seg(lt, mi - 0.1, mi + 0.2) });
        const reach = lerp(-150, mx - 50, eo(seg(lt, 0, no + 0.2)));
        ctx.save(); ctx.beginPath(); ctx.rect(-300, 0, reach + 300, H); ctx.clip();
        K.sine(-150, mx - 50, my, 40, 3, -lt * 10, RED, 12);
        ctx.restore();
        if (lt > ou) K.tag('MIC', 240, 330, mx - 10, my - 40, 64, E(seg(lt, ou, ou + 0.25)));
        if (lt > no) K.pill('NOISE', 540, 1180, 72, RED, C.white, E(seg(lt, no, no + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + mi, 'sparkle', { dur: 0.3, gain: 0.25 }); cue(st + ou, 'pop', { gain: 0.4 }); cue(st + no, 'pop', { gain: 0.35 });
  }
  // ── 4a · and a chip instantly makes ──
  {
    const st = cut(3), ch = Wd('chip', 3) - st, ins = Wd('instantly', 3) - st;
    const CX = 600, CY = 760, CS = 1.1, cx = CX + K.CUP_PARTS.chip[0] * CS, cy = CY + K.CUP_PARTS.chip[1] * CS;
    add({ id: 'S04', at: st, cam: [cx, cy], zoom: 0.25, note: 'same cup, push in to the chip; chip lights on "chip" (CHIP pill); burst on "instantly"',
      draw(lt, d, t) {
        xbg();
        K.cupXray(CX, CY, CS, { mic: 1, chip: seg(lt, ch - 0.1, ch + 0.2) });
        if (lt > ch) K.pill('CHIP', cx, 330, 80, C.yellow, C.ink, E(seg(lt, ch, ch + 0.25)));
        if (lt > ins) K.burst(cx, cy, 2.2, 1 - seg(lt, ins + 0.3, ins + 0.8));
        if (lt > ins) K.pill('INSTANTLY', cx, 1180, 64, C.white, C.ink, E(seg(lt, ins, ins + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ch, 'pop', { gain: 0.45 }); cue(st + ins, 'sparkle', { dur: 0.4, gain: 0.3 });
  }
  // ── 4b · the exact opposite wave ──
  {
    const st = Wd('exact', 3) - 0.12, op = Wd('opposite', 3) - st;
    add({ id: 'S05', at: st, cam: [540, 760], zoom: 0.1, note: 'two waves: red noise on top, blue copy below; blue flips upside-down on "opposite"; ANTI-NOISE pill',
      draw(lt, d, t) {
        xbg();
        K.pill('NOISE', 540, 330, 64, RED, C.white, 1);
        K.sine(90, 990, 560, 100, 2, 0, RED, 14);
        const flip = Math.cos(Math.PI * eio(seg(lt, op - 0.05, op + 0.35)));
        ctx.save(); ctx.translate(0, 980); ctx.scale(1, flip); K.sine(90, 990, 0, 100, 2, 0, BLUE, 14); ctx.restore();
        if (lt > op) K.pill('ANTI-NOISE', 540, 1180, 64, BLUE, C.white, E(seg(lt, op + 0.1, op + 0.35)));
      } });
    cue(st, 'whoosh'); cue(st + op, 'zip', { gain: 0.3 }); cue(st + op + 0.15, 'pop', { gain: 0.4 });
  }
  // ── 5 · Where the noise pushes up, it pulls down ──
  {
    const st = cut(4), up = Wd('up', 4) - st, dn = Wd('down', 4) - st, ux = 90 + 900 * 0.375;
    add({ id: 'S06', at: st, cam: [ux, 780], zoom: 0.1, note: 'waves stacked closer; up arrow on red crest on "up", down arrow on blue trough on "down"',
      draw(lt, d, t) {
        xbg();
        K.waveSum(90, 990, 780, 110, 2, 0, 140, 0);
        ctx.save(); ctx.globalAlpha = 0.25; ctx.fillStyle = C.yellow; ctx.fillRect(ux - 40, 380, 80, 760); ctx.restore();
        if (lt > up - 0.1) { const a = eo(seg(lt, up - 0.1, up + 0.2)); K.arrow(ux, 400 - (1 - a) * 40, 200, -Math.PI / 2, a); }
        if (lt > dn - 0.1) { const a = eo(seg(lt, dn - 0.1, dn + 0.2)); K.arrow(ux, 1150 + (1 - a) * 40, 160, Math.PI / 2, a); }
        if (lt > up) K.pill('UP', ux + 200, 420, 64, RED, C.white, E(seg(lt, up, up + 0.25)));
        if (lt > dn) K.pill('DOWN', ux + 220, 1140, 64, BLUE, C.white, E(seg(lt, dn, dn + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + up, 'pop', { gain: 0.4 }); cue(st + dn, 'pop', { gain: 0.4 });
  }
  // ── 6 · so the two cancel out, and you hear silence ──
  {
    const st = cut(5), ca = Wd('cancel', 5) - st, si = Wd('silence', 5) - st;
    add({ id: 'S07', at: st, cam: [540, 760], zoom: 0.12, note: 'the two waves slide together on "cancel" and become a flat green line; SILENCE pill; headphones above glow',
      draw(lt, d, t) {
        xbg();
        const m = eio(seg(lt, ca - 0.3, ca + 0.6));
        K.waveSum(90, 990, 820, 110, 2, -lt * 3, 140, m);
        K.headphones(540, 420, 1.0, 1, seg(lt, si - 0.2, si));
        if (lt > si) K.pill('SILENCE', 540, 1120, 80, GREEN, C.white, E(seg(lt, si, si + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ca - 0.2, 'slide', { dur: 0.7, gain: 0.25 }); cue(st + si, 'sparkle', { dur: 0.6, gain: 0.3 });
  }
  // ── 7 · The catch? It's best at steady hums, like engines ──
  {
    const st = cut(6), ca = Wd('catch', 6) - st, hu = Wd('hums', 6) - st, en = Wd('engines', 6) - st;
    add({ id: 'S08', at: st, cam: [540, 700], zoom: 0.12, note: 'jet engine spinning; smooth red hum wave below merges flat on "hums"; CATCH? pill; check on "engines"',
      draw(lt, d, t) {
        sky(t);
        if (lt > ca) K.pill('THE CATCH?', 540, 200, 72, C.yellow, C.ink, E(seg(lt, ca, ca + 0.25)) * (1 - seg(lt, hu - 0.2, hu)));
        K.jetEngine(540, 600, 1.15, t);
        const m = eio(seg(lt, hu, hu + 0.7));
        K.waveSum(140, 940, 1040, 70, 3, -lt * 10, 70, m);
        if (lt > hu) K.pill('STEADY HUM', 540, 200, 72, GREEN, C.white, E(seg(lt, hu, hu + 0.25)));
        if (lt > en) { const a = E(seg(lt, en, en + 0.25)); ctx.save(); ctx.translate(860, 380); ctx.scale(a, a); circle(0, 0, 70, C.ink); circle(0, 0, 60, GREEN); line([[-28, 2], [-8, 24], [30, -22]], C.white, 16); ctx.restore(); }
      } });
    cue(st, 'whoosh'); cue(st + ca, 'pop', { gain: 0.4 }); cue(st + hu, 'slide', { dur: 0.6, gain: 0.2 }); cue(st + en, 'pop', { gain: 0.45 });
  }
  // ── 8a · Sudden sounds like voices change too fast ──
  {
    const st = cut(7), vo = Wd('voices', 7) - st, fa = Wd('fast', 7) - st;
    add({ id: 'S09', at: st, cam: [540, 700], zoom: 0.1, note: 'room: hero with headphones on the right; HEY! bubble on the left on "voices"; jagged red wave jumps toward him; TOO FAST pill',
      draw(lt, d, t) {
        K.room();
        K.man({ x: 700, y: 1250, s: 1.4, eyes: lt > fa ? 'wide' : 'closed', mouth: lt > fa ? 'o' : 'smile', brow: lt > fa ? 0.7 : 0.1, look: -1 });
        K.headphones(700, 1250 - 350 * 1.4, 1.4, 1);
        if (lt > vo - 0.3) K.bubble(250, 240, 1, 'HEY!', E(seg(lt, vo - 0.3, vo)), 1);
        if (lt > vo - 0.2) K.spikyWave(110, 400, 720, 100, 3, lt * 1.8, RED, 12, seg(lt, vo - 0.2, vo + 0.1));
        if (lt > fa) K.pill('TOO FAST', 330, 1000, 64, RED, C.white, E(seg(lt, fa, fa + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + vo - 0.2, 'pop', { gain: 0.45 }); cue(st + fa, 'zip', { gain: 0.3 });
  }
  // ── 8b · so some sneak through ──
  {
    const st = Wd('some', 7) - 0.3, sn = Wd('sneak', 7) - st;
    add({ id: 'S10', at: st, cam: [620, 760], zoom: 0.14, note: 'x-ray cup: the smooth blue anti-wave misses; jagged red wave slips through to the ear side on "sneak"',
      draw(lt, d, t) {
        xbg();
        K.cupXray(560, 760, 1.0, { mic: 1, chip: 1, spk: 1 }, t);
        K.sine(-100, 1180, 1160, 50, 4, -lt * 8, BLUE, 10, 0.8);
        const reach = lerp(0, 1180, eo(seg(lt, 0, sn + 0.5)));
        ctx.save(); ctx.beginPath(); ctx.rect(-300, 0, reach + 300, H); ctx.clip();
        K.spikyWave(-100, 1180, 760, 90, 7, lt * 1.5, RED, 12);
        ctx.restore();
        if (lt > sn) K.pill('SNEAKS IN', 820, 300, 72, RED, C.white, E(seg(lt, sn, sn + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 0.8, gain: 0.25 }); cue(st + sn, 'pop', { gain: 0.45 });
  }
  // ── 9 · The twist? In nineteen seventy-eight, Ahmar Bose was flying ──
  {
    const st = cut(8), tw = Wd('twist', 8) - st, ni = Wd('nineteen', 8) - st, fl = Wd('flying', 8) - st;
    add({ id: 'S11', at: st, cam: [540, 700], zoom: 0.12, note: 'sky; TWIST pill; big 1978 card on "nineteen"; airliner glides in, settles centre by "flying"',
      draw(lt, d, t) {
        sky(t);
        if (lt > tw) K.pill('THE TWIST', 540, 220, 76, C.yellow, C.ink, E(seg(lt, tw, tw + 0.25)));
        if (lt > ni) { const a = E(seg(lt, ni, ni + 0.3)); ctx.save(); ctx.translate(540, 1010); ctx.scale(a, a); rr(-260, -100, 520, 200, 40); ctx.fillStyle = C.ink; ctx.fill(); ctx.fillStyle = C.white; ctx.font = '900 150px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('1978', 0, 8); ctx.restore(); }
        const px = lerp(60, 560, eo(seg(lt, 0, Math.max(fl, 1))));
        ctx.save(); ctx.globalAlpha = 0.6; for (let k = 0; k < 3; k++) line([[px - 280 - k * 40, 570 + k * 30], [px - 460 - k * 40, 570 + k * 30]], C.white, 10); ctx.restore();
        K.airplane(px, 600 + Math.sin(lt * 2) * 10, 1.6, 0, C.white);
      } });
    cue(st, 'whoosh'); cue(st + tw, 'pop', { gain: 0.45 }); cue(st + ni, 'thud', { gain: 0.4 }); cue(st + 0.2, 'slide', { dur: 1.6, gain: 0.2 });
  }
  // ── 10 · and the plane's roar ruined his music ──
  {
    const st = cut(9), ro = Wd('roar', 9) - st, ru = Wd('ruined', 9) - st;
    add({ id: 'S12', at: st, cam: [480, 740], zoom: 0.12, note: 'cabin: window, hero in headphones enjoying notes; red roar rings on "roar"; frown; red X on a note on "ruined"',
      draw(lt, d, t) {
        cabin();
        K.planeWindow(910, 560, 0.7, t);
        const bad = lt > ro;
        K.noise(910, 560, t, 170, seg(lt, ro - 0.1, ro + 0.2));
        K.man({ x: 540, y: 1250, s: 1.6, eyes: bad ? 'n' : 'closed', mouth: bad ? 'flat' : 'smile', frown: bad, brow: bad ? 0 : 0.2 });
        K.headphones(540, 1250 - 560, 1.6, 1);
        for (let k = 0; k < 3; k++) {
          const ph = (lt * 0.5 + k / 3) % 1, nx = 120 + k * 30 + Math.sin(lt * 3 + k) * 20, ny = 620 - ph * 300;
          K.musicNote(nx, ny, 0.8, bad ? '#9AA3B2' : C.yellow, Math.sin(lt * 4 + k) * 0.2);
        }
        if (lt > ru) K.redX(150, 420, 0.55, E(seg(lt, ru, ru + 0.2)));
        if (lt > ro) K.pill('ROAR', 900, 880, 64, RED, C.white, E(seg(lt, ro, ro + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ro, 'alarm', { dur: 1.2, gain: 0.2 }); cue(st + ru, 'slam', { gain: 0.45 });
  }
  // ── 11 · so he worked out the math before landing ──
  {
    const st = cut(10), wo = Wd('worked', 10) - st, la = Wd('landing', 10) - st;
    add({ id: 'S13', at: st, cam: [540, 760], zoom: 0.1, note: 'notepad: red wave + blue flipped wave = flat green line, written in stages; small plane descends; BEFORE LANDING pill',
      draw(lt, d, t) {
        fillAll(C.bg); circle(540, 760, 520, '#E4DCCB');
        K.mathCard(540, 780, 1.0, seg(lt, wo, la + 0.2), t);
        K.airplane(lerp(140, 300, seg(lt, 0, d)), lerp(170, 250, seg(lt, 0, d)), 0.5, 0.2, C.ink);
        if (lt > la) K.pill('BEFORE LANDING', 640, 230, 56, C.yellow, C.ink, E(seg(lt, la, la + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + wo, 'slide', { dur: 1.3, gain: 0.2 }); cue(st + la, 'pop', { gain: 0.45 });
  }
  // ── 12 · and his first headsets were built for pilots ──
  {
    const st = cut(11), fi = Wd('first', 11) - st, pi = Wd('pilots', 11) - st;
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.12, note: 'cockpit: sky through windshield, hero as pilot (cap) in headset with boom mic; FIRST HEADSETS pill; FOR PILOTS on "pilots"',
      draw(lt, d, t) {
        sky(t * 2);
        ctx.fillStyle = C.ink; ctx.fillRect(-300, -300, 260, H + 600); ctx.fillRect(W + 40, -300, 260, H + 600);
        K.man({ x: 540, y: 1300, s: 1.6, mouth: lt > pi ? 'grin' : 'smile', brow: 0.2 });
        K.pilotCap(540, 740, 1.6);
        K.headphones(540, 740, 1.6, 1);
        K.boomMic(540, 740, 1.6);
        ctx.fillStyle = '#2A3142'; ctx.fillRect(-300, 1180, W + 600, 900); ctx.fillStyle = C.ink; ctx.fillRect(-300, 1180, W + 600, 16);
        for (const [x, y] of [[180, 1290], [900, 1290]]) { circle(x, y, 60, C.ink); circle(x, y, 50, C.white); line([[x, y], [x + Math.cos(t * 2 + x) * 38, y + Math.sin(t * 2 + x) * 38]], C.red, 8); }
        if (lt > fi) K.pill('FIRST HEADSETS', 540, 220, 64, C.yellow, C.ink, E(seg(lt, fi, fi + 0.25)) * (1 - seg(lt, pi - 0.15, pi)));
        if (lt > pi) K.pill('FOR PILOTS', 540, 220, 76, C.yellow, C.ink, E(seg(lt, pi, pi + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + fi, 'pop', { gain: 0.4 }); cue(st + pi, 'pop', { gain: 0.5 });
  }
  // ── 13 · So that silence is really sound fighting sound ──
  {
    const st = cut(12), so = Wd('sound', 12) - st, fi = Wd('fighting', 12) - st;
    add({ id: 'S15', at: st, cam: [540, 640], zoom: 0.14, note: 'room: calm hero in headphones; red + blue waves above clash on "fighting" and go flat; he opens eyes, smirks to camera',
      draw(lt, d, t) {
        K.room();
        hero({ eyes: lt > fi + 0.3 ? 'n' : 'closed', mouth: lt > fi + 0.3 ? 'smirk' : 'smile', smirk: lt > fi + 0.3, brow: 0.3 }, 1, seg(lt, fi, fi + 0.3));
        const m = eio(seg(lt, fi - 0.1, fi + 0.6));
        if (lt > so - 0.3) { ctx.save(); ctx.globalAlpha = seg(lt, so - 0.3, so); K.waveSum(140, 940, 320, 60, 2.5, -lt * 8, 70, m); ctx.restore(); }
        if (lt > fi) K.burst(540, 320, 1.6, 1 - seg(lt, fi + 0.2, fi + 0.7));
      } });
    cue(st, 'whoosh'); cue(st + so, 'slide', { dur: 0.5, gain: 0.2 }); cue(st + fi, 'slam', { gain: 0.4 }); cue(st + fi + 0.4, 'sparkle', { dur: 0.6, gain: 0.3 });
  }

  return { shots: S, cues: CUES };
}
