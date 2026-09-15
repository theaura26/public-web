'use client'

import { useState, type ReactNode } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { StyleRegistry, createStyleRegistry } from 'styled-jsx'

/* ── styled-jsx on the server ────────────────────────────────────────
   Without a registry the App Router renders styled-jsx components with no
   <style> in the HTML: every component's CSS is injected only after
   hydration. Until then the page paints unstyled — full-size images and
   videos in the flow, then a jump into place — which read as a broken
   first frame and measured as a layout shift above 1 on desktop.

   The registry collects each render's rules and writes them into the
   streamed HTML ahead of the markup that uses them, as the Next.js
   CSS-in-JS guide sets out for styled-jsx. */
export default function StyledJsxRegistry({ children }: { children: ReactNode }) {
  const [registry] = useState(() => createStyleRegistry())

  useServerInsertedHTML(() => {
    const styles = registry.styles()
    registry.flush()
    return <>{styles}</>
  })

  return <StyleRegistry registry={registry}>{children}</StyleRegistry>
}
