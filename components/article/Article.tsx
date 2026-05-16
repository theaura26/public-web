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
import { ReactNode, useEffect, useRef } from 'react'
import Reveal from '@/components/RevealOnScroll'
import { ExpandingBanner } from '@/components/ExpandingBanner'
import { ACTIVE_JOURNALS, nextActiveJournals, type Journal } from '@/lib/journals'

/* ── HeroBanner — display opener: a static, full-screen banner (100vw ×
      100vh, no scroll animation) with the page title overlaid as a single
      line, words justified edge-to-edge between the card rails.

      Drafting state renders a grey card with a small centred `type +
      caption` hint; once `src` is set, the card holds the photo or video
      with the caption pinned bottom-left. Title legibility comes from
      `mix-blend-mode: difference` so the same overlay inverts cleanly
      against grey drafts, dark photos, and light photos. */
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
        const BLUR_MAX = 20
        m.style.filter = `blur(${(1 - p) * BLUR_MAX}px)`
        m.style.transform = `scale(${1 + 0.1 * (1 - p)})`
      }
      if (t) {
        // Title parallax — title is bottom-anchored above the caption.
        // As the reader scrolls into the sticky stage, the title drifts
        // UPWARD at ~30% of scroll-into-wrap, opening more air above
        // the caption rather than ever moving toward it.
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

  // Fixed back arrow — anchored to the top-left of the viewport, aligned
  // with the navbar's vertical centre. `mix-blend-mode: difference` keeps
  // it legible against the hero banner AND any prose surface as the
  // reader scrolls past it.
  const backLink = (
    <Link
      href="/"
      aria-label="Back to home"
      style={{
        position: 'fixed',
        top: 80,
        left: 'var(--gutter)',
        zIndex: 60,
        color: '#ffffff',
        textDecoration: 'none',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        mixBlendMode: 'difference',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        height: 16,
        lineHeight: '16px',
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
      {backLink}
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
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
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
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
            willChange: 'filter, transform',
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

      {/* Caption pinned bottom-left, on top of the photo. */}
      {caption && src && (
        <p
          className="label"
          style={{
            position: 'absolute',
            left: 'clamp(20px, 4vw, 48px)',
            bottom: 'clamp(20px, 4vh, 48px)',
            margin: 0,
            maxWidth: 'min(320px, 60vw)',
            color: '#ffffff',
            letterSpacing: '1px',
            lineHeight: 1.5,
            zIndex: 2,
          }}
        >
          {caption}
        </p>
      )}

      {/* Title overlay — bottom-anchored above the caption so the
          composition reads: photo → big title → small caption, in a
          stable hierarchy. The parallax lifts the title upward as the
          reader scrolls into the sticky stage; it never moves toward
          the caption. Plain white over the image; blur-to-clear on
          the image carries legibility while the photo is settling. */}
      <div
        ref={titleRef}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          padding: 'clamp(20px, 4vw, 48px)',
          // Reserve room for the caption (it sits in the bottom
          // ~clamp(20, 4vh, 48) band) plus a generous editorial gap.
          paddingBottom: 'clamp(96px, 14vh, 180px)',
          color: '#ffffff',
          pointerEvents: 'none',
          zIndex: 3,
          willChange: 'transform',
        }}
      >
        <h1
          style={{
            margin: 0,
            /* Match the homepage `.hero-display` exactly so the journal
               opener reads as a sibling of "FOR · GENERATIONAL · IMPACT". */
            fontFamily: 'var(--font-grotesque)',
            fontWeight: 600,
            fontSize: 'clamp(36px, 6.6vw, 96px)',
            lineHeight: 0.95,
            letterSpacing: '-0.04em',
            textTransform: 'uppercase',
            color: 'inherit',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            whiteSpace: 'nowrap',
          }}
        >
          {words.map((word, i) => (
            <span key={i}>{word}</span>
          ))}
        </h1>
      </div>
      </section>
    </div>
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
  return (
    <span className="aura-term" data-tip title={tip}>
      {children}
      <span className="aura-term__tip" aria-hidden>{tip}</span>
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
  label,
  caption,
  note,
  mediaType = 'image',
  poster,
}: {
  src?: string
  alt?: string
  /** Suggestion to the photo editor: "Landscape", "Portrait",
   *  "Aerial", "Detail", etc. Shown in the centered drafting label. */
  type?: string
  /** @deprecated Use `caption` and `type` instead. */
  label?: string
  /** Caption text. Renders as a small label in the bottom-left of the
   *  image when `src` is set. */
  caption?: string
  /** @deprecated Use `caption` instead. Kept for older journal pages. */
  note?: string
  /** Defaults to `image`. Pass `video` for an autoplaying loop. */
  mediaType?: 'image' | 'video'
  /** Video poster (or fallback still). */
  poster?: string
  /** @deprecated Aspect is fixed by the full-screen ExpandingBanner. */
  aspect?: string
}) {
  caption = caption ?? note ?? label
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
      {value && <p className="p1" style={{ margin: 0, marginBottom: 6 }}>{value}</p>}
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
        background: '#d6d6d6',
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
                  fontFamily: 'var(--font-grotesque)',
                  fontSize: 'clamp(24px, 3.2vw, 40px)',
                  lineHeight: 1.2,
                  letterSpacing: '-0.03em',
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
}: {
  children: string
  as?: 'h1' | 'h2' | 'h3'
  maxWidth?: number
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
        <As style={{ margin: 0, maxWidth, textAlign: 'left' }}>
          {lines.map((line, lineIdx) => {
            const words = line.split(/\s+/).filter(Boolean)
            const isLast = lineIdx === lines.length - 1
            return (
              <span
                key={lineIdx}
                style={{ display: 'block', marginBottom: isLast ? 0 : 'clamp(28px, 4vh, 56px)' }}
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

/* ─────────────────────────────────────────────────────────────────────
   DEPRECATED — legacy primitives kept as thin shims so older journal
   pages keep compiling while we migrate them off the kit one by one.
   Do NOT use these in new journals.
   ───────────────────────────────────────────────────────────────────── */

/** @deprecated Use plain <p className="p1"> / <p className="p2"> instead. */
export function P({ children, lead }: { children: ReactNode; lead?: boolean }) {
  return <p className={lead ? 'p1' : 'p2'} style={{ marginTop: '1em' }}>{children}</p>
}

/** @deprecated Use <TwoCol> (heading left, body right) or <OneCol>
 *  (heading centered) instead. */
export function Section({
  id,
  heading,
  children,
  align = '2col',
}: {
  id?: string
  heading?: ReactNode
  children: ReactNode
  align?: '2col' | 'center' | 'full'
}) {
  if (align === 'center') return <OneCol id={id} heading={heading}>{children}</OneCol>
  if (align === 'full' || !heading) {
    return (
      <section id={id} style={{ padding: 'var(--section-gap) 0' }}>
        <div className="section-w">
          <Reveal>
            {heading && <h2 style={{ marginBottom: 'var(--space-6)', maxWidth: 900 }}>{heading}</h2>}
            <div className="article-body" style={{ maxWidth: 760 }}>{children}</div>
          </Reveal>
        </div>
      </section>
    )
  }
  return <TwoCol id={id} heading={heading}>{children}</TwoCol>
}

/** @deprecated Dropped from the journal kit — don't add new uses. */
export function PullStat({ value, label, sub, wrap = true }: { value: ReactNode; label: string; sub?: string; wrap?: boolean }) {
  const inner = (
    <div style={{ margin: '0 auto', maxWidth: 480, textAlign: 'center' }}>
      <h2 style={{ margin: 0, marginBottom: 12 }}>{value}</h2>
      <div className="label">{label}</div>
      {sub && <p className="p2" style={{ marginTop: 12 }}>{sub}</p>}
    </div>
  )
  if (!wrap) return inner
  return (
    <section style={{ padding: 'var(--section-gap) 0' }}>
      <div className="section-w">
        <Reveal>{inner}</Reveal>
      </div>
    </section>
  )
}

/** @deprecated Use <Figure> or <Placeholder> instead. */
export function FocalImage({ src, alt, label, note }: { src?: string; alt?: string; label?: string; note?: string }) {
  return <Placeholder src={src} alt={alt} label={label ?? note} />
}

/** @deprecated Use <Placeholder> for inline images. */
export function Figure({
  src,
  poster,
  alt,
  caption,
  type = 'image',
  aspect = '16 / 9',
}: {
  src: string
  poster?: string
  alt: string
  caption?: string
  type?: 'image' | 'video'
  aspect?: string
}) {
  return (
    <figure style={{ margin: 'clamp(24px, 4vh, 48px) 0' }}>
      <div style={{ borderRadius: 'var(--radius-1)', overflow: 'hidden', aspectRatio: aspect }}>
        {type === 'video' ? (
          <video
            src={src}
            poster={poster}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            aria-label={alt}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        )}
      </div>
      {caption && <figcaption className="label" style={{ marginTop: 12 }}>{caption}</figcaption>}
    </figure>
  )
}

/** @deprecated Tightly coupled to one journal — inline if you need it. */
export function Couplet({ en, local, localLang }: { en: string; local?: string; localLang?: 'kn' | 'ja' | 'en' }) {
  return (
    <section style={{ padding: '0' }}>
      <div className="section-w">
        <div style={{ maxWidth: 760 }}>
          <p className="p1" style={{ marginBottom: 4 }}>{en}</p>
          {local && <p className="p2" lang={localLang || 'en'}>{local}</p>}
        </div>
      </div>
    </section>
  )
}

/** @deprecated Use <TwoCol> with two heading/body pairs instead. */
export function SideBySide({
  leftTitle,
  rightTitle,
  leftChildren,
  rightChildren,
}: {
  leftTitle: string
  rightTitle: string
  leftChildren: ReactNode
  rightChildren: ReactNode
}) {
  return (
    <section style={{ padding: 'var(--section-gap) 0' }}>
      <div className="section-w">
        <div className="sidebyside" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--grid-gap)' }}>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
            <div className="label" style={{ marginBottom: 12 }}>{leftTitle}</div>
            <div className="p2" style={{ color: 'var(--text-body)' }}>{leftChildren}</div>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
            <div className="label" style={{ marginBottom: 12 }}>{rightTitle}</div>
            <div className="p2" style={{ color: 'var(--text-body)' }}>{rightChildren}</div>
          </div>
          <style jsx>{`
            @media (max-width: 768px) {
              .sidebyside { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      </div>
    </section>
  )
}

export { ACTIVE_JOURNALS, nextActiveJournals }
export type { Journal }
