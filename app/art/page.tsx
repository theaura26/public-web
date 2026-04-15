'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import VideoReactiveArt from '@/components/VideoReactiveArt'

/* ═══════════════════════════════════════════
   COMPUTATIONAL ART PLAYGROUND
   Gallery of generative art experiments
   using the Aura brand palette.
═══════════════════════════════════════════ */

const BRAND = [
  '#E8421A', '#F07820', '#F5B810', '#F2A08A',
  '#8AAEE0', '#D4C020', '#7A9040', '#FFFFFF',
]

const WARM = ['#E8421A', '#F07820', '#F5B810', '#E37128']
const COOL = ['#8AAEE0', '#A5B6C8', '#7A9040', '#D4C020']

/* ── Noise helpers (shared across art styles) ── */
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
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  }
}

/* ═══════════════════════════════════════════
   ART STYLE 1: Flow Field
   Curved streamlines following noise vectors
═══════════════════════════════════════════ */
function FlowField({ colors = BRAND }: { colors?: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef(0)
  const timeRef = useRef(0)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')!
    const dpr = Math.min(devicePixelRatio || 1, 2)
    const w = wrap.clientWidth, h = wrap.clientHeight
    if (canvas.width !== w * dpr) {
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    timeRef.current += 0.002
    const t = timeRef.current
    const mx = mouseRef.current.x, my = mouseRef.current.y

    ctx.fillStyle = '#131719'
    ctx.fillRect(0, 0, w, h)

    const rgb = colors.map(hexToRgb)
    const lineCount = 200
    const steps = 60

    for (let i = 0; i < lineCount; i++) {
      const startX = hash(i, 0) * w
      const startY = hash(0, i) * h
      const ci = Math.floor(hash(i, 999) * rgb.length) % rgb.length
      const c = rgb[ci]

      ctx.beginPath()
      ctx.moveTo(startX, startY)

      let px = startX, py = startY
      for (let s = 0; s < steps; s++) {
        const nx = px / w * 3 + t * 0.5
        const ny = py / h * 3 + t * 0.3
        const angle = fbm(nx, ny, 4) * Math.PI * 4

        // Mouse attraction
        const dx = mx * w - px, dy = my * h - py
        const dist = Math.sqrt(dx * dx + dy * dy)
        const pull = Math.max(0, 1 - dist / 200) * 0.5

        px += Math.cos(angle) * 3 + dx * pull * 0.02
        py += Math.sin(angle) * 3 + dy * pull * 0.02
        ctx.lineTo(px, py)
      }

      ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${0.15 + hash(i, 777) * 0.25})`
      ctx.lineWidth = 0.5 + hash(i, 333) * 1.5
      ctx.stroke()
    }

    rafRef.current = requestAnimationFrame(draw)
  }, [colors])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const r = wrapRef.current?.getBoundingClientRect()
      if (r) mouseRef.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }
    }
    window.addEventListener('mousemove', onMove)
    rafRef.current = requestAnimationFrame(draw)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(rafRef.current) }
  }, [draw])

  return (
    <div ref={wrapRef} style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
}

/* ═══════════════════════════════════════════
   ART STYLE 2: Particle Constellation
   Points connected by proximity lines
═══════════════════════════════════════════ */
function Constellation({ colors = BRAND }: { colors?: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef(0)
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; ci: number; size: number }[]>([])
  const mouseRef = useRef({ x: -1, y: -1 })

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')!
    const dpr = Math.min(devicePixelRatio || 1, 2)
    const rgb = colors.map(hexToRgb)

    const resize = () => {
      const w = wrap.clientWidth, h = wrap.clientHeight
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      if (!particlesRef.current.length) {
        const count = Math.min(180, Math.floor(w * h / 4000))
        particlesRef.current = Array.from({ length: count }, () => ({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6,
          ci: Math.floor(Math.random() * rgb.length),
          size: 1.5 + Math.random() * 3,
        }))
      }
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    window.addEventListener('mousemove', onMove)

    const animate = () => {
      const w = wrap.clientWidth, h = wrap.clientHeight
      const pts = particlesRef.current
      const mx = mouseRef.current.x, my = mouseRef.current.y

      ctx.fillStyle = '#131719'
      ctx.fillRect(0, 0, w, h)

      // Update positions
      for (const p of pts) {
        // Mouse repulsion
        if (mx >= 0) {
          const dx = p.x - mx, dy = p.y - my
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            const force = (120 - dist) / 120 * 0.8
            p.vx += (dx / dist) * force
            p.vy += (dy / dist) * force
          }
        }

        p.x += p.vx; p.y += p.vy
        p.vx *= 0.99; p.vy *= 0.99
        if (p.x < 0) { p.x = 0; p.vx *= -1 }
        if (p.x > w) { p.x = w; p.vx *= -1 }
        if (p.y < 0) { p.y = 0; p.vy *= -1 }
        if (p.y > h) { p.y = h; p.vy *= -1 }
      }

      // Draw connections
      const maxDist = 100
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.3
            const c = rgb[pts[i].ci]
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      // Draw particles
      for (const p of pts) {
        const c = rgb[p.ci]
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.8)`
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      window.removeEventListener('mousemove', onMove)
    }
  }, [colors])

  return (
    <div ref={wrapRef} style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
}

