'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMode } from './ModeProvider'
import { LogoEmblem } from './Logo'

/* ── Article tiles for the journal slide-out ──
   Titles match the actual <ArticleHero> on each page.
   Each tile: width % of the right column (varied), align (left|right|center).
   All tiles render at 16:9. Variation creates editorial rhythm. */
const ARTICLES: { href: string; title: string; w: number; align: 'left' | 'right' | 'center' }[] = [
  { href: '/idea',           title: 'The 1000 Year Idea',               w: 92, align: 'left'   },
  { href: '/wisdom',         title: 'Ancient Wisdom',                   w: 56, align: 'right'  },
  { href: '/rta',            title: 'Ṛta',                              w: 50, align: 'left'   },
  { href: '/mudigere',       title: 'Mudigere — Bhoomi · Aaranya',      w: 84, align: 'center' },
  { href: '/ohara',          title: 'Asa · Niwa',                       w: 62, align: 'right'  },
  { href: '/munduk',         title: 'Munduk — the third sanctuary.',    w: 70, align: 'left'   },
  { href: '/daylesford',     title: 'Daylesford — still forming.',      w: 76, align: 'right'  },
  { href: '/sanctuary',      title: 'Guests of the mountain.',          w: 88, align: 'left'   },
  { href: '/agroculture',    title: 'The land is the lab.',             w: 60, align: 'center' },
  { href: '/artistry',       title: 'Code meets clay.',                 w: 72, align: 'right'  },
  { href: '/spaces',         title: 'Place, not programme.',            w: 54, align: 'left'   },
  { href: '/residency',      title: 'Monastic polymaths. Crazy misfits.', w: 92, align: 'center' },
  { href: '/labs',           title: 'Earth up. Not top down.',          w: 64, align: 'left'   },
  { href: '/provenance',     title: 'Cherry to cup. On chain.',         w: 78, align: 'right'  },
  { href: '/fermentation',   title: 'Three disciplines, one precision.', w: 58, align: 'center' },
  { href: '/coffee',         title: 'Six Lots, One Appellation.',       w: 86, align: 'left'   },
  { href: '/pepper',         title: 'Malabar black gold.',              w: 52, align: 'right'  },
  { href: '/areca',          title: 'The sentinel palm.',               w: 70, align: 'left'   },
  { href: '/biodynamic',     title: 'The farm as organism.',            w: 80, align: 'center' },
  { href: '/vedic',          title: 'Older than its study.',            w: 58, align: 'right'  },
  { href: '/living-systems', title: 'Herd, hive, canopy.',              w: 90, align: 'left'   },
  { href: '/plantation',     title: 'The standard, not the claim.',     w: 66, align: 'right'  },
  { href: '/journal',        title: 'Every day, verified.',             w: 74, align: 'left'   },
  { href: '/land',           title: 'The Land',                         w: 100, align: 'center'},
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
  const { setTheme, viewMode } = useMode()
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

  // Slide the full wordmark in once the user scrolls past the first fold
  useEffect(() => {
    const onScroll = () => {
      const threshold = window.innerHeight * 0.7
      setShowLogo(window.scrollY > threshold)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

  // Parallax — translate tiles based on their position within the scroll container
  useEffect(() => {
    if (!menuOpen) return
    const el = scrollRef.current
    if (!el) return
    let raf = 0
    const update = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const containerH = el.clientHeight
        tileRefs.current.forEach((tile, i) => {
          if (!tile) return
          const r = tile.getBoundingClientRect()
          const cr = el.getBoundingClientRect()
          // tile center relative to container, normalized to [-1, 1]
          const center = (r.top + r.height / 2) - cr.top
          const p = (center / containerH - 0.5) * 2
          // alternate parallax direction by index for variety
          const dir = i % 2 === 0 ? 1 : -1
          const shift = -p * 28 * dir
          tile.style.transform = `translate3d(0, ${shift}px, 0)`
        })
      })
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [menuOpen])

  const isAgent = viewMode === 'agent'

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          padding: '0 var(--gutter)',
          background: 'var(--bg)',
          height: 56,
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
        }}
      >
        {/* Left — rotating symbol */}
        <Link href="/" className="no-underline" style={{ color: 'var(--text)', justifySelf: 'start', display: 'inline-flex', alignItems: 'center' }}>
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
          className="no-underline"
          style={{
            justifySelf: 'center',
            color: 'var(--text)',
            display: 'inline-flex',
            alignItems: 'center',
            opacity: showLogo ? 1 : 0,
            transform: showLogo ? 'translateY(0)' : 'translateY(-12px)',
            transition: 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: showLogo ? 'auto' : 'none',
          }}
        >
          <LogoEmblem size={92} />
        </Link>

        {/* Right — 2-line hamburger */}
        <button
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(v => !v)}
          style={{
            justifySelf: 'end',
            background: 'none',
            border: 'none',
            padding: '10px 4px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            cursor: 'none',
          }}
        >
          <span style={{ display: 'block', width: 22, height: 1.5, background: 'var(--text)', transition: 'transform 0.25s var(--ease), opacity 0.25s var(--ease)', transform: menuOpen ? 'translateY(3.75px) rotate(45deg)' : 'none' }} />
          <span style={{ display: 'block', width: 22, height: 1.5, background: 'var(--text)', transition: 'transform 0.25s var(--ease), opacity 0.25s var(--ease)', transform: menuOpen ? 'translateY(-3.75px) rotate(-45deg)' : 'none' }} />
        </button>
      </nav>

      {/* Backdrop — white strip with vertical running text */}
      <div
        onClick={() => setMenuOpen(false)}
        className="fixed inset-0 z-40 menu-backdrop"
        style={{
          background: '#ffffff',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s var(--ease)',
          overflow: 'hidden',
        }}
      >
        <div className="menu-marquee" aria-hidden>
          <span>
            {'The Reason is to Restore What Sustains Us · '.repeat(20)}
          </span>
        </div>
      </div>

      {/* Menu panel — 90vw black panel anchored right, on top of nav */}
      <div
        className="menu-overlay fixed right-0 z-50"
        style={{
          top: 0,
          bottom: 0,
          background: '#000000',
          color: '#ffffff',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s var(--ease)',
          overflow: 'hidden',
        }}
      >
        {/* Close X — fixed top-right of panel, never scrolls */}
        <button
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'absolute',
            top: 60,
            right: 'clamp(32px, 4vw, 56px)',
            zIndex: 3,
            background: 'none',
            border: 'none',
            padding: '8px 4px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            cursor: 'none',
            color: '#ffffff',
          }}
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

        {/* Instagram — anchored bottom-left of panel, 60px above bottom */}
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="menu-ig"
          aria-label="Aura on Instagram"
        >
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
          </svg>
        </a>

        {/* Right — scrollable tile feed */}
        <section className="menu-right" ref={scrollRef}>
          <div className="tile-feed">
            {ARTICLES.map((a, i) => (
              <Link
                href={a.href}
                key={a.href}
                onClick={() => setMenuOpen(false)}
                ref={(el) => { tileRefs.current[i] = el }}
                className="tile"
                style={{ width: `${a.w * 0.85}%`, maxWidth: 720 }}
              >
                <div className="tile-img" aria-hidden />
                <p className="tile-title">{a.title}</p>
              </Link>
            ))}
          </div>
        </section>

        <style jsx>{`
          :global(.menu-overlay) { width: 90vw; color: #ffffff; }
          :global(.menu-backdrop) { display: flex; align-items: stretch; }
          :global(.menu-link) {
            font-family: var(--font-mono) !important;
            font-size: 12px !important;
            letter-spacing: 1.5px !important;
            text-transform: uppercase !important;
            line-height: 1.4;
            color: #ffffff;
            text-decoration: none;
            padding: 0;
            transition: opacity 0.2s var(--ease);
            display: block;
          }
          :global(.menu-link:hover) { opacity: 0.7; }
          :global(.menu-ig) {
            position: absolute;
            bottom: 60px;
            left: clamp(40px, 5vw, 96px);
            z-index: 2;
            display: inline-flex;
            align-items: center;
            color: #ffffff;
            text-decoration: none;
            opacity: 1;
            transition: opacity 0.2s var(--ease);
          }
          :global(.menu-ig:hover) { opacity: 0.7; }
          :global(.tile) {
            display: block;
            text-decoration: none;
            color: #ffffff;
            will-change: transform;
            transition: opacity 0.2s var(--ease);
          }
          :global(.tile-img) {
            width: 100%;
            aspect-ratio: 16 / 9;
            background: #d6d6d6;
            border-radius: 2px;
            transition: opacity 0.2s var(--ease);
          }
          :global(.tile:hover .tile-img) { opacity: 0.85; }
          :global(.tile-title) {
            font-family: var(--font-mono);
            font-size: 11px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            line-height: 1.4;
            color: #ffffff;
            margin-top: 16px;
          }
          :global(.menu-marquee) {
            position: absolute;
            top: 0;
            left: 0;
            width: 10vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-transform: uppercase;
            color: #1a1a1a;
            font-family: var(--font-mono);
            font-size: 11px;
            letter-spacing: 2px;
            white-space: nowrap;
            overflow: hidden;
          }
          :global(.menu-marquee span) {
            display: inline-block;
            transform: rotate(-90deg);
            transform-origin: center center;
            white-space: nowrap;
            animation: marquee-scroll 90s linear infinite;
          }
          @keyframes marquee-scroll {
            from { transform: rotate(-90deg) translateX(0); }
            to   { transform: rotate(-90deg) translateX(-50%); }
          }
          .menu-left {
            position: absolute;
            top: 60px;
            left: clamp(40px, 5vw, 96px);
            width: 240px;
            display: flex;
            flex-direction: column;
            z-index: 2;
          }

          .menu-right {
            position: absolute;
            top: 0;
            left: calc(clamp(40px, 5vw, 96px) + 240px + clamp(64px, 8vw, 160px));
            right: 0;
            bottom: 0;
            overflow-y: auto;
            padding: 60px clamp(64px, 7vw, 140px) clamp(80px, 12vh, 140px) 0;
            box-sizing: border-box;
          }

          .tile-feed {
            display: flex;
            flex-direction: column;
            gap: 100px;
            align-items: flex-start;
          }

          @media (max-width: 900px) {
            .menu-left {
              position: static;
              top: auto;
              left: auto;
              width: auto;
              height: auto;
              padding: 64px clamp(24px, 5vw, 56px) 0;
            }
            .menu-right {
              position: static;
              top: auto;
              left: auto;
              right: auto;
              bottom: auto;
              padding: 48px clamp(24px, 5vw, 56px) clamp(80px, 12vh, 140px);
              overflow-y: visible;
            }
            :global(.menu-overlay) {
              overflow-y: auto !important;
            }
          }

          /* Mobile — full-screen overlay, hide marquee strip */
          @media (max-width: 768px) {
            :global(.menu-overlay) { width: 100vw; }
            :global(.menu-marquee) { display: none; }
          }
        `}</style>
      </div>
    </>
  )
}
