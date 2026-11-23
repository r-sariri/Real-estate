import { useEffect, useRef, useState } from 'react';

/* ==========================================================================
   Scroll-scrubbed hero film
   --------------------------------------------------------------------------
   The visitor's scroll position — not a playback clock — owns the film. The
   video is never played: we only move `currentTime`, so the camera stops the
   instant the page stops.

   Encoding matters more than any of this code. `public/video/hero-*.mp4` are
   H.264 all-intra encodes (a keyframe on every frame, `-g 1`): random seeking
   then costs one frame decode instead of "decode from the previous keyframe",
   which is what makes scrubbing feel instant. If the film is ever replaced,
   re-encode it with:

     ffmpeg -i source.mp4 -an -vf "scale=1168:-2,format=yuv420p" \
       -c:v libx264 -preset slow -crf 23 -g 1 -keyint_min 1 \
       -sc_threshold 0 -profile:v high -movflags +faststart out.mp4

   Frequent keyframes, a moderate bitrate, no audio and `+faststart` (so the
   moov atom is up front and seeking works before the file finishes) are the
   properties that keep the scrub smooth. H.264 is chosen over VP9/WebM
   because it is hardware-decoded in every target browser — with an all-intra
   encode the extra bytes buy latency-free seeking, and software VP9 decode
   would give that back.
   ========================================================================== */

/** Share of the remaining distance closed per 60fps frame. High enough that
 *  the film feels welded to the scroll wheel, low enough to absorb trackpad
 *  jitter and fast direction changes. */
const SMOOTHING = 0.24;

/** Below this gap (seconds) the frame counts as settled and the loop stops,
 *  instead of chasing an asymptote forever. */
const SETTLE = 0.006;

/** Smallest change worth another seek. ~a third of a 24fps frame, so we never
 *  ask the decoder to re-present a frame it is already showing. */
const MIN_SEEK = 0.014;

/** The copy holds through the first beat of the scroll, then steps back. */
const FADE_START = 0.06;
const FADE_END = 0.46;

type ScrubHandle = {
  sectionRef: React.RefObject<HTMLElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  /** The film has decoded enough to be shown and scrubbed. */
  ready: boolean;
  /** The film could not be loaded — the caller should keep its still. */
  failed: boolean;
};

export function useScrollScrubVideo(enabled: boolean): ScrubHandle {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!enabled || !section || !video) return;

    let duration = 0;
    let sectionTop = 0;
    let runway = 1;

    let target = 0; // seconds the current scroll position asks for
    let shown = 0; // seconds we have actually moved the film to
    let applied = -1; // last value written to currentTime
    let fade = -1;
    let frame = 0;
    let lastTs = 0;

    const maxTime = () => (duration > 0 ? Math.max(0, duration - 0.02) : 0);

    const measure = () => {
      sectionTop = section.getBoundingClientRect().top + window.scrollY;
      runway = Math.max(1, section.offsetHeight - window.innerHeight);
    };

    /** How far the scroll runway is travelled, 0 → 1. */
    const readProgress = () => {
      const raw = (window.scrollY - sectionTop) / runway;
      return raw <= 0 ? 0 : raw >= 1 ? 1 : raw;
    };

    const seek = (time: number, force = false) => {
      if (!force && Math.abs(time - applied) < MIN_SEEK) return;
      applied = time;
      // fastSeek snaps to the nearest keyframe; with an all-intra encode that
      // is the exact frame, and it skips a lot of seek bookkeeping.
      const el = video as HTMLVideoElement & { fastSeek?: (t: number) => void };
      if (typeof el.fastSeek === 'function') {
        try {
          el.fastSeek(time);
          return;
        } catch {
          /* fall back to a precise seek */
        }
      }
      video.currentTime = time;
    };

    /** Write the copy fade as a CSS variable — no React state, no re-render. */
    const paintFade = (progress: number) => {
      const raw = progress <= FADE_START ? 0 : progress >= FADE_END ? 1 : (progress - FADE_START) / (FADE_END - FADE_START);
      const eased = raw * raw * (3 - 2 * raw);
      if (Math.abs(eased - fade) < 0.008) return;
      fade = eased;
      section.style.setProperty('--hero-fade', eased.toFixed(3));
    };

    const tick = (ts: number) => {
      frame = 0;
      const dt = lastTs ? Math.min(64, ts - lastTs) : 16.7;
      lastTs = ts;

      // Exponential smoothing normalised to the real frame interval, so the
      // feel is identical on 60Hz and 120Hz displays.
      const k = 1 - Math.pow(1 - SMOOTHING, dt / 16.7);
      shown += (target - shown) * k;
      if (Math.abs(target - shown) < SETTLE) shown = target;

      // Once settled, land on the exact frame the scroll position asks for —
      // the threshold above must not leave the opening or closing frame a
      // fraction short.
      seek(shown, shown === target);

      if (shown !== target) {
        frame = requestAnimationFrame(tick);
      } else {
        lastTs = 0; // settled: no work at all until the next scroll
      }
    };

    const wake = () => {
      if (frame) return;
      lastTs = 0;
      frame = requestAnimationFrame(tick);
    };

    /** The scroll handler only records intent; rAF owns the film. */
    const onScroll = () => {
      const progress = readProgress();
      paintFade(progress);
      target = progress * maxTime();
      wake();
    };

    const sync = () => {
      duration = Number.isFinite(video.duration) ? video.duration : 0;
      measure();
      const progress = readProgress();
      paintFade(progress);
      target = progress * maxTime();
      // Land on the frame this scroll position asks for instead of snapping
      // back to the opening frame if the visitor scrolled while it loaded.
      shown = target;
      applied = -1;
      seek(target);
    };

    const onProgress = () => {
      if (!duration || !video.buffered.length) return;
      const loaded = video.buffered.end(video.buffered.length - 1) / duration;
      section.style.setProperty('--hero-load', Math.min(1, loaded).toFixed(3));
    };

    const onReady = () => setReady(true);
    const onFail = () => setFailed(true);

    video.addEventListener('loadedmetadata', sync);
    video.addEventListener('loadeddata', sync);
    video.addEventListener('canplay', onReady);
    video.addEventListener('error', onFail);
    video.addEventListener('progress', onProgress);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // Already warm (cached / instant localhost): catch up without an event.
    if (video.readyState >= 1) sync();
    if (video.readyState >= 3) setReady(true);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      video.removeEventListener('loadedmetadata', sync);
      video.removeEventListener('loadeddata', sync);
      video.removeEventListener('canplay', onReady);
      video.removeEventListener('error', onFail);
      video.removeEventListener('progress', onProgress);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [enabled]);

  return { sectionRef, videoRef, ready, failed };
}
