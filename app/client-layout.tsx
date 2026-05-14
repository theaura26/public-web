'use client'

import { ReactNode } from 'react'
import { ModeProvider } from '@/components/ModeProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ModeProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
      {/* Page-level bottom blur vignette — fixed to the viewport bottom,
          sits above the page content but below the nav/modals. Pure
          backdrop-filter with a feathering mask; no painted background,
          so it carries no colour bias in either theme. */}
      <div className="page-vignette" aria-hidden />
      <style jsx global>{`
        .page-vignette {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          /* Lower 10 % of the viewport (top: 90%, bottom: 0) so the
             band scales with screen height rather than locking to a
             fixed pixel value. The mask keeps the blur solid for the
             lower 85 % of that band and feathers over the top 15 %
             so the upper edge reads as a soft horizon. */
          top: 90%;
          pointer-events: none;
          z-index: 40;
          isolation: isolate;
          backdrop-filter: blur(20px) saturate(1.05);
          -webkit-backdrop-filter: blur(20px) saturate(1.05);
          -webkit-mask-image: linear-gradient(to top,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 1) 85%,
            rgba(0, 0, 0, 0) 100%
          );
          mask-image: linear-gradient(to top,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 1) 85%,
            rgba(0, 0, 0, 0) 100%
          );
        }
        /* Hidden in agent mode — the plain-text view doesn't need
           visual chrome and backdrop-filter is wasted overhead there. */
        [data-view="agent"] .page-vignette {
          display: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .page-vignette {
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
          }
        }
      `}</style>
    </ModeProvider>
  )
}
