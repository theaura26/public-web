'use client'

/* ═══════════════════════════════════════════════════════════════════
   JOURNAL KIT — the seven building blocks every journal is made from.
   Less is more. If a journal needs something not in this list, the
   journal is wrong, not the kit.

   1. <ArticleHero>      Title + TOC opener.
   2. <OneCol>           Centered single-column block (heading + prose).
   3. <TwoCol>           Heading left, body right.
   4. <PullQuote>        Centered grotesque display quote.
   5. <DataGrid>/<DataCard>  Responsive card grid.
   6. <Placeholder>      Inline 16:9 hero-banner image block.
   7. <Continue>         Auto-derived "next active journals" footer.

   Plus one display utility:
   · <ScrollHighlight>   Apple-style word-by-word reveal on scroll.

   And one inline glyph:
   · <Rta>               Renders "RTA" in DM Sans regardless of context.
═══════════════════════════════════════════════════════════════════ */

import Link from 'next/link'
import { ReactNode, useEffect, useRef, useState } from 'react'
import Reveal from '@/components/RevealOnScroll'
import { ExpandingBanner } from '@/components/ExpandingBanner'
import { ACTIVE_JOURNALS, nextActiveJournals, type Journal } from '@/lib/journals'

/* ── HeroBanner — display opener: a static, full-screen banner (100vw ×
      100vh, no scroll animation) with the page title overlaid as a single
      line, words justified edge-to-edge between the card rails.

      Drafting state renders a grey card with a small centred `type +
      caption` hint; once `src` is set, the card holds the photo or video
      with a 10% black tint overlay (legibility floor) and the caption
      pinned bottom-left. Title style is chosen *per image*: a hidden
      canvas samples the loaded image; if it's uniformly dark we use plain
      white text (reads cleanly against a low-key photo), otherwise we use
      `mix-blend-mode: difference` (inverts cleanly against varied or
      light scenes). Same logic drives the back link while it's over the
      banner; once past the banner the back switches to var(--text). */
