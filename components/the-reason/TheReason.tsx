'use client'

import { Fragment, useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import Reveal from '@/components/RevealOnScroll'
import { useMode } from '@/components/ModeProvider'
import { RelatedLane } from '@/components/Swimlanes'
import { linkImage } from '@/lib/journals'
import { CHAPTERS, chapterHref } from '@/lib/chapters'
import type { NoteEntry } from '@/lib/field-notes'
import { Img, Film, PhotoHero, ReasonDark } from './ReasonKit'

/* ═══════════════════════════════════════════════════════════════════════
   THE REASON — the page that opens it.

   Layout from Figma "AURA // Coffee Festival", node 1396:1033, "Why Aura?
   (v2)" (1920 × 17443, black ground). The shared blocks — dark ground,
   photo hero, type roles, rail, bleeds, handwriting, the continue row —
   come from ReasonKit, as on the other designed Reason pages. This file
   holds what is particular to this page: the founder's letter in its
   movements, the three polaroids and the handwritten note.

   Pictures are the board's own, exported to /public/the-reason/why-aura
   and sized for the web. Each frame is set to the board's ratio; a slot
   whose path is left out of PHOTO stands empty and labelled. The
   polaroids are exported whole — paper, tilt and handwritten caption —
   as PNGs with the black around them cleared.

   Pace. The page is meant to be read slowly, after tengilemalamala.com:
   wide gaps between the movements, slow fades, a smoothed scroll
   (Lenis, this page only) and photographs that drift inside their
   frames — set 22% large and carried ±10% as they cross the screen, so
   the picture moves a little slower than the page. The drift runs off
   Lenis's own frame loop rather than a CSS scroll timeline, which some
   browsers still leave inactive. The handwriting fills in as it is
   read, after arrakistechnologies.ai: each line starts grey and turns
   white letter by letter as it rises up the screen. The polaroids are
   stuck on like paper, after James Long's Paper Peel: as each comes into
   view it is set down and smoothed flat from its top edge. Under reduced motion all of it stands still, the
   handwriting is white and the polaroids lie flat.
═══════════════════════════════════════════════════════════════════════ */

const WA = '/the-reason/why-aura'

/* Where the page sends a reader on: the same "Discover Aura" lane RIPE
   ends on (RelatedLane), with three pages. Titles, lines and pictures
   come from the site's own indexes — the chapter list for RTA and
   Sanctuary & Stay (the chapters under Regenerative Life, on their
   banner pictures), the onward-link pictures for RIPE —
   so the cards stay true to the pages they open. */
const DISCOVER: NoteEntry[] = (() => {
  const chapterCard = (id: string): NoteEntry[] => {
    const c = CHAPTERS.find((x) => x.id === id)
    if (!c) return []
    return [{
      href: chapterHref(c), title: c.label, description: c.lede ?? '',
      img: c.card ?? c.hero?.poster ?? linkImage(chapterHref(c)), status: 'live' as const,
    }]
  }
  return [
    {
      href: '/ripe', title: 'RIPE', status: 'live' as const,
      description: 'Right time made visible. Coffee cherries ripening at Mudigere.',
      /* the updated RIPE page's own card, with its wordmark */
      img: '/RIPE/aura-ripe-og.jpg',
    },
    ...chapterCard('rta'),
    ...chapterCard('sanctuary'),
  ]
})()

/* One path per slot, in page order. Undefined leaves an empty slot. */
const PHOTO: Record<
  | 'hero' | 'heroFilm' | 'heroFilmSmall' | 'father' | 'ferns' | 'see' | 'tending' | 'note' | 'education'
  | 'india' | 'japan' | 'herd' | 'what' | 'whatFilm' | 'whatFilmSmall' | 'whatFilmPoster' | 'now' | 'nowInset'
  | 'early' | 'established' | 'questions' | 'closing',
  string | undefined
> = {
  hero: `${WA}/aura-banner.jpg`,          // the banner's first frame, its poster
  heroFilm: `${WA}/aura-banner.mp4`,      // father and son on the ridge, the film
  heroFilmSmall: `${WA}/aura-banner-small.mp4`, // the same at 960px, for phones
  father: `${WA}/aura-father.webp`,        // polaroid: two boys on a doorstep
  ferns: `${WA}/aura-ferns.jpg`,          // a child among the ferns
  see: `${WA}/aura-picking.jpg`,          // picking ripe cherries
  tending: `${WA}/aura-tending.jpg`,      // garlanding a stone shrine in the forest
  note: `${WA}/aura-universe.png`,        // handwritten: Universe will take care of everything
  education: `${WA}/aura-education.webp`,  // polaroid: the calves and the dog at Mudigere
  india: `${WA}/aura-india.jpg`,          // the herd at Mudigere
  japan: `${WA}/aura-japan.jpg`,          // a temple gate in Ohara
  herd: `${WA}/aura-grazing.jpg`,         // a cow grazing, an egret beside it (not in use)
  what: `${WA}/aura-seedling.jpg`,        // a seedling on the forest floor (not in use)
  whatFilm: `${WA}/aura-estate-walkthrough.mp4`,      // flying over the estate
  whatFilmSmall: `${WA}/aura-estate-walkthrough-small.mp4`, // the same at 960px, for phones
  whatFilmPoster: `${WA}/aura-estate-walkthrough.jpg`, // its first frame
  now: `${WA}/aura-tree.jpg`,             // a buttressed tree in the morning light
  nowInset: `${WA}/aura-stump.jpg`,       // a termite-worked stump (not in use)
  early: `${WA}/aura-early.jpg`,          // cherries ripening unevenly
  established: `${WA}/aura-established.jpg`, // a handful of ripe cherries
  questions: `${WA}/aura-questions.jpg`,  // smelling the soil
  closing: `${WA}/aura-closing.webp`,      // polaroid: the team and their families, signed
}

/** A polaroid. The board's export carries its own paper, tilt and
    handwritten caption, so it is set as it comes; the caption is in its
    alt. Without one, a paper frame with an empty slot and the caption
    in live text stands in. */
function Polaroid({ src, size, ratio, caption, alt, tilt, wide = false }: {
  src?: string
  /** The exported PNG's own size, w / h, for the peel. */
  size: string
  /** The photograph's ratio inside the frame, for the empty slot. */
  ratio: string
  caption: ReactNode; alt: string; tilt: number
  /** Landscape: set wider, so it reads at the same scale. */
  wide?: boolean
}) {
  if (src) return <Peel src={src} size={size} alt={alt} wide={wide} />
  return (
    <figure className="wa-polaroid" style={{ rotate: `${tilt}deg` }}>
      <Img src={src} ratio={ratio} alt={alt} className="wa-polaroid-photo" />
      <figcaption className="wa-polaroid-hand">{caption}</figcaption>
    </figure>
  )
}

/** A polaroid laid on the page like paper. The picture is cut into
    horizontal strips, each hinged to the one above it, so the sheet can
    curl from its foot towards the reader: the lower a strip, the more
    it bends. --c (0 flat, 1 fully curled) is set by useSlowScroll as the
    polaroid rises into view, and a hover lifts the foot a little. The
    shadow under it grows soft and wide while it is lifted, and tight
    once it is down. */
const STRIPS = 16
function Peel({ src, size, alt, wide }: { src: string; size: string; alt: string; wide: boolean }) {
  const strip = (i: number): ReactNode => (
    <div className="wa-peel-strip" style={{ ['--i' as string]: i, ['--k' as string]: i / STRIPS }}>
      <div className="wa-peel-slice">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" loading="lazy" decoding="async" draggable={false} />
      </div>
      {i + 1 < STRIPS && strip(i + 1)}
    </div>
  )
  return (
    <div className={`wa-peel ${wide ? 'wa-peel-wide' : ''}`} style={{ aspectRatio: size }} role="img" aria-label={alt}>
      <div className="wa-peel-shadow" aria-hidden />
      <div className="wa-peel-sheet" aria-hidden>{strip(0)}</div>
    </div>
  )
}

/** A line's words, the last two kept as one so it never ends on a
    word alone. */
function inkWords(text: string) {
  const w = text.split(' ')
  return w.length > 2 ? [...w.slice(0, -2), w.slice(-2).join('\u00a0')] : w
}

/** Handwriting that fills in as it is read. The letters are split into
    spans for useSlowScroll to light, words kept whole so lines still
    break between them; a reader of the page hears the plain text. */
function Ink({ text, className = '' }: { text: string; className?: string }) {
  return (
    <p className={`rk-hand wa-ink ${text.includes('\n') ? '' : 'wa-ink-even'} ${className}`}>
      <span className="sr-only">{text.replace(/\n/g, ' ')}</span>
      <span aria-hidden>
        {/* The space sits between the word spans, not inside them: a
            space inside a no-wrap word would leave the line nowhere to
            break. */}
        {/* A \n in the text is a line break set by hand. */}
        {text.split('\n').map((line, l) => (
          <Fragment key={l}>
            {l > 0 && <br />}
            {inkWords(line).map((w, i) => (
              <Fragment key={i}>
                {i > 0 && ' '}
                <span className="wa-ink-w">
                  {[...w].map((c, j) => <span key={j} className="wa-ink-c">{c}</span>)}
                </span>
              </Fragment>
            ))}
          </Fragment>
        ))}
      </span>
    </p>
  )
}

/** A handwritten statement standing on its own, centred. Its lines fill
    in one after another, as one sequence, rather than side by side. */
function HandLines({ lines, slow = false }: {
  lines: string[]
  /** Read slowly: the lines set further apart, filling over a longer
      scroll, one at a time as each reaches the middle of the screen. */
  slow?: boolean
}) {
  return (
    <div className={`rk-centre wa-ink-group ${slow ? 'wa-ink-slow' : ''}`} data-ink={slow ? 'slow' : undefined}>
      {lines.map((l) => <Ink key={l} text={l} />)}
    </div>
  )
}

/** A smoothed, unhurried scroll for this page only — heavier than the
    native wheel — and the photographs' drift inside their frames, read
    off the same frame loop. Left off under reduced motion, and torn down
    on leave so the rest of the site keeps its own scroll. */
function useSlowScroll(still: boolean) {
  useEffect(() => {
    if (still || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({
      lerp: 0.07, wheelMultiplier: 0.85, smoothWheel: true,
      /* the open menu scrolls itself: Lenis would take its wheel and move
         the page underneath instead */
      prevent: (node) => !!node.closest('.menu-overlay'),
    })

    /* Each picture's progress across the screen, 0 as its frame enters
       at the foot and 1 as it leaves at the top, carries it -10% → +10%.
       Set 22% large, the picture has 11% to spare at each edge. */
    const pics = () => document.querySelectorAll<HTMLImageElement>('.wa-page .wa-drift > img')
    const drift = () => {
      const vh = window.innerHeight
      pics().forEach((img) => {
        const r = img.parentElement!.getBoundingClientRect()
        if (r.bottom < -100 || r.top > vh + 100) return
        const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)))
        /* a gentle drift (wa-drift-5): ±5%, set 11% large, so less of the
           picture's edges is given up to it */
        const gentle = img.parentElement!.classList.contains('wa-drift-5')
        img.style.transform = gentle
          ? `translate3d(0, ${((p - 0.5) * 10).toFixed(3)}%, 0) scale(1.11)`
          : `translate3d(0, ${((p - 0.5) * 20).toFixed(3)}%, 0) scale(1.22)`
      })
    }

    /* The handwriting's progress. A group of lines (HandLines) fills as
       one sequence, line after line; a line on its own fills by itself.
       It begins as the block's top rises past 85% of the screen and is
       white by the time the block's middle reaches the screen's middle
       (a slow block, later: see below). A soft edge of a few letters runs ahead of the fill. */
    const SOFT = 6, DIM = 0.28
    const blocks = () => document.querySelectorAll<HTMLElement>(
      '.wa-page .wa-ink-group, .wa-page .wa-ink:not(.wa-ink-group .wa-ink)')
    const ink = () => {
      const vh = window.innerHeight
      blocks().forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.bottom < -100 || r.top > vh + 100) return
        /* A slow block is held in the middle of the screen (wa-pin) and
           fills over the whole of the hold, from the moment it is
           centred to the moment it is let go. */
        const pin = el.dataset.ink === 'slow' ? el.closest<HTMLElement>('.wa-pin') : null
        const held = pin?.firstElementChild as HTMLElement | null
        let p: number
        if (pin && held) {
          const stop = vh / 2 - held.offsetHeight / 2
          held.style.top = `${stop.toFixed(0)}px`
          const run = pin.offsetHeight - held.offsetHeight
          p = Math.min(1, Math.max(0, (stop - pin.getBoundingClientRect().top) / run))
        } else {
          p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.35 + r.height * 0.5)))
        }
        const cs = el.querySelectorAll<HTMLElement>('.wa-ink-c'), n = cs.length
        cs.forEach((c, i) => {
          const v = Math.min(1, Math.max(0, (p * (n + SOFT) - i) / SOFT))
          const o = (DIM + (1 - DIM) * v).toFixed(3)
          if (c.style.opacity !== o) c.style.opacity = o
        })
      })
    }

    /* The banner, as HeroBanner moves the chapter banners', on a shorter
       hold: held for half a screen of scroll (wa-hero-pin), across which
       the film blurs to 20px and eases out to 110% (smootherstep),
       and the words rise at 30% of the scroll. Until the film's own
       blur-in has finished, its focus is left to that. */
    const heroPin = () => document.querySelector<HTMLElement>('.wa-page .wa-hero-pin')
    const heroFilm = () => document.querySelector<HTMLElement>('.wa-page .rk-hero-img')
    const heroWords = () => document.querySelector<HTMLElement>('.wa-page .rk-hero-in')
    const linger = () => {
      const pin = heroPin()
      if (!pin) return
      const vh = window.innerHeight
      const into = Math.max(0, -pin.getBoundingClientRect().top)
      if (into > vh * 1.3) return
      const raw = Math.min(1, into / (vh * 0.5))
      const p = raw * raw * raw * (raw * (raw * 6 - 15) + 10)
      const words = heroWords()
      if (words) words.style.transform = `translate3d(0, ${(-into * 0.3).toFixed(1)}px, 0)`
      const film = heroFilm()
      if (!film) return
      const blurringIn = film.classList.contains('wa-blur') && !film.classList.contains('is-sharp')
      if (p < 0.001) {
        if (!blurringIn) { film.style.filter = ''; film.style.transform = '' }
        return
      }
      film.style.filter = `blur(${(p * 20).toFixed(1)}px)`
      film.style.transform = `scale(${(1 + p * 0.1).toFixed(4)})`
    }

    /* A section's background film comes into focus as the section rises:
       16px soft as its top enters at the foot of the screen, clear once
       its top has risen to a third of the way down. */
    const films = () => document.querySelectorAll<HTMLElement>('.wa-page .wa-film-bg')
    const focus = () => {
      const vh = window.innerHeight
      films().forEach((f) => {
        const r = f.getBoundingClientRect()
        if (r.bottom < -100 || r.top > vh + 100) return
        const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.67)))
        const b = ((1 - p) * 16).toFixed(1)
        const v = b === '0.0' ? '' : `blur(${b}px)`
        if (f.style.filter !== v) f.style.filter = v
      })
    }

    let id = requestAnimationFrame(function loop(t: number) {
      lenis.raf(t); drift(); ink(); linger(); focus(); id = requestAnimationFrame(loop)
    })
    return () => {
      cancelAnimationFrame(id); lenis.destroy()
      pics().forEach((img) => { img.style.transform = '' })
      document.querySelectorAll<HTMLElement>('.wa-page .wa-ink-c').forEach((c) => { c.style.opacity = '' })
      const hf = heroFilm(); if (hf) { hf.style.filter = ''; hf.style.transform = '' }
      const hw = heroWords(); if (hw) hw.style.transform = ''
      films().forEach((f) => { f.style.filter = '' })
    }
  }, [still])
}

