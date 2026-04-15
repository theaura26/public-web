'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoWordmark } from './Logo'
import { useMode } from './ModeProvider'
import { User, Robot } from '@phosphor-icons/react'

const NAV_BTN: React.CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontSize: 13,
  fontWeight: 400,
  letterSpacing: 0.2,
  padding: '5px 16px',
  border: '1px solid var(--border-strong)',
  borderRadius: 3,
  lineHeight: '20px',
  whiteSpace: 'nowrap',
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { setTheme, viewMode, setViewMode } = useMode()
  const pathname = usePathname()
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return
      if (e.key === 'd' || e.key === 'D') setTheme('night')
      if (e.key === 'l' || e.key === 'L') setTheme('day')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setTheme])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  const isAgent = viewMode === 'agent'

  const links = isAgent ? [
    { href: '/', label: '/' },
    { href: '/reason', label: '/reason' },
    { href: '/land', label: '/land' },
    { href: '/contact', label: '/contact' },
  ] : [
    { href: '/', label: 'Home' },
    { href: '/reason', label: 'Reason' },
    { href: '/land', label: 'The Land' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          padding: '0 var(--gutter)',
          background: 'var(--nav-bg)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          height: 56,
          borderBottom: '1px solid var(--border)',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
        }}
      >
        <Link href="/" className="no-underline" style={{ color: 'var(--text)', justifySelf: 'start' }}>
          {isAgent ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>~/aura</span> : <LogoWordmark />}
        </Link>

        {/* Center: desktop nav links / mobile hamburger */}
        <div style={{ justifySelf: 'center' }}>
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  ...NAV_BTN,
                  color: pathname === link.href ? 'var(--text)' : 'var(--text-muted)',
                  background: pathname === link.href ? 'var(--text-dim)' : 'transparent',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <button
            className="md:hidden flex flex-col gap-[5px] p-1.5"
            style={{ background: 'none', border: 'none' }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="block w-5 h-[1.5px]" style={{ background: 'var(--text)', transition: 'all 0.2s ease', transform: menuOpen ? 'translateY(3.25px) rotate(45deg)' : 'none' }} />
            <span className="block w-5 h-[1.5px]" style={{ background: 'var(--text)', transition: 'all 0.2s ease', transform: menuOpen ? 'translateY(-3.25px) rotate(-45deg)' : 'none' }} />
          </button>
        </div>

        {/* Right: toggle */}
        <div className="flex items-center" style={{ justifySelf: 'end', border: '1px solid var(--border-strong)', borderRadius: 3, overflow: 'hidden' }}>
          {[
            { key: 'human' as const, icon: <User size={14} weight="regular" /> },
            { key: 'agent' as const, icon: <Robot size={14} weight="regular" /> },
          ].map((v, i) => (
            <button
              key={v.key}
              onClick={() => setViewMode(v.key)}
              title={v.key}
              style={{
                fontSize: 13,
                padding: '4px 8px',
                border: 'none',
                borderRight: i === 0 ? '1px solid var(--border-strong)' : 'none',
                background: viewMode === v.key ? 'rgba(128,128,128,0.12)' : 'transparent',
                color: viewMode === v.key ? 'var(--text)' : 'var(--text-dim)',
                cursor: 'none',
                lineHeight: '16px',
              }}
            >
              {v.icon}
            </button>
          ))}
        </div>
      </nav>

      {menuOpen && (
        <div
          className="fixed left-0 right-0 z-40 md:hidden"
          style={{
            top: 56,
            background: 'var(--nav-bg)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            padding: 'var(--gutter)',
            animation: 'dropdown-in 0.2s ease-out',
          }}
        >
          <style jsx>{`
            @keyframes dropdown-in {
              from { opacity: 0; transform: translateY(-8px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="p1"
                style={{
                  padding: '12px 0',
                  borderBottom: link.href !== '/contact' ? '1px solid var(--border)' : 'none',
                  color: pathname === link.href ? 'var(--text)' : 'var(--text-muted)',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
