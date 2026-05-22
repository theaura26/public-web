'use client'

import { useEffect, useState } from 'react'
import { LogoEmblem } from './Logo'
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
  const footerBg = 'var(--bg)'

  return (
    <footer style={{ position: 'relative', overflow: 'hidden', background: footerBg }}>
      {/* Divider */}
      <div style={{ padding: '0 var(--gutter)', position: 'relative', zIndex: 2 }}><div style={{ height: 1, background: 'var(--border)' }} /></div>

      {/* Content — 4-col on desktop, 1-col on mobile.
          Manifesto sits FAR LEFT on desktop (col-span-1) and lands TOP LEFT
          on mobile (first stacked row). Then Contact, Follow Us, Locations. */}
      <div style={{ padding: 'var(--space-8) var(--gutter) var(--space-9)', position: 'relative', zIndex: 2 }}>
        <div className="grid grid-cols-1 md:grid-cols-4" style={{ gap: 'clamp(24px, 3vw, 48px)', rowGap: 'var(--space-7)' }}>
          <div className="footer-manifesto-col">
            <h2 className="footer-manifesto-title">A 1,000 Year Idea</h2>
            <p className="label" style={{ marginTop: 'var(--space-3)' }}>Think in generations</p>
          </div>
          <div>
            <p className="label" style={{ marginBottom: 'var(--space-3)' }}>Contact</p>
            <a href="/contact" className="p1">hello@theaura.life</a>
          </div>
          <div>
            <p className="label" style={{ marginBottom: 'var(--space-3)' }}>Follow us</p>
            <a href="https://www.instagram.com/theaura.life/" target="_blank" rel="noopener noreferrer" className="p1" style={{ display: 'block' }}>Instagram</a>
          </div>
          <div>
            <p className="label" style={{ marginBottom: 'var(--space-4)' }}>Locations</p>
            <div className="flex flex-wrap gap-6">
              {[
                { city: 'SGP', tz: 'Asia/Singapore' },
                { city: 'IND', tz: 'Asia/Kolkata' },
                { city: 'JPN', tz: 'Asia/Tokyo' },
              ].map((loc) => (
                <div key={loc.city} className="flex flex-col items-center" style={{ gap: 'var(--space-2)' }}>
                  <AnalogClock tz={loc.tz} size={48} />
                  <span className="p1">{loc.city}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <style jsx>{`
          /* Manifesto reads as a quiet continuation of the body copy rather
             than a section title — same sans family as p1, lighter weight,
             same baseline color. The "label" sub below picks up the existing
             mono-uppercase treatment so they read as a paired signature. */
          .footer-manifesto-title {
            font-family: var(--font-sans);
            font-size: clamp(20px, 2.2vw, 28px);
            line-height: 1.35;
            letter-spacing: -0.035em;
            font-weight: 400;
            color: var(--text);
            margin: 0;
          }
        `}</style>
      </div>

      {/* Mega wordmark + manifesto signature. The watermark fills the
          bottom band and the closing manifesto sits absolutely positioned
          in its bottom-left corner — small display heading + mono lead,
          so it reads as a quiet signature rather than a section. */}
      <div
        style={{
          overflow: 'hidden',
          paddingBottom: '20%',
          position: 'relative',
          pointerEvents: 'none',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            color: theme === 'day' ? '#F2F2F2' : 'rgba(255,255,255,0.55)',
          }}
        >
          <LogoEmblem size={2000} className="footer-logo-scale" />
        </div>
        <style jsx>{`
          div :global(.footer-logo-scale) {
            width: 100% !important;
            height: auto !important;
          }
        `}</style>
      </div>
    </footer>
  )
}
