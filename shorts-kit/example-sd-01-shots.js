// (1/30) WHAT IS SYSTEM DESIGN?: the shot list. Restaurant analogy: server = cook, more servers = more kitchens,
// load balancer = host, cache = dishes kept ready.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const GREEN = '#5BAE6A', BLUE = '#3A7BD5', ORANGE = '#F29A3A';
const PCOLS = [BLUE, C.pink, GREEN, ORANGE, '#8A63D2', C.red];
const bg = (ring = '#CFE8F3', base = C.sky) => { fillAll(base); circle(540, 740, 560, ring); };
const chatScreen = (t) => () => {
  ctx.fillStyle = '#EAF4EC'; ctx.fillRect(-166, -350, 332, 700);
  ctx.fillStyle = GREEN; ctx.fillRect(-166, -350, 332, 110);
  for (let i = 0; i < 4; i++) { const me = i % 2; rr(me ? -20 : -146, -190 + i * 120, 166, 80, 26); ctx.fillStyle = me ? '#BDE5C4' : C.white; ctx.fill(); }
};
const heldPhone = (screen) => (x, y) => K.phone(x + 12, y - 70, 0.3, screen);
// a cook = the hero with a chef hat
const cook = (o) => { K.man(o); K.chefHat(o.x, o.y, o.s, o.hat ?? 1); };

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · HOOK: one app tile in the middle; people pop in around it on "millions"; stopwatch on "time" ──
  {
    const st = cut(0), on = Wd('one', 0) - st, mi = Wd('millions', 0) - st, ti = Wd('same', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 740], zoom: 0.08, note: 'app tile centre pops on "one"; rings of people pop in from "millions"; stopwatch top right on "same (time)"',
      draw(lt, d, t) {
        bg();
        const n = Math.floor(clamp((lt - mi) / 0.9) * 28);
        for (let k = 0; k < n; k++) {
          const ring = k < 10 ? 0 : k < 20 ? 1 : 2, kk = ring === 0 ? k : ring === 1 ? k - 10 : k - 20, cnt = ring === 2 ? 8 : 10;
          const a = (kk / cnt) * Math.PI * 2 + ring * 0.3, r = 300 + ring * 140;
          const x = 540 + Math.cos(a) * r, y = 740 + Math.sin(a) * r * 0.82;
          if (y > 1200) continue;
          K.personIcon(x, y, 0.8 * E(seg(lt, mi + k * 0.03, mi + k * 0.03 + 0.25)), PCOLS[k % 6]);
        }
        const sc = E(seg(lt, 0, 0.3)) * (1 + 0.25 * Math.sin(Math.PI * clamp((lt - on + 0.1) / 0.35)));
        if (sc > 0) { K.appTile(540, 740, 1.9 * sc, GREEN); ctx.save(); ctx.translate(540, 740); ctx.scale(sc, sc); rr(-55, -40, 110, 70, 28); ctx.fillStyle = C.white; ctx.fill(); ctx.beginPath(); ctx.moveTo(-30, 25); ctx.lineTo(-44, 52); ctx.lineTo(-6, 28); ctx.fill(); ctx.restore(); }
        if (lt > ti) K.stopwatch(900, 420, 0.42 * E(seg(lt, ti, ti + 0.25)), t * 6);
      } });
    cue(st + on - 0.15, 'pop', { gain: 0.45 }); cue(st + mi, 'sparkle', { dur: 0.9, gain: 0.3 }); cue(st + ti, 'tock', { gain: 0.4 });
  }

  // ── 2 · Your phone talks to a computer called a server ────────────────────
  {
    const st = cut(1), ph = Wd('phone', 1) - st, ta = Wd('talks', 1) - st, sv = Wd('server', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 760], zoom: 0.08, note: 'phone left, envelope flies along a dotted arc on "talks" to the server right; server pops + pill on "server"',
      draw(lt, d, t) {
        bg('#DDEFF6');
        K.phone(250, 820, 0.62 * E(seg(lt, 0, 0.25)), chatScreen(t));
        const sp = E(seg(lt, sv - 0.6, sv - 0.3));
        if (sp > 0) K.server(820, 800, 0.8 * sp, t);
        K.route(320, 600, 800, 560, 280, 0, clamp((lt - ta) / 0.7));
        if (lt > ta) { const u = clamp((lt - ta) / 0.9); const [x, y] = K.arcAt(320, 600, 800, 560, 280, u); K.envelope(x, y, 0.55, 0); }
        if (lt > ph) K.pill('YOU', 250, 1150, 64, C.yellow, C.ink, E(seg(lt, ph, ph + 0.25)));
        if (lt > sv) K.pill('SERVER', 820, 1150, 64, C.ink, C.white, E(seg(lt, sv, sv + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ta, 'slide', { dur: 0.9, gain: 0.3 }); cue(st + sv - 0.6, 'pop', { gain: 0.35 }); cue(st + sv, 'pop', { gain: 0.4 });
  }

  // ── 3 · and one server is like one cook in a tiny kitchen ───────────────
  {
    const st = cut(2), lk = Wd('like', 2) - st, ck = Wd('cook', 2) - st, tn = Wd('tiny', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 820], zoom: 0.1, note: 'kitchen; small server top-left with arrow pointing to the cook on "like"; chef hat drops on the hero on "cook"; TINY KITCHEN pill on "tiny"',
      draw(lt, d, t) {
        K.kitchen(1180);
        K.stove(780, 1000, 0.75, t, 1);
        cook({ x: 400, y: 1060, s: 0.82, arm: K.ARM.hip, eyes: 'n', mouth: 'smile', brow: 0.3, look: 0.6, hat: E(seg(lt, ck - 0.1, ck + 0.25)) });
        K.server(160, 300, 0.4 * E(seg(lt, 0, 0.25)), t);
        if (lt > lk) K.arrow(240, 360, 110, 0.5, E(seg(lt, lk, lk + 0.2)));
        if (lt > tn) K.pill('TINY KITCHEN', 760, 1120, 56, C.yellow, C.ink, E(seg(lt, tn, tn + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + lk, 'pop', { gain: 0.35 }); cue(st + ck, 'boing', { gain: 0.35 }); cue(st + tn, 'pop', { gain: 0.4 });
  }

  // ── 4 · Ten orders? Easy. ─────────────────────────────────────────────
  {
    const st = cut(3), tn = Wd('ten', 3) - st, ez = Wd('easy', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 700], zoom: 0.08, note: 'ticket rail across the top fills with 10 tickets from "ten"; tickets get ticks + cook grins + green check on "easy"',
      draw(lt, d, t) {
        K.kitchen(1180);
        line([[60, 250], [1020, 250]], '#5E6775', 16);
        for (let k = 0; k < 10; k++) { const a = tn + k * 0.06; if (lt > a) K.ticket(110 + k * 96, lerp(150, 330, E(seg(lt, a, a + 0.2))), 0.55, (rnd(k) - 0.5) * 0.15, lt > ez + k * 0.04); }
        cook({ x: 540, y: 1100, s: 0.8, arm: K.armPose(K.ARM.down, K.ARM.wave, E(seg(lt, ez - 0.1, ez + 0.2))), eyes: lt > ez ? 'closed' : 'n', mouth: lt > ez ? 'grin' : 'smile', brow: 0.5 });
        if (lt > ez) K.check(860, 660, 0.7 * E(seg(lt, ez, ez + 0.25)));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 10; k += 2) cue(st + tn + k * 0.06, 'pop', { gain: 0.22 }); cue(st + ez, 'sparkle', { dur: 0.4, gain: 0.35 });
  }

  // ── 5 · But WhatsApp delivers around a hundred billion messages a day ─────
  {
    const st = cut(4), dl = Wd('delivers', 4) - st, hu = Wd('hundred', 4) - st, bi = Wd('billion', 4) - st, dy = Wd('day', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 760], zoom: 0.07, note: 'globe; envelopes stream in from all sides from "delivers"; counter "100" → "100,000,000,000" on "hundred/billion"; EVERY DAY pill on "day"',
      draw(lt, d, t) {
        bg('#E9E2D2', C.bg);
        K.globe(540, 860, 1.9, t);
        const nEnv = Math.floor(clamp((lt - dl) / 1.2) * 26);
        for (let k = 0; k < nEnv; k++) {
          const a = rnd(k + 3) * Math.PI * 2, u = ((lt - dl) * 0.8 + rnd(k)) % 1;
          const x = 540 + Math.cos(a) * lerp(700, 220, u), y = 860 + Math.sin(a) * lerp(700, 220, u);
          if (y < 1220 && y > 470) K.envelope(x, y, 0.32, a);
        }
        if (lt > hu) { const p = E(seg(lt, hu, hu + 0.25)); ctx.save(); ctx.translate(540, 300); ctx.scale(p, p); rr(-500, -90, 1000, 180, 40); ctx.fillStyle = C.ink; ctx.fill(); ctx.restore();
          bigText(lt > bi ? '100,000,000,000' : '100', 540, 305, lt > bi ? 96 : 140, C.yellow, 0, p); }
        if (lt > dy) K.pill('EVERY DAY', 540, 480, 58, C.red, C.white, E(seg(lt, dy, dy + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + dl, 'slide', { dur: 1.2, gain: 0.3 }); cue(st + hu, 'slam', { gain: 0.4 }); cue(st + bi, 'pop', { gain: 0.45 }); cue(st + dy, 'pop', { gain: 0.4 });
  }

  // ── 6 · and one cook would totally melt ────────────────────────────────
  {
    const st = cut(5), ck = Wd('cook', 5) - st, ml = Wd('melt', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.12, note: 'tickets rain down and pile up; cook panics (wide eyes, sweat); load meter rises into red; on "melt" he squashes down, red warning + red flash',
      draw(lt, d, t) {
        K.kitchen(1180);
        K.loadMeter(970, 700, 90, 520, clamp(lt / (ml + 0.2)));
        const sq = E(seg(lt, ml, ml + 0.3));
        ctx.save(); ctx.translate(420, 1180); ctx.scale(1 + sq * 0.18, 1 - sq * 0.3); ctx.translate(-420, -1180);
        cook({ x: 420, y: 1060, s: 0.8, arm: K.ARM.mouth, armL: K.ARM.mouth, eyes: 'wide', mouth: 'o', brow: 1 });
        ctx.restore();
        for (let k = 0; k < 30; k++) { const a = k * 0.05; if (lt < a) continue; const y = lerp(-200, 980 + (k % 5) * 40, clamp((lt - a) / 0.5)); K.ticket(80 + rnd(k) * 760, y, 0.5, (rnd(k + 9) - 0.5)); }
        K.sweat(580, 640 + sq * 120, t, 1);
        if (lt > ml) { K.warning(820, 300, 0.7 * E(seg(lt, ml, ml + 0.25))); ctx.save(); ctx.globalAlpha = 0.16 * Math.abs(Math.sin(t * 8)); fillAll(C.red); ctx.restore(); }
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 1.2, gain: 0.25 }); cue(st + ck, 'gulp', { gain: 0.4 }); cue(st + ml, 'alarm', { dur: 0.9, gain: 0.3 }); cue(st + ml, 'thud', { gain: 0.4 });
  }

  // ── 7 · So you plan it like a restaurant chain ─────────────────────────
  {
    const st = cut(6), pl = Wd('plan', 6) - st, rs = Wd('restaurant', 6) - st, ch = Wd('chain', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 720], zoom: 0.08, note: 'whiteboard; THE PLAN pill on "plan"; three restaurant tiles pop in on "restaurant", linked with a dashed line on "chain"',
      draw(lt, d, t) {
        fillAll(C.bg);
        K.whiteboard(540, 720, 960, 900);
        if (lt > pl) K.pill('THE PLAN', 540, 400, 60, C.ink, C.white, E(seg(lt, pl, pl + 0.25)));
        const xs = [240, 540, 840];
        if (lt > ch) { ctx.save(); ctx.setLineDash([20, 18]); line([[240, 920], [lerp(240, 840, clamp((lt - ch) / 0.4)), 920]], BLUE, 12); ctx.restore(); }
        xs.forEach((x, k) => { const a = rs + k * 0.18; if (lt > a) K.kitchenTile(x, 740, 0.85 * E(seg(lt, a, a + 0.25)), t + k, [C.red, BLUE, GREEN][k]); });
        const mk = lt < rs ? [lerp(300, 780, clamp(lt / Math.max(0.3, rs))), 560] : [lerp(240, 840, clamp((lt - ch) / 0.4)), 920];
        K.marker(mk[0], mk[1]);
      } });
    cue(st, 'whoosh'); cue(st + pl, 'pop', { gain: 0.35 }); for (let k = 0; k < 3; k++) cue(st + rs + k * 0.18, 'pop', { gain: 0.35 }); cue(st + ch, 'slide', { dur: 0.4, gain: 0.25 });
  }

  // ── 8 · more cooks in more kitchens ─────────────────────────────────────
  {
    const st = cut(7), mo = Wd('more', 7) - st, ki = Wd('kitchens', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 700], zoom: 0.1, note: '3x2 grid of kitchen tiles pops in (cooks bobbing); each gets a mini server rack beside it on "kitchens"; = MORE SERVERS pill',
      draw(lt, d, t) {
        bg('#DDEFF6');
        for (let k = 0; k < 6; k++) {
          const cx = 210 + (k % 3) * 330, cy = 430 + Math.floor(k / 3) * 400, a = mo + k * 0.12;
          if (lt > a) K.kitchenTile(cx, cy, 0.75 * E(seg(lt, a, a + 0.25)), t + k, PCOLS[k]);
          if (lt > ki + k * 0.05) K.miniRack(cx + 115, cy + 100, 0.8 * E(seg(lt, ki + k * 0.05, ki + k * 0.05 + 0.2)), 1, t, k);
        }
        if (lt > ki) K.pill('= MORE SERVERS', 540, 1160, 60, C.yellow, C.ink, E(seg(lt, ki + 0.2, ki + 0.45)));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 6; k++) cue(st + mo + k * 0.12, 'pop', { gain: 0.25 }); cue(st + ki, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 9 · a host who sends each guest to a free table ─────────────────────
  {
    const st = cut(8), ho = Wd('host', 8) - st, se = Wd('sends', 8) - st, fr = Wd('free', 8) - st;
    const tables = [[260, 640, 'busy'], [800, 640, 'free'], [530, 440, 'busy']];
    add({ id: 'S09', at: st, cam: [540, 760], zoom: 0.08, note: 'host (hero) behind a stand bottom left; guests queue right; on "sends" the first guest walks to the FREE (green) table; HOST = LOAD BALANCER pill',
      draw(lt, d, t) {
        fillAll(C.bg); ctx.fillStyle = C.floor; ctx.fillRect(-300, 560, W + 600, 1400);
        tables.forEach(([x, y, s], k) => K.table(x, y, 0.85, lt > fr - 0.2 ? s : null, E(seg(lt, fr - 0.2 + k * 0.08, fr + k * 0.08))));
        K.personIcon(140, 600, 0.8, C.pink); K.personIcon(410, 400, 0.8, ORANGE);
        const hp = E(seg(lt, ho - 0.25, ho + 0.15));
        K.man({ x: 240, y: 960 + (1 - hp) * 600, s: 0.42, arm: lt > se ? K.ARM.point : K.ARM.down, eyes: 'n', mouth: 'smile', look: 1 });
        K.hostStand(250, 1000, 0.55);
        for (let k = 0; k < 3; k++) {
          let x = 680 + k * 120, y = 1000;
          if (k === 0 && lt > se) { const u = eio(clamp((lt - se) / 1.1)); x = lerp(680, 800, u); y = lerp(1000, 600, u); }
          K.personIcon(x, y, 0.85, [BLUE, GREEN, '#8A63D2'][k]);
        }
        if (lt > ho) K.pill('HOST = LOAD BALANCER', 540, 1180, 50, C.ink, C.white, E(seg(lt, ho + 0.1, ho + 0.35)));
      } });
    cue(st, 'whoosh'); cue(st + ho, 'pop', { gain: 0.35 }); cue(st + se, 'slide', { dur: 1.0, gain: 0.3 }); cue(st + fr, 'sparkle', { dur: 0.4, gain: 0.35 });
  }

  // ── 10 · and popular dishes kept ready to grab ──────────────────────────
  {
    const st = cut(9), po = Wd('popular', 9) - st, re = Wd('ready', 9) - st, gr = Wd('grab', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 700], zoom: 0.08, note: 'heat-lamp shelf; three dishes pop in from "popular"; READY pill on "ready"; middle dish zips down to the guest on "grab" + = CACHE pill',
      draw(lt, d, t) {
        K.kitchen(1180);
        const n = lt < po ? 0 : 3 * clamp((lt - po) / 0.6) + 0.01, grabbed = lt > gr;
        K.readyShelf(540, 640, 1.2, n, t, grabbed ? 1 : -1);
        if (lt > re) K.pill('READY', 540, 270, 64, C.yellow, C.ink, E(seg(lt, re, re + 0.25)));
        K.personIcon(330, 1100, 1.3, BLUE);
        if (grabbed) {
          const u = eo(clamp((lt - gr) / 0.3));
          K.dish(lerp(540, 330, u), lerp(652, 900, u), 0.96, '#5BAE6A', 1, t);
          K.burst(330, 900, 1.6, clamp(1 - (lt - gr) * 3));
          K.pill('= CACHE', 780, 1060, 60, C.ink, C.white, E(seg(lt, gr + 0.1, gr + 0.35)));
        }
      } });
    cue(st, 'whoosh'); cue(st + po, 'pop', { gain: 0.3 }); cue(st + po + 0.2, 'pop', { gain: 0.3 }); cue(st + po + 0.4, 'pop', { gain: 0.3 }); cue(st + re, 'sparkle', { dur: 0.3, gain: 0.3 }); cue(st + gr, 'zip', { gain: 0.4 });
  }

  // ── 11 · That plan is system design ────────────────────────────────────
  {
    const st = cut(10), sy = Wd('system', 10) - st, de = Wd('design', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 720], zoom: 0.1, note: 'blueprint grid; SYSTEM slams on "system", DESIGN (yellow) on "design"; small icons (phone, kitchen, host stand, dish) in the corners',
      draw(lt, d, t) {
        fillAll('#2F67BE');
        ctx.save(); ctx.globalAlpha = 0.18; for (let x = 0; x < W; x += 60) line([[x, -300], [x, H + 300]], C.white, 3); for (let y = -300; y < H + 300; y += 60) line([[-300, y], [W + 300, y]], C.white, 3); ctx.restore();
        K.phone(170, 340, 0.3 * E(seg(lt, 0, 0.2)), chatScreen(t));
        K.kitchenTile(900, 360, 0.55 * E(seg(lt, 0.1, 0.3)), t, C.red);
        K.hostStand(180, 990, 0.45 * E(seg(lt, 0.2, 0.4)));
        K.dish(900, 1080, 0.7 * E(seg(lt, 0.3, 0.5)), ORANGE, 1, t);
        if (lt > sy) bigText('SYSTEM', 540, 650, 190, C.white, -0.04, E(seg(lt, sy, sy + 0.25)));
        if (lt > de) bigText('DESIGN', 540, 860, 190, C.yellow, -0.04, E(seg(lt, de, de + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sy, 'slam', { gain: 0.4 }); cue(st + de, 'slam', { gain: 0.45 });
  }

  // ── 12 · picking the pieces and how they fit together ───────────────────
  {
    const st = cut(11), pk = Wd('picking', 11) - st, fi = Wd('fit', 11) - st, tg = Wd('together', 11) - st;
    const P = [[180, 420], [540, 420], [890, 420], [540, 860]];
    add({ id: 'S12', at: st, cam: [540, 640], zoom: 0.08, note: 'pieces pop in one by one from "picking": app, host, servers, cache; dashed links draw on "fit"; green check on "together"',
      draw(lt, d, t) {
        bg('#DDEFF6');
        const sc = (k) => E(seg(lt, pk + k * 0.2, pk + k * 0.2 + 0.25));
        if (lt > fi) {
          const p = clamp((lt - fi) / 0.5);
          ctx.save(); ctx.setLineDash([22, 16]);
          line([[P[0][0] + 80, P[0][1]], [lerp(P[0][0] + 80, P[1][0] - 120, clamp(p * 3)), P[0][1]]], C.ink, 10);
          if (p > 0.33) line([[P[1][0] + 120, P[1][1]], [lerp(P[1][0] + 120, P[2][0] - 120, clamp(p * 3 - 1)), P[1][1]]], C.ink, 10);
          if (p > 0.66) line([[P[2][0] - 60, P[2][1] + 230], [lerp(P[2][0] - 60, P[3][0] + 130, clamp(p * 3 - 2)), lerp(P[2][1] + 230, P[3][1] - 40, clamp(p * 3 - 2))]], C.ink, 10);
          ctx.restore();
        }
        K.phone(P[0][0], P[0][1], 0.3 * sc(0), chatScreen(t));
        K.hostStand(P[1][0], P[1][1] - 110, 0.5 * sc(1));
        K.kitchenTile(P[2][0], P[2][1], 0.62 * sc(2), t, C.red);
        K.dish(P[3][0], P[3][1], 0.9 * sc(3), ORANGE, 1, t);
        [['APP', 0], ['HOST', 1], ['SERVERS', 2], ['CACHE', 3]].forEach(([s, k]) => { const [x, y] = P[k]; K.pill(s, x, k === 3 ? y + 110 : y + 190, 42, C.ink, C.white, sc(k)); });
        if (lt > tg) K.check(860, 900, 0.55 * E(seg(lt, tg, tg + 0.25)));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 4; k++) cue(st + pk + k * 0.2, 'pop', { gain: 0.3 }); cue(st + fi, 'slide', { dur: 0.5, gain: 0.25 }); cue(st + tg, 'sparkle', { dur: 0.4, gain: 0.35 });
  }

  // ── 13 · so the app stays fast when the whole world shows up ───────────
  {
    const st = cut(12), fa = Wd('fast', 12) - st, wo = Wd('whole', 12) - st, sh = Wd('shows', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 760], zoom: 0.12, note: 'hero with phone, calm; STILL FAST pill + speed lines on "fast"; globe grows behind on "whole"; crowd pops in top and bottom on "shows up"',
      draw(lt, d, t) {
        bg();
        if (lt > wo) K.globe(540, 640, 2.6 * E(seg(lt, wo - 0.1, wo + 0.3)), t);
        const n = Math.floor(clamp((lt - sh) / 0.6) * 14);
        for (let k = 0; k < n; k++) { const x = 90 + (k % 7) * 150, y = k < 7 ? 250 : 1140; K.personIcon(x, y, 0.75 * E(seg(lt, sh + k * 0.04, sh + k * 0.04 + 0.2)), PCOLS[k % 6]); }
        K.man({ x: 540, y: 880, s: 0.6, arm: K.PHONE_ARM, holding: heldPhone(chatScreen(t)), eyes: 'n', mouth: lt > fa ? 'grin' : 'smile', brow: 0.4, look: 0.5 });
        if (lt > fa) { K.speedLines(540, 620, clamp(1 - (lt - fa) * 1.5)); K.pill('STILL FAST', 840, 450, 52, GREEN, C.white, E(seg(lt, fa, fa + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + fa, 'zip', { gain: 0.4 }); cue(st + wo, 'pop', { gain: 0.35 }); cue(st + sh, 'sparkle', { dur: 0.6, gain: 0.3 });
  }

  // ── 14 · That's day one. Tomorrow: client versus server. ──────────────
  {
    const st = cut(13), on = Wd('one', 13) - st, tm = Wd('tomorrow', 13) - st, cl = Wd('client', 13) - st, sv = Wd('server', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 700], zoom: 0.03, note: 'cook winks at camera with DAY 1 / 30 pill on "one"; on "tomorrow" he ducks lower; phone (CLIENT) and server (SERVER) slide in with VS between',
      draw(lt, d, t) {
        K.room();
        const tmP = E(seg(lt, tm - 0.1, tm + 0.3));
        if (tmP > 0) { ctx.save(); ctx.globalAlpha = clamp(tmP); bg(); ctx.restore(); }
        cook({ x: 540, y: lerp(1150, 2700, tmP), s: 0.95, arm: K.ARM.point, finger: Math.sin(lt * 9) * 0.25, eyes: lt > on && lt < tm ? 'wink' : 'n', mouth: 'smirk', smirk: true, brow: 0.6 });
        if (lt > on) K.pill('DAY 1 / 30', 540, 200, 70, C.yellow, C.ink, E(seg(lt, on, on + 0.25)));
        if (lt > tm + 0.1) { K.phone(lerp(-200, 250, eo(seg(lt, tm + 0.1, tm + 0.4))), 640, 0.42, chatScreen(t)); K.pill('CLIENT', 250, 900, 50, C.ink, C.white, E(seg(lt, cl, cl + 0.25))); }
        if (lt > cl + 0.15) bigText('VS', 540, 640, 130, C.red, -0.08, E(seg(lt, cl + 0.15, cl + 0.4)));
        if (lt > sv - 0.15) { K.server(lerp(1300, 820, eo(seg(lt, sv - 0.15, sv + 0.15))), 640, 0.55, t); K.pill('SERVER', 820, 900, 50, C.ink, C.white, E(seg(lt, sv, sv + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + on, 'pop', { gain: 0.4 }); cue(st + tm, 'slide', { dur: 0.4, gain: 0.3 }); cue(st + tm + 0.1, 'whoosh', { gain: 0.3 }); cue(st + cl, 'pop', { gain: 0.35 }); cue(st + sv, 'slam', { gain: 0.35 });
  }

  return { shots: S, cues: CUES };
}
