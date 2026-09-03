'use client'

import { useEffect, useState } from 'react'
import { CONSENT_KEY, startRecording, declineRecording } from '@/app/providers'

/* ── The one question worth asking ──────────────────────────────────
   Analytics and autocapture run on a page somebody chose to load.
   A session replay is a recording of them using it, which is a
   different thing to ask for — so it is the only thing behind this
   banner, and the banner says so rather than saying "we use cookies"
   (this site sets none; the identifier lives in local storage).

   Asked once. The answer is kept in local storage under the same key
   the provider reads at init, so a visitor who said yes is not asked
   again and a visitor who said no is never recorded.

   Rendered only when there is a decision to make: no key, no banner. */
export default function ConsentBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return
    try {
      if (!window.localStorage.getItem(CONSENT_KEY)) setShow(true)
    } catch {
      /* storage blocked — nothing can be remembered, so do not ask */
    }
  }, [])

  if (!show) return null

  return (
    <div className="cb" role="dialog" aria-label="Session recording">
      <p className="cb-t">
        Aura can record how this page is used, with anything you type masked out.
        It helps us see where the site gets in the way.
      </p>
      <div className="cb-a">
        <button
          type="button"
          className="cb-b cb-yes"
          onClick={() => { startRecording(); setShow(false) }}
        >
          Allow
        </button>
        <button
          type="button"
          className="cb-b"
          onClick={() => { declineRecording(); setShow(false) }}
        >
          No thanks
        </button>
      </div>

      <style jsx>{`
        .cb {
          position: fixed;
          left: var(--gutter);
          right: var(--gutter);
          bottom: var(--gutter);
          z-index: 90;
          max-width: 560px;
          margin-left: auto;
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          padding: var(--space-5) var(--space-5) var(--space-4);
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-1);
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
        }
        .cb-t {
          margin: 0;
          font-family: var(--font-sans), sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: var(--text-body);
          max-width: 52ch;
        }
        .cb-a { display: flex; gap: var(--space-5); align-items: center; }
        .cb-b {
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          letter-spacing: 1px;
          text-transform: uppercase;
          background: none;
          border: 0;
          padding: 6px 0;
          cursor: pointer;
          color: var(--text-muted);
        }
        .cb-yes { color: var(--text); }
        .cb-b:hover { color: var(--brand-accent); }
        /* The banner is a decision, not a reading surface: it stays put in
           the plain-text view rather than being flattened into the page. */
        @media (max-width: 560px) {
          .cb { max-width: none; }
        }
      `}</style>
    </div>
  )
}
