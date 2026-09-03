'use client'

import { useEffect, useRef, type ReactNode, type CSSProperties } from 'react'

/* ═══════════════════════════════════════════════════════════════════
   INVERT ON SCROLL — a section that flips to the contrast palette while
   it holds the centre of the viewport.

   As the reader scrolls the section through the middle of the screen it
   transitions its background to (near-)black and remaps the theme colour
   variables to their contrast values, so every child — headline, meta
   labels, body copy — inverts to light in one move. Scroll past and it
   eases back. Works in both day and night because it uses the theme’s
   own --contrast-* palette rather than hard-coded colours.
═══════════════════════════════════════════════════════════════════ */

export function InvertOnScroll({
  children,
  className = '',
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        // Latch: the first time the section reaches the centre band it flips
        // to the contrast palette and STAYS there — it never transitions back
        // to white. This makes it read as one continuous dark region with the
        // sanctuary lede + stack that follow, instead of flashing white as it
        // scrolls out. The transition-in still eases (0.6s); only the revert
        // is removed.
        if (entry.isIntersecting) {
          el.classList.add('is-inverted')
          io.disconnect()
        }
      },
      // Observe only the centre ~30% band of the viewport, so the flip happens
      // as the section takes over the screen — not the instant an edge appears.
      { rootMargin: '-35% 0px -35% 0px', threshold: 0 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={ref} className={`invert-on-scroll ${className}`.trim()} style={style}>
      {children}
      <style jsx global>{`
        .invert-on-scroll {
          transition: background-color 0.6s var(--ease, ease);
        }
        /* Ease the colour flip on the copy the section owns. (The reveal
           headline’s word spans carry their own inline opacity transition
           and simply inherit the new colour.) */
        .invert-on-scroll :is(h2, h3, p, .label) {
          transition: color 0.6s var(--ease, ease);
        }
        .invert-on-scroll.is-inverted {
          --bg: var(--contrast-bg);
          --bg-card: var(--contrast-bg-card);
          --text: var(--contrast-text);
          --text-body: var(--contrast-text-body);
          --text-muted: var(--contrast-text-muted);
          --text-dim: var(--contrast-text-muted);
          --border: var(--contrast-border);
          color: var(--contrast-text);
        }
      `}</style>
    </section>
  )
}
