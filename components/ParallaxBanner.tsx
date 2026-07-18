'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/* ═══════════════════════════════════════════════════════════════════
   PARALLAX BANNER — full-bleed chapter divider.

   A single visual beat that breaks a long page into chapters. The
   background (image or video) sits in an over-sized layer and drifts
   on scroll — slow, scrubbed, secretlevel.co-style depth. A foreground
   layer floats over it: a glyph, the wordmark, a PNG, or one editorial
   word of typography. The foreground reveals once with a soft rise.

   Geometry: full viewport width, 16:9 on desktop, 4:5 on mobile (the
   "vertical" portrait crop). The media is `object-fit: cover` so it
   fills either ratio without letterboxing.

   Motion is GSAP + ScrollTrigger, scoped through gsap.context so every
   tween + trigger tears down cleanly on unmount. prefers-reduced-motion
   skips the parallax entirely and just shows the foreground.

   Overlay precedence: `title` (typography) → `overlaySrc` (png/svg) →
   `children` (anything). Pass exactly one.
═══════════════════════════════════════════════════════════════════ */

export type ParallaxBannerProps = {
  /** Background image src. Ignored if `video` is set. */
  image?: string
  /** Background video src (.mp4). Autoplays muted/looped when in view. */
  video?: string
  /** Poster for the video / fallback still. */
  poster?: string
  /** Alt text for the background layer. */
  alt?: string

  /** Foreground typography — one short editorial word/line, rendered in
   *  the display grotesque, centred, mix-blend-difference so it inverts
   *  cleanly against any footage. */
  title?: string
  /** Foreground PNG/SVG (glyph, wordmark). Centred. */
  overlaySrc?: string
  /** Alt for the overlay image. */
  overlayAlt?: string
  /** Rendered width of the overlay image (clamp string or px). */
  overlayWidth?: string
  /** Arbitrary foreground node — overrides title/overlaySrc. */
  children?: React.ReactNode

  /** Small mono caption pinned bottom-left. */
  caption?: string
  /** 0–1 black tint over the media for foreground legibility. Default 0.18. */
  tint?: number
  /** Blend the foreground with mix-blend-difference (default true for
   *  `title`, false for image overlays). */
  blend?: boolean

  /** Render an empty, on-brand media slot instead of real footage — a
   *  dashed drop-zone with a mono label, same full-bleed geometry. Use
   *  while the final image/video is still being sourced. `caption`
   *  becomes the slot label. */
  placeholder?: boolean
  /** Aspect ratio of the banner (a CSS aspect-ratio string, e.g. '16 / 9',
   *  '4 / 5', '1 / 1'). Applied on every breakpoint so the image keeps its
   *  natural shape instead of being cropped on mobile. Default 16 / 9 —
   *  set a taller ratio for a portrait image. */
  ratio?: string
  /** Caption alignment. Inline chapter banners pin the caption bottom-left
   *  (default). A top-of-page hero banner can pass 'center' to keep its
   *  caption centred. */
  captionAlign?: 'left' | 'center'
}

