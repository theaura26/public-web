'use client'

/* Route-segment error boundary. React render errors caught here don't reach
   window.onerror, so `capture_exceptions` autocapture misses them — report them
   to PostHog Error Tracking explicitly. */

import { useEffect } from 'react'
import { captureError } from '@/lib/analytics'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    captureError(error, { boundary: 'route', digest: error.digest })
  }, [error])

  return (
    <main
      style={{
        minHeight: '62vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        padding: '80px 24px',
        textAlign: 'center',
      }}
    >
      <p style={{ fontFamily: 'var(--font-mono, monospace)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: 11, opacity: 0.55, margin: 0 }}>
        Something went wrong
      </p>
      <h1 style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontWeight: 400, fontSize: 'clamp(28px, 5vw, 44px)', margin: 0 }}>
        This page hit a snag.
      </h1>
      <p style={{ maxWidth: '44ch', opacity: 0.7, margin: 0 }}>
        It has been logged. Try again, or head back to the homepage.
      </p>
      <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
        <button
          type="button"
          onClick={() => reset()}
          style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', padding: '12px 22px', borderRadius: 999, border: '1px solid currentColor', background: 'transparent', color: 'inherit', cursor: 'pointer' }}
        >
          Try again
        </button>
        <a href="/" style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', padding: '12px 22px', alignSelf: 'center', textDecoration: 'underline' }}>
          Home
        </a>
      </div>
    </main>
  )
}
