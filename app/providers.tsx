'use client'

/* ── PostHog analytics — "post-hoc" instrumentation ──────────────────
   Autocapture records every pageview and interaction across the whole
   site, so behaviour can be analysed retroactively (funnels, paths,
   retention) without pre-defining metrics.

   Tracking mode: FULLEST (cookie-based identity) — stable IDs across
   sessions give accurate unique visitors, returning users, and retention.
   Session replay (all inputs masked) and error tracking (exception
   autocapture) are on. Data is kept in the EU (NEXT_PUBLIC_POSTHOG_HOST);
   events are proxied first-party through /ingest (see next.config.ts).

   ⚠ COMPLIANCE: cookie tracking + session replay of EU visitors needs consent
   under GDPR/ePrivacy. To gate it, init with `disable_session_recording: true`
   (and/or `opt_out_capturing_by_default: true`) and call
   `posthog.startSessionRecording()` / `posthog.opt_in_capturing()` once the
   visitor accepts. A consent banner is still a follow-up. */

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, type ReactNode } from 'react'

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com'

/* Enabled only on a production build with a key set. NODE_ENV is a build-time
   constant, identical on server and client, so gating the render on it can't
   cause a hydration mismatch — and local `next dev` (NODE_ENV=development) or
   any test runner never initialises, so their traffic can't pollute the
   project. */
const ENABLED = !!KEY && process.env.NODE_ENV === 'production'

/* Initialise ONCE, at module load on the client — before React runs any effect.
   (Child effects run before parent effects, so an init inside the provider's own
   effect would fire AFTER the first $pageview and drop it.) The `__loaded` guard
   keeps it idempotent across Fast Refresh / re-imports. */
if (
  ENABLED &&
  typeof window !== 'undefined' &&
  !(posthog as unknown as { __loaded?: boolean }).__loaded
) {
  posthog.init(KEY as string, {
    api_host: '/ingest',                        // first-party proxy → PostHog
    ui_host: HOST,                              // so toolbar/links resolve
    capture_pageview: false,                    // App Router: captured manually below
    autocapture: true,                          // every click/input site-wide
    /* localStorage only — no cookie is written. Worth being precise
       about what that does and does not buy: the visitor is still
       recognised across sessions, because localStorage persists exactly
       like the cookie did. Under UK/EU rules storage on a reader's
       device is treated the same whichever bucket it lives in, so this
       removes cookies without removing the consent question. Dropping
       that too means persistence: 'memory' and person_profiles: 'never',
       which costs returning-visitor analytics entirely. */
    persistence: 'localStorage',
    person_profiles: 'always',                  // profile every visitor
    capture_exceptions: true,                   // error tracking: unhandled exceptions
    session_recording: { maskAllInputs: true }, // replay with all form values masked
  })
}

export function Analytics({ children }: { children: ReactNode }) {
  if (!ENABLED) return <>{children}</>
  return (
    <PostHogProvider client={posthog}>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
      {children}
    </PostHogProvider>
  )
}

/* App Router fires no navigation event the classic snippet can hear, so we
   capture $pageview on pathname / search change ourselves. `useSearchParams`
   forces the Suspense boundary. Each pageview is tagged with the current view
   mode (human vs agent/reader) for segmentation. Runs only under the provider,
   so PostHog is always initialised by the time this fires. */
function PageviewTracker() {
  const pathname = usePathname()
  const search = useSearchParams()

  useEffect(() => {
    if (!pathname) return
    const mode = document.querySelector('[data-view]')?.getAttribute('data-view') ?? 'human'
    const qs = search?.toString()
    posthog.capture('$pageview', {
      $current_url: window.location.origin + pathname + (qs ? `?${qs}` : ''),
      view_mode: mode,
    })
  }, [pathname, search])

  return null
}
