/* ============================================================
   insecure — live lyric video engine
   Reads the audio clock every frame and renders the cue sheet
   (CUES from cues.js) as live DOM on a pure white stage.
   Effects: typewriter steps, strobes, font-cycling, arch warp.
   ============================================================ */
(function () {
  "use strict";

  const stage     = document.getElementById("stage");
  const cueLayer  = document.getElementById("cueLayer");
  const audio     = document.getElementById("song");
  const landing   = document.getElementById("landing");
  const endcard   = document.getElementById("endcard");
  const playBtn   = document.getElementById("playBtn");
  const replayBtn = document.getElementById("replayBtn");
  const toastEl   = document.getElementById("toast");

  const ROLE_CLASS = {
    sans: "r-sans", cond: "r-cond", serif: "r-serif", serifIt: "r-serifIt",
    didone: "r-didone", didoneIt: "r-didoneIt", clar: "r-clar",
    round: "r-round", mono: "r-mono",
  };
  const ANCHOR_XY = {
    c:  [-50, -50], t:  [-50, 0],   b:  [-50, -100],
    l:  [0,   -50], r:  [-100, -50],
    tl: [0,    0],  tr: [-100, 0],  bl: [0, -100], br: [-100, -100],
  };

  let running = false;
  let clockOverride = null;
  let syncOffset = parseFloat(localStorage.getItem("ins_sync") || "0");
  const mounted = new Map();                // cueIndex -> element

  /* ---------- crisp fit-to-fill: real px font-size, never transform scale ---------- */
  const FIT_REF = 100;
  function ensureNat(el) {
    if (el.dataset.natW) return true;
    const prev = el.style.fontSize;
    el.style.fontSize = FIT_REF + "px";
    const nw = el.offsetWidth, nh = el.offsetHeight;
    if (nw && nh) { el.dataset.natW = nw; el.dataset.natH = nh; return true; }
    el.style.fontSize = prev;
    return false;
  }
  function applyFit(el, cue) {
    if (!ensureNat(el)) return;
    const W = stage.clientWidth, H = stage.clientHeight;
    if (!W || !H) return;
    const natW = +el.dataset.natW * (cue.stretch || 1);   // scaleX narrows the final box
    const natH = +el.dataset.natH;
    const vertical = Math.abs(((cue.rot || 0) % 180)) > 45;
    let fs;
    if (vertical) {
      fs = Math.min(FIT_REF * (cue.fit * H) / natW, FIT_REF * ((cue.fitW || 0.96) * W) / natH);
    } else {
      fs = Math.min(FIT_REF * (cue.fit * W) / natW, FIT_REF * ((cue.fitH || 0.96) * H) / natH);
    }
    el.style.fontSize = fs + "px";
  }

  /* ---------- text content helpers ---------- */
  function setText(el, cue, text) {
    if (el.dataset.txt === text) return;
    el.dataset.txt = text;
    delete el.dataset.spanned;               // game letter-spans die with the old text
    if (cue.fx === "arch") {
      el.textContent = "";
      const chars = text.split("");
      const n = chars.length;
      for (let i = 0; i < n; i++) {
        const s = document.createElement("span");
        s.className = "ch";
        s.textContent = chars[i];
        const u = n > 1 ? (2 * i / (n - 1) - 1) : 0;     // -1..1 across the word
        const lift = (cue.archAmp || 0.22) * (1 - u * u); // parabola bulge
        s.style.transform = "translateY(" + (-lift).toFixed(3) + "em) scaleY(" + (1 + 0.55 * lift).toFixed(3) + ")";
        el.appendChild(s);
      }
    } else {
      el.textContent = text;
    }
    delete el.dataset.natW; delete el.dataset.natH;      // re-measure after any swap
  }

  function stepIndex(cue, localT) {
    const n = cue.steps.length;
    if (cue.stepTimes) {
      let k = 0;
      for (let i = 0; i < n; i++) if (localT >= cue.stepTimes[i]) k = i;
      return k;
    }
    const d = cue.stepDur || 0.1001;
    let k = Math.floor(localT / d);
    if (cue.stepLoop) k = ((k % n) + n) % n;
    return Math.min(n - 1, Math.max(0, k));
  }

  /* ---------- mount / update ---------- */
  function mount(idx, cue) {
    const el = document.createElement("div");
    el.dataset.idx = idx;
    el.style.left = (cue.x != null ? cue.x : 50) + "%";
    el.style.top  = (cue.y != null ? cue.y : 50) + "%";

    if (cue.img) {
      el.className = "cue cue-img";
      const im = document.createElement("img");
      im.src = cue.img;
      im.alt = cue.alt || "";
      im.draggable = false;
      el.appendChild(im);
      el.style.height = (cue.size || 14) + "vh";
    } else {
      el.className = "cue " + (ROLE_CLASS[cue.role] || "r-sans");
      el.style.textAlign = cue.align || "center";
      if (cue.weight) el.style.fontWeight = cue.weight;
      if (cue.font) el.style.fontFamily = cue.font;
      if (cue.style) el.style.fontStyle = cue.style;
      if (cue.track != null) el.style.letterSpacing = cue.track + "em";
      if (cue.lh != null) el.style.lineHeight = cue.lh;
      if (cue.case === "upper") el.style.textTransform = "uppercase";
      if (cue.case === "lower") el.style.textTransform = "lowercase";
      if (cue.color) el.style.color = cue.color;
      if (cue.outline) el.classList.add("is-outline");
      setText(el, cue, cue.steps ? cue.steps[0] : cue.text);
      if (cue.fit) {
        el.style.whiteSpace = "pre";
        applyFit(el, cue);
      } else {
        el.style.fontSize = (cue.size || 8) + "vh";
      }
    }

    cueLayer.appendChild(el);
    if (cue.fit) applyFit(el, cue);
    clampWidth(el, cue);
    mounted.set(idx, el);
    if (window.__game) __game.onMount(idx, cue, el);
    return el;
  }

  // a vh-sized cue must never spill off a narrow viewport (unless it's meant to)
  function clampWidth(el, cue) {
    if (cue.fit || cue.noClamp) return;
    const W = stage.clientWidth;
    if (!W) return;
    const w = el.offsetWidth;
    if (w > 0.94 * W) {
      if (cue.img) {
        el.style.height = ((cue.size || 14) * 0.94 * W / w) + "vh";
      } else {
        const fs = parseFloat(el.style.fontSize);
        el.style.fontSize = (fs * 0.94 * W / w) + "vh";
      }
    }
  }

  function envelope(cue, localT, life) {
    const dur = cue.dur != null ? cue.dur : 0.12;
    let o = cue.opacity != null ? cue.opacity : 1;
    const fadeIn = cue.enter && cue.enter !== "cut";
    if (fadeIn && localT < dur) o *= localT / dur;
    if (cue.exit === "fade" && localT > life - dur) o *= Math.max(0, (life - localT) / dur);
    return o;
  }

  function update(idx, cue, t) {
    const localT = t - cue.s;

    // strobe: only visible during the ON slice of each period
    // (strobeUntil: after that time the cue holds solid — the finale stops flashing and stays)
    if (cue.strobe && (cue.strobeUntil == null || t < cue.strobeUntil)) {
      const on = cue.strobe[0], off = cue.strobe[1];
      const ph = localT % (on + off);
      if (ph >= on) { if (mounted.has(idx)) unmount(idx); return; }
    }

    const el = mounted.get(idx) || mount(idx, cue);
    const life = cue.e - cue.s;
    const k = Math.min(1, Math.max(0, localT / life));

    // typewriter / swap steps
    if (cue.steps) {
      const si = stepIndex(cue, localT);
      if (el.dataset.step !== String(si)) {
        el.dataset.step = si;
        setText(el, cue, cue.steps[si]);
        if (cue.stepFonts && cue.stepFonts[si]) {
          const f = cue.stepFonts[si];        // [family, weight, style]
          el.style.fontFamily = f[0];
          el.style.fontWeight = f[1] || 400;
          el.style.fontStyle  = f[2] || "normal";
        }
        if (cue.fit) applyFit(el, cue); else clampWidth(el, cue);
      }
    }

    // font cycling (the typeface blast): [family, weight, style, track?, stretchX?]
    if (cue.fontCycle) {
      const step = Math.floor(localT / (cue.cycleDur || 0.1001)) % cue.fontCycle.length;
      if (el.dataset.cyc !== String(step)) {
        el.dataset.cyc = step;
        const f = cue.fontCycle[step];
        el.style.fontFamily = f[0];
        el.style.fontWeight = f[1] || 400;
        el.style.fontStyle  = f[2] || "normal";
        el.style.letterSpacing = (f[3] || cue.track || 0) + "em";
        el.dataset.cycStretch = f[4] || "";
        el.classList.toggle("is-outline", f[5] === "outline");
        delete el.dataset.natW; delete el.dataset.natH;
        if (cue.fit) applyFit(el, cue);
      }
    }

    el.style.opacity = envelope(cue, localT, life);
    if (cue.fit) applyFit(el, cue);

    let scale = 1;
    if (cue.grow) scale *= cue.grow[0] + (cue.grow[1] - cue.grow[0]) * k;

    const [ax, ay] = ANCHOR_XY[cue.anchor || "c"];
    const rot = cue.rot || 0;
    const cycSx = el.dataset.cycStretch ? parseFloat(el.dataset.cycStretch) : 1;
    const sx = (cue.stretch || 1) * cycSx * (cue.flip ? -1 : 1);   // flip = mirrored text
    const sy = cue.sy || 1;                 // vertical squash (downscale only — stays crisp)
    const stretch = (sx !== 1 || sy !== 1) ? " scale(" + sx + "," + sy + ")" : "";
    el.style.transform =
      "translate(" + ax + "%," + ay + "%)" +
      " rotate(" + rot + "deg)" +
      " scale(" + scale.toFixed(4) + ")" + stretch;
  }

  function unmount(idx) {
    const el = mounted.get(idx);
    if (el) {
      if (window.__game) __game.onUnmount(idx, el);
      el.remove(); mounted.delete(idx);
    }
  }

  /* ---------- iOS chrome stays white (whole video is white) ---------- */
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  let lastBcast = null;
  function broadcastBg(color) {
    if (color === lastBcast) return;
    lastBcast = color;
    if (themeMeta) themeMeta.setAttribute("content", color);
    if (window.parent !== window) {
      try { window.parent.postMessage({ iam: "bg", color: color }, "*"); } catch (e) {}
    }
  }

  /* ---------- render one timestamp ---------- */
  let lastT = 0;
  function renderAt(t) {
    lastT = t;
    stage.style.setProperty("--bg", "#fff");
    stage.style.setProperty("--fg", "#000");
    broadcastBg("#ffffff");
    for (let i = 0; i < CUES.length; i++) {
      const c = CUES[i];
      if (t >= c.s && t < c.e) update(i, c, t);
      else if (mounted.has(i)) unmount(i);
    }
    interactFrame(t);          // the last 30s: the letters get shy
    if (window.__game) __game.tick();
  }

  /* ---------- main loop ---------- */
  function frame() {
    if (!running) return;
    const t = clockOverride != null ? clockOverride : Math.max(0, audio.currentTime + syncOffset);
    renderAt(t);
    requestAnimationFrame(frame);
  }

  /* ---------- resize / font-ready remount ---------- */
  function remountAll() {
    mounted.forEach(function (el) { el.remove(); });
    mounted.clear();
    if (running) renderAt(lastT);
  }
  window.addEventListener("resize", remountAll);
  if (window.ResizeObserver) {
    let lastW = 0;
    new ResizeObserver(function () {
      if (running && stage.clientWidth && stage.clientWidth !== lastW) {
        lastW = stage.clientWidth;
        remountAll();
      }
    }).observe(stage);
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      mounted.forEach(function (el) { delete el.dataset.natW; delete el.dataset.natH; });
      if (running) renderAt(lastT);
    });
  }

  /* ---------- preload: every face + every dingbat image before the show ----------
     Web fonts otherwise load at the moment their 0.1s flash mounts — a blank
     flash on first play. Warm the whole deck; the arrow dims until ready. */
  const FONT_WARM = [
    '100 24px "helvetica-neue-lt-pro"', '200 24px "helvetica-neue-lt-pro"',
    '300 24px "helvetica-neue-lt-pro"', '400 24px "helvetica-neue-lt-pro"',
    '700 24px "helvetica-neue-lt-pro"',
    'italic 400 24px "helvetica-neue-lt-pro"', 'italic 700 24px "helvetica-neue-lt-pro"',
    '700 24px "helvetica-neue-lt-pro-cond"', '900 24px "helvetica-neue-lt-pro-cond"',
    '400 24px "Bodoni Moda"', '700 24px "Bodoni Moda"', '800 24px "Bodoni Moda"', '900 24px "Bodoni Moda"',
    'italic 600 24px "Bodoni Moda"', 'italic 700 24px "Bodoni Moda"',
    'italic 500 24px "Playfair Display"',
    // the other videos' faces — warmed so the click-to-scramble swap is instant
    '700 24px "clarendon-urw"', '700 24px "arial-rounded-mt-pro"', '400 24px "vag-rundschrift-d"',
    '400 24px "stencil-std"', '400 24px "rosewood-std-daphne"', '400 24px "cottonwood-std"',
    '400 24px "hwt-artz"', '400 24px "brush-script-std"', '400 24px "felt-tip-roman"',
    '700 24px "letter-gothic-std"', '400 24px "prestige-elite-std"', 'italic 400 24px "ltc-bodoni-175"',
    '400 24px "p22-marcel-script-pro"',
  ];
  const PRELOADED = new Map();
  let assetsReady = false;
  (function preload() {
    const srcs = new Set();
    for (const c of CUES) if (c.img) srcs.add(c.img);
    const jobs = [];
    srcs.forEach(function (s) {
      jobs.push(new Promise(function (res) {
        const im = new Image();
        PRELOADED.set(s, im);
        im.onload = function () { res(); if (im.decode) im.decode().catch(function () {}); };
        im.onerror = res;
        im.src = s;
      }));
    });
    if (document.fonts && document.fonts.load) {
      FONT_WARM.forEach(function (f) {
        jobs.push(document.fonts.load(f).catch(function () {}));
      });
    }
    let done = 0;
    const total = jobs.length;
    playBtn.classList.add("is-loading");
    const tick = function () {
      done++;
      playBtn.style.setProperty("--load", done / total);
    };
    jobs.forEach(function (p) { Promise.resolve(p).then(tick, tick); });
    // ready when everything lands, or after 8s regardless (never strand the play button)
    const finish = function () {
      if (assetsReady) return;
      assetsReady = true;
      playBtn.classList.remove("is-loading");
    };
    Promise.allSettled ? Promise.allSettled(jobs).then(finish) : Promise.all(jobs).then(finish, finish);
    setTimeout(finish, 8000);
  })();

  /* ---------- flow ---------- */
  let started = false;
  function start() {
    if (!assetsReady || started) return;
    started = true;
    landing.classList.add("is-gone");
    setTimeout(function () { landing.hidden = true; }, 500);
    stage.classList.add("is-live");
    stage.setAttribute("aria-hidden", "false");
    document.body.classList.add("playing");
    broadcastBg("#ffffff");
    running = true;
    if (window.__game) __game.start();
    audio.currentTime = 0;
    const p = audio.play();
    if (p && p.catch) p.catch(function (e) { console.warn("play blocked:", e); });
    requestAnimationFrame(frame);
  }
  /* ---------- the play button gets cold feet (on-theme: insecure) ---------- */
  const playSay = document.getElementById("playSay");
  const playAgain = document.getElementById("playAgain");
  let playState = 0;
  function advancePlay() {
    if (!assetsReady) return;
    if (playState === 0) {
      playState = 1;
      playBtn.classList.add("is-ask");                 // dodges right, hides the arrow
      playSay.textContent = "...are you sure?";
      landing.classList.add("is-asking");              // reveal the real arrow underneath
    } else if (playState === 1) {
      playState = 2;
      playBtn.classList.add("is-relent");
      playSay.textContent = "ok..but don't judge me";
      landing.classList.remove("is-asking");
      setTimeout(start, 1200);
    }
  }
  playBtn.addEventListener("click", advancePlay);
  playAgain.addEventListener("click", advancePlay);   // clicking the arrow underneath works too

  audio.addEventListener("ended", function () {
    running = false;
    stage.classList.remove("is-live");
    document.body.classList.remove("playing");
    if (window.__game) __game.onEnd();
    endcard.hidden = false;
    requestAnimationFrame(function () { endcard.classList.add("is-visible"); });
  });
  replayBtn.addEventListener("click", function () {
    endcard.classList.remove("is-visible");
    setTimeout(function () { endcard.hidden = true; }, 400);
    stage.classList.add("is-live");
    document.body.classList.add("playing");
    running = true;
    if (window.__game) __game.start();
    audio.load();                 // reliably rewinds to 0 even where seeking is blocked
    const p = audio.play();
    if (p && p.catch) p.catch(function () {});
    requestAnimationFrame(frame);
  });

  let toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("is-on");
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove("is-on"); }, 1100);
  }

  window.addEventListener("keydown", function (e) {
    const isSpace = e.code === "Space" || e.key === " ";
    const isEnter = e.key === "Enter";
    if (isSpace || isEnter) {
      if (!landing.classList.contains("is-gone")) { e.preventDefault(); advancePlay(); }
      else if (!endcard.hidden) { e.preventDefault(); replayBtn.click(); }
      else if (running && isSpace) { e.preventDefault(); if (audio.paused) audio.play(); else audio.pause(); }
    } else if (e.key === "[" || e.key === "]") {
      syncOffset += (e.key === "]" ? 0.01 : -0.01);
      localStorage.setItem("ins_sync", syncOffset.toFixed(3));
      toast("audio sync " + (syncOffset >= 0 ? "+" : "") + syncOffset.toFixed(2) + "s");
    }
  });

  /* ============================================================
     PER-LETTER INTERACTION (whole video)
     As the cursor nears a letter it shrinks toward invisible, then
     grows back as you pull away — the word never reflows (each glyph
     sits in a fixed-width slot). Click a letter and it takes on a
     random typeface from the other four videos.
     Driven directly off pointer movement (not the rAF loop) so it's
     instant and works even where rAF is throttled.
     ============================================================ */
  const INTERACT_FROM = 0;                    // active the whole video
  const HIDE_R = 110;                          // px radius of the shrink field
  const CLICK_R = 140;                         // px you must be within to change a letter
  const OTHER_FONTS = [                        // faces from the other four lyric videos
    ['"clarendon-urw"', 700, "normal"],   ['"arial-rounded-mt-pro"', 700, "normal"],
    ['"vag-rundschrift-d"', 400, "normal"], ['"stencil-std"', 400, "normal"],
    ['"rosewood-std-daphne"', 400, "normal"], ['"cottonwood-std"', 400, "normal"],
    ['"hwt-artz"', 400, "normal"],        ['"brush-script-std"', 400, "normal"],
    ['"felt-tip-roman"', 400, "normal"],  ['"letter-gothic-std"', 700, "normal"],
    ['"prestige-elite-std"', 400, "normal"], ['"ltc-bodoni-175"', 400, "italic"],
    ['"p22-marcel-script-pro"', 400, "normal"], ['"Bodoni Moda"', 900, "normal"],
    ['Georgia', 700, "italic"],           ['"helvetica-neue-lt-pro-cond"', 900, "normal"],
  ];
  const imouse = { x: -1e4, y: -1e4, on: false };

  function ispanify(el) {
    if (el.dataset.ilet || el.querySelector("img")) return;
    const txt = el.textContent;
    el.textContent = "";
    for (const ch of txt) {
      if (ch === "\n") { el.appendChild(document.createTextNode("\n")); continue; }
      const s = document.createElement("span");
      s.className = "ilet";
      s.textContent = ch;
      el.appendChild(s);
    }
    // lock each slot to its natural width so a shrink/font-swap never reflows the word
    el.querySelectorAll(".ilet").forEach(function (s) {
      if (!s.textContent.trim()) { s.style.width = "0.32em"; return; }
      s.style.width = s.getBoundingClientRect().width + "px";
    });
    el.dataset.ilet = "1";
  }
  function eligible(cue) { return !(cue.img || cue.steps || cue.fontCycle || cue.fx); }
  // spanify every static cue AND shrink its letters by cursor proximity.
  // Self-contained so it's correct whether called from the rAF loop or a pointer move.
  function applyShrink() {
    if (lastT < INTERACT_FROM) return;
    mounted.forEach(function (el, idx) {
      if (!eligible(CUES[idx])) return;
      ispanify(el);
      const letters = el.getElementsByClassName("ilet");
      for (let i = 0; i < letters.length; i++) {
        const s = letters[i];
        if (!s.textContent.trim()) continue;
        const r = s.getBoundingClientRect();
        if (!r.width) continue;
        const d = imouse.on ? Math.hypot(imouse.x - (r.left + r.width / 2), imouse.y - (r.top + r.height / 2)) : 1e9;
        const sc = d < HIDE_R ? (0.05 + 0.95 * (d / HIDE_R)) : 1;   // near → almost gone; far → full size
        s.style.transform = sc < 0.999 ? "scale(" + sc.toFixed(3) + ")" : "";
      }
    });
  }
  const interactFrame = function (t) { if (t >= INTERACT_FROM) applyShrink(); };
  window.addEventListener("pointermove", function (e) {
    imouse.x = e.clientX; imouse.y = e.clientY; imouse.on = true;
    if (running) applyShrink();                 // instant, independent of the rAF loop
  });
  document.addEventListener("mouseleave", function () { imouse.on = false; if (running) applyShrink(); });

  // click a letter → a random typeface from the other four videos
  window.addEventListener("pointerdown", function (e) {
    if (!running || lastT < INTERACT_FROM) return;
    let best = null, bd = 1e9;
    const spans = cueLayer.getElementsByClassName("ilet");
    for (let i = 0; i < spans.length; i++) {
      const s = spans[i];
      if (!s.textContent.trim()) continue;
      const r = s.getBoundingClientRect();
      const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
      if (d < bd) { bd = d; best = s; }
    }
    if (best && bd < CLICK_R) {
      const f = OTHER_FONTS[(Math.random() * OTHER_FONTS.length) | 0];
      best.style.fontFamily = f[0];
      best.style.fontWeight = f[1];
      best.style.fontStyle = f[2];
      best.dataset.scrambled = "1";
    }
  });

  /* ---------- the game rides on the engine ---------- */
  if (window.__game) __game.init({
    stage: stage,
    cueLayer: cueLayer,
    mounted: function () { return mounted; },
    cues: function () { return CUES; },
    time: function () { return clockOverride != null ? clockOverride : audio.currentTime; },
  });

  /* ---------- debug hooks ---------- */
  window.__iam = window.__ins = {
    seek: function (t) { audio.currentTime = t; },
    startAt: function (t) { if (!running) start(); audio.currentTime = t || 0; },
    setOffset: function (v) { syncOffset = +v; localStorage.setItem("ins_sync", syncOffset.toFixed(3)); },
    get offset() { return syncOffset; },
    freeze: function (t) {
      clockOverride = t;
      landing.classList.add("is-gone"); landing.hidden = true;
      endcard.hidden = true;
      stage.classList.add("is-live"); stage.setAttribute("aria-hidden", "false");
      document.body.classList.add("playing");
      running = true;
      renderAt(t);
      requestAnimationFrame(frame);
    },
    unfreeze: function () { clockOverride = null; },
    get time() { return clockOverride != null ? clockOverride : audio.currentTime; },
    get ready() { return assetsReady; },
    get mounted() { return Array.from(mounted.values()).map((e) => e.textContent || (e.querySelector("img") || {}).src); },
  };
})();
