// WHAT DOES YOUR PHONE ACTUALLY SEND WHEN YOU SEND AN EMOJI?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const GREEN = '#5BAE6A', BLUE = '#3A7BD5';
const disc = () => { fillAll(C.bg); circle(540, 740, 520, '#E4DCCB'); };
const heldPhone = (screen) => (x, y) => K.phone(x + 12, y - 70, 0.3, screen);
const laugh = (look = 'a', t = 0) => (x, y) => K.emojiFace(x, y, 0.8, 'laugh', look, t);
/** a framed "tiny picture" card holding the emoji */
function photoCard(x, y, s, t, rot = 0) {
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  rr(-130, -150, 260, 300, 22); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
  K.emojiFace(0, -20, 0.9, 'laugh', 'a', t);
  rr(-90, 100, 180, 20, 10); ctx.fillStyle = '#E4DCCB'; ctx.fill();
  ctx.restore();
}
const eq = (x, y, s, col = C.ink, slash = false) => { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); for (const dy of [-26, 26]) { rr(-70, dy - 14, 140, 28, 14); ctx.fillStyle = col; ctx.fill(); } if (slash) { ctx.rotate(-0.9); rr(-90, -12, 180, 24, 12); ctx.fillStyle = col; ctx.fill(); } ctx.restore(); };
const ring = (x, y, r, p, col = C.yellow) => { if (p <= 0) return; ctx.save(); ctx.lineWidth = 14; ctx.strokeStyle = col; ctx.beginPath(); ctx.arc(x, y, r * p, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); };

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1a · HOOK: hero sends an emoji ──────────────────────────────────
  {
    const st = cut(0), em = Wd('emoji', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 700], zoom: 0.1, note: 'hero close-up with phone; emoji bubble pops in chat and a big emoji pops above on "emoji"',
      draw(lt, d, t) {
        K.room();
        const p = E(seg(lt, em - 0.1, em + 0.2));
        K.man({ x: 540, y: 1300, s: 1.5, arm: K.PHONE_ARM, holding: heldPhone(() => K.emojiChat(laugh('a', t), p, true, 'Sam')), eyes: 'n', mouth: lt > em ? 'grin' : 'smile', brow: 0.5, look: 0.6 });
        if (lt > em) K.emojiFace(790, 330, 1.2 * p, 'laugh', 'a', t, Math.sin(lt * 3) * 0.08);
      } });
    cue(st + em, 'pop', { gain: 0.45 });
  }

  // ── 1b · does it send a tiny picture? ───────────────────────────────
  {
    const st = Wd('does', 0) - 0.1, pc = Wd('picture', 0) - st;
    add({ id: 'S02', at: st, cam: [540, 700], zoom: 0.1, note: 'two phones; a framed emoji picture flies along an arc from left phone to right; TINY PICTURE? pill on "picture"',
      draw(lt, d, t) {
        disc();
        K.phone(230, 820, 0.62, () => K.emojiChat(() => {}, 0, true, 'You'));
        K.phone(850, 820, 0.62, () => K.emojiChat(() => {}, 0, false, 'Sam'));
        const u = eio(seg(lt, 0.3, d - 0.3));
        K.route(230, 640, 850, 640, 300, 0, u);
        const [x, y] = K.arcAt(230, 640, 850, 640, 300, u);
        photoCard(x, y, 0.75, t, Math.sin(lt * 4) * 0.1);
        if (lt > pc) K.pill('A TINY PICTURE?', 540, 1190, 58, C.yellow, C.ink, E(seg(lt, pc, pc + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.3, 'slide', { dur: 1.5, gain: 0.25 }); cue(st + pc, 'pop', { gain: 0.4 });
  }

  // ── 2 · nope, it sends a number ─────────────────────────────────────
  {
    const st = cut(1), np = Wd('nope', 1) - st, nm = Wd('number', 1) - st;
    add({ id: 'S03', at: st, cam: [540, 700], zoom: 0.14, note: 'picture card in centre; red X on "nope"; card flips into a code chip U+1F602 on "number"',
      draw(lt, d, t) {
        disc();
        const f = eio(seg(lt, nm - 0.25, nm + 0.1));
        if (f < 0.5) photoCard(540, 640, 1.4 * Math.cos(f * Math.PI), t);
        if (lt > np && f < 0.5) K.redX(540, 640, 0.9 * E(seg(lt, np, np + 0.25)), 1);
        if (f >= 0.5) K.codeChip(540, 640, 1.5 * Math.abs(Math.cos(f * Math.PI)), 'U+1F602');
        if (lt > nm) K.pill('A NUMBER', 540, 1050, 70, C.yellow, C.ink, E(seg(lt, nm, nm + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + np, 'slam', { gain: 0.5 }); cue(st + nm - 0.2, 'zip', { gain: 0.35 }); cue(st + nm, 'pop', { gain: 0.45 });
  }

  // ── 3a · every emoji has its own code ───────────────────────────────
  {
    const st = cut(2), cd = Wd('code', 2) - st;
    const items = [['smile', 'U+1F600'], ['laugh', 'U+1F602'], ['heart', 'U+2764'], ['wow', 'U+1F62E']];
    add({ id: 'S04', at: st, cam: [540, 700], zoom: 0.08, note: 'four emoji pop in a column; each gets its own code chip beside it from "code"',
      draw(lt, d, t) {
        disc();
        items.forEach(([k, code], i) => {
          const y = 330 + i * 230, p = E(seg(lt, i * 0.1, 0.25 + i * 0.1));
          if (k === 'heart') K.heartEmoji(270, y + 6, 0.85 * p); else K.emojiFace(270, y, 0.85 * p, k, 'a', t);
          const q = E(seg(lt, cd - 0.15 + i * 0.12, cd + 0.15 + i * 0.12));
          if (q > 0) { line([[370, y], [440, y]], C.ink, 10); K.codeChip(680, y, 0.9 * q, code); }
        });
      } });
    cue(st, 'whoosh'); for (let i = 0; i < 4; i++) cue(st + 0.1 + i * 0.12, 'pop', { gain: 0.25 }); cue(st + cd, 'slide', { dur: 0.5, gain: 0.25 });
  }

  // ── 3b · in a giant list called Unicode ─────────────────────────────
  {
    const st = Wd('giant', 2) - 0.1, uc = Wd('unicode', 2) - st;
    add({ id: 'S05', at: st, cam: [540, 640], zoom: 0.12, note: 'the UNICODE list card rises and scrolls fast, slowing down; ONE CODE PER EMOJI pill on "Unicode"',
      draw(lt, d, t) {
        disc();
        const rise = eo(seg(lt, 0, 0.4));
        const sc = 1400 * eo(seg(lt, 0, d)) - 1400;
        K.unicodeList(540, lerp(1700, 660, rise), 1.0, -99, -sc);
        if (lt > uc) K.pill('ONE CODE PER EMOJI', 540, 1180, 54, C.yellow, C.ink, E(seg(lt, uc, uc + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 1.2, gain: 0.3 }); cue(st + uc, 'pop', { gain: 0.45 });
  }

  // ── 4a · so the laughing crying face ────────────────────────────────
  {
    const st = cut(3), la = Wd('laughing', 3) - st;
    add({ id: 'S06', at: st, cam: [540, 640], zoom: 0.18, note: 'giant laughing-crying face bounces in on "laughing", tears dripping',
      draw(lt, d, t) {
        disc();
        K.emojiFace(540, 650, lerp(1.6, 2.6, E(seg(lt, la - 0.15, la + 0.2))) * E(seg(lt, 0, 0.25)), 'laugh', 'a', t, Math.sin(lt * 5) * 0.06);
      } });
    cue(st, 'whoosh'); cue(st + la, 'boing', { gain: 0.4 });
  }

  // ── 4b · is really code one F six oh two ────────────────────────────
  {
    const st = Wd('really', 3) - 0.1, cd = Wd('code', 3) - st, on = Wd('one', 3) - st;
    add({ id: 'S07', at: st, cam: [540, 700], zoom: 0.1, note: 'face shrinks to top; "=" then code chip U+1F602 slams in big on "one"',
      draw(lt, d, t) {
        disc();
        const m = eo(seg(lt, 0, 0.35));
        K.emojiFace(540, lerp(650, 400, m), lerp(2.6, 1.3, m), 'laugh', 'a', t);
        if (lt > cd) eq(540, 690, E(seg(lt, cd, cd + 0.2)));
        if (lt > on - 0.1) K.codeChip(540, 920, 1.45 * E(seg(lt, on - 0.1, on + 0.2)), 'U+1F602');
      } });
    cue(st, 'whoosh'); cue(st + cd, 'pop', { gain: 0.35 }); cue(st + on, 'slam', { gain: 0.5 });
  }

  // ── 5 · your friend's phone reads that code ─────────────────────────
  {
    const st = cut(4), fr = Wd('friend', 4) - st, rd = Wd('reads', 4) - st;
    add({ id: 'S08', at: st, cam: [600, 720], zoom: 0.08, note: 'code chip flies from left into the friend\'s phone (right); magnifier over it on "reads"; FRIEND\'S PHONE pill',
      draw(lt, d, t) {
        K.room();
        K.buddy(790, 1130, 1.3, GREEN);
        K.phone(790, 700, 0.62, () => K.emojiChat(() => {}, 0, false, 'Sam'));
        const u = eio(seg(lt, 0.1, rd));
        const [x, y] = K.arcAt(80, 500, 790, 640, 220, u);
        K.codeChip(x, y, lerp(0.9, 0.55, u), 'U+1F602');
        if (lt > rd) K.magnifier(860, 600, 1.0 * E(seg(lt, rd, rd + 0.25)), -0.6);
        if (lt > fr) K.pill("FRIEND'S PHONE", 420, 260, 56, C.ink, C.white, E(seg(lt, fr, fr + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'zip', { gain: 0.35 }); cue(st + rd, 'pop', { gain: 0.4 });
  }

  // ── 6 · and draws the emoji with its own artwork ────────────────────
  {
    const st = cut(5), dr = Wd('draws', 5) - st, aw = Wd('artwork', 5) - st;
    add({ id: 'S09', at: st, cam: [540, 650], zoom: 0.16, note: 'friend\'s phone big; code chip in bubble wipes into the drawn emoji from "draws"; ITS OWN ART pill on "artwork"',
      draw(lt, d, t) {
        disc();
        const w = eio(seg(lt, dr, dr + 0.8));
        K.phone(540, 680, 1.2, () => K.emojiChat((x, y) => {
          if (w < 1) K.codeChip(x, y, 0.5 * (1 - w), 'U+1F602');
          if (w > 0) { ctx.save(); ctx.beginPath(); ctx.arc(x, y, 110 * w, 0, Math.PI * 2); ctx.clip(); K.emojiFace(x, y, 0.85, 'laugh', 'a', t); ctx.restore(); }
        }, 1, false, 'Sam'));
        if (lt > dr && w < 1) K.burst(540 - 48, 680 - 24, 0.8, 1 - w);
        if (lt > aw) K.pill('ITS OWN ART', 540, 230, 66, C.yellow, C.ink, E(seg(lt, aw, aw + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + dr, 'sparkle', { dur: 0.8, gain: 0.3 }); cue(st + aw, 'pop', { gain: 0.45 });
  }

  // ── 7a · which is why the same emoji ────────────────────────────────
  {
    const st = cut(6), sm = Wd('same', 6) - st;
    add({ id: 'S10', at: st, cam: [540, 720], zoom: 0.08, note: 'one code chip on top splits into two copies that drop into two phones on "same"',
      draw(lt, d, t) {
        disc();
        K.phone(270, 860, 0.6, () => K.emojiChat(() => {}, 0, false, 'Sam'));
        K.phone(810, 860, 0.6, () => K.emojiChat(() => {}, 0, false, 'Ana'));
        const sp = eio(seg(lt, sm - 0.2, sm + 0.5));
        for (const sd of [-1, 1]) K.codeChip(lerp(540, 540 + sd * 270, sp), lerp(330, 840, sp * sp), lerp(1.0, 0.45, sp), 'U+1F602');
        if (lt > sm) K.pill('SAME CODE', 540, 200, 62, C.yellow, C.ink, E(seg(lt, sm, sm + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sm, 'slide', { dur: 0.6, gain: 0.3 });
  }

  // ── 7b · looks different on iPhone and Android ──────────────────────
  {
    const st = Wd('looks', 6) - 0.1, df = Wd('different', 6) - st, ip = Wd('iphone', 6) - st, an = Wd('android', 6) - st;
    add({ id: 'S11', at: st, cam: [540, 700], zoom: 0.12, note: 'two big faces side by side (two art styles); not-equal sign on "different"; IPHONE / ANDROID badges on their words',
      draw(lt, d, t) {
        disc();
        K.emojiFace(290, 640, 1.6 * E(seg(lt, 0, 0.3)), 'laugh', 'a', t);
        K.emojiFace(790, 640, 1.6 * E(seg(lt, 0.1, 0.4)), 'laugh', 'b', t);
        if (lt > df) eq(540, 640, 0.8 * E(seg(lt, df, df + 0.2)), C.red, true);
        if (lt > ip) K.osBadge(290, 920, E(seg(lt, ip, ip + 0.25)), 'IPHONE');
        if (lt > an) K.osBadge(790, 920, E(seg(lt, an, an + 0.25)), 'ANDROID', GREEN);
      } });
    cue(st, 'whoosh'); cue(st + df, 'boing', { gain: 0.4 }); cue(st + ip, 'pop', { gain: 0.4 }); cue(st + an, 'pop', { gain: 0.4 });
  }

  // ── 8 · if their phone is too old to know that code ─────────────────
  {
    const st = cut(7), ol = Wd('old', 7) - st, kn = Wd('know', 7) - st;
    add({ id: 'S12', at: st, cam: [540, 720], zoom: 0.1, note: 'dusty old grey phone; OLD PHONE pill on "old"; code chip arrives and bounces off; red ? on "know"',
      draw(lt, d, t) {
        disc();
        K.phone(540, 740, 0.85, () => { ctx.fillStyle = '#C9CDD3'; ctx.fillRect(-166, -350, 332, 700); });
        for (let i = 0; i < 6; i++) circle(400 + rnd(i) * 280, 470 + rnd(i + 9) * 560, 10 + rnd(i + 3) * 10, '#B9AE98');
        const u = eio(seg(lt, 0.1, kn));
        if (lt < kn + 0.6) { const b = seg(lt, kn, kn + 0.6); K.codeChip(lerp(-100, 540, u) - b * 260, lerp(300, 520, u) - Math.sin(b * Math.PI) * 120, 0.7, 'U+1F602', -b * 0.8); }
        if (lt > ol) K.pill('OLD PHONE', 540, 1180, 60, C.ink, C.white, E(seg(lt, ol, ol + 0.25)));
        if (lt > kn) bigText('?', 790, 420, 220, C.red, 0.15, E(seg(lt, kn, kn + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 0.8, gain: 0.25 }); cue(st + ol, 'pop', { gain: 0.35 }); cue(st + kn, 'boing', { gain: 0.4 });
  }

  // ── 9 · they just see an empty box ──────────────────────────────────
  {
    const st = cut(8), se = Wd('see', 8) - st, em = Wd('empty', 8) - st;
    add({ id: 'S13', at: st, cam: [540, 620], zoom: 0.2, note: 'old phone close-up; chat bubble with an empty box pops on "see"; yellow ring + EMPTY BOX pill on "empty"',
      draw(lt, d, t) {
        disc();
        K.phone(540, 700, 1.2, () => K.emojiChat((x, y) => K.tofu(x, y, 0.6), E(seg(lt, se - 0.1, se + 0.2)), false, 'You'));
        ring(540 - 48, 700 - 24, 150, E(seg(lt, em, em + 0.3)));
        if (lt > em) K.pill('EMPTY BOX', 540, 220, 70, C.red, C.white, E(seg(lt, em, em + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + se, 'pop', { gain: 0.4 }); cue(st + em, 'slam', { gain: 0.4 });
  }

  // ── 10 · here's the twist ───────────────────────────────────────────
  {
    const st = cut(9), tw = Wd('twist', 9) - st;
    add({ id: 'S14', at: st, cam: [540, 700], zoom: 0.2, note: 'red bg; hero close-up shocked; warning on "twist"',
      draw(lt, d, t) {
        fillAll(C.red); K.shockLines(540, 760, 520, 0.5);
        K.man({ x: 540, y: 1250, s: 1.6, eyes: 'wide', mouth: 'o', brow: 1, look: 0 });
        if (lt > tw) K.warning(540, 260, E(seg(lt, tw, tw + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + tw, 'slam', { gain: 0.55 }); cue(st, 'alarm', { dur: 0.8, gain: 0.2 });
  }

  // family members: [hair, shirt, scale]
  const FAM = [[C.hair, BLUE, 0.9], ['#C8734A', C.pink, 0.9], ['#3B2A20', GREEN, 0.66], ['#E0951F', '#F29A3A', 0.66]];
  const tight = [310, 480, 640, 775], wide = [150, 410, 670, 930];
  // ── 11 · the family emoji is really several people ──────────────────
  {
    const st = cut(10), fm = Wd('family', 10) - st, sv = Wd('several', 10) - st, pp = Wd('people', 10) - st;
    add({ id: 'S15', at: st, cam: [540, 700], zoom: 0.1, note: 'family emoji tile pops on "family"; on "several" the tile fades and 4 person emoji spread out; 4 EMOJI IN 1 pill on "people"',
      draw(lt, d, t) {
        disc();
        const p = E(seg(lt, 0, 0.3)), sp = eio(seg(lt, sv, sv + 0.5));
        if (p > 0 && sp < 0.3) { ctx.save(); ctx.globalAlpha = 1 - sp / 0.3; rr(540 - 340 * p, 700 - 260 * p, 680 * p, 520 * p, 60 * p); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke(); ctx.restore(); }
        FAM.forEach(([h, sh, sc], i) => K.personEmoji(lerp(tight[i], wide[i], sp), 720 + (sc < 0.8 ? 40 : 0) - Math.sin(sp * Math.PI) * 80, sc * p * lerp(1, 1.1, sp), h, sh));
        if (lt > pp) K.pill('4 EMOJI IN 1', 540, 1180, 64, C.yellow, C.ink, E(seg(lt, pp, pp + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'pop', { gain: 0.45 }); cue(st + sv, 'zip', { gain: 0.35 }); cue(st + pp, 'pop', { gain: 0.4 });
  }

  // ── 12 · glued together with an invisible character ────────────────
  {
    const st = cut(11), gl = Wd('glued', 11) - st, iv = Wd('invisible', 11) - st, ch = Wd('character', 11) - st;
    add({ id: 'S16', at: st, cam: [540, 720], zoom: 0.1, note: 'four people spread; dashed "+" joiners drop between them on "glued", go faint on "invisible"; ZERO WIDTH JOINER pill on "character"',
      draw(lt, d, t) {
        disc();
        FAM.forEach(([h, sh, sc], i) => K.personEmoji(wide[i], 720 + (sc < 0.8 ? 40 : 0), sc * 1.1, h, sh));
        for (let j = 0; j < 3; j++) {
          const p = E(seg(lt, gl + j * 0.12, gl + 0.3 + j * 0.12)), fade = lt > iv ? lerp(1, 0.3, seg(lt, iv, iv + 0.4)) * (0.75 + 0.25 * Math.sin(lt * 8)) : 1;
          if (p > 0) K.joiner((wide[j] + wide[j + 1]) / 2, lerp(300, 720, clamp(p)), 0.9, fade, t);
        }
        if (lt > ch) K.pill('ZERO WIDTH JOINER', 540, 1180, 56, C.ink, C.white, E(seg(lt, ch, ch + 0.25)));
      } });
    cue(st, 'whoosh'); for (let j = 0; j < 3; j++) cue(st + gl + 0.25 + j * 0.12, 'thud', { gain: 0.3 }); cue(st + iv, 'sparkle', { dur: 0.6, gain: 0.25 }); cue(st + ch, 'pop', { gain: 0.4 });
  }

  // ── 13 · so that heart you just sent? It was just a number. (loop) ──
  {
    const st = cut(12), ht = Wd('heart', 12) - st, nm = Wd('number', 12) - st;
    add({ id: 'S17', at: st, cam: [540, 700], zoom: 0.06, note: 'room; hero; heart emoji pops above on "heart", flips into code chip U+2764 on "number"; finger wag; wink at the end',
      draw(lt, d, t) {
        K.room();
        const wag = lt > nm ? Math.sin(lt * 11) * 0.35 : 0;
        K.man({ x: 540, y: 1250, s: 0.92, arm: K.armPose(K.ARM.down, K.ARM.point, eo(seg(lt, nm - 0.3, nm))), finger: lt > nm ? wag : null,
          eyes: lt > nm + 0.4 ? 'wink' : 'n', mouth: lt > nm + 0.4 ? 'grin' : 'smirk', brow: 0.6, look: 0 });
        const f = eio(seg(lt, nm - 0.25, nm + 0.1));
        if (lt > ht - 0.1 && f < 0.5) K.heartEmoji(540, 330, 1.3 * E(seg(lt, ht - 0.1, ht + 0.2)) * Math.cos(f * Math.PI), Math.max(0, Math.sin(lt * 9)));
        if (f >= 0.5) K.codeChip(540, 330, 1.2 * Math.abs(Math.cos(f * Math.PI)), 'U+2764');
      } });
    cue(st, 'whoosh'); cue(st + ht, 'pop', { gain: 0.45 }); cue(st + nm - 0.2, 'zip', { gain: 0.35 }); cue(st + nm, 'slam', { gain: 0.4 }); cue(st + nm + 0.4, 'boing', { gain: 0.35 });
  }

  return { shots: S, cues: CUES };
}
