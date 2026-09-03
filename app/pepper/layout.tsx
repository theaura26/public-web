import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { guardComingSoon } from '@/lib/coming-soon'

/* Parked. The page is written and renders in full; it is out of
   circulation — no menu card, no field-note category, no sitemap entry —
   so robots are told to skip it while it waits. See PARKED_JOURNALS in
   lib/journals.ts for how to put it back. */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  /* Root layout's title.template appends '— Aura'; the suffix here
     produced double-up titles in the rendered head. Bare string only. */
  title: 'Pepper — Malabar Black Gold',
  description:
    'Single-estate Malabar black pepper climbing the areca. Black, white, and green — water-retted and experimentally anaerobic. Grown in the Western Ghats biosphere.',
  alternates: { canonical: '/pepper' },
  openGraph: {
    title: 'Malabar Pepper',
    description:
      'Three processing styles, one appellation — black, white, and green, grown up the areca and processed on the estate.',
    type: 'article',
    images: [{ url: '/aura-pepper.jpg', width: 1600, height: 900, alt: 'Aura pepper — Malabar pepper climbing the areca' }],
  },
  twitter: { card: 'summary_large_image', images: ['/aura-pepper.jpg'] },
}

export default function PepperLayout({ children }: { children: ReactNode }) {
  /* Unpublished. 404s in every deployed environment — production and
     Vercel preview — while staying reachable under `next dev`, so the page
     can keep being worked on. Delete this call to publish it. */
  guardComingSoon()

  return children
}