export function HeroBanner({
  title,
  src,
  currentHref,
  mediaType = 'image',
  poster,
  caption,
  type,
  alt,
}: {
  /** Single-line title. Words spread edge-to-edge inside the banner. */
  title: string
  src?: string
  /** Auto-resolves `src` (and falls back to `alt`) from the matching
   *  entry in `lib/journals.ts`. Same prop the `<Continue>` footer uses.
   *  Pass it on every journal page so the hero, the slide-out menu tile,
   *  and the Continue card all share one image. */
  currentHref?: string
  mediaType?: 'image' | 'video'
  poster?: string
  /** Caption shown bottom-left on the banner (when `src` is set). */
  caption?: string
  /** Image-type suggestion for the banner's drafting state. */
  type?: string
  alt?: string
}) {
  // If src wasn't passed but currentHref was, derive it from the journal
  // index — the same thumbnail the navbar and Continue cards use.
  if (!src && currentHref) {
    const journal = ACTIVE_JOURNALS.find(j => j.href === currentHref)
    if (journal) src = journal.img
  }
  const words = title.split(/\s+/).filter(Boolean)
  const draftingHint = [type, caption].filter(Boolean).join(' · ')

  // Pinned banner with scroll-driven blur clear — same gesture as the
  // homepage HeroVideo. The outer wrapper is 200vh; the inner stage is
  // sticky 100vh. As the reader scrolls into the wrapper, the sticky
  // pins the banner in view; during the first 80vh of that scroll the
  // image's blur lifts and the 1.1× scale eases to 1. Once the wrapper
  // exits the sticky range, the banner scrolls away. Title parallaxes
  // upward at ~30% of scroll-into-wrap so it lingers above the image.
  const wrapRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement | null>(null)

  // Title is always rendered with mix-blend-difference — the white
  // ink inverts cleanly against any photo (dark text on light areas,
  // light text on dark areas). The 10% black tint sits between image
  // and title as a contrast floor for the mid-tone case.

  // The back arrow and caption use a different treatment: we sample
  // the image at each element's region (top-left for the back, bottom-
  // left for the caption) and pick pure white or pure black per
  // region so each piece reads cleanly without the colour shift that
  // difference would introduce. SSR default is white — overridden
  // after the image loads.
  const [bannerInk, setBannerInk] = useState<{ topLeft: string; bottomLeft: string }>(
    { topLeft: '#ffffff', bottomLeft: '#ffffff' },
  )
  useEffect(() => {
    if (!src || mediaType !== 'image') return
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const size = 64
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        if (!ctx) return
        ctx.drawImage(img, 0, 0, size, size)
        const { data } = ctx.getImageData(0, 0, size, size)
        // Sample a 16×16 patch in the top-left (back link sits there)
        // and the bottom-left (caption sits there). Account for the
        // 10% black tint overlay by darkening the sample by 0.9.
        const sample = (x0: number, y0: number, w: number, h: number) => {
          let sum = 0
          for (let y = y0; y < y0 + h; y++) {
            for (let x = x0; x < x0 + w; x++) {
              const i = (y * size + x) * 4
              sum += (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255
            }
          }
          return (sum / (w * h)) * 0.9
        }
        const topL = sample(0, 6, 20, 8)        // ~y 9-22%  / x 0-31%
        const botL = sample(0, 50, 32, 12)      // ~y 78-97% / x 0-50%
        // Threshold ~0.5: brighter than that → use black ink, else white.
        setBannerInk({
          topLeft: topL > 0.5 ? '#000000' : '#ffffff',
          bottomLeft: botL > 0.5 ? '#000000' : '#ffffff',
        })
      } catch {
        // CORS or other — leave defaults.
      }
    }
    img.src = src
  }, [src, mediaType])
  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    const tick = () => {
      raf = 0
      const wrap = wrapRef.current
      const t = titleRef.current
      const m = mediaRef.current
      if (!wrap) return
      const rect = wrap.getBoundingClientRect()
      const vh = window.innerHeight
      const scrollIntoWrap = Math.max(0, -rect.top)
      // Blur clears across the first 80vh of scroll-into-wrap. Smootherstep.
      const animDist = vh * 0.8
      const raw = Math.max(0, Math.min(1, scrollIntoWrap / animDist))
      const p = reduced
        ? (raw > 0.05 ? 1 : 0)
        : raw * raw * raw * (raw * (raw * 6 - 15) + 10)

      if (m) {
        // Clear → blur on scroll. At first paint the image is sharp;
        // as the reader scrolls into the sticky stage the blur grows
        // and the image pulls back (1.1× scale) — a departure reveal
        // rather than an arrival reveal.
        const BLUR_MAX = 20
        m.style.filter = `blur(${p * BLUR_MAX}px)`
        m.style.transform = `scale(${1 + 0.1 * p})`
      }
      if (t) {
        // Title parallax — title is vertically centred and drifts UP
        // at ~30% of scroll-into-wrap so it rises out of frame as the
        // image blurs behind it.
        t.style.transform = reduced
          ? 'translate3d(0, 0, 0)'
          : `translate3d(0, ${-scrollIntoWrap * 0.3}px, 0)`
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
  }, [])

  // Back arrow is anchored to the top of the hero — same viewport-Y
  // position on every journal regardless of hero variant. White ink
  // with mix-blend-difference inverts the colour cleanly against any
  // image (dark text on light photos, light text on dark photos).
  const backLink = (
    <Link
      href="/"
      aria-label="Back"
      style={{
        position: 'absolute',
        top: 'calc(var(--nav-h, 56px) + var(--space-5))',
        left: 'var(--gutter)',
        zIndex: 5,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        color: '#ffffff',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        fontWeight: 400,
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        textDecoration: 'none',
        mixBlendMode: 'difference',
      }}
    >
      <span aria-hidden style={{ fontSize: 14, lineHeight: 1 }}>←</span>
      <span>Back</span>
    </Link>
  )
  return (
    <div
      ref={wrapRef}
      style={{
        position: 'relative',
        width: '100vw',
        marginLeft: 'calc(50% - 50vw)',
        // 200vh wrapper holds the sticky stage in view for ~100vh of
        // scroll past first paint, giving the blur clear room to play
        // before the banner releases and the next section enters.
        height: '200vh',
      }}
    >
      {backLink}
      <section
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100vh',
          background: src ? 'var(--bg)' : '#d6d6d6',
          overflow: 'hidden',
        }}
      >
      {src && mediaType === 'video' && (
        <video
          ref={mediaRef as React.RefObject<HTMLVideoElement>}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          poster={poster}
          aria-label={alt ?? title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            // Initial blur + scale so the first paint matches the entry
            // state. JS animates to clear on scroll.
            filter: 'blur(0px)',
            transform: 'scale(1)',
            willChange: 'filter, transform',
          }}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
      {src && mediaType === 'image' && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={mediaRef as React.RefObject<HTMLImageElement>}
          src={src}
          alt={alt ?? title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            filter: 'blur(0px)',
            transform: 'scale(1)',
            willChange: 'filter, transform',
          }}
        />
      )}

      {/* 10% black tint — legibility floor over every banner image. Sits
          above the photo, below the title/caption. */}
      {src && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.1)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}

      {/* Drafting hint — small mono label under the title while `src` is empty. */}
      {!src && draftingHint && (
        <div
          style={{
            position: 'absolute',
            left: 'clamp(20px, 4vw, 48px)',
            bottom: 'clamp(20px, 4vh, 48px)',
            color: '#5a5a5a',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          <div className="label" style={{ opacity: 0.9 }}>{draftingHint}</div>
        </div>
      )}

      {/* Caption pinned bottom-left, on top of the photo. Ink colour
          picks white or black based on the bottom-left luminance of
          the image, so it stays legible on any banner. */}
      {caption && src && (
        <p
          className="label"
          style={{
            position: 'absolute',
            left: 'clamp(20px, 4vw, 48px)',
            bottom: 'clamp(20px, 4vh, 48px)',
            margin: 0,
            maxWidth: 'min(320px, 60vw)',
            color: bannerInk.bottomLeft,
            letterSpacing: '1px',
            lineHeight: 1.5,
            zIndex: 2,
            transition: 'color var(--dur-fast) var(--ease)',
          }}
        >
          {caption}
        </p>
      )}

      {/* Title overlay — vertically centred white text in mix-blend-
          difference so the colour inverts against whatever sits behind
          it. Parallax drifts the title upward at 30% of scroll-into-
          wrap so it lingers in view as the reader scrolls. */}
      <div
        ref={titleRef}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(20px, 4vw, 48px)',
          mixBlendMode: 'difference',
          color: '#ffffff',
          pointerEvents: 'none',
          zIndex: 3,
          willChange: 'transform',
        }}
      >
        <h1 className="hero-banner-title">
          {words.map((word, i) => (
            <span key={i}>{word}</span>
          ))}
        </h1>
        <style jsx>{`
          /* Mobile/tablet: one word per line, centred stack. */
          .hero-banner-title {
            margin: 0;
            font-family: var(--font-grotesque);
            font-weight: 600;
            font-size: clamp(48px, 10vw, 128px);
            line-height: 0.95;
            letter-spacing: -0.04em;
            text-transform: uppercase;
            color: inherit;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            white-space: nowrap;
          }
          /* Desktop: single row. Multi-word titles spread edge-to-edge
             across the section rail; single-word titles stay centred. */
          @media (min-width: 1024px) {
            .hero-banner-title {
              flex-direction: row;
              justify-content: ${words.length > 1 ? 'space-between' : 'center'};
            }
          }
        `}</style>
      </div>
      </section>
    </div>
  )
}