/* ═══════════════════════════════════════════
   ART STYLE 3: Concentric Ripples
   Expanding rings from noise-driven origins
═══════════════════════════════════════════ */
function Ripples({ colors = BRAND }: { colors?: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef(0)
  const timeRef = useRef(0)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')!
    const dpr = Math.min(devicePixelRatio || 1, 2)
    const w = wrap.clientWidth, h = wrap.clientHeight
    if (canvas.width !== w * dpr) {
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    timeRef.current += 0.008
    const t = timeRef.current
    const mx = mouseRef.current.x, my = mouseRef.current.y
    const rgb = colors.map(hexToRgb)

    ctx.fillStyle = '#131719'
    ctx.fillRect(0, 0, w, h)

    const centers = 8
    for (let i = 0; i < centers; i++) {
      const cx = (hash(i, 42) * 0.6 + 0.2) * w + Math.sin(t * 0.3 + i) * 40
      const cy = (hash(42, i) * 0.6 + 0.2) * h + Math.cos(t * 0.25 + i * 2) * 30

      // Mouse influence on center
      const dmx = mx * w - cx, dmy = my * h - cy
      const mdist = Math.sqrt(dmx * dmx + dmy * dmy)
      const mshift = Math.max(0, 1 - mdist / 300) * 40
      const acx = cx + (dmx / (mdist || 1)) * mshift
      const acy = cy + (dmy / (mdist || 1)) * mshift

      const c = rgb[i % rgb.length]
      const rings = 12
      for (let r = 0; r < rings; r++) {
        const radius = (r * 30 + t * 20) % (Math.max(w, h) * 0.6)
        const alpha = Math.max(0, 0.4 - radius / (Math.max(w, h) * 0.6) * 0.4)
        ctx.beginPath()
        ctx.arc(acx, acy, radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`
        ctx.lineWidth = 1.5
        ctx.stroke()
      }
    }

    rafRef.current = requestAnimationFrame(draw)
  }, [colors])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const r = wrapRef.current?.getBoundingClientRect()
      if (r) mouseRef.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }
    }
    window.addEventListener('mousemove', onMove)
    rafRef.current = requestAnimationFrame(draw)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(rafRef.current) }
  }, [draw])

  return (
    <div ref={wrapRef} style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
}

/* ═══════════════════════════════════════════
   ART STYLE 4: Woven Mesh
   Interlocking sine waves forming a fabric
═══════════════════════════════════════════ */
function WovenMesh({ colors = BRAND }: { colors?: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef(0)
  const timeRef = useRef(0)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')!
    const dpr = Math.min(devicePixelRatio || 1, 2)
    const w = wrap.clientWidth, h = wrap.clientHeight
    if (canvas.width !== w * dpr) {
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    timeRef.current += 0.003
    const t = timeRef.current
    const mx = mouseRef.current.x, my = mouseRef.current.y
    const rgb = colors.map(hexToRgb)

    ctx.fillStyle = '#131719'
    ctx.fillRect(0, 0, w, h)

    const lines = 40
    const res = 120

    // Horizontal weave
    for (let i = 0; i < lines; i++) {
      const baseY = (i / lines) * h
      const ci = i % rgb.length
      const c = rgb[ci]

      ctx.beginPath()
      for (let s = 0; s <= res; s++) {
        const x = (s / res) * w
        const nx = s / res
        const distToMouse = Math.abs(nx - mx) + Math.abs(i / lines - my)
        const mouseWarp = Math.max(0, 1 - distToMouse / 0.4) * 25

        const y = baseY
          + Math.sin(x * 0.02 + t * 2 + i * 0.5) * (8 + mouseWarp)
          + Math.cos(x * 0.01 + t * 1.3) * 4
          + fbm(nx * 2 + t * 0.3, i * 0.2, 3) * 15

        s === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.25)`
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Vertical weave
    for (let i = 0; i < lines; i++) {
      const baseX = (i / lines) * w
      const ci = (i + 3) % rgb.length
      const c = rgb[ci]

      ctx.beginPath()
      for (let s = 0; s <= res; s++) {
        const y = (s / res) * h
        const ny = s / res
        const distToMouse = Math.abs(i / lines - mx) + Math.abs(ny - my)
        const mouseWarp = Math.max(0, 1 - distToMouse / 0.4) * 25

        const x = baseX
          + Math.sin(y * 0.02 + t * 1.8 + i * 0.5) * (8 + mouseWarp)
          + Math.cos(y * 0.01 + t * 1.1) * 4
          + fbm(i * 0.2, ny * 2 + t * 0.3, 3) * 15

        s === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.2)`
      ctx.lineWidth = 1
      ctx.stroke()
    }

    rafRef.current = requestAnimationFrame(draw)
  }, [colors])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const r = wrapRef.current?.getBoundingClientRect()
      if (r) mouseRef.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }
    }
    window.addEventListener('mousemove', onMove)
    rafRef.current = requestAnimationFrame(draw)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(rafRef.current) }
  }, [draw])

  return (
    <div ref={wrapRef} style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
}

/* ═══════════════════════════════════════════
   ART STYLE 5: Voronoi Cells
   Organic cell-like structures with drift
═══════════════════════════════════════════ */
function VoronoiCells({ colors = BRAND }: { colors?: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef(0)
  const timeRef = useRef(0)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const seedsRef = useRef<{ bx: number; by: number; ci: number }[]>([])

  useEffect(() => {
    const count = 40
    seedsRef.current = Array.from({ length: count }, (_, i) => ({
      bx: hash(i, 11), by: hash(11, i),
      ci: Math.floor(hash(i, 77) * colors.length) % colors.length,
    }))
  }, [colors])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')!
    const dpr = Math.min(devicePixelRatio || 1, 2)
    const w = wrap.clientWidth, h = wrap.clientHeight
    if (canvas.width !== w * dpr) {
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    timeRef.current += 0.003
    const t = timeRef.current
    const mx = mouseRef.current.x * w, my = mouseRef.current.y * h
    const rgb = colors.map(hexToRgb)
    const seeds = seedsRef.current

    // Get current seed positions
    const pts = seeds.map((s, i) => ({
      x: (s.bx + Math.sin(t * 0.4 + i * 1.7) * 0.08) * w,
      y: (s.by + Math.cos(t * 0.35 + i * 2.1) * 0.08) * h,
      ci: s.ci,
    }))

    // Add mouse as attractor
    const cellSize = 4
    const cols = Math.ceil(w / cellSize)
    const rows = Math.ceil(h / cellSize)

    const imgData = ctx.createImageData(w, h)
    const data = imgData.data

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const px = col * cellSize + cellSize / 2
        const py = row * cellSize + cellSize / 2

        let minDist = Infinity, minDist2 = Infinity, ci = 0
        for (let i = 0; i < pts.length; i++) {
          const dx = px - pts[i].x, dy = py - pts[i].y
          const d = dx * dx + dy * dy
          if (d < minDist) { minDist2 = minDist; minDist = d; ci = pts[i].ci }
          else if (d < minDist2) { minDist2 = d }
        }

        const edge = Math.sqrt(minDist2) - Math.sqrt(minDist)
        const isEdge = edge < 3

        // Mouse glow
        const dmx = px - mx, dmy = py - my
        const mDist = Math.sqrt(dmx * dmx + dmy * dmy)
        const glow = Math.max(0, 1 - mDist / 150) * 0.3

        const c = rgb[ci]

        // Fill cells with color blocks
        for (let dy = 0; dy < cellSize && row * cellSize + dy < h; dy++) {
          for (let dx = 0; dx < cellSize && col * cellSize + dx < w; dx++) {
            const pi = ((row * cellSize + dy) * w + col * cellSize + dx) * 4
            if (isEdge) {
              data[pi] = c.r; data[pi + 1] = c.g; data[pi + 2] = c.b
              data[pi + 3] = Math.floor((0.6 + glow) * 255)
            } else {
              data[pi] = c.r; data[pi + 1] = c.g; data[pi + 2] = c.b
              data[pi + 3] = Math.floor((0.06 + glow * 0.5) * 255)
            }
          }
        }
      }
    }

    ctx.fillStyle = '#131719'
    ctx.fillRect(0, 0, w, h)
    ctx.putImageData(imgData, 0, 0)

    rafRef.current = requestAnimationFrame(draw)
  }, [colors])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const r = wrapRef.current?.getBoundingClientRect()
      if (r) mouseRef.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }
    }
    window.addEventListener('mousemove', onMove)
    rafRef.current = requestAnimationFrame(draw)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(rafRef.current) }
  }, [draw])

  return (
    <div ref={wrapRef} style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
}

/* ═══════════════════════════════════════════
   ART STYLE 6: Spiral Galaxy
   Logarithmic spirals with particle trails
═══════════════════════════════════════════ */
function SpiralGalaxy({ colors = BRAND }: { colors?: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef(0)
  const timeRef = useRef(0)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')!
    const dpr = Math.min(devicePixelRatio || 1, 2)
    const w = wrap.clientWidth, h = wrap.clientHeight
    if (canvas.width !== w * dpr) {
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    timeRef.current += 0.004
    const t = timeRef.current
    const mx = mouseRef.current.x, my = mouseRef.current.y
    const rgb = colors.map(hexToRgb)

    // Fade trail instead of clear
    ctx.fillStyle = 'rgba(19, 23, 25, 0.08)'
    ctx.fillRect(0, 0, w, h)

    const cx = w / 2 + (mx - 0.5) * 100
    const cy = h / 2 + (my - 0.5) * 100
    const arms = 5
    const pointsPerArm = 300

    for (let a = 0; a < arms; a++) {
      const armAngle = (a / arms) * Math.PI * 2
      const c = rgb[a % rgb.length]

      for (let i = 0; i < pointsPerArm; i++) {
        const progress = i / pointsPerArm
        const r = progress * Math.min(w, h) * 0.45
        const theta = armAngle + progress * 4 + t * 0.5 + Math.sin(t + i * 0.05) * 0.2
        const spread = (1 + fbm(i * 0.03 + t * 0.1, a * 10, 3) * 0.5) * (5 + progress * 20)

        const px = cx + Math.cos(theta) * r + (hash(i, a) - 0.5) * spread
        const py = cy + Math.sin(theta) * r + (hash(a, i) - 0.5) * spread

        const size = 0.5 + (1 - progress) * 2.5
        const alpha = (1 - progress * 0.7) * 0.6

        ctx.beginPath()
        ctx.arc(px, py, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`
        ctx.fill()
      }
    }

    rafRef.current = requestAnimationFrame(draw)
  }, [colors])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const r = wrapRef.current?.getBoundingClientRect()
      if (r) mouseRef.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }
    }
    window.addEventListener('mousemove', onMove)
    rafRef.current = requestAnimationFrame(draw)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(rafRef.current) }
  }, [draw])

  return (
    <div ref={wrapRef} style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
}

