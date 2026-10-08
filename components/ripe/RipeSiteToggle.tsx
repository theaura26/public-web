'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

/* ── The RIPE switch: the season, or its story ──────────────────────
   A small toggle in the site bar, beside the menu, on /ripe and on its
   sister page /ripe/10-days, to move between the two. After the
   "Cosmic Solar Eclipse Toggle" (Dmitry Lepisov, Dribbble): a dark pill
   — here translucent glass — with a light catching its rim, and a body
   that slides across it while a shadow slides off it — an eclipse
   opening out. Here the body is the moon, in white:

     /ripe            a crescent lit on the left (☾), at the left
     /ripe/10-days    the full moon, at the right

   Pressed, the moon slides over as the shadow clears (or back, as it
   closes to a crescent), and the other page opens once it has — so the
   motion is the way from one to the other. The bar stays mounted across
   the change, so the toggle simply settles where the new page puts it.
   For readers who ask for less motion it changes at once.
─────────────────────────────────────────────────────────────────────── */

const MAIN = '/ripe'
const SISTER = '/ripe/10-days'
/* How long the moon takes to cross, in ms — and so how long before the
   page changes. */
const CROSS = 620

export function RipeSiteToggle({ pathname }: { pathname: string }) {
  const router = useRouter()
  const onSister = pathname === SISTER
  /* Where the moon is: the side it is on its way to while it crosses,
     or else the page's own. Every change of page — by this toggle, by
     the RIPE mark on /ripe, by the browser's back and forward — ends any
     crossing, so the toggle always starts again from the page it is on
     and can be pressed again. (Reset while rendering, as React suggests
     for state that follows a prop, rather than in an effect.) */
  const [going, setGoing] = useState<boolean | null>(null)
  const [seen, setSeen] = useState(pathname)
  if (seen !== pathname) {
    setSeen(pathname)
    setGoing(null)
  }
  const crossing = seen === pathname ? going : null
  const full = crossing ?? onSister

  /* The page as it is now, for the crossing's end: if the reader has
     gone somewhere else meanwhile, the toggle doesn't pull them back. */
  const here = useRef(pathname)
  useEffect(() => { here.current = pathname }, [pathname])

  /* Both pages fetched ahead, so the change is quick once the moon lands. */
  useEffect(() => {
    router.prefetch(MAIN)
    router.prefetch(SISTER)
  }, [router])

  const toggle = () => {
    if (crossing !== null) return
    const to = !onSister
    const from = pathname
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setGoing(to)
    window.setTimeout(() => {
      if (here.current === from) router.push(to ? SISTER : MAIN)
    }, reduced ? 0 : CROSS)
  }

  return (
    <div className="rst">
      <button
        type="button"
        role="switch"
        aria-checked={full}
        aria-label={full ? '10 Days of RIPE — switch to RIPE' : 'RIPE — switch to 10 Days of RIPE'}
        className={`rst__pill ${full ? 'is-full' : ''}`}
        onClick={toggle}
        /* Inline, as elsewhere on the site: styled-jsx drops
           backdrop-filter from its emitted rules here. */
        style={{ backdropFilter: 'blur(12px) saturate(1.2)', WebkitBackdropFilter: 'blur(12px) saturate(1.2)' }}
      >
        <span className="rst__moon" aria-hidden>
          <span className="rst__disc" />
        </span>
      </button>

      {/* The moon's phase, 0 a crescent to 1 full, registered so it can be
          animated: the slide across and the filling are both read from
          it, so the moon comes full exactly as it moves. */}
      <style jsx global>{`
        @property --rst-phase {
          syntax: '<number>';
          inherits: true;
          initial-value: 0;
        }
      `}</style>

      <style jsx>{`
        /* Placed in the bar beside the menu: on wide screens the menu
           sits centred in a 10vw rail (its 44px box from 5vw - 22px), on
           phones at the gutter. */
        .rst {
          position: absolute; top: 50%;
          right: calc(5vw + 22px + 10px);
          transform: translateY(-50%);
          display: flex; align-items: center;
        }
        @media (max-width: 768px) {
          .rst { right: calc(var(--gutter, 20px) + 44px + 6px); }
        }

        /* The pill: dark glass — translucent, blurring what is behind it
           (the blur is set inline, above) — with the light caught along
           its rim, bright at the top left and bottom right, as in the
           reference. */
        .rst__pill {
          --w: 54px; --h: 28px; --pad: 4px; --d: 20px;
          --rst-phase: 0;
          position: relative;
          width: var(--w); height: var(--h);
          padding: 0; margin: 0;
          border: 0;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.38);
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          transition: --rst-phase ${CROSS}ms cubic-bezier(0.65, 0, 0.35, 1);
        }
        .rst__pill.is-full { --rst-phase: 1; }
        /* The rim: a 1px gradient ring, cut out of a layer over the pill,
           so the glass shows through inside it. */
        .rst__pill::before {
          content: '';
          position: absolute; inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.95) 0%,
            rgba(255, 255, 255, 0.14) 30%,
            rgba(255, 255, 255, 0.05) 55%,
            rgba(255, 255, 255, 0.6) 100%);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask-composite: exclude;
          pointer-events: none;
        }
        .rst__pill:focus-visible { outline: 2px solid var(--ripe-green, #FF2D87); outline-offset: 3px; }

        /* The moon travels as one piece — a faint halo, a soft radial
           light behind it and not a shadow, and the disc — from the left
           to the right as its phase goes from 0 to 1. */
        .rst__moon {
          position: absolute; top: 50%; left: var(--pad);
          width: var(--d); height: var(--d);
          transform: translate(calc(var(--rst-phase) * (var(--w) - var(--d) - var(--pad) * 2)), -50%);
        }
        .rst__moon::before {
          content: '';
          position: absolute; inset: -55%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.32) 0%, rgba(255, 255, 255, 0) 62%);
          opacity: var(--rst-phase);
        }
        /* The disc: white, with a little grey in its seas. Its dark side
           is cut away rather than painted, so the glass shows through:
           a round shadow the size of the moon, sitting over its right
           side — a crescent lit on the left (☾) — and sliding off to the
           right as the phase comes up, until the moon is full. */
        .rst__disc {
          position: absolute; inset: 0;
          border-radius: 50%;
          background:
            radial-gradient(circle at 34% 38%, rgba(0, 0, 0, 0.10) 0 14%, transparent 16%),
            radial-gradient(circle at 62% 64%, rgba(0, 0, 0, 0.08) 0 11%, transparent 13%),
            radial-gradient(circle at 66% 30%, rgba(0, 0, 0, 0.06) 0 7%, transparent 9%),
            radial-gradient(circle at 40% 35%, #fff 0%, #f1f1ee 60%, #dcdcd6 100%);
          --off: calc(var(--d) * (0.32 + 0.8 * var(--rst-phase)));
          -webkit-mask-image: radial-gradient(circle at calc(50% + var(--off)) 50%, transparent calc(var(--d) / 2 + 0.5px), #000 calc(var(--d) / 2 + 1.2px));
          mask-image: radial-gradient(circle at calc(50% + var(--off)) 50%, transparent calc(var(--d) / 2 + 0.5px), #000 calc(var(--d) / 2 + 1.2px));
        }

        @media (prefers-reduced-motion: reduce) {
          .rst__pill { transition: none; }
        }
      `}</style>
    </div>
  )
}
