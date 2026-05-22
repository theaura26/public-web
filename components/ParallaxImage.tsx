'use client'

/**
 * ParallaxImage — Fabian Huber-style smooth scroll parallax
 *
 * Pattern:
 * - A fixed-aspect outer frame (overflow: hidden)
 * - An oversized inner image (default 120% of frame height) that translates
 *   on the Y-axis as the frame moves through the viewport
 * - Smoothing via rAF + lerp toward the target offset
 * - Activity gated by IntersectionObserver so off-screen frames pay nothing
 * - Honors prefers-reduced-motion (no transform)
 *
 * The inner image is scaled by `overscan` (default 0.20 → 120% height) so it
 * can travel between -overscan/2 and +overscan/2 of the frame height without
 * exposing the edges.
 *
 * Usage:
 *   <ParallaxImage src="/foo.jpg" alt="" aspect="16/9" speed={0.3} />
 *   <ParallaxImage aspect="3/4" speed={0.4}>
 *     <video src="..." />  // any media works as a child
 *   </ParallaxImage>
 */

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

type ParallaxImageProps = {
  /** Image src. If provided, an <img> is rendered. Ignored when `children` is set. */
  src?: string
  /** Image alt text. */
  alt?: string
  /** Aspect ratio of the outer frame. CSS aspect-ratio string, e.g. "16/9", "3/4", "1". */
  aspect?: string
  /** Frame width. Defaults to 100% of parent. */
  width?: string | number
  /** Object-fit on the inner image. Defaults to 'cover'. */
  objectFit?: CSSProperties['objectFit']
  /** Object-position on the inner image. Defaults to 'center'. */
  objectPosition?: CSSProperties['objectPosition']
  /** How aggressively the image moves. 0 = static, 1 = full-frame travel. Default 0.3. */
  speed?: number
  /**
   * Extra height of the inner image relative to the frame, expressed as a
   * fraction. 0.20 → inner is 120% of frame height. Default 0.20.
   * Should be ≥ |speed| to avoid showing edges at the extremes.
   */
  overscan?: number
  /** Lerp smoothing factor, 0 → no movement, 1 → no smoothing. Default 0.12. */
  smoothing?: number
  /** Optional className on the outer frame. */
  className?: string
  /** Optional inline style merged onto the outer frame. */
  style?: CSSProperties
  /** Render any media as a child instead of an <img>. */
  children?: ReactNode
}

export default function ParallaxImage({
  src,
  alt = '',
  aspect = '16/9',
  width = '100%',
  objectFit = 'cover',
  objectPosition = 'center',
  speed = 0.3,
  overscan,
  smoothing = 0.12,
  className,
  style,
  children,
}: ParallaxImageProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  // Auto-pad the overscan so it's always at least the speed magnitude.
  const effectiveOverscan = Math.max(Math.abs(speed), overscan ?? 0.2)

  useEffect(() => {
    const frame = frameRef.current
    const inner = innerRef.current
    if (!frame || !inner) return

    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let active = false
    let raf = 0
    let target = 0
    let current = 0

    const compute = () => {
      const rect = frame.getBoundingClientRect()
      const vh = window.innerHeight
      // Progress: -0.5 when frame bottom touches top of viewport,
      //           +0.5 when frame top touches bottom of viewport.
      // 0 when the frame is centred in the viewport.
      const center = rect.top + rect.height / 2
      const progress = (center - vh / 2) / (vh + rect.height)
      // Translate as a percentage of the inner image height.
      // Multiply by 100 (we use translateY in %), then by speed.
      target = progress * speed * 100
    }

    const tick = () => {
      // Lerp toward target.
      current += (target - current) * smoothing
      if (Math.abs(target - current) < 0.01) current = target
      inner.style.transform = `translate3d(0, ${current}%, 0)`
      if (active) raf = requestAnimationFrame(tick)
    }

    const start = () => {
      if (active) return
      active = true
      compute()
      raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      active = false
      cancelAnimationFrame(raf)
    }

    const onScroll = () => {
      if (!active) return
      compute()
    }
    const onResize = () => compute()

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start()
        else stop()
      },
      { threshold: 0, rootMargin: '20% 0px 20% 0px' }
    )
    io.observe(frame)

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    // Prime the position synchronously so there's no first-tick jump.
    compute()
    current = target
    inner.style.transform = `translate3d(0, ${current}%, 0)`

    return () => {
      stop()
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [speed, smoothing])

  // Inner element is taller than the frame by `effectiveOverscan` and pulled
  // up by half that overscan so it's centred at rest.
  const innerHeightPct = (1 + effectiveOverscan) * 100
  const innerTopPct = -(effectiveOverscan / 2) * 100

  return (
    <div
      ref={frameRef}
      className={className}
      style={{
        position: 'relative',
        width,
        aspectRatio: aspect,
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        ref={innerRef}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: `${innerTopPct}%`,
          height: `${innerHeightPct}%`,
          willChange: 'transform',
        }}
      >
        {children ?? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            style={{
              width: '100%',
              height: '100%',
              objectFit,
              objectPosition,
              display: 'block',
            }}
          />
        )}
      </div>
    </div>
  )
}
