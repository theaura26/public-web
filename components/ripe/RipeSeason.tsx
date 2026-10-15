'use client'

import { Fragment, useEffect, useRef } from 'react'
import { DAYS, SEASON_CODA, SEASON_CODA_PHOTO, type Day } from './after-copy'
import { daySlug } from './RipeDayNav'
import { RipeReveal } from './RipeReveal'
import { useMode } from '@/components/ModeProvider'

/* ── Five parts, one scroll ──────────────────────────────────────────
   After mosaicist.com's process: the words stay still while the
   pictures move. Each part's name (with its drawing) sits on the left and
   its words on the right, fixed to the screen, one part's at a time: the
   last part's fade where they are and the next part's come up in the
   same place. Held by position: sticky instead, they were placed again
   against every fractional scroll position and trembled; fixed, nothing
   moves them.

   A part opens on its first picture alone. It rises filling the whole
   screen, is held there by its stage (sticky, so the browser holds it on
   the scrolling's own thread, never a frame behind), and comes down to
   its frame as the reader goes on; only then do the part's name and
   words come in. The script sets its size and nothing else.

   On a wide screen the rest of the pictures scroll up the middle, each
   trailing the scroll a little and catching up, coming up blurred and a
   touch large and sharp well before the middle. On a phone there is no
   room for pictures to pass under the words, so every picture is held
   in the frame between them and fades in over the last, pushing in
   slowly with the scroll while it is held, so the page always answers
   the finger.

   The thread and the Aura mark at its tip are drawn as far as the reader
   has come: the mark fixed down the middle on a wide screen, down the
   left edge on a phone, showing with the words, only among the parts.
─────────────────────────────────────────────────────────────────────── */

/* How soft a picture is as it comes up from the bottom of the screen,
   and how much larger. Both ease off together over the first part of
   its climb — CLEAR, as a share of the way from the bottom of the screen
   to its place — so it is sharp well before it arrives. */
const BLUR = 14
const SWELL = 0.1
const CLEAR = 0.45
/* How much of the way the pictures close on the scroll each frame, at
   60fps: about a third of a second to settle. Lower glides longer. */
const GLIDE = 0.14
/* The closing photograph's run, in screens: it fades in as it arrives,
   is held whole and bright for the first part of its pin, then darkens
   as the closing lines come up one after another, and rests. */
const CODA_SCREENS = 2.7
const CODA_BRIGHT = 0.45
const CODA_DIM = 0.5
const CODA_SHADE = 0.58
const CODA_LINE = 0.084
const CODA_LINE_IN = 0.21

/* How long a part's words take to come in and to fade away, in ms, and
   how long the next part's wait after it takes the screen, at the
   least. */
const FADE_IN = 1120
const FADE_OUT = 630
const WAIT = 210
/* The furthest the pictures trail, as a share of the screen. */
const TRAIL = 0.35
/* How quickly a first picture's size catches up with the scroll, a
   frame: the picture itself is held exactly, but its size eases after
   the page, so a flick of the wheel or the trackpad lands as one slow
   breath rather than a jolt. About half a second to settle. */
const ZOOM_EASE = 0.075
/* On a phone the pictures stay in the frame and each fades in over the
   last once it is there: across this much of the screen's scroll. */
const PHONE_FADE = 0.25
/* On a phone a held picture would sit still under a moving finger and
   the page would seem not to answer: so while each is held it pushes in
   slowly, with the scroll, by this much over its hold. */
const PHONE_PUSH = 0.1

/* How wide a picture is drawn, for the browser's choice of file: the
   frame across a phone held upright (a part's first, at the size of the
   whole screen, about three times that), and at most 60% of a wide one. */
const UPRIGHT_SIZES = '(max-width: 899px) and (orientation: portrait) 100vw, 60vw'
const UPRIGHT_SIZES_FIRST = '(max-width: 899px) and (orientation: portrait) 300vw, 100vw'

const clamp = (v: number) => Math.min(Math.max(v, 0), 1)

/* An element's place on the page, from layout alone: transforms, the
   glide's included, do not move it. */
const pageTop = (n: HTMLElement) => {
  let t = 0
  for (let e: HTMLElement | null = n; e; e = e.offsetParent as HTMLElement | null) t += e.offsetTop
  return t
}
const pageLeft = (n: HTMLElement) => {
  let l = 0
  for (let e: HTMLElement | null = n; e; e = e.offsetParent as HTMLElement | null) l += e.offsetLeft
  return l
}
/* Slow out of the whole screen, slow into the frame — a sine, whose
   middle runs barely half again its average pace. */
const inOut = (t: number) => 0.5 - Math.cos(Math.PI * t) / 2

