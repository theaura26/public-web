'use client'

import { Fragment, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { revealWhenReady } from '@/lib/film-reveal'
import { BRAND } from './copy'
import { RIPE_GREEN, RIPE_PINK } from './colours'

/* Under the tagline, the two pages as one story: RIPE itself, before the
   season, and A Season of RIPE, after it. The page you are on stands in
   white; the other is a link, lit in its own page's colour on hover. */
const PAIR = [
  { href: '/ripe', label: 'Before', accent: RIPE_GREEN },
  { href: '/ripe/after', label: 'After', accent: RIPE_PINK },
] as const

/* ── RIPE opener ─────────────────────────────────────────────────────
   The design splits the opener: the mark sits at the lower left (x60,
   y659) and the tagline and meta line sit against the right edge (x1309,
   y744 and y919). Both land in the lower half of a 1089-tall frame.

   ASSET NOTE. The design's own hero photograph is `aura-laterite-wet.jpg`
   layered under a screenshot, and neither has been exported — see
   SPEC.md section 6. The film of the same branch stands in until they are, which
   is the closest available asset and the same subject.

   The logotype is public/RIPE/aura-ripe.svg, the supplied vector
   artwork, in place of the earlier PNG keyed out of the banner.
─────────────────────────────────────────────────────────────────────── */

/* Matches the opener's own stacking breakpoint below. */
const PHONE = '(max-width: 899px)'
const POSTER = '/RIPE/aura-ripe-banner.jpg'
const POSTER_PHONE = '/RIPE/aura-ripe-banner-mobile.jpg'

/* The opener's film: a wide cut, a phone cut, and their posters. */
type HeroFilm = { src: string; srcPhone: string; poster: string; posterPhone: string }
const RIPE_FILM: HeroFilm = {
  src: '/RIPE/aura-ripe-banner.mp4',
  srcPhone: '/RIPE/aura-ripe-banner-mobile.mp4',
  poster: POSTER,
  posterPhone: POSTER_PHONE,
}

/** mark: the logotype to show. /ripe uses the supplied green artwork;
    a sister page in another colour passes its own copy.
    tagline: the line beside it, one string per line. /ripe uses the
    design's own (BRAND.tagline); a sister page can pass its own.
    link: makes the mark and the tagline a way through to another page.
    On hover or focus of either, the hover colour sweeps across both from
    the left — markHover is the mark's artwork in that colour — and the
    tagline is rewritten as it goes, into taglineHover if one is given.
    A click goes to href. /ripe uses it to lead to its sister page,
    A Season of RIPE, in that page's coral; the sister page leads back,
    in /ripe's green.
    from: the side the colour sweeps in from — 'left' (the default) or
    'right', for the way back. */
type HeroLink = { href: string; hover: string; markHover: string; taglineHover?: readonly string[]; label: string; from?: 'left' | 'right' }

/** film: the opener's video. /ripe's own by default; a sister page can
    pass its own. */
export function RipeHero({ mark = '/RIPE/aura-ripe.svg', tagline = BRAND.tagline, link, film = RIPE_FILM }: { mark?: string; tagline?: readonly string[]; link?: HeroLink; film?: HeroFilm } = {}) {
  const root = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const el = root.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)
    ScrollTrigger.config({ ignoreMobileResize: true })
    const ctx = gsap.context(() => {
      gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } })
        .to('.hero__media', { scale: 1.1, ease: 'none' }, 0)
        .to('.hero__in', { yPercent: -18, autoAlpha: 0, ease: 'power1.in' }, 0)
    }, el)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const v = video.current
    if (!v) return
    /* The poster is chosen here rather than in the markup: an attribute
       can't vary by screen, and the film stays hidden until it can play,
       so a server-rendered poster was 680KB downloaded on every visit —
       phones included — and rarely seen. */
    v.poster = window.matchMedia(PHONE).matches ? film.posterPhone : film.poster
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause() }, { threshold: 0.1 })
    io.observe(v)
    return () => io.disconnect()
  }, [film.poster, film.posterPhone])

  /* The site bar is a solid plate in day mode and was cutting a band
     across the film. Transparent while the opener is on screen. */
  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => document.body.classList.toggle('ripe-over-hero', e.isIntersecting),
      { threshold: 0, rootMargin: '-56px 0px 0px 0px' })
    io.observe(el)
    return () => { io.disconnect(); document.body.classList.remove('ripe-over-hero') }
  }, [])

  return (
    <section ref={root} className="hero" id="top">
      <div className="hero__media">
        <video
          ref={(el) => { video.current = el; revealWhenReady(el) }}
          muted loop playsInline preload="metadata"
          aria-label="The Aura estate from above, guests gathered in a clearing"
        >
          {/* Phones get a portrait cut of the same film at native pixels:
              half the weight, and none of it spent on edges a tall screen
              crops away. The first source whose media matches wins. */}
          <source media={PHONE} src={film.srcPhone} type="video/mp4" />
          <source src={film.src} type="video/mp4" />
        </video>
      </div>
      <div className="hero__in" style={link?.from === 'right' ? { ['--hero-sweep' as string]: 'to left' } : undefined}>
        <h1 className="hero__mark">
          {link ? (
            /* Pointer and touch only: the tagline's link, the same place,
               carries the keyboard, so it isn't announced twice. */
            <Link href={link.href} className="hero__go hero__go--mark" tabIndex={-1} aria-hidden>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mark} alt="" width={466} height={256} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={link.markHover} alt="" width={466} height={256} className="hero__bloom" />
            </Link>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mark} alt="" aria-hidden width={466} height={256} />
          )}
          <span className="hero__name sr-only">RIPE</span>
        </h1>
        <div className="hero__say">
          <p className="hero__tag">
            {link ? (
              <Link
                href={link.href}
                className="hero__go hero__go--tag"
                aria-label={link.label}
                style={{ ['--hero-hover' as string]: link.hover }}
              >
                <span className="hero__ink">
                  {tagline.map((line) => <span key={line}>{line}</span>)}
                </span>
                {/* The other page's words — or these, if it has none — in
                    the hover colour, stacked in the same place and swept
                    in from the left as these are swept out. */}
                <span className="hero__bloom" aria-hidden>
                  {(link.taglineHover ?? tagline).map((line) => <span key={line}>{line}</span>)}
                </span>
              </Link>
            ) : (
              tagline.map((line) => <span key={line}>{line}</span>)
            )}
          </p>
          <nav className="hero__meta hero__pair" aria-label="RIPE, before and after">
            {PAIR.map((p, i) => (
              <Fragment key={p.href}>
                {i > 0 && <span className="hero__bar" aria-hidden>|</span>}
                {pathname === p.href ? (
                  <span className="hero__now" aria-current="page">{p.label}</span>
                ) : (
                  <Link href={p.href} className="hero__other" style={{ ['--pair-hover' as string]: p.accent }}>{p.label}</Link>
                )}
              </Fragment>
            ))}
          </nav>
        </div>
      </div>

      <style jsx>{`
        .hero {
          position: relative; width: 100vw; margin-left: calc(50% - 50vw);
          height: 100dvh; min-height: 560px;
          display: flex; align-items: flex-end;
          padding-bottom: clamp(40px, 9vh, 120px);
          overflow: hidden; background: var(--ripe-ink); color: #fff;
        }
        .hero__media { position: absolute; inset: 0; will-change: transform; }
        .hero__media video {
          width: 100%; height: 100%; object-fit: cover; display: block;
          /* Twenty per cent down. A brightness filter rather than a black
             overlay: the canopy keeps its colour, it just stops competing
             with the green and white type over it. */
          filter: brightness(0.8);
          opacity: 0; transition: opacity .9s var(--ease-out);
        }
        .hero__media video[data-ready='true'] { opacity: 1; }
        /* The mark sits almost flush left — x60 of 1920 in the file,
           which is 3.1% — rather than on the article rail, so the opener
           reads as a poster instead of a page. The words keep the right
           edge the rest of the page uses. */
        .hero__in {
          position: relative; z-index: 1; width: 100%;
          /* Physical sides, not padding-inline. The build rewrites a logical
             two-value padding into left/right behind a :not(:lang(…))
             selector, which outranks the plain phone overrides below — the
             uneven desktop gutters then applied at every width. */
          padding-left: 3.1%; padding-right: 8.1%;
          display: flex; flex-direction: column; gap: clamp(24px, 5vh, 56px);
        }
        @media (max-width: 720px) {
          .hero__in { padding-left: var(--gutter, 20px); padding-right: var(--gutter, 20px); }
        }
        .hero__mark { margin: 0; line-height: 0; }
        .hero__mark img {
          display: block; width: clamp(180px, 24vw, 420px); height: auto;
          filter: drop-shadow(0 2px 28px rgba(0,0,0,0.45));
        }
        /* Green, which is what the design's own fill says — #23FF88 on
           the tagline and white on the meta line under it. There is no
           scrim node in the hero frame either, so the photograph is left
           at its own brightness rather than darkened behind them. */
        .hero__tag {
          font-family: var(--font-grotesque), sans-serif;
          font-weight: 600; text-transform: uppercase;
          font-size: var(--t-tagline-size); line-height: var(--t-tagline-lh);
          letter-spacing: var(--t-track); margin: 0;
          color: var(--ripe-green);
          text-shadow: 0 2px 26px rgba(0, 0, 0, 0.35);
        }
        .hero__tag :global(span) { display: block; }
        /* The mark and the tagline as links. Over each sits a copy in the
           hover colour, masked to nothing. Hover or focus either one and
           a soft edge sweeps across both copies from the left, so the green
           turns coral the way the words read. Off again, it draws back to
           the left. With from 'right' (--hero-sweep: to left) it all runs
           the other way: in from the right, back to the right.

           The sweep is a linear mask whose edge is a registered custom
           property (@property --bloom, in the global block below), which
           is what lets it transition. Where @property isn't supported the
           edge still moves, so the colour still changes, just without the
           sweep.

           :global throughout: the classes sit on Link's own anchor and
           inside it, out of reach of this block's scope. */
        .hero__in :global(.hero__go) {
          position: relative; display: inline-block;
          color: inherit; text-decoration: none;
        }
        .hero__in :global(.hero__go--mark) { line-height: 0; }
        .hero__in :global(.hero__bloom) {
          position: absolute; inset: 0;
          pointer-events: none;
          color: var(--hero-hover);
          --bloom: 0%;
          -webkit-mask-image: linear-gradient(var(--hero-sweep, to right), #000 calc(var(--bloom) - 18%), transparent var(--bloom));
          mask-image: linear-gradient(var(--hero-sweep, to right), #000 calc(var(--bloom) - 18%), transparent var(--bloom));
          /* Closing: a little quicker than opening. */
          transition: --bloom 650ms cubic-bezier(0.65, 0, 0.35, 1);
        }
        /* The mark's copy is the coral artwork, at the mark's own size. */
        .hero__mark :global(img.hero__bloom) { width: 100%; height: 100%; }

        /* The tagline's two versions share one grid cell, so the link is
           as wide as the wider of them and the sweep runs across the same
           box for both. The words already there are wiped out by the same
           edge that brings the new ones in: their mask is the reverse. */
        .hero__tag :global(.hero__go--tag) { display: inline-grid; }
        .hero__tag :global(.hero__go--tag > .hero__ink),
        .hero__tag :global(.hero__go--tag > .hero__bloom) { grid-area: 1 / 1; }
        .hero__tag :global(.hero__go--tag > .hero__bloom) { position: static; }
        .hero__tag :global(.hero__go--tag > .hero__ink) {
          --bloom: 0%;
          -webkit-mask-image: linear-gradient(var(--hero-sweep, to right), transparent calc(var(--bloom) - 18%), #000 var(--bloom));
          mask-image: linear-gradient(var(--hero-sweep, to right), transparent calc(var(--bloom) - 18%), #000 var(--bloom));
          transition: --bloom 650ms cubic-bezier(0.65, 0, 0.35, 1);
        }
        :global(.hero__in:has(.hero__go:hover) .hero__bloom),
        :global(.hero__in:has(.hero__go:focus-visible) .hero__bloom),
        :global(.hero__in:has(.hero__go:hover) .hero__go--tag > .hero__ink),
        :global(.hero__in:has(.hero__go:focus-visible) .hero__go--tag > .hero__ink) {
          /* Past the right edge by the width of the soft edge, so the last
             letter is fully covered. */
          --bloom: 118%;
          /* Opening, on an even curve and slow enough to watch the coral
             travel. The site's ease-out did most of it in the first tenth
             of a second, which read as a switch, not a sweep. */
          transition: --bloom 1100ms cubic-bezier(0.45, 0, 0.25, 1);
        }
        .hero__tag :global(.hero__go:focus-visible) {
          outline: 1px solid var(--hero-hover); outline-offset: 6px;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero__in :global(.hero__bloom),
          .hero__in :global(.hero__ink) { transition: none !important; }
        }
        .hero__meta {
          font-family: var(--font-grotesque), sans-serif;
          font-weight: 800; text-transform: uppercase;
          font-size: clamp(12px, 1.05vw, 20px); line-height: var(--t-label-lh);
          letter-spacing: var(--t-track); color: #fff;
          margin: clamp(10px, 1.6vh, 20px) 0 0;
          text-shadow: 0 1px 18px rgba(0, 0, 0, 0.5);
        }
        .hero__pair { display: flex; align-items: baseline; gap: 0.55em; }
        .hero__bar { font-weight: 400; opacity: 0.6; }
        .hero__pair :global(.hero__other) {
          color: rgba(255, 255, 255, 0.75); text-decoration: none;
          transition: color var(--dur-fast) var(--ease);
        }
        .hero__pair :global(.hero__other:hover),
        .hero__pair :global(.hero__other:focus-visible) { color: var(--pair-hover); }
        .hero__pair :global(.hero__other:focus-visible) { outline: 1px solid var(--pair-hover); outline-offset: 4px; }

        /* Phones and small tablets: centred. The desktop split — mark to
           the left edge, words to the right — has nowhere to go once the
           two stack, and stacked flush left they sat against one side of
           the film with the other side empty. Centred, the mark, the
           tagline and the meta line share one axis down the middle. */
        @media (max-width: 899px) {
          /* Even gutters: the desktop's 3.1% / 8.1% split put the centred
             stack visibly right of centre between 720 and 899px. */
          .hero__in { align-items: center; text-align: center; padding-left: var(--gutter, 20px); padding-right: var(--gutter, 20px); }
          .hero__pair { justify-content: center; }
          /* Half as large again. At the 180px floor the mark was smaller
             than the two lines of tagline under it on a phone, and it is
             the name of the thing. */
          .hero__mark img { width: min(270px, 80vw); }
        }

        /* The design puts the mark at the lower left and the words against
           the right edge. Below 900px they stack, mark first. */
        @media (min-width: 900px) {
          /* Top-aligned: the logotype and the tagline start on one line,
             optically — see .hero__tag's margin below. */
          .hero__in { flex-direction: row; align-items: flex-start; justify-content: space-between; gap: var(--space-7); }
          /* Shrink to the widest line so the block's right edge lands on
             the page's right margin. With a fixed max-width it was placed
             at the end but its content still started at its own left, so
             the words stopped short of the edge. The lines stay
             left-aligned to each other, as the file sets them. */
          /* Optical top: the first cap line of the tagline sits 0.18em inside
             its line box (measured: 12px at 66px type, at 1440), so it is
             drawn up by that much to meet the top of the logotype. */
          .hero__tag { margin-top: -0.18em; }
          .hero__say {
            text-align: left;
            width: max-content; max-width: 44%;
          }
        }
      `}</style>
      {/* The bloom's radius, registered so it can transition. Global: a
          registration can't be scoped, and is harmless to repeat. */}
      <style jsx global>{`
        @property --bloom {
          syntax: '<percentage>';
          inherits: false;
          initial-value: 0%;
        }
      `}</style>
    </section>
  )
}
