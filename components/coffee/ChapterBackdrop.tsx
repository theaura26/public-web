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
export function ChapterBackdrop({ frames }: { frames: Frame[] }) {
  const [active, setActive] = useState(0)
  /* The frame that was showing. It stays fully opaque beneath the
     incoming one until the fade finishes — cross-dissolving both at once
     dips through to the scrim, which reads as a flash between scenes. */
  const [prev, setPrev] = useState(0)
  /* Past the last scene the chapter is over. The crosslinks and the
     festival banner are their own ground, so the backdrop lets go
     rather than sitting a photograph behind them. */
  const [past, setPast] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)

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
        const next = i % frames.length
        setActive((cur) => {
          if (cur !== next) setPrev(cur)
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
    <div className="cb" ref={wrap} aria-hidden data-past={past ? 'true' : undefined}>
      {frames.map((f, i) => (
        <div
          className="cb-frame"
          key={f.src + i}
          data-on={i === active ? 'true' : undefined}
          data-under={i === prev && i !== active ? 'true' : undefined}
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
        .cb[data-past] .cb-scrim { opacity: 0; }
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
        .cb-scrim {
          position: absolute;
          inset: 0;
          transition: opacity 600ms var(--ease-out, ease);
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.62) 0%,
            rgba(0, 0, 0, 0.52) 45%,
            rgba(0, 0, 0, 0.72) 100%
          );
        }
        @media (prefers-reduced-motion: reduce) {
          .cb-frame { transition: none; }
        }
      `}</style>
    </div>
  )
}
