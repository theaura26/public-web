'use client'

import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/* The OS motion preference, as a subscription rather than a one-off read
   in an effect.

   Reading it into state inside useEffect works and is what most of this
   codebase does, but it is a synchronous setState in an effect body, so
   it renders twice on every mount and React's own lint says so. A store
   subscription renders once, answers false on the server where there is
   no matchMedia, and updates live if the reader changes the setting
   while the page is open. */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(QUERY)
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    },
    () => window.matchMedia(QUERY).matches,
    () => false,
  )
}