/* ═══════════════════════════════════════════
   ART STYLE 7: Terrain Contour
   Topographic map-style contour lines
═══════════════════════════════════════════ */
function TerrainContour({ colors = BRAND }: { colors?: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef(0)
  const timeRef = useRef(0)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')!
    const dpr = Math.min(devicePixelRatio || 1, 2)
    const w = wrap.clientWidth, h = wrap.clientHeight
    if (canvas.width !== w * dpr) {
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    timeRef.current += 0.002
    const t = timeRef.current
    const mx = mouseRef.current.x, my = mouseRef.current.y
    const rgb = colors.map(hexToRgb)

    ctx.fillStyle = '#131719'
    ctx.fillRect(0, 0, w, h)

    const step = 3
    const cols = Math.ceil(w / step)
    const rows = Math.ceil(h / step)
    const levels = 12

    // Build height map
    const heightMap: number[] = new Array(cols * rows)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const nx = c / cols * 4 + t * 0.3
        const ny = r / rows * 4 + t * 0.15
        let val = fbm(nx, ny, 5)

        // Mouse hill
        const dx = c / cols - mx, dy = r / rows - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        val += Math.max(0, 1 - dist / 0.25) * 0.3

        heightMap[r * cols + c] = val
      }
    }

    // Draw contours via marching squares (simplified — draw horizontal scan)
    for (let level = 0; level < levels; level++) {
      const threshold = level / levels
      const c = rgb[level % rgb.length]

      ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${0.15 + (level / levels) * 0.25})`
      ctx.lineWidth = 0.8

      for (let r = 0; r < rows - 1; r++) {
        let drawing = false
        ctx.beginPath()
        for (let col = 0; col < cols - 1; col++) {
          const v = heightMap[r * cols + col]
          const vr = heightMap[r * cols + col + 1]

          if ((v >= threshold && vr < threshold) || (v < threshold && vr >= threshold)) {
            const frac = (threshold - v) / (vr - v)
            const px = (col + frac) * step
            const py = r * step

            if (!drawing) { ctx.moveTo(px, py); drawing = true }
            else { ctx.lineTo(px, py) }
          } else {
            drawing = false
          }
        }
        ctx.stroke()
      }
    }

    rafRef.current = requestAnimationFrame(draw)
  }, [colors])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const r = wrapRef.current?.getBoundingClientRect()
      if (r) mouseRef.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }
    }
    window.addEventListener('mousemove', onMove)
    rafRef.current = requestAnimationFrame(draw)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(rafRef.current) }
  }, [draw])

  return (
    <div ref={wrapRef} style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
}

/* ═══════════════════════════════════════════
   ART STYLE 8: Moiré Interference
   Overlapping circular patterns creating moiré
═══════════════════════════════════════════ */
function MoirePattern({ colors = WARM }: { colors?: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef(0)
  const timeRef = useRef(0)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')!
    const dpr = Math.min(devicePixelRatio || 1, 2)
    const w = wrap.clientWidth, h = wrap.clientHeight
    if (canvas.width !== w * dpr) {
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    timeRef.current += 0.004
    const t = timeRef.current
    const mx = mouseRef.current.x * w, my = mouseRef.current.y * h
    const rgb = colors.map(hexToRgb)

    ctx.fillStyle = '#131719'
    ctx.fillRect(0, 0, w, h)

    const centers = [
      { x: w * 0.35 + Math.sin(t * 0.5) * 50, y: h * 0.4 + Math.cos(t * 0.4) * 30 },
      { x: w * 0.65 + Math.cos(t * 0.6) * 40, y: h * 0.6 + Math.sin(t * 0.45) * 35 },
      { x: mx, y: my },
    ]

    ctx.globalCompositeOperation = 'screen'

    for (let ci = 0; ci < centers.length; ci++) {
      const c = rgb[ci % rgb.length]
      const cx = centers[ci].x, cy = centers[ci].y
      const ringSpacing = 8 + Math.sin(t * 0.3 + ci) * 2
      const maxR = Math.max(w, h) * 0.8

      ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.12)`
      ctx.lineWidth = 1.2

      for (let r = ringSpacing; r < maxR; r += ringSpacing) {
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    ctx.globalCompositeOperation = 'source-over'
    rafRef.current = requestAnimationFrame(draw)
  }, [colors])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const r = wrapRef.current?.getBoundingClientRect()
      if (r) mouseRef.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }
    }
    window.addEventListener('mousemove', onMove)
    rafRef.current = requestAnimationFrame(draw)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(rafRef.current) }
  }, [draw])

  return (
    <div ref={wrapRef} style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
}

