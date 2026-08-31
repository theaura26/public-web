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
  const [active, setActive] = useState(0)
  /* Which frames have been shown, oldest first. Every frame sits at full
     opacity and the stack is ordered by recency, so the only one that
     ever animates is the incoming top layer fading in over a solid one
     beneath.
     
     Holding a single `prev` was not enough: scrolling fast starts a new
     fade before the last has finished, so neither the incoming nor the
     outgoing frame is opaque and the scrim shows through — which is the
     flash. With the whole stack opaque there is nothing to show
     through. */
  const [seen, setSeen] = useState<number[]>([0])
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

  /* Recency, kept in an effect rather than inside the setActive updater.
     A setState nested in another setState's updater makes that updater
     impure, and Strict Mode runs it twice to check exactly that. */
  useEffect(() => {
    setSeen((o) => (o[o.length - 1] === active ? o : [...o.filter((x) => x !== active), active]))
  }, [active])

  useEffect(() => {
    if (!frames.length) return
    /* Every full-screen beat on the page, in document order. The scene
       in the middle of the viewport owns the backdrop. */
    const steps = [...document.querySelectorAll<HTMLElement>('.sc, .p')]
    if (!steps.length) return

    const io = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!top) return
        const i = steps.indexOf(top.target as HTMLElement)
        if (i < 0) return
        setStarted(true)
        /* The hand-written pairing where there is one, and an even
           spread otherwise. Cycling with modulo made a chapter with nine
           photographs and fourteen scenes show the first five again,
           which reads as a mistake rather than a rhythm. */
        const next =
          map && map[i] != null
            ? Math.min(frames.length - 1, map[i])
            : Math.min(frames.length - 1, Math.floor((i * frames.length) / steps.length))
        setActive(next)
      },
      { threshold: [0.35, 0.6] },
    )
    steps.forEach((s) => io.observe(s))

    /* One more observer on the last beat: once its bottom is above the
       viewport, the chapter has ended. */
    const last = steps[steps.length - 1]
    const tail = new IntersectionObserver(
      ([e]) => setPast(!e.isIntersecting && e.boundingClientRect.top < 0),
      { threshold: 0 },
    )
    tail.observe(last)

    return () => { io.disconnect(); tail.disconnect() }
  }, [frames])

  if (!frames.length) return null

  /* The stack as it must render *now*: everything shown so far, with the
     active frame on top. Derived rather than stored, so the z-order can
     never be a render behind the frame that is fading in. */
  const stack = [...seen.filter((x) => x !== active), active]

  return (
    <div className="cb" ref={wrap} aria-hidden
      data-past={past ? 'true' : undefined}
      data-started={started ? 'true' : undefined}
    >
      {frames.map((f, i) => (
        <div
          className="cb-frame"
          key={f.src + i}
          data-on={i === active ? 'true' : undefined}
          data-seen={stack.includes(i) ? 'true' : undefined}
          /* Recency is the z-order. Read off `stack`, which puts the
             active frame on top in the same render that starts its fade
             — `seen` is maintained by an effect and lands a commit later,
             so ordering by it animated the incoming frame while it was
             still buried, and the moment the z-index caught up the page
             cut to a half-transparent top layer. That is the flash. */
          style={{ zIndex: stack.indexOf(i) + 1 }}
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
      <div className="cb-scrim" />
      <div className="cb-tint" />

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
          /* Long enough to read as a dissolve rather than a cut, short
             enough that a fast scroll does not lag behind the words. */
          transition: opacity 900ms var(--ease-out, ease);
        }
        /* Anything already shown stays opaque underneath. Only the
           incoming frame animates, and it animates over a solid stack. */
        .cb-frame[data-seen] { opacity: 1; }
        .cb-frame[data-on] { animation: cb-in 900ms var(--ease-out, ease) both; }
        @keyframes cb-in { from { opacity: 0; } to { opacity: 1; } }
        /* Chapter over: everything fades and the ground beneath shows.
           The animation has to be cancelled, not just overridden — a
           filled animation holds its end value at animation priority,
           which outranks any declaration here, so the photograph would
           stay at full opacity under a scrim that had faded out. */
        .cb[data-past] .cb-frame { animation: none; opacity: 0; }
        .cb[data-past] .cb-scrim,
        .cb[data-past] .cb-tint { opacity: 0; }
        /* Nothing at all until the first scene is reached. */
        .cb:not([data-started]) { opacity: 0; }
        .cb { transition: opacity 500ms var(--ease-out, ease); }
        .cb-media {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        /* The words sit on this, so it carries the contrast rather than
           the type having to fight the photograph. */
        /* Above every frame. The frames are stacked by recency and a
           chapter has at most a dozen, so 50 clears them all — a number
           the frame stack cannot reach rather than one it happens to sit
           under today. */
        .cb-scrim, .cb-tint { z-index: 50; }
        .cb-scrim {
          position: absolute;
          inset: 0;
          transition: opacity 600ms var(--ease-out, ease);
          /* The only thing carrying contrast on these pages.
             The scenes set long paragraphs in white directly on the
             photograph, so the picture is dimmed hard and evenly rather
             than each block of text drawing a panel behind itself — a
             local wash reads as a box, which is worse than a dark
             picture. The photographs still read; they are ground. */
          /* 0.69 under a 0.25 tint, compositing to 0.77. The layers
             compound, so both numbers are solved for the figure rather
             than scaled — easing each by the same percentage lands short
             of it every time.

             The floor is set by the brightest frames — the canopy at
             noon and the wet mill in daylight — where white type and the
             accent eyebrows have the least to hold on to. */
          background: rgba(0, 0, 0, 0.69);
        }
        .cb-tint {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.25);
          transition: opacity 600ms var(--ease-out, ease);
        }

      `}</style>
    </div>
  )
}
