'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import Reveal from '@/components/RevealOnScroll'
import ArrowCta from '@/components/ArrowCta'
import { REASON_SECTIONS, reasonHref, type ReasonSectionId } from '@/lib/reason-sections'

/* ═══════════════════════════════════════════════════════════════════════
   THE REASON — the kit its designed pages share.

   The five pages come from one Figma board set (AURA // Coffee Festival)
   and repeat the same handful of blocks. They are built once here, on the
   site's own system rather than the boards' literal values:

     · ground and ink    the night tokens, set by data-theme="night" on
                         the page whatever the reader's theme; the site
                         bar follows (see the global block below)
     · type              h1 / h2 / .h3 / .p1 / .p2 / .label from
                         globals.css; the handwriting is PullQuote's spec
                         (Mynerve, clamp 30–52px)
     · rail              .section-w (1200 + gutter); bleeds to the page
                         edge where the boards bleed
     · spacing           --section-gap between movements, --space-* within
     · motion            Reveal, the site's scroll reveal
     · links             ArrowCta, the site's one link form

   Classes are rk-*, all global: Img, Card and Hand render their own
   roots, which styled-jsx cannot scope (DESIGN-SYSTEM §13).
═══════════════════════════════════════════════════════════════════════ */

/** A photograph in a frame of its own ratio. Without a src the frame
    stands empty, labelled with what belongs in it — a slot waiting for
    its picture, at the size the picture will take. */
export function Img({ src, ratio, alt = '', className = '' }: { src?: string; ratio: string; alt?: string; className?: string }) {
  return (
    <div className={`rk-img ${src ? '' : 'rk-slot'} ${className}`} style={{ aspectRatio: ratio }}>
      {src
        /* eslint-disable-next-line @next/next/no-img-element */
        ? <img src={src} alt={alt} loading="lazy" decoding="async" />
        : <span className="label rk-slot-label">{alt}</span>}
    </div>
  )
}

/** A looping film in the same frame as Img. Muted, so it may play on its
    own; it plays only while on screen, and not at all under reduced
    motion, where the poster stands in — the homepage pillar films behave
    the same way. */
export function Film({ src, srcSmall, poster, ratio, alt, className = '' }: {
  src: string
  /** A lighter cut for phones (≤767px wide). */
  srcSmall?: string
  poster: string; ratio: string; alt: string; className?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = ref.current
    if (!v || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {})
      else v.pause()
    }, { threshold: 0.15 })
    io.observe(v)
    return () => io.disconnect()
  }, [])
  return (
    <div className={`rk-img ${className}`} style={{ aspectRatio: ratio }}>
      <video ref={ref} muted loop playsInline preload="none" poster={poster} aria-label={alt}>
        {srcSmall && <source src={srcSmall} type="video/mp4" media="(max-width: 767px)" />}
        <source src={src} type="video/mp4" />
      </video>
    </div>
  )
}

/** A captioned photograph: the name in .p1, the lines under it in .p2. */
export function Card({ src, ratio, title, alt, children }: { src: string; ratio: string; title: string; alt?: string; children: ReactNode }) {
  return (
    <figure className="rk-card">
      <Img src={src} ratio={ratio} alt={alt ?? title} />
      <figcaption>
        <span className="p1 rk-card-title">{title}</span>
        {children}
      </figcaption>
    </figure>
  )
}

/** Handwritten lines, at PullQuote's size without its rules, under a
    quiet .p2 lead-in. Several lines stand as separate statements. */
