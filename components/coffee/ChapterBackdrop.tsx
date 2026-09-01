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
  /* One piece of state, not two. The frame on top and the order the
     frames are stacked in are the same fact, and splitting them let the
     order land a render after the frame it describes — the incoming
     picture began its fade while still buried, and the page cut to a
     half-transparent layer when the z-index caught up. That was the
     flash. Updated together, in one pure updater. */
  const [view, setView] = useState<{ active: number; seen: number[] }>({ active: 0, seen: [0] })
  const { active, seen } = view
  /* Which frames have been shown, oldest first. Every frame sits at full
     opacity and the stack is ordered by recency, so the only one that
     ever animates is the incoming top layer fading in over a solid one
     beneath.
     
     Holding a single `prev` was not enough: scrolling fast starts a new
     fade before the last has finished, so neither the incoming nor the
     outgoing frame is opaque and the scrim shows through — which is the
     flash. With the whole stack opaque there is nothing to show
     through. */

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
        /* True once the first beat is reached, and false again above it:
           the hub opens on the white Remarkable Circle and the chapters on
           their own header, and a photograph belongs on neither. Latching
           this on meant the backdrop stayed lit over the opening once the
           reader had been down the page and come back. */
        setStarted(i > 0 || top.intersectionRatio > 0.6)
        /* The hand-written pairing where there is one, and an even
           spread otherwise. Cycling with modulo made a chapter with nine
           photographs and fourteen scenes show the first five again,
           which reads as a mistake rather than a rhythm. */
        const next =
          map && map[i] != null
            ? Math.min(frames.length - 1, map[i])
            : Math.min(frames.length - 1, Math.floor((i * frames.length) / steps.length))
        setView((v) =>
          v.active === next
            ? v
            : { active: next, seen: [...v.seen.filter((x) => x !== next), next] },
        )
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
          data-seen={seen.includes(i) ? 'true' : undefined}
          /* Recency is the z-order. Read off `stack`, which puts the
             active frame on top in the same render that starts its fade
             — `seen` is maintained by an effect and lands a commit later,
             so ordering by it animated the incoming frame while it was
             still buried, and the moment the z-index caught up the page
             cut to a half-transparent top layer. That is the flash. */
          style={{ zIndex: seen.indexOf(i) + 1, ['--dim' as string]: String(f.dim ?? 0.45) }}
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
          /* No transition. This is the flash.
             The fade-in is an animation now, and when a frame stops being
             the active one that animation is removed — its opacity should
             snap straight back to the 1 that [data-seen] gives it. A
             transition here made it *ramp* back instead, from wherever the
             animation had got to. So on a fast scroll the outgoing frame
             sat at 0.4 climbing to 1 while the incoming one climbed from
             0 on top of it, neither opaque, and the ground showed through
             both. */
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
        /* The one place a transition belongs: the chapter ending, where
           there is nothing arriving to cover the frame that leaves. */
        .cb[data-past] .cb-frame {
          animation: none;
          opacity: 0;
          transition: opacity 600ms var(--ease-out, ease);
        }
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
