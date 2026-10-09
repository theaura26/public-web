'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { revealWhenReady } from '@/lib/film-reveal'
import { BRAND } from './copy'

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

/** The film behind the opener, with its phone cut and posters. */
export type HeroFilm = {
  src: string
  srcPhone?: string
  poster: string
  posterPhone?: string
  label: string
}

/** The other page, reached through the mark and the line themselves:
    hovering either washes that page's colour and words through this one. */
export type HeroLink = {
  href: string
  hover: string
  markHover: string
  taglineHover: readonly string[]
  label: string
  /** Which side the wash comes from. The season sweeps back leftwards. */
  from?: 'left' | 'right'
}

const RIPE_FILM: HeroFilm = {
  src: '/RIPE/aura-ripe-banner.mp4',
  srcPhone: '/RIPE/aura-ripe-banner-mobile.mp4',
  poster: '/RIPE/aura-ripe-banner.jpg',
  posterPhone: '/RIPE/aura-ripe-banner-mobile.jpg',
  label: 'The Aura estate from above, guests gathered in a clearing',
}

export function RipeHero({
  mark = '/RIPE/aura-ripe.svg',
  name = 'RIPE',
  tagline = BRAND.tagline,
  film = RIPE_FILM,
  link,
  pair,
  dim = 0.8,
  scrim = false,
}: {
  mark?: string
  name?: string
  tagline?: readonly string[]
  film?: HeroFilm
  link?: HeroLink
  /** Before | After, with this page's own side marked as current. */
  pair?: { current: 'before' | 'after'; href: string; hover: string }
  /** How much of the film's own brightness to keep behind the words. */
  dim?: number
  /** A shade under the words, for a film whose colours fight the line. */
  scrim?: boolean
} = {}) {
  const root = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)

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
    v.poster = window.matchMedia(PHONE).matches ? (film.posterPhone ?? film.poster) : film.poster
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause() }, { threshold: 0.1 })
    io.observe(v)
    return () => io.disconnect()
  }, [film])

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
    <section ref={root} className={`hero${scrim ? ' has-scrim' : ''}`} id="top"
             style={{ ['--hero-dim' as string]: String(dim) } as React.CSSProperties}>
      <div className="hero__media">
        <video
          ref={(el) => { video.current = el; revealWhenReady(el) }}
          muted loop playsInline preload="metadata"
          aria-label={film.label}
        >
          {/* Phones get a portrait cut of the same film at native pixels:
              half the weight, and none of it spent on edges a tall screen
              crops away. The first source whose media matches wins. */}
          {film.srcPhone && <source media={PHONE} src={film.srcPhone} type="video/mp4" />}
          <source src={film.src} type="video/mp4" />
        </video>
      </div>
      {/* A shade under the words, rising from the bottom of the film.
          The film is uneven — a frame of pink flowers sits right behind
          a pink line — so the words carry their own ground instead of
          the whole picture being darkened. */}
      {scrim && <div className="hero__scrim" aria-hidden />}
      <div className="hero__in" style={link ? ({ ['--hero-sweep' as string]: link.from === 'right' ? 'to left' : 'to right' } as React.CSSProperties) : undefined}>
        <h1 className="hero__mark">
          {link ? (
            /* The mark is the door to the other page. The other page's own
               mark lies over it, masked away until a hover sweeps it
               across — one object becoming the other rather than two
               images swapping. */
            <Link href={link.href} className="hero__go hero__go--mark"
                  aria-label={link.label} style={{ ['--hero-hover' as string]: link.hover } as React.CSSProperties}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mark} alt="" aria-hidden width={466} height={256} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="hero__bloom" src={link.markHover} alt="" aria-hidden
                   width={466} height={256} />
              <span className="hero__name sr-only">{name}</span>
            </Link>
          ) : (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mark} alt="" aria-hidden width={466} height={256} />
              <span className="hero__name sr-only">{name}</span>
            </>
          )}
        </h1>
        <div className="hero__say">
          <p className="hero__tag">
            {link ? (
              <Link href={link.href} className="hero__go hero__go--tag"
                    aria-label={link.label} style={{ ['--hero-hover' as string]: link.hover } as React.CSSProperties}>
                <span className="hero__ink">
                  {tagline.map((line) => <span key={line}>{line}</span>)}
                </span>
                <span className="hero__bloom" aria-hidden>
                  {link.taglineHover.map((line) => <span key={line}>{line}</span>)}
                </span>
              </Link>
            ) : (
              tagline.map((line) => <span key={line}>{line}</span>)
            )}
          </p>
          {pair ? (
            /* The two halves of RIPE, named: the week itself, and the
               season it became. The one you are on is not a link. */
            <nav aria-label="RIPE, before and after" className="hero__meta hero__pair">
              {pair.current === 'before' ? (
                <span className="hero__now" aria-current="page">Before</span>
              ) : (
                <Link className="hero__other" href={pair.href}
                      style={{ ['--pair-hover' as string]: pair.hover } as React.CSSProperties}>Before</Link>
              )}
              <span className="hero__bar" aria-hidden>|</span>
              {pair.current === 'after' ? (
                <span className="hero__now" aria-current="page">After</span>
              ) : (
                <Link className="hero__other" href={pair.href}
                      style={{ ['--pair-hover' as string]: pair.hover } as React.CSSProperties}>After</Link>
              )}
            </nav>
          ) : (
            <p className="hero__meta">{BRAND.meta}</p>
          )}
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
        .hero__scrim {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background: linear-gradient(to top,
            rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.18) 30%,
            rgba(0, 0, 0, 0.05) 52%, transparent 66%);
        }
        /* No shadows on the season's opener — the mark and the words sit
           flat on the film, as the design sets them; the gradient above
           is the only shade. */
        .hero.has-scrim .hero__tag,
        .hero.has-scrim .hero__tag :global(span),
        .hero.has-scrim .hero__meta { text-shadow: none; }
        .hero.has-scrim .hero__mark :global(img) { filter: none; }
        .hero__media video {
          width: 100%; height: 100%; object-fit: cover; display: block;
          /* Twenty per cent down. A brightness filter rather than a black
             overlay: the canopy keeps its colour, it just stops competing
             with the green and white type over it. */
          filter: brightness(var(--hero-dim, 0.8));
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

        /* The wash. Both states are drawn at once and a mask decides how
           much of each shows: the other page's mark and words are hidden
           behind a gradient that slides across on hover, so the swap is
           one sweep rather than a crossfade of two pictures.
           --bloom is animated, so the sweep has a direction and a speed. */
        .hero__in :global(.hero__go) {
          position: relative; display: inline-block;
          color: inherit; text-decoration: none;
        }
        .hero__in :global(.hero__go--mark) { line-height: 0; }
        .hero__in :global(.hero__bloom) {
          position: absolute; inset: 0; pointer-events: none;
          color: var(--hero-hover);
          --bloom: 0%;
          mask-image: linear-gradient(var(--hero-sweep, to right), #000 calc(var(--bloom) - 18%), transparent var(--bloom));
          -webkit-mask-image: linear-gradient(var(--hero-sweep, to right), #000 calc(var(--bloom) - 18%), transparent var(--bloom));
          transition: --bloom .65s cubic-bezier(.65, 0, .35, 1);
        }
        .hero__mark :global(img.hero__bloom) { width: 100%; height: 100%; }
        .hero__tag :global(.hero__go--tag) { display: inline-grid; }
        .hero__tag :global(.hero__go--tag) > :global(.hero__ink),
        .hero__tag :global(.hero__go--tag) > :global(.hero__bloom) { grid-area: 1 / 1; }
        .hero__tag :global(.hero__go--tag) > :global(.hero__bloom) { position: static; }
        .hero__tag :global(.hero__go--tag) > :global(.hero__ink) {
          --bloom: 0%;
          mask-image: linear-gradient(var(--hero-sweep, to right), transparent calc(var(--bloom) - 18%), #000 var(--bloom));
          -webkit-mask-image: linear-gradient(var(--hero-sweep, to right), transparent calc(var(--bloom) - 18%), #000 var(--bloom));
          transition: --bloom .65s cubic-bezier(.65, 0, .35, 1);
        }
        .hero__in:has(:global(.hero__go:hover)) :global(.hero__bloom),
        .hero__in:has(:global(.hero__go:focus-visible)) :global(.hero__bloom),
        .hero__in:has(:global(.hero__go:hover)) :global(.hero__go--tag) > :global(.hero__ink),
        .hero__in:has(:global(.hero__go:focus-visible)) :global(.hero__go--tag) > :global(.hero__ink) {
          --bloom: 118%;
          transition: --bloom 1.1s cubic-bezier(.45, 0, .25, 1);
        }
        .hero__tag :global(.hero__go:focus-visible) {
          outline: 1px solid var(--hero-hover); outline-offset: 6px;
        }
        /* Registered, so the sweep travels instead of jumping from one
           state to the other. */
        @property --bloom { syntax: '<percentage>'; inherits: false; initial-value: 0%; }

        /* Before | After. */
        .hero__pair { display: flex; align-items: baseline; gap: .55em; }
        .hero__bar { opacity: .6; font-weight: 400; }
        .hero__pair :global(.hero__other) {
          color: rgba(255, 255, 255, 0.75); text-decoration: none;
          transition: color var(--dur-fast) var(--ease);
        }
        .hero__pair :global(.hero__other:hover),
        .hero__pair :global(.hero__other:focus-visible) { color: var(--pair-hover); }
        .hero__pair :global(.hero__other:focus-visible) {
          outline: 1px solid var(--pair-hover); outline-offset: 4px;
        }
        .hero__meta {
          font-family: var(--font-grotesque), sans-serif;
          font-weight: 800; text-transform: uppercase;
          font-size: clamp(12px, 1.05vw, 20px); line-height: var(--t-label-lh);
          letter-spacing: var(--t-track); color: #fff;
          margin: clamp(10px, 1.6vh, 20px) 0 0;
          text-shadow: 0 1px 18px rgba(0, 0, 0, 0.5);
        }

        /* Phones and small tablets: centred. The desktop split — mark to
           the left edge, words to the right — has nowhere to go once the
           two stack, and stacked flush left they sat against one side of
           the film with the other side empty. Centred, the mark, the
           tagline and the meta line share one axis down the middle. */
        @media (max-width: 899px) {
          /* Even gutters: the desktop's 3.1% / 8.1% split put the centred
             stack visibly right of centre between 720 and 899px. */
          .hero__in { align-items: center; text-align: center; padding-left: var(--gutter, 20px); padding-right: var(--gutter, 20px); }
          /* Half as large again. At the 180px floor the mark was smaller
             than the two lines of tagline under it on a phone, and it is
             the name of the thing. */
          .hero__mark img { width: min(270px, 80vw); }
          /* The opener is centred on a phone, so Before | After sits on
             the same axis as the mark and the line above it. */
          .hero__pair { justify-content: center; }
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
    </section>
  )
}
