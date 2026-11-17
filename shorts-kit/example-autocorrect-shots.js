// HOW DOES AUTOCORRECT KNOW WHAT YOU MEANT?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const GREEN = '#5BAE6A', BLUE = '#3A7BD5';
const disc = () => { fillAll(C.bg); circle(540, 740, 520, '#E4DCCB'); };
const ring = (x, y, r, p, col = C.yellow) => { if (p <= 0) return; ctx.save(); ctx.lineWidth = 14; ctx.strokeStyle = col; ctx.beginPath(); ctx.arc(x, y, r * p, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); };
const typed = (word, lt, t0, step) => word.slice(0, clamp(Math.floor((lt - t0) / step) + 1, 0, word.length));

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · HOOK: hero types "teh", it flips to "the" ───────────────────
  {
    const st = cut(0), ac = Wd('autocorrect', 0) - st, mn = Wd('meant', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 650], zoom: 0.1, note: 'hero close-up holding phone; TEH typed on a card above; on "meant" it flips to THE with sparkles',
      draw(lt, d, t) {
        K.room();
        const fixed = lt > mn;
        K.man({ x: 540, y: 1300, s: 1.5, arm: K.PHONE_ARM, holding: (x, y) => K.phone(x + 12, y - 70, 0.3, () => K.typeScreen(fixed ? 'the' : typed('teh', lt, 0.1, 0.22))),
          eyes: fixed ? 'wide' : 'n', mouth: fixed ? 'o' : 'smile', brow: fixed ? 1 : 0.3, look: 0.5 });
        const f = eio(seg(lt, mn - 0.2, mn + 0.1));
        const word = f < 0.5 ? 'TEH' : 'THE';
        K.wordCard(540, 330, 1, word, { chars: f < 0.5 ? Math.floor((lt - 0.1) / 0.22) + 1 : 9, squiggle: f < 0.5 && lt > ac ? seg(lt, ac, ac + 0.4) : 0, bg: f >= 0.5 ? C.yellow : C.white, sc: Math.abs(Math.cos(f * Math.PI)) });
        if (fixed) for (let i = 0; i < 3; i++) K.sparkleStar(330 + i * 210, 200 + (i % 2) * 260, 0.9, clamp(1 - (lt - mn) * 0.8));
      } });
    for (let i = 0; i < 3; i++) cue(st + 0.1 + i * 0.22, 'tock', { gain: 0.25 });
    cue(st + ac, 'pop', { gain: 0.3 }); cue(st + mn - 0.2, 'zip', { gain: 0.3 }); cue(st + mn, 'sparkle', { dur: 0.6, gain: 0.3 });
  }

  // ── 2a · every word you type ────────────────────────────────────────
  {
    const st = cut(1), ty = Wd('type', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 760], zoom: 0.1, note: 'big phone; keys T, E, H press one after another and the text appears in the field',
      draw(lt, d, t) {
        disc();
        const k = Math.floor((lt - 0.15) / 0.3), keys = 'TEH', press = {}, hi = {};
        if (k >= 0 && k < 3) { press[keys[k]] = 1; hi[keys[k]] = 'y'; }
        K.phone(540, 760, 1.25, () => K.typeScreen(typed('teh', lt, 0.15, 0.3), { keys: hi, press, cursor: lt }));
        if (lt > ty) K.pill('EVERY WORD', 540, 160, 60, C.ink, C.white, E(seg(lt, ty, ty + 0.25)));
      } });
    cue(st, 'whoosh'); for (let i = 0; i < 3; i++) cue(st + 0.15 + i * 0.3, 'tock', { gain: 0.3 }); cue(st + ty, 'pop', { gain: 0.35 });
  }

  // ── 2b · gets checked against a dictionary ──────────────────────────
  {
    const st = Wd('checked', 1) - 0.2, ch = Wd('checked', 1) - st, dc = Wd('dictionary', 1) - st;
    add({ id: 'S03', at: st, cam: [540, 700], zoom: 0.12, note: 'TEH card drops toward the dictionary book; book thumps up on "dictionary"',
      draw(lt, d, t) {
        disc();
        const b = E(seg(lt, dc - 0.15, dc + 0.15));
        K.dictBook(540, lerp(1500, 860, b), 0.75);
        const u = eio(seg(lt, ch, d));
        K.wordCard(540, lerp(330, 420, u), lerp(0.9, 0.7, u), 'TEH', { rot: Math.sin(lt * 4) * 0.05 });
        if (lt > ch) K.arrow(540, 560, 140 * E(seg(lt, ch, ch + 0.2)), Math.PI / 2, 1);
      } });
    cue(st, 'whoosh'); cue(st + ch, 'slide', { dur: 0.6, gain: 0.25 }); cue(st + dc, 'thud', { gain: 0.45 });
  }

  // ── 3a · and if it's not there ──────────────────────────────────────
  {
    const st = cut(2), nt = Wd('not', 2) - st;
    const words = ['TEA', 'TED', 'TEN', 'THE'];
    add({ id: 'S04', at: st, cam: [540, 720], zoom: 0.1, note: 'dictionary word list; magnifier scans rows; small TEH card gets a red squiggle + NOT FOUND on "not"',
      draw(lt, d, t) {
        disc();
        K.wordList(620, 780, 1, words, -1, 0, 'DICTIONARY');
        const row = clamp(lt / nt) * 3.4;
        K.magnifier(860, 700 + row * 92 - 120, 1.3, -0.6);
        K.wordCard(300, 330, 0.75, 'TEH', { squiggle: seg(lt, nt, nt + 0.4) });
        if (lt > nt) K.pill('NOT FOUND', 540, 1150, 66, C.red, C.white, E(seg(lt, nt, nt + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 0.6, gain: 0.2 }); cue(st + nt, 'boing', { gain: 0.4 });
  }

  // ── 3b · the phone hunts for the closest real word ──────────────────
  {
    const st = Wd('hunts', 2) - 0.3, hu = Wd('hunts', 2) - st, cl = Wd('closest', 2) - st;
    const C3 = [['TEA', 220, 820], ['THE', 540, 900], ['TEN', 860, 820]];
    add({ id: 'S05', at: st, cam: [540, 700], zoom: 0.12, note: 'TEH card on top; three nearby real words branch out on "hunts"; THE turns yellow and grows on "closest"',
      draw(lt, d, t) {
        disc();
        K.wordCard(540, 330, 0.85, 'TEH', { squiggle: 1 });
        C3.forEach(([w, x, y], i) => {
          const p = E(seg(lt, hu + i * 0.12, hu + 0.3 + i * 0.12));
          if (p <= 0) return;
          ctx.save(); ctx.globalAlpha = clamp(p); line([[540, 450], [x, y - 110]], '#B9AE98', 10); ctx.restore();
          const win = w === 'THE' && lt > cl, g = win ? E(seg(lt, cl, cl + 0.25)) : 0;
          K.wordCard(x, y, lerp(0.6, 0.85, g), w, { sc: p, bg: win ? C.yellow : C.white });
        });
        if (lt > cl) K.pill('CLOSEST MATCH', 540, 1130, 60, C.ink, C.white, E(seg(lt, cl + 0.1, cl + 0.35)));
      } });
    cue(st, 'whoosh'); for (let i = 0; i < 3; i++) cue(st + hu + 0.15 + i * 0.12, 'pop', { gain: 0.25 }); cue(st + cl, 'sparkle', { dur: 0.5, gain: 0.3 });
  }

  // ── 4 · it knows which keys sit next to each other ─────────────────
  {
    const st = cut(3), ky = Wd('keys', 3) - st, nx = Wd('next', 3) - st, ot = Wd('other', 3) - st;
    const NB = ['F', 'H', 'T', 'Y', 'V', 'B'];
    add({ id: 'S06', at: st, cam: [540, 720], zoom: 0.12, note: 'big keyboard; G lights yellow on "keys"; its six neighbours get rings on "next"; NEIGHBORS pill on "other"',
      draw(lt, d, t) {
        disc();
        const hi = {};
        if (lt > ky) hi.G = 'y';
        NB.forEach((k, i) => { if (lt > nx + i * 0.06) hi[k] = 'ring'; });
        K.keyboard(540, 760, 1.0, hi, { G: lt > ky && lt < ky + 0.2 ? 1 : 0 });
        const [gx, gy] = K.keyXY(540, 760, 1.0, 'G');
        ring(gx, gy, 190, lt > nx ? E(seg(lt, nx, nx + 0.4)) * (0.9 + 0.1 * Math.sin(lt * 8)) : 0);
        if (lt > ot) K.pill('NEIGHBORS', 540, 380, 66, C.ink, C.white, E(seg(lt, ot, ot + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ky, 'pop', { gain: 0.35 }); for (let i = 0; i < 6; i++) cue(st + nx + i * 0.06, 'tock', { gain: 0.18 }); cue(st + ot, 'pop', { gain: 0.35 });
  }

  // ── 5a · so if your thumb slips onto a neighbor ─────────────────────
  {
    const st = cut(4), th = Wd('thumb', 4) - st, sl = Wd('slips', 4) - st, nb = Wd('neighbor', 4) - st;
    add({ id: 'S07', at: st, cam: [540, 760], zoom: 0.1, note: 'HELL typed on card; thumb aims for O on "thumb" but slips onto P on "slips"; P goes red; card shows HELLP',
      draw(lt, d, t) {
        disc();
        const [ox, oy] = K.keyXY(540, 820, 1.0, 'O'), [px, py] = K.keyXY(540, 820, 1.0, 'P');
        const m = eio(seg(lt, sl, sl + 0.3)), hit = lt > sl + 0.3;
        K.keyboard(540, 820, 1.0, hit ? { P: 'r', O: lt > nb ? 'ring' : undefined } : {}, { P: hit && lt < sl + 0.5 ? 1 : 0 });
        K.tapFinger(lerp(ox, px, m), lerp(oy, py, m), eo(seg(lt, th - 0.4, th)), hit ? 1 : 0);
        K.wordCard(540, 330, 0.95, hit ? 'HELLP' : 'HELL', { bg: C.white, cursor: lt });
      } });
    cue(st, 'whoosh'); cue(st + sl, 'slide', { dur: 0.3, gain: 0.25 }); cue(st + sl + 0.3, 'thud', { gain: 0.4 }); cue(st + nb, 'pop', { gain: 0.3 });
  }

  // ── 5b · it spots the mistake ───────────────────────────────────────
  {
    const st = Wd('it', 4) - 0.1, sp = Wd('spots', 4) - st, mi = Wd('mistake', 4) - st;
    add({ id: 'S08', at: st, cam: [540, 620], zoom: 0.16, note: 'HELLP card big; red squiggle + magnifier on "spots"; flips to yellow HELLO on "mistake"; P→O pill',
      draw(lt, d, t) {
        disc();
        const f = eio(seg(lt, mi - 0.15, mi + 0.15)), ok = f >= 0.5;
        K.wordCard(540, 600, 1.2, ok ? 'HELLO' : 'HELLP', { squiggle: ok ? 0 : seg(lt, sp, sp + 0.35), bg: ok ? C.yellow : C.white, sc: Math.abs(Math.cos(f * Math.PI)) });
        if (lt > sp && !ok) K.magnifier(lerp(1000, 800, eo(seg(lt, sp, sp + 0.3))), 470, 1.4, -0.6);
        if (ok) { K.sparkleStar(230, 420, 1, clamp(1 - (lt - mi))); K.sparkleStar(860, 780, 0.8, clamp(1 - (lt - mi))); }
        if (lt > sp) K.pill('P IS NEXT TO O', 540, 1060, 58, C.ink, C.white, E(seg(lt, sp + 0.15, sp + 0.4)));
      } });
    cue(st, 'whoosh'); cue(st + sp, 'pop', { gain: 0.35 }); cue(st + mi - 0.15, 'zip', { gain: 0.3 }); cue(st + mi, 'sparkle', { dur: 0.6, gain: 0.3 });
  }

  // ── 6 · then it looks at the words around it ────────────────────────
  {
    const st = cut(5), lk = Wd('looks', 5) - st, wd = Wd('words', 5) - st;
    add({ id: 'S09', at: st, cam: [540, 620], zoom: 0.12, note: 'sentence SEE YOU AT THE + typo PARL; magnifier slides along the sentence on "looks"; yellow underline sweeps it on "words"',
      draw(lt, d, t) {
        disc();
        K.wordCard(540, 420, 0.62, 'SEE YOU AT THE');
        K.wordCard(540, 720, 0.95, 'PARL', { squiggle: 1 });
        if (lt > wd) { rr(165, 520, 750 * eo(seg(lt, wd, wd + 0.5)), 20, 10); ctx.fillStyle = C.yellow; ctx.fill(); }
        if (lt > lk - 0.1) K.magnifier(lerp(220, 860, eio(seg(lt, lk, d))), 400, 1.3, -0.6);
      } });
    cue(st, 'whoosh'); cue(st + lk, 'slide', { dur: 1.0, gain: 0.25 }); cue(st + wd, 'pop', { gain: 0.3 });
  }

  // ── 7 · and picks the one that fits the sentence best ───────────────
  {
    const st = cut(6), pk = Wd('picks', 6) - st, bs = Wd('best', 6) - st;
    const B = [['PARK', 82], ['PART', 12], ['PEARL', 6]];
    add({ id: 'S10', at: st, cam: [540, 650], zoom: 0.1, note: 'three odds bars grow from "picks"; PARK wins yellow on "best"; sentence above completes as SEE YOU AT THE PARK',
      draw(lt, d, t) {
        disc();
        const win = lt > bs;
        K.wordCard(540, 300, 0.55, win ? 'SEE YOU AT THE PARK' : 'SEE YOU AT THE ____', { bg: win ? C.yellow : C.white, sc: win ? lerp(1.15, 1, eo(seg(lt, bs, bs + 0.25))) : 1 });
        B.forEach(([w, p], i) => K.oddsBar(560, 620 + i * 170, 1, w, p, eo(seg(lt, pk + i * 0.1, pk + 0.7 + i * 0.1)), win && i === 0));
        if (win) K.sparkleStar(930, 560, 0.8, clamp(1 - (lt - bs)));
      } });
    cue(st, 'whoosh'); cue(st + pk, 'slide', { dur: 0.7, gain: 0.25 }); cue(st + bs, 'sparkle', { dur: 0.5, gain: 0.35 });
  }

  // ── 8 · but here's the twist ────────────────────────────────────────
  {
    const st = cut(7), tw = Wd('twist', 7) - st;
    add({ id: 'S11', at: st, cam: [540, 700], zoom: 0.2, note: 'red bg; hero close-up shocked; warning on "twist"',
      draw(lt, d, t) {
        fillAll(C.red); K.shockLines(540, 760, 520, 0.5);
        K.man({ x: 540, y: 1250, s: 1.6, eyes: 'wide', mouth: 'o', brow: 1, look: 0 });
        if (lt > tw) K.warning(540, 260, E(seg(lt, tw, tw + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + tw, 'slam', { gain: 0.55 }); cue(st, 'alarm', { dur: 0.8, gain: 0.2 });
  }

  // ── 9 · old spell checkers only knew co-operation with a hyphen ─────
  {
    const st = cut(8), od = Wd('old', 8) - st, kn = Wd('knew', 8) - st, hy = Wd('hyphen', 8) - st;
    add({ id: 'S12', at: st, cam: [540, 640], zoom: 0.12, note: 'retro PC; its word list shows CO-OPERATION on "knew"; hyphen turns yellow + ring, WITH A HYPHEN pill on "hyphen"',
      draw(lt, d, t) {
        disc();
        const p = E(seg(lt, 0, 0.3));
        K.retroPC(540, 700, 1.35 * p, () => {
          ctx.fillStyle = C.navy; ctx.fillRect(-200, -150, 400, 300);
          ctx.fillStyle = '#8FA0B5'; ctx.font = '800 26px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('WORD LIST', 0, -110);
          if (lt > kn) {
            ctx.save(); ctx.globalAlpha = clamp((lt - kn) * 4);
            ctx.font = '900 46px Inter'; ctx.textAlign = 'left';
            const a = ctx.measureText('CO').width, b = ctx.measureText('-').width, full = ctx.measureText('CO-OPERATION').width, x0 = -full / 2;
            ctx.fillStyle = C.white; ctx.fillText('CO', x0, 0); ctx.fillText('OPERATION', x0 + a + b, 0);
            ctx.fillStyle = lt > hy ? C.yellow : C.white; ctx.fillText('-', x0 + a, 0);
            if (lt > hy) { ctx.lineWidth = 6; ctx.strokeStyle = C.yellow; ctx.beginPath(); ctx.arc(x0 + a + b / 2, 0, 34 * E(seg(lt, hy, hy + 0.25)), 0, Math.PI * 2); ctx.stroke(); }
            ctx.restore();
          }
        });
        if (lt > od) K.pill('OLD SPELL CHECKER', 540, 190, 56, C.ink, C.white, E(seg(lt, od, od + 0.25)));
        if (lt > hy) K.pill('WITH A HYPHEN', 540, 1170, 60, C.yellow, C.ink, E(seg(lt, hy, hy + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + od, 'pop', { gain: 0.3 }); cue(st + kn, 'pop', { gain: 0.3 }); cue(st + hy, 'pop', { gain: 0.45 });
  }

  // ── 10 · so when people typed it without one ────────────────────────
  {
    const st = cut(9), ty = Wd('typed', 9) - st, on = Wd('one', 9) - st;
    add({ id: 'S13', at: st, cam: [540, 620], zoom: 0.12, note: 'COOPERATION typed letter by letter on "typed"; red squiggle + NOT IN THE LIST on "one"',
      draw(lt, d, t) {
        disc();
        const n = Math.floor(clamp((lt - ty + 0.3) / 0.75) * 11);
        K.wordCard(540, 620, 0.8, 'COOPERATION', { chars: n, cursor: lt, squiggle: seg(lt, on, on + 0.35) });
        if (lt > on) K.pill('NOT IN THE LIST', 540, 1000, 60, C.red, C.white, E(seg(lt, on, on + 0.25)));
      } });
    cue(st, 'whoosh'); for (let i = 0; i < 6; i++) cue(st + ty - 0.3 + i * 0.13, 'tock', { gain: 0.15 }); cue(st + on, 'boing', { gain: 0.4 });
  }

  // ── 11a · the top suggestion was Cupertino ──────────────────────────
  {
    const st = cut(10), sg = Wd('suggestion', 10) - st, cu = Wd('cupertino', 10) - st;
    add({ id: 'S14', at: st, cam: [540, 660], zoom: 0.14, note: 'COOPERATION card top; suggestion list drops on "suggestion"; top row Cupertino highlights yellow on "Cupertino"',
      draw(lt, d, t) {
        disc();
        K.wordCard(540, 300, 0.6, 'COOPERATION', { squiggle: 1 });
        const p = E(seg(lt, sg - 0.1, sg + 0.2));
        K.wordList(540, lerp(560, 740, clamp(p)), p, ['Cupertino', 'co-operation'], 0, E(seg(lt, cu, cu + 0.3)), 'SUGGESTIONS');
        if (lt > cu) K.burst(840, 640, 1.2, clamp(1 - (lt - cu) * 1.5));
      } });
    cue(st, 'whoosh'); cue(st + sg, 'pop', { gain: 0.35 }); cue(st + cu, 'slam', { gain: 0.45 });
  }

  // ── 11b · a city in California ──────────────────────────────────────
  {
    const st = Wd('city', 10) - 0.25, ct = Wd('city', 10) - st, ca = Wd('california', 10) - st;
    add({ id: 'S15', at: st, cam: [540, 600], zoom: 0.12, note: 'sunny sky; green road sign CUPERTINO thumps up on "city"; sun + map pin on "California"',
      draw(lt, d, t) {
        fillAll(C.sky); ctx.fillStyle = '#9CCB7A'; ctx.fillRect(-300, 1180, W + 600, 800);
        if (lt > ca) K.sun(880, 230, E(seg(lt, ca, ca + 0.3)), t);
        K.roadSign(540, lerp(1500, 640, E(seg(lt, ct - 0.1, ct + 0.2))), 1.05, 'CUPERTINO', lt > ca ? 'CALIFORNIA' : '');
        if (lt > ca) K.mapPin(220, 330, 0.8 * E(seg(lt, ca, ca + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ct + 0.1, 'thud', { gain: 0.45 }); cue(st + ca, 'pop', { gain: 0.4 });
  }

  // ── 12a · and it slipped into real ──────────────────────────────────
  {
    const st = cut(11), sl = Wd('slipped', 11) - st, re = Wd('real', 11) - st;
    add({ id: 'S16', at: st, cam: [540, 640], zoom: 0.16, note: 'Cupertino word card slides into an official document on "slipped"; the line highlights yellow on "real"',
      draw(lt, d, t) {
        disc();
        K.officialDoc(540, 720, 1.05, lt > re ? eo(seg(lt, re, re + 0.3)) : 0);
        const u = eio(seg(lt, sl - 0.1, sl + 0.4));
        if (u < 1) K.wordCard(lerp(1000, 640, u), lerp(200, 720 + 28, u), lerp(0.6, 0.3, u), 'Cupertino', { sc: 1 - seg(u, 0.85, 1) });
      } });
    cue(st, 'whoosh'); cue(st + sl - 0.1, 'slide', { dur: 0.5, gain: 0.3 }); cue(st + re, 'pop', { gain: 0.4 });
  }

  // ── 12b · United Nations and EU documents ───────────────────────────
  {
    const st = Wd('united', 11) - 0.1, na = Wd('nations', 11) - st, eu = Wd('eu', 11) - st, dc = Wd('documents', 11) - st;
    add({ id: 'S17', at: st, cam: [540, 680], zoom: 0.1, note: 'two official docs side by side, Cupertino highlighted; UNITED NATIONS pill on "Nations", EU pill on "EU"; third doc slides in on "documents"',
      draw(lt, d, t) {
        disc();
        K.officialDoc(300, 700, 0.75 * E(seg(lt, 0, 0.25)), 1, -0.08, 'Cupertino', BLUE);
        K.officialDoc(780, 700, 0.75 * E(seg(lt, 0.1, 0.35)), 1, 0.08, 'Cupertino', '#2B4C9B');
        if (lt > dc) K.officialDoc(540, lerp(1700, 760, E(seg(lt, dc, dc + 0.3))), 0.8, 1, 0.03, 'Cupertino', '#5B6B8A');
        if (lt > na) K.pill('UNITED NATIONS', 300, 260, 50, C.ink, C.white, E(seg(lt, na, na + 0.25)));
        if (lt > eu) K.pill('EU', 800, 260, 60, C.ink, C.white, E(seg(lt, eu, eu + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + na, 'pop', { gain: 0.35 }); cue(st + eu, 'pop', { gain: 0.35 }); cue(st + dc, 'thud', { gain: 0.4 });
  }

  // ── 13a · so autocorrect isn't reading your mind ────────────────────
  {
    const st = cut(12), rd = Wd('reading', 12) - st, mi = Wd('mind', 12) - st;
    add({ id: 'S18', at: st, cam: [540, 700], zoom: 0.08, note: 'room; hero with thought bubble holding a brain on "reading"; red X slams on "mind"',
      draw(lt, d, t) {
        K.room();
        K.man({ x: 470, y: 1250, s: 0.92, eyes: 'n', mouth: lt > mi ? 'smirk' : 'smile', brow: 0.5, look: 0.6 });
        const p = E(seg(lt, rd - 0.2, rd + 0.1));
        K.thoughtBubble(720, 330, 0.85 * p, 560, 820, () => K.brain(0, 20, 1.0));
        if (lt > mi) K.redX(720, 330, 0.55 * E(seg(lt, mi, mi + 0.2)), 1);
      } });
    cue(st, 'whoosh'); cue(st + rd, 'pop', { gain: 0.35 }); cue(st + mi, 'slam', { gain: 0.45 });
  }

  // ── 13b · it's playing the odds (loop) ──────────────────────────────
  {
    const st = Wd('it', 12) - 0.1, pl = Wd('playing', 12) - st, od = Wd('odds', 12) - st;
    add({ id: 'S19', at: st, cam: [540, 700], zoom: 0.08, note: 'hero; two dice tumble in on "playing"; PLAYING THE ODDS pill on "odds"; finger wag then wink',
      draw(lt, d, t) {
        K.room();
        const wag = lt > od ? Math.sin(lt * 11) * 0.35 : 0;
        K.man({ x: 540, y: 1250, s: 0.92, arm: K.armPose(K.ARM.down, K.ARM.point, eo(seg(lt, od - 0.3, od))), finger: lt > od ? wag : null,
          eyes: lt > od + 0.5 ? 'wink' : 'n', mouth: lt > od + 0.5 ? 'grin' : 'smirk', brow: 0.6, look: 0 });
        const r = eo(seg(lt, pl - 0.1, pl + 0.5));
        if (r > 0) { K.dice(lerp(-100, 300, r), 480 - Math.sin(r * Math.PI) * 160, 1.1, r < 1 ? 1 + Math.floor(lt * 12) % 6 : 5, (1 - r) * 6);
          K.dice(lerp(1180, 780, r), 520 - Math.sin(r * Math.PI) * 180, 1.1, r < 1 ? 1 + Math.floor(lt * 10 + 3) % 6 : 6, -(1 - r) * 6); }
        if (lt > od) K.pill('PLAYING THE ODDS', 540, 700, 56, C.yellow, C.ink, E(seg(lt, od, od + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + pl, 'slide', { dur: 0.5, gain: 0.25 }); cue(st + pl + 0.45, 'thud', { gain: 0.35 }); cue(st + od, 'pop', { gain: 0.4 }); cue(st + od + 0.5, 'boing', { gain: 0.35 });
  }

  return { shots: S, cues: CUES };
}