/* ── JournalHero — stacked editorial opener for journal pages.
      Title sits above the image on a clean white plate (no overlay,
      no mix-blend), words justified edge-to-edge across the content
      rail. A small "← BACK" link sits in its own row above the title.
      Banner image (or video) renders full-bleed below the title. */
export function JournalHero({
  title,
  src,
  currentHref,
  mediaType = 'image',
  poster,
  caption,
  alt,
  backHref = '/',
}: {
  title: string
  src?: string
  /** Auto-resolves `src` (and falls back to `alt`) from the matching
   *  entry in `lib/journals.ts`. Same prop the `<Continue>` footer uses. */
  currentHref?: string
  mediaType?: 'image' | 'video'
  poster?: string
  /** Optional caption shown bottom-left on the banner image. */
  caption?: string
  alt?: string
  /** Where the back link goes. Defaults to /. */
  backHref?: string
}) {
  if (!src && currentHref) {
    const journal = ACTIVE_JOURNALS.find(j => j.href === currentHref)
    if (journal) src = journal.img
  }
  const words = title.split(/\s+/).filter(Boolean)

  // Scroll-driven blur on the banner — clear at first paint, blurs
  // and scales up to 1.1× as the reader scrolls past the hero. Same
  // departure-reveal gesture HeroBanner uses, just driven by the
  // .journal-hero header's bounding rect instead of a sticky wrap.
  const headerRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement | null>(null)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    const tick = () => {
      raf = 0
      const header = headerRef.current
      const m = mediaRef.current
      if (!header || !m) return
      const rect = header.getBoundingClientRect()
      const vh = window.innerHeight
      // Animation runs across the first 80vh of scroll into the hero.
      const scrollIntoHeader = Math.max(0, -rect.top)
      const animDist = vh * 0.8
      const raw = Math.max(0, Math.min(1, scrollIntoHeader / animDist))
      const p = reduced
        ? (raw > 0.05 ? 1 : 0)
        : raw * raw * raw * (raw * (raw * 6 - 15) + 10)
      const BLUR_MAX = 20
      m.style.filter = `blur(${p * BLUR_MAX}px)`
      m.style.transform = `scale(${1 + 0.1 * p})`
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
  }, [])

  return (
    <header ref={headerRef} className="journal-hero">
      <Link
        href={backHref}
        aria-label="Back"
        style={{
          position: 'absolute',
          top: 'calc(var(--nav-h, 56px) + var(--space-5))',
          left: 'var(--gutter)',
          zIndex: 5,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          color: '#ffffff',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          fontWeight: 400,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          textDecoration: 'none',
          mixBlendMode: 'difference',
        }}
      >
        <span aria-hidden style={{ fontSize: 14, lineHeight: 1 }}>←</span>
        <span>Back</span>
      </Link>

      <div className="journal-hero__top">
        <h1 className="journal-hero__title">
          {words.map((w, i) => (
            <span key={i}>{w}</span>
          ))}
        </h1>
      </div>

      {src && (
        <div className="journal-hero__media">
          {mediaType === 'video' ? (
            <video
              ref={mediaRef as React.RefObject<HTMLVideoElement>}
              className="journal-hero__media-el"
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
              poster={poster}
              aria-label={alt ?? title}
              style={{ filter: 'blur(0px)', transform: 'scale(1)', willChange: 'filter, transform' }}
            >
              <source src={src} type="video/mp4" />
            </video>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={mediaRef as React.RefObject<HTMLImageElement>}
              className="journal-hero__media-el"
              src={src}
              alt={alt ?? title}
              style={{ filter: 'blur(0px)', transform: 'scale(1)', willChange: 'filter, transform' }}
            />
          )}
          {caption && (
            <p className="label journal-hero__caption">{caption}</p>
          )}
        </div>
      )}

      {/* Image sizing: styled-jsx's :global(img) selector inside a
          @media rule wasn't applying scoped correctly, so we use a
          global style block targeting the explicit
          .journal-hero__media-el class instead. */}
      <style jsx global>{`
        .journal-hero__media-el {
          width: 100%;
          height: auto;
          display: block;
        }
        @media (max-width: 768px) {
          .journal-hero__media-el {
            height: 100vh;
            object-fit: cover;
          }
        }
      `}</style>

      <style jsx>{`
        .journal-hero {
          position: relative;
          padding-top: var(--nav-h, 56px);
        }
        .journal-hero__top {
          padding-top: clamp(var(--space-8), 10vh, calc(var(--space-9) + var(--space-7)));
          padding-bottom: var(--space-5);
          padding-left: var(--gutter);
          padding-right: var(--gutter);
        }
        .journal-hero__title {
          margin: 0;
          font-family: var(--font-grotesque);
          font-weight: 600;
          font-size: clamp(48px, 9vw, 140px);
          line-height: 0.95;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          color: var(--text);
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          white-space: nowrap;
        }
        /* Desktop: title section fills the full viewport so the title
           centres at exactly 50vh — same vertical landing zone as
           the overlaid title on HeroBanner journals. Image renders
           at its natural full proportion below, pulled up 300px so
           the top of the image overlaps the lower half of the title
           plate. Words spread edge-to-edge across the gutter rail. */
        @media (min-width: 1024px) {
          .journal-hero {
            padding-top: 0;
          }
          .journal-hero__top {
            min-height: 100vh;
            padding-top: 0;
            padding-bottom: 0;
            display: flex;
            align-items: center;
          }
          .journal-hero__title {
            flex-direction: row;
            justify-content: ${words.length > 1 ? 'space-between' : 'flex-start'};
            align-items: center;
            text-align: left;
          }
          .journal-hero__media {
            margin-top: -300px;
          }
        }
        .journal-hero__media {
          position: relative;
          width: 100vw;
          margin-left: calc(50% - 50vw);
          /* Clip the scroll-driven blur so its 20px halo doesn't bleed
             onto the surrounding white plate. overflow:hidden alone
             isn't enough in Chrome (filter creates its own stacking
             context that can paint past the box); contain:paint locks
             the paint region to the element's box. */
          overflow: hidden;
          contain: paint;
        }
        .journal-hero__caption {
          position: absolute;
          left: clamp(20px, 4vw, 48px);
          bottom: clamp(20px, 4vh, 48px);
          margin: 0;
          max-width: min(320px, 60vw);
          color: #ffffff;
          letter-spacing: 1px;
          text-shadow: 0 1px 12px rgba(0, 0, 0, 0.4);
        }
      `}</style>
    </header>
  )
}

