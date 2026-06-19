'use client'

/* ═══════════════════════════════════════════════════════════════
   Reusable scroll-motion primitives for /the-reason.
   All of them degrade to static markup when:
     · the viewer is in agent mode (machine-readable view), or
     · the OS requests reduced motion.
   This keeps the page accessible and keeps agent mode readable
   (no inline opacity:0 left stranded).
   Built on framer-motion so the choreography stays declarative
   and reusable across every section.
═══════════════════════════════════════════════════════════════ */

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from 'framer-motion'
import { useRef, type ReactNode, type CSSProperties } from 'react'
import { useMode } from '@/components/ModeProvider'

/** True when animation should be skipped entirely. */
export function useStatic(): boolean {
  const reduced = useReducedMotion()
  const { viewMode } = useMode()
  return viewMode === 'agent' || !!reduced
}

const EASE = [0.19, 1, 0.22, 1] as const // easeOutExpo — matches site --ease-out

type Dir = 'up' | 'down' | 'left' | 'right' | 'none'

function offset(dir: Dir, distance: number) {
  switch (dir) {
    case 'up': return { y: distance }
    case 'down': return { y: -distance }
    case 'left': return { x: distance }
    case 'right': return { x: -distance }
    default: return {}
  }
}

/** Fade + slide a block into view once, as it crosses the viewport. */
export function FadeUp({
  children,
  dir = 'up',
  distance = 40,
  delay = 0,
  duration = 0.9,
  amount = 0.3,
  className,
  style,
  as = 'div',
}: {
  children: ReactNode
  dir?: Dir
  distance?: number
  delay?: number
  duration?: number
  amount?: number
  className?: string
  style?: CSSProperties
  as?: 'div' | 'section' | 'span' | 'figure' | 'li'
}) {
  const isStatic = useStatic()
  const M = motion[as] as typeof motion.div
  if (isStatic) {
    const Tag = as as 'div'
    return <Tag className={className} style={style}>{children}</Tag>
  }
  return (
    <M
      className={className}
      style={style}
      initial={{ opacity: 0, ...offset(dir, distance) }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </M>
  )
}

/** Container that staggers the entrance of <Item> children. */
export function Stagger({
  children,
  step = 0.12,
  delay = 0,
  className,
  style,
  amount = 0.3,
}: {
  children: ReactNode
  step?: number
  delay?: number
  className?: string
  style?: CSSProperties
  amount?: number
}) {
  const isStatic = useStatic()
  if (isStatic) return <div className={className} style={style}>{children}</div>
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: step, delayChildren: delay } },
  }
  return (
    <motion.div
      className={className}
      style={style}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  )
}

export function Item({
  children,
  dir = 'up',
  distance = 30,
  duration = 0.8,
  className,
  style,
}: {
  children: ReactNode
  dir?: Dir
  distance?: number
  duration?: number
  className?: string
  style?: CSSProperties
}) {
  const isStatic = useStatic()
  if (isStatic) return <div className={className} style={style}>{children}</div>
  const variants: Variants = {
    hidden: { opacity: 0, ...offset(dir, distance) },
    show: { opacity: 1, x: 0, y: 0, transition: { duration, ease: EASE } },
  }
  return (
    <motion.div className={className} style={style} variants={variants}>
      {children}
    </motion.div>
  )
}

/**
 * Vertical parallax: translates its child as the element travels
 * through the viewport. `strength` is the total px of travel
 * (positive = moves up faster than scroll).
 */
export function Parallax({
  children,
  strength = 80,
  className,
  style,
}: {
  children: ReactNode
  strength?: number
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isStatic = useStatic()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [strength, -strength])
  if (isStatic) return <div className={className} style={style}>{children}</div>
  return (
    <div ref={ref} className={className} style={style}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  )
}

/** Scale + fade in (used for wordmarks / hero marks). */
export function ScaleIn({
  children,
  from = 0.86,
  duration = 1.1,
  delay = 0,
  amount = 0.4,
  className,
  style,
}: {
  children: ReactNode
  from?: number
  duration?: number
  delay?: number
  amount?: number
  className?: string
  style?: CSSProperties
}) {
  const isStatic = useStatic()
  if (isStatic) return <div className={className} style={style}>{children}</div>
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, scale: from }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Scrubbed scale/opacity tied to scroll progress through the element —
 * good for big wordmarks that should "breathe" as you pass them.
 */
export function ScrollScrub({
  children,
  className,
  style,
  scaleRange = [0.92, 1, 1, 0.98],
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  scaleRange?: [number, number, number, number]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isStatic = useStatic()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const scale = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], scaleRange)
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.85, 1], [0.4, 1, 1, 0.6])
  if (isStatic) return <div className={className} style={style}>{children}</div>
  return (
    <div ref={ref} className={className} style={style}>
      <motion.div style={{ scale, opacity }}>{children}</motion.div>
    </div>
  )
}
