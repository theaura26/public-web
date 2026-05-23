'use client'

import { useEffect, useRef } from 'react'

/* ═══════════════════════════════════════════════════════════════════
   EXPANDING BANNER — scroll-driven blur → clarity reveal.

   The same component the homepage uses for its hero-video moments.
   Lives in a 180vh wrapper with a sticky 100vh stage:

     Phase 0 — BLUR    : the card enters as a centred frame with heavy blur
     Phase 1 — CLARITY : as scroll progresses, blur lifts and the card
                         grows to fill 100vw × 100vh
     Phase 2 — HOLD    : card stays full-screen and clear for a beat
     Phase 3 — SCROLL  : sticky releases, the next section enters

   Accepts either a video (`type="video"`, `src` is .mp4) or an image
   (`type="image"`, `src` is a still). With no `src` the card renders as
   a neutral grey drafting surface — same expanding gesture, with the
   `caption` (and optional image-type hint) centred as a placeholder
   label.
═══════════════════════════════════════════════════════════════════ */

export type ExpandingBannerProps = {
  /** Image or video src. Omit while drafting. */
  src?: string
  /** Media type. Defaults to `image`. Video uses a still poster for first paint. */
  mediaType?: 'image' | 'video'
  /** Video poster / image alt fallback. */
  poster?: string
  /** Alt text for accessibility. */
  alt?: string
  /** Caption rendered bottom-left over the banner once it's clear. */
  caption?: string
  /** Drafting suggestion shown in the centred grey card when `src` is
   *  empty — "Landscape", "Portrait", "Process shot", etc. */
  type?: string
  /** Optional overlay rendered centred on top of the banner card —
   *  used by <HeroBanner> to put the page title on the film. Painted
   *  with `mix-blend-mode: difference` so it inverts against whatever
   *  is behind it (grey drafting card or a real photo). */
  titleOverlay?: React.ReactNode
}

