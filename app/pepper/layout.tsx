import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { comingSoonMetadata, guardComingSoon } from '@/lib/coming-soon'

export const metadata: Metadata = {
  /* Root layout's title.template appends '— Aura'; the suffix here
     produced double-up titles in the rendered head. Bare string only. */
  title: 'Pepper — Malabar Black Gold',
  description:
    'Single-estate Malabar black pepper climbing the areca. Black, white, and green — water-retted and experimentally anaerobic. Grown in the Western Ghats biosphere.',
  openGraph: {
    title: 'Pepper — Malabar Black Gold',
    description:
      'Three processing styles, one appellation. The vine remembers every year.',
    type: 'article',
    images: [{ url: '/aura-pepper.jpg', width: 1600, height: 900, alt: 'Aura pepper — Malabar black gold climbing the areca' }],
  },
  twitter: { card: 'summary_large_image', images: ['/aura-pepper.jpg'] },
  ...comingSoonMetadata,
}

export default function PepperLayout({ children }: { children: ReactNode }) {
  guardComingSoon()
  return children
}
