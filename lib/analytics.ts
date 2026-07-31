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
