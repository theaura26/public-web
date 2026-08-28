'use client'

/* Route-segment error boundary.
 *
 * It wears the 404's clothes on purpose. A reader who hits this has had
 * something go wrong, and the last thing that helps is a page that also
 * looks broken — a serif alarm, a lone Try Again, no way onward. This is
 * the same shape as not-found: a quiet label, one plain sentence, and
 * three real places to go, of which retrying is only the first.
 *
 * React render errors caught here do not reach window.onerror, so
 * `capture_exceptions` autocapture misses them — they are reported to
 * PostHog Error Tracking explicitly.
 */

import { useEffect } from 'react'
import Link from 'next/link'
import Reveal from '@/components/RevealOnScroll'
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
    <div>
      <section style={{ paddingTop: 250, paddingBottom: 80 }}>
        <div className="section-w">
          <Reveal>
            <p className="label" style={{ marginBottom: 24 }}>Something went wrong</p>
          </Reveal>
          <Reveal delay={60}>
            <h1 style={{ maxWidth: 760 }}>This page did not load.</h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="p1" style={{ maxWidth: 480, marginTop: 32 }}>
              It has been logged and someone will see it. The land is still in the same
              place — try again, or walk back into it another way.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ padding: 'var(--section-gap) 0', borderTop: '1px solid var(--border)' }}>
        <div className="section-w">
          <Reveal>
            <p className="label" style={{ marginBottom: 'clamp(32px, 5vh, 56px)' }}>WHERE TO GO</p>
          </Reveal>
          <div className="nf-routes">
            <Reveal delay={80}>
              {/* A button rather than a link: this one re-renders the
                  segment that failed instead of navigating. */}
              <button type="button" onClick={reset} className="nf-route no-underline">
                <div className="nf-route__row">
                  <p className="p1 nf-route__label">Try again</p>
                  <span aria-hidden className="nf-route__arrow">→</span>
                </div>
                <p className="p1 nf-route__desc">Often it is a moment&rsquo;s trouble and nothing more.</p>
              </button>
            </Reveal>
            <Reveal delay={140}>
              <Link href="/" className="nf-route no-underline">
                <div className="nf-route__row">
                  <p className="p1 nf-route__label">Return home</p>
                  <span aria-hidden className="nf-route__arrow">→</span>
                </div>
                <p className="p1 nf-route__desc">The orchard, the workshop, the kitchen — all still here.</p>
              </Link>
            </Reveal>
            <Reveal delay={200}>
              <Link href="/contact" className="nf-route no-underline">
                <div className="nf-route__row">
                  <p className="p1 nf-route__label">Get in touch</p>
                  <span aria-hidden className="nf-route__arrow">→</span>
                </div>
                <p className="p1 nf-route__desc">A page can fail. A conversation cannot.</p>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .nf-routes { display: grid; grid-template-columns: 1fr; }
        .nf-route {
          display: block; width: 100%;
          padding: clamp(20px, 3vh, 28px) 0;
          border-top: 1px solid var(--border);
          color: var(--text);
          background: none; border-left: 0; border-right: 0; border-bottom: 0;
          text-align: left; font: inherit; cursor: pointer;
          transition: opacity 0.3s ease;
        }
        .nf-route:last-child { border-bottom: 1px solid var(--border); }
        .nf-route__row {
          display: flex; align-items: baseline; justify-content: space-between;
          gap: var(--space-5);
        }
        .nf-route__desc { color: var(--text-body); margin-top: 8px; }
        .nf-route:hover { opacity: 0.6; }
      `}</style>
    </div>
  )
}
