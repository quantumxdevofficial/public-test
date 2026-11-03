# RUNBOOK — scheduled QuantumXDev tech short (make → publish → log)

One run = one new short, published publicly to the QuantumXDev YouTube channel. Work unattended: never stop to
ask questions. If something fails twice, stop, leave the log untouched, and report what failed.

## 0. Setup (fresh container)
- Repo: attach `quantumxdevofficial/public-test` with push access (add_repo), clone it to `/home/claude/public-test`.
- Load the **faceless-shorts** skill (Skill tool) and read its `styles/inside-out/STYLE.md` in full.
  `SKILL` below = that skill's folder.
- `bash SKILL/scripts/setup.sh`. Whisper download is blocked here; that is expected and fine
  (words.py falls back to spreading words inside exact line times). Node, ffmpeg, Chrome, venv and the voice must be ok.

## 1. Pick the topic (no repeats)
- Read `quantumxdev-yt-videos.md` (the log) and `topics.md` (the queue).
- Take the first unchecked topic in `topics.md` whose subject is NOT already in the log. If none are left, invent a
  new beginner tech explainer not in the log, add it to `topics.md`.
- Short name = kebab-case slug, e.g. `press-enter-on-google`.

## 2. Look and format (keep it identical to the earlier videos)
- Style **Inside Out** (flat 2D), 1080x1920, voice `am_michael`, speed 1.05, music `bed`, target 35-43 s.
- `bash SKILL/scripts/new_video.sh inside-out <slug>`, then copy EVERY file in `shorts-kit/` named
  `lib.js timing.js captions.js kit.js tech.js wifi.js` into `~/faceless-shorts/<slug>/src/core/` (overwrite).
  This gives the SMALL captions (CAP size 104) and the tech components: phone, homeScreen, weatherScreen, phoneXray,
  server, envelope, route/arcAt, menuCard, jsonCard, sun, errorCard, apiGate, tapFinger, ripple, appTile, weatherTile,
  PHONE_ARM, wink eyes, wifiIcon, router, waves, sine, bit, globe, wall, cable, microwave, noise, spinner, kitchen.
- Study `shorts-kit/example-api-shots.js`, `example-wifi-shots.js`, `example-wifi-script.json` for shot style.
- New components for the topic go in a new file `src/core/<topic>.js`, exported from kit.js
  (`export * from './<topic>.js';`) in the same flat look. Copy that file into `shorts-kit/` at the end and add the
  export line to `shorts-kit/kit.js`, so the next run has it.

## 3. Script
- Follow the skill's script rules: talk like a friend, flowing sentences, a line = a cut (1.5-3.5 s), hook question →
  explanation → surprise → twist → punchy loop line. ~95-105 words. Original writing.
- Captions in `caps`: 1-3 words per chunk, exactly ONE `*yellow` word per chunk, chunk starts with a spoken word.
- Check pronunciation of acronyms with kokoro_onnx Tokenizer().phonemize (write e.g. "Jason" for JSON if needed).
- Verify every fact with WebSearch; list sources in script.json "sources".

## 4. Build + QA (SKILL section 3-4)
- voice.py → words.py → shots.js → `node tools/capture.mjs check` (CHECK OK, fix caps without a yellow word)
  → cues → mix.py → `sheet review/all.jpg 0.5 10` → LOOK at it → fix collisions, empty shots, hidden props,
  things under the caption zone (y 1250-1550) → re-check → `node tools/capture.mjs video renders/<slug>.mp4`.

## 5. Publish (cloud only, no PC needed)
1. `cp renders/<slug>.mp4 /home/claude/public-test/videos/<slug>.mp4`, commit "Add <slug> video", `git push origin main`.
2. Raw link: `https://raw.githubusercontent.com/quantumxdevofficial/public-test/main/videos/<slug>.mp4`.
   Confirm `curl -sI` gives 200 and the right content-length (raw cache can take ~30 s).
3. Zapier: `inspect_zapier_actions` (YouTube) → `execute_zapier_write_action` action `upload_video`
   (tool_name `youtube_upload_video`) with params:
   - `video`: the raw link · `title`: "<Catchy question title> <one emoji> #shorts"
   - `description`: 1-2 sentence hook + "\n\n" + 6-8 hashtags ending with #shorts
   - `tags`: 6-8 strings · `category_id`: "27" (Education) · `privacy_status`: "public"
   - `made_for_kids`: false · `notify_subscribers`: true · `default_language`: "en" · `default_audio_language`: "en"
4. From the result take `play_url` (https://www.youtube.com/watch?v=<id>).

## 6. Log + clean up
- Append a row to `quantumxdev-yt-videos.md`: `| <next No.> | <title> | <play_url> | <YYYY-MM-DD in Asia/Kolkata> |`.
- Tick the topic in `topics.md`. Copy any new component file into `shorts-kit/`.
- `git rm videos/<slug>.mp4` (only AFTER the upload succeeded), commit "Publish <slug>: <play_url>", push.
- If the run is linked to the user's PC (mcp__remote-devices__ tools present and working), also write the updated log to
  `C:\Users\Vishal Singh\Downloads\QuantumXDev-Studio\quantumxdev-yt-videos.md`. Otherwise skip silently.

## 7. Report
Final message: title, YouTube link, length, topic chosen, anything fixed in QA, anything that failed.
