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

      {/* Content */}
      <div style={{ padding: '64px var(--gutter) 80px', position: 'relative', zIndex: 2 }}>
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 'clamp(24px, 3vw, 48px)', rowGap: 40 }}>
          <div>
            <p className="label" style={{ marginBottom: 10 }}>Contact</p>
            <a href="/contact" className="p1">hello@theaura.life</a>
          </div>
          <div>
            <p className="label" style={{ marginBottom: 10 }}>Follow us</p>
            <a href="https://www.instagram.com/theaura.life/" target="_blank" rel="noopener noreferrer" className="p1" style={{ display: 'block' }}>Instagram</a>
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

      {/* Mega wordmark — clean, no fog or blur */}
      <div
        aria-hidden
        style={{
          overflow: 'hidden',
          paddingBottom: '20%',
          position: 'relative',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            color: theme === 'day' ? '#F2F2F2' : 'rgba(255,255,255,0.55)',
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
      </div>
    </footer>
  )
}