/** Each polaroid is stuck onto the page as it comes into view, every
    time it does: it is set down from just above the page, lifted and a
    little turned; its top edge touches first and the sheet is smoothed
    flat from the top down, strip by strip, and there it stays. Once it
    is wholly off screen it is quietly lifted again, ready for the next
    pass. A polaroid already on screen when the page opens is simply
    there. Under reduced motion they all are. Time, not scroll, drives
    it — a sticker is put down in one movement, however fast one
    scrolls. */
function useStickOn(still: boolean) {
  useEffect(() => {
    if (still || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const peels = [...document.querySelectorAll<HTMLElement>('.wa-page .wa-peel')]
    const set = (el: HTMLElement, p: number, s: number) => {
      el.style.setProperty('--p', p.toFixed(3))
      el.style.setProperty('--s', s.toFixed(3))
    }
    const clamp = (v: number) => Math.min(1, Math.max(0, v))
    const out = (t: number) => 1 - (1 - t) ** 3
    const inOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2)
    /* per polaroid: 'up' (lifted, waiting), 'going' (being stuck) or
       'down' (stuck); and its running frame, to stop it on a reset */
    const state = new Map<Element, 'up' | 'going' | 'down'>()
    const frame = new Map<Element, number>()

    const stick = (el: HTMLElement) => {
      state.set(el, 'going')
      const t0 = performance.now()
      const step = (now: number) => {
        const t = now - t0
        const p = out(clamp(t / 750))                 // set down
        const s = inOut(clamp((t - 300) / 500))       // smoothed, top to foot: a quick hand
        set(el, p, s)
        if (t < 800) frame.set(el, requestAnimationFrame(step))
        else state.set(el, 'down')
      }
      frame.set(el, requestAnimationFrame(step))
    }
    const lift = (el: HTMLElement) => {
      cancelAnimationFrame(frame.get(el) ?? 0)
      set(el, 0, 0); state.set(el, 'up')
    }

    /* stuck as it rises past the lower fifth of the screen… */
    const onto = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && state.get(e.target) !== 'going' && state.get(e.target) !== 'down') stick(e.target as HTMLElement)
      })
    }, { rootMargin: '0px 0px -22% 0px' })
    /* …and lifted again only once it is wholly off screen, so it never
       vanishes in view */
    const off = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) return
        /* the report can trail a fast scroll: lift only if it is still
           off screen now, or it would undo a sticking just begun */
        const r = e.target.getBoundingClientRect()
        if (r.bottom > 0 && r.top < window.innerHeight) return
        lift(e.target as HTMLElement)
      })
    })

    const vh = window.innerHeight
    peels.forEach((el) => {
      const r = el.getBoundingClientRect()
      if (r.top < vh * 0.78 && r.bottom > 0) state.set(el, 'down') // already in view
      else { set(el, 0, 0); state.set(el, 'up') }
      onto.observe(el); off.observe(el)
    })
    return () => {
      onto.disconnect(); off.disconnect()
      frame.forEach((id) => cancelAnimationFrame(id))
      peels.forEach((el) => set(el, 1, 1))
    }
  }, [still])
}

