// HOW DOES "I'M NOT A ROBOT" KNOW YOU'RE HUMAN?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const GREEN = '#5BAE6A';
const floor = () => { fillAll(C.sky); ctx.fillStyle = C.floor; ctx.fillRect(-300, 1060, W + 600, 900); };
const disc = () => { fillAll(C.bg); circle(540, 740, 520, '#E4DCCB'); };

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · HOOK: the "I'm not a robot" box; a robot peeks in on "robot"; HUMAN? on "human" ──
  {
    const st = cut(0), rb = Wd('robot', 0) - st, hu = Wd('human', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 700], zoom: 0.08, note: 'robot box drops in; hero looks up; robot slides in on "robot"; HUMAN? pill on "human"',
      draw(lt, d, t) {
        K.room();
        K.robotBox(540, lerp(-200, 560, eob(seg(lt, 0, 0.5))), 1.1);
        const [bx, by] = K.robotBoxCheck(540, 560, 1.1);
        K.cursor(bx + 120 + Math.sin(lt * 2.2) * 40, by + 90 + Math.cos(lt * 1.7) * 26, 1);
        K.man({ x: 300, y: 1260, s: 0.95, eyes: lt > hu ? 'wide' : 'n', mouth: lt > hu ? 'o' : 'smile', brow: lt > hu ? 1 : 0.4, look: 0.5 });
        if (lt > rb) K.robot(lerp(1300, 820, eo(seg(lt, rb - 0.1, rb + 0.4))), 1010, 0.85, t, { eyes: 'sus' });
        if (lt > hu) K.pill('HUMAN?', 540, 240, 76, C.yellow, C.ink, E(seg(lt, hu, hu + 0.25)));
      } });
    cue(st + 0.3, 'thud', { gain: 0.45 }); cue(st + rb - 0.1, 'slide', { dur: 0.5, gain: 0.3 }); cue(st + hu, 'boing', { gain: 0.4 });
  }

  // ── 2 · it's a CAPTCHA: easy for people ──────────────────────────────
  {
    const st = cut(1), cp = Wd('captcha', 1) - st, ea = Wd('easy', 1) - st, pp = Wd('people', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 760], zoom: 0.1, note: 'CAPTCHA word slams in on "captcha"; buddy + green check on "easy"; PEOPLE pill',
      draw(lt, d, t) {
        disc();
        if (lt > cp - 0.3) bigText('CAPTCHA', 540, lerp(-200, 430, eob(seg(lt, cp - 0.3, cp + 0.1))), 170, C.yellow, -0.04);
        const te = Wd('test', 1) - st; if (lt > te) K.buddy(540, 930, 1.8 * E(seg(lt, te, te + 0.3)), '#3A7BD5');
        if (lt > ea + 0.2) K.check(760, 700, 0.6 * E(seg(lt, ea + 0.2, ea + 0.45)));
        if (lt > pp) K.pill('EASY FOR PEOPLE', 540, 1190, 54, GREEN, C.white, E(seg(lt, pp, pp + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + cp, 'slam', { gain: 0.45 }); cue(st + ea, 'pop', { gain: 0.4 }); cue(st + ea + 0.25, 'sparkle', { dur: 0.4, gain: 0.25 });
  }

  // ── 3 · but hard for bots ────────────────────────────────────────────
  {
    const st = cut(2), hd = Wd('hard', 2) - st, bt = Wd('bots', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 760], zoom: 0.14, note: 'robot stares at the box; eyes turn to X on "hard"; dizzy ring; HARD FOR BOTS red pill on "bots"',
      draw(lt, d, t) {
        disc();
        K.robot(540, 880, 1.2, t, { eyes: lt > hd ? 'x' : 'n' });
        if (lt > hd) K.dizzy(540, 410, 120, t, clamp((lt - hd) * 4));
        if (lt > bt) K.pill('HARD FOR BOTS', 540, 1180, 58, C.red, C.white, E(seg(lt, bt, bt + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + hd, 'boing', { gain: 0.4 }); cue(st + bt, 'pop', { gain: 0.45 });
  }

  // ── 4a · bots can't spam sign-ups: a box barrier blocks the flood ────
  {
    const st = cut(3), cn = Wd('can', 3) - st, sp = Wd('spam', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 760], zoom: 0.08, note: 'robot fires sign-up cards at a website; robot box drops between them on "can\'t"; cards bounce and fall; SPAM pill',
      draw(lt, d, t) {
        floor();
        K.robot(190, 900, 0.62, t, { arm: 0.7, eyes: 'sus' });
        K.browser(830, 760, 380, 460, 'site.com', () => { ctx.fillStyle = C.ink; ctx.font = '900 46px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('SIGN UP', 0, -40); rr(-120, 20, 240, 60, 30); ctx.fillStyle = '#3A7BD5'; ctx.fill(); });
        const wall = E(seg(lt, cn, cn + 0.35));
        for (let i = 0; i < 8; i++) {
          const k = (lt * 1.6 - i * 0.22); if (k < 0) continue; const u = k % 1.1; if (u > 1) continue;
          const born = lt - u / 1.6, blocked = born > cn - 0.3;
          let x = lerp(300, 760, u), y = 700 - Math.sin(u * Math.PI) * 140;
          if (blocked && x > 500) { const over = (x - 500) / 260; x = 500 - over * 120; y = 700 + over * over * 900; }
          if (y < 1300) K.formCard(x, y, 0.3, 'EMAIL', 'bot' + i + '@x', 1e9, u * 2);
        }
        if (wall > 0) { ctx.save(); rr(546, lerp(-300, 620, wall), 28, 520, 14); ctx.fillStyle = C.ink; ctx.fill(); ctx.restore(); }
        if (wall > 0) K.robotBox(560, lerp(-300, 520, wall), 0.55, 0, 0, 1);
        if (lt > sp) K.pill('NO SPAM SIGN-UPS', 540, 250, 58, C.yellow, C.ink, E(seg(lt, sp, sp + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 0.8, gain: 0.25 }); cue(st + cn + 0.3, 'thud', { gain: 0.5 }); cue(st + sp, 'pop', { gain: 0.4 });
  }

  // ── 4b · or grab every concert ticket ────────────────────────────────
  {
    const st = Wd('grab', 3) - 0.1, tk = Wd('ticket', 3) - st;
    add({ id: 'S05', at: st, cam: [540, 720], zoom: 0.1, note: 'fan of concert tickets; robot arm reaches from the right; red X over the robot on "ticket"',
      draw(lt, d, t) {
        disc();
        for (let i = 0; i < 5; i++) K.concertTicket(540 + (i - 2) * 40, 620 + Math.abs(i - 2) * 16, 0.9, (i - 2) * 0.16, [C.pink, '#3A7BD5', GREEN, '#F29A3A', C.red][i]);
        const reach = eo(seg(lt, 0.05, 0.6));
        K.robot(lerp(1300, 900, reach), 1000, 0.75, t, { arm: 1, eyes: 'sus' });
        if (lt > tk) K.redX(860, 820, 0.7 * E(seg(lt, tk, tk + 0.25)), 1);
        if (lt > tk) K.pill('NO TICKET BOTS', 540, 250, 60, C.yellow, C.ink, E(seg(lt, tk, tk + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 0.5, gain: 0.3 }); cue(st + tk, 'slam', { gain: 0.5 });
  }

  // ── 5 · but the checkbox isn't really the test ──────────────────────
  {
    const st = cut(4), cb = Wd('checkbox', 4) - st, re = Wd('really', 4) - st, ts = Wd('test', 4) - st;
    add({ id: 'S06', at: st, cam: [440, 640], zoom: 0.2, note: 'big robot box; yellow ring around the checkbox on "checkbox"; red X over the box on "really"; NOT THE TEST pill on "test"',
      draw(lt, d, t) {
        disc();
        K.robotBox(540, 680, 1.25);
        const [bx, by] = K.robotBoxCheck(540, 680, 1.25);
        if (lt > cb) { ctx.save(); ctx.lineWidth = 16; ctx.strokeStyle = C.yellow; ctx.beginPath(); ctx.arc(bx, by, 110 * E(seg(lt, cb, cb + 0.3)), 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
        if (lt > re) K.redX(bx, by, 0.3 * E(seg(lt, re, re + 0.25)), 1);
        if (lt > ts) K.pill('NOT THE TEST', 540, 1010, 64, C.ink, C.white, E(seg(lt, ts, ts + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + cb, 'pop', { gain: 0.4 }); cue(st + re, 'slam', { gain: 0.45 }); cue(st + ts, 'pop', { gain: 0.4 });
  }

  // ── 6 · before you click, it watches how your mouse moves ───────────
  {
    const st = cut(5), cl = Wd('click', 5) - st, wa = Wd('watches', 5) - st, mo = Wd('mouse', 5) - st;
    const box = [540, 400, 0.95], [bx, by] = K.robotBoxCheck(...box);
    const path = K.wobblyPath(200, 1150, bx + 6, by + 6, 50, 90, 2);
    add({ id: 'S07', at: st, cam: [540, 760], zoom: 0.08, note: 'box at top; cursor wobbles up from bottom-left leaving a dotted trail; eyes pop out on "watches"; MOUSE PATH pill',
      draw(lt, d, t) {
        fillAll(C.bg);
        K.robotBox(...box);
        const u = eio(seg(lt, 0.1, d - 0.2));
        K.trail(path, u, C.ink, 12, true, 0.8);
        const [cx, cy] = K.trailAt(path, u); K.cursor(cx, cy, 1.1);
        if (lt > wa) K.peekEyes(840, 640, 0.9 * E(seg(lt, wa, wa + 0.3)), clamp((cx - 840) / 300, -1, 1), 0);
        if (lt > mo) K.pill('MOUSE PATH', 300, 760, 50, C.yellow, C.ink, E(seg(lt, mo, mo + 0.25)));
        if (lt < cl + 0.6 && lt > cl) K.pill('NOT CLICKED YET', 540, 1180, 46, C.ink, C.white, E(seg(lt, cl, cl + 0.2)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 2.2, gain: 0.18 }); cue(st + wa, 'pop', { gain: 0.4 }); cue(st + mo, 'pop', { gain: 0.35 });
  }

  // ── 7 · checks your browser and cookies ─────────────────────────────
  {
    const st = cut(6), ch = Wd('checks', 6) - st, br = Wd('browser', 6) - st, ck = Wd('cookies', 6) - st;
    add({ id: 'S08', at: st, cam: [540, 740], zoom: 0.1, note: 'browser window; magnifier sweeps on "checks"; green check on "browser"; cookie pops on "cookies"',
      draw(lt, d, t) {
        disc();
        K.browser(540, 700, 860, 640, 'your browser', () => {});
        const mx = lerp(260, 820, eio(seg(lt, ch, d - 0.2)));
        if (lt > ck) K.cookie(700, 760, 0.8 * E(seg(lt, ck, ck + 0.3)), 0.3);
        if (lt > br) { K.check(330, 700, 0.55 * E(seg(lt, br, br + 0.25))); K.pill('BROWSER', 330, 920, 46, C.ink, C.white, E(seg(lt, br, br + 0.25))); }
        if (lt > ck + 0.2) K.pill('COOKIES', 700, 960, 46, C.ink, C.white, E(seg(lt, ck + 0.2, ck + 0.45)));
        if (lt > ch - 0.1) K.magnifier(mx, 620, 1.3 * E(seg(lt, ch - 0.1, ch + 0.2)), -0.6);
      } });
    cue(st, 'whoosh'); cue(st + ch, 'slide', { dur: 1.2, gain: 0.25 }); cue(st + br, 'pop', { gain: 0.4 }); cue(st + ck, 'pop', { gain: 0.45 });
  }

  // ── 8a · real people wobble and pause ───────────────────────────────
  {
    const st = cut(7), wb = Wd('wobble', 7) - st, pa = Wd('pause', 7) - st, end = Wd('but', 7) - st;
    const [bx, by] = K.robotBoxCheck(700, 330, 0.62);
    const path = K.wobblyPath(300, 1000, bx + 6, by + 6, 50, 110, 5);
    add({ id: 'S09', at: st, cam: [540, 760], zoom: 0.08, note: 'buddy bottom-left; cursor wobbles toward the box; stops on "pause" (dots), then goes on; HUMAN pill green',
      draw(lt, d, t) {
        fillAll(C.bg);
        K.robotBox(700, 330, 0.62);
        K.buddy(170, 1150, 1.2, '#3A7BD5');
        const k = lt < pa ? 0.55 * seg(lt, 0.05, pa) : lt < pa + 0.5 ? 0.55 : 0.55 + 0.45 * seg(lt, pa + 0.5, end);
        const u = eio(k);
        K.trail(path, u, GREEN, 14, false, 0.9);
        const [cx, cy] = K.trailAt(path, u); K.cursor(cx, cy, 1.1);
        if (lt > pa && lt < pa + 0.6) for (let i = 0; i < 3; i++) circle(cx + 90 + i * 36, cy - 10, 10 * clamp((lt - pa) * 6 - i), C.ink);
        if (lt > wb) K.pill('WOBBLE', 280, 560, 50, C.yellow, C.ink, E(seg(lt, wb, wb + 0.25)));
        if (lt > pa) K.pill('HUMAN', 800, 900, 60, GREEN, C.white, E(seg(lt, pa, pa + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 1, gain: 0.2 }); cue(st + wb, 'boing', { gain: 0.3 }); cue(st + pa, 'pop', { gain: 0.4 });
  }

  // ── 8b · but simple bots move too perfectly ─────────────────────────
  {
    const st = Wd('but', 7) - 0.1, bt = Wd('bots', 7) - st, pf = Wd('perfectly', 7) - st;
    add({ id: 'S10', at: st, cam: [540, 760], zoom: 0.12, note: 'robot bottom-left; cursor zips in a ruler-straight line to the box; red TOO PERFECT pill + warning on "perfectly"',
      draw(lt, d, t) {
        fillAll(C.bg);
        K.robotBox(700, 330, 0.62);
        const [bx, by] = K.robotBoxCheck(700, 330, 0.62);
        K.robot(180, 1050, 0.6, t, { eyes: 'sus' });
        const path = [[300, 920], [bx + 6, by + 6]];
        const u = eo(seg(lt, bt, bt + 0.35));
        if (u > 0) { K.trail(path, u, C.red, 14, false, 0.9); const [cx, cy] = K.trailAt(path, u); K.cursor(cx, cy, 1.1); }
        else K.cursor(300, 920, 1.1);
        if (lt > pf) { K.pill('TOO PERFECT', 700, 900, 60, C.red, C.white, E(seg(lt, pf, pf + 0.25))); K.warning(880, 640, 0.5 * E(seg(lt, pf, pf + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + bt, 'zip', { gain: 0.45 }); cue(st + pf, 'slam', { gain: 0.45 }); cue(st + pf, 'alarm', { dur: 0.6, gain: 0.15 });
  }

  // ── 9 · look suspicious → you get the picture puzzle ────────────────
  {
    const st = cut(8), su = Wd('suspicious', 8) - st, pi = Wd('picture', 8) - st, pz = Wd('puzzle', 8) - st;
    add({ id: 'S11', at: st, cam: [540, 700], zoom: 0.08, note: 'box spins on "suspicious"; picture grid slides up on "picture"; cursor ticks traffic-light tiles from "puzzle"',
      draw(lt, d, t) {
        disc();
        const g = eo(seg(lt, pi - 0.1, pi + 0.35));
        if (g < 1) K.robotBox(540, lerp(640, -300, g), 1.0, lt > su ? 1 : 0, t);
        if (lt > su && g < 0.5) K.pill('SUSPICIOUS', 540, 900, 56, C.red, C.white, E(seg(lt, su, su + 0.25)));
        if (g > 0) {
          const gy = lerp(1900, 700, g), ticks = [1, 3, 7], sel = []; ticks.forEach((ti, j) => { if (lt > pz + 0.15 + j * 0.35) sel[ti] = true; });
          K.puzzleGrid(540, gy, 1.08, sel);
          const j = clamp(Math.floor((lt - pz + 0.15) / 0.35), 0, 2), [tx, ty] = K.puzzleTile(540, gy, 1.08, ticks[j]);
          if (lt > pz - 0.2) K.cursor(tx + 30, ty + 40, 1.1);
        }
      } });
    cue(st, 'whoosh'); cue(st + su, 'alarm', { dur: 0.5, gain: 0.15 }); cue(st + pi, 'slide', { dur: 0.4, gain: 0.3 });
    for (let j = 0; j < 3; j++) cue(st + pz + 0.15 + j * 0.35, 'pop', { gain: 0.3 });
  }

  // ── 10 · here's the twist ────────────────────────────────────────────
  {
    const st = cut(9), tw = Wd('twist', 9) - st;
    add({ id: 'S12', at: st, cam: [540, 700], zoom: 0.2, note: 'red bg; hero close-up shocked; warning on "twist"',
      draw(lt, d, t) {
        fillAll(C.red); K.shockLines(540, 760, 520, 0.5);
        K.man({ x: 540, y: 1250, s: 1.6, eyes: 'wide', mouth: 'o', brow: 1, look: 0 });
        if (lt > tw) K.warning(540, 260, E(seg(lt, tw, tw + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + tw, 'slam', { gain: 0.55 }); cue(st, 'alarm', { dur: 0.8, gain: 0.2 });
  }

  // ── 11a · those squiggly words you typed years ago ──────────────────
  {
    const st = cut(10), sq = Wd('squiggly', 10) - st, ty = Wd('typed', 10) - st, yr = Wd('years', 10) - st;
    add({ id: 'S13', at: st, cam: [540, 700], zoom: 0.1, note: 'squiggly word card wobbles in on "squiggly"; input box types the word from "typed"; OLD CAPTCHAS pill on "years"',
      draw(lt, d, t) {
        disc();
        K.squiggleCard(540, 560, 1.25 * E(seg(lt, sq - 0.15, sq + 0.2)), 'morning', -0.04, lt * 1.5);
        if (lt > ty - 0.1) K.formCard(540, 920, 1.25 * E(seg(lt, ty - 0.1, ty + 0.15)), 'TYPE THE WORD', 'morning', 7 * seg(lt, ty + 0.1, ty + 0.9));
        if (lt > yr) K.pill('OLD CAPTCHAS', 540, 240, 60, C.yellow, C.ink, E(seg(lt, yr, yr + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sq, 'boing', { gain: 0.35 }); cue(st + ty + 0.2, 'tock', { gain: 0.25 }); cue(st + ty + 0.55, 'tock', { gain: 0.25 }); cue(st + yr, 'pop', { gain: 0.4 });
  }

  // ── 11b · helped scan old books ─────────────────────────────────────
  {
    const st = Wd('helped', 10) - 0.1, sc = Wd('scan', 10) - st, bk = Wd('books', 10) - st;
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.1, note: 'open old book; yellow scan bar sweeps on "scan"; a word lights up and flies up into a squiggly card; BOOKS DIGITIZED pill on "books"',
      draw(lt, d, t) {
        disc();
        K.oldBook(540, 860, 1.1, lt > sc + 0.3 ? 9 : -1, 0);
        if (lt > sc) { const sy = lerp(640, 1100, seg(lt, sc, sc + 0.8)); ctx.save(); ctx.globalAlpha = 0.45 * (1 - seg(lt, sc + 0.7, sc + 0.9)); ctx.fillStyle = C.yellow; ctx.fillRect(100, sy - 20, 880, 40); ctx.restore(); }
        const f = eio(seg(lt, sc + 0.4, bk + 0.2));
        if (f > 0) K.squiggleCard(540, lerp(800, 420, f), lerp(0.2, 0.8, f), 'morning', 0.05, lt);
        if (lt > bk) K.pill('BOOKS DIGITIZED', 540, 230, 58, C.yellow, C.ink, E(seg(lt, bk, bk + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sc, 'slide', { dur: 0.8, gain: 0.25 }); cue(st + bk, 'pop', { gain: 0.45 });
  }

  // ── 12 · house numbers helped Google read Street View ──────────────
  {
    const st = cut(11), hs = Wd('house', 11) - st, nm = Wd('numbers', 11) - st, gg = Wd('google', 11) - st, sv = Wd('street', 11) - st;
    add({ id: 'S15', at: st, cam: [540, 760], zoom: 0.08, note: 'street of houses; number plate pops off the front house on "numbers" and grows; map pin drops on "Google"; STREET VIEW pill',
      draw(lt, d, t) {
        floor(); ctx.fillStyle = '#9AA1AE'; ctx.fillRect(-300, 1060, W + 600, 140);
        K.house(220, 920, 0.9, '#F29A3A'); K.house(860, 920, 0.9, GREEN);
        K.house(540, 900, 1.3, '#E57A8A');
        const g = eo(seg(lt, nm, nm + 0.45));
        K.numberPlate(lerp(610, 540, g), lerp(900, 470, g), lerp(0.22, 1.0, g), '42');
        if (lt > hs && g === 0) { ctx.save(); ctx.lineWidth = 10; ctx.strokeStyle = C.yellow; ctx.beginPath(); ctx.arc(610, 900, 60, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
        if (lt > gg) K.mapPin(820, lerp(-200, 560, eob(seg(lt, gg, gg + 0.4))), 1.0);
        if (lt > sv) K.pill('STREET VIEW', 540, 230, 64, C.yellow, C.ink, E(seg(lt, sv, sv + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + hs, 'pop', { gain: 0.3 }); cue(st + nm, 'slide', { dur: 0.4, gain: 0.3 }); cue(st + gg + 0.35, 'thud', { gain: 0.45 }); cue(st + sv, 'pop', { gain: 0.4 });
  }

  // ── 13 · proving you're human might mean doing free work (loop) ─────
  {
    const st = cut(12), pr = Wd('proving', 12) - st, hu = Wd('human', 12) - st, fr = Wd('free', 12) - st, wk = Wd('work', 12) - st;
    add({ id: 'S16', at: st, cam: [540, 700], zoom: 0.06, note: 'room; hero; robot box above spins on "proving", checks on "human"; FREE WORK pill on "free"; finger wag; wink at the end',
      draw(lt, d, t) {
        K.room();
        const wag = lt > fr ? Math.sin(lt * 11) * 0.35 : 0;
        K.man({ x: 540, y: 1250, s: 0.92, arm: K.armPose(K.ARM.down, K.ARM.point, eo(seg(lt, fr - 0.2, fr + 0.1))), finger: lt > fr ? wag : null,
          eyes: lt > wk + 0.3 ? 'wink' : 'n', mouth: lt > wk + 0.3 ? 'grin' : 'smirk', brow: 0.6, look: 0 });
        K.robotBox(540, 690, 0.85, lt > hu ? 2 : lt > pr ? 1 : 0, t, seg(lt, hu, hu + 0.35), E(seg(lt, 0, 0.3)));
        if (lt > fr) K.pill('FREE WORK', 540, 240, 76, C.yellow, C.ink, E(seg(lt, fr, fr + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + hu, 'pop', { gain: 0.45 }); cue(st + fr, 'slam', { gain: 0.4 }); cue(st + wk + 0.3, 'boing', { gain: 0.35 });
  }

  return { shots: S, cues: CUES };
}
