# insecure — live lyric video

A scene-for-scene DOM recreation of clay & kelsy's "Insecure" lyric video,
synced live to the song. Authored from a 104-element frame-exact segmentation
of the 4K master — every cue's start/end is the real appear/disappear frame.

The video is a quiet dialogue: Helvetica statements answered by Georgia and
Bodoni italics, a mirrored "now look at you", a flipped "wrong", the
WHAT WENT⟷WRONG collision, and the condensed-black KNOW/DO chant at the end.

Faces come from the same Adobe Fonts kit as you-hurt-me
(`use.typekit.net/moh2jyv.css`: Helvetica Neue LT Pro + Cond) plus
Bodoni Moda (Google) and Georgia.

## Files
- `index.html` — stage, landing, end card, font links. Bump `?v=N` after edits.
- `styles.css` — type roles, landing, end card.
- `app.js` — the engine (audio clock → renderAt; crisp px fit sizing; `flip`
  mirrored text; font preload gate). Debug: `__ins.freeze(t)`.
- `cues.js` — the 108-cue timeline. The source of truth.
- `assets/insecure.mp3` — the song (from the master's own audio).

Audit: all 104 source elements covered at midpoint; zero cues alive during
blank holds; mobile 375×812 zero overflows.
Preview: launch config `insecure-live`, port 8851.
