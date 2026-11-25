// HOW DOES A SMART SPEAKER KNOW YOU SAID ITS NAME?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const disc = () => { fillAll(C.bg); circle(540, 740, 520, '#E4DCCB'); };
const BLUE = K.RING_BLUE, WAKE = 'HEY, SPEAKER!';
const lastWord = (w, i) => { const hits = T.words.filter((x) => x.line === i && x.w.toLowerCase().replace(/[^a-z]/g, '').startsWith(w)); return hits[hits.length - 1].s; };
const talk = (lt) => (Math.sin(lt * 18) > 0 ? 'o' : 'smile');
// the hero's living room: speaker on a side table on the right
const room = (spk = {}, sx = 790) => { disc(); K.sideTable(sx, 1010, 0.8); K.smartSpeaker(sx, 830, 0.72, spk); };

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · How does a smart speaker know you just said its name? ──
  {
    const st = cut(0), sp = Wd('speaker', 0) - st, sa = Wd('said', 0) - st, na = Wd('name', 0) - st;
    add({ id: 'S01', at: st, cam: [600, 700], zoom: 0.12, note: 'hero talks to speaker on a side table; speaker drops in on "speaker"; HEY, SPEAKER! bubble on "said"; ring lights blue + red ? on "name"',
      draw(lt, d, t) {
        disc(); K.sideTable(790, 1010, 0.8);
        K.smartSpeaker(790, lerp(-300, 830, E(seg(lt, sp - 0.35, sp + 0.1))), 0.72, { ring: lt > na ? E(seg(lt, na, na + 0.2)) : 0, t });
        K.man({ x: 300, y: 820, s: 0.72, arm: K.ARM.down, eyes: 'n', mouth: lt > sa - 0.1 && lt < na + 0.3 ? talk(lt) : 'smile', look: 1, brow: 0.3 });
        if (lt > sa) K.bubble(380, 300, 1, WAKE, E(seg(lt, sa, sa + 0.25)), -1);
        if (lt > na) K.qmark(930, 470, 0.9, 1, Math.sin(lt * 6) * 0.1);
      } });
    cue(st + sp - 0.2, 'thud', { gain: 0.3 }); cue(st + sa, 'pop', { gain: 0.4 }); cue(st + na, 'sparkle', { dur: 0.4, gain: 0.3 });
  }
  // ── 2 · Well, its microphones are always on, ──────────────────
  {
    const st = cut(1), mi = Wd('microphones', 1) - st, on = Wd('on', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 600], zoom: 0.14, note: 'speaker goes x-ray; four mics on top glow on "microphones"; sound waves pour in from both sides; ALWAYS ON pill on "on"',
      draw(lt, d, t) {
        K.xray(t);
        K.waves(60, 420, t, { ang: 0.25, spread: 0.35, n: 4, maxR: 380, a: 0.8 });
        K.waves(1020, 420, t + 0.3, { ang: Math.PI - 0.25, spread: 0.35, n: 4, maxR: 380, a: 0.8 });
        K.smartSpeaker(540, 720, 1.5, { xray: true, mics: lt > mi ? 1 : 0, t });
        if (lt > mi) K.tag('MICROPHONES', 540, 250, 540 + 90 * 1.5, 720 - 150 * 1.5, 54, E(seg(lt, mi, mi + 0.25)));
        if (lt > on) K.pill('ALWAYS ON', 540, 1130, 64, C.yellow, C.ink, E(seg(lt, on, on + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + mi, 'pop', { gain: 0.35 }); cue(st + on, 'pop', { gain: 0.45 });
  }
  // ── 3 · but a tiny chip inside only listens for one word, ─────
  {
    const st = cut(2), ti = Wd('tiny', 2) - st, li = Wd('listens', 2) - st, wo = lastWord('word', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 760], zoom: 0.16, note: 'push into x-ray body: WAKE chip lights yellow on "tiny"; stored pattern card HEY, SPEAKER! pops above on "listens"; 1 WORD ONLY pill on "word"',
      draw(lt, d, t) {
        K.xray(t);
        K.smartSpeaker(540, 980, 2.2, { xray: true, chip: lt > ti ? 1 : 0, t });
        if (lt > ti) { ctx.save(); ctx.globalAlpha = 1 - seg(lt, ti + 0.4, ti + 1.0); ctx.lineWidth = 12; ctx.strokeStyle = C.yellow; rr(540 - 130, 980 - 105, 260, 180, 26); ctx.stroke(); ctx.restore(); }
        if (lt > li) { K.wakeCard(540, 340, 0.85, WAKE, 1, 0, E(seg(lt, li, li + 0.25))); line([[540, 440], [540, 870]], 'rgba(255,212,59,0.6)', 8); }
        if (lt > wo) K.pill('1 WORD ONLY', 540, 1150, 62, C.yellow, C.ink, E(seg(lt, wo, wo + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ti, 'pop', { gain: 0.35 }); cue(st + li, 'pop', { gain: 0.4 }); cue(st + wo, 'thud', { gain: 0.3 });
  }
  // ── 4 · and everything else gets thrown away. ─────────────────
  {
    const st = cut(3), ev = Wd('everything', 3) - st, aw = Wd('away', 3) - st;
    const words = ['PIZZA?', 'SO TIRED', 'LOL'];
    const CHX = 450, CHY = 800, TX = 880, TY = 1000;
    add({ id: 'S04', at: st, cam: [600, 760], zoom: 0.1, note: 'chat bubbles fly into the chip, get a red no-match and drop into a trash can; NOT SAVED pill on "away"',
      draw(lt, d, t) {
        K.xray(t);
        K.wakeCard(540, 250, 0.62, WAKE, 1, 0);
        K.smartSpeaker(CHX, 830, 1.75, { xray: true, chip: 1, t });
        K.trashCan(TX, TY, 0.75, lt > ev ? 0.6 : 0, 0);
        words.forEach((w, k) => {
          const t0 = 0.05 + k * 0.45, u = (lt - t0) / 0.4, v = (lt - t0 - 0.55) / 0.4;
          if (u <= 0 || v > 1) return;
          if (u < 1) K.bubble(lerp(-180, CHX, eio(u)), lerp(560 + k * 40, CHY, eio(u)), 0.8, w, 1, 0);
          else if (v < 0) { K.bubble(CHX, CHY, 0.8, w, 1, 0, C.white); K.redX(CHX + 170, CHY - 70, 0.45, 1); }
          else K.bubble(lerp(CHX, TX, eio(v)), lerp(CHY, TY - 120, eio(v)) - Math.sin(v * Math.PI) * 160, lerp(0.8, 0.3, v), w, 1, 0);
        });
        if (lt > aw) K.pill('NOT SAVED', 540, 1150, 64, C.white, C.ink, E(seg(lt, aw, aw + 0.25)));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 3; k++) { cue(st + 0.05 + k * 0.45 + 0.4, 'pop', { gain: 0.25 }); cue(st + 0.05 + k * 0.45 + 0.95, 'thud', { gain: 0.2 }); } cue(st + aw, 'pop', { gain: 0.4 });
  }
  // ── 5a · The moment it hears its name, ────────────────────────
  {
    const st = cut(4), mo = Wd('moment', 4) - st, na = Wd('name', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 600], zoom: 0.14, note: 'HEY, SPEAKER! bubble flies into the chip; pattern card turns green + check on "name"',
      draw(lt, d, t) {
        K.xray(t);
        const m = lt > na ? 1 : 0;
        K.wakeCard(540, 330, 0.8, WAKE, 1, m);
        K.smartSpeaker(540, 900, 1.45, { xray: true, chip: 1, t });
        const u = seg(lt, mo - 0.1, na - 0.05);
        if (u < 1) K.bubble(lerp(-200, 540, eio(u)), lerp(560, 860, eio(u)), 0.8, WAKE, 1, 0);
        if (m) { K.check(800, 290, 0.8, E(seg(lt, na, na + 0.25))); K.burst(540, 860, 1, 1 - seg(lt, na, na + 0.6)); }
      } });
    cue(st, 'whoosh'); cue(st + mo, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + na, 'sparkle', { dur: 0.5, gain: 0.35 });
  }
  // ── 5b · the light turns blue, ────────────────────────────────
  {
    const st = lastWord('the', 4) - 0.08, bl = Wd('blue', 4) - st;
    add({ id: 'S05b', at: st, cam: [540, 560], zoom: 0.2, note: 'big real speaker; light ring flashes on and sweeps blue on "blue"; LISTENING pill',
      draw(lt, d, t) {
        disc();
        const on = E(seg(lt, bl - 0.15, bl + 0.15));
        K.smartSpeaker(540, 760, 1.7, { ring: on, t });
        if (lt > bl) { K.shockLines(540, 500, 330, 1 - seg(lt, bl, bl + 0.6)); K.pill('LISTENING', 540, 1150, 64, BLUE, C.white, E(seg(lt, bl, bl + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + bl, 'pop', { gain: 0.45 });
  }
  // ── 6 · and your voice starts streaming to the cloud, ─────────
  {
    const st = cut(5), vo = Wd('voice', 5) - st, sr = Wd('streaming', 5) - st, cl = Wd('cloud', 5) - st;
    const A = [300, 760], B = [760, 420];
    add({ id: 'S06', at: st, cam: [540, 650], zoom: 0.1, note: 'speaker bottom-left with blue ring; voice bars stream along a dotted arc up to a cloud that pops on "cloud"',
      draw(lt, d, t) {
        disc();
        K.sideTable(300, 1070, 0.7);
        K.smartSpeaker(300, 910, 0.7, { ring: 1, t });
        if (lt > cl) K.cloud(B[0], B[1], 0.62, C.white, E(seg(lt, cl, cl + 0.25)));
        if (lt > vo) {
          K.route(A[0], A[1], B[0], B[1] + 60, 200, 0, E(seg(lt, vo, vo + 0.4)), 0.5);
          if (lt > sr) for (let k = 0; k < 5; k++) {
            const u = ((lt - sr) * 0.9 + k / 5) % 1;
            const [px, py] = K.arcAt(A[0], A[1], B[0], B[1] + 60, 200, u);
            rr(px - 46, py - 30, 92, 60, 18); ctx.fillStyle = BLUE; ctx.fill(); K.waveBars(px - 36, py, 72, 40, k + 2, C.white, 1, 6);
          }
        }
      } });
    cue(st, 'whoosh'); cue(st + sr, 'slide', { dur: 1.0, gain: 0.3 }); cue(st + cl, 'pop', { gain: 0.4 });
  }
  // ── 7 · where big servers double check the word ───────────────
  {
    const st = cut(6), se = Wd('servers', 6) - st, ch = Wd('check', 6) - st, wo = Wd('word', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 650], zoom: 0.12, note: 'inside the cloud: three servers rise on "servers"; scan line sweeps the HEY, SPEAKER! card from "check"; it goes green + check on "word"',
      draw(lt, d, t) {
        fillAll(C.sky);
        K.cloud(540, 700, 1.75, C.white);
        for (let k = 0; k < 3; k++) { const p = E(seg(lt, se - 0.2 + k * 0.1, se + 0.2 + k * 0.1)); if (p > 0) K.server(300 + k * 240, lerp(1300, 860, p), 0.42, t + k); }
        const m = lt > wo ? 1 : 0;
        K.wakeCard(540, 400, 0.78, WAKE, 1, m);
        if (lt > ch && !m) { const u = (lt - ch) / Math.max(0.3, wo - ch); line([[540 - 190, 320 + u * 160], [540 + 190, 320 + u * 160]], C.yellow, 10); }
        if (m) K.check(790, 330, 0.75, E(seg(lt, wo, wo + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + se, 'thud', { gain: 0.3 }); cue(st + ch, 'slide', { dur: 0.4, gain: 0.2 }); cue(st + wo, 'pop', { gain: 0.45 });
  }
  // ── 8 · and work out your answer. ─────────────────────────────
  {
    const st = cut(7), wk = Wd('work', 7) - st, an = Wd('answer', 7) - st;
    const A = [600, 360], B = [300, 700];
    add({ id: 'S08', at: st, cam: [540, 650], zoom: 0.1, note: 'cloud at top thinking (spinner) from "work"; answer bubble IT\'S SUNNY! drops along an arc to the speaker on "answer"; hero grins',
      draw(lt, d, t) {
        disc();
        K.cloud(A[0], A[1] - 60, 0.5, C.white);
        if (lt > wk && lt < an) K.spinner(A[0] - 20, A[1] - 70, 0.6, t);
        K.sideTable(300, 1070, 0.7);
        K.smartSpeaker(300, 910, 0.7, { ring: 1, t });
        K.man({ x: 790, y: 860, s: 0.66, arm: K.ARM.down, eyes: 'n', mouth: lt > an + 0.3 ? 'grin' : 'smile', look: -1, brow: lt > an ? 0.6 : 0.2 });
        if (lt > an - 0.25) {
          const u = E(seg(lt, an - 0.25, an + 0.2));
          const [px, py] = K.arcAt(A[0], A[1], B[0], B[1] - 120, 150, Math.min(1, u));
          K.bubble(px, py, 0.85, 'IT\'S SUNNY!', 1, lt > an + 0.2 ? 1 : 0, C.yellow);
          if (lt > an + 0.2) K.waves(390, 820, t, { ang: 0, spread: 0.4, n: 3, maxR: 200, a: 0.7 });
        }
      } });
    cue(st, 'whoosh'); cue(st + an - 0.2, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + an + 0.2, 'pop', { gain: 0.45 });
  }
  // ── 9 · But it still gets fooled. ─────────────────────────────
  {
    const st = cut(8), fo = Wd('fooled', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 650], zoom: 0.14, note: 'TV shows a character talking, sound waves hit the speaker; ring wrongly turns blue + FOOLED! red pill on "fooled"',
      draw(lt, d, t) {
        disc();
        K.tvSet(540, 420, 0.85, () => {
          fillAll('#6BA8D6'); ctx.fillStyle = '#4F8A5A'; ctx.fillRect(-300, 90, 600, 100);
          K.man({ x: 0, y: 190, s: 0.42, arm: K.ARM.wave, eyes: 'n', mouth: talk(lt), brow: 0.4 });
        });
        K.waves(540, 640, t, { ang: Math.PI / 2, spread: 0.4, n: 3, maxR: 230, a: 0.8 });
        K.sideTable(540, 1110, 0.7);
        K.smartSpeaker(540, 950, 0.7, { ring: lt > fo - 0.2 ? 1 : 0, t });
        if (lt > fo) { K.pill('FOOLED!', 830, 900, 60, C.red, C.white, E(seg(lt, fo, fo + 0.25))); K.qmark(260, 880, 0.6, 1, -0.15); }
      } });
    cue(st, 'whoosh'); cue(st + fo, 'boing', { gain: 0.4 });
  }
  // ── 10 · In one study, TV shows woke smart speakers ───────────
  {
    const st = cut(9), sd = Wd('study', 9) - st, tv = Wd('tv', 9) - st, wo = Wd('woke', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 650], zoom: 0.1, note: 'STUDY card on "study"; TV slides in on "TV"; five speakers in a row light blue one by one from "woke"',
      draw(lt, d, t) {
        disc();
        K.studyCard(250, 430, 0.62, -0.08, E(seg(lt, sd, sd + 0.25)));
        if (lt > tv - 0.2) K.tvSet(lerp(1400, 700, E(seg(lt, tv - 0.2, tv + 0.2))), 420, 0.55, () => { fillAll('#6BA8D6'); K.man({ x: 0, y: 190, s: 0.42, arm: K.ARM.down, eyes: 'n', mouth: talk(lt), brow: 0.3 }); });
        for (let k = 0; k < 5; k++) K.smartSpeaker(140 + k * 200, 960, 0.42, { ring: lt > wo + k * 0.22 ? 1 : 0, t: t + k });
        if (lt > tv) K.waves(700, 600, t, { ang: Math.PI / 2, spread: 0.9, n: 3, maxR: 220, a: 0.6 });
      } });
    cue(st, 'whoosh'); cue(st + sd, 'pop', { gain: 0.35 }); cue(st + tv - 0.2, 'slide', { dur: 0.4, gain: 0.25 });
    for (let k = 0; k < 5; k++) cue(st + wo + k * 0.22, 'pop', { gain: 0.18 });
  }
  // ── 11 · up to nineteen times a day. ──────────────────────────
  {
    const st = cut(10), ni = Wd('nineteen', 10) - st, da = Wd('day', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 620], zoom: 0.16, note: 'counter races 0 → 19 landing on "nineteen"; label TIMES A DAY; speaker below blinks blue each count; UP TO pill',
      draw(lt, d, t) {
        disc();
        const n = Math.round(19 * eo(seg(lt, 0, ni + 0.05)));
        K.counterBox(540, 470, 1.5, n, 'TIMES A DAY');
        K.smartSpeaker(540, 930, 0.62, { ring: n % 2 || lt > ni ? 1 : 0.15, t });
        if (lt > ni) K.pill('UP TO', 540, 210, 58, C.red, C.white, E(seg(lt, ni, ni + 0.25)));
        if (lt > da) K.burst(540, 470, 1.3, 1 - seg(lt, da, da + 0.5));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 6; k++) cue(st + k * ni / 6, 'tock', { gain: 0.2 }); cue(st + ni, 'slam', { gain: 0.35 });
  }
  // ── 12 · Want it truly deaf? Press mute, ──────────────────────
  {
    const st = cut(11), de = Wd('deaf', 11) - st, pr = Wd('press', 11) - st, mu = Wd('mute', 11) - st;
    add({ id: 'S12', at: st, cam: [600, 680], zoom: 0.14, note: 'top-down speaker close-up, ring blue; finger comes in from "press" and pushes the mic-slash button on "mute"; ring turns red',
      draw(lt, d, t) {
        disc();
        const red = lt > mu;
        K.speakerTop(540, 700, 0.95, { ring: 1, ringCol: red ? C.red : BLUE, press: red ? 1 - seg(lt, mu + 0.15, mu + 0.4) : 0, t });
        K.tapFinger(540 + 114, 700, E(seg(lt, pr - 0.2, mu)), red ? 1 - seg(lt, mu + 0.15, mu + 0.4) : 0);
        if (red) K.ripple(654, 700, seg(lt, mu, mu + 0.5));
        if (lt > de && lt < mu) K.pill('DEAF?', 540, 220, 64, C.white, C.ink, E(seg(lt, de, de + 0.25)));
        if (red) K.pill('MUTED', 540, 220, 64, C.red, C.white, E(seg(lt, mu, mu + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + de, 'pop', { gain: 0.3 }); cue(st + mu, 'thud', { gain: 0.45 });
  }
  // ── 13 · which cuts power to the microphones. ─────────────────
  {
    const st = cut(12), cu = Wd('cuts', 12) - st, mi = Wd('microphones', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 600], zoom: 0.14, note: 'x-ray speaker with red ring; mic wires break with a red X on "cuts"; NO POWER pill on "microphones"',
      draw(lt, d, t) {
        K.xray(t);
        const c = lt > cu ? 1 : 0;
        K.smartSpeaker(540, 740, 1.5, { xray: true, ring: 1, ringCol: C.red, cut: c, mics: c ? 0 : 1, t });
        if (c) K.redX(540, 740 - 100 * 1.5, lerp(1.6, 0.8, E(seg(lt, cu, cu + 0.2))), 1);
        if (lt > mi) K.pill('MICS: NO POWER', 540, 1140, 60, C.red, C.white, E(seg(lt, mi, mi + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + cu, 'slam', { gain: 0.4 }); cue(st + mi, 'pop', { gain: 0.4 });
  }
  // ── 14 · It's not hearing everything, ─────────────────────────
  {
    const st = cut(13), he = Wd('hearing', 13) - st, ev = Wd('everything', 13) - st;
    const chat = ['BLAH BLAH', 'PIZZA?', 'HA HA'];
    add({ id: 'S14', at: st, cam: [600, 650], zoom: 0.12, note: 'hero chats, bubbles drift toward the dark speaker and pop into dust before reaching it; hero wags finger on "everything"',
      draw(lt, d, t) {
        room({ ring: 0, t });
        K.man({ x: 300, y: 820, s: 0.72, arm: lt > ev ? K.ARM.point : K.ARM.down, finger: lt > ev ? Math.sin(lt * 11) * 0.35 : null, eyes: 'n', mouth: lt > ev ? 'smirk' : talk(lt), look: 1, brow: 0.4 });
        chat.forEach((w, k) => {
          const u = ((lt + k * 0.45) % 1.35) / 1.35, x = lerp(520, 720, u), y = 360 + k * 110 - u * 40;
          if (u < 0.75) K.bubble(x, y, 0.7, w, 1, 0, C.white);
          else for (let j = 0; j < 6; j++) circle(x + Math.cos(j) * (u - 0.75) * 300, y + Math.sin(j * 2) * (u - 0.75) * 200, 8 * (1 - u), C.ink);
        });
        if (lt > he) K.pill('NOT RECORDING', 540, 200, 58, C.white, C.ink, E(seg(lt, he, he + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + he, 'pop', { gain: 0.35 }); cue(st + ev, 'boing', { gain: 0.3 });
  }
  // ── 15 · it's waiting for one word. ───────────────────────────
  {
    const st = cut(14), wa = Wd('waiting', 14) - st, wo = Wd('word', 14) - st;
    add({ id: 'S15', at: st, cam: [540, 560], zoom: 0.18, note: 'speaker close-up, ring dim with a slow pulse; the HEY, SPEAKER! card floats above on "waiting"; 1 WORD yellow pill + ring blinks blue on "word"',
      draw(lt, d, t) {
        disc();
        K.smartSpeaker(540, 820, 1.5, { ring: lt > wo ? 1 : 0.15 + 0.15 * Math.sin(lt * 4), t });
        if (lt > wa) K.wakeCard(540, 300 + Math.sin(lt * 3) * 10, 0.75, WAKE, 1, 0, E(seg(lt, wa, wa + 0.25)));
        if (lt > wo) K.pill('1 WORD', 540, 1160, 70, C.yellow, C.ink, E(seg(lt, wo, wo + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + wa, 'pop', { gain: 0.35 }); cue(st + wo, 'sparkle', { dur: 0.5, gain: 0.35 });
  }
  return { shots: S, cues: CUES };
}
