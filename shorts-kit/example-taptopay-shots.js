// HOW DOES TAP TO PAY ACTUALLY WORK?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const disc = () => { fillAll(C.bg); circle(540, 740, 520, '#E4DCCB'); };
const counter = () => { fillAll('#E4DCCB'); ctx.fillStyle = '#D8CCB4'; for (let k = -2; k < 9; k++) ctx.fillRect(-300, 120 + k * 260, W + 600, 8); };
const xbg = () => { fillAll(C.xnavy); ctx.strokeStyle = 'rgba(79,209,232,0.10)'; ctx.lineWidth = 3; for (let k = -300; k < W + 300; k += 90) { ctx.beginPath(); ctx.moveTo(k, -300); ctx.lineTo(k, H + 300); ctx.stroke(); } for (let k = -300; k < H + 300; k += 90) { ctx.beginPath(); ctx.moveTo(-300, k); ctx.lineTo(W + 300, k); ctx.stroke(); } };
// wallet screen on the phone: a card + "hold near reader"
const walletScreen = () => () => {
  ctx.fillStyle = '#1F2A44'; ctx.fillRect(-166, -350, 332, 700);
  ctx.fillStyle = C.white; ctx.font = '900 40px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('Wallet', 0, -270);
  K.payCard(0, -90, 0.48, 0, {});
  K.contactless(14, 130, 1.0, C.white, 1);
  ctx.fillStyle = '#BFC6D6'; ctx.font = '800 30px Inter'; ctx.textAlign = 'center'; ctx.fillText('Hold near reader', 0, 240);
};
const TX = 540, TY = 900; // terminal on the counter

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · How does your card pay just by tapping? ───────────────────
  {
    const st = cut(0), ca = Wd('card', 0) - st, ta = Wd('tapping', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 760], zoom: 0.14, note: 'counter: terminal pops in showing $4.50; card swoops in on "card"; taps on "tapping": ripple, screen turns green tick, BEEP! pill',
      draw(lt, d, t) {
        counter();
        const tap = lt > ta + 0.05;
        K.terminal(TX, TY, 1.2 * E(seg(lt, 0, 0.3)), tap ? 'ok' : 'tap', { glow: tap ? 1 - seg(lt, ta, ta + 0.6) : 0 });
        if (lt > ca - 0.1) {
          const u = eio(seg(lt, ca - 0.1, ta + 0.05)), back = eio(seg(lt, ta + 0.25, ta + 0.6));
          const cy = lerp(-200, 960, u) - back * 260, cx = lerp(1250, 600, u) + back * 60;
          K.payCard(cx, cy, 0.8, lerp(0.7, -0.15, u));
        }
        if (tap) K.ripple(TX, 1030, seg(lt, ta, ta + 0.7));
        if (tap) K.pill('BEEP!', 540, 220, 84, C.yellow, C.ink, E(seg(lt, ta, ta + 0.25)));
      } });
    cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + ca - 0.05, 'zip', { gain: 0.3 }); cue(st + ta + 0.05, 'pop', { gain: 0.5 }); cue(st + ta + 0.1, 'sparkle', { dur: 0.4, gain: 0.3 });
  }
  // ── 2a · Well, inside the plastic ─────────────────────────────────
  {
    const st = cut(1), ins = Wd('inside', 1) - st, pl = Wd('plastic', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 740], zoom: 0.12, note: 'big card; x-ray wipes in on "inside" (navy, cyan outline); PLASTIC tag on "plastic"',
      draw(lt, d, t) {
        disc();
        const xr = eio(seg(lt, ins - 0.1, ins + 0.35));
        K.payCard(540, 740, 1.4, 0, { xr, coilP: 0 });
        if (lt > pl) K.tag('PLASTIC', 540, 290, 540, 470, 64, E(seg(lt, pl, pl + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ins, 'sparkle', { dur: 0.4, gain: 0.25 }); cue(st + pl, 'pop', { gain: 0.35 });
  }
  // ── 2b · hides a tiny chip and a coil of wire ─────────────────────
  {
    const st = Wd('hides', 1) - 0.1, ch = Wd('chip', 1) - st, co = Wd('coil', 1) - st, wi = Wd('wire', 1) - st;
    add({ id: 'S03', at: st, cam: [420, 740], zoom: 0.14, note: 'x-ray card; chip glows + CHIP tag on "chip"; copper coil winds around the edge from "coil"; COIL OF WIRE pill on "wire"',
      draw(lt, d, t) {
        xbg();
        const cp = eio(seg(lt, co - 0.15, wi + 0.4));
        K.payCard(540, 740, 1.4, 0, { xr: 1, coilP: cp, chipGlow: lt > ch ? 1 - 0.5 * seg(lt, ch + 0.3, ch + 0.8) : 0 });
        if (lt > ch) K.tag('CHIP', 290, 330, 288, 680, 60, E(seg(lt, ch, ch + 0.25)));
        if (lt > wi) K.pill('COIL OF WIRE', 600, 1110, 64, C.yellow, C.ink, E(seg(lt, wi, wi + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ch, 'pop', { gain: 0.4 }); cue(st + co, 'slide', { dur: 0.9, gain: 0.2 }); cue(st + wi, 'pop', { gain: 0.35 });
  }
  // ── 3 · but no battery at all ─────────────────────────────────────
  {
    const st = cut(2), no = Wd('no', 2) - st, ba = Wd('battery', 2) - st, al = Wd('all', 2) - st;
    add({ id: 'S04', at: st, cam: [540, 740], zoom: 0.1, note: 'battery drops above the x-ray card on "no"; red X slams on "battery"; NO BATTERY pill on "all"',
      draw(lt, d, t) {
        xbg();
        K.payCard(540, 900, 1.0, 0, { xr: 1, coilP: 1 });
        if (lt > no - 0.2) K.chargeBattery(540, lerp(-200, 470, eob(seg(lt, no - 0.2, no + 0.25))), 1.3, 0.15, false, C.red);
        if (lt > ba) K.redX(540, 470, lerp(0.9, 0.55, eo(seg(lt, ba, ba + 0.2))), 1);
        if (lt > al) K.pill('NO BATTERY', 540, 1200, 66, C.yellow, C.ink, E(seg(lt, al, al + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + no + 0.05, 'thud', { gain: 0.35 }); cue(st + ba + 0.05, 'slam', { gain: 0.5 }); cue(st + al, 'pop', { gain: 0.35 });
  }
  // ── 4 · The reader sends out a magnetic field ─────────────────────
  {
    const st = cut(3), re = Wd('reader', 3) - st, se = Wd('sends', 3) - st, fi = Wd('field', 3) - st;
    add({ id: 'S05', at: st, cam: [540, 820], zoom: 0.12, note: 'terminal; READER tag on "reader"; blue field loops grow out of its top from "sends"; MAGNETIC FIELD pill on "field"',
      draw(lt, d, t) {
        disc();
        K.fieldLoops(TX, 780, 820, 300, lt * 0.8, 1, eio(seg(lt, se - 0.15, fi + 0.3)));
        K.terminal(TX, 920, 1.05, 'tap', { glow: 0.5 + 0.3 * Math.sin(lt * 9) });
        if (lt > re && lt < fi) K.tag('READER', 860, 520, 700, 760, 60, E(seg(lt, re, re + 0.25)));
        if (lt > fi) K.pill('MAGNETIC FIELD', 540, 220, 66, C.yellow, C.ink, E(seg(lt, fi, fi + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + re, 'pop', { gain: 0.3 }); cue(st + se - 0.1, 'sparkle', { dur: 0.7, gain: 0.25 }); cue(st + fi, 'pop', { gain: 0.4 });
  }
  // ── 5a · and once your card gets ──────────────────────────────────
  {
    const st = cut(4), ca = Wd('card', 4) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.1, note: 'field loops over the terminal; card glides down from the top from "card"',
      draw(lt, d, t) {
        disc();
        K.fieldLoops(TX, 1000, 820, 300, lt * 0.8, 1, 1);
        K.terminal(TX, 1180, 0.9, 'tap', { glow: 0.4 });
        const u = eio(seg(lt, ca - 0.2, d + 0.3));
        K.payCard(TX, lerp(260, 520, u), 0.75, 0);
        K.arrow(880, lerp(330, 520, u), 160, Math.PI / 2, E(seg(lt, ca - 0.1, ca + 0.2)));
      } });
    cue(st, 'whoosh'); cue(st + ca - 0.1, 'slide', { dur: 0.7, gain: 0.25 });
  }
  // ── 5b · about four centimetres away ──────────────────────────────
  {
    const st = Wd('about', 4) - 0.1, fo = Wd('four', 4) - st, aw = Wd('away', 4) - st;
    add({ id: 'S07', at: st, cam: [540, 780], zoom: 0.14, note: 'card settles just above the terminal; ruler between them; "4 CM" pill on "four"; burst on "away"',
      draw(lt, d, t) {
        disc();
        K.fieldLoops(TX, 980, 820, 300, lt * 0.8, 1, 1);
        K.terminal(TX, 1120, 0.85, 'tap', { glow: 0.4 });
        const cy = lerp(520, 640, eio(seg(lt, 0, 0.6)));
        K.payCard(TX, cy, 0.7, 0);
        if (lt > fo - 0.1) {
          K.gapRuler(900, cy + 140, 880, E(seg(lt, fo - 0.1, fo + 0.2)));
          K.pill('4 CM', 900, (cy + 140 + 880) / 2, 60, C.yellow, C.ink, E(seg(lt, fo, fo + 0.25)));
        }
        if (lt > aw) K.burst(TX, cy, 1.6, 1 - seg(lt, aw, aw + 0.5));
      } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(st + fo, 'pop', { gain: 0.45 }); cue(st + aw, 'sparkle', { dur: 0.3, gain: 0.25 });
  }
  // ── 6a · that field wakes the chip up ─────────────────────────────
  {
    const st = cut(5), fi = Wd('field', 5) - st, wa = Wd('wakes', 5) - st, up = Wd('up', 5) - st;
    add({ id: 'S08', at: st, cam: [540, 740], zoom: 0.14, note: 'x-ray card; blue field loops pass through from "field"; coil turns yellow and chip lights + bolt on "wakes"; AWAKE! pill on "up"',
      draw(lt, d, t) {
        xbg();
        K.fieldLoops(540, 740, 900, 340, lt * 0.8, 0.7, eio(seg(lt, fi - 0.2, fi + 0.3)));
        const g = lt > wa ? 0.7 + 0.3 * Math.sin(lt * 14) : 0;
        K.payCard(540, 740, 1.35, 0, { xr: 1, coilP: 1, glow: g, chipGlow: g });
        if (lt > wa - 0.1) K.bolt(300, 480, 0.9 * E(seg(lt, wa - 0.1, wa + 0.2)), 0.2);
        if (lt > up) K.pill('AWAKE!', 540, 220, 80, C.yellow, C.ink, E(seg(lt, up, up + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + fi - 0.1, 'sparkle', { dur: 0.5, gain: 0.2 }); cue(st + wa, 'sparkle', { dur: 0.5, gain: 0.35 }); cue(st + up, 'pop', { gain: 0.4 });
  }
  // ── 6b · just like a wireless charger ─────────────────────────────
  {
    const st = Wd('just', 5) - 0.1, wi = Wd('wireless', 5) - st, ch = Wd('charger', 5) - st;
    add({ id: 'S09', at: st, cam: [540, 760], zoom: 0.12, note: 'charging pad (left) and card (right) side by side, same field loops on both; "=" between; SAME TRICK pill on "charger"',
      draw(lt, d, t) {
        disc();
        const a = E(seg(lt, wi - 0.2, wi + 0.15));
        if (a > 0) { ctx.save(); ctx.translate(260, 760); ctx.scale(a, a); K.fieldLoops(0, 0, 340, 200, lt * 0.8, 0.8, 1); K.chargePad(0, 0, 0.42, 1); ctx.restore(); }
        K.fieldLoops(820, 760, 340, 200, lt * 0.8, 0.8, 1);
        K.payCard(820, 760, 0.5, 0, { xr: 1, coilP: 1, glow: 1, chipGlow: 1 });
        if (lt > wi) bigText('=', 540, 770, 150, C.yellow, 0, E(seg(lt, wi + 0.1, wi + 0.35)));
        if (lt > ch) K.pill('SAME TRICK', 540, 230, 76, C.yellow, C.ink, E(seg(lt, ch, ch + 0.25)));
      } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(st + wi, 'pop', { gain: 0.35 }); cue(st + ch, 'pop', { gain: 0.45 });
  }
  // ── 7 · The chip then answers by radio, called NFC ────────────────
  {
    const st = cut(6), an = Wd('answers', 6) - st, ra = Wd('radio', 6) - st, nf = Wd('N', 6) - st;
    add({ id: 'S10', at: st, cam: [540, 760], zoom: 0.12, note: 'card above terminal; on "answers" yellow radio waves go from the card down to the terminal (wait spinner); NFC pill on "N"',
      draw(lt, d, t) {
        disc();
        K.terminal(TX, 1000, 0.95, lt > an ? 'wait' : 'tap', { t: lt });
        K.payCard(TX, 440, 0.72, 0);
        if (lt > an) K.waves(TX, 570, lt - an, { ang: Math.PI / 2, spread: 0.7, n: 4, maxR: 150, speed: 1.4, col: C.yellow, w: 20, a: 1 });
        if (lt > ra && lt < nf) K.pill('RADIO', 540, 200, 70, C.ink, C.white, E(seg(lt, ra, ra + 0.25)));
        if (lt > nf) K.pill('NFC', 540, 200, 96, C.yellow, C.ink, E(seg(lt, nf, nf + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + an, 'sparkle', { dur: 0.8, gain: 0.25 }); cue(st + ra, 'pop', { gain: 0.3 }); cue(st + nf, 'pop', { gain: 0.45 });
  }
  // ── 8 · with a one-time code made just for this purchase ──────────
  {
    const st = cut(7), on = Wd('one-time', 7) - st, co = Wd('code', 7) - st, pu = Wd('purchase', 7) - st;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.12, note: 'yellow ONE-TIME code ticket pops out of the card on "one-time", slides down into the terminal on "code"; screen turns to green tick on "purchase"; THIS $4.50 ONLY pill',
      draw(lt, d, t) {
        disc();
        const ok = lt > pu;
        K.terminal(TX, 960, 0.95, ok ? 'ok' : 'wait', { t: lt });
        K.payCard(TX, 420, 0.62, 0);
        if (lt > on - 0.1 && lt < pu + 0.1) {
          const u = eio(seg(lt, co, pu - 0.05));
          K.codeTicket(TX + 80, lerp(560, 780, u), E(seg(lt, on - 0.1, on + 0.2)) * lerp(1, 0.5, u), 'A7F3-91', 'gold', 0.05);
        }
        if (ok) K.pill('THIS $4.50 ONLY', 540, 200, 60, C.yellow, C.ink, E(seg(lt, pu, pu + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + on, 'pop', { gain: 0.4 }); cue(st + co, 'slide', { dur: 0.6, gain: 0.25 }); cue(st + pu, 'sparkle', { dur: 0.4, gain: 0.35 });
  }
  // ── 9 · so a copied code is useless ───────────────────────────────
  {
    const st = cut(8), cp = Wd('copied', 8) - st, us = Wd('useless', 8) - st;
    add({ id: 'S12', at: st, cam: [540, 760], zoom: 0.14, note: 'grey dashed COPY of the code slides toward the terminal on "copied"; screen goes red X + big red X on "useless"',
      draw(lt, d, t) {
        disc();
        const bad = lt > us;
        K.terminal(TX, 900, 1.05, bad ? 'no' : 'amount', { amt: '$80.00' });
        if (lt > cp - 0.2) {
          const u = eio(seg(lt, cp - 0.2, us - 0.05));
          K.codeTicket(lerp(1300, 600, u), lerp(420, 560, u), 0.85, 'A7F3-91', 'ghost', lerp(0.4, 0.08, u));
        }
        if (bad) K.redX(540, 700, lerp(1.1, 0.75, eo(seg(lt, us, us + 0.2))), 1);
        if (bad) K.pill('USELESS', 540, 220, 84, C.red, C.white, E(seg(lt, us, us + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + cp - 0.15, 'slide', { dur: 0.6, gain: 0.25 }); cue(st + us + 0.05, 'slam', { gain: 0.5 });
  }
  // ── 10 · And your phone goes even further ─────────────────────────
  {
    const st = cut(9), ph = Wd('phone', 9) - st, fu = Wd('further', 9) - st;
    add({ id: 'S13', at: st, cam: [540, 740], zoom: 0.12, note: 'phone with the wallet screen rises up on "phone"; EVEN SAFER pill on "further"',
      draw(lt, d, t) {
        disc();
        K.phone(540, lerp(1500, 740, eob(seg(lt, ph - 0.2, ph + 0.3))), 1.15, walletScreen());
        if (lt > fu) K.pill('EVEN SAFER', 540, 220, 76, C.yellow, C.ink, E(seg(lt, fu, fu + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ph - 0.1, 'zip', { gain: 0.3 }); cue(st + fu, 'pop', { gain: 0.4 });
  }
  // ── 11a · It doesn't send your real card number at all ────────────
  {
    const st = cut(10), re = Wd('real', 10) - st, al = Wd('all', 10) - st;
    add({ id: 'S14', at: st, cam: [540, 720], zoom: 0.12, note: 'real card with the full number drops in; REAL NUMBER tag on "real"; red X slams on "all"',
      draw(lt, d, t) {
        disc();
        K.payCard(540, lerp(-200, 700, eob(seg(lt, 0, 0.35))), 1.25, -0.04, { num: '4821 5550 1234', label: 'REAL CARD' });
        if (lt > re) K.tag('REAL NUMBER', 540, 300, 520, 560, 60, E(seg(lt, re, re + 0.25)));
        if (lt > al) K.redX(540, 700, lerp(1.1, 0.8, eo(seg(lt, al, al + 0.2))), 1);
      } });
    cue(st, 'whoosh'); cue(st + 0.3, 'thud', { gain: 0.35 }); cue(st + re, 'pop', { gain: 0.35 }); cue(st + al + 0.05, 'slam', { gain: 0.5 });
  }
  // ── 11b · just a stand-in ─────────────────────────────────────────
  {
    const st = Wd('just', 10) - 0.1, sd = Wd('stand-in', 10) - st;
    add({ id: 'S15', at: st, cam: [540, 720], zoom: 0.14, note: 'the real card slides off left as a green stand-in card slides in from the right on "stand-in"; TOKEN stamp lands',
      draw(lt, d, t) {
        disc();
        const u = eio(seg(lt, 0.05, sd + 0.15));
        ctx.save(); ctx.globalAlpha = 1 - u; K.payCard(lerp(540, -300, u), 700, 1.25, -0.04, { num: '4821 5550 1234', label: 'REAL CARD' }); ctx.restore();
        K.payCard(lerp(1400, 540, u), 700, 1.25, 0.03, { col: K.TOKEN_GREEN, colD: K.TOKEN_GREEN_D, num: '7302 9946 0815', label: 'STAND-IN' });
        if (lt > sd + 0.1) K.tokenBadge(700, 420, lerp(1.8, 1.1, eo(seg(lt, sd + 0.1, sd + 0.3))), 1);
      } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(st + 0.1, 'slide', { dur: 0.5, gain: 0.25 }); cue(st + sd + 0.15, 'thud', { gain: 0.45 });
  }
  // ── 12 · So the shop gets paid without ever seeing your card ──────
  {
    const st = cut(11), sh = Wd('shop', 11) - st, pa = Wd('paid', 11) - st, se = Wd('seeing', 11) - st, ca = Wd('card', 11) - st;
    add({ id: 'S16', at: st, cam: [540, 720], zoom: 0.14, note: 'shop front pops in on "shop"; PAID ✓ green pill + burst on "paid"; window blind rolls down on "seeing"; your blue card slides in bottom right on "card"',
      draw(lt, d, t) {
        disc();
        K.shopFront(540, 720, 1.15 * E(seg(lt, sh - 0.2, sh + 0.15)), { blind: eio(seg(lt, se - 0.1, se + 0.4)) });
        if (lt > pa) K.pill('PAID ✓', 540, 200, 84, K.TOKEN_GREEN, C.white, E(seg(lt, pa, pa + 0.25)));
        if (lt > pa) K.burst(540, 200, 2.4, 1 - seg(lt, pa, pa + 0.5));
        if (lt > ca - 0.1) K.payCard(lerp(1300, 820, eob(seg(lt, ca - 0.1, ca + 0.3))), 1100, 0.5, -0.12);
      } });
    cue(st, 'whoosh'); cue(st + sh - 0.1, 'pop', { gain: 0.35 }); cue(st + pa, 'sparkle', { dur: 0.5, gain: 0.35 }); cue(st + se, 'slide', { dur: 0.45, gain: 0.25 }); cue(st + ca, 'pop', { gain: 0.4 });
  }
  return { shots: S, cues: CUES };
}