export function RipeSeason({ days = DAYS }: { days?: Day[] }) {
  const root = useRef<HTMLElement>(null)
  /* Agent mode is the page as plain reading: nothing to scroll, so
     nothing here runs — no part takes the screen and hides Ask Aura,
     and no hidden film plays. */
  const reading = useMode().viewMode === 'agent'

  useEffect(() => {
    const el = root.current
    if (!el || reading) return
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    /* Data saver on: the films stay their stills. */
    const lean = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true
    /* A phone held upright takes its own layout. Turned on its side it
       has a small desktop's shape, and takes that layout instead. */
    const phone = window.matchMedia('(max-width: 899px) and (orientation: portrait)')
    /* Under a finger the scroll already has its own momentum; a glide on
       top of it fights the finger and judders, so touch screens follow
       the scroll exactly. */
    const touch = window.matchMedia('(pointer: coarse)')

    const spine = el.querySelector<HTMLElement>('.days__spine')
    const tip = el.querySelector<HTMLElement>('.days__tip')
    const lead = el.querySelector<HTMLElement>('.days__lead')
    const holds = Array.from(el.querySelectorAll<HTMLElement>('.days__hold'))
    /* The last part's name and words, which the closing comes up into
       on a phone. */
    const lastInk = holds.length
      ? Array.from(holds[holds.length - 1].querySelectorAll<HTMLElement>('.days__name, .days__words'))
      : []
    const partEls = Array.from(el.querySelectorAll<HTMLElement>('.days__day'))
    const shots = Array.from(el.querySelectorAll<HTMLElement>('.days__shot'))
    const coda = el.querySelector<HTMLElement>('.days__coda')
    const codaBg = el.querySelector<HTMLElement>('.days__coda-bg')
    const codaShade = el.querySelector<HTMLElement>('.days__coda-shade')
    const codaLines = Array.from(el.querySelectorAll<HTMLElement>('.days__coda-l'))
    const films = shots.map((s) => s.querySelector('video'))
    /* What a picture shows — its still, its film — to push in on. */
    const medias = shots.map((s) => Array.from(s.querySelectorAll<HTMLElement>(':scope > img, :scope > video')))
    /* Each part's first picture opens on the whole screen. */
    const firsts = shots.map((s) => s.classList.contains('is-first'))
    /* Where across a first picture its subject stands, to centre on
       while it fills the screen: the middle unless the data says. */
    const opens = shots.map((s) => parseFloat(s.dataset.open ?? '') || 0.5)
    /* A first picture sits in a stage as tall as the picture and its
       hold together, and is sticky in it: the browser holds it still
       while the page scrolls, on the scrolling's own thread, so it never
       trails the page by a frame the way a picture moved by script
       does. The script only sizes it. */
    const stages = shots.map((s, i) => (firsts[i] ? s.parentElement : null))
    /* Which part each picture belongs to. */
    const partOf = (() => { let p = -1; return shots.map((_, i) => (firsts[i] ? ++p : p)) })()
    /* Each note's lines, and where each begins as a share of all its
       letters, so the pen spends as long on a line as it is long. */
    const pens = shots.map((s) => {
      const lines = Array.from(s.querySelectorAll<HTMLElement>('.days__pen'))
      const lens = lines.map((l) => Math.max(l.textContent?.length ?? 0, 1))
      const total = lens.reduce((a, b) => a + b, 0)
      let before = 0
      return lines.map((el, k) => {
        const line = { el, from: before / total, share: lens[k] / total }
        before += lens[k]
        return line
      })
    })

    /* Measured once, and again when the page changes size — not every
       frame. Reading a picture's box straight after moving it made the
       browser lay the page out again each frame; on a busy frame that
       left the held words a beat behind the scroll, nudging up and
       down. */
    let tops: number[] = []
    let highs: number[] = []
    let wides: number[] = []
    /* Each picture's middle, across the page. */
    let mids: number[] = []
    /* How long a first picture is held, and the page's width. */
    let pin = 0
    let cw = 1
    /* On a phone the chapter bar is always across the top by the time a
       picture fills the screen, so the picture need only fill below it. */
    let barH = 0
    /* Each part's first picture, down the page. */
    let firstTops: number[] = []
    let partTops: number[] = []
    let partHighs: number[] = []
    let codaTop = 0
    /* How far down the screen the last part's words reach. */
    let lastInkFoot = 0
    let bandTop = 0
    let bandHigh = 1
    let rest = 0
    /* Where the mark sits on the screen, from the stylesheet. */
    let tipAt = 0
    let tipHigh = 32
    const measure = () => {
      /* On a phone the frame takes the height the words leave it: the
         tallest part's words, measured, go to the stylesheet first, since
         the frame's size moves everything read after. */
      const wordsH = Math.max(0, ...holds.map((h) => h.querySelector<HTMLElement>('.days__words')?.offsetHeight ?? 0))
      el.style.setProperty('--words-h', `${wordsH}px`)
      tipAt = tip?.offsetTop ?? 0
      tipHigh = tip?.offsetHeight || 32
      /* A sticky picture reports where it is held, not where it belongs:
         set the holding aside for the moment of reading. */
      el.classList.add('is-measuring')
      tops = shots.map(pageTop)
      highs = shots.map((s) => s.offsetHeight)
      wides = shots.map((s) => s.offsetWidth)
      mids = shots.map((s) => pageLeft(s) + s.offsetWidth / 2)
      el.classList.remove('is-measuring')
      /* The hold: the stage's room past its picture — or, on a phone,
         where the stage gives way and every picture is held in the frame,
         the block of room it leaves after the first picture. */
      const stage = stages.find((x): x is HTMLElement => !!x)
      const opener = stage?.firstElementChild as HTMLElement | null
      const room = !stage || !opener ? 0
        : getComputedStyle(stage).display === 'contents'
          ? parseFloat(getComputedStyle(stage, '::after').height) || 0
          : stage.offsetHeight - opener.offsetHeight
      pin = still ? 0 : Math.max(0, room)
      firstTops = tops.filter((_, i) => firsts[i])
      cw = document.documentElement.clientWidth || window.innerWidth
      barH = phone.matches ? document.querySelector<HTMLElement>('.dn')?.offsetHeight ?? 0 : 0
      partTops = partEls.map(pageTop)
      partHighs = partEls.map((d) => d.offsetHeight)
      codaTop = coda ? pageTop(coda) : 0
      lastInkFoot = Math.max(0, ...lastInk.map((e) => e.offsetTop + e.offsetHeight))
      bandTop = pageTop(el)
      bandHigh = Math.max(el.offsetHeight, 1)
      /* Where a picture sits when it is in place: the frame's top. */
      rest = lead?.offsetHeight ?? window.innerHeight / 4
    }

    /* How far down the page the thread is drawn. */
    let drawnTo = 0
    /* When the last words were sent away. */
    let goneAt = -Infinity
    /* Where the pictures think the page is: the scroll, eased. */
    let eased = window.scrollY
    let last = 0
    let raf = 0
    /* Each first picture's size, eased: 0 the whole screen, 1 its frame. */
    const zooms = shots.map(() => NaN)
    let lastY = window.scrollY

    const update = (time: number) => {
      raf = 0
      const vh = window.innerHeight
      const y = window.scrollY

      const dt = last ? Math.min(time - last, 64) : 16.7
      last = time
      /* A jump lands at once, the zoom with it. */
      const jumped = Math.abs(y - lastY) > vh * 1.5
      lastY = y
      let settling = false
      /* A jump — the bar, a reload — lands at once; ordinary scrolling
         is followed at GLIDE a frame, with a mouse or trackpad only. */
      const glide = !still && !phone.matches && !touch.matches
      if (!glide || Math.abs(y - eased) > vh * 1.5) eased = y
      else eased += (y - eased) * (1 - Math.pow(1 - GLIDE, dt / 16.7))
      if (Math.abs(y - eased) < 0.3) eased = y
      const lag = Math.max(Math.min(y - eased, vh * TRAIL), -vh * TRAIL)
      /* Each picture trails on its own — all but a part's first, which
         the browser holds. */
      const trail = Math.abs(lag) < 0.3 ? '' : `translate3d(0, ${lag.toFixed(1)}px, 0) `

      /* Whose words are on the screen. */
      const n = partTops.length
      const runEnd = partTops[n - 1] + partHighs[n - 1] - y
      /* A part has the screen from when its first picture has come all
         the way down to its frame (without the hold, when the part is a
         third of the way up) until the part is half gone; in the pause
         between two parts, nobody does, and the words are away. Read from
         the picture, which a phone sets at a different depth in its part
         than a wide screen does. */
      const arrived = (i: number) => pin > 0
        ? firstTops[i] - y <= rest - pin
        : partTops[i] - y <= vh * 0.35
      let on = -1
      partTops.forEach((top, i) => {
        if (arrived(i) && top + partHighs[i] - y >= vh * 0.5) on = i
      })
      /* The mark stays through the pauses: from the first part's words
         to the last part's. */
      const among = arrived(0) && runEnd >= vh * 0.5
      /* New words wait for the last part's to finish fading, so two
         names are never seen in one place at once. */
      const now = performance.now()
      holds.forEach((h, i) => {
        const was = h.classList.contains('is-on')
        if (was && i !== on) { h.classList.remove('is-on'); goneAt = now }
      })
      holds.forEach((h, i) => {
        if (i !== on || h.classList.contains('is-on')) return
        h.style.setProperty('--wait', `${Math.round(Math.max(WAIT, FADE_OUT - (now - goneAt)))}ms`)
        h.classList.add('is-on')
      })
      /* On a phone the words sit at the foot of the screen, where the
         site's Ask Aura bar floats: it steps aside while a part is
         being read and comes back in the pauses. */
      const reading = phone.matches && on >= 0
      if (document.body.classList.contains('season-reading') !== reading) document.body.classList.toggle('season-reading', reading)

      shots.forEach((s, i) => {
        /* A first picture is held by its stage while the page goes the
           length of its pin, then goes on with the rest: `held` is how
           far it has been carried, and `top` where its frame is. */
        const at = tops[i] - y + (firsts[i] ? 0 : lag)
        const held = firsts[i] && pin > 0 ? Math.min(Math.max(rest - at, 0), pin) : 0
        const top = at + held
        const bottom = top + highs[i]
        if (bottom < -vh || top > vh * 2) { zooms[i] = NaN; return }
        const carry = firsts[i] ? '' : trail
        let z = 1
        if (firsts[i] && pin > 0) {
          const goal = held / pin
          z = zooms[i]
          if (Number.isNaN(z) || jumped || still) z = goal
          else z += (goal - z) * (1 - Math.pow(1 - ZOOM_EASE, dt / 16.7))
          if (Math.abs(goal - z) < 0.0008) z = goal
          zooms[i] = z
          if (z !== goal) settling = true
        }
        if (firsts[i] && pin > 0 && (held < pin || z < 1)) {
          /* Coming up, the picture fills the screen; held, it comes down
             to its frame, from the screen's middle to the frame's, with
             the shade for the words coming up as it lands. */
          const t = inOut(z)
          const w = wides[i], h = highs[i]
          /* The whole screen, or on a phone all of it below the bar. */
          const open = vh - barH
          const full = Math.max(cw / Math.max(w, 1), open / Math.max(h, 1)) * 1.01
          /* Centred on its subject, as far as it can go and still fill. */
          const reach = Math.max((w * full - cw) / 2, 0)
          const pan = Math.min(Math.max(-(opens[i] - 0.5) * w * full, -reach), reach)
          const sc = full + (1 - full) * t
          const dx = (cw / 2 - mids[i] + pan) * (1 - t)
          const dy = (barH + open / 2 - (rest + h / 2)) * (1 - t)
          s.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(${sc.toFixed(4)})`
          s.style.filter = 'none'
          s.style.opacity = ''
          s.style.setProperty('--shade', t.toFixed(3))
          return
        }
        if (firsts[i]) s.style.removeProperty('--shade')
        /* 1 as it comes up from the bottom of the screen, 0 once in
           place. */
        const away = clamp((top - rest) / Math.max(vh - rest, 1))
        const ease = Math.pow(clamp((away - (1 - CLEAR)) / CLEAR), 1.4)
        /* The phone's push, cleared on a wide screen (a window resized). */
        if (!phone.matches) for (const m of medias[i]) if (m.style.transform) m.style.transform = ''
        if (phone.matches) {
          /* On a phone every picture is held in the frame, between the
             name and the words, and nothing scrolls past them: each one
             rises unseen beneath the last and fades in over it once it is
             in place. The part's first is the ground they gather on. */
          const k = clamp((rest - at) / (vh * PHONE_FADE))
          s.style.filter = 'none'
          s.style.transform = 'none'
          s.style.opacity = firsts[i] ? '' : (still ? (k > 0 ? 1 : 0) : k * k * (3 - 2 * k)).toFixed(3)
          /* The push: from when the picture is in place (for a part's
             first, once it has come down from the whole screen) until the
             next has faded in over it, or the part ends. */
          if (!still) {
            const from = firsts[i] ? pin : 0
            const next = i + 1 < shots.length && !firsts[i + 1]
            const span = next
              ? tops[i + 1] - tops[i] - from + vh * PHONE_FADE
              : partTops[partOf[i]] + partHighs[partOf[i]] - tops[i] - from
            const p = clamp((rest - at - from) / Math.max(span, 1))
            const z = p > 0 ? `scale(${(1 + PHONE_PUSH * p).toFixed(4)})` : ''
            for (const m of medias[i]) if (m.style.transform !== z) m.style.transform = z
          }
        } else if (still || away < 0.002) {
          s.style.transform = carry || 'none'
          s.style.filter = 'none'
          s.style.opacity = ''
        } else {
          s.style.transform = `${carry}scale(${(1 + SWELL * ease).toFixed(4)})`
          s.style.filter = `blur(${(BLUR * ease).toFixed(2)}px)`
          s.style.opacity = ''
        }
        /* A handwritten note writes itself on as the picture comes into
           place: from as it turns sharp to just past the middle. */
        const pen = pens[i]
        if (pen.length) {
          const h = highs[i]
          /* On a phone, from halfway through its fade in. */
          const start = phone.matches ? rest - vh * PHONE_FADE * 0.5 : rest + (vh - rest) * (1 - CLEAR)
          const end = phone.matches ? rest - vh * PHONE_FADE * 1.6 : rest - h * 0.12
          const w = still ? 1 : clamp((start - top) / Math.max(start - end, 1))
          for (const line of pen) {
            const lw = clamp((w - line.from) / line.share)
            line.el.style.setProperty('--wipe', `${(lw * 112).toFixed(1)}%`)
          }
        }
        /* A film plays while it is mostly on the screen — never for anyone
           who has asked for less motion or to save data, who keep the
           still beneath it. If it cannot play (autoplay refused, low
           power) the still stays. */
        const v = films[i]
        if (v && !still && !lean) {
          /* On a phone: while it is the picture on top, in the frame. */
          const nextAt = i + 1 < shots.length && !firsts[i + 1] ? tops[i + 1] - y : Infinity
          const partEnd = partTops[partOf[i]] + partHighs[partOf[i]] - y
          const seen = phone.matches
            ? at < rest && rest - nextAt < vh * PHONE_FADE && partEnd > vh * 0.25
            : top < vh * 0.75 && bottom > vh * 0.25
          if (seen && v.paused) v.play().then(() => v.setAttribute('data-ready', 'true')).catch(() => {})
          else if (!seen && !v.paused) v.pause()
        }
      })

      /* On a phone the closing comes up through the place the last
         part's words are fixed in. They give way to it with the scroll —
         fully gone by the time its top reaches their foot, however fast
         the reader goes — rather than on a clock that a quick scroll can
         outrun. */
      const give = phone.matches && coda
        ? clamp((codaTop - y - lastInkFoot) / (vh * 0.15))
        : 1
      lastInk.forEach((e) => { e.style.opacity = give < 1 ? give.toFixed(3) : '' })

      /* The closing photograph: fades in as it arrives, stays whole and
         bright, then darkens while the lines come up one by one. On a
         phone the closing is plain content: nothing to drive. */
      if (coda && phone.matches) {
        if (codaBg) codaBg.style.opacity = ''
        if (codaShade) codaShade.style.opacity = '0'
        codaLines.forEach((l) => { l.style.opacity = '' })
      } else if (coda) {
        const ct = codaTop - y
        const into = -ct
        const smooth = (t: number) => t * t * (3 - 2 * t)
        const shown = clamp(1 - ct / (vh * 0.8))
        const dim = smooth(clamp((into - vh * CODA_BRIGHT) / (vh * CODA_DIM)))
        if (codaBg) codaBg.style.opacity = shown.toFixed(3)
        if (codaShade) codaShade.style.opacity = (CODA_SHADE * dim).toFixed(3)
        codaLines.forEach((l, i) => {
          const from = vh * (CODA_BRIGHT + CODA_DIM * 0.3 + i * CODA_LINE)
          l.style.opacity = smooth(clamp((into - from) / (vh * CODA_LINE_IN))).toFixed(3)
        })
      }

      /* The mark shows with the words — only among the parts — and the
         thread is drawn down to it while it shows. When the parts are
         done the thread stops where the mark last was and goes up with
         the page. */
      if (tip) {
        const shown = among
        if (tip.classList.contains('is-on') !== shown) tip.classList.toggle('is-on', shown)
        if (shown) drawnTo = y + tipAt + tipHigh / 2
        else if (partTops[0] - y > 0) drawnTo = bandTop
        /* Arrived past the parts without passing through them. */
        else if (drawnTo <= bandTop) drawnTo = partTops[n - 1] + partHighs[n - 1]
        if (spine) {
          const g = clamp((drawnTo - bandTop) / bandHigh)
          spine.style.setProperty('--grow', `${(g * 100).toFixed(2)}%`)
        }
      }

      /* Keep going until the pictures have caught the page up, and a
         first picture's size has caught up with its place. */
      if (eased !== y || settling) raf = requestAnimationFrame(update)
      else last = 0
    }
    /* With nothing to glide — a touch screen, a phone, reduced motion —
       the page follows the scroll event itself rather than waiting for
       an animation frame, so it never stands half-done where frames are
       held back. */
    const wake = () => {
      if (still || phone.matches || touch.matches) { cancelAnimationFrame(raf); update(performance.now()); return }
      if (!raf) raf = requestAnimationFrame(update)
    }
    const remeasure = () => { measure(); wake() }
    /* The run itself, and the whole page: anything above the run that
       changes height — the intro as its fonts arrive — moves the run
       without resizing it. */
    const ro = new ResizeObserver(remeasure)
    ro.observe(el)
    ro.observe(document.body)

    measure()
    wake()
    /* Again once the page has its real size: a reload restored to the
       middle of a part sends no scroll to start that part's film. */
    window.addEventListener('load', remeasure)
    window.addEventListener('scroll', wake, { passive: true })
    window.addEventListener('resize', remeasure)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('load', remeasure)
      window.removeEventListener('scroll', wake)
      window.removeEventListener('resize', remeasure)
      document.body.classList.remove('season-reading')
      /* Switched to agent mode mid-read: the films stop with the page. */
      el.querySelectorAll('video').forEach((v) => v.pause())
    }
  }, [days, reading])

  return (
    <section className="days" data-season-run ref={root}>
      {/* The thread down the middle, as on RIPE's own timeline. */}
      <div className="days__spine" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="days__tip" src="/RIPE/aura-mark-slow.svg" alt=""
             width={32} height={32} loading="lazy" decoding="async" />
      </div>

      {days.map((d) => (
        <div className="days__day" id={daySlug(d.title)} key={d.title}>
          {/* The name and the words, fixed to the screen while the part
              has it. */}
          <div className="days__hold">
            <h2 className="days__name">
              <span className="sr-only">{d.title}</span>
              {d.art.map((a) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={a.src} className="days__art" src={a.src} alt="" aria-hidden
                     width={a.w} height={a.h} loading="lazy" decoding="async" />
              ))}
              {d.sketch && (() => {
                const k = d.sketch
                const m = k.motion
                const tilt = ((k.tilt ?? 0) * Math.PI) / 180
                const img = (cls: string, src: string, clip?: string) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className={cls} src={src} alt="" width={k.w} height={k.h}
                       loading="lazy" decoding="async" style={clip ? { clipPath: clip } : undefined} />
                )
                /* The drawing, and over it whatever part of it moves: a
                   layer of its own, so only that layer is ever redrawn. */
                return (
                  <span className={`days__sketch${m ? ` is-${m.kind}` : ''}`} aria-hidden
                        style={{ ['--tilt' as string]: `${k.tilt ?? 0}deg`,
                                 ['--scale' as string]: k.scale ?? 1,
                                 ['--scale-phone' as string]: k.phoneScale ?? k.scale ?? 1,
                                 /* Straight down on the screen, in the tilted drawing's own terms. */
                                 ['--fx' as string]: Math.sin(tilt).toFixed(3),
                                 ['--fy' as string]: Math.cos(tilt).toFixed(3),
                                 ...(m?.kind === 'flap' ? { ['--axis' as string]: `${m.axis}%` } : {}),
                                 ...(m && 'origin' in m ? { ['--origin' as string]: m.origin } : {}) } as React.CSSProperties}>
                    {img('days__sk', k.src, m && 'rest' in m ? m.rest : undefined)}
                    {m?.kind === 'flap' && <>{img('days__sk days__wing is-l', k.src)}{img('days__sk days__wing is-r', k.src)}</>}
                    {m && (m.kind === 'nod' || m.kind === 'flicker' || m.kind === 'wave') &&
                      img('days__sk days__move', m.partSrc ?? k.src, m.part)}
                    {m?.kind === 'rain' && m.drops.map(([x, y], i) => (
                      <i key={i} className="days__drop"
                         style={{ left: `${x}%`, top: `${y}%`,
                                  animationDelay: `${((i * 0.61) % 2.1).toFixed(2)}s`,
                                  animationDuration: `${(1.7 + (i % 3) * 0.35).toFixed(2)}s` }} />
                    ))}
                  </span>
                )
              })()}
            </h2>
            <div className="days__words">
              <p className="days__line">{d.line}</p>
              <p className="days__text">{d.text}</p>
            </div>
          </div>

          {/* The pictures: up the middle on a wide screen, held in the
              frame on a phone. */}
          <div className="days__run">
            <i className="days__lead" aria-hidden />
            {d.shots.map((s, k) => {
              const figure = (
              <figure className={`days__shot${k === 0 ? ' is-first' : ''}`}
                      data-open={k === 0 && s.openAt != null ? s.openAt : undefined}
                      style={s.zoom ? ({ ['--zoom' as string]: s.zoom.scale, ['--zoom-at' as string]: s.zoom.at } as React.CSSProperties) : undefined}>
                {s.video ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="days__still" src={s.src} alt={s.alt}
                         width={s.w} height={s.h} loading="lazy" decoding="async" />
                    {/* The still carries the description; the film is its moving copy. */}
                    <video className="days__film" muted loop playsInline preload="none"
                           width={s.w} height={s.h} aria-hidden>
                      <source src={s.video} type="video/mp4" />
                    </video>
                  </>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.src} alt={s.alt} width={s.w} height={s.h}
                       srcSet={s.small ? `${s.small} 1290w, ${s.src} ${s.w}w` : undefined}
                       sizes={s.small ? (k === 0 ? UPRIGHT_SIZES_FIRST : UPRIGHT_SIZES) : undefined}
                       loading="lazy" decoding="async" />
                )}
                {s.note && (
                    <figcaption className="days__note">
                      {s.note.split('\n').map((l) => (
                        <span key={l} className="days__ink">
                          {l.split('|').map((seg) => <span key={seg} className="days__pen">{seg.trim()}</span>)}
                        </span>
                      ))}
                    </figcaption>
                )}
              </figure>
              )
              /* The first picture's stage: its own height and the scroll
                 it is held for while it comes down from the whole screen
                 to its frame. */
              return k === 0
                ? <div className="days__stage" key={s.name}>{figure}</div>
                : <Fragment key={s.name}>{figure}</Fragment>
            })}
            <i className="days__tail" aria-hidden />
          </div>
        </div>
      ))}

      {/* What the season came to, over everyone together at the end:
          first the photograph on its own, then, as the reader goes on,
          it darkens and the closing lines come up over it one by one. */}
      <div className="days__coda">
        <div className="days__coda-stage">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="days__coda-bg" src={SEASON_CODA_PHOTO.src} alt={SEASON_CODA_PHOTO.alt}
               width={SEASON_CODA_PHOTO.w} height={SEASON_CODA_PHOTO.h} loading="lazy" decoding="async" />
          <i className="days__coda-shade" aria-hidden />
          <div className="section-w">
            <div className="days__coda-t">
              {SEASON_CODA.map((l) => <p className="days__coda-l" key={l}>{l}</p>)}
            </div>
          </div>
        </div>
      </div>

      {/* The Discover Aura lane after the run, kept on the same black.
          It paints from the theme's tokens, so the site's own night
          values are set on it here, for this page only. The site footer
          stays the site's own white. */}
      <style jsx global>{`
        body:has([data-season-run]) .ripe-page .sw {
          --bg: #000;
          --bg-card: #0b0b0b;
          --text: #fff;
          --text-body: rgba(255, 255, 255, 0.65);
          --text-muted: rgba(255, 255, 255, 0.4);
          --text-dim: rgba(255, 255, 255, 0.25);
          --border: rgba(255, 255, 255, 0.08);
          --border-strong: rgba(255, 255, 255, 0.14);
        }
        body:has([data-season-run]) .ripe-page .sw .invert-on-light { filter: none !important; }
        /* The Ask Aura bar, out of the words' way on a phone while a part
           is read — into its own resting state, so it leaves and returns
           on its own transition — and back as soon as it has focus. */
        body.season-reading .aa-launch.is-in {
          opacity: 0; pointer-events: none;
          transform: translateX(-50%) translateY(18px);
        }
        body.season-reading .aa-launch.is-in:focus-visible {
          opacity: 1; pointer-events: auto; transform: translateX(-50%) translateY(0);
        }

      `}</style>
      <style jsx>{`
        /* Lit, on the page's black, as mosaicist.com sets its process:
           the pictures are the colour, the names the pink, the words
           white. */
        .days {
          position: relative;
          --story-ink: #fff;
          --story-muted: rgba(255, 255, 255, 0.78);

          /* The frame: the Figma section frames' own shape, 1920 × 1300,
             as wide as the screen allows while keeping a margin above
             and below it. */
          --ratio: 1.4769;
          --fw: min(60vw, calc((100svh - 180px) * var(--ratio)));
          --fh: calc(var(--fw) / var(--ratio));
          /* Where the frame sits while held: the middle of the screen. */
          --ft: calc((100svh - var(--fh)) / 2);
          /* Between one picture and the next. */
          --gap: clamp(64px, 12.8svh, 160px);
          /* Between one part and the next. */
          --part-gap: 50svh;
          /* How long a part's first picture is held while it comes down
             from the whole screen to its frame. */
          --pin: 100svh;
          /* Between the opening words and the first part. */
          --open-gap: 30svh;
          /* Between the last part and the closing words. */
          --coda-gap: 45svh;
          /* The name and the words are centred on one line, the mark's:
             the middle of the screen, which is the middle of the frame. */
          --line: 50svh;
          --edge: max(var(--gutter, 20px), 5vw);
          --col: 25vw;
          /* One height for every line of every name, set so a line 3.92
             times as wide as it is high would fill the column; the
             widest, our rhythm, is 2.86. */
          --art-h: min(calc(var(--col) / 3.92), 120px);
          /* The words' measure: about as wide as a name is drawn, so the
             two sides mirror each other across the mark — the same margin
             from the screen's edge, and near enough the same gap to the
             mark. */
          --words: max(18vw, 230px);
        }

        /* ── the thread ─────────────────────────────────────────────── */
        /* Over everything in the run, so the mark is never cut; placed
           without a transform, which would carry the fixed mark inside it
           along with the page. */
        .days__spine {
          position: absolute; top: 0; left: calc(50% - 1.5px);
          width: 3px; height: 100%; z-index: 4; pointer-events: none;
          --grow: 0%;
        }
        .days__tip {
          display: block; position: fixed;
          top: calc(var(--line) - 16px); left: calc(50% - 16px);
          width: 32px; height: 32px; max-width: none;
          opacity: 0; transition: opacity .56s cubic-bezier(.4, 0, .2, 1);
        }
        .days__tip.is-on { opacity: 1; }
        .days__spine::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0.55px, transparent 1px) top / 3px 7px repeat-y;
          clip-path: inset(0 0 calc(100% - var(--grow)) 0);
        }

        /* ── a part ─────────────────────────────────────────────────── */
        .days__day { position: relative; }
        /* A pause between parts, longer than the gap between pictures,
           so each part reads as its own chapter. */
        .days__day + .days__day { margin-top: var(--part-gap); }
        /* Room after the opening words, so the first part's picture,
           rising at the size of the whole screen, comes up clear of them. */
        .days__spine + .days__day { margin-top: var(--open-gap); }
        /* Fixed: the words never scroll. One part's at a time — the
           leaving words fade where they are, the new ones come up in the
           same place. Both ways are transitions: a keyframe animation
           for the coming in left the browser nothing to fade out from,
           and the words vanished at a stroke. */
        .days__hold {
          position: fixed; inset: 0 0 auto; z-index: 3;
          height: 100svh; pointer-events: none;
          opacity: 0; visibility: hidden;
          /* Going: quicker than the coming, so the words are gone before
             the next part's pictures arrive; eased gently at both ends. */
          transition: opacity ${FADE_OUT}ms cubic-bezier(.37, 0, .63, 1), visibility 0s linear ${FADE_OUT}ms;
        }
        /* Coming: after a moment (--wait, set by the script so the last
           words have gone first), slowly up to full. */
        .days__hold.is-on {
          opacity: 1; visibility: visible;
          transition: opacity ${FADE_IN}ms cubic-bezier(.33, 0, .2, 1) var(--wait, ${WAIT}ms), visibility 0s;
        }
        .days__name {
          position: absolute; z-index: 2; left: var(--edge); top: var(--line);
          margin: 0; line-height: 0;
          /* Centred on the line. The lettering's box keeps room below for
             swash tails, so the box sits a touch low for its letters;
             drawn up by that much so the letters, not the box, centre. */
          translate: 0 calc(-50% + var(--art-h) * 0.06);
        }
        .days__art { display: block; width: auto; height: var(--art-h); max-width: none; }
        /* Hung below the name, out of the flow, so the name stays centred
           on the line with the words — measured from the letters' baseline,
           not the foot of the lettering's box, which keeps 37% of its
           height empty for descenders. */
        .days__sketch {
          position: absolute; left: 0; display: block;
          top: calc(100% - var(--art-h) * 0.37 + clamp(8px, 1.3svh, 16px) + 15px);
          width: calc(clamp(110px, 10.5vw, 180px) * var(--scale, 1)); height: auto; max-width: none;
          /* Each drawing's own lean: the umbrella to the left, as if held
             against the weather. */
          rotate: var(--tilt, 0deg); transform-origin: 50% 60%;
        }
        .days__sk { display: block; width: 100%; height: auto; max-width: none; }
        .days__sk + .days__sk { position: absolute; inset: 0; height: 100%; }

        /* ── the drawings' own small movements ─────────────────────────
           Each slight, slow and out of step with the others; transforms
           and opacity only, on layers of their own. */
        .days__move { transform-origin: var(--origin, 50% 50%); will-change: transform; }
        /* The calf's head, a slow nod from the neck. */
        .is-nod .days__move { animation: sk-nod 3.6s ease-in-out infinite; }
        @keyframes sk-nod {
          0%, 100% { rotate: 0deg; }
          35% { rotate: -8deg; }
          68% { rotate: 3deg; }
        }
        /* The flame, stretching, leaning and dimming from its base,
           unevenly, as a flame in still air does. */
        .is-flicker .days__move { animation: sk-flicker 1.6s ease-in-out infinite; }
        @keyframes sk-flicker {
          0%, 100% { scale: 1 1; rotate: 0deg; opacity: 1; }
          12% { scale: 0.94 1.1; rotate: -3deg; opacity: 0.9; }
          27% { scale: 1.04 0.93; rotate: 2.2deg; opacity: 1; }
          41% { scale: 0.95 1.12; rotate: -1.2deg; opacity: 0.86; }
          58% { scale: 1.03 0.95; rotate: 3deg; opacity: 1; }
          74% { scale: 0.95 1.08; rotate: -2deg; opacity: 0.92; }
          88% { scale: 1.02 0.97; rotate: 1deg; opacity: 1; }
        }
        /* The name tag, swaying from its knot. */
        .is-wave .days__move { animation: sk-wave 3.8s ease-in-out infinite; }
        @keyframes sk-wave {
          0%, 100% { rotate: -1.2deg; }
          50% { rotate: 2deg; }
        }
        /* The butterfly: each half tilting about the body, as wings do
           at rest, breathing. The whole drawing keeps its place; its two
           halves are drawn over it. */
        .is-flap { perspective: 520px; }
        .is-flap > .days__sk:first-child { visibility: hidden; }
        .days__wing { transform-origin: var(--axis, 50%) 50%; will-change: transform; }
        .days__wing.is-l { clip-path: inset(0 calc(100% - var(--axis, 50%)) 0 0); animation: sk-flap-l 2.6s ease-in-out infinite; }
        .days__wing.is-r { clip-path: inset(0 0 0 var(--axis, 50%)); animation: sk-flap-r 2.6s ease-in-out infinite; }
        @keyframes sk-flap-l { 0%, 100% { transform: rotateY(0deg); } 50% { transform: rotateY(40deg); } }
        @keyframes sk-flap-r { 0%, 100% { transform: rotateY(0deg); } 50% { transform: rotateY(-40deg); } }
        /* Rain: short streaks falling onto the canopy and breaking flat
           where they land — straight down the screen, whatever the
           umbrella's lean: each streak is turned back upright, and falls
           along the screen's own down (--fx, --fy) in the drawing's terms.
           A streak's foot is its landing point. */
        .is-rain { container-type: inline-size; }
        .days__drop {
          position: absolute; width: 1.5%; aspect-ratio: 0.26;
          margin-left: -0.75%; margin-top: -5.77%;
          background: linear-gradient(to bottom, rgba(255, 96, 165, 0), #ff60a5 70%);
          border-radius: 50%;
          rotate: calc(-1 * var(--tilt, 0deg)); transform-origin: 50% 100%;
          opacity: 0; will-change: transform, opacity;
          animation: sk-drop 2s linear infinite;
        }
        @keyframes sk-drop {
          0% { opacity: 0; scale: 1; translate: calc(var(--fx) * -16cqw) calc(var(--fy) * -16cqw); animation-timing-function: cubic-bezier(.45, 0, .9, .55); }
          10% { opacity: 1; }
          52% { opacity: 1; scale: 1; translate: 0 0; animation-timing-function: ease-out; }
          60% { opacity: 0.75; scale: 2.6 0.22; translate: 0 0; }
          72% { opacity: 0; scale: 3.2 0.12; translate: 0 0; }
          100% { opacity: 0; scale: 1; translate: calc(var(--fx) * -16cqw) calc(var(--fy) * -16cqw); }
        }
        @media (prefers-reduced-motion: reduce) {
          .days__move, .days__wing { animation: none; }
          .days__drop { display: none; }
        }
        .days__art + .days__art { margin-top: calc(var(--art-h) * -0.36); }
        .days__words {
          position: absolute; z-index: 2; right: var(--edge); top: var(--line);
          width: var(--words); translate: 0 -50%;
        }
        .days__line {
          margin: 0;
          font-family: var(--font-grotesque), sans-serif; font-weight: 400;
          font-size: var(--t-p1-size); line-height: 1.3;
          letter-spacing: var(--t-track); color: var(--story-ink); text-wrap: balance;
        }
        .days__text {
          margin: 1.1em 0 0;
          font-family: var(--font-grotesque), sans-serif; font-weight: 400;
          font-size: var(--t-p2-size); line-height: 1.5;
          letter-spacing: var(--t-track); color: var(--story-muted); text-wrap: pretty;
        }

        /* ── the pictures ───────────────────────────────────────────── */
        /* Each picture moves on its own (the glide is per picture, so a
           held first picture is never dragged by it); the run stays put. */
        .days__run { position: relative; z-index: 1; }
        .days__lead { display: block; height: var(--ft); }
        /* The rest of the screen under the last picture: the words let
           go as it reaches the middle. */
        .days__tail { display: block; height: calc(100svh - var(--ft) - var(--fh)); }
        .days__shot {
          position: relative; width: var(--fw); height: var(--fh);
          margin: var(--gap) auto 0; overflow: hidden;
          border-radius: var(--radius-1); background: #111;
          will-change: transform, filter;
        }
        .days__lead + .days__shot { margin-top: 0; }
        .days__stage { position: relative; height: calc(var(--fh) + var(--pin)); }
        .days__stage > .days__shot { position: sticky; top: var(--ft); margin-top: 0; }
        /* The shade for the words fades up as the first picture lands: on
           a layer of its own, so the fade never repaints the photograph. */
        .days__shot.is-first::after { will-change: opacity; }
        /* Set for a moment while the script reads where each picture
           belongs, so a held one doesn't report where it is held. */
        .days.is-measuring .days__shot { position: relative !important; top: auto !important; }
        /* Without motion, no hold: the first picture is simply there, at
           its own size, so it needs no extra room before it either. */
        @media (prefers-reduced-motion: reduce) {
          .days__stage { height: auto; }
          .days__stage > .days__shot { position: relative; }
          .days__spine + .days__day { margin-top: 0; }
        }
        .days__shot :global(img),
        .days__shot :global(video) {
          display: block; width: 100%; height: 100%;
          object-fit: cover;
          /* A closer crop where a picture asks for one — the pour-over,
             to lose the lettering on the tablecloth at its foot. */
          scale: var(--zoom, 1); transform-origin: var(--zoom-at, 50% 50%);
          filter: saturate(1.12) sepia(0.05) contrast(1.02) brightness(0.9);
        }
        /* The words overlap the frame's two sides; a shade under each
           keeps them readable whatever the picture is. */
        .days__shot::after {
          content: ''; position: absolute; inset: 0; z-index: 2; pointer-events: none;
          opacity: var(--shade, 1);
          background: linear-gradient(to right,
            rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0) 26%,
            rgba(0, 0, 0, 0) 66%, rgba(0, 0, 0, 0.62) 100%);
        }
        /* The still holds the frame until the film can play over it. */
        .days__shot :global(.days__still) { position: absolute; inset: 0; }
        .days__shot :global(.days__film) {
          position: relative; z-index: 1;
          opacity: 0; transition: opacity .6s var(--ease-out);
        }
        .days__shot :global(.days__film[data-ready='true']) { opacity: 1; }
        /* A handwritten line across the middle of a picture, in the
           site's hand. It writes itself on as the picture comes into
           place — RIPE's pen: a mask wiping left to right with a short
           feathered edge, the width of the nib, so the letters arrive
           stroke by stroke. --wipe is set by the script from the scroll.
           Flat white ink, no shadow. */
        .days__note {
          position: absolute; left: 0; right: 0; top: 50%; z-index: 3; margin: 0;
          translate: 0 -50%; padding: 0 16px; text-align: center;
        }
        /* Each stroke of the pen is a span as wide as its words, wiped on
           its own, the next beginning where the last one ended: a line
           is one stroke, or two where a '|' lets it break on a phone —
           side by side on a wide screen, so it reads as one. */
        .days__ink { display: block; }
        .days__pen + .days__pen { margin-left: 0.26em; }
        .days__pen {
          display: inline-block; color: #fff;
          font-family: var(--font-hand), cursive; font-weight: 400;
          /* A line never breaks (the pen writes it in one stroke), so on
             a narrow phone the hand comes down a size to fit it. */
          font-size: min(var(--t-hand-size), 4.6vw); line-height: var(--t-hand-lh);
          white-space: nowrap;
          -webkit-mask-image: linear-gradient(to right,
            #000 calc(var(--wipe, 112%) - 7%), transparent var(--wipe, 112%));
          mask-image: linear-gradient(to right,
            #000 calc(var(--wipe, 112%) - 7%), transparent var(--wipe, 112%));
        }

        /* ── the coda ───────────────────────────────────────────────── */
        /* A longer pause than between parts, then the last photograph,
           held on the screen while the reader scrolls: whole and bright
           at first, then darkening as the closing lines come up over it.
           The script drives all three from the scroll. */
        .days__coda {
          position: relative; z-index: 4;
          margin-top: var(--coda-gap);
          height: ${CODA_SCREENS * 100}svh;
        }
        .days__coda-stage {
          position: sticky; top: 0; height: 100svh; overflow: hidden;
          display: flex; align-items: center;
        }
        .days__coda-stage > .section-w { position: relative; z-index: 2; width: 100%; }
        .days__coda-bg {
          position: absolute; inset: 0; z-index: 0;
          width: 100%; height: 100%; object-fit: cover; object-position: 50% 40%;
          opacity: 0;
        }
        .days__coda-shade {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: #000; opacity: 0;
        }
        .days__coda-t {
          margin: 0 auto; max-width: 24em; text-align: center;
          font-family: var(--font-grotesque), sans-serif; font-weight: 400;
          font-size: var(--t-p1-size); line-height: var(--t-p1-lh);
          letter-spacing: var(--t-track); color: var(--story-ink); text-wrap: pretty;
        }
        .days__coda-l { margin: 0; opacity: 0; }
        .days__coda-l + .days__coda-l { margin-top: .6em; }

        /* ── phones ─────────────────────────────────────────────────────
           As mosaicist.com sets it on a phone held upright: the thread down
           the left edge, the name and the words indented past it, the frame
           the full width of the screen between them, and the mark riding
           the thread where the frame meets the words. (On its side a phone
           takes the wide layout, which fits that shape.) */
        @media (max-width: 899px) and (orientation: portrait) {
          .days {
            --top: 100px;
            --rail: 28px;
            --indent: 68px;
            --art-h: 48px;
            /* As wide as the screen, unless the height can't hold it: then
               the height left once the name's room above and the tallest
               part's words below (--words-h, measured) are taken — down
               to no less than 72% of the width. */
            --fw: min(100vw, max(calc((100svh - var(--ft) - var(--words-h, 215px) - 12px) * var(--ratio)), 72vw));
            /* One place for the frame in every part, under room for the
               three lines of Leaving something behind — 2.28 lines high
               once they overlap — clear of the bars above; a two-line
               name sits lower in the same room, on the frame. */
            --ft: calc(var(--top) + var(--art-h) * 2.28 + 16px);
            /* The scroll each picture is held for after it has faded in. */
            --gap: 36svh;
            /* Long enough that a part's first picture, rising at the size
               of the whole screen, comes up only once the last part's
               picture and words have gone. */
            --part-gap: 75svh;
            --coda-gap: 36svh;
            --pin: 85svh;
            --open-gap: 45svh;
          }
          .days__spine { left: calc(var(--rail) - 1.5px); }
          .days__tip { top: calc(var(--ft) + var(--fh) - 16px); left: calc(var(--rail) - 16px); }
          .days__shot { will-change: transform, opacity; }
          /* A handwritten line breaks where its '|' says, each half a
             stroke of its own, centred one under the other. */
          .days__pen { display: block; width: fit-content; margin-inline: auto; }
          .days__pen + .days__pen { margin-left: auto; }
          /* Beside the name on a phone: below it is the picture. */
          .days__sketch {
            top: auto; bottom: 0; left: calc(100% + 23px);
            width: min(calc(84px * var(--scale-phone, 1)), calc(100vw - var(--indent) - 100% - 39px));
          }
          .days__name {
            left: var(--indent); top: auto; translate: none;
            bottom: calc(100svh - var(--ft) + 10px);
          }
          .days__words {
            left: 0; right: 0; width: auto; translate: none;
            top: calc(var(--ft) + var(--fh));
            padding: 20px var(--gutter, 20px) 0 var(--indent);
          }
          .days__text { margin-top: .8em; }
          /* On a phone the closing is ordinary content scrolling with the
             page: the closing lines, plainly there, then the photograph
             whole beneath them — no hold, no darkening, no reveal. */
          .days__coda { height: auto; padding-bottom: 18svh; }
          .days__coda-stage {
            position: static; height: auto; overflow: visible;
            flex-direction: column; align-items: stretch; gap: 32px;
          }
          .days__coda-stage > .section-w { order: -1; flex: none; }
          .days__coda-bg {
            position: relative; inset: auto; flex: none; opacity: 1;
            width: 100%; height: auto; aspect-ratio: 1064 / 705; object-fit: cover;
          }
          .days__coda-shade { display: none; }
          .days__coda-l { opacity: 1; }
          /* Set to the left, on the page's own margin: the same line as
             the opening words at the top of the page, which the closing
             answers. The thread has ended above it, so nothing is in
             the way. */
          .days__coda-t { margin: 0; text-align: left; }
          /* No room held above a part's pictures on a phone — the words
             are fixed and do not need it. The lead keeps its height, out of
             the flow, because the script measures the frame's place by it.
             Below the last picture, room for it to fade in and be held
             like the others before the part's pictures go together. */
          .days__lead { margin-bottom: calc(-1 * var(--ft)); }
          .days__tail { height: calc(var(--gap) + var(--fh)); }
          /* Every picture held in the frame, the later over the earlier,
             each unseen until it fades in: the stage gives way, so the
             first is held with the rest to the end of the part, and its
             hold becomes a block of room after it — room of its own, not
             a margin, which would let it go early, out from behind the
             others. */
          .days__stage { display: contents; }
          .days__stage::after { content: ''; display: block; height: var(--pin); }
          .days__shot { position: sticky; top: var(--ft); }
          .days__shot:not(.is-first) { opacity: 0; }
          .days__shot { border-radius: 0; }
          .days__shot::after { display: none; }
        }

        /* A short phone (an SE, or any phone with its browser's bars out):
           the names a size down and the words a little closer, so the
           frame keeps more of its width. */
        @media (max-width: 899px) and (orientation: portrait) and (max-height: 700px) {
          .days { --top: 96px; --art-h: 42px; }
          .days__words { padding-top: 14px; }
        }

        /* ── agent view ─────────────────────────────────────────────
           The site's plain reading: no pictures and no scroll. A part is
           its name, its words and its handwritten notes, one after the
           other in the site's markdown rhythm. Every frame, pin room and
           pause between parts existed for the pictures, and goes with
           them. A picture's frame collapses to its note, if it has one. */
        :global([data-view='agent']) .days__spine,
        :global([data-view='agent']) .days__lead,
        :global([data-view='agent']) .days__tail,
        :global([data-view='agent']) .days__sketch,
        :global([data-view='agent']) .days__coda-bg,
        :global([data-view='agent']) .days__coda-shade,
        :global([data-view='agent']) .days__stage::after { display: none !important; }
        :global([data-view='agent']) .days,
        :global([data-view='agent']) .days__day,
        :global([data-view='agent']) .days__hold,
        :global([data-view='agent']) .days__run,
        :global([data-view='agent']) .days__name,
        :global([data-view='agent']) .days__words,
        :global([data-view='agent']) .days__coda,
        :global([data-view='agent']) .days__coda-stage,
        :global([data-view='agent']) .days__coda-t {
          display: block !important; width: auto !important; max-width: none !important;
          height: auto !important; min-height: 0 !important;
          padding: 0 !important; overflow: visible !important; translate: none !important;
        }
        :global([data-view='agent']) .days__day,
        :global([data-view='agent']) .days__hold,
        :global([data-view='agent']) .days__run,
        :global([data-view='agent']) .days__words,
        :global([data-view='agent']) .days__coda,
        :global([data-view='agent']) .days__coda-stage,
        :global([data-view='agent']) .days__coda-t { margin: 0 !important; }
        :global([data-view='agent']) .days__stage,
        :global([data-view='agent']) .days__shot { display: contents !important; }
        /* The name is lettering with the words for screen readers under
           it; with the lettering gone, those words are the heading. */
        :global([data-view='agent']) .days__name .sr-only {
          width: auto !important; height: auto !important; margin: 0 !important;
          overflow: visible !important; clip: auto !important; clip-path: none !important;
          white-space: normal !important;
        }
        /* A note is a line of the part, without the pen that writes it on. */
        :global([data-view='agent']) .days__note {
          display: block !important; margin: 0 0 8px !important; padding: 0 !important;
          translate: none !important; text-shadow: none !important;
        }
        :global([data-view='agent']) .days__ink { display: block !important; }
        :global([data-view='agent']) .days__pen {
          display: inline !important; white-space: normal !important; text-shadow: none !important;
          mask: none !important; -webkit-mask: none !important;
        }
        /* The closing lines are not the last part's: the site's section
           break between them, as agent mode sets between sections. */
        :global([data-view='agent']) .days__coda::before {
          content: '---'; display: block; margin: 24px 0;
        }
        /* Two strokes of one line meet with a space, not a margin. */
        :global([data-view='agent']) .days__pen + .days__pen::before { content: ' '; }
      `}</style>
    </section>
  )
}

/* ── The statement under the opener ──────────────────────────────────
   Five short lines, set as one block: what the place left behind rather
   than what happened on which day. */
export function RipeSeasonIntro({ lines, note }: { lines: string[]; note?: string[] }) {
  return (
    <section className="intro">
      <div className="section-w">
        {/* RIPE's opening statement: the same h2 role, the same
            word-by-word brightening as it is read. */}
        <RipeReveal runs={[lines.join('\n')]} className="statement" as="h2" from={0.9} to={0.65} />
        {/* And the paragraph under it, as RIPE's intro sits under its own. */}
        {note && <RipeReveal runs={note} className="note" from={0.9} to={0.65} />}
      </div>

      <style jsx>{`
        /* The same space above and below as RIPE's own opening
           statement, so the two pages start their reading at one depth. */
        .intro { padding: var(--ripe-section-gap) 0 clamp(64px, 12vh, 170px); }
        .intro :global(.statement) {
          margin: 0; max-width: 760px; text-align: left;
          color: var(--story-ink, #fff); text-wrap: pretty;
        }
        /* Five lines, each its own thought, so each gets its own air. */
        .intro :global(.statement .rv-br) { height: 0.32em; }
        /* Each word eases to its brightness rather than snapping to it. */
        .intro :global(.rv-w) { transition: opacity .35s cubic-bezier(.33, 0, .2, 1); }
        /* RIPE's intro paragraph: P1, and the gap it keeps under its own
           statement. Two sentences, one line each wherever there is room:
           the second runs 32.2em, so the measure is set in ems. */
        .intro :global(.note) {
          margin: clamp(56px, 10vh, 140px) 0 0; max-width: 34em;
          font-size: var(--t-p1-size); line-height: var(--t-p1-lh);
          letter-spacing: var(--t-track); color: var(--story-ink, #fff);
          text-wrap: pretty;
        }
      `}</style>
    </section>
  )
}
