'use client'

import { useEffect, useRef, useState } from 'react'
import { useStatic } from '@/components/the-reason/Motion'

/* ───────────────────────────────────────────────────────────────────────
   Per-letter wordmark — each glyph (an SVG <path>) POPS in one by one, left
   to right: scales up from ~0.65 about its own centre with a small overshoot,
   while fading in. The SVG is fetched and inlined so its individual paths can
   be staggered (an <img> can’t expose its internals). The pop fires when the
   mark scrolls into view, so it works both above the fold (THE REASON) and
   below it (THE BALANCE). Degrades to fully-visible for reduced-motion / agent.
   ─────────────────────────────────────────────────────────────────────── */
export function ReasonWordmark({
  src, className, ariaLabel = 'The Reason',
}: { src: string; className?: string; ariaLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState('')
  const isStatic = useStatic()

  useEffect(() => {
    let on = true
    fetch(src).then((r) => r.text()).then((t) => { if (on) setSvg(t) }).catch(() => {})
    return () => { on = false }
  }, [src])

  useEffect(() => {
    if (!svg) return
    const el = ref.current
    if (!el) return
    const svgEl = el.querySelector('svg')
    if (svgEl) {
      svgEl.style.width = '100%'; svgEl.style.height = 'auto'; svgEl.style.display = 'block'
      svgEl.style.overflow = 'visible' // let the overshoot breathe past the viewBox
    }
    const paths = Array.from(el.querySelectorAll<SVGPathElement>('path'))
    if (isStatic) { paths.forEach((p) => { p.style.opacity = '1' }); return }

    // order the letters left → right by their bounding box, so the pop reads
    const ordered = paths
      .map((p) => { let x = 0; try { x = p.getBBox().x } catch { /* not rendered */ } return { p, x } })
      .sort((a, b) => a.x - b.x)

    // collapsed start — set WITHOUT a transition so it doesn't animate on setup
    ordered.forEach(({ p }) => {
      p.style.setProperty('transform-box', 'fill-box') // scale about each glyph’s own centre
      p.style.transformOrigin = 'center'
      p.style.transition = 'none'
      p.style.opacity = '0'
      p.style.transform = 'scale(0.65)'
    })
    void el.getBoundingClientRect() // flush the collapsed state

    const reveal = () => {
      ordered.forEach(({ p }, i) => {
        p.style.transition = 'opacity 0.35s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' // easeOutBack = overshoot pop
        p.style.transitionDelay = `${i * 0.06}s`
      })
      requestAnimationFrame(() => requestAnimationFrame(() => {
        ordered.forEach(({ p }) => { p.style.opacity = '1'; p.style.transform = 'scale(1)' })
      }))
    }

    // pop in when it scrolls into view (fires right away if already on screen)
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { reveal(); io.disconnect() } },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [svg, isStatic])

  return (
    <div ref={ref} className={className} role="img" aria-label={ariaLabel}
      dangerouslySetInnerHTML={{ __html: svg }} />
  )
}