/* ── ArticleHero — opener with optional 2-col TOC ── */
export function ArticleHero({
  title,
  subline,
  toc,
  media,
  caption,
}: {
  title: ReactNode
  subline?: ReactNode
  toc?: { q: string; href: string }[]
  media?: { type: 'image' | 'video'; src: string; poster?: string; alt?: string }
  caption?: string
}) {
  const hasRight = toc?.length || subline
  return (
    <section style={{ paddingTop: 'clamp(160px, 22vh, 260px)', paddingBottom: 'var(--space-9)' }}>
      <div className="section-w">
        {hasRight ? (
          <div className="grid grid-cols-1 md:grid-cols-2 grid-2col" style={{ gap: 'var(--grid-gap)', alignItems: 'start' }}>
            <Reveal>
              <h1 style={{ maxWidth: 700, marginTop: 0 }}>{title}</h1>
            </Reveal>
            <Reveal delay={80}>
              <div style={{ maxWidth: 520 }}>
                {subline && (
                  <p className="p2" style={{ marginTop: 0, marginBottom: toc?.length ? 32 : 8 }}>{subline}</p>
                )}
                {toc?.length ? (
                  <nav aria-label="Contents" className="article-toc">
                    {toc.map((item) => (
                      <a key={item.href} href={item.href} className="article-toc__item">
                        <span>{item.q}</span>
                        <span className="article-toc__arrow" aria-hidden>↓</span>
                      </a>
                    ))}
                    <style jsx>{`
                      .article-toc {
                        display: flex;
                        flex-direction: column;
                        gap: 14px;
                        max-width: 520px;
                        margin-bottom: 8px;
                      }
                      .article-toc__item {
                        display: flex;
                        justify-content: space-between;
                        align-items: baseline;
                        gap: 16px;
                        padding: 14px 0;
                        border-top: 1px solid var(--border);
                        font-family: var(--font-mono);
                        font-size: 12px;
                        font-weight: 400;
                        letter-spacing: 1px;
                        text-transform: uppercase;
                        color: var(--brand-accent);
                        text-decoration: none;
                        line-height: 1.5;
                        transition: opacity var(--dur-fast) var(--ease);
                      }
                      .article-toc__item:last-child {
                        border-bottom: 1px solid var(--border);
                      }
                      .article-toc__item:hover { opacity: 0.7; }
                      .article-toc__arrow { flex-shrink: 0; font-family: var(--font-mono); }
                    `}</style>
                  </nav>
                ) : null}
              </div>
            </Reveal>
          </div>
        ) : (
          <Reveal>
            <h1 style={{ maxWidth: 900 }}>{title}</h1>
          </Reveal>
        )}
        {media && (
          <Reveal delay={120}>
            <figure style={{ marginTop: 'clamp(48px, 8vh, 96px)' }}>
              <div style={{ borderRadius: 'var(--radius-1)', overflow: 'hidden', aspectRatio: '16 / 9' }}>
                {media.type === 'video' ? (
                  <video
                    src={media.src}
                    poster={media.poster}
                    muted
                    loop
                    playsInline
                    autoPlay
                    preload="metadata"
                    aria-label={media.alt || ''}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={media.src} alt={media.alt || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                )}
              </div>
              {caption && <figcaption className="label" style={{ marginTop: 12 }}>{caption}</figcaption>}
            </figure>
          </Reveal>
        )}
      </div>
    </section>
  )
}

/* ── OneCol — single left-aligned column with a required heading.
      Sits at the left rail of `.section-w` with a 760px max-width. Every
      OneCol must declare what it is — orphan prose without a heading is
      what TwoCol or ScrollHighlight are for, depending on the intent. */
export function OneCol({
  id,
  heading,
  children,
}: {
  id?: string
  heading: ReactNode
  children: ReactNode
}) {
  return (
    <section id={id} style={{ padding: 'var(--section-gap) 0' }}>
      <div className="section-w">
        <Reveal>
          <div style={{ maxWidth: 760, textAlign: 'left' }}>
            <h2 style={{ marginTop: 0, marginBottom: 'var(--space-6)' }}>{heading}</h2>
            <div className="article-body">{children}</div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ── TwoCol — heading left, body right ── */
export function TwoCol({
  id,
  heading,
  children,
}: {
  id?: string
  heading: ReactNode
  children: ReactNode
}) {
  return (
    <section id={id} style={{ padding: 'var(--section-gap) 0' }}>
      <div className="section-w">
        <div className="grid grid-cols-1 md:grid-cols-2 grid-2col" style={{ gap: 'var(--grid-gap)', alignItems: 'start' }}>
          <Reveal>
            <h2 style={{ maxWidth: 560, marginTop: 0 }}>{heading}</h2>
          </Reveal>
          <Reveal delay={80}>
            <div className="article-body" style={{ marginTop: '-0.2em' }}>{children}</div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ── Rta — renders "RTA" in DM Sans regardless of surrounding font ── */
export function Rta() {
  return (
    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, letterSpacing: '0.04em' }}>
      RTA
    </span>
  )
}

/* ── Term — inline glossary marker for jargon (Sln.9, BD 500, Solera, etc.).
      Underdotted in body text; on hover a small mono-uppercase tooltip
      lifts above the term with a 1-line definition. The `title` attribute
      keeps the explanation accessible without JS (and on touch devices). */
export function Term({ tip, children }: { tip: string; children: ReactNode }) {
  // Tap-to-open on touch: clicking the term toggles a data-open
  // attribute that CSS uses to show the tip. Tapping anywhere else
  // (or the term again) closes it. Hover and focus still work for
  // pointer / keyboard users via the sibling :hover/:focus rules.
  //
  // Only one tip is open at a time across the whole page — opening a
  // term broadcasts an 'aura-term:open' CustomEvent that all other
  // terms listen for and close themselves on.
  //
  // On mobile the tip pops out of the term's positioning context and
  // becomes position:fixed so it can centre on the viewport (CSS sets
  // left:50%, transform:translateX(-50%); here we set the top from
  // the term's bounding rect at open time so the pill still sits
  // above the term rather than mid-screen).
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const tipRef = useRef<HTMLSpanElement>(null)
  const id = useRef(Symbol())
  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onOtherOpen = (e: Event) => {
      if ((e as CustomEvent).detail !== id.current) setOpen(false)
    }
    // Position the fixed-mode tip above the term. CSS only switches to
    // fixed at <=768px; on desktop the inline top is ignored because
    // the rule keeps position:absolute.
    const term = ref.current
    const tipEl = tipRef.current
    if (term && tipEl) {
      const r = term.getBoundingClientRect()
      const h = tipEl.offsetHeight || 64
      tipEl.style.top = `${Math.max(8, r.top - h - 8)}px`
    }
    document.addEventListener('click', onDoc)
    document.addEventListener('touchstart', onDoc, { passive: true })
    document.addEventListener('aura-term:open', onOtherOpen)
    return () => {
      document.removeEventListener('click', onDoc)
      document.removeEventListener('touchstart', onDoc)
      document.removeEventListener('aura-term:open', onOtherOpen)
    }
  }, [open])
  return (
    <span
      ref={ref}
      className="aura-term"
      data-tip
      data-open={open || undefined}
      title={tip}
      tabIndex={0}
      role="button"
      aria-label={tip}
      onClick={e => {
        e.stopPropagation()
        setOpen(o => {
          const next = !o
          if (next) document.dispatchEvent(new CustomEvent('aura-term:open', { detail: id.current }))
          return next
        })
      }}
    >
      {children}
      <span ref={tipRef} className="aura-term__tip" aria-hidden>{tip}</span>
    </span>
  )
}

/* ── Placeholder — the kit's image moment.
      Thin wrapper around <ExpandingBanner>, the same scroll-driven
      blur → clarity → hold component the homepage uses for its hero
      video moments. Renders an image (default), a video, or — when
      `src` is empty — a grey drafting card with a centred type +
      caption label, all sharing the same expanding gesture. */
export function Placeholder({
  src,
  alt,
  type,
  caption,
  mediaType = 'image',
  poster,
}: {
  src?: string
  alt?: string
  /** Suggestion to the photo editor: "Landscape", "Portrait",
   *  "Aerial", "Detail", etc. Shown in the centered drafting label. */
  type?: string
  /** Caption text. Renders as a small label in the bottom-left of the
   *  image when `src` is set. */
  caption?: string
  /** Defaults to `image`. Pass `video` for an autoplaying loop. */
  mediaType?: 'image' | 'video'
  /** Video poster (or fallback still). */
  poster?: string
}) {
  return (
    <ExpandingBanner
      src={src}
      mediaType={mediaType}
      poster={poster}
      alt={alt}
      caption={caption}
      type={type}
    />
  )
}

/* ── DataGrid / DataCard — responsive cards for stats, filters, tiles.
      With `img` on a DataCard the card becomes a hero-style tile: 16:9
      thumbnail on top, then the value (as a heading), then body. Without
      `img` it stays a thin stat card (top rule, value, body).

      `standalone` wraps the grid in its own section + section-w so the
      tiles span the full content width. Without it, DataGrid is inline
      content meant to sit inside a TwoCol body. */
export function DataGrid({
  cols = 3,
  standalone = false,
  children,
}: {
  cols?: 2 | 3 | 4
  standalone?: boolean
  children: ReactNode
}) {
  const grid = (
    <div
      className="data-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap: 'clamp(24px, 3vw, 48px)',
        marginTop: standalone ? 0 : 'clamp(24px, 4vh, 40px)',
      }}
    >
      {children}
      <style jsx>{`
        @media (max-width: 768px) {
          .data-grid {
            grid-template-columns: 1fr !important;
            /* Stacked tiles on mobile need real breathing room — match
               the homepage .pillar-grid rhythm. */
            gap: 56px !important;
          }
        }
      `}</style>
    </div>
  )
  if (!standalone) return grid
  return (
    <section style={{ padding: 'var(--section-gap) 0' }}>
      <div className="section-w">
        <Reveal>{grid}</Reveal>
      </div>
    </section>
  )
}

