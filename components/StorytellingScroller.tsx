'use client'

import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
/** A single crossfade media layer — one image, or one video with a poster. */
export type CrossfadeLayer = {
  video?: string
  image?: string
  poster?: string
  alt?: string
  caption?: string
  /** CSS object-position for the media, e.g. 'center 68%'. */
  objectPosition?: string
}

/* ═══════════════════════════════════════════════════════════════════
   STORYTELLING SCROLLER — Patagonia company-history model, done right.

   ONE sticky full-screen backdrop holds every image/video for the whole
   page, absolutely stacked. It sticks at the top of the page and NEVER
   unsticks until the very bottom — so it never lurches back into motion,
   which is the thing that made the old per-block version snap.

   The page reads as a rhythm: solid → image → solid → image.
     · `sections`  — the editorial blocks. Each one is an OPAQUE panel
       (page background) that scrolls up over the backdrop and hides it.
     · `passages`  — transparent gaps placed between the sections. Each
       gap is a window onto the sticky backdrop; as it travels the
       viewport it scrubs the backdrop's crossfade through that passage's
       own images, with its own captions and its own scroll depth.

   Because the images that pass behind a solid panel are never seen, each
   gap simply reveals the next stretch of imagery — image fades, to a
   solid, to a different image fading. No pin, no release, no snap.

   `perVh` on a passage = vh of scroll allotted to EACH image in it
   (bigger = slower, deeper). Reduced-motion falls back to the images
   stacked inline in each gap, no sticky, no motion.
═══════════════════════════════════════════════════════════════════ */

export type StoryPassage = {
  media: CrossfadeLayer[]
  /** vh of scroll per image in this passage (bigger = slower). */
  perVh?: number
  /** One caption for the whole block. Falls back to the first image's caption. */
  caption?: string
  /** Optional content pinned sticky-centred over this passage's gap — e.g. a
   *  wordmark, or a <FilmPlay> "watch the film" control. Click-through except
   *  where the overlay itself opts back in (pointer-events). */
  overlay?: ReactNode
}

