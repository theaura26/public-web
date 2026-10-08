'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'
import type { Day } from './copy'
import { RipeSoundToggle } from './RipeSoundToggle'
import lettering from './titles.json'

/* ── The days ───────────────────────────────────────────────────────
   One held place in the middle of the screen, and the story passing
   through it. Each day's name, number and line sit there while that
   day's photographs float up past them — over the words, alternately
   left and right, each at its own speed so they read as several depths
   rather than one sheet. When a day ends its words fade out where they
   stand and the next day's fade up in the same place, through black
   rather than across, so one day turns into the next instead of
   scrolling away.

   So the days share one section and one pinned stage: every day's words
   are stacked in the same spot, and the pictures run on in the section's
   flow beneath, day after day. Each day's length grows with its number
   of pictures.

   Driven from the scroll position, read every frame, so it runs
   backwards with the reader. The scroll is weighted (Lenis), and the
   pictures answer its speed: they come up out of focus, and trail a fast
   scroll before gliding back into place.
─────────────────────────────────────────────────────────────────────── */

/* Where each picture sits, cycling. side is the half of the screen it
   is in; overlap is how far, in px, its inner edge reaches over the
   edge of that day's title — so every title is clipped by the same
   light amount, whether it is "Arriving" or "A world within a world".
   (A fixed distance from the centre left short titles uncovered, and
   closer in it sat on top of the long ones.) The amounts differ so the
   pictures don't line up into two columns. speed is how fast it drifts
   against the scroll — the larger, nearer ones move more. */
/* Depth, for the parallax: speed and depth go together, so a picture
   that races past is also a touch larger and passes over the others,
   and one that hangs back is smaller — near and far rather than just
   fast and slow. The first place keeps its speed, because the clear beat
   before each day's first picture reaches the words was measured on it. */
const PLACES = [
  { side: 'left', overlap: 40, speed: 0.32, depth: 1 },
  { side: 'right', overlap: 20, speed: 0.72, depth: 1.08 },
  { side: 'left', overlap: 55, speed: 0.08, depth: 0.88 },
  { side: 'right', overlap: 28, speed: 0.5, depth: 1.03 },
] as const

/* Vertical rhythm, in screen heights. The step between pictures is a
   CSS value (--day-step) rather than a constant, because a phone needs a
   longer one: there the pictures take most of the width, and at the
   desktop step they overlapped and the words never showed between them. */

/* How the words change, in screens of scroll. */
const ARRIVE = 0.3               // the first day's words, as the stage arrives
export const TURN = 0.18         // one day's words out, then the next's in
const LEAVE = 0.3                // the last day's words, as the stage leaves
/* The first day's words start coming up when the stage is this far onto
   the screen, and the last day's are gone this far before it has left. */
const ARRIVE_AT = 0.3
const LEAVE_BY = 0.35

/* How strongly a day's background shows at most. 1 is the photograph
   itself, at full strength; it was a faint wash (0.18–0.25) before. */
const GROUND = 1

/* Before a day's first picture. The words, once settled, hold clear for
   about a third of a screen of scroll before the first picture reaches
   them — a beat to read them, not a wait. Later days add the time their
   words take to come up. */
/* The first chapter, Arriving, holds longer — the opening of the story,
   its background seen whole before anything passes over it. */
const LEAD_FIRST = 1.2
const LEAD = 0.8 + TURN
/* After a day's last picture. Short between days — the next day's words
   are already on their way — and longer after the last, so its last
   picture clears the words before the stage leaves. */
const TAIL = 0.15
const TAIL_LAST = 0.6

const clamp = (v: number) => Math.min(Math.max(v, 0), 1)

/* Whether a picture passes behind the words or in front of them: as it
   says (Shot.layer), or else behind — every picture floats under the
   chapter's words, so they always read. */
const behind = (s: { layer?: 'behind' | 'front' }) => s.layer !== 'front'

/* A picture's place: the next in the cycle, or — where a picture asks for
   a side (Shot.side) — the place on that side whose drift is nearest the
   one it would have had, so the rhythm of the day barely changes. */
function place(j: number, side?: 'left' | 'right') {
  const p = j % PLACES.length
  if (!side || PLACES[p].side === side) return p
  let best = p, d = Infinity
  PLACES.forEach((q, k) => {
    const dd = Math.abs(q.speed - PLACES[p].speed)
    if (q.side === side && dd < d) { best = k; d = dd }
  })
  return best
}

/* How far one background's fade overlaps the next's when they change, as
   a share of each fade. 0 goes fully to black between them; at 0.5 about
   half of a picture is still showing at the darkest moment — a dip, not
   a blackout. */
const DIP_OVERLAP = 0.5

/* The background stepping back as the pictures come, as the Aura home
   page's banners do (ExpandingBanner, the sanctuary bands): a blur and a
   flat darker tint on the photograph, with a touch of scale so the
   blurred edge never shows. Clear while a chapter's words are read on
   their own; it veils as that chapter's first picture comes up the
   screen (VEIL_AT, VEIL), and holds while the pictures pass. The
   next chapter's background crosses in clear. */
