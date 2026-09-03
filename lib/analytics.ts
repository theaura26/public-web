import posthog from 'posthog-js'

/* Guarded custom-event helper for PostHog.

   Autocapture already records pageviews and clicks, so this is only for the
   handful of *semantic* events worth naming (film plays, CTA clicks, read
   depth) — the ones that make post-hoc analysis richer than raw clicks.

   No-ops until NEXT_PUBLIC_POSTHOG_KEY is set, so calling `track(...)`
   anywhere is safe whether or not analytics is switched on. */
export function track(event: string, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return
  posthog.capture(event, properties)
}

/* Identify the person behind the anonymous session once we actually learn who
   they are. This site has no login, so the ONLY resolution point is the contact
   form: we key identity to the submitted email and attach the traits they gave.
   PostHog merges the prior anonymous events into this identified person. Guarded
   like track(), so it’s a no-op until analytics is switched on. */
export function identify(distinctId: string, traits?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return
  if (!distinctId) return
  posthog.identify(distinctId, traits)
}

/* Report a caught error to PostHog Error Tracking. `capture_exceptions` already
   autocaptures unhandled window errors + promise rejections; this is for React
   render errors caught by an error boundary, which don’t reach window.onerror.
   Guarded on __loaded so it only fires when PostHog is actually initialised. */
export function captureError(error: unknown, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  if (!(posthog as unknown as { __loaded?: boolean }).__loaded) return
  posthog.captureException(error, properties)
}
