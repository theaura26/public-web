'use client'

import { useEffect, useRef, ReactNode } from 'react'

export default function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const show = () => el.classList.add('visible')

    // Immediately show if in viewport on mount
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight + 200) {
      const timer = setTimeout(show, 30 + delay)
      return () => clearTimeout(timer)
    }

    // Otherwise use IntersectionObserver for scroll
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(show, delay)
          observer.unobserve(el)
        }
      },
      { threshold: 0.01, rootMargin: '50px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
