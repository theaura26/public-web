'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Reveal from '@/components/RevealOnScroll'
import { useMode } from '@/components/ModeProvider'

/* ═══════════════════════════════════════════
   GENERATIVE ART — Organic noise field
   Brand colours. Reacts to mouse cursor.
═══════════════════════════════════════════ */

const BRAND_COLORS = [
  '#CA4926', // Dry Osmosis
  '#DD7C37', // Red Honey
  '#E4B239', // Banana Wash
  '#E1ADA2', // Solera Maceration
  '#A5B6C8', // Solera Wash
  '#B6B050', // Grappa
  '#7A7C5C', // Volcanic
  '#FFFFFF', // Appassimento
]

function hash(x: number, y: number) {
  let h = x * 374761393 + y * 668265263
  h = (h ^ (h >> 13)) * 1274126177
  return ((h ^ (h >> 16)) & 0x7fffffff) / 0x7fffffff
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t)
}

function noise2D(x: number, y: number) {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const fx = smoothstep(x - ix)
  const fy = smoothstep(y - iy)
  const a = hash(ix, iy)
  const b = hash(ix + 1, iy)
  const c = hash(ix, iy + 1)
  const d = hash(ix + 1, iy + 1)
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy
}

function fbm(x: number, y: number, octaves: number) {
  let val = 0
  let amp = 0.5
  let freq = 1
  for (let i = 0; i < octaves; i++) {
    val += amp * noise2D(x * freq, y * freq)
    amp *= 0.5
    freq *= 2
  }
  return val
}

// Parse hex to RGB
function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

const BRAND_RGB = BRAND_COLORS.map(hexToRgb)

function GenerativeCanvas({ style }: { style?: React.CSSProperties }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const timeRef = useRef(0)
  const rafRef = useRef(0)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const rect = canvas.getBoundingClientRect()
    const w = rect.width
    const h = rect.height

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.scale(dpr, dpr)
    }

    timeRef.current += 0.003
    const t = timeRef.current
    const mx = mouseRef.current.x
    const my = mouseRef.current.y

    const cellSize = Math.max(8, Math.floor(w / 80))
    const cols = Math.ceil(w / cellSize) + 1
    const rows = Math.ceil(h / cellSize) + 1

    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#131719'
    ctx.fillRect(0, 0, w, h)

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
          // Pick colour from brand palette based on a second noise layer
          const colorNoise = fbm(col * 0.06 + t * 0.1, row * 0.06 + t * 0.08, 3)
          const colorIdx = Math.floor(colorNoise * BRAND_RGB.length) % BRAND_RGB.length
          const c = BRAND_RGB[Math.abs(colorIdx)]
          ctx.fillStyle = `rgb(${c.r},${c.g},${c.b})`
          ctx.fillRect(px, py, cellSize - 1, cellSize - 1)
        }
      }
    }

    rafRef.current = requestAnimationFrame(draw)
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
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
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', height: '100%', ...style }}
    />
  )
}


/* ═══════════════════════════════════════════
   HERO BANNER — Scroll-expanding
   Desktop: 16:9 → fullscreen on scroll
   Mobile: 3:4 → fullscreen on scroll
═══════════════════════════════════════════ */

const INTELLIGENCES = ['Natural', 'Ancient', 'Human', 'Machine']

