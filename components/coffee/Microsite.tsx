'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ScrollHighlight } from '@/components/article/Article'
import { GlyphMark } from './RemarkableCircle'

/* ═══════════════════════════════════════════════════════════════════
   MICROSITE BLOCKS — Regenerative Coffee

   A small kit for the coffee microsite. Not journals: these are
   marketing blocks — a hero that states a proposition, pillar sections
   that hand off to their own page, feature cards, stat rows, and a
   closing invitation.

   Every value is a token from globals.css. No local palette, no local
   type scale. See DESIGN-SYSTEM.md.
═══════════════════════════════════════════════════════════════════ */

/* ── media ──────────────────────────────────────────────────────── */

function Media({
  src, poster, alt, mediaType = 'image',
}: { src: string; poster?: string; alt: string; mediaType?: 'image' | 'video' }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.15 }
    )
    io.observe(v)
    return () => io.disconnect()
  }, [])
  if (mediaType === 'video') {
    return (
      <video ref={ref} className="m-media" muted loop playsInline preload="none"
        poster={poster} aria-label={alt}>
        <source src={src} type="video/mp4" />
      </video>
    )
  }
  return <img className="m-media" src={src} alt={alt} loading="lazy" decoding="async" />
}

/* ── microsite header ───────────────────────────────────────────── */

const NAV = [
  { href: '/regenerative-coffee', label: 'Remarkable Circle' },
  { href: '/regenerative-coffee/biodynamic', label: 'Better Ground' },
  { href: '/regenerative-coffee/transparency', label: 'Transparency' },
  { href: '/regenerative-coffee/flavour', label: 'Flavours' },
]

/**
 * The microsite's local nav — the Apple "iPad Pro | Overview · Tech
 * Specs · Buy" pattern. The site's own navbar stays, made transparent
 * over the black ground; this bar sits beneath it and only appears once
 * the hero is behind the reader. No hamburger: on narrow screens the
 * links scroll horizontally. Type is the .p2 role.
 */
export function MicroNav() {
  const pathname = usePathname()
  /* Peekaboo: the site navbar hides on the way down and comes back the
     moment the reader scrolls up. The sub-nav is persistent — it only
     slides up to sit flush under the viewport top while the main bar
     is away. */
  /* Both bars live below the fold. Past it, the header peekaboos —
     away on the way down, back the moment the reader scrolls up — and
     the sub-nav rides with it. */
  const [below, setBelow] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    let ticking = false
    const read = () => {
      const y = window.scrollY
      const fold = window.innerHeight * 0.85
      setBelow(y > fold)
      const dy = y - last
      /* ignore rubber-banding and sub-pixel jitter */
      if (y > 0 && Math.abs(dy) > 6) {
        setHidden(dy > 0 && y > fold)
        last = y
      } else if (y <= 0) {
        setHidden(false)
        last = y
      }
      ticking = false
    }
    read()
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(read) }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('mn-below', below)
    document.body.classList.toggle('mn-up', hidden)
    return () => {
      document.body.classList.remove('mn-below')
      document.body.classList.remove('mn-up')
    }
  }, [below, hidden])

  return (
    <>
      <nav
        className={`ln ${below ? 'is-below' : ''} ${hidden ? 'is-up' : ''}`}
        aria-label="Regenerative Coffee"
        aria-hidden={!below}
      >
        <div className="ln-w ln-in">
          <div className="ln-scroll">
            {NAV.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`p2 ln-l ${pathname === l.href ? 'is-on' : ''}`}
                aria-current={pathname === l.href ? 'page' : undefined}
              >
                {l.label}
              </Link>
            ))}
            {/* trailing run-off so the last link can clear the CTA */}
            <span className="ln-runoff" aria-hidden />
          </div>

          {/* The CTA sits above the scroller: links pass under it. */}
          <div className="ln-end">
            <Link href={PAGE_HREF.experience} className="p2 ln-cta">
              <span className="ln-cta-long">Attend the Festival</span>
              <span className="ln-cta-short">Attend</span>
            </Link>
          </div>
        </div>
      </nav>

      <style jsx global>{`
        /* Above the fold the header rides transparent on the hero, its
           marks forced light so they read against the black ground.
           Below the fold it becomes the site’s own themed bar — day or
           night — and peekaboos: away on the way down, back on the way up. */
        .aura-nav {
          transition: transform var(--dur-base) var(--ease),
                      background var(--dur-base) var(--ease) !important;
        }

        /* Above the fold only: the bar rides transparent on the hero and
           its marks are forced light. Scoped with :not() rather than
           overridden later: resetting a custom property to the initial
           keyword makes it guaranteed-invalid, which silently erases anything
           painted with it (the hamburger bars, for one). */
        body:not(.mn-below) .aura-nav {
          background: transparent !important;
          box-shadow: none !important;
          --text: #fff;
          --text-body: rgba(255, 255, 255, 0.8);
          --text-muted: rgba(255, 255, 255, 0.6);
          --border: rgba(255, 255, 255, 0.14);
        }
        body:not(.mn-below) .aura-nav .invert-on-light { filter: none !important; }

        /* Below the fold the theme owns the bar entirely — no overrides. */
        /* Peeked away. The site bar carries box-shadow: 0 1px 0 0 var(--bg),
           which is pure white in day mode — with the bar translated off
           screen that shadow lands on y=0 as a white hairline. Kill it
           while it is hidden. */
        body.mn-below.mn-up .aura-nav {
          transform: translateY(-100%) !important;
          box-shadow: none !important;
        }

        /* Liquid glass on the sub-nav — enhancement only. The bar's own
           rule paints a solid fallback first, so browsers without
           backdrop-filter (older Firefox, any engine with it disabled)
           keep a legible bar instead of a transparent one. */
        @supports ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px))) {
          /* doubled class + tag so this outranks the scoped fallback rule */
          nav.ln.ln {
            background:
              linear-gradient(
                to bottom,
                rgba(255, 255, 255, 0.10) 0%,
                rgba(255, 255, 255, 0.03) 42%,
                rgba(255, 255, 255, 0.00) 100%
              ),
              rgba(12, 12, 12, 0.55);
            -webkit-backdrop-filter: blur(22px) saturate(180%) brightness(1.06);
            backdrop-filter: blur(22px) saturate(180%) brightness(1.06);
            box-shadow:
              inset 0 1px 0 0 rgba(255, 255, 255, 0.16),
              inset 0 -1px 0 0 rgba(255, 255, 255, 0.04);
          }
        }
      `}</style>

      <style jsx>{`
        /* Persistent: always on screen. It sits under the main bar, and
           rides up to the viewport top while that bar is hidden. */
        .ln {
          /* Above the chapter backdrop, which is fixed at z-index 0. */
          position: relative; z-index: 1;
          /* 39, deliberately: the hamburger's backdrop is z-40 and the
             site bar and menu panel are z-50. At 40 this bar tied with
             the backdrop, won on DOM order, and showed through the strip
             of backdrop beside the open menu. */
          position: fixed; left: 0; right: 0; z-index: 39;
          height: 56px;
          /* Fallback first: a solid bar every browser can draw. */
          background: rgba(10, 10, 10, 0.94);
          top: var(--nav-h);
          opacity: 0; pointer-events: none;
          transform: translateY(calc(-1 * var(--nav-h)));
          transition: transform var(--dur-base) var(--ease),
                      opacity var(--dur-base) var(--ease);
        }
        /* below the fold it drops into place under the header */
        .ln.is-below { opacity: 1; pointer-events: auto; transform: translateY(0); }
        /* header away — the bar takes the top edge itself */
        .ln.is-below.is-up { transform: translateY(calc(-1 * var(--nav-h))); }

        /* This bar lines up with the navbar above it rather than with
           the article column. The navbar is a 10vw / 1fr / 10vw grid
           with the mark centred in the left rail and the menu button
           centred in the right, so the marks sit 5vw from each edge less
           half their own width. Those two widths are the dependency —
           if either mark is resized, these follow. */
        .ln-w {
          --nav-mark: 32px;
          --nav-burger: 44px;
          width: 100%;
          padding-left: calc(5vw - var(--nav-mark) / 2);
          padding-right: calc(5vw - var(--nav-burger) / 2);
        }
        @media (max-width: 620px) {
          /* The navbar drops its rails on small screens; so does this. */
          .ln-w { padding-left: var(--gutter, 20px); padding-right: var(--gutter, 20px); }
        }

        .ln-in {
          position: relative;
          height: 100%;
          display: flex; align-items: center; gap: clamp(20px, 3vw, 44px);
        }

        .ln-scroll {
          flex: 1 1 auto; min-width: 0;
          display: flex; align-items: center; justify-content: flex-start;
          gap: clamp(22px, 2.8vw, 40px);
          overflow-x: auto; -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          height: 100%;
        }
        .ln-scroll::-webkit-scrollbar { display: none; }
        /* Links dissolve as they run under the CTA. A mask, not a
           painted gradient, so it holds over any ground — the black
           scenes and the clay banner alike. */
        .ln-scroll {
          --ln-cta-space: clamp(96px, 16vw, 172px);
          -webkit-mask-image: linear-gradient(
            to right,
            #000 0,
            #000 calc(100% - var(--ln-cta-space) - 40px),
            transparent calc(100% - var(--ln-cta-space) + 4px)
          );
          mask-image: linear-gradient(
            to right,
            #000 0,
            #000 calc(100% - var(--ln-cta-space) - 40px),
            transparent calc(100% - var(--ln-cta-space) + 4px)
          );
        }
        /* keeps the final link from stopping beneath the CTA */
        .ln-runoff { flex: 0 0 auto; width: var(--ln-cta-space); }

        /* The CTA layer — sits over the scroller on the right. */
        .ln-end {
          position: absolute; right: var(--gutter); top: 0; bottom: 0;
          display: flex; align-items: center;
          pointer-events: none;
        }
        .ln-end > * { pointer-events: auto; }

        :global(.ln-l) {
          position: relative; flex-shrink: 0;
          font-size: 13px;
          display: inline-flex; align-items: center; height: 100%;
          color: rgba(255, 255, 255, 0.72);
          text-decoration: none; white-space: nowrap;
          transition: color var(--dur-base) var(--ease);
        }
        /* No rule under the active tab — it reads as clay, which is enough
           to mark where you are. Hover picks up the same clay. */
        :global(.ln-l):hover { color: var(--brand-accent); }
        :global(.ln-l.is-on) { color: var(--brand-accent); }

        /* :global, because styled-jsx cannot put its scope class on a
           <Link> — the same reason .ln-l is global above. */
        :global(.ln-cta) {
          /* The parent turns pointer events off so the bar's gradient
             mask does not swallow clicks meant for the links beneath it,
             and the child rule was meant to turn them back on. It never
             did: styled-jsx cannot put its scope class on a Link, so the
             rule compiled to a descendant selector carrying the jsx hash
             and matched nothing — this button has been unclickable. Set
             on the class itself, which is already global for exactly
             that reason. */
          pointer-events: auto;
          flex-shrink: 0; cursor: pointer;
          display: inline-flex; align-items: center;
          text-decoration: none; white-space: nowrap;
          font-size: 12px; line-height: 1.3;
          color: #fff; background: var(--brand-accent);
          border: none; border-radius: 999px;
          padding: 7px 16px;
          transition: filter var(--dur-base) var(--ease);
        }
        :global(.ln-cta):hover { filter: brightness(1.1); }
        .ln-cta-short { display: none; }

        @media (max-width: 640px) {
          .ln-cta-long { display: none; }
          .ln-cta-short { display: inline; }
        }
      `}</style>
    </>
  )
}


