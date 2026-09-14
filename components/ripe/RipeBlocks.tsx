'use client'

import { useReveal } from './useReveal'
import { useGround } from './RipeBackdrop'
import { OPENING, OPENING_MARK, INTRO, ARCS, PREPARED, CLOSING, GRATITUDE, REGISTRY, HARVEST } from './copy'
import { RipeReveal } from './RipeReveal'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/* ── RIPE sections ───────────────────────────────────────────────────
   The page sits on #000000 from the opener to the last line — that is
   the frame's own fill in the design, and none of the sections carry a
   ground of their own. The three handwritten display strings ship as
   artwork in /public/RIPE, two of them already white, so they are placed
   as images rather than reset as type and need no inversion here.
─────────────────────────────────────────────────────────────────────── */

/* ── The second fold ─────────────────────────────────────────────────
   The 60px opening statement, then the intro beside the calf.

   Both blocks brighten word by word as they rise, which is the reveal
   the site already uses — but over runs rather than a string, because
   the design lifts particular words into the brand green and a plain
   string cannot carry that. See RipeReveal.

   The calf is scroll-linked rather than triggered: it comes up and in
   across its own entry, so the movement belongs to the scroll instead
   of firing once at a threshold.
─────────────────────────────────────────────────────────────────────── */
/* The intro is set as one paragraph. The copy keeps the design's line
   breaks; here they become spaces, so it reads as a single passage rather
   than five separate text boxes. */
const flow = (text: string) => text.replace(/\n/g, ' ')
const INTRO_FLOW = INTRO.map((r) => (typeof r === 'string' ? flow(r) : { ...r, g: flow(r.g) }))

export function RipeOpening() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const m = el.querySelector<HTMLElement>('.open__mark')
      if (m) { m.style.opacity = '1'; m.style.transform = 'none' }
      return
    }
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.fromTo('.open__mark',
        { autoAlpha: 0, y: 70, scale: 0.96 },
        {
          autoAlpha: 1, y: 0, scale: 1, ease: 'none',
          scrollTrigger: {
            trigger: '.open__mark',
            start: 'top bottom-=5%',
            end: 'center center+=12%',
            scrub: true,
          },
        })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="open">
      <div className="section-w">
        <RipeReveal runs={OPENING} className="open__say" as="h2" />

        <div className="open__row">
          <RipeReveal runs={INTRO_FLOW} className="open__intro" />
          <figure className="open__mark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={OPENING_MARK.src} alt={OPENING_MARK.alt}
                 width={OPENING_MARK.w} height={OPENING_MARK.h}
                 loading="lazy" decoding="async" />
          </figure>
        </div>
      </div>

      <style jsx>{`
        .open { padding: var(--ripe-section-gap) 0 clamp(64px, 12vh, 170px); }
        /* Rendered as an h2, so size, leading and tracking come from
           that role in globals — the same treatment the homepage reveal
           uses — on the same 760px measure. */
        .open :global(.open__say) {
          margin: 0; max-width: 760px; text-wrap: pretty;
          color: #fff;
        }

        .open__row {
          display: grid; grid-template-columns: minmax(0, 1fr);
          gap: clamp(40px, 6vw, 80px); align-items: center;
          margin: clamp(56px, 10vh, 140px) 0 0;
        }
        /* Side by side from 1100: at 900 a third of the row was a 224px
           column of intro. */
        @media (min-width: 1100px) {
          .open__row { grid-template-columns: minmax(0, 33%) 1fr; }
        }
        .open :global(.open__intro) {
          font-size: var(--t-p1-size); line-height: var(--t-p1-lh);
          letter-spacing: var(--t-track); color: #fff; margin: 0;
          text-wrap: pretty;
        }
        .open__mark { margin: 0; justify-self: center; }
        .open__mark img {
          display: block; width: clamp(220px, 30vw, 550px); height: auto;
          mix-blend-mode: screen;
        }
        @media (min-width: 1100px) { .open__mark { justify-self: end; } }
        @media (max-width: 1099px) {
          .open__mark { margin-top: var(--sp-cluster); }
          .open__mark img { width: min(330px, 85vw); }
        }
      `}</style>
    </section>
  )
}

