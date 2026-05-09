import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Artist Residency — Aura',
  description:
    'For monastic polymaths. For crazy misfits. Embedded two-week residencies in India and Japan — design, craft, gurukul, labs, gallery.',
  openGraph: {
    title: 'Artist Residency — Aura',
    description:
      'Rebel with a cause, grounded in ancestral knowledge, packaged with edge. Two weeks minimum. Pre-selected. Email residency@theaura.life.',
    type: 'article',
  },
}

export default function ResidencyLayout({ children }: { children: ReactNode }) {
  return children
}
