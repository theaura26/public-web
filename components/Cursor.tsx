'use client'

import { useEffect, useRef } from 'react'

export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null)
  const pos = useRef({ cx: 0, cy: 0, tx: 0, ty: 0 })

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const onMove = (e: MouseEvent) => {
      pos.current.tx = e.clientX
      pos.current.ty = e.clientY
    }

    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest?.('a, button, [role="button"], label, select, input, textarea')) {
        ref.current?.classList.add('hovering')
      }
    }

    const onOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest?.('a, button, [role="button"], label, select, input, textarea')) {
        ref.current?.classList.remove('hovering')
      }
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)

    let raf: number
    const animate = () => {
      const p = pos.current
      p.cx += (p.tx - p.cx) * 0.15
      p.cy += (p.ty - p.cy) * 0.15
      if (ref.current) {
        ref.current.style.transform = `translate3d(${p.cx - 5}px, ${p.cy - 5}px, 0)`
      }
      raf = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="cursor" ref={ref}>
      <div className="cursor-dot" />
    </div>
  )
}