export function DataCard({
  value,
  children,
  img,
  alt,
  type,
}: {
  label?: string
  value?: ReactNode
  children?: ReactNode
  /** When set (or when `type` is provided), the card renders as a
   *  homepage-hero-style tile: 16:9 thumbnail above the heading and body. */
  img?: string
  alt?: string
  /** Image-type suggestion shown in the grey placeholder when `img` is
   *  empty — e.g. "Portrait", "Detail", "Landscape". Setting `type`
   *  alone (without `img`) also promotes the card to tile mode. */
  type?: string
}) {
  const isTile = !!img || !!type
  if (isTile) {
    const placeholderLabel = [type, typeof value === 'string' ? value : undefined].filter(Boolean).join(' · ')
    return (
      <div>
        <div
          style={{
            position: 'relative',
            width: '100%',
            /* Portrait 4:5 — matches the homepage pillar grid so journal
               tiles share the same proportions as the home hero. */
            aspectRatio: '4 / 5',
            background: '#d6d6d6',
            borderRadius: 'var(--radius-1)',
            overflow: 'hidden',
            marginBottom: 20,
          }}
        >
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={img}
              alt={alt ?? (typeof value === 'string' ? value : '')}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : placeholderLabel ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
                textAlign: 'center',
                color: '#5a5a5a',
              }}
            >
              <div className="label" style={{ opacity: 0.9 }}>{placeholderLabel}</div>
            </div>
          ) : null}
        </div>
        {value && <h3 style={{ margin: 0, marginBottom: 12 }}>{value}</h3>}
        {children && <div className="p2" style={{ color: 'var(--text-body)' }}>{children}</div>}
      </div>
    )
  }
  return (
    <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
      {value && <p className="p1" style={{ margin: 0, marginBottom: 12 }}>{value}</p>}
      {children && <div className="p2" style={{ color: 'var(--text-body)' }}>{children}</div>}
    </div>
  )
}

