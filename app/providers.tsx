'use client'

/* ── PostHog analytics — "post-hoc" instrumentation ──────────────────
   Autocapture records every pageview and interaction, so behaviour can be
   analysed retroactively (funnels, paths, retention) without pre-defining
   metrics. Privacy-forward defaults for the Aura brand:
     • cookieless   — persistence: 'memory' (nothing stored on the device)
     • no profiles  — person_profiles: 'identified_only' (anon stays anon)
     • EU residency — via NEXT_PUBLIC_POSTHOG_HOST
     • first-party  — events proxied through /ingest (see next.config.ts),
                      so ad-blockers don't drop ~a third of the data
   The whole layer no-ops until NEXT_PUBLIC_POSTHOG_KEY is set, so the site
   runs unchanged before the key is added. */

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, type ReactNode } from 'react'

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com'

export function Analytics({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!KEY || typeof window === 'undefined') return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((posthog as any).__loaded) return
    posthog.init(KEY, {
      api_host: '/ingest',                 // first-party proxy → PostHog
      ui_host: HOST,                       // so toolbar/links resolve
      capture_pageview: false,             // App Router: captured manually below
      autocapture: true,                   // the post-hoc engine
      persistence: 'memory',               // cookieless — no device storage
      person_profiles: 'identified_only',  // anonymous events create no profile
    })
  }, [])

  // Nothing mounts (no provider, no tracker) until a key exists.
  if (!KEY) return <>{children}</>

  return (
    <PostHogProvider client={posthog}>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
      {children}
    </PostHogProvider>
  )
}

/* App Router fires no navigation event the classic analytics snippet can
   hear, so we capture $pageview on pathname / search change ourselves.
   `useSearchParams` forces this into a Suspense boundary. Every pageview is
   tagged with the current view mode (human vs agent/reader) so the two
   audiences can be segmented apart in analysis. */
function PageviewTracker() {
  const pathname = usePathname()
  const search = useSearchParams()

  useEffect(() => {
    if (!KEY || !pathname) return
    const mode = document.querySelector('[data-view]')?.getAttribute('data-view') ?? 'human'
    const qs = search?.toString()
    posthog.capture('$pageview', {
      $current_url: window.location.origin + pathname + (qs ? `?${qs}` : ''),
      view_mode: mode,
    })
  }, [pathname, search])

  return null
}
