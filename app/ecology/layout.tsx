import type { Metadata } from 'next'
import type { ReactNode } from 'react'

/* Page-specific metadata layout — /ecology/page.tsx composes the
   article kit; this layout carries the title/description so the journal
   is distinct in search and when shared. */
export const metadata: Metadata = {
  title: 'The Health Index',
  description:
    'Aura reads its estate as one living system — canopy to root, dead wood to fungus to earthworm — and folds fifteen ecological monitoring programmes into a single Ecological Health Index for each block. Regeneration measured, not assumed.',
  alternates: { canonical: '/ecology' },
  openGraph: {
    title: 'The Health Index — Aura',
    description:
      'The whole farm, read and measured — retained wood and the fungi that eat it, forest islands, soil respiration, and one Ecological Health Index per block.',
    type: 'article',
    images: [{ url: '/aura-mudigere-landscape.jpg', width: 1600, height: 900, alt: 'Aura — the estate as a living system, measured' }],
  },
  twitter: { card: 'summary_large_image', images: ['/aura-mudigere-landscape.jpg'] },
}

export default function EcologyLayout({ children }: { children: ReactNode }) {
  return children
}
