import type { Metadata } from 'next'
import type { ReactNode } from 'react'

/* Standalone, unlisted page. Not in the navbar, not in the sitemap,
   not in ACTIVE_JOURNALS. Reachable only by direct URL. Robots are
   told to skip it both here (page-level meta) and in app/robots.ts
   (site-wide disallow). */
export const metadata: Metadata = {
  /* Root layout applies `%s — Aura` as the title template, so this
     bare string becomes "Mudigere Estate — Aura" in the tab. */
  title: 'Mudigere Estate',
  description:
    '150 acres at 3,600ft in the Western Ghats. Coffee, tea, cattle, native canopy, and biodiversity. A private briefing for architects and landscape designers.',
  alternates: { canonical: 'https://theaura.life/mudigere-estate' },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    type: 'article',
    title: 'Mudigere Estate — Aura',
    description:
      '150 acres at 3,600ft in the Western Ghats. A private briefing for architects and landscape designers.',
    images: ['/journals/land/aura-mudigere-mountains.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mudigere Estate — Aura',
    description:
      '150 acres at 3,600ft in the Western Ghats. A private briefing for architects and landscape designers.',
    images: ['/journals/land/aura-mudigere-mountains.jpg'],
  },
}

export default function MudigereLayout({ children }: { children: ReactNode }) {
  return children
}
