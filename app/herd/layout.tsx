import type { Metadata } from 'next'
import type { ReactNode } from 'react'

/* Page-specific metadata layout — /herd/page.tsx composes the article
   kit; this layout carries the title/description so the journal is
   distinct in search and when shared. */
export const metadata: Metadata = {
  title: 'Ecosystem Engineers',
  description:
    'Not livestock — infrastructure. Why a grazing herd, moved and rested, is one of the oldest ecosystem engineers on Earth, and why Aura keeps cattle to maintain the intelligence of the land. Evidence-backed; honest about what the science does not yet know.',
  alternates: { canonical: '/herd' },
  openGraph: {
    title: 'The Oldest Engineer — Aura',
    description:
      'Why a grazing herd is one of the oldest ecosystem engineers on Earth — from the dung pat to the nutrient pump.',
    type: 'article',
    images: [{ url: '/aura-land.jpg', width: 1600, height: 900, alt: 'Aura — cattle as ecosystem engineers' }],
  },
  twitter: { card: 'summary_large_image', images: ['/aura-land.jpg'] },
}

export default function HerdLayout({ children }: { children: ReactNode }) {
  return children
}