/* ── A display heading set as artwork ────────────────────────────── */
export function RipeDisplay({
  id, src, alt, width, height, max = 1344,
  bare = false,
}: { id?: string; src: string; alt: string; width: number; height: number; max?: number
     /** Rendered inside another section's ground, so it brings no padding
         or rail of its own. */
     bare?: boolean }) {
  const ref = useReveal<HTMLElement>()
  return (
    <section ref={ref} id={id} className={`disp ${bare ? 'is-bare' : ''}`}>
      {/* The rail is kept in both modes — `bare` drops the section's own
          vertical padding, not its gutters. Without it this heading ran
          the full width of the viewport and off both edges. */}
      <div className="section-w">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async"
             style={{ maxWidth: max }} />
      </div>
      <style jsx>{`
        .disp { padding: var(--ripe-section-gap) 0 var(--sp-cluster); }
        .disp.is-bare { padding: var(--sp-cluster) 0 0; }
        .disp :global(img) {
          display: block; width: 100%; height: auto;
          opacity: 0; transform: translateY(20px);
          transition: opacity 1s var(--ease-out), transform 1s var(--ease-out);
        }
        .disp.is-in :global(img) { opacity: 1; transform: translateY(0); }
      `}</style>
    </section>
  )
}

/* ── Two arcs ────────────────────────────────────────────────────── */
export function RipeArcs() {
  const root = useRef<HTMLElement>(null)
  /* The page's ground becomes the dawn here rather than this section
     carrying a picture of its own. */
  useGround('dawn', root, 'arcs')

  /* The dawn gradient arrives before the words and leaves after them.
     In the file it is the backdrop spanning this region (2432x2286 at
     y8659), so it is a ground here rather than a picture in the column.
     Scroll-linked throughout: the image fades up, the words settle over
     it, the words go, and only then does the ground let go. */
  useEffect(() => {
    const el = root.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.querySelectorAll<HTMLElement>('.arcs__in')
        .forEach((n) => { n.style.opacity = '1'; n.style.transform = 'none' })
      return
    }
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.fromTo('.arcs__in', { autoAlpha: 0, y: 48 }, {
        autoAlpha: 1, y: 0, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom-=40%', end: 'top top+=10%', scrub: true },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="arcs">
      <div className="section-w arcs__in">
        <h2 className="arcs__h">{ARCS.title}</h2>
        <div className="arcs__note">
          <p>{ARCS.note.join(' ')}</p>
        </div>
        <div className="arcs__grid">
          {ARCS.columns.map((c) => (
            <div key={c.title} className="arc">
              <h3 className="arc__t">{c.title}</h3>
              <p className="arc__d">{c.dates}</p>
              <ul className="arc__s">
                {c.steps.map((x) => <li key={x}>{x}</li>)}
              </ul>
            </div>
          ))}
        </div>

      </div>


      <style jsx>{`
        /* Flowing, not pinned. This was two viewports tall with the
           words held on the screen inside it, which meant a reader had
           to scroll a screen and a half past a block that never moved.
           The dawn is a page-level ground and it fades up and away on
           its own, so the section does not have to stand still to give
           it room — it is one screen of words that scrolls like the rest
           of the page. */
        .arcs {
          position: relative;
          width: 100vw; margin-left: calc(50% - 50vw);
          padding: var(--ripe-section-gap) 0;
        }
        .arcs__in { position: relative; z-index: 1; width: 100%; }
        /* Same size as the opening statement: no size of its own, so the
           site's h2 role sets it, as it does for .open__say. */
        .arcs__h {
          font-family: var(--font-grotesque), sans-serif; font-weight: 400;
          color: #fff; margin: 0; max-width: 20ch;
        }
        .arcs__note { margin: var(--sp-group) 0 0; max-width: 46ch; }
        .arcs__note :global(p) {
          font-family: var(--font-grotesque), sans-serif; font-weight: 300;
          font-size: var(--t-p1-size); line-height: var(--t-p1-lh);
          letter-spacing: var(--t-track); color: #fff; margin: 0 0 0.9em;
          text-wrap: pretty;
        }
        /* Two columns at every width. The two seasons are a pair — the
           first three days and the five after — and stacked on a phone
           they read as one long list. Each column holds a short heading,
           a date and three words, so it fits at phone width; the gap is
           tighter there so the columns keep their room. */
        .arcs__grid {
          display: grid; gap: clamp(20px, 5vw, 64px);
          grid-template-columns: repeat(2, minmax(0, 1fr));
          margin: var(--sp-cluster) 0 0;
        }
        @media (min-width: 760px) { .arcs__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); max-width: 62ch; } }
        .arc__t {
          font-family: var(--font-grotesque), sans-serif; font-weight: 600;
          text-transform: uppercase;
          font-size: var(--t-cardhead-size); line-height: var(--t-cardhead-lh);
          letter-spacing: var(--t-track); color: #fff; margin: 0 0 8px;
        }
        .arc__d {
          font-size: var(--t-body-size); line-height: var(--t-body-lh);
          letter-spacing: var(--t-track); color: var(--ripe-green); margin: 0 0 var(--space-4);
        }
        .arc__s { list-style: none; margin: 0; padding: 0; }
        .arc__s li {
          font-size: var(--t-body-size); line-height: var(--t-body-lh);
          letter-spacing: var(--t-track); color: #fff; margin: 0 0 6px;
        }
      `}</style>
    </section>
  )
}

/* ── Come prepared ───────────────────────────────────────────────── */
export function RipePrepared() {
  const ref = useReveal<HTMLElement>()
  return (
    <section ref={ref} className="prep">
      <div className="section-w">
        <RipeReveal runs={PREPARED.lead} className="prep__lead" as="h2" />

        <h2 className="prep__h">{PREPARED.showUp.title}</h2>
        <div className="prep__grid">
          {PREPARED.showUp.cards.map((c) => (
            <div key={c.title} className="card">
              <h3 className="card__t">{c.title}</h3>
              <p className="card__b">{c.body}</p>
            </div>
          ))}
        </div>

        {/* Generated with Higgsfield from the cap and the calf as
            references, so the kit is drawn in the same green engraving. */}
        {/* Not lazy, like the cap below: a lazy image only started loading
            as it reached the screen, so the scroll fade had already run by
            the time it arrived and it appeared all at once. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="prep__kit" src="/RIPE/aura-bring.jpg" alt=""
             aria-hidden decoding="async" />
        <h2 className="prep__h">{PREPARED.bring.title}</h2>
        <div className="prep__grid prep__grid--bring">
          {PREPARED.bring.cards.map((c) => (
            <div
              key={c.title}
              className="card"
              /* The design's column, carried as a variable and applied only
                 at the three-column width. Inline it pinned the card at every
                 width, and on a narrower grid a pin to column 2 or 3 invents
                 that column — the cards stopped flowing and one sat off to
                 the side with its neighbour cut. */
              style={'column' in c && c.column
                ? ({ ['--col' as string]: String(c.column) } as React.CSSProperties)
                : undefined}
            >
              <h3 className="card__t">{c.title}</h3>
              {/* The dress note leads this card in the later artwork. */}
              {/* The dress note and its clothing line read as one sentence:
                  the note in periwinkle, the rest in white. */}
              {c.note ? (
                <p className="card__b"><span className="card__n">{c.note}</span> {c.list?.join(' ')}.</p>
              ) : c.list && (
                <ul className="card__l">{c.list.map((l) => <li key={l}>{l}</li>)}</ul>
              )}
              {c.body && <p className="card__b">{c.body}</p>}
            </div>
          ))}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="prep__mark" src={PREPARED.bring.mark.src} alt=""
               aria-hidden width={PREPARED.bring.mark.w} height={PREPARED.bring.mark.h}
               decoding="async" />
        </div>
      </div>
      <style jsx>{`
        .prep { padding: 0 0 var(--ripe-section-gap); }
        .prep :global(.prep__lead) {
          font-family: var(--font-grotesque), sans-serif; font-weight: 400;
          color: #fff;
          margin: 0 0 clamp(56px, 10vh, 130px); max-width: 24ch;
          text-wrap: pretty;
        }
        .prep__h {
          font-family: var(--font-grotesque), sans-serif; font-weight: 400;
          letter-spacing: var(--t-track); color: #fff;
          margin: var(--sp-cluster) 0 clamp(34px, 5.5vh, 76px);
        }
        .prep__h:first-of-type { margin-top: 0; }
        /* What to bring is a new list, not the next row of How to show
           up, so it gets more air above it than a card gap. */
        .prep__grid + .prep__kit { margin-top: calc(var(--sp-cluster) * 1.8); }
        /* Boots, bottle and towel on the left, answering the cap on the
           right at the end of the list. */
        .prep__kit {
          display: block; width: min(340px, 55%); height: auto;
          margin-bottom: var(--sp-cluster);
          /* A step down from the generated file's green, so it sits with
             the cap and the calf rather than glowing brighter than both. */
          filter: brightness(0.8);
        }
        .prep__kit + .prep__h { margin-top: 0; }
        /* The cap closes the list on the right, on its own row. */
        .prep__mark {
          grid-column: 1 / -1; justify-self: end;
          display: block; width: min(380px, 56%); height: auto;
        }
        /* start, not stretch: a card in a short column was being pulled
           to the height of the tallest one in its row, which put a hole
           under Evening the size of the Field list beside it. */
        /* Row gap deliberately tighter than the gap above the heading:
           the six cards are one cluster, and the heading belongs to them
           rather than sitting equidistant between two blocks. */
        .prep__grid {
          display: grid; align-items: start;
          gap: clamp(30px, 4.5vh, 60px) clamp(28px, 5vw, 72px);
          grid-template-columns: 1fr;
          opacity: 0; transform: translateY(18px);
          transition: opacity .9s var(--ease-out), transform .9s var(--ease-out);
        }
        .prep.is-in .prep__grid { opacity: 1; transform: translateY(0); }
        @media (min-width: 680px) { .prep__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (min-width: 1040px) {
          .prep__grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .prep__grid .card { grid-column: var(--col, auto); }
          /* Field is the long list. Spanning it down two rows lets Making
             sit straight under Evening instead of below the bottom of
             Field, and the wider gutter keeps Evening's longer lines off
             the Useful column. */
          .prep__grid--bring { column-gap: clamp(56px, 7vw, 120px); }
          .prep__grid--bring .card:first-child { grid-row: span 2; }
        }
        /* Type follows the columns: P1 while How to show up is a single
           column, P2 once it pairs up. What to bring is two columns at
           every width, so it stays P2. */
        @media (max-width: 679px) {
          .prep__grid:not(.prep__grid--bring) .card__b {
            font-size: var(--t-p1-size); line-height: var(--t-p1-lh);
          }
        }
        /* What to bring is four short lists, so it pairs up on a phone. */
        @media (max-width: 679px) {
          .prep__grid--bring { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        .card__t {
          font-family: var(--font-grotesque), sans-serif; font-weight: 600;
          text-transform: uppercase;
          font-size: var(--t-cardhead-size); line-height: var(--t-cardhead-lh);
          letter-spacing: var(--t-track); color: #fff; margin: 0 0 10px;
        }
        .card__l li {
          font-size: var(--t-body-size); line-height: var(--t-body-lh);
          letter-spacing: var(--t-track); color: #fff; margin: 0 0 6px;
          text-wrap: pretty;
        }
        .card__b {
          font-size: var(--t-body-size); line-height: var(--t-body-lh);
          letter-spacing: var(--t-track); color: #fff;
          margin: 0 0 clamp(40px, 6vh, 80px);
          text-wrap: pretty;
        }
        .card__l { list-style: none; margin: 0; padding: 0; }
        /* The grid's row gap is what separates the rows. A trailing
           margin on the last thing in a card stacks on top of it, which
           is what pushed the second row of each block a hundred pixels
           further down than the gap asked for. */
        .card > :last-child { margin-bottom: 0; }
        /* The design's single periwinkle, on its one line. */
        .card__n {
          font-family: var(--font-grotesque), sans-serif; font-weight: 400;
          font-size: var(--t-body-size); line-height: var(--t-body-lh);
          letter-spacing: var(--t-track); color: var(--ripe-indigo);
          margin: 0;
        }
      `}</style>
    </section>
  )
}

