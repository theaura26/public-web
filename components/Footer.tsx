'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, useCallback } from 'react'
import { LogoEmblem } from './Logo'
import VideoReactiveArt from './VideoReactiveArt'
import { useMode } from './ModeProvider'

function AnalogClock({ tz, size = 64 }: { tz: string; size?: number }) {
  const [angles, setAngles] = useState({ h: 0, m: 0 })
  useEffect(() => {
    const update = () => {
      const str = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: tz })
      const [h, m] = str.split(':').map(Number)
      setAngles({ h: (h % 12) * 30 + m * 0.5, m: m * 6 })
    }
    update()
    const i = setInterval(update, 10000)
    return () => clearInterval(i)
  }, [tz])
  const r = size / 2
  const c = r
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" style={{ flexShrink: 0 }}>
      <circle cx={c} cy={c} r={r - 1.5} stroke="var(--text-muted)" strokeWidth={1} />
      <line x1={c} y1={c} x2={c + r * 0.42 * Math.sin(angles.h * Math.PI / 180)} y2={c - r * 0.42 * Math.cos(angles.h * Math.PI / 180)} stroke="var(--text)" strokeWidth={2} strokeLinecap="round" />
      <line x1={c} y1={c} x2={c + r * 0.62 * Math.sin(angles.m * Math.PI / 180)} y2={c - r * 0.62 * Math.cos(angles.m * Math.PI / 180)} stroke="var(--text-muted)" strokeWidth={1.2} strokeLinecap="round" />
      <circle cx={c} cy={c} r={2} fill="var(--text)" />
    </svg>
  )
}

