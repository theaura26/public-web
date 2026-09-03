'use client'

/* ── Global read-depth tracker ───────────────────────────────────────
   Mounted once in the root layout, it watches scroll on EVERY page and
   fires `read_depth` at 25 / 50 / 75 / 100% — once each, reset per route.
   Pages too short to "read" (e.g. /contact) are skipped, so they don’t
   emit instant-100% noise.

   For a content brand this is the key behaviour signal: what actually gets
   READ, not just loaded. Filter `read_depth` by the `path` property to see
   per-journal completion. No-ops until analytics is enabled (via track()). */

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { track } from '@/lib/analytics'

const THRESHOLDS = [25, 50, 75, 100] as const

export function ScrollDepth() {
  const pathname = usePathname()
  const fired = useRef<Set<number>>(new Set())

  useEffect(() => {
    fired.current = new Set()
    let raf = 0

    const check = () => {
      raf = 0
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      // Skip pages that aren't meaningfully scrollable — avoids instant 100%.
      if (scrollable < window.innerHeight * 0.5) return
      const pct = Math.min(100, Math.round((window.scrollY / scrollable) * 100))
      for (const t of THRESHOLDS) {
        if (pct >= t && !fired.current.has(t)) {
          fired.current.add(t)
          track('read_depth', { depth: t, path: pathname })
        }
      }
    }

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check) }
    window.addEventListener('scroll', onScroll, { passive: true })
    check() // catch short or pre-scrolled loads
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [pathname])

  return null
}