function HeroBanner() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const wrapRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  // Word cycling
  useEffect(() => {
    const cycle = () => {
      setVisible(false)
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % INTELLIGENCES.length)
        setVisible(true)
      }, 400)
    }
    const interval = setInterval(cycle, 2800)
    return () => clearInterval(interval)
  }, [])

  // Scroll-driven expansion
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        const wrap = wrapRef.current
        const inner = innerRef.current
        const card = cardRef.current
        if (!wrap || !inner || !card) return

        const rect = wrap.getBoundingClientRect()
        const zone = wrap.offsetHeight - window.innerHeight
        if (zone <= 0) return
        const raw = Math.max(0, Math.min(1, -rect.top / zone))
        // Smoothstep easing
        const p = raw * raw * (3 - 2 * raw)

        // Padding shrinks → card expands to fill viewport
        const navPad = 56 * (1 - p)
        const sidePad = 48 * (1 - p)

        inner.style.padding = `${navPad}px ${sidePad}px 0`
        card.style.maxWidth = p < 1 ? `calc((100vh - 56px - 96px + ${p * 96}px) * 16 / 9)` : 'none'
        card.style.aspectRatio = p > 0.9 ? 'auto' : ''
        card.style.height = p > 0.9 ? '100%' : 'auto'
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={wrapRef} className="human-only" style={{ height: '160vh', position: 'relative' }}>
      <div
        ref={innerRef}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '56px 48px 0',
          boxSizing: 'border-box',
        }}
      >
        <div
          ref={cardRef}
          className="brand-hero-card"
          style={{
            width: '100%',
            maxWidth: 'calc((100vh - 56px - 96px) * 16 / 9)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Generative art background */}
          <GenerativeCanvas style={{ position: 'absolute', inset: 0 }} />

          {/* Text overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            pointerEvents: 'none',
          }}>
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(52px, 11vw, 140px)',
              fontWeight: 400,
              color: '#fff',
              letterSpacing: '-2px',
              lineHeight: 1.0,
              textAlign: 'center',
              mixBlendMode: 'difference',
            }}>
              <span
                style={{
                  display: 'inline-block',
                  transition: 'opacity 0.4s ease, transform 0.4s ease',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(12px)',
                }}
              >
                {INTELLIGENCES[index]}
              </span>
              <br />
              Intelligence
            </h1>
          </div>
        </div>
      </div>

      <style jsx>{`
        .brand-hero-card {
          aspect-ratio: 16 / 9;
        }
        @media (max-width: 767px) {
          .brand-hero-card {
            aspect-ratio: 3 / 4;
            max-width: none !important;
          }
        }
      `}</style>
    </div>
  )
}


/* ═══════════════════════════════════════════
   COPY SECTION — Editorial interstitial
═══════════════════════════════════════════ */

function CopySection({ headline, children }: {
  headline: string
  children?: React.ReactNode
}) {
  return (
    <Reveal>
      <section style={{
        padding: 'clamp(100px, 14vh, 180px) var(--gutter)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{
            lineHeight: 1.15,
            marginBottom: children ? 28 : 0,
          }}>{headline}</h2>
          {children && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {children}
            </div>
          )}
        </div>
      </section>
    </Reveal>
  )
}


/* ═══════════════════════════════════════════
   SLIDE GRID — SIT-style 3D tilt cards
   No slide numbers. 1px crop.
   Mobile: single column, tighter gaps.
═══════════════════════════════════════════ */

function TiltCard({ children, index: i }: { children: React.ReactNode; index: number }) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / (r.width / 2)))
    const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / (r.height / 2)))
    const dist = Math.min(1, Math.hypot(dx, dy) / 1.1)
    const strength = Math.max(0, 1 - dist)
    el.style.setProperty('--ry', `${dx * 2 * strength}deg`)
    el.style.setProperty('--rx', `${-dy * 1.6 * strength}deg`)
    el.style.setProperty('--tz', `${strength * 6}px`)
  }, [])

  const onLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--ry', '0deg')
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--tz', '0px')
  }, [])

  return (
    <Reveal delay={i * 60}>
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1920 / 1080',
          background: 'var(--bg)',
          borderRadius: 3,
          overflow: 'hidden',
          transformStyle: 'preserve-3d',
          transform: 'translateZ(var(--tz, 0px)) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))',
          transition: 'transform 0.55s cubic-bezier(0.2, 0.9, 0.3, 1), box-shadow 0.55s ease',
          willChange: 'transform',
          boxShadow: '0 1px 2px rgba(0,0,0,0.06), 0 12px 32px rgba(0,0,0,0.10), 0 32px 80px rgba(0,0,0,0.06)',
        }}
      >
        {children}
      </div>
    </Reveal>
  )
}

