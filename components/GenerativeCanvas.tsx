'use client'

import { useEffect, useRef, useCallback } from 'react'

/* ═══════════════════════════════════════════
   GENERATIVE ART — Organic noise field
   Brand colours. Reacts to mouse cursor.
   Shared across hero, brand, and footer art.
═══════════════════════════════════════════ */

const BRAND_COLORS = [
  '#E05A2E', // Dry Osmosis (brighter)
  '#F09040', // Red Honey (brighter)
  '#F5C842', // Banana Wash (brighter)
  '#F0C4B8', // Solera Maceration (brighter)
  '#BDD0E8', // Solera Wash (brighter)
  '#D0CA60', // Grappa (brighter)
  '#9AA070', // Volcanic (brighter)
  '#FFFFFF', // Appassimento
]

function hash(x: number, y: number) {
  let h = x * 374761393 + y * 668265263
  h = (h ^ (h >> 13)) * 1274126177
  return ((h ^ (h >> 16)) & 0x7fffffff) / 0x7fffffff
}

function smoothstep(t: number) { return t * t * (3 - 2 * t) }

function noise2D(x: number, y: number) {
  const ix = Math.floor(x), iy = Math.floor(y)
  const fx = smoothstep(x - ix), fy = smoothstep(y - iy)
  const a = hash(ix, iy), b = hash(ix + 1, iy)
  const c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1)
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy
}

function fbm(x: number, y: number, octaves: number) {
  let val = 0, amp = 0.5, freq = 1
  for (let i = 0; i < octaves; i++) {
    val += amp * noise2D(x * freq, y * freq)
    amp *= 0.5; freq *= 2
  }
  return val
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

const BRAND_RGB = BRAND_COLORS.map(hexToRgb)

interface Props {
  /** Clear background before drawing (default true). Set false for overlay mode. */
  opaque?: boolean
  /** Background color when opaque (default '#131719') */
  bg?: string
  style?: React.CSSProperties
  className?: string
}

export default function GenerativeCanvas({
  opaque = true,
  bg = '#131719',
  style,
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const timeRef = useRef(0)
  const rafRef = useRef(0)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    if (!canvas || !wrapper) return
    const ctx = canvas.getContext('2d', { alpha: !opaque })
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = wrapper.clientWidth
    const h = wrapper.clientHeight

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    timeRef.current += 0.003
    const t = timeRef.current
    const mx = mouseRef.current.x
    const my = mouseRef.current.y

    const cellSize = Math.max(8, Math.floor(w / 80))
    const cols = Math.ceil(w / cellSize) + 1
    const rows = Math.ceil(h / cellSize) + 1

    if (opaque) {
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)
    } else {
      ctx.clearRect(0, 0, w, h)
    }

    const noiseScale = 0.04
    const threshold = 0.42

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const px = col * cellSize
        const py = row * cellSize
        const nx = px / w
        const ny = py / h
        const ddx = nx - mx
        const ddy = ny - my
        const dist = Math.sqrt(ddx * ddx + ddy * ddy)
        const mouseInfluence = Math.max(0, 1 - dist / 0.3) * 0.2
        const noiseX = col * noiseScale + t * 0.25 + Math.sin(t * 0.4) * 0.6
        const noiseY = row * noiseScale + t * 0.12 + Math.cos(t * 0.35) * 0.4
        const val = fbm(noiseX, noiseY, 5) + mouseInfluence

        if (val > threshold) {
          const colorNoise = fbm(col * 0.06 + t * 0.1, row * 0.06 + t * 0.08, 3)
          const colorIdx = Math.floor(colorNoise * BRAND_RGB.length) % BRAND_RGB.length
          const c = BRAND_RGB[Math.abs(colorIdx)]
          ctx.fillStyle = `rgb(${c.r},${c.g},${c.b})`
          ctx.fillRect(px, py, cellSize - 1, cellSize - 1)
        }
      }
    }

    rafRef.current = requestAnimationFrame(draw)
  }, [opaque, bg])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const wrapper = wrapperRef.current
      if (!wrapper) return
      const rect = wrapper.getBoundingClientRect()
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      }
    }
    window.addEventListener('mousemove', onMove)
    rafRef.current = requestAnimationFrame(draw)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [draw])

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%', ...style }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </div>
  )
}