export function Hand({ lead, lines }: { lead: string; lines: string[] }) {
  return (
    <section className="rk-sec">
      <div className="section-w">
        <Reveal>
          <div className="rk-centre">
            <p className="p2 rk-lead">{lead}</p>
            {lines.map((l) => <p key={l} className="rk-hand">{l}</p>)}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/** Where to go next, in the site's link form. By default the two Reason
    pages after this one; a page whose board names its own destinations
    passes them as links. */
export function ContinueTo({ from, links }: { from: ReasonSectionId; links?: { href: string; label: string }[] }) {
  const i = REASON_SECTIONS.findIndex((s) => s.id === from)
  const next = links ?? [1, 2].map((k) => {
    const s = REASON_SECTIONS[(i + k) % REASON_SECTIONS.length]
    return { href: reasonHref(s.id), label: s.label }
  })
  return (
    <nav className="rk-continue" aria-label="Continue">
      <span className="label">Continue to</span>
      {next.map((l) => <ArrowCta key={l.href} href={l.href}>{l.label}</ArrowCta>)}
    </nav>
  )
}

/** A page title over a full-screen photograph or film: the h1 role, its
    lede at the h3 size. The tint is the words' contrast floor over any
    picture. A film is muted and loops; the photograph is its poster, and
    under reduced motion the poster is all that shows. */
export function PhotoHero({ src, video, videoSmall, title, lede, alt }: {
  src?: string; video?: string
  /** What the picture or film shows. Left out, it is decorative. */
  alt?: string
  /** A lighter cut of the film for phones (≤767px wide), so a phone does
      not download the full-size film on opening the page. */
  videoSmall?: string
  title: string; lede: string
}) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = ref.current
    if (!v || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    v.play().catch(() => {})
  }, [])
  return (
    <header className="rk-hero">
      {video ? (
        <video
          ref={ref} className="rk-hero-img" muted loop playsInline preload="auto" poster={src}
          {...(alt ? { 'aria-label': alt } : { 'aria-hidden': true })}
        >
          {videoSmall && <source src={videoSmall} type="video/mp4" media="(max-width: 767px)" />}
          <source src={video} type="video/mp4" />
        </video>
      ) : src ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img className="rk-hero-img" src={src} alt={alt ?? ''} decoding="async" fetchPriority="high" />
      ) : (
        /* No picture yet: the card ground stands in, as Img's slot does. */
        <div className="rk-hero-img rk-slot" aria-hidden />
      )}
      <div className="rk-hero-in">
        <h1>{title}</h1>
        <p className="h3 rk-hero-lede">{lede}</p>
      </div>
    </header>
  )
}

