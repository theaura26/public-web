'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

/* ═══════════════════════════════════════════════════════════════════
   ARTICLE SLIDER — a left-anchored, horizontally-scrollable row of the
   estate's editorials, under a small section label.

   The first card is the anchor (larger); the rest follow in a row that
   runs off the right edge and scrolls. Vertical mouse-wheel is mapped to
   horizontal scroll, and trackpad horizontal panning scrolls natively —
   so the row moves with either input. Place pages (Mudigere, Ohara) are
   excluded. Native scroll, no animation loop.
═══════════════════════════════════════════════════════════════════ */

type Article = { href: string; title: string; img: string; size?: 'sm' | 'md' | 'lg' }

// Every live editorial journal (place pages Mudigere/Ohara excluded). The
// first card is the large anchor; the rest vary in width (sm / md / lg)
// for an editorial rhythm rather than a uniform row.
const ARTICLES: Article[] = [
  { href: '/herd',           title: 'Ecosystem Engineers',   img: '/herd/images/aura-relationship2.jpg' },
  { href: '/circular',       title: 'Circular Intelligence', img: '/circular/images/aura-shed.jpg', size: 'md' },
  { href: '/shade',          title: 'The Light Instrument',  img: '/aura-land.jpg', size: 'lg' },
  { href: '/ecology',        title: 'The Living System',     img: '/aura-mudigere-landscape.jpg', size: 'sm' },
  { href: '/artistry',       title: 'Artistry',              img: '/aura-artistry.jpg', size: 'md' },
  { href: '/wisdom',         title: 'Moral Spine',           img: '/journals/wisdom/aura-moral-spine.jpg', size: 'lg' },
  { href: '/living-systems', title: 'Living Systems',        img: '/journals/living-systems/aura-living-systems.jpg', size: 'sm' },
  { href: '/coffee',         title: 'Our Coffee Story',      img: '/journals/coffee/aura-our-coffee-story.jpg', size: 'md' },
  { href: '/rta',            title: 'Rta',                   img: '/journals/rta/aura-rta.jpg', size: 'lg' },
  { href: '/fermentation',   title: 'Fermentation',          img: '/journals/fermentation/aura-fermentation.jpg', size: 'sm' },
  { href: '/land',           title: 'The Land',              img: '/journals/land/aura-the-land.jpg', size: 'md' },
  { href: '/biodynamic',     title: 'Biodynamic',            img: '/journals/biodynamic/aura-biodynamic.jpg', size: 'lg' },
  { href: '/residency',      title: 'Monastic Polymaths',    img: '/journals/residency/aura-monastic-polymath.jpg', size: 'sm' },
]

