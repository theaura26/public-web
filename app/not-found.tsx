'use client'

import Link from 'next/link'
import { LogoEmblem } from '@/components/Logo'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--gutter)',
      textAlign: 'center',
      gap: 32,
    }}>
      <LogoEmblem size={120} className="" />
      <div>
        <h1 style={{ fontSize: 'clamp(48px, 10vw, 96px)', lineHeight: 1, marginBottom: 16 }}>404</h1>
        <p className="p2" style={{ maxWidth: 360, margin: '0 auto' }}>
          This page doesn't exist yet. Some things take generations.
        </p>
      </div>
      <Link
        href="/"
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 13,
          padding: '8px 24px',
          border: '1px solid var(--border-strong)',
          borderRadius: 3,
          color: 'var(--text)',
          textDecoration: 'none',
          transition: 'background 0.2s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--text-dim)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        Return home
      </Link>
    </div>
  )
}