/* ── Closing pairs + the last line ───────────────────────────────── */
/* The scatter, as eight photographs in three sizes around the words.
   Size is depth: L is near — sharp, full strength, drifting fastest; M sits
   in the middle; S is far — soft, dimmer, drifting slowest. The parallax is
   what makes the sizes read as distance rather than as three thumbnails. As
   the section arrives they come up one at a time in `order`, and as it
   leaves they go again in the same order. Positions follow the reference
   scatter: a hollow middle for the words, photographs around it. */
type Shot = { src: string; x: number; y: number; size: 'L' | 'M' | 'S'; order: number }
const SCATTER: Shot[] = [
  { src: '/RIPE/collage/aura-collage-01.jpg', x: 27, y: 12, size: 'S', order: 1 },
  { src: '/RIPE/collage/aura-collage-02.jpg', x: 76, y: 11, size: 'M', order: 0 },
  { src: '/RIPE/collage/aura-collage-03.jpg', x: 6,  y: 33, size: 'M', order: 2 },
  { src: '/RIPE/collage/aura-collage-04.jpg', x: 93, y: 35, size: 'S', order: 3 },
  { src: '/RIPE/collage/aura-collage-05.jpg', x: 20, y: 51, size: 'L', order: 4 },
  { src: '/RIPE/collage/aura-collage-06.jpg', x: 79, y: 56, size: 'M', order: 5 },
  { src: '/RIPE/collage/aura-collage-07.jpg', x: 9,  y: 84, size: 'L', order: 6 },
  { src: '/RIPE/collage/aura-collage-08.jpg', x: 92, y: 82, size: 'L', order: 7 },
]
const DEPTH = {
  S: { blur: 2.4, peak: 0.6,  drift: 0.12 },
  M: { blur: 0.9, peak: 0.85, drift: 0.24 },
  L: { blur: 0,   peak: 1,    drift: 0.42 },
} as const

