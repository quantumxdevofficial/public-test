// WHAT ACTUALLY IS A VPN?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));   // E(0) can be a tiny positive float: keep hidden things hidden
const heldPhone = (screen) => (x, y) => K.phone(x + 12, y - 70, 0.3, screen);
const GREEN = '#5BAE6A', BLUE = '#3A7BD5';
const bg = (ring = '#CFE8F3', base = C.sky) => { fillAll(base); circle(540, 740, 560, ring); };
const browseScreen = (t) => () => { ctx.fillStyle = '#DCEEF6'; ctx.fillRect(-166, -350, 332, 700); K.webPage(0, -40, 1.25, BLUE); };
// position along a polyline at u 0..1 (equal time per segment)
function along(pts, u) {
  const n = pts.length - 1, k = Math.min(n - 1, Math.floor(clamp(u) * n)), f = clamp(u) * n - k;
  return [lerp(pts[k][0], pts[k + 1][0], f), lerp(pts[k][1], pts[k + 1][1], f)];
}
const dotted = (pts, a = 0.25) => { for (let i = 0; i < pts.length - 1; i++) { ctx.save(); ctx.setLineDash([2, 26]); line([pts[i], pts[i + 1]], `rgba(26,26,30,${a})`, 14); ctx.restore(); } };

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · HOOK: hero with phone; VPN switch slides in and flips ON on "VPN" ──
  {
    const st = cut(0), ac = Wd('actually', 0) - st, vp = Wd('vpn', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 720], zoom: 0.06, note: 'room; hero with phone left; big VPN switch slides in on "actually"; flips ON with burst on "VPN"',
      draw(lt, d, t) {
        K.room();
        const on = eo(seg(lt, vp - 0.1, vp + 0.15)), hit = lt > vp - 0.1;
        K.man({ x: 300, y: 1210, s: 1.0, arm: K.PHONE_ARM, holding: heldPhone(browseScreen(t)), eyes: hit ? 'wide' : 'n', mouth: hit ? 'o' : 'smile', brow: hit ? 1 : 0.4, look: 0.8 });
        const sx = lerp(1500, 780, eob(seg(lt, ac - 0.2, ac + 0.25)));
        K.vpnSwitch(sx, 760, 1.15, on);
        if (hit) { K.burst(780, 760, 2.6, clamp(1 - (lt - vp) * 2.5)); bigText('?', 960, 480, 200, C.yellow, 0.15, E(seg(lt, vp + 0.15, vp + 0.4))); }
      } });
    cue(st + 0.1, 'tock', { gain: 0.2 }); cue(st + ac - 0.2, 'slide', { dur: 0.4, gain: 0.3 }); cue(st + vp, 'pop', { gain: 0.45 }); cue(st + vp + 0.05, 'sparkle', { dur: 0.4, gain: 0.35 });
  }

  // network layout for lines 1-2: phone → router → ISP → internet
  const ME = [170, 820], RT = [440, 860], ISP = [700, 800], NET = [940, 560];
  const chain = [[ME[0] + 40, ME[1] - 60], [RT[0], RT[1] - 60], [ISP[0], ISP[1] - 120], [NET[0], NET[1]]];
  function network(t, upto = 4, ispA = 1) {
    bg('#DDEFF6');
    ctx.fillStyle = C.floor; ctx.fillRect(-300, 1060, W + 600, 900);
    dotted(chain.slice(0, Math.max(1, upto)));
    K.phone(ME[0], ME[1], 0.5, browseScreen(t));
    if (upto >= 2) K.router(RT[0], RT[1] + 80, 0.5, t);
    if (upto >= 3 && ispA > 0) K.ispBuilding(ISP[0], ISP[1] + 30, 0.75 * ispA, 'ISP', t);
    if (upto >= 4) K.globe(NET[0], NET[1], 0.8, t);
  }

  // ── 2 · Everything you do online goes through your Wi-Fi ───────────────
  {
    const st = cut(1), ev = Wd('everything', 1) - st, th = Wd('through', 1) - st, wf = Wd('wifi', 1) - st;
    add({ id: 'S02', at: st, cam: [380, 820], zoom: 0.12, note: 'phone left; packets stream out from "everything"; router pops in on "through"; WI-FI pill on "wifi"',
      draw(lt, d, t) {
        network(t, lt > th ? 2 : 1);
        if (lt > th) K.burst(RT[0], RT[1] + 80, 2, clamp(1 - (lt - th) * 3));
        for (let k = 0; k < 4; k++) {
          const u = (lt - ev) * 0.9 - k * 0.25; if (u <= 0) continue;
          const end = lt > th ? 1 : 0.55, uu = (u % 1) * end, [x, y] = along(chain.slice(0, 2), uu);
          K.packet(x, y - 30, 0.6, '');
        }
        if (lt > wf) { K.wifiIcon(RT[0], RT[1] - 160, 0.8); K.pill('YOUR WI-FI', 440, 300, 64, C.yellow, C.ink, E(seg(lt, wf, wf + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + ev, 'slide', { dur: 0.8, gain: 0.25 }); cue(st + th, 'pop', { gain: 0.4 }); cue(st + wf, 'pop', { gain: 0.4 });
  }

  // ── 3 · and your internet provider, who can see every site you visit ──
  {
    const st = cut(2), pr = Wd('provider', 2) - st, se = Wd('see', 2) - st, si = Wd('site', 2) - st;
    add({ id: 'S03', at: st, cam: [600, 760], zoom: 0.1, note: 'chain grows to ISP building + globe on "provider"; peeking eyes on ISP on "see"; three web page cards pile up (history) from "site"',
      draw(lt, d, t) {
        const ip = E(seg(lt, pr - 0.1, pr + 0.25));
        network(t, ip > 0 ? 4 : 2, ip);
        for (let k = 0; k < 6; k++) { const u = (lt * 0.7 + k / 6) % 1; const [x, y] = along(chain, u); K.packet(x, y - 30, 0.55, ''); }
        if (lt > pr) K.pill('INTERNET PROVIDER', 540, 230, 58, C.ink, C.white, E(seg(lt, pr, pr + 0.25)));
        if (lt > se) K.peekEyes(ISP[0] - 10, ISP[1] - 330, 1.0 * E(seg(lt, se, se + 0.25)), Math.sin(t * 3), 0);
        const cols = [BLUE, '#E57A8A', GREEN];
        cols.forEach((c, k) => { const a = si + k * 0.25; if (lt > a) K.webPage(220 + k * 150, 420, 0.75 * E(seg(lt, a, a + 0.25)), c, -0.12 + k * 0.1); });
        if (lt > si) K.pill('SEES EVERY SITE', 380, 600, 44, C.red, C.white, E(seg(lt, si + 0.3, si + 0.55)));
      } });
    cue(st, 'whoosh'); cue(st + pr, 'pop', { gain: 0.4 }); cue(st + se, 'boing', { gain: 0.3 }); for (let k = 0; k < 3; k++) cue(st + si + k * 0.25, 'pop', { gain: 0.3 });
  }

  // ── 4 · A VPN wraps it all in a scrambled, locked tunnel ───────────────
  {
    const st = cut(3), wr = Wd('wraps', 3) - st, sc = Wd('scrambled', 3) - st, lk = Wd('locked', 3) - st, tu = Wd('tunnel', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 760], zoom: 0.1, note: 'phone left; message card scrambles on "scrambled"; tunnel builds rightwards from "wraps"; padlock drops on "locked"; TUNNEL pill on "tunnel"',
      draw(lt, d, t) {
        bg('#DDEFF6');
        K.tunnel(240, 880, 1000, 880, eio(seg(lt, wr, tu + 0.3)), t, { w: 170 });
        K.phone(170, 880, 0.55, browseScreen(t));
        K.scrambleCard(560, 520, 0.95, 'my-bank.com', seg(lt, sc - 0.1, lk), 3);
        if (lt > lk) K.padlock(880, lerp(-200, 500, eob(seg(lt, lk, lk + 0.35))), 0.6);
        if (lt > tu) K.pill('LOCKED TUNNEL', 600, 1110, 58, C.yellow, C.ink, E(seg(lt, tu, tu + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + wr, 'slide', { dur: 1.2, gain: 0.3 }); cue(st + sc, 'sparkle', { dur: 0.5, gain: 0.3 }); cue(st + lk + 0.3, 'thud', { gain: 0.45 }); cue(st + tu, 'pop', { gain: 0.4 });
  }

  // ── 5 · straight to a VPN server somewhere else ────────────────────────
  {
    const st = cut(4), sr = Wd('server', 4) - st, sw = Wd('somewhere', 4) - st;
    add({ id: 'S05', at: st, cam: [600, 700], zoom: 0.1, note: 'tunnel diagonal from phone (bottom left) to VPN server (top right) with globe behind; server pops on "server"; FAR AWAY pill on "somewhere"',
      draw(lt, d, t) {
        bg('#E9E2D2', C.bg);
        if (lt > sw) { K.globe(830, 470, 1.9 * E(seg(lt, sw, sw + 0.3)), t); }
        K.tunnel(200, 1060, 800, 560, lerp(0.25, 1, eio(seg(lt, 0, sr + 0.1))), t, { w: 130 });
        K.phone(170, 1060, 0.45, browseScreen(t));
        if (lt > sr) { K.server(830, 520, 0.7 * E(seg(lt, sr, sr + 0.25)), t); K.pill('VPN SERVER', 700, 190, 62, C.ink, C.white, E(seg(lt, sr, sr + 0.25))); }
        if (lt > sw) K.pill('FAR AWAY', 360, 420, 56, C.yellow, C.ink, E(seg(lt, sw + 0.05, sw + 0.3)));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'slide', { dur: Math.max(0.3, sr), gain: 0.3 }); cue(st + sr, 'pop', { gain: 0.45 }); cue(st + sw, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 6 · Now your provider just sees gibberish ──────────────────────────
  {
    const st = cut(5), pr = Wd('provider', 5) - st, se = Wd('sees', 5) - st, gb = Wd('gibberish', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 760], zoom: 0.1, note: 'ISP building centre with peek eyes; tunnel runs in front of it; scrambled card above; eyes go confused (?) on "gibberish"',
      draw(lt, d, t) {
        bg('#DDEFF6');
        ctx.fillStyle = C.floor; ctx.fillRect(-300, 1060, W + 600, 900);
        K.ispBuilding(540, 760, 1.0, 'ISP', t);
        K.tunnel(-200, 1000, 1280, 1000, 1, t, { w: 150 });
        if (lt > pr) K.peekEyes(540, 420, 1.1 * E(seg(lt, pr, pr + 0.25)), lt > gb ? Math.sin(t * 9) : 0.3, 0);
        if (lt > se) K.scrambleCard(540, 220, 0.9 * E(seg(lt, se, se + 0.25)), 'my-bank.com', 1, 4);
        if (lt > gb) { bigText('?', 790, 420, 170, C.yellow, 0.18, E(seg(lt, gb, gb + 0.25))); bigText('?', 290, 450, 130, C.yellow, -0.2, E(seg(lt, gb + 0.12, gb + 0.37))); }
      } });
    cue(st, 'whoosh'); cue(st + pr, 'pop', { gain: 0.35 }); cue(st + se, 'sparkle', { dur: 0.4, gain: 0.3 }); cue(st + gb, 'boing', { gain: 0.4 });
  }

  // ── 7 · and websites see the server's address, not yours ───────────────
  {
    const st = cut(6), ws = Wd('websites', 6) - st, sv = Wd('server', 6) - st, ny = Wd('not', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 700], zoom: 0.08, note: 'website (web page card) top; VPN server left with green IP tag + check on "server\'s"; your phone right with tag that gets red X on "not"',
      draw(lt, d, t) {
        bg('#E9E2D2', C.bg);
        const wp = E(seg(lt, ws - 0.15, ws + 0.25));
        K.webPage(540, 330, 1.2 * wp, BLUE);
        K.server(280, 860, 0.55, t);
        K.phone(800, 880, 0.45, browseScreen(t));
        if (wp > 0) K.peekEyes(540, 300, 0.8 * wp, lt > ny ? 1 : -1, 0);
        if (lt > sv) { const p = E(seg(lt, sv, sv + 0.25)); K.pill('VPN: 203.0.113.7', 280, 1150, 44, GREEN, C.white, p); K.check(280, 560, 0.45 * p); }
        K.pill('YOU: 98.51.24.6', 800, 1150, 44, C.ink, C.white, E(seg(lt, 0.1, 0.35)));
        if (lt > ny) K.redX(800, 880, lerp(1.6, 0.9, eo(seg(lt, ny, ny + 0.2))), 1);
      } });
    cue(st, 'whoosh'); cue(st + ws - 0.15, 'pop', { gain: 0.35 }); cue(st + sv, 'sparkle', { dur: 0.35, gain: 0.35 }); cue(st + ny, 'slam', { gain: 0.45 });
  }

  // ── 8 · That's handy on sketchy coffee shop Wi-Fi ──────────────────────
  {
    const st = cut(7), hd = Wd('handy', 7) - st, sk = Wd('sketchy', 7) - st, cf = Wd('coffee', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 760], zoom: 0.08, note: 'cafe: table, cup, router; hero left with phone, VPN switch ON above him; hooded snoop pops right on "sketchy" with a padlock blocking; PUBLIC WI-FI pill on "coffee"',
      draw(lt, d, t) {
        fillAll('#F6E7D2'); ctx.fillStyle = '#D9B98F'; ctx.fillRect(-300, 1080, W + 600, 900);
        ctx.fillStyle = '#C8A276'; ctx.fillRect(-300, 300, W + 600, 30);
        K.man({ x: 270, y: 1210, s: 0.9, arm: K.PHONE_ARM, holding: heldPhone(browseScreen(t)), eyes: 'n', mouth: lt > hd ? 'grin' : 'smile', brow: 0.5, look: 0.6 });
        rr(380, 1000, 520, 40, 14); ctx.fillStyle = '#8A5A34'; ctx.fill(); ctx.fillStyle = '#6E4626'; ctx.fillRect(610, 1040, 40, 200);
        K.coffeeCup(500, 920, 0.6, t); K.router(760, 960, 0.38, t);
        K.vpnSwitch(270, 260, 0.7, 1);
        if (lt > sk) { const p = E(seg(lt, sk, sk + 0.3)); K.snoop(900, 700, 1.2 * p, -1, t); K.padlock(620, 640, 0.45 * p); }
        if (lt > cf) K.pill('PUBLIC WI-FI', 700, 430, 58, C.yellow, C.ink, E(seg(lt, cf, cf + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + hd, 'pop', { gain: 0.3 }); cue(st + sk, 'boing', { gain: 0.35 }); cue(st + cf, 'pop', { gain: 0.4 });
  }

  // ── 9 · The first VPN came from Microsoft in nineteen ninety-six ───────
  {
    const st = cut(8), fi = Wd('first', 8) - st, ms = Wd('microsoft', 8) - st, yr = Wd('nineteen', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 700], zoom: 0.08, note: '90s beige PC rises; screen shows a tiny tunnel; FIRST VPN pill on "first"; MICROSOFT pill on "Microsoft"; 1996 calendar drops on "nineteen"',
      draw(lt, d, t) {
        bg('#E9E2D2', C.bg);
        const py = lerp(1700, 800, eob(seg(lt, 0, 0.4)));
        K.retroPC(360, py, 1.0, () => { ctx.fillStyle = '#1F3A2E'; ctx.fillRect(-200, -230, 400, 300); K.tunnel(-150, -60, 150, -60, seg(lt, fi, fi + 0.6), t, { w: 70, rings: false, flow: 0 }); ctx.fillStyle = '#7CE3A0'; ctx.font = '900 44px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('VPN', 0, -160); });
        if (lt > fi) K.pill('THE FIRST VPN', 360, 230, 62, C.yellow, C.ink, E(seg(lt, fi, fi + 0.25)));
        if (lt > ms) K.pill('MICROSOFT', 360, 380, 54, C.ink, C.white, E(seg(lt, ms, ms + 0.25)));
        if (lt > yr) K.calendar(820, lerp(-600, 700, eob(seg(lt, yr, yr + 0.4))), 0.55, '96', '1996', 0.06);
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'slide', { dur: 0.35, gain: 0.3 }); cue(st + fi, 'pop', { gain: 0.4 }); cue(st + ms, 'pop', { gain: 0.35 }); cue(st + yr + 0.35, 'thud', { gain: 0.5 });
  }

  // ── 10 · so people could work safely from home ─────────────────────────
  {
    const st = cut(9), wk = Wd('work', 9) - st, sf = Wd('safely', 9) - st, hm = Wd('home', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 760], zoom: 0.1, note: 'house left, office building right; tunnel grows between them from "work"; padlock pops on tunnel on "safely"; WORK FROM HOME pill on "home"',
      draw(lt, d, t) {
        bg('#DDEFF6');
        ctx.fillStyle = C.floor; ctx.fillRect(-300, 1060, W + 600, 900);
        K.tunnel(270, 960, 820, 960, eio(seg(lt, wk - 0.1, sf + 0.1)), t, { w: 110 });
        K.house(230, 910, 1.0, '#F29A3A', t);
        K.ispBuilding(840, 860, 0.9, 'OFFICE', t, '#8C95A6');
        if (lt > sf) { K.padlock(545, 760, 0.5 * E(seg(lt, sf, sf + 0.25))); }
        if (lt > hm) K.pill('WORK FROM HOME', 540, 300, 62, C.yellow, C.ink, E(seg(lt, hm, hm + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + wk - 0.1, 'slide', { dur: 0.6, gain: 0.3 }); cue(st + sf, 'pop', { gain: 0.4 }); cue(st + hm, 'sparkle', { dur: 0.35, gain: 0.35 });
  }

  // ── 11 · But here's the twist ──────────────────────────────────────────
  {
    const st = cut(10), tw = Wd('twist', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 600], zoom: 0.14, note: 'room; hero with phone, VPN switch ON beside him, smug; red warning pops on "twist", eyes wide',
      draw(lt, d, t) {
        K.room();
        const hit = lt > tw;
        K.vpnSwitch(820, 640, 0.8, 1);
        K.man({ x: 450, y: 1180, s: 1.0, arm: K.PHONE_ARM, holding: heldPhone(browseScreen(t)), eyes: hit ? 'wide' : 'n', mouth: hit ? 'o' : 'smirk', brow: hit ? 1 : 0.6, smirk: !hit, look: 0.4 });
        if (hit) { K.warning(820, 330, 0.8 * E(seg(lt, tw, tw + 0.25))); K.shockLines(450, 830, 150, clamp((lt - tw) * 4)); }
      } });
    cue(st, 'whoosh'); cue(st + tw, 'slam', { gain: 0.45 });
  }

  // ── 12 · the VPN company now sees what your provider used to ──────────
  {
    const st = cut(11), co = Wd('company', 11) - st, se = Wd('sees', 11) - st, pr = Wd('provider', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 760], zoom: 0.08, note: 'ISP building left, VPN server right at tunnel end; on "sees" the peeking eyes jump from ISP over to the VPN server; web pages pop beside server; ISP fades + USED TO SEE on "provider"',
      draw(lt, d, t) {
        bg('#F6D9DC', C.bg);
        ctx.fillStyle = C.floor; ctx.fillRect(-300, 1060, W + 600, 900);
        const fade = lt > pr ? clamp((lt - pr) * 3) : 0;
        ctx.save(); ctx.globalAlpha = 1 - 0.5 * fade; K.ispBuilding(250, 820, 0.8, 'ISP', t); ctx.restore();
        K.tunnel(-200, 1000, 820, 1000, 1, t, { w: 130 });
        K.server(840, 820, 0.62, t);
        if (lt > co) K.pill('VPN COMPANY', 760, 230, 60, C.ink, C.white, E(seg(lt, co, co + 0.25)));
        const j = eio(seg(lt, se - 0.1, se + 0.35));
        const ex = lerp(250, 840, j), ey = 560 - Math.sin(j * Math.PI) * 220;
        K.peekEyes(ex, ey, 0.95, lerp(1, 0, j), 0);
        if (lt > se) [BLUE, '#E57A8A', GREEN].forEach((c, k) => { const a = se + 0.3 + k * 0.15; if (lt > a) K.webPage(640 + k * 110, 400, 0.5 * E(seg(lt, a, a + 0.25)), c, -0.1 + k * 0.1); });
        if (lt > pr) K.pill('USED TO SEE', 250, 400, 46, C.red, C.white, E(seg(lt, pr, pr + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + co, 'pop', { gain: 0.35 }); cue(st + se - 0.1, 'zip', { gain: 0.4 }); cue(st + se + 0.3, 'pop', { gain: 0.3 }); cue(st + pr, 'pop', { gain: 0.3 });
  }

  // ── 13 · so you're not invisible ───────────────────────────────────────
  {
    const st = cut(12), nt = Wd('not', 12) - st, iv = Wd('invisible', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 640], zoom: 0.12, note: 'room; hero fades ghostly, snaps back solid on "invisible"; INVISIBLE pill gets red X; peek eyes top right still watching',
      draw(lt, d, t) {
        K.room();
        const ghost = lt < iv ? lerp(1, 0.3, eo(seg(lt, 0, nt + 0.1))) : 1;
        ctx.save(); ctx.globalAlpha = ghost;
        K.man({ x: 540, y: 1180, s: 1.0, arm: K.ARM.down, eyes: lt > iv ? 'wide' : 'closed', mouth: lt > iv ? 'o' : 'smile', brow: lt > iv ? 1 : 0.3 });
        ctx.restore();
        K.peekEyes(880, 330, 0.9, -0.8, 0);
        K.pill('INVISIBLE', 300, 300, 64, C.white, C.ink, E(seg(lt, 0.05, 0.3)));
        if (lt > iv) { K.redX(300, 300, lerp(1.5, 0.75, eo(seg(lt, iv, iv + 0.2))), 1); K.shockLines(540, 830, 150, clamp((lt - iv) * 4)); }
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'sparkle', { dur: 0.4, gain: 0.25 }); cue(st + iv, 'slam', { gain: 0.45 });
  }

  // ── 14 · A VPN doesn't hide you, it just changes who's watching (loop) ─
  {
    const st = cut(13), dn = Wd("doesn't", 13) - st, ch = Wd('changes', 13) - st, wa = Wd('watching', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 680], zoom: 0.06, note: 'room; hero to camera, finger wag from "doesn\'t"; ISP eyes left swap to VPN eyes right on "changes"; wink + grin on "watching"',
      draw(lt, d, t) {
        K.room();
        K.vpnSwitch(540, 300, 0.6, 1);
        const sw = eio(seg(lt, ch - 0.05, ch + 0.4));
        K.pill('ISP', 190, 560, 48, C.ink, C.white, 1 - sw);
        K.peekEyes(190, 660, 0.8 * (1 - sw), 1, 0);
        K.pill('VPN', 890, 560, 48, C.ink, C.white, sw);
        K.peekEyes(890, 660, 0.8 * sw, -1, 0);
        const wag = lt > dn ? Math.sin(lt * 11) * 0.35 : 0;
        K.man({ x: 540, y: 1220, s: 0.9, arm: K.armPose(K.ARM.down, K.ARM.point, eo(seg(lt, dn, dn + 0.3))), finger: lt > dn ? wag : null,
          eyes: lt > wa + 0.1 ? 'wink' : 'n', mouth: lt > wa + 0.1 ? 'grin' : 'smirk', brow: 0.6, look: 0 });
      } });
    cue(st, 'whoosh'); cue(st + dn, 'pop', { gain: 0.3 }); cue(st + ch, 'slide', { dur: 0.4, gain: 0.3 }); cue(st + wa + 0.1, 'boing', { gain: 0.4 });
  }

  return { shots: S, cues: CUES };
}
