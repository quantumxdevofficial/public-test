// (7/30) WHAT IS A CDN?: the shot list. Pizza-chain analogy, continuing from day 6 (warm shelf = cache):
// the customer is in Tokyo but the one kitchen is in New York, so every pizza crosses the planet and arrives cold and
// late. The chain opens small branches in big cities and you're served by the closest one = a CDN (content delivery
// network): copies of videos and images on servers all over the world, so files come from near you. On a miss the
// nearby (edge) server grabs the file ONCE from the main (origin) server. Netflix even puts servers inside ISPs.
// Tease: SQL vs NoSQL.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const GREEN = '#5BAE6A', BLUE = '#3A7BD5';
const bg = (ring = '#CFE8F3', base = C.sky) => { fillAll(base); circle(540, 740, 560, ring); };
const waiter = (o) => { K.man(o); K.bowtie(o.x, o.y, o.s); };
// the world map used in several shots
const MX = 540, MY = 700, MW = 980, MH = 560;
const city = (c) => K.mapXY(MX, MY, MW, MH, c);
const paper = () => { fillAll(C.bg); circle(540, 740, 600, '#EDE6D6'); };

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const at = (w, i) => Wd(w, i);

  // ── 1 · Yesterday we kept hot pizza by the door, ──
  {
    const st = cut(0), ye = at('yesterday', 0) - st, pz = at('pizza', 0) - st, dr = at('door', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 760], zoom: 0.08, note: 'DAY 7 / 30 pill; YESTERDAY: CACHING pill; warm shelf fills with pizzas on "pizza"; swing door right swings on "door"',
      draw(lt, d, t) {
        K.kitchen(1180);
        K.pill('DAY 7 / 30', 540, 170, 64, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        if (lt > ye) K.pill('YESTERDAY: CACHING', 540, 290, 44, C.ink, C.white, E(seg(lt, ye, ye + 0.25)));
        K.swingDoor(900, 1180, 0.95, lt > dr ? 0.6 * E(seg(lt, dr, dr + 0.3)) : 0);
        K.warmShelf(400, 780, 0.75, [0, 1, 2].map((k) => E(seg(lt, pz + k * 0.1, pz + k * 0.1 + 0.25))), t, [0, 0, 0], lt > dr ? 0.6 : 0);
      } });
    cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + ye, 'pop', { gain: 0.3 }); for (let k = 0; k < 3; k++) cue(st + pz + k * 0.1, 'pop', { gain: 0.25 }); cue(st + dr, 'boing', { gain: 0.25 });
  }

  // ── 2 · but what if your customer is in Tokyo, ──
  {
    const st = cut(1), cu = at('customer', 1) - st, tk = at('tokyo', 1) - st;
    const [tx, ty] = city('tokyo');
    add({ id: 'S02', at: st, cam: [tx - 60, ty], zoom: 0.14, note: 'world map pops in; CUSTOMER pill on "customer"; on "Tokyo" a red pin drops on Tokyo + TOKYO pill',
      draw(lt, d, t) {
        paper();
        K.flatMap(MX, MY, MW, MH, E(seg(lt, 0, 0.3)));
        if (lt > tk - 0.1) K.mapPin(tx, lerp(ty - 300, ty, eo(seg(lt, tk - 0.1, tk + 0.2))), 0.8, C.red);
        if (lt > tk) K.pill('TOKYO', tx - 60, ty - 200, 54, C.ink, C.white, E(seg(lt, tk, tk + 0.25)));
        if (lt > cu) K.pill('CUSTOMER', 300, 230, 56, C.yellow, C.ink, E(seg(lt, cu, cu + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + cu, 'pop', { gain: 0.3 }); cue(st + tk + 0.15, 'thud', { gain: 0.35 });
  }

  // ── 3 · and the kitchen is all the way in New York? ──
  {
    const st = cut(2), ki = at('kitchen', 2) - st, wa = at('way', 2) - st, yo = at('york', 2) - st;
    const [nx, ny] = city('ny'), [tx, ty] = city('tokyo');
    add({ id: 'S03', at: st, cam: [540, 640], zoom: 0.06, note: 'map; Tokyo pin stays; on "kitchen" a chef-hat pin drops on New York; on "way" a long dashed arc draws NY→Tokyo; NEW YORK pill on "York"; FAR! red pill',
      draw(lt, d, t) {
        paper();
        K.flatMap(MX, MY, MW, MH);
        K.mapPin(tx, ty, 0.8, C.red);
        if (lt > ki - 0.1) { const y = lerp(ny - 300, ny, eo(seg(lt, ki - 0.1, ki + 0.2))); K.mapPin(nx, y, 0.8, BLUE); }
        if (lt > wa) K.dashArc(nx, ny - 60, tx, ty - 60, 360, eio(seg(lt, wa, wa + 0.6)), C.ink, 12, 0.7);
        if (lt > ki) K.pill('KITCHEN', nx, 1110, 54, C.ink, C.white, E(seg(lt, ki, ki + 0.25)));
        if (lt > yo) K.pill('NEW YORK', nx, 1110, 54, BLUE, C.white, E(seg(lt, yo, yo + 0.25)));
        if (lt > wa + 0.4) K.pill('FAR!', 640, 300, 70, C.red, C.white, E(seg(lt, wa + 0.4, wa + 0.65)));
      } });
    cue(st, 'whoosh'); cue(st + ki + 0.15, 'thud', { gain: 0.35 }); cue(st + wa, 'slide', { dur: 0.6, gain: 0.25 }); cue(st + wa + 0.4, 'pop', { gain: 0.35 });
  }

  // ── 4 · Every pizza shows up cold and late. ──
  {
    const st = cut(3), pz = at('pizza', 3) - st, co = at('cold', 3) - st, la = at('late', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 800], zoom: 0.1, note: 'customer at a table; pizza slides in from the right on "pizza"; on "cold" it turns icy with snowflakes + COLD blue pill; on "late" a stopwatch + LATE red pill; customer frowns',
      draw(lt, d, t) {
        bg('#F7E3C8', C.bg);
        const sad = lt > co;
        K.man({ x: 380, y: 1060, s: 0.55, arm: K.ARM.hip, eyes: sad ? 'closed' : 'n', mouth: sad ? 'flat' : 'smile', frown: sad, brow: 0.3, look: 0.6 });
        K.table(540, 1170, 1.4);
        const u = eo(seg(lt, pz - 0.15, pz + 0.4)); K.pizza(lerp(1300, 620, u), 1105, 0.5, 0, 8, 0);
        if (sad) { ctx.save(); ctx.globalAlpha = 0.45 * E(seg(lt, co, co + 0.3)); ctx.beginPath(); ctx.arc(620, 1105, 66, 0, Math.PI * 2); ctx.fillStyle = C.sky; ctx.fill(); ctx.restore();
          for (let k = 0; k < 3; k++) K.snowflake(560 + k * 70, 940 - (k % 2) * 60, 0.45 * E(seg(lt, co + k * 0.08, co + k * 0.08 + 0.25)), lt * 0.8 + k); }
        if (lt > co) K.pill('COLD', 300, 300, 70, BLUE, C.white, E(seg(lt, co, co + 0.25)));
        if (lt > la) { K.stopwatch(790, 560, 0.42 * E(seg(lt, la, la + 0.25)), lt * 6); K.pill('LATE', 790, 300, 70, C.red, C.white, E(seg(lt, la, la + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + pz - 0.1, 'slide', { dur: 0.5, gain: 0.25 }); cue(st + co, 'sparkle', { dur: 0.4, gain: 0.25 }); cue(st + la, 'boing', { gain: 0.3 });
  }

  // ── 5 · So the chain opens small branches in big cities, ──
  {
    const st = cut(4), ch = at('chain', 4) - st, br = at('branches', 4) - st, ci = at('cities', 4) - st;
    const spots = ['london', 'tokyo', 'sao', 'mumbai', 'sydney', 'la', 'lagos'];
    add({ id: 'S05', at: st, cam: [540, 680], zoom: 0.08, note: 'map; NY main kitchen pin; on "branches" small branch shops pop up in 7 cities one by one; PIZZA CHAIN pill on "chain"; BRANCHES yellow pill on "cities"',
      draw(lt, d, t) {
        paper();
        K.flatMap(MX, MY, MW, MH);
        const [nx, ny] = city('ny'); K.mapPin(nx, ny, 0.7, BLUE);
        spots.forEach((c, k) => { const [x, y] = city(c); const a = br + k * 0.13; K.branchShop(x, y + 30, 0.36 * E(seg(lt, a, a + 0.25)), 1, k % 2 ? BLUE : C.red); });
        if (lt > ch) K.pill('PIZZA CHAIN', 540, 230, 60, C.ink, C.white, E(seg(lt, ch, ch + 0.25)));
        if (lt > ci) K.pill('BRANCHES', 540, 1150, 66, C.yellow, C.ink, E(seg(lt, ci, ci + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ch, 'pop', { gain: 0.3 }); for (let k = 0; k < 7; k++) cue(st + br + k * 0.13 + 0.1, 'pop', { gain: 0.22 }); cue(st + ci, 'sparkle', { dur: 0.4, gain: 0.25 });
  }

  // ── 6 · and you get served by the closest one. ──
  {
    const st = cut(5), se = at('served', 5) - st, cl = at('closest', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 800], zoom: 0.1, note: 'street: branch shop right, customer at table left; on "served" a hot pizza zips a short hop shop→table; on "closest" CLOSEST yellow pill + green check; customer grins',
      draw(lt, d, t) {
        bg('#F7E3C8', C.bg);
        K.branchShop(820, 1180, 1.1, 1, C.red);
        const got = lt > se + 0.35;
        K.man({ x: 300, y: 1060, s: 0.55, arm: K.ARM.hip, eyes: 'n', mouth: got ? 'grin' : 'smile', brow: got ? 0.8 : 0.4, look: 0.7 });
        K.table(380, 1170, 1.2);
        if (lt > se) { const u = eo(seg(lt, se, se + 0.35)); const [x, y] = K.arcAt(780, 1000, 420, 1105, 200, u); K.pizza(x, y, 0.45, u * 2);
          if (got) for (let k = 0; k < 3; k++) { const p = (t * 0.8 + k / 3) % 1; ctx.save(); ctx.globalAlpha = 0.6 * (1 - p); line([[390 + k * 30, 1030 - p * 90], [400 + k * 30, 990 - p * 90]], C.white, 12); ctx.restore(); } }
        if (lt > cl) { K.pill('CLOSEST', 540, 300, 76, C.yellow, C.ink, E(seg(lt, cl, cl + 0.25))); K.check(540, 520, 0.4, E(seg(lt, cl + 0.05, cl + 0.3))); }
      } });
    cue(st, 'whoosh'); cue(st + se, 'zip', { gain: 0.3 }); cue(st + se + 0.35, 'thud', { gain: 0.3 }); cue(st + cl, 'pop', { gain: 0.4 });
  }

  // ── 7 · That's a CDN, a content delivery network. ──
  {
    const st = cut(6), cd = at('cdn', 6) - st, co = at('content', 6) - st, ne = at('network', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 720], zoom: 0.1, note: 'globe centre with 6 edge servers orbiting; on "CDN" burst + huge CDN pill; from "content" the CONTENT DELIVERY NETWORK pill builds word by word',
      draw(lt, d, t) {
        bg();
        K.globe(540, 760, 2.4 * E(seg(lt, 0, 0.3)), t);
        for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3 + lt * 0.5; K.edgeServer(540 + Math.cos(a) * 400, 760 + Math.sin(a) * 360, 0.6 * E(seg(lt, 0.1 + k * 0.06, 0.35 + k * 0.06)), t); }
        if (lt > cd && lt < cd + 0.5) K.burst(540, 300, 3.2, clamp(1 - (lt - cd) * 2));
        if (lt > cd) K.pill('CDN', 540, 300, 130, C.yellow, C.ink, lerp(1.6, 1, eo(seg(lt, cd, cd + 0.2))));
        const words = [['CONTENT', co], ['DELIVERY', (co + ne) / 2], ['NETWORK', ne]];
        if (lt > co) K.pill(words.filter(([, w]) => lt > w).map(([s]) => s).join(' '), 540, 1200, 50, C.ink, C.white, E(seg(lt, co, co + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + cd, 'slam', { gain: 0.4 }); cue(st + co, 'pop', { gain: 0.3 }); cue(st + ne, 'pop', { gain: 0.3 });
  }

  // ── 8 · It keeps copies of videos and images ──
  {
    const st = cut(7), cp = at('copies', 7) - st, vi = at('videos', 7) - st, im = at('images', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 760], zoom: 0.08, note: 'MAIN SERVER left; on "videos" 3 video cards fly out to the right as a stack, on "images" 3 image cards; COPIES pill on "copies"',
      draw(lt, d, t) {
        bg();
        K.server(300, 800, 0.8, t);
        K.pill('MAIN SERVER', 300, 1200, 48, C.ink, C.white, 1);
        for (const [kind, w0, yy] of [['video', vi, 600], ['image', im, 920]]) for (let k = 2; k >= 0; k--) { const a = w0 + k * 0.15; const p = E(seg(lt, a, a + 0.3)); if (p > 0) K.mediaCard(lerp(300, 720 + k * 50, eo(seg(lt, a, a + 0.35))), yy - k * 30, 0.9 * p, kind, (kind === 'video' ? 0.05 : -0.05) * k); }
        if (lt > cp) K.pill('COPIES', 540, 250, 76, C.yellow, C.ink, E(seg(lt, cp, cp + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + cp, 'pop', { gain: 0.35 }); cue(st + vi, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + im, 'slide', { dur: 0.4, gain: 0.25 });
  }

  // ── 9 · on servers all over the world, ──
  {
    const st = cut(8), se = at('servers', 8) - st, wo = at('world', 8) - st;
    const spots = ['london', 'tokyo', 'sao', 'mumbai', 'sydney', 'la', 'lagos', 'ny'];
    add({ id: 'S09', at: st, cam: [540, 700], zoom: 0.08, note: 'map; on "servers" an edge server pops in at each city; on "world" each gets a tiny media card above; EDGE SERVERS yellow pill',
      draw(lt, d, t) {
        paper();
        K.flatMap(MX, MY, MW, MH);
        spots.forEach((c, k) => { const [x, y] = city(c); const a = se + k * 0.08; K.edgeServer(x, y, 0.38 * E(seg(lt, a, a + 0.25)), t, 0, k % 2 ? GREEN : BLUE);
          if (lt > wo + k * 0.05) K.mediaCard(x, y - 80, 0.26 * E(seg(lt, wo + k * 0.05, wo + k * 0.05 + 0.25)), k % 2 ? 'image' : 'video'); });
        if (lt > se) K.pill('EDGE SERVERS', 540, 230, 60, C.yellow, C.ink, E(seg(lt, se, se + 0.25)));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 8; k++) cue(st + se + k * 0.08 + 0.1, 'pop', { gain: 0.18 }); cue(st + wo, 'sparkle', { dur: 0.4, gain: 0.25 });
  }

  // ── 10 · so files come from near you, not from far away. ──
  {
    const st = cut(9), fi = at('files', 9) - st, ne = at('near', 9) - st, aw = at('away', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 760], zoom: 0.1, note: 'phone left; NEAR edge server close right; FAR main server small top-right with long dashed path; video cards zip near→phone; NEAR green pill on "near"; on "away" red X on the long path + FAR red pill',
      draw(lt, d, t) {
        bg();
        K.phone(220, 900, 0.5, () => K.videoScreen(lt > fi ? 1 : 0, t));
        K.edgeServer(690, 960, 1.5, t, lt > ne ? 0.35 : 0, GREEN);
        K.server(860, 450, 0.5, t);
        K.dashArc(760, 470, 330, 640, 180, 1, C.ink, 12, 0.35);
        for (let k = 0; k < 4; k++) { const q = (lt - fi) * 2.4 - k * 0.35; if (q < 0) continue; const u = q % 1; const [x, y] = K.arcAt(590, 900, 340, 880, 120, u); K.mediaCard(x, y, 0.4, 'video'); }
        if (lt > ne) K.pill('NEAR', 660, 1180, 64, GREEN, C.white, E(seg(lt, ne, ne + 0.25)));
        if (lt > aw) { K.redX(560, 440, lerp(0.7, 0.35, eo(seg(lt, aw, aw + 0.2))), 1); K.pill('FAR', 880, 190, 64, C.red, C.white, E(seg(lt, aw, aw + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + fi, 'slide', { dur: 1, gain: 0.2 }); cue(st + ne, 'pop', { gain: 0.35 }); cue(st + aw, 'slam', { gain: 0.35 });
  }

  // ── 11 · If the nearby server doesn't have it yet, ──
  {
    const st = cut(10), nb = at('nearby', 10) - st, dn = at("doesn't", 10) - st;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.1, note: 'big edge server centre-right with an empty dashed slot above it; phone left; on "doesn\'t" the slot shakes red with a red ? + NOT HERE YET red pill',
      draw(lt, d, t) {
        bg();
        K.edgeServer(660, 980, 2.1, t, 0, GREEN);
        K.phone(200, 900, 0.46, () => K.videoScreen(0, t));
        const sh = lt > dn ? Math.sin(lt * 40) * 10 * clamp(1 - (lt - dn) * 2) : 0;
        ctx.save(); ctx.translate(sh, 0); ctx.setLineDash([18, 14]); ctx.lineWidth = 8; ctx.strokeStyle = lt > dn ? C.red : C.ink; ctx.globalAlpha = 0.6; rr(540, 520, 240, 180, 18); ctx.stroke(); ctx.restore();
        if (lt > dn) bigText('?', 660 + sh, 610, 130, C.red, 0, E(seg(lt, dn, dn + 0.25)));
        if (lt > nb) K.pill('NEARBY SERVER', 600, 280, 56, C.ink, C.white, E(seg(lt, nb, nb + 0.25)));
        if (lt > dn) K.pill('NOT HERE YET', 540, 1200, 62, C.red, C.white, E(seg(lt, dn, dn + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + nb, 'pop', { gain: 0.3 }); cue(st + dn, 'boing', { gain: 0.3 });
  }

  // ── 12 · it grabs it once from the main server. ──
  {
    const st = cut(11), gr = at('grabs', 11) - st, on = at('once', 11) - st, ms = at('server', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 740], zoom: 0.08, note: 'main server top-right, edge server bottom-left; on "grabs" a video card arcs main→edge once and lands on it + green check; ONCE yellow pill; MAIN SERVER pill on "server"',
      draw(lt, d, t) {
        bg();
        K.server(800, 600, 0.75, t);
        K.edgeServer(300, 1000, 1.6, t, 0, GREEN);
        K.dashArc(680, 440, 320, 790, 200, 1, C.ink, 12, 0.3);
        const u = eio(seg(lt, gr, gr + 0.6));
        if (lt > gr) { const [x, y] = K.arcAt(700, 440, 300, 780, 200, u); K.mediaCard(x, y, 0.6, 'video', (1 - u) * 0.4); }
        if (lt > gr + 0.6) K.check(520, 720, 0.35, E(seg(lt, gr + 0.6, gr + 0.85)));
        if (lt > on) K.pill('ONCE', 300, 300, 90, C.yellow, C.ink, lerp(1.5, 1, eo(seg(lt, on, on + 0.2))));
        if (lt > ms) K.pill('MAIN SERVER', 800, 1200, 54, C.ink, C.white, E(seg(lt, ms, ms + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + gr, 'slide', { dur: 0.6, gain: 0.3 }); cue(st + gr + 0.6, 'thud', { gain: 0.3 }); cue(st + on, 'slam', { gain: 0.3 }); cue(st + ms, 'pop', { gain: 0.3 });
  }

  // ── 13 · Netflix even puts its servers inside internet providers. ──
  {
    const st = cut(12), nf = at('netflix', 12) - st, se = at('servers', 12) - st, pr = at('providers', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 760], zoom: 0.1, note: 'ISP building centre with houses either side; NETFLIX red pill on "Netflix"; on "servers" a red edge server slides into the building; on "providers" INSIDE YOUR ISP yellow pill and video cards hop to the houses',
      draw(lt, d, t) {
        bg();
        K.ispBuilding(540, 1020, 1.4, 'ISP', t);
        K.house(170, 1120, 0.6, '#F29A3A', t); K.house(910, 1120, 0.6, GREEN, t);
        if (lt > se) { const u = eo(seg(lt, se, se + 0.5)); K.edgeServer(lerp(1250, 540, u), 880, 0.9, t, u >= 1 ? 0.4 : 0, C.red); }
        if (lt > pr + 0.2) for (const [hx, k] of [[170, 0], [910, 1]]) { const q = ((lt - pr - 0.2) * 1.6 + k * 0.5) % 1; const [x, y] = K.arcAt(540, 860, hx, 960, 120, q); K.mediaCard(x, y, 0.22, 'video'); }
        if (lt > nf) K.pill('NETFLIX', 540, 230, 76, C.red, C.white, E(seg(lt, nf, nf + 0.25)));
        if (lt > pr) K.pill('INSIDE YOUR ISP', 540, 380, 58, C.yellow, C.ink, E(seg(lt, pr, pr + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + nf, 'pop', { gain: 0.35 }); cue(st + se, 'slide', { dur: 0.5, gain: 0.3 }); cue(st + se + 0.5, 'thud', { gain: 0.3 }); cue(st + pr, 'sparkle', { dur: 0.5, gain: 0.3 });
  }

  // ── 14 · Tomorrow: SQL versus NoSQL. ──
  {
    const st = cut(13), to = at('tomorrow', 13) - st, ns = at('nosql', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 700], zoom: 0.03, note: 'waiter winks + points with DAY 7 / 30 pill; SQL database drops in on "tomorrow", NOSQL on "NoSQL" with a red VS; NEXT: SQL VS NOSQL pill',
      draw(lt, d, t) {
        bg();
        waiter({ x: 540, y: 1120, s: 0.8, arm: K.ARM.point, finger: Math.sin(lt * 9) * 0.25, eyes: lt < ns ? 'wink' : 'wide', mouth: 'smirk', smirk: true, brow: 0.6 });
        K.pill('DAY 7 / 30', 540, 170, 64, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        if (lt > to) K.database(240, lerp(-300, 520, eo(seg(lt, to, to + 0.35))), 0.62, 0, 'SQL');
        if (lt > ns - 0.1) { K.database(840, lerp(-300, 520, eo(seg(lt, ns - 0.1, ns + 0.25))), 0.62, 0, 'NOSQL'); bigText('VS', 540, 540, 110, C.red, 0, E(seg(lt, ns, ns + 0.25))); }
        if (lt > ns) K.pill('NEXT: SQL VS NOSQL', 540, 1200, 56, C.ink, C.white, E(seg(lt, ns, ns + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + to + 0.3, 'thud', { gain: 0.3 }); cue(st + ns + 0.2, 'thud', { gain: 0.3 }); cue(st + ns, 'pop', { gain: 0.35 });
  }

  return { shots: S, cues: CUES };
}
