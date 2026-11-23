// (17/30) WHAT IS PUB/SUB: the shot list. Analogy: a video channel. Yesterday a queue gave one message to ONE worker.
// But what if five parts of an app need the same news? A creator doesn't message every fan one by one: they post once and
// every subscriber gets a copy. That's pub/sub. Order placed → the shop publishes one message to a topic → email sends
// the receipt, the warehouse packs the box, rewards adds points, all at once. The shop doesn't know who's listening; a
// new feature just subscribes, the shop never changes. Loop: post once, everyone who cares hears it. Tease: monolith vs microservices.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const GREEN = '#5BAE6A', BLUE = '#3A7BD5', ORANGE = '#F29A3A', PURPLE = '#8A63D2';
const MCOL = [C.yellow, GREEN, ORANGE, C.pink, BLUE, PURPLE];
const bg = (ring = '#CFE8F3', base = C.sky) => { fillAll(base); circle(540, 740, 560, ring); };
const warm = () => bg('#F7E3C8', C.bg);
const avatar = (x, y) => K.personIcon(x, y + 40, 1.3, BLUE);
const creatorPhone = (hx, hy) => K.phone(hx, hy - 40, 0.32, () => { ctx.fillStyle = C.red; ctx.fillRect(-200, -400, 400, 800); ctx.beginPath(); ctx.moveTo(-60, -80); ctx.lineTo(90, 0); ctx.lineTo(-60, 80); ctx.closePath(); ctx.fillStyle = C.white; ctx.fill(); });
// fans: a 3x2 grid on the right / bottom
const FANS = [[180, 1010], [400, 1010], [620, 1010], [840, 1010], [290, 1190], [730, 1190]];
// subscriber boxes for the shop example
const SUBS = [{ x: 200, label: 'EMAIL', col: BLUE }, { x: 540, label: 'WAREHOUSE', col: ORANGE }, { x: 880, label: 'REWARDS', col: GREEN }];
const HUB = [540, 470], SUB_Y = 960;

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const at = (w, i) => Wd(w, i);
  // the shop example scene (hub top, 3 subscriber boxes below). got[k] 0..1 = copy k delivered, show[k] = box scale
  const subScene = (lt, t, got, show = [1, 1, 1], focus = -1) => {
    warm();
    K.topicHub(HUB[0], HUB[1], 0.8, 'ORDER PLACED', t, 1);
    SUBS.forEach((s, k) => {
      ctx.save(); if (focus >= 0 && focus !== k) ctx.globalAlpha = 0.45;
      K.dashArc(HUB[0], HUB[1] + 80, s.x, SUB_Y - 110, 40, 1, C.ink, 8, 0.3);
      K.serviceBox(s.x, SUB_Y, 0.72, s.label === 'WAREHOUSE' ? 'STOCK' : s.label, s.col, t + k, got[k] >= 1 ? 'ok' : null, show[k]);
      ctx.restore();
      if (got[k] > 0 && got[k] < 1) { const [x, y] = K.arcAt(HUB[0], HUB[1] + 80, s.x, SUB_Y - 110, 40, eio(got[k])); K.msgCard(x, y, 0.7, C.yellow); }
    });
  };

  // ── 1 · Yesterday, one message went to one worker. ──
  {
    const st = cut(0), ye = at('yesterday', 0) - st, me = at('message', 0) - st, on = at('one', 0) - st, wk = at('worker', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 720], zoom: 0.08, note: 'DAY 17 / 30; YESTERDAY: QUEUE recap: queue tube with cards; on "message" the front card drops into ONE worker box; 1 → 1 pill',
      draw(lt, d, t) {
        bg();
        K.pill('DAY 17 / 30', 540, 170, 64, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        K.pill('YESTERDAY: QUEUE', 540, 300, 52, C.ink, C.white, E(seg(lt, ye, ye + 0.25)));
        K.queueTube(140, 940, 560, 170, 1, null);
        for (let k = 1; k < 4; k++) K.msgCard(820 - k * 150, 560, 0.85, MCOL[k]);
        K.serviceBox(540, 1000, 0.85, 'WORKER', ORANGE, t, lt > wk + 0.3 ? 'ok' : null, E(seg(lt, 0.1, 0.4)));
        const g = eio(seg(lt, me, wk + 0.2));
        K.msgCard(lerp(820, 540, g), lerp(560, 900, g), 0.85, C.yellow);
        if (lt > on) K.pill('1 → 1', 860, 900, 64, C.yellow, C.ink, E(seg(lt, wk, wk + 0.25)));
      } });
    cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + ye, 'pop', { gain: 0.25 }); cue(st + me, 'slide', { dur: 0.6, gain: 0.2 }); cue(st + wk + 0.2, 'thud', { gain: 0.25 });
  }

  // ── 2 · But what if five parts of your app need the same news? ──
  {
    const st = cut(1), fi = at('five', 1) - st, ap = at('app', 1) - st, sa = at('same', 1) - st, ne = at('news', 1) - st;
    const parts = ['EMAIL', 'STOCK', 'POINTS', 'STATS', 'ALERTS'];
    add({ id: 'S02', at: st, cam: [540, 760], zoom: 0.1, note: 'one yellow NEWS card top; on "five" 5 small service boxes pop in an arc below; on "same" dashed lines to all five + ? marks; 5 PARTS pill',
      draw(lt, d, t) {
        warm();
        const pos = parts.map((p, k) => [140 + k * 200, k % 2 ? 1060 : 900]);
        if (lt > sa) pos.forEach(([x, y], k) => K.dashArc(540, 470, x, y - 90, 40, eo(seg(lt, sa + k * 0.05, sa + k * 0.05 + 0.4)), C.ink, 8, 0.35));
        K.msgCard(540, 470, 1.4, C.yellow, lt > ne ? 'NEWS' : null, Math.sin(lt * 3) * 0.04);
        pos.forEach(([x, y], k) => { const a = fi - 0.1 + k * 0.08; K.serviceBox(x, y, 0.52, parts[k], MCOL[k + 1], t + k, null, E(seg(lt, a, a + 0.22))); });
        if (lt > sa) pos.forEach(([x, y], k) => { ctx.save(); ctx.globalAlpha = clamp((lt - sa - k * 0.05) * 4); ctx.fillStyle = C.red; ctx.font = '900 70px Inter'; ctx.textAlign = 'center'; ctx.fillText('?', x + 60, y - 70); ctx.restore(); });
        if (lt > ap) K.pill('5 PARTS', 540, 250, 64, C.ink, C.white, E(seg(lt, ap, ap + 0.25)));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 5; k++) cue(st + fi - 0.1 + k * 0.08, 'pop', { gain: 0.14 }); cue(st + sa, 'slide', { dur: 0.5, gain: 0.2 }); cue(st + ne, 'pop', { gain: 0.35 });
  }

  // ── 3 · Think of a YouTube channel. ──
  {
    const st = cut(2), yt = at('youtube', 2) - st, ch = at('channel', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 700], zoom: 0.12, note: 'a channel card (banner, avatar, QuantumXDev name, SUBSCRIBE button) springs up on "youtube"; CHANNEL pill on "channel"',
      draw(lt, d, t) {
        bg();
        K.channelPage(540, 720, 1.1, 'QuantumXDev', 0, avatar, E(seg(lt, 0.05, 0.4)));
        if (lt > ch) K.pill('CHANNEL', 540, 260, 72, C.yellow, C.ink, E(seg(lt, ch, ch + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'pop', { gain: 0.35 }); cue(st + ch, 'pop', { gain: 0.3 });
  }

  // ── 4 · The creator doesn't message every fan one by one. ──
  {
    const st = cut(3), cr = at('creator', 3) - st, me = at('message', 3) - st, fa = at('fan', 3) - st, on = at('one', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 760], zoom: 0.1, note: 'creator (hero + phone) top-left; 6 fan icons below; from "message" a slow envelope goes to fan 1, then fan 2; on "one" a red X + ONE BY ONE? pill',
      draw(lt, d, t) {
        warm();
        K.man({ x: 300, y: 560, s: 0.4, arm: K.PHONE_ARM, holding: creatorPhone, eyes: lt > on ? 'wide' : 'n', mouth: lt > on ? 'o' : 'smile', brow: 0.5, look: 0.6 });
        if (lt > cr) K.pill('CREATOR', 300, 250, 48, C.ink, C.white, E(seg(lt, cr, cr + 0.25)));
        FANS.forEach(([x, y], k) => K.personIcon(x, y - 60, 1.15 * E(seg(lt, fa - 0.2 + k * 0.04, fa + k * 0.04)), MCOL[k]));
        for (let k = 0; k < 2; k++) { const a = me + k * 0.7, u = seg(lt, a, a + 0.7); if (u <= 0 || u >= 1) continue; const [x, y] = K.arcAt(380, 520, FANS[k][0], FANS[k][1] - 160, 100, eio(u)); K.envelope(x, y, 0.32, 0); }
        if (lt > on) { K.redX(720, 600, 0.45, E(seg(lt, on, on + 0.2))); K.pill('ONE BY ONE?', 720, 360, 56, C.red, C.white, E(seg(lt, on, on + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + cr, 'pop', { gain: 0.25 }); cue(st + me, 'slide', { dur: 0.6, gain: 0.18 }); cue(st + me + 0.7, 'slide', { dur: 0.6, gain: 0.18 }); cue(st + on, 'slam', { gain: 0.35 });
  }

  // ── 5 · They post once, ──
  {
    const st = cut(4), po = at('post', 4) - st, on = at('once', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 700], zoom: 0.14, note: 'creator close-up taps the phone on "post"; a red video card pops above with a burst; POST ONCE pill on "once"',
      draw(lt, d, t) {
        bg();
        const up = lt > po;
        K.man({ x: 400, y: 1020, s: 0.62, arm: up ? K.ARM.point : K.PHONE_ARM, finger: up ? 0.3 : null, armL: K.PHONE_ARM, holding: up ? undefined : creatorPhone, eyes: 'n', mouth: up ? 'grin' : 'smile', brow: 0.6, look: 0.5 });
        if (up) { const u = E(seg(lt, po, po + 0.3)); K.mediaCard(760, 520, 1.3 * u, 'video', -0.06); if (lt < po + 0.5) K.burst(760, 520, 2.2, clamp(1 - (lt - po) * 2)); }
        if (lt > on) K.pill('POST ONCE', 760, 300, 66, C.yellow, C.ink, E(seg(lt, on, on + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + po, 'pop', { gain: 0.4 }); cue(st + on, 'pop', { gain: 0.3 });
  }

  // ── 6 · and every subscriber gets a copy. ──
  {
    const st = cut(5), ev = at('every', 5) - st, su = at('subscriber', 5) - st, co = at('copy', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.08, note: 'video card top centre; 6 fans with bells below; from "every" copies fly out to all six at once; bells ring on "copy"; 1 POST → ALL pill',
      draw(lt, d, t) {
        warm();
        K.mediaCard(540, 430, 1.1, 'video');
        const g = seg(lt, ev, co);
        FANS.forEach(([x, y], k) => {
          K.personIcon(x, y - 40, 1.15, MCOL[k]);
          const ring = lt > co ? 1 : 0; K.bell(x + 55, y - 130, 0.32, ring, 0, t + k);
          if (g > 0 && g < 1) { const [cx, cy] = K.arcAt(540, 500, x, y - 230, 60, eio(g)); K.mediaCard(cx, cy, 0.38, 'video'); }
        });
        if (lt > su) K.pill('SUBSCRIBERS', 540, 250, 60, C.red, C.white, E(seg(lt, su, su + 0.25)));
        if (lt > co) K.pill('1 POST → ALL', 540, 700, 64, C.yellow, C.ink, E(seg(lt, co, co + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ev, 'slide', { dur: 0.6, gain: 0.22 }); cue(st + su, 'pop', { gain: 0.25 }); cue(st + co, 'sparkle', { dur: 0.5, gain: 0.25 });
  }

  // ── 7 · That's pub sub: publish, subscribe. ──
  {
    const st = cut(6), pu = at('pub', 6) - st, pb = at('publish', 6) - st, sb = at('subscribe', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 700], zoom: 0.12, note: 'PUB / SUB slams on "pub"; on "publish" left a video card with an outgoing arrow + PUBLISH; on "subscribe" right a bell + SUBSCRIBE button flips to SUBSCRIBED',
      draw(lt, d, t) {
        bg();
        if (lt > pu && lt < pu + 0.5) K.burst(540, 380, 3.4, clamp(1 - (lt - pu) * 2));
        if (lt <= pu) K.pill('???', 540, 380, 110, C.ink, C.white, E(seg(lt, 0, 0.25)));
        if (lt > pu) K.pill('PUB / SUB', 540, 380, 110, C.yellow, C.ink, lerp(1.6, 1, eo(seg(lt, pu, pu + 0.2))));
        K.topicHub(540, 760, 0.6, null, t, 0.6, E(seg(lt, 0.05, 0.35)) * (1 - clamp((lt - pb) * 3)));
        if (lt > pb) { const s = E(seg(lt, pb, pb + 0.25)); K.mediaCard(280, 760, 0.9 * s, 'video'); K.arrow(280, 960, 200, Math.PI / 2, s); K.pill('PUBLISH', 280, 1120, 54, C.ink, C.white, s); }
        if (lt > sb) { const s = E(seg(lt, sb, sb + 0.25)); K.bell(800, 760, 0.7 * s, lt > sb + 0.4 ? 1 : 0, 0, t); K.subscribeBtn(800, 1000, 0.75, lt > sb + 0.4 ? 1 : 0, s); K.pill('SUBSCRIBE', 800, 1120, 54, C.ink, C.white, s); }
      } });
    cue(st, 'whoosh'); cue(st + pu, 'slam', { gain: 0.4 }); cue(st + pb, 'pop', { gain: 0.3 }); cue(st + sb, 'pop', { gain: 0.3 }); cue(st + sb + 0.4, 'pop', { gain: 0.2 });
  }

  // ── 8 · So when you place an order, ──
  {
    const st = cut(7), or = at('order', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 720], zoom: 0.1, note: 'phone rises with the shop BUY screen; finger taps BUY on "order" (ripple)',
      draw(lt, d, t) {
        warm();
        const pr = lt > or ? 1 : 0;
        K.phone(540, lerp(1300, 700, eo(seg(lt, 0, 0.4))), 0.75, () => K.buyScreen(pr));
        if (lt > or - 0.3) K.tapFinger(540, 700 + 220 * 0.75, seg(lt, or - 0.3, or), pr);
        if (lt > or) { K.ripple(540, 700 + 220 * 0.75, seg(lt, or, or + 0.6)); K.pill('ORDER!', 540, 220, 70, GREEN, C.white, E(seg(lt, or, or + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 0.4, gain: 0.18 }); cue(st + or, 'pop', { gain: 0.45 });
  }

  // ── 9 · the shop publishes one message to a topic. ──
  {
    const st = cut(8), sh = at('shop', 8) - st, pu = at('publishes', 8) - st, to = at('topic', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 700], zoom: 0.1, note: 'SHOP box bottom-left; on "publishes" one yellow card arcs up into the TOPIC hub (ORDER PLACED) top-right; hub rings pulse; TOPIC pill',
      draw(lt, d, t) {
        warm();
        K.serviceBox(250, 960, 0.9, 'SHOP', BLUE, t, null, E(seg(lt, sh - 0.25, sh + 0.05)));
        const hs = E(seg(lt, 0.05, 0.35));
        K.topicHub(720, 520, 0.95, 'ORDER PLACED', t, lt > to ? 1 : 0, hs);
        const u = eio(seg(lt, pu, to + 0.05));
        if (lt > pu && u < 1) { const [x, y] = K.arcAt(250, 840, 720, 520, 160, u); K.msgCard(x, y, 0.85, C.yellow); }
        else if (lt <= pu) K.msgCard(250, 790, 0.85 * E(seg(lt, sh, sh + 0.25)), C.yellow);
        if (lt > to) K.pill('TOPIC', 720, 230, 72, C.yellow, C.ink, E(seg(lt, to, to + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sh, 'pop', { gain: 0.3 }); cue(st + pu, 'slide', { dur: 0.6, gain: 0.22 }); cue(st + to, 'thud', { gain: 0.3 });
  }

  // ── 10 · Email sends your receipt, ──
  {
    const st = cut(9), em = at('email', 9) - st, re = at('receipt', 9) - st;
    add({ id: 'S10', at: st, cam: [200, 900], zoom: 0.1, note: 'hub top, three subscriber boxes; a copy flies to EMAIL (others dimmed); envelope pops above EMAIL on "receipt"',
      draw(lt, d, t) {
        subScene(lt, t, [seg(lt, em - 0.1, re), 0, 0], [1, 1, 1], 0);
        if (lt > re) K.envelope(200, 720, 0.6 * E(seg(lt, re, re + 0.25)), -0.08, 'RECEIPT');
      } });
    cue(st, 'whoosh'); cue(st + em, 'slide', { dur: 0.5, gain: 0.2 }); cue(st + re, 'pop', { gain: 0.35 });
  }

  // ── 11 · the warehouse packs your box, ──
  {
    const st = cut(10), wa = at('warehouse', 10) - st, bo = at('box', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 900], zoom: 0.1, note: 'same scene; a copy flies to STOCK (warehouse); parcel drops above it on "box"; WAREHOUSE pill',
      draw(lt, d, t) {
        subScene(lt, t, [1, seg(lt, wa - 0.15, bo), 0], [1, 1, 1], 1);
        K.envelope(200, 720, 0.45, -0.08);
        if (lt > wa) K.pill('WAREHOUSE', 540, 1180, 50, C.ink, C.white, E(seg(lt, wa, wa + 0.25)));
        if (lt > bo) K.parcel(700, lerp(560, 720, eob(seg(lt, bo, bo + 0.3))), 0.75, 0.05);
      } });
    cue(st, 'whoosh'); cue(st + wa, 'slide', { dur: 0.5, gain: 0.2 }); cue(st + bo + 0.2, 'thud', { gain: 0.35 });
  }

  // ── 12 · and rewards adds your points, all at once. ──
  {
    const st = cut(11), rw = at('rewards', 11) - st, po = at('points', 11) - st, on = at('once', 11) - st, al = at('all', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 800], zoom: 0.08, note: 'copy flies to REWARDS; coin spins on "points"; on "all" the hub replays all three copies flying at the same moment; ALL AT ONCE pill',
      draw(lt, d, t) {
        const rep = lt > al ? seg(lt, al, on + 0.25) : 0;
        const g2 = seg(lt, rw - 0.15, po);
        const got = rep > 0 ? [rep, rep, rep] : [1, 1, g2];
        subScene(lt, t, got, [1, 1, 1]);
        K.envelope(200, 720, 0.45, -0.08); K.parcel(700, 720, 0.6, 0.05);
        if (lt > po) K.rewardCoin(880, 720, 0.8 * E(seg(lt, po, po + 0.25)), (lt - po) * 1.5);
        if (lt > on) K.pill('ALL AT ONCE', 540, 1180, 62, C.yellow, C.ink, E(seg(lt, on, on + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + rw, 'slide', { dur: 0.5, gain: 0.2 }); cue(st + po, 'sparkle', { dur: 0.4, gain: 0.2 }); cue(st + al, 'slide', { dur: 0.5, gain: 0.25 }); cue(st + on, 'pop', { gain: 0.4 });
  }

  // ── 13 · The shop doesn't even know who's listening. ──
  {
    const st = cut(12), dn = at("doesn't", 12) - st, kn = at('know', 12) - st, li = at('listening', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 760], zoom: 0.1, note: 'SHOP box left with a thought bubble "?"; hub middle; listeners on the right hidden behind a navy curtain; on "listening" a yellow ? shows; DOESN\'T KNOW pill',
      draw(lt, d, t) {
        warm();
        K.serviceBox(200, 900, 0.8, 'SHOP', BLUE, t);
        K.topicHub(480, 560, 0.7, 'TOPIC', t, 0.6);
        for (let k = 0; k < 3; k++) K.serviceBox(830, 420 + k * 280, 0.45, '', MCOL[k + 1], t + k);
        ctx.save(); rr(700, 230, 260, 900, 30); ctx.fillStyle = C.navy; ctx.globalAlpha = lerp(0.95, 0.75, clamp((lt - li) * 3)); ctx.fill(); ctx.restore();
        if (lt > li) { ctx.save(); ctx.fillStyle = C.yellow; ctx.font = '900 150px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.globalAlpha = clamp(E(seg(lt, li, li + 0.25))); ctx.fillText('?', 830, 680); ctx.restore(); }
        if (lt > dn) { const s = E(seg(lt, dn, dn + 0.25)); circle(250, 620, 110 * s, C.white); circle(200, 760, 26 * s, C.white); circle(180, 800, 14 * s, C.white);
          ctx.fillStyle = C.ink; ctx.font = `900 ${Math.max(1, 130 * s)}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?', 250, 625); }
        if (lt > kn) K.pill("DOESN'T KNOW", 400, 250, 60, C.red, C.white, E(seg(lt, kn, kn + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + dn, 'pop', { gain: 0.3 }); cue(st + kn, 'pop', { gain: 0.3 }); cue(st + li, 'boing', { gain: 0.25 });
  }

  // ── 14 · Need a new feature? Just subscribe it. ──
  {
    const st = cut(13), ne = at('new', 13) - st, su = at('subscribe', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.1, note: 'hub top + 3 subscribers; on "new" a 4th purple STATS box pops in with a SUBSCRIBE button; on "subscribe" the button flips + a dashed line draws from the hub + a copy arrives',
      draw(lt, d, t) {
        warm();
        K.topicHub(540, 420, 0.7, 'TOPIC', t, 1);
        const xs = [170, 390, 610];
        xs.forEach((x, k) => { K.dashArc(540, 490, x, 850, 30, 1, C.ink, 8, 0.3); K.serviceBox(x, 960, 0.6, ['EMAIL', 'STOCK', 'REWARDS'][k], [BLUE, ORANGE, GREEN][k], t + k); });
        const ns = E(seg(lt, ne - 0.15, ne + 0.15));
        K.serviceBox(850, 960, 0.6, 'STATS', PURPLE, t, lt > su + 0.6 ? 'ok' : null, ns);
        if (lt < su + 0.4) K.subscribeBtn(850, 740, 0.55, lt > su ? 1 : 0, ns);
        if (lt > su) { K.dashArc(540, 490, 850, 850, 30, eo(seg(lt, su, su + 0.4)), PURPLE, 10, 0.8); const g = seg(lt, su + 0.2, su + 0.7); if (g > 0 && g < 1) { const [x, y] = K.arcAt(540, 490, 850, 850, 30, eio(g)); K.msgCard(x, y, 0.6, C.yellow); } }
        if (lt > ne) K.pill('NEW FEATURE', 540, 1150, 58, PURPLE, C.white, E(seg(lt, ne, ne + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ne, 'pop', { gain: 0.35 }); cue(st + su, 'pop', { gain: 0.3 }); cue(st + su + 0.2, 'slide', { dur: 0.5, gain: 0.2 }); cue(st + su + 0.6, 'sparkle', { dur: 0.4, gain: 0.2 });
  }

  // ── 15 · The shop never changes. ──
  {
    const st = cut(14), nv = at('never', 14) - st, ch = at('changes', 14) - st;
    add({ id: 'S15', at: st, cam: [540, 700], zoom: 0.12, note: 'SHOP box big centre; on "never" a green tick + burst; on "changes" 0 CHANGES pill slams',
      draw(lt, d, t) {
        bg();
        K.serviceBox(540, 700, 1.4, 'SHOP', BLUE, t, lt > nv ? 'ok' : null);
        if (lt > nv && lt < nv + 0.5) K.burst(540, 620, 2.6, clamp(1 - (lt - nv) * 2));
        if (lt > ch) K.pill('0 CHANGES', 540, 300, 80, GREEN, C.white, lerp(1.5, 1, eo(seg(lt, ch, ch + 0.2))));
      } });
    cue(st, 'whoosh'); cue(st + nv, 'pop', { gain: 0.35 }); cue(st + ch, 'slam', { gain: 0.3 });
  }

  // ── 16 · Post once. Everyone who cares hears it. ──
  {
    const st = cut(15), on = at('once', 15) - st, ev = at('everyone', 15) - st, ca = at('cares', 15) - st, he = at('hears', 15) - st;
    add({ id: 'S16', at: st, cam: [540, 760], zoom: 0.1, note: 'creator close-up holds phone up, winks on "hears"; on "everyone" fans with bells pop around him; bells ring on "cares"; POST ONCE pill',
      draw(lt, d, t) {
        bg();
        const ring = [[230, 440], [850, 440], [200, 780], [880, 780]];
        ring.forEach(([x, y], k) => { const s = E(seg(lt, ev + k * 0.06, ev + k * 0.06 + 0.25)); K.personIcon(x, y, 1.3 * s, MCOL[k + 1]); K.bell(x + 60, y - 110, 0.3 * s, lt > ca ? 1 : 0, 0, t + k); });
        K.man({ x: 540, y: 1000, s: 0.6, arm: K.ARM.wave, holding: creatorPhone, eyes: lt > he ? 'wink' : 'n', mouth: lt > he ? 'grin' : 'smile', brow: 0.6 });
        if (lt > on) K.pill('POST ONCE', 540, 200, 70, C.yellow, C.ink, E(seg(lt, on, on + 0.25)));
        if (lt > he && lt < he + 0.5) K.burst(770, 380, 1.6, clamp(1 - (lt - he) * 2));
      } });
    cue(st, 'whoosh'); cue(st + on, 'pop', { gain: 0.35 }); cue(st + ev, 'pop', { gain: 0.2 }); cue(st + ca, 'sparkle', { dur: 0.5, gain: 0.22 }); cue(st + he, 'pop', { gain: 0.3 });
  }

  // ── 17 · Tomorrow: monolith versus microservices. ──
  {
    const st = cut(16), to = at('tomorrow', 16) - st, mo = at('monolith', 16) - st, mi = at('microservices', 16) - st;
    add({ id: 'S17', at: st, cam: [540, 700], zoom: 0.03, note: 'DAY 17 / 30; NEXT pill; one big navy MONOLITH block splits into six coloured service blocks on "microservices"',
      draw(lt, d, t) {
        bg();
        K.pill('DAY 17 / 30', 540, 170, 64, C.yellow, C.ink, E(seg(lt, 0, 0.25)));
        if (lt > to) K.pill('NEXT: MONOLITH VS MICRO', 540, 310, 52, C.ink, C.white, E(seg(lt, to, to + 0.25)));
        K.splitBlock(540, 760, 1.1 * E(seg(lt, 0.05, 0.35)), eo(seg(lt, mi, mi + 0.5)), t);
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + to, 'pop', { gain: 0.3 }); cue(st + mo, 'thud', { gain: 0.3 }); cue(st + mi, 'sparkle', { dur: 0.5, gain: 0.25 });
  }

  return { shots: S, cues: CUES };
}
