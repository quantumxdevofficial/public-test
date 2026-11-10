// WHAT ACTUALLY IS AN IP ADDRESS?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));   // E(0) can be a tiny positive float: keep hidden things hidden
const GREEN = '#5BAE6A', BLUE = '#3A7BD5';
const MY_IP = '98.51.24.6';
const heldPhone = (screen) => (x, y) => K.phone(x + 12, y - 70, 0.3, screen);
const bg = (ring = '#CFE8F3', base = C.sky) => { fillAll(base); circle(540, 740, 560, ring); };
const dotted = (x1, y1, x2, y2, h, u1 = 1, a = 0.25) => K.route(x1, y1, x2, y2, h, 0, u1, a);

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · HOOK: hero with phone; IP label pops on "IP", "?" on "address" ──
  {
    const st = cut(0), ac = Wd('actually', 0) - st, ip = Wd('ip', 0) - st, ad = Wd('address', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 720], zoom: 0.06, note: 'room; hero with phone left; IP ADDRESS label pops right on "IP", digits type in, big ? on "address"',
      draw(lt, d, t) {
        K.room();
        const hit = lt > ip - 0.05;
        K.man({ x: 300, y: 1210, s: 1.0, arm: K.PHONE_ARM, holding: heldPhone(K.homeScreen), eyes: hit ? 'wide' : 'n', mouth: hit ? 'o' : 'smile', brow: hit ? 1 : lt > ac ? 0.6 : 0.2, look: 0.8 });
        if (lt > ip - 0.05) {
          K.ipLabel(770, 760, 0.82, MY_IP, { head: 'IP ADDRESS', chars: (lt - ip) * 22, sc: E(seg(lt, ip - 0.05, ip + 0.25)), rot: -0.06 });
          K.burst(770, 760, 2.6, clamp(1 - (lt - ip) * 2.5));
        }
        if (lt > ad) bigText('?', 900, 460, 210, C.yellow, 0.15, E(seg(lt, ad, ad + 0.25)));
      } });
    cue(st + 0.1, 'tock', { gain: 0.2 }); cue(st + ip, 'pop', { gain: 0.45 }); cue(st + ip + 0.05, 'sparkle', { dur: 0.4, gain: 0.3 }); cue(st + ad, 'boing', { gain: 0.3 });
  }

  // ── 2 · It's like a home address for your phone ───────────────────────
  {
    const st = cut(1), ho = Wd('home', 1) - st, ad = Wd('address', 1) - st, ph = Wd('phone', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 760], zoom: 0.08, note: 'left: house + HOME label on "home"; = sign on "address"; right: phone + IP label on "phone"',
      draw(lt, d, t) {
        bg('#DDEFF6');
        ctx.fillStyle = C.floor; ctx.fillRect(-300, 870, W + 600, 1100);
        const hp = E(seg(lt, ho - 0.15, ho + 0.2));
        K.house(270, 720, 1.25 * hp, '#F29A3A', t);
        if (hp > 0) K.ipLabel(270, 1040, 0.8, '12 MAPLE ST', { head: 'HOME', col: '#F29A3A', sc: E(seg(lt, ho, ho + 0.25)) });
        if (lt > ad) bigText('=', 540, 740, 170, C.yellow, 0, E(seg(lt, ad, ad + 0.2)));
        const pp = E(seg(lt, ph - 0.15, ph + 0.2));
        if (pp > 0) { K.phone(810, 720, 0.52 * pp, K.homeScreen); K.ipLabel(810, 1040, 0.8, MY_IP, { head: 'IP', sc: E(seg(lt, ph, ph + 0.25)) }); }
      } });
    cue(st, 'whoosh'); cue(st + ho, 'pop', { gain: 0.4 }); cue(st + ad, 'pop', { gain: 0.3 }); cue(st + ph, 'pop', { gain: 0.4 });
  }

  // ── 3 · so data knows exactly where to go ─────────────────────────────
  {
    const st = cut(2), da = Wd('data', 2) - st, ex = Wd('exactly', 2) - st, go = Wd('go', 2) - st;
    const G = [850, 380], P = [250, 900];
    add({ id: 'S03', at: st, cam: [540, 700], zoom: 0.1, note: 'globe top right; envelopes addressed TO 98.51.24.6 arc down to the phone from "data"; target rings on "exactly"; check on "go"',
      draw(lt, d, t) {
        bg('#E9E2D2', C.bg);
        dotted(G[0], G[1], P[0] + 60, P[1] - 120, 260, 1, 0.22);
        K.globe(G[0], G[1], 1.3, t);
        if (lt > ex) for (let k = 0; k < 3; k++) { const p = seg(lt, ex + k * 0.12, ex + k * 0.12 + 0.3); ctx.save(); ctx.globalAlpha = clamp(p * 2); ctx.strokeStyle = C.red; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(P[0], P[1], lerp(400, 190 + k * 70, eo(p)), 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
        K.phone(P[0], P[1], 0.5, K.homeScreen);
        for (let k = 0; k < 3; k++) {
          const u = (lt - da) * 0.9 - k * 0.32; if (u <= 0 || u >= 1) continue;
          const [x, y] = K.arcAt(G[0], G[1], P[0] + 60, P[1] - 120, 260, eio(u));
          ctx.save(); ctx.globalAlpha = clamp((1 - u) * 6); K.envelope(x, y, 0.55, -0.15, 'TO ' + MY_IP); ctx.restore();
        }
        if (lt > go) K.check(P[0] + 190, P[1] - 290, 0.55 * E(seg(lt, go, go + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + da, 'slide', { dur: 1.2, gain: 0.3 }); cue(st + ex, 'pop', { gain: 0.35 }); cue(st + go, 'sparkle', { dur: 0.35, gain: 0.35 });
  }

  // ── 4 · It's just four numbers with dots in between ───────────────────
  {
    const st = cut(3), fo = Wd('four', 3) - st, nu = Wd('numbers', 3) - st, dt = Wd('dots', 3) - st, bw = Wd('between', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 720], zoom: 0.07, note: 'four number tiles pop one by one from "four" to "numbers"; red dots pop on "dots"; EACH 0-255 pill on "between"',
      draw(lt, d, t) {
        bg('#FFF1C2', C.bg);
        const step = Math.max(0.1, (nu - fo) / 3);
        const tiles = [0, 1, 2, 3].map((k) => E(seg(lt, fo + k * step - 0.1, fo + k * step + 0.15)));
        K.octets(540, 700, 0.95, ['98', '51', '24', '6'], tiles, E(seg(lt, dt - 0.05, dt + 0.2)));
        if (lt > fo) K.pill('4 NUMBERS', 540, 420, 64, C.ink, C.white, E(seg(lt, fo, fo + 0.25)));
        if (lt > bw) K.pill('EACH ONE: 0 – 255', 540, 990, 56, C.yellow, C.ink, E(seg(lt, bw, bw + 0.25)));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 4; k++) cue(st + fo + k * Math.max(0.1, (Wd('numbers', 3) - Wd('four', 3)) / 3), 'pop', { gain: 0.3 });
    cue(st + dt, 'pop', { gain: 0.4 }); cue(st + bw, 'pop', { gain: 0.35 });
  }

  // ── 5 · When you open a video, your request carries that address ──────
  {
    const st = cut(4), op = Wd('open', 4) - st, rq = Wd('request', 4) - st, ad = Wd('address', 4) - st;
    const P = [230, 760], SV = [860, 720];
    add({ id: 'S05', at: st, cam: [540, 740], zoom: 0.08, note: 'phone (video app) left, finger taps play on "open"; envelope FROM 98.51.24.6 travels to server on "request"; label pops big on "address"',
      draw(lt, d, t) {
        bg('#DDEFF6');
        dotted(P[0] + 100, P[1] - 200, SV[0] - 60, SV[1] - 260, 200, 1, 0.22);
        K.server(SV[0], SV[1], 0.6, t);
        K.phone(P[0], P[1], 0.6, () => K.videoScreen(0, t));
        const tp = seg(lt, op - 0.45, op), back = seg(lt, op + 0.15, op + 0.5);
        K.tapFinger(P[0], P[1] - 42, eo(tp) * (1 - eio(back)), lt > op - 0.05 && lt < op + 0.15 ? 1 : 0);
        K.ripple(P[0], P[1] - 42, seg(lt, op, op + 0.5));
        const u = seg(lt, rq - 0.1, ad + 0.1);
        if (u > 0) {
          const [x, y] = K.arcAt(P[0] + 100, P[1] - 200, SV[0] - 60, SV[1] - 260, 200, eio(u));
          K.envelope(x, y, 0.75 * E(seg(lt, rq - 0.1, rq + 0.15)), 0.1, 'FROM ' + MY_IP);
        }
        if (lt > ad) K.pill('YOUR ADDRESS', 540, 1130, 60, C.yellow, C.ink, E(seg(lt, ad, ad + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + op, 'pop', { gain: 0.4 }); cue(st + rq, 'slide', { dur: 0.9, gain: 0.3 }); cue(st + ad, 'pop', { gain: 0.4 });
  }

  // ── 6 · so the reply finds its way back to you ────────────────────────
  {
    const st = cut(5), re = Wd('reply', 5) - st, yo = Wd('you', 5) - st;
    const P = [230, 760], SV = [860, 720];
    add({ id: 'S06', at: st, cam: [540, 740], zoom: 0.08, note: 'server sends the video envelope TO 98.51.24.6 back along the route from "reply"; lands on phone, video plays + burst on "you"',
      draw(lt, d, t) {
        bg('#DDEFF6');
        dotted(P[0] + 100, P[1] - 200, SV[0] - 60, SV[1] - 260, 200, 1, 0.22);
        K.server(SV[0], SV[1], 0.6, t);
        const play = eo(seg(lt, yo, yo + 0.3));
        K.phone(P[0], P[1], 0.6, () => K.videoScreen(play, t));
        const u = seg(lt, re - 0.1, yo);
        if (u > 0 && u < 1) {
          const [x, y] = K.arcAt(SV[0] - 60, SV[1] - 260, P[0] + 100, P[1] - 200, -200, eio(u));
          K.envelope(x, y, 0.75 * E(seg(lt, re - 0.1, re + 0.15)), -0.1, 'TO ' + MY_IP);
        }
        if (lt > yo) { K.burst(P[0], P[1] - 120, 3, clamp(1 - (lt - yo) * 2.5)); K.check(P[0] + 210, P[1] - 330, 0.5 * E(seg(lt, yo, yo + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + re, 'slide', { dur: 1.0, gain: 0.3 }); cue(st + yo, 'sparkle', { dur: 0.4, gain: 0.4 });
  }

  // ── 7 · But here's the surprise ───────────────────────────────────────
  {
    const st = cut(6), su = Wd('surprise', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 760], zoom: 0.14, note: 'hero close-up; brows rise on "here\'s"; shock + ! on "surprise"',
      draw(lt, d, t) {
        K.room();
        const shocked = lt > su;
        const shake = shocked ? Math.sin(lt * 70) * 6 * Math.max(0, 1 - (lt - su) * 2) : 0;
        K.man({ x: 540 + shake, y: 1220, s: 1.6, arm: K.PHONE_ARM, holding: heldPhone(K.homeScreen), eyes: shocked ? 'wide' : 'n', mouth: shocked ? 'o' : 'flat', brow: shocked ? 1 : 0.5 });
        K.shockLines(540, 660, 300, shocked ? clamp((lt - su) * 5) : 0);
        if (shocked) bigText('!', 880, 470, 230, C.yellow, 0.15, E(seg(lt, su, su + 0.2)));
      } });
    cue(st, 'whoosh'); cue(st + su, 'boing', { gain: 0.45 });
  }

  // ── 8 · there are only about four billion of them ─────────────────────
  {
    const st = cut(7), on = Wd('only', 7) - st, fo = Wd('four', 7) - st, th = Wd('them', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 700], zoom: 0.08, note: 'counter 4.3 BILLION IPv4 on "four"; crowd of people fills from "only"; red 8 BILLION PEOPLE pill on "them"',
      draw(lt, d, t) {
        bg('#E9E2D2', C.bg);
        const cnt = clamp(seg(lt, on, fo + 0.3));
        K.counterBox(540, 400, 1.5, cnt < 0.05 ? '?' : cnt < 1 ? (cnt * 4.3).toFixed(1) + 'B' : '4.3B', 'IPv4 ADDRESSES');
        const cols = [BLUE, '#E57A8A', GREEN, '#F29A3A', C.pants];
        const n = Math.floor(clamp(seg(lt, on, th + 0.2)) * 27);
        for (let i = 0; i < n; i++) { const r = Math.floor(i / 9), c = i % 9; K.personIcon(140 + c * 100 + (r % 2) * 30, 870 + r * 120, 0.8, cols[(i * 3) % 5]); }
        if (lt > th) K.pill('8+ BILLION PEOPLE', 540, 700, 58, C.red, C.white, E(seg(lt, th, th + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + fo, 'tock', { gain: 0.3 }); cue(st + on, 'bubbles', { dur: 1.2, gain: 0.2 }); cue(st + th, 'slam', { gain: 0.4 });
  }

  // ── 9 · and the last free blocks were handed out in twenty eleven ─────
  {
    const st = cut(8), la = Wd('last', 8) - st, ou = Wd('out', 8) - st, tw = Wd('twenty', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 700], zoom: 0.08, note: 'shelf of IP crates; crates lift away one by one from "last" to "out"; ALL GONE stamp on "out"; FEB 2011 pill on "twenty"',
      draw(lt, d, t) {
        bg('#DDEFF6');
        K.pill('FREE IPv4 BLOCKS', 540, 300, 56, C.ink, C.white, 1);
        K.blockShelf(540, 760, 1.05, 5, lerp(2, 5, clamp(seg(lt, la - 0.3, ou))));
        if (lt > ou) K.stamp(540, 760, lerp(1.6, 1, eo(seg(lt, ou, ou + 0.2))), 'ALL GONE', -0.15, 1);
        if (lt > tw) K.pill('FEB 2011', 540, 1080, 80, C.yellow, C.ink, E(seg(lt, tw, tw + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + la, 'zip', { gain: 0.3 }); cue(st + ou, 'slam', { gain: 0.45 }); cue(st + tw, 'pop', { gain: 0.4 });
  }

  // ── 10 · So your whole home shares one public address ─────────────────
  {
    const st = cut(9), wh = Wd('whole', 9) - st, sh = Wd('shares', 9) - st, pu = Wd('public', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 700], zoom: 0.08, note: 'big house; family devices pop at its base on "shares"; ONE PUBLIC IP label above the roof on "public" with dotted lines from each device',
      draw(lt, d, t) {
        bg('#DDEFF6');
        ctx.fillStyle = C.floor; ctx.fillRect(-300, 1060, W + 600, 1000);
        K.house(540, 760, 2.1 * E(seg(lt, 0, 0.25)), '#F29A3A', t);
        const devs = [[250, 1120], [430, 1140], [650, 1140], [830, 1120]];
        const pl = E(seg(lt, pu, pu + 0.25));
        devs.forEach(([x, y], k) => {
          const p = E(seg(lt, sh - 0.2 + k * 0.1, sh + 0.05 + k * 0.1)); if (p <= 0) return;
          if (pl > 0) { ctx.save(); ctx.globalAlpha = 0.35 * clamp(pl); ctx.setLineDash([4, 22]); line([[x, y - 90], [540, 300]], C.ink, 10); ctx.restore(); }
          K.phone(x, y, 0.2 * p, k % 2 ? () => K.videoScreen(1, t) : K.homeScreen);
        });
        if (pl > 0) K.ipLabel(540, 250, 0.9, MY_IP, { head: 'ONE PUBLIC IP', sc: pl });
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 4; k++) cue(st + sh - 0.2 + k * 0.1, 'pop', { gain: 0.25 }); cue(st + pu, 'pop', { gain: 0.45 });
  }

  // ── 11 · and your router hands each device a private one ──────────────
  {
    const st = cut(10), ro = Wd('router', 10) - st, ha = Wd('hands', 10) - st, pr = Wd('private', 10) - st;
    const devs = [[200, 950, '192.168.1.2'], [540, 980, '192.168.1.3'], [880, 950, '192.168.1.4']];
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.08, note: 'router top centre pops on "router"; lines grow to three devices from "hands"; PRIVATE labels pop on each from "private"',
      draw(lt, d, t) {
        bg('#E9E2D2', C.bg);
        const R = [540, 520];
        devs.forEach(([x, y], k) => {
          const g = eio(seg(lt, ha + k * 0.15, ha + k * 0.15 + 0.4)); if (g <= 0) return;
          ctx.save(); ctx.setLineDash([4, 22]); line([[R[0], R[1] + 60], [lerp(R[0], x, g), lerp(R[1] + 60, y - 150, g)]], 'rgba(26,26,30,0.35)', 12); ctx.restore();
        });
        K.router(R[0], R[1], 0.8 * E(seg(lt, ro - 0.2, ro + 0.1)), t);
        if (lt > ro) K.waves(R[0], R[1] - 220, t, { ang: -Math.PI / 2, spread: 0.7, n: 3, maxR: 160, a: 0.6 });
        K.phone(devs[0][0], devs[0][1], 0.34, K.homeScreen);
        K.laptop(devs[1][0], devs[1][1], 0.38, () => K.codeScreen(1, t));
        K.phone(devs[2][0], devs[2][1], 0.34, () => K.videoScreen(1, t));
        devs.forEach(([x, y, ip], k) => { const a = pr - 0.1 + k * 0.18; if (lt > a) K.ipLabel(x, 1170, 0.62, ip, { head: 'PRIVATE', col: '#A9D69B', sc: E(seg(lt, a, a + 0.25)) }); });
      } });
    cue(st, 'whoosh'); cue(st + ro, 'pop', { gain: 0.4 }); cue(st + ha, 'slide', { dur: 0.6, gain: 0.25 }); for (let k = 0; k < 3; k++) cue(st + pr - 0.1 + k * 0.18, 'pop', { gain: 0.3 });
  }

  // ── 12 · The real fix is IPv6 ─────────────────────────────────────────
  {
    const st = cut(11), fx = Wd('fix', 11) - st, sx = Wd('six', 11) - st;
    const V6 = '2001:db8:85a3::8a2e:370:7334';
    add({ id: 'S12', at: st, cam: [540, 700], zoom: 0.1, note: 'small IPv4 label top; on "fix" the long IPv6 label types in big below it; IPv6 pill on "six"',
      draw(lt, d, t) {
        bg('#FFF1C2', C.bg);
        K.ipLabel(540, 420, 1.0, MY_IP, { head: 'IPv4 (OLD)', col: '#D9D4CA' });
        if (lt > fx - 0.1) {
          K.ipLabel(540, 720, 0.6, V6, { head: 'IPv6 (NEW)', chars: (lt - fx) * 26, sc: E(seg(lt, fx - 0.1, fx + 0.15)) });
          K.burst(540, 720, 3.2, clamp(1 - (lt - fx) * 2.5));
        }
        if (lt > sx) K.pill('IPv6', 540, 1010, 110, C.yellow, C.ink, E(seg(lt, sx, sx + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + fx, 'pop', { gain: 0.4 }); cue(st + fx + 0.1, 'sparkle', { dur: 0.6, gain: 0.25 }); cue(st + sx, 'pop', { gain: 0.45 });
  }

  // ── 13 · with trillions of trillions for every person alive ───────────
  {
    const st = cut(12), tr = Wd('trillions', 12) - st, pe = Wd('person', 12) - st, al = Wd('alive', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 700], zoom: 0.12, note: 'globe centre sprays little IP crates outward from "trillions" (rate doubles); person pops under globe on "person"; crates pile around them on "alive"',
      draw(lt, d, t) {
        bg('#DDEFF6');
        const P = [540, 1130];
        for (let i = 0; i < 60; i++) {
          const born = tr + i * (i < 20 ? 0.08 : 0.04); if (lt < born) continue;
          const u = ((lt - born) * 0.7) % 1, an = rnd(i) * Math.PI * 2, dist = lerp(240, 560, u);
          ctx.save(); ctx.globalAlpha = clamp((1 - u) * 3); K.packet(540 + Math.cos(an) * dist, 640 + Math.sin(an) * dist * 0.8, 0.42, 'IP', an); ctx.restore();
        }
        K.globe(540, 640, 2.1, t);
        if (lt > pe) {
          K.personIcon(P[0], P[1], 1.6 * E(seg(lt, pe, pe + 0.25)), BLUE);
          for (let k = 0; k < 6; k++) { const a = al + k * 0.08; if (lt > a) K.packet(P[0] + [-170, 170, -270, 270, -110, 110][k], P[1] - [0, 0, -10, -10, 150, 150][k] + 20, 0.5 * E(seg(lt, a, a + 0.2)), 'IP'); }
        }
      } });
    cue(st, 'whoosh'); cue(st + tr, 'sparkle', { dur: 1.6, gain: 0.3 }); cue(st + pe, 'pop', { gain: 0.4 }); cue(st + al, 'pop', { gain: 0.35 });
  }

  // ── 14 · It's not who you are, just where you are ─────────────────────
  {
    const st = cut(13), wo = Wd('who', 13) - st, wh = Wd('where', 13) - st, end = Le(13) - st - 0.35;
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.08, note: 'room; hero right with phone; name card left gets red X on "who"; map pin drops with IP label on "where"; hero winks to camera at the end',
      draw(lt, d, t) {
        K.room();
        K.man({ x: 760, y: 1230, s: 1.25, arm: K.PHONE_ARM, holding: heldPhone(K.homeScreen), eyes: lt > end ? 'wink' : 'n', mouth: lt > end ? 'grin' : 'smile', brow: lt > wh ? 0.6 : 0.2, smirk: lt > end, look: -0.6 });
        const gone = eio(seg(lt, wh - 0.2, wh + 0.1));
        if (gone < 1) {
          ctx.save(); ctx.globalAlpha = 1 - gone;
          K.nameCard(290, 640, 0.85 * E(seg(lt, 0, 0.25)), 'SAM LEE', -0.08);
          if (lt > wo) K.redX(290, 640, lerp(1.0, 0.55, eo(seg(lt, wo, wo + 0.2))), 1);
          ctx.restore();
        }
        if (lt > wh) {
          K.mapPin(290, lerp(150, 820, eob(seg(lt, wh, wh + 0.35))), 1.2);
          K.ipLabel(290, 960, 0.8, MY_IP, { head: 'IP', sc: E(seg(lt, wh + 0.2, wh + 0.45)) });
        }
      } });
    cue(st, 'whoosh'); cue(st + wo, 'slam', { gain: 0.4 }); cue(st + wh + 0.3, 'thud', { gain: 0.4 }); cue(st + end, 'pop', { gain: 0.35 });
  }

  return { shots: S, cues: CUES };
}
