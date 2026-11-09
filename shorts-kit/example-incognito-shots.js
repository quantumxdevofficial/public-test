// WHAT DOES INCOGNITO MODE ACTUALLY HIDE?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));   // E(0) can be a tiny positive float: keep hidden things hidden
const SITES = ['shoes.com', 'news.com', 'recipes.net', 'games.io'];
const darkPage = () => { ctx.fillStyle = '#353B48'; ctx.fillRect(-300, -180, 600, 360); };
const floor = () => { fillAll(C.sky); ctx.fillStyle = C.floor; ctx.fillRect(-300, 1060, W + 600, 900); };

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · HOOK: hero at laptop, eye mask drops on "incognito"; HIDES WHAT? on "hide" ──
  {
    const st = cut(0), ic = Wd('incognito', 0) - st, hd = Wd('hide', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 720], zoom: 0.07, note: 'room; hero points at laptop; mask drops above the laptop on "incognito"; HIDES WHAT? pill on "hide"',
      draw(lt, d, t) {
        K.room();
        K.man({ x: 300, y: 1230, s: 1.1, arm: K.ARM.point, finger: -0.4, eyes: lt > hd ? 'wide' : 'n', mouth: lt > hd ? 'o' : 'smile', brow: lt > hd ? 1 : 0.3, look: 0.6 });
        K.laptop(790, 900, 0.55, darkPage);
        if (lt > ic) { const y = lerp(-300, 560, eob(seg(lt, ic, ic + 0.45))); K.mask(790, y, 1.0, Math.sin(lt * 2.4) * 0.08); }
        if (lt > hd) K.pill('HIDES WHAT?', 540, 250, 70, C.yellow, C.ink, E(seg(lt, hd, hd + 0.25)));
      } });
    cue(st + ic, 'zip', { gain: 0.4 }); cue(st + ic + 0.4, 'thud', { gain: 0.5 }); cue(st + hd, 'boing', { gain: 0.4 });
  }

  // ── 2 · open a private window ─────────────────────────────────────────
  {
    const st = cut(1), pv = Wd('private', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 760], zoom: 0.1, note: 'normal browser window flips to a dark private window on "private"; mask in the middle',
      draw(lt, d, t) {
        fillAll(C.sky);
        const f = seg(lt, pv - 0.2, pv + 0.1), sx = Math.max(0.02, Math.abs(Math.cos(f * Math.PI)));
        ctx.save(); ctx.translate(540, 760); ctx.scale(sx, 1);
        if (f < 0.5) K.browser(0, 0, 880, 760, 'new tab', null, lerp(0.85, 1, E(seg(lt, 0, 0.35))));
        else K.privateBrowser(0, 0, 880, 760, () => K.mask(0, -10, 1, 0, '#4A5160'));
        ctx.restore();
        if (f >= 1) { K.burst(540, 760, 4.5, clamp(1 - (lt - pv - 0.1) * 2.5)); K.pill('PRIVATE WINDOW', 540, 260, 64, C.yellow, C.ink, E(seg(lt, pv + 0.1, pv + 0.35))); }
      } });
    cue(st, 'whoosh'); cue(st + pv - 0.2, 'zip', { gain: 0.35 }); cue(st + pv + 0.1, 'pop', { gain: 0.5 });
  }

  // ── 3 · a fresh, empty session ───────────────────────────────────────
  {
    const st = cut(2), fr = Wd('fresh', 2) - st, em = Wd('empty', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 720], zoom: 0.12, note: 'empty jar labelled SESSION; stars sparkle on "fresh"; EMPTY pill on "empty"',
      draw(lt, d, t) {
        fillAll(C.bg); circle(540, 740, 520, '#E4DCCB');
        K.jar(540, 780, 1.1, 0, 0, 'SESSION');
        if (lt > fr) { for (let i = 0; i < 5; i++) { const a = i * 1.26 + lt, r = 360 + Math.sin(lt * 3 + i) * 20; K.star(540 + Math.cos(a) * r, 740 + Math.sin(a) * r * 0.8, 30 * E(seg(lt, fr + i * 0.05, fr + 0.3 + i * 0.05))); } }
        if (lt > em) K.pill('EMPTY', 540, 1160, 60, C.ink, C.white, E(seg(lt, em, em + 0.25)));
        if (lt > fr) K.pill('FRESH START', 540, 250, 66, C.yellow, C.ink, E(seg(lt, fr, fr + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + fr, 'sparkle', { dur: 0.6, gain: 0.3 }); cue(st + em, 'pop', { gain: 0.4 });
  }

  // ── 4 · close it → it throws it all away ─────────────────────────────
  {
    const st = cut(3), cl = Wd('close', 3) - st, th = Wd('throws', 3) - st, aw = Wd('away', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 760], zoom: 0.08, note: 'private window; finger taps red close dot on "close"; window shrinks into trash can on "throws"; lid shuts on "away"',
      draw(lt, d, t) {
        floor();
        const sh = eio(seg(lt, th, aw)), lid = lt < th - 0.2 ? 0 : lt < aw ? eo(seg(lt, th - 0.2, th)) : 1 - eob(seg(lt, aw, aw + 0.3));
        K.trashCan(540, 1000, 0.95, lid, 0, lt > aw && lt < aw + 0.4 ? Math.sin(lt * 60) * 6 : 0);
        if (sh < 1) K.privateBrowser(540, lerp(540, 860, sh), 760, 560, () => K.mask(0, -10, 0.8, 0, '#4A5160'), lerp(1, 0.08, sh));
        const cx = 540 - 380 + 40, cy = 540 - 280 + 46;
        if (sh === 0) { ctx.save(); ctx.translate(cx, cy); ctx.scale(0.6, 0.6); K.tapFinger(0, 0, eo(seg(lt, cl - 0.35, cl)), lt > cl && lt < cl + 0.2 ? 1 : 0); ctx.restore(); K.ripple(cx, cy, seg(lt, cl, cl + 0.4)); }
        if (lt > aw) K.pill('ALL GONE', 540, 230, 70, C.yellow, C.ink, E(seg(lt, aw, aw + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + cl, 'pop', { gain: 0.35 }); cue(st + th, 'slide', { dur: 0.5, gain: 0.35 }); cue(st + aw, 'thud', { gain: 0.5 });
  }

  // ── 5a · history + cookies fly into the trash ────────────────────────
  {
    const st = cut(4), hi = Wd('history', 4) - st, ck = Wd('cookies', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 720], zoom: 0.08, note: 'history card on "history" then rows wipe out; cookie on "cookies" arcs into the trash',
      draw(lt, d, t) {
        floor();
        K.trashCan(860, 1000, 0.7, 0.7, 0);
        if (lt > hi) K.historyCard(400, 560, 0.95 * E(seg(lt, hi - 0.05, hi + 0.25)), SITES, 4, seg(lt, ck - 0.1, ck + 0.5), 'HISTORY', -0.03);
        if (lt > ck) { const u = eio(seg(lt, ck, ck + 0.7)); if (u < 1) { const [x, y] = K.arcAt(400, 950, 860, 860, 280, u); K.cookie(x, y, 0.55 * lerp(1, 0.6, u), lt * 6); } }
        if (lt > ck) K.pill('COOKIES TOO', 540, 230, 60, C.yellow, C.ink, E(seg(lt, ck, ck + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + hi, 'pop', { gain: 0.4 }); cue(st + ck, 'slide', { dur: 0.6, gain: 0.3 }); cue(st + ck + 0.7, 'thud', { gain: 0.35 });
  }

  // ── 5b · whatever you typed into forms ───────────────────────────────
  {
    const st = Wd('whatever', 4) - 0.1, ty = Wd('typed', 4) - st, fm = Wd('forms', 4) - st;
    add({ id: 'S06', at: st, cam: [540, 700], zoom: 0.12, note: 'form card types "Sam Lee"; on "forms" text clears and a WIPED pill pops',
      draw(lt, d, t) {
        fillAll(C.bg); circle(540, 720, 520, '#E4DCCB');
        const chars = lt < fm ? 7 * seg(lt, 0.05, ty + 0.3) : 7 * (1 - seg(lt, fm, fm + 0.35));
        K.formCard(540, 720, 1.4, 'YOUR NAME', 'Sam Lee', chars, -0.02);
        if (lt > fm + 0.35) { K.burst(540, 720, 3.5, clamp(1 - (lt - fm - 0.35) * 3)); K.pill('WIPED', 540, 260, 72, C.yellow, C.ink, E(seg(lt, fm + 0.3, fm + 0.55))); }
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'tock', { gain: 0.25 }); cue(st + 0.4, 'tock', { gain: 0.25 }); cue(st + fm, 'zip', { gain: 0.35 }); cue(st + fm + 0.35, 'pop', { gain: 0.45 });
  }

  // ── 6 · next person on that laptop sees nothing ─────────────────────
  {
    const st = cut(5), ps = Wd('person', 5) - st, lp = Wd('laptop', 5) - st, nt = Wd('nothing', 5) - st;
    add({ id: 'S07', at: st, cam: [540, 760], zoom: 0.08, note: 'buddy slides in on "person"; laptop history screen says "No history yet" from "laptop"; check + SEES NOTHING on "nothing"',
      draw(lt, d, t) {
        K.room();
        K.laptop(400, 760, 0.85, () => { ctx.fillStyle = C.white; ctx.fillRect(-300, -180, 600, 360); ctx.fillStyle = '#6B4FA0'; ctx.fillRect(-300, -180, 600, 70);
          ctx.fillStyle = C.white; ctx.font = '900 40px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('HISTORY', -260, -145);
          if (lt > lp) { ctx.fillStyle = '#9AA1AE'; ctx.font = '800 44px Inter'; ctx.textAlign = 'center'; ctx.fillText('No history yet', 0, 30); } });
        const bx = lerp(1350, 880, eo(seg(lt, ps - 0.3, ps + 0.3)));
        K.buddy(bx, 980, 1.5, '#E57A8A');
        if (lt > nt) { K.check(400, 700, 0.8 * E(seg(lt, nt, nt + 0.25))); K.pill('SEES NOTHING', 540, 250, 66, C.yellow, C.ink, E(seg(lt, nt, nt + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + ps - 0.3, 'slide', { dur: 0.5, gain: 0.3 }); cue(st + nt, 'pop', { gain: 0.5 });
  }

  // ── 7 · BUT here's the twist ─────────────────────────────────────────
  {
    const st = cut(6), tw = Wd('twist', 6) - st;
    add({ id: 'S08', at: st, cam: [540, 700], zoom: 0.2, note: 'red bg; hero close-up shocked; warning sign on "twist"',
      draw(lt, d, t) {
        fillAll(C.red); K.shockLines(540, 760, 520, 0.5);
        K.man({ x: 540, y: 1250, s: 1.6, eyes: 'wide', mouth: 'o', brow: 1, look: 0 });
        if (lt > tw) K.warning(540, 280, E(seg(lt, tw, tw + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + tw, 'slam', { gain: 0.55 }); cue(st, 'alarm', { dur: 0.9, gain: 0.2 });
  }

  // ── 8 · school/office Wi-Fi and your internet provider ─────────────
  {
    const st = cut(7), sc = Wd('school', 7) - st, wf = Wd('office', 7) - st, ip = Wd('internet', 7) - st;
    add({ id: 'S09', at: st, cam: [540, 760], zoom: 0.06, note: 'private laptop bottom-left; router (SCHOOL / OFFICE) pops on "school"; ISP building on "internet"; packet hops laptop→router→ISP; eyes over ISP',
      draw(lt, d, t) {
        floor();
        K.laptop(230, 960, 0.42, darkPage); K.mask(230, 960, 0.45, 0, '#4A5160');
        const rs = E(seg(lt, sc, sc + 0.3)), is = E(seg(lt, ip, ip + 0.3));
        if (rs > 0) { ctx.save(); ctx.translate(540, 760); ctx.scale(rs, rs); K.router(0, 0, 0.55, t); ctx.restore(); K.pill('SCHOOL / OFFICE', 540, 880, 40, C.ink, C.white, rs); }
        if (lt > wf) K.waves(540, 650, t, { ang: -Math.PI / 2, spread: 0.7, n: 3, maxR: 200, a: 0.7 });
        if (is > 0) { K.ispBuilding(880, 660, 0.75 * is, 'ISP', t); K.pill('INTERNET PROVIDER', 800, 1000, 40, C.ink, C.white, is); }
        const u1 = eio(seg(lt, sc + 0.2, wf + 0.6)), u2 = eio(seg(lt, ip + 0.2, ip + 0.9));
        if (u1 > 0 && u1 < 1) { const [x, y] = K.arcAt(300, 880, 540, 720, 160, u1); K.packet(x, y, 0.55, ''); }
        if (u2 > 0 && u2 < 1) { const [x, y] = K.arcAt(540, 720, 860, 640, 200, u2); K.packet(x, y, 0.55, ''); }
        if (lt > ip) K.peekEyes(880, 330, 0.9 * E(seg(lt, ip + 0.4, ip + 0.7)), Math.sin(lt * 2), 0);
      } });
    cue(st, 'whoosh'); cue(st + sc, 'pop', { gain: 0.4 }); cue(st + sc + 0.2, 'slide', { dur: 0.7, gain: 0.25 }); cue(st + ip, 'pop', { gain: 0.45 });
  }

  // ── 9 · can still see which sites you visit ─────────────────────────
  {
    const st = cut(8), se = Wd('see', 8) - st, si = Wd('sites', 8) - st;
    add({ id: 'S10', at: st, cam: [540, 700], zoom: 0.12, note: 'navy bg; big peeking eyes on top; site-name pills stream across; they turn yellow on "sites"',
      draw(lt, d, t) {
        fillAll(C.navy);
        K.peekEyes(540, 380, 2.0 * E(seg(lt, 0, 0.3)), Math.sin(lt * 3.2), lt > se && lt < se + 0.15 ? 1 : 0, '#2A2F3A');
        for (let i = 0; i < 4; i++) {
          const u = (lt * 0.45 + i * 0.3) % 1.2, x = lerp(-200, 1280, u / 1.2), y = 760 + (i % 2) * 200;
          K.pill(SITES[i], x, y, 44, lt > si ? C.yellow : C.white, C.ink, 1);
        }
        if (lt > si) K.pill('THEY SEE THE SITES', 540, 1160, 50, C.red, C.white, E(seg(lt, si, si + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + se, 'pop', { gain: 0.35 }); cue(st + si, 'slam', { gain: 0.4 });
  }

  // ── 10 · websites still see your IP address ─────────────────────────
  {
    const st = cut(9), wb = Wd('websites', 9) - st, ip = Wd('ip', 9) - st, ad = Wd('address', 9) - st;
    add({ id: 'S11', at: st, cam: [540, 740], zoom: 0.08, note: 'laptop left, website server right; packet flies on "websites"; IP chip on "ip"; label on "address"',
      draw(lt, d, t) {
        floor();
        K.laptop(230, 920, 0.42, darkPage); K.mask(230, 920, 0.45, 0, '#4A5160');
        K.server(820, 760, 0.7, t);
        K.pill('WEBSITE', 820, 1030, 44, C.ink, C.white, E(seg(lt, wb, wb + 0.25)));
        const u = eio(seg(lt, wb, ip));
        if (u > 0 && u < 1) { const [x, y] = K.arcAt(300, 840, 760, 640, 220, u); K.packet(x, y, 0.55, ''); }
        if (lt > ip) K.chip(540, 360, 0.85 * E(seg(lt, ip, ip + 0.3)), '203.0.113.7', 'plain', 1e9, 0, lt > ad ? 'YOUR IP ADDRESS' : null);
      } });
    cue(st, 'whoosh'); cue(st + wb, 'slide', { dur: 0.5, gain: 0.3 }); cue(st + ip, 'pop', { gain: 0.5 });
  }

  // ── 11 · Google even agreed in 2024 ─────────────────────────────────
  {
    const st = cut(10), gg = Wd('google', 10) - st, ag = Wd('agreed', 10) - st, tw = Wd('twenty', 10) - st;
    add({ id: 'S12', at: st, cam: [540, 720], zoom: 0.1, note: 'GOOGLE pill; gavel swings and slams on "agreed"; calendar 2024 drops on "twenty"',
      draw(lt, d, t) {
        fillAll(C.bg); circle(540, 740, 540, '#E4DCCB');
        K.pill('GOOGLE', 540, 250, 70, C.ink, C.white, E(seg(lt, gg, gg + 0.25)));
        const up = lt < ag - 0.3 ? 1 : lt < ag ? 1 - eio(seg(lt, ag - 0.3, ag)) : 0;
        K.gavelBlock(300, 960, 0.9);
        K.gavel(300, lerp(812, 600, up), 0.8, -1.3 - up * 0.25);
        if (lt > ag) K.burst(300, 930, 2.6, clamp(1 - (lt - ag) * 2.5));
        if (lt > tw) bigText('2024', 730, lerp(-200, 720, eob(seg(lt, tw, tw + 0.45))), 160, C.yellow, 0.06);
        if (lt > ag) K.pill('LAWSUIT SETTLED', 540, 1160, 50, C.yellow, C.ink, E(seg(lt, ag + 0.1, ag + 0.35)));
      } });
    cue(st, 'whoosh'); cue(st + gg, 'pop', { gain: 0.4 }); cue(st + ag, 'slam', { gain: 0.55 }); cue(st + tw + 0.4, 'thud', { gain: 0.45 });
  }

  // ── 12 · delete billions of records from private browsing ───────────
  {
    const st = cut(11), dl = Wd('delete', 11) - st, bl = Wd('billions', 11) - st, pv = Wd('private', 11) - st;
    add({ id: 'S13', at: st, cam: [540, 740], zoom: 0.1, note: 'record sheets pour from a RECORDS database into a trash can from "delete"; BILLIONS pill on "billions"; mask on the database on "private"',
      draw(lt, d, t) {
        floor();
        K.database(290, 700, 0.8, 0, 'RECORDS');
        K.trashCan(800, 980, 0.85, lt > dl ? 0.8 : 0, 0);
        if (lt > dl) for (let i = 0; i < 14; i++) {
          const k = (lt - dl) * 1.3 - i * 0.13; if (k < 0) continue;
          const u = k % 1.4; if (u > 1) continue;
          const [x, y] = K.arcAt(400, 560, 800, 820, 300, eio(u)); K.recordSheet(x, y, 0.45, u * 5 + i);
        }
        if (lt > bl) K.pill('BILLIONS', 540, 250, 80, C.yellow, C.ink, E(seg(lt, bl, bl + 0.25)));
        if (lt > pv) K.mask(290, 480, 0.55 * E(seg(lt, pv, pv + 0.3)), 0);
      } });
    cue(st, 'whoosh'); cue(st + dl, 'slide', { dur: 1.2, gain: 0.3 }); cue(st + bl, 'pop', { gain: 0.5 }); cue(st + pv, 'pop', { gain: 0.35 });
  }

  // ── 13 · hides you from your laptop, not from the internet (loop) ───
  {
    const st = cut(12), lp = Wd('laptop', 12) - st, nt = Wd('not', 12) - st, it = Wd('internet', 12) - st;
    add({ id: 'S14', at: st, cam: [540, 700], zoom: 0.06, note: 'room; hero with mask pushed up on forehead; laptop + check on "laptop"; globe with eyes on "internet"; finger wag from "not"; wink',
      draw(lt, d, t) {
        K.room();
        const wag = lt > nt ? Math.sin(lt * 11) * 0.35 : 0;
        K.man({ x: 540, y: 1230, s: 0.9, arm: K.armPose(K.ARM.down, K.ARM.point, eo(seg(lt, nt, nt + 0.3))), finger: lt > nt ? wag : null,
          eyes: lt > it + 0.3 ? 'wink' : 'n', mouth: lt > it + 0.3 ? 'grin' : 'smirk', brow: 0.6, look: 0 });
        K.mask(540, 1230 - 0.9 * 400, 0.42, 0);
        const ls = E(seg(lt, lp, lp + 0.3));
        if (ls > 0) { K.laptop(210, 440, 0.32 * ls, darkPage); K.check(210, 430, 0.5 * ls); K.pill('LAPTOP', 210, 600, 44, C.ink, C.white, ls); }
        const gs = E(seg(lt, it, it + 0.3));
        if (gs > 0) { K.globe(870, 430, 1.0 * gs, t); K.peekEyes(870, 430, 0.8 * gs, Math.sin(lt * 3), 0); K.pill('INTERNET', 870, 600, 44, C.red, C.white, gs); }
      } });
    cue(st, 'whoosh'); cue(st + lp, 'pop', { gain: 0.4 }); cue(st + nt, 'pop', { gain: 0.3 }); cue(st + it, 'slam', { gain: 0.45 }); cue(st + it + 0.3, 'boing', { gain: 0.35 });
  }

  return { shots: S, cues: CUES };
}