/** Every picture on the page arrives soft and comes into focus: it is
    held blurred until it has loaded *and* is on screen — pictures load
    ahead of the scroll, so loading alone would clear them out of sight —
    then sharpens. Once only. Not under reduced motion. */
function useBlurIn(still: boolean) {
  useEffect(() => {
    if (still || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const targets = [...document.querySelectorAll<HTMLElement>(
      '.wa-page .rk-img:not(.wa-film-bg), .wa-page .wa-peel, .wa-page .rk-hero-img')]
    const ready = (el: HTMLElement) => new Promise<void>((done) => {
      const media = (el.matches('img, video') ? el : el.querySelector('img, video')) as HTMLImageElement | HTMLVideoElement | null
      if (!media) return done()
      if (media instanceof HTMLVideoElement) {
        if (media.readyState >= 2) return done()
        media.addEventListener('loadeddata', () => done(), { once: true })
        return
      }
      if (media.loading === 'lazy') media.loading = 'eager' // it is on screen now
      if (media.complete && media.naturalWidth) media.decode().then(done, done)
      else {
        media.addEventListener('load', () => done(), { once: true })
        media.addEventListener('error', () => done(), { once: true })
      }
    })
    const clear = (el: HTMLElement) => {
      el.classList.add('is-clear')
      el.addEventListener('transitionend', () => el.classList.add('is-sharp'), { once: true })
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        io.unobserve(e.target)
        const el = e.target as HTMLElement
        ready(el).then(() => setTimeout(() => clear(el), 120))
      })
    }, { rootMargin: '0px 0px -8% 0px' })
    targets.forEach((el) => { el.classList.add('wa-blur'); io.observe(el) })
    return () => {
      io.disconnect()
      targets.forEach((el) => el.classList.remove('wa-blur', 'is-clear', 'is-sharp'))
    }
  }, [still])
}

