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
        setActive((cur) => {
          if (cur !== next) setSeen((o) => [...o.filter((x) => x !== next), next])
          return next
        })
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
          /* Recency is the z-order. Anything not yet shown stays at the
             bottom; the frame directly under the active one is whatever
             was showing last. */
          style={{ zIndex: i === active ? 40 : seen.indexOf(i) + 1 }}
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
        .cb-frame[data-on] { opacity: 1; z-index: 2; }
        /* Chapter over: everything fades and the ground beneath shows. */
        .cb[data-past] .cb-frame { opacity: 0; }
        .cb[data-past] .cb-scrim,
        .cb[data-past] .cb-tint { opacity: 0; }
        /* Nothing at all until the first scene is reached. */
        .cb:not([data-started]) { opacity: 0; }
        .cb { transition: opacity 500ms var(--ease-out, ease); }
        /* Held at full opacity below the incoming frame, and not
           transitioned — it is covered before it is ever removed. */
        .cb-frame[data-under] { opacity: 1; z-index: 1; transition: none; }
        .cb-media {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        /* The words sit on this, so it carries the contrast rather than
           the type having to fight the photograph. */
        /* Above the frames. The active frame is lifted to z-index 2 so it
           crossfades over the outgoing one — which also lifted it over
           the scrim, and every dimming change made no difference at all
           until this line existed. */
        .cb-scrim, .cb-tint { z-index: 3; }
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
          /* 0.50 under a 0.25 tint, compositing to 0.63. The layers
             compound, so both numbers are solved for the figure rather
             than scaled — easing each by the same percentage lands short
             of it every time.

             This is about as light as the ground goes while white type
             still holds on the bright frames: the canopy at noon and the
             wet mill in daylight are what set the floor. */
          background: rgba(0, 0, 0, 0.50);
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
