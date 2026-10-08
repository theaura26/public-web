'use client'

import { Fragment, useEffect, useRef } from 'react'
import { DAYS, SEASON_CODA, type Day, type Shot } from './after-copy'
import { daySlug } from './RipeDayNav'

/* ── Ten days, one scroll ────────────────────────────────────────────
   The page is a walk rather than a gallery. The day's name and its line
   sit still in the middle of the screen while its pictures come up past
   them, and the ground behind changes with the day. Nothing is a slide:
   the reader's scroll is the only clock.

   Three layers, all driven by one handler:

     the ground   a photograph per day, crossfading through black
     the say      the day's name and line, held in the middle
     the run      the pictures, placed left and right of that centre

   A picture arrives blurred and faint, sharpens as it reaches the
   reading band, and softens again as it leaves — so there is one thing
   to look at at a time, which is what makes a long page walkable.
─────────────────────────────────────────────────────────────────────── */

/* Scroll room for one step of a day, as a share of the screen. Each
   day sets how many steps it wants between pictures (spacing), so a
   quiet day breathes and a busy one keeps moving. */
const STEP = 0.3

/* A phone shows one picture at a time, so each needs most of a screen
   to itself; on a wide screen they pass either side of the day's name
   and can sit closer together. */
const STEP_PHONE = 0.62

/* Below the middle of the screen a picture is out of focus, sharpening
   over this share of a screen as it rises: fully blurred at the bottom
   edge, clear at the middle. */
const FOCUS = 0.42

/* How far above the middle of the screen the thread stops, leaving the
   day's name clear of it. */
const TIP_GAP = 150

/* Same name, same placement, every render: the jitter that keeps the
   run from marching in a straight line is derived from the shot's own
   name rather than drawn at random. */
function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) }
  return (h >>> 0) / 4294967295
}

type Placed = Shot & {
  side: 'left' | 'right'
  tall: boolean
  /** Steps down the day's run. */
  at: number
  atPhone: number
  jitter: number
  pull: number
  depth: number
  order: number
}

function placeDay(day: Day, from: number): Placed[] {
  const spacing = day.spacing ?? 1.6
  const phone = day.spacingPhone ?? 0.9
  return day.shots.map((s, i) => {
    const r = hash(s.name)
    return {
      ...s,
      side: i % 2 === 0 ? 'left' : 'right',
      tall: s.h > s.w,
      at: i * spacing,
      atPhone: i * phone,
      /* How far out from the day's name this one sits, and how much of
         the drift it takes: both small, both steady per picture. */
      jitter: 20 + Math.round(r * 40),
      pull: 0.88 + r * 0.24,
      depth: 2 + Math.round(r * 5),
      order: from + i,
    }
  })
}