/** The dark page every designed Reason page sits on, with the kit's styles. */
export function ReasonDark({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`rk-page ${className}`} data-theme="night">
      {children}

      <style jsx global>{`
        /* The site bar over a dark page. In day mode its tokens are
           pointed at the contrast set — the night values — so the bar is
           the same ground as the page; in night mode it already is. The
           logo stops inverting for the same reason. */
        [data-theme="day"]:has(.rk-page) .aura-nav {
          --bg: var(--contrast-bg);
          --text: var(--contrast-text);
          --text-body: var(--contrast-text-body);
          --text-muted: var(--contrast-text-muted);
          --border: var(--contrast-border);
        }
        [data-theme="day"]:has(.rk-page) .aura-nav .invert-on-light { filter: none; }

        .rk-page { background: var(--bg); color: var(--text); overflow-x: clip; }

        /* ── photo hero ── */
        .rk-hero {
          position: relative; min-height: 100svh; overflow: hidden;
          display: grid; place-items: center; text-align: center;
          padding: calc(var(--nav-h) + var(--space-8)) var(--gutter) var(--space-8);
        }
        .rk-hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .rk-hero::after { content: ''; position: absolute; inset: 0; background: rgb(0 0 0 / 0.32); }
        .rk-hero-in { position: relative; z-index: 1; }
        .rk-hero h1 { margin: 0; color: var(--text); }
        .rk-hero-lede { margin: var(--space-5) auto 0; max-width: 28ch; }

        /* ── rhythm ── */
        .rk-sec { padding: var(--section-gap) 0; }
        .rk-sec-tight { padding-bottom: var(--space-7); }
        .rk-sec-flush { padding-top: 0; }
        .rk-centre { text-align: center; max-width: 880px; margin: 0 auto; }
        .rk-centre-body { max-width: 46ch; margin: var(--space-5) auto 0; }
        .rk-centre-prose { max-width: 60ch; margin: var(--space-8) auto 0; }
        .rk-centre-prose .p1 + .p1 { margin-top: var(--space-4); }
        .rk-lead { margin: 0 0 var(--space-5); }
        .rk-hand {
          font-family: var(--font-hand), cursive;
          font-size: clamp(30px, 4vw, 52px); line-height: 1.25;
          color: var(--text); margin: 0 auto; text-wrap: balance;
          /* A reading width, so each line breaks into the two or three
             the boards set it in rather than running the rail. */
          max-width: 640px;
        }
        .rk-hand + .rk-hand { margin-top: var(--space-7); }
        .rk-head { max-width: 560px; margin-bottom: var(--space-8); }
        .rk-head h2 { margin: 0 0 var(--space-5); }
        .rk-prose { max-width: 560px; }
        .rk-prose h2 { margin: 0 0 var(--space-6); }
        .rk-prose .p1 + .p1 { margin-top: var(--space-4); }
        .rk-after { margin-top: var(--space-8) !important; }
        .rk-part { margin: 0 0 var(--space-5); }

        /* ── pictures ── */
        .rk-img { position: relative; overflow: hidden; border-radius: var(--radius-1); background: var(--bg-card); }
        .rk-img img, .rk-img video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
        .rk-full { border-radius: 0 !important; }
        /* An empty slot: the card ground with a hairline, and the name of
           the picture it is waiting for. */
        .rk-slot { background: var(--bg-card); box-shadow: inset 0 0 0 1px var(--border); }
        .rk-slot-label {
          position: absolute; inset: 0; display: grid; place-items: center;
          padding: var(--space-5); text-align: center; color: var(--text-muted);
        }
        .rk-centred-img { max-width: 880px; margin: var(--space-8) auto 0; }
        .rk-wide { width: min(100% - 2 * var(--gutter), 1600px); margin: 0 auto; }

        /* ── cards ── */
        .rk-grid { display: grid; gap: var(--space-6); }
        .rk-grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .rk-grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .rk-card { margin: 0; }
        .rk-card figcaption, .rk-pair { display: flex; flex-direction: column; gap: var(--space-1, 4px); margin: var(--space-4) 0 0; max-width: 52ch; }
        .rk-card figcaption .p2 + .p2 { margin-top: var(--space-3); }
        .rk-card-title { color: var(--text); }
        .rk-pairs { margin-top: var(--space-6); }
        .rk-pairs .rk-pair { margin: 0; }

        /* ── bleeds: a picture to the page edge beside the rail ── */
        .rk-bleed {
          display: grid; align-items: start; column-gap: var(--grid-gap);
          /* the copy column's outer edge sits on the rail */
          --rail: max(var(--gutter), (100vw - var(--max-w)) / 2 + var(--gutter));
        }
        .rk-bleed-left { grid-template-columns: 46% 1fr; }
        .rk-bleed-left .rk-bleed-copy { padding-right: var(--rail); padding-top: var(--space-9); }
        .rk-bleed-right { grid-template-columns: 1fr 46%; }
        .rk-bleed-right .rk-bleed-copy { padding-left: var(--rail); }
        .rk-bleed-even { align-items: center; }
        .rk-bleed .rk-img { border-radius: 0; }
        .rk-inset { width: min(260px, 60%); margin-top: var(--space-8); border-radius: var(--radius-1) !important; }
        .rk-inset-offset { margin-left: 22%; }

        /* ── close ── */
        /* Only the centred closing statement. Written as .rk-close h2 it
           also caught a left-set heading in a closing section and took
           away the space under it. */
        .rk-close h2.rk-centre { margin: 0 auto; }
        .rk-accent { display: block; color: var(--brand-accent); margin-top: var(--space-3); }
        .rk-continue {
          display: flex; flex-wrap: wrap; align-items: center; justify-content: center;
          gap: var(--space-4) var(--space-6); margin-top: var(--space-9);
          color: var(--text);
        }

        @media (max-width: 767px) {
          .rk-grid-3, .rk-grid-2 { grid-template-columns: minmax(0, 1fr); }
          .rk-bleed-left, .rk-bleed-right { grid-template-columns: minmax(0, 1fr); row-gap: var(--space-7); }
          .rk-bleed-left .rk-bleed-copy, .rk-bleed-right .rk-bleed-copy { padding: 0 var(--gutter); }
          .rk-bleed-right .rk-bleed-copy { order: 2; }
          .rk-inset-offset { margin-left: 0; }
          .rk-pairs { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
      `}</style>
    </div>
  )
}
