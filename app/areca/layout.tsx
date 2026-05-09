import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Areca — The Sentinel Palm — Aura',
  description:
    'Areca catechu as the mid-canopy of the Aura estate. Vertical architecture, five-layer shade system, and the cultural spine of coastal Karnataka.',
  openGraph: {
    title: 'Areca — The Sentinel Palm',
    description:
      'Everything else grows in its shade. The tree that makes the estate possible.',
    type: 'article',
  },
}

export default function ArecaLayout({ children }: { children: ReactNode }) {
  return children
}
