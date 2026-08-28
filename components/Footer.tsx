'use client'

import Link from 'next/link'

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
          {/* The legal link lives in the manifesto column so it shares
              that column's left edge on desktop, and `margin-top: auto`
              drops it to the foot of the row — level with the bottom of
              the Locations clocks, since grid columns stretch to the
              tallest. On one column it has nowhere to drop to, so it is
              lifted to the top right instead, on the manifesto's line. */}
          <div className="footer-manifesto-col">
            <div className="footer-manifesto-head">
              <h2 className="footer-manifesto-title">A 1,000 Year Idea</h2>
              <p className="label" style={{ marginTop: 'var(--space-3)' }}>Think in generations</p>
            </div>
            <Link href="/privacy" className="label footer-privacy">Privacy Policy</Link>
          </div>
          <div>
            <p className="label" style={{ marginBottom: 'var(--space-3)' }}>Contact</p>
            <a href="mailto:hello@theaura.life" className="p1">hello@theaura.life</a>
          </div>
          <div>
            <p className="label" style={{ marginBottom: 'var(--space-3)' }}>Follow us</p>
            <a href="https://www.instagram.com/theaura.life/" target="_blank" rel="noopener noreferrer" className="p1" style={{ display: 'block' }}>Instagram</a>
            {/* Not a social account, but this is where a reader who wants
                more of Aura rather than more of the estate is already
                looking. Internal, so it uses next/link and opens in place. */}
            <Link href="/brand" className="p1" style={{ display: 'block', marginTop: 'var(--space-2)' }}>Our Brand</Link>
          </div>
          <div>
            <p className="label" style={{ marginBottom: 'var(--space-4)' }}>Locations</p>
            <div className="flex flex-wrap gap-6">
              {[
                { city: 'SGP', tz: 'Asia/Singapore' },
                { city: 'IND', tz: 'Asia/Kolkata' },
                { city: 'BTN', tz: 'Asia/Thimphu' },
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
          /* The one link in the footer set at label size. Muted until
             hovered, like every other quiet link on the site. */
          /* space-between rather than margin-top:auto on the link.
             auto resolves against free space, and this column is
             usually the tallest one in the row — so there was no free
             space and the used value came out 0. space-between bottoms
             the link out whenever another column (the clocks, once they
             wrap) makes the row taller, and changes nothing when they
             are level. */
          .footer-manifesto-col {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
          }
          .footer-manifesto-head { display: block; }
          /* .footer-privacy is NOT here. It sits on a next/link, and a
             styled-jsx rule targeting one compiles to .class.jsx-hash
             against an element that never receives the hash — so it
             matches nothing and fails silently. Every declaration for it
             lives in globals.css. See DESIGN-SYSTEM.md section 13. */
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
          /* The wordmark aspect is 225/710 ≈ 0.317, and this band's height is
             `paddingBottom` × its width. 0.90 × 0.317 ≈ 0.285 reveals the top
             90 % of the wordmark, cropping the rest below the fold. */
          paddingBottom: '28.5%',
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
