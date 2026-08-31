'use client'

import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/* ═══════════════════════════════════════════════════════════════════
   STORYTELLING SCROLLER — banners that dissolve into one another.

   A passage is a full-bleed block one viewport tall PER FRAME. Inside
   it a viewport-tall stage holds the frames stacked in the same box and
   stays put while the block travels, so the imagery is held in place
   long enough to actually change — and so anything laid over it (the
   AURA ESTATE wordmark, a film CTA) stays centred over the whole run
   rather than scrolling away with the first frame.

   The change is a cross-dissolve THROUGH BLACK, which is what the dark
   ground is for. Across each frame’s screen of scroll the outgoing
   frame falls away while the incoming one comes up, and the two cross
   at about a quarter each — so you never see a ghosted double exposure,
   you see one image sink into the dark and the next rise out of it.
   Both tweens run the full width of the slice, so there is no moment
   where the scroll is moving and the picture is not.

   prefers-reduced-motion: one viewport, first frame only, no motion.
═══════════════════════════════════════════════════════════════════ */

/** A single dissolve frame — one image, or one video with a poster. */
export type CrossfadeLayer = {
  video?: string
  image?: string
  poster?: string
  alt?: string
  caption?: string
  /** CSS object-position for the media, e.g. 'center 68%'. */
  objectPosition?: string
}

export type StoryPassage = {
  media: CrossfadeLayer[]
  /** One caption for the whole run. Falls back to the first frame's. */
  caption?: string
  /** Content centred over the run and held there for its whole length. */
  overlay?: ReactNode
}

