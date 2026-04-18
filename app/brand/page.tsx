'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Reveal from '@/components/RevealOnScroll'
import VideoReactiveArt from '@/components/VideoReactiveArt'
import { useMode } from '@/components/ModeProvider'

const BRAND_COLORS = [
  '#CA4926', '#DD7C37', '#E4B239', '#E1ADA2',
  '#A5B6C8', '#B6B050', '#7A7C5C', '#FFFFFF',
]

/* ═══════════════════════════════════════════
   HERO BANNER — Scroll-expanding
   Desktop: 16:9 → fullscreen on scroll
   Mobile: 3:4 → fullscreen on scroll
═══════════════════════════════════════════ */

const INTELLIGENCES = ['Natural', 'Ancient', 'Human', 'Machine']

function HeroBanner() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const [useFallback, setUseFallback] = useState(false)

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

  // Detect low-power / reduced-motion / autoplay-blocked → use static image fallback
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setUseFallback(true)
      return
    }
    // Probe autoplay capability with a tiny silent video
    const probe = document.createElement('video')
    probe.muted = true
    probe.playsInline = true
    probe.src = '/aura-hero.mp4'
    probe.style.position = 'fixed'
    probe.style.opacity = '0'
    probe.style.pointerEvents = 'none'
    probe.style.width = '1px'
    probe.style.height = '1px'
    document.body.appendChild(probe)
    probe.play()
      .then(() => { probe.pause(); probe.remove() })
      .catch(() => { setUseFallback(true); probe.remove() })
  }, [])

  return (
    <div className="human-only" style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
          {useFallback ? (
            <img
              src="/aura-hero.jpg"
              alt="Aura — natural intelligence in motion"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <VideoReactiveArt
              src="/aura-hero.mp4"
              overlay
              cellSize={8}
              opacity={1}
              sparsity={0.38}
              reactivity={0.14}
              mouse
              colors={['#E8421A', '#F07820', '#F5B810', '#8AAEE0', '#D4C020', '#7A9040']}
              style={{ position: 'absolute', inset: 0 }}
            />
          )}

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
              color: 'var(--text)',
              letterSpacing: '-2px',
              lineHeight: 1.0,
              textAlign: 'center',
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
                alt={`Aura brand guideline, slide ${n}`}
                width={1920}
                height={1080}
                loading="lazy"
                decoding="async"
                fetchPriority="low"
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
                alt="Aura logo"
                decoding="async"
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
