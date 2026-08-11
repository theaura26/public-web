'use client'

/* Root error boundary — replaces the whole document (including the layout) when
   the root itself throws, so it must render its own <html>/<body>. Reports to
   PostHog Error Tracking; the autocaptured window error is the backstop. */

import { useEffect } from 'react'
import { captureError } from '@/lib/analytics'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    captureError(error, { boundary: 'global', digest: error.digest })
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 18,
          padding: '80px 24px',
          textAlign: 'center',
          background: '#12100f',
          color: '#f5f2ec',
          fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
        }}
      >
        <p style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: 11, opacity: 0.5, margin: 0 }}>
          Something went wrong
        </p>
        <h1 style={{ fontWeight: 400, fontSize: 'clamp(28px, 5vw, 44px)', margin: 0 }}>
          The site hit a snag.
        </h1>
        <button
          type="button"
          onClick={() => reset()}
          style={{ marginTop: 6, fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', padding: '12px 22px', borderRadius: 999, border: '1px solid #f5f2ec', background: 'transparent', color: '#f5f2ec', cursor: 'pointer' }}
        >
          Reload
        </button>
      </body>
    </html>
  )
}