const TINT = 0.82                // the background's brightness, at rest
const TINT_VEILED = 0.62         // and with the pictures over it
const BLUR = 10                  // px, with the pictures over it
const VEIL_AT = 0.85             // veiling starts with the first picture's top this far down the screen
const VEIL = 0.5                 // and takes this many screens of scroll

/* The Aura mark at the line's tip: 32px wide as on /ripe (27px tall at
   the artwork's 859 by 731), held this far clear above the words. */
const TIP_W = 32
const TIP_H = 27
const TIP_GAP = 22

/* The photographs' grade, for films, held back. The stills are graded
   once, on the way in (scripts/ripe/grade-10-days.mjs); a film can't be,
   so it is graded as it plays. A full match to the stills' look —
   brightness 1.08, saturate 1.3, sepia 0.12, contrast 1.04, fitted on
   Nayana's film — read as over-edited on a face: the extra colour and
   the warm tint pushed skin towards orange. This is about half of the
   colour, contrast and warmth, and none of the brightening — the film
   keeps its own exposure. The poster takes the filter too, so the frame
   before the film starts and the film itself are one picture. */
const FILM_GRADE = 'saturate(1.12) sepia(0.05) contrast(1.02)'

/* The scroll itself, weighted and slow to settle (after jnprspirits.com):
   Lenis, as on /the-reason, but timed and eased rather than lerped, so a
   scroll eases in as well as out. Each wheel or trackpad tick sets a new
   glide of GLIDE seconds along EASE: it leaves gently but never from a
   standstill (a true ease-in would stall a trackpad, every tick
   restarting it from rest), is quickest mid-way, and settles to a stop.
   EASE is a cubic with slope EASE_START at the start and none at the end. */
const GLIDE = 1.5
const EASE_START = 0.6
const EASE = (t: number) => EASE_START * t + (3 - 2 * EASE_START) * t * t + (EASE_START - 2) * t * t * t
/* A jump (the chapter bar) is longer, so eases fully in and out. */
const JUMP = 1.8
const JUMP_EASE = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
/* Each picture comes up out of focus and sharpens as it rises: fully
   soft (FOCUS_BLUR px, a touch larger, faded) as it enters at the foot
   of the screen, sharp by the time its centre is FOCUS_AT screens below
   the middle. It stays sharp from there on, up and away. */
const FOCUS_BLUR = 14
const FOCUS_FROM = 0.62          // screens below the middle: fully soft
const FOCUS_AT = 0.12            // screens below the middle: sharp
/* And it trails the scroll by its speed: the faster the reader goes, the
   further the pictures lag behind — the nearer ones more — then glide
   back to their places as the scroll comes to rest. VELOCITY_EASE is how
   quickly that lag follows the scroll's speed (lower is heavier). */
const LAG = 1.1                  // px of lag per px/frame of scroll, at depth 1
const LAG_MAX = 110              // px
const VELOCITY_EASE = 0.08
/* A little motion blur at speed, on top of the focus. */
const SPEED_BLUR = 0.08          // px per px/frame
const SPEED_BLUR_MAX = 3         // px

/* The page's Lenis while the stage is mounted, so a jump (the chapter
   bar) goes through it and glides like the scroll — a native smooth
   scroll is held in place by it. */
let smooth: Lenis | null = null
export function scrollToY(y: number) {
  if (smooth) smooth.scrollTo(y, { duration: JUMP, easing: JUMP_EASE })
  else window.scrollTo({ top: y, behavior: 'smooth' })
}

/* Where each day starts and how long it is, as calc() lengths. */
/* The room before a picture beyond the usual step: its own gap
   (Shot.gap), and the clear beat a second background holds before the
   picture that brings it (Day.bgThen.hold). */
const gapOf = (d: Day, s: Day['shots'][number]) =>
  (s.gap ?? 0) + (d.bgThen?.from === s.name ? d.bgThen.hold ?? 0 : 0)

/* A chapter's spacing (Day.spacing) stretches the step between its own
   pictures, and the chapter with them; a picture's gap (Shot.gap) adds
   room before that one alone. A chapter can space its pictures
   differently on a phone (Day.spacingPhone), so every place is counted
   twice — in steps on wide screens and on phones — and the stage's CSS
   (--wide, --phone) picks one. */
type Steps = { w: number; p: number }
const stepCalc = (v: number, n: Steps) =>
  `calc(${(v * 100).toFixed(1)}vh + (${n.w.toFixed(2)} * var(--wide, 1) + ${n.p.toFixed(2)} * var(--phone, 0)) * var(--day-step))`
function layout(days: Day[]) {
  let vh = 0
  const steps: Steps = { w: 0, p: 0 }
  return days.map((d, i) => {
    const lead = i === 0 ? LEAD_FIRST : LEAD
    const spacing = { w: d.spacing ?? 1, p: d.spacingPhone ?? d.spacing ?? 1 }
    const start = stepCalc(vh, steps)
    const firstShot = vh + lead
    vh += lead + (i === days.length - 1 ? TAIL_LAST : TAIL)
    const shotsFrom = { ...steps }
    /* A picture's own gap (Shot.gap) adds that many steps before it. */
    const gaps = d.shots.reduce((a, s) => a + gapOf(d, s), 0)
    steps.w += d.shots.length * spacing.w + gaps
    steps.p += d.shots.length * spacing.p + gaps
    return { start, firstShot, shotsFrom, spacing }
  }).concat([{ start: stepCalc(vh, steps), firstShot: 0, shotsFrom: { w: 0, p: 0 }, spacing: { w: 1, p: 1 } }])
}