export function RipeSeason({ days = DAYS }: { days?: Day[] }) {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const grounds = Array.from(el.querySelectorAll<HTMLElement>('.days__ground'))
    const says = Array.from(el.querySelectorAll<HTMLElement>('.days__say'))
    const runs = Array.from(el.querySelectorAll<HTMLElement>('.days__day'))
    const shots = Array.from(el.querySelectorAll<HTMLElement>('.days__shot'))
    const spine = el.querySelector<HTMLElement>('.days__spine')
    const title = el.querySelector<HTMLElement>('.days__art')

    /* The pictures are placed either side of the day's name, so the run
       has to know how wide that name is. */
    const measure = () => {
      const half = title ? title.getBoundingClientRect().width / 2 : 0
      el.style.setProperty('--title-half', `${Math.round(half)}px`)
    }

    const update = () => {
      const vh = window.innerHeight
      const mid = vh * 0.5

      /* Which day owns the screen: the last run whose top has passed the
         middle. The ground and the name follow it. Before the first day
         and after the last, nobody owns it — the sticky ground layer
         reaches a screen past the run, and left on it would paint over
         the banner and the footer under it. */
      const band = el.getBoundingClientRect()
      const running = band.top <= mid && band.bottom > mid
      let on = 0
      runs.forEach((r, i) => { if (r.getBoundingClientRect().top <= mid) on = i })
      /* The day's ground is clear while its name has the screen to
         itself, and softens as the day's first pictures come up over it,
         so the pictures read as the subject and the ground as the place. */
      const day = runs[on]?.getBoundingClientRect()
      const into = day ? (mid - day.top) / vh : 0
      const soft = Math.min(Math.max((into - 0.35) / 0.5, 0), 1)
      grounds.forEach((g, i) => {
        const near = running && i === on
        if (near) {
          g.style.filter = soft > 0.01 ? `brightness(0.82) blur(${(soft * 10).toFixed(1)}px)` : 'brightness(0.82)'
          /* A blurred edge pulls in transparent pixels; a touch of scale
             keeps the frame full. */
          g.style.transform = soft > 0.01 ? `scale(${(1 + soft * 0.05).toFixed(3)})` : 'none'
        }
        /* This day, the one before and the one after: enough that the
           next ground is ready before the reader reaches it. */
        if (Math.abs(i - on) <= 1 && !g.getAttribute('src')) {
          const src = g.dataset.src
          if (src) g.setAttribute('src', src)
        }
        g.style.opacity = near ? '1' : '0'
        g.style.visibility = near ? 'visible' : 'hidden'
      })
      says.forEach((s, i) => {
        const near = running && i === on
        s.style.opacity = near ? '1' : '0'
        s.style.visibility = near ? 'visible' : 'hidden'
      })

      /* The run's own progress, for the thread down the middle. */
      if (spine) {
        /* The thread is drawn down to the tip, which rides a little above
           the middle of the screen — where the day's name sits. */
        const p = Math.min(Math.max((mid - TIP_GAP - band.top) / Math.max(band.height, 1), 0), 1)
        spine.style.setProperty('--grow', `${(p * 100).toFixed(2)}%`)
      }

      /* Every read first, then every write: one layout pass, not one per
         picture. */
      const seen = shots.map((s) => s.getBoundingClientRect())
      shots.forEach((s, i) => {
        const box = seen[i]
        if (box.bottom < -vh || box.top > vh * 2) return
        const centre = box.top + box.height / 2
        /* Positive below the middle of the screen, negative above it. */
        const d = (centre - mid) / vh
        /* Focus comes up with the picture: fully blurred as it enters at
           the bottom, clear by the time it reaches the middle, and clear
           from there on as it leaves past the top. */
        const away = Math.min(Math.max(d, 0) / FOCUS, 1)
        const depth = Number(s.dataset.depth || 4)
        const pull = Number(s.dataset.pull || 1)

        if (still) {
          s.style.opacity = '1'
          s.style.filter = 'none'
          s.style.transform = 'none'
          return
        }
        /* Depth: the further back a picture sits, the smaller it is and
           the slower it travels, so the run has air in it. */
        const lift = -d * vh * 0.12 * pull * (0.8 + depth * 0.05)
        const scale = 1 + (depth - 4) * 0.012 - away * 0.02
        s.style.transform = `translate3d(0, ${lift.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`
        s.style.filter = away > 0.01 ? `blur(${(away * 7).toFixed(1)}px)` : 'none'
        s.style.opacity = (1 - away * 0.4).toFixed(3)
      })
    }

    measure()
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', () => { measure(); update() })
    const ro = title ? new ResizeObserver(measure) : null
    if (title && ro) ro.observe(title)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      ro?.disconnect()
    }
  }, [days])

  /* Films play only while they are on screen, and only once they can
     run: until then the still holds the frame. */
  const film = (el: HTMLVideoElement | null) => {
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) el.play().then(() => el.setAttribute('data-ready', 'true')).catch(() => {})
      else el.pause()
    }, { threshold: 0.2 })
    io.observe(el)
  }

  /* Each day's pictures carry their place in the whole run, which is
     what agent view orders them by. Counted up front rather than while
     rendering. */
  const before = days.reduce<number[]>((acc, d, i) => [...acc, (acc[i] ?? 0) + d.shots.length], [0])
  const placed = days.map((d, i) => placeDay(d, before[i]))

  return (
    <section className="days" ref={root}>
      {/* The ground, held to the screen behind everything. */}
      <div className="days__back" aria-hidden>
        <div className="days__grounds">
          <i className="days__dark" />
          {days.map((d, i) => (
            /* Only the day in view and its neighbours carry a src: eight
               screen-sized photographs on a sticky layer are all "in
               view" as far as lazy loading is concerned, and the page
               opened by fetching every one of them. */
            // eslint-disable-next-line @next/next/no-img-element
            <img key={d.title} className="days__ground" alt=""
                 src={i === 0 ? d.bg : undefined} data-src={d.bg}
                 loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
          ))}
        </div>
      </div>

      {/* The day's name and line, held in the middle of the screen. */}
      <div className="days__pin">
        <div className="days__stack">
          {days.map((d) => (
            <div className="days__say" key={d.title} style={{ ['--o' as string]: String(days.indexOf(d) * 1000) }}>
              <h2 className="days__title">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="days__art" src={d.art.src} alt={d.title}
                     width={d.art.w} height={d.art.h} loading="lazy" decoding="async" />
              </h2>
              <div className="days__lines">
                {d.line.map((l) => <p className="days__line" key={l}>{l}</p>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The thread down the middle, as on RIPE's own timeline: drawn as
          far as the reader has come, and stopping above the day's name
          rather than running through it. */}
      <div className="days__spine" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="days__tip" src="/RIPE/aura-mark-slow.svg" alt=""
             width={32} height={32} loading="lazy" decoding="async" />
      </div>

      <div className="days__run">
        {days.map((d, di) => (
          <Fragment key={d.title}>
            <div className="days__day" id={daySlug(d.title)}
                 style={{
                   ['--count' as string]: String(d.shots.length),
                   ['--spacing' as string]: String(d.spacing ?? 1.6),
                   ['--spacing-phone' as string]: String(d.spacingPhone ?? 0.9),
                 }}>
              <h3 className="sr-only">{d.day} — {d.title}</h3>
              {placed[di].map((s) => (
                <figure key={s.name}
                        className={`days__shot days__shot--${s.side} ${s.tall ? 'is-tall' : ''}`}
                        data-depth={s.depth} data-pull={s.pull.toFixed(2)}
                        style={{
                          ['--i' as string]: String(s.at),
                          ['--i-phone' as string]: String(s.atPhone),
                          ['--size' as string]: String(s.size ?? 1),
                          ['--jitter' as string]: `${s.jitter}px`,
                          ['--o' as string]: String(s.order + 1),
                          zIndex: s.depth,
                        }}>
                  <div className="days__frame">
                    {s.video ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img className="days__still" src={s.src} alt={s.alt}
                             width={s.w} height={s.h} loading="lazy" decoding="async" />
                        <video className="days__film" ref={film} muted loop playsInline preload="none"
                               width={s.w} height={s.h} aria-label={s.alt}>
                          <source src={s.video} type="video/mp4" />
                        </video>
                      </>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.src} alt={s.alt} width={s.w} height={s.h}
                           loading="lazy" decoding="async" />
                    )}
                  </div>
                  <figcaption className="days__cap label">{s.caption}</figcaption>
                </figure>
              ))}
            </div>
          </Fragment>
        ))}

        {/* What the ten days came to. */}
        <div className="days__coda">
          <div className="section-w">
            {SEASON_CODA.map((l) => <p className="statement statement--quiet" key={l}>{l}</p>)}
          </div>
        </div>
      </div>

      <style jsx>{`
        /* The run is lit even on the paper page: every word in it sits on
           a photograph that fills the screen. */
        .days {
          position: relative;
          --story-ink: #fff;
          --story-muted: rgba(255, 255, 255, 0.85);
        }

        /* ── the ground ─────────────────────────────────────────────── */
        .days__back {
          position: sticky; top: 0; z-index: 0;
          height: 100dvh; margin-bottom: -100dvh; pointer-events: none;
        }
        .days__grounds { position: absolute; inset: 0; z-index: 0; overflow: hidden; }
        /* Kept for the crossfade to pass through; invisible otherwise, or
           the page would be black before the first day arrives. */
        .days__dark {
          position: absolute; inset: 0; background: #000;
          opacity: 0; visibility: hidden;
        }
        .days__ground {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; filter: brightness(0.82);
          opacity: 0; visibility: hidden;
          /* RipeBackdrop's timing: the leaving ground goes at once, the
             arriving one waits, so a change passes through black. */
          transition: opacity 620ms var(--ease-out), visibility 620ms var(--ease-out);
        }

        /* ── the day's name, held ───────────────────────────────────── */
        .days__pin {
          position: sticky; top: 0; z-index: 10;
          height: 100dvh; display: flex; align-items: center; justify-content: center;
          padding-inline: var(--gutter, 20px); pointer-events: none;
        }
        .days__stack { position: relative; z-index: 1; display: grid; place-items: center; }
        .days__say {
          grid-area: 1 / 1; display: flex; flex-direction: column; align-items: center;
          max-width: 100%; text-align: center;
          opacity: 0; visibility: hidden;
          transition: opacity 700ms var(--ease-out), visibility 700ms var(--ease-out);
        }
        .days__title { margin: 0; line-height: 0; }
        /* Sized by height, so a long name and a short one are the same
           weight on the page rather than the same width. */
        .days__art {
          display: block; width: auto; max-width: min(86vw, 1200px);
          height: clamp(40px, 5vw, 76px);
        }
        .days__line {
          margin: clamp(14px, 2.4vh, 28px) 0 0; max-width: 30ch;
          font-family: var(--font-grotesque), sans-serif; font-weight: 400;
          font-size: var(--t-p1-size); line-height: var(--t-p1-lh);
          letter-spacing: var(--t-track); color: var(--story-ink); text-wrap: pretty;
        }
        .days__line + .days__line { margin-top: .2em; }

        /* ── the thread ─────────────────────────────────────────────── */
        .days__spine {
          position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 3px; height: 100%; z-index: 1; pointer-events: none;
          --grow: 0%;
        }
        .days__tip {
          display: block; position: sticky;
          top: calc(50dvh - ${TIP_GAP}px); width: 32px; height: auto; max-width: none;
          margin-left: -14.5px;
        }
        .days__spine::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0.55px, transparent 1px) top / 3px 7px repeat-y;
          clip-path: inset(0 0 calc(100% - var(--grow)) 0);
        }

        /* ── the pictures ───────────────────────────────────────────── */
        .days__run { position: relative; z-index: 2; }
        .days__day {
          position: relative;
          /* Room for every picture in the day, plus a screen to arrive in
             and one to leave by. */
          height: calc((var(--count) * var(--spacing) * ${STEP} + 1.2) * 100dvh);
        }
        .days__shot {
          position: absolute; margin: 0; z-index: 2;
          --w: calc(clamp(240px, 30vw, 560px) * var(--size, 1));
          width: var(--w);
          top: calc(60dvh + var(--i) * ${STEP} * 100dvh);
          will-change: transform, filter, opacity;
        }
        .days__shot.is-tall { --w: calc(clamp(190px, 21vw, 400px) * var(--size, 1)); }
        /* Out from the day's name, never past the gutter. */
        .days__shot--left {
          right: calc(50% + min(var(--title-half, 11vw) + var(--jitter, 30px), 50% - var(--w) - var(--gutter, 20px)));
          transform-origin: right center;
        }
        .days__shot--right {
          left: calc(50% + min(var(--title-half, 11vw) + var(--jitter, 30px), 50% - var(--w) - var(--gutter, 20px)));
          transform-origin: left center;
        }
        .days__frame { position: relative; }
        .days__shot :global(img),
        .days__shot :global(video) {
          display: block; width: 100%; height: auto;
          border-radius: var(--radius-1);
          filter: saturate(1.12) sepia(0.05) contrast(1.02);
        }
        /* The still holds the frame until the film can play over it. */
        .days__shot :global(.days__still) { position: absolute; inset: 0; height: 100%; object-fit: cover; }
        .days__shot :global(.days__film) {
          position: relative; z-index: 1; background: none; object-fit: cover;
          opacity: 0; transition: opacity .6s var(--ease-out);
        }
        .days__shot :global(.days__film[data-ready='true']) { opacity: 1; }
        .days__cap { margin: .9em 0 0; color: var(--story-muted); }
        .days__shot--right .days__cap { text-align: right; }

        /* ── the coda ───────────────────────────────────────────────── */
        .days__coda { position: relative; z-index: 20; padding: 0 0 45vh; }
        .days__coda :global(.statement + .statement) { margin-top: 1.1em; }

        /* ── phones ─────────────────────────────────────────────────── */
        @media (max-width: 899px) {
          .days__day {
            height: calc((var(--count) * var(--spacing-phone) * ${STEP_PHONE} + 1.2) * 100dvh);
          }
          /* Small and to one side, as on a wide screen: a picture passes
             the day's name rather than covering it. */
          /* Capped in pixels as well as in vw: at 800px wide a plain 42vw
             picture reached the middle of the screen and sat on the day's
             own name. */
          .days__shot {
            --w: calc(min(42vw, 230px) * var(--size, 1));
            top: calc(62dvh + var(--i-phone) * ${STEP_PHONE} * 100dvh);
          }
          .days__shot.is-tall { --w: calc(min(34vw, 190px) * var(--size, 1)); }
          .days__shot--left { right: auto !important; left: var(--gutter, 20px) !important; }
          .days__shot--right { left: auto !important; right: var(--gutter, 20px) !important; }
          .days__shot--right .days__cap { text-align: left; }
          .days__art { max-width: 86vw; height: clamp(40px, 11vw, 64px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .days__ground, .days__say { transition: none; }
        }

        /* ── agent view ─────────────────────────────────────────────
           Nothing here is a scroll any more: the grounds, the thread and
           the day's own height go, and the names and pictures fall into
           one column in the order they were lived. */
        :global([data-view='agent']) .days__back,
        :global([data-view='agent']) .days__spine { display: none; }
        :global([data-view='agent']) .days__pin,
        :global([data-view='agent']) .days__stack,
        :global([data-view='agent']) .days__day { display: contents; }
        :global([data-view='agent']) .days__run { display: flex; flex-direction: column; }
        :global([data-view='agent']) .days__say {
          order: var(--o); opacity: 1; visibility: visible;
          padding-inline: var(--gutter, 20px);
        }
        :global([data-view='agent']) .days__say:not(:first-child) { margin-top: var(--ripe-section-gap); }
        :global([data-view='agent']) .days__shot {
          order: var(--o); position: relative;
          width: min(520px, 88vw); top: auto; left: auto; right: auto;
          margin-left: 0;
        }
        :global([data-view='agent']) .days__coda { order: 99999; padding: 0; }
      `}</style>
    </section>
  )
}

/* ── The statement under the opener ──────────────────────────────────
   Six short lines, set as one block: what the place left behind rather
   than what happened on which day. */
export function RipeSeasonIntro({ lines }: { lines: string[] }) {
  return (
    <section className="intro">
      <div className="section-w">
        <h2 className="statement">
          {lines.map((l) => <span key={l}>{l}</span>)}
        </h2>
      </div>

      <style jsx>{`
        /* The same space above and below as RIPE's own opening
           statement, so the two pages start their reading at one depth. */
        .intro { padding: var(--ripe-section-gap) 0 clamp(64px, 12vh, 170px); }
        .statement {
          margin: 0; max-width: 760px; text-align: left;
          color: var(--story-ink, #fff); text-wrap: pretty;
          display: flex; flex-direction: column; gap: 0.32em;
        }
        /* Six lines, each its own thought, so each gets its own air. */
        .statement :global(span) { display: block; }
      `}</style>
    </section>
  )
}
