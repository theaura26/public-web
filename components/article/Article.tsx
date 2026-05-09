'use client'

/* ═══════════════════════════════════════════
   ARTICLE COMPONENTS — shared building blocks
   for long-form pages across the site.
   Monastic, declarative, Colossal-style.
═══════════════════════════════════════════ */

import Link from 'next/link'
import { Children, ReactNode, isValidElement, cloneElement } from 'react'
import Reveal from '@/components/RevealOnScroll'

/** Strip a single trailing "." from any string leaf in a ReactNode tree. */
function stripTrailingDot(node: ReactNode): ReactNode {
  if (typeof node === 'string') return node.replace(/\.$/, '')
  if (Array.isArray(node)) {
    const arr = [...node]
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i] == null || arr[i] === false) continue
      arr[i] = stripTrailingDot(arr[i])
      return arr
    }
    return arr
  }
  if (isValidElement(node)) {
    const children = (node.props as { children?: ReactNode }).children
    if (children != null) {
      return cloneElement(node, {}, stripTrailingDot(children))
    }
  }
  return node
}

/* ── Hero — 2-col default (eyebrow+title left, subline or TOC right) ── */
export function ArticleHero({
  eyebrow,
  title,
  subline,
  toc,
  media,
  caption,
}: {
  eyebrow?: string
  title: ReactNode
  subline?: ReactNode
  /** When provided, renders a table-of-contents in the right column instead of the subline. */
  toc?: { q: string; href: string }[]
  media?: { type: 'image' | 'video'; src: string; poster?: string; alt?: string }
  caption?: string
}) {
  const hasRight = toc?.length || subline
  return (
    <section style={{ paddingTop: 250, paddingBottom: 80 }}>
      <div className="section-w">
        {hasRight ? (
          <div>
            {/* eyebrow intentionally not rendered — fold into title copy */}
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
                      transition: opacity 0.2s ease;
                    }
                    .article-toc__item:last-child {
                      border-bottom: 1px solid var(--border);
                    }
                    .article-toc__item:hover {
                      opacity: 0.7;
                    }
                    .article-toc__arrow {
                      flex-shrink: 0;
                      font-family: var(--font-mono);
                    }
                  `}</style>
                </nav>
                ) : null}
              </div>
            </Reveal>
          </div>
          </div>
        ) : (
          <Reveal>
            {/* eyebrow intentionally not rendered — fold into title copy */}
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

/* ── Section — default layout: heading left, body right (2-col grid) ── */
export function Section({
  id,
  eyebrow,
  heading,
  children,
  align = '2col',
}: {
  id?: string
  eyebrow?: string
  heading?: ReactNode
  children: ReactNode
  /** '2col' = heading left, body right (default). 'center' = stacked centered. 'full' = full-width body with heading on top. */
  align?: '2col' | 'center' | 'full'
}) {
  if (align === 'center' || align === 'full' || !heading) {
    return (
      <section id={id} style={{ padding: 'var(--section-gap) 0' }}>
        <div className="section-w">
          <Reveal>
            {/* eyebrow intentionally not rendered — fold into heading copy */}
            {heading && <h2 style={{ marginBottom: 32, maxWidth: 900 }}>{heading}</h2>}
            <div className="article-body" style={{ maxWidth: 760 }}>{withLeadParagraph(children)}</div>
          </Reveal>
        </div>
      </section>
    )
  }

  // default: 2-col — heading left, body right
  return (
    <section id={id} style={{ padding: 'var(--section-gap) 0' }}>
      <div className="section-w">
        <div className="grid grid-cols-1 md:grid-cols-2 grid-2col" style={{ gap: 'var(--grid-gap)', alignItems: 'start' }}>
          <Reveal>
            <div>
              {/* eyebrow intentionally not rendered — fold into heading copy */}
              <h2 style={{ maxWidth: 560, marginTop: 0 }}>{heading}</h2>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="article-body" style={{ marginTop: '-0.2em' }}>{withLeadParagraph(children)}</div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ── Two-column section (heading left, body right) ── */
export function TwoCol({
  id,
  eyebrow,
  heading,
  children,
}: {
  id?: string
  eyebrow?: string
  heading: ReactNode
  children: ReactNode
}) {
  return (
    <section id={id} style={{ padding: 'var(--section-gap) 0' }}>
      <div className="section-w">
        <div className="grid grid-cols-1 md:grid-cols-2 grid-2col" style={{ gap: 'var(--grid-gap)', alignItems: 'start' }}>
          <Reveal>
            <div>
              {/* eyebrow intentionally not rendered — fold into heading copy */}
              <h2 style={{ maxWidth: 560, marginTop: 0 }}>{heading}</h2>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="flex flex-col gap-5" style={{ marginTop: '-0.2em' }}>
              {withLeadParagraph(children)}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ── Ṛta — rendered as RTA in DM Sans regardless of surrounding font ── */
export function Rta() {
  return (
    <span
      style={{
        fontFamily: 'var(--font-sans)',
        fontWeight: 400,
        letterSpacing: '0.04em',
      }}
    >
      RTA
    </span>
  )
}

/* ── Paragraph ── */
export function P({ children, lead }: { children: ReactNode; lead?: boolean }) {
  return <p className={lead ? 'p1' : 'p2'} style={{ marginTop: '1em' }}>{children}</p>
}

/** Mark the first <P> child as lead (p1), rest as p2. */
function withLeadParagraph(children: ReactNode): ReactNode {
  let leadApplied = false
  return Children.map(children, (child) => {
    if (!leadApplied && isValidElement(child) && child.type === P) {
      leadApplied = true
      const props = child.props as { lead?: boolean; children?: ReactNode }
      if (props.lead === undefined) {
        return cloneElement(child, { lead: true } as Partial<typeof props>)
      }
    }
    return child
  })
}

/* ── Figure: inline image or video with caption ── */
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
          >
            {poster && <img src={poster} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
          </video>
        ) : (
          <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        )}
      </div>
      {caption && <figcaption className="label" style={{ marginTop: 12 }}>{caption}</figcaption>}
    </figure>
  )
}

/* ── Placeholder ── solid grey box, 16:9, sits inside section-w gutters ── */
export function Placeholder({
  label,
  aspect = '16 / 9',
  note,
}: {
  label: string
  aspect?: string
  note?: string
}) {
  return (
    <section style={{ padding: 'clamp(48px, 7vh, 96px) 0' }}>
      <div className="section-w">
        <figure style={{ margin: 0, width: '100%' }}>
          <div
            style={{
              overflow: 'hidden',
              width: '100%',
              aspectRatio: aspect,
              background: '#d6d6d6',
              borderRadius: 'var(--radius-1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              padding: 24,
              textAlign: 'center',
              color: 'rgba(26, 26, 26, 0.55)',
            }}
          >
            <div className="label" style={{ marginBottom: 10, opacity: 0.85, color: 'inherit' }}>{label}</div>
            {note && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, maxWidth: 380, lineHeight: 1.5, opacity: 0.7, letterSpacing: 0.2, color: 'inherit' }}>{note}</div>}
          </div>
        </figure>
      </div>
    </section>
  )
}

/* ── Data grid (cards) — always self-wraps in a section-w so it gets page gutter ── */
export function DataGrid({ cols: _cols = 2, children }: { cols?: 2 | 3 | 4; children: ReactNode }) {
  return (
    <section style={{ padding: '0' }}>
      <div className="section-w">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'clamp(24px, 3vw, 40px)',
            maxWidth: 760,
          }}
          className="data-grid"
        >
          {children}
        </div>
      </div>
    </section>
  )
}

export function DataCard({ label: _label, value, children }: { label: string; value?: ReactNode; children?: ReactNode }) {
  return (
    <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
      {value && <p className="p1" style={{ margin: 0, marginBottom: 6 }}>{value}</p>}
      {children && <div className="p2" style={{ color: 'var(--text-body)' }}>{children}</div>}
    </div>
  )
}

/* ── Pull quote (centered block, grotesque display) ── */
export function PullQuote({ children, attribution }: { children: ReactNode; attribution?: string }) {
  return (
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
  )
}

/* ── Pull stat (centered narrow block, H3 value + label + sub) ── */
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

/* ── Side by side comparison (A/B columns) ── */
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
        <div
          className="sidebyside"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--grid-gap)',
          }}
        >
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
            <div className="label" style={{ marginBottom: 12 }}>{leftTitle}</div>
            <div className="p2" style={{ color: 'var(--text-body)' }}>{leftChildren}</div>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
            <div className="label" style={{ marginBottom: 12 }}>{rightTitle}</div>
            <div className="p2" style={{ color: 'var(--text-body)' }}>{rightChildren}</div>
          </div>
          <style jsx>{`
            @media (max-width: 767px) {
              .sidebyside { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      </div>
    </section>
  )
}

/* ── Continue cards (outgoing links at page end) ── */
export function Continue({ items }: { items: { href: string; label: string; description: string }[] }) {
  return (
    <section style={{ padding: 'var(--section-gap) 0', borderTop: '1px solid var(--border)' }}>
      <div className="section-w">
        <Reveal>
          <div className="label" style={{ marginBottom: 40 }}>Continue</div>
          <div
            className="continue-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
              gap: 'var(--grid-gap)',
            }}
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'block',
                  padding: '28px 0 0',
                  borderTop: '1px solid var(--border-strong)',
                  textDecoration: 'none',
                  color: 'var(--text)',
                  transition: 'transform 0.25s ease',
                }}
                className="continue-card"
              >
                <h3 style={{ margin: 0, marginBottom: 12 }}>{item.label}</h3>
                <div className="p2" style={{ color: 'var(--text-body)' }}>{item.description}</div>
              </Link>
            ))}
          </div>
          <style jsx>{`
            @media (max-width: 767px) {
              .continue-grid { grid-template-columns: 1fr !important; }
            }
            .continue-card:hover { transform: translateY(-2px); }
          `}</style>
        </Reveal>
      </div>
    </section>
  )
}

/* ── Numbered/titled chapter heading (2-col, body optional on right) ── */
export function Chapter({ number, title, id, children }: { number: string; title: string; id?: string; children?: ReactNode }) {
  return (
    <section
      id={id}
      style={{
        padding: 'var(--section-gap) 0 0',
        scrollMarginTop: 80,
      }}
    >
      <div className="section-w">
        <div className="grid grid-cols-1 md:grid-cols-2 grid-2col" style={{ gap: 'var(--grid-gap)', alignItems: 'start' }}>
          <Reveal>
            <div>
              {/* number intentionally not rendered — fold into title copy */}
              <h2 style={{ maxWidth: 560, marginTop: 0 }}>{title}</h2>
            </div>
          </Reveal>
          {children && (
            <Reveal delay={80}>
              <div className="article-body" style={{ marginTop: '-0.2em' }}>{withLeadParagraph(children)}</div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}

/* ── Couplet (two-line stanza; `local` defaults to English continuation) ── */
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
