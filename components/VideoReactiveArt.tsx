'use client'

import { useEffect, useRef, useCallback } from 'react'

/* ═══════════════════════════════════════════
   VIDEO-REACTIVE COMPUTATIONAL ART
   Organic clusters of geometric primitives
   that read video and react to motion + mouse.
   Uses noise fields for non-uniform density.
═══════════════════════════════════════════ */

const PALETTE = [
  '#CA4926', // Dry Osmosis
  '#DD7C37', // Red Honey
  '#E4B239', // Banana Wash
  '#E1ADA2', // Solera Maceration
  '#A5B6C8', // Solera Wash
  '#B6B050', // Grappa
  '#7A7C5C', // Volcanic
  '#FFFFFF', // Appassimento
  '#E37128', // Brand accent
]

type ShapeType = 'circle' | 'cross' | 'rect' | 'dot' | 'ring' | 'dash' | 'diamond'
const SHAPES: ShapeType[] = ['circle', 'cross', 'rect', 'dot', 'ring', 'dash', 'diamond']

/* ── Noise functions ── */
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

interface CellState {
  shape: ShapeType
  colorIdx: number
  phase: number
  energy: number
  targetEnergy: number
  motionAccum: number
  baseSize: number
}

interface Props {
  /** Video element to read from (external — e.g. existing hero video) */
  videoRef?: React.RefObject<HTMLVideoElement | null>
  /** OR provide a src and the component creates its own video */
  src?: string
  cellSize?: number
  opacity?: number
  /** Transparent background — for overlaying on video */
  overlay?: boolean
  bg?: string
  reactivity?: number
  /** Noise threshold — higher = more sparse (0-1, default 0.38) */
  sparsity?: number
  /** React to mouse movement */
  mouse?: boolean
  /** Override color palette */
  colors?: string[]
  className?: string
  style?: React.CSSProperties
}