/* ═══════════════════════════════════════════
   GALLERY PAGE
═══════════════════════════════════════════ */

const VIDEOS = [
  { src: '/aura-hero.mp4', label: 'Hero' },
  { src: '/aura-agroculture.mp4', label: 'Agroculture' },
  { src: '/aura-artistry.mp4', label: 'Artistry' },
  { src: '/aura-reason.mp4', label: 'Reason' },
  { src: '/aura-sanctuary.mp4', label: 'Sanctuary' },
]

const ART_STYLES = [
  { id: 'flow', label: 'Flow Field', Component: FlowField },
  { id: 'constellation', label: 'Constellation', Component: Constellation },
  { id: 'ripples', label: 'Ripples', Component: Ripples },
  { id: 'woven', label: 'Woven Mesh', Component: WovenMesh },
  { id: 'voronoi', label: 'Voronoi Cells', Component: VoronoiCells },
  { id: 'spiral', label: 'Spiral Galaxy', Component: SpiralGalaxy },
  { id: 'terrain', label: 'Terrain Contour', Component: TerrainContour },
  { id: 'moire', label: 'Moiré Pattern', Component: MoirePattern },
] as const

const PALETTES = [
  { id: 'brand', label: 'Brand', colors: BRAND },
  { id: 'warm', label: 'Warm', colors: WARM },
  { id: 'cool', label: 'Cool', colors: COOL },
  { id: 'mono', label: 'Mono', colors: ['#FFFFFF'] },
]