export function InfiniteArticleSlider() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    // Map vertical wheel to horizontal scroll. Trackpad horizontal panning
    // (deltaX) already scrolls natively, so only hijack a vertical wheel —
    // and let the page keep scrolling once we hit either end.
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      const max = el.scrollWidth - el.clientWidth
      if (max <= 0) return
      const atStart = el.scrollLeft <= 0 && e.deltaY < 0
      const atEnd = el.scrollLeft >= max - 1 && e.deltaY > 0
      if (atStart || atEnd) return
      el.scrollLeft += e.deltaY
      e.preventDefault()
    }

    // Mouse click-drag to scroll (touch/pen keep native scrolling). A drag
    // past a few px suppresses the card's click so it doesn't navigate.
    let down = false
    let startX = 0
    let startScroll = 0
    let moved = false
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      down = true
      moved = false
      startX = e.clientX
      startScroll = el.scrollLeft
    }
    const onMove = (e: PointerEvent) => {
      if (!down) return
      const dx = e.clientX - startX
      if (Math.abs(dx) > 3) moved = true
      el.scrollLeft = startScroll - dx
    }
    const onUp = () => { down = false }
    const onClick = (e: MouseEvent) => {
      if (moved) { e.preventDefault(); e.stopPropagation() }
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    el.addEventListener('click', onClick, true)
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      el.removeEventListener('click', onClick, true)
    }
  }, [])

  return (
    <section className="ias" aria-label="Aura journals">
      <p className="ias__label label">How we achieve generational impact</p>
      <div className="ias__scroll" ref={scrollRef}>
        <div className="ias__track">
          {ARTICLES.map((a, i) => (
            <Link key={a.href} href={a.href} className={`ias__card tile ${i === 0 ? 'ias__card--anchor' : `ias__card--${a.size ?? 'md'}`}`}>
              <div className="tile-img" aria-hidden>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.img} alt={a.title} loading="lazy" decoding="async" draggable={false} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="tile-symbol"
                  src={`/aura-symbol-${(i % 3) + 1}.png`}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </div>
              <p className="tile-title">{a.title}</p>
            </Link>
          ))}
        </div>
      </div>
      {/* backdrop-filter is set inline: styled-jsx drops it from emitted
          rules on this build (the slide-out menu vignette does the same). */}
      <div
        className="ias__fade"
        aria-hidden
        style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
      />

      <style jsx global>{`
        .ias {
          position: relative;
          width: 100vw;
          margin-left: calc(50% - 50vw);
          padding: clamp(18px, 3vh, 40px) 0 clamp(24px, 5vh, 64px);
        }
        /* Right-edge blur + fade, like the slide-out menu's vignette, so
           the row dissolves off the right rather than hard-cropping. */
        .ias__fade {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: clamp(64px, 12vw, 200px);
          pointer-events: none;
          z-index: 2;
          background: linear-gradient(to right, transparent, var(--bg) 82%);
          -webkit-mask-image: linear-gradient(to right, transparent, #000 55%);
          mask-image: linear-gradient(to right, transparent, #000 55%);
        }
        /* Small mono section label, anchored to the content's left edge so
           it lines up with the manifesto above it. */
        .ias__label {
          margin: 0 0 clamp(18px, 2.4vh, 32px);
          padding-left: max(var(--gutter), calc(50vw - var(--max-w) / 2 + var(--gutter)));
          text-align: left;
          /* Brand accent — matches the orange eyebrows across the journals. */
          color: var(--brand-accent);
        }
        .ias__scroll {
          overflow-x: auto;
          overflow-y: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
          cursor: grab;
        }
        .ias__scroll::-webkit-scrollbar {
          display: none;
          height: 0;
        }
        .ias__track {
          display: flex;
          align-items: flex-start;
          /* Gap matches the home pillar grid (--grid-gap) for a consistent
             rhythm across the page. */
          gap: var(--grid-gap);
          width: max-content;
          /* First card lines up with the label + page content; the row
             bleeds off the right edge and scrolls. */
          padding-left: max(var(--gutter), calc(50vw - var(--max-w) / 2 + var(--gutter)));
          padding-right: var(--gutter);
        }
        .ias__card {
          flex: 0 0 auto;
          text-decoration: none;
          color: var(--text);
          -webkit-user-select: none;
          user-select: none;
        }
        /* The left-hand anchor — largest — then a varied row (lg / md / sm)
           so the widths read as an editorial rhythm, not a uniform strip.
           All 16:9, top-aligned, so heights vary with them. */
        .ias__card--anchor { width: clamp(300px, 46vw, 640px); }
        .ias__card--lg { width: clamp(280px, 34vw, 460px); }
        .ias__card--md { width: clamp(240px, 27vw, 380px); }
        .ias__card--sm { width: clamp(200px, 20vw, 300px); }
        .ias__card .tile-title {
          color: var(--text);
          text-align: left;
          margin-top: 14px;
        }
        @media (max-width: 768px) {
          .ias__card--anchor { width: clamp(260px, 82vw, 420px); }
          .ias__card--lg { width: clamp(220px, 66vw, 340px); }
          .ias__card--md { width: clamp(200px, 58vw, 300px); }
          .ias__card--sm { width: clamp(170px, 48vw, 260px); }
        }
      `}</style>
    </section>
  )
}
