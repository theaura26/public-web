'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TABS } from '@/lib/site-nav'
import { useMode } from './ModeProvider'
import { LogoEmblem } from './Logo'
import ContactModal from './ContactModal'

/* ── Article tiles for the journal slide-out ──
   Mirrors the sitemap of journal pages exactly. Top-level routes
   (/, /reason, /brand, /contact) live in NAV_GROUPS and are
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
  // The complete journal feed, in three runs. Every live tile rides its
  // journal's own banner image; coming-soon tiles render as plain white
  // "COMING SOON" placeholders. Mirror any change in lib/journals.ts.
  //
  // ── New editorials + places (reworked here) ──
  // The masthead of the coffee microsite, and the only tile that is
  // drawn rather than photographed. Composed from the same nine glyphs
  // and the same ring geometry the live circle is built from, so the
  // card and the thing it opens are the same object — see
  // components/coffee/RemarkableCircle.tsx. White among photographs on
  // purpose: it is a diagram, and it should not pretend to be a place.
  { href: '/regenerative-coffee', title: 'Regenerative Coffee',          size: 'lg', img: '/coffee/aura-remarkable-circle-card.svg' },
  { href: '/mudigere',       title: 'Guests of the Mountain',             size: 'lg', img: '/aura-mudigere.jpg', video: '/aura-mudigere.mp4' },
  { href: '/herd',           title: 'Ecosystem Engineers',                size: 'sm', img: '/herd/images/aura-relationship2.jpg', video: '/herd/videos/aura-relationship2.mp4' },
  { href: '/circular',       title: 'Circular Intelligence',              size: 'sm', img: '/circular/images/aura-shed.jpg', video: '/circular/videos/aura-shed.mp4' },
  { href: '/shade',          title: 'The Light Instrument',               size: 'lg', img: '/shade/images/aura-tree-canopy-lookup.jpg', video: '/shade/videos/aura-tree-canopy-lookup.mp4' },
  { href: '/ecology',        title: 'The Health Index',                  size: 'sm', img: '/ecology/images/aura-forest-floor-seedling.jpg', video: '/ecology/videos/aura-forest-floor-seedling.mp4' },
  { href: '/ohara',          title: 'Asa. Niwa.',                         size: 'lg', img: '/ohara/images/aura-header.jpg', video: '/ohara/videos/aura-header.mp4' },
  { href: '/artistry',       title: 'Code Meets Clay.',                   size: 'sm', img: '/aura-artistry.jpg', video: '/aura-artistry.mp4' },
  // ── Live journals (published on theaura.life) ──
  { href: '/wisdom',         title: 'Moral Spine',                        size: 'lg', img: '/journals/wisdom/aura-moral-spine.jpg' },
  { href: '/living-systems', title: 'Living Systems',                     size: 'sm', img: '/journals/living-systems/aura-living-systems.jpg' },
  { href: '/coffee',         title: 'Our Bean Story',                      size: 'sm', img: '/journals/coffee/aura-our-coffee-story.jpg' },
  { href: '/rta',            title: 'Rta',                                size: 'lg', img: '/journals/rta/aura-rta.jpg' },
  { href: '/fermentation',   title: 'Fermentation',                       size: 'sm', img: '/journals/fermentation/aura-fermentation.jpg' },
  { href: '/land',           title: 'The Land',                           size: 'lg', img: '/journals/land/aura-the-land.jpg' },
  { href: '/biodynamic',     title: 'A Living Organism',                    size: 'sm', img: '/journals/biodynamic/aura-biodynamic.jpg', video: '/journals/biodynamic/aura-biodynamic.mp4' },
  { href: '/residency',      title: 'Monastic Polymaths',                 size: 'sm', img: '/journals/residency/aura-monastic-polymath.jpg' },
  // ── Coming soon — not yet published. The journal's own image runs
  //    dimmed + desaturated behind a "COMING SOON" label (mirrors the
  //    live site, not a blank card). ──
  { href: '/idea',           title: 'The 1000 Year Idea',                 size: 'lg', comingSoon: true, img: '/aura-idea.jpg' },
  { href: '/vedic',          title: 'Vedic Farming',                      size: 'sm', comingSoon: true, img: '/aura-vedic.jpg' },
  { href: '/areca',          title: 'The Sentinel Palm',                  size: 'sm', comingSoon: true, img: '/aura-mudigere-landscape.jpg' },
  { href: '/pepper',         title: 'Malabar Pepper',                     size: 'lg', comingSoon: true, img: '/journals/fermentation/aura-pepper.jpg' },
  { href: '/provenance',     title: 'Provenance',                         size: 'sm', comingSoon: true, img: '/aura-provenance.jpg' },
  { href: '/regenerative-life/sanctuary-and-stay',      title: 'Sanctuary',                          size: 'lg', comingSoon: true, img: '/aura-sanctuary.jpg' },
  /* Commissioned, not yet written. No image on purpose — these render
     on a flat grey plate rather than borrowing a photograph that is
     not theirs. */
  { href: '/bug-hotels', title: 'Bug Hotels', size: 'sm', img: '/aura-placeholder.svg' },
  { href: '/pollinators', title: 'Pollinators', size: 'lg', img: '/aura-placeholder.svg' },
  { href: '/forest-islands', title: 'Forest Islands', size: 'lg', img: '/aura-placeholder.svg' },
  { href: '/land-spirit-soul', title: 'Land, Spirit, Soul',                size: 'sm', img: '/aura-placeholder.svg' },
]

/* ── The menu's information architecture ──────────────────────────
   Five groups, one open at a time. `off` is deliberately switched off
   (Shop, until there is something to sell); `soon` is a real
   destination that has no page yet. Both render unclickable — the
   difference is that one is a decision and the other is a backlog. */