/* ── arrow link — the site's standard link UI ───────────────────── */

/**
 * The house link: a 22px circled chevron followed by `.label` text.
 * Matches the "Explore Mudigere" control on the homepage. Styles are
 * global on purpose — styled-jsx cannot scope a next/link root.
 */
export function ArrowLink({
  href, children, tone = 'light',
}: { href: string; children: ReactNode; tone?: 'light' | 'ink' }) {
  const external = href.startsWith('mailto:') || href.startsWith('http')
  const inner = (
    <>
      <span className="al-i" aria-hidden>
        <svg viewBox="0 0 24 24" width="11" height="11" fill="none">
          <path d="M5 12h13M12.5 6l6.5 6-6.5 6" stroke="currentColor"
            strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {children}
    </>
  )
  const cls = `label al ${tone === 'ink' ? 'is-ink' : ''}`
  return external
    ? <a className={cls} href={href}>{inner}</a>
    : <Link className={cls} href={href}>{inner}</Link>
}

export function ArrowLinkStyles() {
  return (
    <style jsx global>{`
      .al {
        display: inline-flex; align-items: center; gap: 10px;
        text-decoration: none; color: #fff;
        background: transparent; border: none; padding: 0; margin: 0;
        transition: color var(--dur-base) var(--ease);
      }
      .al.is-ink { color: var(--text); }
      .al .al-i {
        display: inline-flex; align-items: center; justify-content: center;
        width: 22px; height: 22px; border-radius: 50%;
        border: 1px solid rgba(255, 255, 255, 0.7);
        color: inherit; flex-shrink: 0;
        transition: background var(--dur-base) var(--ease),
                    border-color var(--dur-base) var(--ease),
                    color var(--dur-base) var(--ease);
      }
      .al.is-ink .al-i { border-color: var(--border-strong); }
      .al:hover .al-i { background: #fff; border-color: #fff; color: #111; }
      .al.is-ink:hover .al-i {
        background: var(--text); border-color: var(--text); color: var(--bg);
      }
    `}</style>
  )
}

/* ── full-screen panel ──────────────────────────────────────────── */

/**
 * One idea, one screen. Black for now — imagery drops in behind later
 * via `src`, at which point the scrim carries the type instead of the
 * flat ground.
 */
