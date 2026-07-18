'use client'

import { useEffect, useRef, useState } from 'react'

/* ═══════════════════════════════════════════════════════════════════
   WORDMARK INTRO — a full-height white opening banner.

   The page opens on stillness: a white field with a single wordmark
   that draws itself in. Each letter path traces its outline in ink
   (stroke draw-in), then the fill settles behind it and the stroke
   fades — a mark that writes itself, then becomes solid. The dot in
   the mark is a solid hinomaru-red circle that fades in last, and the
   caption arrives after.

   The SVG is fetched and injected inline so its paths are animatable.
   Uses the Web Animations API (fill: 'forwards') so the finished state
   sticks and there is nothing for React StrictMode to revert. Letters
   are inked dark on purpose — the field is white regardless of theme.
   prefers-reduced-motion shows the finished mark with no draw.
═══════════════════════════════════════════════════════════════════ */

const INK = '#141414'
// Hinomaru — the red of the Japanese flag. The one non-black path in
// the mark (authored as #FD3E3E) is the dot; we render it as a solid
// filled circle in this red rather than stroke-drawing it like a letter.
const JAPAN_RED = '#BC002D'

/** The dot = the single path whose authored fill is not black. */
const isDot = (p: SVGPathElement) => {
  const f = (p.getAttribute('fill') || '').trim().toLowerCase()
  return f !== '' && f !== 'none' && f !== 'black' && f !== '#000' && f !== '#000000' && f !== INK.toLowerCase()
}

export function WordmarkIntro({
  src,
  caption,
  alt = '',
}: {
  src: string
  caption?: string
  alt?: string
}) {
  const holderRef = useRef<HTMLDivElement>(null)
  const captionRef = useRef<HTMLParagraphElement>(null)
  const [svg, setSvg] = useState<string>('')

  useEffect(() => {
    let cancelled = false
    fetch(src)
      .then(r => r.text())
      .then(txt => { if (!cancelled) setSvg(txt) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [src])

  useEffect(() => {
    if (!svg || !holderRef.current) return
    const svgEl = holderRef.current.querySelector('svg')
    if (!svgEl) return

    svgEl.setAttribute('width', '100%')
    svgEl.setAttribute('height', '100%')
    ;(svgEl as SVGElement).style.display = 'block'

    const paths = Array.from(svgEl.querySelectorAll<SVGPathElement>('path'))
    const caption = captionRef.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Resting state — solid. Letters inked; the dot a filled red circle.
    // This is also the fallback if the animation can't run.
    paths.forEach(p => {
      p.style.fill = isDot(p) ? JAPAN_RED : INK
      p.style.stroke = 'none'
      p.style.fillOpacity = '1'
    })

    if (reduced || paths.length === 0 || typeof (paths[0] as Element).animate !== 'function') {
      if (caption) caption.style.opacity = '1'
      return
    }

    // Seed the hidden, undrawn state before the first paint of animation.
    paths.forEach(p => {
      if (isDot(p)) {
        // Full filled red circle, just held invisible until its fade-in.
        p.style.fill = JAPAN_RED
        p.style.stroke = 'none'
        p.style.fillOpacity = '0'
        return
      }
      const len = p.getTotalLength()
      p.style.stroke = INK
      p.style.strokeWidth = '1.25'
      p.style.fillOpacity = '0'
      p.style.strokeDasharray = String(len)
      p.style.strokeDashoffset = String(len)
    })
    if (caption) caption.style.opacity = '0'

    const anims: Animation[] = []
    paths.forEach((p, i) => {
      if (isDot(p)) {
        // The dot is a solid red circle — no outline draw, a soft fade-in
        // once the letters have mostly settled.
        anims.push(p.animate(
          [{ fillOpacity: 0 }, { fillOpacity: 1 }],
          { duration: 700, delay: 1500, easing: 'ease-out', fill: 'forwards' },
        ))
        return
      }
      const len = p.getTotalLength()
      // 1) draw the outline in ink
      anims.push(p.animate(
        [{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
        { duration: 1500, delay: 200 + i * 90, easing: 'cubic-bezier(.6,0,.2,1)', fill: 'forwards' },
      ))
      // 2) settle the fill in and fade the stroke out — the mark goes solid
      anims.push(p.animate(
        [{ fillOpacity: 0, strokeOpacity: 1 }, { fillOpacity: 1, strokeOpacity: 0 }],
        { duration: 900, delay: 1250 + i * 55, easing: 'ease-out', fill: 'forwards' },
      ))
    })
    if (caption) anims.push(caption.animate(
      [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }],
      { duration: 800, delay: 1900, easing: 'ease-out', fill: 'forwards' },
    ))

    return () => { anims.forEach(a => a.cancel()) }
  }, [svg])

  return (
    <div className="wordmark-intro">
      <div
        ref={holderRef}
        className="wordmark-intro__mark"
        role="img"
        aria-label={alt}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {caption && <p ref={captionRef} className="label wordmark-intro__caption">{caption}</p>}

      <style jsx>{`
        .wordmark-intro {
          position: relative;
          width: 100vw;
          margin-left: calc(50% - 50vw);
          min-height: 100svh;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .wordmark-intro__mark {
          width: min(50vw, 380px);
          max-width: 74vw;
          aspect-ratio: 395 / 369;
          display: block;
        }
        @media (max-width: 768px) {
          .wordmark-intro__mark { width: min(64vw, 300px); }
        }
        .wordmark-intro__caption {
          position: absolute;
          left: 0;
          right: 0;
          bottom: clamp(48px, 9vh, 96px);
          margin: 0;
          text-align: center;
          color: #6b6b6b;
          letter-spacing: 1.5px;
        }
      `}</style>
    </div>
  )
}
