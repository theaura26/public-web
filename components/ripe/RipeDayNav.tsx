'use client'

import { useEffect, useRef, useState } from 'react'
import type { Day } from './after-copy'
import { RipeSeasonToggle } from './RipeSeasonToggle'

/* ── The chapter bar ─────────────────────────────────────────────────
   RIPE's own section bar, on the season: the same behaviour line for
   line, so the two pages move the same way under the reader's hand.

     below the fold    the bar arrives under the site header
     scrolling down    the header peeks away; the bar takes the top edge
     scrolling up      the header comes back; the bar returns under it
     a name            smooth jump to that day, and the URL says where
     a cold #day link  lands on that day once the page is its real size
─────────────────────────────────────────────────────────────────────── */

export const daySlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export function RipeDayNav({ days }: { days: Day[] }) {
  const [below, setBelow] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [on, setOn] = useState(0)
  const scroller = useRef<HTMLDivElement>(null)

  /* Peekaboo, as RipeNav and MicroNav: past the fold the header hides
     on the way down and returns on the way up. */
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
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(read) } }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('dn-below', below)
    document.body.classList.toggle('dn-up', hidden)
    return () => {
      document.body.classList.remove('dn-below')
      document.body.classList.remove('dn-up')
    }
  }, [below, hidden])

  /* The day whose turn it is: the last day whose run has reached the
     middle of the screen, where its name is held. Read on the frame
     rather than observed, so it never lags the ground behind it. */
  useEffect(() => {
    let ticking = false
    const read = () => {
      const mid = window.innerHeight * 0.5
      let i = 0
      days.forEach((d, k) => {
        const m = document.getElementById(daySlug(d.title))
        if (m && m.getBoundingClientRect().top <= mid) i = k
      })
      setOn(i)
      ticking = false
    }
    read()
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(read) } }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [days])

  /* Land a cold load on the right day, as RipeNav does: again once the
     page is its real size, and not at all once the reader moves. */
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1))
    if (!id) return
    const target = document.getElementById(id)
    if (!target) return
    let cancelled = false
    const settle = () => { if (!cancelled) target.scrollIntoView({ behavior: 'auto', block: 'start' }) }
    const stop = () => { cancelled = true }
    const evs = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const
    for (const ev of evs) window.addEventListener(ev, stop, { passive: true, once: true })
    let raf = 0
    const afterFonts = () => { raf = requestAnimationFrame(() => { raf = requestAnimationFrame(settle) }) }
    if (document.fonts) document.fonts.ready.then(afterFonts).catch(afterFonts)
    else afterFonts()
    const late = window.setTimeout(settle, 700)
    return () => {
      cancelled = true
      if (raf) cancelAnimationFrame(raf)
      clearTimeout(late)
      for (const ev of evs) window.removeEventListener(ev, stop)
    }
  }, [])

  /* Keep the current name in view inside the bar. scrollLeft directly,
     not scrollIntoView — that is entitled to move the page vertically,
     and the page's position is what chose this name. */
  useEffect(() => {
    const sc = scroller.current
    if (!sc) return
    const el = sc.querySelector<HTMLElement>(`[data-i="${on}"]`)
    if (!el) return
    const pad = 20
    const left = el.offsetLeft - pad
    const right = el.offsetLeft + el.offsetWidth + pad
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? ('auto' as const) : ('smooth' as const)
    if (left < sc.scrollLeft) sc.scrollTo({ left, behavior })
    else if (right > sc.scrollLeft + sc.clientWidth) sc.scrollTo({ left: right - sc.clientWidth, behavior })
  }, [on])

  const jump = (e: React.MouseEvent<HTMLAnchorElement>, i: number) => {
    const id = daySlug(days[i].title)
    const el = document.getElementById(id)
    if (!el) return
    e.preventDefault()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    history.replaceState(null, '', `#${id}`)
    setOn(i)
  }

  return (
    <nav aria-label="A Season of RIPE, chapters"
         aria-hidden={!below}
         className={`dn ${below ? 'is-below' : ''} ${hidden ? 'is-up' : ''}`}>
      <div className="dn-in">
      <div className="dn-scroll" ref={scroller}>
        <div className="dn-row">
          {days.map((d, i) => (
            <a key={d.title} href={`#${daySlug(d.title)}`}
               data-i={i}
               aria-current={i === on ? 'true' : undefined}
               aria-label={`${d.title}, ${d.day}`}
               tabIndex={below ? 0 : -1}
               onClick={(e) => jump(e, i)}
               className={`p2 dn-l ${i === on ? 'is-on' : ''}`}>{d.title}</a>
          ))}
          <span className="dn-runoff" aria-hidden />
        </div>
      </div>
      {/* The week and the season, one press apart. */}
      <span className="dn-switch"><RipeSeasonToggle tone="dark" /></span>
      </div>

      <style jsx global>{`
        /* The site bar on the season. Over the film it is clear (RipeHero
           marks that); below the fold it is the page's own white, and it
           peeks away on the way down exactly as on RIPE. */
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
          /* RIPE's own section bar, printed: the same 56px frame, z-index,
             hairline and motion, dark ink on white instead of light on
             black. */
          position: fixed; left: 0; right: 0; top: var(--nav-h); z-index: 39;
          height: 56px; background: #fff; border-bottom: 1px solid rgba(0, 0, 0, 0.14);
          opacity: 0; pointer-events: none;
          transform: translateY(calc(-1 * var(--nav-h)));
          transition: transform var(--dur-base) var(--ease), opacity var(--dur-base) var(--ease);
        }
        .dn.is-below { opacity: 1; pointer-events: auto; transform: translateY(0); }
        /* Header away — the bar takes the top edge itself. */
        .dn.is-below.is-up { transform: translateY(calc(-1 * var(--nav-h))); }
        .dn-in {
          display: flex; align-items: center; height: 100%;
          padding-right: calc(5vw - 44px / 2);
        }
        @media (max-width: 620px) { .dn-in { padding-right: var(--gutter, 20px); } }
        .dn-switch { flex: 0 0 auto; display: flex; align-items: center; margin-left: var(--space-5); }
        .dn-scroll {
          flex: 1 1 auto; min-width: 0;
          height: 100%; overflow-x: auto;
          -webkit-overflow-scrolling: touch; scrollbar-width: none;
          /* Clears the wordmark on the left and the menu button on the right. */
          --nav-mark: 32px; --nav-burger: 44px;
          padding-left: calc(5vw - var(--nav-mark) / 2);
          -webkit-mask-image: linear-gradient(to right, #000 0, #000 calc(100% - 56px), transparent 100%);
          mask-image: linear-gradient(to right, #000 0, #000 calc(100% - 56px), transparent 100%);
        }
        @media (max-width: 620px) {
          .dn-scroll { padding-left: var(--gutter, 20px); }
        }
        .dn-scroll::-webkit-scrollbar { display: none; }
        .dn-row {
          display: flex; align-items: center; justify-content: flex-start;
          gap: clamp(22px, 2.8vw, 40px); height: 100%; width: max-content;
        }
        .dn-runoff { flex: none; width: clamp(12px, 3vw, 40px); }
        .dn-l {
          display: inline-flex; align-items: center; height: 100%;
          flex-shrink: 0; white-space: nowrap; font-size: 13px;
          text-decoration: none; color: rgba(0, 0, 0, 0.66);
          transition: color var(--dur-base) var(--ease);
        }
        .dn-l:hover, .dn-l.is-on { color: var(--ripe-green); }
      `}</style>
    </nav>
  )
}