export default function ArtPage() {
  const [view, setView] = useState<'gallery' | 'video' | 'fullscreen'>('gallery')
  const [selectedArt, setSelectedArt] = useState(0)
  const [paletteIdx, setPaletteIdx] = useState(0)
  const [videoIdx, setVideoIdx] = useState(0)
  const [cellSize, setCellSize] = useState(10)
  const [sparsity, setSparsity] = useState(0.40)

  const pal = PALETTES[paletteIdx]
  const art = ART_STYLES[selectedArt]

  return (
    <div style={{ background: '#131719', minHeight: '100vh', paddingTop: 56 }}>
      {/* Controls */}
      <div style={{
        padding: '16px var(--gutter)',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        flexWrap: 'wrap',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        zIndex: 10,
      }}>
        {/* View toggle */}
        <span className="label">View</span>
        {(['gallery', 'video', 'fullscreen'] as const).map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, padding: '4px 10px',
            border: '1px solid var(--border-strong)', borderRadius: 3,
            background: view === v ? 'rgba(128,128,128,0.15)' : 'transparent',
            color: view === v ? 'var(--text)' : 'var(--text-muted)',
            textTransform: 'capitalize',
          }}>{v}</button>
        ))}

        <div style={{ width: 1, height: 20, background: 'var(--border)' }} />

        <span className="label">Palette</span>
        {PALETTES.map((p, i) => (
          <button key={p.id} onClick={() => setPaletteIdx(i)} style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, padding: '4px 10px',
            border: '1px solid var(--border-strong)', borderRadius: 3,
            background: paletteIdx === i ? 'rgba(128,128,128,0.15)' : 'transparent',
            color: paletteIdx === i ? 'var(--text)' : 'var(--text-muted)',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ display: 'flex', gap: 2 }}>
              {p.colors.slice(0, 4).map((c, j) => (
                <span key={j} style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block' }} />
              ))}
            </span>
            {p.label}
          </button>
        ))}

        {view === 'video' && (
          <>
            <div style={{ width: 1, height: 20, background: 'var(--border)' }} />
            <span className="label">Video</span>
            {VIDEOS.map((v, i) => (
              <button key={v.src} onClick={() => setVideoIdx(i)} style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, padding: '4px 10px',
                border: '1px solid var(--border-strong)', borderRadius: 3,
                background: videoIdx === i ? 'rgba(128,128,128,0.15)' : 'transparent',
                color: videoIdx === i ? 'var(--text)' : 'var(--text-muted)',
              }}>{v.label}</button>
            ))}

            <div style={{ width: 1, height: 20, background: 'var(--border)' }} />
            <span className="label">Grid</span>
            {[6, 8, 10, 14, 20].map(s => (
              <button key={s} onClick={() => setCellSize(s)} style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, padding: '4px 8px',
                border: '1px solid var(--border-strong)', borderRadius: 3,
                background: cellSize === s ? 'rgba(128,128,128,0.15)' : 'transparent',
                color: cellSize === s ? 'var(--text)' : 'var(--text-muted)',
              }}>{s}px</button>
            ))}

            <div style={{ width: 1, height: 20, background: 'var(--border)' }} />
            <span className="label">Density</span>
            {[
              { v: 0.30, l: 'Dense' }, { v: 0.40, l: 'Medium' },
              { v: 0.50, l: 'Sparse' }, { v: 0.58, l: 'Minimal' },
            ].map(d => (
              <button key={d.v} onClick={() => setSparsity(d.v)} style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, padding: '4px 10px',
                border: '1px solid var(--border-strong)', borderRadius: 3,
                background: sparsity === d.v ? 'rgba(128,128,128,0.15)' : 'transparent',
                color: sparsity === d.v ? 'var(--text)' : 'var(--text-muted)',
              }}>{d.l}</button>
            ))}
          </>
        )}
      </div>

      {/* Gallery view — grid of all art styles */}
      {view === 'gallery' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          gap: 1,
          background: 'var(--border)',
        }}>
          {ART_STYLES.map((a, i) => (
            <div
              key={a.id}
              onClick={() => { setSelectedArt(i); setView('fullscreen') }}
              style={{
                position: 'relative',
                aspectRatio: '16/10',
                background: '#131719',
                cursor: 'pointer',
                overflow: 'hidden',
              }}
            >
              <a.Component colors={pal.colors} />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '24px 20px 16px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                pointerEvents: 'none',
              }}>
                <span className="label" style={{ color: '#fff', letterSpacing: '0.1em' }}>{a.label}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video-reactive view */}
      {view === 'video' && (
        <VideoReactiveArt
          key={`${VIDEOS[videoIdx].src}-${cellSize}-${sparsity}`}
          src={VIDEOS[videoIdx].src}
          cellSize={cellSize}
          sparsity={sparsity}
          reactivity={0.12}
          colors={pal.colors}
          style={{ height: 'calc(100vh - 56px - 53px)' }}
        />
      )}

      {/* Fullscreen single art */}
      {view === 'fullscreen' && (
        <div style={{ position: 'relative', height: 'calc(100vh - 56px - 53px)' }}>
          <art.Component colors={pal.colors} />

          {/* Navigation arrows */}
          <button
            onClick={() => setSelectedArt((selectedArt - 1 + ART_STYLES.length) % ART_STYLES.length)}
            style={{
              position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%', width: 44, height: 44,
              color: '#fff', fontSize: 20, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >&#8249;</button>
          <button
            onClick={() => setSelectedArt((selectedArt + 1) % ART_STYLES.length)}
            style={{
              position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%', width: 44, height: 44,
              color: '#fff', fontSize: 20, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >&#8250;</button>

          <div style={{
            position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: 8, padding: '8px 16px',
            background: 'rgba(0,0,0,0.5)', borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            {ART_STYLES.map((a, i) => (
              <button
                key={a.id}
                onClick={() => setSelectedArt(i)}
                style={{
                  width: 8, height: 8, borderRadius: '50%', border: 'none',
                  background: i === selectedArt ? '#E37128' : 'rgba(255,255,255,0.3)',
                  cursor: 'pointer', padding: 0,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
