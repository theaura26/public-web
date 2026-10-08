'use client'

import { useEffect, useRef, useState } from 'react'
import type { Day } from './after-copy'

/* ── The chapter bar ─────────────────────────────────────────────────
   Eight days is a long scroll, so the names ride along under the site
   bar once the opener is behind the reader: where they are, and a way
   to jump. It hides itself again at the top of the page, and when the
   reader scrolls up — the site's own bar comes back then, and two bars
   stacked is one too many.
─────────────────────────────────────────────────────────────────────── */

export const daySlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export function RipeDayNav({ days }: { days: Day[] }) {
  const [below, setBelow] = useState(false)
  const [up, setUp] = useState(false)
  const [on, setOn] = useState(0)
  const row = useRef<HTMLDivElement>(null)

  /* Below the opener, and which way the reader is going. The body
     carries both, because the site bar's own rules read them. */
  useEffect(() => {
    let last = window.scrollY
    const update = () => {
      const y = window.scrollY
      const isBelow = y > window.innerHeight * 0.9
      const goingUp = y < last - 2
      if (Math.abs(y - last) > 2) last = y
      setBelow(isBelow)
      setUp(goingUp)
      document.body.classList.toggle('dn-below', isBelow)
      document.body.classList.toggle('dn-up', isBelow && goingUp)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      document.body.classList.remove('dn-below', 'dn-up')
    }
  }, [])

  /* The day whose turn it is: the last anchor above the middle of the
     screen. Read on scroll rather than observed, so it never lags the
     ground behind it. */
  useEffect(() => {
    const update = () => {
      const marks = days.map((d) => document.getElementById(daySlug(d.title)))
      const mid = window.innerHeight * 0.5
      let i = 0
      marks.forEach((m, k) => { if (m && m.getBoundingClientRect().top <= mid) i = k })
      setOn(i)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [days])

  /* Keep the current name in view in the bar's own scroller. */
  useEffect(() => {
    const el = row.current?.children[on] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [on])

  return (
    <nav aria-label="A Season of RIPE, chapters"
         aria-hidden={!below}
         className={`dn ${below ? 'is-below' : ''} ${below && up ? 'is-up' : ''}`}>
      <div className="dn-scroll">
        <div className="dn-row" ref={row}>
          {days.map((d, i) => (
            <a key={d.title} href={`#${daySlug(d.title)}`}
               data-i={i}
               aria-current={i === on ? 'true' : undefined}
               aria-label={`${d.title}, ${d.day}`}
               tabIndex={below ? 0 : -1}
               className={`p2 dn-l ${i === on ? 'is-on' : ''}`}>{d.title}</a>
          ))}
          <span className="dn-runoff" aria-hidden />
        </div>
      </div>

      <style jsx>{`
        .dn {
          position: fixed; left: 0; right: 0; top: var(--nav-h); z-index: 39;
          height: 40px; background: #fff; border-bottom: 1px solid rgba(0,0,0,0.08);
          opacity: 0; pointer-events: none;
          transform: translateY(calc(-1 * var(--nav-h)));
          transition: transform var(--dur-base) var(--ease), opacity var(--dur-base) var(--ease);
        }
        .dn.is-below { opacity: 1; pointer-events: auto; transform: translateY(0); }
        /* Scrolling up hands the top of the screen back to the site bar. */
        .dn.is-below.is-up { transform: translateY(calc(-1 * var(--nav-h))); }
        .dn-scroll {
          height: 100%; overflow-x: auto;
          -webkit-overflow-scrolling: touch; scrollbar-width: none;
          /* Clears the wordmark on the left and the menu button on the right. */
          --nav-mark: 32px; --nav-burger: 44px;
          padding-left: calc(5vw - var(--nav-mark) / 2);
          padding-right: calc(5vw - var(--nav-burger) / 2);
          -webkit-mask-image: linear-gradient(90deg, #000 0 calc(100% - 56px), transparent 100%);
          mask-image: linear-gradient(90deg, #000 0 calc(100% - 56px), transparent 100%);
        }
        .dn-scroll::-webkit-scrollbar { display: none; }
        .dn-row {
          display: flex; align-items: center; justify-content: flex-start;
          gap: clamp(18px, 2.2vw, 32px); height: 100%; width: max-content;
        }
        .dn-runoff { flex: none; width: clamp(12px, 3vw, 40px); }
        .dn-l {
          display: inline-flex; align-items: center; height: 100%;
          flex-shrink: 0; white-space: nowrap; font-size: 12px;
          text-decoration: none; color: rgba(0,0,0,0.5);
          transition: color var(--dur-base) var(--ease);
        }
        .dn-l:hover, .dn-l.is-on { color: var(--ripe-green); }
      `}</style>
    </nav>
  )
}