/* ── PullQuote — centered grotesque display block.
      Bracketed top and bottom by full-viewport-width grey rules that
      ground the centered quote against the prose around it. The rules
      span 100vw (break out of any .section-w parent) so the quote feels
      like an editorial beat, not an inline paragraph. */
export function PullQuote({ children, attribution }: { children: ReactNode; attribution?: string }) {
  const rule = (
    <div
      aria-hidden
      style={{
        width: '100vw',
        marginLeft: 'calc(50% - 50vw)',
        height: 1,
        // Theme-aware so PullQuote rules match every other border in the
        // kit (TOC, DataCard top-rule, Continue divider, etc.).
        background: 'var(--border)',
      }}
    />
  )
  return (
    <>
      {rule}
      <section style={{ padding: 'var(--section-gap) 0' }}>
        <div className="section-w">
          <Reveal>
            <blockquote style={{ margin: '0 auto', maxWidth: 880, textAlign: 'center' }}>
              <p
                style={{
                  fontFamily: 'var(--font-pullquote)',
                  fontSize: 'clamp(32px, 4.2vw, 56px)',
                  lineHeight: 1.25,
                  letterSpacing: '0',
                  color: 'var(--text)',
                  margin: 0,
                  textWrap: 'balance',
                }}
              >
                {children}
              </p>
              {attribution && (
                <cite className="label" style={{ fontStyle: 'normal', marginTop: 32, display: 'block' }}>
                  — {attribution}
                </cite>
              )}
            </blockquote>
          </Reveal>
        </div>
      </section>
      {rule}
    </>
  )
}

