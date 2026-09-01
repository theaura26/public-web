'use client'

import { useEffect, useRef, useState } from 'react'
import type { Frame } from '@/lib/regenerative-coffee-gallery'

/* One backdrop for a whole chapter, crossfading as the reader scrolls.
 *
 * The microsite's scenes are full-screen beats of text. Giving each its
 * own background made the picture change by cutting — the old one leaves
 * with the scene that owned it. This is a single fixed layer behind all
 * of them instead: every frame stacked, one visible, and the change
 * happens as a dissolve while the text scrolls over it. The reader never
 * sees a picture arrive or leave, only the ground behind the words
 * becoming somewhere else.
 *
 * It also decouples the count. A chapter with eight photographs and
 * fourteen scenes cycles them rather than falling back to black, so no
 * scene is ever unlit.
 *
 * Fixed rather than scroll-linked: no rAF loop, no work per frame. The
 * observer fires once per scene boundary and sets an index.
 */
export function ChapterBackdrop({ frames, steps: map }: { frames: Frame[]; steps?: number[] }) {
  /* Where the reader is, as a beat index. Everything else — which frame
     is on top, which are stacked under it, and the order they sit in —
     is derived from this during render, so no two of those facts can
     ever be a render out of step with each other. */
  const [beat, setBeat] = useState(0)
  const [stepCount, setStepCount] = useState(0)

  /* Past the last scene the chapter is over. The crosslinks and the
     festival banner are their own ground, so the backdrop lets go
     rather than sitting a photograph behind them. */
  const [past, setPast] = useState(false)
  /* And held back at the start. The hub opens on the white Remarkable
     Circle header; a fixed photograph behind it from the first paint
     would cover the thing the page opens on. The pictures arrive with
     the first scene, which is after the fold. */
  const [started, setStarted] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)

  /* Marks the document so the microsite's own black grounds step aside
     for this chapter. Scoped rather than global: the Festival page has no
     backdrop, and making its sections transparent everywhere left white
     text on the white body. */
  useEffect(() => {
    document.documentElement.dataset.rcBackdrop = 'on'
    return () => { delete document.documentElement.dataset.rcBackdrop }
  }, [])

  useEffect(() => {
    if (!frames.length) return
    /* Every full-screen beat on the page, in document order. The scene
       in the middle of the viewport owns the backdrop. */
    const steps = [...document.querySelectorAll<HTMLElement>('.sc, .p')]
    if (!steps.length) return
    setStepCount(steps.length)

    const io = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!top) return
        const i = steps.indexOf(top.target as HTMLElement)
        if (i < 0) return

        /* The hand-written pairing where there is one, and an even
           spread otherwise. Cycling with modulo made a chapter with nine
           photographs and fourteen scenes show the first five again,
           which reads as a mistake rather than a rhythm. */
        setBeat(i)
      },
      { threshold: [0.35, 0.6] },
    )
    steps.forEach((s) => io.observe(s))

    /* One observer on the first beat, deciding whether the backdrop is
       lit at all. The hub opens on the white Remarkable Circle and the
       chapters on their own header, and a photograph belongs on neither —
       but the moment the first beat is on screen the ground has to be
       there, because the scenes are transparent and their type is white.
       Reading the ratio inside the main observer was wrong for exactly
       that reason: a half-visible panel turned the ground off underneath
       its own white heading. */
    const first = steps[0]
    const head = new IntersectionObserver(
      ([e]) => setStarted(e.isIntersecting || e.boundingClientRect.top < 0),
      { threshold: 0 },
    )
    head.observe(first)

    /* One more observer on the last beat: once its bottom is above the
       viewport, the chapter has ended. */
    const last = steps[steps.length - 1]
    const tail = new IntersectionObserver(
      ([e]) => setPast(!e.isIntersecting && e.boundingClientRect.top < 0),
      { threshold: 0 },
    )
    tail.observe(last)

    return () => { io.disconnect(); head.disconnect(); tail.disconnect() }
  }, [frames])

  if (!frames.length) return null

  /* Which frame a beat draws. */
  const frameAt = (i: number) =>
    map && map[i] != null
      ? Math.min(frames.length - 1, map[i])
      : Math.min(frames.length - 1, Math.floor((i * frames.length) / Math.max(1, stepCount)))

  /* Every frame the reader has reached, in the order they were reached,
     most recent last. Derived from the beat rather than accumulated, so
     scrolling back up takes frames off the stack again — which is what
     lets them fade out and reveal the one beneath instead of cutting. */
  const shown: number[] = []
  for (let i = 0; i <= beat; i++) {
    const f = frameAt(i)
    const at = shown.indexOf(f)
    if (at !== -1) shown.splice(at, 1)
    shown.push(f)
  }

  return (
    <div className="cb" ref={wrap} aria-hidden
      data-past={past ? 'true' : undefined}
      data-started={started ? 'true' : undefined}
    >
      {frames.map((f, i) => (
        <div
          className="cb-frame"
          key={f.src + i}
          data-shown={shown.includes(i) ? 'true' : undefined}
          /* Order of arrival is the z-order, and the frame the reader has
             just reached is always last in it — so it is on top in the
             same render that starts its fade. */
          style={{ zIndex: shown.indexOf(i) + 1, ['--dim' as string]: String(f.dim ?? 0.45) }}
        >
          {f.video ? (
            <video className="cb-media" poster={f.src} muted loop playsInline autoPlay preload="metadata">
              <source src={f.video} type="video/mp4" />
            </video>
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img className="cb-media" src={f.src} alt="" loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
          )}
        </div>
      ))}

      <style jsx>{`
        .cb {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        .cb-frame {
          position: absolute;
          inset: 0;
          opacity: 0;
          /* A transition, not an animation. An animation cannot be
             interrupted gracefully: when the reader scrolls on before a
             fade has finished, the incoming frame stops being the active
             one, its animation is removed, and its opacity jumps from
             wherever it had got to straight to full. Eight of those jumps
             in one fast scroll, 0.05 to 1.0 between two frames — a cut in
             the middle of a dissolve, which is the glitch.
             A transition interpolates from the value on screen, so an
             interrupted fade simply carries on from where it was. */
          transition: opacity 900ms var(--ease-out, ease);
        }
        /* Everything the reader has reached is opaque; the newest one
           fades up over a solid stack. Scrolling back up takes frames off
           the stack, so they fade back out and reveal the one beneath
           rather than cutting to it. */
        .cb-frame[data-shown] { opacity: 1; }
        /* Chapter over: everything fades and the ground beneath shows.
           The animation has to be cancelled, not just overridden — a
           filled animation holds its end value at animation priority,
           which outranks any declaration here, so the photograph would
           stay at full opacity under a scrim that had faded out. */
        /* The chapter ending fades the whole layer, not each frame
           inside it. Zeroing the frames meant that scrolling back up from
           the crosslinks left every one of them climbing from nothing at
           once, with the ground bare underneath — measured at 1% covered.
           Fading .cb leaves the stack intact behind it. */
        .cb[data-past] { opacity: 0; }
        /* Nothing at all until the first scene is reached. */
        .cb:not([data-started]) { opacity: 0; }
        .cb { transition: opacity 500ms var(--ease-out, ease); }
        .cb-media {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        /* The frame's own darkening, carried inside the frame so it
           crossfades with the picture it belongs to. A single scrim over
           all of them could not work: these photographs run from a mean
           luminance of 31 to 162, and one multiplier keeps that ratio, so
           the value that suited the cupping table left five frames at a
           brightness of 11 — a black screen with words on it. Each frame
           now gets only what it needs to bring its own highlights to the
           grey where white type clears AA. */
        .cb-frame::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, var(--dim, 0.45));
        }
        /* The words sit on this, so it carries the contrast rather than
           the type having to fight the photograph. */
        /* Above every frame. The frames are stacked by recency and a
           chapter has at most a dozen, so 50 clears them all — a number
           the frame stack cannot reach rather than one it happens to sit
           under today. */
      `}</style>
    </div>
  )
}
