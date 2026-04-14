'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { LogoEmblem } from './Logo'

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
  return (
    <footer style={{ position: 'relative', overflow: 'hidden', background: 'var(--bg)', marginTop: 200 }}>
      {/* Divider */}
      <div style={{ padding: '0 var(--gutter)' }}><div style={{ height: 1, background: 'var(--border)' }} /></div>

      {/* Content */}
      <div style={{ padding: '64px var(--gutter) 80px', position: 'relative', zIndex: 2 }}>
        <div style={{ marginBottom: 32 }}>
          <img src="/aura-animated.svg" alt="" width={48} height={48} style={{ display: 'block', background: 'transparent' }} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5" style={{ gap: 'clamp(24px, 3vw, 48px)', rowGap: 40 }}>
          <div>
            <p className="label" style={{ marginBottom: 10 }}>Contact</p>
            <a href="mailto:hello@theaura.life" className="p1" style={{ textDecoration: 'none' }}>hello@theaura.life</a>
          </div>
          <div>
            <p className="label" style={{ marginBottom: 10 }}>Follow us</p>
            <a href="#" className="p1" style={{ textDecoration: 'none', display: 'block' }}>Instagram</a>
          </div>
          <div>
            <p className="label" style={{ marginBottom: 10 }}>Journal</p>
            <Link href="/reason" className="p1" style={{ textDecoration: 'none', display: 'block', lineHeight: 1.8 }}>Index</Link>
            <a href="#" className="p1" style={{ textDecoration: 'none', display: 'block', lineHeight: 1.8 }}>Our Brand</a>
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

      {/* Mega wordmark with feathered backdrop blur */}
      <div
        aria-hidden
        style={{
          overflow: 'hidden',
          paddingBottom: '22%',
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
            color: '#ffffff',
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
        {/* Feathered backdrop-filter blur */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60%',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 70%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 70%)',
          }}
        />
        {/* Animated fog */}
        <div className="footer-fog" style={{ position: 'absolute', bottom: 0, left: '-50%', width: '200%', height: '50%', pointerEvents: 'none' }}>
          <style jsx>{`
            .footer-fog {
              background: radial-gradient(ellipse 80% 60% at 30% 80%, rgba(255,255,255,0.04) 0%, transparent 70%),
                          radial-gradient(ellipse 60% 50% at 70% 90%, rgba(255,255,255,0.03) 0%, transparent 60%);
              animation: fog-drift 20s ease-in-out infinite alternate;
            }
            @keyframes fog-drift {
              0% { transform: translateX(0%); }
              100% { transform: translateX(15%); }
            }
          `}</style>
        </div>
      </div>
    </footer>
  )
}