/* ── ScrollHighlight — Apple-style word-by-word reveal on scroll ──
      Each word starts at 18% opacity and brightens as it enters the
      upper ~40vh band of the viewport. Pass a string; newlines split
      into separate lines so wrapping is predictable. */
export function ScrollHighlight({
  children,
  as: As = 'h2',
  maxWidth = 760,
  align = 'left',
}: {
  children: string
  as?: 'h1' | 'h2' | 'h3'
  maxWidth?: number
  align?: 'left' | 'center'
}) {
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])
  const lines = children.split(/\n+/).map(line => line.trim()).filter(Boolean)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      wordRefs.current.forEach(s => { if (s) s.style.opacity = '1' })
      return
    }
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const vh = window.innerHeight
        const startY = vh * 0.78
        const endY = vh * 0.38
        wordRefs.current.forEach(span => {
          if (!span) return
          const y = span.getBoundingClientRect().top
          const p = Math.max(0, Math.min(1, (startY - y) / (startY - endY)))
          span.style.opacity = String(0.18 + p * 0.82)
        })
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [children])

  let wordIndex = -1
  return (
    <section style={{ padding: 'var(--section-gap) 0' }}>
      <div className="section-w">
        <As style={{
          margin: align === 'center' ? '0 auto' : 0,
          maxWidth,
          textAlign: align,
        }}>
          {lines.map((line, lineIdx) => {
            const words = line.split(/\s+/).filter(Boolean)
            const isLast = lineIdx === lines.length - 1
            return (
              <span
                key={lineIdx}
                style={{ display: 'block', marginBottom: isLast ? 0 : 'var(--space-6)' }}
              >
                {words.map((w, i) => {
                  wordIndex++
                  const idx = wordIndex
                  return (
                    <span key={i}>
                      <span
                        ref={el => { wordRefs.current[idx] = el }}
                        style={{
                          opacity: 0.18,
                          transition: 'opacity var(--dur-fast) var(--ease)',
                          willChange: 'opacity',
                        }}
                      >
                        {w}
                      </span>
                      {i < words.length - 1 ? ' ' : ''}
                    </span>
                  )
                })}
              </span>
            )
          })}
        </As>
      </div>
    </section>
  )
}