/* A chapter's anchor, from its title: "Finding a way in" → finding-a-way-in.
   Shared with the chapter bar, which links to it. */
export const anchor = (d: Day) => d.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

/* A title in Archie Brackett: the lettering, traced to an SVG by
   scripts/ripe/title-svgs.mjs, so the page shows it without serving the
   font — the one place this page steps outside the site's type, by
   choice. The words stay in the heading for screen readers and search.
   Sized from --title-size, as the type was: the box is h times it tall.
   A title with no SVG yet (one added since the script last ran) is set
   in the site's type instead. */
const LETTERING = lettering as Record<string, { w: number; h: number; v: string }>
function Title({ text }: { text: string }) {
  const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  const art = LETTERING[slug]
  if (!art) return <>{text}</>
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="days__art" src={`/RIPE/10-days/titles/${slug}.svg?v=${art.v}`} alt=""
        width={Math.round(art.w * 100)} height={Math.round(art.h * 100)}
        style={{ height: `calc(var(--title-size) * ${art.h})` }}
      />
      <span className="sr-only">{text}</span>
    </>
  )
}

/** coda: what follows the last chapter's pictures, inside the stage, so
    the last chapter's background stays behind it with no seam. It scrolls
    up over that background; the chapter's words make way as it arrives. */
export function RipeStoryDays({ days, coda }: { days: Day[]; coda?: ReactNode }) {
  const root = useRef<HTMLElement>(null)
  const at = layout(days)
  const total = at[at.length - 1].start

  useEffect(() => {
    const el = root.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const says = Array.from(el.querySelectorAll<HTMLElement>('.days__say'))
    const marks = Array.from(el.querySelectorAll<HTMLElement>('.days__mark'))
    const shots = Array.from(el.querySelectorAll<HTMLElement>('.days__shot'))
    const grounds = Array.from(el.querySelectorAll<HTMLElement>('.days__ground'))
    const codaEl = el.querySelector<HTMLElement>('.days__coda')
    /* Each chapter's first picture, which brings its veil. */
    const firsts = grounds.map((_, i) => shots.find((s) => Number(s.dataset.day) === i))
    /* Second backgrounds, and the picture that brings each in. */
    const thens = Array.from(el.querySelectorAll<HTMLElement>('.days__then'))
    const thenFrom = thens.map((t) => shots.find((s) => s.dataset.day === t.dataset.day && s.dataset.name === t.dataset.from))
    const dark = el.querySelector<HTMLElement>('.days__dark')

    /* The scroll's speed, in px a frame, eased (see VELOCITY_EASE). */
    let velocity = 0

    const update = () => {
      const vh = window.innerHeight
      const r = el.getBoundingClientRect()
      /* The step between pictures, in px (--day-step is set in vh). */
      const step = (parseFloat(getComputedStyle(el).getPropertyValue('--day-step')) || 30) / 100 * vh
      /* Screens scrolled since the stage reached the top. */
      const x = -r.top / vh
      const end = el.offsetHeight / vh
      const b = marks.map((m) => m.offsetTop / vh)
      const last = says.length - 1
      /* Where the coda starts, in screens; its top reaches the foot of the
         screen at x = codaAt - 1. */
      const codaAt = codaEl ? codaEl.offsetTop / vh : null

      says.forEach((s, i) => {
        /* x + 1 is screens since the stage's top came onto the screen;
           end - x is screens until its bottom leaves the top. */
        const up = i === 0 ? clamp((x + 1 - ARRIVE_AT) / ARRIVE) : clamp((x - b[i]) / TURN)
        /* The last chapter's words leave with the stage — or, with a
           coda, as its first lines come up the screen, so the two never
           sit on top of each other. */
        const leave = clamp((x - (end - LEAVE_BY - LEAVE)) / LEAVE)
        const down = i === last
          ? (codaAt === null ? leave : clamp((x - (codaAt - 1.05)) / LEAVE))
          : clamp((x - (b[i + 1] - TURN)) / TURN)
        const o = up * (1 - down)
        s.style.opacity = o.toFixed(3)
        s.style.visibility = o > 0 ? 'visible' : 'hidden'

        /* The day's background. It arrives with the first day's words;
           between days it dips towards dark with the words and the next
           comes up out of it with the next words — over black, never the
           white page. The two fades overlap (DIP_OVERLAP), so the dip
           never reaches full black. */
        const g = grounds[i]
        if (!g) return
        const fade = TURN * (1 + DIP_OVERLAP)
        const gUp = i === 0 ? up : clamp((x - (b[i] - TURN * DIP_OVERLAP)) / fade)
        /* The last background stays at full strength to the end and
           leaves with the stage, rather than fading to the white page
           under the white closing words. */
        const gDown = i === last ? 0 : clamp((x - (b[i + 1] - TURN)) / fade)
        const go = gUp * (1 - gDown) * GROUND
        /* The dark under them all is only there once the first is fully
           up, hidden beneath it: the first background comes straight up
           out of the white page, with no dark in the fade. */
        if (i === 0 && dark) {
          const on = gUp >= 1
          dark.style.opacity = on ? '1' : '0'
          dark.style.visibility = on ? 'visible' : 'hidden'
        }

        /* A second background takes over as its picture comes up the
           screen — on the same beat as the veil: the first dips down as
           the second comes up, the two overlapping as between chapters. */
        /* With a hold, the change starts as the clear beat before its
           picture begins — the last picture gone — so the new background
           comes up under the title alone, sharp, and only veils as its
           picture arrives (vThen). */
        let handOver = 0
        let vThen: number | null = null
        thens.forEach((t, k) => {
          if (Number(t.dataset.day) !== i) return
          const from = thenFrom[k]
          if (!from) return
          const holdPx = (Number(t.dataset.hold) || 0) * step
          /* lead: the change starts this many screens sooner, so the new
             background is in as its picture comes into view rather than
             as it reaches the words. */
          const leadPx = (Number(t.dataset.lead) || 0) * vh
          handOver = clamp((VEIL_AT * vh + leadPx - (r.top + from.offsetTop - holdPx * 0.6)) / (VEIL * vh))
          if (holdPx) vThen = clamp((VEIL_AT * vh - (r.top + from.offsetTop)) / (VEIL * vh))
        })
        const half = (1 + DIP_OVERLAP) / 2
        const gOn = go * (1 - clamp(handOver / half))
        g.style.opacity = gOn.toFixed(3)
        g.style.visibility = gOn > 0 ? 'visible' : 'hidden'

        /* From where the first picture sits in the flow, not its drifted
           box: veiling starts once it is on its way up the screen. */
        const f = firsts[i]
        const v = f ? clamp((VEIL_AT * vh - (r.top + f.offsetTop)) / (VEIL * vh)) : 0
        /* A chapter can go without the dark tint (Day.tint false): its
           background keeps its own brightness and only blurs. */
        const bright = g.dataset.tint === 'off' ? 1 : TINT - (TINT - TINT_VEILED) * v
        const filter = `brightness(${bright.toFixed(3)}) blur(${(BLUR * v).toFixed(2)}px)`
        const transform = `scale(${(1 + 0.05 * v).toFixed(4)})`
        g.style.filter = filter
        g.style.transform = transform

        /* The second background, up out of the dark — veiled with the
           first, or with a hold sharp until its picture comes; it leaves
           with the chapter. */
        const into = clamp((handOver - (1 - half)) / half)
        thens.forEach((t) => {
          if (Number(t.dataset.day) !== i) return
          const to = go * into
          t.style.opacity = to.toFixed(3)
          t.style.visibility = to > 0 ? 'visible' : 'hidden'
          const vt = vThen ?? v
          t.style.filter = `brightness(${(TINT - (TINT - TINT_VEILED) * vt).toFixed(3)}) blur(${(BLUR * vt).toFixed(2)}px)`
          t.style.transform = `scale(${(1 + 0.05 * vt).toFixed(4)})`
        })
        /* And the subheading, where the change brings its own: the first
           line goes as the first background does, the new one comes up
           with the second. */
        const out = 1 - clamp(handOver / half)
        for (const [a, b] of [['.days__lines-now', '.days__line--then'], ['.days__title-now', '.days__title-then']]) {
          const now = s.querySelector<HTMLElement>(a)
          const then = s.querySelector<HTMLElement>(b)
          if (now && then) {
            now.style.opacity = out.toFixed(3)
            then.style.opacity = into.toFixed(3)
          }
        }
      })

      shots.forEach((s) => {
        const pl = PLACES[Number(s.dataset.place)]
        /* Where the picture sits on the page, not where it appears: the
           on-screen box already includes this drift, and measuring from
           it fed the drift back into itself — a fast picture sped itself
           up to three times the scroll. From its place in the flow, each
           moves at exactly 1 + speed. */
        const centre = r.top + s.offsetTop + s.offsetHeight / 2
        /* Each picture drifts about its own pass through the screen, not
           the section's. It enters a little behind its place and rises
           faster than the page — floating up rather than arriving early. */
        const k = (vh / 2 - centre) / vh
        /* Trailing the scroll: down the screen while the page goes up,
           more for the nearer, faster pictures. */
        const lag = Math.max(-LAG_MAX, Math.min(LAG_MAX, velocity * LAG * (0.4 + pl.speed) * pl.depth))
        /* Into focus as it rises: 0 soft at the foot, 1 sharp. */
        const focus = clamp((FOCUS_FROM + k) / (FOCUS_FROM - FOCUS_AT))
        const ease = focus * focus * (3 - 2 * focus)
        const blur = (1 - ease) * FOCUS_BLUR + Math.min(SPEED_BLUR_MAX, Math.abs(velocity) * SPEED_BLUR)
        const scale = pl.depth * (1 + 0.06 * (1 - ease))
        s.style.transform = `translate3d(0, ${(-k * vh * pl.speed + lag).toFixed(1)}px, 0) scale(${scale.toFixed(4)})`
        s.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : ''
        s.style.opacity = (0.35 + 0.65 * ease).toFixed(3)
      })
    }

    /* Lenis drives the scroll; one frame loop reads where it has got to,
       eases the speed, and redraws the stage only while something is
       moving — the scroll, or the lag still settling. */
    const lenis = new Lenis({ duration: GLIDE, easing: EASE, smoothWheel: true })
    smooth = lenis
    let last = window.scrollY
    let id = requestAnimationFrame(function frame(t: number) {
      lenis.raf(t)
      const y = window.scrollY
      velocity += (y - last - velocity) * VELOCITY_EASE
      if (y !== last || Math.abs(velocity) > 0.02) update()
      else if (velocity !== 0) { velocity = 0; update() }
      last = y
      id = requestAnimationFrame(frame)
    })

    update()
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(id)
      lenis.destroy()
      if (smooth === lenis) smooth = null
      window.removeEventListener('resize', update)
    }
  }, [days])

  /* Each day's title width, handed to its pictures so they overlap it by
     their set amount. Measured after the title face has loaded — the
     fallback is narrower — and again whenever the width changes. */
  useEffect(() => {
    const el = root.current
    if (!el) return
    const titles = Array.from(el.querySelectorAll<HTMLElement>('.days__title'))
    const shots = Array.from(el.querySelectorAll<HTMLElement>('.days__shot'))
    const says = Array.from(el.querySelectorAll<HTMLElement>('.days__say'))
    const measure = () => {
      const half = titles.map((t) => t.getBoundingClientRect().width / 2)
      shots.forEach((s) => s.style.setProperty('--title-half', `${half[Number(s.dataset.day)].toFixed(1)}px`))
      /* The Aura mark rides above the words, clear of the tallest
         chapter's heading: half its height above the middle of the
         screen, a gap, and the mark's own height. One value for the whole
         run, set here rather than on scroll, so the mark holds still. */
      const tallest = Math.max(0, ...says.map((x) => x.offsetHeight))
      el.style.setProperty('--tip-gap', `${(tallest / 2 + TIP_GAP + TIP_H).toFixed(1)}px`)
    }
    measure()
    document.fonts?.ready.then(measure)
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [days])

  /* The Aura line, as on /ripe (RipeDays): a dotted line down the run,
     drawn exactly as far as the reader has come, with the Aura mark at
     its tip. Here the tip is held above the chapter's words rather than
     on them. Read from the scroll position on every scroll event, and
     kept with reduced motion too: it isn't decoration, it is where the
     reader is. */
  useEffect(() => {
    const el = root.current
    const spine = el?.querySelector<HTMLElement>('.days__spine')
    if (!el || !spine) return
    const update = () => {
      const gap = parseFloat(getComputedStyle(el).getPropertyValue('--tip-gap')) || 120
      const tipAt = window.innerHeight / 2 - gap + TIP_H
      const r = spine.getBoundingClientRect()
      const grow = Math.min(Math.max((tipAt - r.top) / r.height, 0), 1)
      spine.style.setProperty('--grow', (grow * 100).toFixed(3) + '%')
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [days])

  /* Films play while any of them is on screen and stop when it leaves.
     Left still for readers who have asked for less motion — the poster
     stands in. */
  useEffect(() => {
    const el = root.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const films = Array.from(el.querySelectorAll<HTMLVideoElement>('.days__film'))
    if (!films.length) return
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const v = e.target as HTMLVideoElement
        if (e.isIntersecting) v.play().catch(() => {})
        else v.pause()
      })
    }, { threshold: 0.15 })
    films.forEach((v) => io.observe(v))
    return () => io.disconnect()
  }, [days])

  return (
    <section ref={root} className="days" style={coda ? undefined : { height: total }} aria-label="The ten days">
      {/* The backgrounds, pinned in a layer of their own under the
          words', so a picture can pass between the two (Shot.layer). */}
      <div className="days__back" aria-hidden>
        {/* Each day's background, one per day in day order — an empty
            slot where a day has none, so the indexes line up. */}
        <div className="days__grounds">
          {/* Black under the backgrounds, so a change of background goes
              through dark rather than the white page. */}
          <i className="days__dark" />
          {days.map((d) => d.bg ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={d.day} className="days__ground" src={d.bg} alt="" decoding="async" data-tint={d.tint === false ? 'off' : undefined} />
          ) : (
            <i key={d.day} className="days__ground" />
          ))}
          {/* Second backgrounds, over the first, after them so the
              indexes above still line up. */}
          {days.map((d, i) => d.bgThen ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={`then${d.day}`} className="days__then" data-day={i} data-from={d.bgThen.from} data-hold={d.bgThen.hold ?? 0} data-lead={d.bgThen.lead ?? 0} src={d.bgThen.src} alt="" decoding="async" />
          ) : null)}
        </div>
      </div>
      <div className="days__pin">
        <div className="days__stack">
          {days.map((d, i) => (
            <div key={d.day} className="days__say" style={{ ['--o' as string]: i * 100 }}>
              {d.bgThen?.title ? (
                /* Both titles in one place, the later taking over with the
                   second background; the heading is as wide as the wider. */
                <h2 className="days__title days__title--two" id={anchor(d)}>
                  <span className="days__title-now"><Title text={d.title} /></span>
                  <span className="days__title-then" aria-hidden><Title text={d.bgThen.title} /></span>
                </h2>
              ) : (
                <h2 className="days__title" id={anchor(d)}><Title text={d.title} /></h2>
              )}
              {d.bgThen?.line ? (
                /* The chapter's line, and the one its second background
                   brings, in one place: one gives way to the other. */
                <div className="days__lines">
                  <div className="days__lines-now">
                    {d.line.map((l) => <p key={l} className="days__line">{l}</p>)}
                  </div>
                  <p className="days__line days__line--then">{d.bgThen.line}</p>
                </div>
              ) : d.line.map((l) => <p key={l} className="days__line">{l}</p>)}
            </div>
          ))}
        </div>
      </div>

      {/* The Aura line runs the length of the chapters and ends where the
          closing begins; the mark rides at its tip. */}
      <div className="days__spine" style={{ height: total }} aria-hidden>
        {/* The site's animated aura mark at a quarter speed, as on /ripe. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="days__tip" src="/RIPE/aura-mark-slow.svg" alt="" loading="lazy" decoding="async" />
      </div>

      {/* With a coda the stage's height is laid out in flow — the run of
          chapters, then the coda — rather than set, so the coda's own
          height counts. The pinned stage is the first 100dvh of the run. */}
      {coda ? (
        <>
          <div className="days__run" style={{ height: `calc(${total} - 100dvh)` }} aria-hidden />
          <div className="days__coda">{coda}</div>
        </>
      ) : null}

      {days.map((d, i) => (
        <i key={`m${d.day}`} className="days__mark" style={{ top: at[i].start }} aria-hidden />
      ))}
      {/* Where each day ends, for anything that keys off a day finishing
          (the rings complete at the end of Day 5). */}
      {days.map((d, i) => (
        <i key={`e${d.day}`} className="days__end" data-day-end={d.day.replace(/\D/g, '')} style={{ top: at[i + 1].start }} aria-hidden />
      ))}

      {days.flatMap((d, i) => d.shots.map((s, j) => {
        const gaps = d.shots.slice(0, j + 1).reduce((a, x) => a + gapOf(d, x), 0)
        const n = { w: at[i].shotsFrom.w + j * at[i].spacing.w + gaps, p: at[i].shotsFrom.p + j * at[i].spacing.p + gaps }
        /* The places start over each day, so every day opens the same
           way — its first picture from the left, at the same drift — and
           the beat before it reaches the words is the same length. With an
           even number of pictures the sides still alternate across days. */
        const p = place(j, s.side)
        const pl = PLACES[p]
        return (
          <figure
            key={s.src}
            className={`days__shot days__shot--${pl.side} ${s.h > s.w ? 'is-tall' : ''} ${d.shape ? `days__shot--${d.shape}` : ''}`}
            data-place={p}
            data-day={i}
            data-name={s.name}
            style={{
              /* The edge facing the centre — a left picture's right edge,
                 a right picture's left edge — placed at the title's edge,
                 less the overlap. --title-half is the day title's half
                 width, measured below; 11vw is a typical title until then.
                 Never so far out that the picture, at its depth, passes
                 the page gutter: under a long title ("Leaving something
                 behind") the overlap gives way rather than the picture
                 running off the screen. */
              [pl.side === 'left' ? 'right' : 'left']:
                `calc(50% + min(var(--title-half, 11vw) - ${pl.overlap}px + ${d.spread ?? 0}vw, 50% - var(--w) * ${pl.depth} - var(--gutter, 20px)))`,
              top: stepCalc(at[i].firstShot, n),
              ['--o' as string]: i * 100 + j + 1,
              ...(s.size ? { ['--size' as string]: s.size } : {}),
              /* Nearer pictures over farther ones; and the size change
                 happens from the inner edge, so the overlap with the
                 title stays what it was set to. */
              /* Behind the words (z 10) or over them; either way, the
                 nearer pictures over the farther. */
              zIndex: (behind(s) ? 2 : 11) + Math.round((pl.depth - 0.88) * 25),
              transformOrigin: `${pl.side === 'left' ? 'right' : 'left'} center`,
            }}
          >
            {s.video ? (
              /* Silent, looping, and only playing while it's on screen —
                 a picture that moves, in every other way like the rest.
                 One with something to hear carries a sound button. */
              <div className="days__frame">
                <video
                  className="days__film"
                  src={s.video} poster={s.src} width={s.w} height={s.h}
                  /* The film's own shape, fixed: left to width and height
                     alone, a poster of another shape would set it until
                     the film loads. */
                  style={{ aspectRatio: `${s.w} / ${s.h}`, ...(s.grade ? { filter: s.grade } : {}) }}
                  muted loop playsInline preload="none"
                  aria-label={s.alt}
                />
                {s.sound ? <RipeSoundToggle label={s.caption} /> : null}
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.src} alt={s.alt} width={s.w} height={s.h} loading="lazy" decoding="async" style={s.grade ? { filter: s.grade } : undefined} />
            )}
            <figcaption className="days__cap label">{s.caption}</figcaption>
          </figure>
        )
      }))}

      <style jsx>{`
        .days {
          position: relative;
          width: 100vw; margin-left: calc(50% - 50vw);
          /* The pictures drift below their places before they rise; held
             inside the stage, so the page doesn't grow and shrink as they
             move (clip, not hidden: the pinned layers stay sticky). */
          overflow: clip;
          /* The words here sit on the chapters' photographs at full
             strength, so they are white —
             the page's own ink (black, for the white page above) would be
             lost on a dark canopy. The accent stays the accent. */
          --story-ink: #fff;
          --story-muted: rgba(255, 255, 255, 0.92);
          color: var(--story-ink);
          /* The step between one picture and the next: room enough that
             each passes on its own, with only a little overlap as they
             float. */
          --day-step: 40vh;
          /* Which count of steps places the pictures (see stepCalc). */
          --wide: 1; --phone: 0;
        }
        @media (max-width: 899px) { .days { --day-step: 34vh; --wide: 0; --phone: 1; } }

        /* The words hold in the middle of the screen for the whole run of
           days; the pictures are in the section's flow and pass over them. */
        /* The backgrounds' layer: pinned like the words, overlapping
           them in place (the negative margin) rather than stacking below. */
        .days__back {
          position: sticky; top: 0; z-index: 0;
          height: 100dvh; margin-bottom: -100dvh;
          pointer-events: none;
        }
        /* The words, over the backgrounds and the pictures that pass
           behind them (z 2–7), under any set to pass in front (11–16). */
        .days__pin {
          position: sticky; top: 0; z-index: 10;
          height: 100dvh;
          display: flex; align-items: center; justify-content: center;
          padding-inline: var(--gutter, 20px);
          pointer-events: none;
        }
        /* Every day's words in one grid cell, so each takes the same place
           and the change from one to the next happens where they stand. */
        .days__stack { position: relative; z-index: 1; display: grid; place-items: center; }

        /* The backgrounds fill the held stage, behind the words; the
           floating pictures pass over everything in it. */
        .days__grounds { position: absolute; inset: 0; z-index: 0; overflow: hidden; }
        /* A slight dark tint on each photograph: in the image itself, not a
           sheet over the stage, so the white page around the story is
           never greyed by it. Deepened, with a blur, as the pictures come
           (TINT, BLUR above); this is its resting value, and the only one
           with reduced motion. */
        .days__dark {
          position: absolute; inset: 0; background: #000;
          opacity: 0; visibility: hidden;
        }
        .days__ground, .days__then {
          position: absolute; inset: 0;
          width: 100%; height: 100%; object-fit: cover;
          opacity: 0; visibility: hidden;
          filter: brightness(0.82);
        }
        .days__say {
          grid-area: 1 / 1;
          display: flex; flex-direction: column; align-items: center;
          text-align: center; max-width: 100%;
          opacity: 0; visibility: hidden;
        }
        /* The site's h2 (globals.css) underneath, for a title with no
           lettering yet; the lettering (Title, above) sits in it at
           --title-size: on one line across the stage, coming down below
           ~480px wide just enough that the longest ("Leaving something
           behind", ~11.6 times the size) fits between the gutters. */
        .days__title {
          --title-size: min(calc(var(--t-display-size) * 1.32), calc((100vw - 2 * var(--gutter, 20px)) / 12));
          margin: 0;
          text-transform: none;
          color: var(--ripe-green);
        }
        .days__title :global(.days__art) { display: block; width: auto; max-width: none; }
        /* Straight under the title now the day's number is gone. */
        /* The subheading keeps its narrow column under the wide title. */
        .days__line {
          max-width: 30ch;
          margin: clamp(14px, 2.4vh, 28px) 0 0;
          font-family: var(--font-grotesque), sans-serif;
          font-weight: 400;
          font-size: var(--t-p1-size); line-height: var(--t-p1-lh);
          letter-spacing: var(--t-track);
          color: var(--story-ink, #fff);
          text-wrap: pretty;
        }
        .days__line + .days__line { margin-top: 0.2em; }
        .days__lines { display: grid; justify-items: center; }
        .days__lines-now, .days__line--then { grid-area: 1 / 1; }
        .days__lines-now { display: flex; flex-direction: column; align-items: center; }
        .days__line.days__line--then { opacity: 0; }
        .days__title.days__title--two { display: grid; justify-items: center; }
        .days__title-now, .days__title-then { grid-area: 1 / 1; }
        .days__title-then { opacity: 0; }

        .days__mark, .days__end { position: absolute; left: 0; width: 1px; height: 1px; pointer-events: none; }

        /* The Aura line. /ripe's own: white dots at a 7px step, revealed
           from the top down to --grow, the mark held still by position:
           sticky — here at a constant height above the chapter's words
           (--tip-gap, measured) rather than on them. Over the stage's
           backgrounds and under the floating pictures, which pass over it
           like everything else. No shadow on the dots or the mark. */
        .days__spine {
          --grow: 100%;
          position: absolute; top: 0; left: 50%;
          width: 3px; transform: translateX(-50%);
          z-index: 1;
          pointer-events: none;
        }
        .days__spine::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.75) 0.6px, transparent 1.1px)
            center top / 3px 7px repeat-y;
          clip-path: inset(0 0 calc(100% - var(--grow)) 0);
        }
        .days__tip {
          position: sticky; top: calc(50dvh - var(--tip-gap, 120px));
          display: block; width: ${TIP_W}px; height: auto; max-width: none;
          margin-left: -${(TIP_W - 3) / 2}px;
        }

        /* The coda scrolls up over the last chapter's background, above
           everything in the stage, and leaves room under its last line so
           that line reaches the middle of the screen before the stage goes. */
        .days__coda {
          position: relative; z-index: 20;
          padding: 0 0 45vh;
        }

        /* --w is the picture's width, kept as a value so its placement can
           allow for it (above). --size scales one picture against the rest
           (Shot.size). */
        .days__shot {
          position: absolute; z-index: 2; margin: 0;
          --w: calc(clamp(240px, 30vw, 560px) * var(--size, 1));
          width: var(--w);
          will-change: transform;
        }
        .days__shot.is-tall { --w: calc(clamp(190px, 21vw, 400px) * var(--size, 1)); }
        /* Corners as the Aura home page's pictures have them. */
        .days__shot img,
        .days__shot video {
          display: block; width: 100%; height: auto;
          border-radius: var(--radius-1);
        }
        .days__frame { position: relative; }
        /* A chapter's shape (Day.shape): its pictures and films cut to an
           oval, or with rounded corners. The caption stays square below. */
        .days__shot--oval img, .days__shot--oval video { border-radius: 50%; }
        .days__shot--rounded img, .days__shot--rounded video { border-radius: clamp(14px, 1.6vw, 28px); }
        /* cover: a poster of another shape (a still standing in for its
           film) fills the film's frame, cropped, rather than barred. */
        .days__film { filter: ${FILM_GRADE}; background: #000; object-fit: cover; }
        /* The site's .label, as every caption on the site: 11px at every
           width (DESIGN-SYSTEM.md). */
        .days__cap {
          margin: 0.9em 0 0;
          color: var(--story-muted, rgba(255, 255, 255, 0.85));
        }
        .days__shot--right .days__cap { text-align: right; }

        @media (max-width: 899px) {
          .days__shot { width: calc(46vw * var(--size, 1)); }
          .days__shot.is-tall { width: calc(36vw * var(--size, 1)); }
          /* Phones: hung from the edges again. At this width the
             pictures take over half the screen, so they cross the middle
             from there anyway. */
          .days__shot--left { left: 3% !important; right: auto !important; }
          /* Hung from the outer edge here, so the nearer pictures grow
             inwards from it rather than out past it. */
          .days__shot--left { transform-origin: left center !important; }
          .days__shot--right { transform-origin: right center !important; }
          .days__shot--right { right: 3% !important; left: auto !important; }
        }

        /* ── agent view and still: no stage. Each day's words, then its
           pictures, in reading order — the stack and the pin step aside
           and --o puts every block back in its day. ── */
        :global([data-view='agent']) .days {
          height: auto !important;
          display: flex; flex-direction: column; align-items: center;
        }
        :global([data-view='agent']) .days__pin,
        :global([data-view='agent']) .days__stack { display: contents; }
        :global([data-view='agent']) .days__say,
        :global([data-view='agent']) .days__shot { order: var(--o); }
        :global([data-view='agent']) .days__shot { position: relative; top: auto !important; left: auto !important; right: auto !important; }
        /* In the flow, every picture as it is: no drift, focus or lag. */
        :global([data-view='agent']) .days__shot { transform: none !important; filter: none !important; opacity: 1 !important; }
        :global([data-view='agent']) .days__coda { order: 99999; }
        :global([data-view='agent']) .days__back,
        :global([data-view='agent']) .days__run,
        :global([data-view='agent']) .days__spine,
        :global([data-view='agent']) .days__mark,
        :global([data-view='agent']) .days__end { display: none; }

        @media (prefers-reduced-motion: reduce) {
          .days {
            height: auto !important;
            display: flex; flex-direction: column; align-items: center;
            gap: var(--sp-cluster); padding-block: var(--ripe-section-gap);
          }
          .days__pin, .days__stack { display: contents; }
          .days__back { display: none; }
          .days__say { order: var(--o); opacity: 1; visibility: visible; padding-inline: var(--gutter, 20px); }
          .days__say:not(:first-child) { margin-top: var(--ripe-section-gap); }
          .days__mark, .days__end, .days__run, .days__spine { display: none; }
          .days__coda { order: 99999; padding: 0; }
          .days__shot {
            order: var(--o);
            position: relative; top: auto !important; left: auto !important; right: auto !important;
            width: min(520px, 88vw) !important;
          }
          .days__shot--right .days__cap { text-align: left; }
        }
      `}</style>
    </section>
  )
}