export function Panel({
  id, title, lede, points, href, cta, foot, align = 'left',
  src, poster, mediaType = 'image', alt, children, hero = false,
}: {
  id?: string
  title: string
  /** Page opener — renders the uppercase H1 display role. */
  hero?: boolean
  lede?: string
  points?: string[]
  href?: string
  cta?: string
  foot?: string
  align?: 'left' | 'centre'
  src?: string
  poster?: string
  mediaType?: 'image' | 'video'
  alt?: string
  children?: ReactNode
}) {
  return (
    <section id={id} className={`p ${align === 'centre' ? 'is-c' : ''}`}>
      {src && (
        <div className="p-bg">
          <Media src={src} poster={poster} alt={alt || ''} mediaType={mediaType} />
          <div className="p-scrim" aria-hidden />
        </div>
      )}
      <div className="section-w p-in">
        {hero
          ? <h1 className="p-h is-hero">{title}</h1>
          : <h2 className="p-h">{title}</h2>}
        {lede && <p className="p-lede">{lede}</p>}
        {children}
        {points && (
          <ul className="p-list">
            {points.map((x) => <li key={x}>{x}</li>)}
          </ul>
        )}
        {href && cta && (
          <p className="p-act"><ArrowLink href={href}>{cta}</ArrowLink></p>
        )}
        {foot && <p className="p-foot">{foot}</p>}
      </div>

      <style jsx>{`
        .p {
          position: relative; z-index: 1;
          min-height: 100svh;
          display: flex; align-items: center;
          padding: calc(var(--nav-h) + var(--space-9)) 0 var(--space-9);
          background: transparent; color: #fff;
          overflow: hidden;
        }
        .p-bg { position: absolute; inset: 0; }
        .p-bg :global(.m-media) {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }
        .p-scrim { position: absolute; inset: 0; background: rgba(0, 0, 0, 0.55); }
        .p-in { position: relative; z-index: 1; width: 100%; }
        .is-c .p-in { text-align: center; }


        /* Both headings wear their element's role from globals — h1 for
           the opener, h2 for an interior panel — and set only what is
           local to a dark ground: the colour and the measure.

           :not(.is-hero) is doing real work. A class beats an element
           selector, so an unscoped font-weight of 400 on .p-h sat on top
           of the h1 rule and the opener rendered at book weight and two
           thirds of display size — while the comment above it claimed it
           inherited. Scope anything that is only true of the interior
           heading, or it silently overrides the opener too. */
        .p-h {
          color: #fff; margin: 0; max-width: 22ch;
        }
        .p-h:not(.is-hero) {
          line-height: 1.08;
          max-width: 22ch;
        }
        .p-h.is-hero {
          color: #fff; max-width: 16ch;
          text-wrap: balance;
        }
        .is-c .p-h { max-width: 22ch; margin-inline: auto; }

        .p-lede {
          font-size: clamp(17px, 1.7vw, 22px); line-height: 1.6;
          color: rgba(255, 255, 255, 0.72);
          margin: var(--space-6) 0 0; max-width: 34ch;
          text-wrap: pretty;
        }
        .is-c .p-lede { margin-inline: auto; }

        .p-list {
          list-style: none; padding: 0;
          margin: var(--space-7) 0 0; max-width: 52ch;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
        }
        .is-c .p-list { margin-inline: auto; }
        .p-list li {
          font-size: 15px; line-height: 1.5;
          color: rgba(255, 255, 255, 0.62);
          padding: var(--space-3) 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        }

        .p-act { margin: var(--space-9) 0 0; }
        .is-c .p-act { display: flex; justify-content: center; }

        .p-foot {
          font-family: var(--font-mono), monospace;
          font-size: 11px; line-height: 1.7;
          color: rgba(255, 255, 255, 0.38);
          margin: var(--space-9) 0 0; max-width: 60ch;
        }
        .is-c .p-foot { margin-inline: auto; }
      `}</style>
    </section>
  )
}

/* ── hero ───────────────────────────────────────────────────────── */