export default function TheReason() {
  /* Agent mode is the site's plain reading of a page: no pictures, no
     motion. Every effect here stands still in it, as under reduced
     motion, and the page's held and full-screen spaces collapse. */
  const { viewMode } = useMode()
  const still = viewMode === 'agent'
  useSlowScroll(still)
  useStickOn(still)
  useBlurIn(still)
  return (
    <ReasonDark className="wa-page">
      {/* The banner as the chapter banners have theirs (HeroBanner in
          components/article): held in view for a screen of scroll while
          the film blurs and eases back and the words rise away. */}
      <div className="wa-hero-pin">
        <PhotoHero
          alt="A father and his son sitting on a rock on a ridge in the Western Ghats, looking out over the valley"
          src={PHOTO.hero} video={PHOTO.heroFilm} videoSmall={PHOTO.heroFilmSmall} title="Why Aura?" lede="What kind of world are they inheriting?" />
      </div>

      {/* ── Before Aura ── three short paragraphs, centred */}
      <section className="rk-sec">
        <div className="section-w">
          <Reveal>
            <div className="rk-centre wa-letter">
              <p className="p1">For most of my working life, I built&nbsp;businesses.</p>
              <p className="p1">I was born in India and moved to Singapore twenty-four years ago. My world was cities, people, ideas, decisions and speed. But what restored me had very little to do with&nbsp;work.</p>
              <p className="p1">I built gardens. Arranged flowers. Created spaces where people could sit together. Connected friends over food and conversations that lasted until nobody noticed the&nbsp;time.</p>
              <p className="p1">The relationships that mattered most to me were not built in boardrooms. They grew around a table, in a garden, over a quiet&nbsp;evening.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Then I became a father ── the polaroid, the boys, the question */}
      <section className="rk-sec rk-sec-flush">
        <div className="section-w">
          <Reveal>
            <Polaroid
              src={PHOTO.father} size="587 / 668" ratio="1 / 1" tilt={3}
              caption="Then I became a father."
              alt="A polaroid of two boys on a doorstep, captioned by hand: Then I became a father."
            />
          </Reveal>
          <Reveal delay={80}>
            <div className="rk-centre wa-letter wa-after">
              <p className="p1">I have two boys. Very different from each&nbsp;other.</p>
              <p className="p1">Watching them grow made me change my sense of time. I began to think less about what we could build now and more about what should remain long after&nbsp;us.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── The question ── set in hand over the foot of the picture */}
      <section className="wa-over">
        <Img src={PHOTO.ferns} ratio="1920 / 1244" alt="A young girl smiling among tall ferns" className="wa-drift rk-full" />
        <div className="wa-over-copy">
          <Reveal>
            <HandLines lines={['What kind of world are they inheriting?', 'Aura began with that question.']} />
          </Reveal>
        </div>
      </section>

      {/* On a phone the handwritten note follows the ferns picture; on a
          wider screen it stays under the picture of the picking. */}
      <div className="section-w wa-note-phone">
        <Reveal><Img src={PHOTO.note} ratio="380 / 338" alt="Handwritten: Universe will take care of everything" className="wa-note" /></Reveal>
      </div>

      {/* ── Learning to see again ── prose on the rail with the tall
          picture under it; the picture bleeding right with the handwritten
          note under it; then the rest of the thought, centred */}
      <section className="rk-sec wa-learn">
        <div className="rk-bleed rk-bleed-right">
          <div className="rk-bleed-copy">
            <Reveal>
              <div className="rk-prose">
                <h2>Learning to see again</h2>
                <p className="p1">I was not born into a family of&nbsp;planters.</p>
                <p className="p1">I did not study agriculture, biology or soil science. By the time Aura began, I had already spent decades building businesses. Then I found myself standing on a coffee and tea estate in the Western Ghats, knowing almost nothing about the world in front of&nbsp;me.</p>
                <p className="p1">I loved&nbsp;that.</p>
              </div>
            </Reveal>
            <Reveal delay={120}><Img src={PHOTO.tending} ratio="578 / 1002" alt="A man garlanding a small stone shrine with pink flowers among the trees" className="wa-drift wa-inset" /></Reveal>
          </div>
          <div>
            <Reveal delay={80}><Img src={PHOTO.see} ratio="880 / 915" alt="A hand picking ripe red coffee cherries from the branch" className="wa-drift" /></Reveal>
            <Reveal delay={120}><Img src={PHOTO.note} ratio="380 / 338" alt="Handwritten: Universe will take care of everything" className="wa-note" /></Reveal>
          </div>
        </div>
        <div className="section-w">
          <Reveal>
            <div className="rk-centre wa-letter wa-after">
              <p className="p1">I have never believed that the choices we make when we are young should decide who we remain. We can learn at any point in our lives, if we are willing to say, honestly, I do not&nbsp;know.</p>
              <p className="p1">I was curious, and I knew how to ask&nbsp;questions.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── The questions ── four handwritten lines. They hold in the
          middle of the screen for a long stretch of scroll (wa-pin) and
          fill grey to white over it, one line at a time. */}
      <section className="rk-sec wa-sec-near">
        <div className="section-w">
          <div className="wa-pin">
            <div className="wa-pin-in">
              <Reveal>
                <HandLines slow lines={[
                  'Why do we use this input?',
                  'What did this soil feel like 10 years ago?',
                  'What changed after we acted?',
                  'Who notices first when a tree is under stress?',
                ]} />
              </Reveal>
            </div>
            {/* the length of the hold: a pinned block moves only within
                its box's content, so the run is a spacer, not padding */}
            <div className="wa-pin-run" aria-hidden />
          </div>
          <Reveal delay={80}>
            <div className="wa-after">
              <Polaroid
                src={PHOTO.education} size="688 / 774" ratio="4 / 3" tilt={-1}
                caption={<>Aura became my education.<br />It still is.</>}
                alt="A polaroid of a morning with the calves and the dog at Mudigere, captioned by hand: Aura became my education. It still is."
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Two places, one question ── prose and the handwritten question on
          the left, then India and Japan side by side; one gap after the
          polaroid above */}
      <section className="rk-sec wa-sec-near">
        <div className="section-w">
          <Reveal>
            <div className="rk-prose">
              <h2>Two places, one question</h2>
              <p className="p1">Then I found Ohara, a valley north of Kyoto shaped by river, forest, garden, craft and&nbsp;season.</p>
              <p className="p1">Mudigere and Ohara are not versions of one another. Their climates, histories and cultures are distinct. They should remain&nbsp;distinct.</p>
              <p className="p1">Yet both places asked me the same&nbsp;question:</p>
            </div>
            <Ink className="wa-hand-left" text="What would it mean to restore a place rather than simply developing it?" />
          </Reveal>
          <Reveal delay={80}>
            <div className="rk-grid rk-grid-2 wa-pair">
              <figure className="wa-fig">
                <Img src={PHOTO.india} ratio="690 / 644" alt="Cows of the herd grazing under the trees at Mudigere" className="wa-drift" />
                <figcaption className="p2">India gave me the&nbsp;ground.</figcaption>
              </figure>
              <figure className="wa-fig">
                <Img src={PHOTO.japan} ratio="690 / 644" alt="A wooden temple gate in Ohara, autumn maples beyond it" className="wa-drift" />
                <figcaption className="p2">Japan gave me the&nbsp;stillness.</figcaption>
              </figure>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Between them ── follows straight on from India and Japan, and
          leads straight into the picture below */}
      <section className="rk-sec wa-sec-near wa-sec-lead">
        <div className="section-w">
          <Reveal>
            <div className="rk-centre wa-letter">
              <p className="p1">In Mudigere, the work begins with soil, water, plants, animals and the people whose knowledge lives in the field. In Ohara, it begins with season, interval, craft, hospitality and the discipline of not filling every&nbsp;space.</p>
              <p className="p1">One place teaches through abundance and monsoon. The other teaches through restraint and&nbsp;pause.</p>
              <p className="p1">Neither is a backdrop. Each is a&nbsp;teacher.</p>
              <p className="p1">Aura grew in the relationship between&nbsp;them.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Aura in practice ── set as Two places, one question is, on the
          rail at the left, over the estate walkthrough film, which fills
          the section behind it */}
      <section className="wa-film-sec">
        <Film
          src={PHOTO.whatFilm!} srcSmall={PHOTO.whatFilmSmall} poster={PHOTO.whatFilmPoster!} ratio="1858 / 1046"
          alt="Flying over the estate: forest on the hills and the buildings in their clearing"
          className="wa-film-bg"
        />
        <div className="section-w wa-film-copy">
          <Reveal>
            <div className="rk-prose">
              <h2>Aura in practice</h2>
              <p className="p1">Aura is a working coffee and tea estate in the Western Ghats and a sanctuary in&nbsp;Kyoto.</p>
              <p className="p1">It is also a long experiment in whether cultivation, hospitality, food, craft, science and technology can strengthen one another instead of being separated into&nbsp;industries.</p>
              <p className="p1">
                The plantation gives the work consequence.<br />
                The sanctuary gives it space.<br />
                Artistry gives it another language.<br />
                Proof gives it discipline.<br />
                Aura intelligence gives it&nbsp;memory.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Why this matters ── the picture bleeding left (on a gentle 5%
          drift, so little of its roots is lost), prose on the right, set
          level with the picture's middle */}
      <section className="rk-sec wa-why">
        <div className="rk-bleed rk-bleed-left rk-bleed-even wa-level">
          <Reveal><Img src={PHOTO.now} ratio="880 / 1027" alt="A great buttressed tree on the estate, morning light through the canopy behind it" className="wa-drift wa-drift-5" /></Reveal>
          <div className="rk-bleed-copy">
            <Reveal delay={80}>
              <div className="rk-prose">
                <h2>Why this matters</h2>
                <p className="p1">Artificial intelligence is increasing the speed at which people can calculate, generate and&nbsp;decide.</p>
                <p className="p1">That does not make human attention less important. It makes judgment, presence, responsibility and moral clarity more&nbsp;necessary.</p>
                <p className="p1">The question is not whether technology belongs at Aura. It already helps us observe conditions, hold records and compare what happened over&nbsp;time.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── What the technology answers to ── then the work as it stands;
          follows straight on from Why this matters */}
      <section className="rk-sec wa-sec-near">
        <div className="section-w">
          <Reveal>
            <HandLines lines={['What does the technology answer to?']} />
            <div className="rk-centre wa-letter">
              <p className="p1">Aura is not presented as a finished&nbsp;model.</p>
              <p className="p1">The estate is working. The coffee is producing. Soil, water, plant health, biodiversity and fermentation are being observed and measured. Practices are being&nbsp;tested.</p>
              <p className="p1">The team is learning what deserves to continue, what needs to change and what is not yet&nbsp;known.</p>
              <p className="p1">Ohara is becoming a place where stillness and making, hospitality and inquiry can meet without becoming a performance of&nbsp;slowness.</p>
            </div>
          </Reveal>
          {/* These three are set exactly as cropped on the board, so they
              do not drift: the drift's enlargement would trim the crop. */}
          <Reveal delay={80}>
            <div className="rk-grid rk-grid-3 wa-three">
              <figure className="wa-fig">
                <Img src={PHOTO.early} ratio="441 / 584" alt="Coffee cherries on the branch, some green, some yellow, some red" />
                <figcaption className="p2">Some are&nbsp;early.</figcaption>
              </figure>
              <figure className="wa-fig">
                <Img src={PHOTO.established} ratio="441 / 584" alt="Two hands holding a heap of ripe red coffee cherries" />
                <figcaption className="p2">Some parts are&nbsp;established.</figcaption>
              </figure>
              <figure className="wa-fig">
                <Img src={PHOTO.questions} ratio="441 / 584" alt="A man on the estate smelling a handful of soil" />
                <figcaption className="p2">Some are still only&nbsp;questions.</figcaption>
              </figure>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── The promise ── one gap after the three pictures above */}
      <section className="rk-sec wa-sec-near">
        <div className="section-w">
          <Reveal>
            <div className="rk-centre wa-promise">
              <Ink text={'What if the promise isn’t perfection,\nbut the willingness to be examined?'} />
            </div>
            <div className="rk-centre wa-letter">
              <p className="p1">Aura began with a personal question, but it cannot remain a founder&rsquo;s private&nbsp;answer.</p>
              <p className="p1">If it is to matter across generations, its knowledge must be shared. Its decisions must be remembered. Its standards must survive the person who first named them. Its places must be able to change without losing their moral&nbsp;centre.</p>
              <p className="p1">This is why Aura is built around a 1,000-year horizon, a Moral Spine and six rules simple enough to carry into the&nbsp;field.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Close ── the line and the signed polaroid; Discover Aura follows */}
      <section className="rk-sec rk-close wa-sec-near">
        <div className="section-w">
          <Reveal>
            <h2 className="rk-centre">I am the first gardener.<br />I will not be the last.</h2>
          </Reveal>
          <Reveal delay={80}>
            <div className="wa-after">
              <Polaroid
                src={PHOTO.closing} size="1097 / 820" ratio="4 / 3" tilt={-2} wide
                caption={<>Love + Respect,<br />Arvind Singh</>}
                alt="A polaroid of the Aura team and their families at Mudigere, signed by hand: Love + Respect, Arvind Singh"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <RelatedLane label="Discover Aura" items={DISCOVER} />

      {/* This page's own pieces. Global, as the kit's are. */}
      <style jsx global>{`
        /* ── ground ── pure black, as RIPE's (--ripe-ink), not the night
           theme's ink. Set on the page's own --bg so everything drawn
           from it follows; .rk-page.wa-page outranks the theme's
           [data-theme="night"] block. The site bar takes the same black
           here, in either theme. */
        .rk-page.wa-page { --wa-black: #000000; --bg: var(--wa-black); }
        :root:has(.wa-page) .aura-nav.aura-nav { --bg: #000000; }

        /* ── hero ── the film shown clear, without the kit's dark tint.
           The title bold in the estate's sage, the lede in its deep
           green-grey, each in its own colour over the film. The banner is
           held for half a screen of scroll (wa-hero-pin) while useSlowScroll
           blurs the film and lifts the words, as HeroBanner does. */
        .wa-hero-pin { position: relative; height: 150vh; }
        .wa-hero-pin .rk-hero { position: sticky; top: 0; height: 100vh; min-height: 100vh; }
        .wa-page .rk-hero-in { will-change: transform; }
        @media (prefers-reduced-motion: reduce) {
          .wa-hero-pin { height: auto; }
          .wa-hero-pin .rk-hero { position: relative; }
        }
        .wa-page .rk-hero::after { content: none; }
        .wa-page { --wa-sage: #939b8f; --wa-moss: #434f4a; }
        .wa-page .rk-hero h1 { color: var(--wa-sage); font-weight: 700; }
        .wa-page .rk-hero .rk-hero-lede { color: var(--wa-moss); }

        /* ── agent mode ── the page as plain reading: pictures and films
           gone (the site hides every image in agent mode; the frames that
           held them go too), no holds, no full-screen sections, no blur,
           the handwriting white, the words over the ferns in the flow */
        [data-view="agent"] .wa-page .rk-img,
        [data-view="agent"] .wa-page .wa-peel,
        [data-view="agent"] .wa-page .rk-hero-img,
        [data-view="agent"] .wa-page .wa-note-phone { display: none !important; }
        [data-view="agent"] .wa-page .wa-hero-pin { height: auto !important; }
        [data-view="agent"] .wa-page .rk-hero {
          position: static !important; height: auto !important; min-height: 0 !important;
          padding: var(--space-8) 0 var(--space-6) !important; text-align: left !important;
        }
        [data-view="agent"] .wa-page .rk-hero::after,
        [data-view="agent"] .wa-page .wa-over::after,
        [data-view="agent"] .wa-page .wa-film-sec::after { display: none !important; }
        [data-view="agent"] .wa-page .rk-hero { display: block !important; place-items: normal !important; }
        [data-view="agent"] .wa-page .rk-hero-in { transform: none !important; text-align: left; }
        [data-view="agent"] .wa-page .rk-hero-lede { margin-left: 0 !important; max-width: none !important; }
        [data-view="agent"] .wa-page .wa-pin-run { display: none !important; }
        [data-view="agent"] .wa-page .wa-pin-in { position: static !important; }
        [data-view="agent"] .wa-page .wa-ink-c { opacity: 1 !important; }
        [data-view="agent"] .wa-page .wa-blur { filter: none !important; }
        [data-view="agent"] .wa-page .wa-film-sec {
          display: block !important; min-height: 0 !important; padding: 0 !important; margin: 0 !important;
        }
        [data-view="agent"] .wa-page .wa-over-copy { position: static !important; padding: 0 !important; }

        /* ── blur-in ── useBlurIn: soft until loaded and on screen, then
           into focus; the filter is dropped once it has finished, so
           sharp pictures carry no filter at all */
        .wa-page .wa-blur { filter: blur(12px); transition: filter 1400ms var(--ease-out); }
        .wa-page .wa-blur.is-clear { filter: blur(0); }
        .wa-page .wa-blur.is-sharp { filter: none; }
        /* the banner film then follows the scroll's blur directly
           (useSlowScroll), with no fade to lag behind it */
        .wa-page .rk-hero-img.wa-blur.is-sharp { transition: none; }

        /* ── pace ── wider gaps than the site's default between movements
           (--section-gap is 80–140px; here it is 140–240px), a longer beat
           inside them, and slower, longer fades */
        .wa-page {
          --section-gap: clamp(140px, 22vh, 240px);
          --wa-beat: clamp(96px, 14vh, 160px);
        }
        .js .wa-page .reveal {
          transform: translateY(36px);
          transition-duration: 1400ms, 1400ms;
        }
        .js .wa-page .reveal.visible { transform: translateY(0); }

        /* ── drift ── each photograph set 22% large in its frame and
           carried from -10% to +10% while the frame crosses the screen;
           useSlowScroll sets the transform. Until it runs, the picture
           sits centred at the same scale, so nothing jumps. */
        @media (prefers-reduced-motion: no-preference) {
          .wa-page .wa-drift > img { transform: scale(1.22); will-change: transform; }
          .wa-page .wa-drift-5 > img { transform: scale(1.11); }
        }

        /* ── handwriting that fills in ── words never break inside; until
           the loop lights them the letters wait grey (white under
           reduced motion, where the loop never runs) */
        .wa-ink-w { white-space: nowrap; }
        @media (prefers-reduced-motion: no-preference) {
          .js .wa-page .wa-ink-c { opacity: 0.28; }
        }

        /* A section that answers the one before it — the questions after
           Learning to see again, Between them after India and Japan, What
           does the technology answer to? after Why this matters, the promise after
           the three pictures, the close after the promise — sits one gap
           from it, not two. */
        .wa-page .rk-sec.wa-sec-near { padding-top: 0; }
        /* a section that leads into the expanding picture below it: that
           picture arrives as a smaller card with black around it, so the
           section's own full gap would double the space */
        .wa-page .rk-sec.wa-sec-lead { padding-bottom: var(--space-7); }

        /* ── no orphans ── every paragraph ends on at least two words: a
           no-break space holds the last two together in the copy, and
           pretty wrapping evens the rag where the browser offers it */
        .wa-page p, .wa-page figcaption { text-wrap: pretty; }
        .wa-page .rk-hero-lede { text-wrap: balance; }
        /* on a phone, handwriting reads as a few lines of near-equal
           length, not full lines and a short tail — unless its breaks are
           set by hand. Wider screens already break it evenly. */
        @media (max-width: 767px) { .wa-page .wa-ink-even { text-wrap: balance; } }

        /* ── handwriting size ── 80% of the kit's (30–52px → 24–41.6px)
           on this page only; the other Reason pages keep the kit's */
        .wa-page .rk-hand { font-size: clamp(24px, 3.2vw, 41.6px); }

        /* ── a section over a film ── the film fills the section behind
           its words, under a tint that is their contrast floor; it comes
           into focus as the section rises (useSlowScroll's focus) */
        .wa-film-sec {
          position: relative; overflow: clip;
          min-height: 100svh; display: grid; align-items: center;
          padding: var(--section-gap) 0; margin: var(--section-gap) 0;
        }
        .wa-film-sec .wa-film-bg {
          position: absolute !important; inset: 0; z-index: 0;
          aspect-ratio: auto !important; border-radius: 0 !important;
        }
        .wa-film-sec::after {
          content: ''; position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: rgb(0 0 0 / 0.5);
        }
        .wa-film-copy { position: relative; z-index: 2; }

        /* prose level with the middle of the picture beside it: the kit's
           even bleed centres it; its left bleed's top offset is dropped */
        .wa-page .wa-level .rk-bleed-copy { padding-top: 0; }

        /* ── the letter ── centred paragraphs at a reading width */
        .wa-letter { max-width: 60ch; }
        .wa-letter .p1 + .p1 { margin-top: var(--space-4); }
        .rk-hand + .wa-letter, .rk-centre + .wa-letter { margin-top: var(--space-8); }

        /* The board sets each handwritten line across the page in one
           line, wider than the kit's reading width. */
        .wa-page .rk-centre { max-width: 1120px; }
        .wa-page .rk-centre .rk-hand { max-width: none; }
        .wa-page .rk-centre.wa-letter { max-width: 60ch; }
        .wa-after, .rk-centre.wa-after { margin-top: var(--wa-beat); }
        /* the four questions: held in the middle of the screen for a
           screen and a half of scroll while they fill (useSlowScroll sets
           the hold's top so the block sits centred). Without motion there
           is no hold. */
        .wa-pin-run { height: 150vh; }
        .wa-pin-in { position: sticky; top: 30vh; }
        @media (prefers-reduced-motion: reduce) { .wa-pin-run { display: none; } }

        /* ── the handwritten question set left, under its prose ── */
        .rk-hand.wa-hand-left { margin: var(--space-7) 0 0; text-align: left; max-width: 760px; }

        /* The promise: the same size as the other handwriting, at a width
           that keeps each of its two set lines whole. */
        .wa-page .wa-promise .rk-hand { max-width: 40ch; margin: 0 auto; }

        /* ── a statement over a picture ── set in its middle; a soft
           shade gathered behind the words is their contrast floor, and
           leaves the picture's edges clear */
        .wa-over { position: relative; margin-bottom: var(--section-gap); }
        .wa-over::after {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 60% 45% at 50% 50%, rgb(0 0 0 / 0.38), transparent 75%);
        }
        .wa-over-copy {
          position: absolute; inset: 0; z-index: 1;
          display: flex; align-items: center; justify-content: center;
          padding: 0 var(--gutter);
        }
        .wa-over-copy .rk-hand + .rk-hand { margin-top: var(--space-3); }

        /* ── the handwritten note under the bleeding picture ── */
        .wa-note { width: min(380px, 44%); margin: var(--wa-beat) 0 0 21%; border-radius: 0 !important; }
        .wa-note:not(.rk-slot) { background: none; }
        .wa-note-phone { display: none; }

        /* ── captioned frames ── */
        .wa-fig { margin: 0; }
        .wa-fig figcaption { margin-top: var(--space-3); }
        .wa-pair { margin-top: var(--wa-beat); }
        .wa-three { margin-top: var(--wa-beat); }

        /* The tall picture under Learning to see again, larger than the
           kit's inset: the board sets it at the copy column's width. */
        .wa-inset { width: min(520px, 100%); margin-top: var(--wa-beat); }

        /* ── polaroids ── the board's paper and ink; the same paper as
           RIPE's (--ripe-paper) */
        .wa-page { --wa-paper: #e3dcce; --wa-ink: #3c3c3c; }
        .wa-polaroid {
          display: block; width: min(48%, 324px); margin: 0 auto;
          background: var(--wa-paper); color: var(--wa-ink);
          padding: 5% 5% 0; box-shadow: 0 18px 40px rgb(0 0 0 / 0.45);
        }
        .wa-polaroid-photo { border-radius: 0 !important; }
        /* ── the peel ── */
        @property --h { syntax: '<number>'; inherits: true; initial-value: 0; }
        /* --p: set down (0 in the air, 1 on the page). --s: smoothed
           flat, from the top edge down (0 curled, 1 flat). useStickOn
           moves them; at rest both are done. */
        .wa-peel {
          --p: 1; --s: 1;
          /* how far it is still off the page, for the shadow */
          --lift: calc((1 - var(--p)) * 0.65 + (1 - var(--s)) * 0.35);
          position: relative; width: min(48%, 336px); margin: 0 auto;
          perspective: 1400px; perspective-origin: 50% 0%;
          transition: --h 600ms var(--ease-out);
          opacity: clamp(0, calc(var(--p) * 2.5), 1);
        }
        .wa-peel-wide { width: min(54%, 456px); }
        .wa-peel:hover { --h: 0.22; }
        /* set down from just above the page: lifted towards the reader
           and a little turned, then laid on it */
        .wa-peel-sheet {
          position: absolute; inset: 0; transform-style: preserve-3d;
          transform:
            translate3d(0, calc((1 - var(--p)) * -44px), calc((1 - var(--p)) * 70px))
            rotate(calc((1 - var(--p)) * -5deg))
            scale(calc(1 + (1 - var(--p)) * 0.035));
        }
        /* Each strip is a slice of the whole picture: the image inside is
           the sheet's full height, moved up by the strips above. Strips
           run 1px deep into the next, so no seam opens between them. */
        .wa-peel-strip {
          /* this strip's own curl: a smoothing front runs from the top
             strip to the foot as --s goes 0 → 1, flattening each strip as
             it passes, with a few strips of soft edge ahead of it */
          --own: clamp(0, calc((var(--i) - var(--s) * ${STRIPS + 6}) / 6), 1);
          position: absolute; left: 0; width: 100%;
          height: calc(100% / ${STRIPS} + 1px); top: 0;
          transform-origin: 50% 0;
          transform-style: preserve-3d;
          /* each strip bends from the one above; the lower, the more */
          transform: rotateX(calc((var(--own) * 15 + var(--h) * 11) * var(--k) * 1deg));
          backface-visibility: visible;
        }
        .wa-peel-strip .wa-peel-strip { top: calc(100% - 1px); height: 100%; }
        /* the clip lives on the slice, not the strip: a clipping strip
           would flatten the 3D and cut off every strip hinged below it */
        .wa-peel-slice { position: absolute; inset: 0; overflow: hidden; }
        .wa-peel-slice > img {
          position: absolute; left: 0; width: 100%; max-width: none;
          top: calc(var(--i) * (1px - 100%));
          height: calc(${STRIPS} * (100% - 1px));
          user-select: none; pointer-events: none;
        }
        /* light catches the curl */
        .wa-peel-slice > img {
          filter: brightness(calc(1 + (var(--own) + var(--h)) * var(--k) * 0.35));
        }
        /* the shadow: wide and soft while lifted, tight once it is down */
        .wa-peel-shadow {
          position: absolute; inset: 6% 8% 2%; border-radius: 4%;
          background: rgb(0 0 0 / 0.55);
          filter: blur(calc(6px + (var(--lift) + var(--h)) * 34px));
          opacity: calc((0.9 - var(--lift) * 0.4) * clamp(0, calc(var(--p) * 2.5), 1));
          transform: translate3d(calc(var(--lift) * 22px), calc(8px + var(--lift) * 56px), 0)
                     rotate(calc((1 - var(--p)) * -5deg))
                     scale(calc(1 + var(--lift) * 0.05));
        }
        .wa-polaroid .rk-slot { background: color-mix(in srgb, var(--wa-ink) 14%, var(--wa-paper)); box-shadow: none; }
        .wa-polaroid .rk-slot-label { color: color-mix(in srgb, var(--wa-ink) 60%, transparent); }
        .wa-polaroid-hand {
          font-family: var(--font-hand), cursive; font-size: clamp(11.2px, 1.28vw, 16px);
          line-height: 1.2; text-align: center; padding: 5% 0 7%;
          rotate: -2.5deg;
        }

        @media (max-width: 767px) {
          .wa-page { --section-gap: clamp(96px, 16vh, 150px); --wa-beat: clamp(64px, 10vh, 100px); }
          /* on a phone the polaroids are set large enough to read */
          .wa-polaroid, .wa-peel { width: 72%; }
          .wa-peel-wide { width: 86%; }
          .wa-note { margin: var(--space-7) auto 0; width: 60%; }
          /* the note moves up to sit under the ferns picture */
          .rk-bleed .wa-note { display: none; }
          .wa-note-phone { display: block; margin-bottom: 0; }
          /* and the picking picture follows the note closely */
          .wa-page .rk-sec.wa-learn { padding-top: var(--space-7); }
          /* Why this matters sits one gap below the film above it, not two */
          .wa-page .rk-sec.wa-why { padding-top: 0; }
          .wa-page .wa-over { margin-bottom: 0; }
          /* Why this matters: on a phone the words come before the tree */
          .wa-page .wa-level .rk-bleed-copy { order: -1; }
        }
      `}</style>
    </ReasonDark>
  )
}