export default function Footer() {
  const { theme } = useMode()
  const logoSrc = theme === 'day' ? '/aura-lite.svg' : '/aura-dark.svg'
  const fogRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const rafRef = useRef<number>(0)
  const seedRef = useRef(0)

  const animateFog = useCallback(() => {
    seedRef.current += 0.003
    const t = seedRef.current
    const mx = mouseRef.current.x
    const my = mouseRef.current.y

    if (fogRef.current) {
      const el = fogRef.current
      // Organic drift influenced by mouse position
      const dx = Math.sin(t * 0.7) * 8 + (mx - 0.5) * 30
      const dy = Math.cos(t * 0.5) * 4 + (my - 0.5) * 15
      const scale = 1 + Math.sin(t * 0.3) * 0.05 + (1 - my) * 0.08
      el.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`

      // Shift fog opacity based on mouse proximity to bottom
      const proximity = Math.max(0, my - 0.3) / 0.7 // 0 at top, 1 at bottom
      el.style.opacity = `${0.5 + proximity * 0.5}`
    }

    rafRef.current = requestAnimationFrame(animateFog)
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      }
    }
    window.addEventListener('mousemove', onMove)
    rafRef.current = requestAnimationFrame(animateFog)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [animateFog])

  return (
    <footer style={{ position: 'relative', overflow: 'hidden', background: 'var(--bg)', marginTop: 200 }}>
      {/* Art2 — sits above footer, anchored to the divider line, fades upward */}
      <div style={{ position: 'relative', height: 'clamp(250px, 40vh, 450px)', pointerEvents: 'none' }}>
        <VideoReactiveArt
          src="/aura-hero.mp4"
          overlay
          cellSize={10}
          opacity={0.6}
          sparsity={0.42}
          reactivity={0.1}
          colors={['#FFFFFF']}
          style={{ position: 'absolute', inset: 0 }}
        />
        {/* Fade to bg at top */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
          background: 'linear-gradient(to bottom, var(--bg) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Divider */}
      <div style={{ padding: '0 var(--gutter)', position: 'relative', zIndex: 2 }}><div style={{ height: 1, background: 'var(--border)' }} /></div>

      {/* Content */}
      <div style={{ padding: '64px var(--gutter) 80px', position: 'relative', zIndex: 2 }}>
        <div style={{ marginBottom: 32 }}>
          <img src={logoSrc} alt="" width={48} height={48} style={{ display: 'block', background: 'transparent' }} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5" style={{ gap: 'clamp(24px, 3vw, 48px)', rowGap: 40 }}>
          <div>
            <p className="label" style={{ marginBottom: 10 }}>Contact</p>
            <a href="/contact" className="p1">hello@theaura.life</a>
          </div>
          <div>
            <p className="label" style={{ marginBottom: 10 }}>Follow us</p>
            <a href="https://www.instagram.com/theaura.life/" target="_blank" rel="noopener noreferrer" className="p1" style={{ display: 'block' }}>Instagram</a>
          </div>
          <div>
            <p className="label" style={{ marginBottom: 10 }}>Journal</p>
            <Link href="/brand" className="p1" style={{ display: 'block', lineHeight: 1.8 }}>Our Brand</Link>
          </div>
          <div className="col-span-2">
            <p className="label" style={{ marginBottom: 16 }}>Locations</p>
            <div className="flex flex-wrap gap-8">
              {[
                { city: 'SGP', tz: 'Asia/Singapore' },
                { city: 'IND', tz: 'Asia/Kolkata' },
                { city: 'JPN', tz: 'Asia/Tokyo' },
                { city: 'IDN', tz: 'Asia/Jakarta' },
                { city: 'AUS', tz: 'Australia/Melbourne' },
              ].map((loc) => (
                <div key={loc.city} className="flex flex-col items-center" style={{ gap: 8 }}>
                  <AnalogClock tz={loc.tz} />
                  <span className="p1">{loc.city}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mega wordmark with feathered backdrop blur + reactive fog */}
      <div
        aria-hidden
        style={{
          overflow: 'hidden',
          paddingBottom: '20%',
          position: 'relative',
          pointerEvents: 'none',
        }}
      >
        {/* SVG filter for fog distortion */}
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <filter id="fog-turbulence">
              <feTurbulence type="fractalNoise" baseFrequency="0.012 0.008" numOctaves={3} seed={2} result="noise">
                <animate attributeName="baseFrequency" values="0.012 0.008;0.018 0.012;0.012 0.008" dur="12s" repeatCount="indefinite" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale={40} xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            color: 'rgba(255,255,255,0.55)',
          }}
        >
          <LogoEmblem size={2000} className="footer-logo-scale" />
          <style jsx>{`
            div :global(.footer-logo-scale) {
              width: 100% !important;
              height: auto !important;
            }
          `}</style>
        </div>

        {/* Feathered backdrop-filter blur — reduced intensity */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60%',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 70%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 70%)',
          }}
        />

        {/* Mouse-reactive fog layers */}
        <div
          ref={fogRef}
          style={{
            position: 'absolute',
            bottom: '-20%',
            left: '-30%',
            width: '160%',
            height: '80%',
            pointerEvents: 'none',
            filter: 'url(#fog-turbulence)',
            opacity: 0.85,
            willChange: 'transform, opacity',
          }}
        >
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse 70% 50% at 20% 70%, rgba(255,255,255,0.14) 0%, transparent 60%),
              radial-gradient(ellipse 80% 60% at 60% 80%, rgba(255,255,255,0.10) 0%, transparent 50%),
              radial-gradient(ellipse 50% 40% at 80% 60%, rgba(255,255,255,0.12) 0%, transparent 55%),
              radial-gradient(ellipse 90% 70% at 40% 90%, rgba(255,255,255,0.08) 0%, transparent 65%)
            `,
          }} />
        </div>

        {/* Second fog layer — slower, offset */}
        <div
          style={{
            position: 'absolute',
            bottom: '-10%',
            left: '-20%',
            width: '140%',
            height: '60%',
            pointerEvents: 'none',
            opacity: 0.7,
          }}
        >
          <style jsx>{`
            div {
              background: radial-gradient(ellipse 60% 45% at 35% 75%, rgba(255,255,255,0.12) 0%, transparent 55%),
                          radial-gradient(ellipse 70% 55% at 75% 85%, rgba(255,255,255,0.09) 0%, transparent 50%);
              animation: fog-drift-slow 25s ease-in-out infinite alternate;
            }
            @keyframes fog-drift-slow {
              0% { transform: translateX(-5%) scale(1); }
              50% { transform: translateX(8%) scale(1.03); }
              100% { transform: translateX(-2%) scale(0.98); }
            }
          `}</style>
        </div>
      </div>
    </footer>
  )
}
