// WHAT ACTUALLY HAPPENS WHEN YOU HIT SEND ON AN EMAIL?: the shot list.
// A shot: { id, at, cam: [cx, cy], zoom, note, draw(lt, d, t) }  · lt = time in shot, d = shot length, t = film time.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText, fillAll, circle, ell, line, rr } from './core/lib.js';
import { L, Le, Wd, T, lineWords } from './core/timing.js';
import * as K from './core/kit.js';
const E = (v) => (v <= 0 ? 0 : eob(v));
const disc = (y = 740) => { fillAll(C.bg); circle(540, y, 520, '#E4DCCB'); };
const BLUE = '#3A7BD5', GREEN = '#5BAE6A';
const DNS_ROWS = [['gmail.com', 'mx.gmail'], ['yahoo.com', 'mx.yahoo'], ['outlook.com', 'mx.outlook']];
const SPAM = [1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0]; // 9 of 20 ≈ 45 %

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const wcut = (w, i) => Wd(w, i) - 0.08;

  // ── 1 · What actually happens when you hit send on an email? ──
  {
    const st = cut(0), se = Wd('send', 0) - st, em = Wd('email', 0) - st;
    add({ id: 'S01', at: st, cam: [540, 700], zoom: 0.12, note: 'phone with New email form typing; SEND pressed on "send"; envelope flies up out of the phone on "email"',
      draw(lt) {
        disc(700);
        const press = seg(lt, se - 0.1, se) - seg(lt, se + 0.15, se + 0.3);
        const gone = eio(seg(lt, em - 0.2, em + 0.2));
        K.phone(540, 720, 1.25 * E(seg(lt, 0, 0.35)), () => K.composeScreen(seg(lt, 0.2, se - 0.2), press, gone));
        if (lt > em - 0.2) {
          const u = eio(seg(lt, em - 0.2, em + 0.6));
          K.envelope(lerp(540, 820, u), lerp(700, 260, u), lerp(0.6, 1.1, u), lerp(0, -0.25, u));
          if (u > 0.2) K.speedLines(lerp(540, 820, u) - 120, lerp(700, 260, u) + 120, clamp(1 - u));
        }
        if (lt > se) K.pill('SEND', 260, 230, 72, C.yellow, C.ink, E(seg(lt, se, se + 0.25)));
      } });
    cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + se, 'pop', { gain: 0.45 }); cue(st + em - 0.2, 'zip', { gain: 0.35 });
  }
  // ── 2 · Well, your app hands it to a sending server ──
  {
    const st = cut(1), ap = Wd('app', 1) - st, ha = Wd('hands', 1) - st, sv = Wd('sending', 1) - st;
    add({ id: 'S02', at: st, cam: [540, 700], zoom: 0.1, note: 'phone left (YOUR APP on "app"), server right with mail badge; envelope travels the arc phone→server from "hands"; SENDING SERVER on "sending"',
      draw(lt, d, t) {
        disc(720);
        K.phone(250, 760, 0.8, () => K.composeScreen(1, 0, 1));
        K.server(820, 760, 0.8 * E(seg(lt, 0.1, 0.4)), t); K.mailBadge(820, 500, 0.9 * E(seg(lt, 0.2, 0.5)));
        const u = eio(seg(lt, ha, sv + 0.2));
        K.route(320, 470, 760, 470, 260, 0, Math.max(u, 0.001));
        if (u > 0 && u < 1) { const [x, y] = K.arcAt(320, 470, 760, 470, 260, u); K.envelope(x, y, 0.6, Math.sin(u * 6) * 0.15); }
        if (lt > ap) K.pill('YOUR APP', 250, 1150, 62, C.ink, C.white, E(seg(lt, ap, ap + 0.25)));
        if (lt > sv) K.pill('SENDING SERVER', 740, 1060, 46, BLUE, C.white, E(seg(lt, sv, sv + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + ap, 'pop', { gain: 0.35 }); cue(st + ha, 'slide', { dur: sv - ha + 0.2, gain: 0.25 }); cue(st + sv + 0.2, 'thud', { gain: 0.3 }); cue(st + sv, 'pop', { gain: 0.35 });
  }
  // ── 3 · which reads the part after the at sign, ──
  {
    const st = cut(2), pa = Wd('part', 2) - st, at = Wd('at', 2) - st;
    add({ id: 'S03', at: st, cam: [540, 700], zoom: 0.14, note: 'big address card sam@gmail.com; magnifier slides over; yellow sweep over the domain on "part"; @ pulses blue on "at"',
      draw(lt) {
        disc(700);
        const hi = eio(seg(lt, pa, pa + 0.4)), atP = lt > at ? Math.max(0, Math.sin((lt - at) * 5)) * (1 - seg(lt, at + 0.6, at + 1)) : 0;
        K.addressCard(540, 700, 1, 'sam', 'gmail.com', hi, atP, E(seg(lt, 0, 0.35)));
        const dx = K.addressDomainX(540, 1);
        const mx = lerp(1200, dx + 40, eio(seg(lt, 0.15, pa)));
        K.magnifier(mx, 820, 1.1);
        if (lt > at) K.tag('AFTER THE @', 540, 380, dx - 30, 610, 60, E(seg(lt, at, at + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.15, 'slide', { dur: 0.5, gain: 0.2 }); cue(st + pa, 'sparkle', { dur: 0.4, gain: 0.3 }); cue(st + at, 'pop', { gain: 0.4 });
  }
  // ── 3b · like gmail dot com. ──
  {
    const st = wcut('like', 2), gm = Wd('gmail', 2) - st;
    add({ id: 'S04', at: st, cam: [540, 650], zoom: 0.18, note: 'domain lifts out of the card as a big yellow gmail.com pill on "gmail"; a ? pops beside it',
      draw(lt) {
        disc(700);
        K.addressCard(540, 980, 0.8, 'sam', 'gmail.com', 1, 0);
        const u = E(seg(lt, gm - 0.1, gm + 0.3));
        if (u > 0) K.pill('gmail.com', 540, lerp(980, 560, u), lerp(60, 110, u), C.yellow, C.ink, 1);
        if (lt > gm + 0.4) K.qmark(900, 400, 0.9, E(seg(lt, gm + 0.4, gm + 0.65)), 0.2);
      } });
    cue(st, 'whoosh'); cue(st + gm, 'zip', { gain: 0.3 }); cue(st + gm + 0.3, 'pop', { gain: 0.35 }); cue(st + gm + 0.45, 'boing', { gain: 0.3 });
  }
  // ── 4 · Then it asks DNS, the internet's phone book, ──
  {
    const st = cut(3), as = Wd('asks', 3) - st, dn = Wd('DNS', 3) - st, ph = Wd('phone', 3) - st;
    add({ id: 'S05', at: st, cam: [540, 680], zoom: 0.1, note: 'sending server bottom-left asks (bubble "gmail.com?") on "asks"; DNS book drops in on "DNS"; PHONE BOOK pill on "phone"',
      draw(lt, d, t) {
        disc(720);
        K.dnsBook(600, 600, 0.95 * (1 + 0.08 * Math.sin(Math.PI * seg(lt, dn - 0.1, dn + 0.25))), DNS_ROWS, -1, 0, 1, E(seg(lt, 0.05, 0.4)));
        K.server(190, 960, 0.5, t); K.mailBadge(190, 800, 0.55);
        if (lt > as) K.bubble(420, 1110, 0.9, 'gmail.com?', E(seg(lt, as, as + 0.25)), -1);
        if (lt > ph) K.pill("INTERNET'S PHONE BOOK", 600, 170, 52, C.ink, C.white, E(seg(lt, ph, ph + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'thud', { gain: 0.35 }); cue(st + as, 'pop', { gain: 0.35 }); cue(st + dn, 'pop', { gain: 0.4 }); cue(st + ph, 'pop', { gain: 0.35 });
  }
  // ── 5 · which server takes mail for that name. ──
  {
    const st = cut(4), sv = Wd('server', 4) - st, ma = Wd('mail', 4) - st, na = Wd('name', 4) - st;
    add({ id: 'S06', at: st, cam: [540, 620], zoom: 0.14, note: 'DNS book: gmail.com row highlights on "server", mail-server address types on "mail"; MAIL SERVER FOUND on "name"',
      draw(lt) {
        disc(700);
        K.dnsBook(540, 640, 1.05, DNS_ROWS, 0, eio(seg(lt, sv - 0.1, sv + 0.3)), seg(lt, ma - 0.1, na));
        if (lt > na) K.pill('MAIL SERVER FOUND ✓', 540, 1120, 58, GREEN, C.white, E(seg(lt, na, na + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + sv, 'slide', { dur: 0.35, gain: 0.2 }); cue(st + ma, 'sparkle', { dur: na - ma, gain: 0.2 }); cue(st + na, 'pop', { gain: 0.45 });
  }
  // ── 6 · Your server passes it across the internet, ──
  {
    const st = cut(5), pa = Wd('passes', 5) - st, it = Wd('internet', 5) - st;
    add({ id: 'S07', at: st, cam: [540, 700], zoom: 0.12, note: 'globe centre; your server left, their mail server right; envelope arcs over the globe from "passes" to past "internet"',
      draw(lt, d, t) {
        disc(760);
        K.globe(540, 820, 2.1 * E(seg(lt, 0, 0.35)), t);
        K.server(140, 900, 0.45, t); K.mailBadge(140, 760, 0.5);
        K.server(940, 900, 0.45, t); K.mailBadge(940, 760, 0.5, C.red);
        const u = eio(seg(lt, pa, it + 0.5));
        K.route(170, 660, 910, 660, 520, 0, Math.max(u, 0.001));
        if (u > 0 && u < 1) { const [x, y] = K.arcAt(170, 660, 910, 660, 520, u); K.envelope(x, y, 0.65, (u - 0.5) * 0.6); }
        if (lt > it) K.pill('ACROSS THE INTERNET', 540, 1150, 56, C.ink, C.white, E(seg(lt, it, it + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + pa, 'slide', { dur: it - pa + 0.5, gain: 0.25 }); cue(st + it, 'pop', { gain: 0.35 });
  }
  // ── 7 · and it waits in their mailbox ──
  {
    const st = cut(6), wa = Wd('waits', 6) - st, mb = Wd('mailbox', 6) - st;
    add({ id: 'S08', at: st, cam: [540, 640], zoom: 0.12, note: 'mailbox SAM; envelope drops in on "waits"; flag pops up + WAITING on "mailbox"',
      draw(lt) {
        disc(700);
        K.mailbox(540, 620, 1.9 * E(seg(lt, 0, 0.3)), 'SAM', eob(seg(lt, mb, mb + 0.3)));
        const u = eio(seg(lt, wa - 0.35, wa + 0.05));
        if (u < 1) K.envelope(lerp(560, 500, u), lerp(120, 560, u), lerp(0.8, 0.4, u), 0.2 * (1 - u));
        if (lt > mb) K.pill('WAITING ✓', 540, 1150, 64, C.ink, C.white, E(seg(lt, mb, mb + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + wa - 0.35, 'slide', { dur: 0.35, gain: 0.2 }); cue(st + wa, 'thud', { gain: 0.35 }); cue(st + mb, 'boing', { gain: 0.35 });
  }
  // ── 7b · until their phone pulls it down. ──
  {
    const st = wcut('until', 6), ph = Wd('phone', 6) - st, pu = Wd('pulls', 6) - st;
    add({ id: 'S09', at: st, cam: [540, 640], zoom: 0.12, note: 'phone with inbox pops on "phone"; pull-down spinner + arrow, new email slides in at the top on "pulls"',
      draw(lt, d, t) {
        disc(700);
        const p = eio(seg(lt, pu + 0.15, pu + 0.55));
        K.phone(540, 680, 1.25 * E(seg(lt, 0, 0.3)) * (1 + 0.06 * Math.sin(Math.PI * seg(lt, ph - 0.1, ph + 0.25))), () => K.inboxScreen(p, 'You', 'Hi Sam!'));
        if (lt > pu && p < 1) K.spinner(540, 220, 0.6, t);
        if (lt > pu - 0.1) K.arrow(880, lerp(260, 520, eio(seg(lt, pu - 0.1, pu + 0.4))), 150, Math.PI / 2, 1 - seg(lt, pu + 0.6, pu + 0.9));
        if (p >= 1) K.pill('NEW EMAIL!', 540, 1150, 66, C.yellow, C.ink, E(seg(lt, pu + 0.55, pu + 0.8)));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.35 }); cue(st + pu, 'slide', { dur: 0.4, gain: 0.25 }); cue(st + pu + 0.55, 'pop', { gain: 0.45 });
  }
  // ── 8 · But almost half of all emails are spam, ──
  {
    const st = cut(7), ha = Wd('half', 7) - st, sp = Wd('spam', 7) - st;
    add({ id: 'S10', at: st, cam: [540, 700], zoom: 0.1, note: 'grid of 20 envelopes; from "half" 9 of them flip to red SPAM one by one; ≈45% SPAM pill on "spam"',
      draw(lt) {
        disc(720);
        let k = 0;
        for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) {
          const i = r * 4 + c, x = 210 + c * 220, y = 330 + r * 180;
          const a = E(seg(lt, 0.03 * i, 0.03 * i + 0.25));
          const flip = SPAM[i] ? seg(lt, ha + 0.07 * k, ha + 0.07 * k + 0.12) : 0; if (SPAM[i]) k++;
          K.mailEnvelope(x, y, 0.78 * a * (1 + 0.15 * Math.sin(flip * Math.PI)), flip > 0.5, 0);
        }
        if (lt > sp) K.pill('≈ 45% SPAM', 540, 170, 80, C.red, C.white, E(seg(lt, sp, sp + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.2 }); cue(st + ha, 'pop', { gain: 0.3 }); cue(st + ha + 0.3, 'pop', { gain: 0.25 }); cue(st + sp, 'slam', { gain: 0.45 });
  }
  // ── 9 · so filters check each one first. ──
  {
    const st = cut(8), fi = Wd('filters', 8) - st, ea = Wd('each', 8) - st, fs = Wd('first', 8) - st;
    add({ id: 'S11', at: st, cam: [540, 640], zoom: 0.1, note: 'filter funnel with shield pops on "filters"; envelopes fall in from "each": spam bounces left into the trash, good mail drops out the bottom to INBOX; shield lights on "first"',
      draw(lt) {
        disc(700);
        const g = E(seg(lt, fi - 0.2, fi + 0.1));
        K.trashCan(170, 980, 0.65, 0.6, 0);
        const seq = [1, 0, 1, 0, 1, 0];
        seq.forEach((spam, j) => {
          const t0 = ea - 0.2 + j * 0.28, u = seg(lt, t0, t0 + 0.55); if (u <= 0 || u >= 1) return;
          const v = eio(u);
          if (spam) K.mailEnvelope(lerp(540, 170, v), lerp(260, 900, v) - Math.sin(v * Math.PI) * 220, 0.55, true, v * 3);
          else K.mailEnvelope(540, lerp(260, 1010, v), 0.55, false, 0, 1 - seg(u, 0.85, 1));
        });
        ctx.save(); ctx.translate(540, 560); ctx.scale(g || 0.0001, g || 0.0001); K.filterGate(0, 0, 1, lt > fs ? 1 : 0); ctx.restore();
        if (lt > fi) K.pill('SPAM FILTER', 540, 170, 66, C.ink, C.white, E(seg(lt, fi, fi + 0.25)));
        if (lt > ea + 0.6) K.pill('INBOX ✓', 820, 1010, 56, GREEN, C.white, E(seg(lt, ea + 0.6, ea + 0.85)));
      } });
    cue(st, 'whoosh'); cue(st + fi, 'pop', { gain: 0.4 }); cue(st + ea, 'boing', { gain: 0.25 }); cue(st + ea + 0.56, 'boing', { gain: 0.25 }); cue(st + fs, 'sparkle', { dur: 0.4, gain: 0.3 });
  }
  // ── 10 · The twist? ──
  {
    const st = cut(9), tw = Wd('twist', 9) - st;
    add({ id: 'S12', at: st, cam: [540, 700], zoom: 0.2, note: 'yellow burst + big ? on "twist"',
      draw(lt) {
        fillAll(C.bg);
        K.burst(540, 700, 1.6, E(seg(lt, tw - 0.1, tw + 0.2)));
        K.qmark(540, 700, lerp(1.1, 1.7, E(seg(lt, tw - 0.1, tw + 0.2))) * E(seg(lt, 0, 0.25)), 1, Math.sin(lt * 6) * 0.08);
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.3 }); cue(st + tw, 'boing', { gain: 0.4 });
  }
  // ── 10b · The first email, in nineteen seventy-one, ──
  {
    const st = wcut('first', 9), em = Wd('email', 9) - st, ni = Wd('nineteen', 9) - st;
    add({ id: 'S13', at: st, cam: [540, 680], zoom: 0.12, note: 'envelope with FIRST EMAIL pill on "email"; 1971 year card drops in on "nineteen"',
      draw(lt) {
        disc(700);
        const ye = E(seg(lt, ni - 0.15, ni + 0.3));
        K.envelope(lerp(540, 800, ye), lerp(660, 960, ye), lerp(1.8, 0.9, ye) * E(seg(lt, 0, 0.3)), lerp(0, 0.15, ye));
        if (lt > em) K.pill('THE FIRST EMAIL', 540, 170, 66, C.ink, C.white, E(seg(lt, em, em + 0.25)));
        if (ye > 0) K.yearCard(420, lerp(-400, 620, ye), 1, '1971', 'YEAR', -0.06);
      } });
    cue(st, 'whoosh'); cue(st + em, 'pop', { gain: 0.35 }); cue(st + ni + 0.1, 'thud', { gain: 0.45 });
  }
  // ── 11 · went between two computers sitting side by side, ──
  {
    const st = cut(10), co = Wd('computers', 10) - st, si = lineWords(10).at(-1).s - st;
    const scr = (txt) => () => { ctx.fillStyle = '#2A6A4A'; ctx.font = "700 40px 'DejaVu Sans Mono', monospace"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 10); };
    add({ id: 'S14', at: st, cam: [540, 700], zoom: 0.12, note: 'two retro computers side by side pop on "computers"; envelope hops from left to right; SIDE BY SIDE on the last "side"',
      draw(lt) {
        disc(720);
        const a = E(seg(lt, 0, 0.3)), b = E(seg(lt, 0.12, 0.42));
        K.retroPC(290, 760, 0.85 * a, scr('SEND >'));
        K.retroPC(790, 760, 0.85 * b, scr(lt > co + 1.3 ? 'NEW MAIL' : '_'));
        const u = eio(seg(lt, co + 0.3, co + 1.3));
        K.route(330, 440, 750, 440, 220, 0, Math.max(u, 0.001));
        if (u > 0 && u < 1) { const [x, y] = K.arcAt(330, 440, 750, 440, 220, u); K.envelope(x, y, 0.5, 0); }
        if (lt > si) K.pill('SIDE BY SIDE', 540, 1150, 66, C.yellow, C.ink, E(seg(lt, si, si + 0.25)));
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.3 }); cue(st + 0.17, 'pop', { gain: 0.3 }); cue(st + co + 0.3, 'slide', { dur: 1, gain: 0.2 }); cue(st + si, 'pop', { gain: 0.35 });
  }
  // ── 12 · and its inventor picked the at sign ──
  {
    const st = cut(11), inv = Wd('inventor', 11) - st, at = Wd('at', 11) - st;
    add({ id: 'S15', at: st, cam: [540, 700], zoom: 0.16, note: 'lightbulb + THE INVENTOR on "inventor"; giant @ tile slams down on "at" with a burst',
      draw(lt) {
        disc(720);
        const slam = E(seg(lt, at - 0.1, at + 0.2));
        if (slam < 1) K.bulb(540, 640, 1.2 * E(seg(lt, 0, 0.3)) * (1 + 0.1 * Math.sin(Math.PI * seg(lt, inv - 0.1, inv + 0.25))) * (1 - slam), 1);
        if (lt > inv && slam < 1) K.pill('THE INVENTOR', 540, 1120, 64, C.ink, C.white, E(seg(lt, inv, inv + 0.25)) * (1 - slam));
        if (slam > 0) { K.burst(540, 680, 1.4, clamp(1 - seg(lt, at + 0.2, at + 0.8))); K.atSign(540, 680, lerp(2.4, 1.6, slam), -0.05, C.yellow, 1); }
      } });
    cue(st, 'whoosh'); cue(st + inv - 0.2, 'sparkle', { dur: 0.4, gain: 0.25 }); cue(st + at + 0.05, 'slam', { gain: 0.5 });
  }
  // ── 13 · because nobody used it in names. ──
  {
    const st = cut(12), no = Wd('nobody', 12) - st, na = Wd('names', 12) - st;
    add({ id: 'S16', at: st, cam: [540, 680], zoom: 0.1, note: 'three name cards (no @ anywhere), magnifier scans; NO @ IN NAMES on "nobody"; on "names" cards slide off and ray@host pops with WHO / WHERE tags',
      draw(lt) {
        disc(700);
        const out = eio(seg(lt, na - 0.15, na + 0.25));
        ['SAM LEE', 'RAY T', 'ANN KIM'].forEach((n, i) => {
          const a = E(seg(lt, 0.05 * i, 0.05 * i + 0.3));
          K.nameCard(lerp(540 + (i - 1) * 40, -500, out), 420 + i * 300, 0.95 * a, n, (i - 1) * 0.04);
        });
        if (out < 0.25) K.magnifier(lerp(760, 840, Math.sin(lt * 4) * 0.5 + 0.5), lerp(400, 1000, seg(lt, 0, no + 0.3)), 0.9);
        if (lt > no && out < 1) K.pill('NO @ IN NAMES', 540, 170, 66, C.red, C.white, E(seg(lt, no, no + 0.25)));
        if (out > 0) {
          K.addressCard(540, 720, 1.05, 'ray', 'host', 0, 0, E(seg(lt, na - 0.05, na + 0.3)));
          if (lt > na + 0.3) { K.tag('WHO', 300, 430, 330, 620, 60, E(seg(lt, na + 0.3, na + 0.5))); K.tag('WHERE', 780, 430, 720, 620, 60, E(seg(lt, na + 0.45, na + 0.65))); }
        }
      } });
    cue(st, 'whoosh'); cue(st + 0.05, 'pop', { gain: 0.25 }); cue(st + no, 'pop', { gain: 0.35 }); cue(st + na, 'zip', { gain: 0.3 }); cue(st + na + 0.3, 'pop', { gain: 0.35 }); cue(st + na + 0.45, 'pop', { gain: 0.35 });
  }
  return { shots: S, cues: CUES };
}
