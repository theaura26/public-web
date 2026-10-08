'use client'

import { useEffect, useRef, useState } from 'react'
import type { Day } from './copy'
import { TURN, anchor, scrollToY } from './RipeStoryDays'

/* ── The day bar ────────────────────────────────────────────────────
   /ripe's section bar (components/ripe/RipeNav.tsx), made smaller, on
   this page's white:

     · fixed under the site bar, hidden until the opener is behind the
       reader, then dropping into place
     · the site bar peekaboos — away on the way down, back the moment
       they scroll up — and this bar rides with it, taking the top edge
       itself while the other is gone
     · one link per day on the page, by the day's title, the day in
       view marked in the page's accent

   Smaller than RipeNav — 40px tall to its 56, 12px links to its 13 — so
   it sits as a thin index over the story rather than a header. Its links
   are left-aligned on RipeNav's edges and set in sentence case.

   The days are held in one pinned place rather than laid down the page,
   so a link can't jump to an element: it scrolls to the point where
   that day's words have fully come up, read from the day markers
   RipeStoryDays lays out.
─────────────────────────────────────────────────────────────────────── */


/* The bar's labels in sentence case, as /ripe's are set by hand:
   "The Feeling of Belonging" → "The feeling of belonging". */
const sentence = (t: string) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()

/* How far into a day's clear beat a link lands, in screens. */
const SETTLE = 0.08

