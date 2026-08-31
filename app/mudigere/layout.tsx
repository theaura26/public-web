import type { Metadata } from 'next'
import type { ReactNode } from 'react'

/* /mudigere — the public flagship estate page (indexed, in the sitemap).
   Intentionally separate from /mudigere-estate, the architect’s-briefing
   page kept for a different audience (noindex, direct URL only). Neither
   page redirects to the other. */
export const metadata: Metadata = {
  title: 'Mudigere',
  description:
    '150 acres at 3,600ft in the Western Ghats. Coffee, tea, cattle, native canopy, and biodiversity.',
  alternates: { canonical: 'https://theaura.life/mudigere' },
  openGraph: {
    type: 'article',
    title: 'Mudigere — Aura',
    description:
      '150 acres at 3,600ft in the Western Ghats.',
    images: ['/journals/land/aura-mudigere-mountains.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mudigere — Aura',
    description:
      '150 acres at 3,600ft in the Western Ghats.',
    images: ['/journals/land/aura-mudigere-mountains.jpg'],
  },
}

export default function MudigereLayout({ children }: { children: ReactNode }) {
  return children
}