function SlideGrid({ from, to, skip }: { from: number; to: number; skip?: number[] }) {
  const skipSet = new Set(skip || [])
  const pages = Array.from({ length: to - from + 1 }, (_, i) => from + i).filter(p => !skipSet.has(p))

  return (
    <div className="human-only brand-slide-grid-wrap">
      <div className="brand-slide-grid">
        {pages.map((pg, idx) => {
          const n = String(pg).padStart(2, '0')
          return (
            <TiltCard key={pg} index={idx}>
              <img
                src={`/brand-slides/slide-${n}.jpg`}
                alt=""
                loading={idx < 4 ? 'eager' : 'lazy'}
                draggable={false}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              />
            </TiltCard>
          )
        })}
      </div>

      <style jsx>{`
        .brand-slide-grid-wrap {
          padding: clamp(20px, 3vw, 40px) clamp(12px, 2vw, 32px) clamp(60px, 10vw, 120px);
          perspective: 3600px;
          perspective-origin: 50% 50%;
        }
        .brand-slide-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px 24px;
          transform-style: preserve-3d;
        }
        @media (max-width: 767px) {
          .brand-slide-grid-wrap {
            padding: 12px 6px 40px;
          }
          .brand-slide-grid {
            gap: 10px 8px;
          }
        }
      `}</style>
    </div>
  )
}


/* ═══════════════════════════════════════════
   AGENT MODE — Plain text brand summary
═══════════════════════════════════════════ */

