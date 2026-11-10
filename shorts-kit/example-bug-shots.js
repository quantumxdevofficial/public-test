// WHY IS A SOFTWARE GLITCH CALLED A BUG?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const GREEN = '#5BAE6A', BLUE = '#3A7BD5';
const bg = (ring = '#CFE8F3', base = C.sky) => { fillAll(base); circle(540, 740, 560, ring); };
const NOTE = 'First actual case of bug being found.';
const RW = [540, 700, 0.95], HOLE = [5, 3];

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · HOOK: hero + laptop; error on "glitch", a bug crawls out on "bug" ──
  {
    const st = cut(0), gl = Wd('glitch', 0) - st, bu = Wd('bug', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 720], zoom: 0.06, note: 'room; hero left, laptop on right; screen turns red on "glitch"; beetle crawls out over the screen + ? on "bug"',
      draw(lt, d, t) {
        K.room();
        const hit = lt > gl;
        K.man({ x: 280, y: 1220, s: 0.95, arm: K.ARM.point, eyes: hit ? 'wide' : 'n', mouth: hit ? 'o' : 'smile', brow: hit ? 1 : 0.3, look: 0.8 });
        K.laptop(780, 780, 0.62, () => {
          K.codeScreen(1, t);
          if (hit) { ctx.save(); ctx.globalAlpha = 0.85 * clamp((lt - gl) * 5); ctx.fillStyle = C.red; ctx.fillRect(-300, -180, 600, 360); ctx.restore();
            ctx.fillStyle = C.white; ctx.font = '900 90px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.globalAlpha = clamp((lt - gl) * 5); ctx.fillText('ERROR', 0, 0); ctx.globalAlpha = 1; }
        });
        if (lt > bu - 0.1) {
          const u = seg(lt, bu - 0.1, bu + 0.6);
          K.beetle(lerp(780, 700, u), lerp(760, 560, eo(u)), 0.9 * E(seg(lt, bu - 0.1, bu + 0.15)), t, -0.3);
          bigText('?', 930, 420, 200, C.yellow, 0.15, E(seg(lt, bu, bu + 0.25)));
        }
      } });
    cue(st + 0.1, 'tock', { gain: 0.2 }); cue(st + gl, 'pop', { gain: 0.4 }); cue(st + bu, 'boing', { gain: 0.35 });
  }

  // ── 2 · Well, a bug is when code does what you typed ──────────────────
  {
    const st = cut(1), co = Wd('code', 1) - st, ty = Wd('typed', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 700], zoom: 0.08, note: 'big laptop centre, code types from "code"; YOU TYPED pill on "typed"',
      draw(lt, d, t) {
        bg('#DDEFF6');
        K.laptop(540, 680, 1.15, () => K.codeScreen(clamp(seg(lt, co - 0.3, ty)), t, 2), E(seg(lt, 0, 0.25)));
        if (lt > ty) K.pill('DOES WHAT YOU TYPED', 540, 1080, 58, C.ink, C.white, E(seg(lt, ty, ty + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + co, 'tock', { gain: 0.2 }); cue(st + ty, 'pop', { gain: 0.4 });
  }

  // ── 3 · not what you meant ────────────────────────────────────────────
  {
    const st = cut(2), no = Wd('not', 2) - st, me = Wd('meant', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 700], zoom: 0.1, note: 'two cards: YOU MEANT (green, $20) vs CODE DID (red, $40); red X slams on "meant"',
      draw(lt, d, t) {
        bg('#FFF1C2', C.bg);
        const card = (x, head, val, col, sc, rot) => {
          if (sc <= 0) return; ctx.save(); ctx.translate(x, 700); ctx.rotate(rot); ctx.scale(sc, sc);
          rr(-210, -260, 420, 520, 36); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
          rr(-210, -260, 420, 110, [36, 36, 0, 0]); ctx.fillStyle = col; ctx.fill(); ctx.stroke();
          ctx.fillStyle = C.white; ctx.font = '900 54px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(head, 0, -204);
          ctx.fillStyle = C.ink; ctx.font = '900 130px Inter'; ctx.fillText(val, 0, 30); ctx.restore();
        };
        card(290, 'YOU MEANT', '$20', GREEN, E(seg(lt, 0, 0.25)), -0.04);
        card(790, 'CODE DID', '$40', C.red, E(seg(lt, no, no + 0.25)), 0.04);
        if (lt > 0.25) K.check(290, 1050, 0.5 * E(seg(lt, 0.2, 0.45)));
        if (lt > me) K.redX(790, 700, lerp(1.6, 0.9, eo(seg(lt, me, me + 0.2))), 1);
      } });
    cue(st, 'whoosh'); cue(st + no, 'pop', { gain: 0.35 }); cue(st + me, 'slam', { gain: 0.4 });
  }

  // ── 4 · Like a shopping cart that charges you twice ───────────────────
  {
    const st = cut(3), sh = Wd('shopping', 3) - st, ch = Wd('charges', 3) - st, tw = Wd('twice', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 700], zoom: 0.08, note: 'phone checkout with cart; first -$20 on "charges", second red -$20 on "twice"; CHARGED x2 pill',
      draw(lt, d, t) {
        bg('#DDEFF6');
        const n = (lt > ch ? E(seg(lt, ch, ch + 0.25)) : 0) + (lt > tw ? E(seg(lt, tw, tw + 0.25)) : 0);
        const ps = E(seg(lt, sh - 0.3, sh));
        if (ps > 0) K.phone(540, 700, 0.95 * ps, () => K.cartScreen(n, lt > tw ? 1 : 0));
        if (lt > tw) { K.pill('CHARGED x2', 540, 1150, 64, C.red, C.white, E(seg(lt, tw + 0.1, tw + 0.35))); K.burst(760, 840, 2.4, clamp(1 - (lt - tw) * 2.5)); }
      } });
    cue(st, 'whoosh'); cue(st + sh, 'pop', { gain: 0.3 }); cue(st + ch, 'pop', { gain: 0.35 }); cue(st + tw, 'alarm', { dur: 0.6, gain: 0.25 });
  }

  // ── 5 · because one tiny line was off ─────────────────────────────────
  {
    const st = cut(4), ti = Wd('tiny', 4) - st, li = Wd('line', 4) - st, of = Wd('off', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 640], zoom: 0.12, note: 'code panel; magnifier slides over one line on "tiny"; it glows red on "line"; beetle sits on it on "off"',
      draw(lt, d, t) {
        bg('#E9E2D2', C.bg);
        rr(140, 300, 800, 700, 36); ctx.fillStyle = '#1F2A44'; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.ink; ctx.stroke();
        const ry = 360 + 4 * 80;
        if (lt > li) { ctx.save(); ctx.globalAlpha = 0.55 * clamp((lt - li) * 4); rr(160, ry - 16, 760, 52, 12); ctx.fillStyle = C.red; ctx.fill(); ctx.restore(); }
        ctx.save(); rr(140, 300, 800, 700, 36); ctx.clip(); K.codeLines(200, 360, 680, 8, 1, 80, 1); ctx.restore();
        const mp = eio(seg(lt, ti - 0.35, ti + 0.1));
        if (mp > 0) K.magnifier(lerp(1100, 640, mp), lerp(1100, ry + 10, mp), 1.5, -0.6);
        if (lt > of) K.beetle(400, ry + 10, 0.55 * E(seg(lt, of, of + 0.25)), t, Math.PI / 2);
      } });
    cue(st, 'whoosh'); cue(st + Math.max(0, ti - 0.3), 'slide', { dur: 0.4, gain: 0.25 }); cue(st + li, 'pop', { gain: 0.35 }); cue(st + of, 'boing', { gain: 0.35 });
  }

  // ── 6 · But the name has a wild story ─────────────────────────────────
  {
    const st = cut(5), na = Wd('name', 5) - st, wi = Wd('wild', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.14, note: 'hero close-up; "BUG" sign pops on "name"; shock + ! on "wild"',
      draw(lt, d, t) {
        K.room();
        const shocked = lt > wi, shake = shocked ? Math.sin(lt * 70) * 6 * Math.max(0, 1 - (lt - wi) * 2) : 0;
        K.man({ x: 540 + shake, y: 1240, s: 1.6, eyes: shocked ? 'wide' : 'n', mouth: shocked ? 'o' : 'flat', brow: shocked ? 1 : 0.5 });
        if (lt > na) K.pill('"BUG"', 240, 420, 90, C.ink, C.white, E(seg(lt, na, na + 0.25)));
        K.shockLines(540, 660, 300, shocked ? clamp((lt - wi) * 5) : 0);
        if (shocked) bigText('!', 880, 450, 230, C.yellow, 0.15, E(seg(lt, wi, wi + 0.2)));
      } });
    cue(st, 'whoosh'); cue(st + na, 'pop', { gain: 0.35 }); cue(st + wi, 'boing', { gain: 0.45 });
  }

  // ── 7 · In 1947, engineers at Harvard ─────────────────────────────────
  {
    const st = cut(6), ni = Wd('nineteen', 6) - st, en = Wd('engineers', 6) - st, ha = Wd('harvard', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 700], zoom: 0.08, note: 'calendar 1947 drops on "nineteen"; shrinks top-left; relay computer wall rises on "engineers"; HARVARD pill on "Harvard"',
      draw(lt, d, t) {
        fillAll('#E6E1D6'); ctx.fillStyle = C.floor; ctx.fillRect(-300, 1150, W + 600, 900);
        const wp = eio(seg(lt, en - 0.2, en + 0.3));
        if (wp > 0) { ctx.save(); ctx.globalAlpha = wp; K.relayWall(540, lerp(1100, 720, wp), 0.85, t); ctx.restore(); }
        const cp = eob(seg(lt, ni - 0.1, ni + 0.35));
        K.calendar(lerp(540, 210, wp), lerp(-400, lerp(700, 320, wp), cp), lerp(1, 0.42, wp), '1947', 'SEPT 9', -0.05);
        if (lt > ha) K.pill('HARVARD', 720, 230, 80, C.ink, C.white, E(seg(lt, ha, ha + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ni + 0.3, 'thud', { gain: 0.4 }); cue(st + en, 'slide', { dur: 0.5, gain: 0.25 }); cue(st + ha, 'pop', { gain: 0.4 });
  }

  // ── 8 · found a real moth stuck inside their giant computer ───────────
  {
    const st = cut(7), re = Wd('real', 7) - st, mo = Wd('moth', 7) - st, ins = Wd('inside', 7) - st, co = Wd('computer', 7) - st;
    const [hx, hy] = K.relaySlot(RW[0], RW[1], RW[2], HOLE[0], HOLE[1]);
    add({ id: 'S08', at: st, cam: [hx, hy], zoom: 0.25, note: 'relay wall; magnifier sweeps to one relay on "real"; moth revealed in the open slot on "moth"; RELAY #70 tag on "inside"; camera pushes in',
      draw(lt, d, t) {
        fillAll('#E6E1D6');
        K.relayWall(RW[0], RW[1], RW[2], t, HOLE);
        if (lt > mo - 0.05) K.moth(hx, hy, 0.5 * E(seg(lt, mo - 0.05, mo + 0.2)), 0.6 + Math.sin(lt * 9) * 0.1, 0.2);
        const mp = eio(seg(lt, re - 0.4, re + 0.1)), back = eio(seg(lt, mo + 0.1, mo + 0.5));
        if (mp > 0 && back < 1) { ctx.save(); ctx.globalAlpha = 1 - back; K.magnifier(lerp(1000, hx + 40, mp), lerp(1150, hy + 40, mp), 1.2, -0.6); ctx.restore(); }
        if (lt > ins) K.tag('RELAY #70', hx + 230, hy - 260, hx + 70, hy - 60, 54, E(seg(lt, ins, ins + 0.25)));
        if (lt > co) K.pill('MARK II COMPUTER', hx, hy + 230, 50, C.ink, C.white, E(seg(lt, co, co + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + Math.max(0, re - 0.4), 'slide', { dur: 0.45, gain: 0.25 }); cue(st + mo, 'pop', { gain: 0.45 }); cue(st + ins, 'pop', { gain: 0.3 });
  }

  // ── 9 · They taped it into the logbook with a little joke ─────────────
  {
    const st = cut(8), tp = Wd('taped', 8) - st, lo = Wd('logbook', 8) - st, jo = Wd('joke', 8) - st;
    const LB = [540, 720, 1.0], [mx, my] = K.logbookMothSpot(...LB);
    add({ id: 'S09', at: st, cam: [mx, my], zoom: 0.08, note: 'open logbook; moth flies onto right page, tape slaps over it on "taped"; LOGBOOK pill on "logbook"; HA! on "joke"',
      draw(lt, d, t) {
        fillAll('#5A4632'); circle(540, 740, 620, '#6E5640');
        K.logbook(...LB, '', 0, 0);
        const u = eio(seg(lt, 0, tp));
        K.moth(lerp(1000, mx, u), lerp(200, my, u), 0.75, u < 1 ? 0.3 + Math.sin(lt * 30) * 0.3 : 0.75, lerp(0.8, 0.1, u));
        if (lt > tp) { K.tape(mx - 60, my - 40, 0.55 * E(seg(lt, tp, tp + 0.2)), -0.6); K.tape(mx + 60, my + 50, 0.55 * E(seg(lt, tp + 0.1, tp + 0.3)), -0.6); }
        if (lt > lo) K.pill('LOGBOOK', 540, 280, 80, C.ink, C.white, E(seg(lt, lo, lo + 0.25)));
        if (lt > jo) bigText('HA!', 880, 1150, 120, C.yellow, 0.15, E(seg(lt, jo, jo + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: Math.max(0.3, tp - 0.1), gain: 0.25 }); cue(st + tp, 'thud', { gain: 0.4 }); cue(st + lo, 'pop', { gain: 0.35 }); cue(st + jo, 'boing', { gain: 0.3 });
  }

  // ── 10 · first actual case of bug being found ─────────────────────────
  {
    const st = cut(9), fi = Wd('first', 9) - st, fo = Wd('found', 9) - st;
    const LB = [540, 720, 1.0], [mx, my] = K.logbookMothSpot(...LB);
    add({ id: 'S10', at: st, cam: [740, 760], zoom: 0.14, note: 'same logbook; handwriting types the note under the moth in sync with the voice; yellow underline on "found"',
      draw(lt, d, t) {
        fillAll('#5A4632'); circle(540, 740, 620, '#6E5640');
        const chars = clamp(seg(lt, fi - 0.05, fo + 0.3)) * NOTE.length;
        K.logbook(...LB, NOTE, chars, 0);
        K.moth(mx, my, 0.75, 0.75, 0.1); K.tape(mx - 60, my - 40, 0.55, -0.6); K.tape(mx + 60, my + 50, 0.55, -0.6);
        if (lt > fo + 0.3) { const p = eo(seg(lt, fo + 0.3, fo + 0.6)); rr(LB[0] + 50, LB[1] + 270, 380 * p, 12, 6); ctx.fillStyle = C.yellow; ctx.fill(); }
      } });
    cue(st, 'whoosh'); cue(st + fi, 'sparkle', { dur: Math.max(0.4, fo - fi), gain: 0.18 }); cue(st + fo + 0.3, 'pop', { gain: 0.35 });
  }

  // ── 11 · And here's the twist ─────────────────────────────────────────
  {
    const st = cut(10), tw = Wd('twist', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.14, note: 'hero close-up, finger raised; smirk + ! on "twist"',
      draw(lt, d, t) {
        K.room();
        const on = lt > tw;
        K.man({ x: 540, y: 1240, s: 1.6, arm: K.ARM.point, finger: on ? Math.sin(lt * 11) * 0.35 : 0, eyes: 'n', mouth: on ? 'smirk' : 'flat', smirk: on, brow: on ? 0.9 : 0.4 });
        if (on) bigText('!', 880, 450, 230, C.yellow, 0.15, E(seg(lt, tw, tw + 0.2)));
      } });
    cue(st, 'whoosh'); cue(st + tw, 'pop', { gain: 0.45 });
  }

  // ── 12 · Thomas Edison was already calling glitches bugs ──────────────
  {
    const st = cut(11), th = Wd('thomas', 11) - st, gl = Wd('glitches', 11) - st, bu = Wd('bugs', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 700], zoom: 0.08, note: 'old paper letter + lightbulb (inventor) from "Thomas"; THOMAS EDISON pill; bulb lights on "glitches"; "bugs" highlights yellow on "bugs"',
      draw(lt, d, t) {
        bg('#F2E3BE', '#E9DCC0');
        K.oldLetter(400, 720, 1.05 * E(seg(lt, Math.max(0, th - 0.2), th + 0.1)), lt > bu ? clamp((lt - bu) * 4) : 0, -0.05);
        K.bulb(840, 460, 1.0 * E(seg(lt, th, th + 0.25)), lt > gl ? clamp((lt - gl) * 3) : 0);
        if (lt > th) K.pill('THOMAS EDISON', 540, 1150, 64, C.ink, C.white, E(seg(lt, th + 0.15, th + 0.4)));
      } });
    cue(st, 'whoosh'); cue(st + th, 'pop', { gain: 0.35 }); cue(st + gl, 'sparkle', { dur: 0.4, gain: 0.3 }); cue(st + bu, 'pop', { gain: 0.4 });
  }

  // ── 13 · back in 1878 ─────────────────────────────────────────────────
  {
    const st = cut(12), ei = Wd('eighteen', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 700], zoom: 0.1, note: 'timeline: 1947 calendar right, 1878 calendar slams in left on "eighteen"; 69 YEARS EARLIER pill',
      draw(lt, d, t) {
        bg('#FFF1C2', C.bg);
        line([[120, 930], [960, 930]], C.ink, 12);
        K.calendar(790, 620, 0.5, '1947', 'MOTH', 0.04);
        const cp = eob(seg(lt, ei - 0.1, ei + 0.3));
        if (lt > ei - 0.1) K.calendar(290, lerp(-300, 620, cp), 0.5, '1878', 'BUGS', -0.05);
        if (lt > ei + 0.4) K.pill('69 YEARS EARLIER', 540, 1090, 58, C.yellow, C.ink, E(seg(lt, ei + 0.4, ei + 0.65)));
      } });
    cue(st, 'whoosh'); cue(st + ei + 0.2, 'slam', { gain: 0.4 }); cue(st + ei + 0.45, 'pop', { gain: 0.3 });
  }

  // ── 14 · So the moth didn't invent the bug ────────────────────────────
  {
    const st = cut(13), mo = Wd('moth', 13) - st, inv = Wd('invent', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 700], zoom: 0.1, note: 'moth big centre; INVENTED "BUG"? pill; red X slams over it on "invent"',
      draw(lt, d, t) {
        bg('#DDEFF6');
        K.moth(540, 620, 1.6 * E(seg(lt, Math.max(0, mo - 0.2), mo + 0.1)), 0.15 + Math.sin(lt * 8) * 0.12, 0);
        if (lt > mo) K.pill('INVENTED "BUG"?', 540, 1000, 64, C.ink, C.white, E(seg(lt, mo + 0.1, mo + 0.35)));
        if (lt > inv) K.redX(540, 1000, lerp(1.4, 0.75, eo(seg(lt, inv, inv + 0.2))), 1);
      } });
    cue(st, 'whoosh'); cue(st + mo, 'pop', { gain: 0.35 }); cue(st + inv, 'slam', { gain: 0.4 });
  }

  // ── 15 · it just became the most famous one ───────────────────────────
  {
    const st = cut(14), fa = Wd('famous', 14) - st, end = Le(14) - st - 0.3;
    add({ id: 'S15', at: st, cam: [540, 740], zoom: 0.08, note: 'museum wall: framed logbook page with the moth under a spotlight; star on "famous"; hero right winks to camera at the end',
      draw(lt, d, t) {
        fillAll('#3E4A5E'); ctx.fillStyle = '#2E3848'; ctx.fillRect(-300, 1180, W + 600, 900);
        K.museumFrame(470, 640, 1.3, () => { K.moth(0, -20, 0.6, 0.75, 0.1); K.tape(-80, -70, 0.4, -0.6); K.tape(80, 40, 0.4, -0.6); ctx.fillStyle = '#2A2A5A'; ctx.font = 'italic 700 26px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('First actual case of bug', 0, 110); }, clamp(lt * 3));
        K.man({ x: 900, y: 1330, s: 0.8, eyes: lt > end ? 'wink' : 'n', mouth: lt > end ? 'grin' : 'smile', smirk: lt > end, brow: 0.4, look: -0.8 });
        if (lt > fa) { bigText('★', 470, 280, 150, C.yellow, 0, E(seg(lt, fa, fa + 0.25))); K.burst(470, 640, 3.4, clamp(1 - (lt - fa) * 2)); }
      } });
    cue(st, 'whoosh'); cue(st + fa, 'sparkle', { dur: 0.6, gain: 0.35 }); cue(st + end, 'pop', { gain: 0.35 });
  }

  return { shots: S, cues: CUES };
}
