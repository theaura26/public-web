'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMode } from './ModeProvider'
import { LogoEmblem } from './Logo'

/* ── Article tiles for the journal slide-out ──
   Mirrors the sitemap of journal pages exactly. Top-level routes
   (/, /reason, /brand, /contact) live in PRIMARY_LINKS and are
   intentionally excluded.

   Titles match the actual <ArticleHero> on each page.
   Each tile: width % of the right column (varied), align (left|right|center).
   All tiles render at 16:9. Variation creates editorial rhythm. */
type Article = {
  href: string
  title: string
  /** Two-step size token. `lg` = wide cards, `sm` = narrow cards.
   *  Resolved to a percentage of the feed column at render time. */
  size: 'lg' | 'sm'
  /** Poster image (also the fallback if a video is set). */
  img?: string
  /** Optional autoplay loop. /sanctuary is the only one with motion right now. */
  video?: string
  /** Mark a journal as not-yet-live. Tile renders muted, non-clickable,
   *  with a "COMING SOON" overlay instead of the title link. */
  comingSoon?: boolean
}

const ARTICLES: Article[] = [
  // Active journals — listed first, in the order the user wants them.
  { href: '/wisdom',         title: 'Moral Spine',                        size: 'lg', img: '/journals/wisdom/aura-moral-spine.jpg' },
  { href: '/living-systems', title: 'Living Systems',                     size: 'sm', img: '/journals/living-systems/aura-living-systems.jpg' },
  { href: '/coffee',         title: 'Our Coffee Story',                   size: 'lg', img: '/journals/coffee/aura-our-coffee-story.jpg' },
  { href: '/rta',            title: 'Rta',                                size: 'sm', img: '/journals/rta/aura-rta.jpg' },
  { href: '/fermentation',   title: 'Fermentation',                       size: 'lg', img: '/journals/fermentation/aura-fermentation.jpg' },
  { href: '/land',           title: 'The Land',                           size: 'sm', img: '/journals/land/aura-the-land.jpg' },
  { href: '/biodynamic',     title: 'Biodynamic',                         size: 'lg', img: '/journals/biodynamic/aura-biodynamic.jpg', video: '/journals/biodynamic/aura-biodynamic.mp4' },
  { href: '/residency',      title: 'Monastic polymaths. Crazy misfits.', size: 'lg', img: '/journals/residency/aura-monastic-polymath.jpg' },
  // Coming-soon — render at the tail of the feed.
  { href: '/idea',           title: 'The 1000 Year Idea',                 size: 'sm', img: '/aura-idea.jpg',          comingSoon: true },
  { href: '/sanctuary',      title: 'Guests of the mountain.',            size: 'lg', img: '/aura-sanctuary.jpg', video: '/aura-sanctuary.mp4', comingSoon: true },
  { href: '/artistry',       title: 'Code meets clay.',                   size: 'sm', img: '/aura-artistry.jpg',      comingSoon: true },
  { href: '/provenance',     title: 'Cherry to cup. On chain.',           size: 'sm', img: '/aura-provenance.jpg',    comingSoon: true },
  { href: '/pepper',         title: 'Malabar black gold.',                size: 'lg', img: '/aura-pepper.jpg',        comingSoon: true },
  { href: '/areca',          title: 'The sentinel palm.',                 size: 'sm', img: '/aura-areca.jpg',         comingSoon: true },
  { href: '/vedic',          title: 'Older than its study.',              size: 'lg', img: '/aura-vedic.jpg',         comingSoon: true },
]

const PRIMARY_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/reason', label: 'The Reason' },
  { href: '/brand', label: 'Our Brand' },
  { href: '/contact', label: 'Contact Us' },
]