function AgentBrandView() {
  return (
    <div className="agent-only" style={{ padding: '120px var(--gutter) 80px', maxWidth: 720, margin: '0 auto' }}>
      <p style={{ marginBottom: 32, color: 'var(--text-muted)', fontSize: 14 }}>~/aura/brand</p>

      <h2 style={{ marginBottom: 24 }}>Brand Identity System</h2>
      <div className="p2" style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
        <p>Aura is a regenerative ecosystem for monastic polymaths where Ancestral Intelligence and Creative Capital are deployed across 100 years.</p>
        <p>The brand identity is built around three intelligences: Natural, Human, and Machine. Design language favours silence over noise, depth over width, memory over trend.</p>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 32, marginBottom: 48 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>brand_principles</p>
        <div className="p2" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p>- Rhythm over Speed</p>
          <p>- Depth over Width</p>
          <p>- Silence over Noise</p>
          <p>- Memory over Trend</p>
          <p>- Quality before Quantity</p>
          <p>- Think 10 years ahead</p>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 32, marginBottom: 48 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>brand_colours</p>
        <div className="p2" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {BRAND_COLORS.map((c, i) => (
            <p key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>
              <span style={{ display: 'inline-block', width: 12, height: 12, background: c, borderRadius: 2, marginRight: 8, verticalAlign: 'middle', border: c === '#FFFFFF' ? '1px solid var(--border)' : 'none' }} />
              {c} — {['Dry Osmosis', 'Red Honey', 'Banana Wash', 'Solera Maceration', 'Solera Wash', 'Grappa', 'Volcanic', 'Appassimento'][i]}
            </p>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 32, marginBottom: 48 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>typography</p>
        <div className="p2" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p>Display — Instrument Serif, 400</p>
          <p>Body — DM Sans, 400</p>
          <p>Mono — DM Mono, 400</p>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 32, marginBottom: 48 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>three_pillars</p>
        <div className="p2" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p>Sanctuary — Silence, stillness, Japanese garden, forest walks</p>
          <p>Agroculture — 100 acres coffee, 43 indigenous cattle, native canopy</p>
          <p>Artistry — Studios, workshops, gallery, festivals</p>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 32, marginBottom: 48 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>method</p>
        <div className="p2" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p>1. Soil Comes First</p>
          <p>2. Do Small Work Properly</p>
          <p>3. No Shortcuts</p>
          <p>4. Quality Before Quantity</p>
          <p>5. Think 10 Years Ahead</p>
          <p>6. Leaders Must Be on the Field</p>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 32 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>closing</p>
        <p className="p2">The choices made by one generation shape a thousand that follow.</p>
      </div>
    </div>
  )
}


/* ═══════════════════════════════════════════
   BRAND PAGE
   Copy → Brand → Copy → Story → Copy
═══════════════════════════════════════════ */
export default function BrandPage() {
  const { theme } = useMode()
  const logoSrc = theme === 'day' ? '/aura-lite.svg' : '/aura-dark.svg'

  return (
    <div style={{ background: 'var(--bg)' }}>

      {/* ═══ AGENT MODE — plain text ═══ */}
      <AgentBrandView />

      {/* ═══ HERO BANNER — scroll-expanding ═══ */}
      <HeroBanner />

      {/* ═══ BRANDMARK + COPY ═══ */}
      <Reveal>
        <section className="human-only" style={{
          padding: 'clamp(100px, 14vh, 180px) var(--gutter)',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <div style={{ marginBottom: 48, display: 'flex', justifyContent: 'center' }}>
              <img
                src={logoSrc}
                alt=""
                style={{
                  width: 96,
                  height: 96,
                  display: 'block',
                  background: 'transparent',
                }}
              />
            </div>
            <h2 style={{
              lineHeight: 1.15,
              marginBottom: 28,
            }}>Aura is a regenerative ecosystem for monastic polymaths where Ancestral Intelligence and Creative Capital are deployed across 100 years.</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p className="p2">The following pages set out the fundamentals of the Aura brand identity. It demonstrates how the brand assets work together to create a consistent and coherent brand across all touch points.</p>
              <p className="p2">They cover both the practical aspects of how to use our design elements, and the more intangible aspects such as what Aura represents, our values and how you should express them.</p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══ BRAND GUIDELINES — Pages 1–21 ═══ */}
      <SlideGrid from={1} to={21} skip={[6, 11, 15, 16, 18, 20, 21]} />

      {/* ═══ COPY ═══ */}
      <CopySection
        headline="Rhythm of the Land"
      >
        <p className="p2">Rhythm over Speed. We don&rsquo;t rush. We follow the rhythm of the land or the internal rhythm of a project, much like the Aura philosophy.</p>
        <p className="p2">Depth over Width. Silence over Noise. Memory over Trend. We build for the long memory. No trend-chasing. No seasonal pivots. Every decision is tested against time.</p>
      </CopySection>

      {/* ═══ STORIES — Pages 22–50 ═══ */}
      <SlideGrid from={22} to={50} skip={[31, 37, 40, 41, 49]} />

      {/* ═══ COPY ═══ */}
      <CopySection
        headline="What will become rare is not intelligence. What will become rare is wisdom."
      >
        <p className="p2">The farmer of three thousand years ago had the knowledge. The founder of 2026 has the tools. Aura joins them. Three intelligences — Artificial, Human, and Natural — woven into a single ecosystem.</p>
        <p className="p2">Ecological order. Adaptation. Rhythm. Pattern. Living systems wisdom. Older than both artificial and human intelligence.</p>
      </CopySection>

      {/* ═══ STORIES — Pages 51–75 ═══ */}
      <SlideGrid from={51} to={75} skip={[54, 55, 57, 58, 60, 62, 75]} />

      {/* ═══ COPY ═══ */}
      <CopySection
        headline="Soil Comes First. Do Small Work Properly. No Shortcuts. Quality Before Quantity. Think 10 Years Ahead."
      >
        <p className="p2">Six rules. English and Kannada. Every work shed. Be on the land. Be fair. Do the work properly. Leaders must be on the field.</p>
      </CopySection>

      {/* ═══ STORIES — Pages 76–94 ═══ */}
      <SlideGrid from={76} to={94} skip={[76, 85, 89, 91, 92, 93, 94]} />

      {/* ═══ CLOSING ═══ */}
      <CopySection
        headline="The choices made by one generation shape a thousand that follow."
      />

    </div>
  )
}