export function Hero({
  title, sub, src, poster, mediaType = 'image', alt, ctas = [],
}: {
  title: string
  sub?: string
  src: string
  poster?: string
  mediaType?: 'image' | 'video'
  alt: string
  ctas?: { href: string; label: string }[]
}) {
  return (
    <header className="m-hero">
      <div className="m-hero-bg">
        <Media src={src} poster={poster} alt={alt} mediaType={mediaType} />
        <div className="m-hero-scrim" aria-hidden />
      </div>
      <div className="section-w m-hero-in">
        <h1 className="m-hero-h">{title}</h1>
        {sub && <p className="m-hero-sub">{sub}</p>}
        {ctas.length > 0 && (
          <div className="m-hero-cta">
            {ctas.map((c) => (
              <ArrowLink key={c.href} href={c.href}>{c.label}</ArrowLink>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .m-hero {
          position: relative;
          min-height: min(92svh, 900px);
          display: flex; align-items: flex-end;
          padding-bottom: var(--space-9);
          padding-top: calc(var(--nav-h) + var(--space-9));
          overflow: hidden;
          background: var(--bg);
        }
        .m-hero-bg { position: absolute; inset: 0; }
        .m-hero-bg :global(.m-media) {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }
        .m-hero-scrim {
          position: absolute; inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.82) 0%,
            rgba(0,0,0,0.55) 38%,
            rgba(0,0,0,0.22) 70%,
            rgba(0,0,0,0.35) 100%
          );
        }
        .m-hero-in { position: relative; z-index: 1; }
        .m-hero-h {
          color: #fff; margin: 0;
          max-width: 16ch;
        }
        .m-hero-sub {
          color: #fff; opacity: 0.86;
          font-size: clamp(17px, 2vw, 22px); line-height: 1.55;
          max-width: 46ch; margin: var(--space-5) 0 0;
        }
        .m-hero-cta {
          display: flex; flex-wrap: wrap; gap: var(--space-3);
          margin-top: var(--space-7);
        }
        @media (max-width: 768px) {
          .m-hero { min-height: min(88svh, 720px); padding-bottom: var(--space-9); }
        }
      `}</style>
    </header>
  )
}

/* ── intro ──────────────────────────────────────────────────────── */

export function Intro({
  title, children,
}: { title: string; children: ReactNode }) {
  return (
    <section className="m-intro">
      <div className="section-w">
        <h2 className="m-intro-h">{title}</h2>
        <div className="m-intro-b">{children}</div>
      </div>
      <style jsx>{`
        .m-intro { padding: var(--section-gap) 0 0; background: var(--bg); }
        .m-intro-h { margin: 0; max-width: 20ch; }
        .m-intro-b {
          max-width: 62ch; margin-top: var(--space-6);
          display: flex; flex-direction: column; gap: var(--space-4);
        }
        .m-intro-b :global(p) {
          font-size: clamp(17px, 1.6vw, 20px); line-height: 1.65;
          color: var(--text-body); margin: 0;
        }
        .m-intro-b :global(p:first-child) { color: var(--text); }
      `}</style>
    </section>
  )
}

/* ── pillar — the click-through section ─────────────────────────── */

export function Pillar({
  title, lede, points, src, poster, mediaType = 'image', alt, href, cta, flip = false,
}: {
  title: string
  lede: string
  points?: string[]
  src: string
  poster?: string
  mediaType?: 'image' | 'video'
  alt: string
  href?: string
  cta?: string
  flip?: boolean
}) {
  return (
    <section className={`m-pillar ${flip ? 'is-flip' : ''}`}>
      <div className="section-w m-pillar-in">
        {href ? (
          <Link href={href} className="m-pillar-media" aria-label={cta}>
            <Media src={src} poster={poster} alt={alt} mediaType={mediaType} />
          </Link>
        ) : (
          <div className="m-pillar-media">
            <Media src={src} poster={poster} alt={alt} mediaType={mediaType} />
          </div>
        )}
        <div className="m-pillar-copy">
          <h2 className="m-pillar-h">{title}</h2>
          <p className="m-pillar-lede">{lede}</p>
          {points && (
            <ul className="m-pillar-list">
              {points.map((p) => <li key={p}>{p}</li>)}
            </ul>
          )}
          {href && cta && (
            <p className="m-pillar-act"><ArrowLink href={href} tone="ink">{cta}</ArrowLink></p>
          )}
        </div>
      </div>
      <style jsx>{`
        .m-pillar {
          min-height: 100svh; display: flex; align-items: center;
          padding: calc(var(--nav-h) + var(--space-9)) 0 var(--space-9);
          background: var(--bg);
        }
        .m-pillar-in {
          display: grid; gap: var(--grid-gap); width: 100%;
          grid-template-columns: 1fr 1fr; align-items: center;
        }
        .is-flip .m-pillar-in > :global(:first-child) { order: 2; }
        :global(.m-pillar-media) {
          display: block; overflow: hidden; border-radius: var(--radius-1);
          aspect-ratio: 4 / 5; background: var(--bg-card);
        }
        :global(.m-pillar-media .m-media) {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform var(--dur-slow) var(--ease);
        }
        :global(.m-pillar-media):hover :global(.m-media) { transform: scale(1.03); }
        .m-pillar-h { margin: 0; }
        .m-pillar-act { margin: var(--space-7) 0 0; }
        .m-pillar-lede {
          font-size: clamp(17px, 1.6vw, 20px); line-height: 1.65;
          color: var(--text-body); margin: var(--space-5) 0 0; max-width: 46ch;
        }
        .m-pillar-list {
          list-style: none; padding: 0;
          margin: var(--space-6) 0 0;
          border-top: 1px solid var(--border);
        }
        .m-pillar-list li {
          font-size: 15px; line-height: 1.5; color: var(--text-body);
          padding: var(--space-3) 0;
          border-bottom: 1px solid var(--border);
        }
        @media (max-width: 900px) {
          .m-pillar-in { grid-template-columns: 1fr; gap: var(--space-7); }
          .is-flip .m-pillar-in > :global(:first-child) { order: 0; }
          :global(.m-pillar-media) { aspect-ratio: 3 / 2; }
        }
      `}</style>
    </section>
  )
}

/* ── feature cards ──────────────────────────────────────────────── */

export function Cards({
  title, items,
}: {
  title?: string
  items: { title: string; body: string; src?: string; alt?: string }[]
}) {
  return (
    <section className="m-cards">
      <div className="section-w">
        {title && <h2 className="m-cards-h">{title}</h2>}
        <div className="m-cards-g">
          {items.map((it) => (
            <article key={it.title} className="m-card">
              {it.src && (
                <div className="m-card-m">
                  <img src={it.src} alt={it.alt || ''} loading="lazy" decoding="async" />
                </div>
              )}
              <h3 className="m-card-h">{it.title}</h3>
              <p className="m-card-b">{it.body}</p>
            </article>
          ))}
        </div>
      </div>
      <style jsx>{`
        .m-cards { padding: var(--section-gap) 0; background: var(--bg); }
        .m-cards-h { margin: 0 0 var(--space-9); max-width: 22ch; }
        .m-cards-g {
          display: grid; gap: var(--grid-gap);
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        }
        .m-card-m {
          aspect-ratio: 4 / 3; overflow: hidden; margin-bottom: var(--space-5);
          border-radius: var(--radius-1); background: var(--bg-card);
        }
        .m-card-m img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .m-card-h {
          font-size: clamp(20px, 2vw, 26px); line-height: 1.2;
          letter-spacing: -0.02em; margin: 0 0 var(--space-3);
        }
        .m-card-b {
          font-size: 15px; line-height: 1.6; color: var(--text-body); margin: 0;
        }
      `}</style>
    </section>
  )
}



/* ── index — sparse numbered list, full screen ──────────────────── */

/**
 * A numbered register: 01 OF 06, a name, and its metadata. Repetition
 * and hairlines carry the rhythm — no cards, no prose.
 */
export function Index({
  label, title, items,
}: {
  label?: string
  title?: string
  items: { name: string; meta: string[] }[]
}) {
  const total = String(items.length).padStart(2, '0')
  return (
    <section className="ix">
      <div className="section-w ix-in">
        {(label || title) && (
          <div className="ix-top">
            {label && <p className="ix-lab">{label}</p>}
            {title && <h2 className="ix-h">{title}</h2>}
          </div>
        )}
        <ol className="ix-l">
          {items.map((it, i) => (
            <li key={it.name} className="ix-r">
              <span className="ix-n">{String(i + 1).padStart(2, '0')} <em>of</em> {total}</span>
              <span className="ix-name">{it.name}</span>
              <span className="ix-meta">
                {it.meta.map((m) => <span key={m}>{m}</span>)}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <style jsx>{`
        .ix {
          min-height: 100svh; display: flex; align-items: center;
          padding: calc(var(--nav-h) + var(--space-9)) 0 var(--space-9);
          background: #000; color: #fff;
        }
        .ix-in { width: 100%; }
        .ix-top { margin-bottom: var(--space-9); }
        .ix-lab {
          font-family: var(--font-mono), monospace;
          font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
          color: rgba(255,255,255,0.45); margin: 0 0 var(--space-5);
        }
        .ix-h {
          font-family: var(--font-grotesque), sans-serif; font-weight: 400;
          font-size: clamp(30px, 4vw, 58px); line-height: 1.05;
          letter-spacing: -0.045em; color: #fff; margin: 0; max-width: 20ch;
        }
        .ix-l { list-style: none; margin: 0; padding: 0; }
        .ix-r {
          display: grid;
          grid-template-columns: 130px minmax(0, 1fr) minmax(0, 1fr);
          gap: var(--space-6); align-items: baseline;
          padding: var(--space-6) 0;
          border-top: 1px solid rgba(255,255,255,0.14);
        }
        .ix-r:last-child { border-bottom: 1px solid rgba(255,255,255,0.14); }
        .ix-n {
          font-family: var(--font-mono), monospace;
          font-size: 12px; letter-spacing: 1px; text-transform: uppercase;
          color: rgba(255,255,255,0.42); white-space: nowrap;
        }
        .ix-n :global(em) { font-style: normal; opacity: 0.55; }
        .ix-name {
          font-family: var(--font-grotesque), sans-serif; font-weight: 400;
          font-size: clamp(24px, 2.9vw, 44px); line-height: 1.08;
          letter-spacing: -0.035em; color: #fff;
        }
        .ix-meta {
          display: flex; flex-direction: column; gap: 6px;
          font-family: var(--font-mono), monospace;
          font-size: 12px; line-height: 1.6; letter-spacing: 0.4px;
          text-transform: uppercase; color: rgba(255,255,255,0.45);
          justify-self: end; text-align: right;
        }
        @media (max-width: 860px) {
          .ix-r { grid-template-columns: 1fr; gap: var(--space-3); }
          .ix-meta { justify-self: start; text-align: left; }
        }
      `}</style>
    </section>
  )
}

/* ── numbered cards ─────────────────────────────────────────────── */

/** 01–04 differentiators. Tight copy, no images — the Haven pattern. */
export function Numbered({
  title, items,
}: {
  title?: string
  items: { title: string; body: string }[]
}) {
  return (
    <section className="nb">
      <div className="section-w">
        {title && <h2 className="nb-h">{title}</h2>}
        <div className="nb-g">
          {items.map((it) => (
            <article key={it.title} className="nb-c">
              <h3 className="nb-ch">{it.title}</h3>
              <p className="nb-cb">{it.body}</p>
            </article>
          ))}
        </div>
      </div>
      <style jsx>{`
        .nb { padding: var(--section-gap) 0; background: var(--bg); }
        .nb-h { margin: 0 0 var(--space-9); max-width: 22ch; }
        .nb-g {
          display: grid; gap: var(--grid-gap);
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        }
        .nb-c { border-top: 1px solid var(--border); padding-top: var(--space-5); }
        .nb-ch {
          font-size: clamp(19px, 1.8vw, 24px); line-height: 1.2;
          letter-spacing: -0.02em; margin: 0 0 var(--space-3);
        }
        .nb-cb { font-size: 15px; line-height: 1.6; color: var(--text-body); margin: 0; }
      `}</style>
    </section>
  )
}

/* ── principle — one sentence, held alone ───────────────────────── */

export function Principle({ children }: { children: ReactNode }) {
  return (
    <section className="pr">
      <div className="section-w">
        <p className="pr-h">{children}</p>
      </div>
      <style jsx>{`
        .pr {
          padding: var(--section-gap) 0; background: var(--bg);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .pr-h {
          font-family: var(--font-grotesque), sans-serif; font-weight: 400;
          font-size: clamp(26px, 3.6vw, 46px); line-height: 1.14;
          letter-spacing: -0.04em; color: var(--text);
          margin: 0; max-width: 24ch;
        }
      `}</style>
    </section>
  )
}

/* ── goals — categorised list ───────────────────────────────────── */

export function Goals({
  title, items,
}: {
  title?: string
  items: { title: string; body: string }[]
}) {
  return (
    <section className="gl">
      <div className="section-w">
        {title && <h2 className="gl-h">{title}</h2>}
        <dl className="gl-l">
          {items.map((it) => (
            <div key={it.title} className="gl-r">
              <dt className="gl-t">{it.title}</dt>
              <dd className="gl-b">{it.body}</dd>
            </div>
          ))}
        </dl>
      </div>
      <style jsx>{`
        .gl { padding: var(--section-gap) 0; background: var(--bg); }
        .gl-h { margin: 0 0 var(--space-9); max-width: 20ch; }
        .gl-l { margin: 0; }
        .gl-r {
          display: grid; grid-template-columns: minmax(180px, 1fr) 2fr;
          gap: var(--space-6);
          padding: var(--space-6) 0;
          border-top: 1px solid var(--border);
        }
        .gl-r:last-child { border-bottom: 1px solid var(--border); }
        .gl-t {
          font-family: var(--font-grotesque), sans-serif;
          font-size: clamp(19px, 1.8vw, 24px); line-height: 1.2;
          letter-spacing: -0.02em; margin: 0;
        }
        .gl-b {
          font-size: 15px; line-height: 1.65; color: var(--text-body);
          margin: 0; max-width: 60ch;
        }
        @media (max-width: 760px) {
          .gl-r { grid-template-columns: 1fr; gap: var(--space-3); }
        }
      `}</style>
    </section>
  )
}

/* ── stat row ───────────────────────────────────────────────────── */

export function Stats({ items }: { items: { v: string; k: string }[] }) {
  return (
    <section className="m-stats">
      <div className="section-w m-stats-g">
        {items.map((s) => (
          <div key={s.k} className="m-stat">
            <p className="m-stat-v">{s.v}</p>
            <p className="m-stat-k">{s.k}</p>
          </div>
        ))}
      </div>
      <style jsx>{`
        .m-stats {
          padding: var(--space-9) 0; background: var(--bg);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .m-stats-g {
          display: grid; gap: var(--space-7);
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        }
        .m-stat-v {
          font-family: var(--font-grotesque), sans-serif;
          font-size: clamp(30px, 4vw, 46px); line-height: 1;
          letter-spacing: -0.04em; margin: 0 0 var(--space-3);
        }
        .m-stat-k {
          font-family: var(--font-mono), monospace;
          font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
          color: var(--text-muted); margin: 0;
        }
      `}</style>
    </section>
  )
}

/* ── statement band ─────────────────────────────────────────────── */

export function Statement({
  children, sub, src, alt,
}: { children: ReactNode; sub?: string; src?: string; alt?: string }) {
  return (
    <section className={`m-say ${src ? 'has-img' : ''}`}>
      {src && (
        <div className="m-say-bg">
          <img src={src} alt={alt || ''} loading="lazy" decoding="async" />
          <div className="m-say-scrim" aria-hidden />
        </div>
      )}
      <div className="section-w m-say-in">
        <p className="m-say-h">{children}</p>
        {sub && <p className="m-say-s">{sub}</p>}
      </div>
      <style jsx>{`
        .m-say {
          position: relative; overflow: hidden; background: var(--bg);
          min-height: 100svh; display: flex; align-items: center;
          padding: calc(var(--nav-h) + var(--space-9)) 0 var(--space-9);
        }
        .m-say-bg { position: absolute; inset: 0; }
        .m-say-bg img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .m-say-scrim { position: absolute; inset: 0; background: rgba(0,0,0,0.62); }
        .m-say-in { position: relative; z-index: 1; width: 100%; text-align: center; }
        .m-say-h {
          font-family: var(--font-grotesque), sans-serif;
          font-size: clamp(28px, 4.4vw, 54px); line-height: 1.1;
          letter-spacing: -0.04em; margin: 0 auto; max-width: 20ch;
          color: var(--text);
        }
        .has-img .m-say-h, .has-img .m-say-s { color: #fff; }
        .m-say-s {
          font-size: clamp(15px, 1.5vw, 18px); line-height: 1.6;
          color: var(--text-body); margin: var(--space-6) auto 0; max-width: 52ch;
        }
      `}</style>
    </section>
  )
}

/* ── closing — the site's word-by-word scroll reveal ────────────── */

/**
 * The last word of a pillar page, told with the homepage's own
 * ScrollHighlight: each word starts dim and brightens as it enters the
 * top of the viewport. Pass a string; newlines become separate lines,
 * so the closing reads as a short descending ladder.
 */
export function Closing({ children }: { children: string }) {
  return (
    <section className="cl">
      <div className="section-w">
        <ScrollHighlight maxWidth={720} align="left">{children}</ScrollHighlight>
      </div>
      <style jsx>{`
        .cl {
          /* Above the chapter backdrop, which is fixed at z-index 0. */
          position: relative; z-index: 1;
          display: flex; align-items: center;
          background: #000;
          padding: clamp(112px, 18vh, 216px) 0;
        }
        /* ScrollHighlight renders a plain h2, which the global rule
           paints var(--text) — invisible on black in day mode. */
        .cl :global(h2) { color: #fff; }

      `}</style>
    </section>
  )
}

/* ── loop diagram — the operating rhythm, drawn ─────────────────── */

/**
 * The closed loop as it appears in the Natural Intelligence deck:
 * four stations on a ring — observe, remember, learn, act — with the
 * subject held in the middle. Built in markup rather than as a flat
 * image so the type stays crisp and the labels stay selectable.
 */
export function LoopDiagram({
  centre,
  stations = ['Observe', 'Remember', 'Learn', 'Act'],
  caption,
}: {
  centre: string[]
  stations?: string[]
  caption?: string
}) {
  return (
    <section className="ld">
      <div className="section-w">
        <div className="ld-ring" role="img"
          aria-label={`${centre.join(' ')} — a closed loop: ${stations.join(', then ')}, and back to the start.`}>
          <span className="ld-circle" aria-hidden />
          {stations.map((st, i) => (
            <span key={st} className={`ld-n ld-n${i + 1}`} aria-hidden>
              {i + 1} · {st}
            </span>
          ))}
          <span className="ld-c" aria-hidden>
            {centre.map((line) => <span key={line}>{line}</span>)}
          </span>
        </div>

        {caption && <p className="ld-cap">{caption}</p>}
      </div>

      <style jsx>{`
        .ld {
          /* Above the chapter backdrop, which is fixed at z-index 0. */
          position: relative; z-index: 1;
          background: #000; color: #fff;
          padding: clamp(104px, 16vh, 196px) 0;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
        }
        .ld-ring {
          position: relative;
          width: min(100%, 620px);
          aspect-ratio: 1;
          margin: 0 auto;
          display: grid; place-items: center;
        }
        .ld-circle {
          position: absolute; inset: 12%;
          border: 1px solid rgba(255, 255, 255, 0.42);
          border-radius: 50%;
        }

        /* the four stations, at the ring's compass points */
        .ld-n {
          position: absolute;
          font-family: var(--font-mono), monospace;
          font-size: clamp(9px, 1.5vw, 12px);
          letter-spacing: 1px; text-transform: uppercase;
          white-space: nowrap;
          background: #fff; color: #111;
          padding: 7px 12px;
        }
        .ld-n2 { top: 12%; left: 50%; transform: translate(-50%, -50%); }
        .ld-n3 { top: 50%; right: 12%; transform: translate(50%, -50%); }
        .ld-n4 { bottom: 12%; left: 50%; transform: translate(-50%, 50%); }
        .ld-n1 { top: 50%; left: 12%; transform: translate(-50%, -50%); }

        .ld-c {
          display: flex; flex-direction: column; text-align: center;
          font-family: var(--font-grotesque), sans-serif;
          font-weight: 600;
          font-size: clamp(17px, 3vw, 36px);
          line-height: 1.14; letter-spacing: -0.035em;
          text-transform: uppercase;
          max-width: 62%;
        }

        .ld-cap {
          font-size: clamp(15px, 1.5vw, 18px); line-height: 1.6;
          color: rgba(255, 255, 255, 0.66); text-align: center;
          margin: clamp(32px, 5vw, 56px) auto 0; max-width: 46ch;
        }
      `}</style>
    </section>
  )
}

/* ── banner — the hand-off, direct ──────────────────────────────── */

/**
 * Going to the next section: a statement block. One bold left-aligned
 * statement — title and sub run together as a single paragraph — and
 * a plain underlined link beneath it. Replaces NextUp everywhere.
 */
export function Banner({
  title, cta, href, sub, src, alt = '',
}: {
  title: string
  cta: string
  href: string
  sub?: string
  /** Drops straight into the 16:9 plate. Grey until then. */
  src?: string
  alt?: string
}) {
  return (
    <section className="bn">
      <div className="section-w bn-in">
        <Link href={href} className="bn-media" aria-hidden tabIndex={-1}>
          {src && <img src={src} alt={alt} loading="lazy" decoding="async" />}
        </Link>

        <div className="bn-text">
          <h2 className="bn-h">{title}{sub ? ` ${sub}` : ''}</h2>
          <p className="bn-act">
            <Link href={href} className="bn-btn">{cta}</Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .bn {
          /* Above the chapter backdrop, which is fixed at z-index 0. */
          position: relative; z-index: 1;
          min-height: 88svh;
          display: flex; align-items: center;
          background: #000; color: #fff;
          padding: clamp(112px, 18vh, 216px) 0;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
        }
        .bn-in {
          width: 100%;
          display: grid;
          grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
          gap: clamp(32px, 5vw, 80px);
          align-items: center;
        }

        /* 16:9 plate — grey until the photography lands */
        :global(.bn-media) {
          display: block; position: relative;
          aspect-ratio: 16 / 9;
          background: #2a2a2a;
          border-radius: var(--radius-1);
          overflow: hidden;
        }
        :global(.bn-media) img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform var(--dur-slow) var(--ease);
        }
        :global(.bn-media):hover img { transform: scale(1.03); }

        .bn-text { min-width: 0; }
        .bn-h {
          font-family: var(--font-grotesque), sans-serif;
          font-weight: 500;
          /* The banner carries a title and a subtitle in one heading, so
             it runs long — at 54px it filled the panel and read as the
             page rather than as a way out of it. */
          font-size: clamp(24px, 2.4vw, 38px);
          line-height: 1.2; letter-spacing: -0.025em;
          color: #fff; margin: 0; max-width: 30ch;
          text-wrap: pretty;
        }
        .bn-act { margin: var(--space-7) 0 0; }
        :global(.bn-btn) {
          display: inline-block;
          font-family: var(--font-grotesque), sans-serif;
          font-weight: 500;
          font-size: clamp(18px, 1.7vw, 26px);
          letter-spacing: -0.01em;
          color: #fff;
          text-decoration: underline;
          text-decoration-thickness: var(--rule-weight);
          text-underline-offset: var(--rule-offset);
        }
        :global(.bn-btn):hover {
          text-decoration: underline;
          text-decoration-color: var(--brand-accent);
          text-decoration-thickness: var(--rule-weight);
          text-underline-offset: var(--rule-offset);
        }

        @media (max-width: 860px) {
          .bn { min-height: 0; }
          .bn-in { grid-template-columns: 1fr; gap: var(--space-7); }
        }
      `}</style>
    </section>
  )
}

/* ── page hand-off — always the other three ─────────────────────── */

type PageKey = 'hub' | 'biodynamic' | 'transparency' | 'flavour' | 'experience'

const PAGE_HREF: Record<PageKey, string> = {
  hub: '/regenerative-coffee',
  biodynamic: '/regenerative-coffee/biodynamic',
  transparency: '/regenerative-coffee/transparency',
  flavour: '/regenerative-coffee/flavour',
  experience: '/regenerative-coffee/experience',
}

const ORDER: PageKey[] = ['biodynamic', 'transparency', 'flavour', 'hub']

/* Every page hands off to the other three, worded from where the
   reader is standing — the same destination is framed differently
   depending on what they have just read. */
const HANDOFF: Record<PageKey, Partial<Record<PageKey, { title: string; sub: string; cta: string }>>> = {
  hub: {
    biodynamic: {
      title: 'Grown in a closed loop.',
      sub: 'The herd feeds the soil. The soil feeds the trees. Nothing is bought in.',
      cta: 'Better Ground',
    },
    transparency: {
      title: 'Written down as it happens.',
      sub: 'Every act signed from the field. Every batch tested before it lands.',
      cta: 'Explore transparency',
    },
    flavour: {
      title: 'Nine lots. One harvest.',
      sub: 'Three Robusta, six Arabica, and the full file behind every one.',
      cta: 'Explore the flavours',
    },
  },
  biodynamic: {
    transparency: {
      title: 'Now check the working.',
      sub: 'Nine streams of data, every batch read before it touches the soil — and the one thing we cannot prove.',
      cta: 'Explore transparency',
    },
    flavour: {
      title: 'Then taste what it did.',
      sub: 'Nine lots off this ground, two national wins, and the file behind each one.',
      cta: 'Explore the flavours',
    },
    hub: {
      title: 'Nine ways of paying attention.',
      sub: 'The whole loop, discipline by discipline — the practice this page is one part of.',
      cta: 'The Remarkable Circle',
    },
  },
  transparency: {
    flavour: {
      title: 'The record ends in a cup.',
      sub: 'Nine lots, scored by people with no stake in the result.',
      cta: 'Explore the flavours',
    },
    biodynamic: {
      title: 'What the record is recording.',
      sub: 'About fifty cattle, fourteen numbered pits, and a canopy cut to a light reading instead of a feeling.',
      cta: 'Better Ground',
    },
    hub: {
      title: 'Nine ways of paying attention.',
      sub: 'The whole loop, discipline by discipline.',
      cta: 'The Remarkable Circle',
    },
  },
  experience: {
    biodynamic: {
      title: 'What you would be standing in.',
      sub: 'About fifty cattle, a closed loop, and a canopy cut to a light reading instead of a feeling.',
      cta: 'Better Ground',
    },
    transparency: {
      title: 'And what gets written down.',
      sub: 'Nine streams of data, signed from the field, and re-read ninety days later.',
      cta: 'Explore transparency',
    },
    flavour: {
      title: 'What it ends up tasting like.',
      sub: 'Nine lots off this ground, two national wins, and the file behind every one.',
      cta: 'Explore the flavours',
    },
    hub: {
      title: 'Nine ways of paying attention.',
      sub: 'The whole loop, discipline by discipline — three days is one pass through it.',
      cta: 'The Remarkable Circle',
    },
  },
  flavour: {
    biodynamic: {
      title: 'It started in the ground.',
      sub: 'About fifty cattle, a closed loop, and a canopy cut to a number.',
      cta: 'Better Ground',
    },
    transparency: {
      title: 'And all of it was written down.',
      sub: 'Nine streams of data, signed from the field, and re-read ninety days later.',
      cta: 'Explore transparency',
    },
    hub: {
      title: 'One remarkable circle.',
      sub: 'Grass feeds the herd. The herd feeds the preparations. The preparations feed the soil. The soil grows the grass.',
      cta: 'The Remarkable Circle',
    },
  },
}

/** The three hand-offs that close every page, in reading order. */
/* The first photograph of each chapter, so a crosslink shows the place
   it leads to rather than an empty plate. */
const BANNER_THUMB: Record<PageKey, string | undefined> = {
  hub: '/regenerative-coffee/overview/aura-regenerative-coffee.webp',
  biodynamic: '/regenerative-coffee/better-ground/aura-closed-loop-01.webp',
  flavour: '/regenerative-coffee/flavours/aura-cherry-morning.webp',
  transparency: '/regenerative-coffee/transparency/aura-signing-field.webp',
  experience: undefined,
}

export function NextBanners({ from }: { from: PageKey }) {
  return (
    <>
      {ORDER.filter((k) => k !== from).map((k) => {
        const copy = HANDOFF[from][k]
        if (!copy) return null
        return (
          <Banner
            key={k}
            title={copy.title}
            sub={copy.sub}
            cta={copy.cta}
            href={PAGE_HREF[k]}
            src={BANNER_THUMB[k]}
            alt=""
          />
        )
      })}
    </>
  )
}

/* ── experience banner — clay, persistent, the site's one ask ───── */

/**
 * The bottom of every microsite page. Clay ground (the brand accent),
 * one line, one link to the Festival page.
 */
export function ReserveBanner() {
  return (
    <section className="rb">
      <div className="section-w rb-in">
        <h2 className="rb-h">The Aura Festival.</h2>
        <p className="rb-p">
          Twenty places, three times a year. You set the protocol for a lot
          of your own, and we build it and ship it under your name.
        </p>
        <p className="rb-act rb-al">
          <ArrowLink href={PAGE_HREF.experience} tone="ink">Attend the Festival</ArrowLink>
        </p>
      </div>
      <style jsx>{`
        .rb {
          /* Above the chapter backdrop, which is fixed at z-index 0. */
          position: relative; z-index: 1;
          display: flex; align-items: center;
          padding: clamp(128px, 20vh, 240px) 0;
          background: var(--brand-accent); color: #1d0f05;
          text-align: center;
        }
        .rb-in { width: 100%; }
        .rb-h {
          font-family: var(--font-grotesque), sans-serif;
          font-weight: 400;
          font-size: clamp(34px, 4.6vw, 64px);
          line-height: 1.04; letter-spacing: -0.04em;
          color: #1d0f05; margin: 0 auto; max-width: 18ch;
        }
        .rb-p {
          font-size: clamp(15px, 1.4vw, 18px); line-height: 1.6;
          color: rgba(29, 15, 5, 0.78);
          margin: var(--space-5) auto 0; max-width: 48ch;
        }
        .rb-act { margin: var(--space-7) auto 0; display: flex; justify-content: center; }
        /* ArrowLink, inked to the clay ground */
        .rb-al :global(.al) { color: #1d0f05; }
        .rb-al :global(.al-i) { border-color: rgba(29, 15, 5, 0.5); }
        .rb-al :global(.al):hover :global(.al-i) {
          background: #1d0f05; border-color: #1d0f05; color: var(--brand-accent);
        }
      `}</style>
    </section>
  )
}

/* ── next up ────────────────────────────────────────────────────── */

/**
 * One link, forward only. A subpage hands off to the next pillar in
 * sequence — never a menu of options at the point the reader has just
 * finished something.
 */
export function NextUp({
  href, label, body, src, eyebrow = 'Next',
}: {
  href: string
  label: string
  body: string
  src: string
  eyebrow?: string
}) {
  return (
    <section className="m-next">
      <div className="section-w">
        <Link href={href} className="m-next-c">
          <span className="m-next-m">
            <img src={src} alt="" loading="lazy" decoding="async" />
          </span>
          <span className="m-next-t">
            <span className="m-next-e">{eyebrow}</span>
            <span className="m-next-h">{label}</span>
            <span className="m-next-b">{body}</span>
            <span className="m-next-a" aria-hidden>→</span>
          </span>
        </Link>
      </div>
      <style jsx>{`
        .m-next {
          min-height: 100svh; display: flex; align-items: center;
          padding: calc(var(--nav-h) + var(--space-9)) 0 var(--space-9);
          background: var(--bg); border-top: 1px solid var(--border);
        }
        .m-next :global(.section-w) { width: 100%; }
        :global(.m-next-c) {
          display: grid; grid-template-columns: 420px 1fr;
          gap: var(--grid-gap); align-items: center;
          text-decoration: none; color: inherit;
        }
        .m-next-m {
          display: block; aspect-ratio: 4 / 3; overflow: hidden;
          border-radius: var(--radius-1); background: var(--bg-card);
        }
        .m-next-m img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform var(--dur-slow) var(--ease);
        }
        :global(.m-next-c):hover .m-next-m img { transform: scale(1.04); }
        .m-next-t { display: block; }
        .m-next-e {
          display: block;
          font-family: var(--font-mono), monospace;
          font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
          color: var(--text-muted); margin-bottom: var(--space-4);
        }
        .m-next-h {
          display: block; font-family: var(--font-grotesque), sans-serif;
          font-size: clamp(30px, 3.4vw, 48px); line-height: 1.1;
          letter-spacing: -0.035em; margin-bottom: var(--space-4);
        }
        .m-next-b {
          display: block; font-size: 16px; line-height: 1.6;
          color: var(--text-body); max-width: 46ch;
        }
        .m-next-a {
          display: inline-block; margin-top: var(--space-6);
          font-family: var(--font-mono), monospace; font-size: 13px;
          color: var(--brand-accent);
          transition: transform var(--dur-base) var(--ease);
        }
        :global(.m-next-c):hover .m-next-a { transform: translateX(5px); }

        @media (max-width: 860px) {
          :global(.m-next-c) { grid-template-columns: 1fr; gap: var(--space-6); }
        }
      `}</style>
    </section>
  )
}

/* ── closing invitation ─────────────────────────────────────────── */

/* ── long-form scenes ───────────────────────────────────────────── */

/**
 * A full-viewport image carrying a few lines of copy. The image is the
 * block; the words sit on it, low and left, and most scenes have no
 * headline at all. Pages are told by running these one after another —
 * the copy has to carry across the cut, so each scene continues the
 * sentence the last one left off.
 */
export function Scene({
  id, src, poster, alt = '', mediaType = 'image', title, children, align = 'left', dim = 'mid',
  href, cta, glyph,
}: {
  id?: string
  src?: string
  poster?: string
  alt?: string
  mediaType?: 'image' | 'video'
  title?: string
  children: ReactNode
  align?: 'left' | 'centre'
  dim?: 'low' | 'mid' | 'high'
  href?: string
  cta?: string
  /** filename in /public/glyphs/coffee — marks the scene as one of the
      eight disciplines on the Remarkable Circle. */
  glyph?: string
}) {
  return (
    <section id={id} className={`sc is-${align} dim-${dim} ${src ? '' : 'is-blank'}`}>
      {src && (
        <div className="sc-bg">
          <Media src={src} poster={poster} alt={alt} mediaType={mediaType} />
          <div className="sc-scrim" aria-hidden />
        </div>
      )}
      <div className="section-w sc-in">
        <div className="sc-t">
          {glyph && (
            <span className="sc-g" aria-hidden>
              <GlyphMark name={glyph} size={58} />
            </span>
          )}
          {title && <h2 className="sc-h">{title}</h2>}
          <p className="sc-p">{children}</p>
          {href && cta && (
            <p className="sc-act"><ArrowLink href={href}>{cta}</ArrowLink></p>
          )}
        </div>
      </div>

      <style jsx>{`
        /* Transparent, not black. A chapter carries one fixed backdrop
           that dissolves between photographs as the scenes scroll over
           it (components/coffee/ChapterBackdrop.tsx); a black ground here
           would sit on top of it and hide the whole thing. */
        .sc {
          position: relative; z-index: 1; min-height: 100svh;
          display: flex; align-items: flex-end;
          padding: 0 0 clamp(72px, 12vh, 144px);
          background: transparent; color: #fff; overflow: hidden;
        }
        /* A scene never carries its own picture now — the chapter's
           backdrop is behind all of them. This only governs the balance:
           Bottom-weighting exists to keep text off a photograph; with no
           photograph it only throws the page out of balance, so a blank
           scene centres instead and takes equal space above and below.
           That is what makes the chapter cards sit evenly between them. */
        .is-blank {
          align-items: center;
          padding: clamp(72px, 12vh, 144px) 0;
        }
        .sc-bg { position: absolute; inset: 0; }
        .sc-bg :global(.m-media) {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }
        /* bottom-weighted, so the picture stays the loudest thing here */
        .sc-scrim {
          position: absolute; inset: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.82) 0%,
            rgba(0, 0, 0, 0.45) 32%,
            rgba(0, 0, 0, 0.08) 62%,
            rgba(0, 0, 0, 0.28) 100%
          );
        }
        .dim-low .sc-scrim { opacity: 0.72; }
        .dim-high .sc-scrim { opacity: 1; background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.92) 0%,
            rgba(0, 0, 0, 0.66) 40%,
            rgba(0, 0, 0, 0.34) 100%
          );
        }
        .sc-in { position: relative; z-index: 1; width: 100%; }
        .sc-t { max-width: 40rem; }
        .is-centre .sc-t { margin-inline: auto; text-align: center; }

        /* the discipline's mark, sitting above its own heading — the same
           glyph the reader just clicked in the circle up top */
        .sc-g { display: block; margin: 0 0 var(--space-5); color: #fff; }
        .is-centre .sc-g { display: flex; justify-content: center; }
        .sc-g :global(.glyph) { opacity: 0.9; }

        .sc-h {
          font-family: var(--font-grotesque), sans-serif;
          font-weight: 400;
          font-size: clamp(30px, 4vw, 58px);
          line-height: 1.04; letter-spacing: -0.04em;
          color: #fff; margin: 0 0 var(--space-5); max-width: 16ch;
        }
        .is-centre .sc-h { margin-inline: auto; }

        .sc-p {
          font-size: clamp(18px, 1.55vw, 22px);
          line-height: 1.62;
          color: rgba(255, 255, 255, 0.92);
          margin: 0; text-wrap: pretty;
        }

        .sc-act { margin: var(--space-6) 0 0; }
        .is-centre .sc-act { display: flex; justify-content: center; }
      `}</style>
    </section>
  )
}

/**
 * A chapter card — black, one line, nothing else. Used sparingly to
 * break a run of scenes, the way a title card breaks a reel.
 */
export function Chapter({
  children, tight = false,
}: {
  children: ReactNode
  /** Closes the gap below, for a line that reads straight into the
      block under it rather than standing on its own. */
  tight?: boolean
}) {
  return (
    <section className={`ch ${tight ? 'is-tight' : ''}`}>
      <div className="section-w">
        <h2 className="ch-h">{children}</h2>
      </div>
      <style jsx>{`
        /* Symmetric padding rather than a min-height, so the space above
           and below is identical however many lines the card runs to. */
        .ch {
          /* Above the chapter backdrop, which is fixed at z-index 0. */
          position: relative; z-index: 1;
          display: flex; align-items: center; justify-content: center;
          padding: clamp(128px, 21vh, 248px) 0;
          background: #000; color: #fff; text-align: center;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
        }
        .ch.is-tight { padding-bottom: clamp(40px, 6vh, 72px); }
        .ch-h {
          font-family: var(--font-hand), cursive;
          font-weight: 400;
          color: #fff;
          font-size: clamp(30px, 4.6vw, 62px);
          line-height: 1.32; letter-spacing: 0;
          margin: 0 auto; max-width: 20ch;
        }
      `}</style>
    </section>
  )
}

export function Invite({
  id, title, body, email = 'coffee@theaura.life', note,
}: { id?: string; title: string; body: string; email?: string; note?: string }) {
  return (
    <section id={id} className="m-inv">
      <div className="section-w m-inv-in">
        <h2 className="m-inv-h">{title}</h2>
        <p className="m-inv-b">{body}</p>
        <span className="m-inv-a"><ArrowLink href={`mailto:${email}`} tone="ink">{email}</ArrowLink></span>
        {note && <p className="m-inv-n">{note}</p>}
      </div>
      <style jsx>{`
        .m-inv {
          padding: var(--section-gap) 0;
          background: var(--bg); border-top: 1px solid var(--border);
        }
        .m-inv-in { text-align: center; }
        .m-inv-a { display: inline-flex; }
        .m-inv-h { margin: 0 auto; max-width: 18ch; }
        .m-inv-b {
          font-size: clamp(17px, 1.6vw, 20px); line-height: 1.65;
          color: var(--text-body); margin: var(--space-6) auto var(--space-7);
          max-width: 50ch;
        }
        .m-inv-n {
          font-family: var(--font-mono), monospace;
          font-size: 12px; line-height: 1.7; color: var(--text-muted);
          margin: var(--space-9) auto 0; max-width: 60ch;
        }
      `}</style>
    </section>
  )
}
