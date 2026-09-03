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
  /* Root layout's title.template appends '— Aura'; suffix removed to
     prevent double-up. */
  title: 'Vedic Farming — Knowledge Older Than The Rulebook',
  description:
    'Vrikshayurveda in practice. Jeevamrit, Panchgavya, Beejamrit, Kunapjal and Matka Khad — five-cow tonics fermented in clay, made on the estate.',
  alternates: { canonical: '/vedic' },
  openGraph: {
    title: 'Vedic Farming — Knowledge older than the institutions that study it.',
    description:
      'Vrikshayurveda, microbial inoculants, mycorrhizal networks. How Aura builds the land.',
    type: 'article',
    images: [{ url: '/aura-vedic.jpg', width: 1600, height: 900, alt: 'Aura Vedic farming — ancient agricultural science in practice' }],
  },
  twitter: { card: 'summary_large_image', images: ['/aura-vedic.jpg'] },
}

export default function VedicLayout({ children }: { children: ReactNode }) {
  /* Unpublished. 404s in every deployed environment — production and
     Vercel preview — while staying reachable under `next dev`, so the page
     can keep being worked on. Delete this call to publish it. */
  guardComingSoon()

  return children
}