/* ── Continue — footer cards linking to the next active journals.
      Pass `currentHref` and the next 3 active journals are derived from
      lib/journals automatically. The legacy `items` prop is still
      accepted for explicit overrides. */
export function Continue({
  currentHref,
  count = 3,
  items,
}: {
  currentHref?: string
  count?: number
  items?: { href: string; label: string; description: string; img?: string }[]
}) {
  const resolved: { href: string; label: string; description: string; img?: string }[] =
    items ?? nextActiveJournals(currentHref, count).map(j => ({
      href: j.href,
      label: j.title,
      description: j.description,
      img: j.img,
    }))

  if (!resolved.length) return null

  return (
    <section style={{ padding: 'var(--section-gap) 0', borderTop: '1px solid var(--border)' }}>
      <div className="section-w">
        <Reveal>
          <div className="label" style={{ marginBottom: 40 }}>Continue reading</div>
          <div
            className="continue-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${resolved.length}, minmax(0, 1fr))`,
              gap: 'var(--grid-gap)',
            }}
          >
            {resolved.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className="continue-card"
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  color: 'var(--text)',
                  transition: 'transform var(--dur-base) var(--ease)',
                }}
              >
                <div className="continue-card__media" aria-hidden>
                  {item.img && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img className="continue-card__photo" src={item.img} alt="" />
                  )}
                  {/* Symbol overlay — same hover gesture as the navbar
                      journal tiles: image blurs, this glyph fades in. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="continue-card__symbol"
                    src={`/aura-symbol-${(i % 3) + 1}.png`}
                    alt=""
                    aria-hidden
                  />
                </div>
                <h3 style={{ margin: 0, marginBottom: 12 }}>{item.label}</h3>
                <div className="p2" style={{ color: 'var(--text-body)' }}>{item.description}</div>
              </Link>
            ))}
          </div>
          <style jsx>{`
            @media (max-width: 768px) {
              .continue-grid { grid-template-columns: 1fr !important; }
            }
            .continue-card:hover { transform: translateY(-2px); }
            :global(.continue-card__media) {
              position: relative;
              width: 100%;
              aspect-ratio: 16 / 9;
              background: #d6d6d6;
              border-radius: var(--radius-1);
              overflow: hidden;
              margin-bottom: 24px;
            }
            :global(.continue-card__photo) {
              position: absolute;
              inset: 0;
              width: 100%;
              height: 100%;
              object-fit: cover;
              display: block;
              transform: scale(1.04);
              transition: filter var(--dur-base) var(--ease);
              will-change: filter;
            }
            /* Symbol overlay — fades in centered on hover, identical
               gesture to the navbar journal tiles. */
            :global(.continue-card__symbol) {
              position: absolute;
              top: 50%;
              left: 50%;
              width: 35%;
              height: auto;
              transform: translate(-50%, -50%) scale(0.85);
              opacity: 0;
              pointer-events: none;
              z-index: 10;
              mix-blend-mode: difference;
              transition: opacity 0.32s var(--ease-out), transform 0.4s var(--ease-spring);
            }
            :global(.continue-card:hover .continue-card__photo) {
              filter: blur(14px);
            }
            :global(.continue-card:hover .continue-card__symbol) {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
          `}</style>
        </Reveal>
      </div>
    </section>
  )
}


export { ACTIVE_JOURNALS, nextActiveJournals }
export type { Journal }