export default function VideoReactiveArt({
  videoRef: externalVideoRef,
  src,
  cellSize = 12,
  opacity = 1,
  overlay = false,
  bg = '#131719',
  reactivity = 0.12,
  sparsity = 0.38,
  mouse = false,
  colors,
  className,
  style,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const internalVideoRef = useRef<HTMLVideoElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const prevFrameRef = useRef<Uint8ClampedArray | null>(null)
  const cellsRef = useRef<CellState[]>([])
  const gridRef = useRef({ cols: 0, rows: 0 })
  const timeRef = useRef(0)
  const rafRef = useRef(0)
  const mouseRef = useRef({ x: -1, y: -1 }) // normalised 0-1, -1 = offscreen

  const pal = colors ?? PALETTE

  const initCells = useCallback((cols: number, rows: number) => {
    const cells: CellState[] = []
    for (let i = 0; i < cols * rows; i++) {
      const col = i % cols, row = Math.floor(i / cols)
      const sNoise = fbm(col * 0.08 + 100, row * 0.08 + 100, 3)
      const cNoise = fbm(col * 0.06 + 200, row * 0.06 + 200, 3)
      cells.push({
        shape: SHAPES[Math.floor(sNoise * SHAPES.length) % SHAPES.length],
        colorIdx: Math.floor(cNoise * pal.length) % pal.length,
        phase: Math.random() * Math.PI * 2,
        energy: 0,
        targetEnergy: 0,
        motionAccum: 0,
        baseSize: 0.35 + sNoise * 0.55,
      })
    }
    return cells
  }, [pal])

  // Mouse tracking
  useEffect(() => {
    if (!mouse) return
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const onMove = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect()
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      }
    }
    const onLeave = () => { mouseRef.current = { x: -1, y: -1 } }

    window.addEventListener('mousemove', onMove)
    wrapper.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      wrapper.removeEventListener('mouseleave', onLeave)
    }
  }, [mouse])

  useEffect(() => {
    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    if (!canvas || !wrapper) return

    const video = externalVideoRef?.current ?? internalVideoRef.current

    // Start internal video if we created one
    if (!externalVideoRef && internalVideoRef.current && src) {
      const v = internalVideoRef.current
      v.src = src
      v.muted = true
      v.loop = true
      v.playsInline = true
      v.play().catch(() => {})
    }

    const sampler = document.createElement('canvas')
    const ctx = canvas.getContext('2d', { alpha: overlay })!
    const sCtx = sampler.getContext('2d', { willReadFrequently: true })!

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = wrapper.clientWidth
      const h = wrapper.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const cols = Math.ceil(w / cellSize)
      const rows = Math.ceil(h / cellSize)
      sampler.width = cols
      sampler.height = rows

      if (cols !== gridRef.current.cols || rows !== gridRef.current.rows) {
        gridRef.current = { cols, rows }
        cellsRef.current = initCells(cols, rows)
        prevFrameRef.current = null
      }
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrapper)

    const drawShape = (
      ctx: CanvasRenderingContext2D,
      x: number, y: number, s: number,
      shape: ShapeType, color: string, alpha: number
    ) => {
      ctx.globalAlpha = alpha
      ctx.fillStyle = color
      ctx.strokeStyle = color
      ctx.lineWidth = Math.max(1, s * 0.14)
      const half = s / 2

      switch (shape) {
        case 'circle':
          ctx.beginPath()
          ctx.arc(x + half, y + half, half * 0.85, 0, Math.PI * 2)
          ctx.fill()
          break
        case 'ring':
          ctx.beginPath()
          ctx.arc(x + half, y + half, half * 0.75, 0, Math.PI * 2)
          ctx.stroke()
          break
        case 'cross': {
          const arm = s * 0.12
          const ext = half * 0.8
          ctx.fillRect(x + half - arm, y + half - ext, arm * 2, ext * 2)
          ctx.fillRect(x + half - ext, y + half - arm, ext * 2, arm * 2)
          break
        }
        case 'rect':
          ctx.fillRect(x + s * 0.12, y + s * 0.12, s * 0.76, s * 0.76)
          break
        case 'dot':
          ctx.beginPath()
          ctx.arc(x + half, y + half, half * 0.3, 0, Math.PI * 2)
          ctx.fill()
          break
        case 'dash':
          ctx.fillRect(x + s * 0.1, y + half - s * 0.08, s * 0.8, s * 0.16)
          break
        case 'diamond':
          ctx.beginPath()
          ctx.moveTo(x + half, y + s * 0.1)
          ctx.lineTo(x + s * 0.9, y + half)
          ctx.lineTo(x + half, y + s * 0.9)
          ctx.lineTo(x + s * 0.1, y + half)
          ctx.closePath()
          ctx.fill()
          break
      }
    }

    const animate = () => {
      const { cols, rows } = gridRef.current
      const cells = cellsRef.current
      const w = wrapper.clientWidth
      const h = wrapper.clientHeight

      if (!cols || !rows || !cells.length) {
        rafRef.current = requestAnimationFrame(animate)
        return
      }

      timeRef.current += 0.016
      const t = timeRef.current
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const mouseActive = mouse && mx >= 0 && my >= 0

      // Sample video
      if (video && video.readyState >= 2) {
        sCtx.drawImage(video, 0, 0, cols, rows)
        const frame = sCtx.getImageData(0, 0, cols, rows)
        const data = frame.data
        const prev = prevFrameRef.current

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const i = row * cols + col
            const pi = i * 4
            const r = data[pi], g = data[pi + 1], b = data[pi + 2]
            const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255

            let motion = 0
            if (prev) {
              const pr = prev[pi], pg = prev[pi + 1], pb = prev[pi + 2]
              motion = (Math.abs(r - pr) + Math.abs(g - pg) + Math.abs(b - pb)) / (255 * 3)
            }

            const cell = cells[i]
            cell.motionAccum = cell.motionAccum * 0.92 + motion * 3.5
            cell.motionAccum = Math.min(cell.motionAccum, 1.5)

            // Noise field — organic clusters
            const noiseX = col * 0.04 + t * 0.15 + Math.sin(t * 0.3) * 0.5
            const noiseY = row * 0.04 + t * 0.08 + Math.cos(t * 0.25) * 0.3
            const density = fbm(noiseX, noiseY, 4)

            // Mouse influence — radiate energy from cursor
            let mouseBoost = 0
            if (mouseActive) {
              const nx = col / cols
              const ny = row / rows
              const dx = nx - mx
              const dy = ny - my
              const dist = Math.sqrt(dx * dx + dy * dy)
              mouseBoost = Math.max(0, 1 - dist / 0.25) * 0.6
            }

            const alive = (density > sparsity || mouseBoost > 0.1) ? 1 : 0

            cell.targetEnergy = alive * Math.min(1, brightness * 0.5 + cell.motionAccum * 0.9 + mouseBoost)

            // Mutate on motion
            if (motion > 0.06) {
              if (Math.random() < motion * 2.5) {
                cell.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)]
              }
              if (Math.random() < motion * 1.8) {
                cell.colorIdx = Math.random() < 0.6
                  ? Math.floor(Math.random() * 4)
                  : Math.floor(Math.random() * pal.length)
              }
            }

            // Mouse proximity — mutate shapes near cursor
            if (mouseActive && mouseBoost > 0.3 && Math.random() < 0.02) {
              cell.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)]
              cell.colorIdx = Math.random() < 0.5
                ? Math.floor(Math.random() * 4) // warm bias
                : Math.floor(Math.random() * pal.length)
            }

            // Slow organic drift
            if (Math.random() < 0.0008) {
              const cNoise = fbm(col * 0.06 + t * 0.3, row * 0.06 + t * 0.2, 3)
              cell.colorIdx = Math.floor(cNoise * pal.length) % pal.length
            }
            if (Math.random() < 0.0004) {
              const sNoise = fbm(col * 0.08 + t * 0.2, row * 0.08 + t * 0.15, 3)
              cell.shape = SHAPES[Math.floor(sNoise * SHAPES.length) % SHAPES.length]
            }
          }
        }

        prevFrameRef.current = new Uint8ClampedArray(data)
      }

      // Render
      if (overlay) {
        ctx.clearRect(0, 0, w, h)
      } else {
        ctx.fillStyle = bg
        ctx.fillRect(0, 0, w, h)
      }

      const cs = cellSize
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const i = row * cols + col
          const cell = cells[i]

          cell.energy += (cell.targetEnergy - cell.energy) * reactivity

          if (cell.energy < 0.03) continue

          const x = col * cs
          const y = row * cs

          const pulse = 1 + Math.sin(t * 1.2 + cell.phase) * 0.1 * cell.energy
          const sizeNoise = 0.8 + fbm(col * 0.1 + t * 0.05, row * 0.1, 2) * 0.5
          const drawSize = cs * cell.baseSize * pulse * sizeNoise

          const color = pal[cell.colorIdx]
          const alpha = Math.min(1, cell.energy * 1.3) * opacity

          const ox = x + (cs - drawSize) / 2
          const oy = y + (cs - drawSize) / 2

          drawShape(ctx, ox, oy, drawSize, cell.shape, color, alpha)
        }
      }

      ctx.globalAlpha = 1
      rafRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [src, externalVideoRef, cellSize, bg, reactivity, opacity, overlay, sparsity, mouse, initCells])

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        ...style,
      }}
    >
      {!externalVideoRef && src && (
        <video
          ref={internalVideoRef}
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
        />
      )}
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </div>
  )
}
