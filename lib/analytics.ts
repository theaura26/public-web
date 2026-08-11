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
   like track(), so it's a no-op until analytics is switched on. */
export function identify(distinctId: string, traits?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return
  if (!distinctId) return
  posthog.identify(distinctId, traits)
}
