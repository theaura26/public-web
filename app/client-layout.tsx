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
          /* Slim 100 px band at the very bottom of the viewport. Enough
             to give the page a soft horizon line without intruding on
             readable content above. */
          height: 100px;
          pointer-events: none;
          z-index: 40;
          isolation: isolate;
          backdrop-filter: blur(20px) saturate(1.05);
          -webkit-backdrop-filter: blur(20px) saturate(1.05);
          -webkit-mask-image: linear-gradient(to top,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 1) 50%,
            rgba(0, 0, 0, 0) 100%
          );
          mask-image: linear-gradient(to top,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 1) 50%,
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
