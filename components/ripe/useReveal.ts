'use client'

import { useEffect, useRef } from 'react'

/* Adds `is-in` to the element once it has been on screen, and stops
   watching. Readers who have asked for no motion get it on first paint.

   It does not trust the observer alone, and that is the whole point of
   the hook. An IntersectionObserver reports the layout as it was when it
   first ran, and on this page two things move underneath that reading:
   Next scrolls to the URL hash after hydration, and every photograph
   below the fold is lazy, so the document grows by thousands of pixels as
   they arrive. A section observed during either of those can be recorded
   as off screen and then never reported again — which left a reader who
   opened /ripe#company looking straight at three cells sitting at
   opacity nought.

   So the element's own position is read directly at mount and again on
   the next turn, and the observer is kept for everything after that.
   Whichever answers first wins, and the rest are disconnected. */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const show = () => el.classList.add('is-in')

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      show()
      return
    }

    let io: IntersectionObserver | null = null
    let timer = 0

    const done = () => {
      show()
      io?.disconnect()
      io = null
      window.removeEventListener('scroll', recheck)
      window.removeEventListener('resize', recheck)
      if (timer) { clearTimeout(timer); timer = 0 }
    }

    /* On screen enough to be worth revealing: its top above the lower
       twelfth of the viewport.

       Deliberately one-way. The first version also required the element
       not to have been scrolled past, which made the test something that
       could go false again — and a reader who scrolled quickly enough
       that no event landed while a section was in the band left it
       hidden for the rest of the visit. A section above the viewport has
       unambiguously arrived. */
    const onScreen = () => el.getBoundingClientRect().top < window.innerHeight * 0.88

    if (onScreen()) { show(); return }

    /* And the observer is not trusted on its own either. It reports
       against a band well inside the viewport, and a section whose
       geometry changes underneath that band — a lazy photograph landing
       above it, a sticky block resolving, a fast scroll past it — can be
       missed entirely, which left whole sections sitting at opacity
       nought with nothing left watching them. The scroll listener is the
       backstop: one bounding-rect read per frame of scroll, and it stops
       the first time the element is shown. */
    const recheck = () => { if (onScreen()) done() }
    window.addEventListener('scroll', recheck, { passive: true })
    window.addEventListener('resize', recheck)

    io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) done() },
      /* The band is well inside the viewport, so a block starts its
         reveal as the reader arrives at it rather than the moment its
         top edge clips the bottom of the screen — which fired while it
         was still most of a screen away and meant everything was
         already up by the time it could be read. */
      { rootMargin: '-12% 0px -30% 0px', threshold: 0 },
    )
    io.observe(el)

    /* One re-read after the hash jump and the first images have landed. */
    timer = window.setTimeout(() => { if (onScreen()) done() }, 300)

    return () => {
      io?.disconnect()
      window.removeEventListener('scroll', recheck)
      window.removeEventListener('resize', recheck)
      if (timer) clearTimeout(timer)
    }
  }, [])

  return ref
}
