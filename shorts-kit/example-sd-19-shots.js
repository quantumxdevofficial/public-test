// (19/30) WHAT IS AN API GATEWAY: the shot list. Analogy: a hotel front desk.
// Your app is now ten small services, so which one does your phone call? A big hotel: you don't wander the halls looking
// for the chef, you ask the front desk. That's an API gateway: one front door for every service. The phone sends every
// request there, and it passes each one to the right service. It checks your ID and turns away anyone knocking too often.
// Twist: if that one door breaks nobody gets in, so big apps run several copies. Loop: one door in, many rooms behind it.
// Tease: rate limiting.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const GREEN = '#5BAE6A', BLUE = '#3A7BD5', ORANGE = '#F29A3A', PURPLE = '#8A63D2';
const MCOL = [C.yellow, GREEN, ORANGE, C.pink, BLUE, PURPLE];
const bg = (ring = '#CFE8F3', base = C.sky) => { fillAll(base); circle(540, 740, 560, ring); };
const warm = () => bg('#F7E3C8', C.bg);
const SVC = [['USERS', BLUE], ['CART', ORANGE], ['PAY', GREEN], ['SEARCH', PURPLE], ['CHAT', C.pink], ['MAPS', GREEN], ['FEED', ORANGE], ['ORDERS', C.red], ['MAIL', BLUE], ['PHOTOS', PURPLE]];
const qmark = (x, y, s, a, col = C.red) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.fillStyle = col; ctx.font = `900 ${Math.max(1, 120 * s)}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?', x, y); ctx.restore(); };
const ON = [1, 1, 1];

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const at = (w, i) => Wd(w, i);

  // ── 1 · Your app is now ten small services, ──
  {
    const st = cut(0), ap = at('app', 0) - st, te = at('ten', 0) - st, sv = at('services', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 760], zoom: 0.08, note: 'DAY 19 / 30; one navy block on "app"; on "ten" it bursts into ten service boxes (5x2); 10 SERVICES pill on "services"',
      draw(lt, d, t) {
        bg();
        K.pill('DAY 19 / 30', 540, 170, 64, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        if (lt < te) K.splitBlock(540, 780, 1.0 * E(seg(lt, ap - 0.2, ap + 0.1)), 0, t);
        SVC.forEach(([lab, col], k) => { const c = k % 5, r = Math.floor(k / 5); K.serviceBox(140 + c * 200, 640 + r * 380, 0.55, lab, col, t + k, null, E(seg(lt, te - 0.1 + k * 0.035, te + 0.2 + k * 0.035))); });
        if (lt > sv) K.pill('10 SERVICES', 540, 340, 72, C.ink, C.white, E(seg(lt, sv, sv + 0.25)));
      } });
    cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + ap, 'thud', { gain: 0.3 }); cue(st + te, 'sparkle', { dur: 0.5, gain: 0.25 }); cue(st + sv, 'pop', { gain: 0.3 });
  }

  // ── 2 · so which one does your phone actually call? ──
  {
    const st = cut(1), wh = at('which', 1) - st, ph = at('phone', 1) - st, ca = at('call', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 760], zoom: 0.1, note: 'row of 5 services on top; phone rises bottom centre on "phone"; dashed arcs to every box flicker; red ?s; CALL WHO? pill on "call"',
      draw(lt, d, t) {
        warm();
        for (let k = 0; k < 5; k++) { K.serviceBox(140 + k * 200, 400, 0.5, SVC[k][0], SVC[k][1], t + k); if (lt > wh) qmark(140 + k * 200, 250, 0.55, seg(lt, wh + k * 0.06, wh + 0.2 + k * 0.06)); }
        const py = lerp(2300, 930, eo(seg(lt, ph - 0.35, ph + 0.15)));
        if (lt > ph) for (let k = 0; k < 5; k++) K.dashArc(540, 760, 140 + k * 200, 500, 40, eo(seg(lt, ph + k * 0.05, ph + 0.3 + k * 0.05)), C.ink, 7, 0.25 + 0.3 * Math.abs(Math.sin(t * 6 + k)));
        K.phone(540, py, 0.42, () => K.homeScreen());
        if (lt > ca) K.pill('CALL WHO?', 540, 1150, 66, C.red, C.white, E(seg(lt, ca, ca + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + wh, 'pop', { gain: 0.2 }); cue(st + ph - 0.2, 'slide', { dur: 0.4, gain: 0.2 }); cue(st + ca, 'boing', { gain: 0.25 });
  }

  // ── 3 · Think of a big hotel. ──
  {
    const st = cut(2), ho = at('hotel', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 700], zoom: 0.12, note: 'hotel building springs up from below; rooms light up; BIG HOTEL pill on "hotel"',
      draw(lt, d, t) {
        warm();
        K.hotel(540, lerp(1500, 760, eob(seg(lt, 0.05, 0.5))), 1.05, t, lt > ho ? (lt - ho) * 14 : 0, 0);
        if (lt > ho) K.pill('BIG HOTEL', 540, 1190, 70, C.yellow, C.ink, E(seg(lt, ho, ho + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.35, 'thud', { gain: 0.3 }); cue(st + ho, 'sparkle', { dur: 0.6, gain: 0.22 });
  }

  // ── 4 · You don't wander the halls looking for the chef, ──
  {
    const st = cut(3), wa = at('wander', 3) - st, ha = at('halls', 3) - st, ch = at('chef', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 760], zoom: 0.08, note: 'hotel corridor with rooms 101-104; a lost guest wanders left/right with a ?; on "chef" a CHEF? bubble; red X slams near end',
      draw(lt, d, t) {
        warm();
        K.hallway(540, 760, 1, 1);
        const gx = 540 + Math.sin(lt * 2.6) * 330, gy = 1000 + Math.abs(Math.sin(lt * 10)) * -10;
        K.personIcon(gx, gy, 1.6, C.red, lt > wa ? 1 : 0, false);
        if (lt > ha) K.pill('LOST IN THE HALLS', 540, 300, 60, C.ink, C.white, E(seg(lt, ha, ha + 0.25)));
        if (lt > ch) K.bubble(gx, 760, 1, 'CHEF?', E(seg(lt, ch, ch + 0.25)), 1);
        if (lt > d - 0.45) K.redX(540, 760, lerp(1.4, 0.8, eo(seg(lt, d - 0.45, d - 0.3))), 0.95);
      } });
    cue(st, 'whoosh'); cue(st + wa, 'slide', { dur: 0.8, gain: 0.15 }); cue(st + ha, 'pop', { gain: 0.25 }); cue(st + ch, 'pop', { gain: 0.3 }); cue(st + T.dur * 0 + (L(4) - 0.08 - st) - 0.45, 'slam', { gain: 0.3 });
  }

  // ── 5 · you just ask the front desk. ──
  {
    const st = cut(4), as = at('ask', 4) - st, fr = at('front', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 820], zoom: 0.1, note: 'front desk with receptionist; guest walks in from the left; CHEF? bubble on "ask"; bell dings + ASK ONE PLACE pill on "front"; receptionist points: KITCHEN →',
      draw(lt, d, t) {
        warm();
        K.frontDesk(620, 820, 1.05, t, seg(lt, fr, fr + 0.5), seg(lt, fr + 0.2, fr + 0.5));
        const gx = lerp(-150, 160, eo(seg(lt, 0, as)));
        K.personIcon(gx, 1110, 1.7, C.red);
        if (lt > as) K.bubble(190, 760, 0.95, 'CHEF?', E(seg(lt, as, as + 0.25)), 1);
        if (lt > fr + 0.3) K.pill('KITCHEN →', 830, 380, 56, GREEN, C.white, E(seg(lt, fr + 0.3, fr + 0.55)));
        if (lt > fr) K.pill('ASK ONE PLACE', 540, 230, 62, C.yellow, C.ink, E(seg(lt, fr, fr + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + as, 'pop', { gain: 0.3 }); cue(st + fr, 'sparkle', { dur: 0.4, gain: 0.3 }); cue(st + fr + 0.3, 'pop', { gain: 0.25 });
  }

  // ── 6 · That's an API gateway, ──
  {
    const st = cut(5), ap = at('api', 5) - st, ga = at('gateway', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 700], zoom: 0.12, note: 'the gate drops in; A-P-I letters light one by one on "API"; burst + API GATEWAY pill on "gateway"',
      draw(lt, d, t) {
        bg();
        const l = (k) => clamp((lt - ap - k * 0.1) * 6);
        K.gateway(540, lerp(-300, 820, eob(seg(lt, 0, 0.35))), 1.15, [l(0), l(1), l(2)]);
        if (lt > ga && lt < ga + 0.6) K.burst(540, 500, 3.6, clamp(1 - (lt - ga) * 1.8));
        if (lt > ga) K.pill('API GATEWAY', 540, 1190, 80, C.yellow, C.ink, lerp(1.5, 1, eo(seg(lt, ga, ga + 0.2))));
      } });
    cue(st, 'whoosh'); cue(st + 0.3, 'thud', { gain: 0.35 }); cue(st + ap, 'pop', { gain: 0.25 }); cue(st + ap + 0.1, 'pop', { gain: 0.25 }); cue(st + ap + 0.2, 'pop', { gain: 0.25 }); cue(st + ga, 'slam', { gain: 0.35 });
  }

  // ── 7 · one front door for every service. ──
  {
    const st = cut(6), fr = at('front', 6) - st, ev = at('every', 6) - st, sv = at('service', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 760], zoom: 0.08, note: 'gate left-centre; services stacked on the right; ONE FRONT DOOR pill on "front"; on "every" dashed lines from gate to each service',
      draw(lt, d, t) {
        warm();
        const ys = [420, 660, 900, 1140];
        ys.forEach((y, k) => { if (lt > ev) K.dashArc(420, 780, 830, y - 20, 20, eo(seg(lt, ev + k * 0.08, ev + 0.35 + k * 0.08)), C.ink, 8, 0.5); });
        K.gateway(300, 860, 0.62, ON);
        ys.forEach((y, k) => K.serviceBox(880, y - 20, 0.45, SVC[k + 5][0], SVC[k + 5][1], t + k, null, E(seg(lt, 0.05 + k * 0.08, 0.3 + k * 0.08))));
        if (lt > fr) K.pill('ONE FRONT DOOR', 330, 330, 54, C.yellow, C.ink, E(seg(lt, fr, fr + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + fr, 'pop', { gain: 0.3 }); cue(st + ev, 'slide', { dur: 0.5, gain: 0.2 }); cue(st + sv, 'pop', { gain: 0.2 });
  }

  // ── 8 · Your phone sends every request there, ──
  {
    const st = cut(7), ph = at('phone', 7) - st, re = at('request', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 760], zoom: 0.1, note: 'phone left, gate right; on "request" a stream of coloured message cards flies from phone into the gate; EVERY REQUEST pill',
      draw(lt, d, t) {
        bg();
        const ps = 0.5 * E(seg(lt, ph - 0.25, ph + 0.05));
        if (ps > 0) K.phone(230, 780, ps, () => K.homeScreen());
        K.gateway(780, 860, 0.62, ON);
        if (lt > re) for (let k = 0; k < 4; k++) { const g = ((lt - re) * 1.3 + k * 0.25) % 1, [x, y] = K.arcAt(330, 700, 760, 640, 110, eio(g)); K.msgCard(x, y, 0.6, MCOL[k], null, 0, clamp((lt - re - k * 0.15) * 5)); }
        if (lt > re) K.pill('EVERY REQUEST', 540, 300, 62, C.ink, C.white, E(seg(lt, re, re + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ph, 'pop', { gain: 0.3 }); cue(st + re, 'slide', { dur: 1.0, gain: 0.2 });
  }

  // ── 9 · and it passes each one to the right service. ──
  {
    const st = cut(8), pa = at('passes', 8) - st, ri = at('right', 8) - st;
    const R = [[880, 430, 'ORDERS', C.red], [880, 760, 'PAY', GREEN], [880, 1090, 'USERS', BLUE]];
    add({ id: 'S09', at: st, cam: [540, 760], zoom: 0.08, note: 'gate left, ORDERS/PAY/USERS on the right; on "passes" a red card goes to ORDERS, green to PAY, blue to USERS; ticks on "right"',
      draw(lt, d, t) {
        warm();
        K.gateway(250, 860, 0.6, ON);
        R.forEach(([x, y, lab, col], k) => {
          const s0 = pa + k * 0.3, g = eio(seg(lt, s0, s0 + 0.55));
          K.serviceBox(x, y - 30, 0.66, lab, col, t + k, lt > ri + k * 0.12 ? 'ok' : null);
          if (lt > s0 && g < 1) { const [px, py] = K.arcAt(330, 700, 740, y - 30, 60, g); K.msgCard(px, py, 0.75, col); }
        });
        if (lt > ri) K.pill('RIGHT PLACE', 300, 330, 60, GREEN, C.white, E(seg(lt, ri, ri + 0.25)));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 3; k++) cue(st + pa + k * 0.3, 'slide', { dur: 0.5, gain: 0.15 }); cue(st + ri, 'pop', { gain: 0.3 });
  }

  // ── 10 · It also checks your ID first, ──
  {
    const st = cut(9), ch = at('checks', 9) - st, id = at('id', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 760], zoom: 0.12, note: 'big ID card slides in; on "checks" a cyan scan bar sweeps over it; green tick + ID OK pill on "ID"',
      draw(lt, d, t) {
        bg();
        K.idBadge(540, 760, 1.5, seg(lt, id, id + 0.25), 1, lerp(-0.25, -0.04, eo(seg(lt, 0, 0.4))));
        if (lt > ch && lt < id + 0.2) { const g = ((lt - ch) * 1.6) % 1, y = lerp(560, 960, Math.abs(Math.sin(g * Math.PI))); ctx.save(); ctx.globalAlpha = 0.85; rr(200, y - 10, 680, 20, 10); ctx.fillStyle = C.cyan; ctx.fill(); ctx.restore(); }
        if (lt > ch && lt < id) K.pill('CHECKING…', 540, 300, 62, C.ink, C.white, E(seg(lt, ch, ch + 0.25)));
        if (lt > id) K.pill('ID OK', 540, 300, 76, GREEN, C.white, E(seg(lt, id, id + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 0.3, gain: 0.2 }); cue(st + ch, 'sparkle', { dur: 0.6, gain: 0.18 }); cue(st + id, 'pop', { gain: 0.35 });
  }

  // ── 11 · and turns away anyone knocking too often. ──
  {
    const st = cut(10), aw = at('away', 10) - st, kn = at('knocking', 10) - st, of = at('often', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 800], zoom: 0.1, note: 'gate left-centre; a red guy right of it knocking (count badge climbs 1..9); on "often" TOO MANY! red pill, he slides back right; small red X',
      draw(lt, d, t) {
        warm();
        K.gateway(400, 880, 0.62, ON);
        const n = lt > kn ? Math.min(9, 1 + Math.floor((lt - kn) * 9)) : 0, back = eo(seg(lt, of + 0.1, of + 0.5));
        const gx = lerp(720, 950, back);
        K.personIcon(gx, 1100, 1.6, C.red, 0);
        if (lt > kn && lt < of + 0.1) K.knockLines(gx - 110, 950 + Math.sin(lt * 30) * 6, 1.2, 0.5 + 0.5 * Math.abs(Math.sin(lt * 18)));
        if (n > 0) K.countBadge(gx + 60, 860, 54, n, C.red, E(seg(lt, kn, kn + 0.2)));
        if (lt > aw && lt < of) K.pill('KNOCK KNOCK…', 540, 330, 58, C.ink, C.white, E(seg(lt, aw, aw + 0.25)));
        if (lt > of) { K.pill('TOO MANY!', 540, 330, 76, C.red, C.white, E(seg(lt, of, of + 0.25))); K.redX(gx, 1000, lerp(0.9, 0.5, eo(seg(lt, of, of + 0.2))), 1); }
      } });
    cue(st, 'whoosh'); cue(st + aw, 'pop', { gain: 0.2 }); for (let k = 0; k < 6; k++) cue(st + kn + k * 0.14, 'tock', { gain: 0.2 }); cue(st + of, 'slam', { gain: 0.35 });
  }

  // ── 12 · But if that one door breaks, nobody gets in, ──
  {
    const st = cut(11), dr = at('door', 11) - st, br = at('breaks', 11) - st, no = at('nobody', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 760], zoom: 0.14, note: 'gate centre with services on top row; on "breaks" the gate goes grey with crack + sparks, services go down, warning; on "nobody" users below with ?s and NOBODY GETS IN pill',
      draw(lt, d, t) {
        bg();
        const dn = lt > br ? 1 : 0;
        for (let k = 0; k < 3; k++) K.serviceBox(240 + k * 300, 330, 0.42, SVC[k][0], SVC[k][1], t + k, dn ? 'down' : null);
        K.gateway(540, 860 + (dn ? Math.sin(lt * 40) * 5 : 0), 0.62, ON, 1, dn, t);
        if (lt > dr && lt < br) K.pill('ONE DOOR', 540, 1180, 56, C.ink, C.white, E(seg(lt, dr, dr + 0.25)));
        if (lt > br) K.warning(870, 640, 0.45 * E(seg(lt, br, br + 0.25)));
        if (lt > no) for (let j = 0; j < 4; j++) K.personIcon(150 + j * 260, 1170, 1.0 * E(seg(lt, no - 0.1 + j * 0.05, no + 0.15 + j * 0.05)), MCOL[j + 1], 1);
        if (lt > no) K.pill('NOBODY GETS IN', 540, 560, 60, C.red, C.white, E(seg(lt, no, no + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + dr, 'pop', { gain: 0.2 }); cue(st + br, 'slam', { gain: 0.4 }); cue(st + br + 0.1, 'sizzle', { dur: 0.6, gain: 0.18 }); cue(st + no, 'alarm', { dur: 0.8, gain: 0.15 });
  }

  // ── 13 · so big apps run several copies of it. ──
  {
    const st = cut(12), se = at('several', 12) - st, co = at('copies', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 760], zoom: 0.1, note: 'one broken gate in the middle; on "several" two working gates pop in left and right; on "copies" cards flow up through the working ones; 3 COPIES pill',
      draw(lt, d, t) {
        warm();
        const X = [200, 540, 880];
        X.forEach((x, k) => { const sc = k === 1 ? 1 : E(seg(lt, se + (k ? 0.1 : 0), se + 0.3 + (k ? 0.1 : 0))); K.gateway(x, 860, 0.44, ON, sc, k === 1 ? 1 : 0, t); });
        if (lt > co) for (const k of [0, 2]) for (let j = 0; j < 2; j++) { const g = ((lt - co) * 1.2 + j * 0.5) % 1; K.msgCard(X[k], lerp(1200, 620, g), 0.5, MCOL[k + j + 1]); }
        if (lt > co) K.pill('3 COPIES', 540, 330, 76, C.yellow, C.ink, E(seg(lt, co, co + 0.25)));
        else if (lt > se) K.pill('SEVERAL', 540, 330, 66, C.ink, C.white, E(seg(lt, se, se + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + se, 'pop', { gain: 0.3 }); cue(st + se + 0.1, 'pop', { gain: 0.3 }); cue(st + co, 'slide', { dur: 0.8, gain: 0.18 });
  }

  // ── 14 · One door in, many rooms behind it. ──
  {
    const st = cut(13), dr = at('door', 13) - st, ma = at('many', 13) - st, it = at('it', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 720], zoom: 0.1, note: 'hotel; front door glows yellow on "door" + 1 DOOR pill; on "many" all room windows light up + MANY ROOMS pill; happy guest gets a tick on "it"',
      draw(lt, d, t) {
        bg();
        K.hotel(540, 640, 0.82, t, lt > ma ? (lt - ma) * 22 : 0, seg(lt, dr, dr + 0.25));
        if (lt > dr) K.pill('1 DOOR', 220, 1110, 50, C.yellow, C.ink, E(seg(lt, dr, dr + 0.25)));
        if (lt > ma) K.pill('MANY ROOMS', 845, 1110, 44, C.ink, C.white, E(seg(lt, ma, ma + 0.25)));
        K.personIcon(540, 1150, 1.4, BLUE, lt > it ? 1 : 0, true);
      } });
    cue(st, 'whoosh'); cue(st + dr, 'pop', { gain: 0.3 }); cue(st + ma, 'sparkle', { dur: 0.6, gain: 0.25 }); cue(st + it, 'pop', { gain: 0.25 });
  }

  // ── 15 · Tomorrow: rate limiting. ──
  {
    const st = cut(14), to = at('tomorrow', 14) - st, ra = at('rate', 14) - st, li = at('limiting', 14) - st;
    add({ id: 'S15', at: st, cam: [540, 700], zoom: 0.03, note: 'DAY 19 / 30; NEXT: RATE LIMITING pill; gate with request cards piling up on its right; on "limiting" red 429 TOO MANY pill',
      draw(lt, d, t) {
        bg();
        K.pill('DAY 19 / 30', 540, 170, 64, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        if (lt > to) K.pill('NEXT: RATE LIMITING', 540, 310, 56, C.ink, C.white, E(seg(lt, to, to + 0.25)));
        K.gateway(540, 880, 0.7, ON, E(seg(lt, 0.05, 0.35)));
        if (lt > ra) for (let k = 0; k < 6; k++) { const g = clamp((lt - ra - k * 0.08) * 3); K.msgCard(lerp(1150, 860 + (k % 2) * 60, eo(g)), 980 - k * 70, 0.55, MCOL[k], null, (k % 2 ? 0.2 : -0.2)); }
        if (lt > li) K.pill('429 TOO MANY', 540, 1170, 60, C.red, C.white, lerp(1.4, 1, eo(seg(lt, li, li + 0.2))));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + to, 'pop', { gain: 0.3 }); cue(st + ra, 'slide', { dur: 0.5, gain: 0.2 }); cue(st + li, 'slam', { gain: 0.3 });
  }

  return { shots: S, cues: CUES };
}