const INSTAGRAM_URL = 'https://www.instagram.com/theaura.life/'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showLogo, setShowLogo] = useState(false)
  /* Lazy-mount gate for the tile-feed media. Browsers eagerly fetch
     images and sniff video metadata even inside a `position: fixed`
     panel parked at `right: -100vw`, because they can't predict when
     a CSS-positioned element will enter the viewport. Setting
     `loading="lazy"` + `preload="none"` on the elements is not
     enough — Chrome still spends ~25-30 MB on Navbar media on every
     page load. Solution: don't put the heavy children in the DOM
     until the user actually opens the menu. Stays true thereafter so
     the feed isn't torn down + reseeded on every reopen. */
  const [hasOpenedMenu, setHasOpenedMenu] = useState(false)
  const { theme, setTheme, viewMode, setViewMode } = useMode()
  const pathname = usePathname()
  const scrollRef = useRef<HTMLDivElement>(null)
  const tileRefs = useRef<(HTMLAnchorElement | null)[]>([])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return
      if (e.key === 'd' || e.key === 'D') setTheme('night')
      if (e.key === 'l' || e.key === 'L') setTheme('day')
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setTheme])

  // Centre wordmark visibility:
  //  · Homepage: fades in once scroll passes the first fold (70vh)
  //  · Every other page: always visible
  const isHome = pathname === '/'
  useEffect(() => {
    if (!isHome) {
      setShowLogo(true)
      return
    }
    const onScroll = () => {
      const threshold = window.innerHeight * 0.7
      setShowLogo(window.scrollY > threshold)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  // First open arms the tile-feed permanently. After the user has
  // opened the menu once, the heavy media is allowed to live in the
  // DOM so subsequent opens don't need to re-mount + re-fetch.
  useEffect(() => { if (menuOpen) setHasOpenedMenu(true) }, [menuOpen])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  // Lock body scroll while menu open
  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = prev }
    }
  }, [menuOpen])

  // Tiles render at their natural positions — parallax disabled so the gap
  // between cards is perfectly consistent.
  useEffect(() => {
    if (!menuOpen) return
    tileRefs.current.forEach((tile) => { if (tile) tile.style.transform = '' })
  }, [menuOpen])

  // Infinite scroll + image parallax for the journal feed.
  //
  // The feed renders ARTICLES three times. On open we land at the
  // start of the second (canonical) cycle. As the user scrolls past
  // either boundary into the first or third cycle, we teleport by
  // exactly one cycle height — invisible because the cycles are
  // identical content.
  useEffect(() => {
    if (!menuOpen) return
    const root = scrollRef.current
    if (!root) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const tiles = tileRefs.current.filter((t): t is HTMLAnchorElement => !!t)
    const images = tiles.map(t =>
      t.querySelector<HTMLElement>('.tile-img > img, .tile-img > video')
    )

    // Clean up any leftover styles from previous menu opens.
    for (const t of tiles) {
      t.style.willChange = ''
      t.style.transition = ''
      t.style.transform = ''
      t.style.opacity = ''
      t.style.filter = ''
    }
    for (const img of images) {
      if (!img) continue
      img.style.willChange = 'transform'
      img.style.transition = 'none'
      img.style.filter = ''
    }

    // Agent mode: no infinite scroll, no parallax, no scroll seeding.
    // Just let the tile-feed render from the top so the titles read as
    // a plain list. Without this, the scroll seeding below would jump
    // ~5000 px into the cycle, leaving the visible viewport empty
    // since the tile thumbnails are display:none in agent mode.
    if (viewMode === 'agent') {
      root.scrollTop = 0
      return
    }

    // Seed scroll position to the start of the middle (canonical) cycle.
    // Wait a frame so layout is settled before we read scrollHeight.
    let seeded = false
    const seedScroll = () => {
      const cycleH = root.scrollHeight / 3
      if (cycleH > 0) {
        root.scrollTop = cycleH
        seeded = true
      }
    }
    requestAnimationFrame(seedScroll)

    if (prefersReduced) {
      for (const img of images) {
        if (!img) continue
        img.style.transform = 'scale(1.12)'
      }
      return
    }

    // Two motions composed on each card:
    //   1. PARALLAX — subtle ±8 px drift (signed per tile) based on the
    //      card's bounded viewport position. A static depth cue.
    //   2. ENTRY — cards in the lower band of the scroller are offset
    //      DOWN, animating to their resting position as they scroll up.
    //      Upper half of the scroller is the "settled" zone where cards
    //      sit at their resting position and gap rhythm. No blur — the
    //      tiles enter sharp from the bottom.
    const PARALLAX_DRIFT = 8       // ± px parallax depth
    const ENTRY_DRIFT = 28         // px the card lifts as it enters
    const SETTLED_START = 0.5      // ratio of scrollerH where clarity begins
    const SETTLED_END = 0.95       // ratio of scrollerH where the entry offset finishes
    const directions = tiles.map((_, i) => Math.sign(Math.sin(i * 1.37)) || 1)

    // Images locked at resting scale — all motion now happens on the card.
    for (const img of images) {
      if (img) img.style.transform = 'scale(1.06)'
    }
    // Card gets the will-change once. No filter property — entry blur
    // has been removed so the cards never carry a filter.
    for (const t of tiles) {
      t.style.willChange = 'transform'
      t.style.transition = 'none'
      t.style.filter = ''
    }

    let raf = 0
    const update = () => {
      raf = 0
      if (!seeded) return
      const cycleH = root.scrollHeight / 3
      const s = root.scrollTop

      // Teleport between cycles so the feed reads infinite. Triggered
      // well inside the boundary copies so the user never sees the edge.
      if (s < cycleH * 0.5) {
        root.scrollTop = s + cycleH
        return
      } else if (s > cycleH * 2.5) {
        root.scrollTop = s - cycleH
        return
      }

      const rootRect = root.getBoundingClientRect()
      const rootH = rootRect.height
      const halfH = rootH / 2
      const settledSpan = SETTLED_END - SETTLED_START

      tiles.forEach((t, i) => {
        const tileRect = t.getBoundingClientRect()
        const tileTopInRoot = tileRect.top - rootRect.top
        const tileCenter = tileTopInRoot + tileRect.height / 2

        // Parallax: gentle bounded drift based on viewport position.
        const norm = Math.max(-1, Math.min(1, (tileCenter - halfH) / halfH))
        const parallaxY = norm * PARALLAX_DRIFT * directions[i]

        // Entry progress: 1 when card is settled (upper half), 0 when
        // entering from the very bottom. Smootherstep for buttery curve.
        const ratio = tileCenter / rootH
        const rawEntry = Math.max(0, Math.min(1,
          (SETTLED_END - ratio) / settledSpan
        ))
        const p = rawEntry * rawEntry * rawEntry * (rawEntry * (rawEntry * 6 - 15) + 10)

        const entryY = (1 - p) * ENTRY_DRIFT

        t.style.transform = `translateY(${parallaxY + entryY}px)`
      })
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }

    root.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      root.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  // hasOpenedMenu is in the dep array so this re-runs once the tiles
  // actually mount on first open. Without it the first seedScroll
  // sees a 0-height feed and never seeds — the feed starts at the
  // top of the first (boundary) cycle and the infinite-scroll
  // teleport instantly jumps the user a screenful on the first
  // touch.
  }, [menuOpen, viewMode, hasOpenedMenu])

  const isAgent = viewMode === 'agent'
  const toggleTheme = () => setTheme(theme === 'day' ? 'night' : 'day')
  const toggleView = () => setViewMode(viewMode === 'human' ? 'agent' : 'human')

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 aura-nav"
        style={{
          padding: 0,
          background: 'var(--bg)',
          height: 56,
          /* 10vw rails on either side so the logo + hamburger sit centred on
             the same vertical axis as the menu-marquee strip. Middle column
             flexes for the centred wordmark. Mobile override below uses
             auto-sized rails + var(--gutter) padding so the marks sit at
             matching insets from each viewport edge. */
          display: 'grid',
          gridTemplateColumns: '10vw 1fr 10vw',
          alignItems: 'center',
          /* Force GPU compositor layer — eliminates iOS Safari URL-bar jitter
             where fixed elements jump when the address bar shows/hides. */
          transform: 'translateZ(0)',
          willChange: 'transform',
          WebkitBackfaceVisibility: 'hidden',
          /* Extend the nav background 1px down to cover the subpixel gap
             that can render as a thin light line between the nav and the
             content beneath it on mobile. */
          boxShadow: '0 1px 0 0 var(--bg)',
        }}
      >
        {/* Left — rotating symbol (centred in the 10vw rail) */}
        <Link href="/" className="no-underline" style={{ color: 'var(--text)', justifySelf: 'center', display: 'inline-flex', alignItems: 'center' }}>
          {isAgent ? (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>~/aura</span>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/aura-animated.svg"
              alt="Aura"
              className="invert-on-light"
              style={{ display: 'block', height: 32, width: 'auto' }}
            />
          )}
        </Link>

        {/* Center — full wordmark slides in past the first fold */}
        <Link
          href="/"
          aria-label="Aura — home"
          className="no-underline nav-wordmark"
          style={{
            justifySelf: 'center',
            color: 'var(--text)',
            display: 'inline-flex',
            alignItems: 'center',
            opacity: showLogo ? 1 : 0,
            transform: showLogo ? 'translateY(0)' : 'translateY(-12px)',
            transition: 'opacity var(--dur-slow) var(--ease-out), transform var(--dur-slow) var(--ease-out)',
            pointerEvents: showLogo ? 'auto' : 'none',
          }}
        >
          <LogoEmblem size={92} />
        </Link>

        {/* Right — 2-line hamburger (centred in the right 10vw rail) */}
        <button
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(v => !v)}
          /* 44×44 hit area meets WCAG 2.5.8 minimum touch target. The visual
             ink (two 22px bars) sits centred inside the larger pad area. */
          style={{
            justifySelf: 'center',
            background: 'none',
            border: 'none',
            width: 44,
            height: 44,
            padding: 0,
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <span style={{ display: 'block', width: 22, height: 1.5, background: 'var(--text)', transition: 'transform var(--dur-base) var(--ease), opacity var(--dur-base) var(--ease)', transform: menuOpen ? 'translateY(3.75px) rotate(45deg)' : 'none' }} />
          <span style={{ display: 'block', width: 22, height: 1.5, background: 'var(--text)', transition: 'transform var(--dur-base) var(--ease), opacity var(--dur-base) var(--ease)', transform: menuOpen ? 'translateY(-3.75px) rotate(-45deg)' : 'none' }} />
        </button>
      </nav>

      {/* Backdrop — page-coloured strip behind the contrast menu overlay.
          Uses var(--bg) so the exposed 10vw rail matches the rest of the page
          (light in day, dark in night) — the panel itself is the inverted
          contrast strip. */}
      <div
        onClick={() => setMenuOpen(false)}
        className="fixed inset-0 z-40 menu-backdrop"
        style={{
          background: 'var(--bg)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity var(--dur-base) var(--ease)',
          overflow: 'hidden',
        }}
      >
        <div className="menu-marquee" aria-hidden>
          <span>
            {'The Reason is to Restore What Sustains Us · '.repeat(20)}
          </span>
        </div>
      </div>

      {/* Menu panel — 90vw, anchored right, sits over the nav. Background and
          text bind to the CONTRAST palette so the overlay is always inverted
          from the page (dark panel in day, light panel in night).

          Slide-in is animated via `right` rather than `transform: translateX`
          on purpose: the .tile-feed-vignette below uses `backdrop-filter`
          to blur the menu content, and a transformed parent forces this
          panel onto its own GPU compositor layer which the sibling
          backdrop-filter can't see through. Animating `right` keeps the
          panel un-transformed at rest, so the backdrop-filter behind it
          works as expected. */}
      <div
        className="menu-overlay fixed z-50"
        style={{
          top: 0,
          bottom: 0,
          right: menuOpen ? 0 : '-100vw',
          background: 'var(--contrast-bg)',
          color: 'var(--contrast-text)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'right var(--dur-slow) var(--ease-out), opacity var(--dur-base) var(--ease)',
          overflow: 'hidden',
        }}
      >
        {/* Mobile-only: rotating symbol top-left of panel. The menu is always
            on a CONTRAST surface (dark in day, light in night), so we pick the
            asset that reads against THAT surface — opposite of the page-level
            choice. `aura-dark.svg` is white-on-transparent (for dark surfaces);
            `aura-lite.svg` is black-on-transparent (for light surfaces). */}
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          aria-label="Aura — home"
          className="menu-logo no-underline"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={theme === 'day' ? '/aura-dark.svg' : '/aura-lite.svg'}
            alt="Aura"
            style={{ display: 'block', height: 28, width: 'auto' }}
          />
        </Link>

        {/* Close X — top-right of panel, never scrolls */}
        <button
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          className="menu-close"
        >
          <span style={{ display: 'block', width: 22, height: 1.5, background: 'currentColor', transform: 'translateY(3.75px) rotate(45deg)' }} />
          <span style={{ display: 'block', width: 22, height: 1.5, background: 'currentColor', transform: 'translateY(-3.75px) rotate(-45deg)' }} />
        </button>

        {/* Left — primary nav, locked at top, never scrolls */}
        <aside className="menu-left">
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {PRIMARY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="menu-link"
                data-active={pathname === link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Bottom-left utilities: theme toggle + view-mode toggle + Instagram */}
        <div className="menu-utils">
          <button
            type="button"
            className="menu-util-btn"
            aria-label={theme === 'day' ? 'Switch to night mode' : 'Switch to day mode'}
            onClick={toggleTheme}
          >
            {theme === 'day' ? (
              /* moon — currently day, click goes to night */
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              /* sun — currently night, click goes to day */
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            )}
          </button>

          <button
            type="button"
            className="menu-util-btn"
            aria-label={viewMode === 'human' ? 'Switch to agent view' : 'Switch to human view'}
            onClick={toggleView}
          >
            {viewMode === 'human' ? (
              /* robot — currently human, click goes to agent */
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="7" width="16" height="13" rx="2" />
                <path d="M12 4v3" />
                <circle cx="12" cy="3.5" r="1" />
                <circle cx="9" cy="13" r="1" fill="currentColor" stroke="none" />
                <circle cx="15" cy="13" r="1" fill="currentColor" stroke="none" />
                <path d="M9 17h6" />
              </svg>
            ) : (
              /* human — currently agent, click goes to human */
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c1.5-4.5 5-7 8-7s6.5 2.5 8 7" />
              </svg>
            )}
          </button>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="menu-util-btn"
            aria-label="Aura on Instagram"
          >
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
            </svg>
          </a>
        </div>

        {/* Right — scrollable tile feed. Articles rendered three cycles for
            seamless infinite scroll: the middle cycle is the canonical one,
            and the scroll position teleports between cycles when it crosses
            the boundary so the feed reads as endless. */}
        <section className="menu-right" ref={scrollRef}>
          <div className="tile-feed">
            {hasOpenedMenu && [0, 1, 2].flatMap(cycle =>
              ARTICLES.map((a, i) => {
                const flatIndex = cycle * ARTICLES.length + i
                return (
                  <Link
                    href={a.href}
                    key={`${cycle}-${a.href}`}
                    onClick={(e) => {
                      if (a.comingSoon) { e.preventDefault(); return }
                      setMenuOpen(false)
                    }}
                    ref={(el) => { tileRefs.current[flatIndex] = el }}
                    className="tile"
                    data-size={a.size}
                    data-coming-soon={a.comingSoon ? 'true' : undefined}
                    aria-disabled={a.comingSoon ? true : undefined}
                    tabIndex={a.comingSoon ? -1 : undefined}
                    style={{
                      /* Two-size system: lg = ~470 px max, sm = ~280 px max.
                         All tiles snap to the LEFT edge of the feed column
                         for a uniform left-aligned reading rhythm. */
                      width: a.size === 'lg' ? '85%' : '52%',
                      maxWidth: a.size === 'lg' ? 470 : 290,
                      alignSelf: 'flex-start',
                    }}
                  >
                    <div className="tile-img" aria-hidden>
                      {a.video ? (
                        <video
                          autoPlay
                          muted
                          loop
                          playsInline
                          /* Slide-out menu is hidden by default — preload nothing
                             until the user actually opens the menu and the tile
                             scrolls into view. Was: "auto" (full preload on every
                             page load, ~10MB of menu video transfer). */
                          preload="none"
                          poster={a.img}
                          aria-label={a.title}
                        >
                          <source src={a.video} type="video/mp4" />
                        </video>
                      ) : a.img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={a.img} alt={a.title} loading="lazy" decoding="async" />
                      ) : null}
                      {/* Hover symbol — one of the three aura emblems
                          (aura-symbol-1/2/3), cycled by tile index. Same
                          asset set as the homepage hero tiles. Sits above
                          the image, fades + scales in on hover while the
                          image below blurs out. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="tile-symbol"
                        src={`/aura-symbol-${(i % 3) + 1}.png`}
                        alt=""
                        aria-hidden
                        loading="lazy"
                        decoding="async"
                      />
                      {a.comingSoon && (
                        <span className="tile-coming-soon">Coming Soon</span>
                      )}
                    </div>
                    <p className="tile-title">{a.title}</p>
                  </Link>
                )
              })
            )}
          </div>
        </section>


        <style jsx>{`
          :global(.menu-overlay) { width: 90vw; color: var(--contrast-text); }
          :global(.menu-backdrop) { display: flex; align-items: stretch; }
          :global(.menu-link) {
            font-family: var(--font-mono) !important;
            font-size: 12px !important;
            letter-spacing: 1.5px !important;
            text-transform: uppercase !important;
            line-height: 1.4;
            color: var(--contrast-text);
            text-decoration: none;
            padding: 0;
            transition: opacity var(--dur-fast) var(--ease);
            display: block;
          }
          :global(.menu-link:hover) { opacity: 0.7; }
          /* Utility stack: left-aligned with the primary nav links column
             (var(--gutter) inside the menu panel). Stacks vertically, each
             chip left-anchored so the column reads tidy. */
          :global(.menu-utils) {
            position: absolute;
            bottom: 60px;
            left: var(--gutter);
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          /* Toggle chips (theme + view mode) — slightly bigger filled circle.
             Background tint is keyed off currentColor so it darkens in light
             mode and lightens in dark mode automatically. */
          :global(button.menu-util-btn) {
            background: color-mix(in oklab, currentColor 12%, transparent);
            color: var(--contrast-text);

            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: none;
            padding: 0;
            margin: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: background-color var(--dur-fast) var(--ease);
          }
          :global(button.menu-util-btn:hover) {
            background: color-mix(in oklab, currentColor 22%, transparent);
          }
          :global(button.menu-util-btn svg) {
            width: 16px !important;
            height: 16px !important;
          }
          /* Instagram link — bare icon, but with the same 32×32 container
             as the toggle chips above so the icon centre lands on the same
             vertical axis as the chip centres. */
          :global(a.menu-util-btn) {
            background: none;
            border: none;
            padding: 0;
            margin: 0;
            color: var(--contrast-text);
            text-decoration: none;

            width: 32px;
            height: 32px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: opacity var(--dur-fast) var(--ease);
          }
          :global(a.menu-util-btn:hover) { opacity: 0.7; }
          :global(a.menu-util-btn svg) {
            width: 20px !important;
            height: 20px !important;
          }
          :global(.tile) {
            display: block;
            text-decoration: none;
            color: var(--contrast-text);
            will-change: transform;
            transition: opacity var(--dur-fast) var(--ease);
          }
          :global(.tile-img) {
            position: relative;
            width: 100%;
            aspect-ratio: 16 / 9;
            /* Neutral placeholder while the image loads — picks up the
               CONTRAST card surface so it sits naturally on the inverted
               menu panel in either mode. */
            background: var(--contrast-bg-card);
            border-radius: 2px;
            overflow: hidden;
            transition: opacity var(--dur-fast) var(--ease);
          }
          :global(.tile-img img:not(.tile-symbol)),
          :global(.tile-img video) {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transition: filter var(--dur-base) var(--ease);
          }
          /* Hover symbol — vector glyph centred over the photo, hidden
             at rest and revealed on hover. Pure 35 % of the card width
             (no clamp) so the mark scales with the tile — small cards
             get a small mark, large cards get a large one. Difference
             blend so it reads on any underlying tone; z-index high so
             the mark sits above the thumbnail unambiguously. */
          :global(.tile-img .tile-symbol) {
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
          /* On hover: image blurs to 14px, symbol fades + scales up to
             its resting state. Link wrapper doesn't get the styled-jsx
             scope class, so the hover selector chain is global. */
          :global(.tile:hover .tile-img img:not(.tile-symbol)),
          :global(.tile:hover .tile-img video) {
            filter: blur(14px);
          }
          :global(.tile:hover .tile-img .tile-symbol) {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          /* Coming-soon tiles: muted card, no hover effects, label overlay
             centred on the placeholder. Tile is non-interactive (preventDefault
             on click + tabIndex -1) so all that's left is the visual treatment. */
          :global(.tile[data-coming-soon="true"]) {
            cursor: default;
            pointer-events: auto;
          }
          :global(.tile[data-coming-soon="true"] .tile-img) {
            opacity: 0.55;
          }
          :global(.tile[data-coming-soon="true"] .tile-img img:not(.tile-symbol)),
          :global(.tile[data-coming-soon="true"] .tile-img video) {
            filter: grayscale(1) brightness(0.85);
          }
          :global(.tile[data-coming-soon="true"]:hover .tile-img) {
            opacity: 0.55;
          }
          :global(.tile[data-coming-soon="true"]:hover .tile-img img:not(.tile-symbol)),
          :global(.tile[data-coming-soon="true"]:hover .tile-img video) {
            filter: grayscale(1) brightness(0.85);
          }
          :global(.tile[data-coming-soon="true"] .tile-symbol) {
            display: none;
          }
          :global(.tile[data-coming-soon="true"] .tile-title) {
            opacity: 0.5;
          }
          :global(.tile-coming-soon) {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 11;
            font-family: var(--font-mono);
            font-size: 11px;
            font-weight: 400;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            color: var(--contrast-text);
            white-space: nowrap;
            pointer-events: none;
            padding: 6px 10px;
            background: color-mix(in oklab, var(--contrast-bg) 70%, transparent);
            border-radius: 2px;
          }
          /* Matches the global .label style exactly: DM Mono 11px, 1px
             letter-spacing, uppercase. Title and meta labels site-wide now
             share one type role. */
          :global(.tile-title) {
            font-family: var(--font-mono);
            font-size: 11px;
            font-weight: 400;
            letter-spacing: 1px;
            text-transform: uppercase;
            line-height: 1.4;
            color: var(--contrast-text);
            margin-top: 16px;
          }
          :global(.menu-marquee) {
            position: absolute;
            top: 116px;        /* nav (56) + 60px whitespace below the logo */
            bottom: 60px;       /* 60px whitespace above the bottom edge */
            left: 0;
            /* Span the full exposed white strip (panel is 90vw on the right,
               so 10vw of strip is left over). Text is centred horizontally. */
            width: 10vw;
            display: flex;
            align-items: center;
            justify-content: center;
            text-transform: uppercase;
            color: var(--text);
            font-family: var(--font-mono);
            font-size: 11px;
            letter-spacing: 2px;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            /* Use vertical writing-mode so the text column is naturally centred
               by flex justify-content; no rotation transforms to drift. */
            writing-mode: sideways-lr;
          }
          :global(.menu-marquee span) {
            display: inline-block;
            white-space: nowrap;
            animation: marquee-scroll 90s linear infinite;
          }
          @keyframes marquee-scroll {
            from { transform: translateY(0); }
            to   { transform: translateY(-50%); }
          }
          /* Close X — desktop default. Sits on the inverted overlay so it
             uses the contrast text colour. */
          :global(.menu-close) {
            position: absolute;
            top: 16px;
            right: var(--gutter);
            z-index: 3;
            background: none;
            border: none;
            padding: 8px 4px;
            display: flex;
            flex-direction: column;
            gap: 6px;

            color: var(--contrast-text);
          }

          /* Mobile-only logo top-left of panel */
          :global(.menu-logo) {
            display: none;
          }

          .menu-left {
            position: absolute;
            top: 116px;                   /* aligned with marquee top */
            left: var(--gutter);          /* aligned with the panel's own gutter */
            width: 240px;
            display: flex;
            flex-direction: column;
            z-index: 2;
          }

          .menu-right {
            position: absolute;
            top: 0;
            left: calc(var(--gutter) + 240px + clamp(64px, 8vw, 160px));
            right: var(--gutter);
            bottom: 0;
            overflow-y: auto;
            padding: 116px 0 60px;
            box-sizing: border-box;
            /* Hide native scrollbar — the journal feed scrolls silently
               so the cards do all the visual work. */
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .menu-right::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }

          /* Bottom blur band — fixed-positioned strip at the bottom of
             the viewport. Lives as a sibling of .menu-overlay so it can
             span the full viewport width, and .menu-overlay no longer
             carries a transform (it slides via the right property now)
             so this sibling backdrop-filter can see through to the
             cards behind. The actual backdrop-filter declarations are
             set INLINE on the element — styled-jsx emitted rules drop
             them on this build, but inline survives every time. */
          :global(.tile-feed-vignette) {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            height: 18vh;
            z-index: 101;
            transform: translateZ(0);
            -webkit-transform: translateZ(0);
            will-change: transform;
            /* Pure linear feather — full blur at the bottom edge,
               easing smoothly to zero at the top. No solid plateau so
               the band reads as a soft horizon rather than a defined
               strip with a fade tacked on. */
            -webkit-mask-image: linear-gradient(to top,
              rgba(0, 0, 0, 1) 0%,
              rgba(0, 0, 0, 0) 100%
            );
            mask-image: linear-gradient(to top,
              rgba(0, 0, 0, 1) 0%,
              rgba(0, 0, 0, 0) 100%
            );
          }

          .tile-feed {
            display: flex;
            flex-direction: column;
            /* Uniform 100px gap between every tile, regardless of width. */
            gap: 100px;
            /* Column lane: 560px wide, positioned in the right portion of
               the menu but with every tile snapping to the lane's LEFT
               edge for a clean uniform reading rhythm. */
            max-width: 560px;
            margin-left: auto;
            margin-right: 100px;
            align-items: flex-start;
          }

          /* Mobile / tablet — full-screen overlay, 2-col (nav left, tiles right) */
          @media (max-width: 900px) {
            :global(.menu-overlay) { width: 100vw; }
            :global(.menu-marquee) { display: none; }

            /* Top bar: rotating logo on left, X on right — both fixed in panel */
            :global(.menu-logo) {
              display: inline-flex;
              position: absolute;
              top: 20px;
              left: 24px;
              z-index: 4;
              align-items: center;
              color: var(--contrast-text);
            }
            :global(.menu-close) {
              top: 20px;
              right: 24px;
              z-index: 4;
              padding: 8px;
            }

            /* Left nav column — fixed, stacked vertically below the top bar */
            .menu-left {
              top: 88px;
              left: 24px;
              width: 140px;
              z-index: 3;
            }

            /* Right tile feed — scrolls; pushed further right for breathing room */
            .menu-right {
              top: 0;
              left: calc(140px + 24px + 200px);
              right: 24px;
              bottom: 0;
              padding: 88px 0 80px;
            }
            .tile-feed {
              gap: 48px;
            }
            /* Tiles vary in width but cap at the column max so they fit nicely */
            :global(.tile) {
              max-width: 100% !important;
            }

            :global(.menu-link) {
              font-size: 12px !important;
              letter-spacing: 1.2px !important;
              line-height: 1.4;
            }
            :global(.menu-utils) {
              bottom: 60px;
              left: 24px;
              gap: 14px;
            }
            :global(.menu-util-btn svg) {
              width: 20px;
              height: 20px;
            }
            /* Tile title now inherits the unified label spec at all
               breakpoints — only nudge the gap above on tablet. */
            :global(.tile-title) {
              margin-top: 12px;
            }
          }

          /* Phone — 2-column menu: nav rail on the left, tile feed on the
             right. Rail is kept narrow so the journal column still gets
             real estate. */
          @media (max-width: 600px) {
            :global(.menu-logo) { top: 16px; left: var(--gutter); }
            :global(.menu-close) { top: 16px; right: var(--gutter); }

            .menu-left {
              top: 76px;
              left: var(--gutter);
              right: auto;
              width: 96px;
            }
            .menu-left :global(nav) {
              flex-direction: column !important;
              gap: 14px !important;
            }

            .menu-right {
              top: 0;
              /* Original phone offset (no shift). The previous +60 px
                 nudge shrank the column too much, squashing the
                 cards — left at the pre-shift position so tiles
                 keep their previous pixel sizes. */
              left: calc(var(--gutter) + 96px + 32px);
              right: var(--gutter);
              bottom: 0;
              /* Match HOME's top edge in the left rail (menu-left top: 76px)
                 so the first tile starts on the same baseline as the first
                 nav link. */
              padding: 76px 0 100px;
            }
            /* Keep the inline width-% per tile so each journal renders at
               its own ARTICLES.w * 0.85% — varied widths give the feed its
               editorial rhythm. We just override the original aspect / radius. */
            :global(.tile-img) {
              aspect-ratio: 16 / 10;
              border-radius: 3px;
            }
            /* Phone — pin the tile title to the global label spec
               (mono 10 px, 1 px letter-spacing, uppercase, muted)
               so it reads as a caption rather than a headline under
               the smaller cards. !important to beat any inherited
               styles from p / agent-mode rules. */
            :global(.tile-title) {
              font-size: 10px !important;
              line-height: 1.4 !important;
              letter-spacing: 1px !important;
              font-weight: 400 !important;
              margin-top: 10px;
              opacity: 0.7;
            }
            .tile-feed {
              gap: 40px;
              /* Desktop reserves a 100 px right margin to keep the feed
                 inside a 560 px lane on a wide menu. On phone that
                 margin kills two thirds of the column width — drop it
                 so the tiles can actually use the space. */
              margin-right: 0;
              max-width: none;
            }

            :global(.menu-utils) {
              left: var(--gutter);
              bottom: 32px;
              gap: 12px;
            }
            :global(.menu-link) { font-size: 11px !important; }
          }

          /* Smaller navbar wordmark on mobile */
          :global(.nav-wordmark svg) {
            width: 92px;
            height: auto;
          }
          @media (max-width: 768px) {
            /* Mobile nav: a 3-column layout — logo left, centred wordmark,
               hamburger right. The wordmark uses the same showLogo scroll
               trigger as desktop: invisible above the first fold, fades in
               once the user scrolls past it. Symmetric var(--gutter) padding
               keeps the logo and hamburger at the same inset from the edges. */
            :global(.aura-nav) {
              grid-template-columns: auto 1fr auto !important;
              padding-left: var(--gutter) !important;
              padding-right: var(--gutter) !important;
            }
            :global(.aura-nav) > :global(a):first-child {
              justify-self: start !important;
            }
            :global(.nav-wordmark) {
              justify-self: center !important;
            }
            /* Smaller wordmark on mobile so it fits between the logo and the
               hamburger at narrower viewports. */
            :global(.nav-wordmark svg) {
              width: 72px;
            }
            :global(.aura-nav) > :global(button) {
              justify-self: end !important;
              padding-right: 0 !important;
            }
          }
        `}</style>
      </div>

      {/* Bottom blur band — a thin strip at the very bottom of the
          viewport that softens the cards just before they scroll off-
          screen. Rendered as a SIBLING of .menu-overlay so position:
          fixed isn't trapped by .menu-overlay's transform, and so it
          spans the full viewport width (no hard left seam where the
          menu panel meets the page background). Visibility tracks
          menuOpen via inline opacity. */}
      <div
        className="tile-feed-vignette"
        aria-hidden
        style={{
          opacity: menuOpen ? 1 : 0,
          pointerEvents: 'none',
          transition: 'opacity var(--dur-base) var(--ease)',
          /* Inline because styled-jsx silently drops these declarations
             from the emitted rule on this codebase / build. Inline
             always survives. */
          backdropFilter: 'blur(28px) saturate(1.05)',
          WebkitBackdropFilter: 'blur(28px) saturate(1.05)',
        }}
      />
    </>
  )
}
