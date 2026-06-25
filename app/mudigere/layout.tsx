import type { Metadata } from 'next'
import type { ReactNode } from 'react'

/* Duplicate of /mudigere-estate, scaffolded as a starting base for a
   new /mudigere page. Edit the copy / structure freely — this is a
   working draft. The canonical, title, and OG metadata below have
   been retargeted to /mudigere so dev-mode SEO checks don't flag a
   collision with the briefing page. */
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
