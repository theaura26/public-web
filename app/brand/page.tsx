'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Reveal from '@/components/RevealOnScroll'
import { ScrollHighlight } from '@/components/article/Article'
import VideoReactiveArt from '@/components/VideoReactiveArt'
import { useMode } from '@/components/ModeProvider'
import gsap from 'gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrambleTextPlugin)
}

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
  const wordRef = useRef<HTMLSpanElement>(null)
  const [useFallback, setUseFallback] = useState(false)

  /* Scramble cycle — ScrambleTextPlugin tweens between the four
     intelligences, glyph by glyph. We bypass React state for the word so the
     plugin owns the DOM text during the scramble; only the font swap (Pixelify
     for "Machine") is applied directly to the element style at tween start. */
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null
    let i = 0

    const applyFont = (word: string) => {
      const el = wordRef.current
      if (!el) return
      el.style.fontFamily =
        word === 'Machine' ? 'var(--font-pixel), var(--font-grotesque)' : 'inherit'
    }

    if (wordRef.current) {
      wordRef.current.textContent = INTELLIGENCES[0]
      applyFont(INTELLIGENCES[0])
    }

    const cycle = () => {
      if (!wordRef.current) return
      i = (i + 1) % INTELLIGENCES.length
      const next = INTELLIGENCES[i]
      applyFont(next)
      gsap.to(wordRef.current, {
        duration: 1.1,
        scrambleText: {
          text: next,
          /* Scramble through organic / botanical unicode glyphs instead of
             random alphanumerics — visually echoes the vector-shape
             vocabulary used by the reactive-art canvas behind the text:
             florals, asterisks, dots, rings. The intermediate frames now
             read as the same family of marks as the background scatter,
             not random Latin letters. */
          chars: '✦✺❋❀✿✻✼❁●◯◉◍✧✷✸',
          speed: 0.5,
          revealDelay: 0.2,
        },
        ease: 'none',
      })
      timer = setTimeout(cycle, 2800)
    }
    timer = setTimeout(cycle, 2800)

    return () => {
      if (timer) clearTimeout(timer)
      if (wordRef.current) gsap.killTweensOf(wordRef.current)
    }
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
              fontFamily: 'var(--font-grotesque)',
              fontSize: 'clamp(52px, 11vw, 140px)',
              fontWeight: 400,
              color: 'var(--text)',
              letterSpacing: '-0.035em',
              lineHeight: 1.0,
              textAlign: 'center',
            }}>
              <span
                ref={wordRef}
                style={{ display: 'inline-block' }}
              >
                {INTELLIGENCES[0]}
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
    <section style={{
      padding: 'clamp(100px, 14vh, 180px) var(--gutter)',
    }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <ScrollHighlight maxWidth={880}>{headline}</ScrollHighlight>
        {children && (
          <Reveal>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 28 }}>
              {children}
            </div>
          </Reveal>
        )}
      </div>
    </section>
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
          transition: 'transform 0.55s var(--ease-out), box-shadow 0.55s var(--ease)',
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
        @media (max-width: 768px) {
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
    <section className="agent-only">
      <h1>Brand</h1>
      <p>Aura is a regenerative ecosystem for monastic polymaths where Ancestral Intelligence and Creative Capital are deployed across 100 years.</p>
      <p>The brand identity is built around three intelligences: Natural, Human, and Machine. Design language favours silence over noise, depth over width, memory over trend.</p>

      <hr />

      <h2>Brand Principles</h2>
      <ul>
        <li>Rhythm over Speed</li>
        <li>Depth over Width</li>
        <li>Silence over Noise</li>
        <li>Memory over Trend</li>
        <li>Quality before Quantity</li>
        <li>Think 10 years ahead</li>
      </ul>

      <hr />

      <h2>Brand Colours</h2>
      <ul>
        {BRAND_COLORS.map((c, i) => (
          <li key={i}>
            {c} — {['Dry Osmosis', 'Red Honey', 'Banana Wash', 'Solera Maceration', 'Solera Wash', 'Grappa', 'Volcanic', 'Appassimento'][i]}
          </li>
        ))}
      </ul>

      <hr />

      <h2>Typography</h2>
      <ul>
        <li>Display — Instrument Serif, 400</li>
        <li>Body — DM Sans, 400</li>
        <li>Mono — DM Mono, 400</li>
      </ul>

      <hr />

      <h2>Three Pillars</h2>
      <ul>
        <li>Sanctuary — Silence, stillness, Japanese garden, forest walks</li>
        <li>Agroculture — 100 acres coffee, 43 indigenous cattle, native canopy</li>
        <li>Artistry — Studios, workshops, gallery, festivals</li>
      </ul>

      <hr />

      <h2>Method</h2>
      <ul>
        <li>Soil Comes First</li>
        <li>Do Small Work Properly</li>
        <li>No Shortcuts</li>
        <li>Quality Before Quantity</li>
        <li>Think 10 Years Ahead</li>
        <li>Leaders Must Be on the Field</li>
      </ul>

      <hr />

      <h2>Closing</h2>
      <p>The choices made by one generation shape a thousand that follow.</p>
    </section>
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
      <section className="human-only" style={{
        padding: 'clamp(100px, 14vh, 180px) var(--gutter)',
      }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <Reveal>
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
          </Reveal>
          <ScrollHighlight maxWidth={880}>{`Aura is a regenerative ecosystem for monastic polymaths where Ancestral Intelligence and Creative Capital are deployed across 100 years.`}</ScrollHighlight>
          <Reveal>
            <div style={{
              maxWidth: 720,
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              marginTop: 'var(--space-7)',
            }}>
              <p className="p2" style={{ margin: 0 }}>
                The following pages set out the fundamentals of the Aura
                brand identity. It demonstrates how the brand assets work
                together to create a consistent and coherent brand across
                all touch points.
              </p>
              <p className="p2" style={{ margin: 0 }}>
                They cover both the practical aspects of how to use our
                design elements, and the more intangible aspects such as
                what Aura represents, our values and how you should
                express them.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ BRAND GUIDELINES — Pages 1–21 ═══ */}
      <SlideGrid from={1} to={21} skip={[6, 11, 15, 16, 18, 20, 21]} />

      {/* ═══ COPY ═══ */}
      <CopySection
        headline={`Rhythm over speed.
Depth over width.
Silence over noise.
Memory over trend.`}
      />

      {/* ═══ STORIES — Pages 22–50 ═══ */}
      <SlideGrid from={22} to={50} skip={[31, 37, 40, 41, 49]} />

      {/* ═══ COPY ═══ */}
      <CopySection
        headline={`What will become rare is not intelligence.
What will become rare is wisdom.`}
      />

      {/* ═══ STORIES — Pages 51–75 ═══ */}
      <SlideGrid from={51} to={75} skip={[54, 55, 57, 58, 60, 62, 75]} />

      {/* ═══ COPY ═══ */}
      <CopySection
        headline={`Soil comes first.
Do small work properly.
No shortcuts.
Quality before quantity.
Think ten years ahead.`}
      />

      {/* ═══ STORIES — Pages 76–94 ═══ */}
      <SlideGrid from={76} to={94} skip={[76, 85, 89, 91, 92, 93, 94]} />

      {/* ═══ CLOSING ═══ */}
      <CopySection
        headline="The choices made by one generation shape the future that follows."
      />

    </div>
  )
}