/** A group is either an accordion (has `items`) or a plain link (has
 *  `href`). Home is the only link — it has nothing to expand into. */



const INSTAGRAM_URL = 'https://www.instagram.com/theaura.life/'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  /* True only on a device that really hovers. Touch browsers
     synthesise mouseenter on tap, which would open a group on the same
     gesture that is trying to close one. */
  const canHoverRef = useRef(false)
  /* Hover intent: sweeping the cursor down the list must not flick
     three panels open on the way past. */
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* Which accordion group is open — one at a time. `null` means the
     reader has not chosen, so the menu follows the route and opens
     where they already are; `''` means they closed them all. Derived
     rather than written in an effect, which would cascade a render. */
  const [openGroup, setOpenGroup] = useState<string | null>(null)

  useEffect(() => {
    canHoverRef.current = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    return () => { if (hoverTimer.current) clearTimeout(hoverTimer.current) }
  }, [])

  /* Inline contact modal — opened by the /mudigere "Contact
     us" nav link instead of routing to /contact, so the architect
     stays on the briefing page while writing. */
  const [contactOpen, setContactOpen] = useState(false)
  const [showLogo, setShowLogo] = useState(false)
  /* Lazy-mount gate for the tile-feed media. Browsers eagerly fetch
     images and sniff video metadata even inside a `position: fixed`
     panel parked at `right: -100vw`, because they can’t predict when
     a CSS-positioned element will enter the viewport. Setting
     `loading="lazy"` + `preload="none"` on the elements is not
     enough — Chrome still spends ~25-30 MB on Navbar media on every
     page load. Solution: don’t put the heavy children in the DOM
     until the user actually opens the menu. Stays true thereafter so
     the feed isn’t torn down + reseeded on every reopen. */
  const [hasOpenedMenu, setHasOpenedMenu] = useState(false)
  const { theme, setTheme, viewMode, setViewMode } = useMode()
  const pathname = usePathname()

  /* The open menu is announced on <body> so anything else fixed to the
     viewport can stand down while it is up. Same idiom the coffee
     sub-nav already uses for its own bar. */
  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])
  /* The section on show: whatever the reader last pointed at, and
     failing that whichever one covers the page they are on, and failing
     that the first. Derived rather than stored, so it cannot fall out of
     step with the route. */
  /* Always opens on the first section. Opening on whichever section
     covered the current route meant the menu looked different every
     time it was opened, and a reader cannot learn a shape that keeps
     moving. `openGroup` is what the reader has pointed at since. */
  const activeSection = openGroup ?? TABS[0].id
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
  // /mudigere used to render a stripped "briefing" header — no home links,
  // and a "Contact us" button in place of the menu. It now uses the standard
  // header. Set this to `pathname === '/mudigere'` to restore the briefing nav.
  const isMudigereBriefing = false
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
  // (Disable the setState-in-effect lint here — this is a legit
  // one-way arming flag, not a cascading render path.)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (menuOpen) setHasOpenedMenu(true) }, [menuOpen])

  // Close menu on route change (legit external-state sync — pathname
  // is the external system, the menu reacts to it).
  // eslint-disable-next-line react-hooks/set-state-in-effect
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
    // Wait a frame so layout is settled before we read DOM offsets.
    //
    // Why offsetTop and not `scrollHeight / 3`: the .menu-right scroll
    // container carries asymmetric padding (76 px top / 100 px bottom
    // on phones) that lives INSIDE the scrollable area. scrollHeight
    // folds that 176 px of padding into the total, so dividing by 3
    // overshoots one cycle's true content height by ~58 px — landing
    // the seeded position roughly 58 px past the canonical first
    // tile, which on phones reads as a partial tile bleeding above
    // the rail's top edge (the "red line" the menu logo + nav links
    // sit on).
    //
    // Instead, measure the cycle height directly: the distance from
    // cycle 0's first tile to cycle 1's first tile is exactly one
    // cycle of content, independent of any container padding.
    const tilesPerCycle = ARTICLES.length
    const computeCycleH = () => {
      const firstTile = tiles[0]
      const middleFirstTile = tiles[tilesPerCycle]
      if (!firstTile || !middleFirstTile) return 0
      return middleFirstTile.offsetTop - firstTile.offsetTop
    }
    let seeded = false
    let cycleH = 0
    const seedScroll = () => {
      cycleH = computeCycleH()
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
      // Re-read on every tick: tile heights can shift as lazy media
      // resolves (videos swap their poster in, fonts settle), which
      // changes the per-cycle offset. Using the same offsetTop
      // measurement here keeps teleport boundaries aligned with the
      // seed value — otherwise a stale scrollHeight/3 estimate would
      // teleport to a slightly different position than the seed and
      // drift the visible top each cycle.
      cycleH = computeCycleH() || cycleH
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
        {/* Left — rotating symbol (centred in the 10vw rail). On
            /mudigere the architect’s briefing is meant to be
            a closed loop — no clickable home affordance, so the
            symbol renders as a plain span instead of a Link. */}
        {isMudigereBriefing ? (
          <span style={{ color: 'var(--text)', justifySelf: 'center', display: 'inline-flex', alignItems: 'center' }} aria-label="Aura">
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
          </span>
        ) : (
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
        )}

        {/* Center — full wordmark slides in past the first fold.
            Absolutely positioned at viewport centre rather than
            grid-centred so the wordmark stays on the true horizontal
            midline even when the left / right grid cells have
            different content widths (e.g. on /mudigere where
            the right-side "Contact us" label is wider than the left
            logo emblem). The translate composes vertical centre +
            the showLogo entry slide. */}
        {/* On /mudigere the wordmark also drops its link —
            the architect should have no nav-driven escape from the
            briefing; the Contact us button is the only exit. */}
        {isMudigereBriefing ? (
          <span
            aria-label="Aura"
            className="nav-wordmark"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              color: 'var(--text)',
              display: 'inline-flex',
              alignItems: 'center',
              opacity: showLogo ? 1 : 0,
              transform: showLogo
                ? 'translate(-50%, calc(-50% - 2px))'
                : 'translate(-50%, calc(-50% - 12px))',
              transition: 'opacity var(--dur-slow) var(--ease-out), transform var(--dur-slow) var(--ease-out)',
              pointerEvents: 'none',
            }}
          >
            <LogoEmblem size={75} />
          </span>
        ) : (
          <Link
            href="/"
            aria-label="Aura — home"
            className="no-underline nav-wordmark"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              color: 'var(--text)',
              display: 'inline-flex',
              alignItems: 'center',
              opacity: showLogo ? 1 : 0,
              transform: showLogo
                ? 'translate(-50%, calc(-50% - 2px))'
                : 'translate(-50%, calc(-50% - 12px))',
              transition: 'opacity var(--dur-slow) var(--ease-out), transform var(--dur-slow) var(--ease-out)',
              pointerEvents: showLogo ? 'auto' : 'none',
            }}
          >
            <LogoEmblem size={75} />
          </Link>
        )}

        {/* Right — hamburger on every page EXCEPT the unlisted
            /mudigere briefing, which swaps it for a "Contact
            us" mailto chip so architects landing there have a single,
            obvious next step (and the hidden journal menu stays
            hidden for that audience). */}
        {isMudigereBriefing ? (
          /* Plain text button — reuses the existing `.label`
             typography token (DM Mono · 11 px · 1 px tracking ·
             uppercase) so the nav CTA reads as part of the kit, not
             a bespoke chip. Sits flush at the right gutter edge.
             Opens the ContactModal (mounted at the end of the
             component tree) instead of routing to /contact, so the
             architect stays on the briefing while writing. */
          <button
            type="button"
            data-attr="nav-contact"
            onClick={() => setContactOpen(true)}
            className="label mudigere-nav-cta"
            style={{
              /* Pin to col 3 explicitly: the wordmark moved to
                 `position: absolute` so it no longer occupies col 2,
                 and a button placed second in the DOM would otherwise
                 auto-flow into col 2. */
              gridColumnStart: 3,
              justifySelf: 'end',
              marginRight: 'var(--gutter)',
              padding: 0,
              color: 'var(--text)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              textAlign: 'right',
            }}
          >
            Contact us
          </button>
        ) : (
          <button
            data-attr="nav-menu-toggle"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(v => !v)}
            /* 44×44 hit area meets WCAG 2.5.8 minimum touch target. The visual
               ink (two 22px bars) sits centred inside the larger pad area. */
            style={{
              /* Pin to col 3 explicitly. The center wordmark was moved
                 to `position: absolute` in the mudigere refactor,
                 so it no longer occupies grid col 2 — and a button
                 placed second in the DOM auto-flows into col 2 (the
                 wide middle) instead of col 3 (the right rail). The
                 /mudigere Contact-us button already has this
                 pin; the default hamburger needs it too. Without this
                 the hamburger renders dead-centre of the viewport on
                 every non-mudigere page. */
              gridColumnStart: 3,
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
        )}
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
          backdrop-filter can’t see through. Animating `right` keeps the
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

        <ul className="mn-tabs" role="tablist" aria-label="Sections">
          {TABS.map((sec) => {
            const on = activeSection === sec.id
            return (
              <li key={sec.id}>
                <button
                  type="button"
                  role="tab"
                  id={`mn-tab-${sec.id}`}
                  aria-selected={on}
                  aria-controls={`mn-panel-${sec.id}`}
                  tabIndex={on ? 0 : -1}
                  className={`mn-tab ${on ? 'is-on' : ''}`}
                  onMouseEnter={() => {
                    if (!canHoverRef.current) return
                    if (hoverTimer.current) clearTimeout(hoverTimer.current)
                    hoverTimer.current = setTimeout(() => setOpenGroup(sec.id), 90)
                  }}
                  onMouseLeave={() => { if (hoverTimer.current) clearTimeout(hoverTimer.current) }}
                  onFocus={() => setOpenGroup(sec.id)}
                  onClick={() => setOpenGroup(sec.id)}
                  onKeyDown={(e) => {
                    /* Arrows walk the row, which is what a tablist
                       promises the moment it calls itself one. */
                    const i = TABS.findIndex((x) => x.id === activeSection)
                    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                      e.preventDefault()
                      const next = e.key === 'ArrowRight'
                        ? (i + 1) % TABS.length
                        : (i - 1 + TABS.length) % TABS.length
                      setOpenGroup(TABS[next].id)
                      document.getElementById(`mn-tab-${TABS[next].id}`)?.focus()
                    }
                  }}
                >
                  {sec.label}
                </button>
              </li>
            )
          })}
        </ul>

        {/* Left — the five sections as a row, and the open one’s
            contents beneath. Hovering a section swaps the panel; the
            reader never has to click to look. */}
        <aside className="menu-left">
          <nav className="mn" aria-label="Main">

            {TABS.map((sec) => {
              const on = activeSection === sec.id
              return (
                <div
                  key={sec.id}
                  id={`mn-panel-${sec.id}`}
                  role="tabpanel"
                  aria-labelledby={`mn-tab-${sec.id}`}
                  hidden={!on}
                  className="mn-panel"
                >
                  <ul className="mn-items">
                    {sec.items.map((item) => (
                      <li
                        key={item.href + item.label}
                        className={`mn-row ${item.children ? 'has-more' : ''}`}
                      >
                        {/* Something announced but not yet a place is
                            plain text, not a dead link — the marker says
                            so, and there is nothing to click through to. */}
                        {item.disabled ? (
                          <span className="mn-leaf is-soon" aria-disabled>
                            {item.label}
                          </span>
                        ) : (
                          <Link
                            href={item.href}
                            className={`mn-leaf ${pathname === item.href ? 'is-on' : ''}`}
                            aria-current={pathname === item.href ? 'page' : undefined}
                            onClick={() => setMenuOpen(false)}
                            data-attr={`menu-link:${item.href}`}
                          >
                            {item.label}
                          </Link>
                        )}

                        {item.children && (
                          /* The tier beneath. Open on hover, and on focus
                             too — a layer a keyboard cannot reach is a
                             layer that is not there. */
                          <div className="mn-sub">
                            <ul className="mn-sub-in">
                            {item.children.map((child) => (
                              <li key={child.href + child.label}>
                                {child.disabled ? (
                                  <span className="mn-sub-leaf is-soon" aria-disabled>
                                    {child.label}
                                  </span>
                                ) : (
                                  <Link
                                    href={child.href}
                                    className={`mn-sub-leaf ${pathname === child.href ? 'is-on' : ''}`}
                                    aria-current={pathname === child.href ? 'page' : undefined}
                                    onClick={() => setMenuOpen(false)}
                                    data-attr={`menu-link:${child.href}`}
                                  >
                                    {child.label}
                                  </Link>
                                )}
                              </li>
                            ))}
                            </ul>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </nav>

        </aside>

        {/* Now, reached as it should be — the thing that is happening,
            not an item in a list of subjects. Bottom-left, where the
            panel’s other standing marks sit. */}
        <div className="menu-corner">
          <Link
            href="/now"
            className="mg-live"
            onClick={() => setMenuOpen(false)}
            data-attr="menu-link:/now"
          >
            Now
            <span className="mg-dot" aria-hidden />
          </Link>
          {/* Contact is not a subject the site is about; it is how you
              reach a person. It sits with the standing marks rather than
              inside a list of things to read. */}
          <Link
            href="/contact"
            className="mn-corner-link"
            onClick={() => setMenuOpen(false)}
            data-attr="menu-link:/contact"
          >
            Contact Us
          </Link>
          {/* Announced, not visitable — there is no page behind it yet.
              A span rather than a Link, so it cannot be clicked or
              focused, matching how the soon leaves behave. */}
          <span className="mn-corner-link is-soon" aria-disabled>
            Living Index
            <span className="mn-soon-pill">Coming soon</span>
          </span>
        </div>

        {/* Bottom-left utilities: theme toggle + view-mode toggle + Instagram */}
        <div className="menu-utils">
          <button
            type="button"
            data-attr="theme-toggle"
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
            the boundary so the feed reads as endless.

            Agent view skips the infinite-scroll trick (there is no
            scroll teleport — the feed just stacks as a list) and
            renders one canonical cycle, otherwise the same journal
            title repeats 3× in the markdown view. */}
        <section className="menu-right" ref={scrollRef}>
          <div className="tile-feed">
            {hasOpenedMenu && (isAgent ? [0] : [0, 1, 2]).flatMap(cycle =>
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
                    data-noimg={!a.img && !a.video ? 'true' : undefined}
                    /* Some coming-soon entries have no page behind them yet —
                       never prefetch a route that would 404. */
                    prefetch={a.comingSoon ? false : undefined}
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
                    <p className="label tile-title">{a.title}</p>
                  </Link>
                )
              })
            )}
          </div>
        </section>


        <style jsx>{`
          :global(.menu-overlay) { width: 90vw; color: var(--contrast-text); }
          :global(.menu-backdrop) { display: flex; align-items: stretch; }
          /* ── the accordion ──────────────────────────────────────
             Five groups, one open. The open one is marked by a 2px rule
             that slides out in front of it — no chevrons. Panels animate
             on grid-template-rows so nothing has to be measured. */
          .mg { display: flex; flex-direction: column; }
          .mg-grp { display: flex; flex-direction: column; }

          :global(.mg-btn-link) {
            font-family: var(--font-grotesque), sans-serif;
            font-weight: 400;
            font-size: clamp(22px, 3vw, 32px);
            line-height: 1.15; letter-spacing: -0.03em;
            color: var(--contrast-text);
            text-decoration: none; display: block;
            padding: 12px 0;
            transition: color var(--dur-base) var(--ease);
          }
          :global(.mg-btn-link:hover) { color: var(--brand-accent); }

          .mg-btn {
            appearance: none; background: none; border: 0;
            padding: 12px 0; width: 100%;
            font-family: var(--font-grotesque), sans-serif;
            font-weight: 400;
            font-size: clamp(22px, 3vw, 32px);
            line-height: 1.15; letter-spacing: -0.03em;
            color: var(--contrast-text);
            text-align: left; cursor: pointer;
            display: flex; align-items: center; flex-wrap: wrap;
            transition: color var(--dur-base) var(--ease);
          }
          .mg-btn:hover { color: var(--brand-accent); }
          .mg-btn:focus-visible {
            outline: 2px solid var(--brand-accent); outline-offset: 3px;
          }
          @media (max-width: 900px) {
            .mg-btn, :global(.mg-btn-link), :global(.mg-live) { font-size: 24px; }
            :global(.mg-item) { font-size: 12px; }
          }
          @media (max-width: 600px) {
            .mg-btn, :global(.mg-btn-link), :global(.mg-live) { font-size: 21px; }
            :global(.mg-item) { font-size: 11px; }
          }
          .mg-note {
            margin-left: 10px;
            font-family: var(--font-mono), monospace;
            font-size: 8.5px; letter-spacing: 0.8px; text-transform: uppercase;
            color: var(--brand-accent); white-space: nowrap;
            /* wraps to its own line rather than clipping the group name */
            flex: 0 0 auto;
          }

          .mg-panel {
            display: grid; grid-template-rows: 0fr;
            transition: grid-template-rows var(--dur-slow) var(--ease-out);
          }
          .mg-grp[data-open='true'] .mg-panel { grid-template-rows: 1fr; }
          .mg-panel-in { overflow: hidden; }

          .mg-items,
          /* ── sections ──────────────────────────────────────────
             A row of five, and the open one’s contents underneath. The
             row is set in mono because it labels the panel rather than
             being read as prose; the contents are Bricolage because they
             are the names of things. */
          .mn { display: flex; flex-direction: column; gap: 34px; }
          /* Across the top of the whole panel, not inside the left
             column — five section names will not sit in a 345px rail,
             and the row is a header for both columns rather than for
             one of them. */
          .mn-tabs {
            position: absolute;
            top: 22px;
            left: var(--gutter);
            right: 84px;
            z-index: 3;
            list-style: none; margin: 0; padding: 0;
            display: flex; flex-wrap: wrap; gap: 30px;
          }
          .mn-tab {
            background: none; border: 0; padding: 4px 0; cursor: pointer;
            /* The site's one hover affordance: a brand-accent underline,
               inherited from globals.css rather than reinvented here.
               The selected tab uses the same underline held on, so hover
               and selection never draw two lines under one word. */
            /* Bricolage rather than mono: these are the names of parts of
               the site, not technical labels, and set small they read as
               a row of places rather than as machine text. */
            /* .p2: grotesque, 14px, normal. The row labels the panel
               rather than titling it, so it takes the secondary body
               role rather than a heading one. */
            font-family: var(--font-grotesque), sans-serif;
            font-size: 14px; font-weight: 400;
            line-height: 1.6; letter-spacing: normal; text-transform: none;
            color: color-mix(in srgb, var(--contrast-text) 55%, transparent);
            text-underline-offset: var(--rule-offset);
            text-decoration-thickness: var(--rule-weight);
            transition: color var(--dur-base) var(--ease),
                        text-decoration-color var(--dur-base) var(--ease);
          }
          .mn-tab:hover { color: var(--contrast-text); }
          .mn-tab.is-on {
            color: var(--contrast-text);
            text-decoration: underline;
            text-decoration-color: var(--brand-accent);
            text-underline-offset: var(--rule-offset);
            text-decoration-thickness: var(--rule-weight);
          }
          .mn-tab:focus-visible { outline: 2px solid var(--brand-accent); outline-offset: 3px; }

          .mn-items { list-style: none; margin: 0; padding: 0; }
          /* A row that has a tier beneath it opens on hover, and on
             focus within, so the keyboard reaches it too. Grid rows
             animate from 0fr to 1fr, which is what lets the list push
             down smoothly without anyone measuring anything. */
          /* One grid row, one wrapper inside it. Collapsing the track
             itself only governs the first row, so a parent with three
             children kept two of them open — the wrapper gives the grid
             a single thing to close. */
          .mn-sub {
            display: grid; grid-template-rows: 0fr;
            opacity: 0;
            transition: grid-template-rows var(--dur-base) var(--ease-out),
                        opacity var(--dur-base) var(--ease);
          }
          .mn-sub-in {
            list-style: none; margin: 0;
            overflow: hidden;
            min-height: 0;
          }
          .mn-row.has-more:hover .mn-sub,
          .mn-row.has-more:focus-within .mn-sub {
            grid-template-rows: 1fr;
            opacity: 1;
          }
          /* Indented, so the tier reads as belonging to the line above
             rather than as a continuation of the list. */
          .mn-sub-in { padding-left: 18px; }
          :global(.mn-sub-leaf) {
            display: block;
            padding: 3px 0;
            font-family: var(--font-mono), monospace;
            font-size: 11px; line-height: 1.5;
            letter-spacing: 0.6px; text-transform: uppercase;
            color: color-mix(in srgb, var(--contrast-text) 62%, transparent);
            text-decoration: none;
          }
          :global(.mn-sub-leaf):hover,
          :global(.mn-sub-leaf).is-on {
            color: var(--contrast-text);
            text-decoration: underline;
            text-decoration-color: var(--brand-accent);
            text-underline-offset: var(--rule-offset);
            text-decoration-thickness: var(--rule-weight);
          }
          :global(.mn-sub-leaf):focus-visible {
            outline: 2px solid var(--brand-accent); outline-offset: 2px;
          }
          @media (prefers-reduced-motion: reduce) {
            .mn-sub { transition: none; }
          }
          .mn-items > li:first-child .mn-group { margin-top: 0; }
          /* :global — .mn-leaf sits on a Link, and styled-jsx cannot put
             its scope class on a component, so a scoped rule here matches
             nothing at all. The symptom is not a wrong style but an
             absent one: these have been rendering at the inherited 16px
             the whole time. Same reason .mn-sub-leaf is global below. */

          :global(.mn-leaf) {
            display: block;
            padding: 5px 0;
            /* h3 from the design system: grotesque, 22–32px, -0.03em,
               1.15. These are sub-headings within the panel, which is
               exactly the role h3 describes. */
            font-family: var(--font-grotesque), sans-serif;
            font-weight: 400;
            font-size: clamp(22px, 3vw, 32px);
            line-height: 1.15; letter-spacing: -0.03em;
            color: var(--contrast-text);
            text-decoration: none;
            transition: opacity var(--dur-base) var(--ease);
          }
          :global(.mn-leaf):hover,
          :global(.mn-leaf).is-on {
            text-decoration: underline;
            text-decoration-color: var(--brand-accent);
            text-underline-offset: var(--rule-offset);
            text-decoration-thickness: var(--rule-weight);
          }

          :global(.mn-leaf):focus-visible { outline: 2px solid var(--brand-accent); outline-offset: 3px; }

          /* The panel changes under the pointer, so it should arrive
             rather than snap. */
          .mn-panel[hidden] { display: none; }
          .mn-panel { animation: mn-fade var(--dur-base) var(--ease-out); }
          @keyframes mn-fade {
            from { opacity: 0; transform: translateY(4px); }
            to   { opacity: 1; transform: none; }
          }
          @media (prefers-reduced-motion: reduce) { .mn-panel { animation: none; } }

          .mg-sub { list-style: none; margin: 0; padding: 0; }
          /* Indented under the group heading, so the hierarchy reads
             without a rule or a bullet. */
          .mg-items {
            padding: 2px 0 16px 18px;
            display: flex; flex-direction: column; gap: 10px;
          }
          .mg-sub {
            margin: 8px 0 2px; padding-left: 13px;
            border-left: 1px solid var(--contrast-border);
            display: flex; flex-direction: column; gap: 8px;
          }

          /* DM Mono, per the type spec: Bricolage carries the groups,
             mono carries the labels under them. */
          :global(.mg-item) {
            font-family: var(--font-mono), monospace;
            font-size: 12px; letter-spacing: 0.9px; text-transform: uppercase;
            line-height: 1.4;
            color: var(--contrast-text-body);
            text-decoration: none; display: inline-flex;
            align-items: baseline; gap: 8px;
            transition: color var(--dur-base) var(--ease);
          }
          :global(.mg-item:hover) { color: var(--brand-accent); }
          :global(.mg-item[data-active='true']) { color: var(--brand-accent); }
          .mg-sub :global(.mg-item) { font-size: 11px; color: var(--contrast-text-muted); }
          .mg-sub :global(.mg-item:hover) { color: var(--brand-accent); }

          /* Switched off, but not dimmed — these read at full weight
             like everything else. They simply do not go anywhere yet,
             which aria-disabled carries for assistive tech. */
          :global(.mg-item.is-off) { cursor: default; }

          /* ── live ──────────────────────────────────────────────
             Sits in the same stack as the groups and is set like them,
             so it reads as another way in rather than a status badge
             bolted to the bottom. The dot carries all the signal. */
          .menu-corner {
            position: absolute;
            left: var(--gutter);
            bottom: 44px;
            z-index: 102;
            display: flex; flex-direction: column;
            align-items: flex-start; gap: 0;
          }
          /* Both columns sit at bottom: 44px, but every mark here carries
             12px of padding for its touch target — which floated the last
             line above the icons opposite. Dropping it on the last one
             lands the two columns on the same bottom edge. */
          .menu-corner > :last-child { padding-bottom: 0; }
          /* h3, the same as Live above it — they are two marks of the
             same standing, not a heading with a footnote. */
          :global(.mn-corner-link) {
            font-family: var(--font-grotesque), sans-serif;
            font-weight: 400;
            font-size: clamp(22px, 3vw, 32px);
            line-height: 1.15; letter-spacing: -0.03em;
            color: var(--contrast-text);
            /* Same box as .mg-live above it, so the three marks step
               evenly and each gets the same touch target. */
            display: inline-flex; align-items: center;
            padding: 12px 0;
            text-decoration: none;
            text-underline-offset: var(--rule-offset);
            text-decoration-thickness: var(--rule-weight);
          }
          /* Underline only, like the leaves. The accent arrives as the
             rule under the word and the word keeps its colour — turning
             the text accent as well was two signals for one hover. */
          :global(.mn-corner-link.is-soon) {
            cursor: default;
            color: color-mix(in srgb, var(--contrast-text) 55%, transparent);
          }
          :global(.mn-corner-link.is-soon):hover { text-decoration: none; }
          :global(.mn-corner-link):not(.is-soon):hover {
            text-decoration-line: underline;
            text-decoration-color: var(--brand-accent);
            /* Longhands, not the shorthand: 'text-decoration: underline'
               resets thickness and offset to initial, so the rule came
               back at the browser default instead of the house weight. */
            text-underline-offset: var(--rule-offset);
            text-decoration-thickness: var(--rule-weight);
          }

          /* Announced, not visitable. Dimmed and inert, with no label —
             the menu says what exists by what it lets you open. */
          :global(.mn-leaf.is-soon),
          :global(.mn-sub-leaf.is-soon) {
            cursor: default;
            color: color-mix(in srgb, var(--contrast-text) 55%, transparent);
          }
          :global(.mn-leaf.is-soon):hover,
          :global(.mn-sub-leaf.is-soon):hover { text-decoration: none; }
          :global(.mg-live) {
            text-decoration: none;
            display: inline-flex; align-items: center; gap: 12px;
            font-family: var(--font-grotesque), sans-serif;
            font-weight: 400;
            font-size: clamp(22px, 3vw, 32px);
            line-height: 1.15; letter-spacing: -0.03em;
            color: var(--contrast-text);
            padding: 12px 0;
          }
          /* Small enough to read as an annotation on the label, not as a
             second line of navigation. */
          :global(.mn-soon-pill) {
            margin-left: 10px;
            display: inline-block;
            /* On the label's baseline, not its middle — the pill reads as
               part of the line it annotates rather than as a badge
               floating beside it. */
            vertical-align: baseline;
            font-family: var(--font-mono), monospace;
            font-size: 10px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            line-height: 1;
            padding: 5px 8px 4px;
            border-radius: 999px;
            border: 1px solid color-mix(in srgb, var(--contrast-text) 28%, transparent);
            color: color-mix(in srgb, var(--contrast-text) 62%, transparent);
          }
          .mg-dot {
            width: 9px; height: 9px; border-radius: 50%; flex: none;
            background: var(--brand-accent);
            animation: mg-pulse 2.6s var(--ease) infinite;
          }
          @keyframes mg-pulse {
            0%, 100% { box-shadow: 0 0 8px 0 var(--brand-accent); opacity: 0.8; }
            50%      { box-shadow: 0 0 16px 3px var(--brand-accent); opacity: 1; }
          }
          @media (prefers-reduced-motion: reduce) {
            .mg-dot { animation: none; }
            .mg-panel { transition: none; }
          }

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
          /* Bottom right, diagonally opposite Live. The panel's own
             controls — theme, view mode, the one outward link — sit out
             of the reading path, at the end of it. */
          :global(.menu-utils) {
            position: absolute;
            bottom: 44px;
            right: var(--gutter);
            /* Top of the panel's stack. Above the tile feed vignette
               (101) and above the feed itself, so these stay crisp and
               clickable whatever scrolls under them. */
            z-index: 120;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 14px;
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
            transition: filter var(--dur-base) var(--ease), transform var(--dur-base) var(--ease);
          }
          /* Hover symbol — vector glyph centred over the photo, hidden
             at rest and revealed on hover. Pure 35 % of the card width
             (no clamp) so the mark scales with the tile — small cards
             get a small mark, large cards get a large one.

             It used to difference-blend, on the theory that inverting
             would make it read against any tone. Difference is precisely
             what fails against a mid-tone: white differenced with a
             mid-grey returns a mid-grey, so contrast collapses and this
             mark’s particle edges turn to speckle. Over the estate
             photography — green, brown, mid-everything — that is most of
             the time.

             So the mark is simply white, and the hover darkens the photo
             beneath it to guarantee it a ground. Predictable on any
             image rather than theoretically clever on some. */
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
            transition: opacity 0.32s var(--ease-out), transform 0.4s var(--ease-spring);
          }
          /* On hover: blur the photo AND scale it just past the clip, so the
             blur has no faded edge (that soft light border read as a vignette).
             The centre glyph fades + scales in over the top. Link wrapper
             doesn’t get the styled-jsx scope class, so the chain is global. */
          :global(.tile:hover .tile-img img:not(.tile-symbol)),
          :global(.tile:hover .tile-img video) {
            /* Darkened as well as blurred, so the white mark always has
               something to sit against. */
            filter: blur(14px) brightness(0.5);
            transform: scale(1.12);
          }
          :global(.tile:hover .tile-img .tile-symbol) {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          /* Coming-soon tiles: muted card, no hover effects, label overlay
             centred on the placeholder. Tile is non-interactive (preventDefault
             on click + tabIndex -1) so all that’s left is the visual treatment. */
          :global(.tile[data-coming-soon="true"]) {
            cursor: default;
            pointer-events: auto;
          }
          /* Coming-soon tile — the journal's own image, dimmed and
             desaturated behind a "COMING SOON" label (mirrors the live
             site rather than a blank card). */
          :global(.tile[data-coming-soon="true"] .tile-img) {
            opacity: 0.55;
          }
          /* An unwritten journal has no photograph to dim, so it gets a
             flat grey plate instead of the card surface — visibly a
             placeholder rather than an image that failed to load. */
          :global(.tile[data-noimg="true"] .tile-img) {
            background: var(--contrast-text-muted);
            opacity: 0.22;
          }
          :global(.tile[data-noimg="true"]:hover .tile-img) { opacity: 0.28; }
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
            font-size: 9.5px;
            font-weight: 400;
            letter-spacing: 0.9px;
            text-transform: uppercase;
            color: var(--contrast-text);
            /* One line. Sized to fit the narrow tiles rather than
               wrapping inside them. */
            white-space: nowrap;
            text-align: center;
            max-width: calc(100% - 12px);
            pointer-events: none;
            padding: 5px 9px;
            background: color-mix(in oklab, var(--contrast-bg) 70%, transparent);
            /* A pill, like the one in the corner. A 2px radius on a
               nine-pixel label reads as a clipped rectangle rather than
               as a deliberate shape. */
            border-radius: 999px;
            border: 1px solid color-mix(in srgb, var(--contrast-text) 28%, transparent);
          }
          /* The label role, worn on the element itself. This rule sets
             only what the menu changes about it: the contrast colour the
             overlay needs, the leading, and the gap above. Restating the
             role’s own values here is what let the phone breakpoint below
             drift to 10px under a comment claiming it matched. */
          :global(.tile-title) {
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

          .menu-left::-webkit-scrollbar { display: none; width: 0; }
          .menu-left {
            position: absolute;
            /* The panel logo is hidden at this width, so nothing sits
               above the nav but the close button — it can start higher
               than the marquee line it used to align to. */
            /* Aligned with the marquee strip beside it: both start at
               116px, so the panel reads as one horizon rather than two. */
            top: 116px;
            /* Five pixels left of the gutter the row above uses. The two
               start on the same pixel geometrically, but the items are
               set nearly three times larger and larger type carries more
               apparent side-bearing, so identical geometry reads as an
               indent. Applied to the column rather than the list: this
               column scrolls, and overflow-y auto computes overflow-x to
               auto as well, so a negative margin on the list inside it
               was simply clipped off. */
            left: calc(var(--gutter) - 5px);
            bottom: 210px;                /* clears the utility icon stack */
            width: 345px;
            overflow-y: auto;
            padding-bottom: var(--space-5);
            scrollbar-width: none; -ms-overflow-style: none;
            display: flex;
            flex-direction: column;
            z-index: 2;
          }

          .menu-right {
            position: absolute;
            top: 0;
            /* Clear of the tab row, not just of the 345px rail. The row
               is a header for both columns and floats over this lane;
               its four names run about 422px from the gutter, so a gap
               sized to the rail alone puts a tile behind the last one. */
            left: calc(var(--gutter) + 345px + clamp(150px, 12vw, 210px));
            right: var(--gutter);
            bottom: 0;
            overflow-y: auto;
            /* 32px lines the first tile's top edge up with Home's text
               in the nav — the column’s 20px offset plus the 12px
               padding on a group. Tiles are left-aligned in this
               column, so the close button at the far right is clear. */
            padding: 32px 0 60px;
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
            /* Desktop: extend the vignette wider than the tile-feed
               column so the soft horizon reads as the full bottom
               band, not a narrow strip. Anchor right: 0 and let the
               width carry it leftward; the menu-utils icons sit at
               z-index 102 above the blur so they stay crisp. */
            left: auto;
            right: 0;
            width: 820px;
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
               the menu but with every tile snapping to the lane’s LEFT
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
              top: 148px;
              left: 24px;
              right: 24px;
              /* Full width now that the tile lane is gone from this
                 breakpoint — the 260px rail existed to leave room for it. */
              width: auto;
              bottom: 190px;
              overflow-y: auto;
              z-index: 3;
            }

            /* ── the menu on a phone ──────────────────────────────
               Two columns do not fit. The rail needs 260px and the tab
               row needs about 420px, so on a 375px screen they were
               drawing on top of each other and the tile lane had a
               sliver left over.

               So: one column. The tabs sit below the logo in a row that
               scrolls sideways — the same gesture as the coffee
               microsite’s nav — and the tile feed is gone entirely. A
               phone menu is for getting somewhere, and eighteen
               thumbnails in a 90px gutter helped nobody find anything. */
            .mn-tabs {
              top: 76px;
              left: 0; right: 0;
              padding: 0 24px 14px;
              flex-wrap: nowrap;
              gap: 22px;
              overflow-x: auto;
              -webkit-overflow-scrolling: touch;
              scrollbar-width: none;
              border-bottom: 1px solid rgba(255, 255, 255, 0.12);
              /* The row dissolves at the right edge rather than being
                 chopped, so it reads as scrollable. */
              -webkit-mask-image: linear-gradient(to right, #000 84%, transparent 100%);
              mask-image: linear-gradient(to right, #000 84%, transparent 100%);
            }
            .mn-tabs::-webkit-scrollbar { display: none; }
            .mn-tab { white-space: nowrap; }

            .menu-right { display: none; }
            :global(.tile-feed-vignette) { display: none; }
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
              bottom: 40px;
              right: 24px;
              gap: 12px;
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
            /* Tablet: full-bleed bottom band so the blur reads as a
               single soft horizon. Icons (z-index 102) sit above it
               and remain crisp. */
            :global(.tile-feed-vignette) {
              left: 0;
              right: 0;
              width: auto;
            }
          }

          /* Phone — 2-column menu: nav rail on the left, tile feed on the
             right. Rail is kept narrow so the journal column still gets
             real estate. */
          @media (max-width: 600px) {
            :global(.menu-logo) { top: 16px; left: var(--gutter); }
            :global(.menu-close) { top: 16px; right: var(--gutter); }

            /* Below the tab row, and the full width of the panel — the
               220px rail existed to leave room for a tile lane that no
               longer renders at this breakpoint. */
            .menu-left {
              top: 148px;
              left: var(--gutter);
              right: var(--gutter);
              width: auto;
              bottom: 170px;
              overflow-y: auto;
            }
            .menu-left :global(nav) {
              flex-direction: column !important;
              gap: 14px !important;
            }

            .menu-right { display: none; }
            /* Keep the inline width-% per tile so each journal renders at
               its own ARTICLES.w * 0.85% — varied widths give the feed its
               editorial rhythm. We just override the original aspect / radius. */
            :global(.tile-img) {
              aspect-ratio: 16 / 10;
              border-radius: 3px;
            }
            /* Phone — the label role already sets the type. Only the
               gap above and the weight of the ink change under the
               smaller cards. */
            :global(.tile-title) {
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
              bottom: 32px;
              right: var(--gutter);
              gap: 10px;
            }
            :global(.menu-link) { font-size: 11px !important; }
            /* Phone: full-bleed bottom band — pull the vignette all
               the way across so the blur reads as a single soft
               horizon. The .menu-utils icons (z-index 102) sit above
               the blur and remain crisp / clickable. */
            :global(.tile-feed-vignette) {
              left: 0;
              right: 0;
              width: auto;
            }
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
          fixed isn’t trapped by .menu-overlay’s transform, and so it
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

      {/* Contact modal — opened by the /mudigere "Contact us"
          button. Mounted here so it’s a sibling of the nav and lives
          above the page-vignette (z-index 100 vs 40). */}
      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        defaultTopic="general"
      />
    </>
  )
}
