'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

/* ── The season switch ───────────────────────────────────────────────
   RIPE and A Season of RIPE are one thing seen twice — the invitation and
   the record — so each page's section bar ends in a switch between them.
   A plain track and a dot: RIPE's green on the week, coral on the season.

   It is a real switch (role="switch"): checked is the season. Pressing it
   slides the dot first and changes page as the slide lands, so the control
   and the page agree about where you are going.
─────────────────────────────────────────────────────────────────────── */

const PAGES = { week: '/ripe', season: '/ripe/after' } as const
/* The slide, in ms. */
const SLIDE = 380

export function RipeSeasonToggle({ tone = 'light' }: {
  /** Ink of the bar it sits on: light on RIPE's black bar, dark on the
      season's white one. */
  tone?: 'light' | 'dark'
}) {
  const pathname = usePathname()
  const router = useRouter()
  const onSeason = pathname === PAGES.season
  const [full, setFull] = useState(onSeason)

  /* The other page is one press away, so have it ready. */
  useEffect(() => { router.prefetch(onSeason ? PAGES.week : PAGES.season) }, [onSeason, router])

  const go = () => {
    const to = full ? PAGES.week : PAGES.season
    setFull(!full)
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.setTimeout(() => router.push(to), still ? 0 : SLIDE)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={full}
      aria-label={full ? 'A Season of RIPE — switch to RIPE' : 'RIPE — switch to A Season of RIPE'}
      className={`rst rst--${tone} ${full ? 'is-full' : ''}`}
      onClick={go}
    >
      <span className="rst__dot" aria-hidden />

      <style jsx>{`
        .rst {
          --w: 34px; --h: 18px; --d: 10px; --pad: 3px;
          position: relative; flex: 0 0 auto;
          width: var(--w); height: var(--h);
          margin: 0; padding: 0; border-radius: 999px;
          background: none; cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          border: 1px solid var(--rst-line);
        }
        .rst--light { --rst-line: rgba(255, 255, 255, 0.4); }
        .rst--dark { --rst-line: rgba(0, 0, 0, 0.24); }
        .rst__dot {
          position: absolute; top: 50%; left: var(--pad);
          width: var(--d); height: var(--d); border-radius: 50%;
          background: #23FF88;
          transform: translate(0, -50%);
          transition: transform ${SLIDE}ms var(--ease), background-color ${SLIDE}ms var(--ease);
        }
        .rst.is-full .rst__dot {
          background: #FF60A5;
          transform: translate(calc(var(--w) - var(--d) - var(--pad) * 2 - 2px), -50%);
        }
        .rst:focus-visible { outline: 1px solid var(--rst-line); outline-offset: 4px; }
        @media (prefers-reduced-motion: reduce) {
          .rst__dot { transition: none; }
        }
      `}</style>
    </button>
  )
}
