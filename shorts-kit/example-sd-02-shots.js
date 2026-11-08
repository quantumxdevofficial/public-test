// (2/30) CLIENT VS SERVER: the shot list. Restaurant analogy: guest at the table = client (asks), kitchen = server
// (keeps the ingredients, cooks, sends the dish back). Phone = client sends a request, server sends a response.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const GREEN = '#5BAE6A', BLUE = '#3A7BD5', ORANGE = '#F29A3A';
const PCOLS = [BLUE, C.pink, GREEN, ORANGE, '#8A63D2', C.red];
const bg = (ring = '#CFE8F3', base = C.sky) => { fillAll(base); circle(540, 740, 560, ring); };
const heldPhone = (screen) => (x, y) => K.phone(x + 12, y - 70, 0.3, screen);
const cook = (o) => { K.man(o); K.chefHat(o.x, o.y, o.s, o.hat ?? 1); };
const diner = () => { fillAll(C.bg); ctx.fillStyle = C.floor; ctx.fillRect(-300, 900, W + 600, 1400); };
const MENU = ['SOUP', 'PASTA', 'PIZZA'];

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · When you open an app, who does the work ──
  {
    const st = cut(0), op = Wd('open', 0) - st, wk = Wd('work', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 700], zoom: 0.08, note: 'hero holding a phone; tap ripple on "open"; big ? + spinning gear above him on "work"',
      draw(lt, d, t) {
        bg();
        K.man({ x: 540, y: 1000, s: 0.75, arm: K.PHONE_ARM, holding: heldPhone(() => (lt > op + 0.2 ? K.feedScreen(0, t) : K.homeScreen())), eyes: 'n', mouth: lt > wk ? 'o' : 'smile', brow: lt > wk ? 0.9 : 0.4, look: 0.5 });
        if (lt > op) K.ripple(605, 870, clamp((lt - op) / 0.5));
        if (lt > wk) { K.gear(330, 330, 0.75 * E(seg(lt, wk, wk + 0.25)), t * 2); bigText('?', 760, 330, 260, C.yellow, 0.12, E(seg(lt, wk + 0.05, wk + 0.3))); }
      } });
    cue(st + op, 'pop', { gain: 0.4 }); cue(st + wk, 'boing', { gain: 0.35 });
  }

  // ── 2 · your phone, or a computer far away? ──
  {
    const st = cut(1), ph = Wd('phone', 1) - st, co = Wd('computer', 1) - st, aw = Wd('away', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 760], zoom: 0.08, note: 'phone pops left on "phone"; server pops right on "computer"; on "away" the server shrinks into the distance over hills, dotted route; ? pills under both',
      draw(lt, d, t) {
        fillAll(C.sky); ctx.fillStyle = '#A9D69B'; ctx.beginPath(); ctx.ellipse(800, 1250, 700, 360, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = GREEN; ctx.beginPath(); ctx.ellipse(160, 1350, 700, 380, 0, 0, Math.PI * 2); ctx.fill();
        const far = eio(seg(lt, aw - 0.1, aw + 0.5));
        if (lt > co) { K.route(330, 640, lerp(800, 800, far), lerp(640, 440, far), 200, 0, 1); K.server(lerp(800, 800, far), lerp(760, 500, far), lerp(0.75, 0.32, far) * E(seg(lt, co, co + 0.25)), t); }
        K.phone(250, 800, 0.6 * E(seg(lt, 0, 0.25)), K.homeScreen);
        if (lt > ph) K.pill('PHONE?', 250, 1160, 58, C.yellow, C.ink, E(seg(lt, ph + 0.1, ph + 0.35)));
        if (lt > aw) K.pill('FAR AWAY?', 780, 650, 54, C.ink, C.white, E(seg(lt, aw + 0.2, aw + 0.45)));
      } });
    cue(st, 'whoosh'); cue(st + ph, 'pop', { gain: 0.4 }); cue(st + co, 'pop', { gain: 0.4 }); cue(st + aw, 'zip', { gain: 0.35 });
  }

  // ── 3 · Think of a restaurant ──
  {
    const st = cut(2), rs = Wd('restaurant', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 760], zoom: 0.1, note: 'restaurant front: awning + door, sign RESTAURANT drops on "restaurant", tables pop in front',
      draw(lt, d, t) {
        fillAll(C.sky); ctx.fillStyle = C.floor; ctx.fillRect(-300, 1060, W + 600, 1000);
        rr(140, 420, 800, 640, 0); ctx.fillStyle = '#F7E3C8'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
        for (let k = 0; k < 8; k++) { ctx.fillStyle = k % 2 ? C.white : C.red; ctx.beginPath(); ctx.moveTo(120 + k * 105, 420); ctx.lineTo(225 + k * 105, 420); ctx.lineTo(225 + k * 105, 520); ctx.arc(172 + k * 105, 520, 52, 0, Math.PI); ctx.fill(); }
        rr(450, 760, 180, 300, [90, 90, 0, 0]); ctx.fillStyle = '#A65C38'; ctx.fill(); circle(600, 920, 10, C.yellow);
        rr(200, 640, 180, 150, 10); ctx.fillStyle = '#BFE3F2'; ctx.fill(); ctx.stroke(); rr(700, 640, 180, 150, 10); ctx.fill(); ctx.stroke();
        const sg = E(seg(lt, rs - 0.1, rs + 0.25));
        if (sg > 0) K.pill('RESTAURANT', 540, lerp(-100, 330, sg), 76, C.ink, C.yellow);
        if (lt > rs) { K.table(220, 1140, 0.7 * E(seg(lt, rs + 0.15, rs + 0.4))); K.table(860, 1140, 0.7 * E(seg(lt, rs + 0.25, rs + 0.5))); }
      } });
    cue(st, 'whoosh'); cue(st + rs, 'thud', { gain: 0.4 }); cue(st + rs + 0.2, 'pop', { gain: 0.3 });
  }

  // ── 4 · You're the guest at the table, so you're the client ──
  {
    const st = cut(3), gu = Wd('guest', 3) - st, tb = Wd('table', 3) - st, cl = Wd('client', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 760], zoom: 0.1, note: 'hero sits at a table (GUEST arrow on "guest"); table slides up on "table"; YOU = CLIENT pill slams on "client"',
      draw(lt, d, t) {
        diner();
        K.man({ x: 540, y: 880, s: 0.7, arm: K.ARM.down, eyes: 'n', mouth: 'smile', brow: 0.4, look: 0.3 });
        K.table(540, lerp(1500, 1040, eo(seg(lt, 0, 0.3))), 1.5 * (lt > tb ? 1 + 0.08 * Math.sin(Math.PI * clamp((lt - tb) / 0.3)) : 1));
        if (lt > gu) K.tag('GUEST', 860, 420, 680, 520, 54, E(seg(lt, gu, gu + 0.25)));
        if (lt > cl) K.pill('YOU = CLIENT', 540, 220, 72, C.yellow, C.ink, E(seg(lt, cl, cl + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + gu, 'pop', { gain: 0.35 }); cue(st + 0.05, 'slide', { dur: 0.3, gain: 0.25 }); cue(st + tb, 'thud', { gain: 0.3 }); cue(st + cl, 'slam', { gain: 0.4 });
  }

  // ── 5 · you read the menu and ask for what you want ──
  {
    const st = cut(4), mn = Wd('menu', 4) - st, as = Wd('ask', 4) - st, wa = Wd('want', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 700], zoom: 0.08, note: 'menu card slides up on "menu"; PASTA row highlights on "ask"; speech bubble "PASTA, PLEASE!" on "want"',
      draw(lt, d, t) {
        diner();
        K.man({ x: 260, y: 1000, s: 0.62, arm: K.armPose(K.ARM.down, K.ARM.point, E(seg(lt, as - 0.1, as + 0.2))), eyes: 'n', mouth: lt > wa ? 'grin' : 'smile', brow: 0.5, look: 1 });
        K.menuCard(740, lerp(1700, 700, eo(seg(lt, 0, 0.35))), 0.85, MENU, 1, E(seg(lt, as, as + 0.3)), 0);
        if (lt > wa) K.bubble(330, 300, 1, 'PASTA, PLEASE!', E(seg(lt, wa, wa + 0.25)), -1);
      } });
    cue(st, 'whoosh'); cue(st + 0.02, 'slide', { dur: 0.35, gain: 0.25 }); cue(st + as, 'pop', { gain: 0.35 }); cue(st + wa, 'pop', { gain: 0.4 });
  }

  // ── 6 · The kitchen is the server ──
  {
    const st = cut(5), ki = Wd('kitchen', 5) - st, sv = Wd('server', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.1, note: 'kitchen: cook by the stove pops on "kitchen"; small server rack drops beside him + KITCHEN = SERVER pill on "server"',
      draw(lt, d, t) {
        K.kitchen(1180);
        K.stove(760, 1000, 0.75, t, 1);
        cook({ x: 380, y: 1060, s: 0.8, arm: K.ARM.hip, eyes: 'n', mouth: 'smile', brow: 0.3, look: 0.4, hat: E(seg(lt, ki - 0.1, ki + 0.2)) });
        if (lt > sv) { K.server(860, lerp(-200, 470, eob(seg(lt, sv - 0.1, sv + 0.25))), 0.45, t); K.pill('KITCHEN = SERVER', 540, 200, 64, C.ink, C.white, E(seg(lt, sv + 0.1, sv + 0.35))); }
      } });
    cue(st, 'whoosh'); cue(st + ki, 'boing', { gain: 0.35 }); cue(st + sv, 'thud', { gain: 0.4 }); cue(st + sv + 0.1, 'pop', { gain: 0.35 });
  }

  // ── 7 · it keeps the ingredients, does the cooking ──
  {
    const st = cut(6), ig = Wd('ingredients', 6) - st, co = Wd('cooking', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 700], zoom: 0.08, note: 'pantry shelves fill with ingredients from "keeps"/"ingredients"; on "cooking" the stove flares and the cook stirs (dish steams)',
      draw(lt, d, t) {
        K.kitchen(1180);
        K.pantry(270, 720, 0.8, lt < ig - 0.3 ? 0 : clamp((lt - ig + 0.3) / 0.6) * 8);
        const ckP = lt > co ? 1 : 0.2;
        K.stove(760, 1000, 0.8, t, ckP);
        cook({ x: 640, y: 1080, s: 0.7, arm: lt > co ? K.armPose(K.ARM.point, K.ARM.hip, 0.5 + 0.5 * Math.sin(lt * 10)) : K.ARM.hip, eyes: lt > co ? 'closed' : 'n', mouth: lt > co ? 'grin' : 'smile', brow: 0.4, look: 0.8 });
        if (lt > co) K.dish(800, 820, 0.9 * E(seg(lt, co, co + 0.25)), ORANGE, 1, t);
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 4; k++) cue(st + ig - 0.3 + k * 0.15, 'pop', { gain: 0.22 }); cue(st + co, 'sizzle', { dur: 0.8, gain: 0.3 });
  }

  // ── 8 · and sends the dish back to your table ──
  {
    const st = cut(7), se = Wd('sends', 7) - st, tb = Wd('table', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 760], zoom: 0.08, note: 'kitchen hatch right, hero at table left; dish flies along a dotted arc from "sends" and lands on the table on "table" (burst, hero grins)',
      draw(lt, d, t) {
        diner();
        rr(700, 380, 380, 520, 0); ctx.fillStyle = '#E2DCD0'; ctx.fill(); rr(730, 480, 300, 200, 10); ctx.fillStyle = '#5E6775'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
        circle(880, 620, 70, C.skin); K.chefHat(880, 790, 0.5, 1); for (const d of [-24, 24]) { ell(880 + d, 615, 8, 11, C.ink); circle(882 + d, 610, 3, C.white); } ell(880, 650, 16, 7, C.mouth);
        K.pill('KITCHEN', 880, 330, 48, C.ink, C.white);
        K.man({ x: 260, y: 880, s: 0.6, arm: K.ARM.down, eyes: lt > tb ? 'closed' : 'n', mouth: lt > tb ? 'grin' : 'smile', brow: 0.5, look: 1 });
        K.table(260, 1040, 1.3);
        const u = eio(clamp((lt - se) / Math.max(0.3, tb - se)));
        if (lt > se) { K.route(800, 560, 300, 970, 260, 0, u); const [x, y] = K.arcAt(800, 560, 300, 970, 260, u); K.dish(x, y - 30, 0.8, ORANGE, 1, t); }
        if (lt > tb) K.burst(300, 940, 1.4, clamp(1 - (lt - tb) * 3));
      } });
    cue(st, 'whoosh'); cue(st + se, 'slide', { dur: Math.max(0.3, tb - se), gain: 0.3 }); cue(st + tb, 'thud', { gain: 0.4 }); cue(st + tb, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 9 · Apps work the same way. ──
  {
    const st = cut(8), ap = Wd('apps', 8) - st, sa = Wd('same', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 720], zoom: 0.08, note: 'two rows: top = table → kitchen, bottom = phone → server; "=" signs pop on "same"',
      draw(lt, d, t) {
        bg('#DDEFF6');
        K.table(250, 470, 0.9); K.kitchenTile(830, 420, 0.7, t, C.red);
        const ph = E(seg(lt, ap, ap + 0.25));
        K.phone(250, 900, 0.42 * ph, K.homeScreen); K.server(830, 900, 0.62 * E(seg(lt, ap + 0.1, ap + 0.35)), t);
        if (lt > sa) { const p = E(seg(lt, sa, sa + 0.25)); bigText('=', 250, 690, 150, C.yellow, 0, p); bigText('=', 830, 690, 150, C.yellow, 0, p); }
        line([[420, 450], [640, 450]], C.ink, 10); line([[420, 900], [640, 900]], C.ink, 10 * ph);
      } });
    cue(st, 'whoosh'); cue(st + ap, 'pop', { gain: 0.35 }); cue(st + sa, 'pop', { gain: 0.4 });
  }

  // ── 10 · Your phone is the client ──
  {
    const st = cut(9), ph = Wd('phone', 9) - st, cl = Wd('client', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 760], zoom: 0.12, note: 'close-up: hero holds up the phone on "phone"; CLIENT tag points at the phone on "client"',
      draw(lt, d, t) {
        bg();
        K.man({ x: 420, y: 1150, s: 1.0, arm: K.PHONE_ARM, holding: heldPhone(K.homeScreen), eyes: 'n', mouth: 'smile', brow: 0.4, look: 0.6 });
        if (lt > cl) K.tag('CLIENT', 860, 380, 600, 560, 64, E(seg(lt, cl, cl + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + cl, 'pop', { gain: 0.4 });
  }

  // ── 11 · sending a request like, show me my feed ──
  {
    const st = cut(10), rq = Wd('request', 10) - st, sh = Wd('show', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.08, note: 'phone left, server right; REQUEST envelope flies along the arc from "request"; bubble "SHOW MY FEED" above the phone on "show"',
      draw(lt, d, t) {
        bg('#DDEFF6');
        K.phone(230, 820, 0.55, () => K.feedScreen(0, t)); K.server(840, 800, 0.7, t);
        const u = eio(clamp((lt - rq) / 1.2));
        if (lt > rq) { K.route(300, 600, 800, 560, 280, 0, u); const [x, y] = K.arcAt(300, 600, 800, 560, 280, u); K.envelope(x, y, 0.6, 0, 'REQUEST'); }
        if (lt > sh) K.bubble(330, 300, 1, 'SHOW MY FEED', E(seg(lt, sh, sh + 0.25)), -1, C.yellow);
      } });
    cue(st, 'whoosh'); cue(st + rq, 'slide', { dur: 1.2, gain: 0.3 }); cue(st + sh, 'pop', { gain: 0.4 });
  }

  // ── 12 · The server holds the photos and accounts ──
  {
    const st = cut(11), ho = Wd('holds', 11) - st, pt = Wd('photos', 11) - st, ac = Wd('accounts', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 720], zoom: 0.1, note: 'big server centre; photos fly into it from the left on "photos"; account people fly in from the right on "accounts"; DATA pill',
      draw(lt, d, t) {
        bg();
        K.server(540, 760, 1.05, t);
        for (let k = 0; k < 4; k++) { const a = pt + k * 0.12; if (lt > a) { const u = eo(clamp((lt - a) / 0.45)); K.photo(lerp(-150, 330, u), 420 + k * 170, 0.55 * (1 - u * 0.4), (k - 1.5) * 0.15, 1 - clamp((lt - a - 0.45) * 4) * 0.5); } }
        for (let k = 0; k < 4; k++) { const a = ac + k * 0.12; if (lt > a) { const u = eo(clamp((lt - a) / 0.45)); K.personIcon(lerp(1230, 760, u), 420 + k * 170, 0.75 * (1 - u * 0.3), PCOLS[k]); } }
        if (lt > ho) K.pill('HOLDS THE DATA', 540, 220, 60, C.ink, C.white, E(seg(lt, ho, ho + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ho, 'pop', { gain: 0.35 }); cue(st + pt, 'slide', { dur: 0.6, gain: 0.25 }); cue(st + ac, 'slide', { dur: 0.6, gain: 0.25 });
  }

  // ── 13 · does the heavy work, and sends back a response ──
  {
    const st = cut(12), hv = Wd('heavy', 12) - st, se = Wd('sends', 12) - st, rs = Wd('response', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 760], zoom: 0.08, note: 'server right with two gears spinning above it on "heavy"; on "sends" a RESPONSE envelope arcs back to the phone; phone feed fills with photos on "response"',
      draw(lt, d, t) {
        bg('#DDEFF6');
        const ld = lt > rs ? clamp((lt - rs) / 0.5) : 0;
        K.phone(230, 820, 0.55, () => K.feedScreen(ld, t)); K.server(840, 800, 0.7, t);
        if (lt > hv) { const p = E(seg(lt, hv, hv + 0.25)), sp = lt < se + 0.2 ? 6 : 1.5; K.gear(780, 380, 0.6 * p, t * sp, '#9AA3B2'); K.gear(910, 300, 0.42 * p, -t * sp * 1.4 + 0.3, C.yellow); }
        const u = eio(clamp((lt - se) / Math.max(0.4, rs - se + 0.2)));
        if (lt > se && u < 1) { K.route(800, 600, 300, 560, 280, 0, u); const [x, y] = K.arcAt(800, 600, 300, 560, 280, u); K.envelope(x, y, 0.6, 0, 'RESPONSE'); }
        if (lt > rs) K.pill('RESPONSE', 230, 1160, 58, GREEN, C.white, E(seg(lt, rs, rs + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + hv, 'thud', { gain: 0.35 }); cue(st + se, 'slide', { dur: 0.6, gain: 0.3 }); cue(st + rs, 'sparkle', { dur: 0.5, gain: 0.35 });
  }

  // ── 14 · And one kitchen can feed thousands of tables. ──
  {
    const st = cut(13), ki = Wd('kitchen', 13) - st, th = Wd('thousands', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 740], zoom: 0.12, note: 'one server in the centre (ONE pill on "kitchen"); on "thousands" rings of phones pop in around it with thin lines to it; counter 1,000s',
      draw(lt, d, t) {
        bg();
        const n = Math.floor(clamp((lt - th) / 0.8) * 26);
        for (let k = 0; k < n; k++) {
          const ring = k < 10 ? 0 : 1, kk = ring ? k - 10 : k, cnt = ring ? 16 : 10;
          const a = (kk / cnt) * Math.PI * 2 + ring * 0.2, r = 330 + ring * 170;
          const x = 540 + Math.cos(a) * r, y = 740 + Math.sin(a) * r * 0.85;
          if (y > 1210 || y < 230) continue;
          ctx.save(); ctx.globalAlpha = 0.35; line([[x, y], [540, 740]], C.ink, 4); ctx.restore();
          K.phone(x, y, 0.16 * E(seg(lt, th + k * 0.03, th + k * 0.03 + 0.2)), K.homeScreen);
        }
        K.server(540, 760, 0.6 * E(seg(lt, 0, 0.25)), t);
        if (lt > ki) K.pill('ONE SERVER', 540, 540, 52, C.ink, C.white, E(seg(lt, ki, ki + 0.25)));
        if (lt > th) K.pill('THOUSANDS OF CLIENTS', 540, 1200, 52, C.yellow, C.ink, E(seg(lt, th + 0.3, th + 0.55)));
      } });
    cue(st, 'whoosh'); cue(st + ki, 'pop', { gain: 0.35 }); cue(st + th, 'sparkle', { dur: 0.8, gain: 0.3 });
  }

  // ── 15 · Client asks, server answers. ──
  {
    const st = cut(14), as = Wd('asks', 14) - st, sv = Wd('server', 14) - st, an = Wd('answers', 14) - st;
    add({ id: 'S15', at: st, cam: [540, 720], zoom: 0.1, note: 'phone left (CLIENT), server right (SERVER); "?" bubble from the phone on "asks"; dish/answer bubble with check from the server on "answers"',
      draw(lt, d, t) {
        bg('#DDEFF6');
        K.phone(250, 820, 0.5, K.homeScreen); K.server(830, 800, 0.66, t);
        K.pill('CLIENT', 250, 1150, 56, C.ink, C.white); if (lt > sv) K.pill('SERVER', 830, 1150, 56, C.ink, C.white, E(seg(lt, sv, sv + 0.25)));
        if (lt > as) K.bubble(300, 400, 1.1, 'ASKS ?', E(seg(lt, as, as + 0.25)), -1, C.yellow);
        if (lt > an) { K.bubble(780, 400, 1.1, 'ANSWERS', E(seg(lt, an, an + 0.25)), 1, GREEN, C.white); K.check(1000, 290, 0.45 * E(seg(lt, an + 0.15, an + 0.4))); }
      } });
    cue(st, 'whoosh'); cue(st + as, 'pop', { gain: 0.4 }); cue(st + sv, 'pop', { gain: 0.3 }); cue(st + an, 'sparkle', { dur: 0.4, gain: 0.35 });
  }

  // ── 16 · Tomorrow: why fast means two different things. ──
  {
    const st = cut(15), tm = Wd('tomorrow', 15) - st, fa = Wd('fast', 15) - st, tw = Wd('two', 15) - st;
    add({ id: 'S16', at: st, cam: [540, 700], zoom: 0.03, note: 'hero winks with DAY 2 / 30 pill; on "fast" he ducks out and FAST? slams in with speed lines; on "two" it splits into two cards: stopwatch (QUICK) and a pile of envelopes (A LOT)',
      draw(lt, d, t) {
        bg();
        const dn = E(seg(lt, fa - 0.15, fa + 0.2));
        K.man({ x: 540, y: lerp(1120, 2700, dn), s: 0.95, arm: K.ARM.point, finger: Math.sin(lt * 9) * 0.25, eyes: lt < fa ? 'wink' : 'n', mouth: 'smirk', smirk: true, brow: 0.6 });
        K.pill('DAY 2 / 30', 540, 200, 70, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        const sp = E(seg(lt, tw, tw + 0.35));
        if (lt > fa && sp < 1) { K.speedLines(540, 640, 1); bigText('FAST?', lerp(540, 540, sp), 640, 200, C.white, -0.05, E(seg(lt, fa, fa + 0.25)) * (1 - sp)); }
        if (lt > tw) {
          rr(lerp(540, 110, sp) - 0, 470, 400 * sp, 520, 40); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.ink; ctx.stroke();
          rr(lerp(540, 570, sp), 470, 400 * sp, 520, 40); ctx.fill(); ctx.stroke();
          K.stopwatch(310, 680, 0.55 * sp, t * 6); K.pill('QUICK', 310, 900, 52, C.ink, C.white, sp);
          for (let k = 0; k < 5; k++) K.envelope(700 + (k % 3) * 70, 640 + Math.floor(k / 3) * 80 - (k % 2) * 20, 0.38 * sp, (rnd(k) - 0.5) * 0.4);
          K.pill('A LOT', 770, 900, 52, C.ink, C.white, sp);
        }
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.4 }); cue(st + fa, 'zip', { gain: 0.4 }); cue(st + tw, 'slam', { gain: 0.4 });
  }

  return { shots: S, cues: CUES };
}
