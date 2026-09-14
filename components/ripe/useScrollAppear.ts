'use client'

import { useEffect } from 'react'

/* ── Everything arrives with the scroll ─────────────────────────────
   One behaviour for the whole page, rather than a different entrance per
   section: each block is invisible until it rises into the lower part of
   the screen, and it comes up — opacity and a short lift — over the next
   third of a screen of scroll. It is tied to the scroll position, not
   played on a clock, so it runs backwards when the reader scrolls back up
   and never finishes ahead of them.

   It reads the position on the scroll event itself instead of on an
   animation frame. Where frames are held back — a background tab, an
   embedded preview — a frame-driven reveal stands still half-done, which
   is how content "went missing" before.

   The hero and the days are not in the list: both already move with the
   scroll on their own timelines, and two drivers on one element fight.

   Where a section's own .is-in rule transitions opacity or transform on
   the same element, that transition is switched off inline, so the block
   follows the scroll exactly instead of trailing it by most of a second.
   The handwritten line keeps its transition — it animates the pen, not
   the fade. */
const TARGETS = [
  '.open__say', '.open__intro',
  '.disp .section-w',
  '.arcs__h', '.arcs__note p', '.arc',
  '.prep__lead', '.prep__h', '.prep__grid .card', '.prep__kit', '.prep__mark',
  '.close__scatter', '.close__mark', '.close__t', '.close__l li', '.close__art',
  '.grat__fig', '.grat__h', '.grat__b',
  '.rem__h', '.rem__b', '.shot img',
  '.reg__h', '.reg__b', '.reg__row', '.reg__mark',
  '.harv__h', '.harv__from', '.harv__b', '.harv__months li', '.harv__note',
].join(', ')

/* Starts as the block's top crosses 95% of the screen height and is done
   a third of a screen later. */
const START = 0.95
const SPAN = 0.35
const LIFT = 36

export function useScrollAppear() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const els = Array.from(document.querySelectorAll<HTMLElement>(TARGETS))
    els.forEach((el) => {
      const t = getComputedStyle(el).transitionProperty
      if (/\b(all|opacity|transform)\b/.test(t)) el.style.transition = 'none'
      el.style.willChange = 'opacity, transform'
    })

    const update = () => {
      const vh = window.innerHeight
      /* Every read first, then every write, so one write never forces
         the browser to lay the page out again before the next read. */
      const tops = els.map((el) => el.getBoundingClientRect().top)
      els.forEach((el, i) => {
        const p = Math.min(Math.max((vh * START - tops[i]) / (vh * SPAN), 0), 1)
        const e = 1 - Math.pow(1 - p, 3)
        el.style.opacity = e.toFixed(3)
        el.style.transform = e === 1 ? 'none' : `translate3d(0, ${((1 - e) * LIFT).toFixed(1)}px, 0)`
      })
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      els.forEach((el) => {
        el.style.removeProperty('opacity')
        el.style.removeProperty('transform')
        el.style.removeProperty('transition')
        el.style.removeProperty('will-change')
      })
    }
  }, [])
}
