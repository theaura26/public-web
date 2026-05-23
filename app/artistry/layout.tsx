import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { comingSoonMetadata, guardComingSoon } from '@/lib/coming-soon'

/* Page-specific metadata layout — /artistry/page.tsx is a client
   component ('use client'), so it can't export `metadata` itself.
   Without this layout the page inherited the root layout's default
   title ('Aura — The 1000-Year Idea'), making it invisible in
   search results and indistinguishable from the home page. */
export const metadata: Metadata = {
  title: 'Artistry — Code meets clay',
  description:
    'Studios, residency, labs, and gatherings. The artistry pillar of Aura — where the work of the land argues for a different pace through what it makes.',
  alternates: { canonical: '/artistry' },
  openGraph: {
    title: 'Artistry — Code meets clay',
    description:
      'Studios, residency, labs, and gatherings on the Aura estate. Monastic polymaths working across craft and code.',
    type: 'article',
    images: [{ url: '/aura-artistry.jpg', width: 1600, height: 900, alt: 'Aura artistry — studios, residency, and gatherings on the estate' }],
  },
  twitter: { card: 'summary_large_image', images: ['/aura-artistry.jpg'] },
  ...comingSoonMetadata,
}

export default function ArtistryLayout({ children }: { children: ReactNode }) {
  guardComingSoon()
  return children
}
