// WHAT HAPPENS WHEN YOU DELETE A FILE?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const GREEN = '#5BAE6A', BLUE = '#3A7BD5';
const bg = (ring = '#CFE8F3', base = C.sky) => { fillAll(base); circle(540, 740, 560, ring); };
const floor = () => { ctx.fillStyle = C.floor; ctx.fillRect(-300, 1100, W + 600, 900); };
const PH = [1, 1, 4, 3];
const FILES = { 0: 0, 1: 0, 2: 0, 5: 1, 6: 1, 11: 2, 17: 2, 23: 3, 24: 3, 25: 4, 26: 4, 29: 1 };
const TOC = [['song.mp3', '#0-2', 0], ['notes.txt', '#5-6', 1], ['cat.png', '#11,17', 2], ['photo.jpg', '#7-22', 3]];
const photoScreen = (gone = 0) => () => {
  ctx.fillStyle = '#DCEEF6'; ctx.fillRect(-166, -350, 332, 700);
  ctx.fillStyle = C.ink; ctx.font = '900 30px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('9:41', 0, -290);
  if (gone < 1) K.photo(0, -60, 1.45 * (1 - gone), 0);
  else { ctx.fillStyle = '#7C8391'; ctx.font = '900 34px Inter'; ctx.fillText('NO PHOTOS', 0, -60); }
};
const heldPhone = (screen) => (x, y) => K.phone(x + 12, y - 70, 0.3, screen);
const grid = (x, y, cell, o) => K.blockGrid(x, y, 6, 5, cell, { photo: PH, files: FILES, ...o });

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // ── 1 · You delete a photo ──────────────────────────────────────────────
  {
    const st = cut(0), dl = Wd('delete', 0) - st, ph = Wd('photo', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 760], zoom: 0.1, note: 'phone with a photo; on "delete" the photo flies in an arc into the trash can right; PHOTO pill on "photo"',
      draw(lt, d, t) {
        bg(); floor();
        const u = eio(seg(lt, dl, dl + 0.75));
        K.trashCan(820, 960, 0.75, lt > dl - 0.2 && u < 1 ? eo(seg(lt, dl - 0.2, dl + 0.1)) : 0, u >= 1 ? 1 : 0);
        K.phone(330, 760, 0.85, photoScreen(lt > dl ? 1 : 0));
        if (lt > dl && u < 1) { const [x, y] = K.arcAt(330, 700, 820, 860, 300, u); K.photo(x, y, lerp(1.2, 0.4, u), u * 4); }
        if (lt > ph) K.pill('PHOTO.JPG', 330, 270, 56, C.ink, C.white, E(seg(lt, ph, ph + 0.25)));
      } });
    cue(st + 0.05, 'pop', { gain: 0.25 }); cue(st + dl, 'zip', { gain: 0.35 }); cue(st + dl + 0.75, 'thud', { gain: 0.4 });
  }
  // ── 1b · and empty the trash ────────────────────────────────────────────
  {
    const st = Wd('empty', 0) - 0.12, tr = Wd('trash', 0) - st;
    add({ id: 'S01b', at: st, cam: [540, 760], zoom: 0.14, note: 'close-up trash can shakes; papers vanish with burst on "trash"; EMPTY TRASH pill',
      draw(lt, d, t) {
        bg('#E9E2D2', C.bg);
        const sh = lt < tr ? Math.sin(lt * 50) * 10 * clamp(lt * 3) : 0;
        K.trashCan(540, 820, 1.4, lt < tr ? 0.25 : 0, lt < tr ? 2 : 0, sh);
        if (lt > tr) { K.burst(540, 560, 1.1 * E(seg(lt, tr, tr + 0.3)), 1 - seg(lt, tr + 0.3, tr + 0.8)); K.pill('EMPTY TRASH', 540, 270, 64, C.red, C.white, E(seg(lt, tr, tr + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'boing', { gain: 0.2 }); cue(st + tr, 'sparkle', { dur: 0.5, gain: 0.35 });
  }

  // ── 2 · so it's gone for good, right? ───────────────────────────────────
  {
    const st = cut(1), gd = Wd('good', 1) - st, rt = Wd('right', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 640], zoom: 0.12, note: 'room; hero holds phone, smug; GONE FOR GOOD pill on "good"; big ? + raised brow on "right"',
      draw(lt, d, t) {
        K.room();
        K.man({ x: 470, y: 1200, s: 0.95, arm: K.PHONE_ARM, holding: heldPhone(photoScreen(1)), eyes: 'n', mouth: lt > rt ? 'o' : 'smirk', smirk: lt <= rt, brow: lt > rt ? 1 : 0.5, look: 0.3 });
        if (lt > gd) K.pill('GONE FOR GOOD', 540, 250, 62, C.ink, C.white, E(seg(lt, gd, gd + 0.25)));
        if (lt > rt) bigText('?', 820, 470, 230, C.yellow, 0.18, E(seg(lt, rt, rt + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + gd, 'pop', { gain: 0.35 }); cue(st + rt, 'boing', { gain: 0.35 });
  }

  // ── 3 · Well, not quite. ────────────────────────────────────────────────
  {
    const st = cut(2), nt = Wd('not', 2) - st, qt = Wd('quite', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 720], zoom: 0.14, note: 'hard drive spinning; NOT QUITE red pill on "not"; the photo peeks out from behind the drive on "quite"',
      draw(lt, d, t) {
        bg('#F6D9DC', C.bg);
        if (lt > qt) K.photo(lerp(560, 800, E(seg(lt, qt, qt + 0.35))), 560, 0.9, 0.25 + Math.sin(lt * 9) * 0.05);
        K.hardDrive(540, 760, 0.95, t, 0.3 + Math.sin(t * 3) * 0.2);
        if (lt > nt) K.pill('NOT QUITE', 540, 240, 70, C.red, C.white, E(seg(lt, nt, nt + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + nt, 'slam', { gain: 0.4 }); cue(st + qt + 0.1, 'boing', { gain: 0.3 });
  }

  // ── 4 · Your drive keeps a kind of table of contents ────────────────────
  {
    const st = cut(3), dr = Wd('drive', 3) - st, tb = Wd('table', 3) - st, kp = Wd('keeps', 3) - st;
    add({ id: 'S04', at: st, cam: [540, 640], zoom: 0.08, note: 'small drive at top, DRIVE pill on "drive"; table-of-contents card drops in on "table", rows pop one by one',
      draw(lt, d, t) {
        bg('#DDEFF6');
        K.hardDrive(540, 330, 0.4, t, 0.4);
        if (lt > dr) K.pill('YOUR DRIVE', 850, 330, 50, C.ink, C.white, E(seg(lt, dr, dr + 0.25)));
        if (lt > kp - 0.15) {
          const p = E(seg(lt, kp - 0.15, kp + 0.25));
          const n = clamp(Math.floor((lt - tb) / 0.18) + 1, 0, 4);
          K.tocCard(540, lerp(1500, 540, p), 1.0, TOC.slice(0, n), {});
        }
      } });
    cue(st, 'whoosh'); cue(st + dr, 'pop', { gain: 0.3 }); cue(st + kp, 'slide', { dur: 0.3, gain: 0.25 }); for (let k = 0; k < 4; k++) cue(st + tb + 0.2 + k * 0.18, 'pop', { gain: 0.18 });
  }

  // ── 5 · that says where every file lives ────────────────────────────────
  {
    const st = cut(4), wh = Wd('where', 4) - st, lv = Wd('lives', 4) - st;
    const gx = 540, gy = 905, cell = 110;
    add({ id: 'S05', at: st, cam: [540, 700], zoom: 0.08, note: 'TOC card top, block grid below; photo row highlighted on "where", line draws to the photo blocks; blocks glow on "lives"',
      draw(lt, d, t) {
        bg('#E9E2D2', C.bg);
        K.tocCard(540, 140, 0.75, TOC, { hi: 3, hiP: eo(seg(lt, wh, wh + 0.2)) });
        const [rx, ry, rw, rh] = K.gridRegion(gx, gy, 6, 5, cell, PH);
        grid(gx, gy, cell, { glow: eo(seg(lt, lv, lv + 0.2)) });
        if (lt > wh) {
          const u = eo(seg(lt, wh + 0.1, wh + 0.6)), x0 = 800, y0 = 475, x1 = rx, y1 = ry - rh / 2 - 8;
          const xe = lerp(x0, x1, u), ye = lerp(y0, y1, u);
          line([[x0, y0], [xe, ye]], C.yellow, 16); circle(x0, y0, 14, C.yellow); circle(xe, ye, 18, C.yellow);
        }
      } });
    cue(st, 'whoosh'); cue(st + wh, 'pop', { gain: 0.35 }); cue(st + wh + 0.1, 'slide', { dur: 0.5, gain: 0.2 }); cue(st + lv, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 6 · Deleting just removes the file's entry from that list ───────────
  {
    const st = cut(5), dl = Wd('deleting', 5) - st, rm = Wd('removes', 5) - st, ls = Wd('list', 5) - st;
    add({ id: 'S06', at: st, cam: [540, 640], zoom: 0.1, note: 'big TOC card; DELETE pill on "deleting"; red strike through photo.jpg on "removes"; row fades out on "list"',
      draw(lt, d, t) {
        bg('#F6D9DC', C.bg);
        K.tocCard(540, 400, 1.12, TOC, { strike: 3, strikeP: eo(seg(lt, rm, rm + 0.35)), gone: eo(seg(lt, ls, ls + 0.35)), hi: 3, hiP: 1 - seg(lt, rm, rm + 0.2) });
        if (lt > dl) K.pill('DELETE', 540, 230, 66, C.red, C.white, E(seg(lt, dl, dl + 0.25)));
        if (lt > ls) K.pill('ENTRY GONE', 760, 1120, 54, C.ink, C.white, E(seg(lt, ls + 0.1, ls + 0.35)));
      } });
    cue(st, 'whoosh'); cue(st + dl, 'pop', { gain: 0.35 }); cue(st + rm, 'zip', { gain: 0.35 }); cue(st + ls + 0.1, 'pop', { gain: 0.3 });
  }

  // ── 7 · and marks its space as free to reuse ────────────────────────────
  {
    const st = cut(6), mk = Wd('marks', 6) - st, fr = Wd('free', 6) - st;
    add({ id: 'S07', at: st, cam: [540, 720], zoom: 0.08, note: 'big block grid with the photo tiles; green dashed FREE outline marches on "marks"; FREE SPACE pill on "free"',
      draw(lt, d, t) {
        bg('#DDEFF6');
        grid(540, 730, 140, { free: eo(seg(lt, mk, mk + 0.3)), t });
        if (lt > fr) K.pill('FREE SPACE', 540, 250, 66, GREEN, C.white, E(seg(lt, fr, fr + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + mk, 'pop', { gain: 0.3 }); cue(st + fr, 'sparkle', { dur: 0.4, gain: 0.3 });
  }

  // ── 8 · But the actual data is still sitting there ──────────────────────
  {
    const st = cut(7), da = Wd('data', 7) - st, sl = Wd('still', 7) - st;
    add({ id: 'S08', at: st, cam: [540, 720], zoom: 0.2, note: 'same grid, magnifier sweeps over the photo tiles; STILL THERE pill + glow on "still"',
      draw(lt, d, t) {
        bg('#DDEFF6');
        grid(540, 730, 140, { free: 1, t, glow: eo(seg(lt, sl, sl + 0.25)) });
        const u = eio(seg(lt, 0.1, da + 0.6));
        K.magnifier(lerp(330, 640, u), 700 + Math.sin(u * 6) * 40, 1.5, -0.6, C.ink);
        if (lt > sl) K.pill('STILL THERE', 540, 250, 66, C.yellow, C.ink, E(seg(lt, sl, sl + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 0.8, gain: 0.2 }); cue(st + sl, 'pop', { gain: 0.4 });
  }

  // ── 9 · which is why recovery apps can bring it back ────────────────────
  {
    const st = cut(8), rc = Wd('recovery', 8) - st, br = Wd('bring', 8) - st, bk = Wd('back', 8) - st;
    add({ id: 'S09', at: st, cam: [540, 700], zoom: 0.1, note: 'laptop with recovery app scanning from "recovery"; on "bring" photo pops up out of the laptop; green check on "back"',
      draw(lt, d, t) {
        bg('#E9E2D2', C.bg);
        const found = lt > br ? 1 : -1;
        const p = lt > br ? 1 : clamp((lt - rc) / (br - rc));
        if (lt > br) K.photo(540, lerp(800, 380, E(seg(lt, br, br + 0.4))), lerp(0.5, 1.4, E(seg(lt, br, br + 0.4))), -0.08);
        K.laptop(540, 860, 0.95, () => K.recoveryScreen(p, found, t));
        if (lt > bk) K.check(860, 330, 0.7 * E(seg(lt, bk, bk + 0.25)), 1);
      } });
    cue(st, 'whoosh'); cue(st + rc, 'slide', { dur: 0.6, gain: 0.2 }); cue(st + br, 'sparkle', { dur: 0.5, gain: 0.35 }); cue(st + bk, 'boing', { gain: 0.35 });
  }

  // ── 10 · Here's the twist ───────────────────────────────────────────────
  {
    const st = cut(9), tw = Wd('twist', 9) - st;
    add({ id: 'S10', at: st, cam: [540, 600], zoom: 0.14, note: 'room; hero smirks then wide eyes + red warning on "twist"',
      draw(lt, d, t) {
        K.room();
        const hit = lt > tw;
        K.man({ x: 450, y: 1180, s: 1.0, arm: K.PHONE_ARM, holding: heldPhone(photoScreen(0)), eyes: hit ? 'wide' : 'n', mouth: hit ? 'o' : 'smirk', brow: hit ? 1 : 0.6, smirk: !hit, look: 0.4 });
        if (hit) { K.warning(820, 360, 0.8 * E(seg(lt, tw, tw + 0.25))); K.shockLines(450, 830, 150, clamp((lt - tw) * 4)); }
      } });
    cue(st, 'whoosh'); cue(st + tw, 'slam', { gain: 0.45 });
  }

  // ── 11 · once new files get saved on top ────────────────────────────────
  {
    const st = cut(10), nw = Wd('new', 10) - st, sv = Wd('saved', 10) - st, tp = Wd('top', 10) - st;
    add({ id: 'S11', at: st, cam: [540, 720], zoom: 0.1, note: 'grid with free photo tiles; NEW FILES pill on "new"; colored blocks drop onto photo tiles one by one from "saved"',
      draw(lt, d, t) {
        bg('#DDEFF6');
        const over = lt > sv ? clamp((lt - sv) / 0.2, 0, 5.5) : 0;
        grid(540, 730, 140, { free: 1, t, over });
        if (lt > nw) K.pill(lt > tp ? 'SAVED ON TOP' : 'NEW FILES', 540, 250, 64, lt > tp ? C.yellow : C.ink, lt > tp ? C.ink : C.white, E(seg(lt, nw, nw + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + nw, 'pop', { gain: 0.3 }); for (let k = 0; k < 5; k++) cue(st + sv + 0.15 + k * 0.2, 'thud', { gain: 0.22 });
  }

  // ── 12 · the old data is overwritten ────────────────────────────────────
  {
    const st = cut(11), ow = Wd('overwritten', 11) - st;
    add({ id: 'S12', at: st, cam: [540, 720], zoom: 0.12, note: 'grid keeps filling until every photo tile is covered (done by "overwritten"); OVERWRITTEN red pill',
      draw(lt, d, t) {
        bg('#F6D9DC', C.bg);
        const over = clamp(5.5 + lt / 0.13, 0, 12);
        grid(540, 730, 140, { free: 1 - seg(lt, ow, ow + 0.4), t, over });
        if (lt > ow) K.pill('OVERWRITTEN', 540, 250, 66, C.red, C.white, E(seg(lt, ow, ow + 0.25)));
      } });
    cue(st, 'whoosh'); for (let k = 0; k < 6; k++) cue(st + 0.1 + k * 0.13, 'thud', { gain: 0.2 }); cue(st + ow, 'slam', { gain: 0.35 });
  }
  // ── 12b · and then it's really gone ─────────────────────────────────────
  {
    const st = Wd('then', 11) - 0.12, gn = Wd('gone', 11) - st;
    add({ id: 'S12b', at: st, cam: [540, 700], zoom: 0.12, note: 'laptop recovery app: 0 FILES FOUND, NOTHING LEFT; red X on "gone"',
      draw(lt, d, t) {
        bg('#F6D9DC', C.bg);
        K.laptop(540, 760, 0.95, () => K.recoveryScreen(1, 0, t));
        if (lt > gn) K.redX(540, 700, lerp(1.6, 0.9, eo(seg(lt, gn, gn + 0.2))), 1);
      } });
    cue(st, 'whoosh'); cue(st + gn, 'slam', { gain: 0.45 });
  }

  // ── 13 · And on modern SSDs ─────────────────────────────────────────────
  {
    const st = cut(12), md = Wd('modern', 12) - st;
    add({ id: 'S13', at: st, cam: [540, 700], zoom: 0.14, note: 'SSD stick slides in and lands; MODERN DRIVES pill on "modern"',
      draw(lt, d, t) {
        bg('#DDEFF6');
        K.ssd(lerp(1500, 540, E(seg(lt, 0.05, 0.45))), 720, 1.4, -0.06);
        if (lt > md) K.pill('MODERN DRIVES', 540, 300, 62, C.ink, C.white, E(seg(lt, md, md + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.1, 'slide', { dur: 0.35, gain: 0.3 }); cue(st + 0.45, 'thud', { gain: 0.35 }); cue(st + md, 'pop', { gain: 0.3 });
  }
  // ── 13b · that cleanup can happen almost right away ─────────────────────
  {
    const st = Wd('that', 12) - 0.12, cl = Wd('cleanup', 12) - st, rt = Wd('right', 12) - st;
    add({ id: 'S13b', at: st, cam: [540, 720], zoom: 0.1, note: 'grid with freed photo; broom sweeps left to right from "cleanup", tiles go blank behind it; stopwatch + ALMOST INSTANT on "right"',
      draw(lt, d, t) {
        bg('#E9E2D2', C.bg);
        const w = clamp((lt - cl) / 1.0);
        grid(540, 700, 140, { free: 1 - w, t, wipe: w });
        if (lt > cl - 0.2 && w < 1) K.broom(lerp(220, 900, w), 760 + Math.sin(lt * 18) * 20, 0.8, 0.5 + Math.sin(lt * 18) * 0.15);
        if (lt > rt) { K.stopwatch(860, 250, 0.5 * E(seg(lt, rt, rt + 0.25)), lt * 6); K.pill('ALMOST INSTANT', 400, 250, 58, C.yellow, C.ink, E(seg(lt, rt, rt + 0.25))); }
      } });
    cue(st, 'whoosh'); cue(st + cl, 'sizzle', { dur: 1.0, gain: 0.18 }); cue(st + rt, 'pop', { gain: 0.4 }); cue(st + rt + 0.3, 'tock', { gain: 0.3 });
  }

  // ── 14 · So deleting doesn't erase a file ───────────────────────────────
  {
    const st = cut(13), er = Wd('erase', 13) - st;
    add({ id: 'S14', at: st, cam: [540, 720], zoom: 0.1, note: 'grid with intact photo (free outline); NOT ERASED pill + glow on "erase"',
      draw(lt, d, t) {
        bg('#DDEFF6');
        grid(540, 730, 140, { free: 1, t, glow: eo(seg(lt, er, er + 0.25)) });
        if (lt > er) K.pill('NOT ERASED', 540, 250, 66, C.yellow, C.ink, E(seg(lt, er, er + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + er, 'pop', { gain: 0.4 });
  }
  // ── 14b · it just forgets where it was (to camera, loop) ────────────────
  {
    const st = Wd('just', 13) - 0.3, fg = Wd('forgets', 13) - st, ws = Wd('was', 13) - st;
    add({ id: 'S14b', at: st, cam: [540, 640], zoom: 0.08, note: 'room; hero to camera points up; thought bubble WHERE WAS IT? on "forgets"; wink + grin on "was"',
      draw(lt, d, t) {
        K.room();
        if (lt > fg) K.bubble(560, 330, 1, 'WHERE WAS IT?', E(seg(lt, fg, fg + 0.25)), 1, C.white, C.ink, 64);
        K.man({ x: 540, y: 1230, s: 0.85, arm: K.armPose(K.ARM.down, K.ARM.point, eo(seg(lt, 0, 0.3))), finger: -0.2,
          eyes: lt > ws ? 'wink' : 'n', mouth: lt > ws ? 'grin' : 'smirk', brow: 0.6, look: 0 });
      } });
    cue(st, 'whoosh'); cue(st + fg, 'pop', { gain: 0.35 }); cue(st + ws + 0.1, 'boing', { gain: 0.35 });
  }

  return { shots: S, cues: CUES };
}
