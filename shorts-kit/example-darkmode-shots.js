// DOES DARK MODE ACTUALLY SAVE BATTERY?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const disc = () => { fillAll(C.bg); circle(540, 740, 520, '#E4DCCB'); };
const dark = () => { fillAll('#20232B'); circle(540, 740, 540, '#2A2E38'); };
const heldPhone = (scr) => (x, y) => K.phone(x + 12, y - 70, 0.3, scr);
const feed = (d) => () => K.darkFeed(d);
// a "dark mode app" pattern on a pixel grid: mostly black with a few white rows of text
const darkPat = (i, j) => ((j === 1 && i > 0 && i < 5) || (j === 3 && i > 0 && i < 6) || (j === 4 && i > 0 && i < 4) ? 1 : 0);
const pctText = (txt, x, y, size, col) => { ctx.save(); ctx.font = `900 ${size}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineWidth = size * 0.18; ctx.lineJoin = 'round'; ctx.strokeStyle = C.ink; ctx.strokeText(txt, x, y); ctx.fillStyle = col; ctx.fillText(txt, x, y); ctx.restore(); };

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · Does dark mode actually save your phone's battery? ───────────
  {
    const st = cut(0), dk = Wd('dark', 0) - st, sv = Wd('save', 0) - st, ba = Wd('battery', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 760], zoom: 0.12, note: 'hero holds phone; big phone with light feed; toggle flips to dark on "dark"; battery + ? on "battery"',
      draw(lt, d, t) {
        K.room();
        const dm = eio(seg(lt, dk, dk + 0.35));
        K.man({ x: 290, y: 1250, s: 0.9, arm: K.PHONE_ARM, holding: heldPhone(feed(dm)), eyes: lt > ba ? 'wide' : 'n', mouth: lt > ba ? 'o' : 'smile', brow: 0.7, look: 0.6 });
        K.phone(760, 640, 0.8 * E(seg(lt, 0, 0.3)), feed(dm));
        K.modeToggle(760, 1100, 0.8, dm, E(seg(lt, dk - 0.3, dk)));
        if (lt > ba) { K.battery(540, 210, 0.9, 0.5, E(seg(lt, ba, ba + 0.25))); K.pill('?', 760, 210, 90, C.yellow, C.ink, E(seg(lt, ba + 0.1, ba + 0.35))); }
      } });
    cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + dk, 'zip', { gain: 0.35 }); cue(st + ba, 'boing', { gain: 0.35 });
  }
  // ── 2 · Well, it depends on your screen. ───────────────────────────
  {
    const st = cut(1), de = Wd('depends', 1) - st, sc = Wd('screen', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 740], zoom: 0.12, note: 'two dark-mode phones side by side; IT DEPENDS on "depends"; both screens get ? tags on "screen"',
      draw(lt, d, t) {
        disc();
        K.phone(300, 760, 0.85 * E(seg(lt, 0, 0.3)), feed(1));
        K.phone(780, 760, 0.85 * E(seg(lt, 0.1, 0.4)), feed(1));
        if (lt > de) K.pill('IT DEPENDS', 540, 220, 76, C.yellow, C.ink, E(seg(lt, de, de + 0.25)));
        if (lt > sc) { K.pill('SCREEN A', 300, 1150, 50, C.white, C.ink, E(seg(lt, sc, sc + 0.25))); K.pill('SCREEN B', 780, 1150, 50, C.white, C.ink, E(seg(lt, sc + 0.1, sc + 0.35))); }
      } });
    cue(st, 'whoosh'); cue(st + de, 'pop', { gain: 0.4 }); cue(st + sc, 'pop', { gain: 0.3 });
  }
  // ── 3 · Many older phones use an LCD, ──────────────────────────────
  {
    const st = cut(2), ol = Wd('older', 2) - st, lc = Wd('lcd', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 720], zoom: 0.14, note: 'older chunky phone drops in on "older"; LCD pill slams on "LCD"',
      draw(lt, d, t) {
        disc();
        const p = eio(seg(lt, ol - 0.3, ol + 0.1));
        K.phone(540, lerp(-500, 760, p), 0.95, feed(1), lerp(-0.3, -0.05, p));
        if (lt > lc) K.pill('LCD', 540, 230, 110, C.yellow, C.ink, E(seg(lt, lc, lc + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ol + 0.1, 'thud', { gain: 0.4 }); cue(st + lc, 'pop', { gain: 0.45 });
  }
  // ── 4 · where one big backlight shines behind every pixel, ─────────
  {
    const st = cut(3), bl = Wd('backlight', 3) - st, pi = Wd('pixel', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 760], zoom: 0.12, note: 'LCD layers pull apart; backlight sheet glows on "backlight"; rays reach the pixel sheet on "pixel"',
      draw(lt, d, t) {
        dark();
        const sp = eio(seg(lt, 0.1, bl)), gl = eio(seg(lt, bl - 0.1, bl + 0.3));
        K.lcdLayers(600, 820, 1.0, sp, gl, t);
        if (lt > bl) K.tag('BACKLIGHT', 250, 240, 300, 420, 56, E(seg(lt, bl, bl + 0.25)));
        if (lt > pi) K.tag('PIXELS', 840, 1180, 740, 1060, 56, E(seg(lt, pi, pi + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.15, 'slide', { dur: 0.6, gain: 0.25 }); cue(st + bl, 'sparkle', { dur: 0.5, gain: 0.3 }); cue(st + pi, 'pop', { gain: 0.35 });
  }
  // ── 5 · so even black is still lit up. ─────────────────────────────
  {
    const st = cut(4), bk = Wd('black', 4) - st, li = Wd('lit', 4) - st;
    add({ id: 'S05', at: st, cam: [540, 700], zoom: 0.14, note: 'LCD grid showing dark mode; black pixels still glow yellowish; STILL LIT tag on "lit"; power meter high',
      draw(lt, d, t) {
        dark();
        K.lcdPanel(540, 640, 7, 6, 100, darkPat, 1, t);
        if (lt > bk) { ctx.save(); ctx.lineWidth = 12; ctx.strokeStyle = C.red; rr(540 - 350 + 6, 640 - 300 + 6, 88, 88, 18); ctx.globalAlpha = E(seg(lt, bk, bk + 0.25)); ctx.stroke(); ctx.restore(); }
        if (lt > li) K.pill('STILL LIT', 540, 200, 80, C.red, C.white, E(seg(lt, li, li + 0.25)));
        K.powerMeter(540, 1130, 0.7, lerp(0.5, 0.82, eio(seg(lt, 0.1, li))), 'POWER', E(seg(lt, 0, 0.3)));
      } });
    cue(st, 'whoosh'); cue(st + bk, 'pop', { gain: 0.35 }); cue(st + li, 'alarm', { dur: 0.5, gain: 0.25 });
  }
  // ── 6 · But most newer phones use OLED, ────────────────────────────
  {
    const st = cut(5), ne = Wd('newer', 5) - st, ol = Wd('oled', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 720], zoom: 0.14, note: 'sleek new phone slides in on "newer"; OLED pill on "OLED"',
      draw(lt, d, t) {
        disc();
        const p = eio(seg(lt, 0, 0.4));
        K.phone(lerp(1500, 540, p), 760, 1.0, feed(1));
        if (lt > ne) K.burst(820, 340, 1.0, 1 - seg(lt, ne, ne + 0.4));
        if (lt > ol) K.pill('OLED', 540, 230, 110, C.yellow, C.ink, E(seg(lt, ol, ol + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ne - 0.3, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + ol, 'pop', { gain: 0.45 });
  }
  // ── 7 · where every pixel makes its own light, ─────────────────────
  {
    const st = cut(6), pi = Wd('pixel', 6) - st, ow = Wd('own', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 700], zoom: 0.12, note: 'OLED grid, all dark; pixels switch on one by one in a wave from "pixel"; OWN LIGHT pill on "own"',
      draw(lt, d, t) {
        dark();
        const u = seg(lt, pi - 0.2, ow + 0.2);
        K.oledPanel(540, 680, 6, 6, 110, (i, j) => (u * 12 > i + j ? 1 : 0));
        if (lt > ow) K.pill('OWN LIGHT', 540, 200, 80, C.yellow, C.ink, E(seg(lt, ow, ow + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + pi - 0.2, 'sparkle', { dur: 0.8, gain: 0.3 }); cue(st + ow, 'pop', { gain: 0.4 });
  }
  // ── 8 · and a black pixel just switches off. ───────────────────────
  {
    const st = cut(7), bk = Wd('black', 7) - st, of = Wd('off', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 680], zoom: 0.18, note: 'OLED grid lit; one pixel ringed on "black"; it goes true black on "off"; OFF pill',
      draw(lt, d, t) {
        dark();
        const offNow = lt > of;
        K.oledPanel(540, 680, 3, 3, 220, (i, j) => (i === 1 && j === 1 && offNow ? 0 : 1));
        if (lt > bk) { ctx.save(); ctx.globalAlpha = E(seg(lt, bk, bk + 0.25)); ctx.lineWidth = 14; ctx.strokeStyle = C.yellow; rr(540 - 120, 680 - 120, 240, 240, 36); ctx.stroke(); ctx.restore(); }
        if (offNow) K.pill('OFF', 540, 1060, 80, C.ink, C.white, E(seg(lt, of, of + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + bk, 'pop', { gain: 0.3 }); cue(st + of, 'thud', { gain: 0.45 });
  }
  // ── 9 · No light means no power, ───────────────────────────────────
  {
    const st = cut(8), li = Wd('light', 8) - st, po = Wd('power', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 720], zoom: 0.12, note: 'lit pixel gets a stream of bolts, black pixel none; 0 POWER under the black one on "power"',
      draw(lt, d, t) {
        disc();
        K.oledPanel(300, 620, 1, 1, 300, () => 1);
        K.oledPanel(780, 620, 1, 1, 300, () => 0);
        for (let k = 0; k < 3; k++) { const ph = (lt * 1.4 + k / 3) % 1; K.bolt(300, lerp(1100, 820, ph), 0.6, 0, C.yellow); }
        line([[780, 1100], [780, 820]], '#C9C2B5', 14);
        if (lt > li) K.pill('POWER', 300, 260, 60, C.yellow, C.ink, E(seg(lt, li, li + 0.25)));
        if (lt > po) K.pill('0 POWER', 780, 260, 60, C.ink, C.white, E(seg(lt, po, po + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + li, 'pop', { gain: 0.3 }); cue(st + po, 'pop', { gain: 0.4 });
  }
  // ── 10 · so dark mode really can help. ─────────────────────────────
  {
    const st = cut(9), dk = Wd('dark', 9) - st, he = Wd('help', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 760], zoom: 0.12, note: 'hero with dark phone; toggle on; battery drain slows; IT HELPS pill + smile on "help"',
      draw(lt, d, t) {
        K.room();
        K.man({ x: 330, y: 1250, s: 0.9, arm: K.PHONE_ARM, holding: heldPhone(feed(1)), eyes: 'n', mouth: lt > he ? 'grin' : 'smile', brow: 0.4, look: 0.6 });
        K.modeToggle(780, 520, 0.9, 1, E(seg(lt, dk - 0.2, dk + 0.1)));
        K.battery(780, 800, 0.9, lerp(0.55, 0.8, eio(seg(lt, dk, he + 0.2))), E(seg(lt, 0, 0.3)));
        if (lt > he) K.pill('IT HELPS', 780, 1010, 66, C.yellow, C.ink, E(seg(lt, he, he + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + dk, 'zip', { gain: 0.3 }); cue(st + he, 'sparkle', { dur: 0.4, gain: 0.3 });
  }
  // ── 11 · But here's the twist. ──────────────────────────────────────
  {
    const st = cut(10), tw = Wd('twist', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 760], zoom: 0.2, note: 'close-up hero, brow raised; red TWIST slams on "twist"',
      draw(lt, d, t) {
        K.room();
        K.man({ x: 540, y: 1260, s: 1.7, arm: K.ARM.down, eyes: lt > tw ? 'wide' : 'n', mouth: lt > tw ? 'o' : 'smirk', smirk: lt <= tw, brow: lt > tw ? 1 : 0.5, look: 0 });
        if (lt > tw) { bigText('TWIST!', 540, 250, 150, C.red, -0.06, E(seg(lt, tw, tw + 0.25))); K.shockLines(540, 560, 380, 1 - seg(lt, tw, tw + 0.5)); }
      } });
    cue(st, 'whoosh'); cue(st + tw, 'slam', { gain: 0.45 });
  }
  // ── 12 · One study found that at full brightness, ──────────────────
  {
    const st = cut(11), stu = Wd('study', 11) - st, fu = Wd('full', 11) - st, br = Wd('brightness', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 700], zoom: 0.12, note: 'study card drops on "study"; slider shoots to max on "full"; sun blazes; 100% on "brightness"',
      draw(lt, d, t) {
        disc();
        K.studyCard(540, lerp(-400, 560, eio(seg(lt, stu - 0.3, stu + 0.1))), 0.85, -0.05);
        const v = lerp(0.3, 1, eio(seg(lt, fu - 0.1, fu + 0.35)));
        K.brightSlider(540, 1080, 520, v, E(seg(lt, fu - 0.4, fu - 0.1)));
        if (lt > br) { K.sun(880, 220, 0.6 * E(seg(lt, br, br + 0.3)), t); pctText('100%', 300, 210, 110, C.yellow); }
      } });
    cue(st, 'whoosh'); cue(st + stu - 0.2, 'thud', { gain: 0.35 }); cue(st + fu - 0.1, 'zip', { gain: 0.35 }); cue(st + br, 'sparkle', { dur: 0.4, gain: 0.3 });
  }
  // ── 13 · dark mode saves around forty percent, ────────────────────
  {
    const st = cut(12), sa = Wd('saves', 12) - st, fo = Wd('forty', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 720], zoom: 0.12, note: 'light vs dark phone at full brightness; power meters; counter climbs to 40% SAVED on "forty"',
      draw(lt, d, t) {
        disc();
        K.phone(300, 640, 0.65, feed(0)); K.phone(780, 640, 0.65, feed(1));
        K.powerMeter(300, 1090, 0.55, 0.85, 'LIGHT'); K.powerMeter(780, 1090, 0.55, lerp(0.85, 0.5, eio(seg(lt, sa, fo + 0.2))), 'DARK');
        const u = eio(seg(lt, sa, fo + 0.2));
        if (lt > sa) pctText('-' + Math.round(40 * u) + '%', 540, 210, 150, C.yellow);
      } });
    cue(st, 'whoosh'); cue(st + sa, 'slide', { dur: 0.8, gain: 0.25 }); cue(st + fo + 0.2, 'thud', { gain: 0.45 });
  }
  // ── 14 · but at normal indoor brightness, ─────────────────────────
  {
    const st = cut(13), no = Wd('normal', 13) - st, ind = Wd('indoor', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 760], zoom: 0.12, note: 'hero on couch-free room; slider slides down to ~40% on "normal"; INDOOR pill on "indoor"',
      draw(lt, d, t) {
        K.room();
        K.man({ x: 300, y: 1250, s: 0.9, arm: K.PHONE_ARM, holding: heldPhone(feed(1)), eyes: 'n', mouth: 'flat', brow: 0.5, look: 0.6 });
        const v = lerp(1, 0.4, eio(seg(lt, no - 0.2, no + 0.4)));
        K.brightSlider(720, 560, 300, v, E(seg(lt, 0, 0.3)));
        pctText(Math.round(v * 100) + '%', 720, 380, 100, C.white);
        if (lt > ind) K.pill('INDOOR', 720, 760, 70, C.yellow, C.ink, E(seg(lt, ind, ind + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + no - 0.2, 'slide', { dur: 0.6, gain: 0.25 }); cue(st + ind, 'pop', { gain: 0.35 });
  }
  // ── 15 · it's only about three to nine percent. ──────────────────
  {
    const st = cut(14), ab = Wd('about', 14) - st, th = Wd('three', 14) - st, ni = Wd('nine', 14) - st;
    add({ id: 'S15', at: st, cam: [540, 720], zoom: 0.16, note: 'meters barely differ; tiny 3-9% lands on "nine"; ONLY pill red',
      draw(lt, d, t) {
        disc();
        K.powerMeter(300, 760, 0.75, 0.42, 'LIGHT'); K.powerMeter(780, 760, 0.75, lerp(0.42, 0.38, eio(seg(lt, th, ni))), 'DARK');
        if (lt > th) pctText(lt > ni ? '3-9%' : '3%', 540, 300, lt > ni ? 140 : 110, C.yellow);
        if (lt > ab) K.pill('ONLY', 540, 1080, 70, C.red, C.white, E(seg(lt, ab, ab + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ab, 'pop', { gain: 0.35 }); cue(st + ni, 'boing', { gain: 0.35 });
  }
  // ── 16 · So turn the brightness down first, then go dark. ────────
  {
    const st = cut(15), dn = Wd('down', 15) - st, dk = Wd('dark', 15) - st;
    add({ id: 'S16', at: st, cam: [540, 760], zoom: 0.14, note: 'hero to camera with finger wag; slider drops on "down"; toggle flips on "dark", battery full green',
      draw(lt, d, t) {
        K.room();
        const p = eo(seg(lt, 0, 0.35));
        K.man({ x: 330, y: 1250, s: 1.0, arm: K.armPose(K.ARM.down, K.ARM.point, p), finger: lt > 0.35 ? Math.sin(lt * 11) * 0.35 : null, eyes: 'n', mouth: lt > dk ? 'grin' : 'smirk', smirk: lt <= dk, brow: 0.4, look: 0.1 });
        K.brightSlider(740, 420, 170, lerp(1, 0.3, eio(seg(lt, dn - 0.2, dn + 0.3))), E(seg(lt, 0.1, 0.4)));
        K.modeToggle(760, 680, 0.9, eio(seg(lt, dk - 0.1, dk + 0.2)), E(seg(lt, 0.2, 0.5)));
        K.battery(760, 920, 0.9, lerp(0.5, 0.95, eio(seg(lt, dk, dk + 0.5))), E(seg(lt, 0.3, 0.6)));
      } });
    cue(st, 'whoosh'); cue(st + dn - 0.2, 'slide', { dur: 0.5, gain: 0.25 }); cue(st + dk, 'zip', { gain: 0.35 }); cue(st + dk + 0.4, 'sparkle', { dur: 0.5, gain: 0.3 });
  }

  return { shots: S, cues: CUES };
}