export function StorytellingScroller({
  passages,
  sections,
}: {
  passages: StoryPassage[]
  /** Editorial panels. Length must be passages.length + 1. */
  sections: React.ReactNode[]
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const runEls = useRef<(HTMLDivElement | null)[]>([])
  const layerEls = useRef<(HTMLDivElement | null)[][]>([])
  const videoEls = useRef<(HTMLVideoElement | null)[][]>([])
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReduced(isReduced)
    if (isReduced) return

    gsap.registerPlugin(ScrollTrigger)
    // A collapsing mobile address bar changes 100dvh mid-scroll. Without
    // this, every such resize refreshes the triggers and jolts the dissolve.
    ScrollTrigger.config({ ignoreMobileResize: true })

    const ctx = gsap.context(() => {
      passages.forEach((p, pi) => {
        const run = runEls.current[pi]
        const layers = (layerEls.current[pi] || []).filter(Boolean) as HTMLDivElement[]
        if (!run || layers.length === 0) return

        gsap.set(layers, { autoAlpha: 0 })
        gsap.set(layers[0], { autoAlpha: 1 })

        // Only decode video while the run is anywhere near the viewport —
        // and only spend a trigger on runs that actually carry video.
        const vids = (videoEls.current[pi] || []).filter(Boolean) as HTMLVideoElement[]
        if (vids.length) {
          ScrollTrigger.create({
            trigger: run,
            start: 'top bottom+=25%',
            end: 'bottom top-=25%',
            onToggle: self =>
              vids.forEach(v => {
                if (self.isActive) v.play().catch(() => {})
                else v.pause()
              }),
          })
        }

        if (layers.length < 2) return

        // Scrub across exactly the span the stage is held for: from the
        // run's top meeting the top of the screen to its bottom meeting the
        // bottom. That span is (frames - 1) viewports, so each dissolve gets
        // one full screen of scroll.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: run,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,          // 1:1 with scroll — no lag, no settle
            invalidateOnRefresh: true,
          },
        })
        for (let k = 1; k < layers.length; k++) {
          // Both run the whole slice, crossing at ~0.25 each. power1.out on
          // the way down and power1.in on the way up is what puts the dip in
          // the middle: the pair never sums to a legible double image, and
          // the dark ground carries the moment between them.
          tl.to(layers[k - 1], { autoAlpha: 0, ease: 'power1.out', duration: 1 }, k - 1)
          tl.to(layers[k],     { autoAlpha: 1, ease: 'power1.in',  duration: 1 }, k - 1)
        }
      })
    }, rootRef)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={rootRef} className={`story2${reduced ? ' story2--reduced' : ''}`}>
      {sections.map((sec, si) => (
        <Fragment key={si}>
          <div className="story2__solid">{sec}</div>
          {si < passages.length && (() => {
            const p = passages[si]
            const caption = p.caption ?? p.media[0]?.caption ?? ''
            if (!layerEls.current[si]) layerEls.current[si] = []
            if (!videoEls.current[si]) videoEls.current[si] = []
            return (
              <div
                ref={el => { runEls.current[si] = el }}
                className="story2__run"
                /* One viewport of scroll per frame. */
                style={{ ['--story-h']: p.media.length } as React.CSSProperties}
              >
                <div className="story2__stage">
                  {p.media.map((m, k) => (
                    <div key={k} ref={el => { layerEls.current[si][k] = el }} className="story2__layer">
                      {m.video ? (
                        <video
                          ref={el => { videoEls.current[si][k] = el }}
                          muted loop playsInline preload="none"
                          poster={m.poster}
                          aria-label={m.alt}
                          style={m.objectPosition ? { objectPosition: m.objectPosition } : undefined}
                        >
                          <source src={m.video} type="video/mp4" />
                        </video>
                      ) : m.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.image} alt={m.alt ?? ''} loading="lazy" decoding="async"
                             style={m.objectPosition ? { objectPosition: m.objectPosition } : undefined} />
                      ) : null}
                    </div>
                  ))}
                  <div className="story2__scrim" aria-hidden />
                  {caption && <p className="label story2__cap">{caption}</p>}
                  {p.overlay && <div className="story2__overlay">{p.overlay}</div>}
                </div>
              </div>
            )
          })()}
        </Fragment>
      ))}

      <style jsx global>{`
        .story2 { position: relative; }
        .story2__solid { position: relative; background: var(--bg); }

        /* Full-bleed block, one viewport tall per frame — that is the run's
           scroll depth. Dark all the way through: this is what shows between
           two frames as one dissolves into the other.
           NB: no overflow here — clipping would break the sticky stage. */
        .story2__run {
          position: relative;
          width: 100vw;
          margin-left: calc(50% - 50vw);
          height: calc(var(--story-h, 1) * 100vh);
          height: calc(var(--story-h, 1) * 100dvh);
          background: #0a0a0a;
        }
        /* The frames and anything laid over them, held to the screen for the
           length of the run. */
        .story2__stage {
          position: sticky;
          top: 0;
          height: 100vh;
          height: 100dvh;
          overflow: hidden;
          background: #0a0a0a;
        }
        .story2__layer { position: absolute; inset: 0; }
        /* Pre-hydration the stack is opaque and the last frame would win.
           GSAP’s inline autoAlpha overrides this the moment it runs. */
        .story2__layer:not(:first-child) { opacity: 0; visibility: hidden; }
        .story2__layer :global(video),
        .story2__layer :global(img) {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }
        .story2__scrim {
          position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(180deg,
            rgba(10,10,10,0.28) 0%, rgba(10,10,10,0) 22%,
            rgba(10,10,10,0) 64%, rgba(10,10,10,0.5) 100%);
        }
        .story2__cap {
          position: absolute;
          left: var(--gutter); right: var(--gutter);
          bottom: clamp(20px, 4vh, 48px);
          margin: 0; max-width: min(88vw, 640px);
          text-align: left; color: #fff; letter-spacing: 1px;
          text-shadow: 0 1px 12px rgba(0,0,0,0.45);
        }
        .story2__overlay {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          pointer-events: none;
        }

        /* Reduced motion / no JS: one viewport, first frame only, no dissolve. */
        .story2--reduced .story2__run {
          height: 100vh;
          height: 100dvh;
        }
        .story2--reduced .story2__stage { position: relative; }
        .story2--reduced .story2__layer:not(:first-child) { display: none; }
      `}</style>
    </div>
  )
}
