import type { Metadata } from 'next'
import { guardComingSoon } from '@/lib/coming-soon'

/* Parked. The page is written and renders in full; it is simply out of
   circulation — no menu card, no field-note category, no sitemap entry —
   so robots are told to skip it while it waits. See PARKED_JOURNALS in
   lib/journals.ts for how to put it back. */
export const metadata: Metadata = {
  title: 'Cows of Aura',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  description: 'An ear tag can fall out and a name is not a record. Every animal carries a number issued once, and a job written down.',
  alternates: { canonical: '/cows-of-aura' },
  openGraph: {
    type: 'article',
    title: 'Cows of Aura — Aura',
    description: 'An ear tag can fall out and a name is not a record. Every animal carries a number issued once, and a job written down.',
    images: [{ url: '/aura-placeholder.svg', width: 1600, height: 900, alt: 'Cows of Aura — Aura' }],
  },
  twitter: { card: 'summary_large_image', images: ['/aura-placeholder.svg'] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  /* Unpublished. 404s in every deployed environment — production and
     Vercel preview — while staying reachable under `next dev`, so the page
     can keep being worked on. Delete this call to publish it. */
  guardComingSoon()

  return children
}
