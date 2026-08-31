'use client'

import { useEffect, useRef, useState } from 'react'

/* A chapter's pictures, as one full-bleed run.
 *
 * The shape is the Patagonia company-history one: a heading, then a
 * horizontal band of full-width frames. Nothing is printed under them —
 * the pictures carry the chapter and the prose below says the rest. A
 * stack of banners would make a reader scroll past ten pictures to
 * reach the next sentence; a band lets them take the set at their own
 * pace, or skip it in one movement.
 *
 * Scroll-snap does the work, so it functions with no JavaScript at all —
 * the observer only keeps the counter honest. Arrow keys and the buttons
 * move it; the track is focusable and labelled.
 */

export type Frame = {
  /** Still, or the poster when `video` is set. */
  src: string
  /** Optional MP4. `src` is its fallback — shown before it can play, on
   *  reduced motion, and if it never loads at all. */
  video?: string
  /** Describes the frame for somebody who cannot see it. Not a caption —
   *  nothing is printed under the band. */
  alt?: string
}

export function Gallery({ frames, label }: { frames: Frame[]; label: string }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const slides = [...track.querySelectorAll<HTMLElement>('.gl-slide')]
    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (seen) setActive(slides.indexOf(seen.target as HTMLElement))
      },
      { root: track, threshold: [0.5, 0.75, 1] },
    )
    slides.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [frames])

  const go = (n: number) => {
    const track = trackRef.current
    if (!track) return
    const slide = track.querySelectorAll<HTMLElement>('.gl-slide')[n]
    if (slide) track.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' })
  }

  return (
    <section className="gl" aria-label={label}>
      <div
        className="gl-track"
        ref={trackRef}
        tabIndex={0}
        role="group"
        aria-label={`${label} — ${frames.length} images`}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') { e.preventDefault(); go(Math.min(active + 1, frames.length - 1)) }
          if (e.key === 'ArrowLeft') { e.preventDefault(); go(Math.max(active - 1, 0)) }
        }}
      >
        {frames.map((f, i) => (
          <figure className="gl-slide" key={f.src + i}>
            {f.video ? (
              <video
                className="gl-media"
                poster={f.src}
                muted
                loop
                playsInline
                preload="none"
                aria-label={f.alt || ''}
              >
                <source src={f.video} type="video/mp4" />
              </video>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                className="gl-media"
                src={f.src}
                alt={f.alt || ''}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            )}
          </figure>
        ))}
      </div>

      <div className="gl-bar section-w">
        <div className="gl-nav">
          <button type="button" onClick={() => go(Math.max(active - 1, 0))} disabled={active === 0} aria-label="Previous image">←</button>
          <span className="gl-count label" aria-live="polite">{active + 1} / {frames.length}</span>
          <button type="button" onClick={() => go(Math.min(active + 1, frames.length - 1))} disabled={active === frames.length - 1} aria-label="Next image">→</button>
        </div>
      </div>

      <style jsx>{`
        .gl { display: flex; flex-direction: column; gap: var(--space-5); }

        /* Full bleed out of the page rail. */
        .gl-track {
          width: 100vw;
          margin-left: calc(50% - 50vw);
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .gl-track::-webkit-scrollbar { display: none; }
        .gl-track:focus-visible { outline: 2px solid var(--brand-accent); outline-offset: -2px; }

        .gl-slide {
          flex: 0 0 100vw;
          margin: 0;
          scroll-snap-align: start;
          aspect-ratio: 16 / 9;
          background: var(--bg-card);
        }
        .gl-media { width: 100%; height: 100%; object-fit: cover; display: block; }

        /* Nothing under the band but the counter, so it sits at the
           right edge where the next frame comes from. */
        .gl-bar { display: flex; justify-content: flex-end; }
        .gl-nav { display: flex; align-items: center; gap: var(--space-4); flex: none; }
        .gl-nav button {
          background: none; border: 0; cursor: pointer; padding: 4px 6px;
          font-size: 16px; line-height: 1; color: var(--text);
        }
        .gl-nav button[disabled] { color: var(--text-dim); cursor: default; }
        .gl-nav button:focus-visible { outline: 2px solid var(--brand-accent); outline-offset: 2px; }
        .gl-count { color: var(--text-muted); font-variant-numeric: tabular-nums; }

        @media (prefers-reduced-motion: reduce) {
          .gl-track { scroll-behavior: auto; }
        }
      `}</style>
    </section>
  )
}