export function StorytellingScroller({
  passages,
  sections,
}: {
  passages: StoryPassage[]
  /** Editorial panels. Length must be passages.length + 1 (solids around gaps). */
  sections: React.ReactNode[]
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const layerEls = useRef<(HTMLDivElement | null)[]>([])
  const videoEls = useRef<(HTMLVideoElement | null)[]>([])
  const gapEls = useRef<(HTMLDivElement | null)[]>([])
  const overlayEls = useRef<(HTMLDivElement | null)[]>([])
  const capEl = useRef<HTMLParagraphElement | null>(null)
  const [reduced, setReduced] = useState(false)

  // Flatten every passage's media into one stacked backdrop, and remember
  // where each passage's run begins in that flat list.
  const flat: CrossfadeLayer[] = []
  const starts: number[] = []
  passages.forEach((p) => {
    starts.push(flat.length)
    p.media.forEach((m) => flat.push(m))
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReduced(isReduced)
    if (isReduced) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const layers = layerEls.current
      gsap.set(layers.filter(Boolean), { autoAlpha: 0 })
      // Open on the first passage's first frame so the first gap isn't black.
      if (layers[0]) gsap.set(layers[0], { autoAlpha: 1 })

      // Play only the videos of the passage currently on screen.
      const playPassage = (pi: number) => {
        videoEls.current.forEach((v, gi) => {
          if (!v) return
          const inThis = gi >= starts[pi] && gi < starts[pi] + passages[pi].media.length
          if (inThis) v.play().catch(() => {})
          else v.pause()
        })
      }

      passages.forEach((p, pi) => {
        const gap = gapEls.current[pi]
        if (!gap) return
        const base = starts[pi]
        const n = p.media.length
        // One caption for the whole block (falls back to the first frame's).
        const caption = p.caption ?? p.media[0]?.caption ?? ''

        // Snap the backdrop to THIS passage's opening frame the moment the
        // gap starts to enter, and clear the other passages so nothing from
        // an earlier stretch bleeds through.
        const activate = () => {
          layers.forEach((el, gi) => {
            if (!el) return
            gsap.set(el, { autoAlpha: gi === base ? 1 : 0 })
          })
          if (capEl.current) {
            capEl.current.textContent = caption
            gsap.set(capEl.current, { autoAlpha: caption ? 1 : 0 })
          }
          const ov = overlayEls.current[pi]
          if (ov) gsap.set(ov, { autoAlpha: 1 })
          playPassage(pi)
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: gap,
            start: 'top bottom', // gap begins to enter from the bottom
            end: 'bottom top', //   gap has fully left past the top
            scrub: true, //          1:1 with scroll — no lag, no drift, no snap
            invalidateOnRefresh: true,
            onEnter: activate,
            onEnterBack: activate,
          },
        })

        // Hold each banner still long enough to read it, THEN dissolve to the
        // next — hold, dissolve, hold, dissolve … so every image is clearly
        // seen before it gives way. A closing beat fades the caption and any
        // overlay out, leaving the last banner clean before the next panel.
        const HOLD = 1.3 // scroll spent holding a banner still
        const FADE = 1 //   scroll spent dissolving into the next
        tl.to({}, { duration: HOLD })
        for (let k = 1; k < n; k++) {
          tl.to(layers[base + k], { autoAlpha: 1, ease: 'none', duration: FADE })
          tl.to({}, { duration: HOLD })
        }
        const clean = [capEl.current, overlayEls.current[pi]].filter(Boolean)
        if (clean.length) tl.to(clean, { autoAlpha: 0, ease: 'none', duration: 0.6 })
        tl.to({}, { duration: 0.7 })
      })
    }, rootRef)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={rootRef} className={`story2${reduced ? ' story2--reduced' : ''}`}>
      {/* Sticky crossfading backdrop — one element for the entire page. */}
      <div className="story2__bg" aria-hidden>
        {flat.map((m, gi) => (
          <div key={gi} ref={(el) => { layerEls.current[gi] = el }} className="story2__layer">
            {m.video ? (
              <video
                ref={(el) => { videoEls.current[gi] = el }}
                muted
                loop
                playsInline
                preload="metadata"
                poster={m.poster}
                aria-label={m.alt}
                style={m.objectPosition ? { objectPosition: m.objectPosition } : undefined}
              >
                <source src={m.video} type="video/mp4" />
              </video>
            ) : m.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.image} alt="" loading="lazy" decoding="async" style={m.objectPosition ? { objectPosition: m.objectPosition } : undefined} />
            ) : null}
          </div>
        ))}
        <div className="story2__scrim" />
        <p ref={capEl} className="label story2__cap" />
      </div>

      {/* Editorial panels (opaque, cover the backdrop) interleaved with the
          transparent passage-gaps (reveal + drive the backdrop). */}
      <div className="story2__content">
        {sections.map((sec, si) => (
          <Fragment key={si}>
            <div className="story2__solid">{sec}</div>
            {si < passages.length && (
              <div
                ref={(el) => { gapEls.current[si] = el }}
                className="story2__gap"
                style={reduced ? undefined : { height: `${(passages[si].media.length + 1) * (passages[si].perVh ?? 130)}vh` }}
                aria-hidden={passages[si].overlay ? undefined : true}
              >
                {/* Sticky overlay pinned over the crossfade — wordmark, film CTA. */}
                {!reduced && passages[si].overlay && (
                  <div ref={(el) => { overlayEls.current[si] = el }} className="story2__overlay">{passages[si].overlay}</div>
                )}
                {/* Reduced-motion / no-JS: show the passage's frames inline. */}
                {reduced && passages[si].media.map((m, k) => (
                  <div key={k} className="story2__still">
                    {m.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.image} alt={m.alt ?? ''} loading="lazy" decoding="async" style={m.objectPosition ? { objectPosition: m.objectPosition } : undefined} />
                    ) : m.video ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.poster} alt={m.alt ?? ''} loading="lazy" decoding="async" style={m.objectPosition ? { objectPosition: m.objectPosition } : undefined} />
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </Fragment>
        ))}
      </div>

      <style jsx global>{`
        .story2 {
          position: relative;
          background: #0a0a0a;
        }
        .story2__bg {
          position: sticky;
          top: 0;
          height: 100vh;
          height: 100dvh;
          width: 100vw;
          margin-left: calc(50% - 50vw);
          overflow: hidden;
          z-index: 0;
        }
        .story2__layer {
          position: absolute;
          inset: 0;
        }
        .story2__layer :global(video),
        .story2__layer :global(img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        /* Gentle top + bottom scrim so captions stay legible on any frame. */
        .story2__scrim {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            180deg,
            rgba(10, 10, 10, 0.28) 0%,
            rgba(10, 10, 10, 0) 22%,
            rgba(10, 10, 10, 0) 64%,
            rgba(10, 10, 10, 0.5) 100%
          );
        }
        .story2__cap {
          position: absolute;
          left: var(--gutter);
          right: var(--gutter);
          bottom: clamp(20px, 4vh, 48px);
          margin: 0;
          max-width: min(88vw, 640px);
          text-align: left;
          color: #fff;
          letter-spacing: 1px;
          text-shadow: 0 1px 12px rgba(0, 0, 0, 0.45);
          opacity: 0;
        }
        /* Content rides over the sticky backdrop. Solid panels are opaque and
           hide it; gaps are transparent and reveal it. */
        .story2__content {
          position: relative;
          z-index: 1;
          margin-top: -100vh;
          margin-top: -100dvh;
        }
        .story2__solid {
          position: relative;
          z-index: 1;
          background: var(--bg);
        }
        .story2__gap {
          position: relative;
          z-index: 1;
          /* transparent — the sticky backdrop shows through */
        }
        /* Overlay pinned over the passage's imagery for the length of the gap:
           centres its content (a wordmark) and lets absolutely-positioned
           children (a film CTA) sit at the viewport edges. */
        .story2__overlay {
          position: sticky;
          top: 0;
          height: 100vh;
          height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          z-index: 2;
        }

        /* Reduced motion / no JS: no sticky, no crossfade. Hide the backdrop
           and let each gap show its frames stacked in normal flow. */
        .story2--reduced .story2__bg {
          display: none;
        }
        .story2--reduced .story2__content {
          margin-top: 0;
        }
        .story2--reduced .story2__gap {
          height: auto;
        }
        .story2__still :global(img) {
          width: 100vw;
          margin-left: calc(50% - 50vw);
          aspect-ratio: 16 / 9;
          object-fit: cover;
          display: block;
        }
      `}</style>
    </div>
  )
}
