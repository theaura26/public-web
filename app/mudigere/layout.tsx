import type { Metadata } from 'next'
import type { ReactNode } from 'react'

/* The canonical architect's-briefing page. /mudigere-estate was the
   original version this superseded — it now redirects here
   (next.config.ts) and its route files are unused. */
export const metadata: Metadata = {
  title: 'Mudigere',
  description:
    '150 acres at 3,600ft in the Western Ghats. Coffee, tea, cattle, native canopy, and biodiversity.',
  alternates: { canonical: 'https://theaura.life/mudigere' },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
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
