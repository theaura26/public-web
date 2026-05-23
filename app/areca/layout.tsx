import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { comingSoonMetadata, guardComingSoon } from '@/lib/coming-soon'

export const metadata: Metadata = {
  /* Root layout's title.template appends '— Aura'; suffix removed to
     avoid 'Areca — The Sentinel Palm — Aura — Aura' double-up. */
  title: 'Areca — The Sentinel Palm',
  description:
    'Areca catechu as the mid-canopy of the Aura estate. Vertical architecture, five-layer shade system, and the cultural spine of coastal Karnataka.',
  alternates: { canonical: '/areca' },
  openGraph: {
    title: 'Areca — The Sentinel Palm',
    description:
      'Everything else grows in its shade. The tree that makes the estate possible.',
    type: 'article',
    images: [{ url: '/aura-areca.jpg', width: 1600, height: 900, alt: 'Aura areca — the sentinel palm, mid-canopy of the estate' }],
  },
  twitter: { card: 'summary_large_image', images: ['/aura-areca.jpg'] },
  ...comingSoonMetadata,
}

export default function ArecaLayout({ children }: { children: ReactNode }) {
  guardComingSoon()
  return children
}