export function ParallaxBanner({
  image,
  video,
  poster,
  alt = '',
  title,
  overlaySrc,
  overlayAlt = '',
  overlayWidth = 'clamp(80px, 12vw, 160px)',
  children,
  caption,
  tint = 0.18,
  blend,
  placeholder = false,
  ratio = '16 / 9',
  captionAlign = 'left',
}: ParallaxBannerProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const fgRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  // Adaptive height — once the media loads, measure its true aspect and
  // size the banner to it so the FULL image shows (no forced 16:9 crop).
  // `ratio` is only the placeholder shape used until the media loads.
  const [naturalRatio, setNaturalRatio] = useState<string | null>(null)
  const pbRatio = naturalRatio ?? ratio

  // Autoplay the video only while it's near the viewport — same lazy
  // pattern the rest of the kit uses so off-screen banners don't burn
  // decode + battery.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause() },
      { threshold: 0.1 }
    )
    io.observe(v)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // The media fills the banner at its own aspect ratio (adaptive
      // height), so the full image is always visible — no scroll-driven
      // transform on it, which is what used to crop the frame.

      // Foreground reveal — one soft rise as the banner enters. Runs even
      // under reduced-motion (it's a fade, not motion sickness territory),
      // but with no travel when reduced.
      if (fgRef.current) {
        gsap.from(fgRef.current, {
          autoAlpha: 0,
          y: reduced ? 0 : 28,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top 78%',
            once: true,
          },
        })
      }
    }, wrapRef)

    return () => ctx.revert()
  }, [])

  const useBlend = blend ?? (!!title && !overlaySrc && !children)

  // Empty slot — same geometry, no media, no GSAP. A dashed drop-zone
  // with a mono label so the layout reads true while art is sourced.
  if (placeholder) {
    return (
      <div className="parallax-banner parallax-banner--ph" aria-roledescription="banner placeholder" style={{ ['--pb-ratio']: ratio } as React.CSSProperties}>
        <div className="parallax-banner__ph">
          <span className="parallax-banner__ph-label">{caption ?? 'Banner'}</span>
          <span className="parallax-banner__ph-meta">Media placeholder · 16 : 9</span>
        </div>
        <style jsx>{`
          .parallax-banner--ph {
            position: relative;
            width: 100vw;
            margin-left: calc(50% - 50vw);
            aspect-ratio: var(--pb-ratio, 16 / 9);
            overflow: hidden;
            background: #e8e5de;
          }
          .parallax-banner__ph {
            position: absolute;
            inset: clamp(14px, 2vw, 28px);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 10px;
            text-align: center;
            padding: var(--gutter);
            border: 1px dashed rgba(0, 0, 0, 0.22);
            background-image: repeating-linear-gradient(
              45deg,
              rgba(0, 0, 0, 0.022) 0 14px,
              transparent 14px 28px
            );
          }
          .parallax-banner__ph-label {
            font-family: var(--font-mono);
            font-size: clamp(12px, 1.4vw, 15px);
            letter-spacing: 2px;
            text-transform: uppercase;
            color: rgba(0, 0, 0, 0.58);
          }
          .parallax-banner__ph-meta {
            font-family: var(--font-mono);
            font-size: 11px;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: rgba(0, 0, 0, 0.32);
          }
        `}</style>
      </div>
    )
  }

  return (
    <div ref={wrapRef} className="parallax-banner" aria-roledescription="banner" style={{ ['--pb-ratio']: pbRatio } as React.CSSProperties}>
      {/* Media layer — fills the banner exactly at the image's own aspect. */}
      <div ref={mediaRef} className="parallax-banner__media">
        {video ? (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="metadata"
            poster={poster}
            aria-label={alt}
            onLoadedMetadata={(e) => {
              const v = e.currentTarget
              if (v.videoWidth && v.videoHeight) setNaturalRatio(`${v.videoWidth} / ${v.videoHeight}`)
            }}
          >
            <source src={video} type="video/mp4" />
          </video>
        ) : image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={alt}
            loading="lazy"
            decoding="async"
            onLoad={(e) => {
              const im = e.currentTarget
              if (im.naturalWidth && im.naturalHeight) setNaturalRatio(`${im.naturalWidth} / ${im.naturalHeight}`)
            }}
          />
        ) : null}
      </div>

      {tint > 0 && (
        <div
          aria-hidden
          className="parallax-banner__tint"
          style={{ background: `rgba(0,0,0,${tint})` }}
        />
      )}

      {/* Foreground layer — typography, image, or children. */}
      <div
        ref={fgRef}
        className="parallax-banner__fg"
        style={useBlend ? { mixBlendMode: 'difference', color: '#fff' } : { color: '#fff' }}
      >
        {children ? (
          children
        ) : title ? (
          <span className="parallax-banner__title">{title}</span>
        ) : overlaySrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={overlaySrc}
            alt={overlayAlt}
            style={{ width: overlayWidth, height: 'auto', display: 'block' }}
          />
        ) : null}
      </div>

      {caption && <p className="label parallax-banner__caption" data-align={captionAlign}>{caption}</p>}

      <style jsx>{`
        .parallax-banner {
          position: relative;
          width: 100vw;
          margin-left: calc(50% - 50vw);
          aspect-ratio: var(--pb-ratio, 16 / 9);
          overflow: hidden;
          background: #0a0a0a;
        }
        .parallax-banner__media {
          position: absolute;
          inset: 0;
          will-change: transform;
        }
        .parallax-banner__media :global(video),
        .parallax-banner__media :global(img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .parallax-banner__tint {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }
        .parallax-banner__fg {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 var(--gutter);
          pointer-events: none;
        }
        .parallax-banner__title {
          font-family: var(--font-grotesque);
          font-weight: 600;
          font-size: clamp(40px, 9vw, 140px);
          line-height: 0.95;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          text-align: center;
        }
        .parallax-banner__caption {
          position: absolute;
          left: var(--gutter);
          right: var(--gutter);
          bottom: clamp(20px, 4vh, 48px);
          margin: 0;
          z-index: 3;
          max-width: min(88vw, 640px);
          text-align: left;
          color: #fff;
          letter-spacing: 1px;
          text-shadow: 0 1px 12px rgba(0, 0, 0, 0.45);
        }
        /* Top-of-page hero banners keep the caption centred. */
        .parallax-banner__caption[data-align='center'] {
          left: 50%;
          right: auto;
          transform: translateX(-50%);
          text-align: center;
        }
      `}</style>
    </div>
  )
}
