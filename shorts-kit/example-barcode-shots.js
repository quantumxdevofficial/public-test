// HOW DOES A BARCODE ACTUALLY WORK?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const disc = () => { fillAll(C.bg); circle(540, 740, 520, '#E4DCCB'); };
const dark = () => { fillAll('#20232B'); circle(540, 740, 540, '#2A2E38'); };
const txt = (s, x, y, size, col, sc = 1) => { if (sc <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.font = `900 ${size}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineWidth = size * 0.18; ctx.lineJoin = 'round'; ctx.strokeStyle = C.ink; ctx.strokeText(s, 0, 0); ctx.fillStyle = col; ctx.fillText(s, 0, 0); ctx.restore(); };
/** a till monitor with an item line. p 0..1 shows the line */
function till(x, y, s, item, price, p = 1, sc = 1) {
  if (s * sc <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * sc, s * sc);
  rr(-30, 150, 60, 110, 10); ctx.fillStyle = '#2B3245'; ctx.fill(); rr(-120, 250, 240, 30, 12); ctx.fill();
  rr(-260, -170, 520, 340, 30); ctx.fillStyle = '#2B3245'; ctx.fill();
  rr(-230, -140, 460, 280, 18); ctx.fillStyle = '#DCEFF5'; ctx.fill();
  ctx.font = '900 34px Inter'; ctx.fillStyle = C.navy; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.fillText('RECEIPT', -200, -100);
  if (p > 0) { ctx.save(); ctx.globalAlpha = clamp(p); ctx.font = '900 50px Inter'; ctx.fillText(item, -200, 10); ctx.textAlign = 'right'; ctx.fillStyle = '#2F8A4A'; ctx.fillText(price, 200, 10); ctx.restore(); }
  ctx.restore();
}
const ROWS = [['012345678905', 'MILK', '$1.99'], ['036000291452', 'CHIPS', '$2.49'], ['074312009875', 'SOAP', '$3.25']];
const CHECK = (x, y, s, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); circle(x, y, 70 * s, '#5BAE6A'); ctx.strokeStyle = C.white; ctx.lineWidth = 16 * s; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x - 30 * s, y); ctx.lineTo(x - 8 * s, y + 24 * s); ctx.lineTo(x + 32 * s, y - 22 * s); ctx.stroke(); ctx.restore(); };

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · Every time a cashier beeps your snacks, ─────────────────────
  {
    const st = cut(0), ca = Wd('cashier', 0) - st, be = Wd('beeps', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 760], zoom: 0.12, note: 'checkout: bag rides the belt in; scanner gun swings down on "cashier"; beam + BEEP + green tick on "beeps"',
      draw(lt, d, t) {
        K.checkout(t, 1180);
        const bx = lerp(-260, 540, eo(seg(lt, 0, be)));
        K.snackBag(bx, 900, 0.85, -0.05, '#F29A3A', true);
        const gp = eio(seg(lt, ca - 0.3, ca + 0.2));
        K.scanGun(lerp(1300, 760, gp), 330, 0.9, -0.35, lt > be ? 1 : 0, bx, 935, 300);
        if (lt > ca) K.pill('CASHIER', 280, 220, 64, C.white, C.ink, E(seg(lt, ca, ca + 0.25)));
        if (lt > be) { bigText('BEEP!', 300, 470, 120, C.yellow, -0.08, E(seg(lt, be, be + 0.25))); CHECK(820, 640, 0.9, E(seg(lt, be + 0.1, be + 0.35))); }
      } });
    cue(st + 0.1, 'slide', { dur: 0.9, gain: 0.25 }); cue(st + ca - 0.2, 'zip', { gain: 0.3 }); cue(st + be, 'pop', { gain: 0.5 });
  }
  // ── 2 · a few black stripes tell the computer what you bought. ──────
  {
    const st = cut(1), sp = Wd('stripes', 1) - st, co = Wd('computer', 1) - st, bo = Wd('bought', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 720], zoom: 0.12, note: 'big barcode draws in on "stripes"; till monitor pops on "computer"; CHIPS $2.49 line on "bought"',
      draw(lt, d, t) {
        disc();
        K.barcode(540, 470, 620, 280, { reveal: eio(seg(lt, sp - 0.4, sp + 0.4)), digits: lt > sp + 0.4 });
        if (lt > co - 0.1) { K.arrow(540, 760, 90, Math.PI / 2, E(seg(lt, co - 0.1, co + 0.2))); till(540, 1000, 0.75, 'CHIPS', '$2.49', E(seg(lt, bo, bo + 0.25)), E(seg(lt, co - 0.1, co + 0.2))); }
      } });
    cue(st, 'whoosh'); cue(st + sp - 0.3, 'slide', { dur: 0.6, gain: 0.25 }); cue(st + co, 'pop', { gain: 0.35 }); cue(st + bo, 'pop', { gain: 0.45 });
  }
  // ── 3 · So how do lines become a product? ──────────────────────────
  {
    const st = cut(2), li = Wd('lines', 2) - st, pr = Wd('product', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 740], zoom: 0.14, note: 'barcode left, ? arrow, snack bag right pops on "product"',
      draw(lt, d, t) {
        disc();
        K.barcode(290, 700, 300, 200, { digits: false, sc: E(seg(lt, li - 0.3, li)) });
        K.arrow(560, 700, 90, 0, E(seg(lt, li, li + 0.3)));
        K.snackBag(820, 700, 0.62, 0.06, '#F29A3A', false, E(seg(lt, pr, pr + 0.3)));
        if (lt > li + 0.2) K.pill('?', 540, 330, 130, C.yellow, C.ink, E(seg(lt, li + 0.2, li + 0.45)));
      } });
    cue(st, 'whoosh'); cue(st + li - 0.2, 'pop', { gain: 0.35 }); cue(st + pr, 'boing', { gain: 0.35 });
  }
  // ── 4 · The scanner sweeps a red light across the code. ─────────────
  {
    const st = cut(3), sc = Wd('scanner', 3) - st, re = Wd('red', 3) - st, co = Wd('code', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 760], zoom: 0.12, note: 'scanner gun drops in on "scanner"; red beam appears on "red" and sweeps across the barcode to "code"',
      draw(lt, d, t) {
        dark();
        K.barcode(540, 880, 640, 280, {});
        const on = lt > re;
        K.scanGun(540, lerp(-300, 330, eob(seg(lt, sc - 0.35, sc + 0.1))), 0.9, -Math.PI / 2, 0);
        if (on) {
          ctx.save(); ctx.globalAlpha = 0.22; ctx.fillStyle = K.BEAM_RED; ctx.beginPath(); ctx.moveTo(500, 470); ctx.lineTo(580, 470); ctx.lineTo(940, 880); ctx.lineTo(140, 880); ctx.closePath(); ctx.fill(); ctx.restore();
          K.scanBeam(540, 880, 640, 280, seg(lt, re, co + 0.3), E(seg(lt, re, re + 0.15)));
          K.pill('RED LIGHT', 540, 1160, 64, K.BEAM_RED, C.white, E(seg(lt, re, re + 0.25)));
        }
      } });
    cue(st, 'whoosh'); cue(st + sc - 0.3, 'thud', { gain: 0.35 }); cue(st + re, 'slide', { dur: 0.9, gain: 0.25 });
  }
  // ── 5 · White gaps bounce it back, black bars soak it up, ──────────
  {
    const st = cut(4), bo = Wd('bounce', 4) - st, bl = Wd('black', 4) - st, up = Wd('up', 4) - st;
    const BW = 5200, BX = 540 + BW * 0.38;   // zoomed so ~20 modules fill the screen
    add({ id: 'S05', at: st, cam: [540, 720], zoom: 0.1, note: 'macro of bars; red light rains down; over white gaps it bounces back up (yellow) on "bounce"; over black bars it vanishes on "black"',
      draw(lt, d, t) {
        fillAll(C.white);
        const { m } = K.upcModules();
        ctx.fillStyle = C.ink;
        for (let k = 0; k < 95; k++) if (m[k]) ctx.fillRect(K.barcodeX(BX, BW, k), 520, BW / 95 + 1, 700);
        for (let k = 0; k < 95; k++) {
          const x0 = K.barcodeX(BX, BW, k) + BW / 190; if (x0 < 60 || x0 > 1020) continue;
          const ph = (lt * 1.2 + rnd(k) * 0.6) % 1;
          const yIn = lerp(120, 520, eio(clamp(ph * 2)));
          if (ph < 0.5) { line([[x0, yIn - 70], [x0, yIn]], K.BEAM_RED, 10); }
          else if (!m[k] && lt > bo) { const yb = lerp(520, 140, eio((ph - 0.5) * 2)); line([[x0, yb], [x0, yb + 70]], C.yellow, 12); circle(x0, yb, 10, C.yellow); }
          else if (m[k] && lt > bl) { circle(x0, 540, 18 * (1 - (ph - 0.5) * 2), 'rgba(255,59,74,0.5)'); }
        }
        if (lt > bo) K.pill('BOUNCE', 300, 1120, 64, C.yellow, C.ink, E(seg(lt, bo, bo + 0.25)));
        if (lt > bl) K.pill('SOAKED UP', 780, 1120, 64, C.ink, C.white, E(seg(lt, bl, bl + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + bo, 'pop', { gain: 0.35 }); cue(st + bl, 'pop', { gain: 0.35 }); cue(st + up, 'plop', { gain: 0.3 });
  }
  // ── 6 · so the sensor reads on, off, on, off. ─────────────────────
  {
    const st = cut(5), se = Wd('sensor', 5) - st, on = Wd('on', 5) - st, end = Le(5) - st;
    add({ id: 'S06', at: st, cam: [540, 740], zoom: 0.12, note: 'barcode; beam sweeps; yellow on/off wave draws under it in step; ON / OFF labels',
      draw(lt, d, t) {
        dark();
        const u = seg(lt, on - 0.2, end), BW = 2400, BX = 100 + BW / 2, NV = 35;
        const { m } = K.upcModules();
        rr(70, 330, 940, 420, 26); ctx.fillStyle = C.white; ctx.fill();
        ctx.save(); rr(70, 330, 940, 420, 26); ctx.clip(); ctx.fillStyle = C.ink;
        for (let k = 0; k < NV; k++) if (m[k]) ctx.fillRect(K.barcodeX(BX, BW, k), 370, BW / 95 + 1, 340);
        ctx.restore();
        const px = K.barcodeX(BX, BW, u * NV);
        if (lt > se) { ctx.fillStyle = K.BEAM_RED; ctx.fillRect(80, 535, 920, 10); circle(px, 540, 24, 'rgba(255,59,74,0.45)'); circle(px, 540, 12, '#FFE1E4'); }
        rr(70, 850, 940, 300, 30); ctx.fillStyle = '#14161C'; ctx.fill();
        ctx.save(); rr(70, 850, 940, 300, 30); ctx.clip(); K.onOffWave(BX, 1000, BW, 170, u * NV / 95); ctx.restore();
        if (lt > se) K.pill('SENSOR', 540, 220, 70, C.yellow, C.ink, E(seg(lt, se, se + 0.25)));
        if (lt > on) { K.pill('ON', 160, 800, 44, C.yellow, C.ink, E(seg(lt, on, on + 0.2))); K.pill('OFF', 320, 800, 44, C.white, C.ink, E(seg(lt, on + 0.2, on + 0.4))); }
      } });
    cue(st, 'whoosh'); cue(st + se, 'pop', { gain: 0.35 }); cue(st + on - 0.2, 'slide', { dur: 1.4, gain: 0.22 });
  }
  // ── 7 · Those widths spell twelve digits, ─────────────────────────
  {
    const st = cut(6), wi = Wd('widths', 6) - st, tw = Wd('twelve', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 700], zoom: 0.12, note: 'barcode with digits; digit groups light one after another from "widths"; 12 DIGITS on "twelve"',
      draw(lt, d, t) {
        disc();
        const k = Math.floor(seg(lt, wi, d) * 12 * 1.4) % 12;
        K.barcode(540, 640, 780, 380, { hiDigit: lt > wi ? k : -1, hiP: 1 });
        if (lt > tw) txt('12 DIGITS', 540, 230, 130, C.yellow, E(seg(lt, tw, tw + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + wi, 'sparkle', { dur: 0.6, gain: 0.25 }); cue(st + tw, 'thud', { gain: 0.45 });
  }
  // ── 8 · and the last one checks for a bad scan. ───────────────────
  {
    const st = cut(7), la = Wd('last', 7) - st, ch = Wd('checks', 7) - st, ba = Wd('bad', 7) - st;
    add({ id: 'S08', at: st, cam: [740, 700], zoom: 0.16, note: 'last digit ringed red on "last"; CHECK DIGIT tag on "checks"; red X + TRY AGAIN on "bad"',
      draw(lt, d, t) {
        disc();
        K.barcode(540, 560, 780, 380, { hiDigit: 11, hiP: E(seg(lt, la, la + 0.2)), checkP: E(seg(lt, la, la + 0.3)) });
        if (lt > ch) K.tag('CHECK DIGIT', 700, 230, 980, 760, 56, E(seg(lt, ch, ch + 0.25)));
        if (lt > ba) { K.pill('BAD SCAN? TRY AGAIN', 540, 1080, 54, C.red, C.white, E(seg(lt, ba, ba + 0.25))); K.redX(260, 560, 0.7, E(seg(lt, ba, ba + 0.2))); }
      } });
    cue(st, 'whoosh'); cue(st + la, 'pop', { gain: 0.35 }); cue(st + ch, 'pop', { gain: 0.35 }); cue(st + ba, 'slam', { gain: 0.4 });
  }
  // ── 9 · Surprise: the barcode doesn't hold the price. ─────────────
  {
    const st = cut(8), su = Wd('surprise', 8) - st, dn = Wd("doesn't", 8) - st, pr = Wd('price', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 760], zoom: 0.16, note: 'hero shocked on "surprise"; barcode beside him; $ price tag gets red X on "price"',
      draw(lt, d, t) {
        K.room();
        K.man({ x: 300, y: 1250, s: 0.95, arm: K.ARM.down, eyes: lt > su ? 'wide' : 'n', mouth: lt > su ? 'o' : 'smile', brow: lt > su ? 1 : 0.4, look: 0.5 });
        K.barcode(790, 560, 300, 180, { digits: false, sc: E(seg(lt, 0.05, 0.35)) });
        if (lt > dn) K.pill('$2.49', 790, 860, 80, C.white, '#2F8A4A', E(seg(lt, dn, dn + 0.25)));
        if (lt > pr) K.redX(790, 860, 0.75, E(seg(lt, pr, pr + 0.2)));
        if (lt > su) bigText('SURPRISE!', 540, 220, 120, C.yellow, -0.05, E(seg(lt, su, su + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + su, 'boing', { gain: 0.4 }); cue(st + pr, 'slam', { gain: 0.45 });
  }
  // ── 10 · It's just a number the store looks up. ───────────────────
  {
    const st = cut(9), nu = Wd('number', 9) - st, lo = Wd('looks', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 720], zoom: 0.12, note: 'the number pill pops on "number"; database table, CHIPS row lights on "looks"',
      draw(lt, d, t) {
        disc();
        if (lt > nu - 0.1) K.pill(K.UPC, 540, 250, 76, C.yellow, C.ink, E(seg(lt, nu - 0.1, nu + 0.15)));
        K.priceTable(540, 800, 1.2, ROWS, 1, E(seg(lt, lo, lo + 0.25)), E(seg(lt, 0.05, 0.35)));
        if (lt > lo) K.arrow(540, 400, 80, Math.PI / 2, E(seg(lt, lo - 0.1, lo + 0.15)));
      } });
    cue(st, 'whoosh'); cue(st + nu, 'pop', { gain: 0.4 }); cue(st + lo, 'sparkle', { dur: 0.4, gain: 0.3 });
  }
  // ── 11 · The idea began as Morse code drawn in beach sand, ────────
  {
    const st = cut(10), id = Wd('idea', 10) - st, mo = Wd('morse', 10) - st, sa = Wd('sand', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 820], zoom: 0.12, note: 'beach; dots and dashes trace into the sand from "Morse"; a stick draws them; MORSE CODE pill',
      draw(lt, d, t) {
        K.beach(t, 560);
        const dr = seg(lt, mo - 0.2, sa + 0.2);
        K.sandMorse(540, 820, 900, dr, 0);
        const tipX = 540 - 450 + 900 * clamp(dr);
        if (dr < 1) { line([[tipX, 820], [tipX + 120, 580]], '#8B5A2B', 16); }
        if (lt > id) K.pill('THE IDEA', 540, 230, 64, C.white, C.ink, E(seg(lt, id, id + 0.25)));
        if (lt > mo) K.pill('MORSE CODE', 540, 1080, 70, C.yellow, C.ink, E(seg(lt, mo, mo + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + mo - 0.2, 'slide', { dur: 1.0, gain: 0.22 }); cue(st + sa, 'pop', { gain: 0.35 });
  }
  // ── 12 · stretched down into lines. ───────────────────────────────
  {
    const st = cut(11), str = Wd('stretched', 11) - st, li = Wd('lines', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 760], zoom: 0.14, note: 'the dots and dashes pull down into thin and thick bars on "stretched"; LINES!',
      draw(lt, d, t) {
        K.beach(t, 560);
        const p = eio(seg(lt, str - 0.1, li + 0.1));
        K.sandMorse(540, 680, 900, 1, p, 440);
        if (lt > li) { K.pill('LINES!', 540, 230, 90, C.yellow, C.ink, E(seg(lt, li, li + 0.25))); K.burst(860, 420, 0.8, 1 - seg(lt, li, li + 0.4)); }
      } });
    cue(st, 'whoosh'); cue(st + str - 0.1, 'zip', { gain: 0.35 }); cue(st + li, 'pop', { gain: 0.4 });
  }
  // ── 13 · And the first thing ever scanned, in nineteen seventy four? ─
  {
    const st = cut(12), fi = Wd('first', 12) - st, sc = Wd('scanned', 12) - st, ni = Wd('nineteen', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 760], zoom: 0.14, note: 'checkout, empty belt; FIRST SCAN pill on "first"; scanner beams on "scanned"; 1974 slams on "nineteen"',
      draw(lt, d, t) {
        K.checkout(t * 0.3, 1180);
        K.scanGun(760, 560, 0.9, -0.35, lt > sc ? 0.8 : 0, 540, 1150, 300);
        if (lt > fi) K.pill('FIRST SCAN EVER', 400, 300, 64, C.white, C.ink, E(seg(lt, fi, fi + 0.25)));
        if (lt > ni) txt('1974', 380, 760, 220, C.yellow, E(seg(lt, ni, ni + 0.3)));
        if (lt > ni + 0.3) K.pill('?', 720, 900, 100, C.yellow, C.ink, E(seg(lt, ni + 0.3, ni + 0.55)));
      } });
    cue(st, 'whoosh'); cue(st + fi, 'pop', { gain: 0.35 }); cue(st + sc, 'sparkle', { dur: 0.3, gain: 0.25 }); cue(st + ni, 'thud', { gain: 0.5 });
  }
  // ── 14 · A pack of chewing gum. ───────────────────────────────────
  {
    const st = cut(13), pa = Wd('pack', 13) - st, gu = Wd('gum', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.16, note: 'gum pack drops on the belt on "pack"; beep + tick; hero pops in grinning to camera on "gum"',
      draw(lt, d, t) {
        K.checkout(t * 0.3, 1180);
        K.gumPack(680, lerp(-300, 1060, eob(seg(lt, pa - 0.3, pa + 0.1))), 1.25, -0.04);
        K.scanGun(860, 520, 0.85, -0.35, lt > gu ? 0.8 : 0, 850, 1040, 180);
        if (lt > gu) { bigText('GUM!', 300, 320, 170, C.yellow, -0.08, E(seg(lt, gu, gu + 0.25))); CHECK(820, 300, 0.9, E(seg(lt, gu + 0.1, gu + 0.35))); }
        if (lt > gu - 0.2) K.man({ x: 170, y: lerp(1900, 1280, eo(seg(lt, gu - 0.2, gu + 0.2))), s: 0.75, arm: K.ARM.wave, eyes: 'n', mouth: 'grin', brow: 0.6, look: 0 });
      } });
    cue(st, 'whoosh'); cue(st + pa - 0.1, 'thud', { gain: 0.45 }); cue(st + gu, 'pop', { gain: 0.5 }); cue(st + gu + 0.2, 'sparkle', { dur: 0.5, gain: 0.3 });
  }

  return { shots: S, cues: CUES };
}