export function RipeDayNav({ days }: { days: Day[] }) {
  const [active, setActive] = useState(0)
  const [below, setBelow] = useState(false)
  const [hidden, setHidden] = useState(false)
  const scroller = useRef<HTMLDivElement>(null)

  /* Where each day's words are fully up, in page pixels. Day 1's are up
     as the stage reaches the top; every later day's a turn after its
     marker. Read live, as the page's height settles after fonts and
     images. */
  /* Links land a little into the day's clear beat, not on the edge of
     its fade, so a nudge back up doesn't start the words fading. */
  const stops = () => {
    const stage = document.querySelector<HTMLElement>('.days')
    if (!stage) return []
    const top = stage.getBoundingClientRect().top + window.scrollY
    const marks = Array.from(stage.querySelectorAll<HTMLElement>('.days__mark'))
    const vh = window.innerHeight
    return marks.map((m, i) => (i === 0 ? top : top + m.offsetTop + TURN * vh + 2))
  }

  /* Peekaboo and the marked day, from one scroll reading. */
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
      /* The day in view is the last one whose words have started to
         come up. */
      const s = stops()
      const vh = window.innerHeight
      let on = 0
      s.forEach((p, i) => { if (y >= p - TURN * vh - 2) on = i })
      setActive(on)
      ticking = false
    }
    read()
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(read) } }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [days])

  useEffect(() => {
    document.body.classList.toggle('dn-below', below)
    document.body.classList.toggle('dn-up', hidden)
    return () => {
      document.body.classList.remove('dn-below')
      document.body.classList.remove('dn-up')
    }
  }, [below, hidden])

  /* Keep the marked day in view when the bar scrolls sideways (ten
     days on a phone). scrollLeft directly, as RipeNav does, so the page
     itself never moves. */
  useEffect(() => {
    const sc = scroller.current
    if (!sc) return
    const el = sc.querySelector<HTMLElement>(`[data-i="${active}"]`)
    if (!el) return
    const pad = 16
    const left = el.offsetLeft - pad
    const right = el.offsetLeft + el.offsetWidth + pad
    if (left < sc.scrollLeft) sc.scrollTo({ left })
    else if (right > sc.scrollLeft + sc.clientWidth) sc.scrollTo({ left: right - sc.clientWidth })
  }, [active])

  const jump = (e: React.MouseEvent<HTMLAnchorElement>, i: number) => {
    const stop = stops()[i]
    if (stop === undefined) return
    const at = stop + window.innerHeight * SETTLE
    e.preventDefault()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) window.scrollTo({ top: at })
    else scrollToY(at)
    history.replaceState(null, '', `#${anchor(days[i])}`)
    setActive(i)
  }

  return (
    <>
      <nav
        className={`dn ${below ? 'is-below' : ''} ${hidden ? 'is-up' : ''}`}
        aria-label="The ten days"
        aria-hidden={!below}
      >
        <div className="dn-scroll" ref={scroller}>
          <div className="dn-row">
            {days.map((d, i) => (
              <a key={d.day} href={`#${anchor(d)}`} data-i={i}
                 className={`p2 dn-l ${active === i ? 'is-on' : ''}`}
                 aria-current={active === i ? 'true' : undefined}
                 aria-label={`${sentence(d.title)}, ${d.day}`}
                 tabIndex={below ? 0 : -1}
                 onClick={(e) => jump(e, i)}>
                {sentence(d.title)}
              </a>
            ))}
            <span className="dn-runoff" aria-hidden />
          </div>
        </div>
      </nav>

      <style jsx global>{`
        /* The site bar on this page: away on the way down once past the
           opener, back on the way up — as on /ripe. Its hairline shadow
           would land on y=0 while it is off screen, so it goes too. */
        body:has(.ripe-page--paper) .aura-nav {
          transition: transform var(--dur-base) var(--ease),
                      background var(--dur-base) var(--ease) !important;
        }
        body:has(.ripe-page--paper).dn-below.dn-up .aura-nav {
          transform: translateY(-100%) !important;
          box-shadow: none !important;
        }
      `}</style>

      <style jsx>{`
        .dn {
          /* 39, as RipeNav: under the hamburger backdrop (40) and the
             site bar and menu (50). */
          position: fixed; left: 0; right: 0; z-index: 39;
          height: 40px; top: var(--nav-h);
          background: #fff;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          opacity: 0; pointer-events: none;
          transform: translateY(calc(-1 * var(--nav-h)));
          transition: transform var(--dur-base) var(--ease),
                      opacity var(--dur-base) var(--ease);
        }
        .dn.is-below { opacity: 1; pointer-events: auto; transform: translateY(0); }
        /* Header away — the bar takes the top edge itself. */
        .dn.is-below.is-up { transform: translateY(calc(-1 * var(--nav-h))); }

        /* Left-aligned as /ripe's bar is, on the same edges: that bar
           lines its links up with the site bar's mark — a 10vw rail with
           the 32px mark centred in it, so 5vw less half the mark — and
           the gutter on small phones. Past the right edge the links
           scroll, dissolving under a mask (not a painted gradient, so it
           holds over any ground). */
        .dn-scroll {
          --nav-mark: 32px;
          --nav-burger: 44px;
          height: 100%;
          overflow-x: auto; -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding-left: calc(5vw - var(--nav-mark) / 2);
          padding-right: calc(5vw - var(--nav-burger) / 2);
          -webkit-mask-image: linear-gradient(to right, #000 0, #000 calc(100% - 56px), transparent 100%);
          mask-image: linear-gradient(to right, #000 0, #000 calc(100% - 56px), transparent 100%);
        }
        @media (max-width: 620px) {
          .dn-scroll { padding-left: var(--gutter, 20px); padding-right: var(--gutter, 20px); }
        }
        .dn-scroll::-webkit-scrollbar { display: none; }
        .dn-row {
          height: 100%; width: max-content;
          display: flex; align-items: center; justify-content: flex-start;
          gap: clamp(18px, 2.2vw, 32px);
        }
        .dn-runoff { flex: 0 0 auto; width: clamp(12px, 3vw, 40px); }

        /* RipeNav's link, a size down, dark on white. :global for the
           same reason it is there: the .p2 role is set on the element. */
        :global(.dn-l) {
          flex-shrink: 0;
          display: inline-flex; align-items: center; height: 100%;
          font-size: 12px;
          color: rgba(0, 0, 0, 0.5);
          text-decoration: none; white-space: nowrap;
          transition: color var(--dur-base) var(--ease);
        }
        :global(.dn-l):hover,
        :global(.dn-l.is-on) { color: var(--ripe-green); }

        @media (prefers-reduced-motion: reduce) {
          .dn { transition: none; }
        }
      `}</style>
    </>
  )
}