export function ExpandingBanner({ src, mediaType = 'image', poster, alt, caption, type, titleOverlay }: ExpandingBannerProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLVideoElement | HTMLImageElement | HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const matchMobile = window.matchMedia('(max-width: 768px)')

    const isMobileMatch = matchMobile.matches
    if (isMobileMatch) {
      const wrapEl = wrapRef.current
      const innerEl = innerRef.current
      const cardEl = cardRef.current
      const mediaEl = mediaRef.current
      if (!wrapEl || !innerEl || !cardEl) return

      innerEl.style.padding = '0'
      cardEl.style.aspectRatio = 'auto'
      cardEl.style.maxWidth = 'none'
      cardEl.style.width = '100vw'
      cardEl.style.height = '100vh'
      cardEl.style.transformOrigin = 'center'

      let raf = 0
      const tick = () => {
        raf = 0
        const wrap = wrapRef.current
        const card = cardRef.current
        const media = mediaRef.current
        if (!wrap || !card) return
        const rect = wrap.getBoundingClientRect()
        const vh = window.innerHeight
        const raw = Math.max(0, Math.min(1, (vh - rect.top) / vh))
        const p = raw * raw * raw * (raw * (raw * 6 - 15) + 10)
        card.style.transform = `scale(${0.7 + 0.3 * p})`
        if (media) {
          media.style.filter = `blur(${(1 - p) * 14}px)`
          media.style.transform = 'scale(1.04)'
        }
      }
      const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick) }
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onScroll, { passive: true })
      tick()
      return () => {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onScroll)
        if (raf) cancelAnimationFrame(raf)
      }
    }

    const ANIMATION_VH = 0.6
    const HOLD_VH = 0.2
    const BLUR_MAX = 18

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        const wrap = wrapRef.current
        const inner = innerRef.current
        const card = cardRef.current
        const media = mediaRef.current
        if (!wrap || !inner || !card) return

        const vw = window.innerWidth
        const vh = window.innerHeight
        const isMobile = matchMobile.matches

        const rect = wrap.getBoundingClientRect()
        const scrollIntoWrap = -rect.top
        const animationDist = ANIMATION_VH * vh
        const raw = Math.max(0, Math.min(1, scrollIntoWrap / animationDist))
        const p = prefersReduced
          ? (raw > 0.5 ? 1 : 0)
          : raw * raw * raw * (raw * (raw * 6 - 15) + 10)

        const initialNavPad = 56
        const initialSidePad = isMobile ? 20 : 48

        let initialW: number
        let initialH: number
        if (isMobile) {
          initialW = vw - 2 * initialSidePad
          initialH = (initialW * 4) / 3
        } else {
          const availH = vh - initialNavPad - 96
          const availW = vw - 2 * initialSidePad
          if ((availH * 16) / 9 <= availW) {
            initialH = availH
            initialW = (availH * 16) / 9
          } else {
            initialW = availW
            initialH = (availW * 9) / 16
          }
        }

        const cardW = initialW + (vw - initialW) * p
        const cardH = initialH + (vh - initialH) * p
        const navPad = initialNavPad * (1 - p)
        const sidePad = initialSidePad * (1 - p)

        inner.style.padding = `${navPad}px ${sidePad}px 0`
        card.style.aspectRatio = 'auto'
        card.style.maxWidth = 'none'
        card.style.width = `${cardW}px`
        card.style.height = `${cardH}px`

        if (media) {
          const blurVal = (1 - p) * BLUR_MAX
          media.style.filter = `blur(${blurVal}px)`
          media.style.transform = `scale(${1 + 0.04 * (1 - p)})`
        }
        void HOLD_VH
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Autoplay video when visible.
  useEffect(() => {
    if (mediaType !== 'video') return
    const video = mediaRef.current as HTMLVideoElement | null
    if (!video || !(video instanceof HTMLVideoElement)) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.1 }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [mediaType])

  const draftingLabel = [type, caption].filter(Boolean).join(' · ')

  return (
    <div ref={wrapRef} className="expanding-banner-wrap" style={{ position: 'relative', zIndex: 0 }}>
      <div
        ref={innerRef}
        className="expanding-banner-inner"
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '56px 48px 0',
          boxSizing: 'border-box',
        }}
      >
        <div
          ref={cardRef}
          className="expanding-banner-card"
          style={{
            width: '100%',
            maxWidth: 'calc((100vh - 56px - 96px) * 16 / 9)',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 3,
            background: src ? 'var(--bg)' : '#d6d6d6',
          }}
        >
          {src && mediaType === 'video' && (
            <video
              ref={mediaRef as React.RefObject<HTMLVideoElement>}
              muted
              loop
              playsInline
              preload="none"
              poster={poster}
              aria-label={alt}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transform: 'scale(1.04)',
                willChange: 'filter, transform',
              }}
            >
              <source src={src} type="video/mp4" />
            </video>
          )}
          {src && mediaType === 'image' && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              ref={mediaRef as React.RefObject<HTMLImageElement>}
              src={src}
              alt={alt ?? caption ?? ''}
              /* ExpandingBanner is always a body image, never above the fold —
                 lazy + async-decode lets the page paint first and the banner
                 stream in as the reader scrolls toward it. */
              loading="lazy"
              decoding="async"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transform: 'scale(1.04)',
                willChange: 'filter, transform',
              }}
            />
          )}
          {!src && draftingLabel && (
            <div
              ref={mediaRef as React.RefObject<HTMLDivElement>}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 24,
                textAlign: 'center',
                color: '#5a5a5a',
              }}
            >
              <div className="label" style={{ opacity: 0.9, maxWidth: 'min(80%, 720px)' }}>{draftingLabel}</div>
            </div>
          )}
          {/* Corner vignette — soft radial shadow anchored at bottom-left
              so the white caption stays legible over busy photography
              without dimming the rest of the image. Painted above the
              media (and any tint) but below the caption itself. */}
          {caption && src && (
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(ellipse 55% 45% at 0% 100%, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.35) 35%, rgba(0, 0, 0, 0) 75%)',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />
          )}
          {caption && src && (
            <p
              className="label"
              style={{
                position: 'absolute',
                left: 'clamp(20px, 4vw, 48px)',
                bottom: 'clamp(20px, 4vh, 48px)',
                margin: 0,
                maxWidth: 'min(220px, 60vw)',
                color: '#ffffff',
                letterSpacing: '1px',
                lineHeight: 1.5,
                zIndex: 2,
              }}
            >
              {caption}
            </p>
          )}
          {titleOverlay && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                /* `difference` blend self-inverts against whatever's behind:
                   dark text on the grey drafting card, light on a dark photo,
                   dark on a light photo. One overlay, every state. */
                mixBlendMode: 'difference',
                color: '#ffffff',
                pointerEvents: 'none',
                padding: 'clamp(20px, 4vw, 48px)',
                zIndex: 3,
              }}
            >
              {titleOverlay}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .expanding-banner-wrap {
          height: 180vh;
        }
        .expanding-banner-card {
          aspect-ratio: 16 / 9;
        }
        @media (max-width: 768px) {
          .expanding-banner-wrap {
            height: 100vh;
          }
          .expanding-banner-inner {
            position: static !important;
            height: 100vh !important;
            padding: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .expanding-banner-card {
            aspect-ratio: auto;
            width: 100% !important;
            height: 100% !important;
            max-width: none !important;
          }
        }
      `}</style>
    </div>
  )
}
