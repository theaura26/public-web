/* Show a film once it has a frame — and cope with it already having one.
 *
 * The films on this site are faded up over a still rather than cut to,
 * which means they start hidden and something has to say when to show
 * them. Listening for `loadeddata` alone does not: a video served from
 * cache, or one that finishes loading before React attaches its handler,
 * has already fired the event by the time anyone is listening. It then
 * stays hidden for ever — loaded, playing, and invisible behind an
 * opacity of nought, which is exactly what happened to twenty-nine of
 * them.
 *
 * So: ask the element what state it is in first, and only wait if it is
 * genuinely not ready. Several events, because which one arrives depends
 * on how the video was preloaded, and a timeout underneath them all,
 * because a film that never loads must not leave a frame that never
 * shows.
 */
const READY_EVENTS = ['loadeddata', 'canplay', 'playing'] as const

/** Longer than a slow first frame, shorter than a reader's patience. */
const BAIL_MS = 3000

/**
 * A ref callback for a `<video>` that is hidden until `data-ready`.
 * Reveals immediately when the element already holds a frame.
 */
export function revealWhenReady(video: HTMLVideoElement | null): void {
  if (!video) return

  const show = () => { video.dataset.ready = 'true' }

  /* HAVE_CURRENT_DATA or better: there is a frame to show right now, and
     no event is coming to announce it. */
  if (video.readyState >= 2) { show(); return }

  for (const name of READY_EVENTS) video.addEventListener(name, show, { once: true })
  window.setTimeout(show, BAIL_MS)
}
