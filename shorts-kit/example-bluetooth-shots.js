// HOW DOES BLUETOOTH ACTUALLY WORK?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T, lineWords } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const GREEN = '#5BAE6A', BT = K.BT_BLUE;
const disc = () => { fillAll(C.bg); circle(540, 740, 520, '#E4DCCB'); };
const exact = (w, i) => lineWords(i).find((x) => x.w.toLowerCase().replace(/[^a-z]/g, '') === w).s;
/** a music player on the phone screen */
const playerScreen = () => {
  ctx.fillStyle = C.navy; ctx.fillRect(-166, -350, 332, 700);
  rr(-120, -260, 240, 240, 24); ctx.fillStyle = C.pink; ctx.fill(); circle(0, -140, 70, C.pinkDark); circle(0, -140, 22, C.pink);
  rr(-120, 30, 240, 14, 7); ctx.fillStyle = '#3A4458'; ctx.fill(); rr(-120, 30, 140, 14, 7); ctx.fillStyle = C.yellow; ctx.fill();
  circle(0, 150, 50, C.white); ctx.beginPath(); ctx.moveTo(-14, 124); ctx.lineTo(-14, 176); ctx.moveTo(14, 124); ctx.lineTo(14, 176); ctx.strokeStyle = C.navy; ctx.lineWidth = 14; ctx.stroke();
};
/** a Bluetooth settings list: 'Earbuds' row, status text, green dot when connected */
const settingsScreen = (status = 'Connected', on = 1, hi = 0) => () => {
  ctx.fillStyle = C.white; ctx.fillRect(-166, -350, 332, 700);
  ctx.fillStyle = BT; ctx.fillRect(-166, -350, 332, 110);
  ctx.fillStyle = C.white; ctx.font = '900 38px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('Devices', -130, -282);
  rr(-140, -200, 280, 120, 22); ctx.fillStyle = hi ? '#FFF4C2' : '#EEF1F5'; ctx.fill();
  K.earbud(-100, -160, 0.3, 0.2);
  ctx.fillStyle = C.ink; ctx.font = '900 34px Inter'; ctx.textAlign = 'left'; ctx.fillText('Earbuds', -50, -162);
  ctx.font = '800 24px Inter'; ctx.fillStyle = on ? GREEN : '#8A93A0'; ctx.fillText(status, -50, -118);
  circle(115, -160, 12, on ? GREEN : '#B9C6CF');
  for (let i = 0; i < 3; i++) { rr(-140, -40 + i * 80, 280, 56, 18); ctx.fillStyle = '#EEF1F5'; ctx.fill(); }
};
const heldPhone = (scr) => (x, y) => K.phone(x + 12, y - 70, 0.3, scr);
/** the hero with an earbud in his right ear */
const heroBud = (o) => { K.man(o); K.earbud(o.x + 108 * o.s, o.y - 336 * o.s, 0.24 * o.s, 0.25); };

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1a · HOOK: earbuds + phone, music flows ─────────────────────────
  {
    const st = cut(0), eb = Wd('earbuds', 0) - st, tk = Wd('talk', 0) - st;
    add({ id: 'S01', at: st, cam: [600, 760], zoom: 0.12, note: 'hero close-up, earbud in ear, phone up; ring pulses at the earbud on "earbuds"; notes float phone → ear from "talk"',
      draw(lt, d, t) {
        K.room();
        heroBud({ x: 500, y: 1330, s: 1.5, arm: K.PHONE_ARM, holding: heldPhone(playerScreen), eyes: 'closed', mouth: 'smile', brow: 0.3 });
        if (lt > eb) { ctx.save(); ctx.globalAlpha = 1 - seg(lt, eb, eb + 0.8); ctx.lineWidth = 10; ctx.strokeStyle = C.yellow; ctx.beginPath(); ctx.arc(662, 826, 60 + 120 * seg(lt, eb, eb + 0.8), 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
        if (lt > tk) for (let k = 0; k < 3; k++) { const u = ((lt - tk) * 0.9 + k / 3) % 1; K.musicNote(lerp(620, 780, u), lerp(1150, 700, u) + Math.sin(u * 9) * 30, 0.7 * Math.sin(u * Math.PI), k % 2 ? C.yellow : C.pink, Math.sin(u * 6) * 0.3); }
      } });
    cue(st + eb, 'pop', { gain: 0.35 }); cue(st + tk, 'sparkle', { dur: 0.8, gain: 0.25 });
  }
  // ── 1b · with no wires? ─────────────────────────────────────────────
  {
    const st = Wd('with', 0) - 0.12, wr = Wd('wires', 0) - st;
    add({ id: 'S02', at: st, cam: [540, 700], zoom: 0.16, note: 'phone + big earbud joined by a cable; red X slams on the cable on "wires"',
      draw(lt, d, t) {
        disc();
        K.phone(300, 700, 0.62, playerScreen);
        K.earbud(800, 560, 1.4, 0.3);
        ctx.save(); ctx.lineCap = 'round'; ctx.lineWidth = 16; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.moveTo(300, 940); ctx.bezierCurveTo(380, 1160, 560, 1080, 520, 930); ctx.bezierCurveTo(480, 780, 700, 860, 830, 840); ctx.stroke(); ctx.restore();
        if (lt > wr) K.redX(560, 940, lerp(1.6, 0.9, eo(seg(lt, wr, wr + 0.2))), 1);
      } });
    cue(st, 'whoosh'); cue(st + wr, 'slam', { gain: 0.5 });
  }

  // ── 2 · Bluetooth: a tiny radio in both ─────────────────────────────
  {
    const st = cut(1), rd = Wd('radio', 1) - st, bo = Wd('both', 1) - st;
    add({ id: 'S03', at: st, cam: [540, 720], zoom: 0.1, note: 'x-ray cutaway: phone (left) and earbud (right); BLUETOOTH pill top; RADIO tag on "radio"; both chips glow yellow on "both"',
      draw(lt, d, t) {
        K.xray(t);
        K.phoneXray(300, 760, 0.85, t);
        const g = lt > bo ? 0.5 + 0.5 * Math.sin(lt * 12) : 0;
        K.earbud(790, 600, 1.9, 0.15, true, g);
        if (g > 0) { ctx.save(); ctx.globalAlpha = 0.35 + 0.4 * g; ctx.lineWidth = 12; ctx.strokeStyle = C.yellow; rr(220, 470, 160, 160, 18); ctx.stroke(); ctx.restore(); }
        K.pill('BLUETOOTH', 540, 260, 70, BT, C.white, E(seg(lt, 0.1, 0.4)));
        if (lt > rd) K.tag('RADIO', 700, 1130, 760, 900, 56, E(seg(lt, rd, rd + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.15, 'pop', { gain: 0.4 }); cue(st + rd, 'pop', { gain: 0.35 }); cue(st + bo, 'sparkle', { dur: 0.6, gain: 0.3 });
  }

  // ── 3 · same 2.4 GHz band as Wi-Fi ──────────────────────────────────
  {
    const st = cut(2), gz = Wd('gigahertz', 2) - st, wf = Wd('band', 2) - st + 0.25;
    add({ id: 'S04', at: st, cam: [540, 720], zoom: 0.1, note: 'phone left sends blue waves to earbud right; 2.4 GHz counter pops on "gigahertz"; router drops in with pink waves on "Wi-Fi"',
      draw(lt, d, t) {
        disc();
        K.phone(250, 820, 0.5, playerScreen);
        K.earbud(850, 740, 1.0, 0.3);
        K.waves(330, 760, t, { ang: 0, spread: 0.45, n: 4, maxR: 440, col: BT, w: 14 });
        if (lt > gz) K.counterBox(540, 400, E(seg(lt, gz, gz + 0.25)) * 0.95, '2.4 GHz', 'RADIO BAND');
        if (lt > wf) { const y = lerp(-200, 1080, eo(seg(lt, wf, wf + 0.35))); K.router(540, y, 0.5, t); K.waves(540, y - 90, t, { ang: -Math.PI / 2, spread: 1.2, n: 3, maxR: 220, col: K.WAVE5, w: 12, a: seg(lt, wf + 0.3, wf + 0.5) }); }
      } });
    cue(st, 'whoosh'); cue(st + gz, 'pop', { gain: 0.45 }); cue(st + wf, 'slide', { dur: 0.4, gain: 0.3 }); cue(st + wf + 0.35, 'thud', { gain: 0.4 });
  }

  // ── 4 · first time: pair + swap a secret key ────────────────────────
  {
    const st = cut(3), pr = Wd('pair', 3) - st, sw = Wd('swap', 3) - st, ky = Wd('key', 3) - st;
    add({ id: 'S05', at: st, cam: [540, 700], zoom: 0.1, note: 'phone left, earbud right; PAIRING pill on "pair"; gold key arcs phone → earbud from "swap"; lands on "key"',
      draw(lt, d, t) {
        disc();
        K.phone(260, 780, 0.6, settingsScreen('Pairing...', 0, lt > pr ? 1 : 0));
        K.earbud(830, 720, 1.25, 0.3);
        if (lt > pr) K.pill('PAIRING', 540, 300, 66, C.yellow, C.ink, E(seg(lt, pr, pr + 0.25)));
        if (lt > sw) { const u = eio(seg(lt, sw, ky + 0.1)); K.route(330, 620, 780, 560, 260, 0, u); const [x, y] = K.arcAt(330, 620, 780, 560, 260, u); K.key(x, y, 0.8, lerp(-0.4, 0.3, u)); }
      } });
    cue(st, 'whoosh'); cue(st + pr, 'pop', { gain: 0.4 }); cue(st + sw, 'slide', { dur: 0.8, gain: 0.3 }); cue(st + ky + 0.1, 'thud', { gain: 0.35 });
  }

  // ── 5 · after that they remember each other ─────────────────────────
  {
    const st = cut(4), rm = Wd('remember', 4) - st, ot = Wd('other', 4) - st;
    add({ id: 'S06', at: st, cam: [540, 720], zoom: 0.12, note: 'chain link joins between phone and earbud on "remember"; phone screen flips to Connected + green check on "other"',
      draw(lt, d, t) {
        disc();
        const on = lt > ot ? 1 : 0;
        K.phone(250, 800, 0.6, settingsScreen(on ? 'Connected' : 'Saved', on, 0));
        K.earbud(840, 720, 1.25, 0.3);
        if (lt > rm - 0.1) K.chainLink(545, 640, 0.85 * E(seg(lt, rm - 0.1, rm + 0.15)), eo(seg(lt, rm, rm + 0.35)));
        if (on) K.check(545, 1060, 0.55, E(seg(lt, ot, ot + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + rm + 0.3, 'thud', { gain: 0.4 }); cue(st + ot, 'sparkle', { dur: 0.5, gain: 0.3 });
  }

  // ── 6 · the band is crowded, even microwaves ────────────────────────
  {
    const st = cut(5), cr = Wd('crowded', 5) - st, mw = Wd('microwaves', 5) - st;
    add({ id: 'S07', at: st, cam: [540, 760], zoom: 0.12, note: 'phone + earbud with blue waves; on "crowded" router + pink waves + noise flood in; microwave hums in with noise on "microwaves"',
      draw(lt, d, t) {
        disc();
        K.phone(230, 520, 0.42, playerScreen);
        K.earbud(860, 450, 0.9, 0.3);
        K.waves(300, 470, t, { ang: 0, spread: 0.35, n: 4, maxR: 480, col: BT, w: 12 });
        if (lt > cr) { const p = E(seg(lt, cr, cr + 0.3)); K.router(290, 1030, 0.5 * p, t); K.waves(290, 950, t * 1.3, { ang: -Math.PI / 2 + 0.6, spread: 1.0, n: 4, maxR: 380, col: K.WAVE5, w: 12, a: clamp(p) }); K.noise(540, 640, t, 170, 0.8 * clamp(p)); }
        if (lt > mw - 0.1) { const p = E(seg(lt, mw - 0.1, mw + 0.2)); K.microwave(790, 1040, 0.6 * p, t, 1); K.noise(770, 820, t * 1.4, 140, 0.9 * clamp(p)); }
      } });
    cue(st, 'whoosh'); cue(st + cr, 'pop', { gain: 0.4 }); cue(st + cr + 0.1, 'bubbles', { dur: 1.2, gain: 0.15 }); cue(st + mw, 'thud', { gain: 0.4 }); cue(st + mw + 0.1, 'alarm', { dur: 0.6, gain: 0.15 });
  }

  // channel strip geometry (shared by the two hopping shots)
  const SX = 540, SY = 760, SWD = 900, N = 79;
  const hopAt = (k, avoid) => { let c = Math.floor(rnd(k * 3.1 + 7) * N); if (avoid) for (let j = 0; avoid(c) > 0.05 && j < 20; j++) c = (c + 11) % N; return c; };
  const busyFn = (t) => (i) => { const a = Math.abs(i - 18) < 9 ? 1 : 0, b = Math.abs(i - 52 - Math.sin(t) * 2) < 7 ? 1 : 0; return Math.max(a, b); };

  // ── 7 · Bluetooth keeps hopping between 79 channels ─────────────────
  {
    const st = cut(6), hp = Wd('hopping', 6) - st, ch = Wd('channels', 6) - st;
    add({ id: 'S08', at: st, cam: [540, 720], zoom: 0.1, note: '79 channel bars; yellow hopper jumps channel to channel from "hopping" (~4/s); 79 CHANNELS pill on "channels"',
      draw(lt, d, t) {
        disc();
        const k = lt > hp ? Math.floor((lt - hp) * 4) : -1, cur = k >= 0 ? hopAt(k) : -1;
        K.channelStrip(SX, SY, SWD, 300, N, cur, () => 0, E(seg(lt, 0, 0.3)), t);
        if (cur >= 0) { const x = clamp(K.channelX(SX, SWD, N, cur), 150, 930), f = ((lt - hp) * 4) % 1; bigText('HOP!', x, 540 - Math.sin(f * Math.PI) * 40, 64, C.yellow, 0, 1); }
        K.pill('2.4 GHz BAND', 540, 380, 54, BT, C.white, E(seg(lt, 0.1, 0.35)));
        if (lt > ch) K.pill('79 CHANNELS', 540, 1080, 66, C.yellow, C.ink, E(seg(lt, ch, ch + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'pop', { gain: 0.3 }); for (let i = 0; i < 8; i++) cue(st + hp + i * 0.25, 'tock', { gain: 0.16 }); cue(st + ch, 'pop', { gain: 0.45 });
  }
  // ── 8 · 1,600 times a second, dodging the noise ─────────────────────
  {
    const st = cut(7), sx = Wd('sixteen', 7) - st, dg = Wd('dodging', 7) - st;
    add({ id: 'S09', at: st, cam: [540, 720], zoom: 0.14, note: 'hops blur fast; counter 1,600 HOPS / SECOND on "sixteen"; from "dodging" busy channels go red with noise and the hopper skips them',
      draw(lt, d, t) {
        disc();
        const busy = lt > dg ? busyFn(t) : () => 0;
        const k = Math.floor(lt * 14), cur = hopAt(k + 100, lt > dg ? busy : null);
        K.channelStrip(SX, SY, SWD, 300, N, cur, busy, 1, t);
        if (lt > dg) { K.noise(K.channelX(SX, SWD, N, 18), 560, t, 110, E(seg(lt, dg, dg + 0.3))); K.noise(K.channelX(SX, SWD, N, 52), 560, t * 1.2, 100, E(seg(lt, dg, dg + 0.3))); }
        if (lt > sx) K.counterBox(540, 360, 0.9 * E(seg(lt, sx, sx + 0.25)), '1,600', 'HOPS / SECOND');
        if (lt > dg) K.pill('DODGES NOISE', 540, 1080, 60, C.yellow, C.ink, E(seg(lt, dg, dg + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'zip', { gain: 0.3 }); cue(st + sx, 'pop', { gain: 0.45 }); cue(st + dg, 'boing', { gain: 0.35 });
  }

  // ── 9a · and the name? ──────────────────────────────────────────────
  {
    const st = cut(8), nm = Wd('name', 8) - st;
    add({ id: 'S10', at: st, cam: [540, 700], zoom: 0.12, note: 'hero puzzled, hand to chin; WHY "BLUE TOOTH"? bubble on "name"',
      draw(lt, d, t) {
        K.room();
        heroBud({ x: 540, y: 1300, s: 1.5, arm: K.ARM.mouth, eyes: 'n', mouth: 'flat', brow: 0.8, look: -0.6 });
        if (lt > nm) K.bubble(540, 300, 1, 'WHY "BLUE TOOTH"?', E(seg(lt, nm, nm + 0.25)), 0, C.white, C.ink, 60);
      } });
    cue(st, 'whoosh'); cue(st + nm, 'pop', { gain: 0.45 });
  }
  // ── 9b · it comes from a Viking king ────────────────────────────────
  {
    const st = Wd('it', 8) - 0.1, vk = Wd('viking', 8) - st;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.12, note: 'viking king rises from below; VIKING KING pill + burst on "Viking"',
      draw(lt, d, t) {
        disc();
        K.vikingKing(540, lerp(1700, 1180, eo(seg(lt, 0, 0.45))), 0.95, { t, mouth: 'smile' });
        if (lt > vk) { K.burst(540, 280, 1.2, 1 - seg(lt, vk, vk + 0.6)); K.pill('VIKING KING', 540, 280, 70, C.yellow, C.ink, E(seg(lt, vk, vk + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'slide', { dur: 0.45, gain: 0.3 }); cue(st + vk, 'pop', { gain: 0.5 });
  }

  // ── 10 · Harald Bluetooth, united Denmark and Norway ────────────────
  {
    const st = cut(9), un = Wd('united', 9) - st, nw = Wd('norway', 9) - st;
    add({ id: 'S12', at: st, cam: [540, 640], zoom: 0.12, note: 'king grins (one blue tooth); HARALD "BLUETOOTH" pill; DK flag left + NO flag right slide in on "united"/"Norway"',
      draw(lt, d, t) {
        disc();
        K.vikingKing(540, 1180, 0.95, { t, mouth: 'grin', wave: 0 });
        K.pill('HARALD "BLUETOOTH"', 540, 230, 62, BT, C.white, E(seg(lt, 0.05, 0.3)));
        if (lt > un) K.nordicFlag(lerp(-200, 210, eo(seg(lt, un, un + 0.4))), 560, 0.7, 'dk', t);
        if (lt > nw - 0.15) K.nordicFlag(lerp(1300, 880, eo(seg(lt, nw - 0.15, nw + 0.25))), 560, 0.7, 'no', t + 1);
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.4 }); cue(st + un, 'slide', { dur: 0.4, gain: 0.3 }); cue(st + nw, 'slide', { dur: 0.4, gain: 0.3 });
  }

  // ── 11 · the logo is his initials, H and B, in runes ────────────────
  {
    const st = cut(10), ini = Wd('initials', 10) - st, hb = exact('h', 10) - st, rn = Wd('runes', 10) - st;
    add({ id: 'S13', at: st, cam: [540, 680], zoom: 0.12, note: 'rune stone; runes carve in from "initials"; yellow H / B labels on "H"; VIKING RUNES pill on "runes"',
      draw(lt, d, t) {
        fillAll(C.bg); rr(-300, 1080, W + 600, 900, 0); ctx.fillStyle = C.floor; ctx.fill();
        K.runeStone(540, 740, 1.05, seg(lt, ini - 0.3, hb - 0.05), E(seg(lt, hb, hb + 0.25)));
        if (lt > rn) K.pill('VIKING RUNES', 540, 260, 66, C.yellow, C.ink, E(seg(lt, rn, rn + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ini - 0.2, 'sizzle', { dur: 0.8, gain: 0.15 }); cue(st + hb, 'pop', { gain: 0.45 }); cue(st + rn, 'pop', { gain: 0.4 });
  }

  // ── 12a · every time you connect ────────────────────────────────────
  {
    const st = cut(11), cn = Wd('connect', 11) - st;
    add({ id: 'S14', at: st, cam: [600, 760], zoom: 0.12, note: 'hero with earbud holds phone; big phone flips to Connected with a tap + ripple on "connect"',
      draw(lt, d, t) {
        K.room();
        const on = lt > cn ? 1 : 0, scr = settingsScreen(on ? 'Connected' : 'Tap to connect', on, 1);
        heroBud({ x: 460, y: 1330, s: 1.5, arm: K.PHONE_ARM, holding: heldPhone(scr), eyes: 'n', mouth: on ? 'smile' : 'flat', brow: 0.3, look: 0.6 });
        K.phone(820, 620, 0.7, scr);
        if (lt > cn - 0.25) { K.tapFinger(790, 530, E(seg(lt, cn - 0.25, cn)), seg(lt, cn - 0.05, cn + 0.1)); K.ripple(790, 520, seg(lt, cn, cn + 0.6)); }
      } });
    cue(st, 'whoosh'); cue(st + cn, 'pop', { gain: 0.45 });
  }
  // ── 12b · a thousand year old king says hi ──────────────────────────
  {
    const st = Wd('thousand', 11) - 0.3, hi = Wd('hi', 11) - st;
    add({ id: 'S15', at: st, cam: [540, 700], zoom: 0.14, note: 'king pops up beside the hero and waves; HI! bubble on "hi"; hero laughs',
      draw(lt, d, t) {
        K.room();
        K.vikingKing(330, lerp(1800, 1250, eo(seg(lt, 0, 0.4))), 0.85, { t, mouth: 'grin', wave: eio(seg(lt, 0.3, 0.6)) });
        heroBud({ x: 790, y: 1360, s: 1.35, arm: K.PHONE_ARM, holding: heldPhone(settingsScreen('Connected', 1, 1)), eyes: lt > hi ? 'closed' : 'wide', mouth: lt > hi ? 'grin' : 'o', brow: 0.8, look: -0.8 });
        if (lt > hi) K.bubble(380, 260, 1, 'HI!', E(seg(lt, hi, hi + 0.25)), -1, C.yellow, C.ink, 90);
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'slide', { dur: 0.4, gain: 0.3 }); cue(st + hi, 'boing', { gain: 0.45 });
  }

  return { shots: S, cues: CUES };
}