export function RipeClosing() {
  const ref = useReveal<HTMLElement>()
  const scatter = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = ref.current, box = scatter.current
    if (!section || !box) return
    const figs = Array.from(box.querySelectorAll<HTMLElement>('.close__shot'))
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const n = SCATTER.length
    const update = () => {
      const vh = window.innerHeight
      const r = section.getBoundingClientRect()
      /* 0 as the section's top reaches the bottom of the screen, 1 as its
         bottom leaves the top. */
      const t = Math.min(Math.max((vh - r.top) / (vh + r.height), 0), 1)
      figs.forEach((el, i) => {
        const s = SCATTER[i], d = DEPTH[s.size]
        if (reduced) {
          el.style.opacity = String(d.peak)
          el.style.transform = 'translate(-50%, -50%)'
          el.style.filter = d.blur ? `blur(${d.blur}px)` : 'none'
          return
        }
        const k = s.order / (n - 1)
        const inStart = 0.1 + k * 0.22, outStart = 0.58 + k * 0.22, span = 0.12
        const up = Math.min(Math.max((t - inStart) / span, 0), 1)
        const down = Math.min(Math.max((t - outStart) / span, 0), 1)
        const ease = (x: number) => 1 - Math.pow(1 - x, 3)
        const v = ease(up) * (1 - ease(down))
        const lift = (0.5 - t) * vh * d.drift
        const scale = 0.86 + 0.14 * ease(up) + 0.04 * ease(down)
        el.style.opacity = (v * d.peak).toFixed(3)
        el.style.transform = `translate(-50%, calc(-50% + ${lift.toFixed(1)}px)) scale(${scale.toFixed(4)})`
        el.style.filter = `blur(${(d.blur + (1 - v) * 4).toFixed(2)}px)`
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [ref])

  return (
    <section ref={ref} className="close">
      <div ref={scatter} className="close__scatter" aria-hidden>
        {SCATTER.map((s) => (
          <figure key={s.src} className={`close__shot is-${s.size}`}
                  style={{ ['--x' as string]: `${s.x}%`, ['--xm' as string]: `${s.x < 50 ? 8 : 92}%`, ['--y' as string]: `${s.y}%` } as React.CSSProperties}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.src} alt="" width={340} height={426} decoding="async" />
          </figure>
        ))}
      </div>
      <div className="section-w close__in">
        {/* The Union node at the centre of the scatter is the aura mark. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="close__mark" src="/RIPE/aura-wordmark.svg" alt="Aura"
             loading="lazy" decoding="async" />
        <div className="close__col">
          <h2 className="close__t">{CLOSING.title}</h2>
          <ul className="close__l">
            {CLOSING.pairs.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>
        <p className="close__art">{CLOSING.hand}</p>
      </div>
      <style jsx>{`
        .close {
          position: relative; overflow: hidden;
          min-height: 100dvh;
          display: flex; align-items: center;
          padding: var(--ripe-section-gap) 0;
        }
        .close__scatter { position: absolute; inset: 0; pointer-events: none; }
        .close__shot {
          position: absolute; left: var(--x); top: var(--y); margin: 0;
          opacity: 0; transform: translate(-50%, -50%);
          will-change: opacity, transform, filter;
        }
        .close__shot img { display: block; width: 100%; height: auto; aspect-ratio: 4 / 5; object-fit: cover; }
        .close__shot.is-L { width: clamp(84px, 11vw, 220px); }
        .close__shot.is-M { width: clamp(66px, 8.2vw, 165px); }
        .close__shot.is-S { width: clamp(50px, 5.6vw, 112px); }
        /* Below 600px the words take the middle of the screen, so the
           photographs keep to the two edges (--xm), in the same three
           sizes, scaled down. */
        @media (max-width: 599px) {
          .close__shot { left: var(--xm); }
          .close__shot.is-L { width: 64px; }
          .close__shot.is-M { width: 52px; }
          .close__shot.is-S { width: 42px; }
        }
        .close__in { position: relative; z-index: 1; }
        /* A full screen of height centres the block in black on a phone. */
        @media (max-width: 899px) { .close { min-height: 0; } }
        .close__mark {
          display: block; width: clamp(150px, 17vw, 250px); height: auto;
          margin: 0 auto clamp(32px, 5vh, 64px);
          opacity: 0; transform: translateY(14px);
          transition: opacity .9s var(--ease-out), transform .9s var(--ease-out);
        }
        .close.is-in .close__mark { opacity: 1; transform: translateY(0); }
        .close__col {
          max-width: 30ch; margin-inline: auto; text-align: center;
          opacity: 0; transform: translateY(18px);
          transition: opacity .9s var(--ease-out), transform .9s var(--ease-out);
        }
        .close.is-in .close__col { opacity: 1; transform: translateY(0); }
        .close__t {
          font-family: var(--font-grotesque), sans-serif; font-weight: 600;
          text-transform: uppercase;
          font-size: var(--t-cardhead-size); line-height: var(--t-cardhead-lh);
          letter-spacing: var(--t-track); color: #fff; margin: 0 0 var(--space-5);
        }
        .close__l { list-style: none; margin: 0; padding: 0; }
        .close__l li {
          font-size: var(--t-p1-size); line-height: var(--t-p1-lh);
          letter-spacing: var(--t-track); color: #fff; margin: 0 0 6px;
        }
        /* Was an 845px SVG of these words, which put one line of hand
           on the page at ten times the size of every other. Set as type
           it takes the hand role, at the size the beat quotes use.

           And it writes itself on, the same way they do: --wipe is a
           registered custom property, so a plain transition animates it
           and the mask edge travels across the line stroke by stroke.
           No timeline needed for a thing that happens once. */
        .close__art {
          font-family: var(--font-hand), cursive;
          font-size: var(--t-hand-size); line-height: var(--t-hand-lh);
          letter-spacing: 0; color: #fff; text-align: center;
          max-width: 26ch;
          margin: clamp(56px, 10vh, 140px) auto 0;
          --wipe: 0%;
          -webkit-mask-image: linear-gradient(to right,
            #000 calc(var(--wipe) - 7%), transparent var(--wipe));
          mask-image: linear-gradient(to right,
            #000 calc(var(--wipe) - 7%), transparent var(--wipe));
          transition: --wipe 1.5s var(--ease-out) .25s;
        }
        .close.is-in .close__art { --wipe: 112%; }
        @media (prefers-reduced-motion: reduce) {
          .close__art { --wipe: 112%; transition: none; }
        }
      `}</style>
    </section>
  )
}

/* ── Gratitude ───────────────────────────────────────────────────── */
export function RipeGratitude() {
  const ref = useReveal<HTMLElement>()
  return (
    <section ref={ref} id="gratitude" className="grat">
      <div className="section-w grat__in">
        <figure className="grat__fig">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/RIPE/aura-gratitude.jpg" alt="A brass bell hanging on a rope by the house"
               width={540} height={797} loading="lazy" decoding="async" />
        </figure>
        <div className="grat__col">
          <h2 className="grat__h">{GRATITUDE.title}</h2>
          <p className="grat__b">{GRATITUDE.body.join(' ')}</p>
        </div>
      </div>
      <style jsx>{`
        .grat { padding: var(--ripe-section-gap) 0; }
        .grat__in {
          display: grid; gap: clamp(32px, 5vw, 80px);
          grid-template-columns: 1fr; align-items: center;
        }
        /* The photograph takes at most 45% of the row and never more than
           its own 540px. A fixed 540px column left the words 93px wide at
           a 900px screen — one word to a line, and the heading 2px past the
           edge — and still under 250px at 1024. */
        @media (min-width: 900px) { .grat__in { grid-template-columns: minmax(0, min(540px, 45%)) minmax(0, 1fr); } }
        .grat__fig { margin: 0; }
        .grat__fig img {
          display: block; width: 100%; height: auto; aspect-ratio: 540 / 797;
          object-fit: cover;
          opacity: 0; transition: opacity 1s var(--ease-out);
        }
        .grat.is-in .grat__fig img { opacity: 1; }
        .grat__col {
          max-width: 40ch;
          opacity: 0; transform: translateY(18px);
          transition: opacity .9s var(--ease-out) .15s, transform .9s var(--ease-out) .15s;
        }
        .grat.is-in .grat__col { opacity: 1; transform: translateY(0); }
        .grat__h {
          font-family: var(--font-grotesque), sans-serif; font-weight: 400;
          letter-spacing: var(--t-track); color: #fff; margin: 0 0 var(--space-6);
        }
        .grat__b {
          font-size: var(--t-p1-size); line-height: var(--t-p1-lh);
          letter-spacing: var(--t-track); color: rgba(255,255,255,0.88);
          margin: 0 0 0.8em; text-wrap: pretty;
        }
      `}</style>
    </section>
  )
}

/* ── Tree registry ───────────────────────────────────────────────── */
export function RipeRegistry() {
  const ref = useReveal<HTMLElement>()
  useGround('forest', ref, 'registry')
  const tree = useRef<HTMLImageElement>(null)

  /* The coffee plant grows in with the scroll: it is uncovered from the
     base of the stem upward while it rises a little from where it stands,
     so the leaves and flowers at the crown arrive last. Scroll position,
     not a clock, so it grows back down when the reader scrolls up. */
  useEffect(() => {
    const el = tree.current
    if (!el) return
    el.style.transition = 'none'
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.opacity = '1'; el.style.transform = 'none'; el.style.clipPath = 'none'
      return
    }
    const update = () => {
      const vh = window.innerHeight
      const r = el.getBoundingClientRect()
      const p = Math.min(Math.max((vh * 0.95 - r.top) / (vh * 0.55), 0), 1)
      const e = 1 - Math.pow(1 - p, 2)
      el.style.opacity = Math.min(1, p * 3).toFixed(3)
      el.style.clipPath = `inset(${((1 - e) * 100).toFixed(2)}% -10% 0 -10%)`
      el.style.transform = `translateY(${((1 - e) * 24).toFixed(1)}px) scale(${(0.94 + e * 0.06).toFixed(4)})`
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])
  return (
    <section ref={ref} className="reg">
      <div className="section-w reg__in">
        <div className="reg__col">
        <h2 className="reg__h">{REGISTRY.title}</h2>
        <p className="reg__b">
          <span className="reg__lead">{REGISTRY.lead[0]}</span>{REGISTRY.lead[1]} {REGISTRY.body.join(' ')}
        </p>
        <dl className="reg__table">
          {REGISTRY.rows.map(([k, v]) => (
            <div key={k} className="reg__row">
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={tree} className="reg__mark" src={REGISTRY.mark.src} alt="" aria-hidden
             decoding="async" />
      </div>
      <style jsx>{`
        /* The deep green ground the artwork puts under this block, and
           the plant standing in the right-hand half of it. */
        .reg { padding: var(--ripe-section-gap) 0; }
        .reg__in {
          display: grid; grid-template-columns: minmax(0, 1fr);
          gap: clamp(40px, 6vw, 90px); align-items: center;
        }
        /* Two columns from 1200: the heading is the large h2 now, and in the
           left half of a 1024 screen it ran to four lines. */
        @media (min-width: 1200px) { .reg__in { grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr); } }
        .reg__lead { color: var(--ripe-green); }
        .reg__mark {
          display: block; width: 100%; max-width: 520px; height: auto;
          justify-self: center;
          opacity: 0; transform: translateY(20px);
          transition: opacity 1s var(--ease-out) .15s, transform 1s var(--ease-out) .15s;
          transform-origin: 50% 100%;
        }
        .reg.is-in .reg__mark { opacity: 1; transform: translateY(0); }
        .reg__h {
          font-family: var(--font-grotesque), sans-serif; font-weight: 400;
          letter-spacing: var(--t-track); color: #fff; margin: 0 0 var(--space-6);
          max-width: 18ch;
        }
        .reg__b {
          font-size: var(--t-p1-size); line-height: var(--t-p1-lh);
          letter-spacing: var(--t-track); color: rgba(255,255,255,0.88);
          margin: 0 0 0.8em; max-width: 46ch; text-wrap: pretty;
        }
        /* The site's table interface — SpecTable in components/article —
           in this page's colours: a heavy rule over faint dotted rows, the
           key as a DM Mono uppercase label, the value in the grotesque at
           the p2 size, set on the same baseline. White on the forest ground
           stands in for the theme tokens SpecTable reads, which follow day
           and night where this page is dark in both. */
        .reg__table {
          margin: var(--sp-cluster) 0 0; padding: 0; max-width: 693px;
          border-top: 1.5px solid rgba(255,255,255,0.55);
          opacity: 0; transform: translateY(16px);
          transition: opacity .9s var(--ease-out), transform .9s var(--ease-out);
        }
        .reg.is-in .reg__table { opacity: 1; transform: translateY(0); }
        .reg__row {
          display: flex; justify-content: space-between; align-items: baseline;
          gap: clamp(16px, 4vw, 48px);
          padding: 20px 0; margin: 0;
          border-bottom: 1px dotted rgba(255,255,255,0.4);
        }
        .reg__row:last-child { border-bottom: 0; padding-bottom: 4px; }
        .reg__row :global(dt) {
          font-family: var(--font-mono); font-size: 11px; font-weight: 400;
          letter-spacing: 1px; text-transform: uppercase; line-height: 1.45;
          color: rgba(255,255,255,0.75); margin: 0;
        }
        .reg__row :global(dd) {
          font-family: var(--font-sans); font-size: 14px; line-height: 1.6;
          color: #fff; margin: 0; text-align: right; white-space: nowrap;
        }
        @media (max-width: 560px) {
          .reg__row :global(dd) { white-space: normal; }
        }
      `}</style>
    </section>
  )
}

/* ── The harvest ─────────────────────────────────────────────────── */
export function RipeHarvest() {
  const ref = useReveal<HTMLElement>()
  /* The page closes on the film: the ground becomes it here. */
  useGround('film', ref, 'harvest')
  return (
    <section ref={ref} id="harvest" className="harv">
      <div className="section-w harv__in">
        <h2 className="harv__h">{HARVEST.title}</h2>
        <p className="harv__from">{HARVEST.from}</p>
        <p className="harv__b">{HARVEST.body}</p>

        <ol className="harv__months">
          {HARVEST.months.map((m) => <li key={m}>{m}</li>)}
        </ol>
        <p className="harv__note">{HARVEST.note}</p>
      </div>
      <style jsx>{`
        /* The page closes on the film: the harvest the whole gathering
           is timed to, running behind the last words. */
        .harv {
          position: relative; overflow: hidden;
          width: 100vw; margin-left: calc(50% - 50vw);
          min-height: 100dvh; display: flex; align-items: center;
          padding: var(--ripe-section-gap) 0;
        }
        .harv__in { position: relative; z-index: 1; width: 100%; }
        /* The site's h2 role sets the size, as for the opening statement. */
        .harv__h {
          font-family: var(--font-grotesque), sans-serif; font-weight: 400;
          color: #fff; margin: 0 0 clamp(32px, 5vh, 64px);
          max-width: 20ch;
        }
        .harv__from, .harv__b {
          font-size: var(--t-p1-size); line-height: var(--t-p1-lh);
          letter-spacing: var(--t-track); color: rgba(255,255,255,0.88);
          margin: 0 0 1em; max-width: 44ch; text-wrap: pretty;
        }
        .harv__months {
          list-style: none; margin: clamp(48px, 8vh, 110px) 0 0; padding: var(--space-4) 0;
          display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: var(--space-4);
          border-top: 1px solid rgba(255,255,255,0.28);
          border-bottom: 1px solid rgba(255,255,255,0.28);
          opacity: 0; transition: opacity .9s var(--ease-out);
        }
        .harv.is-in .harv__months { opacity: 1; }
        @media (min-width: 760px) { .harv__months { grid-template-columns: repeat(6, minmax(0,1fr)); } }
        .harv__months li {
          font-size: var(--t-body-size); line-height: var(--t-body-lh);
          letter-spacing: var(--t-track); color: #fff;
        }
        .harv__note {
          font-size: var(--t-p1-size); line-height: var(--t-p1-lh);
          letter-spacing: var(--t-track); color: rgba(255,255,255,0.6);
          margin: var(--space-6) 0 0; max-width: 46ch;
        }
      `}</style>
    </section>
  )
}
